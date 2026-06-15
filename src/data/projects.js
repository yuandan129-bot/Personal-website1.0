/**
 * Vibe Coding 项目数据
 *
 * type 分类:
 *   'vibe-coding' — 完整的 Vibe Coding 项目（从想法到实现的全栈/前端项目）
 *   'skill'        — Claude Code / AI Skill（可复用的 AI 能力封装）
 *   'agent'        — AI Agent（自主完成任务的智能体）
 *
 * 字段说明:
 *   title               — 项目/Skill/Agent 名称
 *   type                — 分类 key
 *   category            — 分类显示名
 *   tags                — 技术标签
 *   description         — 一句话简介（卡片上显示）
 *   detailedDescription — 详细介绍（支持 **text** 标记加粗高亮）
 *   features            — 功能点列表 [{ title, description }]
 *   usageInstructions   — 使用说明（AI 可基于项目代码自动生成）
 *   image               — 截图/封面图路径（暂用占位符）
 *   coverColor          — 无图片时的渐变背景色
 *   experienceUrl       — 在线体验地址（可选）
 *   githubUrl           — GitHub 仓库地址（可选）
 *   status              — 'live' | 'wip' | 'placeholder'
 */

export const vibeCodingProjects = [
  // ══════════════════════════════════════════
  // Vibe Coding — 完整项目
  // ══════════════════════════════════════════
  {
    id: 'project-1',
    title: 'AI Chat Platform',
    type: 'vibe-coding',
    category: 'Vibe Coding',
    tags: ['React', 'OpenAI', 'Tailwind'],
    description: '基于 GPT-4 的智能对话平台，支持多轮对话和上下文记忆。',
    detailedDescription:
      '一个**从零构建**的 AI 对话平台，核心目标是探索**大语言模型与人交互**的最佳范式。'
      + '支持 **GPT-4 多轮对话**、上下文记忆管理、对话分支等功能。'
      + '前端采用 React + Tailwind 构建响应式界面，后端集成 OpenAI API 并实现了**流式响应**以提升用户体验。',
    features: [
      { title: '多轮对话引擎', description: '支持长上下文记忆，对话不丢失线索，可随时回溯历史分支。' },
      { title: '流式响应', description: '基于 SSE 的字级流式输出，用户无需等待完整响应即可开始阅读。' },
      { title: '对话管理', description: '对话分类、搜索、导出，支持 Markdown 格式保存。' },
    ],
    usageInstructions: null,
    image: null,
    coverColor: '#6c5ce7',
    experienceUrl: 'https://chat.example.com',
    githubUrl: 'https://github.com/example/ai-chat',
    status: 'placeholder',
  },
  {
    id: 'project-2',
    title: 'TaskFlow Kanban',
    type: 'vibe-coding',
    category: 'Vibe Coding',
    tags: ['Next.js', 'Prisma', 'PostgreSQL'],
    description: '拖拽式看板工具，支持实时协作和自动化工作流。',
    detailedDescription:
      '一个**全栈看板应用**，从数据库 Schema 设计到前端拖拽交互全部独立完成。'
      + '核心理念是**本地优先 + 实时同步**——即使离线也能正常使用，联网后自动合并冲突。'
      + '使用 Prisma ORM 管理 PostgreSQL，Next.js API Routes 处理后端逻辑。',
    features: [
      { title: '拖拽看板', description: '流畅的拖拽体验，支持多列、多泳道，自由排序。' },
      { title: '实时协作', description: '多人同时编辑看板，变更实时同步，冲突自动合并。' },
      { title: '自动化规则', description: '满足条件自动移动卡片、分配成员、发送通知。' },
    ],
    usageInstructions: null,
    image: null,
    coverColor: '#00b894',
    experienceUrl: null,
    githubUrl: 'https://github.com/example/taskflow',
    status: 'placeholder',
  },
  {
    id: 'project-3',
    title: 'Pixel Weather',
    type: 'vibe-coding',
    category: 'Vibe Coding',
    tags: ['Vue', 'Canvas', 'Weather API'],
    description: '像素风格天气预报，动态天气动画。',
    detailedDescription:
      '用**复古像素美学**重新诠释天气数据可视化。'
      + '每一帧天气动画都是**纯 Canvas 手绘**——雨滴的像素轨迹、雪花的逐帧飘落、云层的块状移动。'
      + '接入 OpenWeatherMap API，支持全球城市搜索和 7 天预报。',
    features: [
      { title: '像素天气动画', description: '晴天、雨天、雪天、多云各有独特的像素动画场景。' },
      { title: '城市搜索', description: '全球城市实时天气查询，7 天趋势预报。' },
      { title: '像素时钟', description: '内置像素风数字时钟，与天气场景融为一体。' },
    ],
    usageInstructions: null,
    image: null,
    coverColor: '#fd79a8',
    experienceUrl: 'https://pixel-weather.example.com',
    githubUrl: null,
    status: 'placeholder',
  },

  // ══════════════════════════════════════════
  // Skill — AI 技能
  // ══════════════════════════════════════════
  {
    id: 'skill-1',
    title: 'Skill Forge',
    type: 'skill',
    category: 'Skill',
    tags: ['Claude API', 'Node.js', 'SQLite'],
    description: 'AI Skill 创建和管理工具，一键部署到 Claude Code。',
    detailedDescription:
      '让**非开发者也能创建自己的 AI Skill**。通过对话式界面描述需求，Skill Forge 自动生成 Skill 的**完整代码框架**，'
      + '包括工具定义、系统提示词、参数校验和错误处理。一键导出为 Claude Code 可直接加载的格式。',
    features: [
      { title: '对话式创建', description: '用自然语言描述你想要的能力，AI 自动生成 Skill 代码。' },
      { title: '模板市场', description: '内置丰富的 Skill 模板，覆盖常见场景，开箱即用。' },
      { title: '一键部署', description: '生成即部署，无缝集成到 Claude Code 工作流。' },
    ],
    usageInstructions: null,
    image: null,
    coverColor: '#e17055',
    experienceUrl: null,
    githubUrl: 'https://github.com/example/skill-forge',
    status: 'placeholder',
  },
  {
    id: 'skill-2',
    title: 'Code Review Bot',
    type: 'skill',
    category: 'Skill',
    tags: ['GitHub API', 'Claude API', 'TypeScript'],
    description: '自动代码审查 Skill，PR 提交即审查，输出结构化 Review 意见。',
    detailedDescription:
      '一个**自动化的代码审查 Skill**，监听 GitHub PR 事件，在 PR 创建和更新时自动运行。'
      + '审查维度包括**代码质量、安全性、性能、可维护性**四方面，输出结构化的 Review Comment 直接贴到 PR 页面。'
      + '支持自定义审查规则和忽略模式。',
    features: [
      { title: '多维度审查', description: '代码质量、安全漏洞、性能瓶颈、可维护性四维并行检查。' },
      { title: 'PR 集成', description: '审查结果直接作为 PR Comment 提交，无缝融入 GitHub 工作流。' },
      { title: '规则可定制', description: 'YAML 配置文件定义审查规则，适配不同项目的代码规范。' },
    ],
    usageInstructions: null,
    image: null,
    coverColor: '#0984e3',
    experienceUrl: null,
    githubUrl: 'https://github.com/example/code-review-bot',
    status: 'placeholder',
  },

  // ══════════════════════════════════════════
  // Agent — AI 智能体
  // ══════════════════════════════════════════
  {
    id: 'agent-1',
    title: 'Research Agent',
    type: 'agent',
    category: 'Agent',
    tags: ['Claude Agent SDK', 'WebSearch', 'Python'],
    description: '深度研究 Agent，多源搜索→交叉验证→生成结构化报告。',
    detailedDescription:
      '一个**自主研究 Agent**，接收研究课题后自动拆解为子问题，并行搜索多个信息源，'
      + '对搜索结果进行**交叉验证**，剔除不可靠信息，最终生成一份**带引用的结构化研究报告**。'
      + '整个过程无需人工干预，用户只需提出初始问题。',
    features: [
      { title: '自主拆解', description: '将复杂研究课题自动拆解为可并行搜索的子问题。' },
      { title: '交叉验证', description: '多个信源交叉比对，标记信息可信度，排除矛盾结论。' },
      { title: '结构化输出', description: '生成带目录、引用列表、关键发现的完整研究报告。' },
    ],
    usageInstructions: null,
    image: null,
    coverColor: '#6c5ce7',
    experienceUrl: null,
    githubUrl: 'https://github.com/example/research-agent',
    status: 'placeholder',
  },
  {
    id: 'agent-2',
    title: 'Deploy Watcher',
    type: 'agent',
    category: 'Agent',
    tags: ['Vercel API', 'Slack SDK', 'Node.js'],
    description: '部署监控 Agent，自动追踪部署状态并在异常时告警。',
    detailedDescription:
      '一个**运维监控 Agent**，接入 Vercel / Netlify 等平台的部署 Webhook，'
      + '实时追踪每次部署的**构建状态、耗时、变更文件**。当检测到部署失败或构建时间异常增长时，'
      + '自动发送 Slack / 飞书通知并附带诊断信息。',
    features: [
      { title: '实时监控', description: 'Webhook 接入，部署事件秒级响应。' },
      { title: '异常告警', description: '部署失败、构建超时、Bundle 体积异常增长自动通知。' },
      { title: '趋势分析', description: '部署频率、成功率、构建耗时趋势图表。' },
    ],
    usageInstructions: null,
    image: null,
    coverColor: '#00b894',
    experienceUrl: null,
    githubUrl: 'https://github.com/example/deploy-watcher',
    status: 'placeholder',
  },

  // ══════════════════════════════════════════
  // 占位卡片 — 后续替换
  // ══════════════════════════════════════════
  {
    id: 'placeholder-1',
    title: '即将上线',
    type: 'vibe-coding',
    category: 'Vibe Coding',
    tags: [],
    description: '更多项目正在整理中，敬请期待。',
    detailedDescription: '',
    features: [],
    usageInstructions: null,
    image: null,
    coverColor: '#2d2d3f',
    experienceUrl: null,
    githubUrl: null,
    status: 'placeholder',
  },
  {
    id: 'placeholder-2',
    title: '即将上线',
    type: 'skill',
    category: 'Skill',
    tags: [],
    description: '更多 Skill 正在整理中，敬请期待。',
    detailedDescription: '',
    features: [],
    usageInstructions: null,
    image: null,
    coverColor: '#2d2d3f',
    experienceUrl: null,
    githubUrl: null,
    status: 'placeholder',
  },
  {
    id: 'placeholder-3',
    title: '即将上线',
    type: 'agent',
    category: 'Agent',
    tags: [],
    description: '更多 Agent 正在整理中，敬请期待。',
    detailedDescription: '',
    features: [],
    usageInstructions: null,
    image: null,
    coverColor: '#2d2d3f',
    experienceUrl: null,
    githubUrl: null,
    status: 'placeholder',
  },
]
