/**
 * 快捷导出按钮 - 悬浮在编辑器右下角
 *
 * 提供一键导出PDF功能，解决用户找不到导出按钮的问题
 */

import React, { useState } from 'react'
import { Download, FileDown, FileJson } from 'lucide-react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { notification } from '@/utils/notification'
import { useEditorStore } from '@/store/editorStore'
import { useTheme } from '@/core/context/ThemeContext'

export const QuickExportButton: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [hover, setHover] = useState(false)
  const { pageSchema, canvasConfig } = useEditorStore()
  const { theme } = useTheme()

  const handleExportPDF = async () => {
    setIsExporting(true)
    setShowMenu(false)

    try {
      let pages = document.querySelectorAll('.page-sheet') as NodeListOf<HTMLElement>

      if (!pages || pages.length === 0) {
        pages = document.querySelectorAll('[data-canvas]') as NodeListOf<HTMLElement>
      }

      if (!pages || pages.length === 0) {
        pages = document.querySelectorAll('.canvas-container > div') as NodeListOf<HTMLElement>
      }

      if (!pages || pages.length === 0) {
        notification.error('未找到简历页面，请确保页面已加载完成')
        setIsExporting(false)
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

      // 记录导出时间（用于备份提醒）
      localStorage.setItem('cv-builder-last-export-time', Date.now().toString())
    } catch (error) {
      notification.error('PDF 导出失败')
      console.error('PDF export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportJSON = () => {
    setShowMenu(false)

    const exportData = {
      pageSchema,
      theme,
      canvasConfig,
      exportTime: new Date().toISOString(),
      version: '1.0.0',
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `resume-backup-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    notification.success('JSON 导出成功！')

    // 记录导出时间
    localStorage.setItem('cv-builder-last-export-time', Date.now().toString())
  }

  return (
    <div className="cvkit-quick-export-container">
      {/* 导出菜单 */}
      {showMenu && (
        <div className="cvkit-quick-export-menu">
          <MenuItem
            icon={<FileDown size={18} />}
            label="导出 PDF"
            description="高清打印版"
            onClick={handleExportPDF}
          />

          <div className="cvkit-menu-divider" />

          <MenuItem
            icon={<FileJson size={18} />}
            label="导出 JSON"
            description="数据备份"
            onClick={handleExportJSON}
          />
        </div>
      )}

      {/* 主按钮 */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        disabled={isExporting}
        className="cvkit-quick-export-button"
        title="快速导出"
      >
        <Download size={28} strokeWidth={2.5} />
      </button>

      {/* 标签提示 */}
      {hover && !showMenu && !isExporting && (
        <div className="cvkit-quick-export-tooltip">
          导出简历
          <div className="cvkit-quick-export-tooltip-arrow" />
        </div>
      )}

      {/* 点击外部关闭菜单 */}
      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        />
      )}
    </div>
  )
}

// 菜单项
const MenuItem: React.FC<{
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
}> = ({ icon, label, description, onClick }) => {
  return (
    <button onClick={onClick} className="cvkit-menu-item">
      <div className="cvkit-menu-item-icon">{icon}</div>

      <div className="cvkit-menu-item-content">
        <div className="cvkit-menu-item-label">{label}</div>
        <div className="cvkit-menu-item-description">{description}</div>
      </div>
    </button>
  )
}
