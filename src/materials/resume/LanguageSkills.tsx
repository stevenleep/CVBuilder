/**
 * 语言能力物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface LanguageSkillsProps {
  style?: React.CSSProperties
  languages?: Array<{ language: string; level: string }>
  layout?: 'list' | 'grid' | 'inline'
  columns?: number
}

const LanguageSkills: React.FC<LanguageSkillsProps> = ({
  style,
  languages = [
    { language: '英语', level: '熟练' },
    { language: '日语', level: '良好' },
    { language: '德语', level: '入门' },
  ],
  layout = 'list',
  columns = 2,
}) => {
  const theme = useThemeConfig()
  const languageArray = Array.isArray(languages) ? languages : []

  return (
    <div
      style={{
        marginBottom: `${theme.spacing.item}px`,
        display: layout === 'grid' ? 'grid' : layout === 'inline' ? 'flex' : 'block',
        gridTemplateColumns: layout === 'grid' ? `repeat(${columns}, 1fr)` : undefined,
        gap:
          layout === 'grid'
            ? `${theme.spacing.paragraph}px`
            : layout === 'inline'
              ? `${theme.spacing.paragraph}px`
              : undefined,
        flexWrap: layout === 'inline' ? 'wrap' : undefined,
        ...style,
      }}
    >
      {languageArray.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: layout === 'inline' ? '6px' : '10px',
            marginBottom: layout === 'list' ? `${theme.spacing.line + 1}px` : '0',
            fontSize: `${theme.font.bodySize.normal}px`,
            color: theme.color.text.secondary,
            lineHeight: theme.layout.lineHeight,
            padding:
              layout === 'inline'
                ? `${theme.spacing.line - 1}px ${theme.spacing.paragraph}px`
                : layout === 'grid'
                  ? `${theme.spacing.line - 1}px 0`
                  : '0',
            backgroundColor: layout === 'inline' ? theme.color.background.section : 'transparent',
            borderRadius: layout === 'inline' ? '4px' : '0',
          }}
        >
          <span
            style={{
              fontWeight: theme.font.weight.medium,
              letterSpacing: '-0.005em',
            }}
          >
            {item.language}
          </span>
          <span
            style={{
              color: theme.color.text.tertiary,
              fontSize: layout === 'inline' ? '10px' : '11px',
            }}
          >
            {layout === 'inline' ? '·' : '-'}
          </span>
          <span
            style={{
              color: theme.color.text.tertiary,
              fontSize: `${theme.font.bodySize.small}px`,
            }}
          >
            {item.level}
          </span>
        </div>
      ))}
    </div>
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
      name: 'languages',
      label: '语言列表',
      type: 'array',
      defaultValue: [
        { language: '英语', level: '熟练' },
        { language: '日语', level: '良好' },
        { language: '德语', level: '入门' },
      ],
      required: true,
      group: '内容',
      itemSchema: [
        {
          name: 'language',
          label: '语言',
          type: 'string',
          defaultValue: '',
          placeholder: '如：英语、日语',
        },
        {
          name: 'level',
          label: '水平',
          type: 'select',
          defaultValue: '良好',
          options: [
            { label: '母语', value: '母语' },
            { label: '精通', value: '精通' },
            { label: '熟练', value: '熟练' },
            { label: '良好', value: '良好' },
            { label: '一般', value: '一般' },
            { label: '入门', value: '入门' },
          ],
        },
      ],
    },
    {
      name: 'layout',
      label: '布局方式',
      type: 'select',
      defaultValue: 'list',
      options: [
        { label: '列表', value: 'list' },
        { label: '网格', value: 'grid' },
        { label: '内联标签', value: 'inline' },
      ],
      group: '布局',
    },
    {
      name: 'columns',
      label: '列数',
      type: 'number',
      defaultValue: 2,
      group: '布局',
      visibleWhen: (props: Record<string, any>) => props.layout === 'grid',
    },
  ],
  defaultProps: {
    languages: [
      { language: '英语', level: '熟练' },
      { language: '日语', level: '良好' },
      { language: '德语', level: '入门' },
    ],
    layout: 'list',
    columns: 2,
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
