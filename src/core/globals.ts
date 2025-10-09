/**
 * 全局服务访问器
 * 
 * 提供全局访问核心服务的方式（用于非React组件）
 */

import { IMaterialRegistry } from './protocols/IMaterialProtocol'
import { IEventBus } from './protocols/IEventProtocol'
import { IPluginManager } from './protocols/IPluginProtocol'

class GlobalServices {
  private static instance: GlobalServices
  private _materialRegistry?: IMaterialRegistry
  private _eventBus?: IEventBus
  private _pluginManager?: IPluginManager

  private constructor() {}

  public static getInstance(): GlobalServices {
    if (!GlobalServices.instance) {
      GlobalServices.instance = new GlobalServices()
    }
    return GlobalServices.instance
  }

  public setMaterialRegistry(registry: IMaterialRegistry): void {
    this._materialRegistry = registry
  }

  public getMaterialRegistry(): IMaterialRegistry {
    if (!this._materialRegistry) {
      throw new Error('[GlobalServices] MaterialRegistry未初始化')
    }
    return this._materialRegistry
  }

  public setEventBus(eventBus: IEventBus): void {
    this._eventBus = eventBus
  }

  public getEventBus(): IEventBus {
    if (!this._eventBus) {
      throw new Error('[GlobalServices] EventBus未初始化')
    }
    return this._eventBus
  }

  public setPluginManager(manager: IPluginManager): void {
    this._pluginManager = manager
  }

  public getPluginManager(): IPluginManager {
    if (!this._pluginManager) {
      throw new Error('[GlobalServices] PluginManager未初始化')
    }
    return this._pluginManager
  }

  public clear(): void {
    this._materialRegistry = undefined
    this._eventBus = undefined
    this._pluginManager = undefined
  }
}

export const globalServices = GlobalServices.getInstance()

// 便捷访问函数
export function getMaterialRegistry(): IMaterialRegistry {
  return globalServices.getMaterialRegistry()
}

export function getEventBus(): IEventBus {
  return globalServices.getEventBus()
}

export function getPluginManager(): IPluginManager {
  return globalServices.getPluginManager()
}

