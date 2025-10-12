/**
 * 历史管理协议
 *
 * 定义撤销/重做历史记录管理的完整接口
 */

import { ICommand, ICommandResult, ICommandContext } from './ICommandProtocol'

/**
 * 历史记录项
 */
export interface IHistoryEntry {
  /** 记录ID */
  id: string
  /** 命令 */
  command: ICommand
  /** 命令上下文 */
  context: ICommandContext
  /** 执行结果 */
  result: ICommandResult
  /** 时间戳 */
  timestamp: number
  /** 是否已撤销 */
  undone?: boolean
}

/**
 * 历史快照
 */
export interface IHistorySnapshot {
  /** 快照ID */
  id: string
  /** 快照名称 */
  name: string
  /** 快照时的状态 */
  state: any
  /** 时间戳 */
  timestamp: number
  /** 描述 */
  description?: string
}

/**
 * 历史配置
 */
export interface IHistoryConfig {
  /** 最大历史记录数 */
  maxSize?: number
  /** 是否启用快照 */
  enableSnapshot?: boolean
  /** 快照间隔（毫秒） */
  snapshotInterval?: number
  /** 是否合并相似操作 */
  mergeSimilar?: boolean
}

/**
 * 历史状态
 */
export interface IHistoryState {
  /** 当前索引 */
  currentIndex: number
  /** 历史记录数量 */
  count: number
  /** 是否可撤销 */
  canUndo: boolean
  /** 是否可重做 */
  canRedo: boolean
  /** 撤销栈大小 */
  undoSize: number
  /** 重做栈大小 */
  redoSize: number
}

/**
 * 历史服务接口
 */
export interface IHistoryService {
  /** 记录命令 */
  record(command: ICommand, context: ICommandContext, result: ICommandResult): void

  /** 撤销 */
  undo(): Promise<ICommandResult | null>

  /** 重做 */
  redo(): Promise<ICommandResult | null>

  /** 批量操作 - 开始 */
  beginBatch(name?: string): string

  /** 批量操作 - 结束 */
  endBatch(batchId: string): void

  /** 批量操作 - 取消 */
  cancelBatch(batchId: string): void

  /** 是否可撤销 */
  canUndo(): boolean

  /** 是否可重做 */
  canRedo(): boolean

  /** 获取历史记录 */
  getHistory(): IHistoryEntry[]

  /** 获取撤销栈 */
  getUndoStack(): IHistoryEntry[]

  /** 获取重做栈 */
  getRedoStack(): IHistoryEntry[]

  /** 清空历史 */
  clear(): void

  /** 获取当前状态 */
  getState(): IHistoryState

  /** 创建快照 */
  createSnapshot(name: string, state: any, description?: string): string

  /** 恢复快照 */
  restoreSnapshot(snapshotId: string): Promise<boolean>

  /** 获取所有快照 */
  getSnapshots(): IHistorySnapshot[]

  /** 删除快照 */
  deleteSnapshot(snapshotId: string): void

  /** 跳转到指定历史记录 */
  jumpTo(index: number): Promise<boolean>

  /** 获取最后一条记录 */
  getLastEntry(): IHistoryEntry | null

  /** 设置最大历史记录数 */
  setMaxSize(size: number): void

  /** 订阅历史变化 */
  onChange(listener: (state: IHistoryState) => void): () => void
}

/**
 * 历史监听器
 */
export interface IHistoryListener {
  /** 撤销前 */
  onBeforeUndo?: (entry: IHistoryEntry) => void
  /** 撤销后 */
  onAfterUndo?: (entry: IHistoryEntry, result: ICommandResult) => void
  /** 重做前 */
  onBeforeRedo?: (entry: IHistoryEntry) => void
  /** 重做后 */
  onAfterRedo?: (entry: IHistoryEntry, result: ICommandResult) => void
  /** 记录添加 */
  onEntryAdded?: (entry: IHistoryEntry) => void
  /** 历史清空 */
  onCleared?: () => void
}
