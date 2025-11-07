/**
 * 数据协议 - 支持数据源、数据绑定和数据流
 * 
 * 提供完整的数据管理能力，类似于 Figma 的变量系统和 Notion 的数据库
 * 
 * @packageDocumentation
 */

// 使用本地类型定义以避免外部依赖
export type JSONSchema7 = Record<string, unknown>
import type { I18nString } from '../material/MaterialProtocol'

// ==================== 数据协议 URI ====================

export const DATA_PROTOCOL_URI = 'lcedit://protocols/data/v1' as const

// ==================== 数据源定义 ====================

/**
 * 数据源定义
 * 
 * 定义一个数据源，可以是静态数据、API、数据库等
 */
export interface DataSourceDefinition {
  /** 协议版本 */
  readonly $protocol: typeof DATA_PROTOCOL_URI
  
  /** 数据源 ID（全局唯一） */
  readonly id: string
  
  /** 数据源名称 */
  readonly name: I18nString
  
  /** 数据源描述 */
  readonly description?: I18nString
  
  /** 数据源类型 */
  readonly type: DataSourceType
  
  /** 数据源配置 */
  readonly config: DataSourceConfig
  
  /** 数据 Schema */
  readonly schema: DataSchema
  
  /** 数据源元数据 */
  readonly metadata?: DataSourceMetadata
  
  /** 是否启用缓存 */
  readonly cache?: CacheConfig
  
  /** 刷新策略 */
  readonly refresh?: RefreshStrategy
  
  /** 错误处理 */
  readonly errorHandling?: ErrorHandlingConfig
}

/**
 * 数据源类型
 */
export type DataSourceType =
  | 'static'        // 静态数据
  | 'json'          // JSON 文件
  | 'rest'          // REST API
  | 'graphql'       // GraphQL API
  | 'websocket'     // WebSocket
  | 'localstorage'  // LocalStorage
  | 'sessionstorage'// SessionStorage
  | 'indexeddb'     // IndexedDB
  | 'firebase'      // Firebase
  | 'supabase'      // Supabase
  | 'airtable'      // Airtable
  | 'notion'        // Notion
  | 'mongodb'       // MongoDB
  | 'postgresql'    // PostgreSQL
  | 'mysql'         // MySQL
  | 'custom'        // 自定义数据源

/**
 * 数据源配置
 */
export type DataSourceConfig =
  | StaticDataConfig
  | JSONDataConfig
  | RESTDataConfig
  | GraphQLDataConfig
  | WebSocketDataConfig
  | StorageDataConfig
  | DatabaseDataConfig
  | CustomDataConfig

/**
 * 静态数据配置
 */
export interface StaticDataConfig {
  readonly type: 'static'
  readonly data: unknown
}

/**
 * JSON 数据配置
 */
export interface JSONDataConfig {
  readonly type: 'json'
  readonly url: string
  readonly headers?: Record<string, string>
}

/**
 * REST API 配置
 */
export interface RESTDataConfig {
  readonly type: 'rest'
  readonly baseUrl: string
  readonly endpoints: Record<string, RESTEndpoint>
  readonly headers?: Record<string, string>
  readonly authentication?: AuthenticationConfig
  readonly timeout?: number
  readonly retry?: RetryConfig
}

/**
 * REST 端点
 */
export interface RESTEndpoint {
  readonly path: string
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  readonly headers?: Record<string, string>
  readonly params?: Record<string, string>
  readonly body?: unknown
  readonly transform?: string  // 数据转换函数（JS 表达式）
}

/**
 * GraphQL 配置
 */
export interface GraphQLDataConfig {
  readonly type: 'graphql'
  readonly endpoint: string
  readonly queries: Record<string, GraphQLQuery>
  readonly mutations?: Record<string, GraphQLMutation>
  readonly subscriptions?: Record<string, GraphQLSubscription>
  readonly headers?: Record<string, string>
  readonly authentication?: AuthenticationConfig
}

/**
 * GraphQL 查询
 */
export interface GraphQLQuery {
  readonly query: string
  readonly variables?: Record<string, unknown>
  readonly transform?: string
}

/**
 * GraphQL 变更
 */
export interface GraphQLMutation {
  readonly mutation: string
  readonly variables?: Record<string, unknown>
  readonly transform?: string
}

/**
 * GraphQL 订阅
 */
export interface GraphQLSubscription {
  readonly subscription: string
  readonly variables?: Record<string, unknown>
  readonly transform?: string
}

/**
 * WebSocket 配置
 */
export interface WebSocketDataConfig {
  readonly type: 'websocket'
  readonly url: string
  readonly protocols?: readonly string[]
  readonly reconnect?: boolean
  readonly reconnectInterval?: number
  readonly messageHandlers?: Record<string, string>  // 消息处理函数
}

/**
 * 存储配置
 */
export interface StorageDataConfig {
  readonly type: 'localstorage' | 'sessionstorage' | 'indexeddb'
  readonly key: string
  readonly serialize?: string  // 序列化函数
  readonly deserialize?: string  // 反序列化函数
}

/**
 * 数据库配置
 */
export interface DatabaseDataConfig {
  readonly type: 'firebase' | 'supabase' | 'airtable' | 'notion' | 'mongodb' | 'postgresql' | 'mysql'
  readonly connectionString?: string
  readonly apiKey?: string
  readonly projectId?: string
  readonly collection?: string
  readonly table?: string
  readonly database?: string
  readonly queries?: Record<string, string>
}

/**
 * 自定义数据源配置
 */
export interface CustomDataConfig {
  readonly type: 'custom'
  readonly adapter: string  // 适配器 ID
  readonly config: Record<string, unknown>
}

/**
 * 认证配置
 */
export interface AuthenticationConfig {
  readonly type: 'none' | 'basic' | 'bearer' | 'api-key' | 'oauth2'
  readonly credentials?: Record<string, string>
  readonly tokenEndpoint?: string
  readonly refreshEndpoint?: string
}

/**
 * 重试配置
 */
export interface RetryConfig {
  readonly maxAttempts: number
  readonly delay: number
  readonly backoff?: 'linear' | 'exponential'
  readonly retryOn?: readonly number[]  // HTTP 状态码
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  readonly enabled: boolean
  readonly strategy: 'memory' | 'localstorage' | 'indexeddb'
  readonly ttl?: number  // 缓存时间（毫秒）
  readonly key?: string
}

/**
 * 刷新策略
 */
export interface RefreshStrategy {
  readonly mode: 'manual' | 'auto' | 'realtime'
  readonly interval?: number  // 自动刷新间隔（毫秒）
  readonly onFocus?: boolean  // 窗口获得焦点时刷新
  readonly onReconnect?: boolean  // 网络重连时刷新
}

/**
 * 错误处理配置
 */
export interface ErrorHandlingConfig {
  readonly strategy: 'throw' | 'log' | 'silent' | 'fallback'
  readonly fallbackData?: unknown
  readonly onError?: string  // 错误处理函数（JS 表达式）
}

/**
 * 数据源元数据
 */
export interface DataSourceMetadata {
  readonly version?: string
  readonly author?: string
  readonly tags?: readonly string[]
  readonly documentation?: string
  readonly [key: `x-${string}`]: unknown
}

// ==================== 数据 Schema ====================

/**
 * 数据 Schema
 * 
 * 定义数据的结构和类型
 */
export interface DataSchema {
  /** Schema 类型 */
  readonly type: DataSchemaType
  
  /** 字段定义 */
  readonly fields?: Record<string, DataField>
  
  /** 项 Schema（数组类型） */
  readonly items?: DataSchema
  
  /** JSON Schema 引用 */
  readonly jsonSchema?: JSONSchema7
  
  /** 验证规则 */
  readonly validation?: DataValidation
}

/**
 * 数据 Schema 类型
 */
export type DataSchemaType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'object'
  | 'array'
  | 'enum'
  | 'reference'
  | 'custom'

/**
 * 数据字段
 */
export interface DataField {
  /** 字段名称 */
  readonly name: string
  
  /** 字段类型 */
  readonly type: DataSchemaType
  
  /** 字段标题 */
  readonly title?: I18nString
  
  /** 字段描述 */
  readonly description?: I18nString
  
  /** 是否必需 */
  readonly required?: boolean
  
  /** 默认值 */
  readonly default?: unknown
  
  /** 验证规则 */
  readonly validation?: FieldValidation
  
  /** 是否唯一 */
  readonly unique?: boolean
  
  /** 是否索引 */
  readonly indexed?: boolean
  
  /** 引用（reference 类型） */
  readonly ref?: string
  
  /** 枚举值（enum 类型） */
  readonly enum?: readonly unknown[]
  
  /** 格式 */
  readonly format?: string
  
  /** 转换函数 */
  readonly transform?: string
  
  /** 计算字段 */
  readonly computed?: string
  
  /** 字段元数据 */
  readonly metadata?: Record<string, unknown>
}

/**
 * 数据验证
 */
export interface DataValidation {
  readonly required?: readonly string[]
  readonly custom?: string  // 自定义验证函数（JS 表达式）
}

/**
 * 字段验证
 */
export interface FieldValidation {
  readonly min?: number
  readonly max?: number
  readonly minLength?: number
  readonly maxLength?: number
  readonly pattern?: string
  readonly email?: boolean
  readonly url?: boolean
  readonly custom?: string  // 自定义验证函数（JS 表达式）
}

// ==================== 数据绑定 ====================

/**
 * 数据绑定定义
 * 
 * 定义物料属性如何绑定到数据源
 */
export interface DataBinding {
  /** 绑定 ID */
  readonly id: string
  
  /** 数据源 ID */
  readonly sourceId: string
  
  /** 数据路径 */
  readonly path: string
  
  /** 绑定模式 */
  readonly mode: BindingMode
  
  /** 转换器 */
  readonly transform?: DataTransform
  
  /** 格式化器 */
  readonly format?: DataFormat
  
  /** 验证器 */
  readonly validate?: string  // 验证函数（JS 表达式）
  
  /** 默认值 */
  readonly fallback?: unknown
  
  /** 是否启用 */
  readonly enabled?: boolean
}

/**
 * 绑定模式
 */
export type BindingMode =
  | 'one-way'       // 单向绑定（数据源 -> 视图）
  | 'two-way'       // 双向绑定（数据源 <-> 视图）
  | 'one-time'      // 一次性绑定
  | 'manual'        // 手动绑定

/**
 * 数据转换
 */
export interface DataTransform {
  /** 转换类型 */
  readonly type: 'function' | 'mapping' | 'filter' | 'sort' | 'aggregate'
  
  /** 转换函数（JS 表达式） */
  readonly fn?: string
  
  /** 映射配置 */
  readonly mapping?: Record<string, string>
  
  /** 过滤条件 */
  readonly filter?: string
  
  /** 排序配置 */
  readonly sort?: SortConfig
  
  /** 聚合配置 */
  readonly aggregate?: AggregateConfig
}

/**
 * 排序配置
 */
export interface SortConfig {
  readonly field: string
  readonly order: 'asc' | 'desc'
}

/**
 * 聚合配置
 */
export interface AggregateConfig {
  readonly operation: 'sum' | 'avg' | 'min' | 'max' | 'count'
  readonly field?: string
}

/**
 * 数据格式化
 */
export interface DataFormat {
  /** 格式化类型 */
  readonly type: 'number' | 'date' | 'time' | 'datetime' | 'currency' | 'percentage' | 'custom'
  
  /** 格式化选项 */
  readonly options?: DataFormatOptions
  
  /** 自定义格式化函数 */
  readonly custom?: string
}

/**
 * 格式化选项
 */
export interface DataFormatOptions {
  readonly locale?: string
  readonly currency?: string
  readonly minimumFractionDigits?: number
  readonly maximumFractionDigits?: number
  readonly dateStyle?: 'full' | 'long' | 'medium' | 'short'
  readonly timeStyle?: 'full' | 'long' | 'medium' | 'short'
  readonly timeZone?: string
}

// ==================== 数据变量系统 ====================

/**
 * 数据变量定义
 * 
 * 类似于 Figma 的变量系统
 */
export interface DataVariable {
  /** 变量 ID */
  readonly id: string
  
  /** 变量名称 */
  readonly name: string
  
  /** 变量类型 */
  readonly type: VariableType
  
  /** 变量值 */
  readonly value: unknown
  
  /** 变量作用域 */
  readonly scope: VariableScope
  
  /** 变量分组 */
  readonly group?: string
  
  /** 变量描述 */
  readonly description?: I18nString
  
  /** 是否可变 */
  readonly mutable?: boolean
  
  /** 别名（引用其他变量） */
  readonly alias?: string
  
  /** 变量元数据 */
  readonly metadata?: Record<string, unknown>
}

/**
 * 变量类型
 */
export type VariableType =
  | 'color'
  | 'number'
  | 'string'
  | 'boolean'
  | 'object'
  | 'array'

/**
 * 变量作用域
 */
export type VariableScope =
  | 'global'      // 全局变量
  | 'document'    // 文档级变量
  | 'page'        // 页面级变量
  | 'component'   // 组件级变量
  | 'local'       // 局部变量

// ==================== 数据流 ====================

/**
 * 数据流定义
 * 
 * 定义数据的流向和处理管道
 */
export interface DataFlow {
  /** 数据流 ID */
  readonly id: string
  
  /** 数据流名称 */
  readonly name: I18nString
  
  /** 数据流描述 */
  readonly description?: I18nString
  
  /** 输入节点 */
  readonly inputs: readonly DataFlowNode[]
  
  /** 处理节点 */
  readonly processors: readonly DataFlowNode[]
  
  /** 输出节点 */
  readonly outputs: readonly DataFlowNode[]
  
  /** 连接 */
  readonly connections: readonly DataFlowConnection[]
  
  /** 是否启用 */
  readonly enabled?: boolean
  
  /** 触发条件 */
  readonly trigger?: DataFlowTrigger
}

/**
 * 数据流节点
 */
export interface DataFlowNode {
  /** 节点 ID */
  readonly id: string
  
  /** 节点类型 */
  readonly type: DataFlowNodeType
  
  /** 节点配置 */
  readonly config: Record<string, unknown>
  
  /** 输入端口 */
  readonly inputs?: readonly DataFlowPort[]
  
  /** 输出端口 */
  readonly outputs?: readonly DataFlowPort[]
}

/**
 * 数据流节点类型
 */
export type DataFlowNodeType =
  | 'source'        // 数据源节点
  | 'transform'     // 转换节点
  | 'filter'        // 过滤节点
  | 'merge'         // 合并节点
  | 'split'         // 分割节点
  | 'aggregate'     // 聚合节点
  | 'sort'          // 排序节点
  | 'map'           // 映射节点
  | 'reduce'        // 归约节点
  | 'output'        // 输出节点
  | 'custom'        // 自定义节点

/**
 * 数据流端口
 */
export interface DataFlowPort {
  readonly id: string
  readonly name: string
  readonly type: string
  readonly required?: boolean
}

/**
 * 数据流连接
 */
export interface DataFlowConnection {
  readonly id: string
  readonly from: {
    readonly nodeId: string
    readonly portId: string
  }
  readonly to: {
    readonly nodeId: string
    readonly portId: string
  }
}

/**
 * 数据流触发器
 */
export interface DataFlowTrigger {
  readonly type: 'manual' | 'auto' | 'event' | 'schedule'
  readonly event?: string
  readonly schedule?: string  // Cron 表达式
  readonly condition?: string  // 触发条件（JS 表达式）
}

// ==================== 数据查询 ====================

/**
 * 数据查询定义
 */
export interface DataQuery {
  /** 查询 ID */
  readonly id: string
  
  /** 数据源 ID */
  readonly sourceId: string
  
  /** 查询类型 */
  readonly type: QueryType
  
  /** 查询参数 */
  readonly params: QueryParams
  
  /** 查询转换 */
  readonly transform?: DataTransform
  
  /** 是否启用缓存 */
  readonly cache?: boolean
}

/**
 * 查询类型
 */
export type QueryType =
  | 'find'        // 查找单条
  | 'findMany'    // 查找多条
  | 'count'       // 计数
  | 'aggregate'   // 聚合
  | 'custom'      // 自定义查询

/**
 * 查询参数
 */
export interface QueryParams {
  readonly where?: Record<string, unknown>
  readonly select?: readonly string[]
  readonly orderBy?: Record<string, 'asc' | 'desc'>
  readonly skip?: number
  readonly take?: number
  readonly include?: Record<string, boolean>
}

// ==================== 数据操作 ====================

/**
 * 数据操作定义
 */
export interface DataOperation {
  /** 操作类型 */
  readonly type: OperationType
  
  /** 数据源 ID */
  readonly sourceId: string
  
  /** 操作参数 */
  readonly params: OperationParams
  
  /** 是否乐观更新 */
  readonly optimistic?: boolean
  
  /** 成功回调 */
  readonly onSuccess?: string
  
  /** 失败回调 */
  readonly onError?: string
}

/**
 * 操作类型
 */
export type OperationType =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'upsert'
  | 'batch'

/**
 * 操作参数
 */
export interface OperationParams {
  readonly where?: Record<string, unknown>
  readonly data?: Record<string, unknown>
  readonly operations?: readonly DataOperation[]  // 批量操作
}

// ==================== 数据状态 ====================

/**
 * 数据状态
 */
export interface DataState<T = unknown> {
  /** 数据 */
  readonly data: T | null
  
  /** 加载状态 */
  readonly loading: boolean
  
  /** 错误 */
  readonly error: Error | null
  
  /** 是否陈旧 */
  readonly stale: boolean
  
  /** 最后更新时间 */
  readonly updatedAt: number
  
  /** 元数据 */
  readonly metadata?: Record<string, unknown>
}

// ==================== 数据钩子 ====================

/**
 * 数据钩子
 */
export interface DataHooks {
  /** 加载前 */
  readonly beforeLoad?: (context: DataHookContext) => void | Promise<void>
  
  /** 加载后 */
  readonly afterLoad?: (context: DataHookContext, data: unknown) => void | Promise<void>
  
  /** 更新前 */
  readonly beforeUpdate?: (context: DataHookContext, data: unknown) => void | Promise<void>
  
  /** 更新后 */
  readonly afterUpdate?: (context: DataHookContext, data: unknown) => void | Promise<void>
  
  /** 删除前 */
  readonly beforeDelete?: (context: DataHookContext) => void | Promise<void>
  
  /** 删除后 */
  readonly afterDelete?: (context: DataHookContext) => void | Promise<void>
  
  /** 错误处理 */
  readonly onError?: (context: DataHookContext, error: Error) => void | Promise<void>
}

/**
 * 数据钩子上下文
 */
export interface DataHookContext {
  readonly sourceId: string
  readonly operation: string
  readonly params: unknown
  readonly timestamp: number
  readonly metadata: Record<string, unknown>
}

