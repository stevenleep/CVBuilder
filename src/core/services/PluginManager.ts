/**
 * 插件管理器实现
 * 
 * 管理插件的注册、激活、停用
 */

import { IPluginManager, IPlugin, IPluginContext } from '../protocols/IPluginProtocol'
import { IMaterialDefinition } from '../protocols/IMaterialProtocol'
import { IEventBus } from '../protocols/IEventProtocol'

export class PluginManager implements IPluginManager {
  private plugins: Map<string, IPlugin> = new Map()
  private activePlugins: Set<string> = new Set()
  private pluginContext: IPluginContext

  constructor(
    private materialRegistry: any,
    private eventBus: IEventBus,
    private getEditorState: () => any,
    private setEditorState: (updater: (state: any) => void) => void
  ) {
    // 创建插件上下文
    this.pluginContext = this.createPluginContext()
  }

  /**
   * 注册插件
   */
  public register(plugin: IPlugin): void {
    const { id } = plugin.meta

    if (this.plugins.has(id)) {
      console.warn(`[PluginManager] 插件 "${id}" 已存在，将被覆盖`)
    }

    // 检查依赖
    if (plugin.meta.dependencies) {
      for (const depId of plugin.meta.dependencies) {
        if (!this.plugins.has(depId)) {
          throw new Error(`[PluginManager] 插件 "${id}" 依赖的插件 "${depId}" 未找到`)
        }
      }
    }

    this.plugins.set(id, plugin)
    console.log(`[PluginManager] 注册插件: ${id}`)
  }

  /**
   * 激活插件
   */
  public async activate(pluginId: string): Promise<void> {
    if (this.activePlugins.has(pluginId)) {
      console.warn(`[PluginManager] 插件 "${pluginId}" 已激活`)
      return
    }

    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`[PluginManager] 插件 "${pluginId}" 未找到`)
    }

    try {
      // 先激活依赖的插件
      if (plugin.meta.dependencies) {
        for (const depId of plugin.meta.dependencies) {
          await this.activate(depId)
        }
      }

      // 激活插件
      await plugin.activate(this.pluginContext)
      this.activePlugins.add(pluginId)
      
      console.log(`[PluginManager] 激活插件: ${pluginId}`)
    } catch (error) {
      console.error(`[PluginManager] 激活插件 "${pluginId}" 失败:`, error)
      throw error
    }
  }

  /**
   * 停用插件
   */
  public async deactivate(pluginId: string): Promise<void> {
    if (!this.activePlugins.has(pluginId)) {
      console.warn(`[PluginManager] 插件 "${pluginId}" 未激活`)
      return
    }

    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      return
    }

    try {
      // 停用依赖此插件的其他插件
      for (const [id, p] of this.plugins.entries()) {
        if (p.meta.dependencies?.includes(pluginId) && this.activePlugins.has(id)) {
          await this.deactivate(id)
        }
      }

      // 停用插件
      if (plugin.deactivate) {
        await plugin.deactivate()
      }
      
      this.activePlugins.delete(pluginId)
      console.log(`[PluginManager] 停用插件: ${pluginId}`)
    } catch (error) {
      console.error(`[PluginManager] 停用插件 "${pluginId}" 失败:`, error)
      throw error
    }
  }

  /**
   * 获取所有插件
   */
  public getAll(): IPlugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * 获取已激活插件
   */
  public getActive(): IPlugin[] {
    return Array.from(this.activePlugins)
      .map(id => this.plugins.get(id))
      .filter(Boolean) as IPlugin[]
  }

  /**
   * 检查插件是否激活
   */
  public isActive(pluginId: string): boolean {
    return this.activePlugins.has(pluginId)
  }

  /**
   * 创建插件上下文
   */
  private createPluginContext(): IPluginContext {
    return {
      registerMaterial: (material: IMaterialDefinition) => {
        this.materialRegistry.register(material)
      },
      registerCommand: (command: any) => {
        // TODO: 实现命令注册
        console.log('[PluginManager] 注册命令:', command.id)
      },
      registerShortcut: (shortcut: any) => {
        // TODO: 实现快捷键注册
        console.log('[PluginManager] 注册快捷键:', shortcut.key)
      },
      registerPanel: (panel: any) => {
        // TODO: 实现面板注册
        console.log('[PluginManager] 注册面板:', panel.id)
      },
      registerMiddleware: (middleware: any) => {
        // TODO: 实现中间件注册
        console.log('[PluginManager] 注册中间件:', middleware.name)
      },
      on: (event: string, handler: (data: any) => void) => {
        return this.eventBus.on(event, handler)
      },
      emit: (event: string, data?: any) => {
        this.eventBus.emit(event, data)
      },
      getState: () => {
        return this.getEditorState()
      },
      setState: (updater: (state: any) => void) => {
        this.setEditorState(updater)
      },
    }
  }
}

// 服务标识符
export const PLUGIN_MANAGER_TOKEN = Symbol('PluginManager')

