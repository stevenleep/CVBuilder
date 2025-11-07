/**
 * 事件总线
 * 
 * 实现增强型事件总线，支持：
 * - 发布-订阅机制
 * - 事件优先级
 * - 事件拦截器
 * - 节流/防抖
 * - 同步/异步发送
 * - 事件过滤
 * 
 * @packageDocumentation
 */

import type {
  IEventBus,
  Event,
  EventListener,
  EventListenerConfig,
  EventInterceptor,
  EmitOptions,
  Disposable,
} from '../protocols/event/EventProtocol'

import {
  createEvent,
  matchEvent,
  throttle,
  debounce,
} from '../protocols/event/EventProtocol'

// ==================== 内部类型 ====================

/**
 * 监听器包装器
 */
interface ListenerWrapper {
  readonly id: string
  readonly listener: EventListener<any>
  readonly config: EventListenerConfig
  readonly wrappedListener: EventListener<any>
}

/**
 * 事件队列项
 */
interface EventQueueItem {
  readonly eventType: string
  readonly payload: unknown
  readonly options?: EmitOptions
  readonly resolve: () => void
  readonly reject: (error: Error) => void
}

// ==================== 事件总线实现 ====================

/**
 * 事件总线实现
 */
export class EventBus implements IEventBus {
  /** 监听器映射 */
  private readonly listeners = new Map<string, ListenerWrapper[]>()
  
  /** 全局监听器 */
  private readonly globalListeners: ListenerWrapper[] = []
  
  /** 拦截器列表 */
  private readonly interceptors: EventInterceptor[] = []
  
  /** 暂停的事件类型 */
  private readonly pausedEvents = new Set<string>()
  
  /** 事件队列 */
  private readonly eventQueue: EventQueueItem[] = []
  
  /** 是否正在处理队列 */
  private processingQueue = false
  
  /** 监听器 ID 计数器 */
  private listenerIdCounter = 0
  
  /** 是否已销毁 */
  private disposed = false
  
  // ==================== 发送事件 ====================
  
  /**
   * 发送事件（异步）
   */
  async emit<TPayload = unknown>(
    eventType: string,
    payload?: TPayload,
    options?: EmitOptions
  ): Promise<void> {
    this.assertNotDisposed()
    
    // 如果是同步发送
    if (options?.sync) {
      this.emitSync(eventType, payload, options)
      return
    }
    
    // 如果有延迟
    if (options?.delay) {
      await new Promise(resolve => setTimeout(resolve, options.delay))
    }
    
    // 添加到队列
    await new Promise<void>((resolve, reject) => {
      this.eventQueue.push({
        eventType,
        payload,
        options,
        resolve,
        reject,
      })
      
      // 处理队列
      this.processQueue()
    })
  }
  
  /**
   * 同步发送事件
   */
  emitSync<TPayload = unknown>(
    eventType: string,
    payload?: TPayload,
    options?: EmitOptions
  ): void {
    this.assertNotDisposed()
    
    // 检查是否暂停
    if (this.pausedEvents.has(eventType) || this.pausedEvents.has('*')) {
      return
    }
    
    // 创建事件实例
    let event = createEvent(eventType, payload as TPayload, options?.source)
    
    // 调用 beforeEmit 拦截器
    for (const interceptor of this.getSortedInterceptors()) {
      if (interceptor.beforeEmit) {
        const context = {
          timestamp: Date.now(),
          source: options?.source || { type: 'system' as const },
          metadata: options?.metadata || {},
        }
        
        const result = interceptor.beforeEmit(eventType, event.payload, context)
        if (result instanceof Promise) {
          throw new Error('Async interceptor not supported in sync emit')
        }
        event = createEvent(eventType, result, options?.source)
      }
    }
    
    // 通知监听器
    this.notifyListeners(event)
    
    // 调用 afterEmit 拦截器
    for (const interceptor of this.getSortedInterceptors()) {
      if (interceptor.afterEmit) {
        const context = {
          timestamp: Date.now(),
          source: options?.source || { type: 'system' as const },
          metadata: options?.metadata || {},
        }
        
        const result = interceptor.afterEmit(eventType, event.payload, context)
        if (result instanceof Promise) {
          // 异步 afterEmit 在后台执行
          result.catch(error => {
            console.error('Error in afterEmit interceptor:', error)
          })
        }
      }
    }
  }
  
  /**
   * 处理事件队列
   */
  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.eventQueue.length === 0) {
      return
    }
    
    this.processingQueue = true
    
    try {
      while (this.eventQueue.length > 0) {
        const item = this.eventQueue.shift()!
        
        try {
          await this.emitInternal(item.eventType, item.payload, item.options)
          item.resolve()
        } catch (error) {
          item.reject(error as Error)
        }
      }
    } finally {
      this.processingQueue = false
    }
  }
  
  /**
   * 内部发送事件（异步）
   */
  private async emitInternal<TPayload = unknown>(
    eventType: string,
    payload?: TPayload,
    options?: EmitOptions
  ): Promise<void> {
    // 检查是否暂停
    if (this.pausedEvents.has(eventType) || this.pausedEvents.has('*')) {
      return
    }
    
    // 创建事件实例
    let event = createEvent(eventType, payload as TPayload, options?.source)
    
    // 调用 beforeEmit 拦截器
    for (const interceptor of this.getSortedInterceptors()) {
      if (interceptor.beforeEmit) {
        const context = {
          timestamp: Date.now(),
          source: options?.source || { type: 'system' as const },
          metadata: options?.metadata || {},
        }
        
        event = createEvent(
          eventType,
          await interceptor.beforeEmit(eventType, event.payload, context),
          options?.source
        )
      }
    }
    
    // 通知监听器
    await this.notifyListenersAsync(event)
    
    // 调用 afterEmit 拦截器
    for (const interceptor of this.getSortedInterceptors()) {
      if (interceptor.afterEmit) {
        const context = {
          timestamp: Date.now(),
          source: options?.source || { type: 'system' as const },
          metadata: options?.metadata || {},
        }
        
        await interceptor.afterEmit(eventType, event.payload, context)
      }
    }
  }
  
  // ==================== 监听事件 ====================
  
  /**
   * 监听事件
   */
  on<TPayload = unknown>(
    eventType: string,
    listener: EventListener<TPayload>,
    config?: EventListenerConfig
  ): Disposable {
    this.assertNotDisposed()
    
    const wrapper = this.createListenerWrapper<TPayload>(listener, config || {})
    
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    
    const listeners = this.listeners.get(eventType)!
    listeners.push(wrapper)
    
    // 按优先级排序
    listeners.sort((a, b) => 
      (b.config.priority || 0) - (a.config.priority || 0)
    )
    
    return {
      dispose: () => this.off(eventType, listener),
    }
  }
  
  /**
   * 监听事件（只触发一次）
   */
  once<TPayload = unknown>(
    eventType: string,
    listener: EventListener<TPayload>,
    config?: EventListenerConfig
  ): Disposable {
    return this.on<TPayload>(eventType, listener, { ...config, once: true })
  }
  
  /**
   * 取消监听
   */
  off(eventType: string, listener?: EventListener<any>): void {
    if (!listener) {
      this.listeners.delete(eventType)
      return
    }
    
    const listeners = this.listeners.get(eventType)
    if (!listeners) return
    
    const index = listeners.findIndex(w => w.listener === listener)
    if (index !== -1) {
      listeners.splice(index, 1)
    }
    
    if (listeners.length === 0) {
      this.listeners.delete(eventType)
    }
  }
  
  /**
   * 监听所有事件
   */
  onAny(listener: EventListener<unknown>): Disposable {
    this.assertNotDisposed()
    
    const wrapper = this.createListenerWrapper<unknown>(listener, {})
    this.globalListeners.push(wrapper)
    
    return {
      dispose: () => {
        const index = this.globalListeners.findIndex(w => w.listener === listener)
        if (index !== -1) {
          this.globalListeners.splice(index, 1)
        }
      },
    }
  }
  
  /**
   * 取消所有监听
   */
  offAll(eventType?: string): void {
    if (eventType) {
      this.listeners.delete(eventType)
    } else {
      this.listeners.clear()
      this.globalListeners.length = 0
    }
  }
  
  // ==================== 拦截器 ====================
  
  /**
   * 添加拦截器
   */
  addInterceptor(interceptor: EventInterceptor): Disposable {
    this.assertNotDisposed()
    
    this.interceptors.push(interceptor)
    
    // 按优先级排序
    this.interceptors.sort((a, b) => 
      (b.priority || 0) - (a.priority || 0)
    )
    
    return {
      dispose: () => this.removeInterceptor(interceptor.name),
    }
  }
  
  /**
   * 移除拦截器
   */
  removeInterceptor(name: string): void {
    const index = this.interceptors.findIndex(i => i.name === name)
    if (index !== -1) {
      this.interceptors.splice(index, 1)
    }
  }
  
  /**
   * 获取排序后的拦截器
   */
  private getSortedInterceptors(): readonly EventInterceptor[] {
    return this.interceptors
  }
  
  // ==================== 查询方法 ====================
  
  /**
   * 检查是否有监听器
   */
  hasListener(eventType: string): boolean {
    const listeners = this.listeners.get(eventType)
    return (listeners && listeners.length > 0) || false
  }
  
  /**
   * 获取监听器数量
   */
  getListenerCount(eventType: string): number {
    const listeners = this.listeners.get(eventType)
    return listeners ? listeners.length : 0
  }
  
  /**
   * 获取所有事件类型
   */
  getEventTypes(): readonly string[] {
    return Array.from(this.listeners.keys())
  }
  
  // ==================== 控制方法 ====================
  
  /**
   * 暂停事件
   */
  pause(eventType?: string): void {
    this.pausedEvents.add(eventType || '*')
  }
  
  /**
   * 恢复事件
   */
  resume(eventType?: string): void {
    this.pausedEvents.delete(eventType || '*')
  }
  
  /**
   * 清空事件队列
   */
  clear(): void {
    this.eventQueue.length = 0
  }
  
  /**
   * 销毁事件总线
   */
  dispose(): void {
    if (this.disposed) return
    
    this.disposed = true
    this.listeners.clear()
    this.globalListeners.length = 0
    this.interceptors.length = 0
    this.pausedEvents.clear()
    this.eventQueue.length = 0
  }
  
  // ==================== 内部方法 ====================
  
  /**
   * 创建监听器包装器
   */
  private createListenerWrapper<TPayload = unknown>(
    listener: EventListener<TPayload>,
    config: EventListenerConfig
  ): ListenerWrapper {
    const id = config.id || `listener-${this.listenerIdCounter++}`
    
    let wrappedListener: EventListener = listener as EventListener
    
    // 应用过滤器
    if (config.filter) {
      const originalListener = wrappedListener
      const filter = config.filter
      wrappedListener = (event) => {
        if (filter(event)) {
          originalListener(event)
        }
      }
    }
    
    // 应用节流
    if (config.throttle) {
      wrappedListener = throttle(wrappedListener, config.throttle)
    }
    
    // 应用防抖
    if (config.debounce) {
      wrappedListener = debounce(wrappedListener, config.debounce)
    }
    
    return {
      id,
      listener,
      config,
      wrappedListener,
    }
  }
  
  /**
   * 通知监听器（同步）
   */
  private notifyListeners(event: Event): void {
    // 获取匹配的监听器
    const listeners = this.getMatchingListeners(event.type)
    
    for (const wrapper of listeners) {
      if (event.isPropagationStopped) break
      
      try {
        // 调用 beforeHandle 拦截器
        let shouldHandle = true
        for (const interceptor of this.getSortedInterceptors()) {
          if (interceptor.beforeHandle) {
            const result = interceptor.beforeHandle(event, wrapper.listener)
            if (result instanceof Promise) {
              throw new Error('Async interceptor not supported in sync notify')
            }
            if (!result) {
              shouldHandle = false
              break
            }
          }
        }
        
        if (!shouldHandle) continue
        
        // 调用监听器
        const result = wrapper.wrappedListener(event)
        if (result instanceof Promise) {
          // 异步监听器在后台执行
          result.catch(error => {
            console.error('Error in async listener:', error)
            
            // 调用 afterHandle 拦截器
            for (const interceptor of this.getSortedInterceptors()) {
              if (interceptor.afterHandle) {
                interceptor.afterHandle(event, wrapper.listener, error)
              }
            }
          })
        }
        
        // 调用 afterHandle 拦截器
        for (const interceptor of this.getSortedInterceptors()) {
          if (interceptor.afterHandle) {
            const result = interceptor.afterHandle(event, wrapper.listener)
            if (result instanceof Promise) {
              result.catch(error => {
                console.error('Error in afterHandle interceptor:', error)
              })
            }
          }
        }
        
        // 如果是 once，移除监听器
        if (wrapper.config.once) {
          this.off(event.type, wrapper.listener)
        }
      } catch (error) {
        console.error('Error in event listener:', error)
        
        // 调用 afterHandle 拦截器
        for (const interceptor of this.getSortedInterceptors()) {
          if (interceptor.afterHandle) {
            interceptor.afterHandle(event, wrapper.listener, error as Error)
          }
        }
      }
    }
  }
  
  /**
   * 通知监听器（异步）
   */
  private async notifyListenersAsync(event: Event): Promise<void> {
    // 获取匹配的监听器
    const listeners = this.getMatchingListeners(event.type)
    
    for (const wrapper of listeners) {
      if (event.isPropagationStopped) break
      
      try {
        // 调用 beforeHandle 拦截器
        let shouldHandle = true
        for (const interceptor of this.getSortedInterceptors()) {
          if (interceptor.beforeHandle) {
            const result = await interceptor.beforeHandle(event, wrapper.listener)
            if (!result) {
              shouldHandle = false
              break
            }
          }
        }
        
        if (!shouldHandle) continue
        
        // 调用监听器
        await wrapper.wrappedListener(event)
        
        // 调用 afterHandle 拦截器
        for (const interceptor of this.getSortedInterceptors()) {
          if (interceptor.afterHandle) {
            await interceptor.afterHandle(event, wrapper.listener)
          }
        }
        
        // 如果是 once，移除监听器
        if (wrapper.config.once) {
          this.off(event.type, wrapper.listener)
        }
      } catch (error) {
        console.error('Error in event listener:', error)
        
        // 调用 afterHandle 拦截器
        for (const interceptor of this.getSortedInterceptors()) {
          if (interceptor.afterHandle) {
            await interceptor.afterHandle(event, wrapper.listener, error as Error)
          }
        }
      }
    }
  }
  
  /**
   * 获取匹配的监听器
   */
  private getMatchingListeners(eventType: string): ListenerWrapper[] {
    const result: ListenerWrapper[] = []
    
    // 添加精确匹配的监听器
    const exact = this.listeners.get(eventType)
    if (exact) {
      result.push(...exact)
    }
    
    // 添加通配符监听器
    for (const [pattern, listeners] of this.listeners) {
      if (pattern !== eventType && matchEvent(pattern, eventType)) {
        result.push(...listeners)
      }
    }
    
    // 添加全局监听器
    result.push(...this.globalListeners)
    
    // 按优先级排序
    result.sort((a, b) => 
      (b.config.priority || 0) - (a.config.priority || 0)
    )
    
    return result
  }
  
  /**
   * 断言未销毁
   */
  private assertNotDisposed(): void {
    if (this.disposed) {
      throw new Error('EventBus has been disposed')
    }
  }
}

// ==================== 导出 ====================

/**
 * 创建事件总线
 */
export function createEventBus(): IEventBus {
  return new EventBus()
}

/**
 * 全局事件总线实例（可选）
 */
let globalEventBus: IEventBus | null = null

/**
 * 获取全局事件总线
 */
export function getGlobalEventBus(): IEventBus {
  if (!globalEventBus) {
    globalEventBus = createEventBus()
  }
  return globalEventBus
}

/**
 * 设置全局事件总线
 */
export function setGlobalEventBus(eventBus: IEventBus): void {
  globalEventBus = eventBus
}

/**
 * 重置全局事件总线
 */
export function resetGlobalEventBus(): void {
  if (globalEventBus) {
    globalEventBus.dispose()
    globalEventBus = null
  }
}

