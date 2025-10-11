import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/CVBuilder/' : '/',
  plugins: [react()],
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
}))
