/**
 * 工具栏组件 - 精简版
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEditorStore } from '@store/editorStore'
import { notification } from '@/utils/notification'
import {
  Undo,
  Redo,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  Home,
  Save,
  Download,
  Upload,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { encryptedStorageService } from '@/core/services/EncryptedStorageService'
import { STORES } from '@/utils/indexedDB'
import { nanoid } from 'nanoid'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useTheme } from '@/core/context/ThemeContext'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { ViewportToggle } from '@/core/context/ViewportContext'

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
    previewExampleInfo,
  } = useEditorStore()

  const { theme } = useTheme()
  const isMobile = useIsMobile()
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
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

  // 监听全屏状态变化
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
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

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
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

    e.target.value = ''
  }

  const handleSave = async (name?: string, description?: string, tags?: string[]) => {
    try {
      const state = useEditorStore.getState()
      const resumeId = currentResumeId || nanoid()

      const resumeData = {
        id: resumeId,
        name: name || `简历 ${new Date().toLocaleDateString()}`,
        description: description || '',
        tags: tags || [],
        schema: state.pageSchema,
        theme: theme,
        canvasConfig: state.canvasConfig,
        thumbnail: '',
        createdAt: currentResumeId
          ? (await encryptedStorageService.getItem(STORES.RESUMES, currentResumeId))?.createdAt ||
            new Date().toISOString()
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await encryptedStorageService.setItem(STORES.RESUMES, resumeId, resumeData)

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

  const handleSaveWithModal = () => {
    // 触发全屏保存Modal事件
    window.dispatchEvent(new CustomEvent('cvkit-show-save-modal'))
  }

  const handleExportPDF = async () => {
    try {
      // 首先尝试查找页面元素
      let pages = document.querySelectorAll('.page-sheet') as NodeListOf<HTMLElement>

      // 如果没找到.page-sheet，尝试查找其他可能的容器
      if (!pages || pages.length === 0) {
        pages = document.querySelectorAll('[data-canvas]') as NodeListOf<HTMLElement>
      }

      // 如果还是没找到，尝试查找整个画布区域
      if (!pages || pages.length === 0) {
        pages = document.querySelectorAll('.canvas-container > div') as NodeListOf<HTMLElement>
      }

      if (!pages || pages.length === 0) {
        notification.error('未找到简历页面，请确保页面已加载完成')
        return
      }

      // 优化：降低scale从6到3，速度提升约4倍，质量仍然很好
      const scale = 3
      const totalPages = pages.length

      notification.info(`正在生成PDF (共${totalPages}页)...`)

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      })

      for (let i = 0; i < totalPages; i++) {
        const page = pages[i]

        // 显示进度
        if (totalPages > 1) {
          notification.info(`正在处理第 ${i + 1}/${totalPages} 页...`)
        }

        // 优化：减少不必要的延迟
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 50))
        }

        // 优化html2canvas配置
        const canvas = await html2canvas(page, {
          scale,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: false,
          foreignObjectRendering: false,
          imageTimeout: 15000, // 减少超时时间
          removeContainer: false,
          width: page.offsetWidth,
          height: page.offsetHeight,
          scrollX: 0,
          scrollY: 0,
          x: 0,
          y: 0,
        })

        // 优化：使用JPEG格式，质量0.95，文件更小，速度更快
        const imgData = canvas.toDataURL('image/jpeg', 0.95)

        if (i > 0) {
          pdf.addPage()
        }

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
      }

      const filename = `resume-${Date.now()}.pdf`
      pdf.save(filename)
      notification.success('PDF 导出成功！')
    } catch (error) {
      notification.error('PDF 导出失败')
      console.error('PDF export error:', error)
    }
  }

  // 案例预览模式下的极简toolbar - 仅图标
  if (previewExampleInfo) {
    return (
      <div
        style={{
          height: isMobile ? '44px' : '48px',
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '0 12px' : '0 16px',
          gap: isMobile ? '4px' : '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          minWidth: '200px',
          maxWidth: '300px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* 返回首页 */}
        <IconButton icon={<Home size={16} />} tooltip="返回" onClick={() => navigate('/')} />

        {/* 缩放控制 */}
        <IconButton icon={<ZoomOut size={16} />} tooltip="缩小" onClick={() => handleZoomOut()} />
        <IconButton icon={<ZoomIn size={16} />} tooltip="放大" onClick={() => handleZoomIn()} />

        {/* 全屏切换 */}
        <IconButton
          icon={isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          tooltip={isFullscreen ? '退出' : '全屏'}
          onClick={handleFullscreenToggle}
        />

        {/* 导出PDF */}
        <IconButton
          icon={<Download size={16} />}
          tooltip="导出"
          onClick={() => handleExportPDF()}
        />

        {/* 进入编辑 */}
        {previewExampleInfo.onEditDirectly && (
          <IconButton
            icon={<Edit3 size={16} />}
            tooltip="编辑"
            onClick={previewExampleInfo.onEditDirectly}
          />
        )}

        {/* 创建副本 */}
        {previewExampleInfo.onCreateCopy && (
          <IconButton
            icon={<Check size={16} />}
            tooltip="复制"
            onClick={previewExampleInfo.onCreateCopy}
          />
        )}
      </div>
    )
  }

  // 预览模式下的极简toolbar - 仅图标
  if (mode === 'preview') {
    return (
      <div
        style={{
          height: isMobile ? '44px' : '48px',
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '0 12px' : '0 16px',
          gap: isMobile ? '4px' : '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          minWidth: '200px',
          maxWidth: '300px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* 返回首页 */}
        {!isMobile && (
          <IconButton
            icon={<Home size={16} />}
            tooltip="返回"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('show-home-icon-modal'))
            }}
          />
        )}

        {/* 模式切换 */}
        <IconButton icon={<Edit3 size={16} />} tooltip="编辑" onClick={() => setMode('edit')} />

        {/* 缩放控制 */}
        <IconButton icon={<ZoomOut size={16} />} tooltip="缩小" onClick={() => handleZoomOut()} />
        <IconButton icon={<ZoomIn size={16} />} tooltip="放大" onClick={() => handleZoomIn()} />

        {/* 全屏切换 */}
        <IconButton
          icon={isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          tooltip={isFullscreen ? '退出' : '全屏'}
          onClick={handleFullscreenToggle}
        />

        {/* 导出PDF */}
        <IconButton
          icon={<Download size={16} />}
          tooltip="导出"
          onClick={() => handleExportPDF()}
        />
      </div>
    )
  }

  // 编辑模式下的完整toolbar
  return (
    <div
      style={{
        height: isMobile ? '52px' : '56px',
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '0 16px' : '0 20px',
        gap: isMobile ? '6px' : '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        minWidth: '380px',
        maxWidth: '520px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* 左侧区域 - 返回首页 */}
      {!isMobile && (
        <IconButton
          icon={<Home size={14} />}
          tooltip="返回首页"
          onClick={() => {
            // 触发全屏modal显示事件
            window.dispatchEvent(new CustomEvent('show-home-icon-modal'))
          }}
        />
      )}

      {/* 模式切换 - 仅图标 */}
      <div style={{ display: 'flex', gap: '2px' }}>
        <IconButton
          icon={<Edit3 size={14} />}
          tooltip="编辑"
          onClick={() => setMode('edit')}
          active={mode === 'edit'}
        />
        <IconButton
          icon={<Eye size={14} />}
          tooltip="预览模式"
          onClick={() => setMode('preview')}
          active={mode === ('preview' as typeof mode)}
        />
      </div>

      {/* 视口模式切换 */}
      <ViewportToggle />

      {/* 撤销/重做 */}
      <div style={{ display: 'flex', gap: '2px' }}>
        <IconButton
          icon={<Undo size={14} />}
          tooltip="撤销"
          onClick={() => undo()}
          disabled={!canUndo()}
        />
        <IconButton
          icon={<Redo size={14} />}
          tooltip="重做"
          onClick={() => redo()}
          disabled={!canRedo()}
        />
      </div>

      {/* 缩放控制 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <IconButton icon={<ZoomOut size={14} />} tooltip="缩小" onClick={() => handleZoomOut()} />
        <button
          onClick={handleZoomReset}
          title="重置缩放"
          style={{
            width: '26px',
            height: '26px',
            padding: '0',
            fontSize: '10px',
            fontWeight: '700',
            color: '#2d2d2d',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontVariantNumeric: 'tabular-nums',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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

      {/* 右侧区域 - 文档操作 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* 导入 */}
        <IconButton icon={<Upload size={14} />} tooltip="导入JSON" onClick={handleImportJSON} />

        {/* 导出 */}
        <IconButton
          icon={<Download size={14} />}
          tooltip="导出PDF(超高清)"
          onClick={() => handleExportPDF()}
        />

        {/* 保存 */}
        <IconButton icon={<Save size={14} />} tooltip="保存" onClick={handleSaveWithModal} />

        {/* 更多菜单 - 暂时注释掉 */}
        {/* <div style={{ position: 'relative' }}>
          <IconButton
            icon={<MoreVertical size={14} />}
            tooltip="更多"
            onClick={e => {
              e.stopPropagation()
              setShowMoreMenu(!showMoreMenu)
            }}
          />

          {showMoreMenu && (
            <Menu onClose={() => setShowMoreMenu(false)} align="right">
              <MenuItem
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('cvkit-show-save-as-dialog'))
                  setShowMoreMenu(false)
                }}
              >
                另存为...
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
        </div> */}
      </div>

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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>

      {/* 对话框 */}
      {showShortcutsHelp && <KeyboardShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />}
    </div>
  )
}

// 图标按钮
const IconButton: React.FC<{
  icon: React.ReactNode
  tooltip: string
  onClick: (e?: React.MouseEvent) => void
  disabled?: boolean
  active?: boolean
}> = ({ icon, tooltip, onClick, disabled = false, active = false }) => {
  const [hover, setHover] = React.useState(false)
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 })
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const handleMouseEnter = () => {
    setHover(true)
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      })
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHover(false)}
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: active
            ? 'rgba(0, 0, 0, 0.08)'
            : hover && !disabled
              ? 'rgba(0, 0, 0, 0.05)'
              : 'transparent',
          color: active ? '#1f2937' : disabled ? '#d0d0d0' : hover ? '#374151' : '#6b7280',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hover && !disabled ? 'scale(1.05)' : 'scale(1)',
          boxShadow: active
            ? '0 0 0 1px rgba(0, 0, 0, 0.1)'
            : hover && !disabled
              ? '0 2px 4px rgba(0, 0, 0, 0.1)'
              : 'none',
        }}
      >
        {icon}
      </button>

      {/* 自定义Tooltip - 使用Portal渲染到body */}
      {hover && tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translateX(-50%) translateY(-100%)',
            padding: '4px 8px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            fontSize: '12px',
            fontWeight: '500',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            zIndex: 10000,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {tooltip}
          {/* 小三角箭头 */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid rgba(0, 0, 0, 0.8)',
            }}
          />
        </div>
      )}
    </>
  )
}
