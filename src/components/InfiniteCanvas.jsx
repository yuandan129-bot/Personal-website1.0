import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { designProjects, getMediaType } from '../data/designs'

const COLS = 6
const COL_W = 254
const ROW_H = 190
const GAP = 12
const TILE_W = COLS * COL_W + (COLS + 1) * GAP
const TARGET_TOTAL = 42   // 目标卡片总数（含介绍卡片，6列×约7行）

// ── Fisher-Yates 洗牌 ──
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── 中心介绍卡片 ──
const INTRO_CARD = {
  id: 'intro',
  isIntro: true,
  size: 'L',
  title: 'Design Works',
  subtitle: '设计作品精选',
  categories: ['品牌设计', '包装设计', '插画', 'UI设计', '活动视觉', '空间设计'],
}

// ── 生成占位卡片 ──
function createPlaceholders(count) {
  const list = []
  for (let i = 0; i < count; i++) {
    list.push({
      id: `placeholder-${i}`,
      isPlaceholder: true,
      size: 'S',
    })
  }
  return list
}

// ── 网格打包 ──
function packGrid(projects) {
  const occupied = new Set()
  const items = []

  // 介绍卡片：L 尺寸（2×2），居中放置（6列中占第2-3列，左右各2列对称）
  const introCol = 2
  const introRow = 2
  for (let r = introRow; r < introRow + 2; r++) {
    for (let c = introCol; c < introCol + 2; c++) {
      occupied.add(`${r}-${c}`)
    }
  }
  items.push({
    ...INTRO_CARD,
    col: introCol, row: introRow, sc: 2, sr: 2,
    w: 2 * COL_W + GAP,
    h: 2 * ROW_H + GAP,
  })

  // 实际项目 + 占位符混合
  const existingCount = projects.length
  const needed = Math.max(0, TARGET_TOTAL - 1 - existingCount) // -1 因为介绍卡片占 1 个位置
  const placeholders = createPlaceholders(needed)
  const allProjects = shuffle([...projects, ...placeholders])

  allProjects.forEach((project) => {
    let sc = 1, sr = 1
    if (project.size === 'L') { sc = 2; sr = 2 }
    else if (project.size === 'M') { sc = 1; sr = 2 }

    let placed = false
    for (let row = 0; row < 30 && !placed; row++) {
      for (let col = 0; col < COLS && !placed; col++) {
        if (col + sc > COLS) continue
        let free = true
        for (let r = row; r < row + sr && free; r++) {
          for (let c = col; c < col + sc && free; c++) {
            if (occupied.has(`${r}-${c}`)) { free = false; break }
          }
        }
        if (free) {
          for (let r = row; r < row + sr; r++) {
            for (let c = col; c < col + sc; c++) {
              occupied.add(`${r}-${c}`)
            }
          }
          items.push({
            ...project,
            col, row, sc, sr,
            w: sc * COL_W + (sc - 1) * GAP,
            h: sr * ROW_H + (sr - 1) * GAP,
          })
          placed = true
        }
      }
    }
  })

  let maxRow = 0
  items.forEach(it => { if (it.row + it.sr > maxRow) maxRow = it.row + it.sr })
  const tileH = maxRow * (ROW_H + GAP) + GAP

  const all = items.map((item) => ({
    ...item,
    x: item.col * (COL_W + GAP) + GAP,
    y: item.row * (ROW_H + GAP) + GAP,
  }))

  return { all, tileH, introCol, introRow }
}

// ── 介绍卡片中心坐标 ──
function getIntroCenter(tileH, introCol, introRow) {
  const cx = introCol * (COL_W + GAP) + GAP + (2 * COL_W + GAP) / 2
  const cy = introRow * (ROW_H + GAP) + GAP + (2 * ROW_H + GAP) / 2
  return { cx, cy }
}

// ══════════════════════════════════════════
// 组件
// ══════════════════════════════════════════
export default function InfiniteCanvas({ onCardClick }) {
  const { all, tileH, introCol, introRow } = useMemo(
    () => packGrid(designProjects),
    [],
  )
  const introCenter = useMemo(
    () => getIntroCenter(tileH, introCol, introRow),
    [tileH, introCol, introRow],
  )

  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - introCenter.cx,
    y: window.innerHeight / 2 - introCenter.cy,
  })

  const isDragging = useRef(false)
  const hasMoved = useRef(false)
  const pointerCaptured = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const animRef = useRef(null)
  const lastMove = useRef({ x: 0, y: 0, time: Date.now() })
  const positionRef = useRef(position)
  useEffect(() => { positionRef.current = position }, [position])

  // ── 边界常量 ──
  const getBounds = useCallback(() => ({
    maxX: 60,
    minX: -(TILE_W - window.innerWidth + 60),
    maxY: 60,
    minY: -(tileH - window.innerHeight + 60),
  }), [tileH])

  // ── 渐进阻力 + 弹簧回弹 ──
  const applyBoundary = useCallback((val, min, max) => {
    const LIMIT = 60   // 自由拖拽边界
    const BUFFER = 20  // 弹性过冲区间
    if (val > max) {
      const over = val - max
      if (over > BUFFER) return max + BUFFER  // 硬上限
      // 指数阻力：越远越难拉
      const t = over / BUFFER
      const resistance = 1 - t * t * 0.85
      return max + over * resistance
    }
    if (val < min) {
      const over = min - val
      if (over > BUFFER) return min - BUFFER
      const t = over / BUFFER
      const resistance = 1 - t * t * 0.85
      return min - over * resistance
    }
    return val
  }, [])

  // ── 弹簧回弹（临界阻尼，不振荡）──
  const springBack = useCallback((val, min, max, vel) => {
    const STIFFNESS = 0.06   // 弹簧刚度（低=软）
    const DAMPING = 0.82     // 速度阻尼（高=快停）
    const SNAP = 1.5         // 在此范围内直接吸附到边界

    if (val > max) {
      const over = val - max
      if (over < SNAP && Math.abs(vel) < 0.5) {
        return { val: max, vel: 0 }  // 吸附归位
      }
      const force = over * STIFFNESS
      // 回弹速度：只向中心方向，避免反向振荡
      const newVel = vel * DAMPING - force
      return { val: val - force, vel: Math.min(newVel, 0) } // 不允许向右的速度
    }
    if (val < min) {
      const over = min - val
      if (over < SNAP && Math.abs(vel) < 0.5) {
        return { val: min, vel: 0 }
      }
      const force = over * STIFFNESS
      const newVel = vel * DAMPING + force
      return { val: val + force, vel: Math.max(newVel, 0) } // 不允许向左的速度
    }
    return { val, vel }
  }, [])

  // ── 惯性 ──
  const applyInertia = useCallback(() => {
    const v = velocity.current
    const th = 0.15
    const bounds = getBounds()
    // 判断是否完全静止
    const atEdgeX = (v.x > 0 && positionRef.current.x >= bounds.maxX - 2) ||
                    (v.x < 0 && positionRef.current.x <= bounds.minX + 2)
    const atEdgeY = (v.y > 0 && positionRef.current.y >= bounds.maxY - 2) ||
                    (v.y < 0 && positionRef.current.y <= bounds.minY + 2)
    const canStopX = Math.abs(v.x) < th || atEdgeX
    const canStopY = Math.abs(v.y) < th || atEdgeY

    if (canStopX && canStopY) {
      // 靠边时做最后的弹簧归位
      const sx = springBack(positionRef.current.x, bounds.minX, bounds.maxX, v.x)
      const sy = springBack(positionRef.current.y, bounds.minY, bounds.maxY, v.y)
      if (Math.abs(sx.val - positionRef.current.x) < 0.1 &&
          Math.abs(sy.val - positionRef.current.y) < 0.1) return
      velocity.current.x = sx.vel
      velocity.current.y = sy.vel
      setPosition({ x: sx.val, y: sy.val })
      animRef.current = requestAnimationFrame(applyInertia)
      return
    }

    v.x *= 0.92
    v.y *= 0.92

    setPosition((prev) => {
      let nx = prev.x + v.x
      let ny = prev.y + v.y

      const sx = springBack(nx, bounds.minX, bounds.maxX, v.x)
      const sy = springBack(ny, bounds.minY, bounds.maxY, v.y)
      nx = sx.val; ny = sy.val
      v.x = sx.vel; v.y = sy.vel

      return { x: nx, y: ny }
    })
    animRef.current = requestAnimationFrame(applyInertia)
  }, [getBounds, springBack])

  const stop = useCallback(() => {
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null }
  }, [])
  useEffect(() => () => stop(), [stop])

  // ── 滚轮 ──
  const onWheel = useCallback((e) => {
    e.preventDefault()
    stop()
    const wx = e.deltaX * 0.8
    const wy = e.deltaY * 0.8
    const bounds = getBounds()
    setPosition((prev) => ({
      x: applyBoundary(prev.x - wx, bounds.minX, bounds.maxX),
      y: applyBoundary(prev.y - wy, bounds.minY, bounds.maxY),
    }))
    velocity.current = { x: -wx * 0.3, y: -wy * 0.3 }
    animRef.current = requestAnimationFrame(applyInertia)
  }, [stop, applyInertia, getBounds, applyBoundary])

  // ── 指针事件 ──
  const down = (e) => {
    e.preventDefault()                              // 阻止浏览器将拖拽识别为返回手势
    // 不在 down 阶段 capture —— 否则子元素 onClick 无法触发
    pointerCaptured.current = false
    stop(); isDragging.current = true; hasMoved.current = false
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { ...positionRef.current }
    lastMove.current = { x: e.clientX, y: e.clientY, time: Date.now() }
  }
  const move = (e) => {
    if (!isDragging.current) return
    const dt = Date.now() - lastMove.current.time
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasMoved.current = true
      // 确认是拖拽后才捕获指针 —— 防止卡片点击失效
      if (!pointerCaptured.current && e.currentTarget.hasPointerCapture?.(e.pointerId) === false) {
        try { e.currentTarget.setPointerCapture(e.pointerId); pointerCaptured.current = true } catch (_) {}
      }
    }
    if (dt > 0) {
      velocity.current = {
        x: ((e.clientX - lastMove.current.x) / dt) * 16,
        y: ((e.clientY - lastMove.current.y) / dt) * 16,
      }
    }
    lastMove.current = { x: e.clientX, y: e.clientY, time: Date.now() }
    // 拖拽时应用渐进阻力边界
    const bounds = getBounds()
    const rawX = posStart.current.x + dx
    const rawY = posStart.current.y + dy
    setPosition({
      x: applyBoundary(rawX, bounds.minX, bounds.maxX),
      y: applyBoundary(rawY, bounds.minY, bounds.maxY),
    })
  }
  const up = (e) => {
    isDragging.current = false
    try { if (pointerCaptured.current) { e.currentTarget.releasePointerCapture(e.pointerId); pointerCaptured.current = false } } catch (_) {}
    if (hasMoved.current) animRef.current = requestAnimationFrame(applyInertia)
  }

  // ── 点击 ──
  const cardClick = (item, e) => {
    if (hasMoved.current) return
    if (item.isPlaceholder) return
    if (item.isIntro) {
      setPosition({
        x: window.innerWidth / 2 - introCenter.cx,
        y: window.innerHeight / 2 - introCenter.cy,
      })
      return
    }
    if (onCardClick) {
      const rect = e.currentTarget.getBoundingClientRect()
      onCardClick(item, rect)
    }
  }

  // ── 渲染一张卡片 ──
  const renderCard = (item) => {
    const isIntro = item.isIntro
    const isPlaceholder = item.isPlaceholder

    return (
      <div
        key={item.id}
        className={`absolute rounded-2xl overflow-hidden transition-all duration-300
                   ${isIntro
                     ? 'cursor-pointer bg-white border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.16)]'
                     : isPlaceholder
                       ? 'bg-gray-100 border border-gray-200'
                       : 'cursor-pointer bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.14)]'
                   }`}
        style={{
          left: item.x,
          top: item.y,
          width: item.w,
          height: item.h,
        }}
        onClick={(e) => { e.stopPropagation(); cardClick(item, e) }}
      >
        {isIntro ? (
          /* ── 介绍卡片（内容缩小 15%，保持网格占位不变）── */
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white"
            style={{ transform: 'scale(0.85)', transformOrigin: 'center center' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6 bg-gray-200" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-300">portfolio</span>
              <div className="h-px w-6 bg-gray-200" />
            </div>
            <h2 className="text-2xl font-bold font-display text-gray-800 mb-2">{item.title}</h2>
            <p className="text-sm text-gray-400 mb-5">{item.subtitle}</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {item.categories.map((cat) => (
                <span key={cat} className="px-3 py-1 text-[10px] font-medium rounded-full
                                           bg-gray-50 text-gray-400 border border-gray-100">
                  {cat}
                </span>
              ))}
            </div>
            <p className="mt-5 text-[11px] text-gray-300 tracking-wider">拖拽画布 · 探索作品</p>
          </div>
        ) : isPlaceholder ? (
          /* ── 占位卡片（纯灰底）── */
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-300 text-xs tracking-wider">待补充</span>
          </div>
        ) : (
          /* ── 设计项目卡片 — 支持 image / video / GIF ── */
          <>
            {(() => {
              const src = item.video || item.image
              if (!src) return null
              const type = getMediaType(src)

              if (type === 'video') {
                return (
                  <>
                    <video
                      src={src}
                      muted
                      preload="metadata"
                      playsInline
                      disablePictureInPicture
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* 视频标识角标 */}
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-medium
                                     rounded bg-black/50 text-white/70 backdrop-blur-sm">
                      ▶
                    </span>
                  </>
                )
              }

              // image / gif 都用 img
              return (
                <img
                  src={src}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              )
            })()}
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className="w-full h-full overflow-hidden relative cursor-grab active:cursor-grabbing no-select"
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}
      onWheel={onWheel}
      style={{ touchAction: 'none', overscrollBehavior: 'none' }}
    >
      <div
        className="absolute top-0 left-0"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          width: TILE_W,
          height: tileH,
          willChange: 'transform',
        }}
      >
        {all.map((item) => renderCard(item))}
      </div>
    </div>
  )
}
