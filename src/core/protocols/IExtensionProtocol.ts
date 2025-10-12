/**
 * 扩展系统协议
 *
 * 定义扩展点和扩展的完整接口，支持系统的动态扩展
 */

/**
 * 扩展点定义
 */
export interface IExtensionPoint<T = any> {
  /** 扩展点ID */
  id: string
  /** 扩展点名称 */
  name: string
  /** 描述 */
  description?: string
  /** 期望的扩展类型 */
  type: string
  /** 是否允许多个扩展 */
  multiple?: boolean
  /** 是否必需至少一个扩展 */
  required?: boolean
  /** 默认扩展 */
  defaultExtension?: T
  /** 验证扩展 */
  validate?: (extension: T) => boolean
}

/**
 * 扩展定义
 */
export interface IExtension<T = any> {
  /** 扩展ID */
  id: string
  /** 扩展点ID */
  extensionPointId: string
  /** 扩展名称 */
  name: string
  /** 描述 */
  description?: string
  /** 扩展实现 */
  implementation: T
  /** 优先级（越大越先执行） */
  priority?: number
  /** 是否启用 */
  enabled?: boolean
  /** 激活条件 */
  condition?: () => boolean | Promise<boolean>
  /** 元数据 */
  metadata?: Record<string, any>
}

/**
 * 扩展贡献者
 */
export interface IExtensionContributor {
  /** 贡献者ID */
  id: string
  /** 贡献者名称 */
  name: string
  /** 版本 */
  version?: string
  /** 提供的扩展点 */
  contributes?: {
    extensionPoints?: IExtensionPoint[]
    extensions?: IExtension[]
  }
}

/**
 * 扩展上下文
 */
export interface IExtensionContext {
  /** 扩展ID */
  extensionId: string
  /** 扩展点ID */
  extensionPointId: string
  /** 其他上下文数据 */
  [key: string]: any
}

/**
 * 扩展调用结果
 */
export interface IExtensionResult<T = any> {
  /** 是否成功 */
  success: boolean
  /** 结果数据 */
  data?: T
  /** 错误信息 */
  error?: Error
  /** 扩展ID */
  extensionId?: string
}

/**
 * 扩展服务接口
 */
export interface IExtensionService {
  /** 注册扩展点 */
  registerExtensionPoint<T = any>(point: IExtensionPoint<T>): void

  /** 注册扩展 */
  registerExtension<T = any>(extension: IExtension<T>): void

  /** 批量注册 */
  registerContributor(contributor: IExtensionContributor): void

  /** 获取扩展点 */
  getExtensionPoint(id: string): IExtensionPoint | undefined

  /** 获取扩展点的所有扩展 */
  getExtensions<T = any>(extensionPointId: string): IExtension<T>[]

  /** 获取启用的扩展 */
  getEnabledExtensions<T = any>(extensionPointId: string): IExtension<T>[]

  /** 执行扩展 */
  execute<T = any, R = any>(
    extensionPointId: string,
    context?: IExtensionContext,
    ...args: any[]
  ): Promise<IExtensionResult<R>[]>

  /** 执行第一个匹配的扩展 */
  executeFirst<T = any, R = any>(
    extensionPointId: string,
    context?: IExtensionContext,
    ...args: any[]
  ): Promise<IExtensionResult<R> | null>

  /** 启用扩展 */
  enableExtension(extensionId: string): void

  /** 禁用扩展 */
  disableExtension(extensionId: string): void

  /** 注销扩展 */
  unregisterExtension(extensionId: string): void

  /** 注销扩展点 */
  unregisterExtensionPoint(extensionPointId: string): void

  /** 验证扩展 */
  validateExtension<T = any>(extension: IExtension<T>): boolean

  /** 获取所有扩展点 */
  getAllExtensionPoints(): IExtensionPoint[]

  /** 获取所有扩展 */
  getAllExtensions(): IExtension[]
}
