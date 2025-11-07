/**
 * 物料注册表
 * 
 * 实现物料管理，支持：
 * - 物料注册/注销
 * - 物料查询（按 ID、分类、标签等）
 * - 物料验证
 * - 物料元数据管理
 * - 物料依赖解析
 * 
 * @packageDocumentation
 */

import type {
  MaterialDefinition,
} from '../protocols/material/MaterialProtocol'

import type { IEventBus } from '../protocols/event/EventProtocol'
import type { Validator, ValidationResult } from '../utils/validation'

// ==================== 注册表接口 ====================

/**
 * 物料注册表接口
 */
export interface IMaterialRegistry {
  /**
   * 注册物料
   */
  register(material: MaterialDefinition): void
  
  /**
   * 注销物料
   */
  unregister(materialId: string): boolean
  
  /**
   * 获取物料
   */
  get(materialId: string): MaterialDefinition | undefined
  
  /**
   * 检查物料是否存在
   */
  has(materialId: string): boolean
  
  /**
   * 获取所有物料
   */
  getAll(): readonly MaterialDefinition[]
  
  /**
   * 按分类获取物料
   */
  getByCategory(category: string): readonly MaterialDefinition[]
  
  /**
   * 按标签获取物料
   */
  getByTags(tags: readonly string[]): readonly MaterialDefinition[]
  
  /**
   * 搜索物料
   */
  search(query: string): readonly MaterialDefinition[]
  
  /**
   * 验证物料
   */
  validate(material: MaterialDefinition): ValidationResult
  
  /**
   * 清空注册表
   */
  clear(): void
  
  /**
   * 获取统计信息
   */
  getStats(): MaterialRegistryStats
}

/**
 * 物料注册表统计
 */
export interface MaterialRegistryStats {
  /** 总物料数 */
  readonly totalCount: number
  
  /** 分类统计 */
  readonly categoryCounts: Record<string, number>
  
  /** 标签统计 */
  readonly tagCounts: Record<string, number>
  
  /** 能力统计 */
  readonly capabilityCounts: {
    readonly draggable: number
    readonly droppable: number
    readonly resizable: number
    readonly rotatable: number
    readonly editable: number
    readonly deletable: number
    readonly copyable: number
    readonly lockable: number
  }
}

// ==================== 物料注册表实现 ====================

/**
 * 物料注册表实现
 */
export class MaterialRegistry implements IMaterialRegistry {
  /** 物料映射（ID -> 物料） */
  private readonly materials = new Map<string, MaterialDefinition>()
  
  /** 分类索引 */
  private readonly categoryIndex = new Map<string, Set<string>>()
  
  /** 标签索引 */
  private readonly tagIndex = new Map<string, Set<string>>()
  
  /** 事件总线（可选） */
  private readonly eventBus?: IEventBus
  
  /** 物料验证器（可选） */
  private readonly validator?: Validator<MaterialDefinition>
  
  constructor(options?: {
    eventBus?: IEventBus
    validator?: Validator<MaterialDefinition>
  }) {
    this.eventBus = options?.eventBus
    this.validator = options?.validator
  }
  
  // ==================== 注册/注销 ====================
  
  /**
   * 注册物料
   */
  register(material: MaterialDefinition): void {
    // 验证物料
    if (this.validator) {
      const result = this.validator.validate(material)
      if (!result.valid) {
        const errors = result.errors?.map(e => e.message).join(', ')
        throw new Error(`Material validation failed: ${errors}`)
      }
    }
    
    // 检查是否已存在
    if (this.materials.has(material.id)) {
      throw new Error(`Material "${material.id}" is already registered`)
    }
    
    // 注册物料
    this.materials.set(material.id, material)
    
    // 更新分类索引
    const category = material.metadata.category
    if (!this.categoryIndex.has(category)) {
      this.categoryIndex.set(category, new Set())
    }
    this.categoryIndex.get(category)!.add(material.id)
    
    // 更新标签索引
    const tags = material.metadata.tags || []
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set())
      }
      this.tagIndex.get(tag)!.add(material.id)
    }
    
    // 发送事件
    this.eventBus?.emitSync('material:registered', {
      materialId: material.id,
      material,
    })
  }
  
  /**
   * 注销物料
   */
  unregister(materialId: string): boolean {
    const material = this.materials.get(materialId)
    if (!material) {
      return false
    }
    
    // 移除物料
    this.materials.delete(materialId)
    
    // 更新分类索引
    const category = material.metadata.category
    const categorySet = this.categoryIndex.get(category)
    if (categorySet) {
      categorySet.delete(materialId)
      if (categorySet.size === 0) {
        this.categoryIndex.delete(category)
      }
    }
    
    // 更新标签索引
    const tags = material.metadata.tags || []
    for (const tag of tags) {
      const tagSet = this.tagIndex.get(tag)
      if (tagSet) {
        tagSet.delete(materialId)
        if (tagSet.size === 0) {
          this.tagIndex.delete(tag)
        }
      }
    }
    
    // 发送事件
    this.eventBus?.emitSync('material:unregistered', {
      materialId,
      material,
    })
    
    return true
  }
  
  // ==================== 查询方法 ====================
  
  /**
   * 获取物料
   */
  get(materialId: string): MaterialDefinition | undefined {
    return this.materials.get(materialId)
  }
  
  /**
   * 检查物料是否存在
   */
  has(materialId: string): boolean {
    return this.materials.has(materialId)
  }
  
  /**
   * 获取所有物料
   */
  getAll(): readonly MaterialDefinition[] {
    return Array.from(this.materials.values())
  }
  
  /**
   * 按分类获取物料
   */
  getByCategory(category: string): readonly MaterialDefinition[] {
    const ids = this.categoryIndex.get(category)
    if (!ids) {
      return []
    }
    
    const materials: MaterialDefinition[] = []
    for (const id of ids) {
      const material = this.materials.get(id)
      if (material) {
        materials.push(material)
      }
    }
    
    return materials
  }
  
  /**
   * 按标签获取物料（返回包含任意标签的物料）
   */
  getByTags(tags: readonly string[]): readonly MaterialDefinition[] {
    const idSet = new Set<string>()
    
    for (const tag of tags) {
      const ids = this.tagIndex.get(tag)
      if (ids) {
        for (const id of ids) {
          idSet.add(id)
        }
      }
    }
    
    const materials: MaterialDefinition[] = []
    for (const id of idSet) {
      const material = this.materials.get(id)
      if (material) {
        materials.push(material)
      }
    }
    
    return materials
  }
  
  /**
   * 搜索物料
   */
  search(query: string): readonly MaterialDefinition[] {
    const lowerQuery = query.toLowerCase()
    const results: MaterialDefinition[] = []
    
    for (const material of this.materials.values()) {
      // 搜索 ID
      if (material.id.toLowerCase().includes(lowerQuery)) {
        results.push(material)
        continue
      }
      
      // 搜索名称
      const name = typeof material.metadata.name === 'string'
        ? material.metadata.name
        : material.metadata.name.en || Object.values(material.metadata.name)[0]
      
      if (name.toLowerCase().includes(lowerQuery)) {
        results.push(material)
        continue
      }
      
      // 搜索描述
      if (material.metadata.description) {
        const desc = typeof material.metadata.description === 'string'
          ? material.metadata.description
          : material.metadata.description.en || Object.values(material.metadata.description)[0]
        
        if (desc.toLowerCase().includes(lowerQuery)) {
          results.push(material)
          continue
        }
      }
      
      // 搜索标签
      if (material.metadata.tags) {
        if (material.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
          results.push(material)
          continue
        }
      }
      
      // 搜索关键词
      if (material.metadata.keywords) {
        if (material.metadata.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))) {
          results.push(material)
        }
      }
    }
    
    return results
  }
  
  /**
   * 获取所有分类
   */
  getCategories(): readonly string[] {
    return Array.from(this.categoryIndex.keys())
  }
  
  /**
   * 获取所有标签
   */
  getTags(): readonly string[] {
    return Array.from(this.tagIndex.keys())
  }
  
  // ==================== 验证 ====================
  
  /**
   * 验证物料
   */
  validate(material: MaterialDefinition): ValidationResult {
    if (this.validator) {
      return this.validator.validate(material)
    }
    
    // 基本验证
    const errors: Array<{
      code: string
      message: string
      severity: 'error' | 'critical'
      path?: string
      value?: unknown
      details?: Record<string, unknown>
    }> = []
    
    if (!material.id) {
      errors.push({
        code: 'required',
        message: 'Material ID is required',
        severity: 'error',
        path: 'id',
      })
    }
    
    if (!material.metadata.name) {
      errors.push({
        code: 'required',
        message: 'Material name is required',
        severity: 'error',
        path: 'metadata.name',
      })
    }
    
    if (!material.metadata.category) {
      errors.push({
        code: 'required',
        message: 'Material category is required',
        severity: 'error',
        path: 'metadata.category',
      })
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  }
  
  // ==================== 工具方法 ====================
  
  /**
   * 清空注册表
   */
  clear(): void {
    this.materials.clear()
    this.categoryIndex.clear()
    this.tagIndex.clear()
    
    this.eventBus?.emitSync('material:cleared', {})
  }
  
  /**
   * 获取统计信息
   */
  getStats(): MaterialRegistryStats {
    const categoryCounts: Record<string, number> = {}
    for (const [category, ids] of this.categoryIndex) {
      categoryCounts[category] = ids.size
    }
    
    const tagCounts: Record<string, number> = {}
    for (const [tag, ids] of this.tagIndex) {
      tagCounts[tag] = ids.size
    }
    
    const capabilityCounts = {
      draggable: 0,
      droppable: 0,
      resizable: 0,
      rotatable: 0,
      editable: 0,
      deletable: 0,
      copyable: 0,
      lockable: 0,
    }
    
    for (const material of this.materials.values()) {
      const cap = material.capabilities
      if (cap.interaction?.draggable) capabilityCounts.draggable++
      if (cap.interaction?.droppable) capabilityCounts.droppable++
      if (cap.interaction?.resizable) capabilityCounts.resizable++
      if (cap.interaction?.rotatable) capabilityCounts.rotatable++
      if (cap.editing?.deletable) capabilityCounts.deletable++
      if (cap.editing?.copyable) capabilityCounts.copyable++
      if (cap.editing?.lockable) capabilityCounts.lockable++
      // 注意：editable 不在 capabilities 中定义，使用 editing 作为替代
      if (cap.editing) capabilityCounts.editable++
    }
    
    return {
      totalCount: this.materials.size,
      categoryCounts,
      tagCounts,
      capabilityCounts,
    }
  }
  
  /**
   * 导出为 JSON
   */
  toJSON(): unknown {
    return {
      materials: Array.from(this.materials.values()),
      stats: this.getStats(),
    }
  }
}

// ==================== 导出 ====================

/**
 * 创建物料注册表
 */
export function createMaterialRegistry(options?: {
  eventBus?: IEventBus
  validator?: Validator<MaterialDefinition>
}): IMaterialRegistry {
  return new MaterialRegistry(options)
}

/**
 * 全局物料注册表实例（可选）
 */
let globalMaterialRegistry: IMaterialRegistry | null = null

/**
 * 获取全局物料注册表
 */
export function getGlobalMaterialRegistry(): IMaterialRegistry {
  if (!globalMaterialRegistry) {
    globalMaterialRegistry = createMaterialRegistry()
  }
  return globalMaterialRegistry
}

/**
 * 设置全局物料注册表
 */
export function setGlobalMaterialRegistry(registry: IMaterialRegistry): void {
  globalMaterialRegistry = registry
}

/**
 * 重置全局物料注册表
 */
export function resetGlobalMaterialRegistry(): void {
  if (globalMaterialRegistry) {
    globalMaterialRegistry.clear()
    globalMaterialRegistry = null
  }
}

