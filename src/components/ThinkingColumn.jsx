import { motion } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'

// ══════════════════════════════════════════
// 单张卡片
// ══════════════════════════════════════════
function HCard({ item, onClick }) {
  return (
    <motion.div
      className="thinking-card group flex-shrink-0 w-72 cursor-pointer p-5 rounded-2xl
                 border border-white/[0.04] bg-white/[0.03]
                 hover:bg-white/[0.10] hover:border-white/20
                 relative flex flex-col transition-all duration-300"
      style={{ zIndex: 1 }}
      onClick={(e) => {
        e.stopPropagation()
        const rect = e.currentTarget.getBoundingClientRect()
        onClick(item, rect)
      }}
    >
      {/* hover 高亮底层 */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                   transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: 'rgba(255,255,255,0.04)',
          boxShadow: '0 0 40px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.3)',
        }}
      />

      {/* 内容层 */}
      <div className="relative z-[1] flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-white/85 text-sm leading-relaxed flex-1 line-clamp-2
                         group-hover:text-white/95 transition-colors">
            {item.title}
          </h3>
          <span className="flex-shrink-0 ml-2 text-white/20 group-hover:text-white/50 transition-colors text-xs">
            →
          </span>
        </div>

        <p className="text-xs text-white/35 leading-relaxed mb-3 flex-1 line-clamp-2">
          {item.excerpt}
        </p>

        <div className="flex items-center justify-between h-6 flex-shrink-0">
          <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-[9px] rounded-full bg-white/8 text-white/40
                                         whitespace-nowrap flex-shrink-0">
                {tag}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-white/20 whitespace-nowrap flex-shrink-0 ml-2">
            {item.date}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ══════════════════════════════════════════
// 横向滚动列（rAF 驱动 + 拖拽）
// ══════════════════════════════════════════
export default function ThinkingColumn({ data, speed = 2, offset = 0, onCardClick, hideTitle = false }) {
  const duplicated = [...data.items, ...data.items, ...data.items]
  const [paused, setPaused] = useState(false)

  // ── 滚动引擎 refs ──
  const scrollElRef = useRef(null)
  const animRef = useRef(null)
  const scrollPos = useRef(offset ? offset * -180 : 0)
  const velocity = useRef(0)
  const autoSpeedRef = useRef(0)
  const setWidthRef = useRef(0)

  // ── 拖拽 refs ──
  const isDragging = useRef(false)
  const hasMoved = useRef(false)
  const captured = useRef(false)
  const dragStart = useRef({ x: 0, pos: 0 })
  const lastMove = useRef({ x: 0, time: 0 })

  // ── paused 同步到 ref（rAF 内读取避免闭包陈旧）──
  const pausedRef = useRef(false)
  useEffect(() => { pausedRef.current = paused }, [paused])

  // ── 测量内容宽度 → 计算自动滚动速度 ──
  useEffect(() => {
    if (scrollElRef.current) {
      const total = scrollElRef.current.scrollWidth
      setWidthRef.current = total / 3
      // 原 CSS 动画：240/speed 秒完成 1 套 → 换算 px/s
      autoSpeedRef.current = total > 0 ? (total / 3) * speed / 240 : 0
    }
  }, [data.items.length, speed])

  // ══════════════════════════════════════════
  // rAF 循环：自动滚动 + 惯性 + 拖拽跟随
  // ══════════════════════════════════════════
  useEffect(() => {
    let lastTime = performance.now()

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      if (isDragging.current) {
        // 拖拽中 — 不自动滚动，位置由 move 回调直接写入
      } else if (Math.abs(velocity.current) > 0.5) {
        // 惯性滑行
        scrollPos.current -= velocity.current * dt
        velocity.current *= 0.94
      } else if (!pausedRef.current) {
        // 匀速自动滚动
        velocity.current = 0
        scrollPos.current -= autoSpeedRef.current * dt
      }

      // 无缝循环回绕
      const sw = setWidthRef.current
      if (sw > 0) {
        while (scrollPos.current < -sw) scrollPos.current += sw
        while (scrollPos.current > 0) scrollPos.current -= sw
      }

      // 写入 DOM（避免 React 每帧 render）
      if (scrollElRef.current) {
        scrollElRef.current.style.transform = `translate3d(${scrollPos.current}px, 0, 0)`
      }

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  // ══════════════════════════════════════════
  // 指针事件 — 拖拽
  // ══════════════════════════════════════════
  const down = useCallback((e) => {
    e.preventDefault()
    isDragging.current = true
    hasMoved.current = false
    captured.current = false
    dragStart.current = { x: e.clientX, pos: scrollPos.current }
    lastMove.current = { x: e.clientX, time: performance.now() }
  }, [])

  const move = useCallback((e) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStart.current.x

    if (Math.abs(dx) > 3) {
      hasMoved.current = true
      // 确认是拖拽后才捕获指针 — 保证点击事件正常
      if (!captured.current) {
        try { e.currentTarget.setPointerCapture(e.pointerId); captured.current = true } catch (_) {}
      }
    }

    scrollPos.current = dragStart.current.pos + dx

    const now = performance.now()
    const dt = now - lastMove.current.time
    if (dt > 0) {
      velocity.current = ((e.clientX - lastMove.current.x) / dt) * 1000
    }
    lastMove.current = { x: e.clientX, time: now }
  }, [])

  const up = useCallback((e) => {
    isDragging.current = false
    try {
      if (captured.current) {
        e.currentTarget.releasePointerCapture(e.pointerId)
        captured.current = false
      }
    } catch (_) {}
  }, [])

  // ══════════════════════════════════════════
  // 渲染
  // ══════════════════════════════════════════
  return (
    <div className="relative scroll-row">
      {/* 行标题（可选隐藏） */}
      {!hideTitle && (
        <div className="flex items-center gap-3 mb-3 px-1">
          <h2 className="text-lg font-bold font-display text-white/85 whitespace-nowrap">
            {data.title}
          </h2>
          <span className="text-xs text-white/25 uppercase tracking-wider whitespace-nowrap">
            {data.subtitle}
          </span>
          <div className="flex-1 h-px bg-white/8 ml-4" />
        </div>
      )}

      {/* 滚动容器 — 拖拽 + 悬停暂停 */}
      <div
        className="relative overflow-hidden scroll-container py-8 -my-8
                   cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: 'none', overscrollBehavior: 'none' }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={scrollElRef}
          className="flex gap-4"
          style={{
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {duplicated.map((item, i) => (
            <HCard
              key={`${item.id}-${i}`}
              item={item}
              onClick={onCardClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
