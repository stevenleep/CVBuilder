/**
 * 工作台首页
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Clock, Folder, ArrowRight } from 'lucide-react'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { resumeTemplateManager } from '@/core/services/ResumeTemplateManager'

interface RecentResume {
  id: string
  name: string
  description: string
  updatedAt: string
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [recentResumes, setRecentResumes] = useState<RecentResume[]>([])
  const [templates, setTemplates] = useState<any[]>([])

  useEffect(() => {
    loadRecentResumes()
    loadTemplates()

    // 监听简历更新事件
    const handleResumeUpdate = () => {
      loadRecentResumes()
    }
    window.addEventListener('cvkit-resume-updated', handleResumeUpdate)

    return () => {
      window.removeEventListener('cvkit-resume-updated', handleResumeUpdate)
    }
  }, [])

  const loadRecentResumes = async () => {
    try {
      const allKeys = await indexedDBService.getAllKeys(STORES.RESUMES)
      const loaded: RecentResume[] = []

      for (const key of allKeys) {
        const resume = await indexedDBService.getItem<any>(STORES.RESUMES, String(key))
        if (resume) {
          loaded.push(resume)
        }
      }

      // 按更新时间排序，只取最近3个
      loaded.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      setRecentResumes(loaded.slice(0, 3))
    } catch (error) {
      console.error('Failed to load resumes:', error)
    }
  }

  const loadTemplates = () => {
    const allTemplates = resumeTemplateManager.getAllTemplates()
    setTemplates(allTemplates.slice(0, 4))
  }

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
          padding: '0 32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#2d2d2d" />
            <path d="M12 10h16v2H12zm0 6h16v2H12zm0 6h12v2H12z" fill="white" />
          </svg>
          <div
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#2d2d2d',
              letterSpacing: '0.3px',
            }}
          >
            CVKit
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* 欢迎区 */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{ fontSize: '28px', fontWeight: '800', color: '#2d2d2d', marginBottom: '8px' }}
          >
            工作台
          </h1>
          <p style={{ fontSize: '14px', color: '#666' }}>快速开始创建或继续编辑您的简历</p>
        </div>

        {/* 快速操作 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <QuickAction
            icon={<Plus size={24} />}
            title="创建新简历"
            description="从空白开始"
            onClick={() => navigate('/editor')}
            primary
          />
          <QuickAction
            icon={<Folder size={24} />}
            title="模板库"
            description={`${templates.length} 个模板`}
            onClick={() => navigate('/templates')}
          />
          <QuickAction
            icon={<FileText size={24} />}
            title="我的简历"
            description={`${recentResumes.length} 份简历`}
            onClick={() => navigate('/resumes')}
          />
        </div>

        {/* 最近编辑 */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: '#666' }} />
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#2d2d2d' }}>最近编辑</h2>
            </div>
            {recentResumes.length > 0 && (
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
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                查看全部 →
              </button>
            )}
          </div>

          {recentResumes.length === 0 ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e8e8e8',
              }}
            >
              <FileText size={40} style={{ color: '#ccc', marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: '#999', marginBottom: '16px' }}>还没有简历</p>
              <button
                onClick={() => navigate('/editor')}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#2d2d2d',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                创建第一份简历
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentResumes.map(resume => (
                <ResumeItem
                  key={resume.id}
                  name={resume.name}
                  description={resume.description}
                  time={formatDate(resume.updatedAt)}
                  onClick={() => {
                    // 跳转到编辑器，URL带上简历ID
                    navigate(`/editor/${resume.id}`)
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const QuickAction: React.FC<{
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  primary?: boolean
}> = ({ icon, title, description, onClick, primary = false }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '20px',
        border: `1px solid ${hover ? (primary ? '#2d2d2d' : '#d0d0d0') : '#e8e8e8'}`,
        borderRadius: '10px',
        backgroundColor: primary ? (hover ? '#2d2d2d' : '#2d2d2d') : hover ? '#fafafa' : '#fff',
        color: primary ? 'white' : '#2d2d2d',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: hover ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          backgroundColor: primary ? 'rgba(255,255,255,0.15)' : '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: primary ? 'white' : '#666',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '700',
            marginBottom: '4px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: primary ? 'rgba(255,255,255,0.7)' : '#999',
          }}
        >
          {description}
        </div>
      </div>
      <ArrowRight size={20} style={{ opacity: hover ? 1 : 0, transition: 'opacity 0.2s' }} />
    </button>
  )
}

const ResumeItem: React.FC<{
  name: string
  description: string
  time: string
  onClick: () => void
}> = ({ name, description, time, onClick }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '16px 20px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: hover ? '#f8f9fa' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.15s',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '6px',
          backgroundColor: hover ? '#2d2d2d' : '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: hover ? 'white' : '#666',
          flexShrink: 0,
          transition: 'all 0.15s',
        }}
      >
        <FileText size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#2d2d2d', marginBottom: '4px' }}>
          {name}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#999',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {description || '暂无描述'}
        </div>
      </div>
      <div
        style={{
          fontSize: '12px',
          color: '#999',
          flexShrink: 0,
        }}
      >
        {time}
      </div>
      <ArrowRight
        size={18}
        style={{ color: '#ccc', opacity: hover ? 1 : 0, transition: 'opacity 0.2s' }}
      />
    </button>
  )
}
