# 灵枢 (AIBody)

> 私有化AI智能中枢 - 让AI拥有持久记忆、自主规划、跨场景迁移的能力

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/isatk/AIBody?style=social)](https://github.com/isatk/AIBody)
[![Gitee Stars](https://gitee.com/lotusisatk/aibody/badge/star.svg?theme=gitee)](https://gitee.com/lotusisatk/aibody)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)]()

---

## 产品愿景

打破当前AI的四大桎梏：

| 桎梏 | 现状 | 灵枢愿景 |
|------|------|----------|
| 🏝️ 孤岛智能 | AI依附单一载体 | 🌍 无界陪伴 |
| 🧬 短时智能 | 上下文割裂 | 🧬 长寿懂你 |
| ⚡ 转瞬智能 | 系统崩溃不可复活 | ⚡ 稳定同行 |
| 🚀 有限智能 | 能力碎片化 | 🚀 无限适配 |

---

## 产品架构

```
┌─────────────────────────────────────────────────────────┐
│                    灵枢产品                              │
│                  完整的私有化AI中枢                         │
│                                                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │              灵枢App客户端层                      │  │
│  │     Flutter (移动/桌面) │ React (Web)           │  │
│  └─────────────────────────────────────────────────┘  │
│                         ↓ WebSocket/HTTPS               │
│  ┌─────────────────────────────────────────────────┐  │
│  │              灵枢服务层 (Go)                      │  │
│  │   API网关 │ 任务队列 │ 即时ACK │ 进度推送        │  │
│  └─────────────────────────────────────────────────┘  │
│                         ↓ gRPC                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │              ★ 灵枢引擎 ★                          │  │
│  │         基于 openclaw 构建                        │  │
│  │   Gateway │ Agent │ Memory │ Skills │ Plugins    │  │
│  └─────────────────────────────────────────────────┘  │
│                         ↓                               │
│  ┌─────────────────────────────────────────────────┐  │
│  │              能力层                              │  │
│  │   gstack技能 (23) │ agency智能体 (179)          │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 技术栈

### 客户端层
| 平台 | 技术 | 状态 |
|------|------|------|
| Web | React 18 + TypeScript | 🔄 开发中 |
| Android | Kotlin + Jetpack Compose | 📋 计划中 |
| iOS | Swift + SwiftUI | 📋 计划中 |
| Desktop | Tauri 2.0 | 📋 计划中 |

### 服务层 (Go)
| 组件 | 技术 |
|------|------|
| API框架 | Gin |
| WebSocket | gorilla/websocket |
| 任务队列 | Redis + 自研 |
| ORM | GORM |
| 数据库 | MySQL 8.0 |
| 缓存 | Redis Cluster |

### 引擎层 (Node.js + openclaw)
| 组件 | 技术 |
|------|------|
| 运行时 | Node.js >= 22.12 |
| Web框架 | Hono |
| AI SDK | OpenAI / Anthropic / Gemini |
| 向量存储 | sqlite-vec |

---

## 目录结构

```
灵枢/
├── src/
│   ├── client/           # 客户端层
│   │   ├── web/         # React Web应用
│   │   ├── mobile/      # Flutter移动端
│   │   └── desktop/     # Tauri桌面端
│   ├── service/         # 服务层 (Go)
│   │   ├── cmd/         # 入口文件
│   │   │   └── server/  # 服务入口
│   │   ├── internal/     # 内部包
│   │   │   ├── api/     # HTTP/WebSocket处理
│   │   │   ├── queue/   # 任务队列
│   │   │   ├── model/   # 数据模型
│   │   │   └── service/ # 业务逻辑
│   │   ├── pkg/         # 可导出包
│   │   └── config/      # 配置文件
│   ├── engine/          # 引擎层 (Node.js + TypeScript)
│   │   ├── src/
│   │   │   ├── agent/   # Agent管理
│   │   │   ├── memory/  # Memory存储
│   │   │   ├── skills/  # 技能加载
│   │   │   └── gateway/ # 与服务层通信
│   │   └── package.json
│   └── capability/       # 能力层
│       ├── skills/      # gstack技能定义
│       └── agents/      # agency智能体定义
├── deploy/              # 部署配置
│   ├── docker-compose/  # Docker Compose
│   └── k8s/            # Kubernetes
├── docs/                # 文档
│   ├── PRD-V1.7.md     # 产品需求文档
│   └── PRD-V1.7-Verification-Checklist.md
├── scripts/             # 脚本工具
├── tests/               # 测试
├── ppt/                 # PPT演示文稿 (不推送到Git)
└── README.md
```

---

## 快速开始

### 前置要求

| 组件 | 版本要求 |
|------|----------|
| Node.js | >= 22.12 |
| Go | >= 1.21 |
| Docker | latest |
| Docker Compose | v2+ |
| MySQL | 8.0+ |
| Redis | 7.0+ |

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/isatk/AIBody.git
cd AIBody

# 2. 启动Docker服务
docker-compose -f deploy/docker-compose/dev.yml up -d

# 3. 等待服务就绪
sleep 10

# 4. 安装Node.js依赖
cd src/engine
npm install

# 5. 启动引擎 (新终端)
npm run dev

# 6. 启动Go服务 (新终端)
cd src/service
go mod download
go run cmd/server/main.go
```

### 访问服务

| 服务 | 地址 | 说明 |
|------|------|------|
| Go API服务 | http://localhost:8080 | 主要API端点 |
| Node引擎 | http://localhost:3000 | AI执行引擎 |
| Grafana | http://localhost:3001 | 监控面板 |
| Prometheus | http://localhost:9090 | 指标监控 |
| MinIO Console | http://localhost:9001 | 对象存储 |

---

## 核心功能

### ✅ 即时ACK
- 100ms内确认收到消息
- 显示任务排队位置

### ✅ 任务队列
- 多任务管理
- P0-P3四级优先级
- 实时进度推送

### ✅ gstack技能 (23个)
| 分类 | 数量 | 示例 |
|------|------|------|
| 需求规划 | 3 | /office-hours, /plan-ceo-review |
| 代码执行 | 3 | /review, /qa, /qa-only |
| 部署发布 | 3 | /ship, /land-and-deploy, /canary |
| 安全审计 | 1 | /cso |
| 网络请求 | 1 | /browse |
| 调试分析 | 1 | /investigate |
| 设计创意 | 3 | /design-consultation, /design-html |
| 办公集成 | 6 | /github, /jira, /slack |

### ✅ agency智能体 (179个)
| 部门 | 数量 | 代表性角色 |
|------|------|----------|
| 工程部 | 30 | 前端开发者、后端架构师、DevOps |
| 营销部 | 34 | 小红书运营、抖音策略师 |
| 产品部 | 5 | 产品经理 |
| 数据部 | 15 | 数据分析师 |

---

## 开发文档

| 文档 | 说明 |
|------|------|
| [PRD V1.7](./docs/PRD-V1.7.md) | 产品需求文档 (15章节) |
| [验证报告](./docs/PRD-V1.7-Verification-Checklist.md) | PRD质量验证 (79%通过率) |
| [执行记录](./执行记录-2026-04-01-v1.6.md) | 开发执行记录 |

---

## 开源协议

本项目采用 [MIT](LICENSE) 开源协议。

---

## 相关链接

| 平台 | 地址 |
|------|------|
| GitHub | https://github.com/isatk/AIBody |
| Gitee | https://gitee.com/lotusisatk/aibody |
| openclaw | https://github.com/openclaw/openclaw |
| gstack | https://github.com/garrytan/gstack |

---

## 开发团队

| 角色 | 职责 |
|------|------|
| main | 需求分析、产品设计 |
| coding | 前端开发、后端开发 |
| testing | 功能测试、集成测试 |
| ops | 部署、运维、监控 |

---

_Last updated: 2026-04-01_
