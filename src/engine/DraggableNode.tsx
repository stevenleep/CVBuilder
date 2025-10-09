/**
 * 可拖拽的节点包装器
 */

import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { DragItemTypes, DragItem, NodeDragItem } from '@/editor/DndProvider'

interface DraggableNodeProps {
  nodeId: string
  nodeType: string
  isEditMode: boolean
  children: React.ReactNode
  onMove?: (draggedId: string, targetId: string, position: 'before' | 'after' | 'inside') => void
  style?: React.CSSProperties
}

export const DraggableNode: React.FC<DraggableNodeProps> = ({
  nodeId,
  nodeType,
  isEditMode,
  children,
  onMove,
  style,
}) => {
  const [{ isDragging }, drag] = useDrag<NodeDragItem, void, { isDragging: boolean }>(() => ({
    type: DragItemTypes.NODE,
    item: { type: DragItemTypes.NODE, nodeId, nodeType },
    canDrag: () => isEditMode,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [nodeId, nodeType, isEditMode])

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: [DragItemTypes.MATERIAL, DragItemTypes.NODE],
    canDrop: () => isEditMode,
    drop: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) return
      
      // TODO: 处理拖放逻辑
      console.log('[DraggableNode] Drop:', item, 'on', nodeId)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }), [nodeId, isEditMode])

  const combinedRef = (el: HTMLDivElement | null) => {
    drag(el)
    drop(el)
  }

  return (
    <div
      ref={isEditMode ? combinedRef : null}
      style={{
        ...style,
        opacity: isDragging ? 0.4 : 1,
        ...(isOver && canDrop ? {
          outline: '2px dashed #000',
          outlineOffset: '2px',
        } : {}),
      }}
    >
      {children}
    </div>
  )
}

