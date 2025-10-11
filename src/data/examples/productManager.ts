/**
 * 产品经理简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const productManagerExample: ExampleResume = {
  id: 'example-product-manager',
  name: '产品经理简历',
  category: '产品',
  description: '适合产品经理、产品运营等岗位',
  tags: ['产品', '产品经理', '互联网'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '产品经理简历示例',
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
            name: '李思',
            title: '高级产品经理',
            phone: '139-0000-0000',
            email: 'lisi@example.com',
            location: '上海·浦东新区',
            website: 'www.lisi-portfolio.com',
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
                  '5年+互联网产品经验，擅长从0到1打造产品，成功主导过多个百万级用户产品。具备优秀的需求分析、数据分析和项目管理能力，注重用户体验和商业价值平衡。',
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
                company: '互联网大厂',
                position: '高级产品经理',
                startDate: '2021.01',
                endDate: '至今',
                location: '上海',
                description: '负责核心产品的规划和迭代',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '主导产品从0到1，上线后6个月获得100万+用户，月活跃率达45%',
                      '优化用户转化漏斗，付费转化率提升60%，年营收增长300万',
                      '建立数据驱动的产品迭代机制，通过A/B测试优化核心功能',
                      '跨部门协作推进项目，管理研发、设计、运营团队高效配合',
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
                name: 'SaaS 产品从 0 到 1',
                role: '产品负责人',
                startDate: '2022.03',
                endDate: '2023.06',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '市场调研：访谈50+目标用户，分析10+竞品，确定差异化定位',
                      '产品设计：设计核心功能和交互流程，输出PRD 30+篇',
                      '上线成果：6个月获得付费企业客户200+，NPS达70+',
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
            title: '核心技能',
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
                  { name: '产品规划与设计', level: 90 },
                  { name: '需求分析', level: 90 },
                  { name: '数据分析', level: 85 },
                  { name: '项目管理', level: 85 },
                  { name: '用户研究', level: 80 },
                  { name: 'Axure / Figma', level: 85 },
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
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'EducationItem',
              props: {
                school: '某某大学',
                major: '工商管理',
                degree: '本科',
                startDate: '2013.09',
                endDate: '2017.06',
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
