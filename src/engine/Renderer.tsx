/**
 * 渲染引擎（增强版）
 *
 * 负责根据Schema渲染React组件树，支持生命周期和事件
 */

import React, { useEffect, useCallback, useState } from "react";
import type { NodeSchema } from "@/types/material";
import { useMaterialRegistry, useEventBus } from "@/core";
import { DropZone } from "./DropZone";
import { useDrag } from "react-dnd";
import { DragItemTypes, NodeDragItem } from "@/editor/DndProvider";

import { NodeToolbar } from "@/editor/NodeToolbar";
import { SaveAsTemplateDialog } from "@/editor/SaveAsTemplateDialog";
import { useEditorStore } from "@store/editorStore";
import { findNode } from "@utils/schema";
import { templateManager } from "@/core/services/TemplateManager";

export interface RendererProps {
  /** 节点Schema */
  schema: NodeSchema;
  /** 是否为编辑模式 */
  isEditMode?: boolean;
  /** 节点点击回调 */
  onNodeClick?: (nodeId: string, event: React.MouseEvent) => void;
  /** 节点悬停回调 */
  onNodeHover?: (nodeId: string | null) => void;
  /** 选中的节点IDs */
  selectedNodeIds?: string[];
  /** 悬停的节点ID */
  hoveredNodeId?: string | null;
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
  const materialRegistry = useMaterialRegistry();
  const eventBus = useEventBus();
  const [showToolbar, setShowToolbar] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const { id, type, props = {}, style = {}, children = [], hidden } = schema;

  // 获取编辑器操作方法
  const { duplicateNode, deleteNode, pageSchema } = useEditorStore();

  // 获取物料定义（必须在所有Hooks之前）
  const materialDef = materialRegistry.get(type);

  // 所有Hooks必须在任何条件返回之前调用
  // 组件挂载生命周期
  useEffect(() => {
    if (materialDef?.lifecycle?.onMount) {
      const context = createMaterialContext(
        id,
        type,
        props,
        style,
        children,
        eventBus
      );
      materialDef.lifecycle.onMount(context);
    }

    return () => {
      if (materialDef?.lifecycle?.onUnmount) {
        const context = createMaterialContext(
          id,
          type,
          props,
          style,
          children,
          eventBus
        );
        materialDef.lifecycle.onUnmount(context);
      }
    };
  }, [id, type, materialDef, props, style, children, eventBus]);

  // 属性更新生命周期
  const prevPropsRef = React.useRef(props);
  useEffect(() => {
    if (materialDef?.lifecycle?.onUpdate && prevPropsRef.current !== props) {
      const context = createMaterialContext(
        id,
        type,
        props,
        style,
        children,
        eventBus
      );
      materialDef.lifecycle.onUpdate(context, prevPropsRef.current);
      prevPropsRef.current = props;
    }
  }, [props, id, type, materialDef, style, children, eventBus]);

  // 编辑模式的包装器回调（必须在条件返回之前）
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isEditMode && onNodeClick) {
        e.stopPropagation();
        onNodeClick(id, e);
      }
    },
    [isEditMode, onNodeClick, id]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      if (isEditMode && onNodeHover) {
        // 阻止事件冒泡，确保只有最内层的组件显示工具栏
        e.stopPropagation();
        onNodeHover(id);
        setShowToolbar(true);
      }
    },
    [isEditMode, onNodeHover, id]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      if (isEditMode && onNodeHover) {
        e.stopPropagation();
        // 使用延迟隐藏，给用户时间移动到工具栏上
        setTimeout(() => {
          // 检查鼠标是否在工具栏上，如果不在才隐藏
          const toolbarElement = document.querySelector(
            `[data-toolbar-id="${id}"]`
          );
          if (!toolbarElement || !toolbarElement.matches(":hover")) {
            onNodeHover(null);
            setShowToolbar(false);
          }
        }, 100);
      }
    },
    [isEditMode, onNodeHover, id]
  );

  // 拖拽支持
  const [{ isDragging }, drag] = useDrag<
    NodeDragItem,
    void,
    { isDragging: boolean }
  >(
    () => ({
      type: DragItemTypes.NODE,
      item: { type: DragItemTypes.NODE, nodeId: id, nodeType: type },
      canDrag: () =>
        isEditMode && materialDef?.capabilities?.moveable !== false,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, type, isEditMode, materialDef]
  );

  // 现在可以进行条件返回
  // 如果节点隐藏，在预览模式下不渲染，编辑模式下半透明显示
  if (hidden && !isEditMode) {
    return null;
  }

  if (!materialDef) {
    console.error(`[Renderer] 未找到物料类型: ${type}`);
    return (
      <div
        style={{
          padding: "16px",
          border: "2px dashed #ff4d4f",
          color: "#ff4d4f",
          borderRadius: "4px",
        }}
      >
        错误：未找到物料类型 "{type}"
      </div>
    );
  }

  const { component: Component, meta } = materialDef;

  // 合并默认属性和用户属性
  const mergedProps = {
    ...(meta?.defaultProps || {}),
    ...props,
  };
  const mergedStyle = {
    ...(meta?.defaultStyle || {}),
    ...(materialDef.defaultStyle || {}),
    ...style,
  };

  // 渲染子节点
  const renderChildren = () => {
    if (!meta.isContainer || children.length === 0) {
      return null;
    }

    return children.map((childSchema) => (
      <Renderer
        key={childSchema.id}
        schema={childSchema}
        isEditMode={isEditMode}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
        selectedNodeIds={selectedNodeIds}
        hoveredNodeId={hoveredNodeId}
      />
    ));
  };

  // 使用自定义渲染器（如果提供）
  if (materialDef.customRenderer) {
    return materialDef.customRenderer({
      ...mergedProps,
      style: mergedStyle,
      children: renderChildren(),
    });
  }

  // 判断是否选中或悬停
  const isSelected = selectedNodeIds.includes(id);
  const isHovered = hoveredNodeId === id && !isSelected;

  // 编辑模式包装器样式
  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    opacity: isDragging ? 0.3 : hidden ? 0.3 : 1,
    ...(isEditMode && isSelected
      ? {
          outline: "1.5px solid #3b82f6",
          outlineOffset: "0px",
          borderRadius: "3px",
        }
      : {}),
    ...(isEditMode && isHovered
      ? {
          outline: "1px solid #d0d0d0",
          outlineOffset: "0px",
          borderRadius: "3px",
          backgroundColor: "rgba(0, 0, 0, 0.01)",
        }
      : {}),
    ...(hidden && isEditMode
      ? {
          filter: "grayscale(0.5)",
        }
      : {}),
    transition: "all 0.12s ease",
    cursor: isEditMode ? (isDragging ? "grabbing" : "pointer") : "default",
    // 增加点击区域
    minHeight: isEditMode ? "20px" : "auto",
  };

  const wrapperProps = isEditMode
    ? {
        "data-node-id": id,
        "data-node-type": type,
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      }
    : {};

  // 双击处理
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isEditMode && materialDef.onDoubleClick) {
        e.stopPropagation();
        const context = createMaterialContext(
          id,
          type,
          props,
          style,
          children,
          eventBus
        );
        materialDef.onDoubleClick(context);
      }
    },
    [isEditMode, materialDef, id, type, props, style, children, eventBus]
  );

  // 获取操作方法
  const { moveNodeUp, moveNodeDown } = useEditorStore();

  // 操作处理
  const handleCopy = useCallback(() => {
    duplicateNode(id);
    setShowToolbar(false);
  }, [id, duplicateNode]);

  const handleDelete = useCallback(() => {
    deleteNode(id);
    setShowToolbar(false);
  }, [id, deleteNode]);

  const handleMoveUp = useCallback(() => {
    moveNodeUp(id);
  }, [id, moveNodeUp]);

  const handleMoveDown = useCallback(() => {
    moveNodeDown(id);
  }, [id, moveNodeDown]);

  const handleSaveAsTemplate = useCallback(() => {
    setShowSaveDialog(true);
  }, []);

  const handleSaveTemplate = useCallback(
    (name: string, description: string, category: string) => {
      const node = findNode(pageSchema.root, id);
      if (node) {
        templateManager.saveAsTemplate(node, name, description, category);
        alert("模板保存成功！");
      }
    },
    [id, pageSchema]
  );

  const handleCustomAction = useCallback(
    (actionId: string) => {
      const action = materialDef.actions?.find((a) => a.id === actionId);
      if (action) {
        const context = createMaterialContext(
          id,
          type,
          props,
          style,
          children,
          eventBus
        );
        action.execute(context);
      }
      setShowToolbar(false);
    },
    [materialDef, id, type, props, style, children, eventBus]
  );

  const content = (
    <div
      ref={isEditMode ? drag : null}
      {...wrapperProps}
      onDoubleClick={handleDoubleClick}
      style={wrapperStyle}
    >
      {/* 选中指示器 - 只在工具栏hover时显示 */}
      {isEditMode && isSelected && !isDragging && showToolbar && (
        <div
          style={{
            position: "absolute",
            top: "-2px",
            left: "-2px",
            fontSize: "10px",
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "2px 8px",
            borderRadius: "3px",
            fontWeight: "500",
            zIndex: 1000,
            pointerEvents: "none",
            opacity: 0.95,
            boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
          }}
        >
          {materialDef.meta.title}
        </div>
      )}

      {/* 浮动工具栏 - 只在当前hover的组件上显示 */}
      {isEditMode && hoveredNodeId === id && showToolbar && !isDragging && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 0,
            zIndex: 10000,
            pointerEvents: "none",
          }}
        >
          <div
            data-toolbar-id={id}
            style={{
              position: "relative",
              pointerEvents: "auto",
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              setShowToolbar(true);
              onNodeHover?.(id);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              // 延迟隐藏，给用户时间
              setTimeout(() => {
                setShowToolbar(false);
                onNodeHover?.(null);
              }, 150);
            }}
          >
            <NodeToolbar
              nodeId={id}
              actions={materialDef.actions}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onSaveAsTemplate={handleSaveAsTemplate}
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
  );

  // 在编辑模式下，所有节点都支持before/after拖放
  if (isEditMode) {
    return (
      <>
        <DropZone nodeId={id} position="before">
          <div />
        </DropZone>

        {meta.isContainer ? (
          <DropZone nodeId={id} position="inside" isContainer>
            {content}
          </DropZone>
        ) : (
          content
        )}

        <DropZone nodeId={id} position="after">
          <div />
        </DropZone>
      </>
    );
  }

  return content;
};

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
  // 延迟导入避免循环依赖
  const getEditorStore = () => {
    // Use dynamic import to avoid 'require' lint error
    return import("@store/editorStore").then(({ useEditorStore }) => useEditorStore.getState());
  };

  return {
    nodeId,
    materialType,
    props,
    style,
    childrenIds: children.map((c: any) => c.id),
    emit: (event: string, data?: any) => {
      eventBus.emit(`material:${nodeId}:${event}`, data);
    },
    on: (event: string, handler: (data: any) => void) => {
      return eventBus.on(`material:${nodeId}:${event}`, handler);
    },
    getEditorAPI: () => {
      const store = getEditorStore();
      return {
        selectNode: (id: string) => store.selectNode(id),
        updateNodeProps: (id: string, props: any) =>
          store.updateNodeProps(id, props),
        updateNodeStyle: (id: string, style: any) =>
          store.updateNodeStyle(id, style),
        deleteNode: (id: string) => store.deleteNode(id),
        addNode: (materialType: string, parentId?: string) => {
          store.addNode(materialType, parentId);
          return "";
        },
        findNode: (id: string) => {
          // Use dynamic import to avoid require lint error
          return import("@utils/schema").then(({ findNode }) => {
            return findNode(store.pageSchema.root, id);
          });
        },
      };
    },
  };
}
