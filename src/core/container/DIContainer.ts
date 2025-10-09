/**
 * 依赖注入容器
 * 
 * 管理所有服务的注册和获取，实现控制反转
 */

export type ServiceIdentifier<T = any> = string | symbol | { new(...args: any[]): T }

export interface ServiceFactory<T = any> {
  (...deps: any[]): T
}

export interface ServiceDescriptor<T = any> {
  identifier: ServiceIdentifier<T>
  factory: ServiceFactory<T>
  dependencies?: ServiceIdentifier[]
  singleton?: boolean
  instance?: T
}

export class DIContainer {
  private static instance: DIContainer
  private services: Map<ServiceIdentifier, ServiceDescriptor> = new Map()
  private singletonCache: Map<ServiceIdentifier, any> = new Map()

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
    } = {}
  ): this {
    this.services.set(identifier, {
      identifier,
      factory,
      dependencies: options.dependencies || [],
      singleton: options.singleton !== false, // 默认为单例
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

    return instance
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

