/**
 * 事件总线实现
 * 
 * 提供发布订阅模式的事件系统
 */

import { IEventBus, EventHandler, IEventSubscription, IEventInterceptor, IEventData } from '../protocols/IEventProtocol'

export class EventBus implements IEventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map()
  private interceptors: IEventInterceptor[] = []

  /**
   * 发送事件
   */
  public emit<T = any>(event: string, data?: T): void {
    const eventData: IEventData = {
      type: event,
      payload: data,
      timestamp: Date.now(),
    }

    // 通过拦截器处理
    let processedEvent: IEventData | null = eventData
    for (const interceptor of this.getSortedInterceptors()) {
      processedEvent = interceptor.intercept(processedEvent)
      if (!processedEvent) {
        // 事件被拦截，不继续传播
        return
      }
    }

    // 触发事件处理器
    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(processedEvent!.payload)
        } catch (error) {
          // 静默失败
        }
      })
    }

    // 触发通配符监听器
    const wildcardHandlers = this.listeners.get('*')
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => {
        try {
          handler(processedEvent)
        } catch (error) {
          // 静默失败
        }
      })
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
}

// 服务标识符
export const EVENT_BUS_TOKEN = Symbol('EventBus')

