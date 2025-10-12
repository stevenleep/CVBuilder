/**
 * 通知服务实现
 *
 * 提供统一的通知、提示、确认对话框管理
 */

import {
  INotificationService,
  INotification,
  IConfirmConfig,
  IPromptConfig,
  NotificationOptions,
} from '../protocols/INotificationProtocol'
import { IEventBus } from '../protocols/IEventProtocol'

export class NotificationService implements INotificationService {
  private notifications: Map<string, INotification> = new Map()
  private eventBus?: IEventBus
  private idCounter: number = 0

  constructor(eventBus?: IEventBus) {
    this.eventBus = eventBus
  }

  /**
   * 显示通知
   */
  public show(notification: INotification): string {
    const id = notification.id || this.generateId()
    const fullNotification: INotification = {
      ...notification,
      id,
      duration: notification.duration ?? 3000,
      position: notification.position ?? 'top-right',
      closeable: notification.closeable ?? true,
    }

    this.notifications.set(id, fullNotification)
    this.eventBus?.emit('notification:show', fullNotification)

    // 自动关闭
    if (fullNotification.duration && fullNotification.duration > 0) {
      setTimeout(() => {
        this.close(id)
      }, fullNotification.duration)
    }

    return id
  }

  /**
   * 成功通知
   */
  public success(message: string, options?: NotificationOptions): string {
    return this.show({
      type: 'success',
      message,
      ...options,
    })
  }

  /**
   * 错误通知
   */
  public error(message: string, options?: NotificationOptions): string {
    return this.show({
      type: 'error',
      message,
      duration: options?.duration ?? 5000, // 错误消息显示更久
      ...options,
    })
  }

  /**
   * 警告通知
   */
  public warning(message: string, options?: NotificationOptions): string {
    return this.show({
      type: 'warning',
      message,
      ...options,
    })
  }

  /**
   * 信息通知
   */
  public info(message: string, options?: NotificationOptions): string {
    return this.show({
      type: 'info',
      message,
      ...options,
    })
  }

  /**
   * 确认对话框
   */
  public async confirm(config: IConfirmConfig): Promise<boolean> {
    return new Promise(resolve => {
      const confirmData = {
        ...config,
        confirmText: config.confirmText ?? '确认',
        cancelText: config.cancelText ?? '取消',
        confirmType: config.confirmType ?? 'primary',
        showCancel: config.showCancel ?? true,
      }

      this.eventBus?.emit('notification:confirm', {
        ...confirmData,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      })
    })
  }

  /**
   * 提示输入对话框
   */
  public async prompt(config: IPromptConfig): Promise<string | null> {
    return new Promise(resolve => {
      const promptData = {
        ...config,
        confirmText: config.confirmText ?? '确认',
        cancelText: config.cancelText ?? '取消',
      }

      this.eventBus?.emit('notification:prompt', {
        ...promptData,
        onConfirm: (value: string) => resolve(value),
        onCancel: () => resolve(null),
      })
    })
  }

  /**
   * 关闭通知
   */
  public close(id: string): void {
    const notification = this.notifications.get(id)
    if (notification) {
      const { onClose } = notification
      onClose?.()
      this.notifications.delete(id)
      this.eventBus?.emit('notification:close', { id })
    }
  }

  /**
   * 关闭所有通知
   */
  public closeAll(): void {
    this.notifications.forEach((_notification, id) => {
      this.close(id)
    })
  }

  /**
   * 获取所有通知
   */
  public getAll(): INotification[] {
    return Array.from(this.notifications.values())
  }

  /**
   * 清除历史记录
   */
  public clearHistory(): void {
    this.notifications.clear()
    this.eventBus?.emit('notification:clear', {})
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `notification-${++this.idCounter}-${Date.now()}`
  }
}

// 服务标识符
export const NOTIFICATION_SERVICE_TOKEN = Symbol('NotificationService')
