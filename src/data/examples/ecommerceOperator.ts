/**
 * 电商运营简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const ecommerceOperatorExample: ExampleResume = {
  id: 'example-ecommerce-operator',
  name: '电商运营简历',
  category: '运营',
  description: '适合电商运营、店铺运营等岗位',
  tags: ['电商', '运营', '淘宝'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '电商运营简历示例',
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
            name: '吴越',
            title: '电商运营',
            phone: '188-0000-0000',
            email: 'wuyue@example.com',
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
                  '5年+电商运营经验，精通淘宝、天猫、京东等主流电商平台。擅长店铺运营、活动策划和数据分析，成功操盘过多个爆款产品。',
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
                company: '某电商公司',
                position: '电商运营经理',
                startDate: '2020.04',
                endDate: '至今',
                location: '杭州',
                description: '负责天猫旗舰店整体运营和团队管理',
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
                      '管理店铺年销售额从3000万增长至1.2亿，增长率300%',
                      '策划并执行双11、618等大促活动，单日销售额突破2000万',
                      '打造爆款产品5款，单品月销10万+件',
                      '优化店铺转化率从2.5%提升至4.8%，ROI从1:3提升至1:5',
                      '搭建运营团队8人，制定运营SOP和考核体系',
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
                company: '电商品牌',
                position: '运营专员',
                startDate: '2018.07',
                endDate: '2020.03',
                location: '杭州',
                description: '负责日常店铺运营和推广',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '负责商品上架、详情页优化、活动报名等日常工作',
                      '通过直通车、钻展等付费推广，ROI保持在1:4以上',
                      '分析运营数据，优化产品和营销策略',
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
                  '<ul><li>精通淘宝、天猫、京东、拼多多等电商平台规则和运营策略</li><li>熟练使用直通车、超级推荐、钻展等推广工具</li><li>掌握选品、定价、促销等运营技巧</li><li>擅长数据分析（生意参谋、数据魔方等）</li><li>熟悉店铺装修、详情页设计、视觉营销</li><li>具备优秀的活动策划和执行能力</li></ul>',
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
                name: '新品牌0-1冷启动',
                role: '运营负责人',
                startDate: '2021.03',
                endDate: '2022.06',
                tech: '电商运营、品牌营销',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '从0搭建天猫旗舰店，完成品牌入驻和店铺装修',
                      '制定产品线规划和定价策略，上架SKU 50+个',
                      '通过内容营销和KOL合作，快速积累种子用户',
                      '6个月内月销突破500万，店铺层级达到Top 7',
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
                major: '电子商务',
                degree: '本科',
                startDate: '2014.09',
                endDate: '2018.06',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: ['GPA: 3.5/4.0', '校级优秀学生', '参与电商创业大赛获二等奖'],
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
            title: '荣誉/证书',
            icon: '🏅',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'TextBlock',
              props: {
                content: '• 2023年度最佳运营奖\n• 阿里巴巴电商运营认证\n• 双11优秀运营团队负责人',
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
