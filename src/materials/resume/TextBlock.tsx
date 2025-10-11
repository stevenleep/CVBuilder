/**
 * 文本块物料（使用主题）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { notification } from '@/utils/notification'

interface TextBlockProps {
  style?: React.CSSProperties
  content?: string
  align?: 'left' | 'center' | 'right' | 'justify'
}

const TextBlock: React.FC<TextBlockProps> = ({
  style,
  content = '在此输入文本内容...',
  align = 'left',
}) => {
  const theme = useThemeConfig()

  return (
    <div
      style={{
        fontSize: `${theme.font.bodySize.normal}px`,
        fontWeight: theme.font.weight.normal,
        color: theme.color.text.secondary,
        textAlign: align,
        lineHeight: theme.layout.lineHeight,
        whiteSpace: 'pre-wrap',
        minHeight: '20px',
        ...style,
      }}
    >
      {content}
    </div>
  )
}

export const TextBlockMaterial: IMaterialDefinition = {
  meta: {
    type: 'TextBlock',
    title: '文本块',
    description: '自由文本内容区域',
    category: 'resume',
    subcategory: 'content',
    tags: ['简历', '文本', '内容'],
    version: '1.0.0',
  },
  component: TextBlock,
  propsSchema: [
    {
      name: 'content',
      label: '内容',
      type: 'textarea',
      defaultValue: '在此输入文本内容...',
      required: true,
      group: '内容',
      minHeight: 100,
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
    content: '在此输入文本内容...',
    align: 'left',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
  onDoubleClick: async context => {
    const newContent = await notification.prompt({
      title: '编辑文本',
      message: '请输入文本内容',
      defaultValue: context.props.content as string,
    })
    if (newContent !== null) {
      const api = context.getEditorAPI()
      api.updateNodeProps(context.nodeId, { content: newContent })
    }
  },
}
