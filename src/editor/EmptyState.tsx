/**
 * 空状态组件
 *
 * 当容器为空时显示，提示用户拖拽添加
 */

import React from 'react'
import { MousePointer2 } from 'lucide-react'

export const EmptyState: React.FC<{
  message?: string
  hint?: string
}> = ({ message = '从左侧拖拽物料到这里开始创建', hint = '或点击物料快速添加' }) => {
  return (
    <div
      style={{
        padding: '80px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed #e8e8e8',
        borderRadius: '12px',
        minHeight: '240px',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          border: '1px solid #f0f0f0',
        }}
      >
        <MousePointer2 size={28} style={{ color: '#d0d0d0' }} />
      </div>
      <div
        style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#999',
          marginBottom: '10px',
        }}
      >
        {message}
      </div>
      <div
        style={{
          fontSize: '13px',
          color: '#ccc',
          textAlign: 'center',
          lineHeight: '1.6',
        }}
      >
        {hint}
      </div>
    </div>
  )
}
