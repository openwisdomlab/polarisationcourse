/**
 * Demo Source Code Registry
 * 演示源码注册表
 *
 * This file registers all demo source code implementations across multiple languages.
 * 此文件注册所有演示的多语言源码实现。
 *
 * Supported Languages 支持的语言:
 * - TypeScript/React: Interactive web demos (在线交互演示)
 * - Python: Scientific computing with NumPy/Matplotlib (科学计算)
 * - MATLAB/Octave: Traditional scientific standard (传统科学计算)
 * - Julia: High-performance computing (高性能计算) [Coming soon]
 * - R: Statistical computing (统计计算) [Coming soon]
 */

import type { DemoSourceCode, LanguageImplementation } from '@/types/source-code'

// ============================================================================
// IMPORT SOURCE CODE FILES (using Vite's ?raw suffix)
// 导入源码文件（使用Vite的?raw后缀）
// ============================================================================

// TypeScript/React implementations (Web demos)
// TypeScript/React 实现（网页演示）
import MalusLawDemoTsx from '@/components/demos/unit1/MalusLawDemo.tsx?raw'
import BirefringenceDemoTsx from '@/components/demos/unit1/BirefringenceDemo.tsx?raw'
import FresnelDemoTsx from '@/components/demos/unit2/FresnelDemo.tsx?raw'

// Python implementations
// Python 实现
import MalusLawDemoPython from '@/demo-sources/python/malus_law.py?raw'
import BirefringenceDemoPython from '@/demo-sources/python/birefringence.py?raw'
import FresnelDemoPython from '@/demo-sources/python/fresnel.py?raw'

// MATLAB/Octave implementations
// MATLAB/Octave 实现
import MalusLawDemoMatlab from '@/demo-sources/matlab/malus_law.m?raw'
import BirefringenceDemoMatlab from '@/demo-sources/matlab/birefringence.m?raw'
import FresnelDemoMatlab from '@/demo-sources/matlab/fresnel.m?raw'

// ============================================================================
// DEMO SOURCE CODE REGISTRY
// 演示源码注册表
// ============================================================================

/**
 * Malus's Law Demo - All Language Implementations
 * 马吕斯定律演示 - 所有语言实现
 */
const MALUS_LAW_SOURCE: DemoSourceCode = {
  id: 'malus',
  name: "Malus's Law",
  nameZh: '马吕斯定律',
  description: 'Interactive demonstration of intensity variation through polarizers',
  descriptionZh: '通过偏振片的光强变化交互演示',
  complexity: 'beginner',

  concepts: [
    'Polarization',
    "Malus's Law: I = I₀ × cos²(θ)",
    'Light intensity calculation',
    'Polarizer transmission',
  ],
  conceptsZh: [
    '偏振',
    '马吕斯定律：I = I₀ × cos²(θ)',
    '光强计算',
    '偏振片透射',
  ],

  tags: ['polarization', 'malus-law', 'intensity', 'beginner'],

  relatedDemos: ['polarization-intro', 'three-polarizers', 'birefringence'],

  implementations: [
    // TypeScript/React (Web)
    {
      language: 'typescript',
      sourceCode: MalusLawDemoTsx,
      dependencies: {
        'react': '^19.0.0',
        'react-dom': '^19.0.0',
        'framer-motion': '^11.0.0',
        'lucide-react': '^0.460.0',
        'react-i18next': '^15.1.3',
      },
      notes: 'Best for interactive online experience with smooth animations.',
      notesZh: '最适合在线交互体验，具有流畅的动画效果。',
    },

    // Python
    {
      language: 'python',
      sourceCode: MalusLawDemoPython,
      dependencies: {
        'numpy': '>=1.24.0',
        'matplotlib': '>=3.7.0',
      },
      setup: `# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install numpy matplotlib

# Run the demo
python malus_law.py`,
      setupZh: `# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows系统: venv\\Scripts\\activate

# 安装依赖
pip install numpy matplotlib

# 运行演示
python malus_law.py`,
      notes: 'Most popular for scientific computing. Includes interactive slider and detailed plots.',
      notesZh: '最流行的科学计算语言。包含交互式滑动条和详细图表。',
    },

    // MATLAB/Octave
    {
      language: 'matlab',
      sourceCode: MalusLawDemoMatlab,
      dependencies: {
        'MATLAB': 'R2016b or later',
        'Octave': '4.0 or later (free alternative)',
      },
      setup: `% In MATLAB/Octave:
% 1. Navigate to the directory containing malus_law.m
% 2. Run the script:
malus_law

% For Octave users (free alternative):
% Download from: https://octave.org
% Install and run the same way as MATLAB`,
      setupZh: `% 在 MATLAB/Octave 中:
% 1. 导航到包含 malus_law.m 的目录
% 2. 运行脚本:
malus_law

% Octave 用户（免费替代）:
% 下载地址: https://octave.org
% 安装后使用方式与 MATLAB 相同`,
      notes: 'Traditional scientific computing standard. Compatible with free Octave.',
      notesZh: '传统科学计算标准。兼容免费的 Octave 软件。',
    },
  ],

  resources: [
    {
      type: 'documentation',
      title: "Malus's Law - Wikipedia",
      titleZh: '马吕斯定律 - 维基百科',
      url: 'https://en.wikipedia.org/wiki/Polarizer#Malus\'s_law',
      description: 'Comprehensive explanation of the physical principle',
      descriptionZh: '物理原理的全面解释',
    },
    {
      type: 'tutorial',
      title: 'Polarization of Light Tutorial',
      titleZh: '光的偏振教程',
      url: 'https://www.physicsclassroom.com/class/light/Lesson-1/Polarization',
      description: 'Step-by-step introduction to polarization concepts',
      descriptionZh: '偏振概念的逐步介绍',
    },
    {
      type: 'paper',
      title: 'Original Malus Publication (1809)',
      titleZh: '马吕斯原始论文 (1809)',
      url: 'https://gallica.bnf.fr/ark:/12148/bpt6k33427/f1.item',
      description: 'Historical paper by Étienne-Louis Malus',
      descriptionZh: 'Étienne-Louis Malus 的历史论文',
    },
  ],
}

/**
 * Birefringence Demo - All Language Implementations
 * 双折射演示 - 所有语言实现
 */
const BIREFRINGENCE_SOURCE: DemoSourceCode = {
  id: 'birefringence',
  name: 'Birefringence (Double Refraction)',
  nameZh: '双折射效应',
  description: 'Visualization of light splitting into ordinary and extraordinary rays in calcite crystal',
  descriptionZh: '方解石晶体中光分裂为寻常光和非常光的可视化',
  complexity: 'intermediate',

  concepts: [
    'Birefringence',
    'Ordinary ray (o-ray): I_o = I₀ × cos²(θ)',
    'Extraordinary ray (e-ray): I_e = I₀ × sin²(θ)',
    'Energy conservation: I_o + I_e = I₀',
    'Anisotropic materials',
    'Optic axis',
  ],
  conceptsZh: [
    '双折射',
    '寻常光 (o光): I_o = I₀ × cos²(θ)',
    '非常光 (e光): I_e = I₀ × sin²(θ)',
    '能量守恒: I_o + I_e = I₀',
    '各向异性材料',
    '光轴',
  ],

  tags: ['birefringence', 'double-refraction', 'calcite', 'intermediate', 'polarization'],

  relatedDemos: ['malus-law', 'waveplate', 'optical-rotation'],

  implementations: [
    // TypeScript/React (Web)
    {
      language: 'typescript',
      sourceCode: BirefringenceDemoTsx,
      dependencies: {
        'react': '^19.0.0',
        '@react-three/fiber': '^8.0.0',
        '@react-three/drei': '^9.0.0',
        'three': '^0.160.0',
        'framer-motion': '^11.0.0',
      },
      notes: '3D visualization with interactive controls and real-time ray splitting.',
      notesZh: '3D可视化，包含交互式控制和实时光线分裂效果。',
    },

    // Python
    {
      language: 'python',
      sourceCode: BirefringenceDemoPython,
      dependencies: {
        'numpy': '>=1.24.0',
        'matplotlib': '>=3.7.0',
      },
      setup: `# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install numpy matplotlib

# Run the demo
python birefringence.py`,
      setupZh: `# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows系统: venv\\Scripts\\activate

# 安装依赖
pip install numpy matplotlib

# 运行演示
python birefringence.py`,
      notes: 'Interactive slider visualization with intensity curves and bar charts. Includes detailed physics comments.',
      notesZh: '交互式滑动条可视化，包含强度曲线和柱状图。含详细物理注释。',
    },

    // MATLAB/Octave
    {
      language: 'matlab',
      sourceCode: BirefringenceDemoMatlab,
      dependencies: {
        'MATLAB': 'R2016b or later',
        'Octave': '4.0 or later (free alternative)',
      },
      setup: `% In MATLAB/Octave:
% 1. Navigate to the directory containing birefringence.m
% 2. Run the script:
birefringence`,
      setupZh: `% 在 MATLAB/Octave 中:
% 1. 导航到包含 birefringence.m 的目录
% 2. 运行脚本:
birefringence`,
      notes: 'Real-time interactive visualization with calcite crystal rendering. Compatible with free Octave.',
      notesZh: '实时交互式可视化，包含方解石晶体渲染。兼容免费的 Octave。',
    },
  ],

  resources: [
    {
      type: 'documentation',
      title: 'Birefringence - Wikipedia',
      titleZh: '双折射 - 维基百科',
      url: 'https://en.wikipedia.org/wiki/Birefringence',
      description: 'Comprehensive explanation of double refraction phenomenon',
      descriptionZh: '双折射现象的全面解释',
    },
    {
      type: 'tutorial',
      title: 'Understanding Wave Plates',
      titleZh: '理解波片',
      url: 'https://www.edmundoptics.com/knowledge-center/application-notes/optics/understanding-waveplates/',
      description: 'Practical guide to birefringent optical elements',
      descriptionZh: '双折射光学元件实用指南',
    },
  ],
}

/**
 * Fresnel Equations Demo - All Language Implementations
 * 菲涅尔方程演示 - 所有语言实现
 */
const FRESNEL_SOURCE: DemoSourceCode = {
  id: 'fresnel',
  name: 'Fresnel Equations',
  nameZh: '菲涅尔方程',
  description: 'Interactive demonstration of reflection and transmission coefficients at optical interfaces',
  descriptionZh: '光学界面反射和透射系数的交互演示',
  complexity: 'intermediate',

  concepts: [
    'Fresnel equations',
    's-polarization (⊥ plane of incidence)',
    'p-polarization (∥ plane of incidence)',
    "Brewster's angle: θ_B = arctan(n₂/n₁)",
    'Total internal reflection',
    'Energy conservation: R + T = 1',
    "Snell's law",
  ],
  conceptsZh: [
    '菲涅尔方程',
    's偏振（垂直于入射面）',
    'p偏振（平行于入射面）',
    '布儒斯特角: θ_B = arctan(n₂/n₁)',
    '全内反射',
    '能量守恒: R + T = 1',
    '斯涅尔定律',
  ],

  tags: ['fresnel', 'reflection', 'transmission', 'brewster-angle', 'interface', 'intermediate'],

  relatedDemos: ['brewster-angle', 'total-internal-reflection', 'malus-law'],

  implementations: [
    // TypeScript/React (Web)
    {
      language: 'typescript',
      sourceCode: FresnelDemoTsx,
      dependencies: {
        'react': '^19.0.0',
        'framer-motion': '^11.0.0',
      },
      notes: 'SVG-based ray diagram with real-time coefficient calculations and interactive angle adjustment.',
      notesZh: '基于SVG的光线图，实时系数计算和交互式角度调整。',
    },

    // Python
    {
      language: 'python',
      sourceCode: FresnelDemoPython,
      dependencies: {
        'numpy': '>=1.24.0',
        'matplotlib': '>=3.7.0',
      },
      setup: `# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install numpy matplotlib

# Run the demo
python fresnel.py`,
      setupZh: `# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows系统: venv\\Scripts\\activate

# 安装依赖
pip install numpy matplotlib

# Run演示
python fresnel.py`,
      notes: 'Dual-panel visualization: ray diagram + coefficient curves. Includes Brewster angle and critical angle markers.',
      notesZh: '双面板可视化：光线图 + 系数曲线。包含布儒斯特角和临界角标记。',
    },

    // MATLAB/Octave
    {
      language: 'matlab',
      sourceCode: FresnelDemoMatlab,
      dependencies: {
        'MATLAB': 'R2016b or later',
        'Octave': '4.0 or later (free alternative)',
      },
      setup: `% In MATLAB/Octave:
% 1. Navigate to the directory containing fresnel.m
% 2. Run the script:
fresnel`,
      setupZh: `% 在 MATLAB/Octave 中:
% 1. 导航到包含 fresnel.m 的目录
% 2. 运行脚本:
fresnel`,
      notes: 'Interactive interface with s/p polarization toggles. Real-time visualization of Brewster angle phenomenon.',
      notesZh: '交互式界面，支持s/p偏振切换。实时可视化布儒斯特角现象。',
    },
  ],

  resources: [
    {
      type: 'documentation',
      title: 'Fresnel Equations - Wikipedia',
      titleZh: '菲涅尔方程 - 维基百科',
      url: 'https://en.wikipedia.org/wiki/Fresnel_equations',
      description: 'Complete mathematical derivation and applications',
      descriptionZh: '完整数学推导和应用',
    },
    {
      type: 'tutorial',
      title: "Understanding Brewster's Angle",
      titleZh: '理解布儒斯特角',
      url: 'https://www.rp-photonics.com/brewsters_angle.html',
      description: 'Detailed explanation of polarizing angle phenomenon',
      descriptionZh: '偏振角现象的详细解释',
    },
    {
      type: 'paper',
      title: 'Original Fresnel Work (1823)',
      titleZh: '菲涅尔原始工作 (1823)',
      url: 'https://gallica.bnf.fr/ark:/12148/bpt6k5476278v',
      description: 'Historical paper by Augustin-Jean Fresnel',
      descriptionZh: 'Augustin-Jean Fresnel 的历史论文',
    },
  ],
}

// ============================================================================
// REGISTRY OBJECT - Add more demos here
// 注册表对象 - 在此添加更多演示
// ============================================================================

/**
 * Complete registry of all demo source codes
 * 所有演示源码的完整注册表
 */
export const DEMO_SOURCES_REGISTRY: Record<string, DemoSourceCode> = {
  'malus': MALUS_LAW_SOURCE,
  'birefringence': BIREFRINGENCE_SOURCE,
  'fresnel': FRESNEL_SOURCE,

  // TODO: Add more demos
  // 'brewster-angle': BREWSTER_SOURCE,
  // 'chromatic-polarization': CHROMATIC_SOURCE,
  // 'waveplate': WAVEPLATE_SOURCE,
  // ... etc
}

// ============================================================================
// UTILITY FUNCTIONS
// 工具函数
// ============================================================================

/**
 * Get source code for a specific demo
 * 获取特定演示的源码
 *
 * @param demoId - Unique demo identifier
 * @returns DemoSourceCode object or null if not found
 */
export function getDemoSource(demoId: string): DemoSourceCode | null {
  return DEMO_SOURCES_REGISTRY[demoId] || null
}

/**
 * Get source code for a specific demo and language
 * 获取特定演示和语言的源码
 *
 * @param demoId - Unique demo identifier
 * @param language - Programming language
 * @returns LanguageImplementation or null if not found
 */
export function getDemoSourceByLanguage(
  demoId: string,
  language: string
): LanguageImplementation | null {
  const demo = getDemoSource(demoId)
  if (!demo) return null

  return demo.implementations.find(impl => impl.language === language) || null
}

/**
 * Get all available languages for a demo
 * 获取演示的所有可用语言
 *
 * @param demoId - Unique demo identifier
 * @returns Array of language IDs
 */
export function getAvailableLanguages(demoId: string): string[] {
  const demo = getDemoSource(demoId)
  if (!demo) return []

  return demo.implementations.map(impl => impl.language)
}

/**
 * Check if a demo has source code available
 * 检查演示是否有可用的源码
 *
 * @param demoId - Unique demo identifier
 * @returns true if source code exists
 */
export function hasDemoSource(demoId: string): boolean {
  return demoId in DEMO_SOURCES_REGISTRY
}

/**
 * Get all demos with source code
 * 获取所有有源码的演示
 *
 * @returns Array of demo IDs
 */
export function getAllDemoIds(): string[] {
  return Object.keys(DEMO_SOURCES_REGISTRY)
}

/**
 * Get demo count statistics by language
 * 获取各语言的演示数量统计
 *
 * @returns Record of language -> count
 */
export function getDemoCountByLanguage(): Record<string, number> {
  const counts: Record<string, number> = {}

  Object.values(DEMO_SOURCES_REGISTRY).forEach(demo => {
    demo.implementations.forEach(impl => {
      counts[impl.language] = (counts[impl.language] || 0) + 1
    })
  })

  return counts
}

/**
 * Search demos by tags
 * 按标签搜索演示
 *
 * @param tags - Array of tags to search for
 * @returns Array of matching demo IDs
 */
export function searchDemosByTags(tags: string[]): string[] {
  return Object.entries(DEMO_SOURCES_REGISTRY)
    .filter(([_, demo]) =>
      tags.some(tag => demo.tags.includes(tag.toLowerCase()))
    )
    .map(([id, _]) => id)
}

/**
 * Search demos by complexity level
 * 按复杂度等级搜索演示
 *
 * @param complexity - Complexity level
 * @returns Array of matching demo IDs
 */
export function searchDemosByComplexity(
  complexity: 'beginner' | 'intermediate' | 'advanced'
): string[] {
  return Object.entries(DEMO_SOURCES_REGISTRY)
    .filter(([_, demo]) => demo.complexity === complexity)
    .map(([id, _]) => id)
}
