/**
 * 编辑器状态管理 - 主Store
 *
 * 性能优化：nodeMap缓存O(1)查找、增量更新、历史防抖、structuredClone
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from 'immer'
import { NodeSchema, NodeId, PageSchema, PropValue } from '../types/material'
import { EditorMode, CanvasConfig } from '../types/editor'
import {
  createNode,
  findNode,
  findParentNode,
  appendChild,
  deleteNode,
  updateNodeProps,
  updateNodeStyle,
  insertBefore,
  insertAfter,
  cloneNode,
} from '@utils/schema'
import { indexedDBService, STORES } from '@utils/indexedDB'

import {
  type HistoryAction,
  type UpdatePropsAction,
  type UpdateStyleAction,
  type AddNodeAction,
  type DeleteNodeAction,
  type ToggleVisibilityAction,
  type MoveNodeAction,
  HistoryActionType,
  applyHistoryAction,
  unapplyHistoryAction,
  addHistory,
  ENABLE_INCREMENTAL_HISTORY,
} from './history'
import { getPerformanceStats, resetPerformanceStats } from './performance'
import { buildNodeMap, updateNodeMapIncremental } from './helpers/nodeMap'
import { syncSelectedNodeRefs } from './helpers/selectedNodes'
import { createDefaultPageSchema, safeDeepClone } from './helpers/utils'

enableMapSet() // Immer支持Map/Set

const STORAGE_KEY = 'resume-builder-state'

export { getPerformanceStats, resetPerformanceStats }

export interface PreviewExampleInfo {
  id: string
  name: string
  description: string
  onEditDirectly?: () => void
  onCreateCopy?: () => void
}

export interface EditorState {
  pageSchema: PageSchema
  nodeMap: Map<NodeId, NodeSchema> // O(1)查找优化
  currentResumeId: string | null

  // 选中状态（存储引用避免重复查找）
  selectedNodeIds: NodeId[]
  selectedNodes: Map<NodeId, NodeSchema>
  lastSelectedNode: NodeSchema | null // 属性面板焦点节点
  hoveredNodeId: NodeId | null

  mode: EditorMode
  canvasConfig: CanvasConfig

  // 预览示例信息（用于示例预览页面）
  previewExampleInfo: PreviewExampleInfo | null

  // 历史记录双模式：完整快照（兼容）+ 增量操作（省内存2000倍）
  history: PageSchema[]
  historyActions: HistoryAction[]
  historyIndex: number
  maxHistoryIndex: number // 指向最后一个有效操作的位置
  baseSnapshot: PageSchema | null

  clipboard: NodeSchema | null

  setPageSchema: (schema: PageSchema) => void
  setCurrentResumeId: (id: string | null) => void
  setPreviewExampleInfo: (info: PreviewExampleInfo | null) => void

  getNode: (nodeId: NodeId) => NodeSchema | null
  getSelectedNode: (nodeId: NodeId) => NodeSchema | null
  getLastSelectedNode: () => NodeSchema | null
  isNodeSelected: (nodeId: NodeId) => boolean

  addNode: (materialType: string, parentId?: NodeId) => void
  addNodeFromSchema: (schema: NodeSchema, parentId?: NodeId) => void
  addNodeBefore: (materialType: string, targetId: NodeId) => void
  addNodeAfter: (materialType: string, targetId: NodeId) => void
  deleteNode: (nodeId: NodeId) => void
  duplicateNode: (nodeId: NodeId) => void
  updateNodeProps: (nodeId: NodeId, props: Record<string, PropValue>) => void
  updateNodeStyle: (nodeId: NodeId, style: React.CSSProperties) => void
  toggleNodeVisibility: (nodeId: NodeId) => void
  moveNodeUp: (nodeId: NodeId) => void
  moveNodeDown: (nodeId: NodeId) => void
  moveNodeTo: (nodeId: NodeId, targetId: NodeId, position: 'before' | 'after' | 'inside') => void

  selectNode: (nodeId: NodeId, multiSelect?: boolean) => void
  selectNodeDirect: (node: NodeSchema, multiSelect?: boolean) => void // 避免查找，直接传节点
  selectNodes: (nodeIds: NodeId[]) => void
  selectNodesDirect: (nodes: NodeSchema[]) => void
  selectAll: () => void
  clearSelection: () => void
  setHoveredNode: (nodeId: NodeId | null) => void

  copyNode: (nodeId: NodeId) => void
  cutNode: (nodeId: NodeId) => void
  pasteNode: (targetId?: NodeId) => void
  pasteMultiNodes: () => void
  copyNodes: (nodeIds: NodeId[]) => void
  deleteNodes: (nodeIds: NodeId[]) => void
  duplicateNodes: (nodeIds: NodeId[]) => void

  setMode: (mode: EditorMode) => void
  updateCanvasConfig: (config: Partial<CanvasConfig>) => void

  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  saveToStorage: () => Promise<void>
  loadFromStorage: () => Promise<void>
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => {
    const defaultSchema = createDefaultPageSchema()
    // 简单校验：确保 PageSchema 结构看起来有效
    const isValidPageSchema = (s: unknown): s is PageSchema => {
      if (!s || typeof s !== 'object') return false
      const v = s as Record<string, unknown>
      try {
        const root = v.root as Record<string, unknown> | undefined
        return (
          !!root &&
          typeof root === 'object' &&
          typeof root.id === 'string' &&
          Array.isArray(root.children)
        )
      } catch (err) {
        return false
      }
    }
    return {
      pageSchema: defaultSchema,
      nodeMap: buildNodeMap(defaultSchema.root),
      currentResumeId: null,
      selectedNodeIds: [],
      selectedNodes: new Map(),
      lastSelectedNode: null,
      hoveredNodeId: null,
      mode: 'edit',
      canvasConfig: {
        scale: 1,
        showGrid: false,
        showRuler: false,
        backgroundColor: '#fafafa',
      },
      previewExampleInfo: null,
      history: [],
      historyActions: [],
      historyIndex: -1,
      maxHistoryIndex: -1, // 指向最后一个有效操作的位置
      baseSnapshot: null,
      clipboard: null,

      getNode: nodeId => get().nodeMap.get(nodeId) || null,
      getSelectedNode: nodeId => get().selectedNodes.get(nodeId) || null,
      getLastSelectedNode: () => get().lastSelectedNode,
      isNodeSelected: nodeId => get().selectedNodes.has(nodeId),

      setPageSchema: schema => {
        set(state => {
          state.pageSchema = schema
          state.nodeMap = buildNodeMap(schema.root)
          // 清空历史记录，避免混乱
          state.history = []
          state.historyActions = []
          state.historyIndex = -1
          state.baseSnapshot = null
        })
        addHistory(set, true)
      },

      setCurrentResumeId: id => {
        set(state => {
          state.currentResumeId = id
        })
      },

      setPreviewExampleInfo: info => {
        set(state => {
          state.previewExampleInfo = info
        })
      },

      addNode: (materialType, parentId) => {
        const newNode = createNode(materialType)
        const targetParentId = parentId || get().pageSchema.root.id

        set(state => {
          state.pageSchema.root = appendChild(state.pageSchema.root, targetParentId, newNode)
          // 重新构建 nodeMap - 关键修复！
          state.nodeMap = buildNodeMap(state.pageSchema.root)
          // 同步更新三个选中状态
          state.selectedNodeIds = [newNode.id]
          state.selectedNodes = new Map([[newNode.id, newNode]])
          state.lastSelectedNode = newNode
        })

        // 记录增量历史
        if (ENABLE_INCREMENTAL_HISTORY) {
          const action: AddNodeAction = {
            type: HistoryActionType.ADD_NODE,
            parentId: targetParentId,
            node: newNode,
            position: 'child',
            timestamp: Date.now(),
          }
          addHistory(set, true, action)
        } else {
          addHistory(set, true)
        }
      },

      addNodeFromSchema: (schema, parentId) => {
        const newNode = cloneNode(schema)
        const targetParentId = parentId || get().pageSchema.root.id

        set(state => {
          state.pageSchema.root = appendChild(state.pageSchema.root, targetParentId, newNode)
          state.selectedNodeIds = [newNode.id]
          state.selectedNodes = new Map([[newNode.id, newNode]])
          state.lastSelectedNode = newNode
        })

        if (ENABLE_INCREMENTAL_HISTORY) {
          const action: AddNodeAction = {
            type: HistoryActionType.ADD_NODE,
            parentId: targetParentId,
            node: newNode,
            position: 'child',
            timestamp: Date.now(),
          }
          addHistory(set, true, action)
        } else {
          addHistory(set, true)
        }
      },
      addNodeBefore: (materialType, targetId) => {
        const newNode = createNode(materialType)
        const state = get()
        const parentNode = findParentNode(state.pageSchema.root, targetId)

        set(state => {
          state.pageSchema.root = insertBefore(state.pageSchema.root, targetId, newNode)
          // 同步更新三个选中状态
          state.selectedNodeIds = [newNode.id]
          state.selectedNodes = new Map([[newNode.id, newNode]])
          state.lastSelectedNode = newNode
        })

        // 记录增量历史
        if (ENABLE_INCREMENTAL_HISTORY && parentNode) {
          const action: AddNodeAction = {
            type: HistoryActionType.ADD_NODE,
            parentId: parentNode.id,
            node: newNode,
            position: 'before',
            targetId,
            timestamp: Date.now(),
          }
          addHistory(set, true, action)
        } else {
          addHistory(set, true)
        }
      },

      // 在指定节点后添加
      addNodeAfter: (materialType, targetId) => {
        const newNode = createNode(materialType)
        const state = get()
        const parentNode = findParentNode(state.pageSchema.root, targetId)

        set(state => {
          state.pageSchema.root = insertAfter(state.pageSchema.root, targetId, newNode)
          // 同步更新三个选中状态
          state.selectedNodeIds = [newNode.id]
          state.selectedNodes = new Map([[newNode.id, newNode]])
          state.lastSelectedNode = newNode
        })

        // 记录增量历史
        if (ENABLE_INCREMENTAL_HISTORY && parentNode) {
          const action: AddNodeAction = {
            type: HistoryActionType.ADD_NODE,
            parentId: parentNode.id,
            node: newNode,
            position: 'after',
            targetId,
            timestamp: Date.now(),
          }
          addHistory(set, true, action)
        } else {
          addHistory(set, true)
        }
      },

      deleteNode: nodeId => {
        const state = get()
        const node = findNode(state.pageSchema.root, nodeId)
        const parentNode = findParentNode(state.pageSchema.root, nodeId)
        let nodeIndex = -1

        // 记录索引用于undo恢复位置
        if (parentNode && parentNode.children) {
          nodeIndex = parentNode.children.findIndex(child => child.id === nodeId)
        }

        // 记录增量历史（在操作前记录）
        if (ENABLE_INCREMENTAL_HISTORY && node && parentNode) {
          const action: DeleteNodeAction = {
            type: HistoryActionType.DELETE_NODE,
            nodeId,
            parentId: parentNode.id,
            node: safeDeepClone(node), // 保存节点副本用于恢复
            index: nodeIndex,
            timestamp: Date.now(),
          }
          addHistory(set, true, action)
        } else {
          addHistory(set, true)
        }

        set(state => {
          state.pageSchema.root = deleteNode(state.pageSchema.root, nodeId)
          // 重新构建 nodeMap - 关键修复！
          state.nodeMap = buildNodeMap(state.pageSchema.root)
          state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== nodeId)
          state.selectedNodes.delete(nodeId)

          // 如果删除的是焦点节点，切换到剩余节点的第一个
          if (state.lastSelectedNode?.id === nodeId) {
            const remainingIds = state.selectedNodeIds
            state.lastSelectedNode =
              remainingIds.length > 0 ? state.selectedNodes.get(remainingIds[0]) || null : null
          }
        })
      },

      duplicateNode: nodeId => {
        const state = get()
        const node = findNode(state.pageSchema.root, nodeId)
        if (!node) return

        const parentNode = findParentNode(state.pageSchema.root, nodeId)
        if (!parentNode) return

        const cloned = cloneNode(node)

        // 记录增量历史（在操作前记录）
        if (ENABLE_INCREMENTAL_HISTORY) {
          const action: AddNodeAction = {
            type: HistoryActionType.ADD_NODE,
            parentId: parentNode.id,
            node: cloned,
            position: 'after',
            targetId: nodeId,
            timestamp: Date.now(),
          }
          addHistory(set, true, action)
        } else {
          addHistory(set, true)
        }

        set(state => {
          const node = findNode(state.pageSchema.root, nodeId)
          if (node) {
            const cloned = cloneNode(node)
            state.pageSchema.root = insertAfter(state.pageSchema.root, nodeId, cloned)
            // 重新构建 nodeMap - 关键修复！
            state.nodeMap = buildNodeMap(state.pageSchema.root)
            // 同步更新三个选中状态
            state.selectedNodeIds = [cloned.id]
            state.selectedNodes = new Map([[cloned.id, cloned]])
            state.lastSelectedNode = cloned
          }
        })
      },

      updateNodeProps: (nodeId, props) => {
        const state = get()
        const oldNode = state.nodeMap.get(nodeId)
        const oldProps = oldNode ? { ...oldNode.props } : {}

        set(state => {
          const oldMap = state.nodeMap
          state.pageSchema.root = updateNodeProps(state.pageSchema.root, nodeId, props)
          // 使用增量更新 nodeMap（性能优化：只更新路径上的节点）
          state.nodeMap = updateNodeMapIncremental(state.pageSchema.root, nodeId, oldMap)
          // 同步选中节点引用
          syncSelectedNodeRefs(state, nodeId)
        })

        // 记录增量历史（使用防抖）
        if (ENABLE_INCREMENTAL_HISTORY) {
          const action: UpdatePropsAction = {
            type: HistoryActionType.UPDATE_PROPS,
            nodeId,
            oldProps,
            newProps: props,
            timestamp: Date.now(),
          }
          addHistory(set, false, action)
        } else {
          addHistory(set, false)
        }
      },

      updateNodeStyle: (nodeId, style) => {
        const state = get()
        const oldNode = state.nodeMap.get(nodeId)
        const oldStyle = oldNode ? { ...oldNode.style } : {}

        set(state => {
          const oldMap = state.nodeMap
          state.pageSchema.root = updateNodeStyle(state.pageSchema.root, nodeId, style)
          // 使用增量更新 nodeMap（性能优化：只更新路径上的节点）
          state.nodeMap = updateNodeMapIncremental(state.pageSchema.root, nodeId, oldMap)
          // 同步选中节点引用
          syncSelectedNodeRefs(state, nodeId)
        })

        // 记录增量历史（使用防抖）
        if (ENABLE_INCREMENTAL_HISTORY) {
          const action: UpdateStyleAction = {
            type: HistoryActionType.UPDATE_STYLE,
            nodeId,
            oldStyle,
            newStyle: style,
            timestamp: Date.now(),
          }
          addHistory(set, false, action)
        } else {
          addHistory(set, false)
        }
      },

      // 切换节点显示/隐藏
      toggleNodeVisibility: nodeId => {
        const state = get()
        const node = findNode(state.pageSchema.root, nodeId)

        // 不允许隐藏 Page 根容器
        if (node?.type === 'Page') {
          return
        }

        const oldVisible = !node?.hidden // hidden=false表示可见，hidden=true表示隐藏
        const newVisible = !oldVisible

        set(state => {
          const toggleHidden = (node: NodeSchema): NodeSchema => {
            if (node.id === nodeId) {
              return { ...node, hidden: !node.hidden }
            }
            if (node.children) {
              return {
                ...node,
                children: node.children.map(toggleHidden),
              }
            }
            return node
          }
          state.pageSchema.root = toggleHidden(state.pageSchema.root)
          // 重新构建 nodeMap
          state.nodeMap = buildNodeMap(state.pageSchema.root)
          // 同步选中节点引用
          syncSelectedNodeRefs(state, nodeId)
        })

        // 记录增量历史
        if (ENABLE_INCREMENTAL_HISTORY) {
          const action: ToggleVisibilityAction = {
            type: HistoryActionType.TOGGLE_VISIBILITY,
            nodeId,
            oldVisible,
            newVisible,
            timestamp: Date.now(),
          }
          addHistory(set, true, action)
        } else {
          addHistory(set, true)
        }
      },

      // 上移节点
      moveNodeUp: nodeId => {
        const state = get()
        const parent = findParentNode(state.pageSchema.root, nodeId)
        if (!parent || !parent.children) return

        const index = parent.children.findIndex(c => c.id === nodeId)
        if (index <= 0) return // 无法上移

        set(state => {
          const parent = findParentNode(state.pageSchema.root, nodeId)
          if (!parent || !parent.children) return

          const index = parent.children.findIndex(c => c.id === nodeId)
          if (index > 0) {
            const newChildren = [...parent.children]
            ;[newChildren[index - 1], newChildren[index]] = [
              newChildren[index],
              newChildren[index - 1],
            ]

            const updateParent = (node: NodeSchema): NodeSchema => {
              if (node.id === parent.id) {
                return { ...node, children: newChildren }
              }
              if (node.children) {
                return { ...node, children: node.children.map(updateParent) }
              }
              return node
            }

            state.pageSchema.root = updateParent(state.pageSchema.root)
            state.nodeMap = buildNodeMap(state.pageSchema.root)
          }
        })

        // 记录增量历史
        if (ENABLE_INCREMENTAL_HISTORY) {
          const action: MoveNodeAction = {
            type: HistoryActionType.MOVE_NODE,
            nodeId,
            oldParentId: parent.id,
            newParentId: parent.id,
            oldIndex: index,
            newIndex: index - 1,
            timestamp: Date.now(),
          }
          addHistory(set, true, action)
        } else {
          addHistory(set, true)
        }
      },

      // 下移节点
      moveNodeDown: nodeId => {
        const state = get()
        const parent = findParentNode(state.pageSchema.root, nodeId)
        if (!parent || !parent.children) return

        const index = parent.children.findIndex(c => c.id === nodeId)
        if (index >= parent.children.length - 1) return // 无法下移

        set(state => {
          const parent = findParentNode(state.pageSchema.root, nodeId)
          if (!parent || !parent.children) return

          const index = parent.children.findIndex(c => c.id === nodeId)
          if (index < parent.children.length - 1) {
            const newChildren = [...parent.children]
            ;[newChildren[index], newChildren[index + 1]] = [
              newChildren[index + 1],
              newChildren[index],
            ]

            const updateParent = (node: NodeSchema): NodeSchema => {
              if (node.id === parent.id) {
                return { ...node, children: newChildren }
              }
              if (node.children) {
                return { ...node, children: node.children.map(updateParent) }
              }
              return node
            }

            state.pageSchema.root = updateParent(state.pageSchema.root)
            state.nodeMap = buildNodeMap(state.pageSchema.root)
          }
        })

        // 记录增量历史
        if (ENABLE_INCREMENTAL_HISTORY) {
          const action: MoveNodeAction = {
            type: HistoryActionType.MOVE_NODE,
            nodeId,
            oldParentId: parent.id,
            newParentId: parent.id,
            oldIndex: index,
            newIndex: index + 1,
            timestamp: Date.now(),
          }
          addHistory(set, true, action)
        } else {
          addHistory(set, true)
        }
      },

      moveNodeTo: (nodeId, targetId, position) => {
        const state = get()

        // 不能移动到自己
        if (nodeId === targetId) return

        const nodeToMove = findNode(state.pageSchema.root, nodeId)
        if (!nodeToMove) return

        // 记录原位置
        const oldParent = findParentNode(state.pageSchema.root, nodeId)
        if (!oldParent || !oldParent.children) return
        const oldIndex = oldParent.children.findIndex(c => c.id === nodeId)

        set(state => {
          const nodeToMove = findNode(state.pageSchema.root, nodeId)
          if (!nodeToMove) return

          let newRoot = deleteNode(state.pageSchema.root, nodeId)

          if (position === 'before') {
            newRoot = insertBefore(newRoot, targetId, nodeToMove)
          } else if (position === 'after') {
            newRoot = insertAfter(newRoot, targetId, nodeToMove)
          } else if (position === 'inside') {
            newRoot = appendChild(newRoot, targetId, nodeToMove)
          }

          state.pageSchema.root = newRoot
          state.nodeMap = buildNodeMap(state.pageSchema.root)
        })

        // 记录增量历史 - 计算新位置
        if (ENABLE_INCREMENTAL_HISTORY) {
          const newState = get()
          const newParent = findParentNode(newState.pageSchema.root, nodeId)
          if (newParent && newParent.children) {
            const newIndex = newParent.children.findIndex(c => c.id === nodeId)
            const action: MoveNodeAction = {
              type: HistoryActionType.MOVE_NODE,
              nodeId,
              oldParentId: oldParent.id,
              newParentId: newParent.id,
              oldIndex,
              newIndex,
              timestamp: Date.now(),
            }
            addHistory(set, true, action)
          } else {
            addHistory(set, true)
          }
        } else {
          addHistory(set, true)
        }
      },

      // 选中节点（兼容旧代码，但会查找节点）
      selectNode: (nodeId, multiSelect = false) => {
        const node = get().nodeMap.get(nodeId)
        if (node) {
          get().selectNodeDirect(node, multiSelect)
        }
      },

      // 直接选中节点（性能优化：O(1)，无需查找）
      selectNodeDirect: (node, multiSelect = false) => {
        set(state => {
          if (multiSelect) {
            if (state.selectedNodes.has(node.id)) {
              // 取消选中
              const index = state.selectedNodeIds.indexOf(node.id)
              if (index >= 0) {
                state.selectedNodeIds.splice(index, 1)
              }
              state.selectedNodes.delete(node.id)
              if (state.lastSelectedNode?.id === node.id) {
                const lastId = state.selectedNodeIds[state.selectedNodeIds.length - 1]
                state.lastSelectedNode = lastId ? state.selectedNodes.get(lastId) || null : null
              }
            } else {
              state.selectedNodeIds.push(node.id)
              state.selectedNodes.set(node.id, node)
              state.lastSelectedNode = node
            }
          } else {
            // 单选
            state.selectedNodeIds = [node.id]
            state.selectedNodes.clear()
            state.selectedNodes.set(node.id, node)
            state.lastSelectedNode = node
          }
        })
      },

      // 批量选中节点（兼容旧代码，但会查找节点）
      selectNodes: nodeIds => {
        const nodes = nodeIds.map(id => get().nodeMap.get(id)).filter(Boolean) as NodeSchema[]
        get().selectNodesDirect(nodes)
      },

      // 直接批量选中节点（性能优化：O(1)，无需查找）
      selectNodesDirect: nodes => {
        set(state => {
          state.selectedNodeIds = nodes.map(n => n.id)
          state.selectedNodes.clear()
          nodes.forEach(n => state.selectedNodes.set(n.id, n))
          // 批量选中时，最后一个节点作为焦点节点
          state.lastSelectedNode = nodes.length > 0 ? nodes[nodes.length - 1] : null
        })
      },

      // 全选（选中所有非Page节点）
      selectAll: () => {
        set(state => {
          const allNodes: NodeSchema[] = []
          const collectNodes = (node: NodeSchema) => {
            if (node.type !== 'Page') {
              allNodes.push(node)
            }
            node.children?.forEach(collectNodes)
          }
          collectNodes(state.pageSchema.root)
          state.selectedNodeIds = allNodes.map(n => n.id)
          state.selectedNodes.clear()
          allNodes.forEach(n => state.selectedNodes.set(n.id, n))
          // 全选时，最后一个节点作为焦点
          state.lastSelectedNode = allNodes.length > 0 ? allNodes[allNodes.length - 1] : null
        })
      },

      // 清除选中
      clearSelection: () => {
        set(state => {
          state.selectedNodeIds = []
          state.selectedNodes.clear()
          state.lastSelectedNode = null
        })
      },

      setHoveredNode: nodeId => {
        set(state => {
          state.hoveredNodeId = nodeId
        })
      },

      // 切换模式
      setMode: mode => {
        set(state => {
          state.mode = mode
        })
      },

      updateCanvasConfig: config => {
        set(state => {
          state.canvasConfig = { ...state.canvasConfig, ...config }
        })
      },
      // 复制节点到剪贴板
      copyNode: nodeId => {
        const state = get()
        const node = findNode(state.pageSchema.root, nodeId)
        if (node) {
          set(draft => {
            // 使用优化的深拷贝
            draft.clipboard = safeDeepClone(node)
          })
        }
      },

      // 剪切节点到剪贴板
      cutNode: nodeId => {
        const state = get()
        const node = findNode(state.pageSchema.root, nodeId)
        if (!node) return

        const parentNode = findParentNode(state.pageSchema.root, nodeId)
        if (!parentNode || !parentNode.children) return

        const nodeIndex = parentNode.children.findIndex(child => child.id === nodeId)

        set(draft => {
          // 使用优化的深拷贝
          draft.clipboard = safeDeepClone(node)
          draft.pageSchema.root = deleteNode(draft.pageSchema.root, nodeId)
          // 重新构建 nodeMap - 关键修复！
          draft.nodeMap = buildNodeMap(draft.pageSchema.root)
          draft.selectedNodeIds = draft.selectedNodeIds.filter(id => id !== nodeId)

          // 同步选中节点
          draft.selectedNodes.delete(nodeId)
          if (draft.lastSelectedNode?.id === nodeId) {
            const remainingIds = draft.selectedNodeIds
            draft.lastSelectedNode =
              remainingIds.length > 0 ? draft.selectedNodes.get(remainingIds[0]) || null : null
          }
        })

        // 记录增量历史
        if (ENABLE_INCREMENTAL_HISTORY) {
          const action: DeleteNodeAction = {
            type: HistoryActionType.DELETE_NODE,
            nodeId,
            parentId: parentNode.id,
            node: safeDeepClone(node),
            index: nodeIndex,
            timestamp: Date.now(),
          }
          addHistory(set, true, action)
        } else {
          addHistory(set, true)
        }
      },

      // 粘贴节点
      pasteNode: targetId => {
        const state = get()
        if (!state.clipboard) {
          return
        }

        const newNode = cloneNode(state.clipboard)
        let parentId: NodeId
        let position: 'after' | 'child'

        if (targetId) {
          const targetParent = findParentNode(state.pageSchema.root, targetId)
          if (!targetParent) return
          parentId = targetParent.id
          position = 'after'
        } else {
          parentId = state.pageSchema.root.id
          position = 'child'
        }

        set(draft => {
          if (!draft.clipboard) return
          const newNode = cloneNode(draft.clipboard)

          if (targetId) {
            // 如果指定了目标节点，粘贴到其后面
            draft.pageSchema.root = insertAfter(draft.pageSchema.root, targetId, newNode)
          } else {
            // 否则粘贴到根节点
            draft.pageSchema.root = appendChild(
              draft.pageSchema.root,
              draft.pageSchema.root.id,
              newNode
            )
          }

          // 重新构建 nodeMap - 关键修复！
          draft.nodeMap = buildNodeMap(draft.pageSchema.root)
          draft.selectedNodeIds = [newNode.id]
        })

        // 记录增量历史
        if (ENABLE_INCREMENTAL_HISTORY) {
          const action: AddNodeAction = {
            type: HistoryActionType.ADD_NODE,
            parentId,
            node: newNode,
            position,
            targetId: targetId || undefined,
            timestamp: Date.now(),
          }
          addHistory(set, true, action)
        } else {
          addHistory(set, true)
        }
      },

      // 粘贴多个节点
      pasteMultiNodes: () => {
        const state = get()
        if (!state.clipboard || state.clipboard.type !== '__MultiCopy__') {
          return
        }

        const nodes = (state.clipboard.props?.nodes as NodeSchema[]) || []
        const clonedNodes = nodes.map(node => cloneNode(node))
        const rootId = state.pageSchema.root.id

        set(draft => {
          if (!draft.clipboard || !draft.clipboard.props?.nodes) return
          const nodes = draft.clipboard.props.nodes as NodeSchema[]
          const newNodeIds: string[] = []

          nodes.forEach(node => {
            const cloned = cloneNode(node)
            draft.pageSchema.root = appendChild(
              draft.pageSchema.root,
              draft.pageSchema.root.id,
              cloned
            )
            newNodeIds.push(cloned.id)
          })

          // 重新构建 nodeMap - 关键修复！
          draft.nodeMap = buildNodeMap(draft.pageSchema.root)
          draft.selectedNodeIds = newNodeIds
        })

        // 记录增量历史 - 使用 BATCH_UPDATE
        if (ENABLE_INCREMENTAL_HISTORY) {
          const actions: AddNodeAction[] = clonedNodes.map(node => ({
            type: HistoryActionType.ADD_NODE,
            parentId: rootId,
            node,
            position: 'child' as const,
            timestamp: Date.now(),
          }))

          const batchAction: HistoryAction = {
            type: HistoryActionType.BATCH_UPDATE,
            actions,
            timestamp: Date.now(),
          }
          addHistory(set, true, batchAction)
        } else {
          addHistory(set, true)
        }
      },

      // 批量复制节点（将多个节点存储为数组）
      copyNodes: nodeIds => {
        const state = get()
        const nodes = nodeIds
          .map(id => findNode(state.pageSchema.root, id))
          .filter(Boolean) as NodeSchema[]
        if (nodes.length > 0) {
          set(draft => {
            // 存储多个节点的数组
            // 使用优化的深拷贝
            const clonedNodes = safeDeepClone(nodes)
            draft.clipboard = {
              id: 'multi-copy',
              type: '__MultiCopy__',
              props: { nodes: clonedNodes },
              style: {},
              children: [],
            }
          })
        }
      },

      // 批量删除节点
      deleteNodes: nodeIds => {
        const state = get()

        // 收集要删除的节点及其信息
        const nodesToDelete: Array<{
          nodeId: NodeId
          parentId: NodeId
          node: NodeSchema
          index: number
        }> = []

        nodeIds.forEach(nodeId => {
          const node = findNode(state.pageSchema.root, nodeId)
          const parent = findParentNode(state.pageSchema.root, nodeId)
          if (node && parent && parent.children) {
            const index = parent.children.findIndex(c => c.id === nodeId)
            nodesToDelete.push({
              nodeId,
              parentId: parent.id,
              node: safeDeepClone(node),
              index,
            })
          }
        })

        // 记录增量历史 - 使用 BATCH_UPDATE（在操作前记录）
        if (ENABLE_INCREMENTAL_HISTORY) {
          const actions: DeleteNodeAction[] = nodesToDelete.map(info => ({
            type: HistoryActionType.DELETE_NODE,
            nodeId: info.nodeId,
            parentId: info.parentId,
            node: info.node,
            index: info.index,
            timestamp: Date.now(),
          }))

          const batchAction: HistoryAction = {
            type: HistoryActionType.BATCH_UPDATE,
            actions,
            timestamp: Date.now(),
          }
          addHistory(set, true, batchAction)
        } else {
          addHistory(set, true)
        }

        set(state => {
          // 批量删除节点，避免重复赋值
          let newRoot = state.pageSchema.root
          nodeIds.forEach(nodeId => {
            newRoot = deleteNode(newRoot, nodeId)
          })
          state.pageSchema.root = newRoot
          // 重新构建 nodeMap - 关键修复！
          state.nodeMap = buildNodeMap(state.pageSchema.root)
          // 清除选中状态
          state.selectedNodeIds = []
          state.selectedNodes.clear()
          state.lastSelectedNode = null
        })
      },

      // 批量复制节点
      duplicateNodes: nodeIds => {
        const state = get()

        // 收集要复制的节点及其信息
        const nodesToDuplicate: Array<{
          nodeId: NodeId
          parentId: NodeId
          node: NodeSchema
        }> = []

        nodeIds.forEach(nodeId => {
          const node = findNode(state.pageSchema.root, nodeId)
          const parent = findParentNode(state.pageSchema.root, nodeId)
          if (node && parent) {
            const cloned = cloneNode(node)
            nodesToDuplicate.push({
              nodeId,
              parentId: parent.id,
              node: cloned,
            })
          }
        })

        // 记录增量历史 - 使用 BATCH_UPDATE（在操作前记录）
        if (ENABLE_INCREMENTAL_HISTORY) {
          const actions: AddNodeAction[] = nodesToDuplicate.map(info => ({
            type: HistoryActionType.ADD_NODE,
            parentId: info.parentId,
            node: info.node,
            position: 'after' as const,
            targetId: info.nodeId,
            timestamp: Date.now(),
          }))

          const batchAction: HistoryAction = {
            type: HistoryActionType.BATCH_UPDATE,
            actions,
            timestamp: Date.now(),
          }
          addHistory(set, true, batchAction)
        } else {
          addHistory(set, true)
        }

        set(state => {
          const newNodeIds: string[] = []
          nodeIds.forEach(nodeId => {
            const node = findNode(state.pageSchema.root, nodeId)
            if (node) {
              const cloned = cloneNode(node)
              state.pageSchema.root = insertAfter(state.pageSchema.root, nodeId, cloned)
              newNodeIds.push(cloned.id)
            }
          })
          // 重新构建 nodeMap - 关键修复！
          state.nodeMap = buildNodeMap(state.pageSchema.root)
          state.selectedNodeIds = newNodeIds
          state.selectedNodes.clear()
          newNodeIds.forEach(id => {
            const node = state.nodeMap.get(id)
            if (node) {
              state.selectedNodes.set(id, node)
            }
          })
          state.lastSelectedNode =
            newNodeIds.length > 0
              ? state.nodeMap.get(newNodeIds[newNodeIds.length - 1]) || null
              : null
        })
      },

      // 撤销
      undo: () => {
        const state = get()
        if (state.canUndo()) {
          set(draft => {
            if (ENABLE_INCREMENTAL_HISTORY && draft.historyActions.length > 0) {
              const currentAction = draft.historyActions[draft.historyIndex]
              draft.pageSchema = unapplyHistoryAction(draft.pageSchema, currentAction)
              draft.historyIndex -= 1
            } else {
              draft.historyIndex -= 1
              draft.pageSchema = safeDeepClone(draft.history[draft.historyIndex])
            }
            draft.nodeMap = buildNodeMap(draft.pageSchema.root)
          })
        }
      },

      // 重做
      redo: () => {
        const state = get()
        if (state.canRedo()) {
          set(draft => {
            if (ENABLE_INCREMENTAL_HISTORY && draft.historyActions.length > 0) {
              const nextAction = draft.historyActions[draft.historyIndex + 1]
              draft.pageSchema = applyHistoryAction(draft.pageSchema, nextAction)
              draft.historyIndex += 1
            } else {
              draft.historyIndex += 1
              draft.pageSchema = safeDeepClone(draft.history[draft.historyIndex])
            }
            draft.nodeMap = buildNodeMap(draft.pageSchema.root)
          })
        }
      },

      // 是否可以撤销
      canUndo: () => {
        const state = get()
        if (ENABLE_INCREMENTAL_HISTORY && state.historyActions.length > 0) {
          return state.historyIndex > 0
        }
        return state.historyIndex > 0
      },

      // 是否可以重做
      canRedo: () => {
        const state = get()
        if (ENABLE_INCREMENTAL_HISTORY && state.historyActions.length > 0) {
          return state.historyIndex < state.maxHistoryIndex
        }
        return state.historyIndex < state.history.length - 1
      },

      // 保存到 IndexedDB，并在 localStorage 写入备份作为可靠回退
      saveToStorage: async () => {
        const state = get()
        // 先尝试写 localStorage 备份（同步，可靠）
        try {
          const str = JSON.stringify(state.pageSchema)
          try {
            localStorage.setItem('cv-builder-backup', str)
          } catch (e) {
            // localStorage 可能在私密模式或 quota 限制下失败，记录但不抛出
            // console.warn('Failed to write localStorage backup', e)
          }
        } catch (e) {
          // JSON 序列化失败（极少见），继续尝试 IndexedDB 写入
        }

        try {
          await indexedDBService.setItem(STORES.EDITOR_STATE, STORAGE_KEY, state.pageSchema)
          // 如果 IndexedDB 写入成功且数据看起来有效，则可以尝试移除本地备份（不强制）
          // 这里我们不立即删除备份，以防止竞态导致丢失。由 loadFromStorage 在成功加载时清理备份。
        } catch (error) {
          // IndexedDB 写入失败，保留本地备份以便下次加载恢复，并打印错误以方便排查
          // eslint-disable-next-line no-console
          console.error('Failed to save editor state to IndexedDB:', error)
        }
      },

      // 从 IndexedDB 加载
      loadFromStorage: async () => {
        try {
          const saved = await indexedDBService.getItem<PageSchema>(STORES.EDITOR_STATE, STORAGE_KEY)
          if (saved) {
            // 直接设置状态，不触发历史记录
            set(state => {
              state.pageSchema = safeDeepClone(saved)
              state.nodeMap = buildNodeMap(state.pageSchema.root)
              // 清空历史记录和选中状态
              state.selectedNodeIds = []
              state.selectedNodes = new Map()
              state.lastSelectedNode = null
              state.history = []
              state.historyActions = []
              state.historyIndex = -1
              state.maxHistoryIndex = -1
              state.baseSnapshot = null
            })

            // 重新初始化历史记录，添加初始状态
            addHistory(set, true)

            // 加载成功后仅在读取的数据看起来有效时清除 localStorage 备份
            if (isValidPageSchema(saved)) {
              try {
                localStorage.removeItem('cv-builder-backup')
              } catch (e) {
                // ignore localStorage errors
              }
            }

            return
          }
        } catch (error) {
          // 静默失败
        }

        // 如果 IndexedDB 加载失败，尝试从 localStorage 备份恢复
        try {
          const backup = localStorage.getItem('cv-builder-backup')
          if (backup) {
            const backupSchema = JSON.parse(backup) as PageSchema

            // 直接设置状态，不触发历史记录
            set(state => {
              state.pageSchema = safeDeepClone(backupSchema)
              state.nodeMap = buildNodeMap(state.pageSchema.root)
              // 清空历史记录和选中状态
              state.selectedNodeIds = []
              state.selectedNodes = new Map()
              state.lastSelectedNode = null
              state.history = []
              state.historyActions = []
              state.historyIndex = -1
              state.maxHistoryIndex = -1
              state.baseSnapshot = null
            })
            // 恢复后立即保存到 IndexedDB
            await get().saveToStorage()
            // 清除备份
            localStorage.removeItem('cv-builder-backup')
          }
        } catch (error) {
          // 静默失败
        }
      },
    }
  })
)
