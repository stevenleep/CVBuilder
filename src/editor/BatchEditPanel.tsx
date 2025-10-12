/**
 * 批量编辑面板
 *
 * 当选中多个节点时，支持批量修改共同属性
 */

import React, { useState } from 'react'
import { useEditorStore } from '@/store/editorStore'
import { Edit3, Check, X } from 'lucide-react'

export const BatchEditPanel: React.FC = () => {
  const { selectedNodeIds, updateNodeProps } = useEditorStore()
  const [isOpen, setIsOpen] = useState(false)
  const [batchStyle, setBatchStyle] = useState({
    marginTop: '',
    marginBottom: '',
    paddingTop: '',
    paddingBottom: '',
  })

  if (selectedNodeIds.length <= 1) return null

  const handleApply = () => {
    const style: React.CSSProperties = {}
    if (batchStyle.marginTop) style.marginTop = `${batchStyle.marginTop}px`
    if (batchStyle.marginBottom) style.marginBottom = `${batchStyle.marginBottom}px`
    if (batchStyle.paddingTop) style.paddingTop = `${batchStyle.paddingTop}px`
    if (batchStyle.paddingBottom) style.paddingBottom = `${batchStyle.paddingBottom}px`

    selectedNodeIds.forEach(nodeId => {
      updateNodeProps(nodeId, { style })
    })

    setIsOpen(false)
    setBatchStyle({ marginTop: '', marginBottom: '', paddingTop: '', paddingBottom: '' })
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        zIndex: 1000,
        minWidth: isOpen ? '320px' : '180px',
        transition: 'all 0.3s',
      }}
    >
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#2d2d2d',
          }}
        >
          <Edit3 size={16} />
          批量编辑 ({selectedNodeIds.length} 个节点)
        </button>
      ) : (
        <div style={{ padding: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#2d2d2d' }}>
              批量编辑 ({selectedNodeIds.length} 个节点)
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                padding: '4px',
                color: '#999',
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'].map(key => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '11px', color: '#666', minWidth: '70px' }}>
                  {key === 'marginTop' && '上边距'}
                  {key === 'marginBottom' && '下边距'}
                  {key === 'paddingTop' && '上内边距'}
                  {key === 'paddingBottom' && '下内边距'}
                </label>
                <input
                  type="number"
                  value={(batchStyle as any)[key]}
                  onChange={e => setBatchStyle({ ...batchStyle, [key]: e.target.value })}
                  placeholder="px"
                  style={{
                    flex: 1,
                    height: '28px',
                    padding: '0 8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleApply}
            style={{
              width: '100%',
              marginTop: '12px',
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#2d2d2d',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Check size={14} />
            应用更改
          </button>
        </div>
      )}
    </div>
  )
}
