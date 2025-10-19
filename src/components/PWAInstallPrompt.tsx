/**
 * PWA 安装提示组件
 */

import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'
import { notification } from '@/utils/notification'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // 检查是否已经安装
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = (window.navigator as any).standalone === true

    if (isStandalone || isIOSStandalone) {
      return
    }

    // 检查是否已经关闭过提示
    const hasClosedPrompt = localStorage.getItem('pwa-install-prompt-closed')
    if (hasClosedPrompt) {
      const closedTime = parseInt(hasClosedPrompt)
      const elapsed = Date.now() - closedTime
      // 24小时内，不显示提示
      if (elapsed < 86400000) {
        return
      } else {
        localStorage.removeItem('pwa-install-prompt-closed')
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // 阻止默认的安装提示
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // 延迟 3 秒显示提示，让用户先体验应用
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return
    }

    try {
      // 显示安装提示
      await deferredPrompt.prompt()

      // 等待用户响应
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        notification.success('安装成功')
      }
    } catch (error) {
      notification.info('安装失败，请稍后重试')
    }

    // 清除保存的事件
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleClose = () => {
    setShowPrompt(false)
    // 记录用户关闭了提示，24小时内不再显示
    localStorage.setItem('pwa-install-prompt-closed', Date.now().toString())
  }

  // 24小时后清除关闭标记
  useEffect(() => {
    const checkExpiry = () => {
      const closedTime = localStorage.getItem('pwa-install-prompt-closed')
      if (closedTime) {
        const elapsed = Date.now() - parseInt(closedTime)
        // 24小时 = 86400000 毫秒
        if (elapsed > 86400000) {
          localStorage.removeItem('pwa-install-prompt-closed')
        }
      }
    }

    checkExpiry()
    // 每小时检查一次
    const interval = setInterval(checkExpiry, 3600000)

    return () => clearInterval(interval)
  }, [])

  if (!showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="cvkit-pwa-install-prompt">
      <div className="cvkit-pwa-install-content">
        <div className="cvkit-pwa-install-title">安装 CVKit 应用</div>
        <div className="cvkit-pwa-install-description">快速访问，离线使用，体验更佳</div>
      </div>

      <button onClick={handleInstall} className="cvkit-pwa-install-button">
        <Download size={16} />
        立即安装
      </button>

      <button onClick={handleClose} className="cvkit-pwa-close-button" aria-label="关闭">
        <X size={16} />
      </button>
    </div>
  )
}
