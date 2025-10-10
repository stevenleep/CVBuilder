/**
 * 兴趣爱好物料（使用富文本）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'

interface InterestsHobbiesProps {
  style?: React.CSSProperties
  content?: string
}

const InterestsHobbies: React.FC<InterestsHobbiesProps> = ({
  style,
  content = '📚 阅读 · 🏃 跑步 · 📷 摄影 · 🎵 音乐',
}) => {
  const theme = useThemeConfig()

  return (
    <RichTextDisplay
      html={content}
      style={{
        fontSize: `${theme.font.bodySize.normal}px`,
        color: theme.color.text.secondary,
        lineHeight: theme.layout.lineHeight,
        ...style,
      }}
    />
  )
}

export const InterestsHobbiesMaterial: IMaterialDefinition = {
  meta: {
    type: 'InterestsHobbies',
    title: '兴趣爱好',
    description: '个人兴趣和爱好',
    category: 'resume',
    subcategory: 'content',
    tags: ['简历', '兴趣', '爱好'],
    version: '2.0.0',
  },
  component: InterestsHobbies,
  propsSchema: [
    {
      name: 'content',
      label: '兴趣爱好',
      type: 'richtext',
      defaultValue: '📚 阅读 · 🏃 跑步 · 📷 摄影 · 🎵 音乐',
      description: '自由编辑，可用列表或文本',
      required: true,
      group: '内容',
      minHeight: 60,
    },
  ],
  defaultProps: {
    content: '📚 阅读 · 🏃 跑步 · 📷 摄影 · 🎵 音乐',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
