/**
 * 物料协议接口
 *
 * 定义物料系统的完整协议，包括生命周期、通信、校验等
 */

import { ComponentType, CSSProperties } from 'react'
import { z } from 'zod'

/**
 * 物料元数据
 */
export interface IMaterialMeta {
  /** 物料唯一标识 */
  type: string
  /** 物料名称 */
  title: string
  /** 物料描述 */
  description?: string
  /** 物料分类 */
  category: string
  /** 物料图标 */
  icon?: string
  /** 缩略图 */
  thumbnail?: string
  /** 是否为容器 */
  isContainer?: boolean
  /** 标签（用于搜索和分类） */
  tags?: string[]
  /** 版本 */
  version?: string
  /** 默认样式（可选） */
  defaultStyle?: Record<string, never>
  /** 默认属性（可选） */
  defaultProps?: Record<string, never>
}

/**
 * 属性Schema定义
 */
export interface IPropSchema {
  /** 属性名 */
  name: string
  /** 显示标签 */
  label: string
  /** 属性类型 */
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
  /** 默认值 */
  defaultValue?: any
  /** 选项（用于select） */
  options?: Array<{ label: string; value: any }>
  /** 描述 */
  description?: string
  /** 是否必填 */
  required?: boolean
  /** 分组 */
  group?: string
  /** Zod校验Schema */
  validator?: z.ZodType<any>
  /** 是否隐藏 */
  hidden?: boolean
  /** 显示条件（根据其他属性决定是否显示） */
  visibleWhen?: (props: Record<string, any>) => boolean
  /** 富文本最小高度 */
  minHeight?: number
}

/**
 * 物料生命周期钩子
 */
export interface IMaterialLifecycle {
  /** 物料创建时 */
  onCreate?: (context: IMaterialContext) => void | Promise<void>
  /** 物料挂载时 */
  onMount?: (context: IMaterialContext) => void | Promise<void>
  /** 物料更新时 */
  onUpdate?: (context: IMaterialContext, prevProps: any) => void | Promise<void>
  /** 物料卸载时 */
  onUnmount?: (context: IMaterialContext) => void | Promise<void>
  /** 物料销毁时 */
  onDestroy?: (context: IMaterialContext) => void | Promise<void>
}

/**
 * 物料上下文
 */
export interface IMaterialContext {
  /** 节点ID */
  nodeId: string
  /** 物料类型 */
  materialType: string
  /** 当前属性 */
  props: Record<string, any>
  /** 当前样式 */
  style: CSSProperties
  /** 父节点ID */
  parentId?: string
  /** 子节点IDs */
  childrenIds: string[]
  /** 发送事件 */
  emit: (event: string, data?: any) => void
  /** 监听事件 */
  on: (event: string, handler: (data: any) => void) => () => void
  /** 获取编辑器API */
  getEditorAPI: () => IEditorAPI
}

/**
 * 编辑器API接口
 */
export interface IEditorAPI {
  /** 选中节点 */
  selectNode: (nodeId: string) => void
  /** 更新节点属性 */
  updateNodeProps: (nodeId: string, props: Record<string, any>) => void
  /** 更新节点样式 */
  updateNodeStyle: (nodeId: string, style: CSSProperties) => void
  /** 删除节点 */
  deleteNode: (nodeId: string) => void
  /** 添加节点 */
  addNode: (materialType: string, parentId?: string) => string
  /** 查找节点 */
  findNode: (nodeId: string) => any
}

/**
 * 物料能力扩展
 */
export interface IMaterialCapabilities {
  /** 是否支持复制 */
  copyable?: boolean
  /** 是否支持删除 */
  deletable?: boolean
  /** 是否支持移动 */
  moveable?: boolean
  /** 是否支持锁定 */
  lockable?: boolean
  /** 是否支持隐藏 */
  hideable?: boolean
  /** 最小子节点数 */
  minChildren?: number
  /** 最大子节点数 */
  maxChildren?: number
  /** 允许的子节点类型 */
  acceptChildren?: string[] | ((materialType: string) => boolean)
  /** 是否可以作为其他节点的子节点 */
  canBeChild?: boolean
}

/**
 * 物料Action行为
 */
export interface IMaterialAction {
  /** Action ID */
  id: string
  /** Action名称 */
  label: string
  /** Action图标 */
  icon?: string
  /** 执行函数 */
  execute: (context: IMaterialContext) => void | Promise<void>
  /** 是否可用 */
  enabled?: (context: IMaterialContext) => boolean
  /** 快捷键 */
  shortcut?: string
}

/**
 * 物料快捷键定义
 */
export interface IMaterialShortcut {
  /** 快捷键组合 */
  key: string
  /** Ctrl/Cmd 键 */
  ctrl?: boolean
  /** Shift 键 */
  shift?: boolean
  /** Alt 键 */
  alt?: boolean
  /** 描述 */
  description: string
  /** 执行函数 */
  handler: (context: IMaterialContext) => void | Promise<void>
  /** 是否只在选中时生效 */
  requiresSelection?: boolean
}

/**
 * 物料定义协议
 */
export interface IMaterialDefinition {
  /** 元数据 */
  meta: IMaterialMeta
  /** React组件 */
  component: ComponentType<any>
  /** 属性Schema */
  propsSchema: IPropSchema[]
  /** 默认属性 */
  defaultProps?: Record<string, any>
  /** 默认样式 */
  defaultStyle?: CSSProperties
  /** 生命周期 */
  lifecycle?: IMaterialLifecycle
  /** 能力配置 */
  capabilities?: IMaterialCapabilities
  /** Action行为 */
  actions?: IMaterialAction[]
  /** 双击行为 */
  onDoubleClick?: (context: IMaterialContext) => void
  /** 自定义渲染器（可选，用于特殊渲染需求） */
  customRenderer?: (props: any) => React.ReactElement
  /** 物料专属快捷键 */
  shortcuts?: IMaterialShortcut[]
}

/**
 * 物料注册表接口
 */
export interface IMaterialRegistry {
  /** 注册物料 */
  register(definition: IMaterialDefinition): void
  /** 批量注册 */
  registerAll(definitions: IMaterialDefinition[]): void
  /** 获取物料 */
  get(type: string): IMaterialDefinition | undefined
  /** 获取所有物料 */
  getAll(): IMaterialDefinition[]
  /** 按分类获取 */
  getByCategory(category: string): IMaterialDefinition[]
  /** 检查是否存在 */
  has(type: string): boolean
  /** 注销物料 */
  unregister(type: string): void
  /** 按标签搜索 */
  searchByTags(tags: string[]): IMaterialDefinition[]
}
