import * as SwitchPrimitive from '@radix-ui/react-switch'

/* ====== 太阳 / 月亮图标 ====== */
function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

/* ====== 开关组件 ====== */
export default function DayNightToggle({ checked, onChange, switchRef }) {
  return (
    <div
      ref={switchRef}
      data-switch-container
      className="fixed top-5 right-5 z-50 flex items-center gap-2.5"
    >
      {/* Night 标签 */}
      <span className={`text-xs font-medium tracking-wide select-none transition-colors duration-300 ${checked ? 'text-white/35' : 'text-white/90'}`}>
        <span className="flex items-center gap-1">
          <MoonIcon />
          Night
        </span>
      </span>

      {/* Radix Switch */}
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onChange}
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-white/25 bg-white/10 transition-all outline-none cursor-pointer hover:border-white/40 data-[state=checked]:bg-amber-500/60 data-[state=checked]:border-amber-400/50"
      >
        <SwitchPrimitive.Thumb className="block size-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[3px]" />
      </SwitchPrimitive.Root>

      {/* Day 标签 */}
      <span className={`text-xs font-medium tracking-wide select-none transition-colors duration-300 ${checked ? 'text-white/90' : 'text-white/35'}`}>
        <span className="flex items-center gap-1">
          <SunIcon />
          Day
        </span>
      </span>
    </div>
  )
}
