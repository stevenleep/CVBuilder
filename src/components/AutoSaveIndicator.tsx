/**
 * 自动保存状态指示器
 *
 * 显示在工具栏，提示用户保存状态
 */

import React, { useEffect, useState } from 'react'
import { Check, Cloud, Loader2 } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'

export const AutoSaveIndicator: React.FC = () => {
  const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null)
  const { pageSchema } = useEditorStore()

  // 监听页面变化
  useEffect(() => {
    setStatus('unsaved')

    // 延迟保存
    const timer = setTimeout(async () => {
      setStatus('saving')
      try {
        await useEditorStore.getState().saveToStorage()
        setStatus('saved')
        setLastSaveTime(new Date())
      } catch (error) {
        setStatus('unsaved')
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [pageSchema])

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
        return '正在保存...'
      case 'unsaved':
        return '未保存'
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
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '6px',
        backgroundColor: '#f8f9fa',
        fontSize: '11px',
        fontWeight: '500',
        color: getStatusColor(),
      }}
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
