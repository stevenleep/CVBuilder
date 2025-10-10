# 存储 API

CVBuilder 使用 IndexedDB 作为本地存储方案，提供持久化的数据存储。

## IndexedDBService

单例服务，封装了所有 IndexedDB 操作。

### 类型定义

```typescript
class IndexedDBService {
  private db: IDBDatabase | null = null
  private dbName = 'cv-builder'
  private dbVersion = 1

  async init(): Promise<void>
  async setItem(storeName: string, key: string, value: unknown): Promise<void>
  async getItem<T>(storeName: string, key: string): Promise<T | null>
  async removeItem(storeName: string, key: string): Promise<void>
  async clear(storeName: string): Promise<void>
  async getAllKeys(storeName: string): Promise<string[]>
  async getAllValues<T>(storeName: string): Promise<T[]>
}
```

### 数据库结构

```
Database: cv-builder (version 1)
  ├── Store: editor-state
  │   └── Key: 'resume-data'
  │       └── Value: { pageSchema, canvasConfig, ... }
  │
  ├── Store: templates
  │   └── Key: template-id
  │       └── Value: { id, name, schema, ... }
  │
  └── Store: resume-templates
      └── Key: resume-template-id
          └── Value: { id, name, pageSchema, ... }
```

## 使用方法

### 初始化

服务会自动初始化，但也可以手动初始化：

```typescript
import { indexedDBService } from '@/utils/indexedDB'

await indexedDBService.init()
```

### 存储数据

```typescript
import { indexedDBService, STORES } from '@/utils/indexedDB'

// 保存编辑器状态
await indexedDBService.setItem(STORES.EDITOR_STATE, 'resume-data', {
  pageSchema,
  selectedNodeIds,
  canvasConfig,
  // ...其他状态
})

// 保存模板
await indexedDBService.setItem(STORES.TEMPLATES, templateId, {
  id: templateId,
  name: 'My Template',
  schema: nodeSchema,
  createdAt: Date.now(),
})
```

### 读取数据

```typescript
// 读取编辑器状态
const editorState = await indexedDBService.getItem(STORES.EDITOR_STATE, 'resume-data')

if (editorState) {
  console.log('恢复编辑器状态:', editorState)
}

// 读取模板
const template = await indexedDBService.getItem(STORES.TEMPLATES, templateId)
```

### 删除数据

```typescript
// 删除特定模板
await indexedDBService.removeItem(STORES.TEMPLATES, templateId)

// 清空所有模板
await indexedDBService.clear(STORES.TEMPLATES)
```

### 列出所有数据

```typescript
// 获取所有模板 ID
const templateIds = await indexedDBService.getAllKeys(STORES.TEMPLATES)

// 获取所有模板数据
const templates = await indexedDBService.getAllValues(STORES.TEMPLATES)

templates.forEach(template => {
  console.log(template.name, template.createdAt)
})
```

## Store 定义

### STORES 枚举

```typescript
export enum STORES {
  EDITOR_STATE = 'editor-state',
  TEMPLATES = 'templates',
  RESUME_TEMPLATES = 'resume-templates',
}
```

### editor-state

存储编辑器的当前状态。

**Key**: `'resume-data'`

**Value**:

```typescript
{
  pageSchema: PageSchema
  selectedNodeIds: string[]
  canvasConfig: {
    scale: number
    showGrid: boolean
    snapToGrid: boolean
  }
  mode: 'edit' | 'preview'
}
```

### templates

存储组件模板（单个物料或组件组合）。

**Key**: `template-id` (UUID)

**Value**:

```typescript
{
  id: string
  name: string
  description?: string
  schema: NodeSchema
  thumbnail?: string
  createdAt: number
  updatedAt: number
  tags?: string[]
}
```

### resume-templates

存储完整的简历模板。

**Key**: `resume-template-id` (UUID)

**Value**:

```typescript
{
  id: string
  name: string
  description?: string
  pageSchema: PageSchema
  thumbnail?: string
  createdAt: number
  updatedAt: number
  tags?: string[]
  author?: string
}
```

## 错误处理

IndexedDB 操作可能失败，应该进行适当的错误处理：

```typescript
try {
  await indexedDBService.setItem(STORES.EDITOR_STATE, 'resume-data', state)
} catch (error) {
  console.error('保存失败:', error)
  // 显示错误提示给用户
  notification.error('保存失败，请重试')
}
```

## 数据迁移

当数据结构变化时，可以实现版本迁移：

```typescript
// 在 init() 方法中处理升级
const request = indexedDB.open(this.dbName, this.dbVersion)

request.onupgradeneeded = event => {
  const db = (event.target as IDBOpenDBRequest).result
  const oldVersion = event.oldVersion

  // 从 v1 升级到 v2
  if (oldVersion < 2) {
    // 创建新的 store
    if (!db.objectStoreNames.contains('new-store')) {
      db.createObjectStore('new-store')
    }
  }

  // 从 v2 升级到 v3
  if (oldVersion < 3) {
    // 迁移数据
    const transaction = (event.target as IDBOpenDBRequest).transaction
    const oldStore = transaction?.objectStore('old-store')
    // ... 迁移逻辑
  }
}
```

## 备份和恢复

### 导出数据

```typescript
async function exportAllData() {
  const editorState = await indexedDBService.getItem(STORES.EDITOR_STATE, 'resume-data')

  const templates = await indexedDBService.getAllValues(STORES.TEMPLATES)

  const resumeTemplates = await indexedDBService.getAllValues(STORES.RESUME_TEMPLATES)

  const backup = {
    version: 1,
    timestamp: Date.now(),
    data: {
      editorState,
      templates,
      resumeTemplates,
    },
  }

  // 下载为 JSON 文件
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `cvbuilder-backup-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
}
```

### 导入数据

```typescript
async function importData(backupFile: File) {
  const text = await backupFile.text()
  const backup = JSON.parse(text)

  // 恢复编辑器状态
  if (backup.data.editorState) {
    await indexedDBService.setItem(STORES.EDITOR_STATE, 'resume-data', backup.data.editorState)
  }

  // 恢复模板
  if (backup.data.templates) {
    for (const template of backup.data.templates) {
      await indexedDBService.setItem(STORES.TEMPLATES, template.id, template)
    }
  }

  // 恢复简历模板
  if (backup.data.resumeTemplates) {
    for (const template of backup.data.resumeTemplates) {
      await indexedDBService.setItem(STORES.RESUME_TEMPLATES, template.id, template)
    }
  }

  console.log('数据导入完成')
}
```

## 性能优化

### 1. 批量操作

使用事务进行批量操作：

```typescript
async function saveMultipleTemplates(templates: Template[]) {
  const db = await indexedDBService.getDB()
  const transaction = db.transaction([STORES.TEMPLATES], 'readwrite')
  const store = transaction.objectStore(STORES.TEMPLATES)

  const promises = templates.map(
    template =>
      new Promise((resolve, reject) => {
        const request = store.put(template, template.id)
        request.onsuccess = () => resolve(template.id)
        request.onerror = () => reject(request.error)
      })
  )

  await Promise.all(promises)
}
```

### 2. 索引

为常用查询添加索引：

```typescript
request.onupgradeneeded = event => {
  const db = (event.target as IDBOpenDBRequest).result

  // 创建 store 并添加索引
  const templateStore = db.createObjectStore(STORES.TEMPLATES)
  templateStore.createIndex('name', 'name', { unique: false })
  templateStore.createIndex('createdAt', 'createdAt', { unique: false })
  templateStore.createIndex('tags', 'tags', { multiEntry: true })
}

// 使用索引查询
async function searchByTag(tag: string) {
  const db = await indexedDBService.getDB()
  const transaction = db.transaction([STORES.TEMPLATES], 'readonly')
  const store = transaction.objectStore(STORES.TEMPLATES)
  const index = store.index('tags')

  return new Promise((resolve, reject) => {
    const request = index.getAll(tag)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
```

### 3. 限制存储大小

监控存储使用情况：

```typescript
async function getStorageInfo() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate()

    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
    }
  }

  return null
}

// 使用
const info = await getStorageInfo()
if (info && info.percentage > 90) {
  console.warn('存储空间即将用完')
}
```

## 浏览器兼容性

IndexedDB 在所有现代浏览器中都得到支持：

- ✅ Chrome 24+
- ✅ Firefox 16+
- ✅ Safari 10+
- ✅ Edge 12+

对于不支持的浏览器，可以降级到 localStorage：

```typescript
function isIndexedDBSupported(): boolean {
  return 'indexedDB' in window
}

if (!isIndexedDBSupported()) {
  // 使用 localStorage 作为后备方案
  console.warn('IndexedDB 不支持，使用 localStorage')
}
```

## 最佳实践

### 1. 定期保存

不要等到用户点击保存按钮，而是定期自动保存：

```typescript
// 在 editorStore 中
let saveTimeout: NodeJS.Timeout

const debouncedSave = () => {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(async () => {
    await saveToStorage()
  }, 2000) // 2秒后保存
}

// 在状态更新时调用
setState(draft => {
  // 更新状态
  draft.pageSchema = newSchema
}, debouncedSave)
```

### 2. 错误恢复

实现错误恢复机制：

```typescript
async function safeLoad() {
  try {
    await loadFromStorage()
  } catch (error) {
    console.error('加载失败，尝试恢复备份:', error)

    try {
      await loadBackup()
    } catch (backupError) {
      console.error('备份加载也失败:', backupError)
      // 使用默认状态
      resetToDefault()
    }
  }
}
```

### 3. 数据验证

存储前验证数据：

```typescript
function validateSchema(schema: any): boolean {
  if (!schema || typeof schema !== 'object') return false
  if (!schema.id || !schema.type) return false
  // ... 更多验证
  return true
}

async function safeSetItem(store: string, key: string, value: any) {
  if (!validateSchema(value)) {
    throw new Error('数据格式不正确')
  }

  await indexedDBService.setItem(store, key, value)
}
```

## 相关文档

- [编辑器 API](./editor-api.md)
- [架构概览](../guide/architecture.md)
- [基础使用](../guide/basic-usage.md)
