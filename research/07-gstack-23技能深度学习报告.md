# gstack 23技能深度学习报告

> 学习日期：2026-04-02
> 学习对象：gstack-source (中文汉化版, 23技能)
> 学习深度：源码级分析

---

## 一、gstack核心设计理念

### 1.1 核心理念

| 理念 | 说明 |
|------|------|
| **Boil the Lake** | AI让完整性成本趋近于零，永远推荐完整方案而非捷径 |
| **1人=20人团队** | 每天10,000-20,000行代码 |
| **YC Office Hours** | 六个问题重构产品思维 |
| **主动建议** | 技能会在关键时刻自动弹出（可关闭） |
| **路由规则** | CLAUDE.md中的skill routing自动分发任务 |

### 1.2 设计原则

```
设计原则：
1. 说话直接、具体、有数字
2. 避免AI黑话（delve, crucial, robust等）
3. 命名具体文件、函数、行号
4. 用真实命令而非"你应该测试这个"
5. 连接回用户结果
```

---

## 二、23技能分类详解

### 2.1 需求规划（4技能）

| 技能 | 角色 | 核心价值 |
|------|------|----------|
| `/office-hours` | YC Office Hours | 六个问题重构产品 |
| `/plan-ceo-review` | CEO/Founder | 重新思考问题，10星级产品 |
| `/plan-eng-review` | Eng Manager | 锁定架构、数据流、边界用例 |
| `/plan-design-review` | Senior Designer | 计划模式设计审查，评分0-10 |

#### /office-hours 核心流程
```
1. 这是什么产品？谁是用户？
2. 用户的工作是什么？
3. 用户现在怎么做的？
4. 替代方案有哪些？
5. 六个问题挑战前提
6. 生成替代方案
```

#### /plan-ceo-review 模式
- **SCOPE EXPANSION**: 梦想大一点
- **SELECTIVE EXPANSION**: 保持范围+精选扩展
- **HOLD SCOPE**: 最大严格性
- **SCOPE REDUCTION**: 精简到本质

---

### 2.2 设计创意（4技能）

| 技能 | 角色 | 核心价值 |
|------|------|----------|
| `/design-consultation` | Design Partner | 从零构建设计系统 |
| `/design-review` | Designer Who Codes | 视觉审计+修复循环 |
| `/design-shotgun` | Design Explorer | 生成多个AI设计变体 |
| `/design-html` | Design Engineer | 生成响应式HTML |

#### /design-review 特点
- 实时截图对比
- 评分0-10
- 循环修复直到满意
- Preact实现，~100ms延迟

---

### 2.3 代码执行（4技能）

| 技能 | 角色 | 核心价值 |
|------|------|----------|
| `/review` | Staff Engineer | 找通过CI但会在生产爆炸的Bug |
| `/investigate` | Debugger | 系统根因调试 |
| `/qa` | QA Lead | 测试+找Bug+修复+回归 |
| `/qa-only` | QA Reporter | 仅报告Bug，不改代码 |

#### /review 审查重点
```
1. SQL安全（注入风险）
2. LLM trust boundary violations
3. 条件副作用
4. 结构性代码问题
```

#### /qa 三层测试
| 层级 | 覆盖范围 |
|------|----------|
| Quick | 关键/高级Bug |
| Standard | +中级Bug |
| Exhaustive | +Cosmetic问题 |

---

### 2.4 部署发布（5技能）

| 技能 | 角色 | 核心价值 |
|------|------|----------|
| `/ship` | Release Engineer | 同步→测试→审计→推送→PR |
| `/land-and-deploy` | Release Engineer | 合并→部署→验证生产健康 |
| `/canary` | SRE | 部署后监控，循环检查错误 |
| `/benchmark` | Performance Engineer | 页面性能基准测试 |
| `/setup-deploy` | Release Engineer | 部署配置 |

#### /ship 标准流程
```
1. 同步base分支
2. 运行测试套件
3. 审查diff
4. 递增VERSION
5. 更新CHANGELOG
6. Commit + Push
7. 创建PR
```

---

### 2.5 安全审计（3技能）

| 技能 | 角色 | 核心价值 |
|------|------|----------|
| `/cso` | Chief Security Officer | OWASP Top 10 + STRIDE审计 |
| `/guard` | Security Engineer | 完整安全模式 |
| `/freeze` | Security Engineer | 编辑锁定目录 |

#### /cso 审计维度
- OWASP Top 10
- STRIDE威胁建模
- 数据流安全
- 认证/授权检查

---

### 2.6 网络请求（2技能）

| 技能 | 角色 | 核心价值 |
|------|------|----------|
| `/browse` | QA Engineer | 真实Chromium浏览器 |
| `/setup-browser-cookies` | Session Manager | 导入真实浏览器Cookie |

#### /browse 能力
- 导航任意URL
- 交互元素
- 验证页面状态
- 对比前后操作
- 截图标注
- 测试响应式布局
- 表单和上传测试
- ~100ms/命令

---

### 2.7 多AI协作（2技能）

| 技能 | 角色 | 核心价值 |
|------|------|----------|
| `/autoplan` | Review Pipeline | CEO→设计→工程自动审查 |
| `/learn` | Memory | 跨会话学习记忆 |

#### /autoplan 协作流程
```
CEO (plan-ceo-review)
    ↓
设计 (design-consultation)
    ↓
工程 (plan-eng-review)
```

---

## 三、Preamble通用模式

每个技能都有相同的Preamble模板：

```bash
# 1. 检查更新
_UPD=$(~/.claude/skills/gstack/bin/gstack-update-check)
[ -n "$_UPD" ] && echo "$_UPD"

# 2. 会话管理
mkdir -p ~/.gstack/sessions
touch ~/.gstack/sessions/"$PPID"

# 3. 配置读取
_PROACTIVE=$(gstack-config get proactive)
_SKILL_PREFIX=$(gstack-config get skill_prefix)

# 4. Repo模式
source <(gstack-repo-mode)
REPO_MODE=${REPO_MODE:-unknown}

# 5. 学习记录
eval "$(gstack-slug 2>/dev/null)"
_LEARN_COUNT=$(wc -l < "$_LEARN_FILE" 2>/dev/null)

# 6. 路由检查
_HAS_ROUTING=$(grep "## Skill routing" CLAUDE.md)
```

---

## 四、AskUserQuestion标准格式

每个技能都遵循标准格式：

```markdown
1. **Re-ground:** 项目、当前分支、当前任务
2. **Simplify:** 16岁能懂的解释，无术语
3. **Recommend:** 推荐方案 + Completeness: X/10
4. **Options:** A) B) C) 带human/CC估算
```

**Completeness参考**：
| Task | Human | CC+gstack | 压缩比 |
|------|-------|------------|--------|
| Boilerplate | 2天 | 15分钟 | ~100x |
| Tests | 1天 | 15分钟 | ~50x |
| Feature | 1周 | 30分钟 | ~30x |
| Bug fix | 4小时 | 15分钟 | ~20x |

---

## 五、技能文件结构

每个技能包含：

| 文件 | 说明 |
|------|------|
| `SKILL.md` | 技能定义和指令 |
| `SKILL.md.tmpl` | 模板源文件 |
| `bin/` | 可执行脚本 |
| `test/` | 测试文件 |

### SKILL.md 头部格式
```yaml
---
name: skill-name
preamble-tier: 1-4
version: 1.0.0
description: |
  一行描述
  多行详细说明
allowed-tools:
  - Bash
  - Read
  - Edit
  - ...
---
```

---

## 六、对灵枢的启示

### 6.1 技能设计

| gstack实践 | 灵枢可借鉴 |
|------------|------------|
| Preamble模板 | 灵枢引擎统一初始化流程 |
| AskUserQuestion格式 | 用户交互标准化 |
|路由规则 | 灵枢Skill Routing |
| Proactive建议 | 灵枢智能推荐 |

### 6.2 质量保证

| gstack实践 | 灵枢实现 |
|------------|----------|
| /review 代码审查 | 灵枢 /review 技能 |
| /qa 测试+修复 | 灵枢 /qa 技能 |
| /cso 安全审计 | 灵枢 /cso 技能 |
| /canary 部署监控 | 灵枢监控模块 |

### 6.3 DevOps流水线

```
/ship → /qa → /canary → /benchmark
  ↓       ↓        ↓        ↓
同步    测试    部署监控   性能验证
```

### 6.4 设计原则

灵枢应该遵循的原则：

```
1. 说话直接，有数字
   "这个查询是N+1，~200ms每页面"
   而非 "这可能会有点慢"

2. Boil the Lake
   永远推荐完整方案而非捷径

3. 连接回用户
   "这个Bug会让用户看到3秒加载"

4. 主动建议
   当用户说"能工作吗"时弹出/qa
```

---

## 七、灵枢技能实现建议

### 7.1 核心技能（必须）

| 技能 | 实现 | 来源 |
|------|------|------|
| `/review` | 代码审查 | gstack /review |
| `/qa` | 测试+修复 | gstack /qa |
| `/ship` | 发布流程 | gstack /ship |
| `/browse` | 浏览器自动化 | gstack /browse |
| `/cso` | 安全审计 | gstack /cso |
| `/office-hours` | 需求咨询 | gstack /office-hours |

### 7.2 扩展技能（计划）

| 技能 | 实现 | 来源 |
|------|------|------|
| `/plan-ceo-review` | CEO视角评审 | gstack |
| `/plan-eng-review` | 技术评审 | gstack |
| `/design-review` | 设计审查 | gstack |
| `/investigate` | 调试调查 | gstack |
| `/canary` | 部署监控 | gstack |
| `/benchmark` | 性能测试 | gstack |

### 7.3 灵枢特有技能（创新）

| 技能 | 说明 |
|------|------|
| `/wechat-manage` | 微信公众号管理 |
| `/smart-tourism` | 智慧旅游场景 |
| `/agent-social` | 智能体社交 |

---

## 八、总结

### gstack的成功要素

1. **专业化分工**: 每个技能一个角色专注一件事
2. **标准化流程**: Preamble + AskUserQuestion统一格式
3. **主动建议**: 技能在关键时刻自动弹出
4. **路由自动化**: CLAUDE.md配置自动分发
5. **Boil the Lake**: 永远做完整的事情
6. **有数字有证据**: 具体文件名、行号、命令

### 灵枢的差距

| 方面 | gstack | 灵枢现状 |
|------|--------|----------|
| 技能数量 | 23+8 | 0 |
| 技能质量 | 源码级实现 | 待开发 |
| 路由机制 | CLAUDE.md | 待设计 |
| 主动建议 | proactive模式 | 待实现 |
| 标准化 | Preamble模板 | 待建立 |

### 灵枢行动计划

| 阶段 | 任务 | 优先级 |
|------|------|--------|
| Phase 1 | 实现6个核心技能 | P0 |
| Phase 2 | 建立Preamble模板 | P1 |
| Phase 3 | 实现Skill Routing | P1 |
| Phase 4 | 扩展到23技能 | P2 |

---

_Last updated: 2026-04-02_
