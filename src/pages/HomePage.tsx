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
  Copy,
  Star,
  TrendingUp,
  Rocket,
  ArrowRight,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { encryptedStorageService } from '@/core/services/EncryptedStorageService'
import { STORES, indexedDBService } from '@/utils/indexedDB'
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
  const [showWelcome, setShowWelcome] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [favoriteResumes, setFavoriteResumes] = useState<Set<string>>(new Set())

  // 页面进入动画
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // 首次访问检测
  useEffect(() => {
    const hasVisited = localStorage.getItem('cvkit-has-visited')
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setShowWelcome(true)
        localStorage.setItem('cvkit-has-visited', 'true')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  // 加载收藏状态
  useEffect(() => {
    const loadFavorites = () => {
      const saved = localStorage.getItem('cvkit-favorite-resumes')
      if (saved) {
        setFavoriteResumes(new Set(JSON.parse(saved)))
      }
    }
    loadFavorites()
  }, [])

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
      console.log('[加载] 所有简历 keys:', allKeys)
      const loaded: RecentResume[] = []

      for (const key of allKeys) {
        const resume = await encryptedStorageService.getItem<RecentResume>(
          STORES.RESUMES,
          String(key)
        )
        if (resume) {
          console.log('[加载] 找到简历:', resume.id, resume.name)
          loaded.push(resume)
        }
      }

      loaded.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      console.log('[加载] 排序后的简历列表:', loaded.map(r => ({ id: r.id, name: r.name })))
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
      console.log('[删除] 开始删除简历:', resumeId)
      
      // 如果这个简历正在编辑器中打开，通知编辑器清除ID
      const { currentResumeId, setCurrentResumeId } = await import('@/store/editorStore').then(m => m.useEditorStore.getState())
      if (currentResumeId === resumeId) {
        console.log('[删除] 清除编辑器中的 currentResumeId')
        setCurrentResumeId(null)
      }
      
      // 先从本地状态中移除（乐观更新）
      setRecentResumes(prev => prev.filter(r => r.id !== resumeId))
      
      // 然后删除数据库中的数据
      await encryptedStorageService.removeItem(STORES.RESUMES, resumeId)
      console.log('[删除] 已从 RESUMES store 删除:', resumeId)
      
      // 删除对应的缩略图（如果存在）
      try {
        await indexedDBService.removeItem(STORES.THUMBNAILS, `resume-${resumeId}`)
        console.log('[删除] 已删除缩略图:', `resume-${resumeId}`)
      } catch (e) {
        // 缩略图可能不存在，忽略错误
        console.log('[删除] 缩略图不存在，跳过')
      }
      
      // 验证删除是否成功（延迟一下，确保异步操作完成）
      await new Promise(resolve => setTimeout(resolve, 100))
      const checkDeleted = await encryptedStorageService.getItem(STORES.RESUMES, resumeId)
      if (checkDeleted) {
        console.error('[删除] 警告：删除后数据仍然存在!', checkDeleted)
        notification.error('删除可能失败，请刷新页面确认')
      } else {
        console.log('[删除] 验证成功：数据已被删除')
        notification.success('简历已删除')
        
        // 触发简历列表更新事件
        window.dispatchEvent(new CustomEvent('cvkit-resume-deleted', { detail: { resumeId } }))
      }
    } catch (error) {
      notification.error('删除失败')
      console.error('Delete resume error:', error)
      // 如果删除失败，重新加载以恢复状态
      await loadRecentResumes()
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

      await encryptedStorageService.setItem(STORES.RESUMES, editingResume.id, updatedResume)

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

  const handleToggleFavorite = (resumeId: string) => {
    setFavoriteResumes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(resumeId)) {
        newSet.delete(resumeId)
        notification.success('已取消收藏')
      } else {
        newSet.add(resumeId)
        notification.success('已添加到收藏')
      }
      localStorage.setItem('cvkit-favorite-resumes', JSON.stringify(Array.from(newSet)))
      return newSet
    })
  }

  const handleDuplicateResume = async (resume: RecentResume) => {
    try {
      const fullResume = await encryptedStorageService.getItem(STORES.RESUMES, resume.id)
      if (!fullResume) {
        notification.error('无法复制简历')
        return
      }

      const newId = nanoid()
      const newResume = {
        ...fullResume,
        id: newId,
        name: `${resume.name} (副本)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await encryptedStorageService.setItem(STORES.RESUMES, newId, newResume)
      notification.success('简历已复制')
      await loadRecentResumes()
    } catch (error) {
      notification.error('复制失败')
      console.error('Duplicate error:', error)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        opacity: pageLoaded ? 1 : 0,
        transform: pageLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition:
          'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .animate-item {
            animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          
          .animate-item:nth-child(1) { animation-delay: 0.1s; opacity: 0; }
          .animate-item:nth-child(2) { animation-delay: 0.2s; opacity: 0; }
          .animate-item:nth-child(3) { animation-delay: 0.3s; opacity: 0; }
          .animate-item:nth-child(4) { animation-delay: 0.4s; opacity: 0; }
          .animate-item:nth-child(5) { animation-delay: 0.5s; opacity: 0; }
          .animate-item:nth-child(6) { animation-delay: 0.6s; opacity: 0; }
          
          @media (max-width: 768px) {
            .homepage-container {
              padding: 16px !important;
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
        {/* 最近编辑 */}
        {recentResumes.length > 0 ? (
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
              {/* 创建新简历卡片 */}
              <CreateNewResumeCard animationDelay={0} />

              {recentResumes.map((resume, index) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={() => navigate(`/editor/${resume.id}`)}
                  onDelete={() => handleDeleteResume(resume.id, resume.name)}
                  onEditInfo={e => handleEditInfo(e, resume)}
                  onDuplicate={() => handleDuplicateResume(resume)}
                  onToggleFavorite={() => handleToggleFavorite(resume.id)}
                  isFavorite={favoriteResumes.has(resume.id)}
                  formatDate={formatDate}
                  animationDelay={(index + 1) * 0.1}
                />
              ))}
            </div>
          </div>
        ) : (
          !isLoading && (
            <div
              style={{
                marginBottom: '56px',
                padding: '48px 32px',
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '2px dashed #e2e8f0',
                textAlign: 'center',
                animation: 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <FileText size={36} color="#999" />
              </div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2d2d2d',
                  marginBottom: '12px',
                }}
              >
                还没有创建简历
              </h3>
              <p
                style={{
                  fontSize: '15px',
                  color: '#666',
                  marginBottom: '28px',
                  lineHeight: 1.6,
                  maxWidth: '480px',
                  margin: '0 auto 28px',
                }}
              >
                从下方精选模板快速开始，或者创建一份全新的空白简历
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => navigate('/editor')}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#2d2d2d',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 8px rgba(45, 45, 45, 0.2)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#1a1a1a'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(45, 45, 45, 0.3)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#2d2d2d'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(45, 45, 45, 0.2)'
                  }}
                >
                  <Plus size={16} />
                  创建空白简历
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById('quick-start-section')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa'
                    e.currentTarget.style.borderColor = '#cbd5e1'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#fff'
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <Eye size={16} />
                  浏览模板
                </button>
              </div>
            </div>
          )
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
              {filteredItems.map((item, index) => (
                <QuickStartCard
                  key={item.id}
                  title={item.name}
                  description={item.description}
                  category={item.category}
                  onUse={() => handleUseExample(item.id)}
                  onPreview={() => navigate(`/examples/${item.id}/preview`)}
                  animationDelay={index * 0.05}
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

      {/* 欢迎引导Modal */}
      {showWelcome && <WelcomeGuideModal onClose={() => setShowWelcome(false)} />}
    </div>
  )
}

// 创建新简历卡片 - 简洁版，高度与其他卡片一致
const CreateNewResumeCard: React.FC<{ animationDelay?: number }> = ({ animationDelay = 0 }) => {
  const navigate = useNavigate()
  const [hover, setHover] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => navigate('/editor')}
      style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: `1px dashed ${hover ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 0, 0, 0.04)'}`,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hover
          ? '0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.1)'
          : '0 4px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        animation: 'fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        animationDelay: `${animationDelay}s`,
        opacity: 0,
      }}
    >
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
            flexShrink: 0,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: hover
              ? '0 8px 16px rgba(59, 130, 246, 0.2)'
              : '0 2px 4px rgba(0, 0, 0, 0.04)',
            transform: hover ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <Plus size={24} color={hover ? '#fff' : '#999'} strokeWidth={2.5} />
        </div>

        {/* 文字 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#2d2d2d',
              marginBottom: '6px',
              lineHeight: 1.3,
            }}
          >
            创建新简历
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: '#666',
              lineHeight: 1.4,
            }}
          >
            从空白模板开始
          </p>
        </div>
      </div>

      {/* 底部装饰 */}
      <div
        style={{
          paddingTop: '16px',
          borderTop: hover ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid transparent',
          transition: 'all 0.3s',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: hover ? '#2d2d2d' : '#999',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.3s',
          }}
        >
          <Plus size={14} />
          <span>点击创建</span>
        </div>
      </div>
    </div>
  )
}

// 欢迎引导Modal - 首次访问显示
const WelcomeGuideModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={onClose}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
        }}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#f0f0f0',
            color: '#666',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#2d2d2d'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#f0f0f0'
            e.currentTarget.style.color = '#666'
          }}
        >
          <X size={20} />
        </button>

        {/* 图标 */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 12px 24px rgba(45, 45, 45, 0.3)',
          }}
        >
          <Rocket size={40} color="#fff" />
        </div>

        {/* 标题 */}
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#2d2d2d',
            textAlign: 'center',
            marginBottom: '16px',
            lineHeight: 1.2,
          }}
        >
          欢迎来到 Career Kit
        </h2>

        {/* 描述 */}
        <p
          style={{
            fontSize: '16px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '32px',
            lineHeight: 1.6,
          }}
        >
          这是一个强大的简历编辑工具，帮助你轻松创建专业的简历。让我们开始吧！
        </p>

        {/* 功能亮点 */}
        <div style={{ marginBottom: '32px' }}>
          {[
            { icon: Sparkles, title: '精选模板', desc: '多种专业模板，快速开始' },
            { icon: Zap, title: '实时预览', desc: '所见即所得的编辑体验' },
            { icon: TrendingUp, title: '本地存储', desc: '数据安全，支持加密保护' },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: '#f8f9fa',
                marginBottom: index < 2 ? '12px' : '0',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#2d2d2d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <feature.icon size={20} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#2d2d2d',
                    marginBottom: '4px',
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 开始按钮 */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '16px 32px',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: '#2d2d2d',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 16px rgba(45, 45, 45, 0.2)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#1a1a1a'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(45, 45, 45, 0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#2d2d2d'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(45, 45, 45, 0.2)'
          }}
        >
          开始使用
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}

// 加载骨架屏 - 优化版，更精致
const LoadingGrid: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}
    >
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div
          key={i}
          className="animate-item"
          style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.04)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}
          >
            {/* 图标骨架 */}
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#f8f9fa',
                flexShrink: 0,
                animation: 'pulse 1.8s ease-in-out infinite',
              }}
            />
            {/* 内容骨架 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: '85%',
                  height: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  animation: 'pulse 1.8s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: '65%',
                  height: '13px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  animation: 'pulse 1.8s ease-in-out infinite',
                  animationDelay: '0.2s',
                }}
              />
            </div>
          </div>

          {/* 底部按钮骨架 */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              paddingTop: '16px',
              borderTop: '1px solid #f0f0f0',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '32px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                animation: 'pulse 1.8s ease-in-out infinite',
                animationDelay: '0.1s',
              }}
            />
            <div
              style={{
                flex: 1,
                height: '32px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                animation: 'pulse 1.8s ease-in-out infinite',
                animationDelay: '0.3s',
              }}
            />
          </div>
        </div>
      ))}
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
  animationDelay?: number
}> = ({ title, description, category, onUse, onPreview, animationDelay = 0 }) => {
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
        animation: 'fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        animationDelay: `${animationDelay}s`,
        opacity: 0,
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
  onDuplicate: () => void
  onToggleFavorite: () => void
  isFavorite: boolean
  formatDate: (date: string) => string
  animationDelay?: number
}> = ({
  resume,
  onEdit,
  onDelete,
  onEditInfo,
  onDuplicate,
  onToggleFavorite,
  isFavorite,
  formatDate,
  animationDelay = 0,
}) => {
  const [hover, setHover] = React.useState(false)
  const [showActions, setShowActions] = React.useState(false)

  return (
    <div
      onMouseEnter={() => {
        setHover(true)
        setShowActions(true)
      }}
      onMouseLeave={() => {
        setHover(false)
        setShowActions(false)
      }}
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
        animation: 'fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        animationDelay: `${animationDelay}s`,
        opacity: 0,
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

      {/* 快捷操作按钮组 - hover时显示在右上角 */}
      {showActions && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            gap: '6px',
            zIndex: 10,
            animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* 收藏按钮 */}
          <button
            onClick={e => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#fff',
              color: isFavorite ? '#f59e0b' : '#999',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = isFavorite ? '#fef3c7' : '#f9fafb'
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = isFavorite
                ? '0 6px 12px rgba(245, 158, 11, 0.3)'
                : '0 6px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow =
                '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
            }}
            title={isFavorite ? '取消收藏' : '添加收藏'}
          >
            <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* 复制按钮 */}
          <button
            onClick={e => {
              e.stopPropagation()
              onDuplicate()
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#fff',
              color: '#3b82f6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#dbeafe'
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(59, 130, 246, 0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow =
                '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
            }}
            title="复制简历"
          >
            <Copy size={16} />
          </button>

          {/* 删除按钮 */}
          <button
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
            style={{
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
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#fee2e2'
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(220, 38, 38, 0.3)'
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
        </div>
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
