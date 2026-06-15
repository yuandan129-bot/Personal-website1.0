import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

// ══════════════════════════════════════════
// 解析 fullExcerpt → 正文 + 分点总结
// ══════════════════════════════════════════
function parseExcerpt(fullExcerpt) {
  if (!fullExcerpt) return { intro: '', points: [] }

  const lines = fullExcerpt.split('\n').filter((l) => l.trim())
  const points = []
  const introLines = []
  let inPoints = false

  for (const line of lines) {
    // 匹配 "1." "2." 或 "1、" "2、" 开头的分点行
    const match = line.match(/^(\d+)[.、．]\s*(.+)/)
    if (match) {
      inPoints = true
      points.push({ num: parseInt(match[1]), text: match[2].trim() })
    } else if (!inPoints) {
      introLines.push(line)
    } else {
      // 分点后的附加说明，追加到最后一点
      if (points.length > 0) {
        points[points.length - 1].text += '\n' + line
      }
    }
  }

  return { intro: introLines.join('\n'), points }
}

// ══════════════════════════════════════════
// 图片内容区
// ══════════════════════════════════════════
function ImageArea({ item }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.title}
        className="w-full block"
      />
    )
  }
  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-gray-50" style={{ minHeight: '200px' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
        className="text-gray-300">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
      <span className="text-xs text-gray-300 tracking-wider">文字内容</span>
    </div>
  )
}

// ══════════════════════════════════════════
export default function ThinkingModal({ item, originRect, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const animConfig = useMemo(() => {
    if (!originRect) {
      return { transformOrigin: '50% 50%', initial: { opacity: 0, scale: 0.93, y: 40 } }
    }
    const cardCX = originRect.left + originRect.width / 2
    const cardCY = originRect.top + originRect.height / 2
    const originX = (cardCX / window.innerWidth) * 100
    const originY = (cardCY / window.innerHeight) * 100
    const modalW = Math.min(680, window.innerWidth - 32)
    const modalH = window.innerHeight * 0.85
    const scaleX = originRect.width / modalW
    const scaleY = originRect.height / modalH
    return {
      transformOrigin: `${originX}% ${originY}%`,
      initial: { opacity: 0, scale: Math.max(0.2, Math.min(scaleX, scaleY)) },
    }
  }, [originRect])

  // 解析全文为正文 + 分点
  const { intro, points } = useMemo(
    () => parseExcerpt(item?.fullExcerpt),
    [item?.fullExcerpt],
  )

  if (!item) return null

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      <motion.div
        className="relative w-full max-w-[680px] max-h-[92vh] flex flex-col overflow-hidden
                   bg-white rounded-[20px]
                   shadow-[0_8px_60px_rgba(0,0,0,0.25),0_2px_12px_rgba(0,0,0,0.10)]"
        style={{ transformOrigin: animConfig.transformOrigin }}
        initial={animConfig.initial}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: animConfig.initial.scale, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Home 指示条 */}
        <div className="flex-shrink-0 flex justify-center pt-3.5 pb-1">
          <div className="w-28 h-1.5 rounded-full bg-gray-300" />
        </div>

        {/* 固定头部 */}
        <div className="flex-shrink-0 flex flex-col text-center px-10 pt-6 pb-5">
          <h2 className="text-2xl font-bold text-gray-900 tracking-wide mb-1.5 leading-snug">
            {item.title}
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-lg mx-auto mb-4">
            {item.excerpt}
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {item.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-[11px] text-gray-400 rounded-full
                                           bg-gray-50 border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-[11px] text-gray-300 tracking-wider ml-2 whitespace-nowrap">
              {item.date}
            </span>
          </div>
        </div>

        {/* 可滚动内容区 */}
        <div className="flex-1 overflow-y-auto px-10 pb-8">
          {/* 图片 */}
          {item.image && (
            <div className="rounded-lg overflow-hidden mb-6">
              <ImageArea item={item} />
            </div>
          )}

          {/* 正文引言 */}
          {intro && (
            <div className="text-sm text-gray-500 leading-relaxed whitespace-pre-line max-w-lg mx-auto mb-6">
              {intro}
            </div>
          )}

          {/* ══════════════════════════════════════ */}
          {/* 本期小结 */}
          {/* ══════════════════════════════════════ */}
          {points.length > 0 && (
            <div className="bg-gray-50 rounded-xl px-6 py-5 mb-6 max-w-lg mx-auto">
              {/* 标题行 */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-700">本期小结</h3>
                <span className="text-[10px] text-gray-300 tracking-wider whitespace-nowrap ml-4">
                  本总结由 AI 自动生成
                </span>
              </div>

              {/* 分点列表 */}
              <div className="flex flex-col gap-2.5">
                {points.map((p) => (
                  <div key={p.num} className="flex items-start gap-2.5">
                    <span
                      className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                      style={{
                        background: 'linear-gradient(135deg, #e0e0e0, #c0c0c0)',
                        fontSize: '9px',
                        fontWeight: 600,
                        color: '#666',
                        lineHeight: 1,
                      }}
                    >
                      {p.num}
                    </span>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 无全文内容时的兜底 */}
          {!item.fullExcerpt && (
            <div className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
              {item.excerpt}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
