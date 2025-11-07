/**
 * 渲染器协议 - 框架无关的渲染系统
 * 
 * 定义如何将物料 Schema 渲染成实际的 UI 组件
 * 支持多框架（React, Vue, Svelte 等）和多平台（Web, Mobile, Desktop）
 * 
 * @packageDocumentation
 */

// JSONSchema7 类型定义（简化版，避免依赖 json-schema 包）
export type JSONSchema7 = Record<string, unknown>
import type { I18nString, SemanticVersion } from '../material/MaterialProtocol'
import type { DataBinding } from '../data/DataProtocol'

// ==================== 渲染器协议 URI ====================

export const RENDERER_PROTOCOL_URI = 'lcedit://protocols/renderer/v1' as const

// ==================== 渲染器定义 ====================

/**
 * 渲染器定义
 * 
 * 定义一个渲染器的元数据、能力和配置
 */
export interface RendererDefinition {
  /** 协议版本 */
  readonly $protocol: typeof RENDERER_PROTOCOL_URI
  
  /** 渲染器 ID（全局唯一） */
  readonly id: string
  
  /** 渲染器名称 */
  readonly name: I18nString
  
  /** 渲染器描述 */
  readonly description?: I18nString
  
  /** 渲染器版本 */
  readonly version: SemanticVersion
  
  /** 目标框架 */
  readonly targetFramework: TargetFramework
  
  /** 目标平台 */
  readonly targetPlatform: TargetPlatform
  
  /** 渲染器能力 */
  readonly capabilities: RendererCapabilities
  
  /** 配置 Schema */
  readonly configSchema?: JSONSchema7
  
  /** 渲染器元数据 */
  readonly metadata?: RendererMetadata
  
  /** 依赖 */
  readonly dependencies?: RendererDependencies
}

/**
 * 目标框架
 */
export type TargetFramework =
  | 'react'
  | 'vue'
  | 'vue3'
  | 'angular'
  | 'svelte'
  | 'solid'
  | 'preact'
  | 'lit'
  | 'web-component'
  | 'native'
  | 'custom'
  | string

/**
 * 目标平台
 */
export type TargetPlatform =
  | 'web'
  | 'mobile'
  | 'desktop'
  | 'ios'
  | 'android'
  | 'electron'
  | 'pwa'
  | 'universal'
  | string

/**
 * 渲染器能力
 */
export interface RendererCapabilities {
  /** 是否支持在编辑器中拖拽 */
  readonly draggable?: boolean
  
  /** 是否支持在编辑器中调整大小 */
  readonly resizable?: boolean
  
  /** 是否支持在编辑器中选中 */
  readonly selectable?: boolean
  
  /** 是否支持在编辑器中直接编辑 */
  readonly inlineEditable?: boolean
  
  /** 是否支持在编辑器中显示辅助线、网格 */
  readonly showGuides?: boolean
  
  /** 是否支持在编辑器中显示边界框 */
  readonly showBoundingBox?: boolean
  
  /** 是否支持在编辑器中显示控制手柄 */
  readonly showControls?: boolean
  
  /** 是否支持在编辑器中显示层级结构 */
  readonly showOutline?: boolean
  
  /** 是否支持响应式设计 */
  readonly responsive?: boolean
  
  /** 是否支持主题切换 */
  readonly themable?: boolean
  
  /** 是否支持国际化 */
  readonly i18n?: boolean
  
  /** 是否支持动画 */
  readonly animation?: boolean
  
  /** 是否支持交互 */
  readonly interactive?: boolean
  
  /** 是否支持嵌套 */
  readonly nestable?: boolean
  
  /** 是否支持插槽 */
  readonly slots?: boolean
  
  /** 是否支持事件 */
  readonly events?: boolean
  
  /** 是否支持数据绑定 */
  readonly dataBinding?: boolean
  
  /** 是否支持条件渲染 */
  readonly conditionalRendering?: boolean
  
  /** 是否支持列表渲染 */
  readonly listRendering?: boolean
  
  /** 是否支持样式隔离 */
  readonly styleIsolation?: boolean
  
  /** 是否支持 SSR */
  readonly ssr?: boolean
  
  /** 是否支持 SSG */
  readonly ssg?: boolean
  
  /** 是否支持水合 */
  readonly hydration?: boolean
  
  /** 性能特性 */
  readonly performance?: PerformanceCapabilities
}

/**
 * 性能能力
 */
export interface PerformanceCapabilities {
  /** 是否支持虚拟滚动 */
  readonly virtualScroll?: boolean
  
  /** 是否支持懒加载 */
  readonly lazyLoad?: boolean
  
  /** 是否支持代码分割 */
  readonly codeSplitting?: boolean
  
  /** 是否支持 Memo */
  readonly memoization?: boolean
  
  /** 是否支持 Web Worker */
  readonly webWorker?: boolean
}

/**
 * 渲染器元数据
 */
export interface RendererMetadata {
  readonly author?: string
  readonly license?: string
  readonly homepage?: string
  readonly repository?: string
  readonly tags?: readonly string[]
  /** 框架类型（用于注册表查询） */
  readonly framework?: TargetFramework
  /** 平台类型（用于注册表查询） */
  readonly platform?: TargetPlatform
  /** 渲染器优先级（用于排序） */
  readonly priority?: number
  /** 支持的渲染模式 */
  readonly supportedModes?: readonly RenderMode[]
  /** 支持的视口类型 */
  readonly supportedViewports?: readonly ViewportType[]
  readonly [key: `x-${string}`]: unknown
}

/**
 * 视口类型
 */
export type ViewportType = 'desktop' | 'tablet' | 'mobile' | 'watch' | 'tv' | string

/**
 * 渲染器依赖
 */
export interface RendererDependencies {
  readonly frameworks?: Record<string, string>
  readonly libraries?: Record<string, string>
  readonly peer?: Record<string, string>
}

// ==================== 渲染上下文 ====================

/**
 * 渲染上下文
 * 
 * 提供给渲染器的运行时上下文信息
 */
export interface RenderContext<TNode = unknown, TStyle = Record<string, unknown>> {
  /** 当前渲染的物料节点 ID */
  readonly nodeId: string
  
  /** 当前渲染的物料类型 */
  readonly materialType: string
  
  /** 当前物料的属性 */
  readonly props: Readonly<Record<string, unknown>>
  
  /** 当前物料的样式 */
  readonly style: Readonly<TStyle>
  
  /** 父物料节点 ID */
  readonly parentId?: string
  
  /** 子物料节点 ID 列表 */
  readonly childrenIds: readonly string[]
  
  /** 当前渲染模式 */
  readonly mode: RenderMode
  
  /** 当前视口模式 */
  readonly viewportMode: ViewportMode
  
  /** 当前视口类型 */
  readonly viewport?: ViewportType
  
  /** 目标框架 */
  readonly framework?: TargetFramework
  
  /** 目标平台 */
  readonly platform?: TargetPlatform
  
  /** 当前主题 */
  readonly theme: Theme
  
  /** 当前语言 */
  readonly locale: string
  
  /** 编辑器状态 */
  readonly editorState: EditorRenderState
  
  /** 数据绑定 */
  readonly bindings?: readonly DataBinding[]
  
  /** 编辑器服务 */
  readonly services: RenderServices
  
  /** 渲染子节点的方法 */
  renderChildren(childrenIds?: readonly string[]): TNode[]
  
  /** 渲染指定节点的方法 */
  renderNode(nodeId: string): TNode | null
  
  /** 渲染插槽的方法 */
  renderSlot(slotId: string): TNode[]
  
  /** 获取节点数据 */
  getNodeData(nodeId: string): NodeData | null
  
  /** 更新节点属性 */
  updateNodeProps(nodeId: string, props: Record<string, unknown>): void
  
  /** 触发事件 */
  emit(eventName: string, payload?: unknown): void
  
  /** 监听事件 */
  on(eventName: string, handler: (payload: unknown) => void): () => void
  
  /** 执行命令 */
  executeCommand(commandId: string, ...args: unknown[]): Promise<unknown>
}

/**
 * 渲染模式
 */
export type RenderMode =
  | 'edit'        // 编辑模式
  | 'preview'     // 预览模式
  | 'production'  // 生产模式

/**
 * 视口模式
 */
export type ViewportMode =
  | 'desktop'
  | 'tablet'
  | 'mobile'
  | string

/**
 * 主题
 */
export interface Theme {
  readonly id: string
  readonly name: string
  readonly mode: 'light' | 'dark' | 'auto'
  readonly colors: Record<string, string>
  readonly fonts: Record<string, string>
  readonly spacing: Record<string, string | number>
  readonly breakpoints: Record<string, number>
  readonly [key: string]: unknown
}

/**
 * 编辑器渲染状态
 */
export interface EditorRenderState {
  readonly isSelected: boolean
  readonly isHovered: boolean
  readonly isDragging: boolean
  readonly isResizing: boolean
  readonly isLocked: boolean
  readonly isHidden: boolean
  readonly isHighlighted: boolean
  readonly zoomLevel: number
}

/**
 * 节点数据
 */
export interface NodeData {
  readonly id: string
  readonly type: string
  readonly props: Record<string, unknown>
  readonly style: Record<string, unknown>
  readonly children: readonly string[]
  readonly parent?: string
  readonly metadata: Record<string, unknown>
}

/**
 * 渲染服务
 */
export interface RenderServices {
  /** 获取编辑器服务 */
  getEditorService: () => unknown
  
  /** 获取事件总线 */
  getEventBus: () => unknown
  
  /** 获取状态管理 */
  getStateManager: () => unknown
  
  /** 获取数据服务 */
  getDataService: () => unknown
  
  /** 获取主题服务 */
  getThemeService: () => unknown
  
  /** 获取国际化服务 */
  getI18nService: () => unknown
  
  /** 获取自定义服务 */
  getService: <T>(serviceId: string) => T | undefined
}

// ==================== 组件渲染器 ====================

/**
 * 组件渲染器接口
 * 
 * 实际渲染物料的函数或类
 */
export type ComponentRenderer<TProps = Record<string, unknown>, TResult = unknown> = (
  context: RenderContext,
  props: TProps
) => TResult

/**
 * 渲染器工厂
 * 
 * 创建渲染器实例的工厂函数
 */
export type RendererFactory<TRenderer = ComponentRenderer> = (
  definition: RendererDefinition,
  config?: Record<string, unknown>
) => TRenderer

// ==================== 属性渲染器 ====================

/**
 * 属性字段渲染器接口
 * 
 * 渲染属性面板中的单个属性字段
 */
export type PropertyFieldRenderer<TValue = unknown, TResult = unknown> = (
  field: PropertyFieldRenderContext,
  value: TValue,
  onChange: (newValue: TValue) => void
) => TResult

/**
 * 属性字段渲染上下文
 */
export interface PropertyFieldRenderContext {
  /** 字段名称 */
  readonly fieldName: string
  
  /** 字段 Schema */
  readonly fieldSchema: PropertyFieldSchema
  
  /** 所有属性值 */
  readonly allProps: Readonly<Record<string, unknown>>
  
  /** 当前物料的 ID */
  readonly nodeId: string
  
  /** 验证状态 */
  readonly validation?: ValidationState
  
  /** 是否只读 */
  readonly readOnly: boolean
  
  /** 是否禁用 */
  readonly disabled: boolean
  
  /** 编辑器服务 */
  readonly services: RenderServices
}

/**
 * 属性字段 Schema
 */
export interface PropertyFieldSchema {
  readonly type: string
  readonly label: I18nString
  readonly description?: I18nString
  readonly required?: boolean
  readonly defaultValue?: unknown
  readonly validation?: Record<string, unknown>
  readonly widget?: string
  readonly [key: `x-${string}`]: unknown
}

/**
 * 验证状态
 */
export interface ValidationState {
  readonly valid: boolean
  readonly errors?: readonly ValidationError[]
  readonly warnings?: readonly ValidationWarning[]
}

/**
 * 验证错误
 */
export interface ValidationError {
  readonly code: string
  readonly message: string
  readonly path?: string
}

/**
 * 验证警告
 */
export interface ValidationWarning {
  readonly code: string
  readonly message: string
  readonly path?: string
}

// ==================== 渲染器注册表 ====================

/**
 * 渲染器注册表接口
 */
export interface IRendererRegistry {
  /**
   * 注册组件渲染器
   */
  registerRenderer(
    materialType: string,
    renderer: ComponentRenderer,
    framework?: TargetFramework
  ): Disposable
  
  /**
   * 注册属性字段渲染器
   */
  registerPropertyRenderer(
    fieldType: string,
    renderer: PropertyFieldRenderer,
    framework?: TargetFramework
  ): Disposable
  
  /**
   * 取消注册渲染器
   */
  unregisterRenderer(materialType: string, framework?: TargetFramework): void
  
  /**
   * 取消注册属性字段渲染器
   */
  unregisterPropertyRenderer(fieldType: string, framework?: TargetFramework): void
  
  /**
   * 获取组件渲染器
   */
  getRenderer(
    materialType: string,
    framework?: TargetFramework
  ): ComponentRenderer | undefined
  
  /**
   * 获取属性字段渲染器
   */
  getPropertyRenderer(
    fieldType: string,
    framework?: TargetFramework
  ): PropertyFieldRenderer | undefined
  
  /**
   * 检查是否有渲染器
   */
  hasRenderer(materialType: string, framework?: TargetFramework): boolean
  
  /**
   * 检查是否有属性字段渲染器
   */
  hasPropertyRenderer(fieldType: string, framework?: TargetFramework): boolean
  
  /**
   * 获取所有组件渲染器
   */
  getAllRenderers(framework?: TargetFramework): Map<string, ComponentRenderer>
  
  /**
   * 获取所有属性字段渲染器
   */
  getAllPropertyRenderers(framework?: TargetFramework): Map<string, PropertyFieldRenderer>
  
  /**
   * 设置默认框架
   */
  setDefaultFramework(framework: TargetFramework): void
  
  /**
   * 获取默认框架
   */
  getDefaultFramework(): TargetFramework
}

/**
 * 可释放资源
 */
export interface Disposable {
  dispose(): void
}

// ==================== 渲染选项 ====================

/**
 * 渲染选项
 */
export interface RenderOptions {
  /** 渲染模式 */
  readonly mode: RenderMode
  
  /** 视口模式 */
  readonly viewportMode: ViewportMode
  
  /** 主题 */
  readonly theme?: Theme
  
  /** 语言 */
  readonly locale?: string
  
  /** 是否启用 SSR */
  readonly ssr?: boolean
  
  /** 是否启用水合 */
  readonly hydration?: boolean
  
  /** 是否启用性能监控 */
  readonly performance?: boolean
  
  /** 自定义配置 */
  readonly custom?: Record<string, unknown>
}

// ==================== 渲染结果 ====================

/**
 * 渲染结果
 */
export interface RenderResult<TNode = unknown> {
  /** 渲染的节点 */
  readonly node: TNode
  
  /** 渲染时间（毫秒） */
  readonly duration: number
  
  /** 渲染的节点数量 */
  readonly nodeCount: number
  
  /** 渲染警告 */
  readonly warnings?: readonly RenderWarning[]
  
  /** 渲染元数据 */
  readonly metadata?: Record<string, unknown>
}

/**
 * 渲染警告
 */
export interface RenderWarning {
  readonly code: string
  readonly message: string
  readonly nodeId?: string
  readonly severity: 'low' | 'medium' | 'high'
}

// ==================== 渲染钩子 ====================

/**
 * 渲染生命周期钩子
 */
export interface RenderLifecycle<TNode = unknown> {
  /** 渲染前 */
  beforeRender?(context: RenderContext): void | Promise<void>
  
  /** 渲染后 */
  afterRender?(context: RenderContext, result: TNode): void | Promise<void>
  
  /** 更新前 */
  beforeUpdate?(context: RenderContext, prevProps: Record<string, unknown>): void | Promise<void>
  
  /** 更新后 */
  afterUpdate?(context: RenderContext, prevProps: Record<string, unknown>): void | Promise<void>
  
  /** 卸载前 */
  beforeUnmount?(context: RenderContext): void | Promise<void>
  
  /** 错误处理 */
  onError?(context: RenderContext, error: Error): void | Promise<void>
}

// ==================== 渲染中间件 ====================

/**
 * 渲染中间件
 */
export interface RenderMiddleware<TNode = unknown> {
  /** 中间件名称 */
  readonly name: string
  
  /** 中间件优先级 */
  readonly priority?: number
  
  /** 处理函数 */
  process(
    context: RenderContext,
    next: () => TNode
  ): TNode | Promise<TNode>
}

// ==================== 渲染管道 ====================

/**
 * 渲染管道
 * 
 * 管理渲染中间件的执行顺序
 */
export interface RenderPipeline<TNode = unknown> {
  /**
   * 添加中间件
   */
  use(middleware: RenderMiddleware<TNode>): this
  
  /**
   * 执行管道
   */
  execute(context: RenderContext): TNode | Promise<TNode>
}

// ==================== 样式处理 ====================

/**
 * 样式处理器接口
 */
export interface StyleProcessor {
  /**
   * 处理样式
   */
  process(
    style: Record<string, unknown>,
    context: StyleProcessContext
  ): Record<string, unknown>
}

/**
 * 样式处理上下文
 */
export interface StyleProcessContext {
  readonly nodeId: string
  readonly materialType: string
  readonly theme: Theme
  readonly viewportMode: ViewportMode
  readonly mode: RenderMode
}

// ==================== 内置渲染器类型 ====================

/**
 * 内置渲染器类型
 */
export const BuiltInRenderers = {
  // React 渲染器
  REACT_DEFAULT: 'lcedit.renderer.react.default',
  REACT_CANVAS: 'lcedit.renderer.react.canvas',
  REACT_PROPERTY: 'lcedit.renderer.react.property',
  
  // Vue 渲染器
  VUE_DEFAULT: 'lcedit.renderer.vue.default',
  VUE_CANVAS: 'lcedit.renderer.vue.canvas',
  VUE_PROPERTY: 'lcedit.renderer.vue.property',
  
  // Web Component 渲染器
  WC_DEFAULT: 'lcedit.renderer.wc.default',
} as const

/**
 * 内置属性字段渲染器类型
 */
export const BuiltInPropertyRenderers = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  SELECT: 'select',
  MULTI_SELECT: 'multi-select',
  COLOR: 'color',
  DATE: 'date',
  DATETIME: 'datetime',
  TIME: 'time',
  TEXTAREA: 'textarea',
  RICHTEXT: 'richtext',
  IMAGE: 'image',
  FILE: 'file',
  SLIDER: 'slider',
  SWITCH: 'switch',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  JSON: 'json',
  CODE: 'code',
  ARRAY: 'array',
  OBJECT: 'object',
  CUSTOM: 'custom',
} as const

