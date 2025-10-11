/**
 * 工作台首页
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Clock, Folder, ArrowRight, Sparkles } from 'lucide-react'
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

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [recentResumes, setRecentResumes] = useState<RecentResume[]>([])
  const [templates, setTemplates] = useState<unknown[]>([])
  const [showExamples, setShowExamples] = useState(false)

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
        const resume = await indexedDBService.getItem<RecentResume>(STORES.RESUMES, String(key))
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
            icon={<Sparkles size={24} />}
            title="使用示例"
            description={`${exampleResumes.length} 个精选示例`}
            onClick={() => setShowExamples(true)}
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

        {/* 示例简历对话框 */}
        {showExamples && (
          <ExampleDialog
            examples={exampleResumes}
            onSelect={handleUseExample}
            onPreview={exampleId => {
              setShowExamples(false)
              navigate(`/examples/${exampleId}/preview`)
            }}
            onClose={() => setShowExamples(false)}
          />
        )}

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

const ExampleDialog: React.FC<{
  examples: typeof exampleResumes
  onSelect: (id: string) => void
  onPreview: (id: string) => void
  onClose: () => void
}> = ({ examples, onSelect, onPreview, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100001,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#2d2d2d',
          borderRadius: '12px',
          padding: '28px 32px',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '85vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          border: '1px solid #4a4a4a',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Sparkles size={26} />
          选择示例开始
        </h2>
        <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '28px' }}>
          选择一个示例简历，快速开始编辑你的专属简历
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {examples.map(example => (
            <ExampleCard
              key={example.id}
              example={example}
              onSelect={() => onSelect(example.id)}
              onPreview={() => onPreview(example.id)}
            />
          ))}
        </div>

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              border: '1px solid #555',
              borderRadius: '6px',
              backgroundColor: '#3a3a3a',
              color: '#ccc',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#4a4a4a'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#3a3a3a'
            }}
          >
            关闭
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}

const ExampleCard: React.FC<{
  example: (typeof exampleResumes)[0]
  onSelect: () => void
  onPreview: () => void
}> = ({ example, onSelect, onPreview }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '20px',
        border: '2px solid #555',
        borderRadius: '10px',
        backgroundColor: hover ? '#3a3a3a' : '#1a1a1a',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        boxShadow: hover
          ? '0 8px 24px rgba(255, 255, 255, 0.1), 0 0 0 2px rgba(255, 255, 255, 0.2)'
          : '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      {/* 分类标签 */}
      <div
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '6px',
          backgroundColor: hover ? '#fff' : '#555',
          color: hover ? '#2d2d2d' : 'white',
          fontSize: '11px',
          fontWeight: '600',
          marginBottom: '14px',
          transition: 'all 0.2s ease',
        }}
      >
        {example.category}
      </div>

      {/* 标题 */}
      <div
        style={{
          fontSize: '17px',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '10px',
        }}
      >
        {example.name}
      </div>

      {/* 描述 */}
      <div
        style={{
          fontSize: '13px',
          color: '#aaa',
          lineHeight: '1.6',
          marginBottom: '14px',
        }}
      >
        {example.description}
      </div>

      {/* 标签 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {example.tags.map(tag => (
          <span
            key={tag}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              backgroundColor: hover ? 'rgba(255, 255, 255, 0.15)' : '#333',
              color: hover ? '#fff' : '#888',
              fontSize: '11px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 操作按钮 - 固定高度避免抖动 */}
      <div
        style={{
          height: '44px',
          display: 'flex',
          gap: '8px',
          marginTop: '2px',
        }}
      >
        <button
          onClick={e => {
            e.stopPropagation()
            onPreview()
          }}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #555',
            borderRadius: '6px',
            backgroundColor: hover ? '#3a3a3a' : 'transparent',
            color: '#ccc',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          预览
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            onSelect()
          }}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: hover ? '#fff' : '#555',
            color: hover ? '#2d2d2d' : '#aaa',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          使用
        </button>
      </div>
    </div>
  )
}
