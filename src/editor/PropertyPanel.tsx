/**
 * 属性面板 - 优化版（集成主题设置）
 */

import React from 'react'
import { useEditorStore } from '@store/editorStore'
import { findNode } from '@utils/schema'
import type { PropValue } from '../types/material'
import { ChevronDown, Plus, X, Upload, Image as ImageIcon } from 'lucide-react'
import { useMaterial, IPropSchema } from '@/core'
import { ThemeSettings } from './ThemeSettings'
import { QuillEditor, SimpleTextarea } from '@/components/QuillEditor'
import { imageStorageManager } from '@/utils/imageStorage'
import { notification } from '@/utils/notification'

export const PropertyPanel: React.FC = () => {
  const { selectedNodeIds, pageSchema, updateNodeProps } = useEditorStore()
  const [currentTab, setCurrentTab] = React.useState<
    'basic' | 'details' | 'content' | 'appearance'
  >('basic')

  const nodeId = selectedNodeIds.length > 0 ? selectedNodeIds[0] : null
  const node = nodeId ? findNode(pageSchema.root, nodeId) : null
  const materialDef = useMaterial(node?.type || '')

  // 检查组件类型
  const nodeType = node?.type || ''
  const isPersonalInfo = nodeType === 'PersonalInfo'
  const isProjectItem = nodeType === 'ProjectItem'
  const isExperienceItem = nodeType === 'ExperienceItem'
  const isEducationItem = nodeType === 'EducationItem'

  // 判断是否需要显示 tab
  const needsTabs = isPersonalInfo || isProjectItem || isExperienceItem || isEducationItem

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

  // 根据当前选中的组件类型和 tab，过滤属性
  const groupedProps: Record<string, IPropSchema[]> = {}

  materialDef.propsSchema.forEach(prop => {
    if (prop.hidden) return
    if (prop.visibleWhen && !prop.visibleWhen(node.props || {})) return

    // 如果需要 tab，根据当前 tab 过滤属性
    if (needsTabs) {
      const propGroup = prop.group || '属性'

      // PersonalInfo 的 tab 映射（4个 tab）
      if (isPersonalInfo) {
        if (currentTab === 'basic' && propGroup !== '核心信息') return
        if (currentTab === 'details' && !['联系方式', '在线链接'].includes(propGroup)) return
        if (currentTab === 'content' && propGroup !== '补充信息') return
        if (currentTab === 'appearance' && propGroup !== '外观') return
      }

      // ProjectItem 的 tab 映射
      if (isProjectItem) {
        if (currentTab === 'basic' && !['基本信息'].includes(propGroup)) return
        if (currentTab === 'details' && !['项目详情'].includes(propGroup)) return
        if (currentTab === 'content' && propGroup !== '内容') return
      }

      // ExperienceItem 的 tab 映射
      if (isExperienceItem) {
        if (currentTab === 'basic' && !['基本信息', '工作性质'].includes(propGroup)) return
        if (currentTab === 'details' && !['技术信息', '详细信息', '薪资'].includes(propGroup))
          return
        if (currentTab === 'content' && !['内容', '其他'].includes(propGroup)) return
      }

      // EducationItem 的 tab 映射
      if (isEducationItem) {
        if (currentTab === 'basic' && propGroup !== '基本信息') return
        if (currentTab === 'details' && propGroup !== '更多信息') return
      }
    }

    const group = prop.group || '属性'
    if (!groupedProps[group]) {
      groupedProps[group] = []
    }
    groupedProps[group].push(prop)
  })

  // 获取当前组件的 tab 配置
  const getTabs = () => {
    if (isPersonalInfo) {
      return [
        { id: 'basic' as const, label: '核心信息' },
        { id: 'details' as const, label: '联系方式' },
        { id: 'content' as const, label: '补充信息' },
        { id: 'appearance' as const, label: '外观' },
      ]
    }
    if (isProjectItem) {
      return [
        { id: 'basic' as const, label: '基本信息' },
        { id: 'details' as const, label: '项目详情' },
        { id: 'content' as const, label: '内容' },
      ]
    }
    if (isExperienceItem) {
      return [
        { id: 'basic' as const, label: '基本信息' },
        { id: 'details' as const, label: '详细信息' },
        { id: 'content' as const, label: '工作内容' },
      ]
    }
    if (isEducationItem) {
      return [
        { id: 'basic' as const, label: '基本信息' },
        { id: 'details' as const, label: '更多信息' },
      ]
    }
    return []
  }

  const tabs = getTabs()

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderLeft: '1px solid #e0e0e0',
        backgroundColor: '#f8f8f8',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 标题 - 优化排版 */}
      <div
        style={{
          padding: '18px 16px 0',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '4px',
            letterSpacing: '-0.01em',
          }}
        >
          {materialDef.meta.title}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: '#888',
            lineHeight: '1.4',
            marginBottom: '12px',
          }}
        >
          {materialDef.meta.description}
        </div>

        {/* Tab 切换 */}
        {needsTabs && tabs.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '4px',
              marginBottom: '-1px',
            }}
          >
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                active={currentTab === tab.id}
                onClick={() => setCurrentTab(tab.id)}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>
        )}
      </div>

      {/* 属性区域 - 优化背景和间距 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '14px 16px',
          backgroundColor: '#f8f8f8',
        }}
      >
        {isPersonalInfo && currentTab === 'appearance' ? (
          <AppearancePanel nodeProps={node.props || {}} onChange={handlePropChange} />
        ) : (
          Object.entries(groupedProps).map(([group, props]) => (
            <PropertyGroup
              key={group}
              title={group}
              props={props}
              nodeProps={node.props || {}}
              onChange={handlePropChange}
            />
          ))
        )}
      </div>
    </div>
  )
}

// 属性分组 - 优化版
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
          padding: '6px 4px',
          borderRadius: '4px',
          transition: 'background-color 0.12s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#f0f0f0'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#666',
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </div>
        <ChevronDown
          size={14}
          style={{
            color: '#aaa',
            transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
          }}
        />
      </div>

      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
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

// Tab 按钮组件 - 统一风格
const TabButton: React.FC<{
  active: boolean
  onClick: () => void
  children: React.ReactNode
}> = ({ active, onClick, children }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        height: '30px',
        padding: '0 10px',
        border: 'none',
        borderBottom: active ? '2px solid #2d2d2d' : '2px solid transparent',
        borderRadius: '0',
        backgroundColor: 'transparent',
        color: active ? '#2d2d2d' : hover ? '#666' : '#999',
        cursor: 'pointer',
        fontSize: '11px',
        fontWeight: active ? '700' : '500',
        transition: 'all 0.12s',
        letterSpacing: '0.3px',
      }}
    >
      {children}
    </button>
  )
}

// 外观面板 - PersonalInfo 专用
const AppearancePanel: React.FC<{
  nodeProps: Record<string, any>
  onChange: (name: string, value: PropValue) => void
}> = ({ nodeProps, onChange }) => {
  const currentPreset = (nodeProps.layoutPreset as string) || 'classic'

  const presets = [
    {
      id: 'classic',
      name: '经典布局',
      description: '左对齐，完整信息，支持头像',
    },
    {
      id: 'centered',
      name: '居中简约',
      description: '居中对齐，简洁清爽',
    },
    {
      id: 'minimal',
      name: '极简风格',
      description: '姓名职位一行，最紧凑',
    },
    {
      id: 'detailed',
      name: '详细信息',
      description: '两栏网格，信息分类',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 板式预设选择 */}
      <div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#666',
            marginBottom: '10px',
            letterSpacing: '0.5px',
          }}
        >
          板式预设
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {presets.map(preset => (
            <PresetCard
              key={preset.id}
              preset={preset}
              isActive={currentPreset === preset.id}
              onClick={() => onChange('layoutPreset', preset.id)}
            />
          ))}
        </div>
      </div>

      {/* 头像设置 */}
      <div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#666',
            marginBottom: '10px',
            letterSpacing: '0.5px',
          }}
        >
          头像设置
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
          {/* 显示头像开关 */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                cursor: 'pointer',
                height: '32px',
                padding: '0 2px',
              }}
            >
              <input
                type="checkbox"
                checked={Boolean(nodeProps.showAvatar)}
                onChange={e => onChange('showAvatar', e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer',
                  accentColor: '#1a1a1a',
                }}
              />
              <span style={{ fontSize: '12px', color: '#555', fontWeight: '500' }}>显示头像</span>
            </label>
          </div>

          {/* 头像上传（仅在勾选后显示） */}
          {nodeProps.showAvatar && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: '600',
                  marginBottom: '6px',
                  color: '#555',
                  letterSpacing: '0.2px',
                }}
              >
                头像
              </label>
              <ImageUploadInput
                value={String(nodeProps.avatar || '')}
                onChange={value => onChange('avatar', value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* 对齐方式（仅经典布局） */}
      {currentPreset === 'classic' && (
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#666',
              marginBottom: '10px',
              letterSpacing: '0.5px',
            }}
          >
            对齐方式
          </div>
          <PropertyInput
            schema={{
              name: 'align',
              label: '对齐',
              type: 'select',
              defaultValue: 'left',
              options: [
                { label: '左对齐', value: 'left' },
                { label: '居中', value: 'center' },
                { label: '右对齐', value: 'right' },
              ],
              group: '外观',
            }}
            value={nodeProps.align ?? 'left'}
            onChange={value => onChange('align', value)}
          />
        </div>
      )}

      {/* 链接显示方式 */}
      <div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#666',
            marginBottom: '10px',
            letterSpacing: '0.5px',
          }}
        >
          链接设置
        </div>
        <PropertyInput
          schema={{
            name: 'showFullLinks',
            label: '显示完整链接',
            type: 'boolean',
            defaultValue: true,
            group: '外观',
          }}
          value={nodeProps.showFullLinks ?? true}
          onChange={value => onChange('showFullLinks', value)}
        />
        <div
          style={{
            fontSize: '10px',
            color: '#aaa',
            marginTop: '5px',
            lineHeight: '1.4',
          }}
        >
          关闭后仅显示标题（带下划线），更简洁
        </div>
      </div>
    </div>
  )
}

// 预设卡片 - 统一风格
const PresetCard: React.FC<{
  preset: { id: string; name: string; description: string }
  isActive: boolean
  onClick: () => void
}> = ({ preset, isActive, onClick }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '10px 12px',
        backgroundColor: isActive ? '#2d2d2d' : hover ? '#fafafa' : '#fff',
        border: `1px solid ${isActive ? '#2d2d2d' : '#e8e8e8'}`,
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.12s',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: '600',
          color: isActive ? '#fff' : '#2d2d2d',
          marginBottom: '3px',
          letterSpacing: '-0.01em',
        }}
      >
        {preset.name}
      </div>
      <div
        style={{
          fontSize: '11px',
          color: isActive ? 'rgba(255,255,255,0.8)' : '#999',
          lineHeight: '1.4',
        }}
      >
        {preset.description}
      </div>
    </div>
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

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      notification.error('请选择图片文件')
      return
    }

    // 检查文件大小（限制 5MB）
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
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: '#fff',
            color: '#555',
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.12s',
          }}
          onMouseEnter={e => {
            if (!uploading) {
              e.currentTarget.style.backgroundColor = '#f8f8f8'
              e.currentTarget.style.borderColor = '#c0c0c0'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#fff'
            e.currentTarget.style.borderColor = '#e0e0e0'
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
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: '#fff',
            color: '#555',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.12s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f8f8f8'
            e.currentTarget.style.borderColor = '#c0c0c0'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#fff'
            e.currentTarget.style.borderColor = '#e0e0e0'
          }}
        >
          <ImageIcon size={14} />
          URL链接
        </button>
      </div>

      {/* 提示信息 */}
      <div
        style={{
          fontSize: '10px',
          color: '#aaa',
          lineHeight: '1.4',
        }}
      >
        支持 JPG、PNG、GIF 等格式，最大 5MB
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
      padding: '0 10px',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      fontSize: '12px',
      outline: 'none',
      backgroundColor: '#fff',
      color: '#1a1a1a',
      transition: 'all 0.12s',
    }

    const handleFocus = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      e.currentTarget.style.backgroundColor = '#fff'
      e.currentTarget.style.borderColor = '#b0b0b0'
      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.03)'
    }

    const handleBlur = (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      e.currentTarget.style.backgroundColor = '#fff'
      e.currentTarget.style.borderColor = '#e0e0e0'
      e.currentTarget.style.boxShadow = 'none'
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
              gap: '9px',
              cursor: 'pointer',
              height: '32px',
              padding: '0 2px',
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
                accentColor: '#1a1a1a',
              }}
            />
            <span style={{ fontSize: '12px', color: '#555', fontWeight: '500' }}>启用</span>
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
          color: '#555',
          letterSpacing: '0.2px',
        }}
      >
        {schema.label}
        {schema.required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
      </label>
      {renderInput()}
      {schema.description && schema.type !== 'string' && schema.type !== 'textarea' && (
        <div
          style={{
            fontSize: '10px',
            color: '#aaa',
            marginTop: '5px',
            lineHeight: '1.4',
          }}
        >
          {schema.description}
        </div>
      )}
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

      {/* 添加按钮 - 紧凑样式 */}
      <button
        onClick={handleAddItem}
        style={{
          height: '30px',
          padding: '0 12px',
          border: '1px dashed #d0d0d0',
          borderRadius: '4px',
          backgroundColor: 'transparent',
          color: '#888',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: '600',
          transition: 'all 0.12s',
          marginTop: '2px',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#f8f8f8'
          e.currentTarget.style.borderColor = '#a0a0a0'
          e.currentTarget.style.color = '#333'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.borderColor = '#d0d0d0'
          e.currentTarget.style.color = '#888'
        }}
      >
        <Plus size={13} />
        添加
      </button>
    </div>
  )
}
