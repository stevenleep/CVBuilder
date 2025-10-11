/**
 * 属性面板 - 优化版（集成主题设置）
 */

import React from 'react'
import { useEditorStore } from '@store/editorStore'
import { findNode } from '@utils/schema'
import type { PropValue } from '../types/material'
import { Trash2, Copy, ChevronDown, Plus, X } from 'lucide-react'
import { useMaterial, IPropSchema } from '@/core'
import { ThemeSettings } from './ThemeSettings'
import { QuillEditor, SimpleTextarea } from '@/components/QuillEditor'

export const PropertyPanel: React.FC = () => {
  const { selectedNodeIds, pageSchema, updateNodeProps, deleteNode, duplicateNode } =
    useEditorStore()

  const nodeId = selectedNodeIds.length > 0 ? selectedNodeIds[0] : null
  const node = nodeId ? findNode(pageSchema.root, nodeId) : null
  const materialDef = useMaterial(node?.type || '')

  // 未选中或选中Page时，显示主题设置
  const isPageSelected = node?.type === 'Page'
  const shouldShowThemeSettings = !node || isPageSelected

  if (shouldShowThemeSettings) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderLeft: '1px solid #e8e8e8',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '14px',
            borderBottom: '1px solid #e8e8e8',
            backgroundColor: '#fff',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#2d2d2d',
              marginBottom: '3px',
            }}
          >
            主题设置
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#999',
            }}
          >
            统一管理简历样式
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '12px', backgroundColor: '#fafafa' }}>
          <ThemeSettings />
        </div>
      </div>
    )
  }

  if (!materialDef) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderLeft: '1px solid #f1f1f1',
          backgroundColor: '#fff',
          padding: '20px',
        }}
      >
        <div style={{ color: '#f00', fontSize: '12px' }}>未知类型: {node?.type}</div>
      </div>
    )
  }

  const handlePropChange = (propName: string, value: PropValue) => {
    updateNodeProps(nodeId!, { [propName]: value })
  }

  const capabilities = materialDef.capabilities || {}
  const canDelete = capabilities.deletable !== false
  const canCopy = capabilities.copyable !== false

  const groupedProps: Record<string, IPropSchema[]> = {}
  materialDef.propsSchema.forEach(prop => {
    if (prop.hidden) return
    if (prop.visibleWhen && !prop.visibleWhen(node.props || {})) return

    const group = prop.group || '属性'
    if (!groupedProps[group]) {
      groupedProps[group] = []
    }
    groupedProps[group].push(prop)
  })

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderLeft: '1px solid #e8e8e8',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 标题 */}
      <div
        style={{
          padding: '14px',
          borderBottom: '1px solid #e8e8e8',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#2d2d2d',
            marginBottom: '3px',
          }}
        >
          {materialDef.meta.title}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: '#999',
          }}
        >
          {materialDef.meta.description}
        </div>
      </div>

      {/* 操作 */}
      {(canCopy || canDelete) && (
        <div
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid #e8e8e8',
            display: 'flex',
            gap: '6px',
            backgroundColor: '#fff',
          }}
        >
          {canCopy && (
            <ActionButton icon={<Copy size={13} />} onClick={() => duplicateNode(nodeId!)}>
              复制
            </ActionButton>
          )}
          {canDelete && (
            <ActionButton icon={<Trash2 size={13} />} onClick={() => deleteNode(nodeId!)} danger>
              删除
            </ActionButton>
          )}
        </div>
      )}

      {/* 属性 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '12px',
          backgroundColor: '#fafafa',
        }}
      >
        {Object.entries(groupedProps).map(([group, props]) => (
          <PropertyGroup
            key={group}
            title={group}
            props={props}
            nodeProps={node.props || {}}
            onChange={handlePropChange}
          />
        ))}
      </div>
    </div>
  )
}

// 属性分组
const PropertyGroup: React.FC<{
  title: string
  props: IPropSchema[]
  nodeProps: Record<string, any>
  onChange: (name: string, value: PropValue) => void
}> = ({ title, props, nodeProps, onChange }) => {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div style={{ marginBottom: '14px' }}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: collapsed ? '0' : '10px',
          padding: '5px 2px',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: '700',
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
          }}
        >
          {title}
        </div>
        <ChevronDown
          size={13}
          style={{
            color: '#bbb',
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.12s',
          }}
        />
      </div>

      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {props.map(propSchema => (
            <PropertyInput
              key={propSchema.name}
              schema={propSchema}
              value={nodeProps[propSchema.name] ?? propSchema.defaultValue}
              onChange={value => onChange(propSchema.name, value)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const ActionButton: React.FC<{
  icon: React.ReactNode
  onClick: () => void
  children: React.ReactNode
  danger?: boolean
}> = ({ icon, onClick, children, danger = false }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        height: '32px',
        padding: '0 12px',
        border: `1px solid ${danger ? '#fecaca' : '#e8e8e8'}`,
        borderRadius: '6px',
        backgroundColor: hover ? (danger ? '#fef2f2' : '#fafafa') : '#fff',
        color: danger ? '#ef4444' : '#666',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: '600',
        transition: 'all 0.15s',
      }}
    >
      {icon}
      {children}
    </button>
  )
}

const PropertyInput: React.FC<{
  schema: IPropSchema
  value: PropValue
  onChange: (value: PropValue) => void
}> = ({ schema, value, onChange }) => {
  const renderInput = () => {
    const baseStyle: React.CSSProperties = {
      width: '100%',
      height: '30px',
      padding: '0 10px',
      border: '1px solid #f1f1f1',
      borderRadius: '4px',
      fontSize: '12px',
      outline: 'none',
      backgroundColor: '#fafafa',
      color: '#000',
      transition: 'all 0.1s',
    }

    const handleFocus = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      e.currentTarget.style.backgroundColor = '#fff'
      e.currentTarget.style.borderColor = '#e0e0e0'
    }

    const handleBlur = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      e.currentTarget.style.backgroundColor = '#fafafa'
      e.currentTarget.style.borderColor = '#f1f1f1'
    }

    switch (schema.type) {
      case 'string':
        return (
          <input
            type="text"
            value={String(value || '')}
            onChange={e => onChange(e.target.value)}
            placeholder={schema.description}
            style={baseStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={Number(value || 0)}
            onChange={e => onChange(Number(e.target.value))}
            style={baseStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )

      case 'boolean':
        return (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              height: '30px',
            }}
          >
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={e => onChange(e.target.checked)}
              style={{
                width: '14px',
                height: '14px',
                cursor: 'pointer',
                accentColor: '#000',
              }}
            />
            <span style={{ fontSize: '12px', color: '#666' }}>启用</span>
          </label>
        )

      case 'color':
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="color"
              value={String(value || '#000000')}
              onChange={e => onChange(e.target.value)}
              style={{
                width: '30px',
                height: '30px',
                border: '1px solid #f1f1f1',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: '2px',
              }}
            />
            <input
              type="text"
              value={String(value || '#000000')}
              onChange={e => onChange(e.target.value)}
              style={{
                ...baseStyle,
                flex: 1,
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
        )

      case 'select':
        return (
          <select
            value={String(value || '')}
            onChange={e => onChange(e.target.value)}
            style={{
              ...baseStyle,
              cursor: 'pointer',
              paddingRight: '30px',
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              appearance: 'none',
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {schema.options?.map(opt => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      case 'textarea':
        return (
          <SimpleTextarea
            value={String(value || '')}
            onChange={val => onChange(val)}
            placeholder={schema.description}
            rows={4}
          />
        )

      case 'richtext':
        return (
          <QuillEditor
            value={String(value || '')}
            onChange={val => onChange(val)}
            placeholder={schema.description}
            minHeight={schema.minHeight || 100}
            simple={false}
          />
        )

      case 'array':
        return <ArrayInput value={(value as any[]) || []} onChange={onChange} schema={schema} />

      default:
        return (
          <input
            type="text"
            value={String(value || '')}
            onChange={e => onChange(e.target.value)}
            style={baseStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )
    }
  }

  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: '600',
          marginBottom: '5px',
          color: '#666',
        }}
      >
        {schema.label}
        {schema.required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {renderInput()}
      {schema.description && schema.type !== 'string' && schema.type !== 'textarea' && (
        <div
          style={{
            fontSize: '11px',
            color: '#bbb',
            marginTop: '4px',
            lineHeight: '1.4',
          }}
        >
          {schema.description}
        </div>
      )}
    </div>
  )
}

// 数组输入组件
const ArrayInput: React.FC<{
  value: any[]
  onChange: (value: any[]) => void
  schema: IPropSchema
}> = ({ value, onChange, schema }) => {
  const items = Array.isArray(value) ? value : []

  const handleAddItem = () => {
    const newItem: any = {}
    schema.itemSchema?.forEach(field => {
      newItem[field.name] = field.defaultValue ?? ''
    })
    onChange([...items, newItem])
  }

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, fieldName: string, fieldValue: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [fieldName]: fieldValue }
    onChange(newItems)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            padding: '10px',
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* 删除按钮 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => handleRemoveItem(index)}
              style={{
                width: '20px',
                height: '20px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#fef2f2',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="删除"
            >
              <X size={12} />
            </button>
          </div>

          {/* 字段输入 */}
          {schema.itemSchema?.map(field => (
            <div key={field.name}>
              <label
                style={{
                  display: 'block',
                  fontSize: '10px',
                  fontWeight: '600',
                  marginBottom: '4px',
                  color: '#999',
                }}
              >
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  value={item[field.name] ?? field.defaultValue ?? ''}
                  onChange={e => handleItemChange(index, field.name, e.target.value)}
                  style={{
                    width: '100%',
                    height: '28px',
                    padding: '0 8px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '4px',
                    fontSize: '12px',
                    outline: 'none',
                    backgroundColor: '#fafafa',
                    cursor: 'pointer',
                  }}
                >
                  {field.options?.map(opt => (
                    <option key={String(opt.value)} value={String(opt.value)}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  value={item[field.name] ?? field.defaultValue ?? 0}
                  onChange={e => handleItemChange(index, field.name, Number(e.target.value))}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    height: '28px',
                    padding: '0 8px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '4px',
                    fontSize: '12px',
                    outline: 'none',
                    backgroundColor: '#fafafa',
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={item[field.name] ?? field.defaultValue ?? ''}
                  onChange={e => handleItemChange(index, field.name, e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    height: '28px',
                    padding: '0 8px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '4px',
                    fontSize: '12px',
                    outline: 'none',
                    backgroundColor: '#fafafa',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      {/* 添加按钮 */}
      <button
        onClick={handleAddItem}
        style={{
          height: '32px',
          padding: '0 12px',
          border: '1px dashed #e8e8e8',
          borderRadius: '6px',
          backgroundColor: '#fafafa',
          color: '#666',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: '600',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#f0f0f0'
          e.currentTarget.style.borderColor = '#d0d0d0'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#fafafa'
          e.currentTarget.style.borderColor = '#e8e8e8'
        }}
      >
        <Plus size={14} />
        添加项
      </button>
    </div>
  )
}
