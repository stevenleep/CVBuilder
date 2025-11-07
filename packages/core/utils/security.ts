/**
 * 安全工具
 * 
 * 提供数据安全、权限检查、输入清理等功能
 * 
 * @packageDocumentation
 */

import type { SecurityContext, PermissionLevel } from '../types/common'

// ==================== 权限检查 ====================

/**
 * 权限检查器
 */
export class PermissionChecker {
  /**
   * 检查用户是否有指定权限
   */
  static hasPermission(
    context: SecurityContext,
    permission: string
  ): boolean {
    return context.permissions.includes(permission)
  }
  
  /**
   * 检查用户是否有任意一个权限
   */
  static hasAnyPermission(
    context: SecurityContext,
    permissions: readonly string[]
  ): boolean {
    return permissions.some(p => context.permissions.includes(p))
  }
  
  /**
   * 检查用户是否有所有权限
   */
  static hasAllPermissions(
    context: SecurityContext,
    permissions: readonly string[]
  ): boolean {
    return permissions.every(p => context.permissions.includes(p))
  }
  
  /**
   * 检查用户是否有指定角色
   */
  static hasRole(
    context: SecurityContext,
    role: string
  ): boolean {
    return context.roles.includes(role)
  }
  
  /**
   * 检查用户是否有任意一个角色
   */
  static hasAnyRole(
    context: SecurityContext,
    roles: readonly string[]
  ): boolean {
    return roles.some(r => context.roles.includes(r))
  }
  
  /**
   * 检查用户是否有所有角色
   */
  static hasAllRoles(
    context: SecurityContext,
    roles: readonly string[]
  ): boolean {
    return roles.every(r => context.roles.includes(r))
  }
  
  /**
   * 检查权限级别
   */
  static hasPermissionLevel(
    requiredLevel: PermissionLevel,
    userLevel: PermissionLevel
  ): boolean {
    const levels: PermissionLevel[] = ['read', 'write', 'execute', 'admin', 'owner']
    const requiredIndex = levels.indexOf(requiredLevel)
    const userIndex = levels.indexOf(userLevel)
    return userIndex >= requiredIndex
  }
}

// ==================== 输入清理 ====================

/**
 * 输入清理器
 */
export class InputSanitizer {
  /**
   * 清理 HTML（防止 XSS）
   */
  static sanitizeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }
  
  /**
   * 清理 JavaScript 代码
   */
  static sanitizeJavaScript(input: string): string {
    // 移除潜在危险的代码
    const dangerousPatterns = [
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,
      /new\s+Function/gi,
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi, // 事件处理器
    ]
    
    let sanitized = input
    for (const pattern of dangerousPatterns) {
      sanitized = sanitized.replace(pattern, '')
    }
    
    return sanitized
  }
  
  /**
   * 清理 SQL（防止 SQL 注入）
   */
  static sanitizeSql(input: string): string {
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '')
  }
  
  /**
   * 清理文件路径（防止路径遍历）
   */
  static sanitizeFilePath(input: string): string {
    return input
      .replace(/\.\./g, '')
      .replace(/[<>:"|?*]/g, '')
      .replace(/^\//g, '')
  }
  
  /**
   * 清理 URL
   */
  static sanitizeUrl(input: string): string {
    // 只允许 http/https 协议
    if (!/^https?:\/\//i.test(input)) {
      return ''
    }
    
    try {
      const url = new URL(input)
      // 检查是否是安全的协议
      if (!['http:', 'https:'].includes(url.protocol)) {
        return ''
      }
      return url.toString()
    } catch {
      return ''
    }
  }
}

// ==================== 数据加密/解密 ====================

/**
 * 简单的加密器（仅用于演示，生产环境应使用专业加密库）
 */
export class SimpleEncryption {
  /**
   * Base64 编码
   */
  static encodeBase64(input: string): string {
    if (typeof btoa !== 'undefined') {
      return btoa(input)
    }
    return Buffer.from(input).toString('base64')
  }
  
  /**
   * Base64 解码
   */
  static decodeBase64(input: string): string {
    if (typeof atob !== 'undefined') {
      return atob(input)
    }
    return Buffer.from(input, 'base64').toString()
  }
  
  /**
   * 简单的 XOR 加密（不安全，仅用于混淆）
   */
  static xorEncrypt(input: string, key: string): string {
    let result = ''
    for (let i = 0; i < input.length; i++) {
      result += String.fromCharCode(
        input.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      )
    }
    return result
  }
  
  /**
   * 简单的 XOR 解密
   */
  static xorDecrypt(input: string, key: string): string {
    return this.xorEncrypt(input, key) // XOR 加密和解密是相同的
  }
}

// ==================== 令牌管理 ====================

/**
 * JWT 令牌解析器（简化版）
 */
export class TokenParser {
  /**
   * 解析 JWT 令牌
   */
  static parseJwt(token: string): Record<string, unknown> | null {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        return null
      }
      
      const payload = SimpleEncryption.decodeBase64(parts[1])
      return JSON.parse(payload)
    } catch {
      return null
    }
  }
  
  /**
   * 检查令牌是否过期
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.parseJwt(token)
    if (!payload || !payload.exp) {
      return true
    }
    
    const exp = payload.exp as number
    return Date.now() >= exp * 1000
  }
  
  /**
   * 获取令牌过期时间
   */
  static getTokenExpiration(token: string): Date | null {
    const payload = this.parseJwt(token)
    if (!payload || !payload.exp) {
      return null
    }
    
    return new Date((payload.exp as number) * 1000)
  }
}

// ==================== 内容安全策略 ====================

/**
 * CSP（内容安全策略）构建器
 */
export class CSPBuilder {
  private directives: Map<string, string[]> = new Map()
  
  /**
   * 添加指令
   */
  add(directive: string, value: string): this {
    if (!this.directives.has(directive)) {
      this.directives.set(directive, [])
    }
    this.directives.get(directive)!.push(value)
    return this
  }
  
  /**
   * 设置默认源
   */
  defaultSrc(...sources: string[]): this {
    sources.forEach(s => this.add('default-src', s))
    return this
  }
  
  /**
   * 设置脚本源
   */
  scriptSrc(...sources: string[]): this {
    sources.forEach(s => this.add('script-src', s))
    return this
  }
  
  /**
   * 设置样式源
   */
  styleSrc(...sources: string[]): this {
    sources.forEach(s => this.add('style-src', s))
    return this
  }
  
  /**
   * 设置图片源
   */
  imgSrc(...sources: string[]): this {
    sources.forEach(s => this.add('img-src', s))
    return this
  }
  
  /**
   * 设置字体源
   */
  fontSrc(...sources: string[]): this {
    sources.forEach(s => this.add('font-src', s))
    return this
  }
  
  /**
   * 设置连接源
   */
  connectSrc(...sources: string[]): this {
    sources.forEach(s => this.add('connect-src', s))
    return this
  }
  
  /**
   * 构建 CSP 字符串
   */
  build(): string {
    const parts: string[] = []
    
    for (const [directive, values] of this.directives) {
      parts.push(`${directive} ${values.join(' ')}`)
    }
    
    return parts.join('; ')
  }
}

// ==================== 安全审计 ====================

/**
 * 安全审计日志
 */
export interface SecurityAuditLog {
  /** 时间戳 */
  readonly timestamp: number
  
  /** 用户 ID */
  readonly userId?: string
  
  /** 操作类型 */
  readonly action: string
  
  /** 资源 */
  readonly resource?: string
  
  /** 结果 */
  readonly result: 'success' | 'failure' | 'blocked'
  
  /** IP 地址 */
  readonly ipAddress?: string
  
  /** User Agent */
  readonly userAgent?: string
  
  /** 详情 */
  readonly details?: Record<string, unknown>
}

/**
 * 安全审计器
 */
export class SecurityAuditor {
  private logs: SecurityAuditLog[] = []
  
  /**
   * 记录审计日志
   */
  log(log: Omit<SecurityAuditLog, 'timestamp'>): void {
    this.logs.push({
      ...log,
      timestamp: Date.now(),
    })
  }
  
  /**
   * 获取所有日志
   */
  getLogs(): readonly SecurityAuditLog[] {
    return this.logs
  }
  
  /**
   * 按用户筛选日志
   */
  getLogsByUser(userId: string): readonly SecurityAuditLog[] {
    return this.logs.filter(log => log.userId === userId)
  }
  
  /**
   * 按操作类型筛选日志
   */
  getLogsByAction(action: string): readonly SecurityAuditLog[] {
    return this.logs.filter(log => log.action === action)
  }
  
  /**
   * 按时间范围筛选日志
   */
  getLogsByTimeRange(start: number, end: number): readonly SecurityAuditLog[] {
    return this.logs.filter(log => 
      log.timestamp >= start && log.timestamp <= end
    )
  }
  
  /**
   * 清空日志
   */
  clear(): void {
    this.logs = []
  }
}

// ==================== 速率限制 ====================

/**
 * 速率限制器
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number
  ) {}
  
  /**
   * 检查是否超过速率限制
   */
  isRateLimited(key: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // 清理过期的请求
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      this.requests.set(key, validRequests)
      return true
    }
    
    validRequests.push(now)
    this.requests.set(key, validRequests)
    return false
  }
  
  /**
   * 重置速率限制
   */
  reset(key: string): void {
    this.requests.delete(key)
  }
  
  /**
   * 清空所有记录
   */
  clear(): void {
    this.requests.clear()
  }
}

// ==================== 工具函数 ====================

/**
 * 生成随机字符串
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 生成 UUID (v4)
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 哈希字符串（简单的哈希算法）
 */
export function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

/**
 * 比较字符串（防止时序攻击）
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

