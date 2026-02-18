# PolarCraft : Polarized Light Creative Platform | 偏振光创意平台

[English](#english) | [中文](#中文)

## English

> Explore the Hidden Geometry of Light

PolarCraft is an educational platform that transforms the science of polarized light into interactive, experiential, and creative explorations. Through games, simulations, design tools, and curriculum modules, everyone can intuitively understand the mysteries of light polarization.

---

## ✨ Core Features

| Module | Description |
|--------|-------------|
| 🧩 **PolarQuest Game Hub** | 2D puzzles, 3D voxel building, card battles, escape rooms, detective mysteries |
| 🧪 **Optical Design Studio** | 80+ optical component library + interactive light path designer |
| 📖 **Chronicles of Light** | Illustrated history of polarization science |
| 🧬 **Polarization Demo Gallery** | 6 units, 21 interactive physics simulations |
| 🎨 **Creative Workshop** | Polarization art, photography techniques, and DIY experiments |
| 🔬 **Virtual Lab Group** | Research tasks, application database, and professional calculation tools |

---

## 🚀 Quick Start

```bash
# After cloning the repository
npm install
npm run dev      # Development mode
npm run build    # Production build
npm run preview  # Preview build
```

Visit `http://localhost:5173` to experience.

---

## 🧭 Main Routes

| Path | Description |
|------|-------------|
| `/` | Homepage navigation |
| `/chronicles` | Module 1: Chronicles of Light |
| `/studio` | Module 2: Optical Design Studio (component library + workbench) |
| `/demos` | Module 3: Polarization physics demo gallery |
| `/games` | Module 4: Game hub with 5 game modes |
| `/gallery` | Module 5: Polarization art and experiment workshop |
| `/research` | Module 6: Virtual lab group (research tasks and community) |
| `/calc/*` | Calculation tools (Jones/Stokes/Mueller/Poincaré) |
| `/hardware` | Optical hardware equipment library |
| `/research/applications` | Real-world polarization technology applications |

---

## 🎮 Game Modes Overview

### 1. 2D Puzzle Mode (11 levels)

- **Difficulty tiers**: Easy → Expert
- **Mechanics**: Polarizers, mirrors, wave plates, beam splitters
- **Goal**: Guide light beams to activate sensors

### 2. 3D Voxel Building Mode (5 tutorials)

- Switch between **first-person/top-down** views
- **Real physics engine**: Malus's Law, birefringence, interference
- **Free building** of optical systems

### 3. Card Battle Mode

- Turn-based card game based on polarization states and optical principles

### 4. Escape Room Mode

- Immersive puzzle experience driven by optical challenges

### 5. Detective Mystery Mode

- Story-driven mystery solving with polarization clues

---

## 🧪 Optical Design Studio

### Key Features

- **Component Library**: 80+ real optical components with principles and formulas
- **Workbench**: Drag-and-drop light path design with real-time simulation
- **Challenge Mode**: Goal-oriented puzzle levels
- **Save/Share**: Export and import optical designs

### Common Components

| Component | Function |
|-----------|----------|
| Emitter | Light source with configurable polarization |
| Polarizer | Filters light by angle (following Malus's Law) |
| Wave Plate | λ/4 (linear→circular), λ/2 (polarization flip) |
| Beam Splitter | PBS/calcite splitting |
| Sensor | Detects intensity and polarization state |
| Lens/Prism | Focusing, refraction, dispersion |

---

## 📚 Curriculum System (6 Units)

| Unit | Topic | Examples |
|------|-------|----------|
| 0 | Optical Fundamentals | EM waves, polarization types, interactive platform |
| 1 | Light Polarization | Polarization states, Malus's Law, birefringence |
| 2 | Interface Reflection | Fresnel equations, Brewster's angle |
| 3 | Transparent Media | Stress birefringence, optical activity |
| 4 | Scattering | Mie scattering, Rayleigh scattering |
| 5 | Full Polarimetry | Stokes vectors, Mueller matrices, Poincaré sphere |

### Difficulty Levels

- 🌱 **Foundation**: Phenomenon exploration, no formulas
- 🔬 **Application**: Experimental design, quantitative analysis
- 🚀 **Research**: Advanced methods, academic training

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend Framework | React 19 + TypeScript |
| 3D Rendering | React Three Fiber + Three.js |
| State Management | Zustand |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Internationalization | i18next |
| Build Tool | Vite |

---

## 📂 Project Structure

```txt
src/
├── core/              # Physics engine & game logic
├── pages/             # Page components
├── components/        # Reusable components
│   ├── game/         # 3D game components
│   ├── demos/        # 6 unit experiment components
│   ├── optical-studio/ # Design studio components
│   └── ui/           # Common UI components
├── stores/            # Zustand state stores
├── hooks/             # Custom React Hooks
├── data/              # Static data (cards, hardware, products)
├── contexts/          # React Contexts
└── i18n/              # Internationalization config

docs/claude/           # Detailed developer documentation
├── architecture.md    # Routes, modules, directory structure
├── game-systems.md    # Game types, physics, controls
├── optical-studio.md  # Optical Design Studio reference
├── course-demos.md    # Course units & difficulty system
└── development-guide.md # How-to guides for common tasks
```

---

## 🧭 Design Philosophy

> **"Making the invisible geometry of light visible, playable, and explorable"**

PolarCraft aims to lower the barrier to learning optics through **interactive experiences**, transforming abstract physics into intuitive operations and visual feedback. Whether through puzzle-solving, free building, or curriculum experiments, everything revolves around "learning by doing."

---

## 📄 License

MIT License © PolarCraft Team

---

## 中文

> 探索光的隐形几何 · Explore the Hidden Geometry of Light

PolarCraft 是一个将偏振光科学转化为可交互、可体验、可创作的教育平台。通过游戏、模拟、设计工具与课程模块，让每个人都能直观理解光偏振的奥秘。

---

## ✨ 核心特性

| 模块 | 说明 |
|------|------|
| 🧩 **偏振光探秘游戏中心** | 2D解谜、3D体素建造、卡牌对战、密室逃脱、侦探推理 |
| 🧪 **光学设计室** | 80+光学器件图鉴 + 交互式光路设计工作台 |
| 📖 **光的编年史** | 偏振科学发展史图文导览 |
| 🧬 **偏振演示馆** | 6单元、21个交互式物理仿真实验 |
| 🎨 **偏振造物局** | 偏振艺术创作、摄影技巧与DIY实验 |
| 🔬 **虚拟课题组：光研社** | 研究任务、应用案例库与专业计算工具 |

---

## 🚀 快速开始

```bash
# 克隆项目后执行
npm install
npm run dev      # 开发模式
npm run build    # 生产构建
npm run preview  # 预览构建结果
```

访问 `http://localhost:5173` 即可体验。

---

## 🧭 主要页面路由

| 路径 | 说明 |
|------|------|
| `/` | 首页导航 |
| `/chronicles` | 模块1：光的编年史 |
| `/studio` | 模块2：光学设计室（器件库+工作台） |
| `/demos` | 模块3：偏振物理演示馆 |
| `/games` | 模块4：游戏中心，包含5种游戏模式 |
| `/gallery` | 模块5：偏振艺术与实验工坊 |
| `/research` | 模块6：虚拟课题组（研究任务与社区） |
| `/calc/*` | 计算工具（Jones/Stokes/Mueller/Poincaré） |
| `/hardware` | 光学硬件设备库 |
| `/research/applications` | 偏振技术实际应用案例 |

---

## 🎮 游戏模式简介

### 1. 2D解谜模式（11个关卡）

- **难度分级**：简单 → 专家
- **机制**：偏振片、反射镜、波片、分束器
- **目标**：引导光束激活传感器

### 2. 3D体素建造模式（5个教程）

- **第一人称/俯视视角**切换
- **真实物理引擎**：马吕斯定律、双折射、干涉
- **自由搭建**光学系统

### 3. 卡牌对战模式

- 基于偏振状态与光学原理的回合制卡牌游戏

### 4. 密室逃脱模式

- 光学谜题驱动的沉浸式解谜体验

### 5. 侦探推理模式

- 结合偏振线索的剧情解谜

---

## 🧪 光学设计室

### 功能亮点

- **器件库**：80+种真实光学组件，含原理说明与公式
- **工作台**：拖拽式光路设计，实时仿真
- **挑战模式**：目标导向的关卡设计
- **保存/分享**：支持导出与导入光路设计

### 常用组件

| 组件 | 功能 |
|------|------|
| 发射器 | 可设置偏振方向的光源 |
| 偏振片 | 按角度滤光（遵循马吕斯定律） |
| 波片 | λ/4（线→圆偏振）、λ/2（偏振翻转） |
| 分束器 | PBS/方解石分光 |
| 传感器 | 检测光强与偏振状态 |
| 透镜/棱镜 | 聚焦、折射、色散 |

---

## 📚 课程体系（6个单元）

| 单元 | 主题 | 内容举例 |
|------|------|----------|
| 0 | 光学基础 | 电磁波、偏振类型、交互平台 |
| 1 | 光的偏振 | 偏振态、马吕斯定律、双折射 |
| 2 | 界面反射 | 菲涅尔方程、布儒斯特角 |
| 3 | 透明介质 | 应力双折射、旋光性 |
| 4 | 散射 | 米氏散射、瑞利散射 |
| 5 | 全偏振测量 | Stokes矢量、Mueller矩阵、Poincaré球 |

### 难度分级

- 🌱 **基础层**：现象探索，无公式
- 🔬 **应用层**：实验设计，定量分析
- 🚀 **研究层**：前沿方法，学术训练

---

## 🛠️ 技术栈

| 类别 | 技术选型 |
|------|----------|
| 前端框架 | React 19 + TypeScript |
| 3D渲染 | React Three Fiber + Three.js |
| 状态管理 | Zustand |
| 路由 | React Router v7 |
| 样式 | Tailwind CSS v4 |
| 动画 | Framer Motion |
| 国际化 | i18next |
| 构建工具 | Vite |

---

## 📂 项目结构

```txt
src/
├── core/              # 物理引擎与游戏逻辑
├── pages/             # 页面组件
├── components/        # 可复用组件
│   ├── game/         # 3D游戏组件
│   ├── demos/        # 6个单元的实验组件
│   ├── optical-studio/ # 设计室组件
│   └── ui/           # 通用UI组件
├── stores/            # Zustand状态库
├── hooks/             # 自定义React Hooks
├── data/              # 静态数据（卡牌、硬件、产品）
├── contexts/          # React Context
└── i18n/              # 国际化配置

docs/claude/           # 详细开发者文档
├── architecture.md    # 路由、模块、目录结构
├── game-systems.md    # 游戏类型、物理引擎、控制
├── optical-studio.md  # 光学设计室参考
├── course-demos.md    # 课程单元与难度体系
└── development-guide.md # 常见任务操作指南
```

---

## 🧭 设计理念

> **“让光的隐形几何可见、可玩、可探索”**

PolarCraft 旨在通过**交互体验**降低光学学习门槛，将抽象物理转化为直观的操作与视觉反馈。无论是游戏解谜、自由搭建，还是课程实验，都围绕“动手发现”展开。

---

## 📄 许可证

MIT License © PolarCraft Team
