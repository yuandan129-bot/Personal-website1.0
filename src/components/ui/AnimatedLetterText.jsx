import { cn } from '../../lib/utils'

/**
 * AnimatedLetterText
 * 将文字中的某个字母替换为带 SVG 滤镜的旋转钻石动画。
 *
 * @param {string}  text             - 完整文字
 * @param {string}  letterToReplace  - 要替换为动画的字母（大小写不敏感，替换第一个）
 * @param {string}  className        - 外层 span 的额外 class
 * @param {string}  textColor        - 文字颜色（覆盖 --foreground），shiny 模式下无效
 * @param {boolean} shiny            - 开启扫光动效（文字部分有流光扫过）
 * @param {string}  shineColor       - 扫光高亮色，默认 #ffffff
 * @param {number}  shineSpeed       - 扫光周期（秒），默认 2.5
 */
export function AnimatedLetterText({
  text = 'Portfolio',
  letterToReplace = 'o',
  className,
  textColor,
  shiny = false,
  shineColor = '#ffffff',
  shineSpeed = 2.5,
}) {
  const lowerText = text.toLowerCase()
  const lowerLetter = letterToReplace.toLowerCase()
  const replaceIndex = lowerText.indexOf(lowerLetter)

  // 没有找到要替换的字母 → 直接渲染纯文字
  if (replaceIndex === -1) {
    const colorStyle = shiny
      ? shinyTextStyle(textColor || '#b5b5b5', shineColor, shineSpeed)
      : { color: textColor || 'var(--foreground, #ffffff)' }
    return (
      <span
        className={cn('font-black tracking-tight', className)}
        style={colorStyle}
      >
        {text}
      </span>
    )
  }

  const before = text.slice(0, replaceIndex)
  const after = text.slice(replaceIndex + 1)

  // shiny 模式：文字 span 使用扫光渐变；普通模式：纯色
  const textSpanStyle = shiny
    ? shinyTextStyle(textColor || '#b5b5b5', shineColor, shineSpeed)
    : { color: textColor || 'var(--foreground, #ffffff)' }

  // 外层 span 在 shiny 模式下不设 color（子 span 各自控制）
  const outerColorStyle = shiny
    ? {}
    : { color: textColor || 'var(--foreground, #ffffff)' }

  let keyIndex = 0

  return (
    <span
      className={cn('inline-flex items-center font-black tracking-tight', className)}
      style={outerColorStyle}
    >
      {before && (
        <span key={keyIndex++} style={textSpanStyle}>
          {before}
        </span>
      )}

      {/* 替换字母 → 旋转钻石动画 */}
      <span
        className="relative inline-flex items-center justify-center mx-[-0.02em]"
        style={{
          filter:
            'drop-shadow(0 4px 8px rgba(0,0,0,0.25)) drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
        }}
      >
        {/* ====== SVG 滤镜定义 ====== */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            {/* 外侧形状的内阴影 */}
            <filter
              id="innerShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="3" />
              <feOffset dx="0" dy="2" result="offsetblur" />
              <feFlood floodColor="rgba(255,255,255,0.15)" result="color" />
              <feComposite in2="offsetblur" operator="in" />
              <feComposite in2="SourceAlpha" operator="in" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode />
              </feMerge>
            </filter>

            {/* 钻石发光 */}
            <filter
              id="diamondGlow"
              x="-150%"
              y="-150%"
              width="400%"
              height="400%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
              <feFlood floodColor="#d4ff4a" floodOpacity="0.3" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* 钻石渐变 */}
            <linearGradient
              id="diamondGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#e2ff6a" />
              <stop offset="40%" stopColor="#d4ff4a" />
              <stop offset="60%" stopColor="#c4f934" />
              <stop offset="100%" stopColor="#b8ed28" />
            </linearGradient>

            {/* 钻石高光面 */}
            <linearGradient
              id="diamondShine"
              x1="0%"
              y1="0%"
              x2="50%"
              y2="50%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            {/* 外侧花形底 */}
            <radialGradient
              id="outerShapeGradient"
              cx="30%"
              cy="30%"
              r="70%"
            >
              <stop offset="0%" stopColor="#2a2a2a" />
              <stop offset="100%" stopColor="#0f0f0f" />
            </radialGradient>
          </defs>
        </svg>

        {/* 花形外框 */}
        <svg viewBox="0 0 100 100" className="w-[0.75em] h-[0.75em]">
          <path
            d="M50 0
               C55 15, 65 15, 75 10
               C70 25, 75 35, 90 35
               C80 45, 80 55, 90 65
               C75 65, 70 75, 75 90
               C65 85, 55 85, 50 100
               C45 85, 35 85, 25 90
               C30 75, 25 65, 10 65
               C20 55, 20 45, 10 35
               C25 35, 30 25, 25 10
               C35 15, 45 15, 50 0Z"
            fill="url(#outerShapeGradient)"
            filter="url(#innerShadow)"
          />
          <path
            d="M50 0
               C55 15, 65 15, 75 10
               C70 25, 75 35, 90 35
               C80 45, 80 55, 90 65
               C75 65, 70 75, 75 90
               C65 85, 55 85, 50 100
               C45 85, 35 85, 25 90
               C30 75, 25 65, 10 65
               C20 55, 20 45, 10 35
               C25 35, 30 25, 25 10
               C35 15, 45 15, 50 0Z"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        </svg>

        {/* 旋转钻石（SVG 原生 animateTransform，绕 viewBox 中心 50,50 旋转） */}
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-[0.32em] h-[0.32em]"
            filter="url(#diamondGlow)"
          >
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="3s"
                repeatCount="indefinite"
              />
              <path
                d="M50 8 L92 50 L50 92 L8 50 Z"
                fill="url(#diamondGradient)"
              />
              <path
                d="M50 8 L8 50 L50 50 Z"
                fill="url(#diamondShine)"
              />
              <path
                d="M50 18 L82 50 L50 82 L18 50 Z"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
              />
            </g>
          </svg>
        </span>
      </span>

      {after && (
        <span key={keyIndex++} style={textSpanStyle}>
          {after}
        </span>
      )}
    </span>
  )
}

/** 生成 shiny 模式的 CSS-in-JS 扫光样式 */
function shinyTextStyle(baseColor, shineColor, speed) {
  return {
    backgroundImage: `linear-gradient(100deg, ${baseColor} 0%, ${baseColor} 35%, ${shineColor} 50%, ${baseColor} 65%, ${baseColor} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `shiny-sweep ${speed}s linear infinite`,
  }
}
