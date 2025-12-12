/**
 * Applications Page - Polarization Applications Gallery
 * 偏振应用图鉴 - 现实场景 × 原理解析
 *
 * Showcases real-world applications of polarization across fields:
 * - Photography & Imaging
 * - Display Technology
 * - Medical & Biomedical
 * - Remote Sensing & Astronomy
 * - Nature (sub-module: animals, sky, etc.)
 * - Industry & Engineering
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Badge } from '@/components/shared'
import {
  Home, Camera, Monitor, HeartPulse, Satellite, Leaf, Factory,
  ChevronRight, Lightbulb, X, ExternalLink, BookOpen,
  Eye, Atom, FlaskConical
} from 'lucide-react'

// Application categories
type ApplicationCategory = 'photography' | 'display' | 'medical' | 'remote' | 'nature' | 'industry' | 'research' | 'interdisciplinary'

// Reference type for academic sources
interface Reference {
  title: string
  authors?: string
  journal?: string
  year?: number
  url?: string
  doi?: string
}

// Application data interface
interface Application {
  id: string
  nameEn: string
  nameZh: string
  category: ApplicationCategory
  summaryEn: string
  summaryZh: string
  principleEn: string
  principleZh: string
  icon: string
  imageUrl?: string
  examplesEn: string[]
  examplesZh: string[]
  relatedDemo?: string
  funFact?: {
    en: string
    zh: string
  }
  difficulty: 'easy' | 'medium' | 'advanced'
  references?: Reference[]
}

// Nature sub-category for the Nature section
interface NaturePhenomenon {
  id: string
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  icon: string
  species?: string
  mechanism: {
    en: string
    zh: string
  }
  funFact: {
    en: string
    zh: string
  }
}

// Category configuration
const CATEGORIES: { id: ApplicationCategory; labelEn: string; labelZh: string; icon: typeof Camera; color: string }[] = [
  { id: 'photography', labelEn: 'Photography', labelZh: '摄影成像', icon: Camera, color: 'amber' },
  { id: 'display', labelEn: 'Displays', labelZh: '显示技术', icon: Monitor, color: 'cyan' },
  { id: 'medical', labelEn: 'Medical', labelZh: '医学生物', icon: HeartPulse, color: 'rose' },
  { id: 'remote', labelEn: 'Remote Sensing', labelZh: '遥感天文', icon: Satellite, color: 'violet' },
  { id: 'nature', labelEn: 'Nature', labelZh: '自然界', icon: Leaf, color: 'emerald' },
  { id: 'industry', labelEn: 'Industry', labelZh: '工业工程', icon: Factory, color: 'slate' },
  { id: 'research', labelEn: 'Frontier Research', labelZh: '前沿研究', icon: Atom, color: 'purple' },
  { id: 'interdisciplinary', labelEn: 'Interdisciplinary', labelZh: '交叉学科', icon: FlaskConical, color: 'teal' },
]

// Applications data
const APPLICATIONS: Application[] = [
  // === Photography ===
  {
    id: 'polarizing-filter',
    nameEn: 'Polarizing Filter',
    nameZh: '偏振滤镜',
    category: 'photography',
    summaryEn: 'Reduces reflections and enhances color saturation in outdoor photography.',
    summaryZh: '减少反射并增强户外摄影的色彩饱和度。',
    principleEn: 'A circular polarizer blocks reflected polarized light (from water, glass, leaves). By rotating the filter, photographers control which reflections are removed. It also darkens blue skies by filtering out polarized scattered light.',
    principleZh: '圆偏振滤镜阻挡反射的偏振光（来自水面、玻璃、树叶）。通过旋转滤镜，摄影师可以控制去除哪些反射。它还能通过过滤偏振散射光使蓝天更深。',
    icon: '📷',
    examplesEn: ['Eliminating water surface reflections', 'Darkening blue sky', 'Removing glare from foliage'],
    examplesZh: ['消除水面反射', '使蓝天更深沉', '去除树叶眩光'],
    relatedDemo: 'brewster',
    funFact: {
      en: 'The effect is strongest when shooting at 90° to the sun!',
      zh: '当拍摄方向与太阳成90°时效果最强！',
    },
    difficulty: 'easy',
    references: [
      {
        title: 'Polarization in Remote Sensing and Photography',
        authors: 'J. S. Tyo et al.',
        journal: 'Applied Optics',
        year: 2006,
        doi: '10.1364/AO.45.005453',
        url: 'https://doi.org/10.1364/AO.45.005453'
      },
      {
        title: 'Polarized Light in Nature',
        authors: 'G. Horváth, D. Varjú',
        journal: 'Springer',
        year: 2004,
        url: 'https://link.springer.com/book/10.1007/978-3-662-09387-0'
      }
    ],
  },
  {
    id: '3d-photography',
    nameEn: '3D Stereoscopic Photography',
    nameZh: '3D立体摄影',
    category: 'photography',
    summaryEn: 'Uses polarization to separate left and right eye views for 3D perception.',
    summaryZh: '使用偏振分离左右眼视图以实现3D感知。',
    principleEn: 'Two projectors display left/right images with orthogonal polarizations. Viewers wear glasses with matching polarizers, so each eye sees only its intended image. Modern cinemas often use circular polarization to allow head tilting.',
    principleZh: '两台投影仪以正交偏振方式显示左/右图像。观众戴着带有匹配偏振片的眼镜，因此每只眼睛只看到预期的图像。现代电影院通常使用圆偏振以允许头部倾斜。',
    icon: '🎬',
    examplesEn: ['IMAX 3D films', 'RealD 3D cinema', '3D television'],
    examplesZh: ['IMAX 3D电影', 'RealD 3D影院', '3D电视'],
    relatedDemo: 'polarization-state',
    funFact: {
      en: 'Circular polarization prevents "ghosting" when you tilt your head!',
      zh: '圆偏振防止你歪头时出现"鬼影"！',
    },
    difficulty: 'medium',
  },
  // === Display Technology ===
  {
    id: 'lcd-display',
    nameEn: 'LCD Display Technology',
    nameZh: 'LCD显示技术',
    category: 'display',
    summaryEn: 'Uses polarizers and liquid crystals to control light transmission pixel by pixel.',
    summaryZh: '使用偏振片和液晶逐像素控制光透射。',
    principleEn: 'LCDs sandwich twisted nematic liquid crystals between crossed polarizers. Without voltage, LC molecules rotate light polarization 90°, allowing light through. Voltage straightens molecules, blocking light. Each pixel is independently controlled.',
    principleZh: 'LCD在正交偏振片之间夹入扭曲向列液晶。无电压时，液晶分子将光偏振旋转90°，允许光通过。电压使分子伸直，阻挡光线。每个像素独立控制。',
    icon: '🖥️',
    examplesEn: ['Computer monitors', 'Smartphone screens', 'Digital watches', 'Calculator displays'],
    examplesZh: ['电脑显示器', '智能手机屏幕', '电子手表', '计算器显示'],
    relatedDemo: 'malus',
    funFact: {
      en: 'If you wear polarizing sunglasses, some LCD screens may look black at certain angles!',
      zh: '如果你戴偏振太阳镜，某些LCD屏幕在特定角度可能看起来是黑色的！',
    },
    difficulty: 'medium',
    references: [
      {
        title: 'Fundamentals of Liquid Crystal Devices',
        authors: 'D.-K. Yang, S.-T. Wu',
        journal: 'Wiley',
        year: 2014,
        url: 'https://onlinelibrary.wiley.com/doi/book/10.1002/9781118751992'
      },
      {
        title: 'Liquid Crystal Display Technology',
        journal: 'IEEE Spectrum',
        year: 2000,
        url: 'https://spectrum.ieee.org/the-origins-of-the-lcd'
      }
    ],
  },
  {
    id: 'oled-polarizer',
    nameEn: 'OLED Anti-Reflection',
    nameZh: 'OLED防反射',
    category: 'display',
    summaryEn: 'Circular polarizer on OLED screens eliminates reflections from the metallic cathode.',
    summaryZh: 'OLED屏幕上的圆偏振片消除金属阴极的反射。',
    principleEn: 'OLEDs have reflective metal electrodes that cause poor contrast in bright light. A circular polarizer converts incident light to circular polarization; when reflected, it becomes opposite-handed and is blocked on exit. This dramatically improves contrast.',
    principleZh: 'OLED有反射金属电极，在强光下对比度差。圆偏振片将入射光转换为圆偏振光；反射时变成相反旋向，在出射时被阻挡。这大大提高了对比度。',
    icon: '📱',
    examplesEn: ['iPhone displays', 'Samsung Galaxy screens', 'OLED TVs'],
    examplesZh: ['iPhone显示屏', '三星Galaxy屏幕', 'OLED电视'],
    funFact: {
      en: 'This is why OLED screens often look "inky black" even in sunlight!',
      zh: '这就是为什么OLED屏幕即使在阳光下也常显得"墨黑"！',
    },
    difficulty: 'advanced',
  },
  // === Medical ===
  {
    id: 'polarization-microscopy',
    nameEn: 'Polarization Microscopy',
    nameZh: '偏振显微镜',
    category: 'medical',
    summaryEn: 'Reveals birefringent structures in biological samples without staining.',
    summaryZh: '无需染色即可显示生物样本中的双折射结构。',
    principleEn: 'Crossed polarizers create a dark field. Birefringent materials (collagen, muscle fibers, crystals) rotate polarization, appearing bright against the dark background. This reveals structural organization and molecular alignment.',
    principleZh: '正交偏振片创建暗场。双折射材料（胶原蛋白、肌肉纤维、晶体）旋转偏振，在暗背景上显得明亮。这揭示了结构组织和分子排列。',
    icon: '🔬',
    examplesEn: ['Gout crystal detection', 'Collagen fiber imaging', 'Amyloid plaque identification'],
    examplesZh: ['痛风晶体检测', '胶原纤维成像', '淀粉样斑块鉴定'],
    relatedDemo: 'birefringence',
    funFact: {
      en: 'Doctors use polarized microscopy to distinguish gout (needle crystals) from pseudogout (rhomboid crystals)!',
      zh: '医生使用偏振显微镜区分痛风（针状晶体）和假性痛风（菱形晶体）！',
    },
    difficulty: 'medium',
    references: [
      {
        title: 'Polarized Light Microscopy: Principles and Practice',
        authors: 'P. C. Robinson, S. Bradbury',
        journal: 'Royal Microscopical Society',
        year: 1992,
        url: 'https://www.wiley.com/en-us/Polarized+Light+Microscopy-p-9780471417880'
      },
      {
        title: 'Crystal Identification in Synovial Fluid',
        authors: 'H. R. Schumacher Jr.',
        journal: 'JAMA',
        year: 1988,
        doi: '10.1001/jama.1988.03410140085035',
        url: 'https://jamanetwork.com/journals/jama/article-abstract/373091'
      }
    ],
  },
  {
    id: 'glucose-polarimetry',
    nameEn: 'Blood Glucose Monitoring',
    nameZh: '血糖监测',
    category: 'medical',
    summaryEn: 'Non-invasive glucose measurement using optical rotation.',
    summaryZh: '利用旋光性进行无创血糖测量。',
    principleEn: 'Glucose is optically active - it rotates polarized light. The rotation angle is proportional to concentration. By measuring polarization rotation through tissue, glucose levels can potentially be determined without blood draws.',
    principleZh: '葡萄糖具有旋光性——它能旋转偏振光。旋转角度与浓度成正比。通过测量通过组织的偏振旋转，可以在不抽血的情况下确定血糖水平。',
    icon: '💉',
    examplesEn: ['Research glucose monitors', 'Diabetes management devices', 'Continuous monitoring systems'],
    examplesZh: ['研究型血糖仪', '糖尿病管理设备', '连续监测系统'],
    relatedDemo: 'optical-rotation',
    funFact: {
      en: 'A 100 mg/dL glucose solution rotates polarization by about 0.05° per cm!',
      zh: '100 mg/dL的葡萄糖溶液每厘米使偏振旋转约0.05°！',
    },
    difficulty: 'advanced',
  },
  // === Remote Sensing ===
  {
    id: 'atmospheric-polarimetry',
    nameEn: 'Atmospheric Remote Sensing',
    nameZh: '大气遥感',
    category: 'remote',
    summaryEn: 'Measures atmospheric aerosols and pollution using polarized light.',
    summaryZh: '使用偏振光测量大气气溶胶和污染。',
    principleEn: 'Sunlight scattered by aerosols becomes partially polarized. The degree and angle of polarization reveal particle size, shape, and composition. Satellites use multi-angle polarimeters to map global air quality.',
    principleZh: '被气溶胶散射的阳光变成部分偏振。偏振度和偏振角揭示粒子大小、形状和成分。卫星使用多角度偏振计绘制全球空气质量。',
    icon: '🛰️',
    examplesEn: ['POLDER satellite', 'Air quality monitoring', 'Climate research'],
    examplesZh: ['POLDER卫星', '空气质量监测', '气候研究'],
    relatedDemo: 'mie-scattering',
    funFact: {
      en: 'The first polarimeter in space was launched in 2004 on the PARASOL satellite!',
      zh: '太空中的第一个偏振计于2004年在PARASOL卫星上发射！',
    },
    difficulty: 'advanced',
  },
  {
    id: 'star-polarimetry',
    nameEn: 'Stellar Polarimetry',
    nameZh: '恒星偏振测量',
    category: 'remote',
    summaryEn: 'Studies magnetic fields and dust around stars through polarization.',
    summaryZh: '通过偏振研究恒星周围的磁场和尘埃。',
    principleEn: 'Interstellar dust grains align with galactic magnetic fields. Starlight passing through becomes polarized by dichroic extinction. Mapping this polarization reveals magnetic field structures across the Milky Way.',
    principleZh: '星际尘埃颗粒与银河系磁场对齐。通过的星光因二向色消光而变得偏振。绘制这种偏振揭示了银河系的磁场结构。',
    icon: '✨',
    examplesEn: ['Galactic magnetic field mapping', 'Exoplanet atmosphere detection', 'Supernova studies'],
    examplesZh: ['银河系磁场绘图', '系外行星大气检测', '超新星研究'],
    funFact: {
      en: 'Polarization helped confirm the existence of magnetic fields in distant galaxies!',
      zh: '偏振帮助确认了遥远星系中磁场的存在！',
    },
    difficulty: 'advanced',
  },
  // === Industry ===
  {
    id: 'stress-analysis',
    nameEn: 'Photoelastic Stress Analysis',
    nameZh: '光弹应力分析',
    category: 'industry',
    summaryEn: 'Visualizes stress distribution in transparent materials.',
    summaryZh: '可视化透明材料中的应力分布。',
    principleEn: 'Stressed materials become birefringent. Between crossed polarizers, stress patterns appear as colored fringes (isochromatics) and dark lines (isoclinics). Engineers use this to validate structural designs and find stress concentrations.',
    principleZh: '受力材料变得具有双折射性。在正交偏振片之间，应力图案显示为彩色条纹（等色线）和暗线（等倾线）。工程师用此验证结构设计并发现应力集中。',
    icon: '🏗️',
    examplesEn: ['Bridge design validation', 'Aircraft component testing', 'Glass tempering QC'],
    examplesZh: ['桥梁设计验证', '飞机部件测试', '玻璃钢化质检'],
    relatedDemo: 'anisotropy',
    funFact: {
      en: 'You can see stress patterns in plastic rulers and CD cases between polarizers!',
      zh: '你可以在偏振片之间看到塑料尺和CD盒中的应力图案！',
    },
    difficulty: 'easy',
  },
  {
    id: 'defect-detection',
    nameEn: 'Surface Defect Detection',
    nameZh: '表面缺陷检测',
    category: 'industry',
    summaryEn: 'Uses polarization to detect scratches, dents, and imperfections.',
    summaryZh: '使用偏振检测划痕、凹痕和缺陷。',
    principleEn: 'Specular reflections from smooth surfaces are highly polarized. Defects scatter light randomly, depolarizing it. A polarization camera distinguishes defects by their different polarization signatures.',
    principleZh: '光滑表面的镜面反射高度偏振。缺陷随机散射光，使其去偏振。偏振相机通过不同的偏振特征区分缺陷。',
    icon: '🔍',
    examplesEn: ['Automotive paint inspection', 'Semiconductor wafer QC', 'Glass surface inspection'],
    examplesZh: ['汽车油漆检测', '半导体晶圆质检', '玻璃表面检测'],
    funFact: {
      en: 'Modern car factories use polarization cameras to find paint defects invisible to the naked eye!',
      zh: '现代汽车工厂使用偏振相机发现肉眼看不见的油漆缺陷！',
    },
    difficulty: 'medium',
  },
  // === Frontier Research (2020s) ===
  {
    id: 'metasurface-polarimetry',
    nameEn: 'Metasurface Polarization Control',
    nameZh: '超表面偏振调控',
    category: 'research',
    summaryEn: 'Nanoscale metasurfaces enable unprecedented control over light polarization in ultra-thin devices.',
    summaryZh: '纳米级超表面在超薄器件中实现对光偏振的前所未有的控制。',
    principleEn: 'Metasurfaces are 2D arrays of subwavelength nanostructures that manipulate light through localized phase shifts. By carefully designing each nanoantenna\'s geometry and orientation, metasurfaces can generate any desired polarization state, create vectorial beams, and perform complete polarimetric analysis in a single flat optic.',
    principleZh: '超表面是亚波长纳米结构的二维阵列，通过局部相位偏移操纵光。通过精心设计每个纳米天线的几何形状和方向，超表面可以生成任何所需的偏振态，创建矢量光束，并在单个平面光学元件中执行完整的偏振分析。',
    icon: '🔮',
    examplesEn: ['Flat polarization cameras', 'Compact spectrometers', 'Holographic displays', 'Optical encryption'],
    examplesZh: ['平面偏振相机', '紧凑型光谱仪', '全息显示', '光学加密'],
    funFact: {
      en: 'A metasurface polarimeter can be thinner than a human hair while outperforming traditional bulky optics!',
      zh: '超表面偏振仪可以比人类头发还薄，同时性能超越传统笨重光学元件！',
    },
    difficulty: 'advanced',
  },
  {
    id: 'quantum-polarization',
    nameEn: 'Quantum Polarization Communications',
    nameZh: '量子偏振通信',
    category: 'research',
    summaryEn: 'Polarization-encoded quantum states enable secure communication and quantum information processing.',
    summaryZh: '偏振编码的量子态实现安全通信和量子信息处理。',
    principleEn: 'Single photons can carry quantum information in their polarization state. BB84 and similar protocols use polarization bases (H/V, +45°/-45°) to establish secure keys. Any eavesdropping disturbs the quantum states, revealing interception. Entangled photon pairs with correlated polarizations enable quantum teleportation and superdense coding.',
    principleZh: '单光子可以在其偏振态中携带量子信息。BB84等协议使用偏振基（H/V, +45°/-45°）建立安全密钥。任何窃听都会干扰量子态，从而暴露拦截。具有相关偏振的纠缠光子对实现量子隐形传态和超密编码。',
    icon: '🔐',
    examplesEn: ['Quantum key distribution', 'Satellite QKD (Micius)', 'Quantum random number generators', 'Bell state measurement'],
    examplesZh: ['量子密钥分发', '卫星QKD（墨子号）', '量子随机数发生器', '贝尔态测量'],
    relatedDemo: 'polarization-state',
    funFact: {
      en: 'China\'s Micius satellite demonstrated quantum key distribution over 1,200 km using polarization-entangled photons!',
      zh: '中国墨子号卫星使用偏振纠缠光子演示了超过1200公里的量子密钥分发！',
    },
    difficulty: 'advanced',
  },
  {
    id: 'ai-polarimetric-imaging',
    nameEn: 'AI-Powered Polarimetric Imaging',
    nameZh: 'AI偏振成像',
    category: 'research',
    summaryEn: 'Deep learning revolutionizes polarization image processing and scene understanding.',
    summaryZh: '深度学习革新偏振图像处理和场景理解。',
    principleEn: 'Neural networks trained on polarimetric data can extract features invisible in intensity images: surface normals, material properties, depth information, and transparent objects. Physics-informed networks incorporate Mueller matrix constraints for robust reconstruction. Real-time processing enables autonomous driving and robot vision applications.',
    principleZh: '在偏振数据上训练的神经网络可以提取强度图像中不可见的特征：表面法线、材料属性、深度信息和透明物体。物理约束网络结合穆勒矩阵约束进行稳健重建。实时处理使自动驾驶和机器人视觉应用成为可能。',
    icon: '🤖',
    examplesEn: ['Autonomous vehicle perception', 'Transparent object detection', '3D shape recovery', 'Material classification'],
    examplesZh: ['自动驾驶感知', '透明物体检测', '三维形状恢复', '材料分类'],
    funFact: {
      en: 'AI can recover the 3D shape of a glass bottle from just 4 polarization images!',
      zh: 'AI仅用4张偏振图像就能恢复玻璃瓶的三维形状！',
    },
    difficulty: 'advanced',
  },
  {
    id: 'polarimetric-lidar',
    nameEn: 'Polarimetric LiDAR',
    nameZh: '偏振激光雷达',
    category: 'research',
    summaryEn: 'Combining LiDAR with polarization provides rich information about surface properties and vegetation.',
    summaryZh: '将激光雷达与偏振相结合，提供丰富的地表属性和植被信息。',
    principleEn: 'Standard LiDAR measures range and intensity. Polarimetric LiDAR also records how surfaces depolarize or rotate the return signal. Ice vs. water, vegetation health, building materials, and camouflaged objects can be distinguished by their polarimetric signatures.',
    principleZh: '标准激光雷达测量距离和强度。偏振激光雷达还记录表面如何使返回信号去偏振或旋转。冰与水、植被健康、建筑材料和伪装物体可以通过其偏振特征来区分。',
    icon: '📡',
    examplesEn: ['Vegetation mapping', 'Sea ice monitoring', 'Power line inspection', 'Archaeological prospection'],
    examplesZh: ['植被制图', '海冰监测', '电力线检测', '考古勘探'],
    funFact: {
      en: 'Polarimetric LiDAR can distinguish between healthy and stressed vegetation from kilometers away!',
      zh: '偏振激光雷达可以从数公里外区分健康和受胁迫的植被！',
    },
    difficulty: 'advanced',
  },
  {
    id: 'vector-beam-applications',
    nameEn: 'Vector Beam Applications',
    nameZh: '矢量光束应用',
    category: 'research',
    summaryEn: 'Beams with spatially varying polarization enable super-resolution microscopy and optical trapping.',
    summaryZh: '具有空间变化偏振的光束实现超分辨显微和光学捕获。',
    principleEn: 'Vector beams have polarization states that vary across the beam cross-section (radial, azimuthal, or more complex patterns). When focused, they create unique intensity and field distributions: longitudinal E-fields, smaller focal spots, or optical vortices. These enable nanoscale manipulation and imaging beyond the diffraction limit.',
    principleZh: '矢量光束的偏振态在光束横截面上变化（径向、方位角或更复杂的图案）。聚焦时，它们产生独特的强度和场分布：纵向电场、更小的焦点或光学涡旋。这些使纳米尺度操纵和超越衍射极限的成像成为可能。',
    icon: '🌀',
    examplesEn: ['STED microscopy', 'Optical trapping', 'Laser machining', 'Particle acceleration'],
    examplesZh: ['STED显微镜', '光学捕获', '激光加工', '粒子加速'],
    relatedDemo: 'polarization-types',
    funFact: {
      en: 'Radially polarized light can focus to a spot 20% smaller than regular light!',
      zh: '径向偏振光可以聚焦到比普通光小20%的光斑！',
    },
    difficulty: 'advanced',
  },
  // === Interdisciplinary Applications ===
  {
    id: 'art-authentication',
    nameEn: 'Art Authentication & Archaeology',
    nameZh: '艺术鉴定与考古',
    category: 'interdisciplinary',
    summaryEn: 'Polarized light reveals hidden layers, underdrawings, and restoration in artworks.',
    summaryZh: '偏振光揭示艺术品中的隐藏层、底稿和修复痕迹。',
    principleEn: 'Different paint layers and varnishes have distinct polarization properties. Cross-polarized illumination suppresses specular reflections, revealing brushwork and underpaintings. UV-excited fluorescence combined with polarization distinguishes original from restored areas. In archaeology, polarized imaging reveals faded inscriptions and textile patterns.',
    principleZh: '不同的颜料层和清漆具有不同的偏振特性。交叉偏振照明抑制镜面反射，显示笔触和底画。紫外激发荧光与偏振相结合可区分原作和修复区域。在考古学中，偏振成像可揭示褪色的铭文和纺织品图案。',
    icon: '🎨',
    examplesEn: ['Forgery detection', 'Underdrawing analysis', 'Mural documentation', 'Textile archaeology'],
    examplesZh: ['赝品检测', '底稿分析', '壁画记录', '纺织品考古'],
    funFact: {
      en: 'Polarized imaging helped reveal a hidden portrait beneath a famous Picasso painting!',
      zh: '偏振成像帮助揭示了毕加索一幅名画下隐藏的肖像！',
    },
    difficulty: 'medium',
  },
  {
    id: 'food-inspection',
    nameEn: 'Food Quality Inspection',
    nameZh: '食品质量检测',
    category: 'interdisciplinary',
    summaryEn: 'Polarization imaging detects defects, contamination, and freshness in food products.',
    summaryZh: '偏振成像检测食品中的缺陷、污染和新鲜度。',
    principleEn: 'Food surfaces have characteristic polarization signatures based on moisture, fat content, and surface texture. Bruises on fruit change tissue birefringence before visible discoloration. Meat freshness correlates with polarization changes in muscle fibers. Foreign objects are often revealed by their different depolarization properties.',
    principleZh: '食品表面根据水分、脂肪含量和表面纹理具有特征偏振信号。水果上的瘀伤在可见变色之前改变组织双折射。肉类新鲜度与肌肉纤维的偏振变化相关。异物通常通过其不同的去偏振特性被发现。',
    icon: '🍎',
    examplesEn: ['Bruise detection in fruit', 'Meat freshness testing', 'Plastic contamination detection', 'Sugar content estimation'],
    examplesZh: ['水果瘀伤检测', '肉类新鲜度测试', '塑料污染检测', '含糖量估算'],
    funFact: {
      en: 'Polarization cameras can spot bruised apples 2 days before human inspectors can!',
      zh: '偏振相机可以比人工检查员提前2天发现瘀伤的苹果！',
    },
    difficulty: 'easy',
  },
  {
    id: 'forensic-science',
    nameEn: 'Forensic Science',
    nameZh: '法医科学',
    category: 'interdisciplinary',
    summaryEn: 'Polarized light microscopy identifies fibers, minerals, and trace evidence in criminal investigations.',
    summaryZh: '偏振光显微镜在刑事调查中识别纤维、矿物和痕量证据。',
    principleEn: 'Synthetic and natural fibers have distinctive birefringence patterns. Hair shows characteristic polarization signatures. Soil minerals can be matched to crime scenes using their optical properties. Document examination uses polarization to detect alterations, erasures, and ink comparisons.',
    principleZh: '合成和天然纤维具有独特的双折射图案。头发显示特征偏振信号。土壤矿物可以使用其光学特性与犯罪现场匹配。文件检查使用偏振检测涂改、擦除和墨水比较。',
    icon: '🔎',
    examplesEn: ['Fiber analysis', 'Hair examination', 'Soil comparison', 'Document fraud detection'],
    examplesZh: ['纤维分析', '毛发检验', '土壤比较', '文件欺诈检测'],
    relatedDemo: 'birefringence',
    funFact: {
      en: 'Forensic scientists can identify over 1,000 different fiber types using polarized microscopy!',
      zh: '法医科学家可以使用偏振显微镜识别超过1000种不同的纤维类型！',
    },
    difficulty: 'medium',
  },
  {
    id: 'environmental-monitoring',
    nameEn: 'Environmental Monitoring',
    nameZh: '环境监测',
    category: 'interdisciplinary',
    summaryEn: 'Polarimetry tracks microplastics, oil spills, and water quality in ecosystems.',
    summaryZh: '偏振测量追踪生态系统中的微塑料、油污和水质。',
    principleEn: 'Microplastics in water are strongly birefringent and easily identified under crossed polarizers. Oil films on water surfaces create characteristic interference patterns in polarized light. Algal blooms change water\'s polarization scattering properties, enabling satellite detection and early warning systems.',
    principleZh: '水中的微塑料具有强双折射性，在正交偏振片下很容易识别。水面油膜在偏振光中产生特征干涉图案。藻类水华改变水的偏振散射特性，实现卫星检测和早期预警系统。',
    icon: '🌊',
    examplesEn: ['Microplastic detection', 'Oil spill mapping', 'Algal bloom monitoring', 'Coral reef health assessment'],
    examplesZh: ['微塑料检测', '油污绘图', '藻华监测', '珊瑚礁健康评估'],
    relatedDemo: 'mie-scattering',
    funFact: {
      en: 'Polarization satellites can detect oil slicks just 1 micron thick from 700 km altitude!',
      zh: '偏振卫星可以从700公里高度检测到仅1微米厚的油膜！',
    },
    difficulty: 'medium',
  },
  {
    id: 'neuroscience-imaging',
    nameEn: 'Neuroscience Optical Imaging',
    nameZh: '神经科学光学成像',
    category: 'interdisciplinary',
    summaryEn: 'Polarization-sensitive imaging reveals neural fiber architecture in the brain.',
    summaryZh: '偏振敏感成像揭示大脑中的神经纤维结构。',
    principleEn: 'Myelinated nerve fibers are birefringent due to their layered lipid structure. Polarization microscopy can map fiber orientations in brain tissue with micrometer resolution. This reveals the brain\'s connectome - the wiring diagram of neural pathways - without requiring chemical stains or genetic markers.',
    principleZh: '髓鞘神经纤维由于其分层脂质结构而具有双折射性。偏振显微镜可以以微米分辨率绘制脑组织中的纤维方向。这揭示了大脑的连接组——神经通路的布线图——无需化学染色或遗传标记。',
    icon: '🧠',
    examplesEn: ['Brain fiber mapping', 'Myelin imaging', 'Retinal nerve analysis', 'Spinal cord assessment'],
    examplesZh: ['脑纤维图谱', '髓鞘成像', '视网膜神经分析', '脊髓评估'],
    relatedDemo: 'birefringence',
    funFact: {
      en: 'Polarized light microscopy can track individual nerve fibers as thin as 200 nanometers!',
      zh: '偏振光显微镜可以追踪细至200纳米的单根神经纤维！',
    },
    difficulty: 'advanced',
  },
  {
    id: 'agriculture-phenotyping',
    nameEn: 'Agricultural Plant Phenotyping',
    nameZh: '农业植物表型分析',
    category: 'interdisciplinary',
    summaryEn: 'Polarimetric sensors measure crop health, water stress, and disease before visible symptoms.',
    summaryZh: '偏振传感器在可见症状出现之前测量作物健康、水分胁迫和疾病。',
    principleEn: 'Leaf surface waxes and cell structures create polarization signatures that change with plant health. Water stress alters leaf birefringence days before wilting. Fungal infections modify the cuticle polarization properties. Drone-mounted polarimeters enable precision agriculture at field scale.',
    principleZh: '叶片表面蜡质和细胞结构产生随植物健康状况变化的偏振信号。水分胁迫在枯萎前数天改变叶片双折射。真菌感染改变角质层偏振特性。无人机搭载的偏振仪实现田间尺度的精准农业。',
    icon: '🌾',
    examplesEn: ['Drought stress detection', 'Disease early warning', 'Crop yield prediction', 'Nitrogen status assessment'],
    examplesZh: ['干旱胁迫检测', '病害早期预警', '作物产量预测', '氮素状态评估'],
    funFact: {
      en: 'Polarization imaging can detect wheat rust infection 5 days before any visible symptoms appear!',
      zh: '偏振成像可以在任何可见症状出现前5天检测到小麦锈病感染！',
    },
    difficulty: 'medium',
  },
]

// Nature phenomena data (sub-module)
const NATURE_PHENOMENA: NaturePhenomenon[] = [
  {
    id: 'bee-navigation',
    nameEn: 'Bee Navigation',
    nameZh: '蜜蜂导航',
    descriptionEn: 'Honeybees use the polarization pattern of the sky to navigate, even on cloudy days.',
    descriptionZh: '蜜蜂利用天空的偏振图案导航，即使在阴天也能进行。',
    icon: '🐝',
    species: 'Apis mellifera',
    mechanism: {
      en: 'Bees have specialized photoreceptors sensitive to UV-polarized light. The sky\'s polarization pattern (caused by Rayleigh scattering) forms a compass they can read even through clouds.',
      zh: '蜜蜂有对紫外偏振光敏感的特化感光器。天空的偏振图案（由瑞利散射引起）形成一个指南针，它们甚至可以透过云层读取。',
    },
    funFact: {
      en: 'Bees can communicate the direction to food sources using their "waggle dance" calibrated by sky polarization!',
      zh: '蜜蜂可以使用由天空偏振校准的"摇摆舞"传达食物来源的方向！',
    },
  },
  {
    id: 'mantis-shrimp',
    nameEn: 'Mantis Shrimp Vision',
    nameZh: '螳螂虾视觉',
    descriptionEn: 'Mantis shrimp can see both linear and circular polarization - the only known animals with this ability.',
    descriptionZh: '螳螂虾可以看到线偏振和圆偏振——是唯一已知具有此能力的动物。',
    icon: '🦐',
    species: 'Odontodactylus scyllarus',
    mechanism: {
      en: 'Their compound eyes contain quarter-wave retarders made of protein, converting circular to linear polarization. They use this for secret communication and prey detection.',
      zh: '它们的复眼含有由蛋白质制成的四分之一波延迟器，将圆偏振转换为线偏振。它们用此进行秘密通信和猎物检测。',
    },
    funFact: {
      en: 'They may use circular polarization as a "secret channel" invisible to predators!',
      zh: '它们可能使用圆偏振作为对捕食者不可见的"秘密频道"！',
    },
  },
  {
    id: 'cuttlefish-camouflage',
    nameEn: 'Cuttlefish Polarization Camouflage',
    nameZh: '乌贼偏振伪装',
    descriptionEn: 'Cuttlefish can control the polarization of their skin patterns for communication and camouflage.',
    descriptionZh: '乌贼可以控制皮肤图案的偏振以进行通信和伪装。',
    icon: '🦑',
    species: 'Sepia officinalis',
    mechanism: {
      en: 'Cuttlefish chromatophores can be arranged to create polarized patterns. These are invisible to most predators but visible to other cuttlefish, creating a "hidden channel" for communication.',
      zh: '乌贼色素细胞可以排列成偏振图案。这些图案对大多数捕食者不可见，但对其他乌贼可见，创建了一个用于通信的"隐藏通道"。',
    },
    funFact: {
      en: 'Some researchers call this "polarization steganography" - hiding messages in plain sight!',
      zh: '一些研究人员称之为"偏振隐写术"——在明处隐藏信息！',
    },
  },
  {
    id: 'sky-polarization',
    nameEn: 'Blue Sky Polarization',
    nameZh: '蓝天偏振',
    descriptionEn: 'The sky is polarized due to Rayleigh scattering, with maximum polarization at 90° from the sun.',
    descriptionZh: '由于瑞利散射，天空是偏振的，在距太阳90°处偏振度最大。',
    icon: '☀️',
    mechanism: {
      en: 'When sunlight scatters off air molecules, it becomes partially polarized perpendicular to the scattering plane. This creates a predictable pattern across the sky that many animals use for navigation.',
      zh: '当阳光被空气分子散射时，它变成垂直于散射平面的部分偏振。这在天空中创建了一个可预测的图案，许多动物用于导航。',
    },
    funFact: {
      en: 'Vikings may have used "sunstones" (calcite crystals) to detect sky polarization for navigation!',
      zh: '维京人可能使用"太阳石"（方解石晶体）来检测天空偏振进行导航！',
    },
  },
  {
    id: 'rainbow-polarization',
    nameEn: 'Rainbow Polarization',
    nameZh: '彩虹偏振',
    descriptionEn: 'Rainbows are strongly polarized tangentially, a fact invisible to the naked eye.',
    descriptionZh: '彩虹沿切线方向强烈偏振，这一事实肉眼不可见。',
    icon: '🌈',
    mechanism: {
      en: 'Light entering a raindrop reflects internally at the Brewster angle, making the reflected light strongly polarized. The polarization is tangential to the rainbow arc.',
      zh: '进入雨滴的光以布儒斯特角内反射，使反射光强烈偏振。偏振方向与彩虹弧相切。',
    },
    funFact: {
      en: 'You can make parts of a rainbow disappear by viewing it through a rotating polarizer!',
      zh: '通过旋转偏振片观看彩虹，你可以使彩虹的部分消失！',
    },
  },
  {
    id: 'bird-migration',
    nameEn: 'Bird Migration Navigation',
    nameZh: '候鸟迁徙导航',
    descriptionEn: 'Many migratory birds use sky polarization patterns as a compass during long journeys.',
    descriptionZh: '许多候鸟在长途旅行中使用天空偏振图案作为指南针。',
    icon: '🦆',
    species: 'Various migratory species',
    mechanism: {
      en: 'Birds have specialized cone cells in their eyes sensitive to polarized light. They use the twilight polarization pattern at sunset/sunrise to calibrate their internal magnetic compass.',
      zh: '鸟类眼睛中有对偏振光敏感的特化锥细胞。它们使用日落/日出时的暮光偏振图案来校准内部磁罗盘。',
    },
    funFact: {
      en: 'Experiments show that disrupting the twilight sky polarization can disorient migrating birds!',
      zh: '实验表明，干扰暮光天空偏振可以使迁徙的鸟类迷失方向！',
    },
  },
]

const DIFFICULTY_CONFIG = {
  easy: { labelEn: 'Basic', labelZh: '基础', color: 'green' as const },
  medium: { labelEn: 'Intermediate', labelZh: '进阶', color: 'yellow' as const },
  advanced: { labelEn: 'Advanced', labelZh: '高级', color: 'red' as const },
}

// Application card component
function ApplicationCard({
  app,
  onClick,
}: {
  app: Application
  onClick: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[app.difficulty]
  const category = CATEGORIES.find(c => c.id === app.category)

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border p-4 cursor-pointer transition-all',
        'hover:-translate-y-1 hover:shadow-lg',
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50'
          : 'bg-white border-gray-200 hover:border-amber-400'
      )}
    >
      {/* Icon and Title */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0',
          theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
        )}>
          {app.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-semibold mb-1 line-clamp-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? app.nameZh : app.nameEn}
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

      {/* Summary */}
      <p className={cn(
        'text-sm line-clamp-2 mb-3',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? app.summaryZh : app.summaryEn}
      </p>

      {/* View Details */}
      <div className={cn(
        'flex items-center gap-1 text-sm font-medium',
        theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
      )}>
        <span>{isZh ? '了解更多' : 'Learn More'}</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  )
}

// Nature phenomenon card
function NatureCard({
  phenomenon,
  onClick,
}: {
  phenomenon: NaturePhenomenon
  onClick: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border p-4 cursor-pointer transition-all',
        'hover:-translate-y-1 hover:shadow-lg',
        theme === 'dark'
          ? 'bg-emerald-900/20 border-emerald-700/50 hover:border-emerald-500/50'
          : 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{phenomenon.icon}</span>
        <div className="flex-1">
          <h4 className={cn(
            'font-semibold mb-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? phenomenon.nameZh : phenomenon.nameEn}
          </h4>
          <p className={cn(
            'text-sm line-clamp-2',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh ? phenomenon.descriptionZh : phenomenon.descriptionEn}
          </p>
        </div>
        <ChevronRight className={cn(
          'w-5 h-5 flex-shrink-0',
          theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
        )} />
      </div>
    </div>
  )
}

// Application detail modal
function ApplicationDetailModal({
  app,
  onClose,
}: {
  app: Application
  onClose: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[app.difficulty]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={cn(
        'relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6',
        theme === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-white'
      )}>
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
            theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-100'
          )}>
            {app.icon}
          </div>
          <div>
            <h2 className={cn(
              'text-2xl font-bold mb-2',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? app.nameZh : app.nameEn}
            </h2>
            <Badge color={difficulty.color}>
              {isZh ? difficulty.labelZh : difficulty.labelEn}
            </Badge>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <h3 className={cn(
            'text-sm font-semibold uppercase tracking-wider mb-2',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          )}>
            {isZh ? '概述' : 'Overview'}
          </h3>
          <p className={cn(
            'text-sm leading-relaxed',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {isZh ? app.summaryZh : app.summaryEn}
          </p>
        </div>

        {/* Principle */}
        <div className="mb-6">
          <h3 className={cn(
            'text-sm font-semibold uppercase tracking-wider mb-2',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          )}>
            {isZh ? '工作原理' : 'How It Works'}
          </h3>
          <p className={cn(
            'text-sm leading-relaxed',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {isZh ? app.principleZh : app.principleEn}
          </p>
        </div>

        {/* Examples */}
        <div className="mb-6">
          <h3 className={cn(
            'text-sm font-semibold uppercase tracking-wider mb-2',
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          )}>
            {isZh ? '应用实例' : 'Examples'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(isZh ? app.examplesZh : app.examplesEn).map((example, index) => (
              <span
                key={index}
                className={cn(
                  'px-3 py-1 rounded-full text-xs',
                  theme === 'dark' ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                )}
              >
                {example}
              </span>
            ))}
          </div>
        </div>

        {/* Fun Fact */}
        {app.funFact && (
          <div className={cn(
            'mb-6 p-4 rounded-lg border-l-4',
            theme === 'dark'
              ? 'bg-yellow-500/10 border-yellow-500'
              : 'bg-yellow-50 border-yellow-400'
          )}>
            <div className="flex items-start gap-2">
              <Lightbulb className={cn('w-5 h-5 flex-shrink-0 mt-0.5', theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600')} />
              <p className={cn(
                'text-sm',
                theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'
              )}>
                {isZh ? app.funFact.zh : app.funFact.en}
              </p>
            </div>
          </div>
        )}

        {/* References */}
        {app.references && app.references.length > 0 && (
          <div className="mb-6">
            <h3 className={cn(
              'text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2',
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            )}>
              <BookOpen className="w-4 h-4" />
              {isZh ? '参考文献' : 'References'}
            </h3>
            <div className="space-y-2">
              {app.references.map((ref, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-3 rounded-lg text-xs',
                    theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
                  )}
                >
                  <div className={cn(
                    'font-medium mb-1',
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  )}>
                    {ref.title}
                  </div>
                  <div className={cn(
                    'text-xs mb-1',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {ref.authors && <span>{ref.authors}. </span>}
                    {ref.journal && <span className="italic">{ref.journal}</span>}
                    {ref.year && <span> ({ref.year})</span>}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
                          theme === 'dark'
                            ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                            : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                        )}
                      >
                        <ExternalLink className="w-3 h-3" />
                        {isZh ? '链接' : 'Link'}
                      </a>
                    )}
                    {ref.doi && (
                      <a
                        href={`https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
                          theme === 'dark'
                            ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        )}
                      >
                        DOI
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Link to Demo */}
        {app.relatedDemo && (
          <Link
            to={`/demos?demo=${app.relatedDemo}`}
            className={cn(
              'flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-medium transition-colors',
              theme === 'dark'
                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
            )}
          >
            <Eye className="w-5 h-5" />
            {isZh ? '查看相关演示' : 'View Related Demo'}
          </Link>
        )}
      </div>
    </div>
  )
}

// Nature detail modal
function NatureDetailModal({
  phenomenon,
  onClose,
}: {
  phenomenon: NaturePhenomenon
  onClose: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={cn(
        'relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl p-6',
        theme === 'dark' ? 'bg-slate-900 border border-emerald-700/50' : 'bg-white'
      )}>
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
        <div className="text-center mb-6">
          <span className="text-5xl mb-3 block">{phenomenon.icon}</span>
          <h2 className={cn(
            'text-2xl font-bold mb-1',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? phenomenon.nameZh : phenomenon.nameEn}
          </h2>
          {phenomenon.species && (
            <p className={cn(
              'text-sm italic',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              {phenomenon.species}
            </p>
          )}
        </div>

        {/* Description */}
        <p className={cn(
          'text-sm leading-relaxed mb-6',
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        )}>
          {isZh ? phenomenon.descriptionZh : phenomenon.descriptionEn}
        </p>

        {/* Mechanism */}
        <div className="mb-6">
          <h3 className={cn(
            'text-sm font-semibold uppercase tracking-wider mb-2',
            theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
          )}>
            {isZh ? '偏振机制' : 'Polarization Mechanism'}
          </h3>
          <p className={cn(
            'text-sm leading-relaxed',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {isZh ? phenomenon.mechanism.zh : phenomenon.mechanism.en}
          </p>
        </div>

        {/* Fun Fact */}
        <div className={cn(
          'p-4 rounded-lg border-l-4',
          theme === 'dark'
            ? 'bg-emerald-500/10 border-emerald-500'
            : 'bg-emerald-50 border-emerald-400'
        )}>
          <div className="flex items-start gap-2">
            <Lightbulb className={cn('w-5 h-5 flex-shrink-0 mt-0.5', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')} />
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-emerald-300' : 'text-emerald-800'
            )}>
              {isZh ? phenomenon.funFact.zh : phenomenon.funFact.en}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ApplicationsPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [selectedCategory, setSelectedCategory] = useState<ApplicationCategory | 'all'>('all')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [selectedNature, setSelectedNature] = useState<NaturePhenomenon | null>(null)

  // Filter applications
  const filteredApps = selectedCategory === 'all' || selectedCategory === 'nature'
    ? APPLICATIONS.filter(app => selectedCategory === 'all' || app.category === selectedCategory)
    : APPLICATIONS.filter(app => app.category === selectedCategory)

  const showNatureSection = selectedCategory === 'all' || selectedCategory === 'nature'

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
                  {isZh ? '偏振应用图鉴' : 'Polarization Applications'}
                </h1>
                <p className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {isZh ? '现实场景 × 原理解析' : 'Real-World Scenes × Principle Analysis'}
                </p>
              </div>
            </div>
            <LanguageThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === 'all'
                ? theme === 'dark'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  : 'bg-amber-100 text-amber-700 border border-amber-300'
                : theme === 'dark'
                  ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            )}
          >
            {isZh ? '全部' : 'All'}
          </button>
          {CATEGORIES.map(category => {
            const CategoryIcon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2',
                  selectedCategory === category.id
                    ? theme === 'dark'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                      : 'bg-amber-100 text-amber-700 border border-amber-300'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
              >
                <CategoryIcon className="w-4 h-4" />
                {isZh ? category.labelZh : category.labelEn}
              </button>
            )
          })}
        </div>

        {/* Applications Grid */}
        {filteredApps.length > 0 && selectedCategory !== 'nature' && (
          <>
            <h2 className={cn(
              'text-lg font-semibold mb-4',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {isZh ? '应用案例' : 'Application Cases'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {filteredApps.map(app => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  onClick={() => setSelectedApp(app)}
                />
              ))}
            </div>
          </>
        )}

        {/* Nature Section (Sub-module) */}
        {showNatureSection && (
          <div className={cn(
            'rounded-2xl border p-6',
            theme === 'dark' ? 'bg-emerald-900/10 border-emerald-700/30' : 'bg-emerald-50/50 border-emerald-200'
          )}>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'
              )}>
                <Leaf className={cn('w-6 h-6', theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600')} />
              </div>
              <div>
                <h2 className={cn(
                  'text-lg font-semibold',
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  {isZh ? '自然界中的偏振' : 'Polarization in Nature'}
                </h2>
                <p className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {isZh ? '动物、天象与生物偏振' : 'Animals, Sky Phenomena & Bio-polarization'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {NATURE_PHENOMENA.map(phenomenon => (
                <NatureCard
                  key={phenomenon.id}
                  phenomenon={phenomenon}
                  onClick={() => setSelectedNature(phenomenon)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Application Detail Modal */}
      {selectedApp && (
        <ApplicationDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}

      {/* Nature Detail Modal */}
      {selectedNature && (
        <NatureDetailModal
          phenomenon={selectedNature}
          onClose={() => setSelectedNature(null)}
        />
      )}
    </div>
  )
}
