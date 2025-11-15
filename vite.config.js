// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock',      // mock 文件夹
      // localEnabled: true,    // 开发环境启用
      localEnabled: false,    // 开发环境启用
    }),
  ],
  server: {
    port: 5173,
  },
})
