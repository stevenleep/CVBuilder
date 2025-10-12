/**
 * 数据校验服务协议
 *
 * 定义统一的数据校验系统
 */

/**
 * 校验结果
 */
export interface IValidationResult<T = any> {
  /** 是否有效 */
  valid: boolean
  /** 校验后的数据 */
  data?: T
  /** 错误信息 */
  errors?: IValidationError[]
  /** 警告信息 */
  warnings?: IValidationWarning[]
}

/**
 * 校验错误
 */
export interface IValidationError {
  /** 字段路径 */
  path: string
  /** 错误消息 */
  message: string
  /** 错误代码 */
  code?: string
  /** 实际值 */
  value?: any
}

/**
 * 校验警告
 */
export interface IValidationWarning {
  /** 字段路径 */
  path: string
  /** 警告消息 */
  message: string
  /** 警告代码 */
  code?: string
}

/**
 * 校验规则
 */
export interface IValidationRule<T = any> {
  /** 规则名称 */
  name: string
  /** 规则描述 */
  description?: string
  /** 校验函数 */
  validate: (value: T, context?: any) => boolean | Promise<boolean>
  /** 错误消息 */
  message: string | ((value: T) => string)
  /** 是否必需 */
  required?: boolean
}

/**
 * 字段校验配置
 */
export interface IFieldValidation {
  /** 字段名 */
  field: string
  /** 校验规则 */
  rules: IValidationRule[]
  /** 是否必需 */
  required?: boolean
  /** 默认值 */
  defaultValue?: any
}

/**
 * Schema 校验配置
 */
export interface ISchemaValidation {
  /** Schema 名称 */
  name: string
  /** 字段校验配置 */
  fields: IFieldValidation[]
  /** 自定义校验函数 */
  customValidators?: Array<(data: any) => IValidationResult | Promise<IValidationResult>>
}

/**
 * 数据校验服务接口
 */
export interface IValidationService {
  /** 校验单个值 */
  validate<T = any>(value: T, rules: IValidationRule[]): Promise<IValidationResult<T>>

  /** 校验对象 */
  validateObject<T = any>(data: T, schema: ISchemaValidation): Promise<IValidationResult<T>>

  /** 批量校验 */
  validateBatch<T = any>(items: T[], rules: IValidationRule[]): Promise<IValidationResult<T>[]>

  /** 注册自定义规则 */
  registerRule(rule: IValidationRule): void

  /** 获取规则 */
  getRule(name: string): IValidationRule | undefined

  /** 获取所有规则 */
  getAllRules(): IValidationRule[]

  /** 注册Schema */
  registerSchema(schema: ISchemaValidation): void

  /** 获取Schema */
  getSchema(name: string): ISchemaValidation | undefined

  /** 清空规则 */
  clearRules(): void

  /** 清空Schema */
  clearSchemas(): void
}

/**
 * 内置校验规则
 */
export interface IBuiltInRules {
  /** 必填 */
  required: IValidationRule
  /** 邮箱 */
  email: IValidationRule
  /** URL */
  url: IValidationRule
  /** 数字 */
  number: IValidationRule
  /** 整数 */
  integer: IValidationRule
  /** 最小值 */
  min: (value: number) => IValidationRule
  /** 最大值 */
  max: (value: number) => IValidationRule
  /** 最小长度 */
  minLength: (length: number) => IValidationRule
  /** 最大长度 */
  maxLength: (length: number) => IValidationRule
  /** 正则匹配 */
  pattern: (regex: RegExp) => IValidationRule
  /** 自定义函数 */
  custom: (fn: (value: any) => boolean, message: string) => IValidationRule
}
