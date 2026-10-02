# STATUS — 现在做到哪了

> **每次工作结束时覆盖更新这一份**，不另写 handoff。历史进度看 `CHANGELOG.md`。
> 最后更新：2026-10-02 · v62.28 · 分支 `flagship-restructure`（未合并 main）

## 新会话先看这里（交接）

- **版本源**：GitHub `wenyizhu-builds/portfolio`，分支 `flagship-restructure`。云端副本和 Mac 文件夹 `~/Desktop/JS_workspace/portfolio-prototypes/claude` 提交号一致（v62.28）。
- **同步到 Mac 的做法**：云端 `git commit` + `git push` → `git format-patch [--binary] -1` → 传到 Mac 的 `portfolio-prototypes/` → 在 `claude/` 里 `git am --3way` → 比对 `git rev-parse HEAD^{tree}` 与云端一致。
- **编辑器**：用户双击 `claude/Open Editor.command` 打开本地编辑器（localhost:5173）。用户在编辑器里的修改存在 `claude/.copy-editor/archive.json`（不进 git），**不会**自动进入 `src/published-copy.json`。每次开工先比对存档和 published-copy 的差异，把用户新改的内容同步过来（v62.8、v62.20 都这样做过）；我改了文案后，也把同样的 edits 写回存档（`revision + 1`，用临时文件 + `os.replace`）。
- **预览**：`npm run build:file` 生成 `preview.html`，发布到 Artifact `https://claude.ai/artifact/K7QJV2bfsK5neKBpxHuzwX`；新图片要用 `files` 一起发布。
- **构建命令**：`set -o pipefail; npm run build:file 2>&1 | tail -1 && git commit …`（L35：不要让管道吞掉失败）。
- 用户不会用终端；需要她做的事只能是"双击某个文件"这种程度。

## 当前状态

- Growth 分支：三个旗舰（白方块，带手写批注）+「More cases」（6 个，放射状展开）。筛选（平台 + 地区）在左上角，网址可分享；手机版为下拉框。
- **所有 9 个案例文案已写完第一稿**：
  - 旗舰：Creator Ad Pipeline · Zenless Zone Zero: Social Launch in Japan · TikTok UGC Incentive Program
  - More cases：Xbox Launch Paid Campaign · X Creator Campaign · Cross-Platform Community Giveaway · EN Social Channel Growth · TikTok & Snapchat Branded Filter Campaign（原 Interactive Filter）· Gamified Landing Page（原 Landing Page Gamification）
- 新功能 `links`（v62.15）：摘要下方一行灰色外链。Branded Filter（TikTok 活动页 + 达人视频示例）、Giveaway（Instagram 达人视频）、Gamified Landing Page（活动页，已去掉个人邀请码）。
- 浮动活动海报：X Creator（Moonlit Support）、Branded Filter（Lantern Rite）、Gamified Landing Page（Blaze to Natlan）。
- X Creator 和 Giveaway 在 More cases 里相邻（同类活动，Giveaway 是 X Creator 的对照基准）；试过虚线关联，用户觉得混淆，已去掉。
- 全站规则（都有 `check`）：Results 每条一行 ≤45 字符（L32）；不写游戏版本号（L33）；不用 "cost per install" / "repeated"（L30）。

## 用户在这次会话里定下的写作偏好（新会话必须遵守）

- **What I did 要短、直接、只写最重要的事**；用增长/营销专家的说法（如 hook、viral loop、benchmark），不要流水账式细节（例如不要列"quizzes, recaps, referral pages"）。
- 不要重复同一个意思或同一个短语（同一案例里 "took part, not just saw it"、"official channels" 这类不能出现两三次）。
- 读者零背景：不用内部或少见的术语（"third-party community" → "the biggest fan account on X"；"Branded Effect" → "branded filter"；"quote-post participation" 要说清楚是什么）。
- 对比对象不说具体是哪个页面/活动，统一说 "benchmark"。
- 不放可以留到面试说的细节（例如 1B+ impressions）。
- 链接文字：用 "Creator video example"、"Event page" 这类，只放一个最好的例子。

## 下一步（用户 2026-10-02 会话结束时定的顺序）

1. **全部案例复查与润色**：先读 JD 语言库 `~/Desktop/JS_workspace/career/job-targets/research-handoffs/2026/JDR-20260911-001__market-scan__independent-overseas-career-research/jd-language-bank-2026-09-28.md`，再逐个复查 9 个案例（摘要、挑战、What I did、Results、Team），统一措辞、去重复、按上面的写作偏好压缩 What I did，最后整体综合。
2. **讨论案例的组织方式（先讨论，不直接动手）**：用户的初步想法是去掉「More cases」，改成两个大类——**Growth Marketing** 和 **Social Campaigns**（整合社媒活动）。她明确表示欢迎任何反馈：新会话应结合她的目标岗位（英国 Creative Strategist / Growth Marketing / AI-enabled growth，见 memory 的 job-search 和 JD 语言库）给出几种组织方案和利弊，和她讨论后再定。定下来后先写进 SPEC（L14），再改地图、INDEX、手机版、筛选、`HOME_LAYOUT`、`NOTES`，改完跑 layout-check。
3. 待用户确认的小问题：
   - Gamified Landing Page 标题（备选 "Interactive Quiz Landing Page"）；测验题目是否真的以纳塔为背景；markets 是 "Global"，地区筛选匹配不到。
   - Branded Filter：markets 用了 US/JP（旧版有 SEA）；70+ 达人是否包括 14 位 Snap Stars。
   - "600M+ views" 手写批注在新长标题旁边可能挤，用户如果看到再挪。
4. Growth Marketing 总述 → INDEX 个人简介（旧数字 1%→15% 等仍在；More cases 描述里还有 "[Placeholder copy]"，结构定下来后一起重写）。
5. AI 案例（Dashboard 细节、"30–40% time saved" 放这里）。
6. 中文手写字体（可选 ZCOOL KuaiLe，未定）。
7. 暂缓：个人账号案例（小红书约 14k + TikTok 约 2k，AI 工具教程；dashboard = CONTENT/80-product-development/creator-workbench 原型；等用户给账号名和细节）。
8. 已知问题：layout-check 3–4 处，集中在 HoYoverse 和 AI Workbench 视图（早于 v62），超出 2 处上限，待单独处理。
9. 用户确认后再合并到 main。
