/**
 * 运营经理简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const operationsManagerExample: ExampleResume = {
  id: 'example-operations-manager',
  name: '运营经理简历',
  category: '运营',
  description: '适合用户运营、内容运营等岗位',
  tags: ['运营', '用户增长', '互联网'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '运营经理简历示例',
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
            name: '孙运',
            title: '用户运营经理',
            phone: '177-0000-0000',
            email: 'sunyun@example.com',
            location: '杭州·滨江区',
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
                  '5年+互联网运营经验，擅长用户增长和社区运营。成功策划多个10万+用户增长活动，深谙用户心理和内容传播规律。数据驱动，结果导向。',
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
                company: '知识付费平台',
                position: '用户运营经理',
                startDate: '2020.06',
                endDate: '至今',
                location: '杭州',
                description: '<ul><li>策划用户裂变活动，3个月内新增用户50万+，获客成本降低60%</li><li>搭建用户成长体系，DAU提升80%，用户留存率提升45%</li><li>运营社群矩阵，管理100+用户群，月活跃用户10万+</li><li>通过内容运营实现用户转化，付费转化率提升至12%</li></ul>',
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
            title: '成功案例',
            icon: '🎯',
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
                  '<ul><li>裂变活动"邀请好友得会员"：3天新增用户20万+，传播系数2.5</li><li>用户等级体系：设计5级成长体系，用户活跃度提升60%</li><li>私域社群运营：搭建100+精品社群，转化率达15%</li><li>节日营销活动：策划中秋、双11等大促，单次GMV突破500万</li></ul>',
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
                content:
                  '<ul><li>精通用户增长策略和增长黑客方法</li><li>熟练进行数据分析和运营决策</li><li>掌握内容运营和内容营销</li><li>擅长社群运营和用户留存</li><li>具备丰富的活动策划和执行经验</li><li>了解裂变营销和私域流量运营</li></ul>',
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
                major: '电子商务',
                degree: '本科',
                startDate: '2016.09',
                endDate: '2020.06',
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
