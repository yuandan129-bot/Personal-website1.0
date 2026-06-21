import { AnimatedLetterText } from './ui/AnimatedLetterText'
import ShinyText from './ui/ShinyText'
import CircularGallery from './ui/CircularGallery'
import BounceCards from './ui/BounceCards'

/**
 * VideoFrameContent — VideoFrame 内部的双图层 day/night 内容容器
 *
 * 架构规则：
 * - Night 图层：夜晚动效内容（默认可见）
 * - Day 图层：白天动效内容（isDay 时可见）
 * - 两个图层使用 opacity 交叉淡入淡出，transition 与时钟同步（1s ease）
 * - 每个图层内部独立布局：上方 1/3 标题区 + 下方 2/3 卡片动效区
 *
 * @param {boolean} isDay - 当前是否白天状态（含动画中的过渡状态）
 */

export default function VideoFrameContent({ isDay = false }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* ================================================================ */}
      {/*  🌙 Night 图层                                               */}
      {/* ================================================================ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          opacity: isDay ? 0 : 1,
          transition: 'opacity 1s ease',
          pointerEvents: isDay ? 'none' : 'auto',
        }}
      >
        {/* 上方 1/3：标题 */}
        <NightTitle />
        {/* 下方 2/3：卡片动效 */}
        <NightCards />
      </div>

      {/* ================================================================ */}
      {/*  ☀️ Day 图层                                                 */}
      {/* ================================================================ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          opacity: isDay ? 1 : 0,
          transition: 'opacity 1s ease',
          pointerEvents: isDay ? 'auto' : 'none',
        }}
      >
        {/* 上方 1/3：标题 */}
        <DayTitle />
        {/* 下方 2/3：卡片动效 */}
        <DayCards />
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Night 子组件                                                      */
/* ================================================================== */

function NightTitle() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ height: '33.333%', paddingTop: '62px' }}
    >
      <AnimatedLetterText
        text="Portfolio"
        letterToReplace="o"
        className="text-[4.25rem]"
        shiny
        shineColor="#ffffff"
        shineSpeed={2.5}
      />
      <ShinyText
        text="Where ideas meet motion"
        speed={2.5}
        color="#8b8b8b"
        shineColor="#ffffff"
        spread={100}
        direction="left"
        className="mt-[6px]"
        style={{
          fontSize: '13px',
          fontFamily: "'Montserrat', 'Inter', sans-serif",
          letterSpacing: '0.15em',
        }}
      />
    </div>
  )
}

// 本地占位图片 — 后续替换为正式素材（卡片尺寸 700:900 竖版）
const NIGHT_GALLERY_IMAGES = [
  { image: '/images/day-card-1.webp', text: 'Project 01' },
  { image: '/images/day-card-2.webp', text: 'Project 02' },
  { image: '/images/day-card-3.webp', text: 'Project 03' },
  { image: '/images/day-card-4.webp', text: 'Project 04' },
  { image: '/images/day-card-5.webp', text: 'Project 05' },
]

function NightCards() {
  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
      }}
    >
      <CircularGallery
        items={NIGHT_GALLERY_IMAGES}
        bend={3}
        textColor="#ffffff"
        borderRadius={0.05}
        scrollEase={0.02}
        font="bold 14px Montserrat"
      />
    </div>
  )
}

/* ================================================================== */
/*  Day 子组件                                                        */
/* ================================================================== */

function DayTitle() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ height: '33.333%', paddingTop: '52px' }}
    >
      <AnimatedLetterText
        text="Contact me"
        letterToReplace=" "
        className="text-[58px]"
        textColor="#e0e0e0"
      />
      <p
        style={{
          color: 'var(--muted-foreground, rgba(255,255,255,0.45))',
          fontSize: '16px',
          fontFamily: "'Montserrat', 'Inter', sans-serif",
          letterSpacing: '0.15em',
          marginTop: '6px',
        }}
      >
        Infinite Progress
      </p>
    </div>
  )
}

const DAY_BOUNCE_IMAGES = [
  '/images/day-card-1.webp',
  '/images/day-card-2.webp',
  '/images/day-card-3.webp',
  '/images/day-card-4.webp',
  '/images/day-card-5.webp',
]

function DayCards() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BounceCards
        images={DAY_BOUNCE_IMAGES}
        containerWidth={500}
        containerHeight={220}
        animationDelay={0.3}
        animationStagger={0.08}
        easeType="elastic.out(1, 0.5)"
        transformStyles={[
          'rotate(5deg) translate(-185px)',
          'rotate(0deg) translate(-79px)',
          'rotate(-5deg)',
          'rotate(5deg) translate(79px)',
          'rotate(-5deg) translate(185px)',
        ]}
        enableHover
      />
    </div>
  )
}

/* ================================================================== */
/*  通用小组件                                                        */
/* ================================================================== */

function Subtitle({ text }) {
  return (
    <p
      style={{
        color: 'var(--muted-foreground, rgba(255,255,255,0.45))',
        fontSize: '13px',
        fontFamily: "'Montserrat', 'Inter', sans-serif",
        letterSpacing: '0.15em',
        marginTop: '6px',
      }}
    >
      {text}
    </p>
  )
}
