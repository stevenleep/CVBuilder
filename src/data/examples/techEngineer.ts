/**
 * 前端工程师简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const techEngineerExample: ExampleResume = {
  id: 'example-tech-engineer',
  name: '前端工程师简历',
  category: '技术',
  description: '适合前端开发、全栈工程师等技术岗位',
  tags: ['技术', '前端', '工程师'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '前端工程师简历示例',
      description: '使用 CVKit 创建',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    },
    root: {
      id: nanoid(),
      type: 'Page',
      props: {},
      style: {
        padding: '40px',
        backgroundColor: '#ffffff',
      },
      children: [
        {
          id: nanoid(),
          type: 'PersonalInfo',
          props: {
            name: '张三',
            title: '高级前端工程师',
            phone: '138-0000-0000',
            email: 'zhangsan@example.com',
            location: '北京·朝阳区',
            github: 'github.com/zhangsan',
          },
          style: {
            marginBottom: '32px',
          },
          children: [],
        },
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '个人简介',
            icon: '👤',
          },
          style: {
            marginBottom: '24px',
          },
          children: [
            {
              id: nanoid(),
              type: 'TextBlock',
              props: {
                content:
                  '5年+前端开发经验，精通 React/Vue 生态，熟悉前端工程化和性能优化。有大型项目架构经验，热爱开源，注重代码质量和用户体验。',
              },
              style: {},
              children: [],
            },
          ],
        },
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '工作经历',
            icon: '💼',
          },
          style: {
            marginBottom: '24px',
          },
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
                description: '负责公司核心产品的前端架构设计和开发',
              },
              style: {
                marginBottom: '20px',
              },
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '主导前端架构升级，性能提升 40%，首屏加载时间减少 60%',
                      '搭建微前端框架，支持多团队协作开发，提升开发效率 30%',
                      '建立组件库和设计系统，统一视觉规范，提升产品一致性',
                      '指导 3 名初级工程师，进行代码审查和技术分享',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
            {
              id: nanoid(),
              type: 'ExperienceItem',
              props: {
                company: '互联网公司',
                position: '前端工程师',
                startDate: '2019.03',
                endDate: '2021.05',
                location: '北京',
                description: '参与多个 ToB/ToC 产品的前端开发',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '使用 React + TypeScript 开发企业级后台管理系统',
                      '实现复杂的数据可视化图表，支持实时数据更新',
                      '优化打包配置，代码分割和懒加载，减少包体积 50%',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '项目经验',
            icon: '🚀',
          },
          style: {
            marginBottom: '24px',
          },
          children: [
            {
              id: nanoid(),
              type: 'ProjectItem',
              props: {
                name: '企业级数据平台',
                role: '前端负责人',
                startDate: '2022.01',
                endDate: '2023.12',
                tech: 'React, TypeScript, Ant Design, ECharts',
              },
              style: {
                marginBottom: '20px',
              },
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '设计并实现了灵活的数据可视化配置系统，支持拖拽式搭建',
                      '实现了复杂的权限管理系统，支持细粒度的权限控制',
                      '优化大数据量渲染性能，使用虚拟滚动等技术，流畅展示10万+条数据',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '技能特长',
            icon: '💡',
          },
          style: {
            marginBottom: '24px',
          },
          children: [
            {
              id: nanoid(),
              type: 'SkillList',
              props: {
                skills: [
                  { name: 'React / Vue', level: 90 },
                  { name: 'TypeScript', level: 85 },
                  { name: 'Node.js', level: 75 },
                  { name: '前端工程化', level: 85 },
                  { name: '性能优化', level: 80 },
                  { name: 'UI/UX 设计', level: 70 },
                ],
              },
              style: {},
              children: [],
            },
          ],
        },
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '教育背景',
            icon: '🎓',
          },
          style: {
            marginBottom: '24px',
          },
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
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      'GPA: 3.8/4.0，专业排名前10%',
                      '获得国家奖学金、校级一等奖学金',
                      '担任计算机协会技术部部长',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '个人作品',
            icon: '🏆',
          },
          style: {
            marginBottom: '24px',
          },
          children: [
            {
              id: nanoid(),
              type: 'TextBlock',
              props: {
                content:
                  '• GitHub：累计获得 5000+ stars，活跃贡献者\n• 开源项目：维护前端组件库，周下载量 10000+\n• 技术博客：掘金 LV5，文章阅读量 50万+\n• 演讲分享：多次在技术大会分享前端实践',
              },
              style: {},
              children: [],
            },
          ],
        },
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '证书/获奖',
            icon: '🏅',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'TextBlock',
              props: {
                content:
                  '• 阿里云 ACP 云计算专业认证\n• 2023年度公司优秀员工\n• 黑客马拉松大赛一等奖',
              },
              style: {},
              children: [],
            },
          ],
        },
      ],
    },
  },
}
