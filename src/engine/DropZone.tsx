/**
 * 拖放区域
 * 
 * 接收物料拖放
 */

import React from 'react'
import { useDrop } from 'react-dnd'
import { DragItemTypes, DragItem, MaterialDragItem, NodeDragItem } from '@/editor/DndProvider'
import { useEditorStore } from '@store/editorStore'

interface DropZoneProps {
  nodeId: string
  position: 'before' | 'after' | 'inside'
  isContainer?: boolean
  children?: React.ReactNode
}

export const DropZone: React.FC<DropZoneProps> = ({
  nodeId,
  position,
  isContainer = false,
  children,
}) => {
  const { addNode, addNodeBefore, addNodeAfter, moveNodeTo } = useEditorStore()

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>(() => ({
    accept: [DragItemTypes.MATERIAL, DragItemTypes.NODE],
    canDrop: (item) => {
      // 不能拖到自己上
      if (item.type === DragItemTypes.NODE && (item as NodeDragItem).nodeId === nodeId) {
        return false
      }
      return true
    },
    drop: (item, monitor) => {
      if (!monitor.isOver({ shallow: true })) return

      if (item.type === DragItemTypes.MATERIAL) {
        const materialItem = item as MaterialDragItem
        
        // 根据位置添加节点
        if (position === 'inside') {
          addNode(materialItem.materialType, nodeId)
        } else if (position === 'before') {
          addNodeBefore(materialItem.materialType, nodeId)
        } else if (position === 'after') {
          addNodeAfter(materialItem.materialType, nodeId)
        }
      } else if (item.type === DragItemTypes.NODE) {
        const nodeItem = item as NodeDragItem
        // 移动节点
        moveNodeTo(nodeItem.nodeId, nodeId, position)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }), [nodeId, position, addNode, addNodeBefore, addNodeAfter, moveNodeTo])

  const showDropIndicator = isOver && canDrop

  if (position === 'inside' && isContainer) {
    return (
      <div ref={drop} style={{ position: 'relative', minHeight: '20px' }}>
        {children}
        {showDropIndicator && (
          <div style={{
            position: 'absolute',
            inset: '-2px',
            border: '2px solid #3b82f6',
            borderRadius: '6px',
            pointerEvents: 'none',
            backgroundColor: 'rgba(59, 130, 246, 0.06)',
            zIndex: 999,
            boxShadow: 'inset 0 0 0 1px rgba(59, 130, 246, 0.2)',
          }} />
        )}
      </div>
    )
  }

  // before/after 位置指示器
  if (showDropIndicator) {
    return (
      <div ref={drop} style={{ position: 'relative' }}>
        {/* 插入位置指示器 */}
        <div style={{
          height: '3px',
          backgroundColor: '#3b82f6',
          margin: position === 'before' ? '-1.5px 0 -1.5px 0' : '-1.5px 0 -1.5px 0',
          borderRadius: '1.5px',
          position: 'relative',
          zIndex: 1000,
          boxShadow: '0 0 4px rgba(59, 130, 246, 0.4)',
        }}>
          {/* 左侧圆点 */}
          <div style={{
            position: 'absolute',
            left: '-3px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '7px',
            height: '7px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            border: '1.5px solid #fff',
            boxShadow: '0 1px 3px rgba(59, 130, 246, 0.3)',
          }} />
          {/* 右侧圆点 */}
          <div style={{
            position: 'absolute',
            right: '-3px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '7px',
            height: '7px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            border: '1.5px solid #fff',
            boxShadow: '0 1px 3px rgba(59, 130, 246, 0.3)',
          }} />
        </div>
        {children}
      </div>
    )
  }

  return (
    <div ref={drop} style={{ minHeight: position === 'before' || position === 'after' ? '4px' : 'auto' }}>
      {children}
    </div>
  )
}

