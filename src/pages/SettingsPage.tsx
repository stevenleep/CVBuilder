/**
 * 设置页面
 */

import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { EncryptionManagementPanel } from '@/components/EncryptionManagementPanel'
import { Logo } from '@/components/Logo'

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* 顶部导航栏 - 与 HomePage 统一 */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <div
          style={{
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <Logo size={32} showText textSize={16} />

          {/* 右侧返回按钮 */}
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#666',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f0f0f0'
                e.currentTarget.style.color = '#2d2d2d'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#666'
              }}
            >
              <ArrowLeft size={14} />
              返回首页
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区 - 与 HomePage 统一 */}
      <div
        className="homepage-container"
        style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* 页面标题 */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#2d2d2d',
              margin: 0,
            }}
          >
            设置
          </h1>
        </div>

        {/* 加密管理 */}
        <EncryptionManagementPanel />

        {/* 关于信息 */}
        <div
          style={{
            marginTop: '20px',
            padding: '16px 18px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e8e8e8',
          }}
        >
          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
            <strong style={{ color: '#2d2d2d', fontWeight: '600' }}>CVKit v1.0.0</strong>
            {' · '}
            专业的可视化简历编辑工具
            <br />
            所有数据存储在本地浏览器，支持端到端加密保护
          </div>
        </div>
      </div>
    </div>
  )
}
