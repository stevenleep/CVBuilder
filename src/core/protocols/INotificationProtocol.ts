/**
 * 通知服务协议
 *
 * 定义统一的通知、提示、确认对话框系统
 */

/**
 * 通知类型
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

/**
 * 通知位置
 */
export type NotificationPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

/**
 * 通知配置
 */
export interface INotification {
  /** 通知ID（自动生成） */
  id?: string
  /** 通知类型 */
  type: NotificationType
  /** 标题 */
  title?: string
  /** 消息内容 */
  message: string
  /** 显示时长（毫秒），0 表示不自动关闭 */
  duration?: number
  /** 位置 */
  position?: NotificationPosition
  /** 是否可关闭 */
  closeable?: boolean
  /** 图标 */
  icon?: string
  /** 操作按钮 */
  actions?: INotificationAction[]
  /** 点击回调 */
  onClick?: () => void
  /** 关闭回调 */
  onClose?: () => void
}

/**
 * 通知操作按钮
 */
export interface INotificationAction {
  /** 按钮标签 */
  label: string
  /** 点击回调 */
  onClick: () => void
  /** 按钮类型 */
  type?: 'primary' | 'default' | 'danger'
}

/**
 * 确认对话框配置
 */
export interface IConfirmConfig {
  /** 标题 */
  title: string
  /** 消息 */
  message: string
  /** 类型 */
  type?: 'info' | 'warning' | 'danger'
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 确认按钮类型 */
  confirmType?: 'primary' | 'danger'
  /** 是否显示取消按钮 */
  showCancel?: boolean
}

/**
 * 提示对话框配置
 */
export interface IPromptConfig {
  /** 标题 */
  title: string
  /** 消息 */
  message?: string
  /** 默认值 */
  defaultValue?: string
  /** 占位符 */
  placeholder?: string
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 验证函数 */
  validator?: (value: string) => boolean | string
}

/**
 * 通知选项
 */
export interface NotificationOptions {
  /** 显示时长 */
  duration?: number
  /** 位置 */
  position?: NotificationPosition
  /** 是否可关闭 */
  closeable?: boolean
  /** 图标 */
  icon?: string
  /** 操作 */
  actions?: INotificationAction[]
}

/**
 * 通知服务接口
 */
export interface INotificationService {
  /** 显示通知 */
  show(notification: INotification): string

  /** 成功通知 */
  success(message: string, options?: NotificationOptions): string

  /** 错误通知 */
  error(message: string, options?: NotificationOptions): string

  /** 警告通知 */
  warning(message: string, options?: NotificationOptions): string

  /** 信息通知 */
  info(message: string, options?: NotificationOptions): string

  /** 确认对话框 */
  confirm(config: IConfirmConfig): Promise<boolean>

  /** 提示输入对话框 */
  prompt(config: IPromptConfig): Promise<string | null>

  /** 关闭通知 */
  close(id: string): void

  /** 关闭所有通知 */
  closeAll(): void

  /** 获取所有通知 */
  getAll(): INotification[]

  /** 清除历史记录 */
  clearHistory(): void
}
