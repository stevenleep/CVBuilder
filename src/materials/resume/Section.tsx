/**
 * 章节物料（使用主题）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig, useStyleConfig } from '@/core/context/ThemeContext'

interface SectionProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  title?: string
}

const Section: React.FC<SectionProps> = ({ children, style, title = '章节标题' }) => {
  const theme = useThemeConfig()
  const styleConfig = useStyleConfig()
  const hasChildren = React.Children.count(children) > 0

  // 判断是否使用卡片样式（背景色不同 + 有圆角）
  const isCardStyle =
    theme.color.background.section !== theme.color.background.page && styleConfig.borderRadius > 0

  // 基础样式
  const baseStyle: React.CSSProperties = {
    marginBottom: `${theme.spacing.section}px`,
  }

  // 卡片样式（先应用自定义 style，再应用卡片样式，确保卡片样式不被覆盖）
  const cardStyle: React.CSSProperties = isCardStyle
    ? {
        backgroundColor: theme.color.background.section,
        borderRadius: `${styleConfig.borderRadius}px`,
        padding: `${theme.spacing.paragraph * 2}px ${theme.spacing.paragraph * 2.5}px`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        transition: 'box-shadow 0.2s ease',
      }
    : {}

  // 合并样式：基础样式 -> 自定义样式 -> 卡片样式（卡片样式优先级最高）
  const finalStyle: React.CSSProperties = {
    ...baseStyle,
    ...style,
    ...cardStyle,
  }

  return (
    <div style={finalStyle}>
      <h2
        style={{
          fontSize: `${theme.font.titleSize.h2}px`,
          fontWeight: theme.font.weight.bold,
          margin: `0 0 ${theme.spacing.paragraph}px 0`,
          color: theme.color.text.primary,
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h2>

      {styleConfig.showSectionDivider && (
        <div
          style={{
            height: `${styleConfig.dividerThickness}px`,
            backgroundColor: theme.color.border.normal,
            marginBottom: `${theme.spacing.paragraph + 2}px`,
            borderStyle: styleConfig.dividerStyle,
          }}
        />
      )}

      <div
        style={{
          minHeight: hasChildren ? 'auto' : '60px',
          position: 'relative',
        }}
      >
        {children}
        {!hasChildren && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e0e0e0',
              fontSize: '11px',
              pointerEvents: 'none',
            }}
          >
            拖拽组件到这里
          </div>
        )}
      </div>
    </div>
  )
}

export const SectionMaterial: IMaterialDefinition = {
  meta: {
    type: 'Section',
    title: '章节容器',
    description: '用于组织简历内容区块',
    category: 'resume',
    subcategory: 'sections',
    icon: '📋',
    isContainer: true,
    tags: ['简历', '章节', '容器'],
    version: '1.0.0',
  },
  component: Section,
  propsSchema: [
    {
      name: 'title',
      label: '标题',
      type: 'string',
      defaultValue: '章节标题',
      required: true,
      group: '内容',
    },
  ],
  defaultProps: {
    title: '章节标题',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
