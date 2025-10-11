/**
 * 工具栏组件 - 现代扁平化设计
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
  HelpCircle,
  ChevronDown,
  Home,
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
import { generateThumbnail } from '@/utils/thumbnailGenerator'

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
    pageSchema,
    currentResumeId,
  } = useEditorStore()

  const { theme, setTheme } = useTheme()

  const [showSaveMenu, setShowSaveMenu] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false)
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false)
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
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

  const handleExportJSON = () => {
    const state = useEditorStore.getState()

    // 导出完整数据，包含主题配置
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
    setShowExportMenu(false)
    notification.success('JSON 导出成功！')
  }

  const handleImportJSON = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        // 检查数据格式
        if (!data.pageSchema) {
          notification.error('无效的数据格式')
          return
        }

        // 导入页面数据
        useEditorStore.setState({
          pageSchema: data.pageSchema,
          selectedNodeIds: [],
        })

        // 导入主题配置（如果有）
        if (data.theme) {
          setTheme(data.theme)
        }

        // 导入画布配置（如果有）
        if (data.canvasConfig) {
          useEditorStore.setState({
            canvasConfig: data.canvasConfig,
          })
        }

        notification.success('导入成功！')
        setShowExportMenu(false)
      } catch (error) {
        console.error('Import error:', error)
        notification.error('导入失败，请检查文件格式')
      }
    }

    input.click()
  }

  const handleExportWithOptions = async (options: ExportOptions) => {
    setShowExportPreview(false)
    
    if (options.format === 'json') {
      handleExportJSON()
      return
    }

    if (options.format === 'png') {
      await handleExportPNG(options.scale, options.quality)
      return
    }

    if (options.format === 'pdf') {
      await handleExportPDF(options.scale, options.quality)
      return
    }
  }

  const handleExportPNG = async (scale = 4, quality = 0.98) => {
    try {
      // 切换到预览模式
      const originalMode = mode
      const originalScale = canvasConfig.scale

      if (mode !== 'preview') {
        setMode('preview')
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // 重置缩放为100%以确保正确导出
      if (canvasConfig.scale !== 1) {
        updateCanvasConfig({ scale: 1 })
        await new Promise(resolve => setTimeout(resolve, 300))
      }

      // 获取所有页面元素
      const pageElements = document.querySelectorAll('.page-sheet') as NodeListOf<HTMLElement>
      if (pageElements.length === 0) {
        notification.error('未找到页面元素')
        return
      }

      notification.info(`正在生成 ${pageElements.length} 张高清图片，请稍候...`)

      // 如果只有一页，直接导出PNG
      if (pageElements.length === 1) {
        const canvas = await html2canvas(pageElements[0], {
          scale,
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          logging: false,
          imageTimeout: 0,
          removeContainer: false,
          foreignObjectRendering: false,
          onclone: clonedDoc => {
            const noprint = clonedDoc.querySelectorAll('[data-no-print]')
            noprint.forEach(el => el.remove())
          },
        })

        canvas.toBlob(
          blob => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = `resume-${Date.now()}.png`
              link.click()
              URL.revokeObjectURL(url)
              notification.success('图片导出成功！')
            }
          },
          'image/png',
          quality / 100
        )
      } else {
        // 多页：打包为zip
        const JSZip = (await import('jszip')).default
        const zip = new JSZip()

        for (let i = 0; i < pageElements.length; i++) {
          const canvas = await html2canvas(pageElements[i], {
            scale,
            useCORS: true,
            allowTaint: false,
            backgroundColor: null,
            logging: false,
            imageTimeout: 0,
            removeContainer: false,
            foreignObjectRendering: false,
            onclone: clonedDoc => {
              const noprint = clonedDoc.querySelectorAll('[data-no-print]')
              noprint.forEach(el => el.remove())
            },
          })

          const blob = await new Promise<Blob | null>(resolve => {
            canvas.toBlob(resolve, 'image/png', quality / 100)
          })

          if (blob) {
            zip.file(`resume-page-${i + 1}.png`, blob)
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const url = URL.createObjectURL(zipBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `resume-${Date.now()}.zip`
        link.click()
        URL.revokeObjectURL(url)

        notification.success(`已导出 ${pageElements.length} 张图片（ZIP格式）！`)
      }

      // 恢复原始模式和缩放
      if (originalMode !== mode) {
        setMode(originalMode)
      }
      if (originalScale !== canvasConfig.scale) {
        updateCanvasConfig({ scale: originalScale })
      }

      setShowExportMenu(false)
    } catch (error) {
      notification.error('图片导出失败')
      console.error('PNG export error:', error)
    }
  }

  const handleExportPDF = async (scale = 3, quality = 0.98) => {
    try {
      // 切换到预览模式
      const originalMode = mode
      const originalScale = canvasConfig.scale

      if (mode !== 'preview') {
        setMode('preview')
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // 重置缩放为100%以确保正确导出
      if (canvasConfig.scale !== 1) {
        updateCanvasConfig({ scale: 1 })
        await new Promise(resolve => setTimeout(resolve, 300))
      }

      // 获取所有页面元素
      const pageElements = document.querySelectorAll('.page-sheet') as NodeListOf<HTMLElement>
      if (pageElements.length === 0) {
        notification.error('未找到页面元素')
        return
      }

      notification.info(`正在生成 ${pageElements.length} 页 PDF，请稍候...`)

      // 创建 PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      })

      // A4 尺寸
      const a4Width = 210
      const a4Height = 297

      // 逐页截图并添加到PDF
      for (let i = 0; i < pageElements.length; i++) {
        const pageElement = pageElements[i]

        const canvas = await html2canvas(pageElement, {
          scale,
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          logging: false,
          imageTimeout: 0,
          removeContainer: false,
          foreignObjectRendering: false,
          onclone: clonedDoc => {
            const noprint = clonedDoc.querySelectorAll('[data-no-print]')
            noprint.forEach(el => el.remove())
          },
        })

        const imgData = canvas.toDataURL('image/jpeg', quality / 100)

        if (i > 0) {
          pdf.addPage()
        }

        const imgWidth = a4Width
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        if (imgHeight > a4Height) {
          const scale = a4Height / imgHeight
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth * scale, a4Height)
        } else {
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
        }
      }

      pdf.save(`resume-${Date.now()}.pdf`)

      // 恢复原始模式和缩放
      if (originalMode !== mode) {
        setMode(originalMode)
      }
      if (originalScale !== canvasConfig.scale) {
        updateCanvasConfig({ scale: originalScale })
      }

      setShowExportMenu(false)
      notification.success(`PDF 导出成功！共 ${pageElements.length} 页`)
    } catch (error) {
      notification.error('PDF 导出失败')
      console.error('PDF export error:', error)
    }
  }

  // const handlePrintPDF = () => {
  //   const originalMode = mode

  //   // 切换到预览模式
  //   if (mode !== 'preview') {
  //     setMode('preview')
  //   }

  //   setShowExportMenu(false)

  //   // 延迟一下让模式切换完成
  //   setTimeout(() => {
  //     // 使用浏览器打印功能（最高质量的PDF导出）
  //     window.print()

  //     // 打印对话框关闭后恢复模式
  //     setTimeout(() => {
  //       if (originalMode !== mode) {
  //         setMode(originalMode)
  //       }
  //     }, 100)
  //   }, 200)

  //   notification.info('请在打印对话框中选择"另存为PDF"')
  // }

  // 生成缩略图
  const generateResumeThumbnail = async (resumeId: string): Promise<void> => {
    try {
      // 查找页面元素
      const pageElement = document.querySelector('.page-sheet') as HTMLElement
      if (!pageElement) {
        console.warn('未找到页面元素，跳过缩略图生成')
        return
      }

      // 生成缩略图
      const thumbnail = await generateThumbnail(pageElement, {
        width: 300,
        height: 400,
        quality: 0.85,
        scale: 2,
      })

      // 保存缩略图
      await indexedDBService.setItem(STORES.THUMBNAILS, `resume-${resumeId}`, thumbnail)
    } catch (error) {
      console.error('生成缩略图失败:', error)
      // 不阻塞保存流程
    }
  }

  // 保存简历（更新/新建）
  const handleSave = async (name?: string, description?: string) => {
    try {
      if (currentResumeId) {
        // 更新现有简历
        const existing = await indexedDBService.getItem(STORES.RESUMES, currentResumeId)
        if (existing) {
          const updated = {
            ...existing,
            schema: pageSchema,
            updatedAt: new Date().toISOString(),
          }
          await indexedDBService.setItem(STORES.RESUMES, currentResumeId, updated)
          
          // 生成缩略图（异步，不阻塞）
          generateResumeThumbnail(currentResumeId)
          
          notification.success('简历已更新！')

          // 触发简历列表刷新事件
          window.dispatchEvent(new CustomEvent('cvkit-resume-updated'))
        }
      } else {
        // 新建简历 - 需要名称
        if (!name) {
          setShowSaveDialog(true)
          return
        }

        const newId = nanoid()
        const resumeData = {
          id: newId,
          name,
          description: description || '',
          schema: pageSchema,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        await indexedDBService.setItem(STORES.RESUMES, newId, resumeData)
        useEditorStore.getState().setCurrentResumeId(newId)
        
        // 生成缩略图（异步，不阻塞）
        generateResumeThumbnail(newId)
        
        notification.success('简历已保存！')

        // 更新URL为带ID的形式
        window.history.replaceState(null, '', `/editor/${newId}`)

        // 触发简历列表刷新事件
        window.dispatchEvent(new CustomEvent('cvkit-resume-updated'))
      }
    } catch (error) {
      notification.error('保存失败')
      console.error('Save error:', error)
    }
  }

  // 另存为（复制一份新的）
  const handleSaveAs = async (name: string, description: string) => {
    try {
      const newId = nanoid()
      const resumeData = {
        id: newId,
        name,
        description,
        schema: pageSchema,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await indexedDBService.setItem(STORES.RESUMES, newId, resumeData)
      useEditorStore.getState().setCurrentResumeId(newId)
      
      // 生成缩略图（异步，不阻塞）
      generateResumeThumbnail(newId)
      
      notification.success('已另存为新简历！')

      // 更新URL
      window.history.replaceState(null, '', `/editor/${newId}`)

      // 触发简历列表刷新事件
      window.dispatchEvent(new CustomEvent('cvkit-resume-updated'))
    } catch (error) {
      notification.error('另存为失败')
      console.error('Save as error:', error)
    }
  }

  // 保存为模板
  const handleSaveAsTemplate = async (name: string, description: string) => {
    try {
      const templateId = nanoid()
      const templateData = {
        id: templateId,
        name,
        description,
        schema: pageSchema,
        category: 'custom',
        createdAt: new Date().toISOString(),
      }

      await indexedDBService.setItem(STORES.RESUME_TEMPLATES, templateId, templateData)
      
      // 生成缩略图（异步，不阻塞）
      try {
        const pageElement = document.querySelector('.page-sheet') as HTMLElement
        if (pageElement) {
          const thumbnail = await generateThumbnail(pageElement, {
            width: 300,
            height: 400,
            quality: 0.85,
            scale: 2,
          })
          await indexedDBService.setItem(STORES.THUMBNAILS, `template-${templateId}`, thumbnail)
        }
      } catch (err) {
        console.error('生成模板缩略图失败:', err)
      }
      
      notification.success('已保存为模板！')
    } catch (error) {
      notification.error('保存模板失败')
      console.error('Save template error:', error)
    }
  }

  return (
    <div
      style={{
        height: '50px',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '10px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      {/* 品牌Logo */}
      {/* <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '16px' }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#2d2d2d" />
          <path d="M12 10h12v2H12zm0 6h12v2H12zm0 6h8v2h-8z" fill="white" />
        </svg>
        <div
          style={{
            fontSize: '17px',
            fontWeight: '700',
            color: '#2d2d2d',
            letterSpacing: '0.3px',
          }}
        >
          CVKit
        </div>
      </div> */}

      {/* 返回首页 */}
      <IconButton icon={<Home size={16} />} tooltip="返回首页" onClick={() => navigate('/')} />

      <Divider />

      {/* 历史操作组 */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <IconButton
          icon={<Undo size={16} />}
          tooltip="撤销 (Ctrl+Z)"
          onClick={undo}
          disabled={!canUndo()}
        />
        <IconButton
          icon={<Redo size={16} />}
          tooltip="重做 (Ctrl+Shift+Z)"
          onClick={redo}
          disabled={!canRedo()}
        />
      </div>

      <Divider />

      {/* 模式切换组 */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          backgroundColor: '#f8f9fa',
          padding: '3px',
          borderRadius: '6px',
        }}
      >
        <ModeButton
          icon={<Edit3 size={15} />}
          label="编辑"
          active={mode === 'edit'}
          onClick={() => setMode('edit')}
        />
        <ModeButton
          icon={<Eye size={15} />}
          label="预览"
          active={mode === 'preview'}
          onClick={() => setMode('preview')}
        />
      </div>

      <Divider />

      {/* 视图控制组 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <IconButton icon={<ZoomOut size={15} />} tooltip="缩小" onClick={handleZoomOut} />
        <span
          style={{
            minWidth: '50px',
            fontSize: '12px',
            color: '#666',
            textAlign: 'center',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: '600',
          }}
        >
          {Math.round(canvasConfig.scale * 100)}%
        </span>
        <IconButton icon={<ZoomIn size={15} />} tooltip="放大" onClick={handleZoomIn} />
      </div>

      <div style={{ flex: 1 }} />

      {/* 自动保存状态 */}
      <AutoSaveIndicator />

      <Divider />

      <IconButton
        icon={<HelpCircle size={16} />}
        tooltip="快捷键帮助 (?)"
        onClick={() => setShowShortcutsHelp(true)}
      />

      <Divider />

      {/* 导出菜单 */}
      <div style={{ position: 'relative' }}>
        <TextButton
          onClick={() => setShowExportMenu(!showExportMenu)}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          导出
          <ChevronDown size={14} />
        </TextButton>

          {showExportMenu && (
          <div
            style={{
              position: 'absolute',
              top: '36px',
              right: 0,
              backgroundColor: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minWidth: '180px',
              zIndex: 1000,
            }}
          >
            <MenuButton onClick={() => {
              setShowExportPreview(true)
              setShowExportMenu(false)
            }}>
              导出简历...
            </MenuButton>
            <div
              style={{
                height: '1px',
                backgroundColor: '#e5e5e5',
                margin: '4px 0',
              }}
            />
            <MenuButton onClick={handleImportJSON}>导入数据</MenuButton>
          </div>
        )}

        {/* 导出预览对话框 */}
        {showExportPreview && (
          <ExportPreviewDialog
            onExport={handleExportWithOptions}
            onClose={() => setShowExportPreview(false)}
          />
        )}
      </div>

      {/* 保存菜单 */}
      <div style={{ position: 'relative' }}>
        <TextButton
          onClick={() => setShowSaveMenu(!showSaveMenu)}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          保存
          <ChevronDown size={14} />
        </TextButton>

        {/* 保存下拉菜单 */}
        {showSaveMenu && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              minWidth: '200px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              border: '1px solid #e8e8e8',
              padding: '6px',
              zIndex: 1000,
            }}
          >
            <MenuButton
              onClick={() => {
                handleSave()
                setShowSaveMenu(false)
              }}
            >
              {currentResumeId ? '保存' : '保存简历'}
            </MenuButton>
            <MenuButton
              onClick={() => {
                setShowSaveAsDialog(true)
                setShowSaveMenu(false)
              }}
            >
              另存为...
            </MenuButton>
            <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '6px 0' }} />
            <MenuButton
              onClick={() => {
                setShowSaveTemplateDialog(true)
                setShowSaveMenu(false)
              }}
            >
              保存为模板
            </MenuButton>
          </div>
        )}
      </div>

      {/* 快捷键帮助 */}
      {showShortcutsHelp && <KeyboardShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />}

      {/* 保存简历对话框（仅新建时需要输入名称） */}
      {showSaveDialog && (
        <SaveResumeDialog
          onSave={(name, description) => {
            handleSave(name, description)
            setShowSaveDialog(false)
          }}
          onClose={() => setShowSaveDialog(false)}
        />
      )}

      {/* 另存为对话框 */}
      {showSaveAsDialog && (
        <SaveResumeDialog
          onSave={(name, description) => {
            handleSaveAs(name, description)
            setShowSaveAsDialog(false)
          }}
          onClose={() => setShowSaveAsDialog(false)}
        />
      )}

      {/* 保存为模板对话框 */}
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
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: active ? '#f0f0f0' : hover && !disabled ? '#f8f9fa' : 'transparent',
        color: disabled ? '#d0d0d0' : active ? '#2d2d2d' : hover ? '#2d2d2d' : '#666',
        transition: 'all 0.12s',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
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
  style?: React.CSSProperties
}> = ({ onClick, children, style }) => {
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
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// 主按钮

// 分隔线
const Divider = () => (
  <div
    style={{
      width: '1px',
      height: '20px',
      backgroundColor: '#e8e8e8',
      margin: '0 4px',
    }}
  />
)

// 模式切换按钮
const ModeButton: React.FC<{
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: active ? '#fff' : 'transparent',
        color: active ? '#2d2d2d' : '#999',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        transition: 'all 0.12s',
        boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// 菜单按钮
const MenuButton: React.FC<{
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
        height: '38px',
        padding: '0 16px',
        border: 'none',
        background: hover ? '#f8f9fa' : 'transparent',
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
