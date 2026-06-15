import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import BackButton from '../components/BackButton'
import ThinkingColumn from '../components/ThinkingColumn'
import ThinkingModal from '../components/ThinkingModal'
import ShinyText from '../components/ui/ShinyText'
import { thinkingData } from '../data/thinkings'

export default function ThinkingPage() {
  const [selectedItem, setSelectedItem] = useState(null)
  const [originRect, setOriginRect] = useState(null)

  return (
    <PageTransition className="bg-black">
      <BackButton />

      <div className="w-full h-full flex flex-col px-8 pt-20 pb-8 gap-10">
        {/* 页面标题 — ShinyText 白色流光 */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2 text-white/25">
            Musings & Reflections
          </p>
          <ShinyText
            text="Thinking"
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
            关于设计、AI、与日常生活的思考碎片。灵感来的时候写一点，没有 KPI。
          </p>
        </motion.div>

        {/* 卡片滚动区 — For AI 双行错开 + For Me 单行 */}
        <motion.div
          className="flex flex-col gap-8 flex-1 min-h-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* For AI — 双行错开滚动 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-1">
              <h2 className="text-lg font-bold font-display text-white/85 whitespace-nowrap">
                {thinkingData.forAI.title}
              </h2>
              <span className="text-xs text-white/25 uppercase tracking-wider whitespace-nowrap">
                {thinkingData.forAI.subtitle}
              </span>
              <div className="flex-1 h-px bg-white/8 ml-4" />
            </div>
            {/* Row 1 */}
            <ThinkingColumn
              data={thinkingData.forAI}
              speed={3.0}
              offset={0}
              onCardClick={(item, rect) => {
                setSelectedItem(item)
                setOriginRect(rect)
              }}
              hideTitle
            />
            {/* Row 2 — 错开偏移 */}
            <ThinkingColumn
              data={thinkingData.forAI}
              speed={4.5}
              offset={0.5}
              onCardClick={(item, rect) => {
                setSelectedItem(item)
                setOriginRect(rect)
              }}
              hideTitle
            />
          </div>

          {/* For Me — 单行 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-1">
              <h2 className="text-lg font-bold font-display text-white/85 whitespace-nowrap">
                {thinkingData.forMe.title}
              </h2>
              <span className="text-xs text-white/25 uppercase tracking-wider whitespace-nowrap">
                {thinkingData.forMe.subtitle}
              </span>
              <div className="flex-1 h-px bg-white/8 ml-4" />
            </div>
            <ThinkingColumn
              data={thinkingData.forMe}
              speed={2.5}
              offset={0}
              onCardClick={(item, rect) => {
                setSelectedItem(item)
                setOriginRect(rect)
              }}
              hideTitle
            />
          </div>
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
            originRect={originRect}
            onClose={() => {
              setSelectedItem(null)
              setOriginRect(null)
            }}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
