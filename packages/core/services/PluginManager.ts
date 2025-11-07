/**
 * 插件管理器
 * 
 * 实现完整的插件系统，支持：
 * - 插件注册/卸载
 * - 插件生命周期管理
 * - 插件依赖解析
 * - 插件激活/停用
 * - 插件沙箱（可选）
 * - 插件 API 注入
 * 
 * @packageDocumentation
 */

import type {
  IPluginManager,
  PluginDefinition,
  PluginInstance,
  PluginState,
  PluginContext,
  Disposable,
} from '../protocols/plugin/PluginProtocol'

import type { IEventBus } from '../protocols/event/EventProtocol'

// ==================== 插件实例实现 ====================

/**
 * 插件实例实现
 */
class Plugin implements PluginInstance {
  state: PluginState = 'unloaded'
  context!: PluginContext
  readonly loadedAt: number
  activatedAt?: number
  
  constructor(
    public readonly definition: PluginDefinition
  ) {
    this.loadedAt = Date.now()
  }
  
  async activate(context: PluginContext): Promise<void> {
    if (this.state === 'activated') {
      throw new Error(`Plugin "${this.definition.id}" is already activated`)
    }
    
    this.context = context
    this.state = 'activating'
    
    try {
      await this.definition.activate(context)
      this.state = 'activated'
      this.activatedAt = Date.now()
    } catch (error) {
      this.state = 'error'
      throw error
    }
  }
  
  async deactivate(): Promise<void> {
    if (this.state !== 'activated') {
      throw new Error(`Plugin "${this.definition.id}" is not activated`)
    }
    
    this.state = 'deactivating'
    
    try {
      if (this.definition.deactivate) {
        await this.definition.deactivate()
      }
      this.state = 'deactivated'
      this.activatedAt = undefined
    } catch (error) {
      this.state = 'error'
      throw error
    }
  }
}

// ==================== 插件管理器实现 ====================

/**
 * 插件管理器实现
 */
export class PluginManager implements IPluginManager {
  /** 插件定义映射 */
  private readonly plugins = new Map<string, Plugin>()
  
  /** 插件依赖图 */
  private readonly dependencies = new Map<string, Set<string>>()
  
  /** 事件总线（可选） */
  private readonly eventBus?: IEventBus
  
  /** 订阅管理器 */
  private readonly subscriptions = new Map<string, Disposable[]>()
  
  /** 是否已销毁 */
  private disposed = false
  
  constructor(options?: {
    eventBus?: IEventBus
  }) {
    this.eventBus = options?.eventBus
  }
  
  // ==================== 插件注册 ====================
  
  /**
   * 注册插件
   */
  async register(definition: PluginDefinition): Promise<void> {
    this.assertNotDisposed()
    
    if (this.plugins.has(definition.id)) {
      throw new Error(`Plugin "${definition.id}" is already registered`)
    }
    
    // 验证依赖
    const deps = definition.metadata?.dependencies
    if (deps && deps.length > 0) {
      for (const dep of deps) {
        if (!dep.optional && !this.plugins.has(dep.pluginId)) {
          throw new Error(
            `Plugin "${definition.id}" depends on "${dep.pluginId}", but it is not registered`
          )
        }
      }
    }
    
    // 创建插件实例
    const plugin = new Plugin(definition)
    this.plugins.set(definition.id, plugin)
    
    // 记录依赖
    if (deps && deps.length > 0) {
      this.dependencies.set(definition.id, new Set(deps.map(d => d.pluginId)))
    }
    
    // 发送事件
    await this.eventBus?.emit('plugin:registered', {
      pluginId: definition.id,
      definition,
    })
  }
  
  /**
   * 注销插件
   */
  async unregister(pluginId: string): Promise<void> {
    this.assertNotDisposed()
    
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      return
    }
    
    // 停用插件
    if (plugin.state === 'activated') {
      await this.deactivate(pluginId)
    }
    
    // 移除订阅
    const subs = this.subscriptions.get(pluginId)
    if (subs) {
      for (const sub of subs) {
        sub.dispose()
      }
      this.subscriptions.delete(pluginId)
    }
    
    // 移除插件
    this.plugins.delete(pluginId)
    this.dependencies.delete(pluginId)
    
    // 发送事件
    await this.eventBus?.emit('plugin:unregistered', {
      pluginId,
    })
  }
  
  // ==================== 插件激活 ====================
  
  /**
   * 激活插件
   */
  async activate(pluginId: string): Promise<void> {
    this.assertNotDisposed()
    
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin "${pluginId}" not found`)
    }
    
    if (plugin.state === 'activated') {
      return
    }
    
    // 先激活依赖
    const deps = this.dependencies.get(pluginId)
    if (deps) {
      for (const depId of deps) {
        await this.activate(depId)
      }
    }
    
    // 创建插件上下文
    const context = this.createPluginContext(pluginId)
    
    // 激活插件
    try {
      await plugin.activate(context)
      
      // 发送事件
      await this.eventBus?.emit('plugin:activated', {
        pluginId,
      })
    } catch (error) {
      // 发送错误事件
      await this.eventBus?.emit('plugin:error', {
        pluginId,
        error,
      })
      throw error
    }
  }
  
  /**
   * 停用插件
   */
  async deactivate(pluginId: string): Promise<void> {
    this.assertNotDisposed()
    
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin "${pluginId}" not found`)
    }
    
    if (plugin.state !== 'activated') {
      return
    }
    
    // 先停用依赖此插件的其他插件
    for (const [id, deps] of this.dependencies) {
      if (deps.has(pluginId)) {
        await this.deactivate(id)
      }
    }
    
    // 停用插件
    try {
      await plugin.deactivate()
      
      // 发送事件
      await this.eventBus?.emit('plugin:deactivated', {
        pluginId,
      })
    } catch (error) {
      // 发送错误事件
      await this.eventBus?.emit('plugin:error', {
        pluginId,
        error,
      })
      throw error
    }
  }
  
  /**
   * 激活所有插件
   */
  async activateAll(): Promise<void> {
    this.assertNotDisposed()
    
    // 按依赖顺序激活
    const sorted = this.topologicalSort()
    
    for (const pluginId of sorted) {
      await this.activate(pluginId)
    }
  }
  
  /**
   * 停用所有插件
   */
  async deactivateAll(): Promise<void> {
    this.assertNotDisposed()
    
    // 按反向依赖顺序停用
    const sorted = this.topologicalSort().reverse()
    
    for (const pluginId of sorted) {
      const plugin = this.plugins.get(pluginId)
      if (plugin && plugin.state === 'activated') {
        await this.deactivate(pluginId)
      }
    }
  }
  
  // ==================== 接口方法 (IPluginManager) ====================
  
  /**
   * 加载插件（注册插件的别名）
   */
  async load(plugin: PluginDefinition): Promise<void> {
    return this.register(plugin)
  }
  
  /**
   * 卸载插件（注销插件的别名）
   */
  async unload(pluginId: string): Promise<void> {
    return this.unregister(pluginId)
  }
  
  /**
   * 检查插件是否已加载
   */
  isLoaded(pluginId: string): boolean {
    return this.plugins.has(pluginId)
  }
  
  /**
   * 检查插件是否已激活
   */
  isActivated(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId)
    return plugin?.state === 'activated'
  }
  
  /**
   * 重新加载插件
   */
  async reload(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin "${pluginId}" not found`)
    }
    
    // 停用
    if (plugin.state === 'activated') {
      await this.deactivate(pluginId)
    }
    
    // 卸载
    await this.unload(pluginId)
    
    // 重新加载
    await this.load(plugin.definition)
    
    // 重新激活
    await this.activate(pluginId)
  }
  
  // ==================== 查询方法 ====================
  
  /**
   * 获取插件
   */
  get(pluginId: string): PluginInstance | undefined {
    return this.plugins.get(pluginId)
  }
  
  /**
   * 获取所有插件
   */
  getAll(): readonly PluginInstance[] {
    return Array.from(this.plugins.values())
  }
  
  /**
   * 检查插件是否存在
   */
  has(pluginId: string): boolean {
    return this.plugins.has(pluginId)
  }
  
  /**
   * 获取插件状态
   */
  getState(pluginId: string): PluginState | undefined {
    return this.plugins.get(pluginId)?.state
  }
  
  /**
   * 获取激活的插件
   */
  getActive(): readonly PluginInstance[] {
    return Array.from(this.plugins.values()).filter(
      plugin => plugin.state === 'activated'
    )
  }
  
  /**
   * 获取插件依赖
   */
  getDependencies(pluginId: string): readonly string[] {
    const deps = this.dependencies.get(pluginId)
    return deps ? Array.from(deps) : []
  }
  
  /**
   * 获取依赖此插件的其他插件
   */
  getDependents(pluginId: string): readonly string[] {
    const dependents: string[] = []
    
    for (const [id, deps] of this.dependencies) {
      if (deps.has(pluginId)) {
        dependents.push(id)
      }
    }
    
    return dependents
  }
  
  // ==================== 内部方法 ====================
  
  /**
   * 创建插件上下文
   */
  private createPluginContext(pluginId: string): PluginContext {
    const context: PluginContext = {
      pluginId,
      pluginPath: `/plugins/${pluginId}`,
      workspacePath: '/workspace',
      globalStoragePath: `/storage/${pluginId}`,
      
      // 订阅管理器
      subscriptions: {
        push: (...disposables: Disposable[]) => {
          if (!this.subscriptions.has(pluginId)) {
            this.subscriptions.set(pluginId, [])
          }
          this.subscriptions.get(pluginId)!.push(...disposables)
        },
        dispose: () => {
          const subs = this.subscriptions.get(pluginId)
          if (subs) {
            for (const sub of subs) {
              sub.dispose()
            }
            this.subscriptions.delete(pluginId)
          }
        },
      },
      
      // 物料 API（占位符，需要注入真实实现）
      materials: {
        register: () => ({ dispose: () => {} }),
        get: () => undefined,
        has: () => false,
        getAll: () => [],
        getByCategory: () => [],
      },
      
      // 命令 API（占位符）
      commands: {
        register: () => ({ dispose: () => {} }),
        execute: async <TReturn = unknown>() => ({} as TReturn),
        getAll: () => [],
        has: () => false,
      },
      
      // 事件 API（占位符）
      events: {
        on: () => ({ dispose: () => {} }),
        once: () => ({ dispose: () => {} }),
        emit: async () => {},
        emitSync: () => {},
      },
      
      // UI API（占位符）
      ui: {
        showMessage: () => {},
        showInputBox: async () => undefined,
        showQuickPick: async () => undefined,
        showConfirmDialog: async () => false,
        registerPanel: () => ({ dispose: () => {} }),
        registerView: () => ({ dispose: () => {} }),
        registerToolbarItem: () => ({ dispose: () => {} }),
      },
      
      // 存储 API（占位符）
      storage: {
        getGlobal: () => ({
          get: <T>(_key: string, defaultValue?: T) => defaultValue as T,
          set: async () => {},
          delete: async () => {},
          has: () => false,
          keys: () => [],
          clear: async () => {},
        }),
        getWorkspace: () => ({
          get: <T>(_key: string, defaultValue?: T) => defaultValue as T,
          set: async () => {},
          delete: async () => {},
          has: () => false,
          keys: () => [],
          clear: async () => {},
        }),
        getSecrets: () => ({
          get: async () => undefined,
          set: async () => {},
          delete: async () => {},
        }),
      },
      
      // 数据 API（占位符）
      data: {
        getDataSource: () => undefined,
        query: async <T = unknown>() => ({} as T),
        update: async () => {},
      },
      
      // 服务 API（占位符）
      services: {
        get: <T>(_serviceId: string) => undefined as T | undefined,
        has: () => false,
      },
      
      // 工作区 API（占位符）
      workspace: {
        getPath: () => '/workspace',
        getConfiguration: <T = unknown>(_section: string) => undefined as T | undefined,
        updateConfiguration: async () => {},
        onDidChangeConfiguration: () => ({ dispose: () => {} }),
      },
    }
    
    return context
  }
  
  /**
   * 拓扑排序（解决依赖顺序）
   */
  private topologicalSort(): string[] {
    const result: string[] = []
    const visited = new Set<string>()
    const visiting = new Set<string>()
    
    const visit = (pluginId: string) => {
      if (visited.has(pluginId)) {
        return
      }
      
      if (visiting.has(pluginId)) {
        throw new Error(`Circular dependency detected: ${pluginId}`)
      }
      
      visiting.add(pluginId)
      
      const deps = this.dependencies.get(pluginId)
      if (deps) {
        for (const depId of deps) {
          visit(depId)
        }
      }
      
      visiting.delete(pluginId)
      visited.add(pluginId)
      result.push(pluginId)
    }
    
    for (const pluginId of this.plugins.keys()) {
      visit(pluginId)
    }
    
    return result
  }
  
  /**
   * 断言未销毁
   */
  private assertNotDisposed(): void {
    if (this.disposed) {
      throw new Error('PluginManager has been disposed')
    }
  }
  
  /**
   * 销毁管理器
   */
  dispose(): void {
    if (this.disposed) {
      return
    }
    
    this.disposed = true
    
    // 停用所有插件
    this.deactivateAll().catch(error => {
      console.error('Error deactivating plugins:', error)
    })
    
    // 清理资源
    this.plugins.clear()
    this.dependencies.clear()
    
    for (const subs of this.subscriptions.values()) {
      for (const sub of subs) {
        sub.dispose()
      }
    }
    this.subscriptions.clear()
  }
}

// ==================== 导出 ====================

/**
 * 创建插件管理器
 */
export function createPluginManager(options?: {
  eventBus?: IEventBus
}): IPluginManager {
  return new PluginManager(options)
}

/**
 * 全局插件管理器实例（可选）
 */
let globalPluginManager: IPluginManager | null = null

/**
 * 获取全局插件管理器
 */
export function getGlobalPluginManager(): IPluginManager {
  if (!globalPluginManager) {
    globalPluginManager = createPluginManager()
  }
  return globalPluginManager
}

/**
 * 设置全局插件管理器
 */
export function setGlobalPluginManager(manager: IPluginManager): void {
  globalPluginManager = manager
}

/**
 * 重置全局插件管理器
 */
export function resetGlobalPluginManager(): void {
  if (globalPluginManager && 'dispose' in globalPluginManager) {
    (globalPluginManager as PluginManager).dispose()
  }
  globalPluginManager = null
}

