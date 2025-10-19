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
                  '8年+人力资源管理经验（一级人力资源管理师），熟悉六大模块，擅长人才体系搭建和组织发展。',
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
                description:
                  '<ul><li>搭建完整招聘体系，年招聘200+人才，离职率控制在8%</li><li>设计实施OKR绩效体系，员工满意度提升40%</li><li>建立人才发展计划，培养储备干部30+人</li><li>优化薪酬福利体系，保留核心人才，具备行业竞争力</li></ul>',
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
                  '<ul><li><strong>核心能力：</strong>8年+HR经验，熟悉六大模块，擅长人才体系搭建和组织发展</li><li><strong>招聘培训：</strong>精通招聘管理、人才选拔、培训体系搭建</li><li><strong>绩效薪酬：</strong>掌握绩效考核、薪酬设计、激励机制</li><li><strong>综合能力：</strong>具备HRBP思维、员工关系管理、劳动法实务经验</li></ul>',
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
