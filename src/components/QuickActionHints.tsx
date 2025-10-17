/**
 * 快捷操作提示组件
 * 
 * 首次使用时展示常用功能和快捷键提示
 */

import React, { useEffect, useState } from 'react'
import { X, Zap, Command, Save, Eye, Undo, Download } from 'lucide-react'

const HINTS_SHOWN_KEY = 'cv-builder-quick-hints-shown'

export const QuickActionHints: React.FC = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // 检查是否已经显示过
    const hasShown = localStorage.getItem(HINTS_SHOWN_KEY)
    if (!hasShown) {
      // 延迟3秒显示，让用户先适应界面
      const timer = setTimeout(() => {
        setShow(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem(HINTS_SHOWN_KEY, 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)',
        zIndex: 10000,
        animation: 'scaleIn 0.3s ease-out',
      }}
    >
      <style>
        {`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      {/* 头部 */}
      <div
        style={{
          padding: '24px 24px 20px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Zap size={24} color="#fff" strokeWidth={2.5} />
          </div>

          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#2d2d2d',
                marginBottom: '6px',
              }}
            >
              ⚡ 快速上手指南
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: '#666',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              掌握这些快捷操作，让简历编辑事半功倍
            </p>
          </div>

          <button
            onClick={handleClose}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: '#999',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'
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

      {/* 提示列表 */}
      <div style={{ padding: '20px 24px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          <HintItem
            icon={<Save size={18} />}
            title="自动保存"
            description="编辑内容自动保存到浏览器"
            shortcut="Cmd/Ctrl + S"
            color="#10b981"
          />

          <HintItem
            icon={<Undo size={18} />}
            title="撤销重做"
            description="支持多次撤销和重做操作"
            shortcut="Cmd/Ctrl + Z"
            color="#f59e0b"
          />

          <HintItem
            icon={<Eye size={18} />}
            title="预览模式"
            description="随时切换预览最终效果"
            shortcut="点击工具栏"
            color="#3b82f6"
          />

          <HintItem
            icon={<Download size={18} />}
            title="快速导出"
            description="导出PDF和JSON备份"
            shortcut="右下角按钮"
            color="#8b5cf6"
          />

          <HintItem
            icon={<Command size={18} />}
            title="快捷键"
            description="查看所有快捷键"
            shortcut="Cmd/Ctrl + /"
            color="#ec4899"
          />

          <HintItem
            icon={<Zap size={18} />}
            title="拖拽添加"
            description="从左侧拖拽组件到画布"
            shortcut="鼠标拖拽"
            color="#06b6d4"
          />
        </div>
      </div>

      {/* 底部按钮 */}
      <div
        style={{
          padding: '16px 24px 24px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={handleClose}
          style={{
            padding: '12px 32px',
            border: 'none',
            borderRadius: '10px',
            backgroundColor: '#2d2d2d',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#1a1a1a'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(45, 45, 45, 0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#2d2d2d'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          开始使用
        </button>
      </div>

      {/* 遮罩层 */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: -1,
          animation: 'fadeIn 0.3s ease-out',
        }}
      />
    </div>
  )
}

// 提示项
const HintItem: React.FC<{
  icon: React.ReactNode
  title: string
  description: string
  shortcut: string
  color: string
}> = ({ icon, title, description, shortcut, color }) => {
  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#2d2d2d',
              marginBottom: '2px',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: '#666',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      <div
        style={{
          padding: '6px 10px',
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '600',
          color: '#666',
          fontFamily: 'monospace',
          textAlign: 'center',
        }}
      >
        {shortcut}
      </div>
    </div>
  )
}

