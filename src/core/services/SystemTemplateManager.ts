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
    name: '个人信息',
    description: '简洁专业的个人信息展示',
    category: 'system',
    schema: {
      id: nanoid(),
      type: 'PersonalInfo',
      props: {
        name: '张明',
        title: '高级前端工程师',
        phone: '138-0000-0000',
        email: 'zhangming@example.com',
        currentLocation: '',
        github: 'github.com/zhangming',
        workYears: '5',
        align: 'left',
      },
      style: {},
      children: [],
    },
  }
}

/**
 * 创建工作经历模板（包含2个精简的工作经历）
 */
const createWorkExperienceTemplate = (): SystemTemplate => {
  return {
    id: 'sys-work-experience',
    name: '工作经历',
    description: '清晰展示工作经验与成就',
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
            company: '某科技有限公司',
            position: '高级前端工程师',
            startDate: '2021.06',
            endDate: '至今',
            location: '北京',
            description:
              '<ul><li>负责企业级管理系统的前端架构设计与核心功能开发</li><li>主导技术选型，采用 React + TypeScript 技术栈，提升代码可维护性</li><li>优化构建流程，首屏加载时间减少 40%，提升用户体验</li><li>指导初级工程师，推动团队技术能力提升</li></ul>',
          },
          style: {},
          children: [],
        },
        {
          id: nanoid(),
          type: 'ExperienceItem',
          props: {
            company: '某互联网公司',
            position: '前端工程师',
            startDate: '2019.07',
            endDate: '2021.05',
            location: '上海',
            description:
              '<ul><li>参与电商平台前端开发，负责商品详情、购物车等核心模块</li><li>封装通用业务组件，提高团队开发效率 30%</li><li>配合后端完成接口对接，解决跨域、性能等问题</li></ul>',
          },
          style: {},
          children: [],
        },
      ],
    },
  }
}

/**
 * 创建项目经历模板（包含2个精选项目）
 */
const createProjectTemplate = (): SystemTemplate => {
  return {
    id: 'sys-project',
    name: '项目经历',
    description: '突出项目价值与技术亮点',
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
            projectName: '企业级管理平台',
            projectType: '商业项目',
            role: '前端负责人',
            startDate: '2022.03',
            endDate: '2023.08',
            techStack: 'React 18, TypeScript, Ant Design, Redux Toolkit',
            teamSize: '6',
            userScale: '5000+',
            description:
              '<ul><li>负责平台整体前端架构设计，统一技术栈与开发规范</li><li>实现复杂的权限控制、数据可视化、工作流引擎等核心功能</li><li>建立组件库与工具函数库，提升团队协作效率</li></ul>',
            achievements:
              '<ul><li>页面响应速度提升 50%，首屏加载优化至 1.2s 内</li><li>成功支持 5000+ 企业用户稳定运行，零重大故障</li><li>代码复用率达 60%，显著降低维护成本</li></ul>',
          },
          style: {},
          children: [],
        },
        {
          id: nanoid(),
          type: 'ProjectItem',
          props: {
            projectName: '在线教育 H5 应用',
            projectType: '商业项目',
            role: '核心开发',
            startDate: '2021.06',
            endDate: '2022.02',
            techStack: 'Vue 3, Vite, Pinia, Vant',
            userScale: '10万+',
            description:
              '<ul><li>开发移动端在线学习平台，包含课程播放、在线答题、学习报告等功能</li><li>适配多种机型与浏览器，确保良好兼容性</li><li>优化视频播放体验，实现断点续播、倍速播放等特性</li></ul>',
            achievements:
              '<ul><li>上线 3 个月内获得 10 万+ 用户，日活跃用户 2 万+</li><li>用户满意度达 4.7/5.0</li></ul>',
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
    name: '教育背景',
    description: '简明扼要的教育信息',
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
            startDate: '2015.09',
            endDate: '2019.06',
            gpa: '3.6/4.0',
            description:
              '<ul><li>核心课程：数据结构与算法、操作系统、计算机网络、数据库原理</li><li>获得国家励志奖学金、校级三好学生</li></ul>',
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
    name: '专业技能',
    description: '清晰展示技术能力',
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
              { name: 'React / Vue.js', level: 5 },
              { name: 'TypeScript', level: 5 },
              { name: 'HTML / CSS / JavaScript', level: 5 },
              { name: 'Webpack / Vite', level: 4 },
              { name: 'Node.js', level: 4 },
              { name: 'Git', level: 4 },
            ],
            maxLevel: 5,
            showDots: true,
            layout: 'grid',
            columns: 2,
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
