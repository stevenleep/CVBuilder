/**
 * 命令协议 - 类似 VSCode 的命令系统
 * 
 * 提供完整的命令定义、执行和管理能力
 * 
 * @packageDocumentation
 */

import type { I18nString } from '../material/MaterialProtocol'
import type { WhenClause, IconReference } from '../extension/ExtensionProtocol'

// ==================== 命令协议 URI ====================

export const COMMAND_PROTOCOL_URI = 'lcedit://protocols/command/v1' as const

// ==================== 命令定义 ====================

/**
 * 命令定义
 * 
 * 定义一个可执行的命令
 */
export interface CommandDefinition {
  /** 协议版本 */
  readonly $protocol: typeof COMMAND_PROTOCOL_URI
  
  /** 命令 ID（全局唯一） */
  readonly id: string
  
  /** 命令标题 */
  readonly title: I18nString
  
  /** 命令描述 */
  readonly description?: I18nString
  
  /** 命令分类 */
  readonly category?: I18nString
  
  /** 命令图标 */
  readonly icon?: IconReference
  
  /** 命令别名 */
  readonly alias?: readonly string[]
  
  /** 命令参数 Schema */
  readonly arguments?: readonly CommandArgument[]
  
  /** 返回值 Schema */
  readonly returns?: CommandReturn
  
  /** 启用条件 */
  readonly enablement?: WhenClause
  
  /** 可见性条件 */
  readonly when?: WhenClause
  
  /** 命令快捷键 */
  readonly keybinding?: CommandKeybinding
  
  /** 是否内部命令 */
  readonly internal?: boolean
  
  /** 命令优先级 */
  readonly priority?: number
  
  /** 命令标签 */
  readonly tags?: readonly string[]
  
  /** 命令元数据 */
  readonly metadata?: CommandMetadata
}

/**
 * 命令参数
 */
export interface CommandArgument {
  /** 参数名称 */
  readonly name: string
  
  /** 参数类型 */
  readonly type: CommandArgumentType
  
  /** 参数描述 */
  readonly description?: I18nString
  
  /** 是否必需 */
  readonly required?: boolean
  
  /** 默认值 */
  readonly default?: unknown
  
  /** 验证规则 */
  readonly validation?: CommandArgumentValidation
}

/**
 * 命令参数类型
 */
export type CommandArgumentType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'uri'
  | 'position'
  | 'range'
  | 'selection'
  | 'node'
  | 'material'
  | 'custom'

/**
 * 命令参数验证
 */
export interface CommandArgumentValidation {
  /** 最小值 */
  readonly min?: number
  
  /** 最大值 */
  readonly max?: number
  
  /** 最小长度 */
  readonly minLength?: number
  
  /** 最大长度 */
  readonly maxLength?: number
  
  /** 正则表达式 */
  readonly pattern?: string
  
  /** 枚举值 */
  readonly enum?: readonly unknown[]
  
  /** 自定义验证函数 */
  readonly custom?: (value: unknown) => boolean | string
}

/**
 * 命令返回值
 */
export interface CommandReturn {
  /** 返回值类型 */
  readonly type: CommandArgumentType
  
  /** 返回值描述 */
  readonly description?: I18nString
}

/**
 * 命令快捷键
 */
export interface CommandKeybinding {
  /** 主快捷键 */
  readonly primary: string
  
  /** 次要快捷键 */
  readonly secondary?: readonly string[]
  
  /** Mac 快捷键 */
  readonly mac?: string
  
  /** Linux 快捷键 */
  readonly linux?: string
  
  /** Windows 快捷键 */
  readonly win?: string
  
  /** 启用条件 */
  readonly when?: WhenClause
}

/**
 * 命令元数据
 */
export interface CommandMetadata {
  /** 命令来源 */
  readonly source?: string
  
  /** 命令版本 */
  readonly version?: string
  
  /** 命令作者 */
  readonly author?: string
  
  /** 命令文档 */
  readonly documentation?: string
  
  /** 是否实验性 */
  readonly experimental?: boolean
  
  /** 是否废弃 */
  readonly deprecated?: boolean
  
  /** 废弃原因 */
  readonly deprecationReason?: I18nString
  
  /** 替代命令 */
  readonly alternative?: string
  
  /** 自定义元数据 */
  readonly [key: `x-${string}`]: unknown
}

// ==================== 命令执行 ====================

/**
 * 命令执行器
 */
export interface CommandExecutor {
  /** 命令 ID */
  readonly commandId: string
  
  /** 执行函数 */
  readonly execute: CommandExecuteFunction
  
  /** 验证函数 */
  readonly validate?: CommandValidateFunction
  
  /** 是否异步 */
  readonly async?: boolean
  
  /** 超时时间（毫秒） */
  readonly timeout?: number
}

/**
 * 命令执行函数
 */
export type CommandExecuteFunction<TArgs extends unknown[] = unknown[], TReturn = unknown> = (
  context: CommandExecutionContext,
  ...args: TArgs
) => TReturn | Promise<TReturn>

/**
 * 命令验证函数
 */
export type CommandValidateFunction<TArgs extends unknown[] = unknown[]> = (
  context: CommandExecutionContext,
  ...args: TArgs
) => boolean | string | Promise<boolean | string>

/**
 * 命令执行上下文
 */
export interface CommandExecutionContext {
  /** 命令 ID */
  readonly commandId: string
  
  /** 命令参数 */
  readonly args: readonly unknown[]
  
  /** 执行时间戳 */
  readonly timestamp: number
  
  /** 执行来源 */
  readonly source: CommandSource
  
  /** 编辑器状态 */
  readonly editorState: EditorState
  
  /** 当前选中的节点 */
  readonly selectedNodes: readonly string[]
  
  /** 当前活动节点 */
  readonly activeNode?: string
  
  /** 编辑器服务 */
  readonly services: CommandServices
  
  /** 取消令牌 */
  readonly cancellationToken: CancellationToken
  
  /** 进度报告器 */
  readonly progress: ProgressReporter
  
  /** 元数据 */
  readonly metadata: Record<string, unknown>
}

/**
 * 命令来源
 */
export type CommandSource =
  | 'menu'            // 菜单触发
  | 'keybinding'      // 快捷键触发
  | 'api'             // API 调用
  | 'palette'         // 命令面板
  | 'context-menu'    // 上下文菜单
  | 'toolbar'         // 工具栏
  | 'extension'       // 扩展触发
  | 'system'          // 系统触发
  | string            // 自定义来源

/**
 * 编辑器状态
 */
export interface EditorState {
  /** 是否有未保存的更改 */
  readonly isDirty: boolean
  
  /** 当前文档 ID */
  readonly documentId?: string
  
  /** 当前视口模式 */
  readonly viewportMode: 'desktop' | 'mobile' | string
  
  /** 当前主题 */
  readonly theme: string
  
  /** 当前语言 */
  readonly language: string
  
  /** 是否只读 */
  readonly readOnly: boolean
  
  /** 缩放级别 */
  readonly zoom: number
}

/**
 * 命令服务
 */
export interface CommandServices {
  /** 获取编辑器服务 */
  getEditorService: () => unknown
  
  /** 获取事件总线 */
  getEventBus: () => unknown
  
  /** 获取状态管理 */
  getStateManager: () => unknown
  
  /** 获取历史服务 */
  getHistoryService: () => unknown
  
  /** 获取插件管理器 */
  getPluginManager: () => unknown
  
  /** 获取自定义服务 */
  getService: <T>(serviceId: string) => T | undefined
  
  /** 执行命令 */
  executeCommand: <TReturn = unknown>(commandId: string, ...args: unknown[]) => Promise<TReturn>
  
  /** 触发事件 */
  emitEvent: (eventName: string, payload?: unknown) => void
  
  /** 显示消息 */
  showMessage: (message: string, type?: 'info' | 'warning' | 'error') => void
  
  /** 显示输入框 */
  showInputBox: (options: InputBoxOptions) => Promise<string | undefined>
  
  /** 显示选择框 */
  showQuickPick: <T>(items: readonly QuickPickItem<T>[], options?: QuickPickOptions) => Promise<T | undefined>
}

/**
 * 取消令牌
 */
export interface CancellationToken {
  /** 是否已取消 */
  readonly isCancellationRequested: boolean
  
  /** 取消事件 */
  readonly onCancellationRequested: (listener: () => void) => Disposable
}

/**
 * 进度报告器
 */
export interface ProgressReporter {
  /** 报告进度 */
  report: (value: ProgressValue) => void
}

/**
 * 进度值
 */
export interface ProgressValue {
  /** 消息 */
  readonly message?: string
  
  /** 增量（0-100） */
  readonly increment?: number
  
  /** 总进度（0-100） */
  readonly total?: number
}

/**
 * 输入框选项
 */
export interface InputBoxOptions {
  /** 标题 */
  readonly title?: string
  
  /** 提示 */
  readonly prompt?: string
  
  /** 占位符 */
  readonly placeholder?: string
  
  /** 默认值 */
  readonly value?: string
  
  /** 验证函数 */
  readonly validateInput?: (value: string) => string | undefined | Promise<string | undefined>
  
  /** 是否密码 */
  readonly password?: boolean
}

/**
 * 快速选择项
 */
export interface QuickPickItem<T = string> {
  /** 标签 */
  readonly label: string
  
  /** 描述 */
  readonly description?: string
  
  /** 详情 */
  readonly detail?: string
  
  /** 图标 */
  readonly iconPath?: string
  
  /** 值 */
  readonly value: T
  
  /** 是否选中 */
  readonly picked?: boolean
  
  /** 是否高亮 */
  readonly alwaysShow?: boolean
}

/**
 * 快速选择选项
 */
export interface QuickPickOptions {
  /** 标题 */
  readonly title?: string
  
  /** 占位符 */
  readonly placeHolder?: string
  
  /** 是否可多选 */
  readonly canPickMany?: boolean
  
  /** 是否忽略焦点变化 */
  readonly ignoreFocusOut?: boolean
  
  /** 匹配时是否高亮 */
  readonly matchOnDescription?: boolean
  
  /** 匹配时是否高亮详情 */
  readonly matchOnDetail?: boolean
}

/**
 * 可释放资源
 */
export interface Disposable {
  /** 释放资源 */
  dispose: () => void
}

// ==================== 命令结果 ====================

/**
 * 命令执行结果
 */
export interface CommandExecutionResult<TReturn = unknown> {
  /** 命令 ID */
  readonly commandId: string
  
  /** 是否成功 */
  readonly success: boolean
  
  /** 返回值 */
  readonly value?: TReturn
  
  /** 错误信息 */
  readonly error?: CommandExecutionError
  
  /** 执行时间（毫秒） */
  readonly duration: number
  
  /** 执行时间戳 */
  readonly timestamp: number
  
  /** 元数据 */
  readonly metadata?: Record<string, unknown>
}

/**
 * 命令执行错误
 */
export interface CommandExecutionError {
  /** 错误代码 */
  readonly code: string
  
  /** 错误消息 */
  readonly message: string
  
  /** 错误堆栈 */
  readonly stack?: string
  
  /** 错误详情 */
  readonly details?: unknown
  
  /** 是否可重试 */
  readonly retryable?: boolean
}

// ==================== 命令注册表 ====================

/**
 * 命令注册表接口
 */
export interface ICommandRegistry {
  /**
   * 注册命令定义
   */
  registerCommand(definition: CommandDefinition): Disposable
  
  /**
   * 注册命令执行器
   */
  registerExecutor(executor: CommandExecutor): Disposable
  
  /**
   * 取消注册命令
   */
  unregisterCommand(commandId: string): void
  
  /**
   * 获取命令定义
   */
  getCommand(commandId: string): CommandDefinition | undefined
  
  /**
   * 获取所有命令
   */
  getAllCommands(): readonly CommandDefinition[]
  
  /**
   * 搜索命令
   */
  searchCommands(query: string): readonly CommandDefinition[]
  
  /**
   * 检查命令是否存在
   */
  hasCommand(commandId: string): boolean
  
  /**
   * 检查命令是否已注册执行器
   */
  hasExecutor(commandId: string): boolean
  
  /**
   * 执行命令
   */
  executeCommand<TReturn = unknown>(
    commandId: string,
    ...args: unknown[]
  ): Promise<CommandExecutionResult<TReturn>>
  
  /**
   * 验证命令参数
   */
  validateCommand(commandId: string, ...args: unknown[]): boolean | string
  
  /**
   * 检查命令是否启用
   */
  isCommandEnabled(commandId: string, context?: Record<string, unknown>): boolean
  
  /**
   * 监听命令执行前
   */
  onWillExecuteCommand(
    listener: (event: CommandExecutionEvent) => void
  ): Disposable
  
  /**
   * 监听命令执行后
   */
  onDidExecuteCommand(
    listener: (event: CommandExecutionEvent) => void
  ): Disposable
  
  /**
   * 监听命令执行失败
   */
  onCommandExecutionFailed(
    listener: (event: CommandExecutionFailedEvent) => void
  ): Disposable
}

/**
 * 命令执行事件
 */
export interface CommandExecutionEvent {
  /** 命令 ID */
  readonly commandId: string
  
  /** 命令参数 */
  readonly args: readonly unknown[]
  
  /** 执行上下文 */
  readonly context: CommandExecutionContext
  
  /** 时间戳 */
  readonly timestamp: number
}

/**
 * 命令执行失败事件
 */
export interface CommandExecutionFailedEvent extends CommandExecutionEvent {
  /** 错误 */
  readonly error: CommandExecutionError
}

// ==================== 内置命令常量 ====================

/**
 * 内置命令 ID
 */
export const BuiltInCommands = {
  // 编辑器命令
  UNDO: 'editor.undo',
  REDO: 'editor.redo',
  CUT: 'editor.cut',
  COPY: 'editor.copy',
  PASTE: 'editor.paste',
  DELETE: 'editor.delete',
  SELECT_ALL: 'editor.selectAll',
  SAVE: 'editor.save',
  SAVE_AS: 'editor.saveAs',
  OPEN: 'editor.open',
  CLOSE: 'editor.close',
  
  // 节点命令
  NODE_CREATE: 'node.create',
  NODE_DELETE: 'node.delete',
  NODE_DUPLICATE: 'node.duplicate',
  NODE_MOVE: 'node.move',
  NODE_UPDATE: 'node.update',
  NODE_LOCK: 'node.lock',
  NODE_UNLOCK: 'node.unlock',
  NODE_SHOW: 'node.show',
  NODE_HIDE: 'node.hide',
  NODE_GROUP: 'node.group',
  NODE_UNGROUP: 'node.ungroup',
  
  // 视图命令
  VIEW_ZOOM_IN: 'view.zoomIn',
  VIEW_ZOOM_OUT: 'view.zoomOut',
  VIEW_ZOOM_RESET: 'view.zoomReset',
  VIEW_FIT_TO_CONTENT: 'view.fitToContent',
  VIEW_TOGGLE_GRID: 'view.toggleGrid',
  VIEW_TOGGLE_RULERS: 'view.toggleRulers',
  VIEW_TOGGLE_GUIDES: 'view.toggleGuides',
  
  // 导出命令
  EXPORT_PNG: 'export.png',
  EXPORT_SVG: 'export.svg',
  EXPORT_PDF: 'export.pdf',
  EXPORT_JSON: 'export.json',
  EXPORT_HTML: 'export.html',
  
  // 插件命令
  PLUGIN_INSTALL: 'plugin.install',
  PLUGIN_UNINSTALL: 'plugin.uninstall',
  PLUGIN_ENABLE: 'plugin.enable',
  PLUGIN_DISABLE: 'plugin.disable',
  PLUGIN_RELOAD: 'plugin.reload',
  
  // 主题命令
  THEME_CHANGE: 'theme.change',
  THEME_RELOAD: 'theme.reload',
  
  // 帮助命令
  HELP_SHOW: 'help.show',
  HELP_SHORTCUTS: 'help.shortcuts',
  HELP_ABOUT: 'help.about',
  HELP_DOCUMENTATION: 'help.documentation',
} as const

/**
 * 命令分类
 */
export const CommandCategories = {
  EDITOR: { en: 'Editor', 'zh-CN': '编辑器' },
  NODE: { en: 'Node', 'zh-CN': '节点' },
  VIEW: { en: 'View', 'zh-CN': '视图' },
  EXPORT: { en: 'Export', 'zh-CN': '导出' },
  PLUGIN: { en: 'Plugin', 'zh-CN': '插件' },
  THEME: { en: 'Theme', 'zh-CN': '主题' },
  HELP: { en: 'Help', 'zh-CN': '帮助' },
} as const

