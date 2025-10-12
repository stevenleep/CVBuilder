/**
 * 钩子服务实现
 *
 * 提供生命周期钩子系统，允许在关键时刻插入自定义逻辑
 */

import {
  IHookService,
  IHook,
  IHookContext,
  IHookResult,
  HookType,
} from '../protocols/IHookProtocol'
import { IEventBus } from '../protocols/IEventProtocol'

export class HookService implements IHookService {
  private hooks: Map<string, IHook> = new Map()
  // 钩子名称 -> 钩子列表
  private hooksByName: Map<string, IHook[]> = new Map()
  private eventBus?: IEventBus

  constructor(eventBus?: IEventBus) {
    this.eventBus = eventBus
  }

  /**
   * 注册钩子
   */
  public register<T = any, R = any>(hook: IHook<T, R>): void {
    if (this.hooks.has(hook.id)) {
      console.warn(`[HookService] 钩子 "${hook.id}" 已存在，将被覆盖`)
    }

    const normalizedHook: IHook<T, R> = {
      ...hook,
      enabled: hook.enabled ?? true,
      priority: hook.priority ?? 0,
      once: hook.once ?? false,
    }

    this.hooks.set(hook.id, normalizedHook)

    // 添加到名称索引
    if (!this.hooksByName.has(hook.name)) {
      this.hooksByName.set(hook.name, [])
    }
    const hooks = this.hooksByName.get(hook.name)!
    hooks.push(normalizedHook)
    // 按优先级排序
    hooks.sort((a, b) => (b.priority || 0) - (a.priority || 0))

    this.eventBus?.emit('hook:registered', { hook: normalizedHook })
  }

  /**
   * 批量注册
   */
  public registerAll(hooks: IHook[]): void {
    hooks.forEach(hook => this.register(hook))
  }

  /**
   * 注销钩子
   */
  public unregister(hookId: string): void {
    const hook = this.hooks.get(hookId)
    if (hook) {
      this.hooks.delete(hookId)

      // 从名称索引中移除
      const hooks = this.hooksByName.get(hook.name) || []
      const index = hooks.findIndex(h => h.id === hookId)
      if (index !== -1) {
        hooks.splice(index, 1)
      }

      this.eventBus?.emit('hook:unregistered', { hookId })
    }
  }

  /**
   * 触发钩子
   */
  public async trigger<T = any, R = any>(
    hookName: string,
    data: T,
    metadata?: Record<string, any>
  ): Promise<IHookResult<R>> {
    const hooks = this.hooksByName.get(hookName) || []
    const enabledHooks = hooks.filter(h => h.enabled)

    if (enabledHooks.length === 0) {
      return {
        success: true,
        data: data as unknown as R,
        executedCount: 0,
      }
    }

    let currentData = data
    let cancelled = false
    let executedCount = 0
    const hooksToRemove: string[] = []

    for (const hook of enabledHooks) {
      try {
        // 检查条件
        if (hook.condition) {
          const context: IHookContext<T> = {
            hookName,
            type: hook.type,
            data: currentData,
            metadata,
          }
          const shouldExecute = await hook.condition(context)
          if (!shouldExecute) {
            continue
          }
        }

        const context: IHookContext<T> = {
          hookName,
          type: hook.type,
          data: currentData,
          cancelled: false,
          metadata,
          cancel: () => {
            cancelled = true
          },
          setData: (newData: T) => {
            currentData = newData
          },
        }

        // 执行钩子
        const result = await hook.handler(context)
        executedCount++

        // 如果钩子返回了值，更新当前数据
        if (result !== undefined) {
          currentData = result as unknown as T
        }

        // 如果是一次性钩子，标记为待移除
        if (hook.once) {
          hooksToRemove.push(hook.id)
        }

        // 如果被取消，停止后续钩子
        if (context.cancelled || cancelled) {
          cancelled = true
          break
        }

        this.eventBus?.emit('hook:executed', { hook, result })
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        console.error(`[HookService] 钩子 "${hook.id}" 执行失败:`, err)
        this.eventBus?.emit('hook:error', { hook, error: err })

        return {
          success: false,
          error: err,
          executedCount,
        }
      }
    }

    // 移除一次性钩子
    hooksToRemove.forEach(id => this.unregister(id))

    return {
      success: true,
      data: currentData as unknown as R,
      cancelled,
      executedCount,
    }
  }

  /**
   * 触发 before 钩子
   */
  public async triggerBefore<T = any>(
    hookName: string,
    data: T,
    metadata?: Record<string, any>
  ): Promise<IHookResult<T>> {
    const hooks = this.hooksByName.get(hookName) || []
    const beforeHooks = hooks.filter(h => h.type === 'before' && h.enabled)

    if (beforeHooks.length === 0) {
      return {
        success: true,
        data,
        executedCount: 0,
      }
    }

    return this.trigger(hookName, data, metadata)
  }

  /**
   * 触发 after 钩子
   */
  public async triggerAfter<T = any>(
    hookName: string,
    data: T,
    metadata?: Record<string, any>
  ): Promise<IHookResult<T>> {
    const hooks = this.hooksByName.get(hookName) || []
    const afterHooks = hooks.filter(h => h.type === 'after' && h.enabled)

    if (afterHooks.length === 0) {
      return {
        success: true,
        data,
        executedCount: 0,
      }
    }

    return this.trigger(hookName, data, metadata)
  }

  /**
   * 启用钩子
   */
  public enable(hookId: string): void {
    const hook = this.hooks.get(hookId)
    if (hook) {
      hook.enabled = true
      this.eventBus?.emit('hook:enabled', { hookId })
    }
  }

  /**
   * 禁用钩子
   */
  public disable(hookId: string): void {
    const hook = this.hooks.get(hookId)
    if (hook) {
      hook.enabled = false
      this.eventBus?.emit('hook:disabled', { hookId })
    }
  }

  /**
   * 获取钩子
   */
  public get(hookId: string): IHook | undefined {
    return this.hooks.get(hookId)
  }

  /**
   * 获取指定名称的所有钩子
   */
  public getByName(hookName: string): IHook[] {
    return this.hooksByName.get(hookName) || []
  }

  /**
   * 获取指定类型的所有钩子
   */
  public getByType(type: HookType): IHook[] {
    return Array.from(this.hooks.values()).filter(h => h.type === type)
  }

  /**
   * 清空钩子
   */
  public clear(): void {
    this.hooks.clear()
    this.hooksByName.clear()
    this.eventBus?.emit('hook:cleared', {})
  }

  /**
   * 清空指定名称的钩子
   */
  public clearByName(hookName: string): void {
    const hooks = this.hooksByName.get(hookName) || []
    hooks.forEach(hook => this.hooks.delete(hook.id))
    this.hooksByName.delete(hookName)
    this.eventBus?.emit('hook:cleared-by-name', { hookName })
  }
}

// 服务标识符
export const HOOK_SERVICE_TOKEN = Symbol('HookService')
