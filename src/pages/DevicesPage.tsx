/**
 * Devices Page - Polarization Device Library
 * 偏振器件库 - 器件原理 × 分类图鉴
 *
 * Comprehensive catalog of polarization optical devices:
 * - Polarizers (linear, circular)
 * - Wave plates (quarter, half, full)
 * - Beam splitters (PBS, NPBS)
 * - Retarders and compensators
 * - UC2 modular components
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Tabs, Badge } from '@/components/shared'
import {
  Home, Search, Filter, ChevronRight, ExternalLink,
  Layers, Circle, Square, Triangle, Hexagon,
  Zap, Eye, Settings, BookOpen, ShoppingCart,
  Info, X, ArrowRight
} from 'lucide-react'

// Device category types
type DeviceCategory = 'polarizers' | 'waveplates' | 'splitters' | 'retarders' | 'uc2' | 'other'

// Device data interface
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
  specifications?: {
    key: string
    valueEn: string
    valueZh: string
  }[]
  applications?: {
    en: string[]
    zh: string[]
  }
  mathFormula?: string
  relatedDevices?: string[]
  purchaseLinks?: {
    name: string
    url: string
  }[]
  difficulty: 'basic' | 'intermediate' | 'advanced'
}

// Device catalog data
const DEVICES: Device[] = [
  // === Polarizers ===
  {
    id: 'linear-polarizer',
    nameEn: 'Linear Polarizer',
    nameZh: '线偏振片',
    category: 'polarizers',
    descriptionEn: 'Transmits light polarized along a single axis while absorbing orthogonal polarization.',
    descriptionZh: '透过沿单一轴偏振的光，同时吸收正交偏振方向的光。',
    principleEn: 'Uses dichroic materials (like stretched PVA with iodine) that selectively absorb light polarized perpendicular to the transmission axis. Based on selective absorption of aligned molecular chains.',
    principleZh: '使用二向色性材料（如碘染色的拉伸PVA），选择性吸收与透光轴垂直的偏振光。基于分子链排列的选择性吸收原理。',
    icon: '◐',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 10,000:1', valueZh: '> 10,000:1' },
      { key: 'Transmission', valueEn: '38-42% (unpolarized)', valueZh: '38-42%（自然光）' },
      { key: 'Wavelength Range', valueEn: '400-700 nm', valueZh: '400-700 nm' },
      { key: 'Acceptance Angle', valueEn: '±20°', valueZh: '±20°' },
    ],
    applications: {
      en: ['LCD displays', 'Photography filters', 'Glare reduction sunglasses', 'Optical instruments'],
      zh: ['LCD显示器', '摄影滤镜', '防眩光太阳镜', '光学仪器'],
    },
    mathFormula: 'I = I₀ cos²θ (Malus\'s Law)',
    relatedDevices: ['circular-polarizer', 'wire-grid-polarizer'],
    difficulty: 'basic',
  },
  {
    id: 'circular-polarizer',
    nameEn: 'Circular Polarizer',
    nameZh: '圆偏振片',
    category: 'polarizers',
    descriptionEn: 'Converts unpolarized light to circularly polarized light using a linear polarizer and quarter-wave plate.',
    descriptionZh: '使用线偏振片和四分之一波片将自然光转换为圆偏振光。',
    principleEn: 'Combines a linear polarizer with a quarter-wave plate oriented at 45°. The linear component creates linear polarization, then the waveplate introduces a 90° phase shift between orthogonal components.',
    principleZh: '将线偏振片与45°取向的四分之一波片结合。线偏振片产生线偏振光，然后波片在正交分量之间引入90°相位差。',
    icon: '◉',
    specifications: [
      { key: 'Circularity', valueEn: '> 95%', valueZh: '> 95%' },
      { key: 'Transmission', valueEn: '35-40%', valueZh: '35-40%' },
      { key: 'Design Wavelength', valueEn: '550 nm (typical)', valueZh: '550 nm（典型）' },
    ],
    applications: {
      en: ['3D cinema glasses', 'Camera autofocus compatibility', 'Reflection elimination'],
      zh: ['3D电影眼镜', '相机自动对焦兼容', '消除反光'],
    },
    mathFormula: 'E = E₀(x̂ ± iŷ)/√2',
    relatedDevices: ['linear-polarizer', 'quarter-wave-plate'],
    difficulty: 'intermediate',
  },
  {
    id: 'wire-grid-polarizer',
    nameEn: 'Wire Grid Polarizer',
    nameZh: '金属线栅偏振器',
    category: 'polarizers',
    descriptionEn: 'Metallic wire array that reflects one polarization and transmits the orthogonal polarization.',
    descriptionZh: '金属线阵列，反射一种偏振方向的光，透射正交偏振方向的光。',
    principleEn: 'Sub-wavelength parallel metal wires act as a polarization-selective structure. Electric field parallel to wires induces currents causing reflection; perpendicular field passes through.',
    principleZh: '亚波长平行金属线作为偏振选择性结构。平行于线栅的电场分量感应电流导致反射；垂直分量透过。',
    icon: '≡',
    specifications: [
      { key: 'Wire Pitch', valueEn: '< λ/2', valueZh: '< λ/2' },
      { key: 'Extinction Ratio', valueEn: '> 1000:1 (IR)', valueZh: '> 1000:1（红外）' },
      { key: 'Damage Threshold', valueEn: 'High (all-metal)', valueZh: '高（全金属）' },
    ],
    applications: {
      en: ['Infrared polarimetry', 'High-power lasers', 'Projection displays'],
      zh: ['红外偏振测量', '高功率激光器', '投影显示'],
    },
    relatedDevices: ['linear-polarizer', 'pbs'],
    difficulty: 'advanced',
  },
  // === Wave Plates ===
  {
    id: 'quarter-wave-plate',
    nameEn: 'Quarter-Wave Plate (λ/4)',
    nameZh: '四分之一波片（λ/4）',
    category: 'waveplates',
    descriptionEn: 'Introduces a 90° (λ/4) phase retardation between fast and slow axes, converting linear to circular polarization.',
    descriptionZh: '在快轴和慢轴之间引入90°（λ/4）相位延迟，将线偏振光转换为圆偏振光。',
    principleEn: 'Made from birefringent crystal (quartz) or polymer film with different refractive indices along crystal axes. Thickness chosen so path difference equals λ/4.',
    principleZh: '由双折射晶体（石英）或聚合物薄膜制成，沿晶轴具有不同折射率。厚度选择使光程差等于λ/4。',
    icon: '¼',
    specifications: [
      { key: 'Retardation', valueEn: 'λ/4 ± λ/300', valueZh: 'λ/4 ± λ/300' },
      { key: 'Design Wavelength', valueEn: '532/633/1064 nm', valueZh: '532/633/1064 nm' },
      { key: 'Material', valueEn: 'Quartz / Polymer', valueZh: '石英/聚合物' },
    ],
    applications: {
      en: ['Circular polarization generation', 'Optical isolators', 'Ellipsometry', 'CD/DVD readers'],
      zh: ['圆偏振光产生', '光隔离器', '椭偏仪', 'CD/DVD读取器'],
    },
    mathFormula: 'Δφ = 2π(nₑ-nₒ)d/λ = π/2',
    relatedDevices: ['half-wave-plate', 'circular-polarizer'],
    difficulty: 'intermediate',
  },
  {
    id: 'half-wave-plate',
    nameEn: 'Half-Wave Plate (λ/2)',
    nameZh: '二分之一波片（λ/2）',
    category: 'waveplates',
    descriptionEn: 'Introduces 180° (λ/2) phase retardation, rotating linear polarization direction by twice the angle to fast axis.',
    descriptionZh: '引入180°（λ/2）相位延迟，使线偏振方向旋转快轴夹角的两倍。',
    principleEn: 'Birefringent plate with thickness for half-wave retardation. Rotates polarization plane: output angle = 2×(fast axis angle) - input angle.',
    principleZh: '具有半波延迟厚度的双折射板。旋转偏振平面：输出角度 = 2×（快轴角度）- 输入角度。',
    icon: '½',
    specifications: [
      { key: 'Retardation', valueEn: 'λ/2 ± λ/300', valueZh: 'λ/2 ± λ/300' },
      { key: 'Rotation Range', valueEn: '0-90° (continuous)', valueZh: '0-90°（连续）' },
      { key: 'Surface Quality', valueEn: '20-10 scratch-dig', valueZh: '20-10划痕-麻点' },
    ],
    applications: {
      en: ['Polarization rotation', 'Laser power control', 'Polarization switching'],
      zh: ['偏振旋转', '激光功率控制', '偏振切换'],
    },
    mathFormula: 'θ_out = 2θ_axis - θ_in',
    relatedDevices: ['quarter-wave-plate', 'faraday-rotator'],
    difficulty: 'intermediate',
  },
  // === Beam Splitters ===
  {
    id: 'pbs',
    nameEn: 'Polarizing Beam Splitter (PBS)',
    nameZh: '偏振分束器（PBS）',
    category: 'splitters',
    descriptionEn: 'Separates incident light into two orthogonally polarized beams: p-polarization transmitted, s-polarization reflected.',
    descriptionZh: '将入射光分离为两束正交偏振光：p偏振透射，s偏振反射。',
    principleEn: 'Uses multilayer dielectric coating at 45°. Coating designed for high transmission of p-polarization and high reflection of s-polarization at Brewster-like angle.',
    principleZh: '使用45°多层介质膜。镀膜设计使p偏振高透射、s偏振在类布儒斯特角高反射。',
    icon: '⊠',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 1000:1', valueZh: '> 1000:1' },
      { key: 'Transmission (p)', valueEn: '> 95%', valueZh: '> 95%' },
      { key: 'Reflection (s)', valueEn: '> 99%', valueZh: '> 99%' },
      { key: 'Angle of Incidence', valueEn: '45°', valueZh: '45°' },
    ],
    applications: {
      en: ['Laser beam combining', 'Interferometry', 'Polarization analysis', 'Quantum optics'],
      zh: ['激光合束', '干涉测量', '偏振分析', '量子光学'],
    },
    relatedDevices: ['npbs', 'glan-thompson'],
    difficulty: 'intermediate',
  },
  {
    id: 'npbs',
    nameEn: 'Non-Polarizing Beam Splitter',
    nameZh: '非偏振分束器（NPBS）',
    category: 'splitters',
    descriptionEn: 'Splits light 50/50 regardless of polarization state, preserving input polarization in both outputs.',
    descriptionZh: '无论偏振态如何，以50/50比例分光，在两路输出中保持输入偏振态。',
    principleEn: 'Metal or dielectric coating optimized for equal reflection and transmission of both s and p polarizations. Often uses partial metal films.',
    principleZh: '金属或介质膜优化为s和p偏振的反射透射相等。通常使用部分金属膜。',
    icon: '◫',
    specifications: [
      { key: 'Split Ratio', valueEn: '50:50 ± 5%', valueZh: '50:50 ± 5%' },
      { key: 'Polarization Deviation', valueEn: '< 5%', valueZh: '< 5%' },
      { key: 'Wavelength Range', valueEn: '400-700 nm', valueZh: '400-700 nm' },
    ],
    applications: {
      en: ['Interferometers', 'Imaging systems', 'Beam sampling'],
      zh: ['干涉仪', '成像系统', '光束采样'],
    },
    relatedDevices: ['pbs', 'dichroic-mirror'],
    difficulty: 'basic',
  },
  {
    id: 'calcite-splitter',
    nameEn: 'Calcite Beam Displacer',
    nameZh: '方解石分束位移器',
    category: 'splitters',
    descriptionEn: 'Natural birefringent crystal that spatially separates o-ray and e-ray by walk-off.',
    descriptionZh: '天然双折射晶体，通过走离效应在空间上分离寻常光（o光）和非常光（e光）。',
    principleEn: 'Calcite has large birefringence (Δn ≈ 0.17). O-ray follows Snell\'s law; e-ray experiences extraordinary index and walks off at angle dependent on crystal cut.',
    principleZh: '方解石具有大双折射率（Δn ≈ 0.17）。o光遵循斯涅尔定律；e光经历非常折射率，以与晶体切割相关的角度走离。',
    icon: '◇',
    specifications: [
      { key: 'Birefringence', valueEn: 'Δn = 0.172 @ 590nm', valueZh: 'Δn = 0.172 @ 590nm' },
      { key: 'Separation', valueEn: '~1mm per 10mm length', valueZh: '每10mm长度约1mm分离' },
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
    ],
    applications: {
      en: ['High-precision polarimetry', 'Quantum optics', 'Astronomy'],
      zh: ['高精度偏振测量', '量子光学', '天文学'],
    },
    relatedDevices: ['wollaston-prism', 'glan-thompson'],
    difficulty: 'advanced',
  },
  // === Polarizing Prisms ===
  {
    id: 'nicol-prism',
    nameEn: 'Nicol Prism',
    nameZh: '尼科尔棱镜',
    category: 'polarizers',
    descriptionEn: 'Historic polarizing prism made from calcite, cemented with Canada balsam to separate o-ray and e-ray.',
    descriptionZh: '历史性偏振棱镜，由方解石制成，用加拿大树胶粘合以分离o光和e光。',
    principleEn: 'Calcite crystal cut diagonally and cemented with Canada balsam (n≈1.55). O-ray undergoes total internal reflection at balsam interface; e-ray transmits as polarized light.',
    principleZh: '方解石晶体斜切并用加拿大树胶（n≈1.55）粘合。o光在树胶界面全内反射；e光作为偏振光透射。',
    icon: '◆',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Acceptance Angle', valueEn: '~14°', valueZh: '~14°' },
      { key: 'Length/Aperture', valueEn: '~3:1', valueZh: '~3:1' },
      { key: 'Cement', valueEn: 'Canada balsam', valueZh: '加拿大树胶' },
    ],
    applications: {
      en: ['Historical instruments', 'Polarizing microscopes', 'Teaching demonstrations'],
      zh: ['历史仪器', '偏光显微镜', '教学演示'],
    },
    relatedDevices: ['glan-thompson', 'glan-taylor'],
    difficulty: 'advanced',
  },
  {
    id: 'glan-thompson',
    nameEn: 'Glan-Thompson Prism',
    nameZh: '格兰-汤姆逊棱镜',
    category: 'polarizers',
    descriptionEn: 'High-performance polarizing prism with wide acceptance angle. Two calcite prisms cemented with optical cement.',
    descriptionZh: '高性能偏振棱镜，具有宽接收角。两个方解石棱镜用光学胶粘合。',
    principleEn: 'Similar to Nicol but with optimized geometry for larger field of view. O-ray totally reflected at cement interface; e-ray transmitted with high polarization purity.',
    principleZh: '类似尼科尔但几何优化以获得更大视场。o光在胶合面全反射；e光高偏振纯度透射。',
    icon: '◇',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Acceptance Angle', valueEn: '15-20°', valueZh: '15-20°' },
      { key: 'Transmission', valueEn: '> 90%', valueZh: '> 90%' },
      { key: 'Damage Threshold', valueEn: 'Limited by cement', valueZh: '受胶合材料限制' },
    ],
    applications: {
      en: ['Precision polarimetry', 'Spectroscopy', 'Imaging systems'],
      zh: ['精密偏振测量', '光谱学', '成像系统'],
    },
    relatedDevices: ['glan-taylor', 'glan-laser', 'nicol-prism'],
    difficulty: 'advanced',
  },
  {
    id: 'glan-foucault',
    nameEn: 'Glan-Foucault Prism',
    nameZh: '格兰-傅科棱镜',
    category: 'polarizers',
    descriptionEn: 'Air-spaced Glan prism with high damage threshold, suitable for high-power laser applications.',
    descriptionZh: '空气间隙格兰棱镜，高损伤阈值，适用于高功率激光应用。',
    principleEn: 'Two calcite prisms separated by air gap instead of cement. O-ray escapes through side face; e-ray transmits. No cement limits damage threshold.',
    principleZh: '两个方解石棱镜由空气间隙而非胶合分隔。o光从侧面逸出；e光透射。无胶合材料提高损伤阈值。',
    icon: '⬖',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Acceptance Angle', valueEn: '~8°', valueZh: '~8°' },
      { key: 'Damage Threshold', valueEn: '> 1 J/cm²', valueZh: '> 1 J/cm²' },
      { key: 'Gap', valueEn: 'Air-spaced', valueZh: '空气间隙' },
    ],
    applications: {
      en: ['High-power lasers', 'UV applications', 'Pulsed laser systems'],
      zh: ['高功率激光器', '紫外应用', '脉冲激光系统'],
    },
    relatedDevices: ['glan-taylor', 'glan-laser'],
    difficulty: 'advanced',
  },
  {
    id: 'glan-taylor',
    nameEn: 'Glan-Taylor Prism',
    nameZh: '格兰-泰勒棱镜',
    category: 'polarizers',
    descriptionEn: 'Air-spaced polarizer with o-ray totally internally reflected. Similar to Glan-Foucault with different geometry.',
    descriptionZh: '空气间隙偏振器，o光全内反射。与格兰-傅科类似但几何结构不同。',
    principleEn: 'Optimized cut angle for o-ray total internal reflection at air interface. E-ray exits parallel to input. Compact design with high damage threshold.',
    principleZh: '优化切割角使o光在空气界面全内反射。e光平行于输入光出射。紧凑设计，高损伤阈值。',
    icon: '⬗',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Acceptance Angle', valueEn: '~8°', valueZh: '~8°' },
      { key: 'Surface Quality', valueEn: '10-5 scratch-dig', valueZh: '10-5划痕-麻点' },
      { key: 'AR Coating', valueEn: 'Optional', valueZh: '可选' },
    ],
    applications: {
      en: ['Laser resonators', 'Q-switches', 'High-power polarization control'],
      zh: ['激光谐振腔', 'Q开关', '高功率偏振控制'],
    },
    relatedDevices: ['glan-laser', 'glan-foucault'],
    difficulty: 'advanced',
  },
  {
    id: 'glan-laser',
    nameEn: 'Glan-Laser Prism',
    nameZh: '格兰-激光棱镜',
    category: 'polarizers',
    descriptionEn: 'Specialized Glan prism optimized for laser applications with escape window for rejected beam.',
    descriptionZh: '专为激光应用优化的格兰棱镜，带有排出被拒绝光束的逃逸窗口。',
    principleEn: 'Glan-Taylor type with polished side face allowing rejected o-ray to exit cleanly. Prevents back-reflection and thermal damage from rejected beam.',
    principleZh: '格兰-泰勒型，侧面抛光使被拒绝的o光干净逸出。防止被拒绝光束的背反射和热损伤。',
    icon: '⬙',
    specifications: [
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Escape Window', valueEn: 'Polished side exit', valueZh: '抛光侧面出口' },
      { key: 'Damage Threshold', valueEn: '> 2 J/cm² (10ns)', valueZh: '> 2 J/cm²（10ns）' },
      { key: 'Wavelength', valueEn: '350-2300 nm', valueZh: '350-2300 nm' },
    ],
    applications: {
      en: ['Pulsed lasers', 'Intracavity polarization', 'Laser amplifiers'],
      zh: ['脉冲激光器', '腔内偏振', '激光放大器'],
    },
    relatedDevices: ['glan-taylor', 'glan-foucault'],
    difficulty: 'advanced',
  },
  {
    id: 'wollaston-prism',
    nameEn: 'Wollaston Prism',
    nameZh: '沃拉斯顿棱镜',
    category: 'splitters',
    descriptionEn: 'Birefringent prism that separates input beam into two orthogonally polarized beams diverging at equal angles.',
    descriptionZh: '双折射棱镜，将输入光束分成两束以相等角度发散的正交偏振光束。',
    principleEn: 'Two calcite wedges with perpendicular optic axes cemented together. Both o and e rays are deflected, creating symmetric divergence around optical axis.',
    principleZh: '两个光轴垂直的方解石楔形棱镜粘合在一起。o光和e光都被偏折，围绕光轴产生对称发散。',
    icon: '⋈',
    specifications: [
      { key: 'Separation Angle', valueEn: '1° - 20° (configurable)', valueZh: '1° - 20°（可配置）' },
      { key: 'Symmetry', valueEn: 'Symmetric about axis', valueZh: '关于轴对称' },
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Material', valueEn: 'Calcite or Quartz', valueZh: '方解石或石英' },
    ],
    applications: {
      en: ['Differential interference contrast', 'Polarization interferometry', 'Beam separation'],
      zh: ['微分干涉对比', '偏振干涉测量', '光束分离'],
    },
    relatedDevices: ['rochon-prism', 'senarmont-prism'],
    difficulty: 'advanced',
  },
  {
    id: 'rochon-prism',
    nameEn: 'Rochon Prism',
    nameZh: '洛匈棱镜',
    category: 'splitters',
    descriptionEn: 'Birefringent prism where o-ray passes straight through while e-ray is deflected.',
    descriptionZh: '双折射棱镜，o光直线通过而e光被偏折。',
    principleEn: 'Two birefringent wedges with first optic axis along beam direction. O-ray undeviated; e-ray refracted at interface. Useful when one beam must maintain original direction.',
    principleZh: '两个双折射楔形棱镜，第一个光轴沿光束方向。o光不偏折；e光在界面折射。适用于需要一束光保持原方向的场合。',
    icon: '⋉',
    specifications: [
      { key: 'O-ray', valueEn: 'Straight through', valueZh: '直线通过' },
      { key: 'E-ray', valueEn: 'Deflected 1-15°', valueZh: '偏折1-15°' },
      { key: 'Extinction Ratio', valueEn: '> 100,000:1', valueZh: '> 100,000:1' },
      { key: 'Material', valueEn: 'Calcite or MgF₂', valueZh: '方解石或MgF₂' },
    ],
    applications: {
      en: ['Polarimetry', 'Reference beam systems', 'Interferometers'],
      zh: ['偏振测量', '参考光束系统', '干涉仪'],
    },
    relatedDevices: ['wollaston-prism', 'senarmont-prism'],
    difficulty: 'advanced',
  },
  {
    id: 'senarmont-prism',
    nameEn: 'Sénarmont Prism',
    nameZh: 'Sénarmont棱镜',
    category: 'splitters',
    descriptionEn: 'Modified Rochon prism with reversed optic axis orientation, deflecting o-ray instead of e-ray.',
    descriptionZh: '改进型洛匈棱镜，光轴方向相反，偏折o光而非e光。',
    principleEn: 'Similar to Rochon but with swapped geometry. E-ray travels straight; o-ray deflected. Provides different dispersion characteristics.',
    principleZh: '类似洛匈但几何结构互换。e光直行；o光偏折。提供不同的色散特性。',
    icon: '⋊',
    specifications: [
      { key: 'E-ray', valueEn: 'Straight through', valueZh: '直线通过' },
      { key: 'O-ray', valueEn: 'Deflected', valueZh: '偏折' },
      { key: 'Dispersion', valueEn: 'Lower than Rochon', valueZh: '低于洛匈' },
      { key: 'Wavelength Range', valueEn: '200-2000 nm', valueZh: '200-2000 nm' },
    ],
    applications: {
      en: ['UV polarimetry', 'Spectrometers', 'Low-dispersion applications'],
      zh: ['紫外偏振测量', '光谱仪', '低色散应用'],
    },
    relatedDevices: ['rochon-prism', 'wollaston-prism'],
    difficulty: 'advanced',
  },
  // === UC2 Modules ===
  {
    id: 'uc2-polarizer-cube',
    nameEn: 'UC2 Polarizer Cube',
    nameZh: 'UC2 偏振片模块',
    category: 'uc2',
    descriptionEn: 'Modular polarizer insert for UC2 system. Snap-fit design for easy assembly and rotation.',
    descriptionZh: 'UC2系统的模块化偏振片插件。卡扣设计，便于组装和旋转。',
    principleEn: 'Standard linear polarizer film mounted in 3D-printed cube compatible with UC2 rail system. Rotation ring allows continuous angle adjustment.',
    principleZh: '标准线偏振片薄膜安装在与UC2导轨系统兼容的3D打印立方体中。旋转环允许连续角度调节。',
    icon: '🔲',
    specifications: [
      { key: 'Cube Size', valueEn: '50×50×50 mm', valueZh: '50×50×50 mm' },
      { key: 'Aperture', valueEn: '25 mm', valueZh: '25 mm' },
      { key: 'Rotation', valueEn: '360° manual', valueZh: '360°手动' },
      { key: 'Material', valueEn: 'PLA + polarizer film', valueZh: 'PLA + 偏振片薄膜' },
    ],
    applications: {
      en: ['Education experiments', 'Rapid prototyping', 'Teaching demonstrations'],
      zh: ['教育实验', '快速原型', '教学演示'],
    },
    purchaseLinks: [
      { name: 'UC2 GitHub', url: 'https://github.com/openUC2/UC2-GIT' },
    ],
    difficulty: 'basic',
  },
  {
    id: 'uc2-waveplate-holder',
    nameEn: 'UC2 Waveplate Holder',
    nameZh: 'UC2 波片支架',
    category: 'uc2',
    descriptionEn: 'Precision rotation mount for waveplates in UC2 modular system.',
    descriptionZh: 'UC2模块化系统中波片的精密旋转支架。',
    principleEn: 'Accepts standard 1" waveplates. Graduated rotation scale for precise angle setting. Compatible with UC2 magnetic base system.',
    principleZh: '接受标准1英寸波片。刻度旋转刻度用于精确角度设置。与UC2磁性底座系统兼容。',
    icon: '🔄',
    specifications: [
      { key: 'Optic Size', valueEn: '1" (25.4 mm)', valueZh: '1英寸（25.4 mm）' },
      { key: 'Resolution', valueEn: '1° graduations', valueZh: '1°刻度' },
      { key: 'Mount Type', valueEn: 'Magnetic snap', valueZh: '磁性卡扣' },
    ],
    applications: {
      en: ['Polarization experiments', 'Student labs', 'Demonstration setups'],
      zh: ['偏振实验', '学生实验室', '演示装置'],
    },
    purchaseLinks: [
      { name: 'UC2 GitHub', url: 'https://github.com/openUC2/UC2-GIT' },
    ],
    difficulty: 'basic',
  },
  {
    id: 'uc2-led-matrix',
    nameEn: 'UC2 LED Matrix Module',
    nameZh: 'UC2 LED矩阵模块',
    category: 'uc2',
    descriptionEn: 'Programmable LED array for illumination control in UC2 microscopy setups.',
    descriptionZh: 'UC2显微镜装置中用于照明控制的可编程LED阵列。',
    principleEn: 'Addressable RGB LED matrix controlled via ESP32. Enables structured illumination, dark-field, and phase contrast techniques.',
    principleZh: '通过ESP32控制的可寻址RGB LED矩阵。支持结构照明、暗场和相衬技术。',
    icon: '💡',
    specifications: [
      { key: 'LED Count', valueEn: '8×8 or 4×4', valueZh: '8×8 或 4×4' },
      { key: 'Control', valueEn: 'ESP32 WiFi/USB', valueZh: 'ESP32 WiFi/USB' },
      { key: 'Color', valueEn: 'RGB addressable', valueZh: 'RGB可寻址' },
    ],
    applications: {
      en: ['Köhler illumination', 'Dark-field microscopy', 'Structured light'],
      zh: ['柯勒照明', '暗场显微镜', '结构光'],
    },
    purchaseLinks: [
      { name: 'UC2 GitHub', url: 'https://github.com/openUC2/UC2-GIT' },
    ],
    difficulty: 'intermediate',
  },
]

// Category configuration
const CATEGORIES: { id: DeviceCategory; labelEn: string; labelZh: string; icon: typeof Layers; color: string }[] = [
  { id: 'polarizers', labelEn: 'Polarizers', labelZh: '偏振器', icon: Circle, color: 'indigo' },
  { id: 'waveplates', labelEn: 'Wave Plates', labelZh: '波片', icon: Layers, color: 'violet' },
  { id: 'splitters', labelEn: 'Beam Splitters', labelZh: '分束器', icon: Triangle, color: 'cyan' },
  { id: 'retarders', labelEn: 'Retarders', labelZh: '延迟器', icon: Hexagon, color: 'amber' },
  { id: 'uc2', labelEn: 'UC2 Modules', labelZh: 'UC2 模块', icon: Square, color: 'emerald' },
  { id: 'other', labelEn: 'Other', labelZh: '其他', icon: Settings, color: 'gray' },
]

const DIFFICULTY_CONFIG = {
  basic: { labelEn: 'Basic', labelZh: '基础', color: 'green' as const },
  intermediate: { labelEn: 'Intermediate', labelZh: '进阶', color: 'yellow' as const },
  advanced: { labelEn: 'Advanced', labelZh: '高级', color: 'red' as const },
}

// Device card component
function DeviceCard({ device, onClick }: { device: Device; onClick: () => void }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[device.difficulty]
  const category = CATEGORIES.find(c => c.id === device.category)

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border p-4 cursor-pointer transition-all',
        'hover:-translate-y-1 hover:shadow-lg',
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 hover:border-indigo-500/50'
          : 'bg-white border-gray-200 hover:border-indigo-400'
      )}
    >
      {/* Icon and Title */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0',
          theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'
        )}>
          {device.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-semibold mb-1 line-clamp-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? device.nameZh : device.nameEn}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge color={difficulty.color} size="sm">
              {isZh ? difficulty.labelZh : difficulty.labelEn}
            </Badge>
            {category && (
              <span className={cn(
                'text-xs',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                {isZh ? category.labelZh : category.labelEn}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className={cn(
        'text-sm line-clamp-2 mb-3',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? device.descriptionZh : device.descriptionEn}
      </p>

      {/* View Details */}
      <div className={cn(
        'flex items-center gap-1 text-sm font-medium',
        theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
      )}>
        <span>{isZh ? '查看详情' : 'View Details'}</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  )
}

// Device detail modal component
function DeviceDetailModal({ device, onClose }: { device: Device; onClose: () => void }) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[device.difficulty]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        'relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6',
        theme === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-white'
      )}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            'absolute top-4 right-4 p-2 rounded-lg transition-colors',
            theme === 'dark' ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          )}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={cn(
            'w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0',
            theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'
          )}>
            {device.icon}
          </div>
          <div>
            <h2 className={cn(
              'text-2xl font-bold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? device.nameZh : device.nameEn}
            </h2>
            <div className="flex items-center gap-2">
              <Badge color={difficulty.color}>
                {isZh ? difficulty.labelZh : difficulty.labelEn}
              </Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className={cn(
            'text-sm font-semibold uppercase tracking-wider mb-2',
            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
          )}>
            {isZh ? '描述' : 'Description'}
          </h3>
          <p className={cn(
            'text-sm leading-relaxed',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {isZh ? device.descriptionZh : device.descriptionEn}
          </p>
        </div>

        {/* Working Principle */}
        <div className="mb-6">
          <h3 className={cn(
            'text-sm font-semibold uppercase tracking-wider mb-2',
            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
          )}>
            {isZh ? '工作原理' : 'Working Principle'}
          </h3>
          <p className={cn(
            'text-sm leading-relaxed',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {isZh ? device.principleZh : device.principleEn}
          </p>
          {device.mathFormula && (
            <div className={cn(
              'mt-3 p-3 rounded-lg font-mono text-sm',
              theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-gray-100 text-cyan-700'
            )}>
              {device.mathFormula}
            </div>
          )}
        </div>

        {/* Specifications */}
        {device.specifications && device.specifications.length > 0 && (
          <div className="mb-6">
            <h3 className={cn(
              'text-sm font-semibold uppercase tracking-wider mb-2',
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            )}>
              {isZh ? '技术参数' : 'Specifications'}
            </h3>
            <div className={cn(
              'rounded-lg border divide-y',
              theme === 'dark' ? 'border-slate-700 divide-slate-700' : 'border-gray-200 divide-gray-200'
            )}>
              {device.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between p-3">
                  <span className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {spec.key}
                  </span>
                  <span className={cn(
                    'text-sm font-medium',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? spec.valueZh : spec.valueEn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications */}
        {device.applications && (
          <div className="mb-6">
            <h3 className={cn(
              'text-sm font-semibold uppercase tracking-wider mb-2',
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            )}>
              {isZh ? '应用场景' : 'Applications'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(isZh ? device.applications.zh : device.applications.en).map((app, index) => (
                <span
                  key={index}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs',
                    theme === 'dark' ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                  )}
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Links (for UC2) */}
        {device.purchaseLinks && device.purchaseLinks.length > 0 && (
          <div className="mb-6">
            <h3 className={cn(
              'text-sm font-semibold uppercase tracking-wider mb-2',
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
            )}>
              {isZh ? '获取方式' : 'Where to Get'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {device.purchaseLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    theme === 'dark'
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  )}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {link.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Link to Optical Bench */}
        <div className={cn(
          'p-4 rounded-lg',
          theme === 'dark' ? 'bg-violet-500/10 border border-violet-500/30' : 'bg-violet-50 border border-violet-200'
        )}>
          <div className="flex items-center gap-3">
            <Zap className={cn('w-5 h-5', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
            <div className="flex-1">
              <p className={cn(
                'text-sm font-medium',
                theme === 'dark' ? 'text-violet-300' : 'text-violet-700'
              )}>
                {isZh ? '在光路设计室中使用此器件' : 'Use this device in Optical Path Designer'}
              </p>
            </div>
            <Link
              to="/bench"
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                theme === 'dark'
                  ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                  : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
              )}
            >
              {isZh ? '去搭建' : 'Build'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DevicesPage() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  // Filter devices
  const filteredDevices = DEVICES.filter(device => {
    const matchesCategory = selectedCategory === 'all' || device.category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      device.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.nameZh.includes(searchQuery) ||
      device.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.descriptionZh.includes(searchQuery)
    return matchesCategory && matchesSearch
  })

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]'
    )}>
      {/* Header */}
      <header className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md',
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'
      )}>
        <div className="max-w-7xl mx-auto px-4 py-4">
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
                  'text-xl font-bold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '偏振器件库' : 'Polarization Device Library'}
                </h1>
                <p className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {isZh ? '器件原理 × 分类图鉴' : 'Device Principles × Visual Guide'}
                </p>
              </div>
            </div>
            <LanguageThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )} />
            <input
              type="text"
              placeholder={isZh ? '搜索器件...' : 'Search devices...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2.5 rounded-xl border transition-colors',
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500 focus:border-indigo-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400'
              )}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                selectedCategory === 'all'
                  ? theme === 'dark'
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                  : theme === 'dark'
                    ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              )}
            >
              {isZh ? '全部' : 'All'}
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2',
                  selectedCategory === category.id
                    ? theme === 'dark'
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                      : 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
              >
                <category.icon className="w-4 h-4" />
                {isZh ? category.labelZh : category.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              onClick={() => setSelectedDevice(device)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredDevices.length === 0 && (
          <div className="text-center py-12">
            <div className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
            )}>
              <Search className={cn('w-8 h-8', theme === 'dark' ? 'text-gray-600' : 'text-gray-400')} />
            </div>
            <h3 className={cn(
              'text-lg font-semibold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '未找到器件' : 'No devices found'}
            </h3>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {isZh ? '尝试调整搜索条件或筛选分类' : 'Try adjusting your search or filter criteria'}
            </p>
          </div>
        )}

        {/* Quick Links to Optical Bench */}
        <div className={cn(
          'mt-12 p-6 rounded-2xl border',
          theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-gray-200'
        )}>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
              theme === 'dark' ? 'bg-violet-500/20' : 'bg-violet-100'
            )}>
              <Zap className={cn('w-7 h-7', theme === 'dark' ? 'text-violet-400' : 'text-violet-600')} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className={cn(
                'text-lg font-semibold mb-1',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '想要动手搭建光路？' : 'Ready to build optical setups?'}
              </h3>
              <p className={cn(
                'text-sm',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh
                  ? '前往光路设计室，将这些器件组装成完整的偏振光学系统'
                  : 'Head to the Optical Path Designer to assemble these devices into complete polarization systems'}
              </p>
            </div>
            <Link
              to="/bench"
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105',
                'bg-gradient-to-r from-violet-500 to-violet-600 text-white'
              )}
            >
              {isZh ? '开始搭建' : 'Start Building'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Device Detail Modal */}
      {selectedDevice && (
        <DeviceDetailModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}
    </div>
  )
}
