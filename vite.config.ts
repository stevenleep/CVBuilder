import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 优先使用环境变量，如果没有设置则根据模式决定
  const base = process.env.VITE_BASE_PATH !== undefined 
    ? process.env.VITE_BASE_PATH 
    : (mode === 'production' ? '/CVBuilder/' : '/')
  
  return {
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // 改为prompt模式，让用户确认更新
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'CVKit 专业在线简历工具',
        short_name: 'CVKit',
        description: 'CVKit是一款免费的在线简历制作工具，提供可视化拖拽编辑、多种精美主题模板、实时预览、一键导出PDF等功能。让简历创作回归简单，助您快速打造专业简历。',
        theme_color: '#18181b',
        background_color: '#18181b',
        display: 'standalone',
        orientation: 'portrait',
        scope: base,
        start_url: base,
        categories: ['business', 'productivity', 'utilities'],
        icons: [
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: '新建简历',
            short_name: '新建',
            description: '创建一份新的简历',
            url: base + 'editor',
            icons: [{ src: 'favicon.svg', sizes: 'any' }]
          },
          {
            name: '我的简历',
            short_name: '简历',
            description: '查看我的简历列表',
            url: base + 'resumes',
            icons: [{ src: 'favicon.svg', sizes: 'any' }]
          },
          {
            name: '模板中心',
            short_name: '模板',
            description: '浏览简历模板',
            url: base + 'templates',
            icons: [{ src: 'favicon.svg', sizes: 'any' }]
          }
        ]
      },
      workbox: {
        // 配置缓存策略
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        // 运行时缓存策略
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        // 清理过期的缓存
        cleanupOutdatedCaches: true,
        // 跳过等待，立即激活新的 service worker
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: true, // 开发环境也启用 PWA
        type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@engine': path.resolve(__dirname, './src/engine'),
    },
  },
  build: {
    // 分包优化
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'editor-core': ['zustand', 'react-dnd', 'react-dnd-html5-backend'],
          'export-tools': ['html2canvas', 'jspdf', 'jszip'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}})
