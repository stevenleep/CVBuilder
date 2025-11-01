/**
 * 模板预览页面 - 只读模式
 */

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { resumeTemplateManager } from '@/core/services/ResumeTemplateManager'
import { useEditorStore } from '@/store/editorStore'
import { EditorLayout } from '@/editor/EditorLayout'
import { STORES } from '@/utils/indexedDB'
import { encryptedStorageService } from '@/core/services/EncryptedStorageService'
import { nanoid } from 'nanoid'
import { notification } from '@/utils/notification'

export const TemplatePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setPageSchema, setMode } = useEditorStore()
  const [template, setTemplate] = useState<any>(null)

  useEffect(() => {
    if (id) {
      const found = resumeTemplateManager.getTemplate(id)
      if (found) {
        setTemplate(found)
        setPageSchema(found.schema)
        setMode('preview') // 设置为预览模式，不可编辑
      }
    }
  }, [id, setPageSchema, setMode])

  const handleApplyTemplate = async () => {
    if (!template) return

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
      await encryptedStorageService.setItem(STORES.RESUMES, resumeData.id, resumeData)
      notification.success('已创建新简历！')
      // 跳转到编辑器编辑新简历
      navigate(`/editor/${resumeData.id}`)
    } catch (error) {
      notification.error('创建失败')
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部操作栏 */}
      <div
        style={{
          height: '60px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <button
          onClick={() => navigate('/templates')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
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
          <ArrowLeft size={18} />
          <span>返回模板库</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#fff3cd',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#856404',
              border: '1px solid #ffeaa7',
            }}
          >
            预览模式（只读）
          </div>
          <button
            onClick={handleApplyTemplate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#2d2d2d',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#3d3d3d'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#2d2d2d'
            }}
          >
            <Check size={18} />
            <span>应用此模板</span>
          </button>
        </div>
      </div>

      {/* 编辑器内容区 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <EditorLayout />
      </div>
    </div>
  )
}
