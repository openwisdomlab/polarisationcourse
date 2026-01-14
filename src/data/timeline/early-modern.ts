/**
 * Timeline Events: Early Modern Era (1901-1950)
 * 早期现代时代 (1901-1950)
 *
 * Quantum theory and technological breakthroughs
 */

import type { TimelineEvent } from './types'

export const EARLY_MODERN_EVENTS: TimelineEvent[] = [
  {
    year: 1905,
    titleEn: 'Photon Concept and Photoelectric Effect',
    titleZh: '光子概念与光电效应',
    descriptionEn: 'Einstein proposes light consists of quantized packets (photons), bridging classical wave optics and quantum mechanics.',
    descriptionZh: '爱因斯坦提出光由量子化的能量包（光子）组成——架起经典波动光学与量子力学的桥梁，为理解光偏振的量子本质奠定基础。',
    scientistEn: 'Albert Einstein',
    scientistZh: '阿尔伯特·爱因斯坦',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Light behaves as discrete energy packets: E = hν',
        'Explained the photoelectric effect which classical wave theory could not',
        'Light exhibits both wave and particle properties (wave-particle duality)',
        'Each photon carries polarization information — a single photon\'s polarization cannot be split',
        'Polarization states later became the first quantum bit (qubit) in Dirac\'s 1930 formalism',
        'Foundation for quantum optics and quantum polarimetry (2023 entry)'
      ],
      zh: [
        '光表现为离散的能量包：E = hν',
        '解释了经典波动理论无法解释的光电效应',
        '光表现出波粒二象性',
        '每个光子携带偏振信息——单个光子的偏振不可分割',
        '偏振态后来成为狄拉克1930年形式化中的第一个量子比特（qubit）',
        '量子光学和量子偏振测量的基础（见2023年条目）'
      ]
    },
    story: {
      en: `In 1905 — his "miracle year" — a 26-year-old patent clerk in Bern published four papers that would revolutionize physics. One of them earned him the Nobel Prize: the explanation of the photoelectric effect.

The problem was simple to state: when light shines on a metal surface, electrons are ejected. But classical wave theory predicted wrong results. Increasing light intensity should give electrons more energy — but it didn't. Only changing the light's frequency mattered.

Einstein proposed a radical solution: light is not just a wave but comes in discrete packets, which he called "light quanta" (later named photons). Each photon carries energy E = hν, where ν is the frequency and h is Planck's constant. Higher frequency means higher energy per photon, regardless of how many photons there are.

This was revolutionary. Maxwell had shown light was an electromagnetic wave. Now Einstein was saying it was also a particle. Both were true — wave-particle duality was born.

For polarization, this had profound implications. Each photon carries its own polarization state. When light passes through a polarizer, individual photons either pass or don't — there's no "half-passage." The classical continuous wave description is an approximation that emerges from countless quantum events.

Einstein's insight opened the door to quantum optics. A century later, entangled photon pairs would enable quantum polarimetry — measuring polarization with precision beyond classical limits.`,
      zh: `1905年——他的"奇迹年"——一位26岁的伯尔尼专利局职员发表了四篇将彻底改变物理学的论文。其中一篇为他赢得了诺贝尔奖：对光电效应的解释。

问题陈述起来很简单：当光照射到金属表面时，电子会被弹出。但经典波动理论预测的结果是错误的。增加光强应该给电子更多能量——但并没有。只有改变光的频率才有影响。

爱因斯坦提出了一个激进的解决方案：光不仅是波，而且以离散的包形式出现，他称之为"光量子"（后来被命名为光子）。每个光子携带能量E = hν，其中ν是频率，h是普朗克常数。频率越高意味着每个光子能量越高，无论有多少个光子。

这是革命性的。麦克斯韦已经证明光是电磁波。现在爱因斯坦说它也是粒子。两者都是对的——波粒二象性诞生了。

对于偏振，这有深远的影响。每个光子携带自己的偏振态。当光通过偏振器时，单个光子要么通过要么不通过——没有"通过一半"的说法。经典的连续波描述是由无数量子事件产生的近似。

爱因斯坦的洞见打开了量子光学的大门。一个世纪后，纠缠光子对将使量子偏振测量成为可能——以超越经典极限的精度测量偏振。`
    },
    scientistBio: {
      birthYear: 1879,
      deathYear: 1955,
      nationality: 'German-American',
      portraitEmoji: '🎓',
      bioEn: 'Albert Einstein was a German-born theoretical physicist, widely regarded as one of the greatest scientists of all time. He received the Nobel Prize in 1921 for his explanation of the photoelectric effect. He also developed the theories of special and general relativity, fundamentally changing our understanding of space, time, and gravity.',
      bioZh: '阿尔伯特·爱因斯坦是德裔理论物理学家，被广泛认为是有史以来最伟大的科学家之一。他因解释光电效应而获得1921年诺贝尔奖。他还发展了狭义和广义相对论，从根本上改变了我们对空间、时间和引力的理解。'
    },
    scene: {
      location: 'Bern, Switzerland',
      season: 'Spring',
      mood: 'paradigm shift'
    },
    linkTo: {
      year: 2023,
      trackTarget: 'polarization',
      descriptionEn: 'The photon concept is the foundation for quantum polarimetry',
      descriptionZh: '光子概念是量子偏振测量的基础'
    },
    thinkingQuestion: {
      en: 'Light behaves as both a wave (with polarization) and a particle (photon). How can something be both at once?',
      zh: '光同时表现为波（有偏振）和粒子（光子）。怎么可能同时是两者？'
    },
    illustrationType: 'photoelectric'
  },
  {
    year: 1908,
    titleEn: 'Mie Scattering Theory',
    titleZh: '米氏散射理论',
    descriptionEn: 'Gustav Mie develops a complete solution to Maxwell\'s equations for light scattering by spherical particles of any size, extending beyond the Rayleigh limit.',
    descriptionZh: '古斯塔夫·米通过求解麦克斯韦方程组，建立了任意尺寸球形颗粒散射光的完整理论，超越了瑞利散射的适用范围。',
    scientistEn: 'Gustav Mie',
    scientistZh: '古斯塔夫·米',
    category: 'theory',
    importance: 2,
    track: 'optics',
    details: {
      en: [
        'Complete analytical solution for electromagnetic scattering by spherical particles',
        'Extends Rayleigh scattering to particles comparable to or larger than wavelength',
        'Explains white appearance of clouds (large water droplets) vs blue sky (small molecules)',
        'Predicts complex angular patterns of scattered light intensity and polarization',
        'Mie scattering is wavelength-independent when particles >> wavelength (hence white clouds)',
        'Critical for atmospheric optics, radar meteorology, and remote sensing',
        'Used in cancer diagnostics, paint formulation, and astronomical observations'
      ],
      zh: [
        '球形颗粒电磁散射的完整解析解',
        '将瑞利散射扩展到与波长相当或更大的颗粒',
        '解释了云的白色外观（大水滴）与蓝天（小分子）的区别',
        '预测散射光强度和偏振的复杂角度分布',
        '当颗粒远大于波长时，米氏散射与波长无关（因此云是白色的）',
        '对大气光学、雷达气象学和遥感至关重要',
        '用于癌症诊断、涂料配方和天文观测'
      ]
    },
    story: {
      en: `In 1908, Gustav Mie — a German physicist at the University of Greifswald — tackled a problem that had puzzled scientists since Rayleigh's work three decades earlier: what happens when particles are not small compared to the wavelength of light?

Rayleigh's theory worked beautifully for molecules in the atmosphere, explaining the blue sky. But clouds are made of water droplets far larger than light wavelength, yet they appear white, not blue. Why?

Mie approached the problem with mathematical rigor. He solved Maxwell's equations exactly for a plane wave striking a homogeneous sphere of arbitrary size. The solution was a formidable series of spherical harmonics — pages of complex mathematics — but the physics it revealed was profound.

When particles are much smaller than wavelength (Rayleigh regime), scattering goes as 1/λ⁴, strongly favoring blue light. But as particles grow larger than the wavelength, the scattering efficiency plateaus and becomes roughly equal for all visible wavelengths. Large particles scatter all colors equally — hence white clouds!

Mie's theory also revealed beautiful angular patterns in scattered light. The glory effect seen around aircraft shadows on clouds, the corona around the sun or moon, the complex colors in opal gemstones — all are Mie scattering phenomena.

Perhaps most importantly for polarization, Mie showed how the degree of polarization depends on particle size and viewing angle. Large particles produce more complex polarization patterns than Rayleigh's simple perpendicular polarization.

Today, Mie theory is essential for climate science (understanding aerosol effects), medical diagnostics (detecting cancer cells by their scattering), and even cosmetics (designing the perfect shimmer in makeup). The humble water droplet, analyzed through Mie's mathematics, unlocked secrets of light-matter interaction at all scales.`,
      zh: `1908年，古斯塔夫·米——格赖夫斯瓦尔德大学的德国物理学家——解决了一个自瑞利工作三十年来一直困扰科学家的问题：当颗粒与光波长相比不再是微小时会发生什么？

瑞利的理论对大气中的分子非常有效，解释了蓝天。但云是由远大于光波长的水滴组成的，却呈现白色而非蓝色。为什么？

米以严格的数学方法处理这个问题。他精确求解了平面波照射任意大小均匀球体的麦克斯韦方程组。解是一个复杂的球谐函数级数——数页复杂的数学——但它揭示的物理学是深刻的。

当颗粒远小于波长（瑞利区域）时，散射强度与1/λ⁴成正比，强烈偏向蓝光。但当颗粒变得比波长更大时，散射效率趋于平坦，对所有可见光波长大致相等。大颗粒均匀散射所有颜色——因此云是白色的！

米的理论还揭示了散射光的美丽角度分布。在云层上飞机阴影周围看到的宝光效应、太阳或月亮周围的日冕、蛋白石宝石中的复杂颜色——都是米氏散射现象。

对于偏振来说最重要的是，米展示了偏振度如何取决于颗粒尺寸和观察角度。大颗粒产生比瑞利简单的垂直偏振更复杂的偏振图案。

今天，米氏理论对气候科学（理解气溶胶效应）、医学诊断（通过散射检测癌细胞）甚至化妆品（设计化妆品中完美的闪光效果）都至关重要。这个普通的水滴，通过米的数学分析，解锁了所有尺度上光-物质相互作用的秘密。`
    },
    scientistBio: {
      birthYear: 1868,
      deathYear: 1957,
      nationality: 'German',
      portraitEmoji: '☁️',
      bioEn: 'Gustav Adolf Feodor Wilhelm Ludwig Mie was a German physicist best known for his solution of the electromagnetic scattering problem for spheres. He also made contributions to electrodynamics and the theory of matter. The Mie scattering solution remains one of the most widely used results in optical physics.',
      bioZh: '古斯塔夫·阿道夫·费奥多尔·威廉·路德维希·米是德国物理学家，以其球形颗粒电磁散射问题的求解而闻名。他还对电动力学和物质理论做出了贡献。米氏散射解至今仍是光学物理中使用最广泛的结果之一。'
    },
    scene: {
      location: 'University of Greifswald, Germany',
      season: 'Spring',
      mood: 'mathematical triumph'
    },
    references: [
      { title: 'Mie, G. (1908). Beiträge zur Optik trüber Medien, speziell kolloidaler Metallösungen. Annalen der Physik 330(3):377-445', url: 'https://doi.org/10.1002/andp.19083300302' }
    ],
    linkTo: {
      year: 1871,
      trackTarget: 'polarization',
      descriptionEn: 'Mie theory extends Rayleigh scattering to particles of any size',
      descriptionZh: '米氏理论将瑞利散射扩展到任意尺寸的颗粒'
    },
    thinkingQuestion: {
      en: 'Clouds are white because water droplets are large (Mie scattering). The sky is blue because air molecules are small (Rayleigh scattering). What happens at sunrise and sunset?',
      zh: '云是白色的因为水滴很大（米氏散射）。天空是蓝色的因为空气分子很小（瑞利散射）。日出和日落时会发生什么？'
    }
  },
  {
    year: 1929,
    titleEn: 'Polaroid Filter',
    titleZh: '宝丽来偏振片',
    descriptionEn: 'Edwin Land invents the first synthetic sheet polarizer, revolutionizing polarization applications.',
    descriptionZh: '埃德温·兰德发明了第一种合成薄片偏振器，彻底改变了偏振应用。',
    scientistEn: 'Edwin Land',
    scientistZh: '埃德温·兰德',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Created by aligning microscopic crystals in a plastic sheet',
        'Made polarizers cheap and widely available',
        'Enabled polarized sunglasses, camera filters, 3D movies',
        'Land later founded the Polaroid Corporation'
      ],
      zh: [
        '通过在塑料片中排列微小晶体制成',
        '使偏振器变得便宜且广泛可用',
        '使偏振太阳镜、相机滤镜、3D电影成为可能',
        '兰德后来创立了宝丽来公司'
      ]
    },
    story: {
      en: `In 1926, a 17-year-old Harvard freshman named Edwin Land wandered through Times Square at night, squinting at the blinding glare of automobile headlights. "There must be a way," he muttered to himself, "to tame this light."

Land dropped out of Harvard (he would return later, then drop out again) and disappeared into the New York Public Library. He devoured every paper on polarization he could find. The solution seemed obvious: polarized filters could block glare! But Nicol prisms were far too expensive for car headlights.

In a cramped basement laboratory, Land began his obsession: how to make polarizers cheaply, in sheets, that anyone could afford. He had an audacious idea — what if he could align millions of microscopic crystals all pointing the same direction?

He found his answer in iodoquinine sulfate crystals. Suspended in a liquid, these needle-like crystals could be drawn through narrow slots, forcing them to align like logs floating down a river. Embedded in plastic, they became a sheet polarizer — the first in history.

"Polaroid" was born in 1929. Land was just 20 years old.

But this was only the beginning. Land would go on to invent instant photography, advise presidents on Cold War reconnaissance, and build one of America's most innovative companies. He held 535 patents, second only to Edison.

Yet it all started with a teenager bothered by headlight glare, and the audacity to think he could solve a problem that had stumped scientists for a century. Today, polarizing filters are everywhere — in every smartphone, laptop, and pair of sunglasses — because one young man refused to accept that light couldn't be tamed.`,
      zh: `1926年，一位17岁的哈佛新生埃德温·兰德夜里漫步在时代广场，被汽车前灯刺眼的强光照得眯起眼睛。"一定有办法，"他自言自语道，"驯服这道光。"

兰德从哈佛退学（他后来会回去，然后再次退学），消失在纽约公共图书馆里。他如饥似渴地阅读每一篇关于偏振的论文。解决方案似乎很明显：偏振滤光器可以阻挡眩光！但尼科尔棱镜对汽车前灯来说太贵了。

在一间狭小的地下室实验室里，兰德开始了他的痴迷：如何廉价地、以薄片形式制造人人都买得起的偏振器。他有一个大胆的想法——如果能让数百万个微小晶体都指向同一方向呢？

他在碘代奎宁硫酸盐晶体中找到了答案。这些针状晶体悬浮在液体中，可以被拉过狭窄的缝隙，迫使它们像河中漂流的原木一样排列整齐。嵌入塑料中，它们就变成了薄片偏振器——史上第一种。

"宝丽来"在1929年诞生。兰德那时才20岁。

但这仅仅是个开始。兰德后来发明了即时摄影，为总统提供冷战侦察建议，并建立了美国最具创新力的公司之一。他持有535项专利，仅次于爱迪生。

然而，这一切始于一个被汽车前灯眩光困扰的少年，以及他那认为自己能解决困扰科学家一个世纪难题的胆识。今天，偏振滤光器无处不在——在每一部智能手机、笔记本电脑和太阳镜中——因为一个年轻人拒绝接受光无法被驯服。`
    },
    scientistBio: {
      birthYear: 1909,
      deathYear: 1991,
      nationality: 'American',
      portraitEmoji: '📸',
      bioEn: 'Edwin Herbert Land was an American inventor and physicist, best known for co-founding Polaroid Corporation and inventing instant photography. He held 535 US patents, making him one of the most prolific inventors in American history. He was also a key figure in Cold War intelligence, developing U-2 spy plane cameras.',
      bioZh: '埃德温·赫伯特·兰德是美国发明家和物理学家，以共同创立宝丽来公司和发明即时摄影而闻名。他持有535项美国专利，是美国历史上最多产的发明家之一。他也是冷战情报工作的关键人物，开发了U-2侦察机的相机。'
    },
    scene: {
      location: 'New York City, USA',
      season: 'Summer',
      mood: 'innovation'
    },
    thinkingQuestion: {
      en: 'Land invented Polaroid film at just 20 years old. Why is it important for young people to pursue seemingly "impossible" ideas?',
      zh: '兰德在20岁时就发明了宝丽来薄膜。为什么年轻人追求看似"不可能"的想法很重要？'
    },
    illustrationType: 'polarizer'
  },
  {
    year: 1941,
    titleEn: 'Jones Calculus',
    titleZh: '琼斯矢量与矩阵',
    descriptionEn: 'R. Clark Jones develops a matrix formalism for completely polarized light, enabling systematic analysis of optical systems.',
    descriptionZh: '克拉克·琼斯开发了一套描述完全偏振光的矩阵形式体系，使光学系统的系统性分析成为可能。',
    scientistEn: 'R. Clark Jones',
    scientistZh: '克拉克·琼斯',
    category: 'theory',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Polarization state represented by a 2-element complex vector',
        'Optical elements (polarizers, wave plates) represented by 2×2 matrices',
        'System analysis: multiply matrices in sequence',
        'Only valid for completely polarized, coherent light',
        'Complemented later by Mueller calculus for partial polarization'
      ],
      zh: [
        '偏振态用2元复数矢量表示',
        '光学元件（偏振器、波片）用2×2矩阵表示',
        '系统分析：按顺序相乘矩阵',
        '仅适用于完全偏振的相干光',
        '后来被穆勒矩阵补充，用于部分偏振光'
      ]
    },
    story: {
      en: `In 1941, while much of the world was at war, a young physicist named R. Clark Jones at Polaroid Corporation was solving a different kind of problem: how to systematically calculate the behavior of polarized light through complex optical systems.

Before Jones, analyzing a series of polarizers, wave plates, and other optical elements required tedious case-by-case calculations. Jones introduced an elegant mathematical framework that would transform optical engineering.

His insight was to represent the polarization state of light as a two-component complex vector — what we now call the Jones vector. Horizontal polarization becomes (1, 0). Vertical becomes (0, 1). Circular polarization? (1, i)/√2.

Better yet, each optical element could be represented as a 2×2 matrix. To find what happens when light passes through a series of elements, simply multiply the matrices together.

This may seem abstract, but it was revolutionary for practical work. An optical engineer designing a system with ten elements could now multiply ten matrices and immediately know the output polarization. What once took hours now took minutes.

The Jones calculus has one limitation: it only works for completely polarized light. For partially polarized or unpolarized light, the Mueller calculus (developed around the same time) is needed. Together, these two formalisms form the mathematical backbone of modern polarization optics.`,
      zh: `1941年，当世界大部分地区还在战火中时，宝丽来公司的一位年轻物理学家克拉克·琼斯正在解决另一种问题：如何系统地计算偏振光通过复杂光学系统的行为。

在琼斯之前，分析一系列偏振器、波片和其他光学元件需要繁琐的逐案计算。琼斯引入了一个优雅的数学框架，将改变光学工程。

他的洞见是将光的偏振态表示为一个双分量复数矢量——我们现在称之为琼斯矢量。水平偏振变成(1, 0)。垂直偏振变成(0, 1)。圆偏振？(1, i)/√2。

更好的是，每个光学元件都可以用2×2矩阵表示。要找出光通过一系列元件后会发生什么，只需将矩阵相乘。

这可能看起来很抽象，但对于实际工作来说是革命性的。设计一个有十个元件的系统的光学工程师现在可以把十个矩阵相乘，立即知道输出偏振态。以前需要几小时的工作现在只需几分钟。

琼斯演算有一个局限性：它只适用于完全偏振光。对于部分偏振或非偏振光，需要穆勒矩阵（大约同时期发展）。这两种形式体系共同构成了现代偏振光学的数学骨架。`
    },
    scientistBio: {
      birthYear: 1916,
      deathYear: 2004,
      nationality: 'American',
      portraitEmoji: '🧮',
      bioEn: 'R. Clark Jones was an American physicist who spent most of his career at Polaroid Corporation. He developed the Jones calculus, a standard tool in polarization optics. He also made important contributions to optical system design and detector theory.',
      bioZh: '克拉克·琼斯是美国物理学家，职业生涯大部分时间在宝丽来公司度过。他发展了琼斯演算，这是偏振光学中的标准工具。他还对光学系统设计和探测器理论做出了重要贡献。'
    },
    scene: {
      location: 'Cambridge, Massachusetts, USA',
      season: 'Autumn',
      mood: 'mathematical precision'
    },
    linkTo: {
      year: 1852,
      trackTarget: 'polarization',
      descriptionEn: 'Jones calculus provides a matrix formalism complementary to Stokes parameters',
      descriptionZh: '琼斯演算提供了与斯托克斯参数互补的矩阵形式体系'
    },
    thinkingQuestion: {
      en: 'Why would optical engineers prefer multiplying matrices over doing case-by-case calculations? What makes this approach more powerful?',
      zh: '为什么光学工程师更喜欢用矩阵相乘而不是逐案计算？是什么使这种方法更强大？'
    },
    illustrationType: 'jones'
  },
  {
    year: 1943,
    titleEn: 'Mueller Calculus',
    titleZh: '穆勒矩阵',
    descriptionEn: 'Hans Mueller develops a 4×4 matrix formalism for describing partially polarized light, extending polarization analysis to real-world conditions.',
    descriptionZh: '汉斯·穆勒发展了描述部分偏振光的4×4矩阵体系，将偏振分析扩展到实际条件。',
    scientistEn: 'Hans Mueller',
    scientistZh: '汉斯·穆勒',
    category: 'theory',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Uses 4-element Stokes vectors S = [S₀, S₁, S₂, S₃]ᵀ to describe any polarization state',
        'Optical elements represented by 4×4 Mueller matrices: S_out = M × S_in',
        'Can handle partially polarized and unpolarized light (unlike Jones calculus)',
        'Accounts for depolarization effects: M has 16 elements, not all independent',
        'Lu-Chipman decomposition (1996): M = MΔ × MR × MD (depolarizer × retarder × diattentuator)',
        'Classic experiment: measure with polarimeter at multiple orientations to construct M',
        'Essential for polarimetric imaging, remote sensing, and biomedical optics',
        'Developed during WWII for optical instrumentation at MIT'
      ],
      zh: [
        '用4元斯托克斯矢量 S = [S₀, S₁, S₂, S₃]ᵀ 描述任何偏振态',
        '光学元件用4×4穆勒矩阵表示：S_out = M × S_in',
        '可以处理部分偏振和非偏振光（琼斯演算不能）',
        '考虑了退偏效应：M有16个元素，并非全部独立',
        'Lu-Chipman分解（1996）：M = MΔ × MR × MD（退偏器×延迟器×二向衰减器）',
        '经典实验：用偏振计在多个方向测量以构建M矩阵',
        '对偏振成像、遥感和生物医学光学至关重要',
        '二战期间在MIT为光学仪器开发'
      ]
    },
    story: {
      en: `In 1943, at the height of World War II, physicist Hans Mueller at MIT was working on optical instrumentation when he faced a fundamental limitation: Jones calculus, though elegant, could only describe perfectly polarized light. Real optical systems — with scattering, rough surfaces, and partial polarization — demanded something more.

Mueller's insight was to return to Stokes's century-old parameters. Where Jones used 2×2 complex matrices acting on 2-element electric field vectors, Mueller used 4×4 real matrices acting on 4-element Stokes vectors. The mathematics was larger, but the physical meaning was clearer.

The key insight was to work directly with Stokes parameters — the four measurable quantities Stokes had defined in 1852. Mueller represented these as a 4-element column vector [S₀, S₁, S₂, S₃]ᵀ and optical elements as 4×4 matrices. The output Stokes vector was simply the matrix multiplied by the input vector.

This larger framework could describe things Jones calculus couldn't: scattering that randomizes polarization, surfaces that partially depolarize reflected light, and the complex interactions of light with biological tissue or rough surfaces. The 16 elements of a Mueller matrix captured the complete polarimetric behavior of any optical element.

For decades, Mueller's work remained in technical reports and specialized applications. But in the 1990s, it found new life. In 1996, Shih-Yau Lu and Russell Chipman developed the polar decomposition of Mueller matrices — breaking any M matrix into three physically meaningful components: a diattentuator (polarization-dependent absorption), a retarder (phase shift), and a depolarizer.

This decomposition revolutionized biomedical imaging. Cancerous tissue, it turned out, had distinctively different Mueller matrices than healthy tissue — particularly in the depolarization component. Collagen fibers in healthy skin maintain polarization; disrupted collagen in tumors scrambles it.

Today, Mueller matrix polarimetry is a powerful diagnostic tool. From satellite remote sensing of atmospheric aerosols to non-invasive cancer detection, Mueller's wartime mathematics has become essential to modern optical science.`,
      zh: `1943年，二战最激烈的时期，麻省理工学院的物理学家汉斯·穆勒在研究光学仪器时面临一个根本性的限制：琼斯演算虽然优雅，但只能描述完全偏振光。真实的光学系统——有散射、粗糙表面和部分偏振——需要更强大的工具。

穆勒的洞见是回归斯托克斯一个世纪前的参数。琼斯使用2×2复矩阵作用于2元电场矢量，而穆勒使用4×4实矩阵作用于4元斯托克斯矢量。数学更大了，但物理意义更清晰了。

关键的洞见是直接使用斯托克斯参数——斯托克斯在1852年定义的四个可测量量。穆勒将它们表示为4元列矢量 [S₀, S₁, S₂, S₃]ᵀ，将光学元件表示为4×4矩阵。输出斯托克斯矢量就是矩阵乘以输入矢量。

这个更大的框架可以描述琼斯演算无法描述的事物：使偏振随机化的散射、部分退偏反射光的表面，以及光与生物组织或粗糙表面的复杂相互作用。穆勒矩阵的16个元素捕捉了任何光学元件的完整偏振行为。

几十年来，穆勒的工作只存在于技术报告和专业应用中。但在1990年代，它获得了新生。1996年，卢士尧和Russell Chipman发展了穆勒矩阵的极分解——将任何M矩阵分解为三个有物理意义的分量：二向衰减器（偏振相关吸收）、延迟器（相位偏移）和退偏器。

这种分解彻底改变了生物医学成像。人们发现，癌组织的穆勒矩阵与健康组织有明显不同——特别是在退偏分量上。健康皮肤中的胶原纤维保持偏振；肿瘤中被破坏的胶原则使之散乱。

今天，穆勒矩阵偏振测量是一种强大的诊断工具。从大气气溶胶的卫星遥感到无创癌症检测，穆勒的战时数学已成为现代光学科学不可或缺的一部分。`
    },
    scientistBio: {
      birthYear: 1900,
      deathYear: 1965,
      nationality: 'American',
      portraitEmoji: '📊',
      bioEn: 'Hans Mueller was an American physicist at MIT who developed the Mueller calculus for polarization optics during World War II. His work, though initially confined to technical reports, provided the mathematical foundation for analyzing partially polarized light and became essential for modern polarimetric imaging. The Mueller matrix formalism is now used worldwide in remote sensing, biomedical optics, and materials characterization.',
      bioZh: '汉斯·穆勒是麻省理工学院的美国物理学家，在二战期间发展了偏振光学的穆勒矩阵。他的工作虽然最初只限于技术报告，但为分析部分偏振光提供了数学基础，并成为现代偏振成像不可或缺的工具。穆勒矩阵形式体系现在在世界范围内用于遥感、生物医学光学和材料表征。'
    },
    scene: {
      location: 'MIT, Cambridge, USA',
      season: 'Winter',
      mood: 'wartime innovation'
    },
    references: [
      { title: 'Mueller, H. (1948). The Foundation of Optics. Journal of the Optical Society of America, 38, 661' },
      { title: 'Lu, S. Y., & Chipman, R. A. (1996). Interpretation of Mueller matrices based on polar decomposition', url: 'https://doi.org/10.1364/JOSAA.13.001106' },
      { title: 'Goldstein, D. H. (2011). Polarized Light (3rd ed.). CRC Press' }
    ],
    historicalNote: {
      en: 'Note: Mueller calculus was developed during WWII but remained in technical reports for decades. The Lu-Chipman polar decomposition (1996) brought it into mainstream biomedical imaging by providing physical interpretation of the 16 matrix elements.',
      zh: '注：穆勒矩阵在二战期间发展，但数十年来只存在于技术报告中。Lu-Chipman极分解（1996）通过为16个矩阵元素提供物理解释，将其带入主流生物医学成像领域。'
    },
    linkTo: {
      year: 2018,
      trackTarget: 'polarization',
      descriptionEn: 'Mueller calculus is the foundation for modern polarimetric medical imaging',
      descriptionZh: '穆勒矩阵是现代偏振医学成像的基础'
    },
    thinkingQuestion: {
      en: 'Why do we need both Jones and Mueller calculus? When would you choose one over the other?',
      zh: '为什么我们需要琼斯演算和穆勒矩阵两种方法？什么时候选择其中一种而不是另一种？'
    },
    illustrationType: 'mueller'
  },
  {
    year: 1932,
    titleEn: 'Land\'s Polaroid: Light for Everyone',
    titleZh: '兰德的宝丽来：让光为人人所用',
    descriptionEn: 'Edwin Land invents large-sheet polarizing filters, making polarized light technology accessible for everyday use.',
    descriptionZh: '埃德温·兰德发明大面积偏振滤光片，使偏振光技术可用于日常生活。',
    scientistEn: 'Edwin Land',
    scientistZh: '埃德温·兰德',
    category: 'discovery',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Created sheet polarizers using aligned microscopic crystals',
        'Made polarized sunglasses commercially viable',
        'Developed anti-glare display technology',
        'Founded Polaroid Corporation'
      ],
      zh: [
        '使用排列的微观晶体制造薄片偏振器',
        '使偏振太阳镜商业化',
        '开发防眩光显示技术',
        '创立宝丽来公司'
      ]
    },
    scientistBio: {
      birthYear: 1909,
      deathYear: 1991,
      nationality: 'American',
      portraitEmoji: '📷',
      bioEn: 'Edwin Land held over 500 patents, second only to Edison. He transformed both polarization optics and photography.',
      bioZh: '埃德温·兰德拥有500多项专利，仅次于爱迪生。他改变了偏振光学和摄影两个领域。'
    },
    scene: {
      location: 'Cambridge, Massachusetts',
      season: 'Winter',
      mood: 'entrepreneurial vision'
    },
    linkTo: {
      year: 1828,
      trackTarget: 'polarization',
      descriptionEn: 'Land revolutionized polarizer technology building on Nicol\'s prism',
      descriptionZh: '兰德在尼科尔棱镜基础上革新了偏振技术'
    }
  },
]
