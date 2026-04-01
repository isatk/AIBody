/**
 * Gateway客户端
 * 负责与Go服务层通信
 */

import { v4 as uuidv4 } from 'uuid';

// Gateway配置
interface GatewayConfig {
  url: string;
  timeout: number;
}

// WebSocket消息类型
export type WSMessageType = 'message' | 'ack' | 'progress' | 'error' | 'log' | 'result';

// WebSocket消息
export interface WSMessage {
  type: WSMessageType;
  id?: string;
  content?: any;
  timestamp?: number;
}

// 任务结果
export interface TaskResult {
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  logs?: any[];
}

/**
 * Gateway客户端
 */
export class GatewayClient {
  private config: GatewayConfig;
  private ws?: WebSocket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageHandlers: Map<string, (msg: WSMessage) => void> = new Map();

  constructor(gatewayUrl: string) {
    this.config = {
      url: gatewayUrl,
      timeout: 30000,
    };

    console.log(`✅ Gateway客户端初始化: ${this.config.url}`);
  }

  /**
   * 连接WebSocket
   */
  async connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = this.config.url.replace('http', 'ws') + '/api/v1/ws';
      const url = token ? `${wsUrl}?token=${token}` : wsUrl;

      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('🔌 Gateway WebSocket已连接');
        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws.onclose = () => {
        console.log('🔌 Gateway WebSocket已断开');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('❌ Gateway WebSocket错误:', error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('消息解析失败:', error);
        }
      };
    });
  }

  /**
   * 处理收到的消息
   */
  private handleMessage(message: WSMessage) {
    if (message.id) {
      const handler = this.messageHandlers.get(message.id);
      if (handler) {
        handler(message);
        // 一次性消息处理完后移除
        if (message.type === 'ack' || message.type === 'result') {
          this.messageHandlers.delete(message.id);
        }
      }
    }
  }

  /**
   * 发送消息
   */
  async sendMessage(content: any): Promise<WSMessage> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket未连接');
    }

    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const message: WSMessage = {
        type: 'message',
        id,
        content,
        timestamp: Date.now(),
      };

      // 设置超时
      const timeout = setTimeout(() => {
        this.messageHandlers.delete(id);
        reject(new Error('消息发送超时'));
      }, this.config.timeout);

      // 设置处理器
      this.messageHandlers.set(id, (response) => {
        clearTimeout(timeout);
        resolve(response);
      });

      this.ws!.send(JSON.stringify(message));
    });
  }

  /**
   * 发送聊天消息并获取响应
   */
  async chat(message: string, context?: any): Promise<string> {
    const response = await this.sendMessage({
      type: 'chat',
      message,
      context,
    });

    return response.content?.message || '';
  }

  /**
   * 创建任务
   */
  async createTask(type: string, content: any): Promise<string> {
    const response = await this.sendMessage({
      type: 'task:create',
      taskType: type,
      content,
    });

    return response.content?.taskId || '';
  }

  /**
   * 获取任务状态
   */
  async getTaskStatus(taskId: string): Promise<TaskResult | null> {
    const response = await this.sendMessage({
      type: 'task:status',
      taskId,
    });

    return response.content;
  }

  /**
   * 订阅任务进度
   */
  subscribeTaskProgress(taskId: string, callback: (progress: number) => void) {
    const handler = (msg: WSMessage) => {
      if (msg.type === 'progress' && msg.content?.taskId === taskId) {
        callback(msg.content.progress);
      }
    };

    // 存储处理器用于清理
    this.messageHandlers.set(`progress:${taskId}`, handler);
  }

  /**
   * 尝试重连
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ 达到最大重连次数，停止重连');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(`🔄 ${delay/1000}秒后尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch(() => {});
    }, delay);
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = undefined;
    }
    this.messageHandlers.clear();
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.ws !== undefined && this.ws.readyState === WebSocket.OPEN;
  }
}
