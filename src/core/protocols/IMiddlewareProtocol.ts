/**
 * 中间件系统协议
 *
 * 定义中间件管道，支持请求/响应的拦截和处理
 */

/**
 * 中间件上下文
 */
export interface IMiddlewareContext<T = any, R = any> {
  /** 请求数据 */
  request: T
  /** 响应数据 */
  response?: R
  /** 是否已处理 */
  handled?: boolean
  /** 是否跳过后续中间件 */
  skip?: boolean
  /** 额外的状态 */
  state: Map<string, any>
  /** 设置状态 */
  setState: (key: string, value: any) => void
  /** 获取状态 */
  getState: <V = any>(key: string) => V | undefined
}

/**
 * 中间件处理器
 */
export type MiddlewareHandler<T = any, R = any> = (
  context: IMiddlewareContext<T, R>,
  next: () => Promise<void>
) => void | Promise<void>

/**
 * 中间件定义
 */
export interface IMiddleware<T = any, R = any> {
  /** 中间件ID */
  id: string
  /** 中间件名称 */
  name: string
  /** 描述 */
  description?: string
  /** 处理器 */
  handler: MiddlewareHandler<T, R>
  /** 优先级（越大越先执行） */
  priority?: number
  /** 是否启用 */
  enabled?: boolean
  /** 激活条件 */
  condition?: (context: IMiddlewareContext<T, R>) => boolean | Promise<boolean>
}

/**
 * 中间件管道
 */
export interface IMiddlewarePipeline<T = any, R = any> {
  /** 管道ID */
  id: string
  /** 管道名称 */
  name: string
  /** 中间件列表 */
  middlewares: IMiddleware<T, R>[]
}

/**
 * 中间件执行结果
 */
export interface IMiddlewareResult<R = any> {
  /** 是否成功 */
  success: boolean
  /** 响应数据 */
  response?: R
  /** 错误信息 */
  error?: Error
  /** 执行的中间件数量 */
  executedCount?: number
  /** 执行时间（毫秒） */
  duration?: number
}

/**
 * 中间件服务接口
 */
export interface IMiddlewareService {
  /** 注册中间件 */
  register<T = any, R = any>(pipelineId: string, middleware: IMiddleware<T, R>): void

  /** 批量注册 */
  registerAll<T = any, R = any>(pipelineId: string, middlewares: IMiddleware<T, R>[]): void

  /** 注销中间件 */
  unregister(pipelineId: string, middlewareId: string): void

  /** 创建管道 */
  createPipeline(id: string, name: string): void

  /** 删除管道 */
  deletePipeline(pipelineId: string): void

  /** 执行管道 */
  execute<T = any, R = any>(pipelineId: string, request: T): Promise<IMiddlewareResult<R>>

  /** 获取管道 */
  getPipeline(pipelineId: string): IMiddlewarePipeline | undefined

  /** 获取所有管道 */
  getAllPipelines(): IMiddlewarePipeline[]

  /** 启用中间件 */
  enable(pipelineId: string, middlewareId: string): void

  /** 禁用中间件 */
  disable(pipelineId: string, middlewareId: string): void

  /** 清空管道 */
  clearPipeline(pipelineId: string): void
}

/**
 * 常用管道名称
 */
export const PipelineNames = {
  /** 节点创建管道 */
  NODE_CREATE: 'node:create',
  /** 节点更新管道 */
  NODE_UPDATE: 'node:update',
  /** 节点删除管道 */
  NODE_DELETE: 'node:delete',
  /** 数据保存管道 */
  DATA_SAVE: 'data:save',
  /** 数据加载管道 */
  DATA_LOAD: 'data:load',
  /** 导出管道 */
  EXPORT: 'export',
  /** 导入管道 */
  IMPORT: 'import',
  /** 渲染管道 */
  RENDER: 'render',
} as const
