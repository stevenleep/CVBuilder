/**
 * 物料面板 - 现代扁平化设计
 */

import React, { useState, useEffect } from 'react'
import { useEditorStore } from '@store/editorStore'
import { Search, Layers, Grid3x3, Trash2, Edit2 } from 'lucide-react'
import { useAllMaterials } from '@/core'
import { DraggableMaterial } from './DraggableMaterial'
import { StructurePanel } from './StructureTree'
import { templateManager, CustomTemplate } from '@/core/services/TemplateManager'
import { systemTemplateManager, SystemTemplate } from '@/core/services/SystemTemplateManager'
import { notification } from '@/utils/notification'
import { EditTemplateDialog } from './EditTemplateDialog'

export const MaterialPanel: React.FC = () => {
  const { addNode, pageSchema } = useEditorStore()
  const [activeTab, setActiveTab] = useState<'components' | 'structure'>('components')
  const [activeCategory, setActiveCategory] = useState<string>('resume')
  const [searchTerm, setSearchTerm] = useState('')
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])
  const [systemTemplates, setSystemTemplates] = useState<SystemTemplate[]>([])
  const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null)

  const allMaterials = useAllMaterials()

  // 加载模板
  useEffect(() => {
    loadTemplates()

    // 监听模板保存事件，自动刷新
    const handleTemplateSaved = () => {
      loadTemplates()
    }

    window.addEventListener('template-saved', handleTemplateSaved)

    return () => {
      window.removeEventListener('template-saved', handleTemplateSaved)
    }
  }, [])

  const loadTemplates = () => {
    setCustomTemplates(templateManager.getAllTemplates())
    setSystemTemplates(systemTemplateManager.getAllTemplates())
  }

  const filteredMaterials = allMaterials.filter(material => {
    // 过滤掉system分类（如Page根容器）
    if (material.meta.category === 'system') {
      return false
    }

    if (activeCategory !== 'all' && material.meta.category !== activeCategory) {
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
  // 按子分类分组（用于简历分类）
  const groupedBySubcategory: Record<string, Record<string, typeof allMaterials>> = {}

  filteredMaterials.forEach(material => {
    const category = material.meta.category
    const subcategory = material.meta.subcategory

    if (!groupedMaterials[category]) {
      groupedMaterials[category] = []
    }
    groupedMaterials[category].push(material)

    // 如果有子分类，也按子分类分组
    if (subcategory) {
      if (!groupedBySubcategory[category]) {
        groupedBySubcategory[category] = {}
      }
      if (!groupedBySubcategory[category][subcategory]) {
        groupedBySubcategory[category][subcategory] = []
      }
      groupedBySubcategory[category][subcategory].push(material)
    }
  })

  // 按指定顺序排列分类
  const categoryList = [
    { id: 'resume', name: '简历' },
    { id: 'my-templates', name: '模板' },
    { id: 'base', name: '基础' },
    { id: 'all', name: '全部' },
  ]

  const handleAddMaterial = (materialType: string) => {
    // 始终添加到页面根节点，而不是选中的节点
    // 如果需要添加到特定位置，可以通过拖拽实现
    addNode(materialType, pageSchema.root.id)
  }

  const handleDeleteTemplate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmed = await notification.confirm({
      title: '确认删除',
      message: '确定删除这个模板吗？',
      type: 'error',
    })
    if (confirmed) {
      templateManager.deleteTemplate(id)
      loadTemplates()
      notification.success('模板已删除')
    }
  }

  const handleEditTemplate = async (template: CustomTemplate, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingTemplate(template)
  }

  const handleSaveTemplate = (name: string, description: string, category: string) => {
    if (editingTemplate) {
      templateManager.updateTemplateInfo(editingTemplate.id, {
        name,
        description,
        category,
      })
      loadTemplates()
      setEditingTemplate(null)
      notification.success('模板已更新')
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRight: '1px solid #e8e8e8',
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
          padding: '10px',
          borderBottom: '1px solid #e8e8e8',
          backgroundColor: '#fff',
        }}
      >
        <TabButton
          icon={<Grid3x3 size={14} />}
          label="物料库"
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
          <div style={{ padding: '10px', backgroundColor: '#fff' }}>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={13}
                style={{
                  position: 'absolute',
                  left: '10px',
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
                  height: '32px',
                  padding: '0 10px 0 32px',
                  border: '1px solid #e8e8e8',
                  borderRadius: '6px',
                  fontSize: '12px',
                  outline: 'none',
                  backgroundColor: '#fafafa',
                  transition: 'all 0.12s',
                  color: '#2d2d2d',
                }}
                onFocus={e => {
                  e.currentTarget.style.backgroundColor = '#fff'
                  e.currentTarget.style.borderColor = '#d0d0d0'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.02)'
                }}
                onBlur={e => {
                  e.currentTarget.style.backgroundColor = '#fafafa'
                  e.currentTarget.style.borderColor = '#e8e8e8'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>

          {/* 分类 */}
          <div
            style={{
              padding: '0 10px 10px 10px',
              display: 'flex',
              gap: '5px',
              flexWrap: 'wrap',
              backgroundColor: '#fff',
            }}
          >
            {categoryList.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={{
                  height: '26px',
                  padding: '0 12px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: activeCategory === category.id ? '#2d2d2d' : 'transparent',
                  color: activeCategory === category.id ? '#fff' : '#666',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  if (activeCategory !== category.id) {
                    e.currentTarget.style.backgroundColor = '#f0f0f0'
                    e.currentTarget.style.color = '#2d2d2d'
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== category.id) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#666'
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
              backgroundColor: '#e8e8e8',
              margin: '6px 0',
            }}
          />

          {/* 物料列表 */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '10px',
            }}
          >
            {activeCategory === 'my-templates' ? (
              // 模板列表
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 系统模板 */}
                {systemTemplates.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: '#999',
                        marginBottom: '8px',
                        paddingLeft: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                      }}
                    >
                      系统模板
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {systemTemplates.map(template => (
                        <SystemTemplateCard key={template.id} template={template} />
                      ))}
                    </div>
                  </div>
                )}

                {/* 用户自定义模板 */}
                <div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#999',
                      marginBottom: '8px',
                      paddingLeft: '2px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                    }}
                  >
                    我的模板
                  </div>
                  {customTemplates.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        color: '#ddd',
                        padding: '20px',
                        fontSize: '11px',
                        backgroundColor: '#fafafa',
                        borderRadius: '6px',
                        border: '1px dashed #e8e8e8',
                      }}
                    >
                      暂无自定义模板
                      <div style={{ marginTop: '4px', fontSize: '10px' }}>
                        在画布中右键选择"保存为模板"
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {customTemplates.map(template => (
                        <TemplateCard
                          key={template.id}
                          template={template}
                          onEdit={e => handleEditTemplate(template, e)}
                          onDelete={e => handleDeleteTemplate(template.id, e)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
                        fontSize: '10px',
                        fontWeight: '700',
                        color: '#999',
                        marginBottom: '8px',
                        paddingLeft: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                      }}
                    >
                      {getCategoryName(category)}
                    </div>
                    {/* 如果有子分类，按子分类分组显示 */}
                    {groupedBySubcategory[category] ? (
                      <div>
                        {Object.entries(groupedBySubcategory[category]).map(
                          ([subcategory, subMaterials]) => (
                            <div key={subcategory} style={{ marginBottom: '16px' }}>
                              <div
                                style={{
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  color: '#bbb',
                                  marginBottom: '8px',
                                  paddingLeft: '2px',
                                }}
                              >
                                {getSubcategoryName(subcategory)}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {subMaterials.map(material => (
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
                          )
                        )}
                      </div>
                    ) : (
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
                    )}
                  </div>
                ))}
              </div>
            ) : // 单个分类：如果是简历分类且有子分类，按子分类分组显示
            groupedBySubcategory[activeCategory] ? (
              <div>
                {Object.entries(groupedBySubcategory[activeCategory]).map(
                  ([subcategory, materials]) => (
                    <div key={subcategory} style={{ marginBottom: '16px' }}>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#666',
                          marginBottom: '8px',
                          paddingLeft: '4px',
                        }}
                      >
                        {getSubcategoryName(subcategory)}
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
                  )
                )}
              </div>
            ) : (
              // 其他分类：直接列表
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
        </>
      )}

      {/* 模板编辑对话框 */}
      {editingTemplate && (
        <EditTemplateDialog
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onClose={() => setEditingTemplate(null)}
        />
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
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        backgroundColor: active ? '#2d2d2d' : hover ? '#f0f0f0' : 'transparent',
        color: active ? '#fff' : '#666',
        transition: 'all 0.15s',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

function getCategoryName(category: string): string {
  const map: Record<string, string> = {
    base: '基础',
    resume: '简历',
  }
  return map[category] || category
}

function getSubcategoryName(subcategory: string): string {
  const map: Record<string, string> = {
    info: '个人信息',
    sections: '章节容器',
    items: '经历条目',
    skills: '技能展示',
    content: '内容模块',
    highlight: '成就展示',
  }
  return map[subcategory] || subcategory
}

// 模板卡片组件
const TemplateCard: React.FC<{
  template: CustomTemplate
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}> = ({ template, onEdit, onDelete }) => {
  const [hover, setHover] = useState(false)
  const { addNodeFromSchema } = useEditorStore()

  const handleUseTemplate = () => {
    // 在根节点添加模板
    addNodeFromSchema(template.schema)
    notification.success(`已添加模板: ${template.name}`)
  }

  return (
    <div
      onClick={handleUseTemplate}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '10px',
        border: '1px solid #e8e8e8',
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: hover ? '#fff' : '#fafafa',
        transition: 'all 0.12s',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#2d2d2d',
          marginBottom: '4px',
          paddingRight: hover ? '56px' : '0',
          transition: 'padding-right 0.12s',
        }}
      >
        {template.name}
      </div>

      {template.description && (
        <div
          style={{
            fontSize: '11px',
            color: '#999',
            marginBottom: '6px',
            lineHeight: '1.4',
          }}
        >
          {template.description}
        </div>
      )}

      <div
        style={{
          fontSize: '10px',
          color: '#ccc',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>{getCategoryDisplayName(template.category)}</span>
        <span>·</span>
        <span>{new Date(template.createTime).toLocaleDateString('zh-CN')}</span>
      </div>

      {hover && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            gap: '4px',
          }}
        >
          <button
            onClick={onEdit}
            style={{
              width: '22px',
              height: '22px',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: '#f0f0f0',
              color: '#666',
            }}
            title="编辑"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={onDelete}
            style={{
              width: '22px',
              height: '22px',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
            }}
            title="删除"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  )
}

function getCategoryDisplayName(category: string): string {
  const map: Record<string, string> = {
    custom: '自定义',
    work: '工作相关',
    education: '教育相关',
    project: '项目相关',
  }
  return map[category] || category
}

// 系统模板卡片组件（不可编辑/删除）
const SystemTemplateCard: React.FC<{
  template: SystemTemplate
}> = ({ template }) => {
  const [hover, setHover] = useState(false)
  const { addNodeFromSchema } = useEditorStore()

  const handleUseTemplate = () => {
    addNodeFromSchema(template.schema)
    notification.success(`已添加模板: ${template.name}`)
  }

  return (
    <div
      onClick={handleUseTemplate}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '10px',
        border: '1px solid #e8e8e8',
        borderRadius: '6px',
        cursor: 'pointer',
        backgroundColor: hover ? '#fff' : '#fafafa',
        transition: 'all 0.12s',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#2d2d2d',
          marginBottom: '4px',
        }}
      >
        {template.name}
      </div>

      {template.description && (
        <div
          style={{
            fontSize: '11px',
            color: '#999',
            lineHeight: '1.4',
          }}
        >
          {template.description}
        </div>
      )}
    </div>
  )
}
