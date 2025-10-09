/**
 * 编辑器相关类型定义
 */

import { NodeId, NodeSchema } from './material'

/**
 * 编辑模式
 */
export type EditorMode = 'edit' | 'preview'

/**
 * 拖拽类型
 */
export type DragType = 'material' | 'node'

/**
 * 拖拽数据
 */
export interface DragData {
  type: DragType
  /** 物料类型（当type为material时） */
  materialType?: string
  /** 节点ID（当type为node时） */
  nodeId?: NodeId
}

/**
 * 放置位置
 */
export type DropPosition = 'before' | 'after' | 'inside'

/**
 * 放置目标
 */
export interface DropTarget {
  targetId: NodeId
  position: DropPosition
}

/**
 * 操作历史记录项
 */
export interface HistoryItem {
  /** 操作类型 */
  type: 'add' | 'delete' | 'update' | 'move'
  /** 操作时间戳 */
  timestamp: number
  /** 操作描述 */
  description: string
  /** 前置状态 */
  beforeState: NodeSchema
  /** 后置状态 */
  afterState: NodeSchema
}

/**
 * 选中状态
 */
export interface SelectionState {
  /** 选中的节点ID列表 */
  selectedIds: NodeId[]
  /** 悬停的节点ID */
  hoveredId?: NodeId
}

/**
 * 画布配置
 */
export interface CanvasConfig {
  /** 缩放比例 */
  scale: number
  /** 是否显示网格 */
  showGrid: boolean
  /** 是否显示标尺 */
  showRuler: boolean
  /** 画布背景色 */
  backgroundColor?: string
}

