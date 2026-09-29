# STATUS — 现在做到哪了

> **每次工作结束时覆盖更新这一份**，不另写 handoff。历史进度看 `CHANGELOG.md`。
> 最后更新：2026-09-29 · 版本 v61（用户批准提交 GitHub）

## 本轮交付

- 用户确认返回 INDEX 的闪动已解决，并授权将 v55–v61 累积修改提交至 GitHub main。
- build:file 通过；本次是仓库同步，不发布 GitHub Pages。下方各版本“未推送”是当时的迭代记录。
- 字体层级蓝色分组标题仅生成预览，未实施，不包含在本次代码交付中。

## 本轮限定 UI 修改

- v61：针对回 INDEX 延迟换行，固定滚动条占位，修正高度未计边框问题。build:file 通过；尚未完成浏览器动态回归，需确认实际闪动消失；未推送。

- v60：统一取消有 Results 案例的顶部数字摘要，保留简介，UA 高亮移入 Results；核对 9 个营销案例原 headline 数据均保留于结果或简介。build:file 通过，未推送。

- v59：详情正文/Results 默认同时展开，各区块独立折叠；INDEX 互斥逻辑不变。build:file 通过；未推送，未实施尚待批准的字体层级提案。

- v58：9 个营销案例统一“公司 · 项目”身份行、地区/平台 tags、独立日期；桌面和手机共用 blocks.ts。逐项数据断言及 build:file 通过；视觉验收待确认，未推送。

- v57：按用户要求恢复列表圆点，并将 What I did、Results、目录末级条目的圆点统一为 `--muted` 灰色；数字保留蓝色。build:file 通过，未推送。

- v56 已按进一步批准全站取消正文缩进、数字说明同行、9 个营销案例 Results 共用排版、移除重复角色行；加节点白底和首次进场动画。覆盖 v55 的两列 Results 方案。

- 已按批准范围调整 INDEX 高亮/数字/缩进、案例 tags/headline、UA Results，并删除 UA 的重复角色行。
- 地图节点 hover 使用荧光绿，选中态不变。地图布局与原折叠逻辑未改。
- `npm run build:file` 通过；本地 5173 预览进程存在。
- 浏览器视觉验收尚未完成：此前本地浏览器访问受工具安全限制，不绕过；请 Wenyi 在现有预览中确认。本轮未推送 GitHub。
- 下一步先验收本轮 UI，再继续下方文案工作。

## 现在的状态

- 框架、交互、视觉已定稿（见 `SPEC.md`）。v32 按参考站重做了交互模型：INDEX 常驻，选中时不放大。**下一阶段只填内容**。
- v54 将网站配色统一为 Winnie Lab 品牌色：paper 背景、电光钴蓝、酸性荧光绿、ink 与银灰派生线条；布局和交互没有变化。
- 在线预览：claude.ai 私密 artifact「Wenyi Zhu Portfolio」。
- 尚未发布到 GitHub Pages。
- v31 完成了一轮全面审查和修 bug（见 `CHANGELOG.md`），并建立了防护机制：
  - `npm run check`：每次 build 前自动运行
  - `docs/LESSONS.md`：错误记录和对应规则
- 上线门槛：`npm run check -- --launch` 目前**不通过**（这是预期的），原因：
  - 邮箱和简历 PDF 还没有
  - 还有 13 处 `[Placeholder]` / `[Draft]`
  - `site.launched` 为 false

## v48–v54 说明
- v54：从全屏柠檬黄 / 番茄红改为 Winnie Lab 的 paper / electric blue / acid lime 配色。
- v53：末级作品之间可以直接切换，兄弟保留在地图上。
- v52：右侧卡片列（INDEX 条、图片条、卡片）全部按高度缓动，去掉淡入；不再闪和抽。
- v51：撤回形态保持（回到每次重新布局）；说明文字改黑色。
- **版本管理**：GitHub `wenyizhu-builds/portfolio` 是唯一版本源；本地项目每次交付提交并推送，`git log` 看历史。
- v50：字体换 Schibsted Grotesk，正文 14px / 小号大写 11.5px；形态保持改为弹簧，轻微抖动。
- v49：同一大类里点击不再重排，形态保持；跨大类才重排。
- 地图的点、线已不重叠（layout-check：38 个视图 0 处）。**布局调优到此为止**，除非看到具体的坏视图，不再继续调参（见 LESSONS L25）。
- 已知小问题：从一个作品点到它的关联点时，个别视图会有一条虚线贴近链条，属于可接受范围。

## 下一步（按顺序）

1. **Information / Experience / Education** ← 下一个对话从这里开始
2. Growth Marketing（9 个案例的 headline、摘要、做了什么、结果、配图）
3. Creative Work（4 类作品和图片）
4. AI Projects（最后做，项目还在进行中）
5. 收尾：
   - INDEX 简介和 4 个关键数字定稿
   - 邮箱和简历 PDF
   - 中文翻译
   - 去掉 PROTOTYPE 标签
   - 按最终内容微调间距
   - 发布到 GitHub Pages

### 第 1 步的草稿（待你确认）

**Information**：

> Hi, I'm Wenyi. I spent the last three years in global marketing at HoYoverse on Genshin Impact — paid social, creators and campaigns for English- and Japanese-speaking players. I'm a growth marketer who thinks like a creative: I start from what an audience actually responds to, and turn it into creative that moves the numbers. Lately I've been building AI tools to make that loop faster.

**Experience**：

> From PR and social internships in China, to marketing in the US, to three years in global marketing at HoYoverse.

**Education**：

> A master's in the humanities at UChicago, and a communication degree at XJTLU.

### 第 1 步待你回答的问题

1. 网站上要不要写求职方向和地点，比如 "looking for growth marketing roles, UK"？
2. 英语、日语、中文分别是什么水平？
3. HoYoverse 的正式职位名称是什么？
4. 四段实习每段写 2–3 条"做了什么"，需要事实和数字（career 文件夹里的简历应该都有）。
5. 教育部分要不要加研究方向、论文或荣誉？

## 还没决定的小事

- 源码的正本要不要搬到 GitHub 仓库，方便以后只在云端开发。
- "准备中"的作品算不算进六边形里的数字：目前 Creative Work 显示 4，但 4 个都在准备中。
- 顶栏 "Resume ↗ / Let's talk ↗" 的 ↗ 通常表示外链，实际打开的是站内面板。之前按你的要求保留了。

- 较早的几段实习要不要合并成一个 "Earlier" 节点。
- 首页要不要显示 HoYoverse↔Growth 的虚线。
- 要不要关掉单个点的拖动。
