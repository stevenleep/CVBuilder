/**
 * 空状态组件
 *
 * 当容器为空时显示，提示用户拖拽添加
 */

import React from 'react'
import { MousePointer2, Sparkles } from 'lucide-react'

export const EmptyState: React.FC<{
  message?: string
  hint?: string
}> = ({ message = '从左侧拖拽物料到这里开始创建', hint = '或点击物料快速添加' }) => {
  return (
    <div
      style={{
        padding: '60px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px dashed #d0d0d0',
        borderRadius: '8px',
        color: '#999',
        fontSize: '13px',
        minHeight: '200px',
        backgroundColor: '#fafafa',
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <MousePointer2 size={28} style={{ color: '#bbb' }} />
      </div>
      <div
        style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#666',
          marginBottom: '8px',
        }}
      >
        {message}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: '#bbb',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <Sparkles size={14} />
        <span>{hint}</span>
      </div>
    </div>
  )
}
