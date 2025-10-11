/**
 * 模板库页面 - 显示所有预设模板
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Eye, Check, Settings, Trash2 } from 'lucide-react'
import { resumeTemplateManager } from '@/core/services/ResumeTemplateManager'
import { notification } from '@/utils/notification'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { nanoid } from 'nanoid'

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState(() => resumeTemplateManager.getAllTemplates())
  const [editingTemplate, setEditingTemplate] = useState<any>(null)

  const handlePreview = (template: any) => {
    // 跳转到预览页面
    navigate(`/templates/${template.id}/preview`)
  }

  const handleApply = async (template: any) => {
    // 基于模板创建新简历
    const resumeData = {
      id: nanoid(),
      name: `基于 ${template.name} 的简历`,
      description: `使用模板创建于 ${new Date().toLocaleDateString()}`,
      schema: template.schema,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      await indexedDBService.setItem(STORES.RESUMES, resumeData.id, resumeData)
      notification.success('已创建新简历！')
      navigate(`/editor/${resumeData.id}`)
    } catch (error) {
      notification.error('创建失败')
    }
  }

  const handleEdit = (template: any) => {
    setEditingTemplate(template)
  }

  const handleSaveTemplateInfo = (name: string, description: string) => {
    if (editingTemplate) {
      resumeTemplateManager.updateTemplate(editingTemplate.id, {
        name,
        description,
      })
      setTemplates(resumeTemplateManager.getAllTemplates())
      setEditingTemplate(null)
      notification.success('模板信息已更新！')
    }
  }

  const handleDelete = async (template: any, e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmed = await notification.confirm({
      title: '确认删除',
      message: `确定删除模板"${template.name}"吗？`,
      type: 'warning',
    })
    if (confirmed) {
      resumeTemplateManager.deleteTemplate(template.id)
      setTemplates(resumeTemplateManager.getAllTemplates())
      notification.success('模板已删除')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
      }}
    >
      {/* 顶部导航 */}
      <div
        style={{
          height: '64px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2d2d2d" />
            <path d="M12 10h16v2H12zm0 6h16v2H12zm0 6h12v2H12z" fill="white" />
          </svg>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d2d2d' }}>模板库</div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>CVKit</div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: 'transparent',
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
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <ArrowLeft
            size={18}
            style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}
          />
          返回首页
        </button>
      </div>

      {/* 主体内容 */}
      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {templates.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 40px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '2px dashed #d0d0d0',
            }}
          >
            <FileText size={48} style={{ color: '#ccc', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
              暂无模板
            </h3>
            <p style={{ fontSize: '14px', color: '#999' }}>在编辑器中保存简历作为模板</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {templates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={() => handlePreview(template)}
                onApply={() => handleApply(template)}
                onEdit={() => handleEdit(template)}
                onDelete={e => handleDelete(template, e)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 编辑模板信息对话框 */}
      {editingTemplate && (
        <EditTemplateInfoDialog
          template={editingTemplate}
          onSave={handleSaveTemplateInfo}
          onClose={() => setEditingTemplate(null)}
        />
      )}
    </div>
  )
}

const EditTemplateInfoDialog: React.FC<{
  template: any
  onSave: (name: string, description: string) => void
  onClose: () => void
}> = ({ template, onSave, onClose }) => {
  const [name, setName] = React.useState(template.name)
  const [description, setDescription] = React.useState(template.description || '')

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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100001,
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
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '24px' }}>
          编辑模板信息
        </h3>

        <form onSubmit={handleSubmit}>
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
              模板名称 *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
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
              }}
            />
          </div>

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
              描述
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
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
              }}
            />
          </div>

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
              }}
            >
              取消
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#fff',
                color: '#2d2d2d',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const TemplateCard: React.FC<{
  template: any
  onPreview: () => void
  onApply: () => void
  onEdit: () => void
  onDelete: (e: React.MouseEvent) => void
}> = ({ template, onPreview, onApply, onEdit, onDelete }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: `1px solid ${hover ? '#d0d0d0' : '#e8e8e8'}`,
        overflow: 'hidden',
        transition: 'all 0.2s',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? '0 12px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* 缩略图区域 */}
      <div
        style={{
          height: '200px',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #e8e8e8',
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={onPreview}
      >
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FileText size={42} style={{ color: '#ccc' }} />
            <span style={{ fontSize: '11px', color: '#999' }}>暂无预览</span>
          </div>
        )}
      </div>

      {/* 信息区域 */}
      <div style={{ padding: '20px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#2d2d2d',
            marginBottom: '8px',
          }}
        >
          {template.name}
        </h3>
        <p
          style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '16px',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {template.description}
        </p>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <button
            onClick={e => {
              e.stopPropagation()
              onPreview()
            }}
            style={{
              flex: 1,
              padding: '9px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#666',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f8f9fa'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'white'
            }}
          >
            <Eye size={16} />
            <span>预览</span>
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              onApply()
            }}
            style={{
              flex: 1,
              padding: '9px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: hover ? '#2d2d2d' : '#f8f9fa',
              color: hover ? 'white' : '#2d2d2d',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s',
            }}
          >
            <Check size={16} />
            <span>应用</span>
          </button>
        </div>

        {/* 管理按钮 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={e => {
              e.stopPropagation()
              onEdit()
            }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: '#666',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <Settings size={14} />
            <span>设置</span>
          </button>
          <button
            onClick={onDelete}
            style={{
              width: '36px',
              height: '32px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#fef2f2'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
