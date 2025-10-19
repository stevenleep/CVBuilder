/**
 * 市场营销经理简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const marketingManagerExample: ExampleResume = {
  id: 'example-marketing-manager',
  name: '市场营销经理简历',
  category: '市场',
  description: '适合市场营销、品牌推广等岗位',
  tags: ['市场', '营销', '品牌'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '市场营销经理简历示例',
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
            name: '赵营',
            title: '市场营销经理',
            phone: '158-0000-0000',
            email: 'zhaoying@example.com',
            location: '上海·静安区',
            website: 'www.zhaoying-marketing.com',
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
                  '6年+市场营销经验，擅长品牌策划、数字营销和增长策略，有成功的刷屏级营销活动经验。',
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
                company: '消费品公司',
                position: '市场营销经理',
                startDate: '2020.01',
                endDate: '至今',
                location: '上海',
                description:
                  '<ul><li>策划新品上市营销活动，首月销售额破1000万</li><li>运营公司社交媒体，粉丝增至50万+，互动率提升200%</li><li>建立KOL合作体系，月均曝光5000万+</li><li>优化SEO/SEM策略，自然流量增长150%，获客成本降低40%</li></ul>',
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
                  '<ul><li>618大促活动：策划全渠道营销，GMV达2000万+，ROI 1:8</li><li>品牌重塑项目：全面升级品牌形象，品牌认知度提升60%</li><li>KOL合作矩阵：建立300+KOL资源库，单次活动曝光5000万+</li><li>私域运营体系：搭建企业微信社群，月活用户10万+</li></ul>',
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
                  '<ul><li><strong>核心能力：</strong>6年+营销经验，擅长品牌策划、数字营销、增长策略，有成功的刷屏级活动经验</li><li><strong>营销渠道：</strong>精通SEO/SEM、社交媒体、内容营销、KOL合作、私域运营</li><li><strong>数据驱动：</strong>熟练使用数据分析工具，通过数据优化营销ROI</li><li><strong>业务理解：</strong>熟悉消费品/互联网行业，具备品牌定位和用户增长能力</li></ul>',
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
                major: '市场营销',
                degree: '本科',
                startDate: '2014.09',
                endDate: '2018.06',
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
