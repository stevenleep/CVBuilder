/**
 * 工具栏组件 - 精简版
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEditorStore } from '@store/editorStore'
import { notification } from '@/utils/notification'
import { LogoIcon } from '@/components/Logo'
import {
  Undo,
  Redo,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  ChevronDown,
  Home,
  Save,
  Download,
} from 'lucide-react'
import { SaveResumeDialog } from './SaveResumeDialog'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { AutoSaveIndicator } from '@/components/AutoSaveIndicator'
import { ExportPreviewDialog, ExportOptions } from './ExportPreviewDialog'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { nanoid } from 'nanoid'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useTheme } from '@/core/context/ThemeContext'

export const Toolbar: React.FC = () => {
  const navigate = useNavigate()
  const {
    mode,
    canvasConfig,
    canUndo,
    canRedo,
    undo,
    redo,
    setMode,
    updateCanvasConfig,
    currentResumeId,
    setCurrentResumeId,
  } = useEditorStore()

  const { theme } = useTheme()

  const [showSaveMenu, setShowSaveMenu] = useState(false)
  const [showNewResumeDialog, setShowNewResumeDialog] = useState(false)
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false)
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false)
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)
  const [showExportPreview, setShowExportPreview] = useState(false)

  // 监听快捷键保存事件
  React.useEffect(() => {
    const handleSaveShortcut = () => {
      handleSave()
    }
    window.addEventListener('cvkit-save', handleSaveShortcut)
    return () => window.removeEventListener('cvkit-save', handleSaveShortcut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleZoomIn = () => {
    const newScale = Math.min(canvasConfig.scale + 0.1, 2)
    updateCanvasConfig({ scale: newScale })
  }

  const handleZoomOut = () => {
    const newScale = Math.max(canvasConfig.scale - 0.1, 0.5)
    updateCanvasConfig({ scale: newScale })
  }

  const handleZoomReset = () => {
    updateCanvasConfig({ scale: 1 })
  }

  const handleExportJSON = () => {
    const state = useEditorStore.getState()

    const exportData = {
      version: '1.0.0',
      exportTime: Date.now(),
      pageSchema: state.pageSchema,
      theme: theme,
      canvasConfig: state.canvasConfig,
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `resume-${Date.now()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    notification.success('JSON 导出成功！')
  }

  const handleSave = async (name?: string, description?: string) => {
    try {
      const state = useEditorStore.getState()
      const resumeId = currentResumeId || nanoid()

      if (!currentResumeId && !name) {
        setShowNewResumeDialog(true)
        return
      }

      const resumeData = {
        id: resumeId,
        name: name || `简历 ${new Date().toLocaleDateString()}`,
        description: description || '',
        schema: state.pageSchema,
        theme: theme,
        canvasConfig: state.canvasConfig,
        thumbnail: '',
        createdAt: currentResumeId
          ? (await indexedDBService.getItem(STORES.RESUMES, currentResumeId))?.createdAt ||
            new Date().toISOString()
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await indexedDBService.setItem(STORES.RESUMES, resumeId, resumeData)

      if (!currentResumeId) {
        setCurrentResumeId(resumeId)
      }

      notification.success('保存成功！')
      window.dispatchEvent(new CustomEvent('cvkit-resume-updated'))
    } catch (error) {
      notification.error('保存失败')
      console.error('Save error:', error)
    }
  }

  const handleSaveAs = async (name: string, description: string) => {
    try {
      const state = useEditorStore.getState()
      const newId = nanoid()

      const resumeData = {
        id: newId,
        name,
        description,
        schema: state.pageSchema,
        theme: theme,
        canvasConfig: state.canvasConfig,
        thumbnail: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await indexedDBService.setItem(STORES.RESUMES, newId, resumeData)
      setCurrentResumeId(newId)

      notification.success('另存为成功！')
      window.dispatchEvent(new CustomEvent('cvkit-resume-updated'))
    } catch (error) {
      notification.error('另存为失败')
      console.error('Save as error:', error)
    }
  }

  const handleExportWithOptions = async (options: ExportOptions) => {
    try {
      // 查找所有页面元素
      const pages = document.querySelectorAll('.page-sheet') as NodeListOf<HTMLElement>

      if (!pages || pages.length === 0) {
        notification.error('未找到简历页面')
        return
      }

      notification.info('正在生成导出文件...')

      if (options.format === 'pdf') {
        // PDF 导出 - 支持多页
        const pdf = new jsPDF({
          orientation: options.pageSize === 'a4' ? 'portrait' : 'landscape',
          unit: 'mm',
          format: options.pageSize || 'a4',
        })

        const scale = options.scale || 2

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i]

          const canvas = await html2canvas(page, {
            scale,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
          })

          const imgData = canvas.toDataURL('image/jpeg', (options.quality || 90) / 100)

          if (i > 0) {
            pdf.addPage()
          }

          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
        }

        pdf.save('resume.pdf')
        notification.success('PDF 导出成功！')
      } else if (options.format === 'png') {
        // PNG 导出 - 只导出第一页
        const scale = options.scale || 2

        const canvas = await html2canvas(pages[0], {
          scale,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        })

        const link = document.createElement('a')
        link.download = 'resume.png'
        link.href = canvas.toDataURL('image/png')
        link.click()
        notification.success('PNG 导出成功！')
      } else if (options.format === 'json') {
        // JSON 导出
        handleExportJSON()
        return
      }

      setShowExportPreview(false)
    } catch (error) {
      notification.error('导出失败')
      console.error('Export error:', error)
    }
  }

  const handleSaveAsTemplate = async (name: string, description: string) => {
    try {
      const state = useEditorStore.getState()

      const { resumeTemplateManager } = await import('@/core/services/ResumeTemplateManager')
      resumeTemplateManager.saveAsTemplate(state.pageSchema, name, description)

      notification.success('模板保存成功！')
    } catch (error) {
      notification.error('保存模板失败')
      console.error('Save template error:', error)
    }
  }

  return (
    <div
      style={{
        height: '48px',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      {/* Logo */}
      <LogoIcon size={28} />

      {/* 返回 */}
      <IconButton icon={<Home size={16} />} tooltip="返回首页" onClick={() => navigate('/')} />

      <Divider />

      {/* 撤销/重做 */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <IconButton
          icon={<Undo size={16} />}
          tooltip="撤销"
          onClick={() => undo()}
          disabled={!canUndo()}
        />
        <IconButton
          icon={<Redo size={16} />}
          tooltip="重做"
          onClick={() => redo()}
          disabled={!canRedo()}
        />
      </div>

      <Divider />

      {/* 模式切换 */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          backgroundColor: '#f5f5f5',
          padding: '3px',
          borderRadius: '6px',
        }}
      >
        <ModeButton
          icon={<Edit3 size={14} />}
          active={mode === 'edit'}
          onClick={() => setMode('edit')}
        />
        <ModeButton
          icon={<Eye size={14} />}
          active={mode === 'preview'}
          onClick={() => setMode('preview')}
        />
      </div>

      <Divider />

      {/* 缩放 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <IconButton icon={<ZoomOut size={14} />} tooltip="缩小" onClick={() => handleZoomOut()} />
        <button
          onClick={handleZoomReset}
          title="重置缩放"
          style={{
            minWidth: '52px',
            height: '28px',
            padding: '0 6px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#666',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontVariantNumeric: 'tabular-nums',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {Math.round(canvasConfig.scale * 100)}%
        </button>
        <IconButton icon={<ZoomIn size={14} />} tooltip="放大" onClick={() => handleZoomIn()} />
      </div>

      <div style={{ flex: 1 }} />

      {/* 自动保存 */}
      <AutoSaveIndicator />

      {/* 帮助 */}
      <IconButton
        icon={<HelpCircle size={16} />}
        tooltip="快捷键"
        onClick={() => setShowShortcutsHelp(true)}
      />

      <Divider />

      {/* 导出 */}
      <TextButton onClick={() => setShowExportPreview(true)}>
        <Download size={14} />
        导出
      </TextButton>

      {showExportPreview && (
        <ExportPreviewDialog
          onExport={handleExportWithOptions}
          onClose={() => setShowExportPreview(false)}
        />
      )}

      {/* 保存 - 分割按钮 */}
      <div style={{ position: 'relative' }}>
        <SplitButton
          onMainClick={() => handleSave()}
          onMenuClick={() => setShowSaveMenu(!showSaveMenu)}
        >
          <Save size={14} />
          保存
        </SplitButton>

        {showSaveMenu && (
          <Menu onClose={() => setShowSaveMenu(false)} align="right">
            <MenuItem
              onClick={() => {
                setShowSaveAsDialog(true)
                setShowSaveMenu(false)
              }}
            >
              另存为...
            </MenuItem>
            <MenuItem
              onClick={() => {
                setShowSaveTemplateDialog(true)
                setShowSaveMenu(false)
              }}
            >
              保存为模板
            </MenuItem>
          </Menu>
        )}
      </div>

      {/* 对话框 */}
      {showShortcutsHelp && <KeyboardShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />}

      {showNewResumeDialog && (
        <SaveResumeDialog
          onSave={(name, description) => {
            handleSave(name, description)
            setShowNewResumeDialog(false)
          }}
          onClose={() => setShowNewResumeDialog(false)}
        />
      )}

      {showSaveAsDialog && (
        <SaveResumeDialog
          onSave={(name, description) => {
            handleSaveAs(name, description)
            setShowSaveAsDialog(false)
          }}
          onClose={() => setShowSaveAsDialog(false)}
        />
      )}

      {showSaveTemplateDialog && (
        <SaveResumeDialog
          onSave={(name, description) => {
            handleSaveAsTemplate(name, description)
            setShowSaveTemplateDialog(false)
          }}
          onClose={() => setShowSaveTemplateDialog(false)}
        />
      )}
    </div>
  )
}

// 图标按钮
const IconButton: React.FC<{
  icon: React.ReactNode
  tooltip: string
  onClick: (e?: React.MouseEvent) => void
  disabled?: boolean
}> = ({ icon, tooltip, onClick, disabled = false }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '28px',
        height: '28px',
        border: 'none',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: hover && !disabled ? '#f5f5f5' : 'transparent',
        color: disabled ? '#d0d0d0' : hover ? '#2d2d2d' : '#666',
        transition: 'all 0.15s',
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
        height: '28px',
        padding: '0 10px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        backgroundColor: hover ? '#f5f5f5' : 'transparent',
        color: '#666',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {children}
    </button>
  )
}

// 分割按钮 - 保存按钮专用
const SplitButton: React.FC<{
  onMainClick: () => void
  onMenuClick: (e: React.MouseEvent) => void
  children: React.ReactNode
}> = ({ onMainClick, onMenuClick, children }) => {
  const [mainHover, setMainHover] = React.useState(false)
  const [menuHover, setMenuHover] = React.useState(false)

  return (
    <div
      style={{
        height: '28px',
        display: 'flex',
        backgroundColor: '#2d2d2d',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* 主按钮区域 */}
      <button
        onClick={onMainClick}
        onMouseEnter={() => setMainHover(true)}
        onMouseLeave={() => setMainHover(false)}
        style={{
          height: '28px',
          padding: '0 12px',
          border: 'none',
          background: 'transparent',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          backgroundColor: mainHover ? '#1a1a1a' : 'transparent',
          color: '#fff',
          transition: 'all 0.15s',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        {children}
      </button>

      {/* 分隔线 */}
      <div
        style={{
          width: '1px',
          height: '16px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          alignSelf: 'center',
        }}
      />

      {/* 下拉按钮区域 */}
      <button
        onClick={e => {
          e.stopPropagation()
          onMenuClick(e)
        }}
        onMouseEnter={() => setMenuHover(true)}
        onMouseLeave={() => setMenuHover(false)}
        title="更多保存选项"
        style={{
          width: '24px',
          height: '28px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          backgroundColor: menuHover ? '#1a1a1a' : 'transparent',
          color: '#fff',
          transition: 'all 0.15s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ChevronDown size={12} />
      </button>
    </div>
  )
}

// 分隔线
const Divider = () => (
  <div
    style={{
      width: '1px',
      height: '16px',
      backgroundColor: '#e8e8e8',
    }}
  />
)

// 模式按钮
const ModeButton: React.FC<{
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}> = ({ icon, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '28px',
        height: '22px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: active ? '#fff' : 'transparent',
        color: active ? '#2d2d2d' : '#999',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      {icon}
    </button>
  )
}

// 菜单
const Menu: React.FC<{
  children: React.ReactNode
  onClose: () => void
  align?: 'left' | 'right'
}> = ({ children, onClose, align = 'left' }) => {
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-menu]')) {
        onClose()
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [onClose])

  return (
    <div
      data-menu
      style={{
        position: 'absolute',
        top: '100%',
        [align]: 0,
        marginTop: '6px',
        minWidth: '180px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
        border: '1px solid #e8e8e8',
        padding: '4px',
        zIndex: 1000,
      }}
    >
      {children}
    </div>
  )
}

// 菜单项
const MenuItem: React.FC<{
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
        width: '100%',
        height: '32px',
        padding: '0 12px',
        border: 'none',
        background: hover ? '#f5f5f5' : 'transparent',
        fontSize: '13px',
        fontWeight: '500',
        color: '#2d2d2d',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.15s',
        borderRadius: '6px',
      }}
    >
      {children}
    </button>
  )
}
