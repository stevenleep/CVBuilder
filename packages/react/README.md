# @lcedit/react

React 适配层for LCEdit 低代码平台。

## 功能特性

- 🪝 **Hooks** - 完整的 React Hooks 集成
- 🎯 **Contexts** - 状态管理和依赖注入
- 🎨 **Renderers** - React 组件渲染器
- 📦 **Components** - 开箱即用的 UI 组件

## 安装

```bash
pnpm add @lcedit/react @lcedit/core react react-dom
```

## 快速开始

```tsx
import { EditorProvider, useEditor } from '@lcedit/react'

function App() {
  return (
    <EditorProvider>
      <Editor />
    </EditorProvider>
  )
}

function Editor() {
  const { state, actions } = useEditor()
  
  return (
    <div>
      {/* 你的编辑器 UI */}
    </div>
  )
}
```

## Hooks

### useEditor
访问编辑器状态和操作。

```tsx
const { state, actions } = useEditor()
```

### useMaterials
访问物料注册表。

```tsx
const { materials, register, unregister } = useMaterials()
```

### useCommands
执行命令。

```tsx
const { execute, canExecute } = useCommands()
```

### useHistory
撤销/重做操作。

```tsx
const { undo, redo, canUndo, canRedo } = useHistory()
```

## Contexts

- `EditorContext` - 编辑器全局状态
- `ServiceContext` - 核心服务访问
- `ThemeContext` - 主题配置

## Renderers

- `ReactRenderer` - React 组件渲染器
- `PropertyRenderer` - 属性面板渲染器

## License

MIT

