/**
 * 前端工程师简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const techEngineerExample: ExampleResume = {
  id: 'example-tech-engineer',
  name: '前端工程师简历',
  category: '技术',
  description: '适合前端开发、全栈工程师等技术岗位',
  tags: ['技术', '前端', '工程师'],
  schema: {
    version: '1.0.0',
    meta: {
      title: '前端工程师简历示例',
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
            name: '张晨阳',
            title: '高级前端工程师',
            phone: '138-1234-5678',
            email: 'chenyangz@example.com',
            location: '北京·朝阳区',
            github: 'github.com/chenyangz',
          },
          style: {
            marginBottom: '32px',
          },
          children: [],
        },
        // 2. 技能特长
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '技能特长',
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
                  '<ul><li><strong>核心能力：</strong>5年+前端开发经验，擅长复杂业务系统架构设计与性能优化，有大型项目从0到1经验</li><li><strong>技术栈：</strong>React/Vue 生态、TypeScript、微前端架构、可视化技术</li><li><strong>业务理解：</strong>熟悉 B 端产品开发，有 BI 平台、协作工具、数据可视化等领域经验</li><li><strong>工程化：</strong>具备前端工程化体系搭建能力，包括组件库、脚手架、CI/CD、监控告警</li></ul>',
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
                projectName: 'BI数据分析平台（从0到1）',
                role: '前端技术负责人',
                startDate: '2022.03',
                endDate: '2023.12',
                techStack: 'React, TypeScript, 可视化技术',
                description:
                  '<ul><li>【解决的问题】业务人员取数依赖技术，平均耗时2小时，严重影响决策效率。打造自助式BI平台，让业务自主配置报表</li><li>【核心亮点】设计拖拽式看板编辑器，提供20+图表组件和30+模板，业务人员零代码即可搭建专业数据看板</li><li>【技术难点】攻克大数据渲染性能问题：10万行数据通过虚拟滚动实现流畅交互，图表计算迁移至Web Worker避免主线程卡顿</li><li>【业务成果】上线8个月服务2000+内部用户，日均生成5000+报表，取数效率从2小时降至5分钟（提升96%），满意度4.6/5.0</li><li>【团队协作】协调后端、产品、设计团队，推动需求评审和技术方案落地，按时交付3个大版本和15+迭代</li></ul>',
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
                projectName: '协作平台微前端架构升级',
                role: '架构设计与实施',
                startDate: '2021.09',
                endDate: '2022.02',
                techStack: '微前端架构',
                description:
                  '<ul><li>【业务痛点】5个团队共用单体应用（30万行代码），部署耗时30分钟，一个模块故障导致整体回滚，团队协作效率极低</li><li>【解决方案】主导微前端架构改造，将单体应用拆分为5个独立子应用（文档、项目、IM、日历、云盘），实现独立开发和部署</li><li>【推动落地】制定渐进式迁移方案，搭建脚手架和CI/CD流水线，编写接入文档，指导团队完成迁移</li><li>【业务价值】迭代周期从4周缩短至2.5周（提升40%），部署时间从30分钟降至5分钟，系统可用性从99.5%提升至99.8%</li><li>【技术沉淀】总结最佳实践输出技术文档，在团队内分享微前端架构经验，被3个其他项目复用</li></ul>',
              },
              style: {},
              children: [],
            },
          ],
        },
        // 4. 开源贡献
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '开源贡献',
            icon: '🏆',
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
                  '<ul><li>GitHub个人项目累计3200+ stars，为Ant Design、Vue Router等知名项目贡献代码</li><li>维护React组件库，npm周下载8000+，被200+项目使用</li><li>掘金LV6创作者，发表技术文章50+篇，总阅读60万+</li><li>公司内部技术分享《微前端架构实践》《前端性能优化指南》</li></ul>',
              },
              style: {},
              children: [],
            },
          ],
        },
        // 5. 工作经历
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
                company: '字节跳动',
                position: '高级前端工程师',
                startDate: '2021.06',
                endDate: '至今',
                location: '北京',
                description:
                  '<ul><li>负责协作平台核心功能开发与架构优化，支撑公司全员（2万+）日常办公协作需求</li><li>主导微前端架构落地，解决5个团队协作效率低下问题，研发迭代周期缩短40%，系统可用性提升至99.8%</li><li>搭建企业级组件库，被8个产品线采用，代码复用率从30%提升至70%，开发效率提升50%</li><li>推动性能优化专项，首屏加载时间从3.2s降至1.1s，大数据表格渲染优化后用户满意度从72分提升至89分</li><li>建立工程化体系（代码规范、CI/CD、监控告警），故障恢复时间从2小时降至20分钟，故障率下降60%</li><li>指导4名工程师成长，主导20+场技术分享，提升团队整体技术水平</li></ul>',
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
                position: '前端工程师',
                startDate: '2019.03',
                endDate: '2021.05',
                location: '北京',
                description:
                  '<ul><li>负责商家后台系统开发，包含50+功能模块，服务10万+商家，日均PV 200万+，系统稳定性99.9%</li><li>开发实时数据可视化大屏，支持订单监控、销售分析等场景，优化渲染性能使30+图表流畅刷新</li><li>优化构建配置，bundle体积减少45%，首屏加载从5.2s降至2.8s，改善商家使用体验</li><li>封装30+业务组件和15个Hooks工具，团队开发效率提升50%，代码重复度降低60%</li></ul>',
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
                position: '前端开发工程师',
                startDate: '2017.07',
                endDate: '2019.02',
                location: '北京',
                description:
                  '<ul><li>独立负责SaaS产品前端开发，完成Web、H5和小程序三端实现</li><li>快速响应业务需求，保持2周迭代节奏，按时交付产品功能</li><li>与跨职能团队协作，推动产品从0到1上线并持续优化</li></ul>',
              },
              style: {},
              children: [],
            },
          ],
        },
        // 6. 教育背景
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
                school: '北京航空航天大学',
                major: '计算机科学与技术',
                degree: '本科',
                startDate: '2013.09',
                endDate: '2017.06',
                gpa: '3.7',
                gpaScale: '4.0',
                achievements:
                  '<ul><li>获得校级一等奖学金（2 次）、三好学生称号</li><li>担任计算机学院科技协会技术部部长，组织多场技术分享会</li></ul>',
                courses: '数据结构与算法、操作系统、计算机网络、数据库原理、软件工程',
              },
              style: {},
              children: [],
            },
          ],
        },
        // 7. 证书/获奖
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
                  '<ul><li>2023 年度公司优秀员工（Top 5%）</li><li>2022 年公司黑客马拉松大赛一等奖（团队项目：智能代码审查工具）</li><li>CET-6（英语六级），具备良好的英文文档阅读能力</li></ul>',
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
