/**
 * 主题协议
 * 
 * 定义简历的全局样式主题系统
 */

/**
 * 字体配置
 */
export interface IFontConfig {
  /** 字体族 */
  family: string
  /** 标题字体大小 */
  titleSize: {
    h1: number  // 主标题（姓名）
    h2: number  // 二级标题（章节）
    h3: number  // 三级标题（公司名等）
  }
  /** 正文字体大小 */
  bodySize: {
    large: number   // 大号正文
    normal: number  // 标准正文
    small: number   // 小号正文
  }
  /** 字重 */
  weight: {
    light: number
    normal: number
    medium: number
    semibold: number
    bold: number
  }
}

/**
 * 颜色配置
 */
export interface IColorConfig {
  /** 主色 */
  primary: string
  /** 文字颜色 */
  text: {
    primary: string    // 主要文字（黑色）
    secondary: string  // 次要文字（灰色）
    tertiary: string   // 三级文字（浅灰）
    link: string       // 链接颜色
  }
  /** 背景颜色 */
  background: {
    page: string       // 页面背景
    section: string    // 区块背景
  }
  /** 边框颜色 */
  border: {
    light: string      // 浅色边框
    normal: string     // 标准边框
    dark: string       // 深色边框
  }
  /** 强调色 */
  accent: string
}

/**
 * 间距配置
 */
export interface ISpacingConfig {
  /** 页面内边距 */
  page: number
  /** 章节间距 */
  section: number
  /** 条目间距 */
  item: number
  /** 段落间距 */
  paragraph: number
  /** 行间距 */
  line: number
}

/**
 * 布局配置
 */
export interface ILayoutConfig {
  /** 页面宽度（mm） */
  pageWidth: number
  /** 页面最小高度（mm） */
  pageMinHeight: number
  /** 列间距 */
  columnGap: number
  /** 行间距倍数 */
  lineHeight: number
}

/**
 * 样式配置
 */
export interface IStyleConfig {
  /** 是否显示章节分隔线 */
  showSectionDivider: boolean
  /** 分隔线样式 */
  dividerStyle: 'solid' | 'dashed' | 'dotted'
  /** 分隔线粗细 */
  dividerThickness: number
  /** 是否显示个人信息底部分隔线 */
  showPersonalInfoDivider: boolean
  /** 圆角大小 */
  borderRadius: number
  /** 是否使用emoji图标 */
  useEmojiIcons: boolean
}

/**
 * 完整主题配置
 */
export interface ITheme {
  /** 主题ID */
  id: string
  /** 主题名称 */
  name: string
  /** 主题描述 */
  description?: string
  /** 字体配置 */
  font: IFontConfig
  /** 颜色配置 */
  color: IColorConfig
  /** 间距配置 */
  spacing: ISpacingConfig
  /** 布局配置 */
  layout: ILayoutConfig
  /** 样式配置 */
  style: IStyleConfig
}

/**
 * 主题上下文值
 */
export interface IThemeContext {
  /** 当前主题 */
  theme: ITheme
  /** 切换主题 */
  setTheme: (theme: ITheme) => void
  /** 更新主题配置 */
  updateTheme: (config: Partial<ITheme>) => void
}

/**
 * 预设主题
 */
export const PresetThemes = {
  /** 现代简约 */
  MODERN: 'modern',
  /** 经典专业 */
  CLASSIC: 'classic',
  /** 创意活力 */
  CREATIVE: 'creative',
  /** 极简主义 */
  MINIMAL: 'minimal',
} as const

export type PresetThemeType = typeof PresetThemes[keyof typeof PresetThemes]

