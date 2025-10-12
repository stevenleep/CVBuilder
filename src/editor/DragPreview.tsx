/**
 * 拖拽预览组件
 *
 * 显示拖拽时的预览效果 - 增强版
 */

import React from 'react'
import { useDragLayer } from 'react-dnd'
import { DragItemTypes, MaterialDragItem, NodeDragItem, TemplateDragItem } from './DndProvider'
import { useMaterial } from '@/core'
import { GripVertical, Move, Layout } from 'lucide-react'

export const DragPreview: React.FC = () => {
  const { isDragging, item, currentOffset, itemType } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  // 获取物料类型 - 必须在顶层调用 Hook
  const materialType = React.useMemo(() => {
    if (!item) return ''
    if (itemType === DragItemTypes.MATERIAL) {
      return (item as MaterialDragItem).materialType
    }
    if (itemType === DragItemTypes.NODE) {
      return (item as NodeDragItem).nodeType
    }
    return ''
  }, [item, itemType])

  // Hook 必须在顶层调用，不能在条件中
  const materialDef = useMaterial(materialType)

  if (!isDragging || !currentOffset) {
    return null
  }

  const { x, y } = currentOffset

  let previewContent: React.ReactNode = null

  if (itemType === DragItemTypes.MATERIAL && item) {
    previewContent = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.6), 0 0 0 1px rgba(255,255,255,0.2)',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
        }}
      >
        <GripVertical size={16} style={{ opacity: 0.8 }} />
        <span>添加 {materialDef?.meta.title || '组件'}</span>
      </div>
    )
  } else if (itemType === DragItemTypes.NODE && item) {
    previewContent = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.6), 0 0 0 1px rgba(255,255,255,0.2)',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Move size={16} style={{ opacity: 0.8 }} />
        <span>移动 {materialDef?.meta.title || '组件'}</span>
      </div>
    )
  } else if (itemType === DragItemTypes.TEMPLATE && item) {
    const templateItem = item as TemplateDragItem
    previewContent = (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          backgroundColor: '#8b5cf6',
          color: 'white',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.6), 0 0 0 1px rgba(255,255,255,0.2)',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Layout size={16} style={{ opacity: 0.8 }} />
        <span>添加模板 {templateItem.templateName}</span>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        left: x,
        top: y,
        zIndex: 10000,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {previewContent}

      <style>
        {`
          @keyframes float-preview {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-4px);
            }
          }
        `}
      </style>
    </div>
  )
}
