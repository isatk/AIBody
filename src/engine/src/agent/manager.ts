/**
 * Agent管理器
 * 负责Agent的创建、调度、执行
 */

import { v4 as uuidv4 } from 'uuid';

// Agent状态
export type AgentStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';

// Agent定义
export interface Agent {
  id: string;
  name: string;
  department: string;
  persona: string;
  capabilities: string[];
  triggerKeywords: string[];
  enabled: boolean;
}

// 任务上下文
export interface TaskContext {
  taskId: string;
  userId: string;
  type: string;
  content: any;
  skills: string[];
  agents: string[];
  timestamp: number;
}

// 任务状态
export interface TaskStatus {
  taskId: string;
  status: AgentStatus;
  progress: number;
  result?: any;
  error?: string;
  logs: TaskLog[];
}

// 任务日志
export interface TaskLog {
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  message: string;
  step?: string;
}

/**
 * Agent管理器
 */
export class AgentManager {
  private agents: Map<string, Agent> = new Map();
  private taskStatuses: Map<string, TaskStatus> = new Map();

  constructor() {
    this.initializeDefaultAgents();
  }

  /**
   * 初始化默认智能体
   */
  private initializeDefaultAgents() {
    // 工程部门
    this.registerAgent({
      id: 'agent-frontend',
      name: '前端开发者',
      department: 'engineering',
      persona: '现代Web开发专家，擅长React/Vue实现',
      capabilities: ['React', 'Vue', 'CSS', 'TypeScript', 'UI组件开发'],
      triggerKeywords: ['前端', 'React', 'Vue', '组件', '页面'],
      enabled: true,
    });

    this.registerAgent({
      id: 'agent-backend',
      name: '后端架构师',
      department: 'engineering',
      persona: '服务端系统专家，精通API设计和数据库架构',
      capabilities: ['API设计', '数据库架构', '微服务', '性能优化'],
      triggerKeywords: ['后端', 'API', '数据库', '服务端'],
      enabled: true,
    });

    this.registerAgent({
      id: 'agent-devops',
      name: 'DevOps自动化',
      department: 'engineering',
      persona: '自动化工程师，精通CI/CD和容器化部署',
      capabilities: ['CI/CD', 'Docker', 'K8s', '基础设施即代码'],
      triggerKeywords: ['CI/CD', '部署', 'Docker', 'K8s'],
      enabled: true,
    });

    this.registerAgent({
      id: 'agent-ai-engineer',
      name: 'AI工程师',
      department: 'engineering',
      persona: '机器学习专家，精通模型选型和MLPipeline',
      capabilities: ['模型选型', 'MLPipeline', 'AI集成', '性能优化'],
      triggerKeywords: ['AI', '机器学习', '模型', '训练'],
      enabled: true,
    });

    // 产品部门
    this.registerAgent({
      id: 'agent-product-manager',
      name: '产品经理',
      department: 'product',
      persona: '产品全生命周期专家，精通PRD和需求管理',
      capabilities: ['PRD撰写', '需求管理', '产品规划', '用户研究'],
      triggerKeywords: ['产品', 'PRD', '需求', '用户故事'],
      enabled: true,
    });

    // 营销部门
    this.registerAgent({
      id: 'agent-xiaohongshu',
      name: '小红书运营',
      department: 'marketing',
      persona: '小红书种草笔记专家，精通内容创作和账号运营',
      capabilities: ['种草笔记', '达人合作', '爆款内容策划', '账号运营'],
      triggerKeywords: ['小红书', '种草', '笔记', '博主'],
      enabled: true,
    });

    this.registerAgent({
      id: 'agent-douyin',
      name: '抖音策略师',
      department: 'marketing',
      persona: '抖音短视频和直播电商专家',
      capabilities: ['短视频策划', '直播带货', '内容运营', '数据运营'],
      triggerKeywords: ['抖音', '短视频', '直播', '带货'],
      enabled: true,
    });

    // 数据部门
    this.registerAgent({
      id: 'agent-data-analyst',
      name: '数据分析师',
      department: 'data',
      persona: '数据洞察专家，精通数据分析和可视化',
      capabilities: ['数据分析', '仪表盘设计', 'KPI追踪', '趋势预测'],
      triggerKeywords: ['数据', '分析', '报表', '统计'],
      enabled: true,
    });

    console.log(`✅ Agent管理器初始化完成: ${this.agents.size} 个智能体`);
  }

  /**
   * 注册智能体
   */
  registerAgent(agent: Agent) {
    this.agents.set(agent.id, agent);
  }

  /**
   * 获取智能体
   */
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * 列出所有智能体
   */
  listAgents(): Agent[] {
    return Array.from(this.agents.values()).filter((a) => a.enabled);
  }

  /**
   * 根据触发词匹配智能体
   */
  matchAgents(keywords: string[]): Agent[] {
    const matched: Agent[] = [];

    for (const agent of this.agents.values()) {
      if (!agent.enabled) continue;

      for (const keyword of keywords) {
        if (agent.triggerKeywords.some((tk) => tk.includes(keyword))) {
          matched.push(agent);
          break;
        }
      }
    }

    return matched;
  }

  /**
   * 处理任务
   */
  async processTask(context: TaskContext): Promise<any> {
    const { taskId, type, content, skills, agents: agentIds } = context;

    // 初始化任务状态
    this.taskStatuses.set(taskId, {
      taskId,
      status: 'running',
      progress: 0,
      logs: [],
    });

    this.addLog(taskId, 'info', `任务开始: ${taskId}`);

    try {
      // 根据任务类型选择处理策略
      switch (type) {
        case 'chat':
          return await this.handleChatTask(context);

        case 'code':
          return await this.handleCodeTask(context);

        case 'skill':
          return await this.handleSkillTask(context);

        case 'analysis':
          return await this.handleAnalysisTask(context);

        default:
          return await this.handleDefaultTask(context);
      }
    } catch (error: any) {
      this.updateStatus(taskId, 'failed', 100, undefined, error.message);
      throw error;
    }
  }

  /**
   * 处理聊天任务
   */
  private async handleChatTask(context: TaskContext): Promise<any> {
    const { taskId, content } = context;

    this.addLog(taskId, 'info', '处理聊天任务');
    this.updateProgress(taskId, 30);

    // 模拟AI响应
    const response = {
      message: `这是一个模拟的AI响应。您的问题是: ${content.message || content}`,
      timestamp: Date.now(),
    };

    this.updateProgress(taskId, 100);
    this.updateStatus(taskId, 'completed', 100, response);

    return response;
  }

  /**
   * 处理代码任务
   */
  private async handleCodeTask(context: TaskContext): Promise<any> {
    const { taskId, content } = context;

    this.addLog(taskId, 'info', '处理代码任务');
    this.updateProgress(taskId, 20);

    // 匹配相关Agent
    const matchedAgents = this.matchAgents([content.language || '', content.action || '']);

    this.addLog(taskId, 'info', `匹配到 ${matchedAgents.length} 个Agent`);
    this.updateProgress(taskId, 50);

    // 模拟代码生成
    const result = {
      code: `// 模拟生成的代码\nconsole.log("Hello, Lingxu!");`,
      language: content.language || 'javascript',
      explanation: '这是基于您要求的代码实现',
    };

    this.updateProgress(taskId, 100);
    this.updateStatus(taskId, 'completed', 100, result);

    return result;
  }

  /**
   * 处理技能任务
   */
  private async handleSkillTask(context: TaskContext): Promise<any> {
    const { taskId, content, skills } = context;

    this.addLog(taskId, 'info', `执行技能: ${skills.join(', ')}`);
    this.updateProgress(taskId, 50);

    const result = {
      skillsExecuted: skills,
      output: '技能执行完成',
    };

    this.updateProgress(taskId, 100);
    this.updateStatus(taskId, 'completed', 100, result);

    return result;
  }

  /**
   * 处理分析任务
   */
  private async handleAnalysisTask(context: TaskContext): Promise<any> {
    const { taskId, content } = context;

    this.addLog(taskId, 'info', '处理分析任务');
    this.updateProgress(taskId, 30);

    // 匹配分析相关Agent
    const matchedAgents = this.matchAgents(['分析', '数据', '报表']);

    this.updateProgress(taskId, 70);

    const result = {
      analysis: '分析结果',
      insights: ['洞察1', '洞察2'],
      recommendations: ['建议1', '建议2'],
    };

    this.updateProgress(taskId, 100);
    this.updateStatus(taskId, 'completed', 100, result);

    return result;
  }

  /**
   * 处理默认任务
   */
  private async handleDefaultTask(context: TaskContext): Promise<any> {
    const { taskId, content } = context;

    this.addLog(taskId, 'info', '处理通用任务');
    this.updateProgress(taskId, 50);

    const result = {
      message: '任务处理完成',
      content,
    };

    this.updateProgress(taskId, 100);
    this.updateStatus(taskId, 'completed', 100, result);

    return result;
  }

  /**
   * 获取任务状态
   */
  getTaskStatus(taskId: string): TaskStatus | undefined {
    return this.taskStatuses.get(taskId);
  }

  /**
   * 更新任务状态
   */
  private updateStatus(
    taskId: string,
    status: AgentStatus,
    progress: number,
    result?: any,
    error?: string
  ) {
    const taskStatus = this.taskStatuses.get(taskId);
    if (taskStatus) {
      taskStatus.status = status;
      taskStatus.progress = progress;
      if (result) taskStatus.result = result;
      if (error) taskStatus.error = error;
    }
  }

  /**
   * 更新进度
   */
  private updateProgress(taskId: string, progress: number) {
    this.updateStatus(taskId, 'running', progress);
  }

  /**
   * 添加日志
   */
  private addLog(taskId: string, level: TaskLog['level'], message: string, step?: string) {
    const taskStatus = this.taskStatuses.get(taskId);
    if (taskStatus) {
      taskStatus.logs.push({
        timestamp: Date.now(),
        level,
        message,
        step,
      });
    }
  }

  /**
   * 取消任务
   */
  cancelTask(taskId: string): boolean {
    const taskStatus = this.taskStatuses.get(taskId);
    if (taskStatus && taskStatus.status === 'running') {
      this.updateStatus(taskId, 'failed', taskStatus.progress, undefined, '任务被取消');
      return true;
    }
    return false;
  }
}
