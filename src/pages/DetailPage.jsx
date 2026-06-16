import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import BackButton from '../components/BackButton'
import { vibeCodingProjects } from '../data/projects'
import { designProjects } from '../data/designs'
import { thinkingData } from '../data/thinkings'

// ══════════════════════════════════════════
// 解析 **text** 为加粗标记
// ══════════════════════════════════════════
function parseBoldText(text) {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2)
      return (
        <strong key={i} className="text-white/80 font-semibold">
          {inner}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

// ══════════════════════════════════════════
// Vibe Coding 详情视图
// ══════════════════════════════════════════
function VibeCodingDetail({ item }) {
  const hasLinks = item.experienceUrl || item.githubUrl
  const hasFeatures = item.features && item.features.length > 0
  const hasSteps = item.steps && item.steps.length > 0
  const hasUsage = item.usageInstructions

  return (
    <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
      {/* ── 封面 ── */}
      <motion.div
        className="rounded-2xl h-56 sm:h-72 mb-10 flex items-center justify-center relative overflow-hidden"
        style={{ background: item.coverColor || '#2d2d3f' }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            {/* 抽象装饰 */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-black/30" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                             w-44 h-44 border border-white/20 rounded-[2.5rem] rotate-[20deg]" />
            </div>
            <span className="relative text-6xl opacity-40 select-none">
              {item.type === 'skill' ? '✦' : item.type === 'agent' ? '◈' : '⚡'}
            </span>
          </>
        )}
      </motion.div>

      {/* ── 标签行 + 类型徽标 ── */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 text-[11px] font-medium tracking-wide
                         rounded-full bg-white/[0.06] text-white/40
                         border border-white/[0.08]">
            {item.category}
          </span>
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[11px] font-medium tracking-wide
                         rounded-full bg-white/[0.03] text-white/25
                         border border-white/[0.05]"
            >
              {tag}
            </span>
          ))}
        </div>

        {item.status === 'placeholder' && (
          <span className="text-[11px] text-white/15 tracking-wider italic">
            Coming Soon
          </span>
        )}
      </motion.div>

      {/* ── 大标题 ── */}
      <motion.h1
        className="text-3xl sm:text-4xl font-bold font-display text-white/90
                   tracking-[-0.02em] leading-tight mb-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        {item.title}
      </motion.h1>

      {/* ── 简介（加粗高亮） ── */}
      <motion.p
        className="text-[15px] text-white/45 leading-relaxed tracking-[0.01em] max-w-2xl mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {parseBoldText(item.detailedDescription || item.description)}
      </motion.p>

      {/* ── 功能流程 ── */}
      {hasSteps && (
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
        >
          <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-white/20 mb-5">
            功能流程
          </h2>

          {/* 横向流程图 — flex-wrap，统一方框高度，整齐排列 */}
          <div className="flex flex-wrap items-start gap-2">
            {item.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                {/* 步骤卡片 — 固定高度统一所有行 */}
                <div
                  className="group w-[200px] h-[76px] px-4 py-2.5 rounded-xl border border-white/[0.05]
                             bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/[0.12]
                             transition-all duration-300 flex items-center"
                  style={{
                    boxShadow: `inset 0 0 0 0 ${item.coverColor || '#555'}00`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `inset 0 0 20px 0 ${item.coverColor || '#555'}15`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `inset 0 0 0 0 ${item.coverColor || '#555'}00`
                  }}
                >
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ paddingLeft: '1.4em', textIndent: '-1.4em' }}
                  >
                    <span
                      className="font-semibold transition-colors duration-300"
                      style={{ color: `${item.coverColor || '#888'}b3` }}
                    >
                      {i + 1}.
                    </span>
                    <span className="text-white/45 group-hover:text-white/65 transition-colors duration-300">
                      {' '}{step}
                    </span>
                  </p>
                </div>

                {/* 箭头 — 最后一步不显示 */}
                {i < item.steps.length - 1 && (
                  <svg
                    width="14" height="14" viewBox="0 0 16 16" fill="none"
                    className="flex-shrink-0 text-white/[0.12] mt-[30px]"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── 链接按钮组 — 优先展示体验地址 ── */}
      {hasLinks && (
        <motion.div
          className="flex flex-wrap gap-3 mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          {item.experienceUrl && (
            <a
              href={item.experienceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                         bg-white text-black text-sm font-medium
                         hover:bg-white/90 transition-all duration-200
                         shadow-[0_0_20px_rgba(255,255,255,0.06)]"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="opacity-70">
                <path d="M7.5 1L14 7.5L7.5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 7.5H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              体验地址
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
                <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                         bg-white/[0.06] text-white/60 text-sm
                         border border-white/[0.08]
                         hover:bg-white/[0.10] hover:text-white/80 hover:border-white/[0.15]
                         transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="opacity-70">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                         0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
                         -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
                         .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15
                         -.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0
                         1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82
                         1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
                         1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
                <path d="M3.5 1.5H10.5V8.5M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
        </motion.div>
      )}

      {/* ── 分隔线 ── */}
      <div className="h-px bg-white/[0.05] mb-10" />

      {/* ── 功能介绍 ── */}
      {hasFeatures && (
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-white/20 mb-6">
            功能介绍
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {item.features.map((feat, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]
                           hover:bg-white/[0.04] transition-colors duration-300"
              >
                <h3 className="text-sm font-semibold text-white/70 mb-2 tracking-[-0.01em]">
                  {feat.title}
                </h3>
                <p className="text-[13px] text-white/35 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── 使用说明 ── */}
      {hasUsage && (
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-white/20 mb-6">
            使用说明
          </h2>
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-[14px] text-white/40 leading-relaxed whitespace-pre-line">
              {item.usageInstructions}
            </div>
          </div>
        </motion.section>
      )}

      {/* ── 占位提示 ── */}
      {!hasFeatures && !hasSteps && !hasUsage && item.status === 'placeholder' && (
        <motion.div
          className="flex flex-col items-center justify-center py-16 text-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-4xl mb-3">—</span>
          <p className="text-xs tracking-wider">详细信息正在整理中</p>
        </motion.div>
      )}

      {/* 底部留白 */}
      <div className="h-8" />
    </div>
  )
}

// ══════════════════════════════════════════
// 通用详情页
// ══════════════════════════════════════════
export default function DetailPage({ type }) {
  const { id } = useParams()

  // 根据类型查找数据
  let item = null
  if (type === 'vibe-coding') {
    item = vibeCodingProjects.find((p) => p.id === id)
  } else if (type === 'design') {
    item = designProjects.find((p) => p.id === id)
  } else if (type === 'thinking') {
    item = thinkingData.designAI?.items?.find((t) => t.id === id) ||
           thinkingData.life?.items?.find((t) => t.id === id)
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

  // Vibe Coding 类型使用新的详情布局
  if (type === 'vibe-coding') {
    return (
      <PageTransition className="bg-black">
        <BackButton />
        <div className="w-full h-full overflow-y-auto">
          <VibeCodingDetail item={item} />
        </div>
      </PageTransition>
    )
  }

  // Design / Thinking 类型保持原有布局（兼容）
  return (
    <PageTransition className="bg-black">
      <BackButton />

      <div className="w-full h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 pt-24 pb-16">
          <motion.div
            className="rounded-3xl h-64 mb-10 flex items-center justify-center relative overflow-hidden"
            style={{ background: item.coverColor || item.color || '#333' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/30" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-black/10" />
            </div>
            <span className="relative text-7xl opacity-50">
              {type === 'design' ? '🎨' : '✨'}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-2 mb-4 flex-wrap">
              {(item.tags || [item.category]).map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-white/50 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold font-display text-white/90 mb-4">{item.title}</h1>
            {item.date && <p className="text-sm text-white/30 mb-8">{item.date}</p>}

            <div className="prose prose-invert max-w-none">
              <p className="text-white/60 leading-relaxed text-base">
                {item.description || item.excerpt}
              </p>
            </div>

            {item.url && (
              <motion.a
                href={item.url}
                target="_blank" rel="noopener noreferrer"
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
