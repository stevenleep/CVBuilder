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
                description:
                  '<ul><li>搭建产品核心指标体系（北极星指标+AARRR漏斗），建立数据看板实时监控业务健康度</li><li>主导用户增长分析，通过RFM模型、用户分群、流失预警等方法，识别高价值用户并制定运营策略，留存率提升25%</li><li>设计并执行30+个A/B测试，优化产品和运营策略，推动注册转化率提升18%，付费转化率提升22%</li><li>搭建用户画像体系，支持精准营销和个性化推荐，营销ROI提升40%</li><li>输出50+篇数据分析报告，为产品、运营决策提供数据支持</li><li>制定数据埋点规范并监控数据质量，保障数据准确性</li></ul>',
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
                description:
                  '<ul><li>负责广告投放数据分析，监控CTR、CVR、ROI等核心指标，为广告优化提供支持</li><li>搭建广告归因模型，分析渠道贡献，优化投放策略，ROI提升30%</li><li>开发数据分析工具和自动化报表，分析效率提升50%</li><li>参与数据仓库建设，提升数据加工效率</li></ul>',
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
                description:
                  '<ul><li>分析用户下单行为和商家经营数据，输出分析报告支持运营决策</li><li>监控核心业务指标（订单量、GMV、客单价），快速发现并定位异常</li><li>评估营销活动效果，量化ROI并提供优化建议</li></ul>',
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
                description:
                  '<ul><li>【业务背景】产品进入增长瓶颈期，需建立数据驱动的增长体系</li><li>【指标体系】设计北极星指标和AARRR漏斗，建立数据看板实时监控核心指标</li><li>【用户洞察】通过RFM模型进行用户分层，识别高价值用户和流失风险用户，制定差异化运营策略</li><li>【A/B测试】设计实验并进行显著性检验，科学验证产品优化效果</li><li>【业务成果】用户留存率提升25%，付费转化率提升22%，贡献ARR增长1500万</li></ul>',
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
                description:
                  '<ul><li>【业务需求】支持精准营销和个性化推荐，需建立完整用户画像体系</li><li>【标签设计】设计200+标签（人口属性、行为特征、兴趣偏好、消费能力）</li><li>【数据加工】从多源数据中提取、清洗、加工标签数据</li><li>【业务应用】支持用户圈选、精准营销、个性化推荐等50+场景</li><li>【业务价值】标签覆盖率95%，营销ROI提升40%</li></ul>',
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
                  '<ul><li><strong>核心能力：</strong>6年+数据分析经验，擅长用户增长分析、产品数据分析、A/B测试，有成功的增长项目经验</li><li><strong>技术能力：</strong>精通SQL和Python，熟练使用Hive/Spark进行大数据分析，掌握Tableau等可视化工具</li><li><strong>分析方法：</strong>熟练运用漏斗分析、用户分群、RFM模型、归因分析等方法论</li><li><strong>业务理解：</strong>深入理解互联网产品运营和用户增长，能将数据洞察转化为业务价值</li></ul>',
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
