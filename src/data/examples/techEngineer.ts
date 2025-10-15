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
                  '<ul><li><strong>前端框架：</strong>精通 React (Hooks/Context/HOC)、Vue 2/3 (Composition API/Pinia)，熟悉 Next.js/Nuxt.js 服务端渲染</li><li><strong>编程语言：</strong>精通 JavaScript (ES6+)、TypeScript，了解 Node.js 服务端开发</li><li><strong>状态管理：</strong>Redux/Redux Toolkit、Zustand、React Query、Vuex/Pinia</li><li><strong>构建工具：</strong>Webpack、Vite、Rollup、esbuild，能进行性能优化和自定义配置</li><li><strong>UI 框架：</strong>Ant Design、Element Plus、Material-UI、Tailwind CSS</li><li><strong>工程化：</strong>熟悉前端工程化体系，pnpm/Monorepo、ESLint/Prettier、Husky、Commitlint</li><li><strong>性能优化：</strong>首屏优化、包体积优化、运行时性能优化、监控与分析（Lighthouse、Performance API）</li><li><strong>其他技能：</strong>微前端架构、组件库开发、可视化（ECharts/D3.js）、单元测试（Jest/Vitest）</li></ul>',
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
                projectName: '企业级BI数据分析平台',
                role: '前端技术负责人',
                startDate: '2022.03',
                endDate: '2023.12',
                techStack: 'React 18, TypeScript, Ant Design Pro, ECharts, D3.js, React Query',
                description:
                  '<ul><li>【项目背景】企业内部数据分散在各个系统（MySQL、Hive、ClickHouse），业务人员需要找技术取数，效率低下。需要打造自助式BI平台，让业务人员自己配置报表和看板</li><li>【技术架构】React 18（Concurrent Mode 提升交互响应）+ TypeScript（类型安全）+ Ant Design Pro。状态管理：React Query（服务端状态，自动缓存重试）+ Zustand（客户端状态，轻量级）。构建：Vite 4（HMR &lt; 200ms）</li><li>【拖拽编辑器】基于 react-dnd 实现可视化看板拖拽搭建：(1)组件库：20+ 图表组件（折线图、柱状图、饼图、散点图、地图等），ECharts + D3.js 双引擎；(2)配置面板：可视化配置数据源、样式、交互；(3)实时预览：修改配置立即渲染；(4)模板市场：预置 30+ 看板模板</li><li>【权限系统】RBAC 权限模型：角色-权限-资源三层设计。支持看板级、数据源级、行级、列级四种粒度权限控制。前端根据权限动态渲染菜单和按钮，后端 API 网关校验权限，确保数据安全</li><li>【性能优化】大数据场景优化：(1)虚拟滚动：react-window 渲染可视区域，10w行数据流畅滚动（FPS 60）；(2)Web Worker：图表数据计算放到 Worker，主线程不卡顿；(3)分页加载：单次加载 1000 条，滚动加载更多；(4)数据缓存：React Query 缓存 5 分钟，减少请求</li><li>【项目成果】上线 8 个月，服务内部 2000+ 用户（产品、运营、业务），日均访问 8000+ 次，生成报表 5000+ 份。取数效率从平均 2 小时降至 5 分钟（提升 96%），系统可用性 99.9%，用户满意度 4.6/5.0</li></ul>',
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
                projectName: '微前端架构升级与落地',
                role: '架构设计与实施',
                startDate: '2021.09',
                endDate: '2022.02',
                techStack: 'qiankun, Vite, pnpm, Monorepo',
                description:
                  '<ul><li>【痛点分析】原协作平台单体应用：代码 30w+ 行，打包 15 分钟，部署 30 分钟。5 个团队（文档、项目、IM、日历、云盘）共用一个仓库，代码冲突频繁，发布相互阻塞。一个模块出 bug 导致整个系统回滚</li><li>【技术方案】采用 qiankun 2.x 微前端框架：主应用（基座）负责路由分发、权限校验、用户信息；子应用独立开发、独立部署、独立运行。JS 沙箱隔离（Proxy），样式隔离（Shadow DOM），应用间通信（发布订阅模式）</li><li>【基建配套】(1)Monorepo：pnpm workspace 管理代码，共享公共依赖；(2)脚手架：CLI 工具快速创建子应用模板；(3)CI/CD：GitLab CI 流水线，子应用独立构建部署（2 分钟上线）；(4)文档：编写接入指南和最佳实践文档</li><li>【渐进式迁移】分 3 个阶段迁移：(1)Phase1：新功能以子应用形式开发，验证可行性；(2)Phase2：将存量功能按模块拆分成子应用（文档→项目→IM→日历→云盘）；(3)Phase3：优化性能和体验，完善监控</li><li>【落地成果】成功拆分为 5 个子应用，代码仓库解耦，团队并行开发。构建时间从 15min 降至 2min，部署时间从 30min 降至 5min。迭代周期从 4 周缩短至 2.5 周（效率提升 40%）。子应用独立发布，互不影响，可用性从 99.5% 提升至 99.8%</li></ul>',
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
                  '<ul><li><strong>GitHub</strong>：活跃贡献者，个人项目累计获得 3200+ stars，参与多个知名开源项目（Ant Design、Vue Router）</li><li><strong>开源项目</strong>：维护 React 业务组件库 react-advanced-ui，npm 周下载量 8000+，被 200+ 项目使用</li><li><strong>技术博客</strong>：掘金 LV6 创作者，发表原创技术文章 50+ 篇，总阅读量 60w+，多篇文章被掘金官方推荐</li><li><strong>技术分享</strong>：内部分享《微前端架构实践》《前端性能优化指南》，公司前端月会技术出品人</li></ul>',
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
                  '<ul><li>【技术升级】主导团队前端技术栈升级：React 16 → React 18（Concurrent Mode、Suspense）+ Webpack 4 → Vite 4。构建速度从 180s 降至 45s（提升 4 倍），HMR 从 3s 降至 200ms。首屏加载优化：代码分割+懒加载+预加载，FCP 从 3.2s 降至 1.1s，LCP &lt; 2.5s，CLS &lt; 0.1，Core Web Vitals 全部达到优秀</li><li>【微前端架构】设计并落地 qiankun 微前端方案，主应用（基座）+ 5 个子应用（文档、项目、IM、日历、云盘）。沙箱隔离避免样式和JS污染，应用间通信采用发布订阅模式。团队从串行开发改为并行开发，迭代周期从 4 周缩短至 2.5 周（效率提升 40%）</li><li>【组件库建设】从 0 到 1 搭建企业级 UI 组件库 ByteUI，基于 Ant Design 二次封装 + 业务组件，包含 60+ 组件。发布 npm 包，配置 CLI 脚手架，提供完整文档和 Demo。被 8 个产品线采用，代码复用率从 30% 提升至 70%，设计规范统一性提升 90%</li><li>【工程化实践】建立完整的前端工程化体系：(1)代码规范：ESLint + Prettier + Husky + Commitlint；(2)CI/CD：GitLab CI 自动化测试+构建+部署，部署时间从 30min 降至 5min；(3)监控告警：接入 Sentry 错误监控 + 自研埋点 SDK，线上故障 MTTR 从 2h 降至 20min，故障率下降 60%</li><li>【性能优化】负责性能优化专项，优化大数据表格（10w+ 行）：虚拟滚动技术（react-window）降低 DOM 节点，懒加载图片（Intersection Observer），Web Worker 计算密集任务。渲染性能从卡顿（FPS 15）提升至流畅（FPS 60），用户满意度从 72 分提升至 89 分</li><li>【团队建设】作为团队技术 Leader，指导 4 名初中级工程师成长。每周代码 Review（CodeReview 覆盖率 100%），每两周技术分享（已分享 20+ 场），制定前端技术成长路线图</li></ul>',
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
                  '<ul><li>【商家后台】使用 React + TypeScript + Ant Design Pro 开发商家管理后台系统，包含店铺管理、商品管理、订单管理、数据分析等 50+ 功能模块，服务 10w+ 商家。日均 PV 200w+，系统稳定性 99.9%</li><li>【数据大屏】开发实时数据可视化大屏，使用 ECharts + D3.js 绘制 20+ 种图表类型，WebSocket 推送实时数据（每秒 1000+ 条）。支持订单实时监控、销售趋势分析、地域热力图等。优化渲染性能，单屏 30+ 图表流畅刷新（FPS 60）</li><li>【构建优化】深度优化 Webpack 打包配置：(1)代码分割：按路由懒加载+第三方库单独打包；(2)Tree Shaking 去除无用代码；(3)压缩混淆：TerserPlugin + CSS压缩；(4)CDN 加速静态资源。最终 bundle 体积从 8.5MB 降至 4.7MB（减少 45%），首屏加载从 5.2s 降至 2.8s</li><li>【组件沉淀】封装业务组件库（TablePro、FormBuilder、SearchForm等 30+ 个）和 Hooks 工具集（useRequest、useTable、usePagination等 15个）。团队开发效率提升 50%，重复代码减少 60%</li></ul>',
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
                  '<ul><li>使用 Vue 2.x 全家桶开发 SaaS 产品，独立负责前端架构设计和功能实现</li><li>完成移动端 H5 和小程序的开发，实现多端代码复用（Taro 框架）</li><li>与产品、设计、后端紧密协作，快速响应需求迭代，平均 2 周完成一个版本发布</li></ul>',
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
