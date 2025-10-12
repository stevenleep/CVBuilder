/**
 * PWA 安装提示组件
 * 提示用户可以将应用安装到桌面/主屏幕
 */

import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'

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
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#ffffff',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 9999,
        maxWidth: '90vw',
        width: '400px',
        animation: 'slideUp 0.3s ease-out',
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
          gap: '4px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#2d2d2d',
          }}
        >
          安装 CVKit 应用
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#666',
          }}
        >
          快速访问，离线使用，体验更佳
        </div>
      </div>

      <button
        onClick={handleInstall}
        style={{
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#2563eb'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#3b82f6'
        }}
      >
        <Download size={14} />
        安装
      </button>

      <button
        onClick={handleClose}
        style={{
          padding: '4px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#999',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#666'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = '#999'
        }}
      >
        <X size={18} />
      </button>
    </div>
  )
}
