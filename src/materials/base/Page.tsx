/**
 * 页面容器物料（使用主题）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'

interface PageProps {
  children?: React.ReactNode
  style?: React.CSSProperties
}

const Page: React.FC<PageProps> = ({ 
  children, 
  style,
}) => {
  const theme = useThemeConfig()
  
  return (
    <div
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
        ...style,
      }}
    >
      {children}
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
