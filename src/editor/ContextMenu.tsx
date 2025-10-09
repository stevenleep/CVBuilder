/**
 * 右键菜单组件
 */

import React, { useEffect } from 'react'
import { IMaterialAction } from '@/core'
import { Copy, Trash2, MoveUp, MoveDown } from 'lucide-react'

interface ContextMenuProps {
  x: number
  y: number
  actions: IMaterialAction[]
  onClose: () => void
  onAction: (actionId: string) => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  actions,
  onClose,
  onAction,
}) => {
  useEffect(() => {
    const handleClick = () => onClose()
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        backgroundColor: 'white',
        border: '1px solid #f1f1f1',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '4px',
        minWidth: '180px',
        zIndex: 10000,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((action) => (
        <div
          key={action.id}
          onClick={() => {
            onAction(action.id)
            onClose()
          }}
          style={{
            padding: '8px 12px',
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'background 0.1s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fafafa'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {action.icon && <span>{action.icon}</span>}
          <span>{action.label}</span>
          {action.shortcut && (
            <span style={{ 
              marginLeft: 'auto', 
              fontSize: '11px', 
              color: '#999' 
            }}>
              {action.shortcut}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

