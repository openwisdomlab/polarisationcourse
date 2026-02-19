# Drift World — 偏振光漫游世界 · 设计文档

> 无限画布 + 一束光 + 自由探索 = 发现 23 个偏振现象

---

## 核心概念

一个无限 2D 画布，用户拖拽漫游。一束光从左侧射出横穿世界——这是永恒不变的线索。世界由 6 个视觉主题区域组成，每个区域内有发现点沿光路分布。用户将光学元件放到光路上，光束实时变化。当物理状态满足特定条件时，对应发现点"绽放"，展开交互式 demo 和理论。

**与前三次的本质区别：** 不是"滚动看内容"，而是"在世界中实验，由物理结果触发内容"。

---

## 空间模型

世界尺寸约 6000×1200 虚拟单位。光束固定在 y=600（垂直中心），从 x=0 射向 x=6000。视口约 1400×800，可拖拽 + 缩放 (0.5x–2x)。

```
[Zone 0 amber]     [Zone 1 cyan]      [Zone 2 violet]   [Zone 3 emerald]  [Zone 4 pink]     [Zone 5 blue]
x: 0 ─── 1000      1000 ─── 2000      2000 ─── 2600     2600 ─── 3400     3400 ─── 4200     4200 ─── 5400

☀ ═══[slot]═══[slot]═══[slot]═══[slot]═══[slot]═══[slot]═══[slot]═══ ... ═══[slot]═══ →
     ◇    ◇    ◇    ◇    ◇    ◇    ◇    ◇    ◇    ... ◇
```

- `═══` = beam segments (visual changes between elements)
- `[slot]` = element placement slot (~23 total, one per phenomenon)
- `◇` = discovery node (near each slot, on either side of beam)

---

## 导航

- **拖拽漫游**: pointer drag 移动画布，松手带惯性衰减
- **缩放**: wheel/pinch, 0.5x – 2x
- **Minimap**: 右下角，显示整个世界 + 视口框 + 已解锁节点（亮点）
- **快捷跳转**: 点击 minimap 区域 → 平滑飞往

实现: 画布是一个 `<div>` 用 CSS `transform: translate(panX, panY) scale(zoom)` 控制。惯性用 `requestAnimationFrame` + velocity damping。

---

## 光束系统

### 结构

光束由 N+1 段 beam segments 组成（N = 已放置元件数）。每段是一个 div/SVG rect：
- 位置: 从上一个元件 x 到下一个元件 x
- 宽度(高度): `max(1px, 6px * segment.intensity)`
- 颜色: 由 Stokes 向量映射（线偏振=区域色, 圆偏振=彩虹渐变, 消光=暗红渐灭）
- 动画: CSS `background-position` 流动效果

### 元件槽位

光路上 23 个预设槽位，用淡灰色虚线圆圈标记。每个槽位关联一个物理概念和一个发现点。

槽位状态:
- `empty`: 虚线圆圈 + "+" 提示
- `occupied`: 显示元件 SVG，光束在此处变化
- `highlighted`: 当用户拖拽元件经过时高亮

### 元件工具栏

屏幕底部固定（不随画布移动）:

```
┌──────────────────────────────────────────────────┐
│  [偏振片×∞] [波片×∞] [晶体×∞] [玻璃面×∞] [散射体×∞] │
└──────────────────────────────────────────────────┘
```

每种元件无限供应。拖拽到光路 → 吸附到最近的空槽位。已放置的元件可拖走（移除）或拖到其他槽位。

### 物理计算

Mueller 矩阵级联（复用已有 `useBeamPhysics`）:
- 输入: unpolarized light [1,0,0,0]
- 逐槽位应用: `MuellerMatrix.linearPolarizer(angle)` / `.quarterWavePlate(angle)` / etc.
- 每个元件可调角度（拖拽旋转 or 滑条）
- 输出: 每段 beam 的 `BeamState { stokes, intensity }`

---

## 发现点系统

### 结构

每个发现点 = 一个浮动节点，位于对应槽位旁边（光路上方或下方，交替排列）。

### 状态机

```
locked (灰色脉动 "?")
  ↓ [物理条件满足]
ready (发光 "!", 弹跳动画)
  ↓ [用户点击]
open (面板展开, demo + 理论显示)
  ↓ [用户关闭]
discovered (✓ 标记, 金色, 保持可再打开)
```

### 解锁条件示例

| 发现点 | 需要的元件 | 物理条件 |
|-------|-----------|---------|
| 偏振介绍 | 1个偏振片 | I/I₀ < 0.6 (光减弱了) |
| Malus 定律 | 2个偏振片 | I/I₀ 随角度变化 (用户旋转过偏振片) |
| 偏振锁 | 3个偏振片 | 中间偏振片使光"复活" |
| 双折射 | 1个晶体 | 光束分裂为二 |
| 圆偏振 | 偏振片+波片 | |S3/S0| > 0.8 |
| Brewster 角 | 1个玻璃面 | 反射光完全偏振 |
| 完全消光 | 2个正交偏振片 | I/I₀ < 0.01 |
| 散射退偏 | 散射体 | DoP < 0.3 |

简单发现只需放置元件即可；高级发现需要特定组合和角度。

### 展开面板

发现点被点击后，在画布空间内就地展开一个面板（不是 DOM 浮层）:
- 绝对定位在画布坐标中
- 包含: 标题(EN+ZH), demo 组件 (Suspense lazy), KaTeX 公式, 渐进理论
- 背景: glassmorphism (`backdrop-filter: blur`)
- 关闭按钮 → 收回为已发现节点

面板展开时，画布不锁定——用户可以继续拖拽漫游，面板跟随画布移动。

---

## 视觉设计

### 背景

- 基底: `#050510`
- 每个区域: 超大径向渐变（区域色 opacity 0.03-0.05），边界渐变过渡
- 点阵网格: 间距 48px，opacity 0.03，区域色微调
- 环境粒子: CSS 动画，每区域 20-30 个，区域色

### 光束

- 流动渐变动画 (CSS `background-position` 循环)
- 发光: `box-shadow: 0 0 {intensity*8}px {color}{intensity*40 hex}`
- E 场箭头: 沿光束每 40px 一个小箭头，方向=偏振角度，opacity=intensity

### 元件 SVG

复用已有的 5 种 SVG（PolarizerSVG, CrystalSVG, GlassSurfaceSVG, WaveplateSVG, ScatterMediumSVG）。放置在光路上时尺寸约 60×90px。可旋转。

### 发现点

- Locked: 16px 灰色圆 + "?" 文字, pulse 动画
- Ready: 20px 区域色圆 + "!" 文字, bounce 动画, glow
- Open: 展开面板 (300-500px 宽)
- Discovered: 12px 金色圆 + "✓"

---

## 进度系统

- 左上角: `12/23 Discovered` (font-mono, 小号)
- Minimap 上已发现节点为亮色，未发现为暗色
- 全部发现后: 特殊动画（光束变彩虹？世界全亮？）

---

## 组件架构

```
src/components/drift-world/
├── DriftWorldExperience.tsx     ← 主入口 (画布 + UI 层)
├── InfiniteCanvas.tsx           ← 拖拽/缩放画布容器
├── BeamSystem.tsx               ← 光束段 + 槽位 + E场箭头
├── ElementToolbar.tsx           ← 底部固定工具栏 (拖拽源)
├── SlotMarker.tsx               ← 单个元件槽位 (空/占用状态)
├── DiscoveryNode.tsx            ← 发现点 (locked/ready/open/discovered)
├── DiscoveryPanel.tsx           ← 展开的 demo + 理论面板
├── ZoneBackground.tsx           ← 区域背景 (渐变 + 粒子)
├── Minimap.tsx                  ← 右下角小地图
├── ProgressIndicator.tsx        ← 左上角进度
├── optical-elements/            ← 复用已有 SVG
├── hooks/
│   ├── useCanvasNavigation.ts   ← 拖拽/缩放/惯性逻辑
│   ├── useBeamPhysics.ts        ← Mueller 链计算 (复用/改造)
│   ├── useDiscoveryEngine.ts    ← 解锁条件判断
│   └── useDragDrop.ts           ← 元件拖放逻辑
├── data/
│   ├── worldLayout.ts           ← 槽位坐标, 区域边界, 发现点位置
│   └── discoveryConditions.ts   ← 每个发现点的解锁条件
└── store.ts                     ← Zustand (画布位置, 元件放置, 发现进度)
```

---

## 状态管理

```typescript
interface DriftWorldState {
  // 画布
  panX: number
  panY: number
  zoom: number

  // 元件放置: slotIndex → { elementType, angle }
  placedElements: Map<number, { type: ElementType; angle: number }>

  // 物理
  beamSegments: BeamSegment[] // 每段的 Stokes + intensity

  // 发现
  discoveries: Map<string, 'locked' | 'ready' | 'discovered'>
  openPanel: string | null // 当前展开的发现点 ID

  // Actions
  pan: (dx: number, dy: number) => void
  setZoom: (z: number) => void
  placeElement: (slotIndex: number, type: ElementType, angle: number) => void
  removeElement: (slotIndex: number) => void
  setElementAngle: (slotIndex: number, angle: number) => void
  unlockDiscovery: (id: string) => void
  openDiscovery: (id: string | null) => void
  markDiscovered: (id: string) => void
}
```

---

## 实现分期

### Phase 1 — 画布 + 光束 + 拖放 (核心循环)
- InfiniteCanvas (拖拽/缩放)
- BeamSystem (光束段渲染 + 槽位标记)
- ElementToolbar (底部工具栏)
- 拖放: 从工具栏拖元件到槽位
- 物理链: 放置偏振片 → 光束变暗
- **验收: 拖一个偏振片到光路上，光束变暗。拖第二个正交的，光束消失。**

### Phase 2 — 发现系统 + Demo 嵌入
- DiscoveryNode + DiscoveryPanel
- 解锁条件引擎
- 嵌入现有 demo 组件
- 渐进理论 (TheoryBlock 复用)
- **验收: 让光消失 → Malus 发现点绽放 → 点击 → MalusLawDemo 展开**

### Phase 3 — 世界氛围 + 导航 + 打磨
- ZoneBackground (6 区域氛围)
- Minimap
- ProgressIndicator
- 惯性漫游打磨
- 移动端触控适配
- 元件旋转交互
