/**
 * LCEdit 协议层统一导出
 * 
 * 这是一个完整的、工业级的低代码平台协议体系
 * 
 * @packageDocumentation
 * @since 1.0.0
 */

// ==================== 核心协议 ====================

// 注意：为避免类型重复导出警告，某些通用类型明确指定从特定协议导出

/** 物料协议 - 定义可复用的 UI 组件 */
export * from './material/MaterialProtocol'

/** 扩展协议 - 定义插件、主题、物料包等扩展 */
export * from './extension/ExtensionProtocol'

/** 命令协议 - 定义所有可执行的操作（优先作为通用类型来源） */
export * from './command/CommandProtocol'

/** 数据协议 - 定义数据源、数据绑定、数据流 */
export * from './data/DataProtocol'

/** 渲染协议 - 定义如何将物料渲染成实际 UI */
// 注意：PerformanceCapabilities、Disposable 使用其他协议中的定义
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
export type {
  JSONSchema7,
  RENDERER_PROTOCOL_URI,
  RendererDefinition,
  TargetFramework,
  TargetPlatform,
  RendererCapabilities,
  // PerformanceCapabilities, // 使用 material 中的定义
  RendererMetadata,
  RendererDependencies,
  RenderContext,
  RenderMode,
  ViewportMode,
  Theme,
  EditorRenderState,
  NodeData,
  RenderServices,
  ComponentRenderer,
  RendererFactory,
  PropertyFieldRenderer,
  PropertyFieldRenderContext,
  PropertyFieldSchema,
  ValidationState,
  ValidationError,
  ValidationWarning,
  IRendererRegistry,
  // Disposable, // 使用 command 中的定义
  RenderOptions,
  RenderResult,
  RenderWarning,
  RenderLifecycle,
  RenderMiddleware,
  RenderPipeline,
  StyleProcessor,
  StyleProcessContext,
  BuiltInRenderers,
  BuiltInPropertyRenderers,
} from './renderer/RendererProtocol'

/** 事件协议 - 定义事件总线和发布订阅机制 */
// 注意：Disposable 使用 command 中的定义
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
export type {
  IEventBus,
  Event,
  EventDefinition,
  EventCategory,
  EventPayloadSchema,
  EventPropertySchema,
  EventMetadata,
  EventListener,
  EventListenerConfig,
  EventFilter,
  EventInterceptor,
  InterceptorContext,
  EmitOptions,
  // Disposable, // 使用 command 中的定义
  EventPayloads,
  createEvent,
  matchEvent,
  throttle,
  debounce,
  BuiltInEvents,
} from './event/EventProtocol'

/** 插件协议 - 定义插件系统和生命周期 */
// 注意：Disposable、InputBoxOptions、QuickPickItem、QuickPickOptions、QueryParams 使用其他协议中的定义
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
export type {
  PluginDefinition,
  PluginActivateFunction,
  PluginDeactivateFunction,
  PluginMetadata,
  PluginContext,
  SubscriptionManager,
  // Disposable, // 使用 command 中的定义
  MaterialAPI,
  CommandAPI,
  CommandHandler,
  EventAPI,
  UIAPI,
  // InputBoxOptions, // 使用 command 中的定义
  // QuickPickItem, // 使用 command 中的定义
  // QuickPickOptions, // 使用 command 中的定义
  ConfirmDialogOptions,
  PanelDefinition,
  PanelRenderFunction,
  ViewDefinition,
  ViewRenderFunction,
  ToolbarItemDefinition,
  StorageAPI,
  KeyValueStorage,
  SecretStorage,
  DataAPI,
  DataSource,
  // QueryParams, // 使用 data 中的定义
  ServiceAPI,
  WorkspaceAPI,
  ConfigurationChangeEvent,
  IPluginManager,
  PluginInstance,
  PluginState,
  definePlugin,
} from './plugin/PluginProtocol'

/** 历史协议 - 定义撤销/重做系统 */
// 注意：Disposable 使用 command 中的定义
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
export type {
  HistoryRecord,
  HistoryRecordType,
  HistoryChange,
  HistorySnapshot,
  HistoryConfig,
  IHistoryService,
  HistoryChangeListener,
  HistoryChangeEvent,
  HistoryActionListener,
  HistoryActionEvent,
  // Disposable, // 使用 command 中的定义
  createHistoryRecord,
  createHistoryChange,
  mergeHistoryRecords,
  applyHistoryChange,
  getNestedValue,
  computeDiff,
} from './history/HistoryProtocol'

/** 服务协议 - 定义依赖注入和服务管理 */
export * from './service/ServiceProtocol'

// ==================== 协议版本信息 ====================

/**
 * 协议版本
 */
export const PROTOCOL_VERSION = {
  major: 1,
  minor: 0,
  patch: 0,
} as const

/**
 * 协议兼容性
 */
export const PROTOCOL_COMPATIBILITY = {
  /** 最小兼容版本 */
  minVersion: '1.0.0',
  /** 最大兼容版本 */
  maxVersion: '2.0.0',
} as const

// ==================== 协议工具函数 ====================

/**
 * 检查协议版本兼容性
 */
export function isProtocolCompatible(version: string): boolean {
  const [major, minor] = version.split('.').map(Number)
  const [minMajor, minMinor] = PROTOCOL_COMPATIBILITY.minVersion.split('.').map(Number)
  const [maxMajor, maxMinor] = PROTOCOL_COMPATIBILITY.maxVersion.split('.').map(Number)
  
  if (major < minMajor || major > maxMajor) return false
  if (major === minMajor && minor < minMinor) return false
  if (major === maxMajor && minor > maxMinor) return false
  
  return true
}

/**
 * 获取协议版本字符串
 */
export function getProtocolVersionString(): string {
  return `${PROTOCOL_VERSION.major}.${PROTOCOL_VERSION.minor}.${PROTOCOL_VERSION.patch}`
}

