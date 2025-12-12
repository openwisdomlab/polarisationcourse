/**
 * Experiments Page - DIY Polarization Experiments Handbook
 * 偏振实验手册 - DIY × 家庭实验
 *
 * Low-cost, hands-on experiments using everyday materials:
 * - Phone screen + polarizer experiments
 * - Tape birefringence art
 * - Sugar solution optical rotation
 * - Stress patterns in plastics
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { LanguageThemeSwitcher } from '@/components/ui/LanguageThemeSwitcher'
import { Badge } from '@/components/shared'
import {
  Home, Beaker, Clock, DollarSign, AlertTriangle, ChevronRight,
  CheckCircle2, Star, Lightbulb, Camera, X,
  ShoppingBag, Eye, GraduationCap
} from 'lucide-react'

// Experiment difficulty and cost levels
type Difficulty = 'easy' | 'medium' | 'hard'
type CostLevel = 'free' | 'low' | 'medium'

// Experiment data interface
interface Experiment {
  id: string
  nameEn: string
  nameZh: string
  descriptionEn: string
  descriptionZh: string
  difficulty: Difficulty
  duration: number // minutes
  cost: CostLevel
  materials: {
    en: string[]
    zh: string[]
  }
  steps: {
    en: string[]
    zh: string[]
  }
  scienceEn: string
  scienceZh: string
  tips?: {
    en: string[]
    zh: string[]
  }
  safetyNotes?: {
    en: string[]
    zh: string[]
  }
  tags: string[]
  relatedDemo?: string
  photoIdeas?: {
    en: string[]
    zh: string[]
  }
}

// Experiments catalog
const EXPERIMENTS: Experiment[] = [
  {
    id: 'phone-polarizer',
    nameEn: 'Phone Screen Polarizer Magic',
    nameZh: '手机屏幕偏振魔法',
    descriptionEn: 'Discover polarization using your smartphone screen and a polarizing filter.',
    descriptionZh: '使用智能手机屏幕和偏振片发现偏振光。',
    difficulty: 'easy',
    duration: 10,
    cost: 'low',
    materials: {
      en: [
        'Smartphone with LCD screen',
        'Polarizing film or sunglasses (polarized)',
        'Optional: Second polarizing film',
      ],
      zh: [
        '带LCD屏幕的智能手机',
        '偏振片薄膜或偏振太阳镜',
        '可选：第二片偏振薄膜',
      ],
    },
    steps: {
      en: [
        'Turn on your phone\'s flashlight or display a white screen',
        'Hold the polarizing filter in front of the screen',
        'Slowly rotate the filter while watching the screen',
        'Notice how the screen darkens and brightens as you rotate',
        'At 90° rotation, the screen should appear nearly black',
        'Try looking at other LCD screens (monitors, watches) through the polarizer',
      ],
      zh: [
        '打开手机的手电筒或显示白色屏幕',
        '将偏振片放在屏幕前面',
        '缓慢旋转滤片同时观察屏幕',
        '注意随着旋转屏幕如何变暗和变亮',
        '旋转到90°时，屏幕应该几乎变黑',
        '尝试通过偏振片观看其他LCD屏幕（显示器、手表）',
      ],
    },
    scienceEn: 'LCD screens emit polarized light. The front polarizer of an LCD is oriented to transmit this light to your eyes. When you add an external polarizer and rotate it, you\'re applying Malus\'s Law: I = I₀ cos²θ. At 90°, almost no light passes through.',
    scienceZh: 'LCD屏幕发出偏振光。LCD的前偏振片定向以将此光传输到你的眼睛。当你添加外部偏振片并旋转它时，你正在应用马吕斯定律：I = I₀ cos²θ。在90°时，几乎没有光通过。',
    tips: {
      en: [
        'OLED screens work differently - try both types!',
        'The effect is more dramatic in a dark room',
        'Try tilting your head while wearing polarized sunglasses to see car dashboard screens dim',
      ],
      zh: [
        'OLED屏幕工作原理不同 - 两种都试试！',
        '在暗室中效果更明显',
        '戴着偏振太阳镜歪头试试看汽车仪表盘屏幕变暗',
      ],
    },
    tags: ['malus-law', 'lcd', 'beginner-friendly'],
    relatedDemo: 'malus',
    photoIdeas: {
      en: [
        'Capture the screen at different rotation angles',
        'Show a "split" view with half bright, half dark',
      ],
      zh: [
        '在不同旋转角度拍摄屏幕',
        '展示一半亮一半暗的"分割"视图',
      ],
    },
  },
  {
    id: 'tape-art',
    nameEn: 'Tape Birefringence Art',
    nameZh: '胶带双折射艺术',
    descriptionEn: 'Create stunning colorful patterns using transparent tape between polarizers.',
    descriptionZh: '使用透明胶带在偏振片之间创造令人惊叹的彩色图案。',
    difficulty: 'easy',
    duration: 20,
    cost: 'low',
    materials: {
      en: [
        'Clear cellophane tape (Scotch tape)',
        'Two polarizing films',
        'Glass slide or clear plastic sheet',
        'Light source (phone screen or lamp)',
        'Scissors',
      ],
      zh: [
        '透明玻璃纸胶带（透明胶带）',
        '两片偏振薄膜',
        '玻璃片或透明塑料片',
        '光源（手机屏幕或台灯）',
        '剪刀',
      ],
    },
    steps: {
      en: [
        'Cut and layer pieces of tape on the glass slide in patterns',
        'Overlap tape pieces at different angles for variety',
        'Place one polarizer under the slide, one above',
        'Illuminate from below (phone screen works great)',
        'Rotate the top polarizer to see colors change',
        'Add more tape layers to create new colors',
      ],
      zh: [
        '将胶带剪成片并以图案形式层叠在玻璃片上',
        '以不同角度重叠胶带片以增加变化',
        '在玻璃片下放一个偏振片，上面放另一个',
        '从下方照明（手机屏幕效果很好）',
        '旋转顶部偏振片观看颜色变化',
        '添加更多胶带层以创造新颜色',
      ],
    },
    scienceEn: 'Cellophane tape is birefringent - it has different refractive indices for different polarization directions. When polarized light passes through, the two components travel at different speeds, creating a phase difference. Between crossed polarizers, this phase difference converts to visible colors depending on tape thickness and orientation.',
    scienceZh: '玻璃纸胶带具有双折射性 - 对不同偏振方向有不同的折射率。当偏振光通过时，两个分量以不同速度传播，产生相位差。在正交偏振片之间，这种相位差根据胶带厚度和取向转换为可见颜色。',
    tips: {
      en: [
        'Different tape brands have different birefringence - experiment!',
        'Multiple layers create different colors',
        'Try stretching tape for different effects',
        'This makes great wall art when backlit',
      ],
      zh: [
        '不同品牌的胶带有不同的双折射性 - 多试试！',
        '多层产生不同颜色',
        '试试拉伸胶带获得不同效果',
        '背光照射时可以做成很棒的墙面艺术',
      ],
    },
    tags: ['birefringence', 'art', 'beginner-friendly'],
    relatedDemo: 'chromatic',
    photoIdeas: {
      en: [
        'Create abstract geometric patterns',
        'Make a "stained glass" window effect',
        'Document color changes as you rotate the analyzer',
      ],
      zh: [
        '创建抽象几何图案',
        '制作"彩色玻璃"窗效果',
        '记录旋转检偏器时的颜色变化',
      ],
    },
  },
  {
    id: 'sugar-rotation',
    nameEn: 'Sugar Solution Optical Rotation',
    nameZh: '糖溶液旋光实验',
    descriptionEn: 'Watch polarization rotate as light passes through sugar water.',
    descriptionZh: '观察光通过糖水时偏振方向的旋转。',
    difficulty: 'medium',
    duration: 30,
    cost: 'low',
    materials: {
      en: [
        'Clear container (glass or plastic tube/jar)',
        'Sugar (table sugar or corn syrup works best)',
        'Water',
        'Two polarizing films',
        'Bright light source',
        'Measuring spoons',
      ],
      zh: [
        '透明容器（玻璃或塑料管/罐）',
        '糖（食用糖或玉米糖浆效果最佳）',
        '水',
        '两片偏振薄膜',
        '明亮光源',
        '量匙',
      ],
    },
    steps: {
      en: [
        'Dissolve sugar in water to make a concentrated solution (more is better)',
        'Pour into clear container',
        'Set up polarizer - container - analyzer arrangement',
        'Shine light through and observe through the analyzer',
        'Rotate the analyzer to find the extinction position',
        'Note how much rotation is needed compared to pure water',
        'Try different sugar concentrations and compare',
      ],
      zh: [
        '将糖溶于水制成浓溶液（越浓越好）',
        '倒入透明容器',
        '设置起偏器 - 容器 - 检偏器排列',
        '让光通过并通过检偏器观察',
        '旋转检偏器找到消光位置',
        '注意与纯水相比需要旋转多少',
        '尝试不同糖浓度并比较',
      ],
    },
    scienceEn: 'Sugar molecules are chiral (asymmetric). When polarized light passes through, the electric field interacts differently with left and right-handed molecular orientations, causing the polarization plane to rotate. The rotation angle is proportional to concentration and path length: α = [α]·c·l.',
    scienceZh: '糖分子是手性的（不对称的）。当偏振光通过时，电场与左旋和右旋分子取向的相互作用不同，导致偏振平面旋转。旋转角度与浓度和光程成正比：α = [α]·c·l。',
    tips: {
      en: [
        'Corn syrup is more concentrated and shows stronger rotation',
        'Use a longer container for more noticeable effect',
        'This is exactly how polarimeters measure sugar content in industry',
        'Try honey - it also rotates polarization!',
      ],
      zh: [
        '玉米糖浆浓度更高，显示更强的旋转',
        '使用更长的容器以获得更明显的效果',
        '这正是工业中偏振计测量糖含量的原理',
        '试试蜂蜜 - 它也能旋转偏振！',
      ],
    },
    tags: ['optical-activity', 'chemistry'],
    relatedDemo: 'optical-rotation',
    photoIdeas: {
      en: [
        'Show side-by-side comparison of water vs sugar solution',
        'Demonstrate color changes with white light source',
      ],
      zh: [
        '展示水与糖溶液的并排比较',
        '用白光光源演示颜色变化',
      ],
    },
  },
  {
    id: 'plastic-stress',
    nameEn: 'Stress Patterns in Plastics',
    nameZh: '塑料应力图案',
    descriptionEn: 'Reveal hidden stress in everyday plastic objects using crossed polarizers.',
    descriptionZh: '使用正交偏振片揭示日常塑料物品中的隐藏应力。',
    difficulty: 'easy',
    duration: 15,
    cost: 'low',
    materials: {
      en: [
        'Clear plastic objects (CD cases, rulers, utensils, bottles)',
        'Two polarizing films',
        'Light source',
        'Optional: Clear plastic items you can bend',
      ],
      zh: [
        '透明塑料物品（CD盒、尺子、餐具、瓶子）',
        '两片偏振薄膜',
        '光源',
        '可选：可以弯曲的透明塑料物品',
      ],
    },
    steps: {
      en: [
        'Set up crossed polarizers (rotate until nearly black)',
        'Place plastic object between the polarizers',
        'Look for colorful patterns - these show internal stress',
        'Try bending the plastic and watch stress patterns change',
        'Compare injection molded items vs extruded items',
        'Look at plastic forks - the tines often show stress',
      ],
      zh: [
        '设置正交偏振片（旋转直到几乎变黑）',
        '将塑料物品放在偏振片之间',
        '寻找彩色图案 - 这些显示内部应力',
        '尝试弯曲塑料并观察应力图案变化',
        '比较注塑成型与挤出成型的物品',
        '看看塑料叉子 - 叉齿通常显示应力',
      ],
    },
    scienceEn: 'When plastic is stressed (during manufacturing or bending), it becomes birefringent. Different stress levels create different amounts of phase retardation, which appears as different colors between crossed polarizers. The color sequence follows the Michel-Lévy chart.',
    scienceZh: '当塑料受力（在制造或弯曲过程中）时，它变得具有双折射性。不同的应力水平产生不同量的相位延迟，在正交偏振片之间显示为不同颜色。颜色序列遵循米歇尔-列维图表。',
    tips: {
      en: [
        'CD jewel cases are great - they have complex molding patterns',
        'Try warming and cooling plastic to see stress changes',
        'This technique is used by engineers to design stronger parts',
        'Car windshields show stress patterns too!',
      ],
      zh: [
        'CD盒效果很好 - 它们有复杂的成型图案',
        '尝试加热和冷却塑料以观察应力变化',
        '工程师使用这种技术来设计更强的部件',
        '汽车挡风玻璃也会显示应力图案！',
      ],
    },
    safetyNotes: {
      en: ['Be careful not to break plastic items while bending'],
      zh: ['弯曲时注意不要折断塑料物品'],
    },
    tags: ['stress', 'birefringence', 'engineering'],
    relatedDemo: 'anisotropy',
    photoIdeas: {
      en: [
        'Document stress rainbow in CD cases',
        'Show real-time stress as you bend a ruler',
      ],
      zh: [
        '记录CD盒中的应力彩虹',
        '展示弯曲尺子时的实时应力',
      ],
    },
  },
  {
    id: 'sky-polarization',
    nameEn: 'Sky Polarization Mapping',
    nameZh: '天空偏振观测',
    descriptionEn: 'Observe and map the polarization pattern in the sky.',
    descriptionZh: '观察并绘制天空中的偏振图案。',
    difficulty: 'medium',
    duration: 30,
    cost: 'free',
    materials: {
      en: [
        'Polarizing sunglasses or polarizing film',
        'Clear sky day (best at sunrise/sunset)',
        'Notebook for recording observations',
        'Compass (optional, for orientation)',
      ],
      zh: [
        '偏振太阳镜或偏振薄膜',
        '晴朗的天气（日出/日落时最佳）',
        '记录观察的笔记本',
        '指南针（可选，用于定向）',
      ],
    },
    steps: {
      en: [
        'Go outside on a clear day, preferably morning or evening',
        'Look at different parts of the sky through the polarizer',
        'Rotate the polarizer while looking at each direction',
        'Note where the sky darkens most (90° from sun)',
        'Map out the polarization pattern across the sky',
        'Try looking at clouds - they depolarize the light',
        'Compare polarization at different times of day',
      ],
      zh: [
        '在晴朗的日子外出，最好是早晨或傍晚',
        '通过偏振片观察天空的不同部分',
        '在观察每个方向时旋转偏振片',
        '注意天空在哪里变暗最多（距太阳90°）',
        '绘制整个天空的偏振图案',
        '尝试观察云层 - 它们使光去偏振',
        '比较一天中不同时间的偏振',
      ],
    },
    scienceEn: 'Sunlight scattered by air molecules (Rayleigh scattering) becomes polarized perpendicular to the scattering plane. Maximum polarization occurs at 90° from the sun. This pattern is how bees and many other animals navigate!',
    scienceZh: '被空气分子散射的阳光（瑞利散射）变成垂直于散射平面的偏振光。最大偏振度出现在距太阳90°处。这个图案就是蜜蜂和许多其他动物导航的方式！',
    tips: {
      en: [
        'The effect is strongest in a direction 90° from the sun',
        'Clouds and haze reduce polarization',
        'Try this at the beach - reflected light is also polarized',
        'Photographers use this effect to darken blue skies',
      ],
      zh: [
        '在距太阳90°的方向效果最强',
        '云和雾霾会减少偏振',
        '在海滩试试 - 反射光也是偏振的',
        '摄影师利用这一效果使蓝天更深沉',
      ],
    },
    tags: ['rayleigh', 'nature', 'navigation'],
    relatedDemo: 'rayleigh',
    photoIdeas: {
      en: [
        'Take photos of sky with and without polarizer',
        'Create a panorama showing polarization gradient',
      ],
      zh: [
        '拍摄有无偏振片的天空照片',
        '创建显示偏振梯度的全景图',
      ],
    },
  },
  {
    id: 'reflection-angle',
    nameEn: 'Brewster\'s Angle Discovery',
    nameZh: '布儒斯特角发现',
    descriptionEn: 'Find the angle where reflected light becomes perfectly polarized.',
    descriptionZh: '找到反射光变成完全偏振的角度。',
    difficulty: 'medium',
    duration: 25,
    cost: 'low',
    materials: {
      en: [
        'Flat glass surface (window, glass table, mirror)',
        'Polarizing film',
        'Light source (flashlight)',
        'Protractor (optional)',
        'Dark background',
      ],
      zh: [
        '平坦玻璃表面（窗户、玻璃桌、镜子）',
        '偏振薄膜',
        '光源（手电筒）',
        '量角器（可选）',
        '深色背景',
      ],
    },
    steps: {
      en: [
        'Shine light onto glass surface at various angles',
        'View the reflected light through the polarizer',
        'Rotate the polarizer while adjusting the viewing angle',
        'Find the angle where rotating the polarizer makes reflection disappear',
        'This is Brewster\'s angle (about 56° for glass)',
        'The reflected light at this angle is completely polarized',
        'Measure the angle with a protractor if possible',
      ],
      zh: [
        '以各种角度将光照射到玻璃表面',
        '通过偏振片观察反射光',
        '在调整观察角度的同时旋转偏振片',
        '找到旋转偏振片可使反射消失的角度',
        '这就是布儒斯特角（玻璃约为56°）',
        '在此角度反射光完全偏振',
        '如果可能，用量角器测量角度',
      ],
    },
    scienceEn: 'At Brewster\'s angle, the reflected and refracted rays are perpendicular. At this angle, the p-polarized light (in the plane of incidence) cannot be reflected because dipoles cannot radiate along their axis. Only s-polarized light reflects, making it 100% polarized.',
    scienceZh: '在布儒斯特角，反射光线和折射光线垂直。在此角度，p偏振光（在入射平面内）无法反射，因为偶极子无法沿其轴向辐射。只有s偏振光反射，使其100%偏振。',
    tips: {
      en: [
        'A calm water surface works too - Brewster\'s angle for water is about 53°',
        'This is why polarizing sunglasses reduce glare from roads and water',
        'Try finding Brewster\'s angle for different materials',
        'The angle reveals the refractive index: tan(θ_B) = n',
      ],
      zh: [
        '平静的水面也可以 - 水的布儒斯特角约为53°',
        '这就是偏振太阳镜减少路面和水面眩光的原因',
        '尝试找到不同材料的布儒斯特角',
        '角度揭示折射率：tan(θ_B) = n',
      ],
    },
    tags: ['brewster', 'reflection', 'optics'],
    relatedDemo: 'brewster',
    photoIdeas: {
      en: [
        'Show reflection before and after at Brewster\'s angle',
        'Compare polarization of reflections at different angles',
      ],
      zh: [
        '展示布儒斯特角前后的反射',
        '比较不同角度反射的偏振',
      ],
    },
  },
  {
    id: 'lcd-teardown',
    nameEn: 'LCD Screen Teardown',
    nameZh: 'LCD屏幕拆解',
    descriptionEn: 'Understand how LCD displays work by extracting polarizers from old screens.',
    descriptionZh: '通过从旧屏幕中提取偏振片来了解LCD显示器的工作原理。',
    difficulty: 'hard',
    duration: 45,
    cost: 'free',
    materials: {
      en: [
        'Old/broken LCD device (calculator, phone, monitor)',
        'Small screwdriver set',
        'Tweezers',
        'Heat gun or hair dryer (optional)',
        'Safety glasses',
        'Work gloves',
      ],
      zh: [
        '旧/坏的LCD设备（计算器、手机、显示器）',
        '小型螺丝刀套装',
        '镊子',
        '热风枪或吹风机（可选）',
        '安全眼镜',
        '工作手套',
      ],
    },
    steps: {
      en: [
        'Disassemble the device carefully to expose the LCD panel',
        'Locate the polarizing films (front and back of LCD)',
        'Carefully peel off the polarizing films (heat helps loosen adhesive)',
        'You now have two polarizers you can use for experiments!',
        'Look at the LCD without polarizers - you\'ll see it looks gray',
        'Place one polarizer back and watch the display work partially',
        'Examine the liquid crystal layer if visible',
      ],
      zh: [
        '小心拆卸设备以露出LCD面板',
        '找到偏振薄膜（LCD的前后两面）',
        '小心剥离偏振薄膜（加热有助于松开粘合剂）',
        '现在你有两个可用于实验的偏振片了！',
        '观察没有偏振片的LCD - 你会看到它呈灰色',
        '放回一个偏振片，观察显示屏部分工作',
        '如果可见，检查液晶层',
      ],
    },
    scienceEn: 'LCDs use two polarizers at 90° (crossed). The liquid crystal layer rotates polarization when no voltage is applied, allowing light through. Voltage straightens the crystals, blocking light. Each pixel is a tiny polarization modulator!',
    scienceZh: 'LCD使用两个90°（正交）的偏振片。无电压时液晶层旋转偏振，允许光通过。电压使晶体伸直，阻挡光线。每个像素都是一个微小的偏振调制器！',
    tips: {
      en: [
        'Old calculators are easiest to start with',
        'Polarizers from monitors are larger and better quality',
        'The extracted polarizers are great for other experiments',
        'Handle carefully - the films can tear easily',
      ],
      zh: [
        '旧计算器最容易开始',
        '显示器的偏振片更大质量更好',
        '提取的偏振片非常适合其他实验',
        '小心处理 - 薄膜容易撕裂',
      ],
    },
    safetyNotes: {
      en: [
        'Wear safety glasses when disassembling',
        'Be careful of sharp edges and broken glass',
        'Some displays contain hazardous materials - research first',
        'Unplug and discharge devices before disassembly',
      ],
      zh: [
        '拆卸时佩戴安全眼镜',
        '小心锋利边缘和碎玻璃',
        '某些显示器含有有害物质 - 先研究',
        '拆卸前拔掉电源并放电',
      ],
    },
    tags: ['lcd', 'electronics', 'recycling'],
    photoIdeas: {
      en: [
        'Document each layer as you disassemble',
        'Show the LCD with and without polarizers',
      ],
      zh: [
        '记录拆卸时的每一层',
        '展示有无偏振片的LCD',
      ],
    },
  },
]

const DIFFICULTY_CONFIG = {
  easy: { labelEn: 'Easy', labelZh: '简单', color: 'green' as const, icon: '🌱' },
  medium: { labelEn: 'Medium', labelZh: '中等', color: 'yellow' as const, icon: '🌿' },
  hard: { labelEn: 'Hard', labelZh: '困难', color: 'red' as const, icon: '🌳' },
}

const COST_CONFIG = {
  free: { labelEn: 'Free', labelZh: '免费', icon: '✓' },
  low: { labelEn: '$', labelZh: '低成本', icon: '$' },
  medium: { labelEn: '$$', labelZh: '中等成本', icon: '$$' },
}

// Experiment card component
function ExperimentCard({
  experiment,
  onClick,
}: {
  experiment: Experiment
  onClick: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[experiment.difficulty]
  const cost = COST_CONFIG[experiment.cost]

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border p-4 cursor-pointer transition-all',
        'hover:-translate-y-1 hover:shadow-lg',
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700 hover:border-teal-500/50'
          : 'bg-white border-gray-200 hover:border-teal-400'
      )}
    >
      {/* Title and badges */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className={cn(
          'font-semibold flex-1',
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        )}>
          {isZh ? experiment.nameZh : experiment.nameEn}
        </h3>
        <Badge color={difficulty.color} size="sm">
          {difficulty.icon}
        </Badge>
      </div>

      {/* Description */}
      <p className={cn(
        'text-sm line-clamp-2 mb-3',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      )}>
        {isZh ? experiment.descriptionZh : experiment.descriptionEn}
      </p>

      {/* Meta info */}
      <div className="flex items-center gap-3 text-xs">
        <span className={cn(
          'flex items-center gap-1',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>
          <Clock className="w-3.5 h-3.5" />
          {experiment.duration} min
        </span>
        <span className={cn(
          'flex items-center gap-1',
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        )}>
          <DollarSign className="w-3.5 h-3.5" />
          {cost.icon}
        </span>
      </div>

      {/* View button */}
      <div className={cn(
        'mt-3 flex items-center gap-1 text-sm font-medium',
        theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
      )}>
        <span>{isZh ? '查看实验' : 'View Experiment'}</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  )
}

// Experiment detail modal
function ExperimentDetailModal({
  experiment,
  onClose,
}: {
  experiment: Experiment
  onClose: () => void
}) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const difficulty = DIFFICULTY_CONFIG[experiment.difficulty]
  const cost = COST_CONFIG[experiment.cost]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={cn(
        'relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl',
        theme === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-white'
      )}>
        {/* Header */}
        <div className={cn(
          'sticky top-0 p-6 border-b z-10',
          theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
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

          <h2 className={cn(
            'text-2xl font-bold mb-2 pr-8',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? experiment.nameZh : experiment.nameEn}
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge color={difficulty.color}>
              {isZh ? difficulty.labelZh : difficulty.labelEn}
            </Badge>
            <span className={cn(
              'flex items-center gap-1 text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              <Clock className="w-4 h-4" />
              {experiment.duration} {isZh ? '分钟' : 'min'}
            </span>
            <span className={cn(
              'flex items-center gap-1 text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              <ShoppingBag className="w-4 h-4" />
              {isZh ? cost.labelZh : cost.labelEn}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Materials */}
          <div>
            <h3 className={cn(
              'text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2',
              theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
            )}>
              <ShoppingBag className="w-4 h-4" />
              {isZh ? '所需材料' : 'Materials Needed'}
            </h3>
            <ul className="space-y-2">
              {(isZh ? experiment.materials.zh : experiment.materials.en).map((material, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className={cn(
                    'w-4 h-4 mt-0.5 flex-shrink-0',
                    theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                  )} />
                  <span className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    {material}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Notes */}
          {experiment.safetyNotes && (
            <div className={cn(
              'p-4 rounded-lg border-l-4',
              theme === 'dark'
                ? 'bg-red-500/10 border-red-500'
                : 'bg-red-50 border-red-400'
            )}>
              <div className="flex items-start gap-2">
                <AlertTriangle className={cn(
                  'w-5 h-5 flex-shrink-0',
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                )} />
                <div>
                  <h4 className={cn(
                    'text-sm font-semibold mb-1',
                    theme === 'dark' ? 'text-red-400' : 'text-red-700'
                  )}>
                    {isZh ? '安全注意事项' : 'Safety Notes'}
                  </h4>
                  <ul className="space-y-1">
                    {(isZh ? experiment.safetyNotes.zh : experiment.safetyNotes.en).map((note, index) => (
                      <li key={index} className={cn(
                        'text-sm',
                        theme === 'dark' ? 'text-red-300' : 'text-red-800'
                      )}>
                        • {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Steps */}
          <div>
            <h3 className={cn(
              'text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2',
              theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
            )}>
              <Beaker className="w-4 h-4" />
              {isZh ? '实验步骤' : 'Steps'}
            </h3>
            <ol className="space-y-3">
              {(isZh ? experiment.steps.zh : experiment.steps.en).map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                    theme === 'dark'
                      ? 'bg-teal-500/20 text-teal-400'
                      : 'bg-teal-100 text-teal-700'
                  )}>
                    {index + 1}
                  </span>
                  <span className={cn(
                    'text-sm pt-0.5',
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Science */}
          <div className={cn(
            'p-4 rounded-lg',
            theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
          )}>
            <h3 className={cn(
              'text-sm font-semibold mb-2 flex items-center gap-2',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )}>
              <GraduationCap className="w-4 h-4" />
              {isZh ? '科学原理' : 'The Science'}
            </h3>
            <p className={cn(
              'text-sm leading-relaxed',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              {isZh ? experiment.scienceZh : experiment.scienceEn}
            </p>
          </div>

          {/* Tips */}
          {experiment.tips && (
            <div>
              <h3 className={cn(
                'text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2',
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
              )}>
                <Lightbulb className="w-4 h-4" />
                {isZh ? '小贴士' : 'Tips & Tricks'}
              </h3>
              <ul className="space-y-2">
                {(isZh ? experiment.tips.zh : experiment.tips.en).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Star className={cn(
                      'w-4 h-4 mt-0.5 flex-shrink-0',
                      theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                    )} />
                    <span className={cn(
                      'text-sm',
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    )}>
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Photo Ideas */}
          {experiment.photoIdeas && (
            <div>
              <h3 className={cn(
                'text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2',
                theme === 'dark' ? 'text-rose-400' : 'text-rose-600'
              )}>
                <Camera className="w-4 h-4" />
                {isZh ? '拍照创意' : 'Photo Ideas'}
              </h3>
              <ul className="space-y-1">
                {(isZh ? experiment.photoIdeas.zh : experiment.photoIdeas.en).map((idea, index) => (
                  <li key={index} className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    📸 {idea}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Demo */}
          {experiment.relatedDemo && (
            <Link
              to={`/demos?demo=${experiment.relatedDemo}`}
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
    </div>
  )
}

export function ExperimentsPage() {
  const { i18n } = useTranslation()
  const { theme } = useTheme()
  const isZh = i18n.language === 'zh'

  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null)
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'all'>('all')

  // Filter experiments
  const filteredExperiments = filterDifficulty === 'all'
    ? EXPERIMENTS
    : EXPERIMENTS.filter(exp => exp.difficulty === filterDifficulty)

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
                  {isZh ? '偏振实验手册' : 'DIY Experiments'}
                </h1>
                <p className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {isZh ? 'DIY × 家庭实验' : 'Hands-on × Home Experiments'}
                </p>
              </div>
            </div>
            <LanguageThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Intro Banner */}
        <div className={cn(
          'rounded-2xl p-6 mb-8 border',
          theme === 'dark'
            ? 'bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border-teal-700/30'
            : 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200'
        )}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0',
              theme === 'dark' ? 'bg-teal-500/20' : 'bg-teal-100'
            )}>
              <Beaker className={cn('w-7 h-7', theme === 'dark' ? 'text-teal-400' : 'text-teal-600')} />
            </div>
            <div className="flex-1">
              <h2 className={cn(
                'text-lg font-semibold mb-1',
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {isZh ? '用身边材料探索偏振光的奥秘' : 'Explore Polarization with Everyday Materials'}
              </h2>
              <p className={cn(
                'text-sm',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh
                  ? '这些实验使用手机、胶带、塑料等日常物品，无需昂贵设备即可在家体验偏振光的魅力。'
                  : 'These experiments use phones, tape, plastic and other household items. No expensive equipment needed!'}
              </p>
            </div>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterDifficulty('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              filterDifficulty === 'all'
                ? theme === 'dark'
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50'
                  : 'bg-teal-100 text-teal-700 border border-teal-300'
                : theme === 'dark'
                  ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
            )}
          >
            {isZh ? '全部' : 'All'}
          </button>
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => {
            const config = DIFFICULTY_CONFIG[diff]
            return (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1',
                  filterDifficulty === diff
                    ? theme === 'dark'
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50'
                      : 'bg-teal-100 text-teal-700 border border-teal-300'
                    : theme === 'dark'
                      ? 'bg-slate-800 text-gray-400 hover:text-gray-200'
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
              >
                <span>{config.icon}</span>
                {isZh ? config.labelZh : config.labelEn}
              </button>
            )
          })}
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExperiments.map(experiment => (
            <ExperimentCard
              key={experiment.id}
              experiment={experiment}
              onClick={() => setSelectedExperiment(experiment)}
            />
          ))}
        </div>

        {/* Getting Started Section */}
        <div className={cn(
          'mt-12 rounded-2xl border p-6',
          theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-gray-200'
        )}>
          <h3 className={cn(
            'text-lg font-semibold mb-4',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '如何获取偏振片？' : 'Where to Get Polarizers?'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={cn(
              'p-4 rounded-lg',
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
            )}>
              <span className="text-2xl mb-2 block">🕶️</span>
              <h4 className={cn('font-medium mb-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {isZh ? '偏振太阳镜' : 'Polarized Sunglasses'}
              </h4>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '便宜的偏振太阳镜可以直接使用' : 'Cheap polarized sunglasses work great'}
              </p>
            </div>
            <div className={cn(
              'p-4 rounded-lg',
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
            )}>
              <span className="text-2xl mb-2 block">🖥️</span>
              <h4 className={cn('font-medium mb-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {isZh ? '旧LCD屏幕' : 'Old LCD Screens'}
              </h4>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '从废旧计算器或显示器中取出' : 'Extract from old calculators or monitors'}
              </p>
            </div>
            <div className={cn(
              'p-4 rounded-lg',
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'
            )}>
              <span className="text-2xl mb-2 block">🛒</span>
              <h4 className={cn('font-medium mb-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {isZh ? '网上购买' : 'Buy Online'}
              </h4>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '淘宝搜索"偏振片"，价格很便宜' : 'Search for "polarizing film" - very affordable'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Experiment Detail Modal */}
      {selectedExperiment && (
        <ExperimentDetailModal
          experiment={selectedExperiment}
          onClose={() => setSelectedExperiment(null)}
        />
      )}
    </div>
  )
}
