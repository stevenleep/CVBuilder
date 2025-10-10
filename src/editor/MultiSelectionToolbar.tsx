/**
 * 多选工具栏
 *
 * 当选中多个节点时显示的批量操作工具栏
 */

import React from 'react'
import { Copy, Trash2 } from 'lucide-react'
import { useEditorStore } from '@store/editorStore'
import { notification } from '@/utils/notification'

export const MultiSelectionToolbar: React.FC = () => {
  const { selectedNodeIds, duplicateNodes, deleteNodes } = useEditorStore()

  if (selectedNodeIds.length <= 1) return null

  const handleDuplicate = () => {
    duplicateNodes(selectedNodeIds)
    notification.info(`已复制 ${selectedNodeIds.length} 个节点`, 1500)
  }

  const handleDelete = async () => {
    const confirmed = await notification.confirm({
      title: '确认删除',
      message: `确定删除选中的 ${selectedNodeIds.length} 个节点吗？`,
      type: 'warning',
    })
    if (confirmed) {
      deleteNodes(selectedNodeIds)
      notification.success(`已删除 ${selectedNodeIds.length} 个节点`)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#2d2d2d',
        border: '1px solid #4a4a4a',
        borderRadius: '8px',
        padding: '10px 16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
        zIndex: 100000,
        color: '#fff',
      }}
    >
      {/* 选中数量 */}
      <div
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#fff',
        }}
      >
        已选中 {selectedNodeIds.length} 个节点
      </div>

      <div
        style={{
          width: '1px',
          height: '20px',
          backgroundColor: '#555',
        }}
      />

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <ToolbarButton icon={<Copy size={16} />} label="复制" onClick={handleDuplicate} />
        <ToolbarButton icon={<Trash2 size={16} />} label="删除" onClick={handleDelete} danger />
      </div>

      {/* 快捷键提示 */}
      <div
        style={{
          fontSize: '11px',
          color: '#999',
          marginLeft: '8px',
        }}
      >
        Ctrl+C 复制 · Ctrl+D 快速复制 · Del 删除
      </div>
    </div>
  )
}

const ToolbarButton: React.FC<{
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}> = ({ icon, label, onClick, danger = false }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        border: '1px solid #555',
        borderRadius: '6px',
        backgroundColor: hover ? (danger ? '#7f1d1d' : '#3a3a3a') : 'transparent',
        color: danger ? (hover ? '#fca5a5' : '#ef4444') : '#fff',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500',
        transition: 'all 0.15s',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
