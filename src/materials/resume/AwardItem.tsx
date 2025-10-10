/**
 * 获奖荣誉物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface AwardItemProps {
  style?: React.CSSProperties
  title?: string
  issuer?: string
  date?: string
  description?: string
}

const AwardItem: React.FC<AwardItemProps> = ({
  style,
  title = '奖项名称',
  issuer = '颁发机构',
  date = '2023.12',
  description = '',
}) => {
  const theme = useThemeConfig()

  return (
    <div
      style={{
        marginBottom: `${theme.spacing.item - 2}px`,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '16px',
          marginBottom: description ? `${theme.spacing.line - 2}px` : '0',
        }}
      >
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontSize: `${theme.font.titleSize.h3}px`,
              fontWeight: theme.font.weight.semibold,
              color: theme.color.text.primary,
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: `${theme.font.bodySize.normal}px`,
              color: theme.color.text.secondary,
              marginLeft: `${theme.spacing.line + 4}px`,
            }}
          >
            · {issuer}
          </span>
        </div>

        <span
          style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            whiteSpace: 'nowrap',
          }}
        >
          {date}
        </span>
      </div>

      {description && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            color: theme.color.text.secondary,
            lineHeight: theme.layout.lineHeight,
          }}
        >
          {description}
        </div>
      )}
    </div>
  )
}

export const AwardItemMaterial: IMaterialDefinition = {
  meta: {
    type: 'AwardItem',
    title: '获奖荣誉',
    description: '奖项和荣誉展示',
    category: 'resume',
    subcategory: 'items',
    tags: ['简历', '奖项', '荣誉'],
    version: '1.0.0',
  },
  component: AwardItem,
  propsSchema: [
    {
      name: 'title',
      label: '奖项名称',
      type: 'string',
      defaultValue: '奖项名称',
      required: true,
      group: '内容',
    },
    {
      name: 'issuer',
      label: '颁发机构',
      type: 'string',
      defaultValue: '颁发机构',
      required: true,
      group: '内容',
    },
    {
      name: 'date',
      label: '获奖时间',
      type: 'string',
      defaultValue: '2023.12',
      group: '内容',
    },
    {
      name: 'description',
      label: '奖项说明',
      type: 'textarea',
      defaultValue: '',
      group: '内容',
    },
  ],
  defaultProps: {
    title: '奖项名称',
    issuer: '颁发机构',
    date: '2023.12',
    description: '',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
