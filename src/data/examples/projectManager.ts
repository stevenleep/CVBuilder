/**
 * 项目经理简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const projectManagerExample: ExampleResume = {
  id: 'example-project-manager',
  name: '项目经理简历',
  category: '项目管理',
  description: '适合项目经理、PMO等岗位',
  tags: ['项目管理', 'PMP', '敏捷'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '项目经理简历示例',
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
            name: '钱项',
            title: '项目经理 PMP',
            phone: '156-0000-0000',
            email: 'qianxiang@example.com',
            location: '上海·浦东新区',
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
                  '7年+项目管理经验（PMP/CSM），成功交付20+大型项目（总预算超2亿），擅长敏捷管理和跨部门协作。',
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
                company: '某科技集团',
                position: '高级项目经理',
                startDate: '2019.01',
                endDate: '至今',
                location: '上海',
                description:
                  '<ul><li>主导企业数字化转型项目（预算5000万），按时按质交付</li><li>管理50+人跨部门团队，协调研发、业务、IT等多方资源</li><li>建立敏捷项目管理体系，交付周期缩短30%</li><li>严格风险管理和质量控制，项目成功率95%</li></ul>',
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
                  '<ul><li><strong>核心能力：</strong>7年+项目管理经验，成功交付20+大型项目，擅长敏捷管理和风险控制</li><li><strong>方法论：</strong>精通PMP/PMBOK/Scrum/敏捷，掌握项目全生命周期管理</li><li><strong>管理工具：</strong>熟练使用Jira、MS Project、禅道等</li><li><strong>软技能：</strong>优秀的跨部门协作、沟通和推动能力</li></ul>',
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
          style: {
            marginBottom: '24px',
          },
          children: [
            {
              id: nanoid(),
              type: 'SkillList',
              props: {
                content:
                  '<ul><li>PMP（项目管理专业人士）</li><li>CSM（认证 Scrum Master）</li><li>PRINCE2 Foundation</li></ul>',
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
