/**
 * 图片批量压缩脚本
 *
 * 策略（保证清晰度优先）：
 *   Design 图 — 缩至 max 1600px → WebP 质量 88（弹窗最大 780px，Retina 也足够）
 *   Thinking 长图 — 保持原尺寸 → WebP 质量 90（含文字内容，需高清）
 *   首页背景 — 保持原尺寸 → WebP 质量 85（暗色调图片可压更多）
 *   其他图片 — 保持原尺寸 → WebP 质量 85
 *
 * 用法：node scripts/optimize-images.js
 * 备份：原始文件会保留在同一目录，扩展名前加 .bak（如 .png.bak）
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC = path.resolve(__dirname, '../public/images')

// ══════════════════════════════════════════
// 配置
// ══════════════════════════════════════════
const RULES = [
  {
    dir: 'design',
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 88,
    desc: '设计作品图',
  },
  {
    dir: 'thinking',
    maxWidth: null,  // 不缩放，保持原尺寸
    maxHeight: null,
    quality: 90,
    desc: 'Thinking 长图（含文字）',
  },
]

// 根目录图片（首页背景等）
const ROOT_RULES = {
  maxWidth: null,
  maxHeight: null,
  quality: 85,
  desc: '首页背景',
}

// 支持的格式
const INPUT_EXTS = ['.png', '.jpg', '.jpeg']
const SKIP_WEBP = true // 跳过已有的 .webp 文件

// ══════════════════════════════════════════
// 统计
// ══════════════════════════════════════════
const stats = { total: 0, skipped: 0, done: 0, savedBytes: 0 }

// ══════════════════════════════════════════
// 单文件压缩
// ══════════════════════════════════════════
async function optimizeFile(filePath, { maxWidth, maxHeight, quality }) {
  const originalSize = fs.statSync(filePath).size
  const ext = path.extname(filePath).toLowerCase()
  const baseName = path.basename(filePath, ext)
  const dir = path.dirname(filePath)
  const webpPath = path.join(dir, `${baseName}.webp`)

  // 跳过已有的 webp
  if (SKIP_WEBP && fs.existsSync(webpPath)) {
    stats.skipped++
    return null
  }

  let pipeline = sharp(filePath)

  // 获取原图尺寸
  const meta = await pipeline.metadata()

  // 缩放（仅当超过限制时等比缩小）
  const needsResize =
    (maxWidth && meta.width > maxWidth) ||
    (maxHeight && meta.height > maxHeight)

  if (needsResize) {
    pipeline = pipeline.resize({
      width: maxWidth || undefined,
      height: maxHeight || undefined,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  // 输出 WebP
  await pipeline
    .webp({ quality, effort: 6 })
    .toFile(webpPath)

  const newSize = fs.statSync(webpPath).size
  const saved = originalSize - newSize
  stats.savedBytes += saved
  stats.done++

  return {
    file: path.relative(PUBLIC, filePath),
    original: (originalSize / 1024).toFixed(0) + 'KB',
    webp: (newSize / 1024).toFixed(0) + 'KB',
    saved: saved > 0 ? `-${(saved / 1024).toFixed(0)}KB (${((saved / originalSize) * 100).toFixed(0)}%)` : 'unchanged',
    resized: needsResize ? `${meta.width}×${meta.height} → ${maxWidth || 'auto'}×${maxHeight || 'auto'}` : '保持原尺寸',
  }
}

// ══════════════════════════════════════════
// 批量处理目录（含子目录递归）
// ══════════════════════════════════════════
async function optimizeDir(dirPath, rule) {
  if (!fs.existsSync(dirPath)) return []

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  const results = []

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      // 递归子目录
      const subResults = await optimizeDir(fullPath, rule)
      results.push(...subResults)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (!INPUT_EXTS.includes(ext)) continue
      try {
        const result = await optimizeFile(fullPath, rule)
        if (result) results.push(result)
        stats.total++
      } catch (err) {
        console.error(`  ✗ ${entry.name}: ${err.message}`)
      }
    }
  }
  return results
}

// ══════════════════════════════════════════
// 主流程
// ══════════════════════════════════════════
async function main() {
  console.log('🖼  图片压缩优化\n')
  console.log('策略：高质量 WebP，保证清晰度\n')

  const allResults = []

  // 处理子目录（design / thinking）
  for (const rule of RULES) {
    const dirPath = path.join(PUBLIC, rule.dir)
    console.log(`📁 ${rule.dir}/ — ${rule.desc}`)
    console.log(`   质量: ${rule.quality} | 最大尺寸: ${rule.maxWidth || '原寸'}×${rule.maxHeight || '原寸'}`)

    const results = await optimizeDir(dirPath, rule)
    allResults.push(...results)

    if (results.length > 0) {
      results.forEach(r => {
        console.log(`   ${r.file}`)
        console.log(`   ${r.original} → ${r.webp} ${r.saved} | ${r.resized}`)
      })
    }
    console.log(`   处理 ${stats.done} 张，跳过 ${stats.skipped} 张\n`)
  }

  // 处理根目录（首页背景等）
  console.log(`📁 images/ — ${ROOT_RULES.desc}`)
  const rootFiles = fs.readdirSync(PUBLIC).filter(f => {
    const ext = path.extname(f).toLowerCase()
    return INPUT_EXTS.includes(ext)
  })
  for (const file of rootFiles) {
    const filePath = path.join(PUBLIC, file)
    try {
      const result = await optimizeFile(filePath, ROOT_RULES)
      if (result) {
        allResults.push(result)
        console.log(`   ${result.file}`)
        console.log(`   ${result.original} → ${result.webp} ${result.saved} | ${result.resized}`)
      }
      stats.total++
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`)
    }
  }

  // 汇总
  console.log('═'.repeat(50))
  console.log(`\n✅ 完成：处理 ${stats.total} 个文件，压缩 ${stats.done} 个`)
  if (stats.skipped > 0) console.log(`⏭  跳过 ${stats.skipped} 个（已有 .webp）`)
  const savedMB = (stats.savedBytes / 1024 / 1024).toFixed(1)
  console.log(`💾 节省空间：${savedMB} MB`)
  console.log('\n📝 后续步骤：')
  console.log('   1. 检查生成的 .webp 文件')
  console.log('   2. 更新数据文件中的图片路径（.png/.jpg → .webp）')
  console.log('   3. 确认无误后可删除原始大文件')
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
