/**
 * 标签徽章物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig, useStyleConfig } from '@/core/context/ThemeContext'

interface BadgeProps {
  style?: React.CSSProperties
  text?: string
  variant?: 'default' | 'outline' | 'solid'
}

const Badge: React.FC<BadgeProps> = ({ 
  style,
  text = '标签',
  variant = 'default',
}) => {
  const theme = useThemeConfig()
  const styleConfig = useStyleConfig()
  
  const variantStyles = {
    default: {
      backgroundColor: theme.color.background.section,
      color: theme.color.text.primary,
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.color.text.primary,
      border: `1px solid ${theme.color.border.normal}`,
    },
    solid: {
      backgroundColor: theme.color.text.primary,
      color: theme.color.background.page,
      border: 'none',
    },
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        fontSize: `${theme.font.bodySize.small}px`,
        fontWeight: theme.font.weight.medium,
        borderRadius: `${styleConfig.borderRadius}px`,
        ...variantStyles[variant],
        ...style,
      }}
    >
      {text}
    </span>
  )
}

export const BadgeMaterial: IMaterialDefinition = {
  meta: {
    type: 'Badge',
    title: '标签',
    description: '徽章标签',
    category: 'base',
    tags: ['基础', '标签', '徽章'],
    version: '1.0.0',
  },
  component: Badge,
  propsSchema: [
    {
      name: 'text',
      label: '文本',
      type: 'string',
      defaultValue: '标签',
      required: true,
      group: '内容',
    },
    {
      name: 'variant',
      label: '样式',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: '默认', value: 'default' },
        { label: '描边', value: 'outline' },
        { label: '实心', value: 'solid' },
      ],
      group: '样式',
    },
  ],
  defaultProps: {
    text: '标签',
    variant: 'default',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}

