/**
 * Toolbar 组件
 * 
 * 工具栏容器，用于放置操作按钮和工具
 */

import React from 'react'

export interface ToolbarProps {
  /** 工具栏内容 */
  children?: React.ReactNode
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right' | 'space-between'
  /** 工具栏大小 */
  size?: 'small' | 'medium' | 'large'
  /** 是否紧凑模式 */
  compact?: boolean
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

/**
 * Toolbar 组件
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  children,
  align = 'left',
  size = 'medium',
  compact = false,
  className = '',
  style,
}) => {
  const baseClass = 'lcedit-toolbar'
  const alignClass = `${baseClass}--align-${align}`
  const sizeClass = `${baseClass}--${size}`
  const compactClass = compact ? `${baseClass}--compact` : ''
  
  const classes = [
    baseClass,
    alignClass,
    sizeClass,
    compactClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')
  
  return (
    <div className={classes} style={style}>
      {children}
    </div>
  )
}

Toolbar.displayName = 'Toolbar'

/**
 * ToolbarGroup 组件 - 工具栏分组
 */
export interface ToolbarGroupProps {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({
  children,
  className = '',
  style,
}) => {
  const baseClass = 'lcedit-toolbar-group'
  const classes = [baseClass, className].filter(Boolean).join(' ')
  
  return (
    <div className={classes} style={style}>
      {children}
    </div>
  )
}

ToolbarGroup.displayName = 'ToolbarGroup'

/**
 * ToolbarDivider 组件 - 工具栏分隔符
 */
export interface ToolbarDividerProps {
  className?: string
  style?: React.CSSProperties
}

export const ToolbarDivider: React.FC<ToolbarDividerProps> = ({
  className = '',
  style,
}) => {
  const baseClass = 'lcedit-toolbar-divider'
  const classes = [baseClass, className].filter(Boolean).join(' ')
  
  return <div className={classes} style={style} />
}

ToolbarDivider.displayName = 'ToolbarDivider'

