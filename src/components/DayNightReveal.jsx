import { useState, useRef, useCallback, useEffect } from 'react'
import DayNightToggle from './DayNightToggle'
import LiveClock from './LiveClock'
import VideoFrame from './VideoFrame'
import VideoFrameContent from './VideoFrameContent'

const USE_VIDEO = false
const DESIGN_W = 2322
const DESIGN_H = 1307

const WAVES = [
  { s: 1.22, o: 45, f: 82 }, { s: 1.12, o: 52, f: 83 },
  { s: 1.03, o: 58, f: 84 }, { s: 0.92, o: 66, f: 87 },
  { s: 0.78, o: 74, f: 90 }, { s: 0.60, o: 82, f: 93 },
]

const EMPTY_MASK = 'radial-gradient(circle 0px at 0px 0px, transparent 0%, transparent 100%)'
const FULL_MASK  = 'radial-gradient(circle 9999px at 50% 50%, white 0%, white 100%, transparent 100%)'

function buildMask(ox, oy, r) {
  return WAVES.map(w => {
    const wr = r * w.s
    return `radial-gradient(circle ${wr.toFixed(0)}px at ${ox}px ${oy}px, white 0%, white ${w.o}%, transparent ${w.f}%)`
  }).join(',\n')
}

export default function DayNightReveal() {
  const [isDay, setIsDay] = useState(false)
  const [expandAnim, setExpandAnim] = useState(null)   // 非 null = 动画中，携带 isDayTarget
  const containerRef = useRef(null)
  const switchRef = useRef(null)
  const animRef = useRef(null)
  // ★ 白天图层的 DOM 引用：动画中直接写 mask，绕过 React 重渲染
  const dayImgRef = useRef(null)

  const [layout, setLayout] = useState(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const s = Math.min(vw / DESIGN_W, vh / DESIGN_H)
    return { scale: s, left: (vw - DESIGN_W * s) / 2, top: (vh - DESIGN_H * s) / 2 }
  })

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const s = Math.min(vw / DESIGN_W, vh / DESIGN_H)
      setLayout({ scale: s, left: (vw - DESIGN_W * s) / 2, top: (vh - DESIGN_H * s) / 2 })
    }
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  // ══════════════════════════════════════════
  // ★ 优化后的过渡动画
  //   - 开始：setExpandAnim 一次 → React 渲染（时钟 / VideoFrameContent 开始 CSS transition）
  //   - 中间：直接写 DOM element.style.maskImage → 零 React 开销
  //   - 结束：setExpandAnim(null) + setIsDay → React 渲染一次接管
  //   从 ~90 次 React 重渲染 → 2 次
  // ══════════════════════════════════════════
  const startTransition = useCallback((dx, dy, targetDay) => {
    const maxR = Math.sqrt(
      Math.max(dx, DESIGN_W - dx) ** 2 + Math.max(dy, DESIGN_H - dy) ** 2
    )
    const duration = 1600
    const st = performance.now()
    const dayEl = dayImgRef.current

    // ★ 动画开始：只触发一次 React 渲染，让时钟和视频框开始 CSS transition
    setExpandAnim({ isDayTarget: targetDay })

    const animate = (time) => {
      const raw = Math.min((time - st) / duration, 1)
      // easeOutQuad：比 easeOutCubic 更均匀，不会在最后 10% 时间"卡住"
      const progress = raw >= 1 ? 1 : 1 - Math.pow(1 - raw, 2)
      // 进度 > 99.5% 时直接收尾，避免最后几帧无意义的微变化
      const done = raw >= 1 || progress > 0.995
      const r = targetDay ? progress * maxR : (1 - progress) * maxR

      // ★ 直接写 DOM，零 React 开销
      if (dayEl) {
        const mask = r > 1 ? buildMask(dx, dy, r) : EMPTY_MASK
        dayEl.style.maskImage = mask
        dayEl.style.webkitMaskImage = mask
      }

      if (!done) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        // ★ 动画结束：React 接管
        if (dayEl) {
          const finalMask = targetDay ? FULL_MASK : EMPTY_MASK
          dayEl.style.maskImage = finalMask
          dayEl.style.webkitMaskImage = finalMask
        }
        setExpandAnim(null)
        setIsDay(targetDay)
      }
    }

    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(animate)
  }, [])

  const toggleDayNight = useCallback((checked) => {
    const sw = switchRef.current
    if (!sw || !containerRef.current) { setIsDay(checked); return }
    const sr = sw.getBoundingClientRect()
    const cr = containerRef.current.getBoundingClientRect()
    const dx = (sr.left + sr.width / 2 - cr.left) / layout.scale
    const dy = (sr.top + sr.height / 2 - cr.top) / layout.scale
    startTransition(dx, dy, checked)
  }, [startTransition, layout.scale])

  const toDesign = useCallback((clientX, clientY) => {
    const el = containerRef.current
    if (!el) return { x: 0, y: 0 }
    const r = el.getBoundingClientRect()
    return { x: (clientX - r.left) / layout.scale, y: (clientY - r.top) / layout.scale }
  }, [layout.scale])

  const handleClick = useCallback((e) => {
    if (e.target.closest('[data-switch-container]')) return
    if (e.target.closest('[data-video-frame]')) return
    const { x, y } = toDesign(e.clientX, e.clientY)
    const currentTarget = expandAnim ? expandAnim.isDayTarget : isDay
    startTransition(x, y, !currentTarget)
  }, [isDay, expandAnim, startTransition, toDesign])

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  // 静止时：React 全权控制 mask（通过 style prop）
  // 动画中：dayImgRef 被直接 DOM 操作，style prop 作为初始值
  const staticDayMask = isDay ? FULL_MASK : EMPTY_MASK
  const clockIsDay = expandAnim ? expandAnim.isDayTarget : isDay

  return (
    <>
      <div
        ref={containerRef}
        onClick={handleClick}
        className="absolute cursor-pointer"
        style={{
          width: `${DESIGN_W}px`, height: `${DESIGN_H}px`,
          transform: `scale(${layout.scale})`, transformOrigin: '0 0',
          left: `${layout.left}px`, top: `${layout.top}px`,
          overflow: 'hidden',
        }}
      >
        {/* 夜晚图层 — 始终可见 */}
        {USE_VIDEO ? (
          <video src="/videos/night.mp4" autoPlay muted loop playsInline disablePictureInPicture
            poster="/images/night.webp" className="absolute inset-0 w-full h-full"
          />
        ) : (
          <img src="/images/night.webp" alt="" className="absolute inset-0 w-full h-full" draggable={false} />
        )}

        {/* 白天图层 — mask 控制可见范围 */}
        {USE_VIDEO ? (
          <video ref={dayImgRef} src="/videos/day.mp4" autoPlay muted loop playsInline disablePictureInPicture
            poster="/images/day.webp" className="absolute inset-0 w-full h-full"
            style={{ maskImage: staticDayMask, WebkitMaskImage: staticDayMask }}
          />
        ) : (
          <img ref={dayImgRef} src="/images/day.webp" alt="" className="absolute inset-0 w-full h-full"
            style={{ maskImage: staticDayMask, WebkitMaskImage: staticDayMask }} draggable={false}
          />
        )}

        {/* 视频框 —— 动效容器 */}
        <VideoFrame width={755} height={446}
          style={{ left: 'calc(50% - 25px)', top: 'calc(45% - 110px)', transform: 'translate(-50%, -50%)' }}
        >
          <VideoFrameContent isDay={clockIsDay} />
        </VideoFrame>

        {/* 左下角时钟 */}
        <div className="absolute z-20" style={{ left: 'calc(7% + 250px)', bottom: 'calc(20% + 87px)', transform: 'rotate(-2.5deg) scale(1.35)' }}>
          <LiveClock isDay={clockIsDay} />
        </div>

        {/* SteamEffect 已移除——需要时恢复组件文件并加入 import */}
      </div>

      {/* 右上角开关 */}
      <DayNightToggle checked={isDay} onChange={toggleDayNight} switchRef={switchRef} />
    </>
  )
}
