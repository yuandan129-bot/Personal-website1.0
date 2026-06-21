import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import GlassNav from './components/GlassNav'

// ── 路由级代码分割：每个页面独立 chunk，按需加载 ──
const HomePage        = lazy(() => import('./pages/HomePage'))
const VibeCodingPage  = lazy(() => import('./pages/VibeCodingPage'))
const DesignPage      = lazy(() => import('./pages/DesignPage'))
const ThinkingPage    = lazy(() => import('./pages/ThinkingPage'))
const DetailPage      = lazy(() => import('./pages/DetailPage'))

// ── 页面切换时的轻量 loading ──
function PageLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="sync">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/vibe-coding" element={<VibeCodingPage />} />
            <Route path="/design" element={<DesignPage />} />
            <Route path="/thinking" element={<ThinkingPage />} />
            <Route path="/vibe-coding/:id" element={<DetailPage type="vibe-coding" />} />
            <Route path="/design/:id" element={<DetailPage type="design" />} />
            <Route path="/thinking/:id" element={<DetailPage type="thinking" />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      {/* 全局底部玻璃导航 —— 跨页面持久存在 */}
      <GlassNav />
    </>
  )
}
