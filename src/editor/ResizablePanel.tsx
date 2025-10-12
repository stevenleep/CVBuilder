/**
 * 可调整宽度的面板
 *
 * Figma风格的拖拽调整
 */

import React, { useState, useRef, useEffect } from 'react'

interface ResizablePanelProps {
  children: React.ReactNode
  side: 'left' | 'right'
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  side,
  defaultWidth = 240,
  minWidth = 200,
  maxWidth = 400,
}) => {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return

      const panelRect = panelRef.current.getBoundingClientRect()

      let newWidth: number
      if (side === 'left') {
        newWidth = e.clientX - panelRect.left
      } else {
        newWidth = panelRect.right - e.clientX
      }

      // 限制宽度范围
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, side, minWidth, maxWidth])

  const handleMouseDown = () => {
    setIsResizing(true)
    document.body.style.cursor = side === 'left' ? 'ew-resize' : 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  return (
    <div
      ref={panelRef}
      style={{
        width: `${width}px`,
        height: '100%',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {children}

      {/* 拖拽手柄 */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          [side === 'left' ? 'right' : 'left']: '-3px',
          top: 0,
          bottom: 0,
          width: '6px',
          cursor: 'ew-resize',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={e => {
          if (!isResizing) {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'
          }
        }}
        onMouseLeave={e => {
          if (!isResizing) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        {isResizing && (
          <div
            style={{
              width: '2px',
              height: '40px',
              backgroundColor: '#000',
              borderRadius: '1px',
            }}
          />
        )}
      </div>
    </div>
  )
}
