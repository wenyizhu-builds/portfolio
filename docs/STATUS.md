# STATUS — 现在做到哪了

> **每次工作结束时覆盖更新这一份**，不另写 handoff。历史进度看 `CHANGELOG.md`。
> 最后更新：2026-10-02 · v62.47 · 分支 `flagship-restructure`（未合并 main）

## 新会话先看这里（交接）

- **版本源**：GitHub `wenyizhu-builds/portfolio`，分支 `flagship-restructure`。云端副本和 Mac 文件夹 `~/Desktop/JS_workspace/portfolio-prototypes/claude` 树（`HEAD^{tree}`）一致（v62.47）。Mac 上连不到 GitHub，只能在云端 push。
- **Mac 上跑 git 之前**先申请删除权限（L36），否则 git 留下 `.git/index.lock` 删不掉。
- **同步到 Mac 的做法**：云端 `git commit` + `git push` → `git format-patch [--binary] -1` → 传到 Mac 的 `portfolio-prototypes/` → 在 `claude/` 里 `git am --3way` → 比对 `git rev-parse HEAD^{tree}` 与云端一致。
- **编辑器**：用户双击 `claude/Open Editor.command` 打开本地编辑器（localhost:5173）。用户在编辑器里的修改存在 `claude/.copy-editor/archive.json`（不进 git），**不会**自动进入 `src/published-copy.json`。每次开工先比对存档和 published-copy 的差异，把用户新改的内容同步过来（v62.8、v62.20 都这样做过）；我改了文案后，也把同样的 edits 写回存档（`revision + 1`，用临时文件 + `os.replace`）。
- **预览**：`npm run build:file` 生成 `preview.html`，发布到 Artifact `https://claude.ai/artifact/K7QJV2bfsK5neKBpxHuzwX`；新图片要用 `files` 一起发布。
- **构建命令**：`set -o pipefail; npm run build:file 2>&1 | tail -1 && git commit …`（L35：不要让管道吞掉失败）。
- 用户不会用终端；需要她做的事只能是"双击某个文件"这种程度。

## 当前状态

- 案例分两大类，直接挂在 ✳ 下（v62.31，已去掉 Growth Marketing 节点）：**Paid & UA Growth**（Creator Ad Pipeline ★ · TikTok UGC Channel Test ★ · Xbox Launch Paid Campaign · Gamified Landing Page）和 **Creator & Social**（Zenless Zone Zero: Social Launch in Japan ★ · X Creator Campaign · Cross-Platform Community Giveaway · TikTok & Snapchat Branded Filter Campaign · English Social Channel Growth）。首页两组折叠，只露出 ★ 和批注；点开一组显示全部案例。v62.32：Branded Filter 也是 ★（首页带 600M+ 批注），首页间距重排。v62.33–34：手写批注缩小（字号 20、线 1.2px），五条批注文字到箭头的间距统一。截图要加载真实手写字体（L37）。v62.35：首页 Information 也折叠，Creative Work 挪到它旁边，AI Projects 往左下。
- 9 个案例已按 JD 语言库润色（v62.29）：× / vs / benchmark 统一；英式拼写；Results 标签小写接在数字后。
- 两组的一句话说明（`growth-paid` / `growth-social` 的 summary）是我起草的，用户还没看过。
- 用户偏好：画面要干净；她说节点数量不是问题，问题在间距。调地图时先看间距和批注位置。
- 筛选只剩地区（v62.42），在左上角，网址 `?region=` 可分享；手机版为一个下拉框。
- 全站规则（都有 `check`）：Results 每条一行 ≤45 字符（L32）；不写游戏版本号（L33）；不用 "cost per install" / "repeated"（L30）。

## 用户在这次会话里定下的写作偏好（新会话必须遵守）

- **What I did 要短、直接、只写最重要的事**；用增长/营销专家的说法（如 hook、viral loop、benchmark），不要流水账式细节（例如不要列"quizzes, recaps, referral pages"）。
- 不要重复同一个意思或同一个短语（同一案例里 "took part, not just saw it"、"official channels" 这类不能出现两三次）。
- 读者零背景：不用内部或少见的术语（"third-party community" → "the biggest fan account on X"；"Branded Effect" → "branded filter"；"quote-post participation" 要说清楚是什么）。
- 对比对象不说具体是哪个页面/活动，统一说 "benchmark"。
- 不放可以留到面试说的细节（例如 1B+ impressions）。
- 链接文字：用 "Creator video example"、"Event page" 这类，只放一个最好的例子。

- **英式拼写**（optimise、localised、behaviour、programme）。
- 对比一律写 benchmark；倍数用 ×；Results 标签小写。
- 不夸大角色：用户在 X Creator 案例里纠正过 "rebuilt"——那是新活动的新策略，不是重建；挑战部分的数字可以是事前预估（Xbox 的 100+），不必和结果数字一致。
- 提到她所在团队时说 "the Genshin Impact brand team"，不要说 "my team"。

## 下一步

- 标题保持简短（用户偏好）：游戏名只放在卡片的身份行，不进标题（v62.46 已同步她改的三个标题）。

0. 首页布局已按用户在排版工具里摆的数值写入（v62.38）。以后要调首页：用排版工具 Artifact `https://claude.ai/artifact/TDYgQnYFQmTqbKHPZxXaMf`（= preview.html 第一个 `<script>` 前插入 `<script>window.__ARRANGE=true</script>` 再发布），让她拖好后发来「Copy layout」的 JSON，原样写回 `HOME_LAYOUT` / `NOTES`。v62.40：首页 AI Projects 的三个作品全部折叠。v62.41：用户第二次用排版工具摆的首页布局。

1. 用户在预览里看两组的结构和新文案，有意见再改。两组的一句话说明待她确认。
2. INDEX 个人简介要一起改：`site.intro` 里有一句 "translate performance data into creative insights that inform iterations and new concepts"，像是从 JD 库粘贴进去的笔记（用户在编辑器里加的，没动）；关键数字 "1% → 15%" 与案例的 "0% → 15%" 不一致；"JP creator matrix" 是"矩阵"直译，应改为 "network of social channels"。Growth Marketing 节点已删，它的占位总述也一起删了。
3. 待用户确认的小问题：
   - Gamified Landing Page：测验概念和奖励机制是不是她提出的（是的话 Team 行写清楚，摘要去掉 "helped"）；标题。markets 为 NA + EU + JP（v62.44，全语言全球页面；不加 China）。
   - Branded Filter：markets 为 US/EU/JP（v62.44，用户：也合作了欧洲达人）；70+ 达人是否包括 14 位 Snap Stars。
   - 系统图在 file:// 预览里显示不出来（相对路径），发布到 Artifact 时用 `files` 带上图片就正常。
4. AI 案例（Dashboard 细节、"30–40% time saved" 放这里）。
5. 中文手写字体（可选 ZCOOL KuaiLe，未定）。
6. 暂缓：个人账号案例（小红书约 14k + TikTok 约 2k）。
7. layout-check 0 处（v62.47）；经历视图里 ✳ → Information → Experience 的链条会往回折（早已存在），待单独处理。
8. 用户确认后再合并到 main。
