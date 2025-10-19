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
                description:
                  '<ul><li>主导企业级设计系统从0到1搭建，覆盖200+组件，被6个产品线采用，设计交付效率提升50%</li><li>负责核心产品体验升级，用户满意度从72分提升至88分</li><li>推动设计规范化，制定设计走查标准和组件规范，保证设计质量和一致性</li><li>主导20+场用户研究，输出洞察报告指导产品设计决策</li><li>优化关键交互流程，新手引导完成率从45%提升至78%，核心功能使用率提升35%</li><li>指导2名初级设计师成长，进行设计评审和培训</li></ul>',
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
                description:
                  '<ul><li>负责社交产品视觉和交互设计（iOS/Android），服务500万+日活用户</li><li>参与品牌视觉升级，重新设计Logo和图标体系，获App Store首页推荐</li><li>设计动效方案提升产品趣味性，次日留存提升8%</li><li>与产品研发协作，快速响应需求，保持双周发版节奏</li></ul>',
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
                description:
                  '<ul><li>【业务痛点】多产品线视觉不统一，设计师重复劳动严重，效率低下</li><li>【解决方案】基于原子设计理论搭建设计系统，覆盖200+组件（Web/iOS/Android）</li><li>【设计规范】制定完整规范文档（色彩、字体、间距、图标），使用Design Tokens实现跨平台一致性</li><li>【协作流程】在Figma搭建组件库，设计复用率提升80%，与前端建立高效协作流程</li><li>【业务价值】被6个产品线采用，设计交付效率提升50%，品牌一致性显著提升</li></ul>',
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
                description:
                  '<ul><li>【业务目标】产品视觉风格陈旧，需要品牌升级吸引年轻用户</li><li>【设计策略】通过用户调研和竞品分析，确定年轻化、活力感的视觉方向</li><li>【视觉设计】重新设计Logo、图标、插画风格、配色方案，打造全新视觉语言</li><li>【动效设计】设计微交互和过场动画，提升产品趣味性和情感化体验</li><li>【业务成果】获App Store首页推荐，用户好评率提升至4.8分，次日留存提升8%</li></ul>',
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
                  '<ul><li><strong>核心能力：</strong>5年+UI/UX设计经验，擅长设计系统搭建、品牌设计、交互设计，有成功的设计系统和品牌升级项目经验</li><li><strong>设计工具：</strong>精通Figma/Sketch，熟练使用Adobe全家桶、Principle/ProtoPie</li><li><strong>设计能力：</strong>掌握交互设计、视觉设计、动效设计、用户研究方法</li><li><strong>业务理解：</strong>熟悉iOS/Android/Web设计规范，了解前端技术，能与开发高效协作</li></ul>',
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
                achievements:
                  '<ul><li>毕业设计《城市记忆 - 杭州文化视觉系统》获得优秀毕业设计奖</li><li>担任设计学院学生会宣传部部长，负责学院视觉物料设计</li></ul>',
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
