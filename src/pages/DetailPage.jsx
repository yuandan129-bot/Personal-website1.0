import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import BackButton from '../components/BackButton'
import { vibeCodingProjects } from '../data/projects'
import { designProjects } from '../data/designs'
import { thinkingData } from '../data/thinkings'

export default function DetailPage({ type }) {
  const { id } = useParams()

  // 根据类型查找数据
  let item = null
  if (type === 'vibe-coding') {
    item = vibeCodingProjects.find((p) => p.id === id)
  } else if (type === 'design') {
    item = designProjects.find((p) => p.id === id)
  } else if (type === 'thinking') {
    item = thinkingData.designAI.items.find((t) => t.id === id) ||
           thinkingData.life.items.find((t) => t.id === id)
  }

  if (!item) {
    return (
      <PageTransition className="bg-black flex items-center justify-center">
        <BackButton />
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-white/40">内容未找到</p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="bg-black">
      <BackButton />

      <div className="w-full h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
          {/* 封面区 */}
          <motion.div
            className="rounded-3xl h-64 mb-10 flex items-center justify-center relative overflow-hidden"
            style={{
              background: item.coverColor || item.color || '#333',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/30" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-black/10" />
            </div>
            <span className="relative text-7xl opacity-50">
              {item.category === 'Vibe Coding' || item.tags?.includes('Vibe Coding') ? '⚡' :
               item.category === '品牌设计' ? '🏷' :
               item.category === '包装设计' ? '📦' :
               item.category === '插画' ? '🎨' :
               item.type === 'design-ai' ? '💡' :
               item.type === 'life' ? '📷' : '✨'}
            </span>
          </motion.div>

          {/* 内容区 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* 标签 */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {(item.tags || [item.category]).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/50 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 标题 */}
            <h1 className="text-3xl font-bold font-display text-white/90 mb-4">
              {item.title}
            </h1>

            {/* 日期 */}
            {item.date && (
              <p className="text-sm text-white/30 mb-8">{item.date}</p>
            )}

            {/* 内容 */}
            <div className="prose prose-invert max-w-none">
              <p className="text-white/60 leading-relaxed text-base">
                {item.description || item.excerpt}
              </p>
            </div>

            {/* 占位区块 - 表示未来会填充更多内容 */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="h-40 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center text-white/15 text-sm">
                图片占位
              </div>
              <div className="h-40 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center text-white/15 text-sm">
                图片占位
              </div>
            </div>

            {item.url && (
              <motion.a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full
                           bg-white/10 text-white/70 text-sm border border-white/15
                           hover:bg-white/20 hover:text-white transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                访问项目
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H4.5M11 3v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
