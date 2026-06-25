import { useRef, useEffect } from 'react'
import './ShinyText.css'

/**
 * ShinyText — 流光扫过文字动效
 *
 * 默认使用纯 CSS animation（GPU 合成器线程），不阻塞主线程。
 * yoyo 模式回退到 JS rAF（项目当前未使用 yoyo）。
 *
 * @param {number}  speed       扫光周期（秒），默认 1.5
 * @param {number}  spread      渐变角度，默认 120
 * @param {string}  color       基础色，默认 #b5b5b5
 * @param {string}  shineColor  高亮色，默认 #ffffff
 * @param {string}  direction   'left' | 'right'，默认 'left'
 * @param {number}  delay       循环间停顿（秒），默认 0
 * @param {boolean} yoyo        来回扫光，默认 false
 * @param {boolean} pauseOnHover 悬停暂停，默认 false
 * @param {boolean} disabled    禁用动画，默认 false
 */
export default function ShinyText({
  text,
  disabled = false,
  speed = 1.5,
  className = '',
  style,
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0,
}) {
  // ── yoyo 模式：回退到 JS rAF（项目当前未使用）──
  if (yoyo) {
    return <ShinyTextYoyo text={text} disabled={disabled} speed={speed}
      className={className} style={style} color={color} shineColor={shineColor}
      spread={spread} direction={direction} delay={delay} />
  }

  const gradientStyle = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }

  // 动画名：direction === 'right' 时用 reverse 关键帧
  const animName = direction === 'right' ? 'shiny-sweep-reverse' : 'shiny-sweep'

  const animStyle = disabled
    ? {}
    : {
        animation: `${animName} ${speed}s linear infinite`,
        animationDelay: `${delay}s`,
      }

  const pauseClass = pauseOnHover && !disabled ? 'shiny-text-pause-on-hover' : ''

  return (
    <span
      className={`shiny-text ${pauseClass} ${className}`}
      style={{ ...gradientStyle, ...animStyle, ...style }}
    >
      {text}
    </span>
  )
}

/* ================================================================== */
/*  yoyo 回退：保留原 framer-motion 风格的 JS 驱动（仅 yoyo 模式使用）   */
/* ================================================================== */

import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion'

function ShinyTextYoyo({
  text,
  disabled = false,
  speed = 1.5,
  className = '',
  style,
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  direction = 'left',
  delay = 0,
}) {
  const progress = useMotionValue(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef(null)
  const directionRef = useRef(direction === 'left' ? 1 : -1)

  const animationDuration = speed * 1000
  const delayDuration = delay * 1000

  useAnimationFrame((time) => {
    if (disabled) { lastTimeRef.current = null; return }
    if (lastTimeRef.current === null) { lastTimeRef.current = time; return }

    elapsedRef.current += time - lastTimeRef.current
    lastTimeRef.current = time

    const cycleDuration = animationDuration + delayDuration
    const fullCycle = cycleDuration * 2
    const cycleTime = elapsedRef.current % fullCycle

    if (cycleTime < animationDuration) {
      const p = (cycleTime / animationDuration) * 100
      progress.set(directionRef.current === 1 ? p : 100 - p)
    } else if (cycleTime < cycleDuration) {
      progress.set(directionRef.current === 1 ? 100 : 0)
    } else if (cycleTime < cycleDuration + animationDuration) {
      const p = 100 - ((cycleTime - cycleDuration) / animationDuration) * 100
      progress.set(directionRef.current === 1 ? p : 100 - p)
    } else {
      progress.set(directionRef.current === 1 ? 0 : 100)
    }
  })

  useEffect(() => {
    directionRef.current = direction === 'left' ? 1 : -1
    elapsedRef.current = 0
    progress.set(0)
  }, [direction, progress])

  const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`)

  const gradientStyle = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }

  if (disabled) {
    return (
      <span className={`shiny-text ${className}`} style={{ ...gradientStyle, ...style }}>
        {text}
      </span>
    )
  }

  return (
    <motion.span
      className={`shiny-text ${className}`}
      style={{ ...gradientStyle, backgroundPosition, ...style }}
    >
      {text}
    </motion.span>
  )
}
