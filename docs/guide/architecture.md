# 架构概览

## 系统架构

CVBuilder 采用模块化、可扩展的架构设计。

```
┌─────────────────────────────────────────────────────┐
│                   应用层 (App)                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │ 工具栏     │  │ 物料面板   │  │ 属性面板   │   │
│  └────────────┘  └────────────┘  └────────────┘   │
├─────────────────────────────────────────────────────┤
│                  编辑器层 (Editor)                   │
│  ┌────────────────────────────────────────────┐   │
│  │              画布 (Canvas)                  │   │
│  │  ┌──────────────────────────────────┐     │   │
│  │  │      渲染引擎 (Renderer)          │     │   │
│  │  └──────────────────────────────────┘     │   │
│  └────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│                   核心层 (Core)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │ 物料注册表 │  │ 事件总线   │  │ 插件管理器 │   │
│  └────────────┘  └────────────┘  └────────────┘   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │ 模板管理器 │  │ 主题系统   │  │ 依赖注入   │   │
│  └────────────┘  └────────────┘  └────────────┘   │
├─────────────────────────────────────────────────────┤
│                  状态管理 (Store)                    │
│  ┌────────────────────────────────────────────┐   │
│  │           Zustand + Immer                   │   │
│  └────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│                 持久化层 (Storage)                   │
│  ┌────────────────────────────────────────────┐   │
│  │              IndexedDB                      │   │
│  └────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 核心模块

### 1. 物料系统 (Material System)

物料是构成简历的基本单元，每个物料都遵循统一的协议。

**组成部分**:

- **物料定义** (`IMaterialDefinition`): 元数据、组件、属性配置
- **物料注册表** (`MaterialRegistry`): 管理所有物料
- **物料渲染器** (`Renderer`): 递归渲染物料树

**工作流程**:

```
注册物料 → 拖拽到画布 → 创建节点 → 渲染组件 → 编辑属性 → 更新视图
```

### 2. 状态管理 (State Management)

使用 Zustand + Immer 实现不可变状态管理。

**核心状态**:

```typescript
{
  pageSchema: NodeSchema        // 页面结构树
  selectedNodeIds: string[]     // 选中的节点
  clipboard: NodeSchema | null  // 剪贴板
  history: History              // 撤销/重做历史
  canvasConfig: CanvasConfig    // 画布配置
  mode: 'edit' | 'preview'      // 编辑/预览模式
}
```

### 3. 事件系统 (Event System)

基于发布-订阅模式的事件总线。

**核心事件**:

- `node:selected` - 节点被选中
- `node:updated` - 节点属性更新
- `node:deleted` - 节点被删除
- `template:saved` - 模板保存
- `theme:changed` - 主题变更

### 4. 插件系统 (Plugin System)

支持通过插件扩展编辑器功能。

**插件能力**:

- 注册自定义物料
- 添加命令和快捷键
- 注册 UI 面板
- 添加中间件
- 监听和发送事件

### 5. 依赖注入 (DI Container)

使用依赖注入容器管理服务生命周期。

**核心服务**:

```typescript
container.register(EVENT_BUS_TOKEN, () => new EventBus())
container.register(MATERIAL_REGISTRY_TOKEN, eventBus => new MaterialRegistry(eventBus))
container.register(
  PLUGIN_MANAGER_TOKEN,
  (registry, eventBus) => new PluginManager(registry, eventBus)
)
```

## 数据流

### 单向数据流

```
用户操作 → Action → State Update → View Render
   ↑                                      ↓
   └──────────── Event Feedback ─────────┘
```

### 详细流程

1. **用户操作** (例如：添加物料)

   ```
   拖拽物料 → DropZone → handleDrop
   ```

2. **状态更新**

   ```typescript
   useEditorStore.setState(draft => {
     draft.pageSchema.root.children.push(newNode)
     draft.selectedNodeIds = [newNode.id]
     draft.history.push(snapshot)
   })
   ```

3. **视图更新**

   ```
   State Change → Component Re-render → DOM Update
   ```

4. **事件通知**
   ```typescript
   eventBus.emit('node:added', { nodeId, materialType })
   ```

## 存储架构

### IndexedDB 存储

```
Database: cv-builder
  ├── Store: editor-state      (编辑器状态)
  ├── Store: templates         (组件模板)
  └── Store: resume-templates  (完整简历模板)
```

### 存储服务

```typescript
class IndexedDBService {
  async setItem(store, key, value)
  async getItem(store, key)
  async removeItem(store, key)
  async clear(store)
  async getAllKeys(store)
  async getAllValues(store)
}
```

## 渲染机制

### 递归渲染

```typescript
function Renderer({ schema }: { schema: NodeSchema }) {
  const material = useMaterial(schema.type)
  const Component = material.component

  return (
    <DraggableNode nodeId={schema.id}>
      <Component {...schema.props} style={schema.style}>
        {schema.children?.map(child => (
          <Renderer key={child.id} schema={child} />
        ))}
      </Component>
    </DraggableNode>
  )
}
```

### 性能优化

- **React.memo**: 防止不必要的重渲染
- **虚拟滚动**: 大量节点时使用虚拟列表
- **懒加载**: 物料组件按需加载
- **防抖节流**: 高频操作使用防抖/节流

## 主题系统

### 主题配置

```typescript
interface ITheme {
  name: string
  font: FontConfig // 字体配置
  color: ColorConfig // 颜色配置
  spacing: SpacingConfig // 间距配置
  layout: LayoutConfig // 布局配置
}
```

### 主题上下文

```typescript
<ThemeProvider>
  <App />
</ThemeProvider>

// 在组件中使用
const theme = useThemeConfig()
```

## 扩展性设计

### 1. 协议驱动

所有核心功能都基于接口定义：

- `IMaterialProtocol` - 物料协议
- `IPluginProtocol` - 插件协议
- `IEventProtocol` - 事件协议
- `IThemeProtocol` - 主题协议

### 2. 插件化

通过插件系统扩展功能：

```typescript
const plugin: IPlugin = {
  meta: { id, name, version },
  activate: context => {
    context.registerMaterial(customMaterial)
    context.registerCommand(customCommand)
  },
}
```

### 3. 依赖注入

松耦合的服务管理：

```typescript
const service = container.resolve(SERVICE_TOKEN)
```

## 技术栈

### 核心框架

- **React 18** - UI 框架
- **TypeScript** - 类型系统
- **Vite** - 构建工具

### 状态管理

- **Zustand** - 状态管理
- **Immer** - 不可变更新

### UI 交互

- **react-dnd** - 拖拽功能
- **lucide-react** - 图标库

### 数据持久化

- **IndexedDB** - 本地存储

### 代码质量

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型检查

## 最佳实践

### 1. 类型安全

所有接口和协议都有完整的 TypeScript 类型定义。

### 2. 不可变更新

使用 Immer 确保状态不可变性：

```typescript
setState(draft => {
  draft.property = newValue // 看起来是可变，实际是不可变
})
```

### 3. 事件解耦

组件间通过事件总线通信，避免直接依赖。

### 4. 依赖注入

服务通过 DI 容器管理，方便测试和替换。

### 5. 关注点分离

- 视图层只负责渲染
- 业务逻辑在 Store 中
- 核心功能在 Service 中

## 扩展阅读

- [物料开发指南](./material-development.md)
- [插件开发指南](./plugin-development.md)
- [API 参考](../api/editor-api.md)
