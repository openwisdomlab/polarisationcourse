# PolarCraft - 偏振光创意平台

---

[English](#english) | [中文](#中文) | [How to contribute code](#代码文档)

---

## English

> Explore the Hidden Geometry of Light

A comprehensive educational platform that transforms the invisible world of polarized light into interactive experiences. Through games, simulations, design tools, and research modules, discover the science behind 3D movies, LCD screens, and optical instruments.

### Features

**6 Creative Modules:**

- **Chronicles of Light** - Journey through the history of polarization discoveries
- **Optical Design Studio** - Device library (80+ components) + interactive light path designer
- **Polarization Demo Gallery** - 21 interactive physics demonstrations across 6 units
- **PolarQuest Game Hub** - 2D puzzles, 3D voxel games, card battles, escape rooms, and detective mysteries
- **Creative Workshop** - Polarization art, photography, and DIY experiments
- **Virtual Lab Group** - Research tasks, applications database, and calculation tools

**Core Capabilities:**

- **Real Physics Engine** - Malus's Law, birefringence, wave interference, Jones/Mueller calculus
- **Calculation Workshop** - Jones, Stokes, Mueller calculators + Poincaré sphere viewer
- **Multiple Game Modes** - 2D puzzles (11 levels), 3D voxel (5 tutorials), card game, escape room, detective game
- **3-Tier Difficulty System** - Foundation, Application, and Research content levels
- **Interactive Simulations** - Real-time light propagation with polarization visualization
- **Bilingual Support** - Full English and Chinese interface
- **Dark/Light Theme** - Comfortable viewing in any environment

### Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19 + TypeScript (strict mode) |
| 3D Rendering | React Three Fiber + Three.js + drei |
| 2D Animations | Framer Motion |
| State Management | Zustand with subscribeWithSelector |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| i18n | i18next with language detection |
| Build | Vite |

### Quick Start

```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```

### Application Routes

#### Core Modules

| Route | Module | Description |
|-------|--------|-------------|
| `/` | Home | Landing page with 6 creative module navigation |
| `/chronicles` | Chronicles of Light | History of polarization discoveries |
| `/optical-studio` | Optical Design Studio | Device library + light path designer |
| `/demos` | Demo Gallery | 21 interactive physics demonstrations |
| `/games` | PolarQuest Hub | Game center with multiple modes |
| `/creative` | Creative Workshop | Art, photography, and DIY projects |
| `/lab` | Virtual Lab Group | Research tasks and community |

#### Games (PolarQuest)

| Route | Description |
|-------|-------------|
| `/games` | Game hub with all modes |
| `/games/2d` | 2D puzzle mode (11 levels, 4 difficulties) |
| `/games/3d` | 3D voxel puzzle (5 tutorial levels) |
| `/games/card` | Polarization card game |
| `/games/escape` | Light chamber escape room |
| `/games/detective` | Detective mystery game |

#### Calculation Workshop

| Route | Description |
|-------|-------------|
| `/calc` | Calculation tools hub |
| `/calc/jones` | Jones matrix calculator |
| `/calc/stokes` | Stokes vector calculator |
| `/calc/mueller` | Mueller matrix calculator |
| `/calc/poincare` | Poincaré sphere viewer |

#### Other Routes

| Route | Description |
|-------|-------------|
| `/hardware` | Hardware and optical equipment |
| `/merchandise` | Educational products and kits |
| `/applications` | Real-world applications database |
| `/experiments` | Creative experiments gallery |

### Core Physics

#### The Four Axioms

1. **Orthogonality** - Light polarized at 90° difference coexists without interference
2. **Malus's Law** - Intensity through polarizer: I = I₀ × cos²(θ)
3. **Birefringence** - Calcite crystals split light into o-ray and e-ray
4. **Interference** - Same-phase light adds, opposite-phase cancels

#### Light Properties

| Property | Values |
|----------|--------|
| Direction | 6 discrete directions (±X, ±Y, ±Z) |
| Intensity | 0-15 levels |
| Polarization | 0°, 45°, 90°, 135° |
| Phase | Positive (+) or Negative (-) |

### Optical Components

#### Core Blocks

| Block | Function |
|-------|----------|
| **Emitter** | Projects polarized light beam |
| **Polarizer** | Filters light by polarization angle |
| **Rotator** | Rotates polarization without intensity loss |
| **Splitter** | Birefringent crystal splits beam |
| **Sensor** | Detects specific polarization and intensity |
| **Mirror** | Reflects light beam |

#### Advanced Blocks

| Block | Function |
|-------|----------|
| **Prism** | Refracts and disperses light |
| **Lens** | Focuses or diverges light |
| **Beam Splitter** | Splits beam 50/50 |
| **Quarter Wave Plate** | Converts linear ↔ circular polarization |
| **Half Wave Plate** | Flips polarization direction |
| **Absorber** | Partially absorbs light intensity |
| **Phase Shifter** | Shifts light phase |
| **Portal** | Teleports light to linked portal |

### Controls

#### Movement

| Key | First-Person | Isometric/Top-Down |
|-----|--------------|-------------------|
| WASD | Walk | Pan camera |
| Space | Jump | - |
| Mouse | Look around | Orbit camera |
| Scroll | - | Zoom |
| ESC | Exit pointer lock | - |

#### Building

| Key | Action |
|-----|--------|
| Left Click | Place block |
| Right Click | Remove block |
| R | Rotate block / Change polarization |
| 1-7 | Select block type |

#### View

| Key | Action |
|-----|--------|
| V | Toggle polarization vision |
| C | Cycle camera mode |
| G | Toggle grid overlay |
| H | Show/hide help panel |

### Polarization Colors

When polarization vision is enabled:

| Angle | Color |
|-------|-------|
| 0° (Horizontal) | Red |
| 45° (Diagonal) | Orange |
| 90° (Vertical) | Green |
| 135° (Anti-diagonal) | Blue |

### 2D Puzzle Mode

The 2D game offers a simplified, more accessible puzzle experience using SVG-based visuals.

#### Difficulty Levels

| Difficulty | Levels | Description |
|------------|--------|-------------|
| Easy | 0-2 | Basic polarizer and mirror mechanics |
| Medium | 3-5 | Rotators, splitters, L-shaped paths |
| Hard | 6-8 | Multiple sensors, maze navigation |
| Expert | 9-10 | Multiple light sources, complex routing |

#### 2D Controls

- **Click** - Select unlocked component
- **Arrow Keys** - Rotate selected component
- **Eye Button** - Toggle polarization color display
- **Reset** - Restore level to initial state

### Optical Design Studio (光学设计室)

A comprehensive polarized light art design tool combining Device Library and Optical Bench for creating and simulating optical systems.

#### Studio Features

- **Device Library (器件图鉴)** - Browse 80+ optical devices with detailed specifications, working principles, and formulas
- **Optical Bench (光学工作台)** - Interactive canvas for designing custom optical paths
- **Classic Experiments** - Pre-configured setups demonstrating key optical phenomena
- **Challenge Mode** - Goal-based puzzles with success conditions
- **Interactive Tutorials** - Step-by-step guides for learning optical principles
- **Save/Load Designs** - Persist and share your optical creations

#### Component Types

| Component | Function |
|-----------|----------|
| **Emitter** | Light source with configurable polarization |
| **Polarizer** | Filters light by polarization angle (Malus's Law) |
| **Waveplate** | Phase retarder (λ/4 or λ/2) |
| **Mirror** | Reflects light at specified angles |
| **Splitter** | Beam splitter (PBS/NPBS/Calcite) |
| **Sensor** | Detects light intensity and polarization |
| **Lens** | Focus or defocus light beams |

#### Controls Tips

- **Drag & Drop** - Move components on the canvas
- **Click** - Select component to edit properties
- **Rotate** - Adjust component orientation
- **Grid Snap** - Align components precisely

### Tutorial Levels (3D Game)

| Level | Concept |
|-------|---------|
| 0 - Light & Gate | Basic emitter-sensor alignment |
| 1 - Polarizer | Filtering light with polarization |
| 2 - Malus's Law | Intensity reduction through filters |
| 3 - Wave Plate | Lossless polarization rotation |
| 4 - Birefringence | Beam splitting and routing |

### Course Curriculum

The educational platform covers 6 units of polarization optics with 21 interactive demos:

| Unit | Topic | Demos |
|------|-------|-------|
| 0 | Optical Fundamentals | EM Wave, Polarization Intro, Polarization Types, Interactive Optical Bench |
| 1 | Light Polarization | Polarization State, Malus's Law, Birefringence, Waveplate |
| 2 | Interface Reflection | Fresnel Equations, Brewster's Angle |
| 3 | Transparent Media | Anisotropy (Stress), Chromatic Polarization, Optical Rotation |
| 4 | Turbid Media Scattering | Mie Scattering, Rayleigh Scattering, Monte Carlo Scattering |
| 5 | Full Polarimetry | Stokes Vectors, Mueller Matrices, Jones Matrices, Polarization Calculator, Polarimetric Microscopy |

#### Difficulty Levels Settings

The course offers three difficulty levels to accommodate different learners:

| Level | Description | Content |
|-------|-------------|---------|
| Foundation (🌱) | Problem-driven research introduction | Discover phenomena through simple explanations. No formulas required! |
| Application (🔬) | Rotational research training | Hands-on experiments with quantitative formulas and measurement principles |
| Research (🚀) | Independent original research | Frontier research methods with rigorous academic treatment |

Visit `/demos` to explore interactive visualizations.

### Project Structure

```txt
polarisation/
├── src/
│   ├── core/                  # Physics engine & world logic
│   │   └── game2d/            # 2D game specific logic
│   ├── stores/                # Zustand state management
│   ├── pages/                 # Route page components (20+ pages)
│   ├── hooks/                 # Custom React hooks
│   ├── data/                  # Static data files
│   │   ├── cardgame/          # Card game definitions
│   │   ├── hardware/          # Hardware catalog data
│   │   └── merchandise/       # Product catalog data
│   ├── components/
│   │   ├── game/              # 3D voxel game components (R3F)
│   │   ├── hud/               # Game UI overlay components
│   │   ├── bench/             # Optical bench components
│   │   ├── demos/             # Physics demo components (6 units)
│   │   │   ├── basics/        # Unit 0: Optical fundamentals
│   │   │   ├── unit1/         # Unit 1: Polarization
│   │   │   ├── unit2/         # Unit 2: Interface reflection
│   │   │   ├── unit3/         # Unit 3: Transparent media
│   │   │   ├── unit4/         # Unit 4: Scattering
│   │   │   └── unit5/         # Unit 5: Full polarimetry
│   │   ├── optical-studio/    # Optical Design Studio components
│   │   ├── shared/optical/    # Shared optical visualization components
│   │   ├── icons/             # Custom icon components
│   │   └── ui/                # Shared UI primitives
│   ├── contexts/              # React contexts (theme, etc.)
│   └── i18n/                  # Internationalization
│       └── locales/           # Translation files (en.json, zh.json)
├── server/                    # Backend (NestJS + Colyseus)
├── CLAUDE.md                  # Development guide
└── COURSE.md                  # Course curriculum
```

### Design Philosophy

> "Making the invisible geometry of light visible, playable, and explorable"

PolarCraft transforms abstract optical physics into interactive experiences through multiple pathways: spatial puzzles, visual simulations, creative tools, and research modules. Each component represents real optical principles, from simple polarizers to complex Mueller matrices. The design philosophy emphasizes hands-on discovery over passive learning, enabling users to build intuition through experimentation.

### License

MIT License

---

## 中文

> 探索光的隐形几何

一个综合性教育平台，将偏振光的隐形世界转化为交互式体验。通过游戏、仿真、设计工具和研究模块，探索3D电影、LCD屏幕和光学仪器背后的科学。

### 特性

**6大创意模块：**

- **光的编年史** - 穿越偏振发现的历史之旅
- **光学设计室** - 器件图鉴（80+组件）+ 交互式光路设计器
- **偏振演示馆** - 6个单元共21个交互式物理演示
- **偏振光探秘游戏中心** - 2D解谜、3D体素游戏、卡牌对战、密室逃脱、侦探推理
- **偏振造物局** - 偏振艺术、摄影与DIY实验
- **虚拟课题组：光研社** - 研究任务、应用数据库和计算工具

**核心能力：**

- **真实物理引擎** - 马吕斯定律、双折射、波干涉、Jones/Mueller矩阵运算
- **计算工坊** - Jones、Stokes、Mueller计算器 + Poincaré球查看器
- **多种游戏模式** - 2D解谜（11关）、3D体素（5教程）、卡牌游戏、密室逃脱、侦探游戏
- **三级难度系统** - 基础层、应用层、研究层三种内容级别
- **交互式仿真** - 实时光传播与偏振可视化
- **双语支持** - 完整的中英文界面
- **深色/浅色主题** - 在任何环境下都能舒适观看

### 技术栈

| 类别 | 技术 |
|------|------|
| 前端 | React 19 + TypeScript（严格模式）|
| 3D渲染 | React Three Fiber + Three.js + drei |
| 2D动画 | Framer Motion |
| 状态管理 | Zustand + subscribeWithSelector |
| 路由 | React Router v7 |
| 样式 | Tailwind CSS v4 |
| 国际化 | i18next + 语言检测 |
| 构建工具 | Vite |

### 快速开始

```bash
npm install      # 安装依赖
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run preview  # 预览生产构建
```

### 应用路由

#### 核心模块

| 路由 | 模块 | 描述 |
|------|------|------|
| `/` | 首页 | 带6大创意模块导航的首页 |
| `/chronicles` | 光的编年史 | 偏振发现的历史之旅 |
| `/optical-studio` | 光学设计室 | 器件图鉴 + 光路设计器 |
| `/demos` | 演示馆 | 21个交互式物理演示 |
| `/games` | 游戏中心 | 多模式游戏中心 |
| `/creative` | 偏振造物局 | 艺术、摄影与DIY项目 |
| `/lab` | 虚拟课题组 | 研究任务和社区 |

#### 游戏（偏振光探秘）

| 路由 | 描述 |
|------|------|
| `/games` | 游戏中心 |
| `/games/2d` | 2D解谜模式（11关，4个难度） |
| `/games/3d` | 3D体素解谜（5个教程关卡） |
| `/games/card` | 偏振卡牌游戏 |
| `/games/escape` | 光之密室逃脱 |
| `/games/detective` | 侦探推理游戏 |

#### 计算工坊

| 路由 | 描述 |
|------|------|
| `/calc` | 计算工具中心 |
| `/calc/jones` | Jones矩阵计算器 |
| `/calc/stokes` | Stokes矢量计算器 |
| `/calc/mueller` | Mueller矩阵计算器 |
| `/calc/poincare` | Poincaré球查看器 |

#### 其他路由

| 路由 | 描述 |
|------|------|
| `/hardware` | 硬件和光学设备 |
| `/merchandise` | 教育产品和套件 |
| `/applications` | 现实应用数据库 |
| `/experiments` | 创意实验画廊 |

### 核心物理

#### 四大公理

1. **正交性** - 偏振方向相差90°的光可以共存而不发生干涉
2. **马吕斯定律** - 通过偏振片的强度：I = I₀ × cos²(θ)
3. **双折射** - 方解石晶体将光分成寻常光（o光）和非寻常光（e光）
4. **干涉** - 同相位光叠加，反相位光抵消

#### 光的属性

| 属性 | 取值 |
|------|------|
| 方向 | 6个离散方向（±X, ±Y, ±Z）|
| 强度 | 0-15级 |
| 偏振角 | 0°, 45°, 90°, 135° |
| 相位 | 正相位（+）或负相位（-）|

### 光学组件

#### 基础方块

| 方块 | 功能 |
|------|------|
| **发射器** | 发射偏振光束 |
| **偏振片** | 按偏振角度过滤光 |
| **旋转器** | 无损旋转偏振方向 |
| **分光器** | 双折射晶体分光 |
| **传感器** | 检测特定偏振和强度 |
| **镜子** | 反射光束 |

#### 高级方块

| 方块 | 功能 |
|------|------|
| **棱镜** | 折射和色散光线 |
| **透镜** | 聚焦或发散光线 |
| **分束器** | 50/50分光 |
| **四分之一波片** | 线偏振 ↔ 圆偏振转换 |
| **二分之一波片** | 翻转偏振方向 |
| **吸收器** | 部分吸收光强 |
| **相位调节器** | 改变光的相位 |
| **传送门** | 将光传送到链接的传送门 |

### 控制方式

#### 移动

| 按键 | 第一人称 | 等距/俯视视角 |
|------|----------|--------------|
| WASD | 行走 | 平移相机 |
| Space | 跳跃 | - |
| 鼠标 | 环顾四周 | 旋转相机 |
| 滚轮 | - | 缩放 |
| ESC | 退出鼠标锁定 | - |

#### 建造

| 按键 | 操作 |
|------|------|
| 左键点击 | 放置方块 |
| 右键点击 | 移除方块 |
| R | 旋转方块/改变偏振 |
| 1-7 | 选择方块类型 |

#### 视图

| 按键 | 操作 |
|------|------|
| V | 切换偏振视觉 |
| C | 切换相机模式 |
| G | 切换网格显示 |
| H | 显示/隐藏帮助面板 |

### 偏振颜色

启用偏振视觉时：

| 角度 | 颜色 |
|------|------|
| 0°（水平）| 红色 |
| 45°（对角）| 橙色 |
| 90°（垂直）| 绿色 |
| 135°（反对角）| 蓝色 |

### 2D解谜模式

2D游戏提供简化、更易上手的解谜体验，使用基于SVG的视觉效果。

#### 难度等级

| 难度 | 关卡 | 描述 |
|------|------|------|
| 简单 | 0-2 | 基础偏振片和镜子机制 |
| 中等 | 3-5 | 旋转器、分光器、L形路径 |
| 困难 | 6-8 | 多传感器、迷宫导航 |
| 专家 | 9-10 | 多光源、复杂路由 |

#### 2D控制方式

- **点击** - 选择未锁定的组件
- **方向键** - 旋转选中的组件
- **眼睛按钮** - 切换偏振颜色显示
- **重置** - 恢复关卡初始状态

### 光学设计室

一个综合性的偏振光艺术设计工具，集成器件图鉴和光学工作台，用于创建和模拟光学系统。

#### 功能特点

- **器件图鉴** - 浏览80+光学器件，包含详细规格、工作原理和公式
- **光学工作台** - 交互式画布，用于设计自定义光路
- **经典实验** - 预配置的实验设置，演示关键光学现象
- **挑战模式** - 基于目标的解谜关卡，带成功条件
- **交互式教程** - 学习光学原理的分步指南
- **保存/加载设计** - 持久化和分享您的光学创作

#### 组件类型

| 组件 | 功能 |
|------|------|
| **发射器** | 可配置偏振的光源 |
| **偏振片** | 按偏振角度过滤光（马吕斯定律）|
| **波片** | 相位延迟器（λ/4 或 λ/2）|
| **镜子** | 以指定角度反射光 |
| **分光器** | 分束器（PBS/NPBS/方解石）|
| **传感器** | 检测光强度和偏振 |
| **透镜** | 聚焦或发散光束 |

#### 操作方式

- **拖放** - 在画布上移动组件
- **点击** - 选择组件编辑属性
- **旋转** - 调整组件方向
- **网格对齐** - 精确对齐组件

### 教程关卡（3D游戏）

| 关卡 | 概念 |
|------|------|
| 0 - 光与门 | 基础发射器-传感器对准 |
| 1 - 偏振片 | 用偏振过滤光 |
| 2 - 马吕斯定律 | 通过滤光片减少强度 |
| 3 - 波片 | 无损偏振旋转 |
| 4 - 双折射 | 光束分裂和路由 |

### 课程大纲

教育平台涵盖6个偏振光学单元，共21个交互式演示：

| 单元 | 主题 | 演示 |
|------|------|------|
| 0 | 光学基础 | 电磁波、偏振简介、偏振类型、交互式光学平台 |
| 1 | 光的偏振 | 偏振态、马吕斯定律、双折射、波片 |
| 2 | 界面反射 | 菲涅尔方程、布儒斯特角 |
| 3 | 透明介质 | 应力双折射、色偏振、旋光性 |
| 4 | 浑浊介质散射 | 米氏散射、瑞利散射、蒙特卡洛散射 |
| 5 | 全偏振测量 | 斯托克斯矢量、穆勒矩阵、Jones矩阵、偏振计算器、偏振显微镜 |

#### 难度级别

课程提供三个难度级别，适应不同学习者：

| 级别 | 描述 | 内容 |
|------|------|------|
| 基础层 (🌱) | 问题驱动的研究入门 | 通过简单解释发现现象。无需公式！ |
| 应用层 (🔬) | 轮转式研究训练 | 实验设计与定量公式，强调测量原理 |
| 研究层 (🚀) | 独立原创研究 | 前沿研究方法与严谨学术处理 |

访问 `/demos` 探索交互式可视化演示。

### 项目结构

```txt
polarisation/
├── src/
│   ├── core/                  # 物理引擎和世界逻辑
│   │   └── game2d/            # 2D游戏特定逻辑
│   ├── stores/                # Zustand状态管理
│   ├── pages/                 # 路由页面组件（20+页面）
│   ├── hooks/                 # 自定义React钩子
│   ├── data/                  # 静态数据文件
│   │   ├── cardgame/          # 卡牌游戏定义
│   │   ├── hardware/          # 硬件目录数据
│   │   └── merchandise/       # 产品目录数据
│   ├── components/
│   │   ├── game/              # 3D体素游戏组件（R3F）
│   │   ├── hud/               # 游戏UI叠加组件
│   │   ├── bench/             # 光学平台组件
│   │   ├── demos/             # 物理演示组件（6个单元）
│   │   │   ├── basics/        # 单元0：光学基础
│   │   │   ├── unit1/         # 单元1：偏振
│   │   │   ├── unit2/         # 单元2：界面反射
│   │   │   ├── unit3/         # 单元3：透明介质
│   │   │   ├── unit4/         # 单元4：散射
│   │   │   └── unit5/         # 单元5：全偏振测量
│   │   ├── optical-studio/    # 光学设计室组件
│   │   ├── shared/optical/    # 共享光学可视化组件
│   │   ├── icons/             # 自定义图标组件
│   │   └── ui/                # 共享UI基础组件
│   ├── contexts/              # React上下文（主题等）
│   └── i18n/                  # 国际化
│       └── locales/           # 翻译文件（en.json, zh.json）
├── server/                    # 后端（NestJS + Colyseus）
├── CLAUDE.md                  # 开发指南
└── COURSE.md                  # 课程大纲
```

### 设计理念

> "让光的隐形几何可见、可玩、可探索"

PolarCraft通过多种途径将抽象的光学物理转化为交互式体验：空间解谜、视觉仿真、创意工具和研究模块。每个组件都代表真实的光学原理，从简单的偏振片到复杂的穆勒矩阵。设计理念强调通过动手发现而非被动学习，让用户通过实验建立直觉。

### 许可证

MIT 许可证

## 代码文档

此处为代码文档

### 进度
