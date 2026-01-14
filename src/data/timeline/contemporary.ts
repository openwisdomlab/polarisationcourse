/**
 * Timeline Events: Contemporary Era (2001-2023)
 * 当代时代 (2001-2023)
 *
 * Metasurfaces, quantum optics, and biomedical applications
 */

import type { TimelineEvent } from './types'

export const CONTEMPORARY_EVENTS: TimelineEvent[] = [
  {
    year: 2009,
    titleEn: 'RealD 3D Cinema',
    titleZh: 'RealD 3D 电影',
    descriptionEn: 'RealD 3D technology uses circular polarization to create immersive 3D movie experiences, bringing polarization science to millions of moviegoers.',
    descriptionZh: 'RealD 3D技术使用圆偏振创造沉浸式3D电影体验，将偏振科学带给数百万电影观众。',
    category: 'discovery',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Uses circularly polarized light (left-handed for one eye, right-handed for other)',
        'Circular polarization maintains 3D effect even when viewer tilts head',
        'Previous linear polarization systems failed if viewers tilted their heads',
        'Special silver screen preserves polarization upon reflection',
        'Passive glasses filter each eye\'s image using circular polarizer + quarter-wave film',
        'Avatar (2009) popularized the technology worldwide',
        'Now installed in over 30,000 theaters globally'
      ],
      zh: [
        '使用圆偏振光（一只眼睛左旋，另一只眼睛右旋）',
        '圆偏振即使观众倾斜头部也能保持3D效果',
        '之前的线偏振系统在观众倾斜头部时会失效',
        '特殊的银幕能在反射时保持偏振',
        '被动式眼镜使用圆偏振片+四分之一波片过滤每只眼睛的图像',
        '《阿凡达》（2009）使这项技术在全球普及',
        '现已在全球超过30,000家影院安装'
      ]
    },
    story: {
      en: `In 2009, James Cameron's "Avatar" transported audiences to a luminescent alien world — and polarization made it possible.

The challenge of 3D cinema had frustrated engineers for decades. You needed to show each eye a slightly different image to create depth perception. Early systems used red-blue glasses (anaglyph), which distorted colors. Later linear polarization systems worked better but had a fatal flaw: tilt your head, and the 3D effect collapsed.

RealD's breakthrough was circular polarization. Instead of filtering by angle (like linear polarizers), the system used left-handed and right-handed circular polarization for the two eyes. The genius was that circular polarization doesn't change when you rotate your head — the handedness stays the same.

The projector rapidly alternates between left-circular and right-circular polarized frames. Special glasses — each lens containing a quarter-wave plate and linear polarizer tuned for opposite handedness — ensure each eye sees only its intended image.

Avatar's spectacular success (the first film to gross over $2 billion) introduced millions to the magic of polarization. Audiences around the world, wearing lightweight polarizing glasses, experienced depth and immersion unlike anything before.

The technology traces directly back to the 19th-century discoveries we've followed in this timeline. Fresnel's understanding of polarization, Land's sheet polarizers, and the physics of wave plates all converge in every 3D theater experience.

Next time you put on those lightweight 3D glasses, remember: you're wearing 200 years of optical physics on your face.`,
      zh: `2009年，詹姆斯·卡梅隆的《阿凡达》将观众带入了一个发光的外星世界——而偏振使这一切成为可能。

3D电影的挑战困扰了工程师数十年。你需要给每只眼睛展示略有不同的图像来创造深度感。早期系统使用红蓝眼镜（互补色），这会扭曲颜色。后来的线偏振系统效果更好，但有一个致命缺陷：倾斜头部，3D效果就会崩溃。

RealD的突破是圆偏振。系统不是按角度过滤（像线偏振器那样），而是为两只眼睛使用左旋和右旋圆偏振光。巧妙之处在于圆偏振在旋转头部时不会改变——旋向保持不变。

投影仪在左旋和右旋偏振帧之间快速切换。特殊的眼镜——每个镜片包含一个四分之一波片和为相反旋向调谐的线偏振器——确保每只眼睛只看到其预期的图像。

阿凡达的巨大成功（第一部票房超过20亿美元的电影）向数百万人介绍了偏振的魔力。世界各地的观众戴着轻便的偏振眼镜，体验到了前所未有的深度和沉浸感。

这项技术直接追溯到我们在这个时间线上追踪的19世纪发现。菲涅尔对偏振的理解、兰德的薄片偏振器以及波片的物理学，都汇聚在每一次3D影院体验中。

下次戴上那些轻便的3D眼镜时，记住：你脸上戴着200年的光学物理学。`
    },
    scientistBio: {
      portraitEmoji: '🎬',
      bioEn: 'RealD was founded by Michael V. Lewis and Joshua Greer in 2003. Their circular polarization 3D system became the dominant technology for theatrical 3D presentation, installed in tens of thousands of theaters worldwide.',
      bioZh: 'RealD由迈克尔·V·刘易斯和约书亚·格里尔于2003年创立。他们的圆偏振3D系统成为影院3D放映的主导技术，安装在全球数万家影院。'
    },
    scene: {
      location: 'Worldwide theaters',
      season: 'Winter',
      mood: 'entertainment revolution'
    },
    linkTo: {
      year: 1929,
      trackTarget: 'polarization',
      descriptionEn: 'RealD 3D glasses evolved from Edwin Land\'s polarizer technology',
      descriptionZh: 'RealD 3D眼镜从埃德温·兰德的偏振器技术演变而来'
    },
    thinkingQuestion: {
      en: 'Why does circular polarization work better than linear polarization for 3D cinema? What happens to linear polarization when you tilt your head?',
      zh: '为什么圆偏振比线偏振更适合3D电影？当你倾斜头部时，线偏振会发生什么？'
    }
  },
  {
    year: 2008,
    titleEn: 'Spin Hall Effect of Light',
    titleZh: '光子自旋霍尔效应',
    descriptionEn: 'First experimental observation of the photonic spin Hall effect — light of different polarizations (spins) deflects in opposite directions upon refraction or reflection.',
    descriptionZh: '首次实验观测到光子自旋霍尔效应——不同偏振态（自旋）的光在折射或反射时向相反方向偏转。',
    scientistEn: 'Onur Hosten, Paul Kwiat',
    scientistZh: '奥努尔·霍斯滕、保罗·克维亚特',
    category: 'discovery',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Analogous to the electronic spin Hall effect in solids',
        'Circularly polarized light deflects sideways upon refraction: opposite handedness deflects opposite ways',
        'The effect is tiny (nanometer-scale) but measurable with weak measurement techniques',
        'Arises from spin-orbit coupling in light — linking polarization to propagation direction',
        'Applications in precision metrology and nanoscale optical manipulation',
        'Connected to the geometric (Pancharatnam-Berry) phase of light'
      ],
      zh: [
        '类似于固体中的电子自旋霍尔效应',
        '圆偏振光在折射时横向偏转：相反旋向的光向相反方向偏转',
        '效应很小（纳米级）但可以用弱测量技术测量',
        '源于光的自旋-轨道耦合——将偏振与传播方向联系起来',
        '应用于精密计量和纳米级光学操控',
        '与光的几何（潘查拉特南-贝里）相位相关'
      ]
    },
    story: {
      en: `In 2008, physicists Onur Hosten and Paul Kwiat at the University of Illinois achieved a remarkable feat: they directly observed the spin Hall effect of light — a phenomenon predicted by theory but so subtle that it had never been measured.

The electronic spin Hall effect, discovered in semiconductors, causes electrons with opposite spin to deflect in opposite directions. Theorists had predicted an analogous effect for photons: when light refracts at an interface, left-circularly and right-circularly polarized components should deflect sideways in opposite directions.

The effect was minuscule — a displacement of about 1 nanometer, a million times smaller than the width of a human hair. To measure it, Hosten and Kwiat employed "weak measurement" — a quantum mechanical technique that can amplify tiny effects by carefully choosing what to measure.

Using a prism and precise polarimetric detection, they watched as left- and right-circular polarizations separated by nanometers upon refraction. The spin of the photon — its circular polarization state — was directly influencing its trajectory.

This "spin-orbit coupling" of light connects polarization to motion, just as it does for electrons in semiconductors. The discovery opened new possibilities for manipulating light at the nanoscale and for ultra-precise optical measurements.

The photon spin Hall effect beautifully demonstrates how polarization isn't just a property of light — it actively shapes how light moves through the world.`,
      zh: `2008年，伊利诺伊大学的物理学家奥努尔·霍斯滕和保罗·克维亚特完成了一项非凡的壮举：他们直接观测到了光的自旋霍尔效应——一种理论预测但如此微妙以至于从未被测量过的现象。

电子自旋霍尔效应在半导体中被发现，它使具有相反自旋的电子向相反方向偏转。理论家们预测光子存在类似的效应：当光在界面折射时，左旋圆偏振和右旋圆偏振分量应该向相反方向横向偏转。

这个效应极其微小——大约1纳米的位移，比人类头发的宽度小一百万倍。为了测量它，霍斯滕和克维亚特采用了"弱测量"——一种量子力学技术，通过仔细选择测量内容来放大微小效应。

使用棱镜和精确的偏振测量检测，他们观察到左旋和右旋圆偏振在折射时分离了几纳米。光子的自旋——它的圆偏振态——直接影响着它的轨迹。

光的这种"自旋-轨道耦合"将偏振与运动联系起来，就像它对半导体中的电子所做的那样。这一发现为在纳米尺度操控光和超精密光学测量开辟了新的可能性。

光子自旋霍尔效应美丽地证明了偏振不仅仅是光的一种性质——它积极地塑造着光在世界中的运动方式。`
    },
    scientistBio: {
      portraitEmoji: '↔️',
      bioEn: 'Onur Hosten and Paul Kwiat at the University of Illinois performed the first direct measurement of the photonic spin Hall effect, demonstrating the intimate connection between light\'s polarization and its propagation.',
      bioZh: '伊利诺伊大学的奥努尔·霍斯滕和保罗·克维亚特首次直接测量了光子自旋霍尔效应，展示了光的偏振与其传播之间的紧密联系。'
    },
    scene: {
      location: 'University of Illinois, USA',
      season: 'Winter',
      mood: 'precision measurement'
    },
    references: [
      { title: 'Hosten, O., & Kwiat, P. (2008). Observation of the Spin Hall Effect of Light via Weak Measurements. Science 319:787-790', url: 'https://doi.org/10.1126/science.1152697' }
    ],
    linkTo: {
      year: 1992,
      trackTarget: 'polarization',
      descriptionEn: 'The spin Hall effect demonstrates spin-orbit coupling of light, connecting polarization to orbital angular momentum',
      descriptionZh: '自旋霍尔效应展示了光的自旋-轨道耦合，将偏振与轨道角动量联系起来'
    },
    thinkingQuestion: {
      en: 'The spin Hall effect shows that polarization affects how light bends. Could this be used to make optical devices that separate light by polarization without traditional polarizers?',
      zh: '自旋霍尔效应表明偏振影响光的弯曲方式。这能否用于制造不使用传统偏振器而按偏振分离光的光学器件？'
    }
  },
  {
    year: 2008,
    titleEn: 'Mantis Shrimp Polarization Vision',
    titleZh: '螳螂虾偏振视觉',
    descriptionEn: 'Researchers discover mantis shrimp can detect circular polarization — a unique ability not found in any other animal.',
    descriptionZh: '研究人员发现螳螂虾能够探测圆偏振光——这是其他任何动物都没有的独特能力。',
    scientistEn: 'Tsyr-Huei Chiou, Justin Marshall et al.',
    scientistZh: '邱慈慧、贾斯汀·马歇尔等',
    category: 'discovery',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Mantis shrimp have 16 types of photoreceptors (humans have 3)',
        'They can see both linear and circular polarization',
        'First definitive proof of circular polarization vision in any animal',
        'This enables unique underwater communication',
        'Inspires development of compact polarization cameras'
      ],
      zh: [
        '螳螂虾有16种光感受器（人类只有3种）',
        '它们能看到线偏振和圆偏振光',
        '首次明确证明动物具有圆偏振视觉能力',
        '这使得独特的水下通信成为可能',
        '启发了紧凑型偏振相机的开发'
      ]
    },
    story: {
      en: `In 2008, a landmark paper in Current Biology by Tsyr-Huei Chiou, Justin Marshall and colleagues announced an extraordinary discovery. The mantis shrimp — already famous for its powerful strike — was hiding an even more remarkable secret.

These small crustaceans possessed the most complex visual system ever discovered in nature. Not only could they see colors we cannot imagine, but they could also detect something no other animal had been proven to see: circularly polarized light.

"When we first measured it, we didn't believe the data," Marshall recalled. The experiments were repeated dozens of times. The results were always the same — mantis shrimp could distinguish between left-handed and right-handed circular polarization.

Why would evolution bestow such an exotic ability? The answer lay in their secretive social lives. Mantis shrimp mark their territory with polarized signals invisible to predators but clear as day to other mantis shrimp. A private communication channel, hidden in plain light.

The discovery sparked a revolution in bio-inspired optics. Engineers began designing cameras that could mimic the mantis shrimp's vision, detecting cancer cells and underwater mines with unprecedented clarity. Nature had solved the problem of polarization detection in ways human engineers had never imagined.

In the rainbow-colored eyes of a small crustacean, three centuries of optical research found its most sophisticated natural expression.`,
      zh: `2008年，《当代生物学》(Current Biology) 期刊上发表了一篇由邱慈慧、贾斯汀·马歇尔及其同事撰写的里程碑式论文，宣布了一个非凡的发现。螳螂虾——已经因其强大的攻击力而闻名——隐藏着一个更加惊人的秘密。

这些小型甲壳类动物拥有自然界中发现的最复杂的视觉系统。它们不仅能看到我们无法想象的颜色，还能探测到没有其他动物被证明能看到的东西：圆偏振光。

"当我们第一次测量时，我们不相信数据，"马歇尔回忆道。实验重复了数十次。结果总是一样的——螳螂虾能够区分左旋和右旋圆偏振光。

为什么进化会赋予如此奇异的能力？答案在于它们神秘的社交生活。螳螂虾用偏振信号标记领地，这些信号对捕食者是不可见的，但对其他螳螂虾来说却清晰可见。一个隐藏在普通光线中的私密通信渠道。

这一发现引发了仿生光学的革命。工程师们开始设计能够模仿螳螂虾视觉的相机，以前所未有的清晰度检测癌细胞和水下地雷。大自然以人类工程师从未想象过的方式解决了偏振检测问题。

在这只小甲壳类动物的彩虹色眼睛里，三个世纪的光学研究找到了其最精密的自然表达。`
    },
    scientistBio: {
      portraitEmoji: '🦐',
      bioEn: 'Tsyr-Huei Chiou and Justin Marshall are visual ecology researchers. Their 2008 Current Biology paper definitively proved that mantis shrimp can detect circular polarization, a capability unprecedented in the animal kingdom.',
      bioZh: '邱慈慧和贾斯汀·马歇尔是视觉生态学研究者。他们2008年在《当代生物学》上发表的论文明确证明了螳螂虾能够探测圆偏振光，这是动物界前所未有的能力。'
    },
    scene: {
      location: 'Great Barrier Reef, Australia',
      season: 'Summer',
      mood: 'wonder'
    },
    references: [
      { title: 'Chiou, T.-H. et al. (2008). Circular Polarization Vision in a Stomatopod Crustacean. Current Biology 18(6):429-434', url: 'https://doi.org/10.1016/j.cub.2008.02.066' }
    ],
    thinkingQuestion: {
      en: 'Evolution gave mantis shrimp the ability to see circular polarization. Why might this ability be useful for survival in the ocean?',
      zh: '进化使螳螂虾获得了看见圆偏振光的能力。为什么这种能力对于在海洋中生存可能有用？'
    },
    illustrationType: 'mantis'
  },
  {
    year: 2018,
    titleEn: 'Polarimetric Medical Imaging',
    titleZh: '偏振医学成像',
    descriptionEn: 'Mueller matrix polarimetry enables non-invasive cancer detection by analyzing tissue birefringence changes.',
    descriptionZh: '穆勒矩阵偏振测量通过分析组织双折射变化，实现无创癌症检测。',
    category: 'discovery',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Cancerous tissue has different polarization properties than healthy tissue',
        'Mueller matrix decomposition reveals structural changes in collagen',
        'Non-invasive, label-free imaging technique',
        'Showing promise for surgical guidance and early detection'
      ],
      zh: [
        '癌变组织与健康组织有不同的偏振特性',
        '穆勒矩阵分解揭示胶原蛋白的结构变化',
        '无创、无标记成像技术',
        '在手术引导和早期检测方面显示出前景'
      ]
    },
    story: {
      en: `In hospitals around the world, 2018, a quiet revolution was taking place. Doctors were learning to see what had been invisible — the subtle structural changes that herald cancer's arrival.

The key was polarization. For decades, pathologists had known that cancerous tissue looked different under polarized light. But it was only with advances in Mueller matrix imaging that they could quantify these differences precisely.

Healthy tissue has an orderly arrangement of collagen fibers, like well-organized threads in fabric. Cancer disrupts this order, creating characteristic changes in how tissue rotates and depolarizes light. Mueller matrix decomposition — the mathematical legacy of Hans Mueller from 1943 — could now detect these changes in living patients.

"We're essentially doing a biopsy with light," explained one researcher. No cutting, no staining, no waiting for lab results. The camera sees what the eye cannot.

Clinical trials showed remarkable results. Skin cancers detected before they were visible. Surgical margins verified in real-time. The boundary between healthy and diseased tissue, invisible in white light, glowed distinctly under polarized illumination.

The same physics that Malus discovered in a Paris sunset, that Stokes formalized in Victorian Cambridge, was now saving lives in modern operating rooms. The story of polarized light had become, quite literally, a matter of life and death.`,
      zh: `2018年，世界各地的医院里，一场安静的革命正在发生。医生们正在学习看到以前看不见的东西——预示癌症到来的细微结构变化。

关键是偏振。几十年来，病理学家就知道在偏振光下癌变组织看起来不同。但只有随着穆勒矩阵成像技术的进步，他们才能精确量化这些差异。

健康组织中胶原纤维排列有序，就像织物中排列整齐的线。癌症破坏了这种秩序，在组织如何旋转和退偏振光方面产生特征性变化。穆勒矩阵分解——1943年汉斯·穆勒的数学遗产——现在可以在活体患者中检测这些变化。

"我们本质上是用光做活检，"一位研究人员解释道。无需切割，无需染色，无需等待实验室结果。相机能看到眼睛看不到的东西。

临床试验显示了显著的结果。在皮肤癌可见之前就检测到它。实时验证手术切缘。健康组织和病变组织之间的边界，在白光下不可见，在偏振照明下却清晰发光。

马吕斯在巴黎日落中发现的物理学，斯托克斯在维多利亚时代剑桥形式化的物理学，现在正在现代手术室中挽救生命。偏振光的故事，已经真正成为生死攸关的问题。`
    },
    scientistBio: {
      portraitEmoji: '🏥',
      bioEn: 'Mueller matrix polarimetry for medical imaging has been advanced by research groups worldwide, including teams in France (LPICM), China, and the US. Their work bridges 19th-century optical physics with 21st-century medicine.',
      bioZh: '医学成像的穆勒矩阵偏振测量技术由世界各地的研究团队推动发展，包括法国（LPICM）、中国和美国的团队。他们的工作将19世纪的光学物理与21世纪的医学联系起来。'
    },
    scene: {
      location: 'Global medical centers',
      season: 'All seasons',
      mood: 'hope'
    },
    illustrationType: 'medical'
  },
  {
    year: 2021,
    titleEn: 'Metasurface Polarization Control',
    titleZh: '超表面偏振调控',
    descriptionEn: 'Programmable metasurfaces achieve dynamic, pixel-level control of light polarization.',
    descriptionZh: '可编程超表面实现对光偏振的动态像素级控制。',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Sub-wavelength nanostructures manipulate light like never before',
        'Electric or optical switching enables dynamic polarization states',
        'Opens path to holographic displays and LiDAR beam steering',
        'Compact, flat optical components replace bulky traditional optics'
      ],
      zh: [
        '亚波长纳米结构以前所未有的方式操控光',
        '电或光开关实现动态偏振态',
        '为全息显示和LiDAR光束转向开辟道路',
        '紧凑的平面光学元件取代笨重的传统光学器件'
      ]
    },
    story: {
      en: `In nanofabrication labs from California to Shanghai, 2021, researchers were crafting structures smaller than the wavelength of light itself. These "metasurfaces" — precisely arranged forests of nano-pillars — were doing things that had seemed impossible.

Unlike traditional optics that control light through bulk material properties, metasurfaces manipulate light with their geometry. Each nanoscale element acts as a tiny antenna, tuning phase, amplitude, and polarization with extraordinary precision.

The breakthrough was making them dynamic. By integrating phase-change materials or liquid crystals, engineers created metasurfaces that could switch between polarization states in milliseconds. A flat piece of glass could now do what once required spinning mechanical parts.

The applications seemed endless. Augmented reality glasses that adjusted to ambient light. LiDAR systems that steered laser beams without moving parts. Cameras that captured full polarization information in a single shot.

"We're not just making smaller optics," one researcher explained. "We're inventing entirely new ways to control light."

The metasurface revolution represented a fundamental shift in optical engineering — from shaping light with material bulk to programming it with geometry. The physics that Fresnel had established two centuries earlier was being rewritten at the nanoscale.`,
      zh: `2021年，从加州到上海的纳米制造实验室里，研究人员正在制作比光波长还小的结构。这些"超表面"——精确排列的纳米柱森林——正在做看似不可能的事情。

与通过体材料特性控制光的传统光学不同，超表面通过其几何结构操控光。每个纳米级元素都像一个微型天线，以非凡的精度调谐相位、振幅和偏振。

突破在于使它们具有动态性。通过集成相变材料或液晶，工程师创造出可以在毫秒内切换偏振态的超表面。一片平坦的玻璃现在可以做到过去需要旋转机械部件才能做的事。

应用似乎无穷无尽。可以适应环境光的增强现实眼镜。无需移动部件就能转向激光束的LiDAR系统。一次拍摄就能捕获完整偏振信息的相机。

"我们不只是在制造更小的光学器件，"一位研究人员解释道。"我们正在发明控制光的全新方式。"

超表面革命代表了光学工程的根本转变——从用材料体积塑造光到用几何编程光。菲涅尔两个世纪前建立的物理学正在纳米尺度上被重写。`
    },
    scientistBio: {
      portraitEmoji: '🔬',
      bioEn: 'Metasurface research is led by groups at Caltech, Harvard, and universities in China and Europe. These teams combine nanofabrication expertise with fundamental physics to create the next generation of optical devices.',
      bioZh: '超表面研究由加州理工学院、哈佛大学以及中国和欧洲大学的团队领导。这些团队将纳米制造专业知识与基础物理相结合，创造下一代光学器件。'
    },
    scene: {
      location: 'Global research labs',
      season: 'All seasons',
      mood: 'innovation'
    },
    illustrationType: 'metasurface'
  },
  {
    year: 2023,
    titleEn: 'Quantum Polarimetry',
    titleZh: '量子偏振测量',
    descriptionEn: 'Quantum-enhanced polarimetric measurements surpass classical sensitivity limits.',
    descriptionZh: '量子增强偏振测量超越经典灵敏度极限。',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Entangled photons enable sub-shot-noise polarization measurements',
        'Detecting optical activity changes at the molecular level',
        'Applications in pharmaceutical quality control and biosensing',
        'Bridges quantum optics with practical polarimetry'
      ],
      zh: [
        '纠缠光子实现亚散粒噪声偏振测量',
        '在分子水平检测光学活性变化',
        '在药品质量控制和生物传感中的应用',
        '将量子光学与实用偏振测量连接起来'
      ]
    },
    story: {
      en: `In quantum optics laboratories, 2023, researchers achieved what had long been thought impossible — measuring polarization changes smaller than the fundamental noise of classical light.

The technique relied on a peculiar quantum property: entanglement. Pairs of photons, born together and forever correlated, carried information that transcended what individual particles could convey. By measuring the polarization of entangled pairs, scientists could detect changes too subtle for any classical instrument.

The implications rippled through multiple fields. Pharmaceutical companies could verify the chirality of drug molecules with unprecedented precision — crucial since the wrong handedness can be toxic. Biosensors could detect protein folding changes indicative of disease. Astronomers could measure the magnetic fields of distant stars.

"We're using quantum mechanics to see polarization in ways Stokes never dreamed of," noted one researcher. The four parameters Stokes had defined in 1852 were now being measured with quantum precision.

The marriage of quantum physics and polarimetry represented a new chapter in the long story of light. From Huygens's waves to Maxwell's fields to quantum entanglement — each generation had discovered deeper truths about the nature of light.

And yet the mystery remained. Why does light have polarization at all? What fundamental truth does this property reveal about our universe? These questions, first glimpsed in Bartholin's calcite crystals four centuries ago, still illuminate the frontier of physics.`,
      zh: `2023年，在量子光学实验室里，研究人员实现了长期以来被认为不可能的事情——测量比经典光的基本噪声还要小的偏振变化。

这项技术依赖于一种奇特的量子特性：纠缠。成对产生且永远相关的光子携带着超越单个粒子所能传递的信息。通过测量纠缠光子对的偏振，科学家可以检测到任何经典仪器都无法发现的细微变化。

影响波及多个领域。制药公司可以以前所未有的精度验证药物分子的手性——这至关重要，因为错误的手性可能有毒。生物传感器可以检测指示疾病的蛋白质折叠变化。天文学家可以测量遥远恒星的磁场。

"我们正在使用量子力学以斯托克斯从未梦想过的方式观察偏振，"一位研究人员指出。斯托克斯在1852年定义的四个参数现在正以量子精度测量。

量子物理和偏振测量的结合代表了光的漫长故事中的新篇章。从惠更斯的波动到麦克斯韦的场再到量子纠缠——每一代人都发现了关于光本质的更深层次的真理。

然而谜团依然存在。光为什么会有偏振？这一特性揭示了我们宇宙的什么基本真理？这些问题，四个世纪前在巴托林的方解石晶体中初见端倪，至今仍照亮着物理学的前沿。`
    },
    scientistBio: {
      portraitEmoji: '⚛️',
      bioEn: 'Quantum polarimetry research is conducted at leading quantum optics centers worldwide, including groups in Vienna, Brisbane, and Beijing. Their work pushes the fundamental limits of optical measurement.',
      bioZh: '量子偏振测量研究在全球领先的量子光学中心进行，包括维也纳、布里斯班和北京的研究团队。他们的工作推动了光学测量的基本极限。'
    },
    scene: {
      location: 'Global quantum labs',
      season: 'All seasons',
      mood: 'frontier science'
    },
    illustrationType: 'quantum'
  },
  // ===== 补充历史事件 =====,
]
