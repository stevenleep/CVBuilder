/**
 * 二维码物料示例
 *
 * 展示如何创建一个二维码生成组件
 * 支持URL、文本、名片等多种内容类型
 */

import React, { useMemo } from 'react'
import type { IMaterialDefinition } from '../../src/core'

// 物料Props类型
interface IMaterialProps<T = any> {
  data?: T
  theme?: any
  materialContext?: any
}

/**
 * 二维码配置
 */
interface QRCodeConfig {
  content: string
  contentType: 'url' | 'text' | 'email' | 'phone' | 'vcard'
  size: number
  foregroundColor: string
  backgroundColor: string
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  showLogo: boolean
  logoUrl?: string
  logoSize: number
  label?: string
  labelPosition: 'top' | 'bottom'
}

/**
 * 二维码组件
 */
const QRCodeMaterial: React.FC<IMaterialProps<QRCodeConfig>> = ({ data, theme }) => {
  const config = data || {
    content: 'https://github.com/yourusername',
    contentType: 'url',
    size: 200,
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'M',
    showLogo: false,
    logoSize: 40,
    labelPosition: 'bottom',
  }

  // 格式化内容（预留功能，暂未使用）
  // const formattedContent = useMemo(() => {
  //   switch (config.contentType) {
  //     case 'email':
  //       return `mailto:${config.content}`
  //     case 'phone':
  //       return `tel:${config.content}`
  //     case 'url':
  //       return config.content.startsWith('http') ? config.content : `https://${config.content}`
  //     case 'vcard':
  //       // 简化的vCard格式
  //       return `BEGIN:VCARD\nVERSION:3.0\n${config.content}\nEND:VCARD`
  //     default:
  //       return config.content
  //   }
  // }, [config.content, config.contentType])

  // 生成二维码SVG（简化版，实际应用中建议使用qrcode库）
  const generateQRCode = () => {
    // 这里是简化的示例，实际应该使用专业的QR码生成库
    // 如 qrcode.react 或 qrcode
    const gridSize = 25 // 简化的网格大小
    const moduleSize = config.size / gridSize

    // 生成随机的QR码图案（实际应根据内容生成）
    const pattern = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => Math.random() > 0.5)
    )

    // 添加定位标记
    const addPositionMarker = (row: number, col: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            pattern[row + i][col + j] = true
          } else {
            pattern[row + i][col + j] = false
          }
        }
      }
    }

    // 添加三个定位标记
    addPositionMarker(0, 0) // 左上
    addPositionMarker(0, gridSize - 7) // 右上
    addPositionMarker(gridSize - 7, 0) // 左下

    return (
      <svg width={config.size} height={config.size} style={{ display: 'block' }}>
        {/* 背景 */}
        <rect width={config.size} height={config.size} fill={config.backgroundColor} />

        {/* QR码模块 */}
        {pattern.map((row, i) =>
          row.map((filled, j) => {
            if (!filled) return null

            // 如果显示Logo，在中心留空
            if (config.showLogo) {
              const centerStart = (gridSize - 7) / 2
              const centerEnd = (gridSize + 7) / 2
              if (i >= centerStart && i <= centerEnd && j >= centerStart && j <= centerEnd) {
                return null
              }
            }

            return (
              <rect
                key={`${i}-${j}`}
                x={j * moduleSize}
                y={i * moduleSize}
                width={moduleSize}
                height={moduleSize}
                fill={config.foregroundColor}
              />
            )
          })
        )}

        {/* Logo */}
        {config.showLogo && config.logoUrl && (
          <g>
            {/* Logo背景 */}
            <rect
              x={(config.size - config.logoSize) / 2}
              y={(config.size - config.logoSize) / 2}
              width={config.logoSize}
              height={config.logoSize}
              fill={config.backgroundColor}
              rx={4}
            />
            {/* Logo图片占位 */}
            <rect
              x={(config.size - config.logoSize) / 2 + 4}
              y={(config.size - config.logoSize) / 2 + 4}
              width={config.logoSize - 8}
              height={config.logoSize - 8}
              fill="#e5e7eb"
              rx={2}
            />
            <text
              x={config.size / 2}
              y={config.size / 2 + 4}
              fontSize="10"
              fill="#9ca3af"
              textAnchor="middle"
            >
              LOGO
            </text>
          </g>
        )}
      </svg>
    )
  }

  // 获取内容类型的图标和提示
  const getContentTypeInfo = () => {
    const iconSize = 16
    const iconColor = theme?.colors?.primary || '#3b82f6'

    switch (config.contentType) {
      case 'url':
        return {
          icon: (
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconColor}
            >
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ),
          label: '网址链接',
        }
      case 'email':
        return {
          icon: (
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconColor}
            >
              <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" />
              <path d="m3 7 9 6 9-6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ),
          label: '邮箱',
        }
      case 'phone':
        return {
          icon: (
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconColor}
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                strokeWidth="2"
              />
            </svg>
          ),
          label: '电话',
        }
      case 'vcard':
        return {
          icon: (
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconColor}
            >
              <rect x="2" y="7" width="20" height="15" rx="2" strokeWidth="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" strokeWidth="2" />
            </svg>
          ),
          label: '电子名片',
        }
      default:
        return {
          icon: (
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconColor}
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                strokeWidth="2"
              />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ),
          label: '文本',
        }
    }
  }

  const contentTypeInfo = getContentTypeInfo()

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '20px',
        backgroundColor: theme?.colors?.background || '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* 标签（顶部） */}
      {config.label && config.labelPosition === 'top' && (
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              fontSize: theme?.font?.bodySize?.normal || '14px',
              fontWeight: 600,
              color: theme?.colors?.text || '#333',
            }}
          >
            {config.label}
          </p>
        </div>
      )}

      {/* 二维码 */}
      <div
        style={{
          padding: '12px',
          backgroundColor: config.backgroundColor,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {generateQRCode()}
      </div>

      {/* 标签（底部） */}
      {config.label && config.labelPosition === 'bottom' && (
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              margin: 0,
              fontSize: theme?.font?.bodySize?.normal || '14px',
              fontWeight: 600,
              color: theme?.colors?.text || '#333',
            }}
          >
            {config.label}
          </p>
        </div>
      )}

      {/* 内容类型标识 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: theme?.colors?.backgroundSecondary || '#f9fafb',
          borderRadius: '16px',
        }}
      >
        {contentTypeInfo.icon}
        <span
          style={{
            fontSize: '12px',
            color: theme?.colors?.textSecondary || '#666',
          }}
        >
          {contentTypeInfo.label}
        </span>
      </div>

      {/* 提示文本 */}
      <p
        style={{
          margin: 0,
          fontSize: '11px',
          color: theme?.colors?.textSecondary || '#999',
          textAlign: 'center',
          maxWidth: config.size + 24,
        }}
      >
        扫描二维码查看内容
      </p>
    </div>
  )
}

/**
 * 物料定义
 */
export const QRCodeMaterialDefinition: IMaterialDefinition = {
  meta: {
    type: 'QRCode',
    title: '二维码',
    category: 'media',
    description: '生成二维码，支持URL、邮箱、电话、名片等',
    icon: 'qrcode',
    tags: ['二维码', 'QR', '扫描', '链接'],
    version: '1.0.0',
  },
  component: QRCodeMaterial,
  propsSchema: [
    {
      name: 'contentType',
      label: '内容类型',
      type: 'select',
      defaultValue: 'url',
      options: [
        { label: 'URL链接', value: 'url' },
        { label: '纯文本', value: 'text' },
        { label: '邮箱', value: 'email' },
        { label: '电话', value: 'phone' },
        { label: '电子名片', value: 'vcard' },
      ],
      group: '内容',
    },
    {
      name: 'content',
      label: '内容',
      type: 'textarea',
      defaultValue: 'https://github.com/yourusername',
      group: '内容',
    },
    {
      name: 'label',
      label: '标签文字',
      type: 'string',
      defaultValue: '',
      group: '内容',
    },
    {
      name: 'labelPosition',
      label: '标签位置',
      type: 'select',
      defaultValue: 'bottom',
      options: [
        { label: '顶部', value: 'top' },
        { label: '底部', value: 'bottom' },
      ],
      group: '内容',
    },
    {
      name: 'size',
      label: '尺寸',
      type: 'number',
      defaultValue: 200,
      group: '样式',
    },
    {
      name: 'foregroundColor',
      label: '前景色',
      type: 'color',
      defaultValue: '#000000',
      group: '样式',
    },
    {
      name: 'backgroundColor',
      label: '背景色',
      type: 'color',
      defaultValue: '#ffffff',
      group: '样式',
    },
    {
      name: 'errorCorrectionLevel',
      label: '容错级别',
      type: 'select',
      defaultValue: 'M',
      options: [
        { label: '低 (L)', value: 'L' },
        { label: '中 (M)', value: 'M' },
        { label: '四分位 (Q)', value: 'Q' },
        { label: '高 (H)', value: 'H' },
      ],
      group: '高级',
    },
    {
      name: 'showLogo',
      label: '显示Logo',
      type: 'boolean',
      defaultValue: false,
      group: '高级',
    },
    {
      name: 'logoUrl',
      label: 'Logo图片',
      type: 'image',
      defaultValue: '',
      group: '高级',
    },
    {
      name: 'logoSize',
      label: 'Logo尺寸',
      type: 'number',
      defaultValue: 40,
      group: '高级',
    },
  ],
  capabilities: {},
  defaultProps: {
    contentType: 'url',
    content: 'https://github.com/yourusername',
    size: 200,
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'M',
    showLogo: false,
    logoSize: 40,
    labelPosition: 'bottom',
  },
}

/**
 * 使用示例：
 *
 * ```typescript
 * import { materialRegistry } from '@/core'
 * import { QRCodeMaterialDefinition } from './examples/materials/QRCodeMaterial'
 *
 * // 注册物料
 * materialRegistry.register(QRCodeMaterialDefinition)
 *
 * // 使用物料
 * <QRCodeMaterial
 *   data={{
 *     contentType: 'url',
 *     content: 'https://yourwebsite.com',
 *     label: '扫码访问我的网站',
 *     size: 180,
 *   }}
 * />
 * ```
 */
