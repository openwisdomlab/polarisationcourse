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
    // 多个视频资源（用于展示多个相关实验视频）
    featuredVideos?: {
      url: string
      title?: string
      titleZh?: string
    }[]
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
    illustrationType: 'calcite',
    // 双折射现象的现代实验演示
    experimentalResources: {
      resourceIds: [
        'calcite-double-refraction',  // 冰洲石双折射成像 (新增)
        'calcite-polarizer-sequence', // 偏振片不同角度观察冰洲石 (新增)
        'calcite-stacked',            // 堆叠冰洲石四个像 (新增)
        'calcite-laser-red-beams',    // 绿色激光红色光束 (新增)
        'tempered-glass',             // 钢化玻璃应力图案展示双折射
        'plastic-wrap',               // 保鲜膜双折射
        'plastic-wrap-thickness',     // 不同厚度的双折射色彩
      ],
      featuredImages: [
        {
          url: '/images/calcite/双折射成像.jpg',
          caption: 'Classic calcite double refraction - Iceland spar crystal creating two images',
          captionZh: '经典冰洲石双折射——冰洲石晶体产生双像'
        },
        {
          url: '/images/chromatic-polarization/钢化玻璃-正交偏振系统-正视图.jpg',
          caption: 'Stress-induced birefringence in tempered glass - modern manifestation of Bartholin\'s discovery',
          captionZh: '钢化玻璃中的应力双折射——巴托林发现在现代的体现'
        }
      ],
      featuredVideo: {
        url: '/videos/chromatic-polarization/实验-偏振片看钢化玻璃-朝西.mp4',
        title: 'Observing birefringence in tempered glass under polarized light',
        titleZh: '偏振光下观察钢化玻璃的双折射'
      },
      relatedModules: ['birefringence', 'stress-analysis', 'anisotropy']
    }
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
    year: 1704,
    titleEn: 'Newton\'s Opticks Published',
    titleZh: '牛顿《光学》出版',
    descriptionEn: 'Isaac Newton publishes his comprehensive treatise on light, advocating the corpuscular (particle) theory that would dominate optics for a century.',
    descriptionZh: '艾萨克·牛顿出版了他关于光的综合性论著，倡导微粒（粒子）理论，这一理论将主导光学领域一个世纪。',
    scientistEn: 'Isaac Newton',
    scientistZh: '艾萨克·牛顿',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Published 40 years after his prism experiments during the plague',
        'Proposed light consists of tiny particles ("corpuscles")',
        'Explained reflection as particles bouncing off surfaces',
        'Described "fits of easy reflection and transmission" — anticipating wave concepts',
        'Dominated optical theory until Fresnel\'s wave theory (1817)',
        'Contains queries about light, heat, gravity, and the nature of matter'
      ],
      zh: [
        '在瘟疫期间的棱镜实验40年后出版',
        '提出光由微小粒子（"微粒"）组成',
        '将反射解释为粒子从表面弹回',
        '描述了"易反射与易透射的交替"——预示了波动概念',
        '主导光学理论直到菲涅尔的波动理论（1817）',
        '包含关于光、热、引力和物质本质的问题'
      ]
    },
    story: {
      en: `For four decades, Newton had kept his optical discoveries largely to himself. His bitter dispute with Robert Hooke over the nature of light had soured him on publishing. But in 1704, the year after Hooke's death, Newton finally released his masterwork: "Opticks."

The book was a triumph of experimental physics. Newton described his prism experiments, his investigations of colors, and his "crucial experiment" proving that white light was a mixture. He explained thin-film colors (Newton's rings) and proposed theories for diffraction, which he called "inflexion."

At the heart of Opticks was a bold hypothesis: light consisted of tiny particles — "corpuscles" — shot out from luminous bodies. These particles could explain reflection (bouncing) and refraction (bending due to attraction by matter). The corpuscular theory seemed to explain everything... almost.

There were hints of doubt even in Newton's own writing. He described light having "fits of easy reflection and easy transmission" — a periodic property that sounded suspiciously wave-like. He was more cautious than his followers would be.

For the next century, Newton's authority was so great that the corpuscular theory reigned supreme. Young's interference experiments (1801) challenged this view, but it took Fresnel's mathematical brilliance to finally overthrow Newton's particles. Even then, Einstein's photon (1905) would show that Newton wasn't entirely wrong — light is both wave and particle.

Opticks remains a landmark in scientific literature — a book where a genius wrestled with nature's deepest mysteries and left questions that took two centuries to fully answer.`,
      zh: `四十年来，牛顿基本上把他的光学发现藏在心里。他与罗伯特·胡克关于光本质的激烈争论让他对出版心生厌倦。但在1704年，胡克去世后的第二年，牛顿终于发表了他的巨著：《光学》。

这本书是实验物理学的胜利。牛顿描述了他的棱镜实验、对颜色的研究，以及证明白光是混合物的"关键实验"。他解释了薄膜色彩（牛顿环）并提出了衍射理论，他称之为"偏折"。

《光学》的核心是一个大胆的假设：光由微小粒子——"微粒"——组成，从发光体中射出。这些粒子可以解释反射（弹跳）和折射（由物质吸引引起的弯曲）。微粒理论似乎解释了一切……几乎。

甚至在牛顿自己的著作中也有怀疑的迹象。他描述光有"易反射和易透射的交替"——这种周期性特性听起来可疑地像波。他比他的追随者更加谨慎。

在接下来的一个世纪里，牛顿的权威如此之大，以至于微粒理论独占鳌头。杨的干涉实验（1801）挑战了这一观点，但需要菲涅尔的数学天才才能最终推翻牛顿的粒子说。即便如此，爱因斯坦的光子（1905）将表明牛顿并非完全错误——光既是波又是粒子。

《光学》仍然是科学文献中的里程碑——在这本书中，一位天才与自然界最深奥的奥秘搏斗，留下了需要两个世纪才能完全解答的问题。`
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
      location: 'London, England',
      season: 'Winter',
      mood: 'authoritative'
    },
    references: [
      { title: 'Newton, I. (1704). Opticks: or, A Treatise of the Reflexions, Refractions, Inflexions and Colours of Light' }
    ],
    thinkingQuestion: {
      en: 'Newton\'s particle theory dominated for a century, but turned out to be incomplete. Why is it important for scientists to question even the greatest authorities?',
      zh: '牛顿的微粒理论统治了一个世纪，但最终被证明是不完整的。为什么科学家质疑即使是最伟大的权威也很重要？'
    }
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
    illustrationType: 'reflection',
    // 反射偏振的现代实验演示
    experimentalResources: {
      resourceIds: [
        'glass-comparison',        // 玻璃在偏振光下的对比
        'glasses',                 // 眼镜镜片的偏振效果
      ],
      featuredImages: [
        {
          url: '/images/chromatic-polarization/玻璃对比-正交偏振系统-正视图.jpg',
          caption: 'Glass under crossed polarizers - modern demonstration of Malus\'s reflection discovery',
          captionZh: '正交偏振下的玻璃——马吕斯反射发现的现代演示'
        }
      ],
      featuredVideo: {
        url: '/videos/chromatic-polarization/实验-眼镜-正交偏振系统-旋转样品视频.mp4',
        title: 'Eyeglass lenses showing stress patterns under polarized light',
        titleZh: '偏振光下眼镜镜片显示的应力图案'
      },
      relatedModules: ['polarization-intro', 'malus-law', 'daily-polarization']
    }
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
    illustrationType: 'polarizer',
    // 马吕斯定律的现代实验演示
    experimentalResources: {
      resourceIds: [
        'clear-tape',                // 透明胶展示偏振效果
        'clear-tape-array',          // 透明胶阵列
        'water-bottle',              // 矿泉水瓶偏振
      ],
      featuredImages: [
        {
          url: '/images/chromatic-polarization/透明胶条（重叠阵列）-正交偏振系统-正视图.jpg',
          caption: 'Malus\'s Law in action - light intensity varies with polarizer angle',
          captionZh: '马吕斯定律实际应用——光强随偏振片角度变化'
        }
      ],
      featuredVideo: {
        url: '/videos/chromatic-polarization/实验-透明胶条-正交偏振系统-旋转偏振片视频.mp4',
        title: 'Rotating polarizer demonstrates Malus\'s cos²θ law',
        titleZh: '旋转偏振片演示马吕斯cos²θ定律'
      },
      relatedModules: ['malus-law', 'polarization-intro']
    }
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
      // 色偏振相关的多个实验视频
      featuredVideos: [
        {
          url: '/videos/chromatic-polarization/实验-透明胶条（重叠阵列）-正交偏振系统-旋转偏振片视频.mp4',
          title: 'Tape array - rotating analyzer shows color gradients',
          titleZh: '透明胶阵列 - 旋转检偏器展示色彩渐变'
        },
        {
          url: '/videos/chromatic-polarization/实验-保鲜膜3次重叠-正交偏振系统-旋转样品视频.mp4',
          title: 'Plastic wrap layers - thickness changes color',
          titleZh: '保鲜膜重叠 - 厚度变化产生不同颜色'
        },
        {
          url: '/videos/chromatic-polarization/实验-打火机烧玻璃-正交偏振系统-长时间观察视频.mp4',
          title: 'Glass heating - thermal stress evolution',
          titleZh: '玻璃加热 - 热应力动态演变'
        },
        {
          url: '/videos/chromatic-polarization/实验-透明胶条-正交偏振系统-旋转样品视频.mp4',
          title: 'Tape rotation - angle-dependent colors',
          titleZh: '透明胶旋转 - 角度相关的颜色变化'
        },
        {
          url: '/videos/chromatic-polarization/实验-保鲜膜拉伸-正交偏振系统-旋转样品视频.mp4',
          title: 'Plastic wrap stretching - stress birefringence',
          titleZh: '保鲜膜拉伸 - 应力双折射效果'
        }
      ],
      relatedModules: ['birefringence', 'stress-analysis', 'photoelasticity', 'interference']
    }
  },
  {
    year: 1812,
    titleEn: 'Brewster\'s Angle',
    titleZh: '布儒斯特角',
    descriptionEn: 'David Brewster discovers the specific angle at which reflected light is completely polarized, now called Brewster\'s angle.',
    descriptionZh: '大卫·布儒斯特发现了反射光完全偏振的特定角度，现称为布儒斯特角。',
    scientistEn: 'David Brewster',
    scientistZh: '大卫·布儒斯特',
    category: 'discovery',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'At Brewster\'s angle, reflected light is completely polarized',
        'tan(θ_B) = n₂/n₁, where n₁ and n₂ are refractive indices',
        'For air-glass interface: θ_B ≈ 56°',
        'Reflected and refracted rays are perpendicular at this angle',
        'Used in laser cavities (Brewster windows) to control polarization',
        'Explains why polarized sunglasses reduce glare from water and roads'
      ],
      zh: [
        '在布儒斯特角处，反射光完全偏振',
        'tan(θ_B) = n₂/n₁，其中n₁和n₂是折射率',
        '对于空气-玻璃界面：θ_B ≈ 56°',
        '在此角度反射光和折射光垂直',
        '用于激光腔（布儒斯特窗）控制偏振',
        '解释了为什么偏振太阳镜能减少水面和路面的眩光'
      ]
    },
    story: {
      en: `In Edinburgh, 1812, David Brewster — a Scottish physicist with an inventor's restless mind — was systematically studying Malus's newly discovered polarization by reflection. Where Malus had made a serendipitous observation, Brewster sought precise laws.

He measured, angle by angle, the polarization of light reflected from various substances. Glass, water, diamond — each material had its own characteristic. And then came the breakthrough: at one specific angle for each material, the reflected light was completely polarized.

Not partially. Not mostly. Completely. Every photon (though he wouldn't have used that word) vibrated in a single plane.

Brewster found that this magic angle followed a beautiful mathematical law: the tangent of the angle equaled the ratio of refractive indices. For glass in air, this meant about 56 degrees. At exactly this angle, reflected and refracted rays were perpendicular to each other.

"The polarizing angle is determined by the ratio of sines," he wrote, deriving what would forever bear his name: Brewster's Law.

The practical applications were immediate. Understanding why light from water surfaces was polarized explained age-old observations by fishermen. Later, laser engineers would cut their windows at Brewster's angle to create cavities with minimal reflection loss.

Brewster went on to invent the kaleidoscope and contribute to photography, but his angle remains his most lasting legacy. Every pair of polarized sunglasses that cuts the glare from a wet road is a tribute to his meticulous measurements two centuries ago.`,
      zh: `1812年，爱丁堡。大卫·布儒斯特——一位有着发明家般不安灵魂的苏格兰物理学家——正在系统地研究马吕斯新发现的反射偏振现象。马吕斯的观察是偶然的，布儒斯特则寻求精确的规律。

他逐角度测量从各种物质反射的光的偏振程度。玻璃、水、钻石——每种材料都有自己的特性。然后突破来了：对于每种材料，在一个特定角度，反射光是完全偏振的。

不是部分的。不是大部分。是完全的。每个光子（尽管他不会使用那个词）都在单一平面上振动。

布儒斯特发现这个神奇的角度遵循一个美丽的数学定律：该角度的正切等于折射率之比。对于空气中的玻璃，这意味着大约56度。恰好在这个角度，反射光和折射光相互垂直。

"偏振角由正弦之比决定，"他写道，推导出将永远以他命名的定律：布儒斯特定律。

实际应用是立竿见影的。理解为什么水面的光是偏振的，解释了渔民几百年来的观察。后来，激光工程师会按布儒斯特角切割窗口，以创建反射损失最小的腔体。

布儒斯特后来发明了万花筒并为摄影做出了贡献，但他的角度仍然是他最持久的遗产。每一副能减少湿滑路面眩光的偏振太阳镜，都是对他两个世纪前那些细致测量的致敬。`
    },
    scientistBio: {
      birthYear: 1781,
      deathYear: 1868,
      nationality: 'Scottish',
      portraitEmoji: '🔭',
      bioEn: 'Sir David Brewster was a Scottish physicist, mathematician, astronomer, inventor, and writer. He invented the kaleidoscope, made important contributions to optics, and helped found the British Association for the Advancement of Science. He was knighted in 1831.',
      bioZh: '大卫·布儒斯特爵士是苏格兰物理学家、数学家、天文学家、发明家和作家。他发明了万花筒，对光学做出了重要贡献，并帮助创建了英国科学促进会。他于1831年被封为爵士。'
    },
    scene: {
      location: 'Edinburgh, Scotland',
      season: 'Spring',
      mood: 'precision'
    },
    references: [
      { title: 'Brewster, D. (1815). On the Laws Which Regulate the Polarisation of Light by Reflexion from Transparent Bodies' }
    ],
    linkTo: {
      year: 1808,
      trackTarget: 'polarization',
      descriptionEn: 'Brewster\'s systematic study refined Malus\'s discovery of polarization by reflection',
      descriptionZh: '布儒斯特的系统研究完善了马吕斯关于反射偏振的发现'
    },
    thinkingQuestion: {
      en: 'Why do fishermen often wear polarized sunglasses? How does Brewster\'s angle help explain this?',
      zh: '为什么渔民经常戴偏振太阳镜？布儒斯特角如何帮助解释这一点？'
    },
    illustrationType: 'reflection',
    // 布儒斯特角实验演示
    experimentalResources: {
      resourceIds: [
        'brewster-apparatus',           // 布儒斯特角反射装置 (新增)
        'brewster-horizontal-dark-spot', // 横向偏振暗点现象 (新增)
        'brewster-vertical-dark-spot',   // 纵向偏振暗点现象 (新增)
        'glasses',                       // 偏振太阳镜效果
      ],
      featuredImages: [
        {
          url: '/images/brewster/反射装置正视图.jpg',
          caption: 'Brewster angle reflection apparatus - demonstrating complete polarization at specific angle',
          captionZh: '布儒斯特角反射装置——演示特定角度下的完全偏振'
        },
        {
          url: '/images/brewster/横向绿色光束暗点现象.jpg',
          caption: 'Dark spot phenomenon with horizontally polarized green laser at Brewster angle',
          captionZh: '横向偏振绿色激光在布儒斯特角下的暗点现象'
        }
      ],
      relatedModules: ['brewster', 'fresnel', 'polarization-intro']
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
    illustrationType: 'opticalactivity',
    // 旋光性的现代实验演示
    experimentalResources: {
      resourceIds: [
        'optical-rotation-setup',        // 旋光实验装置 (新增)
        'optical-rotation-white-light',  // 白光旋光实验 (新增)
        'optical-rotation-laser-front',  // 激光旋光正视图 (新增)
        'optical-rotation-laser-top',    // 激光旋光俯视图 (新增)
        'optical-rotation-with-polarizer', // 有偏振片 (新增)
        'optical-rotation-no-polarizer', // 无偏振片对比 (新增)
        'sugar-bag',                     // 白砂糖的旋光性
      ],
      featuredImages: [
        {
          url: '/images/optical-rotation/关闭室内照明、开启白光光源并使光经过偏振片后的情形.jpg',
          caption: 'Optical rotation experiment with white light through polarizer',
          captionZh: '白光通过偏振片的旋光实验'
        },
        {
          url: '/images/optical-rotation/关闭室内照明、开启绿色激光和红色激光并使光经过偏振片后的正视图.jpg',
          caption: 'Optical rotation with green and red lasers - different wavelengths rotate by different amounts',
          captionZh: '绿色和红色激光的旋光——不同波长旋转量不同'
        },
        {
          url: '/images/chromatic-polarization/白砂糖袋子-正交偏振系统-正视图（横向）.jpg',
          caption: 'Sugar demonstrating optical rotation - the chiral molecules rotate the polarization plane',
          captionZh: '白砂糖展示旋光性——手性分子旋转偏振面'
        }
      ],
      featuredVideo: {
        url: '/videos/chromatic-polarization/实验-白砂糖袋子-正交偏振系统-旋转样品视频.mp4',
        title: 'Optical rotation by sugar - Biot\'s discovery demonstrated',
        titleZh: '白砂糖的旋光性——毕奥发现的演示'
      },
      relatedModules: ['optical-rotation', 'chromatic', 'daily-polarization']
    }
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
    illustrationType: 'transverse',
    // 横波理论的现代实验演示
    experimentalResources: {
      resourceIds: [
        'plastic-wrap-stretching',  // 保鲜膜拉伸展示偏振特性
        'clear-tape',              // 透明胶的偏振效果
      ],
      featuredImages: [
        {
          url: '/images/chromatic-polarization/透明胶-正交偏振系统-正视图.jpg',
          caption: 'Transverse wave nature revealed by polarized light through stressed material',
          captionZh: '应力材料在偏振光下揭示光的横波特性'
        }
      ],
      featuredVideo: {
        url: '/videos/chromatic-polarization/实验-保鲜膜拉伸-正交偏振系统-旋转样品视频.mp4',
        title: 'Stretching creates optical axis - demonstrating transverse wave polarization',
        titleZh: '拉伸产生光轴——演示横波偏振'
      },
      relatedModules: ['birefringence', 'waveplate', 'polarization-intro']
    }
  },
  {
    year: 1822,
    titleEn: 'Fresnel\'s Circular Polarization Theory',
    titleZh: '菲涅尔圆偏振理论',
    descriptionEn: 'Fresnel explains optical rotation by proposing that linearly polarized light entering an optically active medium splits into left- and right-circular components traveling at different speeds.',
    descriptionZh: '菲涅尔通过提出线偏振光进入旋光介质后分解为左旋和右旋圆偏振分量且两者传播速度不同，解释了旋光性。',
    scientistEn: 'Augustin-Jean Fresnel',
    scientistZh: '奥古斯丁-让·菲涅尔',
    category: 'theory',
    importance: 2,
    track: 'polarization',
    details: {
      en: [
        'Linearly polarized light is the superposition of left- and right-circular polarized components',
        'In optically active media (like quartz), these two components travel at different speeds',
        'The speed difference creates a phase shift, rotating the plane of linear polarization',
        'Rotation angle θ ∝ path length × (n_L - n_R) where n_L and n_R are refractive indices for left and right circular light',
        'Unified understanding of optical activity in both crystals and chiral solutions',
        'This decomposition is now fundamental to understanding chiral optics'
      ],
      zh: [
        '线偏振光是左旋和右旋圆偏振分量的叠加',
        '在旋光介质（如石英）中，这两个分量以不同速度传播',
        '速度差导致相位差，使线偏振面旋转',
        '旋转角θ ∝ 路径长度 × (n_L - n_R)，其中n_L和n_R是左旋和右旋光的折射率',
        '统一理解了晶体和手性溶液中的旋光性',
        '这种分解现在是理解手性光学的基础'
      ]
    },
    story: {
      en: `In 1822, Augustin Fresnel tackled one of the most puzzling optical phenomena of his time: why did certain crystals and solutions rotate the plane of polarized light?

Arago had discovered the effect in quartz in 1811. Biot had shown that sugar solutions did the same. But why? What was happening to the light?

Fresnel's insight was breathtaking in its elegance. He proposed that linearly polarized light could be mathematically decomposed into two circularly polarized components — one rotating clockwise (right-circular), the other counter-clockwise (left-circular). In ordinary materials, these two components travel at identical speeds and recombine unchanged.

But in optically active materials — quartz crystals, sugar solutions, turpentine — something special happens. The two circular components travel at slightly different speeds. When they recombine after passing through the material, they form linearly polarized light again, but the plane of polarization has rotated.

The rotation angle depends on the difference in speeds (refractive indices) and the path length through the material. Fresnel had explained optical rotation through the geometry of circular polarization!

This theoretical framework unified the phenomena observed by Arago and Biot. It also laid the groundwork for understanding molecular chirality — the "handedness" of molecules that Pasteur would explore decades later.

Fresnel's circular polarization decomposition remains one of the most powerful conceptual tools in optical physics, connecting polarization, symmetry, and molecular structure.`,
      zh: `1822年，奥古斯丁·菲涅尔解决了他那个时代最令人困惑的光学现象之一：为什么某些晶体和溶液会旋转偏振光的振动面？

阿拉戈于1811年在石英中发现了这种效应。毕奥证明糖溶液也有同样的效果。但为什么呢？光发生了什么？

菲涅尔的洞见以其优雅令人叹为观止。他提出，线偏振光可以在数学上分解为两个圆偏振分量——一个顺时针旋转（右旋圆偏振），另一个逆时针旋转（左旋圆偏振）。在普通材料中，这两个分量以相同速度传播，重新组合后保持不变。

但在旋光材料——石英晶体、糖溶液、松节油——中，发生了特殊的事情。两个圆偏振分量以略微不同的速度传播。当它们穿过材料后重新组合时，再次形成线偏振光，但偏振面已经旋转了。

旋转角度取决于速度（折射率）的差异和通过材料的路径长度。菲涅尔通过圆偏振的几何学解释了旋光性！

这个理论框架统一了阿拉戈和毕奥观察到的现象。它也为理解分子手性——巴斯德几十年后将探索的分子"偏手性"——奠定了基础。

菲涅尔的圆偏振分解仍然是光学物理中最强大的概念工具之一，将偏振、对称性和分子结构联系在一起。`
    },
    scientistBio: {
      birthYear: 1788,
      deathYear: 1827,
      nationality: 'French',
      portraitEmoji: '🔄',
      bioEn: 'Augustin-Jean Fresnel revolutionized optics with his wave theory of light. His explanation of optical rotation using circular polarization components demonstrated the power of mathematical physics to reveal hidden symmetries in nature.',
      bioZh: '奥古斯丁-让·菲涅尔以其光的波动理论彻底改变了光学。他用圆偏振分量解释旋光性，展示了数学物理学揭示自然界隐藏对称性的力量。'
    },
    scene: {
      location: 'Paris, France',
      season: 'Spring',
      mood: 'mathematical elegance'
    },
    references: [
      { title: 'Fresnel, A. (1822). Mémoire sur la double réfraction que les rayons lumineux éprouvent en traversant les aiguilles de cristal de roche' }
    ],
    linkTo: {
      year: 1811,
      trackTarget: 'polarization',
      descriptionEn: 'Fresnel explained the optical rotation phenomenon Arago had discovered in quartz',
      descriptionZh: '菲涅尔解释了阿拉戈在石英中发现的旋光现象'
    },
    thinkingQuestion: {
      en: 'How can breaking linearly polarized light into two circular components explain rotation? What happens to the superposition when one component travels faster?',
      zh: '将线偏振光分解为两个圆偏振分量如何解释旋光？当一个分量传播更快时，叠加会发生什么？'
    }
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
    year: 1850,
    titleEn: 'Foucault Proves Light Slows in Water',
    titleZh: '傅科证明光在水中减速',
    descriptionEn: 'Léon Foucault demonstrates that light travels slower in water than in air, providing decisive evidence for the wave theory of light.',
    descriptionZh: '莱昂·傅科证明光在水中的传播速度比在空气中慢，为光的波动理论提供了决定性证据。',
    scientistEn: 'Léon Foucault',
    scientistZh: '莱昂·傅科',
    category: 'experiment',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Newton\'s particle theory predicted light should travel faster in denser media',
        'Wave theory predicted light should travel slower in denser media',
        'Foucault used a rapidly rotating mirror to compare light speeds',
        'Result: light travels about 25% slower in water than in air',
        'This definitively favored wave theory over particle theory',
        'Foucault also conducted this experiment simultaneously with Fizeau (1850)'
      ],
      zh: [
        '牛顿的微粒理论预测光在较密介质中应该传播更快',
        '波动理论预测光在较密介质中应该传播更慢',
        '傅科用快速旋转的镜子比较光速',
        '结果：光在水中比在空气中慢约25%',
        '这决定性地支持了波动理论而非微粒理论',
        '傅科与斐索同时进行了这个实验（1850）'
      ]
    },
    story: {
      en: `In the laboratories of Paris, 1850, two young physicists — Léon Foucault and Hippolyte Fizeau — were racing to answer a question that had puzzled scientists for two centuries: does light travel faster or slower in water?

The stakes were enormous. Newton's corpuscular theory predicted that light particles, pulled by denser matter, should speed up in water. Wave theory predicted the opposite: waves should slow down in denser media, just as sound travels faster in air than in water.

Foucault's apparatus was ingenious. A beam of light bounced off a rapidly rotating mirror, traveled to a distant reflector, and returned. If the light speed changed, the returning beam would hit the rotating mirror at a slightly different angle, detectable as a shift in the image.

The experiment was fiendishly difficult. The rotating mirror had to spin hundreds of times per second with perfect stability. The alignment had to be precise to fractions of a millimeter. But Foucault, working in a small Paris apartment, succeeded.

The result was unambiguous: light traveled slower in water than in air. About 25% slower, matching wave theory's prediction exactly. Newton's century-old particle theory received its death blow.

Fizeau, working independently, reached the same conclusion. Together, their experiments closed one of the longest-running debates in physics. Light was a wave — as Huygens, Young, and Fresnel had argued. The wave theory had triumphed.

Foucault would later gain greater fame for his pendulum demonstrating Earth's rotation. But his optical experiment of 1850 was equally momentous — the decisive evidence that settled the nature of light.`,
      zh: `1850年，巴黎的实验室里，两位年轻的物理学家——莱昂·傅科和伊波利特·斐索——正在竞相回答一个困扰科学家两个世纪的问题：光在水中传播是更快还是更慢？

赌注是巨大的。牛顿的微粒理论预测，光粒子被较密的物质吸引，应该在水中加速。波动理论预测恰恰相反：波在较密介质中应该减慢，就像声音在空气中比在水中传播得慢一样。

傅科的装置非常巧妙。一束光从快速旋转的镜子上反射，传到远处的反射器，然后返回。如果光速改变，返回的光束会以略微不同的角度击中旋转的镜子，可以检测到图像的偏移。

实验极其困难。旋转的镜子必须以每秒数百次的速度完美稳定地旋转。对准必须精确到毫米的几分之一。但傅科在巴黎的一间小公寓里成功了。

结果是明确的：光在水中比在空气中传播得慢。大约慢25%，与波动理论的预测完全一致。牛顿一个世纪之久的微粒理论遭受了致命打击。

斐索独立工作，得出了同样的结论。他们的实验共同结束了物理学史上持续时间最长的争论之一。光是波——正如惠更斯、杨和菲涅尔所论证的那样。波动理论胜利了。

傅科后来因展示地球自转的摆锤而获得更大的声誉。但他1850年的光学实验同样具有里程碑意义——这是确定光本质的决定性证据。`
    },
    scientistBio: {
      birthYear: 1819,
      deathYear: 1868,
      nationality: 'French',
      portraitEmoji: '🔄',
      bioEn: 'Jean Bernard Léon Foucault was a French physicist best known for the Foucault pendulum that demonstrated Earth\'s rotation, and for measuring the speed of light. He also invented the gyroscope and made improvements to photographic processes.',
      bioZh: '让·贝尔纳·莱昂·傅科是法国物理学家，以展示地球自转的傅科摆和测量光速而闻名。他还发明了陀螺仪，并改进了摄影工艺。'
    },
    scene: {
      location: 'Paris, France',
      season: 'Summer',
      mood: 'decisive'
    },
    references: [
      { title: 'Foucault, L. (1850). Méthode générale pour mesurer la vitesse de la lumière dans l\'air et les milieux transparents' }
    ],
    linkTo: {
      year: 1817,
      trackTarget: 'optics',
      descriptionEn: 'Foucault\'s experiment provided the decisive proof for Fresnel\'s wave theory of light',
      descriptionZh: '傅科的实验为菲涅尔的光波动理论提供了决定性证明'
    },
    thinkingQuestion: {
      en: 'Newton\'s theory had dominated for over a century. Why did it take so long to perform this crucial experiment?',
      zh: '牛顿的理论主导了一个多世纪。为什么这个关键实验花了这么长时间才进行？'
    },
    illustrationType: 'lightspeed'
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
    year: 1870,
    titleEn: 'Tyndall Effect',
    titleZh: '廷德尔效应',
    descriptionEn: 'John Tyndall discovers that light passing through a colloidal suspension scatters short wavelengths more strongly, with the scattered light being polarized.',
    descriptionZh: '约翰·廷德尔发现光穿过胶体悬浮液时，短波长散射更强烈，且散射光具有偏振特性。',
    scientistEn: 'John Tyndall',
    scientistZh: '约翰·廷德尔',
    category: 'experiment',
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
          url: '/images/scattering/不同浓度 80 nm 微球悬浊液透射光实物图（由左至右浓度递减）.jpg',
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
          url: '/images/scattering/分别为80nm-300nm-3um溶液小球散射效果.jpg',
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
    category: 'experiment',
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
    year: 1956,
    titleEn: 'Pancharatnam Geometric Phase',
    titleZh: '潘查拉特南几何相位',
    descriptionEn: 'S. Pancharatnam discovers that polarization states traversing a cyclic path on the Poincaré sphere acquire a geometric phase — a fundamental concept later generalized as Berry phase.',
    descriptionZh: 'S. 潘查拉特南发现在庞加莱球上经历循环路径的偏振态会获得几何相位——这一基本概念后来被推广为贝里相位。',
    scientistEn: 'Shivaramakrishnan Pancharatnam',
    scientistZh: '希瓦拉马克里希南·潘查拉特南',
    category: 'theory',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'When polarization state returns to its starting point via different paths, it acquires a phase difference',
        'This "geometric phase" depends only on the path geometry on the Poincaré sphere',
        'The phase equals half the solid angle subtended by the path',
        'Rediscovered by Michael Berry in 1984 as a general quantum phenomenon',
        'Foundation for geometric phase optics, metasurfaces, and optical vortex generation',
        'Pancharatnam died tragically young at 35, his work largely forgotten until Berry\'s revival'
      ],
      zh: [
        '当偏振态通过不同路径返回起点时，会获得相位差',
        '这种"几何相位"只取决于在庞加莱球上的路径几何',
        '相位等于路径所对应立体角的一半',
        '1984年被迈克尔·贝里重新发现为普遍的量子现象',
        '几何相位光学、超表面和光学涡旋产生的基础',
        '潘查拉特南不幸在35岁英年早逝，他的工作直到贝里的复兴才被重新认识'
      ]
    },
    story: {
      en: `In 1956, a young Indian physicist at the Raman Research Institute in Bangalore made a discovery that would wait decades to be fully appreciated.

Shivaramakrishnan Pancharatnam, only 22 years old, was investigating a peculiar question: what happens when polarized light undergoes a cycle of transformations and returns to its original polarization state? Classical optics suggested the light should be unchanged. But Pancharatnam discovered something deeper.

When a polarization state traverses a closed loop on the Poincaré sphere — perhaps passing through horizontal, circular, and diagonal polarizations before returning to horizontal — it acquires an extra phase shift. This phase depends not on the physical path of the light, but purely on the geometry of the polarization cycle.

Pancharatnam showed this "geometric phase" equals half the solid angle enclosed by the path on the Poincaré sphere. It was a beautiful result, connecting the geometry of polarization space to measurable optical effects.

Tragically, Pancharatnam died in 1969 at only 35, and his work remained largely unknown outside India. Then in 1984, physicist Michael Berry independently discovered that quantum systems undergoing cyclic adiabatic evolution acquire a similar geometric phase. Berry generously acknowledged Pancharatnam's priority, and the phenomenon is now called the "Pancharatnam-Berry phase."

Today, this geometric phase is the foundation for metasurface optics — flat lenses and holograms created by controlling the geometric phase pixel by pixel. Every metasurface-based device owes its existence to the insight of a young physicist in Bangalore who saw geometry where others saw only light.`,
      zh: `1956年，班加罗尔拉曼研究所的一位年轻印度物理学家做出了一个需要数十年才能被充分理解的发现。

年仅22岁的希瓦拉马克里希南·潘查拉特南正在研究一个特殊的问题：当偏振光经历一系列变换并返回其原始偏振态时会发生什么？经典光学认为光应该保持不变。但潘查拉特南发现了更深刻的东西。

当一个偏振态在庞加莱球上遍历一个闭合回路——也许从水平偏振经过圆偏振和对角偏振，然后返回水平——它会获得一个额外的相位偏移。这个相位不取决于光的物理路径，而纯粹取决于偏振循环的几何形状。

潘查拉特南证明这个"几何相位"等于路径在庞加莱球上所围成的立体角的一半。这是一个美丽的结果，将偏振空间的几何与可测量的光学效应联系起来。

不幸的是，潘查拉特南于1969年去世，年仅35岁，他的工作在印度以外基本不为人知。然后在1984年，物理学家迈克尔·贝里独立发现经历循环绝热演化的量子系统会获得类似的几何相位。贝里慷慨地承认了潘查拉特南的优先权，这个现象现在被称为"潘查拉特南-贝里相位"。

今天，这种几何相位是超表面光学的基础——通过逐像素控制几何相位创建的平面透镜和全息图。每一个基于超表面的器件都归功于班加罗尔那位年轻物理学家的洞见，他在别人只看到光的地方看到了几何。`
    },
    scientistBio: {
      birthYear: 1934,
      deathYear: 1969,
      nationality: 'Indian',
      portraitEmoji: '🔮',
      bioEn: 'Shivaramakrishnan Pancharatnam was an Indian physicist who worked at the Raman Research Institute. His discovery of the geometric phase in optics was ahead of its time and was rediscovered by Michael Berry in 1984.',
      bioZh: '希瓦拉马克里希南·潘查拉特南是印度物理学家，在拉曼研究所工作。他在光学中发现的几何相位超前于时代，并在1984年被迈克尔·贝里重新发现。'
    },
    scene: {
      location: 'Bangalore, India',
      season: 'Monsoon',
      mood: 'geometric insight'
    },
    references: [
      { title: 'Pancharatnam, S. (1956). Generalized theory of interference, and its applications. Proc. Indian Acad. Sci. 44:247-262' },
      { title: 'Berry, M. V. (1984). Quantal Phase Factors Accompanying Adiabatic Changes. Proc. R. Soc. Lond. A 392:45-57' }
    ],
    linkTo: {
      year: 2021,
      trackTarget: 'polarization',
      descriptionEn: 'Pancharatnam\'s geometric phase is the theoretical foundation for metasurface optics',
      descriptionZh: '潘查拉特南的几何相位是超表面光学的理论基础'
    },
    thinkingQuestion: {
      en: 'Why does a polarization state acquire a phase just from following a geometric path? How is this related to how flat metasurface lenses work?',
      zh: '为什么偏振态仅仅从遵循几何路径就能获得相位？这与平面超表面透镜的工作原理有什么关系？'
    }
  },
  {
    year: 1960,
    titleEn: 'Invention of the Laser',
    titleZh: '激光的发明',
    descriptionEn: 'Theodore Maiman demonstrates the first working laser, creating highly coherent, polarized light that will revolutionize optics.',
    descriptionZh: '西奥多·梅曼展示了第一台可工作的激光器，创造出高度相干的偏振光，这将彻底革新光学。',
    scientistEn: 'Theodore Maiman',
    scientistZh: '西奥多·梅曼',
    category: 'discovery',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'First laser used a ruby crystal pumped by a flashlamp',
        'Produced coherent light at 694.3 nm (deep red)',
        'Laser light is inherently highly polarized',
        'LASER = Light Amplification by Stimulated Emission of Radiation',
        'Based on Einstein\'s 1917 theory of stimulated emission',
        'Initial reaction: "a solution looking for a problem"',
        'Now essential for fiber optics, surgery, manufacturing, holography, and research'
      ],
      zh: [
        '第一台激光器使用闪光灯泵浦的红宝石晶体',
        '产生694.3纳米（深红色）的相干光',
        '激光天然具有高度偏振性',
        'LASER = 受激辐射光放大',
        '基于爱因斯坦1917年的受激辐射理论',
        '最初的反应："一个在寻找问题的解决方案"',
        '现在对光纤通信、手术、制造、全息术和研究必不可少'
      ]
    },
    story: {
      en: `May 16, 1960. In a small laboratory at Hughes Research Laboratories in Malibu, California, Theodore Maiman pointed a flashlamp at a synthetic ruby rod and changed the world.

The idea of the laser had been in the air for years. Einstein had predicted stimulated emission in 1917 — the principle that atoms could be triggered to emit light in perfect synchrony. Charles Townes had won the Nobel Prize for the maser (microwave version) in 1954. But visible light lasers remained elusive.

Maiman's approach was elegant in its simplicity. A polished ruby rod, its ends silvered to form mirrors, would serve as the gain medium. A powerful flashlamp, coiled around it, would pump the chromium atoms to excited states. And then — in a flash — they would all emit their photons in lockstep.

The first pulse was just 0.2 milliseconds long. But it was light like no one had ever seen: a deep red beam of extraordinary intensity and perfect coherence. Every photon marched in step, vibrating in the same direction — naturally polarized.

"A solution looking for a problem," some skeptics called it. How wrong they were.

Within years, lasers would cut steel, read barcodes, carry phone calls through glass fibers, and perform surgery with unprecedented precision. The polarized nature of laser light made it perfect for holography, materials science, and quantum optics experiments.

Maiman's 1960 flash of ruby light opened an era. Today, lasers are everywhere — in your DVD player, your supermarket checkout, your eye surgeon's office. The coherent, polarized beam that emerged from that Malibu laboratory touches nearly every aspect of modern life.`,
      zh: `1960年5月16日。在加利福尼亚州马里布的休斯研究实验室的一个小实验室里，西奥多·梅曼将一盏闪光灯对准一根人造红宝石棒，改变了世界。

激光的想法在空气中已经酝酿多年。爱因斯坦在1917年预测了受激发射——原子可以被触发以完美同步的方式发射光。查尔斯·汤斯在1954年因脉泽（微波版本）获得诺贝尔奖。但可见光激光器仍然难以捉摸。

梅曼的方法在其简单性上很优雅。一根抛光的红宝石棒，两端镀银形成镜子，将作为增益介质。一盏强大的闪光灯，盘绕在它周围，将把铬原子泵浦到激发态。然后——一闪——它们将同步发射光子。

第一个脉冲只有0.2毫秒长。但那是前所未见的光：一束深红色的光束，具有非凡的强度和完美的相干性。每个光子都步调一致，沿同一方向振动——天然偏振。

"一个在寻找问题的解决方案，"一些怀疑论者这样说。他们大错特错。

几年之内，激光将切割钢铁、读取条形码、通过玻璃光纤传输电话、并以前所未有的精度进行手术。激光的偏振特性使其非常适合全息术、材料科学和量子光学实验。

梅曼1960年的红宝石闪光开启了一个时代。今天，激光无处不在——在你的DVD播放器里、在超市收银台、在眼科医生的办公室里。从那个马里布实验室发出的相干偏振光束，触及现代生活的几乎每一个方面。`
    },
    scientistBio: {
      birthYear: 1927,
      deathYear: 2007,
      nationality: 'American',
      portraitEmoji: '💎',
      bioEn: 'Theodore Harold Maiman was an American physicist who built the first working laser in 1960. Despite the profound impact of his invention, he was never awarded the Nobel Prize, a controversial omission. He founded several laser companies and received numerous other awards.',
      bioZh: '西奥多·哈罗德·梅曼是美国物理学家，于1960年建造了第一台可工作的激光器。尽管他的发明影响深远，但他从未获得诺贝尔奖，这是一个有争议的遗漏。他创立了几家激光公司，并获得了许多其他奖项。'
    },
    scene: {
      location: 'Malibu, California, USA',
      season: 'Spring',
      mood: 'breakthrough'
    },
    references: [
      { title: 'Maiman, T. H. (1960). Stimulated Optical Radiation in Ruby', url: 'https://doi.org/10.1038/187493a0' }
    ],
    linkTo: {
      year: 1905,
      trackTarget: 'optics',
      descriptionEn: 'The laser was made possible by Einstein\'s 1917 theory of stimulated emission, based on his photon concept',
      descriptionZh: '激光的实现得益于爱因斯坦1917年基于其光子概念提出的受激辐射理论'
    },
    thinkingQuestion: {
      en: 'The laser was initially dismissed as "a solution looking for a problem." What lessons does this teach about evaluating new technologies?',
      zh: '激光最初被认为是"一个在寻找问题的解决方案"。这给我们评估新技术什么教训？'
    }
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
    year: 1982,
    titleEn: 'Aspect Experiment: Bell\'s Inequality',
    titleZh: '阿斯佩实验：贝尔不等式验证',
    descriptionEn: 'Alain Aspect and colleagues use entangled photon polarization to definitively test Bell\'s inequality, proving quantum entanglement is real.',
    descriptionZh: '阿兰·阿斯佩及其同事利用纠缠光子的偏振关联确定性地验证贝尔不等式，证明量子纠缠是真实存在的。',
    scientistEn: 'Alain Aspect, Philippe Grangier, Gérard Roger',
    scientistZh: '阿兰·阿斯佩、菲利普·格朗日、热拉尔·罗杰',
    category: 'experiment',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Pairs of entangled photons with correlated polarizations are created from calcium atom cascades',
        'Measuring one photon\'s polarization instantly determines the other\'s, regardless of distance',
        'Bell\'s inequality predicts limits for classical (local hidden variable) correlations',
        'Aspect\'s experiment violated Bell\'s inequality, ruling out local hidden variable theories',
        'Time-varying analyzer switches eliminated the "locality loophole"',
        'Foundation for quantum cryptography and quantum computing',
        'Aspect shared the 2022 Nobel Prize in Physics for this work'
      ],
      zh: [
        '从钙原子级联过程中产生具有相关偏振的纠缠光子对',
        '测量一个光子的偏振会即时确定另一个的偏振，与距离无关',
        '贝尔不等式预测了经典（局域隐变量）关联的限制',
        '阿斯佩的实验违反了贝尔不等式，排除了局域隐变量理论',
        '时变分析器开关消除了"局域性漏洞"',
        '量子密码学和量子计算的基础',
        '阿斯佩因此工作获得2022年诺贝尔物理学奖'
      ]
    },
    story: {
      en: `In 1982, at the Institut d'Optique outside Paris, a young physicist named Alain Aspect was about to settle one of the oldest debates in quantum mechanics — using nothing more sophisticated than photon polarization.

The question had been posed by Einstein, Podolsky, and Rosen in 1935: can quantum mechanics really allow "spooky action at a distance"? If two photons are created together in an "entangled" state, quantum mechanics says their polarizations are correlated — measure one, and you instantly know the other, no matter how far apart they are.

Einstein believed there must be hidden variables — predetermined answers the photons carry with them. In 1964, physicist John Bell proved that quantum mechanics and local hidden variable theories make different predictions that could be experimentally tested.

Aspect designed a decisive experiment. Calcium atoms were excited to emit pairs of photons with entangled polarizations. Fast-switching analyzers could be rotated during the photons' flight, eliminating any possibility that information traveled between them. Thousands of measurements were made, and the correlations were calculated.

The results were unambiguous: Bell's inequality was violated. Nature was quantum mechanical, not classical. The photons shared a mysterious correlation that could not be explained by any local hidden variable theory. Polarization, the same property that Malus had studied so carefully, was revealing the deepest mysteries of quantum reality.

Aspect's experiment opened the door to quantum information science. Today, entangled photon pairs — their polarizations forever correlated — form the backbone of quantum cryptography and are being developed for quantum computing. The "spooky action" Einstein dismissed has become the foundation of a technological revolution.`,
      zh: `1982年，在巴黎郊外的光学研究所，一位名叫阿兰·阿斯佩的年轻物理学家即将解决量子力学中最古老的争论之一——仅仅使用光子偏振这样简单的工具。

这个问题是由爱因斯坦、波多尔斯基和罗森在1935年提出的：量子力学真的允许"幽灵般的超距作用"吗？如果两个光子在"纠缠"状态下一起产生，量子力学说它们的偏振是相关的——测量一个，你就立即知道另一个，无论它们相距多远。

爱因斯坦相信一定存在隐变量——光子携带的预定答案。1964年，物理学家约翰·贝尔证明量子力学和局域隐变量理论做出不同的预测，这些预测可以通过实验验证。

阿斯佩设计了一个决定性的实验。钙原子被激发以发射具有纠缠偏振的光子对。快速切换的分析器可以在光子飞行期间旋转，消除任何信息在它们之间传递的可能性。进行了数千次测量，并计算了关联性。

结果是明确的：贝尔不等式被违反了。自然是量子力学的，而不是经典的。光子共享一种神秘的关联，任何局域隐变量理论都无法解释。偏振，马吕斯曾如此仔细研究的同一性质，正在揭示量子现实最深刻的奥秘。

阿斯佩的实验打开了量子信息科学的大门。今天，纠缠光子对——它们的偏振永远相关——构成了量子密码学的支柱，并正在被开发用于量子计算。爱因斯坦所否定的"幽灵般的作用"已经成为一场技术革命的基础。`
    },
    scientistBio: {
      birthYear: 1947,
      nationality: 'French',
      portraitEmoji: '⚛️',
      bioEn: 'Alain Aspect is a French physicist who performed the definitive tests of Bell\'s inequality. His work on quantum entanglement using photon polarization earned him the 2022 Nobel Prize in Physics, shared with John Clauser and Anton Zeilinger.',
      bioZh: '阿兰·阿斯佩是法国物理学家，进行了贝尔不等式的决定性验证。他利用光子偏振研究量子纠缠的工作使他获得了2022年诺贝尔物理学奖，与约翰·克劳泽和安东·塞林格共同分享。'
    },
    scene: {
      location: 'Orsay, France',
      season: 'Autumn',
      mood: 'quantum revelation'
    },
    references: [
      { title: 'Aspect, A., Grangier, P., & Roger, G. (1982). Experimental Realization of Einstein-Podolsky-Rosen-Bohm Gedankenexperiment. Physical Review Letters 49:91-94' },
      { title: 'Bell, J. S. (1964). On the Einstein Podolsky Rosen Paradox. Physics 1:195-200' }
    ],
    linkTo: {
      year: 2023,
      trackTarget: 'polarization',
      descriptionEn: 'Aspect\'s entangled photons enabled quantum polarimetry beyond classical limits',
      descriptionZh: '阿斯佩的纠缠光子使量子偏振测量超越了经典极限'
    },
    thinkingQuestion: {
      en: 'When two entangled photons are measured, they always show correlated polarizations, even when separated by vast distances. How does polarization reveal the "non-local" nature of quantum mechanics?',
      zh: '当两个纠缠光子被测量时，即使相隔很远，它们总是显示相关的偏振。偏振如何揭示量子力学的"非定域"本质？'
    }
  },
  {
    year: 1992,
    titleEn: 'Orbital Angular Momentum of Light',
    titleZh: '光的轨道角动量',
    descriptionEn: 'Les Allen and colleagues prove that light beams can carry orbital angular momentum independent of spin (polarization) — opening a new dimension in optical physics.',
    descriptionZh: '莱斯·艾伦及其同事证明光束可以携带独立于自旋（偏振）的轨道角动量——为光学物理开辟了新维度。',
    scientistEn: 'Les Allen, Marco Beijersbergen, Robert Spreeuw, J.P. Woerdman',
    scientistZh: '莱斯·艾伦、马可·贝耶斯贝根、罗伯特·斯普鲁、J.P. 沃德曼',
    category: 'theory',
    importance: 1,
    track: 'polarization',
    details: {
      en: [
        'Light has two forms of angular momentum: spin (polarization, ±ℏ) and orbital (helical phase, ℓℏ)',
        'Optical vortex beams carry orbital angular momentum with helical wavefronts',
        'Spin-orbit interaction: the two angular momenta can couple and exchange',
        'The Photon Spin Hall Effect arises from spin-orbit interaction',
        'Enables optical tweezers to rotate microscopic objects',
        'Opens possibilities for higher-dimensional quantum communication'
      ],
      zh: [
        '光有两种角动量形式：自旋（偏振，±ℏ）和轨道（螺旋相位，ℓℏ）',
        '光学涡旋光束携带具有螺旋波前的轨道角动量',
        '自旋-轨道相互作用：两种角动量可以耦合和交换',
        '光子自旋霍尔效应源于自旋-轨道相互作用',
        '使光学镊子能够旋转微观物体',
        '为更高维度的量子通信开辟了可能性'
      ]
    },
    story: {
      en: `In 1992, at the University of Leiden, physicists Les Allen and colleagues made a discovery that expanded our understanding of light beyond its familiar polarization.

It had long been known that circularly polarized light carries spin angular momentum — each photon carries ±ℏ depending on its handedness. But Allen showed that light beams with helical phase fronts carry an additional form of angular momentum: orbital angular momentum (OAM).

These "optical vortex" beams have a phase that winds around the beam axis like a corkscrew. A photon in such a beam carries orbital angular momentum ℓℏ, where ℓ can be any integer — not just ±1 like spin. The discovery meant photons have two independent angular momentum degrees of freedom.

The implications were profound. Spin (polarization) and orbital angular momenta can interact — a phenomenon called spin-orbit coupling. This interaction gives rise to effects like the Photon Spin Hall Effect, where photons of different polarization states deflect in opposite directions.

In optical tweezers, orbital angular momentum allows microscopic particles to be rotated, not just trapped. In quantum communications, the unlimited values of ℓ offer a vast state space for encoding information — potentially enabling secure communication channels with much higher capacity than polarization alone.

Allen's discovery revealed that polarization is just one facet of light's angular momentum. The interplay between spin and orbital angular momentum has become one of the most active research areas in modern optics.`,
      zh: `1992年，在莱顿大学，物理学家莱斯·艾伦及其同事做出了一项发现，将我们对光的理解扩展到了其熟悉的偏振之外。

人们早已知道圆偏振光携带自旋角动量——每个光子根据其旋向携带±ℏ。但艾伦证明，具有螺旋相位前端的光束携带另一种形式的角动量：轨道角动量（OAM）。

这些"光学涡旋"光束的相位像开瓶器一样围绕光束轴旋绕。这种光束中的光子携带轨道角动量ℓℏ，其中ℓ可以是任何整数——而不仅仅是像自旋那样的±1。这一发现意味着光子有两个独立的角动量自由度。

其影响是深远的。自旋（偏振）和轨道角动量可以相互作用——这种现象被称为自旋-轨道耦合。这种相互作用产生了诸如光子自旋霍尔效应等效应，其中不同偏振态的光子向相反方向偏转。

在光学镊子中，轨道角动量允许微观粒子被旋转，而不仅仅是被捕获。在量子通信中，ℓ的无限值提供了巨大的状态空间来编码信息——可能使安全通信信道的容量远高于仅使用偏振。

艾伦的发现揭示了偏振只是光角动量的一个方面。自旋和轨道角动量之间的相互作用已成为现代光学中最活跃的研究领域之一。`
    },
    scientistBio: {
      portraitEmoji: '🌀',
      bioEn: 'Les Allen was a British-Australian physicist at the University of Leiden who discovered that light beams can carry orbital angular momentum. His work opened the field of singular optics and optical vortices.',
      bioZh: '莱斯·艾伦是莱顿大学的英籍澳大利亚物理学家，发现光束可以携带轨道角动量。他的工作开创了奇异光学和光学涡旋领域。'
    },
    scene: {
      location: 'Leiden, Netherlands',
      season: 'Spring',
      mood: 'paradigm expansion'
    },
    references: [
      { title: 'Allen, L., Beijersbergen, M.W., Spreeuw, R.J.C., & Woerdman, J.P. (1992). Orbital angular momentum of light and the transformation of Laguerre-Gaussian laser modes. Physical Review A 45:8185' }
    ],
    thinkingQuestion: {
      en: 'Polarization (spin) and orbital angular momentum are two independent properties of light. How might we use both together to increase the information capacity of optical communication?',
      zh: '偏振（自旋）和轨道角动量是光的两个独立性质。我们如何同时使用两者来增加光通信的信息容量？'
    }
  },
  {
    year: 2009,
    titleEn: 'RealD 3D Cinema',
    titleZh: 'RealD 3D 电影',
    descriptionEn: 'RealD 3D technology uses circular polarization to create immersive 3D movie experiences, bringing polarization science to millions of moviegoers.',
    descriptionZh: 'RealD 3D技术使用圆偏振创造沉浸式3D电影体验，将偏振科学带给数百万电影观众。',
    category: 'application',
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
    category: 'experiment',
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
    year: 2016,
    titleEn: 'LIGO Detects Gravitational Waves',
    titleZh: 'LIGO探测到引力波',
    descriptionEn: 'LIGO uses laser interferometry to detect gravitational waves from merging black holes — the most precise optical measurement ever made.',
    descriptionZh: 'LIGO使用激光干涉测量法探测到来自合并黑洞的引力波——有史以来最精密的光学测量。',
    scientistEn: 'Rainer Weiss, Kip Thorne, Barry Barish et al.',
    scientistZh: '雷纳·韦斯、基普·索恩、巴里·巴里什等',
    category: 'experiment',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Two 4-km laser interferometer arms at right angles',
        'Detected length changes of 10⁻¹⁹ meters (less than a proton diameter)',
        'Laser light splits, travels 4 km, recombines — interference reveals tiny length changes',
        'Polarization stabilization essential for maintaining coherent interference',
        'First detection: September 14, 2015 (announced February 2016)',
        'Nobel Prize in Physics 2017 for Weiss, Thorne, and Barish',
        'Opens new field of gravitational wave astronomy'
      ],
      zh: [
        '两条4公里长的激光干涉臂呈直角',
        '检测到10⁻¹⁹米的长度变化（比质子直径还小）',
        '激光分束、行进4公里、再合并——干涉揭示微小的长度变化',
        '偏振稳定对于保持相干干涉至关重要',
        '首次探测：2015年9月14日（2016年2月公布）',
        '2017年诺贝尔物理学奖授予韦斯、索恩和巴里什',
        '开启引力波天文学新领域'
      ]
    },
    story: {
      en: `On September 14, 2015, at 09:50:45 UTC, a ripple in spacetime from a billion light-years away swept through Earth. Two massive black holes, spiraling together and merging in a cataclysmic event, had sent gravitational waves radiating outward at the speed of light.

LIGO was listening. The Laser Interferometer Gravitational-Wave Observatory — two L-shaped facilities in Louisiana and Washington — caught the signal.

The principle was beautifully simple: split a laser beam, send halves down perpendicular 4-kilometer arms, and recombine them. If a gravitational wave passed, it would stretch one arm and compress the other, changing the path length by an almost inconceivably small amount. The recombined beams would interfere differently — and that difference could be measured.

Almost inconceivably small. LIGO detected a length change of about 4 × 10⁻¹⁸ meters — roughly one-thousandth the diameter of a proton. It was the most precise measurement ever made by humans.

Polarization played a crucial role. The laser light had to maintain perfect polarization through kilometers of travel and multiple reflections. Any polarization drift would introduce noise and mask the signal. Sophisticated polarization control systems kept the interference stable.

Einstein had predicted gravitational waves a century earlier, but thought they'd never be detected. LIGO proved him wrong about detectability, while proving him magnificently right about their existence.

The discovery opened a new window on the universe. Neutron star mergers, black hole collisions, perhaps even echoes from the Big Bang — gravitational wave astronomy was born. And at its heart was the same principle Michelson had used in 1887: laser interferometry, carried to almost supernatural precision.`,
      zh: `2015年9月14日，UTC时间09:50:45，一道来自十亿光年外的时空涟漪扫过地球。两个巨大的黑洞螺旋靠近并在一次灾变性事件中合并，向外辐射出以光速传播的引力波。

LIGO在倾听。激光干涉引力波天文台——位于路易斯安那州和华盛顿州的两个L形设施——捕捉到了这个信号。

原理非常简单：将激光束分成两半，沿垂直的4公里臂发送，然后重新合并。如果引力波经过，它会拉伸一个臂并压缩另一个臂，改变光程——变化量几乎小到难以想象。重新合并的光束会产生不同的干涉——这种差异可以被测量。

几乎小到难以想象。LIGO检测到大约4 × 10⁻¹⁸米的长度变化——大约是质子直径的千分之一。这是人类有史以来最精确的测量。

偏振起着关键作用。激光必须在数公里的传播和多次反射中保持完美的偏振。任何偏振漂移都会引入噪声并掩盖信号。复杂的偏振控制系统保持干涉稳定。

爱因斯坦在一个世纪前预测了引力波，但认为它们永远不会被探测到。LIGO证明他对可探测性的判断是错误的，同时辉煌地证明了他对引力波存在的预测是正确的。

这一发现打开了观察宇宙的新窗口。中子星合并、黑洞碰撞，也许甚至是大爆炸的回声——引力波天文学诞生了。而其核心是迈克尔逊在1887年使用的同一原理：激光干涉测量法，达到了近乎超自然的精度。`
    },
    scientistBio: {
      birthYear: 1932,
      nationality: 'American',
      portraitEmoji: '🔭',
      bioEn: 'Rainer Weiss, Kip Thorne, and Barry Barish shared the 2017 Nobel Prize in Physics for their roles in the detection of gravitational waves. Weiss invented the laser interferometric technique, Thorne contributed theoretical insights, and Barish led the project to completion.',
      bioZh: '雷纳·韦斯、基普·索恩和巴里·巴里什因在引力波探测中的作用而分享了2017年诺贝尔物理学奖。韦斯发明了激光干涉测量技术，索恩贡献了理论见解，巴里什领导项目完成。'
    },
    scene: {
      location: 'Livingston, Louisiana & Hanford, Washington, USA',
      season: 'Autumn',
      mood: 'cosmic discovery'
    },
    references: [
      { title: 'Abbott, B. P. et al. (2016). Observation of Gravitational Waves from a Binary Black Hole Merger', url: 'https://doi.org/10.1103/PhysRevLett.116.061102' }
    ],
    linkTo: {
      year: 1960,
      trackTarget: 'optics',
      descriptionEn: 'LIGO relies on ultra-stable lasers that trace back to Maiman\'s 1960 invention',
      descriptionZh: 'LIGO依赖于可追溯至梅曼1960年发明的超稳定激光器'
    },
    thinkingQuestion: {
      en: 'LIGO detected a change smaller than a proton. What challenges does such extreme precision pose? How did optical engineering make it possible?',
      zh: 'LIGO检测到了比质子还小的变化。如此极端的精度带来了什么挑战？光学工程如何使之成为可能？'
    }
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
  // ===== 新增历史事件 (新科学家) =====
  {
    year: 1609,
    titleEn: 'Galileo\'s Telescope Revolution',
    titleZh: '伽利略的望远镜革命',
    descriptionEn: 'Galileo Galilei improves the refracting telescope and turns it toward the heavens, beginning modern observational astronomy.',
    descriptionZh: '伽利略·伽利莱改进折射望远镜并将其指向天空，开启了现代观测天文学。',
    scientistEn: 'Galileo Galilei',
    scientistZh: '伽利略·伽利莱',
    category: 'experiment',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Improved Dutch telescope design to 20x magnification',
        'Discovered Jupiter\'s moons, Saturn\'s rings, lunar craters',
        'Observed phases of Venus proving heliocentric model',
        'Laid foundation for lens-based optical instruments'
      ],
      zh: [
        '将荷兰望远镜设计改进至20倍放大',
        '发现木星卫星、土星光环、月球环形山',
        '观察金星相位证明日心说',
        '为透镜光学仪器奠定基础'
      ]
    },
    scientistBio: {
      birthYear: 1564,
      deathYear: 1642,
      nationality: 'Italian',
      portraitEmoji: '🔭',
      bioEn: 'Galileo Galilei is called the "father of modern science." His telescope observations transformed our understanding of the universe.',
      bioZh: '伽利略·伽利莱被称为"现代科学之父"。他的望远镜观测改变了我们对宇宙的理解。'
    },
    scene: {
      location: 'Padua and Venice, Italy',
      season: 'Summer',
      mood: 'revolutionary discovery'
    }
  },
  {
    year: 1662,
    titleEn: 'Fermat\'s Principle of Least Time',
    titleZh: '费马最短时间原理',
    descriptionEn: 'Pierre de Fermat derives refraction law from the principle that light takes the path of least time.',
    descriptionZh: '皮埃尔·德·费马从光走最短时间路径的原理推导出折射定律。',
    scientistEn: 'Pierre de Fermat',
    scientistZh: '皮埃尔·德·费马',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Light chooses the path of least time, not shortest distance',
        'Mathematically derived Snell\'s law from first principles',
        'Introduced variational thinking to physics',
        'Precursor to principle of least action in mechanics'
      ],
      zh: [
        '光选择时间最短的路径，而非距离最短',
        '从第一原理数学推导斯涅尔定律',
        '将变分思想引入物理学',
        '力学中最小作用量原理的先驱'
      ]
    },
    scientistBio: {
      birthYear: 1607,
      deathYear: 1665,
      nationality: 'French',
      portraitEmoji: '📐',
      bioEn: 'Pierre de Fermat was a lawyer and amateur mathematician whose contributions to optics, number theory, and probability were foundational.',
      bioZh: '皮埃尔·德·费马是一位律师兼业余数学家，他对光学、数论和概率论的贡献是奠基性的。'
    },
    scene: {
      location: 'Toulouse, France',
      season: 'Autumn',
      mood: 'mathematical elegance'
    }
  },
  {
    year: 1814,
    titleEn: 'Fraunhofer Lines: The Sun\'s Fingerprint',
    titleZh: '夫琅和费线：太阳的指纹',
    descriptionEn: 'Joseph von Fraunhofer maps hundreds of dark lines in the solar spectrum, founding spectroscopy.',
    descriptionZh: '约瑟夫·冯·夫琅和费绘制了太阳光谱中数百条暗线，创立了光谱学。',
    scientistEn: 'Joseph von Fraunhofer',
    scientistZh: '约瑟夫·冯·夫琅和费',
    category: 'discovery',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Mapped 574 dark lines in the solar spectrum',
        'Labeled major lines with letters (A, B, C... still used today)',
        'Invented the diffraction grating for precise spectral analysis',
        'Founded spectroscopy — identifying elements by spectral signatures'
      ],
      zh: [
        '绘制了太阳光谱中574条暗线',
        '用字母标记主要线条（A、B、C...至今仍在使用）',
        '发明了用于精确光谱分析的衍射光栅',
        '创立了光谱学——通过光谱特征识别元素'
      ]
    },
    scientistBio: {
      birthYear: 1787,
      deathYear: 1826,
      nationality: 'German',
      portraitEmoji: '🌈',
      bioEn: 'Joseph von Fraunhofer rose from poverty to become the foremost optical instrument maker of his era.',
      bioZh: '约瑟夫·冯·夫琅和费从贫困中崛起，成为他那个时代最杰出的光学仪器制造商。'
    },
    scene: {
      location: 'Munich, Bavaria',
      season: 'Summer',
      mood: 'precision and discovery'
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
    category: 'experiment',
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
    category: 'experiment',
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
  {
    year: 1932,
    titleEn: 'Land\'s Polaroid: Light for Everyone',
    titleZh: '兰德的宝丽来：让光为人人所用',
    descriptionEn: 'Edwin Land invents large-sheet polarizing filters, making polarized light technology accessible for everyday use.',
    descriptionZh: '埃德温·兰德发明大面积偏振滤光片，使偏振光技术可用于日常生活。',
    scientistEn: 'Edwin Land',
    scientistZh: '埃德温·兰德',
    category: 'application',
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
  {
    year: 1947,
    titleEn: 'Gabor Invents Holography',
    titleZh: '盖博发明全息术',
    descriptionEn: 'Dennis Gabor conceives holography — recording both amplitude and phase of light for 3D imaging.',
    descriptionZh: '丹尼斯·盖博构想出全息术——同时记录光波振幅和相位实现三维成像。',
    scientistEn: 'Dennis Gabor',
    scientistZh: '丹尼斯·盖博',
    category: 'theory',
    importance: 2,
    track: 'optics',
    details: {
      en: [
        'Proposed recording interference pattern of object and reference beams',
        'Reconstruction creates 3D image with parallax',
        'Originally developed to improve electron microscopes',
        'Full potential realized after invention of lasers in 1960s'
      ],
      zh: [
        '提出记录物光束和参考光束的干涉图样',
        '重建产生具有视差的3D图像',
        '最初为改进电子显微镜而开发',
        '在1960年代激光发明后才充分发挥潜力'
      ]
    },
    scientistBio: {
      birthYear: 1900,
      deathYear: 1979,
      nationality: 'Hungarian-British',
      portraitEmoji: '💿',
      bioEn: 'Dennis Gabor received the 1971 Nobel Prize for inventing holography. His theoretical invention had to wait decades for laser technology.',
      bioZh: '丹尼斯·盖博因发明全息术获得1971年诺贝尔奖。他的理论发明等待了数十年才有激光技术使其实用。'
    },
    scene: {
      location: 'Rugby, England',
      season: 'Autumn',
      mood: 'theoretical breakthrough'
    }
  },
]
