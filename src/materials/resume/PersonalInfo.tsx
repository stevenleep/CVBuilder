/**
 * 个人信息物料（完整版）
 */

import React from 'react'
import { IMaterialDefinition, IMaterialAction } from '@/core'
import { useThemeConfig, useStyleConfig } from '@/core/context/ThemeContext'
import { RichTextDisplay } from '@/components/RichTextDisplay'

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
}

const PersonalInfo: React.FC<PersonalInfoProps> = (props) => {
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
    currentLocation = '北京',
    hometown = '',
    github = '',
    linkedin = '',
    website = '',
    blog = '',
    education = '',
    summary = '',
    align = 'center',
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
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: `${styleConfig.borderRadius}px`,
          overflow: 'hidden',
          flexShrink: 0,
          border: `2px solid ${theme.color.border.light}`,
        }}>
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
      
      <div style={{ flex: 1, textAlign: showAvatar && avatar ? 'left' : align }}>
        {/* 姓名 */}
        <h1 style={{ 
          fontSize: `${theme.font.titleSize.h1}px`, 
          fontWeight: theme.font.weight.bold, 
          margin: `0 0 ${theme.spacing.line - 2}px 0`,
          color: theme.color.text.primary,
          letterSpacing: '-0.03em',
        }}>
          {name}
        </h1>
        
        {/* 职位/目标 */}
        {title && (
          <div style={{ 
            fontSize: `${theme.font.bodySize.large}px`, 
            color: theme.color.text.secondary,
            marginBottom: `${theme.spacing.line}px`,
            fontWeight: theme.font.weight.normal,
          }}>
            {title}
          </div>
        )}
        
        {/* 基本信息 */}
        {basicInfo.length > 0 && (
          <div style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginBottom: `${theme.spacing.line}px`,
          }}>
            {basicInfo.join(' · ')}
          </div>
        )}
        
        {/* 求职意向 */}
        {jobExpectation.length > 0 && (
          <div style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.secondary,
            marginBottom: `${theme.spacing.paragraph}px`,
            fontWeight: theme.font.weight.medium,
          }}>
            {jobExpectation.join(' | ')}
          </div>
        )}
        
        {/* 联系方式 */}
        <div style={{ 
          display: 'flex', 
          gap: `${theme.spacing.paragraph}px`,
          fontSize: `${theme.font.bodySize.small}px`,
          color: theme.color.text.tertiary,
          flexWrap: 'wrap',
          justifyContent: (showAvatar && avatar) ? 'flex-start' : (align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'),
        }}>
          {phone && <span>{styleConfig.useEmojiIcons ? '📱 ' : '电话: '}{phone}</span>}
          {email && <span>{styleConfig.useEmojiIcons ? '✉️ ' : '邮箱: '}{email}</span>}
          {wechat && <span>{styleConfig.useEmojiIcons ? '💬 ' : '微信: '}{wechat}</span>}
          {qq && <span>{styleConfig.useEmojiIcons ? 'QQ: ' : 'QQ: '}{qq}</span>}
        </div>
        
        {/* 地址 */}
        {(currentLocation || hometown) && (
          <div style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginTop: `${theme.spacing.line - 2}px`,
            display: 'flex',
            gap: `${theme.spacing.paragraph}px`,
            flexWrap: 'wrap',
            justifyContent: (showAvatar && avatar) ? 'flex-start' : (align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'),
          }}>
            {currentLocation && <span>{styleConfig.useEmojiIcons ? '📍 ' : '现居: '}{currentLocation}</span>}
            {hometown && <span>{styleConfig.useEmojiIcons ? '🏠 ' : '户籍: '}{hometown}</span>}
          </div>
        )}
        
        {/* 社交媒体 */}
        {(github || linkedin || website || blog) && (
          <div style={{
            fontSize: `${theme.font.bodySize.small}px`,
            color: theme.color.text.tertiary,
            marginTop: `${theme.spacing.line - 2}px`,
            display: 'flex',
            gap: `${theme.spacing.paragraph}px`,
            flexWrap: 'wrap',
            justifyContent: (showAvatar && avatar) ? 'flex-start' : (align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'),
          }}>
            {github && <span>{styleConfig.useEmojiIcons ? '💻 ' : 'GitHub: '}{github}</span>}
            {linkedin && <span>{styleConfig.useEmojiIcons ? '💼 ' : 'LinkedIn: '}{linkedin}</span>}
            {website && <span>{styleConfig.useEmojiIcons ? '🌐 ' : '网站: '}{website}</span>}
            {blog && <span>{styleConfig.useEmojiIcons ? '📝 ' : '博客: '}{blog}</span>}
          </div>
        )}
      </div>
      
      {/* 个人简介 */}
      {summary && (
        <div style={{ 
          marginTop: `${theme.spacing.paragraph + 4}px`,
          textAlign: 'left',
          width: '100%',
        }}>
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

const personalInfoActions: IMaterialAction[] = [
  {
    id: 'edit-name',
    label: '快速编辑姓名',
    icon: '✏️',
    execute: async (context) => {
      const newName = prompt('请输入姓名', context.props.name)
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
    tags: ['简历', '个人信息', '联系方式'],
    version: '2.0.0',
  },
  component: PersonalInfo,
  propsSchema: [
    // 基本信息
    {
      name: 'name',
      label: '姓名',
      type: 'string',
      defaultValue: '张三',
      required: true,
      group: '基本信息',
    },
    {
      name: 'title',
      label: '职位/目标岗位',
      type: 'string',
      defaultValue: '前端工程师',
      group: '基本信息',
    },
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
      group: '基本信息',
    },
    {
      name: 'age',
      label: '年龄',
      type: 'string',
      defaultValue: '',
      description: '如：28',
      group: '基本信息',
    },
    {
      name: 'birthDate',
      label: '出生日期',
      type: 'string',
      defaultValue: '',
      description: '如：1995.06',
      group: '基本信息',
    },
    {
      name: 'nationality',
      label: '民族',
      type: 'string',
      defaultValue: '',
      description: '默认不显示',
      group: '基本信息',
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
      group: '基本信息',
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
      group: '基本信息',
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
      group: '基本信息',
    },
    {
      name: 'workYears',
      label: '工作年限',
      type: 'string',
      defaultValue: '',
      description: '如：5',
      group: '基本信息',
    },
    
    // 求职信息
    {
      name: 'expectedPosition',
      label: '期望职位',
      type: 'string',
      defaultValue: '',
      group: '求职信息',
    },
    {
      name: 'expectedSalary',
      label: '期望薪资',
      type: 'string',
      defaultValue: '',
      description: '如：15K-25K',
      group: '求职信息',
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
      group: '求职信息',
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
      group: '求职信息',
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
      name: 'wechat',
      label: '微信',
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
    
    // 地址信息
    {
      name: 'currentLocation',
      label: '现居地',
      type: 'string',
      defaultValue: '北京',
      group: '地址',
    },
    {
      name: 'hometown',
      label: '户籍地',
      type: 'string',
      defaultValue: '',
      group: '地址',
    },
    
    // 社交媒体
    {
      name: 'github',
      label: 'GitHub',
      type: 'string',
      defaultValue: '',
      description: '如：github.com/username',
      group: '社交媒体',
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      type: 'string',
      defaultValue: '',
      group: '社交媒体',
    },
    {
      name: 'website',
      label: '个人网站',
      type: 'string',
      defaultValue: '',
      group: '社交媒体',
    },
    {
      name: 'blog',
      label: '技术博客',
      type: 'string',
      defaultValue: '',
      group: '社交媒体',
    },
    
    // 其他
    {
      name: 'avatar',
      label: '头像URL',
      type: 'string',
      defaultValue: '',
      description: '图片链接',
      group: '头像',
    },
    {
      name: 'showAvatar',
      label: '显示头像',
      type: 'boolean',
      defaultValue: false,
      group: '头像',
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
    {
      name: 'align',
      label: '对齐方式',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
      ],
      group: '布局',
      visibleWhen: (props) => !props.showAvatar || !props.avatar,
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
    currentLocation: '北京',
    hometown: '',
    github: '',
    linkedin: '',
    website: '',
    blog: '',
    avatar: '',
    showAvatar: false,
    summary: '',
    align: 'center',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
  actions: personalInfoActions,
  onDoubleClick: (context) => {
    const newName = prompt('请输入姓名', context.props.name)
    if (newName) {
      const api = context.getEditorAPI()
      api.updateNodeProps(context.nodeId, { name: newName })
    }
  },
}
