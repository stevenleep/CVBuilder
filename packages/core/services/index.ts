/**
 * 核心服务层统一导出
 * 
 * @packageDocumentation
 */

// ==================== 内部导入 ====================

import { createDIContainer } from './DIContainer'
import { createEventBus } from './EventBus'
import { createStateManager } from './StateManager'
import { createHistoryService } from './HistoryService'
import { createCommandService } from './CommandService'
import { createMaterialRegistry } from './MaterialRegistry'
import { createRendererRegistry } from './RendererRegistry'
import { createPluginManager } from './PluginManager'

// ==================== Priority 1: 必需核心服务 ====================

/**
 * 依赖注入容器
 * 
 * 支持单例、瞬态、作用域生命周期，循环依赖检测
 */
export * from './DIContainer'

/**
 * 事件总线
 * 
 * 支持发布订阅、优先级、拦截器、节流防抖
 */
export * from './EventBus'

/**
 * 物料注册表
 * 
 * 管理所有可用物料的注册、查询和验证
 */
export * from './MaterialRegistry'

/**
 * 渲染器注册表
 * 
 * 管理多框架、多平台的渲染器
 */
export * from './RendererRegistry'

// ==================== Priority 2: 重要核心服务 ====================

/**
 * 命令服务
 * 
 * 管理命令注册、执行、快捷键绑定和历史
 */
export * from './CommandService'

/**
 * 状态管理器
 * 
 * 基于 Zustand + Immer 的高性能状态管理
 */
export * from './StateManager'

/**
 * 历史服务
 * 
 * 完整的撤销/重做系统，支持快照和增量记录
 */
export * from './HistoryService'

// ==================== Priority 3: 扩展性服务 ====================

/**
 * 插件管理器
 * 
 * 完整的插件系统，支持生命周期管理和依赖解析
 */
export * from './PluginManager'

// ==================== 服务汇总 ====================

/**
 * 核心服务类型
 */
export interface CoreServices {
  /** DI 容器 */
  container: ReturnType<typeof import('./DIContainer').createDIContainer>
  
  /** 事件总线 */
  eventBus: ReturnType<typeof import('./EventBus').createEventBus>
  
  /** 状态管理器 */
  stateManager: ReturnType<typeof import('./StateManager').createStateManager>
  
  /** 历史服务 */
  historyService: ReturnType<typeof import('./HistoryService').createHistoryService>
  
  /** 命令服务 */
  commandService: ReturnType<typeof import('./CommandService').createCommandService>
  
  /** 物料注册表 */
  materialRegistry: ReturnType<typeof import('./MaterialRegistry').createMaterialRegistry>
  
  /** 渲染器注册表 */
  rendererRegistry: ReturnType<typeof import('./RendererRegistry').createRendererRegistry>
  
  /** 插件管理器 */
  pluginManager: ReturnType<typeof import('./PluginManager').createPluginManager>
}

/**
 * 核心服务配置选项
 * 
 * @description 支持自定义部分或全部服务，未提供的服务将使用默认创建
 */
export interface CoreServicesOptions {
  /** 自定义 DI 容器 */
  container?: CoreServices['container']
  /** 自定义事件总线 */
  eventBus?: CoreServices['eventBus']
  /** 自定义状态管理器 */
  stateManager?: CoreServices['stateManager']
  /** 自定义历史服务 */
  historyService?: CoreServices['historyService']
  /** 自定义命令服务 */
  commandService?: CoreServices['commandService']
  /** 自定义物料注册表 */
  materialRegistry?: CoreServices['materialRegistry']
  /** 自定义渲染器注册表 */
  rendererRegistry?: CoreServices['rendererRegistry']
  /** 自定义插件管理器 */
  pluginManager?: CoreServices['pluginManager']
}

/**
 * 创建核心服务
 * 
 * @description 
 * 一次性创建所有核心服务，支持灵活的自定义配置。
 * - 不传参数：使用默认配置创建所有服务
 * - 传入部分配置：自定义部分服务，其他使用默认
 * - 传入全部配置：完全自定义所有服务
 * 
 * @param options - 可选的服务配置
 * @returns 完整的核心服务集合
 * 
 * @example
 * ```ts
 * // 1. 默认配置（推荐）
 * const services = createCoreServices()
 * 
 * // 2. 自定义单个服务
 * const services = createCoreServices({
 *   stateManager: createStateManager({ 
 *     // 自定义配置
 *   })
 * })
 * 
 * // 3. 自定义多个服务
 * const customEventBus = createEventBus()
 * const services = createCoreServices({
 *   eventBus: customEventBus,
 *   materialRegistry: createMaterialRegistry({ eventBus: customEventBus })
 * })
 * 
 * // 4. 完全自定义（高级用法）
 * const services = createCoreServices({
 *   eventBus: myEventBus,
 *   stateManager: myStateManager,
 *   historyService: myHistoryService,
 *   // ... 其他服务
 * })
 * ```
 */
export function createCoreServices(options?: CoreServicesOptions): CoreServices {
  // 创建或使用提供的 eventBus（很多服务依赖它）
  const eventBus = options?.eventBus ?? createEventBus()
  
  // 创建或使用提供的各个服务
  const container = options?.container ?? createDIContainer()
  const stateManager = options?.stateManager ?? createStateManager()
  const historyService = options?.historyService ?? createHistoryService(undefined, { eventBus })
  const commandService = options?.commandService ?? createCommandService({ eventBus })
  const materialRegistry = options?.materialRegistry ?? createMaterialRegistry({ eventBus })
  const rendererRegistry = options?.rendererRegistry ?? createRendererRegistry({ eventBus })
  const pluginManager = options?.pluginManager ?? createPluginManager({ eventBus })
  
  return {
    container,
    eventBus,
    stateManager,
    historyService,
    commandService,
    materialRegistry,
    rendererRegistry,
    pluginManager,
  }
}

