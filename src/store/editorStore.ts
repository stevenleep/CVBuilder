/**
 * 编辑器状态管理（增强版）
 * 
 * 使用Zustand管理全局编辑器状态，支持拖拽排序
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
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

interface EditorState {
  // 页面数据
  pageSchema: PageSchema
  
  // 选中状态
  selectedNodeIds: NodeId[]
  hoveredNodeId: NodeId | null
  
  // 编辑模式
  mode: EditorMode
  
  // 画布配置
  canvasConfig: CanvasConfig
  
  // 历史记录
  history: PageSchema[]
  historyIndex: number
  
  // Actions
  setPageSchema: (schema: PageSchema) => void
  
  // 节点操作
  addNode: (materialType: string, parentId?: NodeId) => void
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
  
  // 选中操作
  selectNode: (nodeId: NodeId, multiSelect?: boolean) => void
  clearSelection: () => void
  setHoveredNode: (nodeId: NodeId | null) => void
  
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
  saveToLocalStorage: () => void
  loadFromLocalStorage: () => void
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

// 辅助函数：添加历史记录
const addHistory = (set: any) => {
  set((state: any) => {
    state.history = state.history.slice(0, state.historyIndex + 1)
    state.history.push(JSON.parse(JSON.stringify(state.pageSchema)))
    state.historyIndex = state.history.length - 1
  })
}

export const useEditorStore = create<EditorState>()(
  immer((set, get) => ({
    // 初始状态
    pageSchema: createDefaultPageSchema(),
    selectedNodeIds: [],
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

    // 设置页面Schema
    setPageSchema: (schema) => {
      set((state) => {
        state.pageSchema = schema
      })
      addHistory(set)
    },

    // 添加节点
    addNode: (materialType, parentId) => {
      set((state) => {
        const newNode = createNode(materialType)
        const targetParentId = parentId || state.pageSchema.root.id
        state.pageSchema.root = appendChild(state.pageSchema.root, targetParentId, newNode)
        state.selectedNodeIds = [newNode.id]
      })
      addHistory(set)
    },

    // 在指定节点前添加
    addNodeBefore: (materialType, targetId) => {
      set((state) => {
        const newNode = createNode(materialType)
        state.pageSchema.root = insertBefore(state.pageSchema.root, targetId, newNode)
        state.selectedNodeIds = [newNode.id]
      })
      addHistory(set)
    },

    // 在指定节点后添加
    addNodeAfter: (materialType, targetId) => {
      set((state) => {
        const newNode = createNode(materialType)
        state.pageSchema.root = insertAfter(state.pageSchema.root, targetId, newNode)
        state.selectedNodeIds = [newNode.id]
      })
      addHistory(set)
    },

    // 删除节点
    deleteNode: (nodeId) => {
      set((state) => {
        state.pageSchema.root = deleteNode(state.pageSchema.root, nodeId)
        state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== nodeId)
      })
      addHistory(set)
    },

    // 复制节点
    duplicateNode: (nodeId) => {
      set((state) => {
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
      set((state) => {
        state.pageSchema.root = updateNodeProps(state.pageSchema.root, nodeId, props)
      })
      addHistory(set)
    },

    // 更新节点样式
    updateNodeStyle: (nodeId, style) => {
      set((state) => {
        state.pageSchema.root = updateNodeStyle(state.pageSchema.root, nodeId, style)
      })
      addHistory(set)
    },

    // 切换节点显示/隐藏
    toggleNodeVisibility: (nodeId) => {
      set((state) => {
        const node = findNode(state.pageSchema.root, nodeId)
        if (node) {
          state.pageSchema.root = updateNodeProps(state.pageSchema.root, nodeId, {
            hidden: !node.hidden,
          })
        }
      })
      addHistory(set)
    },

    // 上移节点
    moveNodeUp: (nodeId) => {
      set((state) => {
        const parent = findParentNode(state.pageSchema.root, nodeId)
        if (!parent || !parent.children) return

        const index = parent.children.findIndex(c => c.id === nodeId)
        if (index > 0) {
          const newChildren = [...parent.children]
          ;[newChildren[index - 1], newChildren[index]] = [newChildren[index], newChildren[index - 1]]
          
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
    moveNodeDown: (nodeId) => {
      set((state) => {
        const parent = findParentNode(state.pageSchema.root, nodeId)
        if (!parent || !parent.children) return

        const index = parent.children.findIndex(c => c.id === nodeId)
        if (index < parent.children.length - 1) {
          const newChildren = [...parent.children]
          ;[newChildren[index], newChildren[index + 1]] = [newChildren[index + 1], newChildren[index]]
          
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
      set((state) => {
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

    // 选中节点
    selectNode: (nodeId, multiSelect = false) => {
      set((state) => {
        if (multiSelect) {
          if (state.selectedNodeIds.includes(nodeId)) {
            state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== nodeId)
          } else {
            state.selectedNodeIds.push(nodeId)
          }
        } else {
          state.selectedNodeIds = [nodeId]
        }
      })
    },

    // 清除选中
    clearSelection: () => {
      set((state) => {
        state.selectedNodeIds = []
      })
    },

    // 设置悬停节点
    setHoveredNode: (nodeId) => {
      set((state) => {
        state.hoveredNodeId = nodeId
      })
    },

    // 切换模式
    setMode: (mode) => {
      set((state) => {
        state.mode = mode
      })
    },

    // 更新画布配置
    updateCanvasConfig: (config) => {
      set((state) => {
        state.canvasConfig = { ...state.canvasConfig, ...config }
      })
    },

    // 撤销
    undo: () => {
      const state = get()
      if (state.canUndo()) {
        set((draft) => {
          draft.historyIndex -= 1
          draft.pageSchema = JSON.parse(JSON.stringify(draft.history[draft.historyIndex]))
        })
      }
    },

    // 重做
    redo: () => {
      const state = get()
      if (state.canRedo()) {
        set((draft) => {
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

    // 保存到本地存储
    saveToLocalStorage: () => {
      const state = get()
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.pageSchema))
        console.log('[EditorStore] 已保存到本地存储')
      } catch (error) {
        console.error('[EditorStore] 保存失败:', error)
      }
    },

    // 从本地存储加载
    loadFromLocalStorage: () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const schema = JSON.parse(saved)
          get().setPageSchema(schema)
          console.log('[EditorStore] 已从本地存储加载')
        }
      } catch (error) {
        console.error('[EditorStore] 加载失败:', error)
      }
    },
  }))
)
