import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import VibeCodingPage from './pages/VibeCodingPage'
import DesignPage from './pages/DesignPage'
import ThinkingPage from './pages/ThinkingPage'
import DetailPage from './pages/DetailPage'
import GlassNav from './components/GlassNav'

export default function App() {
  const location = useLocation()

  return (
    <>
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

      {/* 全局底部玻璃导航 —— 跨页面持久存在 */}
      <GlassNav />
    </>
  )
}
