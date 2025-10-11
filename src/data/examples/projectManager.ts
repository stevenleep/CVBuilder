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
                  '7年+项目管理经验，持有PMP和CSM证书。成功交付大型项目20+个，总预算超2亿。擅长敏捷项目管理和跨部门协作，注重风险控制和质量保证。',
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
                description: '负责公司大型数字化转型项目',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '主导企业数字化转型项目，预算5000万，按时按质交付',
                      '管理跨部门团队50+人，协调研发、业务、IT多方资源',
                      '建立敏捷项目管理体系，项目交付周期缩短30%',
                      '风险管理和质量控制，项目成功率达95%',
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
            title: '专业资质',
            icon: '🏅',
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
                  '• PMP（项目管理专业人士）\n• CSM（认证 Scrum Master）\n• PRINCE2 Foundation',
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
