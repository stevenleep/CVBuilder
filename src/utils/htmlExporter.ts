/**
 * HTML导出模块
 * 基于页面中的物料配置生成HTML和CSS
 */

import JSZip from 'jszip'
import { PageSchema, NodeSchema } from '@/types/material'

export type ExportHTMLVersion = 'html5' | 'pc'

export interface HTMLExportOptions {
  version: ExportHTMLVersion
  pageSchema: PageSchema
}

/**
 * 样式对象转CSS字符串
 */
function styleToCss(style: Record<string, any> | undefined): string {
  if (!style) return ''

  return Object.entries(style)
    .map(([key, value]) => {
      // 将驼峰命名转为连字符
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: ${value}`
    })
    .join('; ')
}

/**
 * 从props中提取文本内容
 */
function extractTextFromProps(props: Record<string, any> | undefined): string {
  if (!props) return ''

  // 常见的文本属性名
  const textKeys = ['content', 'text', 'value', 'label', 'title', 'description']

  for (const key of textKeys) {
    if (props[key] && typeof props[key] === 'string') {
      return props[key]
    }
  }

  // 如果都没有，返回空字符串
  return ''
}

/**
 * 从节点Schema生成HTML
 */
function nodeToHTML(node: NodeSchema, version: ExportHTMLVersion): string {
  // 跳过隐藏的节点
  if (node.hidden) {
    return ''
  }

  const { type, props, style, children } = node
  const isMobile = version === 'html5'

  // HTML5版本：忽略样式，只用CSS类控制
  // PC版本：保留inline样式
  const styleStr = isMobile ? '' : styleToCss(style)

  // 根据物料类型生成对应的HTML
  switch (type) {
    case 'Page':
      // Page是根容器
      return generateChildrenHTML(children, version)

    case 'Container':
    case 'Section':
      return `<div class="material-${type.toLowerCase()}" ${styleStr ? `style="${styleStr}"` : ''}>
  ${generateChildrenHTML(children, version)}
</div>`

    case 'Text':
      return `<p class="text-content" ${styleStr ? `style="${styleStr}"` : ''}>${props?.content || ''}</p>`

    case 'Title':
    case 'Heading': {
      const level = props?.level || 1
      return `<h${level} class="heading-${level}" ${styleStr ? `style="${styleStr}"` : ''}>${props?.content || ''}</h${level}>`
    }

    case 'Image':
      return `<img class="content-image" src="${props?.src || ''}" alt="${props?.alt || ''}" ${styleStr ? `style="${styleStr}"` : ''} />`

    case 'Divider':
      return `<hr class="divider" ${styleStr ? `style="${styleStr}"` : ''} />`

    case 'Space':
      return isMobile ? '' : `<div class="space" ${styleStr ? `style="${styleStr}"` : ''}></div>`

    // 简历相关物料
    case 'PersonalInfo':
      return generatePersonalInfoHTML(props, styleStr)

    case 'WorkExperience':
      return generateWorkExperienceHTML(props, children, styleStr, version)

    case 'WorkExperienceItem':
    case 'ExperienceItem':
      return generateWorkItemHTML(props, children, styleStr, version)

    case 'Education':
      return generateEducationHTML(props, children, styleStr, version)

    case 'EducationItem':
      return generateEducationItemHTML(props, children, styleStr, version)

    case 'Skills':
      return generateSkillsHTML(props, styleStr)

    case 'Projects':
      return generateProjectsHTML(props, children, styleStr, version)

    case 'ProjectItem':
      return generateProjectItemHTML(props, children, styleStr, version)

    default: {
      // 默认处理：容器类型
      if (children && children.length > 0) {
        return `<div class="material-${type.toLowerCase()}" ${styleStr ? `style="${styleStr}"` : ''}>
  ${generateChildrenHTML(children, version)}
</div>`
      }
      // 叶子节点：提取文本内容
      const textContent = extractTextFromProps(props)
      if (!textContent) {
        return '' // 没有文本内容就不渲染
      }
      return `<p class="text-content" ${styleStr ? `style="${styleStr}"` : ''}>${textContent}</p>`
    }
  }
}

/**
 * 生成子节点HTML
 */
function generateChildrenHTML(
  children: NodeSchema[] | undefined,
  version: ExportHTMLVersion
): string {
  if (!children || children.length === 0) {
    return ''
  }
  return children.map(child => nodeToHTML(child, version)).join('\n')
}

/**
 * 生成个人信息HTML
 */
function generatePersonalInfoHTML(
  props: Record<string, any> | undefined,
  styleStr: string
): string {
  return `<section class="personal-info" ${styleStr ? `style="${styleStr}"` : ''}>
  <div class="info-main">
    ${props?.avatar ? `<img class="avatar" src="${props.avatar}" alt="${props?.name || '头像'}" />` : ''}
    <div class="info-text">
      <h1 class="name">${props?.name || ''}</h1>
      ${props?.title ? `<p class="job-title">${props.title}</p>` : ''}
    </div>
  </div>
  <div class="contact-info">
    ${props?.phone ? `<div class="contact-item"><svg class="icon" viewBox="0 0 24 24"><path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/><path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 00-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 00.043-1.391L6.859 3.513a1 1 0 00-1.391-.087l-2.17 1.861a1 1 0 00-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 00.648-.291l1.86-2.171a.997.997 0 00-.086-1.391l-4.064-3.696z"/></svg><a href="tel:${props.phone}">${props.phone}</a></div>` : ''}
    ${props?.email ? `<div class="contact-item"><svg class="icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 001.228 0L20 9.044 20.002 18H4z"/></svg><a href="mailto:${props.email}">${props.email}</a></div>` : ''}
    ${props?.location ? `<div class="contact-item"><svg class="icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg><span>${props.location}</span></div>` : ''}
    ${props?.website ? `<div class="contact-item"><svg class="icon" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm7.931 9h-2.764a14.67 14.67 0 00-1.792-6.243A8.013 8.013 0 0119.931 11zM12.53 4.027c1.035 1.364 2.427 3.78 2.627 6.973H9.03c.139-2.596.994-5.028 2.451-6.974.172-.01.344-.026.519-.026.179 0 .354.016.53.027zm-3.842.7C7.704 6.618 7.136 8.762 7.03 11H4.069a8.013 8.013 0 014.619-6.273zM4.069 13h2.974c.136 2.379.665 4.478 1.556 6.23A8.01 8.01 0 014.069 13zm7.381 6.973C10.049 18.275 9.222 15.896 9.041 13h6.113c-.208 2.773-1.117 5.196-2.603 6.972-.182.012-.364.028-.551.028-.186 0-.367-.016-.55-.027zm4.011-.772c.955-1.794 1.538-3.901 1.691-6.201h2.778a8.005 8.005 0 01-4.469 6.201z"/></svg><a href="${props.website}" target="_blank">${props.website.replace(/^https?:\/\//, '')}</a></div>` : ''}
  </div>
</section>`
}

/**
 * 生成工作经历HTML
 */
function generateWorkExperienceHTML(
  props: Record<string, any> | undefined,
  children: NodeSchema[] | undefined,
  styleStr: string,
  version: ExportHTMLVersion
): string {
  return `<section class="section work-experience" ${styleStr ? `style="${styleStr}"` : ''}>
  <h2 class="section-title">${props?.sectionTitle || '💼 工作经历'}</h2>
  <div class="section-content">
    ${generateChildrenHTML(children, version)}
  </div>
</section>`
}

/**
 * 生成教育经历HTML
 */
function generateEducationHTML(
  props: Record<string, any> | undefined,
  children: NodeSchema[] | undefined,
  styleStr: string,
  version: ExportHTMLVersion
): string {
  return `<section class="section education" ${styleStr ? `style="${styleStr}"` : ''}>
  <h2 class="section-title">${props?.sectionTitle || '🎓 教育经历'}</h2>
  <div class="section-content">
    ${generateChildrenHTML(children, version)}
  </div>
</section>`
}

/**
 * 生成技能HTML
 */
function generateSkillsHTML(props: Record<string, any> | undefined, styleStr: string): string {
  const skills = props?.skills || []

  return `<section class="section skills" ${styleStr ? `style="${styleStr}"` : ''}>
  <h2 class="section-title">${props?.sectionTitle || '⚡ 专业技能'}</h2>
  <div class="skills-grid">
    ${skills
      .map(
        (skill: any) => `<div class="skill-tag">
      ${skill.name || ''}${skill.level ? ` · ${skill.level}` : ''}
    </div>`
      )
      .join('\n    ')}
  </div>
</section>`
}

/**
 * 生成项目经历HTML
 */
function generateProjectsHTML(
  props: Record<string, any> | undefined,
  children: NodeSchema[] | undefined,
  styleStr: string,
  version: ExportHTMLVersion
): string {
  return `<section class="section projects" ${styleStr ? `style="${styleStr}"` : ''}>
  <h2 class="section-title">${props?.sectionTitle || '🚀 项目经历'}</h2>
  <div class="section-content">
    ${generateChildrenHTML(children, version)}
  </div>
</section>`
}

/**
 * 生成工作经历项HTML
 */
function generateWorkItemHTML(
  props: Record<string, any> | undefined,
  children: NodeSchema[] | undefined,
  styleStr: string,
  version: ExportHTMLVersion
): string {
  return `<div class="experience-item" ${styleStr ? `style="${styleStr}"` : ''}>
  <div class="experience-header">
    <div class="experience-title-group">
      ${props?.company ? `<strong class="experience-company">${props.company}</strong>` : ''}
      ${props?.position ? `<span class="experience-position">${props.position}</span>` : ''}
    </div>
    ${props?.startDate || props?.endDate ? `<div class="experience-date">${props.startDate || ''} - ${props.endDate || '至今'}</div>` : ''}
  </div>
  ${props?.location ? `<div class="experience-location">${props.location}</div>` : ''}
  ${props?.description ? `<p class="experience-desc">${props.description}</p>` : ''}
  ${children && children.length > 0 ? `<div class="experience-details">${generateChildrenHTML(children, version)}</div>` : ''}
  ${
    props?.achievements && Array.isArray(props.achievements) && props.achievements.length > 0
      ? `<ul class="experience-achievements">
    ${props.achievements.map((item: any) => `<li>${typeof item === 'string' ? item : item.content || ''}</li>`).join('\n    ')}
  </ul>`
      : ''
  }
</div>`
}

/**
 * 生成教育经历项HTML
 */
function generateEducationItemHTML(
  props: Record<string, any> | undefined,
  children: NodeSchema[] | undefined,
  styleStr: string,
  version: ExportHTMLVersion
): string {
  return `<div class="experience-item" ${styleStr ? `style="${styleStr}"` : ''}>
  <div class="experience-header">
    <div class="experience-title">
      ${props?.school ? `<strong>${props.school}</strong>` : ''}
      ${props?.major ? ` · ${props.major}` : ''}
    </div>
    ${props?.startDate || props?.endDate ? `<div class="experience-date">${props.startDate || ''} - ${props.endDate || '至今'}</div>` : ''}
  </div>
  ${props?.degree ? `<div class="experience-location">${props.degree}</div>` : ''}
  ${props?.gpa ? `<div class="experience-location">GPA: ${props.gpa}</div>` : ''}
  ${props?.description ? `<p class="experience-desc">${props.description}</p>` : ''}
  ${children && children.length > 0 ? `<div class="experience-details">${generateChildrenHTML(children, version)}</div>` : ''}
</div>`
}

/**
 * 生成项目经历项HTML
 */
function generateProjectItemHTML(
  props: Record<string, any> | undefined,
  children: NodeSchema[] | undefined,
  styleStr: string,
  version: ExportHTMLVersion
): string {
  return `<div class="experience-item" ${styleStr ? `style="${styleStr}"` : ''}>
  <div class="experience-header">
    <div class="experience-title">
      ${props?.projectName ? `<strong>${props.projectName}</strong>` : ''}
      ${props?.role ? ` · ${props.role}` : ''}
    </div>
    ${props?.startDate || props?.endDate ? `<div class="experience-date">${props.startDate || ''} - ${props.endDate || '至今'}</div>` : ''}
  </div>
  ${props?.projectType ? `<div class="experience-location">${props.projectType}</div>` : ''}
  ${props?.techStack ? `<div class="experience-location">技术栈: ${props.techStack}</div>` : ''}
  ${props?.description ? `<p class="experience-desc">${props.description}</p>` : ''}
  ${children && children.length > 0 ? `<div class="experience-details">${generateChildrenHTML(children, version)}</div>` : ''}
  ${
    props?.achievements && Array.isArray(props.achievements) && props.achievements.length > 0
      ? `<ul class="experience-achievements">
    ${props.achievements.map((item: any) => `<li>${typeof item === 'string' ? item : item.content || ''}</li>`).join('\n    ')}
  </ul>`
      : ''
  }
</div>`
}

/**
 * 从物料配置生成HTML内容
 */
function generateHTMLFromSchema(pageSchema: PageSchema, version: ExportHTMLVersion): string {
  // 如果没有物料配置，返回空页面
  if (!pageSchema || !pageSchema.root) {
    return generateEmptyHTML(version)
  }

  // 从根节点开始生成HTML
  const bodyContent = nodeToHTML(pageSchema.root, version)

  return generateFullHTML(bodyContent, pageSchema.meta?.title || '我的简历', version)
}

/**
 * 生成空页面HTML
 */
function generateEmptyHTML(version: ExportHTMLVersion): string {
  const doctype =
    version === 'html5'
      ? '<!DOCTYPE html>'
      : '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'

  return `${doctype}
<html${version === 'html5' ? '' : ' lang="zh-CN"'}>
<head>
  <meta charset="${version === 'html5' ? 'UTF-8' : 'utf-8'}">
  ${version === 'html5' ? '<meta name="viewport" content="width=device-width, initial-scale=1.0">' : ''}
  <title>简历</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="resume-container">
    <p class="empty-message">暂无内容</p>
  </div>
</body>
</html>`
}

/**
 * 生成完整的HTML文档
 */
function generateFullHTML(bodyContent: string, title: string, version: ExportHTMLVersion): string {
  const doctype =
    version === 'html5'
      ? '<!DOCTYPE html>'
      : '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'

  return `${doctype}
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  ${version === 'html5' ? '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">' : ''}
  ${version === 'html5' ? '<meta name="format-detection" content="telephone=yes">' : ''}
  ${version === 'html5' ? '<meta name="apple-mobile-web-app-capable" content="yes">' : ''}
  <title>${title}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="resume-container">
    ${bodyContent}
  </div>
</body>
</html>`
}

/**
 * 生成CSS样式
 */
function generateResumeCSS(version: ExportHTMLVersion): string {
  const isMobile = version === 'html5'

  if (isMobile) {
    // 移动端版本：精美、有呼吸感、优秀的阅读体验
    return `/* 简历样式 - 移动端优化版 */

/* ============== 基础样式 ============== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  line-height: 1.8;
  color: #2d2d2d;
  background: #fff;
  padding: 24px 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.resume-container {
  max-width: 720px;
  margin: 0 auto;
}

/* ============== 个人信息 ============== */
.personal-info {
  padding-bottom: 32px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 36px;
}

.info-main {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f5f5f5;
  flex-shrink: 0;
}

.info-text {
  flex: 1;
}

.name {
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
  letter-spacing: -0.3px;
  line-height: 1.3;
}

.job-title {
  font-size: 15px;
  color: #666;
  font-weight: 400;
  line-height: 1.5;
}

.contact-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #555;
}

.contact-item .icon {
  width: 18px;
  height: 18px;
  fill: #888;
  flex-shrink: 0;
}

.contact-item a {
  color: #2d2d2d;
  text-decoration: none;
  font-weight: 500;
}

.contact-item a:active {
  opacity: 0.6;
}

/* ============== 章节样式 ============== */
.section {
  margin-bottom: 40px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e8e8e8;
  letter-spacing: -0.3px;
}

.section-content {
  line-height: 1.8;
}

/* ============== 经历项目 ============== */
.experience-item {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.experience-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  gap: 12px;
}

.experience-title-group {
  flex: 1;
  min-width: 0;
}

.experience-company {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  display: block;
  margin-bottom: 4px;
}

.experience-position {
  font-size: 15px;
  color: #555;
  font-weight: 500;
  display: block;
  line-height: 1.4;
}

.experience-date {
  font-size: 13px;
  color: #888;
  font-weight: 500;
  flex-shrink: 0;
  white-space: nowrap;
}

.experience-location {
  font-size: 13px;
  color: #888;
  margin-bottom: 10px;
  font-weight: 500;
}

.experience-desc {
  font-size: 15px;
  color: #444;
  line-height: 1.8;
  margin: 12px 0;
}

.experience-details {
  margin: 12px 0;
}

.experience-achievements {
  margin: 12px 0 0 0;
  padding-left: 0;
  list-style: none;
}

.experience-achievements li {
  font-size: 14px;
  color: #555;
  line-height: 1.8;
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
}

.experience-achievements li:before {
  content: '•';
  position: absolute;
  left: 6px;
  color: #999;
  font-weight: 700;
}

/* ============== 技能标签 ============== */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  background: #f5f5f5;
  color: #2d2d2d;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid #e8e8e8;
}

/* ============== 文本内容 ============== */
.text-content {
  font-size: 15px;
  line-height: 1.8;
  color: #444;
  margin-bottom: 16px;
}

.heading-1 { 
  font-size: 22px; 
  font-weight: 700; 
  color: #1a1a1a; 
  margin: 24px 0 12px; 
  line-height: 1.4;
  letter-spacing: -0.3px;
}

.heading-2 { 
  font-size: 19px; 
  font-weight: 700; 
  color: #1a1a1a; 
  margin: 20px 0 10px; 
  line-height: 1.4;
  letter-spacing: -0.3px;
}

.heading-3 { 
  font-size: 17px; 
  font-weight: 700; 
  color: #1a1a1a; 
  margin: 18px 0 8px; 
  line-height: 1.4;
  letter-spacing: -0.3px;
}

/* ============== 图片和分隔线 ============== */
.content-image {
  width: 100%;
  height: auto;
  margin: 20px 0;
  border-radius: 8px;
}

.divider {
  border: none;
  border-top: 1px solid #e8e8e8;
  margin: 28px 0;
}

/* ============== 深色模式 ============== */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #e0e0e0;
  }
  
  .name,
  .heading-1,
  .heading-2,
  .heading-3,
  .section-title {
    color: #f5f5f5;
  }
  
  .text-content {
    color: #c0c0c0;
  }
  
  .contact-item {
    color: #aaa;
  }
  
  .job-title {
    color: #999;
  }
  
  .contact-item .icon {
    fill: #888;
  }
  
  .contact-item a {
    color: #d0d0d0;
  }
  
  .avatar {
    border-color: #2d2d2d;
  }
  
  .personal-info,
  .section-title,
  .divider {
    border-color: #2d2d2d;
  }
  
  .skill-tag {
    background: #252525;
    color: #d0d0d0;
    border-color: #333;
  }
  
  .experience-item {
    border-bottom-color: #2d2d2d;
  }
  
  .experience-company {
    color: #f5f5f5;
  }
  
  .experience-position {
    color: #aaa;
  }
  
  .experience-date,
  .experience-location {
    color: #888;
  }
  
  .experience-desc {
    color: #b0b0b0;
  }
  
  .experience-achievements li {
    color: #aaa;
  }
  
  .experience-achievements li:before {
    color: #666;
  }
}
`
  } else {
    // PC版本：保留打印优化
    return `/* 简历样式 - PC桌面版 */

/* ============== 基础样式 ============== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  background: #f5f5f5;
  padding: 20px;
}

.resume-container {
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: #fff;
  padding: 20mm;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* ============== 个人信息 ============== */
.personal-info {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #e8e8e8;
  margin-bottom: 20px;
}

.avatar-wrapper {
  margin-bottom: 15px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.name {
  font-size: 28px;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 8px;
}

.job-title {
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #555;
}

.contact-item .icon {
  width: 14px;
  height: 14px;
  fill: #666;
}

.contact-item a {
  color: #0066cc;
  text-decoration: none;
}

/* ============== 章节样式 ============== */
.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #2d2d2d;
}

.section-content {
  line-height: 1.6;
}

/* ============== 经历项目 ============== */
.experience-item {
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.experience-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
  gap: 10px;
}

.experience-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #2d2d2d;
}

.experience-date {
  flex-shrink: 0;
  font-size: 12px;
  color: #666;
}

.experience-location {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.experience-desc {
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  margin: 8px 0;
}

.experience-details {
  margin: 8px 0;
}

.experience-achievements {
  margin: 8px 0;
  padding-left: 18px;
}

.experience-achievements li {
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 4px;
}

/* ============== 技能标签 ============== */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.skill-tag {
  padding: 8px 12px;
  background: #f8f8f8;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

/* ============== 文本内容 ============== */
.text-content {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 10px;
}

.heading-1 { font-size: 18px; font-weight: 700; color: #2d2d2d; margin: 16px 0 8px; }
.heading-2 { font-size: 16px; font-weight: 700; color: #2d2d2d; margin: 14px 0 8px; }
.heading-3 { font-size: 15px; font-weight: 700; color: #2d2d2d; margin: 12px 0 8px; }

/* ============== 图片和分隔线 ============== */
.content-image {
  max-width: 100%;
  height: auto;
  margin: 12px 0;
}

.divider {
  border: none;
  border-top: 1px solid #e8e8e8;
  margin: 20px 0;
}

/* ============== 打印优化 ============== */
@media print {
  body {
    background: #fff;
    padding: 0;
  }
  
  .resume-container {
    box-shadow: none;
    margin: 0;
    padding: 15mm;
    page-break-after: always;
  }
  
  .contact-item a {
    color: #333;
    text-decoration: none;
  }
}
`
  }
}

/**
 * 生成README文件
 */
function generateREADME(version: ExportHTMLVersion): string {
  return `# 简历导出

此文件夹包含导出的简历 HTML 文件。

## 文件说明

- \`index.html\` - 简历主文件
- \`styles.css\` - 样式文件
- \`README.md\` - 说明文档

## 版本信息

- **导出版本**: ${version === 'html5' ? 'HTML5 移动端版' : 'PC 桌面端版'}
- **导出时间**: ${new Date().toLocaleString('zh-CN')}

## 版本特性

${
  version === 'html5'
    ? `### 移动端优化版

本版本专为移动设备优化，提供最佳的手机阅读体验：

✨ **核心特性**
- 📱 移动端专属排版设计
- 📜 连续滚动阅读，无分页
- 🌓 自动适配深色模式
- 👆 优化触摸交互体验
- 📏 大字体，高行距，易阅读
- ⚡ 流畅的滚动性能

📱 **最佳体验**
- 建议在手机浏览器中打开
- 支持所有现代移动浏览器
- 支持竖屏/横屏自动适配
- 自动识别电话号码（可点击拨打）

🎯 **适用场景**
- 手机上查看简历
- 微信/短信分享简历
- 在线简历链接
- 移动端在线展示`
    : `### 桌面端打印版

本版本针对桌面浏览器和打印进行优化：

✨ **核心特性**
- 🖥️ 桌面浏览器优化
- 📄 A4纸张标准尺寸 (210mm × 297mm)
- 🖨️ 完美打印支持
- 📑 多页面分页显示
- 💼 专业商务风格

💻 **最佳体验**
- 建议在桌面浏览器中打开
- 支持Chrome、Firefox、Safari、Edge
- 打印前建议预览效果
- 支持导出为PDF（浏览器打印功能）

🎯 **适用场景**
- 桌面电脑查看简历
- 打印纸质简历
- 导出PDF文件
- 商务正式场合`
}

## 使用说明

1. **查看简历**: 直接在浏览器中打开 \`index.html\`
2. **分享简历**: ${version === 'html5' ? '可通过微信、邮件等方式分享文件' : '建议打印或导出PDF后分享'}
3. **部署在线**: 可以部署到任何Web服务器或静态网站托管服务

${
  version === 'pc'
    ? `
## 打印说明

1. 在浏览器中打开 \`index.html\`
2. 使用快捷键 \`Ctrl+P\` (Windows) 或 \`Cmd+P\` (Mac) 打开打印对话框
3. 选择"保存为PDF"可以导出PDF文件
4. 建议打印设置：
   - 纸张大小：A4
   - 边距：无边距
   - 背景图形：启用
`
    : ''
}

## 技术说明

- HTML5 标准
- CSS3 样式
- 纯静态文件，无需服务器
- 从简历数据直接生成，完全可控

---

💡 如有问题，请查看浏览器控制台的错误信息。
`
}

/**
 * 导出HTML到ZIP文件
 */
export async function exportHTML(options: HTMLExportOptions): Promise<void> {
  const { version, pageSchema } = options

  // 检查pageSchema
  if (!pageSchema || !pageSchema.root) {
    throw new Error('简历数据为空')
  }

  const zip = new JSZip()

  // 从pageSchema生成HTML
  const htmlContent = generateHTMLFromSchema(pageSchema, version)

  // 生成CSS
  const cssContent = generateResumeCSS(version)

  // 添加文件到ZIP
  zip.file('index.html', htmlContent)
  zip.file('styles.css', cssContent)
  zip.file('README.md', generateREADME(version))

  // 生成ZIP文件
  const blob = await zip.generateAsync({ type: 'blob' })

  // 下载文件
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `resume-${version}-${Date.now()}.zip`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
