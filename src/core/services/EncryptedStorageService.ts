/**
 * 加密存储服务
 * 
 * 包装 IndexedDB 服务，提供透明的加密/解密功能
 */

import { indexedDBService, STORES } from '@/utils/indexedDB'
import { encryptionService } from './EncryptionService'
import { keyManagementService } from './KeyManagementService'
import type { EncryptedData } from '../protocols/IEncryptionService'

/**
 * 存储数据的包装结构
 */
interface StorageWrapper {
  /** 是否加密 */
  encrypted: boolean
  /** 数据（加密或未加密） */
  data: any
  /** 时间戳 */
  timestamp: string
}

/**
 * 需要加密的数据存储
 */
const ENCRYPTED_STORES = [
  STORES.RESUMES,
  STORES.RESUME_TEMPLATES,
  STORES.EDITOR_STATE,
]

export class EncryptedStorageService {
  private static instance: EncryptedStorageService

  private constructor() {}

  public static getInstance(): EncryptedStorageService {
    if (!EncryptedStorageService.instance) {
      EncryptedStorageService.instance = new EncryptedStorageService()
    }
    return EncryptedStorageService.instance
  }

  /**
   * 检查存储是否需要加密
   */
  private shouldEncrypt(storeName: string): boolean {
    return ENCRYPTED_STORES.includes(storeName)
  }

  /**
   * 保存数据（自动加密）
   */
  async setItem(storeName: string, key: string, value: any): Promise<void> {
    const isEncryptionEnabled = await keyManagementService.isEncryptionEnabled()
    const shouldEncrypt = this.shouldEncrypt(storeName) && isEncryptionEnabled

    if (shouldEncrypt) {
      // 检查是否已解锁
      const password = keyManagementService.getSessionPassword()
      if (!password) {
        throw new Error('加密服务已锁定，请先解锁')
      }

      // 初始化加密服务
      if (!encryptionService.isInitialized()) {
        await encryptionService.initialize(password)
      }

      // 加密数据
      const encryptedData = await encryptionService.encrypt(value)

      // 包装数据
      const wrapper: StorageWrapper = {
        encrypted: true,
        data: encryptedData,
        timestamp: new Date().toISOString(),
      }

      await indexedDBService.setItem(storeName, key, wrapper)
    } else {
      // 不加密，直接存储
      const wrapper: StorageWrapper = {
        encrypted: false,
        data: value,
        timestamp: new Date().toISOString(),
      }

      await indexedDBService.setItem(storeName, key, wrapper)
    }
  }

  /**
   * 获取数据（自动解密）
   */
  async getItem<T = any>(storeName: string, key: string): Promise<T | null> {
    const wrapper = await indexedDBService.getItem<StorageWrapper>(storeName, key)
    
    if (!wrapper) {
      return null
    }

    // 兼容旧数据格式（没有包装结构）
    if (!wrapper.encrypted && !wrapper.data) {
      return wrapper as any
    }

    // 如果数据已加密
    if (wrapper.encrypted) {
      const password = keyManagementService.getSessionPassword()
      if (!password) {
        throw new Error('数据已加密，请先解锁')
      }

      // 初始化加密服务
      if (!encryptionService.isInitialized()) {
        await encryptionService.initialize(password)
      }

      // 解密数据
      try {
        return await encryptionService.decrypt<T>(wrapper.data as EncryptedData)
      } catch (error) {
        console.error('解密失败:', error)
        throw new Error('数据解密失败，密码可能不正确')
      }
    }

    // 未加密数据
    return wrapper.data as T
  }

  /**
   * 删除数据
   */
  async removeItem(storeName: string, key: string): Promise<void> {
    return indexedDBService.removeItem(storeName, key)
  }

  /**
   * 清空存储
   */
  async clear(storeName: string): Promise<void> {
    return indexedDBService.clear(storeName)
  }

  /**
   * 获取所有键
   */
  async getAllKeys(storeName: string): Promise<IDBValidKey[]> {
    return indexedDBService.getAllKeys(storeName)
  }

  /**
   * 获取所有值（自动解密）
   */
  async getAllValues<T = any>(storeName: string): Promise<T[]> {
    const wrappers = await indexedDBService.getAllValues<StorageWrapper>(storeName)
    const results: T[] = []

    for (const wrapper of wrappers) {
      // 兼容旧数据格式
      if (!wrapper.encrypted && !wrapper.data) {
        results.push(wrapper as any)
        continue
      }

      if (wrapper.encrypted) {
        const password = keyManagementService.getSessionPassword()
        if (!password) {
          throw new Error('数据已加密，请先解锁')
        }

        if (!encryptionService.isInitialized()) {
          await encryptionService.initialize(password)
        }

        try {
          const decrypted = await encryptionService.decrypt<T>(wrapper.data as EncryptedData)
          results.push(decrypted)
        } catch (error) {
          console.error('解密数据失败，跳过该项:', error)
          // 跳过无法解密的数据
        }
      } else {
        results.push(wrapper.data as T)
      }
    }

    return results
  }

  /**
   * 迁移现有数据（加密未加密的数据）
   */
  async migrateToEncrypted(storeName: string, password: string): Promise<{
    total: number
    migrated: number
    failed: number
  }> {
    if (!this.shouldEncrypt(storeName)) {
      throw new Error(`存储 ${storeName} 不支持加密`)
    }

    // 确保加密服务已初始化
    await keyManagementService.setupEncryption(password)
    await encryptionService.initialize(password)

    const keys = await indexedDBService.getAllKeys(storeName)
    const results = {
      total: keys.length,
      migrated: 0,
      failed: 0,
    }

    for (const key of keys) {
      try {
        const wrapper = await indexedDBService.getItem<StorageWrapper>(storeName, key as string)
        
        if (!wrapper) {
          results.failed++
          continue
        }

        // 如果已经加密，跳过
        if (wrapper.encrypted) {
          continue
        }

        // 获取原始数据
        const originalData = wrapper.data || wrapper

        // 加密数据
        const encryptedData = await encryptionService.encrypt(originalData)

        // 保存加密后的数据
        const newWrapper: StorageWrapper = {
          encrypted: true,
          data: encryptedData,
          timestamp: new Date().toISOString(),
        }

        await indexedDBService.setItem(storeName, key as string, newWrapper)
        results.migrated++
      } catch (error) {
        console.error(`迁移数据失败 (key: ${key}):`, error)
        results.failed++
      }
    }

    return results
  }

  /**
   * 解密所有数据（移除加密）
   */
  async decryptAll(storeName: string, password: string): Promise<{
    total: number
    decrypted: number
    failed: number
  }> {
    if (!this.shouldEncrypt(storeName)) {
      throw new Error(`存储 ${storeName} 不支持加密`)
    }

    // 验证密码
    const isValid = await keyManagementService.verifyPassword(password)
    if (!isValid) {
      throw new Error('密码不正确')
    }

    await encryptionService.initialize(password)

    const keys = await indexedDBService.getAllKeys(storeName)
    const results = {
      total: keys.length,
      decrypted: 0,
      failed: 0,
    }

    for (const key of keys) {
      try {
        const wrapper = await indexedDBService.getItem<StorageWrapper>(storeName, key as string)
        
        if (!wrapper) {
          results.failed++
          continue
        }

        // 如果未加密，跳过
        if (!wrapper.encrypted) {
          continue
        }

        // 解密数据
        const decryptedData = await encryptionService.decrypt(wrapper.data as EncryptedData)

        // 保存未加密的数据
        const newWrapper: StorageWrapper = {
          encrypted: false,
          data: decryptedData,
          timestamp: new Date().toISOString(),
        }

        await indexedDBService.setItem(storeName, key as string, newWrapper)
        results.decrypted++
      } catch (error) {
        console.error(`解密数据失败 (key: ${key}):`, error)
        results.failed++
      }
    }

    return results
  }

  /**
   * 检查数据是否已加密
   */
  async isDataEncrypted(storeName: string, key: string): Promise<boolean> {
    const wrapper = await indexedDBService.getItem<StorageWrapper>(storeName, key)
    return wrapper?.encrypted || false
  }

  /**
   * 获取存储统计
   */
  async getStorageStats(storeName: string): Promise<{
    total: number
    encrypted: number
    unencrypted: number
  }> {
    const keys = await indexedDBService.getAllKeys(storeName)
    const stats = {
      total: keys.length,
      encrypted: 0,
      unencrypted: 0,
    }

    for (const key of keys) {
      const wrapper = await indexedDBService.getItem<StorageWrapper>(storeName, key as string)
      if (wrapper?.encrypted) {
        stats.encrypted++
      } else {
        stats.unencrypted++
      }
    }

    return stats
  }
}

// 导出单例
export const encryptedStorageService = EncryptedStorageService.getInstance()

