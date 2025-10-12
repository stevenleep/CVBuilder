/**
 * 钩子系统协议
 *
 * 定义生命周期钩子系统，允许在关键时刻插入自定义逻辑
 */

/**
 * 钩子类型
 */
export type HookType = 'before' | 'after' | 'around' | 'error'

/**
 * 钩子处理器
 */
export type HookHandler<T = any, R = any> = (context: IHookContext<T>) => R | Promise<R>

/**
 * 钩子上下文
 */
export interface IHookContext<T = any> {
  /** 钩子名称 */
  hookName: string
  /** 钩子类型 */
  type: HookType
  /** 传入的数据 */
  data: T
  /** 是否取消后续执行 */
  cancelled?: boolean
  /** 额外的元数据 */
  metadata?: Record<string, any>
  /** 取消执行 */
  cancel?: () => void
  /** 修改数据 */
  setData?: (data: T) => void
}

/**
 * 钩子定义
 */
export interface IHook<T = any, R = any> {
  /** 钩子ID */
  id: string
  /** 钩子名称 */
  name: string
  /** 钩子类型 */
  type: HookType
  /** 处理器 */
  handler: HookHandler<T, R>
  /** 优先级（越大越先执行） */
  priority?: number
  /** 是否启用 */
  enabled?: boolean
  /** 激活条件 */
  condition?: (context: IHookContext<T>) => boolean | Promise<boolean>
  /** 是否一次性 */
  once?: boolean
}

/**
 * 钩子执行结果
 */
export interface IHookResult<T = any> {
  /** 是否成功 */
  success: boolean
  /** 结果数据 */
  data?: T
  /** 是否被取消 */
  cancelled?: boolean
  /** 错误信息 */
  error?: Error
  /** 执行的钩子数量 */
  executedCount?: number
}

/**
 * 钩子服务接口
 */
export interface IHookService {
  /** 注册钩子 */
  register<T = any, R = any>(hook: IHook<T, R>): void

  /** 批量注册 */
  registerAll(hooks: IHook[]): void

  /** 注销钩子 */
  unregister(hookId: string): void

  /** 触发钩子 */
  trigger<T = any, R = any>(
    hookName: string,
    data: T,
    metadata?: Record<string, any>
  ): Promise<IHookResult<R>>

  /** 触发 before 钩子 */
  triggerBefore<T = any>(
    hookName: string,
    data: T,
    metadata?: Record<string, any>
  ): Promise<IHookResult<T>>

  /** 触发 after 钩子 */
  triggerAfter<T = any>(
    hookName: string,
    data: T,
    metadata?: Record<string, any>
  ): Promise<IHookResult<T>>

  /** 启用钩子 */
  enable(hookId: string): void

  /** 禁用钩子 */
  disable(hookId: string): void

  /** 获取钩子 */
  get(hookId: string): IHook | undefined

  /** 获取指定名称的所有钩子 */
  getByName(hookName: string): IHook[]

  /** 获取指定类型的所有钩子 */
  getByType(type: HookType): IHook[]

  /** 清空钩子 */
  clear(): void

  /** 清空指定名称的钩子 */
  clearByName(hookName: string): void
}

/**
 * 常用钩子名称
 */
export const HookNames = {
  // 编辑器生命周期
  EDITOR_BEFORE_INIT: 'editor:before-init',
  EDITOR_AFTER_INIT: 'editor:after-init',
  EDITOR_BEFORE_DESTROY: 'editor:before-destroy',
  EDITOR_AFTER_DESTROY: 'editor:after-destroy',

  // 节点操作
  NODE_BEFORE_ADD: 'node:before-add',
  NODE_AFTER_ADD: 'node:after-add',
  NODE_BEFORE_REMOVE: 'node:before-remove',
  NODE_AFTER_REMOVE: 'node:after-remove',
  NODE_BEFORE_UPDATE: 'node:before-update',
  NODE_AFTER_UPDATE: 'node:after-update',

  // 命令执行
  COMMAND_BEFORE_EXECUTE: 'command:before-execute',
  COMMAND_AFTER_EXECUTE: 'command:after-execute',
  COMMAND_ERROR: 'command:error',

  // 保存/加载
  SAVE_BEFORE: 'save:before',
  SAVE_AFTER: 'save:after',
  LOAD_BEFORE: 'load:before',
  LOAD_AFTER: 'load:after',

  // 导出
  EXPORT_BEFORE: 'export:before',
  EXPORT_AFTER: 'export:after',

  // 渲染
  RENDER_BEFORE: 'render:before',
  RENDER_AFTER: 'render:after',
} as const
