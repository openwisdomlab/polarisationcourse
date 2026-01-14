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
import WaveplateDemoTsx from '@/components/demos/unit1/WaveplateDemo.tsx?raw'
import BrewsterDemoTsx from '@/components/demos/unit2/BrewsterDemo.tsx?raw'

// Python implementations
// Python 实现
import MalusLawDemoPython from '@/demo-sources/python/malus_law.py?raw'
import BirefringenceDemoPython from '@/demo-sources/python/birefringence.py?raw'
import FresnelDemoPython from '@/demo-sources/python/fresnel.py?raw'
import WaveplateDemoPython from '@/demo-sources/python/waveplate.py?raw'
import BrewsterDemoPython from '@/demo-sources/python/brewster.py?raw'
import OpticalRotationPython from '@/demo-sources/python/optical_rotation.py?raw'
import RayleighScatteringPython from '@/demo-sources/python/rayleigh_scattering.py?raw'

// Stage 2: Advanced polarimetry demos (Jones/Stokes/Mueller)
// 阶段2：高级偏振演示（Jones/Stokes/Mueller）
import JonesMatrixPython from '@/demo-sources/python/jones_matrix.py?raw'
import JonesMatrixOptimizedPython from '@/demo-sources/python/jones_matrix_optimized.py?raw'
import StokesVectorPython from '@/demo-sources/python/stokes_vector.py?raw'
import StokesVectorOptimizedPython from '@/demo-sources/python/stokes_vector_optimized.py?raw'
import MuellerMatrixPython from '@/demo-sources/python/mueller_matrix.py?raw'
import MuellerMatrixOptimizedPython from '@/demo-sources/python/mueller_matrix_optimized.py?raw'

// MATLAB/Octave implementations
// MATLAB/Octave 实现
import MalusLawDemoMatlab from '@/demo-sources/matlab/malus_law.m?raw'
import BirefringenceDemoMatlab from '@/demo-sources/matlab/birefringence.m?raw'
import FresnelDemoMatlab from '@/demo-sources/matlab/fresnel.m?raw'
import WaveplateDemoMatlab from '@/demo-sources/matlab/waveplate.m?raw'
import BrewsterDemoMatlab from '@/demo-sources/matlab/brewster.m?raw'
import OpticalRotationMatlab from '@/demo-sources/matlab/optical_rotation.m?raw'
import RayleighScatteringMatlab from '@/demo-sources/matlab/rayleigh_scattering.m?raw'

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

/**
 * Waveplate Demo - All Language Implementations
 * 波片演示 - 所有语言实现
 */
const WAVEPLATE_SOURCE: DemoSourceCode = {
  id: 'waveplate',
  name: 'Waveplate (Quarter-Wave & Half-Wave Plates)',
  nameZh: '波片（λ/4和λ/2波片）',
  description: 'Interactive demonstration of how waveplates change polarization states',
  descriptionZh: '波片如何改变偏振态的交互演示',
  complexity: 'intermediate',

  concepts: [
    'Quarter-wave plate (λ/4): Phase retardation π/2',
    'Half-wave plate (λ/2): Phase retardation π',
    '45° linear → circular polarization (λ/4)',
    'Linear polarization rotation (λ/2)',
    'Fast axis and slow axis',
    'Jones matrix representation',
    'Elliptical polarization states',
  ],
  conceptsZh: [
    '四分之一波片(λ/4)：相位延迟 π/2',
    '二分之一波片(λ/2)：相位延迟 π',
    '45°线偏振 → 圆偏振 (λ/4)',
    '线偏振方向旋转 (λ/2)',
    '快轴与慢轴',
    'Jones矩阵表示',
    '椭圆偏振态',
  ],

  implementations: [
    {
      language: 'typescript',
      sourceCode: WaveplateDemoTsx,
      dependencies: { react: '^19.0.0', 'framer-motion': '^11.0.0', typescript: '^5.0.0' },
      notes: 'Interactive web-based demonstration with real-time visualization of quarter-wave and half-wave plates.',
      notesZh: 'Web交互演示，实时可视化λ/4和λ/2波片效果。',
    },
    {
      language: 'python',
      sourceCode: WaveplateDemoPython,
      dependencies: { numpy: '>=1.20.0', matplotlib: '>=3.3.0' },
      setup: `pip install numpy matplotlib
python waveplate.py`,
      setupZh: `pip install numpy matplotlib
python waveplate.py`,
      notes: 'Standalone Python demo with interactive sliders for quarter-wave and half-wave plates, Jones calculus calculations.',
      notesZh: '独立Python演示，带有λ/4和λ/2波片交互滑块，包含Jones演算。',
    },
    {
      language: 'matlab',
      sourceCode: WaveplateDemoMatlab,
      dependencies: {},
      setup: `% In MATLAB/Octave:
waveplate`,
      setupZh: `% 在 MATLAB/Octave 中:
waveplate`,
      notes: 'MATLAB/Octave compatible (R2016b+, Octave 4.0+). No toolboxes required. Includes Jones calculus implementation.',
      notesZh: 'MATLAB/Octave兼容 (R2016b+, Octave 4.0+)。无需工具箱。包含Jones演算实现。',
    },
  ],

  tags: ['polarization', 'waveplate', 'jones-calculus', 'circular-polarization', 'optical-components'],

  resources: [
    {
      type: 'documentation',
      title: 'Waveplates - RP Photonics Encyclopedia',
      titleZh: '波片 - RP光子学百科',
      url: 'https://www.rp-photonics.com/waveplates.html',
      description: 'Comprehensive guide to waveplates',
      descriptionZh: '波片综合指南',
    },
    {
      type: 'documentation',
      title: 'Quarter-Wave Plate - Thorlabs',
      titleZh: '四分之一波片 - Thorlabs',
      url: 'https://www.thorlabs.com/newgrouppage9.cfm?objectgroup_id=711',
      description: 'Commercial waveplate specifications',
      descriptionZh: '商业波片规格',
    },
  ],
}

/**
 * Brewster's Angle Demo - All Language Implementations
 * 布儒斯特角演示 - 所有语言实现
 */
const BREWSTER_SOURCE: DemoSourceCode = {
  id: 'brewster',
  name: "Brewster's Angle",
  nameZh: '布儒斯特角',
  description: 'Demonstration of Brewster\'s angle where p-polarized light has zero reflectance',
  descriptionZh: '演示布儒斯特角现象：p偏振光反射率为零',
  complexity: 'intermediate',

  concepts: [
    "Brewster's angle: θ_B = arctan(n₂/n₁)",
    'p-polarization reflectance R_p = 0 at Brewster angle',
    'Reflected light is completely s-polarized',
    'Reflected and refracted rays are perpendicular',
    'Applications in polarizers and laser windows',
  ],
  conceptsZh: [
    '布儒斯特角：θ_B = arctan(n₂/n₁)',
    '在布儒斯特角，p偏振光反射率 R_p = 0',
    '反射光为完全s偏振',
    '反射光与折射光垂直',
    '应用于偏振片和激光窗口',
  ],

  implementations: [
    {
      language: 'typescript',
      sourceCode: BrewsterDemoTsx,
      dependencies: { react: '^19.0.0', 'framer-motion': '^11.0.0', typescript: '^5.0.0' },
      notes: 'Interactive web demonstration with dispersion effects and real-time Fresnel coefficient calculations.',
      notesZh: 'Web交互演示，包含色散效应和实时Fresnel系数计算。',
    },
    {
      language: 'python',
      sourceCode: BrewsterDemoPython,
      dependencies: { numpy: '>=1.20.0', matplotlib: '>=3.3.0' },
      setup: `pip install numpy matplotlib
python brewster.py`,
      setupZh: `pip install numpy matplotlib
python brewster.py`,
      notes: 'Standalone Python demo showing Brewster angle where R_p = 0, with interactive sliders and reflectance curves.',
      notesZh: '独立Python演示，显示布儒斯特角R_p = 0现象，包含交互滑块和反射率曲线。',
    },
    {
      language: 'matlab',
      sourceCode: BrewsterDemoMatlab,
      dependencies: {},
      setup: `% In MATLAB/Octave:
brewster`,
      setupZh: `% 在 MATLAB/Octave 中:
brewster`,
      notes: 'MATLAB/Octave compatible (R2016b+, Octave 4.0+). No toolboxes required. Interactive angle adjustment.',
      notesZh: 'MATLAB/Octave兼容 (R2016b+, Octave 4.0+)。无需工具箱。可交互调整入射角。',
    },
  ],

  tags: ['polarization', 'brewster-angle', 'fresnel-equations', 'reflection', 'interface-optics'],

  resources: [
    {
      type: 'documentation',
      title: "Brewster's Angle - HyperPhysics",
      titleZh: '布儒斯特角 - HyperPhysics',
      url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/phyopt/brewster.html',
      description: 'Physics explanation of Brewster angle',
      descriptionZh: '布儒斯特角的物理解释',
    },
    {
      type: 'documentation',
      title: 'Brewster Windows - RP Photonics',
      titleZh: '布儒斯特窗 - RP光子学',
      url: 'https://www.rp-photonics.com/brewster_windows.html',
      description: 'Applications in laser systems',
      descriptionZh: '在激光系统中的应用',
    },
  ],
}

/**
 * Optical Rotation Demo - All Language Implementations
 * 旋光性演示 - 所有语言实现
 */
const OPTICAL_ROTATION_SOURCE: DemoSourceCode = {
  id: 'optical-rotation',
  name: 'Optical Rotation (Sugar Solution)',
  nameZh: '旋光性（糖溶液）',
  description: 'Demonstration of chiral molecules rotating the plane of polarized light',
  descriptionZh: '手性分子旋转偏振光平面的演示',
  complexity: 'intermediate',

  concepts: [
    'Optical rotation formula: α = [α]_λ^T × l × c',
    'Specific rotation: substance characteristic',
    'Chirality and handedness',
    'Dextrorotatory (+) and levorotatory (-)',
    'Sucrose: +66.5°, Fructose: -92.4°',
    'Applications in sugar industry and pharmaceuticals',
  ],
  conceptsZh: [
    '旋光公式：α = [α]_λ^T × l × c',
    '比旋光度：物质特性',
    '手性与旋向性',
    '右旋(+)和左旋(-)',
    '蔗糖：+66.5°，果糖：-92.4°',
    '在制糖和制药工业中的应用',
  ],

  tags: ['polarization', 'optical-rotation', 'chirality', 'sugar', 'intermediate'],

  relatedDemos: ['malus-law', 'waveplate', 'birefringence'],

  implementations: [
    {
      language: 'python',
      sourceCode: OpticalRotationPython,
      dependencies: { numpy: '>=1.20.0', matplotlib: '>=3.3.0' },
      setup: `pip install numpy matplotlib
python optical_rotation.py`,
      setupZh: `pip install numpy matplotlib
python optical_rotation.py`,
      notes: 'Interactive demo with 4 sugar types (sucrose +66.5°, fructose -92.4°, glucose +52.7°, lactose +52.3°). Adjust concentration and sample length.',
      notesZh: '交互式演示，支持4种糖（蔗糖+66.5°、果糖-92.4°、葡萄糖+52.7°、乳糖+52.3°）。可调节浓度和样品长度。',
    },
    {
      language: 'matlab',
      sourceCode: OpticalRotationMatlab,
      dependencies: {},
      setup: `% In MATLAB/Octave:
optical_rotation`,
      setupZh: `% 在 MATLAB/Octave 中:
optical_rotation`,
      notes: 'MATLAB/Octave compatible (R2016b+, Octave 4.0+). No toolboxes required. Interactive substance selection and parameter adjustment.',
      notesZh: 'MATLAB/Octave兼容 (R2016b+, Octave 4.0+)。无需工具箱。可交互选择物质和调节参数。',
    },
  ],

  resources: [
    {
      type: 'documentation',
      title: 'Optical Rotation - Wikipedia',
      titleZh: '旋光性 - 维基百科',
      url: 'https://en.wikipedia.org/wiki/Optical_rotation',
      description: 'Explanation of optical activity in chiral molecules',
      descriptionZh: '手性分子光学活性的解释',
    },
    {
      type: 'documentation',
      title: 'Polarimetry - Chemistry LibreTexts',
      titleZh: '旋光测定 - 化学文库',
      url: 'https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Supplemental_Modules_(Organic_Chemistry)/Chirality/Polarimetry',
      description: 'Practical applications in analytical chemistry',
      descriptionZh: '分析化学中的实际应用',
    },
  ],
}

/**
 * Rayleigh Scattering Demo - All Language Implementations
 * 瑞利散射演示 - 所有语言实现
 */
const RAYLEIGH_SCATTERING_SOURCE: DemoSourceCode = {
  id: 'rayleigh',
  name: 'Rayleigh Scattering - Why is the Sky Blue?',
  nameZh: '瑞利散射 - 为什么天空是蓝色？',
  description: 'Demonstration of wavelength-dependent scattering explaining blue sky and red sunset',
  descriptionZh: '波长相关散射演示，解释蓝天和红色日落',
  complexity: 'intermediate',

  concepts: [
    'Rayleigh scattering: I(θ, λ) ∝ (1 + cos²θ) / λ⁴',
    'Blue light scatters 5.6× more than red',
    '90° scattering produces 100% linear polarization',
    'Sun elevation affects sky color (path length effect)',
    'Polarization of skylight for animal navigation',
    'Applications in atmospheric optics and photography',
  ],
  conceptsZh: [
    '瑞利散射：I(θ, λ) ∝ (1 + cos²θ) / λ⁴',
    '蓝光散射强度是红光的5.6倍',
    '90°散射产生100%线偏振',
    '太阳高度影响天空颜色（光程效应）',
    '天空偏振光用于动物导航',
    '在大气光学和摄影中的应用',
  ],

  tags: ['scattering', 'rayleigh', 'sky-blue', 'polarization', 'atmosphere', 'intermediate'],

  relatedDemos: ['malus-law', 'mie-scattering', 'polarization-intro'],

  implementations: [
    {
      language: 'python',
      sourceCode: RayleighScatteringPython,
      dependencies: { numpy: '>=1.20.0', matplotlib: '>=3.3.0' },
      setup: `pip install numpy matplotlib
python rayleigh_scattering.py`,
      setupZh: `pip install numpy matplotlib
python rayleigh_scattering.py`,
      notes: 'Interactive sky scene with sun elevation (0-90°) and viewing angle adjustment. Shows blue/red ratio (~5.6×), wavelength-to-RGB conversion, and polar scattering pattern (1 + cos²θ).',
      notesZh: '交互式天空场景，可调节太阳高度(0-90°)和观察角度。显示蓝光/红光比值(~5.6×)、波长到RGB转换和极坐标散射图(1 + cos²θ)。',
    },
    {
      language: 'matlab',
      sourceCode: RayleighScatteringMatlab,
      dependencies: {},
      setup: `% In MATLAB/Octave:
rayleigh_scattering`,
      setupZh: `% 在 MATLAB/Octave 中:
rayleigh_scattering`,
      notes: 'MATLAB/Octave compatible (R2016b+, Octave 4.0+). No toolboxes required. Real-time sky color calculation and polarization display.',
      notesZh: 'MATLAB/Octave兼容 (R2016b+, Octave 4.0+)。无需工具箱。实时天空颜色计算和偏振显示。',
    },
  ],

  resources: [
    {
      type: 'documentation',
      title: 'Rayleigh Scattering - HyperPhysics',
      titleZh: '瑞利散射 - HyperPhysics',
      url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/atmos/blusky.html',
      description: 'Why is the sky blue? Physics explanation',
      descriptionZh: '为什么天空是蓝色的？物理解释',
    },
    {
      type: 'documentation',
      title: 'Atmospheric Optics - RP Photonics',
      titleZh: '大气光学 - RP光子学',
      url: 'https://www.rp-photonics.com/atmospheric_optics.html',
      description: 'Comprehensive guide to atmospheric optical phenomena',
      descriptionZh: '大气光学现象综合指南',
    },
    {
      type: 'tutorial',
      title: 'Polarization of Skylight',
      titleZh: '天光偏振',
      url: 'https://www.polarization.com/sky/sky.html',
      description: 'Detailed explanation of skylight polarization patterns',
      descriptionZh: '天光偏振模式的详细解释',
    },
  ],
}

/**
 * Jones Matrix Demo - Advanced Polarization Calculus
 * Jones矩阵演示 - 高级偏振演算
 */
const JONES_MATRIX_SOURCE: DemoSourceCode = {
  id: 'jones-matrix',
  name: 'Jones Matrix Calculus',
  nameZh: 'Jones矩阵演算',
  description: 'Interactive demonstration of Jones vectors and matrices for coherent polarization transformations',
  descriptionZh: '相干偏振变换的Jones向量和矩阵交互演示',
  complexity: 'advanced',

  concepts: [
    'Jones vector: E = [E_x, E_y]^T',
    'Jones matrix: E_out = J × E_in',
    'Linear polarizer: J = [cos²θ, cosθsinθ; cosθsinθ, sin²θ]',
    'Half-wave plate: Rotates polarization by 2θ',
    'Quarter-wave plate: Creates circular polarization',
    'Poincaré sphere visualization',
    'Complex amplitude representation',
  ],
  conceptsZh: [
    'Jones向量：E = [E_x, E_y]^T',
    'Jones矩阵：E_out = J × E_in',
    '线偏振器：J = [cos²θ, cosθsinθ; cosθsinθ, sin²θ]',
    '半波片：旋转偏振方向2θ',
    '四分之一波片：产生圆偏振',
    'Poincaré球可视化',
    '复振幅表示',
  ],

  tags: ['polarization', 'jones-calculus', 'jones-matrix', 'poincare-sphere', 'advanced', 'coherent-light'],

  relatedDemos: ['stokes-vector', 'mueller-matrix', 'waveplate', 'poincare-sphere-viewer'],

  implementations: [
    {
      language: 'python',
      sourceCode: JonesMatrixOptimizedPython,
      dependencies: {
        'numpy': '>=1.24.0',
        'matplotlib': '>=3.7.0',
      },
      setup: `# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install numpy matplotlib

# Run the optimized demo (PolarCraft unified theme)
python jones_matrix_optimized.py

# Or run the original version
python jones_matrix.py`,
      setupZh: `# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows系统: venv\\Scripts\\activate

# 安装依赖
pip install numpy matplotlib

# 运行优化版演示（PolarCraft统一主题）
python jones_matrix_optimized.py

# 或运行原始版本
python jones_matrix.py`,
      notes: 'Advanced interactive demo with 6 optical elements (Polarizer, HWP, QWP, Rotator, Phase Shifter, Custom Matrix). Features 3D Poincaré sphere visualization, real-time Jones calculus, and optimized PolarCraft dark theme.',
      notesZh: '高级交互演示，包含6种光学元件（偏振器、半波片、四分之一波片、旋转器、相移器、自定义矩阵）。具有3D Poincaré球可视化、实时Jones演算和优化的PolarCraft暗色主题。',
    },
  ],

  resources: [
    {
      type: 'documentation',
      title: 'Jones Calculus - Wikipedia',
      titleZh: 'Jones演算 - 维基百科',
      url: 'https://en.wikipedia.org/wiki/Jones_calculus',
      description: 'Comprehensive explanation of Jones vectors and matrices',
      descriptionZh: 'Jones向量和矩阵的全面解释',
    },
    {
      type: 'documentation',
      title: 'Poincaré Sphere - RP Photonics',
      titleZh: 'Poincaré球 - RP光子学',
      url: 'https://www.rp-photonics.com/poincare_sphere.html',
      description: 'Visual representation of polarization states',
      descriptionZh: '偏振态的可视化表示',
    },
    {
      type: 'paper',
      title: 'R. C. Jones (1941) - A New Calculus for the Treatment of Optical Systems',
      titleZh: 'R. C. Jones (1941) - 处理光学系统的新演算',
      url: 'https://doi.org/10.1364/JOSA.31.000488',
      description: 'Original paper introducing Jones calculus',
      descriptionZh: '介绍Jones演算的原始论文',
    },
  ],
}

/**
 * Stokes Vector Demo - Universal Polarization Description
 * Stokes参数演示 - 通用偏振描述
 */
const STOKES_VECTOR_SOURCE: DemoSourceCode = {
  id: 'stokes-vector',
  name: 'Stokes Vector & Parameters',
  nameZh: 'Stokes向量与参数',
  description: 'Interactive demonstration of Stokes parameters for complete polarization characterization including partial polarization',
  descriptionZh: 'Stokes参数的交互演示，完整表征包括部分偏振在内的偏振态',
  complexity: 'advanced',

  concepts: [
    'Stokes vector: S = [S₀, S₁, S₂, S₃]^T',
    'S₀: Total intensity',
    'S₁: H-V linear polarization difference',
    'S₂: +45°/-45° linear polarization difference',
    'S₃: RCP-LCP circular polarization difference',
    'Degree of polarization: DOP = √(S₁² + S₂² + S₃²) / S₀',
    'Represents both fully and partially polarized light',
    'Real-valued parameters (measurable)',
  ],
  conceptsZh: [
    'Stokes向量：S = [S₀, S₁, S₂, S₃]^T',
    'S₀：总光强',
    'S₁：水平-垂直线偏振差',
    'S₂：+45°/-45°线偏振差',
    'S₃：右旋-左旋圆偏振差',
    '偏振度：DOP = √(S₁² + S₂² + S₃²) / S₀',
    '可表示完全和部分偏振光',
    '实数参数（可测量）',
  ],

  tags: ['polarization', 'stokes-parameters', 'stokes-vector', 'dop', 'poincare-sphere', 'advanced', 'polarimetry'],

  relatedDemos: ['jones-matrix', 'mueller-matrix', 'polarimetric-microscopy', 'poincare-sphere-viewer'],

  implementations: [
    {
      language: 'python',
      sourceCode: StokesVectorOptimizedPython,
      dependencies: {
        'numpy': '>=1.24.0',
        'matplotlib': '>=3.7.0',
      },
      setup: `# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install numpy matplotlib

# Run the optimized demo (PolarCraft unified theme)
python stokes_vector_optimized.py

# Or run the original version
python stokes_vector.py`,
      setupZh: `# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows系统: venv\\Scripts\\activate

# 安装依赖
pip install numpy matplotlib

# 运行优化版演示（PolarCraft统一主题）
python stokes_vector_optimized.py

# 或运行原始版本
python stokes_vector.py`,
      notes: 'Comprehensive 6-panel visualization: Stokes bar chart, 3D Poincaré sphere, polarization ellipse, intensity measurements (I₀°/45°/90°/RCP), DOP gauge, and parameters table. Includes interactive sliders for S₁, S₂, S₃ with automatic normalization.',
      notesZh: '全面的6面板可视化：Stokes柱状图、3D Poincaré球、偏振椭圆、强度测量（I₀°/45°/90°/RCP）、偏振度仪表和参数表。包含S₁、S₂、S₃的交互滑块和自动归一化。',
    },
  ],

  resources: [
    {
      type: 'documentation',
      title: 'Stokes Parameters - Wikipedia',
      titleZh: 'Stokes参数 - 维基百科',
      url: 'https://en.wikipedia.org/wiki/Stokes_parameters',
      description: 'Complete mathematical formulation and physical interpretation',
      descriptionZh: '完整数学公式和物理解释',
    },
    {
      type: 'documentation',
      title: 'Polarimetry - RP Photonics',
      titleZh: '偏振测量 - RP光子学',
      url: 'https://www.rp-photonics.com/polarimetry.html',
      description: 'Measurement techniques for Stokes parameters',
      descriptionZh: 'Stokes参数的测量技术',
    },
    {
      type: 'paper',
      title: 'G. G. Stokes (1852) - On the Composition and Resolution of Streams of Polarized Light',
      titleZh: 'G. G. Stokes (1852) - 论偏振光流的合成与分解',
      url: 'https://doi.org/10.1017/CBO9780511702266.010',
      description: 'Original paper introducing Stokes parameters',
      descriptionZh: '介绍Stokes参数的原始论文',
    },
  ],
}

/**
 * Mueller Matrix Demo - General Polarization Transformations
 * Mueller矩阵演示 - 通用偏振变换
 */
const MUELLER_MATRIX_SOURCE: DemoSourceCode = {
  id: 'mueller-matrix',
  name: 'Mueller Matrix Calculus',
  nameZh: 'Mueller矩阵演算',
  description: 'Interactive demonstration of Mueller matrices for general polarization transformations including depolarization',
  descriptionZh: 'Mueller矩阵的交互演示，用于包括退偏在内的通用偏振变换',
  complexity: 'advanced',

  concepts: [
    'Mueller matrix: 4×4 real matrix',
    'S_out = M × S_in (operates on Stokes vectors)',
    'Handles partial polarization and depolarization',
    'Lu-Chipman decomposition: M = M_Δ × M_R × M_D',
    'Diattenuation: Preferential absorption',
    'Retardance: Phase delay between components',
    'Depolarization: Reduces degree of polarization',
    'Most general polarization formalism',
  ],
  conceptsZh: [
    'Mueller矩阵：4×4实数矩阵',
    'S_out = M × S_in（作用于Stokes向量）',
    '处理部分偏振和退偏',
    'Lu-Chipman分解：M = M_Δ × M_R × M_D',
    '二向衰减：优先吸收',
    '延迟：分量间相位延迟',
    '退偏：降低偏振度',
    '最通用的偏振形式',
  ],

  tags: ['polarization', 'mueller-matrix', 'depolarization', 'lu-chipman', 'advanced', 'polarimetry'],

  relatedDemos: ['stokes-vector', 'jones-matrix', 'polarimetric-microscopy'],

  implementations: [
    {
      language: 'python',
      sourceCode: MuellerMatrixOptimizedPython,
      dependencies: {
        'numpy': '>=1.24.0',
        'matplotlib': '>=3.7.0',
      },
      setup: `# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install numpy matplotlib

# Run the optimized demo (PolarCraft unified theme)
python mueller_matrix_optimized.py

# Or run the original version
python mueller_matrix.py`,
      setupZh: `# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows系统: venv\\Scripts\\activate

# 安装依赖
pip install numpy matplotlib

# 运行优化版演示（PolarCraft统一主题）
python mueller_matrix_optimized.py

# 或运行原始版本
python mueller_matrix.py`,
      notes: 'Advanced multi-panel demo with 7 optical elements (Polarizer, HWP, QWP, Rotator, Diattenuator, Depolarizer, Custom Matrix). Features Lu-Chipman decomposition, input/output Stokes visualization, 3D Poincaré sphere, and detailed matrix display.',
      notesZh: '高级多面板演示，包含7种光学元件（偏振器、半波片、四分之一波片、旋转器、二向衰减器、退偏器、自定义矩阵）。具有Lu-Chipman分解、输入/输出Stokes可视化、3D Poincaré球和详细矩阵显示。',
    },
  ],

  resources: [
    {
      type: 'documentation',
      title: 'Mueller Calculus - Wikipedia',
      titleZh: 'Mueller演算 - 维基百科',
      url: 'https://en.wikipedia.org/wiki/Mueller_calculus',
      description: 'Comprehensive explanation of Mueller matrices',
      descriptionZh: 'Mueller矩阵的全面解释',
    },
    {
      type: 'documentation',
      title: 'Depolarization - RP Photonics',
      titleZh: '退偏 - RP光子学',
      url: 'https://www.rp-photonics.com/depolarization.html',
      description: 'Understanding depolarization in optical systems',
      descriptionZh: '理解光学系统中的退偏',
    },
    {
      type: 'paper',
      title: 'S-Y Lu & R. A. Chipman (1996) - Interpretation of Mueller matrices',
      titleZh: 'S-Y Lu & R. A. Chipman (1996) - Mueller矩阵的解释',
      url: 'https://doi.org/10.1364/JOSAA.13.001106',
      description: 'Lu-Chipman decomposition method',
      descriptionZh: 'Lu-Chipman分解方法',
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
  'waveplate': WAVEPLATE_SOURCE,
  'brewster': BREWSTER_SOURCE,
  'optical-rotation': OPTICAL_ROTATION_SOURCE,
  'rayleigh': RAYLEIGH_SCATTERING_SOURCE,

  // Stage 2: Advanced polarimetry (Jones/Stokes/Mueller)
  // 阶段2：高级偏振测量（Jones/Stokes/Mueller）
  'jones-matrix': JONES_MATRIX_SOURCE,
  'stokes-vector': STOKES_VECTOR_SOURCE,
  'mueller-matrix': MUELLER_MATRIX_SOURCE,

  // TODO: Add more demos
  // 'chromatic': CHROMATIC_SOURCE,
  // 'mie-scattering': MIE_SCATTERING_SOURCE,
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
