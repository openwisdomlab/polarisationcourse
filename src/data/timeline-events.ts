/**
 * Timeline Events Data for Chronicles Page
 * 光的编年史 - 时间线事件数据
 */

export interface TimelineEvent {
  year: number
  titleEn: string
  titleZh: string
  descriptionEn: string
  descriptionZh: string
  scientistEn?: string
  scientistZh?: string
  category: 'discovery' | 'theory' | 'experiment' | 'application'
  importance: 1 | 2 | 3 // 1 = major milestone, 2 = significant, 3 = notable
  // 双轨分类: 'optics' = 广义光学, 'polarization' = 偏振光专属
  track: 'optics' | 'polarization'
  details?: {
    en: string[]
    zh: string[]
  }
  // 生动的故事叙述
  story?: {
    en: string
    zh: string
  }
  // 科学家生平
  scientistBio?: {
    birthYear?: number
    deathYear?: number
    nationality?: string
    portraitEmoji?: string
    bioEn?: string
    bioZh?: string
  }
  // 历史场景
  scene?: {
    location?: string
    season?: string
    mood?: string
  }
  // 参考文献 (用于事实核查)
  references?: {
    title: string
    url?: string
  }[]
  // 故事真实性标注
  historicalNote?: {
    en: string
    zh: string
  }
  // 思考问题 - 激发学生好奇心
  thinkingQuestion?: {
    en: string
    zh: string
  }
  // 实验配图 - 经典实验的可视化
  illustrationType?: 'prism' | 'double-slit' | 'calcite' | 'reflection' | 'polarizer' | 'lcd' | 'mantis' | 'wave' | 'birefringence' | 'nicol' | 'faraday' | 'chirality' | 'rayleigh' | 'poincare' | 'photoelectric' | 'jones' | 'snell' | 'lightspeed' | 'opticalactivity' | 'transverse' | 'stokes' | 'mueller' | 'medical' | 'metasurface' | 'quantum' | 'chromaticpol'
  // 实验资源 - 关联的图片和视频资源（用于可展开的资源画廊）
  experimentalResources?: {
    // 资源ID数组，引用 resource-gallery.ts 中的资源
    resourceIds?: string[]
    // 特色资源（在时间线卡片中直接展示）
    featuredImages?: {
      url: string
      caption?: string
      captionZh?: string
    }[]
    featuredVideo?: {
      url: string
      title?: string
      titleZh?: string
    }
    // 相关模块链接
    relatedModules?: string[]
  }
  // 双轨连接 - 跨轨道因果关系
  linkTo?: {
    year: number
    trackTarget: 'optics' | 'polarization'
    descriptionEn: string
    descriptionZh: string
  }
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  // ===== 广义光学轨道 (General Optics Track) =====
  {
    year: 1621,
    titleEn: 'Snell\'s Law of Refraction',
    titleZh: '斯涅尔折射定律',
    descriptionEn: 'Willebrord Snell discovers the mathematical law governing light refraction at interfaces.',
    descriptionZh: '威理博·斯涅尔发现了光在界面折射时遵循的数学定律。',
    scientistEn: 'Willebrord Snell',
    scientistZh: '威理博·斯涅尔',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'n₁ sin θ₁ = n₂ sin θ₂',
        'Fundamental law relating incident and refracted angles',
        'Foundation for understanding lenses and optical instruments'
      ],
      zh: [
        'n₁ sin θ₁ = n₂ sin θ₂',
        '建立入射角与折射角关系的基本定律',
        '理解透镜和光学仪器的基础'
      ]
    },
    scientistBio: {
      birthYear: 1580,
      deathYear: 1626,
      nationality: 'Dutch',
      portraitEmoji: '📏',
      bioEn: 'Willebrord Snellius was a Dutch astronomer and mathematician. He independently discovered the law of refraction in 1621, though it was not published during his lifetime.',
      bioZh: '威理博·斯涅尔是荷兰天文学家和数学家。他于1621年独立发现了折射定律，但在他生前未曾发表。'
    },
    references: [
      { title: 'Dijksterhuis, F. J. (2004). Lenses and Waves', url: 'https://link.springer.com/book/10.1007/1-4020-2698-8' }
    ],
    thinkingQuestion: {
      en: 'When you put a straw in a glass of water, it appears bent. Is this the same phenomenon as Snell\'s Law? What other everyday examples of refraction can you think of?',
      zh: '当你把吸管放入水杯中，它看起来是弯曲的。这和斯涅尔定律是同一个现象吗？你还能想到生活中哪些折射的例子？'
    },
    illustrationType: 'snell'
  },
  {
    year: 1665,
    titleEn: 'Newton\'s Prism Experiment',
    titleZh: '牛顿三棱镜实验',
    descriptionEn: 'Isaac Newton uses a prism to demonstrate that white light is composed of a spectrum of colors.',
    descriptionZh: '牛顿使用三棱镜证明白光由光谱中的各种颜色组成。',
    scientistEn: 'Isaac Newton',
    scientistZh: '艾萨克·牛顿',
    category: 'experiment',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Performed in his room at Trinity College, Cambridge during plague lockdown',
        'Showed white light splits into red, orange, yellow, green, blue, indigo, violet',
        'Proved colors are inherent properties of light, not added by the prism'
      ],
      zh: [
        '在瘟疫封锁期间于剑桥三一学院的房间里进行',
        '展示白光分解为红、橙、黄、绿、蓝、靛、紫',
        '证明颜色是光的固有属性，而非棱镜添加'
      ]
    },
    story: {
      en: `In 1665, the Great Plague forced Cambridge University to close. A young Isaac Newton, just 23, retreated to his family's farm at Woolsthorpe Manor. There, in isolation, he would have his "annus mirabilis" — his miracle year.

He purchased a glass prism at a country fair, more a toy than a scientific instrument. Back in his darkened room, he drilled a small hole in the window shutter, letting a single beam of sunlight enter.

When the white beam passed through the prism, it spread into a rainbow — a spectrum of colors from red to violet stretched across the opposite wall. But Newton wasn't satisfied with just observing. He placed a second prism in the path of just one color. That color passed through unchanged.

"Light itself is a heterogeneous mixture," he realized. White light wasn't simple; it was a combination of all colors. The prism didn't create colors — it revealed them.

This insight, born in plague-time isolation, became the foundation of spectroscopy. Centuries later, astronomers would use the same principle to discover the composition of distant stars.`,
      zh: `1665年，大瘟疫迫使剑桥大学关闭。年仅23岁的艾萨克·牛顿回到了家乡伍尔斯索普庄园。在那里，在隔离中，他将迎来他的"奇迹年"。

他在一个乡村集市上买了一块玻璃棱镜，与其说是科学仪器，不如说是玩具。回到他昏暗的房间，他在窗板上钻了一个小孔，让一束阳光射入。

当白光穿过棱镜时，它展开成一道彩虹——从红到紫的光谱在对面墙上伸展。但牛顿并不满足于观察。他在一种颜色的路径上放置了第二个棱镜。那种颜色原封不动地通过了。

"光本身是一种异质混合物，"他意识到。白光不是单一的；它是所有颜色的组合。棱镜不是创造颜色——它揭示颜色。

这一洞见诞生于瘟疫隔离期间，成为光谱学的基础。几个世纪后，天文学家将使用同样的原理来发现遥远恒星的成分。`
    },
    scientistBio: {
      birthYear: 1643,
      deathYear: 1727,
      nationality: 'English',
      portraitEmoji: '🍎',
      bioEn: 'Sir Isaac Newton was an English mathematician, physicist, and astronomer. He made seminal contributions to optics, calculus, and mechanics. His work "Opticks" (1704) laid the foundation for the corpuscular theory of light.',
      bioZh: '艾萨克·牛顿爵士是英国数学家、物理学家和天文学家。他对光学、微积分和力学做出了开创性贡献。他的著作《光学》（1704）奠定了光的微粒理论基础。'
    },
    scene: {
      location: 'Woolsthorpe Manor, Lincolnshire, England',
      season: 'Summer',
      mood: 'discovery'
    },
    references: [
      { title: 'Newton, I. (1704). Opticks' },
      { title: 'Westfall, R. S. (1980). Never at Rest: A Biography of Isaac Newton' }
    ],
    thinkingQuestion: {
      en: 'If white light contains all colors, why do objects appear to have different colors? What happens to the other colors?',
      zh: '如果白光包含所有颜色，为什么物体看起来有不同的颜色？其他颜色去哪里了？'
    },
    illustrationType: 'prism'
  },
  {
    year: 1676,
    titleEn: 'First Measurement of Light Speed',
    titleZh: '首次测量光速',
    descriptionEn: 'Ole Rømer calculates the speed of light by observing the moons of Jupiter, proving light travels at finite speed.',
    descriptionZh: '奥勒·罗默通过观测木星卫星计算出光速，证明光以有限速度传播。',
    scientistEn: 'Ole Rømer',
    scientistZh: '奥勒·罗默',
    category: 'discovery',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Observed delays in eclipses of Jupiter\'s moon Io',
        'Calculated light speed as approximately 220,000 km/s (close to modern value)',
        'First proof that light doesn\'t travel instantaneously'
      ],
      zh: [
        '观测到木卫一被木星遮挡时间的延迟',
        '计算出光速约为220,000公里/秒（接近现代数值）',
        '首次证明光不是瞬时传播'
      ]
    },
    scientistBio: {
      birthYear: 1644,
      deathYear: 1710,
      nationality: 'Danish',
      portraitEmoji: '🪐',
      bioEn: 'Ole Rømer was a Danish astronomer who made the first quantitative measurements of the speed of light. He later became the mayor of Copenhagen and reformed Danish weights and measures.',
      bioZh: '奥勒·罗默是丹麦天文学家，首次对光速进行了定量测量。后来他成为哥本哈根市长，并改革了丹麦的度量衡制度。'
    },
    references: [
      { title: 'Cohen, I. B. (1940). Roemer and the First Determination of the Velocity of Light' }
    ],
    thinkingQuestion: {
      en: 'If light travels so fast (300,000 km/s), how did Rømer manage to measure it using only a telescope? What clever trick did he use?',
      zh: '光速如此之快（每秒30万公里），罗默是如何仅用望远镜测量它的？他用了什么巧妙的方法？'
    },
    illustrationType: 'lightspeed'
  },
  {
    year: 1801,
    titleEn: 'Young\'s Double-Slit Experiment',
    titleZh: '杨氏双缝实验',
    descriptionEn: 'Thomas Young demonstrates light interference, providing strong evidence for the wave theory of light.',
    descriptionZh: '托马斯·杨演示了光的干涉现象，为光的波动理论提供了有力证据。',
    scientistEn: 'Thomas Young',
    scientistZh: '托马斯·杨',
    category: 'experiment',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Light passing through two narrow slits creates an interference pattern',
        'Bright and dark bands prove wave-like behavior of light',
        'Challenged Newton\'s corpuscular theory',
        'Foundation for quantum mechanics (later, with electrons)'
      ],
      zh: [
        '光通过两条狭缝后产生干涉图案',
        '明暗条纹证明了光的波动性',
        '挑战了牛顿的微粒说',
        '量子力学的基础（后来用于电子）'
      ]
    },
    story: {
      en: `In 1801, Thomas Young — physician, polymath, and decoder of Egyptian hieroglyphics — performed one of the most beautiful experiments in physics.

He let sunlight pass through a tiny pinhole, then through two closely spaced slits. On the screen behind, instead of two bright lines, he saw something magical: a series of alternating bright and dark bands, like ripples on a pond meeting and interfering.

"Light behaves as a wave," Young concluded. When the peaks of two waves align, they add up (bright). When a peak meets a trough, they cancel (dark). This simple experiment dealt a devastating blow to Newton's beloved particle theory.

Young's contemporaries largely ignored him — Newton's authority was too great. But decades later, Fresnel would build on Young's work to create a complete mathematical theory of light waves. Young lived to see his vindication.

Today, the double-slit experiment remains so profound that Richard Feynman called it "a phenomenon which contains the only mystery" of quantum mechanics.`,
      zh: `1801年，托马斯·杨——医生、博学家、埃及象形文字解读者——进行了物理学史上最美丽的实验之一。

他让阳光通过一个小孔，然后通过两条紧密相邻的狭缝。在后面的屏幕上，他看到的不是两条亮线，而是一系列神奇的明暗交替条纹，就像池塘中相遇并干涉的波纹。

"光像波一样传播，"杨得出结论。当两个波的波峰对齐时，它们叠加（亮）。当波峰遇到波谷时，它们抵消（暗）。这个简单的实验对牛顿钟爱的微粒理论造成了毁灭性打击。

杨的同时代人大多忽视他——牛顿的权威太大了。但几十年后，菲涅尔将在杨的工作基础上建立完整的光波数学理论。杨在有生之年看到了自己的平反。

今天，双缝实验仍然如此深刻，以至于理查德·费曼称它为"包含量子力学唯一奥秘的现象"。`
    },
    scientistBio: {
      birthYear: 1773,
      deathYear: 1829,
      nationality: 'English',
      portraitEmoji: '🌊',
      bioEn: 'Thomas Young was an English polymath who made important contributions to physics, physiology, and Egyptology. Besides the double-slit experiment, he helped decipher the Rosetta Stone and proposed the trichromatic theory of color vision.',
      bioZh: '托马斯·杨是英国博学家，在物理学、生理学和埃及学方面做出了重要贡献。除了双缝实验，他还帮助解读了罗塞塔石碑，并提出了三色视觉理论。'
    },
    scene: {
      location: 'London, England',
      season: 'Spring',
      mood: 'elegance'
    },
    references: [
      { title: 'Young, T. (1802). On the Theory of Light and Colours' },
      { title: 'Robinson, A. (2006). The Last Man Who Knew Everything: Thomas Young' }
    ],
    thinkingQuestion: {
      en: 'Why does the double-slit experiment create bright and dark bands? What would happen if you covered one of the slits?',
      zh: '为什么双缝实验会产生明暗相间的条纹？如果你遮住其中一条缝会发生什么？'
    },
    illustrationType: 'double-slit'
  },
  {
    year: 1865,
    titleEn: 'Maxwell\'s Electromagnetic Theory',
    titleZh: '麦克斯韦电磁理论',
    descriptionEn: 'James Clerk Maxwell unifies electricity, magnetism, and optics, showing light is an electromagnetic wave.',
    descriptionZh: '詹姆斯·克拉克·麦克斯韦统一了电、磁和光学，证明光是电磁波。',
    scientistEn: 'James Clerk Maxwell',
    scientistZh: '詹姆斯·克拉克·麦克斯韦',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Four elegant equations describe all electromagnetic phenomena',
        'Predicted the speed of electromagnetic waves matches light speed',
        'Light is oscillating electric and magnetic fields',
        'Foundation for radio, TV, wireless communication'
      ],
      zh: [
        '四个优雅的方程描述所有电磁现象',
        '预测电磁波速度与光速相同',
        '光是振荡的电场和磁场',
        '无线电、电视、无线通信的基础'
      ]
    },
    story: {
      en: `In 1865, James Clerk Maxwell wrote down four equations that would change humanity forever. Working at his estate in Glenlair, Scotland, he unified two seemingly unrelated forces — electricity and magnetism — into a single, beautiful theory.

Then came the revelation: from his equations, he derived that electromagnetic disturbances travel as waves at a speed of about 310,000 km/s. This was suspiciously close to the known speed of light.

"We can scarcely avoid the inference," Maxwell wrote with understated British reserve, "that light consists in the transverse undulations of the same medium which is the cause of electric and magnetic phenomena."

Light itself was an electromagnetic wave! The colors we see, the warmth of the sun, the signals in our phones — all manifestations of the same fundamental phenomenon, described by four simple equations.

Einstein later called Maxwell's work "the most profound and the most fruitful that physics has experienced since the time of Newton." Maxwell died young at 48, just before Hertz experimentally confirmed his predictions. He never knew how thoroughly he had revolutionized human civilization.`,
      zh: `1865年，詹姆斯·克拉克·麦克斯韦写下了将永远改变人类的四个方程。在他位于苏格兰格伦莱尔的庄园工作时，他将两种看似无关的力——电和磁——统一成一个单一而美丽的理论。

然后启示来了：从他的方程中，他推导出电磁扰动以约310,000公里/秒的速度以波的形式传播。这与已知的光速惊人地接近。

"我们几乎不可能避免这样的推论，"麦克斯韦以含蓄的英国风格写道，"光由同一介质的横向波动组成，而这种介质正是电磁现象的原因。"

光本身就是电磁波！我们看到的颜色、太阳的温暖、手机中的信号——都是同一基本现象的表现，由四个简单的方程描述。

爱因斯坦后来称麦克斯韦的工作是"自牛顿以来物理学经历的最深刻、最富有成果的工作"。麦克斯韦年仅48岁便英年早逝，就在赫兹实验验证他的预测之前。他从未知道自己多么彻底地改变了人类文明。`
    },
    scientistBio: {
      birthYear: 1831,
      deathYear: 1879,
      nationality: 'Scottish',
      portraitEmoji: '⚡',
      bioEn: 'James Clerk Maxwell was a Scottish physicist who formulated classical electromagnetic theory. His equations unified electricity, magnetism, and optics into a single coherent framework. He also made significant contributions to statistical mechanics and the theory of color.',
      bioZh: '詹姆斯·克拉克·麦克斯韦是苏格兰物理学家，建立了经典电磁理论。他的方程将电、磁和光学统一成一个连贯的框架。他还对统计力学和色彩理论做出了重要贡献。'
    },
    scene: {
      location: 'Glenlair, Scotland',
      season: 'Autumn',
      mood: 'unification'
    },
    references: [
      { title: 'Maxwell, J. C. (1865). A Dynamical Theory of the Electromagnetic Field' },
      { title: 'Mahon, B. (2003). The Man Who Changed Everything: The Life of James Clerk Maxwell' }
    ],
    thinkingQuestion: {
      en: 'Maxwell showed that light is an electromagnetic wave. But what about radio waves, X-rays, and microwaves? Are they related to light?',
      zh: '麦克斯韦证明了光是电磁波。那么无线电波、X射线和微波呢？它们与光有关系吗？'
    },
    linkTo: {
      year: 1845,
      trackTarget: 'polarization',
      descriptionEn: 'Faraday\'s discovery that magnetism could rotate polarized light provided experimental evidence for the light-electromagnetism connection',
      descriptionZh: '法拉第发现磁场能旋转偏振光，为光与电磁的联系提供了实验证据'
    },
    illustrationType: 'wave'
  },
  // ===== 偏振光轨道 (Polarization Track) =====
  {
    year: 1669,
    titleEn: 'Discovery of Double Refraction',
    titleZh: '双折射现象的发现',
    descriptionEn: 'Erasmus Bartholin discovers that calcite crystals produce double images, the first observation of birefringence.',
    descriptionZh: '巴托林发现方解石晶体能产生双像，这是人类首次观察到双折射现象。',
    scientistEn: 'Erasmus Bartholin',
    scientistZh: '伊拉斯谟·巴托林',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Bartholin observed that objects viewed through Iceland spar (calcite) appeared double',
        'He called the phenomenon "strange refraction"',
        'This discovery would later be explained by polarization theory'
      ],
      zh: [
        '巴托林观察到通过冰洲石（方解石）观看物体会出现双像',
        '他称这一现象为"奇异折射"',
        '这一发现后来被偏振理论所解释'
      ]
    },
    references: [
      { title: 'Bartholin, E. (1669). Experimenta crystalli Islandici disdiaclastici' }
    ],
    story: {
      en: `The year was 1669, in the ancient university city of Copenhagen. Professor Erasmus Bartholin sat in his study, surrounded by the curiosities that sailors brought back from distant Iceland — transparent crystals they called "Iceland spar."

As the afternoon sun slanted through his window, Bartholin placed one of these rhombohedral crystals on a sheet of paper marked with a single dot. He blinked in disbelief. Where there should have been one dot, he now saw two, perfectly clear and distinct.

He rotated the crystal. One image stayed still while the other danced around it in a circle. "What sorcery is this?" he muttered, rubbing his eyes. But the phenomenon persisted, day after day, crystal after crystal.

Bartholin had stumbled upon something that would puzzle the greatest minds for the next century and a half — light could somehow split itself in two. He called it "strange refraction," never knowing he had opened the door to an entirely new understanding of light itself.

Little did he know that this transparent stone from the frozen north would one day revolutionize everything from sunglasses to LCD screens.`,
      zh: `1669年，丹麦哥本哈根这座古老的大学城里。伊拉斯谟·巴托林教授坐在他的书房中，四周摆满了水手们从遥远的冰岛带回的奇珍异物——一种被称为"冰洲石"的透明晶体。

当午后的阳光斜射进窗户，巴托林将一块菱形晶体放在一张画有单点的纸上。他不敢相信自己的眼睛——本应只有一个点，他却清晰地看到了两个！

他转动晶体。一个像保持不动，另一个却绕着它旋转。"这是什么魔法？"他喃喃自语，揉了揉眼睛。但这现象日复一日、晶体复晶体地持续着。

巴托林偶然发现了一个将困扰此后一个半世纪最伟大头脑的谜题——光竟然能够一分为二。他称之为"奇异折射"，却从未想到自己已经推开了一扇通往全新光学世界的大门。

他不会知道，这块来自冰封北方的透明石头，有朝一日将彻底改变从太阳镜到液晶屏幕的一切。`
    },
    scientistBio: {
      birthYear: 1625,
      deathYear: 1698,
      nationality: 'Danish',
      portraitEmoji: '👨‍🔬',
      bioEn: 'Erasmus Bartholin was a Danish physician, mathematician, and physicist. Besides his famous discovery of double refraction, he made significant contributions to medicine and was one of the first to describe the properties of quinine for treating malaria.',
      bioZh: '伊拉斯谟·巴托林是丹麦医生、数学家和物理学家。除了著名的双折射发现外，他还对医学做出了重要贡献，是最早描述奎宁治疗疟疾特性的人之一。'
    },
    scene: {
      location: 'Copenhagen, Denmark',
      season: 'Autumn',
      mood: 'curiosity'
    },
    thinkingQuestion: {
      en: 'Why does calcite create two images? What property of light could cause it to split into two separate beams?',
      zh: '为什么方解石会产生两个像？光的什么性质会导致它分裂成两束？'
    },
    illustrationType: 'calcite'
  },
  {
    year: 1690,
    titleEn: 'Huygens\' Wave Theory',
    titleZh: '惠更斯的波动理论',
    descriptionEn: 'Christiaan Huygens proposes the wave theory of light and attempts to explain double refraction.',
    descriptionZh: '惠更斯提出光的波动理论，并尝试解释双折射现象。',
    scientistEn: 'Christiaan Huygens',
    scientistZh: '克里斯蒂安·惠更斯',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Published "Treatise on Light" (Traité de la Lumière)',
        'Introduced the wavelet construction method (Huygens\' principle)',
        'Explained ordinary and extraordinary rays in calcite using different wave velocities'
      ],
      zh: [
        '出版《光论》（Traité de la Lumière）',
        '提出波动构造法（惠更斯原理）',
        '用不同的波速解释了方解石中的寻常光和非常光'
      ]
    },
    story: {
      en: `In the candlelit study of The Hague, 1690, Christiaan Huygens — clockmaker, astronomer, and one of Europe's greatest minds — turned over Bartholin's calcite crystal in his weathered hands. The mystery of the double image had haunted him for years.

Newton's corpuscular theory said light was made of particles. But particles couldn't explain this. Huygens had another idea: what if light was a wave, rippling through an invisible "ether" that filled all space?

He imagined each point on a wavefront as a tiny source of new wavelets, spreading outward like ripples from raindrops on a pond. This simple idea would become "Huygens' Principle" — still taught in physics classes today.

But the Iceland spar demanded more. Huygens proposed something radical: inside the crystal, there existed not one but two types of waves, traveling at different speeds in different directions. One obeyed normal rules; the other was "extraordinary."

His theory was elegant, almost magical in its beauty. Yet even Huygens could not fully explain why light split in two. That secret would require another century — and the concept of polarization — to unlock.

In his dedication, he wrote: "One finds in this subject a kind of demonstration which brings with it a degree of certainty equal to that of Geometry." He was a prophet of the wave nature of light, vindicated only after his death.`,
      zh: `1690年，海牙。烛光摇曳的书房里，克里斯蒂安·惠更斯——钟表匠、天文学家，欧洲最伟大的头脑之一——用他那饱经风霜的双手翻转着巴托林的方解石晶体。双像之谜已困扰他多年。

牛顿的微粒说认为光是由粒子组成的。但粒子无法解释眼前的现象。惠更斯有另一个想法：如果光是一种波，在充满整个空间的无形"以太"中荡漾呢？

他想象波前的每一个点都是一个微小的波源，向四周散开，就像池塘里雨滴激起的涟漪。这个简单的想法后来成为"惠更斯原理"——至今仍在物理课堂上讲授。

但冰洲石需要更深入的解释。惠更斯提出了一个激进的设想：在晶体内部，存在的不是一种而是两种波，它们以不同的速度沿不同方向传播。一种遵循正常规则；另一种则是"非常"的。

他的理论优雅至极，几乎有一种魔幻的美。然而即使是惠更斯，也无法完全解释光为何一分为二。这个秘密还需要再等一个世纪——等待"偏振"概念的诞生。

他在献词中写道："在这门学科中，人们会发现一种论证方式，它所带来的确定性程度等同于几何学。"他是光波动性的先知，但直到身后才得到证明。`
    },
    scientistBio: {
      birthYear: 1629,
      deathYear: 1695,
      nationality: 'Dutch',
      portraitEmoji: '🔭',
      bioEn: 'Christiaan Huygens was a Dutch polymath who made groundbreaking contributions to optics, astronomy, and mechanics. He invented the pendulum clock, discovered Saturn\'s moon Titan, and correctly described Saturn\'s rings. His wave theory of light, though initially overshadowed by Newton\'s corpuscular theory, was eventually proven correct.',
      bioZh: '克里斯蒂安·惠更斯是荷兰博学家，在光学、天文学和力学领域做出了开创性贡献。他发明了摆钟，发现了土星的卫星土卫六，并正确描述了土星环。他的光波动理论虽然最初被牛顿的微粒说所掩盖，但最终被证明是正确的。'
    },
    scene: {
      location: 'The Hague, Netherlands',
      season: 'Winter',
      mood: 'contemplation'
    },
    references: [
      { title: 'Huygens, C. (1690). Traité de la Lumière' },
      { title: 'Dijksterhuis, F. J. (2004). Lenses and Waves: Christiaan Huygens and the Mathematical Science of Optics' }
    ],
    thinkingQuestion: {
      en: 'Huygens imagined light as a wave in an invisible "ether". If the ether doesn\'t exist, how can light waves travel through empty space?',
      zh: '惠更斯把光想象成在无形"以太"中传播的波。如果以太不存在，光波如何能在真空中传播？'
    },
    illustrationType: 'wave'
  },
  {
    year: 1808,
    titleEn: 'Discovery of Polarization by Reflection',
    titleZh: '反射偏振的发现',
    descriptionEn: 'Étienne-Louis Malus discovers that light reflected from glass becomes polarized while observing the Luxembourg Palace.',
    descriptionZh: '马吕斯在观察卢森堡宫时，发现玻璃反射的光会发生偏振。',
    scientistEn: 'Étienne-Louis Malus',
    scientistZh: '艾蒂安-路易·马吕斯',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Malus was looking at the setting sun\'s reflection through a calcite crystal',
        'He noticed the double image intensity changed as he rotated the crystal',
        'Coined the term "polarization" for this phenomenon',
        'This accidental discovery won him the French Academy prize'
      ],
      zh: [
        '马吕斯当时正通过方解石晶体观看夕阳的反射',
        '他注意到旋转晶体时双像的强度会发生变化',
        '他创造了"偏振"一词来描述这一现象',
        '这一偶然发现为他赢得了法国科学院奖'
      ]
    },
    story: {
      en: `It was a golden autumn evening in Paris, 1808. The setting sun painted the windows of the Luxembourg Palace in brilliant orange as Étienne-Louis Malus gazed at the scene from his apartment on Rue d'Enfer — the "Street of Hell."

The young military engineer, fresh from Napoleon's Egyptian campaign where desert sands had nearly claimed his eyesight, held a calcite crystal up to the light — a gift from a fellow soldier who knew of his fascination with optics.

Looking through the crystal at the reflected sunlight from the palace windows, he expected to see the familiar double image. But something strange happened: as he rotated the crystal, one image faded while the other grew brighter, and then they reversed!

Malus's heart raced. He ran into the street, trying window after window, glass after glass. The same effect, always at a certain angle. The reflected light was somehow... different. Changed. "Polarized," he would later call it, borrowing a term from magnetism.

He had discovered — quite by accident, in the failing light of a Paris sunset — that ordinary glass could do what only rare crystals were thought capable of: create polarized light. The observation took mere seconds. The revolution it sparked would last forever.

Years later, dying young from tuberculosis contracted in Egypt, Malus would be remembered not for his military service, but for that single magical moment when the setting sun revealed one of nature's deepest secrets.`,
      zh: `1808年，巴黎的一个金色秋日傍晚。落日将卢森堡宫的窗户染成绚烂的橘色，艾蒂安-路易·马吕斯从他在"地狱街"的公寓里凝望着这幅美景。

这位年轻的军事工程师刚从拿破仑的埃及远征归来，沙漠的风沙差点夺去他的视力。他手持一块方解石晶体对着光看——那是一位战友送的礼物，知道他对光学的痴迷。

透过晶体观看宫殿窗户反射的阳光，他本以为会看到熟悉的双像。但奇怪的事情发生了：当他转动晶体时，一个像变淡，另一个却变亮，然后又互换了！

马吕斯的心跳加速。他冲到街上，一扇窗接一扇窗、一块玻璃接一块玻璃地尝试。相同的效果，总是在特定角度出现。反射的光似乎……不同了。改变了。他后来称之为"偏振"，这个词借自磁学术语。

他在巴黎落日的余晖中，完全出于偶然，发现了一个惊人的事实——普通玻璃也能做到只有稀有晶体才能做到的事：产生偏振光。这个观察只用了几秒钟，但它引发的革命将永远持续。

多年后，马吕斯因在埃及感染的肺结核英年早逝。人们记住他，不是因为他的军旅生涯，而是因为那个神奇的瞬间——落日向他揭示了自然界最深奥的秘密之一。`
    },
    scientistBio: {
      birthYear: 1775,
      deathYear: 1812,
      nationality: 'French',
      portraitEmoji: '🎖️',
      bioEn: 'Étienne-Louis Malus was a French military engineer and physicist. He participated in Napoleon\'s Egyptian campaign (1798-1801) and nearly lost his eyesight to ophthalmia. Despite his short life, he made fundamental contributions to optics and won the Rumford Medal from the Royal Society. He died at just 37 from tuberculosis.',
      bioZh: '艾蒂安-路易·马吕斯是法国军事工程师和物理学家。他参加了拿破仑的埃及远征（1798-1801），差点因眼炎失明。尽管他的生命短暂，但他对光学做出了根本性贡献，并获得了皇家学会的伦福德奖章。他年仅37岁便因肺结核去世。'
    },
    scene: {
      location: 'Paris, France',
      season: 'Autumn',
      mood: 'serendipity'
    },
    references: [
      { title: 'Malus, E. L. (1809). Sur une propriété de la lumière réfléchie' },
      { title: 'Buchwald, J. Z. (1989). The Rise of the Wave Theory of Light: Optical Theory and Experiment in the Early Nineteenth Century' }
    ],
    thinkingQuestion: {
      en: 'Malus discovered polarization by accident while looking at a sunset. What other great scientific discoveries were made by accident?',
      zh: '马吕斯在观看日落时偶然发现了偏振现象。还有哪些伟大的科学发现是偶然发生的？'
    },
    illustrationType: 'reflection'
  },
  {
    year: 1809,
    titleEn: 'Malus\'s Law',
    titleZh: '马吕斯定律',
    descriptionEn: 'Malus formulates the law describing how polarized light intensity varies with analyzer angle: I = I₀cos²θ.',
    descriptionZh: '马吕斯提出描述偏振光强度随检偏器角度变化的定律：I = I₀cos²θ。',
    scientistEn: 'Étienne-Louis Malus',
    scientistZh: '艾蒂安-路易·马吕斯',
    category: 'theory',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'The intensity of transmitted light follows a cosine-squared relationship',
        'When θ = 90°, no light passes through (crossed polarizers)',
        'This law is fundamental to all polarization applications'
      ],
      zh: [
        '透射光强度遵循余弦平方关系',
        '当 θ = 90° 时，没有光通过（正交偏振器）',
        '这一定律是所有偏振应用的基础'
      ]
    },
    story: {
      en: `Following his sensational discovery, Malus became obsessed with understanding polarization. His laboratory in Paris became a realm of dancing light and spinning crystals.

Night after night, by candlelight, he would stack two Iceland spar crystals and rotate one against the other, meticulously measuring the brightness of the transmitted beam. As the angle between them increased, the light dimmed according to a beautiful, simple pattern.

When the crystals were aligned, light passed through unhindered. But as he rotated one crystal, the light gradually faded until — at exactly 90 degrees — darkness. Complete, utter darkness, as if the light had simply vanished from existence.

"The intensity follows the square of the cosine," he wrote in his elegant French script. I = I₀ cos²θ. A simple formula that captured the essence of polarized light's behavior.

This was no mere curiosity. Malus had discovered a fundamental law of nature — one that would later make possible everything from photography filters to liquid crystal displays. Every time you adjust a polarizing filter or watch a movie in 3D, you are witnessing Malus's Law in action.

Tragically, Malus would not live to see his law's full impact. He died just three years later, at 37. But his elegant equation became immortal — carved into physics textbooks for eternity.`,
      zh: `在那个轰动性发现之后，马吕斯开始痴迷于理解偏振现象。他在巴黎的实验室变成了一个充满跳跃光线和旋转晶体的世界。

一夜又一夜，借着烛光，他将两块冰洲石晶体叠放，旋转其中一块，仔细测量透射光束的亮度。随着它们之间角度的增加，光线按照一种美丽而简单的规律逐渐变暗。

当晶体对齐时，光线畅通无阻地通过。但当他旋转一块晶体时，光线逐渐减弱，直到——在恰好90度时——一片漆黑。完全的、彻底的黑暗，仿佛光线从存在中消失了一样。

"强度遵循余弦的平方，"他用优雅的法语写道。I = I₀ cos²θ。一个简单的公式，却捕捉到了偏振光行为的精髓。

这不仅仅是一个好奇心的发现。马吕斯发现了一条自然界的基本定律——这条定律后来使从摄影滤镜到液晶显示器的一切成为可能。每当你调整偏振滤镜或观看3D电影时，你都在目睹马吕斯定律的作用。

悲剧的是，马吕斯没能活着看到他的定律产生的全部影响。他在三年后去世，年仅37岁。但他那优雅的方程式变得不朽——永远镌刻在物理教科书中。`
    },
    scientistBio: {
      birthYear: 1775,
      deathYear: 1812,
      nationality: 'French',
      portraitEmoji: '🎖️',
      bioEn: 'Étienne-Louis Malus was a French military engineer and physicist. He participated in Napoleon\'s Egyptian campaign (1798-1801) and nearly lost his eyesight to ophthalmia. Despite his short life, he made fundamental contributions to optics and won the Rumford Medal from the Royal Society. He died at just 37 from tuberculosis.',
      bioZh: '艾蒂安-路易·马吕斯是法国军事工程师和物理学家。他参加了拿破仑的埃及远征（1798-1801），差点因眼炎失明。尽管他的生命短暂，但他对光学做出了根本性贡献，并获得了皇家学会的伦福德奖章。他年仅37岁便因肺结核去世。'
    },
    scene: {
      location: 'Paris, France',
      season: 'Winter',
      mood: 'determination'
    },
    references: [
      { title: 'Malus, E. L. (1810). Théorie de la double réfraction de la lumière' }
    ],
    thinkingQuestion: {
      en: 'Malus\'s Law shows that at 90° the light is completely blocked. What everyday objects use this "crossed polarizers" effect?',
      zh: '马吕斯定律表明在90°时光被完全阻挡。日常生活中有哪些物品利用这种"正交偏振片"效应？'
    },
    illustrationType: 'polarizer'
  },
  {
    year: 1811,
    titleEn: 'Brewster\'s Angle',
    titleZh: '布儒斯特角',
    descriptionEn: 'David Brewster discovers the angle at which reflected light is completely polarized.',
    descriptionZh: '布儒斯特发现反射光完全偏振时的特定角度。',
    scientistEn: 'David Brewster',
    scientistZh: '大卫·布儒斯特',
    category: 'discovery',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'At Brewster\'s angle, reflected light is 100% polarized',
        'The angle depends on the refractive indices of both media',
        'tan(θB) = n₂/n₁',
        'This principle is used in polarizing windows and laser optics'
      ],
      zh: [
        '在布儒斯特角下，反射光100%偏振',
        '该角度取决于两种介质的折射率',
        'tan(θB) = n₂/n₁',
        '这一原理被用于偏振窗和激光光学'
      ]
    },
    story: {
      en: `In the misty hills of Scotland, 1811, a young Presbyterian minister named David Brewster spent his evenings not in prayer, but in the pursuit of light. His nervous disposition made preaching unbearable, but in science, he found his true calling.

Inspired by Malus's discovery across the Channel, Brewster set up a simple experiment: a beam of light striking a glass plate at various angles, viewed through his precious calcite crystal. Most angles gave partial polarization. But then — at one precise angle — the reflected beam became perfectly polarized.

Night after night, he varied the angle by fractions of a degree, varied the materials — water, glass, diamond — and always found that magical angle. And he discovered something remarkable: this angle depended only on the ratio of refractive indices.

tan(θB) = n₂/n₁

Such elegant simplicity! The "Brewster angle" — as it would be known — was not arbitrary but dictated by the very nature of the materials involved.

Brewster would go on to live a long, prolific life, inventing the kaleidoscope (which made him famous but earned him little money) and pioneering photography. But perhaps his most lasting gift was this: a precise angle where nature reveals its hidden structure, used today in every laser system and countless optical instruments.

The minister who couldn't preach had found a different kind of sermon — written in angles and light.`,
      zh: `1811年，苏格兰雾气缭绕的山丘间，一位名叫大卫·布儒斯特的年轻长老会牧师，将夜晚的时光不是花在祈祷上，而是花在追寻光的奥秘上。他紧张的性格让他无法忍受布道，但在科学中，他找到了自己真正的使命。

受到海峡对岸马吕斯发现的启发，布儒斯特设计了一个简单的实验：让光束以不同角度照射玻璃板，然后通过他珍贵的方解石晶体观察。大多数角度只能产生部分偏振。但突然——在一个精确的角度——反射光束变得完美偏振！

一夜又一夜，他以零点几度的精度改变角度，更换材料——水、玻璃、钻石——总能找到那个神奇的角度。他发现了一个惊人的规律：这个角度只取决于折射率之比。

tan(θB) = n₂/n₁

如此优雅的简洁！这个后来被称为"布儒斯特角"的角度，并非随意，而是由材料的本质特性所决定。

布儒斯特后来过着漫长而多产的一生，发明了万花筒（使他声名鹊起但没赚到多少钱），并开创了摄影技术。但也许他最持久的贡献是这个：一个自然界揭示其隐藏结构的精确角度，如今被应用于每一个激光系统和无数光学仪器中。

那位无法布道的牧师找到了另一种布道——用角度和光写成。`
    },
    scientistBio: {
      birthYear: 1781,
      deathYear: 1868,
      nationality: 'Scottish',
      portraitEmoji: '🔬',
      bioEn: 'Sir David Brewster was a Scottish physicist, mathematician, and inventor. Originally trained as a Presbyterian minister, he abandoned preaching due to stage fright. He invented the kaleidoscope, improved the stereoscope, and made fundamental discoveries in optics. He was knighted in 1831 and served as Principal of the University of Edinburgh.',
      bioZh: '大卫·布儒斯特爵士是苏格兰物理学家、数学家和发明家。他最初受训成为长老会牧师，但因怯场而放弃布道。他发明了万花筒，改进了立体镜，并在光学领域做出了根本性发现。1831年被封为爵士，并担任爱丁堡大学校长。'
    },
    scene: {
      location: 'Edinburgh, Scotland',
      season: 'Spring',
      mood: 'precision'
    },
    thinkingQuestion: {
      en: 'Polarized sunglasses reduce glare from water and roads. How does Brewster\'s angle explain why they work so well?',
      zh: '偏振太阳镜可以减少水面和道路的眩光。布儒斯特角如何解释它们为什么如此有效？'
    },
    illustrationType: 'reflection'
  },
  {
    year: 1811,
    titleEn: 'Chromatic Polarization',
    titleZh: '色偏振现象',
    descriptionEn: 'François Arago discovers that thin crystalline plates between crossed polarizers display vivid interference colors — revealing the wave nature of polarized light.',
    descriptionZh: '阿拉戈发现薄晶体片置于正交偏振片之间会显示绚丽的干涉颜色——揭示了偏振光的波动本质。',
    scientistEn: 'François Arago',
    scientistZh: '弗朗索瓦·阿拉戈',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Thin mica or quartz plates between crossed polarizers show vivid colors',
        'Different thicknesses produce different colors due to phase retardation',
        'Colors arise from interference between ordinary and extraordinary rays',
        'Discovered during collaboration with Biot on polarization studies',
        'Foundation for stress analysis and crystallography',
        'Classic experiment: rotating the analyzer reveals color changes'
      ],
      zh: [
        '薄云母片或石英片置于正交偏振片之间显示绚丽颜色',
        '不同厚度因相位延迟产生不同颜色',
        '颜色源于寻常光和非常光的干涉',
        '在与毕奥合作研究偏振时发现',
        '应力分析和晶体学的基础',
        '经典实验：转动检偏器可观察颜色变化'
      ]
    },
    story: {
      en: `In 1811, in the laboratories of the Paris Observatory, a young astronomer named François Arago was conducting experiments with polarized light. Following Malus's recent discovery, Arago was systematically studying how various materials affected polarization.

One evening, he placed a thin sheet of mica between two tourmaline crystals (natural polarizers) arranged at right angles. What he saw made him gasp in wonder: brilliant colors — blues, yellows, purples — dancing across the crystal like a stained glass window illuminated by candlelight.

Arago carefully rotated the analyzing crystal. The colors shifted, transformed, reversed. Where there had been red, now appeared green. Where yellow glowed, violet emerged. The thinner the mica, the longer the wavelengths of color; thicker sheets produced shorter wavelength hues.

"The colors arise from the interference of polarized rays," Arago realized. The mica was splitting light into two components (ordinary and extraordinary rays) that traveled at slightly different speeds. When they recombined at the analyzer, some wavelengths reinforced while others cancelled — producing pure spectral colors.

This "chromatic polarization" became a powerful tool. Engineers would later use it to visualize stress in glass and plastic (photoelasticity). Mineralogists used it to identify crystals. The beautiful colors Arago discovered in his candlelit laboratory became the foundation of an entire field of optical analysis.

Today, if you've ever seen the rainbow patterns in a stressed plastic ruler viewed through polarized sunglasses, you've witnessed Arago's discovery.`,
      zh: `1811年，在巴黎天文台的实验室里，一位名叫弗朗索瓦·阿拉戈的年轻天文学家正在进行偏振光实验。在马吕斯最近发现的启发下，阿拉戈系统地研究各种材料如何影响偏振。

一天晚上，他将一片薄云母片放在两块呈直角排列的电气石晶体（天然偏振器）之间。他看到的景象令他惊叹不已：绚丽的颜色——蓝色、黄色、紫色——在晶体上跃动，宛如烛光照亮的彩色玻璃窗。

阿拉戈小心地转动检偏晶体。颜色变换、转化、逆转。原来是红色的地方变成了绿色。黄色发光的地方出现了紫色。云母越薄，颜色的波长越长；较厚的薄片产生较短波长的色调。

"这些颜色源于偏振光线的干涉，"阿拉戈意识到。云母将光分成两个分量（寻常光和非常光），它们以略有不同的速度传播。当它们在检偏器处重新组合时，某些波长加强而另一些相消——产生纯净的光谱色彩。

这种"色偏振"成为一种强大的工具。工程师后来用它来可视化玻璃和塑料中的应力（光弹性法）。矿物学家用它来鉴定晶体。阿拉戈在烛光实验室中发现的美丽颜色，成为整个光学分析领域的基础。

今天，如果你曾透过偏振太阳镜看到受力塑料尺中的彩虹图案，你就见证了阿拉戈的发现。`
    },
    scientistBio: {
      birthYear: 1786,
      deathYear: 1853,
      nationality: 'French',
      portraitEmoji: '🌈',
      bioEn: 'François Arago was a French mathematician, physicist, astronomer, and politician. He served as Director of the Paris Observatory and was briefly Prime Minister of France. He championed the wave theory of light, verified Fresnel\'s predictions, and made fundamental contributions to electromagnetism. His work on chromatic polarization laid the foundation for photoelasticity.',
      bioZh: '弗朗索瓦·阿拉戈是法国数学家、物理学家、天文学家和政治家。他曾任巴黎天文台台长，并短暂担任法国总理。他支持光的波动理论，验证了菲涅尔的预测，并对电磁学做出了根本性贡献。他在色偏振方面的工作奠定了光弹性法的基础。'
    },
    scene: {
      location: 'Paris Observatory, France',
      season: 'Autumn',
      mood: 'wonder'
    },
    references: [
      { title: 'Arago, F. (1811). Mémoire sur une modification remarquable qu\'éprouvent les rayons lumineux' },
      { title: 'Buchwald, J. Z. (1989). The Rise of the Wave Theory of Light' }
    ],
    historicalNote: {
      en: 'Note: Arago\'s chromatic polarization experiment is distinct from Newton\'s prism experiment. Newton separated white light by refraction; Arago revealed colors through interference of polarized light components.',
      zh: '注：阿拉戈的色偏振实验与牛顿的棱镜实验不同。牛顿通过折射分离白光；阿拉戈则通过偏振光分量的干涉揭示颜色。'
    },
    thinkingQuestion: {
      en: 'When you look at a piece of stressed plastic through polarized sunglasses, you see rainbow patterns. How are these colors related to Arago\'s discovery? What do they tell us about the plastic?',
      zh: '当你透过偏振太阳镜观察受力的塑料时，会看到彩虹图案。这些颜色与阿拉戈的发现有什么关系？它们告诉我们关于塑料的什么信息？'
    },
    linkTo: {
      year: 1817,
      trackTarget: 'optics',
      descriptionEn: 'Arago\'s chromatic polarization provided key evidence for Fresnel\'s transverse wave theory',
      descriptionZh: '阿拉戈的色偏振为菲涅尔的横波理论提供了关键证据'
    },
    illustrationType: 'chromaticpol',
    // 色偏振实验资源 - 关联到 resource-gallery 中的多媒体资源
    experimentalResources: {
      resourceIds: [
        'glass-heating-cooling',      // 玻璃应力加热冷却序列
        'plastic-wrap-thickness',     // 保鲜膜厚度干涉色
        'clear-tape-array',           // 透明胶阵列图案
        'tempered-glass',             // 钢化玻璃应力图案
        'plastic-wrap',               // 保鲜膜基础实验
      ],
      featuredImages: [
        {
          url: '/images/chromatic-polarization/透明胶条（重叠阵列）-正交偏振系统-正视图.jpg',
          caption: 'Transparent tape array showing chromatic interference under crossed polarizers',
          captionZh: '透明胶条阵列在正交偏振系统下展示的色偏振干涉图案'
        },
        {
          url: '/images/chromatic-polarization/钢化玻璃-正交偏振系统-正视图.jpg',
          caption: 'Stress patterns in tempered glass revealed by crossed polarizers',
          captionZh: '正交偏振片揭示钢化玻璃中的应力图案'
        },
        {
          url: '/images/chromatic-polarization/保鲜膜重叠4次-正交偏振系统-正视图.jpg',
          caption: '4-layer plastic wrap showing color variation due to thickness changes',
          captionZh: '四层保鲜膜因厚度变化产生的色彩干涉'
        }
      ],
      featuredVideo: {
        url: '/videos/chromatic-polarization/实验-透明胶条（重叠阵列）-正交偏振系统-旋转偏振片视频.mp4',
        title: 'Rotating analyzer reveals changing interference colors',
        titleZh: '旋转检偏器揭示不断变化的干涉色'
      },
      relatedModules: ['birefringence', 'stress-analysis', 'photoelasticity', 'interference']
    }
  },
  {
    year: 1815,
    titleEn: 'Discovery of Optical Activity',
    titleZh: '旋光性的发现',
    descriptionEn: 'Jean-Baptiste Biot discovers that certain liquids (like sugar solutions) can rotate the plane of polarized light — a phenomenon distinct from birefringence.',
    descriptionZh: '让-巴蒂斯特·毕奥发现某些液体（如糖溶液）能旋转偏振光的振动平面——这一现象不同于双折射，称为"旋光性"。',
    scientistEn: 'Jean-Baptiste Biot',
    scientistZh: '让-巴蒂斯特·毕奥',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Observed that polarized light passing through quartz or sugar solutions has its plane rotated',
        'Rotation angle is proportional to path length and concentration: α = [α] × l × c',
        'Distinguished from birefringence: rotation occurs without beam splitting',
        'Invented the polarimeter: Nicol prisms + sample tube + graduated scale',
        'Discovered both dextrorotatory (+) and levorotatory (-) substances',
        'Classic experiment: turpentine oil shows left-handed rotation, sugar shows right-handed',
        'This "natural optical activity" is related to molecular asymmetry (chirality)',
        'Laid the foundation for Pasteur\'s later discovery of molecular chirality (1848)'
      ],
      zh: [
        '观察到偏振光通过石英或糖溶液时振动平面发生旋转',
        '旋转角度与光程长度和浓度成正比：α = [α] × l × c',
        '不同于双折射：旋转时不发生光束分裂',
        '发明了旋光仪：尼科尔棱镜 + 样品管 + 刻度盘',
        '发现了右旋（+）和左旋（-）两类物质',
        '经典实验：松节油呈左旋，糖呈右旋',
        '这种"自然旋光"与分子不对称性（手性）有关',
        '为巴斯德后来发现分子手性奠定了基础（1848）'
      ]
    },
    story: {
      en: `In 1815, in the laboratories of the École Polytechnique in Paris, Jean-Baptiste Biot was studying quartz crystals when he noticed something puzzling. Polarized light passing through certain quartz specimens emerged with its polarization plane twisted — not split into two beams like in calcite, but smoothly rotated.

The discovery came from systematic experimentation. Biot carefully cut quartz plates of different thicknesses and measured the rotation angle for each. He found a precise relationship: the angle was exactly proportional to the thickness. This was no random effect — it was a fundamental property of the crystal.

Even more surprising, the same effect occurred in sugar solutions. The sweeter the solution, the greater the rotation. Biot dissolved various concentrations of sugar in water, placed them in glass tubes, and measured the rotation. He derived what would become known as Biot's Law: α = [α] × l × c (rotation equals specific rotation times path length times concentration).

He called it "rotary polarization" or "optical activity." Some substances rotated the light clockwise when viewed from the detector (dextrorotatory, labeled +), others counterclockwise (levorotatory, labeled -). Quartz crystals came in both left-handed and right-handed forms. Turpentine oil rotated light to the left; cane sugar to the right.

To make precise measurements, Biot developed the polarimeter — placing the sample between two Nicol prisms, one fixed and one rotatable with a graduated scale. This instrument, refined over the years, would become standard equipment in every chemistry laboratory.

Biot could not explain why this happened — that would require understanding molecular structure at a level not yet achieved. But he had opened a door that would lead, thirty years later, to one of the most profound discoveries in chemistry. In 1848, a young Louis Pasteur, using Biot's polarimeter, would discover that tartaric acid crystals came in mirror-image forms — the birth of stereochemistry.

Today, measuring optical rotation remains a standard technique in chemistry and pharmaceutical industries. Every time a chemist verifies the purity of a sugar or the correct "handedness" of a drug molecule, they use the principle and instruments Biot pioneered.`,
      zh: `1815年，在巴黎综合理工学院的实验室里，让-巴蒂斯特·毕奥研究石英晶体时注意到一个令人困惑的现象。偏振光通过某些石英样品后，其偏振平面发生了扭转——不是像方解石那样分成两束，而是平滑地旋转。

这一发现源于系统的实验。毕奥仔细切割不同厚度的石英片，测量每片的旋转角度。他发现了一个精确的关系：角度与厚度严格成正比。这不是随机效应——而是晶体的基本性质。

更令人惊讶的是，糖溶液中也出现了同样的效果。溶液越甜，旋转角度越大。毕奥将不同浓度的糖溶解在水中，装入玻璃管，测量旋转角度。他推导出后来被称为"毕奥定律"的公式：α = [α] × l × c（旋转角度等于比旋光度乘以光程乘以浓度）。

他称之为"旋转偏振"或"旋光性"。有些物质从检测器方向看使光顺时针旋转（右旋，标记为+），有些则逆时针旋转（左旋，标记为-）。石英晶体有左旋和右旋两种形态。松节油使光左旋；蔗糖使光右旋。

为了进行精确测量，毕奥开发了旋光仪——将样品置于两个尼科尔棱镜之间，一个固定，一个可旋转并带有刻度盘。这种仪器经过多年改进，成为每个化学实验室的标准设备。

毕奥无法解释为什么会发生这种情况——那需要对分子结构有更深入的理解。但他打开了一扇门，三十年后将引出化学史上最深刻的发现之一。1848年，年轻的路易·巴斯德使用毕奥的旋光仪，发现酒石酸晶体存在镜像形态——立体化学由此诞生。

今天，测量旋光度仍然是化学和制药行业的标准技术。每当化学家验证糖的纯度或药物分子的正确"手性"时，他们都在使用毕奥开创的原理和仪器。`
    },
    scientistBio: {
      birthYear: 1774,
      deathYear: 1862,
      nationality: 'French',
      portraitEmoji: '🔬',
      bioEn: 'Jean-Baptiste Biot was a French physicist, astronomer, and mathematician. He made important contributions to optics, magnetism, and astronomy. He accompanied Gay-Lussac on a famous balloon ascent for scientific research and was one of the first to study meteorites scientifically.',
      bioZh: '让-巴蒂斯特·毕奥是法国物理学家、天文学家和数学家。他在光学、磁学和天文学方面做出了重要贡献。他曾与盖-吕萨克一起进行著名的气球升空科学研究，也是最早科学研究陨石的人之一。'
    },
    scene: {
      location: 'Paris, France',
      season: 'Spring',
      mood: 'discovery'
    },
    references: [
      { title: 'Biot, J. B. (1815). Mémoire sur la polarisation circulaire', url: 'https://gallica.bnf.fr/ark:/12148/bpt6k6556665z' },
      { title: 'Biot, J. B. (1817). Mémoire sur les rotations que certaines substances impriment aux axes de polarisation des rayons lumineux' },
      { title: 'Lowry, T. M. (1935). Optical Rotatory Power' }
    ],
    historicalNote: {
      en: 'Note: Optical activity (rotation of polarization plane) is distinct from birefringence (splitting light into two beams). Both involve polarization but through different mechanisms. Biot\'s polarimeter became the standard instrument for measuring optical rotation.',
      zh: '注：旋光性（偏振面旋转）与双折射（将光分成两束）是不同的现象。两者都涉及偏振，但机制不同。毕奥的旋光仪成为测量旋光度的标准仪器。'
    },
    thinkingQuestion: {
      en: 'Sugar solutions rotate polarized light. Does this mean sugar molecules have a special shape? What does "handedness" mean for a molecule?',
      zh: '糖溶液能旋转偏振光。这是否意味着糖分子有特殊的形状？分子的"手性"是什么意思？'
    },
    linkTo: {
      year: 1848,
      trackTarget: 'polarization',
      descriptionEn: 'Biot\'s polarimeter enabled Pasteur\'s discovery of molecular chirality in tartaric acid crystals',
      descriptionZh: '毕奥的旋光仪使巴斯德得以发现酒石酸晶体的分子手性'
    },
    illustrationType: 'opticalactivity'
  },
  {
    year: 1817,
    titleEn: 'Fresnel\'s Transverse Wave Theory',
    titleZh: '菲涅尔的横波理论',
    descriptionEn: 'Fresnel proposes that light is a transverse wave — a hypothesis crucially validated by polarization phenomena observed by Malus and others.',
    descriptionZh: '菲涅尔提出光是横波——这一假说被马吕斯等人观察到的偏振现象所关键验证。偏振现象的存在反过来证明了光必须是横波。',
    scientistEn: 'Augustin-Jean Fresnel',
    scientistZh: '奥古斯丁-让·菲涅尔',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Polarization phenomena (observed since 1808) could only be explained if light was a transverse wave',
        'Longitudinal waves (like sound) cannot be polarized — only transverse waves can',
        'Developed Fresnel equations for reflection and transmission',
        'Mathematically unified interference, diffraction, and polarization',
        'Invented the Fresnel lens for lighthouses'
      ],
      zh: [
        '偏振现象（1808年起被观测到）只有在光是横波时才能解释',
        '纵波（如声波）无法偏振——只有横波才可以',
        '推导出菲涅尔反射和透射方程',
        '用数学统一了干涉、衍射和偏振',
        '发明了用于灯塔的菲涅尔透镜'
      ]
    },
    linkTo: {
      year: 1808,
      trackTarget: 'polarization',
      descriptionEn: 'Polarization phenomena discovered by Malus provided crucial evidence that light must be a transverse wave',
      descriptionZh: '马吕斯发现的偏振现象为"光是横波"提供了关键证据'
    },
    story: {
      en: `In 1815, post-Napoleonic France was in chaos. Augustin-Jean Fresnel, a young civil engineer, had just lost his job for supporting the Bourbon restoration. Exiled to the countryside with nothing but time on his hands, he turned to an old obsession: the nature of light.

Newton's particle theory had reigned supreme for a century. But Fresnel, lying sick in bed with tuberculosis, dared to challenge the great Newton himself. He believed light was a wave — but not the longitudinal wave Huygens had imagined.

In a flash of insight that would change physics forever, Fresnel proposed that light waves were transverse — they vibrated perpendicular to their direction of travel, like waves on a rope, not like sound in air. This simple shift explained everything: polarization, double refraction, the patterns of light and shadow.

He submitted his revolutionary paper to the French Academy's prize competition. The great physicist Siméon Poisson, trying to refute Fresnel's wave theory, pointed out an absurd prediction: if light were truly a wave, there should be a bright spot in the center of a circular shadow!

"Ridiculous," Poisson declared. But when François Arago performed the experiment — there it was. A bright spot, exactly as predicted. The "Poisson spot" became the wave theory's greatest vindication.

Fresnel died of tuberculosis at just 39, but not before inventing the lighthouse lens that would save countless lives at sea. His last words to Arago were reportedly: "I wish I had done more."

The revolution he sparked continues to this day. Every polarizing sunglasses lens owes its existence to this sickly engineer who dared to defy Newton.`,
      zh: `1815年，后拿破仑时代的法国一片混乱。年轻的土木工程师奥古斯丁-让·菲涅尔刚因支持波旁王朝复辟而失去工作。被流放到乡下，无所事事的他转向了一个老迷恋：光的本质。

牛顿的微粒理论已统治了一个世纪。但身患肺结核、卧病在床的菲涅尔，竟敢挑战伟大的牛顿本人。他相信光是一种波——但不是惠更斯想象的那种纵波。

在一道将永远改变物理学的灵感闪现中，菲涅尔提出光波是横波——它们的振动垂直于传播方向，就像绳子上的波，而不是空气中的声音。这个简单的转变解释了一切：偏振、双折射、光与影的图案。

他将这篇革命性的论文提交给法国科学院的悬赏竞赛。伟大的物理学家西蒙·泊松试图反驳菲涅尔的波动理论，指出了一个荒谬的预测：如果光真的是波，那么圆形障碍物阴影的中心应该有一个亮点！

"荒谬，"泊松宣称。但当弗朗索瓦·阿拉戈进行实验时——它真的出现了。一个亮点，与预测完全一致。"泊松亮斑"成为波动理论最伟大的证明。

菲涅尔在年仅39岁时死于肺结核，但在此之前他发明了能在海上拯救无数生命的灯塔透镜。据说他对阿拉戈说的最后一句话是："我希望我能做更多。"

他点燃的革命一直延续到今天。每一片偏振太阳镜镜片的存在，都要归功于这位敢于挑战牛顿的病弱工程师。`
    },
    scientistBio: {
      birthYear: 1788,
      deathYear: 1827,
      nationality: 'French',
      portraitEmoji: '🌊',
      bioEn: 'Augustin-Jean Fresnel was a French civil engineer and physicist who fundamentally advanced the wave theory of light. Despite having little formal physics training and suffering from tuberculosis throughout his career, he developed the mathematics of light diffraction and invented the Fresnel lens used in lighthouses worldwide.',
      bioZh: '奥古斯丁-让·菲涅尔是法国土木工程师和物理学家，从根本上推进了光的波动理论。尽管他几乎没有接受过正规的物理训练，且在整个职业生涯中饱受肺结核困扰，他仍发展出了光衍射的数学理论，并发明了全世界灯塔使用的菲涅尔透镜。'
    },
    scene: {
      location: 'Paris, France',
      season: 'Summer',
      mood: 'revolution'
    },
    illustrationType: 'transverse'
  },
  {
    year: 1828,
    titleEn: 'Nicol Prism',
    titleZh: '尼科尔棱镜',
    descriptionEn: 'William Nicol invents the first practical polarizing prism using calcite.',
    descriptionZh: '尼科尔发明了第一个实用的偏振棱镜，使用方解石制成。',
    scientistEn: 'William Nicol',
    scientistZh: '威廉·尼科尔',
    category: 'experiment',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Made from two calcite prisms cemented with Canada balsam',
        'Ordinary ray is totally internally reflected and absorbed',
        'Extraordinary ray passes through as polarized light',
        'Widely used in microscopy until modern polarizers'
      ],
      zh: [
        '由两个用加拿大树脂胶合的方解石棱镜制成',
        '寻常光全反射被吸收',
        '非常光作为偏振光通过',
        '在现代偏振片出现前广泛用于显微镜'
      ]
    },
    story: {
      en: `In a cramped workshop in Edinburgh, 1828, William Nicol — a Scottish geologist with skilled hands and an inventor's mind — wrestled with an ancient problem: how to create pure polarized light cheaply and reliably.

Calcite crystals could split light into two beams, yes. But both beams remained, dancing together, confusing the observer. Nicol needed to eliminate one beam entirely.

His solution was elegant in its simplicity. He took a single calcite rhomb and sawed it diagonally in half. Then, with the patience of a surgeon, he polished the cut surfaces flat and cemented them back together with Canada balsam — a clear resin from fir trees.

The magic happened at that cemented interface. The ordinary ray, striking the balsam layer at just the right angle, was totally internally reflected away, absorbed by the blackened sides of the crystal. But the extraordinary ray passed through, emerging as perfectly polarized light.

The "Nicol prism" was born — the first practical device to produce pure polarized light on demand.

For the next century, Nicol prisms became essential tools in every optics laboratory. Geologists used them to study mineral crystals. Biologists examined cell structures. Chemists detected sugar concentrations.

Nicol himself, modest to a fault, never patented his invention. He gave it freely to science. Today, plastic polarizers have largely replaced his elegant prisms, but in specialized applications where purity matters most, the Nicol prism endures — a testament to one craftsman's genius.`,
      zh: `1828年，爱丁堡一间狭小的工作室里，威廉·尼科尔——一位手艺精湛、富有发明头脑的苏格兰地质学家——正与一个古老的难题搏斗：如何廉价而可靠地产生纯净的偏振光。

方解石晶体确实能将光分成两束。但两束光同时存在，相互交织，让观察者困惑。尼科尔需要彻底消除其中一束。

他的解决方案简洁而优雅。他取一块方解石菱面体，沿对角线锯成两半。然后，以外科医生般的耐心，他将切面打磨光滑，用加拿大香脂——一种来自冷杉树的透明树脂——将它们重新粘合在一起。

魔法发生在那个胶合界面上。寻常光以恰当的角度撞击树脂层，发生全内反射，被晶体涂黑的侧面所吸收。而非常光则畅通无阻，作为完美的偏振光射出。

"尼科尔棱镜"诞生了——第一个能按需产生纯净偏振光的实用装置。

在接下来的一个世纪里，尼科尔棱镜成为每个光学实验室的必备工具。地质学家用它研究矿物晶体。生物学家检查细胞结构。化学家测定糖浓度。

尼科尔本人过于谦虚，从未为他的发明申请专利。他将它无偿献给了科学。今天，塑料偏振片已基本取代了他优雅的棱镜，但在对纯度要求最高的专业应用中，尼科尔棱镜依然屹立——一位工匠天才的永恒见证。`
    },
    scientistBio: {
      birthYear: 1770,
      deathYear: 1851,
      nationality: 'Scottish',
      portraitEmoji: '💎',
      bioEn: 'William Nicol was a Scottish geologist and physicist, known for two major inventions: the Nicol prism for polarization and the technique of making thin sections of rocks and minerals for microscopic examination. He was modest about his achievements and never sought patents.',
      bioZh: '威廉·尼科尔是苏格兰地质学家和物理学家，以两项重大发明闻名：用于偏振的尼科尔棱镜，以及制作岩石和矿物薄片以供显微镜检查的技术。他对自己的成就十分谦逊，从未申请专利。'
    },
    scene: {
      location: 'Edinburgh, Scotland',
      season: 'Autumn',
      mood: 'craftsmanship'
    },
    thinkingQuestion: {
      en: 'The Nicol prism was replaced by polaroid film in most applications. What are the trade-offs between a crystal prism and a plastic polarizing film?',
      zh: '尼科尔棱镜在大多数应用中已被偏振薄膜取代。晶体棱镜和塑料偏振薄膜之间有什么权衡取舍？'
    },
    illustrationType: 'nicol'
  },
  {
    year: 1845,
    titleEn: 'Faraday Effect',
    titleZh: '法拉第效应',
    descriptionEn: 'Michael Faraday discovers that a magnetic field can rotate the plane of polarized light in glass — the first evidence linking light and electromagnetism.',
    descriptionZh: '迈克尔·法拉第发现磁场能旋转玻璃中偏振光的振动平面——这是光与电磁学联系的首个证据，直接启发了麦克斯韦的电磁理论。',
    scientistEn: 'Michael Faraday',
    scientistZh: '迈克尔·法拉第',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Polarized light passing through glass in a strong magnetic field has its plane rotated',
        'Rotation angle is proportional to magnetic field strength and path length',
        'First experimental evidence that light and magnetism are related',
        'Unlike natural optical activity, Faraday rotation is non-reciprocal (direction-dependent)',
        'Directly inspired Maxwell\'s electromagnetic theory of light (1865)'
      ],
      zh: [
        '偏振光在强磁场中通过玻璃时振动平面发生旋转',
        '旋转角度与磁场强度和光程成正比',
        '光和磁学相关的首个实验证据',
        '与自然旋光不同，法拉第旋转是非互易的（方向相关）',
        '直接启发了麦克斯韦的光电磁理论（1865）'
      ]
    },
    story: {
      en: `In September 1845, in the basement laboratory of the Royal Institution in London, Michael Faraday — the greatest experimental physicist of his age — was hunting for a connection he believed must exist between light and magnetism.

For years, he had tried and failed. Light beams passed through electric fields without effect. Magnetic fields seemed equally impotent. His notebooks filled with failed experiments, each ending with the melancholy note: "no effect."

Then, on September 13th, he tried something new: a powerful electromagnet and a piece of heavy glass he had made years earlier. He sent a beam of polarized light through the glass, with the magnetic field aligned along the beam's path.

The analyzer on the other side was set to block the light. But when Faraday turned on the magnet — the darkness lifted! The light was getting through. The magnetic field had rotated the polarization plane.

"I have at last succeeded in magnetizing and electrifying a ray of light," Faraday wrote with barely contained excitement. "The effect is great."

This discovery, now called the Faraday effect, was monumental. For the first time, a connection between electromagnetism and light had been demonstrated experimentally. Twenty years later, Maxwell would use this insight to show that light itself is an electromagnetic wave.

Note: The Faraday effect differs from natural optical activity (like in sugar solutions) because it is non-reciprocal — the rotation direction depends on the direction of light propagation relative to the magnetic field.`,
      zh: `1845年9月，伦敦皇家研究所的地下实验室里，迈克尔·法拉第——那个时代最伟大的实验物理学家——正在寻找他坚信存在的光与磁之间的联系。

多年来，他尝试了又失败了。光束穿过电场毫无效果。磁场似乎同样无能为力。他的笔记本里记满了失败的实验，每一次都以忧郁的注释结束："无效果"。

然后，9月13日，他尝试了一些新东西：一块强电磁铁和一块他多年前制作的重玻璃。他让一束偏振光穿过玻璃，磁场沿着光束路径排列。

另一边的检偏器被设置为阻挡光线。但当法拉第打开磁铁时——黑暗消散了！光线透过来了。磁场旋转了偏振平面。

"我终于成功地使一束光磁化和电化了，"法拉第难以抑制激动地写道。"效果很明显。"

这一发现，现在被称为法拉第效应，具有划时代意义。这是首次实验证明电磁与光之间存在联系。二十年后，麦克斯韦将利用这一洞见证明光本身就是电磁波。

注：法拉第效应与自然旋光（如糖溶液中的）不同，因为它是非互易的——旋转方向取决于光传播方向与磁场的相对关系。`
    },
    scientistBio: {
      birthYear: 1791,
      deathYear: 1867,
      nationality: 'English',
      portraitEmoji: '⚡',
      bioEn: 'Michael Faraday was an English scientist who contributed greatly to electromagnetism and electrochemistry. Despite little formal education, he became one of the most influential scientists in history. He discovered electromagnetic induction, invented the electric motor, and established the concept of magnetic field lines.',
      bioZh: '迈克尔·法拉第是英国科学家，对电磁学和电化学做出了巨大贡献。尽管几乎没有受过正规教育，他却成为历史上最有影响力的科学家之一。他发现了电磁感应，发明了电动机，并建立了磁场线的概念。'
    },
    scene: {
      location: 'Royal Institution, London',
      season: 'Autumn',
      mood: 'breakthrough'
    },
    linkTo: {
      year: 1865,
      trackTarget: 'optics',
      descriptionEn: 'This discovery directly inspired Maxwell\'s electromagnetic theory of light',
      descriptionZh: '这一发现直接启发了麦克斯韦的光电磁理论'
    },
    historicalNote: {
      en: 'The Faraday effect is non-reciprocal (direction-dependent), unlike natural optical activity. This property is used today in optical isolators to prevent laser light from reflecting back.',
      zh: '法拉第效应是非互易的（方向相关），与自然旋光不同。这一特性如今用于光隔离器，防止激光反射回去。'
    },
    thinkingQuestion: {
      en: 'The Faraday effect showed light and magnetism are connected. What did this suggest about the nature of light itself?',
      zh: '法拉第效应表明光和磁是有联系的。这暗示了光本身是什么性质？'
    },
    illustrationType: 'faraday'
  },
  {
    year: 1848,
    titleEn: 'Discovery of Molecular Chirality',
    titleZh: '分子手性的发现',
    descriptionEn: 'Louis Pasteur discovers that tartaric acid crystals exist in two mirror-image forms, establishing the connection between molecular structure and optical activity.',
    descriptionZh: '路易·巴斯德发现酒石酸晶体存在两种镜像形式，建立了分子结构与旋光性之间的联系——这是偏振光学与生命科学最紧密的桥梁。',
    scientistEn: 'Louis Pasteur',
    scientistZh: '路易·巴斯德',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Manually separated tartaric acid crystals into left- and right-handed forms',
        'Each form rotated polarized light in opposite directions',
        'Proved that optical activity arises from molecular asymmetry (chirality)',
        'Established the link between polarization and life sciences (biology, chemistry, medicine)',
        'Foundation for understanding DNA helices, protein structures, and drug design'
      ],
      zh: [
        '手工将酒石酸晶体分成左旋和右旋两种形式',
        '每种形式使偏振光向相反方向旋转',
        '证明旋光性源于分子不对称性（手性）',
        '建立了偏振与生命科学（生物学、化学、医学）的联系',
        '为理解DNA螺旋、蛋白质结构和药物设计奠定基础'
      ]
    },
    story: {
      en: `In 1848, a 25-year-old chemist named Louis Pasteur was studying tartaric acid crystals — a byproduct of winemaking. Previous chemists had noticed something puzzling: two forms of the acid had identical chemical formulas, yet one rotated polarized light while the other didn't.

Working at the École Normale Supérieure in Paris, Pasteur examined the crystals under a microscope with extraordinary patience. He noticed something no one had seen before: the crystals had tiny asymmetric facets that made them distinguishable as "left-handed" and "right-handed" forms, like a pair of gloves.

With tweezers, crystal by crystal, he painstakingly separated the two forms into two piles. When he dissolved each pile separately and tested them with polarized light — one solution rotated light clockwise, the other counterclockwise, by equal amounts!

The "inactive" form was actually a mixture of both. There was nothing chemically different about the molecules — they were mirror images of each other, like left and right hands. This "handedness" at the molecular level explained Biot's optical activity.

Pasteur later said this moment changed his life. "The universe is asymmetric," he declared. This discovery of molecular chirality would transform chemistry, biology, and medicine. DNA's double helix, proteins that fold into specific shapes, drugs that work differently depending on their handedness — all trace back to that afternoon in Paris when a young man sorted crystals with tweezers.`,
      zh: `1848年，一位25岁的化学家路易·巴斯德正在研究酒石酸晶体——一种酿酒的副产品。之前的化学家注意到一个令人困惑的现象：两种形式的酸具有相同的化学式，但一种能旋转偏振光，另一种却不能。

在巴黎高等师范学校工作时，巴斯德以非凡的耐心在显微镜下检查这些晶体。他注意到了之前无人发现的东西：晶体有微小的不对称切面，可以将它们区分为"左旋"和"右旋"两种形式，就像一双手套。

用镊子，一颗晶体接一颗晶体，他费力地将两种形式分成两堆。当他分别溶解每堆并用偏振光测试时——一种溶液使光顺时针旋转，另一种使光逆时针旋转，角度相等！

"非活性"形式实际上是两者的混合物。分子之间没有化学差异——它们是彼此的镜像，就像左手和右手。这种分子层面的"手性"解释了毕奥的旋光性。

巴斯德后来说这一刻改变了他的人生。"宇宙是不对称的，"他宣称。这一分子手性的发现将改变化学、生物学和医学。DNA的双螺旋、折叠成特定形状的蛋白质、因手性不同而效果各异的药物——这一切都可以追溯到巴黎的那个下午，一个年轻人用镊子分拣晶体的时刻。`
    },
    scientistBio: {
      birthYear: 1822,
      deathYear: 1895,
      nationality: 'French',
      portraitEmoji: '🔬',
      bioEn: 'Louis Pasteur was a French chemist and microbiologist renowned for his discoveries in vaccination, microbial fermentation, and pasteurization. His early work on chirality and polarized light laid the foundation for stereochemistry, before he turned to microbiology where he saved countless lives.',
      bioZh: '路易·巴斯德是法国化学家和微生物学家，以疫苗接种、微生物发酵和巴氏消毒法的发现而闻名。他早期关于手性和偏振光的工作为立体化学奠定了基础，之后他转向微生物学，挽救了无数生命。'
    },
    scene: {
      location: 'Paris, France',
      season: 'Spring',
      mood: 'revelation'
    },
    linkTo: {
      year: 1815,
      trackTarget: 'polarization',
      descriptionEn: 'Pasteur explained Biot\'s optical activity by discovering molecular chirality',
      descriptionZh: '巴斯德通过发现分子手性解释了毕奥的旋光性'
    },
    thinkingQuestion: {
      en: 'Many drugs come in left-handed and right-handed versions. Why might one version be medicine and the other be harmful?',
      zh: '许多药物有左旋和右旋两种版本。为什么一种版本是药物，另一种版本却可能有害？'
    },
    illustrationType: 'chirality'
  },
  {
    year: 1852,
    titleEn: 'Stokes Parameters',
    titleZh: '斯托克斯参数',
    descriptionEn: 'George Gabriel Stokes introduces a mathematical framework to describe polarization states.',
    descriptionZh: '斯托克斯引入描述偏振态的数学框架。',
    scientistEn: 'George Gabriel Stokes',
    scientistZh: '乔治·加布里埃尔·斯托克斯',
    category: 'theory',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Four parameters (S₀, S₁, S₂, S₃) completely describe any polarization state',
        'S₀: total intensity; S₁: horizontal vs vertical; S₂: +45° vs -45°; S₃: right vs left circular',
        'Can represent partially polarized and unpolarized light (degree of polarization = √(S₁²+S₂²+S₃²)/S₀)',
        'Classic measurement: 6 intensity measurements with different polarizer/waveplate combinations',
        'Published in "On the Composition and Resolution of Streams of Polarized Light from Different Sources" (1852)',
        'Foundation for Poincaré sphere (1892) and Mueller calculus (1943)',
        'Enables mathematical treatment of polarization in real-world conditions',
        'Used in astronomy, remote sensing, medical imaging, and telecommunications'
      ],
      zh: [
        '四个参数（S₀, S₁, S₂, S₃）完整描述任何偏振态',
        'S₀：总强度；S₁：水平vs垂直；S₂：+45°vs-45°；S₃：右旋vs左旋',
        '可以表示部分偏振和非偏振光（偏振度 = √(S₁²+S₂²+S₃²)/S₀）',
        '经典测量：用不同偏振片/波片组合进行6次强度测量',
        '发表于《不同来源偏振光束的组成与分解》（1852）',
        '庞加莱球（1892）和穆勒矩阵（1943）的基础',
        '使真实条件下偏振的数学处理成为可能',
        '应用于天文学、遥感、医学成像和通信'
      ]
    },
    story: {
      en: `Cambridge, 1852. George Gabriel Stokes, the Lucasian Professor of Mathematics (Newton's former chair), faced a puzzle that had frustrated physicists for decades: how do you describe light that isn't perfectly polarized?

The problem had practical urgency. Astronomers studying starlight needed to characterize its polarization. Geologists examining crystals encountered complex polarization states. But the existing mathematics — elegant for perfect polarization — broke down for real-world light that was only partially polarized.

Real light — from the sun, from candles, from lamps — was messy. Some of it was polarized, some wasn't, some was somewhere in between. And polarization could be linear, circular, or elliptical. How could mathematics capture this complexity?

Stokes's genius was to step back from the physics and ask a simpler question: what can we actually measure? He devised a systematic experiment: measure intensity through a polarizer at 0°, 90°, 45°, and 135°. Then add a quarter-wave plate and measure twice more for circular polarization. From these six measurements, four independent parameters emerged.

He called them S₀, S₁, S₂, and S₃. Four numbers. Four simple measurements. Together, they could describe perfect polarization, partial polarization, complete chaos, or anything in between.

S₀ gave the total intensity. S₁ described horizontal versus vertical preference. S₂ captured diagonal tendencies. And S₃ revealed the handedness of circular polarization. The ratio √(S₁²+S₂²+S₃²)/S₀ gave the degree of polarization — from 0 (unpolarized) to 1 (fully polarized).

The beauty of Stokes's approach was its practicality. You didn't need to know the electromagnetic theory. You didn't need to track phases and amplitudes. You simply made measurements and plugged in numbers. The parameters were observable quantities, not theoretical abstractions.

Forty years later, Poincaré would map these parameters onto a sphere, giving them geometric intuition. Ninety years later, Mueller would build matrix calculus upon them. But it all began with Stokes's simple insight: describe light by what you can measure.

Today, "Stokes polarimetry" is used everywhere — from analyzing starlight to medical imaging, from studying insect vision to designing LCD screens. Stokes gave us a language to speak about polarization that works in the real world, where light is never perfectly behaved.`,
      zh: `1852年，剑桥。乔治·加布里埃尔·斯托克斯，卢卡斯数学教授（牛顿曾坐过的讲席），面对一个困扰物理学家数十年的难题：如何描述不完全偏振的光？

这个问题有着实际的迫切性。研究星光的天文学家需要表征其偏振状态。检查晶体的地质学家遇到了复杂的偏振态。但现有的数学——对于完美偏振很优雅——对于现实世界中只是部分偏振的光却失效了。

真实的光——来自太阳、蜡烛、灯火——总是杂乱无章的。有些是偏振的，有些不是，有些介于两者之间。而且偏振可以是线偏振、圆偏振或椭圆偏振。数学如何能捕捉这种复杂性？

斯托克斯的天才之处在于他退后一步，问了一个更简单的问题：我们实际上能测量什么？他设计了一个系统的实验：在0°、90°、45°和135°角度分别通过偏振器测量强度，然后加入四分之一波片再测量两次以获取圆偏振信息。从这六次测量中，四个独立参数浮现出来。

他称它们为S₀、S₁、S₂和S₃。四个数字。六次简单的测量。它们可以描述完美偏振、部分偏振、完全混沌，或介于两者之间的任何状态。

S₀给出总强度。S₁描述水平与垂直的倾向。S₂捕捉对角线方向的特征。S₃揭示圆偏振的旋向。比值√(S₁²+S₂²+S₃²)/S₀给出偏振度——从0（非偏振）到1（完全偏振）。

斯托克斯方法的美妙之处在于它的实用性。你不需要了解电磁理论。你不需要追踪相位和振幅。你只需进行测量，代入数字即可。这些参数是可观测量，而非理论抽象。

四十年后，庞加莱将这些参数映射到球面上，赋予它们几何直觉。九十年后，穆勒将在其上建立矩阵演算。但这一切都始于斯托克斯的简单洞见：用你能测量的东西来描述光。

今天，"斯托克斯偏振测量法"无处不在——从分析星光到医学成像，从研究昆虫视觉到设计液晶屏幕。斯托克斯给了我们一种在现实世界中谈论偏振的语言——在那里，光永远不会完美地表现。`
    },
    scientistBio: {
      birthYear: 1819,
      deathYear: 1903,
      nationality: 'Irish-British',
      portraitEmoji: '📐',
      bioEn: 'Sir George Gabriel Stokes was an Irish-British mathematician and physicist, Lucasian Professor at Cambridge for over 50 years. Besides his work on polarization, he made fundamental contributions to fluid dynamics (Navier-Stokes equations), fluorescence (Stokes shift), and vector analysis. He served as President of the Royal Society.',
      bioZh: '乔治·加布里埃尔·斯托克斯爵士是爱尔兰裔英国数学家和物理学家，在剑桥担任卢卡斯教授超过50年。除了偏振方面的工作外，他还对流体动力学（纳维-斯托克斯方程）、荧光（斯托克斯位移）和矢量分析做出了根本性贡献。他曾担任皇家学会主席。'
    },
    scene: {
      location: 'Cambridge, England',
      season: 'Spring',
      mood: 'mathematical elegance'
    },
    references: [
      { title: 'Stokes, G. G. (1852). On the Composition and Resolution of Streams of Polarized Light from Different Sources', url: 'https://doi.org/10.1017/S0305004100027079' },
      { title: 'Chandrasekhar, S. (1960). Radiative Transfer (Chapter on Polarization)' },
      { title: 'Collett, E. (1993). Polarized Light: Fundamentals and Applications' }
    ],
    linkTo: {
      year: 1892,
      trackTarget: 'polarization',
      descriptionEn: 'Poincaré would later map Stokes parameters geometrically onto a sphere',
      descriptionZh: '庞加莱后来将斯托克斯参数几何地映射到球面上'
    },
    thinkingQuestion: {
      en: 'Why does Stokes use four parameters when there are only three independent quantities (besides intensity) needed to describe polarization? What constraint links them?',
      zh: '斯托克斯为什么用四个参数，而描述偏振（除强度外）只需要三个独立量？是什么约束将它们联系在一起？'
    },
    illustrationType: 'stokes'
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
    illustrationType: 'rayleigh'
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
        'Each photon carries polarization information',
        'Foundation for quantum optics and quantum polarimetry (2023 entry)'
      ],
      zh: [
        '光表现为离散的能量包：E = hν',
        '解释了经典波动理论无法解释的光电效应',
        '光表现出波粒二象性',
        '每个光子携带偏振信息',
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
    year: 1929,
    titleEn: 'Polaroid Filter',
    titleZh: '宝丽来偏振片',
    descriptionEn: 'Edwin Land invents the first synthetic sheet polarizer, revolutionizing polarization applications.',
    descriptionZh: '埃德温·兰德发明了第一种合成薄片偏振器，彻底改变了偏振应用。',
    scientistEn: 'Edwin Land',
    scientistZh: '埃德温·兰德',
    category: 'application',
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
    year: 1971,
    titleEn: 'LCD Technology',
    titleZh: 'LCD技术',
    descriptionEn: 'First practical liquid crystal display using polarization principles is demonstrated.',
    descriptionZh: '首个使用偏振原理的实用液晶显示器被展示。',
    category: 'application',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'LCD panels use two crossed polarizers with liquid crystals between them',
        'Electric field controls the rotation of light polarization',
        'Revolutionized displays for watches, calculators, and screens',
        'Now ubiquitous in monitors, TVs, and mobile devices'
      ],
      zh: [
        'LCD面板使用两个正交偏振器，中间夹有液晶',
        '电场控制光偏振的旋转',
        '彻底改变了手表、计算器和屏幕的显示',
        '现在广泛用于显示器、电视和移动设备'
      ]
    },
    story: {
      en: `The year was 1971. At RCA's research laboratories in Princeton, New Jersey, a team of scientists was about to revolutionize how humanity sees information.

For years, the dream of flat-panel displays had tantalized engineers. Cathode ray tubes were bulky, power-hungry monsters. But liquid crystals — those strange substances that flow like liquids yet maintain some molecular order like crystals — offered a different path.

The breakthrough came from understanding polarization. The key insight: liquid crystal molecules, naturally twisted in a helix, could rotate the polarization of light as it passed through. Place this twisted layer between two crossed polarizers, and light would pass through. Apply an electric field, and the molecules would straighten — blocking the light.

On. Off. Light. Dark. Every pixel on every screen you've ever used works on this principle.

James Fergason, George Heilmeier, and others made this dream a reality. The first LCD watches appeared shortly after, their black digits glowing against silver backgrounds. Then calculators. Then laptop screens. Then the smartphones that now live in nearly every pocket on Earth.

Today, you are reading these words through polarization. The screen before you contains two precisely aligned polarizing films, sandwiching liquid crystals that dance to electrical commands. Three centuries of discovery — from Bartholin's crystal to Land's filters — all come together in the device in your hands.

The story of polarized light has become the story of modern communication. Bartholin, Huygens, Malus, Fresnel — could any of them have imagined that their strange observations would one day connect all of humanity?`,
      zh: `1971年。在新泽西州普林斯顿的RCA研究实验室，一群科学家即将彻底改变人类看到信息的方式。

多年来，平板显示器的梦想一直诱惑着工程师们。阴极射线管是笨重、耗电的怪物。但液晶——那些像液体一样流动、却像晶体一样保持某种分子有序性的奇怪物质——提供了另一条道路。

突破来自对偏振的理解。关键洞见是：液晶分子天然呈螺旋状扭曲，能在光通过时旋转其偏振方向。将这个扭曲层夹在两个正交偏振器之间，光就能通过。施加电场，分子就会变直——阻挡光线。

开。关。亮。暗。你用过的每一块屏幕上的每一个像素，都是基于这个原理工作的。

詹姆斯·弗格森、乔治·海尔迈尔等人将这个梦想变为现实。第一批LCD手表很快就出现了，黑色数字在银色背景上闪烁。然后是计算器。然后是笔记本电脑屏幕。然后是现在几乎住在地球上每个人口袋里的智能手机。

今天，你正在通过偏振阅读这些文字。你面前的屏幕包含两层精确对齐的偏振膜，夹着随电信号起舞的液晶。三个世纪的发现——从巴托林的晶体到兰德的滤光器——全都汇聚在你手中的设备里。

偏振光的故事已经成为现代通信的故事。巴托林、惠更斯、马吕斯、菲涅尔——他们中的任何人能想象到，他们那些奇怪的观察有朝一日会连接全人类吗？`
    },
    scientistBio: {
      portraitEmoji: '📺',
      bioEn: 'LCD technology was developed by multiple researchers including George Heilmeier at RCA Labs, James Fergason who patented the twisted nematic field effect, and many others. Their collective work transformed polarization science into the most important display technology in human history.',
      bioZh: 'LCD技术由多位研究人员共同开发，包括RCA实验室的乔治·海尔迈尔、为扭曲向列场效应申请专利的詹姆斯·弗格森等人。他们的集体工作将偏振科学转化为人类历史上最重要的显示技术。'
    },
    scene: {
      location: 'Princeton, New Jersey, USA',
      season: 'All seasons',
      mood: 'technological revolution'
    },
    thinkingQuestion: {
      en: 'The screen you\'re looking at right now uses polarization. What would happen if you looked at your phone through polarized sunglasses at different angles?',
      zh: '你现在看的屏幕就使用了偏振原理。如果你通过偏振太阳镜从不同角度看手机，会发生什么？'
    },
    illustrationType: 'lcd'
  },
  {
    year: 2012,
    titleEn: 'Mantis Shrimp Polarization Vision',
    titleZh: '螳螂虾偏振视觉',
    descriptionEn: 'Researchers discover mantis shrimp can detect circular polarization — a unique ability not found in any other animal.',
    descriptionZh: '研究人员发现螳螂虾能够探测圆偏振光——这是其他任何动物都没有的独特能力。',
    scientistEn: 'Justin Marshall et al.',
    scientistZh: '贾斯汀·马歇尔等',
    category: 'discovery',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Mantis shrimp have 16 types of photoreceptors (humans have 3)',
        'They can see both linear and circular polarization',
        'This enables unique underwater communication',
        'Inspires development of compact polarization cameras'
      ],
      zh: [
        '螳螂虾有16种光感受器（人类只有3种）',
        '它们能看到线偏振和圆偏振光',
        '这使得独特的水下通信成为可能',
        '启发了紧凑型偏振相机的开发'
      ]
    },
    story: {
      en: `In the shallow tropical waters of Australia, 2012, marine biologist Justin Marshall and his team made an extraordinary discovery. The mantis shrimp — already famous for its powerful strike — was hiding an even more remarkable secret.

These small crustaceans possessed the most complex visual system ever discovered in nature. Not only could they see colors we cannot imagine, but they could also detect something no other animal had been proven to see: circularly polarized light.

"When we first measured it, we didn't believe the data," Marshall recalled. The experiments were repeated dozens of times. The results were always the same — mantis shrimp could distinguish between left-handed and right-handed circular polarization.

Why would evolution bestow such an exotic ability? The answer lay in their secretive social lives. Mantis shrimp mark their territory with polarized signals invisible to predators but clear as day to other mantis shrimp. A private communication channel, hidden in plain light.

The discovery sparked a revolution in bio-inspired optics. Engineers began designing cameras that could mimic the mantis shrimp's vision, detecting cancer cells and underwater mines with unprecedented clarity. Nature had solved the problem of polarization detection in ways human engineers had never imagined.

In the rainbow-colored eyes of a small crustacean, three centuries of optical research found its most sophisticated natural expression.`,
      zh: `2012年，在澳大利亚温暖的热带浅水中，海洋生物学家贾斯汀·马歇尔和他的团队有了一个非凡的发现。螳螂虾——已经因其强大的攻击力而闻名——隐藏着一个更加惊人的秘密。

这些小型甲壳类动物拥有自然界中发现的最复杂的视觉系统。它们不仅能看到我们无法想象的颜色，还能探测到没有其他动物被证明能看到的东西：圆偏振光。

"当我们第一次测量时，我们不相信数据，"马歇尔回忆道。实验重复了数十次。结果总是一样的——螳螂虾能够区分左旋和右旋圆偏振光。

为什么进化会赋予如此奇异的能力？答案在于它们神秘的社交生活。螳螂虾用偏振信号标记领地，这些信号对捕食者是不可见的，但对其他螳螂虾来说却清晰可见。一个隐藏在普通光线中的私密通信渠道。

这一发现引发了仿生光学的革命。工程师们开始设计能够模仿螳螂虾视觉的相机，以前所未有的清晰度检测癌细胞和水下地雷。大自然以人类工程师从未想象过的方式解决了偏振检测问题。

在这只小甲壳类动物的彩虹色眼睛里，三个世纪的光学研究找到了其最精密的自然表达。`
    },
    scientistBio: {
      portraitEmoji: '🦐',
      bioEn: 'Justin Marshall is an Australian marine neuroscientist at the University of Queensland, specializing in visual ecology. His research on mantis shrimp vision has revealed unprecedented complexity in animal perception of light and color.',
      bioZh: '贾斯汀·马歇尔是昆士兰大学的澳大利亚海洋神经科学家，专门研究视觉生态学。他对螳螂虾视觉的研究揭示了动物对光和颜色感知的前所未有的复杂性。'
    },
    scene: {
      location: 'Great Barrier Reef, Australia',
      season: 'Summer',
      mood: 'wonder'
    },
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
    category: 'application',
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
]
