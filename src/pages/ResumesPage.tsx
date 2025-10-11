/**
 * 简历库页面 - 显示所有已保存的简历
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Trash2, Edit, Calendar } from 'lucide-react'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { notification } from '@/utils/notification'

interface SavedResume {
  id: string
  name: string
  description: string
  schema: any
  createdAt: string
  updatedAt: string
}

export const ResumesPage: React.FC = () => {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState<SavedResume[]>([])

  useEffect(() => {
    loadResumes()

    // 监听简历更新事件
    const handleResumeUpdate = () => {
      loadResumes()
    }
    window.addEventListener('cvkit-resume-updated', handleResumeUpdate)

    return () => {
      window.removeEventListener('cvkit-resume-updated', handleResumeUpdate)
    }
  }, [])

  const loadResumes = async () => {
    try {
      const allKeys = await indexedDBService.getAllKeys(STORES.RESUMES)
      const loadedResumes: SavedResume[] = []

      for (const key of allKeys) {
        const resume = await indexedDBService.getItem<SavedResume>(STORES.RESUMES, String(key))
        if (resume) {
          loadedResumes.push(resume)
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
      await indexedDBService.removeItem(STORES.RESUMES, resume.id)
      notification.success('简历已删除')
      loadResumes()
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
          <svg width="40" height="40" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2d2d2d" />
            <path d="M12 10h16v2H12zm0 6h16v2H12zm0 6h12v2H12z" fill="white" />
          </svg>
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const ResumeCard: React.FC<{
  resume: SavedResume
  onEdit: () => void
  onDelete: (e: React.MouseEvent) => void
}> = ({ resume, onEdit, onDelete }) => {
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
        }}
      >
        <FileText size={56} style={{ color: '#ccc' }} />
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
