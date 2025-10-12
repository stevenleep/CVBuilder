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
      h1: 32, // 姓名：足够大但不夸张
      h2: 16, // 章节标题：清晰醒目
      h3: 13.5, // 条目标题：适度突出
    },
    bodySize: {
      large: 14, // 职位/副标题
      normal: 12, // 正文：黄金大小
      small: 11, // 辅助信息
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
      h1: 40, // 姓名：大而自信
      h2: 14, // 章节：小巧精致
      h3: 12.5, // 条目：低调
    },
    bodySize: {
      large: 14,
      normal: 12.5, // 正文：易读
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
      h1: 28, // 姓名：适度
      h2: 14.5, // 章节
      h3: 12.5, // 条目
    },
    bodySize: {
      large: 13,
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
      h1: 36, // 姓名：现代感
      h2: 15, // 章节
      h3: 13, // 条目
    },
    bodySize: {
      large: 14.5,
      normal: 13, // 正文：大字号，易读
      small: 11.5,
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
      h1: 34, // 姓名：优雅大气
      h2: 16, // 章节：衬线稍大
      h3: 13.5, // 条目
    },
    bodySize: {
      large: 14.5,
      normal: 13, // 正文：衬线需要更大
      small: 11.5,
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
 * 所有预设主题（精选5个）
 *
 * 推荐优先级：
 * 1. 经典优雅 - 默认选择，平衡完美
 * 2. 极简呼吸 - 追求纯粹
 * 3. 紧凑专业 - 内容丰富
 * 4. 现代清新 - 互联网风
 * 5. 典雅书卷 - 传统优雅
 */
export const presetThemes: ITheme[] = [
  classicTheme,
  minimalTheme,
  compactTheme,
  modernTheme,
  elegantTheme,
]

/**
 * 根据ID获取主题
 */
export function getThemeById(id: string): ITheme | undefined {
  return presetThemes.find(t => t.id === id)
}
