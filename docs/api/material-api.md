# 物料 API

## IMaterialDefinition

物料定义接口，所有物料都必须实现此接口。

### 类型定义

```typescript
interface IMaterialDefinition {
  meta: IMaterialMeta
  component: React.ComponentType<any>
  propsSchema: IPropSchema[]
  defaultProps?: Record<string, any>
  defaultStyle?: React.CSSProperties
  lifecycle?: IMaterialLifecycle
  capabilities?: IMaterialCapabilities
  actions?: IMaterialAction[]
  onDoubleClick?: (context: IMaterialContext) => void
  shortcuts?: IMaterialShortcut[]
}
```

### meta - 物料元数据

```typescript
interface IMaterialMeta {
  type: string // 物料唯一标识
  title: string // 物料名称
  description?: string // 物料描述
  category: string // 物料分类
  icon?: string // 物料图标
  thumbnail?: string // 缩略图
  isContainer?: boolean // 是否为容器
  tags?: string[] // 标签
  version?: string // 版本
}
```

**示例**:

```typescript
meta: {
  type: 'PersonalInfo',
  title: '个人信息',
  description: '完整的个人信息模块',
  category: 'resume',
  tags: ['简历', '个人信息'],
  version: '1.0.0'
}
```

### component - React 组件

物料的渲染组件。

```typescript
component: React.ComponentType<any>
```

**示例**:

```typescript
const PersonalInfo: React.FC<PersonalInfoProps> = (props) => {
  const { name, phone, email, style } = props

  return (
    <div style={style}>
      <h1>{name}</h1>
      <p>{phone}</p>
      <p>{email}</p>
    </div>
  )
}

// 在物料定义中
component: PersonalInfo
```

### propsSchema - 属性配置

定义物料的可配置属性。

```typescript
interface IPropSchema {
  name: string // 属性名
  label: string // 显示标签
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'select'
    | 'color'
    | 'textarea'
    | 'richtext'
    | 'image'
    | 'date'
    | 'json'
  defaultValue?: any // 默认值
  options?: Array<{ label: string; value: any }> // 选项（select类型）
  description?: string // 描述
  required?: boolean // 是否必填
  group?: string // 分组
  validator?: z.ZodType<any> // Zod校验
  hidden?: boolean // 是否隐藏
  visibleWhen?: (props: Record<string, any>) => boolean // 显示条件
  minHeight?: number // 富文本最小高度
}
```

**示例**:

```typescript
propsSchema: [
  {
    name: 'name',
    label: '姓名',
    type: 'string',
    defaultValue: '张三',
    required: true,
    group: '基本信息',
  },
  {
    name: 'age',
    label: '年龄',
    type: 'number',
    defaultValue: 28,
    group: '基本信息',
  },
  {
    name: 'gender',
    label: '性别',
    type: 'select',
    defaultValue: '男',
    options: [
      { label: '男', value: '男' },
      { label: '女', value: '女' },
    ],
    group: '基本信息',
  },
  {
    name: 'showAvatar',
    label: '显示头像',
    type: 'boolean',
    defaultValue: false,
    group: '外观',
  },
  {
    name: 'avatar',
    label: '头像URL',
    type: 'string',
    defaultValue: '',
    group: '外观',
    visibleWhen: props => props.showAvatar === true,
  },
  {
    name: 'summary',
    label: '个人简介',
    type: 'richtext',
    defaultValue: '',
    minHeight: 100,
    group: '补充信息',
  },
]
```

### capabilities - 物料能力

定义物料的功能能力。

```typescript
interface IMaterialCapabilities {
  copyable?: boolean // 是否支持复制
  deletable?: boolean // 是否支持删除
  moveable?: boolean // 是否支持移动
  lockable?: boolean // 是否支持锁定
  hideable?: boolean // 是否支持隐藏
  minChildren?: number // 最小子节点数
  maxChildren?: number // 最大子节点数
  acceptChildren?: string[] | ((materialType: string) => boolean) // 允许的子节点类型
  canBeChild?: boolean // 是否可以作为其他节点的子节点
}
```

**示例**:

```typescript
capabilities: {
  copyable: true,
  deletable: true,
  moveable: true,
  canBeChild: true,
  acceptChildren: ['TextBlock', 'BulletList']  // 只接受特定类型的子节点
}
```

### actions - 自定义操作

定义物料的自定义操作。

```typescript
interface IMaterialAction {
  id: string
  label: string
  icon?: string
  execute: (context: IMaterialContext) => void | Promise<void>
  enabled?: (context: IMaterialContext) => boolean
  shortcut?: string
}
```

**示例**:

```typescript
actions: [
  {
    id: 'quick-edit-name',
    label: '快速编辑姓名',
    icon: '✏️',
    execute: async context => {
      const newName = await notification.prompt({
        title: '编辑姓名',
        message: '请输入姓名',
        defaultValue: context.props.name as string,
      })

      if (newName) {
        const api = context.getEditorAPI()
        api.updateNodeProps(context.nodeId, { name: newName })
      }
    },
    enabled: () => true,
  },
]
```

### shortcuts - 物料快捷键

定义物料专属的快捷键。

```typescript
interface IMaterialShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  description: string
  handler: (context: IMaterialContext) => void | Promise<void>
  requiresSelection?: boolean
}
```

**示例**:

```typescript
shortcuts: [
  {
    key: 'B',
    ctrl: true,
    description: '加粗文本',
    handler: async context => {
      const api = context.getEditorAPI()
      const currentStyle = context.props.fontWeight || 'normal'
      api.updateNodeProps(context.nodeId, {
        fontWeight: currentStyle === 'bold' ? 'normal' : 'bold',
      })
    },
    requiresSelection: true,
  },
]
```

### onDoubleClick - 双击处理

双击物料时的处理函数。

```typescript
onDoubleClick?: (context: IMaterialContext) => void
```

**示例**:

```typescript
onDoubleClick: async context => {
  const newText = await notification.prompt({
    title: '编辑文本',
    message: '请输入文本',
    defaultValue: context.props.text as string,
  })

  if (newText) {
    const api = context.getEditorAPI()
    api.updateNodeProps(context.nodeId, { text: newText })
  }
}
```

## IMaterialContext

物料上下文，提供给物料的运行时环境。

```typescript
interface IMaterialContext {
  nodeId: string
  materialType: string
  props: Record<string, any>
  style: React.CSSProperties
  parentId?: string
  childrenIds: string[]
  emit: (event: string, data?: any) => void
  on: (event: string, handler: (data: any) => void) => () => void
  getEditorAPI: () => IEditorAPI
}
```

### emit - 发送事件

```typescript
emit(event: string, data?: any): void
```

**示例**:

```typescript
// 在物料组件中
const handleClick = () => {
  context.emit('material:clicked', { nodeId: context.nodeId })
}
```

### on - 监听事件

```typescript
on(event: string, handler: (data: any) => void): () => void
```

**示例**:

```typescript
// 在物料生命周期中
useEffect(() => {
  const unsubscribe = context.on('theme:changed', data => {
    console.log('主题变更:', data)
  })

  return unsubscribe
}, [])
```

### getEditorAPI - 获取编辑器 API

```typescript
getEditorAPI(): IEditorAPI
```

**示例**:

```typescript
const handleUpdate = () => {
  const api = context.getEditorAPI()
  api.updateNodeProps(context.nodeId, { text: 'New Text' })
}
```

## MaterialRegistry

物料注册表，管理所有物料。

### register

注册物料。

```typescript
register(definition: IMaterialDefinition): void
```

**示例**:

```typescript
import { materialRegistry } from '@/core/services/MaterialRegistry'

materialRegistry.register(PersonalInfoMaterial)
```

### get

获取物料定义。

```typescript
get(type: string): IMaterialDefinition | undefined
```

**示例**:

```typescript
const material = materialRegistry.get('PersonalInfo')

if (material) {
  console.log(material.meta.title)
}
```

### getAll

获取所有物料。

```typescript
getAll(): IMaterialDefinition[]
```

**示例**:

```typescript
const materials = materialRegistry.getAll()

materials.forEach(material => {
  console.log(material.meta.title, material.meta.category)
})
```

### getByCategory

按分类获取物料。

```typescript
getByCategory(category: string): IMaterialDefinition[]
```

**示例**:

```typescript
const resumeMaterials = materialRegistry.getByCategory('resume')
const baseMaterials = materialRegistry.getByCategory('base')
```

### searchByTags

按标签搜索物料。

```typescript
searchByTags(tags: string[]): IMaterialDefinition[]
```

**示例**:

```typescript
const materials = materialRegistry.searchByTags(['简历', '个人信息'])
```

## 完整物料示例

```typescript
import React from 'react'
import { IMaterialDefinition } from '@/core/protocols/IMaterialProtocol'
import { useThemeConfig } from '@/core/context/ThemeContext'
import { notification } from '@/utils/notification'

// 1. 定义属性接口
interface SimpleCardProps {
  title?: string
  content?: string
  bgColor?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

// 2. 定义组件
const SimpleCard: React.FC<SimpleCardProps> = ({
  title = '标题',
  content = '内容',
  bgColor = '#ffffff',
  style,
  children
}) => {
  const theme = useThemeConfig()

  return (
    <div
      style={{
        padding: theme.spacing.item,
        backgroundColor: bgColor,
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        ...style
      }}
    >
      <h3 style={{
        fontSize: theme.font.titleSize.h3,
        marginBottom: theme.spacing.line
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: theme.font.bodySize.normal,
        color: theme.color.text.secondary
      }}>
        {content}
      </p>
      {children}
    </div>
  )
}

// 3. 定义物料
export const SimpleCardMaterial: IMaterialDefinition = {
  meta: {
    type: 'SimpleCard',
    title: '简单卡片',
    description: '一个简单的卡片组件',
    category: 'base',
    tags: ['卡片', '容器'],
    version: '1.0.0',
    isContainer: true
  },

  component: SimpleCard,

  propsSchema: [
    {
      name: 'title',
      label: '标题',
      type: 'string',
      defaultValue: '标题',
      required: true,
      group: '内容'
    },
    {
      name: 'content',
      label: '内容',
      type: 'textarea',
      defaultValue: '内容',
      group: '内容'
    },
    {
      name: 'bgColor',
      label: '背景颜色',
      type: 'color',
      defaultValue: '#ffffff',
      group: '样式'
    }
  ],

  defaultProps: {
    title: '标题',
    content: '内容',
    bgColor: '#ffffff'
  },

  defaultStyle: {
    marginBottom: '16px'
  },

  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true,
    acceptChildren: true
  },

  actions: [
    {
      id: 'edit-title',
      label: '快速编辑标题',
      icon: '✏️',
      execute: async (context) => {
        const newTitle = await notification.prompt({
          title: '编辑标题',
          message: '请输入标题',
          defaultValue: context.props.title as string
        })

        if (newTitle) {
          const api = context.getEditorAPI()
          api.updateNodeProps(context.nodeId, { title: newTitle })
        }
      }
    }
  ],

  onDoubleClick: async (context) => {
    const newTitle = await notification.prompt({
      title: '编辑标题',
      message: '请输入标题',
      defaultValue: context.props.title as string
    })

    if (newTitle) {
      const api = context.getEditorAPI()
      api.updateNodeProps(context.nodeId, { title: newTitle })
    }
  },

  shortcuts: [
    {
      key: 'T',
      ctrl: true,
      shift: true,
      description: '编辑标题',
      handler: async (context) => {
        const newTitle = await notification.prompt({
          title: '编辑标题',
          defaultValue: context.props.title as string
        })

        if (newTitle) {
          const api = context.getEditorAPI()
          api.updateNodeProps(context.nodeId, { title: newTitle })
        }
      },
      requiresSelection: true
    }
  ]
}

// 4. 注册物料
import { materialRegistry } from '@/core/services/MaterialRegistry'

materialRegistry.register(SimpleCardMaterial)
```

## Hooks

### useMaterial

获取物料定义的 Hook。

```typescript
const materialDef = useMaterial(materialType)
```

**示例**:

```typescript
import { useMaterial } from '@/core/hooks/useMaterial'

function MaterialInfo({ materialType }: { materialType: string }) {
  const material = useMaterial(materialType)

  if (!material) {
    return <div>物料未找到</div>
  }

  return (
    <div>
      <h3>{material.meta.title}</h3>
      <p>{material.meta.description}</p>
      <p>分类: {material.meta.category}</p>
    </div>
  )
}
```

## 相关文档

- [物料开发指南](../guide/material-development.md)
- [物料示例](../examples/material-examples.md)
- [编辑器 API](./editor-api.md)
