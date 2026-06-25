import { lazy, Suspense, useEffect, useCallback, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassNav from './components/GlassNav'

// ── 路由级代码分割：每个页面独立 chunk，按需加载 ──
const HomePage        = lazy(() => import('./pages/HomePage'))
const VibeCodingPage  = lazy(() => import('./pages/VibeCodingPage'))
const DesignPage      = lazy(() => import('./pages/DesignPage'))
const ThinkingPage    = lazy(() => import('./pages/ThinkingPage'))
const DetailPage      = lazy(() => import('./pages/DetailPage'))

// ── 预加载状态追踪：避免重复 import ──
const preloaded = new Set()

/**
 * 后台静默预加载页面模块
 * @returns {Promise} 可用于链式等待
 */
function preloadPage(importFn) {
  const key = importFn.toString()
  if (preloaded.has(key)) return Promise.resolve()
  preloaded.add(key)
  return importFn().catch(() => {})
}

// ══════════════════════════════════════════
// 全屏 Loading — 可见性强，带 fade-in 动画
// ══════════════════════════════════════════
function PageLoader() {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center bg-black gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* 三层脉冲圈 */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" />
        <div className="absolute inset-1 rounded-full border border-white/15 animate-pulse" />
        <div className="absolute inset-3 rounded-full bg-white/5" />
        {/* 中心亮点 */}
        <div className="absolute inset-[22px] rounded-full bg-white/10 animate-pulse"
          style={{ animationDelay: '0.3s' }} />
      </div>
      <p className="text-white/25 text-xs tracking-[0.2em] uppercase font-medium">
        Loading
      </p>
    </motion.div>
  )
}

export default function App() {
  const preloadStartedRef = useRef(false)

  // ══════════════════════════════════════════
  // ★ 流水线式后台预加载：一级 → 二级 → 三级
  //    用户任何时候点击都不会卡在下载上
  // ══════════════════════════════════════════
  useEffect(() => {
    if (preloadStartedRef.current) return
    preloadStartedRef.current = true

    // ── 阶段 1：二级页面 — 立即并行预加载 ──
    const level2 = Promise.allSettled([
      preloadPage(() => import('./pages/VibeCodingPage')),
      preloadPage(() => import('./pages/ThinkingPage')),
      preloadPage(() => import('./pages/DesignPage')),
    ])

    // ── 阶段 2：二级全部加载完成后 → 自动开始三级 ──
    level2.then(() => {
      preloadPage(() => import('./pages/DetailPage'))
    })
  }, [])

  // ── 导航 hover 预加载 ──
  const handleNavPreload = useCallback((path) => {
    const map = {
      '/vibe-coding': () => import('./pages/VibeCodingPage'),
      '/design':      () => import('./pages/DesignPage'),
      '/thinking':    () => import('./pages/ThinkingPage'),
    }
    const fn = map[path]
    if (fn) preloadPage(fn)
  }, [])

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vibe-coding" element={<VibeCodingPage />} />
          <Route path="/design" element={<DesignPage />} />
          <Route path="/thinking" element={<ThinkingPage />} />
          <Route path="/vibe-coding/:id" element={<DetailPage type="vibe-coding" />} />
          <Route path="/design/:id" element={<DetailPage type="design" />} />
          <Route path="/thinking/:id" element={<DetailPage type="thinking" />} />
        </Routes>
      </Suspense>

      <GlassNav onPreload={handleNavPreload} />
    </>
  )
}
