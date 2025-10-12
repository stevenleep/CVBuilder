/**
 * 拖拽提供者
 * 
 * 封装react-dnd的DndProvider
 */

import React from 'react'
import { DndProvider as ReactDndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const DndProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactDndProvider backend={HTML5Backend}>
      {children}
    </ReactDndProvider>
  )
}

/**
 * 拖拽项类型
 */
export const DragItemTypes = {
  MATERIAL: 'material',  // 从物料面板拖拽
  NODE: 'node',          // 页面中节点拖拽
  TEMPLATE: 'template',  // 从模板面板拖拽
} as const

/**
 * 拖拽项数据
 */
export interface MaterialDragItem {
  type: typeof DragItemTypes.MATERIAL
  materialType: string
}

export interface NodeDragItem {
  type: typeof DragItemTypes.NODE
  nodeId: string
  nodeType: string
}

export interface TemplateDragItem {
  type: typeof DragItemTypes.TEMPLATE
  templateSchema: any
  templateName: string
}

export type DragItem = MaterialDragItem | NodeDragItem | TemplateDragItem

