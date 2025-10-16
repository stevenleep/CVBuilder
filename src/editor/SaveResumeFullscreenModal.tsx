/**
 * 全屏保存简历Modal - 包含标签功能
 */

import React, { useState } from 'react'
import { X, Save, Plus, Hash } from 'lucide-react'

interface SaveResumeFullscreenModalProps {
  onSave: (name: string, description: string, tags: string[]) => void
  onClose: () => void
  initialName?: string
  initialDescription?: string
  initialTags?: string[]
}

export const SaveResumeFullscreenModal: React.FC<SaveResumeFullscreenModalProps> = ({
  onSave,
  onClose,
  initialName = '',
  initialDescription = '',
  initialTags = [],
}) => {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [newTag, setNewTag] = useState('')

  // 预设标签选项
  const presetTags = [
    '前端开发',
    '后端开发',
    '全栈开发',
    '移动开发',
    'UI/UX设计',
    '产品经理',
    '数据分析',
    '运营',
    '销售',
    '市场',
    '技术总监',
    '架构师',
    '算法工程师',
    '测试工程师',
    'DevOps',
    '实习',
    '应届生',
    '1-3年',
    '3-5年',
    '5年以上',
    '互联网',
    '金融',
    '教育',
    '医疗',
    '电商',
    '创业公司',
    '大厂',
    '外企',
    '国企',
    '事业单位',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave(name.trim(), description.trim(), tags)
    }
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()])
    }
    setNewTag('')
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const addPresetTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        backdropFilter: 'blur(8px)',
        padding: '20px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '80vh',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalSlideIn 0.3s ease-out',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 头部 */}
        <div
          style={{
            padding: '24px 32px 20px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '8px',
              }}
            >
              保存简历
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: '#666',
                margin: 0,
              }}
            >
              为您的简历添加标题、描述和标签，方便管理和查找
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: '#f8f9fa',
              color: '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#e9ecef'
              e.currentTarget.style.color = '#333'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#f8f9fa'
              e.currentTarget.style.color = '#666'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容区域 */}
        <div style={{ padding: '24px 32px', flex: 1, overflowY: 'auto' }}>
          <form onSubmit={handleSubmit}>
            {/* 简历标题 */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px',
                }}
              >
                简历标题 *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例如：张三 - 前端开发工程师"
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  border: '2px solid #e8e8e8',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: '#fff',
                  color: '#1a1a1a',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#2d2d2d'
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(45,45,45,0.1)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e8e8e8'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* 简历描述 */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px',
                }}
              >
                简历描述
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="简单描述这份简历的用途和特点..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  border: '2px solid #e8e8e8',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  backgroundColor: '#fff',
                  color: '#1a1a1a',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  lineHeight: 1.5,
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#2d2d2d'
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(45,45,45,0.1)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e8e8e8'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* 标签管理 */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '12px',
                }}
              >
                标签
              </label>

              {/* 已选择的标签 */}
              {tags.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          backgroundColor: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          borderRadius: '20px',
                          fontSize: '14px',
                          color: '#0369a1',
                        }}
                      >
                        <Hash size={12} />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          style={{
                            width: '16px',
                            height: '16px',
                            border: 'none',
                            borderRadius: '50%',
                            backgroundColor: '#0369a1',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#0c4a6e'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = '#0369a1'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 添加新标签 */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="输入自定义标签..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '2px solid #e8e8e8',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fff',
                    color: '#1a1a1a',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#2d2d2d'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(45,45,45,0.1)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#e8e8e8'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag(newTag)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addTag(newTag)}
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#2d2d2d',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                  添加
                </button>
              </div>

              {/* 预设标签 */}
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '12px',
                  }}
                >
                  常用标签
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  {presetTags.map((tag, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addPresetTag(tag)}
                      disabled={tags.includes(tag)}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '20px',
                        backgroundColor: tags.includes(tag) ? '#f0f9ff' : '#fff',
                        color: tags.includes(tag) ? '#0369a1' : '#666',
                        fontSize: '14px',
                        cursor: tags.includes(tag) ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: tags.includes(tag) ? 0.6 : 1,
                      }}
                      onMouseEnter={e => {
                        if (!tags.includes(tag)) {
                          e.currentTarget.style.backgroundColor = '#f8f9fa'
                          e.currentTarget.style.borderColor = '#d0d0d0'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!tags.includes(tag)) {
                          e.currentTarget.style.backgroundColor = '#fff'
                          e.currentTarget.style.borderColor = '#e8e8e8'
                        }
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 提示信息 */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #f0f0f0',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                💡 <strong>提示：</strong>标签可以帮助您快速分类和查找简历，建议添加3-5个相关标签
              </div>
            </div>
          </form>
        </div>

        {/* 底部按钮 */}
        <div
          style={{
            padding: '20px 32px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '12px 24px',
              border: '2px solid #e8e8e8',
              borderRadius: '8px',
              backgroundColor: '#fff',
              color: '#666',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#d0d0d0'
              e.currentTarget.style.color = '#333'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#e8e8e8'
              e.currentTarget.style.color = '#666'
            }}
          >
            取消
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: name.trim() ? '#2d2d2d' : '#e8e8e8',
              color: name.trim() ? 'white' : '#999',
              fontSize: '14px',
              fontWeight: '600',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (name.trim()) {
                e.currentTarget.style.backgroundColor = '#1a1a1a'
              }
            }}
            onMouseLeave={e => {
              if (name.trim()) {
                e.currentTarget.style.backgroundColor = '#2d2d2d'
              }
            }}
          >
            <Save size={18} />
            保存简历
          </button>
        </div>
      </div>

      {/* CSS动画 */}
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
