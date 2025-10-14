/**
 * 测试工程师简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const qaEngineerExample: ExampleResume = {
  id: 'example-qa-engineer',
  name: '测试工程师简历',
  category: '技术',
  description: '适合测试工程师、QA等岗位',
  tags: ['测试', 'QA', '质量'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '测试工程师简历示例',
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
            name: '王敏',
            title: '高级测试工程师',
            phone: '135-0000-0000',
            email: 'wangmin@example.com',
            location: '上海·徐汇区',
            github: 'github.com/wangmin',
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
                  '5年+测试开发经验，精通自动化测试和性能测试。熟悉测试框架搭建和CI/CD流程，有丰富的缺陷分析和质量保障经验。',
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
                company: '某互联网公司',
                position: '高级测试工程师',
                startDate: '2020.07',
                endDate: '至今',
                location: '上海',
                description: '负责核心业务的测试工作和质量保障',
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
                      '搭建自动化测试框架，接口自动化覆盖率达85%，UI自动化覆盖率70%',
                      '主导性能测试和压测工作，发现并解决多个性能瓶颈，系统吞吐量提升50%',
                      '建立质量度量体系，通过数据分析驱动质量改进',
                      '组织代码评审和质量培训，团队整体缺陷率下降40%',
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
                company: '软件公司',
                position: '测试工程师',
                startDate: '2018.06',
                endDate: '2020.06',
                location: '上海',
                description: '参与多个项目的功能测试和自动化测试',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '负责Web和移动端应用的功能测试，发现并跟踪缺陷500+个',
                      '编写自动化测试脚本，减少重复性工作，提升测试效率30%',
                      '参与需求评审和测试用例设计，保证测试覆盖率',
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
                  '<ul><li>精通 Selenium、Appium 等自动化测试框架</li><li>熟练使用 Postman、JMeter、Locust 进行接口和性能测试</li><li>掌握 Python、Java 编程语言，能独立开发测试工具</li><li>熟悉 Jenkins、GitLab CI 等持续集成工具</li><li>了解 Docker、Kubernetes 容器化技术</li><li>具备良好的缺陷分析和定位能力</li></ul>',
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
                name: '自动化测试平台',
                role: '测试负责人',
                startDate: '2021.03',
                endDate: '2023.06',
                tech: 'Python, Selenium, Jenkins, Allure',
              },
              style: {},
              children: [
                {
                  id: nanoid(),
                  type: 'BulletList',
                  props: {
                    items: [
                      '从0到1搭建公司级自动化测试平台，支持多项目多环境测试',
                      '实现用例编排、定时执行、结果统计等核心功能',
                      '接入CI/CD流程，实现每日自动化回归测试',
                      '平台使用后，团队测试效率提升60%，发现缺陷数量增加35%',
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
                major: '计算机科学与技术',
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
                    items: [
                      'GPA: 3.5/4.0',
                      '获得校级优秀学生奖学金',
                      '参与软件测试课程设计并获优秀',
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
            title: '证书/获奖',
            icon: '🏅',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'TextBlock',
              props: {
                content: '• ISTQB 国际软件测试工程师认证\n• 2023年度优秀员工\n• 公司技术创新奖',
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
