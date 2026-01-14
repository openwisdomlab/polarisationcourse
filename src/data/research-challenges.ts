/**
 * Research Challenges Data - 开放科研挑战数据
 * 真实科研项目，开放式探索
 */

export interface ResearchChallenge {
  id: string
  titleEn: string
  titleZh: string
  subtitleEn: string
  subtitleZh: string

  // 核心问题
  coreQuestionEn: string
  coreQuestionZh: string

  // 背景介绍
  backgroundEn: string
  backgroundZh: string

  // 研究意义
  significanceEn: string
  significanceZh: string

  // 研究目标（数组，每个目标一项）
  objectivesEn: string[]
  objectivesZh: string[]

  // 研究任务
  tasks: {
    id: string
    titleEn: string
    titleZh: string
    descriptionEn: string
    descriptionZh: string
  }[]

  // 研究流程
  workflow: {
    stepEn: string
    stepZh: string
  }[]

  // 数据来源
  dataSourceEn: string
  dataSourceZh: string

  // 方法论
  methodsEn: string[]
  methodsZh: string[]

  // 预期成果
  expectedOutcomesEn: string[]
  expectedOutcomesZh: string[]

  // 元数据
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'active' | 'completed' | 'coming-soon'
  estimatedWeeks: number
  tags: string[]
  category: 'biomedical' | 'environmental' | 'materials' | 'fundamental'

  // 可选：相关资源
  relatedDemos?: string[]
  relatedPapers?: { title: string; url: string }[]
  supplementaryNote?: { en: string; zh: string }
}

export const RESEARCH_CHALLENGES: ResearchChallenge[] = [
  // 挑战1：活细胞凋亡监测
  {
    id: 'cell-apoptosis-mueller',
    titleEn: 'Label-Free Live Cell Apoptosis Monitoring',
    titleZh: '无标记活细胞凋亡监测',
    subtitleEn: 'Using "invisible light information" to observe cell life and death',
    subtitleZh: '用眼睛"看不见的光信息"观测细胞的生与死',

    coreQuestionEn: 'Can we detect cell apoptosis without fluorescent labeling, using Mueller microscopy and data analysis?',
    coreQuestionZh: '能否在不对细胞进行染色的情况下，利用缪勒成像和数据分析判断细胞是否正在发生凋亡？',

    backgroundEn: 'In life sciences and medical research, determining whether cells are healthy or dying is fundamental. Traditional methods rely on fluorescent dyes that bind to specific cellular components during apoptosis, emitting colored signals. However, these dyes can alter cell states, interfere with long-term observations, and the staining process is time-consuming and costly. Can we achieve this without staining?',
    backgroundZh: '在生命科学和医学研究中，细胞是否健康、是否正在死亡，是一个非常基础但又极其重要的问题。传统方法使用对凋亡敏感的荧光分子，它们只会在细胞发生凋亡时与特定成分结合并发出荧光。然而，荧光分子进入细胞可能会影响细胞原本的状态；影响长时间观察活细胞的实验效果；并且染色过程费时费力费钱。',

    significanceEn: 'This research explores label-free cell apoptosis detection using full-polarization Mueller microscopy. By analyzing polarization features instead of fluorescent signals, we can monitor cell death without interference, enabling long-term live-cell imaging and reducing experimental costs.',
    significanceZh: '本研究探索利用全偏振缪勒显微成像实现无标记细胞凋亡检测。通过分析偏振特征而非荧光信号，我们可以在不干扰细胞的情况下监测细胞死亡，实现长时间活细胞成像并降低实验成本。',

    objectivesEn: [
      'Understand what cell apoptosis is and distinguish between necrosis and programmed cell death',
      'Learn the roles of Mueller imaging vs. fluorescence imaging and what each reveals',
      'Understand experimental design in research: why control groups (normal cells) are essential',
      'Master Mueller image data and processing methods, learn to extract polarization features',
      'Experience real research uncertainty: not every cell behaves as expected, statistical trends matter'
    ],
    objectivesZh: [
      '理解什么是细胞凋亡，区分细胞"坏死"和"程序性死亡"',
      '认识缪勒成像与荧光成像的作用，分别能看到什么',
      '理解科研中的实验设计，为什么一定要有正常细胞做对照',
      '了解缪勒图像数据和数据处理方法，学习提取偏振特征',
      '体会真实科研中的不确定性，不是每个细胞都会按计划变化，统计和趋势很重要'
    ],

    tasks: [
      {
        id: 'task-1',
        titleEn: 'Task 1: Experimental Objects & Data Collection',
        titleZh: '任务一：认识实验对象与数据采集',
        descriptionEn: 'Learn about cell scale, microscopy imaging and sampling methods. Observe normal cells vs. stimulated cells (drug-induced or UV-irradiated) using brightfield, fluorescence, and Mueller imaging. Think: Do cells change after stimulation? Are changes random or patterned?',
        descriptionZh: '了解细胞尺度、显微镜成像与采样方式。观察正常细胞与受刺激细胞（药物诱导或紫外照射）的明场、荧光和缪勒图像。思考：刺激后细胞是否发生变化？这些变化是否随机？'
      },
      {
        id: 'task-2',
        titleEn: 'Task 2: Data Processing & Image Analysis (Core)',
        titleZh: '任务二：数据处理与图像分析（核心）',
        descriptionEn: 'Convert microscopy images to digital signals, extract per-pixel features, compute Mueller matrices and polarization parameters. Perform data preprocessing (cell segmentation, data cleaning, polarization superpixels). Use machine learning (dimensionality reduction, clustering, feature extraction) to identify abnormal regions. Apply virtual staining to highlight potential apoptotic cells. Perform statistical analysis and create visualizations.',
        descriptionZh: '将显微镜图像转化为数字信号，对每个像素提取特征，计算缪勒矩阵、偏振参数等。进行数据预处理（细胞区域分割、数据清洗、偏振超像素）。使用机器学习方法（降维、聚类、特征提取）找出异常区域。用虚拟染色方式标记潜在凋亡细胞。进行统计分析并创建可视化图表。'
      },
      {
        id: 'task-3',
        titleEn: 'Task 3: Scientific Discussion & Report Formation',
        titleZh: '任务三：科研讨论与报告形成',
        descriptionEn: 'Discuss: Which cells are most likely apoptotic? What\'s the evidence? How to verify? Are there uncertainties? Deeply understand: scientific conclusions are not absolute truths, but evidence-based, controlled, and reasoned inferences.',
        descriptionZh: '讨论总结：哪些细胞最有可能处于凋亡状态？判断依据是什么？如何验证？是否存在不确定的情况？深度理解：科研结论并非绝对正确，而是基于证据、对照和合理推理得出。'
      }
    ],

    workflow: [
      { stepEn: 'Pose the question: Are cells undergoing apoptosis?', stepZh: '提出问题——细胞是否发生凋亡？' },
      { stepEn: 'Establish controls & acquire data: normal cells, stimulated cells, time series, brightfield/fluorescence/polarization', stepZh: '建立对照&获取图像数据：正常细胞、受刺激细胞、时间序列对照、明场/荧光/偏振' },
      { stepEn: 'Data analysis, machine learning, statistics', stepZh: '数据分析，机器学习，统计' },
      { stepEn: 'Form conclusions and discuss uncertainties', stepZh: '形成结论并讨论不确定性' }
    ],

    dataSourceEn: 'Real cell images captured using full-polarization microscopy from ongoing research. Data includes normal cell states and stimulated (potentially apoptotic) states. Different cells exhibit varying responses, including both clear changes and ambiguous cases — typical of real research data.',
    dataSourceZh: '来源于全偏振显微镜下拍摄的真实细胞图像数据，来自正在进行的科研工作。数据包含正常细胞状态以及受到刺激后、可能发生凋亡的细胞状态。不同细胞的反应存在差异，既有明显变化的情况，也包含模糊不清的情况——这是真实科研数据的典型特征。',

    methodsEn: [
      'Method 1: Manual observation-based analysis (observe cell morphology)',
      'Method 2: Rule-based analysis (e.g., edge brighter than interior, brightness thresholds, abnormal regions at periphery)',
      'Method 3: Data-driven computational analysis (advanced): statistical or clustering algorithms'
    ],
    methodsZh: [
      '方法一：基于人工观察的分析方法（直接观测细胞形态等）',
      '方法二：基于简单规则的分析方法（例如：边缘区域比内部更亮、某些区域亮度超过阈值、异常区域集中在细胞周边）',
      '方法三：基于数据与计算的分析方法（进阶）：使用统计或聚类算法进行分析'
    ],

    expectedOutcomesEn: [
      'Identification of apoptotic cells from polarization features',
      'Statistical analysis showing trends over time',
      'Research report with visualizations (charts, heatmaps)',
      'Understanding of research uncertainty and evidence-based reasoning'
    ],
    expectedOutcomesZh: [
      '从偏振特征中识别凋亡细胞',
      '显示随时间变化趋势的统计分析',
      '带可视化图表（折线图、箱线图、热力图）的研究报告',
      '理解科研不确定性和基于证据的推理'
    ],

    difficulty: 'intermediate',
    status: 'active',
    estimatedWeeks: 4,
    tags: ['Mueller Microscopy', 'Cell Biology', 'Machine Learning', 'Medical Imaging', 'Label-free'],
    category: 'biomedical',

    supplementaryNote: {
      en: 'This project is not a fixed-answer teaching demo, but an ongoing real research project. Real research includes: continuously analyzing new experimental data, comparing different algorithms and analysis strategies, and organizing results into reports or papers. Research is never about those who know the answer explaining it, but about those who don\'t know the answer exploring together. If you\'re willing to join this exploration, you\'re already part of this research group.',
      zh: '本虚拟课题组项目并非结论固定的教学演示实验，而是来源于正在进行的真实科研工作。真实的研究工作包括：持续分析新的实验数据、比较不同算法和分析策略、把结果整理成报告或论文。科研从来不是知道答案的人在讲解，而是不知道答案的人在一起探索。如果你愿意参与这场探索，那么从现在开始，你已经是这个课题组的一部分了。'
    }
  },

  // 挑战2：微藻智能识别
  {
    id: 'microalgae-polarization-id',
    titleEn: 'Microalgae Identification Using Polarization "ID Photos"',
    titleZh: '微藻偏振"证件照"识别',
    subtitleEn: 'Using "invisible light" to create polarization fingerprints for microalgae recognition',
    subtitleZh: '使用"看不见的光"给微藻拍张"偏振证件照"',

    coreQuestionEn: 'How can we leverage the unique polarization signatures of different microalgae species, combined with AI algorithms, to achieve rapid and accurate automated identification?',
    coreQuestionZh: '如何充分利用不同微藻的偏振信息，结合人工智能算法，寻找出每种微藻的独特偏振特征，以区分不同微藻实现自动准确识别？',

    backgroundEn: 'In the vast oceans and lakes, microalgae — invisible to the naked eye — are the "tiny giants" of Earth. They are major oxygen producers, key participants in global carbon cycles, synthesizers of bioactive compounds in health supplements, and monitors of climate change and environmental restoration. Yet, when their growth spirals out of control, they can turn a blue water body into a deadly "red ghost" — harmful algal blooms (HABs). Can we identify these microscopic lives as quickly as facial recognition? Can we detect dominant species that may trigger HABs before disaster strikes, issuing early warnings? Traditional monitoring relies on experts manually identifying algae under microscopes — like finding needles in a haystack, time-consuming and often missing the optimal warning window. When AI meets polarization optics, we\'re attempting to use polarization as a new key to unlock microalgae\'s microstructural features, enabling dynamic population monitoring and novel early-warning systems.',
    backgroundZh: '在浩瀚的海洋与湖泊中，生活着一群肉眼看不见的"微小巨人"——微藻。它们是地球氧气的重要生产者，也是全球碳循环的关键参与者；它们能合成保健品中的活性物质，能监测气候变化、实现环境修复，却也能在失控繁殖时，将一片湛蓝的水域化为致命的"红色幽灵"——赤潮。你是否想过，我们能否像识别人脸一样，快速识别出这些微小的生命？又能否在灾难发生前提前识别出那些可能引发赤潮的"优势种"，从而在灾难形成前就发出预警？传统的监测方式如同大海捞针，依赖专家在显微镜下一一辨认，耗时费力，常常错过预警的最佳窗口。当人工智能遇见偏振光学，我们正尝试用偏振光这把新钥匙，解锁微藻世界的微观特征，实现微藻种群动态监测，为灾害预警提供全新的洞察。',

    significanceEn: 'This research develops a non-invasive, label-free intelligent monitoring method using polarization imaging. Without staining or destruction, we decode microalgae microstructures using images and algorithms, contributing real scientific power to protecting our blue planet. From identifying a single microalgae cell, we safeguard an ocean.',
    significanceZh: '本研究开发一种"不打扰"的智能监测新方法——无需染色，无需破坏，仅凭图像与算法，解码微藻的微观结构，为保护蓝色星球贡献真正的科研力量。让我们一起，从识别一个微藻细胞开始，守护一片海洋。',

    objectivesEn: [
      'Learn microalgae sample preparation and recognize different species in microscopy images',
      'Learn to extract information from images, understand Mueller image data and basic processing methods',
      'Understand polarization feature template methods and train templates for target algae species',
      'Work with real seawater samples to identify target microalgae in authentic aquatic environments'
    ],
    objectivesZh: [
      '学习微藻样本制备流程，初步认识不同微藻的显微图像',
      '学习如何从图像中提取信息，理解缪勒图像数据，了解基本的数据处理方法',
      '学习偏振特征模版方法的原理，并能够训练出目标藻的偏振特征模版',
      '接触真实海水样本，实现真实水体环境下的目标微藻识别'
    ],

    tasks: [
      {
        id: 'task-1',
        titleEn: 'Task 1: Recognizing Experimental Objects — Microalgae Microscopy',
        titleZh: '任务一：认识实验对象——不同微藻细胞的显微成像',
        descriptionEn: 'Systematically learn how to prepare microalgae samples, acquire polarization images using full-polarization microscopy for different species, and visually distinguish them. Understand basic morphology and appearance of various microalgae, focusing on Pseudo-nitzschia pungens and Skeletonema costatum.',
        descriptionZh: '系统学习如何制作微藻样本、如何使用全偏振显微镜采集不同微藻的偏振图像，并能够初步肉眼区分不同微藻。了解不同微藻基本的形态结构与样貌，并重点认识尖刺拟菱形藻和中肋骨条藻。'
      },
      {
        id: 'task-2',
        titleEn: 'Task 2: Data Analysis (Project Core)',
        titleZh: '任务二：数据分析（项目核心）',
        descriptionEn: 'Data preprocessing: compute Mueller matrices, polarization parameters, cell region segmentation, polarization superpixels. Combine machine learning (dimensionality reduction, clustering, feature extraction) to identify unique polarization signatures of target algae species, distinguishing them from non-target species. Primary method: K-Means clustering. Students can also apply other methods creatively.',
        descriptionZh: '数据预处理：计算缪勒矩阵、偏振参数、细胞区域分割、偏振超像素等；然后结合机器学习方法，通过降维、聚类、特征提取等计算分析，找出目标藻独特的偏振特征，用以区分目标藻与非目标藻。本过程主要采用的机器学习方法为K-Means聚类，学生亦可发挥主观能动性，采用其他方法实现。'
      },
      {
        id: 'task-3',
        titleEn: 'Task 3: Real Water Sample Validation',
        titleZh: '任务三：真实水体验证',
        descriptionEn: 'Validate using real water samples collected from the Wenzhou Marine Center. Combine with manual re-checking, continuously improve the model, and verify its accuracy and generalizability.',
        descriptionZh: '利用温州海洋中心处所采集的真实水样验证，结合人工复检，不断改进模型，验证模型的准确性和泛用性。'
      }
    ],

    workflow: [
      { stepEn: 'Pose the question: How to distinguish different microalgae cells?', stepZh: '提出问题：如何区分不同微藻细胞？' },
      { stepEn: 'Build polarization image database for different microalgae', stepZh: '建立不同微藻偏振图像数据' },
      { stepEn: 'Data analysis, train machine learning model', stepZh: '数据分析，机器学习训练模型' },
      { stepEn: 'Validate with real water samples, expand dataset and iterate model', stepZh: '真实水体验证，持续扩大样本数据量并迭代模型' },
      { stepEn: 'Establish stable model and output report', stepZh: '形成稳定模型并输出报告' }
    ],

    dataSourceEn: 'Real microalgae cell images captured using full-polarization microscopy from ongoing research. Microscopy images often contain overlapping cells, complex backgrounds, and other unfavorable phenomena — typical of real research data.',
    dataSourceZh: '来源于全偏振显微镜下拍摄的真实不同微藻细胞图像数据，来自正在进行的科研工作。显微图像中常存在微藻细胞聚集重叠、背景复杂干扰等不利现象——这是真实科研数据的典型特征。',

    methodsEn: [
      'K-Means clustering for polarization feature extraction',
      'Custom algorithms encouraged (students can propose alternative methods)',
      'Polarization superpixel analysis',
      'Mueller matrix decomposition'
    ],
    methodsZh: [
      'K-Means聚类进行偏振特征提取',
      '鼓励采用自定义算法（学生可提出替代方法）',
      '偏振超像素分析',
      '缪勒矩阵分解'
    ],

    expectedOutcomesEn: [
      'Polarization feature templates for target microalgae species',
      'Automated identification model with validation results',
      'Performance metrics on real water samples',
      'Research report with visualizations and statistical analysis'
    ],
    expectedOutcomesZh: [
      '目标微藻物种的偏振特征模版',
      '带验证结果的自动识别模型',
      '真实水样上的性能指标',
      '带可视化和统计分析的研究报告'
    ],

    difficulty: 'intermediate',
    status: 'active',
    estimatedWeeks: 6,
    tags: ['Environmental Monitoring', 'Mueller Microscopy', 'Machine Learning', 'Marine Biology', 'HAB Prevention'],
    category: 'environmental',

    supplementaryNote: {
      en: 'This project is not a fixed-answer teaching demo, but an ongoing real research project. Microscopy images often contain overlapping cells, complex backgrounds — these are typical features of real research data. There is no standard answer. Real research includes: continuously analyzing new experimental data, comparing different algorithms and analysis strategies, organizing results into reports or papers. Research is never about those who know the answer explaining it, but about those who don\'t know the answer exploring together. If you\'re willing to join this exploration, you\'re already part of this research group.',
      zh: '本虚拟课题组项目并非结论固定的教学演示实验，而是来源于正在进行的真实科研工作。显微图像中常存在微藻细胞聚集重叠、背景复杂干扰等不利现象，而这些正是真实科研数据的典型特征。本课题没有标准答案，在本虚拟课题组中，真实的研究工作包括：持续分析新的实验数据、比较不同算法和分析策略、把结果整理成报告或论文。科研从来不是知道答案的人在讲解，而是不知道答案的人在一起探索。如果你愿意参与这场探索，那么从现在开始，你已经是这个课题组的一部分了。'
    }
  }
]

// Utility functions
export function getChallengeById(id: string): ResearchChallenge | undefined {
  return RESEARCH_CHALLENGES.find(c => c.id === id)
}

export function getChallengesByCategory(category: ResearchChallenge['category']): ResearchChallenge[] {
  return RESEARCH_CHALLENGES.filter(c => c.category === category)
}

export function getChallengesByStatus(status: ResearchChallenge['status']): ResearchChallenge[] {
  return RESEARCH_CHALLENGES.filter(c => c.status === status)
}

export function getChallengesByDifficulty(difficulty: ResearchChallenge['difficulty']): ResearchChallenge[] {
  return RESEARCH_CHALLENGES.filter(c => c.difficulty === difficulty)
}
