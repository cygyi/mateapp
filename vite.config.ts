import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'src/mock',
      enable: true,
      watchFiles: true
    })
  ],
  server: {
    port: 5173,
    host: '0.0.0.0',
    open: true
  }
}) 