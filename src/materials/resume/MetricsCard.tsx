/**
 * 数据/指标卡片
 *
 * 展示可量化的成就数据
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface MetricsCardProps {
  style?: React.CSSProperties
  metrics?: Array<{ value: string; label: string }>
  layout?: 'horizontal' | 'grid'
  columns?: number
  cardStyle?: 'filled' | 'outlined' | 'minimal'
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  style,
  metrics = [
    { value: '150%', label: '业绩增长' },
    { value: '50+', label: '项目交付' },
    { value: '10人', label: '团队规模' },
  ],
  layout = 'horizontal',
  columns = 3,
  cardStyle = 'filled',
}) => {
  const theme = useThemeConfig()
  const metricArray = Array.isArray(metrics) ? metrics : []

  return (
    <div
      style={{
        display: layout === 'horizontal' ? 'flex' : 'grid',
        gap: `${theme.spacing.paragraph}px`,
        gridTemplateColumns: layout === 'grid' ? `repeat(${columns}, 1fr)` : undefined,
        flexWrap: layout === 'horizontal' ? 'wrap' : undefined,
        marginBottom: `${theme.spacing.item}px`,
        ...style,
      }}
    >
      {metricArray.map((metric, index) => (
        <div
          key={index}
          style={{
            flex: layout === 'horizontal' ? 1 : undefined,
            minWidth: layout === 'horizontal' ? '100px' : undefined,
            padding:
              cardStyle === 'minimal'
                ? `${theme.spacing.paragraph - 2}px 0`
                : `${theme.spacing.paragraph}px ${theme.spacing.paragraph + 2}px`,
            backgroundColor:
              cardStyle === 'filled'
                ? theme.color.background.section
                : cardStyle === 'outlined'
                  ? 'transparent'
                  : 'transparent',
            border:
              cardStyle === 'outlined'
                ? `1px solid ${theme.color.border.normal}`
                : cardStyle === 'minimal'
                  ? 'none'
                  : 'none',
            borderRadius: cardStyle === 'minimal' ? '0' : '4px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: `${theme.font.titleSize.h2}px`,
              fontWeight: theme.font.weight.bold,
              color: theme.color.text.primary,
              marginBottom: `${theme.spacing.line - 1}px`,
              letterSpacing: '-0.02em',
            }}
          >
            {metric.value}
          </div>
          <div
            style={{
              fontSize: `${theme.font.bodySize.small}px`,
              color: theme.color.text.tertiary,
              fontWeight: theme.font.weight.normal,
            }}
          >
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export const MetricsCardMaterial: IMaterialDefinition = {
  meta: {
    type: 'MetricsCard',
    title: '数据指标',
    description: '展示可量化的成就',
    category: 'resume',
    subcategory: 'highlight',
    tags: ['简历', '数据', '成就'],
    version: '1.0.0',
  },
  component: MetricsCard,
  propsSchema: [
    {
      name: 'metrics',
      label: '指标数据',
      type: 'array',
      defaultValue: [
        { value: '150%', label: '业绩增长' },
        { value: '50+', label: '项目交付' },
        { value: '10人', label: '团队规模' },
      ],
      required: true,
      group: '内容',
      itemSchema: [
        {
          name: 'value',
          label: '数值',
          type: 'string',
          defaultValue: '',
          placeholder: '如：150%、50+',
        },
        {
          name: 'label',
          label: '标签',
          type: 'string',
          defaultValue: '',
          placeholder: '如：业绩增长、项目交付',
        },
      ],
    },
    {
      name: 'layout',
      label: '布局方式',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: '横向排列', value: 'horizontal' },
        { label: '网格布局', value: 'grid' },
      ],
      group: '布局',
    },
    {
      name: 'columns',
      label: '列数',
      type: 'number',
      defaultValue: 3,
      group: '布局',
      visibleWhen: (props: Record<string, any>) => props.layout === 'grid',
    },
    {
      name: 'cardStyle',
      label: '卡片样式',
      type: 'select',
      defaultValue: 'filled',
      options: [
        { label: '填充', value: 'filled' },
        { label: '边框', value: 'outlined' },
        { label: '极简', value: 'minimal' },
      ],
      group: '样式',
    },
  ],
  defaultProps: {
    metrics: [
      { value: '150%', label: '业绩增长' },
      { value: '50+', label: '项目交付' },
      { value: '10人', label: '团队规模' },
    ],
    layout: 'horizontal',
    columns: 3,
    cardStyle: 'filled',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
