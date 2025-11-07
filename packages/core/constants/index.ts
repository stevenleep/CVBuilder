/**
 * 常量定义
 * 
 * 提供框架级别的常量定义
 * 
 * @packageDocumentation
 */

// ==================== 协议 URI ====================

/**
 * 协议 URI 前缀
 */
export const PROTOCOL_URI_PREFIX = 'lcedit://protocols' as const

/**
 * 协议版本
 */
export const PROTOCOL_VERSION = '1.0.0' as const

// ==================== 内置事件 ====================

/**
 * 内置事件常量
 */
export const BuiltInEvents = {
  // 编辑器生命周期
  EDITOR_READY: 'editor:ready',
  EDITOR_DESTROY: 'editor:destroy',
  EDITOR_FOCUS: 'editor:focus',
  EDITOR_BLUR: 'editor:blur',
  
  // 节点事件
  NODE_CREATED: 'node:created',
  NODE_UPDATED: 'node:updated',
  NODE_DELETED: 'node:deleted',
  NODE_SELECTED: 'node:selected',
  NODE_DESELECTED: 'node:deselected',
  NODE_MOVED: 'node:moved',
  NODE_RESIZED: 'node:resized',
  NODE_LOCKED: 'node:locked',
  NODE_UNLOCKED: 'node:unlocked',
  
  // 历史事件
  HISTORY_UNDO: 'history:undo',
  HISTORY_REDO: 'history:redo',
  HISTORY_CLEAR: 'history:clear',
  HISTORY_CHANGE: 'history:change',
  
  // 数据事件
  DATA_LOADED: 'data:loaded',
  DATA_SAVED: 'data:saved',
  DATA_CHANGED: 'data:changed',
  DATA_ERROR: 'data:error',
  
  // 插件事件
  PLUGIN_LOADED: 'plugin:loaded',
  PLUGIN_ACTIVATED: 'plugin:activated',
  PLUGIN_DEACTIVATED: 'plugin:deactivated',
  PLUGIN_ERROR: 'plugin:error',
  
  // 命令事件
  COMMAND_EXECUTED: 'command:executed',
  COMMAND_FAILED: 'command:failed',
  
  // UI 事件
  UI_THEME_CHANGED: 'ui:theme:changed',
  UI_LANGUAGE_CHANGED: 'ui:language:changed',
  UI_VIEWPORT_CHANGED: 'ui:viewport:changed',
  
  // 系统事件
  SYSTEM_ERROR: 'system:error',
  SYSTEM_WARNING: 'system:warning',
  SYSTEM_INFO: 'system:info',
} as const

// ==================== 内置命令 ====================

/**
 * 内置命令常量
 */
export const BuiltInCommands = {
  // 编辑器命令
  UNDO: 'editor.undo',
  REDO: 'editor.redo',
  CUT: 'editor.cut',
  COPY: 'editor.copy',
  PASTE: 'editor.paste',
  DELETE: 'editor.delete',
  SELECT_ALL: 'editor.selectAll',
  SAVE: 'editor.save',
  SAVE_AS: 'editor.saveAs',
  OPEN: 'editor.open',
  CLOSE: 'editor.close',
  
  // 节点命令
  NODE_CREATE: 'node.create',
  NODE_DELETE: 'node.delete',
  NODE_DUPLICATE: 'node.duplicate',
  NODE_MOVE: 'node.move',
  NODE_UPDATE: 'node.update',
  NODE_LOCK: 'node.lock',
  NODE_UNLOCK: 'node.unlock',
  NODE_SHOW: 'node.show',
  NODE_HIDE: 'node.hide',
  NODE_GROUP: 'node.group',
  NODE_UNGROUP: 'node.ungroup',
  
  // 视图命令
  VIEW_ZOOM_IN: 'view.zoomIn',
  VIEW_ZOOM_OUT: 'view.zoomOut',
  VIEW_ZOOM_RESET: 'view.zoomReset',
  VIEW_FIT_TO_CONTENT: 'view.fitToContent',
  VIEW_TOGGLE_GRID: 'view.toggleGrid',
  VIEW_TOGGLE_RULERS: 'view.toggleRulers',
  VIEW_TOGGLE_GUIDES: 'view.toggleGuides',
  
  // 导出命令
  EXPORT_PNG: 'export.png',
  EXPORT_SVG: 'export.svg',
  EXPORT_PDF: 'export.pdf',
  EXPORT_JSON: 'export.json',
  EXPORT_HTML: 'export.html',
  
  // 插件命令
  PLUGIN_INSTALL: 'plugin.install',
  PLUGIN_UNINSTALL: 'plugin.uninstall',
  PLUGIN_ENABLE: 'plugin.enable',
  PLUGIN_DISABLE: 'plugin.disable',
  PLUGIN_RELOAD: 'plugin.reload',
  
  // 主题命令
  THEME_CHANGE: 'theme.change',
  THEME_RELOAD: 'theme.reload',
  
  // 帮助命令
  HELP_SHOW: 'help.show',
  HELP_SHORTCUTS: 'help.shortcuts',
  HELP_ABOUT: 'help.about',
  HELP_DOCUMENTATION: 'help.documentation',
} as const

// ==================== 内置服务 ====================

/**
 * 内置服务 ID 常量
 */
export const BuiltInServices = {
  // 核心服务
  EDITOR: 'lcedit.service.editor',
  EVENT_BUS: 'lcedit.service.eventBus',
  COMMAND: 'lcedit.service.command',
  HISTORY: 'lcedit.service.history',
  STATE: 'lcedit.service.state',
  
  // 注册表服务
  MATERIAL_REGISTRY: 'lcedit.service.materialRegistry',
  RENDERER_REGISTRY: 'lcedit.service.rendererRegistry',
  PLUGIN_MANAGER: 'lcedit.service.pluginManager',
  
  // 数据服务
  DATA: 'lcedit.service.data',
  STORAGE: 'lcedit.service.storage',
  
  // UI 服务
  THEME: 'lcedit.service.theme',
  I18N: 'lcedit.service.i18n',
  NOTIFICATION: 'lcedit.service.notification',
  
  // 工具服务
  VALIDATOR: 'lcedit.service.validator',
  SERIALIZER: 'lcedit.service.serializer',
  LOGGER: 'lcedit.service.logger',
} as const

// ==================== 错误代码 ====================

/**
 * 错误代码常量
 */
export const ErrorCodes = {
  // 通用错误
  UNKNOWN_ERROR: 'E001',
  INVALID_ARGUMENT: 'E002',
  NOT_FOUND: 'E003',
  ALREADY_EXISTS: 'E004',
  PERMISSION_DENIED: 'E005',
  
  // 验证错误
  VALIDATION_FAILED: 'E101',
  REQUIRED_FIELD: 'E102',
  INVALID_TYPE: 'E103',
  INVALID_FORMAT: 'E104',
  OUT_OF_RANGE: 'E105',
  
  // 协议错误
  PROTOCOL_ERROR: 'E201',
  PROTOCOL_VERSION_MISMATCH: 'E202',
  PROTOCOL_NOT_SUPPORTED: 'E203',
  
  // 服务错误
  SERVICE_NOT_FOUND: 'E301',
  SERVICE_ALREADY_REGISTERED: 'E302',
  SERVICE_INITIALIZATION_FAILED: 'E303',
  CIRCULAR_DEPENDENCY: 'E304',
  
  // 插件错误
  PLUGIN_NOT_FOUND: 'E401',
  PLUGIN_LOAD_FAILED: 'E402',
  PLUGIN_ACTIVATION_FAILED: 'E403',
  PLUGIN_DEACTIVATION_FAILED: 'E404',
  
  // 命令错误
  COMMAND_NOT_FOUND: 'E501',
  COMMAND_EXECUTION_FAILED: 'E502',
  COMMAND_VALIDATION_FAILED: 'E503',
  
  // 数据错误
  DATA_LOAD_FAILED: 'E601',
  DATA_SAVE_FAILED: 'E602',
  DATA_PARSE_FAILED: 'E603',
  DATA_VALIDATION_FAILED: 'E604',
} as const

// ==================== HTTP 状态码 ====================

/**
 * HTTP 状态码常量
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

// ==================== 默认配置 ====================

/**
 * 默认配置常量
 */
export const DefaultConfig = {
  // 编辑器配置
  EDITOR: {
    MAX_HISTORY_SIZE: 100,
    AUTO_SAVE_INTERVAL: 30000, // 30秒
    DEBOUNCE_DELAY: 300, // 300ms
    THROTTLE_DELAY: 100, // 100ms
  },
  
  // 验证配置
  VALIDATION: {
    MAX_ERRORS: 100,
    ABORT_EARLY: false,
    ALLOW_UNKNOWN: false,
    STRICT: true,
  },
  
  // 安全配置
  SECURITY: {
    MAX_REQUESTS_PER_MINUTE: 60,
    TOKEN_EXPIRATION: 3600000, // 1小时
    SESSION_TIMEOUT: 1800000, // 30分钟
  },
  
  // 性能配置
  PERFORMANCE: {
    MAX_CACHE_SIZE: 100,
    CACHE_TTL: 300000, // 5分钟
    LAZY_LOAD_THRESHOLD: 50,
  },
} as const

// ==================== 文件类型 ====================

/**
 * 支持的文件类型
 */
export const FileTypes = {
  JSON: '.json',
  PNG: '.png',
  SVG: '.svg',
  PDF: '.pdf',
  HTML: '.html',
  CSS: '.css',
  JAVASCRIPT: '.js',
  TYPESCRIPT: '.ts',
} as const

/**
 * MIME 类型
 */
export const MimeTypes = {
  JSON: 'application/json',
  PNG: 'image/png',
  SVG: 'image/svg+xml',
  PDF: 'application/pdf',
  HTML: 'text/html',
  CSS: 'text/css',
  JAVASCRIPT: 'application/javascript',
  TYPESCRIPT: 'application/typescript',
} as const

// ==================== 键盘按键 ====================

/**
 * 键盘按键常量
 */
export const Keys = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  META: 'Meta',
  CTRL: 'Control',
  ALT: 'Alt',
  SHIFT: 'Shift',
} as const

// ==================== 视口模式 ====================

/**
 * 视口模式常量
 */
export const ViewportModes = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile',
  CUSTOM: 'custom',
} as const

/**
 * 视口尺寸预设
 */
export const ViewportSizes = {
  DESKTOP: { width: 1920, height: 1080 },
  TABLET: { width: 768, height: 1024 },
  MOBILE: { width: 375, height: 667 },
} as const

// ==================== 主题模式 ====================

/**
 * 主题模式常量
 */
export const ThemeModes = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const

// ==================== 语言 ====================

/**
 * 支持的语言
 */
export const SupportedLanguages = {
  EN: 'en',
  ZH_CN: 'zh-CN',
  ZH_TW: 'zh-TW',
  JA: 'ja',
  KO: 'ko',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
} as const

// ==================== 导出所有常量 ====================

export const Constants = {
  PROTOCOL_URI_PREFIX,
  PROTOCOL_VERSION,
  BuiltInEvents,
  BuiltInCommands,
  BuiltInServices,
  ErrorCodes,
  HttpStatus,
  DefaultConfig,
  FileTypes,
  MimeTypes,
  Keys,
  ViewportModes,
  ViewportSizes,
  ThemeModes,
  SupportedLanguages,
} as const

