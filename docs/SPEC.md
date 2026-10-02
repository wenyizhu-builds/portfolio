# SPEC — 作品集网站的设计定稿

> **唯一的设计依据。** 改设计 = 直接改这份文件里对应的那一行（并在 `CHANGELOG.md` 记一笔），不要另开新文件。
> 最后更新：2026-10-02 · 对应版本 v62.35

- **首页再减（v62.35，用户要求）**：Information 在首页也折叠（`FOLDED_AT_HOME`），Education / Experience 只在点开 Information 时出现。Creative Work 挪到左边，紧挨 Information，两个都折叠；AI Projects 往左下移，「tools I built with AI」批注改到 AI Projects 右上方。

- **批注变小（v62.33）**：手写批注字号 27 → 20（`NOTE.size`），箭头头部 12 → 8，线宽 1.5px → 1.2px，让批注不抢地图的注意力。

- **2026-10-02 首页重新排布（v62.32）**：Branded Filter Campaign 也设为重点案例（`featured`），在 Creator & Social 里排第二，首页带「600M+ views」批注（位置改为 `NOTES` 手摆，只在首页显示；打开该组时不再显示这条批注）。首页坐标重排：各大类离 ✳ 距离相近，重点案例在所属大类外侧展开；批注放在不挡标签、不被面板边缘推回的一侧。点的数量不变（用户确认数量不是问题，是间距）。

- **2026-10-02 去掉 Growth Marketing 节点（v62.31，用户要求：节点太多，画面太满）**：Paid & UA Growth 和 Creator & Social 直接挂在 ✳ 下，是两个大类（`type: 'branch'`，都带钴蓝描边 `KEY_AREAS`）。首页两组折叠（`FOLDED_AT_HOME`），只显示各自的重点案例和批注；点开一组才显示全部案例。INDEX、手机版、手机目录里两组各占一节。HoYoverse 只用虚线连 AI Creative Intelligence Dashboard（案例在卡片的 Work from this role 里）。下面 v62.30 那条里关于「Growth Marketing 下分两组」的说法以此为准。

- **2026-10-02 案例分组（v62.30，用户选定方案 A，取代下面 2026-09-30 的「重点案例 + More cases」）**：Growth Marketing 下分两组，按目标岗位的两个 JD 家族命名——**Paid & UA Growth**（`growth-paid`：Creator Ad Pipeline ★、TikTok UGC Channel Test ★、Xbox Launch Paid Campaign、Gamified Landing Page）和 **Creator & Social**（`growth-social`：ZZZ Social Launch in Japan ★、X Creator Campaign、Cross-Platform Community Giveaway、Branded Filter Campaign、English Social Channel Growth）。不再有「More cases」和单独的「Flagship cases」列表。★ 重点案例仍是 `featured: true`，在组内排第一（`content.ts` 里的顺序就是展示顺序）。首页地图：显示两组，以及每组的重点案例（带手写批注），其他案例收在组里；打开 Growth Marketing 时同样显示重点案例。打开一组时，组内全部案例放射展开。INDEX、手机版、手机目录都按这两组列出。

- 2026-09-30 草稿（local/flagship-restructure，待批准）：Growth Marketing 下直接挂 3 个重点案例（UA Creative Strategy、ZZZ JP Account Growth、TikTok GIP，顺序见 `featuredOrder`）+「More cases」组（其余 6 个）。重点案例在地图上是实心黑色方块（选中时为荧光绿），尺寸与其他点相同；悬停只放大，不变色（含 ✳）；INDEX 与手机版同步为「Flagship cases / More cases」，列表不显示数量。打开一个末级作品时，兄弟节点保留但变灰。
- 案例卡片顺序：How it worked（重点案例的系统图，卡片内可点击放大）→ Results（默认展开）→ The Challenge / What I did / The Team（默认收起）。
- **地图手写批注（v55）**：红橙色（`--note`）、手写字体 Nanum Pen Script（`--hand`）、1.2px 干净箭头（v62.33 起；字号 20）。只批注值得看的地方，不重复标题。首页：三个重点案例 + AI 各一句（位置在 `map.ts` 的 `NOTES` 里手工摆放，只在首页显示）。Creator & Social：只在 Branded Filter 旁写「600M+ views」（不加框）（只在该组打开时显示，位置自动放在外侧）。打开某个案例时不显示它自己的批注。手机版不显示（手机没有地图）。文字在 `content.ts` 的 `note`。批注永远不被卡片、页头或窗口边缘挡住：超出地图空白区时自动挪回，挪得远时箭头重新指向该点。
- **筛选（v60）**：电脑版页头左上角一行纯文字（取代原来的名字），与右侧导航同高同字号：PLATFORM（Global social / Chinese social / Paid ads）+ REGION（North America / Europe / Japan / China）。不选 = 全部；再点一次取消。选中项蓝色下划线。匹配规则只有一处：`state.ts` 的 `matches()`——作品同时满足所选平台和地区；组里有任一匹配即匹配。选择筛选项时回到首页地图，所有匹配的作品自动展开（连同通往它们的分支），不匹配的变灰；首页手写批注在筛选时让位。INDEX 列表、手机卡片同样把不匹配的变灰。“准备中”的占位作品不匹配任何筛选。平台来自 `content.ts` 的 `platforms` 字段，地区由 `markets` 经 `regionOfMarket` 换算。选择写在网址里（`?platform=cn&region=jp`），可以把筛好的链接发给招聘方。手机版：页头下方两个下拉菜单（平台 / 地区，默认“全部”），选完自动滚到第一个匹配的案例（没有则到履历）。
- 图片规则：重点案例的系统图放在卡片「How it worked」里；其他案例 1–4 张图用地图空白处的浮动图；手机版每张卡片只放一张图：有系统图的案例只显示系统图，不显示浮动图；大量图片（摄影、设计等 20–30 张）将做成图库模式（待做）。不展示内部账号、素材截图或内部数据。

- v61：卡片滚动条固定占位（scrollbar-gutter: stable），高度测量计入边框，避免高度过渡中出现/消失滚动条引发二次换行；保留原高度缓动。

- v60：有 Results 的详情不再渲染顶部 headline，保留项目简介；数字集中于 Results，UA 的 15% 高亮移入对应结果并保留 UA spend 口径。无 Results 的 AI 项目及首页概览不变。headline 字段保留供地图使用。

- v59：详情卡片的正文区块（What I did 等）和 Results 默认同时展开、独立收起，不再互斥；Work from this role / Connections 仍默认收起但也不互斥。仅首页 INDEX 保留一次展开一个分类。字体层级渲染提案尚未实施。

- v58：所有案例使用共享身份块，按“公司 · 项目”顺序同一行展示；地区与平台全部使用 tags，自然换行；日期单独保留。9 个营销案例已填明确的项目和平台字段，不从展示文案自动推断。不改变正式工作经历职位或准备中状态。

- v57：恢复正文列表和末级条目的 bullet points，保留最小圆点缩进；桌面及手机端所有 bullet 使用 `--muted` 灰色，与目录圆点一致，数字仍为钴蓝。

### v56 全站同步修正（取代 v55 对应规则）

- 卡片正文统一无缩进：简介、More about me、身份/标题、摘要、分组列表、What I did、Results；区块标题仍保留图标。
- headline 和 Results 数字保持 18px，每条 Results（数字 + 说明）只占一行，最多 45 个字符（v62.5）。所有 9 个营销案例统一 Results 模板；保留原数字、比较口径、非数字结论。
- 不再渲染重复角色行；删除营销案例 Led/Supported 角色字段，保留正文里的职责事实以及工作经历正式职位。
- 普通地图形状白底；hover/focus/选中仍为荧光绿。星号和 Information 保持特殊形状。
- 首次进场：卡片 800ms 淡入并从下方 10px 到位；地图 3 秒从右方 10vw 到位，节点/连线 100ms 错峰显示。不改变最终坐标或切换案例的原交互。减少动态效果设置下跳过。

### v55 限定修改（优先于下方历史排版记录）

- INDEX：简介转化词荧光绿高亮；数字 18px，取消数字框与简介/数字网格缩进，保留 2×2。More about me 不变。
- 案例：地区使用小 tags；UA Creative Strategy 将 Google Ads 独立为 tag，Genshin Impact 保留为普通上下文，删除重复的 Led — UGC creative strategy。
- 案例 headline 数字 18px；UA 的 15% 荧光绿高亮。UA Results 数字和说明分列，数值与比较口径不变。
- 地图 hover / keyboard focus 与选中态使用同一荧光绿；离开后恢复原状态。中心名字星号 hover 变绿，默认仍为钴蓝。
- 不改地图布局、字体家族、其他字号、形状、标题层级、分隔线、媒体布局、路由或折叠逻辑。

### 全站案例 Challenge 栏（用户本轮授权）

- Growth Marketing 的全部 9 个案例在正文首位增加 `The Challenge`（中文标题：项目挑战），位于已有 `What I did` 之前，默认展开。内容取各 canonical case 的 Current Working Case 原文；桌面与手机复用 sections。尚无 What I did 的案例不自动补写该段。

## 1. 技术与文件分工

- Vite + TypeScript + d3-force，纯静态，hash 路由（`#/节点id`、`#/resume`、`#/contact`）。
- 修改入口（**只改这里，其余自动跟随**）：

| 要改什么 | 改哪里 |
|---|---|
| 首页每个点的位置 | `src/map.ts` 顶部 `HOME_LAYOUT`（`check` 会检查里面的 id 都存在） |
| 所有文字、案例、链接、中英文、分享描述 | `src/content.ts`（界面文字在 `ui`；`site.launched` / `site.metaDescription`） |
| 颜色 | `src/style.css` 顶部 `:root` 的 7 个基础色（`--bg --panel --ink --on-ink --cobalt --accent --note`；`--note` 红橙只用于地图手写批注），其余由 `color-mix()` 派生 |
| 版面尺寸、时长、手机断点 | `src/style.css` 顶部 `:root`，`main.ts` / `map.ts` 在运行时读取 |
| 镜头缩放和边距 | `src/map.ts` 顶部 `CAMERA` |
| 地图布局参数 | `src/map.ts` 顶部 `LAYOUT` / `SEED` / `AREA_DIST` / `WEIGHT` / `WEIGHT_BY_KIND` / `FOLDED_AT_HOME` |
| 形状、✳ 的各处尺寸 | `src/shapes.ts`（`shape()`、`AST`） |
| 面板和手机卡片里的内容块 | `src/blocks.ts`（两端共用，`panel.ts` / `mobile.ts` 只负责排版） |
| 网页标题、分享预览、favicon | 由 `vite.config.ts` 从 `content.ts` 和色板生成，不手改 `index.html` |
| 防护规则 | `scripts/check.mjs`（每次 build 前自动运行；`npm run check -- --launch` 是上线门槛） |

## 2. 已定稿的设计

### 配色

| 用途 | 色值 |
|---|---|
| 背景 paper | `#F6F6F3`（`--bg`，Winnie Lab；近白但不是纯白） |
| 面板 | `#FFFFFF`（`--panel`） |
| 次要正文 | 由 `--ink` 和 `--panel` 派生（`--ink-2`） |
| 文字 / 线 | `#121212` |
| 次要文字 / 线 / 细线 | 由 `--ink` 派生：50% / 28% / 14% |
| 名字 ✳ | 电光钴蓝 `#2C42F6` |
| 当前选中的点 | 酸性荧光绿 `#D5FD52`（`--accent`） |

- 没有深色模式。
- 字体：只用 Inter 一种（v42 起去掉 IBM Plex Mono）。
- 当前配色直接采用 `CONTENT_EN/brand` 的 Winnie Lab 品牌 token，让个人网站与社交账号视觉一致；灰色与银色线条由 ink 派生。
- 放弃过的方案：米白（太像参考站、太惨白）、全屏柠檬黄 `#FFFF84`、荧光黄 `#D4FF3A`、番茄红 / 朱红 / 樱桃红。

### 形状（v36：一个家族一种形状，一直延续到底；地图、INDEX、手机版、图例全部一致）

| 节点 | 形状 |
|---|---|
| 中心（名字） | 钴蓝 ✳ |
| 规则 | 一个家族从大类、分类到单个作品都用同一个形状。**有数字 = 一组**（数字是里面的作品数），**没有数字 = 单个作品** |
| Growth Marketing | 唯一高亮的大类：正方形描钴蓝边；它的 practice 分类（Paid Social、UGC 等）也是带数字的正方形 |
| Experience / Education 节点 | 带数字的三角形 / 六边形 |
| Information | 实心黑圆点 |
| 增长案例（Growth Marketing） | 正方形 |
| AI 项目 | 带中心点的圆 |
| 创意作品（Creative Work） | 菱形 |
| 工作经历 | 三角形（v37；胶囊形被否掉，不像一个形状） |
| 教育 | 六边形（v37） |

- **地图和 INDEX 一致**：地图上是线框，INDEX 的类别标题和手机版的分区标题用同一形状的实心版。形状只由 `content.ts` 的 `kindOf()` 决定，所有地方都调用它。
- **准备中**：用虚线框，地图上只显示名字。
- **大小统一**：所有点一样大，文字一样大；只有中心的名字更大。尺寸只在 `shapes.ts` 的 `SIZE` 里定义。

- 看完：一个作品打开过就划线；一组要全部看完才划线。地图、卡片列表、INDEX（包括分类标题和类别标题）同步划线，由同一个 `isDone()` 决定（v46）。

### 结构

- **中心**：Wenyi Zhu ✳。
- **Paid & UA Growth**（4 个案例，含 2 个重点案例）和 **Creator & Social**（5 个，含 1 个重点案例）：两个主打大类，直接挂在 ✳ 下（v62.31，取代 Growth Marketing）。
- **AI Projects**：AI Marketing Workbench + 2 个占位。
- **Creative Work**：首页默认折叠，4 个占位。
  - Photography
  - Design
  - Video & Editing
  - AI Creative Videos
- **Information**：Experience（折叠，之字形排列）和 Education。
- **没有 Contact 节点**：联系方式放在顶栏的 "Let's talk ↗"。
- **HoYoverse** 用虚线连到 AI Workbench（v62.31）；每个案例卡片上写 "HoYoverse · 日期 →"。
- **X Creator Campaign** 和 **Cross-Platform Community Giveaway** 在 Creator & Social 里相邻排列（同类创作者活动）；不加虚线（用户看过后觉得容易混淆，v62.14 去掉）。
- **案例外链**（`links`）：摘要下方一行灰色带下划线的链接（例如 "TikTok event page ↗ · A player’s video ↗"），新窗口打开；只放公开页面。Interactive Filter 用了活动页和一条达人视频（Creator video example）。（v62.15–62.18）

### 交互模型（参考 andrewtrousdale.com，v32 起）

**地图和右侧卡片同时存在。**右侧卡片就像一份简历，包含地图上的全部内容；点地图上的点，就是在卡片里打开对应的那一项。

| 状态 | 地图 | 右侧 |
|---|---|---|
| 首页（进入网站） | 全部领域和分类；Creative Work 折叠 | **INDEX 卡片**：<br>① INDEX 展开：名字、身份、一句话简介、4 个关键数字、"More about me →"<br>② Growth Marketing / AI Projects / Creative Work / Experience / Education 的折叠区，每个区是一句定义加全部条目（案例带 headline 数字）<br>同一时间只展开一个区 |
| 选中一个点 | 只显示这个点自己的链条：回到 ✳ 的路径、它里面的内容、它的虚线关联。其他点淡出 | 顶部是 **INDEX ←** 小条（回到首页），下面是这个点的卡片，有图片时图片在卡片上方 |
| Resume / Let's talk | 同首页 | INDEX ← 小条，下面是简历或联系卡片 |

- **镜头**：
  - 不放大。镜头框住所有显示的点，比例稳定在 1.1。
  - 显示的内容放不下时才缩小，最小 0.7。
  - 选中的点被拉到中间，所以它的每条连线（包括虚线）两端都在画面内。
- **返回**（v44）：
  - 卡片上不再有 ← 后退按钮。
  - 点 ×、INDEX 小条或按 Esc 回到首页。
  - 再点一次当前的点回到上一级。
- **已取消**：顶栏下的介绍横条和名字旁 ✳ 的展开 / 收起。原来的内容移进了 INDEX；✳ 现在只是名字的一部分，点它回首页。

### 页面布局

- **顶栏**：
  - 左边 "wenyi zhu"（v34 去掉旁边的 ✳，避免画面里蓝色星星太多），不加粗，点击回首页。
  - 右边 "中文 · Resume ↗ · Let's talk ↗"。
- **右侧栏**：
  - 固定显示，垂直居中；中线在屏幕宽度的 75% 处（`--side-at`，和参考站一样），离右边缘至少 `--side-right`。
  - 从上到下依次是 INDEX 小条（首页不显示）、图片、卡片。
  - 地图占右侧栏左边的全部空间。
- **卡片排版（v42，按参考站的方法）**：
  - 一种字体 Schibsted Grotesk（v50）、两种字号（正文 14px，小号大写标签 11.5px，字距 0.05em）、两种颜色（黑、灰）。标题和正文一样大，不加粗。唯一的例外是 INDEX 的四个关键数字。
  - 左侧留一条图标栏（`--gutter`），形状和区块符号放在图标栏里，所有文字从同一条线开始；段落首行缩进。
  - 卡片顶部：类别形状（实心）加所在位置，例如 "GROWTH MARKETING / ACCOUNT GROWTH"。
  - 顶层卡片（Growth Marketing、Experience 等没有上级的）：名字直接写在顶部形状旁边，下面不再重复标题（v45）。
  - 身份三行：标题；灰色一行（HoYoverse · 我的角色，或职位）；小号大写灰色一行（时间 · 市场 · 平台）。
  - 成绩数字写成一句话，只有数字是蓝色，和正文一样大。
  - 区块（What I did ↳、Results ↗、Work from this role ↘、Connections ⇄）默认收起，用虚线分隔。
  - 列表：不能再展开的最后一级（单个作品、单段经历）前面加圆点 "•"（v44 由短横改回圆点），文字比所属分组再往右缩进一点；能展开的一组不加。需要时下面一行灰色小号大写写它属于哪一类。
  - 说明文字统一（v43）：凡是介绍"一组"的文字（大类、分类、Experience 的说明），在 INDEX、卡片、手机版用同一个 class `.p-def`。v51 起改为黑色（和正文一样），灰色只留给小号大写的标签行。
  - 以下为 v35 的记录（字号部分已被 v42 取代）：
- **卡片排版（v35，方向 C · Clean grid）**：
  - INDEX 顶部不再重复名字和身份，只保留一段简介，然后是 2×2 的关键数字，最后是 "More about me →"。
  - 关键数字（v36，定稿）：每个数字放在一个细描边的圆角小框里，大号钴蓝数字加灰色说明。奶油黄底和淡蓝底两种方案已否掉。
  - 类别标题和卡片标题一律用等宽大写字，12px。
  - 列表条目用干净的圆点，形状只出现在类别标题上。
  - **展开的类别（v41，方向 3）**：
    - 类别介绍用小号灰字，退到背景。
    - practice 分组标题用深色等宽大写字，是这一区的主角。
    - 组与组之间只用留白隔开，不加线。
    - 列表里**不放任何数字**；每个案例的数字只在它自己的卡片上出现，INDEX 顶部的四个关键数字负责第一眼的成绩。
  - 分隔线统一用一条浅色实线（`--rule`）；虚线只表示"准备中"。
  - 没有竖线。
- **卡片结构（v38）**：
  - 卡片顶部不写类型（不再有 "PRACTICE" "CASE" "PATH"），而是写它在哪里，例如 "GROWTH MARKETING / UGC & INFLUENCER"，前面是这个类别的形状。大类本身只显示形状。
  - **一组的卡片**（大类、分类、Experience、Education）：标题、一句说明，下面直接用圆点列出里面的条目，不再有 "Inside" 折叠区和 Connections。
  - **单个作品的卡片**：标题、headline 数字、角色、摘要，然后是 "What I did / Results / Connections" 折叠区。经历卡片多一个 "Work from this role"。Connections 里不再重复上一级。
- **卡片动效（参考站同款）**：
  - 卡片高度跟随内容，800ms 用参考站同样的缓动曲线过渡。
  - 新内容 260ms 淡入，图片缩放淡入。
  - 打开一个点或展开一个分区时，卡片平滑地变高或变矮，不会闪。
  - 滚动条平时隐藏，只在滚动卡片时出现，停下约 0.9 秒后消失（`--scrollbar-linger`）。
- **底部**：图例（每种形状各一项）和 "PROTOTYPE · PLACEHOLDER COPY"。后者由 `site.launched` 控制，上线时自动消失。已去掉 "Click a node…" 提示，因为它和图例重叠。
- **手机版**：单页菜单式布局，不变。
- **中英切换**：只有中英两种。

### 地图交互（已定）

- **不能平移**：不能拖动或滚动整张图。点哪个点，哪个点就成为视觉中心。
- **首页布局固定（v40，按你确认的截图）**：
  - 每个点的位置写在 `map.ts` 的 `HOME_LAYOUT` 里，进站就是这个样子。
  - 没有选中任何点时，每个点都会被轻轻拉回原位，所以回到首页时样子不变。
  - 连线长度由同一份坐标算出，布局力和固定位置不会互相冲突。
  - 随机数全部改成按 id 固定取值，每次打开都一样。
- **镜头**：见上文"交互模型"。v24 的"按组放大、放不下的点可以在画面外"已作废，原因见 LESSONS L15。
- **动效**：点击后大约 2 秒内布局到位，之后完全静止，没有持续漂浮。单个点可以拖动，松手后回到稳定位置。
- **连线**：保持最初的折线风格；远近不均。点的大小从 v33 起统一。
- **不重叠（v47）**：点和点按形状 + 标签的矩形避让；线不穿过不属于它的点；向下的线从标签下方出发；选中某段经历时，Experience 保持在中心，经历链条不折叠。用 `scripts/layout-check.cjs` 检查。
- **末级保留兄弟（v53）**：选中一个末级（没有下级的单个作品）时，同一上级下的兄弟作品保持显示；地图中心放在上级；兄弟们按当前顺序排在上级背离 ✳ 的一侧。
- **作品组放射展开（v62）**：打开一个有 4 个及以上末级作品的组时，作品绕组点一整圈均匀分布（留一个空位给回到上级的线），相邻的一近一远；打开组里某个作品时，兄弟作品仍是半圈扇形。重点案例（flagship）在地图上改为白底黑框方块，与其他案例一致，靠手写批注突出。
- **作品组均匀展开（v54）**：一个组有 4 个及以上末级作品（如 More cases）时，打开这个组或其中一个作品，组内作品在背离 ✳ 的一侧均匀排成扇形，相邻的一近一远（`groupRing` / `groupStagger` / `groupSpread`），标签互不挤压。
- **线不重叠（v48）**：只画选中点自己的关联虚线；关联的点放在选中点背离链条的一侧，散开摆放；同一点出发的线至少分开约 35°，线不交叉；选中点的链条（✳ → … → 选中点）保持形状，由其他点让开。首页不受影响（手排）。参数都在 `map.ts` 的 `LAYOUT`。
- **形态保持（v49–v50，v51 已撤回）**：试过同一大类内点击时保持形态（先是完全固定，后是弹簧轻微抖动），你都不喜欢，v51 回到 v48：每次点击重新布局。代码在 git 提交 `97b4d70`，需要时可以取回。

## 3. 内容规则（来自交接要求，必须遵守）

- 第一人称，口语、亲切，不要正式腔。
- **不编造**任何职位、客户、数字或结果；占位内容必须标 `[Placeholder]` / `[Draft]`。
- 不放内部数据或完整报告，也不要发给外部服务。
- 不要把 "AI increased ROI by 164%" 当标题数字。
- 每个案例都要有一个 headline 数字。
- 公开用全名 Wenyi Zhu。
- 邮箱和简历 PDF 目前是空的，`site.email` 和 `site.resumePdf` 要等你提供。
- 写入范围只限 `portfolio-prototypes/claude/`，不要改 `portfolio/`、`codex/`、career 原文件、AGENTS.md、CLAUDE.md，也不要删文件。
- 浏览器只用标准版 Google Chrome，不要用 Chrome Beta。

### 临时本地文案编辑（2026-09-29）

开发服务器提供页面原位编辑和保存后预览两种模式，编辑器不改变正式发布构建。编辑记录存 `.copy-editor/archive.json`；原文不可被恢复操作覆盖，恢复本身成为新版本。正文输入为纯文本，高亮以字符区间存档。提交正式稿前读取并核对该存档，避免覆盖 owner 改稿。进入预览才能正常使用文字链接导航。

发布时将已确认的当前 edits 与 lists 提取到 `src/published-copy.json`，过滤已删除列表项的 edits；生产构建通过 `published-copy.ts` 应用文案与格式。不要把完整私有存档提交到 Git。开发模式保持原始字段 ID，不重复应用生产快照，避免列表排序冲突。
