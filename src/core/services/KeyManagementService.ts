/**
 * 密钥管理服务
 * 
 * 负责管理加密密钥的生命周期、存储和访问控制
 */

import { indexedDBService, STORES } from '@/utils/indexedDB'

interface KeyMetadata {
  /** 是否启用加密 */
  enabled: boolean
  /** 密码提示（可选） */
  passwordHint?: string
  /** 创建时间 */
  createdAt: string
  /** 最后更新时间 */
  updatedAt: string
  /** 密码哈希（用于验证） */
  passwordHash: string
}

const KEY_METADATA_KEY = 'encryption-metadata'
const SESSION_KEY = 'encryption-session-key'

export class KeyManagementService {
  private static instance: KeyManagementService
  private sessionPassword: string | null = null

  private constructor() {
    // 监听页面关闭，清除会话密钥
    window.addEventListener('beforeunload', () => {
      this.clearSessionKey()
    })
  }

  public static getInstance(): KeyManagementService {
    if (!KeyManagementService.instance) {
      KeyManagementService.instance = new KeyManagementService()
    }
    return KeyManagementService.instance
  }

  /**
   * 检查是否已设置加密密码
   */
  async isEncryptionEnabled(): Promise<boolean> {
    try {
      const metadata = await this.getMetadata()
      return metadata?.enabled || false
    } catch {
      return false
    }
  }

  /**
   * 获取密钥元数据
   */
  private async getMetadata(): Promise<KeyMetadata | null> {
    try {
      return await indexedDBService.getItem<KeyMetadata>(STORES.THEME, KEY_METADATA_KEY)
    } catch {
      return null
    }
  }

  /**
   * 保存密钥元数据
   */
  private async saveMetadata(metadata: KeyMetadata): Promise<void> {
    await indexedDBService.setItem(STORES.THEME, KEY_METADATA_KEY, metadata)
  }

  /**
   * 设置加密密码
   */
  async setupEncryption(password: string, passwordHint?: string): Promise<void> {
    // 验证密码强度
    if (password.length < 8) {
      throw new Error('密码长度至少为8个字符')
    }

    // 生成密码哈希
    const passwordHash = await this.hashPassword(password)

    // 保存元数据
    const metadata: KeyMetadata = {
      enabled: true,
      passwordHint,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordHash,
    }

    await this.saveMetadata(metadata)
    this.sessionPassword = password
  }

  /**
   * 验证密码
   */
  async verifyPassword(password: string): Promise<boolean> {
    const metadata = await this.getMetadata()
    if (!metadata) {
      return false
    }

    const passwordHash = await this.hashPassword(password)
    return passwordHash === metadata.passwordHash
  }

  /**
   * 解锁加密（输入密码）
   */
  async unlock(password: string): Promise<boolean> {
    const isValid = await this.verifyPassword(password)
    if (isValid) {
      this.sessionPassword = password
      // 可选：保存到 sessionStorage（页面刷新后仍有效）
      sessionStorage.setItem(SESSION_KEY, password)
    }
    return isValid
  }

  /**
   * 锁定加密（清除会话密钥）
   */
  lock(): void {
    this.clearSessionKey()
  }

  /**
   * 检查是否已解锁
   */
  isUnlocked(): boolean {
    return this.sessionPassword !== null
  }

  /**
   * 获取会话密码
   */
  getSessionPassword(): string | null {
    // 如果内存中没有，尝试从 sessionStorage 恢复
    if (!this.sessionPassword) {
      this.sessionPassword = sessionStorage.getItem(SESSION_KEY)
    }
    return this.sessionPassword
  }

  /**
   * 更改密码
   */
  async changePassword(oldPassword: string, newPassword: string, newPasswordHint?: string): Promise<void> {
    // 验证旧密码
    const isValid = await this.verifyPassword(oldPassword)
    if (!isValid) {
      throw new Error('旧密码不正确')
    }

    // 验证新密码强度
    if (newPassword.length < 8) {
      throw new Error('新密码长度至少为8个字符')
    }

    // 更新元数据
    const metadata = await this.getMetadata()
    if (!metadata) {
      throw new Error('加密元数据不存在')
    }

    const passwordHash = await this.hashPassword(newPassword)
    metadata.passwordHash = passwordHash
    metadata.passwordHint = newPasswordHint
    metadata.updatedAt = new Date().toISOString()

    await this.saveMetadata(metadata)
    this.sessionPassword = newPassword
    sessionStorage.setItem(SESSION_KEY, newPassword)
  }

  /**
   * 禁用加密
   */
  async disableEncryption(password: string): Promise<void> {
    // 验证密码
    const isValid = await this.verifyPassword(password)
    if (!isValid) {
      throw new Error('密码不正确')
    }

    // 更新元数据
    const metadata = await this.getMetadata()
    if (metadata) {
      metadata.enabled = false
      metadata.updatedAt = new Date().toISOString()
      await this.saveMetadata(metadata)
    }

    this.clearSessionKey()
  }

  /**
   * 获取密码提示
   */
  async getPasswordHint(): Promise<string | undefined> {
    const metadata = await this.getMetadata()
    return metadata?.passwordHint
  }

  /**
   * 清除会话密钥
   */
  private clearSessionKey(): void {
    this.sessionPassword = null
    sessionStorage.removeItem(SESSION_KEY)
  }

  /**
   * 哈希密码
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    
    // 转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  /**
   * 重置加密系统（危险操作）
   */
  async reset(): Promise<void> {
    await indexedDBService.removeItem(STORES.THEME, KEY_METADATA_KEY)
    this.clearSessionKey()
  }
}

// 导出单例
export const keyManagementService = KeyManagementService.getInstance()

