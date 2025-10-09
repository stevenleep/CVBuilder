/**
 * 空白间距物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'

interface SpacerProps {
  style?: React.CSSProperties
  height?: number
}

const Spacer: React.FC<SpacerProps> = ({ 
  style,
  height = 16,
}) => {
  return (
    <div
      style={{
        height: `${height}px`,
        ...style,
      }}
    />
  )
}

export const SpacerMaterial: IMaterialDefinition = {
  meta: {
    type: 'Spacer',
    title: '空白间距',
    description: '添加垂直间距',
    category: 'base',
    tags: ['基础', '间距', '空白'],
    version: '1.0.0',
  },
  component: Spacer,
  propsSchema: [
    {
      name: 'height',
      label: '高度(px)',
      type: 'number',
      defaultValue: 16,
      group: '样式',
    },
  ],
  defaultProps: {
    height: 16,
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}

