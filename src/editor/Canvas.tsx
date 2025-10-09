/**
 * 画布组件
 * 
 * 核心编辑区域，负责渲染页面和处理交互
 */

import React from 'react'
import { Renderer } from '@engine/Renderer'
import { useEditorStore } from '@store/editorStore'
import clsx from 'clsx'

export const Canvas: React.FC = () => {
  const { 
    pageSchema, 
    selectedNodeIds,
    hoveredNodeId,
    mode,
    canvasConfig,
    selectNode,
    setHoveredNode,
    clearSelection,
  } = useEditorStore()

  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const isMultiSelect = event.metaKey || event.ctrlKey
    selectNode(nodeId, isMultiSelect)
  }

  const handleNodeHover = (nodeId: string | null) => {
    setHoveredNode(nodeId)
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    // 只有点击画布本身（而非子元素）时才取消选中
    if (e.target === e.currentTarget && selectedNodeIds.length > 0) {
      clearSelection()
    }
  }

  return (
    <div 
      className="canvas-container"
      style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#fafafa',
        padding: '40px 20px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}
      onClick={handleCanvasClick}
    >
      <div
        style={{
          transform: `scale(${canvasConfig.scale})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease',
          position: 'relative',
        }}
      >
        <Renderer
          schema={pageSchema.root}
          isEditMode={mode === 'edit'}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          selectedNodeIds={selectedNodeIds}
          hoveredNodeId={hoveredNodeId}
        />
      </div>
    </div>
  )
}

