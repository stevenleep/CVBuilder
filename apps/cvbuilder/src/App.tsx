/**
 * CVBuilder - 基于 LCEdit 新架构的简历构建器
 */

import { useMemo } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createCoreServices } from '@lcedit/core'
import { EditorProvider, ServiceProvider } from '@lcedit/react'
import { EditorPage } from './pages/EditorPage'
import './index.css'

function App() {
  // 创建核心服务（一行搞定！）
  const services = useMemo(() => createCoreServices(), [])

  return (
    <ServiceProvider services={services}>
      <EditorProvider stateManager={services.stateManager}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<EditorPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </EditorProvider>
    </ServiceProvider>
  )
}

export default App
