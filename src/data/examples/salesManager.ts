/**
 * 销售经理简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const salesManagerExample: ExampleResume = {
  id: 'example-sales-manager',
  name: '销售经理简历',
  category: '销售',
  description: '适合销售经理、大客户经理等岗位',
  tags: ['销售', 'BD', '客户'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '销售经理简历示例',
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
            name: '郑达',
            title: '大客户销售经理',
            phone: '188-0000-0000',
            email: 'zhengda@example.com',
            location: '深圳·福田区',
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
                  '5年+B2B销售经验，擅长大客户开发和维护。累计签约客户100+家，年销售额超5000万。具备优秀的沟通谈判能力和商务拓展能力。',
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
                company: 'SaaS 软件公司',
                position: '大客户销售经理',
                startDate: '2019.09',
                endDate: '至今',
                location: '深圳',
                description: '负责企业级客户的开发和维护',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '独立开发50+大客户，年销售额达3000万+，超额完成业绩150%',
                      '签约多家世界500强企业，包括腾讯、华为等标杆客户',
                      '客户续约率达85%，NPS评分90+',
                      '建立销售方法论并培训新人，团队业绩提升40%',
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
            title: '业绩亮点',
            icon: '🎯',
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
                  '• 2023年度销售冠军：年度销售额3500万，完成率175%\n• 标杆客户：成功签约腾讯、华为、字节跳动等头部企业\n• 客户满意度：NPS评分92，客户续约率85%\n• 团队贡献：培养销售新人5名，平均业绩达标率90%',
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
            title: '核心能力',
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
                  { name: '大客户开发', level: 95 },
                  { name: '商务谈判', level: 90 },
                  { name: '方案呈现', level: 85 },
                  { name: '客户关系管理', level: 90 },
                  { name: '团队管理', level: 80 },
                  { name: 'CRM系统', level: 75 },
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
                major: '市场营销',
                degree: '本科',
                startDate: '2015.09',
                endDate: '2019.06',
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
