/**
 * 教育经历物料（完整版）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'

interface EducationItemProps {
  style?: React.CSSProperties
  // 学校信息
  school?: string
  schoolType?: string
  schoolLocation?: string

  // 专业信息
  major?: string
  degree?: string
  majorType?: string

  // 时间
  startDate?: string
  endDate?: string

  // 成绩信息
  gpa?: string
  gpaScale?: string
  rank?: string

  // 课程与论文
  courses?: string
  thesis?: string
  thesisAdvisor?: string

  // 荣誉成就
  achievements?: string
  scholarships?: string

  // 其他
  eduType?: string
  transferInfo?: string
}

const EducationItem: React.FC<EducationItemProps> = props => {
  const {
    style,
    school = '大学名称',
    schoolType = '',
    schoolLocation = '',
    major = '专业名称',
    degree = '本科',
    majorType = '',
    startDate = '2016.09',
    endDate = '2020.06',
    gpa = '',
    gpaScale = '',
    rank = '',
    courses = '',
    thesis = '',
    thesisAdvisor = '',
    achievements = '',
    scholarships = '',
    eduType = '',
    transferInfo = '',
  } = props

  const theme = useThemeConfig()

  // 学校详情
  const schoolDetails = [schoolType, schoolLocation, eduType].filter(Boolean)

  // 专业详情
  const majorDetails = [
    degree,
    majorType,
    gpa && `GPA ${gpa}${gpaScale ? `/${gpaScale}` : ''}`,
    rank,
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
              {school}
            </span>
            {schoolDetails.length > 0 && (
              <span
                style={{
                  fontSize: `${theme.font.bodySize.small}px`,
                  color: theme.color.text.tertiary,
                  marginLeft: `${theme.spacing.line + 4}px`,
                }}
              >
                · {schoolDetails.join(' · ')}
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
            {startDate} - {endDate}
          </span>
        </div>

        {/* 专业信息 */}
        <div
          style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            color: theme.color.text.secondary,
          }}
        >
          {major}
          {majorDetails.length > 0 && (
            <span style={{ color: theme.color.text.tertiary }}>
              {' · '}
              {majorDetails.join(' · ')}
            </span>
          )}
        </div>
      </div>

      {/* 转学信息 */}
      {transferInfo && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginBottom: `${theme.spacing.line}px`,
          }}
        >
          {transferInfo}
        </div>
      )}

      {/* 主修课程 */}
      {courses && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginBottom: `${theme.spacing.line}px`,
            fontStyle: 'italic',
          }}
        >
          主修课程：{courses}
        </div>
      )}

      {/* 毕业论文 */}
      {thesis && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            color: theme.color.text.secondary,
            marginBottom: `${theme.spacing.line}px`,
          }}
        >
          论文：《{thesis}》
          {thesisAdvisor && (
            <span style={{ color: theme.color.text.tertiary }}> · 导师：{thesisAdvisor}</span>
          )}
        </div>
      )}

      {/* 奖学金 */}
      {scholarships && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            color: theme.color.text.secondary,
            marginBottom: `${theme.spacing.line}px`,
          }}
        >
          奖学金：{scholarships}
        </div>
      )}

      {/* 成就奖项 */}
      {achievements && (
        <RichTextDisplay
          html={achievements}
          style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            color: theme.color.text.secondary,
            lineHeight: theme.layout.lineHeight,
          }}
        />
      )}
    </div>
  )
}

export const EducationItemMaterial: IMaterialDefinition = {
  meta: {
    type: 'EducationItem',
    title: '教育经历',
    description: '完整的教育背景信息',
    category: 'resume',
    tags: ['简历', '教育', '学历'],
    version: '2.0.0',
  },
  component: EducationItem,
  propsSchema: [
    // 基本信息
    {
      name: 'school',
      label: '学校名称',
      type: 'string',
      defaultValue: '大学名称',
      required: true,
      group: '基本信息',
    },
    {
      name: 'major',
      label: '专业名称',
      type: 'string',
      defaultValue: '专业名称',
      required: true,
      group: '基本信息',
    },
    {
      name: 'degree',
      label: '学历/学位',
      type: 'select',
      defaultValue: '本科',
      options: [
        { label: '高中', value: '高中' },
        { label: '中专', value: '中专' },
        { label: '技校', value: '技校' },
        { label: '职高', value: '职高' },
        { label: '专科', value: '专科' },
        { label: '本科', value: '本科' },
        { label: '学士', value: '学士' },
        { label: '硕士', value: '硕士' },
        { label: '博士', value: '博士' },
        { label: '其他', value: '其他' },
      ],
      group: '基本信息',
    },
    {
      name: 'startDate',
      label: '入学时间',
      type: 'string',
      defaultValue: '2016.09',
      group: '基本信息',
    },
    {
      name: 'endDate',
      label: '毕业时间',
      type: 'string',
      defaultValue: '2020.06',
      group: '基本信息',
    },
    {
      name: 'schoolType',
      label: '院校标签',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不显示', value: '' },
        { label: '985', value: '985' },
        { label: '211', value: '211' },
        { label: '双一流', value: '双一流' },
        { label: 'QS Top 100', value: 'QS Top 100' },
        { label: '海外名校', value: '海外名校' },
      ],
      group: '基本信息',
    },
    {
      name: 'schoolLocation',
      label: '学校所在地',
      type: 'string',
      defaultValue: '',
      group: '基本信息',
    },

    // 详细信息
    {
      name: 'gpa',
      label: 'GPA/成绩',
      type: 'string',
      defaultValue: '',
      description: '如：3.8/4.0',
      group: '详细信息',
    },
    {
      name: 'rank',
      label: '专业排名',
      type: 'string',
      defaultValue: '',
      description: '如：专业前5%',
      group: '详细信息',
    },
    {
      name: 'scholarships',
      label: '奖学金/荣誉',
      type: 'string',
      defaultValue: '',
      description: '如：国家奖学金、一等奖学金',
      group: '详细信息',
    },
    {
      name: 'achievements',
      label: '其他成就',
      type: 'richtext',
      defaultValue: '',
      description: '其他荣誉和成就',
      group: '详细信息',
      minHeight: 80,
    },
    {
      name: 'courses',
      label: '主修课程',
      type: 'textarea',
      defaultValue: '',
      description: '如：数据结构、算法、操作系统',
      group: '详细信息',
    },

    // 补充信息（不常用）
    {
      name: 'majorType',
      label: '专业类别',
      type: 'string',
      defaultValue: '',
      description: '如：工学、理学',
      group: '补充信息',
    },
    {
      name: 'gpaScale',
      label: 'GPA满分',
      type: 'string',
      defaultValue: '',
      description: '如：4.0（如已在GPA中填写则不需要）',
      group: '补充信息',
    },
    {
      name: 'eduType',
      label: '教育类型',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不显示', value: '' },
        { label: '统招', value: '统招' },
        { label: '自考', value: '自考' },
        { label: '成人教育', value: '成教' },
        { label: '网络教育', value: '网教' },
      ],
      group: '补充信息',
    },
    {
      name: 'thesis',
      label: '毕业论文',
      type: 'string',
      defaultValue: '',
      group: '补充信息',
    },
    {
      name: 'thesisAdvisor',
      label: '论文导师',
      type: 'string',
      defaultValue: '',
      group: '补充信息',
    },
    {
      name: 'transferInfo',
      label: '转学/交换信息',
      type: 'string',
      defaultValue: '',
      description: '如：大三交换至XX大学',
      group: '补充信息',
    },
  ],
  defaultProps: {
    school: '大学名称',
    schoolType: '',
    schoolLocation: '',
    major: '专业名称',
    degree: '本科',
    majorType: '',
    startDate: '2016.09',
    endDate: '2020.06',
    gpa: '',
    gpaScale: '',
    rank: '',
    courses: '',
    thesis: '',
    thesisAdvisor: '',
    achievements: '',
    scholarships: '',
    eduType: '',
    transferInfo: '',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
