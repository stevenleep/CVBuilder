/**
 * 编辑器布局
 *
 * 整合所有编辑器组件，支持面板宽度调整
 */

import React, { useState } from 'react'
import { Toolbar } from './Toolbar'
import { MaterialPanel } from './MaterialPanel'
import { Canvas } from './Canvas'
import { PropertyPanel } from './PropertyPanel'
import { ResizablePanel } from './ResizablePanel'
import { DragPreview } from './DragPreview'
import { MultiSelectionToolbar } from './MultiSelectionToolbar'
import { BatchEditPanel } from './BatchEditPanel'
import { AutoSaveIndicator } from '@/components/AutoSaveIndicator'
import { SaveResumeDialog } from './SaveResumeDialog'
import { HomeIconModal } from '@/components/HomeIconModal'
import { useKeyboardShortcuts } from '@/core/hooks/useKeyboardShortcuts'
import { useIsSmallScreen } from '@/hooks/useMediaQuery'
import { useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export const EditorLayout: React.FC = () => {
  // 启用键盘快捷键
  useKeyboardShortcuts()
  const navigate = useNavigate()

  // 响应式设计
  const isSmallScreen = useIsSmallScreen()
  const [showLeftPanel, setShowLeftPanel] = useState(!isSmallScreen)
  const [showRightPanel, setShowRightPanel] = useState(!isSmallScreen)

  // 弹窗状态
  const [showNewResumeDialog, setShowNewResumeDialog] = useState(false)
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false)
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false)
  const [showHomeIconModal, setShowHomeIconModal] = useState(false)

  // 小屏幕时自动收起侧边栏
  React.useEffect(() => {
    if (isSmallScreen) {
      setShowLeftPanel(false)
      setShowRightPanel(false)
    } else {
      setShowLeftPanel(true)
      setShowRightPanel(true)
    }
  }, [isSmallScreen])

  // 监听弹窗事件
  React.useEffect(() => {
    const handleShowNewResumeDialog = () => setShowNewResumeDialog(true)
    const handleShowSaveAsDialog = () => setShowSaveAsDialog(true)
    const handleShowSaveTemplateDialog = () => setShowSaveTemplateDialog(true)
    const handleShowHomeIconModal = () => setShowHomeIconModal(true)

    window.addEventListener('cvkit-show-new-resume-dialog', handleShowNewResumeDialog)
    window.addEventListener('cvkit-show-save-as-dialog', handleShowSaveAsDialog)
    window.addEventListener('cvkit-show-save-template-dialog', handleShowSaveTemplateDialog)
    window.addEventListener('show-home-icon-modal', handleShowHomeIconModal)

    return () => {
      window.removeEventListener('cvkit-show-new-resume-dialog', handleShowNewResumeDialog)
      window.removeEventListener('cvkit-show-save-as-dialog', handleShowSaveAsDialog)
      window.removeEventListener('cvkit-show-save-template-dialog', handleShowSaveTemplateDialog)
      window.removeEventListener('show-home-icon-modal', handleShowHomeIconModal)
    }
  }, [])

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 悬浮工具栏 - 底部 */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Toolbar />
      </div>

      {/* 主要内容区 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 小屏幕控制按钮 */}
        {isSmallScreen && (
          <>
            <button
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 1001,
                width: '36px',
                height: '36px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showLeftPanel ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1001,
                width: '36px',
                height: '36px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showRightPanel ? <X size={18} /> : <Menu size={18} />}
            </button>
          </>
        )}

        {/* 左侧物料面板（可调整宽度） */}
        {showLeftPanel && (
          <div
            style={{
              position: isSmallScreen ? 'absolute' : 'relative',
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: isSmallScreen ? 1000 : 'auto',
              boxShadow: isSmallScreen ? '2px 0 8px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <ResizablePanel
              side="left"
              defaultWidth={isSmallScreen ? 280 : 280}
              minWidth={252}
              maxWidth={400}
            >
              <MaterialPanel />
            </ResizablePanel>
          </div>
        )}

        {/* 中间画布 */}
        <Canvas />

        {/* 右侧属性面板（可调整宽度） */}
        {showRightPanel && (
          <div
            style={{
              position: isSmallScreen ? 'absolute' : 'relative',
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: isSmallScreen ? 1000 : 'auto',
              boxShadow: isSmallScreen ? '-2px 0 8px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <ResizablePanel
              side="right"
              defaultWidth={isSmallScreen ? 300 : 320}
              minWidth={280}
              maxWidth={450}
            >
              <PropertyPanel />
            </ResizablePanel>
          </div>
        )}

        {/* 小屏幕遮罩层 */}
        {isSmallScreen && (showLeftPanel || showRightPanel) && (
          <div
            onClick={() => {
              setShowLeftPanel(false)
              setShowRightPanel(false)
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 50,
            }}
          />
        )}
      </div>

      {/* 拖拽预览 */}
      <DragPreview />

      {/* 多选工具栏 */}
      <MultiSelectionToolbar />

      {/* 批量编辑面板 */}
      <BatchEditPanel />

      {/* 自动保存指示器 - 右下角 */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 100,
        }}
      >
        <AutoSaveIndicator />
      </div>

      {/* 弹窗组件 - 在最顶层 */}
      {showNewResumeDialog && (
        <SaveResumeDialog
          onSave={(_name, _description) => {
            // 这里需要调用保存逻辑
            setShowNewResumeDialog(false)
          }}
          onClose={() => setShowNewResumeDialog(false)}
        />
      )}

      {showSaveAsDialog && (
        <SaveResumeDialog
          onSave={(_name, _description) => {
            // 这里需要调用另存为逻辑
            setShowSaveAsDialog(false)
          }}
          onClose={() => setShowSaveAsDialog(false)}
        />
      )}

      {showSaveTemplateDialog && (
        <SaveResumeDialog
          onSave={(_name, _description) => {
            // 这里需要调用保存为模板逻辑
            setShowSaveTemplateDialog(false)
          }}
          onClose={() => setShowSaveTemplateDialog(false)}
        />
      )}

      {/* 首页图标提示窗口 - 全屏modal */}
      <HomeIconModal
        isOpen={showHomeIconModal}
        onClose={() => setShowHomeIconModal(false)}
        onConfirm={() => {
          setShowHomeIconModal(false)
          navigate('/')
        }}
      />
    </div>
  )
}
