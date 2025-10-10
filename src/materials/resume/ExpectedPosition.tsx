/**
 * 期望职位物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface ExpectedPositionProps {
  style?: React.CSSProperties
  position?: string
  industry?: string
  salary?: string
  location?: string
  jobType?: string
  arrivalTime?: string
}

const ExpectedPosition: React.FC<ExpectedPositionProps> = ({
  style,
  position = '前端工程师',
  industry = '互联网/电子商务',
  salary = '15K-25K',
  location = '北京',
  jobType = '全职',
  arrivalTime = '随时到岗',
}) => {
  const theme = useThemeConfig()

  const items = [
    { label: '期望职位', value: position },
    { label: '期望行业', value: industry },
    { label: '期望薪资', value: salary },
    { label: '工作地点', value: location },
    { label: '工作性质', value: jobType },
    { label: '到岗时间', value: arrivalTime },
  ].filter(item => item.value)

  return (
    <div
      style={{
        marginBottom: `${theme.spacing.item}px`,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: `${theme.spacing.line}px ${theme.spacing.paragraph}px`,
        ...style,
      }}
    >
      {items.map((item, index) => (
        <div key={index}>
          <span
            style={{
              fontSize: `${theme.font.bodySize.small}px`,
              color: theme.color.text.tertiary,
              marginRight: '6px',
            }}
          >
            {item.label}：
          </span>
          <span
            style={{
              fontSize: `${theme.font.bodySize.normal}px`,
              color: theme.color.text.primary,
              fontWeight: theme.font.weight.medium,
            }}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export const ExpectedPositionMaterial: IMaterialDefinition = {
  meta: {
    type: 'ExpectedPosition',
    title: '期望职位',
    description: '求职意向信息',
    category: 'resume',
    subcategory: 'info',
    tags: ['简历', '求职', '期望'],
    version: '1.0.0',
  },
  component: ExpectedPosition,
  propsSchema: [
    {
      name: 'position',
      label: '期望职位',
      type: 'string',
      defaultValue: '前端工程师',
      required: true,
      group: '内容',
    },
    {
      name: 'industry',
      label: '期望行业',
      type: 'string',
      defaultValue: '互联网/电子商务',
      group: '内容',
    },
    {
      name: 'salary',
      label: '期望薪资',
      type: 'string',
      defaultValue: '15K-25K',
      group: '内容',
    },
    {
      name: 'location',
      label: '工作地点',
      type: 'string',
      defaultValue: '北京',
      group: '内容',
    },
    {
      name: 'jobType',
      label: '工作性质',
      type: 'select',
      defaultValue: '全职',
      options: [
        { label: '全职', value: '全职' },
        { label: '兼职', value: '兼职' },
        { label: '实习', value: '实习' },
      ],
      group: '内容',
    },
    {
      name: 'arrivalTime',
      label: '到岗时间',
      type: 'select',
      defaultValue: '随时到岗',
      options: [
        { label: '随时到岗', value: '随时到岗' },
        { label: '一周内', value: '一周内' },
        { label: '两周内', value: '两周内' },
        { label: '一个月内', value: '一个月内' },
        { label: '需协商', value: '需协商' },
      ],
      group: '内容',
    },
  ],
  defaultProps: {
    position: '前端工程师',
    industry: '互联网/电子商务',
    salary: '15K-25K',
    location: '北京',
    jobType: '全职',
    arrivalTime: '随时到岗',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
