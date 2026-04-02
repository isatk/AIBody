/**
 * 创始人认证模块
 * 
 * 灵枢 (AIBody)
 * Copyright © 2026. All rights reserved.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { FaceDatabase } from './face-database';
import { 
  FounderIdentity, 
  VerificationResult, 
  UpdateResult,
  FounderConfig 
} from './types';

export class FounderAuth {
  private identity: FounderIdentity | null = null;
  private database: FaceDatabase;
  private config: FounderConfig;
  private identityPath: string;
  
  constructor(
    config: Partial<FounderConfig> = {},
    dataDir: string = './data/founder'
  ) {
    this.config = {
      capacity: config.capacity ?? 20,
      minRequired: config.minRequired ?? 10,
      updateIntervalMonths: config.updateIntervalMonths ?? 6,
      verificationTimeout: config.verificationTimeout ?? 60
    };
    
    this.database = new FaceDatabase(
      this.config.capacity,
      this.config.minRequired,
      dataDir
    );
    
    this.identityPath = path.join(dataDir, 'identity.json');
  }
  
  // 初始化创始人身份
  async initialize(telegramId: string, photos: string[]): Promise<boolean> {
    try {
      // 添加人脸到数据库
      const added = await this.database.addFaces(photos);
      
      if (added < this.config.minRequired) {
        throw new Error(`Not enough valid faces. Added: ${added}, Required: ${this.config.minRequired}`);
      }
      
      // 创建身份
      this.identity = {
        founderId: this.generateFounderId(),
        telegramId,
        faceDatabase: this.database.getStatus(),
        validUntil: this.calculateValidUntil(),
        lastUpdate: new Date()
      };
      
      await this.saveIdentity();
      return true;
    } catch (error) {
      console.error('Failed to initialize founder auth:', error);
      return false;
    }
  }
  
  // 验证是否是创始人
  async verifyFounder(photo: string): Promise<VerificationResult> {
    // 检查数据库是否初始化
    const status = this.database.getStatus();
    if (!status.isInitialized) {
      return {
        success: false,
        confidence: 0,
        matchedId: null,
        error: 'Founder identity not initialized'
      };
    }
    
    // 验证人脸
    const result = await this.database.verify(photo);
    
    if (result.success) {
      console.log(`Founder verified with confidence: ${result.confidence}`);
    }
    
    return result;
  }
  
  // 批量验证（提高准确率）
  async verifyFounderBatch(photos: string[]): Promise<VerificationResult> {
    if (photos.length === 0) {
      return {
        success: false,
        confidence: 0,
        matchedId: null,
        error: 'No photos provided'
      };
    }
    
    let successCount = 0;
    let totalConfidence = 0;
    let lastResult: VerificationResult | null = null;
    
    for (const photo of photos) {
      const result = await this.verifyFounder(photo);
      if (result.success) {
        successCount++;
        totalConfidence += result.confidence;
      }
      lastResult = result;
    }
    
    // 超过50%照片通过则认为验证成功
    const passRate = successCount / photos.length;
    const avgConfidence = successCount > 0 ? totalConfidence / successCount : 0;
    
    if (passRate >= 0.5 && avgConfidence >= 0.6) {
      return {
        success: true,
        confidence: avgConfidence,
        matchedId: lastResult?.matchedId || null,
        error: null
      };
    }
    
    return lastResult || {
      success: false,
      confidence: 0,
      matchedId: null,
      error: 'Verification failed'
    };
  }
  
  // 检查是否需要更新
  async needsUpdate(): Promise<boolean> {
    return this.database.needsUpdate();
  }
  
  // 获取下次更新日期
  getNextUpdateDate(): Date | null {
    return this.database.getNextUpdateDate();
  }
  
  // 更新人脸数据库
  async updateDatabase(photos: string[]): Promise<UpdateResult> {
    try {
      const currentCount = this.database.getStatus().currentCount;
      
      // 清空旧数据（保留最近的2张作为过渡）
      const existingFaces: string[] = [];
      
      // 添加新照片
      const added = await this.database.addFaces(photos);
      
      // 重新加载状态
      const newCount = this.database.getStatus().currentCount;
      
      if (this.identity) {
        this.identity.lastUpdate = new Date();
        this.identity.faceDatabase = this.database.getStatus();
        await this.saveIdentity();
      }
      
      return {
        success: true,
        added,
        removed: currentCount,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        added: 0,
        removed: 0,
        error: `Update failed: ${error}`
      };
    }
  }
  
  // 获取身份状态
  getIdentity(): FounderIdentity | null {
    return this.identity;
  }
  
  // 获取数据库状态
  getDatabaseStatus() {
    return this.database.getStatus();
  }
  
  // 检查是否已初始化
  isInitialized(): boolean {
    return this.identity !== null && this.database.getStatus().isInitialized;
  }
  
  // 加载已保存的身份
  async load(): Promise<boolean> {
    try {
      if (fs.existsSync(this.identityPath)) {
        const data = JSON.parse(fs.readFileSync(this.identityPath, 'utf-8'));
        this.identity = {
          ...data,
          validUntil: new Date(data.validUntil),
          lastUpdate: data.lastUpdate ? new Date(data.lastUpdate) : null
        };
        
        await this.database.load();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load identity:', error);
      return false;
    }
  }
  
  // 保存身份
  private async saveIdentity(): Promise<void> {
    const dir = path.dirname(this.identityPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(this.identityPath, JSON.stringify(this.identity, null, 2));
  }
  
  // 生成创始人ID
  private generateFounderId(): string {
    return `founder_${crypto.randomUUID()}`;
  }
  
  // 计算有效期
  private calculateValidUntil(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + this.config.updateIntervalMonths);
    return date;
  }
  
  // 验证Telegram ID
  isFounderTelegramId(telegramId: string): boolean {
    return this.identity?.telegramId === telegramId;
  }
  
  // 重置身份（危险操作）
  async reset(): Promise<void> {
    this.identity = null;
    await this.database.clear();
    
    if (fs.existsSync(this.identityPath)) {
      fs.unlinkSync(this.identityPath);
    }
  }
}

export default FounderAuth;
