# 类Telegram自建IM客户端技术方案

> 来源：豆包会话 https://www.doubao.com/thread/w15325345bb98fd31
> 整理日期：2026-04-01

---

## 一、最终架构

```
用户 → 自建Android客户端 → openclaw 内核 → gstack 技能 → AI模型
用户 → 自建PC客户端（Telegram风格）→ openclaw 内核 → gstack 技能 → AI模型
```

**PC端**：直接用官方 Telegram，不做新桌面（最稳定）
**安卓端**：原生 Android 开发

---

## 二、自建服务端技术栈（对接原生客户端）

### 首选：Teamgram（Go语言）

| 组件 | 技术 |
|------|------|
| 核心语言 | Go 1.21+ |
| 协议 | MTProto 2.0，API Layer 222（兼容Android 12.5.2的143/155） |
| 数据库 | MySQL 8.0+ |
| 缓存 | Redis 7+ |
| 消息队列 | Kafka |
| 对象存储 | MinIO（头像/图片/视频/文件） |
| 媒体处理 | FFmpeg |
| 网关 | Nginx + MTProxy |

### 备选：MyTelegram（C#/.NET）

- 适合 .NET 技术栈团队
- Docker 一键部署

### 备选：Mini-Telegram（Rust）

- 极致性能、低内存、高并发
- 适合边缘/嵌入式部署

---

## 三、Android 客户端技术栈

### 最终选定：原生 Android + Jetpack Compose

| 组件 | 技术 |
|------|------|
| 语言 | Kotlin |
| UI | Jetpack Compose（现代安卓标准） |
| 架构 | MVVM + Kotlin Coroutine + Flow |
| 网络 | WebSocket + Protobuf / JSON |
| 本地存储 | Room（SQLite）+ DataStore |
| 图片/文件 | Coil + FFmpeg |

---

## 四、Telegram Android 12.5.2 UI 技术栈（参考）

| 组件 | 技术 |
|------|------|
| 语言 | Java（主体）+ Kotlin（少量新模块） |
| UI体系 | 纯 Android 原生 View 系统（无 Compose） |
| 架构 | Activity + Fragment（单 Activity） |
| 布局 | 代码动态创建 View（几乎不用 XML） |
| 自研组件 | LayoutHelper、RecyclerListView、ActionBar、ChatCell |
| 动画 | ValueAnimator + ObjectAnimator + RLottie |
| 主题 | 自研 Theme 系统（浅色/深色/Liquid Glass） |
| 构建 | Gradle + R8 + CMake（NDK） |

**Liquid Glass 风格**：自研 MotionBackgroundDrawable + 模糊算法 + 半透明背景

---

## 五、关键源码包（Android）

| 功能 | 源码包 |
|------|--------|
| 列表/聊天 | org.telegram.ui.Components.RecyclerListView |
| 下载/图片加载 | org.telegram.messenger.ImageLoader |
| 文件下载 | org.telegram.messenger.FileLoader |
| 限流/Flood Wait | org.telegram.tgnet.RequestQueue |
| 连接管理 | org.telegram.tgnet.ConnectionsManager |
| 消息发送 | org.telegram.ui.ChatActivity |

---

## 六、次数可用性（限流规则）

| 规则 | 限制 |
|------|------|
| 单聊天发送 | 1 条/秒 |
| 全局发送 | 30 条/秒 |
| 批量拉取（getHistory） | 1 次/秒，每次最多100条 |
| 媒体上传 | 单文件≤2GB，并行≤4路 |
| Premium 特权 | 全局发送提升到 60 条/秒 |

---

## 七、两端共用 openclaw 统一消息结构

```json
{
  "platform": "telegram" / "android",
  "user_id": "xxx",
  "message_id": "xxx",
  "content": "文本/图片/文件/语音",
  "buttons": [ ... ]
}
```

流程：
1. 用户在 TG/安卓发消息 → openclaw 收到
2. openclaw 统一交给 gstack 处理
3. 结果返回对应平台
