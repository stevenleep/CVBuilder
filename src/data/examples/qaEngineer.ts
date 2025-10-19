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
                  '5年+测试经验，擅长自动化测试体系搭建和性能测试，有成功的质量效能提升项目经验。',
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
                description:
                  '<ul><li>搭建自动化测试框架，接口覆盖率85%，UI覆盖率70%，测试效率提升60%</li><li>主导性能测试，发现并解决关键性能瓶颈，系统吞吐量提升50%</li><li>建立质量度量体系，通过数据驱动质量改进，缺陷率下降40%</li><li>组织质量培训和代码评审，提升团队整体质量意识</li></ul>',
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
                company: '软件公司',
                position: '测试工程师',
                startDate: '2018.06',
                endDate: '2020.06',
                location: '上海',
                description:
                  '<ul><li>负责Web和移动端功能测试，发现并跟踪500+缺陷</li><li>编写自动化测试脚本，测试效率提升30%</li><li>参与需求评审和用例设计，保证测试覆盖率</li></ul>',
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
                  '<ul><li><strong>核心能力：</strong>5年+测试经验，擅长自动化测试框架搭建、性能测试、质量体系建设</li><li><strong>技术栈：</strong>Selenium/Appium、JMeter、Python/Java、Jenkins/GitLab CI</li><li><strong>测试方法：</strong>熟练掌握功能测试、接口测试、性能测试、自动化测试</li><li><strong>质量保障：</strong>具备缺陷分析、质量度量、流程优化能力</li></ul>',
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
                projectName: '自动化测试平台',
                role: '测试负责人',
                startDate: '2021.03',
                endDate: '2023.06',
                techStack: 'Python, Selenium, Jenkins, Allure',
                description:
                  '<ul><li>【业务痛点】手工测试效率低、回归测试耗时长，影响快速迭代</li><li>【解决方案】从0到1搭建自动化测试平台，支持多项目多环境，实现用例编排和定时执行</li><li>【持续集成】接入CI/CD流程，实现每日自动化回归测试</li><li>【业务价值】测试效率提升60%，发现缺陷数量增加35%，保障产品质量</li></ul>',
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
                gpa: '3.5',
                gpaScale: '4.0',
                achievements:
                  '<ul><li>获得校级优秀学生奖学金</li><li>参与软件测试课程设计并获优秀</li></ul>',
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
                  '<ul><li>ISTQB 国际软件测试工程师认证</li><li>2023年度优秀员工</li><li>公司技术创新奖</li></ul>',
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
