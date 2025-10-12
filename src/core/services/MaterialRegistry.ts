/**
 * 物料注册表实现（增强版）
 *
 * 实现完整的物料协议，支持生命周期、事件等
 */

import { IMaterialRegistry, IMaterialDefinition } from '../protocols/IMaterialProtocol'
import { IEventBus, EditorEventType } from '../protocols/IEventProtocol'

interface IMaterialVersion {
  version: string
  definition: IMaterialDefinition
  registeredAt: number
}

interface IMaterialUpdate {
  type: string
  currentVersion: string
  latestVersion: string
  changelog?: string
}

export class MaterialRegistry implements IMaterialRegistry {
  private materials: Map<string, IMaterialDefinition> = new Map()
  // 版本管理：type -> version -> definition
  private materialVersions: Map<string, Map<string, IMaterialVersion>> = new Map()
  // 依赖关系：type -> dependencies[]
  private dependencies: Map<string, string[]> = new Map()
  private eventBus?: IEventBus

  constructor(eventBus?: IEventBus) {
    this.eventBus = eventBus
  }

  /**
   * 注册物料（支持版本）
   */
  public register(definition: IMaterialDefinition, version?: string): void {
    const { type } = definition.meta

    // 验证物料定义
    this.validateMaterialDefinition(definition)

    const materialVersion = version || definition.meta.version || '1.0.0'
    const existingMaterial = this.materials.get(type)

    // 存储所有版本
    if (!this.materialVersions.has(type)) {
      this.materialVersions.set(type, new Map())
    }

    const versionMap = this.materialVersions.get(type)!
    versionMap.set(materialVersion, {
      version: materialVersion,
      definition,
      registeredAt: Date.now(),
    })

    // 当前版本指向最新版本
    const existingVersions = Array.from(versionMap.keys())
    const latestVersion = this.getLatestVersion(existingVersions)

    if (materialVersion === latestVersion) {
      this.materials.set(type, definition)
    }

    // 记录依赖关系（如果定义中有 dependencies 字段）
    const deps = (definition.meta as any).dependencies
    if (deps && Array.isArray(deps)) {
      this.dependencies.set(type, deps)
    }

    // 发送注册事件
    this.eventBus?.emit(EditorEventType.MATERIAL_REGISTERED, {
      materialType: type,
      version: materialVersion,
      definition,
      isUpdate: !!existingMaterial,
    })
  }

  /**
   * 批量注册物料
   */
  public registerAll(definitions: IMaterialDefinition[]): void {
    definitions.forEach(def => this.register(def))
  }

  /**
   * 获取物料定义
   */
  public get(type: string): IMaterialDefinition | undefined {
    return this.materials.get(type)
  }

  /**
   * 获取所有物料
   */
  public getAll(): IMaterialDefinition[] {
    return Array.from(this.materials.values())
  }

  /**
   * 按分类获取物料
   */
  public getByCategory(category: string): IMaterialDefinition[] {
    return this.getAll().filter(def => def.meta.category === category)
  }

  /**
   * 检查物料是否已注册
   */
  public has(type: string): boolean {
    return this.materials.has(type)
  }

  /**
   * 注销物料
   */
  public unregister(type: string): void {
    const definition = this.materials.get(type)
    if (definition) {
      this.materials.delete(type)

      // 发送注销事件
      this.eventBus?.emit(EditorEventType.MATERIAL_UNREGISTERED, {
        materialType: type,
      })
    }
  }

  /**
   * 按标签搜索
   */
  public searchByTags(tags: string[]): IMaterialDefinition[] {
    return this.getAll().filter(def => {
      const materialTags = def.meta.tags || []
      return tags.some(tag => materialTags.includes(tag))
    })
  }

  /**
   * 获取所有分类
   */
  public getAllCategories(): string[] {
    const categories = new Set<string>()
    this.getAll().forEach(def => categories.add(def.meta.category))
    return Array.from(categories)
  }

  /**
   * 获取物料的指定版本
   */
  public getVersion(type: string, version: string): IMaterialDefinition | undefined {
    const versionMap = this.materialVersions.get(type)
    if (!versionMap) return undefined

    const materialVersion = versionMap.get(version)
    return materialVersion?.definition
  }

  /**
   * 获取物料的所有版本
   */
  public getAllVersions(type: string): string[] {
    const versionMap = this.materialVersions.get(type)
    if (!versionMap) return []

    return Array.from(versionMap.keys()).sort(this.compareVersions.bind(this))
  }

  /**
   * 获取物料的最新版本号
   */
  public getLatestVersionNumber(type: string): string | undefined {
    const versions = this.getAllVersions(type)
    return versions.length > 0 ? versions[versions.length - 1] : undefined
  }

  /**
   * 检查是否有更新
   */
  public checkForUpdates(): IMaterialUpdate[] {
    const updates: IMaterialUpdate[] = []

    for (const [type, versionMap] of this.materialVersions.entries()) {
      const versions = Array.from(versionMap.keys()).sort(this.compareVersions.bind(this))
      if (versions.length > 1) {
        const current = this.materials.get(type)
        const currentVersion = current?.meta.version || '1.0.0'
        const latestVersion = versions[versions.length - 1]

        if (currentVersion !== latestVersion) {
          updates.push({
            type,
            currentVersion,
            latestVersion,
          })
        }
      }
    }

    return updates
  }

  /**
   * 获取物料的依赖
   */
  public getDependencies(type: string): string[] {
    return this.dependencies.get(type) || []
  }

  /**
   * 获取依赖此物料的其他物料
   */
  public getDependents(type: string): string[] {
    const dependents: string[] = []

    for (const [materialType, deps] of this.dependencies.entries()) {
      if (deps.includes(type)) {
        dependents.push(materialType)
      }
    }

    return dependents
  }

  /**
   * 检查依赖是否满足
   */
  public checkDependencies(type: string): { satisfied: boolean; missing: string[] } {
    const deps = this.getDependencies(type)
    const missing = deps.filter(dep => !this.has(dep))

    return {
      satisfied: missing.length === 0,
      missing,
    }
  }

  /**
   * 获取版本历史
   */
  public getVersionHistory(type: string): IMaterialVersion[] {
    const versionMap = this.materialVersions.get(type)
    if (!versionMap) return []

    return Array.from(versionMap.values()).sort((a, b) => {
      return this.compareVersions(a.version, b.version)
    })
  }

  /**
   * 比较版本号
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number)
    const parts2 = v2.split('.').map(Number)

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0
      const part2 = parts2[i] || 0

      if (part1 < part2) return -1
      if (part1 > part2) return 1
    }

    return 0
  }

  /**
   * 获取最新版本
   */
  private getLatestVersion(versions: string[]): string {
    if (versions.length === 0) return '1.0.0'
    return versions.sort(this.compareVersions.bind(this))[versions.length - 1]
  }

  /**
   * 验证物料定义
   */
  private validateMaterialDefinition(definition: IMaterialDefinition): void {
    if (!definition.meta.type) {
      throw new Error('[MaterialRegistry] 物料类型不能为空')
    }

    if (!definition.meta.title) {
      throw new Error(`[MaterialRegistry] 物料 "${definition.meta.type}" 必须有标题`)
    }

    if (!definition.component) {
      throw new Error(`[MaterialRegistry] 物料 "${definition.meta.type}" 必须提供React组件`)
    }

    if (!Array.isArray(definition.propsSchema)) {
      throw new Error(`[MaterialRegistry] 物料 "${definition.meta.type}" 必须提供propsSchema数组`)
    }

    // 验证属性Schema
    definition.propsSchema.forEach(propSchema => {
      if (!propSchema.name) {
        throw new Error(`[MaterialRegistry] 物料 "${definition.meta.type}" 的属性Schema必须有name`)
      }
      if (!propSchema.label) {
        throw new Error(
          `[MaterialRegistry] 物料 "${definition.meta.type}" 的属性 "${propSchema.name}" 必须有label`
        )
      }
    })

    // 验证能力配置
    const capabilities = definition.capabilities
    if (capabilities) {
      if (capabilities.minChildren !== undefined && capabilities.maxChildren !== undefined) {
        if (capabilities.minChildren > capabilities.maxChildren) {
          throw new Error(
            `[MaterialRegistry] 物料 "${definition.meta.type}" 的minChildren不能大于maxChildren`
          )
        }
      }
    }
  }
}

// 服务标识符
export const MATERIAL_REGISTRY_TOKEN = Symbol('MaterialRegistry')
