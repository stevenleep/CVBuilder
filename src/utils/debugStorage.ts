/**
 * 调试工具 - 用于检查和操作 IndexedDB
 *
 * 在浏览器控制台中使用：
 * import('/src/utils/debugStorage.ts').then(m => window.debugStorage = m.debugStorage)
 */

import { encryptedStorageService } from '@/core/services/EncryptedStorageService'
import { indexedDBService, STORES } from '@/utils/indexedDB'

export const debugStorage = {
  /**
   * 列出所有简历的 keys
   */
  async listResumeKeys() {
    const keys = await encryptedStorageService.getAllKeys(STORES.RESUMES)
    console.log('📋 所有简历 keys:', keys)
    return keys
  },

  /**
   * 获取所有简历数据
   */
  async listAllResumes() {
    const keys = await encryptedStorageService.getAllKeys(STORES.RESUMES)
    const resumes = []

    for (const key of keys) {
      const resume = await encryptedStorageService.getItem(STORES.RESUMES, String(key))
      if (resume) {
        resumes.push({
          id: resume.id,
          name: resume.name,
          updatedAt: resume.updatedAt,
        })
      }
    }

    console.table(resumes)
    return resumes
  },

  /**
   * 获取指定简历的完整数据
   */
  async getResume(id: string) {
    const resume = await encryptedStorageService.getItem(STORES.RESUMES, id)
    console.log('📄 简历数据:', resume)
    return resume
  },

  /**
   * 删除指定简历
   */
  async deleteResume(id: string) {
    console.log('🗑️ 删除简历:', id)
    await encryptedStorageService.removeItem(STORES.RESUMES, id)

    // 验证删除
    const check = await encryptedStorageService.getItem(STORES.RESUMES, id)
    if (check) {
      console.error('❌ 删除失败！数据仍然存在')
      return false
    } else {
      console.log('✅ 删除成功')
      return true
    }
  },

  /**
   * 直接查看 IndexedDB 原始数据（绕过加密层）
   */
  async inspectRawData(id: string) {
    const raw = await indexedDBService.getItem(STORES.RESUMES, id)
    console.log('🔍 原始 IndexedDB 数据:', raw)
    return raw
  },

  /**
   * 列出所有原始 keys（绕过加密层）
   */
  async listRawKeys() {
    const keys = await indexedDBService.getAllKeys(STORES.RESUMES)
    console.log('🔑 原始 IndexedDB keys:', keys)
    return keys
  },

  /**
   * 强制删除（直接操作 IndexedDB）
   */
  async forceDelete(id: string) {
    console.log('💣 强制删除:', id)
    await indexedDBService.removeItem(STORES.RESUMES, id)

    // 验证
    const check = await indexedDBService.getItem(STORES.RESUMES, id)
    if (check) {
      console.error('❌ 强制删除失败！')
      return false
    } else {
      console.log('✅ 强制删除成功')
      return true
    }
  },

  /**
   * 清空所有简历
   */
  async clearAllResumes() {
    const confirmed = confirm('⚠️ 确定要清空所有简历吗？此操作不可恢复！')
    if (!confirmed) return

    await encryptedStorageService.clear(STORES.RESUMES)
    console.log('🧹 已清空所有简历')
  },

  /**
   * 获取存储统计
   */
  async getStats() {
    const keys = await encryptedStorageService.getAllKeys(STORES.RESUMES)
    const stats = {
      totalResumes: keys.length,
      keys: keys,
    }
    console.log('📊 存储统计:', stats)
    return stats
  },
}

// 自动挂载到 window 对象（仅开发环境）
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  ;(window as any).debugStorage = debugStorage
  console.log('🛠️ 调试工具已加载！使用 debugStorage.xxx() 来调用')
  console.log('可用方法：')
  console.log('  - debugStorage.listAllResumes()     列出所有简历')
  console.log('  - debugStorage.getResume(id)        获取指定简历')
  console.log('  - debugStorage.deleteResume(id)     删除指定简历')
  console.log('  - debugStorage.listRawKeys()        查看原始keys')
  console.log('  - debugStorage.inspectRawData(id)   查看原始数据')
  console.log('  - debugStorage.forceDelete(id)      强制删除')
}
