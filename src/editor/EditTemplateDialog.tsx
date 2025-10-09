/**
 * 编辑模板对话框（完整版）
 * 
 * 支持编辑模板信息和内容
 */

import React, { useState } from 'react'
import { CustomTemplate, templateManager } from '@/core/services/TemplateManager'
import { Renderer } from '@/engine/Renderer'
import { findNode, updateNodeProps } from '@utils/schema'
import { useMaterial, IPropSchema } from '@/core'
import { PropValue } from '@/types/material'
import { Trash2, Copy, ChevronDown } from 'lucide-react'
import { RichTextEditor } from '@/components/RichTextEditor'

interface EditTemplateDialogProps {
  template: CustomTemplate
  onSave: (name: string, description: string, category: string) => void
  onClose: () => void
}

export const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({
  template,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(template.name)
  const [description, setDescription] = useState(template.description || '')
  const [category, setCategory] = useState(template.category)
  const [templateSchema, setTemplateSchema] = useState(template.schema)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'content'>('info')
  const [dialogSize, setDialogSize] = useState({ width: 900, height: 700 })
  const [isResizing, setIsResizing] = useState(false)
  const dialogRef = React.useRef<HTMLDivElement>(null)

  const selectedNode = selectedNodeId ? findNode(templateSchema, selectedNodeId) : null
  const materialDef = useMaterial(selectedNode?.type || '')

  // 拖动调整大小
  React.useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!dialogRef.current) return
      const rect = dialogRef.current.getBoundingClientRect()
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      // 计算新尺寸（从中心扩展）
      const newWidth = Math.max(600, Math.min(1200, (e.clientX - centerX) * 2 + dialogSize.width / 2))
      const newHeight = Math.max(500, Math.min(900, (e.clientY - centerY) * 2 + dialogSize.height / 2))
      
      setDialogSize({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, dialogSize])

  const handleResizeStart = () => {
    setIsResizing(true)
    document.body.style.cursor = 'nwse-resize'
    document.body.style.userSelect = 'none'
  }

  const handleSave = () => {
    if (!name.trim()) {
      alert('请输入模板名称')
      return
    }
    // 保存模板信息
    onSave(name, description, category)
    // 保存模板内容
    templateManager.updateTemplate(template.id, templateSchema)
    onClose()
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId)
  }

  const handleUpdateNodeProps = (nodeId: string, props: Record<string, PropValue>) => {
    const newSchema = updateNodeProps(templateSchema, nodeId, props)
    setTemplateSchema(newSchema)
  }
  
  const handleDeleteNode = (nodeId: string) => {
    // 简化版：不允许在模板编辑中删除
    alert('请在主界面编辑完整内容后重新保存模板')
  }
  
  const handleDuplicateNode = (nodeId: string) => {
    // 简化版：不允许在模板编辑中复制
    alert('请在主界面编辑完整内容后重新保存模板')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          width: `${dialogSize.width}px`,
          height: `${dialogSize.height}px`,
          maxWidth: '95vw',
          maxHeight: '90vh',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f1f1',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#000',
          }}>
            编辑模板
          </h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              fontSize: '11px',
              color: '#999',
            }}>
              {dialogSize.width} × {dialogSize.height}
            </div>
            <button
              onClick={onClose}
              style={{
                width: '24px',
                height: '24px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#999',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Tab切换 */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '12px 24px',
          borderBottom: '1px solid #f1f1f1',
          backgroundColor: '#fafafa',
        }}>
          {[
            { id: 'info', label: '模板信息' },
            { id: 'content', label: '编辑内容' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '6px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                color: activeTab === tab.id ? '#000' : '#999',
                transition: 'all 0.1s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {activeTab === 'info' ? (
            // 模板信息编辑
            <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  color: '#666',
                }}>
                  模板名称 *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  color: '#666',
                }}>
                  描述
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="模板说明..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '6px',
                  color: '#666',
                }}>
                  分类
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '13px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="custom">我的模板</option>
                  <option value="work">工作相关</option>
                  <option value="education">教育相关</option>
                  <option value="project">项目相关</option>
                </select>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: '#f8f8f8',
                borderRadius: '4px',
              }}>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '6px' }}>
                  创建时间：{new Date(template.createTime).toLocaleString('zh-CN')}
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  模板ID：{template.id}
                </div>
              </div>
            </div>
          ) : (
            // 模板内容编辑
            <>
              {/* 预览区 */}
              <div style={{
                flex: 1,
                padding: '24px',
                overflow: 'auto',
                backgroundColor: '#fafafa',
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '4px',
                  border: '1px solid #f1f1f1',
                }}>
                  <Renderer
                    schema={templateSchema}
                    isEditMode={true}
                    onNodeClick={handleNodeClick}
                    selectedNodeIds={selectedNodeId ? [selectedNodeId] : []}
                  />
                </div>
              </div>

              {/* 属性面板 - 复用主界面的逻辑 */}
              {selectedNode && materialDef && (
                <TemplatePropertyPanel
                  node={selectedNode}
                  materialDef={materialDef}
                  onUpdateProps={(props) => handleUpdateNodeProps(selectedNodeId!, props)}
                  onDelete={() => handleDeleteNode(selectedNodeId!)}
                  onDuplicate={() => handleDuplicateNode(selectedNodeId!)}
                />
              )}
              
              {!selectedNode && (
                <div style={{
                  width: '280px',
                  borderLeft: '1px solid #f1f1f1',
                  padding: '40px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ccc',
                  fontSize: '12px',
                  textAlign: 'center',
                }}>
                  点击左侧组件<br/>编辑内容
                </div>
              )}
            </>
          )}
        </div>

        {/* 底部按钮 */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #f1f1f1',
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end',
          backgroundColor: '#fafafa',
        }}>
          <button
            onClick={onClose}
            style={{
              height: '32px',
              padding: '0 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: '#fff',
              color: '#666',
            }}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            style={{
              height: '32px',
              padding: '0 16px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: '#000',
              color: '#fff',
            }}
          >
            保存
          </button>
        </div>
        
        {/* 调整大小手柄 */}
        <div
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '20px',
            height: '20px',
            cursor: 'nwse-resize',
            zIndex: 10,
          }}
        >
          <div style={{
            position: 'absolute',
            right: '4px',
            bottom: '4px',
            width: '12px',
            height: '12px',
            borderRight: '2px solid #d0d0d0',
            borderBottom: '2px solid #d0d0d0',
          }} />
        </div>
      </div>
    </div>
  )
}

// 模板属性面板组件（复用主界面逻辑）
const TemplatePropertyPanel: React.FC<{
  node: any
  materialDef: any
  onUpdateProps: (props: Record<string, PropValue>) => void
  onDelete: () => void
  onDuplicate: () => void
}> = ({ node, materialDef, onUpdateProps, onDelete, onDuplicate }) => {
  const capabilities = materialDef.capabilities || {}
  const canDelete = capabilities.deletable !== false
  const canCopy = capabilities.copyable !== false

  const groupedProps: Record<string, IPropSchema[]> = {}
  materialDef.propsSchema.forEach((prop: IPropSchema) => {
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
      width: '320px',
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
            onChange={onUpdateProps}
          />
        ))}
      </div>
    </div>
  )
}

// 属性分组（复用主界面逻辑）
const PropertyGroup: React.FC<{
  title: string
  props: IPropSchema[]
  nodeProps: Record<string, any>
  onChange: (props: Record<string, PropValue>) => void
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
              onChange={(value) => onChange({ [propSchema.name]: value })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 属性输入（完全复用主界面的逻辑）
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

    const handleFocus = (e: React.FocusEvent<any>) => {
      e.currentTarget.style.backgroundColor = '#fff'
      e.currentTarget.style.borderColor = '#e0e0e0'
    }

    const handleBlur = (e: React.FocusEvent<any>) => {
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
              style={{ ...baseStyle, flex: 1 }}
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
      {schema.description && schema.type !== 'string' && schema.type !== 'textarea' && schema.type !== 'richtext' && (
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
