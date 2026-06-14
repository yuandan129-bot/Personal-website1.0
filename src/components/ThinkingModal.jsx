import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function ThinkingModal({ item, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!item) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* 内容面板 — 加粗边框 */}
      <motion.div
        className="relative bg-neutral-950/95 backdrop-blur-2xl rounded-3xl
                   border-2 border-white/15
                   shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)]
                   w-full max-w-xl max-h-[88vh] flex flex-col overflow-hidden"
        initial={{ opacity: 0, scale: 0.93, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 40 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 头部：关闭 + 日期 + 标题 + 标签 ── */}
        <div className="flex-shrink-0 px-8 pt-8 pb-4 border-b border-white/[0.06]">
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10
                       border border-white/20 text-white/50 hover:text-white hover:bg-white/20
                       flex items-center justify-center transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* 日期 */}
          <span className="text-[11px] text-white/25 tracking-wider">{item.date}</span>

          {/* 标题 */}
          <h2 className="text-xl font-bold font-display text-white/90 mt-2 leading-snug">
            {item.title}
          </h2>

          {/* 标签 */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {item.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 text-[10px] font-medium rounded-full
                                         bg-white/[0.06] text-white/40 border border-white/[0.08]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── 图片内容区 ── */}
        {item.image && (
          <div className="flex-1 overflow-y-auto">
            <img
              src={item.image}
              alt={item.title}
              className="w-full object-contain"
            />
          </div>
        )}

        {/* 如果没有图片，显示文字 */}
        {!item.image && (
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="text-sm text-white/50 leading-relaxed whitespace-pre-line">
              {item.fullExcerpt || item.excerpt}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
