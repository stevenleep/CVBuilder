/**
 * 项目经历物料（完整版）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'
import { Info, Code, FileText } from 'lucide-react'

interface ProjectItemProps {
  style?: React.CSSProperties
  // 项目基本信息
  projectName?: string
  projectType?: string
  company?: string

  // 角色与职责
  role?: string
  responsibility?: string

  // 时间
  startDate?: string
  endDate?: string

  // 规模信息
  teamSize?: string
  userScale?: string
  dataScale?: string

  // 技术信息
  techStack?: string
  architecture?: string

  // 链接信息
  projectUrl?: string
  githubUrl?: string
  demoUrl?: string

  // 项目状态
  projectStatus?: string

  // 内容
  description?: string
  achievements?: string
  contribution?: string
}

const ProjectItem: React.FC<ProjectItemProps> = props => {
  const {
    style,
    projectName = '项目名称',
    projectType = '',
    company = '',
    role = '项目角色',
    responsibility = '',
    startDate = '2022.01',
    endDate = '2023.12',
    teamSize = '',
    userScale = '',
    dataScale = '',
    techStack = '',
    architecture = '',
    projectUrl = '',
    githubUrl = '',
    demoUrl = '',
    projectStatus = '',
    description = '',
    achievements = '',
    contribution = '',
  } = props

  const theme = useThemeConfig()

  // 项目元信息
  const projectMeta = [projectType, company, projectStatus].filter(Boolean)

  // 规模信息
  const scaleInfo = [
    teamSize && `${teamSize}人团队`,
    userScale && `${userScale}用户`,
    dataScale && `${dataScale}数据量`,
  ].filter(Boolean)

  return (
    <div
      style={{
        marginBottom: `${theme.spacing.item}px`,
        ...style,
      }}
    >
      {/* 标题行 - 优化层次 */}
      <div style={{ marginBottom: `${theme.spacing.paragraph}px` }}>
        {/* 项目名与时间 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '20px',
            marginBottom: `${theme.spacing.line - 1}px`,
          }}
        >
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: `${theme.font.titleSize.h3}px`,
                fontWeight: theme.font.weight.bold,
                color: theme.color.text.primary,
                letterSpacing: '-0.01em',
              }}
            >
              {projectName}
            </span>
            {projectMeta.length > 0 && (
              <span
                style={{
                  fontSize: `${theme.font.bodySize.small}px`,
                  color: theme.color.text.tertiary,
                  marginLeft: `${theme.spacing.paragraph}px`,
                }}
              >
                {projectMeta.join(' · ')}
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

        {/* 角色 - 和谐精致 */}
        <div
          style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            fontWeight: theme.font.weight.medium,
            color: theme.color.text.secondary,
            letterSpacing: '-0.005em',
          }}
        >
          {role}
          {responsibility && (
            <span
              style={{
                fontSize: `${theme.font.bodySize.small}px`,
                color: theme.color.text.tertiary,
                fontWeight: theme.font.weight.normal,
                marginLeft: `${theme.spacing.paragraph}px`,
              }}
            >
              {responsibility}
            </span>
          )}
        </div>
      </div>

      {/* 规模信息 */}
      {scaleInfo.length > 0 && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginBottom: `${theme.spacing.paragraph - 1}px`,
          }}
        >
          <span style={{ fontWeight: theme.font.weight.medium }}>项目规模：</span>
          {scaleInfo.join(' · ')}
        </div>
      )}

      {/* 技术栈 */}
      {techStack && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginBottom: `${theme.spacing.paragraph}px`,
            padding: `${theme.spacing.line - 1}px 0`,
          }}
        >
          <span style={{ fontWeight: theme.font.weight.medium }}>技术栈：</span>
          {techStack}
        </div>
      )}

      {/* 架构 */}
      {architecture && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginBottom: `${theme.spacing.line}px`,
            fontStyle: 'italic',
          }}
        >
          架构：{architecture}
        </div>
      )}

      {/* 项目链接 */}
      {(projectUrl || githubUrl || demoUrl) && (
        <div
          style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginBottom: `${theme.spacing.line}px`,
            display: 'flex',
            gap: `${theme.spacing.paragraph}px`,
            flexWrap: 'wrap',
          }}
        >
          {projectUrl && (
            <span>
              🔗{' '}
              <a href={projectUrl} style={{ color: 'inherit', textDecoration: 'underline' }}>
                项目地址
              </a>
            </span>
          )}
          {githubUrl && (
            <span>
              💻{' '}
              <a href={githubUrl} style={{ color: 'inherit', textDecoration: 'underline' }}>
                GitHub
              </a>
            </span>
          )}
          {demoUrl && (
            <span>
              🎬{' '}
              <a href={demoUrl} style={{ color: 'inherit', textDecoration: 'underline' }}>
                在线Demo
              </a>
            </span>
          )}
        </div>
      )}

      {/* 项目描述 */}
      {description && (
        <RichTextDisplay
          html={description}
          style={{
            fontSize: `${theme.font.bodySize.normal}px`,
            color: theme.color.text.secondary,
            lineHeight: theme.layout.lineHeight,
            marginBottom: achievements || contribution ? `${theme.spacing.paragraph}px` : '0',
          }}
        />
      )}

      {/* 个人贡献 */}
      {contribution && (
        <div
          style={{
            marginBottom: achievements ? `${theme.spacing.paragraph}px` : '0',
            marginTop: `${theme.spacing.line}px`,
          }}
        >
          <div
            style={{
              fontSize: `${theme.font.bodySize.normal}px`,
              fontWeight: theme.font.weight.semibold,
              color: theme.color.text.primary,
              marginBottom: `${theme.spacing.line}px`,
              letterSpacing: '-0.005em',
            }}
          >
            个人贡献
          </div>
          <RichTextDisplay
            html={contribution}
            style={{
              fontSize: `${theme.font.bodySize.normal}px`,
              color: theme.color.text.secondary,
              lineHeight: theme.layout.lineHeight,
            }}
          />
        </div>
      )}

      {/* 项目成果 */}
      {achievements && (
        <div style={{ marginTop: `${theme.spacing.line}px` }}>
          <div
            style={{
              fontSize: `${theme.font.bodySize.normal}px`,
              fontWeight: theme.font.weight.semibold,
              color: theme.color.text.primary,
              marginBottom: `${theme.spacing.line}px`,
              letterSpacing: '-0.005em',
            }}
          >
            项目成果
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
    </div>
  )
}

export const ProjectItemMaterial: IMaterialDefinition = {
  meta: {
    type: 'ProjectItem',
    title: '项目经历',
    description: '完整的项目经验信息',
    category: 'resume',
    subcategory: 'items',
    tags: ['简历', '项目'],
    version: '2.0.0',
  },
  component: ProjectItem,
  propsSchema: [
    // 项目基本信息
    {
      name: 'projectName',
      label: '项目名称',
      type: 'string',
      defaultValue: '项目名称',
      required: true,
      group: '基本信息',
      groupIcon: <Info size={11} />,
      tab: 'basic',
    },
    {
      name: 'projectType',
      label: '项目类型',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不显示', value: '' },
        { label: '商业项目', value: '商业项目' },
        { label: '开源项目', value: '开源项目' },
        { label: '个人项目', value: '个人项目' },
        { label: '学术项目', value: '学术项目' },
        { label: '外包项目', value: '外包项目' },
      ],
      group: '基本信息',
      tab: 'basic',
    },
    {
      name: 'company',
      label: '所属公司',
      type: 'string',
      defaultValue: '',
      description: '如果是公司项目',
      group: '基本信息',
      tab: 'basic',
    },
    {
      name: 'projectStatus',
      label: '项目状态',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不显示', value: '' },
        { label: '已上线', value: '已上线' },
        { label: '运营中', value: '运营中' },
        { label: '开发中', value: '开发中' },
        { label: '已完成', value: '已完成' },
        { label: '已下线', value: '已下线' },
      ],
      group: '基本信息',
      tab: 'basic',
    },

    // 角色与职责
    {
      name: 'role',
      label: '担任角色',
      type: 'string',
      defaultValue: '项目角色',
      required: true,
      group: '基本信息',
      tab: 'basic',
    },
    {
      name: 'responsibility',
      label: '职责范围',
      type: 'string',
      defaultValue: '',
      description: '如：前端负责人',
      group: '基本信息',
      tab: 'basic',
    },

    // 时间
    {
      name: 'startDate',
      label: '开始时间',
      type: 'string',
      defaultValue: '2022.01',
      group: '基本信息',
      tab: 'basic',
    },
    {
      name: 'endDate',
      label: '结束时间',
      type: 'string',
      defaultValue: '2023.12',
      group: '基本信息',
      tab: 'basic',
    },

    // 规模信息
    {
      name: 'teamSize',
      label: '团队规模',
      type: 'string',
      defaultValue: '',
      description: '如：5',
      group: '项目详情',
      groupIcon: <Code size={11} />,
      tab: 'details',
    },
    {
      name: 'userScale',
      label: '用户规模',
      type: 'string',
      defaultValue: '',
      description: '如：100万+',
      group: '项目详情',
      tab: 'details',
    },
    {
      name: 'dataScale',
      label: '数据规模',
      type: 'string',
      defaultValue: '',
      description: '如：日均PV 1000万',
      group: '项目详情',
      tab: 'details',
    },

    // 技术信息
    {
      name: 'techStack',
      label: '技术栈',
      type: 'textarea',
      defaultValue: 'React, TypeScript, Node.js, MySQL, Redis',
      description: '使用的技术',
      group: '项目详情',
      tab: 'details',
    },
    {
      name: 'architecture',
      label: '架构设计',
      type: 'string',
      defaultValue: '',
      description: '如：微服务、前后端分离',
      group: '项目详情',
      tab: 'details',
    },

    // 链接
    {
      name: 'projectUrl',
      label: '项目链接',
      type: 'string',
      defaultValue: '',
      description: '线上地址',
      group: '项目详情',
      tab: 'details',
    },
    {
      name: 'githubUrl',
      label: 'GitHub地址',
      type: 'string',
      defaultValue: '',
      group: '项目详情',
      tab: 'details',
    },
    {
      name: 'demoUrl',
      label: 'Demo地址',
      type: 'string',
      defaultValue: '',
      group: '项目详情',
      tab: 'details',
    },

    // 内容
    {
      name: 'description',
      label: '项目介绍',
      type: 'richtext',
      defaultValue: '<ul><li>项目背景和目标</li><li>核心功能和模块</li></ul>',
      description: '项目整体介绍',
      group: '内容',
      groupIcon: <FileText size={11} />,
      tab: 'content',
      minHeight: 100,
    },
    {
      name: 'contribution',
      label: '个人贡献',
      type: 'richtext',
      defaultValue: '',
      description: '个人负责的部分',
      group: '内容',
      tab: 'content',
      minHeight: 80,
    },
    {
      name: 'achievements',
      label: '项目成果',
      type: 'richtext',
      defaultValue: '',
      description: '量化的成果和亮点',
      group: '内容',
      tab: 'content',
      minHeight: 80,
    },
  ],
  defaultProps: {
    projectName: '项目名称',
    projectType: '',
    company: '',
    role: '项目角色',
    responsibility: '',
    startDate: '2022.01',
    endDate: '2023.12',
    teamSize: '',
    userScale: '',
    dataScale: '',
    techStack: 'React, TypeScript, Node.js, MySQL, Redis',
    architecture: '',
    projectUrl: '',
    githubUrl: '',
    demoUrl: '',
    projectStatus: '',
    description: '<ul><li>项目背景和目标</li><li>核心功能和模块</li></ul>',
    contribution: '',
    achievements: '',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
  propertyTabs: [
    {
      id: 'basic',
      label: '基本信息',
      icon: <Info size={12} />,
    },
    {
      id: 'details',
      label: '项目详情',
      icon: <Code size={12} />,
    },
    {
      id: 'content',
      label: '内容',
      icon: <FileText size={12} />,
    },
  ],
}
