/**
 * UI设计师简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const uiDesignerExample: ExampleResume = {
  id: 'example-ui-designer',
  name: 'UI设计师简历',
  category: '设计',
  description: '适合UI设计师、视觉设计师等岗位',
  tags: ['设计', 'UI', 'UX'],
  schema: {
    version: '1.0.0',
    meta: {
      title: 'UI设计师简历示例',
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
            name: '王美',
            title: 'UI/UX 设计师',
            phone: '186-0000-0000',
            email: 'wangmei@example.com',
            location: '深圳·南山区',
            portfolio: 'behance.net/wangmei',
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
            icon: '✨',
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
                  '4年+互联网产品设计经验，擅长移动端和Web端界面设计。注重用户体验和视觉美感的平衡，熟悉设计系统搭建和规范化流程。作品多次获得设计奖项。',
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
                company: '互联网公司',
                position: 'UI/UX 设计师',
                startDate: '2020.07',
                endDate: '至今',
                location: '深圳',
                description: '负责多个产品的视觉和交互设计',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '主导公司设计系统建设，统一视觉语言，提升设计效率40%',
                      '设计的移动应用获得 App Store 精品推荐，用户好评率95%',
                      '优化产品交互流程，用户完成率提升35%，流失率降低20%',
                      '协助产品经理进行用户研究和可用性测试',
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
            icon: '🎨',
          },
          style: {
            marginBottom: '24px',
          },
          children: [
            {
              id: nanoid(),
              type: 'ProjectItem',
              props: {
                name: '企业级设计系统',
                role: '主设计师',
                startDate: '2022.01',
                endDate: '2023.12',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '搭建包含200+组件的设计系统，覆盖Web和移动端',
                      '制定设计规范和组件使用文档，团队协作效率提升50%',
                      '设计系统已被3个产品线采用，统一品牌形象',
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
            title: '专业技能',
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
                content:
                  '<ul><li>精通 Figma、Sketch 等主流设计工具</li><li>熟练使用 Adobe Creative Suite（PS、AI、AE等）</li><li>掌握交互设计原则和方法论</li><li>具备完整的原型设计能力</li><li>了解用户研究和可用性测试</li><li>掌握基础的 HTML/CSS，能与开发高效协作</li></ul>',
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
                school: '某某美术学院',
                major: '视觉传达设计',
                degree: '本科',
                startDate: '2016.09',
                endDate: '2020.06',
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
            title: '获奖经历',
            icon: '🏆',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'TextBlock',
              props: {
                content:
                  '• 站酷网年度推荐设计师\n• iF 设计奖入围作品\n• 公司年度最佳设计师（2022、2023）',
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
