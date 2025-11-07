/**
 * Button 组件
 * 
 * 基础按钮组件，支持多种样式和状态
 */

import React from 'react'

export interface ButtonProps {
  /** 按钮内容 */
  children?: React.ReactNode
  /** 按钮类型 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large'
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 图标 */
  icon?: React.ReactNode
  /** 点击事件 */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset'
}

/**
 * Button 组件
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  onClick,
  className = '',
  style,
  type = 'button',
}) => {
  const baseClass = 'lcedit-button'
  const variantClass = `${baseClass}--${variant}`
  const sizeClass = `${baseClass}--${size}`
  const disabledClass = disabled || loading ? `${baseClass}--disabled` : ''
  const loadingClass = loading ? `${baseClass}--loading` : ''
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    disabledClass,
    loadingClass,
    className,
  ]
    .filter(Boolean)
    .join(' ')
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }
  
  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading && <span className={`${baseClass}__spinner`}>⏳</span>}
      {icon && <span className={`${baseClass}__icon`}>{icon}</span>}
      {children && <span className={`${baseClass}__text`}>{children}</span>}
    </button>
  )
}

Button.displayName = 'Button'

