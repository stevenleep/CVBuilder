/**
 * 加密设置对话框
 * 
 * 用于首次设置加密密码
 */

import { useState } from 'react'
import { Lock, X, Shield } from 'lucide-react'
import { keyManagementService } from '@/core/services/KeyManagementService'
import { encryptedStorageService } from '@/core/services/EncryptedStorageService'
import { STORES } from '@/utils/indexedDB'

interface EncryptionSetupDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EncryptionSetupDialog({ isOpen, onClose, onSuccess }: EncryptionSetupDialogProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordHint, setPasswordHint] = useState('')
  const [migrateExisting, setMigrateExisting] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [migrationProgress, setMigrationProgress] = useState('')

  const handleSetup = async () => {
    setError('')
    
    // 验证密码
    if (password.length < 8) {
      setError('密码长度至少为8个字符')
      return
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setIsLoading(true)

    try {
      // 设置加密
      await keyManagementService.setupEncryption(password, passwordHint)

      // 迁移现有数据
      if (migrateExisting) {
        setMigrationProgress('正在加密现有数据...')
        
        const stores = [STORES.RESUMES, STORES.RESUME_TEMPLATES, STORES.EDITOR_STATE]
        for (const store of stores) {
          const result = await encryptedStorageService.migrateToEncrypted(store, password)
          setMigrationProgress(`已加密 ${store}: ${result.migrated} 项`)
        }
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : '设置加密失败')
    } finally {
      setIsLoading(false)
      setMigrationProgress('')
    }
  }

  const getPasswordStrength = () => {
    const length = password.length
    if (length < 8) return { text: '太弱', color: '#ef4444' }
    if (length < 12) return { text: '中等', color: '#f59e0b' }
    return { text: '强', color: '#10b981' }
  }

  if (!isOpen) return null

  const strength = getPasswordStrength()

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100001,
        backdropFilter: 'blur(4px)',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          width: '520px',
          maxWidth: 'calc(100vw - 40px)',
          maxHeight: 'calc(100vh - 40px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2d2d2d',
                }}
              >
                <Shield size={20} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2d2d2d', margin: 0 }}>
                设置数据加密
              </h2>
            </div>
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
          </div>
        </div>

        {/* 内容区域 */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #f0f0f0',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
              🔒 您的简历数据将使用军事级 AES-256 加密算法加密存储，只有您知道密码才能解密查看
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                设置密码 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="至少8个字符"
                disabled={isLoading}
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
              {password && (
                <div style={{ marginTop: '6px', fontSize: '12px', color: strength.color }}>
                  密码强度: {strength.text}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                确认密码 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="再次输入密码"
                disabled={isLoading}
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

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                密码提示（可选）
              </label>
              <input
                type="text"
                value={passwordHint}
                onChange={e => setPasswordHint(e.target.value)}
                placeholder="帮助您记忆密码的提示"
                disabled={isLoading}
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
              <div style={{ marginTop: '6px', fontSize: '11px', color: '#999' }}>
                提示：不要在提示中包含密码本身
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="migrateExisting"
                checked={migrateExisting}
                onChange={e => setMigrateExisting(e.target.checked)}
                disabled={isLoading}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="migrateExisting" style={{ fontSize: '13px', color: '#666', cursor: 'pointer' }}>
                加密现有的简历数据
              </label>
            </div>
          </div>

          {error && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                fontSize: '13px',
                color: '#ef4444',
              }}
            >
              {error}
            </div>
          )}

          {migrationProgress && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #f0f0f0',
                fontSize: '13px',
                color: '#666',
              }}
            >
              {migrationProgress}
            </div>
          )}

          <div
            style={{
              marginTop: '20px',
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
              ⚠️ 重要提示
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '11px', color: '#92400e', lineHeight: 1.6 }}>
              <li>请务必记住您的密码，忘记密码将无法恢复数据</li>
              <li>建议使用密码管理器保存密码</li>
              <li>密码不会被上传到服务器，完全在本地加密</li>
            </ul>
          </div>
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
          <button
            onClick={handleSetup}
            disabled={isLoading || !password || !confirmPassword}
            style={{
              padding: '11px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: !isLoading && password && confirmPassword ? '#2d2d2d' : '#e8e8e8',
              color: !isLoading && password && confirmPassword ? '#fff' : '#999',
              cursor: !isLoading && password && confirmPassword ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '700',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: !isLoading && password && confirmPassword ? '0 2px 8px rgba(45,45,45,0.2)' : 'none',
            }}
            onMouseEnter={e => {
              if (!isLoading && password && confirmPassword) {
                e.currentTarget.style.backgroundColor = '#1a1a1a'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(45,45,45,0.3)'
              }
            }}
            onMouseLeave={e => {
              if (!isLoading && password && confirmPassword) {
                e.currentTarget.style.backgroundColor = '#2d2d2d'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(45,45,45,0.2)'
              }
            }}
          >
            <Lock size={16} />
            {isLoading ? '设置中...' : '启用加密'}
          </button>
        </div>
      </div>
    </div>
  )
}
