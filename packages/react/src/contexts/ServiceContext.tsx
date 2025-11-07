/**
 * 服务上下文
 * 
 * 提供核心服务访问的 React Context
 */

import React, { createContext, useContext } from 'react'
import type {
  CoreServices,
  IEventBus,
  IStateManager,
  IHistoryService,
  IPluginManager,
  ICommandRegistry,
  IMaterialRegistry,
  IRendererRegistry,
} from '@lcedit/core'

// ==================== 类型定义 ====================

/**
 * 核心服务集合（从 @lcedit/core 导入）
 */
export type { CoreServices } from '@lcedit/core'

// ==================== Context ====================

const ServiceContext = createContext<CoreServices | null>(null)

// ==================== Provider ====================

export interface ServiceProviderProps {
  services: CoreServices
  children: React.ReactNode
}

export function ServiceProvider({ services, children }: ServiceProviderProps) {
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  )
}

// ==================== Hooks ====================

/**
 * 使用服务上下文
 */
export function useServices(): CoreServices {
  const context = useContext(ServiceContext)
  
  if (!context) {
    throw new Error('useServices must be used within ServiceProvider')
  }
  
  return context
}

/**
 * 使用事件总线
 */
export function useEventBus(): IEventBus {
  return useServices().eventBus
}

/**
 * 使用状态管理器
 */
export function useStateManager(): IStateManager {
  return useServices().stateManager
}

/**
 * 使用历史服务
 */
export function useHistoryService(): IHistoryService {
  return useServices().historyService
}

/**
 * 使用插件管理器
 */
export function usePluginManager(): IPluginManager {
  return useServices().pluginManager
}

/**
 * 使用命令服务
 */
export function useCommandService(): ICommandRegistry {
  return useServices().commandService
}

/**
 * 使用物料注册表
 */
export function useMaterialRegistry(): IMaterialRegistry {
  return useServices().materialRegistry
}

/**
 * 使用渲染器注册表
 */
export function useRendererRegistry(): IRendererRegistry {
  return useServices().rendererRegistry
}

