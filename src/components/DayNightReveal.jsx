import { useState, useRef, useCallback, useEffect } from 'react'
import DayNightToggle from './DayNightToggle'
import LiveClock from './LiveClock'
import SteamEffect from './SteamEffect'
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
  const [expandAnim, setExpandAnim] = useState(null)
  const containerRef = useRef(null)
  const switchRef = useRef(null)
  const animRef = useRef(null)
  // 缓存动画中的遮罩字符串，避免每帧在 render 中重复计算
  const animMaskRef = useRef(EMPTY_MASK)

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

  const startTransition = useCallback((dx, dy, targetDay) => {
    const maxR = Math.sqrt(
      Math.max(dx, DESIGN_W - dx) ** 2 + Math.max(dy, DESIGN_H - dy) ** 2
    )
    const duration = 1600
    const st = performance.now()

    const animate = (time) => {
      const raw = Math.min((time - st) / duration, 1)
      const progress = raw >= 1 ? 1 : 1 - Math.pow(2, -10 * raw)
      const r = targetDay ? progress * maxR : (1 - progress) * maxR

      // 遮罩计算移到 rAF 回调中，render 只读取 ref
      animMaskRef.current = r > 1 ? buildMask(dx, dy, r) : EMPTY_MASK

      // 仍然触发 React 渲染（时钟需要同步），但 mask 不再在 render 里计算
      if (raw < 1) {
        setExpandAnim({ isDayTarget: targetDay })
        animRef.current = requestAnimationFrame(animate)
      } else {
        animMaskRef.current = targetDay ? FULL_MASK : EMPTY_MASK
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
    // 不响应开关区域和视频框内的点击（视频框内有自己的交互）
    if (e.target.closest('[data-switch-container]')) return
    if (e.target.closest('[data-video-frame]')) return
    const { x, y } = toDesign(e.clientX, e.clientY)
    // 动画中取当前动画目标的相反方向，静止时取当前状态的相反方向
    const currentTarget = expandAnim ? expandAnim.isDayTarget : isDay
    startTransition(x, y, !currentTarget)
  }, [isDay, expandAnim, startTransition, toDesign])

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  // 遮罩：动画中读 ref（已预计算），静止时读常量
  const dayMask = expandAnim ? animMaskRef.current : (isDay ? FULL_MASK : EMPTY_MASK)
  // 时钟：动画中跟随目标状态，静止时跟随 isDay
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
        {/* 夜晚图层 */}
        {USE_VIDEO ? (
          <video src="/videos/night.mp4" autoPlay muted loop playsInline disablePictureInPicture
            poster="/images/night.png" className="absolute inset-0 w-full h-full"
          />
        ) : (
          <img src="/images/night.png" alt="" className="absolute inset-0 w-full h-full" draggable={false} />
        )}

        {/* 白天图层 */}
        {USE_VIDEO ? (
          <video src="/videos/day.mp4" autoPlay muted loop playsInline disablePictureInPicture
            poster="/images/day.png" className="absolute inset-0 w-full h-full"
            style={{ maskImage: dayMask, WebkitMaskImage: dayMask }}
          />
        ) : (
          <img src="/images/day.png" alt="" className="absolute inset-0 w-full h-full"
            style={{ maskImage: dayMask, WebkitMaskImage: dayMask }} draggable={false}
          />
        )}

        {/* 视频框 —— 动效容器（day/night 双图层） */}
        <VideoFrame width={755} height={446}
          style={{ left: 'calc(50% - 25px)', top: 'calc(45% - 110px)', transform: 'translate(-50%, -50%)' }}
        >
          <VideoFrameContent isDay={clockIsDay} />
        </VideoFrame>

        {/* 左下角时钟 */}
        <div className="absolute z-20" style={{ left: 'calc(7% + 250px)', bottom: 'calc(20% + 87px)', transform: 'rotate(-2.5deg) scale(1.35)' }}>
          <LiveClock isDay={clockIsDay} />
        </div>

        {/* 茶杯热汽（隐藏） */}
        {false && (
          <SteamEffect width={180} height={280} intensity={0.9} speed={0.8}
            style={{ left: '50%', bottom: '28%', transform: 'translateX(calc(-50% + 320px))' }}
          />
        )}
      </div>

      {/* 右上角开关 */}
      <DayNightToggle checked={isDay} onChange={toggleDayNight} switchRef={switchRef} />
    </>
  )
}
