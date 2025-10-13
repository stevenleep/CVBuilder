/**
 * PWA 安装提示组件
 */

import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'
import { Button } from './Button'
import { ds } from '@/styles/designSystem'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // 检查是否已经安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // 检查是否已经关闭过提示
    const hasClosedPrompt = localStorage.getItem('pwa-install-prompt-closed')
    if (hasClosedPrompt) {
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // 阻止默认的安装提示
      e.preventDefault()
      // 保存事件，以便稍后触发
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

    // 显示安装提示
    deferredPrompt.prompt()

    // 等待用户响应
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('用户接受了安装')
    } else {
      console.log('用户拒绝了安装')
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
    <div
      style={{
        position: 'fixed',
        bottom: ds.spacing.xl,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: ds.colors.background.card,
        padding: `${ds.spacing.lg} ${ds.spacing.xl}`,
        borderRadius: ds.borderRadius.xxl,
        boxShadow: ds.shadows.floating,
        display: 'flex',
        alignItems: 'center',
        gap: ds.spacing.lg,
        zIndex: ds.zIndex.notification,
        maxWidth: '90vw',
        width: '420px',
        animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `1px solid ${ds.colors.border.light}`,
      }}
    >
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
        `}
      </style>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: ds.spacing.xs,
        }}
      >
        <div
          style={{
            fontSize: ds.typography.fontSize.md,
            fontWeight: ds.typography.fontWeight.semibold,
            color: ds.colors.text.primary,
            lineHeight: ds.typography.lineHeight.tight,
          }}
        >
          安装 CVKit 应用
        </div>
        <div
          style={{
            fontSize: ds.typography.fontSize.sm,
            color: ds.colors.text.secondary,
            lineHeight: ds.typography.lineHeight.normal,
          }}
        >
          快速访问，离线使用，体验更佳
        </div>
      </div>

      <Button
        variant="primary"
        size="sm"
        icon={<Download size={ds.sizes.icon.sm} />}
        onClick={handleInstall}
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        立即安装
      </Button>

      <button
        onClick={handleClose}
        style={{
          padding: ds.spacing.xs,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: ds.colors.text.tertiary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: ds.borderRadius.sm,
          transition: ds.animation.transition.fast,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = ds.colors.text.secondary
          e.currentTarget.style.backgroundColor = ds.colors.background.hover
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = ds.colors.text.tertiary
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        aria-label="关闭"
      >
        <X size={ds.sizes.icon.lg} />
      </button>
    </div>
  )
}
