/**
 * 物料系统核心类型定义
 * 
 * 这是整个低代码引擎的基础协议定义
 */

import { ComponentType, CSSProperties } from 'react'

/**
 * 物料唯一标识
 */
export type MaterialType = string

/**
 * 节点ID，全局唯一
 */
export type NodeId = string

/**
 * 属性值类型
 */
export type PropValue = string | number | boolean | object | null | undefined

/**
 * 属性配置Schema - 定义物料的可配置属性
 */
export interface PropSchema {
  /** 属性名称 */
  name: string
  /** 属性显示标签 */
  label: string
  /** 属性类型 */
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'textarea' | 'richtext' | 'image' | 'date'
  /** 默认值 */
  defaultValue?: PropValue
  /** 下拉选项（type为select时有效） */
  options?: Array<{ label: string; value: PropValue }>
  /** 属性说明 */
  description?: string
  /** 是否必填 */
  required?: boolean
  /** 分组 */
  group?: string
}

/**
 * 物料元数据 - 描述一个物料的基本信息
 */
export interface MaterialMeta {
  /** 物料类型标识，全局唯一 */
  type: MaterialType
  /** 物料显示名称 */
  title: string
  /** 物料描述 */
  description?: string
  /** 物料分类 */
  category: string
  /** 物料图标（可选） */
  icon?: string
  /** 物料缩略图（可选） */
  thumbnail?: string
  /** 属性配置Schema */
  propsSchema: PropSchema[]
  /** 是否为容器组件（可包含子节点） */
  isContainer?: boolean
  /** 默认样式 */
  defaultStyle?: CSSProperties
  /** 默认属性值 */
  defaultProps?: Record<string, PropValue>
}

/**
 * 物料定义 - 包含元数据和React组件
 */
export interface MaterialDefinition {
  /** 物料元数据 */
  meta: MaterialMeta
  /** React渲染组件 */
  component: ComponentType<any>
}

/**
 * 节点Schema - 描述页面中的一个节点实例
 */
export interface NodeSchema {
  /** 节点唯一ID */
  id: NodeId
  /** 物料类型 */
  type: MaterialType
  /** 节点属性值 */
  props?: Record<string, PropValue>
  /** 节点样式 */
  style?: CSSProperties
  /** 子节点列表 */
  children?: NodeSchema[]
  /** 父节点ID */
  parentId?: NodeId
  /** 是否锁定（锁定后不可编辑） */
  locked?: boolean
  /** 是否隐藏 */
  hidden?: boolean
}

/**
 * 页面Schema - 描述整个页面结构
 */
export interface PageSchema {
  /** 页面版本 */
  version: string
  /** 页面元数据 */
  meta: {
    title?: string
    description?: string
    createTime?: string
    updateTime?: string
  }
  /** 根节点 */
  root: NodeSchema
}

/**
 * 物料注册表
 */
export interface MaterialRegistry {
  /** 注册物料 */
  register(definition: MaterialDefinition): void
  /** 批量注册物料 */
  registerAll(definitions: MaterialDefinition[]): void
  /** 获取物料定义 */
  get(type: MaterialType): MaterialDefinition | undefined
  /** 获取所有物料 */
  getAll(): MaterialDefinition[]
  /** 按分类获取物料 */
  getByCategory(category: string): MaterialDefinition[]
  /** 检查物料是否已注册 */
  has(type: MaterialType): boolean
}

