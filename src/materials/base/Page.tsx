/**
 * 页面容器物料（使用主题）- 支持真实分页
 */

import React, { useRef, useEffect, useState } from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { useViewport } from '@/core/context/ViewportContext'
import { useEditorStore } from '@/store/editorStore'
import { EmptyState } from '@/editor/EmptyState'

interface PageProps {
  children?: React.ReactNode
  style?: React.CSSProperties
}

/**
 * 单页容器 - 只负责渲染单个页面
 */
interface SinglePageProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  pageNumber?: number
  totalPages?: number
}

const SinglePage: React.FC<SinglePageProps> = ({
  children,
  style,
  pageNumber = 1,
  totalPages = 1,
}) => {
  const theme = useThemeConfig()
  const { viewportMode } = useViewport()
  const { mode } = useEditorStore()

  // 移动端适配样式
  const mobileStyle =
    viewportMode === 'mobile'
      ? {
          width: '100%',
          maxWidth: '375px',
          height: 'auto',
          minHeight: '600px',
          padding: '16px',
          margin: '0 auto',
          borderRadius: '8px',
        }
      : {}

  return (
    <div
      className="page-sheet"
      data-page={pageNumber}
      style={{
        width: `${theme.layout.pageWidth}mm`,
        height: `${theme.layout.pageMinHeight}mm`,
        backgroundColor: theme.color.background.page,
        padding: `${theme.spacing.page}px`,
        boxShadow:
          mode === 'edit'
            ? '0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)'
            : '0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        fontFamily: theme.font.family,
        color: theme.color.text.primary,
        lineHeight: theme.layout.lineHeight,
        position: 'relative',
        marginBottom: '24px',
        breakAfter: pageNumber < totalPages ? 'page' : 'auto',
        breakInside: 'avoid',
        boxSizing: 'border-box',
        transition: 'box-shadow 0.2s ease',
        ...mobileStyle,
        ...style,
      }}
    >
      {/* 内容区域 - 保持padding内的完整空间 */}
      <div
        style={{
          height: viewportMode === 'mobile' ? 'auto' : '100%',
          position: 'relative',
          overflow: viewportMode === 'mobile' ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>

      {/* 页码标识（绝对定位，不占用空间） - 仅编辑模式显示 */}
      {mode === 'edit' && totalPages > 1 && (
        <div
          data-no-print
          style={{
            position: 'absolute',
            top: '-14px',
            right: '8px',
            fontSize: '11px',
            fontWeight: '600',
            color: '#666',
            backgroundColor: '#ffffff',
            padding: '3px 10px',
            borderRadius: '4px 4px 0 0',
            border: '1px solid #e0e0e0',
            borderBottom: 'none',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 -2px 4px rgba(0,0,0,0.04)',
          }}
        >
          第 {pageNumber} 页 / 共 {totalPages} 页
        </div>
      )}
    </div>
  )
}

/**
 * 文档容器 - 自动分页管理
 */
const Page: React.FC<PageProps> = ({ children, style }) => {
  const theme = useThemeConfig()
  const { viewportMode } = useViewport()
  const { mode } = useEditorStore()
  const contentRef = useRef<HTMLDivElement>(null)
  const [pageCount, setPageCount] = useState(1)

  const pageHeightMm = theme.layout.pageMinHeight
  const pageHeightPx = (pageHeightMm / 25.4) * 96
  const availableHeight = pageHeightPx - theme.spacing.page * 2

  // 检查是否有子内容
  const hasChildren = React.Children.count(children) > 0

  // 计算需要的页数
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight
      // 移动端不分页，只显示一页
      const pages =
        viewportMode === 'mobile' ? 1 : Math.max(1, Math.ceil(contentHeight / availableHeight))
      setPageCount(pages)
    }
  }, [availableHeight, children, viewportMode])

  // 如果没有内容且在编辑模式，显示空状态
  if (!hasChildren && mode === 'edit') {
    return (
      <SinglePage pageNumber={1} totalPages={1} style={style}>
        <EmptyState
          message="开始创建你的简历"
          hint="从左侧物料库拖拽组件到这里，或点击组件快速添加"
        />
      </SinglePage>
    )
  }

  // 移动端简化渲染
  if (viewportMode === 'mobile') {
    return (
      <SinglePage pageNumber={1} totalPages={1} style={style}>
        {children}
      </SinglePage>
    )
  }

  return (
    <>
      {/* 隐藏的内容测量容器 */}
      <div
        ref={contentRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          width: `${theme.layout.pageWidth}mm`,
          padding: `${theme.spacing.page}px`,
          boxSizing: 'border-box',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        {children}
      </div>

      {/* 渲染每一页 - 垂直排列 */}
      {Array.from({ length: pageCount }, (_, pageIndex) => (
        <SinglePage key={pageIndex} pageNumber={pageIndex + 1} totalPages={pageCount} style={style}>
          {/* 每页都渲染完整内容，通过偏移显示对应部分 */}
          <div
            style={{
              position: 'relative',
              transform: `translateY(-${pageIndex * availableHeight}px)`,
            }}
          >
            {children}
          </div>
        </SinglePage>
      ))}
    </>
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
