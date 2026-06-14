import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import BackButton from '../components/BackButton'
import ThinkingColumn from '../components/ThinkingColumn'
import ThinkingModal from '../components/ThinkingModal'
import { thinkingData } from '../data/thinkings'

export default function ThinkingPage() {
  const [selectedItem, setSelectedItem] = useState(null)

  return (
    <PageTransition className="bg-black">
      <BackButton />

      <div className="w-full h-full flex flex-col justify-center px-8 pt-16 pb-8 gap-12">
        {/* 页面标题 */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-neon-green text-xs font-bold tracking-[0.3em] uppercase mb-2">
             Musings & Reflections
          </p>
          <h1 className="text-4xl font-bold font-display text-white/90">
            <span className="text-neon-green text-glow-green">Thinking</span>
          </h1>
          <p className="mt-3 text-sm text-white/30 max-w-lg leading-relaxed">
            关于设计、AI、与日常生活的思考碎片。灵感来的时候写一点，没有 KPI。
          </p>
        </motion.div>

        {/* 横向滚动卡片区 */}
        <motion.div
          className="flex flex-col gap-10 flex-1 min-h-0 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ThinkingColumn data={thinkingData.designAI} speed={1.2} onCardClick={setSelectedItem} />
          <ThinkingColumn data={thinkingData.life} speed={0.7} onCardClick={setSelectedItem} />
        </motion.div>

        {/* 底部提示 */}
        <motion.p
          className="text-center text-xs text-white/10 flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          悬停卡片暂停 · 点击查看详情
        </motion.p>
      </div>

      {/* 弹窗 */}
      <AnimatePresence>
        {selectedItem && (
          <ThinkingModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
