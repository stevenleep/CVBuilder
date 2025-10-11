/**
 * 保存简历对话框
 *
 * 将当前简历保存到简历库
 */

import React, { useState } from 'react'
import { X } from 'lucide-react'

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
      onClose()
    }
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
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#2d2d2d',
          borderRadius: '12px',
          padding: '28px',
          minWidth: '480px',
          maxWidth: '600px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          border: '1px solid #4a4a4a',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>
            保存简历
          </h3>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
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

        <form onSubmit={handleSubmit}>
          {/* 简历名称 */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#ccc',
                marginBottom: '8px',
              }}
            >
              简历名称 *
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
                padding: '12px',
                border: '1px solid #555',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#777'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#555'
              }}
            />
          </div>

          {/* 描述 */}
          <div style={{ marginBottom: '28px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#ccc',
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
                padding: '12px',
                border: '1px solid #555',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                boxSizing: 'border-box',
                resize: 'vertical',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#777'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#555'
              }}
            />
          </div>

          {/* 按钮 */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
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
              type="submit"
              disabled={!name.trim()}
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: name.trim() ? '#fff' : '#555',
                color: name.trim() ? '#2d2d2d' : '#999',
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (name.trim()) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                }
              }}
              onMouseLeave={e => {
                if (name.trim()) {
                  e.currentTarget.style.backgroundColor = '#fff'
                }
              }}
            >
              保存
            </button>
          </div>
        </form>
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
