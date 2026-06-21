import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        // 拆分 vendor 包：React 生态 / 动效库 / 3D 库 各自独立
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion'
            }
            if (id.includes('three') || id.includes('ogl')) {
              return 'vendor-3d'
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui'
            }
            return 'vendor-common'
          }
        },
      },
    },
    // 静态资源按类型分目录
    assetsDir: 'assets',
  },
})
