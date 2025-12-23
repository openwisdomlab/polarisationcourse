/**
 * Scientist Network Data
 * 科学家关系网络数据
 */

// 科学家节点
export interface Scientist {
  id: string
  nameEn: string
  nameZh: string
  birthYear: number
  deathYear?: number
  nationality: string
  emoji: string
  // 主要贡献领域
  fields: ('optics' | 'polarization' | 'wave' | 'quantum')[]
  // 关键贡献
  keyContributions: {
    en: string[]
    zh: string[]
  }
  // 关联的时间线事件年份
  eventYears: number[]
}

// 关系类型
export type RelationType =
  | 'teacher-student'   // 师承
  | 'collaborator'      // 合作
  | 'rival'             // 竞争/对立
  | 'influenced'        // 影响
  | 'built-upon'        // 发展/继承
  | 'refuted'           // 反驳
  | 'contemporary'      // 同时代人

// 科学家关系
export interface ScientistRelation {
  from: string
  to: string
  type: RelationType
  descriptionEn: string
  descriptionZh: string
  year?: number // 关系发生的年份
}

// 科学家数据
export const SCIENTISTS: Scientist[] = [
  {
    id: 'newton',
    nameEn: 'Isaac Newton',
    nameZh: '艾萨克·牛顿',
    birthYear: 1643,
    deathYear: 1727,
    nationality: 'English',
    emoji: '🍎',
    fields: ['optics'],
    keyContributions: {
      en: ['Prism experiment (1665)', 'Corpuscular theory of light', 'Opticks (1704)'],
      zh: ['三棱镜实验 (1665)', '光的微粒说', '《光学》(1704)']
    },
    eventYears: [1665, 1704]
  },
  {
    id: 'huygens',
    nameEn: 'Christiaan Huygens',
    nameZh: '克里斯蒂安·惠更斯',
    birthYear: 1629,
    deathYear: 1695,
    nationality: 'Dutch',
    emoji: '🌊',
    fields: ['optics', 'wave', 'polarization'],
    keyContributions: {
      en: ['Wave theory of light (1678)', 'Explained birefringence in calcite', 'Huygens\' principle'],
      zh: ['光的波动说 (1678)', '解释冰洲石双折射', '惠更斯原理']
    },
    eventYears: [1678, 1690]
  },
  {
    id: 'bartholin',
    nameEn: 'Erasmus Bartholin',
    nameZh: '伊拉斯谟·巴托林',
    birthYear: 1625,
    deathYear: 1698,
    nationality: 'Danish',
    emoji: '💎',
    fields: ['polarization'],
    keyContributions: {
      en: ['Discovered double refraction in calcite (1669)'],
      zh: ['发现冰洲石双折射 (1669)']
    },
    eventYears: [1669]
  },
  {
    id: 'young',
    nameEn: 'Thomas Young',
    nameZh: '托马斯·杨',
    birthYear: 1773,
    deathYear: 1829,
    nationality: 'English',
    emoji: '🔬',
    fields: ['optics', 'wave'],
    keyContributions: {
      en: ['Double-slit experiment (1801)', 'Interference principle', 'Revived wave theory'],
      zh: ['双缝实验 (1801)', '干涉原理', '复兴波动说']
    },
    eventYears: [1801]
  },
  {
    id: 'malus',
    nameEn: 'Étienne-Louis Malus',
    nameZh: '艾蒂安-路易·马吕斯',
    birthYear: 1775,
    deathYear: 1812,
    nationality: 'French',
    emoji: '🪟',
    fields: ['polarization'],
    keyContributions: {
      en: ['Discovered polarization by reflection (1808)', 'Malus\'s Law', 'Named "polarization"'],
      zh: ['发现反射偏振 (1808)', '马吕斯定律', '命名"偏振"']
    },
    eventYears: [1808, 1810]
  },
  {
    id: 'fresnel',
    nameEn: 'Augustin-Jean Fresnel',
    nameZh: '奥古斯丁-让·菲涅尔',
    birthYear: 1788,
    deathYear: 1827,
    nationality: 'French',
    emoji: '💡',
    fields: ['optics', 'wave', 'polarization'],
    keyContributions: {
      en: ['Fresnel equations', 'Diffraction theory (1818)', 'Proved light is transverse wave'],
      zh: ['菲涅尔方程', '衍射理论 (1818)', '证明光是横波']
    },
    eventYears: [1818, 1821]
  },
  {
    id: 'arago',
    nameEn: 'François Arago',
    nameZh: '弗朗索瓦·阿拉果',
    birthYear: 1786,
    deathYear: 1853,
    nationality: 'French',
    emoji: '🔭',
    fields: ['optics', 'polarization'],
    keyContributions: {
      en: ['Arago spot experiment', 'Championed Fresnel\'s work', 'Chromatic polarization'],
      zh: ['阿拉果亮斑实验', '支持菲涅尔理论', '色偏振研究']
    },
    eventYears: [1811, 1818]
  },
  {
    id: 'brewster',
    nameEn: 'David Brewster',
    nameZh: '大卫·布儒斯特',
    birthYear: 1781,
    deathYear: 1868,
    nationality: 'Scottish',
    emoji: '🔲',
    fields: ['polarization'],
    keyContributions: {
      en: ['Brewster\'s angle (1815)', 'Invented kaleidoscope', 'Biaxial crystals'],
      zh: ['布儒斯特角 (1815)', '发明万花筒', '双轴晶体研究']
    },
    eventYears: [1815]
  },
  {
    id: 'biot',
    nameEn: 'Jean-Baptiste Biot',
    nameZh: '让-巴蒂斯特·毕奥',
    birthYear: 1774,
    deathYear: 1862,
    nationality: 'French',
    emoji: '🧪',
    fields: ['polarization'],
    keyContributions: {
      en: ['Optical activity (1815)', 'Circular polarization', 'Saccharimetry'],
      zh: ['旋光性 (1815)', '圆偏振', '糖度测量']
    },
    eventYears: [1815]
  },
  {
    id: 'maxwell',
    nameEn: 'James Clerk Maxwell',
    nameZh: '詹姆斯·克拉克·麦克斯韦',
    birthYear: 1831,
    deathYear: 1879,
    nationality: 'Scottish',
    emoji: '⚡',
    fields: ['optics', 'wave'],
    keyContributions: {
      en: ['Maxwell\'s equations (1865)', 'Light is electromagnetic wave', 'Unified electromagnetism and optics'],
      zh: ['麦克斯韦方程组 (1865)', '光是电磁波', '统一电磁学与光学']
    },
    eventYears: [1865]
  },
  {
    id: 'stokes',
    nameEn: 'George Gabriel Stokes',
    nameZh: '乔治·加布里埃尔·斯托克斯',
    birthYear: 1819,
    deathYear: 1903,
    nationality: 'Irish',
    emoji: '📊',
    fields: ['polarization', 'optics'],
    keyContributions: {
      en: ['Stokes parameters (1852)', 'Fluorescence studies', 'Mathematical physics'],
      zh: ['斯托克斯参数 (1852)', '荧光研究', '数学物理']
    },
    eventYears: [1852]
  },
  {
    id: 'jones',
    nameEn: 'R. Clark Jones',
    nameZh: 'R·克拉克·琼斯',
    birthYear: 1916,
    deathYear: 2004,
    nationality: 'American',
    emoji: '📐',
    fields: ['polarization'],
    keyContributions: {
      en: ['Jones calculus (1941)', 'Polarization matrix formalism'],
      zh: ['琼斯矩阵 (1941)', '偏振矩阵形式化']
    },
    eventYears: [1941]
  },
  {
    id: 'mueller',
    nameEn: 'Hans Mueller',
    nameZh: '汉斯·穆勒',
    birthYear: 1900,
    deathYear: 1965,
    nationality: 'Swiss-American',
    emoji: '🔢',
    fields: ['polarization'],
    keyContributions: {
      en: ['Mueller calculus (1943)', 'Depolarization analysis'],
      zh: ['穆勒矩阵 (1943)', '退偏振分析']
    },
    eventYears: [1943]
  },
  {
    id: 'snell',
    nameEn: 'Willebrord Snell',
    nameZh: '威理博·斯涅尔',
    birthYear: 1580,
    deathYear: 1626,
    nationality: 'Dutch',
    emoji: '📏',
    fields: ['optics'],
    keyContributions: {
      en: ['Snell\'s law (1621)'],
      zh: ['斯涅尔定律 (1621)']
    },
    eventYears: [1621]
  },
  {
    id: 'nicol',
    nameEn: 'William Nicol',
    nameZh: '威廉·尼科尔',
    birthYear: 1770,
    deathYear: 1851,
    nationality: 'Scottish',
    emoji: '🔷',
    fields: ['polarization'],
    keyContributions: {
      en: ['Nicol prism (1828)', 'Polarizing device'],
      zh: ['尼科尔棱镜 (1828)', '偏振器件']
    },
    eventYears: [1828]
  },
  // === 新增科学家 ===
  {
    id: 'galileo',
    nameEn: 'Galileo Galilei',
    nameZh: '伽利略·伽利莱',
    birthYear: 1564,
    deathYear: 1642,
    nationality: 'Italian',
    emoji: '🔭',
    fields: ['optics'],
    keyContributions: {
      en: ['Improved telescope (1609)', 'Astronomical observations', 'Scientific method pioneer'],
      zh: ['改进望远镜 (1609)', '天文观测', '科学方法先驱']
    },
    eventYears: [1609]
  },
  {
    id: 'hooke',
    nameEn: 'Robert Hooke',
    nameZh: '罗伯特·胡克',
    birthYear: 1635,
    deathYear: 1703,
    nationality: 'English',
    emoji: '🔩',
    fields: ['optics', 'wave'],
    keyContributions: {
      en: ['Micrographia (1665)', 'Wave theory supporter', 'Newton\'s rings observation'],
      zh: ['《显微图谱》(1665)', '波动说支持者', '牛顿环观察']
    },
    eventYears: [1665]
  },
  {
    id: 'romer',
    nameEn: 'Ole Rømer',
    nameZh: '奥勒·罗默',
    birthYear: 1644,
    deathYear: 1710,
    nationality: 'Danish',
    emoji: '⏱️',
    fields: ['optics'],
    keyContributions: {
      en: ['First measurement of speed of light (1676)', 'Observed Jupiter\'s moons'],
      zh: ['首次测量光速 (1676)', '观测木星卫星']
    },
    eventYears: [1676]
  },
  {
    id: 'fermat',
    nameEn: 'Pierre de Fermat',
    nameZh: '皮埃尔·德·费马',
    birthYear: 1607,
    deathYear: 1665,
    nationality: 'French',
    emoji: '📐',
    fields: ['optics'],
    keyContributions: {
      en: ['Fermat\'s principle of least time (1662)', 'Derived Snell\'s law from variational principle'],
      zh: ['费马最短时间原理 (1662)', '从变分原理推导斯涅尔定律']
    },
    eventYears: [1662]
  },
  {
    id: 'fraunhofer',
    nameEn: 'Joseph von Fraunhofer',
    nameZh: '约瑟夫·冯·夫琅和费',
    birthYear: 1787,
    deathYear: 1826,
    nationality: 'German',
    emoji: '🌈',
    fields: ['optics'],
    keyContributions: {
      en: ['Fraunhofer lines (1814)', 'Diffraction grating', 'Precision optical instruments'],
      zh: ['夫琅和费线 (1814)', '衍射光栅', '精密光学仪器']
    },
    eventYears: [1814]
  },
  {
    id: 'faraday',
    nameEn: 'Michael Faraday',
    nameZh: '迈克尔·法拉第',
    birthYear: 1791,
    deathYear: 1867,
    nationality: 'English',
    emoji: '🧲',
    fields: ['optics', 'polarization'],
    keyContributions: {
      en: ['Faraday effect (1845)', 'Magneto-optical rotation', 'Electromagnetic induction'],
      zh: ['法拉第效应 (1845)', '磁光旋转', '电磁感应']
    },
    eventYears: [1845]
  },
  {
    id: 'hertz',
    nameEn: 'Heinrich Hertz',
    nameZh: '海因里希·赫兹',
    birthYear: 1857,
    deathYear: 1894,
    nationality: 'German',
    emoji: '📻',
    fields: ['optics', 'wave'],
    keyContributions: {
      en: ['Experimental proof of EM waves (1887)', 'Photoelectric effect observation', 'Hertzian waves'],
      zh: ['电磁波实验证明 (1887)', '光电效应观察', '赫兹波']
    },
    eventYears: [1887]
  },
  {
    id: 'michelson',
    nameEn: 'Albert Michelson',
    nameZh: '阿尔伯特·迈克尔逊',
    birthYear: 1852,
    deathYear: 1931,
    nationality: 'American',
    emoji: '🎯',
    fields: ['optics'],
    keyContributions: {
      en: ['Michelson interferometer (1881)', 'Precision speed of light measurement', 'Nobel Prize 1907'],
      zh: ['迈克尔逊干涉仪 (1881)', '精确光速测量', '1907年诺贝尔奖']
    },
    eventYears: [1881, 1887]
  },
  {
    id: 'land',
    nameEn: 'Edwin Land',
    nameZh: '埃德温·兰德',
    birthYear: 1909,
    deathYear: 1991,
    nationality: 'American',
    emoji: '📷',
    fields: ['polarization'],
    keyContributions: {
      en: ['Polaroid filters (1932)', 'Instant photography', 'Modern polarizer technology'],
      zh: ['宝丽来滤光片 (1932)', '即时摄影', '现代偏振技术']
    },
    eventYears: [1932]
  },
  {
    id: 'gabor',
    nameEn: 'Dennis Gabor',
    nameZh: '丹尼斯·盖博',
    birthYear: 1900,
    deathYear: 1979,
    nationality: 'Hungarian-British',
    emoji: '💿',
    fields: ['optics', 'wave'],
    keyContributions: {
      en: ['Holography invention (1947)', 'Nobel Prize 1971', 'Coherent light imaging'],
      zh: ['全息术发明 (1947)', '1971年诺贝尔奖', '相干光成像']
    },
    eventYears: [1947]
  },
  // === 新增散射科学家 ===
  {
    id: 'tyndall',
    nameEn: 'John Tyndall',
    nameZh: '约翰·廷德尔',
    birthYear: 1820,
    deathYear: 1893,
    nationality: 'Irish',
    emoji: '☁️',
    fields: ['optics'],
    keyContributions: {
      en: ['Tyndall effect (1870)', 'Light scattering experiments', 'Greenhouse effect demonstration'],
      zh: ['廷德尔效应 (1870)', '光散射实验', '温室效应演示']
    },
    eventYears: [1870]
  },
  {
    id: 'rayleigh',
    nameEn: 'Lord Rayleigh',
    nameZh: '瑞利勋爵',
    birthYear: 1842,
    deathYear: 1919,
    nationality: 'English',
    emoji: '🌤️',
    fields: ['optics', 'polarization'],
    keyContributions: {
      en: ['Rayleigh scattering theory (1871)', 'Explained sky blue color and polarization', 'Nobel Prize 1904'],
      zh: ['瑞利散射理论 (1871)', '解释天空蓝色和偏振', '1904年诺贝尔奖']
    },
    eventYears: [1871]
  },
  {
    id: 'mie',
    nameEn: 'Gustav Mie',
    nameZh: '古斯塔夫·米',
    birthYear: 1868,
    deathYear: 1957,
    nationality: 'German',
    emoji: '☁️',
    fields: ['optics'],
    keyContributions: {
      en: ['Mie scattering theory (1908)', 'Exact solution for spherical particle scattering'],
      zh: ['米氏散射理论 (1908)', '球形颗粒散射的精确解']
    },
    eventYears: [1908]
  },
]

// 科学家关系数据
export const SCIENTIST_RELATIONS: ScientistRelation[] = [
  // 牛顿与惠更斯的竞争
  {
    from: 'newton',
    to: 'huygens',
    type: 'rival',
    descriptionEn: 'Newton\'s corpuscular theory vs Huygens\' wave theory - the great debate',
    descriptionZh: '牛顿的微粒说 vs 惠更斯的波动说 - 世纪之争',
    year: 1690
  },
  // 惠更斯受巴托林影响
  {
    from: 'bartholin',
    to: 'huygens',
    type: 'influenced',
    descriptionEn: 'Bartholin\'s double refraction discovery inspired Huygens\' wave theory',
    descriptionZh: '巴托林的双折射发现启发了惠更斯的波动理论',
    year: 1690
  },
  // 杨发展波动说
  {
    from: 'huygens',
    to: 'young',
    type: 'built-upon',
    descriptionEn: 'Young revived and extended Huygens\' wave theory',
    descriptionZh: '杨复兴并发展了惠更斯的波动理论',
    year: 1801
  },
  // 杨反驳牛顿
  {
    from: 'young',
    to: 'newton',
    type: 'refuted',
    descriptionEn: 'Young\'s interference experiments challenged Newton\'s particle theory',
    descriptionZh: '杨的干涉实验挑战了牛顿的微粒说',
    year: 1801
  },
  // 菲涅尔发展杨的工作
  {
    from: 'young',
    to: 'fresnel',
    type: 'influenced',
    descriptionEn: 'Fresnel mathematically formalized Young\'s wave concepts',
    descriptionZh: '菲涅尔将杨的波动概念数学化',
    year: 1818
  },
  // 阿拉果是菲涅尔的导师
  {
    from: 'arago',
    to: 'fresnel',
    type: 'teacher-student',
    descriptionEn: 'Arago mentored Fresnel and championed his wave theory',
    descriptionZh: '阿拉果指导菲涅尔并支持他的波动理论',
    year: 1815
  },
  // 阿拉果与毕奥合作
  {
    from: 'arago',
    to: 'biot',
    type: 'collaborator',
    descriptionEn: 'Collaborated on chromatic polarization studies',
    descriptionZh: '合作研究色偏振',
    year: 1811
  },
  // 马吕斯影响布儒斯特
  {
    from: 'malus',
    to: 'brewster',
    type: 'influenced',
    descriptionEn: 'Malus\'s polarization discovery inspired Brewster\'s angle research',
    descriptionZh: '马吕斯的偏振发现启发了布儒斯特角研究',
    year: 1815
  },
  // 菲涅尔证明横波
  {
    from: 'fresnel',
    to: 'malus',
    type: 'built-upon',
    descriptionEn: 'Fresnel explained Malus\'s polarization using transverse wave theory',
    descriptionZh: '菲涅尔用横波理论解释了马吕斯的偏振现象',
    year: 1821
  },
  // 麦克斯韦发展菲涅尔
  {
    from: 'fresnel',
    to: 'maxwell',
    type: 'built-upon',
    descriptionEn: 'Maxwell unified light with electromagnetism, building on wave theory',
    descriptionZh: '麦克斯韦在波动理论基础上统一了光与电磁学',
    year: 1865
  },
  // 斯托克斯与偏振参数
  {
    from: 'malus',
    to: 'stokes',
    type: 'built-upon',
    descriptionEn: 'Stokes developed mathematical framework for polarization states',
    descriptionZh: '斯托克斯发展了偏振态的数学框架',
    year: 1852
  },
  // 琼斯发展矩阵方法
  {
    from: 'stokes',
    to: 'jones',
    type: 'built-upon',
    descriptionEn: 'Jones developed matrix calculus for coherent polarization',
    descriptionZh: '琼斯发展了相干偏振的矩阵方法',
    year: 1941
  },
  // 穆勒与琼斯同时代
  {
    from: 'jones',
    to: 'mueller',
    type: 'contemporary',
    descriptionEn: 'Mueller and Jones independently developed polarization matrix formalisms',
    descriptionZh: '穆勒和琼斯独立发展了偏振矩阵形式',
    year: 1943
  },
  // 尼科尔发展偏振器件
  {
    from: 'malus',
    to: 'nicol',
    type: 'built-upon',
    descriptionEn: 'Nicol invented practical polarizing prism based on polarization principles',
    descriptionZh: '尼科尔基于偏振原理发明了实用偏振棱镜',
    year: 1828
  },
  // 斯涅尔影响牛顿
  {
    from: 'snell',
    to: 'newton',
    type: 'influenced',
    descriptionEn: 'Snell\'s refraction law was foundation for Newton\'s optical studies',
    descriptionZh: '斯涅尔折射定律是牛顿光学研究的基础',
    year: 1665
  },
  // === 新增关系 ===
  // 伽利略影响光学发展
  {
    from: 'galileo',
    to: 'newton',
    type: 'influenced',
    descriptionEn: 'Galileo\'s telescope innovations inspired Newton\'s optical research',
    descriptionZh: '伽利略的望远镜创新启发了牛顿的光学研究',
    year: 1665
  },
  // 胡克与牛顿的竞争
  {
    from: 'hooke',
    to: 'newton',
    type: 'rival',
    descriptionEn: 'Hooke and Newton had famous disputes over optics and gravity',
    descriptionZh: '胡克与牛顿在光学和引力问题上有著名的争论',
    year: 1672
  },
  // 胡克支持惠更斯的波动说
  {
    from: 'hooke',
    to: 'huygens',
    type: 'collaborator',
    descriptionEn: 'Hooke supported Huygens\' wave theory of light',
    descriptionZh: '胡克支持惠更斯的光波动说',
    year: 1678
  },
  // 罗默影响惠更斯
  {
    from: 'romer',
    to: 'huygens',
    type: 'influenced',
    descriptionEn: 'Rømer\'s light speed measurement supported wave theory',
    descriptionZh: '罗默的光速测量支持了波动说',
    year: 1676
  },
  // 费马影响斯涅尔定律的理论基础
  {
    from: 'fermat',
    to: 'snell',
    type: 'built-upon',
    descriptionEn: 'Fermat derived Snell\'s law from least time principle',
    descriptionZh: '费马从最短时间原理推导出斯涅尔定律',
    year: 1662
  },
  // 夫琅和费与菲涅尔同时代
  {
    from: 'fraunhofer',
    to: 'fresnel',
    type: 'contemporary',
    descriptionEn: 'Fraunhofer and Fresnel were contemporaries advancing optics',
    descriptionZh: '夫琅和费与菲涅尔同时代推进光学发展',
    year: 1818
  },
  // 法拉第影响麦克斯韦
  {
    from: 'faraday',
    to: 'maxwell',
    type: 'influenced',
    descriptionEn: 'Faraday\'s field concept inspired Maxwell\'s equations',
    descriptionZh: '法拉第的场概念启发了麦克斯韦方程组',
    year: 1865
  },
  // 法拉第发展偏振
  {
    from: 'fresnel',
    to: 'faraday',
    type: 'influenced',
    descriptionEn: 'Fresnel\'s polarization work enabled Faraday\'s magneto-optical discovery',
    descriptionZh: '菲涅尔的偏振研究为法拉第的磁光发现奠定基础',
    year: 1845
  },
  // 赫兹验证麦克斯韦
  {
    from: 'maxwell',
    to: 'hertz',
    type: 'influenced',
    descriptionEn: 'Hertz experimentally confirmed Maxwell\'s electromagnetic wave theory',
    descriptionZh: '赫兹实验证实了麦克斯韦的电磁波理论',
    year: 1887
  },
  // 迈克尔逊与赫兹同时代
  {
    from: 'michelson',
    to: 'hertz',
    type: 'contemporary',
    descriptionEn: 'Michelson and Hertz made groundbreaking optical experiments in the same era',
    descriptionZh: '迈克尔逊和赫兹在同时代进行了开创性的光学实验',
    year: 1887
  },
  // 迈克尔逊发展干涉技术
  {
    from: 'young',
    to: 'michelson',
    type: 'built-upon',
    descriptionEn: 'Michelson perfected interferometry based on Young\'s interference principle',
    descriptionZh: '迈克尔逊在杨的干涉原理基础上完善了干涉技术',
    year: 1881
  },
  // 兰德发展偏振应用
  {
    from: 'nicol',
    to: 'land',
    type: 'built-upon',
    descriptionEn: 'Land revolutionized polarizer technology building on Nicol\'s prism',
    descriptionZh: '兰德在尼科尔棱镜基础上革新了偏振技术',
    year: 1932
  },
  // 盖博发展全息术
  {
    from: 'gabor',
    to: 'land',
    type: 'contemporary',
    descriptionEn: 'Gabor and Land both pioneered modern optical technologies in the 20th century',
    descriptionZh: '盖博和兰德都是20世纪现代光学技术的先驱',
    year: 1947
  },
  // 盖博基于干涉
  {
    from: 'young',
    to: 'gabor',
    type: 'built-upon',
    descriptionEn: 'Gabor\'s holography is based on wave interference principles',
    descriptionZh: '盖博的全息术基于波干涉原理',
    year: 1947
  },
  // === 散射科学家关系 ===
  // 瑞利解释廷德尔的实验观察
  {
    from: 'tyndall',
    to: 'rayleigh',
    type: 'influenced',
    descriptionEn: 'Tyndall\'s experimental observations inspired Rayleigh\'s theoretical explanation of scattering',
    descriptionZh: '廷德尔的实验观察启发了瑞利的散射理论解释',
    year: 1871
  },
  // 米发展瑞利的理论
  {
    from: 'rayleigh',
    to: 'mie',
    type: 'built-upon',
    descriptionEn: 'Mie extended Rayleigh scattering to particles of any size',
    descriptionZh: '米将瑞利散射扩展到任意尺寸的颗粒',
    year: 1908
  },
  // 廷德尔与法拉第在皇家研究所的联系
  {
    from: 'faraday',
    to: 'tyndall',
    type: 'collaborator',
    descriptionEn: 'Tyndall succeeded Faraday at the Royal Institution and continued his legacy',
    descriptionZh: '廷德尔在皇家研究所接替法拉第并延续其遗产',
    year: 1867
  },
  // 瑞利与麦克斯韦的联系
  {
    from: 'maxwell',
    to: 'rayleigh',
    type: 'influenced',
    descriptionEn: 'Rayleigh applied Maxwell\'s electromagnetic theory to explain light scattering',
    descriptionZh: '瑞利应用麦克斯韦电磁理论解释光散射',
    year: 1871
  },
  // 米与麦克斯韦的联系
  {
    from: 'maxwell',
    to: 'mie',
    type: 'built-upon',
    descriptionEn: 'Mie derived his scattering solution directly from Maxwell\'s equations',
    descriptionZh: '米直接从麦克斯韦方程组推导出他的散射解',
    year: 1908
  },
]

// 探索故事线
export interface Storyline {
  id: string
  titleEn: string
  titleZh: string
  icon: string
  color: string
  descriptionEn: string
  descriptionZh: string
  // 途经的科学家节点
  waypoints: string[]
  // 预计时长
  duration: string
  // 引导问题
  questions: {
    en: string[]
    zh: string[]
  }
  // 关联的时间线事件
  relatedEvents: { year: number; track: 'optics' | 'polarization' }[]
}

export const STORYLINES: Storyline[] = [
  {
    id: 'wave-triumph',
    titleEn: 'The Wave Theory Triumph',
    titleZh: '波动说的胜利',
    icon: '🌊',
    color: 'cyan',
    descriptionEn: 'From Huygens\' hypothesis to Fresnel\'s proof — 150 years of debate',
    descriptionZh: '从惠更斯的假说到菲涅尔的证明——150年的争论',
    waypoints: ['huygens', 'newton', 'young', 'fresnel', 'maxwell'],
    duration: '15 min',
    questions: {
      en: [
        'Why did Newton\'s particle theory dominate for 100 years?',
        'What made Young\'s experiments convincing?',
        'How did Fresnel finally prove light is a wave?'
      ],
      zh: [
        '为什么牛顿的微粒说统治了100年？',
        '杨的实验为什么有说服力？',
        '菲涅尔如何最终证明光是波？'
      ]
    },
    relatedEvents: [
      { year: 1678, track: 'optics' },
      { year: 1704, track: 'optics' },
      { year: 1801, track: 'optics' },
      { year: 1818, track: 'polarization' },
      { year: 1865, track: 'optics' }
    ]
  },
  {
    id: 'polarization-journey',
    titleEn: 'The Polarization Discovery',
    titleZh: '偏振光的发现之旅',
    icon: '◐',
    color: 'purple',
    descriptionEn: 'From mysterious calcite to modern applications',
    descriptionZh: '从神秘的冰洲石到现代应用',
    waypoints: ['bartholin', 'huygens', 'malus', 'brewster', 'fresnel'],
    duration: '12 min',
    questions: {
      en: [
        'Why does calcite produce double images?',
        'What was special about Malus\'s accidental discovery?',
        'How did polarization prove light is a transverse wave?'
      ],
      zh: [
        '冰洲石为什么能产生双像？',
        '马吕斯的偶然发现有什么特殊之处？',
        '偏振如何证明光是横波？'
      ]
    },
    relatedEvents: [
      { year: 1669, track: 'polarization' },
      { year: 1690, track: 'polarization' },
      { year: 1808, track: 'polarization' },
      { year: 1815, track: 'polarization' },
      { year: 1821, track: 'polarization' }
    ]
  },
  {
    id: 'measurement-masters',
    titleEn: 'Quantifying Light',
    titleZh: '光的量化之路',
    icon: '📐',
    color: 'amber',
    descriptionEn: 'From qualitative observations to precise mathematical frameworks',
    descriptionZh: '从定性观察到精确的数学框架',
    waypoints: ['snell', 'malus', 'stokes', 'jones', 'mueller'],
    duration: '10 min',
    questions: {
      en: [
        'How did scientists move from observation to measurement?',
        'Why do we need different matrix formalisms (Jones vs Mueller)?',
        'How are these tools used in modern applications?'
      ],
      zh: [
        '科学家如何从观察走向测量？',
        '为什么需要不同的矩阵形式（琼斯 vs 穆勒）？',
        '这些工具在现代应用中如何使用？'
      ]
    },
    relatedEvents: [
      { year: 1621, track: 'optics' },
      { year: 1810, track: 'polarization' },
      { year: 1852, track: 'polarization' },
      { year: 1941, track: 'polarization' }
    ]
  },
]

// 探究任务
export interface Quest {
  id: string
  titleEn: string
  titleZh: string
  mysteryEn: string
  mysteryZh: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  clues: {
    scientistId: string
    hintEn: string
    hintZh: string
  }[]
  insightEn: string
  insightZh: string
  badge: string
}

export const QUESTS: Quest[] = [
  {
    id: 'quest-delay',
    titleEn: 'The 100-Year Delay',
    titleZh: '为什么晚了100年？',
    mysteryEn: 'Newton published his particle theory in 1704. Why did it take until 1818 for the wave theory to triumph?',
    mysteryZh: '牛顿1704年发表微粒说，为什么波动说的胜利要等到1818年？',
    icon: '⏳',
    difficulty: 'medium',
    clues: [
      { scientistId: 'newton', hintEn: 'Look at Newton\'s authority and influence', hintZh: '观察牛顿的权威和影响力' },
      { scientistId: 'young', hintEn: 'Why wasn\'t Young\'s experiment convincing to everyone?', hintZh: '为什么杨的实验无法说服所有人？' },
      { scientistId: 'fresnel', hintEn: 'What made Fresnel\'s contribution decisive?', hintZh: '菲涅尔的贡献为什么是决定性的？' }
    ],
    insightEn: 'Scientific progress requires not just evidence, but overcoming established authority and paradigms.',
    insightZh: '科学进步不仅需要证据，还需要克服既有权威和范式。',
    badge: '🏆 科学史探究者'
  },
  {
    id: 'quest-serendipity',
    titleEn: 'Serendipity in Science',
    titleZh: '偶然中的必然',
    mysteryEn: 'If Malus hadn\'t looked through his window at sunset that day, would polarization still have been discovered?',
    mysteryZh: '如果马吕斯那天没有透过窗户看夕阳，偏振还会被发现吗？',
    icon: '🎲',
    difficulty: 'easy',
    clues: [
      { scientistId: 'malus', hintEn: 'What conditions led to this "accident"?', hintZh: '什么条件导致了这次"偶然"？' },
      { scientistId: 'brewster', hintEn: 'How did Brewster systematize the study?', hintZh: '布儒斯特如何系统化研究？' }
    ],
    insightEn: 'Scientific discoveries often happen when a prepared mind meets an unexpected opportunity.',
    insightZh: '科学发现往往是"准备好的头脑"遇见"偶然的机会"。',
    badge: '🌟 偏振探索者'
  },
  {
    id: 'quest-transverse',
    titleEn: 'The Transverse Mystery',
    titleZh: '横波之谜',
    mysteryEn: 'How did polarization prove that light is a transverse wave, not a longitudinal one like sound?',
    mysteryZh: '偏振如何证明光是横波，而不是像声音一样的纵波？',
    icon: '🔄',
    difficulty: 'hard',
    clues: [
      { scientistId: 'huygens', hintEn: 'Huygens couldn\'t explain polarization with his wave model', hintZh: '惠更斯无法用他的波动模型解释偏振' },
      { scientistId: 'fresnel', hintEn: 'Fresnel\'s key insight about wave oscillation direction', hintZh: '菲涅尔关于波振动方向的关键洞见' }
    ],
    insightEn: 'Polarization can only occur in transverse waves because it requires oscillation perpendicular to propagation.',
    insightZh: '偏振只能发生在横波中，因为它需要垂直于传播方向的振动。',
    badge: '🎓 物理直觉大师'
  }
]

// 获取关系类型的颜色和标签
export const RELATION_STYLES: Record<RelationType, { color: string; labelEn: string; labelZh: string; icon: string }> = {
  'teacher-student': { color: 'green', labelEn: 'Mentor', labelZh: '师承', icon: '👨‍🏫' },
  'collaborator': { color: 'blue', labelEn: 'Collaboration', labelZh: '合作', icon: '🤝' },
  'rival': { color: 'red', labelEn: 'Rivalry', labelZh: '竞争', icon: '⚔️' },
  'influenced': { color: 'purple', labelEn: 'Influenced', labelZh: '影响', icon: '💡' },
  'built-upon': { color: 'cyan', labelEn: 'Built Upon', labelZh: '发展', icon: '📈' },
  'refuted': { color: 'orange', labelEn: 'Refuted', labelZh: '反驳', icon: '❌' },
  'contemporary': { color: 'gray', labelEn: 'Contemporary', labelZh: '同时代', icon: '👥' },
}

// 辅助函数：获取科学家的所有关系
export function getScientistRelations(scientistId: string): ScientistRelation[] {
  return SCIENTIST_RELATIONS.filter(r => r.from === scientistId || r.to === scientistId)
}

// 辅助函数：获取与某科学家直接相关的其他科学家
export function getConnectedScientists(scientistId: string): Scientist[] {
  const relations = getScientistRelations(scientistId)
  const connectedIds = new Set<string>()
  relations.forEach(r => {
    if (r.from === scientistId) connectedIds.add(r.to)
    if (r.to === scientistId) connectedIds.add(r.from)
  })
  return SCIENTISTS.filter(s => connectedIds.has(s.id))
}
