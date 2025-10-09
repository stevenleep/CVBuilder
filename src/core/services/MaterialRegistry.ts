/**
 * 物料注册表实现（增强版）
 * 
 * 实现完整的物料协议，支持生命周期、事件等
 */

import { IMaterialRegistry, IMaterialDefinition } from '../protocols/IMaterialProtocol'
import { IEventBus, EditorEventType } from '../protocols/IEventProtocol'

export class MaterialRegistry implements IMaterialRegistry {
  private materials: Map<string, IMaterialDefinition> = new Map()
  private eventBus?: IEventBus

  constructor(eventBus?: IEventBus) {
    this.eventBus = eventBus
  }

  /**
   * 注册物料
   */
  public register(definition: IMaterialDefinition): void {
    const { type } = definition.meta

    // 验证物料定义
    this.validateMaterialDefinition(definition)

    if (this.materials.has(type)) {
      console.warn(`[MaterialRegistry] 物料 "${type}" 已存在，将被覆盖`)
    }

    this.materials.set(type, definition)
    
    // 发送注册事件
    this.eventBus?.emit(EditorEventType.MATERIAL_REGISTERED, { 
      materialType: type,
      definition 
    })

    console.log(`[MaterialRegistry] 注册物料: ${type}`)
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
        materialType: type 
      })
      
      console.log(`[MaterialRegistry] 注销物料: ${type}`)
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
        throw new Error(`[MaterialRegistry] 物料 "${definition.meta.type}" 的属性 "${propSchema.name}" 必须有label`)
      }
    })

    // 验证能力配置
    const capabilities = definition.capabilities
    if (capabilities) {
      if (capabilities.minChildren !== undefined && capabilities.maxChildren !== undefined) {
        if (capabilities.minChildren > capabilities.maxChildren) {
          throw new Error(`[MaterialRegistry] 物料 "${definition.meta.type}" 的minChildren不能大于maxChildren`)
        }
      }
    }
  }
}

// 服务标识符
export const MATERIAL_REGISTRY_TOKEN = Symbol('MaterialRegistry')

