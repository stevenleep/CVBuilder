# 事件 API

CVBuilder 使用事件总线实现松耦合的组件间通信。

## EventBus

基于发布-订阅模式的事件总线。

### 类型定义

```typescript
interface IEventBus {
  emit(event: string, data?: any): void
  on(event: string, handler: (data: any) => void): IEventSubscription
  off(event: string, handler?: (data: any) => void): void
  once(event: string, handler: (data: any) => void): IEventSubscription
  clear(event?: string): void
}

interface IEventSubscription {
  unsubscribe(): void
}
```

## 使用方法

### 获取事件总线

```typescript
import { useEditorContext } from '@/core/context/EditorContext'

function MyComponent() {
  const { eventBus } = useEditorContext()

  // 使用 eventBus
}
```

### 发送事件

```typescript
// 发送不带数据的事件
eventBus.emit('node:selected')

// 发送带数据的事件
eventBus.emit('node:updated', {
  nodeId: 'node-1',
  props: { name: '张三' },
  timestamp: Date.now(),
})
```

### 监听事件

```typescript
// 持续监听
const subscription = eventBus.on('node:updated', data => {
  console.log('节点更新:', data.nodeId, data.props)
})

// 取消订阅
subscription.unsubscribe()
```

### 一次性监听

```typescript
// 只监听一次
eventBus.once('template:saved', data => {
  console.log('模板已保存:', data.templateId)
  // 这个处理函数只会执行一次
})
```

### 取消监听

```typescript
const handler = data => {
  console.log('收到事件:', data)
}

// 监听
eventBus.on('my:event', handler)

// 取消特定处理函数
eventBus.off('my:event', handler)

// 取消该事件的所有处理函数
eventBus.off('my:event')
```

### 清空事件

```typescript
// 清空特定事件的所有监听器
eventBus.clear('node:updated')

// 清空所有事件的所有监听器
eventBus.clear()
```

## 内置事件

### 节点事件

#### node:selected

节点被选中时触发。

**数据**:

```typescript
{
  nodeId: string
  nodeIds: string[]  // 所有选中的节点 ID
}
```

**示例**:

```typescript
eventBus.on('node:selected', data => {
  console.log('选中的节点:', data.nodeIds)
})
```

#### node:added

添加新节点时触发。

**数据**:

```typescript
{
  nodeId: string
  materialType: string
  parentId?: string
}
```

#### node:updated

节点属性更新时触发。

**数据**:

```typescript
{
  nodeId: string
  props: Record<string, any>
  oldProps: Record<string, any>
}
```

#### node:deleted

节点被删除时触发。

**数据**:

```typescript
{
  nodeId: string
  materialType: string
}
```

#### node:moved

节点位置改变时触发。

**数据**:

```typescript
{
  nodeId: string
  direction: 'up' | 'down'
  oldIndex: number
  newIndex: number
}
```

#### node:duplicated

节点被复制时触发。

**数据**:

```typescript
{
  sourceId: string
  newId: string
  materialType: string
}
```

### 模板事件

#### template:saved

组件模板保存时触发。

**数据**:

```typescript
{
  templateId: string
  name: string
  schema: NodeSchema
}
```

#### template:applied

应用模板时触发。

**数据**:

```typescript
{
  templateId: string
  nodeId: string // 生成的节点 ID
}
```

#### template:deleted

删除模板时触发。

**数据**:

```typescript
{
  templateId: string
  name: string
}
```

### 简历模板事件

#### resume-template:saved

简历模板保存时触发。

**数据**:

```typescript
{
  templateId: string
  name: string
  pageSchema: PageSchema
}
```

#### resume-template:applied

应用简历模板时触发。

**数据**:

```typescript
{
  templateId: string
  name: string
}
```

#### resume-template:deleted

删除简历模板时触发。

**数据**:

```typescript
{
  templateId: string
  name: string
}
```

### 编辑器事件

#### editor:ready

编辑器初始化完成时触发。

**数据**:

```typescript
{
  timestamp: number
}
```

#### editor:save

保存编辑器状态时触发。

**数据**:

```typescript
{
  success: boolean
  timestamp: number
}
```

#### editor:mode-changed

编辑模式切换时触发。

**数据**:

```typescript
{
  oldMode: 'edit' | 'preview'
  newMode: 'edit' | 'preview'
}
```

#### editor:scale-changed

画布缩放改变时触发。

**数据**:

```typescript
{
  oldScale: number
  newScale: number
}
```

### 主题事件

#### theme:changed

主题切换时触发。

**数据**:

```typescript
{
  oldTheme: string
  newTheme: string
  themeConfig: ITheme
}
```

#### theme:updated

主题配置更新时触发。

**数据**:

```typescript
{
  themeName: string
  config: Partial<ITheme>
}
```

### 历史事件

#### history:undo

执行撤销操作时触发。

**数据**:

```typescript
{
  timestamp: number
}
```

#### history:redo

执行重做操作时触发。

**数据**:

```typescript
{
  timestamp: number
}
```

## 自定义事件

### 命名规范

事件名使用 `namespace:action` 格式：

```typescript
// ✅ 好的命名
'material:rendered'
'plugin:activated'
'user:login'

// ❌ 不好的命名
'materialRendered'
'PLUGIN_ACTIVATED'
'user_login'
```

### 定义自定义事件

```typescript
// 定义事件常量
export const CUSTOM_EVENTS = {
  DATA_VALIDATED: 'custom:data-validated',
  EXPORT_STARTED: 'custom:export-started',
  EXPORT_COMPLETED: 'custom:export-completed',
} as const

// 发送自定义事件
eventBus.emit(CUSTOM_EVENTS.DATA_VALIDATED, {
  valid: true,
  errors: [],
})

// 监听自定义事件
eventBus.on(CUSTOM_EVENTS.DATA_VALIDATED, data => {
  if (data.valid) {
    console.log('数据验证通过')
  }
})
```

## 在 React 中使用

### Hook 方式

```typescript
import { useEffect } from 'react'
import { useEditorContext } from '@/core/context/EditorContext'

function MyComponent() {
  const { eventBus } = useEditorContext()

  useEffect(() => {
    const subscription = eventBus.on('node:updated', (data) => {
      console.log('节点更新:', data)
    })

    // 清理函数
    return () => {
      subscription.unsubscribe()
    }
  }, [eventBus])

  return <div>My Component</div>
}
```

### 自定义 Hook

创建 `useEditorEvent` Hook：

```typescript
import { useEffect } from 'react'
import { useEditorContext } from '@/core/context/EditorContext'

export function useEditorEvent<T = unknown>(
  event: string,
  handler: (data: T) => void,
  deps: any[] = []
) {
  const { eventBus } = useEditorContext()

  useEffect(() => {
    const subscription = eventBus.on(event, handler)
    return () => subscription.unsubscribe()
  }, [eventBus, event, ...deps])
}

// 使用
function MyComponent() {
  useEditorEvent('node:updated', (data) => {
    console.log('节点更新:', data)
  })

  return <div>My Component</div>
}
```

## 在插件中使用

```typescript
export const MyPlugin: IPlugin = {
  meta: {
    id: 'my-plugin',
    name: '我的插件',
    version: '1.0.0',
  },

  activate: async context => {
    // 监听事件
    const unsubscribe1 = context.on('node:added', data => {
      console.log('节点添加:', data)
    })

    const unsubscribe2 = context.on('node:updated', data => {
      console.log('节点更新:', data)
    })

    // 发送事件
    context.emit('plugin:ready', {
      pluginId: 'my-plugin',
      timestamp: Date.now(),
    })

    // 返回清理函数
    return () => {
      unsubscribe1()
      unsubscribe2()
    }
  },
}
```

## 事件流程示例

### 添加节点流程

```
用户拖拽物料
    ↓
useEditorStore.addNode()
    ↓
setState() 更新状态
    ↓
eventBus.emit('node:added', { ... })
    ↓
┌───────────────────────────────┐
│  多个监听器接收事件             │
├───────────────────────────────┤
│  1. 更新结构树显示             │
│  2. 选中新添加的节点           │
│  3. 自动保存                   │
│  4. 插件响应                   │
└───────────────────────────────┘
```

### 主题切换流程

```
用户选择新主题
    ↓
themeStore.setTheme(newTheme)
    ↓
eventBus.emit('theme:changed', {
  oldTheme, newTheme, config
})
    ↓
┌───────────────────────────────┐
│  监听器响应                    │
├───────────────────────────────┤
│  1. 所有组件重新渲染           │
│  2. 更新主题面板显示           │
│  3. 保存主题偏好               │
│  4. 发送分析事件               │
└───────────────────────────────┘
```

## 性能优化

### 1. 避免过度监听

```typescript
// ❌ 不好 - 每次渲染都创建新的监听器
function MyComponent() {
  const { eventBus } = useEditorContext()

  eventBus.on('node:updated', (data) => {
    console.log(data)
  })

  return <div>Component</div>
}

// ✅ 好 - 使用 useEffect 管理监听器生命周期
function MyComponent() {
  const { eventBus } = useEditorContext()

  useEffect(() => {
    const subscription = eventBus.on('node:updated', (data) => {
      console.log(data)
    })

    return () => subscription.unsubscribe()
  }, [eventBus])

  return <div>Component</div>
}
```

### 2. 使用事件命名空间

```typescript
// 批量清理相关事件
const NAMESPACE = 'my-plugin'

eventBus.on(`${NAMESPACE}:event1`, handler1)
eventBus.on(`${NAMESPACE}:event2`, handler2)

// 清理时
eventBus.clear(`${NAMESPACE}:event1`)
eventBus.clear(`${NAMESPACE}:event2`)
```

### 3. 防抖和节流

```typescript
import { debounce } from 'lodash-es'

// 防抖处理高频事件
const debouncedHandler = debounce(data => {
  console.log('处理事件:', data)
}, 500)

eventBus.on('node:updated', debouncedHandler)
```

## 调试事件

### 事件日志

```typescript
// 开发环境下记录所有事件
if (process.env.NODE_ENV === 'development') {
  const originalEmit = eventBus.emit.bind(eventBus)

  eventBus.emit = (event: string, data?: any) => {
    console.log(`[Event] ${event}`, data)
    return originalEmit(event, data)
  }
}
```

### 事件监控面板

创建一个开发工具面板来监控事件：

```typescript
function EventMonitor() {
  const [events, setEvents] = useState<Array<{
    name: string
    data: any
    timestamp: number
  }>>([])

  const { eventBus } = useEditorContext()

  useEffect(() => {
    // 监听所有事件（需要事件总线支持通配符）
    const subscription = eventBus.on('*', (eventName, data) => {
      setEvents(prev => [
        ...prev,
        { name: eventName, data, timestamp: Date.now() }
      ].slice(-100)) // 只保留最近100条
    })

    return () => subscription.unsubscribe()
  }, [eventBus])

  return (
    <div>
      <h3>事件监控</h3>
      {events.map((event, i) => (
        <div key={i}>
          <strong>{event.name}</strong>
          <pre>{JSON.stringify(event.data, null, 2)}</pre>
          <small>{new Date(event.timestamp).toLocaleTimeString()}</small>
        </div>
      ))}
    </div>
  )
}
```

## 相关文档

- [编辑器 API](./editor-api.md)
- [插件 API](./plugin-api.md)
- [架构概览](../guide/architecture.md)
