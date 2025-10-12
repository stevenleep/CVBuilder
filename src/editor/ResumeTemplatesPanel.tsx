/**
 * 简历模板面板
 *
 * 显示和管理简历模板
 */

import React, { useState, useEffect } from 'react'
import { resumeTemplateManager, ResumeTemplate } from '@/core/services/ResumeTemplateManager'
import { useEditorStore } from '@store/editorStore'
import { Trash2, FileText, Edit2 } from 'lucide-react'
import { notification } from '@/utils/notification'

export const ResumeTemplatesPanel: React.FC<{
  onClose: () => void
}> = ({ onClose }) => {
  const [templates, setTemplates] = useState<ResumeTemplate[]>([])
  const { setPageSchema } = useEditorStore()

  useEffect(() => {
    setTemplates(resumeTemplateManager.getAllTemplates())
  }, [])

  const handleUseTemplate = async (template: ResumeTemplate) => {
    const confirmed = await notification.confirm({
      title: '使用模板',
      message: `确定使用模板"${template.name}"吗？当前内容将被替换。`,
      type: 'warning',
    })
    if (confirmed) {
      setPageSchema(template.schema)
      onClose()
    }
  }

  const handleEditTemplate = async (template: ResumeTemplate, e: React.MouseEvent) => {
    e.stopPropagation()
    const newName = await notification.prompt({
      title: '修改模板名称',
      message: '请输入新的模板名称',
      defaultValue: template.name,
    })
    if (newName && newName.trim()) {
      resumeTemplateManager.updateTemplate(template.id, {
        name: newName.trim(),
      })
      setTemplates(resumeTemplateManager.getAllTemplates())
    }
  }

  const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmed = await notification.confirm({
      title: '确认删除',
      message: '确定删除这个简历模板吗？',
      type: 'error',
    })
    if (confirmed) {
      resumeTemplateManager.deleteTemplate(id)
      setTemplates(resumeTemplateManager.getAllTemplates())
    }
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
          width: '600px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#000',
            }}
          >
            我的简历模板
          </h3>
          <button
            onClick={onClose}
            style={{
              width: '24px',
              height: '24px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#999',
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
          }}
        >
          {templates.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: '#ccc',
                padding: '60px 20px',
                fontSize: '13px',
              }}
            >
              <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <div>暂无简历模板</div>
              <div style={{ fontSize: '11px', marginTop: '8px' }}>
                在工具栏点击"保存为简历模板"创建
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '16px',
              }}
            >
              {templates.map(template => (
                <ResumeTemplateCard
                  key={template.id}
                  template={template}
                  onClick={() => handleUseTemplate(template)}
                  onEdit={e => handleEditTemplate(template, e)}
                  onDelete={e => handleDeleteTemplate(template.id, e)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ResumeTemplateCard: React.FC<{
  template: ResumeTemplate
  onClick: () => void
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}> = ({ template, onClick, onEdit, onDelete }) => {
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '16px',
        border: '1px solid #f1f1f1',
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: hover ? '#fafafa' : 'white',
        transition: 'all 0.1s',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#000',
          marginBottom: '6px',
        }}
      >
        {template.name}
      </div>

      {template.description && (
        <div
          style={{
            fontSize: '12px',
            color: '#999',
            marginBottom: '8px',
            lineHeight: '1.4',
          }}
        >
          {template.description}
        </div>
      )}

      <div
        style={{
          fontSize: '11px',
          color: '#ccc',
        }}
      >
        {new Date(template.createTime).toLocaleDateString('zh-CN')}
      </div>

      {hover && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            gap: '4px',
          }}
        >
          <button
            onClick={onEdit}
            style={{
              width: '24px',
              height: '24px',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: '#f0f0f0',
              color: '#666',
            }}
            title="编辑"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={onDelete}
            style={{
              width: '24px',
              height: '24px',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
            }}
            title="删除"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
