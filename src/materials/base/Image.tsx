/**
 * 图片物料
 */

import React from 'react'
import { IMaterialDefinition } from '@/core'

interface ImageProps {
  style?: React.CSSProperties
  src?: string
  alt?: string
  width?: number
  height?: number
  objectFit?: 'cover' | 'contain' | 'fill'
  align?: 'left' | 'center' | 'right'
}

const Image: React.FC<ImageProps> = ({
  style,
  src = '',
  alt = '图片',
  width = 100,
  height = 100,
  objectFit = 'cover',
  align = 'left',
}) => {
  return (
    <div
      style={{
        textAlign: align,
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: width ? `${width}px` : 'auto',
            height: height ? `${height}px` : 'auto',
            objectFit,
            borderRadius: '4px',
          }}
        />
      ) : (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ccc',
            fontSize: '12px',
          }}
        >
          图片
        </div>
      )}
    </div>
  )
}

export const ImageMaterial: IMaterialDefinition = {
  meta: {
    type: 'Image',
    title: '图片',
    description: '插入图片',
    category: 'base',
    tags: ['基础', '图片', '媒体'],
    version: '1.0.0',
  },
  component: Image,
  propsSchema: [
    {
      name: 'src',
      label: '图片',
      type: 'image',
      defaultValue: '',
      required: true,
      group: '内容',
    },
    {
      name: 'alt',
      label: '替代文本',
      type: 'string',
      defaultValue: '图片',
      group: '内容',
    },
    {
      name: 'width',
      label: '宽度(px)',
      type: 'number',
      defaultValue: 100,
      group: '尺寸',
    },
    {
      name: 'height',
      label: '高度(px)',
      type: 'number',
      defaultValue: 100,
      group: '尺寸',
    },
    {
      name: 'objectFit',
      label: '填充方式',
      type: 'select',
      defaultValue: 'cover',
      options: [
        { label: '覆盖', value: 'cover' },
        { label: '包含', value: 'contain' },
        { label: '填充', value: 'fill' },
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
    src: '',
    alt: '图片',
    width: 100,
    height: 100,
    objectFit: 'cover',
    align: 'left',
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
  },
}
