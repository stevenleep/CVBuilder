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
        minHeight: '44px',
        padding: '10px 12px',
        borderRadius: '6px',
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: '#fff',
        border: `1px solid ${hover ? '#e0e0e0' : '#f0f0f0'}`,
        opacity: isDragging ? 0.4 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        boxShadow: hover
          ? '0 2px 6px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03)'
          : '0 1px 2px rgba(0,0,0,0.03)',
        transform: hover && !isDragging ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {/* 左侧装饰条 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '8px',
          bottom: '8px',
          width: '3px',
          backgroundColor: hover ? '#666' : 'transparent',
          borderRadius: '0 2px 2px 0',
          transition: 'all 0.15s',
        }}
      />

      {/* 拖动手柄 */}
      <div
        style={{
          width: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: hover ? '#666' : '#d0d0d0',
          flexShrink: 0,
          transition: 'color 0.15s',
          marginLeft: '4px',
        }}
      >
        <GripVertical size={16} strokeWidth={2} />
      </div>

      {/* 内容 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '13px',
            color: '#000',
            fontWeight: '600',
            lineHeight: '1.3',
            marginBottom: description ? '3px' : '0',
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              fontSize: '11px',
              color: '#999',
              lineHeight: '1.4',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* 操作提示 */}
      <div
        style={{
          fontSize: '10px',
          color: hover ? '#999' : 'transparent',
          fontWeight: '500',
          transition: 'color 0.15s',
          flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {hover && !isDragging && '拖拽或点击'}
      </div>
    </div>
  )
}
