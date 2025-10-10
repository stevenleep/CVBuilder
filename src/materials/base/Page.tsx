/**
 * 页面容器物料（使用主题）
 */

import React, { useRef, useEffect, useState } from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { useEditorStore } from '@/store/editorStore'

interface PageProps {
  children?: React.ReactNode
  style?: React.CSSProperties
}

const Page: React.FC<PageProps> = ({ children, style }) => {
  const theme = useThemeConfig()
  const { mode } = useEditorStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const [pageBreaks, setPageBreaks] = useState<number[]>([])

  // 计算分页位置
  useEffect(() => {
    if (mode === 'edit' && containerRef.current) {
      const pageHeightMm = theme.layout.pageMinHeight
      const pageHeightPx = (pageHeightMm / 25.4) * 96 // 转换为像素（96 DPI）

      // 计算需要多少条分页线
      const containerHeight = containerRef.current.scrollHeight
      const breaks: number[] = []

      let currentBreak = pageHeightPx
      while (currentBreak < containerHeight) {
        breaks.push(currentBreak)
        currentBreak += pageHeightPx
      }

      setPageBreaks(breaks)
    } else {
      setPageBreaks([])
    }
  }, [mode, theme.layout.pageMinHeight, children])

  return (
    <div
      ref={containerRef}
      style={{
        width: `${theme.layout.pageWidth}mm`,
        minHeight: `${theme.layout.pageMinHeight}mm`,
        backgroundColor: theme.color.background.page,
        padding: `${theme.spacing.page}px`,
        margin: '0 auto',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.04)',
        fontFamily: theme.font.family,
        color: theme.color.text.primary,
        lineHeight: theme.layout.lineHeight,
        position: 'relative',
        ...style,
      }}
    >
      {children}

      {/* 分页标记线 - 仅在编辑模式显示 */}
      {mode === 'edit' &&
        pageBreaks.map((breakPosition, index) => (
          <div
            key={index}
            data-no-print
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${breakPosition}px`,
              height: '0',
              borderTop: '2px dashed #ff6b6b',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '8px',
                top: '-12px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#ff6b6b',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '2px 8px',
                borderRadius: '3px',
                border: '1px solid #ff6b6b',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              第 {index + 1} 页结束
            </div>
          </div>
        ))}
    </div>
  )
}

export const PageMaterial: IMaterialDefinition = {
  meta: {
    type: 'Page',
    title: 'A4页面',
    description: '标准A4纸张大小的页面容器',
    category: 'system', // 改为system分类，不在物料面板显示
    icon: '📄',
    isContainer: true,
    tags: ['容器', '页面', '基础'],
    version: '1.0.0',
  },
  component: Page,
  propsSchema: [],
  defaultProps: {},
  capabilities: {
    copyable: false,
    deletable: false,
    moveable: false,
    lockable: false,
    canBeChild: false,
  },
}
