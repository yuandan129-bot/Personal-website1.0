import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import BackButton from '../components/BackButton'
import ProjectCard from '../components/ProjectCard'
import ShinyText from '../components/ui/ShinyText'
import { vibeCodingProjects } from '../data/projects'

const FILTERS = [
  { key: '全部', label: '全部' },
  { key: 'Vibe Coding', label: 'Vibe Coding' },
  { key: 'Skill', label: 'Skill' },
  { key: 'Agent', label: 'Agent' },
]

export default function VibeCodingPage() {
  const [activeFilter, setActiveFilter] = useState('全部')

  const filteredProjects = useMemo(() => {
    if (activeFilter === '全部') return vibeCodingProjects
    return vibeCodingProjects.filter((p) => p.category === activeFilter)
  }, [activeFilter])

  return (
    <PageTransition className="bg-black">
      <BackButton />

      <div className="w-full h-full overflow-y-auto smooth-scroll">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
          {/* ── 页面标题 — 白色 ShinyText 流光 ── */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2 text-white/25">
              Projects & Experiments
            </p>
            <ShinyText
              text="Vibe Coding"
              speed={3}
              color="#b0b0b0"
              shineColor="#ffffff"
              spread={100}
              style={{
                fontSize: '2.25rem',
                lineHeight: '2.5rem',
                fontWeight: 700,
                fontFamily: "'DM Sans', 'Inter', sans-serif",
              }}
            />
            <p className="mt-3 text-sm text-white/30 max-w-lg leading-relaxed">
              用代码探索想法的实验场。项目、Skill、Agent —— 保持好奇心，快速验证，持续迭代。
            </p>
          </motion.div>

          {/* ── 筛选标签 — 功能化 ── */}
          <motion.div
            className="flex gap-2 mb-10 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {FILTERS.map(({ key, label }) => {
              const isActive = activeFilter === key
              return (
                <motion.button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`relative px-5 py-2 text-xs font-medium rounded-full border transition-all duration-300
                             ${isActive
                               ? 'bg-white text-black border-white'
                               : 'bg-transparent text-white/40 border-white/10 hover:text-white/70 hover:border-white/25'
                             }`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {label}
                </motion.button>
              )
            })}
          </motion.div>

          {/* ── 项目网格 — 带 AnimatePresence 过滤动画 ── */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 48, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 24, scale: 0.94, transition: { duration: 0.2 } }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ProjectCard project={project} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* ── 空状态 ── */}
          {filteredProjects.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center py-24 text-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-5xl mb-4">📦</span>
              <p className="text-sm">该分类下暂无项目</p>
            </motion.div>
          )}

          {/* ── 底部 ── */}
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
