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
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 999,
      }}
    >
      {/* 导出菜单 */}
      {showMenu && (
        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            right: 0,
            width: '200px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            animation: 'menuSlideIn 0.2s ease-out',
          }}
        >
          <style>
            {`
              @keyframes menuSlideIn {
                from {
                  opacity: 0;
                  transform: translateY(8px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>

          <MenuItem
            icon={<FileDown size={18} />}
            label="导出 PDF"
            description="高清打印版"
            onClick={handleExportPDF}
          />

          <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '0 12px' }} />

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
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isExporting ? '#9ca3af' : '#2d2d2d',
          color: '#fff',
          cursor: isExporting ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow:
            hover && !isExporting
              ? '0 12px 32px rgba(45, 45, 45, 0.4), 0 4px 12px rgba(45, 45, 45, 0.3)'
              : '0 8px 24px rgba(45, 45, 45, 0.3), 0 2px 8px rgba(45, 45, 45, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hover && !isExporting ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
          animation: isExporting ? 'pulse 1.5s ease-in-out infinite' : 'none',
        }}
        title="快速导出"
      >
        <Download size={28} strokeWidth={2.5} />
      </button>

      {/* 标签提示 */}
      {hover && !showMenu && !isExporting && (
        <div
          style={{
            position: 'absolute',
            bottom: '76px',
            right: '8px',
            padding: '8px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '600',
            borderRadius: '8px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          导出简历
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: '24px',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(0, 0, 0, 0.85)',
            }}
          />
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

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
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        padding: '14px 16px',
        border: 'none',
        backgroundColor: hover ? '#f8f9fa' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.2s',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: hover ? '#2d2d2d' : '#f0f0f0',
          color: hover ? '#fff' : '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#2d2d2d',
            marginBottom: '2px',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#999',
          }}
        >
          {description}
        </div>
      </div>
    </button>
  )
}
