# 灵枢 (AIBody)

> 私有化AI智能中枢 - 让AI拥有持久记忆、自主规划、跨场景迁移的能力

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/isatk/AIBody?style=social)](https://github.com/isatk/AIBody)
[![Gitee Stars](https://gitee.com/lotusisatk/aibody/badge/star.svg?theme=gitee)](https://gitee.com/lotusisatk/aibody)

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
│                         ↓ gRPC                         │
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

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **客户端** | Flutter / React / Tauri | 跨平台UI |
| **服务层** | Go + Gin + Redis | 高性能API网关 |
| **引擎层** | Node.js + openclaw | AI执行引擎 |
| **能力层** | gstack (23技能) + agency (179智能体) | 技能和智能体库 |

## 目录结构

```
灵枢/
├── src/
│   ├── client/          # 客户端层
│   │   ├── web/         # Web端 (React)
│   │   ├── mobile/      # 移动端 (Flutter)
│   │   └── desktop/     # 桌面端 (Tauri)
│   ├── service/         # 服务层 (Go)
│   │   └── go/          # Go服务
│   ├── engine/          # 引擎层 (Node.js + openclaw)
│   │   ├── openclaw/    # openclaw核心
│   │   ├── gstack/      # gstack技能集成
│   │   └── agency/       # agency智能体集成
│   └── capabilities/    # 能力层
│       ├── skills/      # 技能定义
│       └── agents/      # 智能体定义
├── deploy/              # 部署配置
│   ├── docker/          # Docker Compose
│   └── k8s/             # Kubernetes
├── docs/                # 文档
├── tests/               # 测试
├── scripts/             # 脚本
└── config/              # 配置文件
```

## 快速开始

### 前置要求

- Node.js >= 22.12
- Go >= 1.21
- Docker & Docker Compose
- MySQL 8.0
- Redis 7.0+

### 安装

```bash
# 克隆仓库
git clone https://github.com/isatk/AIBody.git
cd AIBody

# 启动Docker服务
docker-compose up -d

# 安装依赖
cd src/engine && npm install
cd src/service/go && go mod download

# 启动服务
./scripts/dev.sh
```

## 核心功能

- ✅ **即时ACK** - 100ms内确认收到消息
- ✅ **任务队列** - 多任务管理，支持优先级
- ✅ **进度可视化** - 实时任务进度推送
- ✅ **gstack技能** - 23个工程技能
- ✅ **agency智能体** - 179个专家智能体
- ✅ **私有化部署** - 完全自主，数据不出公网

## 开发文档

- [PRD V1.7](./docs/PRD-V1.7.md) - 产品需求文档
- [验证报告](./docs/PRD-V1.7-Verification-Checklist.md) - PRD验证结果
- [执行记录](./执行记录-2026-04-01-v1.6.md) - 开发执行记录

## 开源协议

本项目采用 [MIT](LICENSE) 开源协议。

## 相关仓库

| 仓库 | 地址 | 说明 |
|------|------|------|
| 主仓库 (GitHub) | https://github.com/isatk/AIBody | 开发主仓库 |
| 镜像 (Gitee) | https://gitee.com/lotusisatk/aibody | 国内镜像 |
| gstack | https://github.com/garrytan/gstack | 技能库原始版 |
| openclaw | https://github.com/openclaw/openclaw | 引擎底层框架 |

---

_Last updated: 2026-04-01_
