/**
 * 预设主题配置（阅读体验优化版）
 */

import { ITheme } from '../protocols/IThemeProtocol'

/**
 * 现代简约主题 - 最佳阅读体验
 */
export const modernTheme: ITheme = {
  id: 'modern',
  name: '现代简约',
  description: '平衡清晰，适合所有场景',
  font: {
    family:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    titleSize: {
      h1: 24,
      h2: 14,
      h3: 12,
    },
    bodySize: {
      large: 12,
      normal: 11,
      small: 10,
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
    primary: '#000000',
    text: {
      primary: '#2d2d2d',
      secondary: '#555555',
      tertiary: '#999999',
      link: '#2d2d2d',
    },
    background: {
      page: '#ffffff',
      section: '#ffffff',
    },
    border: {
      light: '#f5f5f5',
      normal: '#e0e0e0',
      dark: '#cccccc',
    },
    accent: '#2d2d2d',
  },
  spacing: {
    page: 40,
    section: 16,
    item: 10,
    paragraph: 6,
    line: 4,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 16,
    lineHeight: 1.6,
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
 * 紧凑专业主题
 */
export const compactTheme: ITheme = {
  id: 'compact',
  name: '紧凑专业',
  description: '节省空间，内容丰富',
  font: {
    family:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    titleSize: {
      h1: 22,
      h2: 13,
      h3: 11,
    },
    bodySize: {
      large: 11,
      normal: 10,
      small: 9,
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
    primary: '#000000',
    text: {
      primary: '#2d2d2d',
      secondary: '#555555',
      tertiary: '#999999',
      link: '#2d2d2d',
    },
    background: {
      page: '#ffffff',
      section: '#ffffff',
    },
    border: {
      light: '#f5f5f5',
      normal: '#e0e0e0',
      dark: '#cccccc',
    },
    accent: '#2d2d2d',
  },
  spacing: {
    page: 30,
    section: 12,
    item: 8,
    paragraph: 5,
    line: 3,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 12,
    lineHeight: 1.5,
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
 * 舒适阅读主题
 */
export const comfortableTheme: ITheme = {
  id: 'comfortable',
  name: '舒适阅读',
  description: '宽松舒适，护眼友好',
  font: {
    family:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    titleSize: {
      h1: 26,
      h2: 15,
      h3: 13,
    },
    bodySize: {
      large: 13,
      normal: 12,
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
    primary: '#000000',
    text: {
      primary: '#2d2d2d',
      secondary: '#555555',
      tertiary: '#999999',
      link: '#2d2d2d',
    },
    background: {
      page: '#ffffff',
      section: '#ffffff',
    },
    border: {
      light: '#f5f5f5',
      normal: '#e0e0e0',
      dark: '#cccccc',
    },
    accent: '#2d2d2d',
  },
  spacing: {
    page: 45,
    section: 20,
    item: 13,
    paragraph: 8,
    line: 5,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 18,
    lineHeight: 1.7,
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
 * 极简黑白主题
 */
export const minimalTheme: ITheme = {
  id: 'minimal',
  name: '极简黑白',
  description: '纯粹简洁，一目了然',
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleSize: {
      h1: 24,
      h2: 14,
      h3: 12,
    },
    bodySize: {
      large: 12,
      normal: 11,
      small: 10,
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
    primary: '#000000',
    text: {
      primary: '#1a1a1a',
      secondary: '#4d4d4d',
      tertiary: '#999999',
      link: '#1a1a1a',
    },
    background: {
      page: '#ffffff',
      section: '#ffffff',
    },
    border: {
      light: '#f5f5f5',
      normal: '#e0e0e0',
      dark: '#cccccc',
    },
    accent: '#1a1a1a',
  },
  spacing: {
    page: 38,
    section: 15,
    item: 10,
    paragraph: 6,
    line: 4,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 14,
    lineHeight: 1.55,
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
 * 优雅衬线主题 - 适合传统行业
 */
export const elegantTheme: ITheme = {
  id: 'elegant',
  name: '优雅衬线',
  description: '经典优雅，适合传统行业',
  font: {
    family: 'Georgia, "Times New Roman", "STSong", serif',
    titleSize: {
      h1: 26,
      h2: 15,
      h3: 13,
    },
    bodySize: {
      large: 13,
      normal: 12,
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
    primary: '#2d2d2d',
    text: {
      primary: '#2d2d2d',
      secondary: '#555555',
      tertiary: '#999999',
      link: '#2d2d2d',
    },
    background: {
      page: '#ffffff',
      section: '#ffffff',
    },
    border: {
      light: '#f5f5f5',
      normal: '#e0e0e0',
      dark: '#cccccc',
    },
    accent: '#2d2d2d',
  },
  spacing: {
    page: 42,
    section: 18,
    item: 12,
    paragraph: 7,
    line: 5,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 16,
    lineHeight: 1.65,
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
 * 简洁商务主题 - 商务场景
 */
export const businessTheme: ITheme = {
  id: 'business',
  name: '简洁商务',
  description: '专业正式，适合所有企业',
  font: {
    family: 'Arial, "Helvetica Neue", "Microsoft YaHei", sans-serif',
    titleSize: {
      h1: 24,
      h2: 14,
      h3: 12,
    },
    bodySize: {
      large: 12,
      normal: 11,
      small: 10,
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
    primary: '#2d2d2d',
    text: {
      primary: '#2d2d2d',
      secondary: '#555555',
      tertiary: '#999999',
      link: '#2d2d2d',
    },
    background: {
      page: '#ffffff',
      section: '#ffffff',
    },
    border: {
      light: '#f5f5f5',
      normal: '#e0e0e0',
      dark: '#cccccc',
    },
    accent: '#2d2d2d',
  },
  spacing: {
    page: 40,
    section: 16,
    item: 11,
    paragraph: 7,
    line: 4,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 15,
    lineHeight: 1.6,
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
 * 柔和护眼主题 - 长时间阅读
 */
export const softBeigeTheme: ITheme = {
  id: 'soft-beige',
  name: '柔和护眼',
  description: '温和柔和，长时间阅读不累',
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleSize: {
      h1: 24,
      h2: 14,
      h3: 12,
    },
    bodySize: {
      large: 12,
      normal: 11,
      small: 10,
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
    primary: '#4d4d4d',
    text: {
      primary: '#3d3d3d',
      secondary: '#666666',
      tertiary: '#999999',
      link: '#3d3d3d',
    },
    background: {
      page: '#fafaf8',
      section: '#fafaf8',
    },
    border: {
      light: '#eeeeec',
      normal: '#ddddda',
      dark: '#ccccca',
    },
    accent: '#4d4d4d',
  },
  spacing: {
    page: 42,
    section: 18,
    item: 11,
    paragraph: 7,
    line: 5,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 16,
    lineHeight: 1.65,
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
 * 所有预设主题 - 按推荐顺序排列
 */
export const presetThemes: ITheme[] = [
  modernTheme, // 1. 现代简约 - 默认推荐
  comfortableTheme, // 2. 舒适阅读 - 宽松舒适
  businessTheme, // 3. 简洁商务 - 商务正式
  elegantTheme, // 4. 优雅衬线 - 传统行业
  compactTheme, // 5. 紧凑专业 - 节省空间
  minimalTheme, // 6. 极简黑白 - 极简风格
  softBeigeTheme, // 7. 柔和护眼 - 长时间阅读
]

/**
 * 根据ID获取主题
 */
export function getThemeById(id: string): ITheme | undefined {
  return presetThemes.find(t => t.id === id)
}
