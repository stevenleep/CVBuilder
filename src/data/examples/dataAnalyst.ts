/**
 * 数据分析师简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const dataAnalystExample: ExampleResume = {
  id: 'example-data-analyst',
  name: '数据分析师简历',
  category: '数据',
  description: '适合数据分析、商业分析、数据科学等岗位',
  tags: ['数据', '分析', 'Python', 'SQL'],
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
            name: '陈婧怡',
            title: '高级数据分析师',
            phone: '135-6789-0123',
            email: 'jingyic@example.com',
            location: '深圳·南山区',
            website: 'www.jingyichen.com',
          },
          style: {
            marginBottom: '32px',
          },
          children: [],
        },
        // 2. 工作经历
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
                position: '高级数据分析师',
                startDate: '2021.06',
                endDate: '至今',
                location: '深圳',
                description: '<ul><li>负责产品核心指标体系搭建与监控，设计北极星指标和 AARRR 漏斗模型，建立数据看板实时监控业务健康度</li><li>主导用户增长分析专项，通过 RFM 模型、用户分群、流失预警，识别高价值用户，制定精准运营策略，用户留存率提升 25%</li><li>设计并执行 30+ 个 A/B 测试实验，优化产品功能和运营策略，推动注册转化率提升 18%，付费转化率提升 22%</li><li>搭建用户画像体系，整合多源数据（行为数据、画像标签、业务数据），支持精准营销和个性化推荐，营销 ROI 提升 40%</li><li>与产品、运营、研发跨部门协作，输出数据分析报告 50+ 篇，为业务决策提供数据支持</li><li>负责数据埋点规范制定和数据质量监控，保证数据准确性，支撑业务数据化运营</li></ul>',
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
                company: '字节跳动',
                position: '数据分析师',
                startDate: '2019.07',
                endDate: '2021.05',
                location: '深圳',
                description: '<ul><li>负责广告投放数据分析，监控 CTR、CVR、ROI 等核心指标，为广告优化提供数据支持</li><li>搭建广告归因模型，分析不同渠道对转化的贡献，优化广告投放策略，广告 ROI 提升 30%</li><li>使用 Python 开发数据分析工具和自动化报表，提升分析效率 50%</li><li>参与数据仓库建设，设计数据模型和 ETL 流程，提升数据加工效率</li></ul>',
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
                company: '美团',
                position: '数据分析师',
                startDate: '2018.07',
                endDate: '2019.06',
                location: '北京',
                description: '<ul><li>分析用户下单行为和商家经营数据，输出专题分析报告，为运营策略提供数据支持</li><li>监控业务核心指标（订单量、GMV、客单价等），发现异常并快速定位问题</li><li>参与营销活动效果评估，通过对比分析和归因分析，量化活动效果</li></ul>',
              },
              style: {},
              children: [],
            },
          ],
        },
        // 3. 项目经验
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
                projectName: '用户增长数据分析体系搭建',
                role: '数据分析负责人',
                startDate: '2022.01',
                endDate: '2023.06',
                techStack: 'SQL, Python, Tableau, A/B Testing',
                description: '<ul><li>项目背景：产品进入增长瓶颈期，需要建立数据驱动的增长体系</li><li>指标体系：设计北极星指标和 AARRR 漏斗（获客、激活、留存、变现、推荐），建立数据看板实时监控</li><li>用户分析：RFM 模型进行用户分层，识别高价值用户、流失预警用户，制定差异化运营策略</li><li>A/B 测试：设计实验方案，使用统计学方法进行显著性检验，验证产品优化效果</li><li>增长策略：通过数据分析发现增长机会点，与产品运营协作制定增长策略</li><li>项目成果：用户留存率提升 25%，付费转化率提升 22%，为公司贡献 ARR 增长 1500 万</li></ul>',
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
                projectName: '用户画像体系搭建',
                role: '核心成员',
                startDate: '2021.09',
                endDate: '2022.03',
                techStack: 'Hive, Spark, Python, Tag System',
                description: '<ul><li>项目背景：为支持精准营销和个性化推荐，需要建立完整的用户画像体系</li><li>标签体系：设计用户画像标签体系，包括人口属性、行为特征、兴趣偏好、消费能力等 200+ 标签</li><li>数据加工：使用 Hive SQL 和 Spark 进行数据 ETL，从多源数据中提取、清洗、加工标签数据</li><li>标签应用：支持运营进行用户圈选和精准营销，支持算法团队进行个性化推荐</li><li>项目成果：标签覆盖率 95%，支持 50+ 业务场景应用，营销 ROI 提升 40%</li></ul>',
              },
              style: {},
              children: [],
            },
          ],
        },
        // 4. 专业技能
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
                  '<ul><li><strong>数据分析：</strong>精通 SQL（复杂查询、窗口函数、性能优化），熟练使用 Hive、Spark SQL 进行大数据分析</li><li><strong>编程语言：</strong>Python（Pandas、NumPy、Scikit-learn、Matplotlib、Seaborn），了解 R 语言</li><li><strong>数据可视化：</strong>Tableau、Power BI、Superset、ECharts，能搭建数据看板和可视化报表</li><li><strong>数据库：</strong>MySQL、PostgreSQL、Hive、ClickHouse、MongoDB</li><li><strong>统计学：</strong>掌握描述性统计、假设检验、回归分析、A/B 测试等统计方法</li><li><strong>机器学习：</strong>了解常见算法（线性回归、逻辑回归、决策树、聚类），能进行简单建模</li><li><strong>分析方法：</strong>漏斗分析、留存分析、用户分群、RFM 模型、归因分析、A/B 测试</li><li><strong>业务理解：</strong>熟悉用户增长、产品运营、电商、广告等业务场景</li></ul>',
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
          style: {
            marginBottom: '24px',
          },
          children: [
            {
              id: nanoid(),
              type: 'EducationItem',
              props: {
                school: '中山大学',
                major: '统计学',
                degree: '本科',
                startDate: '2014.09',
                endDate: '2018.06',
                gpa: '3.6',
                gpaScale: '4.0',
                achievements: '<ul><li>获得校级二等奖学金、优秀学生称号</li></ul>',
                courses: '概率论、数理统计、回归分析、多元统计分析、时间序列分析、数据挖掘',
              },
              style: {},
              children: [],
            },
          ],
        },
        // 6. 证书/获奖
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
                content:
                  '<ul><li>2023 年度公司优秀员工</li><li>数据分析师（高级）职业资格证书</li><li>CET-6，具备良好的英文文档阅读能力</li></ul>',
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
