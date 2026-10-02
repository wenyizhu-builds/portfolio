# STATUS — 现在做到哪了

> **每次工作结束时覆盖更新这一份**，不另写 handoff。历史进度看 `CHANGELOG.md`。
> 最后更新：2026-10-02 · v62.17 · 分支 `flagship-restructure`（未合并 main）

## 当前状态

- Growth 分支：三个旗舰（白方块，带手写批注）+「More cases」（6 个，放射状展开）。筛选（平台 + 地区）在左上角，网址可分享；手机版为下拉框。
- 文案已重写（第一稿，最后统一过一遍措辞）：
  - 旗舰：Creator Ad Pipeline · Zenless Zone Zero: Social Launch in Japan · TikTok UGC Incentive Program
  - More cases：Xbox Launch Paid Campaign · X Creator Campaign · Cross-Platform Community Giveaway · EN Social Channel Growth · Interactive Filter Campaign（v62.11，待用户确认）
- X Creator Campaign 和 Giveaway 在 More cases 里相邻；试过虚线关联，用户觉得容易混淆，已去掉（v62.14）。
- Interactive Filter：加了活动海报（浮动图）和三条外链（TikTok 活动页、两条达人视频），v62.15–62.17。
- 全站规则（v62.5–62.9）：Results 每条一行（≤45 字符，L32）；不写游戏版本号（L33）；均有 `check` 规则。
- 编辑器存档（Mac 本地）与 `src/published-copy.json` 已对齐；用户在编辑器里的 X Creator / Xbox 修改已应用（v62.8）。存档里还有 UA 的旧 `added-*` 条目，不在列表里、不显示。
- 暂缓（等用户提供细节）：个人账号案例——小红书约 14k + TikTok 约 2k 粉丝，AI 工具教程与教育；一年前开始、中断后回归一个月粉丝翻倍；辞职后全职做内容（gap year）；dashboard = CONTENT/80-product-development/creator-workbench 原型；账号名待提供。
- 已知问题：layout-check 3–4 处，集中在 HoYoverse 和 AI Workbench 视图（早于 v62，数值随布局随机略有浮动），超出 2 处上限，待单独处理。

## 下一步

1. Landing Page Gamification 文案。
2. Growth Marketing 总述 → INDEX 个人简介（旧数字 1%→15% 等仍在）。
3. AI 案例（Dashboard 细节、"30–40% time saved" 放这里）。
4. 全站措辞统一检查；中文手写字体（可选 ZCOOL KuaiLe，未定）。
5. 用户确认后再合并到 main。
