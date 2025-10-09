/**
 * 标题物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface HeadingProps {
  style?: React.CSSProperties
  text?: string
  level?: '1' | '2' | '3'
  align?: 'left' | 'center' | 'right'
}

const Heading: React.FC<HeadingProps> = ({ 
  style,
  text = '标题文本',
  level = '2',
  align = 'left',
}) => {
  const theme = useThemeConfig()
  
  const fontSize = level === '1' 
    ? theme.font.titleSize.h1 
    : level === '2' 
    ? theme.font.titleSize.h2 
    : theme.font.titleSize.h3

  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return React.createElement(Tag, {
    style: {
      fontSize: `${fontSize}px`,
      fontWeight: theme.font.weight.bold,
      color: theme.color.text.primary,
      margin: 0,
      textAlign: align,
      ...style,
    }
  }, text)
}

export const HeadingMaterial: IMaterialDefinition = {
  meta: {
    type: 'Heading',
    title: '标题',
    description: '各级标题文本',
    category: 'base',
    tags: ['基础', '标题', '文本'],
    version: '1.0.0',
  },
  component: Heading,
  propsSchema: [
    {
      name: 'text',
      label: '标题内容',
      type: 'string',
      defaultValue: '标题文本',
      required: true,
      group: '内容',
    },
    {
      name: 'level',
      label: '标题级别',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: 'H1 - 一级标题', value: '1' },
        { label: 'H2 - 二级标题', value: '2' },
        { label: 'H3 - 三级标题', value: '3' },
      ],
      group: '样式',
    },
    {
      name: 'align',
      label: '对齐',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
      ],
      group: '样式',
    },
  ],
  defaultProps: {
    text: '标题文本',
    level: '2',
    align: 'left',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
  onDoubleClick: (context) => {
    const newText = prompt('编辑标题', context.props.text)
    if (newText !== null) {
      const api = context.getEditorAPI()
      api.updateNodeProps(context.nodeId, { text: newText })
    }
  },
}

