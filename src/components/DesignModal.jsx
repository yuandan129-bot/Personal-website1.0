import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getMediaType } from '../data/designs'

// ══════════════════════════════════════════
// 单媒体渲染 — 根据类型自动选择 img / video
// ══════════════════════════════════════════
function MediaItem({ src, alt = '', className = '' }) {
  const type = getMediaType(src)

  if (type === 'video') {
    return (
      <video
        src={src}
        controls
        preload="metadata"
        playsInline
        className={`w-full block ${className}`}
        style={{ background: '#000' }}
      />
    )
  }

  // image / gif 都用 img（浏览器原生支持 GIF 动画）
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full block ${className}`}
      loading="lazy"
    />
  )
}

// ══════════════════════════════════════════
// 媒体内容区 — 可滚动，支持图片 / 视频 / GIF 混合
// ══════════════════════════════════════════
function ImageArea({ project }) {
  // ── 多媒体模式：images 数组可混合图片 + 视频 + GIF ──
  if (project.images && project.images.length > 0) {
    return (
      <div className="flex flex-col gap-1.5">
        {project.images.map((src, idx) => (
          <MediaItem
            key={idx}
            src={src}
            alt={`${project.title} – ${idx + 1}`}
          />
        ))}
      </div>
    )
  }

  // ── 单媒体模式（image / video / GIF 自动检测）──
  if (project.image || project.video) {
    const src = project.video || project.image
    return <MediaItem src={src} alt={project.title} />
  }

  // ── 占位图 ──
  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      style={{
        minHeight: '420px',
        background: `linear-gradient(135deg, ${project.accentColor || '#999'}10 0%, ${project.accentColor || '#999'}05 100%)`,
      }}
    >
      <svg
        width="40" height="40" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
        className="text-gray-300"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span className="text-xs text-gray-300 tracking-wider">媒体占位</span>
    </div>
  )
}

// ══════════════════════════════════════════
export default function DesignModal({ project, originRect, onClose }) {
  // 锁定 body 滚动
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // ESC 关闭
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // ── 从卡片位置展开的动画参数 ──
  const animConfig = useMemo(() => {
    if (!originRect) {
      return {
        transformOrigin: '50% 50%',
        initial: { opacity: 0, scale: 0.93, y: 40 },
      }
    }

    const cardCX = originRect.left + originRect.width / 2
    const cardCY = originRect.top + originRect.height / 2

    const originX = (cardCX / window.innerWidth) * 100
    const originY = (cardCY / window.innerHeight) * 100

    const modalW = Math.min(780, window.innerWidth - 32)
    const modalH = window.innerHeight * 0.85
    const scaleX = originRect.width / modalW
    const scaleY = originRect.height / modalH
    const initialScale = Math.max(0.18, Math.min(scaleX, scaleY))

    return {
      transformOrigin: `${originX}% ${originY}%`,
      initial: { opacity: 0, scale: initialScale },
    }
  }, [originRect])

  // ── 副标题（取第一句，不超过 80 字）──
  const subtitle = useMemo(() => {
    if (!project.description) return ''
    const firstSentence = project.description.split(/[。！!？?]/)[0]
    if (firstSentence.length > 80) return firstSentence.slice(0, 80) + '…'
    return firstSentence
  }, [project.description])

  if (!project) return null

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* ── 遮罩 ── */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* ── 内容面板（白色卡片）── */}
      <motion.div
        className="relative w-full max-w-[780px] max-h-[92vh] flex flex-col overflow-hidden
                   bg-white rounded-[20px]
                   shadow-[0_8px_60px_rgba(0,0,0,0.25),0_2px_12px_rgba(0,0,0,0.10)]"
        style={{ transformOrigin: animConfig.transformOrigin }}
        initial={animConfig.initial}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: animConfig.initial.scale, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ══════════════════════════════════════════ */}
        {/* ── Home 指示条 ── */}
        {/* ══════════════════════════════════════════ */}
        <div className="flex-shrink-0 flex justify-center pt-3.5 pb-1">
          <div className="w-28 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* ══════════════════════════════════════════ */}
        {/* ── 固定头部：标题 / 副标题 / 标签 ── */}
        {/* ══════════════════════════════════════════ */}
        <div className="flex-shrink-0 flex flex-col items-center text-center px-10 pt-6 pb-5">
          {/* 标题 */}
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide mb-1.5">
            {project.title}
          </h2>

          {/* 副标题（一句话简介）*/}
          {subtitle && (
            <p className="text-sm text-gray-400 leading-relaxed max-w-md mb-4">
              {subtitle}
            </p>
          )}

          {/* 标签组 */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* 分类标签 */}
              {project.category && (
                <span
                  className="px-3 py-1 text-[11px] font-medium rounded-full border"
                  style={{
                    background: `${project.accentColor || '#333'}14`,
                    borderColor: `${project.accentColor || '#333'}28`,
                    color: project.accentColor || '#333',
                  }}
                >
                  {project.category}
                </span>
              )}
              {/* 其他标签 */}
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[11px] text-gray-400 rounded-full
                             bg-gray-50 border border-gray-200"
                >
                  {tag}
                </span>
              ))}
              {/* 年份 */}
              {project.year && (
                <span className="text-[11px] text-gray-300 tracking-wider ml-1">
                  {project.year}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════ */}
        {/* ── 可滚动图片区 ── */}
        {/* ══════════════════════════════════════════ */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ paddingLeft: '15px', paddingRight: '15px', paddingBottom: '30px' }}
        >
          <div className="overflow-hidden">
            <ImageArea project={project} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
