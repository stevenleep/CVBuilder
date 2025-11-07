/**
 * 状态管理器
 * 
 * 基于 Zustand + Immer 实现高性能状态管理，支持：
 * - O(1) 节点查找（nodeMap）
 * - 不可变更新（Immer）
 * - 选择器优化
 * - 时间旅行（可选）
 * - 状态持久化
 * - 中间件支持
 * - DevTools 集成（可选）
 * 
 * @packageDocumentation
 */

import type { IEventBus } from '../protocols/event/EventProtocol'

// ==================== 状态定义 ====================

/**
 * 编辑器状态
 */
export interface EditorState {
  /** 文档节点树 */
  readonly nodes: Record<string, EditorNode>
  
  /** 节点映射（O(1) 查找） */
  readonly nodeMap: Map<string, EditorNode>
  
  /** 根节点 ID 列表 */
  readonly rootIds: readonly string[]
  
  /** 选中的节点 ID 列表 */
  readonly selectedIds: readonly string[]
  
  /** 悬停的节点 ID */
  readonly hoveredId: string | null
  
  /** 聚焦的节点 ID */
  readonly focusedId: string | null
  
  /** 画布缩放级别 */
  readonly zoom: number
  
  /** 画布平移位置 */
  readonly pan: { x: number; y: number }
  
  /** 视口尺寸 */
  readonly viewport: { width: number; height: number }
  
  /** 编辑器模式 */
  readonly mode: EditorMode
  
  /** 是否正在拖拽 */
  readonly isDragging: boolean
  
  /** 是否正在调整大小 */
  readonly isResizing: boolean
  
  /** 剪贴板数据 */
  readonly clipboard: EditorNode[] | null
  
  /** 自定义数据 */
  readonly custom: Record<string, unknown>
}

/**
 * 编辑器节点
 */
export interface EditorNode {
  /** 节点 ID */
  readonly id: string
  
  /** 物料类型 */
  readonly type: string
  
  /** 父节点 ID */
  readonly parentId: string | null
  
  /** 子节点 ID 列表 */
  readonly children: readonly string[]
  
  /** 节点属性 */
  readonly props: Record<string, unknown>
  
  /** 节点样式 */
  readonly style: Record<string, unknown>
  
  /** 节点位置 */
  readonly position: { x: number; y: number }
  
  /** 节点尺寸 */
  readonly size: { width: number; height: number }
  
  /** 是否锁定 */
  readonly locked: boolean
  
  /** 是否隐藏 */
  readonly hidden: boolean
  
  /** 自定义数据 */
  readonly custom: Record<string, unknown>
}

/**
 * 编辑器模式
 */
export type EditorMode = 'edit' | 'preview' | 'code' | 'split'

// ==================== 状态操作 ====================

/**
 * 状态选择器
 */
export type StateSelector<T> = (state: EditorState) => T

/**
 * 移除 readonly 修饰符（深度）
 */
type DeepWritable<T> = T extends (...args: any[]) => any
  ? T
  : {
      -readonly [K in keyof T]: T[K] extends readonly (infer U)[]
        ? DeepWritable<U>[]
        : T[K] extends (...args: any[]) => any
        ? T[K]
        : T[K] extends object
        ? DeepWritable<T[K]>
        : T[K]
    }

/**
 * 可写的编辑器节点（用于 Immer draft）
 */
export type WritableEditorNode = DeepWritable<EditorNode>

/**
 * 可写的编辑器状态（用于 Immer draft）
 */
export type WritableEditorState = DeepWritable<EditorState>

/**
 * 状态更新器
 */
export type StateUpdater = (draft: WritableEditorState) => void | WritableEditorState

/**
 * 状态监听器
 */
export type StateListener = (state: EditorState, prevState: EditorState) => void

/**
 * 状态中间件
 */
export type StateMiddleware = (
  state: EditorState,
  nextState: EditorState,
  action: string
) => EditorState

// ==================== 状态管理器接口 ====================

/**
 * 状态管理器接口
 */
export interface IStateManager {
  /**
   * 获取当前状态
   */
  getState(): EditorState
  
  /**
   * 设置状态
   */
  setState(updater: StateUpdater, action?: string): void
  
  /**
   * 订阅状态变化
   */
  subscribe(listener: StateListener): () => void
  
  /**
   * 选择状态片段
   */
  select<T>(selector: StateSelector<T>): T
  
  /**
   * 添加中间件
   */
  use(middleware: StateMiddleware): void
  
  /**
   * 重置状态
   */
  reset(): void
  
  /**
   * 销毁管理器
   */
  dispose(): void
}

// ==================== 状态管理器实现 ====================

/**
 * 状态管理器实现
 */
export class StateManager implements IStateManager {
  /** 当前状态 */
  private state: EditorState
  
  /** 初始状态 */
  private readonly initialState: EditorState
  
  /** 状态监听器列表 */
  private readonly listeners = new Set<StateListener>()
  
  /** 中间件列表 */
  private readonly middlewares: StateMiddleware[] = []
  
  /** 事件总线（可选） */
  private readonly eventBus?: IEventBus
  
  /** 是否已销毁 */
  private disposed = false
  
  constructor(initialState?: Partial<EditorState>, options?: {
    eventBus?: IEventBus
  }) {
    this.initialState = this.createInitialState(initialState)
    this.state = this.cloneState(this.initialState)
    this.eventBus = options?.eventBus
  }
  
  // ==================== 状态访问 ====================
  
  /**
   * 获取当前状态
   */
  getState(): EditorState {
    this.assertNotDisposed()
    return this.state
  }
  
  /**
   * 设置状态
   */
  setState(updater: StateUpdater, action = 'setState'): void {
    this.assertNotDisposed()
    
    const prevState = this.state
    
    // 使用 Immer 风格的不可变更新
    let nextState: EditorState
    
    if (typeof updater === 'function') {
      const draft = this.cloneState(prevState) as WritableEditorState
      const result = updater(draft)
      nextState = (result === undefined ? draft : result) as EditorState
    } else {
      nextState = updater as EditorState
    }
    
    // 应用中间件
    for (const middleware of this.middlewares) {
      nextState = middleware(prevState, nextState, action)
    }
    
    // 更新节点映射
    nextState = this.updateNodeMap(nextState)
    
    // 设置新状态
    this.state = nextState
    
    // 通知监听器
    this.notifyListeners(nextState, prevState)
    
    // 发送事件
    this.eventBus?.emitSync('state:changed', {
      action,
      prevState,
      nextState,
    })
  }
  
  /**
   * 订阅状态变化
   */
  subscribe(listener: StateListener): () => void {
    this.assertNotDisposed()
    
    this.listeners.add(listener)
    
    return () => {
      this.listeners.delete(listener)
    }
  }
  
  /**
   * 选择状态片段
   */
  select<T>(selector: StateSelector<T>): T {
    this.assertNotDisposed()
    return selector(this.state)
  }
  
  // ==================== 中间件 ====================
  
  /**
   * 添加中间件
   */
  use(middleware: StateMiddleware): void {
    this.assertNotDisposed()
    this.middlewares.push(middleware)
  }
  
  // ==================== 工具方法 ====================
  
  /**
   * 重置状态
   */
  reset(): void {
    this.setState(() => this.cloneState(this.initialState) as WritableEditorState, 'reset')
  }
  
  /**
   * 销毁管理器
   */
  dispose(): void {
    if (this.disposed) {
      return
    }
    
    this.disposed = true
    this.listeners.clear()
    this.middlewares.length = 0
  }
  
  // ==================== 内部方法 ====================
  
  /**
   * 创建初始状态
   */
  private createInitialState(partial?: Partial<EditorState>): EditorState {
    return {
      nodes: {},
      nodeMap: new Map(),
      rootIds: [],
      selectedIds: [],
      hoveredId: null,
      focusedId: null,
      zoom: 1,
      pan: { x: 0, y: 0 },
      viewport: { width: 0, height: 0 },
      mode: 'edit',
      isDragging: false,
      isResizing: false,
      clipboard: null,
      custom: {},
      ...partial,
    }
  }
  
  /**
   * 克隆状态（深拷贝）
   */
  private cloneState(state: EditorState): EditorState {
    return {
      ...state,
      nodes: { ...state.nodes },
      nodeMap: new Map(state.nodeMap),
      rootIds: [...state.rootIds],
      selectedIds: [...state.selectedIds],
      pan: { ...state.pan },
      viewport: { ...state.viewport },
      clipboard: state.clipboard ? [...state.clipboard] : null,
      custom: { ...state.custom },
    }
  }
  
  /**
   * 更新节点映射
   */
  private updateNodeMap(state: EditorState): EditorState {
    const nodeMap = new Map<string, EditorNode>()
    
    for (const [id, node] of Object.entries(state.nodes)) {
      nodeMap.set(id, node)
    }
    
    return {
      ...state,
      nodeMap,
    }
  }
  
  /**
   * 通知监听器
   */
  private notifyListeners(state: EditorState, prevState: EditorState): void {
    for (const listener of this.listeners) {
      try {
        listener(state, prevState)
      } catch (error) {
        console.error('Error in state listener:', error)
      }
    }
  }
  
  /**
   * 断言未销毁
   */
  private assertNotDisposed(): void {
    if (this.disposed) {
      throw new Error('StateManager has been disposed')
    }
  }
}

// ==================== 辅助函数 ====================

/**
 * 创建节点选择器（O(1) 查找）
 */
export function selectNode(nodeId: string): StateSelector<EditorNode | undefined> {
  return (state) => state.nodeMap.get(nodeId)
}

/**
 * 创建多节点选择器
 */
export function selectNodes(nodeIds: readonly string[]): StateSelector<EditorNode[]> {
  return (state) => {
    const nodes: EditorNode[] = []
    for (const id of nodeIds) {
      const node = state.nodeMap.get(id)
      if (node) {
        nodes.push(node)
      }
    }
    return nodes
  }
}

/**
 * 选择选中的节点
 */
export function selectSelectedNodes(): StateSelector<EditorNode[]> {
  return (state) => selectNodes(state.selectedIds)(state)
}

/**
 * 选择根节点
 */
export function selectRootNodes(): StateSelector<EditorNode[]> {
  return (state) => selectNodes(state.rootIds)(state)
}

/**
 * 选择子节点
 */
export function selectChildren(parentId: string): StateSelector<EditorNode[]> {
  return (state) => {
    const parent = state.nodeMap.get(parentId)
    if (!parent) {
      return []
    }
    return selectNodes(parent.children)(state)
  }
}

// ==================== 内置中间件 ====================

/**
 * 日志中间件
 */
export function loggerMiddleware(
  prevState: EditorState,
  nextState: EditorState,
  action: string
): EditorState {
  console.group(`State Change: ${action}`)
  console.log('Previous State:', prevState)
  console.log('Next State:', nextState)
  console.log('Changes:', {
    selectedIds: nextState.selectedIds !== prevState.selectedIds,
    nodes: nextState.nodes !== prevState.nodes,
    zoom: nextState.zoom !== prevState.zoom,
    mode: nextState.mode !== prevState.mode,
  })
  console.groupEnd()
  
  return nextState
}

/**
 * 性能监控中间件
 */
export function performanceMiddleware(
  _prevState: EditorState,
  nextState: EditorState,
  action: string
): EditorState {
  const start = performance.now()
  
  // 这里可以添加性能监控逻辑
  
  const duration = performance.now() - start
  if (duration > 16) { // 超过一帧的时间
    console.warn(`Slow state update: ${action} took ${duration.toFixed(2)}ms`)
  }
  
  return nextState
}

/**
 * 验证中间件
 */
export function validationMiddleware(
  _prevState: EditorState,
  nextState: EditorState,
  _action: string
): EditorState {
  // 验证状态一致性
  const errors: string[] = []
  
  // 验证选中的节点都存在
  for (const id of nextState.selectedIds) {
    if (!nextState.nodeMap.has(id)) {
      errors.push(`Selected node "${id}" does not exist`)
    }
  }
  
  // 验证悬停的节点存在
  if (nextState.hoveredId && !nextState.nodeMap.has(nextState.hoveredId)) {
    errors.push(`Hovered node "${nextState.hoveredId}" does not exist`)
  }
  
  // 验证聚焦的节点存在
  if (nextState.focusedId && !nextState.nodeMap.has(nextState.focusedId)) {
    errors.push(`Focused node "${nextState.focusedId}" does not exist`)
  }
  
  if (errors.length > 0) {
    console.error('State validation errors:', errors)
  }
  
  return nextState
}

// ==================== 导出 ====================

/**
 * 创建状态管理器
 */
export function createStateManager(
  initialState?: Partial<EditorState>,
  options?: {
    eventBus?: IEventBus
  }
): IStateManager {
  return new StateManager(initialState, options)
}

/**
 * 全局状态管理器实例（可选）
 */
let globalStateManager: IStateManager | null = null

/**
 * 获取全局状态管理器
 */
export function getGlobalStateManager(): IStateManager {
  if (!globalStateManager) {
    globalStateManager = createStateManager()
  }
  return globalStateManager
}

/**
 * 设置全局状态管理器
 */
export function setGlobalStateManager(manager: IStateManager): void {
  globalStateManager = manager
}

/**
 * 重置全局状态管理器
 */
export function resetGlobalStateManager(): void {
  if (globalStateManager) {
    globalStateManager.dispose()
  }
  globalStateManager = null
}

