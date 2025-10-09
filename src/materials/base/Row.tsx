/**
 * 行布局物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface RowProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  gap?: number
  align?: 'flex-start' | 'center' | 'flex-end' | 'baseline'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  wrap?: boolean
}

const Row: React.FC<RowProps> = ({ 
  children, 
  style,
  gap = 12,
  align = 'center',
  justify = 'flex-start',
  wrap = true,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: `${gap}px`,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export const RowMaterial: IMaterialDefinition = {
  meta: {
    type: 'Row',
    title: '行布局',
    description: '横向排列组件',
    category: 'base',
    isContainer: true,
    tags: ['基础', '布局', '行'],
    version: '1.0.0',
  },
  component: Row,
  propsSchema: [
    {
      name: 'gap',
      label: '间距',
      type: 'number',
      defaultValue: 12,
      group: '布局',
    },
    {
      name: 'align',
      label: '垂直对齐',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: '顶部', value: 'flex-start' },
        { label: '居中', value: 'center' },
        { label: '底部', value: 'flex-end' },
        { label: '基线', value: 'baseline' },
      ],
      group: '布局',
    },
    {
      name: 'justify',
      label: '水平对齐',
      type: 'select',
      defaultValue: 'flex-start',
      options: [
        { label: '左对齐', value: 'flex-start' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'flex-end' },
        { label: '两端对齐', value: 'space-between' },
        { label: '环绕对齐', value: 'space-around' },
      ],
      group: '布局',
    },
    {
      name: 'wrap',
      label: '自动换行',
      type: 'boolean',
      defaultValue: true,
      group: '布局',
    },
  ],
  defaultProps: {
    gap: 12,
    align: 'center',
    justify: 'flex-start',
    wrap: true,
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}

