/**
 * 空画布引导组件
 * 
 * 当画布为空时显示，引导用户快速开始
 */

import React from 'react'
import { Sparkles, Layout, FileText, Zap } from 'lucide-react'

interface EmptyCanvasGuideProps {
  onSelectTemplate?: () => void
  onViewExamples?: () => void
}

export const EmptyCanvasGuide: React.FC<EmptyCanvasGuideProps> = ({
  onSelectTemplate,
  onViewExamples,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '600px',
        padding: '0 24px',
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* 主标题 */}
      <div
        style={{
          marginBottom: '32px',
          animation: 'fadeIn 0.6s ease-out',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 20px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Sparkles size={36} color="#fff" strokeWidth={2} />
        </div>

        <h2
          style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#2d2d2d',
            marginBottom: '12px',
            letterSpacing: '-0.5px',
          }}
        >
          开始创建你的专业简历
        </h2>

        <p
          style={{
            fontSize: '16px',
            color: '#666',
            lineHeight: 1.6,
            maxWidth: '480px',
            margin: '0 auto',
          }}
        >
          从左侧物料面板拖拽组件到画布，或使用下面的快捷方式快速开始
        </p>
      </div>

      {/* 快速开始选项 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          pointerEvents: 'auto',
          animation: 'fadeIn 0.6s ease-out 0.2s backwards',
        }}
      >
        {/* 从模板开始 */}
        <QuickStartCard
          icon={<Layout size={24} />}
          title="使用模板"
          description="选择预设模板"
          color="#667eea"
          onClick={onSelectTemplate}
        />

        {/* 查看示例 */}
        <QuickStartCard
          icon={<FileText size={24} />}
          title="查看示例"
          description="参考优秀案例"
          color="#f59e0b"
          onClick={onViewExamples}
        />

        {/* 空白开始 */}
        <QuickStartCard
          icon={<Zap size={24} />}
          title="自由创作"
          description="从空白开始"
          color="#10b981"
          onClick={() => {
            // 提示用户从左侧拖拽
            const event = new CustomEvent('cvkit-show-material-panel-hint')
            window.dispatchEvent(event)
          }}
        />
      </div>

      {/* 提示 */}
      <div
        style={{
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '1px dashed #d0d0d0',
          animation: 'fadeIn 0.6s ease-out 0.4s backwards',
          pointerEvents: 'auto',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            color: '#666',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          💡 <strong>小提示：</strong>
          使用快捷键 <kbd style={kbdStyle}>Cmd/Ctrl + Z</kbd> 撤销，
          <kbd style={kbdStyle}>Cmd/Ctrl + S</kbd> 保存，
          <kbd style={kbdStyle}>Cmd/Ctrl + /</kbd> 查看所有快捷键
        </p>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}

// 快速开始卡片
const QuickStartCard: React.FC<{
  icon: React.ReactNode
  title: string
  description: string
  color: string
  onClick?: () => void
}> = ({ icon, title, description, color, onClick }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={!onClick}
      style={{
        padding: '20px',
        backgroundColor: '#fff',
        border: `2px solid ${hover ? color : '#e0e0e0'}`,
        borderRadius: '12px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover
          ? `0 12px 24px ${color}20, 0 4px 8px rgba(0, 0, 0, 0.08)`
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          marginBottom: '12px',
          borderRadius: '12px',
          backgroundColor: hover ? color : `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: hover ? '#fff' : color,
          transition: 'all 0.3s',
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#2d2d2d',
          marginBottom: '4px',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '13px',
          color: '#666',
          margin: 0,
        }}
      >
        {description}
      </p>
    </button>
  )
}

const kbdStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 6px',
  margin: '0 2px',
  fontSize: '12px',
  fontWeight: '600',
  color: '#2d2d2d',
  backgroundColor: '#fff',
  border: '1px solid #d0d0d0',
  borderRadius: '4px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  fontFamily: 'monospace',
}

