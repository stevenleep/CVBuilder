/**
 * CVKit Logo 组件
 * 
 * 统一的品牌标识，与 favicon 保持一致的设计
 */

import React from 'react'

interface LogoProps {
  size?: number
  showText?: boolean
  textSize?: number
  className?: string
  style?: React.CSSProperties
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 40, 
  showText = false,
  textSize = 18,
  className,
  style 
}) => {
  if (showText) {
    return (
      <div 
        className={className}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          ...style 
        }}
      >
        <LogoIcon size={size} />
        <div
          style={{
            fontSize: `${textSize}px`,
            fontWeight: '700',
            color: '#2d2d2d',
            letterSpacing: '0.3px',
          }}
        >
          CVKit
        </div>
      </div>
    )
  }

  return <LogoIcon size={size} className={className} style={style} />
}

interface LogoIconProps {
  size?: number
  className?: string
  style?: React.CSSProperties
}

export const LogoIcon: React.FC<LogoIconProps> = ({ 
  size = 40,
  className,
  style 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none"
      className={className}
      style={style}
    >
      {/* 背景圆形 */}
      <circle cx="32" cy="32" r="32" fill="#2d2d2d"/>
      
      {/* 文档图标 */}
      <rect x="18" y="14" width="28" height="36" rx="2" fill="white"/>
      
      {/* 文档折角 */}
      <path d="M 38 14 L 46 22 L 38 22 Z" fill="#f5f5f5"/>
      
      {/* 文档线条 */}
      <line x1="22" y1="22" x2="34" y2="22" stroke="#2d2d2d" strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="28" x2="42" y2="28" stroke="#999999" strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="33" x2="42" y2="33" stroke="#999999" strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="38" x2="38" y2="38" stroke="#999999" strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="43" x2="35" y2="43" stroke="#999999" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

