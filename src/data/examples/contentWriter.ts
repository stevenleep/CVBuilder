/**
 * 内容编辑/新媒体运营简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const contentWriterExample: ExampleResume = {
  id: 'example-content-writer',
  name: '新媒体运营简历',
  category: '内容',
  description: '适合内容编辑、新媒体运营等岗位',
  tags: ['内容', '新媒体', '运营'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '新媒体运营简历示例',
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
            name: '林文',
            title: '新媒体运营',
            phone: '178-0000-0000',
            email: 'linwen@example.com',
            location: '成都·高新区',
            website: 'mp.weixin.qq.com/linwen',
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
                  '4年+新媒体运营经验，擅长内容创作和账号运营。累计产出10万+、100万+爆款文章30+篇，全网粉丝50万+。熟悉主流平台运营规则和推荐算法。',
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
                company: '新媒体公司',
                position: '新媒体运营主管',
                startDate: '2021.04',
                endDate: '至今',
                location: '成都',
                description: '负责公司全平台新媒体运营',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '运营公司官方账号矩阵，全网粉丝从0到50万+，月阅读量500万+',
                      '策划并执行多个爆款内容，单篇最高阅读量200万+',
                      '建立内容生产流程和SOP，提升内容产出效率3倍',
                      '通过内容变现，月均收入达30万+',
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
            title: '代表作品',
            icon: '✍️',
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
                  '• 《年轻人的第一份工作该怎么选》阅读量200万+，收藏3万+\n• 《90后程序员的一天》视频播放量500万+，涨粉5万+\n• 策划"职场生存指南"系列，持续霸榜热搜3天\n• 运营账号矩阵：微信50万、抖音30万、小红书20万粉丝',
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
                skills: [
                  { name: '内容创作', level: 95 },
                  { name: '短视频制作', level: 85 },
                  { name: '社交媒体运营', level: 90 },
                  { name: '数据分析', level: 80 },
                  { name: '热点策划', level: 90 },
                  { name: 'PR稿撰写', level: 85 },
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
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'EducationItem',
              props: {
                school: '某某大学',
                major: '新闻传播学',
                degree: '本科',
                startDate: '2017.09',
                endDate: '2021.06',
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
