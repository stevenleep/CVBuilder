/**
 * 应用入口组件 - 路由配置
 */

import { useEffect, useMemo, useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { registerAllMaterials } from './materials'
import { useEditorStore } from './store/editorStore'
import { bootstrapEditor } from './core'
import { EditorProvider } from './core/context/EditorContext'
import { ThemeProvider } from './core/context/ThemeContext'
import { EncryptionProvider } from './core/context/EncryptionContext'
import { DndProvider } from './editor/DndProvider'
import { NotificationProvider } from './components/NotificationProvider'
import { WelcomeGuide } from './components/WelcomeGuide'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Logo } from './components/Logo'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { PWAUpdatePrompt } from './components/PWAUpdatePrompt'
import { HomePage } from './pages/HomePage'
import { EditorPage } from './pages/EditorPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { TemplatePreviewPage } from './pages/TemplatePreviewPage'
import { ExamplePreviewPage } from './pages/ExamplePreviewPage'
import { ResumesPage } from './pages/ResumesPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  const editorContext = useMemo(() => {
    const context = bootstrapEditor({
      autoSaveInterval: 30000,
      maxHistorySize: 50,
    })

    registerAllMaterials(context.materialRegistry)

    return context
  }, [])

  useEffect(() => {
    useEditorStore
      .getState()
      .loadFromStorage()
      .then(() => {
        setIsInitialized(true)

        // 检查是否首次使用
        const hasShownWelcome = localStorage.getItem('cv-builder-welcome-shown')
        if (!hasShownWelcome) {
          setTimeout(() => {
            setShowWelcome(true)
          }, 500)
        }
      })
      .catch(() => {
        setIsInitialized(true)
        const hasShownWelcome = localStorage.getItem('cv-builder-welcome-shown')
        if (!hasShownWelcome) {
          setTimeout(() => {
            setShowWelcome(true)
          }, 500)
        }
      })
  }, [])

  if (!isInitialized) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ margin: '0 auto 20px', display: 'flex', justifyContent: 'center' }}>
            <Logo size={64} />
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#2d2d2d',
              marginBottom: '8px',
              letterSpacing: '0.5px',
            }}
          >
            CVKit
          </div>
          <div style={{ fontSize: '13px', color: '#999' }}>正在加载...</div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <EncryptionProvider>
          <EditorProvider value={editorContext}>
            <ThemeProvider>
              {/* HashRouter 不需要 basename 配置 */}
              <HashRouter>
                <Routes>
                  {/* 首页 */}
                  <Route path="/" element={<HomePage />} />

                  {/* 编辑器 */}
                  <Route
                    path="/editor"
                    element={
                      <DndProvider>
                        <EditorPage />
                        {showWelcome && <WelcomeGuide onClose={() => setShowWelcome(false)} />}
                      </DndProvider>
                    }
                  />

                  {/* 编辑器 - 带ID */}
                  <Route
                    path="/editor/:id"
                    element={
                      <DndProvider>
                        <EditorPage />
                      </DndProvider>
                    }
                  />

                  {/* 模板库 */}
                  <Route path="/templates" element={<TemplatesPage />} />

                  {/* 模板预览 */}
                  <Route
                    path="/templates/:id/preview"
                    element={
                      <DndProvider>
                        <TemplatePreviewPage />
                      </DndProvider>
                    }
                  />

                  {/* 示例预览 */}
                  <Route
                    path="/examples/:id/preview"
                    element={
                      <DndProvider>
                        <ExamplePreviewPage />
                      </DndProvider>
                    }
                  />

                  {/* 简历库 */}
                  <Route path="/resumes" element={<ResumesPage />} />

                  {/* 设置页面 */}
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* 默认重定向到首页 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* PWA 安装提示 */}
                <PWAInstallPrompt />

                {/* PWA 更新提示 */}
                <PWAUpdatePrompt />
              </HashRouter>
            </ThemeProvider>
          </EditorProvider>
        </EncryptionProvider>
      </NotificationProvider>
    </ErrorBoundary>
  )
}

export default App
