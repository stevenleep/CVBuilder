/**
 * 富文本编辑器组件
 *
 * 轻量级的富文本编辑器，支持基本格式化
 */

import React, { useRef, useEffect, useState } from 'react'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Tag } from 'lucide-react'
import { notification } from '@/utils/notification'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '输入内容...',
  minHeight = 100,
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const isInternalChange = useRef(false)

  // 初始化内容 - 改进版本，避免不必要的重新渲染
  useEffect(() => {
    if (!editorRef.current || isInternalChange.current) {
      isInternalChange.current = false
      return
    }

    // 规范化比较：去除空白和空标签
    const normalizeHtml = (html: string) => {
      return html
        .replace(/<p><br><\/p>/g, '')
        .replace(/<br>/g, '')
        .replace(/<[^>]+><\/[^>]+>/g, '') // 移除空标签
        .replace(/\s+/g, ' ')
        .trim()
    }

    const currentContent = normalizeHtml(editorRef.current.innerHTML)
    const newContent = normalizeHtml(value)

    // 只有当内容真正不同时才更新
    if (currentContent !== newContent) {
      // 保存当前光标位置
      const selection = window.getSelection()
      let cursorPosition = 0
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        cursorPosition = range.startOffset
      }

      editorRef.current.innerHTML = value || ''

      // 恢复光标位置
      if (value && editorRef.current.firstChild) {
        try {
          const range = document.createRange()
          const sel = window.getSelection()
          const textNode = editorRef.current.firstChild
          const maxOffset = textNode.textContent?.length || 0
          range.setStart(textNode, Math.min(cursorPosition, maxOffset))
          range.collapse(true)
          sel?.removeAllRanges()
          sel?.addRange(range)
        } catch (e) {
          // 光标恢复失败时忽略错误
        }
      }
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true

      // 清理空的列表标签
      let content = editorRef.current.innerHTML

      // 检查是否只剩下空标签
      const textContent = editorRef.current.textContent?.trim() || ''
      if (!textContent) {
        // 如果没有实际内容，清空所有 HTML
        content = ''
        editorRef.current.innerHTML = ''
      } else {
        // 移除空的 ul/ol 标签
        content = content.replace(/<ul>\s*<\/ul>/g, '')
        content = content.replace(/<ol>\s*<\/ol>/g, '')
        content = content.replace(/<ul><br><\/ul>/g, '')
        content = content.replace(/<ol><br><\/ol>/g, '')
      }

      onChange(content)
    }
  }

  const insertUnorderedList = (e: React.MouseEvent) => {
    e.preventDefault()
    document.execCommand('insertUnorderedList', false)
    handleInput()
  }

  const insertOrderedList = (e: React.MouseEvent) => {
    e.preventDefault()
    document.execCommand('insertOrderedList', false)
    handleInput()
  }

  const toggleBold = (e: React.MouseEvent) => {
    e.preventDefault()
    document.execCommand('bold', false)
    handleInput()
  }

  const toggleItalic = (e: React.MouseEvent) => {
    e.preventDefault()
    document.execCommand('italic', false)
    handleInput()
  }

  const insertLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    const url = await notification.prompt({
      title: '插入链接',
      message: '请输入链接地址',
      placeholder: 'https://example.com',
    })
    if (url) {
      document.execCommand('createLink', false, url)
      handleInput()
    }
  }

  const insertBadge = (e: React.MouseEvent) => {
    e.preventDefault()
    const selection = window.getSelection()
    if (selection && selection.toString()) {
      const text = selection.toString()
      const badge = `<span class="badge">${text}</span>`
      document.execCommand('insertHTML', false, badge)
      handleInput()
    } else {
      notification.warning('请先选中文字')
    }
  }

  return (
    <div
      style={{
        border: `1px solid ${isFocused ? '#e0e0e0' : '#f1f1f1'}`,
        borderRadius: '4px',
        backgroundColor: isFocused ? '#fff' : '#fafafa',
        transition: 'all 0.1s',
      }}
    >
      {/* 工具栏 - 始终显示 */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          padding: '4px',
          borderBottom: '1px solid #f1f1f1',
          backgroundColor: '#fafafa',
        }}
      >
        <EditorButton icon={<Bold size={14} />} tooltip="加粗 (Ctrl+B)" onClick={toggleBold} />
        <EditorButton icon={<Italic size={14} />} tooltip="斜体 (Ctrl+I)" onClick={toggleItalic} />

        <div
          style={{ width: '1px', height: '20px', backgroundColor: '#f1f1f1', margin: '0 4px' }}
        />

        <EditorButton icon={<List size={14} />} tooltip="无序列表" onClick={insertUnorderedList} />
        <EditorButton
          icon={<ListOrdered size={14} />}
          tooltip="有序列表"
          onClick={insertOrderedList}
        />

        <div
          style={{ width: '1px', height: '20px', backgroundColor: '#f1f1f1', margin: '0 4px' }}
        />

        <EditorButton icon={<Tag size={14} />} tooltip="标签样式" onClick={insertBadge} />

        <EditorButton
          icon={<LinkIcon size={14} />}
          tooltip="插入链接 (Ctrl+K)"
          onClick={insertLink}
        />
      </div>

      {/* 编辑区 */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          padding: '8px 10px',
          minHeight: `${minHeight}px`,
          fontSize: '12px',
          lineHeight: '1.5',
          color: '#000',
          outline: 'none',
          cursor: 'text',
        }}
        data-placeholder={placeholder}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #999;
        }
        
        [contenteditable]:focus {
          outline: none;
        }
        
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 6px 0;
          padding-left: 20px;
          list-style-position: outside;
        }
        
        [contenteditable] ul {
          list-style-type: disc;
        }
        
        [contenteditable] ol {
          list-style-type: decimal;
        }
        
        [contenteditable] li {
          margin: 2px 0;
          padding-left: 4px;
        }
        
        [contenteditable] a {
          color: inherit;
          text-decoration: underline;
        }
        
        [contenteditable] strong,
        [contenteditable] b {
          font-weight: 600;
        }
        
        [contenteditable] em,
        [contenteditable] i {
          font-style: italic;
        }
        
        [contenteditable] p {
          margin: 0;
        }
        
        [contenteditable] br {
          display: block;
          content: "";
          margin: 4px 0;
        }
        
        [contenteditable] .badge {
          display: inline-block;
          padding: 2px 8px;
          background-color: #fafafa;
          border-radius: 4px;
          font-size: 0.9em;
          font-weight: 500;
          border: 1px solid #e8e8e8;
        }
      `}</style>
    </div>
  )
}

const EditorButton: React.FC<{
  icon: React.ReactNode
  tooltip: string
  onClick: (e: React.MouseEvent) => void
}> = ({ icon, tooltip, onClick }) => {
  const [hover, setHover] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={e => e.preventDefault()} // 防止失去焦点
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={tooltip}
      style={{
        width: '24px',
        height: '24px',
        border: 'none',
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: hover ? '#fff' : 'transparent',
        color: '#666',
        transition: 'all 0.1s',
      }}
    >
      {icon}
    </button>
  )
}
