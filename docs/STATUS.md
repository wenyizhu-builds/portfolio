# STATUS — 现在做到哪了

> **每次工作结束时覆盖更新这一份**，不另写 handoff。历史进度看 `CHANGELOG.md`。
> 最后更新：2026-09-28 · 版本 v51

## 现在的状态

- 框架、交互、视觉已定稿（见 `SPEC.md`）。v32 按参考站重做了交互模型：INDEX 常驻，选中时不放大。**下一阶段只填内容**。
- 在线预览：claude.ai 私密 artifact「Wenyi Zhu Portfolio」。
- 尚未发布到 GitHub Pages。
- v31 完成了一轮全面审查和修 bug（见 `CHANGELOG.md`），并建立了防护机制：
  - `npm run check`：每次 build 前自动运行
  - `docs/LESSONS.md`：错误记录和对应规则
- 上线门槛：`npm run check -- --launch` 目前**不通过**（这是预期的），原因：
  - 邮箱和简历 PDF 还没有
  - 还有 13 处 `[Placeholder]` / `[Draft]`
  - `site.launched` 为 false

## v48–v51 说明
- v51：撤回形态保持（回到每次重新布局）；说明文字改黑色。
- **版本管理**：项目文件夹已是 git 仓库，每次交付都提交一次，`git log` 看历史，回退用 `git checkout <提交号> -- <文件>`。尚未推到 GitHub（需要先在 claude.ai 设置里连接 GitHub）。
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
