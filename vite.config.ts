import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'images/**/*'],
      manifest: {
        name: 'PolarCraft - 偏振光下的新世界',
        short_name: 'PolarCraft',
        description: '偏振光教学互动平台 - Interactive Polarized Light Education Platform',
        theme_color: '#0a0a15',
        background_color: '#0a0a15',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/images/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/images/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/images/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // 新版本立即生效，无需等待用户关闭所有标签页
        skipWaiting: true,
        clientsClaim: true,
        // 预缓存构建产物（JS/CSS）
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // 运行时缓存策略
        runtimeCaching: [
          {
            // 图片和视频等大文件：缓存优先，但有过期时间
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|mp4|webm)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'media-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30天
              },
            },
          },
          {
            // Google Fonts 等外部资源
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1年
              },
            },
          },
        ],
        // 导航请求使用 NetworkFirst，确保总是获取最新HTML
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        // 清理旧缓存
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // 3D rendering (Three.js ecosystem - largest chunk)
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          // Animation library
          'vendor-motion': ['framer-motion'],
          // State management and i18n
          'vendor-utils': ['zustand', 'i18next', 'react-i18next'],
        },
      },
    },
  },
});
