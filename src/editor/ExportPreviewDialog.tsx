/**
 * 导出对话框 - 精美小巧版
 */

import React, { useState } from 'react'
import { X, Download, FileText, Image, Database, Globe } from 'lucide-react'

export interface ExportOptions {
  format: 'pdf' | 'png' | 'json' | 'html'
  quality?: number
  scale?: number
  pageSize?: 'a4' | 'letter'
  htmlVersion?: 'html5' | 'pc' // HTML导出版本
}

interface ExportPreviewDialogProps {
  onExport: (options: ExportOptions) => void
  onClose: () => void
  initialFormat?: 'pdf' | 'png' | 'json' | 'html' // 初始格式
}

export const ExportPreviewDialog: React.FC<ExportPreviewDialogProps> = ({
  onExport,
  onClose,
  initialFormat = 'pdf',
}) => {
  const [format, setFormat] = useState<'pdf' | 'png' | 'json' | 'html'>(initialFormat)
  const [htmlVersion, setHtmlVersion] = useState<'html5' | 'pc'>('html5')

  const handleExport = () => {
    onExport({
      format,
      quality: 90,
      scale: 2,
      pageSize: 'a4',
      htmlVersion: format === 'html' ? htmlVersion : undefined,
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
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          width: '340px',
          maxWidth: '90vw',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          animation: 'slideUp 0.2s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div
          style={{
            padding: '18px 18px 14px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#2d2d2d',
                margin: 0,
                letterSpacing: '-0.3px',
              }}
            >
              导出简历
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '28px',
                height: '28px',
                border: 'none',
                borderRadius: '6px',
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
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 格式选择 */}
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <FormatOption
              label="网页"
              icon={<Globe size={18} strokeWidth={2} />}
              active={format === 'html'}
              onClick={() => setFormat('html')}
            />
            <FormatOption
              label="PDF"
              icon={<FileText size={18} strokeWidth={2} />}
              active={format === 'pdf'}
              onClick={() => setFormat('pdf')}
            />
            <FormatOption
              label="PNG"
              icon={<Image size={18} strokeWidth={2} />}
              active={format === 'png'}
              onClick={() => setFormat('png')}
            />
            <FormatOption
              label="JSON"
              icon={<Database size={18} strokeWidth={2} />}
              active={format === 'json'}
              onClick={() => setFormat('json')}
            />
          </div>

          {/* HTML版本选择 */}
          {format === 'html' && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#f8f8f8',
                borderRadius: '8px',
                border: '1px solid #e8e8e8',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                }}
              >
                选择版本
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setHtmlVersion('html5')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: `1.5px solid ${htmlVersion === 'html5' ? '#2d2d2d' : '#d0d0d0'}`,
                    borderRadius: '6px',
                    backgroundColor: htmlVersion === 'html5' ? '#2d2d2d' : '#fff',
                    color: htmlVersion === 'html5' ? '#fff' : '#666',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                  }}
                >
                  HTML5
                </button>
                <button
                  onClick={() => setHtmlVersion('pc')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: `1.5px solid ${htmlVersion === 'pc' ? '#2d2d2d' : '#d0d0d0'}`,
                    borderRadius: '6px',
                    backgroundColor: htmlVersion === 'pc' ? '#2d2d2d' : '#fff',
                    color: htmlVersion === 'pc' ? '#fff' : '#666',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                  }}
                >
                  PC版
                </button>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#999',
                  marginTop: '8px',
                  lineHeight: '1.4',
                }}
              >
                {htmlVersion === 'html5'
                  ? '✓ 移动端专属排版 · 连续滚动阅读 · 深色模式支持'
                  : '✓ 桌面浏览器 · A4纸张大小 · 打印友好'}
              </div>
            </div>
          )}

          {/* 导出按钮 */}
          <button
            onClick={handleExport}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '10px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#2d2d2d',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(45, 45, 45, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1a1a1a'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 45, 45, 0.25)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#2d2d2d'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(45, 45, 45, 0.15)'
            }}
          >
            <Download size={14} strokeWidth={2.5} />
            导出{' '}
            {format === 'html'
              ? '网页'
              : format === 'pdf'
                ? 'PDF'
                : format === 'png'
                  ? 'PNG'
                  : 'JSON'}
          </button>
        </div>

        {/* 添加CSS动画 */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  )
}

// 格式选项
const FormatOption: React.FC<{
  label: string
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}> = ({ label, icon, active, onClick }) => {
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        padding: '10px 12px',
        border: `1.5px solid ${active ? '#2d2d2d' : hover ? '#d0d0d0' : '#e8e8e8'}`,
        borderRadius: '8px',
        backgroundColor: active ? '#fafafa' : hover ? '#fafafa' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        position: 'relative',
      }}
    >
      {/* 图标 */}
      <div
        style={{
          flexShrink: 0,
          color: active ? '#2d2d2d' : '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>

      {/* 文本 */}
      <span
        style={{
          flex: 1,
          fontSize: '14px',
          fontWeight: active ? '600' : '500',
          color: '#2d2d2d',
          textAlign: 'left',
        }}
      >
        {label}
      </span>

      {/* 选中指示器 */}
      {active && (
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#2d2d2d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  )
}
