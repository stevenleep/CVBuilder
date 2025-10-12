/**
 * 快捷键服务实现
 *
 * 提供统一的快捷键管理系统
 */

import {
  IShortcutService,
  IShortcut,
  IShortcutContext,
  IShortcutConflict,
  IShortcutHelp,
} from '../protocols/IShortcutProtocol'
import { IEventBus } from '../protocols/IEventProtocol'

export class ShortcutService implements IShortcutService {
  private shortcuts: Map<string, IShortcut> = new Map()
  private contexts: Map<string, IShortcutContext> = new Map()
  private eventBus?: IEventBus
  private boundTarget?: HTMLElement
  private keydownHandler?: (event: KeyboardEvent) => void

  constructor(eventBus?: IEventBus) {
    this.eventBus = eventBus
  }

  /**
   * 注册快捷键
   */
  public register(shortcut: IShortcut): void {
    if (this.shortcuts.has(shortcut.id)) {
      console.warn(`[ShortcutService] 快捷键 "${shortcut.id}" 已存在，将被覆盖`)
    }

    const normalizedShortcut = {
      ...shortcut,
      key: this.normalizeKey(shortcut.key),
      enabled: shortcut.enabled ?? true,
      priority: shortcut.priority ?? 0,
      preventDefault: shortcut.preventDefault ?? true,
      stopPropagation: shortcut.stopPropagation ?? false,
    }

    this.shortcuts.set(shortcut.id, normalizedShortcut)
    this.eventBus?.emit('shortcut:registered', { shortcut: normalizedShortcut })
  }

  /**
   * 批量注册
   */
  public registerAll(shortcuts: IShortcut[]): void {
    shortcuts.forEach(shortcut => this.register(shortcut))
  }

  /**
   * 注销快捷键
   */
  public unregister(id: string): void {
    if (this.shortcuts.delete(id)) {
      this.eventBus?.emit('shortcut:unregistered', { id })
    }
  }

  /**
   * 启用快捷键
   */
  public enable(id: string): void {
    const shortcut = this.shortcuts.get(id)
    if (shortcut) {
      shortcut.enabled = true
      this.eventBus?.emit('shortcut:enabled', { id })
    }
  }

  /**
   * 禁用快捷键
   */
  public disable(id: string): void {
    const shortcut = this.shortcuts.get(id)
    if (shortcut) {
      shortcut.enabled = false
      this.eventBus?.emit('shortcut:disabled', { id })
    }
  }

  /**
   * 获取快捷键
   */
  public get(id: string): IShortcut | undefined {
    return this.shortcuts.get(id)
  }

  /**
   * 获取所有快捷键
   */
  public getAll(): IShortcut[] {
    return Array.from(this.shortcuts.values())
  }

  /**
   * 按分类获取
   */
  public getByCategory(category: string): IShortcut[] {
    return this.getAll().filter(s => s.category === category)
  }

  /**
   * 检查快捷键冲突
   */
  public hasConflict(key: string): boolean {
    const normalizedKey = this.normalizeKey(key)
    let count = 0
    for (const shortcut of this.shortcuts.values()) {
      if (shortcut.key === normalizedKey && shortcut.enabled) {
        count++
        if (count > 1) return true
      }
    }
    return false
  }

  /**
   * 获取冲突信息
   */
  public getConflicts(): IShortcutConflict[] {
    const conflicts: Map<string, IShortcut[]> = new Map()

    for (const shortcut of this.shortcuts.values()) {
      if (!shortcut.enabled) continue

      const existing = conflicts.get(shortcut.key) || []
      existing.push(shortcut)
      conflicts.set(shortcut.key, existing)
    }

    return Array.from(conflicts.entries())
      .filter(([, shortcuts]) => shortcuts.length > 1)
      .map(([key, shortcuts]) => ({ key, shortcuts }))
  }

  /**
   * 获取帮助文档
   */
  public getHelp(): IShortcutHelp[] {
    const categories = new Map<string, IShortcut[]>()

    for (const shortcut of this.shortcuts.values()) {
      if (!shortcut.enabled || !shortcut.description) continue

      const category = shortcut.category || '其他'
      const existing = categories.get(category) || []
      existing.push(shortcut)
      categories.set(category, existing)
    }

    return Array.from(categories.entries()).map(([category, shortcuts]) => ({
      category,
      shortcuts: shortcuts.map(s => ({
        key: this.formatKey(s.key),
        description: s.description || '',
      })),
    }))
  }

  /**
   * 创建上下文
   */
  public createContext(name: string, shortcuts: IShortcut[]): void {
    this.contexts.set(name, {
      name,
      shortcuts,
      active: false,
    })
  }

  /**
   * 激活上下文
   */
  public activateContext(name: string): void {
    const context = this.contexts.get(name)
    if (context) {
      context.active = true
      context.shortcuts.forEach(s => this.register(s))
      this.eventBus?.emit('shortcut:context-activated', { name })
    }
  }

  /**
   * 停用上下文
   */
  public deactivateContext(name: string): void {
    const context = this.contexts.get(name)
    if (context) {
      context.active = false
      context.shortcuts.forEach(s => this.unregister(s.id))
      this.eventBus?.emit('shortcut:context-deactivated', { name })
    }
  }

  /**
   * 清空所有快捷键
   */
  public clear(): void {
    this.shortcuts.clear()
    this.eventBus?.emit('shortcut:cleared', {})
  }

  /**
   * 绑定到目标元素
   */
  public bind(target: HTMLElement): () => void {
    this.unbind()

    this.boundTarget = target
    this.keydownHandler = (event: KeyboardEvent) => {
      this.handleKeyDown(event)
    }

    target.addEventListener('keydown', this.keydownHandler)

    return () => this.unbind()
  }

  /**
   * 解绑
   */
  public unbind(): void {
    if (this.boundTarget && this.keydownHandler) {
      this.boundTarget.removeEventListener('keydown', this.keydownHandler)
      this.boundTarget = undefined
      this.keydownHandler = undefined
    }
  }

  /**
   * 处理键盘事件
   */
  private handleKeyDown(event: KeyboardEvent): void {
    // 获取所有匹配的快捷键，按优先级排序
    const matchedShortcuts = Array.from(this.shortcuts.values())
      .filter(shortcut => {
        if (!shortcut.enabled) return false
        if (shortcut.condition && !shortcut.condition()) return false
        if (shortcut.target) {
          const target =
            typeof shortcut.target === 'string'
              ? document.querySelector(shortcut.target)
              : shortcut.target
          if (target !== event.target && !target?.contains(event.target as Node)) {
            return false
          }
        }
        return this.matchKey(event, shortcut.key)
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))

    // 执行第一个匹配的快捷键
    const shortcut = matchedShortcuts[0]
    if (shortcut) {
      if (shortcut.preventDefault) {
        event.preventDefault()
      }
      if (shortcut.stopPropagation) {
        event.stopPropagation()
      }

      try {
        shortcut.handler(event)
        this.eventBus?.emit('shortcut:triggered', { shortcut, event })
      } catch (error) {
        console.error('[ShortcutService] 快捷键处理错误:', error)
        this.eventBus?.emit('shortcut:error', { shortcut, error })
      }
    }
  }

  /**
   * 匹配键盘事件
   */
  private matchKey(event: KeyboardEvent, shortcutKey: string): boolean {
    const parts = shortcutKey.toLowerCase().split('+')
    const modifiers = parts.slice(0, -1)
    const key = parts[parts.length - 1]

    // 检查修饰键
    if (modifiers.includes('ctrl') && !event.ctrlKey) return false
    if (modifiers.includes('cmd') && !event.metaKey) return false
    if (modifiers.includes('shift') && !event.shiftKey) return false
    if (modifiers.includes('alt') && !event.altKey) return false

    // 检查主键
    return event.key.toLowerCase() === key || event.code.toLowerCase() === key.toLowerCase()
  }

  /**
   * 标准化快捷键字符串
   */
  private normalizeKey(key: string): string {
    return key
      .toLowerCase()
      .split('+')
      .map(k => k.trim())
      .sort((a, b) => {
        const order = ['ctrl', 'cmd', 'alt', 'shift']
        const aIndex = order.indexOf(a)
        const bIndex = order.indexOf(b)
        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1
        return aIndex - bIndex
      })
      .join('+')
  }

  /**
   * 格式化快捷键显示
   */
  private formatKey(key: string): string {
    const isMac = navigator.platform.toLowerCase().includes('mac')
    return key
      .split('+')
      .map(k => {
        if (k === 'cmd' && isMac) return '⌘'
        if (k === 'ctrl' && isMac) return '⌃'
        if (k === 'alt' && isMac) return '⌥'
        if (k === 'shift' && isMac) return '⇧'
        return k.charAt(0).toUpperCase() + k.slice(1)
      })
      .join(isMac ? '' : '+')
  }
}

// 服务标识符
export const SHORTCUT_SERVICE_TOKEN = Symbol('ShortcutService')
