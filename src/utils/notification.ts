/**
 * 通知系统
 *
 * 统一管理所有的提示、确认和输入对话框
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  message: string
  type?: NotificationType
  duration?: number
}

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: NotificationType
}

export interface PromptOptions {
  title?: string
  message: string
  defaultValue?: string
  placeholder?: string
  confirmText?: string
  cancelText?: string
}

type ToastCallback = (options: ToastOptions) => void
type ConfirmCallback = (options: ConfirmOptions) => Promise<boolean>
type PromptCallback = (options: PromptOptions) => Promise<string | null>

class NotificationManager {
  private toastHandler: ToastCallback | null = null
  private confirmHandler: ConfirmCallback | null = null
  private promptHandler: PromptCallback | null = null

  // 注册处理器
  registerToast(handler: ToastCallback) {
    this.toastHandler = handler
  }

  registerConfirm(handler: ConfirmCallback) {
    this.confirmHandler = handler
  }

  registerPrompt(handler: PromptCallback) {
    this.promptHandler = handler
  }

  // Toast 提示
  toast(options: string | ToastOptions) {
    const opts = typeof options === 'string' ? { message: options } : options
    if (this.toastHandler) {
      this.toastHandler(opts)
    }
  }

  success(message: string, duration?: number) {
    this.toast({ message, type: 'success', duration })
  }

  error(message: string, duration?: number) {
    this.toast({ message, type: 'error', duration })
  }

  warning(message: string, duration?: number) {
    this.toast({ message, type: 'warning', duration })
  }

  info(message: string, duration?: number) {
    this.toast({ message, type: 'info', duration })
  }

  // 确认对话框
  async confirm(options: string | ConfirmOptions): Promise<boolean> {
    const opts = typeof options === 'string' ? { message: options } : options
    if (this.confirmHandler) {
      return this.confirmHandler(opts)
    }
    // 降级到原生 confirm
    return window.confirm(opts.message)
  }

  // 输入对话框
  async prompt(options: string | PromptOptions): Promise<string | null> {
    const opts = typeof options === 'string' ? { message: options } : options
    if (this.promptHandler) {
      return this.promptHandler(opts)
    }
    // 降级到原生 prompt
    return window.prompt(opts.message, opts.defaultValue)
  }
}

export const notification = new NotificationManager()

