/**
 * 依赖注入容器
 *
 * 管理所有服务的注册和获取，实现控制反转
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServiceIdentifier<T = any> = string | symbol | { new (...args: any[]): T }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ServiceFactory<T = any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...deps: any[]): T
}

// 服务生命周期接口
export interface ILifecycle {
  /** 初始化方法 */
  initialize?(): void | Promise<void>
  /** 销毁方法 */
  dispose?(): void | Promise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ServiceDescriptor<T = any> {
  identifier: ServiceIdentifier<T>
  factory: ServiceFactory<T>
  dependencies?: ServiceIdentifier[]
  singleton?: boolean
  instance?: T
  /** 是否支持生命周期 */
  lifecycle?: boolean
  /** 初始化优先级（越大越先初始化） */
  initPriority?: number
}

export class DIContainer {
  private static instance: DIContainer
  private services: Map<ServiceIdentifier, ServiceDescriptor> = new Map()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private singletonCache: Map<ServiceIdentifier, any> = new Map()
  // 生命周期服务列表
  private lifecycleServices: Set<any> = new Set()
  // 初始化状态
  private initialized: boolean = false
  private initializing: boolean = false

  private constructor() {}

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer()
    }
    return DIContainer.instance
  }

  /**
   * 注册服务
   */
  public register<T>(
    identifier: ServiceIdentifier<T>,
    factory: ServiceFactory<T>,
    options: {
      dependencies?: ServiceIdentifier[]
      singleton?: boolean
      lifecycle?: boolean
      initPriority?: number
    } = {}
  ): this {
    this.services.set(identifier, {
      identifier,
      factory,
      dependencies: options.dependencies || [],
      singleton: options.singleton !== false, // 默认为单例
      lifecycle: options.lifecycle || false,
      initPriority: options.initPriority || 0,
    })
    return this
  }

  /**
   * 获取服务实例
   */
  public resolve<T>(identifier: ServiceIdentifier<T>): T {
    // 检查单例缓存
    if (this.singletonCache.has(identifier)) {
      return this.singletonCache.get(identifier)
    }

    const descriptor = this.services.get(identifier)
    if (!descriptor) {
      throw new Error(`Service not found: ${String(identifier)}`)
    }

    // 解析依赖
    const dependencies = descriptor.dependencies?.map(dep => this.resolve(dep)) || []

    // 创建实例
    const instance = descriptor.factory(...dependencies)

    // 缓存单例
    if (descriptor.singleton) {
      this.singletonCache.set(identifier, instance)
    }

    // 如果支持生命周期，记录服务
    if (descriptor.lifecycle && this.hasLifecycleMethods(instance)) {
      this.lifecycleServices.add(instance)
    }

    return instance
  }

  /**
   * 初始化所有生命周期服务
   */
  public async initialize(): Promise<void> {
    if (this.initialized || this.initializing) {
      return
    }

    this.initializing = true

    try {
      // 按优先级排序初始化
      const servicesWithPriority = Array.from(this.services.entries())
        .filter(([, descriptor]) => descriptor.lifecycle)
        .sort((a, b) => (b[1].initPriority || 0) - (a[1].initPriority || 0))

      // 预先解析所有生命周期服务
      for (const [identifier] of servicesWithPriority) {
        this.resolve(identifier)
      }

      // 按顺序初始化
      for (const service of this.lifecycleServices) {
        if (service.initialize) {
          await service.initialize()
        }
      }

      this.initialized = true
    } finally {
      this.initializing = false
    }
  }

  /**
   * 销毁所有生命周期服务
   */
  public async dispose(): Promise<void> {
    // 逆序销毁
    const services = Array.from(this.lifecycleServices).reverse()

    for (const service of services) {
      try {
        if (service.dispose) {
          await service.dispose()
        }
      } catch (error) {
        console.error('[DIContainer] 服务销毁失败:', error)
      }
    }

    this.lifecycleServices.clear()
    this.initialized = false
  }

  /**
   * 检查对象是否具有生命周期方法
   */
  private hasLifecycleMethods(obj: any): boolean {
    return typeof obj.initialize === 'function' || typeof obj.dispose === 'function'
  }

  /**
   * 检查服务是否已注册
   */
  public has(identifier: ServiceIdentifier): boolean {
    return this.services.has(identifier)
  }

  /**
   * 清除所有服务（主要用于测试）
   */
  public clear(): void {
    this.services.clear()
    this.singletonCache.clear()
  }
}

// 导出单例
export const container = DIContainer.getInstance()
