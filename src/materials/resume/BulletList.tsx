/**
 * 列表物料（使用富文本）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'

interface BulletListProps {
  style?: React.CSSProperties
  content?: string
}

const BulletList: React.FC<BulletListProps> = ({
  style,
  content = '<ul><li>第一项</li><li>第二项</li><li>第三项</li></ul>',
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

export const BulletListMaterial: IMaterialDefinition = {
  meta: {
    type: 'BulletList',
    title: '列表',
    description: '项目符号列表',
    category: 'resume',
    subcategory: 'content',
    tags: ['简历', '列表', '内容'],
    version: '2.0.0',
  },
  component: BulletList,
  propsSchema: [
    {
      name: 'content',
      label: '列表内容',
      type: 'richtext',
      defaultValue: '<ul><li>第一项</li><li>第二项</li><li>第三项</li></ul>',
      description: '使用工具栏创建列表',
      required: true,
      group: '内容',
      minHeight: 100,
    },
  ],
  defaultProps: {
    content: '<ul><li>第一项</li><li>第二项</li><li>第三项</li></ul>',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
