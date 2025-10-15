/**
 * 渲染引擎（增强版）
 *
 * 负责根据Schema渲染React组件树，支持生命周期和事件
 */

import React, { useEffect, useCallback, useState } from 'react'
import type { NodeSchema } from '@/types/material'
import { useMaterialRegistry, useEventBus } from '@/core'
import { SmartDropZone } from './SmartDropZone'
import { useDrag } from 'react-dnd'
import { DragItemTypes, NodeDragItem } from '@/editor/DndProvider'

import { NodeToolbar } from '@/editor/NodeToolbar'
import { SaveAsTemplateDialog } from '@/editor/SaveAsTemplateDialog'
import { useEditorStore } from '@store/editorStore'
import { findNode } from '@utils/schema'
import { templateManager } from '@/core/services/TemplateManager'
import { notification } from '@/utils/notification'

export interface RendererProps {
  /** 节点Schema */
  schema: NodeSchema
  /** 是否为编辑模式 */
  isEditMode?: boolean
  /** 节点点击回调 */
  onNodeClick?: (nodeId: string, event: React.MouseEvent) => void
  /** 节点悬停回调 */
  onNodeHover?: (nodeId: string | null) => void
  /** 选中的节点IDs */
  selectedNodeIds?: string[]
  /** 悬停的节点ID */
  hoveredNodeId?: string | null
}

/**
 * 渲染单个节点
 */
export const Renderer: React.FC<RendererProps> = ({
  schema,
  isEditMode = false,
  onNodeClick,
  onNodeHover,
  selectedNodeIds = [],
  hoveredNodeId = null,
}) => {
  const materialRegistry = useMaterialRegistry()
  const eventBus = useEventBus()
  const [showToolbar, setShowToolbar] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const { id, type, props = {}, style = {}, children = [], hidden } = schema

  // 获取编辑器操作方法
  const { duplicateNode, deleteNode, pageSchema, moveNodeUp, moveNodeDown, toggleNodeVisibility } =
    useEditorStore()

  // 获取物料定义（必须在所有Hooks之前）
  const materialDef = materialRegistry.get(type)

  // 所有Hooks必须在任何条件返回之前调用
  // 组件挂载生命周期
  useEffect(() => {
    if (materialDef?.lifecycle?.onMount) {
      const context = createMaterialContext(id, type, props, style, children, eventBus)
      materialDef.lifecycle.onMount(context)
    }

    return () => {
      if (materialDef?.lifecycle?.onUnmount) {
        const context = createMaterialContext(id, type, props, style, children, eventBus)
        materialDef.lifecycle.onUnmount(context)
      }
    }
  }, [id, type, materialDef, props, style, children, eventBus])

  // 属性更新生命周期
  const prevPropsRef = React.useRef(props)
  useEffect(() => {
    if (materialDef?.lifecycle?.onUpdate && prevPropsRef.current !== props) {
      const context = createMaterialContext(id, type, props, style, children, eventBus)
      materialDef.lifecycle.onUpdate(context, prevPropsRef.current)
      prevPropsRef.current = props
    }
  }, [props, id, type, materialDef, style, children, eventBus])

  // 编辑模式的包装器回调（必须在条件返回之前）
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isEditMode && onNodeClick) {
        e.stopPropagation()
        onNodeClick(id, e)
      }
    },
    [isEditMode, onNodeClick, id]
  )

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      if (isEditMode && onNodeHover) {
        // 阻止事件冒泡，确保只有最内层的组件显示hover状态
        e.stopPropagation()
        onNodeHover(id)
      }
    },
    [isEditMode, onNodeHover, id]
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      if (isEditMode && onNodeHover) {
        e.stopPropagation()
        onNodeHover(null)
      }
    },
    [isEditMode, onNodeHover, id]
  )

  // 判断是否选中或悬停（需要在 useEffect 之前定义）
  const isSelected = selectedNodeIds.includes(id)
  const isHovered = hoveredNodeId === id && !isSelected

  // 选中时显示工具栏，而不是hover时
  useEffect(() => {
    if (isSelected) {
      setShowToolbar(true)
    } else {
      setShowToolbar(false)
    }
  }, [isSelected])

  // 拖拽支持
  const [{ isDragging }, drag] = useDrag<NodeDragItem, void, { isDragging: boolean }>(
    () => ({
      type: DragItemTypes.NODE,
      item: { type: DragItemTypes.NODE, nodeId: id, nodeType: type },
      canDrag: () => isEditMode && materialDef?.capabilities?.moveable !== false,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, type, isEditMode, materialDef]
  )

  // 双击处理
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isEditMode && materialDef?.onDoubleClick) {
        e.stopPropagation()
        const context = createMaterialContext(id, type, props, style, children, eventBus)
        materialDef.onDoubleClick(context)
      }
    },
    [isEditMode, materialDef, id, type, props, style, children, eventBus]
  )

  // 操作处理
  const handleCopy = useCallback(() => {
    duplicateNode(id)
    setShowToolbar(false)
  }, [id, duplicateNode])

  const handleDelete = useCallback(() => {
    deleteNode(id)
    setShowToolbar(false)
  }, [id, deleteNode])

  const handleMoveUp = useCallback(() => {
    moveNodeUp(id)
  }, [id, moveNodeUp])

  const handleMoveDown = useCallback(() => {
    moveNodeDown(id)
  }, [id, moveNodeDown])

  const handleSaveAsTemplate = useCallback(() => {
    setShowSaveDialog(true)
  }, [])

  const handleSaveTemplate = useCallback(
    (name: string, description: string, category: string) => {
      const node = findNode(pageSchema.root, id)
      if (node) {
        templateManager.saveAsTemplate(node, name, description, category)
        notification.success('模板保存成功！')
      }
    },
    [id, pageSchema]
  )

  const handleCustomAction = useCallback(
    (actionId: string) => {
      const action = materialDef?.actions?.find(a => a.id === actionId)
      if (action) {
        const context = createMaterialContext(id, type, props, style, children, eventBus)
        action.execute(context)
      }
      setShowToolbar(false)
    },
    [materialDef, id, type, props, style, children, eventBus]
  )

  // 现在可以进行条件返回
  // 如果节点隐藏，在预览模式下不渲染，编辑模式下半透明显示
  if (hidden && !isEditMode) {
    return null
  }

  if (!materialDef) {
    return (
      <div
        style={{
          padding: '16px',
          border: '2px dashed #ff4d4f',
          color: '#ff4d4f',
          borderRadius: '4px',
        }}
      >
        错误：未找到物料类型 "{type}"
      </div>
    )
  }

  const { component: Component, meta } = materialDef

  // 合并默认属性和用户属性
  const mergedProps = {
    ...(meta?.defaultProps || {}),
    ...props,
  }
  const mergedStyle = {
    ...(meta?.defaultStyle || {}),
    ...(materialDef.defaultStyle || {}),
    ...style,
  }

  // 渲染子节点
  const renderChildren = () => {
    if (!meta.isContainer || children.length === 0) {
      return null
    }

    return children.map(childSchema => (
      <Renderer
        key={childSchema.id}
        schema={childSchema}
        isEditMode={isEditMode}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
        selectedNodeIds={selectedNodeIds}
        hoveredNodeId={hoveredNodeId}
      />
    ))
  }

  // 使用自定义渲染器（如果提供）
  if (materialDef.customRenderer) {
    return materialDef.customRenderer({
      ...mergedProps,
      style: mergedStyle,
      children: renderChildren(),
    })
  }

  // 如果节点被隐藏，完全不渲染
  if (hidden) {
    return null
  }

  // 编辑模式包装器样式 - 简洁版
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    opacity: isDragging ? 0.3 : 1,
    ...(isEditMode && isSelected
      ? {
          outline: '1px dashed #2d2d2d',
          outlineOffset: '-1px',
          borderRadius: '3px',
        }
      : {}),
    ...(isEditMode && isHovered
      ? {
          outline: '1px dashed #d0d0d0',
          outlineOffset: '-1px',
          borderRadius: '2px',
        }
      : {}),
    transition: 'all 0.15s ease',
    cursor: isEditMode ? (isDragging ? 'grabbing' : 'pointer') : 'default',
  }

  const wrapperProps = isEditMode
    ? {
        'data-node-id': id,
        'data-node-type': type,
        'data-material-type': type,
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      }
    : {
        'data-material-type': type,
      }

  const content = (
    <div
      ref={isEditMode ? drag : null}
      {...wrapperProps}
      onDoubleClick={handleDoubleClick}
      style={wrapperStyle}
    >
      {/* 选中指示器 - 选中时显示物料名称 */}
      {isEditMode && isSelected && !isDragging && (
        <div
          style={{
            position: 'absolute',
            top: '-24px',
            left: '0',
            fontSize: '10px',
            backgroundColor: '#2d2d2d',
            color: 'white',
            padding: '3px 8px',
            borderRadius: '3px',
            fontWeight: '600',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          {materialDef.meta.title}
        </div>
      )}

      {/* 浮动工具栏 - 单选时显示，多选时不显示（使用底部工具栏） */}
      {isEditMode && isSelected && showToolbar && !isDragging && selectedNodeIds.length === 1 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 0,
            zIndex: 10000,
            pointerEvents: 'none',
          }}
        >
          <div
            data-toolbar-id={id}
            style={{
              position: 'relative',
              pointerEvents: 'auto',
            }}
          >
            <NodeToolbar
              nodeId={id}
              actions={materialDef.actions}
              isHidden={hidden}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onSaveAsTemplate={handleSaveAsTemplate}
              onToggleVisibility={type !== 'Page' ? () => toggleNodeVisibility(id) : undefined}
              onCustomAction={handleCustomAction}
              capabilities={materialDef.capabilities}
            />
          </div>
        </div>
      )}

      {/* 保存为模板对话框 */}
      {showSaveDialog && (
        <SaveAsTemplateDialog
          onSave={handleSaveTemplate}
          onClose={() => setShowSaveDialog(false)}
        />
      )}

      <Component {...mergedProps} style={mergedStyle}>
        {renderChildren()}
      </Component>
    </div>
  )

  // 在编辑模式下，使用智能拖放区域
  if (isEditMode) {
    return (
      <SmartDropZone nodeId={id} isContainer={meta.isContainer}>
        {content}
      </SmartDropZone>
    )
  }

  return content
}

/**
 * 创建物料上下文
 */
function createMaterialContext(
  nodeId: string,
  materialType: string,
  props: any,
  style: any,
  children: any[],
  eventBus: any
): any {
  return {
    nodeId,
    materialType,
    props,
    style,
    childrenIds: children.map((c: any) => c.id),
    emit: (event: string, data?: any) => {
      eventBus.emit(`material:${nodeId}:${event}`, data)
    },
    on: (event: string, handler: (data: any) => void) => {
      return eventBus.on(`material:${nodeId}:${event}`, handler)
    },
    getEditorAPI: () => {
      const store = useEditorStore.getState()
      return {
        selectNode: (id: string) => store.selectNode(id),
        updateNodeProps: (id: string, props: any) => store.updateNodeProps(id, props),
        updateNodeStyle: (id: string, style: any) => store.updateNodeStyle(id, style),
        deleteNode: (id: string) => store.deleteNode(id),
        addNode: (materialType: string, parentId?: string) => {
          store.addNode(materialType, parentId)
          return ''
        },
        findNode: (id: string) => {
          return findNode(store.pageSchema.root, id)
        },
      }
    },
  }
}
