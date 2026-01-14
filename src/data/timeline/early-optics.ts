/**
 * Timeline Events: Early Optics (1621-1800)
 * 早期光学 (1621-1800)
 *
 * From Snell's Law to the foundations of wave theory
 */

import type { TimelineEvent } from './types'

export const EARLY_OPTICS_EVENTS: TimelineEvent[] = [
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
    category: 'discovery',
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
    descriptionEn: 'Isaac Newton publishes "Opticks", his comprehensive treatise on the nature of light, establishing the corpuscular theory.',
    descriptionZh: '牛顿出版《光学》，这是他关于光的本质的全面论著，确立了光的微粒学说。',
    scientistEn: 'Isaac Newton',
    scientistZh: '艾萨克·牛顿',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Written in English rather than Latin, making it accessible to wider audience',
        'Documented extensive experiments on color, refraction, and diffraction',
        'Proposed light consists of tiny particles (corpuscles)',
        'Included famous "Queries" section speculating on the nature of light and matter'
      ],
      zh: [
        '以英文而非拉丁文写成，使更广泛的读者能够阅读',
        '记录了关于颜色、折射和衍射的大量实验',
        '提出光由微小粒子（微粒）组成',
        '包含著名的"疑问"章节，推测光和物质的本质'
      ]
    },
    story: {
      en: `By 1704, Newton had waited nearly forty years. The Opticks had been essentially complete since the 1670s, but Newton refused to publish while Robert Hooke lived — the two had clashed bitterly over their competing theories of light.

Hooke died in 1703. Within months, Opticks appeared in London bookshops.

Unlike his intimidating Principia written in Latin, Newton chose English for Opticks, making it accessible to craftsmen, instrument makers, and curious amateurs. The book was structured around experiments anyone could reproduce with prisms, lenses, and careful observation.

At its heart was Newton's corpuscular theory: light, he argued, consisted of tiny particles emitted by luminous bodies. This explained reflection (particles bouncing) and refraction (particles accelerating at boundaries). It seemed to triumph over Huygens' wave theory.

But Newton was too honest to pretend certainty where he had none. In the famous "Queries" at the book's end, he posed 31 questions about nature's deepest secrets: What causes gravity? What is the relationship between light and matter? Are not all bodies made of atoms?

These queries, framed as humble questions, contained some of physics' most prophetic intuitions. They would inspire researchers for the next two centuries.`,
      zh: `到1704年，牛顿已经等待了将近四十年。《光学》实际上早在1670年代就基本完成，但牛顿拒绝在罗伯特·胡克在世时出版——两人曾就他们各自的光学理论激烈交锋。

胡克于1703年去世。几个月后，《光学》出现在伦敦的书店里。

与用拉丁文写成的令人望而生畏的《原理》不同，牛顿选择用英文撰写《光学》，使工匠、仪器制造商和好奇的业余爱好者都能阅读。这本书以实验为核心，任何人都可以用棱镜、透镜和仔细观察来重现。

其核心是牛顿的微粒理论：他认为光由发光体发射的微小粒子组成。这解释了反射（粒子弹跳）和折射（粒子在界面加速）。它似乎战胜了惠更斯的波动理论。

但牛顿太诚实了，不会在没有确定性的地方假装确定。在书末著名的"疑问"中，他提出了31个关于自然最深奥秘密的问题：是什么导致了引力？光与物质有什么关系？所有物体不都是由原子组成的吗？

这些以谦虚问题形式提出的疑问，包含了物理学中一些最具预见性的直觉。它们将在接下来的两个世纪激励研究者们。`
    },
    scientistBio: {
      birthYear: 1643,
      deathYear: 1727,
      nationality: 'English',
      portraitEmoji: '📖',
      bioEn: 'Sir Isaac Newton was an English mathematician, physicist, and astronomer. Opticks became one of the most influential scientific books of the 18th century, shaping the understanding of light for over a century until the wave theory revival.',
      bioZh: '艾萨克·牛顿爵士是英国数学家、物理学家和天文学家。《光学》成为18世纪最有影响力的科学书籍之一，在波动理论复兴之前的一个多世纪里塑造了人们对光的理解。'
    },
    scene: {
      location: 'London, England',
      season: 'Spring',
      mood: 'triumph'
    },
    references: [
      { title: 'Newton, I. (1704). Opticks: or, A Treatise of the Reflexions, Refractions, Inflexions and Colours of Light' },
      { title: 'Shapiro, A. E. (1993). Fits, Passions, and Paroxysms: Physics, Method, and Chemistry and Newton\'s Theories of Colored Bodies' }
    ],
    thinkingQuestion: {
      en: 'Newton\'s corpuscular theory dominated for over a century. What might have happened if Huygens\' wave theory had been accepted earlier? How would that have changed the history of physics?',
      zh: '牛顿的微粒学说统治了一个多世纪。如果惠更斯的波动理论更早被接受，会发生什么？这会如何改变物理学的历史？'
    },
    illustrationType: 'prism'
  },
]
