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
                  '<ul><li><strong>核心能力：</strong>6年+产品经验，擅长B端/SaaS产品从0到1，有成功的增长和商业化项目经验</li><li><strong>数据驱动：</strong>精通数据分析和A/B测试，能通过数据洞察驱动产品决策</li><li><strong>业务理解：</strong>深入理解SaaS、协作工具、数据中台等领域，具备商业思维</li><li><strong>推动能力：</strong>优秀的跨部门协作和项目管理能力，擅长推动复杂项目落地</li></ul>',
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
                description:
                  '<ul><li>负责商家端核心产品（订单管理、营销工具、数据看板），服务5万+商家</li><li>主导商家数据看板从0到1，解决商家缺乏经营分析工具痛点，使用率达75%，帮助商家提升运营效率</li><li>通过用户调研和数据分析识别痛点，优化核心流程，商家满意度从68分提升至82分</li><li>设计商家成长体系和新手引导，新商家留存率提升35%</li></ul>',
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
                company: '某创业公司',
                position: '产品经理',
                startDate: '2017.07',
                endDate: '2019.06',
                location: '上海',
                description:
                  '<ul><li>深入教育行业调研，完成60+用户访谈，明确产品定位和核心需求</li><li>独立负责产品规划、设计与落地，推动产品按时上线</li><li>通过快速迭代和数据驱动优化，用户留存率达60%</li></ul>',
              },
              style: {},
              children: [],
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
                projectName: '企业协作 SaaS 产品从 0 到 1',
                role: '产品负责人',
                startDate: '2021.06',
                endDate: '2022.03',
                techStack: '项目管理、知识库、在线文档协作',
                description:
                  '<ul><li>【业务目标】针对中小企业团队协作痛点，打造轻量级SaaS协作工具</li><li>【市场洞察】深度访谈60+目标用户，调研15+竞品，明确产品定位和差异化策略</li><li>【产品设计】制定Roadmap，设计MVP功能（项目管理、知识库、在线文档），双周快速迭代验证假设</li><li>【增长策略】设计Freemium商业模式，通过内容营销和社群运营获客，3个月获取1万+注册用户</li><li>【数据驱动】建立核心指标监控体系，通过A/B测试优化转化漏斗，付费转化率18%</li><li>【业务成果】8个月达成PMF，获得800+付费企业，NPS 72，助力公司完成A轮融资</li></ul>',
              },
              style: {
                marginBottom: '20px',
              },
              children: [],
            },
            {
              id: nanoid(),
              type: 'ProjectItem',
              props: {
                projectName: '商家数据中台产品',
                role: '产品经理',
                startDate: '2020.03',
                endDate: '2020.12',
                techStack: '数据可视化、BI分析、智能推荐',
                description:
                  '<ul><li>【痛点洞察】商家缺乏数据分析工具，经营决策盲目，急需数据化运营能力</li><li>【产品方案】设计数据看板，整合订单/用户/营销多维度数据，提供25+核心指标和可视化图表</li><li>【智能化】引入算法能力，提供经营分析和优化建议（高峰期预测、菜品推荐等）</li><li>【用户验证】灰度测试→快速迭代→全量上线，确保产品体验</li><li>【业务价值】使用率75%，满意度4.2/5，帮助商家运营效率提升30%</li></ul>',
              },
              style: {},
              children: [],
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
                gpa: '3.6',
                gpaScale: '4.0',
                achievements:
                  '<ul><li>担任学生会外联部副部长，组织校企合作活动 10+ 场</li><li>获得校级二等奖学金、优秀学生干部称号</li></ul>',
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
