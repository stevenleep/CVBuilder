/**
 * 通用类型定义
 * 
 * 提供跨协议使用的基础类型
 * 
 * @packageDocumentation
 */

// ==================== 基础类型 ====================

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
 * 国际化字符串
 * 
 * 支持两种形式：
 * 1. 直接字符串（默认为英文）
 * 2. 语言映射对象
 * 
 * @example
 * ```typescript
 * const simple: I18nString = "Hello"
 * const multi: I18nString = { en: "Hello", "zh-CN": "你好" }
 * ```
 */
export type I18nString = string | Record<string, string>

/**
 * 时间戳（毫秒）
 */
export type Timestamp = number

/**
 * UUID 字符串
 */
export type UUID = string

/**
 * URL 字符串
 */
export type URL = string

/**
 * 颜色值（支持多种格式）
 */
export type Color = string // hex, rgb, rgba, hsl, hsla, named

/**
 * JSON 值类型
 */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

/**
 * JSON 对象类型
 */
export type JSONObject = { [key: string]: JSONValue }

/**
 * JSON 数组类型
 */
export type JSONArray = JSONValue[]

// ==================== 元数据类型 ====================

/**
 * 协议元数据
 */
export interface ProtocolMetadata {
  /** 协议 URI */
  readonly $protocol: string
  
  /** 协议版本 */
  readonly $version: SemanticVersion
  
  /** 唯一标识符 */
  readonly $id: string
  
  /** JSON Schema 引用（可选） */
  readonly $schema?: string
}

/**
 * 扩展属性
 * 
 * 使用 x- 前缀的自定义属性
 */
export type ExtensionProps = {
  readonly [key: `x-${string}`]: unknown
}

/**
 * 废弃信息
 */
export interface DeprecationInfo {
  /** 是否已废弃 */
  readonly deprecated: true
  
  /** 废弃原因 */
  readonly reason?: I18nString
  
  /** 废弃版本 */
  readonly since?: string
  
  /** 移除版本 */
  readonly removedIn?: string
  
  /** 替代方案 */
  readonly alternative?: string
}

// ==================== 引用类型 ====================

/**
 * 资源引用
 */
export interface ResourceReference {
  /** 引用类型 */
  readonly $refType: string
  
  /** 引用 ID */
  readonly $refId: string
  
  /** 引用版本 */
  readonly $refVersion?: SemanticVersion
  
  /** 引用 URL */
  readonly $refUrl?: string
}

// ==================== 位置和尺寸 ====================

/**
 * 位置
 */
export interface Position {
  readonly x: number
  readonly y: number
}

/**
 * 尺寸
 */
export interface Size {
  readonly width: number
  readonly height: number
}

/**
 * 矩形区域
 */
export interface Rectangle {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

/**
 * 边距
 */
export interface Spacing {
  readonly top: number
  readonly right: number
  readonly bottom: number
  readonly left: number
}

// ==================== 结果类型 ====================

/**
 * 操作结果（函数式错误处理）
 */
export type Result<T, E = Error> = Success<T> | Failure<E>

/**
 * 成功结果
 */
export interface Success<T> {
  readonly success: true
  readonly value: T
  readonly metadata?: Record<string, unknown>
}

/**
 * 失败结果
 */
export interface Failure<E = Error> {
  readonly success: false
  readonly error: E
  readonly metadata?: Record<string, unknown>
}

/**
 * 可选结果（可能为空）
 */
export type Optional<T> = T | null | undefined

/**
 * 异步结果
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>

// ==================== 验证类型 ====================

/**
 * 验证结果
 */
export interface ValidationResult {
  /** 是否有效 */
  readonly valid: boolean
  
  /** 错误列表 */
  readonly errors?: readonly ValidationError[]
  
  /** 警告列表 */
  readonly warnings?: readonly ValidationWarning[]
  
  /** 元数据 */
  readonly metadata?: Record<string, unknown>
}

/**
 * 验证错误
 */
export interface ValidationError {
  /** 错误代码 */
  readonly code: string
  
  /** 错误消息 */
  readonly message: I18nString
  
  /** 错误路径 */
  readonly path?: string
  
  /** 错误值 */
  readonly value?: unknown
  
  /** 严重级别 */
  readonly severity: 'error' | 'critical'
  
  /** 详细信息 */
  readonly details?: Record<string, unknown>
}

/**
 * 验证警告
 */
export interface ValidationWarning {
  /** 警告代码 */
  readonly code: string
  
  /** 警告消息 */
  readonly message: I18nString
  
  /** 警告路径 */
  readonly path?: string
  
  /** 警告值 */
  readonly value?: unknown
  
  /** 严重级别 */
  readonly severity: 'warning' | 'info'
  
  /** 详细信息 */
  readonly details?: Record<string, unknown>
}

// ==================== 资源释放 ====================

/**
 * 可释放资源
 */
export interface Disposable {
  /**
   * 释放资源
   */
  dispose(): void | Promise<void>
}

/**
 * 订阅（可取消）
 */
export interface Subscription extends Disposable {
  /**
   * 是否已取消
   */
  readonly isCanceled: boolean
  
  /**
   * 取消订阅
   */
  cancel(): void
}

// ==================== 权限和安全 ====================

/**
 * 权限定义
 */
export interface Permission {
  /** 权限 ID */
  readonly id: string
  
  /** 权限名称 */
  readonly name: I18nString
  
  /** 权限描述 */
  readonly description?: I18nString
  
  /** 权限级别 */
  readonly level: PermissionLevel
  
  /** 权限范围 */
  readonly scope?: string[]
}

/**
 * 权限级别
 */
export type PermissionLevel =
  | 'read'      // 只读
  | 'write'     // 读写
  | 'execute'   // 执行
  | 'admin'     // 管理员
  | 'owner'     // 所有者

/**
 * 安全上下文
 */
export interface SecurityContext {
  /** 用户 ID */
  readonly userId?: string
  
  /** 角色 */
  readonly roles: readonly string[]
  
  /** 权限 */
  readonly permissions: readonly string[]
  
  /** 是否已认证 */
  readonly authenticated: boolean
  
  /** 认证令牌 */
  readonly token?: string
}

// ==================== 分页 ====================

/**
 * 分页参数
 */
export interface PaginationParams {
  /** 页码（从 1 开始） */
  readonly page: number
  
  /** 每页数量 */
  readonly pageSize: number
  
  /** 排序字段 */
  readonly sortBy?: string
  
  /** 排序方向 */
  readonly sortOrder?: 'asc' | 'desc'
}

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  /** 数据列表 */
  readonly items: readonly T[]
  
  /** 总数 */
  readonly total: number
  
  /** 当前页 */
  readonly page: number
  
  /** 每页数量 */
  readonly pageSize: number
  
  /** 总页数 */
  readonly totalPages: number
  
  /** 是否有下一页 */
  readonly hasNext: boolean
  
  /** 是否有上一页 */
  readonly hasPrevious: boolean
}

// ==================== 工具类型 ====================

/**
 * 深度只读
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

/**
 * 深度部分可选
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}

/**
 * 提取属性类型
 */
export type ExtractType<T, K extends keyof T> = T[K]

/**
 * 排除属性
 */
export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/**
 * 必需属性
 */
export type RequireProps<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * 构造函数类型
 */
export type Constructor<T = any> = new (...args: any[]) => T

/**
 * 抽象构造函数类型
 */
export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T

/**
 * 函数类型
 */
export type AnyFunction = (...args: any[]) => any

/**
 * 异步函数类型
 */
export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>

/**
 * 回调函数类型
 */
export type Callback<T = void> = (value: T) => void

/**
 * 谓词函数类型
 */
export type Predicate<T> = (value: T) => boolean

/**
 * 比较函数类型
 */
export type Comparator<T> = (a: T, b: T) => number

/**
 * 映射函数类型
 */
export type Mapper<T, R> = (value: T) => R

/**
 * 归约函数类型
 */
export type Reducer<T, R> = (accumulator: R, value: T) => R

// ==================== 常量 ====================

/**
 * 空对象常量
 */
export const EMPTY_OBJECT: Readonly<Record<string, never>> = Object.freeze({})

/**
 * 空数组常量
 */
export const EMPTY_ARRAY: readonly never[] = Object.freeze([])

/**
 * 空函数
 */
export const NOOP = (): void => {}

/**
 * 恒等函数
 */
export const IDENTITY = <T>(value: T): T => value

