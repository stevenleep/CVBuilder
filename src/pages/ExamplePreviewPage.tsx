/**
 * 示例预览页面 - 只读预览模式
 */

import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getExampleById } from '@/data/examples'
import { useEditorStore } from '@/store/editorStore'
import { EditorLayout } from '@/editor/EditorLayout'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { nanoid } from 'nanoid'
import { notification } from '@/utils/notification'

export const ExamplePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setPageSchema, setMode, setCurrentResumeId, setPreviewExampleInfo } = useEditorStore()

  useEffect(() => {
    if (id) {
      const found = getExampleById(id)
      if (found) {
        setPageSchema(found.schema)
        setMode('preview') // 设置为预览模式
        setCurrentResumeId(null) // 清空当前简历ID

        // 设置预览示例信息
        setPreviewExampleInfo({
          id: found.id,
          name: found.name,
          description: found.description,
          onEditDirectly: () => {
            if (!found) return
            setMode('edit')
          },
          onCreateCopy: async () => {
            if (!found) return
            try {
              const newId = nanoid()
              const resumeData = {
                id: newId,
                name: `${found.name} - 副本`,
                description: found.description,
                schema: found.schema,
                theme: 'default',
                canvasConfig: {
                  scale: 1,
                  showGrid: false,
                  showRuler: false,
                  backgroundColor: '#fafafa',
                },
                thumbnail: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
              await indexedDBService.setItem(STORES.RESUMES, newId, resumeData)
              setCurrentResumeId(newId)
              setMode('edit')
              setPreviewExampleInfo(null)
              notification.success('已创建副本，开始编辑吧！')
            } catch (error) {
              notification.error('创建副本失败')
              console.error('Create copy error:', error)
            }
          },
        })
      } else {
        notification.error('未找到示例')
        navigate('/')
      }
    }

    // 清理：离开页面时清除预览信息
    return () => {
      setPreviewExampleInfo(null)
    }
  }, [id, setPageSchema, setMode, setCurrentResumeId, setPreviewExampleInfo, navigate])

  return <EditorLayout />
}
