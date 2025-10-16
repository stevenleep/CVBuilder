/**
 * 两栏布局物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useViewport } from '@/core/context/ViewportContext'

interface TwoColumnLayoutProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  leftWidth?: number
  gap?: number
  align?: 'top' | 'center' | 'bottom'
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({
  children,
  style,
  leftWidth = 30,
  gap = 16,
  align = 'top',
}) => {
  const { viewportMode } = useViewport()
  const childArray = React.Children.toArray(children)
  const leftChild = childArray[0]
  const rightChild = childArray[1]

  const alignItems = align === 'center' ? 'center' : align === 'bottom' ? 'flex-end' : 'flex-start'

  // 移动端适配
  const mobileStyle =
    viewportMode === 'mobile'
      ? {
          flexDirection: 'column' as const, // 移动端改为列布局
          gap: `${Math.max(gap * 0.8, 12)}px`, // 移动端间距调整
        }
      : {}

  return (
    <div
      style={{
        display: 'flex',
        gap: `${gap}px`,
        alignItems,
        ...mobileStyle,
        ...style,
      }}
    >
      <div
        style={{
          width: viewportMode === 'mobile' ? '100%' : `${leftWidth}%`,
          flexShrink: 0,
        }}
      >
        {leftChild}
      </div>
      <div
        style={{
          flex: viewportMode === 'mobile' ? 'none' : 1,
          width: viewportMode === 'mobile' ? '100%' : 'auto',
        }}
      >
        {rightChild}
      </div>
    </div>
  )
}

export const TwoColumnLayoutMaterial: IMaterialDefinition = {
  meta: {
    type: 'TwoColumnLayout',
    title: '两栏布局',
    description: '左右两栏分栏布局',
    category: 'base',
    isContainer: true,
    tags: ['布局', '分栏'],
    version: '1.0.0',
  },
  component: TwoColumnLayout,
  propsSchema: [
    {
      name: 'leftWidth',
      label: '左侧宽度(%)',
      type: 'number',
      defaultValue: 30,
      group: '布局',
    },
    {
      name: 'gap',
      label: '间距',
      type: 'number',
      defaultValue: 16,
      group: '布局',
    },
    {
      name: 'align',
      label: '垂直对齐',
      type: 'select',
      defaultValue: 'top',
      options: [
        { label: '顶部', value: 'top' },
        { label: '居中', value: 'center' },
        { label: '底部', value: 'bottom' },
      ],
      group: '布局',
    },
  ],
  defaultProps: {
    leftWidth: 30,
    gap: 16,
    align: 'top',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
    minChildren: 0,
    maxChildren: 2,
  },
}
