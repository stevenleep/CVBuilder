/**
 * 键盘快捷键 Hook
 *
 * 管理编辑器的键盘快捷键
 */

import { useEffect, useCallback } from 'react'
import { useEditorStore } from '@store/editorStore'
import { useMaterialRegistry } from '@/core'
import { findNode } from '@utils/schema'
import { notification } from '@/utils/notification'
import type { NodeSchema } from '@/types/material'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
  description: string
  action: () => void
}

/**
 * 检测是否为 Mac 系统
 */
const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

/**
 * 使用键盘快捷键
 */
export const useKeyboardShortcuts = (onShowHelp?: () => void) => {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    saveToStorage,
    deleteNode,
    duplicateNode,
    clearSelection,
    selectedNodeIds,
    mode,
    copyNode,
    cutNode,
    pasteNode,
    pasteMultiNodes,
    clipboard,
    selectNode,
    selectAll,
    pageSchema,
    copyNodes,
    deleteNodes,
    duplicateNodes,
  } = useEditorStore()

  const materialRegistry = useMaterialRegistry()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 如果在输入框中，不触发快捷键
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      // 只在编辑模式下启用编辑相关的快捷键
      const isEditMode = mode === 'edit'

      const { key, ctrlKey, metaKey, shiftKey } = event
      const cmdKey = isMac ? metaKey : ctrlKey

      // Cmd/Ctrl + Z: 撤销
      if (cmdKey && !shiftKey && key.toLowerCase() === 'z') {
        event.preventDefault()
        if (canUndo()) {
          undo()
        }
        return
      }

      // Cmd/Ctrl + Shift + Z: 重做
      if (cmdKey && shiftKey && key.toLowerCase() === 'z') {
        event.preventDefault()
        if (canRedo()) {
          redo()
        }
        return
      }

      // Cmd/Ctrl + Y: 重做（Windows 风格）
      if (!isMac && ctrlKey && key.toLowerCase() === 'y') {
        event.preventDefault()
        if (canRedo()) {
          redo()
        }
        return
      }

      // Cmd/Ctrl + S: 保存
      if (cmdKey && key.toLowerCase() === 's') {
        event.preventDefault()
        saveToStorage()

        // 显示保存提示
        notification.info('已保存', 1500)
        return
      }

      if (!isEditMode) return

      // Delete/Backspace: 删除选中的节点（支持多选）
      if ((key === 'Delete' || key === 'Backspace') && selectedNodeIds.length > 0) {
        event.preventDefault()
        if (selectedNodeIds.length === 1) {
          deleteNode(selectedNodeIds[0])
        } else {
          deleteNodes(selectedNodeIds)
        }
        return
      }

      // Cmd/Ctrl + D: 快速复制选中的节点（支持多选）
      if (cmdKey && key.toLowerCase() === 'd' && selectedNodeIds.length > 0) {
        event.preventDefault()
        if (selectedNodeIds.length === 1) {
          duplicateNode(selectedNodeIds[0])
        } else {
          duplicateNodes(selectedNodeIds)
        }
        notification.info(`已复制 ${selectedNodeIds.length} 个节点`, 1500)
        return
      }

      // Cmd/Ctrl + C: 复制到剪贴板（支持多选）
      if (cmdKey && key.toLowerCase() === 'c' && selectedNodeIds.length > 0) {
        event.preventDefault()
        if (selectedNodeIds.length === 1) {
          copyNode(selectedNodeIds[0])
          notification.info('已复制', 1500)
        } else {
          copyNodes(selectedNodeIds)
          notification.info(`已复制 ${selectedNodeIds.length} 个节点`, 1500)
        }
        return
      }

      // Cmd/Ctrl + X: 剪切到剪贴板（支持多选）
      if (cmdKey && key.toLowerCase() === 'x' && selectedNodeIds.length > 0) {
        event.preventDefault()
        if (selectedNodeIds.length === 1) {
          cutNode(selectedNodeIds[0])
          notification.info('已剪切', 1500)
        } else {
          // 多选时只删除，不支持剪切
          deleteNodes(selectedNodeIds)
          notification.info(`已删除 ${selectedNodeIds.length} 个节点`, 1500)
        }
        return
      }

      // Cmd/Ctrl + V: 从剪贴板粘贴（支持批量粘贴）
      if (cmdKey && key.toLowerCase() === 'v' && clipboard) {
        event.preventDefault()

        // 检查是否为多节点剪贴板
        if (clipboard.type === '__MultiCopy__' && clipboard.props?.nodes) {
          pasteMultiNodes()
          const nodes = clipboard.props.nodes as NodeSchema[]
          notification.info(`已粘贴 ${nodes.length} 个节点`, 1500)
        } else {
          // 单节点粘贴
          const targetId = selectedNodeIds.length === 1 ? selectedNodeIds[0] : undefined
          pasteNode(targetId)
          notification.info('已粘贴', 1500)
        }
        return
      }

      // Cmd/Ctrl + A: 全选
      if (cmdKey && key.toLowerCase() === 'a') {
        event.preventDefault()
        selectAll()
        return
      }

      // Escape: 取消选中
      if (key === 'Escape' && selectedNodeIds.length > 0) {
        event.preventDefault()
        clearSelection()
        return
      }

      // ?: 显示快捷键帮助
      if ((key === '?' || key === '/') && !cmdKey && !shiftKey && onShowHelp) {
        event.preventDefault()
        onShowHelp()
        return
      }

      // 处理物料自定义快捷键
      if (isEditMode && selectedNodeIds.length === 1) {
        const selectedNodeId = selectedNodeIds[0]
        const node = findNode(pageSchema.root, selectedNodeId)

        if (node) {
          const materialDef = materialRegistry.get(node.type)

          if (materialDef?.shortcuts) {
            for (const shortcut of materialDef.shortcuts) {
              const keyMatch = key.toLowerCase() === shortcut.key.toLowerCase()
              const ctrlMatch = !shortcut.ctrl || (shortcut.ctrl && cmdKey)
              const shiftMatch = !shortcut.shift || (shortcut.shift && shiftKey)
              const altMatch = !shortcut.alt || (shortcut.alt && event.altKey)

              if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
                event.preventDefault()

                // 创建物料上下文
                const context = {
                  nodeId: selectedNodeId,
                  materialType: node.type,
                  props: node.props || {},
                  style: node.style || {},
                  childrenIds: node.children?.map((c: { id: string }) => c.id) || [],
                  emit: () => {},
                  on: () => () => {},
                  getEditorAPI: () => ({
                    selectNode,
                    updateNodeProps: (
                      id: string,
                      props: Record<string, string | number | boolean | null>
                    ) => useEditorStore.getState().updateNodeProps(id, props),
                    updateNodeStyle: (id: string, style: React.CSSProperties) =>
                      useEditorStore.getState().updateNodeStyle(id, style),
                    deleteNode: (id: string) => useEditorStore.getState().deleteNode(id),
                    addNode: (materialType: string, parentId?: string) => {
                      useEditorStore.getState().addNode(materialType, parentId)
                      return ''
                    },
                    findNode: (id: string) => findNode(pageSchema.root, id),
                  }),
                }

                shortcut.handler(context)
                return
              }
            }
          }
        }
      }
    },
    [
      undo,
      redo,
      canUndo,
      canRedo,
      saveToStorage,
      deleteNode,
      duplicateNode,
      clearSelection,
      selectedNodeIds,
      mode,
      onShowHelp,
      copyNode,
      cutNode,
      pasteNode,
      pasteMultiNodes,
      clipboard,
      selectNode,
      selectAll,
      pageSchema,
      materialRegistry,
      copyNodes,
      deleteNodes,
      duplicateNodes,
    ]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

/**
 * 获取快捷键列表（用于显示帮助）
 */
export function getKeyboardShortcuts(): KeyboardShortcut[] {
  const cmdKey = isMac ? '⌘' : 'Ctrl'

  return [
    {
      key: `${cmdKey} + Z`,
      description: '撤销',
      action: () => {},
    },
    {
      key: `${cmdKey} + Shift + Z`,
      description: '重做',
      action: () => {},
    },
    {
      key: `${cmdKey} + S`,
      description: '保存',
      action: () => {},
    },
    {
      key: `${cmdKey} + C`,
      description: '复制到剪贴板',
      action: () => {},
    },
    {
      key: `${cmdKey} + X`,
      description: '剪切到剪贴板',
      action: () => {},
    },
    {
      key: `${cmdKey} + V`,
      description: '粘贴',
      action: () => {},
    },
    {
      key: `${cmdKey} + D`,
      description: '快速复制节点',
      action: () => {},
    },
    {
      key: 'Delete / Backspace',
      description: '删除选中节点',
      action: () => {},
    },
    {
      key: `${cmdKey} + A`,
      description: '全选',
      action: () => {},
    },
    {
      key: 'Esc',
      description: '取消选中',
      action: () => {},
    },
    {
      key: '?',
      description: '显示快捷键帮助',
      action: () => {},
    },
  ]
}
