/**
 * CVKit 设计系统
 * 
 * 统一的设计规范和样式变量
 */

export const designSystem = {
  // 颜色系统
  colors: {
    // 主色调
    primary: {
      base: '#2d2d2d',
      light: '#3d3d3d',
      lighter: '#4d4d4d',
      dark: '#1d1d1d',
    },
    // 强调色
    accent: {
      blue: '#3b82f6',
      blueLight: '#60a5fa',
      blueDark: '#2563eb',
      green: '#10b981',
      red: '#ef4444',
      orange: '#f59e0b',
      purple: '#8b5cf6',
    },
    // 中性色
    neutral: {
      white: '#ffffff',
      gray50: '#fafafa',
      gray100: '#f5f5f5',
      gray200: '#e8e8e8',
      gray300: '#d0d0d0',
      gray400: '#999999',
      gray500: '#666666',
      gray600: '#555555',
      gray700: '#444444',
      gray800: '#333333',
      gray900: '#2d2d2d',
      black: '#000000',
    },
    // 语义化颜色
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    // 背景色
    background: {
      page: '#fafafa',
      card: '#ffffff',
      panel: '#ffffff',
      hover: '#f8f9fa',
      active: '#f0f0f0',
      disabled: '#f5f5f5',
    },
    // 边框色
    border: {
      light: '#f1f1f1',
      base: '#e8e8e8',
      dark: '#d0d0d0',
      focus: '#3b82f6',
    },
    // 文字色
    text: {
      primary: '#2d2d2d',
      secondary: '#666666',
      tertiary: '#999999',
      disabled: '#cccccc',
      inverse: '#ffffff',
    },
  },

  // 间距系统（8px 基准）
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
    xxxxl: '40px',
  },

  // 圆角系统
  borderRadius: {
    xs: '3px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '10px',
    xxl: '12px',
    round: '50%',
    pill: '999px',
  },

  // 阴影系统
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.20)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    // 特殊阴影
    selected: '0 0 0 3px #3b82f6, 0 0 0 6px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(59, 130, 246, 0.2)',
    hovered: '0 0 0 2px #94a3b8, 0 0 0 4px rgba(148, 163, 184, 0.1)',
    floating: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
  },

  // 字体系统
  typography: {
    // 字体家族
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'Monaco, Consolas, "Courier New", monospace',
    },
    // 字体大小
    fontSize: {
      xs: '11px',
      sm: '12px',
      base: '13px',
      md: '14px',
      lg: '15px',
      xl: '16px',
      xxl: '18px',
      xxxl: '20px',
      xxxxl: '24px',
      huge: '28px',
    },
    // 字重
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    // 行高
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.8,
    },
  },

  // 动画系统
  animation: {
    // 时长
    duration: {
      fast: '0.1s',
      normal: '0.15s',
      slow: '0.2s',
      slower: '0.3s',
    },
    // 缓动函数
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    // 过渡
    transition: {
      fast: 'all 0.1s ease',
      normal: 'all 0.15s ease',
      slow: 'all 0.2s ease',
      smooth: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Z-index 层级
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 10000,
    contextMenu: 10001,
    dragPreview: 10002,
  },

  // 组件尺寸
  sizes: {
    // 输入框高度
    input: {
      sm: '28px',
      md: '32px',
      lg: '36px',
      xl: '40px',
    },
    // 按钮高度
    button: {
      sm: '28px',
      md: '32px',
      lg: '36px',
      xl: '40px',
    },
    // 图标大小
    icon: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
  },
} as const

// 导出类型
export type DesignSystem = typeof designSystem

// 实用工具函数
export const ds = designSystem

// 快捷样式生成器
export const createBoxShadow = (elevation: keyof typeof designSystem.shadows) => ({
  boxShadow: designSystem.shadows[elevation],
})

export const createSpacing = (...values: Array<keyof typeof designSystem.spacing>) => {
  return values.map(v => designSystem.spacing[v]).join(' ')
}

export const createTransition = (
  ...properties: string[]
) => {
  return properties
    .map(p => `${p} ${designSystem.animation.duration.normal} ${designSystem.animation.easing.smooth}`)
    .join(', ')
}

