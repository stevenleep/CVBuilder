/**
 * 加密服务协议
 * 
 * 提供端到端加密（E2EE）能力，保护用户数据安全
 */

/**
 * 加密后的数据结构
 */
export interface EncryptedData {
  /** 加密后的数据（Base64编码） */
  ciphertext: string
  /** 初始化向量（Base64编码） */
  iv: string
  /** 盐值（Base64编码） */
  salt: string
  /** 加密算法版本 */
  version: string
}

/**
 * 密钥派生选项
 */
export interface KeyDerivationOptions {
  /** 迭代次数 */
  iterations?: number
  /** 密钥长度（位） */
  keyLength?: number
  /** 哈希算法 */
  hash?: string
}

/**
 * 加密服务接口
 */
export interface IEncryptionService {
  /**
   * 初始化加密服务
   * @param password 用户密码
   */
  initialize(password: string): Promise<void>

  /**
   * 检查是否已初始化
   */
  isInitialized(): boolean

  /**
   * 加密数据
   * @param data 要加密的数据
   */
  encrypt(data: any): Promise<EncryptedData>

  /**
   * 解密数据
   * @param encryptedData 加密后的数据
   */
  decrypt<T = any>(encryptedData: EncryptedData): Promise<T>

  /**
   * 更改密码
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  changePassword(oldPassword: string, newPassword: string): Promise<void>

  /**
   * 验证密码
   * @param password 密码
   */
  verifyPassword(password: string): Promise<boolean>

  /**
   * 清除密钥（退出加密模式）
   */
  clear(): void

  /**
   * 导出加密密钥（用于备份）
   */
  exportKey(): Promise<string>

  /**
   * 导入加密密钥（用于恢复）
   * @param keyData 密钥数据
   * @param password 密码
   */
  importKey(keyData: string, password: string): Promise<void>
}

