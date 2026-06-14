import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ProjectCard({ project, index }) {
  const navigate = useNavigate()

  return (
    <motion.div
      className="relative group cursor-pointer rounded-2xl overflow-hidden bg-gray-800/50 border border-white/5
                 hover:border-white/20 transition-colors"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/vibe-coding/${project.id}`)}
    >
      {/* 封面区域 */}
      <div
        className="h-48 flex items-center justify-center relative overflow-hidden"
        style={{ background: project.coverColor }}
      >
        {/* 抽象几何装饰 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/20" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-black/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/15 rounded-3xl rotate-12" />
        </div>
        <span className="relative text-4xl opacity-60">
          {project.category === 'Vibe Coding' ? '⚡' :
           project.category === 'Full Stack' ? '🔧' :
           project.category === 'Tool' ? '🛠' :
           project.category === 'Design Tool' ? '🎨' : '📦'}
        </span>
      </div>

      {/* 信息区 */}
      <div className="p-4">
        <h3 className="font-semibold text-white/90 text-sm">{project.title}</h3>
        <p className="text-xs text-white/40 mt-1 line-clamp-2">{project.description}</p>
      </div>

      {/* Hover 标签浮层 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent
                   flex flex-wrap gap-1.5"
        initial={{ opacity: 0, y: 20 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] font-medium rounded-full
                       bg-white/15 text-white/80 backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </motion.div>
  )
}
