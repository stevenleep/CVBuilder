/**
 * 导出预览对话框
 * 
 * 在导出前提供预览和配置选项
 */

import React, { useState } from 'react'
import { X, FileImage, FileText, FileDown, Settings } from 'lucide-react'

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

export const ExportPreviewDialog: React.FC<ExportPreviewDialogProps> = ({
  onExport,
  onClose,
}) => {
  const [format, setFormat] = useState<'pdf' | 'png' | 'json'>('pdf')
  const [quality, setQuality] = useState(90)
  const [scale, setScale] = useState(2)
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4')

  const handleExport = () => {
    onExport({
      format,
      quality,
      scale,
      pageSize,
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100001,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#2d2d2d',
          borderRadius: '12px',
          padding: '0',
          maxWidth: '580px',
          width: '100%',
          maxHeight: '85vh',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          border: '1px solid #4a4a4a',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid #444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <FileDown size={22} />
              导出简历
            </h2>
            <p style={{ fontSize: '13px', color: '#aaa', margin: 0 }}>
              选择导出格式和配置选项
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
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
              e.currentTarget.style.backgroundColor = '#3d3d3d'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div style={{ padding: '24px 28px', flex: 1, overflow: 'auto' }}>
          {/* 格式选择 */}
          <div style={{ marginBottom: '28px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '14px',
              }}
            >
              导出格式
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <FormatOption
                icon={<FileText size={24} />}
                label="PDF"
                description="适合打印"
                active={format === 'pdf'}
                onClick={() => setFormat('pdf')}
              />
              <FormatOption
                icon={<FileImage size={24} />}
                label="PNG"
                description="高清图片"
                active={format === 'png'}
                onClick={() => setFormat('png')}
              />
              <FormatOption
                icon={<Settings size={24} />}
                label="JSON"
                description="数据备份"
                active={format === 'json'}
                onClick={() => setFormat('json')}
              />
            </div>
          </div>

          {/* 格式特定选项 */}
          {(format === 'pdf' || format === 'png') && (
            <>
              {/* 质量设置 */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '12px',
                  }}
                >
                  <span>图片质量</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>
                    {quality}%
                  </span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    accentColor: '#3b82f6',
                    cursor: 'pointer',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#999',
                    marginTop: '8px',
                  }}
                >
                  <span>较小文件</span>
                  <span>高质量</span>
                </div>
              </div>

              {/* 缩放比例 */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '12px',
                  }}
                >
                  <span>清晰度</span>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>
                    {scale}x
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.5"
                  value={scale}
                  onChange={e => setScale(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    accentColor: '#3b82f6',
                    cursor: 'pointer',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#999',
                    marginTop: '8px',
                  }}
                >
                  <span>标准</span>
                  <span>超清</span>
                </div>
              </div>
            </>
          )}

          {format === 'pdf' && (
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '12px',
                }}
              >
                页面尺寸
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <PageSizeOption
                  label="A4"
                  size="210 × 297 mm"
                  active={pageSize === 'a4'}
                  onClick={() => setPageSize('a4')}
                />
                <PageSizeOption
                  label="Letter"
                  size="8.5 × 11 in"
                  active={pageSize === 'letter'}
                  onClick={() => setPageSize('letter')}
                />
              </div>
            </div>
          )}

          {/* 提示信息 */}
          <div
            style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '6px' }}>
              💡 温馨提示
            </div>
            <div style={{ fontSize: '12px', color: '#bbb', lineHeight: '1.6' }}>
              {format === 'pdf' && '导出PDF适合打印和正式投递，会保持最佳的排版效果'}
              {format === 'png' && '导出PNG图片适合在线预览和社交媒体分享'}
              {format === 'json' && '导出JSON数据可以备份简历内容，稍后重新导入'}
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div
          style={{
            padding: '20px 28px',
            borderTop: '1px solid #444',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              border: '1px solid #555',
              borderRadius: '6px',
              backgroundColor: '#3a3a3a',
              color: '#ccc',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#4a4a4a'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#3a3a3a'
            }}
          >
            取消
          </button>
          <button
            onClick={handleExport}
            style={{
              padding: '10px 32px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#fff',
              color: '#2d2d2d',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#fff'
            }}
          >
            <FileDown size={18} />
            开始导出
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}

const FormatOption: React.FC<{
  icon: React.ReactNode
  label: string
  description: string
  active: boolean
  onClick: () => void
}> = ({ icon, label, description, active, onClick }) => {
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: '120px',
        padding: '18px 12px',
        border: '2px solid #555',
        borderRadius: '10px',
        backgroundColor: active ? '#3a3a3a' : hover ? '#2a2a2a' : '#1a1a1a',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: active
          ? '0 0 0 2px rgba(255, 255, 255, 0.3), 0 4px 12px rgba(255, 255, 255, 0.1)'
          : 'none',
      }}
    >
      <div style={{ color: active ? '#fff' : '#888', marginBottom: '10px' }}>{icon}</div>
      <div
        style={{
          fontSize: '15px',
          fontWeight: '700',
          color: active ? '#fff' : '#ccc',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '11px', color: active ? '#bbb' : '#666' }}>{description}</div>
    </button>
  )
}

const PageSizeOption: React.FC<{
  label: string
  size: string
  active: boolean
  onClick: () => void
}> = ({ label, size, active, onClick }) => {
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: '72px',
        padding: '14px 16px',
        border: '2px solid #555',
        borderRadius: '8px',
        backgroundColor: active ? '#3a3a3a' : hover ? '#2a2a2a' : '#1a1a1a',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: active ? '0 0 0 2px rgba(255, 255, 255, 0.3)' : 'none',
      }}
    >
      <div
        style={{
          fontSize: '15px',
          fontWeight: '700',
          color: active ? '#fff' : '#ccc',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '12px', color: active ? '#aaa' : '#666' }}>{size}</div>
    </button>
  )
}

