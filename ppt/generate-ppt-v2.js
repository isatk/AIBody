const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();

// 设置演示文稿属性
pptx.title = "灵枢 AIBody - 产品介绍";
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
  lightText: "718096",
  success: "38A169",     // 绿色
  warning: "DD6B20",     // 橙色
  danger: "E53E3E"        // 红色
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

// 装饰形状 - 右上角
slide1.addShape(pptx.shapes.OVAL, {
  x: 8, y: -1, w: 3, h: 3,
  fill: { color: colors.accent, transparency: 70 }
});

// 产品名称
slide1.addText("灵枢", {
  x: 0.8, y: 1.3, w: 8, h: 1.2,
  fontSize: 80, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true
});

// 英文名
slide1.addText("AIBody", {
  x: 0.8, y: 2.5, w: 8, h: 0.8,
  fontSize: 40, fontFace: "Arial",
  color: colors.accent, bold: true,
  charSpacing: 10
});

// 副标题
slide1.addText("私有化AI智能中枢", {
  x: 0.8, y: 3.5, w: 8, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white
});

// 口号
slide1.addText("让AI拥有持久记忆、自主规划、跨场景迁移的能力", {
  x: 0.8, y: 4.2, w: 8, h: 0.5,
  fontSize: 16, fontFace: "Microsoft YaHei",
  color: colors.accent
});

// 底部信息
slide1.addText("2026 | MIT 开源协议 | github.com/isatk/AIBody", {
  x: 0.8, y: 5.0, w: 8, h: 0.3,
  fontSize: 12, fontFace: "Microsoft YaHei",
  color: colors.white
});

// ============================================================
// 第2页：目录
// ============================================================
let slide2 = pptx.addSlide();
slide2.background = { color: colors.light };

// 标题栏
slide2.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide2.addText("目录", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

const tocItems = [
  { num: "01", title: "产品愿景", desc: "打破AI四大桎梏" },
  { num: "02", title: "产品定位", desc: "私有化AI智能中枢" },
  { num: "03", title: "技术架构", desc: "四层融合架构" },
  { num: "04", title: "核心功能", desc: "六大核心能力" },
  { num: "05", title: "gstack技能", desc: "23个工程技能" },
  { num: "06", title: "agency智能体", desc: "179个专家智能体" },
  { num: "07", title: "性能指标", desc: "量化技术指标" },
  { num: "08", title: "商业模式", desc: "开源与商业化" },
  { num: "09", title: "开发路线", desc: "16周里程碑" }
];

tocItems.forEach((item, i) => {
  const x = 0.5 + (i % 3) * 3.1;
  const y = 1.3 + Math.floor(i / 3) * 1.1;

  // 编号圆圈
  slide2.addShape(pptx.shapes.OVAL, {
    x: x, y: y, w: 0.6, h: 0.6,
    fill: { color: colors.accent }
  });

  slide2.addText(item.num, {
    x: x, y: y, w: 0.6, h: 0.6,
    fontSize: 14, fontFace: "Arial",
    color: colors.white, bold: true, align: "center", valign: "middle"
  });

  // 标题
  slide2.addText(item.title, {
    x: x + 0.7, y: y, w: 2.2, h: 0.35,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: colors.primary, bold: true
  });

  // 描述
  slide2.addText(item.desc, {
    x: x + 0.7, y: y + 0.35, w: 2.2, h: 0.3,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: colors.lightText
  });
});

// ============================================================
// 第3页：产品愿景 - 打破四大桎梏
// ============================================================
let slide3 = pptx.addSlide();
slide3.background = { color: colors.light };

// 标题栏
slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide3.addText("01 产品愿景：打破AI的四大桎梏", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 四个痛点卡片
const painPoints = [
  { icon: "🏝️", title: "孤岛智能", current: "AI依附单一载体", vision: "无界陪伴", color: colors.secondary },
  { icon: "🧬", title: "短时智能", current: "上下文割裂", vision: "长寿懂你", color: colors.accent },
  { icon: "⚡", title: "转瞬智能", current: "系统崩溃不可复活", vision: "稳定同行", color: colors.warning },
  { icon: "🚀", title: "有限智能", current: "能力碎片化", vision: "无限适配", color: colors.success }
];

painPoints.forEach((point, i) => {
  const x = 0.5 + (i % 2) * 4.7;
  const y = 1.3 + Math.floor(i / 2) * 2.1;

  // 卡片背景
  slide3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 4.4, h: 1.9,
    fill: { color: colors.white },
    rectRadius: 0.1,
    shadow: makeShadow()
  });

  // 左侧色条
  slide3.addShape(pptx.shapes.RECTANGLE, {
    x: x, y: y, w: 0.1, h: 1.9,
    fill: { color: point.color }
  });

  // 图标
  slide3.addText(point.icon, {
    x: x + 0.3, y: y + 0.15, w: 0.8, h: 0.8,
    fontSize: 36, align: "center", valign: "middle"
  });

  // 标题
  slide3.addText(point.title, {
    x: x + 1.1, y: y + 0.2, w: 3, h: 0.5,
    fontSize: 20, fontFace: "Microsoft YaHei",
    color: colors.primary, bold: true
  });

  // 现状
  slide3.addText("❌ 现状: " + point.current, {
    x: x + 1.1, y: y + 0.7, w: 3.2, h: 0.4,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: colors.danger
  });

  // 愿景
  slide3.addText("✅ 灵枢: " + point.vision, {
    x: x + 1.1, y: y + 1.2, w: 3.2, h: 0.5,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: colors.success, bold: true
  });
});

// ============================================================
// 第4页：产品定位
// ============================================================
let slide4 = pptx.addSlide();
slide4.background = { color: colors.light };

// 标题栏
slide4.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide4.addText("02 产品定位：私有化AI智能中枢", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 核心定义卡片
slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.2, w: 9, h: 1.5,
  fill: { color: colors.white },
  rectRadius: 0.1,
  shadow: makeShadow()
});

slide4.addText("灵枢是一个基于'AI数字身体'理念的私有化AI智能中枢", {
  x: 0.8, y: 1.4, w: 8.4, h: 0.6,
  fontSize: 20, fontFace: "Microsoft YaHei",
  color: colors.primary, bold: true
});

slide4.addText("将灵枢引擎、gstack技能库、agency智能体完全融合为一套完整产品", {
  x: 0.8, y: 2.0, w: 8.4, h: 0.5,
  fontSize: 14, fontFace: "Microsoft YaHei",
  color: colors.text
});

// 三层融合
const layers = [
  { name: "灵枢引擎", desc: "基于openclaw构建", tech: "Node.js + Go", color: colors.secondary },
  { name: "gstack技能", desc: "23个工程技能", tech: "代码审查/测试/部署", color: colors.accent },
  { name: "agency智能体", desc: "179个专家智能体", tech: "前端/后端/营销/设计", color: colors.primary }
];

layers.forEach((layer, i) => {
  const x = 0.5 + i * 3.1;

  slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 3.0, w: 2.9, h: 2.0,
    fill: { color: layer.color },
    rectRadius: 0.1
  });

  slide4.addText(layer.name, {
    x: x, y: 3.2, w: 2.9, h: 0.5,
    fontSize: 18, fontFace: "Microsoft YaHei",
    color: colors.white, bold: true, align: "center"
  });

  slide4.addText(layer.desc, {
    x: x, y: 3.7, w: 2.9, h: 0.4,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: colors.white, align: "center"
  });

  slide4.addText(layer.tech, {
    x: x, y: 4.2, w: 2.9, h: 0.5,
    fontSize: 10, fontFace: "Microsoft YaHei",
    color: "EEEEEE", align: "center"
  });
});

// 核心优势
slide4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 5.15, w: 9, h: 0.4,
  fill: { color: colors.accent, transparency: 20 },
  rectRadius: 0.05
});

slide4.addText("💡 核心优势：私有化部署 · 完全自主 · 数据不出公网 · 模块可插拔", {
  x: 0.5, y: 5.15, w: 9, h: 0.4,
  fontSize: 12, fontFace: "Microsoft YaHei",
  color: colors.primary, bold: true, align: "center", valign: "middle"
});

// ============================================================
// 第5页：技术架构
// ============================================================
let slide5 = pptx.addSlide();
slide5.background = { color: colors.light };

// 标题栏
slide5.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide5.addText("03 技术架构：四层融合架构", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 四层架构
const archLayers = [
  { name: "客户端层", tech: "Flutter / React / Tauri", icon: "📱", y: 1.15 },
  { name: "服务层 (Go)", tech: "Gin + Redis + MySQL", icon: "⚙️", y: 2.15 },
  { name: "引擎层 (Node.js)", tech: "openclaw + Hono", icon: "🧠", y: 3.15 },
  { name: "能力层", tech: "gstack (23) + agency (179)", icon: "💪", y: 4.15 }
];

archLayers.forEach((layer, i) => {
  // 层级标签
  slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: layer.y, w: 2.8, h: 0.85,
    fill: { color: colors.primary },
    rectRadius: 0.05
  });

  slide5.addText(layer.icon + " " + layer.name, {
    x: 0.5, y: layer.y, w: 2.8, h: 0.85,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: colors.white, bold: true, align: "center", valign: "middle"
  });

  // 技术描述
  slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.5, y: layer.y, w: 6, h: 0.85,
    fill: { color: colors.white },
    rectRadius: 0.05,
    shadow: makeShadow()
  });

  slide5.addText(layer.tech, {
    x: 3.7, y: layer.y, w: 5.6, h: 0.85,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: colors.text, valign: "middle"
  });

  // 连接线
  if (i < archLayers.length - 1) {
    slide5.addShape(pptx.shapes.LINE, {
      x: 1.9, y: layer.y + 0.85, w: 0, h: 0.3,
      line: { color: colors.accent, width: 2, dashType: "dash" }
    });
  }
});

// 通信协议说明
slide5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 5.15, w: 9, h: 0.4,
  fill: { color: colors.white },
  rectRadius: 0.05
});

slide5.addText("📡 通信协议：WebSocket/HTTPS + gRPC + REST API", {
  x: 0.5, y: 5.15, w: 9, h: 0.4,
  fontSize: 12, fontFace: "Microsoft YaHei",
  color: colors.text, align: "center", valign: "middle"
});

// ============================================================
// 第6页：核心功能
// ============================================================
let slide6 = pptx.addSlide();
slide6.background = { color: colors.light };

// 标题栏
slide6.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide6.addText("04 核心功能：六大核心能力", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 功能网格
const features = [
  { icon: "⚡", title: "即时ACK", desc: "100ms内确认收到消息，告知排队位置", color: colors.success },
  { icon: "📋", title: "任务队列", desc: "多任务管理，P0-P3优先级调度", color: colors.secondary },
  { icon: "📊", title: "进度可视化", desc: "实时任务进度推送，4种显示模式", color: colors.accent },
  { icon: "🔧", title: "技能系统", desc: "23个gstack工程技能，即插即用", color: colors.warning },
  { icon: "🤖", title: "智能体", desc: "179个专家角色，多Agent协作", color: colors.primary },
  { icon: "🔒", title: "私有化部署", desc: "完全自主，数据不出公网", color: colors.danger }
];

features.forEach((feat, i) => {
  const x = 0.5 + (i % 3) * 3.1;
  const y = 1.2 + Math.floor(i / 3) * 2.15;

  // 卡片
  slide6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 2.9, h: 2.0,
    fill: { color: colors.white },
    rectRadius: 0.1,
    shadow: makeShadow()
  });

  // 顶部色条
  slide6.addShape(pptx.shapes.RECTANGLE, {
    x: x, y: y, w: 2.9, h: 0.08,
    fill: { color: feat.color }
  });

  // 图标
  slide6.addText(feat.icon, {
    x: x, y: y + 0.2, w: 2.9, h: 0.6,
    fontSize: 32, align: "center"
  });

  // 标题
  slide6.addText(feat.title, {
    x: x, y: y + 0.8, w: 2.9, h: 0.4,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: colors.primary, bold: true, align: "center"
  });

  // 描述
  slide6.addText(feat.desc, {
    x: x + 0.2, y: y + 1.25, w: 2.5, h: 0.6,
    fontSize: 10, fontFace: "Microsoft YaHei",
    color: colors.lightText, align: "center"
  });
});

// ============================================================
// 第7页：gstack技能 (23个)
// ============================================================
let slide7 = pptx.addSlide();
slide7.background = { color: colors.light };

// 标题栏
slide7.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide7.addText("05 gstack技能 (23个)", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 技能分类
const skillCategories = [
  { cat: "需求规划", count: 3, skills: "/office-hours\n/plan-ceo-review\n/plan-eng-review", color: colors.secondary },
  { cat: "代码执行", count: 3, skills: "/review (代码审查)\n/qa (自动化测试)\n/qa-only", color: colors.accent },
  { cat: "部署发布", count: 3, skills: "/ship (发布)\n/land-and-deploy\n/canary (金丝雀)", color: colors.success },
  { cat: "安全审计", count: 1, skills: "/cso\nOWASP Top 10 + STRIDE", color: colors.danger },
  { cat: "网络请求", count: 1, skills: "/browse\n真实浏览器自动化", color: colors.warning },
  { cat: "调试分析", count: 1, skills: "/investigate\n问题调查调试", color: colors.primary },
  { cat: "设计创意", count: 3, skills: "/design-consultation\n/design-shotgun\n/design-html", color: "805AD5" },
  { cat: "办公集成", count: 6, skills: "/github /jira\n/confluence /slack\n/linear /notion", color: "00B5D8" }
];

skillCategories.forEach((cat, i) => {
  const x = 0.4 + (i % 4) * 2.4;
  const y = 1.15 + Math.floor(i / 4) * 2.2;

  // 分类卡片
  slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 2.25, h: 2.0,
    fill: { color: colors.white },
    rectRadius: 0.08,
    shadow: makeShadow()
  });

  // 分类标签
  slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.1, y: y + 0.1, w: 2.05, h: 0.45,
    fill: { color: cat.color },
    rectRadius: 0.05
  });

  slide7.addText(cat.cat + " (" + cat.count + ")", {
    x: x + 0.1, y: y + 0.1, w: 2.05, h: 0.45,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: colors.white, bold: true, align: "center", valign: "middle"
  });

  // 技能列表
  slide7.addText(cat.skills, {
    x: x + 0.15, y: y + 0.65, w: 1.95, h: 1.25,
    fontSize: 8, fontFace: "Microsoft YaHei",
    color: colors.text
  });
});

// ============================================================
// 第8页：agency智能体 (179个)
// ============================================================
let slide8 = pptx.addSlide();
slide8.background = { color: colors.light };

// 标题栏
slide8.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide8.addText("06 agency智能体 (179个)", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 智能体分类
const agentDepts = [
  { dept: "工程部", count: 30, examples: "前端/后端/DevOps/AI工程师", color: colors.secondary },
  { dept: "营销部", count: 34, examples: "小红书/抖音/公众号运营", color: colors.accent },
  { dept: "专业化", count: 34, examples: "Prompt工程师/数据分析师", color: colors.primary },
  { dept: "游戏开发", count: 20, examples: "Unity/Unreal/Godot专家", color: colors.warning },
  { dept: "设计部", count: 8, examples: "UI/UX/品牌/视觉设计", color: "805AD5" },
  { dept: "产品部", count: 5, examples: "产品经理/Sprint排序师", color: colors.success },
  { dept: "数据部", count: 15, examples: "BI/数据工程/算法", color: "E53E3E" },
  { dept: "其他", count: 33, examples: "HR/法务/供应链/支持", color: "00B5D8" }
];

agentDepts.forEach((dept, i) => {
  const x = 0.4 + (i % 4) * 2.4;
  const y = 1.15 + Math.floor(i / 4) * 2.15;

  // 分类卡片
  slide8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: y, w: 2.25, h: 2.0,
    fill: { color: colors.white },
    rectRadius: 0.08,
    shadow: makeShadow()
  });

  // 数量圆圈
  slide8.addShape(pptx.shapes.OVAL, {
    x: x + 0.7, y: y + 0.15, w: 0.85, h: 0.85,
    fill: { color: dept.color }
  });

  slide8.addText(dept.count.toString(), {
    x: x + 0.7, y: y + 0.15, w: 0.85, h: 0.85,
    fontSize: 22, fontFace: "Arial",
    color: colors.white, bold: true, align: "center", valign: "middle"
  });

  // 部门名
  slide8.addText(dept.dept, {
    x: x, y: y + 1.1, w: 2.25, h: 0.35,
    fontSize: 13, fontFace: "Microsoft YaHei",
    color: colors.primary, bold: true, align: "center"
  });

  // 示例
  slide8.addText(dept.examples, {
    x: x + 0.1, y: y + 1.45, w: 2.05, h: 0.5,
    fontSize: 8, fontFace: "Microsoft YaHei",
    color: colors.lightText, align: "center"
  });
});

// ============================================================
// 第9页：性能与安全指标
// ============================================================
let slide9 = pptx.addSlide();
slide9.background = { color: colors.light };

// 标题栏
slide9.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide9.addText("07 性能与安全指标", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 性能指标
const perfMetrics = [
  { metric: "API QPS", value: "1000+", unit: "请求/秒", color: colors.success },
  { metric: "API延迟P99", value: "<200ms", unit: "", color: colors.accent },
  { metric: "并发连接", value: "10000+", unit: "WebSocket", color: colors.secondary },
  { metric: "SLA可用性", value: "99.9%", unit: "", color: colors.primary }
];

perfMetrics.forEach((m, i) => {
  const x = 0.5 + i * 2.4;

  slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.15, w: 2.2, h: 1.7,
    fill: { color: colors.white },
    rectRadius: 0.1,
    shadow: makeShadow()
  });

  // 顶部色条
  slide9.addShape(pptx.shapes.RECTANGLE, {
    x: x, y: 1.15, w: 2.2, h: 0.08,
    fill: { color: m.color }
  });

  slide9.addText(m.value, {
    x: x, y: 1.4, w: 2.2, h: 0.8,
    fontSize: 32, fontFace: "Arial",
    color: m.color, bold: true, align: "center"
  });

  slide9.addText(m.unit, {
    x: x, y: 2.1, w: 2.2, h: 0.3,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: colors.lightText, align: "center"
  });

  slide9.addText(m.metric, {
    x: x, y: 2.45, w: 2.2, h: 0.3,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: colors.text, align: "center"
  });
});

// 安全特性
slide9.addText("🔒 安全特性", {
  x: 0.5, y: 3.1, w: 9, h: 0.5,
  fontSize: 18, fontFace: "Microsoft YaHei",
  color: colors.primary, bold: true
});

const secFeatures = [
  { title: "JWT认证", desc: "Access Token 15min + Refresh Token 7d" },
  { title: "TLS 1.3", desc: "全链路HTTPS加密" },
  { title: "AES-256", desc: "本地数据加密存储" },
  { title: "WireGuard", desc: "ChaCha20-Poly1305隧道加密" }
];

secFeatures.forEach((sec, i) => {
  const x = 0.5 + i * 2.4;

  slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 3.6, w: 2.2, h: 1.3,
    fill: { color: colors.white },
    rectRadius: 0.08,
    shadow: makeShadow()
  });

  slide9.addText(sec.title, {
    x: x, y: 3.75, w: 2.2, h: 0.4,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: colors.primary, bold: true, align: "center"
  });

  slide9.addText(sec.desc, {
    x: x + 0.1, y: 4.2, w: 2.0, h: 0.6,
    fontSize: 10, fontFace: "Microsoft YaHei",
    color: colors.text, align: "center"
  });
});

// 资源限制
slide9.addText("📊 资源限制：单任务超时5分钟 | 并发任务10个/用户 | 向量记忆10000条/用户", {
  x: 0.5, y: 5.1, w: 9, h: 0.4,
  fontSize: 11, fontFace: "Microsoft YaHei",
  color: colors.lightText, align: "center"
});

// ============================================================
// 第10页：开源与商业化
// ============================================================
let slide10 = pptx.addSlide();
slide10.background = { color: colors.light };

// 标题栏
slide10.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide10.addText("08 开源与商业化", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// MIT开源协议卡片
slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 1.2, w: 4.4, h: 3.9,
  fill: { color: colors.white },
  rectRadius: 0.1,
  shadow: makeShadow()
});

// MIT徽章
slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 1.5, y: 1.5, w: 2.4, h: 0.6,
  fill: { color: colors.success },
  rectRadius: 0.05
});

slide10.addText("MIT License", {
  x: 1.5, y: 1.5, w: 2.4, h: 0.6,
  fontSize: 18, fontFace: "Arial",
  color: colors.white, bold: true, align: "center", valign: "middle"
});

slide10.addText("100% 开源", {
  x: 0.5, y: 2.3, w: 4.4, h: 0.5,
  fontSize: 24, fontFace: "Microsoft YaHei",
  color: colors.primary, bold: true, align: "center"
});

const openSourcePoints = [
  "✓ 完整源代码开放",
  "✓ 社区自由使用",
  "✓ 自由修改和分发",
  "✓ 无使用限制",
  "✓ 商业用途免费"
];

slide10.addText(
  openSourcePoints.map((p, i) => ({ text: p, options: { breakLine: i < openSourcePoints.length - 1 } })),
  {
    x: 0.8, y: 2.9, w: 4, h: 2.0,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: colors.text,
    paraSpaceAfter: 8
  }
);

// 商业化方向卡片
slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 5.1, y: 1.2, w: 4.4, h: 3.9,
  fill: { color: colors.secondary },
  rectRadius: 0.1
});

slide10.addText("商业化方向", {
  x: 5.1, y: 1.5, w: 4.4, h: 0.6,
  fontSize: 24, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, align: "center"
});

const bizPlans = [
  { title: "P1 私有化部署支持", desc: "企业级私有化部署服务\n专业技术支持", priority: "P1" },
  { title: "P2 企业增强", desc: "高级功能和企业支持服务\n定制化开发", priority: "P2" }
];

bizPlans.forEach((biz, i) => {
  const y = 2.3 + i * 1.5;

  slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.4, y: y, w: 3.8, h: 1.3,
    fill: { color: colors.white, transparency: 20 },
    rectRadius: 0.08
  });

  slide10.addText(biz.priority, {
    x: 5.5, y: y + 0.1, w: 0.6, h: 0.4,
    fontSize: 12, fontFace: "Arial",
    color: colors.white, bold: true
  });

  slide10.addText(biz.title, {
    x: 6.1, y: y + 0.1, w: 2.9, h: 0.4,
    fontSize: 14, fontFace: "Microsoft YaHei",
    color: colors.white, bold: true
  });

  slide10.addText(biz.desc, {
    x: 5.5, y: y + 0.55, w: 3.6, h: 0.7,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: "DDDDDD"
  });
});

// 底部说明
slide10.addText("💡 商业化将在产品上线后讨论", {
  x: 0.5, y: 5.2, w: 9, h: 0.3,
  fontSize: 12, fontFace: "Microsoft YaHei",
  color: colors.lightText, align: "center"
});

// ============================================================
// 第11页：开发路线图
// ============================================================
let slide11 = pptx.addSlide();
slide11.background = { color: colors.light };

// 标题栏
slide11.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide11.addText("09 开发路线图 (16周)", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 时间线主轴
slide11.addShape(pptx.shapes.LINE, {
  x: 1.0, y: 2.0, w: 8, h: 0,
  line: { color: colors.accent, width: 4 }
});

const milestones = [
  { week: "W1-2", title: "环境搭建", desc: "Go + Node.js\nDocker Compose", done: true },
  { week: "W3-4", title: "API层开发", desc: "REST API\nWebSocket", done: false },
  { week: "W5-6", title: "引擎集成", desc: "openclaw\nAgent管理", done: false },
  { week: "W7-8", title: "核心技能", desc: "gstack 23\n技能集成", done: false },
  { week: "W9-10", title: "智能体", desc: "agency 30\n智能体", done: false },
  { week: "W11-12", title: "客户端MVP", desc: "Web端\n基础UI", done: false },
  { week: "W13-14", title: "部署测试", desc: "Docker\n压力测试", done: false },
  { week: "W15-16", title: "V1.0发布", desc: "正式发布\n社区运营", done: false }
];

milestones.forEach((m, i) => {
  const x = 1.0 + i * 1.1;

  // 节点圆圈
  slide11.addShape(pptx.shapes.OVAL, {
    x: x - 0.15, y: 1.85, w: 0.3, h: 0.3,
    fill: { color: m.done ? colors.success : colors.lightText }
  });

  // 周次
  slide11.addText(m.week, {
    x: x - 0.4, y: 1.35, w: 0.8, h: 0.35,
    fontSize: 10, fontFace: "Arial",
    color: colors.primary, bold: true, align: "center"
  });

  // 标题
  slide11.addText(m.title, {
    x: x - 0.5, y: 2.3, w: 1.0, h: 0.4,
    fontSize: 10, fontFace: "Microsoft YaHei",
    color: colors.text, bold: true, align: "center"
  });

  // 描述
  slide11.addText(m.desc, {
    x: x - 0.6, y: 2.7, w: 1.2, h: 0.8,
    fontSize: 8, fontFace: "Microsoft YaHei",
    color: colors.lightText, align: "center"
  });
});

// 目标卡片
slide11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.5, y: 3.8, w: 9, h: 1.5,
  fill: { color: colors.white },
  rectRadius: 0.1,
  shadow: makeShadow()
});

slide11.addText("🎯 V1.0目标", {
  x: 0.7, y: 4.0, w: 8.6, h: 0.4,
  fontSize: 16, fontFace: "Microsoft YaHei",
  color: colors.primary, bold: true
});

const goals = [
  "✅ 私有化AI智能中枢完整产品",
  "✅ gstack 23技能 + agency 30智能体",
  "✅ 即时ACK + 任务队列 + 进度可视化",
  "✅ Docker一键部署"
];

slide11.addText(
  goals.map((g, i) => ({ text: g, options: { breakLine: i < goals.length - 1 } })),
  {
    x: 0.7, y: 4.4, w: 8.6, h: 0.8,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: colors.text
  }
);

// ============================================================
// 第12页：竞品对比
// ============================================================
let slide12 = pptx.addSlide();
slide12.background = { color: colors.light };

// 标题栏
slide12.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide12.addText("竞品对比分析", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 竞品对比表格
const compData = [
  ["产品", "架构", "部署", "多Agent", "记忆", "商业化"],
  ["灵枢", "Go+Node.js", "私有化优先", "193+", "三层架构", "支持"],
  ["AutoGPT", "纯Python", "云为主", "有限", "简单向量", "不支持"],
  ["LangChain", "纯Python", "云为主", "有限", "简单向量", "不支持"],
  ["Dify", "Python", "开源可部署", "较弱", "向量检索", "不支持"],
  ["Coze", "云服务", "云为主", "有限", "有限", "不支持"]
];

slide12.addTable(compData, {
  x: 0.5, y: 1.2, w: 9, h: 3.0,
  colW: [1.5, 1.8, 1.5, 1.2, 1.5, 1.5],
  border: { pt: 0.5, color: "CCCCCC" },
  fontFace: "Microsoft YaHei",
  fontSize: 10,
  color: colors.text,
  align: "center",
  valign: "middle"
});

// 差异化优势
slide12.addText("✨ 灵枢差异化优势", {
  x: 0.5, y: 4.4, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Microsoft YaHei",
  color: colors.primary, bold: true
});

const advantages = [
  "🏗️ Go+Node.js混合架构：高性能+灵活性",
  "🔒 私有化优先：数据完全自主",
  "🤖 193+智能体：业界领先规模",
  "🧠 三层记忆架构：短期+长期+向量"
];

slide12.addText(
  advantages.map((a, i) => ({ text: a, options: { breakLine: i < advantages.length - 1 } })),
  {
    x: 0.5, y: 4.85, w: 9, h: 0.7,
    fontSize: 12, fontFace: "Microsoft YaHei",
    color: colors.text
  }
);

// ============================================================
// 第13页：团队架构
// ============================================================
let slide13 = pptx.addSlide();
slide13.background = { color: colors.light };

// 标题栏
slide13.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.0,
  fill: { color: colors.primary }
});

slide13.addText("开发团队 (9人标准)", {
  x: 0.5, y: 0.2, w: 9, h: 0.6,
  fontSize: 28, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, margin: 0
});

// 团队角色
const teamRoles = [
  { role: "main", count: 2, tasks: "需求+产品+协调", color: colors.primary },
  { role: "coding", count: 4, tasks: "前端+后端开发", color: colors.secondary },
  { role: "testing", count: 2, tasks: "功能+集成测试", color: colors.accent },
  { role: "ops", count: 1, tasks: "部署+运维+监控", color: colors.success }
];

teamRoles.forEach((role, i) => {
  const x = 0.5 + i * 2.4;

  slide13.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 1.2, w: 2.2, h: 2.5,
    fill: { color: role.color },
    rectRadius: 0.1
  });

  slide13.addText(role.count + "人", {
    x: x, y: 1.4, w: 2.2, h: 0.7,
    fontSize: 32, fontFace: "Arial",
    color: colors.white, bold: true, align: "center"
  });

  slide13.addText(role.role.toUpperCase(), {
    x: x, y: 2.1, w: 2.2, h: 0.4,
    fontSize: 14, fontFace: "Arial",
    color: colors.white, bold: true, align: "center"
  });

  slide13.addText(role.tasks, {
    x: x + 0.1, y: 2.6, w: 2.0, h: 0.8,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: "DDDDDD", align: "center"
  });
});

// 开发流程
slide13.addText("📋 开发流程", {
  x: 0.5, y: 4.0, w: 9, h: 0.4,
  fontSize: 16, fontFace: "Microsoft YaHei",
  color: colors.primary, bold: true
});

const flowSteps = ["需求确认", "PRD评审", "任务分配", "开发执行", "测试验收", "部署上线"];

flowSteps.forEach((step, i) => {
  const x = 0.5 + i * 1.6;

  slide13.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: x, y: 4.5, w: 1.4, h: 0.6,
    fill: { color: colors.accent },
    rectRadius: 0.05
  });

  slide13.addText(step, {
    x: x, y: 4.5, w: 1.4, h: 0.6,
    fontSize: 11, fontFace: "Microsoft YaHei",
    color: colors.white, bold: true, align: "center", valign: "middle"
  });

  if (i < flowSteps.length - 1) {
    slide13.addText("→", {
      x: x + 1.4, y: 4.5, w: 0.2, h: 0.6,
      fontSize: 16, color: colors.lightText, align: "center", valign: "middle"
    });
  }
});

// ============================================================
// 第14页：联系我们
// ============================================================
let slide14 = pptx.addSlide();
slide14.background = { color: colors.primary };

// 装饰形状
slide14.addShape(pptx.shapes.OVAL, {
  x: -1.5, y: -1.5, w: 5, h: 5,
  fill: { color: colors.secondary, transparency: 60 }
});

slide14.addShape(pptx.shapes.OVAL, {
  x: 7, y: 3, w: 5, h: 5,
  fill: { color: colors.accent, transparency: 50 }
});

// 感谢文字
slide14.addText("感谢关注", {
  x: 0.5, y: 1.5, w: 9, h: 1,
  fontSize: 56, fontFace: "Microsoft YaHei",
  color: colors.white, bold: true, align: "center"
});

slide14.addText("灵枢 AIBody", {
  x: 0.5, y: 2.6, w: 9, h: 0.6,
  fontSize: 32, fontFace: "Microsoft YaHei",
  color: colors.accent, align: "center"
});

// 分隔线
slide14.addShape(pptx.shapes.LINE, {
  x: 3, y: 3.4, w: 4, h: 0,
  line: { color: colors.white, width: 1, transparency: 50 }
});

// 链接信息
const links = [
  { icon: "🐙", text: "github.com/isatk/AIBody" },
  { icon: "🐞", text: "gitee.com/lotusisatk/aibody" },
  { icon: "📧", text: "lotus@lingxu.ai" }
];

links.forEach((link, i) => {
  slide14.addText(link.icon + "  " + link.text, {
    x: 0.5, y: 3.7 + i * 0.5, w: 9, h: 0.4,
    fontSize: 16, fontFace: "Microsoft YaHei",
    color: colors.white, align: "center"
  });
});

// MIT协议
slide14.addText("MIT License | 2026", {
  x: 0.5, y: 5.0, w: 9, h: 0.3,
  fontSize: 12, fontFace: "Microsoft YaHei",
  color: colors.lightText, align: "center"
});

// 保存文件
const outputPath = "G:/CodeBuddy/灵枢/ppt/灵枢AIBody-产品介绍v2.pptx";
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log("PPT已生成: " + outputPath);
  })
  .catch(err => {
    console.error("生成失败:", err);
  });
