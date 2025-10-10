# 安装部署

## 本地开发

### 环境要求

- **Node.js**: 16.0 或更高版本
- **pnpm**: 8.0 或更高版本（推荐）
- **Git**: 用于版本控制

### 安装 Node.js

#### macOS

```bash
# 使用 Homebrew
brew install node

# 或使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Windows

下载并安装 [Node.js](https://nodejs.org/)

或使用 Chocolatey:

```powershell
choco install nodejs
```

#### Linux

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 或使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

### 安装 pnpm

```bash
# 使用 npm
npm install -g pnpm

# 或使用 Homebrew (macOS)
brew install pnpm

# 或使用脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### 克隆项目

```bash
# 克隆仓库
git clone https://github.com/你的用户名/CVBuilder.git
cd CVBuilder

# 或使用 SSH
git clone git@github.com:你的用户名/CVBuilder.git
cd CVBuilder
```

### 安装依赖

```bash
# 安装项目依赖
pnpm install
```

这会安装所有必要的依赖包，包括：

- React 和 React DOM
- TypeScript
- Vite
- Zustand
- react-dnd
- 等等...

### 启动开发服务器

```bash
pnpm run dev
```

开发服务器将在 `http://localhost:5173` 启动。

### 开发命令

```bash
# 开发模式（热重载）
pnpm run dev

# 构建生产版本
pnpm run build

# 预览生产构建
pnpm run preview

# 代码检查
pnpm run lint

# 严格代码检查
pnpm run lint:strict

# 类型检查
pnpm run type-check

# 代码格式化
pnpm run format

# 检查代码格式
pnpm run format:check
```

## 生产部署

### 构建项目

```bash
# 设置环境变量（可选）
export NODE_ENV=production

# 构建
pnpm run build
```

构建产物位于 `dist/` 目录。

### 部署到静态服务器

构建完成后，将 `dist/` 目录的内容部署到任何静态文件服务器：

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/CVBuilder/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Apache

在 `dist/` 目录创建 `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 部署到 Vercel

1. 安装 Vercel CLI:

```bash
npm install -g vercel
```

2. 部署:

```bash
cd CVBuilder
vercel
```

3. 按照提示完成部署

或者直接通过 [Vercel Dashboard](https://vercel.com) 导入 GitHub 仓库。

### 部署到 Netlify

#### 方法 1: 拖拽部署

1. 访问 [Netlify](https://app.netlify.com)
2. 将 `dist/` 目录拖拽到部署区域

#### 方法 2: Git 集成

1. 连接 GitHub 仓库
2. 设置构建命令: `pnpm run build`
3. 设置发布目录: `dist`
4. 部署

#### 方法 3: CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 构建
pnpm run build

# 部署
netlify deploy --prod --dir=dist
```

### 部署到 GitHub Pages

项目已配置自动部署，只需：

```bash
# 推送到 main 分支
git push origin main
```

GitHub Actions 会自动构建并部署到 `https://你的用户名.github.io/CVBuilder/`

#### 手动部署

```bash
# 构建
pnpm run build

# 部署到 gh-pages 分支
npx gh-pages -d dist
```

### 部署到自己的服务器

```bash
# 在本地构建
pnpm run build

# 使用 rsync 上传
rsync -avz --delete dist/ user@your-server:/var/www/cvbuilder/

# 或使用 scp
scp -r dist/* user@your-server:/var/www/cvbuilder/
```

## Docker 部署

### 创建 Dockerfile

在项目根目录创建 `Dockerfile`:

```dockerfile
# 构建阶段
FROM node:18-alpine as build

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建
RUN pnpm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=build /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 创建 nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 构建和运行

```bash
# 构建镜像
docker build -t cvbuilder .

# 运行容器
docker run -d -p 80:80 cvbuilder
```

### Docker Compose

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  cvbuilder:
    build: .
    ports:
      - '80:80'
    restart: unless-stopped
```

运行:

```bash
docker-compose up -d
```

## 环境变量

在项目根目录创建 `.env` 文件:

```env
# 应用基础路径
VITE_BASE_URL=/

# API 地址（如果有）
VITE_API_URL=https://api.example.com

# 其他配置
VITE_APP_NAME=CVBuilder
```

在代码中使用:

```typescript
const baseUrl = import.meta.env.VITE_BASE_URL
const apiUrl = import.meta.env.VITE_API_URL
```

## 性能优化

### 生产构建优化

在 `vite.config.ts` 中:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'editor-vendor': ['zustand', 'immer'],
          'dnd-vendor': ['react-dnd', 'react-dnd-html5-backend'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
```

### 启用压缩

```bash
# 构建时启用 gzip
pnpm run build

# 服务器端启用 Brotli 压缩
```

### CDN 加速

将静态资源上传到 CDN:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
      } else {
        return `https://cdn.example.com/${filename}`
      }
    },
  },
})
```

## 故障排查

### 端口被占用

如果 5173 端口被占用:

```bash
# 修改端口
pnpm run dev -- --port 3000

# 或在 vite.config.ts 中设置
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### 依赖安装失败

```bash
# 清理缓存
pnpm store prune

# 删除 node_modules 和锁文件
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install
```

### 构建失败

```bash
# 检查 TypeScript 错误
pnpm run type-check

# 检查 ESLint 错误
pnpm run lint

# 清理构建缓存
rm -rf dist
pnpm run build
```

### 内存不足

```bash
# 增加 Node.js 内存限制
NODE_OPTIONS=--max-old-space-size=4096 pnpm run build
```

## 监控和日志

### 错误监控

集成 Sentry:

```bash
pnpm add @sentry/react @sentry/tracing
```

```typescript
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
})
```

### 性能监控

使用 Web Vitals:

```bash
pnpm add web-vitals
```

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

## 更新和维护

### 更新依赖

```bash
# 检查过期的包
pnpm outdated

# 更新所有依赖
pnpm update

# 更新特定包
pnpm update react react-dom
```

### 安全审计

```bash
# 检查安全漏洞
pnpm audit

# 自动修复
pnpm audit --fix
```

## 相关文档

- [快速开始](./quick-start.md)
- [基础使用](./basic-usage.md)
- [架构概览](./architecture.md)

