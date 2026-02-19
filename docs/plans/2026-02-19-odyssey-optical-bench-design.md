# Odyssey v3 — The Optical Bench · 完整设计文档

> 科幻光学实验台 · 2D 滚动沉浸式偏振课程体验

---

## 1. 设计概述

### 核心隐喻
整个页面是一张**纵向展开的科幻光学实验台**。一束光从页面顶部射入, 沿途经过光学元件(偏振片、晶体、棱镜、散射介质), 每次相遇都改变光的状态。用户通过垂直滚动推进光的旅程, 在每个站点通过交互式演示探索物理现象。

### 视觉基调
科幻实验室 (Sci-fi Lab) — 深空黑底 + 霓虹辉光 + 金属质感底座 + 悬浮光学元件。参考 Stripe/Linear 的排版精度和动效节奏, 但用光学实验室的视觉语言替代科技产品语言。

### 技术选型
纯 2D: React 19 + Framer Motion + SVG + CSS + Tailwind v4。不使用 R3F/Three.js/WebGL。

---

## 2. 空间结构

### 页面层级

```
┌─ VIEWPORT ─────────────────────────────────────────────┐
│                                                         │
│  [Z-0] 背景层: 网格 + 环境粒子 + 渐变氛围              │
│  [Z-1] 光路层: SVG 光束总线 (fixed, 贯穿全页)           │
│  [Z-2] 内容层: Hero + Stations + Transitions            │
│  [Z-3] HUD层: 导航 + 物理状态指示器                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 垂直滚动 + 局部水平光路

大框架垂直滚动。每个 station 内部, 光束水平穿越(左入右出)。站间有 SVG 弧线连接(上站右出 → 弯折 → 下站左入), 形成连续的蛇形光路。

```
  Hero (100vh)
  │
  ╔═ Unit 0: 偏振基础 ═══════════════════════════╗
  ║  ┌─ Station 0 ──────────────────────────┐     ║
  ║  │  光→ [元件] →光   (水平光路带)         │     ║
  ║  │  [Demo 交互区 + 理论]                 │     ║
  ║  └──────────────────────────────────────┘     ║
  ║           ↓ (SVG 弧线转接)                    ║
  ║  ┌─ Station 1 ──────────────────────────┐     ║
  ║  │  光→ [元件] →光                       │     ║
  ║  │  [Demo 交互区 + 理论]                 │     ║
  ║  └──────────────────────────────────────┘     ║
  ╚═══════════════════════════════════════════════╝
  │
  ═══ Unit 过渡 (100vh, 全屏标题 + 环境色变化) ═══
  │
  ╔═ Unit 1: 调制与测量 ═════════════════════════╗
  ...
```

---

## 3. 场景元素 — 沉浸式层级

### 3.1 背景层 (z-0)

**光学平台网格**
- 极细的点阵网格 (模拟光学平台 M6 螺纹孔阵列)
- 间距 48px, 点直径 1px, 颜色 `rgba(255,255,255,0.03)`
- 随滚动微弱视差移动 (translateY * 0.02)
- 每个 Unit 区域内, 网格点颜色微微偏向 Unit 主色

**环境粒子**
- CSS @keyframes 驱动的浮动光点 (40-60 个)
- 大小 1-3px, opacity 0.02-0.08, 缓慢随机漂移
- 颜色 = 当前 Unit 主色 (随滚动渐变)
- 绝对不能影响性能 — 纯 CSS animation, will-change: transform

**氛围渐变**
- 每个 Unit 区域有一个超大径向渐变光晕 (500-800px 半径)
- 中心 = Unit 主色 opacity 0.03, 边缘透明
- 位置: 跟随当前 station 的光路元件位置
- 营造 "聚光灯照亮当前实验区域" 的感觉

### 3.2 光路层 (z-1)

**主光束 SVG**
- `position: fixed` 覆盖全视口, 内容随滚动 transform
- 光束 = SVG `<rect>` 带 `<linearGradient>` + CSS glow (box-shadow)
- 宽度: 4-8px (随强度变化)
- 颜色: 随偏振态映射 (线偏振=Unit色, 圆偏振=彩虹, 消光=暗红)
- 流动动画: `background-position` 循环移动, 模拟光子流

**E 场振荡指示器**
- 在光束上方, 用小型 SVG 箭头表示 E 矢量振荡方向
- 未偏振 = 箭头随机方向; 偏振后 = 箭头整齐排列
- 频率和振幅随物理状态实时变化
- 只在当前 station ± 1 范围内显示 (性能)

### 3.3 光学元件 SVG 图标系统

为每类光学元件设计统一风格的 SVG 插图:

| 元件 | SVG 视觉 | 尺寸 | 交互 |
|------|---------|------|------|
| 偏振片 | 圆盘 + 栅格线 + 金属支架 | 80×120 | 可旋转 (drag/scroll) |
| 波片 | 薄矩形板 + 快轴标记 + 支架 | 60×120 | 可旋转 |
| 方解石 | 菱形棱柱 (等轴测) + 底座 | 100×100 | 可倾斜 |
| 玻璃面 | 倾斜矩形 + 入射/反射/折射标注 | 120×100 | 可调角度 |
| 透镜 | 双凸弧面 + 支架 | 80×120 | — |
| 散射介质 | 矩形容器 + 内部粒子 | 120×80 | 可调浓度 |
| 检偏器 | 与偏振片类似但带测量刻度 | 80×120 | 可旋转 |

所有元件 SVG 共享:
- 描边风格: stroke-width 1.5, 颜色 = Unit 主色
- 金属支架: 深灰色, 带微弱金属渐变
- 悬浮效果: subtle drop-shadow + hover 时 glow 增强
- 入场动画: 从下方 fade + slide in (whileInView)

### 3.4 刻度导轨

每个 station 底部有一条水平刻度线 (模拟光学平台导轨):
- 细线 + 短刻度标记, 每 10mm 一个刻度
- 标注光路距离 (Z = xxx mm)
- 极淡 (opacity 0.08), 强调精密仪器感
- 光束下方有一条发光投影线 (beam 的 "地面反射")

---

## 4. Station 卡片 — 统一设计系统

### 4.1 Station 容器

**不使用传统卡片。** 每个 station 是一个全宽区域, 用间距和环境光区分, 不用边框:

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                             ┃
┃   ┌── BEAM PATH BAR ──────────────────────────────────┐     ┃
┃   │                                                    │     ┃
┃   │  [入射光] ──→── [SVG元件] ──→── [出射光]           │     ┃
┃   │                                                    │     ┃
┃   │  θ = 45°        ⟨偏振片⟩       I/I₀ = 0.50        │     ┃
┃   │                                                    │     ┃
┃   └────────────────────────────────────────────────────┘     ┃
┃                                                             ┃
┃   STATION 03 ─────────────────────────── Unit 1 · Cyan      ┃
┃   Malus's Law                                               ┃
┃   马吕斯定律                                                ┃
┃                                                             ┃
┃   ┌─────────────────────────────────────────────────────┐   ┃
┃   │                                                     │   ┃
┃   │              DEMO 组件 (全宽, 无边框)                │   ┃
┃   │         重新包装: 去掉 DemoHeader/DemoLayout         │   ┃
┃   │         保留核心: 可视化 + 控件 + 图表                │   ┃
┃   │                                                     │   ┃
┃   └─────────────────────────────────────────────────────┘   ┃
┃                                                             ┃
┃   ┌── KEY INSIGHT ──────────────────────────────────────┐   ┃
┃   │  ⚡ "The transmitted intensity follows cos²θ..."     │   ┃
┃   └─────────────────────────────────────────────────────┘   ┃
┃                                                             ┃
┃   ┌── THEORY (collapsed by default) ───────────────────┐   ┃
┃   │  Foundation · Application · Research                │   ┃
┃   │  [click to expand each level]                       │   ┃
┃   └─────────────────────────────────────────────────────┘   ┃
┃                                                             ┃
┃   ── 刻度线 ─── Z = 245mm ─────────────────────────────    ┃
┃                                                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### 4.2 统一排版系统

```css
/* 字体层级 */
--font-display: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;

/* 大小 */
Station 编号:      font-mono, 11px, tracking-[0.3em], uppercase, opacity-40
Station 标题 (EN): font-display, 36px (md:48px), font-bold, tracking-tight
Station 标题 (ZH): font-display, 18px (md:22px), font-light, opacity-40
公式:              KaTeX, 20px (md:24px), Unit 主色
理论文字:          font-display, 15px, font-light, leading-relaxed, opacity-70
Key Insight:       font-display, 14px, italic, Unit 主色 opacity-80
物理读数:          font-mono, 12px, tabular-nums, opacity-60
刻度标注:          font-mono, 9px, tracking-wider, opacity-10
```

### 4.3 Beam Path Bar — 核心交互场景

水平光路带是每个 station 最重要的视觉元素 (~160px 高):

**布局**:
```
  ┌────────────────────────────────────────────────────┐
  │  ┌─入射─┐                           ┌─出射─┐      │
  │  │ I=1.0│ ===光束=== [元件] ===光束=== │I=0.5│      │
  │  │ θ=0° │      ↑E        ↑E          │θ=45°│      │
  │  └──────┘                           └──────┘      │
  │                                                    │
  │  ← drag or scroll within this bar to rotate →      │
  └────────────────────────────────────────────────────┘
```

**交互模式**:
- 默认: 滚动经过时, `localScrollProgress` 驱动元件参数 (如偏振片角度)
- 悬停: 光路带微微亮起, 出现 "drag to interact" 提示
- 拖拽: 水平拖拽直接控制元件参数, 滚动暂停
- 释放: 恢复滚动驱动

**光束视觉**:
- 入射段: 宽度4-8px, 颜色=上一站出射色, 带流动动画
- 出射段: 宽度=入射×cos²θ (Malus) 或其他物理变换, 颜色变化
- 元件处: 发光环 + 散射粒子 (CSS)
- 全部用 CSS gradient + box-shadow 实现, 不用 Canvas

### 4.4 Demo 组件嵌入策略

现有 demo 组件有自己的 `DemoHeader` + `DemoLayout` 外壳。嵌入时:

**方案: Wrapper 组件覆盖样式**

创建 `<OdysseyDemoEmbed>` wrapper:
1. 传递 `difficultyLevel="foundation"` (默认层级)
2. 用 Tailwind 覆盖 demo 内部的背景色、边框、圆角
3. 隐藏 `DemoHeader` (通过 CSS `[data-demo-header] { display: none }`)
4. 调整内部 padding 适配全宽布局
5. Demo 的控件 (slider, toggle) 保持原有交互不变

**公式渲染**: 不用 demo 内部的公式显示。由 station 的 `BeamPathBar` 和 `TheoryBlock` 统一用 KaTeX 渲染。

### 4.5 Theory Block — 渐进深度

不用 tab 切换。用空间深度 (点击展开层层递进):

```
默认状态:
  ⚡ Key Insight: "The transmitted intensity follows..."

点击 "deeper":
  ┌─ Foundation ────────────────────────────────────┐
  │  When light passes through a polarizer, the     │
  │  transmitted intensity depends on the angle...  │
  │                                                 │
  │  [go deeper →]                                  │
  └─────────────────────────────────────────────────┘

再点击:
  ┌─ Application ───────────────────────────────────┐
  │  Malus's Law (1809): I = I₀cos²θ, where θ is   │
  │  the angle between...                           │
  │                                                 │
  │  [research level →]                             │
  └─────────────────────────────────────────────────┘

再点击:
  ┌─ Research ──────────────────────────────────────┐
  │  Jones matrix projection gives |E_out|² = ...   │
  │  Non-ideal polarizers with extinction ratio...  │
  └─────────────────────────────────────────────────┘
```

每层展开用 `AnimatePresence` + `height: auto` 弹簧动画。前一层保持可见 (叠加, 不替换)。

---

## 5. 交互设计

### 5.1 光路带交互 (最重要)

每个 station 的 `BeamPathBar` 是主交互区域:

| 手势 | 效果 | 反馈 |
|------|------|------|
| 滚动经过 | localT [0,1] 驱动元件参数 | 光束亮度/颜色实时变化 |
| Hover 光路带 | 出现交互提示, 光路微亮 | cursor 变化 |
| 水平拖拽元件 | 直接控制角度/参数 | 元件旋转, 标注更新, 光束响应 |
| 点击元件 | 展开该元件的详细信息 | 放大动画 + info tooltip |
| Hover 物理读数 | 高亮对应公式中的变量 | 文字颜色变化 |

### 5.2 探索奖励

- **首次到达 station**: 光路带有一次 "通电" 动画 (光束从左到右快速流过)
- **找到特殊角度** (如 Brewster 角): 光束闪烁 + subtle 粒子爆发
- **完全消光** (θ=90°): 整个 station 区域微微变暗, 然后慢慢恢复
- **Hover 隐藏细节**: 刻度线上有极淡的注释, hover 才可见 (光学常数、材料参数)

### 5.3 滚动行为

- Lenis smooth scroll, duration 1.4
- Station 之间: 自然流动, 无 snap
- 滚动速度适中: 不要太快跳过内容, 不要太慢失去节奏
- 光路转接弧线的 SVG pathLength 随滚动平滑生长

### 5.4 Demo 内控件交互

保持现有 demo 组件的所有交互不变:
- Slider 拖拽 → 实时更新物理状态
- 偏振片拖拽旋转 → 实时更新
- 图表实时绘制
- **新增**: Demo 控件状态变化 → 通过回调更新 BeamPathBar 的光束视觉

---

## 6. Unit 过渡 — 环境变化

两个 Unit 之间的过渡区 (~80vh):

```
  ────────── Unit N 最后一站 ──────────
                    │
                    │  出射光束向下弯折 (SVG arc)
                    │
  ┌─────────────────────────────────────────┐
  │                                         │
  │         UNIT {N+1}                      │  背景渐变
  │         Modulation & Measurement        │  粒子颜色变化
  │         调制与测量                       │  网格色调变化
  │                                         │
  │         5 stations · 5 experiments      │
  │                                         │
  └─────────────────────────────────────────┘
                    │
                    │  入射光束从上方弯入 (SVG arc)
                    │
  ────────── Unit N+1 第一站 ─────────
```

过渡动画 (scroll-driven):
- 背景径向渐变颜色: Unit N 色 → Unit N+1 色 (opacity 0.03-0.05)
- 环境粒子颜色渐变
- 网格点颜色渐变
- 标题 fade in/out (Framer Motion whileInView)

---

## 7. 首屏 Hero

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│          (环境粒子 + 网格背景)                        │
│                                                     │
│     ╭─────────────────────────────────────╮         │
│     │  ══════ 水平光束动画 ══════════       │         │
│     │  (从左到右流动, 金色, 带 E 场箭头)    │         │
│     ╰─────────────────────────────────────╯         │
│                                                     │
│           The Optical Bench                         │
│           光学实验台                                 │
│                                                     │
│     A journey through polarized light.              │
│     23 experiments. One beam. Infinite discovery.    │
│                                                     │
│           ↓ scroll to begin                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Hero 的光束动画:
- 光束从左到右流动 (CSS animation, 循环)
- E 场箭头在光束上振荡
- 光束经过一个简化的偏振片图标, 强度减半
- 这个微型演示就是整个课程的预告

---

## 8. 导航

### 固定侧边进度条 (右侧)

```
  │
  ● ── Unit 0: Basics (5)        ← 当前位置发光
  │
  ○ ── Unit 1: Modulation (5)
  │
  ○ ── Unit 2: Reflection (2)
  │
  ○ ── Unit 3: Media (3)
  │
  ○ ── Unit 4: Scattering (3)
  │
  ○ ── Unit 5: Polarimetry (5)
  │
```

- 宽度: 极细 (40px 区域)
- 圆点: 6px, hover 展开显示 unit 名
- 当前 Unit: 圆点发光 + Unit 色
- 点击: 平滑滚动到对应 Unit
- 3 秒无交互: 收缩为更细的线, hover 展开
- 移动端: 隐藏, 用底部迷你导航替代

---

## 9. 状态管理

```typescript
interface OpticalBenchState {
  // 滚动
  scrollProgress: number    // [0, 1]
  currentUnit: number       // 0-5
  currentStation: number    // 全局 0-22

  // 物理链
  beamStates: BeamState[]   // 每站的入射/出射 Stokes 向量
  stationParams: Record<string, number>  // 每站的可调参数 (角度等)

  // 交互
  isDragging: boolean
  activeStation: string | null

  // 导航
  isNavExpanded: boolean
}

interface BeamState {
  stokes: [number, number, number, number]
  intensity: number
  wavelength: number
}
```

物理链计算: `beamStates[n+1].input = beamStates[n].output`, 每当 `stationParams` 变化时级联更新。

---

## 10. 组件架构

```
src/components/odyssey-scroll/
├── OdysseyScrollExperience.tsx   ← 主入口
├── ScrollBackground.tsx          ← 网格 + 粒子 + 氛围渐变
├── ScrollHero.tsx                ← 首屏 (光束动画 + 标题)
├── BeamConnector.tsx             ← 站间 SVG 弧线光路转接
├── UnitTransition.tsx            ← Unit 间全屏过渡
├── StationSection.tsx            ← 单站容器 (beam bar + demo + theory)
├── BeamPathBar.tsx               ← 水平光路带 (SVG 元件 + 光束 + 读数)
├── OdysseyDemoEmbed.tsx          ← Demo 组件包装器 (样式覆盖)
├── TheoryBlock.tsx               ← 渐进展开理论区
├── SideNav.tsx                   ← 右侧进度导航
├── optical-elements/             ← SVG 光学元件图标组件
│   ├── PolarizerSVG.tsx
│   ├── CrystalSVG.tsx
│   ├── GlassSurfaceSVG.tsx
│   ├── WaveplateSVG.tsx
│   └── ScatterMediumSVG.tsx
├── hooks/
│   ├── useBeamPhysics.ts         ← 物理链计算
│   ├── useStationScroll.ts       ← 站内 localT 计算
│   └── useSmoothScroll.ts        ← Lenis 封装
└── store.ts                      ← Zustand store
```

---

## 11. 性能策略

| 策略 | 实现 |
|------|------|
| Demo lazy load | `Suspense` + `lazy()`, 已有 |
| 视口外冻结 | `IntersectionObserver` 控制 demo 的 `pointer-events` 和动画 |
| 粒子用 CSS | `@keyframes` + `will-change: transform`, 不用 JS |
| SVG 光束 | CSS `background-position` 动画, 不用 requestAnimationFrame |
| 物理计算 | 仅在参数变化时计算, 不在 scroll 事件中 |
| 图片 | 无图片, 全 SVG + CSS |
| 滚动动画 | Framer Motion `useScroll` + `useTransform`, GPU 加速 |

---

## 12. 实现优先级

### Phase 1 — 骨架 + 光路 (核心体验)
- SmoothScroll + ScrollHero + ScrollBackground
- BeamPathBar (光束 + 第一个偏振片 SVG + 光束响应)
- StationSection 容器
- 物理链状态管理
- **验收: 滚动经过一个偏振片, 光束变暗, 数值更新**

### Phase 2 — Demo 嵌入 + 交互
- OdysseyDemoEmbed (样式覆盖, 嵌入 5 个 Unit 0 demo)
- BeamPathBar 拖拽交互
- Demo 状态 ↔ BeamPathBar 双向绑定
- TheoryBlock 渐进展开

### Phase 3 — 全站 + 打磨
- 剩余 18 站 Demo 嵌入
- 所有 SVG 光学元件
- Unit 过渡动画
- SideNav
- 站间 BeamConnector
- 响应式适配
