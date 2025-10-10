# 编辑器 API

## EditorStore

编辑器的核心状态管理。

### 类型定义

```typescript
interface EditorState {
  // 页面数据
  pageSchema: PageSchema

  // 选中状态
  selectedNodeIds: string[]

  // 剪贴板
  clipboard: NodeSchema | null

  // 历史记录
  history: {
    past: PageSchema[]
    future: PageSchema[]
  }

  // 画布配置
  canvasConfig: {
    scale: number
    showGrid: boolean
    snapToGrid: boolean
  }

  // 编辑模式
  mode: 'edit' | 'preview'
}
```

### 方法

#### selectNode

选中一个或多个节点。

```typescript
selectNode(nodeId: string, multi?: boolean): void
```

**参数**:

- `nodeId` - 要选中的节点 ID
- `multi` - 是否多选（按住 Cmd/Ctrl）

**示例**:

```typescript
const { selectNode } = useEditorStore()

// 单选
selectNode('node-1')

// 多选
selectNode('node-2', true)
```

#### updateNodeProps

更新节点属性。

```typescript
updateNodeProps(nodeId: string, props: Record<string, PropValue>): void
```

**参数**:

- `nodeId` - 节点 ID
- `props` - 要更新的属性对象

**示例**:

```typescript
const { updateNodeProps } = useEditorStore()

updateNodeProps('node-1', {
  name: '张三',
  age: '28',
  phone: '138-0000-0000',
})
```

#### addNode

添加新节点。

```typescript
addNode(materialType: string, parentId?: string, position?: 'before' | 'after' | 'inside'): string
```

**参数**:

- `materialType` - 物料类型
- `parentId` - 父节点 ID（可选）
- `position` - 插入位置（可选）

**返回**:

- 新节点的 ID

**示例**:

```typescript
const { addNode } = useEditorStore()

// 添加到根节点
const nodeId = addNode('PersonalInfo')

// 添加到指定父节点内部
const childId = addNode('EducationItem', 'section-1', 'inside')

// 添加到指定节点之后
const afterId = addNode('ExperienceItem', 'node-1', 'after')
```

#### deleteNode

删除节点。

```typescript
deleteNode(nodeId: string): void
```

**参数**:

- `nodeId` - 要删除的节点 ID

**示例**:

```typescript
const { deleteNode } = useEditorStore()

deleteNode('node-1')
```

#### duplicateNode

复制节点。

```typescript
duplicateNode(nodeId: string): string
```

**参数**:

- `nodeId` - 要复制的节点 ID

**返回**:

- 新节点的 ID

**示例**:

```typescript
const { duplicateNode } = useEditorStore()

const newNodeId = duplicateNode('node-1')
```

#### moveNode

移动节点。

```typescript
moveNode(nodeId: string, direction: 'up' | 'down'): void
```

**参数**:

- `nodeId` - 节点 ID
- `direction` - 移动方向

**示例**:

```typescript
const { moveNode } = useEditorStore()

moveNode('node-1', 'up')
moveNode('node-2', 'down')
```

#### moveNodeTo

移动节点到指定位置。

```typescript
moveNodeTo(nodeId: string, targetId: string, position: 'before' | 'after' | 'inside'): void
```

**参数**:

- `nodeId` - 要移动的节点 ID
- `targetId` - 目标节点 ID
- `position` - 相对位置

**示例**:

```typescript
const { moveNodeTo } = useEditorStore()

// 移动到目标节点之前
moveNodeTo('node-1', 'node-2', 'before')

// 移动到目标节点内部
moveNodeTo('node-1', 'section-1', 'inside')
```

#### copyNode

复制节点到剪贴板。

```typescript
copyNode(nodeId: string): void
```

**参数**:

- `nodeId` - 要复制的节点 ID

**示例**:

```typescript
const { copyNode } = useEditorStore()

copyNode('node-1')
```

#### cutNode

剪切节点到剪贴板。

```typescript
cutNode(nodeId: string): void
```

**参数**:

- `nodeId` - 要剪切的节点 ID

**示例**:

```typescript
const { cutNode } = useEditorStore()

cutNode('node-1')
```

#### pasteNode

从剪贴板粘贴节点。

```typescript
pasteNode(parentId?: string): string | null
```

**参数**:

- `parentId` - 父节点 ID（可选）

**返回**:

- 粘贴后的新节点 ID，如果剪贴板为空则返回 null

**示例**:

```typescript
const { pasteNode } = useEditorStore()

// 粘贴到根节点
const nodeId = pasteNode()

// 粘贴到指定父节点
const childId = pasteNode('section-1')
```

#### undo

撤销操作。

```typescript
undo(): void
```

**示例**:

```typescript
const { undo } = useEditorStore()

undo()
```

#### redo

重做操作。

```typescript
redo(): void
```

**示例**:

```typescript
const { redo } = useEditorStore()

redo()
```

#### canUndo

检查是否可以撤销。

```typescript
canUndo(): boolean
```

**返回**:

- 如果有可撤销的历史记录返回 true

**示例**:

```typescript
const { canUndo, undo } = useEditorStore()

if (canUndo()) {
  undo()
}
```

#### canRedo

检查是否可以重做。

```typescript
canRedo(): boolean
```

**返回**:

- 如果有可重做的历史记录返回 true

**示例**:

```typescript
const { canRedo, redo } = useEditorStore()

if (canRedo()) {
  redo()
}
```

#### setMode

设置编辑模式。

```typescript
setMode(mode: 'edit' | 'preview'): void
```

**参数**:

- `mode` - 编辑模式

**示例**:

```typescript
const { setMode } = useEditorStore()

// 切换到预览模式
setMode('preview')

// 切换到编辑模式
setMode('edit')
```

#### setScale

设置画布缩放比例。

```typescript
setScale(scale: number): void
```

**参数**:

- `scale` - 缩放比例 (0.1 - 2.0)

**示例**:

```typescript
const { setScale } = useEditorStore()

// 缩放到 150%
setScale(1.5)

// 重置到 100%
setScale(1.0)
```

#### saveToStorage

保存到本地存储。

```typescript
saveToStorage(): Promise<void>
```

**示例**:

```typescript
const { saveToStorage } = useEditorStore()

await saveToStorage()
```

#### loadFromStorage

从本地存储加载。

```typescript
loadFromStorage(): Promise<void>
```

**示例**:

```typescript
const { loadFromStorage } = useEditorStore()

await loadFromStorage()
```

#### clearAll

清空所有内容。

```typescript
clearAll(): void
```

**示例**:

```typescript
const { clearAll } = useEditorStore()

if (confirm('确定要清空所有内容吗？')) {
  clearAll()
}
```

## Hooks

### useEditorStore

访问编辑器状态。

```typescript
const {
  pageSchema,
  selectedNodeIds,
  clipboard,
  history,
  canvasConfig,
  mode,
  // ... 所有方法
} = useEditorStore()
```

### useEditorContext

访问编辑器上下文。

```typescript
const { eventBus, materialRegistry, pluginManager, config } = useEditorContext()
```

### useMaterial

获取物料定义。

```typescript
const materialDef = useMaterial('PersonalInfo')

if (materialDef) {
  const Component = materialDef.component
  const propsSchema = materialDef.propsSchema
}
```

## 工具函数

### findNode

查找节点。

```typescript
import { findNode } from '@/utils/schema'

const node = findNode(pageSchema.root, 'node-id')
```

### createNode

创建新节点。

```typescript
import { createNode } from '@/utils/schema'

const node = createNode('PersonalInfo', {
  name: '张三',
  phone: '138-0000-0000',
})
```

### updateNodeProps

更新节点属性（纯函数）。

```typescript
import { updateNodeProps } from '@/utils/schema'

const newSchema = updateNodeProps(pageSchema, 'node-id', {
  name: '李四',
})
```

### deleteNode

删除节点（纯函数）。

```typescript
import { deleteNode } from '@/utils/schema'

const newSchema = deleteNode(pageSchema, 'node-id')
```

## 完整示例

```typescript
import React from 'react'
import { useEditorStore } from '@/store/editorStore'
import { findNode } from '@/utils/schema'

function MyComponent() {
  const {
    pageSchema,
    selectedNodeIds,
    selectNode,
    updateNodeProps,
    addNode,
    deleteNode,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorStore()

  const handleAddPersonalInfo = () => {
    const nodeId = addNode('PersonalInfo')
    selectNode(nodeId)
  }

  const handleUpdateNode = (nodeId: string) => {
    updateNodeProps(nodeId, {
      name: '新名字',
      phone: '139-0000-0000'
    })
  }

  const handleDelete = (nodeId: string) => {
    if (confirm('确定删除吗？')) {
      deleteNode(nodeId)
    }
  }

  const selectedNode = selectedNodeIds.length > 0
    ? findNode(pageSchema.root, selectedNodeIds[0])
    : null

  return (
    <div>
      <button onClick={handleAddPersonalInfo}>添加个人信息</button>
      <button onClick={() => undo()} disabled={!canUndo()}>撤销</button>
      <button onClick={() => redo()} disabled={!canRedo()}>重做</button>

      {selectedNode && (
        <div>
          <h3>选中的节点: {selectedNode.type}</h3>
          <button onClick={() => handleUpdateNode(selectedNode.id)}>
            更新
          </button>
          <button onClick={() => handleDelete(selectedNode.id)}>
            删除
          </button>
        </div>
      )}
    </div>
  )
}
```

## 相关文档

- [物料 API](./material-api.md)
- [插件 API](./plugin-api.md)
- [事件 API](./event-api.md)
