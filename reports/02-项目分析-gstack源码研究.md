# gstack 源码深度分析报告

**项目名称**：gstack
**原始作者**：Garry Tan（Y Combinator President & CEO）
**仓库地址**：https://github.com/garrytan/gstack
**协议**：MIT
**GitHub Stars**：持续增长中
**开发语言**：TypeScript（核心）

---

## 一、项目概述

gstack 是 Y Combinator CEO Garry Tan 的个人 AI 开发工具包，定位为**将 Claude Code 转化为虚拟工程团队**。

Garry Tan 本人分享的开发数据：
- **60天内**：600,000+ 行生产代码（含35%测试）
- **日产量**：10,000-20,000 行（兼职）
- **一周 /retro**：140,751 行新增，362 次提交，净增 115K 行代码
- **对比**：2013年（无AI工具）全年仅 772 次 GitHub 贡献

---

## 二、核心定位

gstack 不仅仅是代码生成工具，而是一个**完整的 AI 工程团队替代方案**。

它将单一 AI 助手通过角色分配转化为多角色协作：
- 一个"CEO"负责产品方向
- 一个"工程经理"负责架构决策
- 一个"设计师"负责设计质量把控
- 一个"评审员"负责代码审查
- 一个"QA负责人"负责自动化测试
- 一个"安全官"负责安全审计
- 一个"发布工程师"负责 CI/CD 自动化

---

## 三、七大角色详解

### 1. 👔 CEO（产品战略）

**职责**：站在产品视角评估功能方案、质疑需求必要性、防止功能膨胀

**常用技能**：`/plan-ceo-review`、`/office-hours`

**核心原则**：删掉这个功能对用户有什么损失？如果没有，它就不该加。

---

### 2. 🏗 工程经理（架构决策）

**职责**：把控技术选型、锁定架构设计、制定代码规范、评估技术债务

**常用技能**：`/plan-eng-review`、`/autoplan`

**核心原则**：架构不是选最酷的技术，而是选团队能驾驭的、解决实际问题最少的方案。

---

### 3. 🎨 设计师（设计质量把控）

**职责**：识别 AI 生成的"设计垃圾"、确保设计符合人机交互规范、把控视觉一致性

**常用技能**：`/design-consultation`、`/design-review`、`/design-shotgun`

**核心原则**：AI 生成的设计稿，70% 需要修正（颜色对比度、间距、字体层级、组件状态）。

---

### 4. 🔍 评审员（代码审查）

**职责**：发现潜在 Bug 和逻辑错误、检查代码可维护性、识别性能问题

**常用技能**：`/review`、`/careful`

**核心原则**：每个 PR 至少过一遍 /review，不是挑刺，是防止线上故障。

---

### 5. 🧪 QA 负责人（测试验证）

**职责**：真实浏览器自动化测试、验证功能符合需求、确保跨浏览器兼容性

**常用技能**：`/qa`、`/qa-only`

**核心原则**：自动化测试替代手工回归，释放 QA 去做探索性测试。

---

### 6. 🔐 安全官（安全审计）

**职责**：OWASP Top 10 威胁建模、STRIDE 安全分析、识别注入和认证问题

**常用技能**：`/cso`、`/guard`

**STRIDE 威胁模型**：

| 威胁类型 | 说明 | 示例 |
|---------|------|------|
| Spoofing | 身份伪造 | Session 劫持 |
| Tampering | 数据篡改 | SQL 注入 |
| Repudiation | 否认操作 | 日志缺失 |
| Information Disclosure | 信息泄露 | 敏感数据暴露 |
| Denial of Service | 拒绝服务 | API 刷请求 |
| Elevation of Privilege | 权限提升 | 普通用户变管理员 |

---

### 7. 🚀 发布工程师（CI/CD 自动化）

**职责**：自动化 PR 合并、管理部署流水线、灰度发布和回滚

**常用技能**：`/ship`、`/land-and-deploy`、`/canary`

**核心原则**：发布是自动化的，人工干预只在红灯时介入。

---

## 四、角色协同流程

```
用户提出需求
    ↓
👔 CEO 评审 → 值得做吗？
    ↓ 值得
🏗 EM 架构评审 → 技术方案可行吗？
    ↓ 可行
🎨 设计评审 → 体验达标吗？
    ↓ 通过
💻 开发实现
    ↓
🔍 评审员 Review → 有 Bug 吗？
    ↓ 通过
🔐 安全官审计 → 有漏洞吗？
    ↓ 通过
🧪 QA 测试 → 功能正常吗？
    ↓ 通过
🚀 发布工程师 → 上线！
```

---

## 五、完整技能清单（23个专家 + 8个命令）

### 核心工作流
| 命令 | 用途 |
|------|------|
| `/office-hours` | 产品方向咨询 |
| `/plan-ceo-review` | CEO 视角评审功能方案 |
| `/plan-eng-review` | 工程架构评审 |
| `/plan-design-review` | 设计合理性评审 |
| `/review` | PR 代码审查 |
| `/qa` | 自动化 QA 测试（真实浏览器） |
| `/ship` | 完整发布流程 |
| `/land-and-deploy` | 合并 + 部署 |
| `/canary` | 灰度发布管理 |

### 设计专项
| 命令 | 用途 |
|------|------|
| `/design-consultation` | 设计咨询 |
| `/design-shotgun` | 快速设计初稿 |
| `/design-html` | HTML 设计输出 |
| `/design-review` | 设计审查 |

### 安全与质量
| 命令 | 用途 |
|------|------|
| `/cso` | 首席安全官（OWASP审计） |
| `/careful` | 谨慎模式（高风险警告） |
| `/guard` / `/freeze` / `/unfreeze` | 临时禁用/恢复危险操作 |

### 其他工具
`/benchmark`、`/browse`、`/connect-chrome`、`/investigate`、`/retro`、`/document-release`、`/codex`、`/autoplan`、`/learn`

---

## 六、技术架构

- **标准兼容**：支持 SKILL.md 标准（Anthropic 规范）
- **支持宿主**：Claude Code、Codex、Factory Droid
- **安装方式**：git clone 后 `./setup`，不修改 PATH，不后台运行
- **依赖**：Bun v1.0+ · Git · Node.js（仅 Windows）
- **运行时**：TypeScript Native，保持高度可 hack 性

---

## 七、安装方式

```bash
# 安装到用户目录
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup

# 或安装到当前项目
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git .claude/skills/gstack
cd .claude/skills/gstack && ./setup
```

---

## 八、gstack vs 传统团队对比

| 传统团队 | gstack Agent | 效率提升 |
|---------|-------------|---------|
| 1个 CEO | /plan-ceo-review | 即时 |
| 1个 EM + 架构评审会 | /plan-eng-review | 数小时 → 几分钟 |
| 设计师主观判断 | /design-review | 可量化、可复现 |
| Code Review（同事） | /review | 不占用同事时间 |
| QA 手工测试 | /qa（浏览器自动化） | 覆盖度更高 |
| 安全审计（专项） | /cso | 集成到每次 PR |
| 发布靠 DevOps | /ship / land-and-deploy | 全自动 |

---

## 九、对本项目的参考价值

gstack 的本质：**把一个成熟工程团队的经验，压缩成 AI 可调用的标准化流程。**

| 维度 | 传统模式 | gstack 模式 |
|------|---------|-----------|
| 响应速度 | 小时级 | 分钟级 |
| 流程标准化 | 依赖个人经验 | 标准化、可复现 |
| 覆盖范围 | 依赖团队配置 | 按需调用，不受人员限制 |
| 成本 | 人月成本 | Token 成本 |

gstack 的设计思路与本项目的 **"多 Agent 分工协作体系"** 高度契合，可作为重要的技术参考。

---

_Last updated: 2026-03-31_
