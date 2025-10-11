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

  return (
    <div
      ref={drag}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '10px',
        borderRadius: '6px',
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: hover ? '#fff' : 'transparent',
        border: `1px solid ${hover ? '#e0e0e0' : 'transparent'}`,
        opacity: isDragging ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.12s',
        boxShadow: hover ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
      }}
    >
      {/* 拖动手柄 */}
      <div
        style={{
          width: '14px',
          height: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: hover ? '#666' : '#d0d0d0',
          flexShrink: 0,
          transition: 'color 0.12s',
        }}
      >
        <GripVertical size={12} strokeWidth={2.5} />
      </div>

      {/* 内容 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '12px',
            color: '#2d2d2d',
            fontWeight: '600',
            lineHeight: '1.3',
            marginBottom: description ? '2px' : '0',
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              fontSize: '11px',
              color: '#999',
              lineHeight: '1.2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  )
}
