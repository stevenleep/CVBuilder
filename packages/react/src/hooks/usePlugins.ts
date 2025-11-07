/**
 * 插件管理 Hook
 * 
 * 提供插件注册、激活和管理功能
 */

import { useState, useEffect, useCallback } from 'react'
import { usePluginManager } from '../contexts/ServiceContext'
import type { PluginInstance, PluginState, IPluginManager } from '@lcedit/core'

// ==================== 类型定义 ====================

export interface UsePluginsResult {
  plugins: readonly PluginInstance[]
  activePlugins: readonly PluginInstance[]
  loading: boolean
  getPlugin: (pluginId: string) => PluginInstance | undefined
  getPluginState: (pluginId: string) => PluginState | undefined
  activate: (pluginId: string) => Promise<void>
  deactivate: (pluginId: string) => Promise<void>
  activateAll: () => Promise<void>
  deactivateAll: () => Promise<void>
  refresh: () => void
}

export interface UsePluginsOptions {
  autoRefresh?: boolean
}

// ==================== Hook ====================

/**
 * 使用插件
 */
export function usePlugins(options?: UsePluginsOptions): UsePluginsResult {
  const pluginManager = usePluginManager()
  const { autoRefresh = true } = options || {}
  
  const [plugins, setPlugins] = useState<readonly PluginInstance[]>(() => 
    pluginManager.getAll()
  )
  
  const [activePlugins, setActivePlugins] = useState<readonly PluginInstance[]>(() => 
    pluginManager.getActive()
  )
  
  const [loading, setLoading] = useState(false)
  
  // 刷新插件列表
  const refresh = useCallback(() => {
    setPlugins(pluginManager.getAll())
    setActivePlugins(pluginManager.getActive())
  }, [pluginManager])
  
  // 自动刷新
  useEffect(() => {
    if (!autoRefresh) return
    
    refresh()
  }, [refresh, autoRefresh])
  
  // 获取插件
  const getPlugin = useCallback((pluginId: string) => {
    return pluginManager.get(pluginId)
  }, [pluginManager])
  
  // 获取插件状态
  const getPluginState = useCallback((pluginId: string) => {
    return pluginManager.getState(pluginId)
  }, [pluginManager])
  
  // 激活插件
  const activate = useCallback(async (pluginId: string) => {
    setLoading(true)
    
    try {
      await pluginManager.activate(pluginId)
      refresh()
    } finally {
      setLoading(false)
    }
  }, [pluginManager, refresh])
  
  // 停用插件
  const deactivate = useCallback(async (pluginId: string) => {
    setLoading(true)
    
    try {
      await pluginManager.deactivate(pluginId)
      refresh()
    } finally {
      setLoading(false)
    }
  }, [pluginManager, refresh])
  
  // 激活所有插件
  const activateAll = useCallback(async () => {
    setLoading(true)
    
    try {
      await pluginManager.activateAll()
      refresh()
    } finally {
      setLoading(false)
    }
  }, [pluginManager, refresh])
  
  // 停用所有插件
  const deactivateAll = useCallback(async () => {
    setLoading(true)
    
    try {
      await pluginManager.deactivateAll()
      refresh()
    } finally {
      setLoading(false)
    }
  }, [pluginManager, refresh])
  
  return {
    plugins,
    activePlugins,
    loading,
    getPlugin,
    getPluginState,
    activate,
    deactivate,
    activateAll,
    deactivateAll,
    refresh,
  }
}

/**
 * 使用单个插件
 */
export function usePlugin(pluginId: string) {
  const pluginManager = usePluginManager()
  const [plugin, setPlugin] = useState<PluginInstance | undefined>(() => 
    pluginManager.get(pluginId)
  )
  const [state, setState] = useState<PluginState | undefined>(() => 
    pluginManager.getState(pluginId)
  )
  const [loading, setLoading] = useState(false)
  
  // 刷新插件
  const refresh = useCallback(() => {
    setPlugin(pluginManager.get(pluginId))
    setState(pluginManager.getState(pluginId))
  }, [pluginManager, pluginId])
  
  // 激活
  const activate = useCallback(async () => {
    setLoading(true)
    
    try {
      await pluginManager.activate(pluginId)
      refresh()
    } finally {
      setLoading(false)
    }
  }, [pluginManager, pluginId, refresh])
  
  // 停用
  const deactivate = useCallback(async () => {
    setLoading(true)
    
    try {
      await pluginManager.deactivate(pluginId)
      refresh()
    } finally {
      setLoading(false)
    }
  }, [pluginManager, pluginId, refresh])
  
  return {
    plugin,
    state,
    loading,
    activate,
    deactivate,
    refresh,
  }
}

/**
 * 使用插件管理器（直接访问）
 */
export function usePluginManagerDirect(): IPluginManager {
  return usePluginManager()
}

