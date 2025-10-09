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

export const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ 
  html, 
  style 
}) => {
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
        .rich-text-content ul,
        .rich-text-content ol {
          margin: 4px 0;
          padding-left: 20px;
          list-style-position: outside;
        }
        
        .rich-text-content ul {
          list-style-type: disc;
        }
        
        .rich-text-content ol {
          list-style-type: decimal;
        }
        
        .rich-text-content li {
          margin: 2px 0;
          padding-left: 4px;
        }
        
        .rich-text-content a {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .rich-text-content strong,
        .rich-text-content b {
          font-weight: 600;
        }
        
        .rich-text-content em,
        .rich-text-content i {
          font-style: italic;
        }
        
        .rich-text-content p {
          margin: 0;
        }
        
        .rich-text-content br {
          display: block;
          content: "";
          margin: 2px 0;
        }
        
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

