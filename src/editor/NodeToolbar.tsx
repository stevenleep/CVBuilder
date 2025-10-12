/**
 * 节点浮动工具栏 - 智能定位版
 *
 * 选中时显示，自动判断上下位置
 */

import React from 'react'
import {
  GripVertical,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react'
import { IMaterialAction } from '@/core'

interface NodeToolbarProps {
  nodeId: string
  actions?: IMaterialAction[]
  isHidden?: boolean
  onCopy?: () => void
  onDelete?: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onAddBefore?: () => void
  onAddAfter?: () => void
  onSaveAsTemplate?: () => void
  onToggleVisibility?: () => void
  onCustomAction?: (actionId: string) => void
  capabilities?: {
    copyable?: boolean
    deletable?: boolean
    moveable?: boolean
  }
}

export const NodeToolbar: React.FC<NodeToolbarProps> = ({
  actions = [],
  isHidden = false,
  onCopy,
  onDelete,
  onMoveUp,
  onMoveDown,
  onSaveAsTemplate,
  onToggleVisibility,
  onCustomAction,
  capabilities = {},
}) => {
  const { copyable = true, deletable = true, moveable = true } = capabilities

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        marginTop: '6px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '2px',
        backgroundColor: '#2d2d2d',
        border: '1px solid #3d3d3d',
        borderRadius: '6px',
        padding: '3px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
        zIndex: 100000,
        pointerEvents: 'auto',
        whiteSpace: 'nowrap',
      }}
      onClick={e => {
        e.stopPropagation()
        e.preventDefault()
      }}
      onMouseDown={e => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      {/* 拖动手柄 */}
      {moveable && (
        <ToolButton icon={<GripVertical size={13} />} tooltip="拖动" style={{ cursor: 'grab' }} />
      )}

      {/* 上移下移 */}
      {moveable && onMoveUp && (
        <ToolButton icon={<ChevronUp size={13} />} tooltip="上移" onClick={onMoveUp} />
      )}
      {moveable && onMoveDown && (
        <ToolButton icon={<ChevronDown size={13} />} tooltip="下移" onClick={onMoveDown} />
      )}

      <div
        style={{
          width: '1px',
          height: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          margin: '0 3px',
        }}
      />

      {/* 复制 */}
      {copyable && <ToolButton icon={<Copy size={13} />} tooltip="复制" onClick={onCopy} />}

      {/* 保存为模板 */}
      {onSaveAsTemplate && (
        <ToolButton icon={<Save size={13} />} tooltip="保存为模板" onClick={onSaveAsTemplate} />
      )}

      <div
        style={{
          width: '1px',
          height: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          margin: '0 3px',
        }}
      />

      {/* 显示/隐藏 */}
      {onToggleVisibility && (
        <ToolButton
          icon={isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
          tooltip={isHidden ? '显示' : '隐藏'}
          onClick={onToggleVisibility}
        />
      )}

      {/* 删除 */}
      {deletable && (
        <ToolButton icon={<Trash2 size={13} />} tooltip="删除" onClick={onDelete} danger />
      )}

      {/* 自定义Actions */}
      {actions.length > 0 && (
        <>
          <div
            style={{
              width: '1px',
              height: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              margin: '0 3px',
            }}
          />
          {actions.slice(0, 2).map(action => (
            <ToolButton
              key={action.id}
              icon={
                action.icon ? (
                  <span style={{ fontSize: '12px' }}>{action.icon}</span>
                ) : (
                  <Plus size={14} />
                )
              }
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
      onClick={e => {
        e.stopPropagation()
        onClick?.()
      }}
      onMouseDown={e => e.stopPropagation()}
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
        backgroundColor: hover
          ? danger
            ? 'rgba(239, 68, 68, 0.2)'
            : 'rgba(255, 255, 255, 0.15)'
          : 'transparent',
        color: danger ? '#fca5a5' : hover ? 'white' : 'rgba(255, 255, 255, 0.7)',
        transition: 'all 0.12s',
        ...style,
      }}
    >
      {icon}
    </button>
  )
}
