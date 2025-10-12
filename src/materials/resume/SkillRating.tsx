/**
 * 技能评级物料
 *
 * 带熟练度评级的技能展示
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface SkillRatingProps {
  style?: React.CSSProperties
  skills?: Array<{ name: string; level: number }>
  maxLevel?: number
  showDots?: boolean
  layout?: 'list' | 'grid'
  columns?: number
}

const SkillRating: React.FC<SkillRatingProps> = ({
  style,
  skills = [
    { name: 'React', level: 5 },
    { name: 'TypeScript', level: 4 },
    { name: 'Node.js', level: 4 },
    { name: 'Python', level: 3 },
  ],
  maxLevel = 5,
  showDots = true,
  layout = 'list',
  columns = 2,
}) => {
  const theme = useThemeConfig()
  const skillArray = Array.isArray(skills) ? skills : []

  return (
    <div
      style={{
        marginBottom: `${theme.spacing.item}px`,
        display: layout === 'grid' ? 'grid' : 'block',
        gridTemplateColumns: layout === 'grid' ? `repeat(${columns}, 1fr)` : undefined,
        gap: layout === 'grid' ? `${theme.spacing.paragraph}px` : undefined,
        ...style,
      }}
    >
      {skillArray.map((skill, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: layout === 'list' ? `${theme.spacing.line + 1}px` : '0',
            gap: '16px',
            padding: layout === 'grid' ? `${theme.spacing.line - 1}px 0` : '0',
          }}
        >
          <span
            style={{
              fontSize: `${theme.font.bodySize.normal}px`,
              color: theme.color.text.secondary,
              fontWeight: theme.font.weight.medium,
              letterSpacing: '-0.005em',
            }}
          >
            {skill.name}
          </span>

          {showDots && (
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              {Array.from({ length: maxLevel }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor:
                      i < skill.level ? theme.color.text.primary : theme.color.border.light,
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export const SkillRatingMaterial: IMaterialDefinition = {
  meta: {
    type: 'SkillRating',
    title: '技能评级',
    description: '带熟练度的技能展示',
    category: 'resume',
    subcategory: 'skills',
    tags: ['简历', '技能', '评级'],
    version: '1.0.0',
  },
  component: SkillRating,
  propsSchema: [
    {
      name: 'skills',
      label: '技能列表',
      type: 'array',
      defaultValue: [
        { name: 'React', level: 5 },
        { name: 'TypeScript', level: 4 },
        { name: 'Node.js', level: 4 },
        { name: 'Python', level: 3 },
      ],
      required: true,
      group: '内容',
      itemSchema: [
        {
          name: 'name',
          label: '技能名称',
          type: 'string',
          defaultValue: '',
          placeholder: '如：React、TypeScript',
        },
        {
          name: 'level',
          label: '熟练度',
          type: 'number',
          defaultValue: 3,
        },
      ],
    },
    {
      name: 'maxLevel',
      label: '最高等级',
      type: 'number',
      defaultValue: 5,
      group: '样式',
    },
    {
      name: 'showDots',
      label: '显示圆点',
      type: 'boolean',
      defaultValue: true,
      group: '样式',
    },
    {
      name: 'layout',
      label: '布局方式',
      type: 'select',
      defaultValue: 'list',
      options: [
        { label: '列表', value: 'list' },
        { label: '网格', value: 'grid' },
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
    skills: [
      { name: 'React', level: 5 },
      { name: 'TypeScript', level: 4 },
      { name: 'Node.js', level: 4 },
      { name: 'Python', level: 3 },
    ],
    maxLevel: 5,
    showDots: true,
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
