/**
 * LearningHubPage - Modular Learning Hub
 *
 * Google Learning-inspired design philosophy:
 * - Progressive information disclosure (avoid overload)
 * - Self-directed exploration
 * - Gamification through discovery
 * - Modular resource organization
 */

import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { getStorageItem, setStorageItem, getStorageJSON } from '@/lib/storage'
import { PersistentHeader } from '@/components/shared'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  BookOpen,
  Gamepad2,
  FlaskConical,
  History,
  Calculator,
  Microscope,
  ChevronRight,
  Sparkles,
  Star,
  Play,
  Eye,
  Award,
  TrendingUp,
  Library,
  ExternalLink
} from 'lucide-react'

// Learning path types
type LearningPath = 'explorer' | 'builder' | 'researcher'

interface LearningModule {
  id: string
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  icon: React.ReactNode
  color: string
  route: string
  category: 'learn' | 'explore' | 'create' | 'discover'
  difficulty: 1 | 2 | 3
  estimatedTime?: string
  prerequisites?: string[]
  rewards?: string[]
}

// Core learning modules - organized for progressive disclosure
const LEARNING_MODULES: LearningModule[] = [
  // DISCOVER - Entry points for beginners
  {
    id: 'chronicles',
    titleEn: 'Chronicles of Light',
    titleZh: '光的编年史',
    descriptionEn: 'Journey through 400 years of optical discoveries',
    descriptionZh: '穿越400年光学发现之旅',
    icon: <History className="w-6 h-6" />,
    color: '#F59E0B',
    route: '/chronicles',
    category: 'discover',
    difficulty: 1,
    estimatedTime: '15-30 min',
    rewards: ['Historical Context', 'Scientist Stories']
  },
  {
    id: 'demos',
    titleEn: 'Interactive Demos',
    titleZh: '交互式演示',
    descriptionEn: 'See polarization physics in action',
    descriptionZh: '观看偏振物理的实际运作',
    icon: <Play className="w-6 h-6" />,
    color: '#22D3EE',
    route: '/demos',
    category: 'discover',
    difficulty: 1,
    estimatedTime: '5-10 min each',
    rewards: ['Visual Understanding', 'Intuition']
  },

  // LEARN - Structured curriculum
  {
    id: 'course',
    titleEn: 'P-SRT Course',
    titleZh: 'P-SRT课程',
    descriptionEn: 'Complete 5-unit polarization curriculum',
    descriptionZh: '完整的5单元偏振课程',
    icon: <BookOpen className="w-6 h-6" />,
    color: '#8B5CF6',
    route: '/course',
    category: 'learn',
    difficulty: 2,
    estimatedTime: '10+ hours',
    rewards: ['Deep Knowledge', 'Certificates']
  },

  // EXPLORE - Self-directed learning
  {
    id: 'games',
    titleEn: 'Puzzle Games',
    titleZh: '益智游戏',
    descriptionEn: 'Learn by solving light puzzles',
    descriptionZh: '通过解决光学谜题学习',
    icon: <Gamepad2 className="w-6 h-6" />,
    color: '#EC4899',
    route: '/games',
    category: 'explore',
    difficulty: 1,
    estimatedTime: '5-30 min',
    rewards: ['Problem Solving', 'Fun!']
  },
  {
    id: 'optical-studio',
    titleEn: 'Optical Design Studio',
    titleZh: '光学设计工作室',
    descriptionEn: 'Create your own optical systems',
    descriptionZh: '创建你自己的光学系统',
    icon: <Sparkles className="w-6 h-6" />,
    color: '#10B981',
    route: '/studio',
    category: 'create',
    difficulty: 2,
    estimatedTime: 'Unlimited',
    rewards: ['Creativity', 'Design Skills']
  },

  // CREATE - Advanced tools
  {
    id: 'lab',
    titleEn: 'Research Lab',
    titleZh: '研究实验室',
    descriptionEn: 'Conduct virtual experiments',
    descriptionZh: '进行虚拟实验',
    icon: <FlaskConical className="w-6 h-6" />,
    color: '#6366F1',
    route: '/research',
    category: 'create',
    difficulty: 3,
    estimatedTime: '30+ min',
    prerequisites: ['course'],
    rewards: ['Research Skills', 'Data Analysis']
  },
  {
    id: 'calculators',
    titleEn: 'Calculation Workshop',
    titleZh: '计算工作坊',
    descriptionEn: 'Jones, Stokes, Mueller calculators',
    descriptionZh: 'Jones、Stokes、Mueller计算器',
    icon: <Calculator className="w-6 h-6" />,
    color: '#0891B2',
    route: '/calc',
    category: 'create',
    difficulty: 3,
    prerequisites: ['course'],
    rewards: ['Mathematical Mastery']
  }
]

// Quick start paths for different learner types
const LEARNING_PATHS = [
  {
    id: 'explorer' as LearningPath,
    titleEn: 'Explorer',
    titleZh: '探索者',
    descriptionEn: 'I want to discover and play',
    descriptionZh: '我想探索和玩耍',
    icon: <Compass className="w-8 h-8" />,
    color: '#F59E0B',
    suggestedModules: ['games', 'demos', 'chronicles']
  },
  {
    id: 'builder' as LearningPath,
    titleEn: 'Builder',
    titleZh: '建造者',
    descriptionEn: 'I want to create and design',
    descriptionZh: '我想创造和设计',
    icon: <Sparkles className="w-8 h-8" />,
    color: '#10B981',
    suggestedModules: ['optical-studio', 'games', 'demos']
  },
  {
    id: 'researcher' as LearningPath,
    titleEn: 'Researcher',
    titleZh: '研究者',
    descriptionEn: 'I want deep understanding',
    descriptionZh: '我想深入理解',
    icon: <Microscope className="w-8 h-8" />,
    color: '#8B5CF6',
    suggestedModules: ['course', 'lab', 'calculators']
  }
]

// ============================================================================
// Classic Books & Recommended Reading
// ============================================================================

interface BookRecommendation {
  id: string
  titleZh: string
  titleEn: string
  author: string
  authorEn?: string
  descriptionZh: string
  descriptionEn: string
  category: 'polarization' | 'surface-wetting' | 'biomimetics' | 'optics-general' | 'interdisciplinary'
  coverColor: string // 用于无封面时的颜色标识
  isbn?: string
  year?: number
  publisher?: string
  keywords: string[]
  level: 'introductory' | 'intermediate' | 'advanced'
}

const BOOK_CATEGORY_INFO: Record<string, { labelZh: string; labelEn: string; color: string }> = {
  'polarization': { labelZh: '偏振光学', labelEn: 'Polarization Optics', color: '#8B5CF6' },
  'surface-wetting': { labelZh: '表面与浸润', labelEn: 'Surface & Wetting', color: '#0891B2' },
  'biomimetics': { labelZh: '仿生学', labelEn: 'Biomimetics', color: '#10B981' },
  'optics-general': { labelZh: '光学基础', labelEn: 'General Optics', color: '#F59E0B' },
  'interdisciplinary': { labelZh: '交叉学科', labelEn: 'Interdisciplinary', color: '#EC4899' },
}

const RECOMMENDED_BOOKS: BookRecommendation[] = [
  // 表面与浸润
  {
    id: 'mighty-microforces',
    titleZh: '微力无边：神奇的毛细和浸润现象',
    titleEn: 'Mighty Microforces: Wonderful Capillary and Wetting Phenomena',
    author: '袁泉子',
    authorEn: 'Yuan Quanzi',
    descriptionZh: '从咖啡环到荷叶效应，以生动的笔触揭示毛细力和浸润现象背后的物理之美。带你领略液滴在微纳表面的奇妙行为，是理解表面微结构与疏水浸润的绝佳入门读物。',
    descriptionEn: 'From coffee rings to the lotus effect, this book reveals the physics behind capillary forces and wetting phenomena. An excellent introduction to surface microstructures and hydrophobic wetting.',
    category: 'surface-wetting',
    coverColor: '#0891B2',
    year: 2020,
    publisher: '科学出版社',
    keywords: ['毛细力', '浸润', '接触角', '表面张力', '疏水', '亲水', '咖啡环效应'],
    level: 'introductory',
  },
  {
    id: 'capillarity-wetting',
    titleZh: '毛细力与浸润',
    titleEn: 'Capillarity and Wetting Phenomena',
    author: 'P.-G. de Gennes, F. Brochard-Wyart, D. Quéré',
    descriptionZh: '诺贝尔奖得主de Gennes等人的经典著作。系统介绍液滴、气泡、薄膜等界面现象的物理学，深入探讨浸润、铺展、毛细上升等基本过程。',
    descriptionEn: 'Classic text by Nobel laureate de Gennes. Systematically covers the physics of drops, bubbles, pearls, and waves — the fundamentals of wetting, spreading, and capillary rise.',
    category: 'surface-wetting',
    coverColor: '#0E7490',
    year: 2004,
    publisher: 'Springer',
    isbn: '978-0387005928',
    keywords: ['浸润', '毛细力', '接触角', '铺展', '薄膜', '界面现象'],
    level: 'intermediate',
  },
  {
    id: 'superhydrophobic-surfaces',
    titleZh: '超疏水表面：理论基础与工程应用',
    titleEn: 'Superhydrophobic Surfaces',
    author: 'Bharat Bhushan (编)',
    descriptionZh: '全面介绍超疏水表面的制备原理、微纳结构设计和实际应用。从荷叶效应出发，探讨仿生超疏水材料在自清洁、防冰、减阻等领域的前沿进展。',
    descriptionEn: 'Comprehensive coverage of superhydrophobic surface preparation, micro/nano structure design, and applications. From lotus effect to self-cleaning, anti-icing, and drag reduction.',
    category: 'surface-wetting',
    coverColor: '#0369A1',
    year: 2009,
    publisher: 'Springer',
    isbn: '978-3642015939',
    keywords: ['超疏水', '自清洁', '微纳结构', '接触角', '荷叶效应', '仿生'],
    level: 'advanced',
  },

  // 仿生学
  {
    id: 'biomimetics-design',
    titleZh: '生物启发设计：从自然到工程',
    titleEn: 'Bio-Inspired Design: From Nature to Engineering',
    author: '刘克勤 等',
    authorEn: 'Liu Keqin et al.',
    descriptionZh: '系统介绍自然界中的微纳米结构及其功能，包括蝴蝶翅膀的结构色、壁虎脚的黏附机制、鲨鱼皮的减阻效果等。揭示生物如何通过表面微结构实现超疏水、抗反射、结构色等功能。',
    descriptionEn: 'Introduces natural micro/nanostructures and their functions: butterfly wing structural colors, gecko adhesion, shark skin drag reduction. Reveals how biology achieves superhydrophobicity, anti-reflection, and structural coloration.',
    category: 'biomimetics',
    coverColor: '#059669',
    keywords: ['仿生', '微纳结构', '结构色', '黏附', '超疏水', '抗反射'],
    level: 'intermediate',
  },
  {
    id: 'structural-colors-nature',
    titleZh: '自然界的结构色',
    titleEn: 'Structural Colors in the Realm of Nature',
    author: 'Shuichi Kinoshita',
    descriptionZh: '深入探讨蝴蝶、甲虫、孔雀等生物产生绚丽色彩的物理机制。不同于色素颜色，结构色通过微纳尺度的周期结构实现光的干涉和衍射，与偏振光学密切相关。',
    descriptionEn: 'Explores how butterflies, beetles, and peacocks create stunning colors through physical mechanisms. Structural colors arise from nanoscale periodic structures via interference and diffraction.',
    category: 'biomimetics',
    coverColor: '#4F46E5',
    year: 2008,
    publisher: 'World Scientific',
    isbn: '978-9812707833',
    keywords: ['结构色', '薄膜干涉', '光子晶体', '蝴蝶翅膀', '纳米光学', '偏振'],
    level: 'intermediate',
  },
  {
    id: 'nanostructure-biomimetics',
    titleZh: '纳米仿生材料',
    titleEn: 'Nanomaterials: A Guide to Fabrication and Applications',
    author: '江雷 等',
    authorEn: 'Jiang Lei et al.',
    descriptionZh: '中国科学院江雷院士团队的重要著作。聚焦微纳尺度仿生界面材料，包括超疏水、超亲水、各向异性浸润等特殊浸润性表面的构建与应用，是理解微纳仿生的必读之书。',
    descriptionEn: 'Important work by Academician Jiang Lei\'s team. Focuses on bio-inspired interfacial materials at micro/nano scale, including superhydrophobic, superhydrophilic, and anisotropic wetting surfaces.',
    category: 'biomimetics',
    coverColor: '#047857',
    keywords: ['纳米仿生', '特殊浸润性', '界面材料', '超疏水', '超亲水', '各向异性'],
    level: 'advanced',
  },

  // 偏振光学
  {
    id: 'polarized-light',
    titleZh: '偏振光学（第三版）',
    titleEn: 'Polarized Light (3rd Edition)',
    author: 'Dennis Goldstein',
    descriptionZh: '偏振光学的权威教材。从基本原理到高级应用，涵盖Jones矩阵、Mueller矩阵、Stokes参数等完整数学体系，以及偏振在光学仪器和测量中的应用。',
    descriptionEn: 'The definitive textbook on polarized light. Covers Jones matrices, Mueller matrices, Stokes parameters, and applications in optical instrumentation and measurement.',
    category: 'polarization',
    coverColor: '#7C3AED',
    year: 2010,
    publisher: 'CRC Press',
    isbn: '978-1439830406',
    keywords: ['偏振', 'Jones矩阵', 'Mueller矩阵', 'Stokes参数', '偏振测量'],
    level: 'intermediate',
  },
  {
    id: 'polarimetric-detection',
    titleZh: '偏振光散射与探测',
    titleEn: 'Polarized Light Scattering and Detection',
    author: '马辉 等',
    authorEn: 'Ma Hui et al.',
    descriptionZh: '系统介绍偏振光在生物组织中的散射特性和检测方法。涵盖Mueller矩阵成像、组织偏振特性表征等前沿内容，对本课题组的细胞凋亡和微藻研究有直接参考价值。',
    descriptionEn: 'Systematically covers polarized light scattering in biological tissues and detection methods. Includes Mueller matrix imaging and tissue polarimetric characterization.',
    category: 'polarization',
    coverColor: '#6D28D9',
    keywords: ['偏振散射', 'Mueller矩阵成像', '生物组织', '偏振检测', '组织表征'],
    level: 'advanced',
  },

  // 光学基础
  {
    id: 'optics-hecht',
    titleZh: '光学（第5版）',
    titleEn: 'Optics (5th Edition)',
    author: 'Eugene Hecht',
    descriptionZh: '经典光学教材，被全球高校广泛采用。从几何光学到物理光学，系统介绍光的传播、干涉、衍射和偏振，图文并茂，例题丰富。',
    descriptionEn: 'Classic optics textbook used worldwide. Covers geometric optics to physical optics: propagation, interference, diffraction, and polarization with rich illustrations.',
    category: 'optics-general',
    coverColor: '#D97706',
    year: 2016,
    publisher: 'Pearson',
    isbn: '978-0133977226',
    keywords: ['几何光学', '物理光学', '干涉', '衍射', '偏振', '光的传播'],
    level: 'introductory',
  },
  {
    id: 'principles-of-optics',
    titleZh: '光学原理',
    titleEn: 'Principles of Optics (7th Edition)',
    author: 'Max Born, Emil Wolf',
    descriptionZh: 'Born和Wolf的不朽名著，光学领域的"圣经"。涵盖电磁理论、光的传播、干涉衍射、偏振等几乎所有光学分支，数学严谨，是研究级参考书。',
    descriptionEn: 'The immortal masterpiece by Born and Wolf, the "bible" of optics. Covers electromagnetic theory, propagation, interference, diffraction, and polarization with mathematical rigor.',
    category: 'optics-general',
    coverColor: '#B45309',
    year: 2019,
    publisher: 'Cambridge University Press',
    isbn: '978-1108477437',
    keywords: ['电磁理论', '光的传播', '干涉', '衍射', '偏振', '相干理论'],
    level: 'advanced',
  },

  // 交叉学科
  {
    id: 'wetting-surfaces-optics',
    titleZh: '润湿与微纳光学',
    titleEn: 'Wettability and Micro/Nano Optics',
    author: '陈成猛 等',
    authorEn: 'Chen Chengmeng et al.',
    descriptionZh: '探讨表面浸润性与光学性质的交叉领域。超疏水表面的减反射效应、薄膜干涉与浸润的耦合行为、微纳结构的光调控等前沿课题，连接了浸润物理与偏振光学。',
    descriptionEn: 'Explores the intersection of surface wettability and optical properties: anti-reflection on superhydrophobic surfaces, thin-film interference with wetting, and micro/nano optical modulation.',
    category: 'interdisciplinary',
    coverColor: '#DB2777',
    keywords: ['浸润', '减反射', '薄膜干涉', '微纳光学', '表面微结构', '偏振'],
    level: 'advanced',
  },
  {
    id: 'soft-matter-physics',
    titleZh: '软物质物理学导论',
    titleEn: 'Introduction to Soft Matter Physics',
    author: '阎守胜 / de Gennes, P.-G.',
    descriptionZh: '介绍高分子、胶体、液晶、表面活性剂等软物质的物理学基础。液晶章节直接关联偏振显示技术，表面活性剂与浸润行为密切相关。',
    descriptionEn: 'Covers physics of polymers, colloids, liquid crystals, and surfactants. Liquid crystal chapter directly connects to polarization displays; surfactants relate to wetting behavior.',
    category: 'interdisciplinary',
    coverColor: '#BE185D',
    keywords: ['软物质', '液晶', '高分子', '胶体', '表面活性剂', '偏振显示'],
    level: 'intermediate',
  },
]

// Discovery milestones for gamification
const DISCOVERY_MILESTONES = [
  { id: 'first-demo', titleEn: 'First Light', titleZh: '初见光芒', icon: '💡' },
  { id: 'polarizer-master', titleEn: 'Polarizer Master', titleZh: '偏振大师', icon: '🔮' },
  { id: 'time-traveler', titleEn: 'Time Traveler', titleZh: '时间旅行者', icon: '⏳' },
  { id: 'puzzle-solver', titleEn: 'Puzzle Solver', titleZh: '解谜高手', icon: '🧩' },
  { id: 'lab-rat', titleEn: 'Lab Enthusiast', titleZh: '实验达人', icon: '🔬' },
  { id: 'math-wizard', titleEn: 'Math Wizard', titleZh: '数学巫师', icon: '🧮' }
]

// Book section sub-component
function BookCategoryFilter({ isDark, isZh }: { isDark: boolean; isZh: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const filteredBooks = selectedCategory
    ? RECOMMENDED_BOOKS.filter(b => b.category === selectedCategory)
    : RECOMMENDED_BOOKS

  const levelLabels = {
    introductory: { zh: '入门', en: 'Intro', color: '#10B981' },
    intermediate: { zh: '进阶', en: 'Intermediate', color: '#F59E0B' },
    advanced: { zh: '高级', en: 'Advanced', color: '#EF4444' },
  }

  return (
    <div>
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-amber-500 text-white'
              : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          {isZh ? '全部' : 'All'}
        </button>
        {Object.entries(BOOK_CATEGORY_INFO).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === key
                ? 'text-white'
                : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            style={selectedCategory === key ? { backgroundColor: info.color } : undefined}
          >
            {isZh ? info.labelZh : info.labelEn}
          </button>
        ))}
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBooks.map(book => {
          const catInfo = BOOK_CATEGORY_INFO[book.category]
          const lvl = levelLabels[book.level]
          return (
            <motion.div
              key={book.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border transition-all hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex gap-4">
                {/* Book spine / color indicator */}
                <div
                  className="w-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: book.coverColor }}
                />
                <div className="flex-1 min-w-0">
                  {/* Category & Level badges */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                      style={{ backgroundColor: catInfo.color }}
                    >
                      {isZh ? catInfo.labelZh : catInfo.labelEn}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${lvl.color}20`, color: lvl.color }}
                    >
                      {isZh ? lvl.zh : lvl.en}
                    </span>
                    {book.year && (
                      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {book.year}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className={`font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {isZh ? book.titleZh : book.titleEn}
                  </h4>

                  {/* Author */}
                  <p className={`text-xs mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {book.authorEn && !isZh ? book.authorEn : book.author}
                    {book.publisher && ` · ${book.publisher}`}
                  </p>

                  {/* Description */}
                  <p className={`text-sm mb-3 line-clamp-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isZh ? book.descriptionZh : book.descriptionEn}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1">
                    {book.keywords.slice(0, 5).map(kw => (
                      <span
                        key={kw}
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* ISBN link */}
                  {book.isbn && (
                    <a
                      href={`https://www.worldcat.org/isbn/${book.isbn.replace(/-/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-xs mt-2 ${
                        isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      ISBN: {book.isbn}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function LearningHubPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const isZh = i18n.language === 'zh'

  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  const [showPathSelector, setShowPathSelector] = useState(true)
  const [discoveredModules, setDiscoveredModules] = useState<Set<string>>(new Set(['demos', 'games']))
  const [expandedCategory, setExpandedCategory] = useState<string | null>('discover')

  // Load progress from localStorage
  useEffect(() => {
    const savedPath = getStorageItem('learningPath')
    const savedModules = getStorageJSON<string[]>('discoveredModules', [])
    if (savedPath) {
      setSelectedPath(savedPath as LearningPath)
      setShowPathSelector(false)
    }
    if (savedModules.length > 0) {
      setDiscoveredModules(new Set(savedModules))
    }
  }, [])

  // Save progress
  const selectPath = (path: LearningPath) => {
    setSelectedPath(path)
    setShowPathSelector(false)
    setStorageItem('learningPath', path)
  }

  const getModulesByCategory = (category: string) =>
    LEARNING_MODULES.filter(m => m.category === category)

  const getCategoryInfo = (category: string) => {
    const info: Record<string, { titleEn: string; titleZh: string; icon: React.ReactNode }> = {
      discover: { titleEn: 'Discover', titleZh: '发现', icon: <Eye className="w-5 h-5" /> },
      learn: { titleEn: 'Learn', titleZh: '学习', icon: <BookOpen className="w-5 h-5" /> },
      explore: { titleEn: 'Explore', titleZh: '探索', icon: <Compass className="w-5 h-5" /> },
      create: { titleEn: 'Create', titleZh: '创造', icon: <Sparkles className="w-5 h-5" /> }
    }
    return info[category]
  }

  const renderDifficultyStars = (level: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= level ? 'fill-current text-amber-400' : 'text-gray-400'}`}
        />
      ))}
    </div>
  )

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <PersistentHeader />

      <main className="pt-16 pb-20">
        {/* Hero Section with Path Selector */}
        <section className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
          <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {isZh ? '偏振光学习中心' : 'Polarization Learning Hub'}
              </h1>
              <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {isZh ? '选择你的探索方式，开启光学之旅' : 'Choose your path and begin your optical journey'}
              </p>
            </motion.div>

            {/* Path Selector (Progressive Disclosure) */}
            <AnimatePresence mode="wait">
              {showPathSelector ? (
                <motion.div
                  key="path-selector"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
                >
                  {LEARNING_PATHS.map((path, index) => (
                    <motion.button
                      key={path.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectPath(path.id)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        isDark
                          ? 'bg-slate-800/50 border-slate-700 hover:border-opacity-100'
                          : 'bg-white border-slate-200 hover:shadow-lg'
                      }`}
                      style={{ borderColor: selectedPath === path.id ? path.color : undefined }}
                    >
                      <div className="flex flex-col items-center text-center gap-3">
                        <div
                          className="p-4 rounded-xl"
                          style={{ backgroundColor: `${path.color}20` }}
                        >
                          <div style={{ color: path.color }}>{path.icon}</div>
                        </div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {isZh ? path.titleZh : path.titleEn}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {isZh ? path.descriptionZh : path.descriptionEn}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="selected-path"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-4"
                >
                  {selectedPath && (
                    <>
                      <div
                        className="flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{ backgroundColor: `${LEARNING_PATHS.find(p => p.id === selectedPath)?.color}20` }}
                      >
                        <span style={{ color: LEARNING_PATHS.find(p => p.id === selectedPath)?.color }}>
                          {LEARNING_PATHS.find(p => p.id === selectedPath)?.icon}
                        </span>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {isZh
                            ? LEARNING_PATHS.find(p => p.id === selectedPath)?.titleZh
                            : LEARNING_PATHS.find(p => p.id === selectedPath)?.titleEn
                          }
                        </span>
                      </div>
                      <button
                        onClick={() => setShowPathSelector(true)}
                        className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {isZh ? '更换路径' : 'Change path'}
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Quick Actions - Suggested for selected path */}
        {selectedPath && !showPathSelector && (
          <section className="max-w-6xl mx-auto px-4 py-8">
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {isZh ? '推荐起点' : 'Suggested Starting Points'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LEARNING_PATHS.find(p => p.id === selectedPath)?.suggestedModules.map(moduleId => {
                const module = LEARNING_MODULES.find(m => m.id === moduleId)
                if (!module) return null
                return (
                  <motion.div
                    key={module.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={module.route}
                      className={`block p-4 rounded-xl border transition-all ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                          : 'bg-white border-slate-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${module.color}20` }}
                        >
                          <div style={{ color: module.color }}>{module.icon}</div>
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {isZh ? module.titleZh : module.titleEn}
                          </h3>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {module.estimatedTime}
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {/* All Modules - Organized by Category */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {isZh ? '全部模块' : 'All Modules'}
          </h2>

          <div className="space-y-6">
            {['discover', 'explore', 'learn', 'create'].map(category => {
              const categoryInfo = getCategoryInfo(category)
              const modules = getModulesByCategory(category)
              const isExpanded = expandedCategory === category

              return (
                <div key={category} className={`rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                  {/* Category Header */}
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category)}
                    className={`w-full p-4 flex items-center justify-between ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'} rounded-t-2xl transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {categoryInfo.icon}
                      </div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {isZh ? categoryInfo.titleZh : categoryInfo.titleEn}
                      </h3>
                      <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        ({modules.length})
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${isDark ? 'text-slate-500' : 'text-slate-400'} ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {/* Module Grid */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {modules.map(module => (
                            <motion.div
                              key={module.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              whileHover={{ y: -2 }}
                            >
                              <Link
                                to={module.route}
                                className={`block p-4 rounded-xl border transition-all h-full ${
                                  isDark
                                    ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-sm'
                                }`}
                              >
                                <div className="flex flex-col h-full">
                                  <div className="flex items-start justify-between mb-3">
                                    <div
                                      className="p-2 rounded-lg"
                                      style={{ backgroundColor: `${module.color}20` }}
                                    >
                                      <div style={{ color: module.color }}>{module.icon}</div>
                                    </div>
                                    {renderDifficultyStars(module.difficulty)}
                                  </div>

                                  <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {isZh ? module.titleZh : module.titleEn}
                                  </h4>
                                  <p className={`text-sm mb-3 flex-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {isZh ? module.descriptionZh : module.descriptionEn}
                                  </p>

                                  <div className="flex items-center justify-between text-xs">
                                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                                      {module.estimatedTime}
                                    </span>
                                    {module.rewards && (
                                      <div className="flex items-center gap-1">
                                        <Award className="w-3 h-3 text-amber-500" />
                                        <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                                          +{module.rewards.length}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>

        {/* Classic Books & Recommended Reading */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className={`rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Library className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {isZh ? '经典书籍推荐' : 'Classic Books & Recommended Reading'}
                </h2>
              </div>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {isZh
                  ? '涵盖偏振光学、表面微结构、疏水浸润、微纳仿生等多个方向，从入门到前沿的精选书单。'
                  : 'Curated reading list spanning polarization optics, surface microstructures, hydrophobic wetting, and micro/nano biomimetics.'}
              </p>

              {/* Category filter */}
              <BookCategoryFilter isDark={isDark} isZh={isZh} />
            </div>
          </div>
        </section>

        {/* Discovery Progress */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className={`rounded-2xl p-6 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {isZh ? '发现进度' : 'Discovery Progress'}
              </h2>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span className={`text-sm font-medium ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  {discoveredModules.size}/{LEARNING_MODULES.length} {isZh ? '模块' : 'modules'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {DISCOVERY_MILESTONES.map(milestone => (
                <div
                  key={milestone.id}
                  className={`flex flex-col items-center p-3 rounded-xl ${
                    isDark ? 'bg-slate-700/50' : 'bg-white'
                  }`}
                >
                  <span className="text-2xl mb-1">{milestone.icon}</span>
                  <span className={`text-xs text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {isZh ? milestone.titleZh : milestone.titleEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
