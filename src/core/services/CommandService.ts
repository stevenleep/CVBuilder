/**
 * 命令服务实现
 *
 * 管理命令的注册、执行、拦截等
 */

import {
  ICommandService,
  ICommand,
  ICommandContext,
  ICommandResult,
  ICommandBatch,
  ICommandInterceptor,
} from '../protocols/ICommandProtocol'
import { IEventBus } from '../protocols/IEventProtocol'

export class CommandService implements ICommandService {
  private commands: Map<string, ICommand> = new Map()
  private interceptors: ICommandInterceptor[] = []
  private eventBus?: IEventBus

  constructor(eventBus?: IEventBus) {
    this.eventBus = eventBus
  }

  /**
   * 注册命令
   */
  public register(command: ICommand): void {
    if (this.commands.has(command.id)) {
      console.warn(`[CommandService] 命令 "${command.id}" 已存在，将被覆盖`)
    }

    this.commands.set(command.id, command)
    this.eventBus?.emit('command:registered', { command })
  }

  /**
   * 批量注册命令
   */
  public registerAll(commands: ICommand[]): void {
    commands.forEach(cmd => this.register(cmd))
  }

  /**
   * 注销命令
   */
  public unregister(commandId: string): void {
    const command = this.commands.get(commandId)
    if (command) {
      this.commands.delete(commandId)
      this.eventBus?.emit('command:unregistered', { commandId })
    }
  }

  /**
   * 获取命令
   */
  public get(commandId: string): ICommand | undefined {
    return this.commands.get(commandId)
  }

  /**
   * 获取所有命令
   */
  public getAll(): ICommand[] {
    return Array.from(this.commands.values())
  }

  /**
   * 按分类获取命令
   */
  public getByCategory(category: string): ICommand[] {
    return this.getAll().filter(cmd => cmd.category === category)
  }

  /**
   * 执行命令
   */
  public async execute(commandId: string, args?: any): Promise<ICommandResult> {
    const command = this.commands.get(commandId)
    if (!command) {
      const error = new Error(`[CommandService] 命令 "${commandId}" 未找到`)
      return {
        success: false,
        error,
      }
    }

    const context: ICommandContext = {
      selectedNodeIds: [],
      pageSchema: null,
      editorState: null,
      args,
    }

    const startTime = Date.now()

    try {
      // 执行前拦截
      const canExecute = await this.runBeforeInterceptors(command, context)
      if (!canExecute) {
        return {
          success: false,
          error: new Error('命令被拦截器阻止执行'),
        }
      }

      // 检查是否可执行
      if (command.canExecute) {
        const canExec = await command.canExecute(context)
        if (!canExec) {
          return {
            success: false,
            error: new Error('命令当前不可执行'),
          }
        }
      }

      // 执行命令
      this.eventBus?.emit('command:before-execute', { command, context })

      const result = await Promise.resolve(command.execute(context))
      const duration = Date.now() - startTime

      const finalResult: ICommandResult = {
        ...result,
        duration,
      }

      // 执行后拦截
      await this.runAfterInterceptors(command, context, finalResult)

      this.eventBus?.emit('command:executed', { command, context, result: finalResult })

      return finalResult
    } catch (error) {
      const duration = Date.now() - startTime
      const errorResult: ICommandResult = {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        duration,
      }

      this.eventBus?.emit('command:failed', { command, context, error })

      return errorResult
    }
  }

  /**
   * 批量执行命令
   */
  public async executeBatch(batch: ICommandBatch): Promise<ICommandResult[]> {
    const results: ICommandResult[] = []
    const isAtomic = batch.atomic !== false

    this.eventBus?.emit('command:batch-start', { batch })

    try {
      for (const command of batch.commands) {
        const result = await this.execute(command.id, undefined)
        results.push(result)

        // 原子操作模式下，如果有失败则回滚
        if (isAtomic && !result.success) {
          await this.rollbackBatch(results)
          throw new Error(`批量命令执行失败: ${result.error?.message}`)
        }
      }

      this.eventBus?.emit('command:batch-success', { batch, results })
      return results
    } catch (error) {
      this.eventBus?.emit('command:batch-failed', { batch, error })
      throw error
    }
  }

  /**
   * 检查命令是否可执行
   */
  public async canExecute(commandId: string): Promise<boolean> {
    const command = this.commands.get(commandId)
    if (!command) {
      return false
    }

    if (!command.canExecute) {
      return true
    }

    const context: ICommandContext = {
      selectedNodeIds: [],
      pageSchema: null,
      editorState: null,
    }

    return await command.canExecute(context)
  }

  /**
   * 添加拦截器
   */
  public addInterceptor(interceptor: ICommandInterceptor): void {
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
   * 清空所有命令
   */
  public clear(): void {
    this.commands.clear()
    this.eventBus?.emit('command:cleared', {})
  }

  /**
   * 执行前拦截器
   */
  private async runBeforeInterceptors(
    command: ICommand,
    context: ICommandContext
  ): Promise<boolean> {
    for (const interceptor of this.interceptors) {
      if (interceptor.beforeExecute) {
        const result = await interceptor.beforeExecute(command, context)
        if (result === false) {
          return false
        }
      }
    }
    return true
  }

  /**
   * 执行后拦截器
   */
  private async runAfterInterceptors(
    command: ICommand,
    context: ICommandContext,
    result: ICommandResult
  ): Promise<void> {
    for (const interceptor of this.interceptors) {
      if (interceptor.afterExecute) {
        await interceptor.afterExecute(command, context, result)
      }
    }
  }

  /**
   * 回滚批量命令
   */
  private async rollbackBatch(results: ICommandResult[]): Promise<void> {
    // 倒序撤销已执行的命令
    for (let i = results.length - 1; i >= 0; i--) {
      // 这里需要 HistoryService 的支持，暂时只记录日志
      console.warn('[CommandService] 批量命令回滚:', results[i])
    }
  }
}

// 服务标识符
export const COMMAND_SERVICE_TOKEN = Symbol('CommandService')
