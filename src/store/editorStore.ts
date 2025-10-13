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

  // 历史记录双模式：完整快照（兼容）+ 增量操作（省内存2000倍）
  history: PageSchema[]
  historyActions: HistoryAction[]
  historyIndex: number
  baseSnapshot: PageSchema | null

  clipboard: NodeSchema | null

  setPageSchema: (schema: PageSchema) => void
  setCurrentResumeId: (id: string | null) => void

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
      history: [],
      historyActions: [],
      historyIndex: -1,
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
        })
        addHistory(set, true)
      },

      setCurrentResumeId: id => {
        set(state => {
          state.currentResumeId = id
        })
      },

      addNode: (materialType, parentId) => {
        const newNode = createNode(materialType)
        const targetParentId = parentId || get().pageSchema.root.id

        set(state => {
          state.pageSchema.root = appendChild(state.pageSchema.root, targetParentId, newNode)
          // 同步更新三个选中状态
          state.selectedNodeIds = [newNode.id]
          state.selectedNodes = new Map([[newNode.id, newNode]])
          state.lastSelectedNode = newNode
        })

        // 记录增量历史
        if (ENABLE_INCREMENTAL_HISTORY) {
          const action: AddNodeAction = {
            type: 'ADD_NODE',
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
            type: 'ADD_NODE',
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
            type: 'ADD_NODE',
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
            type: 'ADD_NODE',
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

        set(state => {
          state.pageSchema.root = deleteNode(state.pageSchema.root, nodeId)
          state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== nodeId)
          state.selectedNodes.delete(nodeId)

          // 如果删除的是焦点节点，切换到剩余节点的第一个
          if (state.lastSelectedNode?.id === nodeId) {
            const remainingIds = state.selectedNodeIds
            state.lastSelectedNode =
              remainingIds.length > 0 ? state.selectedNodes.get(remainingIds[0]) || null : null
          }
        })

        if (ENABLE_INCREMENTAL_HISTORY && node && parentNode) {
          const action: DeleteNodeAction = {
            type: 'DELETE_NODE',
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
      },

      // 复制节点
      duplicateNode: nodeId => {
        set(state => {
          const node = findNode(state.pageSchema.root, nodeId)
          if (node) {
            const cloned = cloneNode(node)
            state.pageSchema.root = insertAfter(state.pageSchema.root, nodeId, cloned)
            // 同步更新三个选中状态
            state.selectedNodeIds = [cloned.id]
            state.selectedNodes = new Map([[cloned.id, cloned]])
            state.lastSelectedNode = cloned
          }
        })
        addHistory(set, true) // 立即保存
      },

      // 更新节点属性（高频操作 - 使用防抖历史记录 + 增量更新）
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
            type: 'UPDATE_PROPS',
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

      // 更新节点样式（高频操作 - 使用防抖历史记录 + 增量更新）
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
            type: 'UPDATE_STYLE',
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
            type: 'TOGGLE_VISIBILITY',
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
        addHistory(set, true) // 立即保存
      },

      // 下移节点
      moveNodeDown: nodeId => {
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
        addHistory(set, true) // 立即保存
      },

      // 移动节点到指定位置
      moveNodeTo: (nodeId, targetId, position) => {
        set(state => {
          // 不能移动到自己
          if (nodeId === targetId) return

          const nodeToMove = findNode(state.pageSchema.root, nodeId)
          if (!nodeToMove) return

          // 删除原节点
          let newRoot = deleteNode(state.pageSchema.root, nodeId)

          // 插入到新位置
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
        addHistory(set, true) // 立即保存
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
              // 更新最后选中节点：如果取消的是最后选中的，则指向新的最后一个
              if (state.lastSelectedNode?.id === node.id) {
                const lastId = state.selectedNodeIds[state.selectedNodeIds.length - 1]
                state.lastSelectedNode = lastId ? state.selectedNodes.get(lastId) || null : null
              }
            } else {
              // 添加选中
              state.selectedNodeIds.push(node.id)
              state.selectedNodes.set(node.id, node)
              // 更新最后选中节点
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

      // 设置悬停节点
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

      // 更新画布配置
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
        if (node) {
          set(draft => {
            // 使用优化的深拷贝
            draft.clipboard = safeDeepClone(node)
            draft.pageSchema.root = deleteNode(draft.pageSchema.root, nodeId)
            draft.selectedNodeIds = draft.selectedNodeIds.filter(id => id !== nodeId)
          })
          addHistory(set, true) // 立即保存
        }
      },

      // 粘贴节点
      pasteNode: targetId => {
        const state = get()
        if (!state.clipboard) {
          return
        }

        set(draft => {
          // 克隆剪贴板中的节点并生成新ID
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

          draft.selectedNodeIds = [newNode.id]
        })
        addHistory(set, true) // 立即保存
      },

      // 粘贴多个节点
      pasteMultiNodes: () => {
        const state = get()
        if (!state.clipboard || state.clipboard.type !== '__MultiCopy__') {
          return
        }

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

          draft.selectedNodeIds = newNodeIds
        })
        addHistory(set, true) // 立即保存
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
        set(state => {
          nodeIds.forEach(nodeId => {
            state.pageSchema.root = deleteNode(state.pageSchema.root, nodeId)
          })
          state.selectedNodeIds = []
        })
        addHistory(set, true) // 立即保存
      },

      // 批量复制节点
      duplicateNodes: nodeIds => {
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
          state.selectedNodeIds = newNodeIds
        })
        addHistory(set, true) // 立即保存
      },

      // 撤销
      undo: () => {
        const state = get()
        if (state.canUndo()) {
          set(draft => {
            if (ENABLE_INCREMENTAL_HISTORY && draft.historyActions.length > 0) {
              // ========== 增量模式：反向应用当前操作 ==========
              const currentAction = draft.historyActions[draft.historyIndex]
              draft.pageSchema = unapplyHistoryAction(draft.pageSchema, currentAction)
              draft.historyIndex -= 1
            } else {
              // ========== 完整快照模式 ==========
              draft.historyIndex -= 1
              draft.pageSchema = safeDeepClone(draft.history[draft.historyIndex])
            }
            // 重建 nodeMap
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
              // ========== 增量模式：正向应用下一个操作 ==========
              draft.historyIndex += 1
              const nextAction = draft.historyActions[draft.historyIndex]
              draft.pageSchema = applyHistoryAction(draft.pageSchema, nextAction)
            } else {
              // ========== 完整快照模式 ==========
              draft.historyIndex += 1
              draft.pageSchema = safeDeepClone(draft.history[draft.historyIndex])
            }
            // 重建 nodeMap
            draft.nodeMap = buildNodeMap(draft.pageSchema.root)
          })
        }
      },

      // 是否可以撤销
      canUndo: () => {
        const state = get()
        return state.historyIndex > 0
      },

      // 是否可以重做
      canRedo: () => {
        const state = get()
        if (ENABLE_INCREMENTAL_HISTORY && state.historyActions.length > 0) {
          return state.historyIndex < state.historyActions.length - 1
        }
        return state.historyIndex < state.history.length - 1
      },

      // 保存到 IndexedDB
      saveToStorage: async () => {
        const state = get()
        try {
          await indexedDBService.setItem(STORES.EDITOR_STATE, STORAGE_KEY, state.pageSchema)
        } catch (error) {
          // 静默失败
        }
      },

      // 从 IndexedDB 加载
      loadFromStorage: async () => {
        try {
          const saved = await indexedDBService.getItem<PageSchema>(STORES.EDITOR_STATE, STORAGE_KEY)
          if (saved) {
            get().setPageSchema(saved)
          }
        } catch (error) {
          // 静默失败
        }
      },
    }
  })
)
