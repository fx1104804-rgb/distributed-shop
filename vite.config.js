// vite.config.js
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import { viteMockServe } from 'vite-plugin-mock'

// export default defineConfig({
//   plugins: [
//     vue(),
//     viteMockServe({
//       mockPath: 'mock',      // mock 文件夹
//       localEnabled: true,    // 开发环境启用
//       // localEnabled: false,    // 开发环境启用
//     }),
//   ],
//   server: {
//     port: 5173,
//   },
// })
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { viteMockServe } from 'vite-plugin-mock'   // 直接注释掉

export default defineConfig({
  plugins: [
    vue(),
    // mock 已关闭（彻底禁用）
    // viteMockServe({
    //   mockPath: 'mock',
    //   localEnabled: false,
    // }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      }
    }
  }
})
