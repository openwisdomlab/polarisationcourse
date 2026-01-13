/**
 * Exploration Nodes - 问题驱动的探索节点
 *
 * 设计理念：
 * - 保留课程大纲的5单元结构作为组织骨架
 * - 每个节点以问题或现象作为入口
 * - 渐进式披露内容，但不使用锁定机制
 * - 支持网状探索，多入口多出口
 *
 * 关键词：问题、动手、游戏、探索、有趣
 */

// import { PSRT_CURRICULUM } from './psrt-curriculum' // Reserved for future curriculum integration

// 探索节点数据结构
export interface ExplorationNode {
  id: string

  // 归属的课程单元（保留大纲结构）
  unitId: string
  sectionId?: string

  // 入口：问题、历史事件或生活现象
  entry: {
    type: 'question' | 'history' | 'phenomenon' | 'challenge'
    title: { en: string; zh: string }
    hook: { en: string; zh: string }  // 吸引好奇心的描述
    image?: string
    emoji?: string
    year?: number  // 历史事件年份
  }

  // 层次1：动手小实验（最先展示，用日常物品）
  experiment?: {
    title: { en: string; zh: string }
    materials: { en: string[]; zh: string[] }
    steps: { en: string[]; zh: string[] }
    expectedResult: { en: string; zh: string }
    safetyNote?: { en: string; zh: string }
    videoUrl?: string
    difficulty: 'easy' | 'medium' | 'advanced'
  }

  // 层次2：生活联系
  lifeConnections: {
    title: { en: string; zh: string }
    examples: { en: string[]; zh: string[] }
    image?: string
  }[]

  // 层次3：互动演示（从Demos引用）
  demos: string[]  // Demo IDs

  // 层次4：游戏挑战（从Games引用）
  games: {
    type: '2d' | '3d'
    levelId: number
    challenge: { en: string; zh: string }
  }[]

  // 层次5：光学设计任务（从OpticalStudio引用）
  designTasks: {
    experimentId: string
    goal: { en: string; zh: string }
  }[]

  // 层次6：深入内容（按难度分层，但都可访问）
  deepDive: {
    foundation: { en: string; zh: string }   // 简单解释
    application: { en: string; zh: string }  // 包含公式
    research: { en: string; zh: string }     // 完整理论
    formulas?: {
      latex: string
      description: { en: string; zh: string }
    }[]
  }

  // 历史故事（从Chronicles引用）
  historyStory?: {
    year: number
    track: 'optics' | 'polarization'
    teaser: { en: string; zh: string }
  }

  // 连接：相关问题（网状结构）
  relatedQuestions: {
    nodeId: string
    prompt: { en: string; zh: string }  // "这让你想到..."
  }[]

  // 元数据
  tags: string[]
  primaryDifficulty: 'foundation' | 'application' | 'research'
  estimatedTime: number  // 分钟
}

// 课程阶段定义（保留原有三阶段结构）
export interface LearningStage {
  id: string
  number: 1 | 2 | 3
  title: { en: string; zh: string }
  subtitle: { en: string; zh: string }
  description: { en: string; zh: string }
  color: string
  icon: string
  unitIds: string[]
  keyQuestion: { en: string; zh: string }
}

export const LEARNING_STAGES: LearningStage[] = [
  {
    id: 'stage1',
    number: 1,
    title: { en: 'Seeing Polarization', zh: '看见偏振' },
    subtitle: { en: 'Discover the Hidden World', zh: '发现隐藏的世界' },
    description: {
      en: 'Start with curiosity - observe polarization phenomena in daily life, do simple experiments with everyday items.',
      zh: '从好奇心出发 - 观察日常生活中的偏振现象，用日常物品做简单实验。'
    },
    color: '#22c55e',
    icon: '👁️',
    unitIds: ['unit1'],
    keyQuestion: {
      en: 'What makes sunglasses reduce glare? Why does your phone screen go dark when you tilt it?',
      zh: '太阳镜为什么能减少眩光？为什么手机屏幕倾斜时会变暗？'
    }
  },
  {
    id: 'stage2',
    number: 2,
    title: { en: 'Understanding Laws', zh: '理解规律' },
    subtitle: { en: 'From Observation to Measurement', zh: '从观察到测量' },
    description: {
      en: 'Move from qualitative observation to quantitative understanding - learn the formulas, design experiments, measure precisely.',
      zh: '从定性观察到定量理解 - 学习公式，设计实验，精确测量。'
    },
    color: '#06b6d4',
    icon: '📐',
    unitIds: ['unit2', 'unit3', 'unit4'],
    keyQuestion: {
      en: 'How much light passes through? Why do we see colors? What makes the sky blue?',
      zh: '有多少光能通过？为什么我们能看到颜色？天空为什么是蓝色的？'
    }
  },
  {
    id: 'stage3',
    number: 3,
    title: { en: 'Measurement & Applications', zh: '测量与应用' },
    subtitle: { en: 'Research Tools & Real-World Impact', zh: '研究工具与现实应用' },
    description: {
      en: 'Master the complete mathematical framework, apply to cutting-edge research and real-world problems.',
      zh: '掌握完整的数学框架，应用于前沿研究和实际问题。'
    },
    color: '#a855f7',
    icon: '🔬',
    unitIds: ['unit5'],
    keyQuestion: {
      en: 'How can we fully characterize any polarization state? What can polarization imaging reveal?',
      zh: '如何完整表征任意偏振态？偏振成像能揭示什么？'
    }
  }
]

// 首页问题卡片 - 作为探索入口
export interface QuestionEntry {
  id: string
  nodeId: string  // 链接到探索节点
  emoji: string
  question: { en: string; zh: string }
  teaser: { en: string; zh: string }
  stageId: string
  color: string
  popular?: boolean  // 热门问题
}

export const QUESTION_ENTRIES: QuestionEntry[] = [
  // 阶段1 问题
  {
    id: 'q-sunglasses',
    nodeId: 'malus-law',
    emoji: '🕶️',
    question: {
      en: 'Why do polarized sunglasses reduce glare?',
      zh: '偏光太阳镜为什么能减少眩光？'
    },
    teaser: {
      en: 'Try rotating your sunglasses in front of a phone screen...',
      zh: '试试在手机屏幕前旋转你的太阳镜...'
    },
    stageId: 'stage1',
    color: '#22c55e',
    popular: true
  },
  {
    id: 'q-double-image',
    nodeId: 'birefringence',
    emoji: '💎',
    question: {
      en: 'Why does this crystal show two images?',
      zh: '为什么这块晶体能看到两个像？'
    },
    teaser: {
      en: 'In 1669, a Danish scientist made a surprising discovery...',
      zh: '1669年，一位丹麦科学家有了惊人的发现...'
    },
    stageId: 'stage1',
    color: '#22c55e'
  },
  {
    id: 'q-3d-movie',
    nodeId: 'polarization-basics',
    emoji: '🎬',
    question: {
      en: 'How do 3D movies work?',
      zh: '3D电影是怎么工作的？'
    },
    teaser: {
      en: 'The secret is in those special glasses...',
      zh: '秘密就在那副特殊的眼镜里...'
    },
    stageId: 'stage1',
    color: '#22c55e',
    popular: true
  },

  // 阶段2 问题
  {
    id: 'q-blue-sky',
    nodeId: 'rayleigh-scattering',
    emoji: '🌅',
    question: {
      en: 'Why is the sky blue and sunsets red?',
      zh: '天空为什么是蓝色的，日落为什么是红色的？'
    },
    teaser: {
      en: 'It all has to do with tiny particles and wavelengths...',
      zh: '这都与微小颗粒和波长有关...'
    },
    stageId: 'stage2',
    color: '#06b6d4',
    popular: true
  },
  {
    id: 'q-stress-colors',
    nodeId: 'chromatic-polarization',
    emoji: '🌈',
    question: {
      en: 'Why do stressed plastics show rainbow colors?',
      zh: '为什么受力的塑料会显示彩虹色？'
    },
    teaser: {
      en: 'Engineers use this to find hidden cracks...',
      zh: '工程师用这个来发现隐藏的裂缝...'
    },
    stageId: 'stage2',
    color: '#06b6d4'
  },
  {
    id: 'q-sugar-rainbow',
    nodeId: 'optical-rotation',
    emoji: '🍯',
    question: {
      en: 'Can light measure sugar concentration?',
      zh: '光能测量糖的浓度吗？'
    },
    teaser: {
      en: 'Sugar molecules have a special twist...',
      zh: '糖分子有一个特殊的"扭转"...'
    },
    stageId: 'stage2',
    color: '#06b6d4'
  },
  {
    id: 'q-window-glare',
    nodeId: 'brewster-angle',
    emoji: '🪟',
    question: {
      en: 'Why do windows become mirrors at certain angles?',
      zh: '为什么窗户在某些角度会变成镜子？'
    },
    teaser: {
      en: 'A French engineer noticed something strange at a palace...',
      zh: '一位法国工程师在宫殿里注意到了奇怪的现象...'
    },
    stageId: 'stage2',
    color: '#06b6d4'
  },

  // 阶段3 问题
  {
    id: 'q-medical-imaging',
    nodeId: 'mueller-imaging',
    emoji: '🏥',
    question: {
      en: 'Can polarized light detect cancer?',
      zh: '偏振光能检测癌症吗？'
    },
    teaser: {
      en: 'Cutting-edge medical imaging uses polarization...',
      zh: '前沿医学成像使用偏振光...'
    },
    stageId: 'stage3',
    color: '#a855f7'
  },
  {
    id: 'q-self-driving',
    nodeId: 'polarimetric-sensing',
    emoji: '🚗',
    question: {
      en: 'How do self-driving cars see through fog?',
      zh: '自动驾驶汽车如何穿透雾霾看清路？'
    },
    teaser: {
      en: 'Polarization cameras reveal what normal cameras miss...',
      zh: '偏振相机能看到普通相机看不到的东西...'
    },
    stageId: 'stage3',
    color: '#a855f7'
  }
]

// ========================================
// 探索节点数据 - 基于课程大纲
// ========================================

export const EXPLORATION_NODES: ExplorationNode[] = [
  // ========================================
  // Unit 1: 光的偏振态及其调制和测量
  // ========================================
  {
    id: 'polarization-basics',
    unitId: 'unit1',
    sectionId: '1.1',
    entry: {
      type: 'question',
      title: { en: 'What is Polarized Light?', zh: '什么是偏振光？' },
      hook: {
        en: 'Light has a hidden property that our eyes can\'t see, but some animals can!',
        zh: '光有一种我们眼睛看不到的隐藏属性，但有些动物能看到！'
      },
      emoji: '🌊'
    },
    experiment: {
      title: { en: 'See the Hidden Direction', zh: '看见隐藏的方向' },
      materials: {
        en: ['Phone or tablet', 'Polarized sunglasses (or 3D glasses)'],
        zh: ['手机或平板', '偏光太阳镜（或3D眼镜）']
      },
      steps: {
        en: [
          'Look at your phone screen normally',
          'Put on the polarized sunglasses',
          'Slowly rotate the phone 90 degrees',
          'What happens to the screen?'
        ],
        zh: [
          '正常看你的手机屏幕',
          '戴上偏光太阳镜',
          '慢慢将手机旋转90度',
          '屏幕发生了什么变化？'
        ]
      },
      expectedResult: {
        en: 'The screen goes dark! LCD screens emit polarized light.',
        zh: '屏幕变黑了！液晶屏发出的是偏振光。'
      },
      difficulty: 'easy'
    },
    lifeConnections: [
      {
        title: { en: 'In Daily Life', zh: '日常生活中' },
        examples: {
          en: [
            'LCD screens (phones, TVs, monitors)',
            'Polarized sunglasses',
            '3D cinema glasses',
            'Car windshield coatings'
          ],
          zh: [
            '液晶屏（手机、电视、显示器）',
            '偏光太阳镜',
            '3D电影眼镜',
            '汽车挡风玻璃涂层'
          ]
        }
      },
      {
        title: { en: 'In Nature', zh: '在自然界' },
        examples: {
          en: [
            'Bees navigate using sky polarization',
            'Some fish detect polarized light',
            'Cuttlefish communicate with polarization'
          ],
          zh: [
            '蜜蜂利用天空偏振导航',
            '有些鱼能探测偏振光',
            '乌贼用偏振光交流'
          ]
        }
      }
    ],
    demos: ['polarization-intro', 'polarization-types-unified', 'em-wave'],
    games: [
      { type: '2d', levelId: 0, challenge: { en: 'Guide light to the sensor', zh: '引导光到传感器' } }
    ],
    designTasks: [],
    deepDive: {
      foundation: {
        en: 'Light is a wave that vibrates. Polarized light vibrates in only one direction, like shaking a rope up-and-down instead of randomly.',
        zh: '光是一种振动的波。偏振光只在一个方向振动，就像只上下抖动绳子，而不是随机抖动。'
      },
      application: {
        en: 'Light is an electromagnetic wave with electric field E oscillating perpendicular to propagation. Polarization describes the direction of E-field oscillation. For linearly polarized light, E always oscillates in the same plane.',
        zh: '光是电磁波，电场E垂直于传播方向振动。偏振描述E场振动的方向。对于线偏振光，E总是在同一平面内振动。'
      },
      research: {
        en: 'Polarization state can be fully described by Jones vectors (for fully polarized light) or Stokes vectors (for any polarization including partial). The electric field: E(z,t) = E₀ exp(i(kz - ωt + φ)), where the complex amplitude encodes polarization.',
        zh: '偏振态可以用Jones矢量（完全偏振光）或Stokes矢量（包括部分偏振的任意偏振）完整描述。电场：E(z,t) = E₀ exp(i(kz - ωt + φ))，其中复振幅编码偏振信息。'
      }
    },
    historyStory: {
      year: 1669,
      track: 'polarization',
      teaser: {
        en: 'A Danish professor discovered that Iceland spar shows two images...',
        zh: '一位丹麦教授发现冰洲石能显示两个像...'
      }
    },
    relatedQuestions: [
      { nodeId: 'malus-law', prompt: { en: 'What happens with two polarizers?', zh: '两个偏振片会怎样？' } },
      { nodeId: 'birefringence', prompt: { en: 'Why two images in a crystal?', zh: '为什么晶体里有两个像？' } }
    ],
    tags: ['polarization', 'light', 'basics', 'LCD'],
    primaryDifficulty: 'foundation',
    estimatedTime: 15
  },

  {
    id: 'malus-law',
    unitId: 'unit1',
    sectionId: '1.3',
    entry: {
      type: 'history',
      title: { en: 'Malus\'s Discovery', zh: '马吕斯的发现' },
      hook: {
        en: 'In 1808, a French engineer looked at a palace window through a crystal and changed physics forever...',
        zh: '1808年，一位法国工程师透过晶体看宫殿窗户，从此改变了物理学...'
      },
      emoji: '⚡',
      year: 1808
    },
    experiment: {
      title: { en: 'Polarizer Dance', zh: '偏振片之舞' },
      materials: {
        en: ['Two polarizers (or 3D glasses lenses)', 'Flashlight or phone light', 'Dark room (optional)'],
        zh: ['两片偏振片（或3D眼镜镜片）', '手电筒或手机闪光灯', '暗室（可选）']
      },
      steps: {
        en: [
          'Shine light through one polarizer - the light passes through',
          'Add a second polarizer behind the first',
          'Slowly rotate the second polarizer',
          'Find the angle where light is completely blocked',
          'Calculate: at 45°, how much light passes? (Hint: cos²45° = 0.5)'
        ],
        zh: [
          '让光穿过一片偏振片 - 光能通过',
          '在后面加上第二片偏振片',
          '慢慢旋转第二片偏振片',
          '找到光完全被挡住的角度',
          '计算：在45°时有多少光通过？（提示：cos²45° = 0.5）'
        ]
      },
      expectedResult: {
        en: 'At 90° (crossed polarizers), no light passes! At 45°, exactly half the intensity passes through.',
        zh: '在90°（正交偏振片）时，没有光通过！在45°时，正好一半的光强通过。'
      },
      difficulty: 'easy'
    },
    lifeConnections: [
      {
        title: { en: 'Photography', zh: '摄影' },
        examples: {
          en: [
            'Polarizing filters reduce reflections from water/glass',
            'Enhance sky contrast in landscape photos',
            'Cut through haze for clearer shots'
          ],
          zh: [
            '偏振滤镜减少水面/玻璃反射',
            '增强风景照片中的天空对比度',
            '穿透雾霾拍出更清晰的照片'
          ]
        }
      }
    ],
    demos: ['malus', 'optical-bench'],
    games: [
      { type: '2d', levelId: 1, challenge: { en: 'Make light intensity exactly 50%', zh: '让光强正好变成50%' } },
      { type: '2d', levelId: 2, challenge: { en: 'Use two polarizers to block light', zh: '用两个偏振片挡住光' } }
    ],
    designTasks: [
      { experimentId: 'malus-verification', goal: { en: 'Verify the cos² relationship', zh: '验证cos²关系' } }
    ],
    deepDive: {
      foundation: {
        en: 'When polarized light goes through another polarizer, the amount that passes depends on how aligned they are. Perpendicular = no light. Parallel = all light.',
        zh: '当偏振光通过另一个偏振片时，能通过的量取决于它们对齐的程度。垂直=没有光。平行=所有光。'
      },
      application: {
        en: 'Malus\'s Law: I = I₀ × cos²(θ), where θ is the angle between polarization direction and polarizer axis. At θ=45°, I=0.5×I₀. At θ=90°, I=0 (extinction).',
        zh: '马吕斯定律：I = I₀ × cos²(θ)，其中θ是偏振方向与偏振片轴之间的夹角。θ=45°时，I=0.5×I₀。θ=90°时，I=0（消光）。'
      },
      research: {
        en: 'Malus\'s Law emerges from Jones calculus: for a polarizer at angle θ, the Jones matrix is M = [[cos²θ, sinθcosθ], [sinθcosθ, sin²θ]]. The intensity follows from |E_out|² = |M·E_in|².',
        zh: '马吕斯定律来自Jones矩阵运算：对于角度θ的偏振片，Jones矩阵为M = [[cos²θ, sinθcosθ], [sinθcosθ, sin²θ]]。强度由|E_out|² = |M·E_in|²得出。'
      },
      formulas: [
        { latex: 'I = I_0 \\cos^2(\\theta)', description: { en: 'Malus\'s Law', zh: '马吕斯定律' } }
      ]
    },
    historyStory: {
      year: 1808,
      track: 'polarization',
      teaser: {
        en: 'Malus was looking at the Luxembourg Palace windows through Iceland spar when he noticed something extraordinary...',
        zh: '马吕斯透过冰洲石观察卢森堡宫的窗户时，注意到了非同寻常的现象...'
      }
    },
    relatedQuestions: [
      { nodeId: 'three-polarizers', prompt: { en: 'What if we add a third polarizer?', zh: '如果再加一个偏振片呢？' } },
      { nodeId: 'brewster-angle', prompt: { en: 'Why did window reflections show this?', zh: '为什么窗户反射会显示这个？' } }
    ],
    tags: ['malus', 'polarizer', 'intensity', 'cos²', 'measurement'],
    primaryDifficulty: 'application',
    estimatedTime: 20
  },

  {
    id: 'birefringence',
    unitId: 'unit1',
    sectionId: '1.2',
    entry: {
      type: 'phenomenon',
      title: { en: 'The Double Image Crystal', zh: '双像晶体' },
      hook: {
        en: 'Place this crystal on text and you\'ll see two copies. Rotate it and one copy orbits the other!',
        zh: '把这块晶体放在文字上，你会看到两份！旋转它，一份绕着另一份转！'
      },
      emoji: '💎'
    },
    experiment: {
      title: { en: 'Double Vision', zh: '双重视觉' },
      materials: {
        en: ['Calcite crystal (Iceland spar) OR clear tape layers', 'Text on paper', 'Polarizer'],
        zh: ['方解石晶体（冰洲石）或多层透明胶带', '纸上的文字', '偏振片']
      },
      steps: {
        en: [
          'Place crystal on text - see double image',
          'Rotate the crystal - one image rotates around the other',
          'Add polarizer on top and rotate it',
          'Watch: the two images take turns disappearing!'
        ],
        zh: [
          '把晶体放在文字上 - 看到双像',
          '旋转晶体 - 一个像绕着另一个转',
          '在上面放偏振片并旋转',
          '观察：两个像轮流消失！'
        ]
      },
      expectedResult: {
        en: 'The crystal splits light into two beams with perpendicular polarizations!',
        zh: '晶体把光分成两束偏振方向垂直的光！'
      },
      difficulty: 'medium'
    },
    lifeConnections: [
      {
        title: { en: 'Liquid Crystal Displays', zh: '液晶显示' },
        examples: {
          en: [
            'LCD screens use electrically controlled birefringence',
            'Each pixel acts like a tiny rotating crystal'
          ],
          zh: [
            'LCD屏幕使用电控双折射',
            '每个像素就像一个微小的旋转晶体'
          ]
        }
      }
    ],
    demos: ['birefringence', 'polarization-state'],
    games: [
      { type: '2d', levelId: 5, challenge: { en: 'Use a splitter to send light two ways', zh: '用分束器把光送往两个方向' } }
    ],
    designTasks: [],
    deepDive: {
      foundation: {
        en: 'Some crystals have different \"speeds\" for light vibrating in different directions. This splits light into two beams, like a fork in the road.',
        zh: '有些晶体对不同方向振动的光有不同的"速度"。这会把光分成两束，就像岔路口。'
      },
      application: {
        en: 'Birefringence: Δn = |ne - no|. For calcite: no = 1.6584, ne = 1.4864, Δn = 0.172 (largest known). The o-ray follows Snell\'s law; the e-ray does not.',
        zh: '双折射率：Δn = |ne - no|。对于方解石：no = 1.6584, ne = 1.4864, Δn = 0.172（已知最大）。寻常光遵循斯涅尔定律；非寻常光不遵循。'
      },
      research: {
        en: 'The refractive index ellipsoid describes the direction-dependent refractive index: ne(θ) = neno/√(no²cos²θ + ne²sin²θ). The optic axis is the direction where both rays travel at the same speed.',
        zh: '折射率椭球描述方向依赖的折射率：ne(θ) = neno/√(no²cos²θ + ne²sin²θ)。光轴是两束光速度相同的方向。'
      }
    },
    historyStory: {
      year: 1669,
      track: 'polarization',
      teaser: {
        en: 'Bartholin placed Iceland spar on text and saw double - a mystery that took 140 years to explain.',
        zh: '巴多林把冰洲石放在文字上看到了双像 - 一个花了140年才解开的谜。'
      }
    },
    relatedQuestions: [
      { nodeId: 'chromatic-polarization', prompt: { en: 'Why do some materials show colors?', zh: '为什么有些材料会显示颜色？' } },
      { nodeId: 'waveplate', prompt: { en: 'Can we control this splitting?', zh: '我们能控制这种分裂吗？' } }
    ],
    tags: ['birefringence', 'calcite', 'crystal', 'double-refraction'],
    primaryDifficulty: 'application',
    estimatedTime: 25
  },

  // ========================================
  // Unit 2: 界面反射的偏振特征
  // ========================================
  {
    id: 'brewster-angle',
    unitId: 'unit2',
    sectionId: '2.2',
    entry: {
      type: 'question',
      title: { en: 'The Magic Angle', zh: '神奇的角度' },
      hook: {
        en: 'There\'s a special angle where glass reflects only one type of polarization - photographers use it every day!',
        zh: '有一个特殊角度，玻璃只反射一种偏振 - 摄影师每天都在用它！'
      },
      emoji: '📐'
    },
    experiment: {
      title: { en: 'Find the Brewster Angle', zh: '找到布儒斯特角' },
      materials: {
        en: ['Flat glass plate (or phone screen)', 'Laser pointer or bright flashlight', 'Polarizer', 'Dark room'],
        zh: ['平板玻璃（或手机屏幕）', '激光笔或明亮的手电筒', '偏振片', '暗室']
      },
      steps: {
        en: [
          'Shine light at glass at different angles',
          'Observe reflection intensity through polarizer',
          'Find the angle where reflection almost disappears (when polarizer is oriented correctly)',
          'For glass: this is around 56°'
        ],
        zh: [
          '以不同角度照射玻璃',
          '通过偏振片观察反射强度',
          '找到反射几乎消失的角度（偏振片方向正确时）',
          '对于玻璃：大约是56°'
        ]
      },
      expectedResult: {
        en: 'At Brewster\'s angle, reflected light is completely polarized!',
        zh: '在布儒斯特角，反射光完全偏振了！'
      },
      difficulty: 'medium'
    },
    lifeConnections: [
      {
        title: { en: 'Anti-Glare Applications', zh: '防眩光应用' },
        examples: {
          en: [
            'Polarized sunglasses cut water/road glare',
            'Camera polarizing filters',
            'Laser window design'
          ],
          zh: [
            '偏光太阳镜减少水面/路面眩光',
            '相机偏振滤镜',
            '激光窗口设计'
          ]
        }
      }
    ],
    demos: ['brewster', 'fresnel'],
    games: [],
    designTasks: [
      { experimentId: 'brewster-measurement', goal: { en: 'Measure Brewster angles for different materials', zh: '测量不同材料的布儒斯特角' } }
    ],
    deepDive: {
      foundation: {
        en: 'When light bounces off glass at the right angle, all the reflected light vibrates in one direction. This is the Brewster angle.',
        zh: '当光以正确的角度从玻璃反射时，所有反射光都在一个方向振动。这就是布儒斯特角。'
      },
      application: {
        en: 'tan(θB) = n₂/n₁. For air-glass (n=1.5): θB = arctan(1.5) ≈ 56.3°. At this angle, p-polarized reflection is zero, reflected light is pure s-polarization.',
        zh: 'tan(θB) = n₂/n₁。对于空气-玻璃（n=1.5）：θB = arctan(1.5) ≈ 56.3°。在此角度，p偏振反射为零，反射光是纯s偏振。'
      },
      research: {
        en: 'Brewster\'s angle occurs when reflected and refracted rays are perpendicular: θB + θt = 90°. From Snell\'s law: n₁sinθB = n₂cosθB, giving tanθB = n₂/n₁. The Fresnel coefficient rp = 0 at this angle.',
        zh: '布儒斯特角发生在反射光和折射光垂直时：θB + θt = 90°。由斯涅尔定律：n₁sinθB = n₂cosθB，得tanθB = n₂/n₁。此角度菲涅尔系数rp = 0。'
      },
      formulas: [
        { latex: '\\tan(\\theta_B) = \\frac{n_2}{n_1}', description: { en: 'Brewster\'s Law', zh: '布儒斯特定律' } }
      ]
    },
    historyStory: {
      year: 1812,
      track: 'polarization',
      teaser: {
        en: 'David Brewster discovered that reflected light has a special property at a particular angle...',
        zh: '大卫·布儒斯特发现反射光在特定角度有特殊性质...'
      }
    },
    relatedQuestions: [
      { nodeId: 'malus-law', prompt: { en: 'How did Malus use this?', zh: '马吕斯如何利用这个？' } },
      { nodeId: 'fresnel-equations', prompt: { en: 'What\'s the full formula?', zh: '完整公式是什么？' } }
    ],
    tags: ['brewster', 'reflection', 'angle', 'photography'],
    primaryDifficulty: 'application',
    estimatedTime: 25
  },

  // ========================================
  // Unit 3: 透明介质的偏振特征
  // ========================================
  {
    id: 'chromatic-polarization',
    unitId: 'unit3',
    sectionId: '3.1',
    entry: {
      type: 'phenomenon',
      title: { en: 'Rainbow Colors from Clear Plastic', zh: '透明塑料的彩虹色' },
      hook: {
        en: 'Put clear tape between polarizers and magical colors appear! Engineers use this to find hidden stress.',
        zh: '把透明胶带放在偏振片之间，神奇的颜色出现了！工程师用这个来发现隐藏的应力。'
      },
      emoji: '🌈'
    },
    experiment: {
      title: { en: 'Tape Art', zh: '胶带艺术' },
      materials: {
        en: ['Two polarizers (or 3D glasses)', 'Clear tape', 'Clear plastic items (rulers, bags)', 'Computer screen (as polarized light source)'],
        zh: ['两片偏振片（或3D眼镜）', '透明胶带', '透明塑料物品（尺子、塑料袋）', '电脑屏幕（作为偏振光源）']
      },
      steps: {
        en: [
          'Set computer screen to white',
          'Hold polarizer in front of screen',
          'Put layers of tape at different angles between screen and polarizer',
          'Rotate the polarizer - watch colors change!',
          'Try stretching plastic wrap - colors shift with stress!'
        ],
        zh: [
          '将电脑屏幕设置为白色',
          '在屏幕前举起偏振片',
          '在屏幕和偏振片之间以不同角度贴多层胶带',
          '旋转偏振片 - 看颜色变化！',
          '试着拉伸保鲜膜 - 颜色随应力变化！'
        ]
      },
      expectedResult: {
        en: 'Beautiful stained-glass colors appear! Different thicknesses show different colors.',
        zh: '美丽的彩色玻璃般的颜色出现了！不同厚度显示不同颜色。'
      },
      difficulty: 'easy'
    },
    lifeConnections: [
      {
        title: { en: 'Engineering', zh: '工程应用' },
        examples: {
          en: [
            'Stress analysis in plastic parts',
            'Quality control in tempered glass',
            'Finding invisible cracks',
            'Studying material strain'
          ],
          zh: [
            '塑料零件的应力分析',
            '钢化玻璃的质量控制',
            '发现隐形裂缝',
            '研究材料应变'
          ]
        }
      }
    ],
    demos: ['chromatic', 'anisotropy'],
    games: [],
    designTasks: [],
    deepDive: {
      foundation: {
        en: 'When stress makes plastic \"uneven\", different colors of light take different paths. The colors you see depend on the stress and thickness.',
        zh: '当应力使塑料变得"不均匀"时，不同颜色的光走不同的路径。你看到的颜色取决于应力和厚度。'
      },
      application: {
        en: 'Stress introduces birefringence: Δn ∝ stress. Phase difference δ = 2πΔnd/λ. When δ = 2π for one wavelength, that color is extinguished - other colors appear.',
        zh: '应力引入双折射：Δn ∝ 应力。相位差δ = 2πΔnd/λ。当某波长δ = 2π时，该颜色消失 - 其他颜色显现。'
      },
      research: {
        en: 'The intensity between crossed polarizers: I = I₀sin²(2θ)sin²(δ/2), where θ is the optic axis angle and δ = 2πΔnd/λ. Michel-Lévy charts relate colors to retardation and birefringence.',
        zh: '正交偏振片间强度：I = I₀sin²(2θ)sin²(δ/2)，其中θ是光轴角度，δ = 2πΔnd/λ。Michel-Lévy图将颜色与延迟和双折射联系起来。'
      }
    },
    historyStory: {
      year: 1811,
      track: 'polarization',
      teaser: {
        en: 'Arago discovered that certain crystals display vivid colors when viewed through polarizers...',
        zh: '阿拉戈发现某些晶体通过偏振片观察时会显示鲜艳的颜色...'
      }
    },
    relatedQuestions: [
      { nodeId: 'optical-rotation', prompt: { en: 'What about sugar solutions?', zh: '糖溶液呢？' } },
      { nodeId: 'birefringence', prompt: { en: 'Why do crystals split light?', zh: '为什么晶体会分光？' } }
    ],
    tags: ['chromatic', 'stress', 'colors', 'birefringence', 'art'],
    primaryDifficulty: 'foundation',
    estimatedTime: 20
  },

  {
    id: 'optical-rotation',
    unitId: 'unit3',
    sectionId: '3.2',
    entry: {
      type: 'question',
      title: { en: 'Can Light Measure Sugar?', zh: '光能测量糖吗？' },
      hook: {
        en: 'Sugar molecules twist light! Scientists measure concentration by measuring the twist angle.',
        zh: '糖分子会扭转光！科学家通过测量扭转角度来测量浓度。'
      },
      emoji: '🍯'
    },
    experiment: {
      title: { en: 'Sugar Rainbow', zh: '糖水彩虹' },
      materials: {
        en: ['Computer screen (white)', 'Glass jar with concentrated sugar water', 'Polarizer', 'Dark room helps'],
        zh: ['电脑屏幕（白色）', '装浓糖水的玻璃瓶', '偏振片', '暗室更好']
      },
      steps: {
        en: [
          'Set screen to white',
          'Place sugar water jar in front of screen',
          'Look through polarizer at the jar',
          'Rotate the polarizer slowly',
          'See rainbow colors appear at different heights!'
        ],
        zh: [
          '屏幕设为白色',
          '把糖水瓶放在屏幕前',
          '通过偏振片看瓶子',
          '慢慢旋转偏振片',
          '看到不同高度出现彩虹色！'
        ]
      },
      expectedResult: {
        en: 'The sugar water shows beautiful rainbow spirals! More sugar = more rotation.',
        zh: '糖水显示出美丽的彩虹螺旋！糖越多=旋转越多。'
      },
      difficulty: 'easy'
    },
    lifeConnections: [
      {
        title: { en: 'Industry', zh: '工业应用' },
        examples: {
          en: [
            'Sugar concentration measurement (saccharimeters)',
            'Drug purity testing',
            'Food quality control',
            'Chemical identification'
          ],
          zh: [
            '糖浓度测量（糖度计）',
            '药物纯度检测',
            '食品质量控制',
            '化学物质鉴定'
          ]
        }
      }
    ],
    demos: ['optical-rotation'],
    games: [],
    designTasks: [],
    deepDive: {
      foundation: {
        en: 'Sugar molecules are \"handed\" - like left and right gloves. They twist polarized light as it passes through. More sugar = more twist.',
        zh: '糖分子是"手性"的 - 像左右手套。偏振光通过时会被扭转。糖越多=扭转越多。'
      },
      application: {
        en: 'Specific rotation [α] = α/(l·c), where α is measured rotation, l is path length, c is concentration. For sucrose: [α]D²⁰ = +66.5°. Different wavelengths rotate by different amounts.',
        zh: '比旋光度[α] = α/(l·c)，其中α是测量的旋转角，l是路径长度，c是浓度。对于蔗糖：[α]D²⁰ = +66.5°。不同波长旋转角度不同。'
      },
      research: {
        en: 'Optical rotation arises from circular birefringence: nL ≠ nR for left and right circularly polarized light. The rotation angle α = (π/λ)(nL - nR)l. Faraday effect: magnetic field induces rotation in any medium.',
        zh: '旋光来自圆双折射：左旋和右旋圆偏振光的折射率nL ≠ nR。旋转角α = (π/λ)(nL - nR)l。法拉第效应：磁场可以在任何介质中诱导旋转。'
      },
      formulas: [
        { latex: '\\alpha = [\\alpha]_\\lambda^T \\cdot l \\cdot c', description: { en: 'Optical rotation formula', zh: '旋光公式' } }
      ]
    },
    historyStory: {
      year: 1815,
      track: 'polarization',
      teaser: {
        en: 'Biot discovered that some liquids rotate the plane of polarization...',
        zh: '毕奥发现某些液体会旋转偏振面...'
      }
    },
    relatedQuestions: [
      { nodeId: 'chromatic-polarization', prompt: { en: 'Why the rainbow colors?', zh: '为什么有彩虹色？' } },
      { nodeId: 'malus-law', prompt: { en: 'How to measure the rotation?', zh: '如何测量旋转？' } }
    ],
    tags: ['rotation', 'sugar', 'chirality', 'measurement'],
    primaryDifficulty: 'application',
    estimatedTime: 25
  },

  // ========================================
  // Unit 4: 浑浊介质的偏振特征
  // ========================================
  {
    id: 'rayleigh-scattering',
    unitId: 'unit4',
    sectionId: '4.1',
    entry: {
      type: 'question',
      title: { en: 'Why is the Sky Blue?', zh: '天空为什么是蓝色的？' },
      hook: {
        en: 'The answer involves tiny particles and a powerful law: intensity depends on wavelength to the fourth power!',
        zh: '答案涉及微小颗粒和一个强大的定律：强度与波长的四次方成反比！'
      },
      emoji: '🌅'
    },
    experiment: {
      title: { en: 'Blue Sky in a Glass', zh: '杯中蓝天' },
      materials: {
        en: ['Clear glass or jar', 'Water', 'Few drops of milk', 'Flashlight', 'Polarizer'],
        zh: ['透明玻璃杯或瓶子', '水', '几滴牛奶', '手电筒', '偏振片']
      },
      steps: {
        en: [
          'Fill glass with water, add 2-3 drops of milk, mix well',
          'Shine flashlight from one side',
          'Look at the scattered light from the top - blue!',
          'Look through the solution at the flashlight - orange/red!',
          'View through polarizer from 90° to the beam - highly polarized!'
        ],
        zh: [
          '玻璃杯装水，加2-3滴牛奶，搅匀',
          '从一侧照射手电筒',
          '从上方看散射光 - 蓝色！',
          '透过溶液看手电筒 - 橙/红色！',
          '从与光束成90°的方向用偏振片观察 - 高度偏振！'
        ]
      },
      expectedResult: {
        en: 'You made a sunset in a glass! Blue scatters more, red passes through. At 90°, scattered light is polarized!',
        zh: '你在杯中制造了日落！蓝光散射更多，红光穿透。在90°处，散射光是偏振的！'
      },
      difficulty: 'easy'
    },
    lifeConnections: [
      {
        title: { en: 'Natural Phenomena', zh: '自然现象' },
        examples: {
          en: [
            'Blue sky (small particles scatter blue)',
            'Red/orange sunset (blue scattered away)',
            'White clouds (large droplets scatter all colors)',
            'Polarization of sky light'
          ],
          zh: [
            '蓝天（小颗粒散射蓝光）',
            '红/橙色日落（蓝光被散射掉）',
            '白云（大水滴散射所有颜色）',
            '天空光的偏振'
          ]
        }
      }
    ],
    demos: ['rayleigh', 'mie-scattering'],
    games: [],
    designTasks: [],
    deepDive: {
      foundation: {
        en: 'Tiny particles scatter short wavelengths (blue) much more than long wavelengths (red). That\'s why the sky is blue - we see scattered sunlight!',
        zh: '微小颗粒对短波长（蓝光）的散射远多于长波长（红光）。这就是天空是蓝色的原因 - 我们看到的是散射的阳光！'
      },
      application: {
        en: 'Rayleigh scattering: I ∝ 1/λ⁴. Blue light (400nm) scatters (700/400)⁴ ≈ 9× more than red light (700nm). At 90° scattering angle, light is linearly polarized.',
        zh: '瑞利散射：I ∝ 1/λ⁴。蓝光（400nm）比红光（700nm）散射强(700/400)⁴ ≈ 9倍。在90°散射角，光是线偏振的。'
      },
      research: {
        en: 'Rayleigh scattering applies when particle diameter d << λ. The scattered intensity: I = I₀(8π⁴α²/λ⁴r²)(1+cos²θ)/2, where α is polarizability. For larger particles (d ~ λ), Mie theory applies.',
        zh: '瑞利散射适用于颗粒直径d << λ。散射强度：I = I₀(8π⁴α²/λ⁴r²)(1+cos²θ)/2，其中α是极化率。对于较大颗粒（d ~ λ），适用Mie理论。'
      },
      formulas: [
        { latex: 'I \\propto \\frac{1}{\\lambda^4}', description: { en: 'Rayleigh scattering law', zh: '瑞利散射定律' } }
      ]
    },
    historyStory: {
      year: 1871,
      track: 'polarization',
      teaser: {
        en: 'Lord Rayleigh finally explained why the sky is blue and sunsets are red...',
        zh: '瑞利勋爵终于解释了为什么天空是蓝色的，日落是红色的...'
      }
    },
    relatedQuestions: [
      { nodeId: 'mie-scattering', prompt: { en: 'Why are clouds white?', zh: '云为什么是白色的？' } },
      { nodeId: 'polarization-basics', prompt: { en: 'Why is scattered light polarized?', zh: '为什么散射光是偏振的？' } }
    ],
    tags: ['scattering', 'rayleigh', 'sky', 'blue', 'sunset'],
    primaryDifficulty: 'foundation',
    estimatedTime: 20
  },

  // ========================================
  // Unit 5: 全偏振光学技术
  // ========================================
  {
    id: 'stokes-vectors',
    unitId: 'unit5',
    sectionId: '5.1',
    entry: {
      type: 'question',
      title: { en: 'How to Describe Any Polarization?', zh: '如何描述任意偏振？' },
      hook: {
        en: 'Just 4 numbers can describe any polarization state - even partially polarized light!',
        zh: '只用4个数字就能描述任意偏振态 - 甚至部分偏振光！'
      },
      emoji: '📊'
    },
    experiment: {
      title: { en: 'Measure Stokes Parameters', zh: '测量斯托克斯参数' },
      materials: {
        en: ['Polarizer', 'Quarter-wave plate (if available)', 'Light meter or camera', 'Various light sources'],
        zh: ['偏振片', '四分之一波片（如果有）', '光度计或相机', '各种光源']
      },
      steps: {
        en: [
          'Measure total intensity I₀ (no polarizer)',
          'Measure with horizontal polarizer IH',
          'Measure with vertical polarizer IV',
          'Calculate S₁ = IH - IV',
          'S₀ = IH + IV (should equal I₀)'
        ],
        zh: [
          '测量总强度I₀（无偏振片）',
          '用水平偏振片测量IH',
          '用垂直偏振片测量IV',
          '计算S₁ = IH - IV',
          'S₀ = IH + IV（应等于I₀）'
        ]
      },
      expectedResult: {
        en: 'For unpolarized light: S₁ ≈ 0. For horizontal polarized: S₁ = S₀.',
        zh: '对于非偏振光：S₁ ≈ 0。对于水平偏振：S₁ = S₀。'
      },
      difficulty: 'advanced'
    },
    lifeConnections: [
      {
        title: { en: 'Research Applications', zh: '研究应用' },
        examples: {
          en: [
            'Atmospheric remote sensing',
            'Medical tissue imaging',
            'Material characterization',
            'Astronomical polarimetry'
          ],
          zh: [
            '大气遥感',
            '医学组织成像',
            '材料表征',
            '天文偏振测量'
          ]
        }
      }
    ],
    demos: ['stokes', 'calculator'],
    games: [],
    designTasks: [],
    deepDive: {
      foundation: {
        en: 'Stokes vector has 4 components: S₀ (total brightness), S₁ (horizontal vs vertical), S₂ (diagonal vs anti-diagonal), S₃ (right vs left circular).',
        zh: 'Stokes矢量有4个分量：S₀（总亮度），S₁（水平vs垂直），S₂（对角vs反对角），S₃（右旋vs左旋圆偏振）。'
      },
      application: {
        en: 'S = [S₀, S₁, S₂, S₃]ᵀ where: S₀ = I_total, S₁ = I_H - I_V, S₂ = I_45 - I_-45, S₃ = I_R - I_L. Degree of polarization: DOP = √(S₁² + S₂² + S₃²)/S₀.',
        zh: 'S = [S₀, S₁, S₂, S₃]ᵀ 其中：S₀ = I_总, S₁ = I_H - I_V, S₂ = I_45 - I_-45, S₃ = I_R - I_L。偏振度：DOP = √(S₁² + S₂² + S₃²)/S₀。'
      },
      research: {
        en: 'Stokes vectors can represent any polarization state including partially polarized light. The Poincaré sphere visualizes fully polarized states. Mueller matrices (4×4) transform Stokes vectors: S\' = M·S.',
        zh: 'Stokes矢量可以表示任意偏振态，包括部分偏振光。庞加莱球可视化完全偏振态。Mueller矩阵（4×4）变换Stokes矢量：S\' = M·S。'
      },
      formulas: [
        {
          latex: '\\mathbf{S} = \\begin{pmatrix} S_0 \\\\ S_1 \\\\ S_2 \\\\ S_3 \\end{pmatrix}',
          description: { en: 'Stokes vector', zh: 'Stokes矢量' }
        }
      ]
    },
    historyStory: {
      year: 1852,
      track: 'polarization',
      teaser: {
        en: 'George Stokes introduced a way to describe any polarization with just 4 numbers...',
        zh: '乔治·斯托克斯引入了一种只用4个数字描述任意偏振的方法...'
      }
    },
    relatedQuestions: [
      { nodeId: 'mueller-imaging', prompt: { en: 'How do we transform polarization?', zh: '如何变换偏振？' } },
      { nodeId: 'poincare-sphere', prompt: { en: 'Can we visualize this?', zh: '能可视化吗？' } }
    ],
    tags: ['stokes', 'polarimetry', 'measurement', 'advanced'],
    primaryDifficulty: 'research',
    estimatedTime: 30
  },

  {
    id: 'mueller-imaging',
    unitId: 'unit5',
    sectionId: '5.3',
    entry: {
      type: 'question',
      title: { en: 'Can Polarization Detect Cancer?', zh: '偏振能检测癌症吗？' },
      hook: {
        en: 'Mueller matrix imaging reveals hidden structure in tissues that X-rays can\'t see!',
        zh: 'Mueller矩阵成像能揭示X射线看不到的组织隐藏结构！'
      },
      emoji: '🏥'
    },
    experiment: {
      title: { en: 'Explore Mueller Matrices', zh: '探索Mueller矩阵' },
      materials: {
        en: ['Computer with Mueller calculator', 'Knowledge of Stokes vectors'],
        zh: ['带Mueller计算器的电脑', '了解Stokes矢量']
      },
      steps: {
        en: [
          'Go to /calc/mueller on the platform',
          'Input a horizontal polarized Stokes vector',
          'Apply a polarizer Mueller matrix',
          'Observe how the output Stokes vector changes',
          'Try a quarter-wave plate matrix'
        ],
        zh: [
          '在平台上访问 /calc/mueller',
          '输入水平偏振的Stokes矢量',
          '应用偏振片Mueller矩阵',
          '观察输出Stokes矢量如何变化',
          '尝试四分之一波片矩阵'
        ]
      },
      expectedResult: {
        en: 'Mueller matrices transform polarization states - 16 numbers encode everything about an optical element!',
        zh: 'Mueller矩阵变换偏振态 - 16个数字编码光学元件的所有信息！'
      },
      difficulty: 'advanced'
    },
    lifeConnections: [
      {
        title: { en: 'Medical Applications', zh: '医学应用' },
        examples: {
          en: [
            'Early cancer detection',
            'Tissue structure analysis',
            'Wound healing monitoring',
            'Eye disease diagnosis'
          ],
          zh: [
            '早期癌症检测',
            '组织结构分析',
            '伤口愈合监测',
            '眼病诊断'
          ]
        }
      }
    ],
    demos: ['mueller', 'polarimetric-microscopy'],
    games: [],
    designTasks: [],
    deepDive: {
      foundation: {
        en: 'A Mueller matrix is a 4×4 grid of numbers that describes how any optical element changes polarization. Input a Stokes vector, multiply by the matrix, get the output.',
        zh: 'Mueller矩阵是一个4×4的数字网格，描述任何光学元件如何改变偏振。输入Stokes矢量，乘以矩阵，得到输出。'
      },
      application: {
        en: 'S\' = M·S where M is the 4×4 Mueller matrix. Mueller matrices can be decomposed into diattenuation, retardance, and depolarization components. 16 measurements needed for full characterization.',
        zh: 'S\' = M·S 其中M是4×4 Mueller矩阵。Mueller矩阵可分解为二向色性、延迟和退偏振分量。完整表征需要16次测量。'
      },
      research: {
        en: 'Lu-Chipman decomposition: M = MΔ·MR·MD separates depolarization, retardance, and diattenuation. Imaging systems use PSG/PSA (Polarization State Generator/Analyzer) to measure all 16 elements per pixel.',
        zh: 'Lu-Chipman分解：M = MΔ·MR·MD 分离退偏振、延迟和二向色性。成像系统使用PSG/PSA（偏振态发生器/分析器）测量每个像素的16个元素。'
      },
      formulas: [
        { latex: '\\mathbf{S\'} = \\mathbf{M} \\cdot \\mathbf{S}', description: { en: 'Mueller matrix transformation', zh: 'Mueller矩阵变换' } }
      ]
    },
    historyStory: {
      year: 1943,
      track: 'polarization',
      teaser: {
        en: 'Hans Mueller developed a matrix formalism that would later revolutionize medical imaging...',
        zh: '汉斯·穆勒发展了一种矩阵形式，后来革新了医学成像...'
      }
    },
    relatedQuestions: [
      { nodeId: 'stokes-vectors', prompt: { en: 'What are Stokes vectors?', zh: '什么是Stokes矢量？' } },
      { nodeId: 'polarimetric-sensing', prompt: { en: 'What else can this detect?', zh: '还能检测什么？' } }
    ],
    tags: ['mueller', 'imaging', 'medical', 'research'],
    primaryDifficulty: 'research',
    estimatedTime: 35
  }
]

// ========================================
// 辅助函数
// ========================================

/**
 * 获取指定单元的所有探索节点
 */
export function getNodesForUnit(unitId: string): ExplorationNode[] {
  return EXPLORATION_NODES.filter(node => node.unitId === unitId)
}

/**
 * 获取指定阶段的所有探索节点
 */
export function getNodesForStage(stageId: string): ExplorationNode[] {
  const stage = LEARNING_STAGES.find(s => s.id === stageId)
  if (!stage) return []
  return EXPLORATION_NODES.filter(node => stage.unitIds.includes(node.unitId))
}

/**
 * 获取与指定节点相关的节点（网状导航）
 */
export function getRelatedNodes(nodeId: string): ExplorationNode[] {
  const node = EXPLORATION_NODES.find(n => n.id === nodeId)
  if (!node) return []
  const relatedIds = node.relatedQuestions.map(q => q.nodeId)
  return EXPLORATION_NODES.filter(n => relatedIds.includes(n.id))
}

/**
 * 根据问题入口获取节点
 */
export function getNodeByQuestionEntry(questionId: string): ExplorationNode | undefined {
  const entry = QUESTION_ENTRIES.find(q => q.id === questionId)
  if (!entry) return undefined
  return EXPLORATION_NODES.find(n => n.id === entry.nodeId)
}

/**
 * 获取指定难度的节点
 */
export function getNodesByDifficulty(difficulty: 'foundation' | 'application' | 'research'): ExplorationNode[] {
  return EXPLORATION_NODES.filter(node => node.primaryDifficulty === difficulty)
}

/**
 * 获取随机探索推荐
 */
export function getRandomExplorations(count: number = 3): ExplorationNode[] {
  const shuffled = [...EXPLORATION_NODES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
