/**
 * 事件总线实现（增强版）
 *
 * 提供发布订阅模式的事件系统
 * 支持：异步事件、优先级、节流/防抖、错误处理、事件历史
 */

import {
  IEventBus,
  EventHandler,
  IEventSubscription,
  IEventInterceptor,
  IEventData,
} from '../protocols/IEventProtocol'

interface PriorityHandler {
  handler: EventHandler
  priority: number
}

interface DebounceConfig {
  delay: number
  timerId?: NodeJS.Timeout
}

interface ThrottleConfig {
  delay: number
  lastTime: number
}

export class EventBus implements IEventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map()
  private priorityListeners: Map<string, PriorityHandler[]> = new Map()
  private interceptors: IEventInterceptor[] = []
  private eventHistory: IEventData[] = []
  private maxHistorySize: number = 100
  private debounceMap: Map<string, DebounceConfig> = new Map()
  private throttleMap: Map<string, ThrottleConfig> = new Map()
  private errorHandlers: Set<(error: Error, event: string, handler: EventHandler) => void> =
    new Set()

  /**
   * 发送事件
   */
  public emit<T = any>(event: string, data?: T): void {
    const eventData: IEventData = {
      type: event,
      payload: data,
      timestamp: Date.now(),
    }

    // 记录历史
    this.addToHistory(eventData)

    // 通过拦截器处理
    let processedEvent: IEventData | null = eventData
    for (const interceptor of this.getSortedInterceptors()) {
      processedEvent = interceptor.intercept(processedEvent)
      if (!processedEvent) {
        // 事件被拦截，不继续传播
        return
      }
    }

    // 触发事件处理器（按优先级）
    this.triggerHandlers(event, processedEvent)

    // 触发通配符监听器
    const wildcardHandlers = this.listeners.get('*')
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => {
        this.safeExecute(handler, processedEvent, event)
      })
    }
  }

  /**
   * 异步发送事件
   */
  public async emitAsync<T = any>(event: string, data?: T): Promise<void> {
    const eventData: IEventData = {
      type: event,
      payload: data,
      timestamp: Date.now(),
    }

    // 记录历史
    this.addToHistory(eventData)

    // 通过拦截器处理
    let processedEvent: IEventData | null = eventData
    for (const interceptor of this.getSortedInterceptors()) {
      processedEvent = interceptor.intercept(processedEvent)
      if (!processedEvent) {
        return
      }
    }

    // 按优先级触发处理器（异步）
    await this.triggerHandlersAsync(event, processedEvent)

    // 触发通配符监听器（异步）
    const wildcardHandlers = this.listeners.get('*')
    if (wildcardHandlers) {
      await Promise.all(
        Array.from(wildcardHandlers).map(handler =>
          this.safeExecuteAsync(handler, processedEvent, event)
        )
      )
    }
  }

  /**
   * 订阅事件
   */
  public on<T = any>(event: string, handler: EventHandler<T>): IEventSubscription {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }

    this.listeners.get(event)!.add(handler as EventHandler)

    return {
      unsubscribe: () => this.off(event, handler),
    }
  }

  /**
   * 订阅一次性事件
   */
  public once<T = any>(event: string, handler: EventHandler<T>): IEventSubscription {
    const wrappedHandler = (data: T) => {
      handler(data)
      this.off(event, wrappedHandler)
    }

    return this.on(event, wrappedHandler)
  }

  /**
   * 取消订阅
   */
  public off(event: string, handler?: EventHandler): void {
    if (!handler) {
      // 如果没有指定handler，移除该事件的所有监听器
      this.listeners.delete(event)
      return
    }

    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  /**
   * 清除所有订阅
   */
  public clear(): void {
    this.listeners.clear()
  }

  /**
   * 获取订阅数量
   */
  public getListenerCount(event: string): number {
    return this.listeners.get(event)?.size || 0
  }

  /**
   * 注册拦截器
   */
  public addInterceptor(interceptor: IEventInterceptor): void {
    this.interceptors.push(interceptor)
    // 按优先级排序
    this.interceptors.sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  /**
   * 移除拦截器
   */
  public removeInterceptor(name: string): void {
    this.interceptors = this.interceptors.filter(i => i.name !== name)
  }

  /**
   * 获取排序后的拦截器
   */
  private getSortedInterceptors(): IEventInterceptor[] {
    return this.interceptors
  }

  /**
   * 带优先级的订阅
   */
  public onWithPriority<T = any>(
    event: string,
    handler: EventHandler<T>,
    priority: number
  ): IEventSubscription {
    if (!this.priorityListeners.has(event)) {
      this.priorityListeners.set(event, [])
    }

    const handlers = this.priorityListeners.get(event)!
    handlers.push({ handler: handler as EventHandler, priority })
    handlers.sort((a, b) => b.priority - a.priority)

    return {
      unsubscribe: () => {
        const index = handlers.findIndex(h => h.handler === handler)
        if (index !== -1) {
          handlers.splice(index, 1)
        }
      },
    }
  }

  /**
   * 节流订阅
   */
  public throttle<T = any>(
    event: string,
    handler: EventHandler<T>,
    delay: number
  ): IEventSubscription {
    const throttleKey = `${event}:${Math.random()}`
    this.throttleMap.set(throttleKey, { delay, lastTime: 0 })

    const throttledHandler = (data: T) => {
      const config = this.throttleMap.get(throttleKey)!
      const now = Date.now()

      if (now - config.lastTime >= config.delay) {
        config.lastTime = now
        handler(data)
      }
    }

    const subscription = this.on(event, throttledHandler)

    return {
      unsubscribe: () => {
        this.throttleMap.delete(throttleKey)
        subscription.unsubscribe()
      },
    }
  }

  /**
   * 防抖订阅
   */
  public debounce<T = any>(
    event: string,
    handler: EventHandler<T>,
    delay: number
  ): IEventSubscription {
    const debounceKey = `${event}:${Math.random()}`
    this.debounceMap.set(debounceKey, { delay })

    const debouncedHandler = (data: T) => {
      const config = this.debounceMap.get(debounceKey)!

      if (config.timerId) {
        clearTimeout(config.timerId)
      }

      config.timerId = setTimeout(() => {
        handler(data)
        config.timerId = undefined
      }, config.delay)
    }

    const subscription = this.on(event, debouncedHandler)

    return {
      unsubscribe: () => {
        const config = this.debounceMap.get(debounceKey)
        if (config?.timerId) {
          clearTimeout(config.timerId)
        }
        this.debounceMap.delete(debounceKey)
        subscription.unsubscribe()
      },
    }
  }

  /**
   * 获取事件历史
   */
  public getEventHistory(limit?: number): IEventData[] {
    if (limit) {
      return this.eventHistory.slice(-limit)
    }
    return [...this.eventHistory]
  }

  /**
   * 事件重放
   */
  public replay(events: IEventData[]): void {
    events.forEach(event => {
      this.emit(event.type, event.payload)
    })
  }

  /**
   * 设置历史记录大小
   */
  public setMaxHistorySize(size: number): void {
    this.maxHistorySize = size
    if (this.eventHistory.length > size) {
      this.eventHistory = this.eventHistory.slice(-size)
    }
  }

  /**
   * 添加错误处理器
   */
  public onError(
    handler: (error: Error, event: string, eventHandler: EventHandler) => void
  ): () => void {
    this.errorHandlers.add(handler)
    return () => {
      this.errorHandlers.delete(handler)
    }
  }

  /**
   * 添加到历史记录
   */
  private addToHistory(event: IEventData): void {
    this.eventHistory.push(event)
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift()
    }
  }

  /**
   * 触发处理器
   */
  private triggerHandlers(event: string, eventData: IEventData | null): void {
    // 优先级处理器
    const priorityHandlers = this.priorityListeners.get(event)
    if (priorityHandlers) {
      priorityHandlers.forEach(({ handler }) => {
        this.safeExecute(handler, eventData, event)
      })
    }

    // 普通处理器
    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.forEach(handler => {
        this.safeExecute(handler, eventData, event)
      })
    }
  }

  /**
   * 异步触发处理器
   */
  private async triggerHandlersAsync(event: string, eventData: IEventData | null): Promise<void> {
    // 优先级处理器（异步串行）
    const priorityHandlers = this.priorityListeners.get(event)
    if (priorityHandlers) {
      for (const { handler } of priorityHandlers) {
        await this.safeExecuteAsync(handler, eventData, event)
      }
    }

    // 普通处理器（异步并行）
    const handlers = this.listeners.get(event)
    if (handlers) {
      await Promise.all(
        Array.from(handlers).map(handler => this.safeExecuteAsync(handler, eventData, event))
      )
    }
  }

  /**
   * 安全执行处理器
   */
  private safeExecute(handler: EventHandler, eventData: IEventData | null, event: string): void {
    try {
      handler(eventData!.payload)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      console.error(`[EventBus] Error in handler for event "${event}":`, err)

      // 触发错误处理器
      this.errorHandlers.forEach(errorHandler => {
        try {
          errorHandler(err, event, handler)
        } catch (e) {
          console.error('[EventBus] Error in error handler:', e)
        }
      })

      // 发送错误事件
      if (event !== 'error') {
        this.emit('error', {
          event,
          handler,
          error: err,
          timestamp: Date.now(),
        })
      }
    }
  }

  /**
   * 安全异步执行处理器
   */
  private async safeExecuteAsync(
    handler: EventHandler,
    eventData: IEventData | null,
    event: string
  ): Promise<void> {
    try {
      await handler(eventData!.payload)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      console.error(`[EventBus] Error in async handler for event "${event}":`, err)

      // 触发错误处理器
      this.errorHandlers.forEach(errorHandler => {
        try {
          errorHandler(err, event, handler)
        } catch (e) {
          console.error('[EventBus] Error in error handler:', e)
        }
      })

      // 发送错误事件
      if (event !== 'error') {
        this.emit('error', {
          event,
          handler,
          error: err,
          timestamp: Date.now(),
        })
      }
    }
  }
}

// 服务标识符
export const EVENT_BUS_TOKEN = Symbol('EventBus')
