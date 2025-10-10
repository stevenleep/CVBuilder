/**
 * 编辑器引导程序
 *
 * 初始化依赖注入容器和核心服务
 */

import { container } from './container/DIContainer'
import { EventBus, EVENT_BUS_TOKEN } from './services/EventBus'
import { MaterialRegistry, MATERIAL_REGISTRY_TOKEN } from './services/MaterialRegistry'
import { PluginManager, PLUGIN_MANAGER_TOKEN } from './services/PluginManager'
import { IEditorContext, IEditorConfig } from './context/EditorContext'
import { globalServices } from './globals'
import { useEditorStore } from '@store/editorStore'

/**
 * 引导编辑器
 */
export function bootstrapEditor(config: IEditorConfig = {}): IEditorContext {
  // 注册事件总线（单例）
  container.register(EVENT_BUS_TOKEN, () => new EventBus(), { singleton: true })

  // 注册物料注册表（依赖事件总线）
  container.register(MATERIAL_REGISTRY_TOKEN, eventBus => new MaterialRegistry(eventBus), {
    dependencies: [EVENT_BUS_TOKEN],
    singleton: true,
  })

  // 注册插件管理器
  container.register(
    PLUGIN_MANAGER_TOKEN,
    (materialRegistry, eventBus) => {
      // 连接到 editorStore - 直接使用 Zustand store
      const getState = () => {
        return useEditorStore.getState()
      }

      const setState = (updater: Parameters<typeof useEditorStore.setState>[0]) => {
        useEditorStore.setState(updater)
      }

      return new PluginManager(materialRegistry, eventBus, getState, setState)
    },
    {
      dependencies: [MATERIAL_REGISTRY_TOKEN, EVENT_BUS_TOKEN],
      singleton: true,
    }
  )

  // 解析所有服务
  const eventBus = container.resolve(EVENT_BUS_TOKEN) as EventBus
  const materialRegistry = container.resolve(MATERIAL_REGISTRY_TOKEN) as MaterialRegistry
  const pluginManager = container.resolve(PLUGIN_MANAGER_TOKEN) as PluginManager

  // 设置全局服务访问器（用于非React组件）
  globalServices.setMaterialRegistry(materialRegistry)
  globalServices.setEventBus(eventBus)
  globalServices.setPluginManager(pluginManager)

  const editorContext: IEditorContext = {
    eventBus,
    materialRegistry,
    pluginManager,
    config: {
      debug: false,
      autoSaveInterval: 30000, // 30秒
      maxHistorySize: 50,
      enablePlugins: true,
      ...config,
    },
  }

  // 调试模式：输出初始化信息
  if (config.debug) {
    console.group('[Editor Bootstrap] 初始化完成')
    console.log('📦 事件总线:', eventBus)
    console.log('🎨 物料注册表:', materialRegistry)
    console.log('🔌 插件管理器:', pluginManager)
    console.log('⚙️ 配置:', editorContext.config)
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
