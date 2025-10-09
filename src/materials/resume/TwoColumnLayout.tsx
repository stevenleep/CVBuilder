/**
 * 两栏布局物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'

interface TwoColumnLayoutProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  leftWidth?: number
  gap?: number
  align?: 'top' | 'center' | 'bottom'
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({ 
  children, 
  style,
  leftWidth = 30,
  gap = 16,
  align = 'top',
}) => {
  const childArray = React.Children.toArray(children)
  const leftChild = childArray[0]
  const rightChild = childArray[1]
  
  const alignItems = align === 'center' ? 'center' : align === 'bottom' ? 'flex-end' : 'flex-start'
  
  return (
    <div
      style={{
        display: 'flex',
        gap: `${gap}px`,
        alignItems,
        ...style,
      }}
    >
      <div style={{ width: `${leftWidth}%`, flexShrink: 0 }}>
        {leftChild}
      </div>
      <div style={{ flex: 1 }}>
        {rightChild}
      </div>
    </div>
  )
}

export const TwoColumnLayoutMaterial: IMaterialDefinition = {
  meta: {
    type: 'TwoColumnLayout',
    title: '两栏布局',
    description: '左右两栏分栏布局',
    category: 'base',
    isContainer: true,
    tags: ['布局', '分栏'],
    version: '1.0.0',
  },
  component: TwoColumnLayout,
  propsSchema: [
    {
      name: 'leftWidth',
      label: '左侧宽度(%)',
      type: 'number',
      defaultValue: 30,
      group: '布局',
    },
    {
      name: 'gap',
      label: '间距',
      type: 'number',
      defaultValue: 16,
      group: '布局',
    },
    {
      name: 'align',
      label: '垂直对齐',
      type: 'select',
      defaultValue: 'top',
      options: [
        { label: '顶部', value: 'top' },
        { label: '居中', value: 'center' },
        { label: '底部', value: 'bottom' },
      ],
      group: '布局',
    },
  ],
  defaultProps: {
    leftWidth: 30,
    gap: 16,
    align: 'top',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
    minChildren: 0,
    maxChildren: 2,
  },
}

