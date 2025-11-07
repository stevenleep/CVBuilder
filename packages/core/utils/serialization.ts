/**
 * 序列化工具
 * 
 * 提供数据序列化、反序列化、深拷贝等功能
 * 
 * @packageDocumentation
 */

// Types are referenced in JSDoc comments

// ==================== 序列化选项 ====================

/**
 * 序列化选项
 */
export interface SerializationOptions {
  /** 是否美化输出 */
  readonly pretty?: boolean
  
  /** 缩进空格数 */
  readonly indent?: number
  
  /** 是否忽略未定义的值 */
  readonly skipUndefined?: boolean
  
  /** 是否忽略 null */
  readonly skipNull?: boolean
  
  /** 是否忽略空字符串 */
  readonly skipEmptyString?: boolean
  
  /** 最大递归深度 */
  readonly maxDepth?: number
  
  /** 自定义序列化器 */
  readonly replacer?: (key: string, value: unknown) => unknown
}

/**
 * 反序列化选项
 */
export interface DeserializationOptions {
  /** 自定义反序列化器 */
  readonly reviver?: (key: string, value: unknown) => unknown
  
  /** 是否验证数据 */
  readonly validate?: boolean
  
  /** 验证器 */
  readonly validator?: (value: unknown) => boolean
}

// ==================== JSON 序列化 ====================

/**
 * JSON 序列化器
 */
export class JSONSerializer {
  /**
   * 序列化为 JSON 字符串
   */
  static stringify(value: unknown, options?: SerializationOptions): string {
    const replacer = this.createReplacer(options)
    const indent = options?.pretty ? (options.indent ?? 2) : undefined
    
    return JSON.stringify(value, replacer, indent)
  }
  
  /**
   * 从 JSON 字符串反序列化
   */
  static parse<T = unknown>(
    json: string,
    options?: DeserializationOptions
  ): T {
    const value = JSON.parse(json, options?.reviver) as T
    
    if (options?.validate && options.validator) {
      if (!options.validator(value)) {
        throw new Error('Validation failed after deserialization')
      }
    }
    
    return value
  }
  
  /**
   * 创建replacer函数
   */
  private static createReplacer(
    options?: SerializationOptions
  ): (key: string, value: unknown) => unknown {
    return (key: string, value: unknown) => {
      // 应用自定义replacer
      if (options?.replacer) {
        value = options.replacer(key, value)
      }
      
      // 跳过undefined
      if (options?.skipUndefined && value === undefined) {
        return undefined
      }
      
      // 跳过null
      if (options?.skipNull && value === null) {
        return undefined
      }
      
      // 跳过空字符串
      if (options?.skipEmptyString && value === '') {
        return undefined
      }
      
      return value
    }
  }
}

// ==================== 深拷贝 ====================

/**
 * 深拷贝选项
 */
export interface DeepCloneOptions {
  /** 最大递归深度 */
  readonly maxDepth?: number
  
  /** 是否拷贝函数 */
  readonly cloneFunctions?: boolean
  
  /** 是否拷贝符号 */
  readonly cloneSymbols?: boolean
  
  /** 自定义克隆器 */
  readonly customCloner?: (value: unknown) => unknown
}

/**
 * 深拷贝
 */
export function deepClone<T>(value: T, options?: DeepCloneOptions): T {
  return deepCloneInternal(value, options, 0, new WeakMap())
}

function deepCloneInternal<T>(
  value: T,
  options: DeepCloneOptions | undefined,
  depth: number,
  cache: WeakMap<object, unknown>
): T {
  // 检查最大深度
  if (options?.maxDepth !== undefined && depth > options.maxDepth) {
    return value
  }
  
  // 基本类型直接返回
  if (value === null || typeof value !== 'object') {
    return value
  }
  
  // 应用自定义克隆器
  if (options?.customCloner) {
    const custom = options.customCloner(value)
    if (custom !== undefined) {
      return custom as T
    }
  }
  
  // 检查循环引用
  if (cache.has(value as object)) {
    return cache.get(value as object) as T
  }
  
  // 处理日期
  if (value instanceof Date) {
    return new Date(value.getTime()) as T
  }
  
  // 处理正则表达式
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as T
  }
  
  // 处理Map
  if (value instanceof Map) {
    const cloned = new Map()
    cache.set(value, cloned)
    value.forEach((v, k) => {
      cloned.set(
        deepCloneInternal(k, options, depth + 1, cache),
        deepCloneInternal(v, options, depth + 1, cache)
      )
    })
    return cloned as T
  }
  
  // 处理Set
  if (value instanceof Set) {
    const cloned = new Set()
    cache.set(value, cloned)
    value.forEach(v => {
      cloned.add(deepCloneInternal(v, options, depth + 1, cache))
    })
    return cloned as T
  }
  
  // 处理数组
  if (Array.isArray(value)) {
    const cloned: unknown[] = []
    cache.set(value, cloned)
    value.forEach(item => {
      cloned.push(deepCloneInternal(item, options, depth + 1, cache))
    })
    return cloned as T
  }
  
  // 处理对象
  const cloned: Record<string, unknown> = {}
  cache.set(value, cloned)
  
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      cloned[key] = deepCloneInternal(
        value[key],
        options,
        depth + 1,
        cache
      )
    }
  }
  
  return cloned as T
}

// ==================== 深度比较 ====================

/**
 * 深度比较两个值是否相等
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  // 基本类型比较
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object') return false
  
  // 日期比较
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }
  
  // 正则表达式比较
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags
  }
  
  // 数组比较
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => deepEqual(item, b[index]))
  }
  
  // 对象比较
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  
  if (aKeys.length !== bKeys.length) return false
  
  return aKeys.every(key => {
    return Object.prototype.hasOwnProperty.call(b, key) &&
           deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
  })
}

// ==================== 深度合并 ====================

/**
 * 深度合并对象
 */
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target
  
  const source = sources.shift()
  if (!source) return deepMerge(target, ...sources)
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key]
        const targetValue = (target as Record<string, unknown>)[key]
        
        if (isObject(sourceValue) && isObject(targetValue)) {
          (target as Record<string, unknown>)[key] = deepMerge(
            { ...targetValue },
            sourceValue
          )
        } else {
          (target as Record<string, unknown>)[key] = sourceValue
        }
      }
    }
  }
  
  return deepMerge(target, ...sources)
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

// ==================== 对象扁平化 ====================

/**
 * 扁平化对象
 * 
 * @example
 * flatten({ a: { b: { c: 1 } } }) // { 'a.b.c': 1 }
 */
export function flatten(
  obj: Record<string, unknown>,
  prefix = '',
  separator = '.'
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      const newKey = prefix ? `${prefix}${separator}${key}` : key
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flatten(value as Record<string, unknown>, newKey, separator))
      } else {
        result[newKey] = value
      }
    }
  }
  
  return result
}

/**
 * 反扁平化对象
 * 
 * @example
 * unflatten({ 'a.b.c': 1 }) // { a: { b: { c: 1 } } }
 */
export function unflatten(
  obj: Record<string, unknown>,
  separator = '.'
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const keys = key.split(separator)
      let current = result
      
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i]
        if (!(k in current)) {
          current[k] = {}
        }
        current = current[k] as Record<string, unknown>
      }
      
      current[keys[keys.length - 1]] = obj[key]
    }
  }
  
  return result
}

// ==================== 对象路径操作 ====================

/**
 * 通过路径获取对象值
 * 
 * @example
 * getByPath({ a: { b: { c: 1 } } }, 'a.b.c') // 1
 */
export function getByPath<T = unknown>(
  obj: unknown,
  path: string,
  separator = '.'
): T | undefined {
  const keys = path.split(separator)
  let current: unknown = obj
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[key]
  }
  
  return current as T
}

/**
 * 通过路径设置对象值
 * 
 * @example
 * setByPath({}, 'a.b.c', 1) // { a: { b: { c: 1 } } }
 */
export function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
  separator = '.'
): void {
  const keys = path.split(separator)
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }
  
  current[keys[keys.length - 1]] = value
}

/**
 * 通过路径删除对象值
 * 
 * @example
 * deleteByPath({ a: { b: { c: 1 } } }, 'a.b.c') // { a: { b: {} } }
 */
export function deleteByPath(
  obj: Record<string, unknown>,
  path: string,
  separator = '.'
): boolean {
  const keys = path.split(separator)
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      return false
    }
    current = current[key] as Record<string, unknown>
  }
  
  const lastKey = keys[keys.length - 1]
  if (lastKey in current) {
    delete current[lastKey]
    return true
  }
  
  return false
}

// ==================== Base64 编解码 ====================

/**
 * Base64 编码（支持 Unicode）
 */
export function base64Encode(str: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16))
    }))
  }
  return Buffer.from(str, 'utf-8').toString('base64')
}

/**
 * Base64 解码（支持 Unicode）
 */
export function base64Decode(str: string): string {
  if (typeof atob !== 'undefined') {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
  }
  return Buffer.from(str, 'base64').toString('utf-8')
}

// ==================== 类型检查 ====================

/**
 * 是否为纯对象
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  
  const proto = Object.getPrototypeOf(value)
  return proto === null || proto === Object.prototype
}

/**
 * 是否为空对象
 */
export function isEmptyObject(value: unknown): boolean {
  return isPlainObject(value) && Object.keys(value).length === 0
}

/**
 * 是否为空数组
 */
export function isEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.length === 0
}

/**
 * 是否为空值（null, undefined, 空字符串, 空对象, 空数组）
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true
  if (value === '') return true
  if (isEmptyObject(value)) return true
  if (isEmptyArray(value)) return true
  return false
}

