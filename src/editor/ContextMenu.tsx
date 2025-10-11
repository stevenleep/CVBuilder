/**
 * 右键菜单组件 - 增强版
 */

import React, { useEffect, useRef } from 'react'

export interface ContextMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  divider?: boolean
  danger?: boolean
  disabled?: boolean
}

interface ContextMenuProps {
  x: number
  y: number
  items: ContextMenuItem[]
  onClose: () => void
  onAction: (actionId: string) => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose, onAction }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    // 延迟添加事件监听，避免立即触发
    setTimeout(() => {
      document.addEventListener('click', handleClick)
      document.addEventListener('contextmenu', handleClick)
      document.addEventListener('keydown', handleEscape)
    }, 0)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('contextmenu', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  // 调整菜单位置，确保不超出视口
  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current
      const rect = menu.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      // 右侧超出
      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 8
      }

      // 底部超出
      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 8
      }

      menu.style.left = `${adjustedX}px`
      menu.style.top = `${adjustedY}px`
    }
  }, [x, y])

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        padding: '6px',
        minWidth: '200px',
        zIndex: 100000,
        animation: 'context-menu-appear 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onClick={e => e.stopPropagation()}
      onContextMenu={e => e.preventDefault()}
    >
      {items.map((item) => (
        <React.Fragment key={item.id}>
          {item.divider ? (
            <div
              style={{
                height: '1px',
                backgroundColor: '#e8e8e8',
                margin: '6px 0',
              }}
            />
          ) : (
            <div
              onClick={() => {
                if (!item.disabled) {
                  onAction(item.id)
                  onClose()
                }
              }}
              style={{
                padding: '10px 14px',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                borderRadius: '5px',
                fontSize: '13px',
                fontWeight: '500',
                color: item.danger ? '#ef4444' : item.disabled ? '#999' : '#2d2d2d',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.1s ease',
                opacity: item.disabled ? 0.5 : 1,
              }}
              onMouseEnter={e => {
                if (!item.disabled) {
                  e.currentTarget.style.backgroundColor = item.danger ? '#fef2f2' : '#f8f9fa'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {item.icon && (
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}>
                  {item.icon}
                </span>
              )}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.shortcut && (
                <span
                  style={{
                    fontSize: '11px',
                    color: '#999',
                    fontFamily: 'monospace',
                    backgroundColor: '#f0f0f0',
                    padding: '2px 6px',
                    borderRadius: '3px',
                  }}
                >
                  {item.shortcut}
                </span>
              )}
            </div>
          )}
        </React.Fragment>
      ))}

      <style>
        {`
          @keyframes context-menu-appear {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-4px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}
