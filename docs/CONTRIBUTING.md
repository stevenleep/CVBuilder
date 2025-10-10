# 贡献指南

感谢你考虑为 CVBuilder 做出贡献！

## 贡献方式

你可以通过以下方式为项目做出贡献：

- 🐛 **报告问题** - 发现 bug 或提出功能建议
- 📝 **改进文档** - 修复文档错误或添加示例
- 💻 **提交代码** - 修复 bug 或实现新功能
- 🎨 **贡献物料** - 创建并分享新的物料组件
- 🔌 **开发插件** - 开发有用的编辑器插件
- 🌐 **翻译** - 帮助翻译文档或界面

## 开发环境设置

### 前置要求

- Node.js 16+
- pnpm 8+
- Git

### 克隆和安装

```bash
# 克隆仓库
git clone https://github.com/你的用户名/CVBuilder.git
cd CVBuilder

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev
```

### 项目结构

```
CVBuilder/
├── src/
│   ├── core/           # 核心系统
│   ├── editor/         # 编辑器组件
│   ├── engine/         # 渲染引擎
│   ├── materials/      # 物料组件
│   ├── store/          # 状态管理
│   ├── utils/          # 工具函数
│   └── types/          # 类型定义
├── docs/               # 文档
└── tests/              # 测试
```

## 代码规范

### TypeScript

- 使用 TypeScript 编写所有代码
- 为所有函数和组件添加类型注解
- 避免使用 `any` 类型

```typescript
// ✅ 好
function greet(name: string): string {
  return `Hello, ${name}`
}

// ❌ 不好
function greet(name: any): any {
  return `Hello, ${name}`
}
```

### React

- 优先使用函数组件
- 使用 Hooks 管理状态
- 为复杂组件使用 `React.memo`

```typescript
// ✅ 好
import React, { useState } from 'react'

const MyComponent: React.FC<Props> = ({ title }) => {
  const [count, setCount] = useState(0)

  return <div>{title}: {count}</div>
}

export default React.memo(MyComponent)
```

### 命名规范

- **组件**: PascalCase (`PersonalInfo`, `EditorLayout`)
- **函数**: camelCase (`handleClick`, `updateNodeProps`)
- **常量**: UPPER_SNAKE_CASE (`STORES`, `EVENT_BUS_TOKEN`)
- **文件**: kebab-case (`personal-info.tsx`, `editor-layout.tsx`)

### 代码风格

项目使用 Prettier 格式化代码：

```bash
# 格式化代码
pnpm run format

# 检查格式
pnpm run format:check
```

配置在 `.prettierrc` 中：

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

### Lint

运行 ESLint 检查代码：

```bash
# 检查代码
pnpm run lint

# 自动修复
pnpm run lint --fix
```

## Git 工作流

### 分支命名

- `feature/功能名` - 新功能
- `fix/问题描述` - Bug 修复
- `docs/文档内容` - 文档更新
- `refactor/重构内容` - 代码重构
- `test/测试内容` - 测试相关

示例：

```bash
git checkout -b feature/auto-save-plugin
git checkout -b fix/template-save-error
git checkout -b docs/plugin-api
```

### 提交消息

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<类型>: <描述>

[可选的正文]

[可选的脚注]
```

类型：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建过程或辅助工具的变动

示例：

```bash
git commit -m "feat: 添加自动保存插件"
git commit -m "fix: 修复模板保存失败的问题"
git commit -m "docs: 更新插件 API 文档"
```

### Pull Request

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 推送到你的 Fork
5. 创建 Pull Request

PR 标题格式：

```
[类型] 简短描述

详细说明变更内容
- 变更点1
- 变更点2

关闭 #issue编号（如果有）
```

示例：

```
[Feature] 添加自动保存插件

实现了以下功能：
- 每30秒自动保存编辑器状态
- 监听内容变化
- 提供手动保存命令

关闭 #123
```

## 贡献物料

### 1. 创建物料文件

在 `src/materials/` 目录下创建新文件：

```typescript
// src/materials/custom/MyMaterial.tsx
import React from 'react'
import { IMaterialDefinition } from '@/core/protocols/IMaterialProtocol'

interface MyMaterialProps {
  title?: string
  content?: string
  style?: React.CSSProperties
}

const MyMaterial: React.FC<MyMaterialProps> = ({
  title = '标题',
  content = '内容',
  style
}) => {
  return (
    <div style={style}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  )
}

export const MyMaterialDef: IMaterialDefinition = {
  meta: {
    type: 'MyMaterial',
    title: '我的物料',
    description: '这是一个自定义物料',
    category: 'custom',
    tags: ['自定义'],
    version: '1.0.0'
  },
  component: MyMaterial,
  propsSchema: [
    {
      name: 'title',
      label: '标题',
      type: 'string',
      defaultValue: '标题',
      group: '内容'
    },
    {
      name: 'content',
      label: '内容',
      type: 'textarea',
      defaultValue: '内容',
      group: '内容'
    }
  ],
  defaultProps: {
    title: '标题',
    content: '内容'
  },
  capabilities: {
    copyable: true,
    deletable: true,
    moveable: true,
    canBeChild: true
  }
}
```

### 2. 注册物料

在 `src/materials/index.ts` 中导出：

```typescript
export { MyMaterialDef } from './custom/MyMaterial'
```

### 3. 添加文档

在 `docs/examples/material-examples.md` 中添加使用示例。

### 4. 提交 PR

按照上述 Git 工作流提交 Pull Request。

## 贡献插件

### 1. 创建插件文件

```typescript
// src/plugins/MyPlugin.ts
import { IPlugin } from '@/core/protocols/IPluginProtocol'

export const MyPlugin: IPlugin = {
  meta: {
    id: 'my-plugin',
    name: '我的插件',
    version: '1.0.0',
    description: '插件描述',
    author: '你的名字',
  },

  activate: async context => {
    // 插件逻辑
    console.log('插件激活')
  },

  deactivate: async () => {
    console.log('插件停用')
  },
}
```

### 2. 添加文档

在 `docs/examples/plugin-examples.md` 中添加插件示例。

### 3. 提交 PR

提交 Pull Request 并说明插件的功能和用途。

## 测试

### 运行测试

```bash
# 运行所有测试
pnpm run test

# 运行特定测试
pnpm run test -- MyComponent

# 生成覆盖率报告
pnpm run test:coverage
```

### 编写测试

```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const onClick = jest.fn()
    render(<MyComponent onClick={onClick} />)

    screen.getByRole('button').click()
    expect(onClick).toHaveBeenCalled()
  })
})
```

## 文档贡献

### 改进文档

文档位于 `docs/` 目录：

```
docs/
├── README.md              # 文档首页
├── guide/                 # 用户指南
│   ├── quick-start.md
│   ├── basic-usage.md
│   └── ...
├── api/                   # API 文档
│   ├── editor-api.md
│   ├── material-api.md
│   └── ...
└── examples/              # 示例
    ├── material-examples.md
    └── ...
```

### 文档规范

- 使用 Markdown 格式
- 添加代码示例
- 包含实际用例
- 保持简洁明了

### 示例模板

````markdown
# 功能名称

## 概述

简短描述功能的作用。

## 使用方法

\```typescript
// 代码示例
const example = 'code'
\```

## 参数说明

| 参数 | 类型   | 说明     |
| ---- | ------ | -------- |
| name | string | 参数说明 |

## 示例

### 基础用法

\```typescript
// 完整示例
\```

## 注意事项

- 注意点1
- 注意点2

## 相关链接

- [相关文档](./related.md)
````

## 行为准则

### 友善和尊重

- 尊重所有贡献者
- 友好和建设性的反馈
- 包容不同观点

### 专业性

- 聚焦于问题本身
- 接受建设性批评
- 优雅地处理分歧

## 获取帮助

如有疑问，可以通过以下方式获取帮助：

- 📖 查看[文档](./README.md)
- 💬 提出 [Issue](https://github.com/你的用户名/CVBuilder/issues)
- 💌 发送邮件到 your-email@example.com

## License

通过贡献代码，你同意将贡献内容按照项目的 MIT License 进行授权。

---

再次感谢你的贡献！🎉
