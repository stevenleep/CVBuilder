/**
 * 编辑器布局
 * 
 * 整合所有编辑器组件，支持面板宽度调整
 */

import React from 'react'
import { Toolbar } from './Toolbar'
import { MaterialPanel } from './MaterialPanel'
import { Canvas } from './Canvas'
import { PropertyPanel } from './PropertyPanel'
import { ResizablePanel } from './ResizablePanel'
import { DragPreview } from './DragPreview'
import { useKeyboardShortcuts } from '@/core/hooks/useKeyboardShortcuts'

export const EditorLayout: React.FC = () => {
  // 启用键盘快捷键
  useKeyboardShortcuts()

  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* 顶部工具栏 */}
      <Toolbar />
      
      {/* 主要内容区 */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* 左侧物料面板（可调整宽度） */}
        <ResizablePanel 
          side="left" 
          defaultWidth={280}
          minWidth={252}
          maxWidth={400}
        >
          <MaterialPanel />
        </ResizablePanel>
        
        {/* 中间画布 */}
        <Canvas />
        
        {/* 右侧属性面板（可调整宽度） */}
        <ResizablePanel 
          side="right" 
          defaultWidth={320}
          minWidth={280}
          maxWidth={450}
        >
          <PropertyPanel />
        </ResizablePanel>
      </div>
      
      {/* 拖拽预览 */}
      <DragPreview />
    </div>
  )
}

