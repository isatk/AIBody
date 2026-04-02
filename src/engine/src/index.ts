/**
 * 灵枢引擎 - 入口文件
 * 基于openclaw构建的AI执行引擎
 * 
 * ⚠️ 核心安全机制：创始人身份验证
 *    - 已集成 founder-core.ts
 *    - 不可删除/不可修改/不可禁用
 * 
 * 灵枢 (AIBody)
 * Copyright © 2026 Lotus Rina. All rights reserved.
 */

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { v4 as uuidv4 } from 'uuid';

// 导入核心安全模块（不可删除）
import * as FounderCore from './core/founder-core.js';

// 导入子模块
import { AgentManager } from './agent/manager.js';
import { MemoryStore } from './memory/store.js';
import { SkillsLoader } from './skills/loader.js';
import { GatewayClient } from './gateway/client.js';

// 配置
const CONFIG = {
  port: parseInt(process.env.PORT || '3000'),
  logLevel: process.env.LOG_LEVEL || 'info',
};

// ============================================================
// 核心验证中间件（不可删除/不可修改）
// ============================================================

/** 需要验证的受保护路径 */
const PROTECTED_PATHS = [
  '/api/v1/tasks',
  '/api/v1/agents',
  '/api/v1/memory',
  '/api/v1/skills/execute',
  '/api/v1/config',
  '/api/v1/system'
];

/**
 * 创始人验证中间件
 * 所有敏感操作都需要通过此中间件
 */
function founderVerificationMiddleware() {
  return async (c: any, next: () => Promise<void>) => {
    const path = c.req.path;
    const method = c.req.method;
    
    // 检查是否需要验证
    const requiresVerification = PROTECTED_PATHS.some(p => path.startsWith(p));
    
    if (requiresVerification && method !== 'GET') {
      const userId = c.req.header('X-User-ID') || c.req.query('user_id');
      
      if (!userId) {
        return c.json({ 
          error: 'USER_ID_REQUIRED',
          message: 'User ID is required for this operation'
        }, 401);
      }
      
      // 使用核心验证模块检查
      if (!FounderCore.isUserVerified(userId)) {
        return c.json({
          error: 'VERIFICATION_REQUIRED',
          message: 'Founder verification required. Use POST /api/v1/founder/verify first.',
          userId,
          endpoint: '/api/v1/founder/verify'
        }, 403);
      }
    }
    
    await next();
  };
}

// ============================================================
// 应用设置
// ============================================================

// 创建Hono应用
const app = new Hono();

// 中间件
app.use('*', cors());
app.use('*', logger());

// 应用验证中间件
app.use('*', founderVerificationMiddleware());

// ============================================================
// 创始人验证API（核心API，不可删除）
// ============================================================

/**
 * 请求创始人验证
 * POST /api/v1/founder/verify
 */
app.post('/api/v1/founder/verify', async (c) => {
  const body = await c.req.json();
  const { user_id, photo } = body;
  
  if (!user_id || !photo) {
    return c.json({
      error: 'INVALID_REQUEST',
      message: 'user_id and photo are required'
    }, 400);
  }
  
  // 使用核心验证模块
  const result = FounderCore.verifyFounder(photo);
  
  if (result.success) {
    FounderCore.markUserVerified(user_id);
    
    return c.json({
      success: true,
      message: 'Founder verification successful',
      verified: true,
      founderId: result.founderId,
      expiresIn: 300,
      timestamp: new Date().toISOString()
    });
  }
  
  return c.json({
    success: false,
    message: 'Verification failed. You are not the founder.',
    verified: false
  }, 403);
});

/**
 * 检查验证状态
 * GET /api/v1/founder/status
 */
app.get('/api/v1/founder/status', async (c) => {
  const userId = c.req.query('user_id') || c.req.header('X-User-ID');
  
  if (!userId) {
    return c.json({
      error: 'USER_ID_REQUIRED',
      message: 'user_id is required'
    }, 400);
  }
  
  const status = FounderCore.getVerificationStatus(userId);
  
  return c.json({
    userId,
    ...status,
    coreVersion: FounderCore.FOUNDER_CORE_VERSION
  });
});

/**
 * 清除验证（登出）
 * POST /api/v1/founder/logout
 */
app.post('/api/v1/founder/logout', async (c) => {
  const body = await c.req.json();
  const { user_id } = body;
  
  if (!user_id) {
    return c.json({
      error: 'USER_ID_REQUIRED',
      message: 'user_id is required'
    }, 400);
  }
  
  FounderCore.clearUserVerification(user_id);
  
  return c.json({
    success: true,
    message: 'Verification cleared'
  });
});

/**
 * 获取系统安全状态
 * GET /api/v1/founder/security-status
 */
app.get('/api/v1/founder/security-status', async (c) => {
  const stats = FounderCore.getAuditStats();
  
  return c.json({
    securityEnabled: true,
    verificationRequired: true,
    verificationDuration: 300,
    coreVersion: FounderCore.FOUNDER_CORE_VERSION,
    coreBuild: FounderCore.FOUNDER_CORE_BUILD,
    protectedEndpoints: PROTECTED_PATHS,
    cacheSize: FounderCore.getCacheSize(),
    verifiedUsers: FounderCore.getVerifiedUsers(),
    auditStats: stats,
    timestamp: new Date().toISOString()
  });
});

/**
 * 获取审计日志
 * GET /api/v1/founder/audit
 */
app.get('/api/v1/founder/audit', async (c) => {
  const limit = parseInt(c.req.query('limit') || '100');
  const logs = FounderCore.getAuditLogs(limit);
  
  return c.json({
    logs,
    total: logs.length
  });
});

// ============================================================
// 健康检查
// ============================================================

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime(),
    founderSecurity: {
      enabled: true,
      protected: true,
      coreVersion: FounderCore.FOUNDER_CORE_VERSION,
      verifiedCount: FounderCore.getCacheSize()
    }
  });
});

// ============================================================
// 任务处理API（受保护）
// ============================================================

// 创建任务
app.post('/api/v1/tasks', async (c) => {
  const body = await c.req.json();
  const { type, content, user_id, skills, agents } = body;

  const taskId = uuidv4();

  // 构建任务上下文
  const context = {
    taskId,
    userId: user_id,
    type,
    content,
    skills: skills || [],
    agents: agents || [],
    timestamp: Date.now(),
  };

  // 触发Agent处理
  const result = await agentManager.processTask(context);

  return c.json({
    id: taskId,
    status: 'completed',
    result,
  });
});

// 获取任务状态
app.get('/api/v1/tasks/:id', async (c) => {
  const taskId = c.req.param('id');
  const status = await agentManager.getTaskStatus(taskId);

  if (!status) {
    return c.json({ error: 'Task not found' }, 404);
  }

  return c.json(status);
});

// 取消任务
app.delete('/api/v1/tasks/:id', async (c) => {
  const taskId = c.req.param('id');
  await agentManager.cancelTask(taskId);

  return c.json({ message: 'Task cancelled' });
});

// ============================================================
// 技能API
// ============================================================

// 列出所有技能
app.get('/api/v1/skills', async (c) => {
  const skills = await skillsLoader.listSkills();
  return c.json(skills);
});

// 执行技能
app.post('/api/v1/skills/:name/execute', async (c) => {
  const skillName = c.req.param('name');
  const body = await c.req.json();

  const result = await skillsLoader.executeSkill(skillName, body);

  return c.json(result);
});

// ============================================================
// 智能体API（受保护）
// ============================================================

// 列出所有智能体
app.get('/api/v1/agents', async (c) => {
  const agents = await agentManager.listAgents();
  return c.json(agents);
});

// 获取智能体
app.get('/api/v1/agents/:id', async (c) => {
  const agentId = c.req.param('id');
  const agent = await agentManager.getAgent(agentId);

  if (!agent) {
    return c.json({ error: 'Agent not found' }, 404);
  }

  return c.json(agent);
});

// ============================================================
// 记忆API（受保护）
// ============================================================

// 存储记忆
app.post('/api/v1/memory', async (c) => {
  const body = await c.req.json();
  const { user_id, content, type: memoryType } = body;

  const id = await memoryStore.store({
    userId: user_id,
    content,
    type: memoryType || 'short_term',
    timestamp: Date.now(),
  });

  return c.json({ id });
});

// 检索记忆
app.get('/api/v1/memory/search', async (c) => {
  const query = c.req.query('q');
  const userId = c.req.query('user_id');
  const limit = parseInt(c.req.query('limit') || '10');

  const results = await memoryStore.search({
    query,
    userId,
    limit,
  });

  return c.json(results);
});

// 获取用户记忆历史
app.get('/api/v1/memory/:user_id', async (c) => {
  const userId = c.req.param('user_id');
  const memories = await memoryStore.getUserMemories(userId);

  return c.json(memories);
});

// ============================================================
// 子模块初始化
// ============================================================

// Agent管理
const agentManager = new AgentManager();

// Memory存储
const memoryStore = new MemoryStore();

// Skills加载器
const skillsLoader = new SkillsLoader();

// Gateway客户端 (连接Go服务层)
const gatewayClient = new GatewayClient(process.env.GATEWAY_URL || 'http://localhost:8080');

// ============================================================
// 启动服务器
// ============================================================

console.log(`🚀 灵枢引擎启动中...`);
console.log(`   端口: ${CONFIG.port}`);
console.log(`   日志级别: ${CONFIG.logLevel}`);
console.log(`🔐 创始人安全机制: 已启用`);
console.log(`   核心模块: founder-core.ts`);
console.log(`   核心版本: ${FounderCore.FOUNDER_CORE_VERSION}`);
console.log(`   保护端点: ${PROTECTED_PATHS.length} 个`);

serve({
  fetch: app.fetch,
  port: CONFIG.port,
});

console.log(`✅ 灵枢引擎已启动: http://localhost:${CONFIG.port}`);
console.log(`🔒 核心验证模块已加载（不可删除/不可修改）`);
