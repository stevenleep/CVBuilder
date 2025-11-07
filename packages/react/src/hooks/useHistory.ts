/**
 * 历史记录 Hook
 * 
 * 提供撤销/重做功能
 */

import { useState, useEffect, useCallback } from 'react'
import { useHistoryService } from '../contexts/ServiceContext'
import type { IHistoryService } from '@lcedit/core'

// ==================== 类型定义 ====================

export interface UseHistoryResult {
  canUndo: boolean
  canRedo: boolean
  undoCount: number
  redoCount: number
  undo: () => Promise<void>
  redo: () => Promise<void>
  clear: () => void
  pause: () => void
  resume: () => void
  isPaused: boolean
}

// ==================== Hook ====================

/**
 * 使用历史记录
 */
export function useHistory(): UseHistoryResult {
  const historyService = useHistoryService()
  
  const [canUndo, setCanUndo] = useState(() => historyService.canUndo())
  const [canRedo, setCanRedo] = useState(() => historyService.canRedo())
  const [undoCount, setUndoCount] = useState(() => historyService.getUndoStack().length)
  const [redoCount, setRedoCount] = useState(() => historyService.getRedoStack().length)
  const [isPaused, setIsPaused] = useState(() => historyService.isPaused())
  
  // 监听历史变化
  useEffect(() => {
    const disposable = historyService.onDidChange((event) => {
      setCanUndo(event.canUndo)
      setCanRedo(event.canRedo)
      setUndoCount(event.undoCount)
      setRedoCount(event.redoCount)
    })
    
    return () => {
      disposable.dispose()
    }
  }, [historyService])
  
  // 撤销
  const undo = useCallback(async () => {
    await historyService.undo()
  }, [historyService])
  
  // 重做
  const redo = useCallback(async () => {
    await historyService.redo()
  }, [historyService])
  
  // 清空历史
  const clear = useCallback(() => {
    historyService.clear()
  }, [historyService])
  
  // 暂停历史记录
  const pause = useCallback(() => {
    historyService.pause()
    setIsPaused(true)
  }, [historyService])
  
  // 恢复历史记录
  const resume = useCallback(() => {
    historyService.resume()
    setIsPaused(false)
  }, [historyService])
  
  return {
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    undo,
    redo,
    clear,
    pause,
    resume,
    isPaused,
  }
}

/**
 * 使用历史服务（直接访问）
 */
export function useHistoryServiceDirect(): IHistoryService {
  return useHistoryService()
}

