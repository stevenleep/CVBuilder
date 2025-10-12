/**
 * 可拖拽的物料项（优雅版）
 */

import React from 'react'
import { useDrag } from 'react-dnd'
import { DragItemTypes, MaterialDragItem } from './DndProvider'
import { GripVertical } from 'lucide-react'

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

  const handleMouseEnter = (e: React.MouseEvent) => {
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
          padding: '7px 8px',
          borderRadius: '5px',
          cursor: isDragging ? 'grabbing' : 'grab',
          backgroundColor: hover ? '#fff' : 'transparent',
          border: `1px solid ${hover ? '#e0e0e0' : 'transparent'}`,
          opacity: isDragging ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.12s',
          boxShadow: hover ? '0 2px 4px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        {/* 拖动手柄 */}
        <div
          style={{
            width: '12px',
            height: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hover ? '#666' : '#d0d0d0',
            flexShrink: 0,
            transition: 'color 0.12s',
          }}
        >
          <GripVertical size={11} strokeWidth={2.5} />
        </div>

        {/* 内容 - 简化版 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '11px',
              color: '#2d2d2d',
              fontWeight: '600',
              lineHeight: '1.2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
        </div>
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
      `}</style>
    </>
  )
}
