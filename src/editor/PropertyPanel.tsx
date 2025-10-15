/**
 * 属性面板 - 优化版（集成主题设置）
 */

import React from 'react'
import { useEditorStore } from '@store/editorStore'
import type { PropValue } from '../types/material'
import { ChevronDown, Plus, X, Upload, Image as ImageIcon, Palette } from 'lucide-react'
import { useMaterial, IPropSchema } from '@/core'
import { ThemeSettings } from './ThemeSettings'
import { QuillEditor, SimpleTextarea } from '@/components/QuillEditor'
import { imageStorageManager } from '@/utils/imageStorage'
import { notification } from '@/utils/notification'

export const PropertyPanel: React.FC = () => {
  const { getLastSelectedNode, updateNodeProps } = useEditorStore()
  const [currentTab, setCurrentTab] = React.useState<string>('basic')

  // 性能优化：直接获取最后选中的节点（焦点节点），完全无需查找（O(1)）
  const node = getLastSelectedNode()
  const materialDef = useMaterial(node?.type || '')

  // 从物料定义中获取 tabs 配置
  const propertyTabs = materialDef?.propertyTabs
  const needsTabs = propertyTabs && propertyTabs.length > 0

  // 未选中或选中Page时，显示主题设置
  const isPageSelected = node?.type === 'Page'
  const shouldShowThemeSettings = !node || isPageSelected

  if (shouldShowThemeSettings) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderLeft: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '12px',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: '#fafafa',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#2d2d2d',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Palette size={14} />
            主题设置
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            overflowX: 'hidden',
            padding: '12px',
            backgroundColor: '#fafafa',
            minHeight: 0,
          }}
        >
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
          borderLeft: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          padding: '20px',
        }}
      >
        <div style={{ color: '#f00', fontSize: '12px' }}>未知类型: {node?.type}</div>
      </div>
    )
  }

  const handlePropChange = (propName: string, value: PropValue) => {
    if (node) {
      updateNodeProps(node.id, { [propName]: value })
    }
  }

  // 根据当前选中的 tab 过滤属性并分组
  const groupedProps: Record<string, { props: IPropSchema[]; icon?: React.ReactElement }> = {}

  materialDef.propsSchema.forEach(prop => {
    if (prop.hidden) return
    if (prop.visibleWhen && !prop.visibleWhen(node.props || {})) return

    // 如果有 tab，只渲染当前 tab 的属性
    if (needsTabs && prop.tab && prop.tab !== currentTab) {
      return
    }

    const propGroup = prop.group || '属性'
    if (!groupedProps[propGroup]) {
      groupedProps[propGroup] = { props: [], icon: prop.groupIcon }
    }
    groupedProps[propGroup].props.push(prop)
  })

  // 直接使用物料定义中的 tabs 配置
  const tabs = propertyTabs || []

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderLeft: '1px solid #f0f0f0',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* 标题 - 紧凑版 */}
      <div
        style={{
          padding: '12px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: needsTabs ? '10px' : '0',
            letterSpacing: '-0.01em',
          }}
        >
          {materialDef.meta.title}
        </div>

        {/* Tab 切换 */}
        {needsTabs && tabs.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '2px',
              flexWrap: 'nowrap',
            }}
          >
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                active={currentTab === tab.id}
                onClick={() => setCurrentTab(tab.id)}
                icon={tab.icon}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>
        )}
      </div>

      {/* 属性区域 - 紧凑版 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          overflowX: 'hidden',
          padding: '12px',
          backgroundColor: '#fafafa',
          minHeight: 0,
        }}
      >
        {Object.entries(groupedProps).map(([group, groupData], _index, array) => (
          <PropertyGroup
            key={group}
            title={group}
            icon={groupData.icon}
            props={groupData.props}
            nodeProps={node.props || {}}
            onChange={handlePropChange}
            showCollapse={array.length > 1}
          />
        ))}
      </div>
    </div>
  )
}

const PropertyGroup: React.FC<{
  title: string
  icon?: React.ReactElement
  props: IPropSchema[]
  nodeProps: Record<string, any>
  onChange: (name: string, value: PropValue) => void
  showCollapse?: boolean
}> = ({ title, icon, props, nodeProps, onChange, showCollapse = true }) => {
  const [collapsed, setCollapsed] = React.useState(false)

  const [hover, setHover] = React.useState(false)

  return (
    <div style={{ marginBottom: showCollapse ? '12px' : '0' }}>
      {showCollapse && (
        <div
          onClick={() => setCollapsed(!collapsed)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: collapsed ? '0' : '8px',
            padding: '8px 10px',
            borderRadius: '6px',
            border: `1px solid ${hover ? '#e0e0e0' : 'transparent'}`,
            backgroundColor: hover ? '#fafafa' : 'transparent',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: '700',
              color: hover ? '#2d2d2d' : '#666',
              letterSpacing: '0.3px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s',
            }}
          >
            {icon && (
              <span
                style={{
                  display: 'flex',
                  color: hover ? '#666' : '#999',
                  transition: 'color 0.2s',
                }}
              >
                {icon}
              </span>
            )}
            {title}
          </div>
          <ChevronDown
            size={13}
            style={{
              color: hover ? '#666' : '#ccc',
              transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0,
            }}
          />
        </div>
      )}

      {(!showCollapse || !collapsed) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingLeft: showCollapse ? '4px' : '0',
          }}
        >
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

// Tab 按钮组件 - 与物料面板分类按钮统一风格
const TabButton: React.FC<{
  active: boolean
  onClick: () => void
  icon?: React.ReactNode
  children: React.ReactNode
}> = ({ active, onClick, icon, children }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: '1 1 0',
        minWidth: 0,
        height: '28px',
        padding: '0 4px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: active ? '#2d2d2d' : hover ? '#f0f0f0' : 'transparent',
        color: active ? '#fff' : hover ? '#2d2d2d' : '#666',
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: '500',
        transition: 'all 0.12s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </span>
    </button>
  )
}

// 图片上传组件
const ImageUploadInput: React.FC<{
  value: string
  onChange: (value: string) => void
}> = ({ value, onChange }) => {
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      notification.error('请选择图片文件')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      notification.error('图片大小不能超过 5MB')
      return
    }

    setUploading(true)
    try {
      const base64 = await imageStorageManager.uploadImage(file)
      onChange(base64)
      notification.success('图片上传成功')
    } catch (error) {
      notification.error('图片上传失败')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleUrlInput = async () => {
    const url = await notification.prompt({
      title: '输入图片URL',
      message: '请输入图片链接地址',
      defaultValue: value,
    })

    if (url && url.trim()) {
      onChange(url.trim())
    }
  }

  const handleClear = () => {
    if (value) {
      // 减少引用计数（如果是 base64）
      if (value.startsWith('data:')) {
        imageStorageManager.decrementRefCount(value)
      }
      onChange('')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* 预览 */}
      {value && (
        <div
          style={{
            width: '100%',
            height: '120px',
            borderRadius: '6px',
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e0e0e0',
            position: 'relative',
          }}
        >
          <img
            src={value}
            alt="预览"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="删除图片"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 上传按钮 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            flex: 1,
            height: '32px',
            padding: '0 12px',
            border: '1px solid #e8e8e8',
            borderRadius: '6px',
            backgroundColor: '#fafafa',
            color: '#2d2d2d',
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            opacity: uploading ? 0.6 : 1,
          }}
          onMouseEnter={e => {
            if (!uploading) {
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.borderColor = '#d0d0d0'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.06)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#fafafa'
            e.currentTarget.style.borderColor = '#e8e8e8'
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)'
          }}
        >
          {uploading ? (
            <>
              <Upload size={14} className="animate-pulse" />
              上传中...
            </>
          ) : (
            <>
              <Upload size={14} />
              本地上传
            </>
          )}
        </button>

        <button
          onClick={handleUrlInput}
          style={{
            flex: 1,
            height: '32px',
            padding: '0 12px',
            border: '1px solid #e8e8e8',
            borderRadius: '6px',
            backgroundColor: '#fafafa',
            color: '#2d2d2d',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#fff'
            e.currentTarget.style.borderColor = '#d0d0d0'
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.06)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#fafafa'
            e.currentTarget.style.borderColor = '#e8e8e8'
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)'
          }}
        >
          <ImageIcon size={14} />
          URL链接
        </button>
      </div>
    </div>
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
      height: '32px',
      padding: '0 12px',
      border: '1px solid #e8e8e8',
      borderRadius: '6px',
      fontSize: '12px',
      outline: 'none',
      backgroundColor: '#fafafa',
      color: '#2d2d2d',
      transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
    }

    const handleFocus = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      e.currentTarget.style.backgroundColor = '#fff'
      e.currentTarget.style.borderColor = '#d0d0d0'
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,45,45,0.05), 0 2px 4px rgba(0,0,0,0.04)'
    }

    const handleBlur = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      e.currentTarget.style.backgroundColor = '#fafafa'
      e.currentTarget.style.borderColor = '#e8e8e8'
      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)'
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
              gap: '10px',
              cursor: 'pointer',
              height: '32px',
              padding: '0 12px',
              backgroundColor: '#fafafa',
              border: '1px solid #e8e8e8',
              borderRadius: '6px',
              transition: 'all 0.15s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.borderColor = '#d0d0d0'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#fafafa'
              e.currentTarget.style.borderColor = '#e8e8e8'
            }}
          >
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={e => onChange(e.target.checked)}
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer',
                accentColor: '#2d2d2d',
              }}
            />
            <span style={{ fontSize: '12px', color: '#2d2d2d', fontWeight: '500' }}>启用</span>
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
                width: '32px',
                height: '32px',
                border: '1px solid #e8e8e8',
                borderRadius: '6px',
                cursor: 'pointer',
                padding: '3px',
                backgroundColor: '#fafafa',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                transition: 'all 0.15s',
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

      case 'image':
        return <ImageUploadInput value={String(value || '')} onChange={onChange} />

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
          marginBottom: '6px',
          color: '#666',
          letterSpacing: '0.3px',
        }}
      >
        {schema.label}
        {schema.required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
      </label>
      {renderInput()}
    </div>
  )
}

// 数组输入组件 - 紧凑横向布局
const ArrayInput: React.FC<{
  value: any[]
  onChange: (value: any[]) => void
  schema: IPropSchema
}> = ({ value, onChange, schema }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
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
        gap: '5px',
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            padding: '6px 8px',
            backgroundColor: hoveredIndex === index ? '#fafafa' : '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.12s',
          }}
        >
          {/* 序号 */}
          <span
            style={{
              fontSize: '10px',
              fontWeight: '700',
              color: '#ccc',
              width: '18px',
              flexShrink: 0,
            }}
          >
            {index + 1}
          </span>

          {/* 字段输入 - 横向排列 */}
          {schema.itemSchema?.map(field => (
            <div key={field.name} style={{ flex: 1, minWidth: '60px' }}>
              {field.type === 'select' ? (
                <select
                  value={item[field.name] ?? field.defaultValue ?? ''}
                  onChange={e => handleItemChange(index, field.name, e.target.value)}
                  style={{
                    width: '100%',
                    height: '28px',
                    padding: '0 6px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '3px',
                    fontSize: '11px',
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
                    borderRadius: '3px',
                    fontSize: '11px',
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
                    borderRadius: '3px',
                    fontSize: '11px',
                    outline: 'none',
                    backgroundColor: '#fafafa',
                  }}
                />
              )}
            </div>
          ))}

          {/* 删除按钮 */}
          <button
            onClick={() => handleRemoveItem(index)}
            style={{
              width: '24px',
              height: '24px',
              border: 'none',
              borderRadius: '3px',
              backgroundColor: hoveredIndex === index ? '#fee' : 'transparent',
              color: hoveredIndex === index ? '#ef4444' : '#ddd',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.12s',
            }}
            title="删除"
          >
            <X size={14} />
          </button>
        </div>
      ))}

      {/* 添加按钮 - 精美样式 */}
      <button
        onClick={handleAddItem}
        style={{
          height: '32px',
          padding: '0 12px',
          border: '1px dashed #d8d8d8',
          borderRadius: '6px',
          backgroundColor: '#fafafa',
          color: '#666',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: '600',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          marginTop: '2px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#fff'
          e.currentTarget.style.borderColor = '#b0b0b0'
          e.currentTarget.style.borderStyle = 'solid'
          e.currentTarget.style.color = '#2d2d2d'
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.06)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#fafafa'
          e.currentTarget.style.borderColor = '#d8d8d8'
          e.currentTarget.style.borderStyle = 'dashed'
          e.currentTarget.style.color = '#666'
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <Plus size={13} />
        添加
      </button>
    </div>
  )
}
