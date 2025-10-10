/**
 * 语言能力物料（使用富文本）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'

interface LanguageSkillsProps {
  style?: React.CSSProperties
  content?: string
}

const LanguageSkills: React.FC<LanguageSkillsProps> = ({
  style,
  content = '<ul><li>英语 - 熟练</li><li>日语 - 良好</li><li>德语 - 入门</li></ul>',
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

export const LanguageSkillsMaterial: IMaterialDefinition = {
  meta: {
    type: 'LanguageSkills',
    title: '语言能力',
    description: '外语水平展示',
    category: 'resume',
    subcategory: 'skills',
    tags: ['简历', '语言', '技能'],
    version: '2.0.0',
  },
  component: LanguageSkills,
  propsSchema: [
    {
      name: 'content',
      label: '语言能力',
      type: 'richtext',
      defaultValue: '<ul><li>英语 - 熟练</li><li>日语 - 良好</li><li>德语 - 入门</li></ul>',
      description: '使用列表或自由格式',
      required: true,
      group: '内容',
      minHeight: 80,
    },
  ],
  defaultProps: {
    content: '<ul><li>英语 - 熟练</li><li>日语 - 良好</li><li>德语 - 入门</li></ul>',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
