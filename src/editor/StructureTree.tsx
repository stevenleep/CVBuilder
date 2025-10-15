/**
 * 页面结构树（完整版）
 *
 * 显示页面的层级结构，支持拖拽调整、快捷操作
 */

import React, { useState } from 'react'
import { NodeSchema } from '@/types/material'
import { useEditorStore } from '@store/editorStore'
import { useMaterial } from '@/core'
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  Copy,
  Trash2,
  FileText,
  Box,
  Type,
  Image as ImageIcon,
  List,
  Table,
} from 'lucide-react'
import { useDrag, useDrop } from 'react-dnd'
import { DragItemTypes } from './DndProvider'
import { notification } from '@/utils/notification'

/**
 * 滚动到指定节点
 */
const scrollToNode = (nodeId: string) => {
  // 查找画布中的节点元素
  const element = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement

  if (element) {
    // 滚动到元素位置
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })

    // 添加短暂的高亮效果
    const originalTransition = element.style.transition
    const originalBoxShadow = element.style.boxShadow

    element.style.transition = 'box-shadow 0.3s ease'
    element.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)'

    setTimeout(() => {
      element.style.boxShadow = originalBoxShadow
      setTimeout(() => {
        element.style.transition = originalTransition
      }, 300)
    }, 600)
  }
}

interface StructureTreeProps {
  schema: NodeSchema
  level?: number
  onSelectNode?: (nodeId: string) => void
  selectedNodeIds?: string[]
}

export const StructureTree: React.FC<StructureTreeProps> = ({
  schema,
  level = 0,
  onSelectNode,
  selectedNodeIds = [],
}) => {
  // 跳过Page根节点 - 必须在所有 hooks 之前判断
  if (schema.type === 'Page' && level === 0) {
    return (
      <>
        {schema.children?.map(child => (
          <StructureTree
            key={child.id}
            schema={child}
            level={0}
            onSelectNode={onSelectNode}
            selectedNodeIds={selectedNodeIds}
          />
        ))}
      </>
    )
  }

  const [collapsed, setCollapsed] = useState(false)
  const [hover, setHover] = useState(false)
  const materialDef = useMaterial(schema.type)
  const hasChildren = schema.children && schema.children.length > 0
  const isSelected = selectedNodeIds.includes(schema.id)

  const { moveNodeTo, duplicateNode, deleteNode, toggleNodeVisibility } = useEditorStore()

  // 拖拽支持
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DragItemTypes.NODE,
      item: { type: DragItemTypes.NODE, nodeId: schema.id, nodeType: schema.type },
      canDrag: () => schema.type !== 'Page',
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [schema.id, schema.type]
  )

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: DragItemTypes.NODE,
      canDrop: (item: any) => {
        return item.nodeId !== schema.id && schema.type !== 'Page'
      },
      drop: (item: any, monitor) => {
        if (!monitor.isOver({ shallow: true })) return
        // 移动到此节点之前
        moveNodeTo(item.nodeId, schema.id, 'before')
      },
      collect: monitor => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }),
    [schema.id, schema.type, moveNodeTo]
  )

  const combineRefs = (el: HTMLDivElement | null) => {
    drag(el)
    drop(el)
  }

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleNodeVisibility(schema.id)
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    duplicateNode(schema.id)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmed = await notification.confirm({
      title: '确认删除',
      message: `确定删除"${materialDef?.meta.title || schema.type}"吗？`,
      type: 'warning',
    })
    if (confirmed) {
      deleteNode(schema.id)
    }
  }

  // 根据节点类型获取图标
  const getNodeIcon = () => {
    const type = schema.type.toLowerCase()
    const iconProps = { size: 13, style: { flexShrink: 0 } }

    if (type.includes('text') || type.includes('paragraph')) {
      return <Type {...iconProps} />
    }
    if (type.includes('image') || type.includes('avatar')) {
      return <ImageIcon {...iconProps} />
    }
    if (type.includes('list')) {
      return <List {...iconProps} />
    }
    if (type.includes('table')) {
      return <Table {...iconProps} />
    }
    if (type.includes('container') || type.includes('section')) {
      return <Box {...iconProps} />
    }
    return <FileText {...iconProps} />
  }

  return (
    <div style={{ opacity: isDragging ? 0.3 : 1, transition: 'opacity 0.2s' }}>
      {/* 拖放指示器 */}
      {isOver && canDrop && (
        <div
          style={{
            height: '4px',
            backgroundColor: '#6b7280',
            marginLeft: `${level * 16 + 8}px`,
            marginRight: '12px',
            borderRadius: '2px',
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}

      <div
        ref={combineRefs}
        onClick={e => {
          const isMultiSelect = e.metaKey || e.ctrlKey
          if (onSelectNode) {
            if (isMultiSelect) {
              // 多选模式：使用 store 的 selectNode 方法
              const { selectNode } = useEditorStore.getState()
              selectNode(schema.id, true)
            } else {
              onSelectNode(schema.id)
            }
          }

          // 滚动到对应的画布元素
          scrollToNode(schema.id)
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          paddingLeft: `${level * 16 + 8}px`,
          paddingRight: '12px',
          paddingTop: '8px',
          paddingBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          backgroundColor: isSelected
            ? 'rgba(0, 0, 0, 0.05)'
            : hover
              ? 'rgba(0, 0, 0, 0.04)'
              : 'transparent',
          borderRadius: '8px',
          transition: 'background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: schema.hidden ? 0.4 : 1,
          position: 'relative',
          margin: '2px 8px',
        }}
      >
        {/* 拖动手柄 */}
        <div
          style={{
            width: '18px',
            height: '18px',
            display: hover ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ccc',
            cursor: 'grab',
            flexShrink: 0,
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '4px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#666'
            e.currentTarget.style.backgroundColor = '#f0f0f0'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#ccc'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <GripVertical size={13} />
        </div>

        {/* 展开/折叠图标 */}
        {hasChildren ? (
          <div
            onClick={e => {
              e.stopPropagation()
              setCollapsed(!collapsed)
            }}
            style={{
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: collapsed ? '#bbb' : '#888',
              cursor: 'pointer',
              flexShrink: 0,
              borderRadius: '4px',
              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#1a1a1a'
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.08)'
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = collapsed ? '#bbb' : '#888'
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
          </div>
        ) : (
          <div style={{ width: '18px', flexShrink: 0 }} />
        )}

        {/* 节点类型图标 */}
        <div
          style={{
            display: 'flex',
            color: isSelected ? '#6b7280' : '#999',
            transition: 'color 0.15s',
          }}
        >
          {getNodeIcon()}
        </div>

        {/* 组件类型 */}
        <div
          style={{
            fontSize: '12px',
            color: isSelected ? '#6b7280' : '#1a1a1a',
            fontWeight: '600',
            flexShrink: 0,
            transition: 'color 0.15s',
            letterSpacing: '-0.01em',
          }}
        >
          {materialDef?.meta.title || schema.type}
        </div>

        {/* 组件内容预览 */}
        <div
          style={{
            fontSize: '11px',
            color: '#666',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            minWidth: 0,
            fontStyle: 'italic',
          }}
        >
          {getNodePreview(schema)}
        </div>

        {/* 快捷操作 */}
        {hover && (
          <div
            style={{
              display: 'flex',
              gap: '4px',
              flexShrink: 0,
            }}
            onClick={e => e.stopPropagation()}
          >
            <ActionBtn
              icon={schema.hidden ? <EyeOff size={12} /> : <Eye size={12} />}
              tooltip={schema.hidden ? '显示' : '隐藏'}
              onClick={handleToggleVisibility}
            />
            <ActionBtn icon={<Copy size={12} />} tooltip="复制" onClick={handleDuplicate} />
            <ActionBtn icon={<Trash2 size={12} />} tooltip="删除" onClick={handleDelete} danger />
          </div>
        )}

        {/* 子节点数量 */}
        {hasChildren && !hover && (
          <div
            style={{
              fontSize: '10px',
              color: '#ccc',
              flexShrink: 0,
            }}
          >
            {schema.children!.length}
          </div>
        )}
      </div>

      {/* 子节点 */}
      {hasChildren && !collapsed && (
        <div>
          {schema.children!.map(child => (
            <StructureTree
              key={child.id}
              schema={child}
              level={level + 1}
              onSelectNode={onSelectNode}
              selectedNodeIds={selectedNodeIds}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 快捷操作按钮
const ActionBtn: React.FC<{
  icon: React.ReactNode
  tooltip: string
  onClick: (e: React.MouseEvent) => void
  danger?: boolean
}> = ({ icon, tooltip, onClick, danger = false }) => {
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={tooltip}
      style={{
        width: '20px',
        height: '20px',
        border: 'none',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: hover ? (danger ? '#fef2f2' : '#f0f0f0') : 'transparent',
        color: danger ? '#ef4444' : '#666',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hover ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {icon}
    </button>
  )
}

// 获取节点内容预览
function getNodePreview(schema: NodeSchema): string {
  const props = schema.props || {}

  // 根据类型返回不同的预览
  if (props.name && typeof props.name === 'string') return props.name
  if (props.title && typeof props.title === 'string') return props.title
  if (props.company && typeof props.company === 'string') return props.company
  if (props.school && typeof props.school === 'string') return props.school
  if (props.projectName && typeof props.projectName === 'string') return props.projectName
  if (props.text && typeof props.text === 'string') return props.text
  if (props.content && typeof props.content === 'string') {
    // 移除HTML标签，只显示文本
    const text = props.content.replace(/<[^>]*>/g, '').substring(0, 30)
    return text || ''
  }
  if (props.skills && typeof props.skills === 'string') return props.skills.substring(0, 30)

  return ''
}

// 完整的结构树面板
export const StructurePanel: React.FC = () => {
  const { pageSchema, selectedNodeIds, selectNode } = useEditorStore()

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fefefe',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 标题 */}
      <div
        style={{
          padding: '16px 18px 14px 18px',
          borderBottom: '1px solid #e8e8e8',
          backgroundColor: '#f8f9fa',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%)',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#1a1a1a',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          页面结构
        </div>
      </div>

      {/* 树形列表 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '12px 0',
        }}
      >
        <StructureTree
          schema={pageSchema.root}
          level={0}
          onSelectNode={selectNode}
          selectedNodeIds={selectedNodeIds}
        />
      </div>

      {/* 底部提示 */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid #e8e8e8',
          fontSize: '11px',
          color: '#666',
          lineHeight: '1.5',
          backgroundColor: '#f8f9fa',
        }}
      >
        💡 Ctrl+点击多选 · Ctrl+A全选 · 拖拽调整顺序
      </div>
    </div>
  )
}
