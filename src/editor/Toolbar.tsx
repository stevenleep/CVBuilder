/**
 * 工具栏组件 - 现代扁平化设计
 */

import React, { useState } from 'react'
import { useEditorStore } from '@store/editorStore'
import { notification } from '@/utils/notification'
import {
  Undo,
  Redo,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  FileText,
  Library,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'
import { SaveResumeTemplateDialog } from './SaveResumeTemplateDialog'
import { ResumeTemplatesPanel } from './ResumeTemplatesPanel'
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp'
import { resumeTemplateManager } from '@/core/services/ResumeTemplateManager'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useTheme } from '@/core/context/ThemeContext'

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
    saveToStorage,
    pageSchema,
  } = useEditorStore()

  const { theme, setTheme } = useTheme()

  const [showSaveResumeDialog, setShowSaveResumeDialog] = useState(false)
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false)
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)

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

  const handleExportPNG = async () => {
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
          scale: 4,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
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
          1.0
        )
      } else {
        // 多页：打包为zip
        const JSZip = (await import('jszip')).default
        const zip = new JSZip()

        // 逐页截图并添加到zip
        for (let i = 0; i < pageElements.length; i++) {
          const canvas = await html2canvas(pageElements[i], {
            scale: 4,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
          })

          const blob = await new Promise<Blob | null>(resolve => {
            canvas.toBlob(resolve, 'image/png', 1.0)
          })

          if (blob) {
            zip.file(`resume-page-${i + 1}.png`, blob)
          }
        }

        // 生成并下载zip
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

  const handleExportPDF = async () => {
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

        // 截图当前页面
        const canvas = await html2canvas(pageElement, {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
        })

        const imgData = canvas.toDataURL('image/jpeg', 0.95)

        // 如果不是第一页，添加新页
        if (i > 0) {
          pdf.addPage()
        }

        // 添加图片到当前页，保持原始比例
        const imgWidth = a4Width
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // 如果图片高度超过A4，按比例缩小
        if (imgHeight > a4Height) {
          const scale = a4Height / imgHeight
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth * scale, a4Height)
        } else {
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
        }
      }

      // 保存 PDF
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

  const handleSaveResumeTemplate = (name: string, description: string) => {
    resumeTemplateManager.saveAsTemplate(pageSchema, name, description)
    notification.success('简历模板保存成功！')
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
      <div
        style={{
          fontWeight: '600',
          fontSize: '15px',
          color: '#000',
          marginRight: '16px',
        }}
      >
        Resume
      </div>

      {/* 历史操作 */}
      <IconButton icon={<Undo size={16} />} tooltip="撤销" onClick={undo} disabled={!canUndo()} />
      <IconButton icon={<Redo size={16} />} tooltip="重做" onClick={redo} disabled={!canRedo()} />

      <Divider />

      {/* 视图控制 */}
      <IconButton icon={<ZoomOut size={16} />} tooltip="缩小" onClick={handleZoomOut} />
      <span
        style={{
          minWidth: '48px',
          fontSize: '13px',
          color: '#666',
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {Math.round(canvasConfig.scale * 100)}%
      </span>
      <IconButton icon={<ZoomIn size={16} />} tooltip="放大" onClick={handleZoomIn} />

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
        icon={<HelpCircle size={16} />}
        tooltip="快捷键帮助 (?)"
        onClick={() => setShowShortcutsHelp(true)}
      />

      <Divider />

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
            <MenuButton onClick={handleExportPNG}>导出高清图片</MenuButton>
            <MenuButton onClick={handleExportPDF}>导出 PDF</MenuButton>
            {/* <MenuButton onClick={handlePrintPDF}>浏览器打印</MenuButton> */}
            <div
              style={{
                height: '1px',
                backgroundColor: '#e5e5e5',
                margin: '4px 0',
              }}
            />
            <MenuButton onClick={handleExportJSON}>导出数据</MenuButton>
            <MenuButton onClick={handleImportJSON}>导入数据</MenuButton>
          </div>
        )}
      </div>

      <PrimaryButton onClick={() => saveToStorage()}>保存</PrimaryButton>

      {/* 快捷键帮助 */}
      {showShortcutsHelp && <KeyboardShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />}

      {/* 简历模板库面板 */}
      {showTemplatesPanel && <ResumeTemplatesPanel onClose={() => setShowTemplatesPanel(false)} />}

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
  <div
    style={{
      width: '1px',
      height: '16px',
      backgroundColor: '#f1f1f1',
      margin: '0 4px',
    }}
  />
)

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
        height: '36px',
        padding: '0 16px',
        border: 'none',
        background: hover ? '#f5f5f5' : 'transparent',
        fontSize: '13px',
        color: '#333',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.1s',
      }}
    >
      {children}
    </button>
  )
}
