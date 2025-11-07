/**
 * 插件协议 - 类似 VSCode 的插件系统
 * 
 * 提供完整的插件生命周期管理和上下文 API
 * 
 * @packageDocumentation
 */

import type { I18nString, SemanticVersion, MaterialDefinition } from '../material/MaterialProtocol'
import type { CommandDefinition } from '../command/CommandProtocol'
import type { EventListener } from '../event/EventProtocol'

// ==================== 插件协议 URI ====================

export const PLUGIN_PROTOCOL_URI = 'lcedit://protocols/plugin/v1' as const

// ==================== 插件定义 ====================

/**
 * 插件定义
 */
export interface PluginDefinition {
  /** 协议版本 */
  readonly $protocol: typeof PLUGIN_PROTOCOL_URI
  
  /** 插件 ID（全局唯一） */
  readonly id: string
  
  /** 插件名称 */
  readonly name: I18nString
  
  /** 插件描述 */
  readonly description?: I18nString
  
  /** 插件版本 */
  readonly version: SemanticVersion
  
  /** 插件作者 */
  readonly author?: string
  
  /** 插件许可证 */
  readonly license?: string
  
  /** 插件主页 */
  readonly homepage?: string
  
  /** 插件仓库 */
  readonly repository?: string
  
  /** 激活函数 */
  readonly activate: PluginActivateFunction
  
  /** 停用函数 */
  readonly deactivate?: PluginDeactivateFunction
  
  /** 插件元数据 */
  readonly metadata?: PluginMetadata
}

/**
 * 插件激活函数
 */
export type PluginActivateFunction = (
  context: PluginContext
) => void | Promise<void>

/**
 * 插件停用函数
 */
export type PluginDeactivateFunction = () => void | Promise<void>

/**
 * 插件元数据
 */
export interface PluginMetadata {
  readonly displayName?: I18nString
  readonly icon?: string
  readonly keywords?: readonly string[]
  readonly categories?: readonly string[]
  readonly engines?: {
    readonly lcedit?: string
    readonly node?: string
  }
  /** 插件依赖 */
  readonly dependencies?: readonly PluginDependency[]
  readonly [key: `x-${string}`]: unknown
}

/**
 * 插件依赖
 */
export interface PluginDependency {
  readonly pluginId: string
  readonly version?: string
  readonly optional?: boolean
}

// ==================== 插件上下文 ====================

/**
 * 插件上下文
 * 
 * 提供插件运行时所需的所有 API
 */
export interface PluginContext {
  /** 插件 ID */
  readonly pluginId: string
  
  /** 插件路径 */
  readonly pluginPath: string
  
  /** 工作区路径 */
  readonly workspacePath: string
  
  /** 全局存储路径 */
  readonly globalStoragePath: string
  
  /** 订阅管理器 */
  readonly subscriptions: SubscriptionManager
  
  /** 物料 API */
  readonly materials: MaterialAPI
  
  /** 命令 API */
  readonly commands: CommandAPI
  
  /** 事件 API */
  readonly events: EventAPI
  
  /** UI API */
  readonly ui: UIAPI
  
  /** 存储 API */
  readonly storage: StorageAPI
  
  /** 数据 API */
  readonly data: DataAPI
  
  /** 服务 API */
  readonly services: ServiceAPI
  
  /** 工作区 API */
  readonly workspace: WorkspaceAPI
}

// ==================== 订阅管理器 ====================

/**
 * 订阅管理器
 * 
 * 管理插件创建的所有订阅，插件停用时自动清理
 */
export interface SubscriptionManager {
  /**
   * 添加订阅
   */
  push(...disposables: Disposable[]): void
  
  /**
   * 清理所有订阅
   */
  dispose(): void
}

export interface Disposable {
  dispose(): void
}

// ==================== 物料 API ====================

/**
 * 物料 API
 */
export interface MaterialAPI {
  /**
   * 注册物料
   */
  register(material: MaterialDefinition): Disposable
  
  /**
   * 获取物料
   */
  get(materialType: string): MaterialDefinition | undefined
  
  /**
   * 检查物料是否存在
   */
  has(materialType: string): boolean
  
  /**
   * 获取所有物料
   */
  getAll(): readonly MaterialDefinition[]
  
  /**
   * 按分类获取物料
   */
  getByCategory(category: string): readonly MaterialDefinition[]
}

// ==================== 命令 API ====================

/**
 * 命令 API
 */
export interface CommandAPI {
  /**
   * 注册命令
   */
  register(definition: CommandDefinition, handler: CommandHandler): Disposable
  
  /**
   * 执行命令
   */
  execute<TReturn = unknown>(commandId: string, ...args: unknown[]): Promise<TReturn>
  
  /**
   * 获取所有命令
   */
  getAll(): readonly CommandDefinition[]
  
  /**
   * 检查命令是否存在
   */
  has(commandId: string): boolean
}

export type CommandHandler<TArgs extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TArgs
) => TReturn | Promise<TReturn>

// ==================== 事件 API ====================

/**
 * 事件 API
 */
export interface EventAPI {
  /**
   * 监听事件
   */
  on<TPayload = unknown>(
    eventType: string,
    listener: EventListener<TPayload>
  ): Disposable
  
  /**
   * 监听一次
   */
  once<TPayload = unknown>(
    eventType: string,
    listener: EventListener<TPayload>
  ): Disposable
  
  /**
   * 发送事件
   */
  emit<TPayload = unknown>(
    eventType: string,
    payload?: TPayload
  ): Promise<void>
  
  /**
   * 同步发送事件
   */
  emitSync<TPayload = unknown>(
    eventType: string,
    payload?: TPayload
  ): void
}

// ==================== UI API ====================

/**
 * UI API
 */
export interface UIAPI {
  /**
   * 显示消息
   */
  showMessage(
    message: string,
    type?: 'info' | 'warning' | 'error' | 'success'
  ): void
  
  /**
   * 显示输入框
   */
  showInputBox(options: InputBoxOptions): Promise<string | undefined>
  
  /**
   * 显示快速选择
   */
  showQuickPick<T>(
    items: readonly QuickPickItem<T>[],
    options?: QuickPickOptions
  ): Promise<T | undefined>
  
  /**
   * 显示确认对话框
   */
  showConfirmDialog(options: ConfirmDialogOptions): Promise<boolean>
  
  /**
   * 注册面板
   */
  registerPanel(panel: PanelDefinition): Disposable
  
  /**
   * 注册视图
   */
  registerView(view: ViewDefinition): Disposable
  
  /**
   * 注册工具栏项
   */
  registerToolbarItem(item: ToolbarItemDefinition): Disposable
}

export interface InputBoxOptions {
  readonly title?: string
  readonly prompt?: string
  readonly placeholder?: string
  readonly value?: string
  readonly validateInput?: (value: string) => string | undefined | Promise<string | undefined>
}

export interface QuickPickItem<T = string> {
  readonly label: string
  readonly description?: string
  readonly detail?: string
  readonly value: T
}

export interface QuickPickOptions {
  readonly title?: string
  readonly placeHolder?: string
  readonly canPickMany?: boolean
}

export interface ConfirmDialogOptions {
  readonly title: string
  readonly message: string
  readonly confirmText?: string
  readonly cancelText?: string
}

export interface PanelDefinition {
  readonly id: string
  readonly title: I18nString
  readonly icon?: string
  readonly render: PanelRenderFunction
}

export type PanelRenderFunction = (container: unknown) => void | Disposable

export interface ViewDefinition {
  readonly id: string
  readonly title: I18nString
  readonly render: ViewRenderFunction
}

export type ViewRenderFunction = (container: unknown) => void | Disposable

export interface ToolbarItemDefinition {
  readonly id: string
  readonly icon: string
  readonly tooltip?: I18nString
  readonly command: string
  readonly when?: string
}

// ==================== 存储 API ====================

/**
 * 存储 API
 */
export interface StorageAPI {
  /**
   * 获取全局存储
   */
  getGlobal(): KeyValueStorage
  
  /**
   * 获取工作区存储
   */
  getWorkspace(): KeyValueStorage
  
  /**
   * 获取密钥存储
   */
  getSecrets(): SecretStorage
}

export interface KeyValueStorage {
  get<T>(key: string): T | undefined
  get<T>(key: string, defaultValue: T): T
  set(key: string, value: unknown): Promise<void>
  delete(key: string): Promise<void>
  has(key: string): boolean
  keys(): readonly string[]
  clear(): Promise<void>
}

export interface SecretStorage {
  get(key: string): Promise<string | undefined>
  set(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
}

// ==================== 数据 API ====================

/**
 * 数据 API
 */
export interface DataAPI {
  /**
   * 获取数据源
   */
  getDataSource(id: string): DataSource | undefined
  
  /**
   * 查询数据
   */
  query<T = unknown>(
    sourceId: string,
    params?: QueryParams
  ): Promise<T>
  
  /**
   * 更新数据
   */
  update(
    sourceId: string,
    data: unknown
  ): Promise<void>
}

export interface DataSource {
  readonly id: string
  readonly type: string
  readonly config: unknown
}

export interface QueryParams {
  readonly where?: Record<string, unknown>
  readonly select?: readonly string[]
  readonly orderBy?: Record<string, 'asc' | 'desc'>
  readonly skip?: number
  readonly take?: number
}

// ==================== 服务 API ====================

/**
 * 服务 API
 */
export interface ServiceAPI {
  /**
   * 获取服务
   */
  get<T>(serviceId: string): T | undefined
  
  /**
   * 检查服务是否存在
   */
  has(serviceId: string): boolean
}

// ==================== 工作区 API ====================

/**
 * 工作区 API
 */
export interface WorkspaceAPI {
  /**
   * 获取当前工作区路径
   */
  getPath(): string
  
  /**
   * 获取工作区配置
   */
  getConfiguration<T = unknown>(section: string): T | undefined
  
  /**
   * 更新工作区配置
   */
  updateConfiguration(section: string, value: unknown): Promise<void>
  
  /**
   * 监听配置变化
   */
  onDidChangeConfiguration(
    listener: (event: ConfigurationChangeEvent) => void
  ): Disposable
}

export interface ConfigurationChangeEvent {
  readonly affectedKeys: readonly string[]
}

// ==================== 插件管理器 ====================

/**
 * 插件管理器接口
 */
export interface IPluginManager {
  /**
   * 加载插件
   */
  load(plugin: PluginDefinition): Promise<void>
  
  /**
   * 卸载插件
   */
  unload(pluginId: string): Promise<void>
  
  /**
   * 激活插件
   */
  activate(pluginId: string): Promise<void>
  
  /**
   * 停用插件
   */
  deactivate(pluginId: string): Promise<void>
  
  /**
   * 获取插件
   */
  get(pluginId: string): PluginInstance | undefined
  
  /**
   * 获取所有插件
   */
  getAll(): readonly PluginInstance[]
  
  /**
   * 检查插件是否已加载
   */
  isLoaded(pluginId: string): boolean
  
  /**
   * 检查插件是否已激活
   */
  isActivated(pluginId: string): boolean
  
  /**
   * 重新加载插件
   */
  reload(pluginId: string): Promise<void>
  
  /**
   * 激活所有插件
   */
  activateAll(): Promise<void>
  
  /**
   * 停用所有插件
   */
  deactivateAll(): Promise<void>
  
  /**
   * 获取插件状态
   */
  getState(pluginId: string): PluginState | undefined
  
  /**
   * 获取所有已激活的插件
   */
  getActive(): readonly PluginInstance[]
}

/**
 * 插件实例
 */
export interface PluginInstance {
  readonly definition: PluginDefinition
  readonly context: PluginContext
  readonly state: PluginState
  readonly loadedAt: number
  readonly activatedAt?: number
}

/**
 * 插件状态
 */
export type PluginState =
  | 'unloaded'
  | 'loading'
  | 'loaded'
  | 'activating'
  | 'activated'
  | 'deactivating'
  | 'deactivated'
  | 'error'

// ==================== 插件工具 ====================

/**
 * 创建简单插件
 */
export function definePlugin(
  id: string,
  activate: PluginActivateFunction,
  options?: Partial<PluginDefinition>
): PluginDefinition {
  return {
    $protocol: PLUGIN_PROTOCOL_URI,
    id,
    name: options?.name || id,
    version: options?.version || { major: 1, minor: 0, patch: 0 },
    activate,
    deactivate: options?.deactivate,
    ...options,
  }
}

