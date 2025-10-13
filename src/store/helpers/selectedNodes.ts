/**
 * 选中状态同步 - 避免immutable更新后的陈旧引用Bug
 *
 * 问题：immutable更新创建新对象，但selectedNodes持有旧引用
 * 导致：属性面板读取旧对象看不到更新
 * 解决：每次更新后同步刷新选中节点引用
 */

import type { NodeId } from '../../types/material'
import type { EditorState } from '../editorStore'

export function syncSelectedNodeRefs(state: EditorState, nodeId: NodeId): void {
  if (state.selectedNodes.has(nodeId)) {
    const updatedNode = state.nodeMap.get(nodeId)
    if (updatedNode) {
      state.selectedNodes.set(nodeId, updatedNode)
    }
  }

  if (state.lastSelectedNode?.id === nodeId) {
    const updatedNode = state.nodeMap.get(nodeId)
    if (updatedNode) {
      state.lastSelectedNode = updatedNode
    }
  }
}
