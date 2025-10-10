/**
 * 键盘快捷键帮助对话框
 */

import React from 'react'
import { X } from 'lucide-react'
import { getKeyboardShortcuts } from '@/core/hooks/useKeyboardShortcuts'
import { useEditorStore } from '@/store/editorStore'
import { useMaterialRegistry } from '@/core'
import { findNode } from '@/utils/schema'

interface KeyboardShortcutsHelpProps {
  onClose: () => void
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ onClose }) => {
  const shortcuts = getKeyboardShortcuts()
  const { selectedNodeIds, pageSchema } = useEditorStore()
  const materialRegistry = useMaterialRegistry()

  // 获取选中物料的自定义快捷键
  let materialShortcuts: Array<{ key: string; description: string }> = []
  let selectedMaterialName = ''
  
  if (selectedNodeIds.length === 1) {
    const node = findNode(pageSchema.root, selectedNodeIds[0])
    if (node) {
      const materialDef = materialRegistry.get(node.type)
      if (materialDef?.shortcuts && materialDef.shortcuts.length > 0) {
        selectedMaterialName = materialDef.meta.title
        materialShortcuts = materialDef.shortcuts.map(s => {
          const cmdKey = isMac ? '⌘' : 'Ctrl'
          let keyCombo = ''
          if (s.ctrl) keyCombo += `${cmdKey} + `
          if (s.shift) keyCombo += 'Shift + '
          if (s.alt) keyCombo += 'Alt + '
          keyCombo += s.key.toUpperCase()
          
          return {
            key: keyCombo,
            description: s.description,
          }
        })
      }
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          width: '480px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: 0,
              color: '#000',
            }}
          >
            键盘快捷键
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 全局快捷键列表 */}
        <div>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#666',
              marginBottom: '12px',
              marginTop: 0,
            }}
          >
            全局快捷键
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#fafafa',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    color: '#333',
                  }}
                >
                  {shortcut.description}
                </span>
                <kbd
                  style={{
                    fontFamily: 'SF Mono, Monaco, Consolas, monospace',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#666',
                    backgroundColor: 'white',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* 物料专属快捷键 */}
        {materialShortcuts.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#666',
                marginBottom: '12px',
                marginTop: 0,
              }}
            >
              {selectedMaterialName} 专属快捷键
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {materialShortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#0c4a6e',
                    }}
                  >
                    {shortcut.description}
                  </span>
                  <kbd
                    style={{
                      fontFamily: 'SF Mono, Monaco, Consolas, monospace',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#0369a1',
                      backgroundColor: 'white',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #bae6fd',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 提示文字 */}
        <div
          style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#0369a1',
            lineHeight: '1.5',
          }}
        >
          💡 提示: 按 <kbd style={{
            fontFamily: 'SF Mono, Monaco, Consolas, monospace',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #bae6fd',
          }}>?</kbd> 可随时查看快捷键列表
        </div>
      </div>
    </div>
  )
}

