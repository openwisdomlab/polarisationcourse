# 光之奥德赛 v2 — 沉浸式重构设计提案

> **"The Photon Corridor"** — 单页连续空间叙事交互体验
>
> 四人专家团队联合提案：体验架构 × 创意前端 × 探究学习 × 计算光学

---

## 目录

- [Phase 1: 概念隐喻与空间叙事](#phase-1)
- [Phase 2: 交互体验剧本](#phase-2)
- [Phase 3: UI/UX 机制设计](#phase-3)
- [Phase 4: 技术架构](#phase-4)
- [附录: 文件清单与迁移路径](#appendix)

---

<a id="phase-1"></a>

## 🔴 Phase 1: 概念隐喻与空间叙事

### 1.1 三种前沿 3D Web 交互趋势分析

| 趋势 | 代表案例 | 核心手法 | 适配度 |
|------|---------|---------|--------|
| **Scroll-driven Camera Flythrough** | Apple Vision Pro 产品页、Linear.app Features | 滚动驱动相机沿 Spline 路径飞行，场景元素随视口位置出现/消失 | ★★★★★ 完美匹配"光束穿越光学元件" |
| **Particle Field Morphing** | Vercel Ship 2024、Stripe Sessions | 粒子云在不同形态间变换，数据可视化与美学融合 | ★★★☆ 可用于偏振态转换的过渡效果 |
| **Spatial Scroll Anchoring** | Lusion.co、Active Theory 作品 | 固定 3D 场景 + DOM 内容锚定到 3D 空间坐标 | ★★★★ 解决"3D 场景中嵌入交互式 DOM 演示"的核心难题 |

### 1.2 核心隐喻："光之甬道 (The Photon Corridor)"

```
想象一间无限延伸的暗室实验室。
你站在一条纯黑走廊的起点。
前方，一束金色的光从虚空中诞生，向远方射去。
你跟随这束光前行——
它穿过偏振片，变得纯净；
它撞击方解石，一分为二；
它掠过布儒斯特角的玻璃，反射光完美偏振；
它被散射介质吞噬，又以偏振门控重现……
每一次相遇，都是一个交互关卡。
每一个关卡，都是一场物理奇观。
这不是教科书，是旅程。
```

**空间结构：**

```
                    ╭── Unit 0: 偏振基础 (5站) ──╮
[起源: 光的诞生]───┤                              ├─── [过渡: 光束加速]
                    ╰── (5个光学元件依次排列) ───╯
                    ╭── Unit 1: 调制与测量 (5站) ──╮
───── [晶体森林] ───┤                               ├─── [过渡: 折射虹彩]
                    ╰── (偏振片→双折射→波片) ──────╯
                    ╭── Unit 2: 界面反射 (2站) ──╮
───── [玻璃峡谷] ───┤                             ├─── [过渡: 全反射闪烁]
                    ╰── (菲涅尔→布儒斯特) ──────╯
...依此类推，6个单元区域沿光束方向线性排列
```

每个 Unit 区域有独特的视觉氛围（通过环境雾、粒子颜色、环境光调变）：

| Unit | 空间氛围 | 环境色调 | 粒子特征 |
|------|---------|---------|---------|
| 0 — 偏振基础 | 空旷暗室，简洁 | 暖金 `#fbbf24` | 均匀漂浮尘埃 |
| 1 — 调制测量 | 晶体阵列实验台 | 冷青 `#22d3ee` | 有序方阵光点 |
| 2 — 界面反射 | 玻璃峡谷/棱镜走廊 | 紫罗兰 `#a78bfa` | 棱镜彩虹碎片 |
| 3 — 透明介质 | 结晶洞穴 | 翡翠绿 `#34d399` | 旋转螺旋粒子 |
| 4 — 浑浊介质 | 烟雾/水下通道 | 粉红 `#f472b6` | 随机散射粒子 |
| 5 — 全偏振 | 星际观测站 | 冰蓝 `#60a5fa` | 矩阵数字雨 |

### 1.3 相机运镜策略："Scroll-Locked Dolly on Spline"

```
相机路径: 3D CatmullRom 样条曲线，沿 Z 轴延伸
光束路径: 沿 Z 轴的直线 (偶尔弯折/分裂)

滚动量 ─→ 归一化进度 t ∈ [0, 1]
       ─→ 相机位置 = spline.getPointAt(t)
       ─→ 相机朝向 = spline.getTangentAt(t) 或注视光束焦点
```

**三种运镜模式自动切换：**

1. **Dolly (飞行)**：默认模式。相机沿光束方向缓慢前进。用于 Unit 间过渡。
2. **Orbit (环绕)**：到达某个光学元件站点时，相机围绕该元件做小弧度环绕。用于展示 3D 细节。
3. **Close-up (特写)**：当用户主动点击某个元件或进入交互模式时，相机推进到元件近景。

**阻尼与缓动：**
- 相机位置使用指数衰减弹簧插值（类似当前 `ChamberCamera` 的 `spring=5` 模式）
- 不直接绑定滚动值，而是以滚动值为"目标位置"，相机以阻尼追踪
- 这产生丝滑、有惯性感的运镜，避免滚动时的生硬跳切

---

<a id="phase-2"></a>

## 🔴 Phase 2: 交互体验剧本

### 2.1 前 3 分钟完整旅程

#### 第 0-15 秒：光的诞生 (The Birth)

```
[视觉] 纯黑画面。3 秒后，画面中心出现一个极微弱的点。
        点开始脉动，发出金色辐射。
        粒子从中心向四面八方扩散——这是"未偏振光"的视觉化。
        电场矢量在所有方向随机跳动（用粒子线段表示）。

[交互] 无。用户只是观看。屏幕底部渐显一行文字：
        "Light is born. But it has no direction."
        "光诞生了。但它没有方向。"

[物理] 中心点发出的光表现为随机偏振的叠加态。
        Stokes 参数: S = [1, 0, 0, 0] (完全未偏振)
```

#### 第 15-30 秒：第一次滚动 — 发现波动 (The Wave Emerges)

```
[视觉] 用户第一次滚动时，相机开始向前推进。
        中心点拉伸成一束光柱。
        随着推进，光束上出现正弦波纹理——E 场振荡变得可见。
        这是从"粒子视角"到"波动视角"的渐进转换。

        光束两侧，E 和 B 矢量以半透明箭头显示，
        垂直于传播方向，相互正交。

[交互] 用户自然地继续滚动（Lenis 阻尼提供流畅手感）。
        光束旁浮现第一个 HUD 标签：
        "E = E₀ cos(kz - ωt)"
        公式以全息投影风格渐入（玻璃拟态 + 发光边框 + 微微浮动）。

[Aha!] 用户看到抽象的"光点"变成了有结构的电磁波——
        第一次物理震撼："原来光是波！"
```

#### 第 30-60 秒：Station 0.0 — 光波演示 (LightWaveDemo)

```
[视觉] 相机到达第一个"工作站"——一块悬浮的透明工作台。
        光束穿过工作台中心。
        工作台表面有控制旋钮的 3D 模型（半透明玻璃质感）。

        相机做小弧度 orbit，从侧面移到 45° 俯视。
        光束的 E 场振荡以 3D 箭头清晰可见。

[交互] 工作台亮起，DOM 交互面板以 drei <Html> 锚定在工作台上方。
        面板是现有的 LightWaveDemo，但被重新皮肤化：
        - 去掉所有独立的边框/背景
        - 控件变成浮动的玻璃拟态滑条
        - 波形可视化与 3D 光束实时同步

        用户可以：
        ① 拖拽"波长"滑条 → 光束颜色实时变化 (λ → RGB)
        ② 调整"振幅" → 光束亮度和 E 场箭头长度变化
        ③ 切换 B 场可见性 → 3D 场景中 B 场箭头出现/消失

[物理] 波长变化影响 k = 2π/λ，频率 ω = ck。
        3D 波纹纹理的空间频率实时更新。

[Aha!] 当用户把波长从红色拖到蓝色时，光束颜色连续变化，
        同时波纹变得更密——"波长越短，频率越高！"
```

#### 第 60-90 秒：Station 0.1 — 偏振片登场 (PolarizationIntro)

```
[视觉] 用户继续滚动，相机沿光束前进。
        光束前方出现一块半透明的"栅栏"——偏振片。
        它以缓慢旋转的姿态悬浮，栅格线清晰可见。

        当光束穿过偏振片时：
        入射侧：E 矢量在所有方向随机跳动（未偏振）
        出射侧：E 矢量被约束在一个方向（偏振化了！）
        光束强度减弱约 50%（变暗了！）

[交互] 偏振片可以拖拽旋转（通过 raycaster + 自定义拖拽物理）。
        旋转偏振片 → 透射方向改变 → 出射光的 E 场方向跟随旋转。

        屏幕侧面浮现一个小型 Poincaré 球（3D），
        上面有一个点在赤道上滑动，表示线偏振方向。

[Aha!] "旋转偏振片不改变强度，只改变方向！"
        "但如果放第二个偏振片呢……？"
```

#### 第 90-120 秒：Station 0.3 — 马吕斯定律涌现 (VirtualPolarizerLens)

```
[视觉] 第二块偏振片出现在光束路径上。
        初始状态：两片平行（角度差 θ = 0°），光完全通过。

[交互] 用户拖拽旋转第二块偏振片。
        θ 从 0° → 90°，光束逐渐变暗直到完全消失！

        在这个过程中，光束旁边的 HUD 没有直接给出公式。
        而是显示一个实时的 I/I₀ 数值读数，
        以科幻风格的"测量仪"形式呈现。

        当用户探索了几个角度后，一个"？"按钮出现：
        "Why does it follow this curve?"

        点击后，cos²θ 曲线以粒子特效"生长"出来——
        每个数据点是用户刚才探索时 sampling 到的真实数据！
        公式 I = I₀cos²θ 最后才渐入——作为"发现"而非"告知"。

[Aha!] 用户亲手发现了 cos² 关系！公式是验证而非教学。
        这正是建构主义的核心："知识由学习者主动建构"。
```

#### 第 120-180 秒：深入晶体世界 (Unit 1 过渡)

```
[视觉] 完成基础 5 站后，光束进入一片新的区域。
        环境色从暖金过渡到冷青。
        走廊两侧出现了悬浮的晶体阵列（方解石、冰洲石）。
        这些晶体散射出微弱的彩虹色光点。

        光束射入第一块方解石——
        一束变两束！o光和e光以不同角度折出。
        这在 3D 空间中以极具冲击力的方式呈现。

[交互] 用户可以旋转方解石晶体，观察 o/e 光的分离角度变化。
        当晶体旋转 360°，e光围绕 o光做了一个完整的锥面运动。

[Aha!] "同一块晶体，不同方向看到不同的折射！"
        "这就是各向异性！"
```

### 2.2 震撼感 (Aha Moments) 设计矩阵

| Station | 触发时机 | 震撼类型 | 视觉反馈 |
|---------|---------|---------|---------|
| 0.0 光波 | 第一次改变波长 | 感知觉醒 | 光束颜色渐变 + 波纹密度变化 |
| 0.1 偏振介绍 | 光穿过偏振片后变暗 50% | 反直觉发现 | 光束骤然减半 + 粒子溅射 |
| 0.3 马吕斯定律 | 旋转到 90° 光完全消失 | 物理极限体验 | 光束渐灭 + 环境变暗 + "死亡"效果 |
| 0.4 偏振锁 | 第三片偏振片让光"复活" | 悖论震撼 | 光束重现 + 金色脉冲 + "rebirth" 特效 |
| 1.1 双折射 | 一束光变两束 | 空间分裂 | 光束 Y 形分叉 + 方解石发光 |
| 1.2 波片 | 线偏光变圆偏光 | 维度突破 | E 矢量从直线变螺旋 + Poincaré球动画 |
| 2.1 布儒斯特角 | 反射光完全偏振 | 完美角度 | 反射光变纯白亮 + 角度刻度金色闪烁 |
| 4.0 米氏散射 | 光束进入雾中 | 环境吞噬 | 光束散射成体积光 + 环境变浑浊 |

---

<a id="phase-3"></a>

## 🔴 Phase 3: UI/UX 机制设计

### 3.1 空间导航系统："光谱导轨 (Spectral Rail)"

完全不使用传统导航菜单。替代方案：

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌───────────────────────────────────────────────────┐    │
│   │                   3D CANVAS                        │    │
│   │                                                    │    │
│   │                                                    │    │
│   │                                                    │    │
│   │                                                    │    │
│   └───────────────────────────────────────────────────┘    │
│                                                             │
│   ╔═══╤═══════╤══════╤═══════╤═══════╤═══════╤═══════╗    │
│   ║ ◉ │ ○ ○ ○ │○ ○ ○ │  ○ ○  │ ○ ○ ○ │○ ○ ○  │○ ○ ○ ║    │
│   ║ ↑ │  U0   │  U1  │  U2   │  U3   │  U4   │  U5  ║    │
│   ║ 光 │偏振基础│调制测量│界面反射│透明介质│浑浊介质│全偏振 ║    │
│   ╚═══╧═══════╧══════╧═══════╧═══════╧═══════╧═══════╝    │
│   ↑ "光谱导轨" — 固定在视口底部，像光谱色带一样                │
└─────────────────────────────────────────────────────────────┘
```

**光谱导轨设计细节：**

- **形态**：固定在视口底部的细长光带（高度 48px），像一条发光的光纤
- **颜色编码**：每个 Unit 区段用该 Unit 的主色调渲染，形成连续的颜色渐变
- **当前位置**：一个发光的圆点在导轨上沿当前滚动进度平滑移动
- **Station 节点**：每个 demo 对应一个小圆点，hover 显示 demo 名称 tooltip
- **快速跳转**：点击任意节点 → 相机以 ease-in-out 飞向对应位置（1.2s 过渡）
- **折叠**：3 秒无交互后导轨收缩为一条 4px 细线，hover 时展开
- **快捷键**：`←` `→` 在相邻 station 间跳转；`1-6` 跳转到对应 Unit 起点

**为什么不用侧边栏/汉堡菜单：**
- 侵占宝贵的沉浸式画布空间
- 打断"跟随光束"的叙事连续感
- 底部导轨像"光束本身的倒影"，保持空间隐喻的一致性

### 3.2 物理反馈系统："Haptic Optics"

当用户拖拽/旋转光学元件时，提供多层感官反馈：

#### 视觉反馈层 (Visual)

```
[元件层]
├── 拖拽时: 元件边缘发出与 unitColor 一致的辉光（bloom 级别 ↑）
├── 旋转时: 角度刻度环以 neon 弧线显示当前角度
├── 释放时: 元件微微回弹（spring 阻尼）
└── 接近物理特殊值时:
    例如接近 θ_B 时，元件边缘脉动加速（"快到了！"的暗示）

[光束层]
├── 光束强度: 实时变化，无延迟
├── 光束颜色: 偏振态变化 → Stokes S3 映射到色相
│   S3 > 0 (右旋): 偏蓝
│   S3 < 0 (左旋): 偏红
│   S3 = 0 (线偏振): 保持白/金色
├── 光束形态: 线偏振→直线振荡; 圆偏振→螺旋; 椭圆→椭圆螺旋
└── 光束 shader 纹理: flow speed 与交互强度正相关

[环境层]
├── 光束消失 (crossed polarizers): 环境骤暗 + 微弱红色粒子（"光死亡了"）
├── 光束重现 (third polarizer): 环境脉冲提亮 + 金色粒子爆发
├── 双折射分光: 两束光各自拖出独立的尾迹粒子
└── 散射: 体积雾密度随散射系数动态变化
```

#### Shader 特效反馈

```glsl
// 偏振态变化 → 光束表面噪声变化 (概念性 GLSL)
uniform float uPolarizationDegree; // DoP [0, 1]
uniform float uEllipticity;        // χ [-π/4, π/4]
uniform float uOrientation;        // ψ [0, π]

// 完全偏振 (DoP=1): 平滑、有序的流动纹理
// 部分偏振 (DoP<1): 加入 noise 扰动
float disorder = (1.0 - uPolarizationDegree) * snoise(uv * 10.0 + uTime);

// 椭圆率 → 螺旋纹理的偏心度
float spiralFreq = mix(0.0, 6.28, abs(uEllipticity) / (3.14159/4.0));
```

#### 听觉/触觉暗示 (可选)

- 光强变化：低频正弦音调的音量映射到 I/I₀
- 偏振片旋转：轻微的"咔嗒"触觉反馈（Haptic API，手机端）
- 光束消失：所有声音 fade to silence（戏剧效果）

### 3.3 数据呈现系统："全息 HUD (Holographic HUD)"

#### 公式展示

公式不在传统面板中显示，而是以"全息投影"方式出现在 3D 空间：

```
方案: drei <Html> + 自定义 CSS

<Html
  position={[formulaX, formulaY, formulaZ]}  // 锚定在光学元件旁
  transform                                    // 跟随 3D 变换
  distanceFactor={8}                           // 距离衰减
  style={{
    backdropFilter: 'blur(12px)',              // 玻璃拟态
    background: 'rgba(unitColor, 0.08)',
    border: '1px solid rgba(unitColor, 0.25)',
    borderRadius: '12px',
    padding: '16px 24px',
    boxShadow: `0 0 30px rgba(unitColor, 0.15),
                inset 0 0 30px rgba(unitColor, 0.05)`,
  }}
>
  <KaTeX formula="I = I_0 \cos^2\theta" />

  {/* 实时数据绑定 */}
  <div className="font-mono tabular-nums">
    θ = {currentAngle.toFixed(1)}°
    I/I₀ = {(Math.cos(theta)**2).toFixed(3)}
  </div>
</Html>
```

**数据驱动特效 — "Living Formulas"：**

公式中的变量不是静态文本，而是活的：
- `θ` 的显示值实时跟踪用户拖拽的偏振片角度
- `cos²θ` 的值与光束亮度同步——用户看到数字变化的同时看到光束变化
- 当 θ→90° 时，`I/I₀→0`，公式文字也逐渐变暗最终消失（与光束一起"死亡"）

#### 理论渐进揭示

```
[默认状态] 只显示公式 + I/I₀ 实时数值

[用户探索 > 10秒]
  "?" 指示器在公式旁边脉动 →

[点击 "?"]
  ① Foundation 文本以打字机效果逐字出现（2行）
  ② 3秒后，"deeper..." 链接出现
  ③ 点击展开 Application 层
  ④ 再次 "deeper..." 展开 Research 层

  每一层展开时，HUD 面板以弹簧动画向下生长
  同时，3D 场景中的对应物理元素高亮闪烁
```

#### 实时图表

不使用传统矩形图表框。图表曲线直接"漂浮"在光束旁边：

```
传统方式:  ┌─────────┐
           │  chart   │  ← 独立矩形框
           │   📈    │
           └─────────┘

我们的方式:     ╱ ← cos²θ 曲线以光带形式
            ╱     弯曲在 3D 空间中
         ╱        与光束平行
      ╱           当前数据点发光
   ●               ← 用户操作时沿曲线滑动
```

用 `THREE.TubeGeometry` 或 `Line2` 绘制曲线，使用与光束相同的 additive blending。
当前数据点是一个发光球体，随用户交互沿曲线滚动。

---

<a id="phase-4"></a>

## 🔴 Phase 4: 技术架构

### 4.1 动画驱动选型

| 方案 | 优势 | 劣势 | 推荐度 |
|------|------|------|--------|
| **GSAP ScrollTrigger** | 行业标准 scroll-driven animation；精确的 scrub 控制；pin/snap 支持；Timeline 嵌套 | 需要新安装；与 R3F 的集成需手动桥接（useFrame 中读取 GSAP 进度） | ★★★★☆ |
| **Framer Motion + useScroll** | 已安装且项目中广泛使用；React 原生；与 DOM 动画统一 | 3D 场景控制能力弱；无 pin/snap；Scroll progress 精度不如 GSAP | ★★★☆☆ |
| **Lenis + 自定义 ScrollController** | 已安装；极致丝滑滚动；轻量 | 需要自己实现所有进度映射逻辑 | ★★★★★ |
| **Theatre.js** | 专为 R3F 设计的时间轴动画；可视化编辑器；精确关键帧 | 学习曲线陡峭；生态较小 | ★★☆☆☆ |

**推荐方案: Lenis (滚动层) + 自定义 useScrollProgress Hook (桥接层) + R3F useFrame (渲染层)**

理由：
1. **Lenis 已安装且验证过**——当前 UnitScrollView 使用良好
2. **避免 GSAP 的许可证风险**——GSAP 3+ 有自定义商业许可
3. **控制粒度最高**——完全掌控滚动值到 3D 变换的映射
4. **三层解耦**：

```
╔══════════════════╗     ╔══════════════════╗     ╔═══════════════╗
║  Lenis           ║     ║  useOdysseyScroll ║     ║  R3F useFrame  ║
║  (滚动物理)      ║ ──→ ║  (进度归一化)     ║ ──→ ║  (3D 渲染)     ║
║  smoothWheel     ║     ║  t ∈ [0,1]        ║     ║  camera.pos    ║
║  duration: 1.4   ║     ║  段落检测         ║     ║  beam.uniforms ║
║  lerp: 0.07      ║     ║  snap 吸附        ║     ║  env.params    ║
╚══════════════════╝     ╚══════════════════╝     ╚═══════════════╝
```

### 4.2 状态管理：`useOdysseyStore` 重构

```typescript
// ── 新版 OdysseyStore ──────────────────────────────────────

interface OdysseyState {
  // ── 全局滚动状态 ──
  scrollProgress: number          // [0, 1] 归一化总进度
  scrollVelocity: number          // 滚动速度（用于粒子/shader 动画）

  // ── 当前段落 ──
  currentUnit: UnitId             // 当前所在 Unit
  currentStation: number          // 当前所在 Station (unit 内 index)
  currentStationId: string        // 全局唯一 station id (如 'malus-law')

  // ── 交互状态 ──
  activeElement: string | null    // 当前正在交互的光学元件 id
  interactionMode: 'scroll' | 'interact' | 'inspect'
  // scroll: 正常滚动浏览
  // interact: 正在操作光学元件（暂停滚动）
  // inspect: 正在阅读理论 HUD

  // ── 物理状态 (沿光束传播的累积态) ──
  beamState: {
    stokesVector: [number, number, number, number]  // [S0, S1, S2, S3]
    jonesVector: [Complex, Complex]                  // [Ex, Ey]
    intensity: number                                 // I/I₀
    wavelength: number                                // nm
    isCoherent: boolean
  }

  // ── 每站解锁进度 ──
  stationProgress: Record<string, {
    discovered: boolean       // 用户是否到达过
    interacted: boolean       // 用户是否操作过元件
    theoryRevealed: 'none' | 'foundation' | 'application' | 'research'
    ahaTriggered: boolean     // 是否触发过 Aha moment
  }>

  // ── 导航 ──
  isRailExpanded: boolean         // 底部导轨是否展开
  targetProgress: number | null   // 快速跳转目标（非 null 时触发飞行动画）

  // ── Actions ──
  updateScroll: (progress: number, velocity: number) => void
  enterInteraction: (elementId: string) => void
  exitInteraction: () => void
  jumpToStation: (stationId: string) => void
  updateBeamState: (patch: Partial<OdysseyState['beamState']>) => void
  revealTheory: (stationId: string, level: string) => void
}
```

**关键设计决策：**

1. **`beamState` 是累积的**：光束从起点出发，经过每个光学元件后 Stokes 向量被变换。这意味着 Unit 3 的散射效果取决于 Unit 0-2 中用户对偏振片的设置。这创造了一种"连贯宇宙"感。

2. **`interactionMode` 三态切换**：当用户开始拖拽光学元件时，从 `scroll` 切换到 `interact`，此时 Lenis 滚动被暂停（`lenis.stop()`），用户的手势全部用于控制元件。释放后恢复 `scroll`。

3. **`stationProgress` 持久化**：使用 `zustand/middleware` 的 `persist` 将进度存储到 `localStorage`，用户下次访问时不需要重新解锁。

### 4.3 组件架构

```
src/components/odyssey-v2/
├── OdysseyCanvas.tsx          ← 唯一的 <Canvas>，包含所有 3D 场景
│   ├── OdysseyCamera.tsx      ← Scroll-driven 样条相机控制器
│   ├── OdysseyEnvironment.tsx ← 环境雾、背景色、环境粒子
│   ├── BeamSystem/
│   │   ├── BeamPath.tsx       ← 主光束（CatmullRom tube + custom shader）
│   │   ├── BeamSplit.tsx      ← 光束分裂效果（双折射、BS）
│   │   └── beamShaders.glsl.ts
│   ├── Stations/
│   │   ├── StationBase.tsx    ← 每个站点的 3D 容器 (工作台/底座)
│   │   ├── OpticalElement3D.tsx ← 3D 光学元件 (偏振片、波片、棱镜)
│   │   └── HolographicHUD.tsx ← drei <Html> 封装的全息 HUD
│   ├── Particles/
│   │   ├── DustParticles.tsx  ← 环境尘埃
│   │   ├── PolarizationArrows.tsx ← E/B 场矢量可视化
│   │   └── ScatterVolume.tsx  ← 体积散射效果 (Unit 4)
│   └── PostProcessing.tsx     ← Bloom + ChromaticAberration + Vignette
│
├── OdysseyOverlay.tsx         ← DOM 层：导轨 + HUD + 控件
│   ├── SpectralRail.tsx       ← 底部光谱导航条
│   ├── InteractionPanel.tsx   ← 当前 station 的交互控件
│   │   └── (内嵌重皮肤化的现有 demo 控件)
│   └── TheoryDrawer.tsx       ← 理论渐进揭示抽屉
│
├── hooks/
│   ├── useOdysseyScroll.ts    ← Lenis + 滚动进度 + 段落检测
│   ├── useBeamPhysics.ts      ← 光束 Stokes 向量传播计算
│   ├── useCameraSpline.ts     ← 相机样条路径生成与采样
│   └── useStationTrigger.ts   ← Station 进入/离开检测
│
├── data/
│   ├── cameraPath.ts          ← 相机样条控制点
│   ├── stationPositions.ts    ← 23 个站点的 3D 坐标
│   └── environmentConfig.ts   ← 6 个 Unit 区域的环境参数
│
├── shaders/
│   ├── beam.glsl.ts           ← 主光束 shader (扩展版)
│   ├── polarizationField.glsl.ts ← E/B 场可视化 shader
│   ├── hologram.glsl.ts       ← HUD 全息效果
│   └── scatterVolume.glsl.ts  ← 体积散射 (Unit 4)
│
└── store/
    └── odysseyStore.ts        ← 4.2 节定义的新 store
```

**核心渲染流水线：**

```
┌─────────────────────────────────────────────────────────────┐
│                    OdysseyCanvas (R3F)                       │
│                                                             │
│  [Camera] ←── useFrame: lerp(current, spline.at(t))        │
│     │                                                       │
│     ▼                                                       │
│  [Scene Graph]                                              │
│     ├── Environment (fog, particles, ambient)               │
│     ├── BeamPath (tube geometry + custom shader)            │
│     │     uniforms ←── beamState from store                 │
│     ├── Station[0..22] (positioned along Z axis)            │
│     │     ├── OpticalElement3D (interactive mesh)           │
│     │     ├── HolographicHUD (<Html> portal)                │
│     │     └── PolarizationArrows (instanced arrows)         │
│     └── PostProcessing                                      │
│           ├── Bloom (threshold: 0.8, intensity: 0.6)        │
│           ├── ChromaticAberration (offset: 0.0005)          │
│           └── Vignette (eskil: false, offset: 0.2)          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    OdysseyOverlay (DOM)                      │
│     ├── SpectralRail (position: fixed, bottom: 0)           │
│     ├── InteractionPanel (current station controls)         │
│     └── TheoryDrawer (glassmorphism slide-up)               │
└─────────────────────────────────────────────────────────────┘
```

**Demo 组件复用策略：**

现有 23 个 demo 组件（DOM/SVG）**不需要重写为 3D**。策略是：

1. **物理引擎复用**：`@/core/physics/unified` 中的 `PolarizationPhysics`、`solveFresnel` 等纯函数直接导入到新的 `useBeamPhysics` hook。

2. **控件抽取**：从每个 demo 中抽取交互控件（slider、toggle、drag handler），重新封装为 `InteractionPanel` 子组件，使用新的玻璃拟态皮肤。

3. **可视化替换**：demo 中的 SVG 可视化被 3D 光束 + shader 效果替代。例如：
   - MalusLawDemo 的 SVG 偏振片圆 → 3D 偏振片 mesh + raycaster 拖拽
   - FresnelDemo 的 SVG 光线图 → 3D 入射/反射/折射光束
   - PolarizationStateDemo 的 2D Poincaré 球 → 3D PoincaréSphere (已有 `PoincareSphere3D.tsx`)

4. **兼容降级**：保留原始 demo 路由 (`/demos/:demoId`) 不变，让老用户和低性能设备仍可使用传统界面。

### 4.4 性能预算与优化

| 指标 | 预算 | 策略 |
|------|------|------|
| FPS | ≥ 55fps (桌面), ≥ 30fps (移动) | `frameloop="demand"` + 仅可见站点更新 |
| 首屏加载 | < 3s (桌面 4G) | 光束 shader + 第一站内容 code-split |
| WebGL draw calls | < 100/帧 | instanced meshes, merged geometries |
| 纹理内存 | < 64MB | 512×512 纹理，按需加载 |
| JS bundle (odyssey) | < 200KB gzipped | 站点数据 + shader 字符串 tree-shake |

**关键优化：**

1. **视锥体裁剪**：只有当前可见的 ±2 个站点的 3D 元素和 `<Html>` 组件被挂载
2. **LOD（细节层次）**：远处的光学元件用简化几何体；近处用高精度
3. **Shader 编译预热**：在加载画面期间预编译所有 shader variant
4. **GPU 粒子**：环境粒子使用 `InstancedBufferGeometry`，不走 React 渲染
5. **Offscreen `<Html>`**：drei 的 `<Html occlude>` 用于隐藏被遮挡的 HUD

---

<a id="appendix"></a>

## 附录：迁移路径

### 阶段 0 — 基础设施 (1 周)

```
□ 安装 @react-three/postprocessing
□ 创建 src/components/odyssey-v2/ 目录
□ 实现 useOdysseyScroll hook (Lenis + 进度归一化)
□ 实现 useCameraSpline hook (CatmullRom 样条)
□ 搭建 OdysseyCanvas 骨架 (Camera + Environment + PostProcessing)
□ 新版 odysseyStore
```

### 阶段 1 — 光束系统 (1 周)

```
□ BeamPath: 扩展当前 chamberBeam shader，增加偏振态 uniform
□ PolarizationArrows: 用 instanced cones 表示 E/B 矢量
□ BeamSplit: Y 形分叉效果
□ 验证: 一束光从起点到终点可以滚动跟踪
```

### 阶段 2 — 前 5 站 (Unit 0) (2 周)

```
□ StationBase 3D 工作台组件
□ OpticalElement3D: 偏振片 (可旋转 mesh + raycaster)
□ HolographicHUD: drei <Html> 全息公式面板
□ SpectralRail 导航条
□ 集成 LightWaveDemo 物理引擎到光束 shader
□ 集成 PolarizationIntro 偏振片交互
□ 集成 VirtualPolarizerLens cos²θ 实时反馈
□ 集成 PolarizationLock 三偏振片悖论
□ Aha moment 特效系统
```

### 阶段 3 — 剩余 18 站 (3 周)

```
□ Unit 1: 方解石双折射 3D、波片旋转、Stokes/Poincaré 球
□ Unit 2: 界面反射 3D（入射/反射/折射光束）
□ Unit 3: 晶体环境、旋光螺旋、各向异性指示椭球
□ Unit 4: 体积散射 shader、米氏/瑞利散射模式
□ Unit 5: 矩阵运算可视化、偏振显微术
```

### 阶段 4 — 打磨 (1 周)

```
□ 过渡动画 (Unit 间环境色/氛围渐变)
□ 移动端适配 (touch events, 性能降级)
□ 持久化解锁进度
□ 可访问性 (keyboard nav, screen reader announcements)
□ 性能 profiling & 优化
```

**总计：约 7 周**

---

> **团队签名**
>
> 体验架构师: "每一帧都是一个选择——选择让学习者感到惊奇。"
> 创意前端: "60fps 是底线，shader 是语言，光束是灵魂。"
> 学习专家: "最好的教学是让学生以为自己没在学习。"
> 计算物理: "每一个光子的旅程，在数学上都是严谨的。"
