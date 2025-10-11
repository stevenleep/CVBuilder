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
          <>
            <div style={{
              position: 'absolute',
              inset: '-2px',
              border: '3px solid #3b82f6',
              borderRadius: '8px',
              pointerEvents: 'none',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              zIndex: 999,
              boxShadow: 'inset 0 0 0 1px rgba(59, 130, 246, 0.3), 0 0 12px rgba(59, 130, 246, 0.4)',
              animation: 'pulse-container 1.5s ease-in-out infinite',
            }} />
            {/* 中心提示标签 */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)',
              pointerEvents: 'none',
              zIndex: 1000,
            }}>
              ✚ 添加到容器
            </div>
            <style>
              {`
                @keyframes pulse-container {
                  0%, 100% {
                    opacity: 1;
                  }
                  50% {
                    opacity: 0.6;
                  }
                }
              `}
            </style>
          </>
        )}
      </div>
    )
  }

  // before/after 位置指示器
  if (showDropIndicator) {
    return (
      <div ref={drop} style={{ position: 'relative' }}>
        {/* 增强的插入位置指示器 */}
        <div style={{
          height: '4px',
          backgroundColor: '#3b82f6',
          margin: position === 'before' ? '-2px 0 -2px 0' : '-2px 0 -2px 0',
          borderRadius: '2px',
          position: 'relative',
          zIndex: 1000,
          boxShadow: '0 0 8px rgba(59, 130, 246, 0.6), 0 0 16px rgba(59, 130, 246, 0.3)',
          animation: 'pulse-drop-line 1.5s ease-in-out infinite',
        }}>
          {/* 左侧圆点 */}
          <div style={{
            position: 'absolute',
            left: '-4px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '10px',
            height: '10px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            border: '2px solid #fff',
            boxShadow: '0 2px 6px rgba(59, 130, 246, 0.5), 0 0 0 2px rgba(59, 130, 246, 0.2)',
          }} />
          {/* 右侧圆点 */}
          <div style={{
            position: 'absolute',
            right: '-4px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '10px',
            height: '10px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            border: '2px solid #fff',
            boxShadow: '0 2px 6px rgba(59, 130, 246, 0.5), 0 0 0 2px rgba(59, 130, 246, 0.2)',
          }} />
          {/* 中心提示标签 */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
            pointerEvents: 'none',
          }}>
            {position === 'before' ? '↑ 插入到这里' : '↓ 插入到这里'}
          </div>
        </div>
        {children}
        
        <style>
          {`
            @keyframes pulse-drop-line {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.7;
              }
            }
          `}
        </style>
      </div>
    )
  }

  return (
    <div ref={drop} style={{ minHeight: position === 'before' || position === 'after' ? '4px' : 'auto' }}>
      {children}
    </div>
  )
}

