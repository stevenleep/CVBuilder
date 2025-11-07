/**
 * 物料管理 Hook
 * 
 * 提供物料注册和查询功能
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useMaterialRegistry } from '../contexts/ServiceContext'
import type { MaterialDefinition, IMaterialRegistry } from '@lcedit/core'

// ==================== 类型定义 ====================

export interface UseMaterialsOptions {
  category?: string
  tags?: string[]
  autoRefresh?: boolean
}

export interface UseMaterialsResult {
  materials: readonly MaterialDefinition[]
  categories: string[]
  tags: string[]
  loading: boolean
  getMaterial: (id: string) => MaterialDefinition | undefined
  searchMaterials: (query: string) => readonly MaterialDefinition[]
  refresh: () => void
}

// ==================== Hook ====================

/**
 * 使用物料
 */
export function useMaterials(options?: UseMaterialsOptions): UseMaterialsResult {
  const materialRegistry = useMaterialRegistry()
  const { category, tags, autoRefresh = true } = options || {}
  
  const [materials, setMaterials] = useState<readonly MaterialDefinition[]>(() => {
    if (category) {
      return materialRegistry.getByCategory(category)
    } else if (tags && tags.length > 0) {
      return materialRegistry.getByTags(tags)
    } else {
      return materialRegistry.getAll()
    }
  })
  
  const [loading, setLoading] = useState(false)
  
  // 刷新物料列表
  const refresh = useCallback(() => {
    setLoading(true)
    
    try {
      if (category) {
        setMaterials(materialRegistry.getByCategory(category))
      } else if (tags && tags.length > 0) {
        setMaterials(materialRegistry.getByTags(tags))
      } else {
        setMaterials(materialRegistry.getAll())
      }
    } finally {
      setLoading(false)
    }
  }, [materialRegistry, category, tags])
  
  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return
    
    refresh()
  }, [refresh, autoRefresh])
  
  // 监听物料变化（如果事件总线可用）
  useEffect(() => {
    // TODO: 监听物料注册/注销事件
    // 当前简化实现
  }, [materialRegistry])
  
  // 获取分类列表
  const categories = useMemo(() => {
    const stats = materialRegistry.getStats()
    return Object.keys(stats.categoryCounts)
  }, [materialRegistry, materials])
  
  // 获取所有标签列表
  const allTags = useMemo(() => {
    const stats = materialRegistry.getStats()
    return Object.keys(stats.tagCounts)
  }, [materialRegistry, materials])
  
  // 获取单个物料
  const getMaterial = useCallback((id: string) => {
    return materialRegistry.get(id)
  }, [materialRegistry])
  
  // 搜索物料
  const searchMaterials = useCallback((query: string) => {
    return materialRegistry.search(query)
  }, [materialRegistry])
  
  return {
    materials,
    categories,
    tags: allTags,
    loading,
    getMaterial,
    searchMaterials,
    refresh,
  }
}

/**
 * 使用单个物料
 */
export function useMaterial(materialId: string): MaterialDefinition | undefined {
  const materialRegistry = useMaterialRegistry()
  const [material, setMaterial] = useState<MaterialDefinition | undefined>(() => 
    materialRegistry.get(materialId)
  )
  
  useEffect(() => {
    setMaterial(materialRegistry.get(materialId))
  }, [materialRegistry, materialId])
  
  return material
}

/**
 * 使用物料注册表（直接访问）
 */
export function useMaterialRegistryDirect(): IMaterialRegistry {
  return useMaterialRegistry()
}

