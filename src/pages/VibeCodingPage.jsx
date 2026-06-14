import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import BackButton from '../components/BackButton'
import ProjectCard from '../components/ProjectCard'
import { vibeCodingProjects } from '../data/projects'

const FILTERS = [
  { key: '全部', icon: '' },
  { key: 'Vibe Coding', icon: '⚡' },
  { key: 'Full Stack', icon: '🔧' },
  { key: 'Tool', icon: '🛠' },
  { key: 'Design Tool', icon: '🎨' },
]

export default function VibeCodingPage() {
  return (
    <PageTransition className="bg-black">
      <BackButton />

      <div className="w-full h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
          {/* 页面标题 */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-neon-purple text-xs font-bold tracking-[0.3em] uppercase mb-2">
              ⚡ Projects & Experiments
            </p>
            <h1 className="text-4xl font-bold font-display text-white/90">
              Vibe <span className="text-neon-purple text-glow-purple">Coding</span>
            </h1>
            <p className="mt-3 text-sm text-white/30 max-w-lg leading-relaxed">
              用代码探索想法的实验场。每个项目都是独立完成的设计+开发——从 AI 工具到像素天气，保持好奇心，快速验证，持续迭代。
            </p>
          </motion.div>

          {/* 筛选标签 */}
          <motion.div
            className="flex gap-2 mb-8 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {FILTERS.map(({ key, icon }, i) => (
              <motion.button
                key={key}
                className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all
                           ${i === 0
                             ? 'bg-white/15 text-white border-white/20'
                             : 'bg-transparent text-white/40 border-white/10 hover:text-white/70 hover:border-white/25'
                           }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {icon && <span className="mr-1.5">{icon}</span>}
                {key}
              </motion.button>
            ))}
          </motion.div>

          {/* 项目网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vibeCodingProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {/* 底部 */}
          <motion.p
            className="mt-16 text-center text-xs text-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            More experiments coming soon · 持续更新中
          </motion.p>
        </div>
      </div>
    </PageTransition>
  )
}
