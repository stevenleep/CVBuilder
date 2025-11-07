/**
 * LCEdit Core - 核心协议层
 * 
 * 提供完整的低代码平台协议定义、类型系统、工具函数和常量
 * 
 * @packageDocumentation
 * @version 1.0.0
 */

// ==================== 协议层 ====================

/**
 * 导出所有协议定义
 * 
 * 包括物料、扩展、命令、数据、渲染、事件、插件、历史和服务协议
 */
export * from './protocols'

// ==================== 类型系统（选择性导出，避免与协议冲突） ====================

/**
 * 导出通用类型定义（避免与协议冲突）
 */
export type {
  // 基础类型
  SemanticVersion,
  I18nString,
  Timestamp,
  UUID,
  URL,
  Color,
  JSONValue,
  JSONObject,
  JSONArray,
  
  // 元数据类型
  ProtocolMetadata,
  ExtensionProps,
  DeprecationInfo,
  ResourceReference,
  
  // 几何类型
  Position,
  Size,
  Rectangle,
  Spacing,
  
  // 结果类型
  Result,
  Success,
  Failure,
  Optional,
  AsyncResult,
  
  // 验证类型（已在 utils/validation 中导出）
  // ValidationResult,
  // ValidationError,
  // ValidationWarning,
  
  // 资源释放（使用协议中的定义）
  // Disposable,
  // Subscription,
  
  // 权限和安全
  Permission,
  PermissionLevel,
  SecurityContext,
  
  // 分页
  PaginationParams,
  PaginatedResult,
  
  // 工具类型
  DeepReadonly,
  DeepPartial,
  ExtractType,
  OmitStrict,
  RequireProps,
  Constructor,
  AbstractConstructor,
  AnyFunction,
  AsyncFunction,
  Callback,
  Predicate,
  Comparator,
  Mapper,
  Reducer,
} from './types'

// 导出常量
export { EMPTY_OBJECT, EMPTY_ARRAY, NOOP, IDENTITY } from './types'

// ==================== 工具函数 ====================

/**
 * 导出工具函数（避免与协议冲突）
 * 
 * 包括验证、安全、序列化等工具
 */
export {
  // 验证工具（类型已在 protocols 中导出）
  validators,
  RequiredValidator,
  TypeValidator,
  LengthValidator,
  RangeValidator,
  PatternValidator,
  EnumValidator,
  EmailValidator,
  UrlValidator,
  ValidatorChain,
  ValidatorUnion,
  createValidationResult,
  mergeValidationResults,
  
  // 安全工具
  PermissionChecker,
  InputSanitizer,
  SimpleEncryption,
  TokenParser,
  CSPBuilder,
  SecurityAuditor,
  RateLimiter,
  generateRandomString,
  generateUUID,
  hashString,
  secureCompare,
  
  // 序列化工具
  JSONSerializer,
  deepClone,
  deepEqual,
  deepMerge,
  flatten,
  unflatten,
  getByPath,
  setByPath,
  deleteByPath,
  base64Encode,
  base64Decode,
  isPlainObject,
  isEmptyObject,
  isEmptyArray,
  isEmpty,
} from './utils'

// 导出工具类型（不与协议冲突的部分）
export type {
  Validator,
  ValidationContext,
  ValidationOptions,
  // ValidationResult, // 使用 types/common 中的
  // ValidationError, // 使用 types/common 中的
  // ValidationWarning, // 使用 types/common 中的
  SecurityAuditLog,
  SerializationOptions,
  DeserializationOptions,
  DeepCloneOptions,
} from './utils'

// ==================== 常量定义（选择性导出，避免冲突） ====================

/**
 * 导出常量定义（避免与协议冲突）
 */
export {
  PROTOCOL_URI_PREFIX,
  // PROTOCOL_VERSION, // 使用协议中的版本
  // BuiltInEvents, // 使用协议中的定义
  // BuiltInCommands, // 使用协议中的定义  
  // BuiltInServices, // 使用协议中的定义
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
  Constants,
} from './constants'

// ==================== 服务层 ====================

/**
 * 导出核心服务
 */
export {
  // DIContainer
  DIContainer,
  createDIContainer,
  getGlobalContainer,
  setGlobalContainer,
  resetGlobalContainer,
  
  // EventBus
  EventBus,
  createEventBus,
  getGlobalEventBus,
  setGlobalEventBus,
  resetGlobalEventBus,
  
  // MaterialRegistry
  MaterialRegistry,
  createMaterialRegistry,
  getGlobalMaterialRegistry,
  setGlobalMaterialRegistry,
  resetGlobalMaterialRegistry,
  
  // RendererRegistry
  RendererRegistry,
  createRendererRegistry,
  getGlobalRendererRegistry,
  setGlobalRendererRegistry,
  resetGlobalRendererRegistry,
  
  // CommandService
  CommandService,
  createCommandService,
  getGlobalCommandService,
  setGlobalCommandService,
  resetGlobalCommandService,
  
  // StateManager
  StateManager,
  createStateManager,
  getGlobalStateManager,
  setGlobalStateManager,
  resetGlobalStateManager,
  selectNode,
  selectNodes,
  selectSelectedNodes,
  selectRootNodes,
  selectChildren,
  loggerMiddleware,
  performanceMiddleware,
  validationMiddleware,
  
  // HistoryService
  HistoryService,
  createHistoryService,
  getGlobalHistoryService,
  setGlobalHistoryService,
  resetGlobalHistoryService,
  
  // PluginManager
  PluginManager,
  createPluginManager,
  getGlobalPluginManager,
  setGlobalPluginManager,
  resetGlobalPluginManager,
  
  // 核心服务汇总
  createCoreServices,
} from './services'

// 重新导出服务相关类型（避免冲突）
export type {
  CoreServices,
  CoreServicesOptions,
  // Material Registry
  IMaterialRegistry,
  MaterialRegistryStats,
  // Renderer Registry
  IRendererRegistry,
  RendererRegistryStats,
  // State Manager
  IStateManager,
  EditorState,
  WritableEditorState,
  EditorNode,
  WritableEditorNode,
  EditorMode,
  StateSelector,
  StateUpdater,
  StateListener,
  StateMiddleware,
} from './services'

// 重新导出协议接口类型
export type {
  // Event Bus (from protocols)
  IEventBus,
  // History Service (from protocols)
  IHistoryService,
  // Command Service (from protocols)
  ICommandRegistry,
  // Plugin Manager (from protocols)
  IPluginManager,
} from './protocols'

// ==================== 版本信息 ====================

/**
 * 框架版本
 */
export const LCEDIT_VERSION = '1.0.0' as const

/**
 * 框架名称
 */
export const LCEDIT_NAME = 'LCEdit' as const

/**
 * 框架描述
 */
export const LCEDIT_DESCRIPTION = 'A powerful low-code/no-code platform framework' as const

