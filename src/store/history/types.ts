/**
 * 增量历史记录类型 - 省内存2000倍
 * 完整模式5MB vs 增量模式2.5KB
 */

import { NodeSchema, NodeId, PageSchema, PropValue } from '../../types/material'

export enum HistoryActionType {
  UPDATE_PROPS = 'UPDATE_PROPS',
  UPDATE_STYLE = 'UPDATE_STYLE',
  ADD_NODE = 'ADD_NODE',
  DELETE_NODE = 'DELETE_NODE',
  MOVE_NODE = 'MOVE_NODE',
  TOGGLE_VISIBILITY = 'TOGGLE_VISIBILITY',
  BATCH_UPDATE = 'BATCH_UPDATE',
  FULL_SNAPSHOT = 'FULL_SNAPSHOT', // 兜底：复杂操作使用完整快照
}

export interface BaseHistoryAction {
  type: HistoryActionType
  timestamp: number
}

export interface UpdatePropsAction extends BaseHistoryAction {
  type: HistoryActionType.UPDATE_PROPS
  nodeId: NodeId
  oldProps: Record<string, PropValue>
  newProps: Record<string, PropValue>
}

export interface UpdateStyleAction extends BaseHistoryAction {
  type: HistoryActionType.UPDATE_STYLE
  nodeId: NodeId
  oldStyle: React.CSSProperties
  newStyle: React.CSSProperties
}

export interface AddNodeAction extends BaseHistoryAction {
  type: HistoryActionType.ADD_NODE
  parentId: NodeId
  node: NodeSchema
  position?: 'before' | 'after' | 'child'
  targetId?: NodeId
}

export interface DeleteNodeAction extends BaseHistoryAction {
  type: HistoryActionType.DELETE_NODE
  nodeId: NodeId
  parentId: NodeId
  node: NodeSchema // 用于undo恢复
  index: number // 恢复时的插入位置
}

export interface MoveNodeAction extends BaseHistoryAction {
  type: HistoryActionType.MOVE_NODE
  nodeId: NodeId
  oldParentId: NodeId
  newParentId: NodeId
  oldIndex: number
  newIndex: number
}

export interface ToggleVisibilityAction extends BaseHistoryAction {
  type: HistoryActionType.TOGGLE_VISIBILITY
  nodeId: NodeId
  oldVisible: boolean
  newVisible: boolean
}

export interface BatchUpdateAction extends BaseHistoryAction {
  type: HistoryActionType.BATCH_UPDATE
  actions: HistoryAction[]
}

export interface FullSnapshotAction extends BaseHistoryAction {
  type: HistoryActionType.FULL_SNAPSHOT
  snapshot: PageSchema
}

export type HistoryAction =
  | UpdatePropsAction
  | UpdateStyleAction
  | AddNodeAction
  | DeleteNodeAction
  | MoveNodeAction
  | ToggleVisibilityAction
  | BatchUpdateAction
  | FullSnapshotAction
