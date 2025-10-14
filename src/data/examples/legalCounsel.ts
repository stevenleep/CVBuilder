/**
 * 法务专员简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const legalCounselExample: ExampleResume = {
  id: 'example-legal-counsel',
  name: '法务专员简历',
  category: '法务',
  description: '适合法务、法律顾问等岗位',
  tags: ['法务', '法律', '合规'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '法务专员简历示例',
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
            name: '赵律',
            title: '法务专员',
            phone: '158-0000-0000',
            email: 'zhaolv@example.com',
            location: '北京·朝阳区',
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
                  '5年+企业法务经验，熟悉公司法、合同法、知识产权法等法律法规。具备合同审查、法律风险防控和诉讼管理经验。通过司法考试，具有法律职业资格。',
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
                company: '某互联网科技公司',
                position: '高级法务专员',
                startDate: '2020.06',
                endDate: '至今',
                location: '北京',
                description: '负责公司日常法律事务和风险管理',
              },
              style: {
                marginBottom: '20px',
              },
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '审核各类商业合同3000+份，发现并规避潜在法律风险，避免经济损失500万+',
                      '建立合同管理系统和审核流程，合同审核效率提升50%',
                      '处理劳动争议、知识产权纠纷等案件20+起，胜诉率达90%',
                      '组织法律培训，提升员工法律意识和风险防范能力',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
            {
              id: nanoid(),
              type: 'ExperienceItem',
              props: {
                company: '律师事务所',
                position: '律师助理',
                startDate: '2018.07',
                endDate: '2020.05',
                location: '北京',
                description: '协助律师处理公司法律事务和诉讼案件',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '协助处理商事诉讼、劳动仲裁等案件50+起',
                      '参与企业法律尽职调查和并购项目',
                      '撰写法律意见书、起诉状、答辩状等法律文书',
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
                  '<ul><li>精通公司法、合同法、劳动法、知识产权法等法律法规</li><li>熟练进行合同起草、审核和谈判</li><li>具备诉讼和仲裁案件处理经验</li><li>掌握法律风险识别和合规管理</li><li>了解数据安全、个人信息保护等新兴领域法规</li><li>具备良好的法律文书写作和沟通能力</li></ul>',
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
                name: '合规管理体系建设',
                role: '项目负责人',
                startDate: '2021.09',
                endDate: '2022.12',
                tech: '合规管理、风险防控',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '主导建立公司合规管理体系，制定合规政策和流程',
                      '开展合规风险评估，识别重点风险领域',
                      '设计合规培训计划，覆盖全员1000+人',
                      '建立合规监控机制，及时发现和处理合规问题',
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
                major: '法学',
                degree: '硕士',
                startDate: '2016.09',
                endDate: '2018.06',
              },
              style: {
                marginBottom: '16px',
              },
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: ['GPA: 3.7/4.0', '研究方向：公司法与商法', '发表学术论文3篇'],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
            {
              id: nanoid(),
              type: 'EducationItem',
              props: {
                school: '某某大学',
                major: '法学',
                degree: '本科',
                startDate: '2012.09',
                endDate: '2016.06',
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
            title: '证书资质',
            icon: '🏅',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'TextBlock',
              props: {
                content: '• 法律职业资格证书（A证）\n• 企业合规师\n• 英语六级\n• 普通话二级甲等',
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
