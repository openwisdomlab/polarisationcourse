# PSRT课程设计文档：偏振光下新世界

## 一、课程结构梳理

### 课程概述
- **课程名称**: 偏振光下新世界
- **课程定位**: 深圳零一学院颠覆创新挑战营 PSRT课程
- **覆盖范围**: 从冰洲石实验到全偏振散射和显微成像
- **目标受众**: 中学、本科、专业研究生及不同领域实际应用
- **学科交叉**: 光学、信息学、测量学
- **应用领域**: 海洋、生医、材料、工业检测、自动驾驶

### 五单元结构

| 单元 | 名称 | 核心内容 | 难度定位 |
|------|------|----------|----------|
| 第一单元 | 光的偏振态及其调制和测量 | 横波、双折射、偏振器件、马吕斯定律 | 基础→应用 |
| 第二单元 | 界面反射的偏振特征 | 菲涅尔公式、布儒斯特角 | 应用→研究 |
| 第三单元 | 透明介质的偏振特征 | 色偏振、旋光 | 应用 |
| 第四单元 | 浑浊介质的偏振特征 | 米散射、瑞利散射、蒙特卡洛模拟 | 基础→研究 |
| 第五单元 | 全偏振光学技术与定量表征 | Stokes/Mueller、显微成像、全偏振成像 | 研究 |

---

## 二、设计机会分析

### 2.1 Demo模块设计机会

**现有Demo与课程对应关系：**

| 单元 | 现有Demo | 覆盖内容 | 缺失内容 |
|------|----------|----------|----------|
| Unit 0 (基础) | light-wave, polarization-intro, polarization-types, optical-bench | 波动、偏振入门、偏振态类型 | ✓ 完整 |
| Unit 1 | polarization-state, malus, birefringence, waveplate | 偏振态、马吕斯、双折射、波片 | ✓ 完整 |
| Unit 2 | fresnel, brewster | 菲涅尔、布儒斯特 | ✓ 完整 |
| Unit 3 | anisotropy, chromatic, optical-rotation | 各向异性(应力)、色偏振、旋光 | ✓ 完整 |
| Unit 4 | mie-scattering, rayleigh | 米散射、瑞利散射 | ⚠️ 缺少蒙特卡洛模拟演示 |
| Unit 5 | stokes, mueller, jones, calculator | Stokes矢量、Mueller矩阵、Jones矩阵 | ⚠️ 缺少偏振荧光仪、显微成像、全偏振相机演示 |

**新增Demo设计机会：**

1. **蒙特卡洛光散射模拟** (Unit 4)
   - 可视化光子在颗粒物悬浮液中的随机游走
   - 展示多次散射的偏振退偏效应
   - 难度: 研究层

2. **偏振荧光仪演示** (Unit 5.2)
   - 模拟偏振荧光仪的基本结构和工作原理
   - 可视化颗粒物偏振光散射数据
   - 难度: 研究层

3. **全偏振显微成像演示** (Unit 5.3)
   - Mueller显微镜工作原理
   - 偏振基底函数可视化
   - Mueller图像像素分类
   - 难度: 研究层

4. **全偏振相机演示** (Unit 5.4)
   - Mueller相机工作原理
   - 大气/水下成像案例
   - 难度: 研究层

### 2.2 游戏关卡设计机会

**现有关卡与课程对应：**

| 关卡ID | 名称 | 对应课程内容 | 单元 |
|--------|------|--------------|------|
| 0 | First Light | 马吕斯定律 | Unit 1 |
| 1 | The Mirror | 光路反射 | Unit 1 |
| 2 | Crossed Polarizers | 正交偏振 | Unit 1 |
| 3+ | L-Shaped Path等 | 综合应用 | - |

**新增关卡设计机会：**

1. **双折射分光关卡** (Unit 1.2)
   - 使用冰洲石分光器将光分为o光和e光
   - 设计路径让两束光分别到达不同传感器

2. **布儒斯特角关卡** (Unit 2)
   - 调整入射角使反射光完全偏振
   - 利用布儒斯特反射实现光路设计

3. **色偏振关卡** (Unit 3.1)
   - 利用双折射材料产生色彩变化
   - 设计特定颜色到达传感器

4. **旋光关卡** (Unit 3.2)
   - 使用旋光物质旋转偏振角
   - 结合糖浓度调节设计关卡

5. **散射关卡** (Unit 4)
   - 模拟瑞利/米氏散射
   - 利用散射特性设计光路

### 2.3 光学设计室设计机会

**现有经典实验与课程对应：**

需要检查并补充以下实验：

1. **冰洲石双像实验** (Unit 1.2)
   - 重现1669年巴多林发现
   - 展示o光和e光的分离

2. **折射率椭球可视化** (Unit 1.2)
   - 3D展示晶体光学各向异性
   - 显示不同方向的折射率

3. **咖啡浓度计/糖度计模拟** (Unit 2)
   - 展示布儒斯特角测量原理
   - 连接实际应用

4. **应力双折射实验** (Unit 3.1)
   - 模拟玻璃受力产生的应力纹
   - 展示钢化玻璃的偏振检测

5. **糖溶液旋光实验** (Unit 3.2)
   - 不同浓度糖溶液的旋光角
   - 彩色激光展示

6. **蓝天/白云/红霞模拟** (Unit 4.1)
   - 瑞利/米氏散射的光谱效果
   - 自然现象解释

### 2.4 课程资源设计机会

**附件资源需求：**

| 单元 | 现有资源 | 需补充资源 |
|------|----------|------------|
| Unit 1 | PPT、学习指南、冰洲石百科 | 实验器材清单、双折射晶体图鉴 |
| Unit 2 | PPT、菲涅尔/布儒斯特百科 | 咖啡浓度计DIY指南 |
| Unit 3 | PPT、应力分析指南 | 色偏振文创制作指南、旋光实验材料清单 |
| Unit 4 | PPT、米散射理论 | 颗粒物散射计算代码、MATLAB代码 |
| Unit 5 | PPT、Mueller矩阵指南 | 偏振荧光仪使用说明、缪勒显微镜操作手册 |

---

## 三、设计方案

### 3.1 Demo模块增强方案

#### 方案A: 蒙特卡洛光散射模拟Demo

**文件**: `src/components/demos/unit4/MonteCarloScatteringDemo.tsx`

**功能设计**:
```
1. 可视化场景
   - 光子粒子从光源发射
   - 遇到散射颗粒时随机改变方向
   - 偏振态随散射事件变化
   - 统计输出偏振分布

2. 交互控制
   - 颗粒浓度调节
   - 颗粒粒径调节
   - 光子数量控制
   - 动画速度控制

3. 输出展示
   - 光强空间分布图
   - 偏振度空间分布
   - Mueller矩阵元素

4. 难度分层
   - 基础层: 观察光子随机游走
   - 应用层: 分析散射参数影响
   - 研究层: 完整Mueller矩阵计算
```

#### 方案B: 全偏振显微成像Demo

**文件**: `src/components/demos/unit5/MuellerMicroscopyDemo.tsx`

**功能设计**:
```
1. 显微镜结构展示
   - 光源模块 (起偏器阵列)
   - 样品台
   - 检偏器阵列
   - CCD探测器

2. 成像过程演示
   - 16种偏振态组合测量
   - Mueller矩阵像素计算
   - 伪彩色图像生成

3. 样品模拟
   - 洋葱表皮细胞
   - 波片校准样品
   - 生物组织切片

4. 分析工具
   - 偏振基底函数分解
   - 像素分类可视化
   - 特征参数提取
```

### 3.2 游戏关卡增强方案

#### 新增关卡设计

**关卡: 冰洲石分光 (Calcite Split)**
```typescript
{
  id: 12,
  name: 'Calcite Split',
  nameZh: '冰洲石分光',
  description: 'Use the calcite crystal to split light into two beams',
  descriptionZh: '使用冰洲石晶体将光分成两束',
  hint: 'o-ray stays straight, e-ray bends',
  hintZh: '寻常光直行，非寻常光偏折',
  difficulty: 'medium',
  courseUnit: 1, // 关联课程单元
  gridSize: { width: 100, height: 100 },
  components: [
    { id: 'e1', type: 'emitter', x: 50, y: 10, polarizationAngle: 45, direction: 'down' },
    { id: 'sp1', type: 'splitter', x: 50, y: 50, locked: true },
    { id: 's1', type: 'sensor', x: 50, y: 90, requiredPolarization: 0 },
    { id: 's2', type: 'sensor', x: 70, y: 90, requiredPolarization: 90 },
  ],
}
```

**关卡: 布儒斯特反射 (Brewster Bounce)**
```typescript
{
  id: 13,
  name: 'Brewster Bounce',
  nameZh: '布儒斯特反射',
  description: 'Adjust the incident angle to get perfectly polarized light',
  descriptionZh: '调整入射角获得完美偏振光',
  difficulty: 'hard',
  courseUnit: 2,
  components: [
    { id: 'e1', type: 'emitter', polarizationAngle: -1 }, // 非偏振光
    { id: 'glass', type: 'brewster-surface', adjustable: true },
    { id: 's1', type: 'sensor', requiredPolarization: 0, minIntensity: 90 },
  ],
}
```

### 3.3 光学设计室经典实验方案

#### 新增经典实验

```typescript
// 冰洲石双像实验
const calciteDoubleImageExperiment: ClassicExperiment = {
  id: 'calcite-double-image',
  name: 'Iceland Spar Double Image',
  nameZh: '冰洲石双像实验',
  description: 'Recreate Bartholin\'s 1669 discovery of birefringence',
  descriptionZh: '重现1669年巴多林发现双折射的历史实验',
  difficulty: 'easy',
  courseUnit: 1,
  components: [
    { type: 'emitter', x: 100, y: 200, polarization: -1 }, // 自然光
    { type: 'calcite', x: 300, y: 200, thickness: 10 },
    { type: 'screen', x: 500, y: 200 },
  ],
  learningPoints: [
    '自然光通过冰洲石会分成两个图像',
    'o光和e光的偏振方向相互垂直',
    '两束光的强度相等（各占50%）',
  ],
}

// 蓝天白云模拟
const blueSkyWhiteCloudExperiment: ClassicExperiment = {
  id: 'blue-sky-white-cloud',
  name: 'Blue Sky, White Cloud',
  nameZh: '蓝天白云',
  description: 'Understand why the sky is blue and clouds are white',
  descriptionZh: '理解天空为什么是蓝色、云为什么是白色',
  difficulty: 'easy',
  courseUnit: 4,
  components: [
    { type: 'sun', x: 50, y: 50 }, // 太阳白光
    { type: 'atmosphere', x: 200, y: 200, particles: 'nano' }, // 纳米级分子
    { type: 'cloud', x: 400, y: 100, particles: 'micro' }, // 微米级水滴
    { type: 'observer', x: 300, y: 350 },
  ],
  learningPoints: [
    '瑞利散射: 散射强度 ∝ 1/λ⁴',
    '蓝光比红光散射强约10倍',
    '云中水滴大，各波长散射均匀呈白色',
  ],
}
```

### 3.4 PSRT教学模式集成

根据PSRT研究型学习模式，设计三层难度系统的内容差异：

| 层级 | 图标 | 内容重点 | 问题类型 |
|------|------|----------|----------|
| 基础层 (PSRT) | 🌱 | 现象观察、生活连接、直觉建立 | "你看到了什么？" "这像什么？" |
| 应用层 (ESRT) | 🔬 | 定量公式、实验设计、测量方法 | "如何测量？" "影响因素？" |
| 研究层 (ORIC/SURF) | 🚀 | 理论推导、前沿应用、开放探索 | "如果改变X会怎样？" "能否改进？" |

---

## 四、实施优先级

### 高优先级 (立即实施)

1. ✅ 更新COURSE.md补充详细的课程内容描述
2. ✅ 完善课程单元翻译内容
3. ⬜ 在CoursePage添加课程教学环节说明
4. ⬜ 补充课程应用领域展示

### 中优先级 (短期实施)

5. ⬜ 新增蒙特卡洛散射模拟Demo
6. ⬜ 新增冰洲石分光游戏关卡
7. ⬜ 光学设计室添加经典实验预设

### 低优先级 (长期规划)

8. ⬜ 全偏振显微成像Demo
9. ⬜ 全偏振相机Demo
10. ⬜ 偏振荧光仪Demo
11. ⬜ 课程附件资源系统

---

## 五、技术实现要点

### 5.1 课程-模块关联数据结构

```typescript
// 课程单元与模块的关联配置
interface CourseUnitMapping {
  unitId: string
  demos: string[]         // Demo IDs
  games: number[]         // Level IDs
  experiments: string[]   // Experiment IDs
  tools: string[]         // Tool routes
  attachments: Attachment[]
}

// 课程进度追踪
interface CourseProgress {
  completedDemos: string[]
  completedLevels: number[]
  experimentResults: ExperimentResult[]
  achievements: Achievement[]
}
```

### 5.2 难度自适应系统

```typescript
// 根据用户进度自动调整难度
function getRecommendedDifficulty(progress: CourseProgress): DifficultyLevel {
  const completionRate = calculateCompletionRate(progress)
  if (completionRate < 0.3) return 'foundation'
  if (completionRate < 0.7) return 'application'
  return 'research'
}
```

### 5.3 课程可视化导航

建议在CoursePage中添加课程地图(Learning Path)可视化：
- 节点表示单元/Demo/关卡
- 连线表示学习路径
- 颜色表示完成状态
- 支持自由探索和推荐路径

---

## 六、内容补充建议

### 6.1 第一单元补充

**冰洲石关键参数（课程中提到）:**
- 双折射率差: 0.172（已知双折射最大的晶体）
- Ne = 1.4864
- No = 1.6584
- 测量波长: λ = 589nm

**互动环节设计:**
1. "上帝视角"模拟创造世界
2. 振动绳索机械波演示
3. 电脑屏幕+偏振片实验
4. 玻璃幕墙观察（反射、条纹、彩色）

### 6.2 第三单元补充

**色偏振文创应用:**
- 偏振万花筒
- 透明胶带偏振艺术
- 应力显示装置

**家庭小实验:**
- 电脑白屏 + 糖水杯 + 3D眼镜

### 6.3 第四单元补充

**自然现象解释表:**

| 现象 | 粒径 | 机制 |
|------|------|------|
| 蓝天 | ~纳米级 | 瑞利散射 |
| 白云 | ~微米级 | 米氏散射 |
| 红霞 | 多尺度 | 长程散射 |
| 虹和霓 | 水滴 | 全反射+折射 |

### 6.4 第五单元补充

**应用领域展开:**

| 技术 | 应用领域 | 典型案例 |
|------|----------|----------|
| 偏振荧光仪 | 海洋、生医 | 浮游生物分类、细胞检测 |
| Mueller显微镜 | 材料、生医 | 组织病理、材料应力 |
| Mueller相机 | 自动驾驶、安防 | 去雾成像、目标识别 |

---

*文档版本: v1.0*
*创建日期: 2025-12-20*
*作者: Claude*
