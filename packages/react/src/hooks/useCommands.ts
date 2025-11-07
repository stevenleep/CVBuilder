/**
 * 命令执行 Hook
 * 
 * 提供命令注册和执行功能
 */

import { useState, useEffect, useCallback } from 'react'
import { useCommandService } from '../contexts/ServiceContext'
import type { 
  CommandDefinition,
  CommandExecutionResult,
  ICommandRegistry,
} from '@lcedit/core'

// ==================== 类型定义 ====================

export interface UseCommandsResult {
  commands: readonly CommandDefinition[]
  executing: boolean
  lastResult: CommandExecutionResult<unknown> | null
  execute: <TReturn = unknown>(commandId: string, ...args: unknown[]) => Promise<CommandExecutionResult<TReturn>>
  canExecute: (commandId: string) => boolean
  searchCommands: (query: string) => readonly CommandDefinition[]
  getCommand: (commandId: string) => CommandDefinition | undefined
}

export interface UseCommandOptions {
  autoLoad?: boolean
}

// ==================== Hook ====================

/**
 * 使用命令
 */
export function useCommands(options?: UseCommandOptions): UseCommandsResult {
  const commandService = useCommandService()
  const { autoLoad = true } = options || {}
  
  const [commands, setCommands] = useState<readonly CommandDefinition[]>(() => 
    autoLoad ? commandService.getAllCommands() : []
  )
  
  const [executing, setExecuting] = useState(false)
  const [lastResult, setLastResult] = useState<CommandExecutionResult<unknown> | null>(null)
  
  // 加载命令列表
  useEffect(() => {
    if (autoLoad) {
      setCommands(commandService.getAllCommands())
    }
  }, [commandService, autoLoad])
  
  // 执行命令
  const execute = useCallback(async <TReturn = unknown>(
    commandId: string,
    ...args: unknown[]
  ): Promise<CommandExecutionResult<TReturn>> => {
    setExecuting(true)
    
    try {
      const result = await commandService.executeCommand<TReturn>(commandId, ...args)
      setLastResult(result)
      return result
    } finally {
      setExecuting(false)
    }
  }, [commandService])
  
  // 检查是否可执行
  const canExecute = useCallback((commandId: string) => {
    return commandService.isCommandEnabled(commandId)
  }, [commandService])
  
  // 搜索命令
  const searchCommands = useCallback((query: string) => {
    return commandService.searchCommands(query)
  }, [commandService])
  
  // 获取命令
  const getCommand = useCallback((commandId: string) => {
    return commandService.getCommand(commandId)
  }, [commandService])
  
  return {
    commands,
    executing,
    lastResult,
    execute,
    canExecute,
    searchCommands,
    getCommand,
  }
}

/**
 * 使用单个命令
 */
export function useCommand(commandId: string) {
  const { execute, canExecute, getCommand } = useCommands({ autoLoad: false })
  const [executing, setExecuting] = useState(false)
  
  const command = getCommand(commandId)
  const enabled = canExecute(commandId)
  
  const executeCommand = useCallback(async <TReturn = unknown>(
    ...args: unknown[]
  ): Promise<CommandExecutionResult<TReturn>> => {
    setExecuting(true)
    
    try {
      return await execute<TReturn>(commandId, ...args)
    } finally {
      setExecuting(false)
    }
  }, [execute, commandId])
  
  return {
    command,
    enabled,
    executing,
    execute: executeCommand,
  }
}

/**
 * 使用命令服务（直接访问）
 */
export function useCommandServiceDirect(): ICommandRegistry {
  return useCommandService()
}

