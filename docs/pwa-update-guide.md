# PWA更新机制指南

## 概述

本应用使用完善的PWA自动更新机制，确保用户始终使用最新版本的应用，包括代码和PWA配置。

## 更新流程

### 1. 自动检测更新

```
用户打开应用
    ↓
Service Worker检查更新
    ↓
发现新版本 → 触发更新提示
    ↓
用户确认更新
    ↓
下载新资源
    ↓
激活新版本
    ↓
页面自动刷新
```

### 2. 更新触发时机

- **应用启动时**: 自动检查更新
- **定期检查**: 每小时自动检查一次
- **手动刷新**: 用户手动刷新页面时检查

### 3. 更新内容

✅ **代码更新**

- JavaScript代码
- CSS样式
- HTML模板
- 静态资源（图片、字体等）

✅ **PWA配置更新**

- manifest.json（应用名称、图标、快捷方式等）
- Service Worker配置
- 缓存策略

✅ **缓存清理**

- 自动清理过期缓存
- 删除旧版本资源
- 更新缓存版本

## 配置说明

### vite.config.ts配置

```typescript
VitePWA({
  registerType: 'prompt', // 用户确认更新模式
  includeAssets: ['favicon.svg'],
  workbox: {
    // 缓存文件模式
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],

    // 自动清理过期缓存
    cleanupOutdatedCaches: true,

    // 新SW立即接管页面
    clientsClaim: true,

    // 跳过等待，立即激活
    skipWaiting: true,

    // 运行时缓存策略
    runtimeCaching: [
      // 字体缓存1年
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
        },
      },
    ],
  },
})
```

### 关键配置说明

#### registerType: 'prompt'

- **作用**: 发现新版本时显示提示，让用户确认更新
- **好处**:
  - 用户体验更好，不会突然刷新页面
  - 用户可以选择立即更新或稍后更新
  - 避免在用户编辑数据时突然刷新

#### cleanupOutdatedCaches: true

- **作用**: 自动清理旧版本缓存
- **好处**:
  - 节省存储空间
  - 避免缓存冲突
  - 确保使用最新资源

#### skipWaiting: true

- **作用**: 新Service Worker跳过等待，立即激活
- **好处**:
  - 更新速度更快
  - 用户不需要关闭所有标签页

#### clientsClaim: true

- **作用**: 新Service Worker立即接管所有页面
- **好处**:
  - 确保更新立即生效
  - 所有页面使用相同版本

## 用户体验

### 更新提示UI

当检测到新版本时，右上角会显示更新提示：

```
┌─────────────────────────────────┐
│ 🔄 发现新版本                    │
│                                 │
│ 我们已更新应用，请刷新以       │
│ 获取最新功能和修复              │
│                                 │
│ [立即更新]  [稍后]              │
└─────────────────────────────────┘
```

### 用户操作

1. **立即更新**:
   - 立即下载并应用更新
   - 页面自动刷新
   - 更新过程显示"更新中..."

2. **稍后**:
   - 关闭提示
   - 10分钟后再次提示
   - 不影响当前使用

## 开发者指南

### 如何触发更新

#### 1. 代码更新

修改任何源代码后：

```bash
# 构建新版本
npm run build

# 部署到服务器
# 用户下次访问时会自动检测到更新
```

#### 2. PWA配置更新

修改 `vite.config.ts` 中的 `manifest` 配置：

```typescript
manifest: {
  name: 'CVKit 专业在线简历工具', // 修改应用名称
  short_name: 'CVKit',
  theme_color: '#18181b', // 修改主题色
  // ... 其他配置
}
```

构建部署后，用户会收到更新提示。

#### 3. 缓存策略更新

修改 `workbox.runtimeCaching` 配置：

```typescript
runtimeCaching: [
  {
    urlPattern: /^https:\/\/api\.example\.com\/.*/i,
    handler: 'NetworkFirst', // 添加新的缓存策略
    options: {
      cacheName: 'api-cache',
      expiration: {
        maxAgeSeconds: 60 * 60, // 1小时
      },
    },
  },
]
```

### 测试更新流程

#### 方法1: 本地测试

```bash
# 1. 构建初始版本
npm run build
npm run preview

# 2. 在浏览器中打开应用

# 3. 修改代码（如修改package.json版本号）

# 4. 重新构建
npm run build

# 5. 等待几秒，应该看到更新提示
```

#### 方法2: 强制触发更新

在控制台执行：

```javascript
// 手动触发Service Worker更新检查
navigator.serviceWorker.getRegistration().then(reg => {
  if (reg) {
    reg.update()
  }
})
```

#### 方法3: 查看更新日志

打开控制台，查看以 `[PWA]` 开头的日志：

```
[PWA] Service Worker已注册
[PWA] 检查更新...
[PWA] 发现新版本
[PWA] 用户确认更新
[PWA] 更新中...
```

### 调试技巧

#### 1. 查看Service Worker状态

```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => {
    console.log('SW状态:', reg.active?.state)
    console.log('SW脚本:', reg.active?.scriptURL)
  })
})
```

#### 2. 清除所有缓存

```javascript
// 清除所有缓存
caches.keys().then(names => {
  names.forEach(name => caches.delete(name))
})

// 卸载Service Worker
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister())
})

// 刷新页面
location.reload()
```

#### 3. 使用Chrome DevTools

1. 打开 DevTools > Application > Service Workers
2. 查看当前SW状态和版本
3. 使用"Update"按钮手动触发更新
4. 使用"Unregister"卸载SW
5. 查看"Cache Storage"了解缓存内容

## 常见问题

### Q1: 为什么没有看到更新提示？

**可能原因：**

1. 应用代码没有实际变化
2. Service Worker还在检查更新中
3. 浏览器缓存了旧的SW脚本

**解决方案：**

```bash
# 1. 确保代码有变化（如修改版本号）
npm version patch

# 2. 清除浏览器缓存（Ctrl+Shift+Delete）

# 3. 硬刷新页面（Ctrl+Shift+R）

# 4. 检查控制台日志
```

### Q2: 更新后为什么还是旧版本？

**可能原因：**

1. Service Worker缓存未清理
2. 浏览器HTTP缓存
3. CDN缓存未更新

**解决方案：**

```javascript
// 强制刷新（忽略缓存）
location.reload(true)

// 或清除所有缓存后刷新
caches.keys().then(names => {
  Promise.all(names.map(name => caches.delete(name))).then(() => location.reload())
})
```

### Q3: 如何立即强制所有用户更新？

**方法1: 修改package.json版本号**

```json
{
  "version": "1.0.1" // 从1.0.0改为1.0.1
}
```

**方法2: 在代码中添加版本检查**

```typescript
// src/version.ts
export const APP_VERSION = '1.0.1'

// 启动时检查版本
const checkVersion = async () => {
  const response = await fetch('/version.json')
  const { version } = await response.json()

  if (version !== APP_VERSION) {
    // 提示用户更新
    alert('发现新版本，即将刷新页面')
    location.reload()
  }
}
```

### Q4: 更新会丢失用户数据吗？

**不会！**

更新只会替换代码和资源文件，不会影响：

- IndexedDB数据
- localStorage数据
- sessionStorage数据
- 用户上传的文件

但建议在更新前：

```typescript
// 保存用户当前编辑状态
const handleUpdate = async () => {
  // 1. 保存当前数据
  await saveCurrentData()

  // 2. 触发更新
  await updateServiceWorker(true)
}
```

### Q5: 如何回滚到旧版本？

**方法1: 重新部署旧版本代码**

```bash
git checkout v1.0.0
npm run build
# 部署
```

**方法2: 用户手动清除缓存**

```javascript
// 在控制台执行
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister())
})
caches.keys().then(names => {
  names.forEach(name => caches.delete(name))
})
location.reload()
```

## 最佳实践

### 1. 语义化版本号

在 `package.json` 中使用语义化版本：

```json
{
  "version": "1.2.3"
  // 主版本.次版本.补丁版本
}
```

- **主版本**: 不兼容的API修改
- **次版本**: 向后兼容的功能新增
- **补丁版本**: 向后兼容的bug修复

### 2. 更新日志

维护 `CHANGELOG.md` 记录每次更新：

```markdown
## [1.0.1] - 2025-10-13

### 新增

- PWA自动更新功能
- 更新提示UI

### 修复

- 修复安装按钮样式问题
```

### 3. 平滑更新

在合适的时机提示用户更新：

- ❌ 不要在用户正在编辑时强制更新
- ❌ 不要在用户刚打开应用时立即更新
- ✅ 在用户空闲时提示
- ✅ 在用户保存数据后提示

### 4. 监控更新成功率

```typescript
// 追踪更新
const handleUpdate = async () => {
  try {
    await updateServiceWorker(true)

    // 记录成功
    if (window.gtag) {
      window.gtag('event', 'pwa_update_success', {
        version: APP_VERSION,
      })
    }
  } catch (error) {
    // 记录失败
    if (window.gtag) {
      window.gtag('event', 'pwa_update_failed', {
        error: error.message,
      })
    }
  }
}
```

## 参考资源

- [PWA Update Patterns](https://web.dev/service-worker-lifecycle/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**最后更新**: 2025-10-13  
**版本**: 1.0.0
