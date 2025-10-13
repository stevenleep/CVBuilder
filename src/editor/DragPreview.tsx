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
import { designSystem } from '@/styles/designSystem'

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
          backgroundColor: designSystem.drag.colors.material.base,
          color: 'white',
          borderRadius: designSystem.borderRadius.lg,
          fontSize: designSystem.typography.fontSize.base,
          fontWeight: designSystem.typography.fontWeight.semibold,
          boxShadow: `0 8px 24px ${designSystem.drag.colors.material.shadow}, 0 0 0 1px rgba(255,255,255,0.2)`,
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
          backgroundColor: designSystem.drag.colors.node.base,
          color: 'white',
          borderRadius: designSystem.borderRadius.lg,
          fontSize: designSystem.typography.fontSize.base,
          fontWeight: designSystem.typography.fontWeight.semibold,
          boxShadow: `0 8px 24px ${designSystem.drag.colors.node.shadow}, 0 0 0 1px rgba(255,255,255,0.2)`,
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
          backgroundColor: designSystem.drag.colors.template.base,
          color: 'white',
          borderRadius: designSystem.borderRadius.lg,
          fontSize: designSystem.typography.fontSize.base,
          fontWeight: designSystem.typography.fontWeight.semibold,
          boxShadow: `0 8px 24px ${designSystem.drag.colors.template.shadow}, 0 0 0 1px rgba(255,255,255,0.2)`,
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
        zIndex: designSystem.zIndex.dragPreview,
        transform: 'translate(-50%, -50%)',
        opacity: designSystem.drag.opacity.preview,
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
