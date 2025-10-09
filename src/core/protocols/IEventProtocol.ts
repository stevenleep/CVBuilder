/**
 * 事件系统协议
 * 
 * 定义事件驱动架构的完整协议
 */

/**
 * 事件类型枚举
 */
export enum EditorEventType {
  // 节点事件
  NODE_CREATED = 'node:created',
  NODE_UPDATED = 'node:updated',
  NODE_DELETED = 'node:deleted',
  NODE_SELECTED = 'node:selected',
  NODE_DESELECTED = 'node:deselected',
  NODE_MOVED = 'node:moved',
  NODE_COPIED = 'node:copied',
  
  // 属性事件
  PROPS_CHANGED = 'props:changed',
  STYLE_CHANGED = 'style:changed',
  
  // 编辑器事件
  MODE_CHANGED = 'mode:changed',
  CANVAS_SCALED = 'canvas:scaled',
  
  // 历史事件
  HISTORY_UNDO = 'history:undo',
  HISTORY_REDO = 'history:redo',
  
  // 页面事件
  PAGE_LOADED = 'page:loaded',
  PAGE_SAVED = 'page:saved',
  PAGE_EXPORTED = 'page:exported',
  
  // 物料事件
  MATERIAL_REGISTERED = 'material:registered',
  MATERIAL_UNREGISTERED = 'material:unregistered',
}

/**
 * 事件数据
 */
export interface IEventData {
  /** 事件类型 */
  type: string
  /** 事件数据 */
  payload?: any
  /** 时间戳 */
  timestamp: number
  /** 事件来源 */
  source?: string
}

/**
 * 事件处理器
 */
export type EventHandler<T = any> = (data: T) => void | Promise<void>

/**
 * 事件订阅器
 */
export interface IEventSubscription {
  /** 取消订阅 */
  unsubscribe: () => void
}

/**
 * 事件总线接口
 */
export interface IEventBus {
  /** 发送事件 */
  emit<T = any>(event: string, data?: T): void
  
  /** 订阅事件 */
  on<T = any>(event: string, handler: EventHandler<T>): IEventSubscription
  
  /** 订阅一次性事件 */
  once<T = any>(event: string, handler: EventHandler<T>): IEventSubscription
  
  /** 取消订阅 */
  off(event: string, handler?: EventHandler): void
  
  /** 清除所有订阅 */
  clear(): void
  
  /** 获取订阅数量 */
  getListenerCount(event: string): number
}

/**
 * 事件过滤器
 */
export interface IEventFilter {
  /** 过滤条件 */
  condition: (event: IEventData) => boolean
  /** 优先级 */
  priority?: number
}

/**
 * 事件拦截器
 */
export interface IEventInterceptor {
  /** 拦截器名称 */
  name: string
  /** 拦截处理 */
  intercept: (event: IEventData) => IEventData | null
  /** 优先级（越大越先执行） */
  priority?: number
}

