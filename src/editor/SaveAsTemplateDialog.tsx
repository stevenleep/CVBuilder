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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
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
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '20px',
          color: '#000',
        }}>
          {existingTemplateId ? '更新模板' : '保存为模板'}
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '6px',
            color: '#666',
          }}>
            模板名称 *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="如：工作经历模板"
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

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '6px',
            color: '#666',
          }}>
            描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="模板说明..."
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

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '6px',
            color: '#666',
          }}>
            分类
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              height: '32px',
              padding: '0 10px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="custom">我的模板</option>
            <option value="work">工作相关</option>
            <option value="education">教育相关</option>
            <option value="project">项目相关</option>
          </select>
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
            {existingTemplateId ? '更新' : '保存'}
          </button>
        </div>
        
        {existingTemplateId && (
          <div style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#fffbeb',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#92400e',
          }}>
            💡 提示：更新后，所有使用此模板的地方不会自动更新
          </div>
        )}
      </div>
    </div>
  )
}

