/**
 * 物料协议 - 完整版
 * 
 * 支持复杂的低代码/无代码场景
 * 
 * @packageDocumentation
 */

// 使用本地类型定义以避免外部依赖
export type JSONSchema7 = Record<string, unknown>

// ==================== 核心类型 ====================

/**
 * 协议 URI
 */
export const MATERIAL_PROTOCOL_URI = 'lcedit://protocols/material/v1' as const

/**
 * 语义化版本
 */
export interface SemanticVersion {
  readonly major: number
  readonly minor: number
  readonly patch: number
  readonly prerelease?: string
  readonly build?: string
}

/**
 * I18n 字符串
 */
export type I18nString = string | Record<string, string>

// ==================== 物料定义 ====================

/**
 * 物料定义
 * 
 * 完整描述一个可视化组件
 */
export interface MaterialDefinition {
  /** 协议版本 */
  readonly $protocol: typeof MATERIAL_PROTOCOL_URI
  
  /** 物料 ID（全局唯一） */
  readonly id: string
  
  /** 物料版本 */
  readonly version: SemanticVersion
  
  /** 物料元数据 */
  readonly metadata: MaterialMetadata
  
  /** 物料声明（公共 API） */
  readonly declaration: MaterialDeclaration
  
  /** 物料实现 */
  readonly implementation: MaterialImplementation
  
  /** 物料能力 */
  readonly capabilities: MaterialCapabilities
  
  /** 物料约束 */
  readonly constraints?: MaterialConstraints
  
  /** 物料文档 */
  readonly documentation?: MaterialDocumentation
}

/**
 * 物料元数据
 */
export interface MaterialMetadata {
  /** 显示名称 */
  readonly name: I18nString
  
  /** 描述 */
  readonly description?: I18nString
  
  /** 分类 */
  readonly category: string
  
  /** 子分类 */
  readonly subcategory?: string
  
  /** 图标 */
  readonly icon?: string
  
  /** 缩略图 */
  readonly thumbnail?: string
  
  /** 标签 */
  readonly tags?: readonly string[]
  
  /** 关键词 */
  readonly keywords?: readonly string[]
  
  /** 作者 */
  readonly author?: string
  
  /** 许可证 */
  readonly license?: string
  
  /** 文档 URL */
  readonly documentationUrl?: string
  
  /** 仓库 URL */
  readonly repositoryUrl?: string
  
  /** 状态 */
  readonly status?: 'stable' | 'beta' | 'alpha' | 'deprecated' | 'experimental'
  
  /** 依赖的其他物料 */
  readonly dependencies?: readonly string[]
}

// ==================== 物料声明 ====================

/**
 * 物料声明
 * 
 * 定义物料的公共接口
 */
export interface MaterialDeclaration {
  /** 属性声明 */
  readonly properties: readonly PropertyDeclaration[]
  
  /** 插槽声明 */
  readonly slots?: readonly SlotDeclaration[]
  
  /** 事件声明 */
  readonly events?: readonly EventDeclaration[]
  
  /** 方法声明 */
  readonly methods?: readonly MethodDeclaration[]
  
  /** 状态声明 */
  readonly states?: readonly StateDeclaration[]
}

/**
 * 属性声明
 */
export interface PropertyDeclaration {
  /** 属性名 */
  readonly name: string
  
  /** 属性类型（TypeScript 类型字符串） */
  readonly type: string
  
  /** 属性 Schema（JSON Schema） */
  readonly schema: JSONSchema7
  
  /** 是否必需 */
  readonly required?: boolean
  
  /** 默认值 */
  readonly default?: unknown
  
  /** 属性元数据 */
  readonly metadata: PropertyMetadata
  
  /** 编辑器配置 */
  readonly editor: EditorConfiguration
  
  /** 验证器 */
  readonly validators?: readonly PropertyValidator[]
  
  /** 转换器 */
  readonly transformers?: readonly PropertyTransformer[]
  
  /** 计算属性配置 */
  readonly computed?: ComputedPropertyConfig
  
  /** 数据绑定配置 */
  readonly binding?: DataBindingConfig
}

/**
 * 属性元数据
 */
export interface PropertyMetadata {
  /** 显示标题 */
  readonly title: I18nString
  
  /** 描述 */
  readonly description?: I18nString
  
  /** 分组 */
  readonly group?: string
  
  /** 排序 */
  readonly order?: number
  
  /** 标签 */
  readonly tags?: readonly string[]
  
  /** 是否高级属性 */
  readonly advanced?: boolean
  
  /** 是否实验性 */
  readonly experimental?: boolean
  
  /** 废弃信息 */
  readonly deprecated?: {
    readonly since?: string
    readonly reason?: string
    readonly alternative?: string
  }
}

/**
 * 编辑器配置
 */
export interface EditorConfiguration {
  /** 编辑器类型 */
  readonly type: string
  
  /** 编辑器选项 */
  readonly options?: Record<string, unknown>
  
  /** 编辑器布局 */
  readonly layout?: {
    readonly labelPosition?: 'top' | 'left' | 'inline'
    readonly labelWidth?: number | string
    readonly inline?: boolean
  }
  
  /** 编辑器行为 */
  readonly behavior?: {
    readonly debounce?: number
    readonly throttle?: number
    readonly validateOn?: 'change' | 'blur' | 'submit'
    readonly clearable?: boolean
  }
  
  /** 可见性规则 */
  readonly visibility?: VisibilityRule
  
  /** 禁用规则 */
  readonly disabled?: DisabledRule
  
  /** 编辑器扩展 */
  readonly extensions?: readonly string[]
}

/**
 * 可见性规则
 */
export interface VisibilityRule {
  /** 依赖字段 */
  readonly dependsOn: string | readonly string[]
  
  /** 条件表达式 */
  readonly when: string
  
  /** 表达式语言 */
  readonly language?: 'js' | 'jsonlogic' | 'cel'
}

/**
 * 禁用规则
 */
export interface DisabledRule extends VisibilityRule {
  /** 禁用原因 */
  readonly reason?: I18nString
}

/**
 * 属性验证器
 */
export interface PropertyValidator {
  /** 验证器类型 */
  readonly type: 'builtin' | 'custom' | 'async'
  
  /** 验证器 ID */
  readonly id: string
  
  /** 验证规则 */
  readonly rule: unknown
  
  /** 错误消息 */
  readonly message: I18nString
  
  /** 验证触发时机 */
  readonly trigger?: 'change' | 'blur' | 'submit'
}

/**
 * 属性转换器
 */
export interface PropertyTransformer {
  /** 转换器类型 */
  readonly type: 'input' | 'output' | 'bidirectional'
  
  /** 转换器 ID */
  readonly id: string
  
  /** 转换配置 */
  readonly config?: unknown
}

/**
 * 计算属性配置
 */
export interface ComputedPropertyConfig {
  /** 依赖属性 */
  readonly dependencies: readonly string[]
  
  /** 计算函数 */
  readonly compute: string
  
  /** 是否可缓存 */
  readonly cacheable?: boolean
}

/**
 * 数据绑定配置
 */
export interface DataBindingConfig {
  /** 是否支持绑定 */
  readonly enabled: boolean
  
  /** 绑定类型 */
  readonly type?: 'one-way' | 'two-way'
  
  /** 支持的数据源 */
  readonly sources?: readonly string[]
}

/**
 * 插槽声明
 */
export interface SlotDeclaration {
  /** 插槽名 */
  readonly name: string
  
  /** 插槽类型 */
  readonly type: 'static' | 'dynamic' | 'scoped'
  
  /** 插槽 Schema */
  readonly schema: JSONSchema7
  
  /** 插槽元数据 */
  readonly metadata: {
    readonly title: I18nString
    readonly description?: I18nString
    readonly icon?: string
  }
  
  /** 允许的子物料 */
  readonly accept?: MaterialFilter
  
  /** 插槽约束 */
  readonly constraints?: {
    readonly minChildren?: number
    readonly maxChildren?: number
    readonly unique?: boolean
  }
  
  /** 作用域属性（用于 scoped slot） */
  readonly scopeProps?: Record<string, PropertyDeclaration>
  
  /** 默认内容 */
  readonly defaultContent?: unknown
}

/**
 * 物料过滤器
 */
export interface MaterialFilter {
  /** 允许的物料类型 */
  readonly types?: readonly string[]
  
  /** 允许的物料分类 */
  readonly categories?: readonly string[]
  
  /** 自定义过滤函数 */
  readonly custom?: string
}

/**
 * 事件声明
 */
export interface EventDeclaration {
  /** 事件名 */
  readonly name: string
  
  /** 事件载荷类型 */
  readonly payloadType: string
  
  /** 事件载荷 Schema */
  readonly payloadSchema: JSONSchema7
  
  /** 事件元数据 */
  readonly metadata: {
    readonly title: I18nString
    readonly description?: I18nString
  }
  
  /** 是否可取消 */
  readonly cancelable?: boolean
  
  /** 是否冒泡 */
  readonly bubbles?: boolean
  
  /** 触发时机 */
  readonly trigger?: 'user' | 'system' | 'both'
}

/**
 * 方法声明
 */
export interface MethodDeclaration {
  /** 方法名 */
  readonly name: string
  
  /** 方法签名（TypeScript 函数签名） */
  readonly signature: string
  
  /** 参数声明 */
  readonly parameters: readonly ParameterDeclaration[]
  
  /** 返回类型 */
  readonly returnType: string
  
  /** 返回值 Schema */
  readonly returnSchema?: JSONSchema7
  
  /** 方法元数据 */
  readonly metadata: {
    readonly title: I18nString
    readonly description?: I18nString
  }
  
  /** 是否异步 */
  readonly async?: boolean
  
  /** 是否纯函数 */
  readonly pure?: boolean
}

/**
 * 参数声明
 */
export interface ParameterDeclaration {
  /** 参数名 */
  readonly name: string
  
  /** 参数类型 */
  readonly type: string
  
  /** 参数 Schema */
  readonly schema: JSONSchema7
  
  /** 是否必需 */
  readonly required?: boolean
  
  /** 默认值 */
  readonly default?: unknown
  
  /** 描述 */
  readonly description?: I18nString
}

/**
 * 状态声明
 */
export interface StateDeclaration {
  /** 状态名 */
  readonly name: string
  
  /** 状态类型 */
  readonly type: string
  
  /** 状态 Schema */
  readonly schema: JSONSchema7
  
  /** 初始值 */
  readonly initial?: unknown
  
  /** 状态元数据 */
  readonly metadata: {
    readonly title: I18nString
    readonly description?: I18nString
  }
  
  /** 是否持久化 */
  readonly persistent?: boolean
  
  /** 持久化键 */
  readonly persistKey?: string
  
  /** 是否可观察 */
  readonly observable?: boolean
}

// ==================== 物料实现 ====================

/**
 * 物料实现
 */
export interface MaterialImplementation {
  /** 渲染器实现 */
  readonly renderer: RendererImplementation
  
  /** 生命周期实现 */
  readonly lifecycle?: LifecycleImplementation
  
  /** 逻辑实现 */
  readonly logic?: LogicImplementation
  
  /** 样式实现 */
  readonly styling?: StylingImplementation
  
  /** 资源依赖 */
  readonly assets?: AssetDependencies
}

/**
 * 渲染器实现
 */
export interface RendererImplementation {
  /** 渲染器类型 */
  readonly type: 'react' | 'vue' | 'angular' | 'svelte' | 'web-component' | 'virtual'
  
  /** 主渲染器 */
  readonly main: ComponentReference
  
  /** 响应式渲染器 */
  readonly responsive?: {
    readonly mobile?: ComponentReference
    readonly tablet?: ComponentReference
    readonly desktop?: ComponentReference
  }
  
  /** 编辑时渲染器 */
  readonly editor?: ComponentReference
  
  /** 服务端渲染器 */
  readonly server?: ComponentReference
  
  /** 渲染配置 */
  readonly config?: {
    readonly ssr?: boolean
    readonly lazy?: 'eager' | 'lazy' | 'idle' | 'visible'
    readonly hydration?: 'full' | 'partial' | 'progressive'
  }
}

/**
 * 组件引用
 */
export type ComponentReference =
  | { readonly type: 'inline'; readonly component: unknown }
  | { readonly type: 'module'; readonly path: string; readonly export?: string }
  | { readonly type: 'url'; readonly url: string }
  | { readonly type: 'registry'; readonly id: string }

/**
 * 生命周期实现
 */
export interface LifecycleImplementation {
  readonly onCreate?: LifecycleHook
  readonly onMount?: LifecycleHook
  readonly onUpdate?: LifecycleHook
  readonly onUnmount?: LifecycleHook
  readonly onDestroy?: LifecycleHook
  readonly onError?: ErrorHandler
}

/**
 * 生命周期钩子
 */
export interface LifecycleHook {
  readonly type: 'sync' | 'async' | 'reactive'
  readonly handler: FunctionReference
  readonly priority?: number
  readonly condition?: string
}

/**
 * 函数引用
 */
export type FunctionReference =
  | { readonly type: 'inline'; readonly fn: Function }
  | { readonly type: 'module'; readonly path: string; readonly export: string }
  | { readonly type: 'expression'; readonly expr: string }

/**
 * 错误处理器
 */
export interface ErrorHandler {
  readonly handler: FunctionReference
  readonly fallback?: unknown
}

/**
 * 逻辑实现
 */
export interface LogicImplementation {
  /** 计算属性实现 */
  readonly computed?: Record<string, ComputedImplementation>
  
  /** 监听器实现 */
  readonly watchers?: Record<string, WatcherImplementation>
  
  /** 副作用实现 */
  readonly effects?: readonly EffectImplementation[]
}

/**
 * 计算属性实现
 */
export interface ComputedImplementation {
  readonly dependencies: readonly string[]
  readonly compute: FunctionReference
  readonly cacheable?: boolean
}

/**
 * 监听器实现
 */
export interface WatcherImplementation {
  readonly source: string
  readonly handler: FunctionReference
  readonly immediate?: boolean
  readonly deep?: boolean
}

/**
 * 副作用实现
 */
export interface EffectImplementation {
  readonly handler: FunctionReference
  readonly dependencies?: readonly string[]
  readonly cleanup?: FunctionReference
}

/**
 * 样式实现
 */
export interface StylingImplementation {
  /** 默认样式 */
  readonly default?: Record<string, unknown>
  
  /** 响应式样式 */
  readonly responsive?: {
    readonly mobile?: Record<string, unknown>
    readonly tablet?: Record<string, unknown>
    readonly desktop?: Record<string, unknown>
  }
  
  /** CSS 文件 */
  readonly css?: readonly string[]
  
  /** CSS-in-JS */
  readonly cssInJs?: boolean
  
  /** 样式预设 */
  readonly presets?: readonly StylePreset[]
}

/**
 * 样式预设
 */
export interface StylePreset {
  readonly id: string
  readonly name: I18nString
  readonly description?: I18nString
  readonly style: Record<string, unknown>
  readonly thumbnail?: string
}

/**
 * 资源依赖
 */
export interface AssetDependencies {
  /** 脚本依赖 */
  readonly scripts?: readonly string[]
  
  /** 样式依赖 */
  readonly styles?: readonly string[]
  
  /** 字体依赖 */
  readonly fonts?: readonly string[]
  
  /** 图片资源 */
  readonly images?: readonly string[]
  
  /** 其他资源 */
  readonly other?: readonly string[]
}

// ==================== 物料能力 ====================

/**
 * 物料能力
 */
export interface MaterialCapabilities {
  /** 编辑能力 */
  readonly editing?: EditingCapabilities
  
  /** 交互能力 */
  readonly interaction?: InteractionCapabilities
  
  /** 数据能力 */
  readonly data?: DataCapabilities
  
  /** 布局能力 */
  readonly layout?: LayoutCapabilities
  
  /** 性能能力 */
  readonly performance?: PerformanceCapabilities
  
  /** 无障碍能力 */
  readonly accessibility?: AccessibilityCapabilities
}

/**
 * 编辑能力
 */
export interface EditingCapabilities {
  readonly copyable?: boolean
  readonly cuttable?: boolean
  readonly pasteable?: boolean
  readonly deletable?: boolean
  readonly undoable?: boolean
  readonly redoable?: boolean
  readonly lockable?: boolean
  readonly groupable?: boolean
  readonly modes?: readonly EditMode[]
}

/**
 * 编辑模式
 */
export type EditMode = 'visual' | 'code' | 'preview' | 'split'

/**
 * 交互能力
 */
export interface InteractionCapabilities {
  readonly selectable?: boolean
  readonly hoverable?: boolean
  readonly focusable?: boolean
  readonly draggable?: boolean
  readonly droppable?: boolean
  readonly resizable?: boolean
  readonly rotatable?: boolean
}

/**
 * 数据能力
 */
export interface DataCapabilities {
  readonly binding?: boolean
  readonly datasources?: readonly string[]
  readonly query?: boolean
  readonly computed?: boolean
  readonly expressions?: boolean
  readonly transformers?: readonly string[]
  readonly validators?: readonly string[]
}

/**
 * 布局能力
 */
export interface LayoutCapabilities {
  readonly container?: boolean
  readonly responsive?: boolean
  readonly flexbox?: boolean
  readonly grid?: boolean
  readonly absolute?: boolean
}

/**
 * 性能能力
 */
export interface PerformanceCapabilities {
  readonly virtualized?: boolean
  readonly memoized?: boolean
  readonly lazy?: boolean
  readonly renderCost?: 1 | 2 | 3 | 4 | 5
}

/**
 * 无障碍能力
 */
export interface AccessibilityCapabilities {
  readonly wcagLevel?: 'A' | 'AA' | 'AAA'
  readonly role?: string
  readonly ariaLabels?: boolean
  readonly keyboardNavigation?: boolean
  readonly screenReader?: boolean
}

// ==================== 物料约束 ====================

/**
 * 物料约束
 */
export interface MaterialConstraints {
  /** 父级约束 */
  readonly parent?: {
    readonly allow?: readonly string[]
    readonly deny?: readonly string[]
    readonly required?: boolean
  }
  
  /** 子级约束 */
  readonly children?: {
    readonly allow?: readonly string[]
    readonly deny?: readonly string[]
    readonly min?: number
    readonly max?: number
    readonly unique?: boolean
  }
  
  /** 位置约束 */
  readonly placement?: {
    readonly areas?: readonly string[]
    readonly minLevel?: number
    readonly maxLevel?: number
  }
  
  /** 数量约束 */
  readonly occurrence?: {
    readonly min?: number
    readonly max?: number
    readonly unique?: boolean
    readonly scope?: 'global' | 'parent' | 'page'
  }
}

// ==================== 物料文档 ====================

/**
 * 物料文档
 */
export interface MaterialDocumentation {
  /** 概述 */
  readonly overview?: I18nString
  
  /** 使用指南 */
  readonly guide?: I18nString
  
  /** 示例 */
  readonly examples?: readonly MaterialExample[]
  
  /** API 文档 */
  readonly api?: I18nString
  
  /** 变更日志 */
  readonly changelog?: readonly ChangelogEntry[]
  
  /** 迁移指南 */
  readonly migration?: I18nString
}

/**
 * 物料示例
 */
export interface MaterialExample {
  readonly id: string
  readonly name: I18nString
  readonly description?: I18nString
  readonly code: string
  readonly data: unknown
  readonly screenshot?: string
}

/**
 * 变更日志条目
 */
export interface ChangelogEntry {
  readonly version: string
  readonly date: string
  readonly changes: readonly string[]
  readonly breaking?: readonly string[]
}

