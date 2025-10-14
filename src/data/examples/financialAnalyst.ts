/**
 * 财务分析师简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const financialAnalystExample: ExampleResume = {
  id: 'example-financial-analyst',
  name: '财务分析师简历',
  category: '财务',
  description: '适合财务分析、会计等岗位',
  tags: ['财务', '会计', '分析'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '财务分析师简历示例',
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
            name: '陈晓',
            title: '财务分析师',
            phone: '186-0000-0000',
            email: 'chenxiao@example.com',
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
                  '6年+财务分析经验，精通财务建模和数据分析。熟悉上市公司财务报表编制和分析，具备扎实的会计理论基础和财务管理能力。持有CPA、CFA证书。',
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
                company: '某上市公司',
                position: '高级财务分析师',
                startDate: '2020.01',
                endDate: '至今',
                location: '上海',
                description: '<ul><li>主导年度预算编制和月度滚动预测，预算准确率达95%以上</li><li>建立财务分析模型，为管理层提供经营决策支持，助力营收增长30%</li><li>优化成本管控体系，通过精细化管理降低运营成本15%</li><li>负责投资项目财务可行性分析，累计评估项目20+个，投资回报率超预期</li></ul>',
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
                company: '会计师事务所',
                position: '审计师',
                startDate: '2017.07',
                endDate: '2019.12',
                location: '上海',
                description: '<ul><li>参与20+家企业的年度财务报表审计工作</li><li>协助2家公司完成IPO审计，成功上市</li><li>负责财务尽职调查，识别并报告财务风险</li></ul>',
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
                  '<ul><li>精通财务报表分析、财务建模和估值分析</li><li>熟练使用 Excel、Power BI、Tableau 进行数据分析和可视化</li><li>熟悉 SAP、Oracle 等财务管理系统</li><li>掌握成本核算、预算管理和财务风险控制</li><li>了解税法、公司法等相关法律法规</li><li>具备良好的商业敏感度和沟通能力</li></ul>',
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
                projectName: '全面预算管理系统实施',
                role: '项目负责人',
                startDate: '2021.03',
                endDate: '2022.06',
                techStack: 'SAP BPC, Excel, Power BI',
                description: '<ul><li>主导公司全面预算管理系统的规划和实施</li><li>建立预算编制、执行、分析、考核的闭环管理体系</li><li>实现预算数据自动化采集和实时监控</li><li>系统上线后，预算编制效率提升70%，数据准确性提升至98%</li></ul>',
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
                major: '会计学',
                degree: '硕士',
                startDate: '2015.09',
                endDate: '2017.06',
                gpa: '3.8',
                gpaScale: '4.0',
                achievements: '<ul><li>研究生国家奖学金</li><li>发表财务管理相关论文2篇</li></ul>',
              },
              style: {
                marginBottom: '16px',
              },
              children: [],
            },
            {
              id: nanoid(),
              type: 'EducationItem',
              props: {
                school: '某某大学',
                major: '财务管理',
                degree: '本科',
                startDate: '2011.09',
                endDate: '2015.06',
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
              type: 'SkillList',
              props: {
                content:
                  '<ul><li>注册会计师（CPA）</li><li>特许金融分析师（CFA）三级</li><li>中级会计师</li><li>证券从业资格</li></ul>',
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
