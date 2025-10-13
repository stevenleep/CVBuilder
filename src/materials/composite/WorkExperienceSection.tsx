/**
 * 完整工作经历区域（复合组件）
 *
 * 包含章节标题和多个工作经历条目
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig, useStyleConfig } from '@/core/context/ThemeContext'

interface WorkExperienceSectionProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  title?: string
}

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  children,
  style,
  title = '工作经历',
}) => {
  const theme = useThemeConfig()
  const styleConfig = useStyleConfig()
  const hasChildren = React.Children.count(children) > 0

  // 判断是否使用卡片样式（只有"创意破局"主题使用卡片样式）
  const isCardStyle = theme.id === 'breakthrough' && styleConfig.borderRadius > 0

  // 基础样式
  const baseStyle: React.CSSProperties = {
    marginBottom: `${theme.spacing.section}px`,
  }

  // 卡片样式
  const cardStyle: React.CSSProperties = isCardStyle
    ? {
        backgroundColor: theme.color.background.section,
        borderRadius: `${styleConfig.borderRadius}px`,
        padding: `${theme.spacing.paragraph * 2.4}px ${theme.spacing.paragraph * 3}px`,
        boxShadow:
          '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02), 0 8px 24px rgba(0, 102, 255, 0.03)',
        transition: 'box-shadow 0.2s ease',
      }
    : {}

  // 合并样式
  const finalStyle: React.CSSProperties = {
    ...baseStyle,
    ...style,
    ...cardStyle,
  }

  return (
    <div style={finalStyle}>
      {/* 章节标题 */}
      <h2
        style={{
          fontSize: `${theme.font.titleSize.h2}px`,
          fontWeight: theme.font.weight.bold,
          margin: `0 0 ${theme.spacing.paragraph - 2}px 0`,
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

      {/* 内容区域 */}
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
            拖拽"工作经历"组件到这里
          </div>
        )}
      </div>
    </div>
  )
}

export const WorkExperienceSectionMaterial: IMaterialDefinition = {
  meta: {
    type: 'WorkExperienceSection',
    title: '工作经历区域',
    description: '完整的工作经历章节',
    category: 'resume',
    subcategory: 'sections',
    isContainer: true,
    tags: ['章节', '工作', '经历'],
    version: '1.0.0',
  },
  component: WorkExperienceSection,
  propsSchema: [
    {
      name: 'title',
      label: '章节标题',
      type: 'string',
      defaultValue: '工作经历',
      group: '内容',
    },
  ],
  defaultProps: {
    title: '工作经历',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
    acceptChildren: ['ExperienceItem'],
  },
}
