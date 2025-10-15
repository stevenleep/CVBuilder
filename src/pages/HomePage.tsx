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
import {
  FileText,
  Plus,
  Clock,
  Sparkles,
  Zap,
  Eye,
  Folder,
  Search,
  ChevronDown,
  X,
  Trash2,
  Pencil,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { HomeIconModal } from '@/components/HomeIconModal'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { exampleResumes } from '@/data/examples'
import { nanoid } from 'nanoid'
import { notification } from '@/utils/notification'

interface RecentResume {
  id: string
  name: string
  description: string
  updatedAt: string
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [recentResumes, setRecentResumes] = useState<RecentResume[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true)
      await loadRecentResumes()
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
      setRecentResumes(loaded.slice(0, 8))
    } catch (error) {
      console.error('Failed to load resumes:', error)
    }
  }

  const handleDeleteResume = async (resumeId: string, resumeName: string) => {
    const confirmed = await notification.confirm({
      title: '删除简历',
      message: `确定要删除简历「${resumeName}」吗？\n\n此操作无法撤销。`,
      confirmText: '删除',
      cancelText: '取消',
    })

    if (!confirmed) {
      return
    }

    try {
      await indexedDBService.removeItem(STORES.RESUMES, resumeId)
      notification.success('简历已删除')
      await loadRecentResumes()
    } catch (error) {
      notification.error('删除失败')
      console.error('Delete resume error:', error)
    }
  }

  const categories = useMemo(() => {
    const cats = Array.from(new Set(exampleResumes.map(e => e.category)))
    return ['全部', ...cats]
  }, [])

  // 筛选和搜索
  const filteredItems = useMemo(() => {
    return exampleResumes.filter(item => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'all' ||
        selectedCategory === '全部' ||
        item.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

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
            marginBottom: '36px',
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
          <div style={{ marginBottom: '48px' }}>
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
                  onDelete={() => handleDeleteResume(resume.id, resume.name)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        )}

        {/* 快速开始区域 */}
        <div id="quick-start-section">
          {/* 标题和搜索筛选栏 - 同一行 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              gap: '16px',
            }}
          >
            {/* 左侧：标题 */}
            <div>
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
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                从精选示例开始，一键创建你的专属简历
              </p>
            </div>

            {/* 右侧：搜索和筛选 */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              {/* 分类下拉框 */}
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{
                    padding: '7px 32px 7px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    backgroundColor: '#fff',
                    color: '#2d2d2d',
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#2d2d2d'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#e0e0e0'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat === '全部' ? 'all' : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* 搜索框 */}
              <div style={{ position: 'relative', width: '280px' }}>
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
            </div>
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
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '12px',
              }}
            >
              {filteredItems.map(item => (
                <QuickStartCard
                  key={item.id}
                  title={item.name}
                  description={item.description}
                  category={item.category}
                  onUse={() => handleUseExample(item.id)}
                  onPreview={() => navigate(`/examples/${item.id}/preview`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 加载骨架屏 - 统一风格
const LoadingGrid: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '12px',
      }}
    >
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div
          key={i}
          style={{
            padding: '14px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            border: '1px solid #e8e8e8',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}
          >
            {/* 图标骨架 */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#f0f0f0',
                flexShrink: 0,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            {/* 内容骨架 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: '80%',
                  height: '14px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '3px',
                  marginBottom: '6px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: '60%',
                  height: '11px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '3px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* 底部按钮骨架 */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              paddingTop: '12px',
              borderTop: '1px solid #f0f0f0',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '24px',
                backgroundColor: '#f0f0f0',
                borderRadius: '5px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                flex: 1,
                height: '24px',
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

// 快速开始卡片 - 柔和阴影风格
const QuickStartCard: React.FC<{
  title: string
  description: string
  category?: string
  onUse: () => void
  onPreview: () => void
}> = ({ title, description, category, onUse, onPreview }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '14px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        border: 'none',
        boxShadow: hover
          ? '0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)'
          : '0 1px 3px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02)',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
        {/* 图标 */}
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
          <Sparkles size={18} strokeWidth={2} />
        </div>

        {/* 标题和描述 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <h3
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#2d2d2d',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {title}
            </h3>
            {/* 分类标签 */}
            {category && (
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: hover ? '#2d2d2d' : '#f0f0f0',
                  color: hover ? '#fff' : '#666',
                  fontSize: '10px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {category}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '11px',
              color: '#999',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {description || '暂无描述'}
          </p>
        </div>
      </div>

      {/* 底部：按钮组 - hover时显示 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          paddingTop: '12px',
          borderTop: hover ? '1px solid #f0f0f0' : '1px solid transparent',
          opacity: hover ? 1 : 0,
          transform: hover ? 'translateY(0)' : 'translateY(-4px)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <button
          onClick={e => {
            e.stopPropagation()
            onPreview()
          }}
          style={{
            flex: 1,
            padding: '5px 10px',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            backgroundColor: '#fff',
            color: '#666',
            fontSize: '11px',
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
          <Eye size={12} />
          预览
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            onUse()
          }}
          style={{
            flex: 1,
            padding: '5px 12px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#2d2d2d',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
          <Plus size={12} />
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
  onDelete: () => void
  formatDate: (date: string) => string
}> = ({ resume, onEdit, onDelete, formatDate }) => {
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
        position: 'relative',
      }}
    >
      {/* 删除按钮 - hover时显示在右上角 */}
      {hover && (
        <button
          onClick={e => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#fff',
            color: '#dc2626',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
            zIndex: 10,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#fee2e2'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#fff'
          }}
          title="删除简历"
        >
          <Trash2 size={14} />
        </button>
      )}

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
          borderTop: hover ? '1px solid #f0f0f0' : '1px solid transparent',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            color: '#999',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            opacity: hover ? 0.8 : 1,
            transition: 'opacity 0.2s',
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
            backgroundColor: '#2d2d2d',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            opacity: hover ? 1 : 0,
            transform: hover ? 'translateY(0)' : 'translateY(-4px)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#1a1a1a'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#2d2d2d'
          }}
        >
          <Pencil size={12} />
          继续编辑
        </button>
      </div>

      {/* 首页图标提示窗口 */}
      <HomeIconModal
        isOpen={showHomeIconModal}
        onClose={() => setShowHomeIconModal(false)}
        onConfirm={() => {
          setShowHomeIconModal(false)
          navigate('/')
        }}
      />
    </div>
  )
}
