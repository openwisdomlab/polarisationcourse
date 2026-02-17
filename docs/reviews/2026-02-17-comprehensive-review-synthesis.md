# PolarCraft 多角度审查综合报告与完善方案

**日期**: 2026-02-17
**审查团队**: 物理科学性审查员 / 架构代码审查员 / 教育设计审查员 / 后端架构研究员
**审查范围**: PHYSICS_REVIEW_REPORT.md × 综合改进计划 × 后端架构设计

---

## 一、三方审查核心发现

### 1. 物理科学性审查 (Physics Reviewer)

#### 报告"已修复"项核实

| # | 声明修复项 | 实际状态 | 验证依据 |
|---|-----------|---------|---------|
| 1 | 噪声模型→高斯+散粒噪声 | **已修复** | `dataAnalysis.ts` Box-Muller + shot/read/systematic |
| 2 | 光学工作台→非理想偏振片 | **已修复** | `opticalBenchStore.ts` POLARIZER_QUALITY_PARAMS |
| 3 | 游戏简化模型警告 | **已修复** | `HelpPanel.tsx` amber warning + i18n |
| 4 | DataPoint不确定度字段 | **已修复** | `labStore.ts:14` uncertainty field |
| 5 | Malus定律统一 | **半完成** | 2D游戏已统一→opticsPhysics.ts，但3D游戏LightPhysics.ts仍独立实现 |

#### 重构清单覆盖分析

| 优先级 | 问题 | 计划是否覆盖? | 评估 |
|--------|------|-------------|------|
| HIGH | 波片=旋转器 | 部分覆盖（标签改名+UI警告） | 可接受，但缺少游戏→Demo跨链接 |
| HIGH | 理想偏振片 | **已修复** | 完成 |
| HIGH | 均匀噪声 | **已修复** | 完成 |
| Medium | Malus 3x重复 | 部分覆盖 | LightPhysics.ts仍独立 |
| Medium | 双折射90°vs6° | UI标签已改 | 可接受 |
| Medium | 历史实验非交互 | **未覆盖** | 缺口 |
| Medium | DataPoint不确定度 | **已修复** | 完成 |
| Low | FresnelDemo无色散 | 未覆盖 | 低优先级 |
| Low | 二值相位模型 | 已承认 | 游戏可接受 |

#### 关键风险

1. **统一API添加了第4层物理引擎**：LightPhysics(3D) + opticsPhysics(2D) + WaveOptics(deprecated) + unified API。组织更清晰但并未真正统一。
2. **`createPhysicsAPI('game')` 模式标签误导**：game模式内部使用和science完全相同的引擎，并未路由到旧标量模型。
3. **波片在游戏中的教学风险**：缺少从游戏QWP/HWP方块到`/demos/waveplate`的直接跳转链接。

---

### 2. 架构代码审查 (Architecture Reviewer)

#### 核心发现

| 领域 | 评级 | 关键问题 |
|------|------|---------|
| API Facade | 良好 | `_coherency`泄漏内部实现；PolarizationInfo命名冲突(两个同名类型) |
| Store模式 | 合格 | collaborationStore缺少partialize；Array/Set转换冗余 |
| 性能 | 良好 | 无热路径问题；每次API调用创建新OpticalSurface对象(大量使用时有GC压力) |
| CrossModuleLinks | 良好 | 解耦清晰，耦合最小 |
| 物理引擎迁移 | **高风险** | 3引擎共存+"渐进迁移"=永不完成的经典模式 |
| 后端骨架 | 休眠 | 保持现状，不值得投入 |
| JSON安全 | 中风险 | 无schema验证/大小限制/消毒处理 |
| 测试覆盖 | 显著缺口 | Store层、数据层、集成测试均缺失 |

#### 架构建议

1. **`_coherency`字段** → 用`WeakMap<PolarizationInfo, CoherencyMatrix>`隐藏内部状态
2. **PolarizationInfo命名冲突** → 旧Jones版本重命名为`LegacyPolarizationInfo`
3. **跨引擎验证测试** → 同一场景通过Jones和Unified引擎运行，断言结果等价
4. **collaborationStore导入安全** → 添加zod schema验证 + 字段长度限制 + ID碰撞检查
5. **JonesCalculus.ts标记@deprecated** → 指向统一API，设定移除时间线

---

### 3. 教育设计审查 (Education Reviewer)

#### 关键级问题 (Critical)

| # | 问题 | 影响 | 建议修复 |
|---|------|------|---------|
| C1 | **30秒自动完成机制有缺陷** | 学生开Demo放置30秒=标记完成，破坏整个前置条件系统 | 改为交互式完成或显式"标记完成"按钮 |
| C2 | **锁定图标误导** | 显示锁图标但点击仍可访问，半吊子UX | 要么真锁(弹窗说明前置)，要么去掉锁(软引导) |

#### 高优先级问题

| # | 问题 | 建议 |
|---|------|------|
| H1 | 研究级用户无绕过机制 | Research难度下所有Demo解锁 |
| H2 | JSON文件分享在中国课堂高摩擦 | QR码分享 + 剪贴板复制粘贴 |
| H3 | AragoFresnel Demo存在但未入前置图 | 加入DEMOS数组和DEMO_PREREQUISITES |
| H4 | Discovery系统与学习路径断开 | 完成Demo触发相关发现；游戏发现算"软完成" |

#### 教学流程建议

- 添加`softPrerequisites`字段（推荐但不强制）
- Rayleigh散射增加malus为前置
- 模块进度环仅用于结构化模块(Demos)，探索型模块(Gallery/Chronicles)改用"已探索"指示
- 简化评审表单：单文本框 + 表情反应代替正式3字段评审
- 添加反向跨模块链接：游戏遇困→返回相关Demo

---

### 4. 后端架构研究 (Backend Researcher)

#### 方案对比矩阵

| 维度 | Supabase+Colyseus+Redis | Firebase+Colyseus | PocketBase+Colyseus | **NestJS+PG+Redis+Colyseus** | LeanCloud+Colyseus |
|------|------------------------|-------------------|---------------------|---------------------------|-------------------|
| 中国可用性 | 仅自托管(12+容器) | **不可用**(GFW) | 完全可用 | **完全可用** | 完全可用 |
| 开发复杂度 | 中 | N/A | 中 | 高 | 中 |
| 供应商锁定 | 中(开源) | 高 | 低 | **无** | 高(专有) |
| 大学SSO | 自定义OAuth | N/A | Go hooks | **Passport CAS/SAML** | 自定义 |
| 并发50-500 | 过度 | N/A | 勉强(SQLite写锁) | **最佳匹配** | 良好 |
| 全控制 | 中 | 无 | 高 | **完全** | 低 |

#### 推荐方案：扩展NestJS + PostgreSQL + Redis + Colyseus (方案5)

**核心理由**：
1. **零GFW风险** — 全部自托管在国内云(阿里云/腾讯云)
2. **复用现有代码** — Colyseus Room (`polarcraft.room.ts`) 是最成熟的后端代码
3. **大学规模适配** — 单机PG+Redis+NestJS轻松支撑500并发
4. **Prisma ORM** — 类型安全，与TypeScript前端完美匹配
5. **大学SSO** — NestJS Passport原生支持CAS/SAML
6. **MinIO存储** — S3兼容，自托管

#### 实施阶段

| 阶段 | 时间 | 目标 | 工作量 |
|------|------|------|--------|
| Phase 1: 基础 | 4-6周 | Auth + 数据持久化 + Progress API | 160-240h |
| Phase 2: 协作+存储 | 3-4周 | Research CRUD + MinIO + SSO + 教师仪表板 | 120-160h |
| Phase 3: 实时+分析 | 3-4周 | Colyseus对接 + 通知 + 分析 + 压测 | 120-160h |
| **合计** | **10-14周** | | **400-560h** |

#### 部署方案

阿里云ECS (4 vCPU, 8GB RAM, ~¥200/月)：
- NestJS + PostgreSQL 15 + Redis 7 + MinIO + Colyseus
- Docker Compose一键部署
- 500并发用户无压力

---

## 二、研讨会议结论：进一步完善方案

综合三方审查意见，形成以下分优先级的完善行动计划：

### 第一优先级：必须立即修复 (Sprint 1)

| # | 行动项 | 负责角色 | 涉及文件 |
|---|--------|---------|---------|
| 1 | **替换30秒自动完成** → 显式"已探索"按钮(2分钟后出现) + 交互检测 | UX | `DemosPage.tsx` |
| 2 | **统一锁定行为** → 软引导模式：去掉Lock图标，改为"建议先完成X"文字提示 | UX | `DemosPage.tsx`, i18n |
| 3 | **隐藏_coherency字段** → WeakMap封装消除泄漏抽象 | 架构 | `src/core/api.ts` |
| 4 | **添加collaborationStore JSON验证** → zod schema + 字段截断 + ID碰撞检测 | 架构 | `collaborationStore.ts` |
| 5 | **LightPhysics Malus委托** → `applyMalusLaw`委托到`opticsPhysics.ts`(外包Math.floor) | 物理 | `LightPhysics.ts` |

### 第二优先级：本轮迭代完成 (Sprint 2)

| # | 行动项 | 负责角色 | 涉及文件 |
|---|--------|---------|---------|
| 6 | **Research难度绕过** → `isDemoAvailable`增加tier参数，Research级全开 | 教育 | `learningPaths.ts`, `DemosPage.tsx` |
| 7 | **游戏→Demo跨链接** → QWP/HWP方块tooltip增加"查看真实物理"链接 | 物理+UX | `HelpPanel.tsx`, game components |
| 8 | **添加AragoFresnel** → 加入DEMOS数组和DEMO_PREREQUISITES | 物理 | `DemosPage.tsx`, `learningPaths.ts` |
| 9 | **PolarizationInfo重命名** → Jones版本改为`LegacyPolarizationInfo` | 架构 | `physics/jones.ts`, 6个引用文件 |
| 10 | **关键Store测试** → collaborationStore + discoveryStore + learningPaths测试 | 架构 | 新建3个test文件 |
| 11 | **QR码/剪贴板分享** → 协作项目支持生成QR码和复制文本分享 | UX | `collaborationStore.ts`, 新组件 |

### 第三优先级：后续迭代 (Sprint 3+)

| # | 行动项 | 负责角色 |
|---|--------|---------|
| 12 | 跨引擎验证测试 — Jones vs Unified等价断言 | 架构+物理 |
| 13 | JonesCalculus.ts标记@deprecated + 移除时间线 | 架构 |
| 14 | 反向跨模块链接 — 游戏→Demo "学习原理"按钮 | UX |
| 15 | Discovery与学习路径统一 | 教育+架构 |
| 16 | 简化评审表单(单框+表情) | UX |
| 17 | 模块进度环差异化(探索型vs结构型) | UX |
| 18 | softPrerequisites数据结构 | 教育 |

### 后端建设计划 (独立Track)

| 阶段 | 关键交付物 | 依赖 |
|------|----------|------|
| Phase 1 | PostgreSQL schema + Prisma + Auth(JWT) + Progress API + 前端API层 | 无 |
| Phase 2 | Research CRUD API + MinIO文件存储 + 大学SSO(CAS) + 教师仪表板 | Phase 1 |
| Phase 3 | Colyseus前端对接 + Redis通知 + 分析仪表板 + 500并发压测 | Phase 2 |

---

## 三、后端架构技术选型决议

### 最终推荐：NestJS + PostgreSQL + Prisma + Redis + Colyseus + MinIO

```
┌─────────────────── 前端 (React 19) ───────────────────┐
│  Zustand stores ←→ REST API + WebSocket + Colyseus     │
└──────────┬──────────────┬──────────────┬───────────────┘
    REST (3001)      Socket.io (3001)   Colyseus (2567)
           │              │              │
┌──────────┴──────────────┴──────────────┴───────────────┐
│              NestJS Application Server                   │
│  ┌─────────┐ ┌──────────┐ ┌────────────┐               │
│  │Auth模块 │ │API模块   │ │Colyseus    │               │
│  │Passport │ │(CRUD)    │ │游戏服务器  │               │
│  │JWT+CAS  │ │          │ │(Rooms)     │               │
│  └────┬────┘ └────┬─────┘ └─────┬──────┘               │
│       └───────────┼─────────────┘                       │
│            ┌──────┴───────┐                             │
│            │ Prisma ORM   │                             │
│            └──────┬───────┘                             │
└───────────────────┼────────────────┬────────────────────┘
          ┌─────────┴──┐    ┌───────┴────────┐
          │PostgreSQL  │    │   Redis         │
          │(数据持久化)│    │(缓存/会话/通知)│
          └────────────┘    └────────────────┘
                 │
          ┌──────┴─────┐
          │   MinIO    │
          │(文件存储)  │
          └────────────┘
```

### 核心数据库表

```sql
-- 用户认证
users (id, email, name, role, university_id, sso_provider)
-- 学习进度
demo_progress (user_id, demo_id, completed, difficulty, score)
discoveries (user_id, discovery_id, discovered_in, discovered_at)
game_saves (user_id, game_type, level, state_json)
-- 研究协作
research_projects (id, author_id, title, components_json, status)
peer_reviews (project_id, reviewer_id, observations, rating)
-- 班级管理
class_groups (id, teacher_id, name, join_code)
class_memberships (group_id, student_id)
-- 分析
learning_events (user_id, event_type, metadata_json)
```

### 部署：阿里云ECS单机 (4C8G, ~¥200/月)
- Docker Compose一键部署
- 支撑500并发无压力
- 超1000用户时拆分PG和Redis到独立实例

---

*综合报告由4个专业Agent协同审查生成*
*物理审查员 × 架构审查员 × 教育设计审查员 × 后端研究员*
