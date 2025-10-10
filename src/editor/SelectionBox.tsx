/**
 * 框选组件
 *
 * 支持鼠标拖拽框选多个物料
 */

import React, { useState, useEffect } from 'react'
import { useEditorStore } from '@store/editorStore'

interface SelectionBoxProps {
  containerRef: React.RefObject<HTMLDivElement>
}

interface BoxRect {
  left: number
  top: number
  width: number
  height: number
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({ containerRef }) => {
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [boxRect, setBoxRect] = useState<BoxRect | null>(null)

  const { selectNodes, mode } = useEditorStore()

  useEffect(() => {
    if (mode !== 'edit' || !containerRef.current) return

    const container = containerRef.current

    const handleMouseDown = (e: MouseEvent) => {
      // 只响应左键，且点击的是画布本身（不是子元素）
      if (e.button !== 0) return
      if ((e.target as HTMLElement).closest('[data-node-id]')) return

      // 如果按住了 Ctrl/Cmd，允许框选
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        const rect = container.getBoundingClientRect()
        const scrollLeft = container.scrollLeft
        const scrollTop = container.scrollTop

        setStartPos({
          x: e.clientX - rect.left + scrollLeft,
          y: e.clientY - rect.top + scrollTop,
        })
        setIsSelecting(true)
        e.preventDefault()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isSelecting) return

      const rect = container.getBoundingClientRect()
      const scrollLeft = container.scrollLeft
      const scrollTop = container.scrollTop

      // 计算选择框
      const left = Math.min(startPos.x, e.clientX - rect.left + scrollLeft)
      const top = Math.min(startPos.y, e.clientY - rect.top + scrollTop)
      const width = Math.abs(e.clientX - rect.left + scrollLeft - startPos.x)
      const height = Math.abs(e.clientY - rect.top + scrollTop - startPos.y)

      setBoxRect({ left, top, width, height })
    }

    const handleMouseUp = () => {
      if (!isSelecting) return

      // 收集选择框内的节点
      if (boxRect && boxRect.width > 5 && boxRect.height > 5) {
        const selectedIds: string[] = []
        const nodes = container.querySelectorAll('[data-node-id]')

        nodes.forEach(node => {
          const nodeRect = node.getBoundingClientRect()
          const containerRect = container.getBoundingClientRect()
          const scrollLeft = container.scrollLeft
          const scrollTop = container.scrollTop

          const nodeLeft = nodeRect.left - containerRect.left + scrollLeft
          const nodeTop = nodeRect.top - containerRect.top + scrollTop
          const nodeRight = nodeLeft + nodeRect.width
          const nodeBottom = nodeTop + nodeRect.height

          const boxRight = boxRect.left + boxRect.width
          const boxBottom = boxRect.top + boxRect.height

          // 检查是否相交
          if (
            nodeLeft < boxRight &&
            nodeRight > boxRect.left &&
            nodeTop < boxBottom &&
            nodeBottom > boxRect.top
          ) {
            const nodeId = node.getAttribute('data-node-id')
            const nodeType = node.getAttribute('data-node-type')
            if (nodeId && nodeType !== 'Page') {
              selectedIds.push(nodeId)
            }
          }
        })

        if (selectedIds.length > 0) {
          selectNodes(selectedIds)
        }
      }

      setIsSelecting(false)
      setBoxRect(null)
    }

    container.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isSelecting, startPos, boxRect, containerRef, selectNodes, mode])

  if (!isSelecting || !boxRect) return null

  return (
    <div
      style={{
        position: 'absolute',
        left: `${boxRect.left}px`,
        top: `${boxRect.top}px`,
        width: `${boxRect.width}px`,
        height: `${boxRect.height}px`,
        border: '2px solid #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointerEvents: 'none',
        zIndex: 10000,
      }}
    />
  )
}
