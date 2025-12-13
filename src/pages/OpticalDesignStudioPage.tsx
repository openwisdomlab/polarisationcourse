/**
 * Optical Design Studio - 光学设计室
 * 器件图鉴 × 光学工作台 合并模块
 *
 * Unified module combining:
 * - Device Library (器件图鉴): Comprehensive optical component encyclopedia
 * - Optical Bench (光学工作台): Interactive light path designer
 *
 * Features:
 * - Browse optical devices with detailed specifications
 * - Load classic experiments or design custom setups
 * - Real-time light path simulation
 * - UC2 hardware mapping for physical builds
 */

import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Badge } from '@/components/shared'
import {
  Home, Search, Play, Pause, RotateCcw,
  ChevronRight, ChevronLeft, Trash2, Eye, EyeOff,
  Lightbulb, Layers, Book, FlaskConical, Wrench,
  Box, ExternalLink, X, Plus,
  Circle, Square, Triangle
} from 'lucide-react'
import { DeviceIconMap, DefaultDeviceIcon } from '@/components/icons'
import {
  OpticalComponentMap,
  LightBeam,
  type OpticalComponentType
} from '@/components/bench'

// ============================================
// Types & Interfaces
// ============================================

type DeviceCategory = 'polarizers' | 'waveplates' | 'splitters' | 'retarders' | 'uc2' | 'other'
type BenchComponentType = 'emitter' | 'polarizer' | 'waveplate' | 'mirror' | 'splitter' | 'sensor' | 'lens'
type SidebarTab = 'devices' | 'experiments' | 'design'

interface Device {
  id: string
  nameEn: string
  nameZh: string
  category: DeviceCategory
  descriptionEn: string
  descriptionZh: string
  principleEn: string
  principleZh: string
  icon: string
  specifications?: { key: string; valueEn: string; valueZh: string }[]
  applications?: { en: string[]; zh: string[] }
  mathFormula?: string
  relatedDevices?: string[]
  purchaseLinks?: { name: string; url: string }[]
  difficulty: 'basic' | 'intermediate' | 'advanced'
  benchComponentType?: BenchComponentType // Maps device to bench component
}

interface BenchComponent {
  id: string
  type: BenchComponentType
  x: number
  y: number
  rotation: number
  properties: Record<string, number | string | boolean>
}

interface ClassicExperiment {
  id: string
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  difficulty: 'easy' | 'medium' | 'hard'
  components: BenchComponent[]
  learningPoints: { en: string[]; zh: string[] }
  linkedDemo?: string
}

// ============================================
// Device Catalog Data
// ============================================

const DEVICES: Device[] = [
  // === Polarizers ===
  {
    id: 'linear-polarizer',
    nameEn: 'Linear Polarizer',
    nameZh: '线偏振片',
    category: 'polarizers',
    descriptionEn: 'Transmits light polarized along a single axis while absorbing orthogonal polarization.',
    descriptionZh: '透过沿单一轴偏振的光，同时吸收正交偏振方向的光。',
    principleEn: 'Uses dichroic materials (like stretched PVA with iodine) that selectively absorb light polarized perpendicular to the transmission axis.',
    principleZh: '使用二向色性材料（如碘染色的拉伸PVA），选择性吸收与透光轴垂直的偏振光。',
    icon: '◐',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 10,000:1', valueZh: '> 10,000:1' },
      { key: 'Transmission', valueEn: '38-42% (unpolarized)', valueZh: '38-42%（自然光）' },
      { key: 'Wavelength Range', valueEn: '400-700 nm', valueZh: '400-700 nm' },
    ],
    applications: {
      en: ['LCD displays', 'Photography filters', 'Glare reduction sunglasses'],
      zh: ['LCD显示器', '摄影滤镜', '防眩光太阳镜'],
    },
    mathFormula: 'I = I₀ cos²θ (Malus\'s Law)',
    difficulty: 'basic',
    benchComponentType: 'polarizer',
  },
  {
    id: 'circular-polarizer',
    nameEn: 'Circular Polarizer',
    nameZh: '圆偏振片',
    category: 'polarizers',
    descriptionEn: 'Converts unpolarized light to circularly polarized light using a linear polarizer and quarter-wave plate.',
    descriptionZh: '使用线偏振片和四分之一波片将自然光转换为圆偏振光。',
    principleEn: 'Combines a linear polarizer with a quarter-wave plate oriented at 45°.',
    principleZh: '将线偏振片与45°取向的四分之一波片结合。',
    icon: '◉',
    specifications: [
      { key: 'Circularity', valueEn: '> 95%', valueZh: '> 95%' },
      { key: 'Transmission', valueEn: '35-40%', valueZh: '35-40%' },
    ],
    applications: {
      en: ['3D cinema glasses', 'Camera autofocus compatibility'],
      zh: ['3D电影眼镜', '相机自动对焦兼容'],
    },
    mathFormula: 'E = E₀(x̂ ± iŷ)/√2',
    difficulty: 'intermediate',
    benchComponentType: 'polarizer',
  },
  {
    id: 'wire-grid-polarizer',
    nameEn: 'Wire Grid Polarizer',
    nameZh: '金属线栅偏振器',
    category: 'polarizers',
    descriptionEn: 'Metallic wire array that reflects one polarization and transmits the orthogonal polarization.',
    descriptionZh: '金属线阵列，反射一种偏振方向的光，透射正交偏振方向的光。',
    principleEn: 'Sub-wavelength parallel metal wires act as a polarization-selective structure.',
    principleZh: '亚波长平行金属线作为偏振选择性结构。',
    icon: '≡',
    specifications: [
      { key: 'Wire Pitch', valueEn: '< λ/2', valueZh: '< λ/2' },
      { key: 'Extinction Ratio', valueEn: '> 1000:1 (IR)', valueZh: '> 1000:1（红外）' },
    ],
    applications: {
      en: ['Infrared polarimetry', 'High-power lasers'],
      zh: ['红外偏振测量', '高功率激光器'],
    },
    difficulty: 'advanced',
    benchComponentType: 'polarizer',
  },
  // === Wave Plates ===
  {
    id: 'quarter-wave-plate',
    nameEn: 'Quarter-Wave Plate (λ/4)',
    nameZh: '四分之一波片（λ/4）',
    category: 'waveplates',
    descriptionEn: 'Introduces a 90° (λ/4) phase retardation, converting linear to circular polarization.',
    descriptionZh: '引入90°（λ/4）相位延迟，将线偏振光转换为圆偏振光。',
    principleEn: 'Made from birefringent crystal with different refractive indices along crystal axes.',
    principleZh: '由双折射晶体制成，沿晶轴具有不同折射率。',
    icon: '¼',
    specifications: [
      { key: 'Retardation', valueEn: 'λ/4 ± λ/300', valueZh: 'λ/4 ± λ/300' },
      { key: 'Material', valueEn: 'Quartz / Polymer', valueZh: '石英/聚合物' },
    ],
    applications: {
      en: ['Circular polarization generation', 'Optical isolators', 'Ellipsometry'],
      zh: ['圆偏振光产生', '光隔离器', '椭偏仪'],
    },
    mathFormula: 'Δφ = π/2',
    difficulty: 'intermediate',
    benchComponentType: 'waveplate',
  },
  {
    id: 'half-wave-plate',
    nameEn: 'Half-Wave Plate (λ/2)',
    nameZh: '二分之一波片（λ/2）',
    category: 'waveplates',
    descriptionEn: 'Introduces 180° (λ/2) phase retardation, rotating linear polarization by twice the angle to fast axis.',
    descriptionZh: '引入180°（λ/2）相位延迟，使线偏振方向旋转快轴夹角的两倍。',
    principleEn: 'Rotates polarization plane: output angle = 2×(fast axis angle) - input angle.',
    principleZh: '旋转偏振平面：输出角度 = 2×（快轴角度）- 输入角度。',
    icon: '½',
    specifications: [
      { key: 'Retardation', valueEn: 'λ/2 ± λ/300', valueZh: 'λ/2 ± λ/300' },
      { key: 'Rotation Range', valueEn: '0-90° (continuous)', valueZh: '0-90°（连续）' },
    ],
    applications: {
      en: ['Polarization rotation', 'Laser power control'],
      zh: ['偏振旋转', '激光功率控制'],
    },
    mathFormula: 'θ_out = 2θ_axis - θ_in',
    difficulty: 'intermediate',
    benchComponentType: 'waveplate',
  },
  // === Beam Splitters ===
  {
    id: 'pbs',
    nameEn: 'Polarizing Beam Splitter (PBS)',
    nameZh: '偏振分束器（PBS）',
    category: 'splitters',
    descriptionEn: 'Separates incident light into two orthogonally polarized beams.',
    descriptionZh: '将入射光分离为两束正交偏振光。',
    principleEn: 'Uses multilayer dielectric coating at 45°. P-polarization transmitted, s-polarization reflected.',
    principleZh: '使用45°多层介质膜。p偏振透射，s偏振反射。',
    icon: '⊠',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 1000:1', valueZh: '> 1000:1' },
      { key: 'Transmission (p)', valueEn: '> 95%', valueZh: '> 95%' },
    ],
    applications: {
      en: ['Laser beam combining', 'Interferometry', 'Quantum optics'],
      zh: ['激光合束', '干涉测量', '量子光学'],
    },
    difficulty: 'intermediate',
    benchComponentType: 'splitter',
  },
  {
    id: 'npbs',
    nameEn: 'Non-Polarizing Beam Splitter',
    nameZh: '非偏振分束器（NPBS）',
    category: 'splitters',
    descriptionEn: 'Splits light 50/50 regardless of polarization state.',
    descriptionZh: '无论偏振态如何，以50/50比例分光。',
    principleEn: 'Metal or dielectric coating optimized for equal reflection and transmission.',
    principleZh: '金属或介质膜优化为反射透射相等。',
    icon: '◫',
    specifications: [
      { key: 'Split Ratio', valueEn: '50:50 ± 5%', valueZh: '50:50 ± 5%' },
    ],
    applications: {
      en: ['Interferometers', 'Imaging systems'],
      zh: ['干涉仪', '成像系统'],
    },
    difficulty: 'basic',
    benchComponentType: 'splitter',
  },
  {
    id: 'calcite-splitter',
    nameEn: 'Calcite Beam Displacer',
    nameZh: '方解石分束位移器',
    category: 'splitters',
    descriptionEn: 'Natural birefringent crystal that spatially separates o-ray and e-ray.',
    descriptionZh: '天然双折射晶体，在空间上分离o光和e光。',
    principleEn: 'Calcite has large birefringence (Δn ≈ 0.17). O-ray follows Snell\'s law; e-ray walks off.',
    principleZh: '方解石双折射率大（Δn ≈ 0.17）。o光遵循斯涅尔定律；e光走离。',
    icon: '◇',
    specifications: [
      { key: 'Birefringence', valueEn: 'Δn = 0.172 @ 590nm', valueZh: 'Δn = 0.172 @ 590nm' },
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
    ],
    applications: {
      en: ['High-precision polarimetry', 'Quantum optics'],
      zh: ['高精度偏振测量', '量子光学'],
    },
    difficulty: 'advanced',
    benchComponentType: 'splitter',
  },
  // === Glan Prisms ===
  {
    id: 'glan-thompson',
    nameEn: 'Glan-Thompson Prism',
    nameZh: '格兰-汤姆逊棱镜',
    category: 'polarizers',
    descriptionEn: 'High-performance polarizing prism with wide acceptance angle.',
    descriptionZh: '高性能偏振棱镜，具有宽接收角。',
    principleEn: 'Two calcite prisms cemented together. O-ray totally reflected; e-ray transmitted.',
    principleZh: '两个方解石棱镜胶合。o光全反射；e光透射。',
    icon: '◆',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Acceptance Angle', valueEn: '15-20°', valueZh: '15-20°' },
    ],
    applications: {
      en: ['Precision polarimetry', 'Spectroscopy'],
      zh: ['精密偏振测量', '光谱学'],
    },
    difficulty: 'advanced',
    benchComponentType: 'polarizer',
  },
  {
    id: 'wollaston-prism',
    nameEn: 'Wollaston Prism',
    nameZh: '沃拉斯顿棱镜',
    category: 'splitters',
    descriptionEn: 'Birefringent prism that separates beam into two diverging orthogonally polarized beams.',
    descriptionZh: '双折射棱镜，将光束分成两束发散的正交偏振光。',
    principleEn: 'Two calcite wedges with perpendicular optic axes cemented together.',
    principleZh: '两个光轴垂直的方解石楔形棱镜粘合。',
    icon: '⋈',
    specifications: [
      { key: 'Separation Angle', valueEn: '1° - 20°', valueZh: '1° - 20°' },
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
    ],
    applications: {
      en: ['Differential interference contrast', 'Polarization interferometry'],
      zh: ['微分干涉对比', '偏振干涉测量'],
    },
    difficulty: 'advanced',
    benchComponentType: 'splitter',
  },
  // === UC2 Modules ===
  {
    id: 'uc2-polarizer-cube',
    nameEn: 'UC2 Polarizer Cube',
    nameZh: 'UC2 偏振片模块',
    category: 'uc2',
    descriptionEn: 'Modular polarizer insert for UC2 system with snap-fit design.',
    descriptionZh: 'UC2系统的模块化偏振片插件，卡扣设计。',
    principleEn: 'Standard linear polarizer in 3D-printed cube compatible with UC2 rail system.',
    principleZh: '标准线偏振片安装在与UC2导轨兼容的3D打印立方体中。',
    icon: '🔲',
    specifications: [
      { key: 'Cube Size', valueEn: '50×50×50 mm', valueZh: '50×50×50 mm' },
      { key: 'Aperture', valueEn: '25 mm', valueZh: '25 mm' },
    ],
    applications: {
      en: ['Education experiments', 'Rapid prototyping'],
      zh: ['教育实验', '快速原型'],
    },
    purchaseLinks: [{ name: 'UC2 GitHub', url: 'https://github.com/openUC2/UC2-GIT' }],
    difficulty: 'basic',
    benchComponentType: 'polarizer',
  },
  {
    id: 'uc2-waveplate-holder',
    nameEn: 'UC2 Waveplate Holder',
    nameZh: 'UC2 波片支架',
    category: 'uc2',
    descriptionEn: 'Precision rotation mount for waveplates in UC2 system.',
    descriptionZh: 'UC2系统中波片的精密旋转支架。',
    principleEn: 'Accepts standard 1" waveplates with graduated rotation scale.',
    principleZh: '接受标准1英寸波片，带刻度旋转刻度。',
    icon: '🔄',
    specifications: [
      { key: 'Optic Size', valueEn: '1" (25.4 mm)', valueZh: '1英寸' },
      { key: 'Resolution', valueEn: '1° graduations', valueZh: '1°刻度' },
    ],
    applications: {
      en: ['Polarization experiments', 'Student labs'],
      zh: ['偏振实验', '学生实验室'],
    },
    purchaseLinks: [{ name: 'UC2 GitHub', url: 'https://github.com/openUC2/UC2-GIT' }],
    difficulty: 'basic',
    benchComponentType: 'waveplate',
  },
  {
    id: 'uc2-led-matrix',
    nameEn: 'UC2 LED Matrix Module',
    nameZh: 'UC2 LED矩阵模块',
    category: 'uc2',
    descriptionEn: 'Programmable LED array for illumination control.',
    descriptionZh: '可编程LED阵列用于照明控制。',
    principleEn: 'Addressable RGB LED matrix controlled via ESP32.',
    principleZh: '通过ESP32控制的可寻址RGB LED矩阵。',
    icon: '💡',
    specifications: [
      { key: 'LED Count', valueEn: '8×8 or 4×4', valueZh: '8×8 或 4×4' },
      { key: 'Control', valueEn: 'ESP32 WiFi/USB', valueZh: 'ESP32 WiFi/USB' },
    ],
    applications: {
      en: ['Köhler illumination', 'Dark-field microscopy'],
      zh: ['柯勒照明', '暗场显微镜'],
    },
    purchaseLinks: [{ name: 'UC2 GitHub', url: 'https://github.com/openUC2/UC2-GIT' }],
    difficulty: 'intermediate',
    benchComponentType: 'emitter',
  },
]

// Category configuration
const CATEGORIES: { id: DeviceCategory | 'all'; labelEn: string; labelZh: string; icon: typeof Circle }[] = [
  { id: 'all', labelEn: 'All', labelZh: '全部', icon: Layers },
  { id: 'polarizers', labelEn: 'Polarizers', labelZh: '偏振器', icon: Circle },
  { id: 'waveplates', labelEn: 'Wave Plates', labelZh: '波片', icon: Layers },
  { id: 'splitters', labelEn: 'Splitters', labelZh: '分束器', icon: Triangle },
  { id: 'uc2', labelEn: 'UC2', labelZh: 'UC2模块', icon: Square },
]

// ============================================
// Classic Experiments Data
// ============================================

const CLASSIC_EXPERIMENTS: ClassicExperiment[] = [
  {
    id: 'malus-law',
    nameEn: 'Malus\'s Law Verification',
    nameZh: '马吕斯定律验证',
    descriptionEn: 'Measure intensity through two polarizers as function of angle.',
    descriptionZh: '测量光通过两块偏振片时强度随角度的变化。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 250, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'p2', type: 'polarizer', x: 400, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 's1', type: 'sensor', x: 550, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['I = I₀ cos²θ', 'Crossed polarizers block light', 'Intensity varies with angle'],
      zh: ['I = I₀ cos²θ', '正交偏振片阻挡光线', '强度随角度变化'],
    },
    linkedDemo: 'malus-law',
  },
  {
    id: 'three-polarizer-paradox',
    nameEn: 'Three Polarizer Paradox',
    nameZh: '三偏振片悖论',
    descriptionEn: 'Adding a third polarizer can increase transmitted light.',
    descriptionZh: '添加第三块偏振片反而能增加透射光强。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 60, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 160, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'p2', type: 'polarizer', x: 300, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'p3', type: 'polarizer', x: 440, y: 200, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 560, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['0° and 90° block all light', '45° polarizer allows some through', 'I = I₀/4'],
      zh: ['0°和90°阻挡所有光', '45°偏振片允许部分通过', 'I = I₀/4'],
    },
    linkedDemo: 'malus-law',
  },
  {
    id: 'quarter-wave',
    nameEn: 'Circular Polarization',
    nameZh: '圆偏振光产生',
    descriptionEn: 'Use linear polarizer and quarter-wave plate to create circular polarization.',
    descriptionZh: '使用线偏振片和λ/4波片产生圆偏振光。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 220, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 'w1', type: 'waveplate', x: 340, y: 200, rotation: 0, properties: { retardation: 90 } },
      { id: 's1', type: 'sensor', x: 480, y: 200, rotation: 0, properties: { mode: 'polarization' } },
    ],
    learningPoints: {
      en: ['45° linear + λ/4 → circular', 'Phase difference creates rotation', 'Handedness depends on orientation'],
      zh: ['45°线偏振 + λ/4 → 圆偏振', '相位差产生旋转', '旋向取决于取向'],
    },
    linkedDemo: 'waveplate',
  },
  {
    id: 'birefringence',
    nameEn: 'Birefringent Crystal',
    nameZh: '双折射晶体',
    descriptionEn: 'Split light into o-ray and e-ray using calcite.',
    descriptionZh: '使用方解石将光分裂为o光和e光。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 200, rotation: 0, properties: { polarization: 45 } },
      { id: 'c1', type: 'splitter', x: 280, y: 200, rotation: 0, properties: { type: 'calcite' } },
      { id: 's1', type: 'sensor', x: 450, y: 150, rotation: 0, properties: {} },
      { id: 's2', type: 'sensor', x: 450, y: 250, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['O-ray: nₒ constant', 'E-ray: nₑ varies', 'Orthogonal polarizations'],
      zh: ['o光：折射率恒定', 'e光：折射率变化', '偏振正交'],
    },
    linkedDemo: 'birefringence',
  },
  {
    id: 'half-wave-rotation',
    nameEn: 'Half-Wave Plate Rotation',
    nameZh: '半波片偏振旋转',
    descriptionEn: 'Use λ/2 plate to rotate polarization by 2θ.',
    descriptionZh: '使用λ/2波片将偏振旋转2θ。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: 0 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'w1', type: 'waveplate', x: 320, y: 200, rotation: 0, properties: { retardation: 180 } },
      { id: 'p2', type: 'polarizer', x: 460, y: 200, rotation: 0, properties: { angle: 45 } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['λ/2 rotates by 2θ', 'Output remains linear', 'Fast axis at θ → rotate 2θ'],
      zh: ['λ/2使偏振旋转2θ', '输出仍为线偏振', '快轴θ→旋转2θ'],
    },
    linkedDemo: 'waveplate',
  },
  {
    id: 'brewster-angle',
    nameEn: 'Brewster\'s Angle',
    nameZh: '布儒斯特角',
    descriptionEn: 'Find the angle where reflected light is completely polarized.',
    descriptionZh: '寻找反射光完全偏振的入射角。',
    difficulty: 'medium',
    components: [
      { id: 'e1', type: 'emitter', x: 100, y: 150, rotation: 56, properties: { polarization: -1 } },
      { id: 'm1', type: 'mirror', x: 300, y: 250, rotation: 0, properties: { material: 'glass' } },
      { id: 'p1', type: 'polarizer', x: 450, y: 150, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 550, y: 150, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['tan θ_B = n₂/n₁', 'Reflected light is s-polarized', 'Polarizer-free polarization'],
      zh: ['tan θ_B = n₂/n₁', '反射光为s偏振', '无偏振片的偏振'],
    },
    linkedDemo: 'brewster-angle',
  },
  {
    id: 'polarimeter',
    nameEn: 'Polarimeter',
    nameZh: '旋光仪',
    descriptionEn: 'Measure optical rotation of chiral substances.',
    descriptionZh: '测量手性物质的旋光度。',
    difficulty: 'easy',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'sample', type: 'lens', x: 330, y: 200, rotation: 0, properties: { type: 'sugar' } },
      { id: 'p2', type: 'polarizer', x: 480, y: 200, rotation: 0, properties: { angle: 10 } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['α = [α] × c × L', 'D-glucose rotates right', 'L-glucose rotates left'],
      zh: ['α = [α] × c × L', 'D-葡萄糖右旋', 'L-葡萄糖左旋'],
    },
    linkedDemo: 'optical-rotation',
  },
  {
    id: 'stress-analysis',
    nameEn: 'Photoelastic Stress',
    nameZh: '光弹应力分析',
    descriptionEn: 'Visualize stress in transparent materials.',
    descriptionZh: '观察透明材料的应力分布。',
    difficulty: 'hard',
    components: [
      { id: 'e1', type: 'emitter', x: 80, y: 200, rotation: 0, properties: { polarization: -1 } },
      { id: 'p1', type: 'polarizer', x: 180, y: 200, rotation: 0, properties: { angle: 0 } },
      { id: 'sample', type: 'lens', x: 320, y: 200, rotation: 0, properties: { type: 'sample' } },
      { id: 'p2', type: 'polarizer', x: 460, y: 200, rotation: 0, properties: { angle: 90 } },
      { id: 's1', type: 'sensor', x: 580, y: 200, rotation: 0, properties: {} },
    ],
    learningPoints: {
      en: ['Stress induces birefringence', 'Isochromatic fringes', 'Engineering design tool'],
      zh: ['应力诱导双折射', '等色线显示应力', '工程设计工具'],
    },
    linkedDemo: 'stress-birefringence',
  },
]

// ============================================
// Component Palette for Free Design
// ============================================

const PALETTE_COMPONENTS: {
  type: BenchComponentType
  icon: string
  nameEn: string
  nameZh: string
  color: string
  principleEn: string
  principleZh: string
}[] = [
  { type: 'emitter', icon: '💡', nameEn: 'Light Source', nameZh: '光源', color: 'yellow', principleEn: 'Emits polarized light', principleZh: '发射偏振光' },
  { type: 'polarizer', icon: '◐', nameEn: 'Polarizer', nameZh: '偏振片', color: 'indigo', principleEn: 'I = I₀ cos²θ', principleZh: 'I = I₀ cos²θ' },
  { type: 'waveplate', icon: '◈', nameEn: 'Wave Plate', nameZh: '波片', color: 'violet', principleEn: 'λ/4 or λ/2 retardation', principleZh: 'λ/4或λ/2延迟' },
  { type: 'mirror', icon: '🪞', nameEn: 'Mirror', nameZh: '反射镜', color: 'cyan', principleEn: 'θᵢ = θᵣ', principleZh: '入射角=反射角' },
  { type: 'splitter', icon: '◇', nameEn: 'Splitter', nameZh: '分束器', color: 'emerald', principleEn: 'PBS or calcite', principleZh: 'PBS或方解石' },
  { type: 'sensor', icon: '📡', nameEn: 'Detector', nameZh: '探测器', color: 'rose', principleEn: 'Measures intensity', principleZh: '测量光强' },
  { type: 'lens', icon: '🔍', nameEn: 'Lens', nameZh: '透镜', color: 'amber', principleEn: '1/f = 1/do + 1/di', principleZh: '薄透镜公式' },
]

// UC2 hardware mapping
const UC2_COMPONENT_MAP: Record<BenchComponentType, { uc2Id: string; nameEn: string; nameZh: string }> = {
  emitter: { uc2Id: 'UC2-LED', nameEn: 'UC2 LED Module', nameZh: 'UC2 LED模块' },
  polarizer: { uc2Id: 'UC2-POL', nameEn: 'UC2 Polarizer Cube', nameZh: 'UC2 偏振片模块' },
  waveplate: { uc2Id: 'UC2-WP', nameEn: 'UC2 Waveplate Holder', nameZh: 'UC2 波片支架' },
  mirror: { uc2Id: 'UC2-MIR', nameEn: 'UC2 Mirror Mount', nameZh: 'UC2 反射镜支架' },
  splitter: { uc2Id: 'UC2-BS', nameEn: 'UC2 Beam Splitter', nameZh: 'UC2 分束器模块' },
  sensor: { uc2Id: 'UC2-CAM', nameEn: 'UC2 Camera Module', nameZh: 'UC2 相机模块' },
  lens: { uc2Id: 'UC2-LENS', nameEn: 'UC2 Lens Holder', nameZh: 'UC2 透镜支架' },
}

const DIFFICULTY_CONFIG = {
  basic: { labelEn: 'Basic', labelZh: '基础', color: 'green' as const },
  intermediate: { labelEn: 'Intermediate', labelZh: '进阶', color: 'yellow' as const },
  advanced: { labelEn: 'Advanced', labelZh: '高级', color: 'red' as const },
  easy: { labelEn: 'Easy', labelZh: '简单', color: 'green' as const },
  medium: { labelEn: 'Medium', labelZh: '中等', color: 'yellow' as const },
  hard: { labelEn: 'Hard', labelZh: '困难', color: 'red' as const },
}

// ============================================
// Sub-Components
// ============================================

// Device Card Component
function DeviceCard({
  device,
  isSelected,
  onClick,
  onAddToBench,
}: {
  device: Device
  isSelected: boolean
  onClick: () => void
  onAddToBench?: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[device.difficulty]
  const IconComponent = DeviceIconMap[device.id] || DefaultDeviceIcon

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-lg border p-3 cursor-pointer transition-all',
        'hover:shadow-md group',
        isSelected
          ? theme === 'dark'
            ? 'bg-indigo-500/20 border-indigo-500'
            : 'bg-indigo-50 border-indigo-400'
          : theme === 'dark'
            ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
            : 'bg-white border-gray-200 hover:border-gray-300'
      )}
    >
      <div className="flex items-start gap-2">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden',
          theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
        )}>
          <IconComponent size={32} theme={theme} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-medium text-sm line-clamp-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? device.nameZh : device.nameEn}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge color={difficulty.color} size="sm">
              {isZh ? difficulty.labelZh : difficulty.labelEn}
            </Badge>
          </div>
        </div>
        {onAddToBench && device.benchComponentType && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddToBench()
            }}
            className={cn(
              'p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all',
              theme === 'dark'
                ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
                : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
            )}
            title={isZh ? '添加到光路' : 'Add to bench'}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Device Detail Panel
function DeviceDetailPanel({
  device,
  onClose,
  onAddToBench,
}: {
  device: Device
  onClose: () => void
  onAddToBench?: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[device.difficulty]
  const IconComponent = DeviceIconMap[device.id] || DefaultDeviceIcon

  return (
    <div className={cn(
      'absolute right-0 top-0 bottom-0 w-80 border-l overflow-y-auto z-30',
      theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
    )}>
      {/* Header */}
      <div className={cn(
        'sticky top-0 flex items-center justify-between p-4 border-b backdrop-blur-sm',
        theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
      )}>
        <span className={cn('font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
          {isZh ? '器件详情' : 'Device Details'}
        </span>
        <button
          onClick={onClose}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Device Header */}
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden',
            theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'
          )}>
            <IconComponent size={48} theme={theme} />
          </div>
          <div>
            <h3 className={cn('font-bold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {isZh ? device.nameZh : device.nameEn}
            </h3>
            <Badge color={difficulty.color} size="sm">
              {isZh ? difficulty.labelZh : difficulty.labelEn}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className={cn(
            'text-xs font-semibold uppercase tracking-wider mb-1',
            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
          )}>
            {isZh ? '描述' : 'Description'}
          </h4>
          <p className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            {isZh ? device.descriptionZh : device.descriptionEn}
          </p>
        </div>

        {/* Principle */}
        <div>
          <h4 className={cn(
            'text-xs font-semibold uppercase tracking-wider mb-1',
            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
          )}>
            {isZh ? '工作原理' : 'Principle'}
          </h4>
          <p className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            {isZh ? device.principleZh : device.principleEn}
          </p>
          {device.mathFormula && (
            <div className={cn(
              'mt-2 p-2 rounded font-mono text-sm',
              theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-gray-100 text-cyan-700'
            )}>
              {device.mathFormula}
            </div>
          )}
        </div>

        {/* Specifications */}
        {device.specifications && device.specifications.length > 0 && (
          <div>
            <h4 className={cn(
              'text-xs font-semibold uppercase tracking-wider mb-1',
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            )}>
              {isZh ? '技术参数' : 'Specs'}
            </h4>
            <div className={cn(
              'rounded-lg border divide-y text-sm',
              theme === 'dark' ? 'border-slate-700 divide-slate-700' : 'border-gray-200 divide-gray-200'
            )}>
              {device.specifications.map((spec, idx) => (
                <div key={idx} className="flex justify-between p-2">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>{spec.key}</span>
                  <span className={cn('font-medium', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                    {isZh ? spec.valueZh : spec.valueEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications */}
        {device.applications && (
          <div>
            <h4 className={cn(
              'text-xs font-semibold uppercase tracking-wider mb-1',
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            )}>
              {isZh ? '应用' : 'Applications'}
            </h4>
            <div className="flex flex-wrap gap-1">
              {(isZh ? device.applications.zh : device.applications.en).map((app, idx) => (
                <span
                  key={idx}
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs',
                    theme === 'dark' ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  )}
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Links */}
        {device.purchaseLinks && device.purchaseLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {device.purchaseLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium',
                  theme === 'dark'
                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                )}
              >
                {link.name}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}

        {/* Add to Bench Button */}
        {onAddToBench && device.benchComponentType && (
          <button
            onClick={onAddToBench}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all',
              'bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700'
            )}
          >
            <Plus className="w-4 h-4" />
            {isZh ? '添加到光路' : 'Add to Bench'}
          </button>
        )}
      </div>
    </div>
  )
}

// Experiment Card
function ExperimentCard({
  experiment,
  onLoad,
}: {
  experiment: ClassicExperiment
  onLoad: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[experiment.difficulty]

  return (
    <div className={cn(
      'rounded-lg border p-3 transition-all hover:shadow-md',
      theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className={cn(
          'font-medium text-sm line-clamp-1',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? experiment.nameZh : experiment.nameEn}
        </h4>
        <Badge color={difficulty.color} size="sm">
          {isZh ? difficulty.labelZh : difficulty.labelEn}
        </Badge>
      </div>
      <p className={cn(
        'text-xs mb-2 line-clamp-2',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? experiment.descriptionZh : experiment.descriptionEn}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onLoad}
          className={cn(
            'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
            theme === 'dark'
              ? 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
              : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
          )}
        >
          <Play className="w-3 h-3" />
          {isZh ? '加载' : 'Load'}
        </button>
        {experiment.linkedDemo && (
          <Link
            to={`/demos?demo=${experiment.linkedDemo}`}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              theme === 'dark' ? 'text-gray-400 hover:bg-slate-700' : 'text-gray-500 hover:bg-gray-100'
            )}
            title={isZh ? '查看演示' : 'View Demo'}
          >
            <Eye className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  )
}

// UC2 Panel
function UC2Panel({
  components,
  onClose,
}: {
  components: BenchComponent[]
  onClose: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  const componentCounts = components.reduce((acc, comp) => {
    acc[comp.type] = (acc[comp.type] || 0) + 1
    return acc
  }, {} as Record<BenchComponentType, number>)

  return (
    <div className={cn(
      'absolute right-4 top-16 w-72 rounded-xl border shadow-xl z-20',
      theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
    )}>
      <div className={cn(
        'flex items-center justify-between p-3 border-b',
        theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
      )}>
        <div className="flex items-center gap-2">
          <Box className={cn('w-4 h-4', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')} />
          <h3 className={cn('font-semibold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
            {isZh ? 'UC2 零件清单' : 'UC2 Parts List'}
          </h3>
        </div>
        <button onClick={onClose} className={cn('p-1 rounded', theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
        {Object.entries(componentCounts).map(([type, count]) => {
          const uc2Info = UC2_COMPONENT_MAP[type as BenchComponentType]
          const palComp = PALETTE_COMPONENTS.find(p => p.type === type)
          return (
            <div key={type} className={cn(
              'flex items-center justify-between p-2 rounded-lg',
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
            )}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{palComp?.icon}</span>
                <span className={cn('text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                  {isZh ? uc2Info.nameZh : uc2Info.nameEn}
                </span>
              </div>
              <Badge color="green">×{count}</Badge>
            </div>
          )
        })}
      </div>
      <div className={cn('p-3 border-t', theme === 'dark' ? 'border-slate-700' : 'border-gray-200')}>
        <a
          href="https://github.com/openUC2/UC2-GIT"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
        >
          <ExternalLink className="w-4 h-4" />
          {isZh ? '获取 UC2 模块' : 'Get UC2 Modules'}
        </a>
      </div>
    </div>
  )
}

// ============================================
// Main Page Component
// ============================================

export function OpticalDesignStudioPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  // State
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('devices')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  const [components, setComponents] = useState<BenchComponent[]>([])
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showPolarization, setShowPolarization] = useState(true)
  const [showUC2Panel, setShowUC2Panel] = useState(false)
  const [currentExperiment, setCurrentExperiment] = useState<ClassicExperiment | null>(null)

  // Filtered devices
  const filteredDevices = useMemo(() => {
    return DEVICES.filter(device => {
      const matchesCategory = selectedCategory === 'all' || device.category === selectedCategory
      const matchesSearch = searchQuery === '' ||
        device.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.nameZh.includes(searchQuery)
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  // Handlers
  const loadExperiment = useCallback((experiment: ClassicExperiment) => {
    setComponents([...experiment.components])
    setSelectedComponentId(null)
    setIsSimulating(false)
    setCurrentExperiment(experiment)
    setSelectedDevice(null)
  }, [])

  const addComponent = useCallback((type: BenchComponentType) => {
    const newComponent: BenchComponent = {
      id: `${type}-${Date.now()}`,
      type,
      x: 300 + Math.random() * 100,
      y: 180 + Math.random() * 40,
      rotation: 0,
      properties: {},
    }
    setComponents(prev => [...prev, newComponent])
    setSelectedComponentId(newComponent.id)
  }, [])

  const addDeviceToBench = useCallback((device: Device) => {
    if (device.benchComponentType) {
      addComponent(device.benchComponentType)
    }
  }, [addComponent])

  const deleteSelectedComponent = useCallback(() => {
    if (selectedComponentId) {
      setComponents(prev => prev.filter(c => c.id !== selectedComponentId))
      setSelectedComponentId(null)
    }
  }, [selectedComponentId])

  const rotateSelectedComponent = useCallback((delta: number) => {
    if (selectedComponentId) {
      setComponents(prev => prev.map(c =>
        c.id === selectedComponentId ? { ...c, rotation: (c.rotation + delta) % 360 } : c
      ))
    }
  }, [selectedComponentId])

  const clearBench = useCallback(() => {
    setComponents([])
    setSelectedComponentId(null)
    setIsSimulating(false)
    setCurrentExperiment(null)
  }, [])

  const selectedComponent = components.find(c => c.id === selectedComponentId)

  // Sidebar tabs configuration
  const sidebarTabs = [
    { id: 'devices' as const, icon: Book, labelEn: 'Devices', labelZh: '器件库' },
    { id: 'experiments' as const, icon: FlaskConical, labelEn: 'Experiments', labelZh: '实验库' },
    { id: 'design' as const, icon: Wrench, labelEn: 'Design', labelZh: '自由设计' },
  ]

  return (
    <div className={cn(
      'min-h-screen flex flex-col',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'
      )}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                )}
              >
                <Home className="w-5 h-5" />
              </Link>
              <div>
                <h1 className={cn(
                  'text-lg font-bold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '光学设计室' : 'Optical Design Studio'}
                </h1>
                <p className={cn(
                  'text-xs',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {isZh ? '器件图鉴 × 光路设计' : 'Device Library × Path Design'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUC2Panel(!showUC2Panel)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  showUC2Panel
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-gray-300 hover:text-white'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
                disabled={components.length === 0}
              >
                <Box className="w-4 h-4" />
                <span className="hidden sm:inline">UC2</span>
              </button>
              <LanguageThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <aside className={cn(
          'flex flex-col flex-shrink-0 border-r transition-all duration-300',
          sidebarCollapsed ? 'w-12' : 'w-72',
          theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-gray-200'
        )}>
          {/* Sidebar Tabs */}
          <div className={cn(
            'flex items-center gap-1 p-2 border-b',
            theme === 'dark' ? 'border-slate-800' : 'border-gray-200'
          )}>
            {!sidebarCollapsed && sidebarTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSidebarTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  sidebarTab === tab.id
                    ? theme === 'dark'
                      ? 'bg-violet-500/20 text-violet-400'
                      : 'bg-violet-100 text-violet-700'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-slate-800'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isZh ? tab.labelZh : tab.labelEn}</span>
              </button>
            ))}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Sidebar Content */}
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto p-3">
              {sidebarTab === 'devices' && (
                <div className="space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className={cn(
                      'absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )} />
                    <input
                      type="text"
                      placeholder={isZh ? '搜索器件...' : 'Search...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        'w-full pl-8 pr-3 py-2 rounded-lg border text-sm',
                        theme === 'dark'
                          ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                      )}
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-1">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          'px-2 py-1 rounded text-xs font-medium transition-colors',
                          selectedCategory === cat.id
                            ? theme === 'dark'
                              ? 'bg-indigo-500/20 text-indigo-400'
                              : 'bg-indigo-100 text-indigo-700'
                            : theme === 'dark'
                              ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                              : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                        )}
                      >
                        {isZh ? cat.labelZh : cat.labelEn}
                      </button>
                    ))}
                  </div>

                  {/* Device List */}
                  <div className="space-y-2">
                    {filteredDevices.map(device => (
                      <DeviceCard
                        key={device.id}
                        device={device}
                        isSelected={selectedDevice?.id === device.id}
                        onClick={() => setSelectedDevice(device)}
                        onAddToBench={() => addDeviceToBench(device)}
                      />
                    ))}
                    {filteredDevices.length === 0 && (
                      <p className={cn('text-sm text-center py-4', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                        {isZh ? '未找到器件' : 'No devices found'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {sidebarTab === 'experiments' && (
                <div className="space-y-2">
                  <p className={cn('text-xs mb-2', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                    {isZh ? '选择经典实验加载到光路' : 'Select an experiment to load'}
                  </p>
                  {CLASSIC_EXPERIMENTS.map(exp => (
                    <ExperimentCard
                      key={exp.id}
                      experiment={exp}
                      onLoad={() => loadExperiment(exp)}
                    />
                  ))}
                </div>
              )}

              {sidebarTab === 'design' && (
                <div className="space-y-3">
                  <p className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                    {isZh ? '点击器件添加到光路' : 'Click to add components'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {PALETTE_COMPONENTS.map(item => (
                      <button
                        key={item.type}
                        onClick={() => addComponent(item.type)}
                        className={cn(
                          'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all hover:scale-105',
                          theme === 'dark'
                            ? 'bg-slate-800 border-slate-700 hover:border-violet-500/50'
                            : 'bg-white border-gray-200 hover:border-violet-400'
                        )}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className={cn('text-xs font-medium', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                          {isZh ? item.nameZh : item.nameEn}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative">
          {/* Toolbar */}
          <div className={cn(
            'absolute top-4 left-4 flex items-center gap-1.5 p-2 rounded-xl border z-10',
            theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
          )}>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isSimulating
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isSimulating ? (isZh ? '暂停' : 'Pause') : (isZh ? '模拟' : 'Simulate')}
            >
              {isSimulating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <div className={cn('w-px h-6', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')} />
            <button
              onClick={() => setShowPolarization(!showPolarization)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                showPolarization
                  ? 'bg-violet-500/20 text-violet-400'
                  : theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '偏振显示' : 'Polarization'}
            >
              {showPolarization ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={() => rotateSelectedComponent(-15)}
              disabled={!selectedComponentId}
              className={cn(
                'p-2 rounded-lg transition-colors',
                selectedComponentId
                  ? theme === 'dark' ? 'hover:bg-slate-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                  : 'opacity-40 cursor-not-allowed text-gray-500'
              )}
              title={isZh ? '旋转' : 'Rotate'}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={deleteSelectedComponent}
              disabled={!selectedComponentId}
              className={cn(
                'p-2 rounded-lg transition-colors',
                selectedComponentId
                  ? 'text-red-400 hover:bg-red-500/20'
                  : 'opacity-40 cursor-not-allowed text-gray-500'
              )}
              title={isZh ? '删除' : 'Delete'}
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className={cn('w-px h-6', theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200')} />
            <button
              onClick={clearBench}
              className={cn(
                'p-2 rounded-lg transition-colors',
                theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              )}
              title={isZh ? '清空' : 'Clear'}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* UC2 Panel */}
          {showUC2Panel && components.length > 0 && (
            <UC2Panel components={components} onClose={() => setShowUC2Panel(false)} />
          )}

          {/* Experiment Info */}
          {currentExperiment && (
            <div className={cn(
              'absolute top-4 right-4 w-72 rounded-xl border shadow-xl z-10',
              theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'
            )}>
              <div className={cn(
                'flex items-center justify-between p-3 border-b',
                theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
              )}>
                <div className="flex items-center gap-2">
                  <Lightbulb className={cn('w-4 h-4', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                  <span className={cn('font-semibold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                    {isZh ? currentExperiment.nameZh : currentExperiment.nameEn}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentExperiment(null)}
                  className={cn('p-1 rounded', theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="p-3">
                <p className={cn('text-xs mb-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  {isZh ? currentExperiment.descriptionZh : currentExperiment.descriptionEn}
                </p>
                <div className={cn('p-2 rounded-lg', theme === 'dark' ? 'bg-slate-800' : 'bg-cyan-50')}>
                  <h5 className={cn('text-xs font-medium mb-1', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')}>
                    {isZh ? '知识要点' : 'Key Points'}
                  </h5>
                  <ul className="space-y-0.5">
                    {(isZh ? currentExperiment.learningPoints.zh : currentExperiment.learningPoints.en).map((point, idx) => (
                      <li key={idx} className={cn('text-xs font-mono', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                        • {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div
            className={cn('absolute inset-0 overflow-hidden', theme === 'dark' ? 'bg-slate-950/50' : 'bg-gray-50/50')}
            onClick={() => setSelectedComponentId(null)}
          >
            <svg className="absolute inset-0 w-full h-full">
              {/* Background */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={theme === 'dark' ? '#334155' : '#94a3b8'} strokeWidth="1" opacity="0.3" />
                </pattern>
                <linearGradient id="table-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={theme === 'dark' ? '#0f172a' : '#f8fafc'} />
                  <stop offset="100%" stopColor={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#table-grad)" />
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Optical rail */}
              <rect x="60" y="196" width="680" height="8" rx="2" fill={theme === 'dark' ? '#334155' : '#94a3b8'} opacity="0.5" />

              {/* Light beams */}
              {isSimulating && components.length > 0 && (
                <g className="light-beams">
                  {components.filter(c => c.type === 'emitter').map(emitter => {
                    const beamEndX = Math.min(emitter.x + 500, 750)
                    const polarAngle = (emitter.properties.polarization as number) || 0
                    const componentsInPath = components
                      .filter(c => c.type !== 'emitter' && c.x > emitter.x && Math.abs(c.y - emitter.y) < 40)
                      .sort((a, b) => a.x - b.x)

                    const segments: { x1: number; y1: number; x2: number; y2: number; polarAngle: number; intensity: number }[] = []
                    let currentX = emitter.x
                    let currentPolarAngle = polarAngle
                    let currentIntensity = 100

                    componentsInPath.forEach((comp) => {
                      segments.push({
                        x1: currentX + 30,
                        y1: emitter.y,
                        x2: comp.x - 30,
                        y2: comp.y,
                        polarAngle: currentPolarAngle,
                        intensity: currentIntensity
                      })

                      if (comp.type === 'polarizer') {
                        const polarizerAngle = (comp.properties.angle as number) || 0
                        const angleDiff = Math.abs(currentPolarAngle - polarizerAngle)
                        currentIntensity *= Math.pow(Math.cos(angleDiff * Math.PI / 180), 2)
                        currentPolarAngle = polarizerAngle
                      } else if (comp.type === 'waveplate') {
                        currentPolarAngle = (currentPolarAngle + 45) % 180
                      }
                      currentX = comp.x
                    })

                    if (currentIntensity > 5) {
                      segments.push({
                        x1: currentX + 30,
                        y1: emitter.y,
                        x2: beamEndX,
                        y2: emitter.y,
                        polarAngle: currentPolarAngle,
                        intensity: currentIntensity
                      })
                    }

                    return segments.map((seg, idx) => (
                      <LightBeam
                        key={`${emitter.id}-beam-${idx}`}
                        x1={seg.x1}
                        y1={seg.y1}
                        x2={seg.x2}
                        y2={seg.y2}
                        polarizationAngle={seg.polarAngle}
                        intensity={seg.intensity}
                        showPolarization={showPolarization}
                        animated={true}
                      />
                    ))
                  })}
                </g>
              )}

              {/* Components */}
              <g className="optical-components">
                {components.map(component => {
                  const ComponentViz = OpticalComponentMap[component.type as OpticalComponentType]
                  if (ComponentViz) {
                    return (
                      <ComponentViz
                        key={component.id}
                        x={component.x}
                        y={component.y}
                        rotation={component.rotation}
                        selected={component.id === selectedComponentId}
                        polarizationAngle={(component.properties.angle as number) || (component.properties.polarization as number) || 0}
                        onClick={(e) => {
                          e?.stopPropagation()
                          setSelectedComponentId(component.id)
                        }}
                      />
                    )
                  }
                  return null
                })}
              </g>
            </svg>

            {/* Empty state */}
            {components.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                    theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                  )}>
                    <Layers className={cn('w-8 h-8', theme === 'dark' ? 'text-gray-600' : 'text-gray-400')} />
                  </div>
                  <h3 className={cn('text-lg font-semibold mb-2', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                    {isZh ? '开始设计光路' : 'Start Designing'}
                  </h3>
                  <p className={cn('text-sm max-w-sm mx-auto', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                    {isZh
                      ? '从左侧浏览器件、选择实验，或自由添加组件'
                      : 'Browse devices, select experiments, or freely add components'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Selected component info */}
          {selectedComponent && (
            <div className={cn(
              'absolute bottom-4 left-4 right-80 rounded-xl border p-3 z-10',
              theme === 'dark' ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'
            )}>
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {PALETTE_COMPONENTS.find(p => p.type === selectedComponent.type)?.icon}
                </span>
                <div>
                  <h4 className={cn('font-semibold text-sm', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                    {isZh
                      ? PALETTE_COMPONENTS.find(p => p.type === selectedComponent.type)?.nameZh
                      : PALETTE_COMPONENTS.find(p => p.type === selectedComponent.type)?.nameEn}
                  </h4>
                  <p className={cn('text-xs', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                    {isZh ? `角度: ${selectedComponent.rotation}°` : `Angle: ${selectedComponent.rotation}°`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - Device Details */}
        {selectedDevice && (
          <DeviceDetailPanel
            device={selectedDevice}
            onClose={() => setSelectedDevice(null)}
            onAddToBench={() => addDeviceToBench(selectedDevice)}
          />
        )}
      </div>
    </div>
  )
}
