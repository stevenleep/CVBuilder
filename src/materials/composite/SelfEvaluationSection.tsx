/**
 * 自我评价区域（复合组件）
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig, useStyleConfig } from '@/core/context/ThemeContext'

interface SelfEvaluationSectionProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  title?: string
}

const SelfEvaluationSection: React.FC<SelfEvaluationSectionProps> = ({
  children,
  style,
  title = '自我评价',
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
            拖拽"自我评价"组件到这里
          </div>
        )}
      </div>
    </div>
  )
}

export const SelfEvaluationSectionMaterial: IMaterialDefinition = {
  meta: {
    type: 'SelfEvaluationSection',
    title: '自我评价区域',
    description: '完整的自我评价章节',
    category: 'resume',
    subcategory: 'sections',
    isContainer: true,
    tags: ['章节', '评价'],
    version: '1.0.0',
  },
  component: SelfEvaluationSection,
  propsSchema: [
    {
      name: 'title',
      label: '章节标题',
      type: 'string',
      defaultValue: '自我评价',
      group: '内容',
    },
  ],
  defaultProps: {
    title: '自我评价',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
    acceptChildren: ['SelfEvaluation', 'TextBlock', 'RichTextBlock'],
  },
}
