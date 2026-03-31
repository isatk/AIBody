# OpenClaw 源码深度分析报告

**项目名称**：openclaw / OpenClaw
**作者**：Peter Steinberger
**仓库地址**：https://github.com/openclaw/openclaw
**GitHub Stars**：**247,000+**（全球最 starred 项目之一）
**协议**：MIT
**开发语言**：TypeScript（核心）· Node.js 运行时
**最低 Node**：v22.16+，推荐 v24
**官网**：https://openclaw.ai
**文档**：https://docs.openclaw.ai

---

## 一、项目概述

OpenClaw 是一个**多渠道 AI 控制平面**，让你的私人 AI 助手运行在你自己的设备上，通过你已经使用的消息渠道（Telegram、Discord、WhatsApp 等）与你交互。

核心定位：**你的私人 AI 助手，跨任何 OS / 任何平台 / 任何消息渠道。**

OpenClaw 于 2025年11月发布，在极短时间内获得 247,000+ GitHub stars，超越了 React 和 Linux 的增长曲线，成为 GitHub 上最 star 的非聚合类软件项目之一。

---

## 二、核心功能

| 功能 | 说明 |
|------|------|
| **多渠道接入** | Telegram、Discord、WhatsApp、Signal、iMessage、Slack 等 20+ 平台 |
| **跨平台运行** | macOS / iOS / Android / Windows（WSL2）/ Linux |
| **Canvas 可视化** | 实时控制浏览器 Canvas |
| **Skill 系统** | 可插拔技能扩展（遵循 SKILL.md 标准） |
| **MCP 支持** | via mcporter（第三方桥接） |
| **Plugin API** | 插件扩展机制 |
| **记忆系统** | 多记忆插件可选 |
| **安全策略** | DM 配对码、来源白名单、DM 策略管控 |
| **多 Agent** | Main Agent + 多个 Sub-agent 分工协作 |

---

## 三、技术架构

```
┌─────────────────────────────────┐
│         OpenClaw Gateway        │
│   (Daemon: launchd / systemd)    │
├─────────┬──────────┬────────────┤
│ Channels│  Agents  │  Skills    │
│ (Telegram│ (Main+  │ (clawhub.ai)│
│  Discord│  Sub-   │            │
│  ... )  │  agents)│            │
├─────────┴──────────┴────────────┤
│        Tools / Memory / MCP      │
└─────────────────────────────────┘
```

**核心特性**：
- **TypeScript Native**：保持高度可 hack 性强
- **Skill 标准**：遵循 Anthropic SKILL.md 规范
- **插件分发**：优先推 ClawHub，核心保持精简
- **MCP 集成**：通过 mcporter 桥接，不绑定官方 runtime

---

## 四、安装方式

```bash
# 推荐方式（终端引导式）
npm install -g openclaw@latest
openclaw onboard --install-daemon

# 开发者源码构建
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm build
pnpm openclaw onboard --install-daemon
```

---

## 五、项目当前状态

| 维度 | 状态 |
|------|------|
| **Stars** | 247K+，增长极快 |
| **阶段** | 早期快速迭代 |
| **发布时间** | 2025年11月 |
| **维护** | 活跃，stable/beta/dev 三通道 |
| **安全** | 重点投入（DM pairing、配对码机制） |

**当前优先级**：

1. 🔐 安全与安全默认值
2. 🐛 Bug 修复与稳定性
3. 📦 主流模型 + 主流渠道支持
4. ⚡ 性能与测试基础设施
5. 🖥️ 跨平台伴侣 App

---

## 六、安全机制

OpenClaw 对安全的重视体现在：

1. **DM 配对码机制**：未知发送者需配对码审批才能对话
2. **DM 策略可配置**：`pairing`（需审批）/ `open`（开放）/ 严格白名单
3. **来源追踪**：所有入站 DM 被视为不可信输入
4. **安全文档**：`SECURITY.md` 详细描述所有安全考量和配置建议

**配置建议**：运行 `openclaw doctor` 检查潜在风险配置。

---

## 七、Plugin 和 Skill 系统

### Plugin API
- 核心保持精简，可选能力通过插件提供
- 优先 npm 包分发 + 本地扩展加载
- 记忆系统是特殊插件槽，一次只能激活一个记忆插件

### Skill 系统（SKILL.md 标准）
- 遵循 Anthropic SKILL.md 规范
- 新技能优先发布到 ClawHub（clawhub.ai），不直接加入核心
- 技能可通过 slash commands 调用

### MCP 支持
- 通过 mcporter 桥接（https://github.com/steipete/mcporter）
- 优势：灵活解耦，修改 MCP server 无需重启 Gateway

---

## 八、与 gstack 的对比

| 维度 | gstack | OpenClaw |
|------|--------|---------|
| **核心定位** | 单人开发工作流 | 多渠道个人助理平台 |
| **运行环境** | Claude Code / Codex | OpenClaw Gateway |
| **交互模式** | 终端内循环（人 → Agent → 人） | 跨平台消息路由（人 ↔ Agent ↔ 多渠道） |
| **核心能力** | 编码、评审、设计、安全、部署 | 消息、记忆、多Agent、渠道接入 |
| **Agent 架构** | 单一 Agent + Skill 角色切换 | Main Agent + 多个 Sub-agent |
| **发布方** | Garry Tan（YC CEO）个人工具 | Peter Steinberger（平台） |
| **技能标准** | SKILL.md（兼容） | SKILL.md（原生） |

**互补性**：gstack 擅长开发工作流，OpenClaw 擅长多渠道协作，两者可通过 SKILL.md 标准实现互操作。

---

## 九、对本项目的参考价值

你现在运行的正是 OpenClaw 系统——**OpenClaw 就是你的"多 Agent 协作平台"的底层骨架**：

| 你已有的设计 | OpenClaw 提供 |
|-------------|--------------|
| 多 Agent 分工（coding/ops/testing/docs/personal） | Sub-agent 机制 + Skill 系统 |
| 消息路由（Telegram） | Channels 适配层 |
| 记忆系统 | Memory 插件 |
| 技能扩展 | ClawHub / SKILL.md |
| 工具调用 | Tools API |

---

## 十、⚠️ 潜在风险

> 有报告称 ClawHub 市场中相当比例的插件可能存在恶意代码。

**建议**：
- 优先使用 OpenClaw 官方内置技能
- 第三方插件审核后再安装
- 关注 SECURITY.md 中的安全配置

---

_Last updated: 2026-03-31_
