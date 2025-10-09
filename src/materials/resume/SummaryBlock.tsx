/**
 * 个人总结物料（使用主题）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'

interface SummaryBlockProps {
  style?: React.CSSProperties
  content?: string
  showQuote?: boolean
}

const SummaryBlock: React.FC<SummaryBlockProps> = ({ 
  style,
  content = '在这里输入您的个人总结或自我评价...',
  showQuote = false,
}) => {
  const theme = useThemeConfig()
  
  return (
    <div
      style={{
        position: 'relative',
        paddingLeft: showQuote ? `${theme.spacing.paragraph}px` : '0',
        ...style,
      }}
    >
      {showQuote && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            backgroundColor: theme.color.border.light,
          }}
        />
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

export const SummaryBlockMaterial: IMaterialDefinition = {
  meta: {
    type: 'SummaryBlock',
    title: '个人总结',
    description: '自我评价或职业目标',
    category: 'resume',
    tags: ['简历', '总结', '评价'],
    version: '1.0.0',
  },
  component: SummaryBlock,
  propsSchema: [
    {
      name: 'content',
      label: '个人总结',
      type: 'richtext',
      defaultValue: '具有<strong>5年</strong>前端开发经验，擅长React生态和TypeScript。<ul><li>深入理解前端工程化和性能优化</li><li>良好的代码规范和团队协作能力</li><li>热爱技术，持续学习新技术</li></ul>',
      description: '支持加粗、列表等格式',
      required: true,
      group: '内容',
      minHeight: 120,
    },
    {
      name: 'showQuote',
      label: '显示引用线',
      type: 'boolean',
      defaultValue: false,
      group: '样式',
    },
  ],
  defaultProps: {
    content: '具有<strong>5年</strong>前端开发经验，擅长React生态和TypeScript。<ul><li>深入理解前端工程化和性能优化</li><li>良好的代码规范和团队协作能力</li><li>热爱技术，持续学习新技术</li></ul>',
    showQuote: false,
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
