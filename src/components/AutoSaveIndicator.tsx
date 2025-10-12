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
const AUTO_SAVE_DELAY = 1500 // 防抖延迟（毫秒）
const MAX_RETRY_ATTEMPTS = 3 // 最大重试次数
const RETRY_DELAY = 2000 // 重试延迟（毫秒）

export const AutoSaveIndicator: React.FC = () => {
  const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved')
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { pageSchema, currentResumeId } = useEditorStore()
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const retryTimeoutRef = useRef<NodeJS.Timeout>()

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
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '6px',
        backgroundColor: status === 'error' ? '#fee2e2' : '#f8f9fa',
        fontSize: '11px',
        fontWeight: '500',
        color: getStatusColor(),
        cursor: status === 'error' ? 'pointer' : 'default',
        transition: 'all 0.2s',
      }}
      title={status === 'error' ? '点击重试' : ''}
    >
      {getStatusIcon()}
      <span>{getStatusText()}</span>
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
