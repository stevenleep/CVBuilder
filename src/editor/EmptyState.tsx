/**
 * 空状态组件
 * 
 * 当容器为空时显示，提示用户拖拽添加
 */

import React from 'react'
import { Plus } from 'lucide-react'

export const EmptyState: React.FC<{
  message?: string
}> = ({ message = '拖拽组件到这里' }) => {
  return (
    <div style={{
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #e0e0e0',
      borderRadius: '4px',
      color: '#ccc',
      fontSize: '12px',
      minHeight: '100px',
    }}>
      <Plus size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
      <div>{message}</div>
    </div>
  )
}

