/**
 * 编辑器上下文
 * 
 * 提供编辑器状态和操作的 React Context
 */

import React, { createContext, useContext, useCallback, useMemo } from 'react'
import type { 
  EditorState,
  EditorNode,
  WritableEditorNode,
  IStateManager,
  StateListener,
} from '@lcedit/core'

// ==================== 类型定义 ====================

/**
 * 编辑器操作
 */
export interface EditorActions {
  // 节点操作
  addNode: (node: EditorNode) => void
  updateNode: (nodeId: string, updates: Partial<EditorNode>) => void
  deleteNode: (nodeId: string) => void
  selectNodes: (nodeIds: string[]) => void
  clearSelection: () => void
  
  // 视图操作
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
  setMode: (mode: EditorState['mode']) => void
  
  // 剪贴板操作
  copy: () => void
  paste: () => void
  cut: () => void
}

/**
 * 编辑器上下文值
 */
export interface EditorContextValue {
  state: EditorState
  actions: EditorActions
  stateManager: IStateManager
}

// ==================== Context ====================

const EditorContext = createContext<EditorContextValue | null>(null)

// ==================== Provider ====================

export interface EditorProviderProps {
  stateManager: IStateManager
  initialState?: Partial<EditorState>
  children: React.ReactNode
}

export function EditorProvider({
  stateManager,
  initialState,
  children,
}: EditorProviderProps) {
  const [state, setState] = React.useState<EditorState>(() => {
    const current = stateManager.getState()
    return initialState ? { ...current, ...initialState } : current
  })
  
  // 订阅状态变化
  React.useEffect(() => {
    const listener: StateListener = (newState: EditorState) => {
      setState(newState)
    }
    
    const unsubscribe = stateManager.subscribe(listener)
    
    return () => {
      unsubscribe()
    }
  }, [stateManager])
  
  // 节点操作
  const addNode = useCallback((node: EditorNode) => {
    stateManager.setState((draft) => {
      draft.nodes[node.id] = node as WritableEditorNode
      
      // 如果没有父节点，添加到根节点列表
      if (!node.parentId) {
        if (!draft.rootIds.includes(node.id)) {
          draft.rootIds = [...draft.rootIds, node.id]
        }
      } else {
        // 添加到父节点的children列表
        const parent = draft.nodes[node.parentId]
        if (parent && !parent.children.includes(node.id)) {
          parent.children = [...parent.children, node.id]
        }
      }
    }, 'addNode')
  }, [stateManager])
  
  const updateNode = useCallback((nodeId: string, updates: Partial<EditorNode>) => {
    stateManager.setState((draft) => {
      const node = draft.nodes[nodeId]
      if (node) {
        draft.nodes[nodeId] = { ...node, ...updates } as WritableEditorNode
      }
    }, 'updateNode')
  }, [stateManager])
  
  const deleteNode = useCallback((nodeId: string) => {
    stateManager.setState((draft) => {
      const node = draft.nodes[nodeId]
      if (!node) return
      
      // 从父节点的children列表中移除
      if (node.parentId) {
        const parent = draft.nodes[node.parentId]
        if (parent) {
          parent.children = parent.children.filter(id => id !== nodeId)
        }
      } else {
        // 从根节点列表中移除
        draft.rootIds = draft.rootIds.filter(id => id !== nodeId)
      }
      
      // 删除节点
      delete draft.nodes[nodeId]
      
      // 从选中列表中移除
      draft.selectedIds = draft.selectedIds.filter(id => id !== nodeId)
    }, 'deleteNode')
  }, [stateManager])
  
  const selectNodes = useCallback((nodeIds: string[]) => {
    stateManager.setState((draft) => {
      draft.selectedIds = nodeIds
    }, 'selectNodes')
  }, [stateManager])
  
  const clearSelection = useCallback(() => {
    stateManager.setState((draft) => {
      draft.selectedIds = []
    }, 'clearSelection')
  }, [stateManager])
  
  // 视图操作
  const setZoom = useCallback((zoom: number) => {
    stateManager.setState((draft) => {
      draft.zoom = zoom
    }, 'setZoom')
  }, [stateManager])
  
  const setPan = useCallback((pan: { x: number; y: number }) => {
    stateManager.setState((draft) => {
      draft.pan = pan
    }, 'setPan')
  }, [stateManager])
  
  const setMode = useCallback((mode: EditorState['mode']) => {
    stateManager.setState((draft) => {
      draft.mode = mode
    }, 'setMode')
  }, [stateManager])
  
  // 剪贴板操作
  const copy = useCallback(() => {
    stateManager.setState((draft) => {
      const selectedNodes = draft.selectedIds
        .map(id => draft.nodes[id])
        .filter(Boolean)
      
      draft.clipboard = selectedNodes
    }, 'copy')
  }, [stateManager])
  
  const paste = useCallback(() => {
    const clipboard = state.clipboard
    if (!clipboard || clipboard.length === 0) return
    
    stateManager.setState((draft) => {
      const newNodeIds: string[] = []
      
      // 复制剪贴板中的节点
      clipboard.forEach(node => {
        const newId = `${node.id}-copy-${Date.now()}`
        const newNode: EditorNode = {
          ...node,
          id: newId,
          position: {
            x: node.position.x + 20,
            y: node.position.y + 20,
          },
        }
        
        draft.nodes[newId] = newNode as WritableEditorNode
        newNodeIds.push(newId)
        
        // 如果没有父节点，添加到根节点列表
        if (!newNode.parentId) {
          draft.rootIds = [...draft.rootIds, newId]
        }
      })
      
      // 选中新创建的节点
      draft.selectedIds = newNodeIds
    }, 'paste')
  }, [state.clipboard, stateManager])
  
  const cut = useCallback(() => {
    copy()
    state.selectedIds.forEach(nodeId => deleteNode(nodeId))
  }, [copy, deleteNode, state.selectedIds])
  
  // Actions
  const actions = useMemo<EditorActions>(() => ({
    addNode,
    updateNode,
    deleteNode,
    selectNodes,
    clearSelection,
    setZoom,
    setPan,
    setMode,
    copy,
    paste,
    cut,
  }), [
    addNode,
    updateNode,
    deleteNode,
    selectNodes,
    clearSelection,
    setZoom,
    setPan,
    setMode,
    copy,
    paste,
    cut,
  ])
  
  // Context Value
  const value = useMemo<EditorContextValue>(() => ({
    state,
    actions,
    stateManager,
  }), [state, actions, stateManager])
  
  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  )
}

// ==================== Hook ====================

/**
 * 使用编辑器上下文
 */
export function useEditorContext(): EditorContextValue {
  const context = useContext(EditorContext)
  
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider')
  }
  
  return context
}

/**
 * 使用编辑器状态
 */
export function useEditorState(): EditorState {
  return useEditorContext().state
}

/**
 * 使用编辑器操作
 */
export function useEditorActions(): EditorActions {
  return useEditorContext().actions
}

/**
 * 使用编辑器（状态 + 操作）
 */
export function useEditor() {
  const { state, actions } = useEditorContext()
  return { state, actions }
}

