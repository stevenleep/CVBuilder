/**
 * 简历库页面 - 显示所有已保存的简历
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Trash2, Edit, Calendar, Settings } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { encryptedStorageService } from '@/core/services/EncryptedStorageService'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { notification } from '@/utils/notification'
import { SaveResumeFullscreenModal } from '@/editor/SaveResumeFullscreenModal'
import { useEncryption } from '@/core/context/EncryptionContext'

interface SavedResume {
  id: string
  name: string
  description: string
  tags: string[]
  schema: any
  createdAt: string
  updatedAt: string
  thumbnail?: string // 新增：缩略图
}

export const ResumesPage: React.FC = () => {
  const navigate = useNavigate()
  const { isEnabled, isUnlocked } = useEncryption()
  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingResume, setEditingResume] = useState<SavedResume | null>(null)

  useEffect(() => {
    // 如果启用了加密但未解锁，不加载数据（等待解锁）
    if (isEnabled && !isUnlocked) {
      return
    }

    loadResumes()

    // 监听简历更新事件
    const handleResumeUpdate = () => {
      loadResumes()
    }
    window.addEventListener('cvkit-resume-updated', handleResumeUpdate)

    return () => {
      window.removeEventListener('cvkit-resume-updated', handleResumeUpdate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, isUnlocked])

  const loadResumes = async () => {
    try {
      const allKeys = await encryptedStorageService.getAllKeys(STORES.RESUMES)
      const loadedResumes: SavedResume[] = []

      for (const key of allKeys) {
        const resume = await encryptedStorageService.getItem<SavedResume>(
          STORES.RESUMES,
          String(key)
        )
        if (resume) {
          // 尝试加载缩略图（缩略图不加密）
          const thumbnail = await indexedDBService.getItem<string>(
            STORES.THUMBNAILS,
            `resume-${String(key)}`
          )
          loadedResumes.push({
            ...resume,
            thumbnail: thumbnail || undefined,
          })
        }
      }

      // 按更新时间排序
      loadedResumes.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      setResumes(loadedResumes)
    } catch (error) {
      console.error('Failed to load resumes:', error)
    }
  }

  const handleEdit = (resume: SavedResume) => {
    // 跳转到编辑器，URL带上简历ID
    navigate(`/editor/${resume.id}`)
  }

  const handleDelete = async (resume: SavedResume, e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmed = await notification.confirm({
      title: '确认删除',
      message: `确定删除简历"${resume.name}"吗？`,
      type: 'warning',
    })
    if (confirmed) {
      try {
        console.log('[ResumesPage] 开始删除简历:', resume.id)
        
        // 如果这个简历正在编辑器中打开，通知编辑器清除ID
        const { currentResumeId, setCurrentResumeId } = await import('@/store/editorStore').then(m => m.useEditorStore.getState())
        if (currentResumeId === resume.id) {
          console.log('[ResumesPage] 清除编辑器中的 currentResumeId')
          setCurrentResumeId(null)
        }
        
        // 先从本地状态中移除（乐观更新）
        setResumes(prev => prev.filter(r => r.id !== resume.id))
        
        // 然后删除数据库中的数据
        await encryptedStorageService.removeItem(STORES.RESUMES, resume.id)
        console.log('[ResumesPage] 已从数据库删除:', resume.id)
        
        // 删除对应的缩略图（如果存在）
        try {
          await indexedDBService.removeItem(STORES.THUMBNAILS, `resume-${resume.id}`)
          console.log('[ResumesPage] 已删除缩略图')
        } catch (e) {
          // 缩略图可能不存在，忽略错误
          console.log('[ResumesPage] 缩略图不存在，跳过')
        }
        
        // 验证删除是否成功
        await new Promise(resolve => setTimeout(resolve, 100))
        const checkDeleted = await encryptedStorageService.getItem(STORES.RESUMES, resume.id)
        if (checkDeleted) {
          console.error('[ResumesPage] 警告：删除后数据仍然存在!', checkDeleted)
          notification.error('删除可能失败，请刷新页面确认')
          await loadResumes()
        } else {
          console.log('[ResumesPage] 验证成功：数据已被删除')
          notification.success('简历已删除')
          // 触发简历列表更新事件
          window.dispatchEvent(new CustomEvent('cvkit-resume-deleted', { detail: { resumeId: resume.id } }))
        }
      } catch (error) {
        notification.error('删除失败')
        console.error('Delete resume error:', error)
        // 如果删除失败，重新加载以恢复状态
        await loadResumes()
      }
    }
  }

  const handleEditInfo = (e: React.MouseEvent, resume: SavedResume) => {
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
      setResumes(resumes.map(r => (r.id === editingResume.id ? updatedResume : r)))

      notification.success('简历信息已更新')
      setShowEditModal(false)
      setEditingResume(null)
    } catch (error) {
      notification.error('更新失败')
      console.error('Update error:', error)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
      }}
    >
      {/* 顶部导航 */}
      <div
        style={{
          height: '64px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Logo size={40} />
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d2d2d' }}>我的简历</div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>CVKit</div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            color: '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f8f9fa'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <ArrowLeft
            size={18}
            style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}
          />
          返回首页
        </button>
      </div>

      {/* 主体内容 */}
      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {resumes.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 40px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '2px dashed #d0d0d0',
            }}
          >
            <FileText size={48} style={{ color: '#ccc', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
              还没有保存的简历
            </h3>
            <p style={{ fontSize: '14px', color: '#999', marginBottom: '24px' }}>
              在编辑器中保存简历后，会显示在这里
            </p>
            <button
              onClick={() => navigate('/editor')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#2d2d2d',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              创建新简历
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {resumes.map(resume => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onEdit={() => handleEdit(resume)}
                onDelete={e => handleDelete(resume, e)}
                onEditInfo={e => handleEditInfo(e, resume)}
              />
            ))}
          </div>
        )}
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

const ResumeCard: React.FC<{
  resume: SavedResume
  onEdit: () => void
  onDelete: (e: React.MouseEvent) => void
  onEditInfo: (e: React.MouseEvent) => void
}> = ({ resume, onEdit, onDelete, onEditInfo }) => {
  const [hover, setHover] = React.useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: `1px solid ${hover ? '#d0d0d0' : '#e8e8e8'}`,
        overflow: 'hidden',
        transition: 'all 0.2s',
        cursor: 'pointer',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? '0 12px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
      onClick={onEdit}
    >
      {/* 预览区域 */}
      <div
        style={{
          height: '220px',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #e8e8e8',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {resume.thumbnail ? (
          <img
            src={resume.thumbnail}
            alt={resume.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FileText size={48} style={{ color: '#ccc' }} />
            <span style={{ fontSize: '11px', color: '#999' }}>暂无预览</span>
          </div>
        )}
      </div>

      {/* 信息区域 */}
      <div style={{ padding: '20px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#2d2d2d',
            marginBottom: '6px',
          }}
        >
          {resume.name}
        </h3>
        <p
          style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '12px',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {resume.description || '暂无描述'}
        </p>

        {/* 标签显示 */}
        {resume.tags && resume.tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            {resume.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  backgroundColor: '#f0f0f0',
                  color: '#666',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                }}
              >
                {tag}
              </span>
            ))}
            {resume.tags.length > 3 && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  backgroundColor: '#f8f9fa',
                  color: '#999',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                }}
              >
                +{resume.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 时间信息 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#999',
            marginBottom: '16px',
          }}
        >
          <Calendar size={14} />
          <span>{formatDate(resume.updatedAt)}</span>
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={e => {
              e.stopPropagation()
              onEdit()
            }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: hover ? '#2d2d2d' : '#f8f9fa',
              color: hover ? 'white' : '#2d2d2d',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s',
            }}
          >
            <Edit size={16} />
            <span>编辑</span>
          </button>
          <button
            onClick={onEditInfo}
            style={{
              width: '44px',
              height: '40px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
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
            <Settings size={16} />
          </button>
          <button
            onClick={onDelete}
            style={{
              width: '44px',
              height: '40px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#fef2f2'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
