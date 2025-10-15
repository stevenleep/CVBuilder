/**
 * PWA 更新提示组件
 * 当检测到新版本时，提示用户刷新页面
 */

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ds } from '@/styles/designSystem'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration: ServiceWorkerRegistration | undefined) {
      console.log('[PWA] Service Worker已注册')

      // 定期检查更新（每小时）
      if (registration) {
        setInterval(
          () => {
            console.log('[PWA] 检查更新...')
            registration.update()
          },
          60 * 60 * 1000
        )
      }
    },
    onRegisterError(error: Error) {
      console.error('[PWA] Service Worker注册失败:', error)
    },
  })

  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    console.log('[PWA] 用户确认更新')
    setIsUpdating(true)

    try {
      await updateServiceWorker(true)
      // 页面会自动刷新
    } catch (error) {
      console.error('[PWA] 更新失败:', error)
      // 如果更新失败，手动刷新页面
      window.location.reload()
    }
  }

  const handleDismiss = () => {
    console.log('[PWA] 用户稍后更新')
    setNeedRefresh(false)

    // 10分钟后再次提示
    setTimeout(
      () => {
        setNeedRefresh(true)
      },
      10 * 60 * 1000
    )
  }

  if (!needRefresh) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: ds.spacing.xl,
        right: ds.spacing.xl,
        backgroundColor: ds.colors.background.card,
        padding: ds.spacing.lg,
        borderRadius: ds.borderRadius.xl,
        boxShadow: ds.shadows.floating,
        display: 'flex',
        flexDirection: 'column',
        gap: ds.spacing.md,
        zIndex: ds.zIndex.notification,
        maxWidth: '380px',
        width: 'calc(100vw - 40px)',
        animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `1px solid ${ds.colors.border.base}`,
      }}
    >
      <style>
        {`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: ds.spacing.sm,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: '32px',
            height: '32px',
            borderRadius: ds.borderRadius.md,
            backgroundColor: ds.colors.accent.blue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RefreshCw size={18} color={ds.colors.neutral.white} />
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: ds.typography.fontSize.md,
              fontWeight: ds.typography.fontWeight.semibold,
              color: ds.colors.text.primary,
              marginBottom: ds.spacing.xs,
            }}
          >
            发现新版本
          </div>
          <div
            style={{
              fontSize: ds.typography.fontSize.sm,
              color: ds.colors.text.secondary,
              lineHeight: ds.typography.lineHeight.normal,
            }}
          >
            我们已更新应用，请刷新以获取最新功能和修复
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: ds.spacing.sm,
        }}
      >
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          style={{
            flex: 1,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: ds.spacing.xs,
            height: ds.sizes.button.md,
            padding: `0 ${ds.spacing.lg}`,
            backgroundColor: ds.colors.accent.blue,
            color: ds.colors.neutral.white,
            border: 'none',
            borderRadius: ds.borderRadius.md,
            fontSize: ds.typography.fontSize.sm,
            fontWeight: ds.typography.fontWeight.semibold,
            cursor: isUpdating ? 'wait' : 'pointer',
            opacity: isUpdating ? 0.7 : 1,
            transition: ds.animation.transition.smooth,
          }}
          onMouseEnter={e => {
            if (!isUpdating) {
              e.currentTarget.style.backgroundColor = ds.colors.accent.blueDark
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = ds.colors.accent.blue
          }}
        >
          {isUpdating ? (
            <>
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid currentColor',
                  borderTopColor: 'transparent',
                  borderRadius: ds.borderRadius.round,
                  animation: 'spin 0.6s linear infinite',
                }}
              />
              更新中...
            </>
          ) : (
            <>
              <RefreshCw size={14} />
              立即更新
            </>
          )}
        </button>

        <button
          onClick={handleDismiss}
          disabled={isUpdating}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: ds.sizes.button.md,
            padding: `0 ${ds.spacing.lg}`,
            backgroundColor: 'transparent',
            color: ds.colors.text.secondary,
            border: `1px solid ${ds.colors.border.base}`,
            borderRadius: ds.borderRadius.md,
            fontSize: ds.typography.fontSize.sm,
            fontWeight: ds.typography.fontWeight.medium,
            cursor: isUpdating ? 'not-allowed' : 'pointer',
            opacity: isUpdating ? 0.5 : 1,
            transition: ds.animation.transition.smooth,
          }}
          onMouseEnter={e => {
            if (!isUpdating) {
              e.currentTarget.style.backgroundColor = ds.colors.background.hover
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          稍后
        </button>
      </div>
    </div>
  )
}
