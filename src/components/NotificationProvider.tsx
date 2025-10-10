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
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none',
          alignItems: 'center',
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
  const styles = {
    success: { bg: '#2d2d2d', border: '#4a4a4a', text: '#fff' },
    error: { bg: '#2d2d2d', border: '#4a4a4a', text: '#fff' },
    warning: { bg: '#2d2d2d', border: '#4a4a4a', text: '#fff' },
    info: { bg: '#2d2d2d', border: '#4a4a4a', text: '#fff' },
  }

  const style = styles[type]

  return (
    <div
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: '12px 24px',
        borderRadius: '6px',
        border: `1px solid ${style.border}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        minWidth: '300px',
        maxWidth: '500px',
        pointerEvents: 'auto',
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      <span style={{ fontSize: '14px' }}>{message}</span>
      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
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
  onClose,
}: ConfirmOptions & { onClose: (confirmed: boolean) => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
          backgroundColor: '#2d2d2d',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '400px',
          maxWidth: '500px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          border: '1px solid #4a4a4a',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3
          style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '500',
            color: '#fff',
          }}
        >
          {title}
        </h3>
        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#bbb', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => onClose(false)}
            style={{
              padding: '8px 20px',
              border: '1px solid #555',
              borderRadius: '6px',
              backgroundColor: '#3a3a3a',
              color: '#ccc',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#4a4a4a'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#3a3a3a'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => onClose(true)}
            style={{
              padding: '8px 20px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#555',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#666'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#555'
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
          backgroundColor: '#2d2d2d',
          borderRadius: '8px',
          padding: '24px',
          minWidth: '400px',
          maxWidth: '500px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          border: '1px solid #4a4a4a',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <h3
            style={{
              margin: '0 0 8px 0',
              fontSize: '18px',
              fontWeight: '500',
              color: '#fff',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              color: '#bbb',
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
              border: '1px solid #555',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
              marginBottom: '24px',
              boxSizing: 'border-box',
              backgroundColor: '#1a1a1a',
              color: '#fff',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#777'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#555'
            }}
          />
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => onClose(null)}
              style={{
                padding: '8px 20px',
                border: '1px solid #555',
                borderRadius: '6px',
                backgroundColor: '#3a3a3a',
                color: '#ccc',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#4a4a4a'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#3a3a3a'
              }}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#555',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#666'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#555'
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
