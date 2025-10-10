/**
 * 技能列表物料（使用富文本）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'

interface SkillListProps {
  style?: React.CSSProperties
  content?: string
}

const SkillList: React.FC<SkillListProps> = ({
  style,
  content = '<ul><li>React</li><li>TypeScript</li><li>Node.js</li><li>Python</li><li>Docker</li></ul>',
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

export const SkillListMaterial: IMaterialDefinition = {
  meta: {
    type: 'SkillList',
    title: '技能列表',
    description: '技能展示',
    category: 'resume',
    subcategory: 'skills',
    icon: '⚡',
    tags: ['简历', '技能'],
    version: '2.0.0',
  },
  component: SkillList,
  propsSchema: [
    {
      name: 'content',
      label: '技能内容',
      type: 'richtext',
      defaultValue:
        '<ul><li>React</li><li>TypeScript</li><li>Node.js</li><li>Python</li><li>Docker</li></ul>',
      description: '使用列表或自由格式',
      required: true,
      group: '内容',
      minHeight: 100,
    },
  ],
  defaultProps: {
    content:
      '<ul><li>React</li><li>TypeScript</li><li>Node.js</li><li>Python</li><li>Docker</li></ul>',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
