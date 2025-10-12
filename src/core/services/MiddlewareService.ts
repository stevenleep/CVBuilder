/**
 * 中间件服务实现
 *
 * 提供中间件管道系统，支持请求/响应的拦截和处理
 */

import {
  IMiddlewareService,
  IMiddleware,
  IMiddlewarePipeline,
  IMiddlewareContext,
  IMiddlewareResult,
} from '../protocols/IMiddlewareProtocol'
import { IEventBus } from '../protocols/IEventProtocol'

export class MiddlewareService implements IMiddlewareService {
  private pipelines: Map<string, IMiddlewarePipeline> = new Map()
  private eventBus?: IEventBus

  constructor(eventBus?: IEventBus) {
    this.eventBus = eventBus
  }

  /**
   * 注册中间件
   */
  public register<T = any, R = any>(pipelineId: string, middleware: IMiddleware<T, R>): void {
    const pipeline = this.pipelines.get(pipelineId)
    if (!pipeline) {
      throw new Error(`[MiddlewareService] 管道 "${pipelineId}" 不存在`)
    }

    const normalizedMiddleware: IMiddleware<T, R> = {
      ...middleware,
      enabled: middleware.enabled ?? true,
      priority: middleware.priority ?? 0,
    }

    pipeline.middlewares.push(normalizedMiddleware)
    // 按优先级排序
    pipeline.middlewares.sort((a, b) => (b.priority || 0) - (a.priority || 0))

    this.eventBus?.emit('middleware:registered', { pipelineId, middleware: normalizedMiddleware })
  }

  /**
   * 批量注册
   */
  public registerAll<T = any, R = any>(pipelineId: string, middlewares: IMiddleware<T, R>[]): void {
    middlewares.forEach(middleware => this.register(pipelineId, middleware))
  }

  /**
   * 注销中间件
   */
  public unregister(pipelineId: string, middlewareId: string): void {
    const pipeline = this.pipelines.get(pipelineId)
    if (pipeline) {
      const index = pipeline.middlewares.findIndex(m => m.id === middlewareId)
      if (index !== -1) {
        pipeline.middlewares.splice(index, 1)
        this.eventBus?.emit('middleware:unregistered', { pipelineId, middlewareId })
      }
    }
  }

  /**
   * 创建管道
   */
  public createPipeline<T = any, R = any>(id: string, name: string): void {
    if (this.pipelines.has(id)) {
      console.warn(`[MiddlewareService] 管道 "${id}" 已存在，将被覆盖`)
    }

    const pipeline: IMiddlewarePipeline<T, R> = {
      id,
      name,
      middlewares: [],
    }

    this.pipelines.set(id, pipeline)
    this.eventBus?.emit('middleware:pipeline-created', { pipeline })
  }

  /**
   * 删除管道
   */
  public deletePipeline(pipelineId: string): void {
    if (this.pipelines.delete(pipelineId)) {
      this.eventBus?.emit('middleware:pipeline-deleted', { pipelineId })
    }
  }

  /**
   * 执行管道
   */
  public async execute<T = any, R = any>(
    pipelineId: string,
    request: T
  ): Promise<IMiddlewareResult<R>> {
    const pipeline = this.pipelines.get(pipelineId)
    if (!pipeline) {
      return {
        success: false,
        error: new Error(`管道 "${pipelineId}" 不存在`),
      }
    }

    const startTime = Date.now()
    const enabledMiddlewares = pipeline.middlewares.filter(m => m.enabled)

    if (enabledMiddlewares.length === 0) {
      return {
        success: true,
        executedCount: 0,
        duration: Date.now() - startTime,
      }
    }

    // 创建上下文
    const state = new Map<string, any>()
    const context: IMiddlewareContext<T, R> = {
      request,
      handled: false,
      skip: false,
      state,
      setState: (key: string, value: any) => {
        state.set(key, value)
      },
      getState: <V = any>(key: string) => {
        return state.get(key) as V | undefined
      },
    }

    let executedCount = 0
    let currentIndex = 0

    // 创建 next 函数
    const next = async (): Promise<void> => {
      if (context.skip || currentIndex >= enabledMiddlewares.length) {
        return
      }

      const middleware = enabledMiddlewares[currentIndex]
      currentIndex++

      try {
        // 检查条件
        if (middleware.condition) {
          const shouldExecute = await middleware.condition(context)
          if (!shouldExecute) {
            return next()
          }
        }

        // 执行中间件
        await middleware.handler(context, next)
        executedCount++

        this.eventBus?.emit('middleware:executed', { pipelineId, middleware })
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        console.error(`[MiddlewareService] 中间件 "${middleware.id}" 执行失败:`, err)
        this.eventBus?.emit('middleware:error', { pipelineId, middleware, error: err })
        throw err
      }
    }

    try {
      // 开始执行管道
      await next()

      const duration = Date.now() - startTime

      return {
        success: true,
        response: context.response,
        executedCount,
        duration,
      }
    } catch (error) {
      const duration = Date.now() - startTime
      const err = error instanceof Error ? error : new Error(String(error))

      return {
        success: false,
        error: err,
        executedCount,
        duration,
      }
    }
  }

  /**
   * 获取管道
   */
  public getPipeline(pipelineId: string): IMiddlewarePipeline | undefined {
    return this.pipelines.get(pipelineId)
  }

  /**
   * 获取所有管道
   */
  public getAllPipelines(): IMiddlewarePipeline[] {
    return Array.from(this.pipelines.values())
  }

  /**
   * 启用中间件
   */
  public enable(pipelineId: string, middlewareId: string): void {
    const pipeline = this.pipelines.get(pipelineId)
    if (pipeline) {
      const middleware = pipeline.middlewares.find(m => m.id === middlewareId)
      if (middleware) {
        middleware.enabled = true
        this.eventBus?.emit('middleware:enabled', { pipelineId, middlewareId })
      }
    }
  }

  /**
   * 禁用中间件
   */
  public disable(pipelineId: string, middlewareId: string): void {
    const pipeline = this.pipelines.get(pipelineId)
    if (pipeline) {
      const middleware = pipeline.middlewares.find(m => m.id === middlewareId)
      if (middleware) {
        middleware.enabled = false
        this.eventBus?.emit('middleware:disabled', { pipelineId, middlewareId })
      }
    }
  }

  /**
   * 清空管道
   */
  public clearPipeline(pipelineId: string): void {
    const pipeline = this.pipelines.get(pipelineId)
    if (pipeline) {
      pipeline.middlewares = []
      this.eventBus?.emit('middleware:pipeline-cleared', { pipelineId })
    }
  }
}

// 服务标识符
export const MIDDLEWARE_SERVICE_TOKEN = Symbol('MiddlewareService')
