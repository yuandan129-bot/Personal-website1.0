import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import GlassSurface from './GlassSurface'

/* ====== 图标（支持 responsive size） ====== */

function HomeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5" />
      <path d="M5 8.5V21h5v-6h4v6h5V8.5" />
    </svg>
  )
}

function CodeIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="8" y1="2" x2="16" y2="2" strokeWidth="1.2" opacity="0.4" />
      <line x1="12" y1="2" x2="12" y2="6" strokeWidth="1.2" opacity="0.4" />
    </svg>
  )
}

function DesignIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
      <path d="M12 22V14" />
    </svg>
  )
}

function ThinkIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
      <path d="M8 14c-1.5.5-3 1.5-4 3" opacity="0.4" />
      <path d="M16 14c1.5.5 3 1.5 4 3" opacity="0.4" />
    </svg>
  )
}

/* ====== 单个导航按钮 ====== */

function NavButton({ to, icon: Icon, label, isActive, isLight, compact, isHome }) {
  const navigate = useNavigate()
  const iconSize = compact ? 15 : (isHome ? 20 : 18)
  const btnWidth = compact ? (isHome ? 62 : 76) : (isHome ? 110 : 140)
  const btnHeight = compact ? 38 : (isHome ? 48 : 44)
  const textSize = compact ? 'text-[10px]' : (isHome ? 'text-sm' : 'text-xs')
  const padding = compact ? 'px-1.5' : (isHome ? 'px-4' : 'px-3')

  const textColor = isLight
    ? { active: 'text-black', inactive: 'text-black/50' }
    : { active: 'text-white', inactive: 'text-white/65' }

  // 直接 onClick 导航，不依赖 <Link>，避免 GlassSurface SVG 层阻断点击
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(to)
  }

  return (
    <div
      className="no-underline flex-shrink-0"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(e) }}
    >
      <GlassSurface
        width={btnWidth}
        height={btnHeight}
        borderRadius={isHome ? 26 : 22}
        distortionScale={isHome ? -320 : -280}
        redOffset={0}
        greenOffset={15}
        blueOffset={30}
        blur={6}
        displace={0}
        brightness={isLight ? 100 : 50}
        opacity={0.93}
        backgroundOpacity={isHome ? 0.12 : (isActive ? 0.1 : 0.04)}
        saturation={1}
        borderWidth={isHome ? 0.12 : 0.08}
        mixBlendMode="screen"
        style={{ pointerEvents: 'none' }}
        className={isHome
          ? (isLight ? 'ring-1 ring-black/15' : 'ring-1 ring-white/25')
          : (isActive ? (isLight ? 'ring-1 ring-black/10' : 'ring-1 ring-white/20') : '')
        }
      >
        <div className={`flex items-center gap-1.5 ${padding} select-none`}>
          <span className={`transition-colors duration-300 flex-shrink-0 ${isActive ? textColor.active : textColor.inactive}`}>
            <Icon size={iconSize} />
          </span>
          <span
            className={`${textSize} font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${
              isActive ? textColor.active : textColor.inactive
            }`}
          >
            {label}
          </span>
        </div>
      </GlassSurface>
    </div>
  )
}

/* ====== 导航栏容器 ====== */

const NAV_ITEMS = [
  { to: '/',              icon: HomeIcon,   label: '首页',        isHome: true },
  { to: '/vibe-coding',   icon: CodeIcon,   label: 'Vibe Coding', isHome: false },
  { to: '/design',        icon: DesignIcon, label: 'Design',      isHome: false },
  { to: '/thinking',      icon: ThinkIcon,  label: 'Thinking',    isHome: false },
]

export default function GlassNav() {
  const location = useLocation()
  const isLight = location.pathname === '/design'
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const check = () => setCompact(window.innerWidth < 500)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const gap = compact ? 'gap-2' : 'gap-5'
  const pb = compact ? 'pb-3' : 'pb-6'

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-center ${gap} pt-4 ${pb}`}
      style={{
        pointerEvents: 'auto',
        background: isLight
          ? 'linear-gradient(to top, rgba(0,0,0,0.04) 0%, transparent 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
      }}
    >
      {NAV_ITEMS.map((item) => (
        <NavButton
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isActive={location.pathname === item.to}
          isLight={isLight}
          compact={compact}
          isHome={item.isHome}
        />
      ))}
    </nav>
  )
}
