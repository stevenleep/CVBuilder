/**
 * 增量历史记录 - 正向/反向应用操作
 */

import {
  findNode,
  updateNodeProps,
  updateNodeStyle,
  appendChild,
  insertBefore,
  insertAfter,
  deleteNode,
} from '@utils/schema'
import { PageSchema, NodeSchema } from '../../types/material'
import type { HistoryAction } from './types'
import { HistoryActionType } from './types'

export function applyHistoryAction(schema: PageSchema, action: HistoryAction): PageSchema {
  switch (action.type) {
    case HistoryActionType.UPDATE_PROPS: {
      return {
        ...schema,
        root: updateNodeProps(schema.root, action.nodeId, action.newProps),
      }
    }
    case HistoryActionType.UPDATE_STYLE: {
      return {
        ...schema,
        root: updateNodeStyle(schema.root, action.nodeId, action.newStyle),
      }
    }
    case HistoryActionType.ADD_NODE: {
      const { parentId, node, position, targetId } = action
      let newRoot = schema.root
      if (position === 'before' && targetId) {
        newRoot = insertBefore(newRoot, targetId, node)
      } else if (position === 'after' && targetId) {
        newRoot = insertAfter(newRoot, targetId, node)
      } else {
        newRoot = appendChild(newRoot, parentId, node)
      }
      return { ...schema, root: newRoot }
    }
    case HistoryActionType.DELETE_NODE: {
      return {
        ...schema,
        root: deleteNode(schema.root, action.nodeId),
      }
    }
    case HistoryActionType.MOVE_NODE: {
      const { nodeId, newParentId, newIndex } = action
      const nodeToMove = findNode(schema.root, nodeId)
      if (!nodeToMove) return schema

      const newRoot = deleteNode(schema.root, nodeId)

      const newParent = findNode(newRoot, newParentId)
      if (!newParent || !newParent.children) return schema

      const updateParent = (node: NodeSchema): NodeSchema => {
        if (node.id === newParentId) {
          const newChildren = [...(node.children || [])]
          newChildren.splice(newIndex, 0, nodeToMove)
          return { ...node, children: newChildren }
        }
        if (node.children) {
          return { ...node, children: node.children.map(updateParent) }
        }
        return node
      }

      return { ...schema, root: updateParent(newRoot) }
    }
    case HistoryActionType.TOGGLE_VISIBILITY: {
      const node = findNode(schema.root, action.nodeId)
      if (node) {
        return {
          ...schema,
          root: updateNodeProps(schema.root, action.nodeId, {
            ...node.props,
            visible: action.newVisible,
          }),
        }
      }
      return schema
    }
    case HistoryActionType.BATCH_UPDATE: {
      return action.actions.reduce((acc, a) => applyHistoryAction(acc, a), schema)
    }
    case HistoryActionType.FULL_SNAPSHOT: {
      return action.snapshot
    }
    default:
      return schema
  }
}

export function unapplyHistoryAction(schema: PageSchema, action: HistoryAction): PageSchema {
  switch (action.type) {
    case HistoryActionType.UPDATE_PROPS: {
      return {
        ...schema,
        root: updateNodeProps(schema.root, action.nodeId, action.oldProps),
      }
    }
    case HistoryActionType.UPDATE_STYLE: {
      return {
        ...schema,
        root: updateNodeStyle(schema.root, action.nodeId, action.oldStyle),
      }
    }
    case HistoryActionType.ADD_NODE: {
      // 反向：删除节点
      return {
        ...schema,
        root: deleteNode(schema.root, action.node.id),
      }
    }
    case HistoryActionType.DELETE_NODE: {
      const parent = findNode(schema.root, action.parentId)
      if (parent && parent.children) {
        const newChildren = [...parent.children]
        newChildren.splice(action.index, 0, action.node) // 恢复到原位置

        // 直接更新父节点的children，而不是通过updateNodeProps
        const updateParent = (node: NodeSchema): NodeSchema => {
          if (node.id === action.parentId) {
            return { ...node, children: newChildren }
          }
          if (node.children) {
            return { ...node, children: node.children.map(updateParent) }
          }
          return node
        }

        return {
          ...schema,
          root: updateParent(schema.root),
        }
      }
      return schema
    }
    case HistoryActionType.MOVE_NODE: {
      // 反向移动：从新位置移回旧位置
      const { nodeId, oldParentId, oldIndex } = action
      const nodeToMove = findNode(schema.root, nodeId)
      if (!nodeToMove) return schema

      const newRoot = deleteNode(schema.root, nodeId)

      const oldParent = findNode(newRoot, oldParentId)
      if (!oldParent) return schema

      const updateParent = (node: NodeSchema): NodeSchema => {
        if (node.id === oldParentId) {
          const newChildren = [...(node.children || [])]
          newChildren.splice(oldIndex, 0, nodeToMove)
          return { ...node, children: newChildren }
        }
        if (node.children) {
          return { ...node, children: node.children.map(updateParent) }
        }
        return node
      }

      return { ...schema, root: updateParent(newRoot) }
    }
    case HistoryActionType.TOGGLE_VISIBILITY: {
      const node = findNode(schema.root, action.nodeId)
      if (node) {
        return {
          ...schema,
          root: updateNodeProps(schema.root, action.nodeId, {
            ...node.props,
            visible: action.oldVisible,
          }),
        }
      }
      return schema
    }
    case HistoryActionType.BATCH_UPDATE: {
      return action.actions.reduceRight((acc, a) => unapplyHistoryAction(acc, a), schema) // 逆序执行
    }
    case HistoryActionType.FULL_SNAPSHOT: {
      console.warn('[History] Cannot unapply FULL_SNAPSHOT action')
      return schema
    }
    default:
      return schema
  }
}
