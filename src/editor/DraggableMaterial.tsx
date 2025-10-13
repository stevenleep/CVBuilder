/**
 * 可拖拽的物料项（优雅版）
 */

import React from 'react'
import { useDrag } from 'react-dnd'
import { DragItemTypes, MaterialDragItem } from './DndProvider'
import { GripVertical } from 'lucide-react'
import { designSystem } from '@/styles/designSystem'

interface DraggableMaterialProps {
  materialType: string
  title: string
  description?: string
  onClick: () => void
}

export const DraggableMaterial: React.FC<DraggableMaterialProps> = ({
  materialType,
  title,
  description,
  onClick,
}) => {
  const [{ isDragging }, drag] = useDrag<MaterialDragItem, void, { isDragging: boolean }>(
    () => ({
      type: DragItemTypes.MATERIAL,
      item: { type: DragItemTypes.MATERIAL, materialType },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [materialType]
  )

  const [hover, setHover] = React.useState(false)
  const [tooltipPosition, setTooltipPosition] = React.useState<{ x: number; y: number } | null>(
    null
  )
  const cardRef = React.useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setHover(true)
    if (description && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: rect.right + 8,
        y: rect.top,
      })
    }
  }

  const handleMouseLeave = () => {
    setHover(false)
    setTooltipPosition(null)
  }

  return (
    <>
      <div
        ref={node => {
          drag(node)
          ;(cardRef as any).current = node
        }}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          padding: '10px 12px',
          borderRadius: designSystem.borderRadius.md,
          cursor: isDragging ? 'grabbing' : 'grab',
          backgroundColor: hover ? designSystem.colors.background.card : 'transparent',
          border: `0.5px dashed ${hover ? designSystem.colors.primary.base : 'transparent'}`,
          opacity: isDragging ? designSystem.drag.opacity.dragging : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: designSystem.animation.transition.smooth,
          boxShadow: hover ? designSystem.shadows.sm : 'none',
          transform: hover ? 'translateX(2px)' : 'translateX(0)',
        }}
      >
        {/* 拖动手柄 */}
        <div
          style={{
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hover ? '#666' : '#d0d0d0',
            flexShrink: 0,
            transition: 'color 0.15s',
          }}
        >
          <GripVertical size={14} strokeWidth={2.5} />
        </div>

        {/* 内容 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '12.5px',
              color: '#2d2d2d',
              fontWeight: '600',
              lineHeight: '1.4',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </div>
        </div>

        {/* Hover 指示器 */}
        {hover && (
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: designSystem.drag.colors.material.base,
              flexShrink: 0,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Tooltip提示框 */}
      {hover && description && tooltipPosition && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            maxWidth: '240px',
            padding: '10px 12px',
            backgroundColor: '#2d2d2d',
            color: '#fff',
            borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)',
            zIndex: 10000,
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* 标题 */}
          <div
            style={{
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '6px',
              color: '#fff',
              lineHeight: '1.3',
            }}
          >
            {title}
          </div>

          {/* 描述 */}
          <div
            style={{
              fontSize: '11px',
              lineHeight: '1.5',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {description}
          </div>

          {/* 提示 */}
          <div
            style={{
              fontSize: '10px',
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
              fontStyle: 'italic',
            }}
          >
            💡 点击添加 / 拖拽放置
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }
      `}</style>
    </>
  )
}
