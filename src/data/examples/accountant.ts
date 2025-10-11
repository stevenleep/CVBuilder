/**
 * 会计/财务简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const accountantExample: ExampleResume = {
  id: 'example-accountant',
  name: '会计师简历',
  category: '财务',
  description: '适合会计、财务分析等岗位',
  tags: ['财务', '会计', 'CPA'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '会计师简历示例',
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
            name: '吴财',
            title: '注册会计师 CPA',
            phone: '159-0000-0000',
            email: 'wucai@example.com',
            location: '广州·天河区',
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
                  '7年+财务会计经验，持有注册会计师（CPA）证书。熟悉企业全盘账务处理、税务筹划和财务分析。有上市公司审计经验，严谨细致，责任心强。',
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
                company: '某集团公司',
                position: '财务经理',
                startDate: '2020.03',
                endDate: '至今',
                location: '广州',
                description: '负责集团财务核算和税务管理',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '管理5人财务团队，完成集团及子公司的全盘账务处理',
                      '完成年度审计和税务申报工作，零差错零处罚',
                      '优化财务流程，月结账时间缩短50%',
                      '进行税务筹划，合理节税年均200万+',
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
                  { name: '财务核算', level: 95 },
                  { name: '税务筹划', level: 90 },
                  { name: '财务分析', level: 85 },
                  { name: '成本管理', level: 85 },
                  { name: '审计', level: 90 },
                  { name: 'ERP系统', level: 80 },
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
                school: '某某财经大学',
                major: '会计学',
                degree: '本科',
                startDate: '2013.09',
                endDate: '2017.06',
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
            title: '专业资质',
            icon: '🏅',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'TextBlock',
              props: {
                content: '• 注册会计师（CPA）- 2019年\n• 中级会计师 - 2018年\n• 税务师 - 2020年',
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
