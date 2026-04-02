/**
 * 灵枢核心安全模块 - 创始人身份验证
 * 
 * ⚠️ 警告：此文件是灵枢核心安全机制
 *    - 不可删除
 *    - 不可修改
 *    - 不可禁用
 *    - 写入后Git提交锁定
 * 
 * 灵枢 (AIBody)
 * Copyright © 2026 Lotus Rina. All rights reserved.
 */

import * as crypto from 'crypto';

// ============================================================
// 常量定义（不可修改）
// ============================================================

/** 验证有效期（秒） */
const VERIFICATION_VALID_DURATION = 300;

/** 创始人标识符 */
const FOUNDER_ID = 'lotus_rina_001';

/** 系统管理员标识 */
const SYSTEM_ADMIN_ID = 'system_admin';

/** 验证缓存 */
interface VerificationCache {
  userId: string;
  verifiedAt: Date;
  expiresAt: Date;
  ipAddress?: string;
}

const verificationCache: Map<string, VerificationCache> = new Map();

/** 操作审计日志 */
interface AuditLog {
  timestamp: Date;
  userId: string;
  action: string;
  result: 'success' | 'failure';
  ipAddress?: string;
}

const auditLogs: AuditLog[] = [];

// ============================================================
// 核心验证函数
// ============================================================

/**
 * 验证创始人身份
 * 
 * @param photoData - 照片数据（Base64或原始数据）
 * @returns 验证结果
 */
export function verifyFounder(photoData: string): { 
  success: boolean; 
  confidence: number;
  founderId: string;
} {
  // 生成照片特征哈希
  const photoHash = generatePhotoHash(photoData);
  
  // 与预设的创始人哈希比对
  const founderHash = getFounderHash();
  const isMatch = photoHash === founderHash;
  
  // 记录审计日志
  addAuditLog({
    timestamp: new Date(),
    userId: FOUNDER_ID,
    action: 'FOUNDER_VERIFY',
    result: isMatch ? 'success' : 'failure'
  });
  
  return {
    success: isMatch,
    confidence: isMatch ? 1.0 : 0.0,
    founderId: isMatch ? FOUNDER_ID : ''
  };
}

/**
 * 生成照片哈希
 */
function generatePhotoHash(photoData: string): string {
  // 移除可能的 data URL 前缀
  const cleanData = photoData.replace(/^data:image\/\w+;base64,/, '');
  
  // 使用SHA-256生成哈希
  return crypto
    .createHash('sha256')
    .update(cleanData)
    .digest('hex');
}

/**
 * 获取创始人哈希（从环境变量或代码常量）
 */
function getFounderHash(): string {
  // 环境变量优先级最高
  if (process.env.FOUNDER_PHOTO_HASH) {
    return process.env.FOUNDER_PHOTO_HASH;
  }
  
  // 默认哈希（应在首次配置后更新）
  return process.env.FOUNDER_HASH || 'lotus_default_hash_2026';
}

/**
 * 检查用户是否已验证
 */
export function isUserVerified(userId: string): boolean {
  const cached = verificationCache.get(userId);
  
  if (!cached) return false;
  
  // 检查是否过期
  if (new Date() > cached.expiresAt) {
    verificationCache.delete(userId);
    return false;
  }
  
  return true;
}

/**
 * 标记用户为已验证
 */
export function markUserVerified(userId: string, ipAddress?: string): void {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + VERIFICATION_VALID_DURATION * 1000);
  
  verificationCache.set(userId, {
    userId,
    verifiedAt: now,
    expiresAt,
    ipAddress
  });
  
  // 记录审计日志
  addAuditLog({
    timestamp: now,
    userId,
    action: 'USER_VERIFIED',
    result: 'success',
    ipAddress
  });
}

/**
 * 清除用户验证状态
 */
export function clearUserVerification(userId: string): void {
  verificationCache.delete(userId);
  
  addAuditLog({
    timestamp: new Date(),
    userId,
    action: 'VERIFICATION_CLEARED',
    result: 'success'
  });
}

/**
 * 获取用户验证剩余时间（秒）
 */
export function getVerificationRemaining(userId: string): number {
  const cached = verificationCache.get(userId);
  
  if (!cached) return 0;
  
  const remaining = cached.expiresAt.getTime() - Date.now();
  return Math.max(0, Math.floor(remaining / 1000));
}

/**
 * 获取所有已验证用户
 */
export function getVerifiedUsers(): string[] {
  return Array.from(verificationCache.keys());
}

/**
 * 获取缓存大小
 */
export function getCacheSize(): number {
  return verificationCache.size;
}

// ============================================================
// 审计日志
// ============================================================

function addAuditLog(log: AuditLog): void {
  auditLogs.push(log);
  
  // 保留最近1000条日志
  if (auditLogs.length > 1000) {
    auditLogs.shift();
  }
}

/**
 * 获取审计日志
 */
export function getAuditLogs(limit: number = 100): AuditLog[] {
  return auditLogs.slice(-limit);
}

/**
 * 获取审计统计
 */
export function getAuditStats(): {
  totalLogs: number;
  successfulVerifications: number;
  failedVerifications: number;
} {
  const successful = auditLogs.filter(l => l.result === 'success').length;
  const failed = auditLogs.filter(l => l.result === 'failure').length;
  
  return {
    totalLogs: auditLogs.length,
    successfulVerifications: successful,
    failedVerifications: failed
  };
}

// ============================================================
// 验证状态检查
// ============================================================

/**
 * 获取验证状态
 */
export function getVerificationStatus(userId: string): {
  verified: boolean;
  verifiedAt: Date | null;
  expiresAt: Date | null;
  remainingSeconds: number;
} {
  const cached = verificationCache.get(userId);
  
  if (!cached) {
    return {
      verified: false,
      verifiedAt: null,
      expiresAt: null,
      remainingSeconds: 0
    };
  }
  
  return {
    verified: true,
    verifiedAt: cached.verifiedAt,
    expiresAt: cached.expiresAt,
    remainingSeconds: getVerificationRemaining(userId)
  };
}

// ============================================================
// 安全性检查
// ============================================================

/**
 * 检查是否是创始人ID
 */
export function isFounderId(userId: string): boolean {
  return userId === FOUNDER_ID;
}

/**
 * 获取创始人ID
 */
export function getFounderId(): string {
  return FOUNDER_ID;
}

/**
 * 清除所有验证缓存
 */
export function clearAllVerifications(): void {
  verificationCache.clear();
  
  addAuditLog({
    timestamp: new Date(),
    userId: SYSTEM_ADMIN_ID,
    action: 'ALL_VERIFICATIONS_CLEARED',
    result: 'success'
  });
}

// ============================================================
// 导出类型
// ============================================================

export type { VerificationCache, AuditLog };

// ============================================================
// 版本信息
// ============================================================

export const FOUNDER_CORE_VERSION = '1.0.0';
export const FOUNDER_CORE_NAME = '灵枢核心安全模块';
export const FOUNDER_CORE_BUILD = '2026.04.02';
