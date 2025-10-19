/**
 * 后端工程师简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const backendEngineerExample: ExampleResume = {
  id: 'example-backend-engineer',
  name: '后端工程师简历',
  category: '技术',
  description: '适合后端开发、服务端工程师等岗位',
  tags: ['技术', '后端', 'Java'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '后端工程师简历示例',
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
        // 1. 个人信息
        {
          id: nanoid(),
          type: 'PersonalInfo',
          props: {
            name: '刘浩然',
            title: '高级 Java 后端工程师',
            phone: '137-9876-5432',
            email: 'haoranl@example.com',
            location: '杭州·西湖区',
            github: 'github.com/haoranl',
          },
          style: {
            marginBottom: '32px',
          },
          children: [],
        },
        // 2. 技术能力
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '技术能力',
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
                  '<ul><li><strong>核心能力：</strong>6年+后端开发经验，擅长高并发系统设计、微服务架构、性能优化与稳定性保障</li><li><strong>技术栈：</strong>Java/Spring生态、微服务架构、MySQL/Redis、消息队列、Elasticsearch</li><li><strong>业务领域：</strong>电商交易、秒杀系统、数据中台等高并发场景</li><li><strong>架构能力：</strong>有大型系统架构设计和重构经验，熟悉分布式系统设计模式</li></ul>',
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
              type: 'ExperienceItem',
              props: {
                company: '阿里巴巴',
                position: '高级 Java 开发工程师',
                startDate: '2021.04',
                endDate: '至今',
                location: '杭州',
                description:
                  '<ul><li>主导交易系统微服务拆分（50万行代码→15个微服务），系统可用性从99.5%提升至99.95%，部署效率提升5倍</li><li>负责订单服务性能优化，通过缓存、分库分表、异步化改造，QPS从5000提升至20000，延迟从800ms降至320ms</li><li>解决分布式事务一致性难题，设计订单-库存-支付最终一致性方案，事务成功率99.9%</li><li>搭建监控告警体系，故障恢复时间从2小时降至15分钟</li><li>连续2年参与双11/618大促保障，成功支撑2000万+订单洪峰，0故障</li><li>指导3名工程师成长，主导15+次技术分享</li></ul>',
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
                position: 'Java 开发工程师',
                startDate: '2019.07',
                endDate: '2021.03',
                location: '杭州',
                description:
                  '<ul><li>开发商品中心服务，支持亿级SKU数据，商品搜索响应时间<100ms</li><li>负责秒杀系统核心服务开发，支持50万QPS，超卖率0%</li><li>设计可配置化促销引擎，支持10+种促销玩法，配置时间从2小时降至10分钟</li><li>优化商品详情页性能，接口响应从300ms降至50ms，QPS提升4倍</li></ul>',
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
                position: 'Java 开发工程师',
                startDate: '2017.07',
                endDate: '2019.06',
                location: '北京',
                description:
                  '<ul><li>参与商家管理系统开发，实现商家入驻、店铺管理等核心功能，服务10万+商家</li><li>开发订单查询服务，引入Elasticsearch实现多维度查询，查询速度从10s降至0.5s，提升20倍</li><li>参与系统微服务化改造，负责用户服务拆分，提升系统可维护性</li></ul>',
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
                projectName: '交易系统微服务化改造',
                role: '技术负责人',
                startDate: '2022.03',
                endDate: '2023.06',
                techStack: 'Spring Cloud Alibaba, Nacos, Sentinel, Seata, RocketMQ',
                description:
                  '<ul><li>【业务痛点】日均订单从100万增长至500万，单体系统频繁告警，延迟达3s，每次发布需停机2小时，严重影响业务</li><li>【解决方案】主导架构重构，按DDD领域拆分为15个微服务，实现独立开发和部署</li><li>【技术攻坚】解决分库分表、分布式事务、缓存架构等技术难题，设计三级缓存方案，缓存命中率95%</li><li>【业务成果】QPS从5000提升至20000，延迟从3s降至0.8s，可用性从99.5%提升至99.95%，成功支撑2次双11大促（0故障）</li><li>【效率提升】迭代周期从2周缩短至3天，研发效率显著提升</li></ul>',
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
                projectName: '秒杀系统设计与实现',
                role: '核心开发',
                startDate: '2020.08',
                endDate: '2020.12',
                techStack: 'Redis, Lua, RocketMQ, Sentinel',
                description:
                  '<ul><li>【业务场景】支持爆款商品抢购（iPhone、茅台等），峰值100万在线用户，瞬时QPS 50万+，库存仅1000件</li><li>【核心挑战】在高并发流量下保证库存准确性，避免超卖，同时保护下游系统</li><li>【技术方案】设计四层流量防护+Redis预扣库存+异步下单方案，实现削峰填谷和最终一致性</li><li>【业务成果】稳定支撑5次秒杀活动，峰值QPS 15万，抢购成功率99.2%，0超卖、0故障，用户投诉率<0.1%</li><li>【压测验证】全链路压测模拟50万QPS，系统稳定运行，响应时间<100ms</li></ul>',
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
                school: '浙江大学',
                major: '软件工程',
                degree: '本科',
                startDate: '2013.09',
                endDate: '2017.06',
                gpa: '3.7',
                gpaScale: '4.0',
                achievements: '<ul><li>获得校级二等奖学金、优秀学生称号</li></ul>',
                courses: '数据结构与算法、操作系统、计算机网络、数据库系统、软件工程',
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
                  '<ul><li>2023 年度公司优秀员工</li><li>Oracle Certified Professional, Java SE 11 Developer</li><li>CET-6，具备良好的英文文档阅读能力</li></ul>',
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
