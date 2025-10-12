/**
 * 个人信息物料（完整版）
 */

import React from 'react'
import { IMaterialDefinition, IMaterialAction } from '@/core'
import { useThemeConfig, useStyleConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'
import { notification } from '@/utils/notification'

interface PersonalInfoProps {
  style?: React.CSSProperties
  // 基本信息
  name?: string
  title?: string
  avatar?: string
  showAvatar?: boolean
  age?: string
  gender?: string
  birthDate?: string
  nationality?: string
  politicalStatus?: string
  maritalStatus?: string

  // 求职信息
  expectedPosition?: string
  expectedSalary?: string
  workYears?: string
  currentStatus?: string
  arrivalTime?: string

  // 联系方式
  phone?: string
  email?: string
  wechat?: string
  qq?: string

  // 地址信息
  currentLocation?: string
  hometown?: string

  // 社交媒体
  github?: string
  linkedin?: string
  website?: string
  blog?: string

  // 教育背景
  education?: string

  // 其他
  summary?: string
  align?: 'left' | 'center' | 'right'
  layoutPreset?: 'classic' | 'centered' | 'minimal' | 'detailed'
  showFullLinks?: boolean
}

const PersonalInfo: React.FC<PersonalInfoProps> = props => {
  const {
    style,
    name = '张三',
    title = '前端工程师',
    avatar = '',
    showAvatar = false,
    age = '',
    gender = '',
    birthDate = '',
    nationality = '',
    politicalStatus = '',
    maritalStatus = '',
    expectedPosition = '',
    expectedSalary = '',
    workYears = '',
    currentStatus = '',
    arrivalTime = '',
    phone = '138-0000-0000',
    email = 'zhangsan@example.com',
    wechat = '',
    qq = '',
    currentLocation = '',
    hometown = '',
    github = '',
    linkedin = '',
    website = '',
    blog = '',
    education = '',
    summary = '',
    align = 'left',
    layoutPreset = 'classic',
    showFullLinks = true,
  } = props

  const theme = useThemeConfig()
  const styleConfig = useStyleConfig()

  // 基本信息行
  const basicInfo = [
    age && `${age}岁`,
    gender,
    birthDate && `${birthDate}出生`,
    nationality && nationality !== '中国' ? nationality : null,
    politicalStatus && politicalStatus !== '群众' ? politicalStatus : null,
    maritalStatus,
    workYears && `${workYears}年经验`,
    education,
  ].filter(Boolean)

  // 求职意向
  const jobExpectation = [
    expectedPosition && `期望：${expectedPosition}`,
    expectedSalary && `${expectedSalary}`,
    currentStatus,
    arrivalTime,
  ].filter(Boolean)

  // 根据预设选择渲染方式
  switch (layoutPreset) {
    case 'centered':
      return renderCenteredLayout()
    case 'minimal':
      return renderMinimalLayout()
    case 'detailed':
      return renderDetailedLayout()
    default:
      return renderClassicLayout()
  }

  // 经典布局（默认）
  function renderClassicLayout() {
    return (
      <div
        style={{
          paddingBottom: `${theme.spacing.paragraph * 1.5}px`,
          borderBottom: styleConfig.showPersonalInfoDivider
            ? `${styleConfig.dividerThickness}px ${styleConfig.dividerStyle} ${theme.color.border.light}`
            : 'none',
          marginBottom: `${theme.spacing.section}px`,
          display: showAvatar && avatar ? 'flex' : 'block',
          gap: showAvatar && avatar ? `${theme.spacing.paragraph * 2}px` : '0',
          alignItems: 'flex-start',
          ...style,
        }}
      >
        {/* 头像 */}
        {showAvatar && avatar && (
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: `${styleConfig.borderRadius}px`,
              overflow: 'hidden',
              flexShrink: 0,
              border: `2px solid ${theme.color.border.light}`,
            }}
          >
            <img
              src={avatar}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        <div style={{ flex: 1, textAlign: align }}>
          {/* 姓名 */}
          <h1
            style={{
              fontSize: `${theme.font.titleSize.h1}px`,
              fontWeight: theme.font.weight.bold,
              margin: `0 0 ${theme.spacing.line - 2}px 0`,
              color: theme.color.text.primary,
              letterSpacing: '-0.03em',
            }}
          >
            {name}
          </h1>

          {/* 职位/目标 */}
          {title && (
            <div
              style={{
                fontSize: `${theme.font.bodySize.normal}px`,
                color: theme.color.text.secondary,
                marginBottom: `${theme.spacing.line}px`,
                fontWeight: theme.font.weight.medium,
              }}
            >
              {title}
            </div>
          )}

          {/* 基本信息 */}
          {basicInfo.length > 0 && (
            <div
              style={{
                fontSize: `${theme.font.bodySize.small}px`,
                color: theme.color.text.tertiary,
                marginBottom: `${theme.spacing.line}px`,
              }}
            >
              {basicInfo.join(' · ')}
            </div>
          )}

          {/* 求职意向 */}
          {jobExpectation.length > 0 && (
            <div
              style={{
                fontSize: `${theme.font.bodySize.small}px`,
                color: theme.color.text.secondary,
                marginBottom: `${theme.spacing.paragraph}px`,
                fontWeight: theme.font.weight.medium,
              }}
            >
              {jobExpectation.join(' | ')}
            </div>
          )}

          {/* 联系方式 - 优化排版 */}
          <div
            style={{
              display: 'flex',
              gap: `${theme.spacing.paragraph + 2}px`,
              fontSize: `${theme.font.bodySize.small}px`,
              color: theme.color.text.secondary,
              flexWrap: 'wrap',
              marginTop: `${theme.spacing.line}px`,
              justifyContent:
                showAvatar && avatar
                  ? 'flex-start'
                  : align === 'center'
                    ? 'center'
                    : align === 'right'
                      ? 'flex-end'
                      : 'flex-start',
            }}
          >
            {phone && <span>{phone}</span>}
            {email && <span>{email}</span>}
            {wechat && <span>微信: {wechat}</span>}
            {qq && <span>QQ: {qq}</span>}
          </div>

          {/* 地址 */}
          {(currentLocation || hometown) && (
            <div
              style={{
                fontSize: `${theme.font.bodySize.small}px`,
                color: theme.color.text.tertiary,
                marginTop: `${theme.spacing.line - 2}px`,
                display: 'flex',
                gap: `${theme.spacing.paragraph}px`,
                flexWrap: 'wrap',
                justifyContent:
                  showAvatar && avatar
                    ? 'flex-start'
                    : align === 'center'
                      ? 'center'
                      : align === 'right'
                        ? 'flex-end'
                        : 'flex-start',
              }}
            >
              {currentLocation && (
                <span>
                  {styleConfig.useEmojiIcons ? '📍 ' : '现居: '}
                  {currentLocation}
                </span>
              )}
              {hometown && (
                <span>
                  {styleConfig.useEmojiIcons ? '🏠 ' : '户籍: '}
                  {hometown}
                </span>
              )}
            </div>
          )}

          {/* 社交媒体 - 可配置显示方式 */}
          {(github || linkedin || website || blog) && (
            <div
              style={{
                fontSize: `${theme.font.bodySize.small}px`,
                marginTop: `${theme.spacing.line - 1}px`,
                display: 'flex',
                gap: `${theme.spacing.paragraph + 2}px`,
                flexWrap: 'wrap',
                justifyContent:
                  showAvatar && avatar
                    ? 'flex-start'
                    : align === 'center'
                      ? 'center'
                      : align === 'right'
                        ? 'flex-end'
                        : 'flex-start',
              }}
            >
              {github &&
                (showFullLinks ? (
                  <span style={{ color: theme.color.text.tertiary }}>GitHub: {github}</span>
                ) : (
                  <a
                    href={github.startsWith('http') ? github : `https://${github}`}
                    style={{
                      color: theme.color.text.secondary,
                      textDecoration: 'none',
                      borderBottom: `1px solid ${theme.color.border.normal}`,
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                ))}
              {linkedin &&
                (showFullLinks ? (
                  <span style={{ color: theme.color.text.tertiary }}>LinkedIn: {linkedin}</span>
                ) : (
                  <a
                    href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                    style={{
                      color: theme.color.text.secondary,
                      textDecoration: 'none',
                      borderBottom: `1px solid ${theme.color.border.normal}`,
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                ))}
              {website &&
                (showFullLinks ? (
                  <span style={{ color: theme.color.text.tertiary }}>网站: {website}</span>
                ) : (
                  <a
                    href={website.startsWith('http') ? website : `https://${website}`}
                    style={{
                      color: theme.color.text.secondary,
                      textDecoration: 'none',
                      borderBottom: `1px solid ${theme.color.border.normal}`,
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    个人网站
                  </a>
                ))}
              {blog &&
                (showFullLinks ? (
                  <span style={{ color: theme.color.text.tertiary }}>博客: {blog}</span>
                ) : (
                  <a
                    href={blog.startsWith('http') ? blog : `https://${blog}`}
                    style={{
                      color: theme.color.text.secondary,
                      textDecoration: 'none',
                      borderBottom: `1px solid ${theme.color.border.normal}`,
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    博客
                  </a>
                ))}
            </div>
          )}
        </div>

        {/* 个人简介 */}
        {summary && (
          <div
            style={{
              marginTop: `${theme.spacing.paragraph + 4}px`,
              textAlign: 'left',
              width: '100%',
            }}
          >
            <RichTextDisplay
              html={summary}
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

  // 居中简约布局
  function renderCenteredLayout() {
    return (
      <div
        style={{
          paddingBottom: `${theme.spacing.paragraph * 1.5}px`,
          borderBottom: styleConfig.showPersonalInfoDivider
            ? `${styleConfig.dividerThickness}px ${styleConfig.dividerStyle} ${theme.color.border.light}`
            : 'none',
          marginBottom: `${theme.spacing.section}px`,
          textAlign: 'center',
          ...style,
        }}
      >
        {/* 姓名 */}
        <h1
          style={{
            fontSize: `${theme.font.titleSize.h1}px`,
            fontWeight: theme.font.weight.bold,
            margin: `0 0 ${theme.spacing.line}px 0`,
            color: theme.color.text.primary,
            letterSpacing: '-0.02em',
          }}
        >
          {name}
        </h1>

        {/* 职位 */}
        {title && (
          <div
            style={{
              fontSize: `${theme.font.bodySize.normal}px`,
              color: theme.color.text.secondary,
              marginBottom: `${theme.spacing.paragraph}px`,
              fontWeight: theme.font.weight.medium,
            }}
          >
            {title}
          </div>
        )}

        {/* 联系方式 */}
        <div
          style={{
            display: 'flex',
            gap: `${theme.spacing.paragraph + 2}px`,
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.secondary,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: `${theme.spacing.line}px`,
          }}
        >
          {phone && <span>{phone}</span>}
          {email && <span>{email}</span>}
          {currentLocation && <span>{currentLocation}</span>}
        </div>

        {/* 社交链接 */}
        {(github || linkedin || website) && (
          <div
            style={{
              fontSize: `${theme.font.bodySize.small}px`,
              display: 'flex',
              gap: `${theme.spacing.paragraph}px`,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {github && (
              <a
                href={github.startsWith('http') ? github : `https://${github}`}
                style={{
                  color: theme.color.text.secondary,
                  textDecoration: 'none',
                  borderBottom: `1px solid ${theme.color.border.normal}`,
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                style={{
                  color: theme.color.text.secondary,
                  textDecoration: 'none',
                  borderBottom: `1px solid ${theme.color.border.normal}`,
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            )}
            {website && (
              <a
                href={website.startsWith('http') ? website : `https://${website}`}
                style={{
                  color: theme.color.text.secondary,
                  textDecoration: 'none',
                  borderBottom: `1px solid ${theme.color.border.normal}`,
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                网站
              </a>
            )}
          </div>
        )}
      </div>
    )
  }

  // 极简布局
  function renderMinimalLayout() {
    return (
      <div
        style={{
          paddingBottom: `${theme.spacing.paragraph}px`,
          marginBottom: `${theme.spacing.section}px`,
          ...style,
        }}
      >
        {/* 姓名与职位 */}
        <h1
          style={{
            fontSize: `${theme.font.titleSize.h1}px`,
            fontWeight: theme.font.weight.bold,
            margin: 0,
            color: theme.color.text.primary,
            letterSpacing: '-0.02em',
          }}
        >
          {name}
          {title && (
            <span
              style={{
                fontSize: `${theme.font.bodySize.normal}px`,
                fontWeight: theme.font.weight.normal,
                color: theme.color.text.tertiary,
                marginLeft: `${theme.spacing.paragraph + 4}px`,
              }}
            >
              {title}
            </span>
          )}
        </h1>

        {/* 联系方式 - 一行紧凑 */}
        <div
          style={{
            display: 'flex',
            gap: `${theme.spacing.paragraph}px`,
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            flexWrap: 'wrap',
            marginTop: `${theme.spacing.line}px`,
          }}
        >
          {phone && <span>{phone}</span>}
          {email && <span>{email}</span>}
          {currentLocation && <span>{currentLocation}</span>}
          {github && <span>GitHub</span>}
        </div>
      </div>
    )
  }

  // 详细信息布局 - 智能两栏分布
  function renderDetailedLayout() {
    // 收集所有信息项
    const allItems = [
      phone && { label: '电话', value: phone },
      email && { label: '邮箱', value: email },
      currentLocation && { label: '现居', value: currentLocation },
      hometown && { label: '户籍', value: hometown },
      workYears && { label: '工作年限', value: `${workYears}年` },
      age && { label: '年龄', value: `${age}岁` },
      education && { label: '学历', value: education },
      wechat && { label: '微信', value: wechat },
    ].filter(Boolean) as Array<{ label: string; value: string }>

    // 智能分配到两栏（尽量平均）
    const mid = Math.ceil(allItems.length / 2)
    const leftItems = allItems.slice(0, mid)
    const rightItems = allItems.slice(mid)

    return (
      <div
        style={{
          paddingBottom: `${theme.spacing.paragraph * 1.5}px`,
          borderBottom: styleConfig.showPersonalInfoDivider
            ? `${styleConfig.dividerThickness}px ${styleConfig.dividerStyle} ${theme.color.border.light}`
            : 'none',
          marginBottom: `${theme.spacing.section}px`,
          ...style,
        }}
      >
        {/* 顶部：姓名和职位 */}
        <div style={{ marginBottom: `${theme.spacing.paragraph}px` }}>
          <h1
            style={{
              fontSize: `${theme.font.titleSize.h1}px`,
              fontWeight: theme.font.weight.bold,
              margin: `0 0 ${theme.spacing.line - 2}px 0`,
              color: theme.color.text.primary,
              letterSpacing: '-0.02em',
            }}
          >
            {name}
          </h1>
          {title && (
            <div
              style={{
                fontSize: `${theme.font.bodySize.normal}px`,
                color: theme.color.text.secondary,
                fontWeight: theme.font.weight.medium,
              }}
            >
              {title}
            </div>
          )}
        </div>

        {/* 两栏布局：智能分配信息 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: `${theme.spacing.paragraph * 2}px`,
            fontSize: `${theme.font.bodySize.small}px`,
          }}
        >
          {/* 左栏 */}
          <div>
            {leftItems.map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: `${theme.spacing.line - 1}px`,
                  color: theme.color.text.secondary,
                }}
              >
                <span style={{ fontWeight: theme.font.weight.medium }}>{item.label}：</span>
                {item.value}
              </div>
            ))}
          </div>

          {/* 右栏 */}
          <div>
            {rightItems.map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: `${theme.spacing.line - 1}px`,
                  color: theme.color.text.secondary,
                }}
              >
                <span style={{ fontWeight: theme.font.weight.medium }}>{item.label}：</span>
                {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* 社交链接 */}
        {(github || linkedin || website) && (
          <div
            style={{
              marginTop: `${theme.spacing.paragraph}px`,
              fontSize: `${theme.font.bodySize.small}px`,
              display: 'flex',
              gap: `${theme.spacing.paragraph}px`,
              flexWrap: 'wrap',
            }}
          >
            {github &&
              (showFullLinks ? (
                <span style={{ color: theme.color.text.tertiary }}>GitHub: {github}</span>
              ) : (
                <a
                  href={github.startsWith('http') ? github : `https://${github}`}
                  style={{
                    color: theme.color.text.secondary,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${theme.color.border.normal}`,
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              ))}
            {linkedin &&
              (showFullLinks ? (
                <span style={{ color: theme.color.text.tertiary }}>LinkedIn: {linkedin}</span>
              ) : (
                <a
                  href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                  style={{
                    color: theme.color.text.secondary,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${theme.color.border.normal}`,
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              ))}
            {website &&
              (showFullLinks ? (
                <span style={{ color: theme.color.text.tertiary }}>网站: {website}</span>
              ) : (
                <a
                  href={website.startsWith('http') ? website : `https://${website}`}
                  style={{
                    color: theme.color.text.secondary,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${theme.color.border.normal}`,
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  网站
                </a>
              ))}
          </div>
        )}
      </div>
    )
  }
}

const personalInfoActions: IMaterialAction[] = [
  {
    id: 'edit-name',
    label: '快速编辑姓名',
    icon: '✏️',
    execute: async context => {
      const newName = await notification.prompt({
        title: '编辑姓名',
        message: '请输入姓名',
        defaultValue: context.props.name as string,
      })
      if (newName) {
        const api = context.getEditorAPI()
        api.updateNodeProps(context.nodeId, { name: newName })
      }
    },
    enabled: () => true,
  },
]

export const PersonalInfoMaterial: IMaterialDefinition = {
  meta: {
    type: 'PersonalInfo',
    title: '个人信息',
    description: '完整的个人信息模块',
    category: 'resume',
    subcategory: 'info',
    tags: ['简历', '个人信息', '联系方式'],
    version: '2.0.0',
  },
  component: PersonalInfo,
  propsSchema: [
    // 核心信息（最常用）
    {
      name: 'name',
      label: '姓名',
      type: 'string',
      defaultValue: '张三',
      required: true,
      group: '核心信息',
    },
    {
      name: 'title',
      label: '职位/目标岗位',
      type: 'string',
      defaultValue: '前端工程师',
      group: '核心信息',
    },
    {
      name: 'age',
      label: '年龄',
      type: 'string',
      defaultValue: '',
      description: '如：28',
      group: '核心信息',
    },
    {
      name: 'workYears',
      label: '工作年限',
      type: 'string',
      defaultValue: '',
      description: '如：5年',
      group: '核心信息',
    },
    {
      name: 'education',
      label: '最高学历',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不填写', value: '' },
        { label: '专科', value: '专科' },
        { label: '本科', value: '本科' },
        { label: '硕士', value: '硕士' },
        { label: '博士', value: '博士' },
      ],
      group: '核心信息',
    },
    {
      name: 'expectedSalary',
      label: '期望薪资',
      type: 'string',
      defaultValue: '',
      description: '如：15K-25K',
      group: '核心信息',
    },
    {
      name: 'currentStatus',
      label: '求职状态',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不显示', value: '' },
        { label: '在职-考虑机会', value: '在职-考虑机会' },
        { label: '在职-月内到岗', value: '在职-月内到岗' },
        { label: '离职-随时到岗', value: '离职-随时到岗' },
      ],
      group: '核心信息',
    },

    // 补充信息
    {
      name: 'gender',
      label: '性别',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不填写', value: '' },
        { label: '男', value: '男' },
        { label: '女', value: '女' },
      ],
      group: '补充信息',
    },
    {
      name: 'birthDate',
      label: '出生日期',
      type: 'string',
      defaultValue: '',
      description: '如：1995.06',
      group: '补充信息',
    },
    {
      name: 'expectedPosition',
      label: '期望职位',
      type: 'string',
      defaultValue: '',
      group: '补充信息',
    },
    {
      name: 'arrivalTime',
      label: '到岗时间',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不显示', value: '' },
        { label: '随时', value: '随时' },
        { label: '一周内', value: '一周内' },
        { label: '两周内', value: '两周内' },
        { label: '一个月内', value: '一个月内' },
      ],
      group: '补充信息',
    },
    {
      name: 'maritalStatus',
      label: '婚姻状况',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不填写', value: '' },
        { label: '未婚', value: '未婚' },
        { label: '已婚', value: '已婚' },
      ],
      group: '补充信息',
    },
    {
      name: 'politicalStatus',
      label: '政治面貌',
      type: 'select',
      defaultValue: '',
      options: [
        { label: '不填写', value: '' },
        { label: '中共党员', value: '中共党员' },
        { label: '共青团员', value: '共青团员' },
        { label: '群众', value: '群众' },
      ],
      group: '补充信息',
    },
    {
      name: 'nationality',
      label: '民族',
      type: 'string',
      defaultValue: '',
      description: '默认不显示',
      group: '补充信息',
    },
    {
      name: 'summary',
      label: '个人简介',
      type: 'richtext',
      defaultValue: '',
      description: '一句话介绍',
      group: '补充信息',
      minHeight: 60,
    },

    // 联系方式
    {
      name: 'phone',
      label: '电话',
      type: 'string',
      defaultValue: '138-0000-0000',
      group: '联系方式',
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'string',
      defaultValue: 'zhangsan@example.com',
      group: '联系方式',
    },
    {
      name: 'currentLocation',
      label: '现居地',
      type: 'string',
      defaultValue: '北京',
      group: '联系方式',
    },
    {
      name: 'wechat',
      label: '微信',
      type: 'string',
      defaultValue: '',
      group: '联系方式',
    },
    {
      name: 'hometown',
      label: '户籍地',
      type: 'string',
      defaultValue: '',
      group: '联系方式',
    },
    {
      name: 'qq',
      label: 'QQ',
      type: 'string',
      defaultValue: '',
      group: '联系方式',
    },

    // 在线链接
    {
      name: 'github',
      label: 'GitHub',
      type: 'string',
      defaultValue: '',
      description: '如：github.com/username',
      group: '在线链接',
    },
    {
      name: 'blog',
      label: '技术博客',
      type: 'string',
      defaultValue: '',
      group: '在线链接',
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      type: 'string',
      defaultValue: '',
      group: '在线链接',
    },
    {
      name: 'website',
      label: '个人网站',
      type: 'string',
      defaultValue: '',
      group: '在线链接',
    },

    // 外观设置
    {
      name: 'showAvatar',
      label: '显示头像',
      type: 'boolean',
      defaultValue: false,
      group: '外观',
    },
    {
      name: 'avatar',
      label: '头像',
      type: 'image',
      defaultValue: '',
      group: '外观',
      visibleWhen: props => props.showAvatar,
    },
    {
      name: 'layoutPreset',
      label: '板式预设',
      type: 'select',
      defaultValue: 'classic',
      options: [
        { label: '经典布局', value: 'classic' },
        { label: '居中简约', value: 'centered' },
        { label: '极简风格', value: 'minimal' },
        { label: '详细信息', value: 'detailed' },
      ],
      group: '外观',
      hidden: true, // 隐藏，因为有专门的 tab
    },
    {
      name: 'align',
      label: '对齐方式',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
      ],
      group: '外观',
      visibleWhen: (props: Record<string, any>) => props.layoutPreset === 'classic',
    },
    {
      name: 'showFullLinks',
      label: '显示完整链接',
      type: 'boolean',
      defaultValue: true,
      group: '外观',
    },
  ],
  defaultProps: {
    name: '张三',
    title: '前端工程师',
    gender: '',
    age: '',
    birthDate: '',
    nationality: '',
    politicalStatus: '',
    maritalStatus: '',
    education: '',
    workYears: '',
    expectedPosition: '',
    expectedSalary: '',
    currentStatus: '',
    arrivalTime: '',
    phone: '138-0000-0000',
    email: 'zhangsan@example.com',
    wechat: '',
    qq: '',
    currentLocation: '',
    hometown: '',
    github: '',
    linkedin: '',
    website: '',
    blog: '',
    avatar: '',
    showAvatar: false,
    summary: '',
    layoutPreset: 'classic',
    align: 'left',
    showFullLinks: true,
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
  actions: personalInfoActions,
  onDoubleClick: async context => {
    const newName = await notification.prompt({
      title: '编辑姓名',
      message: '请输入姓名',
      defaultValue: context.props.name as string,
    })
    if (newName) {
      const api = context.getEditorAPI()
      api.updateNodeProps(context.nodeId, { name: newName })
    }
  },
}
