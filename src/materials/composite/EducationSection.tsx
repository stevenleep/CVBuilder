/**
 * 完整教育背景区域（复合组件）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig, useStyleConfig } from '@/core/context/ThemeContext'

interface EducationSectionProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  title?: string
}

const EducationSection: React.FC<EducationSectionProps> = ({
  children,
  style,
  title = '教育背景',
}) => {
  const theme = useThemeConfig()
  const styleConfig = useStyleConfig()
  const hasChildren = React.Children.count(children) > 0

  return (
    <div style={{ marginBottom: `${theme.spacing.section}px`, ...style }}>
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
            拖拽"教育经历"组件到这里
          </div>
        )}
      </div>
    </div>
  )
}

export const EducationSectionMaterial: IMaterialDefinition = {
  meta: {
    type: 'EducationSection',
    title: '教育背景区域',
    description: '完整的教育背景章节',
    category: 'resume',
    subcategory: 'sections',
    isContainer: true,
    tags: ['章节', '教育', '学历'],
    version: '1.0.0',
  },
  component: EducationSection,
  propsSchema: [
    {
      name: 'title',
      label: '章节标题',
      type: 'string',
      defaultValue: '教育背景',
      group: '内容',
    },
  ],
  defaultProps: {
    title: '教育背景',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
    acceptChildren: ['EducationItem'],
  },
}
