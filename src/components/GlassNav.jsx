import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
      <path d="M12 2l2.5 5.5L20 10l-5.5 2.5L12 18l-2.5-5.5L4 10l5.5-2.5z" />
    </svg>
  )
}

function DesignIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
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

function NavButton({ to, icon: Icon, label, isActive, isLight, compact, isHome, onPreload }) {
  const navigate = useNavigate()
  const iconSize = compact ? 15 : 18
  const btnWidth = compact ? (isHome ? 46 : 76) : (isHome ? 100 : 140)
  const btnHeight = compact ? 38 : 44
  const textSize = compact ? 'text-[10px]' : 'text-xs'
  const padding = compact ? 'px-1.5' : 'px-3'

  const textColor = isLight
    ? { active: 'text-black', inactive: 'text-black/50' }
    : { active: 'text-white', inactive: 'text-white/65' }

  // 直接 onClick 导航
  const handleClick = () => {
    navigate(to)
  }

  return (
    <motion.div
      className="no-underline flex-shrink-0"
      onClick={handleClick}
      onMouseEnter={() => onPreload?.(to)}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(e) }}
    >
      <GlassSurface
        width={btnWidth}
        height={btnHeight}
        borderRadius={22}
        distortionScale={-280}
        redOffset={0}
        greenOffset={15}
        blueOffset={30}
        blur={6}
        displace={0}
        brightness={isLight ? 100 : 50}
        opacity={0.93}
        backgroundOpacity={isActive ? 0.1 : 0.04}
        saturation={1}
        borderWidth={0.08}
        mixBlendMode="screen"
        style={{ pointerEvents: 'none' }}
        className={isActive ? (isLight ? 'ring-1 ring-black/10' : 'ring-1 ring-white/20') : ''}
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
    </motion.div>
  )
}

/* ====== 导航栏容器 ====== */

const NAV_ITEMS = [
  { to: '/',              icon: HomeIcon,   label: '首页',        isHome: true },
  { to: '/vibe-coding',   icon: CodeIcon,   label: 'Vibe Coding', isHome: false },
  { to: '/design',        icon: DesignIcon, label: 'Design',      isHome: false },
  { to: '/thinking',      icon: ThinkIcon,  label: 'Thinking',    isHome: false },
]

export default function GlassNav({ onPreload }) {
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
          onPreload={onPreload}
        />
      ))}
    </nav>
  )
}
