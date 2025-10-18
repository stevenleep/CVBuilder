/**
 * 加密管理面板
 * 
 * 用于管理加密设置、更改密码、查看加密状态等
 */

import { useState, useEffect } from 'react'
import { Shield, Lock, Unlock, Key, AlertCircle, Check } from 'lucide-react'
import { keyManagementService } from '@/core/services/KeyManagementService'
import { encryptedStorageService } from '@/core/services/EncryptedStorageService'
import { STORES } from '@/utils/indexedDB'
import { EncryptionSetupDialog } from './EncryptionSetupDialog'
import { EncryptionUnlockDialog } from './EncryptionUnlockDialog'

interface StorageStats {
  name: string
  total: number
  encrypted: number
  unencrypted: number
}

export function EncryptionManagementPanel() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showSetupDialog, setShowSetupDialog] = useState(false)
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)
  const [stats, setStats] = useState<StorageStats[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    const enabled = await keyManagementService.isEncryptionEnabled()
    const unlocked = keyManagementService.isUnlocked()
    setIsEnabled(enabled)
    setIsUnlocked(unlocked)

    if (enabled && unlocked) {
      await loadStats()
    }
  }

  const loadStats = async () => {
    const stores = [
      { key: STORES.RESUMES, name: '简历数据' },
      { key: STORES.RESUME_TEMPLATES, name: '简历模板' },
      { key: STORES.EDITOR_STATE, name: '编辑器状态' },
    ]

    const statsData: StorageStats[] = []
    for (const store of stores) {
      const stat = await encryptedStorageService.getStorageStats(store.key)
      statsData.push({
        name: store.name,
        ...stat,
      })
    }
    setStats(statsData)
  }

  const handleEnableEncryption = () => {
    setShowSetupDialog(true)
  }

  const handleSetupSuccess = () => {
    setShowSetupDialog(false)
    checkStatus()
  }

  const handleUnlock = () => {
    setShowUnlockDialog(true)
  }

  const handleUnlockSuccess = () => {
    setShowUnlockDialog(false)
    checkStatus()
  }

  const handleLock = () => {
    keyManagementService.lock()
    checkStatus()
  }

  const handleDisableEncryption = async () => {
    if (!confirm('确定要禁用加密吗？这将解密所有数据。\n\n此操作无法撤销。')) {
      return
    }

    const password = prompt('请输入密码以确认操作：')
    if (!password) return

    setIsLoading(true)
    try {
      // 解密所有数据
      const stores = [STORES.RESUMES, STORES.RESUME_TEMPLATES, STORES.EDITOR_STATE]
      for (const store of stores) {
        await encryptedStorageService.decryptAll(store, password)
      }

      // 禁用加密
      await keyManagementService.disableEncryption(password)
      
      alert('加密已禁用，所有数据已解密')
      checkStatus()
    } catch (err) {
      alert(err instanceof Error ? err.message : '禁用加密失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    const oldPassword = prompt('请输入当前密码：')
    if (!oldPassword) return

    const newPassword = prompt('请输入新密码（至少8个字符）：')
    if (!newPassword || newPassword.length < 8) {
      alert('新密码长度至少为8个字符')
      return
    }

    const confirmPassword = prompt('请再次输入新密码：')
    if (newPassword !== confirmPassword) {
      alert('两次输入的密码不一致')
      return
    }

    setIsLoading(true)
    try {
      await keyManagementService.changePassword(oldPassword, newPassword)
      alert('密码已更新')
    } catch (err) {
      alert(err instanceof Error ? err.message : '更改密码失败')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          border: '1px solid #e8e8e8',
          overflow: 'hidden',
        }}
      >
        {/* 头部 */}
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
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
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2d2d2d', margin: 0 }}>
                数据加密设置
              </h3>
              <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0 0' }}>
                端到端加密保护您的隐私数据
              </p>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div style={{ padding: '20px' }}>
          {!isEnabled ? (
            <div>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #f0f0f0',
                  marginBottom: '16px',
                }}
              >
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, margin: 0 }}>
                  启用端到端加密（E2EE）可以保护您的简历数据安全。数据将使用 AES-256 加密算法加密存储在本地，只有您知道密码才能解密查看。
                </p>
              </div>
              <button
                onClick={handleEnableEncryption}
                style={{
                  padding: '11px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#2d2d2d',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '700',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(45,45,45,0.2)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#1a1a1a'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(45,45,45,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#2d2d2d'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(45,45,45,0.2)'
                }}
              >
                <Lock size={16} />
                启用加密保护
              </button>
            </div>
          ) : (
            <div>
              {/* 状态显示 */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: isUnlocked ? '#f0fdf4' : '#f8f9fa',
                  border: `1px solid ${isUnlocked ? '#bbf7d0' : '#f0f0f0'}`,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isUnlocked ? '#dcfce7' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isUnlocked ? '#10b981' : '#666',
                  }}
                >
                  {isUnlocked ? <Check size={16} /> : <Lock size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d2d2d' }}>
                    加密已启用
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                    状态: {isUnlocked ? '已解锁' : '已锁定'}
                  </div>
                </div>
              </div>

              {/* 加密统计 */}
              {isUnlocked && stats.length > 0 && (
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #f0f0f0',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '10px' }}>
                    加密统计
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stats.map(stat => (
                      <div key={stat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#2d2d2d' }}>{stat.name}</span>
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          {stat.encrypted} / {stat.total} 已加密
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {!isUnlocked ? (
                  <button
                    onClick={handleUnlock}
                    style={{
                      padding: '11px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#2d2d2d',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#1a1a1a'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#2d2d2d'
                    }}
                  >
                    <Unlock size={16} />
                    解锁加密数据
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleLock}
                      style={{
                        padding: '11px 16px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#fff'
                      }}
                    >
                      <Lock size={16} />
                      锁定
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      style={{
                        padding: '11px 16px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        color: '#666',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        opacity: isLoading ? 0.5 : 1,
                      }}
                      onMouseEnter={e => {
                        if (!isLoading) e.currentTarget.style.backgroundColor = '#f8f9fa'
                      }}
                      onMouseLeave={e => {
                        if (!isLoading) e.currentTarget.style.backgroundColor = '#fff'
                      }}
                    >
                      <Key size={16} />
                      更改密码
                    </button>
                    <button
                      onClick={handleDisableEncryption}
                      disabled={isLoading}
                      style={{
                        padding: '11px 16px',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        color: '#ef4444',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        opacity: isLoading ? 0.5 : 1,
                      }}
                      onMouseEnter={e => {
                        if (!isLoading) {
                          e.currentTarget.style.backgroundColor = '#fef2f2'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isLoading) {
                          e.currentTarget.style.backgroundColor = '#fff'
                        }
                      }}
                    >
                      <AlertCircle size={16} />
                      禁用加密
                    </button>
                  </>
                )}
              </div>

              {/* 安全提示 */}
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
                  ⚠️ 安全提示
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '11px', color: '#92400e', lineHeight: 1.6 }}>
                  <li>请务必记住您的密码</li>
                  <li>关闭浏览器后需要重新解锁</li>
                  <li>数据完全在本地加密，不会上传到服务器</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <EncryptionSetupDialog
        isOpen={showSetupDialog}
        onClose={() => setShowSetupDialog(false)}
        onSuccess={handleSetupSuccess}
      />

      <EncryptionUnlockDialog
        isOpen={showUnlockDialog}
        onClose={() => setShowUnlockDialog(false)}
        onSuccess={handleUnlockSuccess}
      />
    </>
  )
}
