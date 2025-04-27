import { createApp } from 'vue'
import 'reset-css'
import './style.css'
import App from './App.vue'
import router from './router/router'
import { createPinia } from 'pinia'

// 创建事件总线
const eventBus = {
  listeners: {},
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  },
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
  },
  emit(event, ...args) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(...args))
    }
  }
}

const app = createApp(App)
const pinia = createPinia()

// 注册全局事件总线
app.config.globalProperties.$eventBus = eventBus

app.use(router)
app.use(pinia)
app.mount('#app')
