/**
 * 容器物料
 * 
 * 通用布局容器
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'

interface ContainerProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  direction?: 'row' | 'column'
  gap?: number
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  style,
  direction = 'column',
  gap = 16,
  align = 'stretch',
  justify = 'flex-start',
}) => {
  const hasChildren = React.Children.count(children) > 0
  
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: `${gap}px`,
        alignItems: align,
        justifyContent: justify,
        minHeight: hasChildren ? 'auto' : '60px',
        position: 'relative',
        ...style,
      }}
    >
      {children}
      {!hasChildren && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e0e0e0',
          fontSize: '11px',
          pointerEvents: 'none',
        }}>
          拖拽组件到这里
        </div>
      )}
    </div>
  )
}

export const ContainerMaterial: IMaterialDefinition = {
  meta: {
    type: 'Container',
    title: '布局容器',
    description: '用于组织和排列子组件',
    category: 'base',
    icon: '📦',
    isContainer: true,
    tags: ['容器', '布局', '基础'],
    version: '1.0.0',
  },
  component: Container,
  propsSchema: [
    {
      name: 'direction',
      label: '方向',
      type: 'select',
      defaultValue: 'column',
      options: [
        { label: '垂直', value: 'column' },
        { label: '水平', value: 'row' },
      ],
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
      label: '对齐方式',
      type: 'select',
      defaultValue: 'stretch',
      options: [
        { label: '起始', value: 'flex-start' },
        { label: '居中', value: 'center' },
        { label: '结束', value: 'flex-end' },
        { label: '拉伸', value: 'stretch' },
      ],
      group: '布局',
    },
    {
      name: 'justify',
      label: '主轴对齐',
      type: 'select',
      defaultValue: 'flex-start',
      options: [
        { label: '起始', value: 'flex-start' },
        { label: '居中', value: 'center' },
        { label: '结束', value: 'flex-end' },
        { label: '两端对齐', value: 'space-between' },
        { label: '环绕对齐', value: 'space-around' },
      ],
      group: '布局',
    },
  ],
  defaultProps: {
    direction: 'column',
    gap: 16,
    align: 'stretch',
    justify: 'flex-start',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    lockable: true,
    canBeChild: true,
  },
}
