/**
 * 智能拖放区域
 *
 * 根据鼠标在元素的上半部分还是下半部分，自动识别放置位置
 * 大大改善拖拽体验
 */

import React, { useState } from 'react'
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

interface SmartDropZoneProps {
  nodeId: string
  children: React.ReactNode
  /** 是否是容器元素（支持内部放置） */
  isContainer?: boolean
  /** 禁用before/after放置（只允许inside） */
  disableBeforeAfter?: boolean
}

export const SmartDropZone: React.FC<SmartDropZoneProps> = ({
  nodeId,
  children,
  isContainer = false,
  disableBeforeAfter = false,
}) => {
  const { addNode, addNodeBefore, addNodeAfter, moveNodeTo, addNodeFromSchema } = useEditorStore()
  const [dropElement, setDropElement] = useState<HTMLDivElement | null>(null)

  // 当前鼠标悬停的位置：'before' | 'after' | 'inside' | null
  const [hoverPosition, setHoverPosition] = useState<'before' | 'after' | 'inside' | null>(null)

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
      hover: (_item, monitor) => {
        if (!monitor.isOver({ shallow: true })) {
          setHoverPosition(null)
          return
        }

        const clientOffset = monitor.getClientOffset()
        if (!clientOffset || !dropElement) {
          return
        }

        const hoverBoundingRect = dropElement.getBoundingClientRect()
        const hoverHeight = hoverBoundingRect.bottom - hoverBoundingRect.top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        // 计算鼠标在元素中的相对位置（0-1）
        const hoverRatio = hoverClientY / hoverHeight

        if (disableBeforeAfter) {
          // 只允许内部放置
          setHoverPosition('inside')
        } else if (isContainer) {
          // 容器元素：上30%是before，下30%是after，中间40%是inside
          if (hoverRatio < 0.3) {
            setHoverPosition('before')
          } else if (hoverRatio > 0.7) {
            setHoverPosition('after')
          } else {
            setHoverPosition('inside')
          }
        } else {
          // 非容器元素：上50%是before，下50%是after
          if (hoverRatio < 0.5) {
            setHoverPosition('before')
          } else {
            setHoverPosition('after')
          }
        }
      },
      drop: (item, monitor) => {
        if (!monitor.isOver({ shallow: true }) || !hoverPosition) return

        const position = hoverPosition

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
        } else if (item.type === DragItemTypes.TEMPLATE) {
          const templateItem = item as TemplateDragItem
          // 添加模板（通常添加到容器内部）
          if (position === 'inside') {
            addNodeFromSchema(templateItem.templateSchema, nodeId)
          } else if (position === 'before') {
            // 模板也可以插入到before/after
            addNodeFromSchema(templateItem.templateSchema, nodeId)
          } else if (position === 'after') {
            addNodeFromSchema(templateItem.templateSchema, nodeId)
          }
        }

        setHoverPosition(null)
      },
      collect: monitor => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        dragItem: monitor.getItem() as DragItem | null,
      }),
    }),
    [
      nodeId,
      isContainer,
      disableBeforeAfter,
      hoverPosition,
      dropElement,
      addNode,
      addNodeBefore,
      addNodeAfter,
      moveNodeTo,
      addNodeFromSchema,
    ]
  )

  const showIndicator = isOver && canDrop && hoverPosition

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

  return (
    <div
      ref={el => {
        setDropElement(el)
        drop(el)
      }}
      style={{
        position: 'relative',
      }}
    >
      {children}

      {/* Before 指示器 */}
      {showIndicator && hoverPosition === 'before' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: designSystem.drag.dropZone.indicatorHeight,
            backgroundColor: dragColor.base,
            borderRadius: '2px',
            zIndex: 1000,
            boxShadow: `0 0 8px ${dragColor.shadow}, 0 0 16px ${dragColor.shadow}`,
            animation: 'pulse-drop-line 1.5s ease-in-out infinite',
            pointerEvents: 'none',
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
            }}
          >
            ↑ 插入到这里
          </div>
        </div>
      )}

      {/* After 指示器 */}
      {showIndicator && hoverPosition === 'after' && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: designSystem.drag.dropZone.indicatorHeight,
            backgroundColor: dragColor.base,
            borderRadius: '2px',
            zIndex: 1000,
            boxShadow: `0 0 8px ${dragColor.shadow}, 0 0 16px ${dragColor.shadow}`,
            animation: 'pulse-drop-line 1.5s ease-in-out infinite',
            pointerEvents: 'none',
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
            }}
          >
            ↓ 插入到这里
          </div>
        </div>
      )}

      {/* Inside 指示器（容器） */}
      {showIndicator && hoverPosition === 'inside' && (
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
        >
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
            }}
          >
            ✚ 添加到容器
          </div>
        </div>
      )}

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
    </div>
  )
}
