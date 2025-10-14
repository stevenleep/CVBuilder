/**
 * 产品经理简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const productManagerExample: ExampleResume = {
  id: 'example-product-manager',
  name: '产品经理简历',
  category: '产品',
  description: '适合产品经理、产品运营等岗位',
  tags: ['产品', '产品经理', '互联网'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '产品经理简历示例',
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
            name: '李雨晨',
            title: '高级产品经理',
            phone: '139-8765-4321',
            email: 'yuchenli@example.com',
            location: '上海·浦东新区',
            website: 'www.yuchenli.com',
          },
          style: {
            marginBottom: '32px',
          },
          children: [],
        },
        // 2. 核心技能
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
                  '<ul><li><strong>产品能力：</strong>精通产品全生命周期管理（从 0 到 1、增长优化、商业化），擅长需求分析、竞品分析、用户研究</li><li><strong>数据分析：</strong>熟练使用 SQL 进行数据查询和分析，掌握数据埋点设计，熟悉 Google Analytics、神策数据、GrowingIO 等工具</li><li><strong>增长方法论：</strong>掌握 AARRR 增长模型、北极星指标、A/B 测试方法论，有实际增长项目经验</li><li><strong>设计工具：</strong>Axure、Figma、Sketch、Xmind、ProcessOn，能独立输出高保真原型和交互设计</li><li><strong>项目管理：</strong>熟悉敏捷开发流程，使用 JIRA、Teambition 等工具进行项目管理，确保按时交付</li><li><strong>商业思维：</strong>具备商业 sense，能平衡用户价值和商业价值，参与过 Pricing、LTV、CAC 等商业模型设计</li><li><strong>跨部门协作：</strong>优秀的沟通和推动能力，能高效协调研发、设计、运营、市场等团队</li></ul>',
              },
              style: {},
              children: [],
            },
          ],
        },
        // 3. 工作经历
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
                company: '腾讯',
                position: '高级产品经理',
                startDate: '2021.03',
                endDate: '至今',
                location: '上海',
                description: '企业服务事业群，负责企业协作 SaaS 产品规划与增长',
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
                      '主导企业协作产品从 0 到 1 孵化，负责产品定位、功能规划和 MVP 打磨，上线 8 个月获得付费企业客户 800+，ARR 突破 1000 万',
                      '建立数据驱动的增长体系：搭建完整的数据埋点和分析体系，通过漏斗分析定位问题，优化注册转化率从 12% 提升至 28%',
                      '推动付费转化优化专项：设计分层定价策略，开发试用转付费流程，付费转化率提升 65%，客单价增长 40%',
                      '跨部门协作推进重点项目，协调 3 个研发团队（15 人）、设计团队、运营团队，按时交付 4 个大版本',
                      '深度参与商业化探索，设计增值服务和企业定制方案，为公司贡献 ARR 300 万+',
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
                company: '美团',
                position: '产品经理',
                startDate: '2019.07',
                endDate: '2021.02',
                location: '上海',
                description: '到店事业群，负责商家端产品和数据中台产品设计',
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
                      '负责商家端核心功能迭代，包括订单管理、营销工具、数据看板等模块，服务 5w+ 商家',
                      '主导商家数据看板产品，整合多方数据源，设计 20+ 数据指标和可视化报表，商家使用率达 75%',
                      '推动产品体验优化：通过用户访谈和数据分析，识别核心痛点，优化核心流程，商家满意度从 68 分提升至 82 分',
                      '参与商家成长体系设计，制定新手引导和激励机制，新商家留存率提升 35%',
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
                startDate: '2017.07',
                endDate: '2019.06',
                location: '上海',
                description: '负责教育 SaaS 产品设计，从 0 到 1 搭建产品',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '深入教育行业调研，完成 60+ 用户访谈，输出竞品分析和需求文档，明确产品定位',
                      '独立负责产品规划与设计，输出 PRD 40+ 篇，跟进研发实现，确保产品按时上线',
                      '产品上线后快速迭代，通过用户反馈和数据分析持续优化，用户留存率达 60%',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
          ],
        },
        // 4. 项目经验
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
                name: '企业协作 SaaS 产品从 0 到 1',
                role: '产品负责人',
                startDate: '2021.06',
                endDate: '2022.03',
                tech: '项目管理、知识库、在线文档协作',
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
                      '项目背景：针对中小企业团队协作痛点，打造轻量级企业协作工具',
                      '市场调研：深度访谈 60+ 目标用户，调研 15+ 竞品，输出用户画像和产品定位报告',
                      '产品规划：制定产品 Roadmap，设计 MVP 核心功能（项目管理、知识库、在线文档），输出 PRD 35+ 篇',
                      '敏捷开发：采用双周迭代模式，与研发团队紧密协作，快速验证假设和优化体验',
                      '增长策略：设计 Freemium 商业模式，通过内容营销和社群运营获客，3 个月获取 10000+ 注册用户',
                      '数据驱动：建立数据看板监控核心指标（DAU、留存、转化），通过 A/B 测试优化关键流程，付费转化率 18%',
                      '项目成果：产品 PMF 验证成功，8 个月获得 800+ 付费企业，NPS 72，获得 A 轮融资',
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
                name: '商家数据中台产品',
                role: '产品经理',
                startDate: '2020.03',
                endDate: '2020.12',
                tech: '数据可视化、BI分析、智能推荐',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '需求分析：调研商家痛点，发现商家缺乏数据分析工具导致决策盲目',
                      '产品设计：设计数据看板产品，整合订单、用户、营销等多维度数据，提供 25+ 核心指标和可视化图表',
                      '智能洞察：引入算法能力，提供经营分析和优化建议（如高峰期预测、菜品推荐等）',
                      '用户验证：小范围灰度测试，收集反馈快速迭代，最终全量上线',
                      '项目成果：商家使用率 75%，满意度 4.2/5，帮助商家提升运营效率 30%',
                    ],
                  },
                  style: {},
                  children: [],
                },
              ],
            },
          ],
        },
        // 5. 教育背景
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
                school: '上海交通大学',
                major: '工商管理',
                degree: '本科',
                startDate: '2013.09',
                endDate: '2017.06',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      'GPA: 3.6/4.0，核心课程：市场营销、战略管理、运营管理、数据分析',
                      '担任学生会外联部副部长，组织校企合作活动 10+ 场',
                      '获得校级二等奖学金、优秀学生干部称号',
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
