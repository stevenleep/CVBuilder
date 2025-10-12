/**
 * Quill 富文本编辑器组件
 *
 * 专业的富文本编辑体验，支持丰富的格式化选项
 */

import React, { useMemo, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
  simple?: boolean // 简化工具栏
}

export const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = '输入内容...',
  minHeight = 100,
  simple = false,
}) => {
  const quillRef = useRef<ReactQuill>(null)

  // 工具栏配置
  const modules = useMemo(
    () => ({
      toolbar: simple
        ? [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']]
        : [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['link'],
            [{ color: [] }, { background: [] }],
            ['clean'],
          ],
    }),
    [simple]
  )

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'link',
    'color',
    'background',
  ]

  return (
    <div
      className="quill-wrapper"
      style={{
        border: '1px solid #e8e8e8',
        borderRadius: '6px',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        theme="snow"
        style={{
          minHeight: `${minHeight}px`,
        }}
      />

      <style>
        {`
          /* 工具栏样式 */
          .quill-wrapper .ql-toolbar {
            border: none !important;
            border-bottom: 1px solid #e8e8e8 !important;
            background-color: #fafafa !important;
            padding: 8px !important;
          }

          .quill-wrapper .ql-container {
            border: none !important;
            font-size: 13px !important;
            font-family: inherit !important;
          }

          /* 编辑区样式 - 和实际渲染保持一致 */
          .quill-wrapper .ql-editor {
            min-height: ${minHeight}px !important;
            padding: 12px !important;
            color: #2d2d2d !important;
            line-height: 1.6 !important;
            font-size: 13px !important;
          }

          .quill-wrapper .ql-editor.ql-blank::before {
            color: #999 !important;
            font-style: normal !important;
            font-size: 13px !important;
          }

          /* 工具栏按钮 */
          .quill-wrapper .ql-stroke {
            stroke: #666;
          }

          .quill-wrapper .ql-fill {
            fill: #666;
          }

          .quill-wrapper .ql-picker-label {
            color: #666;
          }

          .quill-wrapper .ql-toolbar button:hover .ql-stroke,
          .quill-wrapper .ql-toolbar button:focus .ql-stroke {
            stroke: #2d2d2d;
          }

          .quill-wrapper .ql-toolbar button:hover .ql-fill,
          .quill-wrapper .ql-toolbar button:focus .ql-fill {
            fill: #2d2d2d;
          }

          .quill-wrapper .ql-toolbar button.ql-active {
            background-color: #fff !important;
          }

          .quill-wrapper .ql-toolbar button.ql-active .ql-stroke {
            stroke: #2d2d2d !important;
          }

          .quill-wrapper .ql-toolbar button.ql-active .ql-fill {
            fill: #2d2d2d !important;
          }

          /* ========== 关键：列表样式完全覆盖 Quill 默认样式 ========== */
          .quill-wrapper .ql-editor ul,
          .quill-wrapper .ql-editor ol {
            margin: 4px 0 !important;
            padding: 0 0 0 20px !important;
            list-style-position: outside !important;
          }

          .quill-wrapper .ql-editor ul {
            list-style-type: disc !important;
          }

          .quill-wrapper .ql-editor ol {
            list-style-type: decimal !important;
          }

          .quill-wrapper .ql-editor li {
            margin: 2px 0 !important;
            padding: 0 0 0 4px !important;
            list-style: inherit !important;
          }

          .quill-wrapper .ql-editor li::marker {
            color: inherit !important;
          }

          /* Quill 的缩进类 */
          .quill-wrapper .ql-editor .ql-indent-1,
          .quill-wrapper .ql-editor li.ql-indent-1 {
            padding-left: 3em !important;
          }

          .quill-wrapper .ql-editor .ql-indent-2,
          .quill-wrapper .ql-editor li.ql-indent-2 {
            padding-left: 6em !important;
          }

          /* 文本样式 */
          .quill-wrapper .ql-editor strong,
          .quill-wrapper .ql-editor b {
            font-weight: 600 !important;
          }

          .quill-wrapper .ql-editor em,
          .quill-wrapper .ql-editor i {
            font-style: italic !important;
          }

          .quill-wrapper .ql-editor u {
            text-decoration: underline !important;
          }

          .quill-wrapper .ql-editor s {
            text-decoration: line-through !important;
          }

          .quill-wrapper .ql-editor p {
            margin: 0 !important;
            padding: 0 !important;
          }

          .quill-wrapper .ql-editor p + p {
            margin-top: 0 !important;
          }

          .quill-wrapper .ql-editor br {
            display: block;
            content: "";
            margin: 2px 0;
          }

          /* 链接样式 */
          .quill-wrapper .ql-editor a {
            color: #3b82f6 !important;
            text-decoration: underline !important;
            text-underline-offset: 2px !important;
          }

          /* 标题样式 */
          .quill-wrapper .ql-editor h1,
          .quill-wrapper .ql-editor h2,
          .quill-wrapper .ql-editor h3 {
            font-weight: 700 !important;
            color: inherit !important;
          }

          .quill-wrapper .ql-editor h1 {
            font-size: 1.5em !important;
            margin: 8px 0 4px 0 !important;
          }

          .quill-wrapper .ql-editor h2 {
            font-size: 1.3em !important;
            margin: 6px 0 4px 0 !important;
          }

          .quill-wrapper .ql-editor h3 {
            font-size: 1.1em !important;
            margin: 4px 0 2px 0 !important;
          }
        `}
      </style>
    </div>
  )
}

/**
 * 简化版 - 用于简单的多行文本
 */
export const SimpleTextarea: React.FC<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}> = ({ value, onChange, placeholder = '输入内容...', rows = 4 }) => {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '12px',
        border: '1px solid #e8e8e8',
        borderRadius: '6px',
        fontSize: '13px',
        outline: 'none',
        backgroundColor: '#fff',
        color: '#2d2d2d',
        resize: 'vertical',
        fontFamily: 'inherit',
        lineHeight: '1.6',
        transition: 'all 0.15s',
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = '#d0d0d0'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.03)'
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = '#e8e8e8'
        e.currentTarget.style.boxShadow = 'none'
      }}
    />
  )
}
