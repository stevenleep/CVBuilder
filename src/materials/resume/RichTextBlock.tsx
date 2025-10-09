/**
 * 富文本块物料
 * 
 * 支持富文本编辑的通用内容块
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'

interface RichTextBlockProps {
  style?: React.CSSProperties
  content?: string
  align?: 'left' | 'center' | 'right' | 'justify'
}

const RichTextBlock: React.FC<RichTextBlockProps> = ({ 
  style,
  content = '在此输入富文本内容...',
  align = 'left',
}) => {
  const theme = useThemeConfig()
  
  return (
    <RichTextDisplay
      html={content}
      style={{
        fontSize: `${theme.font.bodySize.normal}px`,
        color: theme.color.text.secondary,
        lineHeight: theme.layout.lineHeight,
        textAlign: align,
        ...style,
      }}
    />
  )
}

export const RichTextBlockMaterial: IMaterialDefinition = {
  meta: {
    type: 'RichTextBlock',
    title: '富文本块',
    description: '支持格式化的文本内容',
    category: 'resume',
    tags: ['简历', '富文本', '内容'],
    version: '1.0.0',
  },
  component: RichTextBlock,
  propsSchema: [
    {
      name: 'content',
      label: '内容',
      type: 'richtext',
      defaultValue: '在此输入富文本内容...<br><br><strong>支持加粗</strong>、<em>斜体</em>、列表等格式。',
      required: true,
      group: '内容',
      minHeight: 150,
    },
    {
      name: 'align',
      label: '对齐方式',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
        { label: '两端对齐', value: 'justify' },
      ],
      group: '布局',
    },
  ],
  defaultProps: {
    content: '在此输入富文本内容...<br><br><strong>支持加粗</strong>、<em>斜体</em>、列表等格式。',
    align: 'left',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}

