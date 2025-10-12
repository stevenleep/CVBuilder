/**
 * 核心模块导出
 */

// 依赖注入
export { container, DIContainer } from './container/DIContainer'
export type { ServiceIdentifier, ServiceFactory } from './container/DIContainer'

// 协议
export * from './protocols/IMaterialProtocol'
export * from './protocols/IPluginProtocol'
export * from './protocols/IEventProtocol'
export * from './protocols/ICommandProtocol'
export * from './protocols/IHistoryProtocol'
export * from './protocols/IActionProtocol'
export * from './protocols/INotificationProtocol'
export * from './protocols/IValidationProtocol'
export * from './protocols/IExtensionProtocol'
export * from './protocols/IHookProtocol'
// 中间件协议（显式导出以避免与 IPluginProtocol 冲突）
export type {
  IMiddleware as IPipelineMiddleware,
  IMiddlewareContext as IPipelineMiddlewareContext,
  IMiddlewarePipeline,
  IMiddlewareResult,
  IMiddlewareService,
  MiddlewareHandler as PipelineMiddlewareHandler,
  PipelineNames,
} from './protocols/IMiddlewareProtocol'
// 快捷键协议（显式导出以避免与 IPluginProtocol 冲突）
export type {
  IShortcut,
  IShortcutContext,
  IShortcutConflict,
  IShortcutHelp,
  IShortcutService,
  IKeyboardUtil,
} from './protocols/IShortcutProtocol'

// 服务
export { EventBus, EVENT_BUS_TOKEN } from './services/EventBus'
export { MaterialRegistry, MATERIAL_REGISTRY_TOKEN } from './services/MaterialRegistry'
export { PluginManager, PLUGIN_MANAGER_TOKEN } from './services/PluginManager'
export { CommandService, COMMAND_SERVICE_TOKEN } from './services/CommandService'
export { HistoryService, HISTORY_SERVICE_TOKEN } from './services/HistoryService'
export { NotificationService, NOTIFICATION_SERVICE_TOKEN } from './services/NotificationService'
export { ShortcutService, SHORTCUT_SERVICE_TOKEN } from './services/ShortcutService'
export {
  ValidationService,
  VALIDATION_SERVICE_TOKEN,
  BuiltInRules,
} from './services/ValidationService'
export { ExtensionService, EXTENSION_SERVICE_TOKEN } from './services/ExtensionService'
export { HookService, HOOK_SERVICE_TOKEN } from './services/HookService'
export { MiddlewareService, MIDDLEWARE_SERVICE_TOKEN } from './services/MiddlewareService'
export { ActionService, ACTION_SERVICE_TOKEN } from './services/ActionService'

// 全局访问器
export { globalServices, getMaterialRegistry, getEventBus, getPluginManager } from './globals'

// 上下文和Hooks
export * from './context/EditorContext'
export * from './context/ThemeContext'
export * from './hooks/useMaterial'

// 主题
export * from './protocols/IThemeProtocol'
export * from './theme/themes'

// 引导程序
export { bootstrapEditor, cleanupEditor } from './bootstrap'
