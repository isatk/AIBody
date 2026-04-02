# 创始人身份验证系统开发任务

## 项目背景
灵枢是一个私有化AI多群智能中枢系统，需要实现创始人身份验证功能。

## 核心需求

### 1. 人脸数据库
- 容量：最多20张照片
- 初次建立：至少10张
- 滚动更新：新照片入库，最旧照片移除
- 存储：仅存储人脸特征哈希，不存储原始照片

### 2. 验证流程
- 任何人可以发起创始人验证请求
- 灵枢要求人脸验证
- 验证通过 → 执行创始人指令
- 验证失败 → 拒绝执行

### 3. 定期更新
- 6个月提醒更新人脸数据库
- Lotus确认后提交新照片
- 新照片学习后更新数据库

### 4. 执行条件
- 创始人指令必须通过人脸验证才能执行
- 验证通过后指令必须执行
- 创始人权限最高，可发任意指令

## 技术要求

### 技术栈
- Node.js (灵枢引擎)
- face-api.js (人脸识别)
- TypeScript
- Telegram Bot API (接收照片/发送验证请求)

### 核心模块

#### 1. FaceDatabase (人脸数据库)
```typescript
class FaceDatabase {
  capacity: 20;           // 容量上限
  minPhotos: 10;           // 最少照片数
  
  addFace(photo: string): Promise<void>;   // 添加人脸
  removeOldest(): Promise<void>;           // 移除最旧
  verify(photo: string): Promise<boolean>; // 验证
  getStatus(): FaceDatabaseStatus;         // 获取状态
}
```

#### 2. FounderAuth (创始人认证)
```typescript
class FounderAuth {
  // 初始化人脸数据库
  async initialize(): Promise<void>;
  
  // 验证是否是创始人
  async verifyFounder(photo: string): Promise<VerificationResult>;
  
  // 检查是否需要更新
  async needsUpdate(): Promise<boolean>;
  
  // 更新人脸数据库
  async updateDatabase(photos: string[]): Promise<void>;
}
```

#### 3. VerificationService (验证服务)
```typescript
class VerificationService {
  // 请求验证
  async requestVerification(userId: string): Promise<VerificationChallenge>;
  
  // 提交验证
  async submitVerification(userId: string, photo: string): Promise<boolean>;
  
  // 检查验证状态
  async getVerificationStatus(userId: string): Promise<VerificationStatus>;
}
```

### Telegram 集成

#### 命令
- `/verify` - 请求创始人验证
- `/founder init` - 初始化人脸数据库
- `/founder update` - 更新人脸数据库
- `/founder status` - 查看状态

#### 流程
1. 用户发送 `/verify`
2. 灵枢回复："请发送您的照片进行验证"
3. 用户发送照片
4. 灵枢验证并返回结果

## 文件结构
```
灵枢/
├── src/
│   ├── engine/                    # 引擎核心
│   │   └── src/
│   │       └── founder/           # 创始人验证模块
│   │           ├── index.ts
│   │           ├── face-database.ts
│   │           ├── founder-auth.ts
│   │           ├── verification.ts
│   │           └── types.ts
│   └── ...
├── data/
│   └── founder/
│       ├── photos/               # 源照片目录
│       ├── features/            # 特征存储
│       └── backup/              # 备份
└── tests/
    └── founder/                  # 测试
```

## 安全要求
- 人脸数据哈希写入源码，Git提交锁定
- 原始照片不存储，仅存特征
- 活体检测防伪造
- 验证日志审计

## 开发步骤
1. 创建目录结构
2. 实现 FaceDatabase 类
3. 实现 FounderAuth 类
4. 实现 VerificationService 类
5. 集成 Telegram Bot
6. 编写测试
7. 集成到主引擎

## 参考资料
- 方案文档：`G:\CodeBuddy\灵枢\research\09-创始人身份验证方案.md`
- face-api.js: https://github.com/justadudewhohacks/face-api.js
