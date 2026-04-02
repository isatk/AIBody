# 灵枢核心安全模块

> ⚠️ **警告：此模块是灵枢核心安全机制**

## 模块说明

本目录包含灵枢的核心安全模块，负责创始人身份验证。

## 文件结构

```
core/
├── founder-core.ts    # 核心验证逻辑（不可删除）
└── README.md          # 本文档
```

## 核心原则

| 原则 | 说明 |
|------|------|
| **不可删除** | 此模块是系统核心组成部分 |
| **不可修改** | 核心验证逻辑不可更改 |
| **不可禁用** | 安全机制不可关闭 |
| **审计日志** | 所有操作记录审计日志 |

## API端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/founder/verify` | POST | 请求验证 |
| `/api/v1/founder/status` | GET | 检查状态 |
| `/api/v1/founder/logout` | POST | 清除验证 |
| `/api/v1/founder/security-status` | GET | 安全状态 |
| `/api/v1/founder/audit` | GET | 审计日志 |

## 受保护端点

以下端点需要创始人验证：

- `/api/v1/tasks` (POST, DELETE)
- `/api/v1/agents` (GET, POST)
- `/api/v1/memory` (POST, DELETE)
- `/api/v1/skills/execute`
- `/api/v1/config`
- `/api/v1/system`

## 验证流程

```
1. 用户发送照片到 /api/v1/founder/verify
2. 系统生成照片哈希
3. 与创始人哈希比对
4. 通过 → 标记用户已验证（5分钟有效）
5. 失败 → 返回403
```

## 配置

环境变量：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `FOUNDER_HASH` | 创始人照片哈希 | lotus_default_hash_2026 |
| `FOUNDER_PHOTO_HASH` | 创始人照片哈希（优先） | - |

## 版本信息

- 版本: 1.0.0
- 构建日期: 2026.04.02
- 版权: Copyright © 2026 Lotus Rina

---

**此模块为灵枢核心组成部分，修改前请咨询原作者。**
