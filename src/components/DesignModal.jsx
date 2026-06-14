import { useEffect } from 'react'
import { motion } from 'framer-motion'

// ── 设计稿图片展示 ──
function DesignImage({ project, scrollRef }) {
  return (
    <div
      ref={scrollRef}
      className="w-full overflow-y-auto rounded-xl border border-white/[0.06]"
      style={{ maxHeight: '55vh' }}
    >
      {project.image ? (
        <img
          src={project.image}
          alt={project.title}
          className="w-full"
          style={{ display: 'block' }}
        />
      ) : (
        <div
          className="flex items-center justify-center"
          style={{ minHeight: '400px', background: project.color }}
        >
          <span className="text-sm opacity-30" style={{ color: project.accentColor }}>
            暂无图片
          </span>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════
export default function DesignModal({ project, onClose }) {
  // 锁定 body 滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!project) return null

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
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* 内容面板 */}
      <motion.div
        className="relative bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/10
                   shadow-[0_0_100px_rgba(0,0,0,0.6)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        initial={{ opacity: 0, scale: 0.93, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 40 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 头部信息 ── */}
        <div className="flex-shrink-0 px-8 pt-8 pb-4">
          {/* 分类 + 关闭 */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="px-3 py-1 text-[10px] font-semibold rounded-full border tracking-wide"
              style={{
                background: `${(project.accentColor || '#fff')}20`,
                borderColor: `${(project.accentColor || '#fff')}30`,
                color: project.accentColor || '#fff',
              }}
            >
              {project.category}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-white/60
                         hover:bg-white/20 hover:text-white flex items-center justify-center transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* 标题 */}
          <h2 className="text-2xl font-bold font-display text-white/90 mb-1">
            {project.title}
          </h2>

          {/* 年份 + 标签 */}
          <div className="flex items-center gap-3 flex-wrap">
            {project.year && (
              <span className="text-xs text-white/30 tracking-wider">{project.year}</span>
            )}
            {project.tags && project.tags.map((tag) => (
              <span key={tag} className="text-[10px] text-white/35 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── 长图滚动区 ── */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2">
          <DesignImage project={project} />

          {/* 描述 */}
          {project.description && (
            <p className="mt-6 text-sm text-white/50 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
