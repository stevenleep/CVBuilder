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
                  '<ul><li><strong>编程语言：</strong>精通 Java（JVM 原理、并发编程、性能调优），熟悉 Kotlin、Go</li><li><strong>开发框架：</strong>Spring Boot、Spring Cloud、Spring Cloud Alibaba、MyBatis、MyBatis-Plus、JPA</li><li><strong>微服务：</strong>Nacos、Dubbo、Sentinel、Seata、Gateway、Feign</li><li><strong>数据库：</strong>MySQL（索引优化、SQL 调优、主从复制、分库分表）、PostgreSQL、MongoDB</li><li><strong>缓存：</strong>Redis（数据结构、持久化、集群、缓存设计模式）、Caffeine、Guava Cache</li><li><strong>消息队列：</strong>RocketMQ、Kafka、RabbitMQ，熟悉消息可靠性保证、削峰填谷</li><li><strong>搜索引擎：</strong>Elasticsearch（索引设计、查询优化、聚合分析）</li><li><strong>中间件：</strong>Nginx、Tomcat、Netty、ZooKeeper</li><li><strong>DevOps：</strong>Docker、Kubernetes、Jenkins、GitLab CI/CD、Prometheus、Grafana、ELK</li><li><strong>架构能力：</strong>微服务架构、分布式系统设计、高并发系统优化、系统稳定性保障</li></ul>',
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
                  '<ul><li>【架构重构】主导交易系统微服务拆分，将 50w+ 行代码的单体应用按 DDD 领域拆分为订单、支付、库存等 15 个微服务。采用 Spring Cloud Alibaba 技术栈，系统可用性从 99.5% 提升至 99.95%，部署效率提升 5 倍</li><li>【性能优化】负责订单服务性能调优专项：(1)引入 Redis 多级缓存，缓存命中率 95%；(2)订单表按用户ID分256张表，解决单表2亿数据瓶颈；(3)异步化改造下单流程，QPS 从 5000 提升至 20000，P99 延迟从 800ms 降至 320ms</li><li>【技术攻坚】设计分布式事务解决方案，基于 Seata AT 模式实现订单-库存-支付的最终一致性，TPS 达到 5000+，事务成功率 99.9%，解决了跨服务数据一致性难题</li><li>【稳定性建设】搭建完整的监控告警体系：使用 Prometheus 采集 JVM、接口、数据库等 50+ 核心指标，Grafana 可视化大盘，Alertmanager 分级告警。MTTR（平均故障恢复时间）从 2 小时降至 15 分钟</li><li>【大促保障】连续 2 年参与双11/618 大促保障，负责系统容量规划、全链路压测（模拟 50w QPS）、应急预案制定。成功支撑双11当天 2000w+ 订单洪峰，0故障</li><li>【团队协作】指导 3 名初中级工程师成长，每周进行代码 Review，主导技术分享 15+ 次，帮助团队提升技术水平</li></ul>',
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
                  '<ul><li>【商品中心】使用 Spring Boot + MyBatis-Plus + Redis 开发商品中心服务，支持 SPU/SKU 多级管理。引入 Elasticsearch 实现商品搜索（分词、过滤、排序），查询 RT &lt; 100ms，支持亿级 SKU 数据</li><li>【秒杀系统】负责库存扣减核心服务开发，使用 Redis + Lua 脚本实现原子性扣减，结合令牌桶限流和消息队列削峰，支持秒杀场景 50w QPS，超卖率 0%</li><li>【促销引擎】设计可配置化促销规则引擎，支持满减、折扣、买赠、优惠券等 10+ 种促销玩法。采用责任链模式 + Groovy 脚本实现规则热更新，促销活动配置时间从 2 小时降至 10 分钟</li><li>【性能优化】针对商品详情页进行全面优化：(1)添加联合索引，SQL 执行时间从 300ms 降至 30ms；(2)引入 Caffeine 本地缓存 + Redis 二级缓存；(3)接口响应时间从 300ms 降至 50ms，QPS 提升 4 倍</li></ul>',
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
                  '<ul><li>【商家后台】参与商家管理系统开发，使用 Spring MVC + MyBatis 实现商家入驻审核、店铺信息管理、菜品上下架等核心功能，服务 10w+ 商家</li><li>【订单查询】开发订单查询服务，将历史订单数据同步到 Elasticsearch（使用 Canal 监听 MySQL binlog），支持订单号、用户ID、商家ID、时间范围等多维度组合查询，查询速度从 10s 降至 0.5s，提升 20 倍</li><li>【微服务改造】参与系统从单体到微服务的重构，负责用户服务拆分，使用 Dubbo 实现 RPC 调用，配置 Nacos 服务注册发现，提升了系统的可维护性和扩展性</li></ul>',
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
                  '<ul><li>【背景痛点】原交易系统单体应用代码量 50w+ 行，200+ 个接口耦合在一起，每次发布需要停机 2 小时，研发效率低下。日均订单量从 100w 增长到 500w，系统频繁告警，P99 延迟达 3s</li><li>【架构设计】采用 DDD 领域驱动设计，识别出订单域、支付域、库存域、促销域等核心领域，拆分为 15 个独立微服务。每个服务独立数据库，通过 API Gateway 统一对外</li><li>【技术选型】Spring Cloud Alibaba 全家桶：Nacos（服务注册发现+配置中心）、Sentinel（限流降级熔断，QPS阈值3000）、Seata（分布式事务，TCC+AT模式）、Gateway（网关路由+鉴权）</li><li>【数据层设计】订单表按用户ID哈希分256张表（ShardingSphere），单表数据控制在 500w 内。主从复制+读写分离，读库 3 个，写压力降低 70%。历史订单归档到 HBase，在线数据保留 6 个月</li><li>【缓存架构】三级缓存：Caffeine 本地缓存（热点数据，1000 条）+ Redis（用户维度，TTL 1h）+ MySQL。缓存穿透用布隆过滤器，缓存击穿用互斥锁，缓存命中率 95%</li><li>【异步化改造】下单流程引入 RocketMQ，同步扣库存+异步创单+异步扣优惠券。消息堆积监控，消费延迟 &lt; 100ms。保证最终一致性，补偿任务兜底</li><li>【项目成果】系统 QPS 从 5000 提升至 20000，可用性从 99.5% 提升至 99.95%，P99延迟从 3s 降至 0.8s。服务独立部署，迭代周期从 2 周缩短至 3 天。成功支撑 2 次双11大促，0 故障</li></ul>',
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
                  '<ul><li>【业务场景】设计高并发秒杀系统，支持 iPhone、茅台等爆款商品抢购。预计峰值 100w 在线用户，瞬时 QPS 50w+，库存仅 1000 件</li><li>【流量控制】四层防护：(1)前端按钮 3s 防重；(2)CDN 静态资源加速；(3)Nginx + OpenResty 网关层限流（令牌桶算法，QPS 10w）；(4)后端 Sentinel 服务级限流降级（QPS 5w，快速失败）</li><li>【库存方案】Redis 预扣库存方案：提前将库存加载到 Redis，使用 Lua 脚本保证原子性扣减。库存分段（100份×10库存），减少锁竞争。内存超卖保护，DB 兜底扣减。扣减成功率 99.9%，RT &lt; 10ms</li><li>【异步下单】秒杀成功返回抢购凭证，投递 RocketMQ 消息队列异步创建订单。消息削峰填谷，QPS 从 50w 降至 5w，保护下游订单服务。订单创建失败自动回滚库存</li><li>【缓存预热】秒杀前 10 分钟预热：商品信息、库存、用户信息批量加载到 Redis。使用分布式锁防止缓存击穿，布隆过滤器防止缓存穿透</li><li>【压测验证】使用 JMeter 全链路压测，模拟 50w QPS，持续 10 分钟。系统稳定无异常，CPU 60%，内存 70%，RT &lt; 100ms</li><li>【项目成果】上线后稳定支撑 5 次秒杀活动（iPhone14、茅台、飞天等），峰值 QPS 15w，抢购成功率 99.2%，用户投诉率 &lt; 0.1%。0 超卖，0 故障</li></ul>',
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
