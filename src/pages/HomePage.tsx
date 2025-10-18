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
  Settings,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { encryptedStorageService } from '@/core/services/EncryptedStorageService'
import { STORES } from '@/utils/indexedDB'
import { exampleResumes } from '@/data/examples'
import { nanoid } from 'nanoid'
import { notification } from '@/utils/notification'
import { SaveResumeFullscreenModal } from '@/editor/SaveResumeFullscreenModal'
import { useEncryption } from '@/core/context/EncryptionContext'

interface RecentResume {
  id: string
  name: string
  description: string
  tags: string[]
  updatedAt: string
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { isEnabled, isUnlocked } = useEncryption()
  const [recentResumes, setRecentResumes] = useState<RecentResume[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingResume, setEditingResume] = useState<RecentResume | null>(null)

  useEffect(() => {
    const loadAllData = async () => {
      // 如果启用了加密但未解锁，不加载数据（等待解锁）
      if (isEnabled && !isUnlocked) {
        setIsLoading(false)
        return
      }

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
  }, [isEnabled, isUnlocked])

  const loadRecentResumes = async () => {
    try {
      const allKeys = await encryptedStorageService.getAllKeys(STORES.RESUMES)
      const loaded: RecentResume[] = []

      for (const key of allKeys) {
        const resume = await encryptedStorageService.getItem<RecentResume>(
          STORES.RESUMES,
          String(key)
        )
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
      await encryptedStorageService.removeItem(STORES.RESUMES, resumeId)
      notification.success('简历已删除')
      await loadRecentResumes()
    } catch (error) {
      notification.error('删除失败')
      console.error('Delete resume error:', error)
    }
  }

  const handleEditInfo = (e: React.MouseEvent, resume: RecentResume) => {
    e.stopPropagation()
    setEditingResume(resume)
    setShowEditModal(true)
  }

  const handleSaveEdit = async (name: string, description: string, tags: string[]) => {
    if (!editingResume) return

    try {
      const updatedResume = {
        ...editingResume,
        name,
        description,
        tags,
        updatedAt: new Date().toISOString(),
      }

      await indexedDBService.setItem(STORES.RESUMES, editingResume.id, updatedResume)

      // 更新本地状态
      setRecentResumes(recentResumes.map(r => (r.id === editingResume.id ? updatedResume : r)))

      notification.success('简历信息已更新')
      setShowEditModal(false)
      setEditingResume(null)
    } catch (error) {
      notification.error('更新失败')
      console.error('Update error:', error)
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

      await encryptedStorageService.setItem(STORES.RESUMES, newId, resumeData)
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
      <style>
        {`
          @media (max-width: 768px) {
            .homepage-container {
              padding: 16px !important;
            }
            .homepage-hero {
              padding: 24px 20px !important;
              margin-bottom: 32px !important;
            }
            .homepage-hero h1 {
              font-size: 24px !important;
            }
            .homepage-hero p {
              font-size: 14px !important;
            }
            .homepage-section-title {
              font-size: 18px !important;
            }
            .homepage-search-container {
              flex-direction: column !important;
              gap: 12px !important;
              align-items: stretch !important;
            }
            .homepage-search-input {
              width: 100% !important;
            }
            .homepage-grid {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
            }
            .homepage-card {
              padding: 16px !important;
            }
          }
          
          @media (max-width: 480px) {
            .homepage-hero {
              padding: 20px 16px !important;
            }
            .homepage-hero h1 {
              font-size: 20px !important;
            }
            .homepage-hero-buttons {
              flex-direction: column !important;
              gap: 12px !important;
            }
            .homepage-hero-buttons button {
              width: 100% !important;
            }
          }
        `}
      </style>
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
              onClick={() => navigate('/settings')}
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
              <Settings size={14} />
              设置
            </button>
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
      <div
        className="homepage-container"
        style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* Hero区域 - 精致渐变版 */}
        <div
          className="homepage-hero"
          style={{
            backgroundColor: '#2d2d2d',
            borderRadius: '16px',
            padding: '40px 36px',
            marginBottom: '48px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Sparkles size={24} color="#2d2d2d" strokeWidth={2} />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#fff',
                    marginBottom: '8px',
                    lineHeight: 1.1,
                  }}
                >
                  创建专业简历
                </h1>
                <div
                  style={{
                    width: '60px',
                    height: '3px',
                    backgroundColor: '#fff',
                    borderRadius: '2px',
                  }}
                />
              </div>
            </div>

            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '32px',
                lineHeight: 1.6,
                maxWidth: '480px',
              }}
            >
              使用精选示例快速开始，或从空白模板自由创作。让每一份简历都成为你职业发展的完美起点。
            </p>

            <div
              className="homepage-hero-buttons"
              style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
            >
              <button
                onClick={() => navigate('/editor')}
                style={{
                  padding: '14px 28px',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: '#fff',
                  color: '#2d2d2d',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow =
                    '0 12px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow =
                    '0 8px 16px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
                }}
              >
                <Plus size={18} />
                创建空白简历
              </button>

              <button
                onClick={() =>
                  document
                    .getElementById('quick-start-section')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                style={{
                  padding: '14px 24px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <Eye size={18} />
                浏览示例
              </button>
            </div>
          </div>
        </div>

        {/* 最近编辑 */}
        {recentResumes.length > 0 && (
          <div style={{ marginBottom: '56px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#2d2d2d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '4px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#2d2d2d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <Clock size={16} />
                  </div>
                  最近编辑
                </h2>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  继续编辑你的简历，或创建新的作品
                </p>
              </div>
              <button
                onClick={() => navigate('/resumes')}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#666',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#f8f9fa'
                  e.currentTarget.style.borderColor = '#cbd5e1'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.04)'
                }}
              >
                查看全部
                <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
              </button>
            </div>

            <div
              className="homepage-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              {recentResumes.map(resume => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={() => navigate(`/editor/${resume.id}`)}
                  onDelete={() => handleDeleteResume(resume.id, resume.name)}
                  onEditInfo={e => handleEditInfo(e, resume)}
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
              marginBottom: '24px',
              gap: '24px',
            }}
          >
            {/* 左侧：标题 */}
            <div>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#2d2d2d',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#2d2d2d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 4px 8px rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <Zap size={16} />
                </div>
                快速开始
              </h2>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                从精选示例开始，一键创建你的专属简历
              </p>
            </div>

            {/* 右侧：搜索和筛选 */}
            <div
              className="homepage-search-container"
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              {/* 分类下拉框 */}
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{
                    padding: '10px 36px 10px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: '#fff',
                    color: '#666',
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                    minWidth: '120px',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#2d2d2d'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat === '全部' ? 'all' : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* 搜索框 */}
              <div
                className="homepage-search-input"
                style={{ position: 'relative', width: '320px' }}
              >
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="搜索简历模板..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: '#fff',
                    color: '#666',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#2d2d2d'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.04)'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '4px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#999',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9'
                      e.currentTarget.style.color = '#666'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#999'
                    }}
                  >
                    <X size={14} />
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
              className="homepage-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
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

      {/* 编辑信息Modal */}
      {showEditModal && editingResume && (
        <SaveResumeFullscreenModal
          initialName={editingResume.name}
          initialDescription={editingResume.description}
          initialTags={editingResume.tags || []}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowEditModal(false)
            setEditingResume(null)
          }}
        />
      )}
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

// 快速开始卡片 - 精致设计风格
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
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        boxShadow: hover
          ? '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.1)'
          : '0 4px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 装饰性背景渐变 */}
      {hover && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: '#2d2d2d',
            borderRadius: '16px 16px 0 0',
          }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
        {/* 图标 */}
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: hover ? '#2d2d2d' : '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hover ? '#fff' : '#999',
            flexShrink: 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: hover
              ? '0 8px 16px rgba(59, 130, 246, 0.2)'
              : '0 2px 4px rgba(0, 0, 0, 0.04)',
            transform: hover ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <Sparkles size={20} strokeWidth={2} />
        </div>

        {/* 标题和描述 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#2d2d2d',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                lineHeight: 1.3,
              }}
            >
              {title}
            </h3>
            {/* 分类标签 */}
            {category && (
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: hover ? '#2d2d2d' : '#f1f5f9',
                  color: hover ? '#fff' : '#666',
                  fontSize: '11px',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0,
                  boxShadow: hover
                    ? '0 2px 4px rgba(59, 130, 246, 0.2)'
                    : '0 1px 2px rgba(0, 0, 0, 0.04)',
                }}
              >
                {category}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '13px',
              color: '#666',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.4,
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
          gap: '8px',
          paddingTop: '16px',
          borderTop: hover ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid transparent',
          opacity: hover ? 1 : 0,
          transform: hover ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <button
          onClick={e => {
            e.stopPropagation()
            onPreview()
          }}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            backgroundColor: '#fff',
            color: '#666',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f8f9fa'
            e.currentTarget.style.borderColor = '#cbd5e1'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.08)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#fff'
            e.currentTarget.style.borderColor = '#e2e8f0'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.04)'
          }}
        >
          <Eye size={14} />
          预览
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            onUse()
          }}
          style={{
            flex: 1,
            padding: '10px 16px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#2d2d2d',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#1a1a1a'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#1a1a1a'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)'
          }}
        >
          <Plus size={14} />
          使用
        </button>
      </div>
    </div>
  )
}

// 简历卡片 - 精致设计风格
const ResumeCard: React.FC<{
  resume: RecentResume
  onEdit: () => void
  onDelete: () => void
  onEditInfo: (e: React.MouseEvent) => void
  formatDate: (date: string) => string
}> = ({ resume, onEdit, onDelete, onEditInfo, formatDate }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onEdit}
      style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: `1px solid ${hover ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 0, 0, 0.04)'}`,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hover
          ? '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.1)'
          : '0 4px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* 装饰性背景渐变 */}
      {hover && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: '#2d2d2d',
            borderRadius: '16px 16px 0 0',
          }}
        />
      )}

      {/* 删除按钮 - hover时显示在右上角 */}
      {hover && (
        <button
          onClick={e => {
            e.stopPropagation()
            onDelete()
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#fff',
            color: '#dc2626',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 10,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#fee2e2'
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(220, 38, 38, 0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#fff'
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow =
              '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
          }}
          title="删除简历"
        >
          <Trash2 size={16} />
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: hover ? '#2d2d2d' : '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hover ? '#fff' : '#999',
            flexShrink: 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: hover
              ? '0 8px 16px rgba(59, 130, 246, 0.2)'
              : '0 2px 4px rgba(0, 0, 0, 0.04)',
            transform: hover ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <FileText size={20} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#2d2d2d',
              marginBottom: '6px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.3,
            }}
          >
            {resume.name}
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: '#666',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: 1.4,
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
          paddingTop: '16px',
          borderTop: hover ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid transparent',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: hover ? 0.8 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            <Clock size={14} />
            {formatDate(resume.updatedAt)}
          </span>

          {/* 标签显示 - 显示在时间旁边 */}
          {resume.tags && resume.tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                opacity: hover ? 0.3 : 0.7,
                transition: 'opacity 0.3s',
              }}
            >
              {resume.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    backgroundColor: '#f0f0f0',
                    color: '#666',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tag}
                </span>
              ))}
              {resume.tags.length > 2 && (
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    backgroundColor: '#f8f9fa',
                    color: '#999',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0',
                    whiteSpace: 'nowrap',
                  }}
                >
                  +{resume.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={onEditInfo}
            style={{
              width: '32px',
              height: '32px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: hover ? 1 : 0,
              transform: hover ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'
              e.currentTarget.style.color = '#2d2d2d'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#666'
            }}
            title="编辑信息"
          >
            <Settings size={14} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              onEdit()
            }}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#2d2d2d',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: hover ? 1 : 0,
              transform: hover ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1a1a1a'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#1a1a1a'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)'
            }}
          >
            <Pencil size={14} />
            继续编辑
          </button>
        </div>
      </div>
    </div>
  )
}
