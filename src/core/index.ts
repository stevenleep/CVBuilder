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

// 服务
export { EventBus, EVENT_BUS_TOKEN } from './services/EventBus'
export { MaterialRegistry, MATERIAL_REGISTRY_TOKEN } from './services/MaterialRegistry'
export { PluginManager, PLUGIN_MANAGER_TOKEN } from './services/PluginManager'

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

