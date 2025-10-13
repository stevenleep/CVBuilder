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
import { PageSchema } from '../../types/material'
import type { HistoryAction } from './types'

export function applyHistoryAction(schema: PageSchema, action: HistoryAction): PageSchema {
  switch (action.type) {
    case 'UPDATE_PROPS': {
      return {
        ...schema,
        root: updateNodeProps(schema.root, action.nodeId, action.newProps),
      }
    }
    case 'UPDATE_STYLE': {
      return {
        ...schema,
        root: updateNodeStyle(schema.root, action.nodeId, action.newStyle),
      }
    }
    case 'ADD_NODE': {
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
    case 'DELETE_NODE': {
      return {
        ...schema,
        root: deleteNode(schema.root, action.nodeId),
      }
    }
    case 'TOGGLE_VISIBILITY': {
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
    case 'BATCH_UPDATE': {
      return action.actions.reduce((acc, a) => applyHistoryAction(acc, a), schema)
    }
    case 'FULL_SNAPSHOT': {
      return action.snapshot
    }
    default:
      return schema
  }
}

export function unapplyHistoryAction(schema: PageSchema, action: HistoryAction): PageSchema {
  switch (action.type) {
    case 'UPDATE_PROPS': {
      return {
        ...schema,
        root: updateNodeProps(schema.root, action.nodeId, action.oldProps),
      }
    }
    case 'UPDATE_STYLE': {
      return {
        ...schema,
        root: updateNodeStyle(schema.root, action.nodeId, action.oldStyle),
      }
    }
    case 'ADD_NODE': {
      // 反向：删除节点
      return {
        ...schema,
        root: deleteNode(schema.root, action.node.id),
      }
    }
    case 'DELETE_NODE': {
      const parent = findNode(schema.root, action.parentId)
      if (parent && parent.children) {
        const newChildren = [...parent.children]
        newChildren.splice(action.index, 0, action.node) // 恢复到原位置
        return {
          ...schema,
          root: updateNodeProps(schema.root, action.parentId, {
            ...parent.props,
            children: newChildren,
          }),
        }
      }
      return schema
    }
    case 'TOGGLE_VISIBILITY': {
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
    case 'BATCH_UPDATE': {
      return action.actions.reduceRight((acc, a) => unapplyHistoryAction(acc, a), schema) // 逆序执行
    }
    case 'FULL_SNAPSHOT': {
      console.warn('[History] Cannot unapply FULL_SNAPSHOT action')
      return schema
    }
    default:
      return schema
  }
}
