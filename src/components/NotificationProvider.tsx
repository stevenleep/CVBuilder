/**
 * 通知提供者组件
 *
 * 管理和渲染所有的通知、对话框
 */

import { useEffect, useState, useCallback } from 'react'
import { notification, ToastOptions, ConfirmOptions, PromptOptions } from '@/utils/notification'

interface ToastItem extends ToastOptions {
  id: string
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [confirmDialog, setConfirmDialog] = useState<
    | (ConfirmOptions & {
        resolve: (value: boolean) => void
      })
    | null
  >(null)
  const [promptDialog, setPromptDialog] = useState<
    | (PromptOptions & {
        resolve: (value: string | null) => void
      })
    | null
  >(null)

  // 注册 Toast 处理器
  useEffect(() => {
    notification.registerToast((options: ToastOptions) => {
      const id = Math.random().toString(36).substring(7)
      const duration = options.duration || 3000
      setToasts(prev => [...prev, { ...options, id }])

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    })
  }, [])

  // 注册 Confirm 处理器
  useEffect(() => {
    notification.registerConfirm((options: ConfirmOptions) => {
      return new Promise(resolve => {
        setConfirmDialog({ ...options, resolve })
      })
    })
  }, [])

  // 注册 Prompt 处理器
  useEffect(() => {
    notification.registerPrompt((options: PromptOptions) => {
      return new Promise(resolve => {
        setPromptDialog({ ...options, resolve })
      })
    })
  }, [])

  const handleConfirm = useCallback(
    (confirmed: boolean) => {
      if (confirmDialog) {
        confirmDialog.resolve(confirmed)
        setConfirmDialog(null)
      }
    },
    [confirmDialog]
  )

  const handlePrompt = useCallback(
    (value: string | null) => {
      if (promptDialog) {
        promptDialog.resolve(value)
        setPromptDialog(null)
      }
    },
    [promptDialog]
  )

  return (
    <>
      {children}

      {/* Toast 通知 */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>

      {/* 确认对话框 */}
      {confirmDialog && <ConfirmDialog {...confirmDialog} onClose={handleConfirm} />}

      {/* 输入对话框 */}
      {promptDialog && <PromptDialog {...promptDialog} onClose={handlePrompt} />}
    </>
  )
}

// Toast 组件
function Toast({ message, type = 'info' }: ToastOptions) {
  const colors = {
    success: { bg: '#10b981', icon: '✓' },
    error: { bg: '#ef4444', icon: '✕' },
    warning: { bg: '#f59e0b', icon: '⚠' },
    info: { bg: '#3b82f6', icon: 'ℹ' },
  }

  const { bg, icon } = colors[type]

  return (
    <div
      style={{
        backgroundColor: bg,
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '200px',
        maxWidth: '400px',
        pointerEvents: 'auto',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{icon}</span>
      <span style={{ flex: 1, fontSize: '14px' }}>{message}</span>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}

// 确认对话框组件
function ConfirmDialog({
  title = '确认',
  message,
  confirmText = '确定',
  cancelText = '取消',
  type = 'warning',
  onClose,
}: ConfirmOptions & { onClose: (confirmed: boolean) => void }) {
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100001,
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={() => onClose(false)}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          minWidth: '400px',
          maxWidth: '500px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3
          style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: colors[type],
          }}
        >
          {title}
        </h3>
        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => onClose(false)}
            style={{
              padding: '8px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'white'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => onClose(true)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: colors[type],
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}

// 输入对话框组件
function PromptDialog({
  title = '输入',
  message,
  defaultValue = '',
  placeholder = '',
  confirmText = '确定',
  cancelText = '取消',
  onClose,
}: PromptOptions & { onClose: (value: string | null) => void }) {
  const [value, setValue] = useState(defaultValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose(value.trim() || null)
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100001,
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={() => onClose(null)}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          minWidth: '400px',
          maxWidth: '500px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <h3
            style={{
              margin: '0 0 8px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              color: '#666',
              lineHeight: '1.5',
            }}
          >
            {message}
          </p>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
              marginBottom: '24px',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#e5e7eb'
            }}
          />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => onClose(null)}
              style={{
                padding: '8px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f9fafb'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'white'
              }}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#3b82f6',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.9'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}
