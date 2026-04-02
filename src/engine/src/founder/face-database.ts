/**
 * 人脸数据库 - 管理创始人人脸数据
 * 
 * 灵枢 (AIBody)
 * Copyright © 2026. All rights reserved.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { FaceRecord, FaceDatabaseStatus, VerificationResult } from './types';

// 简化的特征向量生成（实际应用中应使用 face-api.js）
function extractFeatures(photoPath: string): number[] {
  // 读取图片并生成伪特征向量
  // 实际应用中应使用 face-api.js 的 face-recognition 模型
  const buffer = fs.readFileSync(photoPath);
  const hash = crypto.createHash('sha256').update(buffer).digest();
  
  // 将哈希转换为128维特征向量（简化版）
  const features: number[] = [];
  for (let i = 0; i < 128; i++) {
    features.push(hash[i % hash.length] / 255);
  }
  return features;
}

// 计算余弦相似度
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export class FaceDatabase {
  private records: FaceRecord[] = [];
  private readonly capacity: number;
  private readonly minRequired: number;
  private readonly dataDir: string;
  
  constructor(
    capacity: number = 20,
    minRequired: number = 10,
    dataDir: string = './data/founder'
  ) {
    this.capacity = capacity;
    this.minRequired = minRequired;
    this.dataDir = dataDir;
    this.ensureDataDir();
  }
  
  private ensureDataDir(): void {
    const photosDir = path.join(this.dataDir, 'photos');
    const featuresDir = path.join(this.dataDir, 'features');
    const backupDir = path.join(this.dataDir, 'backup');
    
    [photosDir, featuresDir, backupDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }
  
  private generateId(): string {
    return crypto.randomUUID();
  }
  
  private hashPhoto(photoBuffer: Buffer): string {
    return crypto.createHash('sha256').update(photoBuffer).digest('hex');
  }
  
  private getFeaturesPath(): string {
    return path.join(this.dataDir, 'features', 'faces.json');
  }
  
  // 从Base64添加人脸
  async addFaceFromBase64(base64Data: string): Promise<string> {
    // 移除 data URL 前缀
    const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    
    return this.addFaceFromBuffer(buffer);
  }
  
  // 从文件添加人脸
  async addFaceFromFile(filePath: string): Promise<string> {
    const buffer = fs.readFileSync(filePath);
    return this.addFaceFromBuffer(buffer);
  }
  
  // 从Buffer添加人脸
  private async addFaceFromBuffer(buffer: Buffer): Promise<string> {
    const id = this.generateId();
    const hash = this.hashPhoto(buffer);
    const features = extractFeaturesFromBuffer(buffer);
    
    const record: FaceRecord = {
      id,
      hash,
      features,
      createdAt: new Date()
    };
    
    this.records.push(record);
    
    // 如果超过容量，移除最旧的
    if (this.records.length > this.capacity) {
      this.records.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      this.records.shift();
    }
    
    await this.save();
    return id;
  }
  
  // 添加多个人脸
  async addFaces(photos: string[]): Promise<number> {
    let added = 0;
    for (const photo of photos) {
      try {
        await this.addFaceFromBase64(photo);
        added++;
      } catch (error) {
        console.error(`Failed to add face: ${error}`);
      }
    }
    return added;
  }
  
  // 移除最旧的人脸
  async removeOldest(): Promise<string | null> {
    if (this.records.length === 0) return null;
    
    this.records.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const removed = this.records.shift();
    
    if (removed) {
      await this.save();
      return removed.id;
    }
    return null;
  }
  
  // 验证人脸
  async verify(photoData: string): Promise<VerificationResult> {
    if (this.records.length < this.minRequired) {
      return {
        success: false,
        confidence: 0,
        matchedId: null,
        error: `Database not initialized. Need at least ${this.minRequired} faces.`
      };
    }
    
    try {
      // 提取待验证照片的特征
      const base64 = photoData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');
      const features = extractFeaturesFromBuffer(buffer);
      
      // 与数据库中的所有人脸比对
      let bestMatch: { id: string; similarity: number } | null = null;
      
      for (const record of this.records) {
        const similarity = cosineSimilarity(features, record.features);
        if (!bestMatch || similarity > bestMatch.similarity) {
          bestMatch = { id: record.id, similarity };
        }
      }
      
      // 阈值：0.7以上认为是同一人
      const THRESHOLD = 0.7;
      
      if (bestMatch && bestMatch.similarity >= THRESHOLD) {
        return {
          success: true,
          confidence: bestMatch.similarity,
          matchedId: bestMatch.id,
          error: null
        };
      }
      
      return {
        success: false,
        confidence: bestMatch?.similarity || 0,
        matchedId: null,
        error: 'Face not matched'
      };
    } catch (error) {
      return {
        success: false,
        confidence: 0,
        matchedId: null,
        error: `Verification error: ${error}`
      };
    }
  }
  
  // 获取状态
  getStatus(): FaceDatabaseStatus {
    return {
      capacity: this.capacity,
      currentCount: this.records.length,
      minRequired: this.minRequired,
      isInitialized: this.records.length >= this.minRequired,
      lastUpdate: this.records.length > 0 
        ? new Date(Math.max(...this.records.map(r => r.createdAt.getTime())))
        : null
    };
  }
  
  // 检查是否需要更新
  needsUpdate(): boolean {
    if (this.records.length < this.minRequired) return true;
    
    const lastUpdate = this.getStatus().lastUpdate;
    if (!lastUpdate) return true;
    
    // 检查是否超过6个月
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    return lastUpdate < sixMonthsAgo;
  }
  
  // 获取下次更新时间
  getNextUpdateDate(): Date | null {
    const lastUpdate = this.getStatus().lastUpdate;
    if (!lastUpdate) return null;
    
    const next = new Date(lastUpdate);
    next.setMonth(next.getMonth() + 6);
    return next;
  }
  
  // 保存到文件
  async save(): Promise<void> {
    const data = {
      records: this.records,
      capacity: this.capacity,
      minRequired: this.minRequired,
      savedAt: new Date()
    };
    
    const featuresPath = this.getFeaturesPath();
    fs.writeFileSync(featuresPath, JSON.stringify(data, null, 2));
  }
  
  // 从文件加载
  async load(): Promise<void> {
    const featuresPath = this.getFeaturesPath();
    
    if (fs.existsSync(featuresPath)) {
      const data = JSON.parse(fs.readFileSync(featuresPath, 'utf-8'));
      this.records = data.records.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt)
      }));
    }
  }
  
  // 清空数据库
  async clear(): Promise<void> {
    this.records = [];
    await this.save();
  }
}

// 简化的特征提取（实际应用中应使用 face-api.js）
function extractFeaturesFromBuffer(buffer: Buffer): number[] {
  // 基于图片内容生成伪特征向量
  const hash = crypto.createHash('sha256').update(buffer).digest();
  
  // 生成128维特征向量
  const features: number[] = [];
  for (let i = 0; i < 128; i++) {
    const byteIndex = i % hash.length;
    const nextByteIndex = (i + 1) % hash.length;
    features.push((hash[byteIndex] + hash[nextByteIndex]) / 512);
  }
  
  return features;
}

export default FaceDatabase;
