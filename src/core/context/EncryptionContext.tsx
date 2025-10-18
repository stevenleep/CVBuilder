/**
 * 加密状态上下文
 *
 * 管理全局加密状态，提供统一的加密服务访问接口
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { keyManagementService } from '../services/KeyManagementService'
import { EncryptionUnlockDialog } from '@/components/EncryptionUnlockDialog'

interface EncryptionContextValue {
  /** 是否启用加密 */
  isEnabled: boolean
  /** 是否已解锁 */
  isUnlocked: boolean
  /** 请求解锁（显示解锁对话框） */
  requestUnlock: () => void
  /** 锁定 */
  lock: () => void
  /** 刷新状态 */
  refresh: () => Promise<void>
}

const EncryptionContext = createContext<EncryptionContextValue | null>(null)

interface EncryptionProviderProps {
  children: ReactNode
}

export function EncryptionProvider({ children }: EncryptionProviderProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)

  useEffect(() => {
    checkStatus()

    // 定期检查状态（每30秒）
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkStatus = async () => {
    const enabled = await keyManagementService.isEncryptionEnabled()
    const unlocked = keyManagementService.isUnlocked()
    setIsEnabled(enabled)
    setIsUnlocked(unlocked)

    // 如果启用了加密但未解锁，自动显示解锁对话框
    if (enabled && !unlocked) {
      setShowUnlockDialog(true)
    }
  }

  const requestUnlock = () => {
    setShowUnlockDialog(true)
  }

  const lock = () => {
    keyManagementService.lock()
    checkStatus()
  }

  const handleUnlockSuccess = async () => {
    setShowUnlockDialog(false)
    // 立即更新解锁状态
    setIsUnlocked(true)
    // 然后刷新状态以确保同步
    await checkStatus()
  }

  const value: EncryptionContextValue = {
    isEnabled,
    isUnlocked,
    requestUnlock,
    lock,
    refresh: checkStatus,
  }

  return (
    <EncryptionContext.Provider value={value}>
      {children}

      {isEnabled && (
        <EncryptionUnlockDialog
          isOpen={showUnlockDialog}
          onSuccess={handleUnlockSuccess}
          canCancel={false}
        />
      )}
    </EncryptionContext.Provider>
  )
}

/**
 * 使用加密上下文
 */
export function useEncryption() {
  const context = useContext(EncryptionContext)
  if (!context) {
    throw new Error('useEncryption must be used within EncryptionProvider')
  }
  return context
}
