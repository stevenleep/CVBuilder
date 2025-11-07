/**
 * 验证工具
 * 
 * 提供完整的数据验证能力
 * 
 * @packageDocumentation
 */

import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  I18nString,
} from '../types/common'

// 重新导出类型供外部使用
export type { ValidationResult, ValidationError, ValidationWarning }

// ==================== 验证器接口 ====================

/**
 * 验证器接口
 */
export interface Validator<T = unknown> {
  /**
   * 验证数据
   */
  validate(value: T, context?: ValidationContext): ValidationResult
  
  /**
   * 验证器名称
   */
  readonly name: string
  
  /**
   * 验证器描述
   */
  readonly description?: I18nString
}

/**
 * 验证上下文
 */
export interface ValidationContext {
  /** 验证路径 */
  readonly path?: string
  
  /** 父级数据 */
  readonly parent?: unknown
  
  /** 根数据 */
  readonly root?: unknown
  
  /** 验证选项 */
  readonly options?: ValidationOptions
  
  /** 自定义元数据 */
  readonly metadata?: Record<string, unknown>
}

/**
 * 验证选项
 */
export interface ValidationOptions {
  /** 是否提前停止（遇到第一个错误就停止） */
  readonly abortEarly?: boolean
  
  /** 是否允许未知属性 */
  readonly allowUnknown?: boolean
  
  /** 是否严格模式 */
  readonly strict?: boolean
  
  /** 最大错误数 */
  readonly maxErrors?: number
  
  /** 自定义验证器 */
  readonly customValidators?: Record<string, Validator>
}

// ==================== 内置验证器 ====================

/**
 * 必填验证器
 */
export class RequiredValidator implements Validator {
  readonly name = 'required'
  readonly description = 'Value is required'
  
  validate(value: unknown): ValidationResult {
    const valid = value !== null && value !== undefined && value !== ''
    
    if (!valid) {
      return {
        valid: false,
        errors: [{
          code: 'required',
          message: 'This field is required',
          value,
          severity: 'error',
        }],
      }
    }
    
    return { valid: true }
  }
}

/**
 * 类型验证器
 */
export class TypeValidator implements Validator {
  readonly name = 'type'
  
  constructor(
    private readonly expectedType: string,
    readonly description?: I18nString
  ) {}
  
  validate(value: unknown): ValidationResult {
    const actualType = typeof value
    const valid = actualType === this.expectedType
    
    if (!valid) {
      return {
        valid: false,
        errors: [{
          code: 'type',
          message: `Expected type "${this.expectedType}", but got "${actualType}"`,
          value,
          severity: 'error',
          details: {
            expected: this.expectedType,
            actual: actualType,
          },
        }],
      }
    }
    
    return { valid: true }
  }
}

/**
 * 长度范围验证器
 */
export class LengthValidator implements Validator {
  readonly name = 'length'
  
  constructor(
    private readonly options: {
      min?: number
      max?: number
      exact?: number
    },
    readonly description?: I18nString
  ) {}
  
  validate(value: unknown): ValidationResult {
    const errors: ValidationError[] = []
    
    const length = getLength(value)
    if (length === null) {
      return {
        valid: false,
        errors: [{
          code: 'length.invalid',
          message: 'Value does not have a length property',
          value,
          severity: 'error',
        }],
      }
    }
    
    if (this.options.exact !== undefined && length !== this.options.exact) {
      errors.push({
        code: 'length.exact',
        message: `Length must be exactly ${this.options.exact}`,
        value,
        severity: 'error',
        details: { expected: this.options.exact, actual: length },
      })
    }
    
    if (this.options.min !== undefined && length < this.options.min) {
      errors.push({
        code: 'length.min',
        message: `Length must be at least ${this.options.min}`,
        value,
        severity: 'error',
        details: { min: this.options.min, actual: length },
      })
    }
    
    if (this.options.max !== undefined && length > this.options.max) {
      errors.push({
        code: 'length.max',
        message: `Length must be at most ${this.options.max}`,
        value,
        severity: 'error',
        details: { max: this.options.max, actual: length },
      })
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  }
}

/**
 * 数值范围验证器
 */
export class RangeValidator implements Validator {
  readonly name = 'range'
  
  constructor(
    private readonly options: {
      min?: number
      max?: number
      exclusive?: boolean
    },
    readonly description?: I18nString
  ) {}
  
  validate(value: unknown): ValidationResult {
    if (typeof value !== 'number') {
      return {
        valid: false,
        errors: [{
          code: 'range.type',
          message: 'Value must be a number',
          value,
          severity: 'error',
        }],
      }
    }
    
    const errors: ValidationError[] = []
    const { min, max, exclusive } = this.options
    
    if (min !== undefined) {
      const valid = exclusive ? value > min : value >= min
      if (!valid) {
        errors.push({
          code: 'range.min',
          message: exclusive
            ? `Value must be greater than ${min}`
            : `Value must be greater than or equal to ${min}`,
          value,
          severity: 'error',
          details: { min, exclusive, actual: value },
        })
      }
    }
    
    if (max !== undefined) {
      const valid = exclusive ? value < max : value <= max
      if (!valid) {
        errors.push({
          code: 'range.max',
          message: exclusive
            ? `Value must be less than ${max}`
            : `Value must be less than or equal to ${max}`,
          value,
          severity: 'error',
          details: { max, exclusive, actual: value },
        })
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    }
  }
}

/**
 * 正则表达式验证器
 */
export class PatternValidator implements Validator {
  readonly name = 'pattern'
  
  private readonly regex: RegExp
  
  constructor(
    pattern: string | RegExp,
    readonly description?: I18nString
  ) {
    this.regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
  }
  
  validate(value: unknown): ValidationResult {
    if (typeof value !== 'string') {
      return {
        valid: false,
        errors: [{
          code: 'pattern.type',
          message: 'Value must be a string',
          value,
          severity: 'error',
        }],
      }
    }
    
    const valid = this.regex.test(value)
    
    if (!valid) {
      return {
        valid: false,
        errors: [{
          code: 'pattern',
          message: `Value does not match the pattern: ${this.regex.source}`,
          value,
          severity: 'error',
          details: { pattern: this.regex.source },
        }],
      }
    }
    
    return { valid: true }
  }
}

/**
 * 枚举验证器
 */
export class EnumValidator implements Validator {
  readonly name = 'enum'
  
  constructor(
    private readonly allowedValues: readonly unknown[],
    readonly description?: I18nString
  ) {}
  
  validate(value: unknown): ValidationResult {
    const valid = this.allowedValues.includes(value)
    
    if (!valid) {
      return {
        valid: false,
        errors: [{
          code: 'enum',
          message: `Value must be one of: ${this.allowedValues.join(', ')}`,
          value,
          severity: 'error',
          details: { allowed: this.allowedValues, actual: value },
        }],
      }
    }
    
    return { valid: true }
  }
}

/**
 * 邮箱验证器
 */
export class EmailValidator implements Validator {
  readonly name = 'email'
  readonly description = 'Valid email address'
  
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  validate(value: unknown): ValidationResult {
    if (typeof value !== 'string') {
      return {
        valid: false,
        errors: [{
          code: 'email.type',
          message: 'Email must be a string',
          value,
          severity: 'error',
        }],
      }
    }
    
    const valid = this.emailRegex.test(value)
    
    if (!valid) {
      return {
        valid: false,
        errors: [{
          code: 'email',
          message: 'Invalid email address',
          value,
          severity: 'error',
        }],
      }
    }
    
    return { valid: true }
  }
}

/**
 * URL 验证器
 */
export class UrlValidator implements Validator {
  readonly name = 'url'
  readonly description = 'Valid URL'
  
  validate(value: unknown): ValidationResult {
    if (typeof value !== 'string') {
      return {
        valid: false,
        errors: [{
          code: 'url.type',
          message: 'URL must be a string',
          value,
          severity: 'error',
        }],
      }
    }
    
    try {
      new URL(value)
      return { valid: true }
    } catch {
      return {
        valid: false,
        errors: [{
          code: 'url',
          message: 'Invalid URL',
          value,
          severity: 'error',
        }],
      }
    }
  }
}

// ==================== 验证器组合 ====================

/**
 * 验证器链（AND）
 */
export class ValidatorChain implements Validator {
  readonly name = 'chain'
  
  constructor(
    private readonly validators: readonly Validator[],
    readonly description?: I18nString
  ) {}
  
  validate(value: unknown, context?: ValidationContext): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    
    for (const validator of this.validators) {
      const result = validator.validate(value, context)
      
      if (!result.valid) {
        if (result.errors) {
          errors.push(...result.errors)
        }
        
        if (context?.options?.abortEarly) {
          break
        }
      }
      
      if (result.warnings) {
        warnings.push(...result.warnings)
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  }
}

/**
 * 验证器并集（OR）
 */
export class ValidatorUnion implements Validator {
  readonly name = 'union'
  
  constructor(
    private readonly validators: readonly Validator[],
    readonly description?: I18nString
  ) {}
  
  validate(value: unknown, context?: ValidationContext): ValidationResult {
    for (const validator of this.validators) {
      const result = validator.validate(value, context)
      if (result.valid) {
        return result
      }
    }
    
    return {
      valid: false,
      errors: [{
        code: 'union',
        message: 'Value does not match any of the allowed types',
        value,
        severity: 'error',
      }],
    }
  }
}

// ==================== 工具函数 ====================

/**
 * 获取长度
 */
function getLength(value: unknown): number | null {
  if (value == null) return null
  if (typeof value === 'string') return value.length
  if (Array.isArray(value)) return value.length
  if (typeof value === 'object' && 'length' in value) {
    return typeof value.length === 'number' ? value.length : null
  }
  return null
}

/**
 * 创建验证结果
 */
export function createValidationResult(
  valid: boolean,
  errors?: ValidationError[],
  warnings?: ValidationWarning[]
): ValidationResult {
  return {
    valid,
    errors: errors && errors.length > 0 ? errors : undefined,
    warnings: warnings && warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * 合并验证结果
 */
export function mergeValidationResults(
  ...results: ValidationResult[]
): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  
  for (const result of results) {
    if (result.errors) {
      errors.push(...result.errors)
    }
    if (result.warnings) {
      warnings.push(...result.warnings)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * 验证器工厂
 */
export const validators = {
  required: () => new RequiredValidator(),
  type: (type: string) => new TypeValidator(type),
  length: (options: { min?: number; max?: number; exact?: number }) =>
    new LengthValidator(options),
  range: (options: { min?: number; max?: number; exclusive?: boolean }) =>
    new RangeValidator(options),
  pattern: (pattern: string | RegExp) => new PatternValidator(pattern),
  enum: (values: readonly unknown[]) => new EnumValidator(values),
  email: () => new EmailValidator(),
  url: () => new UrlValidator(),
  chain: (...validators: Validator[]) => new ValidatorChain(validators),
  union: (...validators: Validator[]) => new ValidatorUnion(validators),
}

