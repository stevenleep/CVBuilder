/**
 * 应用入口组件
 */

import React, { useEffect, useMemo, useState } from 'react'
import { EditorLayout } from './editor/EditorLayout'
import { registerAllMaterials } from './materials'
import { useEditorStore } from './store/editorStore'
import { bootstrapEditor } from './core'
import { EditorProvider } from './core/context/EditorContext'
import { ThemeProvider } from './core/context/ThemeContext'
import { DndProvider } from './editor/DndProvider'

function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  
  // 初始化编辑器上下文（只初始化一次）
  const editorContext = useMemo(() => {
    const context = bootstrapEditor({
      debug: true,
      autoSaveInterval: 30000,
      maxHistorySize: 50,
      enablePlugins: true,
    })
    
    // 立即注册所有物料
    registerAllMaterials(context.materialRegistry)
    
    return context
  }, [])

  useEffect(() => {
    // 尝试从本地存储加载
    useEditorStore.getState().loadFromLocalStorage()
    
    setIsInitialized(true)
    console.log('[App] 应用初始化完成')
  }, [editorContext])
  
  if (!isInitialized) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        color: '#666',
      }}>
        正在加载编辑器...
      </div>
    )
  }

  return (
    <EditorProvider value={editorContext}>
      <ThemeProvider>
        <DndProvider>
          <EditorLayout />
        </DndProvider>
      </ThemeProvider>
    </EditorProvider>
  )
}

export default App
