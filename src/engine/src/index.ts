/**
 * 灵枢引擎 - 入口文件
 * 基于openclaw构建的AI执行引擎
 */

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { v4 as uuidv4 } from 'uuid';

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

// 创建Hono应用
const app = new Hono();

// 中间件
app.use('*', cors());
app.use('*', logger());

// 健康检查
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// Agent管理
const agentManager = new AgentManager();

// Memory存储
const memoryStore = new MemoryStore();

// Skills加载器
const skillsLoader = new SkillsLoader();

// Gateway客户端 (连接Go服务层)
const gatewayClient = new GatewayClient(process.env.GATEWAY_URL || 'http://localhost:8080');

// ============================================================
// 任务处理API
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
// 智能体API
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
// 记忆API
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
// WebSocket支持 (预留)
// ============================================================

// 启动服务器
console.log(`🚀 灵枢引擎启动中...`);
console.log(`   端口: ${CONFIG.port}`);
console.log(`   日志级别: ${CONFIG.logLevel}`);

serve({
  fetch: app.fetch,
  port: CONFIG.port,
});

console.log(`✅ 灵枢引擎已启动: http://localhost:${CONFIG.port}`);
