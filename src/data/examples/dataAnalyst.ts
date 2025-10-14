/**
 * 数据分析师简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const dataAnalystExample: ExampleResume = {
  id: 'example-data-analyst',
  name: '数据分析师简历',
  category: '数据',
  description: '适合数据分析、数据科学等岗位',
  tags: ['数据', '分析', 'Python'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '数据分析师简历示例',
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
            name: '陈数',
            title: '数据分析师',
            phone: '135-0000-0000',
            email: 'chenshu@example.com',
            location: '深圳·南山区',
            website: 'www.chenshu-data.com',
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
                  '4年+数据分析经验，擅长数据挖掘、商业分析和可视化。熟练使用 Python、SQL 等工具，能够从数据中洞察业务价值。有多个数据驱动决策的成功案例。',
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
                company: '电商公司',
                position: '数据分析师',
                startDate: '2021.08',
                endDate: '至今',
                location: '深圳',
                description: '负责用户行为分析和商业策略支持',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '建立用户画像体系，识别高价值用户群体，支撑精准营销',
                      '分析用户转化漏斗，优化流程使转化率提升35%',
                      '搭建实时数据看板，支持业务团队快速决策',
                      '进行A/B测试分析，为产品优化提供数据支持',
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
                name: '用户增长数据分析平台',
                role: '数据分析负责人',
                startDate: '2022.05',
                endDate: '2023.08',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '搭建用户行为分析体系，建立50+核心指标看板',
                      '通过RFM模型识别高价值用户，精准营销ROI提升3倍',
                      '建立预测模型，准确预测用户流失，召回率达60%',
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
            title: '技能特长',
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
                  '<ul><li>精通 Python 数据分析（Pandas、NumPy、Matplotlib）</li><li>熟练使用 SQL、Hive 进行数据查询和处理</li><li>掌握 Tableau、Power BI 等数据可视化工具</li><li>了解机器学习算法和应用场景</li><li>具备扎实的统计分析基础</li><li>擅长商业分析和业务洞察</li></ul>',
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
                major: '统计学',
                degree: '硕士',
                startDate: '2018.09',
                endDate: '2021.06',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '研究方向：数据挖掘与机器学习',
                      '发表SCI论文2篇',
                      '获得研究生国家奖学金',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
}
