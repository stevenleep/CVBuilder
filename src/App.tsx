/**
 * 应用入口组件 - 路由配置
 */

import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { registerAllMaterials } from './materials'
import { useEditorStore } from './store/editorStore'
import { bootstrapEditor } from './core'
import { EditorProvider } from './core/context/EditorContext'
import { ThemeProvider } from './core/context/ThemeContext'
import { DndProvider } from './editor/DndProvider'
import { NotificationProvider } from './components/NotificationProvider'
import { WelcomeGuide } from './components/WelcomeGuide'
import { Logo } from './components/Logo'
import { HomePage } from './pages/HomePage'
import { EditorPage } from './pages/EditorPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { TemplatePreviewPage } from './pages/TemplatePreviewPage'
import { ExamplePreviewPage } from './pages/ExamplePreviewPage'
import { ResumesPage } from './pages/ResumesPage'

function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  // 初始化编辑器上下文（只初始化一次）
  const editorContext = useMemo(() => {
    const context = bootstrapEditor({
      debug: false,
      autoSaveInterval: 30000,
      maxHistorySize: 50,
      enablePlugins: true,
    })

    // 立即注册所有物料
    registerAllMaterials(context.materialRegistry)

    return context
  }, [])

  useEffect(() => {
    // 尝试从 IndexedDB 加载
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

        // 首次使用显示欢迎
        const hasShownWelcome = localStorage.getItem('cv-builder-welcome-shown')
        if (!hasShownWelcome) {
          setTimeout(() => {
            setShowWelcome(true)
          }, 500)
        }
      })
  }, [editorContext])

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
    <NotificationProvider>
      <EditorProvider value={editorContext}>
        <ThemeProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
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

              {/* 默认重定向到首页 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </EditorProvider>
    </NotificationProvider>
  )
}

export default App
