/**
 * 客服经理简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const customerServiceExample: ExampleResume = {
  id: 'example-customer-service',
  name: '客服经理简历',
  category: '客服',
  description: '适合客服、客户成功等岗位',
  tags: ['客服', '客户', '服务'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '客服经理简历示例',
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
            name: '孙悦',
            title: '客服经理',
            phone: '177-0000-0000',
            email: 'sunyue@example.com',
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
                  '6年+客户服务经验，擅长客服团队管理和服务体系搭建。具备丰富的客户沟通和投诉处理经验，致力于提升客户满意度和忠诚度。',
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
                company: '某电商平台',
                position: '客服经理',
                startDate: '2020.03',
                endDate: '至今',
                location: '广州',
                description: '<ul><li>管理30人客服团队，客户满意度从85%提升至95%</li><li>优化客服工作流程，平均响应时间缩短40%，问题解决率提升至92%</li><li>建立客户分级服务体系，VIP客户留存率提升25%</li><li>设计并实施客服培训计划，新员工上岗周期缩短30%</li><li>分析客户反馈数据，推动产品和服务改进，投诉率下降35%</li></ul>',
              },
              style: {
                marginBottom: '20px',
              },
              children: [],
            },
            {
              id: nanoid(),
              type: 'ExperienceItem',
              props: {
                company: '互联网公司',
                position: '客服主管',
                startDate: '2018.06',
                endDate: '2020.02',
                location: '广州',
                description: '<ul><li>管理10人客服小组，达成月度服务指标</li><li>处理复杂客诉和升级问题，客户满意度保持90%以上</li><li>参与客服系统选型和优化，提升工作效率</li></ul>',
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
                  '<ul><li>精通客户服务管理体系和质量控制方法</li><li>熟练使用客服系统（如网易七鱼、Udesk等）</li><li>掌握客户关系管理和客户体验优化</li><li>具备团队管理和培训能力</li><li>擅长数据分析和报表制作（Excel、Power BI）</li><li>具备优秀的沟通、协调和抗压能力</li></ul>',
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
                projectName: '智能客服系统上线',
                role: '项目负责人',
                startDate: '2021.06',
                endDate: '2022.03',
                techStack: '智能客服、知识库、工单系统',
                description: '<ul><li>主导智能客服系统选型和实施，搭建AI问答机器人</li><li>梳理常见问题，建立知识库，覆盖80%常见咨询</li><li>机器人分流30%咨询量，人工客服压力大幅减轻</li><li>系统上线后，客户自助解决率从40%提升至70%</li></ul>',
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
                major: '工商管理',
                degree: '本科',
                startDate: '2014.09',
                endDate: '2018.06',
                gpa: '3.6',
                gpaScale: '4.0',
                achievements: '<ul><li>获得校级优秀学生奖学金</li><li>担任学生会外联部副部长</li></ul>',
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
              type: 'SkillList',
              props: {
                content: '<ul><li>客户服务管理师认证</li><li>2023年度优秀管理者</li><li>公司服务之星</li><li>英语四级</li></ul>',
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
