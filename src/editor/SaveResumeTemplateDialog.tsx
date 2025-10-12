/**
 * 保存整个简历为模板对话框
 */

import React, { useState } from 'react'
import { notification } from '@/utils/notification'

interface SaveResumeTemplateDialogProps {
  onSave: (name: string, description: string) => void
  onClose: () => void
}

export const SaveResumeTemplateDialog: React.FC<SaveResumeTemplateDialogProps> = ({
  onSave,
  onClose,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSave = () => {
    if (!name.trim()) {
      notification.warning('请输入模板名称')
      return
    }
    onSave(name, description)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 10000,
        paddingTop: '80px',
        backdropFilter: 'blur(2px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          width: '400px',
          maxWidth: '90vw',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid #e0e0e0',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#000',
          }}
        >
          保存为简历模板
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '500',
              marginBottom: '6px',
              color: '#666',
            }}
          >
            模板名称 *
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="如：前端工程师简历"
            autoFocus
            style={{
              width: '100%',
              height: '32px',
              padding: '0 10px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '500',
              marginBottom: '6px',
              color: '#666',
            }}
          >
            描述
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="简历模板说明..."
            rows={3}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '13px',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              height: '32px',
              padding: '0 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: '#fafafa',
              color: '#666',
            }}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            style={{
              height: '32px',
              padding: '0 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: '#000',
              color: '#fff',
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
