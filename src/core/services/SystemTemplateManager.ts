/**
 * 系统预置模板管理器
 *
 * 提供常用的系统级模板
 */

import { NodeSchema } from '@/types/material'
import { nanoid } from 'nanoid'

export interface SystemTemplate {
  id: string
  name: string
  description: string
  category: 'system'
  schema: NodeSchema
  icon?: string
}

/**
 * 创建个人信息模板
 */
const createPersonalInfoTemplate = (): SystemTemplate => {
  return {
    id: 'sys-personal-info',
    name: '个人信息模板',
    description: '包含完整的个人信息展示',
    category: 'system',
    schema: {
      id: nanoid(),
      type: 'PersonalInfo',
      props: {
        name: '张三',
        title: '高级前端工程师',
        phone: '138-0000-0000',
        email: 'zhangsan@example.com',
        location: '北京市',
        website: '',
        github: '',
        linkedin: '',
      },
      style: {},
      children: [],
    },
  }
}

/**
 * 创建工作经历模板（包含3个工作经历）
 */
const createWorkExperienceTemplate = (): SystemTemplate => {
  return {
    id: 'sys-work-experience',
    name: '工作经历模板',
    description: '包含3个工作经历示例',
    category: 'system',
    schema: {
      id: nanoid(),
      type: 'WorkExperienceSection',
      props: {
        title: '工作经历',
      },
      style: {},
      children: [
        {
          id: nanoid(),
          type: 'ExperienceItem',
          props: {
            company: '某科技公司',
            position: '高级前端工程师',
            startDate: '2022.03',
            endDate: '至今',
            location: '北京',
            description:
              '<ul><li>负责公司核心产品的前端架构设计和开发</li><li>带领5人团队完成多个重要项目</li><li>推动前端技术栈升级，提升开发效率30%</li></ul>',
          },
          style: {},
          children: [],
        },
        {
          id: nanoid(),
          type: 'ExperienceItem',
          props: {
            company: '互联网公司',
            position: '前端工程师',
            startDate: '2020.07',
            endDate: '2022.02',
            location: '上海',
            description:
              '<ul><li>参与多个To B产品的前端开发</li><li>负责组件库的设计和实现</li><li>优化页面性能，提升用户体验</li></ul>',
          },
          style: {},
          children: [],
        },
        {
          id: nanoid(),
          type: 'ExperienceItem',
          props: {
            company: '创业公司',
            position: '前端开发实习生',
            startDate: '2019.07',
            endDate: '2020.06',
            location: '深圳',
            description:
              '<ul><li>参与公司官网和管理后台的开发</li><li>学习并实践React技术栈</li><li>协助团队完成产品迭代</li></ul>',
          },
          style: {},
          children: [],
        },
      ],
    },
  }
}

/**
 * 创建项目经历模板（包含3个项目）
 */
const createProjectTemplate = (): SystemTemplate => {
  return {
    id: 'sys-project',
    name: '项目经历模板',
    description: '包含3个项目经历示例',
    category: 'system',
    schema: {
      id: nanoid(),
      type: 'ProjectSection',
      props: {
        title: '项目经历',
      },
      style: {},
      children: [
        {
          id: nanoid(),
          type: 'ProjectItem',
          props: {
            projectName: '电商平台前端系统',
            projectType: '商业项目',
            role: '前端负责人',
            startDate: '2022.06',
            endDate: '2023.12',
            techStack: 'React, TypeScript, Next.js, Redux, Ant Design',
            description:
              '<ul><li>负责电商平台的前端架构设计和开发</li><li>实现商品展示、购物车、订单管理等核心功能</li></ul>',
            achievements:
              '<ul><li>页面加载速度提升40%</li><li>支持日均10万+用户访问</li><li>代码可维护性显著提升</li></ul>',
          },
          style: {},
          children: [],
        },
        {
          id: nanoid(),
          type: 'ProjectItem',
          props: {
            projectName: '企业管理系统',
            projectType: '商业项目',
            role: '核心开发',
            startDate: '2021.03',
            endDate: '2022.05',
            techStack: 'Vue3, Element Plus, Vuex, Axios',
            description:
              '<ul><li>开发企业内部管理系统</li><li>实现权限管理、数据统计等功能</li></ul>',
            achievements: '<ul><li>提升企业运营效率20%</li><li>获得客户高度认可</li></ul>',
          },
          style: {},
          children: [],
        },
        {
          id: nanoid(),
          type: 'ProjectItem',
          props: {
            projectName: '个人博客系统',
            projectType: '个人项目',
            role: '全栈开发',
            startDate: '2020.08',
            endDate: '2021.02',
            techStack: 'React, Node.js, Express, MongoDB',
            githubUrl: 'https://github.com/example/blog',
            description:
              '<ul><li>设计并实现个人博客系统</li><li>包含文章管理、评论系统、用户认证等功能</li></ul>',
          },
          style: {},
          children: [],
        },
      ],
    },
  }
}

/**
 * 创建教育经历模板
 */
const createEducationTemplate = (): SystemTemplate => {
  return {
    id: 'sys-education',
    name: '教育经历模板',
    description: '包含教育背景信息',
    category: 'system',
    schema: {
      id: nanoid(),
      type: 'EducationSection',
      props: {
        title: '教育背景',
      },
      style: {},
      children: [
        {
          id: nanoid(),
          type: 'EducationItem',
          props: {
            school: '某某大学',
            major: '计算机科学与技术',
            degree: '本科',
            startDate: '2016.09',
            endDate: '2020.06',
            gpa: '3.8/4.0',
            description:
              '<ul><li>主修课程：数据结构、算法、操作系统、计算机网络</li><li>获得校级一等奖学金</li><li>参与多个科研项目</li></ul>',
          },
          style: {},
          children: [],
        },
      ],
    },
  }
}

/**
 * 创建技能模板
 */
const createSkillsTemplate = (): SystemTemplate => {
  return {
    id: 'sys-skills',
    name: '技能模板',
    description: '包含技能展示',
    category: 'system',
    schema: {
      id: nanoid(),
      type: 'SkillsSection',
      props: {
        title: '专业技能',
      },
      style: {},
      children: [
        {
          id: nanoid(),
          type: 'SkillRating',
          props: {
            skills: [
              { name: 'React', level: 5 },
              { name: 'Vue.js', level: 5 },
              { name: 'TypeScript', level: 4 },
              { name: 'Node.js', level: 4 },
              { name: 'Webpack', level: 3 },
            ],
            maxLevel: 5,
            showDots: true,
          },
          style: {},
          children: [],
        },
      ],
    },
  }
}

/**
 * 系统模板管理器
 */
class SystemTemplateManager {
  private static instance: SystemTemplateManager
  private templates: Map<string, SystemTemplate> = new Map()

  private constructor() {
    this.initTemplates()
  }

  public static getInstance(): SystemTemplateManager {
    if (!SystemTemplateManager.instance) {
      SystemTemplateManager.instance = new SystemTemplateManager()
    }
    return SystemTemplateManager.instance
  }

  /**
   * 初始化系统模板
   */
  private initTemplates(): void {
    const templates = [
      createPersonalInfoTemplate(),
      createWorkExperienceTemplate(),
      createProjectTemplate(),
      createEducationTemplate(),
      createSkillsTemplate(),
    ]

    templates.forEach(template => {
      this.templates.set(template.id, template)
    })
  }

  /**
   * 获取所有系统模板
   */
  public getAllTemplates(): SystemTemplate[] {
    return Array.from(this.templates.values())
  }

  /**
   * 获取指定模板
   */
  public getTemplate(id: string): SystemTemplate | undefined {
    return this.templates.get(id)
  }
}

export const systemTemplateManager = SystemTemplateManager.getInstance()
