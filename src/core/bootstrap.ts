/**
 * 编辑器引导程序
 *
 * 初始化依赖注入容器和所有核心服务
 */

import { container } from './container/DIContainer'
import { EventBus, EVENT_BUS_TOKEN } from './services/EventBus'
import { MaterialRegistry, MATERIAL_REGISTRY_TOKEN } from './services/MaterialRegistry'
import { PluginManager, PLUGIN_MANAGER_TOKEN } from './services/PluginManager'
import { CommandService } from './services/CommandService'
import { HistoryService } from './services/HistoryService'
import { NotificationService } from './services/NotificationService'
import { ValidationService } from './services/ValidationService'
import { ExtensionService } from './services/ExtensionService'
import { HookService } from './services/HookService'
import { MiddlewareService } from './services/MiddlewareService'
import { ActionService } from './services/ActionService'
import { ShortcutService } from './services/ShortcutService'
import { IEditorContext, IEditorConfig } from './context/EditorContext'
import { globalServices } from './globals'
import { useEditorStore } from '@store/editorStore'

// Service Tokens
export const COMMAND_SERVICE_TOKEN = Symbol('CommandService')
export const HISTORY_SERVICE_TOKEN = Symbol('HistoryService')
export const NOTIFICATION_SERVICE_TOKEN = Symbol('NotificationService')
export const VALIDATION_SERVICE_TOKEN = Symbol('ValidationService')
export const EXTENSION_SERVICE_TOKEN = Symbol('ExtensionService')
export const HOOK_SERVICE_TOKEN = Symbol('HookService')
export const MIDDLEWARE_SERVICE_TOKEN = Symbol('MiddlewareService')
export const ACTION_SERVICE_TOKEN = Symbol('ActionService')
export const SHORTCUT_SERVICE_TOKEN = Symbol('ShortcutService')

/**
 * 引导编辑器（集成所有核心服务）
 */
export function bootstrapEditor(config: IEditorConfig = {}): IEditorContext {
  // 默认配置
  const finalConfig: Required<IEditorConfig> = {
    debug: false,
    autoSaveInterval: 30000,
    maxHistorySize: 50,
    enablePlugins: true,
    enableCommands: true,
    enableHistory: true,
    enableNotifications: true,
    enableValidation: true,
    enableExtensions: true,
    enableHooks: true,
    enableMiddleware: true,
    enableShortcuts: true,
    ...config,
  }

  // ===== 1. 基础服务 =====

  // 事件总线（单例）
  container.register(EVENT_BUS_TOKEN, () => new EventBus(), { singleton: true })
  const eventBus = container.resolve(EVENT_BUS_TOKEN) as EventBus

  // 物料注册表
  container.register(MATERIAL_REGISTRY_TOKEN, eventBus => new MaterialRegistry(eventBus), {
    dependencies: [EVENT_BUS_TOKEN],
    singleton: true,
  })
  const materialRegistry = container.resolve(MATERIAL_REGISTRY_TOKEN) as MaterialRegistry

  // ===== 2. 增强服务 =====

  container.register(COMMAND_SERVICE_TOKEN, () => new CommandService(eventBus), { singleton: true })
  const commandService = container.resolve(COMMAND_SERVICE_TOKEN) as CommandService

  // 插件管理器需要在commandService之后创建
  container.register(
    PLUGIN_MANAGER_TOKEN,
    (materialRegistry, cmdService, eventBus) => {
      const getState = () => useEditorStore.getState()
      const setState = (updater: Parameters<typeof useEditorStore.setState>[0]) => {
        useEditorStore.setState(updater)
      }
      return new PluginManager(materialRegistry, cmdService, eventBus, getState, setState)
    },
    {
      dependencies: [MATERIAL_REGISTRY_TOKEN, COMMAND_SERVICE_TOKEN, EVENT_BUS_TOKEN],
      singleton: true,
    }
  )
  const pluginManager = container.resolve(PLUGIN_MANAGER_TOKEN) as PluginManager

  container.register(
    HISTORY_SERVICE_TOKEN,
    () => new HistoryService({ maxSize: finalConfig.maxHistorySize }, eventBus),
    { singleton: true }
  )
  const historyService = container.resolve(HISTORY_SERVICE_TOKEN) as HistoryService

  container.register(NOTIFICATION_SERVICE_TOKEN, () => new NotificationService(eventBus), {
    singleton: true,
  })
  const notificationService = container.resolve(NOTIFICATION_SERVICE_TOKEN) as NotificationService

  container.register(VALIDATION_SERVICE_TOKEN, () => new ValidationService(eventBus), {
    singleton: true,
  })
  const validationService = container.resolve(VALIDATION_SERVICE_TOKEN) as ValidationService

  container.register(EXTENSION_SERVICE_TOKEN, () => new ExtensionService(eventBus), {
    singleton: true,
  })
  const extensionService = container.resolve(EXTENSION_SERVICE_TOKEN) as ExtensionService

  container.register(HOOK_SERVICE_TOKEN, () => new HookService(eventBus), { singleton: true })
  const hookService = container.resolve(HOOK_SERVICE_TOKEN) as HookService

  container.register(MIDDLEWARE_SERVICE_TOKEN, () => new MiddlewareService(eventBus), {
    singleton: true,
  })
  const middlewareService = container.resolve(MIDDLEWARE_SERVICE_TOKEN) as MiddlewareService

  container.register(ACTION_SERVICE_TOKEN, () => new ActionService(eventBus), { singleton: true })
  const actionService = container.resolve(ACTION_SERVICE_TOKEN) as ActionService

  container.register(SHORTCUT_SERVICE_TOKEN, () => new ShortcutService(eventBus), {
    singleton: true,
  })
  const shortcutService = container.resolve(SHORTCUT_SERVICE_TOKEN) as ShortcutService

  // ===== 3. 设置全局访问器 =====
  globalServices.setMaterialRegistry(materialRegistry)
  globalServices.setEventBus(eventBus)
  globalServices.setPluginManager(pluginManager)

  // ===== 4. 创建上下文 =====
  const editorContext: IEditorContext = {
    eventBus,
    materialRegistry,
    pluginManager,
    commandService,
    historyService,
    notificationService,
    validationService,
    extensionService,
    hookService,
    middlewareService,
    actionService,
    shortcutService,
    config: finalConfig,
  }

  // ===== 5. 调试输出 =====
  if (finalConfig.debug) {
    console.group('[CVBuilder] 编辑器初始化完成')
    console.log('📦 事件总线:', eventBus)
    console.log('🎨 物料注册表:', materialRegistry)
    console.log('🔌 插件管理器:', pluginManager)
    console.log('⌨️ 命令服务:', commandService)
    console.log('⏮️ 历史服务:', historyService)
    console.log('🔔 通知服务:', notificationService)
    console.log('✅ 验证服务:', validationService)
    console.log('🔗 扩展服务:', extensionService)
    console.log('🪝 钩子服务:', hookService)
    console.log('🔀 中间件服务:', middlewareService)
    console.log('🎬 行为服务:', actionService)
    console.log('⚡ 快捷键服务:', shortcutService)
    console.log('⚙️ 配置:', finalConfig)
    console.log('📊 已注册物料数量:', materialRegistry.getAll().length)
    console.groupEnd()
  }

  return editorContext
}

/**
 * 清理编辑器资源
 */
export function cleanupEditor(): void {
  globalServices.clear()
  container.clear()
}
