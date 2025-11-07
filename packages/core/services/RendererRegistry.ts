/**
 * 渲染器注册表
 * 
 * 实现渲染器管理，支持：
 * - 组件渲染器注册/查询
 * - 属性字段渲染器注册/查询
 * - 多框架支持（React、Vue、Svelte等）
 * - 多平台支持（Web、Mobile、Desktop）
 * - 渲染器优先级
 * 
 * @packageDocumentation
 */

import type {
  RendererDefinition,
  ComponentRenderer,
  PropertyFieldRenderer,
  RenderContext,
  RendererMetadata,
} from '../protocols/renderer/RendererProtocol'

import type { IEventBus } from '../protocols/event/EventProtocol'

// ==================== 注册表接口 ====================

/**
 * 渲染器注册表接口
 */
export interface IRendererRegistry {
  /**
   * 注册组件渲染器
   */
  registerComponentRenderer(
    materialType: string,
    renderer: ComponentRenderer,
    metadata: RendererMetadata
  ): void
  
  /**
   * 注册属性字段渲染器
   */
  registerPropertyFieldRenderer(
    fieldType: string,
    renderer: PropertyFieldRenderer,
    metadata: RendererMetadata
  ): void
  
  /**
   * 注销组件渲染器
   */
  unregisterComponentRenderer(
    materialType: string,
    framework?: string
  ): boolean
  
  /**
   * 注销属性字段渲染器
   */
  unregisterPropertyFieldRenderer(
    fieldType: string,
    framework?: string
  ): boolean
  
  /**
   * 获取组件渲染器
   */
  getComponentRenderer(
    materialType: string,
    context: RenderContext
  ): ComponentRenderer | undefined
  
  /**
   * 获取属性字段渲染器
   */
  getPropertyFieldRenderer(
    fieldType: string,
    context: RenderContext
  ): PropertyFieldRenderer | undefined
  
  /**
   * 获取所有组件渲染器
   */
  getAllComponentRenderers(): readonly RendererDefinition[]
  
  /**
   * 获取所有属性字段渲染器
   */
  getAllPropertyFieldRenderers(): readonly RendererDefinition[]
  
  /**
   * 检查是否有组件渲染器
   */
  hasComponentRenderer(materialType: string, framework?: string): boolean
  
  /**
   * 检查是否有属性字段渲染器
   */
  hasPropertyFieldRenderer(fieldType: string, framework?: string): boolean
  
  /**
   * 清空注册表
   */
  clear(): void
  
  /**
   * 获取统计信息
   */
  getStats(): RendererRegistryStats
}

/**
 * 渲染器注册表统计
 */
export interface RendererRegistryStats {
  /** 组件渲染器数量 */
  readonly componentRendererCount: number
  
  /** 属性字段渲染器数量 */
  readonly propertyFieldRendererCount: number
  
  /** 框架统计 */
  readonly frameworkCounts: Record<string, number>
  
  /** 平台统计 */
  readonly platformCounts: Record<string, number>
}

// ==================== 内部类型 ====================

/**
 * 渲染器注册项
 */
interface RendererEntry {
  readonly renderer: ComponentRenderer | PropertyFieldRenderer
  readonly metadata: RendererMetadata
  readonly priority: number
}

// ==================== 渲染器注册表实现 ====================

/**
 * 渲染器注册表实现
 */
export class RendererRegistry implements IRendererRegistry {
  /** 组件渲染器映射（materialType -> framework -> entry） */
  private readonly componentRenderers = new Map<string, Map<string, RendererEntry>>()
  
  /** 属性字段渲染器映射（fieldType -> framework -> entry） */
  private readonly propertyFieldRenderers = new Map<string, Map<string, RendererEntry>>()
  
  /** 事件总线（可选） */
  private readonly eventBus?: IEventBus
  
  constructor(options?: { eventBus?: IEventBus }) {
    this.eventBus = options?.eventBus
  }
  
  // ==================== 组件渲染器 ====================
  
  /**
   * 注册组件渲染器
   */
  registerComponentRenderer(
    materialType: string,
    renderer: ComponentRenderer,
    metadata: RendererMetadata
  ): void {
    const framework = metadata.framework || "react"
    
    // 获取或创建框架映射
    if (!this.componentRenderers.has(materialType)) {
      this.componentRenderers.set(materialType, new Map())
    }
    
    const frameworkMap = this.componentRenderers.get(materialType)!
    
    // 检查是否已注册
    if (frameworkMap.has(framework)) {
      console.warn(
        `Component renderer for "${materialType}" with framework "${framework}" is already registered. Overwriting.`
      )
    }
    
    // 注册渲染器
    frameworkMap.set(framework, {
      renderer,
      metadata,
      priority: metadata.priority || 0,
    })
    
    // 发送事件
    this.eventBus?.emitSync('renderer:component:registered', {
      materialType,
      framework,
      metadata,
    })
  }
  
  /**
   * 注销组件渲染器
   */
  unregisterComponentRenderer(
    materialType: string,
    framework?: string
  ): boolean {
    const frameworkMap = this.componentRenderers.get(materialType)
    if (!frameworkMap) {
      return false
    }
    
    if (framework) {
      // 注销特定框架的渲染器
      const removed = frameworkMap.delete(framework)
      
      // 如果框架映射为空，删除整个映射
      if (frameworkMap.size === 0) {
        this.componentRenderers.delete(materialType)
      }
      
      if (removed) {
        this.eventBus?.emitSync('renderer:component:unregistered', {
          materialType,
          framework,
        })
      }
      
      return removed
    } else {
      // 注销所有框架的渲染器
      this.componentRenderers.delete(materialType)
      this.eventBus?.emitSync('renderer:component:unregistered', {
        materialType,
      })
      return true
    }
  }
  
  /**
   * 获取组件渲染器
   */
  getComponentRenderer(
    materialType: string,
    context: RenderContext
  ): ComponentRenderer | undefined {
    const frameworkMap = this.componentRenderers.get(materialType)
    if (!frameworkMap) {
      return undefined
    }
    
    // 优先查找精确匹配的渲染器
    const exactEntry = frameworkMap.get(context.framework || "react")
    if (exactEntry && this.isRendererCompatible(exactEntry, context)) {
      return exactEntry.renderer as ComponentRenderer
    }
    
    // 查找兼容的渲染器（按优先级排序）
    const compatibleEntries = Array.from(frameworkMap.values())
      .filter(entry => this.isRendererCompatible(entry, context))
      .sort((a, b) => b.priority - a.priority)
    
    return compatibleEntries[0]?.renderer as ComponentRenderer
  }
  
  /**
   * 检查是否有组件渲染器
   */
  hasComponentRenderer(materialType: string, framework?: string): boolean {
    const frameworkMap = this.componentRenderers.get(materialType)
    if (!frameworkMap) {
      return false
    }
    
    if (framework) {
      return frameworkMap.has(framework)
    }
    
    return frameworkMap.size > 0
  }
  
  /**
   * 获取所有组件渲染器
   */
  getAllComponentRenderers(): readonly RendererDefinition[] {
    const renderers: RendererDefinition[] = []
    
    for (const [materialType, frameworkMap] of this.componentRenderers) {
      for (const [framework, entry] of frameworkMap) {
        renderers.push({
          $protocol: 'lcedit://protocols/renderer/v1',
          id: `${materialType}:${framework}`,
          name: materialType,
          version: { major: 1, minor: 0, patch: 0 },
          targetFramework: framework as any,
          targetPlatform: entry.metadata.platform || 'web' as any,
          capabilities: {},
          metadata: entry.metadata,
        })
      }
    }
    
    return renderers
  }
  
  // ==================== 属性字段渲染器 ====================
  
  /**
   * 注册属性字段渲染器
   */
  registerPropertyFieldRenderer(
    fieldType: string,
    renderer: PropertyFieldRenderer,
    metadata: RendererMetadata
  ): void {
    const framework = metadata.framework || "react"
    
    // 获取或创建框架映射
    if (!this.propertyFieldRenderers.has(fieldType)) {
      this.propertyFieldRenderers.set(fieldType, new Map())
    }
    
    const frameworkMap = this.propertyFieldRenderers.get(fieldType)!
    
    // 检查是否已注册
    if (frameworkMap.has(framework)) {
      console.warn(
        `Property field renderer for "${fieldType}" with framework "${framework}" is already registered. Overwriting.`
      )
    }
    
    // 注册渲染器
    frameworkMap.set(framework, {
      renderer,
      metadata,
      priority: metadata.priority || 0,
    })
    
    // 发送事件
    this.eventBus?.emitSync('renderer:propertyField:registered', {
      fieldType,
      framework,
      metadata,
    })
  }
  
  /**
   * 注销属性字段渲染器
   */
  unregisterPropertyFieldRenderer(
    fieldType: string,
    framework?: string
  ): boolean {
    const frameworkMap = this.propertyFieldRenderers.get(fieldType)
    if (!frameworkMap) {
      return false
    }
    
    if (framework) {
      // 注销特定框架的渲染器
      const removed = frameworkMap.delete(framework)
      
      // 如果框架映射为空，删除整个映射
      if (frameworkMap.size === 0) {
        this.propertyFieldRenderers.delete(fieldType)
      }
      
      if (removed) {
        this.eventBus?.emitSync('renderer:propertyField:unregistered', {
          fieldType,
          framework,
        })
      }
      
      return removed
    } else {
      // 注销所有框架的渲染器
      this.propertyFieldRenderers.delete(fieldType)
      this.eventBus?.emitSync('renderer:propertyField:unregistered', {
        fieldType,
      })
      return true
    }
  }
  
  /**
   * 获取属性字段渲染器
   */
  getPropertyFieldRenderer(
    fieldType: string,
    context: RenderContext
  ): PropertyFieldRenderer | undefined {
    const frameworkMap = this.propertyFieldRenderers.get(fieldType)
    if (!frameworkMap) {
      return undefined
    }
    
    // 优先查找精确匹配的渲染器
    const exactEntry = frameworkMap.get(context.framework || "react")
    if (exactEntry && this.isRendererCompatible(exactEntry, context)) {
      return exactEntry.renderer as PropertyFieldRenderer
    }
    
    // 查找兼容的渲染器（按优先级排序）
    const compatibleEntries = Array.from(frameworkMap.values())
      .filter(entry => this.isRendererCompatible(entry, context))
      .sort((a, b) => b.priority - a.priority)
    
    return compatibleEntries[0]?.renderer as PropertyFieldRenderer
  }
  
  /**
   * 检查是否有属性字段渲染器
   */
  hasPropertyFieldRenderer(fieldType: string, framework?: string): boolean {
    const frameworkMap = this.propertyFieldRenderers.get(fieldType)
    if (!frameworkMap) {
      return false
    }
    
    if (framework) {
      return frameworkMap.has(framework)
    }
    
    return frameworkMap.size > 0
  }
  
  /**
   * 获取所有属性字段渲染器
   */
  getAllPropertyFieldRenderers(): readonly RendererDefinition[] {
    const renderers: RendererDefinition[] = []
    
    for (const [fieldType, frameworkMap] of this.propertyFieldRenderers) {
      for (const [framework, entry] of frameworkMap) {
        renderers.push({
          $protocol: 'lcedit://protocols/renderer/v1',
          id: `${fieldType}:${framework}`,
          name: fieldType,
          version: { major: 1, minor: 0, patch: 0 },
          targetFramework: framework as any,
          targetPlatform: entry.metadata.platform || 'web' as any,
          capabilities: {},
          metadata: entry.metadata,
        })
      }
    }
    
    return renderers
  }
  
  // ==================== 工具方法 ====================
  
  /**
   * 检查渲染器是否兼容上下文
   */
  private isRendererCompatible(
    entry: RendererEntry,
    context: RenderContext
  ): boolean {
    const { metadata } = entry
    
    // 检查框架
    if (metadata.framework !== context.framework || "react") {
      return false
    }
    
    // 检查平台
    if (metadata.platform && metadata.platform !== context.platform || "web") {
      return false
    }
    
    // 检查模式
    if (metadata.supportedModes && !metadata.supportedModes.includes(context.mode)) {
      return false
    }
    
    // 检查视口
    if (metadata.supportedViewports && !metadata.supportedViewports.includes(context.viewport || "desktop")) {
      return false
    }
    
    return true
  }
  
  /**
   * 清空注册表
   */
  clear(): void {
    this.componentRenderers.clear()
    this.propertyFieldRenderers.clear()
    
    this.eventBus?.emitSync('renderer:cleared', {})
  }
  
  /**
   * 获取统计信息
   */
  getStats(): RendererRegistryStats {
    const frameworkCounts: Record<string, number> = {}
    const platformCounts: Record<string, number> = {}
    
    let componentRendererCount = 0
    let propertyFieldRendererCount = 0
    
    // 统计组件渲染器
    for (const frameworkMap of this.componentRenderers.values()) {
      for (const entry of frameworkMap.values()) {
        componentRendererCount++
        
        const framework = entry.metadata.framework || 'react'
        frameworkCounts[framework] = (frameworkCounts[framework] || 0) + 1
        
        const platform = entry.metadata.platform || 'web'
        platformCounts[platform] = (platformCounts[platform] || 0) + 1
      }
    }
    
    // 统计属性字段渲染器
    for (const frameworkMap of this.propertyFieldRenderers.values()) {
      for (const entry of frameworkMap.values()) {
        propertyFieldRendererCount++
        
        const framework = entry.metadata.framework || 'react'
        frameworkCounts[framework] = (frameworkCounts[framework] || 0) + 1
        
        const platform = entry.metadata.platform || 'web'
        platformCounts[platform] = (platformCounts[platform] || 0) + 1
      }
    }
    
    return {
      componentRendererCount,
      propertyFieldRendererCount,
      frameworkCounts,
      platformCounts,
    }
  }
  
  /**
   * 导出为 JSON
   */
  toJSON(): unknown {
    return {
      componentRenderers: this.getAllComponentRenderers(),
      propertyFieldRenderers: this.getAllPropertyFieldRenderers(),
      stats: this.getStats(),
    }
  }
}

// ==================== 导出 ====================

/**
 * 创建渲染器注册表
 */
export function createRendererRegistry(options?: {
  eventBus?: IEventBus
}): IRendererRegistry {
  return new RendererRegistry(options)
}

/**
 * 全局渲染器注册表实例（可选）
 */
let globalRendererRegistry: IRendererRegistry | null = null

/**
 * 获取全局渲染器注册表
 */
export function getGlobalRendererRegistry(): IRendererRegistry {
  if (!globalRendererRegistry) {
    globalRendererRegistry = createRendererRegistry()
  }
  return globalRendererRegistry
}

/**
 * 设置全局渲染器注册表
 */
export function setGlobalRendererRegistry(registry: IRendererRegistry): void {
  globalRendererRegistry = registry
}

/**
 * 重置全局渲染器注册表
 */
export function resetGlobalRendererRegistry(): void {
  if (globalRendererRegistry) {
    globalRendererRegistry.clear()
    globalRendererRegistry = null
  }
}

