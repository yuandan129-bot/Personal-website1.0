import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const TYPE_BADGES = {
  'vibe-coding': { label: 'Project', icon: '⚡' },
  'skill': { label: 'Skill', icon: '✦' },
  'agent': { label: 'Agent', icon: '◈' },
}

export default function ProjectCard({ project, index }) {
  const navigate = useNavigate()
  const isPlaceholder = project.status === 'placeholder' && project.title === '即将上线'
  const badge = TYPE_BADGES[project.type] || TYPE_BADGES['vibe-coding']

  const handleClick = () => {
    if (isPlaceholder) return
    navigate(`/vibe-coding/${project.id}`)
  }

  return (
    <motion.div
      onClick={handleClick}
      className={`relative group rounded-2xl overflow-hidden
                 bg-white/[0.03] border border-white/[0.06]
                 hover:bg-white/[0.05] hover:border-white/[0.12]
                 transition-all duration-400
                 ${isPlaceholder ? 'cursor-default opacity-40 hover:opacity-50' : 'cursor-pointer'}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 + index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={isPlaceholder ? {} : { y: -4, transition: { duration: 0.25 } }}
      whileTap={isPlaceholder ? {} : { scale: 0.985 }}
    >
      {/* ── 封面图区 ── */}
      <div className="relative h-48 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: project.coverColor || '#2d2d3f' }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-black/30" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                             w-32 h-32 border border-white/20 rounded-[2rem] rotate-[15deg]" />
            </div>
            {!isPlaceholder ? (
              <span className="relative text-4xl opacity-50 select-none">
                {badge.icon}
              </span>
            ) : (
              <span className="relative text-2xl opacity-30 select-none">
                —
              </span>
            )}
          </div>
        )}

        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-medium tracking-wider
                         rounded-full bg-black/40 backdrop-blur-sm text-white/70
                         border border-white/10">
          {badge.label}
        </span>
      </div>

      {/* ── 信息区 ── */}
      <div className="p-5">
        <h3 className={`font-semibold text-[15px] leading-snug tracking-[-0.01em] mb-1.5
                       ${isPlaceholder ? 'text-white/25' : 'text-white/85'}`}>
          {project.title}
        </h3>
        <p className={`text-[13px] leading-relaxed tracking-[0.01em] line-clamp-2
                      ${isPlaceholder ? 'text-white/12' : 'text-white/35'}`}>
          {project.description}
        </p>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-medium tracking-wide
                           rounded-full bg-white/[0.04] text-white/30
                           border border-white/[0.06]"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] text-white/20">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
