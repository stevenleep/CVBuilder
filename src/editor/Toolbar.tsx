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
} from 'lucide-react'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { indexedDBService, STORES } from '@/utils/indexedDB'
import { nanoid } from 'nanoid'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useTheme } from '@/core/context/ThemeContext'
import { useIsMobile } from '@/hooks/useMediaQuery'

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

  const handleSave = async (name?: string, description?: string) => {
    try {
      const state = useEditorStore.getState()
      const resumeId = currentResumeId || nanoid()

      if (!currentResumeId && !name) {
        // 如果没有当前简历ID且没有名称，使用默认名称
        // 继续保存逻辑
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

  const handleExportPDF = async () => {
    try {
      const pages = document.querySelectorAll('.page-sheet') as NodeListOf<HTMLElement>
      if (!pages || pages.length === 0) {
        notification.error('未找到简历页面')
        return
      }

      notification.info('正在生成PDF文件...')

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const scale = 2

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        const canvas = await html2canvas(page, {
          scale,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        })

        const imgData = canvas.toDataURL('image/jpeg', 0.9)

        if (i > 0) {
          pdf.addPage()
        }

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
      }

      pdf.save('resume.pdf')
      notification.success('PDF 导出成功！')
    } catch (error) {
      notification.error('PDF 导出失败')
      console.error('PDF export error:', error)
    }
  }

  // 预览模式且有示例信息时，显示特殊的 Toolbar
  if (previewExampleInfo) {
    return (
      <div
        style={{
          height: '64px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          minWidth: '600px',
          maxWidth: '800px',
        }}
      >
        {/* 左侧：返回 */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: 'transparent',
            color: '#666',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#f0f0f0'
            e.currentTarget.style.color = '#2d2d2d'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#666'
          }}
        >
          <Home size={14} />
          <span>返回</span>
        </button>

        {/* 中间：示例信息 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              padding: '4px 10px',
              backgroundColor: '#eff6ff',
              borderRadius: '5px',
              fontSize: '11px',
              fontWeight: '600',
              color: '#1e40af',
              border: '1px solid #dbeafe',
            }}
          >
            预览模式
          </div>
          <div
            style={{
              width: '1px',
              height: '14px',
              backgroundColor: '#e0e0e0',
            }}
          />
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#2d2d2d' }}>
            {previewExampleInfo.name}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#999',
              padding: '2px 8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontWeight: '500',
            }}
          >
            {previewExampleInfo.description}
          </div>
        </div>

        {/* 右侧：操作按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {previewExampleInfo.onEditDirectly && (
            <button
              onClick={previewExampleInfo.onEditDirectly}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                backgroundColor: 'white',
                color: '#666',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#fafafa'
                e.currentTarget.style.borderColor = '#d0d0d0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.borderColor = '#e0e0e0'
              }}
            >
              <Edit3 size={12} />
              <span>进入编辑</span>
            </button>
          )}
          {previewExampleInfo.onCreateCopy && (
            <button
              onClick={previewExampleInfo.onCreateCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 12px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#2d2d2d',
                color: 'white',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#1a1a1a'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#2d2d2d'
              }}
            >
              <Check size={12} />
              <span>创建副本</span>
            </button>
          )}
        </div>
      </div>
    )
  }

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
          tooltip="编辑模式"
          onClick={() => setMode('edit')}
          active={mode === 'edit'}
        />
        <IconButton
          icon={<Eye size={14} />}
          tooltip="预览模式"
          onClick={() => setMode('preview')}
          active={mode === 'preview'}
        />
      </div>

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
          tooltip="导出PDF"
          onClick={() => handleExportPDF()}
        />

        {/* 保存 */}
        <IconButton
          icon={<Save size={14} />}
          tooltip="保存"
          onClick={() => {
            if (!currentResumeId) {
              // 触发新简历对话框事件
              window.dispatchEvent(new CustomEvent('cvkit-show-new-resume-dialog'))
            } else {
              handleSave()
            }
          }}
        />

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
  )
}
