# gstack + OpenClaw 融合可行性分析

**分析日期**：2026-03-31
**分析对象**：gstack（Y Combinator CEO Garry Tan） vs OpenClaw（Peter Steinberger）
**结论**：可以融合，但不能"完美合并"——互补集成是最优解

---

## 一、核心差异对比

| 维度 | gstack | OpenClaw |
|------|--------|---------|
| **核心定位** | 单人开发工作流 | 多渠道个人助理平台 |
| **运行环境** | Claude Code / Codex | OpenClaw Gateway |
| **交互模式** | 终端内循环（人 → Agent → 人） | 跨平台消息路由（人 ↔ Agent ↔ 多渠道） |
| **核心能力** | 编码、评审、设计、安全、部署 | 消息、记忆、多Agent、渠道接入 |
| **Agent 架构** | 单一 Agent + Skill 角色切换 | Main Agent + 多个 Sub-agent 分工 |
| **发布方** | Garry Tan（YC CEO）个人工具 | Peter Steinberger（平台） |
| **状态管理** | 无状态，每次调用独立 | 有状态的对话记忆（Memory Plugin） |
| **工具调用** | Claude Code 原生内置工具 | OpenClaw Tools API + MCP |

---

## 二、融合方案：互补集成

### 方案 A：gstack 作为 OpenClaw 的"开发技能库" ⭐推荐

```
OpenClaw（消息路由层）
    ↓ 调用
gstack Skill（编码工作流）
    ↓ 输出
Main Agent → 路由给用户
```

**实现路径**：
1. 把 gstack 的 Skill 文件复制到 OpenClaw 的 `.claude/skills/` 目录
2. OpenClaw 的 coding sub-agent 可以调用 `/review` `/qa` `/ship` 等
3. 用户在 Telegram 发消息 → OpenClaw 路由 → gstack Skill 执行 → 结果返回

**优势**：
- OpenClaw 用户瞬间获得专业开发工作流
- 不改变 OpenClaw 核心架构
- gstack 无需修改
- 两者保持独立演进

**挑战**：
- gstack 部分 Skill 依赖 Claude Code 特有工具（如浏览器操控）
- OpenClClaw 的 sub-agent 机制 vs gstack 的单 Agent 角色切换，设计思路不同，需要适配

---

### 方案 B：OpenClaw 作为 gstack 的"消息前端"

```
用户（Telegram/Discord/...）
    ↓
OpenClaw（渠道接入）
    ↓
gstack Agent（Claude Code 引擎）
    ↓
开发结果 → OpenClaw → 用户
```

**实现路径**：
1. OpenClaw 负责消息接入和路由
2. gstack 作为后端 Agent 处理编码任务
3. 通过 OpenClaw 的 `sessions_spawn` 调度 gstack

**优势**：
- gstack 用户获得跨平台消息能力
- 两者都用 SKILL.md 标准，技能可复用

**挑战**：
- gstack 本身是 Claude Code 的技能集合，不是独立服务
- 需要在 OpenClaw 中运行 Claude Code 引擎
- 工程复杂度较高

---

## 三、技术层面对比

### 技能标准兼容性

| 技能特性 | gstack | OpenClaw | 兼容性 |
|---------|--------|---------|--------|
| SKILL.md 标准 | ✅ 支持 | ✅ 支持 | ✅ 兼容 |
| Slash Commands | ✅ | ✅ | ✅ 可复用 |
| 工具调用 | Claude Code 原生工具 | OpenClaw Tools API | ⚠️ 需适配 |
| 记忆系统 | 依赖 Claude Code | Memory 插件 | ⚠️ 架构不同 |
| 子 Agent | 单 Agent 角色切换 | 多 Agent 分工 | ❌ 设计差异 |

### 关键不兼容点

```
1. Agent 运行时
   gstack → Claude Code 引擎（专有）
   OpenClaw → OpenClaw Runtime（Node.js）

2. 工具访问方式
   gstack → 直接调用 Claude Code 内置工具
   OpenClaw → Tools API + MCP 扩展

3. 状态管理
   gstack → 无状态，每次调用独立
   OpenClaw → 有状态的对话记忆（memory plugin）
```

---

## 四、融合收益分析

### 对 OpenClaw 的价值

| 引入 gstack | 收益 |
|------------|------|
| `/review` | OpenClaw 的 coding sub-agent 获得专业代码评审 |
| `/qa` | 获得真实浏览器自动化测试能力 |
| `/ship` | 部署自动化能力 |
| `/cso` | 安全审计能力 |
| `/design-*` | UI/UX 设计评审能力 |

### 对 gstack 的价值

| 引入 OpenClaw | 收益 |
|--------------|------|
| 消息渠道 | gstack 的 Agent 能力输出到 Telegram/Discord |
| 多 Agent | 不同任务分流到不同专业 Agent |
| 记忆系统 | 跨 session 记住项目上下文 |
| 渠道路由 | 一次开发，多渠道触达 |

---

## 五、推荐集成路径

```
Phase 1: 技能移植（低风险）
├── 把 gstack Skill 文件复制到 OpenClaw skills 目录
├── 测试 /review /qa /cso 等非浏览器依赖的 Skill
└── 验证 OpenClaw sub-agent 调用链

Phase 2: 能力补全（中风险）
├── 为 gstack 中依赖 Claude Code 的 Skill 开发 OpenClaw 等效实现
├── 桥接 OpenClaw Browser 工具到 gstack 工作流
└── 统一记忆系统接口

Phase 3: 深度融合（高风险/高回报）
├── 设计统一 Skill 加载器
├── 共享工具注册表
└── 构建"gstack inside OpenClaw"的旗舰技能
```

---

## 六、现实评估

| 评估项 | 评分 | 说明 |
|-------|------|------|
| 技术可行性 | ⭐⭐⭐⭐ | SKILL.md 标准兼容，基础融合没问题 |
| 融合成本 | ⭐⭐⭐ | 需要适配工具层和 Agent 调度 |
| 收益比 | ⭐⭐⭐⭐⭐ | 两者互补，集成后 1+1>2 |
| 维护负担 | ⭐⭐⭐ | 两套系统都需要跟进更新 |
| 长期兼容 | ⭐⭐⭐ | 依赖双方版本迭代保持同步 |

---

## 七、最终建议

**不要合并源码，但要实现互操作性**

1. **OpenClaw 集成 gstack Skills** — 最简单的价值放大方式
2. **保持独立演进** — 两者定位不同，独立发展更能聚焦
3. **通过标准接口通信** — 如果未来要更深融合，通过 SKILL.md + MCP 桥接

gstack 的长处是**开发工作流**，OpenClaw 的长处是**跨平台消息和多 Agent 协作**——强行合并会失去各自简洁性。**互补集成**是最优解。

---

_Last updated: 2026-03-31_
