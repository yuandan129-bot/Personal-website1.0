import { motion } from 'framer-motion'
import { useState, useRef } from 'react'

function HCard({ item, onClick }) {
  return (
    <motion.div
      className="thinking-card group flex-shrink-0 w-72 cursor-pointer p-5 rounded-2xl
                 border border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-white/15
                 transition-colors duration-300 relative"
      whileHover={{
        scale: 1.08,
        y: -20,
        zIndex: 20,
        transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      style={{ zIndex: 1 }}
      onClick={() => onClick(item)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-white/85 text-sm leading-relaxed flex-1 line-clamp-2
                       group-hover:text-white/95 transition-colors">
          {item.title}
        </h3>
        <span className="flex-shrink-0 ml-2 text-white/20 group-hover:text-white/50 transition-colors text-xs">
          →
        </span>
      </div>

      <p className="text-xs text-white/35 leading-relaxed mb-3
                    line-clamp-2 group-hover:line-clamp-4
                    transition-all duration-300">
        {item.excerpt}
      </p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-white/20">{item.date}</span>
        {item.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 text-[9px] rounded-full bg-white/8 text-white/40">
            {tag}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                      transition-opacity duration-300 pointer-events-none"
           style={{ boxShadow: '0 0 50px rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.4)' }} />
    </motion.div>
  )
}

export default function ThinkingColumn({ data, speed = 1, onCardClick }) {
  const duplicated = [...data.items, ...data.items, ...data.items]
  const [paused, setPaused] = useState(false)

  return (
    <div className="relative scroll-row">
      <div className="flex items-center gap-3 mb-4 px-1">
        {data.icon && (
          <span className="text-xl flex-shrink-0">{data.icon}</span>
        )}
        <h2 className="text-lg font-bold font-display text-white/85 whitespace-nowrap">
          {data.title}
        </h2>
        <span className="text-xs text-white/25 uppercase tracking-wider whitespace-nowrap">
          {data.subtitle}
        </span>
        <div className="flex-1 h-px bg-white/8 ml-4" />
      </div>

      {/* 横向滚动区 */}
      <div
        className="relative overflow-hidden scroll-container py-8 -my-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex gap-4 scroll-animate"
          style={{
            width: 'max-content',
            animation: `scroll-left ${35 / speed}s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
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
