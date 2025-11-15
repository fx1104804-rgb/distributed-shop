import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import router from './router'
import './styles/main.css'

// 引入 Element Plus 图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 1️⃣ 创建 Vue 应用实例
const app = createApp(App)

// 2️⃣ 注册所有 Element Plus 图标为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 3️⃣ 注册 Element Plus、路由并挂载
app.use(ElementPlus).use(router).mount('#app')
