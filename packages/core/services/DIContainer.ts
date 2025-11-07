/**
 * 依赖注入容器
 * 
 * 实现完整的 DI 容器，支持：
 * - 单例（Singleton）、瞬态（Transient）、作用域（Scoped）生命周期
 * - 依赖解析和注入
 * - 循环依赖检测
 * - 生命周期管理
 * 
 * @packageDocumentation
 */

import type {
  IServiceContainer,
  ServiceDefinition,
  ServiceFactory,
  ServiceFactoryContext,
  ServiceScope,
  ServiceRegistry,
} from '../protocols/service/ServiceProtocol'

import { 
  detectCircularDependency,
  isDisposableService 
} from '../protocols/service/ServiceProtocol'

// ==================== 服务容器实现 ====================

/**
 * 依赖注入容器实现
 */
export class DIContainer implements IServiceContainer {
  /** 服务定义注册表 */
  private readonly definitions = new Map<string, ServiceDefinition>()
  
  /** 单例实例缓存 */
  private readonly singletons = new Map<string, unknown>()
  
  /** 作用域实例缓存 */
  private readonly scopes = new Map<string, ServiceScope>()
  
  /** 正在解析的服务（用于检测循环依赖） */
  private readonly resolving = new Set<string>()
  
  /** 父容器 */
  private readonly parent?: DIContainer
  
  /** 子容器列表 */
  private readonly children = new Set<DIContainer>()
  
  /** 是否已销毁 */
  private disposed = false
  
  constructor(parent?: DIContainer) {
    this.parent = parent
    if (parent) {
      parent.children.add(this)
    }
  }
  
  // ==================== 服务注册 ====================
  
  /**
   * 注册服务
   */
  register(definition: ServiceDefinition): void {
    this.assertNotDisposed()
    
    if (this.definitions.has(definition.id)) {
      throw new Error(`Service "${definition.id}" is already registered`)
    }
    
    // 检测循环依赖
    const cycle = detectCircularDependency(definition.id, this.definitions)
    if (cycle) {
      throw new Error(
        `Circular dependency detected: ${cycle.join(' -> ')}`
      )
    }
    
    this.definitions.set(definition.id, definition)
  }
  
  /**
   * 注册单例服务
   */
  registerSingleton<T>(
    serviceId: string,
    factory: ServiceFactory<T>
  ): void {
    this.register({
      $protocol: 'lcedit://protocols/service/v1',
      id: serviceId,
      name: serviceId,
      type: 'custom',
      lifecycle: 'singleton',
      factory,
    })
  }
  
  /**
   * 注册瞬态服务
   */
  registerTransient<T>(
    serviceId: string,
    factory: ServiceFactory<T>
  ): void {
    this.register({
      $protocol: 'lcedit://protocols/service/v1',
      id: serviceId,
      name: serviceId,
      type: 'custom',
      lifecycle: 'transient',
      factory,
    })
  }
  
  /**
   * 注册作用域服务
   */
  registerScoped<T>(
    serviceId: string,
    factory: ServiceFactory<T>
  ): void {
    this.register({
      $protocol: 'lcedit://protocols/service/v1',
      id: serviceId,
      name: serviceId,
      type: 'custom',
      lifecycle: 'scoped',
      factory,
    })
  }
  
  /**
   * 注册实例
   */
  registerInstance<T>(serviceId: string, instance: T): void {
    this.assertNotDisposed()
    
    if (this.singletons.has(serviceId)) {
      throw new Error(`Service "${serviceId}" is already registered`)
    }
    
    this.singletons.set(serviceId, instance)
  }
  
  // ==================== 服务解析 ====================
  
  /**
   * 解析服务
   */
  resolve<T>(serviceId: string): T {
    this.assertNotDisposed()
    
    const instance = this.tryResolve<T>(serviceId)
    
    if (instance === undefined) {
      throw new Error(`Service "${serviceId}" not found`)
    }
    
    return instance
  }
  
  /**
   * 尝试解析服务
   */
  tryResolve<T>(serviceId: string): T | undefined {
    this.assertNotDisposed()
    
    // 检查循环依赖
    if (this.resolving.has(serviceId)) {
      throw new Error(
        `Circular dependency detected while resolving "${serviceId}"`
      )
    }
    
    // 检查单例缓存
    if (this.singletons.has(serviceId)) {
      return this.singletons.get(serviceId) as T
    }
    
    // 查找服务定义
    const definition = this.definitions.get(serviceId)
    
    // 如果本容器没有，尝试从父容器解析
    if (!definition && this.parent) {
      return this.parent.tryResolve<T>(serviceId)
    }
    
    if (!definition) {
      return undefined
    }
    
    // 根据生命周期创建实例
    return this.createInstance<T>(definition)
  }
  
  /**
   * 解析所有服务
   */
  resolveAll<T>(serviceType: string): readonly T[] {
    this.assertNotDisposed()
    
    const instances: T[] = []
    
    // 从当前容器解析
    for (const definition of this.definitions.values()) {
      if (definition.type === serviceType) {
        const instance = this.tryResolve<T>(definition.id)
        if (instance !== undefined) {
          instances.push(instance)
        }
      }
    }
    
    // 从父容器解析
    if (this.parent) {
      instances.push(...this.parent.resolveAll<T>(serviceType))
    }
    
    return instances
  }
  
  /**
   * 创建服务实例
   */
  private createInstance<T>(definition: ServiceDefinition): T {
    const { id, lifecycle, factory } = definition
    
    // 标记正在解析
    this.resolving.add(id)
    
    try {
      // 创建工厂上下文
      const context: ServiceFactoryContext = {
        container: this,
        config: definition.config,
        resolve: <R>(serviceId: string) => this.resolve<R>(serviceId),
        resolveOptional: <R>(serviceId: string) => this.tryResolve<R>(serviceId),
        resolveAll: <R>(serviceType: string) => this.resolveAll<R>(serviceType),
      }
      
      // 调用工厂函数创建实例
      const instance = factory(context)
      
      // 处理异步工厂
      if (instance instanceof Promise) {
        throw new Error(
          `Async factory is not supported in sync resolve. Service: "${id}"`
        )
      }
      
      // 根据生命周期处理实例
      if (lifecycle === 'singleton') {
        this.singletons.set(id, instance)
      }
      
      return instance as T
    } finally {
      this.resolving.delete(id)
    }
  }
  
  /**
   * 异步解析服务
   */
  async resolveAsync<T>(serviceId: string): Promise<T> {
    this.assertNotDisposed()
    
    const instance = await this.tryResolveAsync<T>(serviceId)
    
    if (instance === undefined) {
      throw new Error(`Service "${serviceId}" not found`)
    }
    
    return instance
  }
  
  /**
   * 尝试异步解析服务
   */
  async tryResolveAsync<T>(serviceId: string): Promise<T | undefined> {
    this.assertNotDisposed()
    
    // 检查循环依赖
    if (this.resolving.has(serviceId)) {
      throw new Error(
        `Circular dependency detected while resolving "${serviceId}"`
      )
    }
    
    // 检查单例缓存
    if (this.singletons.has(serviceId)) {
      return this.singletons.get(serviceId) as T
    }
    
    // 查找服务定义
    const definition = this.definitions.get(serviceId)
    
    // 如果本容器没有，尝试从父容器解析
    if (!definition && this.parent) {
      return this.parent.tryResolveAsync<T>(serviceId)
    }
    
    if (!definition) {
      return undefined
    }
    
    // 根据生命周期创建实例
    return this.createInstanceAsync<T>(definition)
  }
  
  /**
   * 异步创建服务实例
   */
  private async createInstanceAsync<T>(definition: ServiceDefinition): Promise<T> {
    const { id, lifecycle, factory } = definition
    
    // 标记正在解析
    this.resolving.add(id)
    
    try {
      // 创建工厂上下文
      const context: ServiceFactoryContext = {
        container: this,
        config: definition.config,
        resolve: <R>(serviceId: string) => this.resolve<R>(serviceId),
        resolveOptional: <R>(serviceId: string) => this.tryResolve<R>(serviceId),
        resolveAll: <R>(serviceType: string) => this.resolveAll<R>(serviceType),
      }
      
      // 调用工厂函数创建实例
      const instance = await factory(context)
      
      // 根据生命周期处理实例
      if (lifecycle === 'singleton') {
        this.singletons.set(id, instance)
      }
      
      return instance as T
    } finally {
      this.resolving.delete(id)
    }
  }
  
  // ==================== 查询方法 ====================
  
  /**
   * 检查服务是否已注册
   */
  has(serviceId: string): boolean {
    if (this.definitions.has(serviceId) || this.singletons.has(serviceId)) {
      return true
    }
    
    return this.parent ? this.parent.has(serviceId) : false
  }
  
  /**
   * 获取服务定义
   */
  getDefinition(serviceId: string): ServiceDefinition | undefined {
    const definition = this.definitions.get(serviceId)
    
    if (definition) {
      return definition
    }
    
    return this.parent ? this.parent.getDefinition(serviceId) : undefined
  }
  
  /**
   * 获取所有服务定义
   */
  getAllDefinitions(): readonly ServiceDefinition[] {
    const definitions = Array.from(this.definitions.values())
    
    if (this.parent) {
      definitions.push(...this.parent.getAllDefinitions())
    }
    
    return definitions
  }
  
  /**
   * 获取注册表
   */
  getRegistry(): ServiceRegistry {
    return {
      services: new Map(this.definitions),
      instances: new Map(this.singletons),
      scopes: new Map(this.scopes),
    }
  }
  
  // ==================== 容器管理 ====================
  
  /**
   * 创建子容器
   */
  createChildContainer(): IServiceContainer {
    this.assertNotDisposed()
    return new DIContainer(this)
  }
  
  /**
   * 创建作用域
   */
  createScope(): ServiceScope {
    this.assertNotDisposed()
    
    const scopeId = `scope-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const scopeContainer = new DIContainer(this)
    
    const scope: ServiceScope = {
      id: scopeId,
      container: scopeContainer,
      dispose: () => {
        scopeContainer.dispose()
        this.scopes.delete(scopeId)
      },
    }
    
    this.scopes.set(scopeId, scope)
    
    return scope
  }
  
  // ==================== 生命周期 ====================
  
  /**
   * 销毁容器
   */
  dispose(): void {
    if (this.disposed) {
      return
    }
    
    this.disposed = true
    
    // 销毁所有子容器
    for (const child of this.children) {
      child.dispose()
    }
    this.children.clear()
    
    // 销毁所有作用域
    for (const scope of this.scopes.values()) {
      scope.dispose()
    }
    this.scopes.clear()
    
    // 销毁所有单例实例
    for (const instance of this.singletons.values()) {
      if (isDisposableService(instance)) {
        const result = instance.dispose()
        if (result instanceof Promise) {
          // 异步销毁在后台执行
          result.catch(error => {
            console.error('Error disposing service:', error)
          })
        }
      }
    }
    this.singletons.clear()
    
    // 清理定义
    this.definitions.clear()
    
    // 从父容器移除
    if (this.parent) {
      this.parent.children.delete(this)
    }
  }
  
  /**
   * 异步销毁容器
   */
  async disposeAsync(): Promise<void> {
    if (this.disposed) {
      return
    }
    
    this.disposed = true
    
    // 销毁所有子容器
    const childDisposes = Array.from(this.children).map(child => child.disposeAsync())
    await Promise.all(childDisposes)
    this.children.clear()
    
    // 销毁所有作用域
    for (const scope of this.scopes.values()) {
      scope.dispose()
    }
    this.scopes.clear()
    
    // 销毁所有单例实例
    const disposes: Promise<void>[] = []
    for (const instance of this.singletons.values()) {
      if (isDisposableService(instance)) {
        const result = instance.dispose()
        if (result instanceof Promise) {
          disposes.push(result)
        }
      }
    }
    await Promise.all(disposes)
    this.singletons.clear()
    
    // 清理定义
    this.definitions.clear()
    
    // 从父容器移除
    if (this.parent) {
      this.parent.children.delete(this)
    }
  }
  
  /**
   * 断言容器未被销毁
   */
  private assertNotDisposed(): void {
    if (this.disposed) {
      throw new Error('Container has been disposed')
    }
  }
}

// ==================== 导出 ====================

/**
 * 创建 DI 容器
 */
export function createDIContainer(parent?: DIContainer): IServiceContainer {
  return new DIContainer(parent)
}

/**
 * 全局容器实例（可选）
 */
let globalContainer: IServiceContainer | null = null

/**
 * 获取全局容器
 */
export function getGlobalContainer(): IServiceContainer {
  if (!globalContainer) {
    globalContainer = createDIContainer()
  }
  return globalContainer
}

/**
 * 设置全局容器
 */
export function setGlobalContainer(container: IServiceContainer): void {
  globalContainer = container
}

/**
 * 重置全局容器
 */
export function resetGlobalContainer(): void {
  if (globalContainer) {
    globalContainer.dispose()
    globalContainer = null
  }
}

