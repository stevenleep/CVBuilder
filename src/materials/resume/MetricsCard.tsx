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
  metrics?: string
  layout?: 'horizontal' | 'vertical'
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  style,
  metrics = '150%,业绩增长|50+,项目交付|10人,团队规模',
  layout = 'horizontal',
}) => {
  const theme = useThemeConfig()
  const metricArray = metrics.split('|').map(m => {
    const [value, label] = m.split(',').map(s => s.trim())
    return { value, label }
  }).filter(m => m.value && m.label)
  
  return (
    <div
      style={{
        display: layout === 'horizontal' ? 'flex' : 'grid',
        gap: `${theme.spacing.paragraph}px`,
        gridTemplateColumns: layout === 'vertical' ? 'repeat(auto-fit, minmax(120px, 1fr))' : undefined,
        marginBottom: `${theme.spacing.item}px`,
        ...style,
      }}
    >
      {metricArray.map((metric, index) => (
        <div
          key={index}
          style={{
            flex: layout === 'horizontal' ? 1 : undefined,
            padding: `${theme.spacing.line}px ${theme.spacing.paragraph}px`,
            backgroundColor: theme.color.background.section,
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontSize: `${theme.font.titleSize.h3}px`,
            fontWeight: theme.font.weight.bold,
            color: theme.color.text.primary,
            marginBottom: '2px',
          }}>
            {metric.value}
          </div>
          <div style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
          }}>
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
    tags: ['简历', '数据', '成就'],
    version: '1.0.0',
  },
  component: MetricsCard,
  propsSchema: [
    {
      name: 'metrics',
      label: '指标数据',
      type: 'textarea',
      defaultValue: '150%,业绩增长|50+,项目交付|10人,团队规模',
      description: '格式：数值,标签|数值,标签',
      required: true,
      group: '内容',
    },
    {
      name: 'layout',
      label: '布局方式',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: '横向排列', value: 'horizontal' },
        { label: '纵向网格', value: 'vertical' },
      ],
      group: '布局',
    },
  ],
  defaultProps: {
    metrics: '150%,业绩增长|50+,项目交付|10人,团队规模',
    layout: 'horizontal',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}

