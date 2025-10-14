/**
 * 人力资源经理简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const hrManagerExample: ExampleResume = {
  id: 'example-hr-manager',
  name: '人力资源经理简历',
  category: '人力资源',
  description: '适合HR、招聘、培训等岗位',
  tags: ['HR', '招聘', '人力资源'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '人力资源经理简历示例',
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
            name: '周慧',
            title: '人力资源经理',
            phone: '136-0000-0000',
            email: 'zhouhui@example.com',
            location: '北京·海淀区',
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
                  '8年+人力资源管理经验，熟悉招聘、培训、绩效、薪酬等全模块。成功搭建过多家公司的人才体系，擅长组织发展和人才梯队建设。持有一级人力资源管理师证书。',
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
                company: '互联网科技公司',
                position: '人力资源经理',
                startDate: '2019.05',
                endDate: '至今',
                location: '北京',
                description: '负责公司人力资源全模块管理',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '搭建完整的招聘体系，年招聘200+优秀人才，离职率控制在8%以内',
                      '设计并实施OKR绩效管理体系，员工满意度提升40%',
                      '建立人才发展计划，培养储备干部30+人',
                      '优化薪酬福利体系，具有行业竞争力，保留核心人才',
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
                  '<ul><li>精通招聘管理和人才选拔</li><li>掌握培训体系搭建和人才发展</li><li>熟练进行绩效管理和考核体系设计</li><li>了解薪酬福利设计和激励机制</li><li>具备员工关系管理和劳动法实务经验</li><li>拥有 HRBP 业务伙伴思维和实践</li></ul>',
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
                major: '人力资源管理',
                degree: '本科',
                startDate: '2012.09',
                endDate: '2016.06',
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
