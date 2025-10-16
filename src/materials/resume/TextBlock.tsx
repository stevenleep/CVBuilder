/**
 * 文本块物料（使用主题）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { useViewport } from '@/core/context/ViewportContext'
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
  const { viewportMode } = useViewport()

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
        // 移动端样式调整 - 遵循主题间距设置
        ...(viewportMode === 'mobile' && {
          fontSize: `${theme.font.bodySize.normal * 0.9}px`,
          lineHeight: 1.4,
          marginTop: `${theme.spacing.paragraph}px`,
          marginBottom: `${theme.spacing.paragraph}px`,
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          maxWidth: '100%',
        }),
        ...style,
      }}
    >
      {content}
    </div>
  )
}

// 移动端专用文本块组件
const MobileTextBlock: React.FC<TextBlockProps> = ({
  style,
  content = '在此输入文本内容...',
  align = 'left',
}) => {
  const theme = useThemeConfig()

  return (
    <div
      style={{
        fontSize: `${theme.font.bodySize.normal * 0.85}px`,
        fontWeight: theme.font.weight.normal,
        color: theme.color.text.secondary,
        textAlign: align,
        lineHeight: 1.4,
        whiteSpace: 'pre-wrap',
        minHeight: '18px',
        marginTop: `${theme.spacing.paragraph}px`,
        marginBottom: `${theme.spacing.paragraph}px`,
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        maxWidth: '100%',
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
  mobileComponent: MobileTextBlock,
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
  mobileDefaultStyle: {
    fontSize: '14px',
    lineHeight: 1.4,
    marginTop: '7px',
    marginBottom: '7px',
    maxWidth: '100%',
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
