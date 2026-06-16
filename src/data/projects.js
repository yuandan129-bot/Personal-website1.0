/**
 * Vibe Coding 项目数据
 *
 * type 分类:
 *   'vibe-coding' — 完整的 Vibe Coding 项目（从想法到实现的全栈/前端项目）
 *   'skill'        — Claude Code / AI Skill（可复用的 AI 能力封装）
 *   'agent'        — AI Agent（自主完成任务的智能体）
 *
 * 字段说明:
 *   title        — 项目/Skill/Agent 名称
 *   type         — 分类 key
 *   category     — 分类显示名
 *   tags         — 技术标签
 *   description  — 一句话简介（卡片上显示）
 *   steps        — 功能流程步骤（按顺序展示）
 *   coverColor   — 无图片时的渐变背景色
 *   experienceUrl— 在线体验地址（可选）
 *   githubUrl    — GitHub 仓库地址
 *   status       — 'live' | 'placeholder'
 */

export const vibeCodingProjects = [
  // ══════════════════════════════════════════
  // Vibe Coding — 完整项目
  // ══════════════════════════════════════════
  {
    id: 'food-risk-scanner',
    title: 'Food Risk Scanner',
    type: 'vibe-coding',
    category: 'Vibe Coding',
    tags: ['TypeScript', 'Next.js', 'AI', '食品'],
    description: '校对食物成分与风险的智能工具，扫描食品标签识别潜在负面成分与添加剂。',
    steps: [
      '扫描食品包装成分表',
      'AI 识别潜在风险成分与添加剂',
      '输出风险等级与健康建议',
    ],
    coverColor: '#27ae60',
    experienceUrl: 'https://food-risk-scanner.vercel.app',
    githubUrl: 'https://github.com/yuandan129-bot/Food-Risk-Scanner',
    status: 'live',
  },
  {
    id: 'product-packaging-review',
    title: 'Product Packaging Review',
    type: 'vibe-coding',
    category: 'Vibe Coding',
    tags: ['TypeScript', 'Next.js', 'AI', '合规'],
    description: '食品包装背标合规性智能审核——自动检查 9 大强制标注要素、营养成分表验证、广告法禁用词检测。',
    steps: [
      '上传包装背标图片',
      'OCR 提取文字 + AI 解析',
      '对照国标检查 9 大强制标注要素',
      '营养成分表数值验证',
      '广告法禁用词扫描',
      '生成合规体检报告',
    ],
    coverColor: '#2563eb',
    experienceUrl: 'https://product-packaging-review.vercel.app',
    githubUrl: 'https://github.com/yuandan129-bot/Product-packaging-review',
    status: 'live',
  },
  {
    id: 'barcode-generator',
    title: 'Barcode Generator',
    type: 'vibe-coding',
    category: 'Vibe Coding',
    tags: ['TypeScript', 'Next.js', '条码', '工具'],
    description: '产品条码在线生成工具，支持多种条码格式，快速生成可打印的产品条码。',
    steps: [
      '选择条码格式（EAN-13 / UPC-A / CODE-128 等）',
      '输入产品编码',
      '配置尺寸与输出参数',
      '生成并下载可打印条码',
    ],
    coverColor: '#7c3aed',
    experienceUrl: 'https://product-packaging-review.vercel.app/barcode',
    githubUrl: 'https://github.com/yuandan129-bot/Product-packaging-review',
    status: 'live',
  },

  // ══════════════════════════════════════════
  // Skill — AI 技能
  // ══════════════════════════════════════════
  {
    id: 'text-note-skill',
    title: 'Text Note · 便签 Skill',
    type: 'skill',
    category: 'Skill',
    tags: ['Python', 'Pillow', 'Claude Skill', '排版'],
    description: '一键将纯文本转为精美 JPG 长图——结构化排版、表格、金句、插图，便于传播和分享。',
    steps: [
      '粘贴文本内容',
      'AI 自动识别标题/正文/金句/表格结构',
      'MiSans 字体排版 + 两端对齐 + 孤字控制',
      '可选：豆包 Seedream 生成小黑猫手绘插图',
      '渲染输出 JPG 长图',
    ],
    coverColor: '#d97706',
    experienceUrl: null,
    githubUrl: 'https://github.com/yuandan129-bot/text-note.skill',
    status: 'live',
  },

  // ══════════════════════════════════════════
  // Agent — AI 智能体
  // ══════════════════════════════════════════
  {
    id: 'competitor-insight-agent',
    title: '竞品卖点分析 Agent',
    type: 'agent',
    category: 'Agent',
    tags: ['扣子', 'OCR', 'Claude', '飞书 MCP'],
    description: '上传竞品包装图片 → OCR 提取卖点 → 按类型分类归整 → 竞品横向对比 → 输出产品突破策略建议。全链路自主完成，结果自动写入飞书表格。',
    steps: [
      '上传竞品包装图片（支持批量）',
      'OCR 提取包装文字信息',
      '按规范分类卖点：产地卖点 / 功能卖点 / 原料卖点 / 品牌卖点',
      '同类竞品横向对比，整理卖点矩阵',
      '结合自身产品定位，给出突破口建议',
      '（规划中）连接飞书 MCP，自动生成多维表格',
    ],
    coverColor: '#dc2626',
    experienceUrl: null,
    githubUrl: null,
    status: 'placeholder',
  },

  // ══════════════════════════════════════════
  // 占位卡片 — 待补充
  // ══════════════════════════════════════════
  {
    id: 'placeholder-agent',
    title: '即将上线',
    type: 'agent',
    category: 'Agent',
    tags: [],
    description: '更多 Agent 正在筹备中，敬请期待。',
    steps: [],
    coverColor: '#2d2d3f',
    experienceUrl: null,
    githubUrl: null,
    status: 'placeholder',
  },
]
