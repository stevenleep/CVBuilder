/**
 * 历史协议 - 撤销/重做系统
 * 
 * 提供完整的历史记录管理，支持增量历史和快照
 * 
 * @packageDocumentation
 */

// ==================== 历史协议 URI ====================

export const HISTORY_PROTOCOL_URI = 'lcedit://protocols/history/v1' as const

// ==================== 历史记录 ====================

/**
 * 历史记录
 */
export interface HistoryRecord {
  /** 记录 ID */
  readonly id: string
  
  /** 记录类型 */
  readonly type: HistoryRecordType
  
  /** 记录标题 */
  readonly title: string
  
  /** 记录时间戳 */
  readonly timestamp: number
  
  /** 变更内容 */
  readonly changes: HistoryChange[]
  
  /** 元数据 */
  readonly metadata?: Record<string, unknown>
}

/**
 * 历史记录类型
 */
export type HistoryRecordType =
  | 'create'      // 创建
  | 'update'      // 更新
  | 'delete'      // 删除
  | 'move'        // 移动
  | 'batch'       // 批量操作
  | 'snapshot'    // 快照

/**
 * 历史变更
 */
export interface HistoryChange {
  /** 变更类型 */
  readonly type: 'create' | 'update' | 'delete'
  
  /** 目标 ID */
  readonly targetId: string
  
  /** 目标类型 */
  readonly targetType: string
  
  /** 变更路径 */
  readonly path?: string
  
  /** 旧值 */
  readonly oldValue?: unknown
  
  /** 新值 */
  readonly newValue?: unknown
  
  /** 是否为增量变更 */
  readonly incremental?: boolean
}

// ==================== 历史快照 ====================

/**
 * 历史快照
 */
export interface HistorySnapshot {
  /** 快照 ID */
  readonly id: string
  
  /** 快照时间戳 */
  readonly timestamp: number
  
  /** 快照状态 */
  readonly state: unknown
  
  /** 快照描述 */
  readonly description?: string
  
  /** 快照元数据 */
  readonly metadata?: Record<string, unknown>
}

// ==================== 历史配置 ====================

/**
 * 历史配置
 */
export interface HistoryConfig {
  /** 最大历史记录数 */
  readonly maxRecords?: number
  
  /** 是否启用增量历史 */
  readonly incremental?: boolean
  
  /** 是否自动快照 */
  readonly autoSnapshot?: boolean
  
  /** 快照间隔（毫秒） */
  readonly snapshotInterval?: number
  
  /** 是否合并连续操作 */
  readonly mergeConsecutive?: boolean
  
  /** 合并时间窗口（毫秒） */
  readonly mergeWindow?: number
  
  /** 忽略的路径 */
  readonly ignorePaths?: readonly string[]
}

// ==================== 历史服务 ====================

/**
 * 历史服务接口
 */
export interface IHistoryService {
  /**
   * 添加历史记录
   */
  push(record: HistoryRecord): void
  
  /**
   * 批量添加历史记录
   */
  pushBatch(records: readonly HistoryRecord[]): void
  
  /**
   * 撤销
   */
  undo(): Promise<boolean>
  
  /**
   * 重做
   */
  redo(): Promise<boolean>
  
  /**
   * 撤销到指定位置
   */
  undoTo(recordId: string): Promise<boolean>
  
  /**
   * 重做到指定位置
   */
  redoTo(recordId: string): Promise<boolean>
  
  /**
   * 是否可以撤销
   */
  canUndo(): boolean
  
  /**
   * 是否可以重做
   */
  canRedo(): boolean
  
  /**
   * 获取当前位置
   */
  getCurrentIndex(): number
  
  /**
   * 获取历史记录列表
   */
  getRecords(): readonly HistoryRecord[]
  
  /**
   * 获取撤销栈
   */
  getUndoStack(): readonly HistoryRecord[]
  
  /**
   * 获取重做栈
   */
  getRedoStack(): readonly HistoryRecord[]
  
  /**
   * 创建快照
   */
  createSnapshot(description?: string): HistorySnapshot
  
  /**
   * 恢复快照
   */
  restoreSnapshot(snapshotId: string): Promise<boolean>
  
  /**
   * 获取所有快照
   */
  getSnapshots(): readonly HistorySnapshot[]
  
  /**
   * 删除快照
   */
  deleteSnapshot(snapshotId: string): void
  
  /**
   * 清空历史
   */
  clear(): void
  
  /**
   * 暂停历史记录
   */
  pause(): void
  
  /**
   * 恢复历史记录
   */
  resume(): void
  
  /**
   * 是否已暂停
   */
  isPaused(): boolean
  
  /**
   * 监听历史变化
   */
  onDidChange(listener: HistoryChangeListener): Disposable
  
  /**
   * 监听撤销
   */
  onDidUndo(listener: HistoryActionListener): Disposable
  
  /**
   * 监听重做
   */
  onDidRedo(listener: HistoryActionListener): Disposable
}

/**
 * 历史变化监听器
 */
export type HistoryChangeListener = (event: HistoryChangeEvent) => void

/**
 * 历史变化事件
 */
export interface HistoryChangeEvent {
  readonly type: 'push' | 'undo' | 'redo' | 'clear' | 'restore'
  readonly record?: HistoryRecord
  readonly canUndo: boolean
  readonly canRedo: boolean
  readonly undoCount: number
  readonly redoCount: number
}

/**
 * 历史动作监听器
 */
export type HistoryActionListener = (event: HistoryActionEvent) => void

/**
 * 历史动作事件
 */
export interface HistoryActionEvent {
  readonly record: HistoryRecord
  readonly timestamp: number
}

export interface Disposable {
  dispose(): void
}

// ==================== 历史工具 ====================

/**
 * 创建历史记录
 */
export function createHistoryRecord(
  type: HistoryRecordType,
  title: string,
  changes: HistoryChange[]
): HistoryRecord {
  return {
    id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    timestamp: Date.now(),
    changes,
  }
}

/**
 * 创建历史变更
 */
export function createHistoryChange(
  type: 'create' | 'update' | 'delete',
  targetId: string,
  targetType: string,
  options?: {
    path?: string
    oldValue?: unknown
    newValue?: unknown
    incremental?: boolean
  }
): HistoryChange {
  return {
    type,
    targetId,
    targetType,
    path: options?.path,
    oldValue: options?.oldValue,
    newValue: options?.newValue,
    incremental: options?.incremental,
  }
}

/**
 * 合并历史记录
 */
export function mergeHistoryRecords(
  records: readonly HistoryRecord[]
): HistoryRecord {
  if (records.length === 0) {
    throw new Error('Cannot merge empty records')
  }
  
  if (records.length === 1) {
    return records[0]
  }
  
  const changes: HistoryChange[] = []
  for (const record of records) {
    changes.push(...record.changes)
  }
  
  return {
    id: `history-merged-${Date.now()}`,
    type: 'batch',
    title: `Merged ${records.length} operations`,
    timestamp: Date.now(),
    changes,
    metadata: {
      mergedCount: records.length,
      mergedIds: records.map(r => r.id),
    },
  }
}

/**
 * 应用历史变更
 */
export function applyHistoryChange(
  state: Record<string, unknown>,
  change: HistoryChange,
  direction: 'undo' | 'redo'
): Record<string, unknown> {
  const newState = { ...state }
  const value = direction === 'undo' ? change.oldValue : change.newValue
  
  if (change.path) {
    setNestedValue(newState, change.path, value)
  } else {
    newState[change.targetId] = value
  }
  
  return newState
}

/**
 * 设置嵌套值
 */
function setNestedValue(obj: any, path: string, value: unknown): void {
  const parts = path.split('.')
  let current = obj
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!(part in current)) {
      current[part] = {}
    }
    current = current[part]
  }
  
  const lastPart = parts[parts.length - 1]
  if (value === undefined) {
    delete current[lastPart]
  } else {
    current[lastPart] = value
  }
}

/**
 * 获取嵌套值
 */
export function getNestedValue(obj: any, path: string): unknown {
  const parts = path.split('.')
  let current = obj
  
  for (const part of parts) {
    if (current == null) {
      return undefined
    }
    current = current[part]
  }
  
  return current
}

/**
 * 计算差异
 */
export function computeDiff(
  oldValue: any,
  newValue: any,
  path: string = ''
): HistoryChange[] {
  const changes: HistoryChange[] = []
  
  if (oldValue === newValue) {
    return changes
  }
  
  if (typeof oldValue !== 'object' || typeof newValue !== 'object' ||
      oldValue === null || newValue === null) {
    changes.push({
      type: 'update',
      targetId: 'root',
      targetType: 'value',
      path,
      oldValue,
      newValue,
      incremental: true,
    })
    return changes
  }
  
  // 递归比较对象
  const allKeys = new Set([
    ...Object.keys(oldValue || {}),
    ...Object.keys(newValue || {}),
  ])
  
  for (const key of allKeys) {
    const oldVal = oldValue[key]
    const newVal = newValue[key]
    const newPath = path ? `${path}.${key}` : key
    
    if (!(key in oldValue)) {
      changes.push({
        type: 'create',
        targetId: 'root',
        targetType: 'property',
        path: newPath,
        newValue: newVal,
        incremental: true,
      })
    } else if (!(key in newValue)) {
      changes.push({
        type: 'delete',
        targetId: 'root',
        targetType: 'property',
        path: newPath,
        oldValue: oldVal,
        incremental: true,
      })
    } else if (oldVal !== newVal) {
      changes.push(...computeDiff(oldVal, newVal, newPath))
    }
  }
  
  return changes
}

