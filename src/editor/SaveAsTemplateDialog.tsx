/**
 * 保存为模板对话框
 */

import React, { useState } from 'react'
import { notification } from '@/utils/notification'

interface SaveAsTemplateDialogProps {
  onSave: (name: string, description: string, category: string) => void
  onClose: () => void
  existingTemplateId?: string
  initialName?: string
  initialDescription?: string
  initialCategory?: string
}

export const SaveAsTemplateDialog: React.FC<SaveAsTemplateDialogProps> = ({
  onSave,
  onClose,
  existingTemplateId,
  initialName = '',
  initialDescription = '',
  initialCategory = 'custom',
}) => {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [category, setCategory] = useState(initialCategory)

  const handleSave = () => {
    if (!name.trim()) {
      notification.warning('请输入模板名称')
      return
    }
    onSave(name, description, category)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 10000,
        paddingTop: '80px',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '28px',
          width: '420px',
          maxWidth: '90vw',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
          }}
        >
          {existingTemplateId ? '更新模板' : '保存为模板'}
        </h3>

        <div style={{ marginBottom: '18px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#2d2d2d',
            }}
          >
            模板名称 *
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="如：工作经历模板"
            autoFocus
            style={{
              width: '100%',
              height: '38px',
              padding: '0 14px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              transition: 'all 0.2s',
              backgroundColor: '#fafafa',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.08)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.backgroundColor = '#fafafa'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#2d2d2d',
            }}
          >
            描述
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="模板说明..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              backgroundColor: '#fafafa',
              lineHeight: '1.5',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.08)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.backgroundColor = '#fafafa'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#2d2d2d',
            }}
          >
            分类
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 14px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: '#fafafa',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.08)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#e0e0e0'
              e.currentTarget.style.backgroundColor = '#fafafa'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <option value="custom">我的模板</option>
            <option value="work">工作相关</option>
            <option value="education">教育相关</option>
            <option value="project">项目相关</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              height: '38px',
              padding: '0 20px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: '#fff',
              color: '#666',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f8f8f8'
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
            onClick={handleSave}
            style={{
              height: '38px',
              padding: '0 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: '#2d2d2d',
              color: '#fff',
              transition: 'all 0.2s',
              boxShadow: '0 2px 6px rgba(45, 45, 45, 0.2)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1a1a1a'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 45, 45, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#2d2d2d'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(45, 45, 45, 0.2)'
            }}
          >
            {existingTemplateId ? '更新' : '保存'}
          </button>
        </div>

        {existingTemplateId && (
          <div
            style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: '#fffbeb',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#92400e',
            }}
          >
            💡 提示：更新后，所有使用此模板的地方不会自动更新
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  )
}
