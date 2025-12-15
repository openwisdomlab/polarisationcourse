/**
 * Chronicles Page - History of Light and Polarization
 * 光的编年史 - 双线叙事：广义光学 + 偏振光
 *
 * Interactive dual-timeline showcasing key discoveries:
 * - Left track: General optics history (核心光学发现)
 * - Right track: Polarization-specific history (偏振光专属旅程)
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Tabs, Badge, PersistentHeader } from '@/components/shared'
import {
  Clock, User, Lightbulb, BookOpen, X, MapPin, Calendar,
  FlaskConical, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Sun, Sparkles, HelpCircle
} from 'lucide-react'

// Timeline events data - 双轨历史数据
interface TimelineEvent {
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
  illustrationType?: 'prism' | 'double-slit' | 'calcite' | 'reflection' | 'polarizer' | 'lcd' | 'mantis' | 'wave' | 'birefringence' | 'nicol'
}

const TIMELINE_EVENTS: TimelineEvent[] = [
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
    }
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
    }
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
    year: 1815,
    titleEn: 'Fresnel\'s Wave Theory',
    titleZh: '菲涅尔的波动理论',
    descriptionEn: 'Augustin-Jean Fresnel develops a comprehensive wave theory explaining diffraction and polarization.',
    descriptionZh: '菲涅尔发展出完整的波动理论，解释了衍射和偏振现象。',
    scientistEn: 'Augustin-Jean Fresnel',
    scientistZh: '奥古斯丁-让·菲涅尔',
    category: 'theory',
    importance: 1,
    track: 'optics',
    details: {
      en: [
        'Proposed that light waves are transverse (perpendicular to propagation)',
        'Developed Fresnel equations for reflection and transmission',
        'Explained interference and diffraction mathematically',
        'Invented the Fresnel lens for lighthouses'
      ],
      zh: [
        '提出光波是横波（垂直于传播方向）',
        '推导出菲涅尔反射和透射方程',
        '用数学解释了干涉和衍射',
        '发明了用于灯塔的菲涅尔透镜'
      ]
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
        'Can represent partially polarized and unpolarized light',
        'Enables mathematical treatment of polarization measurement',
        'Foundation for modern polarimetry'
      ],
      zh: [
        '四个参数（S₀, S₁, S₂, S₃）完整描述任何偏振态',
        '可以表示部分偏振和非偏振光',
        '使偏振测量的数学处理成为可能',
        '现代偏振测量学的基础'
      ]
    },
    story: {
      en: `Cambridge, 1852. George Gabriel Stokes, the Lucasian Professor of Mathematics (Newton's former chair), faced a puzzle that had frustrated physicists for decades: how do you describe light that isn't perfectly polarized?

Real light — from the sun, from candles, from lamps — was messy. Some of it was polarized, some wasn't, some was somewhere in between. And polarization could be linear, circular, or elliptical. How could mathematics capture this complexity?

Stokes's genius was to step back from the physics and ask a simpler question: what can we actually measure? He realized that with just four measurements — using polarizers at different angles and a quarter-wave plate — you could completely characterize any beam of light.

He called them S₀, S₁, S₂, and S₃. Four numbers. Four simple measurements. Together, they could describe perfect polarization, partial polarization, complete chaos, or anything in between.

S₀ gave the total intensity. S₁ described horizontal versus vertical preference. S₂ captured diagonal tendencies. And S₃ revealed the handedness of circular polarization.

The beauty of Stokes's approach was its practicality. You didn't need to know the electromagnetic theory. You didn't need to track phases and amplitudes. You simply made measurements and plugged in numbers.

Today, "Stokes polarimetry" is used everywhere — from analyzing starlight to medical imaging, from studying insect vision to designing LCD screens. Stokes gave us a language to speak about polarization that works in the real world, where light is never perfectly behaved.`,
      zh: `1852年，剑桥。乔治·加布里埃尔·斯托克斯，卢卡斯数学教授（牛顿曾坐过的讲席），面对一个困扰物理学家数十年的难题：如何描述不完全偏振的光？

真实的光——来自太阳、蜡烛、灯火——总是杂乱无章的。有些是偏振的，有些不是，有些介于两者之间。而且偏振可以是线偏振、圆偏振或椭圆偏振。数学如何能捕捉这种复杂性？

斯托克斯的天才之处在于他退后一步，问了一个更简单的问题：我们实际上能测量什么？他意识到，只需四次测量——使用不同角度的偏振器和一个四分之一波片——就能完全表征任何光束。

他称它们为S₀、S₁、S₂和S₃。四个数字。四次简单的测量。它们可以描述完美偏振、部分偏振、完全混沌，或介于两者之间的任何状态。

S₀给出总强度。S₁描述水平与垂直的倾向。S₂捕捉对角线方向的特征。S₃揭示圆偏振的旋向。

斯托克斯方法的美妙之处在于它的实用性。你不需要了解电磁理论。你不需要追踪相位和振幅。你只需进行测量，代入数字即可。

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
    }
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
    }
  },
]

const CATEGORY_LABELS = {
  discovery: { en: 'Discovery', zh: '发现', color: 'blue' as const },
  theory: { en: 'Theory', zh: '理论', color: 'purple' as const },
  experiment: { en: 'Experiment', zh: '实验', color: 'green' as const },
  application: { en: 'Application', zh: '应用', color: 'orange' as const },
}

// SVG Illustrations for classic experiments - 经典实验配图
function ExperimentIllustration({ type, className = '' }: { type: string; className?: string }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const illustrations: Record<string, React.ReactElement> = {
    prism: (
      <svg viewBox="0 0 120 80" className={className}>
        {/* Prism */}
        <polygon
          points="60,10 100,70 20,70"
          fill={isDark ? '#1e293b' : '#f8fafc'}
          stroke={isDark ? '#64748b' : '#94a3b8'}
          strokeWidth="2"
        />
        {/* Incoming white light */}
        <line x1="0" y1="40" x2="45" y2="40" stroke="#fff" strokeWidth="3" />
        {/* Spectrum rays */}
        <line x1="75" y1="45" x2="120" y2="25" stroke="#ef4444" strokeWidth="2" />
        <line x1="75" y1="47" x2="120" y2="35" stroke="#f97316" strokeWidth="2" />
        <line x1="75" y1="49" x2="120" y2="45" stroke="#eab308" strokeWidth="2" />
        <line x1="75" y1="51" x2="120" y2="55" stroke="#22c55e" strokeWidth="2" />
        <line x1="75" y1="53" x2="120" y2="65" stroke="#3b82f6" strokeWidth="2" />
        <line x1="75" y1="55" x2="120" y2="75" stroke="#8b5cf6" strokeWidth="2" />
      </svg>
    ),
    'double-slit': (
      <svg viewBox="0 0 120 80" className={className}>
        {/* Light source */}
        <circle cx="10" cy="40" r="6" fill="#fbbf24" />
        {/* Barrier with slits */}
        <rect x="40" y="0" width="4" height="32" fill={isDark ? '#475569' : '#94a3b8'} />
        <rect x="40" y="38" width="4" height="4" fill={isDark ? '#0f172a' : '#f1f5f9'} />
        <rect x="40" y="48" width="4" height="32" fill={isDark ? '#475569' : '#94a3b8'} />
        {/* Waves from source */}
        <path d="M 16,40 Q 28,30 40,36" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.7" />
        <path d="M 16,40 Q 28,50 40,44" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.7" />
        {/* Interference pattern */}
        <rect x="100" y="0" width="15" height="80" fill={isDark ? '#1e293b' : '#f1f5f9'} />
        {[0, 16, 32, 48, 64].map((y, i) => (
          <rect key={i} x="100" y={y + 4} width="15" height="8" fill="#fbbf24" opacity={i % 2 === 0 ? 0.9 : 0.3} />
        ))}
        {/* Waves from slits */}
        <path d="M 44,36 Q 70,20 100,20" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
        <path d="M 44,36 Q 70,40 100,40" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
        <path d="M 44,44 Q 70,40 100,40" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
        <path d="M 44,44 Q 70,60 100,60" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    calcite: (
      <svg viewBox="0 0 120 80" className={className}>
        {/* Calcite crystal (rhombus) */}
        <polygon
          points="30,20 80,15 90,60 40,65"
          fill={isDark ? 'rgba(147, 197, 253, 0.2)' : 'rgba(147, 197, 253, 0.4)'}
          stroke={isDark ? '#60a5fa' : '#3b82f6'}
          strokeWidth="2"
        />
        {/* Incoming light */}
        <line x1="0" y1="40" x2="30" y2="40" stroke="#fff" strokeWidth="3" />
        {/* Double refraction - ordinary ray */}
        <line x1="50" y1="42" x2="120" y2="50" stroke="#22d3ee" strokeWidth="2.5" />
        <text x="105" y="62" fill={isDark ? '#22d3ee' : '#0891b2'} fontSize="8">o-ray</text>
        {/* Extraordinary ray */}
        <line x1="50" y1="38" x2="120" y2="25" stroke="#fbbf24" strokeWidth="2.5" />
        <text x="105" y="20" fill={isDark ? '#fbbf24' : '#d97706'} fontSize="8">e-ray</text>
        {/* Double image dots */}
        <circle cx="15" cy="40" r="3" fill="#fff" />
      </svg>
    ),
    reflection: (
      <svg viewBox="0 0 120 80" className={className}>
        {/* Glass surface */}
        <rect x="0" y="50" width="120" height="30" fill={isDark ? 'rgba(147, 197, 253, 0.2)' : 'rgba(147, 197, 253, 0.3)'} />
        <line x1="0" y1="50" x2="120" y2="50" stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="2" />
        {/* Incident ray */}
        <line x1="20" y1="10" x2="60" y2="50" stroke="#fff" strokeWidth="2" />
        <polygon points="58,46 62,50 54,50" fill="#fff" />
        {/* Reflected ray (polarized) */}
        <line x1="60" y1="50" x2="100" y2="10" stroke="#22d3ee" strokeWidth="2.5" />
        {/* Polarization indicator */}
        <ellipse cx="85" cy="25" rx="8" ry="2" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
        {/* Angle arc */}
        <path d="M 60,35 A 15,15 0 0,1 75,50" fill="none" stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="1" />
        <text x="72" y="42" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="7">θB</text>
      </svg>
    ),
    polarizer: (
      <svg viewBox="0 0 120 80" className={className}>
        {/* Unpolarized light waves */}
        <g transform="translate(5, 40)">
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#fbbf24" strokeWidth="2" />
          <line x1="-7" y1="-7" x2="7" y2="7" stroke="#fbbf24" strokeWidth="2" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#fbbf24" strokeWidth="2" />
          <line x1="-7" y1="7" x2="7" y2="-7" stroke="#fbbf24" strokeWidth="2" />
        </g>
        {/* Arrow */}
        <line x1="20" y1="40" x2="40" y2="40" stroke="#fbbf24" strokeWidth="2" />
        {/* Polarizer 1 */}
        <rect x="45" y="15" width="8" height="50" fill={isDark ? 'rgba(34, 211, 238, 0.3)' : 'rgba(34, 211, 238, 0.4)'} stroke="#22d3ee" strokeWidth="1.5" />
        <line x1="49" y1="18" x2="49" y2="62" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3,2" />
        {/* Polarized light */}
        <line x1="53" y1="40" x2="65" y2="40" stroke="#22d3ee" strokeWidth="2" />
        <g transform="translate(70, 40)">
          <line x1="0" y1="-8" x2="0" y2="8" stroke="#22d3ee" strokeWidth="2" />
        </g>
        {/* Arrow */}
        <line x1="75" y1="40" x2="85" y2="40" stroke="#22d3ee" strokeWidth="2" />
        {/* Polarizer 2 (crossed) */}
        <rect x="90" y="15" width="8" height="50" fill={isDark ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.4)'} stroke="#fbbf24" strokeWidth="1.5" />
        <line x1="91" y1="40" x2="97" y2="40" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3,2" />
        {/* No light */}
        <line x1="98" y1="40" x2="115" y2="40" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="1" strokeDasharray="2,2" />
        <text x="105" y="55" fill={isDark ? '#ef4444' : '#dc2626'} fontSize="8">×</text>
      </svg>
    ),
    wave: (
      <svg viewBox="0 0 120 80" className={className}>
        {/* E field wave */}
        <path
          d="M 0,40 Q 15,10 30,40 Q 45,70 60,40 Q 75,10 90,40 Q 105,70 120,40"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2.5"
        />
        {/* B field wave (perpendicular) */}
        <path
          d="M 0,40 Q 15,55 30,40 Q 45,25 60,40 Q 75,55 90,40 Q 105,25 120,40"
          fill="none"
          stroke="#f472b6"
          strokeWidth="2"
          opacity="0.7"
        />
        {/* Labels */}
        <text x="5" y="15" fill="#22d3ee" fontSize="9" fontWeight="bold">E</text>
        <text x="5" y="65" fill="#f472b6" fontSize="9" fontWeight="bold">B</text>
        {/* Propagation arrow */}
        <line x1="50" y1="75" x2="70" y2="75" stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="1.5" />
        <polygon points="70,75 65,72 65,78" fill={isDark ? '#94a3b8' : '#64748b'} />
        <text x="55" y="72" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="6">k</text>
      </svg>
    ),
    lcd: (
      <svg viewBox="0 0 120 80" className={className}>
        {/* Backlight */}
        <rect x="0" y="25" width="15" height="30" fill="#fbbf24" opacity="0.8" />
        {/* Polarizer 1 */}
        <rect x="20" y="20" width="5" height="40" fill={isDark ? 'rgba(34, 211, 238, 0.4)' : 'rgba(34, 211, 238, 0.5)'} stroke="#22d3ee" />
        {/* LC layer */}
        <rect x="30" y="15" width="30" height="50" fill={isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.3)'} stroke="#8b5cf6" />
        {/* Twisted molecules */}
        <path d="M 35,25 Q 45,30 55,25" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
        <path d="M 35,40 Q 45,35 55,40" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
        <path d="M 35,55 Q 45,50 55,55" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
        {/* Polarizer 2 */}
        <rect x="65" y="20" width="5" height="40" fill={isDark ? 'rgba(34, 211, 238, 0.4)' : 'rgba(34, 211, 238, 0.5)'} stroke="#22d3ee" />
        {/* Display pixel */}
        <rect x="80" y="25" width="35" height="30" fill={isDark ? '#0f172a' : '#1e293b'} stroke={isDark ? '#475569' : '#64748b'} />
        <rect x="85" y="30" width="10" height="20" fill="#22c55e" />
        <rect x="100" y="30" width="10" height="20" fill="#3b82f6" />
      </svg>
    ),
    nicol: (
      <svg viewBox="0 0 120 80" className={className}>
        {/* Nicol prism shape */}
        <polygon
          points="20,20 70,15 100,40 70,65 20,60"
          fill={isDark ? 'rgba(147, 197, 253, 0.15)' : 'rgba(147, 197, 253, 0.25)'}
          stroke={isDark ? '#60a5fa' : '#3b82f6'}
          strokeWidth="2"
        />
        {/* Diagonal cut */}
        <line x1="45" y1="17" x2="45" y2="63" stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="1" strokeDasharray="3,2" />
        {/* Incoming light */}
        <line x1="0" y1="40" x2="20" y2="40" stroke="#fff" strokeWidth="2.5" />
        {/* Ordinary ray (reflected/absorbed) */}
        <line x1="45" y1="40" x2="70" y2="65" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="1.5" strokeDasharray="2,2" />
        <text x="60" y="75" fill={isDark ? '#64748b' : '#94a3b8'} fontSize="7">absorbed</text>
        {/* Extraordinary ray (transmitted) */}
        <line x1="45" y1="40" x2="120" y2="40" stroke="#22d3ee" strokeWidth="2.5" />
        <text x="100" y="35" fill="#22d3ee" fontSize="7">e-ray</text>
      </svg>
    ),
    mantis: (
      <svg viewBox="0 0 120 80" className={className}>
        {/* Mantis shrimp eye (simplified) */}
        <ellipse cx="30" cy="40" rx="20" ry="25" fill={isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.4)'} stroke="#22c55e" strokeWidth="2" />
        {/* Eye bands */}
        <line x1="10" y1="35" x2="50" y2="35" stroke="#22c55e" strokeWidth="3" />
        <line x1="10" y1="45" x2="50" y2="45" stroke="#22c55e" strokeWidth="3" />
        {/* Incoming light types */}
        <g transform="translate(70, 20)">
          <circle cx="0" cy="0" r="4" fill="#22d3ee" />
          <path d="M -8,0 A 8,8 0 1,1 8,0" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
          <text x="12" y="4" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="7">linear</text>
        </g>
        <g transform="translate(70, 40)">
          <circle cx="0" cy="0" r="4" fill="#f472b6" />
          <ellipse cx="0" cy="0" rx="8" ry="4" fill="none" stroke="#f472b6" strokeWidth="1.5" />
          <text x="12" y="4" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="7">circular</text>
        </g>
        <g transform="translate(70, 60)">
          <circle cx="0" cy="0" r="4" fill="#fbbf24" />
          <ellipse cx="0" cy="0" rx="8" ry="6" fill="none" stroke="#fbbf24" strokeWidth="1.5" transform="rotate(30)" />
          <text x="12" y="4" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="7">elliptical</text>
        </g>
        {/* Arrows to eye */}
        <line x1="55" y1="20" x2="48" y2="35" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="1" />
        <line x1="55" y1="40" x2="50" y2="40" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="1" />
        <line x1="55" y1="60" x2="48" y2="45" stroke={isDark ? '#475569' : '#94a3b8'} strokeWidth="1" />
      </svg>
    ),
    birefringence: (
      <svg viewBox="0 0 120 80" className={className}>
        {/* Crystal structure */}
        <rect x="40" y="10" width="40" height="60" fill={isDark ? 'rgba(147, 197, 253, 0.15)' : 'rgba(147, 197, 253, 0.25)'} stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="2" />
        {/* Optic axis indicator */}
        <line x1="60" y1="5" x2="60" y2="75" stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="1" strokeDasharray="3,2" />
        <text x="62" y="10" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="6">optic axis</text>
        {/* Incoming light */}
        <line x1="5" y1="40" x2="40" y2="40" stroke="#fff" strokeWidth="2.5" />
        {/* O-ray (follows optic axis) */}
        <line x1="80" y1="40" x2="115" y2="40" stroke="#22d3ee" strokeWidth="2" />
        {/* E-ray (deflected) */}
        <line x1="80" y1="40" x2="115" y2="25" stroke="#fbbf24" strokeWidth="2" />
        {/* Inside crystal paths */}
        <line x1="40" y1="40" x2="80" y2="40" stroke="#22d3ee" strokeWidth="1.5" opacity="0.6" />
        <line x1="40" y1="40" x2="80" y2="35" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
        {/* Labels */}
        <text x="100" y="50" fill="#22d3ee" fontSize="7">o</text>
        <text x="108" y="23" fill="#fbbf24" fontSize="7">e</text>
      </svg>
    ),
  }

  return illustrations[type] || null
}

// Story Modal Component - 沉浸式故事阅读模式
interface StoryModalProps {
  event: TimelineEvent
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
  hasNext: boolean
  hasPrev: boolean
}

function StoryModal({ event, onClose, onNext, onPrev, hasNext, hasPrev }: StoryModalProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const category = CATEGORY_LABELS[event.category]

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight' && hasNext && onNext) onNext()
    if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0',
          theme === 'dark' ? 'bg-black/90' : 'bg-black/80'
        )}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={cn(
        'relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl',
        theme === 'dark'
          ? 'bg-slate-900 border-slate-700'
          : 'bg-white border-gray-200'
      )}>
        {/* Header with scene info */}
        <div className={cn(
          'sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-md',
          theme === 'dark'
            ? 'bg-slate-900/90 border-slate-700'
            : 'bg-white/90 border-gray-200'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold font-mono text-amber-500">
                {event.year}
              </span>
              <Badge color={category.color}>
                {isZh ? category.zh : category.en}
              </Badge>
              {event.importance === 1 && (
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              )}
            </div>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-full transition-colors',
                theme === 'dark'
                  ? 'hover:bg-slate-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scene metadata */}
          {event.scene && (
            <div className={cn(
              'flex items-center gap-4 mt-2 text-xs',
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            )}>
              {event.scene.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.scene.location}
                </span>
              )}
              {event.scene.season && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {event.scene.season}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Story Content */}
        <div className="px-6 py-6">
          <h2 className={cn(
            'text-2xl font-bold mb-2',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? event.titleZh : event.titleEn}
          </h2>

          {event.scientistEn && (
            <p className={cn(
              'text-base mb-6 flex items-center gap-2',
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )}>
              {event.scientistBio?.portraitEmoji && (
                <span className="text-2xl">{event.scientistBio.portraitEmoji}</span>
              )}
              <User className="w-4 h-4" />
              {isZh ? event.scientistZh : event.scientistEn}
              {event.scientistBio?.birthYear && event.scientistBio?.deathYear && (
                <span className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  ({event.scientistBio.birthYear} - {event.scientistBio.deathYear})
                </span>
              )}
            </p>
          )}

          {/* The Story */}
          {event.story && (
            <div className={cn(
              'prose prose-lg max-w-none mb-8',
              theme === 'dark' ? 'prose-invert' : ''
            )}>
              <div className={cn(
                'text-base leading-relaxed whitespace-pre-line font-serif',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                {isZh ? event.story.zh : event.story.en}
              </div>
            </div>
          )}

          {/* Scientist Bio Card */}
          {event.scientistBio?.bioEn && (
            <div className={cn(
              'rounded-xl p-4 mb-6 border',
              theme === 'dark'
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-amber-50 border-amber-200'
            )}>
              <h4 className={cn(
                'text-sm font-semibold mb-2 flex items-center gap-2',
                theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
              )}>
                <User className="w-4 h-4" />
                {isZh ? '科学家简介' : 'About the Scientist'}
              </h4>
              <p className={cn(
                'text-sm',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {isZh ? event.scientistBio.bioZh : event.scientistBio.bioEn}
              </p>
              {event.scientistBio.nationality && (
                <p className={cn(
                  'text-xs mt-2',
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                )}>
                  {isZh ? '国籍' : 'Nationality'}: {event.scientistBio.nationality}
                </p>
              )}
            </div>
          )}

          {/* Key Facts */}
          {event.details && (
            <div className={cn(
              'rounded-xl p-4 border',
              theme === 'dark'
                ? 'bg-cyan-900/20 border-cyan-800/50'
                : 'bg-cyan-50 border-cyan-200'
            )}>
              <h4 className={cn(
                'text-sm font-semibold mb-3 flex items-center gap-2',
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
              )}>
                <Lightbulb className="w-4 h-4" />
                {isZh ? '关键事实' : 'Key Facts'}
              </h4>
              <ul className={cn(
                'text-sm space-y-2',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                {(isZh ? event.details.zh : event.details.en).map((detail, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-500 mt-1">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className={cn(
          'sticky bottom-0 px-6 py-4 border-t backdrop-blur-md flex items-center justify-between',
          theme === 'dark'
            ? 'bg-slate-900/90 border-slate-700'
            : 'bg-white/90 border-gray-200'
        )}>
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              hasPrev
                ? theme === 'dark'
                  ? 'text-gray-300 hover:bg-slate-700'
                  : 'text-gray-700 hover:bg-gray-100'
                : 'opacity-30 cursor-not-allowed text-gray-500'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            {isZh ? '上一个' : 'Previous'}
          </button>

          <span className={cn(
            'text-sm',
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )}>
            {isZh ? '按 ← → 键导航 · ESC 关闭' : 'Press ← → to navigate · ESC to close'}
          </span>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              hasNext
                ? theme === 'dark'
                  ? 'text-gray-300 hover:bg-slate-700'
                  : 'text-gray-700 hover:bg-gray-100'
                : 'opacity-30 cursor-not-allowed text-gray-500'
            )}
          >
            {isZh ? '下一个' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Dual Track Card Component - 双轨卡片组件
interface DualTrackCardProps {
  event: TimelineEvent
  isExpanded: boolean
  onToggle: () => void
  onReadStory: () => void
  side: 'left' | 'right'
}

function DualTrackCard({ event, isExpanded, onToggle, onReadStory, side: _side }: DualTrackCardProps) {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const category = CATEGORY_LABELS[event.category]

  const isOpticsTrack = event.track === 'optics'
  const trackColor = isOpticsTrack
    ? { bg: theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50', border: theme === 'dark' ? 'border-amber-500/30' : 'border-amber-200', hoverBorder: theme === 'dark' ? 'hover:border-amber-500/50' : 'hover:border-amber-400' }
    : { bg: theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50', border: theme === 'dark' ? 'border-cyan-500/30' : 'border-cyan-200', hoverBorder: theme === 'dark' ? 'hover:border-cyan-500/50' : 'hover:border-cyan-400' }

  return (
    <div
      className={cn(
        'rounded-xl border p-3 sm:p-4 transition-all cursor-pointer',
        trackColor.bg,
        trackColor.border,
        trackColor.hoverBorder,
        theme === 'dark' ? 'hover:shadow-lg hover:shadow-black/20' : 'hover:shadow-md'
      )}
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <Badge color={category.color} className="text-xs">
              {isZh ? category.zh : category.en}
            </Badge>
            {event.importance === 1 && (
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            )}
          </div>

          {/* Title */}
          <h3 className={cn(
            'font-semibold text-sm sm:text-base mb-1 line-clamp-2',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? event.titleZh : event.titleEn}
          </h3>

          {/* Scientist */}
          {event.scientistEn && (
            <p className={cn(
              'text-xs sm:text-sm mb-1 flex items-center gap-1',
              isOpticsTrack
                ? theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                : theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            )}>
              {event.scientistBio?.portraitEmoji && (
                <span className="text-sm">{event.scientistBio.portraitEmoji}</span>
              )}
              {isZh ? event.scientistZh : event.scientistEn}
            </p>
          )}

          {/* Description (collapsed) */}
          {!isExpanded && (
            <p className={cn(
              'text-xs line-clamp-2',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isZh ? event.descriptionZh : event.descriptionEn}
            </p>
          )}
        </div>

        {/* Expand icon */}
        <div className={cn(
          'flex-shrink-0 p-1 rounded-full transition-colors',
          theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-200'
        )}>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={cn(
          'mt-3 pt-3 border-t',
          theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
          {/* Full description */}
          <p className={cn(
            'text-sm mb-3',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          )}>
            {isZh ? event.descriptionZh : event.descriptionEn}
          </p>

          {/* Illustration */}
          {event.illustrationType && (
            <div className={cn(
              'mb-3 p-2 rounded-lg flex items-center justify-center',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'
            )}>
              <ExperimentIllustration type={event.illustrationType} className="w-full max-w-[180px] h-auto" />
            </div>
          )}

          {/* Details */}
          {event.details && (
            <div className="mb-3">
              <h4 className={cn(
                'text-xs font-semibold mb-1.5 flex items-center gap-1',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                <Lightbulb className="w-3.5 h-3.5" />
                {isZh ? '深入了解' : 'Learn More'}
              </h4>
              <ul className={cn(
                'text-xs space-y-1 list-disc list-inside',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {(isZh ? event.details.zh : event.details.en).slice(0, 3).map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Thinking Question */}
          {event.thinkingQuestion && (
            <div className={cn(
              'mb-3 p-2 rounded-lg border-l-3',
              theme === 'dark'
                ? 'bg-purple-500/10 border-purple-500 text-purple-300'
                : 'bg-purple-50 border-purple-500 text-purple-700'
            )}>
              <h4 className="text-xs font-semibold mb-1 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                {isZh ? '思考问题' : 'Think About It'}
              </h4>
              <p className="text-xs italic">
                {isZh ? event.thinkingQuestion.zh : event.thinkingQuestion.en}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {event.story && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onReadStory()
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  isOpticsTrack
                    ? theme === 'dark'
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : theme === 'dark'
                      ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                      : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                {isZh ? '阅读故事' : 'Read Story'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Tabs configuration
const TABS = [
  { id: 'timeline', label: 'Timeline', labelZh: '时间线', icon: <Clock className="w-4 h-4" /> },
  { id: 'scientists', label: 'Scientists', labelZh: '科学家', icon: <User className="w-4 h-4" /> },
  { id: 'experiments', label: 'Key Experiments', labelZh: '关键实验', icon: <FlaskConical className="w-4 h-4" /> },
]

export function ChroniclesPage() {
  const { theme } = useTheme()
  const { i18n } = useTranslation()
  const isZh = i18n.language === 'zh'
  const [activeTab, setActiveTab] = useState('timeline')
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>('')
  const [trackFilter, setTrackFilter] = useState<'all' | 'optics' | 'polarization'>('all')
  const [storyModalEvent, setStoryModalEvent] = useState<number | null>(null)

  // Filter events by category and track
  const filteredEvents = TIMELINE_EVENTS.filter(e => {
    const categoryMatch = !filter || e.category === filter
    const trackMatch = trackFilter === 'all' || e.track === trackFilter
    return categoryMatch && trackMatch
  }).sort((a, b) => a.year - b.year)

  // Get unique scientists from events
  const scientists = TIMELINE_EVENTS.filter(e => e.scientistBio?.bioEn).reduce((acc, event) => {
    const key = event.scientistEn || ''
    if (key && !acc.find(s => s.scientistEn === key)) {
      acc.push(event)
    }
    return acc
  }, [] as TimelineEvent[])

  // Story modal navigation
  const handleOpenStory = (index: number) => {
    setStoryModalEvent(index)
  }

  const handleCloseStory = () => {
    setStoryModalEvent(null)
  }

  const handleNextStory = () => {
    if (storyModalEvent !== null && storyModalEvent < filteredEvents.length - 1) {
      setStoryModalEvent(storyModalEvent + 1)
    }
  }

  const handlePrevStory = () => {
    if (storyModalEvent !== null && storyModalEvent > 0) {
      setStoryModalEvent(storyModalEvent - 1)
    }
  }

  return (
    <div className={cn(
      'min-h-screen',
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a2a]'
        : 'bg-gradient-to-br from-[#fffbeb] via-[#fef3c7] to-[#fffbeb]'
    )}>
      {/* Header with Persistent Logo */}
      <PersistentHeader
        moduleKey="chronicles"
        moduleName={isZh ? '光的编年史' : 'Chronicles of Light'}
        variant="glass"
        className={cn(
          'sticky top-0 z-40',
          theme === 'dark'
            ? 'bg-slate-900/80 border-b border-slate-700'
            : 'bg-white/80 border-b border-gray-200'
        )}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero section */}
        <div className="text-center mb-8">
          <h2 className={cn(
            'text-2xl sm:text-3xl font-bold mb-3',
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {isZh ? '双线叙事：光学与偏振' : 'Dual Narrative: Optics & Polarization'}
          </h2>
          <p className={cn(
            'text-base max-w-3xl mx-auto mb-4',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {isZh
              ? '从17世纪的偶然发现到现代应用，探索三个多世纪的光学奥秘。左侧追溯广义光学史上的核心发现，右侧聚焦偏振光的专属旅程。'
              : 'From 17th-century discoveries to modern applications — explore over three centuries of optical mysteries. Left track traces core optics history, right track follows the polarization journey.'}
          </p>
          {/* Dual track legend */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Sun className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
              <span className={theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}>
                {isZh ? '广义光学' : 'General Optics'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
              <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}>
                {isZh ? '偏振光' : 'Polarization'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        {activeTab === 'timeline' && (
          <>
            {/* Track filters */}
            <div className={cn(
              'flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
            )}>
              <span className={cn('text-sm font-medium mr-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '轨道：' : 'Track:'}
              </span>
              <button
                onClick={() => setTrackFilter('all')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                  trackFilter === 'all'
                    ? 'bg-gray-600 text-white'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                )}
              >
                {isZh ? '全部' : 'All'}
              </button>
              <button
                onClick={() => setTrackFilter('optics')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                  trackFilter === 'optics'
                    ? 'bg-amber-500 text-white'
                    : theme === 'dark'
                      ? 'text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/20'
                      : 'text-amber-600 hover:text-amber-700 hover:bg-amber-100'
                )}
              >
                <Sun className="w-3.5 h-3.5" />
                {isZh ? '广义光学' : 'Optics'}
              </button>
              <button
                onClick={() => setTrackFilter('polarization')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5',
                  trackFilter === 'polarization'
                    ? 'bg-cyan-500 text-white'
                    : theme === 'dark'
                      ? 'text-cyan-400/70 hover:text-cyan-400 hover:bg-cyan-500/20'
                      : 'text-cyan-600 hover:text-cyan-700 hover:bg-cyan-100'
                )}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isZh ? '偏振光' : 'Polarization'}
              </button>
            </div>

            {/* Category filters */}
            <div className={cn(
              'flex flex-wrap items-center gap-2 mb-6 p-3 rounded-lg',
              theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'
            )}>
              <span className={cn('text-sm font-medium mr-2', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {isZh ? '类型：' : 'Type:'}
              </span>
              <button
                onClick={() => setFilter('')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  !filter
                    ? 'bg-gray-600 text-white'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                )}
              >
                {isZh ? '全部' : 'All'}
              </button>
              {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    filter === key
                      ? 'bg-gray-600 text-white'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-slate-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  )}
                >
                  {isZh ? val.zh : val.en}
                </button>
              ))}
            </div>

            {/* Dual Track Timeline - 双轨时间线 */}
            <div className="relative">
              {/* Track Labels - 轨道标签 */}
              <div className="flex items-center justify-between mb-6">
                <div className={cn(
                  'flex-1 text-center py-2 rounded-l-lg border-r',
                  theme === 'dark'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-amber-50 border-amber-200'
                )}>
                  <div className="flex items-center justify-center gap-2">
                    <Sun className={cn('w-5 h-5', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')} />
                    <span className={cn('font-semibold', theme === 'dark' ? 'text-amber-400' : 'text-amber-700')}>
                      {isZh ? '广义光学' : 'General Optics'}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  'w-20 text-center py-2',
                  theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
                )}>
                  <span className={cn('text-sm font-mono', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                    {isZh ? '年份' : 'Year'}
                  </span>
                </div>
                <div className={cn(
                  'flex-1 text-center py-2 rounded-r-lg border-l',
                  theme === 'dark'
                    ? 'bg-cyan-500/10 border-cyan-500/30'
                    : 'bg-cyan-50 border-cyan-200'
                )}>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className={cn('w-5 h-5', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600')} />
                    <span className={cn('font-semibold', theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700')}>
                      {isZh ? '偏振光' : 'Polarization'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline with center axis */}
              <div className="relative">
                {/* Center vertical line */}
                <div className={cn(
                  'absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2',
                  theme === 'dark' ? 'bg-gradient-to-b from-amber-500/50 via-gray-500/50 to-cyan-500/50' : 'bg-gradient-to-b from-amber-300 via-gray-300 to-cyan-300'
                )} />

                {/* Events */}
                {(() => {
                  // Get all unique years from filtered events
                  const years = [...new Set(filteredEvents.map(e => e.year))].sort((a, b) => a - b)

                  return years.map((year) => {
                    const opticsEvent = filteredEvents.find(e => e.year === year && e.track === 'optics')
                    const polarizationEvent = filteredEvents.find(e => e.year === year && e.track === 'polarization')
                    const opticsIndex = opticsEvent ? filteredEvents.findIndex(e => e === opticsEvent) : -1
                    const polarizationIndex = polarizationEvent ? filteredEvents.findIndex(e => e === polarizationEvent) : -1

                    return (
                      <div key={year} className="relative flex items-stretch mb-6 last:mb-0">
                        {/* Left side - Optics */}
                        <div className="flex-1 pr-4 flex justify-end">
                          {opticsEvent && (
                            <div className="w-full max-w-md">
                              <DualTrackCard
                                event={opticsEvent}
                                isExpanded={expandedEvent === opticsIndex}
                                onToggle={() => setExpandedEvent(expandedEvent === opticsIndex ? null : opticsIndex)}
                                onReadStory={() => handleOpenStory(opticsIndex)}
                                side="left"
                              />
                            </div>
                          )}
                        </div>

                        {/* Center year marker */}
                        <div className="w-20 flex flex-col items-center justify-start relative z-10 flex-shrink-0">
                          <div className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-sm border-2',
                            opticsEvent && polarizationEvent
                              ? theme === 'dark'
                                ? 'bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border-gray-500 text-white'
                                : 'bg-gradient-to-br from-amber-100 to-cyan-100 border-gray-400 text-gray-800'
                              : opticsEvent
                                ? theme === 'dark'
                                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                  : 'bg-amber-100 border-amber-500 text-amber-700'
                                : theme === 'dark'
                                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                  : 'bg-cyan-100 border-cyan-500 text-cyan-700'
                          )}>
                            {year}
                          </div>
                          {/* Connector lines */}
                          {opticsEvent && (
                            <div className={cn(
                              'absolute top-6 right-full w-4 h-0.5 mr-0',
                              theme === 'dark' ? 'bg-amber-500/50' : 'bg-amber-400'
                            )} />
                          )}
                          {polarizationEvent && (
                            <div className={cn(
                              'absolute top-6 left-full w-4 h-0.5 ml-0',
                              theme === 'dark' ? 'bg-cyan-500/50' : 'bg-cyan-400'
                            )} />
                          )}
                        </div>

                        {/* Right side - Polarization */}
                        <div className="flex-1 pl-4 flex justify-start">
                          {polarizationEvent && (
                            <div className="w-full max-w-md">
                              <DualTrackCard
                                event={polarizationEvent}
                                isExpanded={expandedEvent === polarizationIndex}
                                onToggle={() => setExpandedEvent(expandedEvent === polarizationIndex ? null : polarizationIndex)}
                                onReadStory={() => handleOpenStory(polarizationIndex)}
                                side="right"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
          </>
        )}

        {activeTab === 'scientists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scientists.map((event) => (
              <div
                key={event.scientistEn}
                className={cn(
                  'rounded-xl border p-5 transition-all hover:shadow-lg',
                  theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50'
                    : 'bg-white border-gray-200 hover:border-amber-400'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Portrait Emoji */}
                  <div className={cn(
                    'flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-3xl',
                    theme === 'dark' ? 'bg-slate-700' : 'bg-amber-100'
                  )}>
                    {event.scientistBio?.portraitEmoji || '👤'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      'font-bold text-lg mb-1',
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      {isZh ? event.scientistZh : event.scientistEn}
                    </h3>

                    {/* Lifespan & Nationality */}
                    <div className={cn(
                      'flex flex-wrap items-center gap-2 mb-2 text-xs',
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    )}>
                      {event.scientistBio?.birthYear && event.scientistBio?.deathYear && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.scientistBio.birthYear} - {event.scientistBio.deathYear}
                        </span>
                      )}
                      {event.scientistBio?.nationality && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.scientistBio.nationality}
                        </span>
                      )}
                    </div>

                    {/* Key Discovery */}
                    <Badge color={CATEGORY_LABELS[event.category].color} className="mb-2">
                      {event.year}: {isZh ? event.titleZh : event.titleEn}
                    </Badge>

                    {/* Bio */}
                    <p className={cn(
                      'text-sm line-clamp-3',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {isZh ? event.scientistBio?.bioZh : event.scientistBio?.bioEn}
                    </p>

                    {/* Read Story Link */}
                    {event.story && (
                      <button
                        onClick={() => {
                          const idx = TIMELINE_EVENTS.findIndex(e => e.scientistEn === event.scientistEn)
                          if (idx >= 0) handleOpenStory(idx)
                        }}
                        className={cn(
                          'mt-3 flex items-center gap-1 text-sm font-medium transition-colors',
                          theme === 'dark'
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-amber-600 hover:text-amber-700'
                        )}
                      >
                        <BookOpen className="w-4 h-4" />
                        {isZh ? '阅读故事' : 'Read Story'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'experiments' && (
          <div className="space-y-4">
            {/* Intro */}
            <div className={cn(
              'rounded-xl border p-6 mb-6',
              theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-amber-50 border-amber-200'
            )}>
              <div className="flex items-start gap-4">
                <FlaskConical className={cn(
                  'w-10 h-10 flex-shrink-0',
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                )} />
                <div>
                  <h3 className={cn(
                    'text-lg font-semibold mb-2',
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}>
                    {isZh ? '历史性实验' : 'Historic Experiments'}
                  </h3>
                  <p className={cn(
                    'text-sm',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {isZh
                      ? '这些实验改变了我们对光的理解。点击每个实验了解其原理和历史意义。'
                      : 'These experiments transformed our understanding of light. Click each experiment to learn about its principles and historical significance.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Experiment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TIMELINE_EVENTS.filter(e => e.category === 'experiment' || e.category === 'discovery').map((event) => (
                <div
                  key={event.year}
                  className={cn(
                    'rounded-xl border p-5 transition-all cursor-pointer hover:shadow-lg',
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50'
                      : 'bg-white border-gray-200 hover:border-cyan-400'
                  )}
                  onClick={() => {
                    const idx = TIMELINE_EVENTS.findIndex(e => e.year === event.year)
                    if (idx >= 0) handleOpenStory(idx)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
                      theme === 'dark' ? 'bg-cyan-900/30' : 'bg-cyan-100'
                    )}>
                      <span className="text-2xl font-bold font-mono text-cyan-500">
                        {event.year.toString().slice(-2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge color={CATEGORY_LABELS[event.category].color}>
                          {isZh ? CATEGORY_LABELS[event.category].zh : CATEGORY_LABELS[event.category].en}
                        </Badge>
                        <span className={cn(
                          'text-xs font-mono',
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        )}>
                          {event.year}
                        </span>
                      </div>
                      <h4 className={cn(
                        'font-semibold mb-1',
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {isZh ? event.titleZh : event.titleEn}
                      </h4>
                      {event.scientistEn && (
                        <p className={cn(
                          'text-xs mb-2',
                          theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                        )}>
                          {event.scientistBio?.portraitEmoji} {isZh ? event.scientistZh : event.scientistEn}
                        </p>
                      )}
                      <p className={cn(
                        'text-sm line-clamp-2',
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {isZh ? event.descriptionZh : event.descriptionEn}
                      </p>
                      {event.scene?.location && (
                        <p className={cn(
                          'text-xs mt-2 flex items-center gap-1',
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        )}>
                          <MapPin className="w-3 h-3" />
                          {event.scene.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Story Modal */}
      {storyModalEvent !== null && filteredEvents[storyModalEvent] && (
        <StoryModal
          event={filteredEvents[storyModalEvent]}
          onClose={handleCloseStory}
          onNext={handleNextStory}
          onPrev={handlePrevStory}
          hasNext={storyModalEvent < filteredEvents.length - 1}
          hasPrev={storyModalEvent > 0}
        />
      )}
    </div>
  )
}
