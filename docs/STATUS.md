# STATUS — 现在做到哪了

> **每次工作结束时覆盖更新这一份**，不另写 handoff。历史进度看 `CHANGELOG.md`。
> 最后更新：2026-10-07 · v69.6 · 分支 `flagship-restructure`（未合并 main）

## 新会话先看这里（交接）

**2026-10-07 交接（v69.2）。用户对上一个会话的文案质量不满意（"写作明显变差"），所以换新会话。先读下面的 L47 和「写作偏好」，再动笔。**

### v69.5–69.6（本会话，用户 10-07 下午的决定）
- 用户：MiniMax、Kimi 加入，去掉小云雀；改名 **Xiaohongshu AI Channel**；Creator & Social 一句话说明她确认了；Workbench 要宣传片。她说上一版文案"把她做的事缩成细节清单，没写出策略层的大图"——这两个案例已按 CONTENT 原始资料重写（见 CHANGELOG v69.5）。**AI Projects 就这两个**（Dashboard + Workbench）；作品集网站本身算 vibe coding，但她觉得单独成案偏弱，暂不加。
- **下一步（她定的）：从 UX 角度整体审一遍网站，改 UI 和用户路径。**
- Workbench 宣传片（v69.6）：21 秒，同看板的风格/节奏/音乐/音效；开场 "I turned my content workflow / into an **AI workbench**"，5 段：Research what’s working · Break down any post · Score every idea first · AI drafts, I approve · Learns what works；结尾 Creator Workbench · Built with Claude Code and Codex。海报 = 最后一帧（覆盖原 poster.jpg，不增加文件数）。Artifact 文件数 510/511。源文件：云端 `/home/claude/srv/video/film.html`（+ app.html = 原型副本，加了 `window.WB` 钩子、本地字体）、`/home/claude/promo-wb/`（render.cjs、audio7.py）；Mac 副本在 `portfolio-prototypes/creator-workbench-promo/`。

### v69.3–69.4（本会话）
- 同步了她 10-07 上午在编辑器里的改动：AI tagging 去掉 "with a human review step"；Test and scale 缩短；删掉 "Follower conversion over views"。
- Dashboard 的 40% 下面加一行灰字（她选的 A）："I built it from scratch while running creative strategy for Genshin Impact's creator ads."——字段 `headline.note`（content.ts 类型已加，blocks.ts `figure()` 渲染，样式 `.p-fig-note`），编辑器里可改；存档 revision 1068 已写入。
- AI Creator Channel summary："An AI tutorial channel" → "An AI channel"（她确认）。

### 这几天做完的（都已推 GitHub、同步到 Mac、发布到预览 Artifact）
- **AI Creator Channel**（`xhs-ai-channel`，Creator & Social 第 6 个案例，排最后）：她的小红书账号 Renee学不停，是**副业（Side hustle）**，不是工作。身份行 "Side hustle"，地图批注 "my side hustle"，没有 The Challenge、没有 The Team。数字是账号总量（截至 2026-09-24）：**1.8M+ 播放**（小红书 ~1.11M + 抖音 ~749K）、**100K+ 点赞**、单条 287K。What I did 5 条：Positioning · Follower conversion over views（16×：动捕教程 14,449 播放 115 粉 vs 插画 20,677 阅读 10 粉）· Test and scale · Content operations system · Brand partnerships（Alibaba 千问、ByteDance 即梦和小云雀、LiblibAI、Lovart，来源 `CONTENT/40-commercial/brief-library/`）。
- **Creator Workbench**（`creator-workbench`，AI Projects 第 2 个，替换了第一个占位）：她的内容运营系统（Obsidian 工作台，Agent 做调研、素材解析、选题评分、制作、知识库）。还没开发完，**页面上不要提**。展示同看板：app 栏 + 灵箱里可点原型（`public/demo/workbench.html`，由 `scripts/workbench-en.py` 从 Mac `CONTENT/80-product-development/creator-workbench/prototypes/creator-workbench-v2.html` 生成英文版）；没有宣传片，视频位放 Home 屏 16:9 静图（点击打开原型）；手机版 8 张截图。与 AI Creator Channel 虚线相连。
- **地图**：筛选时点不再缩到 10px（`CAMERA.pointMin` 0.8，约 14px），标签也能点；相连的点在选中点外侧出生（不再从 ✳ 出生卡在线中间）。layout-check 1/38（只剩 hoyoverse 老问题）。
- **Creative Work 不改名**（用户定：老照片和设计不算 Content Creation）。

### 用户还没回答的问题
1. 五个品牌是不是都是付费合作，要不要加 MiniMax、Kimi 等（帖子标签里出现过）。
2. Creator Workbench 要不要做宣传片（像看板那样）。
3. Creator & Social 的一句话说明加了 "Xiaohongshu" 和 "Chinese audiences"，原句是她定的，改动她还没确认。
4. AI Creator Channel 标题备选：Xiaohongshu AI Channel / AI Channel on RedNote。

### 用户对文案的批评（这次会话，必须吸取）
- What I did 不能写成任务清单（"Data loop""Format""Monetisation: Paid partnerships with AI product brands"）。要写**策略层**：怎么定位、怎么用数据调整策略、怎么测试再放大、怎么用 AI 把流程做得更好；有名有姓（品牌名、具体倍数）。
- 不要缩小她的成就：她的账号不是 "tutorial channel"；7.5K → 14K 不够亮眼，用总量；品牌要说清是中国 AI 头部公司。
- 她口述的意思要提炼成更概括、更专业的说法，例如 "test formats and content, stop what doesn't work, double down on what works" → "Test and scale"。
- 先去 CONTENT 里找真材料（strategy.md、双周复盘、40-commercial、80-product-development），再写；不要凭第一份数据就写。

### 工作方式（基础设施）
- **版本源**：GitHub `wenyizhu-builds/portfolio`，分支 `flagship-restructure`（未合并 main）。云端要 push：先在会话里 add_repo（push 权限，需用户批准），clone 到 `/home/claude/portfolio`，commit + push。
- **同步到 Mac**：Mac 能连 GitHub（2026-10-05 测过）。先申请 JS_workspace 的删除权限（L36），然后在 `~/Desktop/JS_workspace/portfolio-prototypes/claude` 里 `git fetch origin flagship-restructure && git merge --ff-only origin/flagship-restructure`。两边提交号一致。
- **Mac 的 node_modules 是 macOS 的**，在 Mac 的 Linux shell 里跑不了构建；构建、截图、layout-check 都在云端做（`npm ci` 后 `npm run build:file`；Playwright 用 `/opt/pw-browsers/chromium`）。
- **编辑器存档**：用户在编辑器（双击 `Open Editor.command`）的修改存在 `.copy-editor/archive.json`（不进 git）。开工先比对存档和 `src/published-copy.json`；我改了文案后，把同样的 edits 写回存档（`revision + 1`）。What I did 的蓝色关键词在 published-copy.json 的 `blueRanges`。
- **预览**：`https://claude.ai/artifact/K7QJV2bfsK5neKBpxHuzwX`，发布 `preview.html`，新图片/页面用 `files` 带上。一个版本最多 511 个文件，现在 508，**几乎满了**：加图前先想办法腾位置（原型截图已不做 `-t` 小图）。
- 用户不会用终端；需要她做的事只能是"双击某个文件"这种程度。
- 资料位置：她的小红书账号和 Workbench 在 Mac `~/Desktop/CONTENT`（需申请文件夹权限）；JD 语言库在 `JS_workspace/career/job-targets/research-handoffs/2026/JDR-20260911-001__market-scan__independent-overseas-career-research/jd-language-bank-2026-09-28.md`。

## 当前状态

- **Creative Intelligence Dashboard（v64.8，布局 C，用户从三个预览里选的）**：点开 `ai-workbench`，电脑版地图折叠；宣传片（v64.15 已上线：`public/media/ai-workbench/promo.webm` + `promo.mp4`，静音自动播放一次、不循环，结束时显示重播；v64.16 自带控制条（`src/video.ts`：播放/暂停、可点击和拖动的进度条、方向键 ±5 秒、时间、声音按钮），鼠标移上去、暂停或结束时显示；打开原型或离开这一页时暂停；减少动态效果时不自动播放。本地测试要用支持 Range 请求的服务器（`/tmp/claude-0/rserve.cjs`），否则拖进度条会跳回开头）紧挨卡片（间距 48px，顶边与 INDEX 条对齐，最宽 960px，main.ts `placeProto`），上方一条 app 栏（v64.9 移到视频上方，v64.10 视频顶边对齐 INDEX、app 栏在其上方；图标 · 名称 · "Clickable prototype · sample data" · "Try the prototype" 按钮），点击在站内唯一的灯箱里打开原型（lightbox.ts `openFrame`，L44），灯箱最大为原型原尺寸或屏宽 80%，下方一行说明。卡片里**不放屏幕列表、没有 The Team、Connections 只连 Creator Ad Pipeline**。用户在编辑器改的文案已同步：headline 40% … & production；**summary 被她删空（v64.11 已去掉）**；身份行改为两个标签 Vibe Coding · Claude Code（与案例标签同一样式）；What it does 默认展开（section `open: true`）。手机版 = 8 张截图横滑。原型页 `public/demo/dashboard.html`；源文件在 Mac `portfolio-prototypes/dashboard-redesign/`；改原型后要重出 demo 页和 8 张截图（截图用本地字体）。
  - 文案（用户定）：从零独立用 Claude Code 搭建；"UA teams use it in their work"；headline 30–40% less time on creative analysis（用户确认准确）；明确写"display prototype with sample data… get in touch"。英文用地道 UA 术语（用户强调）。
  - 宣传片（v7，21 秒，用户确认上线）：无旁白；开场一句 "I built a tool to identify / winning creatives and scale them."（用户定，"winning creatives" 荧光绿），然后 5 个功能（AI breaks down every ad / Spot the winning formula / Turn it into scripts / Plan the next campaign / Learns from every round），结尾 Creative Intelligence Dashboard · Built with Claude Code；左下角极小一行 "Display prototype. All data shown is sample data."。画面是 v1 的平稳镜头（用户否决了 3D 运镜和动态图形版 v3）。音乐 = 电钢琴和弦 + 轻鼓（用户说比之前好）；音效为真实录音：Kenney Interface Sounds + Kenney UI Audio（CC0，GitHub Calinou/kenney-interface-sounds、kenney-ui-audio；鼠标点击 mouseclick1/mouserelease1，打字用 click1–5 + switch1–8 随机），开场与结尾的低音和铃声仍是合成。源文件：云端 `/home/claude/promo/video/`（film.html → render2.cjs 出帧，audio7.py 出声音，素材在 `/home/claude/promo/sfx/`），Mac 副本在 `portfolio-prototypes/dashboard-redesign/promo/`（各版 mp4 + 源文件）。
  - 打字声可再换成真实键盘录音（OpenGameArt 的 Keyboard Soundpack #1，CC0，8.5 MB）：云端和 Mac 都连不上 opengameart.org，需要用户自己下载放进 `dashboard-redesign/promo/`。

- **只做英文版**（v64，用户：没时间校对中文）。中文开关已从电脑版和手机版去掉，`readLang()` 固定返回 'en'；zh 文案留在 content.ts 不用，以后不必再写中文。

- **Creative Work 图库（v63.7：电脑版为最初的相册排法，手机版每组一行左右滑）**：Photography 7 组 125 张（黄石 35 · 日本 17 · 欧洲 20 · 武汉 12 · 芝加哥 19 · 纽约 14 · 亚利桑那 8），Design = X Mirror 第二期 36 页 + 7 张电影放映海报。用户已用管理页删减和上传过一轮（v63.3），并亲手拖动排好了顺序（v63.6，以她的顺序为准，不要再自动重排）。用户说先这样放，之后告诉我删哪些：她会用联系表编号（如 p4-12、d1-18）点名，在 `src/gallery-images.ts` 删对应行和 `public/media/<组>/` 下的两个文件（`NN.jpg`、`NN-t.jpg`）。联系表和挑选表在 Mac 的 `portfolio-prototypes/_review/`（`index.tsv` = 编号 → 原文件路径），定稿后删掉这个文件夹。
  - 原图在 Mac「~/Desktop/Design & photography」（只读用，不改）。新加照片时三种尺寸都要做：900 预览 `-t`、1600、2400 `-l`（原图长边 >1700 才做 `-l`，宽度写进 gallery-images.ts 每行第 5 项）。生成网页版的脚本思路：PIL 读原图 → 长边 1600 / 900、去 EXIF、质量 82。
  - 黄石：不要写 "home"（那是乡下，不是她住的地方），只写地点。X Mirror：她是主编，每期自己用 InDesign 排版。
  - v63.1：图库改成相册式排法（用户从 A 相册 / B 桌上照片 / C 大图 + 联系表 / D 胶片条 四个预览里选了 A；预览 Artifact `https://claude.ai/artifact/JpLNZ1CdtDsWgBSuQME9CF`）。每张下有编号，她也可以说「Japan 05」来点名。
  - **用户自己管理图库**：Artifact「Gallery Photo Manager」`https://claude.ai/artifact/MLqtmYFxUfWiXm1aZt1XCR`（db + assets）。她点图标记删除（db `removed/<set__file>`，含 tag），按「Add photos」上传新图（浏览器里缩到长边 2400、去 EXIF，存 assets，db `added/<id>` = {set, asset, name}；新系列的 set 为 `new:<名字>`），可留言（`notes/main`），可拖动排序（db `order/<set__key>` = {set, items:[ids]}，id 为现有文件 `set__NN` 或新图 `a:<added 行 id>`）。她说「photo changes are ready」时：用 ArtifactData 读三处 → 删 `gallery-images.ts` 对应行和文件 → 用 Artifact read `path=<asset id>` 下载新图，做 1600 / 900 两份加进对应组（新系列在 content.ts 加 `set(...)`）→ 构建、发布、同步 → 清空 db 里已处理的行，并重新发布管理页（缩略图换成最新）。
  - 未决："p six two"（她要删的一张，可能是 p6-12 或 p6-32），两张目前都在。

- 案例分两大类，直接挂在 ✳ 下（v62.31，已去掉 Growth Marketing 节点）：**Paid & UA Growth**（Creator Ad Pipeline ★ · TikTok UGC Channel Test ★ · Xbox Launch Paid Campaign · Gamified Landing Page）和 **Creator & Social**（Zenless Zone Zero: Social Launch in Japan ★ · X Creator Campaign · Cross-Platform Community Giveaway · TikTok & Snapchat Branded Filter Campaign · English Social Channel Growth）。首页两组折叠，只露出 ★ 和批注；点开一组显示全部案例。v62.32：Branded Filter 也是 ★（首页带 600M+ 批注），首页间距重排。v62.33–34：手写批注缩小（字号 20、线 1.2px），五条批注文字到箭头的间距统一。截图要加载真实手写字体（L37）。v62.35：首页 Information 也折叠，Creative Work 挪到它旁边，AI Projects 往左下。
- 9 个案例已按 JD 语言库润色（v62.29）：× / vs / benchmark 统一；英式拼写；Results 标签小写接在数字后。
- 两组的一句话说明已定稿（v63.12，用户选的 A）：Paid & UA Growth = "Data-backed creative testing for user acquisition: finding what drives installs, scaling what works and improving ROI."；Creator & Social = 原句，"players" 改为 "audiences"。用户偏好：概括句不用游戏行业词（用 users / installs / audiences，不用 players），她不只找游戏行业的工作；不写 CPI。
- **JD 语言库**在 Mac：`JS_workspace/career/job-targets/research-handoffs/2026/JDR-20260911-001__market-scan__independent-overseas-career-research/jd-language-bank-2026-09-28.md`。写文案时先查它。
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

- Creative Work / Photography / Design 说明已定稿（v64）：Creative Work = "Away from work, I love taking photos and designing things."；Photography = "Photos from my travels, grouped by place."；**Design 不写说明**（用户：那句话没意义，先空着）。**用户反馈：之前的草稿"做作、不像真人"。她要短、平实、像随口说的话；不要抒情、不要过度细节。她口述的意思要润色成地道英文，不要逐字照搬。** 她 2024 年后很少拿相机，现在多用手机拍，不要写"相机随身带""一直在拍"。
- **Genshin Impact / Zenless Zone Zero 的背景介绍**（读者可能不懂游戏）：建议放在 INDEX 简介里第一次提到 HoYoverse 的地方，一句话说明，例如 "HoYoverse, the studio behind Genshin Impact, one of the highest-grossing mobile games ever, and Zenless Zone Zero, which reached 50 million downloads in its launch weekend."（来源：PocketGamer.biz、Shacknews）。用户还没确认，和下面第 2 条 INDEX 简介一起改。
- 图库：等用户发来要删的编号，照删。

- 标题保持简短（用户偏好）：游戏名只放在卡片的身份行，不进标题（v62.46 已同步她改的三个标题）。

0. 首页布局已按用户在排版工具里摆的数值写入（v62.38）。以后要调首页：用排版工具 Artifact `https://claude.ai/artifact/TDYgQnYFQmTqbKHPZxXaMf`（= preview.html 第一个 `<script>` 前插入 `<script>window.__ARRANGE=true</script>` 再发布），让她拖好后发来「Copy layout」的 JSON，原样写回 `HOME_LAYOUT` / `NOTES`。v62.40：首页 AI Projects 的三个作品全部折叠。v62.41：用户第二次用排版工具摆的首页布局。

1. 用户在预览里看两组的结构和新文案，有意见再改。两组的一句话说明待她确认。
2. INDEX 个人简介（v64）：用户选了草稿 A，标 [Draft]，**最终版等她把其他内容都做完再写**。数字块（ix-stats）已整块删除——用户：地图批注已突出这些数字，不要重复。旧的那句粘贴笔记一起删了（published-copy.json 和编辑器存档都已改）。
3. 待用户确认的小问题：
   - Gamified Landing Page：测验概念和奖励机制是不是她提出的（是的话 Team 行写清楚，摘要去掉 "helped"）；标题。markets 为 NA + EU + JP（v62.44，全语言全球页面；不加 China）。
   - Branded Filter：markets 为 US/EU/JP（v62.44，用户：也合作了欧洲达人）；70+ 达人是否包括 14 位 Snap Stars。
   - 系统图在 file:// 预览里显示不出来（相对路径），发布到 Artifact 时用 `files` 带上图片就正常。
4. AI 案例（Dashboard 细节、"30–40% time saved" 放这里）。
5. 中文手写字体（可选 ZCOOL KuaiLe，未定）。
6. 个人账号案例已加（v65），见上方待确认项。之后英文账号做起来，也放进 Creator & Social，同样标 Personal project。
7. layout-check 0–2 处（v62.48，仅 ai-workbench 在从无关视图直接跳入时）；回首页一定回到用户摆的布局（L40）；经历视图里 ✳ → Information → Experience 的链条会往回折（早已存在），待单独处理。
8. 用户确认后再合并到 main。
