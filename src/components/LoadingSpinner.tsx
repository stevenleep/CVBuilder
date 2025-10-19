/**
 * 统一加载动画组件
 */

import React from 'react'
import { ds } from '@/styles/designSystem'
import { classNames } from '@/styles/styleUtils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = ds.colors.accent.blue,
  text,
}) => {
  const spinnerClasses = classNames('cvkit-spinner', `cvkit-spinner-${size}`)

  return (
    <div className="cvkit-spinner-container">
      <div
        className={spinnerClasses}
        style={{
          borderColor: `${color}20`,
          borderTopColor: color,
        }}
      />
      {text && <div className="cvkit-spinner-text">{text}</div>}
    </div>
  )
}

/**
 * 全屏加载状态
 */
export const LoadingOverlay: React.FC<{ text?: string }> = ({ text = '加载中...' }) => {
  return (
    <div className="cvkit-loading-overlay">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}
