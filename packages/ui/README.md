# @lcedit/ui

LCEdit UI Component Library - 低代码编辑器的 UI 组件库

## 功能特性

- 🎨 **完整的编辑器 UI 组件**
- 🔧 **与 Core 层深度集成**
- ⚡ **高性能 React 组件**
- 🎯 **TypeScript 类型安全**
- 📦 **按需导入**

## 安装

```bash
pnpm add @lcedit/ui
```

## 使用

```tsx
import { Button, Panel, Toolbar, PropertyPanel } from '@lcedit/ui'
import '@lcedit/ui/styles'

function MyEditor() {
  return (
    <Panel title="编辑器">
      <Toolbar>
        <Button>保存</Button>
        <Button>预览</Button>
      </Toolbar>
      <PropertyPanel />
    </Panel>
  )
}
```

## 组件列表

### 基础组件
- `Button` - 按钮
- `Input` - 输入框
- `Select` - 选择器

### 布局组件
- `Panel` - 面板
- `Toolbar` - 工具栏
- `Sidebar` - 侧边栏

### 编辑器组件
- `PropertyPanel` - 属性面板
- `LayerPanel` - 图层面板
- `MaterialPanel` - 物料面板
- `Canvas` - 画布

## 开发

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm type-check
```

## License

MIT

