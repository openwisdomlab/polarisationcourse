# PolarCraft 后端架构设计文档

> **状态**: 待评估 (Draft for Review)
> **日期**: 2026-02-17
> **范围**: 完整后端系统设计，覆盖虚拟课题组重构、用户系统、数据持久化、协作与论坛

---

## 一、设计背景与目标

### 1.1 现状分析

PolarCraft 当前是一个纯前端应用，所有数据通过 localStorage 保存在用户浏览器中：

| 数据存储 | localStorage Key | 内容 | 估算数据量/用户 |
|----------|-----------------|------|----------------|
| `labStore` | `polarcraft-lab-storage` | 研究任务进度、技能值、发表记录 | ~50 KB |
| `discoveryStore` | `polarquest-discoveries` | 已完成 Demo、成就、发现记录 | ~20 KB |
| `opticalBenchStore` | `optical-bench-designs` | 光学设计方案（组件位置、参数、光路） | ~200 KB |
| `collaborationStore` | `polarcraft-collaboration` | 研究项目、评审请求、已发表作品 | ~100 KB |
| `useCourseProgress` | `polarcraft-course-progress` | 已完成 Demo 列表、测验分数、连续学习天数 | ~10 KB |
| `gameStore` | 无持久化 | 游戏运行时状态（关卡、方块、光线） | 仅内存 |
| Game2D/3D/Card/Escape/Detective | 无持久化 | 各游戏的关卡进度和分数 | 仅内存 |
| `simulationBlackBoxStore` | 无持久化（session 级） | 黑盒模拟临时状态 | 仅内存 |

**后端骨架现状** (`server/` 目录)：
- NestJS 框架已搭建，端口 3001，CORS 已配置
- Colyseus 实时游戏服务器在端口 2567
- Socket.io WebSocket Gateway 已有 join_room、chat_message 等事件
- **无数据库**、**无认证系统**、**无文件存储**
- 游戏状态为内存中的 Colyseus Schema，无持久化
- 总代码量约 718 行

**核心问题**：
1. 用户换设备、清缓存即丢失所有进度
2. 无法实现真正的多人协作（当前 collaborationStore 只是 JSON 导入/导出）
3. 游戏排行榜、成果展示等功能无法跨用户共享
4. 课题组功能目前是静态 mock 数据，无法真正创建和加入

### 1.2 设计目标

1. **虚拟课题组重构**：从"模拟体验"升级为真正可用的课题协作系统
2. **用户系统**：支持注册登录、个人资料、跨设备同步
3. **数据持久化**：将所有学习进度、游戏记录、设计作品迁移至后端
4. **协作与交流**：课题内讨论、论坛式交流
5. **成果管理**：研究结果的版本管理和访问控制

### 1.3 用户规模预期

- 目标：云端公开服务，支持 1000+ 注册用户
- 同时在线：预估 50-100 人
- 重度用户（活跃研究组）：20-50 人

---

## 二、虚拟课题组重构设计

### 2.1 术语变更

| 原术语 | 新术语 | 说明 |
|--------|--------|------|
| 研究任务 (Research Task) | 课题 (Topic/Project) | 更符合中文学术习惯 |
| Lab Group | 虚拟课题组 | 保持不变 |
| Collaboration Space | 课题协作空间 | 与课题深度绑定 |

### 2.2 课题生命周期

```
创建课题 → 招募中 → 进行中 → 评审中 → 已完成 → 归档
(DRAFT)   (RECRUITING) (IN_PROGRESS) (REVIEWING) (COMPLETED) (ARCHIVED)
```

### 2.3 页面流程设计

#### 2.3.1 课题列表页（`/research` 主页面，替代当前 LabPage）

进入后显示所有课题的卡片列表，每张卡片包含：
- 课题名称
- 发起人姓名
- 状态标签（招募中 / 进行中 / 已完成）
- 当前成员数 / 最大成员数
- 课题简介（截断显示前 2 行）
- 「查看详情」按钮

顶部功能：
- 「创建新课题」按钮
- 状态筛选（全部 / 招募中 / 进行中 / 已完成）
- 搜索框

#### 2.3.2 创建新课题流程

点击「创建新课题」后，弹出多步表单：

**第一步：基本信息**
- 课题名称（必填，2-100 字符）
- 发起人姓名（自动填入登录用户名，可修改）
- 发起人相关信息（学校、年级/职称、专业方向）

**第二步：课题简介**
- 研究背景（必填，Markdown 编辑器，描述问题的来源和意义）
- 研究内容（必填，Markdown 编辑器，具体要做什么）
- 大致研究方案（必填，Markdown 编辑器，计划怎么做）

**第三步：设置**
- 最大成员数（默认 10）
- 是否公开（默认公开，非公开课题只有受邀人可见）
- 预计时长（可选）

提交后课题状态为「招募中」，发起人自动成为「课题负责人」角色。

#### 2.3.3 课题详情页（`/research/:topicId`）

进入课题后，显示以下内容区块：

**A. 课题信息区**（所有人可见）
- 课题名称、状态、创建时间
- 发起人信息
- 研究背景、研究内容、研究方案（完整 Markdown 渲染）

**B. 成员列表区**（所有人可见）
- 列出所有成员：姓名、学校/年级/专业、兴趣描述、角色（负责人/成员/指导老师）、加入时间
- 「加入课题」按钮（未加入时显示）

**C. 加入课题流程**
点击「加入课题」后，弹出表单：
- 姓名（自动填入，可修改）
- 相关信息：学校、年级、专业（从用户资料自动填入，可修改）
- 个人兴趣（文本框，描述自己的研究兴趣）
- 对课题哪部分感兴趣（文本框，说明想参与哪个方面）

提交后自动成为「成员」角色。

**D. 里程碑区**（仅组员可见）
- 课题负责人可创建里程碑（标题 + 截止日期）
- 里程碑可标记完成/未完成
- 按时间顺序展示

**E. 初步结果区**（访问控制）

| 结果可见性 | 谁能看到 |
|-----------|---------|
| 公开 (PUBLIC) | 所有人 |
| 仅组员 (TEAM_ONLY) | 课题成员 + 指导老师 |
| 私有 (PRIVATE) | 仅作者本人 |

每条结果包含：
- 标题
- 内容（Markdown，支持图片/公式）
- 附件（上传的文件）
- 版本号（每次编辑生成新版本，保留历史记录）
- 作者、创建时间、最后更新时间

组员可以：
- 提交新结果
- 编辑自己的结果（自动生成新版本）
- 查看历史版本
- 设置结果的可见性

**F. 讨论区**（仅组员可见）
- 课题内置讨论板，类似简化论坛
- 支持发帖和回复（嵌套回复）
- Markdown 格式
- 置顶和锁定功能（负责人权限）

### 2.4 与现有内容的关系

当前 LabPage 有 4 个 Tab：

| 现有 Tab | 重构后位置 | 说明 |
|----------|-----------|------|
| 开放挑战 (Open Challenges) | 保留为「推荐课题模板」 | 温大真实研究课题作为课题模板，用户可一键创建同类课题 |
| 引导任务 (Guided Tasks) | 保留为独立功能 | 个人学习任务，不需要后端协作 |
| 协作空间 (Collaboration) | **合并入课题系统** | 每个课题自带讨论区，取代独立的协作空间 |
| 成果展示 (Showcase) | 改为「公开结果展示」 | 展示所有课题中标记为 PUBLIC 的研究结果 |

---

## 三、技术选型

### 3.1 核心技术栈

| 组件 | 选择 | 理由 |
|------|------|------|
| **Web 框架** | NestJS (已有) | TypeScript-first，模块化架构，已有骨架代码 |
| **数据库** | PostgreSQL 16 | 关系型，课题/用户/论坛关系复杂；支持 JSON 列存半结构化数据；全文搜索内建；中国云服务商均支持托管版 |
| **ORM** | Prisma | TypeScript 类型自动生成；声明式 Schema + 自动迁移；查询 API 直观 |
| **缓存** | Redis 7 | Session 存储、排行榜缓存、实时状态、BullMQ 任务队列 |
| **认证** | Passport.js + JWT | 成熟生态，NestJS 原生集成；支持多策略（邮箱密码、微信 OAuth、GitHub OAuth） |
| **文件存储** | MinIO (开发) / 阿里云 OSS (生产) | S3 兼容 API，开发环境可本地运行 MinIO，生产切换阿里云 OSS 仅改配置 |
| **实时通信** | Colyseus (游戏) + Socket.io (协作) | 已有基础。Colyseus 专注游戏房间管理（4人对战），Socket.io 用于课题更新推送和论坛实时通知 |
| **任务队列** | BullMQ + Redis | 异步任务：邮件发送、数据导出、定时清理 |
| **容器化** | Docker Compose | 统一开发/测试/部署环境 |

### 3.2 放弃的方案及理由

| 方案 | 放弃理由 |
|------|---------|
| **MongoDB** | 课题-成员-结果-讨论之间存在大量关系查询，关系型数据库更合适。MongoDB 的 JOIN 能力弱，需要大量冗余或聚合管道 |
| **TypeORM** | Prisma 的类型推导更强（从 Schema 自动生成类型），迁移工具更现代（`prisma migrate`），学习曲线更低 |
| **Supabase (self-hosted)** | 功能上 NestJS + Prisma + 自建 Auth 已覆盖。Supabase 增加一整套独立服务的运维复杂度，且深度定制能力弱 |
| **Directus (CMS)** | 课程内容目前在前端 JSON/TSX 中管理良好，引入 CMS 增加复杂度但收益有限。等内容量增大后再考虑 |
| **NodeBB (外部论坛)** | 需要独立部署、独立认证、独立主题定制。内建论坛模块可与课题系统深度集成，开发量可控 |
| **Gitea (Git 平台)** | 研究结果的版本管理需求较轻（线性版本历史），用数据库 `ResultRevision` 表即可满足。完整 Git 系统对用户而言过于复杂 |

### 3.3 类似平台参考

研究过以下平台的架构和功能：

| 平台 | 可借鉴的点 |
|------|-----------|
| **PhET** (Colorado) | 单页面 + Canvas 交互式模拟，学习进度 API 设计 |
| **Open edX** | 课程结构化（Course → Section → Unit → Component），同行评审工作流（ORA 模块：提交 → 互评 → 出分） |
| **Moodle** | Workshop 模块的 5 阶段同行评审（设置 → 提交 → 评估 → 评分 → 关闭），课程论坛与活动绑定 |

---

## 四、数据库设计

### 4.1 ER 关系概览

```
User ──────┬── OAuthAccount (1:N，OAuth 登录账号)
           ├── ResearchTopic (1:N，创建的课题)
           ├── TopicMembership (1:N，加入的课题)
           ├── ResearchResult (1:N，提交的结果)
           ├── ForumPost (1:N，发表的帖子)
           ├── ForumReply (1:N，发表的回复)
           ├── CourseProgress (1:1，学习进度)
           ├── Discovery (1:N，成就/发现)
           ├── GameRecord (1:N，游戏记录)
           └── OpticalDesign (1:N，光学设计)

ResearchTopic ──┬── TopicMembership (1:N，成员)
                ├── ResearchResult (1:N，研究结果)
                ├── ForumPost (1:N，讨论帖子)
                └── Milestone (1:N，里程碑)

ResearchResult ──── ResultRevision (1:N，版本历史)

ForumPost ──── ForumReply (1:N，回复，支持嵌套)
```

### 4.2 Prisma Schema 定义

```prisma
// ==========================================
// 用户与认证
// ==========================================

model User {
  id            String    @id @default(cuid())
  email         String?   @unique
  passwordHash  String?
  displayName   String
  avatar        String?   // 头像 URL
  school        String?   // 学校
  grade         String?   // 年级/职称
  major         String?   // 专业方向
  bio           String?   // 个人简介
  role          Role      @default(STUDENT)
  locale        String    @default("zh")  // 语言偏好
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // 关联
  oauthAccounts    OAuthAccount[]
  createdTopics    ResearchTopic[]     @relation("TopicCreator")
  topicMemberships TopicMembership[]
  researchResults  ResearchResult[]
  forumPosts       ForumPost[]
  forumReplies     ForumReply[]
  courseProgress   CourseProgress?
  discoveries      Discovery[]
  gameRecords      GameRecord[]
  opticalDesigns   OpticalDesign[]
}

model OAuthAccount {
  id         String @id @default(cuid())
  provider   String // "wechat" | "github" | "google"
  providerId String // 第三方平台的用户 ID
  userId     String
  user       User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerId])
}

enum Role {
  STUDENT   // 学生
  TEACHER   // 教师
  ADMIN     // 管理员
}

// ==========================================
// 虚拟课题组
// ==========================================

model ResearchTopic {
  id          String      @id @default(cuid())
  title       String      // 课题名称
  creatorId   String
  creator     User        @relation("TopicCreator", fields: [creatorId], references: [id])
  background  String      @db.Text  // 研究背景（Markdown）
  content     String      @db.Text  // 研究内容（Markdown）
  plan        String      @db.Text  // 研究方案（Markdown）
  status      TopicStatus @default(RECRUITING)
  maxMembers  Int         @default(10)
  isPublic    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // 关联
  members     TopicMembership[]
  results     ResearchResult[]
  discussions ForumPost[]
  milestones  Milestone[]
}

model TopicMembership {
  id        String     @id @default(cuid())
  userId    String
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  topicId   String
  topic     ResearchTopic @relation(fields: [topicId], references: [id], onDelete: Cascade)
  role      MemberRole @default(MEMBER)
  school    String?    // 加入时填写的学校（可能与用户资料不同）
  grade     String?    // 加入时填写的年级
  major     String?    // 加入时填写的专业
  interests String     @db.Text  // 个人兴趣 + 对课题哪部分感兴趣
  joinedAt  DateTime   @default(now())

  @@unique([userId, topicId])  // 每人只能加入一个课题一次
}

model ResearchResult {
  id          String     @id @default(cuid())
  topicId     String
  topic       ResearchTopic @relation(fields: [topicId], references: [id], onDelete: Cascade)
  authorId    String
  author      User       @relation(fields: [authorId], references: [id])
  title       String
  content     String     @db.Text   // Markdown 内容
  attachments String[]   // 附件文件 URL 列表
  visibility  Visibility @default(TEAM_ONLY)
  version     Int        @default(1)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // 版本历史
  revisions   ResultRevision[]
}

model ResultRevision {
  id        String  @id @default(cuid())
  resultId  String
  result    ResearchResult @relation(fields: [resultId], references: [id], onDelete: Cascade)
  content   String  @db.Text   // 该版本的完整内容快照
  version   Int                // 版本号
  message   String?            // 修改说明（类似 commit message）
  createdAt DateTime @default(now())
}

model Milestone {
  id        String    @id @default(cuid())
  topicId   String
  topic     ResearchTopic @relation(fields: [topicId], references: [id], onDelete: Cascade)
  title     String
  dueDate   DateTime?
  completed Boolean   @default(false)
  order     Int       // 排序序号
  createdAt DateTime  @default(now())
}

enum TopicStatus {
  RECRUITING    // 招募中
  IN_PROGRESS   // 进行中
  REVIEWING     // 评审中
  COMPLETED     // 已完成
  ARCHIVED      // 已归档
}

enum MemberRole {
  LEADER   // 课题负责人（创建者）
  MEMBER   // 普通成员
  ADVISOR  // 指导老师
}

enum Visibility {
  PUBLIC     // 所有人可见
  TEAM_ONLY  // 仅组员可见
  PRIVATE    // 仅作者可见
}

// ==========================================
// 论坛/讨论区
// ==========================================

model ForumPost {
  id        String  @id @default(cuid())
  authorId  String
  author    User    @relation(fields: [authorId], references: [id])
  topicId   String? // 关联课题（NULL = 通用讨论区）
  topic     ResearchTopic? @relation(fields: [topicId], references: [id], onDelete: Cascade)
  category  String  @default("general")  // "general" | "question" | "sharing" | "announcement"
  title     String
  content   String  @db.Text  // Markdown
  pinned    Boolean @default(false)
  locked    Boolean @default(false)
  views     Int     @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  replies   ForumReply[]
}

model ForumReply {
  id        String  @id @default(cuid())
  postId    String
  post      ForumPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String
  author    User    @relation(fields: [authorId], references: [id])
  content   String  @db.Text  // Markdown
  parentId  String? // 支持嵌套回复（NULL = 直接回复帖子）
  parent    ForumReply?  @relation("ReplyThread", fields: [parentId], references: [id])
  children  ForumReply[] @relation("ReplyThread")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ==========================================
// 学习进度
// ==========================================

model CourseProgress {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  completedDemos  String[] // 已完成的 demo ID 列表
  quizScores      Json     // { "demoId": score, ... }
  taskProgress    Json     // 从 labStore 迁移的 TaskProgress 数据
  researcherSkills Json    // { experiment, theory, simulation, dataAnalysis }
  streakDays      Int      @default(0)
  lastActiveAt    DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Discovery {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type         String   // "insight" | "experiment" | "achievement" | "frontier"
  title        String
  description  String?
  metadata     Json?    // 额外数据（如 demo 关联、条件等）
  discoveredAt DateTime @default(now())

  @@unique([userId, type, title])  // 同一用户同一发现不重复
}

// ==========================================
// 游戏记录
// ==========================================

model GameRecord {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  gameType  GameType
  levelId   String?  // 关卡 ID
  score     Int?
  moves     Int?     // 操作步数
  timeSpent Int?     // 花费时间（秒）
  completed Boolean  @default(false)
  stateData Json?    // 存档快照（可选，用于继续游戏）
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId, gameType])       // 查询某用户某类型游戏记录
  @@index([gameType, score])        // 排行榜查询
}

enum GameType {
  PUZZLE_2D
  PUZZLE_3D
  CARD_GAME
  ESCAPE_ROOM
  DETECTIVE
}

// ==========================================
// 光学设计
// ==========================================

model OpticalDesign {
  id          String  @id @default(cuid())
  userId      String
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  description String?
  components  Json    // BenchComponent[] 序列化
  thumbnail   String? // 缩略图 URL
  isPublic    Boolean @default(false)
  likes       Int     @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 4.3 索引与性能考虑

- `User.email` — unique index，登录查询
- `TopicMembership(userId, topicId)` — unique composite，防止重复加入
- `GameRecord(userId, gameType)` — 快速查询个人游戏历史
- `GameRecord(gameType, score)` — 排行榜查询
- `ForumPost(topicId, createdAt)` — 课题讨论按时间排序
- `Discovery(userId, type, title)` — unique composite，防止重复发现

---

## 五、API 模块设计

### 5.1 模块划分

```
server/src/
├── main.ts                    # 入口，端口 3001
├── app.module.ts              # 根模块
│
├── prisma/                    # 数据库层
│   ├── prisma.module.ts       # Global module
│   ├── prisma.service.ts      # onModuleInit 连接
│   └── schema.prisma          # 上述 Schema
│
├── auth/                      # 认证模块
│   ├── auth.module.ts
│   ├── auth.controller.ts     # POST /auth/register
│   │                          # POST /auth/login
│   │                          # POST /auth/refresh
│   │                          # GET  /auth/oauth/wechat
│   │                          # GET  /auth/oauth/github
│   │                          # GET  /auth/oauth/callback/:provider
│   ├── auth.service.ts        # 密码哈希、JWT 签发、OAuth 处理
│   ├── strategies/
│   │   ├── local.strategy.ts  # 邮箱 + 密码
│   │   ├── jwt.strategy.ts    # JWT 验证
│   │   ├── wechat.strategy.ts # 微信 OAuth 2.0
│   │   └── github.strategy.ts # GitHub OAuth
│   └── guards/
│       ├── jwt-auth.guard.ts  # 需要登录
│       ├── optional-auth.guard.ts  # 可选登录（游客也能访问）
│       └── roles.guard.ts     # 角色权限检查
│
├── users/                     # 用户模块
│   ├── users.module.ts
│   ├── users.controller.ts    # GET    /users/me          (个人资料)
│   │                          # PATCH  /users/me          (更新资料)
│   │                          # GET    /users/:id         (公开资料)
│   │                          # GET    /users/:id/designs (公开设计)
│   └── users.service.ts
│
├── topics/                    # 课题模块（核心）
│   ├── topics.module.ts
│   ├── topics.controller.ts   # GET    /topics            (列表，支持筛选)
│   │                          # POST   /topics            (创建课题)
│   │                          # GET    /topics/:id        (详情)
│   │                          # PATCH  /topics/:id        (更新，仅负责人)
│   │                          # DELETE /topics/:id        (删除，仅负责人)
│   │                          # POST   /topics/:id/join   (加入课题)
│   │                          # DELETE /topics/:id/leave  (退出课题)
│   │                          # GET    /topics/:id/members(成员列表)
│   ├── topics.service.ts
│   │
│   ├── results.controller.ts  # GET    /topics/:id/results       (结果列表)
│   │                          # POST   /topics/:id/results       (提交结果)
│   │                          # PATCH  /topics/:id/results/:rid  (更新结果)
│   │                          # GET    /topics/:id/results/:rid/revisions (版本历史)
│   ├── results.service.ts
│   │
│   ├── milestones.controller.ts # CRUD /topics/:id/milestones
│   └── milestones.service.ts
│
├── forum/                     # 论坛模块
│   ├── forum.module.ts
│   ├── posts.controller.ts    # GET    /forum/posts       (帖子列表，支持 topicId 筛选)
│   │                          # POST   /forum/posts       (发帖)
│   │                          # GET    /forum/posts/:id   (帖子详情 + 回复)
│   │                          # PATCH  /forum/posts/:id   (编辑)
│   │                          # DELETE /forum/posts/:id   (删除)
│   ├── replies.controller.ts  # POST   /forum/posts/:id/replies  (回复)
│   │                          # PATCH  /forum/replies/:id        (编辑回复)
│   │                          # DELETE /forum/replies/:id        (删除回复)
│   └── forum.service.ts
│
├── progress/                  # 学习进度模块
│   ├── progress.module.ts
│   ├── progress.controller.ts # GET    /progress          (获取进度)
│   │                          # PATCH  /progress          (更新进度)
│   │                          # POST   /progress/sync     (本地数据同步)
│   │                          # GET    /progress/discoveries (成就列表)
│   └── progress.service.ts
│
├── games/                     # 游戏模块
│   ├── games.module.ts
│   ├── games.controller.ts    # POST   /games/records     (提交游戏记录)
│   │                          # GET    /games/records     (个人记录)
│   │                          # GET    /games/leaderboard/:gameType (排行榜)
│   ├── games.service.ts
│   └── rooms/                 # Colyseus 房间（已有，保持）
│       └── polarcraft.room.ts
│
├── designs/                   # 光学设计模块
│   ├── designs.module.ts
│   ├── designs.controller.ts  # CRUD   /designs
│   │                          # GET    /designs/gallery   (公开设计画廊)
│   │                          # POST   /designs/:id/like  (点赞)
│   └── designs.service.ts
│
├── storage/                   # 文件存储模块
│   ├── storage.module.ts
│   ├── storage.controller.ts  # POST   /storage/upload    (上传文件)
│   │                          # GET    /storage/:key      (获取文件)
│   └── storage.service.ts     # MinIO / OSS 适配器
│
└── common/                    # 公共工具
    ├── filters/
    │   └── http-exception.filter.ts
    ├── interceptors/
    │   └── transform.interceptor.ts  # 统一响应格式
    ├── decorators/
    │   ├── current-user.decorator.ts # @CurrentUser() 注入
    │   └── roles.decorator.ts        # @Roles('TEACHER', 'ADMIN')
    ├── dto/
    │   └── pagination.dto.ts         # 分页参数
    └── pipes/
        └── validation.pipe.ts
```

### 5.2 认证流程

**邮箱注册/登录**：
```
POST /auth/register  { email, password, displayName }
  → 创建 User，返回 { accessToken, refreshToken }

POST /auth/login  { email, password }
  → 验证密码，返回 { accessToken, refreshToken }

POST /auth/refresh  { refreshToken }
  → 签发新 accessToken
```

**OAuth 登录（微信/GitHub）**：
```
GET /auth/oauth/wechat → 302 重定向到微信授权页
GET /auth/oauth/callback/wechat?code=xxx
  → 用 code 换取用户信息
  → 查找或创建 User + OAuthAccount
  → 返回 { accessToken, refreshToken }
```

**Token 策略**：
- accessToken: JWT，15 分钟过期，包含 { userId, role }
- refreshToken: 随机字符串，存 Redis，7 天过期
- 前端在 accessToken 过期前自动刷新

### 5.3 权限控制矩阵

| 操作 | 游客 | 学生 | 课题成员 | 课题负责人 | 教师 | 管理员 |
|------|------|------|---------|-----------|------|--------|
| 浏览课题列表 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 查看课题信息 | ✅ (公开) | ✅ (公开) | ✅ | ✅ | ✅ | ✅ |
| 创建课题 | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 加入课题 | ❌ | ✅ | — | — | ✅ | ✅ |
| 提交结果 | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| 查看 TEAM_ONLY 结果 | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| 管理里程碑 | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| 修改课题状态 | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| 置顶/锁定帖子 | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| 删除任意内容 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| 浏览排行榜 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 提交游戏记录 | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 六、前端数据迁移策略

### 6.1 双轨机制

为避免强制登录影响体验，采用「本地优先 + 登录后同步」策略：

```
┌─────────────────────────────────────────┐
│              前端 Zustand Store           │
│                                         │
│  未登录 → localStorage (现有行为不变)     │
│  已登录 → API 调用 (后端持久化)           │
│                                         │
│  首次登录 → 合并 localStorage 到后端      │
│  后续使用 → 直接读写后端                  │
│  离线降级 → 回退 localStorage             │
└─────────────────────────────────────────┘
```

### 6.2 各 Store 迁移方案

| Store | 迁移优先级 | 策略 |
|-------|-----------|------|
| `collaborationStore` | **P0 (重写)** | 完全替换为 topics API。现有 JSON 导入/导出功能废弃，改为 REST API |
| `labStore` | **P1** | `taskProgress` + `skills` + `publications` → `CourseProgress.taskProgress` + `CourseProgress.researcherSkills`。个人学习任务保持前端为主，后端做持久化备份 |
| `discoveryStore` | **P1** | `completedDemos` → `CourseProgress.completedDemos`。成就/发现 → `Discovery` 表。`pendingNotifications` 保持前端 |
| `useCourseProgress` | **P1** | 直接映射到 `CourseProgress` 表。`streakDays` 由后端按 `lastActiveAt` 计算 |
| `opticalBenchStore` | **P2** | `savedDesigns` → `OpticalDesign` 表。运行时状态（当前组件、选中状态、历史栈）保持前端。用户可选择「保存到云端」或「仅本地」 |
| `gameStore` + 各游戏页面 | **P2** | 游戏完成时 POST 到 `GameRecord`。排行榜从后端读取。游戏运行时状态保持前端 |
| `simulationBlackBoxStore` | **不迁移** | 纯 session 级临时状态，无持久化需求 |

### 6.3 同步冲突处理

首次登录合并规则：
- `completedDemos`: 取并集（本地 ∪ 后端）
- `quizScores`: 取较高分
- `streakDays`: 取后端值（后端计算更准确）
- `savedDesigns`: 全量追加，按名称去重（保留更新时间较晚的版本）
- `gameRecords`: 全量追加（不去重，每次记录独立）

---

## 七、实时通信架构

### 7.1 架构分层

```
                      ┌──────────────┐
                      │    Nginx     │
                      │   反向代理    │
                      │  :80 / :443  │
                      └───────┬──────┘
                              │
                 ┌────────────┼────────────┐
                 │            │            │
          ┌──────┴──────┐ ┌──┴───┐ ┌──────┴──────┐
          │  NestJS API  │ │Redis │ │  PostgreSQL  │
          │  :3001       │ │:6379 │ │  :5432       │
          │  REST + WS   │ └──────┘ └─────────────┘
          └──────┬──────┘
                 │
        ┌────────┼────────┐
        │                 │
  ┌─────┴──────┐   ┌─────┴───────┐
  │  Colyseus  │   │  Socket.io  │
  │  :2567     │   │ (NestJS 内) │
  │            │   │             │
  │ 游戏房间:   │   │ 课题通知:    │
  │ - 多人对战  │   │ - 新成员加入 │
  │ - 实时同步  │   │ - 新结果提交 │
  │ - 4人上限   │   │ - 讨论更新   │
  └────────────┘   │ - 里程碑变更 │
                   └─────────────┘
```

### 7.2 Socket.io 事件设计

```typescript
// 客户端 → 服务端
'topic:subscribe'    { topicId }        // 订阅课题更新
'topic:unsubscribe'  { topicId }        // 取消订阅
'forum:typing'       { postId }         // 正在输入指示器

// 服务端 → 客户端
'topic:member_joined'   { topicId, member }     // 新成员加入
'topic:result_submitted' { topicId, result }     // 新结果提交
'topic:milestone_updated' { topicId, milestone } // 里程碑变更
'forum:new_post'        { topicId, post }        // 新帖子
'forum:new_reply'       { postId, reply }        // 新回复
'notification'          { type, message }        // 通用通知
```

---

## 八、文件存储

### 8.1 存储需求

| 类型 | 来源 | 预估大小 | 格式 |
|------|------|---------|------|
| 用户头像 | 注册/个人资料 | < 2 MB | jpg/png/webp |
| 研究结果附件 | 课题结果提交 | < 50 MB | pdf/docx/xlsx/csv/png/jpg |
| 光学设计缩略图 | 保存设计时自动生成 | < 500 KB | png |
| Markdown 内联图片 | 讨论区/结果 | < 5 MB | png/jpg/webp |

### 8.2 存储方案

```
开发环境: MinIO (Docker 容器，S3 兼容 API)
  → 本地 localhost:9000，控制台 localhost:9001

生产环境: 阿里云 OSS
  → 切换仅需修改环境变量（endpoint, accessKey, bucket）
  → CDN 加速静态文件访问
```

存储路径规范：
```
uploads/
├── avatars/{userId}/{timestamp}.webp
├── results/{topicId}/{resultId}/{filename}
├── designs/{userId}/{designId}/thumbnail.png
└── forum/{postId}/{filename}
```

### 8.3 安全措施

- 上传时校验文件类型（白名单）和大小限制
- 生成随机文件名，防止路径猜测
- 私有结果附件通过后端鉴权后签发临时 URL（有效期 1 小时）
- 公开内容直接通过 CDN 访问

---

## 九、部署架构

### 9.1 开发环境 (Docker Compose)

```yaml
version: '3.8'

services:
  # NestJS 应用（含 Colyseus）
  app:
    build: ./server
    ports:
      - "3001:3001"   # REST API + Socket.io
      - "2567:2567"   # Colyseus 游戏
    environment:
      DATABASE_URL: postgresql://polarcraft:password@postgres:5432/polarcraft
      REDIS_URL: redis://redis:6379
      MINIO_ENDPOINT: minio
      MINIO_PORT: 9000
      JWT_SECRET: dev-secret-change-in-production
    depends_on:
      - postgres
      - redis
      - minio

  # PostgreSQL
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: polarcraft
      POSTGRES_USER: polarcraft
      POSTGRES_PASSWORD: password
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  # MinIO (S3 兼容文件存储)
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - miniodata:/data
    ports:
      - "9000:9000"   # API
      - "9001:9001"   # 控制台

  # 前端（可选，也可直接 npm run dev）
  frontend:
    build: .
    ports:
      - "5173:5173"
    depends_on:
      - app

volumes:
  pgdata:
  miniodata:
```

### 9.2 生产环境（阿里云方案）

| 服务 | 阿里云产品 | 规格建议 | 月费估算 |
|------|-----------|---------|---------|
| 应用服务器 | ECS | 2核4G (ecs.c6.large) | ~¥200 |
| 数据库 | RDS PostgreSQL | 基础版 1核2G | ~¥150 |
| 缓存 | Redis 云版 | 1G 标准版 | ~¥100 |
| 文件存储 | OSS | 按量付费 | ~¥10 |
| CDN | 阿里云 CDN | 按流量付费 | ~¥20 |
| SSL 证书 | 免费版 | — | ¥0 |
| 域名 + ICP 备案 | — | — | ~¥50/年 |
| **合计** | | | **~¥530/月** |

### 9.3 中国合规要求

- **ICP 备案**：网站域名需在阿里云完成备案后才能解析到国内服务器
- **数据存储**：用户数据必须存储在中国大陆境内服务器
- **实名认证**：阿里云账号需完成实名认证
- **微信 OAuth**：需在微信开放平台注册应用，通过审核

---

## 十、实施优先级建议

### P0 — 基础设施 + 课题核心

必须首先完成，后续所有功能依赖这些基础：

1. Docker Compose 开发环境搭建
2. PostgreSQL + Prisma Schema 初始化
3. NestJS 模块结构搭建（prisma, auth, users, common）
4. 邮箱注册/登录 + JWT 认证
5. 课题 CRUD API (topics module)
6. 课题加入/退出流程
7. 课题结果提交 + 版本管理 (results module)
8. 前端课题列表页 + 详情页改造

### P1 — 协作与进度

在 P0 基础上扩展：

9. 课题内讨论区 (forum module，限 topicId 范围)
10. 里程碑管理 (milestones)
11. Socket.io 课题实时通知
12. 学习进度迁移 (progress module)
13. 发现/成就迁移 (discoveries)
14. 首次登录本地数据同步

### P2 — 扩展功能

非核心但提升体验：

15. OAuth 登录（微信 + GitHub）
16. 文件上传（MinIO/OSS）
17. 游戏记录持久化 + 排行榜
18. 光学设计云端保存 + 公开画廊
19. 通用论坛（不绑定课题的独立讨论区）

### P3 — 生产部署

20. 阿里云 ECS + RDS 配置
21. Nginx 反向代理 + SSL
22. ICP 备案
23. CDN 配置
24. 监控告警（应用日志、数据库监控、错误追踪）

---

## 十一、待决策事项

以下问题需要进一步讨论确定：

1. **课题审核**：学生创建课题后是否需要教师审核？还是任何人都可以自由创建？
2. **成员上限**：每个课题的默认最大成员数？是否允许负责人调整？
3. **匿名访客**：未登录用户能看到多少内容？（当前方案：可浏览公开课题信息和公开结果）
4. **邮件通知**：是否需要邮件通知（课题状态变更、新成员加入等）？涉及 SMTP 服务选型
5. **数据导出**：是否保留 JSON 导出/导入功能作为数据备份？
6. **开放挑战模板**：温大的真实研究课题是作为只读「推荐模板」还是作为可加入的正式课题？
7. **引导任务**：个人引导任务（Guided Tasks）是否也需要迁移到后端？还是保持纯前端？
8. **移动端适配**：后端 API 是否需要考虑未来的移动 App（小程序/React Native）？

---

## 十二、附录：现有代码影响分析

### 需要重写的文件

| 文件 | 原因 |
|------|------|
| `src/pages/LabPage.tsx` (1416 行) | 完全重构为课题列表 + 详情页结构 |
| `src/stores/collaborationStore.ts` (283 行) | 废弃，替换为 API 调用 |
| `src/stores/labStore.ts` (287 行) | 拆分为前端 UI 状态 + 后端 API 调用 |

### 需要修改的文件

| 文件 | 修改范围 |
|------|---------|
| `src/stores/discoveryStore.ts` | 添加 API 同步逻辑 |
| `src/stores/opticalBenchStore.ts` | `savedDesigns` 部分改为 API |
| `src/hooks/useCourseProgress.ts` | 添加 API 同步逻辑 |
| `src/pages/HomePage.tsx` | 进度数据从 API 获取（已登录时） |
| `src/pages/DemosPage.tsx` | 完成状态从 API 获取（已登录时） |
| `src/pages/Game2DPage.tsx` | 通关后提交记录到 API |
| `src/pages/GamePage.tsx` | 通关后提交记录到 API |
| `src/components/lab/ResearchTaskModal.tsx` | 适配新的课题系统 |
| `server/src/main.ts` | 添加 Prisma、Auth 等模块 |
| `server/src/app.module.ts` | 注册所有新模块 |
| `server/package.json` | 添加 Prisma、Passport、bcrypt 等依赖 |

### 新增的文件（预估）

| 目录 | 文件数 | 说明 |
|------|--------|------|
| `server/prisma/` | 2 | Schema + 种子数据 |
| `server/src/auth/` | 8 | Controller、Service、Strategies、Guards |
| `server/src/users/` | 3 | Controller、Service、DTOs |
| `server/src/topics/` | 8 | Topics + Results + Milestones |
| `server/src/forum/` | 4 | Posts + Replies |
| `server/src/progress/` | 3 | Progress + Sync |
| `server/src/games/` | 3 | Records + Leaderboard |
| `server/src/designs/` | 3 | CRUD + Gallery |
| `server/src/storage/` | 3 | Upload + S3 adapter |
| `server/src/common/` | 6 | Filters、Interceptors、Decorators |
| 前端新增页面/组件 | ~10 | 课题列表、详情、表单、讨论区组件 |
| Docker 配置 | 3 | Dockerfile、docker-compose.yml、.env |
| **合计** | **~55** | |
