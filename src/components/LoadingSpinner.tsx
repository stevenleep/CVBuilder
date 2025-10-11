/**
 * 统一加载动画组件
 */

import React from 'react'
import { ds } from '@/styles/designSystem'

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
  const getSize = () => {
    switch (size) {
      case 'sm':
        return { width: 20, height: 20, border: 2 }
      case 'md':
        return { width: 32, height: 32, border: 3 }
      case 'lg':
        return { width: 48, height: 48, border: 4 }
      default:
        return { width: 32, height: 32, border: 3 }
    }
  }

  const { width, height, border } = getSize()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: ds.spacing.md,
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: `${border}px solid ${color}20`,
          borderTopColor: color,
          borderRadius: ds.borderRadius.round,
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && (
        <div
          style={{
            fontSize: ds.typography.fontSize.sm,
            color: ds.colors.text.tertiary,
            fontWeight: ds.typography.fontWeight.medium,
          }}
        >
          {text}
        </div>
      )}
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
    </div>
  )
}

/**
 * 全屏加载状态
 */
export const LoadingOverlay: React.FC<{ text?: string }> = ({ text = '加载中...' }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: ds.zIndex.modal,
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <LoadingSpinner size="lg" text={text} />
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}

