/**
 * Schema工具函数
 *
 * 提供节点查找、添加、删除、更新等操作
 */

import { nanoid } from 'nanoid'
import type { NodeSchema, NodeId, MaterialType, PropValue } from '../types/material'
import { getMaterialRegistry } from '@/core/globals'

/**
 * 创建新节点
 */
export function createNode(
  materialType: MaterialType,
  props?: Record<string, PropValue>
): NodeSchema {
  const materialRegistry = getMaterialRegistry()
  const materialDef = materialRegistry.get(materialType)

  if (!materialDef) {
    throw new Error(`物料类型 "${materialType}" 未注册`)
  }

  const { meta } = materialDef

  return {
    id: nanoid(),
    type: materialType,
    props: {
      ...meta.defaultProps,
      ...materialDef.defaultProps,
      ...props,
    },
    style: {
      ...meta.defaultStyle,
      ...materialDef.defaultStyle,
    },
    children: [],
  }
}

/**
 * 在节点树中查找节点
 */
export function findNode(root: NodeSchema, nodeId: NodeId): NodeSchema | null {
  if (root.id === nodeId) {
    return root
  }

  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, nodeId)
      if (found) return found
    }
  }

  return null
}

/**
 * 查找节点的父节点
 */
export function findParentNode(root: NodeSchema, nodeId: NodeId): NodeSchema | null {
  if (!root.children) return null

  for (const child of root.children) {
    if (child.id === nodeId) {
      return root
    }
    const found = findParentNode(child, nodeId)
    if (found) return found
  }

  return null
}

/**
 * 获取节点路径（从根节点到目标节点的ID数组）
 */
export function getNodePath(root: NodeSchema, nodeId: NodeId): NodeId[] {
  if (root.id === nodeId) {
    return [root.id]
  }

  if (root.children) {
    for (const child of root.children) {
      const path = getNodePath(child, nodeId)
      if (path.length > 0) {
        return [root.id, ...path]
      }
    }
  }

  return []
}

/**
 * 添加子节点
 */
export function appendChild(root: NodeSchema, parentId: NodeId, childNode: NodeSchema): NodeSchema {
  if (root.id === parentId) {
    return {
      ...root,
      children: [...(root.children || []), { ...childNode, parentId }],
    }
  }

  if (root.children) {
    return {
      ...root,
      children: root.children.map(child => appendChild(child, parentId, childNode)),
    }
  }

  return root
}

/**
 * 在指定节点前插入节点
 */
export function insertBefore(root: NodeSchema, targetId: NodeId, newNode: NodeSchema): NodeSchema {
  if (root.children) {
    const index = root.children.findIndex(child => child.id === targetId)
    if (index !== -1) {
      const newChildren = [...root.children]
      newChildren.splice(index, 0, { ...newNode, parentId: root.id })
      return { ...root, children: newChildren }
    }

    return {
      ...root,
      children: root.children.map(child => insertBefore(child, targetId, newNode)),
    }
  }

  return root
}

/**
 * 在指定节点后插入节点
 */
export function insertAfter(root: NodeSchema, targetId: NodeId, newNode: NodeSchema): NodeSchema {
  if (root.children) {
    const index = root.children.findIndex(child => child.id === targetId)
    if (index !== -1) {
      const newChildren = [...root.children]
      newChildren.splice(index + 1, 0, { ...newNode, parentId: root.id })
      return { ...root, children: newChildren }
    }

    return {
      ...root,
      children: root.children.map(child => insertAfter(child, targetId, newNode)),
    }
  }

  return root
}

/**
 * 删除节点
 */
export function deleteNode(root: NodeSchema, nodeId: NodeId): NodeSchema {
  if (root.children) {
    const filteredChildren = root.children
      .filter(child => child.id !== nodeId)
      .map(child => deleteNode(child, nodeId))

    return { ...root, children: filteredChildren }
  }

  return root
}

/**
 * 更新节点属性
 */
export function updateNodeProps(
  root: NodeSchema,
  nodeId: NodeId,
  props: Record<string, PropValue>
): NodeSchema {
  if (root.id === nodeId) {
    return {
      ...root,
      props: { ...root.props, ...props },
    }
  }

  if (root.children) {
    return {
      ...root,
      children: root.children.map(child => updateNodeProps(child, nodeId, props)),
    }
  }

  return root
}

/**
 * 更新节点样式
 */
export function updateNodeStyle(
  root: NodeSchema,
  nodeId: NodeId,
  style: React.CSSProperties
): NodeSchema {
  if (root.id === nodeId) {
    return {
      ...root,
      style: { ...root.style, ...style },
    }
  }

  if (root.children) {
    return {
      ...root,
      children: root.children.map(child => updateNodeStyle(child, nodeId, style)),
    }
  }

  return root
}

/**
 * 克隆节点（深拷贝，生成新的ID）
 */
export function cloneNode(node: NodeSchema): NodeSchema {
  return {
    ...node,
    id: nanoid(),
    children: node.children?.map(child => cloneNode(child)),
  }
}

/**
 * 移动节点
 */
export function moveNode(
  root: NodeSchema,
  nodeId: NodeId,
  targetParentId: NodeId,
  position: number
): NodeSchema {
  // 先找到要移动的节点
  const nodeToMove = findNode(root, nodeId)
  if (!nodeToMove) return root

  // 从原位置删除
  let newRoot = deleteNode(root, nodeId)

  // 插入到新位置
  const targetParent = findNode(newRoot, targetParentId)
  if (!targetParent) return root

  const clonedNode = { ...nodeToMove, parentId: targetParentId }

  if (targetParent.id === targetParentId) {
    const updateParent = (node: NodeSchema): NodeSchema => {
      if (node.id === targetParentId) {
        const newChildren = [...(node.children || [])]
        newChildren.splice(position, 0, clonedNode)
        return { ...node, children: newChildren }
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateParent) }
      }
      return node
    }
    newRoot = updateParent(newRoot)
  }

  return newRoot
}
