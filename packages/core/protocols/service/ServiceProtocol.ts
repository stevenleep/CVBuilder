/**
 * 服务协议 - 依赖注入和服务管理
 * 
 * 提供完整的 DI 容器和服务生命周期管理
 * 
 * @packageDocumentation
 */

// ==================== 服务协议 URI ====================

export const SERVICE_PROTOCOL_URI = 'lcedit://protocols/service/v1' as const

// ==================== 服务定义 ====================

/**
 * 服务定义
 */
export interface ServiceDefinition {
  /** 协议版本 */
  readonly $protocol: typeof SERVICE_PROTOCOL_URI
  
  /** 服务 ID（全局唯一） */
  readonly id: string
  
  /** 服务名称 */
  readonly name: string
  
  /** 服务描述 */
  readonly description?: string
  
  /** 服务类型 */
  readonly type: ServiceType
  
  /** 服务生命周期 */
  readonly lifecycle: ServiceLifecycle
  
  /** 服务依赖 */
  readonly dependencies?: readonly string[]
  
  /** 服务工厂 */
  readonly factory: ServiceFactory
  
  /** 服务配置 */
  readonly config?: ServiceConfig
}

/**
 * 服务类型
 */
export type ServiceType =
  | 'core'        // 核心服务
  | 'adapter'     // 适配器服务
  | 'util'        // 工具服务
  | 'custom'      // 自定义服务

/**
 * 服务生命周期
 */
export type ServiceLifecycle =
  | 'singleton'   // 单例（全局唯一）
  | 'transient'   // 瞬态（每次创建新实例）
  | 'scoped'      // 作用域（在作用域内唯一）

/**
 * 服务工厂
 */
export type ServiceFactory<T = unknown> = (
  context: ServiceFactoryContext
) => T | Promise<T>

/**
 * 服务工厂上下文
 */
export interface ServiceFactoryContext {
  /** 服务容器 */
  readonly container: IServiceContainer
  
  /** 服务配置 */
  readonly config?: ServiceConfig
  
  /** 解析依赖 */
  resolve<T>(serviceId: string): T
  
  /** 解析可选依赖 */
  resolveOptional<T>(serviceId: string): T | undefined
  
  /** 解析所有依赖 */
  resolveAll<T>(serviceType: string): readonly T[]
}

/**
 * 服务配置
 */
export interface ServiceConfig {
  readonly [key: string]: unknown
}

// ==================== 服务容器 ====================

/**
 * 服务容器接口
 */
export interface IServiceContainer {
  /**
   * 注册服务
   */
  register(definition: ServiceDefinition): void
  
  /**
   * 注册单例服务
   */
  registerSingleton<T>(
    serviceId: string,
    factory: ServiceFactory<T>
  ): void
  
  /**
   * 注册瞬态服务
   */
  registerTransient<T>(
    serviceId: string,
    factory: ServiceFactory<T>
  ): void
  
  /**
   * 注册作用域服务
   */
  registerScoped<T>(
    serviceId: string,
    factory: ServiceFactory<T>
  ): void
  
  /**
   * 注册实例
   */
  registerInstance<T>(serviceId: string, instance: T): void
  
  /**
   * 解析服务
   */
  resolve<T>(serviceId: string): T
  
  /**
   * 尝试解析服务
   */
  tryResolve<T>(serviceId: string): T | undefined
  
  /**
   * 解析所有服务
   */
  resolveAll<T>(serviceType: string): readonly T[]
  
  /**
   * 检查服务是否已注册
   */
  has(serviceId: string): boolean
  
  /**
   * 获取服务定义
   */
  getDefinition(serviceId: string): ServiceDefinition | undefined
  
  /**
   * 获取所有服务定义
   */
  getAllDefinitions(): readonly ServiceDefinition[]
  
  /**
   * 创建子容器
   */
  createChildContainer(): IServiceContainer
  
  /**
   * 创建作用域
   */
  createScope(): ServiceScope
  
  /**
   * 销毁容器
   */
  dispose(): void
}

/**
 * 服务作用域
 */
export interface ServiceScope {
  /** 作用域 ID */
  readonly id: string
  
  /** 服务容器 */
  readonly container: IServiceContainer
  
  /** 销毁作用域 */
  dispose(): void
}

// ==================== 服务注册表 ====================

/**
 * 服务注册表
 */
export interface ServiceRegistry {
  /** 已注册的服务 */
  readonly services: ReadonlyMap<string, ServiceDefinition>
  
  /** 服务实例缓存（单例） */
  readonly instances: Map<string, unknown>
  
  /** 服务作用域 */
  readonly scopes: Map<string, ServiceScope>
}

// ==================== 服务装饰器 ====================

/**
 * 服务装饰器元数据
 */
export interface ServiceMetadata {
  readonly serviceId: string
  readonly lifecycle: ServiceLifecycle
  readonly dependencies: readonly string[]
}

/**
 * 可注入装饰器元数据
 */
export interface InjectableMetadata {
  readonly dependencies: readonly InjectDependency[]
}

/**
 * 注入依赖
 */
export interface InjectDependency {
  readonly parameterIndex: number
  readonly serviceId: string
  readonly optional: boolean
}

// ==================== 服务工具 ====================

/**
 * 创建服务定义
 */
export function createServiceDefinition<T>(
  serviceId: string,
  factory: ServiceFactory<T>,
  options?: {
    name?: string
    description?: string
    type?: ServiceType
    lifecycle?: ServiceLifecycle
    dependencies?: readonly string[]
    config?: ServiceConfig
  }
): ServiceDefinition {
  return {
    $protocol: SERVICE_PROTOCOL_URI,
    id: serviceId,
    name: options?.name || serviceId,
    description: options?.description,
    type: options?.type || 'custom',
    lifecycle: options?.lifecycle || 'singleton',
    dependencies: options?.dependencies,
    factory,
    config: options?.config,
  }
}

/**
 * 检测循环依赖
 */
export function detectCircularDependency(
  serviceId: string,
  definitions: Map<string, ServiceDefinition>,
  visited: Set<string> = new Set()
): string[] | null {
  if (visited.has(serviceId)) {
    return [serviceId]
  }
  
  const definition = definitions.get(serviceId)
  if (!definition || !definition.dependencies) {
    return null
  }
  
  visited.add(serviceId)
  
  for (const depId of definition.dependencies) {
    const cycle = detectCircularDependency(depId, definitions, new Set(visited))
    if (cycle) {
      cycle.push(serviceId)
      return cycle
    }
  }
  
  return null
}

/**
 * 解析依赖顺序
 */
export function resolveDependencyOrder(
  definitions: Map<string, ServiceDefinition>
): string[] {
  const order: string[] = []
  const visited = new Set<string>()
  const visiting = new Set<string>()
  
  function visit(serviceId: string): void {
    if (visited.has(serviceId)) {
      return
    }
    
    if (visiting.has(serviceId)) {
      throw new Error(`Circular dependency detected: ${serviceId}`)
    }
    
    visiting.add(serviceId)
    
    const definition = definitions.get(serviceId)
    if (definition?.dependencies) {
      for (const depId of definition.dependencies) {
        visit(depId)
      }
    }
    
    visiting.delete(serviceId)
    visited.add(serviceId)
    order.push(serviceId)
  }
  
  for (const serviceId of definitions.keys()) {
    visit(serviceId)
  }
  
  return order
}

// ==================== 内置服务 ID ====================

/**
 * 内置服务 ID 常量
 */
export const BuiltInServices = {
  // 核心服务
  EDITOR: 'lcedit.service.editor',
  EVENT_BUS: 'lcedit.service.eventBus',
  COMMAND: 'lcedit.service.command',
  HISTORY: 'lcedit.service.history',
  STATE: 'lcedit.service.state',
  
  // 注册表服务
  MATERIAL_REGISTRY: 'lcedit.service.materialRegistry',
  RENDERER_REGISTRY: 'lcedit.service.rendererRegistry',
  PLUGIN_MANAGER: 'lcedit.service.pluginManager',
  
  // 数据服务
  DATA: 'lcedit.service.data',
  STORAGE: 'lcedit.service.storage',
  
  // UI 服务
  THEME: 'lcedit.service.theme',
  I18N: 'lcedit.service.i18n',
  NOTIFICATION: 'lcedit.service.notification',
  
  // 工具服务
  VALIDATOR: 'lcedit.service.validator',
  SERIALIZER: 'lcedit.service.serializer',
  LOGGER: 'lcedit.service.logger',
} as const

// ==================== 服务生命周期钩子 ====================

/**
 * 服务生命周期钩子
 */
export interface ServiceLifecycleHooks {
  /**
   * 服务初始化前
   */
  beforeInit?(context: ServiceFactoryContext): void | Promise<void>
  
  /**
   * 服务初始化后
   */
  afterInit?(instance: unknown, context: ServiceFactoryContext): void | Promise<void>
  
  /**
   * 服务销毁前
   */
  beforeDispose?(instance: unknown): void | Promise<void>
  
  /**
   * 服务销毁后
   */
  afterDispose?(): void | Promise<void>
}

/**
 * 可销毁的服务
 */
export interface DisposableService {
  dispose(): void | Promise<void>
}

/**
 * 检查服务是否可销毁
 */
export function isDisposableService(service: unknown): service is DisposableService {
  return (
    service != null &&
    typeof service === 'object' &&
    'dispose' in service &&
    typeof (service as any).dispose === 'function'
  )
}

