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
 * 核心特点：
 * ✓ 姓名 28px + 粗体 - 第一印象强烈
 * ✓ 章节 15px + 粗体 - 快速定位
 * ✓ 职位/公司 13px - 关键信息突出
 * ✓ 正文 11px - 信息密度高
 * ✓ 纯黑文字 - 最强对比度
 * ✓ 页边距 40mm - 内容空间最大化
 *
 * 适合：90%的求职场景，通用标准
 */
export const classicTheme: ITheme = {
  id: 'classic',
  name: '经典优雅',
  description: '平衡标准，信息层次清晰',
  font: {
    family:
      '"Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif',
    titleSize: {
      h1: 28, // 姓名：必须大！第一视觉焦点
      h2: 15, // 章节标题：【工作经历】【教育背景】粗体大号
      h3: 13, // 职位/公司名：【高级工程师】【阿里巴巴】必须突出
    },
    bodySize: {
      large: 12, // 部门/项目名称
      normal: 10.5, // 正文描述：职责、成果等，稍小提高密度
      small: 9, // 日期、地点：明显更小，不干扰主要信息
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700, // 姓名、章节标题用粗体
    },
  },
  color: {
    primary: '#000000', // 纯黑，最强对比
    text: {
      primary: '#000000', // 关键信息用纯黑
      secondary: '#333333', // 次要信息
      tertiary: '#666666', // 辅助信息（日期、地点）
      link: '#000000',
    },
    background: {
      page: '#ffffff',
      section: '#fafafa', // 极浅灰，微妙区分章节
    },
    border: {
      light: '#e0e0e0',
      normal: '#cccccc',
      dark: '#999999',
    },
    accent: '#000000',
  },
  spacing: {
    page: 38, // 优化边距，最大化内容空间
    section: 20, // 章节间距大！快速区分【工作】【教育】
    item: 12, // 每个工作经历之间清晰分隔
    paragraph: 6, // 段落间距
    line: 3, // 行间距紧凑
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 14,
    lineHeight: 1.5, // 黄金行高
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
 * 核心特点：
 * ✓ 姓名 36px + 粗体 - 视觉震撼
 * ✓ 章节 14px - 小标题，对比极致
 * ✓ 正文 10px - 小字体+大留白
 * ✓ 无分割线 - 用间距建立层次
 * ✓ 页边距 50mm - 大胆留白
 * ✓ 行高 1.7 - 呼吸感
 *
 * 适合：设计师、内容少但要精致的简历
 */
export const minimalTheme: ITheme = {
  id: 'minimal',
  name: '极简呼吸',
  description: '超大姓名+极简内容，设计感强',
  font: {
    family:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "Hiragino Sans GB", sans-serif',
    titleSize: {
      h1: 36, // 姓名：超大！视觉震撼
      h2: 14, // 章节：小标题，对比极致
      h3: 12, // 职位/公司：中等，突出
    },
    bodySize: {
      large: 11, // 副标题
      normal: 10, // 正文：小字体+大留白=极简
      small: 9, // 辅助信息
    },
    weight: {
      light: 200, // 极细
      normal: 300, // 细体，极简风格
      medium: 400,
      semibold: 600,
      bold: 700, // 姓名、章节用粗体，对比强烈
    },
  },
  color: {
    primary: '#000000',
    text: {
      primary: '#000000', // 纯黑
      secondary: '#1a1a1a',
      tertiary: '#888888', // 灰色，拉开层次
      link: '#000000',
    },
    background: {
      page: '#ffffff',
      section: '#ffffff', // 纯白
    },
    border: {
      light: '#f0f0f0',
      normal: '#e0e0e0',
      dark: '#d0d0d0',
    },
    accent: '#000000',
  },
  spacing: {
    page: 50, // 大留白
    section: 24, // 大章节间距
    item: 15, // 大条目间距
    paragraph: 10,
    line: 6,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 20,
    lineHeight: 1.7, // 舒展
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
 * 核心特点：
 * ✓ 姓名 24px - 即使紧凑也醒目
 * ✓ 章节 14px + 粗体 - 快速定位
 * ✓ 职位/公司 12px - 突出关键信息
 * ✓ 正文 10px - 信息密度最高
 * ✓ 页边距 35mm - 最大化内容空间
 * ✓ 行高 1.4 - 紧凑高效
 *
 * 适合：工作经验丰富、内容多的简历
 */
export const compactTheme: ITheme = {
  id: 'compact',
  name: '紧凑专业',
  description: '信息密度最高，适合经验丰富者',
  font: {
    family:
      'Arial, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    titleSize: {
      h1: 24, // 姓名：即使紧凑也要醒目
      h2: 14, // 章节：粗体，快速定位
      h3: 12, // 职位/公司：必须突出，比正文大2号
    },
    bodySize: {
      large: 11, // 副标题
      normal: 10, // 正文：小但清晰
      small: 9, // 辅助信息
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700, // 关键信息用粗体
    },
  },
  color: {
    primary: '#000000',
    text: {
      primary: '#000000', // 小字号需要更强对比
      secondary: '#2a2a2a',
      tertiary: '#666666',
      link: '#000000',
    },
    background: {
      page: '#ffffff',
      section: '#f9f9f9', // 区分章节
    },
    border: {
      light: '#e8e8e8',
      normal: '#d0d0d0',
      dark: '#b0b0b0',
    },
    accent: '#000000',
  },
  spacing: {
    page: 32, // 极小边距！最大化内容空间
    section: 16, // 章节仍要清晰区分
    item: 10, // 工作经历之间的间距
    paragraph: 5,
    line: 2,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 12,
    lineHeight: 1.42, // 紧凑但不拥挤
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
 * 核心特点：
 * ✓ 姓名 30px - 大气现代
 * ✓ 章节 16px + 粗线条(3px) - 章节极清晰
 * ✓ 职位/公司 13px - 重点突出
 * ✓ 正文 11px - 标准密度
 * ✓ 粗分割线 - 视觉引导强
 * ✓ Roboto 字体 - 现代几何美感
 *
 * 适合：互联网、科技公司
 */
export const modernTheme: ITheme = {
  id: 'modern',
  name: '现代清新',
  description: '粗线条分割，章节一目了然',
  font: {
    family:
      'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    titleSize: {
      h1: 30, // 姓名：现代大气
      h2: 16, // 章节：大+粗体+粗线条，视觉引导极强
      h3: 13, // 职位/公司：清晰突出
    },
    bodySize: {
      large: 12, // 部门/项目
      normal: 10.5, // 正文：适中
      small: 9.5, // 日期：小号
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700, // 标题粗体
    },
  },
  color: {
    primary: '#000000',
    text: {
      primary: '#000000',
      secondary: '#333333',
      tertiary: '#777777',
      link: '#000000',
    },
    background: {
      page: '#ffffff',
      section: '#fafafa', // 浅灰区分
    },
    border: {
      light: '#e5e5e5',
      normal: '#cccccc',
      dark: '#999999',
    },
    accent: '#000000',
  },
  spacing: {
    page: 40,
    section: 22, // 大章节间距配合粗线条
    item: 13, // 清晰分隔
    paragraph: 7,
    line: 4,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 15,
    lineHeight: 1.52,
  },
  style: {
    showSectionDivider: true,
    dividerStyle: 'solid',
    dividerThickness: 3, // 粗分割线！核心特色
    showPersonalInfoDivider: false,
    borderRadius: 0,
    useEmojiIcons: false,
  },
}

/**
 * 5. 典雅书卷
 *
 * 核心特点：
 * ✓ 姓名 26px - 优雅大方
 * ✓ Georgia 衬线字体 - 传统书卷气息
 * ✓ 双分割线 - 传统风格标志
 * ✓ 章节/职位清晰 - 层级分明
 * ✓ 行高 1.6 - 衬线字体最佳
 * ✓ 页边距 45mm - 传统舒适
 *
 * 适合：学术、法律、出版、传统行业
 */
export const elegantTheme: ITheme = {
  id: 'elegant',
  name: '典雅书卷',
  description: '衬线字体，适合学术/法律/出版',
  font: {
    family:
      'Georgia, "Times New Roman", "Palatino Linotype", "STSong", "Songti SC", "SimSun", serif',
    titleSize: {
      h1: 28, // 姓名：衬线也要醒目
      h2: 15, // 章节：传统风格
      h3: 13, // 职位/公司：突出
    },
    bodySize: {
      large: 12, // 部门/项目
      normal: 10.5, // 正文：衬线字体可稍小
      small: 9.5, // 日期地点
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700, // 标题粗体
    },
  },
  color: {
    primary: '#000000',
    text: {
      primary: '#000000',
      secondary: '#2a2a2a',
      tertiary: '#666666',
      link: '#000000',
    },
    background: {
      page: '#ffffff',
      section: '#f9f9f9', // 微妙区分
    },
    border: {
      light: '#e8e8e8',
      normal: '#d0d0d0',
      dark: '#b0b0b0',
    },
    accent: '#000000',
  },
  spacing: {
    page: 42, // 传统舒适
    section: 19, // 章节分明
    item: 12, // 条目清晰
    paragraph: 7,
    line: 4,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 16,
    lineHeight: 1.58, // 衬线字体舒适行高
  },
  style: {
    showSectionDivider: true,
    dividerStyle: 'solid',
    dividerThickness: 1,
    showPersonalInfoDivider: true, // 双分割线！传统特色
    borderRadius: 0,
    useEmojiIcons: false,
  },
}

/**
 * 6. 飞书文档
 *
 * 核心特点：
 * ✓ 姓名 32px - 大气
 * ✓ 章节 16px - 清晰
 * ✓ 正文 12px - 大字号！舒适阅读
 * ✓ 行高 1.6 - 舒展不拥挤
 * ✓ 间距大 - section 22mm, item 15mm
 * ✓ Segoe UI 字体 - 现代清晰
 *
 * 适合：长内容、需要舒适阅读的简历
 */
export const feishuTheme: ITheme = {
  id: 'feishu',
  name: '飞书文档',
  description: '飞书风格，大字号舒适阅读',
  font: {
    family:
      '"Segoe UI", -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
    titleSize: {
      h1: 32, // 姓名：飞书大气风格
      h2: 16, // 章节：大标题
      h3: 14, // 职位/公司：突出
    },
    bodySize: {
      large: 13, // 部门/项目
      normal: 12, // 正文：大字号！舒适阅读
      small: 11, // 日期：也不能太小
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
    primary: '#000000',
    text: {
      primary: '#000000',
      secondary: '#404040',
      tertiary: '#777777',
      link: '#000000',
    },
    background: {
      page: '#ffffff',
      section: '#f8f8f8',
    },
    border: {
      light: '#e8e8e8',
      normal: '#d0d0d0',
      dark: '#b0b0b0',
    },
    accent: '#000000',
  },
  spacing: {
    page: 42,
    section: 22, // 大间距，舒适分组
    item: 15, // 清晰分隔每个经历
    paragraph: 8,
    line: 5,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 16,
    lineHeight: 1.6, // 大字号+舒适行高
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
 * 7. 设计师风格（极致版）
 *
 * 核心特点：
 * ✓ 姓名 42px + 细体 - 超大震撼！
 * ✓ 章节 16px - 小标题，对比极端
 * ✓ 正文 10px + 细体 - 精致
 * ✓ 极细分割线 0.5px - 精致克制
 * ✓ 双分割线 - 层次丰富
 * ✓ 页边距 55mm - 大留白
 * ✓ 行高 1.75 - 舒展阅读
 *
 * 适合：设计/艺术行业，追求极致视觉
 */
export const designerTheme: ITheme = {
  id: 'designer',
  name: '设计师风格',
  description: '极致留白和对比，设计师专属',
  font: {
    family:
      '"Helvetica Neue", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "Hiragino Sans GB", Arial, sans-serif',
    titleSize: {
      h1: 42, // 姓名：超大！视觉震撼
      h2: 16, // 章节：精致，对比强烈
      h3: 12, // 条目：精致小巧
    },
    bodySize: {
      large: 12, // 职位
      normal: 10, // 正文：小字体+大留白=设计感
      small: 9, // 辅助信息：极致精致
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
      primary: '#000000', // 纯黑
      secondary: '#1a1a1a',
      tertiary: '#888888',
      link: '#000000',
    },
    background: {
      page: '#ffffff',
      section: '#ffffff', // 纯白
    },
    border: {
      light: '#f0f0f0',
      normal: '#e0e0e0',
      dark: '#d0d0d0',
    },
    accent: '#000000',
  },
  spacing: {
    page: 55, // 大留白
    section: 26, // 大间距
    item: 16,
    paragraph: 11,
    line: 7,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 22,
    lineHeight: 1.75, // 舒展
  },
  style: {
    showSectionDivider: true,
    dividerStyle: 'solid',
    dividerThickness: 0.5, // 极细线条！特色
    showPersonalInfoDivider: true, // 双分割线
    borderRadius: 0,
    useEmojiIcons: false,
  },
}

/**
 * 8. 创意破局
 *
 * 核心特点：
 * ✓ 姓名 32px - 醒目
 * ✓ 圆角 12px - 卡片式设计！
 * ✓ 无分割线 - 卡片本身分隔
 * ✓ 浅灰背景 - 衬托白色内容
 * ✓ Roboto 字体 - 现代
 * ✓ 职位/公司突出 - 关键信息明确
 *
 * 适合：创意、设计、新媒体行业
 */
export const breakthroughTheme: ITheme = {
  id: 'breakthrough',
  name: '创意破局',
  description: '圆角卡片，内容分组明确',
  font: {
    family:
      'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    titleSize: {
      h1: 30, // 姓名：现代大气
      h2: 15, // 章节：清晰
      h3: 13, // 职位/公司：突出
    },
    bodySize: {
      large: 12, // 部门/项目
      normal: 10.5, // 正文
      small: 9.5, // 日期
    },
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700, // 标题粗体
    },
  },
  color: {
    primary: '#000000',
    text: {
      primary: '#000000',
      secondary: '#333333',
      tertiary: '#777777',
      link: '#000000',
    },
    background: {
      page: '#f5f5f5', // 浅灰背景衬托白色卡片
      section: '#ffffff', // 白色卡片
    },
    border: {
      light: '#e0e0e0',
      normal: '#d0d0d0',
      dark: '#b0b0b0',
    },
    accent: '#000000',
  },
  spacing: {
    page: 40,
    section: 18, // 卡片间距
    item: 13, // 清晰分隔
    paragraph: 7,
    line: 4,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 15,
    lineHeight: 1.52,
  },
  style: {
    showSectionDivider: false, // 无分割线，卡片本身是分隔
    dividerStyle: 'solid',
    dividerThickness: 0,
    showPersonalInfoDivider: false,
    borderRadius: 8, // 圆角！适度不过分
    useEmojiIcons: false,
  },
}

/**
 * 所有预设主题（精选8个）
 *
 * 核心差异化特征：
 *
 * 1. 经典优雅 ⭐ - 姓名28px，职位13px，正文10.5px，边距38mm，层次清晰
 * 2. 极简呼吸 - 姓名36px！小正文10px，无分割线，大留白50mm，对比震撼
 * 3. 现代清新 - 粗分割线3px！姓名30px，章节16px，视觉引导强
 * 4. 飞书文档 - 大字号！正文12px，姓名32px，间距舒适22mm，适合长内容
 * 5. 设计师风格 - 超大姓名42px！极细线0.5px，双分割线，留白60mm，极致设计
 * 6. 创意破局 - 圆角8px，卡片式，无分割线，姓名30px，现代时尚
 * 7. 紧凑专业 - 最小边距32mm！正文9.5px，信息密度极高
 * 8. 典雅书卷 - 衬线字体！双分割线，姓名28px，传统优雅
 *
 * 快速选择：
 * - 通用标准 → 经典优雅 ⭐
 * - 内容超多 → 紧凑专业
 * - 内容少/设计师 → 极简呼吸 或 设计师风格
 * - 互联网/科技 → 现代清新 或 飞书文档
 * - 学术/法律/传统 → 典雅书卷
 * - 创意/设计 → 创意破局
 */
export const presetThemes: ITheme[] = [
  classicTheme,
  minimalTheme,
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
