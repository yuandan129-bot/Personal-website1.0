/**
 * 媒体类型检测 — 根据文件扩展名返回 'image' | 'video' | 'gif'
 * 用于 DesignModal 和 InfiniteCanvas 自动选择渲染方式
 *
 * 支持格式：
 *   图片：png / jpg / jpeg / webp / svg
 *   视频：mp4 / webm / mov / avi  → 弹窗自动显示播放控件，画布显示首帧缩略图
 *   GIF：gif                    → img 标签原生循环播放
 *
 * 使用方式：
 *   // 单视频
 *   { video: '/images/design/demo.mp4' }
 *
 *   // 单 GIF
 *   { image: '/images/design/demo.gif' }
 *
 *   // 多媒体混合（图片 + 视频 + GIF 任意组合）
 *   { images: [
 *       '/images/design/img1.png',
 *       '/images/design/video1.mp4',
 *       '/images/design/anim.gif',
 *     ]
 *   }
 */
export function getMediaType(src) {
  if (!src || typeof src !== 'string') return 'image'
  const ext = src.split('.').pop().toLowerCase().split('?')[0]
  if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return 'video'
  if (ext === 'gif') return 'gif'
  return 'image'
}

export const designProjects = [
  {
    id: 'd-1', title: '元气森林 品牌视觉', category: '品牌设计', size: 'S',
    color: '#e8f5e9', textColor: '#2e7d32', accentColor: '#43a047',
    year: '2024', tags: ['品牌', 'LOGO', 'VI'],
    image: '/images/design/Design1.webp', imgW: 1844, imgH: 1386,
    description: '为新锐饮品品牌元气森林打造的完整品牌视觉体系，包含 LOGO 设计、VI 手册、包装规范及线上视觉延展。从品牌策略出发，构建兼具年轻感与品质感的视觉语言。',
  },

  {
    id: 'd-3', title: '三顿半 包装设计', category: '包装设计', size: 'S',
    color: '#fff3e0', textColor: '#e65100', accentColor: '#f57c00',
    year: '2024', tags: ['包装', '咖啡', '极简'],
    image: '/images/design/Design3.webp', imgW: 1844, imgH: 1386,
    images: [
      '/images/design/Design3/ChatGPT Image Jun 18, 2026, 11_51_22 PM.webp',
      '/images/design/Design3/ChatGPT Image Jun 19, 2026, 10_21_42 AM.webp',
      '/images/design/Design3/ChatGPT Image Jun 19, 2026, 10_54_34 AM.webp',
      '/images/design/Design3/ChatGPT Image Jun 19, 2026, 11_03_56 AM.webp',
      '/images/design/Design3/ChatGPT Image Jun 19, 2026, 11_05_42 AM.webp',
      '/images/design/Design3/ChatGPT Image Jun 19, 2026, 11_07_12 AM.webp',
      '/images/design/Design3/ChatGPT Image Jun 19, 2026, 12_19_36 AM.webp',
      '/images/design/Design3/ChatGPT Image Jun 21, 2026, 05_30_14 PM.webp',
    ],
    description: '为精品咖啡品牌三顿半设计的胶囊系列包装，以极简几何形态传达品牌的高级感和辨识度。通过结构与色彩的系统化设计，建立完整的货架识别体系。',
  },
  {
    id: 'd-4', title: '小红书 社区插画', category: '插画', size: 'S',
    color: '#f3e5f5', textColor: '#6a1b9a', accentColor: '#8e24aa',
    year: '2023', tags: ['插画', '社区', '系列'],
    image: '/images/design/Design4.webp', imgW: 1844, imgH: 1386,
    images: [
      '/images/design/Design4/ChatGPT Image Jun 21, 2026, 06_04_27 PM.webp',
      '/images/design/Design4/ChatGPT Image Jun 21, 2026, 06_39_38 PM.webp',
      '/images/design/Design4/ChatGPT Image Jun 21, 2026, 07_30_48 PM.webp',
    ],
    description: '为小红书社区板块创作的系列插画，涵盖节日、活动、日常场景等多种主题风格。以温暖治愈的笔触传递社区温度，增强用户情感共鸣。',
  },
  {
    id: 'd-5', title: '蔚来 NIO Life', category: '品牌设计', size: 'S',
    color: '#e3f2fd', textColor: '#1565c0', accentColor: '#1e88e5',
    year: '2024', tags: ['品牌', '出行', '全案'],
    image: '/images/design/Design5.webp', imgW: 1844, imgH: 1386,
    images: [
      '/images/design/Design5/ChatGPT Image Jun 19, 2026, 11_24_45 AM.webp',
      '/images/design/Design5/ChatGPT Image Jun 19, 2026, 11_27_58 AM.webp',
      '/images/design/Design5/ChatGPT Image Jun 19, 2026, 11_47_01 AM.webp',
      '/images/design/Design5/ChatGPT Image Jun 19, 2026, 12_03_51 PM.webp',
      '/images/design/Design5/ChatGPT Image Jun 19, 2026, 12_11_20 PM.webp',
      '/images/design/Design5/ChatGPT Image Jun 19, 2026, 12_31_11 PM.webp',
      '/images/design/Design5/ChatGPT Image Jun 19, 2026, 12_34_47 PM.webp',
      '/images/design/Design5/ChatGPT Image Jun 19, 2026, 12_41_28 PM.webp',
    ],
    description: '蔚来生活方式品牌 NIO Life 的视觉升级，从品牌策略到视觉执行的全案设计。涵盖服饰、家居、户外等多品类，打造高端生活方式视觉体系。',
  },
  {
    id: 'd-6', title: '喜茶 限时快闪', category: '空间设计', size: 'S',
    color: '#e0f7fa', textColor: '#00838f', accentColor: '#00acc1',
    year: '2023', tags: ['空间', '快闪', '体验'],
    image: '/images/design/Design6.webp', imgW: 1844, imgH: 1386,
    images: [
      '/images/design/Design6/ChatGPT Image Jun 20, 2026, 10_08_40 PM.webp',
      '/images/design/Design6/ChatGPT Image Jun 20, 2026, 10_16_55 PM.webp',
      '/images/design/Design6/ChatGPT Image Jun 20, 2026, 10_49_54 PM.webp',
      '/images/design/Design6/ChatGPT Image Jun 20, 2026, 11_17_32 PM.webp',
    ],
    description: '喜茶限时快闪店的空间视觉设计，将茶文化与现代装置艺术融合，创造独特的沉浸式消费体验。从空间动线到视觉落点，每个细节都服务于品牌叙事。',
  },
  {
    id: 'd-7', title: '腾讯 公益H5', category: 'UI设计', size: 'S',
    color: '#fff8e1', textColor: '#f9a825', accentColor: '#fbc02d',
    year: '2024', tags: ['UI', 'H5', '公益'],
    image: '/images/design/Design7.webp', imgW: 1844, imgH: 1386,
    images: [
      '/images/design/Design7/ChatGPT Image Jun 16, 2026, 10_24_37 PM.webp',
      '/images/design/Design7/ChatGPT Image Jun 16, 2026, 10_43_40 PM.webp',
      '/images/design/Design7/ChatGPT Image Jun 19, 2026, 05_12_18 PM.webp',
      '/images/design/Design7/ChatGPT Image Jun 19, 2026, 05_42_31 PM.webp',
      '/images/design/Design7/ChatGPT Image Jun 19, 2026, 05_58_38 PM.webp',
      '/images/design/Design7/ChatGPT Image Jun 19, 2026, 06_38_59 PM.webp',
    ],
    description: '腾讯公益 99 公益日 H5 页面设计，以温暖的视觉语言传递公益力量，提升用户参与度和捐赠转化。注重情感化设计与无障碍体验。',
  },
  {
    id: 'd-8', title: '泡泡玛特 盲盒', category: '包装设计', size: 'M',
    color: '#fce4ec', textColor: '#ad1457', accentColor: '#d81b60',
    year: '2023', tags: ['包装', '潮玩', '联名'],
    image: '/images/design/Design8.webp', imgW: 1844, imgH: 2202,
    images: [
      '/images/design/Design8/8.1.webp',
      '/images/design/Design8/8.2.webp',
      '/images/design/Design8/8.3.webp',
      '/images/design/Design8/8.4.webp',
      '/images/design/Design8/8.5.webp',
      '/images/design/Design8/8.6.webp',
    ],
    description: '泡泡玛特联名盲盒系列的包装设计，以潮流插画风格打造收藏级的开箱体验。通过材质、工艺与视觉的配合，提升产品的收藏仪式感。',
  },
  {
    id: 'd-9', title: '字节 飞书品牌书', category: '品牌设计', size: 'M',
    color: '#e8eaf6', textColor: '#283593', accentColor: '#3949ab',
    year: '2024', tags: ['品牌', '规范', '手册'],
    image: '/images/design/Design9.webp', imgW: 1844, imgH: 2202,
    images: [
      '/images/design/Design9/9.1.webp',
      '/images/design/Design9/9.2.webp',
      '/images/design/Design9/9.3.webp',
      '/images/design/Design9/9.4.webp',
      '/images/design/Design9/9.5.webp',
    ],
    description: '飞书品牌规范手册的设计与编排，确保品牌在各触点的一致性和专业性。从色彩、字体、图形到版式，建立完整的设计语言系统。',
  },
  {
    id: 'd-10', title: '得物 潮流插画', category: '插画', size: 'M',
    color: '#efebe9', textColor: '#4e342e', accentColor: '#6d4c41',
    year: '2024', tags: ['插画', '潮流', '电商'],
    image: '/images/design/Design10.webp', imgW: 1844, imgH: 2202,
    images: [
      '/images/design/Design10/ChatGPT Image Jun 19, 2026, 10_14_02 PM.webp',
      '/images/design/Design10/ChatGPT Image Jun 19, 2026, 10_28_28 PM.webp',
      '/images/design/Design10/ChatGPT Image Jun 20, 2026, 01_36_40 PM.webp',
      '/images/design/Design10/ChatGPT Image Jun 20, 2026, 01_37_24 PM.webp',
      '/images/design/Design10/ChatGPT Image Jun 20, 2026, 12_48_24 PM.webp',
      '/images/design/Design10/ChatGPT Image Jun 20, 2026, 12_59_35 PM.webp',
      '/images/design/Design10/ChatGPT Image Jun 21, 2026, 03_17_52 PM.webp',
    ],
    description: '为得物 App 创作的潮流风格插画系列，覆盖球鞋、潮服、数码等多个品类。以大胆的色彩和动感的构图，塑造年轻化的品牌视觉调性。',
  },
  {
    id: 'd-11', title: '美团 买菜品牌', category: '品牌设计', size: 'S',
    color: '#e8f5e9', textColor: '#1b5e20', accentColor: '#2e7d32',
    year: '2023', tags: ['品牌', '生鲜', '电商'],
    image: '/images/design/Design11.webp', imgW: 1844, imgH: 1386,
    description: '美团买菜品牌视觉升级，以新鲜、快捷为核心概念，打造亲民的生鲜电商品牌形象。从 LOGO 到全链路触点，传递"鲜"的品牌心智。',
  },
]
