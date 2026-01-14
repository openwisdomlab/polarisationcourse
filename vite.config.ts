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
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'PolarCraft - 偏振光下的新世界',
        short_name: 'PolarCraft',
        description: '基于偏振光物理的教育游戏平台 - 探索光学奥秘',
        theme_color: '#0a0a15',
        background_color: '#0a0a15',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // 预缓存的资源 - 核心JS/CSS，排除images目录（运行时缓存）
        globPatterns: ['**/*.{js,css,html,ico,svg,woff,woff2}'],
        // 排除大文件、视频和图片（图片使用运行时缓存）
        globIgnores: ['**/videos/**', '**/images/**', '**/node_modules/**'],
        // 允许稍大的文件预缓存（主要是vendor chunks）
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        // 运行时缓存策略
        runtimeCaching: [
          {
            // Three.js 和其他vendor chunks - 长期缓存
            urlPattern: /^.*\/assets\/vendor-.*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'vendor-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1年
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // 图片资源 - Stale While Revalidate
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30天
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // 视频资源 - 按需缓存，Network First
            urlPattern: /\.(?:mp4|webm|ogg)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'videos-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7天
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // 字体文件 - 长期缓存
            urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1年
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // API请求 - Network First
            urlPattern: /^https?:\/\/.*\/api\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5分钟
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 5,
            },
          },
        ],
        // 离线回退
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/],
      },
      devOptions: {
        enabled: false, // 开发时禁用，避免缓存干扰
      },
    }),
  ],
  base: '/', // Use absolute paths for SPA routing compatibility
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
