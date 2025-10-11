/**
 * 示例预览页面 - 只读预览模式
 */

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Edit3 } from 'lucide-react'
import { getExampleById } from '@/data/examples'
import { useEditorStore } from '@/store/editorStore'
import { EditorLayout } from '@/editor/EditorLayout'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { nanoid } from 'nanoid'
import { notification } from '@/utils/notification'

export const ExamplePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setPageSchema, setMode, setCurrentResumeId } = useEditorStore()
  const [example, setExample] = useState<ReturnType<typeof getExampleById>>(undefined)

  useEffect(() => {
    if (id) {
      const found = getExampleById(id)
      if (found) {
        setExample(found)
        setPageSchema(found.schema)
        setMode('preview') // 设置为预览模式
        setCurrentResumeId(null) // 清空当前简历ID
      } else {
        notification.error('未找到示例')
        navigate('/')
      }
    }
  }, [id, setPageSchema, setMode, setCurrentResumeId, navigate])

  const handleUseExample = async () => {
    if (!example) return

    try {
      const newId = nanoid()
      const resumeData = {
        id: newId,
        name: example.name,
        description: example.description,
        schema: example.schema,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await indexedDBService.setItem(STORES.RESUMES, newId, resumeData)
      notification.success(`已基于"${example.name}"创建新简历！`)
      // 跳转到编辑器编辑新简历
      navigate(`/editor/${newId}`)
    } catch (error) {
      notification.error('创建失败')
      console.error('Create from example error:', error)
    }
  }

  const handleEditDirectly = () => {
    if (!example) return
    // 直接进入编辑模式（不保存）
    setMode('edit')
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/')}
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
            <span>返回首页</span>
          </button>

          {example && (
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d2d2d' }}>
                {example.name}
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>{example.description}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#e8f4fd',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#0369a1',
              border: '1px solid #bae6fd',
            }}
          >
            预览模式（只读）
          </div>
          <button
            onClick={handleEditDirectly}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#666',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f8f9fa'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'white'
            }}
          >
            <Edit3 size={18} />
            <span>进入编辑</span>
          </button>
          <button
            onClick={handleUseExample}
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
            <span>创建副本</span>
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
