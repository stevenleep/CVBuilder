/**
 * 简历缩略图生成工具
 * 
 * 用于生成简历和模板的预览缩略图
 */

import html2canvas from 'html2canvas'

export interface ThumbnailOptions {
  width?: number
  height?: number
  quality?: number
  scale?: number
}

/**
 * 生成简历缩略图
 */
export async function generateThumbnail(
  element: HTMLElement,
  options: ThumbnailOptions = {}
): Promise<string> {
  const {
    width = 300,
    height = 400,
    quality = 0.8,
    scale = 2,
  } = options

  try {
    // 使用 html2canvas 截图
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0,
      removeContainer: false,
      foreignObjectRendering: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      onclone: (clonedDoc) => {
        // 移除不需要导出的元素
        const noprint = clonedDoc.querySelectorAll('[data-no-print]')
        noprint.forEach(el => el.remove())
        
        // 移除选中状态的边框等
        const selected = clonedDoc.querySelectorAll('[data-selected]')
        selected.forEach(el => el.removeAttribute('data-selected'))
      },
    })

    // 创建临时 canvas 用于缩放
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = width
    tempCanvas.height = height
    const ctx = tempCanvas.getContext('2d')

    if (!ctx) {
      throw new Error('无法创建 Canvas 上下文')
    }

    // 计算缩放比例，保持宽高比
    const aspectRatio = canvas.width / canvas.height
    const targetAspectRatio = width / height

    let drawWidth = width
    let drawHeight = height
    let offsetX = 0
    let offsetY = 0

    if (aspectRatio > targetAspectRatio) {
      // 原图更宽，按宽度缩放
      drawHeight = width / aspectRatio
      offsetY = (height - drawHeight) / 2
    } else {
      // 原图更高，按高度缩放
      drawWidth = height * aspectRatio
      offsetX = (width - drawWidth) / 2
    }

    // 白色背景
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // 绘制缩略图
    ctx.drawImage(canvas, offsetX, offsetY, drawWidth, drawHeight)

    // 转换为 base64
    return tempCanvas.toDataURL('image/jpeg', quality)
  } catch (error) {
    console.error('生成缩略图失败:', error)
    throw error
  }
}

/**
 * 从 Schema 生成缩略图
 */
export async function generateThumbnailFromSchema(
  schema: any,
  containerId = 'thumbnail-generator-container'
): Promise<string> {
  // 创建临时容器
  const container = document.createElement('div')
  container.id = containerId
  container.style.cssText = `
    position: fixed;
    top: -10000px;
    left: -10000px;
    width: 794px;
    opacity: 0;
    pointer-events: none;
    z-index: -1;
  `
  document.body.appendChild(container)

  try {
    // 动态导入 Renderer
    const { Renderer } = await import('@/engine/Renderer')
    const React = await import('react')
    const ReactDOM = await import('react-dom/client')

    // 渲染简历到临时容器
    const root = ReactDOM.createRoot(container)
    
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(Renderer, {
          schema: schema.root || schema,
          isEditMode: false,
          onNodeClick: () => {},
          onNodeHover: () => {},
          selectedNodeIds: [],
          hoveredNodeId: null,
        })
      )
      
      // 等待渲染完成
      setTimeout(resolve, 500)
    })

    // 查找页面元素
    const pageElement = container.querySelector('.page-sheet') as HTMLElement
    if (!pageElement) {
      throw new Error('未找到页面元素')
    }

    // 生成缩略图
    const thumbnail = await generateThumbnail(pageElement, {
      width: 300,
      height: 400,
      quality: 0.85,
      scale: 2,
    })

    // 清理
    root.unmount()
    document.body.removeChild(container)

    return thumbnail
  } catch (error) {
    // 清理
    if (container.parentNode) {
      document.body.removeChild(container)
    }
    throw error
  }
}

/**
 * 批量生成缩略图
 */
export async function generateThumbnailsBatch(
  schemas: Array<{ id: string; schema: any }>,
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, string>> {
  const results = new Map<string, string>()

  for (let i = 0; i < schemas.length; i++) {
    const { id, schema } = schemas[i]
    
    try {
      const thumbnail = await generateThumbnailFromSchema(schema, `thumbnail-gen-${i}`)
      results.set(id, thumbnail)
    } catch (error) {
      console.error(`生成缩略图失败 (${id}):`, error)
    }

    onProgress?.(i + 1, schemas.length)
    
    // 避免阻塞主线程
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return results
}

