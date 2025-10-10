/**
 * 自我评价物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'

interface SelfEvaluationProps {
  style?: React.CSSProperties
  content?: string
  title?: string
  showTitle?: boolean
}

const SelfEvaluation: React.FC<SelfEvaluationProps> = ({
  style,
  content = '',
  title = '自我评价',
  showTitle = true,
}) => {
  const theme = useThemeConfig()

  return (
    <div style={{ marginBottom: `${theme.spacing.item}px`, ...style }}>
      {showTitle && title && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            fontWeight: theme.font.weight.semibold,
            color: theme.color.text.primary,
            marginBottom: `${theme.spacing.line}px`,
          }}
        >
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

export const SelfEvaluationMaterial: IMaterialDefinition = {
  meta: {
    type: 'SelfEvaluation',
    title: '自我评价',
    description: '个性特点和优势总结',
    category: 'resume',
    subcategory: 'content',
    tags: ['简历', '自我评价'],
    version: '1.0.0',
  },
  component: SelfEvaluation,
  propsSchema: [
    {
      name: 'content',
      label: '评价内容',
      type: 'richtext',
      defaultValue:
        '<ul><li>工作认真负责，有强烈的责任心</li><li>善于沟通协作，团队意识强</li><li>学习能力强，能快速适应新环境</li></ul>',
      description: '支持富文本格式',
      required: true,
      group: '内容',
      minHeight: 100,
    },
    {
      name: 'title',
      label: '标题',
      type: 'string',
      defaultValue: '自我评价',
      group: '样式',
    },
    {
      name: 'showTitle',
      label: '显示标题',
      type: 'boolean',
      defaultValue: true,
      group: '样式',
    },
  ],
  defaultProps: {
    content:
      '<ul><li>工作认真负责，有强烈的责任心</li><li>善于沟通协作，团队意识强</li><li>学习能力强，能快速适应新环境</li></ul>',
    title: '自我评价',
    showTitle: true,
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
