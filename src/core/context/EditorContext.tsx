/**
 * 编辑器上下文
 *
 * 提供编辑器的全局上下文和依赖注入（包含所有核心服务）
 */

import React, { createContext, useContext, ReactNode } from 'react'
import { IMaterialRegistry } from '../protocols/IMaterialProtocol'
import { IEventBus } from '../protocols/IEventProtocol'
import { IPluginManager } from '../protocols/IPluginProtocol'
import { CommandService } from '../services/CommandService'
import { HistoryService } from '../services/HistoryService'
import { NotificationService } from '../services/NotificationService'
import { ValidationService } from '../services/ValidationService'
import { ExtensionService } from '../services/ExtensionService'
import { HookService } from '../services/HookService'
import { MiddlewareService } from '../services/MiddlewareService'
import { ActionService } from '../services/ActionService'
import { ShortcutService } from '../services/ShortcutService'

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
  // 核心服务开关
  enableCommands?: boolean
  enableHistory?: boolean
  enableNotifications?: boolean
  enableValidation?: boolean
  enableExtensions?: boolean
  enableHooks?: boolean
  enableMiddleware?: boolean
  enableShortcuts?: boolean
}

/**
 * 编辑器上下文接口（包含所有核心服务）
 */
export interface IEditorContext {
  /** 物料注册表 */
  materialRegistry: IMaterialRegistry
  /** 事件总线 */
  eventBus: IEventBus
  /** 插件管理器 */
  pluginManager: IPluginManager
  /** 命令服务 */
  commandService: CommandService
  /** 历史服务 */
  historyService: HistoryService
  /** 通知服务 */
  notificationService: NotificationService
  /** 验证服务 */
  validationService: ValidationService
  /** 扩展服务 */
  extensionService: ExtensionService
  /** 钩子服务 */
  hookService: HookService
  /** 中间件服务 */
  middlewareService: MiddlewareService
  /** 行为服务 */
  actionService: ActionService
  /** 快捷键服务 */
  shortcutService: ShortcutService
  /** 编辑器配置 */
  config: IEditorConfig
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
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

/**
 * 使用编辑器上下文的Hook
 */
// eslint-disable-next-line react-refresh/only-export-components
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
// eslint-disable-next-line react-refresh/only-export-components
export function useMaterialRegistry(): IMaterialRegistry {
  const { materialRegistry } = useEditorContext()
  return materialRegistry
}

/**
 * 使用事件总线的Hook
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useEventBus(): IEventBus {
  const { eventBus } = useEditorContext()
  return eventBus
}

/**
 * 使用插件管理器的Hook
 */
// eslint-disable-next-line react-refresh/only-export-components
export function usePluginManager(): IPluginManager {
  const { pluginManager } = useEditorContext()
  return pluginManager
}

/**
 * 使用命令服务的Hook
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCommandService(): CommandService {
  const { commandService } = useEditorContext()
  return commandService
}

/**
 * 使用历史服务的Hook
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useHistoryService(): HistoryService {
  const { historyService } = useEditorContext()
  return historyService
}

/**
 * 使用通知服务的Hook
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useNotificationService(): NotificationService {
  const { notificationService } = useEditorContext()
  return notificationService
}

/**
 * 使用验证服务的Hook
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useValidationService(): ValidationService {
  const { validationService } = useEditorContext()
  return validationService
}

/**
 * 订阅编辑器事件的Hook
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useEditorEvent<T = unknown>(
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
    <T = any,>(event: string, data?: T) => {
      eventBus.emit(event, data)
    },
    [eventBus]
  )
}
