/**
 * 节点浮动工具栏
 * 
 * 鼠标悬停时显示，提供快捷操作
 */

import React from 'react'
import { GripVertical, Copy, Trash2, ChevronUp, ChevronDown, Plus, Save } from 'lucide-react'
import { IMaterialAction } from '@/core'

interface NodeToolbarProps {
  nodeId: string
  actions?: IMaterialAction[]
  onCopy?: () => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onAddBefore?: () => void
  onAddAfter?: () => void
  onSaveAsTemplate?: () => void
  onCustomAction?: (actionId: string) => void
  capabilities?: {
    copyable?: boolean
    deletable?: boolean
    moveable?: boolean
  }
}

export const NodeToolbar: React.FC<NodeToolbarProps> = ({
  nodeId,
  actions = [],
  onCopy,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBefore,
  onAddAfter,
  onSaveAsTemplate,
  onCustomAction,
  capabilities = {},
}) => {
  const [showMore, setShowMore] = React.useState(false)

  const { copyable = true, deletable = true, moveable = true } = capabilities

  return (
    <div
      style={{
        position: 'absolute',
        top: '-4px',
        left: '50%',
        transform: 'translate(-50%, -100%)',
        marginTop: '-6px',
        display: 'flex',
        gap: '4px',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        padding: '4px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.05)',
        zIndex: 10001,
        pointerEvents: 'auto',
      }}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      {/* 拖动手柄 */}
      {moveable && (
        <ToolButton 
          icon={<GripVertical size={14} />}
          tooltip="拖动"
          style={{ cursor: 'grab' }}
        />
      )}

      {/* 上移下移 */}
      {moveable && onMoveUp && (
        <ToolButton 
          icon={<ChevronUp size={14} />}
          tooltip="上移"
          onClick={onMoveUp}
        />
      )}
      {moveable && onMoveDown && (
        <ToolButton 
          icon={<ChevronDown size={14} />}
          tooltip="下移"
          onClick={onMoveDown}
        />
      )}

      <div style={{ width: '1px', height: '20px', backgroundColor: '#f1f1f1', margin: '0 2px' }} />

      {/* 复制 */}
      {copyable && (
        <ToolButton 
          icon={<Copy size={14} />}
          tooltip="复制"
          onClick={onCopy}
        />
      )}
      
      {/* 保存为模板 */}
      {onSaveAsTemplate && (
        <ToolButton 
          icon={<Save size={14} />}
          tooltip="保存为模板"
          onClick={onSaveAsTemplate}
        />
      )}

      {/* 删除 */}
      {deletable && (
        <ToolButton 
          icon={<Trash2 size={14} />}
          tooltip="删除"
          onClick={onDelete}
          danger
        />
      )}

      {/* 自定义Actions */}
      {actions.length > 0 && (
        <>
          <div style={{ width: '1px', height: '20px', backgroundColor: '#f1f1f1', margin: '0 2px' }} />
          {actions.slice(0, 2).map(action => (
            <ToolButton
              key={action.id}
              icon={action.icon ? <span style={{ fontSize: '12px' }}>{action.icon}</span> : <Plus size={14} />}
              tooltip={action.label}
              onClick={() => onCustomAction?.(action.id)}
            />
          ))}
        </>
      )}
    </div>
  )
}

const ToolButton: React.FC<{
  icon: React.ReactNode
  tooltip: string
  onClick?: () => void
  danger?: boolean
  style?: React.CSSProperties
}> = ({ icon, tooltip, onClick, danger = false, style }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={tooltip}
      style={{
        width: '28px',
        height: '28px',
        border: 'none',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: hover ? (danger ? '#fef2f2' : '#f5f5f5') : 'transparent',
        color: danger ? '#ef4444' : '#666',
        transition: 'all 0.1s',
        ...style,
      }}
    >
      {icon}
    </button>
  )
}

