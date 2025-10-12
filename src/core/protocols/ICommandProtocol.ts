/**
 * 命令系统协议
 *
 * 定义命令模式的完整接口，支持撤销/重做、批处理等
 */

/**
 * 命令上下文
 */
export interface ICommandContext {
  /** 选中的节点IDs */
  selectedNodeIds: string[]
  /** 当前页面Schema */
  pageSchema: any
  /** 编辑器状态 */
  editorState: any
  /** 命令参数 */
  args?: any
  /** 额外的元数据 */
  metadata?: Record<string, any>
}

/**
 * 命令执行结果
 */
export interface ICommandResult {
  /** 是否成功 */
  success: boolean
  /** 结果数据 */
  data?: any
  /** 错误信息 */
  error?: Error
  /** 执行时间（毫秒） */
  duration?: number
}

/**
 * 可撤销的命令接口
 */
export interface IUndoableCommand {
  /** 执行命令 */
  execute(context: ICommandContext): Promise<ICommandResult> | ICommandResult
  /** 撤销命令 */
  undo(context: ICommandContext): Promise<ICommandResult> | ICommandResult
  /** 重做命令 */
  redo?(context: ICommandContext): Promise<ICommandResult> | ICommandResult
}

/**
 * 命令定义
 */
export interface ICommand extends IUndoableCommand {
  /** 命令ID */
  id: string
  /** 命令名称 */
  name: string
  /** 命令描述 */
  description?: string
  /** 命令图标 */
  icon?: string
  /** 命令分类 */
  category?: string
  /** 是否可撤销 */
  undoable: boolean
  /** 是否可用 */
  canExecute?: (context: ICommandContext) => boolean | Promise<boolean>
  /** 是否合并相同命令（用于连续的相似操作） */
  mergeable?: boolean
  /** 合并逻辑 */
  merge?: (previousCommand: ICommand) => ICommand | null
}

/**
 * 命令组（批量命令）
 */
export interface ICommandBatch {
  /** 批次ID */
  id: string
  /** 批次名称 */
  name: string
  /** 命令列表 */
  commands: ICommand[]
  /** 是否原子操作（全部成功或全部失败） */
  atomic?: boolean
}

/**
 * 命令拦截器
 */
export interface ICommandInterceptor {
  /** 拦截器名称 */
  name: string
  /** 执行前拦截 */
  beforeExecute?: (command: ICommand, context: ICommandContext) => boolean | Promise<boolean>
  /** 执行后拦截 */
  afterExecute?: (
    command: ICommand,
    context: ICommandContext,
    result: ICommandResult
  ) => void | Promise<void>
  /** 优先级（越大越先执行） */
  priority?: number
}

/**
 * 命令服务接口
 */
export interface ICommandService {
  /** 注册命令 */
  register(command: ICommand): void

  /** 批量注册 */
  registerAll(commands: ICommand[]): void

  /** 注销命令 */
  unregister(commandId: string): void

  /** 获取命令 */
  get(commandId: string): ICommand | undefined

  /** 获取所有命令 */
  getAll(): ICommand[]

  /** 按分类获取 */
  getByCategory(category: string): ICommand[]

  /** 执行命令 */
  execute(commandId: string, args?: any): Promise<ICommandResult>

  /** 批量执行命令 */
  executeBatch(batch: ICommandBatch): Promise<ICommandResult[]>

  /** 检查命令是否可执行 */
  canExecute(commandId: string): Promise<boolean>

  /** 添加拦截器 */
  addInterceptor(interceptor: ICommandInterceptor): void

  /** 移除拦截器 */
  removeInterceptor(name: string): void

  /** 清空所有命令 */
  clear(): void
}

/**
 * 命令快捷键映射
 */
export interface ICommandShortcut {
  /** 命令ID */
  commandId: string
  /** 快捷键组合 */
  key: string
  /** 是否需要 Ctrl/Cmd */
  ctrl?: boolean
  /** 是否需要 Shift */
  shift?: boolean
  /** 是否需要 Alt */
  alt?: boolean
  /** 描述 */
  description?: string
  /** 是否全局 */
  global?: boolean
  /** 是否启用 */
  enabled?: boolean
}
