/**
 * 加密服务实现
 * 
 * 基于 Web Crypto API 实现 AES-GCM 加密
 */

import type { IEncryptionService, EncryptedData, KeyDerivationOptions } from '../protocols/IEncryptionService'

// 默认配置
const DEFAULT_OPTIONS: Required<KeyDerivationOptions> = {
  iterations: 100000, // PBKDF2 迭代次数
  keyLength: 256, // AES-256
  hash: 'SHA-256', // 哈希算法
}

const ALGORITHM = 'AES-GCM'
const VERSION = '1.0'

export class EncryptionService implements IEncryptionService {
  private password: string | null = null

  /**
   * 初始化加密服务
   */
  async initialize(password: string): Promise<void> {
    this.password = password
    // 不立即派生密钥，在第一次使用时才派生
    // 这样可以避免不必要的性能开销
  }

  /**
   * 检查是否已初始化
   */
  isInitialized(): boolean {
    return this.password !== null
  }

  /**
   * 从密码派生加密密钥
   */
  private async deriveKey(password: string, salt: BufferSource): Promise<CryptoKey> {
    // 首先从密码创建一个基础密钥
    const encoder = new TextEncoder()
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    )

    // 使用 PBKDF2 派生实际的加密密钥
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: DEFAULT_OPTIONS.iterations,
        hash: DEFAULT_OPTIONS.hash,
      },
      passwordKey,
      {
        name: ALGORITHM,
        length: DEFAULT_OPTIONS.keyLength,
      },
      false,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * 加密数据
   */
  async encrypt(data: any): Promise<EncryptedData> {
    if (!this.isInitialized()) {
      throw new Error('加密服务未初始化，请先调用 initialize()')
    }

    try {
      // 将数据序列化为 JSON
      const jsonString = JSON.stringify(data)
      const encoder = new TextEncoder()
      const dataBuffer = encoder.encode(jsonString)

      // 生成随机盐值和 IV
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12)) // GCM 推荐使用 12 字节 IV

      // 派生密钥
      const key = await this.deriveKey(this.password!, salt)

      // 加密数据
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: ALGORITHM,
          iv,
        },
        key,
        dataBuffer
      )

      // 转换为 Base64
      return {
        ciphertext: this.arrayBufferToBase64(encryptedBuffer),
        iv: this.arrayBufferToBase64(iv.buffer),
        salt: this.arrayBufferToBase64(salt.buffer),
        version: VERSION,
      }
    } catch (error) {
      console.error('加密失败:', error)
      throw new Error('数据加密失败')
    }
  }

  /**
   * 解密数据
   */
  async decrypt<T = any>(encryptedData: EncryptedData): Promise<T> {
    if (!this.isInitialized()) {
      throw new Error('加密服务未初始化，请先调用 initialize()')
    }

    try {
      // 从 Base64 解码
      const ciphertext = this.base64ToArrayBuffer(encryptedData.ciphertext)
      const iv = this.base64ToArrayBuffer(encryptedData.iv)
      const salt = this.base64ToArrayBuffer(encryptedData.salt)

      // 派生密钥
      const key = await this.deriveKey(this.password!, new Uint8Array(salt))

      // 解密数据
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: ALGORITHM,
          iv: new Uint8Array(iv),
        },
        key,
        ciphertext
      )

      // 解析 JSON
      const decoder = new TextDecoder()
      const jsonString = decoder.decode(decryptedBuffer)
      return JSON.parse(jsonString)
    } catch (error) {
      console.error('解密失败:', error)
      throw new Error('数据解密失败，密码可能不正确')
    }
  }

  /**
   * 更改密码
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    // 验证旧密码
    const isValid = await this.verifyPassword(oldPassword)
    if (!isValid) {
      throw new Error('旧密码不正确')
    }

    // 更新密码
    this.password = newPassword
  }

  /**
   * 验证密码
   */
  async verifyPassword(password: string): Promise<boolean> {
    if (!this.isInitialized()) {
      return false
    }

    try {
      // 通过尝试派生密钥来验证密码
      const salt = crypto.getRandomValues(new Uint8Array(16))
      await this.deriveKey(password, salt)
      return password === this.password
    } catch {
      return false
    }
  }

  /**
   * 清除密钥
   */
  clear(): void {
    this.password = null
  }

  /**
   * 导出密钥（用于备份）
   */
  async exportKey(): Promise<string> {
    if (!this.isInitialized()) {
      throw new Error('加密服务未初始化')
    }

    // 创建包含密码和版本的导出数据
    const exportData = {
      version: VERSION,
      timestamp: new Date().toISOString(),
      passwordHash: await this.hashPassword(this.password!),
    }

    return btoa(JSON.stringify(exportData))
  }

  /**
   * 导入密钥（用于恢复）
   */
  async importKey(keyData: string, password: string): Promise<void> {
    try {
      const exportData = JSON.parse(atob(keyData))
      
      // 验证版本
      if (exportData.version !== VERSION) {
        throw new Error('不支持的密钥版本')
      }

      // 验证密码
      const passwordHash = await this.hashPassword(password)
      if (passwordHash !== exportData.passwordHash) {
        throw new Error('密码不正确')
      }

      this.password = password
    } catch (error) {
      console.error('导入密钥失败:', error)
      throw new Error('密钥导入失败')
    }
  }

  /**
   * 哈希密码（用于验证）
   */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return this.arrayBufferToBase64(hashBuffer)
  }

  /**
   * ArrayBuffer 转 Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  /**
   * Base64 转 ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }
}

// 导出单例
export const encryptionService = new EncryptionService()

