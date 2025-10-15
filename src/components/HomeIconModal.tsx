/**
 * 首页图标点击提示窗口
 *
 * 当用户点击首页图标时显示的返回确认提示
 */

import React from 'react'
import { X, Home } from 'lucide-react'

interface HomeIconModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const HomeIconModal: React.FC<HomeIconModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          animation: 'modalSlideIn 0.3s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#f5f5f5',
            color: '#666',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#e0e0e0'
            e.currentTarget.style.color = '#333'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
            e.currentTarget.style.color = '#666'
          }}
        >
          <X size={16} />
        </button>

        {/* 内容 */}
        <div style={{ textAlign: 'center' }}>
          {/* 图标 */}
          <div
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#2d2d2d',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              position: 'relative',
            }}
          >
            <Home size={32} color="white" />
          </div>

          {/* 标题 */}
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#2d2d2d',
              margin: '0 0 12px 0',
              letterSpacing: '-0.5px',
            }}
          >
            确认返回首页
          </h2>

          {/* 描述 */}
          <p
            style={{
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.6',
              margin: '0 0 24px 0',
            }}
          >
            您确定要返回首页吗？
            <br />
            当前编辑的内容将会自动保存。
          </p>

          {/* 操作按钮 */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                backgroundColor: '#fff',
                color: '#666',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.borderColor = '#d0d0d0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#fff'
                e.currentTarget.style.borderColor = '#e0e0e0'
              }}
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#2d2d2d',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#1a1a1a'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#2d2d2d'
              }}
            >
              <Home size={14} />
              确定返回
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(-20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
        `}
      </style>
    </div>
  )
}
