/**
 * 属性面板 - 优化版（集成主题设置）
 */

import React from 'react'
import { useEditorStore } from '@store/editorStore'
import { findNode } from '@utils/schema'
import { PropValue } from '@types/material'
import { Trash2, Copy, ChevronDown } from 'lucide-react'
import { useMaterial, IPropSchema } from '@/core'
import { ThemeSettings } from './ThemeSettings'
import { RichTextEditor } from '@/components/RichTextEditor'

export const PropertyPanel: React.FC = () => {
  const { 
    selectedNodeIds, 
    pageSchema,
    updateNodeProps,
    updateNodeStyle,
    deleteNode,
    duplicateNode,
  } = useEditorStore()

  const nodeId = selectedNodeIds.length > 0 ? selectedNodeIds[0] : null
  const node = nodeId ? findNode(pageSchema.root, nodeId) : null
  const materialDef = useMaterial(node?.type || '')
  
  // 未选中或选中Page时，显示主题设置
  const isPageSelected = node?.type === 'Page'
  const shouldShowThemeSettings = !node || isPageSelected

  if (shouldShowThemeSettings) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        borderLeft: '1px solid #f1f1f1',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ 
          padding: '16px',
          borderBottom: '1px solid #f1f1f1',
        }}>
          <div style={{ 
            fontSize: '12px',
            fontWeight: '600',
            color: '#000',
            marginBottom: '2px',
          }}>
            主题设置
          </div>
          <div style={{ 
            fontSize: '11px',
            color: '#999',
          }}>
            统一管理简历样式
          </div>
        </div>
        
        <div style={{ flex: 1, overflow: 'auto' }}>
          <ThemeSettings />
        </div>
      </div>
    )
  }

  if (!materialDef) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        borderLeft: '1px solid #f1f1f1',
        backgroundColor: '#fff',
        padding: '20px',
      }}>
        <div style={{ color: '#f00', fontSize: '12px' }}>
          未知类型: {node?.type}
        </div>
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
    <div style={{
      width: '100%',
      height: '100%',
      borderLeft: '1px solid #f1f1f1',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 标题 */}
      <div style={{ 
        padding: '16px',
        borderBottom: '1px solid #f1f1f1',
      }}>
        <div style={{ 
          fontSize: '12px',
          fontWeight: '600',
          color: '#000',
          marginBottom: '2px',
        }}>
          {materialDef.meta.title}
        </div>
        <div style={{ 
          fontSize: '11px',
          color: '#999',
        }}>
          {materialDef.meta.description}
        </div>
      </div>

      {/* 操作 */}
      {(canCopy || canDelete) && (
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f1f1f1',
          display: 'flex',
          gap: '6px',
        }}>
          {canCopy && (
            <ActionButton
              icon={<Copy size={13} />}
              onClick={() => duplicateNode(nodeId!)}
            >
              复制
            </ActionButton>
          )}
          {canDelete && (
            <ActionButton
              icon={<Trash2 size={13} />}
              onClick={() => deleteNode(nodeId!)}
              danger
            >
              删除
            </ActionButton>
          )}
        </div>
      )}

      {/* 属性 */}
      <div style={{ 
        flex: 1,
        overflow: 'auto',
        padding: '16px',
      }}>
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
    <div style={{ marginBottom: '16px' }}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginBottom: collapsed ? '0' : '12px',
          padding: '4px 0',
        }}
      >
        <div style={{ 
          fontSize: '11px',
          fontWeight: '600',
          color: '#000',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {title}
        </div>
        <ChevronDown 
          size={14} 
          style={{ 
            color: '#999',
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
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
              onChange={(value) => onChange(propSchema.name, value)}
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
        height: '28px',
        padding: '0 10px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: hover ? (danger ? '#fff5f5' : '#fafafa') : 'transparent',
        color: danger ? '#f00' : '#666',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        fontSize: '12px',
        fontWeight: '500',
        transition: 'all 0.1s',
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

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.backgroundColor = '#fff'
      e.currentTarget.style.borderColor = '#e0e0e0'
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.backgroundColor = '#fafafa'
      e.currentTarget.style.borderColor = '#f1f1f1'
    }

    switch (schema.type) {
      case 'string':
        return (
          <input
            type="text"
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
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
            onChange={(e) => onChange(Number(e.target.value))}
            style={baseStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )
      
      case 'boolean':
        return (
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            height: '30px',
          }}>
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
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
              onChange={(e) => onChange(e.target.value)}
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
              onChange={(e) => onChange(e.target.value)}
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
            onChange={(e) => onChange(e.target.value)}
            style={{ 
              ...baseStyle, 
              cursor: 'pointer',
              paddingRight: '30px',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1L5 5L9 1\' stroke=\'%23999\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
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
          <textarea
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={schema.description}
            rows={4}
            style={{
              ...baseStyle,
              height: 'auto',
              padding: '8px 10px',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: '1.5',
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )
      
      case 'richtext':
        return (
          <RichTextEditor
            value={String(value || '')}
            onChange={(val) => onChange(val)}
            placeholder={schema.description}
            minHeight={schema.minHeight || 100}
          />
        )
      
      default:
        return (
          <input
            type="text"
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            style={baseStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )
    }
  }

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: '500',
        marginBottom: '6px',
        color: '#666',
      }}>
        {schema.label}
        {schema.required && <span style={{ color: '#f00' }}> *</span>}
      </label>
      {renderInput()}
      {schema.description && schema.type !== 'string' && schema.type !== 'textarea' && (
        <div style={{
          fontSize: '10px',
          color: '#999',
          marginTop: '4px',
        }}>
          {schema.description}
        </div>
      )}
    </div>
  )
}
