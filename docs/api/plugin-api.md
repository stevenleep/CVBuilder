# 插件 API

## PluginManager

插件管理器，负责插件的注册、激活和管理。

### 类型定义

```typescript
interface IPlugin {
  meta: IPluginMeta
  activate: (context: IPluginContext) => void | Promise<void>
  deactivate?: () => void | Promise<void>
}

interface IPluginMeta {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  dependencies?: string[]
}

interface IPluginContext {
  registerMaterial: (material: IMaterialDefinition) => void
  registerCommand: (command: ICommand) => void
  registerShortcut: (shortcut: IShortcut) => void
  registerPanel: (panel: IPanel) => void
  registerMiddleware: (middleware: IMiddleware) => void
  on: (event: string, handler: (data: any) => void) => () => void
  emit: (event: string, data?: any) => void
  getState: () => any
  setState: (updater: (state: any) => void) => void
}
```

### 方法

#### register

注册插件。

```typescript
register(plugin: IPlugin): void
```

**参数**:

- `plugin` - 插件定义对象

**示例**:

```typescript
import { pluginManager } from '@/core/services/PluginManager'

const myPlugin: IPlugin = {
  meta: {
    id: 'my-plugin',
    name: '我的插件',
    version: '1.0.0',
    description: '这是一个示例插件',
  },
  activate: async context => {
    console.log('插件激活')
  },
}

pluginManager.register(myPlugin)
```

#### activate

激活插件。

```typescript
activate(pluginId: string): Promise<void>
```

**参数**:

- `pluginId` - 插件 ID

**示例**:

```typescript
await pluginManager.activate('my-plugin')
```

#### deactivate

停用插件。

```typescript
deactivate(pluginId: string): Promise<void>
```

**参数**:

- `pluginId` - 插件 ID

**示例**:

```typescript
await pluginManager.deactivate('my-plugin')
```

#### getAll

获取所有插件。

```typescript
getAll(): IPlugin[]
```

**返回**:

- 所有已注册的插件数组

**示例**:

```typescript
const plugins = pluginManager.getAll()

plugins.forEach(plugin => {
  console.log(plugin.meta.name, plugin.meta.version)
})
```

#### getActive

获取已激活的插件。

```typescript
getActive(): IPlugin[]
```

**返回**:

- 所有已激活的插件数组

**示例**:

```typescript
const activePlugins = pluginManager.getActive()
console.log(`当前激活了 ${activePlugins.length} 个插件`)
```

#### isActive

检查插件是否激活。

```typescript
isActive(pluginId: string): boolean
```

**参数**:

- `pluginId` - 插件 ID

**返回**:

- 如果插件已激活返回 true

**示例**:

```typescript
if (pluginManager.isActive('my-plugin')) {
  console.log('插件已激活')
}
```

## 命令 API

### ICommand

```typescript
interface ICommand {
  id: string
  name: string
  description?: string
  icon?: string
  execute: (context: ICommandContext) => void | Promise<void>
  canExecute?: (context: ICommandContext) => boolean
}

interface ICommandContext {
  selectedNodeIds: string[]
  pageSchema: any
  editorAPI: any
}
```

### registerCommand

在插件的 `activate` 方法中注册命令。

```typescript
activate: async context => {
  context.registerCommand({
    id: 'my-command',
    name: '我的命令',
    description: '这是一个自定义命令',
    icon: '⚡',
    execute: async cmdContext => {
      const { selectedNodeIds, editorAPI } = cmdContext

      selectedNodeIds.forEach(nodeId => {
        editorAPI.updateNodeProps(nodeId, {
          highlight: true,
        })
      })
    },
    canExecute: cmdContext => {
      return cmdContext.selectedNodeIds.length > 0
    },
  })
}
```

### executeCommand

执行命令。

```typescript
executeCommand(commandId: string): Promise<void>
```

**示例**:

```typescript
await pluginManager.executeCommand('my-command')
```

### getCommands

获取所有命令。

```typescript
getCommands(): ICommand[]
```

**示例**:

```typescript
const commands = pluginManager.getCommands()

commands.forEach(cmd => {
  console.log(cmd.name, cmd.description)
})
```

## 快捷键 API

### IShortcut

```typescript
interface IShortcut {
  key: string
  commandId: string
  description?: string
  global?: boolean
}
```

### registerShortcut

注册快捷键。

```typescript
activate: async context => {
  // 先注册命令
  context.registerCommand({
    id: 'quick-action',
    name: '快速操作',
    execute: async () => {
      console.log('快速操作执行')
    },
  })

  // 注册快捷键
  context.registerShortcut({
    key: 'Ctrl+Shift+Q',
    commandId: 'quick-action',
    description: '快速操作',
    global: true,
  })
}
```

### getShortcuts

获取所有快捷键。

```typescript
getShortcuts(): IShortcut[]
```

### getCommandByShortcut

根据快捷键查找命令。

```typescript
getCommandByShortcut(key: string): string | undefined
```

## 面板 API

### IPanel

```typescript
interface IPanel {
  id: string
  title: string
  position: 'left' | 'right' | 'bottom' | 'float'
  component: React.ComponentType<any>
  defaultOpen?: boolean
  icon?: string
}
```

### registerPanel

注册面板。

```typescript
const MyPanelComponent: React.FC = () => {
  return (
    <div style={{ padding: '16px' }}>
      <h3>自定义面板</h3>
      <p>这里是面板内容</p>
    </div>
  )
}

activate: async (context) => {
  context.registerPanel({
    id: 'my-panel',
    title: '我的面板',
    position: 'right',
    component: MyPanelComponent,
    defaultOpen: false,
    icon: '🎨'
  })
}
```

### getPanels

获取所有面板。

```typescript
getPanels(): IPanel[]
```

### getPanel

获取指定面板。

```typescript
getPanel(panelId: string): IPanel | undefined
```

## 中间件 API

### IMiddleware

```typescript
interface IMiddleware {
  name: string
  handle: (context: IMiddlewareContext, next: () => void) => void
}

interface IMiddlewareContext {
  action: string
  payload: any
  state: any
  cancel?: boolean
}
```

### registerMiddleware

注册中间件。

```typescript
activate: async context => {
  // 日志中间件
  context.registerMiddleware({
    name: 'logger',
    handle: (mwContext, next) => {
      console.log('[Middleware]', mwContext.action, mwContext.payload)
      next()
    },
  })

  // 验证中间件
  context.registerMiddleware({
    name: 'validator',
    handle: (mwContext, next) => {
      if (mwContext.action === 'deleteNode') {
        const node = findNode(mwContext.state.pageSchema, mwContext.payload)

        if (node?.type === 'Page') {
          console.warn('不能删除页面节点')
          mwContext.cancel = true
          return
        }
      }

      next()
    },
  })
}
```

### runMiddlewares

执行中间件链。

```typescript
runMiddlewares(action: string, payload: unknown): Promise<boolean>
```

**返回**:

- 如果操作被取消返回 false，否则返回 true

**示例**:

```typescript
const canDelete = await pluginManager.runMiddlewares('deleteNode', nodeId)

if (canDelete) {
  // 执行删除操作
}
```

## 事件 API

### on

监听事件。

```typescript
on(event: string, handler: (data: any) => void): () => void
```

**返回**:

- 取消订阅的函数

**示例**:

```typescript
activate: async context => {
  // 监听节点选中事件
  const unsubscribe = context.on('node:selected', data => {
    console.log('节点被选中:', data.nodeId)
  })

  // 在停用时取消订阅
  return () => {
    unsubscribe()
  }
}
```

### emit

发送事件。

```typescript
emit(event: string, data?: any): void
```

**示例**:

```typescript
activate: async context => {
  context.emit('plugin:ready', {
    pluginId: 'my-plugin',
    timestamp: Date.now(),
  })
}
```

## 状态 API

### getState

获取编辑器状态。

```typescript
getState(): any
```

**示例**:

```typescript
activate: async context => {
  const state = context.getState()

  console.log('选中的节点:', state.selectedNodeIds)
  console.log('页面Schema:', state.pageSchema)
  console.log('画布配置:', state.canvasConfig)
}
```

### setState

更新编辑器状态。

```typescript
setState(updater: (state: any) => void): void
```

**参数**:

- `updater` - 状态更新函数（使用 Immer）

**示例**:

```typescript
activate: async context => {
  // 清空选中
  context.setState(draft => {
    draft.selectedNodeIds = []
  })

  // 设置缩放
  context.setState(draft => {
    draft.canvasConfig.scale = 1.5
  })
}
```

## 完整插件示例

```typescript
import { IPlugin } from '@/core/protocols/IPluginProtocol'

export const ExamplePlugin: IPlugin = {
  meta: {
    id: 'example-plugin',
    name: '示例插件',
    version: '1.0.0',
    description: '展示插件 API 的使用',
    author: 'Your Name'
  },

  activate: async (context) => {
    console.log('插件激活')

    // 1. 注册命令
    context.registerCommand({
      id: 'example-command',
      name: '示例命令',
      execute: async (cmdContext) => {
        const { selectedNodeIds, editorAPI } = cmdContext
        console.log('执行命令，选中节点数:', selectedNodeIds.length)
      }
    })

    // 2. 注册快捷键
    context.registerShortcut({
      key: 'Ctrl+Shift+E',
      commandId: 'example-command',
      description: '执行示例命令'
    })

    // 3. 注册面板
    const PanelComponent: React.FC = () => (
      <div style={{ padding: '16px' }}>
        <h3>示例面板</h3>
      </div>
    )

    context.registerPanel({
      id: 'example-panel',
      title: '示例面板',
      position: 'right',
      component: PanelComponent
    })

    // 4. 注册中间件
    context.registerMiddleware({
      name: 'example-middleware',
      handle: (mwContext, next) => {
        console.log('中间件拦截:', mwContext.action)
        next()
      }
    })

    // 5. 监听事件
    const unsubscribe = context.on('node:selected', (data) => {
      console.log('节点选中:', data)
    })

    // 6. 发送事件
    context.emit('plugin:initialized', {
      pluginId: 'example-plugin'
    })

    // 7. 访问状态
    const state = context.getState()
    console.log('当前状态:', state)

    // 返回清理函数
    return () => {
      unsubscribe()
      console.log('插件停用')
    }
  },

  deactivate: async () => {
    console.log('插件已停用')
  }
}

// 使用插件
import { pluginManager } from '@/core/services/PluginManager'

pluginManager.register(ExamplePlugin)
await pluginManager.activate('example-plugin')
```

## 相关文档

- [插件开发指南](../guide/plugin-development.md)
- [插件示例](../examples/plugin-examples.md)
- [编辑器 API](./editor-api.md)
