/**
 * 验证服务 - 处理验证请求和挑战
 * 
 * 灵枢 (AIBody)
 * Copyright © 2026. All rights reserved.
 */

import * as crypto from 'crypto';
import { FounderAuth } from './founder-auth';
import { VerificationChallenge, VerificationStatus } from './types';

// 验证挑战状态
type ChallengeStatus = 'pending' | 'verified' | 'failed' | 'expired';

interface Challenge {
  challengeId: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  status: ChallengeStatus;
  attempts: number;
}

export class VerificationService {
  private auth: FounderAuth;
  private challenges: Map<string, Challenge> = new Map();
  private verifiedUsers: Map<string, { verifiedAt: Date; expiresAt: Date }> = new Map();
  private readonly verificationTimeout: number;  // 秒
  private readonly verifiedValidDuration: number;  // 验证后有效时长（秒）
  
  constructor(
    auth: FounderAuth,
    verificationTimeout: number = 60,
    verifiedValidDuration: number = 300  // 5分钟
  ) {
    this.auth = auth;
    this.verificationTimeout = verificationTimeout;
    this.verifiedValidDuration = verifiedValidDuration;
    
    // 启动挑战清理定时器
    this.startCleanupTimer();
  }
  
  // 请求验证
  requestVerification(userId: string): VerificationChallenge {
    // 检查用户是否已验证
    const existingVerification = this.verifiedUsers.get(userId);
    if (existingVerification && existingVerification.expiresAt > new Date()) {
      return {
        challengeId: 'already_verified',
        userId,
        createdAt: existingVerification.verifiedAt,
        expiresAt: existingVerification.expiresAt,
        status: 'verified'
      };
    }
    
    // 创建新挑战
    const challengeId = this.generateChallengeId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.verificationTimeout * 1000);
    
    const challenge: Challenge = {
      challengeId,
      userId,
      createdAt: now,
      expiresAt,
      status: 'pending',
      attempts: 0
    };
    
    this.challenges.set(challengeId, challenge);
    
    return {
      challengeId,
      userId,
      createdAt: now,
      expiresAt,
      status: 'pending'
    };
  }
  
  // 提交验证
  async submitVerification(
    challengeId: string, 
    photo: string
  ): Promise<{ success: boolean; message: string }> {
    const challenge = this.challenges.get(challengeId);
    
    if (!challenge) {
      return { success: false, message: 'Challenge not found' };
    }
    
    if (challenge.status === 'expired' || challenge.expiresAt < new Date()) {
      challenge.status = 'expired';
      return { success: false, message: 'Challenge expired' };
    }
    
    if (challenge.status === 'verified') {
      return { success: true, message: 'Already verified' };
    }
    
    challenge.attempts++;
    
    // 验证人脸
    const result = await this.auth.verifyFounder(photo);
    
    if (result.success) {
      challenge.status = 'verified';
      
      // 标记用户为已验证
      const expiresAt = new Date(
        new Date().getTime() + this.verifiedValidDuration * 1000
      );
      this.verifiedUsers.set(challenge.userId, {
        verifiedAt: new Date(),
        expiresAt
      });
      
      return {
        success: true,
        message: `Verification successful. Confidence: ${(result.confidence * 100).toFixed(1)}%`
      };
    }
    
    challenge.status = 'failed';
    
    if (challenge.attempts >= 3) {
      return {
        success: false,
        message: `Verification failed after ${challenge.attempts} attempts. Face not recognized.`
      };
    }
    
    return {
      success: false,
      message: `Verification failed. ${3 - challenge.attempts} attempts remaining.`
    };
  }
  
  // 批量验证提交
  async submitVerificationBatch(
    challengeId: string,
    photos: string[]
  ): Promise<{ success: boolean; message: string }> {
    const challenge = this.challenges.get(challengeId);
    
    if (!challenge) {
      return { success: false, message: 'Challenge not found' };
    }
    
    if (challenge.status !== 'pending') {
      return { success: false, message: `Challenge already ${challenge.status}` };
    }
    
    // 批量验证
    const result = await this.auth.verifyFounderBatch(photos);
    
    if (result.success) {
      challenge.status = 'verified';
      
      const expiresAt = new Date(
        new Date().getTime() + this.verifiedValidDuration * 1000
      );
      this.verifiedUsers.set(challenge.userId, {
        verifiedAt: new Date(),
        expiresAt
      });
      
      return {
        success: true,
        message: `Verification successful. Confidence: ${(result.confidence * 100).toFixed(1)}%`
      };
    }
    
    challenge.status = 'failed';
    return {
      success: false,
      message: `Verification failed: ${result.error}`
    };
  }
  
  // 获取验证状态
  getVerificationStatus(userId: string): VerificationStatus {
    const verification = this.verifiedUsers.get(userId);
    
    if (verification && verification.expiresAt > new Date()) {
      return {
        isVerified: true,
        verifiedAt: verification.verifiedAt,
        challengeId: null
      };
    }
    
    return {
      isVerified: false,
      verifiedAt: null,
      challengeId: null
    };
  }
  
  // 检查用户是否已验证
  isUserVerified(userId: string): boolean {
    const verification = this.verifiedUsers.get(userId);
    return verification !== undefined && verification.expiresAt > new Date();
  }
  
  // 使验证失效
  invalidateUser(userId: string): void {
    this.verifiedUsers.delete(userId);
  }
  
  // 获取挑战信息
  getChallenge(challengeId: string): VerificationChallenge | null {
    const challenge = this.challenges.get(challengeId);
    
    if (!challenge) return null;
    
    return {
      challengeId: challenge.challengeId,
      userId: challenge.userId,
      createdAt: challenge.createdAt,
      expiresAt: challenge.expiresAt,
      status: challenge.status
    };
  }
  
  // 获取用户的所有挑战
  getUserChallenges(userId: string): VerificationChallenge[] {
    const userChallenges: VerificationChallenge[] = [];
    
    this.challenges.forEach(challenge => {
      if (challenge.userId === userId) {
        userChallenges.push({
          challengeId: challenge.challengeId,
          userId: challenge.userId,
          createdAt: challenge.createdAt,
          expiresAt: challenge.expiresAt,
          status: challenge.status
        });
      }
    });
    
    return userChallenges;
  }
  
  // 生成挑战ID
  private generateChallengeId(): string {
    return `verify_${crypto.randomUUID()}`;
  }
  
  // 启动清理定时器
  private startCleanupTimer(): void {
    // 每分钟清理过期的挑战和验证
    setInterval(() => {
      const now = new Date();
      
      // 清理过期的挑战
      this.challenges.forEach((challenge, id) => {
        if (challenge.expiresAt < now) {
          this.challenges.delete(id);
        }
      });
      
      // 清理过期的验证
      this.verifiedUsers.forEach((verification, userId) => {
        if (verification.expiresAt < now) {
          this.verifiedUsers.delete(userId);
        }
      });
    }, 60000);  // 每分钟
  }
  
  // 获取统计信息
  getStats(): {
    activeChallenges: number;
    verifiedUsers: number;
    founderInitialized: boolean;
  } {
    return {
      activeChallenges: this.challenges.size,
      verifiedUsers: this.verifiedUsers.size,
      founderInitialized: this.auth.isInitialized()
    };
  }
}

export default VerificationService;
