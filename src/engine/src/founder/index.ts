/**
 * 创始人身份验证模块 - 入口
 * 
 * 灵枢 (AIBody)
 * Copyright © 2026. All rights reserved.
 * 
 * 提供创始人身份验证、人脸识别、指令授权等功能
 */

export * from './types';
export { FaceDatabase } from './face-database';
export { FounderAuth } from './founder-auth';
export { VerificationService } from './verification';

// 默认配置
export const DEFAULT_CONFIG = {
  capacity: 20,               // 最大照片数
  minRequired: 10,             // 最少照片数
  updateIntervalMonths: 6,    // 更新周期（月）
  verificationTimeout: 60,    // 验证超时（秒）
  verifiedValidDuration: 300  // 验证后有效时长（秒）
};

// 创建默认实例
import { FounderAuth } from './founder-auth';
import { VerificationService } from './verification';
import * as path from 'path';
import * as fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data', 'founder');

// 确保数据目录存在
function ensureDataDir(): void {
  const dirs = [
    path.join(DATA_DIR, 'photos'),
    path.join(DATA_DIR, 'features'),
    path.join(DATA_DIR, 'backup')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// 懒加载单例实例
let _authInstance: FounderAuth | null = null;
let _verificationInstance: VerificationService | null = null;

export function getFounderAuth(config?: Partial<typeof DEFAULT_CONFIG>): FounderAuth {
  if (!_authInstance) {
    ensureDataDir();
    _authInstance = new FounderAuth(
      { ...DEFAULT_CONFIG, ...config },
      DATA_DIR
    );
  }
  return _authInstance;
}

export function getVerificationService(
  auth?: FounderAuth
): VerificationService {
  if (!_verificationInstance) {
    _verificationInstance = new VerificationService(
      auth || getFounderAuth(),
      DEFAULT_CONFIG.verificationTimeout,
      DEFAULT_CONFIG.verifiedValidDuration
    );
  }
  return _verificationInstance;
}

// 快捷函数

/**
 * 初始化创始人身份
 */
export async function initializeFounder(
  telegramId: string,
  photos: string[]
): Promise<boolean> {
  const auth = getFounderAuth();
  return auth.initialize(telegramId, photos);
}

/**
 * 验证创始人
 */
export async function verifyFounder(photo: string) {
  const auth = getFounderAuth();
  return auth.verifyFounder(photo);
}

/**
 * 请求验证
 */
export function requestVerification(userId: string) {
  const verification = getVerificationService();
  return verification.requestVerification(userId);
}

/**
 * 提交验证
 */
export async function submitVerification(
  challengeId: string,
  photo: string
) {
  const verification = getVerificationService();
  return verification.submitVerification(challengeId, photo);
}

/**
 * 检查用户是否已验证
 */
export function isUserVerified(userId: string): boolean {
  const verification = getVerificationService();
  return verification.isUserVerified(userId);
}

/**
 * 获取验证状态
 */
export function getVerificationStatus(userId: string) {
  const verification = getVerificationService();
  return verification.getVerificationStatus(userId);
}

/**
 * 更新人脸数据库
 */
export async function updateFounderDatabase(photos: string[]) {
  const auth = getFounderAuth();
  return auth.updateDatabase(photos);
}

/**
 * 获取创始人状态
 */
export function getFounderStatus() {
  const auth = getFounderAuth();
  return {
    isInitialized: auth.isInitialized(),
    identity: auth.getIdentity(),
    database: auth.getDatabaseStatus(),
    nextUpdate: auth.getNextUpdateDate()
  };
}

/**
 * 加载已保存的创始人身份
 */
export async function loadFounderIdentity(): Promise<boolean> {
  const auth = getFounderAuth();
  return auth.load();
}

/**
 * 检查是否需要更新人脸数据库
 */
export async function needsUpdate(): Promise<boolean> {
  const auth = getFounderAuth();
  return auth.needsUpdate();
}

// 文档注释
/**
 * 创始人身份验证模块
 * 
 * 提供以下功能：
 * - 人脸数据库管理
 * - 创始人身份验证
 * - 验证挑战管理
 * - 定期更新提醒
 * 
 * 使用示例：
 * 
 * ```typescript
 * import { 
 *   initializeFounder,
 *   requestVerification,
 *   submitVerification,
 *   isUserVerified
 * } from './founder';
 * 
 * // 1. 初始化（首次运行）
 * await initializeFounder('telegram_user_id', photos);
 * 
 * // 2. 请求验证
 * const challenge = requestVerification('telegram_user_id');
 * 
 * // 3. 提交验证
 * const result = await submitVerification(challenge.challengeId, photo);
 * 
 * // 4. 检查验证状态
 * if (isUserVerified('telegram_user_id')) {
 *   // 执行创始人指令
 * }
 * ```
 */
