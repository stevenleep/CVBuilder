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
  Upload,
  MoreVertical,
  Globe,
} from 'lucide-react'
import { SaveResumeDialog } from './SaveResumeDialog'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { AutoSaveIndicator } from '@/components/AutoSaveIndicator'
import { ExportPreviewDialog, ExportOptions } from './ExportPreviewDialog'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { nanoid } from 'nanoid'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { exportHTML } from '@/utils/htmlExporter'
import { useTheme } from '@/core/context/ThemeContext'
import { useIsMobile, useIsSmallScreen } from '@/hooks/useMediaQuery'

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
  const isMobile = useIsMobile()
  const isSmallScreen = useIsSmallScreen()

  const [showSaveMenu, setShowSaveMenu] = useState(false)
  const [showNewResumeDialog, setShowNewResumeDialog] = useState(false)
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false)
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false)
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)
  const [showExportPreview, setShowExportPreview] = useState(false)
  const [exportInitialFormat, setExportInitialFormat] = useState<'pdf' | 'png' | 'json' | 'html'>(
    'pdf'
  )
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

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

  const handleImportJSON = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // 验证数据格式
      if (!data.pageSchema) {
        notification.error('无效的JSON文件格式')
        return
      }

      // 导入数据
      const state = useEditorStore.getState()
      state.setPageSchema(data.pageSchema)

      // 如果有主题配置，也导入
      if (data.theme) {
        // 这里可以设置主题，但需要从ThemeContext获取setTheme方法
        // 暂时跳过主题导入
      }

      // 如果有画布配置，也导入
      if (data.canvasConfig) {
        state.updateCanvasConfig(data.canvasConfig)
      }

      notification.success('JSON 导入成功！')
    } catch (error) {
      notification.error('JSON 文件解析失败')
      console.error('Import error:', error)
    }

    // 重置 input
    e.target.value = ''
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
      } else if (options.format === 'html') {
        // HTML 导出 - 使用独立导出模块
        const state = useEditorStore.getState()
        await exportHTML({
          version: options.htmlVersion || 'html5',
          pageSchema: state.pageSchema,
        })
        notification.success('网页导出成功！')
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
        height: isMobile ? '44px' : '48px',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '0 8px' : '0 14px',
        gap: isMobile ? '5px' : '8px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      {/* 左侧区域 */}
      {!isMobile && <LogoIcon size={28} />}

      {!isSmallScreen && (
        <>
          <div style={{ display: 'flex', gap: '4px' }}>
            {/* 返回首页 */}
            <TextButton onClick={() => navigate('/')}>
              <Home size={13} />
              首页
            </TextButton>

            {/* 导入 */}
            <TextButton onClick={handleImportJSON}>
              <Upload size={13} />
              导入
            </TextButton>
          </div>

          <Divider />

          {/* 模式切换 - 带文字的按钮组 */}
          <div style={{ display: 'flex', gap: '3px' }}>
            <ModeButton
              icon={<Edit3 size={13} />}
              label="编辑"
              active={mode === 'edit'}
              onClick={() => setMode('edit')}
            />
            <ModeButton
              icon={<Eye size={13} />}
              label="预览"
              active={mode === 'preview'}
              onClick={() => setMode('preview')}
            />
          </div>
        </>
      )}

      {/* 中间区域 - 核心编辑功能 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '5px' : '8px',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {/* 撤销/重做 */}
        <div style={{ display: 'flex', gap: '3px' }}>
          <IconButton
            icon={<Undo size={13} />}
            tooltip="撤销"
            onClick={() => undo()}
            disabled={!canUndo()}
          />
          <IconButton
            icon={<Redo size={13} />}
            tooltip="重做"
            onClick={() => redo()}
            disabled={!canRedo()}
          />
        </div>

        {/* 移动端的模式切换 */}
        {isMobile && (
          <>
            <Divider />
            <div style={{ display: 'flex', gap: '3px' }}>
              <IconButton
                icon={<Edit3 size={13} />}
                tooltip="编辑模式"
                onClick={() => setMode('edit')}
              />
              <IconButton
                icon={<Eye size={13} />}
                tooltip="预览模式"
                onClick={() => setMode('preview')}
              />
            </div>
          </>
        )}

        {!isSmallScreen && (
          <>
            <Divider />
            {/* 缩放控制 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <IconButton
                icon={<ZoomOut size={14} />}
                tooltip="缩小"
                onClick={() => handleZoomOut()}
              />
              <button
                onClick={handleZoomReset}
                title="重置缩放"
                style={{
                  minWidth: '52px',
                  height: '26px',
                  padding: '0 8px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#2d2d2d',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '5px',
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
              <IconButton
                icon={<ZoomIn size={14} />}
                tooltip="放大"
                onClick={() => handleZoomIn()}
              />
            </div>
          </>
        )}
      </div>

      {/* 右侧区域 - 文档操作 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} />

      {!isSmallScreen && (
        <>
          <AutoSaveIndicator />

          {/* 帮助 - 增强视觉效果 */}
          <div
            style={{
              position: 'relative',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <IconButton
              icon={<HelpCircle size={13} />}
              tooltip="快捷键帮助 (按 ? 查看)"
              onClick={() => setShowShortcutsHelp(true)}
            />
            {/* 小提示徽章 */}
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '6px',
                height: '6px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                border: '1.5px solid #fff',
              }}
            />
          </div>

          <Divider />

          {/* HTML 快捷导出 */}
          <TextButton
            onClick={() => {
              setExportInitialFormat('html')
              setShowExportPreview(true)
            }}
          >
            <Globe size={13} />
            网页
          </TextButton>

          {/* 导出 */}
          <TextButton
            onClick={() => {
              setExportInitialFormat('pdf')
              setShowExportPreview(true)
            }}
          >
            <Download size={13} />
            导出
          </TextButton>

          {/* 保存 - 分割按钮 */}
          <div style={{ position: 'relative' }}>
            <SplitButton
              onMainClick={() => handleSave()}
              onMenuClick={() => setShowSaveMenu(!showSaveMenu)}
            >
              <Save size={13} />
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
        </>
      )}

      {/* 移动端/平板：紧凑操作按钮 */}
      {isSmallScreen && (
        <>
          {/* HTML 快捷导出 - 仅图标 */}
          <IconButton
            icon={<Globe size={isMobile ? 14 : 16} />}
            tooltip="导出网页"
            onClick={() => {
              setExportInitialFormat('html')
              setShowExportPreview(true)
            }}
          />

          {/* 导出按钮 - 仅图标 */}
          <IconButton
            icon={<Download size={isMobile ? 14 : 16} />}
            tooltip="导出"
            onClick={() => {
              setExportInitialFormat('pdf')
              setShowExportPreview(true)
            }}
          />

          {/* 保存按钮 - 仅图标 */}
          <IconButton
            icon={<Save size={isMobile ? 14 : 16} />}
            tooltip="保存"
            onClick={() => handleSave()}
          />

          {/* 更多菜单 */}
          <div style={{ position: 'relative' }}>
            <IconButton
              icon={<MoreVertical size={isMobile ? 14 : 16} />}
              tooltip="更多"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            />

            {showMoreMenu && (
              <Menu onClose={() => setShowMoreMenu(false)} align="right">
                <MenuItem onClick={() => navigate('/')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Home size={13} />
                    返回首页
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleImportJSON()
                    setShowMoreMenu(false)
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Upload size={13} />
                    导入JSON
                  </div>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setShowSaveAsDialog(true)
                    setShowMoreMenu(false)
                  }}
                >
                  另存为...
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setShowSaveTemplateDialog(true)
                    setShowMoreMenu(false)
                  }}
                >
                  保存为模板
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setShowShortcutsHelp(true)
                    setShowMoreMenu(false)
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HelpCircle size={13} />
                    快捷键帮助
                  </div>
                </MenuItem>
              </Menu>
            )}
          </div>
        </>
      )}

      {showExportPreview && (
        <ExportPreviewDialog
          onExport={handleExportWithOptions}
          onClose={() => setShowExportPreview(false)}
          initialFormat={exportInitialFormat}
        />
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* CSS动画 */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>

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
        width: '26px',
        height: '26px',
        border: 'none',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: hover && !disabled ? '#f5f5f5' : 'transparent',
        color: disabled ? '#d0d0d0' : hover ? '#2d2d2d' : '#666',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hover && !disabled ? 'scale(1.05)' : 'scale(1)',
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
        height: '26px',
        padding: '0 10px',
        border: hover ? '1px solid #e8e8e8' : '1px solid transparent',
        borderRadius: '5px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        backgroundColor: hover ? '#f8f8f8' : 'transparent',
        color: hover ? '#2d2d2d' : '#666',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hover ? '0 2px 4px rgba(0,0,0,0.04)' : 'none',
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
  const [hover, setHover] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: '26px',
        display: 'flex',
        backgroundColor: '#2d2d2d',
        borderRadius: '5px',
        boxShadow: hover ? '0 2px 6px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      {/* 主按钮区域 */}
      <button
        onClick={onMainClick}
        onMouseEnter={() => setMainHover(true)}
        onMouseLeave={() => setMainHover(false)}
        style={{
          height: '26px',
          padding: '0 12px',
          border: 'none',
          background: 'transparent',
          fontSize: '12px',
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
          backgroundColor: 'rgba(255,255,255,0.2)',
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
          height: '26px',
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
  label?: string
  active: boolean
  onClick: () => void
  compact?: boolean
}> = ({ icon, label, active, onClick, compact = false }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        minWidth: compact ? '22px' : 'auto',
        height: '26px',
        padding: compact ? '0' : '0 10px',
        border: '1px solid transparent',
        borderRadius: '5px',
        backgroundColor: active ? '#2d2d2d' : hover ? '#f5f5f5' : 'transparent',
        color: active ? '#fff' : hover ? '#2d2d2d' : '#666',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      {!compact && label && <span>{label}</span>}
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
