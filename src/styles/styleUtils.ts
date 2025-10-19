/**
 * 样式工具函数
 *
 * 提供统一的样式生成和组合工具
 */

import { designSystem as ds } from './designSystem'

/**
 * 组合多个 className
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * 生成 CSS 变量
 */
export function cssVar(name: string, value: string): string {
  return `--${name}: ${value};`
}

/**
 * 获取 CSS 变量值
 */
export function getCssVar(name: string): string {
  return `var(--${name})`
}

/**
 * 生成阴影样式
 */
export function boxShadow(elevation: keyof typeof ds.shadows): string {
  return ds.shadows[elevation]
}

/**
 * 生成间距样式
 */
export function spacing(...values: Array<keyof typeof ds.spacing>): string {
  return values.map(v => ds.spacing[v]).join(' ')
}

/**
 * 生成过渡效果
 */
export function transition(...properties: string[]): string {
  return properties
    .map(p => `${p} ${ds.animation.duration.normal} ${ds.animation.easing.smooth}`)
    .join(', ')
}

/**
 * 生成flex布局样式
 */
export const flex = {
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row' as const,
  },
  col: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  between: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  around: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  evenly: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
} as const

/**
 * 生成按钮基础样式
 */
export function buttonBase() {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    fontFamily: ds.typography.fontFamily.base,
    fontWeight: ds.typography.fontWeight.semibold,
    transition: transition('all'),
    userSelect: 'none' as const,
  }
}

/**
 * 生成输入框基础样式
 */
export function inputBase() {
  return {
    display: 'block',
    width: '100%',
    fontFamily: ds.typography.fontFamily.base,
    fontSize: ds.typography.fontSize.base,
    color: ds.colors.text.primary,
    backgroundColor: ds.colors.background.card,
    border: `1px solid ${ds.colors.border.base}`,
    borderRadius: ds.borderRadius.md,
    outline: 'none',
    transition: transition('border-color', 'box-shadow'),
  }
}

/**
 * 生成卡片基础样式
 */
export function cardBase() {
  return {
    backgroundColor: ds.colors.background.card,
    borderRadius: ds.borderRadius.lg,
    boxShadow: ds.shadows.sm,
    border: `1px solid ${ds.colors.border.light}`,
  }
}

/**
 * 生成面板基础样式
 */
export function panelBase() {
  return {
    backgroundColor: ds.colors.background.panel,
    borderRadius: ds.borderRadius.md,
    border: `1px solid ${ds.colors.border.base}`,
  }
}

/**
 * 生成遮罩层样式
 */
export function overlay(zIndex: number = ds.zIndex.modalBackdrop) {
  return {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex,
  }
}

/**
 * 生成居中容器样式
 */
export function centerContainer() {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  }
}

/**
 * 文本省略样式
 */
export const textEllipsis = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
}

/**
 * 多行文本省略样式
 */
export function textEllipsisMultiLine(lines: number = 2) {
  return {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as const,
    WebkitLineClamp: lines,
    textOverflow: 'ellipsis',
  }
}

/**
 * 清除浮动
 */
export const clearfix = {
  '::after': {
    content: '""',
    display: 'table',
    clear: 'both',
  },
}

/**
 * 隐藏滚动条
 */
export const hideScrollbar = {
  scrollbarWidth: 'none' as const,
  msOverflowStyle: 'none' as const,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}

/**
 * 绝对定位填充
 */
export const absoluteFill = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

/**
 * 固定定位填充
 */
export const fixedFill = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

/**
 * 响应式容器
 */
export function responsiveContainer(maxWidth: string = '1200px') {
  return {
    width: '100%',
    maxWidth,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: ds.spacing.lg,
    paddingRight: ds.spacing.lg,
  }
}

/**
 * 栅格容器
 */
export function grid(columns: number, gap: keyof typeof ds.spacing = 'md') {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: ds.spacing[gap],
  }
}

/**
 * 按钮样式变体生成器
 */
export const buttonVariants = {
  primary: (hover: boolean = false) => ({
    backgroundColor: hover ? ds.colors.primary.light : ds.colors.primary.base,
    color: ds.colors.text.inverse,
    border: 'none',
    boxShadow: hover ? ds.shadows.md : ds.shadows.sm,
  }),

  secondary: (hover: boolean = false) => ({
    backgroundColor: hover ? ds.colors.background.hover : ds.colors.background.card,
    color: ds.colors.text.primary,
    border: `1px solid ${hover ? ds.colors.border.dark : ds.colors.border.base}`,
    boxShadow: hover ? ds.shadows.sm : 'none',
  }),

  outline: (hover: boolean = false) => ({
    backgroundColor: hover ? ds.colors.background.hover : 'transparent',
    color: ds.colors.text.primary,
    border: `1px solid ${hover ? ds.colors.border.dark : ds.colors.border.base}`,
  }),

  ghost: (hover: boolean = false) => ({
    backgroundColor: hover ? ds.colors.background.hover : 'transparent',
    color: ds.colors.text.secondary,
    border: 'none',
  }),

  danger: (hover: boolean = false) => ({
    backgroundColor: hover ? '#dc2626' : ds.colors.semantic.error,
    color: ds.colors.text.inverse,
    border: 'none',
    boxShadow: hover ? '0 4px 12px rgba(239, 68, 68, 0.3)' : ds.shadows.sm,
  }),
}

/**
 * 按钮尺寸变体生成器
 */
export const buttonSizes = {
  sm: {
    height: ds.sizes.button.sm,
    padding: `0 ${ds.spacing.md}`,
    fontSize: ds.typography.fontSize.sm,
    gap: ds.spacing.xs,
  },
  md: {
    height: ds.sizes.button.md,
    padding: `0 ${ds.spacing.lg}`,
    fontSize: ds.typography.fontSize.base,
    gap: ds.spacing.sm,
  },
  lg: {
    height: ds.sizes.button.lg,
    padding: `0 ${ds.spacing.xl}`,
    fontSize: ds.typography.fontSize.md,
    gap: ds.spacing.sm,
  },
}

/**
 * 加载旋转器尺寸
 */
export const spinnerSizes = {
  sm: { width: 20, height: 20, border: 2 },
  md: { width: 32, height: 32, border: 3 },
  lg: { width: 48, height: 48, border: 4 },
}
