/**
 * 编辑器页面
 */

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { EditorLayout } from '@/editor/EditorLayout'
import { useEditorStore } from '@/store/editorStore'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { nanoid } from 'nanoid'

// 创建空白页面Schema
const createBlankPageSchema = () => ({
  version: '1.0.0',
  meta: {
    title: '我的简历',
    description: '使用CVKit创建',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  },
  root: {
    id: nanoid(),
    type: 'Page',
    props: {},
    style: {},
    children: [],
  },
})

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
      // 无ID：新建简历，创建空白页面
      setPageSchema(createBlankPageSchema())
      setCurrentResumeId(null)
    }
  }, [id, setPageSchema, setCurrentResumeId])

  return <EditorLayout />
}
