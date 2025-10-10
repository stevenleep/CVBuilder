# 插件开发示例

本文档提供多个实用的插件开发示例。

## 示例 1: 自动保存插件

自动保存编辑器内容到本地存储。

```typescript
import { IPlugin, IPluginContext } from '@/core/protocols/IPluginProtocol'

export const AutoSavePlugin: IPlugin = {
  meta: {
    id: 'auto-save',
    name: '自动保存',
    version: '1.0.0',
    description: '每30秒自动保存编辑器内容',
    author: 'CVBuilder Team',
  },

  activate: async (context: IPluginContext) => {
    let saveInterval: NodeJS.Timeout
    let isDirty = false

    // 监听内容变化
    const unsubscribeUpdate = context.on('node:updated', () => {
      isDirty = true
    })

    const unsubscribeAdd = context.on('node:added', () => {
      isDirty = true
    })

    const unsubscribeDelete = context.on('node:deleted', () => {
      isDirty = true
    })

    // 注册保存命令
    context.registerCommand({
      id: 'auto-save-now',
      name: '立即保存',
      description: '立即保存当前内容',
      icon: '💾',
      execute: async () => {
        const state = context.getState()
        await state.saveToStorage()
        isDirty = false
        context.emit('auto-save:saved', { timestamp: Date.now() })
      },
    })

    // 注册快捷键
    context.registerShortcut({
      key: 'Ctrl+S',
      commandId: 'auto-save-now',
      description: '保存',
      global: true,
    })

    // 启动自动保存
    saveInterval = setInterval(async () => {
      if (isDirty) {
        const state = context.getState()
        await state.saveToStorage()
        isDirty = false
        context.emit('auto-save:saved', { timestamp: Date.now() })
        console.log('[AutoSave] 自动保存完成')
      }
    }, 30000) // 30秒

    // 返回清理函数
    return () => {
      clearInterval(saveInterval)
      unsubscribeUpdate()
      unsubscribeAdd()
      unsubscribeDelete()
    }
  },

  deactivate: async () => {
    console.log('[AutoSave] 插件已停用')
  },
}
```

## 示例 2: 数据统计插件

统计简历中的数据并显示在面板中。

```typescript
import React, { useState, useEffect } from 'react'
import { IPlugin } from '@/core/protocols/IPluginProtocol'
import { findNode } from '@/utils/schema'

// 统计面板组件
const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState({
    totalNodes: 0,
    materialCount: {} as Record<string, number>,
    wordCount: 0
  })

  useEffect(() => {
    const updateStats = () => {
      // 获取编辑器状态并计算统计信息
      // 这里简化处理
      setStats({
        totalNodes: 10,
        materialCount: {
          'PersonalInfo': 1,
          'EducationItem': 2,
          'ExperienceItem': 3
        },
        wordCount: 500
      })
    }

    updateStats()
  }, [])

  return (
    <div style={{ padding: '16px' }}>
      <h3>简历统计</h3>
      <div style={{ marginTop: '16px' }}>
        <p>总节点数: {stats.totalNodes}</p>
        <p>字数: {stats.wordCount}</p>
        <h4 style={{ marginTop: '16px' }}>物料使用情况:</h4>
        <ul>
          {Object.entries(stats.materialCount).map(([type, count]) => (
            <li key={type}>{type}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export const StatsPlugin: IPlugin = {
  meta: {
    id: 'stats',
    name: '数据统计',
    version: '1.0.0',
    description: '统计简历数据'
  },

  activate: async (context) => {
    // 注册统计面板
    context.registerPanel({
      id: 'stats-panel',
      title: '统计',
      position: 'right',
      component: StatsPanel,
      defaultOpen: false,
      icon: '📊'
    })

    // 注册刷新统计命令
    context.registerCommand({
      id: 'refresh-stats',
      name: '刷新统计',
      execute: async () => {
        context.emit('stats:refresh')
      }
    })

    // 监听数据变化
    const unsubscribe = context.on('node:updated', () => {
      context.emit('stats:refresh')
    })

    return () => {
      unsubscribe()
    }
  }
}
```

## 示例 3: 导出增强插件

增强导出功能，支持多种格式。

```typescript
import { IPlugin } from '@/core/protocols/IPluginProtocol'

export const ExportEnhancedPlugin: IPlugin = {
  meta: {
    id: 'export-enhanced',
    name: '导出增强',
    version: '1.0.0',
    description: '支持导出PDF、Word、HTML等格式',
  },

  activate: async context => {
    // 导出 PDF
    context.registerCommand({
      id: 'export-pdf',
      name: '导出 PDF',
      description: '将简历导出为 PDF 文件',
      icon: '📄',
      execute: async () => {
        const state = context.getState()
        // 这里调用 PDF 生成库
        console.log('导出 PDF:', state.pageSchema)
        // 实际实现需要使用 jsPDF 等库
      },
    })

    // 导出 Word
    context.registerCommand({
      id: 'export-word',
      name: '导出 Word',
      description: '将简历导出为 Word 文档',
      icon: '📘',
      execute: async () => {
        const state = context.getState()
        console.log('导出 Word:', state.pageSchema)
        // 实际实现需要使用 docx 等库
      },
    })

    // 导出 HTML
    context.registerCommand({
      id: 'export-html',
      name: '导出 HTML',
      description: '将简历导出为 HTML 页面',
      icon: '🌐',
      execute: async () => {
        const state = context.getState()
        const html = generateHTML(state.pageSchema)
        downloadFile(html, 'resume.html', 'text/html')
      },
    })

    // 注册快捷键
    context.registerShortcut({
      key: 'Ctrl+Shift+P',
      commandId: 'export-pdf',
      description: '导出 PDF',
    })
  },
}

// 辅助函数
function generateHTML(pageSchema: any): string {
  // 生成 HTML 代码
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>简历</title>
        <style>
          body { font-family: Arial, sans-serif; }
        </style>
      </head>
      <body>
        <h1>简历内容</h1>
        <!-- 这里渲染实际内容 -->
      </body>
    </html>
  `
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
```

## 示例 4: 协作评论插件

添加评论和标注功能。

```typescript
import React, { useState } from 'react'
import { IPlugin } from '@/core/protocols/IPluginProtocol'

interface Comment {
  id: string
  nodeId: string
  author: string
  content: string
  timestamp: number
}

// 评论面板组件
const CommentsPanel: React.FC<{ comments: Comment[] }> = ({ comments }) => {
  return (
    <div style={{ padding: '16px' }}>
      <h3>评论 ({comments.length})</h3>
      {comments.map(comment => (
        <div key={comment.id} style={{
          padding: '8px',
          marginTop: '8px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {comment.author} · {new Date(comment.timestamp).toLocaleString()}
          </div>
          <div style={{ marginTop: '4px' }}>{comment.content}</div>
        </div>
      ))}
    </div>
  )
}

export const CommentsPlugin: IPlugin = {
  meta: {
    id: 'comments',
    name: '评论',
    version: '1.0.0',
    description: '添加评论和标注功能'
  },

  activate: async (context) => {
    const comments: Comment[] = []

    // 添加评论命令
    context.registerCommand({
      id: 'add-comment',
      name: '添加评论',
      icon: '💬',
      execute: async (cmdContext) => {
        const { selectedNodeIds } = cmdContext

        if (selectedNodeIds.length === 0) {
          alert('请先选择一个节点')
          return
        }

        const content = prompt('请输入评论内容:')
        if (!content) return

        const comment: Comment = {
          id: `comment-${Date.now()}`,
          nodeId: selectedNodeIds[0],
          author: '用户',
          content,
          timestamp: Date.now()
        }

        comments.push(comment)
        context.emit('comment:added', comment)
      },
      canExecute: (cmdContext) => cmdContext.selectedNodeIds.length > 0
    })

    // 注册快捷键
    context.registerShortcut({
      key: 'Ctrl+Shift+C',
      commandId: 'add-comment',
      description: '添加评论'
    })

    // 注册评论面板
    const PanelWrapper: React.FC = () => (
      <CommentsPanel comments={comments} />
    )

    context.registerPanel({
      id: 'comments-panel',
      title: '评论',
      position: 'right',
      component: PanelWrapper,
      defaultOpen: false,
      icon: '💬'
    })
  }
}
```

## 示例 5: 数据验证插件

验证简历数据的完整性和正确性。

```typescript
import { IPlugin } from '@/core/protocols/IPluginProtocol'
import { findNode } from '@/utils/schema'

interface ValidationRule {
  field: string
  message: string
  validate: (value: any) => boolean
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^1[3-9]\d{9}$/

const rules: ValidationRule[] = [
  {
    field: 'email',
    message: '邮箱格式不正确',
    validate: value => !value || emailRegex.test(value),
  },
  {
    field: 'phone',
    message: '手机号格式不正确',
    validate: value => !value || phoneRegex.test(value.replace(/[-\s]/g, '')),
  },
]

export const ValidationPlugin: IPlugin = {
  meta: {
    id: 'validation',
    name: '数据验证',
    version: '1.0.0',
    description: '验证简历数据的完整性',
  },

  activate: async context => {
    // 验证命令
    context.registerCommand({
      id: 'validate-resume',
      name: '验证简历',
      description: '检查简历数据是否完整正确',
      icon: '✅',
      execute: async () => {
        const state = context.getState()
        const errors: string[] = []

        // 遍历所有节点进行验证
        const validateNode = (node: any) => {
          if (node.type === 'PersonalInfo') {
            rules.forEach(rule => {
              const value = node.props[rule.field]
              if (!rule.validate(value)) {
                errors.push(`${node.type}: ${rule.message}`)
              }
            })
          }

          node.children?.forEach(validateNode)
        }

        validateNode(state.pageSchema.root)

        if (errors.length === 0) {
          alert('✅ 验证通过！')
        } else {
          alert(`❌ 发现 ${errors.length} 个问题:\n\n${errors.join('\n')}`)
        }
      },
    })

    // 注册中间件 - 实时验证
    context.registerMiddleware({
      name: 'validation',
      handle: (mwContext, next) => {
        if (mwContext.action === 'updateNodeProps') {
          const { nodeId, props } = mwContext.payload

          // 实时验证
          for (const rule of rules) {
            if (props[rule.field] !== undefined) {
              if (!rule.validate(props[rule.field])) {
                console.warn(`验证失败: ${rule.message}`)
                // 不取消操作，只是警告
              }
            }
          }
        }

        next()
      },
    })
  },
}
```

## 使用插件

```typescript
import { pluginManager } from '@/core/services/PluginManager'
import { AutoSavePlugin } from './plugins/AutoSavePlugin'
import { StatsPlugin } from './plugins/StatsPlugin'
import { ExportEnhancedPlugin } from './plugins/ExportEnhancedPlugin'
import { CommentsPlugin } from './plugins/CommentsPlugin'
import { ValidationPlugin } from './plugins/ValidationPlugin'

// 注册所有插件
pluginManager.register(AutoSavePlugin)
pluginManager.register(StatsPlugin)
pluginManager.register(ExportEnhancedPlugin)
pluginManager.register(CommentsPlugin)
pluginManager.register(ValidationPlugin)

// 激活插件
async function activatePlugins() {
  await pluginManager.activate('auto-save')
  await pluginManager.activate('stats')
  await pluginManager.activate('export-enhanced')
  await pluginManager.activate('comments')
  await pluginManager.activate('validation')
}

activatePlugins()
```

## 插件开发最佳实践

### 1. 命名规范

- 插件 ID 使用 kebab-case: `my-plugin`
- 命令 ID 使用 kebab-case: `my-command`
- 事件名使用 colon 分隔: `plugin:event`

### 2. 错误处理

```typescript
activate: async (context) => {
  try {
    // 插件逻辑
    context.registerCommand({...})
  } catch (error) {
    console.error('[MyPlugin] 激活失败:', error)
    throw error
  }
}
```

### 3. 资源清理

```typescript
activate: async (context) => {
  const interval = setInterval(() => {...}, 1000)
  const unsubscribe = context.on('event', handler)

  return () => {
    clearInterval(interval)
    unsubscribe()
    // 清理其他资源
  }
}
```

### 4. 类型安全

使用 TypeScript 定义清晰的类型：

```typescript
interface MyPluginConfig {
  autoSave: boolean
  interval: number
}

const config: MyPluginConfig = {
  autoSave: true,
  interval: 30000,
}
```

### 5. 测试

为插件编写测试：

```typescript
describe('AutoSavePlugin', () => {
  it('should save automatically', async () => {
    // 测试逻辑
  })
})
```

## 相关文档

- [插件 API](../api/plugin-api.md)
- [插件开发指南](../guide/plugin-development.md)
- [架构概览](../guide/architecture.md)
