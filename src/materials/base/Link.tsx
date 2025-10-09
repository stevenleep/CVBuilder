/**
 * 链接物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface LinkProps {
  style?: React.CSSProperties
  text?: string
  href?: string
  openInNew?: boolean
}

const Link: React.FC<LinkProps> = ({ 
  style,
  text = '链接文本',
  href = '',
  openInNew = true,
}) => {
  const theme = useThemeConfig()
  
  return (
    <a
      href={href || '#'}
      target={openInNew ? '_blank' : '_self'}
      rel={openInNew ? 'noopener noreferrer' : undefined}
      style={{
        fontSize: `${theme.font.bodySize.normal}px`,
        color: theme.color.text.link,
        textDecoration: 'underline',
        cursor: 'pointer',
        ...style,
      }}
    >
      {text}
    </a>
  )
}

export const LinkMaterial: IMaterialDefinition = {
  meta: {
    type: 'Link',
    title: '链接',
    description: '超链接',
    category: 'base',
    tags: ['基础', '链接'],
    version: '1.0.0',
  },
  component: Link,
  propsSchema: [
    {
      name: 'text',
      label: '链接文本',
      type: 'string',
      defaultValue: '链接文本',
      required: true,
      group: '内容',
    },
    {
      name: 'href',
      label: '链接地址',
      type: 'string',
      defaultValue: '',
      required: true,
      group: '内容',
    },
    {
      name: 'openInNew',
      label: '新窗口打开',
      type: 'boolean',
      defaultValue: true,
      group: '行为',
    },
  ],
  defaultProps: {
    text: '链接文本',
    href: '',
    openInNew: true,
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}

