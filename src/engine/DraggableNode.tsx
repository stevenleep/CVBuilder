/**
 * 可拖拽的节点包装器
 */

import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { DragItemTypes, DragItem, NodeDragItem } from '@/editor/DndProvider'
import { designSystem } from '@/styles/designSystem'

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
  style,
}) => {
  const [{ isDragging }, drag] = useDrag<NodeDragItem, void, { isDragging: boolean }>(
    () => ({
      type: DragItemTypes.NODE,
      item: { type: DragItemTypes.NODE, nodeId, nodeType },
      canDrag: () => isEditMode,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [nodeId, nodeType, isEditMode]
  )

  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >(
    () => ({
      accept: [DragItemTypes.MATERIAL, DragItemTypes.NODE],
      canDrop: () => isEditMode,
      drop: (_item, monitor) => {
        if (!monitor.isOver({ shallow: true })) return

        // TODO: 处理拖放逻辑
      },
      collect: monitor => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }),
    [nodeId, isEditMode]
  )

  const combinedRef = (el: HTMLDivElement | null) => {
    drag(el)
    drop(el)
  }

  return (
    <div
      ref={isEditMode ? combinedRef : null}
      style={{
        ...style,
        opacity: isDragging ? designSystem.drag.opacity.dragging : 1,
        transform: isDragging ? 'scale(0.98)' : 'scale(1)',
        transition: isDragging ? 'none' : designSystem.animation.transition.normal,
        cursor: isEditMode ? 'move' : 'default',
        willChange: isDragging ? 'transform, opacity' : 'auto',
        ...(isOver && canDrop
          ? {
              outline: `2px dashed ${designSystem.drag.colors.node.border}`,
              outlineOffset: '2px',
              backgroundColor: designSystem.drag.colors.node.light,
            }
          : {}),
        ...(isDragging
          ? {
              pointerEvents: 'none',
            }
          : {}),
      }}
    >
      {children}
      {isDragging && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: designSystem.borderRadius.md,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <div
            style={{
              backgroundColor: designSystem.drag.colors.node.base,
              color: 'white',
              padding: '8px 16px',
              borderRadius: designSystem.borderRadius.md,
              fontSize: designSystem.typography.fontSize.sm,
              fontWeight: designSystem.typography.fontWeight.semibold,
              boxShadow: `0 4px 12px ${designSystem.drag.colors.node.shadow}`,
            }}
          >
            拖拽中...
          </div>
        </div>
      )}
    </div>
  )
}
