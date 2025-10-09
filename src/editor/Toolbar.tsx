/**
 * 工具栏组件 - 现代扁平化设计
 */

import React, { useState } from 'react'
import { useEditorStore } from '@store/editorStore'
import { 
  Undo, 
  Redo, 
  Eye, 
  Edit3, 
  Save, 
  Download,
  ZoomIn,
  ZoomOut,
  FileText,
  Library,
} from 'lucide-react'
import { SaveResumeTemplateDialog } from './SaveResumeTemplateDialog'
import { ResumeTemplatesPanel } from './ResumeTemplatesPanel'
import { resumeTemplateManager } from '@/core/services/ResumeTemplateManager'

export const Toolbar: React.FC = () => {
  const { 
    mode, 
    canvasConfig,
    canUndo,
    canRedo,
    undo,
    redo,
    setMode,
    updateCanvasConfig,
    saveToLocalStorage,
    pageSchema,
  } = useEditorStore()
  
  const [showSaveResumeDialog, setShowSaveResumeDialog] = useState(false)
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false)

  const handleZoomIn = () => {
    const newScale = Math.min(canvasConfig.scale + 0.1, 2)
    updateCanvasConfig({ scale: newScale })
  }

  const handleZoomOut = () => {
    const newScale = Math.max(canvasConfig.scale - 0.1, 0.5)
    updateCanvasConfig({ scale: newScale })
  }

  const handleExport = () => {
    const schema = useEditorStore.getState().pageSchema
    const dataStr = JSON.stringify(schema, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'resume.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }
  
  const handleSaveResumeTemplate = (name: string, description: string) => {
    resumeTemplateManager.saveAsTemplate(pageSchema, name, description)
    alert('简历模板保存成功！')
  }

  return (
    <div 
      style={{
        height: '48px',
        borderBottom: '1px solid #f1f1f1',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '8px',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Logo */}
      <div style={{ 
        fontWeight: '600', 
        fontSize: '15px', 
        color: '#000',
        marginRight: '16px',
      }}>
        Resume
      </div>
      
      {/* 历史操作 */}
      <IconButton 
        icon={<Undo size={16} />} 
        tooltip="撤销"
        onClick={undo}
        disabled={!canUndo()}
      />
      <IconButton 
        icon={<Redo size={16} />} 
        tooltip="重做"
        onClick={redo}
        disabled={!canRedo()}
      />
      
      <Divider />
      
      {/* 视图控制 */}
      <IconButton 
        icon={<ZoomOut size={16} />} 
        tooltip="缩小"
        onClick={handleZoomOut}
      />
      <span style={{ 
        minWidth: '48px',
        fontSize: '13px',
        color: '#666',
        textAlign: 'center',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {Math.round(canvasConfig.scale * 100)}%
      </span>
      <IconButton 
        icon={<ZoomIn size={16} />} 
        tooltip="放大"
        onClick={handleZoomIn}
      />
      
      <Divider />
      
      {/* 模式切换 */}
      <IconButton 
        icon={<Edit3 size={16} />} 
        tooltip="编辑"
        onClick={() => setMode('edit')}
        active={mode === 'edit'}
      />
      <IconButton 
        icon={<Eye size={16} />} 
        tooltip="预览"
        onClick={() => setMode('preview')}
        active={mode === 'preview'}
      />
      
      <div style={{ flex: 1 }} />
      
      {/* 右侧操作 */}
      <IconButton
        icon={<Library size={16} />}
        tooltip="简历模板库"
        onClick={() => setShowTemplatesPanel(true)}
      />
      
      <IconButton
        icon={<FileText size={16} />}
        tooltip="保存为模板"
        onClick={() => setShowSaveResumeDialog(true)}
      />
      
      <Divider />
      
      <TextButton onClick={handleExport}>
        导出
      </TextButton>
      <PrimaryButton onClick={saveToLocalStorage}>
        保存
      </PrimaryButton>
      
      {/* 简历模板库面板 */}
      {showTemplatesPanel && (
        <ResumeTemplatesPanel onClose={() => setShowTemplatesPanel(false)} />
      )}
      
      {/* 保存简历模板对话框 */}
      {showSaveResumeDialog && (
        <SaveResumeTemplateDialog
          onSave={handleSaveResumeTemplate}
          onClose={() => setShowSaveResumeDialog(false)}
        />
      )}
    </div>
  )
}

// 图标按钮
const IconButton: React.FC<{
  icon: React.ReactNode
  tooltip: string
  onClick: () => void
  disabled?: boolean
  active?: boolean
}> = ({ icon, tooltip, onClick, disabled = false, active = false }) => {
  const [hover, setHover] = React.useState(false)
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '32px',
        height: '32px',
        border: 'none',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: active ? '#f5f5f5' : hover && !disabled ? '#fafafa' : 'transparent',
        color: disabled ? '#d0d0d0' : active ? '#000' : '#666',
        transition: 'all 0.1s',
      }}
    >
      {icon}
    </button>
  )
}

// 文本按钮
const TextButton: React.FC<{
  onClick: () => void
  children: React.ReactNode
}> = ({ onClick, children }) => {
  const [hover, setHover] = React.useState(false)
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: '32px',
        padding: '0 12px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        backgroundColor: hover ? '#fafafa' : 'transparent',
        color: '#666',
        transition: 'all 0.1s',
      }}
    >
      {children}
    </button>
  )
}

// 主按钮
const PrimaryButton: React.FC<{
  onClick: () => void
  children: React.ReactNode
}> = ({ onClick, children }) => {
  const [hover, setHover] = React.useState(false)
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: '32px',
        padding: '0 16px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        backgroundColor: hover ? '#000' : '#111',
        color: '#fff',
        transition: 'all 0.1s',
      }}
    >
      {children}
    </button>
  )
}

// 分隔线
const Divider = () => (
  <div style={{ 
    width: '1px', 
    height: '16px', 
    backgroundColor: '#f1f1f1',
    margin: '0 4px',
  }} />
)
