-- 灵枢数据库初始化脚本
-- 版本: V1.0
-- 日期: 2026-04-01

-- 创建数据库
CREATE DATABASE IF NOT EXISTS lingxu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lingxu;

-- =====================================================
-- 用户表
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY COMMENT '用户ID (UUID)',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    role ENUM('admin', 'developer', 'user') DEFAULT 'user' COMMENT '角色',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =====================================================
-- 会话表
-- =====================================================
CREATE TABLE IF NOT EXISTS conversations (
    id CHAR(36) PRIMARY KEY COMMENT '会话ID (UUID)',
    user_id CHAR(36) NOT NULL COMMENT '用户ID',
    title VARCHAR(255) DEFAULT '新会话' COMMENT '会话标题',
    config JSON COMMENT '会话配置 (技能/智能体选择)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted_at TIMESTAMP NULL COMMENT '软删除时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_user_created (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话表';

-- =====================================================
-- 消息表
-- =====================================================
CREATE TABLE IF NOT EXISTS messages (
    id CHAR(36) PRIMARY KEY COMMENT '消息ID (UUID)',
    conversation_id CHAR(36) NOT NULL COMMENT '会话ID',
    role ENUM('user', 'assistant', 'system') NOT NULL COMMENT '角色',
    content TEXT NOT NULL COMMENT '消息内容',
    metadata JSON COMMENT '附加信息 (技能/智能体/Token消耗)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表';

-- =====================================================
-- 任务表
-- =====================================================
CREATE TABLE IF NOT EXISTS tasks (
    id CHAR(36) PRIMARY KEY COMMENT '任务ID (UUID)',
    user_id CHAR(36) NOT NULL COMMENT '用户ID',
    type VARCHAR(50) NOT NULL COMMENT '任务类型 (chat/skill/agent)',
    status ENUM('pending', 'running', 'completed', 'failed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
    priority INT DEFAULT 0 COMMENT '优先级 (0-3, 3最高)',
    progress INT DEFAULT 0 COMMENT '进度 0-100',
    content JSON NOT NULL COMMENT '任务内容',
    result JSON COMMENT '执行结果',
    error JSON COMMENT '错误信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    started_at TIMESTAMP NULL COMMENT '开始执行时间',
    completed_at TIMESTAMP NULL COMMENT '完成时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at),
    INDEX idx_status_created (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务表';

-- =====================================================
-- 任务日志表
-- =====================================================
CREATE TABLE IF NOT EXISTS task_logs (
    id CHAR(36) PRIMARY KEY COMMENT '日志ID (UUID)',
    task_id CHAR(36) NOT NULL COMMENT '任务ID',
    level ENUM('info', 'warn', 'error') DEFAULT 'info' COMMENT '日志级别',
    message TEXT COMMENT '日志内容',
    step VARCHAR(100) COMMENT '当前执行步骤',
    progress INT COMMENT '当前进度',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    INDEX idx_task_id (task_id),
    INDEX idx_level (level),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务日志表';

-- =====================================================
-- 技能表
-- =====================================================
CREATE TABLE IF NOT EXISTS skills (
    id CHAR(36) PRIMARY KEY COMMENT '技能ID (UUID)',
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '技能名称 (如 /review)',
    category VARCHAR(50) COMMENT '分类',
    command VARCHAR(50) COMMENT '命令 (如 review)',
    definition JSON NOT NULL COMMENT '技能定义',
    enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    version VARCHAR(20) DEFAULT '1.0.0' COMMENT '版本号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='技能表';

-- =====================================================
-- 智能体表
-- =====================================================
CREATE TABLE IF NOT EXISTS agents (
    id CHAR(36) PRIMARY KEY COMMENT '智能体ID (UUID)',
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '智能体名称',
    department VARCHAR(50) COMMENT '部门',
    persona JSON NOT NULL COMMENT '角色设定',
    capabilities JSON COMMENT '能力列表',
    trigger_keywords JSON COMMENT '触发关键词',
    enabled BOOLEAN DEFAULT TRUE COMMENT '是否启用',
    version VARCHAR(20) DEFAULT '1.0.0' COMMENT '版本号',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_name (name),
    INDEX idx_department (department),
    INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='智能体表';

-- =====================================================
-- 用户配置表
-- =====================================================
CREATE TABLE IF NOT EXISTS user_configs (
    id CHAR(36) PRIMARY KEY COMMENT '配置ID (UUID)',
    user_id CHAR(36) NOT NULL COMMENT '用户ID',
    config_name VARCHAR(100) DEFAULT '默认配置' COMMENT '配置名称',
    skills JSON COMMENT '已选技能列表',
    agents JSON COMMENT '已选智能体列表',
    display_mode ENUM('detailed', 'standard', 'minimal', 'off') DEFAULT 'standard' COMMENT '显示模式',
    preferences JSON COMMENT '其他偏好设置',
    is_active BOOLEAN DEFAULT FALSE COMMENT '是否当前激活',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户配置表';

-- =====================================================
-- 向量记忆表 (用于RAG)
-- =====================================================
CREATE TABLE IF NOT EXISTS memory_vectors (
    id CHAR(36) PRIMARY KEY COMMENT '记忆ID (UUID)',
    user_id CHAR(36) NOT NULL COMMENT '用户ID',
    content TEXT NOT NULL COMMENT '记忆内容',
    vector_id VARCHAR(100) COMMENT '向量数据库中的ID',
    dimension INT COMMENT '向量维度',
    model VARCHAR(50) COMMENT '生成向量的模型',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_content (content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='向量记忆表';

-- =====================================================
-- 系统配置表
-- =====================================================
CREATE TABLE IF NOT EXISTS system_configs (
    id CHAR(36) PRIMARY KEY COMMENT '配置ID (UUID)',
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value JSON NOT NULL COMMENT '配置值',
    description VARCHAR(255) COMMENT '配置描述',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- =====================================================
-- 初始管理员账号
-- =====================================================
INSERT INTO users (id, username, email, password_hash, role) VALUES
(UUID(), 'admin', 'admin@lingxu.ai', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin'),
(UUID(), 'demo', 'demo@lingxu.ai', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user');

-- 初始系统配置
INSERT INTO system_configs (id, config_key, config_value, description) VALUES
(UUID(), 'system_version', '"1.0.0"', '系统版本'),
(UUID(), 'max_upload_size', '104857600', '最大上传文件大小 (100MB)'),
(UUID(), 'max_vector_memory', '10000', '单个用户最大向量记忆条数'),
(UUID(), 'task_timeout', '300', '任务默认超时时间 (秒)'),
(UUID(), 'api_rate_limit', '1000', 'API QPS限制');

-- =====================================================
-- gstack 技能初始数据 (23个)
-- =====================================================
INSERT INTO skills (id, name, category, command, definition, enabled, version) VALUES
(UUID(), '/office-hours', '需求规划', 'office-hours', '{"description": "产品规划、需求梳理、方向指导", "input": "产品想法/功能需求/用户痛点", "output": "需求文档/功能列表/技术建议"}', TRUE, '1.0.0'),
(UUID(), '/plan-ceo-review', '需求规划', 'plan-ceo-review', '{"description": "CEO视角产品评审", "input": "产品计划/功能方案", "output": "评审报告/优化建议"}', TRUE, '1.0.0'),
(UUID(), '/plan-eng-review', '需求规划', 'plan-eng-review', '{"description": "技术评审", "input": "技术方案/架构设计", "output": "技术风险评估/改进建议"}', TRUE, '1.0.0'),
(UUID(), '/review', '代码执行', 'review', '{"description": "代码审查、Bug发现、自动修复建议", "input": "代码片段/PR链接/文件路径", "output": "评审报告"}', TRUE, '1.0.0'),
(UUID(), '/qa', '代码执行', 'qa', '{"description": "自动化测试、缺陷修复", "input": "测试目标/代码变更", "output": "测试用例/测试报告"}', TRUE, '1.0.0'),
(UUID(), '/qa-only', '代码执行', 'qa-only', '{"description": "仅测试执行", "input": "测试用例", "output": "测试结果"}', TRUE, '1.0.0'),
(UUID(), '/ship', '部署发布', 'ship', '{"description": "代码发布", "input": "分支/PR", "output": "发布报告"}', TRUE, '1.0.0'),
(UUID(), '/land-and-deploy', '部署发布', 'land-and-deploy', '{"description": "部署到环境", "input": "环境/配置", "output": "部署状态"}', TRUE, '1.0.0'),
(UUID(), '/canary', '部署发布', 'canary', '{"description": "金丝雀发布", "input": "版本/流量比例", "output": "发布状态"}', TRUE, '1.0.0'),
(UUID(), '/cso', '安全审计', 'cso', '{"description": "OWASP Top 10 + STRIDE安全审计", "input": "代码/架构/API设计", "output": "安全报告"}', TRUE, '1.0.0'),
(UUID(), '/browse', '网络请求', 'browse', '{"description": "真实浏览器自动化操作", "input": "URL/操作指令", "output": "页面截图/数据抓取"}', TRUE, '1.0.0'),
(UUID(), '/investigate', '调试分析', 'investigate', '{"description": "问题调查和调试", "input": "问题描述/日志", "output": "分析报告/解决方案"}', TRUE, '1.0.0'),
(UUID(), '/design-consultation', '设计创意', 'design-consultation', '{"description": "设计咨询", "input": "设计问题", "output": "设计方案"}', TRUE, '1.0.0'),
(UUID(), '/design-shotgun', '设计创意', 'design-shotgun', '{"description": "快速设计评审", "input": "设计方案", "output": "评审意见"}', TRUE, '1.0.0'),
(UUID(), '/design-html', '设计创意', 'design-html', '{"description": "HTML实现设计", "input": "设计稿", "output": "HTML代码"}', TRUE, '1.0.0'),
(UUID(), '/document-release', '文档协作', 'document-release', '{"description": "发布文档", "input": "文档内容", "output": "发布状态"}', TRUE, '1.0.0'),
(UUID(), '/benchmark', '性能测试', 'benchmark', '{"description": "性能基准测试", "input": "测试目标", "output": "性能报告"}', TRUE, '1.0.0'),
(UUID(), '/jira', '办公集成', 'jira', '{"description": "Jira集成", "input": "Jira操作", "output": "操作结果"}', TRUE, '1.0.0'),
(UUID(), '/confluence', '办公集成', 'confluence', '{"description": "Confluence集成", "input": "Confluence操作", "output": "操作结果"}', TRUE, '1.0.0'),
(UUID(), '/slack', '办公集成', 'slack', '{"description": "Slack集成", "input": "Slack操作", "output": "操作结果"}', TRUE, '1.0.0'),
(UUID(), '/linear', '办公集成', 'linear', '{"description": "Linear集成", "input": "Linear操作", "output": "操作结果"}', TRUE, '1.0.0'),
(UUID(), '/notion', '办公集成', 'notion', '{"description": "Notion集成", "input": "Notion操作", "output": "操作结果"}', TRUE, '1.0.0'),
(UUID(), '/github', '办公集成', 'github', '{"description": "GitHub集成", "input": "GitHub操作", "output": "操作结果"}', TRUE, '1.0.0');

COMMIT;
