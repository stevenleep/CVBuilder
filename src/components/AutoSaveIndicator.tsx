/**
 * 自动保存状态指示器（增强版）
 *
 * 显示在工具栏，提示用户保存状态
 * 支持保存到编辑器状态和简历库
 */

import React, { useEffect, useState, useRef } from 'react'
import { Check, Cloud, Loader2, AlertCircle } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { indexedDBService, STORES } from '@/utils/indexedDB'

// 自动保存配置
const AUTO_SAVE_DELAY = 800 // 防抖延迟（毫秒）- 缩短延迟以减少数据丢失风险
const MAX_RETRY_ATTEMPTS = 3 // 最大重试次数
const RETRY_DELAY = 2000 // 重试延迟（毫秒）

export const AutoSaveIndicator: React.FC = () => {
  const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved')
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { pageSchema, currentResumeId } = useEditorStore()
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const retryTimeoutRef = useRef<NodeJS.Timeout>()
  const isFirstLoadRef = useRef(true) // 标记首次加载，避免立即触发保存

  // 保存函数（支持重试）
  const performSave = async () => {
    setStatus('saving')
    try {
      // 1. 保存到编辑器状态（快速恢复用）
      await useEditorStore.getState().saveToStorage()

      // 2. 如果有简历 ID，保存到简历库
      if (currentResumeId) {
        const existing = await indexedDBService.getItem(STORES.RESUMES, currentResumeId)
        if (existing) {
          const updated = {
            ...existing,
            schema: pageSchema,
            updatedAt: new Date().toISOString(),
          }
          await indexedDBService.setItem(STORES.RESUMES, currentResumeId, updated)

          // 触发简历列表刷新事件
          window.dispatchEvent(new CustomEvent('cvkit-resume-updated'))
        }
      }

      setStatus('saved')
      setLastSaveTime(new Date())
      setRetryCount(0) // 重置重试计数
    } catch (error) {
      console.error('Auto save error:', error)

      // 重试逻辑
      if (retryCount < MAX_RETRY_ATTEMPTS) {
        setStatus('saving')
        setRetryCount(prev => prev + 1)

        // 延迟后重试
        retryTimeoutRef.current = setTimeout(() => {
          performSave()
        }, RETRY_DELAY)
      } else {
        // 超过最大重试次数，标记为错误
        setStatus('error')
        setRetryCount(0)
      }
    }
  }

  // 监听页面变化，实现防抖自动保存
  useEffect(() => {
    // 跳过首次加载（首次加载是从存储恢复的，不需要保存）
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false
      return
    }

    setStatus('unsaved')

    // 清除之前的定时器
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }

    // 延迟保存（防抖）
    saveTimeoutRef.current = setTimeout(() => {
      performSave()
    }, AUTO_SAVE_DELAY)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSchema, currentResumeId])

  // 监听页面刷新/关闭，强制保存并提示
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 1. 取消防抖定时器，避免重复保存
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }

      // 2. 立即同步保存到 localStorage 作为备份（同步操作，确保执行）
      const state = useEditorStore.getState()
      try {
        localStorage.setItem('cv-builder-backup', JSON.stringify(state.pageSchema))
      } catch (err) {
        // 静默失败
      }

      // 3. 尝试保存到 IndexedDB（异步，可能不会完成，但 localStorage 已确保数据安全）
      state.saveToStorage().catch(() => {
        // 静默失败
      })

      // 4. 如果有简历 ID，也保存简历数据
      if (state.currentResumeId) {
        indexedDBService
          .getItem(STORES.RESUMES, state.currentResumeId)
          .then(existing => {
            if (existing) {
              const updated = {
                ...existing,
                schema: state.pageSchema,
                updatedAt: new Date().toISOString(),
              }
              indexedDBService.setItem(STORES.RESUMES, state.currentResumeId!, updated)
            }
          })
          .catch(() => {
            // 静默失败
          })
      }

      // 5. 显示离开提示（浏览器会显示标准确认对话框）
      const message = '您的更改正在保存中，确定要离开吗？'
      e.preventDefault()
      e.returnValue = message
      return message
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const getStatusText = () => {
    switch (status) {
      case 'saved':
        if (lastSaveTime) {
          const now = new Date()
          const diff = Math.floor((now.getTime() - lastSaveTime.getTime()) / 1000)
          if (diff < 60) return `${diff}秒前已保存`
          if (diff < 3600) return `${Math.floor(diff / 60)}分钟前已保存`
          return '已保存'
        }
        return '已保存'
      case 'saving':
        return retryCount > 0 ? `正在重试(${retryCount}/${MAX_RETRY_ATTEMPTS})...` : '正在保存...'
      case 'unsaved':
        return '未保存'
      case 'error':
        return '保存失败'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'saved':
        return <Check size={14} />
      case 'saving':
        return (
          <Loader2
            size={14}
            className="animate-spin"
            style={{ animation: 'spin 1s linear infinite' }}
          />
        )
      case 'unsaved':
        return <Cloud size={14} />
      case 'error':
        return <AlertCircle size={14} />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'saved':
        return '#10b981'
      case 'saving':
        return '#f59e0b'
      case 'unsaved':
        return '#999'
      case 'error':
        return '#ef4444'
    }
  }

  // 点击错误状态时手动重试
  const handleClick = () => {
    if (status === 'error') {
      setRetryCount(0)
      performSave()
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        width: '26px',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5px',
        backgroundColor: status === 'error' ? '#fee2e2' : 'transparent',
        color: getStatusColor(),
        cursor: status === 'error' ? 'pointer' : 'default',
        transition: 'all 0.2s',
      }}
      title={getStatusText()}
    >
      {getStatusIcon()}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}
