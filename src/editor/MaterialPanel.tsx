/**
 * 物料面板 - 现代扁平化设计
 */

import React, { useState, useEffect } from 'react'
import { useEditorStore } from '@store/editorStore'
import { Search, Trash2, Edit2, Layers, Grid3x3 } from 'lucide-react'
import { useAllMaterials, useMaterialCategories } from '@/core'
import { DraggableMaterial } from './DraggableMaterial'
import { templateManager, CustomTemplate } from '@/core/services/TemplateManager'
import { cloneNode } from '@utils/schema'
import { EditTemplateDialog } from './EditTemplateDialog'
import { StructurePanel } from './StructureTree'
import { notification } from '@/utils/notification'

export const MaterialPanel: React.FC = () => {
  const { addNode, pageSchema } = useEditorStore()
  const [activeTab, setActiveTab] = useState<'components' | 'structure'>('components')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])

  const allMaterials = useAllMaterials()
  const categories = useMaterialCategories()

  // 加载自定义模板
  useEffect(() => {
    const loadTemplates = () => {
      setCustomTemplates(templateManager.getAllTemplates())
    }
    loadTemplates()

    // 监听模板变化
    const interval = setInterval(loadTemplates, 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredMaterials = allMaterials.filter(material => {
    // 过滤掉system分类（如Page根容器）
    if (material.meta.category === 'system') {
      return false
    }

    if (
      activeCategory !== 'all' &&
      activeCategory !== 'templates' &&
      material.meta.category !== activeCategory
    ) {
      return false
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        material.meta.title.toLowerCase().includes(term) ||
        material.meta.description?.toLowerCase().includes(term) ||
        material.meta.tags?.some(tag => tag.toLowerCase().includes(term))
      )
    }

    return true
  })

  // 按分类分组物料
  const groupedMaterials: Record<string, typeof allMaterials> = {}
  filteredMaterials.forEach(material => {
    const category = material.meta.category
    if (!groupedMaterials[category]) {
      groupedMaterials[category] = []
    }
    groupedMaterials[category].push(material)
  })

  const categoryList = [
    { id: 'all', name: '全部' },
    { id: 'templates', name: '我的模板' },
    ...categories
      .map(cat => ({ id: cat, name: getCategoryName(cat) }))
      .filter(cat => cat.id !== 'system'),
  ]

  const handleAddMaterial = (materialType: string) => {
    // 始终添加到页面根节点，而不是选中的节点
    // 如果需要添加到特定位置，可以通过拖拽实现
    addNode(materialType, pageSchema.root.id)
  }

  const handleAddTemplate = (template: CustomTemplate) => {
    // 克隆模板节点
    const clonedNode = cloneNode(template.schema)

    // 使用底层API添加
    const store = useEditorStore.getState()
    store.setPageSchema({
      ...store.pageSchema,
      root: {
        ...store.pageSchema.root,
        children: [...(store.pageSchema.root.children || []), clonedNode],
      },
    })
  }

  const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null)

  const handleDeleteTemplate = async (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmed = await notification.confirm({
      title: '确认删除',
      message: '确定删除这个模板吗？',
      type: 'error',
    })
    if (confirmed) {
      templateManager.deleteTemplate(templateId)
      setCustomTemplates(templateManager.getAllTemplates())
    }
  }

  const handleEditTemplate = (template: CustomTemplate, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingTemplate(template)
  }

  const handleSaveTemplateEdit = (name: string, description: string, category: string) => {
    if (editingTemplate) {
      templateManager.updateTemplateInfo(editingTemplate.id, {
        name,
        description,
        category,
      })
      setCustomTemplates(templateManager.getAllTemplates())
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRight: '1px solid #f1f1f1',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fafafa',
      }}
    >
      {/* Tab切换 */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '12px',
          borderBottom: '1px solid #f1f1f1',
          backgroundColor: '#fff',
        }}
      >
        <TabButton
          icon={<Grid3x3 size={14} />}
          label="组件库"
          active={activeTab === 'components'}
          onClick={() => setActiveTab('components')}
        />
        <TabButton
          icon={<Layers size={14} />}
          label="结构树"
          active={activeTab === 'structure'}
          onClick={() => setActiveTab('structure')}
        />
      </div>

      {activeTab === 'structure' ? (
        <StructurePanel />
      ) : (
        <>
          {/* 搜索 */}
          <div style={{ padding: '14px' }}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '12px',
                  color: '#999',
                }}
              />
              <input
                type="text"
                placeholder="搜索组件..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  height: '34px',
                  padding: '0 12px 0 36px',
                  border: '1px solid #f1f1f1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.15s',
                }}
                onFocus={e => {
                  e.currentTarget.style.backgroundColor = '#fff'
                  e.currentTarget.style.borderColor = '#e0e0e0'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.02)'
                }}
                onBlur={e => {
                  e.currentTarget.style.backgroundColor = '#fafafa'
                  e.currentTarget.style.borderColor = '#f1f1f1'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* 分类 */}
          <div
            style={{
              padding: '0 14px 14px 14px',
              display: 'flex',
              gap: '6px',
              flexWrap: 'wrap',
            }}
          >
            {categoryList.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={{
                  height: '30px',
                  padding: '0 14px',
                  border: `1px solid ${activeCategory === category.id ? '#e0e0e0' : 'transparent'}`,
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: activeCategory === category.id ? '#fafafa' : 'transparent',
                  color: activeCategory === category.id ? '#000' : '#999',
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={e => {
                  if (activeCategory !== category.id) {
                    e.currentTarget.style.backgroundColor = '#fafafa'
                    e.currentTarget.style.borderColor = '#f5f5f5'
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== category.id) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = 'transparent'
                  }
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div
            style={{
              width: '100%',
              height: '1px',
              backgroundColor: '#f1f1f1',
              margin: '0 0 8px 0',
            }}
          />

          {/* 物料列表 */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '0 14px 14px 14px',
            }}
          >
            {/* 我的模板分类 */}
            {activeCategory === 'templates' ? (
              customTemplates.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: '#ccc',
                    padding: '40px 20px',
                    fontSize: '12px',
                  }}
                >
                  暂无自定义模板
                  <br />
                  <span style={{ fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    选中组件后点击"保存为模板"创建
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {customTemplates.map(template => (
                    <TemplateItem
                      key={template.id}
                      template={template}
                      onClick={() => handleAddTemplate(template)}
                      onEdit={e => handleEditTemplate(template, e)}
                      onDelete={e => handleDeleteTemplate(template.id, e)}
                    />
                  ))}
                </div>
              )
            ) : filteredMaterials.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: '#ccc',
                  padding: '40px 20px',
                  fontSize: '12px',
                }}
              >
                暂无组件
              </div>
            ) : activeCategory === 'all' ? (
              // 全部分类：按组显示
              <div>
                {Object.entries(groupedMaterials).map(([category, materials]) => (
                  <div key={category} style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#666',
                        marginBottom: '10px',
                        paddingLeft: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                      }}
                    >
                      {getCategoryName(category)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {materials.map(material => (
                        <DraggableMaterial
                          key={material.meta.type}
                          materialType={material.meta.type}
                          title={material.meta.title}
                          description={material.meta.description}
                          onClick={() => handleAddMaterial(material.meta.type)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // 单个分类：直接列表
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredMaterials.map(material => (
                  <DraggableMaterial
                    key={material.meta.type}
                    materialType={material.meta.type}
                    title={material.meta.title}
                    description={material.meta.description}
                    onClick={() => handleAddMaterial(material.meta.type)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 编辑模板对话框 */}
          {editingTemplate && (
            <EditTemplateDialog
              template={editingTemplate}
              onSave={handleSaveTemplateEdit}
              onClose={() => setEditingTemplate(null)}
            />
          )}
        </>
      )}
    </div>
  )
}

const TabButton: React.FC<{
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        cursor: 'pointer',
        backgroundColor: active ? '#fafafa' : 'transparent',
        color: active ? '#000' : '#999',
        transition: 'all 0.12s',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

const TemplateItem: React.FC<{
  template: CustomTemplate
  onClick: () => void
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}> = ({ template, onClick, onEdit, onDelete }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        minHeight: '38px',
        padding: '8px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: hover ? '#fafafa' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        transition: 'all 0.1s',
        position: 'relative',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '13px',
            color: '#000',
            fontWeight: '500',
            lineHeight: '1.4',
          }}
        >
          {template.name}
        </div>
        {template.description && (
          <div
            style={{
              fontSize: '11px',
              color: '#999',
              marginTop: '2px',
              lineHeight: '1.3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {template.description}
          </div>
        )}
      </div>

      {hover && (
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <ActionButton icon={<Edit2 size={12} />} onClick={onEdit} tooltip="编辑" />
          <ActionButton icon={<Trash2 size={12} />} onClick={onDelete} tooltip="删除" danger />
        </div>
      )}
    </div>
  )
}

const ActionButton: React.FC<{
  icon: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  tooltip: string
  danger?: boolean
}> = ({ icon, onClick, tooltip, danger = false }) => {
  const [hover, setHover] = React.useState(false)

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
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: hover ? (danger ? '#fef2f2' : '#f0f0f0') : 'transparent',
        color: danger ? '#ef4444' : '#666',
        transition: 'all 0.1s',
      }}
    >
      {icon}
    </button>
  )
}

function getCategoryName(category: string): string {
  const map: Record<string, string> = {
    base: '基础',
    composite: '复合',
    resume: '简历',
    layout: '布局',
    content: '内容',
  }
  return map[category] || category
}
