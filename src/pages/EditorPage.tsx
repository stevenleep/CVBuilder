/**
 * 编辑器页面
 */

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { EditorLayout } from '@/editor/EditorLayout'
import { useEditorStore } from '@/store/editorStore'
import { indexedDBService, STORES } from '@/utils/indexedDB'

export const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { setPageSchema, setCurrentResumeId } = useEditorStore()

  useEffect(() => {
    if (id) {
      // 有ID：加载对应的简历
      indexedDBService.getItem(STORES.RESUMES, id).then(data => {
        if (data && data.schema) {
          setPageSchema(data.schema)
          setCurrentResumeId(id) // 设置当前编辑的简历ID
        }
      })
    } else {
      // 无ID：新建简历，清空ID
      setCurrentResumeId(null)
    }
  }, [id, setPageSchema, setCurrentResumeId])

  return <EditorLayout />
}
