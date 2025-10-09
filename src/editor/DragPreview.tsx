/**
 * 拖拽预览组件
 * 
 * 显示拖拽时的预览效果
 */

import React from 'react'
import { useDragLayer } from 'react-dnd'
import { DragItemTypes } from './DndProvider'

export const DragPreview: React.FC = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging || !currentOffset) {
    return null
  }

  const { x, y } = currentOffset

  let previewText = ''
  if (item?.type === DragItemTypes.MATERIAL) {
    previewText = '添加组件'
  } else if (item?.type === DragItemTypes.NODE) {
    previewText = '移动组件'
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
      <div
        style={{
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        {previewText}
      </div>
    </div>
  )
}

