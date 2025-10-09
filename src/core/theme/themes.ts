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
  description: '平衡、清晰、易读',
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
      primary: '#1a1a1a',
      secondary: '#4a4a4a',
      tertiary: '#888888',
      link: '#1a1a1a',
    },
    background: {
      page: '#ffffff',
      section: '#fafafa',
    },
    border: {
      light: '#f0f0f0',
      normal: '#e0e0e0',
      dark: '#d0d0d0',
    },
    accent: '#1a1a1a',
  },
  spacing: {
    page: 40,
    section: 18,
    item: 12,
    paragraph: 8,
    line: 5,
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
    showPersonalInfoDivider: true,
    borderRadius: 4,
    useEmojiIcons: true,
  },
}

/**
 * 紧凑专业主题
 */
export const compactTheme: ITheme = {
  id: 'compact',
  name: '紧凑专业',
  description: '紧凑布局，内容丰富',
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
      secondary: '#4a4a4a',
      tertiary: '#888888',
      link: '#1a1a1a',
    },
    background: {
      page: '#ffffff',
      section: '#f8f8f8',
    },
    border: {
      light: '#f0f0f0',
      normal: '#e0e0e0',
      dark: '#d0d0d0',
    },
    accent: '#1a1a1a',
  },
  spacing: {
    page: 32,
    section: 14,
    item: 10,
    paragraph: 6,
    line: 4,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 14,
    lineHeight: 1.5,
  },
  style: {
    showSectionDivider: true,
    dividerStyle: 'solid',
    dividerThickness: 1,
    showPersonalInfoDivider: true,
    borderRadius: 3,
    useEmojiIcons: false,
  },
}

/**
 * 舒适阅读主题
 */
export const comfortableTheme: ITheme = {
  id: 'comfortable',
  name: '舒适阅读',
  description: '宽松舒适，阅读友好',
  font: {
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    titleSize: {
      h1: 28,
      h2: 16,
      h3: 14,
    },
    bodySize: {
      large: 14,
      normal: 13,
      small: 12,
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
      secondary: '#4a4a4a',
      tertiary: '#888888',
      link: '#1a1a1a',
    },
    background: {
      page: '#ffffff',
      section: '#f8f8f8',
    },
    border: {
      light: '#f0f0f0',
      normal: '#e0e0e0',
      dark: '#d0d0d0',
    },
    accent: '#1a1a1a',
  },
  spacing: {
    page: 44,
    section: 22,
    item: 14,
    paragraph: 9,
    line: 6,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 18,
    lineHeight: 1.65,
  },
  style: {
    showSectionDivider: true,
    dividerStyle: 'solid',
    dividerThickness: 1,
    showPersonalInfoDivider: true,
    borderRadius: 4,
    useEmojiIcons: true,
  },
}

/**
 * 极简黑白主题
 */
export const minimalTheme: ITheme = {
  id: 'minimal',
  name: '极简黑白',
  description: '纯粹简洁，黑白极简',
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
      primary: '#000000',
      secondary: '#555555',
      tertiary: '#999999',
      link: '#000000',
    },
    background: {
      page: '#ffffff',
      section: '#ffffff',
    },
    border: {
      light: '#f5f5f5',
      normal: '#e8e8e8',
      dark: '#d0d0d0',
    },
    accent: '#000000',
  },
  spacing: {
    page: 32,
    section: 14,
    item: 10,
    paragraph: 6,
    line: 4,
  },
  layout: {
    pageWidth: 210,
    pageMinHeight: 297,
    columnGap: 14,
    lineHeight: 1.5,
  },
  style: {
    showSectionDivider: false,
    dividerStyle: 'solid',
    dividerThickness: 1,
    showPersonalInfoDivider: false,
    borderRadius: 0,
    useEmojiIcons: false,
  },
}

/**
 * 所有预设主题
 */
export const presetThemes: ITheme[] = [
  modernTheme,
  compactTheme,
  comfortableTheme,
  minimalTheme,
]

/**
 * 根据ID获取主题
 */
export function getThemeById(id: string): ITheme | undefined {
  return presetThemes.find(t => t.id === id)
}
