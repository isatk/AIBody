/**
 * 创始人身份验证模块 - 类型定义
 * 
 * 灵枢 (AIBody)
 * Copyright © 2026. All rights reserved.
 */

// 人脸记录
export interface FaceRecord {
  id: string;                  // 记录唯一ID
  hash: string;                // 照片哈希
  features: number[];           // 人脸特征向量
  createdAt: Date;             // 创建时间
}

// 人脸数据库状态
export interface FaceDatabaseStatus {
  capacity: number;            // 容量上限
  currentCount: number;         // 当前数量
  minRequired: number;         // 最少需要数量
  isInitialized: boolean;      // 是否已初始化
  lastUpdate: Date | null;    // 最后更新时间
}

// 验证结果
export interface VerificationResult {
  success: boolean;            // 是否通过
  confidence: number;          // 置信度 0-1
  matchedId: string | null;    // 匹配的人脸ID
  error: string | null;       // 错误信息
}

// 验证挑战
export interface VerificationChallenge {
  challengeId: string;         // 挑战ID
  userId: string;              // 用户ID
  createdAt: Date;             // 创建时间
  expiresAt: Date;             // 过期时间
  status: 'pending' | 'verified' | 'failed' | 'expired';
}

// 验证状态
export interface VerificationStatus {
  isVerified: boolean;         // 是否已验证
  verifiedAt: Date | null;     // 验证时间
  challengeId: string | null;  // 挑战ID
}

// 创始人身份
export interface FounderIdentity {
  founderId: string;           // 创始人ID
  telegramId: string;          // Telegram绑定
  faceDatabase: FaceDatabaseStatus;  // 人脸数据库状态
  validUntil: Date;            // 有效截止
  lastUpdate: Date | null;     // 最后更新时间
}

// 更新结果
export interface UpdateResult {
  success: boolean;
  added: number;
  removed: number;
  error: string | null;
}

// 模块配置
export interface FounderConfig {
  capacity: number;            // 容量上限
  minRequired: number;         // 最少照片数
  updateIntervalMonths: number; // 更新周期（月）
  verificationTimeout: number; // 验证超时（秒）
}
