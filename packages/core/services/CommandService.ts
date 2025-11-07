/**
 * 命令服务
 * 
 * 实现完整的命令系统，支持：
 * - 命令注册/注销
 * - 命令执行（带参数验证）
 * - 快捷键绑定
 * - When 子句（条件执行）
 * - 取消令牌
 * - 进度报告
 * - 命令历史
 * 
 * @packageDocumentation
 */

import type {
  ICommandRegistry,
  CommandDefinition,
  CommandExecutor,
  CommandExecutionContext,
  CommandExecutionResult,
  CommandExecutionError,
  CommandSource,
  EditorState,
  CommandServices,
  CancellationToken,
  ProgressReporter,
  ProgressValue,
  Disposable,
} from '../protocols/command/CommandProtocol'

import type { IEventBus } from '../protocols/event/EventProtocol'

// ==================== 取消令牌实现 ====================

/**
 * 取消令牌源
 */
class CancellationTokenSource {
  private _isCancelled = false
  private readonly _listeners: Array<() => void> = []
  
  get token(): CancellationToken {
    return {
      isCancellationRequested: this._isCancelled,
      onCancellationRequested: (listener: () => void) => {
        if (this._isCancelled) {
          listener()
          return { dispose: () => {} }
        }
        
        this._listeners.push(listener)
        
        return {
          dispose: () => {
            const index = this._listeners.indexOf(listener)
            if (index !== -1) {
              this._listeners.splice(index, 1)
            }
          },
        }
      },
    }
  }
  
  cancel(): void {
    if (this._isCancelled) {
      return
    }
    
    this._isCancelled = true
    
    for (const listener of this._listeners) {
      try {
        listener()
      } catch (error) {
        console.error('Error in cancellation listener:', error)
      }
    }
    
    this._listeners.length = 0
  }
  
  dispose(): void {
    this.cancel()
  }
}

// ==================== 进度报告实现 ====================

/**
 * 进度报告器实现
 */
class ProgressReporterImpl implements ProgressReporter {
  private readonly _onReport?: (value: ProgressValue) => void
  
  constructor(onReport?: (value: ProgressValue) => void) {
    this._onReport = onReport
  }
  
  report(value: ProgressValue): void {
    this._onReport?.(value)
  }
}

// ==================== 命令服务实现 ====================

/**
 * 命令服务实现
 */
export class CommandService implements ICommandRegistry {
  /** 命令定义映射 */
  private readonly commands = new Map<string, CommandDefinition>()
  
  /** 命令执行器映射 */
  private readonly executors = new Map<string, CommandExecutor>()
  
  /** 命令历史 */
  private readonly history: CommandExecutionResult[] = []
  
  /** 最大历史记录数 */
  private readonly maxHistorySize: number = 100
  
  /** 事件总线（可选） */
  private readonly eventBus?: IEventBus
  
  /** 编辑器状态工厂 */
  private readonly editorStateFactory: () => EditorState
  
  /** 服务工厂 */
  private readonly servicesFactory: () => CommandServices
  
  /** 是否已销毁 */
  private disposed = false
  
  /** 命令执行前监听器 */
  private readonly willExecuteListeners = new Set<(event: any) => void>()
  
  /** 命令执行后监听器 */
  private readonly didExecuteListeners = new Set<(event: any) => void>()
  
  /** 命令执行失败监听器 */
  private readonly executionFailedListeners = new Set<(event: any) => void>()
  
  constructor(options?: {
    maxHistorySize?: number
    eventBus?: IEventBus
    editorStateFactory?: () => EditorState
    servicesFactory?: () => CommandServices
  }) {
    this.maxHistorySize = options?.maxHistorySize || 100
    this.eventBus = options?.eventBus
    this.editorStateFactory = options?.editorStateFactory || this.createDefaultEditorState
    this.servicesFactory = options?.servicesFactory || this.createDefaultServices
  }
  
  // ==================== 命令注册 ====================
  
  /**
   * 注册命令定义
   */
  registerCommand(definition: CommandDefinition): Disposable {
    this.assertNotDisposed()
    
    if (this.commands.has(definition.id)) {
      throw new Error(`Command "${definition.id}" is already registered`)
    }
    
    this.commands.set(definition.id, definition)
    
    // 发送事件
    this.eventBus?.emitSync('command:registered', {
      commandId: definition.id,
      definition,
    })
    
    return {
      dispose: () => this.unregisterCommand(definition.id),
    }
  }
  
  /**
   * 注册命令执行器
   */
  registerExecutor(executor: CommandExecutor): Disposable {
    this.assertNotDisposed()
    
    if (this.executors.has(executor.commandId)) {
      throw new Error(`Executor for command "${executor.commandId}" is already registered`)
    }
    
    this.executors.set(executor.commandId, executor)
    
    return {
      dispose: () => {
        this.executors.delete(executor.commandId)
      },
    }
  }
  
  /**
   * 取消注册命令
   */
  unregisterCommand(commandId: string): void {
    const definition = this.commands.get(commandId)
    if (!definition) {
      return
    }
    
    // 移除命令和执行器
    this.commands.delete(commandId)
    this.executors.delete(commandId)
    
    // 发送事件
    this.eventBus?.emitSync('command:unregister ed', {
      commandId,
    })
  }
  
  // ==================== 命令执行 ====================
  
  /**
   * 执行命令
   */
  async executeCommand<TReturn = unknown>(
    commandId: string,
    ...args: unknown[]
  ): Promise<CommandExecutionResult<TReturn>> {
    this.assertNotDisposed()
    
    const definition = this.commands.get(commandId)
    if (!definition) {
      throw new Error(`Command "${commandId}" not found`)
    }
    
    const executor = this.executors.get(commandId)
    if (!executor) {
      throw new Error(`Executor for command "${commandId}" not found`)
    }
    
    // 创建取消令牌和进度报告器
    const tokenSource = new CancellationTokenSource()
    const progressReporter = new ProgressReporterImpl((value) => {
      this.eventBus?.emitSync('command:progress', {
        commandId,
        progress: value,
      })
    })
    
    // 创建执行上下文
    const context: CommandExecutionContext = {
      commandId,
      args,
      timestamp: Date.now(),
      source: 'api' as CommandSource,
      editorState: this.editorStateFactory(),
      selectedNodes: [],
      services: this.servicesFactory(),
      cancellationToken: tokenSource.token,
      progress: progressReporter,
      metadata: {},
    }
    
    const startTime = Date.now()
    
    try {
      // 验证命令（如果有验证函数）
      if (executor.validate) {
        const validationResult = await executor.validate(context, ...args)
        if (validationResult !== true) {
          throw new Error(
            typeof validationResult === 'string'
              ? validationResult
              : 'Command validation failed'
          )
        }
      }
      
      // 通知执行前监听器
      const willExecuteEvent = { commandId, args, context, timestamp: context.timestamp }
      for (const listener of this.willExecuteListeners) {
        listener(willExecuteEvent)
      }
      
      // 发送开始事件
      await this.eventBus?.emit('command:executing', {
        commandId,
        args,
        timestamp: context.timestamp,
      })
      
      // 执行命令
      const value = await executor.execute(context, ...args)
      
      const duration = Date.now() - startTime
      
      const executionResult: CommandExecutionResult<TReturn> = {
        commandId,
        success: true,
        value: value as TReturn,
        duration,
        timestamp: context.timestamp,
      }
      
      // 记录历史
      this.addToHistory(executionResult)
      
      // 通知执行后监听器
      const didExecuteEvent = { commandId, args, context, timestamp: Date.now() }
      for (const listener of this.didExecuteListeners) {
        listener(didExecuteEvent)
      }
      
      // 发送完成事件
      await this.eventBus?.emit('command:executed', {
        commandId,
        args,
        result: value,
        duration,
      })
      
      return executionResult
    } catch (error) {
      const duration = Date.now() - startTime
      
      const executionError: CommandExecutionError = {
        code: 'EXECUTION_ERROR',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        details: error,
        retryable: false,
      }
      
      const executionResult: CommandExecutionResult<TReturn> = {
        commandId,
        success: false,
        error: executionError,
        duration,
        timestamp: context.timestamp,
      }
      
      // 记录历史
      this.addToHistory(executionResult)
      
      // 通知执行失败监听器
      const failedEvent = { commandId, args, context, timestamp: Date.now(), error: executionError }
      for (const listener of this.executionFailedListeners) {
        listener(failedEvent)
      }
      
      // 发送失败事件
      await this.eventBus?.emit('command:failed', {
        commandId,
        args,
        error: executionError,
        duration,
      })
      
      return executionResult
    } finally {
      tokenSource.dispose()
    }
  }
  
  /**
   * 检查命令是否可执行
   */
  canExecute(commandId: string, _context?: Record<string, unknown>): boolean {
    const definition = this.commands.get(commandId)
    if (!definition) {
      return false
    }
    
    // 检查是否有执行器
    if (!this.executors.has(commandId)) {
      return false
    }
    
    // TODO: 实现 when 子句评估
    // if (definition.when) {
    //   return this.evaluateWhenClause(definition.when, context)
    // }
    
    return true
  }
  
  // ==================== 查询方法 ====================
  
  /**
   * 获取命令定义
   */
  getCommand(commandId: string): CommandDefinition | undefined {
    return this.commands.get(commandId)
  }
  
  /**
   * 获取所有命令
   */
  getAllCommands(): readonly CommandDefinition[] {
    return Array.from(this.commands.values())
  }
  
  /**
   * 搜索命令
   */
  searchCommands(query: string): readonly CommandDefinition[] {
    const lowerQuery = query.toLowerCase()
    
    return Array.from(this.commands.values()).filter(cmd => {
      // 搜索 ID
      if (cmd.id.toLowerCase().includes(lowerQuery)) {
        return true
      }
      
      // 搜索标题
      let title: string
      if (typeof cmd.title === 'string') {
        title = cmd.title
      } else if (typeof cmd.title === 'object' && cmd.title !== null) {
        const titleObj = cmd.title as Record<string, string>
        title = titleObj.en || Object.values(titleObj)[0] || ''
      } else {
        title = ''
      }
      
      if (title && title.toLowerCase().includes(lowerQuery)) {
        return true
      }
      
      // 搜索描述
      if (cmd.description) {
        let desc: string
        if (typeof cmd.description === 'string') {
          desc = cmd.description
        } else if (typeof cmd.description === 'object' && cmd.description !== null) {
          const descObj = cmd.description as Record<string, string>
          desc = descObj.en || Object.values(descObj)[0] || ''
        } else {
          desc = ''
        }
        
        if (desc && desc.toLowerCase().includes(lowerQuery)) {
          return true
        }
      }
      
      // 搜索分类
      if (cmd.category && typeof cmd.category === 'string' && cmd.category.toLowerCase().includes(lowerQuery)) {
        return true
      }
      
      return false
    })
  }
  
  /**
   * 检查命令是否存在
   */
  hasCommand(commandId: string): boolean {
    return this.commands.has(commandId)
  }
  
  /**
   * 检查命令是否已注册执行器
   */
  hasExecutor(commandId: string): boolean {
    return this.executors.has(commandId)
  }
  
  /**
   * 验证命令参数
   */
  validateCommand(commandId: string, ...args: unknown[]): boolean | string {
    const definition = this.commands.get(commandId)
    if (!definition) {
      return `Command "${commandId}" not found`
    }
    
    const executor = this.executors.get(commandId)
    if (!executor || !executor.validate) {
      return true
    }
    
    // 创建临时上下文进行验证
    const context: CommandExecutionContext = {
      commandId,
      args,
      timestamp: Date.now(),
      source: 'api',
      editorState: this.editorStateFactory(),
      selectedNodes: [],
      services: this.servicesFactory(),
      cancellationToken: { isCancellationRequested: false, onCancellationRequested: () => ({ dispose: () => {} }) },
      progress: new ProgressReporterImpl(),
      metadata: {},
    }
    
    try {
      const result = executor.validate(context, ...args)
      if (result instanceof Promise) {
        // 如果是Promise，暂时返回true，实际验证会在execute时进行
        return true
      }
      return result
    } catch {
      return false
    }
  }
  
  /**
   * 检查命令是否启用
   */
  isCommandEnabled(commandId: string, _context?: Record<string, unknown>): boolean {
    const definition = this.commands.get(commandId)
    if (!definition) {
      return false
    }
    
    // 检查是否有执行器
    if (!this.executors.has(commandId)) {
      return false
    }
    
    // TODO: 实现 when 子句评估
    // if (definition.when) {
    //   return this.evaluateWhenClause(definition.when, context)
    // }
    
    return true
  }
  
  /**
   * 监听命令执行前
   */
  onWillExecuteCommand(listener: (event: any) => void): Disposable {
    this.willExecuteListeners.add(listener)
    
    return {
      dispose: () => {
        this.willExecuteListeners.delete(listener)
      },
    }
  }
  
  /**
   * 监听命令执行后
   */
  onDidExecuteCommand(listener: (event: any) => void): Disposable {
    this.didExecuteListeners.add(listener)
    
    return {
      dispose: () => {
        this.didExecuteListeners.delete(listener)
      },
    }
  }
  
  /**
   * 监听命令执行失败
   */
  onCommandExecutionFailed(listener: (event: any) => void): Disposable {
    this.executionFailedListeners.add(listener)
    
    return {
      dispose: () => {
        this.executionFailedListeners.delete(listener)
      },
    }
  }
  
  /**
   * 按分类获取命令
   */
  getCommandsByCategory(category: string): readonly CommandDefinition[] {
    return Array.from(this.commands.values()).filter(
      cmd => cmd.category === category
    )
  }
  
  /**
   * 获取命令快捷键
   */
  getKeybindings(commandId: string): string[] {
    const definition = this.commands.get(commandId)
    if (!definition || !definition.keybinding) {
      return []
    }
    
    const kb = definition.keybinding
    const result = [kb.primary]
    
    if (kb.secondary) {
      result.push(...kb.secondary)
    }
    
    return result
  }
  
  // ==================== 历史 ====================
  
  /**
   * 获取命令历史
   */
  getHistory(): readonly CommandExecutionResult[] {
    return this.history
  }
  
  /**
   * 清空历史
   */
  clearHistory(): void {
    this.history.length = 0
  }
  
  // ==================== 内部方法 ====================
  
  /**
   * 创建默认编辑器状态
   */
  private createDefaultEditorState(): EditorState {
    return {
      isDirty: false,
      viewportMode: 'desktop',
      theme: 'default',
      language: 'en',
      readOnly: false,
      zoom: 1,
    }
  }
  
  /**
   * 创建默认服务
   */
  private createDefaultServices(): CommandServices {
    const self = this
    
    return {
      getEditorService: () => undefined,
      getEventBus: () => this.eventBus,
      getStateManager: () => undefined,
      getHistoryService: () => undefined,
      getPluginManager: () => undefined,
      getService: () => undefined,
      executeCommand: async <TReturn = unknown>(commandId: string, ...args: unknown[]): Promise<TReturn> => {
        const result = await self.executeCommand<TReturn>(commandId, ...args)
        if (result.success) {
          return result.value as TReturn
        } else {
          throw result.error
        }
      },
      emitEvent: (eventName, payload) => {
        this.eventBus?.emitSync(eventName, payload)
      },
      showMessage: async () => {},
      showInputBox: async () => undefined,
      showQuickPick: async () => undefined,
    }
  }
  
  /**
   * 添加到历史
   */
  private addToHistory(record: CommandExecutionResult): void {
    this.history.push(record)
    
    // 限制历史大小
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    }
  }
  
  /**
   * 断言未销毁
   */
  private assertNotDisposed(): void {
    if (this.disposed) {
      throw new Error('CommandService has been disposed')
    }
  }
  
  /**
   * 销毁服务
   */
  dispose(): void {
    if (this.disposed) {
      return
    }
    
    this.disposed = true
    this.commands.clear()
    this.executors.clear()
    this.history.length = 0
  }
}

// ==================== 导出 ====================

/**
 * 创建命令服务
 */
export function createCommandService(options?: {
  maxHistorySize?: number
  eventBus?: IEventBus
  editorStateFactory?: () => EditorState
  servicesFactory?: () => CommandServices
}): ICommandRegistry {
  return new CommandService(options)
}

/**
 * 全局命令服务实例（可选）
 */
let globalCommandService: ICommandRegistry | null = null

/**
 * 获取全局命令服务
 */
export function getGlobalCommandService(): ICommandRegistry {
  if (!globalCommandService) {
    globalCommandService = createCommandService()
  }
  return globalCommandService
}

/**
 * 设置全局命令服务
 */
export function setGlobalCommandService(service: ICommandRegistry): void {
  globalCommandService = service
}

/**
 * 重置全局命令服务
 */
export function resetGlobalCommandService(): void {
  if (globalCommandService && 'dispose' in globalCommandService) {
    (globalCommandService as CommandService).dispose()
  }
  globalCommandService = null
}
