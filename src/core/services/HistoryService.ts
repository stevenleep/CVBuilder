/**
 * 历史管理服务实现
 *
 * 提供撤销/重做功能，支持批量操作、快照等
 */

import {
  IHistoryService,
  IHistoryEntry,
  IHistorySnapshot,
  IHistoryConfig,
  IHistoryState,
  IHistoryListener,
} from '../protocols/IHistoryProtocol'
import { ICommand, ICommandContext, ICommandResult } from '../protocols/ICommandProtocol'
import { IEventBus } from '../protocols/IEventProtocol'

export class HistoryService implements IHistoryService {
  private undoStack: IHistoryEntry[] = []
  private redoStack: IHistoryEntry[] = []
  private snapshots: Map<string, IHistorySnapshot> = new Map()
  private listeners: Set<(state: IHistoryState) => void> = new Set()
  private batchStack: Array<{ id: string; name: string; entries: IHistoryEntry[] }> = []
  private config: Required<IHistoryConfig>
  private eventBus?: IEventBus
  private historyListeners: IHistoryListener[] = []

  constructor(config: IHistoryConfig = {}, eventBus?: IEventBus) {
    this.config = {
      maxSize: config.maxSize ?? 100,
      enableSnapshot: config.enableSnapshot ?? true,
      snapshotInterval: config.snapshotInterval ?? 300000, // 5分钟
      mergeSimilar: config.mergeSimilar ?? true,
    }
    this.eventBus = eventBus
  }

  /**
   * 记录命令
   */
  public record(command: ICommand, context: ICommandContext, result: ICommandResult): void {
    // 如果命令不可撤销，不记录
    if (!command.undoable) {
      return
    }

    const entry: IHistoryEntry = {
      id: this.generateId(),
      command,
      context,
      result,
      timestamp: Date.now(),
      undone: false,
    }

    // 如果正在批量操作中，添加到批次栈
    if (this.batchStack.length > 0) {
      const currentBatch = this.batchStack[this.batchStack.length - 1]
      currentBatch.entries.push(entry)
      return
    }

    // 尝试合并相似命令
    if (this.config.mergeSimilar && command.mergeable) {
      const lastEntry = this.undoStack[this.undoStack.length - 1]
      if (lastEntry && lastEntry.command.id === command.id && command.merge) {
        const merged = command.merge(lastEntry.command)
        if (merged) {
          // 更新最后一条记录
          this.undoStack[this.undoStack.length - 1] = {
            ...entry,
            command: merged,
          }
          this.notifyListeners()
          return
        }
      }
    }

    // 添加到撤销栈
    this.undoStack.push(entry)

    // 清空重做栈（新操作会使重做历史失效）
    this.redoStack = []

    // 限制历史记录数量
    if (this.undoStack.length > this.config.maxSize) {
      this.undoStack.shift()
    }

    // 触发监听器
    this.historyListeners.forEach(listener => {
      listener.onEntryAdded?.(entry)
    })

    this.eventBus?.emit('history:recorded', { entry })
    this.notifyListeners()
  }

  /**
   * 撤销
   */
  public async undo(): Promise<ICommandResult | null> {
    if (!this.canUndo()) {
      return null
    }

    const entry = this.undoStack.pop()!

    // 触发监听器
    this.historyListeners.forEach(listener => {
      listener.onBeforeUndo?.(entry)
    })

    this.eventBus?.emit('history:before-undo', { entry })

    try {
      const result = await Promise.resolve(entry.command.undo(entry.context))

      entry.undone = true
      this.redoStack.push(entry)

      // 触发监听器
      this.historyListeners.forEach(listener => {
        listener.onAfterUndo?.(entry, result)
      })

      this.eventBus?.emit('history:undone', { entry, result })
      this.notifyListeners()

      return result
    } catch (error) {
      // 撤销失败，放回撤销栈
      this.undoStack.push(entry)
      this.eventBus?.emit('history:undo-failed', { entry, error })
      throw error
    }
  }

  /**
   * 重做
   */
  public async redo(): Promise<ICommandResult | null> {
    if (!this.canRedo()) {
      return null
    }

    const entry = this.redoStack.pop()!

    // 触发监听器
    this.historyListeners.forEach(listener => {
      listener.onBeforeRedo?.(entry)
    })

    this.eventBus?.emit('history:before-redo', { entry })

    try {
      // 如果命令有自定义 redo，使用它；否则使用 execute
      const result = entry.command.redo
        ? await Promise.resolve(entry.command.redo(entry.context))
        : await Promise.resolve(entry.command.execute(entry.context))

      entry.undone = false
      this.undoStack.push(entry)

      // 触发监听器
      this.historyListeners.forEach(listener => {
        listener.onAfterRedo?.(entry, result)
      })

      this.eventBus?.emit('history:redone', { entry, result })
      this.notifyListeners()

      return result
    } catch (error) {
      // 重做失败，放回重做栈
      this.redoStack.push(entry)
      this.eventBus?.emit('history:redo-failed', { entry, error })
      throw error
    }
  }

  /**
   * 开始批量操作
   */
  public beginBatch(name: string = 'Batch Operation'): string {
    const id = this.generateId()
    this.batchStack.push({
      id,
      name,
      entries: [],
    })
    this.eventBus?.emit('history:batch-begin', { id, name })
    return id
  }

  /**
   * 结束批量操作
   */
  public endBatch(batchId: string): void {
    const batchIndex = this.batchStack.findIndex(b => b.id === batchId)
    if (batchIndex === -1) {
      console.warn('[HistoryService] 批次不存在:', batchId)
      return
    }

    const batch = this.batchStack.splice(batchIndex, 1)[0]

    if (batch.entries.length > 0) {
      // 将批次作为一个整体添加到历史记录
      const batchEntry: IHistoryEntry = {
        id: batch.id,
        command: {
          id: `batch:${batch.id}`,
          name: batch.name,
          undoable: true,
          execute: async () => ({ success: true }),
          undo: async () => {
            // 倒序撤销批次中的所有命令
            for (let i = batch.entries.length - 1; i >= 0; i--) {
              await batch.entries[i].command.undo(batch.entries[i].context)
            }
            return { success: true }
          },
          redo: async () => {
            // 正序重做批次中的所有命令
            for (const entry of batch.entries) {
              const cmd = entry.command
              if (cmd.redo) {
                await cmd.redo(entry.context)
              } else {
                await cmd.execute(entry.context)
              }
            }
            return { success: true }
          },
        },
        context: { selectedNodeIds: [], pageSchema: null, editorState: null },
        result: { success: true },
        timestamp: Date.now(),
      }

      this.undoStack.push(batchEntry)
      this.redoStack = []

      // 限制历史记录数量
      if (this.undoStack.length > this.config.maxSize) {
        this.undoStack.shift()
      }
    }

    this.eventBus?.emit('history:batch-end', { batchId, entriesCount: batch.entries.length })
    this.notifyListeners()
  }

  /**
   * 取消批量操作
   */
  public cancelBatch(batchId: string): void {
    const batchIndex = this.batchStack.findIndex(b => b.id === batchId)
    if (batchIndex !== -1) {
      this.batchStack.splice(batchIndex, 1)
      this.eventBus?.emit('history:batch-cancelled', { batchId })
    }
  }

  /**
   * 是否可撤销
   */
  public canUndo(): boolean {
    return this.undoStack.length > 0
  }

  /**
   * 是否可重做
   */
  public canRedo(): boolean {
    return this.redoStack.length > 0
  }

  /**
   * 获取历史记录
   */
  public getHistory(): IHistoryEntry[] {
    return [...this.undoStack]
  }

  /**
   * 获取撤销栈
   */
  public getUndoStack(): IHistoryEntry[] {
    return [...this.undoStack]
  }

  /**
   * 获取重做栈
   */
  public getRedoStack(): IHistoryEntry[] {
    return [...this.redoStack]
  }

  /**
   * 清空历史
   */
  public clear(): void {
    this.undoStack = []
    this.redoStack = []
    this.batchStack = []

    // 触发监听器
    this.historyListeners.forEach(listener => {
      listener.onCleared?.()
    })

    this.eventBus?.emit('history:cleared', {})
    this.notifyListeners()
  }

  /**
   * 获取当前状态
   */
  public getState(): IHistoryState {
    return {
      currentIndex: this.undoStack.length,
      count: this.undoStack.length + this.redoStack.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoSize: this.undoStack.length,
      redoSize: this.redoStack.length,
    }
  }

  /**
   * 创建快照
   */
  public createSnapshot(name: string, state: unknown, description?: string): string {
    if (!this.config.enableSnapshot) {
      throw new Error('[HistoryService] 快照功能未启用')
    }

    const id = this.generateId()
    const snapshot: IHistorySnapshot = {
      id,
      name,
      state: JSON.parse(JSON.stringify(state)), // 深拷贝
      timestamp: Date.now(),
      description,
    }

    this.snapshots.set(id, snapshot)
    this.eventBus?.emit('history:snapshot-created', { snapshot })

    return id
  }

  /**
   * 恢复快照
   */
  public async restoreSnapshot(snapshotId: string): Promise<boolean> {
    const snapshot = this.snapshots.get(snapshotId)
    if (!snapshot) {
      return false
    }

    this.eventBus?.emit('history:snapshot-restore', { snapshot })

    // 这里需要外部处理状态恢复逻辑
    // 因为 HistoryService 不直接操作编辑器状态

    return true
  }

  /**
   * 获取所有快照
   */
  public getSnapshots(): IHistorySnapshot[] {
    return Array.from(this.snapshots.values())
  }

  /**
   * 删除快照
   */
  public deleteSnapshot(snapshotId: string): void {
    if (this.snapshots.delete(snapshotId)) {
      this.eventBus?.emit('history:snapshot-deleted', { snapshotId })
    }
  }

  /**
   * 跳转到指定历史记录
   */
  public async jumpTo(index: number): Promise<boolean> {
    if (index < 0 || index > this.undoStack.length) {
      return false
    }

    const currentIndex = this.undoStack.length

    if (index < currentIndex) {
      // 需要撤销
      const steps = currentIndex - index
      for (let i = 0; i < steps; i++) {
        await this.undo()
      }
    } else if (index > currentIndex) {
      // 需要重做
      const steps = index - currentIndex
      for (let i = 0; i < steps; i++) {
        await this.redo()
      }
    }

    return true
  }

  /**
   * 获取最后一条记录
   */
  public getLastEntry(): IHistoryEntry | null {
    return this.undoStack[this.undoStack.length - 1] || null
  }

  /**
   * 设置最大历史记录数
   */
  public setMaxSize(size: number): void {
    this.config.maxSize = size

    // 如果当前记录超过限制，裁剪
    while (this.undoStack.length > size) {
      this.undoStack.shift()
    }

    this.notifyListeners()
  }

  /**
   * 订阅历史变化
   */
  public onChange(listener: (state: IHistoryState) => void): () => void {
    this.listeners.add(listener)

    // 返回取消订阅函数
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * 添加历史监听器
   */
  public addListener(listener: IHistoryListener): void {
    this.historyListeners.push(listener)
  }

  /**
   * 移除历史监听器
   */
  public removeListener(listener: IHistoryListener): void {
    const index = this.historyListeners.indexOf(listener)
    if (index !== -1) {
      this.historyListeners.splice(index, 1)
    }
  }

  /**
   * 通知状态变化
   */
  private notifyListeners(): void {
    const state = this.getState()
    this.listeners.forEach(listener => {
      try {
        listener(state)
      } catch (error) {
        console.error('[HistoryService] 监听器错误:', error)
      }
    })
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }
}

// 服务标识符
export const HISTORY_SERVICE_TOKEN = Symbol('HistoryService')
