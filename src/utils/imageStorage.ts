/**
 * 图片存储管理器
 *
 * 功能：
 * 1. 图片转 base64
 * 2. 计算图片 hash，去重存储
 * 3. 管理图片引用计数
 */

import { indexedDBService, STORES } from './indexedDB'

// 计算字符串的 hash 值
async function calculateHash(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

// 图片元数据
interface ImageMeta {
  hash: string
  base64: string
  size: number
  mimeType: string
  uploadTime: string
  refCount: number // 引用计数
}

class ImageStorageManager {
  private static instance: ImageStorageManager
  private hashMapKey = 'image-hash-map'

  private constructor() {}

  public static getInstance(): ImageStorageManager {
    if (!ImageStorageManager.instance) {
      ImageStorageManager.instance = new ImageStorageManager()
    }
    return ImageStorageManager.instance
  }

  /**
   * 上传图片并转换为 base64
   */
  public async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async e => {
        try {
          const base64 = e.target?.result as string

          // 计算 hash
          const hash = await calculateHash(base64)

          // 检查是否已存在
          const existing = await this.getImageByHash(hash)
          if (existing) {
            // 增加引用计数
            await this.incrementRefCount(hash)
            resolve(existing.base64)
            return
          }

          // 存储新图片
          const imageMeta: ImageMeta = {
            hash,
            base64,
            size: file.size,
            mimeType: file.type,
            uploadTime: new Date().toISOString(),
            refCount: 1,
          }

          await this.saveImage(imageMeta)
          resolve(base64)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  /**
   * 从 URL 加载图片并存储
   */
  public async loadImageFromUrl(url: string): Promise<string> {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const file = new File([blob], 'image', { type: blob.type })
      return await this.uploadImage(file)
    } catch (error) {
      console.error('Load image from URL failed:', error)
      return url // 失败时返回原 URL
    }
  }

  /**
   * 保存图片元数据
   */
  private async saveImage(imageMeta: ImageMeta): Promise<void> {
    try {
      // 获取现有的图片映射
      const hashMap = await this.getHashMap()
      hashMap[imageMeta.hash] = imageMeta

      // 保存到 IndexedDB
      await indexedDBService.setItem(STORES.THUMBNAILS, this.hashMapKey, hashMap)
    } catch (error) {
      console.error('Save image failed:', error)
    }
  }

  /**
   * 根据 hash 获取图片
   */
  private async getImageByHash(hash: string): Promise<ImageMeta | null> {
    try {
      const hashMap = await this.getHashMap()
      return hashMap[hash] || null
    } catch (error) {
      return null
    }
  }

  /**
   * 增加引用计数
   */
  private async incrementRefCount(hash: string): Promise<void> {
    try {
      const hashMap = await this.getHashMap()
      if (hashMap[hash]) {
        hashMap[hash].refCount++
        await indexedDBService.setItem(STORES.THUMBNAILS, this.hashMapKey, hashMap)
      }
    } catch (error) {
      console.error('Increment ref count failed:', error)
    }
  }

  /**
   * 减少引用计数
   */
  public async decrementRefCount(base64: string): Promise<void> {
    try {
      const hash = await calculateHash(base64)
      const hashMap = await this.getHashMap()

      if (hashMap[hash]) {
        hashMap[hash].refCount--

        // 如果引用计数为 0，删除图片
        if (hashMap[hash].refCount <= 0) {
          delete hashMap[hash]
        }

        await indexedDBService.setItem(STORES.THUMBNAILS, this.hashMapKey, hashMap)
      }
    } catch (error) {
      console.error('Decrement ref count failed:', error)
    }
  }

  /**
   * 获取 hash 映射表
   */
  private async getHashMap(): Promise<Record<string, ImageMeta>> {
    try {
      const data = await indexedDBService.getItem<Record<string, ImageMeta>>(
        STORES.THUMBNAILS,
        this.hashMapKey
      )
      return data || {}
    } catch (error) {
      return {}
    }
  }

  /**
   * 获取存储统计信息
   */
  public async getStorageStats(): Promise<{
    totalImages: number
    totalSize: number
    images: ImageMeta[]
  }> {
    const hashMap = await this.getHashMap()
    const images = Object.values(hashMap)
    const totalSize = images.reduce((sum, img) => sum + img.size, 0)

    return {
      totalImages: images.length,
      totalSize,
      images,
    }
  }

  /**
   * 清理无引用的图片
   */
  public async cleanupUnusedImages(): Promise<number> {
    try {
      const hashMap = await this.getHashMap()
      let cleanedCount = 0

      for (const hash in hashMap) {
        if (hashMap[hash].refCount <= 0) {
          delete hashMap[hash]
          cleanedCount++
        }
      }

      if (cleanedCount > 0) {
        await indexedDBService.setItem(STORES.THUMBNAILS, this.hashMapKey, hashMap)
      }

      return cleanedCount
    } catch (error) {
      console.error('Cleanup failed:', error)
      return 0
    }
  }
}

export const imageStorageManager = ImageStorageManager.getInstance()
