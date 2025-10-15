/**
 * 物料面板 - 现代扁平化设计
 */

import React, { useState, useEffect } from 'react'
import { useEditorStore } from '@store/editorStore'
import {
  Search,
  Layers,
  Grid3x3,
  Trash2,
  Edit2,
  FileText,
  Layout,
  Package,
  LayoutGrid,
  GripVertical,
  X,
} from 'lucide-react'
import { useAllMaterials } from '@/core'
import { DraggableMaterial } from './DraggableMaterial'
import { StructurePanel } from './StructureTree'
import { templateManager, CustomTemplate } from '@/core/services/TemplateManager'
import { systemTemplateManager, SystemTemplate } from '@/core/services/SystemTemplateManager'
import { notification } from '@/utils/notification'
import { EditTemplateDialog } from './EditTemplateDialog'
import { useDrag } from 'react-dnd'
import { DragItemTypes, TemplateDragItem } from './DndProvider'

export const MaterialPanel: React.FC = () => {
  const { addNode, pageSchema } = useEditorStore()
  const [activeTab, setActiveTab] = useState<'components' | 'structure'>('components')
  const [activeCategory, setActiveCategory] = useState<string>('my-templates')
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
    { id: 'my-templates', name: '模板', icon: <Layout size={12} /> },
    { id: 'resume', name: '简历', icon: <FileText size={12} /> },
    { id: 'base', name: '基础', icon: <Package size={12} /> },
    { id: 'all', name: '全部', icon: <LayoutGrid size={12} /> },
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
        borderRight: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fafafa',
      }}
    >
      {/* Tab切换和搜索 - 放在一行 */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '8px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          alignItems: 'center',
        }}
      >
        <TabButton
          icon={<Grid3x3 size={12} />}
          label="物料库"
          active={activeTab === 'components'}
          onClick={() => setActiveTab('components')}
        />
        <TabButton
          icon={<Layers size={12} />}
          label="结构树"
          active={activeTab === 'structure'}
          onClick={() => setActiveTab('structure')}
        />

        {/* 分隔线 */}
        <div
          style={{
            width: '1px',
            height: '16px',
            backgroundColor: '#e8e8e8',
            margin: '0 2px',
          }}
        />

        {/* 搜索框 */}
        {activeTab === 'components' && (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Search
              size={11}
              style={{
                position: 'absolute',
                left: '8px',
                color: '#999',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="搜索..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '28px',
                padding: '0 28px 0 28px',
                border: '1px solid #e8e8e8',
                borderRadius: '5px',
                fontSize: '11.5px',
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
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '6px',
                  width: '18px',
                  height: '18px',
                  border: 'none',
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  color: '#999',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#e8e8e8'
                  e.currentTarget.style.color = '#666'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#999'
                }}
              >
                <X size={10} />
              </button>
            )}
          </div>
        )}
      </div>

      {activeTab === 'structure' ? (
        <StructurePanel />
      ) : (
        <>
          {/* 分类 */}
          <div
            style={{
              padding: '8px',
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap',
              backgroundColor: '#fafafa',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            {categoryList.map(category => (
              <CategoryButton
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </div>

          {/* 搜索结果数量 */}
          {searchTerm && (
            <div
              style={{
                padding: '8px 12px',
                fontSize: '11px',
                color: '#666',
                backgroundColor: '#f9f9f9',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>
                找到 <strong style={{ color: '#2d2d2d' }}>{filteredMaterials.length}</strong> 个结果
              </span>
              {filteredMaterials.length > 0 && (
                <span style={{ color: '#999' }}>"{searchTerm}"</span>
              )}
            </div>
          )}

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
                        marginBottom: '6px',
                        paddingLeft: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                      }}
                    >
                      系统模板
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                      marginBottom: '6px',
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 20px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Search size={28} style={{ color: '#ccc' }} />
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#999',
                    marginBottom: '6px',
                  }}
                >
                  {searchTerm ? '未找到相关组件' : '暂无组件'}
                </div>
                <div style={{ fontSize: '11px', color: '#ccc', lineHeight: '1.5' }}>
                  {searchTerm ? (
                    <>
                      尝试使用其他关键词搜索
                      <br />
                      或切换到其他分类查看
                    </>
                  ) : (
                    '该分类下暂无可用组件'
                  )}
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{
                      marginTop: '16px',
                      padding: '6px 16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      backgroundColor: '#fff',
                      color: '#666',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#f8f8f8'
                      e.currentTarget.style.borderColor = '#d0d0d0'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#fff'
                      e.currentTarget.style.borderColor = '#e0e0e0'
                    }}
                  >
                    清除搜索
                  </button>
                )}
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
                            <div key={subcategory} style={{ marginBottom: '12px' }}>
                              <div
                                style={{
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  color: '#bbb',
                                  marginBottom: '6px',
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                    <div key={subcategory} style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: '#666',
                          marginBottom: '6px',
                          paddingLeft: '4px',
                        }}
                      >
                        {getSubcategoryName(subcategory)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
      title={label}
      style={{
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: active ? '#2d2d2d' : hover ? '#f0f0f0' : 'transparent',
        color: active ? '#fff' : '#666',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
    >
      {icon}
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

// 模板卡片组件 - 简化版
const TemplateCard: React.FC<{
  template: CustomTemplate
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}> = ({ template, onEdit, onDelete }) => {
  const [hover, setHover] = useState(false)
  const [tooltipPosition, setTooltipPosition] = React.useState<{ x: number; y: number } | null>(
    null
  )
  const cardRef = React.useRef<HTMLDivElement>(null)
  const { addNodeFromSchema } = useEditorStore()

  // 添加拖拽功能
  const [{ isDragging }, drag] = useDrag<TemplateDragItem, void, { isDragging: boolean }>(
    () => ({
      type: DragItemTypes.TEMPLATE,
      item: {
        type: DragItemTypes.TEMPLATE,
        templateSchema: template.schema,
        templateName: template.name,
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [template]
  )

  const handleUseTemplate = () => {
    // 在根节点添加模板
    addNodeFromSchema(template.schema)
    notification.success(`已添加模板: ${template.name}`)
  }

  const handleMouseEnter = () => {
    setHover(true)
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: rect.right + 8,
        y: rect.top,
      })
    }
  }

  const handleMouseLeave = () => {
    setHover(false)
    setTooltipPosition(null)
  }

  const combineRefs = (el: HTMLDivElement | null) => {
    drag(el)
    ;(cardRef as any).current = el
  }

  return (
    <>
      <div
        ref={combineRefs}
        onClick={handleUseTemplate}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          padding: '10px 12px',
          border: `1.5px solid ${hover ? '#d0d0d0' : 'transparent'}`,
          borderRadius: '6px',
          cursor: isDragging ? 'grabbing' : 'grab',
          backgroundColor: hover ? '#fff' : 'transparent',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: hover ? '0 3px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' : 'none',
          opacity: isDragging ? 0.5 : 1,
          transform: hover ? 'translateX(2px)' : 'translateX(0)',
        }}
      >
        {/* 拖动手柄 */}
        <div
          style={{
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hover ? '#666' : '#d0d0d0',
            flexShrink: 0,
            transition: 'color 0.15s',
          }}
        >
          <GripVertical size={14} strokeWidth={2.5} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#2d2d2d',
              lineHeight: '1.4',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
            }}
          >
            {template.name}
          </div>
        </div>

        {hover && (
          <div
            style={{
              display: 'flex',
              gap: '5px',
              flexShrink: 0,
            }}
          >
            <button
              onClick={onEdit}
              style={{
                width: '24px',
                height: '24px',
                border: 'none',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#f0f0f0',
                color: '#666',
                transition: 'all 0.15s',
              }}
              title="编辑"
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#e0e0e0'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#f0f0f0'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={onDelete}
              style={{
                width: '24px',
                height: '24px',
                border: 'none',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#fef2f2',
                color: '#ef4444',
                transition: 'all 0.15s',
              }}
              title="删除"
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#fee2e2'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#fef2f2'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Tooltip提示框 */}
      {hover && tooltipPosition && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            maxWidth: '240px',
            padding: '10px 12px',
            backgroundColor: '#2d2d2d',
            color: '#fff',
            borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)',
            zIndex: 10000,
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* 标题 */}
          <div
            style={{
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '6px',
              color: '#fff',
              lineHeight: '1.3',
            }}
          >
            {template.name}
          </div>

          {/* 描述 */}
          {template.description && (
            <div
              style={{
                fontSize: '11px',
                lineHeight: '1.5',
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '8px',
              }}
            >
              {template.description}
            </div>
          )}

          {/* 元信息 */}
          <div
            style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span>📅 {new Date(template.createTime).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>
      )}
    </>
  )
}

// 系统模板卡片组件 - 简化版（不可编辑/删除）
const SystemTemplateCard: React.FC<{
  template: SystemTemplate
}> = ({ template }) => {
  const [hover, setHover] = useState(false)
  const [tooltipPosition, setTooltipPosition] = React.useState<{ x: number; y: number } | null>(
    null
  )
  const cardRef = React.useRef<HTMLDivElement>(null)
  const { addNodeFromSchema } = useEditorStore()

  // 添加拖拽功能
  const [{ isDragging }, drag] = useDrag<TemplateDragItem, void, { isDragging: boolean }>(
    () => ({
      type: DragItemTypes.TEMPLATE,
      item: {
        type: DragItemTypes.TEMPLATE,
        templateSchema: template.schema,
        templateName: template.name,
      },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [template]
  )

  const handleUseTemplate = () => {
    addNodeFromSchema(template.schema)
    notification.success(`已添加模板: ${template.name}`)
  }

  const handleMouseEnter = () => {
    setHover(true)
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: rect.right + 8,
        y: rect.top,
      })
    }
  }

  const handleMouseLeave = () => {
    setHover(false)
    setTooltipPosition(null)
  }

  const combineRefs = (el: HTMLDivElement | null) => {
    drag(el)
    ;(cardRef as any).current = el
  }

  return (
    <>
      <div
        ref={combineRefs}
        onClick={handleUseTemplate}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          padding: '10px 12px',
          border: `1.5px solid ${hover ? '#d0d0d0' : 'transparent'}`,
          borderRadius: '6px',
          cursor: isDragging ? 'grabbing' : 'grab',
          backgroundColor: hover ? '#fff' : 'transparent',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: hover ? '0 3px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' : 'none',
          opacity: isDragging ? 0.5 : 1,
          transform: hover ? 'translateX(2px)' : 'translateX(0)',
        }}
      >
        {/* 拖动手柄 */}
        <div
          style={{
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hover ? '#666' : '#d0d0d0',
            flexShrink: 0,
            transition: 'color 0.15s',
          }}
        >
          <GripVertical size={14} strokeWidth={2.5} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#2d2d2d',
              lineHeight: '1.4',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
            }}
          >
            {template.name}
          </div>
        </div>

        {/* Hover 指示器 */}
        {hover && (
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              flexShrink: 0,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Tooltip提示框 */}
      {hover && template.description && tooltipPosition && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            maxWidth: '240px',
            padding: '10px 12px',
            backgroundColor: '#2d2d2d',
            color: '#fff',
            borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)',
            zIndex: 10000,
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* 标题 */}
          <div
            style={{
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '6px',
              color: '#fff',
              lineHeight: '1.3',
            }}
          >
            {template.name}
          </div>

          {/* 描述 */}
          <div
            style={{
              fontSize: '11px',
              lineHeight: '1.5',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {template.description}
          </div>
        </div>
      )}
    </>
  )
}

// 分类按钮组件 - 独立提取以避免在循环中使用 hooks
const CategoryButton: React.FC<{
  category: { id: string; name: string; icon: React.ReactNode }
  isActive: boolean
  onClick: () => void
}> = ({ category, isActive, onClick }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        height: '26px',
        padding: '0 9px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '10.5px',
        fontWeight: '600',
        cursor: 'pointer',
        backgroundColor: isActive ? '#2d2d2d' : hover ? '#f5f5f5' : 'transparent',
        color: isActive ? '#fff' : hover ? '#2d2d2d' : '#666',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        lineHeight: 1,
        transform: hover && !isActive ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: isActive
          ? '0 2px 8px rgba(45, 45, 45, 0.15)'
          : hover
            ? '0 1px 4px rgba(0, 0, 0, 0.08)'
            : 'none',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '13px',
          transition: 'transform 0.2s',
          transform: hover ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        {category.icon}
      </span>
      <span style={{ display: 'flex', alignItems: 'center' }}>{category.name}</span>
    </button>
  )
}

// 添加全局动画样式
if (typeof document !== 'undefined') {
  const styleId = 'material-panel-animations'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.6;
          transform: scale(1.2);
        }
      }
    `
    document.head.appendChild(style)
  }
}
