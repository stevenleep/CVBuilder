/**
 * AI助手插件示例
 *
 * 展示如何使用扩展点系统在工具栏添加自定义按钮
 * 并集成AI能力来辅助简历编写
 */

import {
  IExtensionService,
  ICommandService,
  INotificationService,
  IEventBus,
  IExtension,
  HookNames,
  IHookService,
} from '../../src/core'

interface AIAssistantConfig {
  apiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export class AIAssistantPlugin {
  private config: AIAssistantConfig
  private extensionService?: IExtensionService
  private commandService?: ICommandService
  private notificationService?: INotificationService
  private hookService?: IHookService
  private eventBus?: IEventBus

  constructor(config: AIAssistantConfig = {}) {
    this.config = {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 500,
      ...config,
    }
  }

  /**
   * 激活插件
   */
  public async activate(context: {
    extensionService: IExtensionService
    commandService: ICommandService
    notificationService: INotificationService
    hookService: IHookService
    eventBus: IEventBus
  }): Promise<void> {
    this.extensionService = context.extensionService
    this.commandService = context.commandService
    this.notificationService = context.notificationService
    this.hookService = context.hookService
    this.eventBus = context.eventBus

    // 1. 注册工具栏扩展
    this.registerToolbarExtension()

    // 2. 注册命令
    this.registerCommands()

    // 3. 注册钩子
    this.registerHooks()

    // 4. 监听事件
    this.setupEventListeners()
  }

  /**
   * 停用插件
   */
  public async deactivate(): Promise<void> {
    // 清理资源
  }

  /**
   * 注册工具栏扩展
   */
  private registerToolbarExtension(): void {
    if (!this.extensionService) return

    const extension: IExtension = {
      id: 'ai-assistant-toolbar-btn',
      extensionPointId: 'editor.toolbar',
      name: 'AI助手按钮',
      priority: 80,
      implementation: {
        icon: 'sparkles',
        label: 'AI助手',
        tooltip: '使用AI生成和优化简历内容',
        onClick: () => {
          this.openAIAssistant()
        },
      },
      // 条件：仅在编辑模式下显示
      condition: async () => {
        return true // TODO: 检查编辑模式
      },
    }

    this.extensionService.registerExtension(extension)
  }

  /**
   * 注册命令
   */
  private registerCommands(): void {
    if (!this.commandService) return

    // 命令1：优化选中文本
    this.commandService.register({
      id: 'ai.optimize-text',
      name: 'AI优化文本',
      description: '使用AI优化选中的文本内容',
      category: 'AI',
      undoable: true,
      execute: async context => {
        const { args } = context
        const originalText = args?.text || ''

        try {
          const optimizedText = await this.optimizeText(originalText)
          this.notificationService?.success('文本优化成功！')

          return {
            success: true,
            data: { originalText, optimizedText },
          }
        } catch (error) {
          this.notificationService?.error('AI优化失败：' + (error as Error).message)
          return {
            success: false,
            error: error as Error,
          }
        }
      },
      undo: async context => {
        const { args } = context
        // 恢复原文本
        return { success: true, data: args?.originalText }
      },
    })

    // 命令2：生成工作经历描述
    this.commandService.register({
      id: 'ai.generate-experience',
      name: 'AI生成工作经历',
      description: '根据职位和公司信息生成工作经历描述',
      category: 'AI',
      undoable: true,
      execute: async context => {
        const { args } = context
        const { position, company, duration } = args || {}

        try {
          const description = await this.generateExperienceDescription(position, company, duration)
          this.notificationService?.success('工作经历生成成功！')

          return {
            success: true,
            data: { description },
          }
        } catch (error) {
          this.notificationService?.error('生成失败：' + (error as Error).message)
          return {
            success: false,
            error: error as Error,
          }
        }
      },
      undo: async () => {
        return { success: true }
      },
    })

    // 命令3：生成自我评价
    this.commandService.register({
      id: 'ai.generate-summary',
      name: 'AI生成自我评价',
      description: '根据简历内容生成个性化的自我评价',
      category: 'AI',
      undoable: true,
      execute: async context => {
        const { args } = context
        const resumeData = args?.resumeData

        try {
          const summary = await this.generateSummary(resumeData)
          this.notificationService?.success('自我评价生成成功！')

          return {
            success: true,
            data: { summary },
          }
        } catch (error) {
          this.notificationService?.error('生成失败：' + (error as Error).message)
          return {
            success: false,
            error: error as Error,
          }
        }
      },
      undo: async () => {
        return { success: true }
      },
    })
  }

  /**
   * 注册钩子
   */
  private registerHooks(): void {
    if (!this.hookService) return

    // 保存前：AI内容质量检查
    this.hookService.register({
      id: 'ai-quality-check',
      name: HookNames.SAVE_BEFORE,
      type: 'before',
      priority: 50,
      handler: async context => {
        const { data } = context

        // 检查内容质量
        const qualityIssues = await this.checkContentQuality(data)

        if (qualityIssues.length > 0 && this.notificationService) {
          const proceed = await this.notificationService.confirm({
            title: '内容质量提醒',
            message: `发现 ${qualityIssues.length} 个可优化的地方，是否继续保存？`,
            type: 'warning',
          })

          if (!proceed) {
            if (context.cancel) context.cancel()
            if (this.notificationService) {
              this.notificationService.info('已取消保存，请优化内容后重试')
            }
          }
        }
      },
    })
  }

  /**
   * 设置事件监听
   */
  private setupEventListeners(): void {
    if (!this.eventBus) return

    // 监听节点添加事件
    this.eventBus.on('node:after-add', () => {
      // 可以在此处提供AI建议
    })

    // 监听导出事件
    this.eventBus.on('export:before', () => {
      // 可以在导出前进行AI优化
    })
  }

  /**
   * 打开AI助手面板
   */
  private async openAIAssistant(): Promise<void> {
    // TODO: 实现AI助手UI
    this.notificationService?.info('AI助手功能开发中...')
  }

  /**
   * 优化文本
   */
  private async optimizeText(text: string): Promise<string> {
    // 模拟AI API调用
    await this.delay(1000)

    // 实际应用中，这里会调用真实的AI API
    return `【AI优化后】${text
      .replace(/很好/g, '出色')
      .replace(/工作/g, '负责')
      .replace(/完成/g, '高效完成')}`
  }

  /**
   * 生成工作经历描述
   */
  private async generateExperienceDescription(
    position: string,
    company: string,
    duration: string
  ): Promise<string> {
    await this.delay(1500)

    return `在${company}担任${position}期间（${duration}），负责以下工作：
• 参与核心业务系统的设计与开发，提升系统性能30%
• 带领团队完成多个重要项目，确保按时交付
• 优化开发流程，提高团队协作效率
• 指导初级开发人员，促进团队技术成长
• 与产品、设计团队紧密合作，确保产品质量`
  }

  /**
   * 生成自我评价
   */
  private async generateSummary(resumeData: any): Promise<string> {
    await this.delay(1500)

    return `资深开发工程师，拥有${
      resumeData?.years || '多年'
    }项目经验。擅长全栈开发，精通现代前后端技术栈。
具备优秀的问题解决能力和团队协作精神，能够独立承担复杂项目的设计与开发。
注重代码质量和最佳实践，持续关注技术发展趋势，善于学习和应用新技术。
具有良好的沟通能力，能够与不同角色的团队成员高效协作，推动项目成功交付。`
  }

  /**
   * 检查内容质量
   */
  private async checkContentQuality(data: any): Promise<string[]> {
    await this.delay(500)

    const issues: string[] = []

    // 简单的质量检查逻辑
    if (data?.description && data.description.length < 50) {
      issues.push('描述内容过短，建议补充详细信息')
    }

    if (data?.skills && data.skills.length < 3) {
      issues.push('技能列表较少，建议添加更多相关技能')
    }

    return issues
  }

  /**
   * 延迟函数（模拟API调用）
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * 使用示例：
 *
 * ```typescript
 * import { AIAssistantPlugin } from './examples/plugins/AIAssistantPlugin'
 *
 * // 创建插件实例
 * const aiPlugin = new AIAssistantPlugin({
 *   apiKey: 'your-api-key',
 *   model: 'gpt-4',
 * })
 *
 * // 激活插件
 * await aiPlugin.activate({
 *   extensionService,
 *   commandService,
 *   notificationService,
 *   hookService,
 *   eventBus,
 * })
 * ```
 */
