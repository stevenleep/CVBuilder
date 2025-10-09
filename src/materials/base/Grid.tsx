/**
 * 网格布局物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'

interface GridProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  columns?: number
  gap?: number
}

const Grid: React.FC<GridProps> = ({ 
  children, 
  style,
  columns = 2,
  gap = 12,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export const GridMaterial: IMaterialDefinition = {
  meta: {
    type: 'Grid',
    title: '网格布局',
    description: '网格排列组件',
    category: 'base',
    isContainer: true,
    tags: ['基础', '布局', '网格'],
    version: '1.0.0',
  },
  component: Grid,
  propsSchema: [
    {
      name: 'columns',
      label: '列数',
      type: 'number',
      defaultValue: 2,
      group: '布局',
    },
    {
      name: 'gap',
      label: '间距',
      type: 'number',
      defaultValue: 12,
      group: '布局',
    },
  ],
  defaultProps: {
    columns: 2,
    gap: 12,
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}

