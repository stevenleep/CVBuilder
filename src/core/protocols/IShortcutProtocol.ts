/**
 * 快捷键服务协议
 *
 * 定义统一的快捷键管理系统
 */

/**
 * 快捷键定义
 */
export interface IShortcut {
  /** 快捷键ID */
  id: string
  /** 快捷键组合（如 "Ctrl+S", "Cmd+Shift+P"） */
  key: string
  /** 描述 */
  description?: string
  /** 分类 */
  category?: string
  /** 处理函数 */
  handler: (event: KeyboardEvent) => void | Promise<void>
  /** 是否全局（在所有上下文中生效） */
  global?: boolean
  /** 是否启用 */
  enabled?: boolean
  /** 优先级（越大越先执行） */
  priority?: number
  /** 阻止默认行为 */
  preventDefault?: boolean
  /** 阻止事件冒泡 */
  stopPropagation?: boolean
  /** 只在特定元素上生效 */
  target?: HTMLElement | string
  /** 条件函数（返回false则不触发） */
  condition?: () => boolean
}

/**
 * 快捷键上下文
 */
export interface IShortcutContext {
  /** 上下文名称 */
  name: string
  /** 上下文中的快捷键 */
  shortcuts: IShortcut[]
  /** 是否激活 */
  active: boolean
}

/**
 * 快捷键冲突信息
 */
export interface IShortcutConflict {
  /** 快捷键 */
  key: string
  /** 冲突的快捷键定义 */
  shortcuts: IShortcut[]
}

/**
 * 快捷键帮助信息
 */
export interface IShortcutHelp {
  /** 分类 */
  category: string
  /** 该分类下的快捷键 */
  shortcuts: Array<{
    key: string
    description: string
  }>
}

/**
 * 快捷键服务接口
 */
export interface IShortcutService {
  /** 注册快捷键 */
  register(shortcut: IShortcut): void

  /** 批量注册 */
  registerAll(shortcuts: IShortcut[]): void

  /** 注销快捷键 */
  unregister(id: string): void

  /** 启用快捷键 */
  enable(id: string): void

  /** 禁用快捷键 */
  disable(id: string): void

  /** 获取快捷键 */
  get(id: string): IShortcut | undefined

  /** 获取所有快捷键 */
  getAll(): IShortcut[]

  /** 按分类获取 */
  getByCategory(category: string): IShortcut[]

  /** 检查快捷键冲突 */
  hasConflict(key: string): boolean

  /** 获取冲突信息 */
  getConflicts(): IShortcutConflict[]

  /** 获取帮助文档 */
  getHelp(): IShortcutHelp[]

  /** 创建上下文 */
  createContext(name: string, shortcuts: IShortcut[]): void

  /** 激活上下文 */
  activateContext(name: string): void

  /** 停用上下文 */
  deactivateContext(name: string): void

  /** 清空所有快捷键 */
  clear(): void

  /** 绑定到目标元素 */
  bind(target: HTMLElement): () => void

  /** 解绑 */
  unbind(): void
}

/**
 * 键盘事件工具
 */
export interface IKeyboardUtil {
  /** 解析快捷键字符串 */
  parse(key: string): {
    ctrl: boolean
    shift: boolean
    alt: boolean
    meta: boolean
    key: string
  }

  /** 匹配键盘事件 */
  match(event: KeyboardEvent, shortcut: string): boolean

  /** 格式化快捷键显示 */
  format(key: string): string

  /** 标准化快捷键字符串 */
  normalize(key: string): string
}
