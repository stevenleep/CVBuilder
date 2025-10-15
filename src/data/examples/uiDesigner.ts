/**
 * UI设计师简历示例
 */

import { nanoid } from 'nanoid'
import type { ExampleResume } from '@/data/types'

export const uiDesignerExample: ExampleResume = {
  id: 'example-ui-designer',
  name: 'UI设计师简历',
  category: '设计',
  description: '适合UI设计师、视觉设计师等岗位',
  tags: ['设计', 'UI', 'UX'],
  schema: {
    version: '1.0.0',
    meta: {
      title: 'UI设计师简历示例',
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
            name: '王思琪',
            title: '资深 UI/UX 设计师',
            phone: '186-5678-1234',
            email: 'siqiwang@example.com',
            location: '深圳·南山区',
            portfolio: 'behance.net/siqiwang',
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
                company: '字节跳动',
                position: '资深 UI/UX 设计师',
                startDate: '2021.08',
                endDate: '至今',
                location: '深圳',
                description: '<ul><li>主导企业级设计系统（Design System）从 0 到 1 搭建，覆盖 Web 和移动端 200+ 组件，被 6 个产品线采用，设计交付效率提升 50%</li><li>负责核心产品的视觉和交互设计，完成 3 个大版本的体验升级，用户满意度从 72 分提升至 88 分</li><li>推动设计规范化流程：制定设计走查标准、组件设计规范、视觉规范文档，保证团队设计质量和一致性</li><li>深度参与用户研究，主导 20+ 场用户访谈和可用性测试，输出用户洞察报告，指导产品设计决策</li><li>优化关键交互流程，通过设计优化将新手引导完成率从 45% 提升至 78%，核心功能使用率提升 35%</li><li>指导 2 名初级设计师成长，定期进行设计评审和技能培训</li></ul>',
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
                company: '腾讯',
                position: 'UI 设计师',
                startDate: '2019.07',
                endDate: '2021.07',
                location: '深圳',
                description: '<ul><li>负责社交产品的视觉设计和交互优化，覆盖 iOS 和 Android 双端，日活用户 500w+</li><li>参与产品品牌视觉升级项目，重新设计 Logo、图标体系和视觉风格，获得 App Store 首页推荐</li><li>设计的动效方案获得团队认可并全面应用，提升产品趣味性和用户留存（次日留存提升 8%）</li><li>与产品和研发紧密协作，快速响应需求迭代，保持双周发版节奏</li></ul>',
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
            icon: '🎨',
          },
          style: {
            marginBottom: '24px',
          },
          children: [
            {
              id: nanoid(),
              type: 'ProjectItem',
              props: {
                projectName: '企业级设计系统（Design System）',
                role: '设计负责人',
                startDate: '2022.03',
                endDate: '2023.06',
                techStack: 'Figma, Auto Layout, Design Tokens, Component Library',
                description: '<ul><li>项目背景：公司多产品线视觉不统一，设计师重复劳动严重，亟需建立统一的设计语言</li><li>设计体系：基于原子设计理论，搭建包含 200+ 组件的设计系统，覆盖 Web 和移动端（iOS/Android）</li><li>设计规范：制定完整的设计规范文档（色彩、字体、间距、图标、布局等），使用 Design Tokens 实现跨平台一致性</li><li>协作流程：在 Figma 搭建组件库和样式库，配合 Auto Layout 和 Variants，提升设计复用率 80%</li><li>开发对接：与前端紧密协作，确保设计还原度，输出组件使用文档，建立设计-开发高效协作流程</li><li>项目成果：设计系统被 6 个产品线采用，设计交付效率提升 50%，品牌视觉一致性显著提升</li></ul>',
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
                projectName: '社交产品品牌视觉升级',
                role: '视觉设计师',
                startDate: '2020.09',
                endDate: '2021.03',
                techStack: 'Brand Design, Motion Design, Illustration',
                description: '<ul><li>项目背景：产品进入成熟期，原有视觉风格陈旧，需要品牌升级吸引年轻用户</li><li>设计策略：通过用户调研和竞品分析，确定年轻化、活力感的视觉方向</li><li>视觉设计：重新设计品牌 Logo、图标体系、插画风格、配色方案，打造全新视觉语言</li><li>动效设计：设计微交互动效和过场动画，提升产品趣味性和情感化体验</li><li>落地推广：设计启动页、引导页、宣传物料，协助运营团队进行品牌推广</li><li>项目成果：新版本获得 App Store 首页推荐，用户好评率提升至 4.8 分，次日留存提升 8%</li></ul>',
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
                  '<ul><li><strong>设计工具：</strong>精通 Figma（插件开发、Auto Layout、Variants）、Sketch，熟练使用 Principle/ProtoPie 做高保真交互原型</li><li><strong>视觉设计：</strong>Adobe Creative Suite（Photoshop、Illustrator、After Effects、XD），掌握平面设计、品牌设计、动效设计</li><li><strong>设计理论：</strong>熟悉交互设计原则（尼尔森十大可用性原则、格式塔原理）、视觉设计理论（色彩、排版、栅格系统）</li><li><strong>设计系统：</strong>掌握 Atomic Design、Design Tokens、Component Library 搭建，有完整的设计系统建设经验</li><li><strong>用户研究：</strong>熟悉用户访谈、问卷调查、可用性测试、A/B 测试等研究方法，能输出用户洞察报告</li><li><strong>跨端设计：</strong>熟悉 iOS、Android、Web 设计规范（HIG、Material Design），能完成多端适配设计</li><li><strong>协作能力：</strong>了解前端基础（HTML/CSS/JavaScript），能与开发高效协作，使用 Zeplin/蓝湖进行设计交付</li></ul>',
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
                school: '中国美术学院',
                major: '视觉传达设计',
                degree: '本科',
                startDate: '2015.09',
                endDate: '2019.06',
                gpa: '3.8',
                gpaScale: '4.0',
                achievements: '<ul><li>毕业设计《城市记忆 - 杭州文化视觉系统》获得优秀毕业设计奖</li><li>担任设计学院学生会宣传部部长，负责学院视觉物料设计</li></ul>',
                courses: '平面设计、品牌设计、交互设计、动态图形设计、用户体验设计',
              },
              style: {},
              children: [],
            },
          ],
        },
        // 6. 获奖经历
        {
          id: nanoid(),
          type: 'Section',
          props: {
            title: '获奖经历',
            icon: '🏆',
          },
          style: {},
          children: [
            {
              id: nanoid(),
              type: 'SkillList',
              props: {
                content:
                  '<ul><li><strong>iF 设计奖</strong>（2023）：企业协作产品设计系统</li><li><strong>Red Dot 红点奖</strong>（2022）：社交产品品牌设计入围作品</li><li><strong>站酷网</strong>：年度推荐设计师，作品收藏 8000+，粉丝 15000+</li><li><strong>Dribbble</strong>：Top Designer，作品获赞 20000+</li><li>公司年度最佳设计师（2022、2023）</li></ul>',
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
