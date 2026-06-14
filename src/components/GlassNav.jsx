import { Link, useLocation } from 'react-router-dom'
import GlassSurface from './GlassSurface'

/* ====== 线性 SVG 图标 ====== */

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5" />
      <path d="M5 8.5V21h5v-6h4v6h5V8.5" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function DesignIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function ThinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17h-3v2H9v-1H7v-3.3c-1.8-1.2-3-3.3-3-5.7a7 7 0 0 1 7-7z" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="10" y1="22" x2="14" y2="22" />
    </svg>
  )
}

/* ====== 单个导航按钮 ====== */

function NavButton({ to, icon: Icon, label, isActive, isLight }) {
  const textColor = isLight
    ? { active: 'text-black', inactive: 'text-black/50' }
    : { active: 'text-white', inactive: 'text-white/65' }

  return (
    <Link to={to} className="no-underline">
      <GlassSurface
        width={140}
        height={44}
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
        style={{ cursor: 'pointer' }}
        className={isActive ? (isLight ? 'ring-1 ring-black/10' : 'ring-1 ring-white/20') : ''}
      >
        <div className={`flex items-center gap-2 px-3 select-none ${textColor.active}`}>
          <span className={`transition-colors duration-300 ${isActive ? textColor.active : textColor.inactive}`}>
            <Icon />
          </span>
          <span
            className={`text-xs font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${
              isActive ? textColor.active : textColor.inactive
            }`}
          >
            {label}
          </span>
        </div>
      </GlassSurface>
    </Link>
  )
}

/* ====== 导航栏容器 ====== */

const NAV_ITEMS = [
  { to: '/',              icon: HomeIcon,   label: '首页' },
  { to: '/vibe-coding',   icon: CodeIcon,   label: 'Vibe Coding' },
  { to: '/design',        icon: DesignIcon, label: 'Design' },
  { to: '/thinking',      icon: ThinkIcon,  label: 'Thinking' },
]

export default function GlassNav() {
  const location = useLocation()
  const isLight = location.pathname === '/design'

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-4 pb-6 pt-4"
      style={{
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
        />
      ))}
    </nav>
  )
}
