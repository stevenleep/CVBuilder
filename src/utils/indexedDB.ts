/**
 * IndexedDB 存储服务
 *
 * 统一管理浏览器 IndexedDB 存储
 */

const DB_NAME = 'resume-builder-db'
const DB_VERSION = 1

// 存储对象的定义
const STORES = {
  EDITOR_STATE: 'editor-state',
  TEMPLATES: 'templates',
  RESUME_TEMPLATES: 'resume-templates',
}

class IndexedDBService {
  private static instance: IndexedDBService
  private db: IDBDatabase | null = null
  private initPromise: Promise<void> | null = null

  private constructor() {}

  public static getInstance(): IndexedDBService {
    if (!IndexedDBService.instance) {
      IndexedDBService.instance = new IndexedDBService()
    }
    return IndexedDBService.instance
  }

  /**
   * 初始化数据库
   */
  private async init(): Promise<void> {
    if (this.db) return
    if (this.initPromise) return this.initPromise

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建存储对象
        if (!db.objectStoreNames.contains(STORES.EDITOR_STATE)) {
          db.createObjectStore(STORES.EDITOR_STATE)
        }

        if (!db.objectStoreNames.contains(STORES.TEMPLATES)) {
          db.createObjectStore(STORES.TEMPLATES)
        }

        if (!db.objectStoreNames.contains(STORES.RESUME_TEMPLATES)) {
          db.createObjectStore(STORES.RESUME_TEMPLATES)
        }
      }
    })

    return this.initPromise
  }

  /**
   * 确保数据库已初始化
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) {
      throw new Error('数据库初始化失败')
    }
    return this.db
  }

  /**
   * 保存数据
   */
  public async setItem(storeName: string, key: string, value: any): Promise<void> {
    const db = await this.ensureDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(value, key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 获取数据
   */
  public async getItem<T = any>(storeName: string, key: string): Promise<T | null> {
    const db = await this.ensureDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => {
        resolve(request.result || null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 删除数据
   */
  public async removeItem(storeName: string, key: string): Promise<void> {
    const db = await this.ensureDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 清空存储
   */
  public async clear(storeName: string): Promise<void> {
    const db = await this.ensureDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 获取所有键
   */
  public async getAllKeys(storeName: string): Promise<IDBValidKey[]> {
    const db = await this.ensureDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAllKeys()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * 获取所有值
   */
  public async getAllValues<T = any>(storeName: string): Promise<T[]> {
    const db = await this.ensureDB()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

export const indexedDBService = IndexedDBService.getInstance()
export { STORES }
