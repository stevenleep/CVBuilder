/**
 * 扩展协议 - 类似 VSCode 的扩展系统
 * 
 * 提供完整的扩展能力，支持插件、主题、物料包等
 * 
 * @packageDocumentation
 */

// 使用本地类型定义以避免外部依赖
export type JSONSchema7 = Record<string, unknown>
import type { SemanticVersion, I18nString } from '../material/MaterialProtocol'

// ==================== 扩展协议 URI ====================

export const EXTENSION_PROTOCOL_URI = 'lcedit://protocols/extension/v1' as const

// ==================== 扩展清单 ====================

/**
 * 扩展清单
 * 
 * 类似 VSCode 的 package.json
 */
export interface ExtensionManifest {
  /** 协议版本 */
  readonly $protocol: typeof EXTENSION_PROTOCOL_URI
  
  /** 扩展 ID（全局唯一） */
  readonly id: string
  
  /** 扩展名称 */
  readonly name: string
  
  /** 显示名称 */
  readonly displayName: I18nString
  
  /** 扩展版本 */
  readonly version: SemanticVersion
  
  /** 扩展类型 */
  readonly type: ExtensionType
  
  /** 扩展描述 */
  readonly description?: I18nString
  
  /** 扩展元数据 */
  readonly metadata: ExtensionMetadata
  
  /** 引擎要求 */
  readonly engines: {
    readonly lcedit: string  // 例如: "^1.0.0"
    readonly node?: string
  }
  
  /** 激活事件 */
  readonly activationEvents: readonly ActivationEvent[]
  
  /** 贡献点 */
  readonly contributes: ExtensionContributions
  
  /** 依赖 */
  readonly dependencies?: ExtensionDependencies
  
  /** 能力要求 */
  readonly capabilities?: CapabilityRequirements
  
  /** 扩展配置 */
  readonly configuration?: ExtensionConfiguration
  
  /** 入口文件 */
  readonly main?: string
  
  /** 浏览器入口 */
  readonly browser?: string
  
  /** 扩展脚本 */
  readonly scripts?: Record<string, string>
}

/**
 * 扩展类型
 */
export type ExtensionType =
  | 'plugin'           // 插件（添加功能）
  | 'theme'            // 主题（UI 样式）
  | 'material-pack'    // 物料包（一组物料）
  | 'datasource'       // 数据源适配器
  | 'language'         // 语言包（国际化）
  | 'renderer-pack'    // 渲染器包
  | 'template-pack'    // 模板包
  | 'integration'      // 第三方集成

/**
 * 扩展元数据
 */
export interface ExtensionMetadata {
  /** 发布者 */
  readonly publisher: string
  
  /** 作者 */
  readonly author?: string | {
    readonly name: string
    readonly email?: string
    readonly url?: string
  }
  
  /** 贡献者 */
  readonly contributors?: readonly string[]
  
  /** 许可证 */
  readonly license?: string
  
  /** 图标 */
  readonly icon?: string
  
  /** 类别 */
  readonly categories?: readonly ExtensionCategory[]
  
  /** 标签 */
  readonly tags?: readonly string[]
  
  /** 关键词 */
  readonly keywords?: readonly string[]
  
  /** 主页 */
  readonly homepage?: string
  
  /** 仓库 */
  readonly repository?: {
    readonly type: 'git' | 'svn'
    readonly url: string
  }
  
  /** Bug 追踪 */
  readonly bugs?: {
    readonly url: string
    readonly email?: string
  }
  
  /** 文档 */
  readonly documentation?: string
  
  /** 变更日志 */
  readonly changelog?: string
  
  /** 定价 */
  readonly pricing?: 'free' | 'trial' | 'paid'
  
  /** 预览版 */
  readonly preview?: boolean
  
  /** 发布日期 */
  readonly publishedAt?: string
  
  /** 更新日期 */
  readonly updatedAt?: string
}

/**
 * 扩展分类
 */
export type ExtensionCategory =
  | 'Programming Languages'
  | 'Snippets'
  | 'Linters'
  | 'Themes'
  | 'Debuggers'
  | 'Formatters'
  | 'Keymaps'
  | 'SCM Providers'
  | 'Extension Packs'
  | 'Language Packs'
  | 'Data Science'
  | 'Machine Learning'
  | 'Visualization'
  | 'Education'
  | 'Testing'

/**
 * 激活事件
 * 
 * 定义扩展何时被激活
 */
export type ActivationEvent =
  | 'onStartup'                              // 启动时激活
  | 'onCommand:${string}'                    // 命令执行时
  | 'onMaterial:${string}'                   // 物料使用时
  | 'onLanguage:${string}'                   // 语言切换时
  | 'onView:${string}'                       // 视图打开时
  | 'onUri'                                  // URI 打开时
  | 'onWebviewPanel:${string}'               // Webview 面板打开时
  | 'onCustomEditor:${string}'               // 自定义编辑器
  | 'onDebug'                                // 调试会话
  | 'onDebugInitialConfigurations'           // 调试初始配置
  | 'onDebugResolve:${string}'               // 调试解析
  | 'onAuthenticationRequest:${string}'      // 认证请求
  | 'onFileSystem:${string}'                 // 文件系统
  | 'onSearch:${string}'                     // 搜索
  | 'onNotebook:${string}'                   // 笔记本
  | 'onTaskType:${string}'                   // 任务类型
  | string                                    // 自定义激活事件

// ==================== 贡献点系统 ====================

/**
 * 扩展贡献点
 * 
 * 定义扩展可以贡献的内容
 */
export interface ExtensionContributions {
  /** 贡献物料 */
  readonly materials?: readonly MaterialContribution[]
  
  /** 贡献命令 */
  readonly commands?: readonly CommandContribution[]
  
  /** 贡献菜单 */
  readonly menus?: MenuContributions
  
  /** 贡献快捷键 */
  readonly keybindings?: readonly KeybindingContribution[]
  
  /** 贡献视图 */
  readonly views?: ViewContributions
  
  /** 贡献面板 */
  readonly panels?: readonly PanelContribution[]
  
  /** 贡献工具栏 */
  readonly toolbars?: readonly ToolbarContribution[]
  
  /** 贡献主题 */
  readonly themes?: readonly ThemeContribution[]
  
  /** 贡献图标主题 */
  readonly iconThemes?: readonly IconThemeContribution[]
  
  /** 贡献语言 */
  readonly languages?: readonly LanguageContribution[]
  
  /** 贡献语法高亮 */
  readonly grammars?: readonly GrammarContribution[]
  
  /** 贡献代码片段 */
  readonly snippets?: readonly SnippetContribution[]
  
  /** 贡献数据源 */
  readonly datasources?: readonly DatasourceContribution[]
  
  /** 贡献渲染器 */
  readonly renderers?: readonly RendererContribution[]
  
  /** 贡献验证器 */
  readonly validators?: readonly ValidatorContribution[]
  
  /** 贡献转换器 */
  readonly transformers?: readonly TransformerContribution[]
  
  /** 贡献模板 */
  readonly templates?: readonly TemplateContribution[]
  
  /** 贡献问题匹配器 */
  readonly problemMatchers?: readonly ProblemMatcherContribution[]
  
  /** 贡献任务定义 */
  readonly taskDefinitions?: readonly TaskDefinitionContribution[]
  
  /** 贡献调试器 */
  readonly debuggers?: readonly DebuggerContribution[]
  
  /** 贡献终端配置 */
  readonly terminal?: TerminalContribution
  
  /** 贡献认证提供者 */
  readonly authentication?: readonly AuthenticationContribution[]
  
  /** 贡献 Webview */
  readonly webviews?: readonly WebviewContribution[]
  
  /** 贡献自定义编辑器 */
  readonly customEditors?: readonly CustomEditorContribution[]
  
  /** 贡献 SCM */
  readonly scm?: readonly SCMContribution[]
}

/**
 * 物料贡献
 */
export interface MaterialContribution {
  /** 物料 ID */
  readonly id: string
  
  /** 物料文件路径 */
  readonly path: string
  
  /** 是否默认启用 */
  readonly enabled?: boolean
}

/**
 * 命令贡献
 */
export interface CommandContribution {
  /** 命令 ID */
  readonly command: string
  
  /** 命令标题 */
  readonly title: I18nString
  
  /** 命令分类 */
  readonly category?: string
  
  /** 命令图标 */
  readonly icon?: IconReference
  
  /** 启用条件 */
  readonly enablement?: WhenClause
  
  /** 快捷键 */
  readonly keybinding?: KeyBinding
}

/**
 * 图标引用
 */
export type IconReference =
  | string                                    // 图标 ID
  | {
      readonly light: string                  // 浅色主题图标
      readonly dark: string                   // 深色主题图标
    }

/**
 * When 子句
 * 
 * 条件表达式，类似 VSCode 的 when 语法
 */
export type WhenClause = string

/**
 * 键绑定
 */
export interface KeyBinding {
  /** 按键组合 */
  readonly key: string
  
  /** Mac 按键组合 */
  readonly mac?: string
  
  /** Linux 按键组合 */
  readonly linux?: string
  
  /** Windows 按键组合 */
  readonly win?: string
  
  /** 启用条件 */
  readonly when?: WhenClause
}

/**
 * 菜单贡献
 */
export interface MenuContributions {
  /** 命令面板 */
  readonly commandPalette?: readonly MenuItemContribution[]
  
  /** 编辑器上下文菜单 */
  readonly 'editor/context'?: readonly MenuItemContribution[]
  
  /** 编辑器标题菜单 */
  readonly 'editor/title'?: readonly MenuItemContribution[]
  
  /** 编辑器标题上下文菜单 */
  readonly 'editor/title/context'?: readonly MenuItemContribution[]
  
  /** 资源管理器上下文菜单 */
  readonly 'explorer/context'?: readonly MenuItemContribution[]
  
  /** 视图标题 */
  readonly 'view/title'?: readonly MenuItemContribution[]
  
  /** 视图项上下文 */
  readonly 'view/item/context'?: readonly MenuItemContribution[]
  
  /** SCM 标题 */
  readonly 'scm/title'?: readonly MenuItemContribution[]
  
  /** 调试工具栏 */
  readonly 'debug/toolbar'?: readonly MenuItemContribution[]
  
  /** 终端上下文 */
  readonly 'terminal/context'?: readonly MenuItemContribution[]
  
  /** 自定义菜单 */
  readonly [key: `custom/${string}`]: readonly MenuItemContribution[] | undefined
}

/**
 * 菜单项贡献
 */
export interface MenuItemContribution {
  /** 命令 ID */
  readonly command: string
  
  /** 显示条件 */
  readonly when?: WhenClause
  
  /** 分组 */
  readonly group?: string
  
  /** 是否为替代命令 */
  readonly alt?: string
}

/**
 * 快捷键贡献
 */
export interface KeybindingContribution {
  /** 命令 ID */
  readonly command: string
  
  /** 键绑定 */
  readonly key: string
  
  /** Mac 键绑定 */
  readonly mac?: string
  
  /** Linux 键绑定 */
  readonly linux?: string
  
  /** Windows 键绑定 */
  readonly win?: string
  
  /** 启用条件 */
  readonly when?: WhenClause
  
  /** 参数 */
  readonly args?: unknown
}

/**
 * 视图贡献
 */
export interface ViewContributions {
  /** 侧边栏视图容器 */
  readonly 'sidebar'?: readonly ViewContainerContribution[]
  
  /** 面板视图容器 */
  readonly 'panel'?: readonly ViewContainerContribution[]
  
  /** 自定义视图容器 */
  readonly [key: string]: readonly ViewContainerContribution[] | undefined
}

/**
 * 视图容器贡献
 */
export interface ViewContainerContribution {
  /** 视图容器 ID */
  readonly id: string
  
  /** 标题 */
  readonly title: I18nString
  
  /** 图标 */
  readonly icon: string
  
  /** 视图列表 */
  readonly views: readonly ViewContribution[]
}

/**
 * 视图贡献
 */
export interface ViewContribution {
  /** 视图 ID */
  readonly id: string
  
  /** 视图名称 */
  readonly name: I18nString
  
  /** 显示条件 */
  readonly when?: WhenClause
  
  /** 视图类型 */
  readonly type?: 'tree' | 'webview' | 'custom'
  
  /** 初始大小 */
  readonly size?: number
  
  /** 是否可见 */
  readonly visibility?: 'visible' | 'hidden' | 'collapsed'
}

/**
 * 面板贡献
 */
export interface PanelContribution {
  /** 面板 ID */
  readonly id: string
  
  /** 面板标题 */
  readonly title: I18nString
  
  /** 面板图标 */
  readonly icon?: string
  
  /** 面板位置 */
  readonly location: 'left' | 'right' | 'bottom' | 'float'
  
  /** 默认宽度/高度 */
  readonly size?: number
  
  /** 最小尺寸 */
  readonly minSize?: number
  
  /** 最大尺寸 */
  readonly maxSize?: number
  
  /** 是否可关闭 */
  readonly closable?: boolean
  
  /** 是否可调整大小 */
  readonly resizable?: boolean
  
  /** 显示条件 */
  readonly when?: WhenClause
}

/**
 * 工具栏贡献
 */
export interface ToolbarContribution {
  /** 工具栏 ID */
  readonly id: string
  
  /** 工具栏项 */
  readonly items: readonly ToolbarItemContribution[]
  
  /** 位置 */
  readonly location: 'top' | 'bottom' | 'left' | 'right'
  
  /** 显示条件 */
  readonly when?: WhenClause
}

/**
 * 工具栏项贡献
 */
export interface ToolbarItemContribution {
  /** 命令 ID */
  readonly command: string
  
  /** 图标 */
  readonly icon?: string
  
  /** 标题 */
  readonly title?: I18nString
  
  /** 工具提示 */
  readonly tooltip?: I18nString
  
  /** 显示条件 */
  readonly when?: WhenClause
  
  /** 分组 */
  readonly group?: string
  
  /** 顺序 */
  readonly order?: number
}

/**
 * 主题贡献
 */
export interface ThemeContribution {
  /** 主题 ID */
  readonly id: string
  
  /** 主题标签 */
  readonly label: I18nString
  
  /** UI 主题 */
  readonly uiTheme: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light'
  
  /** 主题文件路径 */
  readonly path: string
}

/**
 * 图标主题贡献
 */
export interface IconThemeContribution {
  /** 图标主题 ID */
  readonly id: string
  
  /** 图标主题标签 */
  readonly label: I18nString
  
  /** 图标主题文件路径 */
  readonly path: string
}

/**
 * 语言贡献
 */
export interface LanguageContribution {
  /** 语言 ID */
  readonly id: string
  
  /** 语言别名 */
  readonly aliases?: readonly string[]
  
  /** 文件扩展名 */
  readonly extensions?: readonly string[]
  
  /** 文件名 */
  readonly filenames?: readonly string[]
  
  /** 文件名模式 */
  readonly filenamePatterns?: readonly string[]
  
  /** 第一行匹配 */
  readonly firstLine?: string
  
  /** 语言配置文件 */
  readonly configuration?: string
  
  /** MIME 类型 */
  readonly mimetypes?: readonly string[]
}

/**
 * 语法高亮贡献
 */
export interface GrammarContribution {
  /** 语言 ID */
  readonly language: string
  
  /** Scope 名称 */
  readonly scopeName: string
  
  /** 语法文件路径 */
  readonly path: string
  
  /** 嵌入语言 */
  readonly embeddedLanguages?: Record<string, string>
  
  /** Token 类型 */
  readonly tokenTypes?: Record<string, string>
  
  /** 注入到的语法 */
  readonly injectTo?: readonly string[]
}

/**
 * 代码片段贡献
 */
export interface SnippetContribution {
  /** 语言 ID */
  readonly language: string
  
  /** 代码片段文件路径 */
  readonly path: string
}

/**
 * 数据源贡献
 */
export interface DatasourceContribution {
  /** 数据源类型 */
  readonly type: string
  
  /** 数据源名称 */
  readonly name: I18nString
  
  /** 数据源适配器路径 */
  readonly adapter: string
  
  /** 配置 Schema */
  readonly configSchema?: JSONSchema7
}

/**
 * 渲染器贡献
 */
export interface RendererContribution {
  /** 渲染器类型 */
  readonly type: string
  
  /** 渲染器名称 */
  readonly name: I18nString
  
  /** 渲染器路径 */
  readonly path: string
  
  /** 支持的字段类型 */
  readonly fieldTypes: readonly string[]
}

/**
 * 验证器贡献
 */
export interface ValidatorContribution {
  /** 验证器 ID */
  readonly id: string
  
  /** 验证器名称 */
  readonly name: I18nString
  
  /** 验证器路径 */
  readonly path: string
}

/**
 * 转换器贡献
 */
export interface TransformerContribution {
  /** 转换器 ID */
  readonly id: string
  
  /** 转换器名称 */
  readonly name: I18nString
  
  /** 转换器路径 */
  readonly path: string
  
  /** 源类型 */
  readonly sourceType: string
  
  /** 目标类型 */
  readonly targetType: string
}

/**
 * 模板贡献
 */
export interface TemplateContribution {
  /** 模板 ID */
  readonly id: string
  
  /** 模板名称 */
  readonly name: I18nString
  
  /** 模板描述 */
  readonly description?: I18nString
  
  /** 模板文件路径 */
  readonly path: string
  
  /** 模板缩略图 */
  readonly thumbnail?: string
  
  /** 模板分类 */
  readonly category?: string
  
  /** 模板标签 */
  readonly tags?: readonly string[]
}

/**
 * 问题匹配器贡献
 */
export interface ProblemMatcherContribution {
  /** 匹配器名称 */
  readonly name: string
  
  /** 文件位置 */
  readonly fileLocation?: 'absolute' | 'relative' | readonly string[]
  
  /** 模式 */
  readonly pattern: ProblemPattern | readonly ProblemPattern[]
  
  /** 背景 */
  readonly background?: {
    readonly activeOnStart?: boolean
    readonly beginsPattern?: string | ProblemPattern
    readonly endsPattern?: string | ProblemPattern
  }
}

/**
 * 问题模式
 */
export interface ProblemPattern {
  /** 正则表达式 */
  readonly regexp: string
  
  /** 文件 */
  readonly file?: number
  
  /** 位置 */
  readonly location?: number
  
  /** 行 */
  readonly line?: number
  
  /** 列 */
  readonly column?: number
  
  /** 结束行 */
  readonly endLine?: number
  
  /** 结束列 */
  readonly endColumn?: number
  
  /** 严重程度 */
  readonly severity?: number
  
  /** 代码 */
  readonly code?: number
  
  /** 消息 */
  readonly message: number
  
  /** 循环 */
  readonly loop?: boolean
}

/**
 * 任务定义贡献
 */
export interface TaskDefinitionContribution {
  /** 任务类型 */
  readonly type: string
  
  /** 任务 Schema */
  readonly schema: JSONSchema7
  
  /** 必需属性 */
  readonly required?: readonly string[]
}

/**
 * 调试器贡献
 */
export interface DebuggerContribution {
  /** 调试器类型 */
  readonly type: string
  
  /** 调试器标签 */
  readonly label: I18nString
  
  /** 调试器语言 */
  readonly languages?: readonly string[]
  
  /** 配置 Schema */
  readonly configurationSchema?: JSONSchema7
  
  /** 初始配置 */
  readonly initialConfigurations?: readonly unknown[]
  
  /** 配置片段 */
  readonly configurationSnippets?: readonly unknown[]
}

/**
 * 终端贡献
 */
export interface TerminalContribution {
  /** 终端配置文件 */
  readonly profiles?: readonly TerminalProfileContribution[]
  
  /** 终端链接提供者 */
  readonly linkProviders?: readonly string[]
}

/**
 * 终端配置文件贡献
 */
export interface TerminalProfileContribution {
  /** 配置文件 ID */
  readonly id: string
  
  /** 配置文件标题 */
  readonly title: I18nString
  
  /** 图标 */
  readonly icon?: string
}

/**
 * 认证贡献
 */
export interface AuthenticationContribution {
  /** 认证 ID */
  readonly id: string
  
  /** 认证标签 */
  readonly label: I18nString
}

/**
 * Webview 贡献
 */
export interface WebviewContribution {
  /** Webview ID */
  readonly id: string
  
  /** Webview 标题 */
  readonly title: I18nString
  
  /** Webview 路径 */
  readonly path: string
}

/**
 * 自定义编辑器贡献
 */
export interface CustomEditorContribution {
  /** 编辑器 ID */
  readonly viewType: string
  
  /** 显示名称 */
  readonly displayName: I18nString
  
  /** 选择器 */
  readonly selector: readonly {
    readonly filenamePattern?: string
  }[]
  
  /** 优先级 */
  readonly priority?: 'default' | 'option'
}

/**
 * SCM 贡献
 */
export interface SCMContribution {
  /** SCM ID */
  readonly id: string
  
  /** SCM 标签 */
  readonly label: I18nString
}

// ==================== 依赖系统 ====================

/**
 * 扩展依赖
 */
export interface ExtensionDependencies {
  /** 扩展依赖 */
  readonly extensions?: Record<string, string>
  
  /** NPM 依赖 */
  readonly npm?: Record<string, string>
  
  /** 可选依赖 */
  readonly optional?: Record<string, string>
  
  /** Peer 依赖 */
  readonly peer?: Record<string, string>
}

// ==================== 能力系统 ====================

/**
 * 能力要求
 */
export interface CapabilityRequirements {
  /** 网络访问 */
  readonly network?: NetworkCapability
  
  /** 文件系统访问 */
  readonly filesystem?: FilesystemCapability
  
  /** 剪贴板访问 */
  readonly clipboard?: boolean
  
  /** 通知 */
  readonly notifications?: boolean
  
  /** 存储 */
  readonly storage?: StorageCapability
  
  /** Web Worker */
  readonly webworker?: boolean
  
  /** WebView */
  readonly webview?: boolean
  
  /** 原生模块 */
  readonly nativeModules?: boolean
  
  /** 调试 */
  readonly debug?: boolean
  
  /** 终端 */
  readonly terminal?: boolean
  
  /** 认证 */
  readonly authentication?: boolean
  
  /** 远程 */
  readonly remote?: boolean
}

/**
 * 网络能力
 */
export interface NetworkCapability {
  /** 是否需要网络 */
  readonly required: boolean
  
  /** 允许的域名 */
  readonly allowedDomains?: readonly string[]
  
  /** 允许的协议 */
  readonly allowedProtocols?: readonly ('http' | 'https' | 'ws' | 'wss')[]
}

/**
 * 文件系统能力
 */
export interface FilesystemCapability {
  /** 读取权限 */
  readonly read?: boolean
  
  /** 写入权限 */
  readonly write?: boolean
  
  /** 允许的路径 */
  readonly allowedPaths?: readonly string[]
}

/**
 * 存储能力
 */
export interface StorageCapability {
  /** 全局存储 */
  readonly global?: boolean
  
  /** 工作区存储 */
  readonly workspace?: boolean
  
  /** 最大容量（字节） */
  readonly maxSize?: number
}

// ==================== 扩展配置 ====================

/**
 * 扩展配置
 */
export interface ExtensionConfiguration {
  /** 配置标题 */
  readonly title: I18nString
  
  /** 配置属性 */
  readonly properties: Record<string, ConfigurationProperty>
}

/**
 * 配置属性
 */
export interface ConfigurationProperty {
  /** 类型 */
  readonly type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  
  /** 描述 */
  readonly description: I18nString
  
  /** 默认值 */
  readonly default?: unknown
  
  /** 枚举值 */
  readonly enum?: readonly unknown[]
  
  /** 枚举描述 */
  readonly enumDescriptions?: readonly I18nString[]
  
  /** 最小值 */
  readonly minimum?: number
  
  /** 最大值 */
  readonly maximum?: number
  
  /** 作用域 */
  readonly scope?: 'application' | 'window' | 'resource' | 'language-overridable' | 'machine' | 'machine-overridable'
  
  /** 顺序 */
  readonly order?: number
  
  /** 废弃信息 */
  readonly deprecated?: boolean | string
  
  /** 废弃消息 */
  readonly deprecationMessage?: I18nString
  
  /** 是否可编辑 */
  readonly editPresentation?: 'singlelineText' | 'multilineText'
}

