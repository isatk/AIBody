const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();

// 设置演示文稿属性
pptx.title = "灵枢 AIBody - 产品路演";
pptx.author = "Lotus Rina";
pptx.company = "灵枢";
pptx.subject = "私有化AI智能中枢产品介绍";
pptx.category = "Product Presentation";

// 主题配色
const colors = {
  primary: "1A365D",      // 深蓝色
  secondary: "2B6CB0",   // 中蓝色
  accent: "38B2AC",      // 青色
  dark: "1A202C",         // 深灰黑
  light: "F7FAFC",        // 浅灰白
  white: "FFFFFF",
  text: "2D3748",
  lightText: "718096"
};

// 阴影工厂函数
const makeShadow = () => ({
  type: "outer", color: "000000",
  blur: 8, offset: 3, angle: 135, opacity: 0.2
});

// ============================================================
// 第1页：封面
// ============================================================
let slide1 = pptx.addSlide();
slide1.background = { color: colors.primary };

// 装饰形状 - 左侧渐变条
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.15, h: 5.63,
  fill: { color: colors.accent }
});

// 装饰形状 - 右下角圆形
slide1.addShape(pptx.shapes.OVAL, {
  x: 7.5, y: 3.5, w: 4, h: 4,
  fill: { color: colors.secondary, transparency: 60 }
});

// 产品名称
slide1.addText("灵枢", {
  x: 0.8, y: 1.5, w: 8, h: 1.2,
  fontSize: 72, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true
});

// 英文名
slide1.addText("AIBody", {
  x: 0.8, y: 2.6, w: 8, h: 0.8,
  fontSize: 36, fontFace: "Arial",
  color: colors.accent, bold: true,
  charSpacing: 8
});

// 副标题
slide1.addText("私有化AI智能中枢", {
  x: 0.8, y: 3.5, w: 8, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white
});

// 口号
slide1.addText("让AI拥有持久记忆、自主规划、跨场景迁移的能力", {
  x: 0.8, y: 4.3, w: 8, h: 0.5,
  fontSize: 16, fontFace: "Microsoft YaHei",
  color: colors.accent
});

// 底部信息
slide1.addText("2026 产品路演 | MIT 开源协议", {
  x: 0.8, y: 5.0, w: 5, h: 0.3,
  fontSize: 12, fontFace: "Microsoft YaHei",
  color: colors.white
});

// ============================================================
// 第2页：痛点与愿景
// ============================================================
let slide2 = pptx.addSlide();
slide2.background = { color: colors.light };

// 标题栏
slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide2.addText("打破AI的四大桎梏", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 四个痛点卡片
const painPoints = [
  { icon: "🏝️", title: "孤岛智能", current: "AI依附单一载体", vision: "无界陪伴" },
  { icon: "🧬", title: "短时智能", current: "上下文割裂", vision: "长寿懂你" },
  { icon: "⚡", title: "转瞬智能", current: "系统崩溃不可复活", vision: "稳定同行" },
  { icon: "🚀", title: "有限智能", current: "能力碎片化", vision: "无限适配" }
];

painPoints.forEach((point, i) => {
  const x = 0.5 + (i % 2) * 4.7;
  const y = 1.3 + Math.floor(i / 2) * 2.1;

  // 卡片背景
  slide2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 4.4, h: 1.9,
    fill: { color: colors.white },
    rectRadius: 0.1,
    shadow: makeShadow()
  });

  // 图标
  slide2.addText(point.icon, {
    x: x + 0.2, y: y + 0.2, w: 0.8, h: 0.8,
    fontSize: 36, align: "center", valign: "middle"
  });

  // 标题
  slide2.addText(point.title, {
    x: x + 1.0, y: y + 0.2, w: 3, h: 0.5,
    fontSize: 20, fontFace: "Microsoft YaHei",
    color: colors.primary, bold: true
  });

  // 现状
  slide2.addText("现状: " + point.current, {
    x: x + 1.0, y: y + 0.7, w: 3.2, h: 0.4,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: colors.lightText
  });

  // 愿景
  slide2.addText("→ " + point.vision, {
    x: x + 1.0, y: y + 1.2, w: 3.2, h: 0.4,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: colors.accent, bold: true
  });
});

// ============================================================
// 第3页：产品定位
// ============================================================
let slide3 = pptx.addSlide();
slide3.background = { color: colors.light };

// 标题栏
slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide3.addText("产品定位", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 核心定义卡片
slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.3, w: 9, h: 1.8,
  fill: { color: colors.white },
  rectRadius: 0.1,
  shadow: makeShadow()
});

slide3.addText("灵枢是一个基于'AI数字身体'理念的私有化AI智能中枢", {
  x: 0.8, y: 1.5, w: 8.4, h: 0.6,
  fontSize: 22, fontFace: "Microsoft YaHei",
  color: colors.primary, bold: true
});

slide3.addText("将灵枢引擎、gstack技能库、agency智能体完全融合为一套完整产品", {
  x: 0.8, y: 2.1, w: 8.4, h: 0.8,
  fontSize: 16, fontFace: "Microsoft YaHei",
  color: colors.text
});

// 三层融合
const layers = [
  { name: "灵枢引擎", desc: "基于openclaw构建", color: colors.secondary },
  { name: "gstack技能", desc: "23个工程技能", color: colors.accent },
  { name: "agency智能体", desc: "179个专家智能体", color: colors.primary }
];

layers.forEach((layer, i) => {
  const x = 0.5 + i * 3.1;

  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 3.4, w: 2.9, h: 1.6,
    fill: { color: layer.color },
    rectRadius: 0.1
  });

  slide3.addText(layer.name, {
    x: x, y: 3.6, w: 2.9, h: 0.6,
    fontSize: 18, fontFace: "Microsoft YaHei",
    color: colors.white, bold: true, align: "center"
  });

  slide3.addText(layer.desc, {
    x: x, y: 4.2, w: 2.9, h: 0.6,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: colors.white, align: "center"
  });
});

// 核心优势
slide3.addText("核心优势：私有化部署 · 完全自主 · 数据不出公网", {
  x: 0.5, y: 5.2, w: 9, h: 0.3,
  fontSize: 14, fontFace: "Microsoft YaHei",
  color: colors.accent, bold: true, align: "center"
});

// ============================================================
// 第4页：技术架构
// ============================================================
let slide4 = pptx.addSlide();
slide4.background = { color: colors.light };

// 标题栏
slide4.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide4.addText("技术架构", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 四层架构
const archLayers = [
  { name: "客户端层", tech: "Flutter / React / Tauri", y: 1.2 },
  { name: "服务层 (Go)", tech: "Gin + Redis + MySQL", y: 2.3 },
  { name: "引擎层 (Node.js)", tech: "openclaw + Hono", y: 3.4 },
  { name: "能力层", tech: "gstack (23) + agency (179)", y: 4.5 }
];

archLayers.forEach((layer, i) => {
  // 层级标签
  slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: layer.y, w: 2.5, h: 0.9,
    fill: { color: colors.primary },
    rectRadius: 0.05
  });

  slide4.addText(layer.name, {
    x: 0.5, y: layer.y, w: 2.5, h: 0.9,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: colors.white, bold: true, align: "center", valign: "middle"
  });

  // 技术描述
  slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.2, y: layer.y, w: 6.3, h: 0.9,
    fill: { color: colors.white },
    rectRadius: 0.05,
    shadow: makeShadow()
  });

  slide4.addText(layer.tech, {
    x: 3.5, y: layer.y, w: 6, h: 0.9,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: colors.text, valign: "middle"
  });

  // 连接线
  if (i < archLayers.length - 1) {
    slide4.addShape(pptx.shapes.LINE, {
      x: 1.75, y: layer.y + 0.9, w: 0, h: 0.4,
      line: { color: colors.accent, width: 2, dashType: "dash" }
    });
  }
});

// 底部说明
slide4.addText("通信协议：WebSocket/HTTPS + gRPC + REST", {
  x: 0.5, y: 5.3, w: 9, h: 0.3,
  fontSize: 12, fontFace: "Microsoft YaHei",
  color: colors.lightText, align: "center"
});

// ============================================================
// 第5页：核心功能
// ============================================================
let slide5 = pptx.addSlide();
slide5.background = { color: colors.light };

// 标题栏
slide5.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide5.addText("核心功能", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 功能网格
const features = [
  { icon: "⚡", title: "即时ACK", desc: "100ms内确认收到消息" },
  { icon: "📋", title: "任务队列", desc: "多任务管理，优先级调度" },
  { icon: "📊", title: "进度可视化", desc: "实时任务进度推送" },
  { icon: "🔧", title: "技能系统", desc: "23个gstack工程技能" },
  { icon: "🤖", title: "智能体", desc: "179个专家角色" },
  { icon: "🔒", title: "私有化部署", desc: "完全自主，数据不出公网" }
];

features.forEach((feat, i) => {
  const x = 0.5 + (i % 3) * 3.1;
  const y = 1.2 + Math.floor(i / 3) * 2.1;

  // 卡片
  slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 2.9, h: 1.9,
    fill: { color: colors.white },
    rectRadius: 0.1,
    shadow: makeShadow()
  });

  // 图标
  slide5.addText(feat.icon, {
    x: x, y: y + 0.2, w: 2.9, h: 0.6,
    fontSize: 32, align: "center"
  });

  // 标题
  slide5.addText(feat.title, {
    x: x, y: y + 0.8, w: 2.9, h: 0.4,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: colors.primary, bold: true, align: "center"
  });

  // 描述
  slide5.addText(feat.desc, {
    x: x + 0.2, y: y + 1.2, w: 2.5, h: 0.5,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: colors.lightText, align: "center"
  });
});

// ============================================================
// 第6页：gstack技能
// ============================================================
let slide6 = pptx.addSlide();
slide6.background = { color: colors.light };

// 标题栏
slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide6.addText("gstack技能 (23个)", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 技能分类
const skillCategories = [
  { cat: "需求规划", skills: "/office-hours, /plan-ceo-review, /plan-eng-review", count: 3 },
  { cat: "代码执行", skills: "/review, /qa, /qa-only", count: 3 },
  { cat: "部署发布", skills: "/ship, /land-and-deploy, /canary", count: 3 },
  { cat: "安全审计", skills: "/cso", count: 1 },
  { cat: "网络请求", skills: "/browse", count: 1 },
  { cat: "调试分析", skills: "/investigate", count: 1 },
  { cat: "设计创意", skills: "/design-consultation, /design-shotgun, /design-html", count: 3 },
  { cat: "办公集成", skills: "/jira, /confluence, /slack, /linear, /notion, /github", count: 6 }
];

skillCategories.forEach((cat, i) => {
  const x = 0.5 + (i % 2) * 4.7;
  const y = 1.2 + Math.floor(i / 2) * 1.0;

  // 分类标签
  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 1.5, h: 0.8,
    fill: { color: colors.secondary },
    rectRadius: 0.05
  });

  slide6.addText(cat.cat, {
    x: x, y: y, w: 1.5, h: 0.8,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: colors.white, bold: true, align: "center", valign: "middle"
  });

  // 技能描述
  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 1.6, y: y, w: 3.0, h: 0.8,
    fill: { color: colors.white },
    rectRadius: 0.05
  });

  slide6.addText(cat.skills, {
    x: x + 1.7, y: y, w: 2.8, h: 0.8,
    fontSize: 8, fontFace: "Microsoft YaHei",
    color: colors.text, valign: "middle"
  });

  // 数量
  slide6.addText(cat.count + "个", {
    x: x + 4.2, y: y, w: 0.4, h: 0.8,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: colors.accent, bold: true, valign: "middle"
  });
});

// ============================================================
// 第7页：agency智能体
// ============================================================
let slide7 = pptx.addSlide();
slide7.background = { color: colors.light };

// 标题栏
slide7.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide7.addText("agency智能体 (179个)", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 智能体分类
const agentDepts = [
  { dept: "工程部", count: 30, color: colors.secondary },
  { dept: "营销部", count: 34, color: colors.accent },
  { dept: "专业化", count: 34, color: colors.primary },
  { dept: "游戏开发", count: 20, color: "E53E3E" },
  { dept: "设计部", count: 8, color: "DD6B20" },
  { dept: "销售部", count: 8, color: "38A169" },
  { dept: "支持部", count: 8, color: "3182CE" },
  { dept: "学术部", count: 6, color: "805AD5" },
  { dept: "产品部", count: 5, color: "D53F8C" },
  { dept: "项目管理", count: 6, color: "00B5D8" }
];

agentDepts.forEach((dept, i) => {
  const x = 0.5 + (i % 5) * 1.9;
  const y = 1.2 + Math.floor(i / 5) * 2.0;

  // 数量圆圈
  slide7.addShape(pptx.shapes.OVAL, {
    x: x + 0.45, y: y, w: 1, h: 1,
    fill: { color: dept.color }
  });

  slide7.addText(dept.count.toString(), {
    x: x + 0.45, y: y, w: 1, h: 1,
    fontSize: 24, fontFace: "Arial",
    color: colors.white, bold: true, align: "center", valign: "middle"
  });

  // 部门名
  slide7.addText(dept.dept, {
    x: x, y: y + 1.1, w: 1.9, h: 0.4,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: colors.text, align: "center"
  });
});

// 代表性智能体
slide7.addText("代表性智能体：前端开发者 | 后端架构师 | 小红书运营 | 产品经理 | 数据分析师 | DevOps | AI工程师 | 医疗合规顾问", {
  x: 0.5, y: 5.2, w: 9, h: 0.3,
  fontSize: 10, fontFace: "Microsoft YaHei",
  color: colors.lightText, align: "center"
});

// ============================================================
// 第8页：性能指标
// ============================================================
let slide8 = pptx.addSlide();
slide8.background = { color: colors.light };

// 标题栏
slide8.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide8.addText("性能与安全指标", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 性能指标
const perfMetrics = [
  { metric: "API QPS", value: "1000+", unit: "请求/秒" },
  { metric: "API延迟P99", value: "<200ms", unit: "" },
  { metric: "WebSocket并发", value: "10000+", unit: "连接" },
  { metric: "SLA可用性", value: "99.9%", unit: "" }
];

perfMetrics.forEach((m, i) => {
  const x = 0.5 + i * 2.4;

  slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.2, w: 2.2, h: 1.8,
    fill: { color: colors.white },
    rectRadius: 0.1,
    shadow: makeShadow()
  });

  slide8.addText(m.value, {
    x: x, y: 1.4, w: 2.2, h: 0.9,
    fontSize: 32, fontFace: "Arial",
    color: colors.accent, bold: true, align: "center"
  });

  slide8.addText(m.unit, {
    x: x, y: 2.1, w: 2.2, h: 0.4,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: colors.lightText, align: "center"
  });

  slide8.addText(m.metric, {
    x: x, y: 2.5, w: 2.2, h: 0.4,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: colors.text, align: "center"
  });
});

// 安全特性
slide8.addText("安全特性", {
  x: 0.5, y: 3.3, w: 9, h: 0.5,
  fontSize: 18, fontFace: "Microsoft YaHei",
  color: colors.primary, bold: true
});

const secFeatures = [
  "JWT认证 (Access Token 15min + Refresh Token 7d)",
  "TLS 1.3 全链路加密",
  "AES-256 本地数据加密",
  "WireGuard ChaCha20-Poly1305 隧道加密"
];

slide8.addText(
  secFeatures.map((f, i) => ({ text: f, options: { bullet: true, breakLine: i < secFeatures.length - 1 } })),
  {
    x: 0.8, y: 3.8, w: 8.5, h: 1.6,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: colors.text,
    paraSpaceAfter: 6
  }
);

// ============================================================
// 第9页：商业模式
// ============================================================
let slide9 = pptx.addSlide();
slide9.background = { color: colors.light };

// 标题栏
slide9.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide9.addText("开源与商业化", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 开源卡片
slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.2, w: 4.4, h: 3.8,
  fill: { color: colors.white },
  rectRadius: 0.1,
  shadow: makeShadow()
});

slide9.addText("MIT 开源", {
  x: 0.5, y: 1.4, w: 4.4, h: 0.6,
  fontSize: 24, fontFace: "Microsoft YaHei",
  color: colors.primary, bold: true, align: "center"
});

slide9.addText("100% 开源", {
  x: 0.5, y: 2.0, w: 4.4, h: 0.4,
  fontSize: 14, fontFace: "Microsoft YaHei",
  color: colors.accent, align: "center"
});

const openSourcePoints = [
  "完整源代码开放",
  "社区自由使用",
  "自由修改和分发",
  "无使用限制"
];

slide9.addText(
  openSourcePoints.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < openSourcePoints.length - 1 } })),
  {
    x: 0.8, y: 2.6, w: 4, h: 2.2,
    fontSize: 13, fontFace: "Microsoft YaHei",
    color: colors.text,
    paraSpaceAfter: 8
  }
);

// 商业化卡片
slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 5.1, y: 1.2, w: 4.4, h: 3.8,
  fill: { color: colors.secondary },
  rectRadius: 0.1
});

slide9.addText("商业化方向", {
  x: 5.1, y: 1.4, w: 4.4, h: 0.6,
  fontSize: 24, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, align: "center"
});

const bizPoints = [
  { title: "P1 私有化部署支持", desc: "企业级私有化部署服务" },
  { title: "P2 企业增强", desc: "高级功能和企业支持服务" }
];

bizPoints.forEach((biz, i) => {
  slide9.addText(biz.title, {
    x: 5.3, y: 2.2 + i * 1.4, w: 4, h: 0.5,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: colors.white, bold: true
  });

  slide9.addText(biz.desc, {
    x: 5.3, y: 2.7 + i * 1.4, w: 4, h: 0.5,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: colors.light
  });
});

// 底部说明
slide9.addText("商业化将在产品上线后讨论", {
  x: 0.5, y: 5.2, w: 9, h: 0.3,
  fontSize: 12, fontFace: "Microsoft YaHei",
  color: colors.lightText, align: "center"
});

// ============================================================
// 第10页：里程碑
// ============================================================
let slide10 = pptx.addSlide();
slide10.background = { color: colors.light };

// 标题栏
slide10.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide10.addText("V1.0 开发路线图", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 时间线
const milestones = [
  { week: "W1-2", title: "环境搭建", status: "准备中", done: false },
  { week: "W3-4", title: "API层开发", status: "准备中", done: false },
  { week: "W5-6", title: "openclaw集成", status: "准备中", done: false },
  { week: "W7-8", title: "核心技能", status: "准备中", done: false },
  { week: "W9-10", title: "核心智能体", status: "准备中", done: false },
  { week: "W11-12", title: "客户端MVP", status: "准备中", done: false },
  { week: "W13-14", title: "部署与测试", status: "准备中", done: false },
  { week: "W15-16", title: "V1.0发布", status: "准备中", done: false }
];

// 时间线主轴
slide10.addShape(pptx.shapes.LINE, {
  x: 1.2, y: 2.8, w: 7.6, h: 0,
  line: { color: colors.accent, width: 3 }
});

milestones.forEach((m, i) => {
  const x = 1.2 + i * 1.0;

  // 节点圆圈
  slide10.addShape(pptx.shapes.OVAL, {
    x: x - 0.15, y: 2.65, w: 0.3, h: 0.3,
    fill: { color: m.done ? colors.accent : colors.lightText }
  });

  // 周次
  slide10.addText(m.week, {
    x: x - 0.4, y: 1.9, w: 0.8, h: 0.4,
    fontSize: 10, fontFace: "Arial",
    color: colors.primary, bold: true, align: "center"
  });

  // 标题
  slide10.addText(m.title, {
    x: x - 0.5, y: 3.1, w: 1.0, h: 0.8,
    fontSize: 9, fontFace: "Microsoft YaHei",
    color: colors.text, align: "center"
  });
});

// 底部总结
slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 4.2, w: 9, h: 1.2,
  fill: { color: colors.white },
  rectRadius: 0.1,
  shadow: makeShadow()
});

slide10.addText("开发周期：16周 (4个月)", {
  x: 0.5, y: 4.4, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Microsoft YaHei",
  color: colors.primary, bold: true, align: "center"
});

slide10.addText("目标：打造完整的私有化AI智能中枢产品", {
  x: 0.5, y: 4.9, w: 9, h: 0.4,
  fontSize: 12, fontFace: "Microsoft YaHei",
  color: colors.text, align: "center"
});

// ============================================================
// 第11页：结束页
// ============================================================
let slide11 = pptx.addSlide();
slide11.background = { color: colors.primary };

// 装饰形状
slide11.addShape(pptx.shapes.OVAL, {
  x: -1, y: -1, w: 4, h: 4,
  fill: { color: colors.secondary, transparency: 60 }
});

slide11.addShape(pptx.shapes.OVAL, {
  x: 7, y: 3, w: 5, h: 5,
  fill: { color: colors.accent, transparency: 50 }
});

// 感谢文字
slide11.addText("感谢关注", {
  x: 0.5, y: 1.8, w: 9, h: 1,
  fontSize: 56, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, align: "center"
});

slide11.addText("灵枢 AIBody", {
  x: 0.5, y: 2.9, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.accent, align: "center"
});

// 链接信息
slide11.addText("GitHub: github.com/isatk/AIBody", {
  x: 0.5, y: 4.0, w: 9, h: 0.4,
  fontSize: 14, fontFace: "Arial",
  color: colors.white, align: "center"
});

slide11.addText("Gitee: gitee.com/lotusisatk/aibody", {
  x: 0.5, y: 4.4, w: 9, h: 0.4,
  fontSize: 14, fontFace: "Arial",
  color: colors.white, align: "center"
});

slide11.addText("MIT 开源协议 | 2026", {
  x: 0.5, y: 5.1, w: 9, h: 0.3,
  fontSize: 12, fontFace: "Microsoft YaHei",
  color: colors.lightText, align: "center"
});

// 保存文件
const outputPath = "G:/CodeBuddy/灵枢/ppt/灵枢AIBody-产品路演.pptx";
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log("PPT已生成: " + outputPath);
  })
  .catch(err => {
    console.error("生成失败:", err);
  });
