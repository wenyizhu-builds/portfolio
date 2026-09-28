# Wenyi Zhu Portfolio — Claude 版需求摘要

- 版本：v0.6 · 2026-09-27（v0.1–v0.5 同日）
- 来源：Renee 在 Claude 会话中的确认；基于 `career/cases/wip/portfolio-prototype-handoff-2026-09-26.md`（Codex handoff，本文件不修改它）。
- 写入授权：Renee 于 2026-09-27 授权 Claude 在 `portfolio-prototypes/claude/` 下工作。不修改 `portfolio/`、`portfolio-prototypes/codex/`、canonical career 文件。
- 标记：✅ 已确认 · 🟡 Claude 提案待确认 · ⬜ 待 Renee 提供

## 1. 定位与读者

- ✅ 读者：未来雇主（营销 / 增长 / PMM / AI 公司等，范围宽）。
- ✅ Renee 希望同时体现增长 mindset 与 creative 能力；AI 是独立分支，并与营销分支相连。
- ✅ 公开署名：全名 **Wenyi Zhu**。
- ✅ 文案用第一人称、有亲和力，不模仿参考站的艺术家式口吻。
- ✅ 首屏不放一整句介绍，进来就是地图；完整介绍放在 Information 卡片。
- 🟡 名字下方加一行短身份标签（如 “Growth Marketer · Creative Strategist”），供招聘方数秒内判断。
- 🟡 Information 卡片开场草稿（第一人称）：
  > Hi, I'm Wenyi. I'm a growth marketer who thinks like a creative — I turn audience insight into stories that actually convert, across English, Japanese and Chinese markets. Lately, I've been building AI workflows to make that work faster and smarter.

## 2. 地图结构

```
● Wenyi Zhu（中心形状待定）
├─ Growth Marketing
│   ├─ Paid Social & Creative Strategy → UA Creative Strategy · Xbox Launch Paid Campaign
│   ├─ UGC & Influencer → Influencer Activation · Organic UA Testing (TikTok GIP)
│   ├─ Account Growth → ZZZ JP Creator-Account Growth · Genshin EN Social Growth
│   └─ Campaigns → Giveaway & Cross-Platform · Interactive Filter · Landing Page Gamification
├─ AI → AI Marketing Workbench · 预留作品位（“Showcase in preparation”）
├─ Creative Work（名称待定）→ Photography · Design · Video & Editing · AI Creative Videos
└─ Information → About · 经历路径 · Education · Contact
```

- ✅ 结构来自 Renee 手绘草图，保留“按工作类型分支”。
- ✅ 不单独设 movies & shows / 语言节点（无产出，不够专业）。
- ✅ 摄影、设计、剪辑、AI 创意视频合并为一个输出型分支。
- 🟡 子分支命名与案例分配如上。
- 🟡 虚线关系：AI Workbench ↔ Paid Social & Creative Strategy；AI Creative Videos ↔ AI。
- 🟡 Information 内经历按时间连线呈现成长路径：校刊 → NOWNESS → Weber Shandwick → Nike → UChicago / Seminary Co-op → HoYoverse。
- 🟡 跨市场能力：案例卡片带市场标签（JP / NA / EU…），语言写入 Information。
- ⬜ 原 content creation（AI 内容账号）归属：Creative Work / AI / 暂不放。

## 3. 节点形状

- ✅ 中心用星号 ✳（不用五角星）。星号是全站最亮、最吸引人的点；任何状态下点它都回到全局。
- 🟡 分支：实心圆 ● · 营销案例：方块 ■ · AI 项目：菱形 ◆（准备中用虚线轮廓）· 经历/教育：空心圆 ○ · Creative 作品：待定。
- 🟡 连线：实线 = 属于；虚线 = 相关。角落放小图例。

### 3b. 原型 v2 反馈后的形状与连线（2026-09-27）

- ✅ 大节点不能全是圆形，要像图表一样多样。
- 🟡 当前形状：星号 = 我；带数字六边形 = 领域 / 方向（数字 = 里面的作品数）；黑色实心点 = Information；方块 = 营销案例（重点案例中心有闪烁小点）；圆 = AI 项目；三角 = 创意作品；小圆 = 经历；五边形 = 教育。准备中的作品用虚线轮廓。
- ✅ 连线不要全是直线：改为带折角的线（参考站风格）；虚线 = 跨分支关联。
- ✅ 首页也挂出重点案例（UA Creative Strategy、ZZZ、AI Workbench），增加疏密变化。
- ✅ 工作经历改为一条时间链，避免连线交叉重叠。
- ✅ 右侧卡片垂直居中、高度随内容自适应；地图自动缩放，始终完整显示在可用区域内。
- ✅ 顶栏：“Resume ↗”“Let's talk ↗”（不用 Résumé 重音写法）；名字不加粗，整体字重统一。

### 3c. 原型 v3–v8 决定（2026-09-27）

- ✅ 展开逻辑一致：案例只有点开所属方向才出现；首页不单独挂案例。
- ✅ 只突出 Growth Marketing：六边形为钴蓝色边；其他节点不做重点标记。
- ✅ 星号 = 便利贴开关：首页进入时便利贴展开（一句话 + 关键数字），点星号收起 / 再打开；蓝色虚线连到星号。
- ✅ 地图可拖动空白处 / 触控板滑动平移；点节点自动回到该节点。
- ✅ 顶栏：wenyi zhu ✳ ｜ 中文 · Resume ↗ · Let's talk ↗；名字不加粗。
- ✅ 地图缩放有下限，焦点节点始终清晰可点。
- 🟡 招聘方视角最大问题 = 证据太深（需点 3 层才看到数字）。已改：每个案例有一个 headline 结果数字，显示在地图节点下、卡片标题下（大号钴蓝）、领域卡片的作品清单里。数字取自 case 文件，写法待 Renee 确认。

### 3d. 原型 v9–v17 决定（2026-09-27）

- ✅ 首页默认布局：Creative Work 在上、Growth Marketing 在右、AI 在下、Information 在左；距离有远有近。
- ✅ Experience 放回 Information 下、默认折叠（v17 曾升为独立领域，已撤回）；Creative Work 首页默认折叠。
- ✅ 删除校刊（Student Magazine）经历；经历中真正重点展示的是 HoYoverse。
- ✅ 去掉 Contact 节点：联系方式是功能入口，只放在顶栏 “Let's talk ↗”。
- ✅ 节点有大有小（重要的更大）；连线用第一版折线；删除线仅在分组内全部看过后出现。
- ✅ HoYoverse 与 Growth Marketing / AI Workbench 关联；案例卡片显示所属经历。
- ✅ 顶部横向介绍条（一句话 + 4 个关键数字），名字旁 ✳ 可收起；地图只在内容被遮挡时可移动。

## 4. 交互（桌面 / 平板）

- ✅ 单页、只有地图（无 List 视图、无 Map/List 切换）。
- ✅ 节点可拖动，带物理弹性动效（参考站同类效果）。
- 🟡 首屏显示两层：中心 + 主分支 + 子分支；案例节点点开子分支后出现。
- 🟡 点分支：地图以该分支为中心重排，显示子节点与虚线关系，右侧卡片显示分支简介。
- ✅ 案例卡片默认只显示摘要；细节为简单文字。
- 🟡 卡片结构：标题 · 一句话摘要 · 市场标签 → 可折叠“My role / What I did / Results（含口径）/ Connections”。卡片内部滚动，文字不另开弹窗。
- 🟡 活动图片放在画布空白处（地图与卡片之间的固定区域）；打开案例时地图缩小靠左，图片不压节点。点图 → 大图浏览（唯一弹层），Esc/点空白关闭。
- 🟡 同时只开一张卡片；点名字或返回键回全局；每个节点有独立 URL（可分享、可后退）。
- 🟡 无障碍：键盘可操作、可见焦点、Esc 关闭；系统“减少动态效果”时关闭物理动画。

## 5. 手机端

- ✅ 必须能在手机上打开（招聘方常从 LinkedIn 在手机上点开链接）。
- ✅ Renee 认可手机端用另一种形态，不照搬桌面交互。
- ✅ 手机端放弃地图交互，改为单页滚动浏览；地图在手机上变成菜单（Renee 决定，覆盖原 handoff 对小屏的建议）。桌面端仍只有地图，无切换。
- 参考站同样如此：≤768px 时隐藏地图，只显示 Index。

## 6. 视觉

- ✅ 简洁、清晰、留白多；借鉴参考站交互与简洁，不照抄 UI。
- ✅ 配色方向：蓝 / 酸性绿 / 粉等印刷感颜色，降低饱和度与亮度；温暖、亮眼、专业，creative but not too edgy。参考：印刷品/Riso 色块、mizukihanada.com、estudiocarlocanun.com。
- ✅ 方向：白 / 浅灰白底 + 黑为主色，高级简洁、专业、时髦，不要儿童感和过强印刷感。
- ✅ 颜色逻辑学参考站：整站几乎只有黑、灰、白；常驻彩色只有中心星号；其他颜色只在选中时出现。
- ✅ 当前倾向：钴蓝 `#2F4BFF` + 荧光绿 `#D4FF3A` 组合。🟡 星号 = 钴蓝；选中节点 = 荧光绿（黑描边）。是否每种类型各有颜色：开发中再定。
- 🟡 远近关系用黑/灰区分；看过的节点标题加删除线；荧光绿不作文字色。
- ✅ 不做深色模式。

## 6b. 动效（参考站实测，2026-09-27）

- 地图持续轻微漂浮：力导向布局不完全静止，节点每十几秒缓慢位移数像素。
- 中心标志持续慢速旋转（参考站 10 秒一圈）。
- 推荐/重点节点有 1 秒节奏的闪烁小标记，提示可点击。
- 首次进入地图有约 3 秒的淡入；新出现的节点 1 秒淡入。
- 悬停：节点放大 10%，标签浮现。
- 拖动：按住时节点跟随、周围节点被带动，松手后回到自然位置。
- 参考站参数（仅作手感参考，不复制代码）：连线强度弱、节点互斥较强且有作用距离上限、整体居中。
- 🟡 我们沿用这些手感；系统“减少动态效果”时关闭漂浮、旋转与闪烁。

## 6c. Résumé 与 Contact

- ✅ 需要让雇主快速找到线性履历与联系方式。
- 🟡 方案：顶栏右侧常驻 “Résumé · Contact · EN/CN”。点 Résumé 在右侧卡片打开按时间倒序的履历（每段经历可跳到地图上对应节点）+ PDF 下载；点 Contact 打开联系方式卡片。这是卡片内容，不是第二种浏览模式。
- 🟡 Information 分支里的经历节点与 Résumé 卡片互通。
- 🟡 手机端：Résumé 与 Contact 放在菜单顶部。
- ⬜ 是否提供 PDF 下载、用哪一版简历；公开邮箱。

## 7. 语言

- ✅ 英文为主，中文为辅；顶栏 EN / CN 切换。
- ⬜ 中文覆盖范围（全站 / 主要内容）。

## 8. 内容与证据边界

- ✅ 先出原型：用现有案例公开版摘要 + 占位开发，文字与图片后续逐个替换（内容集中在一个数据文件，替换不影响代码）。

- ✅ 具体作品、图片、文字由 Renee 逐个提供，逐步开发。
- 案例卡片只用各 case 文件 `Current Working Case` 的公开版摘要；保留 led / supported 区分、日期与数据口径。
- AI Workbench：不写“AI 让 ROI 提升 164%”；工具交付与版本间业务变化分开陈述。
- 不包含内部数据、完整报告、私人求职信息；没有素材的地方用明确的占位，不用假截图。
- ⬜ AI project 1 / 2 的名称、一句话描述、完成状态。
- ⬜ Creative Work 可公开素材清单。
- ⬜ Contact 渠道（LinkedIn 已知：https://www.linkedin.com/in/wenyi-zhu-mktg/ ；邮箱待提供）。

## 9. 技术与发布

- ✅ 纯前端展示网站，无后端；尽量轻。
- 🟡 Vite + TypeScript + d3-force；构建产物为静态文件。
- ✅ 发布：GitHub Pages（Renee 选择；同时展示会用 GitHub）。节点 URL 用 hash（如 `#/growth/ua-creative-strategy`），兼容 GitHub Pages。
- ✅ 全部在 Claude 会话中开发，不转 Claude Code；文件存放于本文件夹。
- ✅ 必须能在网络上打开，各种窗口宽度自适应，手机可用。

## 10. 验收标准（框架阶段，草案）

1. 桌面：地图 + 卡片 + 图片区可用；节点可拖动；分支/案例点击路径最多两步。
2. 平板与各种窗口宽度自适应，无横向滚动。
3. 手机：按已确认的手机形态可浏览全部内容。
4. EN / CN 切换可用（未翻译内容有明确占位）。
5. 顶栏 Résumé / Contact 任意状态一次点击可达。
6. 所有占位清楚区分 “Showcase in preparation” 与 “Planned project”。
7. 构建为静态文件，可部署到 GitHub Pages。
