/**
 * 统一存储服务
 * 
 * 提供与 indexedDBService 兼容的 API，但会自动处理加密
 * 可以作为 indexedDBService 的替代品使用
 */

import { encryptedStorageService } from '@/core/services/EncryptedStorageService'

/**
 * 统一的存储服务
 * 
 * 这是 encryptedStorageService 的别名，提供了与 indexedDBService 相同的 API
 * 但会根据加密设置自动加密/解密数据
 */
export const storageService = encryptedStorageService

/**
 * 向后兼容：导出与 indexedDBService 相同的方法
 */
export const {
  setItem,
  getItem,
  removeItem,
  clear,
  getAllKeys,
  getAllValues,
} = encryptedStorageService

export default storageService

