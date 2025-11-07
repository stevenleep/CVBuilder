/**
 * 历史服务
 * 
 * 实现完整的撤销/重做系统，支持：
 * - 撤销/重做
 * - 增量历史记录
 * - 历史快照
 * - 历史合并
 * - 暂停/恢复
 * - 差异计算
 * - 历史查询
 * 
 * @packageDocumentation
 */

import type {
  IHistoryService,
  HistoryRecord,
  HistorySnapshot,
  HistoryConfig,
  HistoryChangeListener,
  HistoryActionListener,
  Disposable,
} from '../protocols/history/HistoryProtocol'

import {
  mergeHistoryRecords,
} from '../protocols/history/HistoryProtocol'

import type { IEventBus } from '../protocols/event/EventProtocol'

// ==================== 历史服务实现 ====================

/**
 * 历史服务实现
 */
export class HistoryService implements IHistoryService {
  /** 历史记录栈 */
  private readonly records: HistoryRecord[] = []
  
  /** 当前位置（指向下一个要撤销的记录） */
  private currentIndex = 0
  
  /** 快照列表 */
  private readonly snapshots: HistorySnapshot[] = []
  
  /** 是否已暂停 */
  private paused = false
  
  /** 变化监听器 */
  private readonly changeListeners = new Set<HistoryChangeListener>()
  
  /** 撤销监听器 */
  private readonly undoListeners = new Set<HistoryActionListener>()
  
  /** 重做监听器 */
  private readonly redoListeners = new Set<HistoryActionListener>()
  
  /** 配置 */
  private readonly config: Required<HistoryConfig>
  
  /** 事件总线（可选） */
  private readonly eventBus?: IEventBus
  
  /** 是否已销毁 */
  private disposed = false
  
  /** 上次快照时间 */
  private lastSnapshotTime = 0
  
  /** 当前状态（用于快照） */
  private currentState: unknown = null
  
  constructor(config?: HistoryConfig, options?: {
    eventBus?: IEventBus
  }) {
    this.config = {
      maxRecords: config?.maxRecords || 100,
      incremental: config?.incremental !== false,
      autoSnapshot: config?.autoSnapshot !== false,
      snapshotInterval: config?.snapshotInterval || 30000, // 30秒
      mergeConsecutive: config?.mergeConsecutive !== false,
      mergeWindow: config?.mergeWindow || 1000, // 1秒
      ignorePaths: config?.ignorePaths || [],
    }
    
    this.eventBus = options?.eventBus
  }
  
  // ==================== 历史记录 ====================
  
  /**
   * 添加历史记录
   */
  push(record: HistoryRecord): void {
    this.assertNotDisposed()
    
    if (this.paused) {
      return
    }
    
    // 清除当前位置之后的记录
    if (this.currentIndex < this.records.length) {
      this.records.splice(this.currentIndex)
    }
    
    // 尝试合并连续操作
    if (this.config.mergeConsecutive && this.records.length > 0) {
      const lastRecord = this.records[this.records.length - 1]
      const timeDiff = record.timestamp - lastRecord.timestamp
      
      if (timeDiff < this.config.mergeWindow) {
        // 合并记录
        const merged = mergeHistoryRecords([lastRecord, record])
        this.records[this.records.length - 1] = merged
        this.notifyChange('push')
        return
      }
    }
    
    // 添加新记录
    this.records.push(record)
    this.currentIndex = this.records.length
    
    // 限制记录数量
    if (this.records.length > this.config.maxRecords) {
      this.records.shift()
      this.currentIndex--
    }
    
    // 自动创建快照
    if (this.config.autoSnapshot) {
      const now = Date.now()
      if (now - this.lastSnapshotTime > this.config.snapshotInterval) {
        if (this.currentState) {
          this.createSnapshot()
        }
      }
    }
    
    this.notifyChange('push')
  }
  
  /**
   * 批量添加历史记录
   */
  pushBatch(records: readonly HistoryRecord[]): void {
    this.assertNotDisposed()
    
    if (this.paused) {
      return
    }
    
    for (const record of records) {
      this.push(record)
    }
  }
  
  // ==================== 撤销/重做 ====================
  
  /**
   * 撤销
   */
  async undo(): Promise<boolean> {
    this.assertNotDisposed()
    
    if (!this.canUndo()) {
      return false
    }
    
    const record = this.records[this.currentIndex - 1]
    this.currentIndex--
    
    // 通知监听器
    this.notifyUndo(record)
    this.notifyChange('undo')
    
    // 发送事件
    await this.eventBus?.emit('history:undo', {
      step: this.currentIndex,
    })
    
    return true
  }
  
  /**
   * 重做
   */
  async redo(): Promise<boolean> {
    this.assertNotDisposed()
    
    if (!this.canRedo()) {
      return false
    }
    
    const record = this.records[this.currentIndex]
    this.currentIndex++
    
    // 通知监听器
    this.notifyRedo(record)
    this.notifyChange('redo')
    
    // 发送事件
    await this.eventBus?.emit('history:redo', {
      step: this.currentIndex,
    })
    
    return true
  }
  
  /**
   * 撤销到指定位置
   */
  async undoTo(recordId: string): Promise<boolean> {
    this.assertNotDisposed()
    
    const index = this.records.findIndex(r => r.id === recordId)
    if (index === -1 || index >= this.currentIndex) {
      return false
    }
    
    while (this.currentIndex > index + 1) {
      await this.undo()
    }
    
    return true
  }
  
  /**
   * 重做到指定位置
   */
  async redoTo(recordId: string): Promise<boolean> {
    this.assertNotDisposed()
    
    const index = this.records.findIndex(r => r.id === recordId)
    if (index === -1 || index < this.currentIndex) {
      return false
    }
    
    while (this.currentIndex <= index) {
      await this.redo()
    }
    
    return true
  }
  
  /**
   * 是否可以撤销
   */
  canUndo(): boolean {
    return this.currentIndex > 0
  }
  
  /**
   * 是否可以重做
   */
  canRedo(): boolean {
    return this.currentIndex < this.records.length
  }
  
  // ==================== 查询方法 ====================
  
  /**
   * 获取当前位置
   */
  getCurrentIndex(): number {
    return this.currentIndex
  }
  
  /**
   * 获取历史记录列表
   */
  getRecords(): readonly HistoryRecord[] {
    return this.records
  }
  
  /**
   * 获取撤销栈
   */
  getUndoStack(): readonly HistoryRecord[] {
    return this.records.slice(0, this.currentIndex)
  }
  
  /**
   * 获取重做栈
   */
  getRedoStack(): readonly HistoryRecord[] {
    return this.records.slice(this.currentIndex)
  }
  
  // ==================== 快照 ====================
  
  /**
   * 创建快照
   */
  createSnapshot(description?: string): HistorySnapshot {
    this.assertNotDisposed()
    
    const snapshot: HistorySnapshot = {
      id: `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      state: this.cloneState(this.currentState),
      description,
    }
    
    this.snapshots.push(snapshot)
    this.lastSnapshotTime = snapshot.timestamp
    
    return snapshot
  }
  
  /**
   * 恢复快照
   */
  async restoreSnapshot(snapshotId: string): Promise<boolean> {
    this.assertNotDisposed()
    
    const snapshot = this.snapshots.find(s => s.id === snapshotId)
    if (!snapshot) {
      return false
    }
    
    this.currentState = this.cloneState(snapshot.state)
    
    // 清除历史记录
    this.records.length = 0
    this.currentIndex = 0
    
    this.notifyChange('restore')
    
    return true
  }
  
  /**
   * 获取所有快照
   */
  getSnapshots(): readonly HistorySnapshot[] {
    return this.snapshots
  }
  
  /**
   * 删除快照
   */
  deleteSnapshot(snapshotId: string): void {
    const index = this.snapshots.findIndex(s => s.id === snapshotId)
    if (index !== -1) {
      this.snapshots.splice(index, 1)
    }
  }
  
  // ==================== 控制方法 ====================
  
  /**
   * 清空历史
   */
  clear(): void {
    this.assertNotDisposed()
    
    this.records.length = 0
    this.currentIndex = 0
    
    this.notifyChange('clear')
    
    this.eventBus?.emitSync('history:clear', {})
  }
  
  /**
   * 暂停历史记录
   */
  pause(): void {
    this.paused = true
  }
  
  /**
   * 恢复历史记录
   */
  resume(): void {
    this.paused = false
  }
  
  /**
   * 是否已暂停
   */
  isPaused(): boolean {
    return this.paused
  }
  
  // ==================== 监听器 ====================
  
  /**
   * 监听历史变化
   */
  onDidChange(listener: HistoryChangeListener): Disposable {
    this.assertNotDisposed()
    
    this.changeListeners.add(listener)
    
    return {
      dispose: () => {
        this.changeListeners.delete(listener)
      },
    }
  }
  
  /**
   * 监听撤销
   */
  onDidUndo(listener: HistoryActionListener): Disposable {
    this.assertNotDisposed()
    
    this.undoListeners.add(listener)
    
    return {
      dispose: () => {
        this.undoListeners.delete(listener)
      },
    }
  }
  
  /**
   * 监听重做
   */
  onDidRedo(listener: HistoryActionListener): Disposable {
    this.assertNotDisposed()
    
    this.redoListeners.add(listener)
    
    return {
      dispose: () => {
        this.redoListeners.delete(listener)
      },
    }
  }
  
  // ==================== 状态管理 ====================
  
  /**
   * 设置当前状态（用于快照）
   */
  setCurrentState(state: unknown): void {
    this.currentState = state
  }
  
  /**
   * 获取当前状态
   */
  getCurrentState(): unknown {
    return this.currentState
  }
  
  // ==================== 内部方法 ====================
  
  /**
   * 克隆状态
   */
  private cloneState(state: unknown): unknown {
    if (state === null || state === undefined) {
      return state
    }
    
    // 简单的深拷贝
    return JSON.parse(JSON.stringify(state))
  }
  
  /**
   * 通知变化监听器
   */
  private notifyChange(type: 'push' | 'undo' | 'redo' | 'clear' | 'restore'): void {
    const event = {
      type,
      record: type === 'push' ? this.records[this.records.length - 1] : undefined,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoCount: this.currentIndex,
      redoCount: this.records.length - this.currentIndex,
    }
    
    for (const listener of this.changeListeners) {
      try {
        listener(event)
      } catch (error) {
        console.error('Error in history change listener:', error)
      }
    }
    
    this.eventBus?.emitSync('history:change', {
      canUndo: event.canUndo,
      canRedo: event.canRedo,
    })
  }
  
  /**
   * 通知撤销监听器
   */
  private notifyUndo(record: HistoryRecord): void {
    const event = {
      record,
      timestamp: Date.now(),
    }
    
    for (const listener of this.undoListeners) {
      try {
        listener(event)
      } catch (error) {
        console.error('Error in undo listener:', error)
      }
    }
  }
  
  /**
   * 通知重做监听器
   */
  private notifyRedo(record: HistoryRecord): void {
    const event = {
      record,
      timestamp: Date.now(),
    }
    
    for (const listener of this.redoListeners) {
      try {
        listener(event)
      } catch (error) {
        console.error('Error in redo listener:', error)
      }
    }
  }
  
  /**
   * 断言未销毁
   */
  private assertNotDisposed(): void {
    if (this.disposed) {
      throw new Error('HistoryService has been disposed')
    }
  }
  
  /**
   * 销毁服务
   */
  dispose(): void {
    if (this.disposed) {
      return
    }
    
    this.disposed = true
    this.records.length = 0
    this.snapshots.length = 0
    this.changeListeners.clear()
    this.undoListeners.clear()
    this.redoListeners.clear()
  }
}

// ==================== 导出 ====================

/**
 * 创建历史服务
 */
export function createHistoryService(
  config?: HistoryConfig,
  options?: {
    eventBus?: IEventBus
  }
): IHistoryService {
  return new HistoryService(config, options)
}

/**
 * 全局历史服务实例（可选）
 */
let globalHistoryService: IHistoryService | null = null

/**
 * 获取全局历史服务
 */
export function getGlobalHistoryService(): IHistoryService {
  if (!globalHistoryService) {
    globalHistoryService = createHistoryService()
  }
  return globalHistoryService
}

/**
 * 设置全局历史服务
 */
export function setGlobalHistoryService(service: IHistoryService): void {
  globalHistoryService = service
}

/**
 * 重置全局历史服务
 */
export function resetGlobalHistoryService(): void {
  if (globalHistoryService && 'dispose' in globalHistoryService) {
    (globalHistoryService as HistoryService).dispose()
  }
  globalHistoryService = null
}

