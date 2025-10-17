/**
 * 画布组件
 *
 * 核心编辑区域，负责渲染页面和处理交互
 */

import React, { useRef, useState } from 'react'
import { Renderer } from '@engine/Renderer'
import { useEditorStore } from '@store/editorStore'
import { useViewport } from '@/core/context/ViewportContext'
import { SelectionBox } from './SelectionBox'
import { ContextMenu, ContextMenuItem } from './ContextMenu'
import {
  Copy,
  Trash2,
  Clipboard,
  Scissors,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react'
import { findNode } from '@utils/schema'
import { templateManager } from '@/core/services/TemplateManager'
import { notification } from '@/utils/notification'
import { SaveAsTemplateDialog } from './SaveAsTemplateDialog'
import { EmptyCanvasGuide } from '@/components/EmptyCanvasGuide'

export const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { viewportMode } = useViewport()
  const {
    pageSchema,
    selectedNodeIds,
    hoveredNodeId,
    mode,
    canvasConfig,
    selectNode,
    setHoveredNode,
    clearSelection,
    copyNode,
    cutNode,
    pasteNode,
    clipboard,
    deleteNode,
    duplicateNode,
    moveNodeUp,
    moveNodeDown,
    toggleNodeVisibility,
  } = useEditorStore()

  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    nodeId: string | null
  } | null>(null)
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false)
  const [templateNodeId, setTemplateNodeId] = useState<string | null>(null)

  const handleNodeClick = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const isMultiSelect = event.metaKey || event.ctrlKey
    selectNode(nodeId, isMultiSelect)
    // 切换节点时关闭右键菜单
    setContextMenu(null)
  }

  const handleNodeHover = (nodeId: string | null) => {
    setHoveredNode(nodeId)
    // hover 到其他节点时关闭右键菜单
    if (nodeId && contextMenu && contextMenu.nodeId !== nodeId) {
      setContextMenu(null)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    // 关闭右键菜单
    setContextMenu(null)

    // 只有点击画布本身（而非子元素）时才取消选中
    if (e.target === e.currentTarget && selectedNodeIds.length > 0) {
      // 如果没有按 Ctrl/Cmd，才清除选择
      if (!e.metaKey && !e.ctrlKey) {
        clearSelection()
      }
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()

    if (mode !== 'edit') return

    // 查找最近的节点元素
    let target = e.target as HTMLElement
    let nodeId: string | null = null

    while (target && target !== containerRef.current) {
      const id = target.getAttribute('data-node-id')
      if (id) {
        nodeId = id
        break
      }
      target = target.parentElement as HTMLElement
    }

    // 如果右键点击的是节点，且该节点未选中，则选中它
    if (nodeId && !selectedNodeIds.includes(nodeId)) {
      selectNode(nodeId)
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      nodeId,
    })
  }

  // 构建右键菜单项
  const getContextMenuItems = (): ContextMenuItem[] => {
    const { nodeId } = contextMenu || {}
    const items: ContextMenuItem[] = []

    if (nodeId && selectedNodeIds.length === 1) {
      const node = findNode(pageSchema.root, nodeId)
      const isHidden = node?.hidden

      items.push(
        {
          id: 'copy',
          label: '复制',
          icon: <Copy size={16} />,
          shortcut: '⌘D',
        },
        {
          id: 'cut',
          label: '剪切',
          icon: <Scissors size={16} />,
          shortcut: '⌘X',
        },
        {
          id: 'duplicate',
          label: '快速复制',
          icon: <Copy size={16} />,
          shortcut: '⌘C',
        }
      )

      if (clipboard) {
        items.push({
          id: 'paste',
          label: '粘贴',
          icon: <Clipboard size={16} />,
          shortcut: '⌘V',
        })
      }

      // 不允许对 Page 进行某些操作
      const isPageNode = node?.type === 'Page'

      items.push(
        { id: 'divider-1', label: '', divider: true },
        {
          id: 'save-as-template',
          label: '保存为模板',
          icon: <Save size={16} />,
          disabled: isPageNode,
        },
        { id: 'divider-2', label: '', divider: true },
        {
          id: 'move-up',
          label: '上移一层',
          icon: <ArrowUp size={16} />,
          disabled: isPageNode,
        },
        {
          id: 'move-down',
          label: '下移一层',
          icon: <ArrowDown size={16} />,
          disabled: isPageNode,
        },
        { id: 'divider-3', label: '', divider: true },
        {
          id: 'toggle-visibility',
          label: isHidden ? '显示' : '隐藏',
          icon: isHidden ? <Eye size={16} /> : <EyeOff size={16} />,
          disabled: isPageNode, // Page 不允许隐藏
        },
        { id: 'divider-4', label: '', divider: true },
        {
          id: 'delete',
          label: '删除',
          icon: <Trash2 size={16} />,
          shortcut: 'Del',
          danger: true,
          disabled: isPageNode,
        }
      )
    } else if (clipboard) {
      // 画布右键菜单
      items.push({
        id: 'paste',
        label: '粘贴',
        icon: <Clipboard size={16} />,
        shortcut: '⌘V',
      })
    }

    return items
  }

  const handleContextMenuAction = (actionId: string) => {
    const { nodeId } = contextMenu || {}

    switch (actionId) {
      case 'copy':
        if (nodeId) copyNode(nodeId)
        break
      case 'cut':
        if (nodeId) cutNode(nodeId)
        break
      case 'duplicate':
        if (nodeId) duplicateNode(nodeId)
        break
      case 'paste':
        pasteNode(nodeId || undefined)
        break
      case 'delete':
        if (nodeId) deleteNode(nodeId)
        break
      case 'move-up':
        if (nodeId) moveNodeUp(nodeId)
        break
      case 'move-down':
        if (nodeId) moveNodeDown(nodeId)
        break
      case 'toggle-visibility':
        if (nodeId) toggleNodeVisibility(nodeId)
        break
      case 'save-as-template':
        if (nodeId) {
          setTemplateNodeId(nodeId)
          setShowSaveTemplateDialog(true)
        }
        break
    }
  }

  const handleSaveTemplate = (name: string, description: string, category: string) => {
    if (templateNodeId) {
      const node = findNode(pageSchema.root, templateNodeId)
      if (node) {
        templateManager.saveAsTemplate(node, name, description, category)
        notification.success('模板已保存！')

        // 触发模板列表刷新事件
        window.dispatchEvent(new CustomEvent('template-saved'))
      }
    }
    setShowSaveTemplateDialog(false)
    setTemplateNodeId(null)
  }

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      style={{
        flex: 1,
        height: '100vh',
        overflow: 'auto',
        backgroundColor: '#f8f9fa',
        padding: '20px 24px 80px 24px',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
      onClick={handleCanvasClick}
      onContextMenu={handleContextMenu}
    >
      <div
        data-canvas
        style={{
          transform: `scale(${canvasConfig.scale})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease',
          position: 'relative',
          // 移动端视口样式 - 只设置容器样式，不干预物料内部样式
          ...(viewportMode === 'mobile' && {
            maxWidth: '375px',
            width: '100%',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }),
        }}
      >
        <Renderer
          schema={pageSchema.root}
          isEditMode={mode === 'edit'}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          selectedNodeIds={selectedNodeIds}
          hoveredNodeId={hoveredNodeId}
        />
      </div>

      {/* 空画布引导 */}
      {mode === 'edit' &&
        (!pageSchema?.root?.children || pageSchema.root.children.length === 0) && (
          <EmptyCanvasGuide />
        )}

      {/* 框选组件 */}
      {mode === 'edit' && <SelectionBox containerRef={containerRef} />}

      {/* 右键菜单 */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getContextMenuItems()}
          onClose={() => setContextMenu(null)}
          onAction={handleContextMenuAction}
        />
      )}

      {/* 保存为模板对话框 */}
      {showSaveTemplateDialog && (
        <SaveAsTemplateDialog
          onSave={handleSaveTemplate}
          onClose={() => {
            setShowSaveTemplateDialog(false)
            setTemplateNodeId(null)
          }}
        />
      )}
    </div>
  )
}
