/**
 * 统一按钮组件 - 专业设计系统
 */

import React, { useState } from 'react'
import { ds } from '@/styles/designSystem'

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
  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)

  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles = {
      transition: ds.animation.transition.smooth,
      fontWeight: ds.typography.fontWeight.semibold,
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: hover ? ds.colors.primary.light : ds.colors.primary.base,
          color: ds.colors.text.inverse,
          border: 'none',
          boxShadow: hover ? ds.shadows.md : ds.shadows.sm,
        }
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: hover ? ds.colors.background.hover : ds.colors.background.card,
          color: ds.colors.text.primary,
          border: `1px solid ${hover ? ds.colors.border.dark : ds.colors.border.base}`,
          boxShadow: hover ? ds.shadows.sm : 'none',
        }
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: hover ? ds.colors.background.hover : 'transparent',
          color: ds.colors.text.primary,
          border: `1px solid ${hover ? ds.colors.border.dark : ds.colors.border.base}`,
        }
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: hover ? ds.colors.background.hover : 'transparent',
          color: ds.colors.text.secondary,
          border: 'none',
        }
      case 'danger':
        return {
          ...baseStyles,
          backgroundColor: hover ? '#dc2626' : ds.colors.semantic.error,
          color: ds.colors.text.inverse,
          border: 'none',
          boxShadow: hover ? '0 4px 12px rgba(239, 68, 68, 0.3)' : ds.shadows.sm,
        }
      default:
        return baseStyles
    }
  }

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          height: ds.sizes.button.sm,
          padding: `0 ${ds.spacing.md}`,
          fontSize: ds.typography.fontSize.sm,
          gap: ds.spacing.xs,
        }
      case 'md':
        return {
          height: ds.sizes.button.md,
          padding: `0 ${ds.spacing.lg}`,
          fontSize: ds.typography.fontSize.base,
          gap: ds.spacing.sm,
        }
      case 'lg':
        return {
          height: ds.sizes.button.lg,
          padding: `0 ${ds.spacing.xl}`,
          fontSize: ds.typography.fontSize.md,
          gap: ds.spacing.sm,
        }
      default:
        return {}
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) return
    setActive(true)
    setTimeout(() => setActive(false), 150)
    onClick?.(e)
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled || loading}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: ds.borderRadius.md,
        cursor: disabled ? 'not-allowed' : loading ? 'wait' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        transform: active ? 'scale(0.97)' : 'scale(1)',
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...style,
      }}
    >
      {loading && (
        <div
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: ds.borderRadius.round,
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {!loading && icon && iconPosition === 'left' && <span style={{ display: 'flex' }}>{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span style={{ display: 'flex' }}>{icon}</span>}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </button>
  )
}

