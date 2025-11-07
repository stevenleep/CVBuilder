# @lcedit/core

LCEdit 低代码平台的核心协议层。

## 概述

`@lcedit/core` 提供了一套完整的、框架无关的协议体系，用于构建工业级的低代码/无代码平台。

## 协议体系

### 1. 物料协议（Material Protocol）

定义可复用的 UI 组件，包括元数据、属性、能力、生命周期等。

**位置**: `src/protocols/material/MaterialProtocol.ts`

**核心接口**:
- `IMaterialDefinition`: 物料的完整定义
- `IMaterialMetadata`: 物料元数据
- `IMaterialCapabilities`: 物料能力
- `IMaterialSlot`: 插槽定义
- `IMaterialEvent`: 事件定义
- `IMaterialMethod`: 方法定义
- `IMaterialLifecycle`: 生命周期钩子

### 2. 扩展协议（Extension Protocol）

定义扩展系统，支持插件、主题、物料包等。

**位置**: `src/protocols/extension/ExtensionProtocol.ts`

**核心接口**:
- `ExtensionManifest`: 扩展清单
- `ExtensionContributions`: 贡献点
- `ActivationEvent`: 激活事件
- `CommandContribution`: 命令贡献
- `MenuContributions`: 菜单贡献
- `ViewContributions`: 视图贡献

### 3. 命令协议（Command Protocol）

定义命令系统，提供统一的操作执行机制。

**位置**: `src/protocols/command/CommandProtocol.ts`

**核心接口**:
- `CommandDefinition`: 命令定义
- `CommandExecutor`: 命令执行器
- `CommandExecutionContext`: 执行上下文
- `ICommandRegistry`: 命令注册表

### 4. 数据协议（Data Protocol）

定义数据源、数据绑定、数据流等数据管理能力。

**位置**: `src/protocols/data/DataProtocol.ts`

**核心接口**:
- `DataSourceDefinition`: 数据源定义
- `DataBinding`: 数据绑定
- `DataVariable`: 数据变量
- `DataFlow`: 数据流
- `DataQuery`: 数据查询
- `DataOperation`: 数据操作

### 5. 渲染协议（Renderer Protocol）

定义如何将物料渲染成实际的 UI 组件。

**位置**: `src/protocols/renderer/RendererProtocol.ts`

**核心接口**:
- `RendererDefinition`: 渲染器定义
- `RenderContext`: 渲染上下文
- `ComponentRenderer`: 组件渲染器
- `PropertyFieldRenderer`: 属性字段渲染器
- `IRendererRegistry`: 渲染器注册表

## 使用方式

```typescript
import {
  IMaterialDefinition,
  ExtensionManifest,
  CommandDefinition,
  DataSourceDefinition,
  RendererDefinition,
  PROTOCOL_VERSION,
} from '@lcedit/core/protocols'

// 定义一个物料
const buttonMaterial: IMaterialDefinition = {
  $id: 'com.example.button',
  $version: { major: 1, minor: 0, patch: 0 },
  metadata: {
    type: 'Button',
    title: { en: 'Button', 'zh-CN': '按钮' },
    category: { en: 'Basic', 'zh-CN': '基础' },
    icon: 'button',
  },
  propertiesSchema: {
    /* JSON Schema */
  },
  defaultProps: {
    text: 'Click Me',
    variant: 'primary',
  },
  renderers: {
    react: {
      $refType: 'renderer',
      $refId: 'lcedit.renderer.react.default',
    },
  },
}
```

## Schema 定义

`src/schemas/` 目录包含 JSON Schema 定义，用于验证数据结构。

- `property.schema.json`: 属性字段的 JSON Schema 定义

## 设计原则

1. **框架无关**: 核心协议不依赖任何 UI 框架
2. **类型安全**: 完整的 TypeScript 类型定义
3. **标准兼容**: 遵循 JSON Schema、OpenAPI 等标准
4. **高度可扩展**: 通过 `x-` 前缀支持自定义扩展
5. **国际化支持**: 所有文本都支持多语言

## 版本

当前版本: **1.0.0**

## 文档

完整文档请参见 `/docs/refactor/` 目录：

- `V3_ARCHITECTURE_COMPLETE.md`: 完整架构设计
- `IMPLEMENTATION_ROADMAP.md`: 实现路线图
- `LOWCODE_PLATFORM_DESIGN.md`: 低代码平台设计
- `PROTOCOL_STANDARDS.md`: 协议设计标准

## 许可证

MIT

