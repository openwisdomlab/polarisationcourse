/**
 * Timeline Events: Electromagnetic Era (1866-1900)
 * 电磁时代 (1866-1900)
 *
 * Experimental confirmation and applications
 */

import type { TimelineEvent } from './types'

export const ELECTROMAGNETIC_EVENTS: TimelineEvent[] = [
  {
    year: 1870,
    titleEn: 'Tyndall Effect',
    titleZh: '廷德尔效应',
    descriptionEn: 'John Tyndall discovers that light passing through a colloidal suspension scatters short wavelengths more strongly, with the scattered light being polarized.',
    descriptionZh: '约翰·廷德尔发现光穿过胶体悬浮液时，短波长散射更强烈，且散射光具有偏振特性。',
    scientistEn: 'John Tyndall',
    scientistZh: '约翰·廷德尔',
    category: 'discovery',
    importance: 2,
    track: 'optics',
    details: {
      en: [
        'Light scattering by particles comparable to or smaller than light wavelength',
        'Blue light scatters more strongly than red light in colloids',
        'Scattered light is partially polarized perpendicular to the incident beam',
        'Observed in smoke, fog, milk, and dilute particle suspensions',
        'Direct experimental precursor to Rayleigh\'s theoretical explanation',
        'Used today to detect particles in air quality monitoring and laser optics'
      ],
      zh: [
        '光被与光波长相当或更小的颗粒散射',
        '蓝光在胶体中的散射比红光更强烈',
        '散射光部分偏振，偏振方向垂直于入射光束',
        '在烟雾、雾气、牛奶和稀释的颗粒悬浮液中观察到',
        '瑞利理论解释的直接实验先驱',
        '今天用于空气质量监测和激光光学中的颗粒检测'
      ]
    },
    story: {
      en: `In 1869-1870, at the Royal Institution in London, John Tyndall — the brilliant Irish physicist who would later become one of the era's great science communicators — was experimenting with light and particles.

Tyndall shone a beam of white light through various solutions and suspensions. What he observed was beautiful and systematic: when tiny particles were present, the beam became visible from the side, and it was distinctly blue!

Using sensitive instruments, Tyndall discovered that this scattered light was polarized. By rotating a Nicol prism, he could dramatically reduce or enhance the visibility of the scattered beam. The polarization was maximum at 90° to the original beam direction.

"The blue light is polarized," Tyndall wrote with excitement. "The vibrations are all in one plane."

Tyndall called this phenomenon "the blue of the sky brought down into the laboratory." He correctly intuited that the same physics governing his laboratory experiments explained why the sky is blue during the day and red at sunset.

What Tyndall observed experimentally, Lord Rayleigh would explain mathematically just a year later. Rayleigh showed that the intensity of scattered light varies as the inverse fourth power of wavelength — blue light (short wavelength) scatters about 10 times more strongly than red light (long wavelength).

The Tyndall effect, as it came to be known, remains a fundamental phenomenon in optics. From detecting air pollution to studying cosmic dust, from analyzing milk homogeneity to guiding laser beams through optical fibers — Tyndall's discovery continues to illuminate our understanding of light-matter interactions.`,
      zh: `1869-1870年，在伦敦皇家研究所，约翰·廷德尔——这位杰出的爱尔兰物理学家后来成为那个时代最伟大的科学传播者之一——正在实验光与颗粒的相互作用。

廷德尔让一束白光穿过各种溶液和悬浮液。他观察到的现象既美丽又系统：当微小颗粒存在时，光束从侧面变得可见，而且明显呈蓝色！

使用灵敏的仪器，廷德尔发现这种散射光是偏振的。通过旋转尼科尔棱镜，他可以显著减少或增强散射光束的可见度。偏振在与原始光束方向成90°时达到最大。

"蓝光是偏振的，"廷德尔兴奋地写道。"振动都在一个平面上。"

廷德尔称这一现象为"被带进实验室的天空的蓝色"。他正确地直觉到，控制他实验室实验的物理学原理解释了为什么天空在白天是蓝色的，而在日落时是红色的。

廷德尔通过实验观察到的现象，瑞利勋爵仅一年后就用数学解释了。瑞利证明散射光的强度与波长的四次方成反比——蓝光（短波长）的散射比红光（长波长）强大约10倍。

廷德尔效应，正如人们后来称呼的那样，仍然是光学中的基本现象。从检测空气污染到研究宇宙尘埃，从分析牛奶均质性到引导激光束通过光纤——廷德尔的发现继续照亮我们对光-物质相互作用的理解。`
    },
    scientistBio: {
      birthYear: 1820,
      deathYear: 1893,
      nationality: 'Irish',
      portraitEmoji: '☁️',
      bioEn: 'John Tyndall was an Irish physicist and prominent science communicator. Besides the Tyndall effect, he demonstrated the greenhouse effect of atmospheric gases, explained why the sky is blue, and pioneered the study of radiant heat. He was known for his dramatic public lectures at the Royal Institution.',
      bioZh: '约翰·廷德尔是爱尔兰物理学家和杰出的科学传播者。除了廷德尔效应外，他还证明了大气气体的温室效应，解释了为什么天空是蓝色的，并开创了辐射热的研究。他以在皇家研究所的戏剧性公开讲座而闻名。'
    },
    scene: {
      location: 'Royal Institution, London',
      season: 'Winter',
      mood: 'experimental discovery'
    },
    references: [
      { title: 'Tyndall, J. (1869). On the blue colour of the sky, the polarization of sky-light, and on the polarization of light by cloudy matter generally. Philosophical Magazine' },
      { title: 'Tyndall, J. (1870). On the action of rays of high refrangibility upon gaseous matter' }
    ],
    linkTo: {
      year: 1871,
      trackTarget: 'polarization',
      descriptionEn: 'Tyndall\'s experimental observations were theoretically explained by Lord Rayleigh the following year',
      descriptionZh: '廷德尔的实验观察在次年被瑞利勋爵从理论上解释'
    },
    thinkingQuestion: {
      en: 'Why does adding milk to water make it appear blue when viewed from the side but orange/yellow when viewed through it? How does this relate to sunsets?',
      zh: '为什么在水中加入牛奶后，从侧面看呈蓝色，但透过它看却呈橙黄色？这与日落有什么关系？'
    },
    illustrationType: 'rayleigh',
    // 廷德尔效应实验演示
    experimentalResources: {
      resourceIds: [
        'scattering-mie-concentration',  // 不同浓度微球散射 (新增)
        'scattering-particle-size',      // 不同粒径散射对比 (新增)
      ],
      featuredImages: [
        {
          url: '/images/scattering/不同浓度 80 nm 微球悬浊液透射光实物图（由左至右浓度递减）.webp',
          caption: 'Transmitted light through colloidal suspensions at different concentrations',
          captionZh: '不同浓度胶体悬浊液的透射光对比'
        }
      ],
      relatedModules: ['rayleigh', 'mie-scattering', 'monte-carlo-scattering']
    }
  },
  {
    year: 1871,
    titleEn: 'Rayleigh Scattering and Sky Polarization',
    titleZh: '瑞利散射与天空偏振',
    descriptionEn: 'Lord Rayleigh explains why the sky is blue and why skylight is polarized — the most common natural polarization phenomenon.',
    descriptionZh: '瑞利勋爵解释了天空为什么是蓝色的，以及为什么天空光是偏振的——这是最常见的自然偏振现象。',
    scientistEn: 'Lord Rayleigh (John William Strutt)',
    scientistZh: '瑞利勋爵（约翰·威廉·斯特拉特）',
    category: 'theory',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Small particles scatter short wavelengths (blue) more than long wavelengths (red)',
        'Scattered light is polarized perpendicular to the scattering plane',
        'Maximum polarization occurs at 90° from the sun',
        'Viking navigators may have used calcite "sunstones" to detect sky polarization for navigation',
        'Bees and other insects use sky polarization for orientation'
      ],
      zh: [
        '小颗粒对短波长（蓝色）的散射强于长波长（红色）',
        '散射光的偏振方向垂直于散射平面',
        '在距太阳90°的方向偏振度最大',
        '维京航海家可能使用方解石"太阳石"探测天空偏振来导航',
        '蜜蜂和其他昆虫利用天空偏振来定向'
      ]
    },
    story: {
      en: `In 1871, John William Strutt — the future Lord Rayleigh — solved one of the oldest puzzles about the sky: why is it blue?

The answer lay in the scattering of sunlight by tiny molecules in the atmosphere. Rayleigh showed mathematically that small particles scatter short wavelengths (blue light) much more strongly than long wavelengths (red light). This explained not only the blue sky during the day but also the red sunsets when sunlight travels through more atmosphere.

But Rayleigh discovered something else equally remarkable: this scattered light is polarized. Look at the sky at 90° from the sun's direction, and you're seeing light that vibrates predominantly in one plane. The sky itself is a giant polarizer!

This phenomenon had practical implications. Legend has it that Viking navigators used crystals of Iceland spar — calcite — as "sunstones" to find the sun on overcast days by detecting the polarization pattern in the sky. Modern research has confirmed this is possible.

Nature was already using sky polarization. Bees, ants, and many other insects have evolved eyes that can detect polarized light, using the sky's polarization pattern as a compass. The mantis shrimp, discovered later, would prove to have the most sophisticated polarization vision of all.

Rayleigh's work showed that polarization isn't just a laboratory curiosity — it's woven into the very fabric of the natural world.`,
      zh: `1871年，约翰·威廉·斯特拉特——未来的瑞利勋爵——解开了关于天空的最古老谜题之一：为什么天空是蓝色的？

答案在于大气中微小分子对阳光的散射。瑞利用数学证明，小颗粒对短波长（蓝光）的散射比对长波长（红光）的散射强得多。这不仅解释了白天蓝色的天空，也解释了当阳光穿过更多大气层时出现的红色日落。

但瑞利发现了同样令人惊叹的另一件事：这种散射的光是偏振的。从距太阳90°的方向看天空，你看到的光主要在一个平面上振动。天空本身就是一个巨大的偏振器！

这一现象有实际意义。传说维京航海家使用冰洲石晶体——方解石——作为"太阳石"，通过检测天空中的偏振图案，在阴天也能找到太阳。现代研究已证实这是可能的。

大自然早已在使用天空偏振。蜜蜂、蚂蚁和许多其他昆虫已经进化出能够探测偏振光的眼睛，利用天空的偏振图案作为指南针。后来发现的螳螂虾，将被证明拥有最精密的偏振视觉。

瑞利的工作表明，偏振不仅仅是实验室里的好奇现象——它是自然界结构的一部分。`
    },
    scientistBio: {
      birthYear: 1842,
      deathYear: 1919,
      nationality: 'English',
      portraitEmoji: '🌤️',
      bioEn: 'John William Strutt, 3rd Baron Rayleigh, was an English physicist who won the Nobel Prize in 1904 for discovering argon. He made major contributions to acoustics, optics, and the theory of scattering. The Rayleigh criterion for optical resolution and Rayleigh-Jeans law are named after him.',
      bioZh: '约翰·威廉·斯特拉特，第三代瑞利男爵，是英国物理学家，1904年因发现氩气获得诺贝尔奖。他在声学、光学和散射理论方面做出了重大贡献。光学分辨率的瑞利准则和瑞利-金斯定律都以他命名。'
    },
    scene: {
      location: 'Cambridge, England',
      season: 'Summer',
      mood: 'natural wonder'
    },
    thinkingQuestion: {
      en: 'If you look at the sky through polarized sunglasses, what changes do you notice? Why is the effect strongest at 90° from the sun?',
      zh: '如果你通过偏振太阳镜看天空，你注意到什么变化？为什么在距太阳90°的方向效果最强？'
    },
    illustrationType: 'rayleigh',
    // 瑞利散射实验演示
    experimentalResources: {
      resourceIds: [
        'scattering-mie-concentration',  // 不同浓度微球散射 (新增)
        'scattering-particle-size',      // 不同粒径散射对比 (新增)
      ],
      featuredImages: [
        {
          url: '/images/scattering/分别为80nm-300nm-3um溶液小球散射效果.webp',
          caption: 'Scattering comparison: 80nm vs 300nm vs 3μm particles - demonstrating Rayleigh to Mie transition',
          captionZh: '散射对比：80nm vs 300nm vs 3μm 颗粒——展示从瑞利散射到米氏散射的过渡'
        }
      ],
      relatedModules: ['rayleigh', 'mie-scattering', 'monte-carlo-scattering']
    }
  },
  {
    year: 1875,
    titleEn: 'Kerr Effect',
    titleZh: '克尔效应',
    descriptionEn: 'John Kerr discovers that an electric field can induce birefringence in normally isotropic materials, enabling high-speed optical modulation.',
    descriptionZh: '约翰·克尔发现电场能在通常各向同性的材料中诱导双折射，实现高速光调制。',
    scientistEn: 'John Kerr',
    scientistZh: '约翰·克尔',
    category: 'discovery',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Electric field applied to glass or liquid creates temporary birefringence',
        'Birefringence is proportional to the square of the electric field: Δn ∝ E²',
        'Effect is extremely fast — enables picosecond optical switching',
        'Used in Kerr cells for high-speed photography shutters',
        'Distinct from Faraday effect: Kerr is quadratic in field, Faraday is linear',
        'Foundation for electro-optic modulators in modern telecommunications',
        'Also observed magneto-optic Kerr effect (MOKE) for studying magnetic materials'
      ],
      zh: [
        '对玻璃或液体施加电场会产生临时双折射',
        '双折射与电场的平方成正比：Δn ∝ E²',
        '效应极快——可实现皮秒级光学开关',
        '用于克尔盒高速摄影快门',
        '与法拉第效应不同：克尔效应与场的平方成正比，法拉第效应与场成线性关系',
        '现代电信中电光调制器的基础',
        '还观察到用于研究磁性材料的磁光克尔效应（MOKE）'
      ]
    },
    story: {
      en: `In Glasgow, 1875, John Kerr — a lecturer at the Free Church Teacher Training College — was exploring the interaction between light and electricity. The great Faraday had already shown that magnetism could rotate polarized light. Could electricity do something similar?

Kerr's approach was systematic. He placed glass plates between electrodes and observed them with polarized light. When he applied a strong electric field, something remarkable happened: the previously isotropic glass became birefringent. It now behaved like a crystal!

The effect was subtle but unmistakable. The glass, under electrical stress, could rotate the polarization of light passing through it. When the field was removed, the effect vanished instantly.

Kerr measured carefully and found a beautiful relationship: the induced birefringence was proportional to the square of the electric field. This "quadratic" dependence distinguished his discovery from Faraday's linear effect.

The practical implications were enormous. Because the effect was almost instantaneous — responding in trillionths of a second — Kerr cells could act as ultra-fast shutters. In the early 20th century, photographers would use Kerr cells to capture phenomena too fast for mechanical shutters: bullets in flight, electrical sparks, and eventually, the first images of nuclear explosions.

Today, Kerr's discovery lives on in electro-optic modulators that switch light in fiber optic networks. Every time you stream a video, Kerr's 150-year-old effect helps carry the signal.`,
      zh: `1875年，格拉斯哥。约翰·克尔——自由教会师范学院的讲师——正在探索光与电的相互作用。伟大的法拉第已经证明磁场可以旋转偏振光。电场能做类似的事情吗？

克尔的方法是系统的。他将玻璃板放在电极之间，用偏振光观察它们。当他施加强电场时，发生了不可思议的事情：原本各向同性的玻璃变成了双折射的。它现在像晶体一样表现！

效应微妙但明确。在电应力下，玻璃可以旋转通过它的光的偏振。当电场移除时，效应立即消失。

克尔仔细测量，发现了一个美丽的关系：诱导的双折射与电场的平方成正比。这种"二次"依赖性使他的发现区别于法拉第的线性效应。

实际意义是巨大的。因为效应几乎是瞬时的——在万亿分之一秒内响应——克尔盒可以充当超高速快门。在20世纪初，摄影师会使用克尔盒捕捉机械快门无法捕获的现象：飞行中的子弹、电火花，最终还有核爆炸的第一批图像。

今天，克尔的发现存在于光纤网络中切换光的电光调制器中。每次你播放视频时，克尔150年前的效应都在帮助传输信号。`
    },
    scientistBio: {
      birthYear: 1824,
      deathYear: 1907,
      nationality: 'Scottish',
      portraitEmoji: '⚡',
      bioEn: 'John Kerr was a Scottish physicist who discovered the electro-optic Kerr effect. He worked as a lecturer at the Free Church Training College in Glasgow for most of his career. He also made contributions to the theory of elasticity.',
      bioZh: '约翰·克尔是苏格兰物理学家，发现了电光克尔效应。他职业生涯的大部分时间在格拉斯哥自由教会师范学院担任讲师。他还对弹性理论做出了贡献。'
    },
    scene: {
      location: 'Glasgow, Scotland',
      season: 'Winter',
      mood: 'experimental precision'
    },
    references: [
      { title: 'Kerr, J. (1875). A new relation between electricity and light' }
    ],
    linkTo: {
      year: 1845,
      trackTarget: 'polarization',
      descriptionEn: 'Kerr\'s electro-optic effect complemented Faraday\'s magneto-optic effect',
      descriptionZh: '克尔的电光效应补充了法拉第的磁光效应'
    },
    thinkingQuestion: {
      en: 'Why is the Kerr effect proportional to E² while the Faraday effect is proportional to B? What fundamental difference does this reflect?',
      zh: '为什么克尔效应与E²成正比，而法拉第效应与B成正比？这反映了什么根本区别？'
    }
  },
  {
    year: 1888,
    titleEn: 'Hertz Confirms Electromagnetic Waves',
    titleZh: '赫兹证实电磁波',
    descriptionEn: 'Heinrich Hertz experimentally confirms Maxwell\'s prediction that electromagnetic waves exist and travel at the speed of light.',
    descriptionZh: '海因里希·赫兹通过实验证实麦克斯韦的预测——电磁波存在并以光速传播。',
    scientistEn: 'Heinrich Hertz',
    scientistZh: '海因里希·赫兹',
    category: 'discovery',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Generated radio waves using a spark-gap transmitter',
        'Detected them with a loop antenna across the room',
        'Measured wavelength and frequency, confirming speed = c',
        'Demonstrated reflection, refraction, and polarization of radio waves',
        'Proved light and radio waves are the same phenomenon at different frequencies',
        'When asked about applications, reportedly said "It\'s of no use whatsoever"',
        'Died at 36, never seeing radio, TV, or radar'
      ],
      zh: [
        '使用火花隙发射器产生无线电波',
        '用环形天线在房间另一端探测到它们',
        '测量了波长和频率，证实速度 = c',
        '演示了无线电波的反射、折射和偏振',
        '证明光和无线电波是同一现象在不同频率下的表现',
        '当被问及应用时，据说他说"这完全没有用处"',
        '36岁去世，从未看到无线电、电视或雷达'
      ]
    },
    story: {
      en: `In Karlsruhe, 1888, a young physics professor named Heinrich Hertz was putting Maxwell's twenty-year-old theory to the ultimate test.

Maxwell had predicted that oscillating electric charges would produce waves — invisible ripples of electric and magnetic fields that traveled at the speed of light. But no one had ever detected such waves.

Hertz built a simple apparatus: two metal rods with a spark gap connected to an induction coil. When sparks jumped the gap, they created rapid oscillations. Across the room, he placed a loop of wire with its own tiny gap.

And there it was: tiny sparks in the receiving loop, synchronized with the transmitter. Invisible waves were crossing the room!

But Hertz didn't stop there. He measured the wavelength by creating standing waves with a metal reflector. He showed the waves could be refracted by a prism of pitch. And crucially, he demonstrated that they were polarized — just like light.

Hertz had confirmed that electromagnetic waves possess the same properties as light — reflection, refraction, and polarization. This proved that visible light is electromagnetic radiation at specific frequencies. Radio waves, infrared, visible light, and X-rays were all the same phenomenon — differing only in frequency. The electromagnetic spectrum was unified.

When a journalist asked Hertz about practical applications, he famously replied: "It's of no use whatsoever." He couldn't imagine radio, television, or the wireless internet. He died in 1894 at just 36, from a bone disease.

Today, the unit of frequency — hertz — bears his name. Every WiFi signal, every radar beam, every microwave oven owes its existence to that laboratory in Karlsruhe where a young physicist first caught an electromagnetic wave.`,
      zh: `1888年，卡尔斯鲁厄。一位名叫海因里希·赫兹的年轻物理学教授正在对麦克斯韦二十年前的理论进行终极测试。

麦克斯韦预测，振荡的电荷会产生波——以光速传播的电场和磁场的无形涟漪。但从未有人探测到这种波。

赫兹建造了一个简单的装置：两根金属棒，中间有一个连接到感应线圈的火花隙。当火花跳过间隙时，会产生快速振荡。在房间的另一端，他放置了一个带有微小间隙的金属环。

就在那里：接收环中出现了与发射器同步的微小火花。无形的波正在穿过房间！

但赫兹没有止步于此。他通过用金属反射器创建驻波来测量波长。他展示了这些波可以被沥青棱镜折射。最关键的是，他证明了它们是偏振的——就像光一样。

赫兹证实了电磁波具有与光相同的性质——反射、折射和偏振。这证明了可见光是特定频率的电磁辐射。无线电波、红外线、可见光和X射线都是同一种现象——只是频率不同。电磁波谱被统一了。

当一位记者问赫兹关于实际应用时，他著名地回答说："这完全没有用处。"他无法想象无线电、电视或无线互联网。他于1894年因骨病去世，年仅36岁。

今天，频率的单位——赫兹——以他的名字命名。每一个WiFi信号、每一束雷达波、每一个微波炉都归功于卡尔斯鲁厄那个实验室，那里一位年轻的物理学家首次捕获了电磁波。`
    },
    scientistBio: {
      birthYear: 1857,
      deathYear: 1894,
      nationality: 'German',
      portraitEmoji: '📡',
      bioEn: 'Heinrich Rudolf Hertz was a German physicist who proved the existence of electromagnetic waves. His work validated Maxwell\'s theory and laid the groundwork for the development of radio, television, and radar. The SI unit of frequency (hertz) is named after him.',
      bioZh: '海因里希·鲁道夫·赫兹是德国物理学家，证明了电磁波的存在。他的工作验证了麦克斯韦的理论，为无线电、电视和雷达的发展奠定了基础。频率的国际单位（赫兹）以他的名字命名。'
    },
    scene: {
      location: 'Karlsruhe, Germany',
      season: 'Autumn',
      mood: 'experimental triumph'
    },
    references: [
      { title: 'Hertz, H. (1888). Über Strahlen elektrischer Kraft' }
    ],
    linkTo: {
      year: 1865,
      trackTarget: 'optics',
      descriptionEn: 'Hertz experimentally confirmed Maxwell\'s electromagnetic theory of light',
      descriptionZh: '赫兹通过实验证实了麦克斯韦的光电磁理论'
    },
    thinkingQuestion: {
      en: 'Hertz said his discovery had "no use whatsoever." Was he wrong? What does this teach us about basic research?',
      zh: '赫兹说他的发现"完全没有用处"。他错了吗？这给我们关于基础研究的什么启示？'
    }
  },
  {
    year: 1892,
    titleEn: 'Poincaré Sphere',
    titleZh: '庞加莱球',
    descriptionEn: 'Henri Poincaré introduces a geometric representation of polarization states on a sphere — complementing Stokes\'s algebraic approach.',
    descriptionZh: '亨利·庞加莱引入一种在球面上几何表示偏振态的方法——作为斯托克斯代数方法的直观补充。',
    scientistEn: 'Henri Poincaré',
    scientistZh: '亨利·庞加莱',
    category: 'theory',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Any polarization state maps to a unique point on the sphere surface',
        'Equator: linear polarization states (horizontal, vertical, diagonal)',
        'Poles: circular polarization (right-handed and left-handed)',
        'Intermediate latitudes: elliptical polarization',
        'Optical elements (wave plates) correspond to rotations on the sphere',
        'Provides intuitive visualization of polarization evolution through optical systems'
      ],
      zh: [
        '任何偏振态都对应球面上的唯一一点',
        '赤道：线偏振态（水平、垂直、对角线）',
        '两极：圆偏振（右旋和左旋）',
        '中间纬度：椭圆偏振',
        '光学元件（波片）对应球面上的旋转',
        '提供偏振态通过光学系统演化的直观可视化'
      ]
    },
    story: {
      en: `In 1892, the great French mathematician Henri Poincaré — a man who seemed to touch every branch of mathematics and physics — turned his attention to polarized light.

Stokes had given us four numbers to describe polarization. But four numbers are abstract. Poincaré asked: can we visualize polarization states geometrically?

His answer was elegant: a sphere. Every possible polarization state corresponds to exactly one point on the surface of a sphere. The equator holds all linear polarization states — horizontal, vertical, and everything in between. The north pole is right-circular polarization; the south pole is left-circular. The space between holds all the elliptical states.

The beauty became apparent when considering optical elements. A quarter-wave plate? That's a 90° rotation around a certain axis. A half-wave plate? A 180° rotation. The evolution of polarization through a complex optical system could be visualized as a path traced on the sphere's surface.

The Poincaré sphere transformed polarization from abstract algebra into visual geometry. Today, every optical engineer learns to think in terms of this sphere. When designing fiber optic communications or calibrating satellite instruments, the Poincaré sphere provides immediate intuition about how polarization will evolve.

Stokes gave us the language of polarization measurement; Poincaré gave us a map to navigate the landscape of polarization states.`,
      zh: `1892年，伟大的法国数学家亨利·庞加莱——一个似乎触及数学和物理学每个分支的人——将注意力转向了偏振光。

斯托克斯给了我们四个数字来描述偏振。但四个数字是抽象的。庞加莱问：我们能从几何上可视化偏振态吗？

他的答案很优雅：一个球。每一种可能的偏振态都恰好对应球面上的一个点。赤道包含所有线偏振态——水平、垂直，以及它们之间的一切。北极是右旋圆偏振；南极是左旋圆偏振。两者之间的空间包含所有椭圆偏振态。

考虑光学元件时，这种美感变得更加明显。四分之一波片？那是绕某个轴旋转90°。半波片？旋转180°。偏振态通过复杂光学系统的演化可以被可视化为球面上的一条路径。

庞加莱球将偏振从抽象代数转变为可视几何。今天，每个光学工程师都学会用这个球来思考。在设计光纤通信或校准卫星仪器时，庞加莱球提供了偏振如何演化的直觉理解。

斯托克斯给了我们偏振测量的语言；庞加莱给了我们导航偏振态图景的地图。`
    },
    scientistBio: {
      birthYear: 1854,
      deathYear: 1912,
      nationality: 'French',
      portraitEmoji: '🌐',
      bioEn: 'Jules Henri Poincaré was a French mathematician, theoretical physicist, and philosopher of science. He made fundamental contributions to topology, celestial mechanics, and relativity theory. He is considered one of the last universalist mathematicians who contributed to nearly every field of mathematics.',
      bioZh: '亨利·庞加莱是法国数学家、理论物理学家和科学哲学家。他对拓扑学、天体力学和相对论做出了根本性贡献。他被认为是最后一位对几乎所有数学领域都有贡献的全才数学家之一。'
    },
    scene: {
      location: 'Paris, France',
      season: 'Winter',
      mood: 'geometric elegance'
    },
    linkTo: {
      year: 1852,
      trackTarget: 'polarization',
      descriptionEn: 'The Poincaré sphere provides a geometric visualization of Stokes parameters',
      descriptionZh: '庞加莱球为斯托克斯参数提供了几何可视化'
    },
    thinkingQuestion: {
      en: 'Why is it useful to represent polarization states on a sphere? What advantage does geometry have over pure algebra?',
      zh: '为什么在球面上表示偏振态是有用的？几何相比纯代数有什么优势？'
    },
    illustrationType: 'poincare'
  },
  {
    year: 1896,
    titleEn: 'Zeeman Effect',
    titleZh: '塞曼效应',
    descriptionEn: 'Pieter Zeeman discovers that spectral lines split in a magnetic field, with the split components being polarized — connecting magnetism, quantum mechanics, and polarization.',
    descriptionZh: '彼得·塞曼发现磁场会使光谱线分裂，且分裂的成分是偏振的——将磁学、量子力学和偏振联系在一起。',
    scientistEn: 'Pieter Zeeman',
    scientistZh: '彼得·塞曼',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Spectral lines split into multiple components in a magnetic field',
        'The split components are polarized: σ components (circularly polarized) and π component (linearly polarized)',
        'Normal Zeeman effect: splitting into three lines (predicted by classical theory)',
        'Anomalous Zeeman effect: more complex splitting (explained by electron spin)',
        'Used in astrophysics to measure stellar magnetic fields',
        'Foundation for magneto-optical spectroscopy'
      ],
      zh: [
        '光谱线在磁场中分裂成多个分量',
        '分裂的成分是偏振的：σ分量（圆偏振）和π分量（线偏振）',
        '正常塞曼效应：分裂成三条线（经典理论预测）',
        '反常塞曼效应：更复杂的分裂（由电子自旋解释）',
        '用于天体物理学测量恒星磁场',
        '磁光光谱学的基础'
      ]
    },
    story: {
      en: `In 1896, in Leiden, a young Dutch physicist named Pieter Zeeman was studying the effect of magnetic fields on light — a topic his mentor Lorentz had suggested might be worth investigating.

Zeeman placed a sodium flame between the poles of a powerful electromagnet and observed the spectral lines through a high-quality spectrometer. When he switched on the magnet, the sharp yellow lines of sodium broadened. Looking more carefully, he saw they had split into multiple components.

This was remarkable enough. But Zeeman discovered something even more profound: the split components were polarized. Looking along the magnetic field, the outer components were circularly polarized (one left-handed, one right-handed). Looking perpendicular to the field, the outer components were linearly polarized perpendicular to the field, while the central component was polarized parallel to it.

Lorentz quickly provided a theoretical explanation based on classical electron theory, predicting a "normal" triplet splitting. But nature had more surprises: many elements showed more complex "anomalous" splitting that classical physics couldn't explain. It would take quantum mechanics — specifically the discovery of electron spin — to resolve this puzzle.

Zeeman and Lorentz shared the 1902 Nobel Prize in Physics. Today, the Zeeman effect is one of the primary tools astronomers use to measure magnetic fields in distant stars and galaxies. When we map the magnetic field of the Sun or detect fields in distant neutron stars, we are using the same polarization signatures Zeeman first observed in his Leiden laboratory.`,
      zh: `1896年，在莱顿，一位名叫彼得·塞曼的年轻荷兰物理学家正在研究磁场对光的影响——这是他的导师洛伦兹建议可能值得研究的课题。

塞曼将钠火焰放在强电磁铁的两极之间，通过高质量分光镜观察光谱线。当他打开磁铁时，钠的明亮黄线变宽了。仔细观察，他发现它们已经分裂成多个分量。

这已经够令人惊奇的了。但塞曼发现了更深刻的东西：分裂的分量是偏振的。沿着磁场方向观察，外侧分量是圆偏振的（一个左旋，一个右旋）。垂直于磁场观察，外侧分量是垂直于磁场的线偏振，而中心分量平行于磁场偏振。

洛伦兹很快基于经典电子理论给出了理论解释，预测了"正常"的三重分裂。但自然界有更多惊喜：许多元素显示出更复杂的"反常"分裂，经典物理无法解释。需要量子力学——特别是电子自旋的发现——才能解决这个谜题。

塞曼和洛伦兹共同获得1902年诺贝尔物理学奖。今天，塞曼效应是天文学家测量遥远恒星和星系磁场的主要工具之一。当我们绘制太阳的磁场图或探测遥远中子星的磁场时，我们使用的正是塞曼在莱顿实验室首次观察到的那些偏振特征。`
    },
    scientistBio: {
      birthYear: 1865,
      deathYear: 1943,
      nationality: 'Dutch',
      portraitEmoji: '🧲',
      bioEn: 'Pieter Zeeman was a Dutch physicist who shared the 1902 Nobel Prize with his mentor Hendrik Lorentz for the discovery of the Zeeman effect. His work bridged classical electromagnetism and quantum mechanics.',
      bioZh: '彼得·塞曼是荷兰物理学家，因发现塞曼效应而与导师洛伦兹共同获得1902年诺贝尔奖。他的工作连接了经典电磁学和量子力学。'
    },
    scene: {
      location: 'Leiden, Netherlands',
      season: 'Autumn',
      mood: 'discovery'
    },
    references: [
      { title: 'Zeeman, P. (1897). The Effect of Magnetisation on the Nature of Light Emitted by a Substance. Nature 55:347' }
    ],
    linkTo: {
      year: 1845,
      trackTarget: 'polarization',
      descriptionEn: 'The Zeeman effect extends Faraday\'s magneto-optical discoveries to spectral lines',
      descriptionZh: '塞曼效应将法拉第的磁光发现扩展到光谱线'
    },
    thinkingQuestion: {
      en: 'Astronomers can measure the magnetic field strength of distant stars using the Zeeman effect. How is polarization the key to this measurement?',
      zh: '天文学家可以利用塞曼效应测量遥远恒星的磁场强度。偏振是如何成为这种测量的关键的？'
    }
  },
  {
    year: 1881,
    titleEn: 'Michelson Interferometer',
    titleZh: '迈克尔逊干涉仪',
    descriptionEn: 'Albert Michelson invents the interferometer, enabling the most precise optical measurements ever made.',
    descriptionZh: '阿尔伯特·迈克尔逊发明干涉仪，实现了有史以来最精确的光学测量。',
    scientistEn: 'Albert Michelson',
    scientistZh: '阿尔伯特·迈克尔逊',
    category: 'discovery',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Split light beam, sent along perpendicular paths, recombined',
        'Interference fringes sensitive to tiny path differences',
        'Enabled sub-wavelength precision in length measurement',
        'Led to 1887 Michelson-Morley experiment disproving ether'
      ],
      zh: [
        '分裂光束，沿垂直路径发送，然后重新组合',
        '干涉条纹对微小路径差异敏感',
        '实现了亚波长精度的长度测量',
        '导致1887年迈克尔逊-莫雷实验否定以太'
      ]
    },
    scientistBio: {
      birthYear: 1852,
      deathYear: 1931,
      nationality: 'American',
      portraitEmoji: '🎯',
      bioEn: 'Albert Michelson was the first American to win a Nobel Prize in science (1907) for his optical precision instruments.',
      bioZh: '阿尔伯特·迈克尔逊是第一位获得诺贝尔科学奖的美国人（1907年），表彰他的光学精密仪器。'
    },
    scene: {
      location: 'Berlin and Cleveland',
      season: 'Spring',
      mood: 'precision and patience'
    }
  },
  {
    year: 1887,
    titleEn: 'Hertz Proves Maxwell\'s Waves',
    titleZh: '赫兹证明麦克斯韦的波动',
    descriptionEn: 'Heinrich Hertz generates and detects electromagnetic waves, confirming light is an electromagnetic phenomenon.',
    descriptionZh: '海因里希·赫兹产生并探测电磁波，证实光是电磁现象。',
    scientistEn: 'Heinrich Hertz',
    scientistZh: '海因里希·赫兹',
    category: 'discovery',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Generated radio waves using a spark-gap transmitter',
        'Detected waves with a loop antenna receiver',
        'Demonstrated reflection, refraction, and polarization of radio waves',
        'Proved Maxwell\'s electromagnetic theory experimentally'
      ],
      zh: [
        '使用火花隙发射器产生无线电波',
        '用环形天线接收器探测波动',
        '演示了无线电波的反射、折射和偏振',
        '实验证明了麦克斯韦电磁理论'
      ]
    },
    scientistBio: {
      birthYear: 1857,
      deathYear: 1894,
      nationality: 'German',
      portraitEmoji: '📻',
      bioEn: 'Heinrich Hertz\'s experiments opened the door to modern telecommunications. The unit of frequency (Hz) is named in his honor.',
      bioZh: '海因里希·赫兹的实验开启了现代电信的大门。频率单位（赫兹）以他的名字命名。'
    },
    scene: {
      location: 'Karlsruhe, Germany',
      season: 'Winter',
      mood: 'triumphant verification'
    },
    linkTo: {
      year: 1865,
      trackTarget: 'optics',
      descriptionEn: 'Hertz experimentally confirmed Maxwell\'s 1865 electromagnetic wave theory',
      descriptionZh: '赫兹实验证实了麦克斯韦1865年的电磁波理论'
    }
  },
]
