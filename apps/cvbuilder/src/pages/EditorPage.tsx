/**
 * 编辑器页面 - 最小实现
 */

import { useEditor, useHistory } from '@lcedit/react'
import { Button, Panel, Toolbar, PropertyPanel } from '@lcedit/ui'
import '@lcedit/ui/styles'

export function EditorPage() {
  const { state, actions } = useEditor()
  const { canUndo, canRedo, undo, redo } = useHistory()

  // 添加文本节点
  const addTextNode = () => {
    const newNode = {
      id: `text-${Date.now()}`,
      type: 'text',
      props: {
        text: '新文本',
        fontSize: 16,
        color: '#000000',
      },
      position: { x: 100, y: 100 },
      size: { width: 200, height: 40 },
      children: [],
      parentId: null,
      style: {},
      locked: false,
      hidden: false,
      custom: {},
    }
    actions.addNode(newNode)
  }

  // 添加容器节点
  const addContainerNode = () => {
    const newNode = {
      id: `container-${Date.now()}`,
      type: 'container',
      props: {
        backgroundColor: '#f5f5f5',
        padding: 16,
      },
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      children: [],
      parentId: null,
      style: {},
      locked: false,
      hidden: false,
      custom: {},
    }
    actions.addNode(newNode)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f0f0' }}>
      {/* 顶部工具栏 */}
      <Toolbar align="space-between" style={{ background: '#fff', borderBottom: '1px solid #ddd' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" size="small" onClick={addTextNode}>
            添加文本
          </Button>
          <Button variant="primary" size="small" onClick={addContainerNode}>
            添加容器
          </Button>
          <Button 
            size="small" 
            disabled={!canUndo}
            onClick={() => undo()}
          >
            撤销
          </Button>
          <Button 
            size="small" 
            disabled={!canRedo}
            onClick={() => redo()}
          >
            重做
          </Button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            节点数: {Object.keys(state.nodes).length}
          </span>
          <Button 
            size="small"
            onClick={() => actions.setMode(state.mode === 'edit' ? 'preview' : 'edit')}
          >
            {state.mode === 'edit' ? '预览模式' : '编辑模式'}
          </Button>
        </div>
      </Toolbar>

      {/* 主内容区 */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左侧物料面板 */}
        <Panel
          title="物料库"
          style={{
            width: '240px',
            background: '#fff',
            borderRight: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '13px', color: '#666', margin: '0 0 8px 0' }}>基础组件</h3>
            <Button size="small" style={{ width: '100%' }} onClick={addTextNode}>
              📝 文本
            </Button>
            <Button size="small" style={{ width: '100%' }} onClick={addContainerNode}>
              📦 容器
            </Button>
          </div>
        </Panel>

        {/* 中间画布 */}
        <div style={{ flex: 1, overflow: 'auto', background: '#f9f9f9', padding: '24px' }}>
          <div
            style={{
              background: '#fff',
              minHeight: '800px',
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: '24px',
              position: 'relative',
            }}
          >
            {/* 空状态 */}
            {state.rootIds.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  color: '#999',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                <div style={{ fontSize: '18px', marginBottom: '8px' }}>画布为空</div>
                <div style={{ fontSize: '14px' }}>点击左侧物料或顶部按钮开始创建</div>
              </div>
            )}

            {/* 节点列表 */}
            {state.rootIds.map((nodeId) => {
              const node = state.nodes[nodeId]
              if (!node) return null

              const isSelected = state.selectedIds.includes(nodeId)

              return (
                <div
                  key={nodeId}
                  onClick={() => actions.selectNodes([nodeId])}
                  style={{
                    position: 'relative',
                    marginBottom: '16px',
                    padding: '16px',
                    border: isSelected ? '2px solid #1890ff' : '1px solid #e0e0e0',
                    borderRadius: '4px',
                    backgroundColor: (node.props.backgroundColor as string) || '#fff',
                    cursor: 'pointer',
                    minHeight: node.size.height,
                    transition: 'all 0.2s',
                  }}
                >
                  {/* 节点内容 */}
                  {node.type === 'text' && (
                    <div
                      style={{
                        fontSize: (node.props.fontSize as number) || 16,
                        color: (node.props.color as string) || '#000',
                      }}
                    >
                      {(node.props.text as string) || '文本内容'}
                    </div>
                  )}

                  {node.type === 'container' && (
                    <div style={{ minHeight: '100px', color: '#999' }}>
                      容器组件 (ID: {node.id})
                    </div>
                  )}

                  {/* 删除按钮 */}
                  {isSelected && (
                    <Button
                      size="small"
                      variant="danger"
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        actions.deleteNode(nodeId)
                      }}
                    >
                      删除
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 右侧属性面板 */}
        <div style={{ width: '280px', background: '#fff', borderLeft: '1px solid #ddd', overflow: 'auto' }}>
          <PropertyPanel />
        </div>
      </div>
    </div>
  )
}

