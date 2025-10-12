/**
 * 导出对话框 - 极简版
 */

import React, { useState } from 'react'
import { X } from 'lucide-react'

export interface ExportOptions {
  format: 'pdf' | 'png' | 'json'
  quality?: number
  scale?: number
  pageSize?: 'a4' | 'letter'
}

interface ExportPreviewDialogProps {
  onExport: (options: ExportOptions) => void
  onClose: () => void
}

export const ExportPreviewDialog: React.FC<ExportPreviewDialogProps> = ({ onExport, onClose }) => {
  const [format, setFormat] = useState<'pdf' | 'png' | 'json'>('pdf')

  const handleExport = () => {
    onExport({
      format,
      quality: 90,
      scale: 2,
      pageSize: 'a4',
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100001,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          width: '420px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#2d2d2d',
                margin: 0,
              }}
            >
              导出简历
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                border: 'none',
                borderRadius: '8px',
                background: 'transparent',
                color: '#999',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.color = '#666'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#999'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 格式选择 */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <FormatOption
              label="PDF 文档"
              description="适合打印和正式投递，支持多页"
              emoji="📄"
              active={format === 'pdf'}
              onClick={() => setFormat('pdf')}
            />
            <FormatOption
              label="PNG 图片"
              description="导出高清图片，适合在线预览"
              emoji="🖼️"
              active={format === 'png'}
              onClick={() => setFormat('png')}
            />
            <FormatOption
              label="JSON 数据"
              description="备份简历数据，可重新导入"
              emoji="💾"
              active={format === 'json'}
              onClick={() => setFormat('json')}
            />
          </div>

          {/* 导出按钮 */}
          <button
            onClick={handleExport}
            style={{
              width: '100%',
              marginTop: '24px',
              padding: '14px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: '#2d2d2d',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '700',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(45, 45, 45, 0.2)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1a1a1a'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(45, 45, 45, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#2d2d2d'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 45, 45, 0.2)'
            }}
          >
            开始导出
          </button>
        </div>
      </div>
    </div>
  )
}

// 格式选项
const FormatOption: React.FC<{
  label: string
  description: string
  emoji: string
  active: boolean
  onClick: () => void
}> = ({ label, description, emoji, active, onClick }) => {
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        padding: '18px 20px',
        border: `2px solid ${active ? '#2d2d2d' : hover ? '#e0e0e0' : '#f0f0f0'}`,
        borderRadius: '12px',
        backgroundColor: active ? '#fafafa' : hover ? '#f8f9fa' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: active ? '0 4px 12px rgba(45, 45, 45, 0.06)' : 'none',
      }}
    >
      <div
        style={{
          fontSize: '32px',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#2d2d2d',
            marginBottom: '4px',
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: '13px', color: '#999', lineHeight: 1.4 }}>{description}</div>
      </div>
      {active && (
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#2d2d2d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#fff',
            }}
          />
        </div>
      )}
    </button>
  )
}
