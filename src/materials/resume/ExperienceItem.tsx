/**
 * 工作经历物料（完整版）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'

interface ExperienceItemProps {
  style?: React.CSSProperties
  // 公司信息
  company?: string
  industry?: string
  companySize?: string

  // 职位信息
  position?: string
  department?: string
  level?: string

  // 时间地点
  startDate?: string
  endDate?: string
  location?: string

  // 工作性质
  employmentType?: string
  workMode?: string

  // 岗位类型
  jobType?: 'tech' | 'business' | 'product' | 'design' | 'other'
  techStack?: string

  // 团队信息
  teamSize?: string
  reportTo?: string
  subordinates?: string

  // 薪资信息
  startSalary?: string
  endSalary?: string

  // 内容
  description?: string
  achievements?: string
  leaveReason?: string
}

const ExperienceItem: React.FC<ExperienceItemProps> = props => {
  const {
    style,
    company = '公司名称',
    industry = '',
    companySize = '',
    position = '职位名称',
    department = '',
    level = '',
    startDate = '2020.01',
    endDate = '2023.12',
    location = '北京',
    employmentType = '',
    workMode = '',
    jobType = 'tech',
    techStack = '',
    teamSize = '',
    reportTo = '',
    subordinates = '',
    startSalary = '',
    endSalary = '',
    description = '',
    achievements = '',
    leaveReason = '',
  } = props

  const theme = useThemeConfig()

  // 公司信息
  const companyInfo = [industry, companySize].filter(Boolean)

  // 职位详情
  const positionDetails = [
    department,
    level,
    employmentType,
    workMode,
    location,
    teamSize && `团队${teamSize}人`,
    subordinates && `下属${subordinates}人`,
  ].filter(Boolean)

  return (
    <div
      style={{
        marginBottom: `${theme.spacing.item}px`,
        ...style,
      }}
    >
      {/* 标题行 */}
      <div style={{ marginBottom: `${theme.spacing.line}px` }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '16px',
            marginBottom: '2px',
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
              {company}
            </span>
            {companyInfo.length > 0 && (
              <span
                style={{
                  fontSize: `${theme.font.bodySize.small}px`,
                  color: theme.color.text.tertiary,
                  marginLeft: `${theme.spacing.line + 4}px`,
                }}
              >
                · {companyInfo.join(' · ')}
              </span>
            )}
          </div>

          <span
            style={{
              fontSize: `${theme.font.bodySize.small}px`,
              color: theme.color.text.tertiary,
              whiteSpace: 'nowrap',
            }}
          >
            {startDate} - {endDate === 'present' ? '至今' : endDate}
          </span>
        </div>

        {/* 职位信息 */}
        <div
          style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            color: theme.color.text.secondary,
          }}
        >
          {position}
          {positionDetails.length > 0 && (
            <span style={{ color: theme.color.text.tertiary }}>
              {' · '}
              {positionDetails.join(' · ')}
            </span>
          )}
        </div>
      </div>

      {/* 汇报关系 */}
      {reportTo && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginBottom: `${theme.spacing.line}px`,
          }}
        >
          汇报对象：{reportTo}
        </div>
      )}

      {/* 技术栈 - 仅技术岗位 */}
      {jobType === 'tech' && techStack && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginBottom: `${theme.spacing.line}px`,
            fontStyle: 'italic',
          }}
        >
          技术栈：{techStack}
        </div>
      )}

      {/* 薪资信息 */}
      {(startSalary || endSalary) && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginBottom: `${theme.spacing.line}px`,
          }}
        >
          {startSalary && `入职薪资：${startSalary}`}
          {startSalary && endSalary && ' | '}
          {endSalary && `离职薪资：${endSalary}`}
        </div>
      )}

      {/* 工作内容 */}
      {description && (
        <RichTextDisplay
          html={description}
          style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            color: theme.color.text.secondary,
            lineHeight: theme.layout.lineHeight,
            marginBottom: achievements ? `${theme.spacing.line}px` : '0',
          }}
        />
      )}

      {/* 核心成就 */}
      {achievements && (
        <div
          style={{
            paddingLeft: `${theme.spacing.paragraph}px`,
            borderLeft: `3px solid ${theme.color.border.normal}`,
          }}
        >
          <div
            style={{
              fontSize: `${theme.font.bodySize.small}px`,
              fontWeight: theme.font.weight.semibold,
              color: theme.color.text.primary,
              marginBottom: `${theme.spacing.line - 2}px`,
            }}
          >
            核心成就
          </div>
          <RichTextDisplay
            html={achievements}
            style={{
              fontSize: `${theme.font.bodySize.normal}px`,
              color: theme.color.text.secondary,
              lineHeight: theme.layout.lineHeight,
            }}
          />
        </div>
      )}

      {/* 离职原因 */}
      {leaveReason && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginTop: `${theme.spacing.line}px`,
            fontStyle: 'italic',
          }}
        >
          离职原因：{leaveReason}
        </div>
      )}
    </div>
  )
}

export const ExperienceItemMaterial: IMaterialDefinition = {
  meta: {
    type: 'ExperienceItem',
    title: '工作经历',
    description: '完整的工作经历信息',
    category: 'resume',
    subcategory: 'items',
    tags: ['简历', '工作经历'],
    version: '2.0.0',
  },
  component: ExperienceItem,
  propsSchema: [
    // 公司信息
    {
      name: 'company',
      label: '公司名称',
      type: 'string',
      defaultValue: '公司名称',
      required: true,
      group: '基本信息',
    },
    {
      name: 'industry',
      label: '所属行业',
      type: 'string',
      defaultValue: '',
      description: '如：互联网/电子商务',
      group: '基本信息',
    },
    {
      name: 'companySize',
      label: '公司规模',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不显示', value: '' },
        { label: '0-20人', value: '0-20人' },
        { label: '20-99人', value: '20-99人' },
        { label: '100-499人', value: '100-499人' },
        { label: '500-999人', value: '500-999人' },
        { label: '1000-9999人', value: '1000-9999人' },
        { label: '10000人以上', value: '10000人以上' },
      ],
      group: '基本信息',
    },

    // 职位信息
    {
      name: 'position',
      label: '职位名称',
      type: 'string',
      defaultValue: '职位名称',
      required: true,
      group: '基本信息',
    },
    {
      name: 'department',
      label: '所属部门',
      type: 'string',
      defaultValue: '',
      group: '基本信息',
    },
    {
      name: 'level',
      label: '职级',
      type: 'string',
      defaultValue: '',
      description: '如：P7、M2',
      group: '基本信息',
    },
    {
      name: 'jobType',
      label: '岗位类型',
      type: 'select',
      defaultValue: 'tech',
      options: [
        { label: '技术岗', value: 'tech' },
        { label: '业务岗', value: 'business' },
        { label: '产品岗', value: 'product' },
        { label: '设计岗', value: 'design' },
        { label: '其他', value: 'other' },
      ],
      group: '基本信息',
    },

    // 时间地点
    {
      name: 'startDate',
      label: '入职时间',
      type: 'string',
      defaultValue: '2020.01',
      group: '基本信息',
    },
    {
      name: 'endDate',
      label: '离职时间',
      type: 'string',
      defaultValue: '2023.12',
      description: '填"present"表示至今',
      group: '基本信息',
    },
    {
      name: 'location',
      label: '工作地点',
      type: 'string',
      defaultValue: '北京',
      group: '基本信息',
    },

    // 工作性质
    {
      name: 'employmentType',
      label: '工作性质',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不显示', value: '' },
        { label: '全职', value: '全职' },
        { label: '兼职', value: '兼职' },
        { label: '实习', value: '实习' },
        { label: '外包', value: '外包' },
      ],
      group: '工作性质',
    },
    {
      name: 'workMode',
      label: '工作模式',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不显示', value: '' },
        { label: '现场办公', value: '现场' },
        { label: '远程办公', value: '远程' },
        { label: '混合办公', value: '混合' },
      ],
      group: '工作性质',
    },

    // 技术信息
    {
      name: 'techStack',
      label: '技术栈',
      type: 'string',
      defaultValue: 'React, TypeScript, Node.js',
      description: '仅技术岗显示',
      group: '技术信息',
      visibleWhen: props => props.jobType === 'tech',
    },

    // 团队信息
    {
      name: 'teamSize',
      label: '团队规模',
      type: 'string',
      defaultValue: '',
      description: '如：10',
      group: '详细信息',
    },
    {
      name: 'reportTo',
      label: '汇报对象',
      type: 'string',
      defaultValue: '',
      description: '如：技术总监',
      group: '详细信息',
    },
    {
      name: 'subordinates',
      label: '下属人数',
      type: 'string',
      defaultValue: '',
      group: '详细信息',
    },

    // 薪资信息
    {
      name: 'startSalary',
      label: '入职薪资',
      type: 'string',
      defaultValue: '',
      description: '如：15K',
      group: '薪资',
    },
    {
      name: 'endSalary',
      label: '离职薪资',
      type: 'string',
      defaultValue: '',
      description: '如：25K',
      group: '薪资',
    },

    // 工作内容
    {
      name: 'description',
      label: '工作内容',
      type: 'richtext',
      defaultValue:
        '<ul><li>负责前端架构设计和核心功能开发</li><li>优化系统性能，提升用户体验</li><li>带领团队完成多个重要项目交付</li></ul>',
      description: '日常工作职责',
      group: '内容',
      minHeight: 120,
    },
    {
      name: 'achievements',
      label: '核心成就',
      type: 'richtext',
      defaultValue: '',
      description: '可量化的业绩和亮点',
      group: '内容',
      minHeight: 80,
    },
    {
      name: 'leaveReason',
      label: '离职原因',
      type: 'string',
      defaultValue: '',
      description: '可选填写',
      group: '其他',
    },
  ],
  defaultProps: {
    company: '公司名称',
    industry: '',
    companySize: '',
    position: '职位名称',
    department: '',
    level: '',
    startDate: '2020.01',
    endDate: '2023.12',
    location: '北京',
    employmentType: '',
    workMode: '',
    jobType: 'tech',
    techStack: 'React, TypeScript, Node.js',
    teamSize: '',
    reportTo: '',
    subordinates: '',
    startSalary: '',
    endSalary: '',
    description:
      '<ul><li>负责前端架构设计和核心功能开发</li><li>优化系统性能，提升用户体验</li><li>带领团队完成多个重要项目交付</li></ul>',
    achievements: '',
    leaveReason: '',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
