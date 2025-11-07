/**
 * 事件协议 - 增强型事件总线系统
 * 
 * 提供发布-订阅机制，支持优先级、拦截器、节流/防抖等高级特性
 * 
 * @packageDocumentation
 */

import type { I18nString } from '../material/MaterialProtocol'

// ==================== 事件协议 URI ====================

export const EVENT_PROTOCOL_URI = 'lcedit://protocols/event/v1' as const

// ==================== 事件定义 ====================

/**
 * 事件定义
 */
export interface EventDefinition {
  /** 协议版本 */
  readonly $protocol: typeof EVENT_PROTOCOL_URI
  
  /** 事件 ID（全局唯一） */
  readonly id: string
  
  /** 事件名称 */
  readonly name: I18nString
  
  /** 事件描述 */
  readonly description?: I18nString
  
  /** 事件分类 */
  readonly category?: EventCategory
  
  /** 事件负载 Schema */
  readonly payloadSchema?: EventPayloadSchema
  
  /** 是否可取消 */
  readonly cancelable?: boolean
  
  /** 是否冒泡 */
  readonly bubbles?: boolean
  
  /** 事件元数据 */
  readonly metadata?: EventMetadata
}

/**
 * 事件分类
 */
export type EventCategory =
  | 'lifecycle'     // 生命周期事件
  | 'user'          // 用户交互事件
  | 'system'        // 系统事件
  | 'data'          // 数据事件
  | 'ui'            // UI 事件
  | 'plugin'        // 插件事件
  | 'custom'        // 自定义事件

/**
 * 事件负载 Schema
 */
export interface EventPayloadSchema {
  readonly type: 'object' | 'array' | 'primitive'
  readonly properties?: Record<string, EventPropertySchema>
  readonly required?: readonly string[]
}

/**
 * 事件属性 Schema
 */
export interface EventPropertySchema {
  readonly type: string
  readonly description?: I18nString
  readonly required?: boolean
}

/**
 * 事件元数据
 */
export interface EventMetadata {
  readonly version?: string
  readonly author?: string
  readonly deprecated?: boolean
  readonly [key: `x-${string}`]: unknown
}

// ==================== 事件实例 ====================

/**
 * 事件实例
 */
export interface Event<TPayload = unknown> {
  /** 事件 ID */
  readonly id: string
  
  /** 事件类型 */
  readonly type: string
  
  /** 事件负载 */
  readonly payload: TPayload
  
  /** 事件时间戳 */
  readonly timestamp: number
  
  /** 事件来源 */
  readonly source: EventSource
  
  /** 是否已取消 */
  isCanceled: boolean
  
  /** 是否已停止传播 */
  isPropagationStopped: boolean
  
  /** 取消事件 */
  cancel(): void
  
  /** 停止传播 */
  stopPropagation(): void
}

/**
 * 事件来源
 */
export interface EventSource {
  /** 来源类型 */
  readonly type: 'user' | 'system' | 'plugin' | 'material' | 'command'
  
  /** 来源 ID */
  readonly id?: string
  
  /** 来源名称 */
  readonly name?: string
}

// ==================== 事件监听器 ====================

/**
 * 事件监听器
 */
export type EventListener<TPayload = unknown> = (
  event: Event<TPayload>
) => void | Promise<void>

/**
 * 事件监听器配置
 */
export interface EventListenerConfig {
  /** 监听器 ID */
  readonly id?: string
  
  /** 监听器优先级（数字越大越先执行） */
  readonly priority?: number
  
  /** 是否只触发一次 */
  readonly once?: boolean
  
  /** 节流时间（毫秒） */
  readonly throttle?: number
  
  /** 防抖时间（毫秒） */
  readonly debounce?: number
  
  /** 是否异步执行 */
  readonly async?: boolean
  
  /** 过滤器 */
  readonly filter?: EventFilter
  
  /** 上下文 */
  readonly context?: unknown
}

/**
 * 事件过滤器
 */
export type EventFilter<TPayload = unknown> = (
  event: Event<TPayload>
) => boolean

// ==================== 事件拦截器 ====================

/**
 * 事件拦截器
 */
export interface EventInterceptor {
  /** 拦截器名称 */
  readonly name: string
  
  /** 拦截器优先级 */
  readonly priority?: number
  
  /** 拦截事件发送前 */
  beforeEmit?<TPayload>(
    eventType: string,
    payload: TPayload,
    context: InterceptorContext
  ): TPayload | Promise<TPayload>
  
  /** 拦截事件发送后 */
  afterEmit?<TPayload>(
    eventType: string,
    payload: TPayload,
    context: InterceptorContext
  ): void | Promise<void>
  
  /** 拦截事件处理前 */
  beforeHandle?<TPayload>(
    event: Event<TPayload>,
    listener: EventListener<TPayload>
  ): boolean | Promise<boolean>
  
  /** 拦截事件处理后 */
  afterHandle?<TPayload>(
    event: Event<TPayload>,
    listener: EventListener<TPayload>,
    error?: Error
  ): void | Promise<void>
}

/**
 * 拦截器上下文
 */
export interface InterceptorContext {
  readonly timestamp: number
  readonly source: EventSource
  readonly metadata: Record<string, unknown>
}

// ==================== 事件总线 ====================

/**
 * 事件总线接口
 */
export interface IEventBus {
  /**
   * 发送事件
   */
  emit<TPayload = unknown>(
    eventType: string,
    payload?: TPayload,
    options?: EmitOptions
  ): Promise<void>
  
  /**
   * 同步发送事件
   */
  emitSync<TPayload = unknown>(
    eventType: string,
    payload?: TPayload,
    options?: EmitOptions
  ): void
  
  /**
   * 监听事件
   */
  on<TPayload = unknown>(
    eventType: string,
    listener: EventListener<TPayload>,
    config?: EventListenerConfig
  ): Disposable
  
  /**
   * 监听事件（只触发一次）
   */
  once<TPayload = unknown>(
    eventType: string,
    listener: EventListener<TPayload>,
    config?: EventListenerConfig
  ): Disposable
  
  /**
   * 取消监听
   */
  off(eventType: string, listener?: EventListener): void
  
  /**
   * 监听所有事件
   */
  onAny(listener: EventListener<unknown>): Disposable
  
  /**
   * 取消所有监听
   */
  offAll(eventType?: string): void
  
  /**
   * 添加拦截器
   */
  addInterceptor(interceptor: EventInterceptor): Disposable
  
  /**
   * 移除拦截器
   */
  removeInterceptor(name: string): void
  
  /**
   * 检查是否有监听器
   */
  hasListener(eventType: string): boolean
  
  /**
   * 获取监听器数量
   */
  getListenerCount(eventType: string): number
  
  /**
   * 获取所有事件类型
   */
  getEventTypes(): readonly string[]
  
  /**
   * 暂停事件
   */
  pause(eventType?: string): void
  
  /**
   * 恢复事件
   */
  resume(eventType?: string): void
  
  /**
   * 清空事件队列
   */
  clear(): void
  
  /**
   * 销毁事件总线
   */
  dispose(): void
}

/**
 * 发送选项
 */
export interface EmitOptions {
  /** 是否同步发送 */
  readonly sync?: boolean
  
  /** 事件来源 */
  readonly source?: EventSource
  
  /** 延迟发送（毫秒） */
  readonly delay?: number
  
  /** 是否记录到历史 */
  readonly recordHistory?: boolean
  
  /** 自定义元数据 */
  readonly metadata?: Record<string, unknown>
}

/**
 * 可释放资源
 */
export interface Disposable {
  dispose(): void
}

// ==================== 内置事件 ====================

/**
 * 内置事件常量
 */
export const BuiltInEvents = {
  // 编辑器生命周期
  EDITOR_READY: 'editor:ready',
  EDITOR_DESTROY: 'editor:destroy',
  EDITOR_FOCUS: 'editor:focus',
  EDITOR_BLUR: 'editor:blur',
  
  // 节点事件
  NODE_CREATED: 'node:created',
  NODE_UPDATED: 'node:updated',
  NODE_DELETED: 'node:deleted',
  NODE_SELECTED: 'node:selected',
  NODE_DESELECTED: 'node:deselected',
  NODE_MOVED: 'node:moved',
  NODE_RESIZED: 'node:resized',
  NODE_LOCKED: 'node:locked',
  NODE_UNLOCKED: 'node:unlocked',
  
  // 历史事件
  HISTORY_UNDO: 'history:undo',
  HISTORY_REDO: 'history:redo',
  HISTORY_CLEAR: 'history:clear',
  HISTORY_CHANGE: 'history:change',
  
  // 数据事件
  DATA_LOADED: 'data:loaded',
  DATA_SAVED: 'data:saved',
  DATA_CHANGED: 'data:changed',
  DATA_ERROR: 'data:error',
  
  // 插件事件
  PLUGIN_LOADED: 'plugin:loaded',
  PLUGIN_ACTIVATED: 'plugin:activated',
  PLUGIN_DEACTIVATED: 'plugin:deactivated',
  PLUGIN_ERROR: 'plugin:error',
  
  // 命令事件
  COMMAND_EXECUTED: 'command:executed',
  COMMAND_FAILED: 'command:failed',
  
  // UI 事件
  UI_THEME_CHANGED: 'ui:theme:changed',
  UI_LANGUAGE_CHANGED: 'ui:language:changed',
  UI_VIEWPORT_CHANGED: 'ui:viewport:changed',
  
  // 系统事件
  SYSTEM_ERROR: 'system:error',
  SYSTEM_WARNING: 'system:warning',
  SYSTEM_INFO: 'system:info',
} as const

/**
 * 事件负载类型
 */
export interface EventPayloads {
  // 节点事件
  'node:created': { nodeId: string; materialType: string; parentId?: string }
  'node:updated': { nodeId: string; props: Record<string, unknown>; prevProps: Record<string, unknown> }
  'node:deleted': { nodeId: string }
  'node:selected': { nodeIds: readonly string[] }
  'node:moved': { nodeId: string; parentId: string; index: number }
  
  // 历史事件
  'history:undo': { step: number }
  'history:redo': { step: number }
  'history:change': { canUndo: boolean; canRedo: boolean }
  
  // 数据事件
  'data:loaded': { dataId: string; data: unknown }
  'data:saved': { dataId: string }
  'data:changed': { dataId: string; changes: unknown }
  'data:error': { dataId: string; error: Error }
  
  // 命令事件
  'command:executed': { commandId: string; args: readonly unknown[]; result: unknown }
  'command:failed': { commandId: string; error: Error }
  
  // UI 事件
  'ui:theme:changed': { themeId: string }
  'ui:language:changed': { language: string }
  'ui:viewport:changed': { mode: string; width: number; height: number }
  
  // 系统事件
  'system:error': { message: string; error: Error; stack?: string }
  'system:warning': { message: string; details?: unknown }
  'system:info': { message: string; details?: unknown }
}

// ==================== 事件工具 ====================

/**
 * 创建事件实例
 */
export function createEvent<TPayload = unknown>(
  type: string,
  payload: TPayload,
  source?: EventSource
): Event<TPayload> {
  let canceled = false
  let propagationStopped = false
  
  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    payload,
    timestamp: Date.now(),
    source: source || { type: 'system' },
    get isCanceled() {
      return canceled
    },
    get isPropagationStopped() {
      return propagationStopped
    },
    cancel() {
      canceled = true
    },
    stopPropagation() {
      propagationStopped = true
    },
  }
}

/**
 * 事件匹配器
 */
export function matchEvent(pattern: string, eventType: string): boolean {
  if (pattern === '*') return true
  if (pattern === eventType) return true
  
  // 支持通配符匹配，如 'node:*'
  if (pattern.endsWith(':*')) {
    const prefix = pattern.slice(0, -2)
    return eventType.startsWith(prefix + ':')
  }
  
  return false
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return ((...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastCall >= delay) {
      lastCall = now
      return fn(...args)
    }
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      lastCall = Date.now()
      fn(...args)
    }, delay - (now - lastCall))
  }) as T
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  
  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }) as T
}

