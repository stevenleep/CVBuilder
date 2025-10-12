/**
 * 插件管理器实现
 *
 * 管理插件的注册、激活、停用
 */

import {
  IPluginManager,
  IPlugin,
  IPluginContext,
  ICommand,
  IShortcut,
  IPanel,
  IMiddleware,
} from '../protocols/IPluginProtocol'
import { IMaterialDefinition } from '../protocols/IMaterialProtocol'
import { IEventBus } from '../protocols/IEventProtocol'
import { ICommandService } from '../protocols/ICommandProtocol'

export class PluginManager implements IPluginManager {
  private plugins: Map<string, IPlugin> = new Map()
  private activePlugins: Set<string> = new Set()
  private pluginContext: IPluginContext

  // 快捷键、面板、中间件的注册表（命令已由 CommandService 管理）
  private shortcuts: Map<string, IShortcut> = new Map()
  private panels: Map<string, IPanel> = new Map()
  private middlewares: IMiddleware[] = []

  constructor(
    private materialRegistry: any,
    private commandService: ICommandService,
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

    // 检查依赖
    if (plugin.meta.dependencies) {
      for (const depId of plugin.meta.dependencies) {
        if (!this.plugins.has(depId)) {
          throw new Error(`[PluginManager] 插件 "${id}" 依赖的插件 "${depId}" 未找到`)
        }
      }
    }

    this.plugins.set(id, plugin)
  }

  /**
   * 激活插件
   */
  public async activate(pluginId: string): Promise<void> {
    if (this.activePlugins.has(pluginId)) {
      return
    }

    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`[PluginManager] 插件 "${pluginId}" 未找到`)
    }

    // 先激活依赖的插件
    if (plugin.meta.dependencies) {
      for (const depId of plugin.meta.dependencies) {
        await this.activate(depId)
      }
    }

    // 激活插件
    await plugin.activate(this.pluginContext)
    this.activePlugins.add(pluginId)
  }

  /**
   * 停用插件
   */
  public async deactivate(pluginId: string): Promise<void> {
    if (!this.activePlugins.has(pluginId)) {
      return
    }

    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      return
    }

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
   * 获取所有已注册的命令（委托给 CommandService）
   */
  public getCommands(): ICommand[] {
    return this.commandService.getAll()
  }

  /**
   * 获取指定命令（委托给 CommandService）
   */
  public getCommand(commandId: string): ICommand | undefined {
    return this.commandService.get(commandId)
  }

  /**
   * 执行命令（委托给 CommandService）
   */
  public async executeCommand(commandId: string, args?: any): Promise<void> {
    await this.commandService.execute(commandId, args)
  }

  /**
   * 获取所有已注册的快捷键
   */
  public getShortcuts(): IShortcut[] {
    return Array.from(this.shortcuts.values())
  }

  /**
   * 根据快捷键查找命令
   */
  public getCommandByShortcut(key: string): string | undefined {
    const shortcut = this.shortcuts.get(key)
    return shortcut?.commandId
  }

  /**
   * 获取所有已注册的面板
   */
  public getPanels(): IPanel[] {
    return Array.from(this.panels.values())
  }

  /**
   * 获取指定面板
   */
  public getPanel(panelId: string): IPanel | undefined {
    return this.panels.get(panelId)
  }

  /**
   * 获取所有中间件
   */
  public getMiddlewares(): IMiddleware[] {
    return this.middlewares
  }

  /**
   * 执行中间件链
   */
  public async runMiddlewares(action: string, payload: unknown): Promise<boolean> {
    const context = {
      action,
      payload,
      state: this.getEditorState(),
      cancel: false,
    }

    let index = 0
    const next = () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++]
        middleware.handle(context, next)
      }
    }

    next()

    return !context.cancel
  }

  /**
   * 创建插件上下文
   */
  private createPluginContext(): IPluginContext {
    return {
      registerMaterial: (material: IMaterialDefinition) => {
        this.materialRegistry.register(material)
      },
      registerCommand: (command: ICommand) => {
        // 委托给 CommandService
        this.commandService.register(command)
      },
      registerShortcut: (shortcut: IShortcut) => {
        if (this.shortcuts.has(shortcut.key)) {
          throw new Error(`[PluginManager] 快捷键 "${shortcut.key}" 已被占用`)
        }
        // 检查命令是否存在（使用 CommandService）
        if (!this.commandService.get(shortcut.commandId)) {
          throw new Error(`[PluginManager] 快捷键关联的命令 "${shortcut.commandId}" 不存在`)
        }
        this.shortcuts.set(shortcut.key, shortcut)
        this.eventBus.emit('shortcut:registered', { shortcut })
      },
      registerPanel: (panel: IPanel) => {
        if (this.panels.has(panel.id)) {
          throw new Error(`[PluginManager] 面板 "${panel.id}" 已存在`)
        }
        this.panels.set(panel.id, panel)
        this.eventBus.emit('panel:registered', { panel })
      },
      registerMiddleware: (middleware: IMiddleware) => {
        // 中间件按注册顺序执行
        this.middlewares.push(middleware)
        this.eventBus.emit('middleware:registered', { middleware })
      },
      on: (event: string, handler: (data: any) => void) => {
        const subscription = this.eventBus.on(event, handler)
        return () => subscription.unsubscribe()
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
