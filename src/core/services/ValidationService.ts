/**
 * 数据校验服务实现
 *
 * 提供统一的数据校验系统
 */

import {
  IValidationService,
  IValidationResult,
  IValidationRule,
  IValidationError,
  ISchemaValidation,
  IBuiltInRules,
} from '../protocols/IValidationProtocol'
import { IEventBus } from '../protocols/IEventProtocol'

export class ValidationService implements IValidationService {
  private rules: Map<string, IValidationRule> = new Map()
  private schemas: Map<string, ISchemaValidation> = new Map()
  private eventBus?: IEventBus

  constructor(eventBus?: IEventBus) {
    this.eventBus = eventBus
    this.registerBuiltInRules()
  }

  /**
   * 校验单个值
   */
  public async validate<T = any>(
    value: T,
    rules: IValidationRule[]
  ): Promise<IValidationResult<T>> {
    const errors: IValidationError[] = []

    for (const rule of rules) {
      try {
        const isValid = await rule.validate(value)
        if (!isValid) {
          const message = typeof rule.message === 'function' ? rule.message(value) : rule.message
          errors.push({
            path: '',
            message,
            code: rule.name,
            value,
          })
        }
      } catch (error) {
        errors.push({
          path: '',
          message: error instanceof Error ? error.message : '校验失败',
          code: 'validation_error',
          value,
        })
      }
    }

    const result: IValidationResult<T> = {
      valid: errors.length === 0,
      data: value,
      errors: errors.length > 0 ? errors : undefined,
    }

    this.eventBus?.emit('validation:complete', { result })

    return result
  }

  /**
   * 校验对象
   */
  public async validateObject<T = any>(
    data: T,
    schema: ISchemaValidation
  ): Promise<IValidationResult<T>> {
    const errors: IValidationError[] = []

    // 校验各个字段
    for (const fieldConfig of schema.fields) {
      const value = (data as any)[fieldConfig.field]

      // 检查必填
      if (fieldConfig.required && (value === undefined || value === null || value === '')) {
        errors.push({
          path: fieldConfig.field,
          message: `${fieldConfig.field} 是必填项`,
          code: 'required',
          value,
        })
        continue
      }

      // 应用字段规则
      if (value !== undefined && value !== null) {
        const fieldResult = await this.validate(value, fieldConfig.rules)
        if (!fieldResult.valid && fieldResult.errors) {
          fieldResult.errors.forEach(error => {
            errors.push({
              ...error,
              path: fieldConfig.field,
            })
          })
        }
      }
    }

    // 自定义校验器
    if (schema.customValidators) {
      for (const validator of schema.customValidators) {
        try {
          const customResult = await validator(data)
          if (!customResult.valid && customResult.errors) {
            errors.push(...customResult.errors)
          }
        } catch (error) {
          errors.push({
            path: '',
            message: error instanceof Error ? error.message : '自定义校验失败',
            code: 'custom_validation_error',
          })
        }
      }
    }

    const result: IValidationResult<T> = {
      valid: errors.length === 0,
      data,
      errors: errors.length > 0 ? errors : undefined,
    }

    this.eventBus?.emit('validation:object-complete', { schema: schema.name, result })

    return result
  }

  /**
   * 批量校验
   */
  public async validateBatch<T = any>(
    items: T[],
    rules: IValidationRule[]
  ): Promise<IValidationResult<T>[]> {
    const results = await Promise.all(items.map(item => this.validate(item, rules)))
    this.eventBus?.emit('validation:batch-complete', { count: items.length, results })
    return results
  }

  /**
   * 注册自定义规则
   */
  public registerRule(rule: IValidationRule): void {
    if (this.rules.has(rule.name)) {
      console.warn(`[ValidationService] 规则 "${rule.name}" 已存在，将被覆盖`)
    }
    this.rules.set(rule.name, rule)
    this.eventBus?.emit('validation:rule-registered', { rule })
  }

  /**
   * 获取规则
   */
  public getRule(name: string): IValidationRule | undefined {
    return this.rules.get(name)
  }

  /**
   * 获取所有规则
   */
  public getAllRules(): IValidationRule[] {
    return Array.from(this.rules.values())
  }

  /**
   * 注册Schema
   */
  public registerSchema(schema: ISchemaValidation): void {
    if (this.schemas.has(schema.name)) {
      console.warn(`[ValidationService] Schema "${schema.name}" 已存在，将被覆盖`)
    }
    this.schemas.set(schema.name, schema)
    this.eventBus?.emit('validation:schema-registered', { schema })
  }

  /**
   * 获取Schema
   */
  public getSchema(name: string): ISchemaValidation | undefined {
    return this.schemas.get(name)
  }

  /**
   * 清空规则
   */
  public clearRules(): void {
    this.rules.clear()
    this.eventBus?.emit('validation:rules-cleared', {})
  }

  /**
   * 清空Schema
   */
  public clearSchemas(): void {
    this.schemas.clear()
    this.eventBus?.emit('validation:schemas-cleared', {})
  }

  /**
   * 注册内置规则
   */
  private registerBuiltInRules(): void {
    // 必填
    this.registerRule({
      name: 'required',
      validate: value => value !== undefined && value !== null && value !== '',
      message: '此字段为必填项',
      required: true,
    })

    // 邮箱
    this.registerRule({
      name: 'email',
      validate: value => {
        if (!value) return true
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(String(value))
      },
      message: '请输入有效的邮箱地址',
    })

    // URL
    this.registerRule({
      name: 'url',
      validate: value => {
        if (!value) return true
        try {
          new URL(String(value))
          return true
        } catch {
          return false
        }
      },
      message: '请输入有效的URL',
    })

    // 数字
    this.registerRule({
      name: 'number',
      validate: value => {
        if (value === null || value === undefined || value === '') return true
        return !isNaN(Number(value))
      },
      message: '请输入有效的数字',
    })

    // 整数
    this.registerRule({
      name: 'integer',
      validate: value => {
        if (value === null || value === undefined || value === '') return true
        return Number.isInteger(Number(value))
      },
      message: '请输入整数',
    })
  }
}

/**
 * 内置规则工厂
 */
export const BuiltInRules: IBuiltInRules = {
  required: {
    name: 'required',
    validate: value => value !== undefined && value !== null && value !== '',
    message: '此字段为必填项',
    required: true,
  },

  email: {
    name: 'email',
    validate: value => {
      if (!value) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(String(value))
    },
    message: '请输入有效的邮箱地址',
  },

  url: {
    name: 'url',
    validate: value => {
      if (!value) return true
      try {
        new URL(String(value))
        return true
      } catch {
        return false
      }
    },
    message: '请输入有效的URL',
  },

  number: {
    name: 'number',
    validate: value => {
      if (value === null || value === undefined || value === '') return true
      return !isNaN(Number(value))
    },
    message: '请输入有效的数字',
  },

  integer: {
    name: 'integer',
    validate: value => {
      if (value === null || value === undefined || value === '') return true
      return Number.isInteger(Number(value))
    },
    message: '请输入整数',
  },

  min: (minValue: number) => ({
    name: `min_${minValue}`,
    validate: value => {
      if (value === null || value === undefined || value === '') return true
      return Number(value) >= minValue
    },
    message: `值不能小于 ${minValue}`,
  }),

  max: (maxValue: number) => ({
    name: `max_${maxValue}`,
    validate: value => {
      if (value === null || value === undefined || value === '') return true
      return Number(value) <= maxValue
    },
    message: `值不能大于 ${maxValue}`,
  }),

  minLength: (length: number) => ({
    name: `minLength_${length}`,
    validate: value => {
      if (!value) return true
      return String(value).length >= length
    },
    message: `长度不能少于 ${length} 个字符`,
  }),

  maxLength: (length: number) => ({
    name: `maxLength_${length}`,
    validate: value => {
      if (!value) return true
      return String(value).length <= length
    },
    message: `长度不能超过 ${length} 个字符`,
  }),

  pattern: (regex: RegExp) => ({
    name: `pattern_${regex.source}`,
    validate: value => {
      if (!value) return true
      return regex.test(String(value))
    },
    message: '格式不正确',
  }),

  custom: (fn: (value: any) => boolean, message: string) => ({
    name: 'custom',
    validate: fn,
    message,
  }),
}

// 服务标识符
export const VALIDATION_SERVICE_TOKEN = Symbol('ValidationService')
