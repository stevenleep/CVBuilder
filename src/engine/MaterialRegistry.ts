/**
 * 物料注册表实现
 * 
 * 采用单例模式，管理所有物料的注册和查询
 */

import { MaterialDefinition, MaterialRegistry as IMaterialRegistry, MaterialType } from '@types/material'

class MaterialRegistry implements IMaterialRegistry {
  private static instance: MaterialRegistry
  private materials: Map<MaterialType, MaterialDefinition>

  private constructor() {
    this.materials = new Map()
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): MaterialRegistry {
    if (!MaterialRegistry.instance) {
      MaterialRegistry.instance = new MaterialRegistry()
    }
    return MaterialRegistry.instance
  }

  /**
   * 注册物料
   */
  public register(definition: MaterialDefinition): void {
    const { type } = definition.meta
    
    this.materials.set(type, definition)
  }

  /**
   * 批量注册物料
   */
  public registerAll(definitions: MaterialDefinition[]): void {
    definitions.forEach(def => this.register(def))
  }

  /**
   * 获取物料定义
   */
  public get(type: MaterialType): MaterialDefinition | undefined {
    return this.materials.get(type)
  }

  /**
   * 获取所有物料
   */
  public getAll(): MaterialDefinition[] {
    return Array.from(this.materials.values())
  }

  /**
   * 按分类获取物料
   */
  public getByCategory(category: string): MaterialDefinition[] {
    return this.getAll().filter(def => def.meta.category === category)
  }

  /**
   * 检查物料是否已注册
   */
  public has(type: MaterialType): boolean {
    return this.materials.has(type)
  }

  /**
   * 获取所有分类
   */
  public getAllCategories(): string[] {
    const categories = new Set<string>()
    this.getAll().forEach(def => categories.add(def.meta.category))
    return Array.from(categories)
  }
}

// 导出单例实例
export const materialRegistry = MaterialRegistry.getInstance()

