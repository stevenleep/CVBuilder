/**
 * 编辑器页面
 */

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { EditorLayout } from '@/editor/EditorLayout'
import { useEditorStore } from '@/store/editorStore'
import { encryptedStorageService } from '@/core/services/EncryptedStorageService'
import { STORES } from '@/utils/indexedDB'
import { nanoid } from 'nanoid'
import { useEncryption } from '@/core/context/EncryptionContext'

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
  const { isEnabled, isUnlocked } = useEncryption()
  const { setPageSchema, setCurrentResumeId } = useEditorStore()

  useEffect(() => {
    if (id) {
      // 如果启用了加密但未解锁，等待解锁后再加载
      if (isEnabled && !isUnlocked) {
        return
      }

      // 有ID：加载对应的简历
      encryptedStorageService.getItem(STORES.RESUMES, id).then(data => {
        if (data && data.schema) {
          // 使用最新的 store state 进行比较，避免重复设置导致循环
          const current = useEditorStore.getState()
          const currentRootId = current.pageSchema?.root?.id
          const incomingRootId = data.schema?.root?.id
          const currentHasChildren =
            Array.isArray(current.pageSchema?.root?.children) &&
            current.pageSchema!.root.children.length > 0
          const incomingHasChildren =
            Array.isArray(data.schema?.root?.children) && data.schema.root.children.length > 0

          // 仅在 incoming 有有效内容且与当前不同（或当前无内容）时才覆盖 store
          if (incomingHasChildren && (!currentHasChildren || currentRootId !== incomingRootId)) {
            setPageSchema(data.schema)
            setCurrentResumeId(id)
          }
        }
      })
    } else {
      // 无 ID：新建简历，但仅在 store 里没有内容时才创建空白页面，避免覆盖恢复
      const current = useEditorStore.getState()
      const hasContent = !!(
        current.pageSchema &&
        current.pageSchema.root &&
        Array.isArray(current.pageSchema.root.children) &&
        current.pageSchema.root.children.length > 0
      )
      if (!hasContent) {
        setPageSchema(createBlankPageSchema())
      }
      setCurrentResumeId(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEnabled, isUnlocked, setPageSchema, setCurrentResumeId])

  return <EditorLayout />
}
