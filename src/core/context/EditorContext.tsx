/**
 * 编辑器上下文
 * 
 * 提供编辑器的全局上下文和依赖注入
 */

import React, { createContext, useContext, ReactNode } from 'react'
import { IMaterialRegistry } from '../protocols/IMaterialProtocol'
import { IEventBus } from '../protocols/IEventProtocol'
import { IPluginManager } from '../protocols/IPluginProtocol'

/**
 * 编辑器上下文接口
 */
export interface IEditorContext {
  /** 物料注册表 */
  materialRegistry: IMaterialRegistry
  /** 事件总线 */
  eventBus: IEventBus
  /** 插件管理器 */
  pluginManager: IPluginManager
  /** 编辑器配置 */
  config: IEditorConfig
}

/**
 * 编辑器配置
 */
export interface IEditorConfig {
  /** 是否开启调试模式 */
  debug?: boolean
  /** 自动保存间隔（毫秒） */
  autoSaveInterval?: number
  /** 历史记录最大条数 */
  maxHistorySize?: number
  /** 是否启用插件系统 */
  enablePlugins?: boolean
}

const EditorContext = createContext<IEditorContext | null>(null)

/**
 * 编辑器上下文Provider
 */
export interface EditorProviderProps {
  children: ReactNode
  value: IEditorContext
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children, value }) => {
  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  )
}

/**
 * 使用编辑器上下文的Hook
 */
export function useEditorContext(): IEditorContext {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider')
  }
  return context
}

/**
 * 使用物料注册表的Hook
 */
export function useMaterialRegistry(): IMaterialRegistry {
  const { materialRegistry } = useEditorContext()
  return materialRegistry
}

/**
 * 使用事件总线的Hook
 */
export function useEventBus(): IEventBus {
  const { eventBus } = useEditorContext()
  return eventBus
}

/**
 * 使用插件管理器的Hook
 */
export function usePluginManager(): IPluginManager {
  const { pluginManager } = useEditorContext()
  return pluginManager
}

/**
 * 订阅编辑器事件的Hook
 */
export function useEditorEvent<T = any>(
  event: string,
  handler: (data: T) => void,
  deps: React.DependencyList = []
): void {
  const eventBus = useEventBus()

  React.useEffect(() => {
    const subscription = eventBus.on(event, handler)
    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventBus, event, ...deps])
}

/**
 * 发送编辑器事件的Hook
 */
export function useEmitEvent() {
  const eventBus = useEventBus()
  return React.useCallback(
    <T = any>(event: string, data?: T) => {
      eventBus.emit(event, data)
    },
    [eventBus]
  )
}

