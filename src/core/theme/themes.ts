/**
 * 预设主题配置（极致阅读体验版）
 *
 * 每个主题都基于以下专业简历设计原则：
 *
 * 核心原则：
 * 1. 字体大小 - 正文 12-13px（专业简历标准）
 * 2. 行高控制 - 1.45-1.6（平衡密度与舒适度）
 * 3. 深色文字 - #0a-#1a（高对比，易读不刺眼）
 * 4. 清晰层次 - 字重阶梯明确（400/600/700）
 * 5. 精准间距 - 页边距 45-55mm，章节 16-22mm
 * 6. 微妙背景 - section 用 #f5-#f8 浅灰
 */

import { ITheme } from '../protocols/IThemeProtocol'

/**
 * 1. 经典优雅 ⭐ 默认推荐
 *
 * 设计哲学：平衡之美
 * - 基于瑞士国际主义设计风格
 * - 所有参数都是最平衡的选择
 * - 适合 90% 的简历场景
 *
 * 关键参数：
 * - 正文 12px，行高 1.55（黄金比例）
 * - 页边距 50mm，章节间距 18mm
 * - 深黑文字 #0a0a0a，高对比度
 */
export const classicTheme: ITheme = {
  id: 'classic',
  name: '经典优雅',
  description: '最均衡的选择，适合所有场景',
  font: {
    family: '"Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
    titleSize: {
      h1: 20, // 姓名：精致和谐，不过分突出
      h2: 15, // 章节标题：稍微缩小，更精致
      h3: 13, // 条目标题：和正文对比更合理
    },
    bodySize: {
      large: 13, // 职位/副标题：和标题更协调
      normal: 12, // 正文：保持黄金大小
      small: 11, // 辅助信息：保持
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  color: {
    primary: '#0a0a0a',
    text: {
      primary: '#0a0a0a', // 深黑，清晰不刺眼
      secondary: '#3a3a3a', // 深灰，层次分明
      tertiary: '#7a7a7a', // 中灰，不会太浅
      link: '#0a0a0a',
    },
    background: {
      page: '#ffffff',
      section: '#f6f6f6', // 微妙的浅灰
    },
    border: {
      light: '#ececec',
      normal: '#d4d4d4', // 柔和但清晰
      dark: '#a8a8a8',
    },
    accent: '#0a0a0a',
  },
  spacing: {
    page: 50, // 标准页边距
    section: 18, // 清晰的章节分隔
    item: 12, // 条目易于区分
    paragraph: 7,
    line: 4,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 16,
    lineHeight: 1.55, // 最佳简历行高
  },
  style: {
    showSectionDivider: true,
    dividerStyle: 'solid',
    dividerThickness: 1,
    showPersonalInfoDivider: false,
    borderRadius: 0,
    useEmojiIcons: false,
  },
}

/**
 * 2. 极简呼吸
 *
 * 设计哲学：少即是多
 * - 受包豪斯设计影响
 * - 大胆的留白艺术
 * - 无分割线，靠间距建立层次
 *
 * 关键参数：
 * - 正文 12.5px，行高 1.6
 * - 页边距 58mm（大胆），章节间距 24mm
 * - 纯黑 #000，极简风格
 * - 姓名 40px，视觉冲击力
 */
export const minimalTheme: ITheme = {
  id: 'minimal',
  name: '极简呼吸',
  description: '大胆留白，内容为王',
  font: {
    family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", sans-serif',
    titleSize: {
      h1: 22, // 姓名：精致和谐
      h2: 14, // 章节：保持小巧精致
      h3: 12.5, // 条目：保持低调
    },
    bodySize: {
      large: 13.5, // 稍微缩小
      normal: 12, // 正文：统一为12，更协调
      small: 11,
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 400, // 降低对比
      semibold: 500,
      bold: 600, // 适度加粗
    },
  },
  color: {
    primary: '#000000',
    text: {
      primary: '#000000', // 纯黑
      secondary: '#2a2a2a', // 深灰
      tertiary: '#9a9a9a', // 浅灰
      link: '#000000',
    },
    background: {
      page: '#ffffff',
      section: '#ffffff', // 无背景
    },
    border: {
      light: '#f8f8f8',
      normal: '#f0f0f0',
      dark: '#e8e8e8',
    },
    accent: '#000000',
  },
  spacing: {
    page: 58, // 大页边距，呼吸感
    section: 24, // 大章节间距
    item: 15, // 大条目间距
    paragraph: 10,
    line: 6,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 22,
    lineHeight: 1.6, // 舒适行高
  },
  style: {
    showSectionDivider: false, // 无分割线
    dividerStyle: 'solid',
    dividerThickness: 0,
    showPersonalInfoDivider: false,
    borderRadius: 0,
    useEmojiIcons: false,
  },
}

/**
 * 3. 紧凑专业
 *
 * 设计哲学：高效利用空间
 * - 为内容丰富的简历设计
 * - 缩小间距但保持可读性下限
 * - 依然清晰的视觉层次
 *
 * 关键参数：
 * - 正文 11.5px，行高 1.48（紧凑下限）
 * - 页边距 42mm，章节间距 15mm
 * - 保持深色文字确保清晰度
 */
export const compactTheme: ITheme = {
  id: 'compact',
  name: '紧凑专业',
  description: '信息密集，内容多时首选',
  font: {
    family: 'Arial, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif',
    titleSize: {
      h1: 18, // 姓名：紧凑精致
      h2: 14, // 章节：更统一
      h3: 12.5, // 条目：保持
    },
    bodySize: {
      large: 12.5, // 更接近正文
      normal: 11.5, // 正文：可读性下限
      small: 10.5,
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  color: {
    primary: '#0a0a0a',
    text: {
      primary: '#0a0a0a', // 深黑，保证可读
      secondary: '#333333', // 深灰
      tertiary: '#757575', // 不要太浅
      link: '#0a0a0a',
    },
    background: {
      page: '#ffffff',
      section: '#f8f8f8',
    },
    border: {
      light: '#f0f0f0',
      normal: '#d8d8d8',
      dark: '#c0c0c0',
    },
    accent: '#0a0a0a',
  },
  spacing: {
    page: 42, // 紧凑但不压抑
    section: 15, // 紧凑章节
    item: 10, // 紧凑条目
    paragraph: 6,
    line: 3,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 14,
    lineHeight: 1.48, // 紧凑但可读
  },
  style: {
    showSectionDivider: true,
    dividerStyle: 'solid',
    dividerThickness: 1,
    showPersonalInfoDivider: false,
    borderRadius: 0,
    useEmojiIcons: false,
  },
}

/**
 * 4. 现代清新
 *
 * 设计哲学：年轻化视觉
 * - 现代 Web 设计风格
 * - 较大字号，清晰直接
 * - 微妙圆角，亲和友好
 *
 * 关键参数：
 * - 正文 13px（大字号），行高 1.55
 * - 微圆角 3px，现代感
 * - Inter 字体，现代简洁
 */
export const modernTheme: ITheme = {
  id: 'modern',
  name: '现代清新',
  description: '清新简洁，互联网公司首选',
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", "PingFang SC", sans-serif',
    titleSize: {
      h1: 21, // 姓名：精致现代
      h2: 15, // 章节：保持
      h3: 13, // 条目：保持
    },
    bodySize: {
      large: 13.5, // 稍微缩小
      normal: 12, // 正文：统一为12，更协调
      small: 11,
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 600,
    },
  },
  color: {
    primary: '#0d0d0d',
    text: {
      primary: '#0d0d0d',
      secondary: '#454545',
      tertiary: '#8a8a8a',
      link: '#0d0d0d',
    },
    background: {
      page: '#ffffff',
      section: '#f7f7f7',
    },
    border: {
      light: '#f2f2f2',
      normal: '#e2e2e2',
      dark: '#d2d2d2',
    },
    accent: '#0d0d0d',
  },
  spacing: {
    page: 50,
    section: 19,
    item: 12,
    paragraph: 8,
    line: 5,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 18,
    lineHeight: 1.55,
  },
  style: {
    showSectionDivider: true,
    dividerStyle: 'solid',
    dividerThickness: 1,
    showPersonalInfoDivider: false,
    borderRadius: 3, // 微圆角
    useEmojiIcons: false,
  },
}

/**
 * 5. 典雅书卷
 *
 * 设计哲学：传统优雅
 * - 衬线字体，书卷气息
 * - 较大字号和行高，衬线特性
 * - 温暖色调，优雅从容
 *
 * 关键参数：
 * - 正文 13px（衬线需要更大），行高 1.65
 * - 页边距 54mm，舒展大气
 * - 米白背景 #fafaf8，书页质感
 * - Georgia 字体，经典衬线
 */
export const elegantTheme: ITheme = {
  id: 'elegant',
  name: '典雅书卷',
  description: '温文尔雅，传统行业首选',
  font: {
    family: 'Georgia, "Palatino Linotype", "Songti SC", "STSong", serif',
    titleSize: {
      h1: 20, // 姓名：精致优雅
      h2: 15, // 章节：稍微缩小
      h3: 13, // 条目：更统一
    },
    bodySize: {
      large: 13, // 更接近正文
      normal: 12, // 正文：统一为12
      small: 11,
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  color: {
    primary: '#1f1f1f',
    text: {
      primary: '#1f1f1f', // 温暖深色
      secondary: '#3d3d3d', // 柔和灰
      tertiary: '#7d7d7d', // 优雅浅灰
      link: '#1f1f1f',
    },
    background: {
      page: '#fffffe', // 极浅暖白
      section: '#fafaf8', // 米白，书页感
    },
    border: {
      light: '#f0f0ee',
      normal: '#d8d8d6',
      dark: '#c0c0be',
    },
    accent: '#1f1f1f',
  },
  spacing: {
    page: 54, // 宽敞留白
    section: 21, // 舒展间距
    item: 13, // 充分区分
    paragraph: 9,
    line: 5,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 20,
    lineHeight: 1.65, // 衬线最佳
  },
  style: {
    showSectionDivider: true,
    dividerStyle: 'solid',
    dividerThickness: 1,
    showPersonalInfoDivider: true,
    borderRadius: 0,
    useEmojiIcons: false,
  },
}

/**
 * 6. 飞书文档
 *
 * 设计哲学：协作友好
 * - 仿照飞书文档的排版风格
 * - 舒适的阅读体验，适合长文档
 * - 清晰的层次感，统一的视觉节奏
 *
 * 关键参数：
 * - 正文 14px（飞书标准），行高 1.75
 * - 页边距 50mm，舒适宽敞
 * - 飞书配色：文字 #1f2329，次要 #646a73
 * - 背景 #ffffff（纯白），清爽简洁
 * - 微圆角 4px，柔和现代
 * - 统一的间距节奏：20/14/10/7
 */
export const feishuTheme: ITheme = {
  id: 'feishu',
  name: '飞书文档',
  description: '飞书风格排版，舒适协作',
  font: {
    family:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    titleSize: {
      h1: 26, // 姓名：稍大一些，更有存在感
      h2: 18, // 章节：飞书标准二级标题
      h3: 15, // 条目标题：比正文大一点，层次清晰
    },
    bodySize: {
      large: 15, // 副标题/职位
      normal: 14, // 正文：飞书标准字号
      small: 13, // 辅助信息：不要太小，保持可读性
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 600, // 飞书的粗体不会太重，保持柔和
    },
  },
  color: {
    primary: '#1f2329',
    text: {
      primary: '#1f2329', // 飞书主文字色
      secondary: '#646a73', // 飞书次要文字色
      tertiary: '#8f959e', // 飞书辅助文字色
      link: '#3370ff', // 飞书链接蓝
    },
    background: {
      page: '#ffffff', // 纯白背景，简洁清爽
      section: '#fafbfc', // 极浅的灰色，微妙区分区块
    },
    border: {
      light: '#f2f3f5', // 飞书浅边框
      normal: '#e5e6eb', // 飞书标准边框
      dark: '#c9cdd4', // 飞书深边框
    },
    accent: '#3370ff', // 飞书品牌色
  },
  spacing: {
    page: 50, // 舒适宽敞的页边距
    section: 20, // 章节间距：统一节奏
    item: 14, // 条目间距：清晰分隔
    paragraph: 10, // 段落间距
    line: 7, // 行间距
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 18,
    lineHeight: 1.75, // 飞书舒适行高，适合长文档阅读
  },
  style: {
    showSectionDivider: true,
    dividerStyle: 'solid',
    dividerThickness: 1,
    showPersonalInfoDivider: false,
    borderRadius: 4, // 飞书微圆角
    useEmojiIcons: false,
  },
}

/**
 * 7. 设计师风格（极致版）
 *
 * 设计哲学：极致的视觉体验
 * - 受包豪斯和瑞士设计风格影响
 * - 极致的字体层级对比（黄金比例 1:1.618）
 * - 精准的间距节奏系统（基于8px网格）
 * - 超大留白，营造呼吸感和专注力
 * - 极细线条和微妙的视觉引导
 * - 字间距和行高经过精心调校
 *
 * 关键参数：
 * - 正文 12.5px，行高 1.8（极致阅读体验）
 * - 页边距 62mm（黄金比例留白）
 * - 字号对比：h1=36px（震撼）, h2=18px（1:2比例）
 * - 极细分割线：0.5px + 上下留白
 * - 纯黑 #000 + 灰度层级分明
 * - 字间距微调：-0.02em ~ 0.05em
 */
export const designerTheme: ITheme = {
  id: 'designer',
  name: '设计师风格',
  description: '极致设计，完美阅读体验',
  font: {
    family:
      '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Arial", "PingFang SC", sans-serif',
    titleSize: {
      h1: 36, // 姓名：震撼的视觉冲击，黄金比例
      h2: 18, // 章节：精确的 1:2 比例
      h3: 14, // 条目：比正文略大，层次清晰
    },
    bodySize: {
      large: 14, // 职位等关键信息
      normal: 12.5, // 正文：最佳阅读字号
      small: 11.5, // 辅助信息：不会太小
    },
    weight: {
      light: 200, // 极细，用于装饰性文字
      normal: 300, // 细体，主要正文
      medium: 400, // 中等，强调内容
      semibold: 500, // 半粗，小标题
      bold: 600, // 粗体，标题专用（克制）
    },
  },
  color: {
    primary: '#000000',
    text: {
      primary: '#000000', // 纯黑，最高对比度
      secondary: '#2a2a2a', // 深灰，明确层级
      tertiary: '#969696', // 中灰，辅助信息
      link: '#000000',
    },
    background: {
      page: '#ffffff', // 纯白，极简
      section: '#ffffff', // 无装饰背景
    },
    border: {
      light: '#f8f8f8', // 极浅
      normal: '#e0e0e0', // 浅灰，清晰但不突兀
      dark: '#c8c8c8', // 中灰
    },
    accent: '#000000', // 纯黑强调
  },
  spacing: {
    page: 62, // 黄金比例页边距（基于 A4 宽度的 0.296）
    section: 32, // 8px网格 x 4，章节间强烈区隔
    item: 18, // 8px网格 x 2.25，条目清晰分隔
    paragraph: 14, // 8px网格 x 1.75，段落舒适间距
    line: 10, // 8px网格 x 1.25，行间呼吸感
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 28, // 宽松的栏间距
    lineHeight: 1.8, // 黄金比例行高，极致阅读体验
  },
  style: {
    showSectionDivider: true,
    dividerStyle: 'solid',
    dividerThickness: 0.5, // 极细线条，精致克制
    showPersonalInfoDivider: true, // 显示个人信息分割线
    borderRadius: 0, // 无圆角，锐利现代
    useEmojiIcons: false, // 无emoji，纯粹文字
  },
}

/**
 * 8. 破局尝试
 *
 * 设计哲学：突破传统，拥抱创新
 * - 打破传统简历的扁平呆板
 * - 卡片式设计，层次丰富立体
 * - 毛玻璃质感，现代时尚
 * - 柔和阴影，空间感强
 * - 适度圆角，友好亲和
 *
 * 关键参数：
 * - 正文 13px，行高 1.6（清晰流畅）
 * - 页边距 48mm（舒适）
 * - 背景：浅灰 #f5f7fa（衬托卡片）
 * - 卡片：白色 + 阴影 + 圆角 8px
 * - 现代蓝色 #1a73e8（活力点缀）
 * - 无分割线（卡片本身就是分隔）
 */
export const breakthroughTheme: ITheme = {
  id: 'breakthrough',
  name: '创意破局',
  description: '卡片设计，现代时尚',
  font: {
    family:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
    titleSize: {
      h1: 30, // 姓名：更大气醒目
      h2: 18, // 章节：更清晰有力
      h3: 14, // 条目：适中
    },
    bodySize: {
      large: 14, // 职位信息
      normal: 13, // 正文：清晰易读
      small: 12, // 辅助信息
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  color: {
    primary: '#0066ff', // 更鲜明的蓝色，更有活力
    text: {
      primary: '#1a1a1a', // 更深的黑色，增强对比度
      secondary: '#5a5a5a', // 中灰，清晰层次
      tertiary: '#999999', // 浅灰，辅助信息
      link: '#0066ff', // 蓝色链接
    },
    background: {
      page: '#ffffff', // 白色背景
      section: '#ffffff', // 纯白卡片，通过阴影营造立体感
    },
    border: {
      light: '#e5e9ee', // 淡蓝灰边框
      normal: '#d0d7de', // 标准边框
      dark: '#b8c1cc', // 深边框
    },
    accent: '#0066ff', // 蓝色强调
  },
  spacing: {
    page: 50, // 增加页边距，更舒适
    section: 18, // 卡片间距稍微紧凑，增强密度
    item: 14, // 条目间距
    paragraph: 12, // 增加段落间距
    line: 6, // 行间距
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 20,
    lineHeight: 1.65, // 稍微增加行高，提升可读性
  },
  style: {
    showSectionDivider: false, // 无分割线，卡片本身就是分隔
    dividerStyle: 'solid',
    dividerThickness: 0,
    showPersonalInfoDivider: false, // 无分割线
    borderRadius: 12, // 更大的圆角，更现代友好
    useEmojiIcons: false,
  },
}

/**
 * 所有预设主题（精选8个）
 *
 * 推荐优先级：
 * 1. 经典优雅 - 默认选择，平衡完美
 * 2. 极简呼吸 - 追求纯粹
 * 3. 紧凑专业 - 内容丰富
 * 4. 现代清新 - 互联网风
 * 5. 典雅书卷 - 传统优雅
 * 6. 飞书文档 - 协作友好
 * 7. 设计师风格 - 极简大气
 * 8. 破局尝试 - 卡片设计
 */
export const presetThemes: ITheme[] = [
  // classicTheme,
  // minimalTheme,
  modernTheme,
  feishuTheme,
  designerTheme,
  breakthroughTheme,
  compactTheme,
  elegantTheme,
]

/**
 * 根据ID获取主题
 */
export function getThemeById(id: string): ITheme | undefined {
  return presetThemes.find(t => t.id === id)
}
