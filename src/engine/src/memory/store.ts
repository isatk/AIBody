/**
 * 记忆存储模块
 * 支持短期记忆、长期记忆、向量记忆
 */

import { v4 as uuidv4 } from 'uuid';

// 记忆类型
export type MemoryType = 'short_term' | 'long_term' | 'vector' | 'knowledge';

// 记忆结构
export interface Memory {
  id: string;
  userId: string;
  content: string;
  type: MemoryType;
  vectorId?: string; // 向量数据库中的ID
  dimension?: number;
  model?: string; // 生成向量的模型
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

// 记忆检索结果
export interface MemorySearchResult {
  id: string;
  content: string;
  type: MemoryType;
  score: number; // 相似度分数
  createdAt: number;
}

// 检索选项
export interface SearchOptions {
  query: string;
  userId?: string;
  limit?: number;
  threshold?: number;
  type?: MemoryType;
}

// 向量配置
const VECTOR_CONFIG = {
  dimension: 1536, // OpenAI text-embedding-3
  algorithm: 'cosine', // 余弦相似度
  topK: 5,
  threshold: 0.75,
};

/**
 * 记忆存储管理器
 */
export class MemoryStore {
  private memories: Map<string, Memory> = new Map();
  private userMemories: Map<string, Set<string>> = new Map();

  constructor() {
    console.log('✅ Memory存储初始化完成');
  }

  /**
   * 存储记忆
   */
  async store(memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = uuidv4();
    const now = Date.now();

    const newMemory: Memory = {
      ...memory,
      id,
      createdAt: now,
      updatedAt: now,
    };

    // 存储到内存
    this.memories.set(id, newMemory);

    // 建立用户索引
    if (memory.userId) {
      if (!this.userMemories.has(memory.userId)) {
        this.userMemories.set(memory.userId, new Set());
      }
      this.userMemories.get(memory.userId)!.add(id);
    }

    // 如果是向量记忆，生成向量ID
    if (memory.type === 'vector') {
      // 实际应该调用向量数据库
      newMemory.vectorId = `vec_${id}`;
      newMemory.dimension = VECTOR_CONFIG.dimension;
    }

    console.log(`📝 记忆存储: ${id} (${memory.type})`);
    return id;
  }

  /**
   * 获取记忆
   */
  async get(id: string): Promise<Memory | undefined> {
    return this.memories.get(id);
  }

  /**
   * 获取用户的所有记忆
   */
  async getUserMemories(userId: string): Promise<Memory[]> {
    const memoryIds = this.userMemories.get(userId);
    if (!memoryIds) return [];

    const memories: Memory[] = [];
    for (const id of memoryIds) {
      const memory = this.memories.get(id);
      if (memory) {
        memories.push(memory);
      }
    }

    return memories.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * 检索记忆 (基于向量相似度)
   */
  async search(options: SearchOptions): Promise<MemorySearchResult[]> {
    const { query, userId, limit = 10, threshold = VECTOR_CONFIG.threshold, type: filterType } = options;

    // 模拟向量搜索
    // 实际应该使用sqlite-vec或Chroma等向量数据库
    const results: MemorySearchResult[] = [];

    for (const memory of this.memories.values()) {
      // 用户过滤
      if (userId && memory.userId !== userId) continue;

      // 类型过滤
      if (filterType && memory.type !== filterType) continue;

      // 模拟相似度计算 (实际应该用向量点积)
      const score = this.calculateSimilarity(query, memory.content);

      if (score >= threshold) {
        results.push({
          id: memory.id,
          content: memory.content,
          type: memory.type,
          score,
          createdAt: memory.createdAt,
        });
      }
    }

    // 按相似度排序
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit);
  }

  /**
   * 更新记忆
   */
  async update(id: string, content: string): Promise<boolean> {
    const memory = this.memories.get(id);
    if (!memory) return false;

    memory.content = content;
    memory.updatedAt = Date.now();

    return true;
  }

  /**
   * 删除记忆
   */
  async delete(id: string): Promise<boolean> {
    const memory = this.memories.get(id);
    if (!memory) return false;

    // 从用户索引中移除
    if (memory.userId) {
      const userMemorySet = this.userMemories.get(memory.userId);
      if (userMemorySet) {
        userMemorySet.delete(id);
      }
    }

    // 从存储中删除
    this.memories.delete(id);

    return true;
  }

  /**
   * 清理过期记忆
   */
  async cleanup(maxAge: number = 90 * 24 * 60 * 60 * 1000): Promise<number> {
    const now = Date.now();
    let cleaned = 0;

    for (const [id, memory] of this.memories.entries()) {
      // 短期记忆90天后清理
      if (memory.type === 'short_term' && now - memory.createdAt > maxAge) {
        await this.delete(id);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 清理了 ${cleaned} 条过期记忆`);
    }

    return cleaned;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    total: number;
    byType: Record<MemoryType, number>;
    byUser: Record<string, number>;
  } {
    const stats = {
      total: this.memories.size,
      byType: {
        short_term: 0,
        long_term: 0,
        vector: 0,
        knowledge: 0,
      } as Record<MemoryType, number>,
      byUser: {} as Record<string, number>,
    };

    for (const memory of this.memories.values()) {
      stats.byType[memory.type]++;

      if (memory.userId) {
        stats.byUser[memory.userId] = (stats.byUser[memory.userId] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * 计算相似度 (简化版)
   * 实际应该使用向量嵌入计算
   */
  private calculateSimilarity(query: string, content: string): number {
    // 简单的词重叠计算
    const queryWords = new Set(query.toLowerCase().split(/\s+/));
    const contentWords = new Set(content.toLowerCase().split(/\s+/));

    let intersection = 0;
    for (const word of queryWords) {
      if (contentWords.has(word)) {
        intersection++;
      }
    }

    // 返回Jaccard相似度
    const union = new Set([...queryWords, ...contentWords]);
    return intersection / union.size;
  }
}
