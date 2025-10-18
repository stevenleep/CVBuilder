/**
 * 加密管理面板
 */

import { useState, useEffect } from 'react'
import { Lock, Unlock } from 'lucide-react'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      { key: STORES.RESUMES, name: '简历' },
      { key: STORES.RESUME_TEMPLATES, name: '模板' },
      { key: STORES.EDITOR_STATE, name: '草稿' },
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
    if (!confirm('确定要禁用加密吗？\n此操作将解密所有数据。')) {
      return
    }

    const password = prompt('请输入密码确认：')
    if (!password) return

    setIsLoading(true)
    try {
      const stores = [STORES.RESUMES, STORES.RESUME_TEMPLATES, STORES.EDITOR_STATE]
      for (const store of stores) {
        await encryptedStorageService.decryptAll(store, password)
      }

      await keyManagementService.disableEncryption(password)
      alert('已禁用加密')
      checkStatus()
    } catch (err) {
      alert(err instanceof Error ? err.message : '操作失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    const oldPassword = prompt('请输入当前密码：')
    if (!oldPassword) return

    const newPassword = prompt('请输入新密码（至少8位）：')
    if (!newPassword || newPassword.length < 8) {
      alert('密码至少8位')
      return
    }

    const confirmPassword = prompt('再次输入新密码：')
    if (newPassword !== confirmPassword) {
      alert('两次密码不一致')
      return
    }

    setIsLoading(true)
    try {
      await keyManagementService.changePassword(oldPassword, newPassword)
      alert('密码已更新')
    } catch (err) {
      alert(err instanceof Error ? err.message : '操作失败')
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
          padding: '24px',
        }}
      >
        {!isEnabled ? (
          // 未启用
          <>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: '700',
                color: '#2d2d2d',
                margin: '0 0 6px 0',
              }}
            >
              数据加密
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#999',
                lineHeight: 1.6,
                margin: '0 0 20px 0',
              }}
            >
              使用 AES-256 加密保护您的数据
            </p>
            <button
              onClick={handleEnableEncryption}
              style={{
                padding: '9px 18px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#2d2d2d',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2d2d2d')}
            >
              启用加密
            </button>
          </>
        ) : (
          // 已启用
          <>
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#2d2d2d',
                    margin: 0,
                  }}
                >
                  数据加密
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    color: '#999',
                  }}
                >
                  {isUnlocked ? <Unlock size={12} /> : <Lock size={12} />}
                  {isUnlocked ? '已解锁' : '已锁定'}
                </div>
              </div>

              {isUnlocked && stats.length > 0 && (
                <div style={{ fontSize: '12px', color: '#999' }}>
                  {stats.map((stat, i) => (
                    <span key={stat.name}>
                      {stat.name} {stat.encrypted}/{stat.total}
                      {i < stats.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {!isUnlocked ? (
                <button
                  onClick={handleUnlock}
                  style={{
                    padding: '9px 18px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#2d2d2d',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2d2d2d')}
                >
                  解锁
                </button>
              ) : (
                <>
                  <button
                    onClick={handleLock}
                    style={{
                      padding: '9px 18px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
                  >
                    锁定
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    style={{
                      padding: '9px 18px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      color: '#666',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
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
                    改密码
                  </button>
                  <button
                    onClick={handleDisableEncryption}
                    disabled={isLoading}
                    style={{
                      padding: '9px 18px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      color: '#999',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
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
                    禁用
                  </button>
                </>
              )}
            </div>
          </>
        )}
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
