/**
 * 空画布引导组件
 *
 * 当画布为空时显示，引导用户快速开始
 */

import React from 'react'
import { ArrowLeft } from 'lucide-react'

interface EmptyCanvasGuideProps {
  onSelectTemplate?: () => void
  onViewExamples?: () => void
}

export const EmptyCanvasGuide: React.FC<EmptyCanvasGuideProps> = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        animation: 'fadeIn 0.4s ease-out',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {/* 箭头指示 */}
      <ArrowLeft
        size={20}
        color="#999"
        strokeWidth={2}
        style={{
          animation: 'slideLeft 1.5s ease-in-out infinite',
        }}
      />

      {/* 提示文字 */}
      <p
        style={{
          fontSize: '14px',
          color: '#999',
          margin: 0,
          fontWeight: '500',
        }}
      >
        从左侧拖拽物料到画布
      </p>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideLeft {
            0%, 100% {
              transform: translateX(0);
              opacity: 1;
            }
            50% {
              transform: translateX(-6px);
              opacity: 0.6;
            }
          }
        `}
      </style>
    </div>
  )
}
