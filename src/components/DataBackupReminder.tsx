/**
 * 数据备份提醒组件
 *
 * 功能：
 * 1. 提醒用户定期导出数据备份
 * 2. 显示上次导出时间
 * 3. 一键导出功能
 */

import React, { useEffect, useState } from 'react'
import { AlertCircle, Download, X } from 'lucide-react'
import { useEditorStore } from '@/store/editorStore'
import { useTheme } from '@/core/context/ThemeContext'

const BACKUP_REMINDER_KEY = 'cv-builder-last-backup-reminder'
const LAST_EXPORT_KEY = 'cv-builder-last-export-time'
const REMINDER_INTERVAL = 7 * 24 * 60 * 60 * 1000 // 7天

export const DataBackupReminder: React.FC = () => {
  const [showReminder, setShowReminder] = useState(false)
  const [daysSinceExport, setDaysSinceExport] = useState(0)
  const { pageSchema } = useEditorStore()
  const { theme } = useTheme()

  useEffect(() => {
    checkBackupStatus()
  }, [])

  const checkBackupStatus = () => {
    const lastReminder = localStorage.getItem(BACKUP_REMINDER_KEY)
    const lastExport = localStorage.getItem(LAST_EXPORT_KEY)
    const now = Date.now()

    // 计算距离上次导出的天数
    if (lastExport) {
      const days = Math.floor((now - parseInt(lastExport)) / (24 * 60 * 60 * 1000))
      setDaysSinceExport(days)
    }

    // 如果7天内没有提醒过，且有内容，则显示提醒
    if (!lastReminder || now - parseInt(lastReminder) > REMINDER_INTERVAL) {
      const hasContent = pageSchema?.root?.children && pageSchema.root.children.length > 0
      if (hasContent) {
        setShowReminder(true)
      }
    }
  }

  const handleExport = () => {
    const state = useEditorStore.getState()
    const exportData = {
      pageSchema: state.pageSchema,
      theme: theme,
      canvasConfig: state.canvasConfig,
      exportTime: new Date().toISOString(),
      version: '1.0.0',
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `resume-backup-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // 记录导出时间
    localStorage.setItem(LAST_EXPORT_KEY, Date.now().toString())
    handleDismiss()
  }

  const handleDismiss = () => {
    localStorage.setItem(BACKUP_REMINDER_KEY, Date.now().toString())
    setShowReminder(false)
  }

  if (!showReminder) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '320px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e0e0e0',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* 头部 */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#2d2d2d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertCircle size={16} color="#fff" />
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#2d2d2d',
              marginBottom: '4px',
            }}
          >
            记得备份数据
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: '#666',
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {daysSinceExport > 0
              ? `距离上次备份 ${daysSinceExport} 天，建议定期导出。`
              : '建议定期导出JSON文件防止数据丢失。'}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          style={{
            width: '24px',
            height: '24px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            color: '#999',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f0f0f0'
            e.currentTarget.style.color = '#666'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#999'
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* 底部按钮 */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          gap: '8px',
        }}
      >
        <button
          onClick={handleExport}
          style={{
            flex: 1,
            padding: '8px 14px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#2d2d2d',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#1a1a1a'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#2d2d2d'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Download size={14} />
          立即备份
        </button>

        <button
          onClick={handleDismiss}
          style={{
            padding: '8px 14px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fff',
            color: '#666',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f8f9fa'
            e.currentTarget.style.borderColor = '#cbd5e1'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#fff'
            e.currentTarget.style.borderColor = '#e0e0e0'
          }}
        >
          稍后
        </button>
      </div>
    </div>
  )
}
