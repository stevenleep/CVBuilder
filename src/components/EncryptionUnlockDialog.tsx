/**
 * 加密解锁对话框
 * 
 * 用于输入密码解锁加密数据
 */

import { useState, useEffect } from 'react'
import { Lock, X, AlertCircle } from 'lucide-react'
import { keyManagementService } from '@/core/services/KeyManagementService'

interface EncryptionUnlockDialogProps {
  isOpen: boolean
  onClose?: () => void
  onSuccess: () => void
  canCancel?: boolean
}

export function EncryptionUnlockDialog({ 
  isOpen, 
  onClose, 
  onSuccess,
  canCancel = true 
}: EncryptionUnlockDialogProps) {
  const [password, setPassword] = useState('')
  const [passwordHint, setPasswordHint] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (isOpen) {
      loadPasswordHint()
    }
  }, [isOpen])

  const loadPasswordHint = async () => {
    const hint = await keyManagementService.getPasswordHint()
    setPasswordHint(hint || '')
  }

  const handleUnlock = async () => {
    setError('')
    
    if (!password) {
      setError('请输入密码')
      return
    }

    setIsLoading(true)

    try {
      const success = await keyManagementService.unlock(password)
      
      if (success) {
        onSuccess()
        setPassword('')
        setAttempts(0)
      } else {
        setAttempts(prev => prev + 1)
        setError('密码不正确，请重试')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '解锁失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleUnlock()
    }
  }

  if (!isOpen) return null

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
        backdropFilter: 'blur(4px)',
        padding: '20px',
      }}
      onClick={canCancel ? onClose : undefined}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          width: '440px',
          maxWidth: 'calc(100vw - 40px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2d2d2d',
                flexShrink: 0,
              }}
            >
              <Lock size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2d2d2d', margin: '0 0 4px 0' }}>
                数据已加密
              </h2>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                请输入密码解锁访问您的数据
              </p>
            </div>
            {canCancel && onClose && (
              <button
                onClick={onClose}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#999',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5'
                  e.currentTarget.style.color = '#666'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#999'
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* 内容区域 */}
        <div style={{ padding: '24px' }}>
          {passwordHint && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #f0f0f0',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px' }}>
                密码提示：
              </div>
              <div style={{ fontSize: '13px', color: '#2d2d2d' }}>{passwordHint}</div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="请输入加密密码"
              disabled={isLoading}
              autoFocus
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e8e8e8',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#fff',
                color: '#2d2d2d',
                boxSizing: 'border-box',
                transition: 'all 0.15s',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#2d2d2d'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,45,45,0.05)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#e8e8e8'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0, marginTop: '1px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: '#ef4444' }}>{error}</div>
                {attempts >= 3 && (
                  <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
                    已尝试 {attempts} 次。如果忘记密码，您可能需要重置加密设置（将丢失已加密的数据）
                  </div>
                )}
              </div>
            </div>
          )}

          {attempts >= 5 && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
                忘记密码？
              </div>
              <div style={{ fontSize: '11px', color: '#92400e', lineHeight: 1.5 }}>
                如果您无法记起密码，可以选择重置加密设置。但请注意，这将导致所有已加密的数据无法恢复。
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            backgroundColor: '#fafafa',
          }}
        >
          {canCancel && onClose && (
            <button
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: '11px 20px',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#666',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.15s',
                opacity: isLoading ? 0.5 : 1,
              }}
              onMouseEnter={e => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#f8f9fa'
              }}
              onMouseLeave={e => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#fff'
              }}
            >
              取消
            </button>
          )}
          <button
            onClick={handleUnlock}
            disabled={isLoading || !password}
            style={{
              padding: '11px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: !isLoading && password ? '#2d2d2d' : '#e8e8e8',
              color: !isLoading && password ? '#fff' : '#999',
              cursor: !isLoading && password ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '700',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: !isLoading && password ? '0 2px 8px rgba(45,45,45,0.2)' : 'none',
            }}
            onMouseEnter={e => {
              if (!isLoading && password) {
                e.currentTarget.style.backgroundColor = '#1a1a1a'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(45,45,45,0.3)'
              }
            }}
            onMouseLeave={e => {
              if (!isLoading && password) {
                e.currentTarget.style.backgroundColor = '#2d2d2d'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(45,45,45,0.2)'
              }
            }}
          >
            <Lock size={16} />
            {isLoading ? '验证中...' : '解锁'}
          </button>
        </div>
      </div>
    </div>
  )
}
