/**
 * 插件协议接口
 *
 * 定义插件系统的完整协议，支持编辑器功能扩展
 */

import { IMaterialDefinition } from './IMaterialProtocol'
import { ICommand } from './ICommandProtocol'

/**
 * 插件元数据
 */
export interface IPluginMeta {
  /** 插件ID */
  id: string
  /** 插件名称 */
  name: string
  /** 插件版本 */
  version: string
  /** 插件描述 */
  description?: string
  /** 作者 */
  author?: string
  /** 依赖的其他插件 */
  dependencies?: string[]
}

/**
 * 插件上下文
 */
export interface IPluginContext {
  /** 注册物料 */
  registerMaterial: (material: IMaterialDefinition) => void
  /** 注册命令 */
  registerCommand: (command: ICommand) => void
  /** 注册快捷键 */
  registerShortcut: (shortcut: IShortcut) => void
  /** 注册面板 */
  registerPanel: (panel: IPanel) => void
  /** 注册中间件 */
  registerMiddleware: (middleware: IMiddleware) => void
  /** 订阅事件 */
  on: (event: string, handler: (data: any) => void) => () => void
  /** 发送事件 */
  emit: (event: string, data?: any) => void
  /** 获取编辑器状态 */
  getState: () => any
  /** 更新编辑器状态 */
  setState: (updater: (state: any) => void) => void
}

/**
 * 插件定义
 */
export interface IPlugin {
  /** 元数据 */
  meta: IPluginMeta
  /** 激活插件 */
  activate: (context: IPluginContext) => void | Promise<void>
  /** 停用插件 */
  deactivate?: () => void | Promise<void>
}

// 命令相关类型从 ICommandProtocol 导出
export type { ICommand } from './ICommandProtocol'

/**
 * 快捷键接口
 */
export interface IShortcut {
  /** 快捷键组合 */
  key: string
  /** 关联的命令ID */
  commandId: string
  /** 描述 */
  description?: string
  /** 是否全局 */
  global?: boolean
}

/**
 * 面板接口
 */
export interface IPanel {
  /** 面板ID */
  id: string
  /** 面板标题 */
  title: string
  /** 面板位置 */
  position: 'left' | 'right' | 'bottom' | 'float'
  /** 面板组件 */
  component: React.ComponentType<any>
  /** 默认是否打开 */
  defaultOpen?: boolean
  /** 图标 */
  icon?: string
}

/**
 * 中间件接口
 */
export interface IMiddleware {
  /** 中间件名称 */
  name: string
  /** 处理函数 */
  handle: (context: IMiddlewareContext, next: () => void) => void
}

/**
 * 中间件上下文
 */
export interface IMiddlewareContext {
  /** 操作类型 */
  action: string
  /** 操作数据 */
  payload: any
  /** 当前状态 */
  state: any
  /** 是否取消操作 */
  cancel?: boolean
}

/**
 * 插件管理器接口
 */
export interface IPluginManager {
  /** 注册插件 */
  register(plugin: IPlugin): void
  /** 激活插件 */
  activate(pluginId: string): Promise<void>
  /** 停用插件 */
  deactivate(pluginId: string): Promise<void>
  /** 获取所有插件 */
  getAll(): IPlugin[]
  /** 获取已激活插件 */
  getActive(): IPlugin[]
  /** 检查插件是否激活 */
  isActive(pluginId: string): boolean
}
