/**
 * 扩展服务实现
 *
 * 管理扩展点和扩展，提供系统的动态扩展能力
 */

import {
  IExtensionService,
  IExtensionPoint,
  IExtension,
  IExtensionContributor,
  IExtensionContext,
  IExtensionResult,
} from '../protocols/IExtensionProtocol'
import { IEventBus } from '../protocols/IEventProtocol'

export class ExtensionService implements IExtensionService {
  private extensionPoints: Map<string, IExtensionPoint> = new Map()
  private extensions: Map<string, IExtension> = new Map()
  // 扩展点ID -> 扩展列表
  private extensionsByPoint: Map<string, IExtension[]> = new Map()
  private eventBus?: IEventBus

  constructor(eventBus?: IEventBus) {
    this.eventBus = eventBus
  }

  /**
   * 注册扩展点
   */
  public registerExtensionPoint<T = any>(point: IExtensionPoint<T>): void {
    if (this.extensionPoints.has(point.id)) {
      console.warn(`[ExtensionService] 扩展点 "${point.id}" 已存在，将被覆盖`)
    }

    this.extensionPoints.set(point.id, point)
    this.extensionsByPoint.set(point.id, [])

    this.eventBus?.emit('extension:point-registered', { point })
  }

  /**
   * 注册扩展
   */
  public registerExtension<T = any>(extension: IExtension<T>): void {
    const { id, extensionPointId } = extension

    // 检查扩展点是否存在
    if (!this.extensionPoints.has(extensionPointId)) {
      throw new Error(
        `[ExtensionService] 扩展点 "${extensionPointId}" 不存在，无法注册扩展 "${id}"`
      )
    }

    // 验证扩展
    if (!this.validateExtension(extension)) {
      throw new Error(`[ExtensionService] 扩展 "${id}" 验证失败`)
    }

    const normalizedExtension: IExtension<T> = {
      ...extension,
      enabled: extension.enabled ?? true,
      priority: extension.priority ?? 0,
    }

    this.extensions.set(id, normalizedExtension)

    // 添加到扩展点列表
    const extensions = this.extensionsByPoint.get(extensionPointId) || []
    extensions.push(normalizedExtension)
    // 按优先级排序
    extensions.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    this.extensionsByPoint.set(extensionPointId, extensions)

    this.eventBus?.emit('extension:registered', { extension: normalizedExtension })
  }

  /**
   * 批量注册
   */
  public registerContributor(contributor: IExtensionContributor): void {
    const { contributes } = contributor

    if (contributes?.extensionPoints) {
      contributes.extensionPoints.forEach(point => this.registerExtensionPoint(point))
    }

    if (contributes?.extensions) {
      contributes.extensions.forEach(extension => this.registerExtension(extension))
    }

    this.eventBus?.emit('extension:contributor-registered', { contributor })
  }

  /**
   * 获取扩展点
   */
  public getExtensionPoint(id: string): IExtensionPoint | undefined {
    return this.extensionPoints.get(id)
  }

  /**
   * 获取扩展点的所有扩展
   */
  public getExtensions<T = any>(extensionPointId: string): IExtension<T>[] {
    return (this.extensionsByPoint.get(extensionPointId) || []) as IExtension<T>[]
  }

  /**
   * 获取启用的扩展
   */
  public getEnabledExtensions<T = any>(extensionPointId: string): IExtension<T>[] {
    return this.getExtensions<T>(extensionPointId).filter(ext => ext.enabled)
  }

  /**
   * 执行扩展
   */
  public async execute<T = any, R = any>(
    extensionPointId: string,
    context?: IExtensionContext,
    ...args: any[]
  ): Promise<IExtensionResult<R>[]> {
    const extensions = this.getEnabledExtensions<T>(extensionPointId)
    const results: IExtensionResult<R>[] = []

    for (const extension of extensions) {
      try {
        // 检查激活条件
        if (extension.condition) {
          const shouldActivate = await extension.condition()
          if (!shouldActivate) {
            continue
          }
        }

        const extContext: IExtensionContext = {
          ...context,
          extensionId: extension.id,
          extensionPointId,
        }

        // 执行扩展实现
        const implementation = extension.implementation
        let result: R | undefined

        if (typeof implementation === 'function') {
          result = await implementation(extContext, ...args)
        } else if (implementation && typeof (implementation as any).execute === 'function') {
          result = await (implementation as any).execute(extContext, ...args)
        }

        results.push({
          success: true,
          data: result,
          extensionId: extension.id,
        })

        this.eventBus?.emit('extension:executed', { extension, result })
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        results.push({
          success: false,
          error: err,
          extensionId: extension.id,
        })

        console.error(`[ExtensionService] 扩展 "${extension.id}" 执行失败:`, err)
        this.eventBus?.emit('extension:error', { extension, error: err })
      }
    }

    return results
  }

  /**
   * 执行第一个匹配的扩展
   */
  public async executeFirst<T = any, R = any>(
    extensionPointId: string,
    context?: IExtensionContext,
    ...args: any[]
  ): Promise<IExtensionResult<R> | null> {
    const extensions = this.getEnabledExtensions<T>(extensionPointId)

    for (const extension of extensions) {
      try {
        // 检查激活条件
        if (extension.condition) {
          const shouldActivate = await extension.condition()
          if (!shouldActivate) {
            continue
          }
        }

        const extContext: IExtensionContext = {
          ...context,
          extensionId: extension.id,
          extensionPointId,
        }

        // 执行扩展实现
        const implementation = extension.implementation
        let result: R | undefined

        if (typeof implementation === 'function') {
          result = await implementation(extContext, ...args)
        } else if (implementation && typeof (implementation as any).execute === 'function') {
          result = await (implementation as any).execute(extContext, ...args)
        }

        this.eventBus?.emit('extension:executed', { extension, result })

        return {
          success: true,
          data: result,
          extensionId: extension.id,
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        console.error(`[ExtensionService] 扩展 "${extension.id}" 执行失败:`, err)
        this.eventBus?.emit('extension:error', { extension, error: err })
        // 继续尝试下一个扩展
      }
    }

    return null
  }

  /**
   * 启用扩展
   */
  public enableExtension(extensionId: string): void {
    const extension = this.extensions.get(extensionId)
    if (extension) {
      extension.enabled = true
      this.eventBus?.emit('extension:enabled', { extensionId })
    }
  }

  /**
   * 禁用扩展
   */
  public disableExtension(extensionId: string): void {
    const extension = this.extensions.get(extensionId)
    if (extension) {
      extension.enabled = false
      this.eventBus?.emit('extension:disabled', { extensionId })
    }
  }

  /**
   * 注销扩展
   */
  public unregisterExtension(extensionId: string): void {
    const extension = this.extensions.get(extensionId)
    if (extension) {
      this.extensions.delete(extensionId)

      // 从扩展点列表中移除
      const extensions = this.extensionsByPoint.get(extension.extensionPointId) || []
      const index = extensions.findIndex(ext => ext.id === extensionId)
      if (index !== -1) {
        extensions.splice(index, 1)
      }

      this.eventBus?.emit('extension:unregistered', { extensionId })
    }
  }

  /**
   * 注销扩展点
   */
  public unregisterExtensionPoint(extensionPointId: string): void {
    // 注销该扩展点的所有扩展
    const extensions = this.extensionsByPoint.get(extensionPointId) || []
    extensions.forEach(ext => this.unregisterExtension(ext.id))

    this.extensionPoints.delete(extensionPointId)
    this.extensionsByPoint.delete(extensionPointId)

    this.eventBus?.emit('extension:point-unregistered', { extensionPointId })
  }

  /**
   * 验证扩展
   */
  public validateExtension<T = any>(extension: IExtension<T>): boolean {
    const point = this.extensionPoints.get(extension.extensionPointId)
    if (!point) {
      return false
    }

    // 使用扩展点的验证函数
    if (point.validate) {
      return point.validate(extension.implementation)
    }

    // 检查是否允许多个扩展
    if (!point.multiple) {
      const existing = this.extensionsByPoint.get(extension.extensionPointId) || []
      if (existing.length > 0) {
        console.warn(`[ExtensionService] 扩展点 "${extension.extensionPointId}" 不允许多个扩展`)
        return false
      }
    }

    return true
  }

  /**
   * 获取所有扩展点
   */
  public getAllExtensionPoints(): IExtensionPoint[] {
    return Array.from(this.extensionPoints.values())
  }

  /**
   * 获取所有扩展
   */
  public getAllExtensions(): IExtension[] {
    return Array.from(this.extensions.values())
  }
}

// 服务标识符
export const EXTENSION_SERVICE_TOKEN = Symbol('ExtensionService')
