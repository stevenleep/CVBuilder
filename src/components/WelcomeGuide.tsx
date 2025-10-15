/**
 * 新用户欢迎引导
 *
 * 首次使用时显示，介绍产品功能
 */

import React, { useState } from 'react'
import { X, ArrowRight, Sparkles, Layout, Palette, Download } from 'lucide-react'

interface WelcomeGuideProps {
  onClose: () => void
}

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      icon: <Sparkles size={32} />,
      title: '欢迎使用 CVKit',
      description: '专业的简历制作工具，高效、简洁、易用',
      features: [
        '📝 可视化编辑，所见即所得',
        '🎨 精美主题，一键切换',
        '📄 多页支持，自动分页',
        '💾 自动保存，数据安全',
      ],
    },
    {
      icon: <Layout size={32} />,
      title: '从物料库开始',
      description: '左侧物料库提供丰富的组件',
      features: [
        '拖拽物料到画布快速创建',
        '点击物料直接添加到页面',
        '使用Ctrl+点击多选物料',
        '支持框选批量操作',
      ],
    },
    {
      icon: <Palette size={32} />,
      title: '自定义您的简历',
      description: '右侧属性面板轻松调整样式',
      features: [
        '选择预设主题快速应用',
        '自定义字体、颜色、间距',
        '实时预览效果',
        '支持多种视觉风格',
      ],
    },
    {
      icon: <Download size={32} />,
      title: '导出专业简历',
      description: '一键导出高质量文件',
      features: ['导出高清PNG图片', '导出多页PDF文档', '保存为JSON数据', '浏览器直接打印'],
    },
  ]

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onClose()
      localStorage.setItem('cv-builder-welcome-shown', 'true')
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkip = () => {
    onClose()
    localStorage.setItem('cv-builder-welcome-shown', 'true')
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100000,
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={handleSkip}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '560px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'scaleIn 0.3s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={handleSkip}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            border: 'none',
            borderRadius: '6px',
            background: 'transparent',
            color: '#999',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f0f0f0'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <X size={20} />
        </button>

        {/* 图标 */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2d2d2d',
            margin: '0 auto 24px',
          }}
        >
          {currentStepData.icon}
        </div>

        {/* 标题 */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2d2d2d',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          {currentStepData.title}
        </h2>

        {/* 描述 */}
        <p
          style={{
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
            marginBottom: '28px',
            lineHeight: '1.6',
          }}
        >
          {currentStepData.description}
        </p>

        {/* 特性列表 */}
        <div
          style={{
            display: 'grid',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          {currentStepData.features.map((feature, index) => (
            <div
              key={index}
              style={{
                fontSize: '13px',
                color: '#555',
                lineHeight: '1.6',
                paddingLeft: '8px',
              }}
            >
              {feature}
            </div>
          ))}
        </div>

        {/* 进度指示器 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '28px',
          }}
        >
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentStep ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: index === currentStep ? '#2d2d2d' : '#e0e0e0',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* 按钮 */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={handleSkip}
            style={{
              padding: '12px 24px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: 'white',
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
              e.currentTarget.style.backgroundColor = 'white'
            }}
          >
            跳过
          </button>
          <button
            onClick={handleNext}
            style={{
              padding: '12px 28px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#2d2d2d',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#3d3d3d'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#2d2d2d'
            }}
          >
            <span>{isLastStep ? '开始使用' : '下一步'}</span>
            <ArrowRight size={18} />
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
              transform: scale(0.9);
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
