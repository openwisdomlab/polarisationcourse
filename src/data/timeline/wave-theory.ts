/**
 * Timeline Events: Wave Theory Era (1801-1865)
 * 波动理论时代 (1801-1865)
 *
 * Young's double-slit to Maxwell's unification
 */

import type { TimelineEvent } from './types'

export const WAVE_THEORY_EVENTS: TimelineEvent[] = [
  {
    year: 1801,
    titleEn: 'Young\'s Double-Slit Experiment',
    titleZh: '杨氏双缝实验',
    descriptionEn: 'Thomas Young demonstrates light interference, providing strong evidence for the wave theory of light.',
    descriptionZh: '托马斯·杨演示了光的干涉现象，为光的波动理论提供了有力证据。',
    scientistEn: 'Thomas Young',
    scientistZh: '托马斯·杨',
    category: 'discovery',
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
  // ===== 偏振光轨道 (Polarization Track) =====,
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
          url: '/images/chromatic-polarization/玻璃对比-正交偏振系统-正视图.webp',
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
          url: '/images/chromatic-polarization/透明胶条（重叠阵列）-正交偏振系统-正视图.webp',
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
          url: '/images/chromatic-polarization/透明胶条（重叠阵列）-正交偏振系统-正视图.webp',
          caption: 'Transparent tape array showing chromatic interference under crossed polarizers',
          captionZh: '透明胶条阵列在正交偏振系统下展示的色偏振干涉图案'
        },
        {
          url: '/images/chromatic-polarization/钢化玻璃-正交偏振系统-正视图.webp',
          caption: 'Stress patterns in tempered glass revealed by crossed polarizers',
          captionZh: '正交偏振片揭示钢化玻璃中的应力图案'
        },
        {
          url: '/images/chromatic-polarization/保鲜膜重叠4次-正交偏振系统-正视图.webp',
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
          url: '/images/brewster/反射装置正视图.webp',
          caption: 'Brewster angle reflection apparatus - demonstrating complete polarization at specific angle',
          captionZh: '布儒斯特角反射装置——演示特定角度下的完全偏振'
        },
        {
          url: '/images/brewster/横向绿色光束暗点现象.webp',
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
          url: '/images/optical-rotation/关闭室内照明、开启白光光源并使光经过偏振片后的情形.webp',
          caption: 'Optical rotation experiment with white light through polarizer',
          captionZh: '白光通过偏振片的旋光实验'
        },
        {
          url: '/images/optical-rotation/关闭室内照明、开启绿色激光和红色激光并使光经过偏振片后的正视图.webp',
          caption: 'Optical rotation with green and red lasers - different wavelengths rotate by different amounts',
          captionZh: '绿色和红色激光的旋光——不同波长旋转量不同'
        },
        {
          url: '/images/chromatic-polarization/白砂糖袋子-正交偏振系统-正视图（横向）.webp',
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
          url: '/images/chromatic-polarization/透明胶-正交偏振系统-正视图.webp',
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
    category: 'discovery',
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
]
