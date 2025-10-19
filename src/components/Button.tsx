/**
 * 统一按钮组件 - 专业设计系统
 */

import React from 'react'
import { classNames } from '@/styles/styleUtils'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  style?: React.CSSProperties
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  className,
  type = 'button',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) return
    onClick?.(e)
  }

  const buttonClasses = classNames(
    'cvkit-button',
    `cvkit-button-${variant}`,
    `cvkit-button-${size}`,
    fullWidth && 'cvkit-button-fullwidth',
    loading && 'cvkit-button-loading',
    className
  )

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={buttonClasses}
      style={style}
    >
      {loading && <div className="cvkit-button-spinner" />}
      {!loading && icon && iconPosition === 'left' && (
        <span className="cvkit-button-icon">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="cvkit-button-icon">{icon}</span>
      )}
    </button>
  )
}
