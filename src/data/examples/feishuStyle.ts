/**
 * 飞书风格简历示例
 * 特点：简洁现代、层次分明、配色淡雅
 * 完全依赖主题系统，无硬编码样式
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const feishuStyleExample: ExampleResume = {
  id: 'example-feishu-style',
  name: '飞书风格简历',
  category: '现代设计',
  description: '简洁现代的飞书文档风格，适合各类职位',
  tags: ['现代', '简洁', '清新', '飞书'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '飞书风格简历',
      description: '使用 CVKit 创建 - 飞书风格',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    },
    root: {
      id: nanoid(),
      type: 'Page',
      props: {},
      style: {
        padding: '50px',
        backgroundColor: '#ffffff',
      },
      children: [
        // 个人信息
        {
          id: nanoid(),
          type: 'PersonalInfo',
          props: {
            name: '李明',
            title: '产品经理',
            phone: '138-0000-0000',
            email: 'liming@example.com',
            currentLocation: '深圳·南山区',
            linkedin: 'linkedin.com/in/liming',
          },
          style: {},
          children: [],
        },

        // 个人简介
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '个人简介',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'TextBlock',
              props: {
                content:
                  '5年产品经验，擅长从0到1打造创新产品。深度理解用户需求，注重数据驱动决策。曾负责多个亿级用户产品，具备完整的产品设计、项目管理和团队协作能力。',
              },
              style: {},
              children: [],
            },
          ],
        },

        // 工作经历
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '工作经历',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'ExperienceItem',
              props: {
                company: '某互联网科技公司',
                position: '高级产品经理',
                startDate: '2021.07',
                endDate: '至今',
                location: '深圳',
                description: '负责企业协作产品线，包括文档、表格等核心功能',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '主导在线文档编辑器产品设计，DAU 增长 150%，用户满意度达 90%',
                      '推动协同编辑功能优化，实时协作延迟降低 60%，大幅提升用户体验',
                      '设计并落地文档模板系统，月活跃模板使用量超 500万次',
                      '搭建数据指标体系，通过 A/B 测试优化转化率提升 35%',
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
                company: '某创业公司',
                position: '产品经理',
                startDate: '2019.03',
                endDate: '2021.06',
                location: '深圳',
                description: '负责移动端产品的规划与迭代',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '从0到1设计并上线移动应用，3个月内获得 10万+ 用户',
                      '建立用户反馈机制，每周收集整理用户需求，迭代效率提升 40%',
                      '协调开发、设计、运营团队，保证产品按时高质量交付',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
          ],
        },

        // 项目经验
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '核心项目',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'ProjectItem',
              props: {
                name: '智能文档协作平台',
                role: '产品负责人',
                startDate: '2022.01',
                endDate: '2023.12',
                tech: '在线文档、实时协作、AI辅助',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '产品定位：面向企业的智能文档协作工具，支持多人实时编辑和AI写作助手',
                      '核心成果：上线 18 个月，服务企业客户 5000+，付费转化率 12%',
                      '创新亮点：引入 AI 智能写作和文档美化功能，使用率超 60%',
                      '技术突破：实现毫秒级冲突解决算法，支持 50人+ 同时编辑',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
            {
              id: nanoid(),
              type: 'ProjectItem',
              props: {
                name: '企业知识库系统',
                role: '产品经理',
                startDate: '2020.06',
                endDate: '2021.12',
                tech: '知识管理、搜索引擎、权限控制',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '设计企业级知识库架构，支持文档、表格、思维导图等多种内容形式',
                      '实现智能搜索和推荐系统，内容查找效率提升 70%',
                      '建立完善的权限体系，支持细粒度的访问控制',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
          ],
        },

        // 专业技能
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '专业技能',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'SkillList',
              props: {
                skills: [
                  { name: '产品设计与规划', level: 90 },
                  { name: '用户研究与体验', level: 85 },
                  { name: '数据分析与运营', level: 82 },
                  { name: '项目管理', level: 88 },
                  { name: '团队协作与沟通', level: 90 },
                  { name: 'Axure / Figma', level: 85 },
                ],
              },
              style: {},
              children: [],
            },
          ],
        },

        // 教育背景
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '教育背景',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'EducationItem',
              props: {
                school: '某某大学',
                major: '软件工程',
                degree: '本科',
                startDate: '2015.09',
                endDate: '2019.06',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      'GPA: 3.7/4.0，专业前 15%',
                      '校级优秀毕业生、多次获得奖学金',
                      '担任学生会项目部部长，组织策划多场校园活动',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
          ],
        },

        // 荣誉与证书
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '荣誉与证书',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'TextBlock',
              props: {
                content:
                  '• PMP 项目管理专业认证\n• 2023年度公司最佳产品奖\n• 产品创新大赛一等奖\n• NPDP 产品经理国际认证',
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
