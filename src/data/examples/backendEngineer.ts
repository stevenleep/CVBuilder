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
        {
          id: nanoid(),
          type: 'PersonalInfo',
          props: {
            name: '刘强',
            title: 'Java 后端工程师',
            phone: '137-0000-0000',
            email: 'liuqiang@example.com',
            location: '杭州·西湖区',
            github: 'github.com/liuqiang',
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
                  '6年+后端开发经验，精通 Java/Spring 技术栈，熟悉分布式系统设计和微服务架构。有高并发场景优化经验，注重代码质量和系统稳定性。',
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
                company: '某电商平台',
                position: '高级后端工程师',
                startDate: '2020.03',
                endDate: '至今',
                location: '杭州',
                description: '负责核心交易系统的设计和开发',
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
                      '重构订单系统，支持日均百万级订单处理，系统可用性达99.99%',
                      '优化数据库查询性能，关键接口响应时间降低70%',
                      '设计并实现分布式缓存方案，减少数据库压力80%',
                      '搭建微服务监控体系，实现全链路追踪和告警',
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
                company: '互联网公司',
                position: 'Java 开发工程师',
                startDate: '2018.07',
                endDate: '2020.02',
                location: '杭州',
                description: '参与多个业务系统的开发和维护',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '使用 Spring Boot 开发用户中心、支付系统等核心服务',
                      '设计并实现高性能的消息队列处理系统',
                      '优化 SQL 查询和索引，数据库性能提升50%',
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
            title: '技术栈',
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
                  { name: 'Java / Spring', level: 90 },
                  { name: 'MySQL / Redis', level: 85 },
                  { name: '微服务架构', level: 80 },
                  { name: 'Kafka / RabbitMQ', level: 75 },
                  { name: 'Docker / K8s', level: 70 },
                  { name: '性能优化', level: 85 },
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
                name: '分布式交易系统重构',
                role: '核心开发',
                startDate: '2021.06',
                endDate: '2022.12',
                tech: 'Spring Cloud, MySQL, Redis, Kafka',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '设计并实现订单、支付、库存等核心服务的微服务化改造',
                      '引入分布式事务解决方案，保证数据一致性',
                      '系统性能提升5倍，支持并发量从1000 TPS提升至5000 TPS',
                      '搭建完整的监控告警体系，故障恢复时间缩短80%',
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
                major: '软件工程',
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
                    items: ['GPA: 3.6/4.0', '获得校级优秀毕业生', 'ACM 程序设计竞赛省级二等奖'],
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
            title: '自我评价',
            icon: '✨',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'TextBlock',
              props: {
                content:
                  '热爱技术，追求卓越。具备扎实的计算机基础和系统设计能力，能独立完成复杂系统的架构设计。注重代码质量和工程规范，有良好的团队协作精神。持续学习新技术，关注行业动态。',
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
