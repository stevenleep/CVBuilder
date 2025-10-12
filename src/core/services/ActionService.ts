/**
 * 行为服务实现
 *
 * 实现IActionProtocol，提供用户操作和系统行为的管理
 */

import { IAction, IActionContext } from '../protocols/IActionProtocol'
import { IEventBus } from '../protocols/IEventProtocol'

// 行为处理器类型
export type IActionHandler = (context: IActionContext) => any | Promise<any>

// 行为执行结果
export interface IActionResult {
  success: boolean
  data?: any
  error?: Error
}

export class ActionService {
  private actions: Map<string, IAction> = new Map()
  private handlers: Map<string, IActionHandler> = new Map()
  private eventBus?: IEventBus

  constructor(eventBus?: IEventBus) {
    this.eventBus = eventBus
  }

  /**
   * 注册行为
   */
  public registerAction(action: IAction): void {
    if (this.actions.has(action.id)) {
      console.warn(`[ActionService] 行为 "${action.id}" 已存在，将被覆盖`)
    }

    this.actions.set(action.id, action)
    this.eventBus?.emit('action:registered', { action })
  }

  /**
   * 注册处理器
   */
  public registerHandler(actionId: string, handler: IActionHandler): void {
    if (!this.actions.has(actionId)) {
      console.warn(`[ActionService] 行为 "${actionId}" 不存在`)
    }

    this.handlers.set(actionId, handler)
    this.eventBus?.emit('action:handler-registered', { actionId })
  }

  /**
   * 执行行为
   */
  public async execute(actionId: string, context: IActionContext): Promise<IActionResult> {
    const action = this.actions.get(actionId)
    if (!action) {
      return {
        success: false,
        error: new Error(`行为 "${actionId}" 不存在`),
      }
    }

    // 检查是否可用
    if (action.enabled && !action.enabled(context)) {
      return {
        success: false,
        error: new Error(`行为 "${actionId}" 不可用`),
      }
    }

    const handler = this.handlers.get(actionId)
    if (!handler) {
      return {
        success: false,
        error: new Error(`行为 "${actionId}" 没有处理器`),
      }
    }

    const startTime = Date.now()

    try {
      this.eventBus?.emit('action:before-execute', { actionId, context })

      const result = await handler(context)
      const duration = Date.now() - startTime

      this.eventBus?.emit('action:executed', { actionId, context, result, duration })

      return {
        success: true,
        data: result,
      }
    } catch (error) {
      const duration = Date.now() - startTime
      const err = error instanceof Error ? error : new Error(String(error))

      this.eventBus?.emit('action:error', { actionId, context, error: err, duration })

      return {
        success: false,
        error: err,
      }
    }
  }

  /**
   * 获取行为
   */
  public getAction(actionId: string): IAction | undefined {
    return this.actions.get(actionId)
  }

  /**
   * 获取所有行为
   */
  public getAllActions(): IAction[] {
    return Array.from(this.actions.values())
  }

  /**
   * 按分类获取
   */
  public getByCategory(category: string): IAction[] {
    return this.getAllActions().filter(action => (action as any).category === category)
  }

  /**
   * 注销行为
   */
  public unregisterAction(actionId: string): void {
    if (this.actions.delete(actionId)) {
      this.handlers.delete(actionId)
      this.eventBus?.emit('action:unregistered', { actionId })
    }
  }

  /**
   * 启用行为
   */
  public enableAction(actionId: string): void {
    const action = this.actions.get(actionId)
    if (action) {
      ;(action as any).isEnabled = true
      this.eventBus?.emit('action:enabled', { actionId })
    }
  }

  /**
   * 禁用行为
   */
  public disableAction(actionId: string): void {
    const action = this.actions.get(actionId)
    if (action) {
      ;(action as any).isEnabled = false
      this.eventBus?.emit('action:disabled', { actionId })
    }
  }
}

// 服务标识符
export const ACTION_SERVICE_TOKEN = Symbol('ActionService')
