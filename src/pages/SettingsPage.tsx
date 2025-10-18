/**
 * 设置页面
 */

import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'
import { EncryptionManagementPanel } from '@/components/EncryptionManagementPanel'
import { Logo } from '@/components/Logo'

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* 顶部导航栏 */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '8px 14px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: 'transparent',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.color = '#2d2d2d'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#666'
              }}
            >
              <ArrowLeft size={18} />
              返回
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#2d2d2d', margin: 0 }}>
              设置
            </h1>
          </div>
          <Logo size={28} showText textSize={14} />
        </div>
      </div>

      {/* 主内容区 */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 加密设置 */}
          <section>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#2d2d2d', marginBottom: '12px' }}>
              安全与隐私
            </h2>
            <EncryptionManagementPanel />
          </section>

          {/* 关于信息 */}
          <section>
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e8e8e8',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2d2d2d',
                    }}
                  >
                    <Info size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#2d2d2d', margin: 0 }}>
                      关于
                    </h3>
                  </div>
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>应用名称</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#2d2d2d' }}>CVKit</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>版本</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#2d2d2d' }}>1.0.0</span>
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '16px',
                      borderTop: '1px solid #f0f0f0',
                    }}
                  >
                    <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.6, margin: 0 }}>
                      本应用使用端到端加密技术保护您的数据安全，所有数据均存储在本地浏览器中，不会上传到任何服务器。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
