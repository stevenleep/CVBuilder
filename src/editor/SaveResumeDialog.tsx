/**
 * 保存简历对话框 - 优化版
 */

import React, { useState } from 'react'
import { X, Save } from 'lucide-react'

interface SaveResumeDialogProps {
  onSave: (name: string, description: string) => void
  onClose: () => void
}

export const SaveResumeDialog: React.FC<SaveResumeDialogProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave(name.trim(), description.trim())
    }
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
          width: '480px',
          maxWidth: '90vw',
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
              保存简历
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

        {/* 表单内容 */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px' }}>
            {/* 简历名称 */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                }}
              >
                简历名称 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例如：产品经理简历"
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '2px solid #e8e8e8',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#fff',
                  color: '#2d2d2d',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#2d2d2d'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,45,45,0.05)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e8e8e8'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* 描述 */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  marginBottom: '8px',
                }}
              >
                描述（选填）
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="添加一些说明..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '2px solid #e8e8e8',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#fff',
                  color: '#2d2d2d',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  lineHeight: 1.5,
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#2d2d2d'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,45,45,0.05)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e8e8e8'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* 提示 */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #f0f0f0',
              }}
            >
              <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.5' }}>
                💡 简历将保存到您的简历库中，随时可以继续编辑
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              backgroundColor: '#fafafa',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '11px 20px',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f8f9fa'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#fff'
              }}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              style={{
                padding: '11px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: name.trim() ? '#2d2d2d' : '#e8e8e8',
                color: name.trim() ? '#fff' : '#999',
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '700',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: name.trim() ? '0 2px 8px rgba(45,45,45,0.2)' : 'none',
              }}
              onMouseEnter={e => {
                if (name.trim()) {
                  e.currentTarget.style.backgroundColor = '#1a1a1a'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(45,45,45,0.3)'
                }
              }}
              onMouseLeave={e => {
                if (name.trim()) {
                  e.currentTarget.style.backgroundColor = '#2d2d2d'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(45,45,45,0.2)'
                }
              }}
            >
              <Save size={16} />
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
