import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

/**
 * 构建后剔除 dist 中的 .png / .jpg 原始文件
 *
 * 规则：如果同一目录下存在同名的 .webp 文件，则删除 .png 和 .jpg。
 * 这样本地保留原始大图作为备份，部署产物只发布 .webp 版本。
 */
function stripRawImagesPlugin() {
  return {
    name: 'strip-raw-images',
    closeBundle() {
      const distDir = path.resolve('dist')
      if (!fs.existsSync(distDir)) return

      const removed = []
      function walk(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        const files = entries.filter((e) => e.isFile()).map((e) => e.name)
        const webpSet = new Set(files.filter((f) => f.endsWith('.webp')).map((f) => f.slice(0, -5)))

        for (const name of files) {
          const ext = path.extname(name).toLowerCase()
          if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') continue
          const base = path.basename(name, ext)
          if (webpSet.has(base)) {
            const full = path.join(dir, name)
            fs.unlinkSync(full)
            removed.push(full)
          }
        }

        // 递归子目录
        for (const e of entries) {
          if (e.isDirectory()) walk(path.join(dir, e.name))
        }
      }
      walk(distDir)

      if (removed.length > 0) {
        console.log(`[strip-raw-images] ✓ 已剔除 ${removed.length} 个冗余原始图片（.webp 已存在）`)
      }
    },
  }
}

export default defineConfig(({ mode }) => ({
  // GitHub Pages 部署路径：生产构建时加上 repo 名称作为 base
  base: mode === 'production' ? '/Personal-website1.0/' : '/',
  plugins: [react(), stripRawImagesPlugin()],
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
            if (id.includes('ogl')) {
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
}))
