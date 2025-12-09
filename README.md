# PolarCraft - Polarized Light Voxel Puzzle Game

# PolarCraft - 偏振光体素解谜游戏

---

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## English

> An Optical Puzzle Experience

A beautifully crafted puzzle game that transforms the invisible geometry of polarized light into elegant, tangible challenges. Manipulate light beams, rotate polarizers, and unlock sensors through clever optical arrangements.

### Features

- **3D Voxel Puzzles** - Solve optical challenges in immersive 3D environments using real physics principles
- **2D Puzzle Mode** - 11 levels across 4 difficulty tiers with SVG-based visuals and smooth animations
- **Intuitive Light Physics** - Malus's Law, birefringence, and wave interference made playable
- **Multiple Camera Views** - First-person, isometric, and top-down perspectives
- **Polarization Visualization** - Toggle vision modes to see hidden polarization states
- **Educational Course** - 15 interactive demos across 6 physics units
- **Bilingual Support** - English and Chinese interface
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

### Game Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with navigation |
| `/game` | Full 3D voxel puzzle experience |
| `/game2d` | 2D puzzle mode with 11 levels |
| `/demos` | Interactive physics demonstrations |

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

### Tutorial Levels (3D Game)

| Level | Concept |
|-------|---------|
| 0 - Light & Gate | Basic emitter-sensor alignment |
| 1 - Polarizer | Filtering light with polarization |
| 2 - Malus's Law | Intensity reduction through filters |
| 3 - Wave Plate | Lossless polarization rotation |
| 4 - Birefringence | Beam splitting and routing |

### Course Curriculum

The educational platform covers 6 units of polarization optics:

| Unit | Topic | Demos |
|------|-------|-------|
| 0 | Optical Fundamentals | Light Wave, Polarization Intro, Polarization Types |
| 1 | Light Polarization | Polarization State, Malus's Law, Birefringence, Waveplate |
| 2 | Interface Reflection | Fresnel Equations, Brewster's Angle |
| 3 | Transparent Media | Chromatic Polarization, Optical Rotation |
| 4 | Turbid Media Scattering | Mie Scattering, Rayleigh Scattering |
| 5 | Full Polarimetry | Stokes Vectors, Mueller Matrices |

Visit `/demos` to explore interactive visualizations.

### Project Structure

```
polarisation/
├── src/
│   ├── core/           # Physics engine & world logic
│   ├── stores/         # Zustand state management
│   ├── pages/          # Route components
│   ├── components/
│   │   ├── game/       # 3D scene components
│   │   ├── hud/        # UI overlay components
│   │   ├── demos/      # Physics demonstrations
│   │   └── ui/         # Shared UI primitives
│   ├── contexts/       # Theme provider
│   └── i18n/           # Translations
├── server/             # Backend (multiplayer planned)
└── CLAUDE.md           # Development guide
```

### Design Philosophy

> "Making the invisible geometry of light visible and playable"

This game transforms abstract optical physics into spatial puzzles. Each block represents a real optical component, and solutions emerge from understanding how polarized light behaves. The aesthetic draws from low-poly architectural puzzle games, emphasizing clean geometry and soft lighting over photorealism.

### License

MIT License

---

<a name="中文"></a>
## 中文

> 一款光学解谜游戏体验

一款精心打造的解谜游戏，将偏振光的隐形几何转化为优雅而具体的挑战。操控光束、旋转偏振片，通过巧妙的光学布局解锁传感器。

### 特性

- **3D体素解谜** - 在沉浸式3D环境中使用真实物理原理解决光学挑战
- **2D解谜模式** - 11个关卡，4个难度等级，基于SVG的视觉效果和流畅动画
- **直观的光学物理** - 马吕斯定律、双折射和波干涉变得可玩
- **多视角相机** - 第一人称、等距视角和俯视视角
- **偏振可视化** - 切换视觉模式查看隐藏的偏振状态
- **教育课程** - 6个单元共15个交互式演示
- **双语支持** - 中英文界面
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

### 游戏路由

| 路由 | 描述 |
|------|------|
| `/` | 带导航的首页 |
| `/game` | 完整3D体素解谜体验 |
| `/game2d` | 2D解谜模式，共11个关卡 |
| `/demos` | 交互式物理演示 |

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

### 教程关卡（3D游戏）

| 关卡 | 概念 |
|------|------|
| 0 - 光与门 | 基础发射器-传感器对准 |
| 1 - 偏振片 | 用偏振过滤光 |
| 2 - 马吕斯定律 | 通过滤光片减少强度 |
| 3 - 波片 | 无损偏振旋转 |
| 4 - 双折射 | 光束分裂和路由 |

### 课程大纲

教育平台涵盖6个偏振光学单元：

| 单元 | 主题 | 演示 |
|------|------|------|
| 0 | 光学基础 | 光波、偏振简介、偏振类型 |
| 1 | 光的偏振 | 偏振态、马吕斯定律、双折射、波片 |
| 2 | 界面反射 | 菲涅尔方程、布儒斯特角 |
| 3 | 透明介质 | 色偏振、旋光性 |
| 4 | 浑浊介质散射 | 米氏散射、瑞利散射 |
| 5 | 全偏振测量 | 斯托克斯矢量、穆勒矩阵 |

访问 `/demos` 探索交互式可视化演示。

### 项目结构

```
polarisation/
├── src/
│   ├── core/           # 物理引擎和世界逻辑
│   ├── stores/         # Zustand状态管理
│   ├── pages/          # 路由组件
│   ├── components/
│   │   ├── game/       # 3D场景组件
│   │   ├── hud/        # UI叠加组件
│   │   ├── demos/      # 物理演示
│   │   └── ui/         # 共享UI基础组件
│   ├── contexts/       # 主题提供者
│   └── i18n/           # 翻译文件
├── server/             # 后端（多人游戏计划中）
└── CLAUDE.md           # 开发指南
```

### 设计理念

> "让光的隐形几何可见且可玩"

这款游戏将抽象的光学物理转化为空间解谜。每个方块代表一个真实的光学组件，解决方案来自于理解偏振光的行为方式。美学风格借鉴了低多边形建筑解谜游戏，强调简洁的几何形状和柔和的光照，而非照片级真实感。

### 许可证

MIT 许可证
