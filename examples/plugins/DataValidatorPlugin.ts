/**
 * 数据验证插件示例
 *
 * 展示如何使用钩子系统和验证服务
 * 在保存前自动验证数据完整性和质量
 */

import {
  IHookService,
  IValidationService,
  INotificationService,
  IEventBus,
  HookNames,
} from '../../src/core'

interface ValidationRule {
  field: string
  required: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export class DataValidatorPlugin {
  private hookService?: IHookService
  private validationService?: IValidationService
  private notificationService?: INotificationService
  private eventBus?: IEventBus
  private customRules: Map<string, ValidationRule[]> = new Map()

  constructor() {
    this.setupDefaultRules()
  }

  /**
   * 激活插件
   */
  public async activate(context: {
    hookService: IHookService
    validationService: IValidationService
    notificationService: INotificationService
    eventBus: IEventBus
  }): Promise<void> {
    this.hookService = context.hookService
    this.validationService = context.validationService
    this.notificationService = context.notificationService
    this.eventBus = context.eventBus

    // 1. 注册验证钩子
    this.registerValidationHooks()

    // 2. 注册自定义验证规则
    this.registerCustomRules()

    // 3. 监听事件
    this.setupEventListeners()

    console.log('[DataValidatorPlugin] 数据验证插件已激活')
  }

  /**
   * 停用插件
   */
  public async deactivate(): Promise<void> {
    console.log('[DataValidatorPlugin] 数据验证插件已停用')
  }

  /**
   * 设置默认规则
   */
  private setupDefaultRules(): void {
    // 个人信息验证规则
    this.customRules.set('personal-info', [
      {
        field: 'name',
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      {
        field: 'email',
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      {
        field: 'phone',
        required: false,
        pattern: /^1[3-9]\d{9}$/,
      },
    ])

    // 工作经历验证规则
    this.customRules.set('work-experience', [
      {
        field: 'company',
        required: true,
        minLength: 2,
      },
      {
        field: 'position',
        required: true,
        minLength: 2,
      },
      {
        field: 'description',
        required: true,
        minLength: 50,
        maxLength: 1000,
      },
      {
        field: 'duration',
        required: true,
        custom: value => {
          // 验证日期格式
          const datePattern = /^\d{4}-\d{2}\s*至\s*(\d{4}-\d{2}|至今)$/
          if (!datePattern.test(value)) {
            return '日期格式应为：2023-01 至 2024-01'
          }
          return true
        },
      },
    ])

    // 项目经历验证规则
    this.customRules.set('project', [
      {
        field: 'name',
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      {
        field: 'role',
        required: true,
      },
      {
        field: 'description',
        required: true,
        minLength: 100,
      },
      {
        field: 'achievements',
        required: false,
        minLength: 50,
      },
    ])

    // 教育经历验证规则
    this.customRules.set('education', [
      {
        field: 'school',
        required: true,
        minLength: 2,
      },
      {
        field: 'major',
        required: true,
        minLength: 2,
      },
      {
        field: 'degree',
        required: true,
      },
    ])
  }

  /**
   * 注册验证钩子
   */
  private registerValidationHooks(): void {
    if (!this.hookService) return

    // 保存前验证
    this.hookService.register({
      id: 'validate-before-save',
      name: HookNames.SAVE_BEFORE,
      type: 'before',
      priority: 100,
      handler: async context => {
        const { data } = context

        console.log('[DataValidatorPlugin] 开始验证数据...')

        // 验证整体数据结构
        const errors = await this.validateResumeData(data)

        if (errors.length > 0) {
          // 显示验证错误
          const errorMessages = errors.map(e => `• ${e.field}: ${e.message}`).join('\n')

          if (!this.notificationService) return

          const proceed = await this.notificationService.confirm({
            title: '数据验证失败',
            message: `发现 ${errors.length} 个问题：\n${errorMessages}\n\n是否仍要保存？`,
            type: 'warning',
          })

          if (!proceed) {
            if (context.cancel) context.cancel()
            this.notificationService.warning('已取消保存，请修正数据后重试')
          } else {
            this.notificationService.warning('已保存，但建议修正验证错误')
          }
        } else {
          console.log('[DataValidatorPlugin] 数据验证通过')
        }
      },
    })

    // 节点添加后验证
    this.hookService.register({
      id: 'validate-after-node-add',
      name: HookNames.NODE_AFTER_ADD,
      type: 'after',
      priority: 50,
      handler: async context => {
        const { data } = context
        const nodeType = data?.type

        // 根据节点类型提供验证提示
        if (nodeType === 'WorkExperience') {
          if (this.notificationService) {
            this.notificationService.info(
              '已添加工作经历，请确保填写完整信息（公司、职位、时间、描述）',
              { duration: 4000 }
            )
          }
        } else if (nodeType === 'Project') {
          if (this.notificationService) {
            this.notificationService.info(
              '已添加项目经历，描述应包含：项目背景、技术栈、个人职责、项目成果',
              { duration: 4000 }
            )
          }
        }
      },
    })

    // 导出前验证
    this.hookService.register({
      id: 'validate-before-export',
      name: HookNames.EXPORT_BEFORE,
      type: 'before',
      priority: 90,
      handler: async context => {
        const { data } = context

        // 检查必填项
        const missingFields = this.checkRequiredFields(data)

        if (missingFields.length > 0) {
          const fieldNames = missingFields.join('、')

          if (!this.notificationService) return

          const proceed = await this.notificationService.confirm({
            title: '导出提醒',
            message: `以下必填项未填写：${fieldNames}\n\n是否继续导出？`,
            type: 'warning',
          })

          if (!proceed) {
            if (context.cancel) context.cancel()
          }
        }
      },
    })
  }

  /**
   * 注册自定义验证规则
   */
  private registerCustomRules(): void {
    if (!this.validationService) return

    // 注册中文姓名验证规则
    this.validationService.registerRule({
      name: 'chinese-name',
      validate: value => {
        if (!value) return true
        const chineseNamePattern = /^[\u4e00-\u9fa5]{2,10}$/
        return chineseNamePattern.test(value)
      },
      message: '请输入2-10个中文字符的姓名',
    })

    // 注册技能标签验证规则
    this.validationService.registerRule({
      name: 'skill-tags',
      validate: value => {
        if (!Array.isArray(value)) return false
        if (value.length === 0) return false
        return value.every(skill => typeof skill === 'string' && skill.length > 0)
      },
      message: '至少需要一个有效的技能标签',
    })

    // 注册日期范围验证规则
    this.validationService.registerRule({
      name: 'date-range',
      validate: value => {
        if (!value) return true
        const pattern = /^(\d{4}-\d{2})\s*至\s*(\d{4}-\d{2}|至今)$/
        const match = value.match(pattern)

        if (!match) return false

        const startDate = new Date(match[1])
        const endDateStr = match[2]

        if (endDateStr === '至今') return true

        const endDate = new Date(endDateStr)
        return startDate <= endDate
      },
      message: '日期范围不合理，结束日期应晚于开始日期',
    })
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    if (!this.eventBus) return

    // 监听验证事件
    this.eventBus.on('validation:failed', (data: any) => {
      console.error('[DataValidatorPlugin] 验证失败:', data)
    })

    // 监听数据更新事件
    this.eventBus.on('node:after-update', (data: any) => {
      // 可以在此进行实时验证
      console.log('[DataValidatorPlugin] 节点已更新:', data)
    })
  }

  /**
   * 验证简历数据
   */
  private async validateResumeData(data: any): Promise<Array<{ field: string; message: string }>> {
    const errors: Array<{ field: string; message: string }> = []

    if (!data) {
      return [{ field: 'root', message: '数据不能为空' }]
    }

    // 验证个人信息
    if (data.personalInfo) {
      const personalErrors = await this.validateSection(data.personalInfo, 'personal-info')
      errors.push(...personalErrors)
    } else {
      errors.push({ field: 'personalInfo', message: '缺少个人信息' })
    }

    // 验证工作经历
    if (Array.isArray(data.workExperiences)) {
      data.workExperiences.forEach((exp: any, index: number) => {
        const expErrors = this.validateSectionSync(exp, 'work-experience')
        expErrors.forEach(error => {
          errors.push({
            field: `workExperiences[${index}].${error.field}`,
            message: error.message,
          })
        })
      })
    }

    // 验证项目经历
    if (Array.isArray(data.projects)) {
      data.projects.forEach((project: any, index: number) => {
        const projectErrors = this.validateSectionSync(project, 'project')
        projectErrors.forEach(error => {
          errors.push({
            field: `projects[${index}].${error.field}`,
            message: error.message,
          })
        })
      })
    }

    // 验证教育经历
    if (Array.isArray(data.educations)) {
      data.educations.forEach((edu: any, index: number) => {
        const eduErrors = this.validateSectionSync(edu, 'education')
        eduErrors.forEach(error => {
          errors.push({
            field: `educations[${index}].${error.field}`,
            message: error.message,
          })
        })
      })
    }

    return errors
  }

  /**
   * 验证数据段（异步）
   */
  private async validateSection(
    data: any,
    ruleSetName: string
  ): Promise<Array<{ field: string; message: string }>> {
    const rules = this.customRules.get(ruleSetName)
    if (!rules) return []

    const errors: Array<{ field: string; message: string }> = []

    for (const rule of rules) {
      const value = data[rule.field]

      // 检查必填
      if (rule.required && !value) {
        errors.push({ field: rule.field, message: '此字段为必填项' })
        continue
      }

      if (!value) continue

      // 检查最小长度
      if (rule.minLength && value.length < rule.minLength) {
        errors.push({
          field: rule.field,
          message: `最少需要${rule.minLength}个字符`,
        })
      }

      // 检查最大长度
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push({
          field: rule.field,
          message: `最多${rule.maxLength}个字符`,
        })
      }

      // 检查正则模式
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push({
          field: rule.field,
          message: '格式不正确',
        })
      }

      // 自定义验证
      if (rule.custom) {
        const result = rule.custom(value)
        if (result !== true) {
          errors.push({
            field: rule.field,
            message: typeof result === 'string' ? result : '验证失败',
          })
        }
      }
    }

    return errors
  }

  /**
   * 验证数据段（同步）
   */
  private validateSectionSync(
    data: any,
    ruleSetName: string
  ): Array<{ field: string; message: string }> {
    // 与异步版本相同的逻辑
    const rules = this.customRules.get(ruleSetName)
    if (!rules) return []

    const errors: Array<{ field: string; message: string }> = []

    for (const rule of rules) {
      const value = data[rule.field]

      if (rule.required && !value) {
        errors.push({ field: rule.field, message: '此字段为必填项' })
        continue
      }

      if (!value) continue

      if (rule.minLength && value.length < rule.minLength) {
        errors.push({
          field: rule.field,
          message: `最少需要${rule.minLength}个字符`,
        })
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push({
          field: rule.field,
          message: `最多${rule.maxLength}个字符`,
        })
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push({
          field: rule.field,
          message: '格式不正确',
        })
      }

      if (rule.custom) {
        const result = rule.custom(value)
        if (result !== true) {
          errors.push({
            field: rule.field,
            message: typeof result === 'string' ? result : '验证失败',
          })
        }
      }
    }

    return errors
  }

  /**
   * 检查必填字段
   */
  private checkRequiredFields(data: any): string[] {
    const missing: string[] = []

    if (!data.personalInfo?.name) missing.push('姓名')
    if (!data.personalInfo?.email) missing.push('邮箱')

    if (!data.workExperiences || data.workExperiences.length === 0) {
      missing.push('工作经历')
    }

    if (!data.educations || data.educations.length === 0) {
      missing.push('教育经历')
    }

    return missing
  }

  /**
   * 添加自定义验证规则
   */
  public addCustomRule(section: string, rule: ValidationRule): void {
    const existingRules = this.customRules.get(section) || []
    existingRules.push(rule)
    this.customRules.set(section, existingRules)
  }
}

/**
 * 使用示例：
 *
 * ```typescript
 * import { DataValidatorPlugin } from './examples/plugins/DataValidatorPlugin'
 *
 * // 创建插件实例
 * const validatorPlugin = new DataValidatorPlugin()
 *
 * // 激活插件
 * await validatorPlugin.activate({
 *   hookService,
 *   validationService,
 *   notificationService,
 *   eventBus,
 * })
 *
 * // 添加自定义验证规则
 * validatorPlugin.addCustomRule('personal-info', {
 *   field: 'github',
 *   required: false,
 *   pattern: /^https:\/\/github\.com\/[\w-]+$/,
 * })
 *
 * // 保存时会自动验证
 * await saveService.save(resumeData)
 * ```
 */
