/**
 * 视口模式上下文
 *
 * 管理当前编辑器的视口模式（桌面端/移动端）
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { ViewportMode } from '@/core/protocols/IMaterialProtocol'

interface ViewportContextType {
  /** 当前视口模式 */
  viewportMode: ViewportMode
  /** 切换视口模式 */
  setViewportMode: (mode: ViewportMode) => void
  /** 是否为移动端模式 */
  isMobile: boolean
  /** 是否为桌面端模式 */
  isDesktop: boolean
}

const ViewportContext = createContext<ViewportContextType | undefined>(undefined)

interface ViewportProviderProps {
  children: ReactNode
  /** 默认视口模式 */
  defaultMode?: ViewportMode
}

export const ViewportProvider: React.FC<ViewportProviderProps> = ({
  children,
  defaultMode = 'desktop',
}) => {
  const [viewportMode, setViewportModeState] = useState<ViewportMode>(defaultMode)

  const setViewportMode = useCallback((mode: ViewportMode) => {
    setViewportModeState(mode)
  }, [])

  const isMobile = viewportMode === 'mobile'
  const isDesktop = viewportMode === 'desktop'

  const value: ViewportContextType = {
    viewportMode,
    setViewportMode,
    isMobile,
    isDesktop,
  }

  return <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>
}

/**
 * 使用视口模式上下文
 */
export const useViewport = (): ViewportContextType => {
  const context = useContext(ViewportContext)
  if (context === undefined) {
    throw new Error('useViewport must be used within a ViewportProvider')
  }
  return context
}

/**
 * 视口模式切换组件
 */
export const ViewportToggle: React.FC = () => {
  const { setViewportMode, isMobile } = useViewport()

  const handleToggle = useCallback(() => {
    setViewportMode(isMobile ? 'desktop' : 'mobile')
  }, [isMobile, setViewportMode])

  return (
    <button
      onClick={handleToggle}
      style={{
        width: '32px',
        height: '32px',
        border: 'none',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
      title={`切换到${isMobile ? '桌面端' : '移动端'}模式`}
    >
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isMobile ? (
          // 桌面端图标
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        ) : (
          // 移动端图标
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        )}
      </svg>
    </button>
  )
}
