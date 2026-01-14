/**
 * Timeline Events: Modern Era (1951-2000)
 * 现代时代 (1951-2000)
 *
 * Lasers, optical communications, and polarimetry advances
 */

import type { TimelineEvent } from './types'

export const MODERN_EVENTS: TimelineEvent[] = [
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
    category: 'discovery',
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
    category: 'discovery',
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
]
