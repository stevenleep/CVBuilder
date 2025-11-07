/**
 * PropertyPanel 组件
 * 
 * 属性面板，用于编辑选中节点的属性
 */

import React, { useMemo } from 'react'
import { useEditor } from '@lcedit/react'
import type { EditorNode } from '@lcedit/core'
import { Panel } from './Panel'

export interface PropertyPanelProps {
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
  /** 自定义属性渲染器 */
  renderProperty?: (node: EditorNode, key: string, value: unknown) => React.ReactNode
}

/**
 * PropertyPanel 组件
 */
export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  className = '',
  style,
  renderProperty,
}) => {
  const { state, actions } = useEditor()
  
  // 获取选中的节点
  const selectedNodes = useMemo(() => {
    return state.selectedIds
      .map(id => state.nodes[id])
      .filter(Boolean)
  }, [state.selectedIds, state.nodes])
  
  const selectedNode = selectedNodes[0]
  
  // 处理属性值变更
  const handlePropertyChange = (key: string, value: unknown) => {
    if (!selectedNode) return
    actions.updateNode(selectedNode.id, {
      props: {
        ...selectedNode.props,
        [key]: value,
      },
    })
  }
  
  const baseClass = 'lcedit-property-panel'
  const classes = [baseClass, className].filter(Boolean).join(' ')
  
  // 没有选中节点
  if (!selectedNode) {
    return (
      <Panel title="属性" className={classes} style={style}>
        <div className={`${baseClass}__empty`}>
          请选择一个节点
        </div>
      </Panel>
    )
  }
  
  // 多选提示
  if (selectedNodes.length > 1) {
    return (
      <Panel title="属性" className={classes} style={style}>
        <div className={`${baseClass}__multi`}>
          已选中 {selectedNodes.length} 个节点
        </div>
      </Panel>
    )
  }
  
  return (
    <Panel title="属性" className={classes} style={style}>
      <div className={`${baseClass}__content`}>
        {/* 基本信息 */}
        <div className={`${baseClass}__section`}>
          <div className={`${baseClass}__section-title`}>基本信息</div>
          <div className={`${baseClass}__field`}>
            <label className={`${baseClass}__label`}>ID</label>
            <input
              type="text"
              className={`${baseClass}__input`}
              value={selectedNode.id}
              readOnly
              disabled
            />
          </div>
          <div className={`${baseClass}__field`}>
            <label className={`${baseClass}__label`}>类型</label>
            <input
              type="text"
              className={`${baseClass}__input`}
              value={selectedNode.type}
              readOnly
              disabled
            />
          </div>
        </div>
        
        {/* 属性 */}
        <div className={`${baseClass}__section`}>
          <div className={`${baseClass}__section-title`}>属性</div>
          {Object.entries(selectedNode.props).map(([key, value]) => (
            <div key={key} className={`${baseClass}__field`}>
              {renderProperty ? (
                renderProperty(selectedNode, key, value)
              ) : (
                <>
                  <label className={`${baseClass}__label`}>{key}</label>
                  <input
                    type="text"
                    className={`${baseClass}__input`}
                    value={String(value ?? '')}
                    onChange={(e) => handlePropertyChange(key, e.target.value)}
                  />
                </>
              )}
            </div>
          ))}
          {Object.keys(selectedNode.props).length === 0 && (
            <div className={`${baseClass}__empty-props`}>
              暂无属性
            </div>
          )}
        </div>
        
        {/* 位置和尺寸 */}
        <div className={`${baseClass}__section`}>
          <div className={`${baseClass}__section-title`}>位置和尺寸</div>
          <div className={`${baseClass}__field-group`}>
            <div className={`${baseClass}__field`}>
              <label className={`${baseClass}__label`}>X</label>
              <input
                type="number"
                className={`${baseClass}__input`}
                value={selectedNode.position.x}
                onChange={(e) => {
                  actions.updateNode(selectedNode.id, {
                    position: {
                      ...selectedNode.position,
                      x: Number(e.target.value),
                    },
                  })
                }}
              />
            </div>
            <div className={`${baseClass}__field`}>
              <label className={`${baseClass}__label`}>Y</label>
              <input
                type="number"
                className={`${baseClass}__input`}
                value={selectedNode.position.y}
                onChange={(e) => {
                  actions.updateNode(selectedNode.id, {
                    position: {
                      ...selectedNode.position,
                      y: Number(e.target.value),
                    },
                  })
                }}
              />
            </div>
          </div>
          <div className={`${baseClass}__field-group`}>
            <div className={`${baseClass}__field`}>
              <label className={`${baseClass}__label`}>宽度</label>
              <input
                type="number"
                className={`${baseClass}__input`}
                value={selectedNode.size.width}
                onChange={(e) => {
                  actions.updateNode(selectedNode.id, {
                    size: {
                      ...selectedNode.size,
                      width: Number(e.target.value),
                    },
                  })
                }}
              />
            </div>
            <div className={`${baseClass}__field`}>
              <label className={`${baseClass}__label`}>高度</label>
              <input
                type="number"
                className={`${baseClass}__input`}
                value={selectedNode.size.height}
                onChange={(e) => {
                  actions.updateNode(selectedNode.id, {
                    size: {
                      ...selectedNode.size,
                      height: Number(e.target.value),
                    },
                  })
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  )
}

PropertyPanel.displayName = 'PropertyPanel'

