/**
 * Action行为协议
 * 
 * 定义物料的交互行为能力
 */

import { IMaterialContext } from './IMaterialProtocol'

/**
 * Action类型
 */
export type ActionType = 'click' | 'doubleClick' | 'contextMenu' | 'hover' | 'custom'

/**
 * Action定义
 */
export interface IAction {
  /** Action唯一标识 */
  id: string
  /** Action显示名称 */
  label: string
  /** Action图标 */
  icon?: string
  /** Action类型 */
  type: ActionType
  /** 执行函数 */
  execute: (context: IActionContext) => void | Promise<void>
  /** 是否可用 */
  enabled?: (context: IActionContext) => boolean
  /** 是否显示 */
  visible?: (context: IActionContext) => boolean
  /** 快捷键 */
  shortcut?: string
}

/**
 * Action上下文
 */
export interface IActionContext {
  /** 物料上下文 */
  materialContext: IMaterialContext
  /** 事件对象 */
  event?: React.MouseEvent | React.KeyboardEvent | any
  /** 额外数据 */
  data?: any
}

/**
 * Action菜单项
 */
export interface IActionMenuItem {
  /** Action ID */
  actionId: string
  /** 分组 */
  group?: string
  /** 分隔符 */
  divider?: boolean
}

/**
 * 物料Actions配置
 */
export interface IMaterialActions {
  /** 可用的Actions列表 */
  actions?: IAction[]
  /** 默认双击行为 */
  onDoubleClick?: (context: IActionContext) => void
  /** 右键菜单 */
  contextMenuItems?: IActionMenuItem[]
}

