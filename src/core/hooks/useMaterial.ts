/**
 * 物料相关的自定义Hooks
 * 
 * 提供便捷的物料操作接口
 */

import { useMemo } from 'react'
import { useMaterialRegistry } from '../context/EditorContext'
import { IMaterialDefinition } from '../protocols/IMaterialProtocol'

/**
 * 获取物料定义
 */
export function useMaterial(materialType: string): IMaterialDefinition | undefined {
  const registry = useMaterialRegistry()
  return useMemo(() => registry.get(materialType), [registry, materialType])
}

/**
 * 获取所有物料
 */
export function useAllMaterials(): IMaterialDefinition[] {
  const registry = useMaterialRegistry()
  return useMemo(() => registry.getAll(), [registry])
}

/**
 * 按分类获取物料
 */
export function useMaterialsByCategory(category: string): IMaterialDefinition[] {
  const registry = useMaterialRegistry()
  return useMemo(() => registry.getByCategory(category), [registry, category])
}

/**
 * 获取所有物料分类
 */
export function useMaterialCategories(): string[] {
  const materials = useAllMaterials()
  return useMemo(() => {
    const categories = new Set<string>()
    materials.forEach(m => categories.add(m.meta.category))
    return Array.from(categories).sort()
  }, [materials])
}

/**
 * 搜索物料
 */
export function useSearchMaterials(searchTerm: string): IMaterialDefinition[] {
  const materials = useAllMaterials()
  
  return useMemo(() => {
    if (!searchTerm) return materials
    
    const term = searchTerm.toLowerCase()
    return materials.filter(m => {
      return (
        m.meta.title.toLowerCase().includes(term) ||
        m.meta.description?.toLowerCase().includes(term) ||
        m.meta.type.toLowerCase().includes(term) ||
        m.meta.tags?.some(tag => tag.toLowerCase().includes(term))
      )
    })
  }, [materials, searchTerm])
}

/**
 * 按标签搜索物料
 */
export function useMaterialsByTags(tags: string[]): IMaterialDefinition[] {
  const registry = useMaterialRegistry()
  return useMemo(() => registry.searchByTags(tags), [registry, tags])
}

/**
 * 检查物料能力
 */
export function useMaterialCapability(
  materialType: string,
  capability: keyof NonNullable<IMaterialDefinition['capabilities']>
): boolean {
  const material = useMaterial(materialType)
  return useMemo(() => {
    if (!material?.capabilities) return true // 默认允许
    return material.capabilities[capability] !== false
  }, [material, capability])
}

