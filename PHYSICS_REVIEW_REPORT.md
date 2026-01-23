# PolarCraft 科学性与系统性深度审查报告

## Critical Issue Report (问题诊断报告)

**审查日期**: 2026-01-23
**审查者**: Claude (计算光学专家视角)

---

## 1. 核心物理引擎的"精神分裂"问题 (Critical Physics Fragmentation)

### 发现的冗余文件

| 文件路径 | 代码行数 | 功能 | 使用场景 |
|---------|--------|------|---------|
| `src/core/LightPhysics.ts` | ~1,100 | 3D游戏物理引擎 | 3D voxel game |
| `src/core/WaveOptics.ts` | ~1,474 | 精确波动光学 (Jones/Mueller/Stokes) | Demos, Optical Studio |
| `src/core/JonesCalculus.ts` | ~1,100 | Jones矢量/矩阵运算 | 被多处引用 |
| `src/lib/opticsPhysics.ts` | 244 | 通用光学计算 | 2D游戏、复用 |
| `src/core/game2d/physics.ts` | ~100 | 2D游戏光追 | 2D puzzle game |

### 重复的物理逻辑 (Malus's Law 三处实现)

**位置1**: `src/core/LightPhysics.ts:80-99`
```typescript
static applyMalusLaw(inputIntensity, inputAngle, filterAngle) {
  // 使用 Math.floor 向下取整 - 会丢失精度
  return Math.floor(inputIntensity * transmissionFactor);
}
```

**位置2**: `src/lib/opticsPhysics.ts:34-42`
```typescript
export function applyMalusLaw(inputIntensity, inputPolarization, filterAngle) {
  // 返回浮点数 - 精度更高
  return inputIntensity * transmission
}
```

**位置3**: `src/core/game2d/physics.ts:33` (相同公式)

### 严重问题: 两套物理模型的命名混淆

**文件**: `src/core/LightPhysics.ts:13-15`

```typescript
// quarterWave: Acts as 45° rotator (NOT true QWP, no circular polarization)
// halfWave: Acts as 90° rotator (NOT true HWP, no fast-axis rotation)
// splitter: 90° separation like PBS/Wollaston (NOT calcite ~6° walk-off)
```

**问题**: 代码文档承认了简化，但 **UI 标签和游戏内描述可能仍使用科学术语**，学生会误认为这是真实的物理行为。

### 科学性检查 - 波片波长相关性

✅ **已实现** 在 `src/core/WaveOptics.ts:179-186`:
```typescript
export function waveplateRetardation(
  designWavelength: number,
  actualWavelength: number,
  nominalRetardation: number,
  birefringenceRatio: number = 1
): number {
  return nominalRetardation * (designWavelength / actualWavelength) * birefringenceRatio;
}
```

❌ **但未在游戏引擎中使用**: `LightPhysics.ts` 中的 `processQuarterWaveBlock` 和 `processHalfWaveBlock` 硬编码为 45°/90° 旋转，**完全忽略波长参数**。

---

## 2. 模块一：实验内容与历史故事 (Experiments & Chronicles)

### 当前状态

**文件**: `src/data/timeline-events.ts` (262.7 KB)

这是一个**纯叙述性的历史数据库**，不是可交互的物理模拟。

### 问题: "重做典型实验" 只是动画，不是模拟

**现状**:
- 1669年冰洲石实验: 只有描述文本，没有可调参数
- 用户无法改变入射角、偏振方向等参数来观察双折射

### 科学建议

将历史实验接入 `core/physics` 引擎:

```typescript
// 建议: 在 timeline-events.ts 中添加可交互参数
interface InteractiveExperiment {
  baseSetup: {
    incidentAngle: number;
    polarization: number;
    material: 'calcite' | 'quartz';
  };
  adjustableParams: string[]; // ['incidentAngle', 'polarization']
  physicsEngine: 'birefringence' | 'malus' | 'fresnel';
}
```

---

## 3. 模块二：光学器件与典型光路 (Optical Arsenal)

### 严重问题: 光学工作台使用理想偏振片

**文件**: `src/stores/opticalBenchStore.ts:1378-1401`

```typescript
case 'polarizer': {
  const polarizerAngle = nextComponent.properties.angle ?? 0
  const matrix = polarizerMatrix(polarizerAngle)  // ← 使用理想 Jones 矩阵
  const result = applyJonesTransformation(ray.jonesVector, matrix)
  // ...
}
```

**搜索结果**:
```
TYPICAL_POLARIZER 在 opticalBenchStore.ts 中: 0 次匹配
extinctionRatio 在 opticalBenchStore.ts 中: 0 次匹配
```

### 非理想器件参数已定义但未使用

**定义位置**: `src/core/WaveOptics.ts:193-270`

```typescript
export interface NonIdealPolarizerParams {
  extinctionRatio: number;        // 消光比 (典型值: 10000:1)
  principalTransmittance: number; // 主透过率 (典型值: 0.88)
  angularAcceptance?: number;     // 角度接受范围
}

export const TYPICAL_POLARIZER: NonIdealPolarizerParams = {
  extinctionRatio: 10000,
  principalTransmittance: 0.88,  // ← 12% 光损耗!
  angularAcceptance: 20,
};
```

**使用位置**: 仅在 `MalusLawDemo.tsx` 的 research 模式中使用

### 建议: 在光学工作台添加"器件品质"选项

```typescript
// opticalBenchStore.ts 建议修改
interface BenchComponent {
  properties: {
    // ... existing
    deviceQuality?: 'ideal' | 'typical' | 'low-quality';
  }
}
```

---

## 4. 模块三：基本理论与计算模拟 (Theory & Simulation)

### BrewsterDemo.tsx - 物理准确

**文件**: `src/components/demos/unit2/BrewsterDemo.tsx:52-75`

```typescript
function calculateBrewster(theta: number, n1: number, n2: number) {
  const sinTheta2 = (n1 / n2) * sinTheta1  // Snell's Law ✓
  const rs = (n1 * cosTheta1 - n2 * cosTheta2) / (n1 * cosTheta1 + n2 * cosTheta2) // ✓
  const rp = (n2 * cosTheta1 - n1 * cosTheta2) / (n2 * cosTheta1 + n1 * cosTheta2) // ✓
  return { Rs: rs * rs, Rp: rp * rp, ... }
}
```

**结论**: 使用完整的菲涅尔方程，包含 Sellmeier 色散模型。**科学准确**。

### BirefringenceDemo - 物理准确

**文件**: `src/components/demos/unit1/BirefringenceDemo.tsx`

- 正确使用方解石折射率: n_o = 1.6584, n_e = 1.4864
- 正确计算 o光/e光强度分配: I_o = I₀ × cos²θ, I_e = I₀ × sin²θ

### 潜在问题: FresnelDemo 缺少波长依赖

**文件**: `src/components/demos/unit2/FresnelDemo.tsx`

虽然 BrewsterDemo 有 Sellmeier 模型，但 FresnelDemo 使用固定折射率，不显示色散效应。

---

## 5. 模块四：课程内容的游戏化 (Gamification)

### 2D游戏双折射支持 - 正确

**文件**: `src/core/game2d/physics.ts:46-62`

```typescript
export function getSplitterOutputs(inputIntensity, inputPolarization, inputDirection) {
  const oIntensity = inputIntensity * Math.pow(Math.cos(radians), 2)  // o光 ✓
  const eIntensity = inputIntensity * Math.pow(Math.sin(radians), 2)  // e光 ✓
  // e光偏转90°
  return [
    { intensity: oIntensity, polarization: 0, direction: inputDirection },
    { intensity: eIntensity, polarization: 90, direction: eDirection },
  ]
}
```

### 物理上限 - 游戏模型的局限性

| 物理特性 | 精确模型 (WaveOptics) | 游戏模型 (LightPhysics) | 差异 |
|---------|---------------------|----------------------|------|
| 相位 | 连续 0-2π 弧度 | 二值 ±1 | **简化** |
| 偏振 | Jones 矢量 (复数) | 离散角度 (0/45/90/135) | **简化** |
| 波片 | 真实相位延迟 | 简单旋转器 | **错误** |
| 双折射分离角 | ~6° (方解石) | 90° (PBS模型) | **不同器件** |
| 干涉 | I₁+I₂+2√(I₁I₂)cos(δ) | 二值相加/相消 | **简化** |

### 教学风险

**问题**: 游戏中的 `quarterWave` 和 `halfWave` 块表现为简单的 45°/90° 偏振旋转器，**而非真正的相位延迟器**。学生可能会误认为:
- λ/4 波片 = 45° 旋光器 ❌
- λ/2 波片 = 90° 旋光器 ❌

**正确理解应为**:
- λ/4 波片: 将线偏振转为圆偏振 (相位差 π/2)
- λ/2 波片: 反射偏振方向关于快轴对称 (相位差 π)

---

## 6. 模块六：虚拟课题组 (Virtual Lab)

### 数据噪声使用均匀分布，非高斯分布

**文件**: `src/components/lab/dataAnalysis.ts:238-243`

```typescript
export function addNoise(data: DataPoint[], noiseLevel: number = 5): DataPoint[] {
  return data.map(point => ({
    ...point,
    intensity: Math.max(0, point.intensity + (Math.random() - 0.5) * 2 * noiseLevel),
    //                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //                                        均匀分布 [-noiseLevel, +noiseLevel]
  }))
}
```

**科学问题**: 真实实验数据的噪声主要来源于:
1. **散粒噪声 (Shot noise)** - 泊松分布
2. **热噪声 (Johnson noise)** - 高斯分布
3. **系统噪声** - 可能有偏移

当前实现使用均匀分布，会产生"过于方正"的误差分布。

### 科学建议: 使用 Box-Muller 变换实现高斯噪声

```typescript
function gaussianRandom(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

export function addRealisticNoise(data: DataPoint[], params: {
  readNoise: number;     // 读出噪声 (高斯)
  shotNoiseFactor: number; // 散粒噪声系数 (√I)
  systematicBias: number;  // 系统偏移
}): DataPoint[] {
  return data.map(point => {
    const shotNoise = gaussianRandom(0, Math.sqrt(point.intensity) * params.shotNoiseFactor);
    const readNoise = gaussianRandom(0, params.readNoise);
    const newIntensity = point.intensity + shotNoise + readNoise + params.systematicBias;
    return { ...point, intensity: Math.max(0, newIntensity) };
  });
}
```

### 缺少误差条 (Error Bars)

**文件**: `src/stores/labStore.ts:10-14`

```typescript
export interface DataPoint {
  angle: number
  intensity: number
  id: string
  // ❌ 缺少: uncertainty?: number  // 测量不确定度
}
```

真实的实验数据记录应包含每个测量点的不确定度。

---

## 重构行动清单 (Refactoring Action List)

| 优先级 | 问题 | 文件 | 行号 | 影响 | 建议修复 |
|--------|------|------|------|------|---------|
| **High** | 波片在游戏中表现为旋转器，非相位延迟器 | `LightPhysics.ts` | 476-530 | **误导学生理解波片工作原理** | 添加游戏内说明:"简化模型"或实现真实Jones矩阵 |
| **High** | 光学工作台偏振片透过率=100% | `opticalBenchStore.ts` | 1378-1401 | **误导学生认为光能无损耗** | 使用 `TYPICAL_POLARIZER` 参数 |
| **High** | 实验噪声为均匀分布 | `dataAnalysis.ts` | 238-243 | **误导学生对实验误差的理解** | 改用高斯噪声 + 散粒噪声模型 |
| **Medium** | Malus's Law 三处重复实现 | 多文件 | - | 代码维护风险 | 统一到 `opticsPhysics.ts` |
| **Medium** | 双折射分离角90°而非真实的6° | `LightPhysics.ts` | 119-146 | 游戏可视化简化，但应标注 | UI标签改为"偏振分束器(PBS)"而非"方解石" |
| **Medium** | 历史实验无交互参数 | `timeline-events.ts` | 全文件 | 教学深度不足 | 接入物理引擎，允许参数调整 |
| **Medium** | DataPoint 缺少不确定度字段 | `labStore.ts` | 10-14 | 不符合科学数据记录规范 | 添加 `uncertainty` 字段 |
| **Low** | FresnelDemo 无色散模型 | `FresnelDemo.tsx` | 全文件 | 与BrewsterDemo不一致 | 添加 Sellmeier 模型 |
| **Low** | 相位模型为二值(±1) | `types.ts` | 20 | 干涉计算精度受限 | 游戏内可接受，Demo应使用WaveOptics |

---

## 总结

### 做得好的地方
1. **WaveOptics.ts** 和 **JonesCalculus.ts** 实现了研究级精度的波动光学
2. **BrewsterDemo** 和 **BirefringenceDemo** 使用真实的菲涅尔方程和Sellmeier色散
3. **MalusLawDemo** 的研究模式支持消光比参数
4. 代码文档中明确标注了简化模型的局限性

### 需要改进的地方
1. **游戏物理与真实物理的边界不清晰** - 容易误导学生
2. **非理想器件参数已定义但未使用** - 浪费了精确模型
3. **实验噪声模型过于简单** - 不符合真实物理测量

### 核心建议
> **在所有简化模型的使用处，添加明确的UI提示**，告知学生这是"教学简化版"，并提供链接到使用精确物理的Demo。

---

*Report generated by Claude Code scientific review*
