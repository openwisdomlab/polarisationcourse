# "理论和模拟"模块重新设计方案

> 基于5个审查代理的全面分析（设计一致性、物理引擎对齐、模块架构、交互设计、可视化清晰度）

---

## 核心问题诊断

| 维度 | 严重程度 | 发现 |
|------|---------|------|
| **信息过载** | 🔴 严重 | 多数演示一次性展示所有公式、图表、控件，缺乏渐进披露 |
| **死代码** | 🔴 严重 | ~8,800行死代码（29%），8个废弃basics/文件从未删除 |
| **DemosPage巨石** | 🔴 严重 | 2,653行单文件，无懒加载，19个演示全部eager import |
| **引擎脱节** | 🟡 中等 | 12个演示有本地物理计算，应使用统一引擎；Unit 5全部脱节 |
| **设计不一致** | 🟡 中等 | 5个演示缺DemoMainLayout，3个不用useDemoTheme，VirtualPolarizerLens零i18n |
| **难度分层缺失** | 🔴 严重 | 仅26%的演示实现3级难度系统（8/31），GuidedExploration使用率0% |
| **交互混乱** | 🟡 中等 | 4个演示流程混乱（ThreePolarizers/AragoFresnel等），平均5.2个控件/演示 |
| **物理Bug** | 🟡 中等 | AragoFresnel可见度公式与强度公式不一致 |
| **新组件未使用** | 🟡 中等 | GuidedExploration(0 imports)和GameOriginBanner(0 imports)从未集成 |
| **Canvas无加载态** | 🟡 中等 | 5个R3F演示中仅1个(StokesVector)使用Suspense/lazy |
| **WaveplateDemo独立难度系统** | 🟡 中等 | 使用自建basic/intermediate/advanced而非平台DifficultyStrategy |

---

## 设计原则

### 1. 信息精简 —— "一屏一概念"
- 每个演示只聚焦 **一个核心物理概念**
- 初始视图仅展示：主可视化 + 1-2个关键控件
- 公式、图表、详细数据通过难度分层逐步解锁
- **规则：初始可见控件 ≤ 3个**

### 2. 渐进披露 —— "发现式学习"
- Foundation（基础）: 纯交互，无公式，WhyButton揭示简单解释
- Application（应用）: 任务驱动，引导式探索，关键公式
- Research（研究）: 完整数学、数据导出、Jones/Mueller矩阵

### 3. 物理引擎统一 —— "单一真相源"
- 所有物理计算来自 `src/core/physics/unified/`
- 禁止本地重复计算（除时域动画和SVG几何）
- 可视化输出必须直接反映引擎计算结果

### 4. 设计一致 —— "统一视觉语言"
- 所有演示必须使用 DemoMainLayout + useDemoTheme
- 统一圆角：面板 `rounded-2xl`，按钮 `rounded-lg`
- 统一SVG滤镜：使用共享 SVGFilters
- 统一i18n：迁移至 `t()` keys，消除 `isZh` ternary

### 5. 模块化 —— "可维护架构"
- DemosPage拆分为8个聚焦模块
- 每个演示按需懒加载
- 单文件 ≤ 500行，超过则拆分

---

## 实施计划

### Phase 0: 清理死代码（预计省 ~8,800 行）

**删除废弃basics/文件：**
| 文件 | 行数 | 原因 |
|------|------|------|
| `basics/PolarizationLockDemo.tsx` | 1,238 | 已迁移到Optical Design Studio |
| `basics/ThreePolarizersDemo.tsx` | 1,196 | 已合并到PolarizationTypesUnifiedDemo |
| `basics/MalusLawGraphDemo.tsx` | 669 | 已合并到unit1/MalusLawDemo |
| `basics/ElectromagneticSpectrumDemo.tsx` | 637 | 已合并到ElectromagneticWaveDemo |
| `basics/PolarizationTypesDemo.tsx` | 425 | 已合并到PolarizationTypesUnifiedDemo |
| `basics/LightWaveDemo.tsx` | 389 | 已合并到ElectromagneticWaveDemo |
| `basics/PolarizerScenarioDemo.tsx` | 397 | 无任何导入 |
| `basics/VirtualPolarizerLens.tsx` | 606 | 仅被已死PolarizerScenarioDemo导入 |

**删除未使用的共享组件：**
| 文件 | 行数 | 原因 |
|------|------|------|
| `DemoCanvas.tsx` | 99 | 仅在barrel export，无实际使用 |
| `Demo2DCanvas.tsx` | 172 | 同上 |
| `unit3/MediaGalleryPanel.tsx` | 728 | 0 imports |
| `LifeSceneIllustrations.tsx` | 1,663 | 仅在barrel export |

**决策点 - GuidedExploration & GameOriginBanner：**
- 都是新建但从未集成（0 imports）
- 选项A: 删除（如果不打算使用）
- 选项B: 保留并在Phase 3集成到演示中 ← **推荐**

---

### Phase 1: DemosPage 拆分（2,653行 → ~400行）

**提取为独立模块：**
```
src/data/demoRegistry.ts        (~400行) — DEMOS, UNITS, DemoItem类型
src/data/demoInfoConfig.ts      (~200行) — getDemoInfo用builder模式
src/data/demoSearch.ts          (~200行) — 搜索逻辑
src/components/demos/demoDiagrams.tsx  (~150行) — 10个SVG缩略图
src/pages/demos/DemoSidebar.tsx        (~300行) — 导航侧栏
src/pages/demos/DemoContent.tsx        (~350行) — 主内容区
src/pages/demos/DemoInfoPanel.tsx      (~200行) — 理论/问题/DIY卡片
src/pages/demos/DifficultyBar.tsx      (~100行) — 难度选择器
```

**添加懒加载：**
```typescript
// 当前 (eager - 全部加载)
import { MalusLawDemo } from '@/components/demos/unit1/MalusLawDemo'

// 改为 (lazy - 按需加载)
const MalusLawDemo = React.lazy(() => import('@/components/demos/unit1/MalusLawDemo'))
```

---

### Phase 2: 物理引擎统一（12个演示需要迁移）

**优先级 CRITICAL：**
| 演示 | 重复内容 | 修复方式 |
|------|---------|---------|
| `unit5/PolarizationCalculatorDemo` | 200+行 Complex/Mueller/Jones/Stokes | 全部替换为引擎的 MuellerMatrix, Complex, CoherencyMatrix |
| `unit5/MuellerMatrixDemo` | MuellerMatrix 所有工厂方法 | 直接替换 - 引擎有相同接口 |
| `unit5/StokesVectorDemo` | Stokes计算 | 使用 CoherencyMatrix.toStokes/fromStokes |

**优先级 HIGH：**
| 演示 | 重复内容 | 修复方式 |
|------|---------|---------|
| `unit4/RayleighScatteringDemo` | 3个Rayleigh函数 | 从ScatteringPhysics导入 |
| `unit4/MieScatteringDemo` | Mie函数 + wavelengthToRGB | 从ScatteringPhysics导入，提升高级函数到引擎 |
| `unit3/ChromaticDemo` | wavelengthToRGB + 透射公式 | 使用DispersiveWavePlate |
| `unit1/WaveplateDemo` | 遗留WaveOptics依赖 | 迁移到统一引擎 |
| `unit2/BrewsterDemo` | 遗留WaveOptics (Sellmeier) | 迁移到统一引擎 |

**Bug修复：**
| 演示 | Bug | 修复 |
|------|-----|------|
| `unit1/AragoFresnelDemo` | 可见度函数 `|cos(θ1-θ2)|` 与强度公式 `cos²((θ1-θ2)/2)` 不一致 | 统一使用 `cos²((θ1-θ2)/2)` |
| `unit5/PolarimetricMicroscopyDemo` | 退偏指数公式与引擎标准不同 | 使用引擎的 depolarizationIndex() |

---

### Phase 3: 设计系统统一

**3a. 强制DemoMainLayout使用：**
5个缺失的演示：JonesMatrixDemo, StokesVectorDemo, PolarizationCalculatorDemo + 2个已清理

**3b. 强制useDemoTheme：**
3个缺失：PolarizerScenarioDemo(已清理), JonesMatrixDemo, PolarizationCalculatorDemo

**3c. SVG滤镜统一：**
- 移除20个文件中的36个重复 `feGaussianBlur` 定义
- 使用 DemoLayout 中已有的 `SVGFilters` 组件
- 为每个演示的 filter/pattern ID 添加命名空间前缀防止冲突

**3d. 圆角统一：**
- 面板/卡片: `rounded-2xl`
- 内联按钮: `rounded-lg`
- 全宽按钮: `rounded-2xl`
- Slider轨道: `rounded-full`

**3e. i18n统一：**
- 将 `isZh ? '...' : '...'` 模式迁移到 `t()` keys
- VirtualPolarizerLens（如保留）需完整i18n
- 所有新文本使用i18n keys

---

### Phase 4: 难度分层全面覆盖（23% → 100%）

**目前已有难度分层的演示（5个）：**
- MalusLawDemo, ElectromagneticWaveDemo, PolarizationTypesUnifiedDemo
- BirefringenceDemo, FresnelDemo（刚添加）, OpticalRotationDemo, StokesVectorDemo

**需要添加的演示（每个设计3层内容）：**

| 演示 | Foundation 精简 | Application 任务 | Research 扩展 |
|------|----------------|-----------------|--------------|
| BrewsterDemo | "反射光可以变成偏振光" | 找到布儒斯特角 | 边界条件推导 |
| WaveplateDemo | "波片改变光的状态" | QWP/HWP实验 | Jones矩阵 + 色散 |
| AragoFresnelDemo | "偏振影响干涉" | 调节偏振观察条纹 | 相干矩阵分析 |
| ChromaticDemo | "双折射产生彩色" | Michel-Lévy图 | 光谱Jones求解器 |
| AnisotropyDemo | "晶体折射率取决于方向" | 测量双折射 | 折射率椭球 |
| RayleighScatteringDemo | "蓝天的原因" | 日出vs正午颜色 | 偏振度测量 |
| MieScatteringDemo | "大粒子散射不分颜色" | 比较Mie与Rayleigh | 尺寸参数分析 |
| MonteCarloScatteringDemo | "光在介质中随机行走" | 模拟参数影响 | 统计分析 |
| JonesMatrixDemo | "矩阵描述光学元件" | 组合元件计算 | 本征态分析 |
| MuellerMatrixDemo | "Mueller可描述部分偏振" | 测量Mueller矩阵 | 极化分解 |
| PolarizationCalculatorDemo | 隐藏高级功能 | 分步计算指导 | 完整计算器 |
| PolarimetricMicroscopyDemo | "偏振显微镜看晶体" | 旋转样品观察 | 定量分析 |
| PolarizationStateDemo | "偏振态可视化" | 辨认偏振类型 | Poincaré球映射 |
| InteractiveOpticalBenchDemo | "光学工作台" | 搭建实验 | 定量测量 |
| PolarizationIntroDemo | "光是横波" | 偏振片实验 | 偏振度测量 |

---

### Phase 5: 信息精简具体措施

**每个演示的初始视图规则：**
1. **标题区**：DemoHeader（标题 + 副标题）
2. **核心公式**：FormulaHighlight（仅Application/Research可见）
3. **主可视化**：VisualizationPanel（占据主视觉空间）
4. **关键控件**：最多3个SliderControl（Foundation只显示1-2个）
5. **结果指示**：最多2个StatCard
6. **详细图表**：ChartPanel（仅Application/Research可见）
7. **知识卡片**：InfoGrid（折叠或在底部，不与主视觉竞争）

**信息密度规则：**
- Foundation: 0个公式 + 0个图表 + ≤2个控件 + ≤1个StatCard
- Application: 1个公式 + ≤2个图表 + ≤4个控件 + ≤3个StatCard
- Research: 完整公式 + 所有图表 + 所有控件 + DataExportPanel

**集成GuidedExploration（设计"aha moment"）：**

| 演示 | 引导序列 | "aha moment" |
|------|---------|-------------|
| **ThreePolarizersDemo** | P1=0°,P3=90°→看到全暗 → 启用P2=45° → 光出现了！ | 三偏振片悖论 |
| **MalusLawDemo** | 旋转偏振片 → 90°全暗 → 发现cos²规律 | 消光现象 |
| **OpticalRotationDemo** | 空管基线 → 加样品 → 旋转消光点移动 → 鉴定物质 | 神秘物质鉴定 |
| **FresnelDemo** | 改变入射角 → 布儒斯特角p分量消失 → 全反射 | 布儒斯特角 |
| **PolarizationStateDemo** | 预设切换(线/圆/椭圆) → 动画过渡 → 解锁滑块 | 偏振态连续变化 |
| **MuellerMatrixDemo** | 看到元件变换光 → 揭示背后矩阵 → 自己构建 | 矩阵=光变换器 |
| **MonteCarloDemo** | "激光射入牛奶" → 模拟光子路径 → 偏振变化 | 多次散射退偏 |
| **MieScatteringDemo** | Rayleigh(蓝)→Mie(白) 对比 → 发现尺寸依赖 | 为什么云是白的 |

**7条通用交互规则：**
1. 每个演示必须接受 `difficultyLevel` 并使用 `DifficultyGate`
2. 有2+滑块的演示必须有 PresetButtons
3. Foundation模式最多3个可见控件
4. 每个演示标配Reset按钮
5. R3F Canvas演示必须用 Suspense/lazy（当前仅1/5做到）
6. 同一参数不同时提供拖拽+滑块（按难度分）
7. 4+控件的演示必须使用 GuidedExploration

**5条教育设计原则：**
1. **"先玩后学"** — Foundation = 零公式，纯交互
2. **"可预测的惊喜"** — 建立预期，然后反转（三偏振片悖论）
3. **"一个滑块讲一个故事"** — 最好的演示有一个主滑块（MalusLaw角度0-90）
4. **"真实世界优先"** — PolarizationLock成功因为它有真实场景
5. **"渐进深度，非渐进杂乱"** — 难度层增加理解深度，不是更多控件

---

### Phase 6: WaveplateDemo独立难度系统迁移

WaveplateDemo（最大文件1,648行）使用自建的 `basic/intermediate/advanced` 难度系统，
与平台的 `DifficultyStrategy` (`foundation/application/research`) 不一致。
- 迁移到平台系统
- 合并非理想参数（extinction ratio等）到Research层

---

### Phase 7: 大文件拆分

**>1000行的演示拆分策略：**
每个大演示拆分为3个文件：
```
unit1/WaveplateDemo/
  index.tsx           — 主组件 (导出, 状态管理, 布局)
  WaveplateViz.tsx    — 可视化 (SVG/Canvas/R3F)
  waveplatePhysics.ts — 物理计算桥接 (调用统一引擎)
```

| 演示 | 当前行数 | 拆分后主文件 |
|------|---------|------------|
| WaveplateDemo | 1,648 | ~400 + ~600 viz + ~200 physics |
| FresnelDemo | 1,358 | ~350 + ~500 viz + ~150 physics |
| OpticalRotationDemo | 1,354 | ~350 + ~500 viz + ~150 physics |
| BrewsterDemo | 1,236 | ~300 + ~450 viz + ~150 physics |
| PolarizationCalculatorDemo | 1,093 | ~300 + ~400 viz + ~100 physics |
| StokesVectorDemo | 1,029 | ~300 + ~400 viz + ~100 physics |

---

## 验证标准

实施后每个演示必须满足：
- [ ] 使用 DemoMainLayout + useDemoTheme（不直接用useTheme）
- [ ] 所有物理计算来自统一引擎（无本地重复，除时域动画）
- [ ] 实现3级难度分层（DifficultyGate + WhyButton/TaskMode/DataExport）
- [ ] Foundation模式 ≤ 3个控件，0个公式
- [ ] 有2+滑块时必须有PresetButtons
- [ ] R3F Canvas使用 React.lazy + Suspense
- [ ] 无硬编码中文/英文（使用i18n `t()` keys）
- [ ] 主文件 ≤ 500行（拆分为viz+physics子模块）
- [ ] SVG使用共享滤镜（SVGFilters），滤镜ID添加命名空间
- [ ] 圆角统一（面板rounded-2xl，按钮rounded-lg）
- [ ] `npm run build` 零错误
- [ ] 现有测试全部通过

---

## 实施顺序

| 顺序 | Phase | 预估影响 | 文件数 |
|------|-------|---------|--------|
| 1 | Phase 0: 清理死代码 | -8,800行 | ~12文件删除 |
| 2 | Phase 1: DemosPage拆分+懒加载 | 可维护性+性能 | ~8新文件 |
| 3 | Phase 2: 物理引擎统一 | 科学准确性 | ~12文件修改 |
| 4 | Phase 3: 设计系统统一 | 视觉一致性 | ~20文件修改 |
| 5 | Phase 4: 难度分层100%覆盖 | 教育体验 | ~23文件修改 |
| 6 | Phase 5: 信息精简+"aha moment" | 减少信息过载 | ~22文件修改 |
| 7 | Phase 6: WaveplateDemo迁移 | 系统一致性 | 1文件 |
| 8 | Phase 7: 大文件拆分 | 代码可维护性 | ~6演示拆分 |

---

## 预期成果

| 指标 | 当前 | 目标 |
|------|------|------|
| 总代码量 | 30,714行 | ~22,000行 (-29%) |
| DemosPage.tsx | 2,653行 | ~400行 (-85%) |
| 死代码 | ~8,800行 | 0 |
| 文件>1000行 | 11个 | 0个 |
| 难度分层覆盖 | 26% (8/31) | 100% |
| GuidedExploration使用 | 0% (0/31) | 8+个核心演示 |
| 物理引擎对齐 | 65% | 100% |
| 设计一致性评分 | 平均7.8/10 | 9.0+/10 |
| 交互质量评分 | 5.5/10 | 9.0/10 |
| 懒加载 | 0个 | 全部22个 |
| R3F Suspense覆盖 | 20% (1/5) | 100% |
| SVG滤镜重复 | 36处/20文件 | 1个共享源 |
