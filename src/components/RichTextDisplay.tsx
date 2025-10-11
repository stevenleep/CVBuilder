/**
 * 富文本显示组件
 *
 * 用于在简历中渲染富文本内容
 */

import React from 'react'

interface RichTextDisplayProps {
  html: string
  style?: React.CSSProperties
}

export const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ html, style }) => {
  return (
    <>
      <div
        className="rich-text-content"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: 'inherit',
          lineHeight: 'inherit',
          color: 'inherit',
          ...style,
        }}
      />
      <style>{`
        /* 列表样式 - 和 Quill 完全一致 */
        .rich-text-content ul,
        .rich-text-content ol {
          margin: 4px 0 !important;
          padding-left: 20px !important;
          list-style-position: outside !important;
        }
        
        .rich-text-content ul {
          list-style-type: disc !important;
        }
        
        .rich-text-content ol {
          list-style-type: decimal !important;
        }
        
        .rich-text-content li {
          margin: 2px 0 !important;
          padding-left: 4px !important;
          list-style: inherit !important;
        }

        /* Quill 特定的列表类 */
        .rich-text-content .ql-indent-1 {
          padding-left: 3em !important;
        }
        
        .rich-text-content .ql-indent-2 {
          padding-left: 6em !important;
        }
        
        /* 链接样式 - 继承颜色 */
        .rich-text-content a {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        /* 文本样式 */
        .rich-text-content strong,
        .rich-text-content b {
          font-weight: 600;
        }
        
        .rich-text-content em,
        .rich-text-content i {
          font-style: italic;
        }

        .rich-text-content u {
          text-decoration: underline;
        }

        .rich-text-content s {
          text-decoration: line-through;
        }
        
        /* 段落样式 */
        .rich-text-content p {
          margin: 0;
        }

        .rich-text-content p + p {
          margin-top: 0;
        }
        
        .rich-text-content br {
          display: block;
          content: "";
          margin: 2px 0;
        }

        /* 标题样式 */
        .rich-text-content h1 {
          font-size: 1.5em;
          font-weight: 700;
          margin: 8px 0 4px 0;
        }

        .rich-text-content h2 {
          font-size: 1.3em;
          font-weight: 700;
          margin: 6px 0 4px 0;
        }

        .rich-text-content h3 {
          font-size: 1.1em;
          font-weight: 600;
          margin: 4px 0 2px 0;
        }
        
        /* 徽章样式 */
        .rich-text-content .badge {
          display: inline-block;
          padding: 2px 8px;
          background-color: #fafafa;
          border-radius: 4px;
          font-size: 0.9em;
          font-weight: 500;
          border: 1px solid #e8e8e8;
          margin: 0 2px;
        }
      `}</style>
    </>
  )
}
