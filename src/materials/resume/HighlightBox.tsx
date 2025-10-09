/**
 * 亮点/成就高亮框
 * 
 * 用于突出显示核心成就和亮点
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'

interface HighlightBoxProps {
  style?: React.CSSProperties
  title?: string
  content?: string
  icon?: string
  variant?: 'default' | 'bordered' | 'filled'
}

const HighlightBox: React.FC<HighlightBoxProps> = ({ 
  style,
  title = '核心亮点',
  content = '<ul><li>完成业绩目标150%</li><li>获得年度最佳员工奖</li></ul>',
  icon = '⭐',
  variant = 'default',
}) => {
  const theme = useThemeConfig()
  
  const variantStyles = {
    default: {
      backgroundColor: 'transparent',
      border: 'none',
      padding: 0,
    },
    bordered: {
      backgroundColor: 'transparent',
      border: `1px solid ${theme.color.border.normal}`,
      padding: `${theme.spacing.paragraph}px`,
      borderRadius: '4px',
    },
    filled: {
      backgroundColor: theme.color.background.section,
      border: 'none',
      padding: `${theme.spacing.paragraph}px`,
      borderRadius: '4px',
    },
  }
  
  return (
    <div style={{ 
      marginBottom: `${theme.spacing.item}px`,
      ...variantStyles[variant],
      ...style,
    }}>
      {title && (
        <div style={{
          fontSize: `${theme.font.bodySize.normal}px`,
          fontWeight: theme.font.weight.semibold,
          color: theme.color.text.primary,
          marginBottom: `${theme.spacing.line}px`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          {icon && <span>{icon}</span>}
          {title}
        </div>
      )}
      
      <RichTextDisplay
        html={content}
        style={{
          fontSize: `${theme.font.bodySize.normal}px`,
          color: theme.color.text.secondary,
          lineHeight: theme.layout.lineHeight,
        }}
      />
    </div>
  )
}

export const HighlightBoxMaterial: IMaterialDefinition = {
  meta: {
    type: 'HighlightBox',
    title: '亮点/成就',
    description: '突出显示核心成就',
    category: 'resume',
    tags: ['简历', '亮点', '成就'],
    version: '1.0.0',
  },
  component: HighlightBox,
  propsSchema: [
    {
      name: 'title',
      label: '标题',
      type: 'string',
      defaultValue: '核心亮点',
      group: '内容',
    },
    {
      name: 'content',
      label: '内容',
      type: 'richtext',
      defaultValue: '<ul><li>完成业绩目标150%</li><li>获得年度最佳员工奖</li></ul>',
      description: '支持富文本格式',
      required: true,
      group: '内容',
      minHeight: 100,
    },
    {
      name: 'icon',
      label: '图标',
      type: 'string',
      defaultValue: '⭐',
      group: '样式',
    },
    {
      name: 'variant',
      label: '样式变体',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: '默认', value: 'default' },
        { label: '边框', value: 'bordered' },
        { label: '填充', value: 'filled' },
      ],
      group: '样式',
    },
  ],
  defaultProps: {
    title: '核心亮点',
    content: '<ul><li>完成业绩目标150%</li><li>获得年度最佳员工奖</li></ul>',
    icon: '⭐',
    variant: 'default',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}

