/**
 *
 * 使用Zustand管理全局编辑器状态，支持拖拽排序
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
import { nanoid } from 'nanoid'
import { indexedDBService, STORES } from '@utils/indexedDB'

// 启用 Immer 的 MapSet 插件以支持 Map 和 Set
enableMapSet()

export interface EditorState {
  // 页面数据
  pageSchema: PageSchema

  // 节点映射表（性能优化：O(1) 查找）
  nodeMap: Map<NodeId, NodeSchema>

  // 当前编辑的简历ID（用于保存）
  currentResumeId: string | null

  // 选中状态（性能优化：直接存储节点引用，避免查找）
  selectedNodeIds: NodeId[] // 维护选中顺序
  selectedNodes: Map<NodeId, NodeSchema> // 新增：Map 快速查找选中的节点
  lastSelectedNode: NodeSchema | null // 新增：指向最后一次选中的节点（焦点节点）
  hoveredNodeId: NodeId | null

  // 编辑模式
  mode: EditorMode

  // 画布配置
  canvasConfig: CanvasConfig

  // 历史记录
  history: PageSchema[]
  historyIndex: number

  // 剪贴板
  clipboard: NodeSchema | null

  // Actions
  setPageSchema: (schema: PageSchema) => void
  setCurrentResumeId: (id: string | null) => void

  // 节点查询（性能优化）
  getNode: (nodeId: NodeId) => NodeSchema | null
  getSelectedNode: (nodeId: NodeId) => NodeSchema | null // 新增：通过 ID 获取选中的节点（O(1)）
  getLastSelectedNode: () => NodeSchema | null // 新增：获取最后选中的节点（焦点节点）
  isNodeSelected: (nodeId: NodeId) => boolean // 新增：判断节点是否被选中（O(1)）

  // 节点操作
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

  // 选中操作（性能优化：直接传入节点，避免查找）
  selectNode: (nodeId: NodeId, multiSelect?: boolean) => void
  selectNodeDirect: (node: NodeSchema, multiSelect?: boolean) => void // 新增：直接传入节点
  selectNodes: (nodeIds: NodeId[]) => void
  selectNodesDirect: (nodes: NodeSchema[]) => void // 新增：直接传入节点数组
  selectAll: () => void
  clearSelection: () => void
  setHoveredNode: (nodeId: NodeId | null) => void

  // 剪贴板操作
  copyNode: (nodeId: NodeId) => void
  cutNode: (nodeId: NodeId) => void
  pasteNode: (targetId?: NodeId) => void
  pasteMultiNodes: () => void
  copyNodes: (nodeIds: NodeId[]) => void
  deleteNodes: (nodeIds: NodeId[]) => void
  duplicateNodes: (nodeIds: NodeId[]) => void

  // 模式切换
  setMode: (mode: EditorMode) => void

  // 画布配置
  updateCanvasConfig: (config: Partial<CanvasConfig>) => void

  // 历史记录
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // 持久化
  saveToStorage: () => Promise<void>
  loadFromStorage: () => Promise<void>
}

const STORAGE_KEY = 'resume-builder-state'

// 创建默认页面Schema
const createDefaultPageSchema = (): PageSchema => ({
  version: '1.0.0',
  meta: {
    title: '我的简历',
    description: '使用简历构建器创建',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  },
  root: {
    id: nanoid(),
    type: 'Page',
    props: {},
    style: {},
    children: [],
  },
})

// 历史记录配置
const HISTORY_MAX_SIZE = 50 // 限制历史记录数量，避免内存溢出

/**
 * 构建节点映射表（遍历整棵树）
 * 性能优化：缓存所有节点，实现 O(1) 查找
 */
const buildNodeMap = (root: NodeSchema): Map<NodeId, NodeSchema> => {
  const map = new Map<NodeId, NodeSchema>()

  const traverse = (node: NodeSchema) => {
    map.set(node.id, node)
    if (node.children) {
      node.children.forEach(traverse)
    }
  }

  traverse(root)
  return map
}

// 辅助函数：添加历史记录（优化版）
const addHistory = (set: (fn: (state: EditorState) => void) => void) => {
  set((state: EditorState) => {
    // 删除当前索引之后的历史记录
    state.history = state.history.slice(0, state.historyIndex + 1)

    // 添加新的历史记录
    state.history.push(JSON.parse(JSON.stringify(state.pageSchema)))

    // 限制历史记录数量，删除最旧的记录
    if (state.history.length > HISTORY_MAX_SIZE) {
      state.history = state.history.slice(state.history.length - HISTORY_MAX_SIZE)
      state.historyIndex = HISTORY_MAX_SIZE - 1
    } else {
      state.historyIndex = state.history.length - 1
    }

    // 更新节点映射表
    state.nodeMap = buildNodeMap(state.pageSchema.root)
  })
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => {
    const defaultSchema = createDefaultPageSchema()
    return {
      // 初始状态
      pageSchema: defaultSchema,
      nodeMap: buildNodeMap(defaultSchema.root),
      currentResumeId: null,
      selectedNodeIds: [],
      selectedNodes: new Map(), // 新增：Map 快速查找选中的节点
      lastSelectedNode: null, // 新增：最后选中的节点（焦点节点）
      hoveredNodeId: null,
      mode: 'edit',
      canvasConfig: {
        scale: 1,
        showGrid: false,
        showRuler: false,
        backgroundColor: '#fafafa',
      },
      history: [],
      historyIndex: -1,
      clipboard: null,

      // 快速获取节点（O(1) 查找）
      getNode: nodeId => {
        return get().nodeMap.get(nodeId) || null
      },

      // 通过 ID 获取选中的节点（O(1)，从 selectedNodes Map 中获取）
      getSelectedNode: nodeId => {
        return get().selectedNodes.get(nodeId) || null
      },

      // 获取最后选中的节点（焦点节点，O(1)）
      getLastSelectedNode: () => {
        return get().lastSelectedNode
      },

      // 判断节点是否被选中（O(1)）
      isNodeSelected: nodeId => {
        return get().selectedNodes.has(nodeId)
      },

      // 设置页面Schema
      setPageSchema: schema => {
        set(state => {
          state.pageSchema = schema
          state.nodeMap = buildNodeMap(schema.root)
        })
        addHistory(set)
      },

      // 设置当前简历ID
      setCurrentResumeId: id => {
        set(state => {
          state.currentResumeId = id
        })
      },

      // 添加节点
      addNode: (materialType, parentId) => {
        set(state => {
          const newNode = createNode(materialType)
          const targetParentId = parentId || state.pageSchema.root.id
          state.pageSchema.root = appendChild(state.pageSchema.root, targetParentId, newNode)
          state.selectedNodeIds = [newNode.id]
        })
        addHistory(set)
      },

      // 从 Schema 添加节点（用于模板）
      addNodeFromSchema: (schema, parentId) => {
        set(state => {
          // 克隆节点并生成新ID
          const newNode = cloneNode(schema)
          const targetParentId = parentId || state.pageSchema.root.id
          state.pageSchema.root = appendChild(state.pageSchema.root, targetParentId, newNode)
          state.selectedNodeIds = [newNode.id]
        })
        addHistory(set)
      },

      // 在指定节点前添加
      addNodeBefore: (materialType, targetId) => {
        set(state => {
          const newNode = createNode(materialType)
          state.pageSchema.root = insertBefore(state.pageSchema.root, targetId, newNode)
          state.selectedNodeIds = [newNode.id]
        })
        addHistory(set)
      },

      // 在指定节点后添加
      addNodeAfter: (materialType, targetId) => {
        set(state => {
          const newNode = createNode(materialType)
          state.pageSchema.root = insertAfter(state.pageSchema.root, targetId, newNode)
          state.selectedNodeIds = [newNode.id]
        })
        addHistory(set)
      },

      // 删除节点
      deleteNode: nodeId => {
        set(state => {
          state.pageSchema.root = deleteNode(state.pageSchema.root, nodeId)
          state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== nodeId)
        })
        addHistory(set)
      },

      // 复制节点
      duplicateNode: nodeId => {
        set(state => {
          const node = findNode(state.pageSchema.root, nodeId)
          if (node) {
            const cloned = cloneNode(node)
            state.pageSchema.root = insertAfter(state.pageSchema.root, nodeId, cloned)
            state.selectedNodeIds = [cloned.id]
          }
        })
        addHistory(set)
      },

      // 更新节点属性
      updateNodeProps: (nodeId, props) => {
        set(state => {
          state.pageSchema.root = updateNodeProps(state.pageSchema.root, nodeId, props)
        })
        addHistory(set)
      },

      // 更新节点样式
      updateNodeStyle: (nodeId, style) => {
        set(state => {
          state.pageSchema.root = updateNodeStyle(state.pageSchema.root, nodeId, style)
        })
        addHistory(set)
      },

      // 切换节点显示/隐藏
      toggleNodeVisibility: nodeId => {
        set(state => {
          // 不允许隐藏 Page 根容器
          const node = findNode(state.pageSchema.root, nodeId)
          if (node?.type === 'Page') {
            return // 直接返回，不做任何操作
          }

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
        })
        addHistory(set)
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
          }
        })
        addHistory(set)
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
          }
        })
        addHistory(set)
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
        })
        addHistory(set)
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
            draft.clipboard = JSON.parse(JSON.stringify(node)) // 深拷贝
          })
        }
      },

      // 剪切节点到剪贴板
      cutNode: nodeId => {
        const state = get()
        const node = findNode(state.pageSchema.root, nodeId)
        if (node) {
          set(draft => {
            draft.clipboard = JSON.parse(JSON.stringify(node)) // 深拷贝
            draft.pageSchema.root = deleteNode(draft.pageSchema.root, nodeId)
            draft.selectedNodeIds = draft.selectedNodeIds.filter(id => id !== nodeId)
          })
          addHistory(set)
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
        addHistory(set)
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
        addHistory(set)
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
            draft.clipboard = {
              id: 'multi-copy',
              type: '__MultiCopy__',
              props: { nodes: JSON.parse(JSON.stringify(nodes)) },
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
        addHistory(set)
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
        addHistory(set)
      },

      // 撤销
      undo: () => {
        const state = get()
        if (state.canUndo()) {
          set(draft => {
            draft.historyIndex -= 1
            draft.pageSchema = JSON.parse(JSON.stringify(draft.history[draft.historyIndex]))
          })
        }
      },

      // 重做
      redo: () => {
        const state = get()
        if (state.canRedo()) {
          set(draft => {
            draft.historyIndex += 1
            draft.pageSchema = JSON.parse(JSON.stringify(draft.history[draft.historyIndex]))
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
