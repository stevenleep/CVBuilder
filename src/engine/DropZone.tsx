/**
 * 拖放区域
 *
 * 接收物料拖放
 */

import React from 'react'
import { useDrop } from 'react-dnd'
import {
  DragItemTypes,
  DragItem,
  MaterialDragItem,
  NodeDragItem,
  TemplateDragItem,
} from '@/editor/DndProvider'
import { useEditorStore } from '@store/editorStore'
import { designSystem } from '@/styles/designSystem'

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
  const { addNode, addNodeBefore, addNodeAfter, moveNodeTo, addNodeFromSchema } = useEditorStore()

  const [{ isOver, canDrop, dragItem }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean; dragItem: DragItem | null }
  >(
    () => ({
      accept: [DragItemTypes.MATERIAL, DragItemTypes.NODE, DragItemTypes.TEMPLATE],
      canDrop: item => {
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
          moveNodeTo(nodeItem.nodeId, nodeId, position)
        } else if (item.type === DragItemTypes.TEMPLATE) {
          const templateItem = item as TemplateDragItem
          addNodeFromSchema(templateItem.templateSchema, nodeId)
        }
      },
      collect: monitor => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        dragItem: monitor.getItem() as DragItem | null,
      }),
    }),
    [nodeId, position, addNode, addNodeBefore, addNodeAfter, moveNodeTo, addNodeFromSchema]
  )

  const showDropIndicator = isOver && canDrop

  // 根据拖拽类型选择颜色
  const getDragColor = (item: DragItem | null) => {
    if (!item) return designSystem.drag.colors.material

    switch (item.type) {
      case DragItemTypes.MATERIAL:
        return designSystem.drag.colors.material
      case DragItemTypes.NODE:
        return designSystem.drag.colors.node
      case DragItemTypes.TEMPLATE:
        return designSystem.drag.colors.template
      default:
        return designSystem.drag.colors.material
    }
  }

  const dragColor = getDragColor(dragItem)

  if (position === 'inside' && isContainer) {
    return (
      <div
        ref={drop}
        style={{ position: 'relative', minHeight: designSystem.drag.dropZone.containerMinHeight }}
      >
        {children}
        {showDropIndicator && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: '-2px',
                border: `3px solid ${dragColor.border}`,
                borderRadius: '8px',
                pointerEvents: 'none',
                backgroundColor: dragColor.light,
                zIndex: 999,
                boxShadow: `inset 0 0 0 1px ${dragColor.border}40, 0 0 12px ${dragColor.shadow}`,
                animation: 'pulse-container 1.5s ease-in-out infinite',
              }}
            />
            {/* 中心提示标签 */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: dragColor.base,
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                boxShadow: `0 4px 12px ${dragColor.shadow}`,
                pointerEvents: 'none',
                zIndex: 1000,
              }}
            >
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
        <div
          style={{
            height: designSystem.drag.dropZone.indicatorHeight,
            backgroundColor: dragColor.base,
            margin: position === 'before' ? '-2px 0 -2px 0' : '-2px 0 -2px 0',
            borderRadius: '2px',
            position: 'relative',
            zIndex: 1000,
            boxShadow: `0 0 8px ${dragColor.shadow}, 0 0 16px ${dragColor.shadow}`,
            animation: 'pulse-drop-line 1.5s ease-in-out infinite',
          }}
        >
          {/* 左侧圆点 */}
          <div
            style={{
              position: 'absolute',
              left: '-4px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '10px',
              height: '10px',
              backgroundColor: dragColor.base,
              borderRadius: '50%',
              border: '2px solid #fff',
              boxShadow: `0 2px 6px ${dragColor.shadow}, 0 0 0 2px ${dragColor.light}`,
            }}
          />
          {/* 右侧圆点 */}
          <div
            style={{
              position: 'absolute',
              right: '-4px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '10px',
              height: '10px',
              backgroundColor: dragColor.base,
              borderRadius: '50%',
              border: '2px solid #fff',
              boxShadow: `0 2px 6px ${dragColor.shadow}, 0 0 0 2px ${dragColor.light}`,
            }}
          />
          {/* 中心提示标签 */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: dragColor.base,
              color: 'white',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              boxShadow: `0 2px 8px ${dragColor.shadow}`,
              pointerEvents: 'none',
            }}
          >
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
    <div
      ref={drop}
      style={{
        minHeight:
          position === 'before' || position === 'after'
            ? designSystem.drag.dropZone.triggerHeight
            : 'auto',
        display: position === 'before' || position === 'after' ? 'block' : undefined,
      }}
    >
      {children}
    </div>
  )
}
