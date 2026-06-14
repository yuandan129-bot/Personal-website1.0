# Personal Site — 作品集个人网站

## 技术栈
- **Vite 5** + **React 18** + **Tailwind CSS 3**
- **Framer Motion** 页面过渡动画
- **Three.js** WebGL 效果（SteamEffect 等）
- **@radix-ui/react-switch** 开关组件

## 项目结构

```
src/
├── App.jsx                    # 路由 + 全局 GlassNav 导航栏
├── main.jsx                   # 入口
├── index.css                  # Tailwind + 全局样式
├── components/
│   ├── DayNightReveal.jsx     # ★ 首页核心：日夜切换 + 波浪溶解扩散
│   ├── DayNightToggle.jsx     # 右上角 Day/Night Radix 开关
│   ├── LiveClock.jsx          # 左下角 12h 实时数字时钟（Montserrat）
│   ├── VideoFrame.jsx         # 视频框容器（overflow:hidden，内容不可溢出）
│   ├── SteamEffect.jsx        # 茶杯热汽 WebGL 效果（当前隐藏 {false &&}）
│   ├── GlassNav.jsx           # 底部 4 按钮玻璃导航栏
│   ├── GlassSurface.jsx/.css  # SVG feDisplacementMap 玻璃色散面板
│   ├── PageTransition.jsx     # Framer Motion 页面过渡
│   ├── BackButton.jsx         # 子页返回按钮
│   ├── ProjectCard.jsx        # VibeCoding 项目卡片
│   ├── InfiniteCanvas.jsx     # Design 无限画布
│   ├── DesignModal.jsx        # Design 弹窗
│   ├── ThinkingColumn.jsx     # Thinking 列布局
│   └── ThinkingModal.jsx      # Thinking 弹窗
├── pages/
│   ├── HomePage.jsx           # 首页（只有 DayNightReveal）
│   ├── VibeCodingPage.jsx
│   ├── DesignPage.jsx
│   ├── ThinkingPage.jsx
│   └── DetailPage.jsx
└── data/
    ├── projects.js
    ├── designs.js
    └── thinkings.js
```

## 首页架构（DayNightReveal）

### 设计稿固定尺寸
- **画布尺寸**: 2322 × 1307（背景图原始分辨率）
- **等比缩放**: `min(视口宽/2322, 视口高/1307)`，居中显示
- **布局状态**: `{ scale, left, top }` 在 useState 初始化中计算，resize 时更新
- **规则**: 所有定位元素使用 `% + px`，基于 2322×1307 坐标系

### 日夜切换动画
- 点击画面任意位置 → 从点击处波浪溶解扩散
- 右上角 Day/Night 开关也可触发
- 动画时长 1600ms，easeOutExpo 曲线
- 6 层同心圆波叠加，最外层 1.22× 半径冲击
- 遮罩计算在 rAF 回调中执行，存入 `animMaskRef`，render 只读取

### 当前元素位置

| 元素 | 定位 | 参数 |
|------|------|------|
| 时钟 | absolute, 左下 | `left: calc(7% + 250px)`, `bottom: calc(20% + 87px)`, `transform: rotate(-2.5deg) scale(1.35)` |
| 视频框 | absolute, 居中偏上 | `width: 755, height: 446`, `left: calc(50% - 25px)`, `top: calc(45% - 110px)`, `transform: translate(-50%, -50%)` |
| 开关 | fixed, 右上角 | `top: 20px, right: 20px` |
| 导航栏 | fixed, 底部 | GlassNav（4 个玻璃按钮） |

### 时钟规格（LiveClock）
- 12 小时制 `HH MM SS`，秒数上下竖排于时/分之间
- Montserrat 300（时钟自重 600，秒 500）
- 字号 50px，秒数 23px
- 白天全透明 opacity:1，夜晚 opacity:0.5，transition 1s
- 动画中时钟跟随 `expandAnim.isDayTarget`，与波浪同步

### 背景图
- `public/images/night.png` — 夜晚（2322×1307）
- `public/images/day.png` — 白天（2322×1307）
- 视频模式开关 `USE_VIDEO = false`，改为 `true` 后使用 `public/videos/night.mp4` 和 `day.mp4`

## VideoFrame 组件

```jsx
<VideoFrame width={755} height={446} style={{ ... }}>
  {/* 所有视频/动效内容放这里 */}
</VideoFrame>
```

### 规则（★ 重要）
- `overflow: hidden` — 所有内容不可溢出框外
- 背景色 `#000000`
- 边框 `1px solid rgba(255,255,255,0.15)`
- 圆角 `4px`
- `children` 为空时显示 "VIDEO PLACEHOLDER" 占位文字
- 所有视频框内的动效、shader、粒子等，必须渲染在 VideoFrame 内部

## 其他页面
- `/vibe-coding` — 项目卡片网格
- `/design` — 无限画布
- `/thinking` — 思考列
- `/vibe-coding/:id` 等详情页
- 所有子页通过底部 GlassNav 导航

## 依赖
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.22.0",
  "framer-motion": "^11.0.0",
  "three": "^0.184.0",
  "@radix-ui/react-switch": "latest"
}
```
