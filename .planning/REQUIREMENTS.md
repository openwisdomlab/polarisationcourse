# Requirements: Odyssey — 偏振光学开放世界

**Defined:** 2026-02-20
**Core Value:** 学生自发沉浸探索2小时以上——好奇心驱动的发现式学习

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### World Foundation

- [ ] **WRLD-01**: 世界使用自由相机探索（WASD+鼠标），非滚动驱动，非线性路径
- [ ] **WRLD-02**: 世界由4-6个互联的光学环境区域组成，每个区域有独特的视觉风格和物理主题
- [ ] **WRLD-03**: 区域之间通过流畅的相机过渡连接，无页面加载中断
- [ ] **WRLD-04**: 世界有空间连贯性——所有区域感觉属于同一个物理世界，非独立Demo展厅
- [ ] **WRLD-05**: 区域按距离懒加载/卸载（RegionManager），同时保持2-3个活跃区域
- [ ] **WRLD-06**: 所有区域从开始即可自由访问，无强制前置条件

### Light & Physics

- [ ] **PHYS-01**: 光束实时渲染偏振状态变化（颜色/亮度/形态编码偏振角/椭圆率/强度）
- [ ] **PHYS-02**: 操作光学元件后光束在<16ms内视觉响应，物理精确（Mueller/Jones计算）
- [ ] **PHYS-03**: 统一的偏振视觉语言——所有区域使用一致的颜色/形状/动画编码偏振状态
- [ ] **PHYS-04**: 光束可在区域间传播——同一束光在不同环境中自然展现不同偏振现象
- [ ] **PHYS-05**: 保持≥55fps桌面端，≥30fps移动端的性能预算

### Interaction

- [ ] **INTR-01**: 学生可在光路上放置光学元件（偏振片、波片、晶体等）
- [ ] **INTR-02**: 学生可旋转/调整已放置的光学元件，实时观察光束行为变化
- [ ] **INTR-03**: 学生可改变环境/材料属性（介质类型、折射率等），观察光的不同行为
- [ ] **INTR-04**: 交互使用拖拽/滚轮语义（拖拽放置、滚轮旋转、点击检查），无需文字说明
- [ ] **INTR-05**: 光学元件的可交互性通过视觉提示传达（发光边缘、悬浮提示），非UI按钮

### Discovery & Learning

- [ ] **DISC-01**: 核心偏振概念通过环境交互被"发现"，非通过文字讲解
- [ ] **DISC-02**: 知识门控进度——学生因"理解"而前进，门控不可见（不是锁定的门）
- [ ] **DISC-03**: 层层递进信息架构——直觉（看到现象）→定性（理解原因）→定量（数学描述），学生选择深度
- [ ] **DISC-04**: 达成正确配置时环境可见变化——光束变化、色彩转换、图案出现、区域照亮
- [ ] **DISC-05**: 跨概念"啊哈"连接——在一个区域的发现揭示另一个区域的相关现象
- [ ] **DISC-06**: 发现状态跨会话持久化——返回的学生从上次的理解继续

### Visual & Aesthetic

- [ ] **VISL-01**: 每个区域有独特的视觉氛围（光照、色调、粒子、几何风格），达到"每帧值得停留"的标准
- [ ] **VISL-02**: 采用风格化而非写实美术方向——几何极简主义引导注意力到物理现象
- [ ] **VISL-03**: 光束是视觉上最突出的元素——环境效果不得压过物理信号
- [ ] **VISL-04**: 混合2D/3D呈现——3D用于空间沉浸和现象观察，2D用于理论展开和精确测量
- [ ] **VISL-05**: 从3D现象到2D理论的过渡感觉自然——像"放大"从体验到数学表示

### Content Integration

- [ ] **CONT-01**: 覆盖6个单元的核心偏振概念（基础/调制/界面/透明介质/散射介质/偏振测量）
- [ ] **CONT-02**: 现有23个Demo组件作为"深度探索"入口可从世界内无缝访问
- [ ] **CONT-03**: 理论公式从现象中涌现——先体验再形式化，公式是理解的庆祝而非前提
- [ ] **CONT-04**: 概念星座图——可视化知识图谱展示已发现概念及其连接关系
- [ ] **CONT-05**: 多语言支持（中文/英文），复用现有i18n基础设施

### Technical Foundation

- [ ] **TECH-01**: 单Canvas架构，显式GPU资源回收协议，防止SPA导航内存泄漏
- [ ] **TECH-02**: three.js升级到~0.175，审计现有着色器兼容性
- [ ] **TECH-03**: 数据模型围绕"环境中的可组合物理行为"设计，非"站点数组"
- [ ] **TECH-04**: 与PolarCraft其他模块（游戏、工作室、计算器）共存，通过/odyssey/路由访问
- [ ] **TECH-05**: 桌面端优先（鼠标+键盘），移动端后续适配

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Depth & Polish

- **DPTH-01**: 三层深度架构（Animal Well模型）——Layer 2隐藏连接 + Layer 3研究级挑战
- **DPTH-02**: 响应光学状态的环境音景（非游戏化音效，是氛围）
- **DPTH-03**: 引导探索模式——可调节提示强度（关/微妙/中等/明确），基于游测数据设计
- **DPTH-04**: 真实世界上下文锚点——每个现象连接真实应用（LCD、应力分析、天空偏振等）
- **DPTH-05**: 移动端适配方案

### Community

- **CMTY-01**: 发现状态分享/对比
- **CMTY-02**: 社区挑战/研究级谜题

## Out of Scope

| Feature | Reason |
|---------|--------|
| 评分/成绩/XP系统 | 外在奖励破坏内在好奇心，违反发现式学习哲学 |
| 线性教程序列 | 违反开放探索核心设计，前5次迭代的根本错误 |
| 文字为主的教学 | 文字是Layer 2+的深度选择，非Layer 1的主要教学手段 |
| 强制前置/锁定区域 | 违反非线性探索，部分学生已有前置知识 |
| 写实3D环境 | 风格化引导注意力到物理，写实增加性能负担无教育收益 |
| 重写现有23个Demo | 已有组件功能完整，嵌入复用而非重建 |
| 物理引擎（rapier/cannon） | 项目的"物理"是光学计算，非刚体碰撞 |
| 滚动驱动相机 | 5次迭代证明线性滚动无法实现开放探索 |
| 多人/社交功能（v1） | 单人体验验证后再考虑 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| WRLD-01 | Phase 1 | Pending |
| WRLD-02 | Phase 1+3 | Pending |
| WRLD-03 | Phase 3 | Pending |
| WRLD-04 | Phase 1 | Pending |
| WRLD-05 | Phase 3 | Pending |
| WRLD-06 | Phase 3 | Pending |
| PHYS-01 | Phase 1 | Pending |
| PHYS-02 | Phase 1 | Pending |
| PHYS-03 | Phase 2 | Pending |
| PHYS-04 | Phase 3 | Pending |
| PHYS-05 | Phase 1 | Pending |
| INTR-01 | Phase 2 | Pending |
| INTR-02 | Phase 2 | Pending |
| INTR-03 | Phase 2 | Pending |
| INTR-04 | Phase 2 | Pending |
| INTR-05 | Phase 2 | Pending |
| DISC-01 | Phase 2 | Pending |
| DISC-02 | Phase 3 | Pending |
| DISC-03 | Phase 4 | Pending |
| DISC-04 | Phase 2 | Pending |
| DISC-05 | Phase 3 | Pending |
| DISC-06 | Phase 3 | Pending |
| VISL-01 | Phase 2+5 | Pending |
| VISL-02 | Phase 1 | Pending |
| VISL-03 | Phase 2 | Pending |
| VISL-04 | Phase 4 | Pending |
| VISL-05 | Phase 4 | Pending |
| CONT-01 | Phase 3+5 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-03 | Phase 4 | Pending |
| CONT-04 | Phase 4 | Pending |
| CONT-05 | Phase 5 | Pending |
| TECH-01 | Phase 1 | Pending |
| TECH-02 | Phase 1 | Pending |
| TECH-03 | Phase 1 | Pending |
| TECH-04 | Phase 1 | Pending |
| TECH-05 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 35 total
- Mapped to phases: 35
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-20*
*Last updated: 2026-02-20 after initial definition*
