# STATUS — 现在做到哪了

> **每次工作结束时覆盖更新这一份**，不另写 handoff。历史进度看 `CHANGELOG.md`。
> 最后更新：2026-10-05 · v65 · 分支 `flagship-restructure`（未合并 main）· **v65 只在 Mac 上提交，还没推到 GitHub**（本会话云端连不上 GitHub）

## 新会话先看这里（交接）

- **v65（2026-10-05）小红书个人账号案例上线（预览）**。用户定：**不改名**——Creative Work 保持原样（摄影、设计是多年前的作品，不算 Content Creation）；小红书案例作为 **Creator & Social 的第 6 个案例**（`xhs-ai-channel`，排最后），并且必须和工作案例区分开：
  - 卡片身份行写 **Personal project**（工作案例这里是 "HoYoverse · Genshin Impact"），`org: ''` 所以不进 HoYoverse 经历；The Team = "Just me"。
  - 地图：Creator & Social 展开时，点旁边有手写批注 "my own channel"。自动批注改为箭头从侧面水平指向点（map.ts drawNotes，`NOTE.sideRise`），不再穿过点下方的标签。
  - Creator & Social 的一句话说明加了 Xiaohongshu 和 Chinese audiences（原句是用户定的，改动待她确认）。
  - 数据来源：Mac `~/Desktop/CONTENT`（账号 Renee学不停）：8/10 7,125 粉，9/10 7,528；9/9 子弹时间教程视频 287K 播放、4.1K 涨粉（`50-data-pipeline/raw-assets/account-metrics/2026-09-24/xiaohongshu-export.json`）；14K 是用户口述的现在粉丝数。
  - **待用户确认**：14K 是否准确；TikTok 约 2K 指的是抖音还是国际版 TikTok（卡片现写 Douyin）；"Just me"；"Data loop" 那条说的看板是不是她指的那个。
  - 另一个会话曾做过「单独的 Content Creation 组」版本（未提交），已按用户新决定改掉。
- v64.20：两套显示逻辑——开着地区筛选时点任何点，地图保持完整筛选视图（map.ts `picked` 与 `focus` 分开：`focus = filtering() ? null : picked`），只高亮并开卡片；不筛选时照旧收窄。
- v64.19：地图防重叠——按地区筛选时展开的组排成扇形；线都从下方来的点，标签移到上方。layout-check 现在也查 4 个地区筛选和「线穿过自己的标签」，37 个视图共 1 处（HoYoverse 视图里 Seminary Co-op 到 Nike 的线擦过自己的标签，经历链条的拐角，低于上限 3）。删除线是「已看过」标记，不是线。
- 上一个会话（v64.x）做完了：看板原型 + 宣传片（v7，已上线，自带控制条）。宣传片源文件在 Mac `portfolio-prototypes/dashboard-redesign/promo/source/`。

- **版本源**：GitHub `wenyizhu-builds/portfolio`，分支 `flagship-restructure`。云端副本和 Mac 文件夹 `~/Desktop/JS_workspace/portfolio-prototypes/claude` 树（`HEAD^{tree}`）一致（v64）。Mac 能连上 GitHub（2026-10-05 测过），但 Mac 和云端默认都没有 GitHub 登录；推送要先在会话里加 repo（push 权限，需用户批准），再在云端 push。
- **Mac 上跑 git 之前**先申请删除权限（L36），否则 git 留下 `.git/index.lock` 删不掉。
- **同步到 Mac 的做法**：云端 `git commit` + `git push` → `git format-patch [--binary] -1` → 传到 Mac 的 `portfolio-prototypes/` → 在 `claude/` 里 `git am --3way` → 比对 `git rev-parse HEAD^{tree}` 与云端一致。
- **编辑器**：用户双击 `claude/Open Editor.command` 打开本地编辑器（localhost:5173）。用户在编辑器里的修改存在 `claude/.copy-editor/archive.json`（不进 git），**不会**自动进入 `src/published-copy.json`。每次开工先比对存档和 published-copy 的差异，把用户新改的内容同步过来（v62.8、v62.20 都这样做过）；我改了文案后，也把同样的 edits 写回存档（`revision + 1`，用临时文件 + `os.replace`）。
- **预览**：`npm run build:file` 生成 `preview.html`，发布到 Artifact `https://claude.ai/artifact/K7QJV2bfsK5neKBpxHuzwX`；新图片要用 `files` 一起发布。一个版本最多 511 个文件（现约 486）：图片改名/删除后，用 `files` 里写 `null` 删掉旧路径；每次发布最多 255 个文件、64MB，大批要分两次。
- **构建命令**：`set -o pipefail; npm run build:file 2>&1 | tail -1 && git commit …`（L35：不要让管道吞掉失败）。
- 用户不会用终端；需要她做的事只能是"双击某个文件"这种程度。

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
