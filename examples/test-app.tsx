/**
 * 示例插件和物料测试应用
 *
 * 用于独立测试和演示 examples 目录下的插件和物料
 * 使用方法：在项目中创建一个测试路由指向此组件
 */

import React, { useEffect, useMemo, useState } from 'react'
import { bootstrapEditor } from '../src/core'
import { registerAllMaterials } from '../src/materials'
import { registerExampleMaterials } from './register-materials'
import { registerAllPlugins } from './register-plugins'
import { EditorProvider } from '../src/core/context/EditorContext'
import { ThemeProvider } from '../src/core/context/ThemeContext'
import { DndProvider } from '../src/editor/DndProvider'
import { NotificationProvider } from '../src/components/NotificationProvider'
import { ErrorBoundary } from '../src/components/ErrorBoundary'
import { EditorPage } from '../src/pages/EditorPage'

/**
 * 示例测试应用
 */
export function ExampleTestApp() {
  const [isInitialized, setIsInitialized] = useState(false)

  const editorContext = useMemo(() => {
    console.group('🧪 [Example Test] 初始化测试环境')

    // 1. 初始化编辑器（开启调试模式）
    const context = bootstrapEditor({
      debug: true,
      autoSaveInterval: 30000,
      maxHistorySize: 50,
      enablePlugins: true,
      enableCommands: true,
      enableHistory: true,
      enableNotifications: true,
      enableValidation: true,
      enableExtensions: true,
      enableHooks: true,
      enableMiddleware: true,
      enableShortcuts: true,
    })

    // 2. 注册系统物料
    registerAllMaterials(context.materialRegistry)

    // 3. 注册示例物料
    registerExampleMaterials(context.materialRegistry, {
      enableChart: true,
      enableQRCode: true,
      enableSkillRadar: true,
    })

    // 4. 注册示例插件
    registerAllPlugins(context, {
      // 数据验证插件（建议开启）
      dataValidator: { enabled: true },

      // 水印插件（测试用）
      watermark: {
        enabled: true,
        text: '[Example Test Mode]',
        position: 'bottom-right',
        opacity: 0.3,
      },

      // AI助手插件（需要配置API Key）
      aiAssistant: {
        enabled: false,
        // apiKey: 'your-api-key-here',
        // model: 'gpt-3.5-turbo',
      },
    })
    return context
  }, [])

  useEffect(() => {
    // 简单的初始化
    setTimeout(() => {
      setIsInitialized(true)
    }, 100)
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
          <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
            🧪 Example Test Mode
          </div>
          <div style={{ fontSize: '14px', color: '#999' }}>正在初始化测试环境...</div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <EditorProvider value={editorContext}>
          <ThemeProvider>
            <DndProvider>
              {/* 顶部提示条 */}
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '32px',
                  backgroundColor: '#ff9800',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '500',
                  zIndex: 10000,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                🧪 示例测试模式 - 所有示例插件和物料已启用
              </div>

              {/* 编辑器页面 */}
              <div style={{ paddingTop: '32px' }}>
                <EditorPage />
              </div>
            </DndProvider>
          </ThemeProvider>
        </EditorProvider>
      </NotificationProvider>
    </ErrorBoundary>
  )
}

export default ExampleTestApp
