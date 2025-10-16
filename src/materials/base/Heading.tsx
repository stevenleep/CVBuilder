/**
 * 标题物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { useViewport } from '@/core/context/ViewportContext'
import { notification } from '@/utils/notification'

interface HeadingProps {
  style?: React.CSSProperties
  text?: string
  level?: '1' | '2' | '3'
  align?: 'left' | 'center' | 'right'
}

const Heading: React.FC<HeadingProps> = ({
  style,
  text = '标题文本',
  level = '2',
  align = 'left',
}) => {
  const theme = useThemeConfig()
  const { viewportMode } = useViewport()

  // 根据视口模式调整字体大小
  const getFontSize = () => {
    const baseFontSize =
      level === '1'
        ? theme.font.titleSize.h1
        : level === '2'
          ? theme.font.titleSize.h2
          : theme.font.titleSize.h3

    // 移动端字体稍微小一些
    return viewportMode === 'mobile' ? baseFontSize * 0.9 : baseFontSize
  }

  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return React.createElement(
    Tag,
    {
      style: {
        fontSize: `${getFontSize()}px`,
        fontWeight: theme.font.weight.bold,
        color: theme.color.text.primary,
        margin: 0,
        textAlign: align,
        // 移动端样式调整 - 遵循主题间距设置
        ...(viewportMode === 'mobile' && {
          lineHeight: 1.3,
          marginTop: `${theme.spacing.item}px`,
          marginBottom: `${theme.spacing.item}px`,
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'normal',
          maxWidth: '100%',
        }),
        ...style,
      },
    },
    text
  )
}

// 移动端专用组件
const MobileHeading: React.FC<HeadingProps> = ({
  style,
  text = '标题文本',
  level = '2',
  align = 'left',
}) => {
  const theme = useThemeConfig()

  const fontSize =
    level === '1'
      ? theme.font.titleSize.h1 * 0.8
      : level === '2'
        ? theme.font.titleSize.h2 * 0.8
        : theme.font.titleSize.h3 * 0.8

  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return React.createElement(
    Tag,
    {
      style: {
        fontSize: `${fontSize}px`,
        fontWeight: theme.font.weight.bold,
        color: theme.color.text.primary,
        margin: 0,
        textAlign: align,
        lineHeight: 1.2,
        marginTop: `${theme.spacing.item}px`,
        marginBottom: `${theme.spacing.item}px`,
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'normal',
        maxWidth: '100%',
        ...style,
      },
    },
    text
  )
}

export const HeadingMaterial: IMaterialDefinition = {
  meta: {
    type: 'Heading',
    title: '标题',
    description: '各级标题文本',
    category: 'base',
    tags: ['基础', '标题', '文本'],
    version: '1.0.0',
  },
  component: Heading,
  mobileComponent: MobileHeading,
  propsSchema: [
    {
      name: 'text',
      label: '标题内容',
      type: 'string',
      defaultValue: '标题文本',
      required: true,
      group: '内容',
    },
    {
      name: 'level',
      label: '标题级别',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: 'H1 - 一级标题', value: '1' },
        { label: 'H2 - 二级标题', value: '2' },
        { label: 'H3 - 三级标题', value: '3' },
      ],
      group: '样式',
    },
    {
      name: 'align',
      label: '对齐',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
      ],
      group: '样式',
    },
  ],
  defaultProps: {
    text: '标题文本',
    level: '2',
    align: 'left',
  },
  mobileDefaultStyle: {
    fontSize: '18px',
    lineHeight: 1.2,
    marginTop: '12px',
    marginBottom: '12px',
    maxWidth: '100%',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
  onDoubleClick: async context => {
    const newText = await notification.prompt({
      title: '编辑标题',
      message: '请输入标题文本',
      defaultValue: context.props.text as string,
    })
    if (newText !== null) {
      const api = context.getEditorAPI()
      api.updateNodeProps(context.nodeId, { text: newText })
    }
  },
}
