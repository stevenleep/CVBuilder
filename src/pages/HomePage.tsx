/**
 * 工作台首页 - 优化版
 *
 * 优化重点：
 * 1. 简化交互流程，减少跳转和点击次数
 * 2. 直接展示示例和模板，一键使用
 * 3. 最近编辑区域增强，快捷操作更明显
 */

import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Clock, Sparkles, Zap, Eye, Folder, Search, Filter, X } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { resumeTemplateManager } from '@/core/services/ResumeTemplateManager'
import { exampleResumes } from '@/data/examples'
import { nanoid } from 'nanoid'
import { notification } from '@/utils/notification'

interface RecentResume {
  id: string
  name: string
  description: string
  updatedAt: string
}

interface FilterableItem {
  id: string
  name: string
  description: string
  category?: string
  tags?: string[]
  schema?: unknown
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [recentResumes, setRecentResumes] = useState<RecentResume[]>([])
  const [templates, setTemplates] = useState<unknown[]>([])
  const [activeTab, setActiveTab] = useState<'examples' | 'templates'>('examples')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true)
      await Promise.all([loadRecentResumes(), loadTemplates()])
      setIsLoading(false)
    }

    loadAllData()

    const handleResumeUpdate = () => {
      loadRecentResumes()
    }
    window.addEventListener('cvkit-resume-updated', handleResumeUpdate)

    return () => {
      window.removeEventListener('cvkit-resume-updated', handleResumeUpdate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadRecentResumes = async () => {
    try {
      const allKeys = await indexedDBService.getAllKeys(STORES.RESUMES)
      const loaded: RecentResume[] = []

      for (const key of allKeys) {
        const resume = await indexedDBService.getItem<RecentResume>(STORES.RESUMES, String(key))
        if (resume) {
          loaded.push(resume)
        }
      }

      loaded.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      setRecentResumes(loaded.slice(0, 6))
    } catch (error) {
      console.error('Failed to load resumes:', error)
    }
  }

  const loadTemplates = () => {
    const allTemplates = resumeTemplateManager.getAllTemplates()
    setTemplates(allTemplates)
  }

  // 获取分类列表
  const categories = useMemo(() => {
    if (activeTab === 'examples') {
      const cats = Array.from(new Set(exampleResumes.map(e => e.category)))
      return ['全部', ...cats]
    }
    return ['全部']
  }, [activeTab])

  // 筛选和搜索
  const filteredItems = useMemo(() => {
    const items = (activeTab === 'examples' ? exampleResumes : templates) as FilterableItem[]

    return items.filter(item => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'all' ||
        selectedCategory === '全部' ||
        (activeTab === 'examples' && item.category === selectedCategory)

      return matchesSearch && matchesCategory
    })
  }, [activeTab, searchQuery, selectedCategory, templates])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return '刚刚'
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
    if (diff < 604800) return `${Math.floor(diff / 86400)}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const handleUseExample = async (exampleId: string) => {
    const example = exampleResumes.find(ex => ex.id === exampleId)
    if (!example) return

    try {
      const newId = nanoid()
      const resumeData = {
        id: newId,
        name: example.name,
        description: example.description,
        schema: example.schema,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await indexedDBService.setItem(STORES.RESUMES, newId, resumeData)
      notification.success(`已基于"${example.name}"创建新简历！`)
      navigate(`/editor/${newId}`)
    } catch (error) {
      notification.error('创建失败')
      console.error('Create from example error:', error)
    }
  }

  const handleUseTemplate = async (template: FilterableItem) => {
    if (!template.schema) {
      notification.error('模板数据无效')
      return
    }

    const resumeData = {
      id: nanoid(),
      name: `基于 ${template.name} 的简历`,
      description: `使用模板创建于 ${new Date().toLocaleDateString()}`,
      schema: template.schema,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      await indexedDBService.setItem(STORES.RESUMES, resumeData.id, resumeData)
      notification.success('已创建新简历！')
      navigate(`/editor/${resumeData.id}`)
    } catch (error) {
      notification.error('创建失败')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
      }}
    >
      {/* 顶部Header - 简化版（移除统计数据） */}
      <div
        style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #e8e8e8',
        }}
      >
        <div
          style={{
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <Logo size={32} showText textSize={16} />

          {/* 右侧操作区 */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/resumes')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#666',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f0f0f0'
                e.currentTarget.style.color = '#2d2d2d'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#666'
              }}
            >
              <Folder size={14} />
              简历库
            </button>
            <button
              onClick={() => navigate('/templates')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#666',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f0f0f0'
                e.currentTarget.style.color = '#2d2d2d'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#666'
              }}
            >
              <FileText size={14} />
              模板库
            </button>
            <button
              onClick={() => navigate('/editor')}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#2d2d2d',
                color: '#fff',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#1a1a1a'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#2d2d2d'
              }}
            >
              <Plus size={14} />
              新建简历
            </button>
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero区域 - 简化版 */}
        <div
          style={{
            backgroundColor: '#2d2d2d',
            borderRadius: '10px',
            padding: '24px 28px',
            marginBottom: '24px',
          }}
        >
          <div style={{ maxWidth: '500px' }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#fff',
                marginBottom: '6px',
                lineHeight: 1.2,
              }}
            >
              创建专业简历
            </h1>
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '16px',
              }}
            >
              使用精选示例快速开始，或从空白模板自由创作
            </p>
            <button
              onClick={() => navigate('/editor')}
              style={{
                padding: '7px 18px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#fff',
                color: '#2d2d2d',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f0f0f0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#fff'
              }}
            >
              <Plus size={15} />
              创建空白简历
            </button>
          </div>
        </div>

        {/* 最近编辑 */}
        {recentResumes.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <h2
                style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#2d2d2d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                }}
              >
                <Clock size={16} />
                最近编辑
              </h2>
              <button
                onClick={() => navigate('/resumes')}
                style={{
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '5px',
                  backgroundColor: 'transparent',
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                  e.currentTarget.style.color = '#2d2d2d'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#666'
                }}
              >
                查看全部 →
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '12px',
              }}
            >
              {recentResumes.map(resume => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={() => navigate(`/editor/${resume.id}`)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}

        {/* 快速开始区域 */}
        <div id="quick-start-section">
          <div style={{ marginBottom: '14px' }}>
            <h2
              style={{
                fontSize: '17px',
                fontWeight: '700',
                color: '#2d2d2d',
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
              }}
            >
              <Zap
                size={16}
                style={{
                  color: '#f59e0b',
                }}
              />
              快速开始
            </h2>
            <p style={{ fontSize: '13px', color: '#666' }}>
              从精选示例或模板开始，一键创建并编辑你的专属简历
            </p>
          </div>

          {/* 搜索和筛选栏 */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '14px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* 标签切换 */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <TabButton
                active={activeTab === 'examples'}
                onClick={() => {
                  setActiveTab('examples')
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                icon={<Sparkles size={14} />}
                label={`示例 (${exampleResumes.length})`}
              />
              <TabButton
                active={activeTab === 'templates'}
                onClick={() => {
                  setActiveTab('templates')
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                icon={<FileText size={14} />}
                label={`模板 (${templates.length})`}
              />
            </div>

            {/* 搜索框 */}
            <div style={{ flex: 1, maxWidth: '320px', position: 'relative' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="搜索简历..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: '#fff',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#2d2d2d'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '7px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '2px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#999',
                    cursor: 'pointer',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#f0f0f0'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* 分类筛选 */}
            {activeTab === 'examples' && categories.length > 1 && (
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Filter size={13} style={{ color: '#999', margin: '0 2px' }} />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === '全部' ? 'all' : cat)}
                    style={{
                      padding: '5px 11px',
                      border: 'none',
                      borderRadius: '5px',
                      backgroundColor:
                        (selectedCategory === 'all' && cat === '全部') || selectedCategory === cat
                          ? '#2d2d2d'
                          : '#f0f0f0',
                      color:
                        (selectedCategory === 'all' && cat === '全部') || selectedCategory === cat
                          ? '#fff'
                          : '#666',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (
                        !(
                          (selectedCategory === 'all' && cat === '全部') ||
                          selectedCategory === cat
                        )
                      ) {
                        e.currentTarget.style.backgroundColor = '#e5e5e5'
                      }
                    }}
                    onMouseLeave={e => {
                      if (
                        !(
                          (selectedCategory === 'all' && cat === '全部') ||
                          selectedCategory === cat
                        )
                      ) {
                        e.currentTarget.style.backgroundColor = '#f0f0f0'
                      }
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 内容展示 */}
          {isLoading ? (
            <LoadingGrid />
          ) : filteredItems.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              onClear={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '12px',
              }}
            >
              {filteredItems.map(item => (
                <QuickStartCard
                  key={item.id}
                  title={item.name}
                  description={item.description}
                  category={activeTab === 'examples' ? item.category : undefined}
                  tags={item.tags}
                  onUse={() =>
                    activeTab === 'examples' ? handleUseExample(item.id) : handleUseTemplate(item)
                  }
                  onPreview={() =>
                    navigate(
                      activeTab === 'examples'
                        ? `/examples/${item.id}/preview`
                        : `/templates/${item.id}/preview`
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 标签按钮
const TabButton: React.FC<{
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}> = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 13px',
        borderRadius: '6px',
        backgroundColor: active ? '#2d2d2d' : '#fff',
        color: active ? '#fff' : '#666',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'all 0.2s',
        border: active ? '1px solid #2d2d2d' : '1px solid #e0e0e0',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = '#f8f9fa'
          e.currentTarget.style.borderColor = '#d0d0d0'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = '#fff'
          e.currentTarget.style.borderColor = '#e0e0e0'
        }
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// 加载骨架屏 - 多列网格布局
const LoadingGrid: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '12px',
      }}
    >
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '14px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #e8e8e8',
            height: '180px',
          }}
        >
          {/* 分类标签 */}
          <div
            style={{
              width: '60px',
              height: '20px',
              backgroundColor: '#f0f0f0',
              borderRadius: '5px',
              marginBottom: '10px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />

          {/* 标题和描述 */}
          <div style={{ flex: 1, marginBottom: '10px' }}>
            <div
              style={{
                width: '80%',
                height: '16px',
                backgroundColor: '#f0f0f0',
                borderRadius: '3px',
                marginBottom: '5px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                width: '90%',
                height: '14px',
                backgroundColor: '#f0f0f0',
                borderRadius: '3px',
                marginBottom: '3px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                width: '70%',
                height: '14px',
                backgroundColor: '#f0f0f0',
                borderRadius: '3px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </div>

          {/* 标签 */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            {[1, 2].map(j => (
              <div
                key={j}
                style={{
                  width: '50px',
                  height: '18px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>

          {/* 按钮组 */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <div
              style={{
                flex: 1,
                height: '28px',
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                flex: 1,
                height: '28px',
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      ))}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  )
}

// 空状态组件
const EmptyState: React.FC<{
  searchQuery: string
  onClear: () => void
}> = ({ searchQuery, onClear }) => {
  return (
    <div
      style={{
        padding: '50px 28px',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: '10px',
        border: '1px dashed #d0d0d0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          margin: '0 auto 16px',
          borderRadius: '50%',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Search size={26} style={{ color: '#ccc' }} />
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2d2d2d', marginBottom: '8px' }}>
        未找到相关内容
      </h3>
      <p style={{ fontSize: '13px', color: '#666', maxWidth: '320px', margin: '0 auto 18px' }}>
        {searchQuery ? `没有找到包含 "${searchQuery}" 的简历` : '当前筛选条件下没有内容'}
      </p>
      <button
        onClick={onClear}
        style={{
          padding: '8px 18px',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: '#2d2d2d',
          color: '#fff',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#1a1a1a'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#2d2d2d'
        }}
      >
        清除筛选
      </button>
    </div>
  )
}

// 快速开始卡片 - 紧凑型多列布局
const QuickStartCard: React.FC<{
  title: string
  description: string
  category?: string
  tags?: string[]
  onUse: () => void
  onPreview: () => void
}> = ({ title, description, category, tags, onUse, onPreview }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '14px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: `1px solid ${hover ? '#2d2d2d' : '#e8e8e8'}`,
        transition: 'all 0.2s',
        height: '100%',
      }}
    >
      {/* 顶部：分类标签 */}
      {category && (
        <div
          style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            padding: '3px 9px',
            borderRadius: '5px',
            backgroundColor: hover ? '#2d2d2d' : '#f0f0f0',
            color: hover ? '#fff' : '#666',
            fontSize: '10px',
            fontWeight: '600',
            transition: 'all 0.2s',
            letterSpacing: '0.2px',
            marginBottom: '10px',
          }}
        >
          {category}
        </div>
      )}

      {/* 标题和描述 */}
      <div style={{ flex: 1, marginBottom: '10px' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#2d2d2d',
            marginBottom: '5px',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '12px',
            color: '#666',
            lineHeight: '1.5',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </p>
      </div>

      {/* 标签 */}
      {tags && tags.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              style={{
                padding: '3px 7px',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                color: '#999',
                fontSize: '10px',
                fontWeight: '500',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 底部：按钮组 */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={onPreview}
          style={{
            flex: 1,
            padding: '7px',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            backgroundColor: '#fff',
            color: '#666',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f8f9fa'
            e.currentTarget.style.borderColor = '#d0d0d0'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#fff'
            e.currentTarget.style.borderColor = '#e0e0e0'
          }}
        >
          <Eye size={13} />
          预览
        </button>
        <button
          onClick={onUse}
          style={{
            flex: 1,
            padding: '7px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: hover ? '#2d2d2d' : '#f0f0f0',
            color: hover ? '#fff' : '#666',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'all 0.2s',
          }}
        >
          <Plus size={13} />
          使用
        </button>
      </div>
    </div>
  )
}

// 简历卡片
const ResumeCard: React.FC<{
  resume: RecentResume
  onEdit: () => void
  formatDate: (date: string) => string
}> = ({ resume, onEdit, formatDate }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onEdit}
      style={{
        padding: '14px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        border: `1px solid ${hover ? '#2d2d2d' : '#e8e8e8'}`,
        cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: hover ? '#2d2d2d' : '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hover ? '#fff' : '#999',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          <FileText size={18} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#2d2d2d',
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {resume.name}
          </h3>
          <p
            style={{
              fontSize: '11px',
              color: '#999',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {resume.description || '暂无描述'}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Clock size={12} />
          {formatDate(resume.updatedAt)}
        </span>
        <button
          onClick={e => {
            e.stopPropagation()
            onEdit()
          }}
          style={{
            padding: '5px 12px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: hover ? '#2d2d2d' : '#f0f0f0',
            color: hover ? '#fff' : '#666',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          继续编辑
        </button>
      </div>
    </div>
  )
}
