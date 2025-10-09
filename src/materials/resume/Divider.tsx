/**
 * 分隔线物料（使用主题）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface DividerProps {
  style?: React.CSSProperties
  height?: number
}

const Divider: React.FC<DividerProps> = ({ 
  style,
  height = 1,
}) => {
  const theme = useThemeConfig()
  
  return (
    <div
      style={{
        height: `${height}px`,
        backgroundColor: theme.color.border.light,
        marginTop: `${theme.spacing.paragraph}px`,
        marginBottom: `${theme.spacing.paragraph}px`,
        ...style,
      }}
    />
  )
}

export const DividerMaterial: IMaterialDefinition = {
  meta: {
    type: 'Divider',
    title: '分隔线',
    description: '视觉分隔元素',
    category: 'base',
    tags: ['分隔线', '基础'],
    version: '1.0.0',
  },
  component: Divider,
  propsSchema: [
    {
      name: 'height',
      label: '粗细',
      type: 'number',
      defaultValue: 1,
      group: '样式',
    },
  ],
  defaultProps: {
    height: 1,
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
