# CHANGELOG

> 只追加，不改旧条目。每条写日期 + 版本 + 一两句改了什么。

## 2026-09-28

- **v54** 配色与 Winnie Lab 品牌统一：
  - 背景从全屏柠檬黄改为 paper `#F6F6F3`，面板保持白色。
  - 名字 ✳ 与链接改用品牌电光钴蓝 `#2C42F6`。
  - 当前选中节点从番茄红改为酸性荧光绿 `#D5FD52`。
  - 文字改为品牌 ink `#121212`，银灰正文与连接线继续由基础 token 派生；布局、交互和文案未改。
- **v53** 末级作品不用来回跳：
  - 点到一个末级（单个作品）时，它的兄弟作品留在地图上，可以直接一个接一个点，不用退回上一级再进来。
  - 这时地图中心保持在它们的上级（和经历链条一样），兄弟们按原顺序排在上级背离 ✳ 的一侧，所以在兄弟之间切换时形状基本不动（Creative Work 下每次点击位移约 7–20px）。
- **v52** 右侧卡片不再闪、不再抽：
  - 去掉换内容时的淡入（从透明到不透明的 260ms 就是"闪"），内容原地替换，和参考站一样。
  - INDEX 条和图片条原来是瞬间出现/消失，整列居中，所以整列会瞬间跳 30–80px；现在它们也按高度缓动（`fitSide()`）。
  - 卡片目标高度封顶在可用空间内，动画不再中途撞到上限突然停住。
  - 逐帧测量：换卡时淡出帧 15→0，跳变/反向 → 0。
- **v51** 撤回形态保持，回到 v48 的每次点击重新布局；分组说明文字 `.p-def` 从灰色改为黑色；项目开始用 git 管理（你电脑上的 `portfolio-prototypes/claude/` 文件夹）。
- **v50** 字体和抖动：
  - 字体从 Inter 换成 Schibsted Grotesk（最接近参考站的 Brunswick Grotesque，后者是商业字体）。正文 13.5→14px，小号大写 11→11.5px，字距统一 0.05em（参考站同值），地图标签 12.5→13px。
  - 字体名只在 `--sans` 写一次，网页字体链接由 `vite.config.ts` 生成；小号大写字距统一成 `--track-label`（原来写死 9 处）。
  - 形态保持改为"弹簧"：留下的点被拉回原位，但允许轻微抖动（单次点击位移约 10px 以内，落定后平均偏差约 3px），不再完全平移。
- **v49** 地图形态保持：
  - 在同一个大类里点画面上的点（例如 Experience → 各段经历），已有的点和线原地不动，只有新出现的点落位，镜头平移。
  - 跨到另一个大类（点虚线那头、INDEX、链接、回首页）才重新排一次。
  - 关联的点直接出现在选中点的空侧，不再从远处飞过来。
- **v48** 线和线不重叠：
  - 关联虚线只画和选中点直接相连的，不再画上级的关联。
  - 关联的点聚到选中点"没有链条的那一侧"，绕着选中点移动，不从中间穿过。
  - 同一点出发的线至少分开约 35°；交叉的线把松的一端拉回一侧；选中链条折回时拉直。
  - 线避让点时按整个标签框计算；链条上的点不动，由线的松端让开。
  - 首页手排的布局不受这些新力影响。
  - `layout-check` 新增"线交叉 / 线贴线"统计，并改为等地图静止再测：38 个视图 0 处。
- **v47** 地图不重叠：
  - 点按形状 + 标签的矩形互相避让，线避开不属于它的点。
  - 向下的线从标签下方出发。
  - 选中经历时 Experience 保持在中心。
  - 经历之字形拉宽。
  - 新增 `scripts/layout-check.cjs`：全部 38 个视图的重叠从 9 处降到 1 处。
  - 新增 LESSONS L24。
- **v46**：修复看过的作品只在地图上划掉、卡片和 INDEX 不同步的问题；"看过"的判断移到公共的 `isDone()`。新增 LESSONS L23。
- **v45**：顶层卡片的名字移到顶部形状旁边，不再出现"形状旁空白、标题在下面"的情况。
- **v44**：
  - 背景换成更亮的柠檬黄 `#FFFF84`。
  - 卡片去掉 ← 后退按钮，Esc 改为回到 INDEX。
  - 最后一级条目的短横改回圆点。
- **v43**：
  - 一组的说明文字在 INDEX、卡片、手机版统一为灰色（`.p-def`）。
  - 最后一级条目加短横并多缩进一点，分组和条目不再看起来同级。
  - 新增 LESSONS L22。
- **v42** 卡片按参考站的排版方法重做：
  - 一种字体（去掉 IBM Plex Mono）、两种字号、两种颜色。
  - 左侧图标栏，文字统一起始线，段落首行缩进。
  - 身份写成三行，成绩数字改成一句话。
  - 区块默认收起，列表去掉圆点、改用灰色小号大写副标。
  - 地图、图例、手机版同步换成同一种字体。
  - `check` 新增 `card-type-scale` 规则。
  - 新增 LESSONS L21。
- **v41**：
  - 展开的类别改为方向 3：
    - 介绍改成小号灰字
    - practice 标题改成深色等宽大写
    - 组间只留白
    - 列表去掉所有数字和蓝色
  - 图例改为 "number = how many works inside"（数字 = 里面有几个作品）。
  - 新增 LESSONS L20。
- **v40**：
  - 首页布局按你确认的截图固定下来（`HOME_LAYOUT`）。
  - 回到首页时各点被拉回原位；连线长度由同一份坐标算出。
  - 去掉所有随机数，改成按 id 固定取值，每次打开完全一致。
  - `check` 新增一条：`HOME_LAYOUT` 里的 id 必须存在。

## 2026-09-27

- **v38** 卡片简化（另：带数字的三角形放大，数字与其他形状同为 9px，放在三角形重心上居中）：
  - 顶部显示层级路径，不再显示类型名。
  - 一组的卡片只保留标题、一句说明和圆点列表，去掉 "Inside" 和 "Practice / Path" 等字样。
  - Connections 不再重复上一级。
- **v37**：
  - 经历改为三角形，教育改为六边形（胶囊形被否掉）。
  - 数字框确定用细描边样式。
  - 修复卡片标题绕过 `kindOf`，导致 Experience 显示成 "PRACTICE"。
  - `check` 新增 `shape-from-kindOf` 规则。
  - 图例里的 "Path" 改名为 "Experience"。
- **v36**：
  - 形状规则统一为"一个家族一种形状，有数字 = 一组"：Growth 全是正方形（包括它的 practice），AI 全是圆，Creative 全是菱形，Experience 全是胶囊形，Education 全是三角形。去掉六边形，图例相应精简。
  - INDEX 的四个关键数字放进细描边的圆角小框。
  - 修复数字网格被列表样式多缩进了一截的问题。
  - 新增 LESSONS L19。
- **v35**：
  - 卡片按方向 C（Clean grid）重排：
    - INDEX 去掉重复的名字和身份行
    - 关键数字改成无线的 2×2 网格
    - 列表改成圆点，practice 作为小号大写的分组标题
    - 字号整体放大，标题 12px、正文 14–15px
    - 分隔线统一为一条浅色实线，虚线只表示"准备中"
  - 经历改用胶囊形，和 AI 的圆区分开。
  - 新增 LESSONS L18。
- **v34**：
  - 地图上的大类改用类别形状，和 INDEX 对上：Growth Marketing 是正方形，AI Projects 是圆，Creative Work 是菱形，Experience 是小圆，Education 是三角形。六边形只用于 practice 分类。
  - 形状统一由 `kindOf()` 决定。
  - 六边形和其他形状调成视觉上一样大。
  - 去掉顶栏名字旁（包括手机版）的 ✳。
  - 卡片滚动条只在滚动时出现。
  - 新增 LESSONS L17。
- **v33**：
  - 右侧栏按参考站的位置摆放：中线在屏幕宽度的 75% 处，不再贴右边。
  - 卡片改为平滑过渡：高度 800ms 缓动（和参考站的曲线相同），新内容淡入，不再闪。
  - 所有点一样大（去掉按重要程度放大缩小），文字一样大。
  - 每个类别一种形状，地图和 INDEX 一致：增长案例是正方形，AI 项目是带点的圆，创意作品是菱形，经历是小圆，教育是三角形。
  - INDEX 标记改为钴蓝。
  - 图例加回 AI 和创意两项；去掉和图例重叠的提示文字。
  - 新增 LESSONS L16。
- **v32** 按参考站重做交互模型：
  - 右侧卡片常驻。首页是 INDEX（简介、关键数字、按类别列出全部内容）；选中一个点时，上方显示 INDEX ← 小条，下方是这个点的卡片。
  - 地图不再放大。选中时只显示这个点的链条、里面的内容和关联；镜头框住全部显示的点，比例稳定在 1.1，放不下时才缩小，最小 0.7。
  - 去掉介绍横条和 ✳ 的展开 / 收起，原来的内容移进 INDEX。
  - 新增 LESSONS L14、L15，以及 L12 复发的记录。
- **v31** 全面审查和修 bug（独立审查 + 全路由自动测试），新增防护机制：
  - 修复：
    - 地图静止后仍每帧重绘，改为按需绘制，静止时零开销
    - 拖动被打断后节点被钉住、模拟不停
    - 右键也会选中节点
    - 坏链接导致白屏；未知 id 现在回到首页
    - 节点淡出到一半就被删除
    - 手机版重复点同一个目录链接没反应
    - 手机版缺少 Information 简介、HoYoverse 链接和复制邮箱按钮：电脑版和手机版改为共用 `src/blocks.ts`
    - 切换语言后面板滚动位置和展开状态丢失
    - 中文模式下的英文内容标注 `lang="en"`，读屏软件用英文发音
  - 可访问性：
    - 键盘选择节点后，焦点移到面板标题
    - 键盘焦点有可见的环
    - 只播报面板标题，不再朗读整个面板
    - 减少动态效果时，手机版不再平滑滚动
  - 硬编码清理：
    - 地图数字全部收进 `LAYOUT` / `CAMERA` / `WEIGHT_BY_KIND`
    - ✳ 尺寸收进 `AST`
    - 界面文字全部移入 `content.ts`
    - 节点大小改为由 `lead` 字段决定，不再解析英文文案
    - 断点、时长、边距改为 CSS 变量
    - 合并重复的 `@media` 块，删除无用样式和文案
  - 网页头部：标题、描述、分享标签、favicon、无 JS 时的兜底内容，都从 `content.ts` 和色板生成
  - 新增 `scripts/check.mjs`：每次 build 前运行；`--launch` 是上线门槛
  - 新增 `docs/LESSONS.md`，记录 L1–L13
- **v30** 工程整理：所有颜色和版面尺寸改为 CSS 变量（派生色用 `color-mix()`），`main.ts` 从 CSS 读尺寸（顺带修复窄屏面板宽 340px 与代码里 380px 不一致的问题）；镜头参数集中到 `CAMERA`；删除不用的图例文案。文档改为 `docs/SPEC.md` + `docs/STATUS.md` + `docs/CHANGELOG.md`，旧的 `REQUIREMENTS.md` 和 `HANDOFF.md` 移入 `docs/archive/`。
- **v29** 背景定为 soft butter `#FFF8A8`。
- **v27–v28** 当前点改为番茄红 `#FF6242`；试过柠檬黄 `#FEFC83`。
- **v26** 背景改为弱黄；形状统一：所有单个作品都是正方形，教育改三角形；去掉 AI / Creative 的专用形状和图例。
- **v25** "AI" 改名 "AI Projects"。
- **v23–v24** 地图点击后约 2 秒静止，去掉持续漂浮；按组放大，缩放下限 1.35× 与窗口大小无关；选中点一定在画面内，✳ 尽量带入。
- **v22** 选中点放大；✳ 保持在画面内（v24 放宽）。
- **v1–v21** 结构、配色、交互的多轮迭代，决定记录见 `docs/archive/REQUIREMENTS-v0.6-2026-09-27.md`。

- **2026-09-28 · v55（本地待验收）** 按批准范围改 INDEX 高亮、18px 数字、无框网格及缩进；案例小 tags、headline 强调、UA 数字/说明两列 Results；删除 UA 重复角色行；地图 hover/focus 荧光绿。保留布局、字体、分隔线与路由/折叠逻辑。build:file 通过，浏览器视觉验收待用户确认，未推送。
- **2026-09-28 · v56（本地待验收）** 全站正文对齐、headline/Results 数字说明自然接排、9 个案例共用 Results 样式，移除重复角色行；普通节点白底；仅首次卡片淡入上移、地图横移及错峰显示；保留原地图终态/路由/折叠行为。支持 reduced motion。
- **2026-09-29 · v57（本地待验收）** 恢复列表 bullet points 和最小缩进；统一桌面/手机列表圆点为目录同款灰色，数字蓝色不变。
- **2026-09-29 · v58（本地待验收）** 9 个营销案例统一公司/项目同行、平台和地区 tags；日期保留独立。共享身份块同步桌面/手机；构建和全案例字段检查通过，未推送。
- **2026-09-29 · v59（本地待验收）** 详情正文与 Results 默认展开并可独立折叠；互斥 accordion 仅保留于 INDEX。build:file 通过。
- **2026-09-29 · v60（本地待验收）** Results 案例取消重复顶部 headline，简介保留；UA 15% 高亮移入结果，明确 UA spend 口径。首页概览、无 Results 项目不变；build:file 通过。
- **2026-09-29 · v61（本地待验收）** 固定卡片 scrollbar gutter，高度测量包含上下边框，消除滚动条切换导致正文宽度变化的机制。构建通过，动态视觉回归待确认。

## 2026-09-29 · v61 后本地修改

- 按用户授权为全部 9 个 Growth Marketing 案例加入 The Challenge，直接使用 Current Working Case 原文，放在已有 What I did 之前；桌面/手机共用内容。build:file 和全部案例顺序检查通过，未提交/推送，浏览器视觉验收待完成。

## 2026-09-29 · 本地临时原位文案编辑

- 增加 dev-only 内联编辑、字符/词数、荧光高亮、保存并预览、历史恢复与 JSON 导出。
- Vite 本地存档接口采用原文快照、版本历史、顺序写入、原子替换和 revision 冲突检测；归档不进入 Git 或生产包。
- 公司节点更名为 Hoyoverse (Genshin Impact)。正式稿保持独立，待 owner 编辑完成后合并。

- 2026-09-29：地图标签换行保留括号内完整名称，Hoyoverse 与 (Genshin Impact) 分成两行。

- 2026-09-29：共享案例身份行隐藏已由公司名称包含的 Genshin Impact 项目后缀（8 个案例，桌面/手机同步），保留 Zenless Zone Zero 区分及源数据。

- 2026-09-29：修复 Results 数字后说明文字不能编辑；共享 tx 文本与指标分别绑定稳定字段，覆盖所有共用案例，支持清空后继续编辑；浏览器原位输入和保存读回通过，保留 owner 改稿。

- 2026-09-29：用户授权提交当前版本；新增生产文案快照，保留当前编辑稿、列表增删排序及荧光/蓝色/加粗格式。临时编辑器仍仅本地可用，原文与历史不进入 Git。同步案例标题、身份行间距、紧凑蓝边标签、Results 对齐项目符号及地图灰色悬停日期。

- 2026-09-29：按用户要求移除 UA Creative Strategy 的媒体配置，不展示第三方授权广告素材或 Visuals 占位；该案例仅保留地图与文字。其他案例媒体配置不变。

- 2026-09-29：桌面案例 The Challenge 默认折叠；右侧阅读列全局最高 1080px，并在顶部导航带下保留至少 32px 间距，长内容继续在卡片内部滚动。

- 2026-09-29：Results 全局取消强制单行，长说明自然换行，卡片禁止横向滚动。Xbox 地图日期标记 Nov 2024（已确认上线月份，非完整制作周期）：KM 素材需求为 11/15 前交稿，卖点文案明确 2024/11/20 上线，首周数据至 11/27。来源：career/data-capture/KM raw/cases/xbox-launch-paid-campaign 下 art-requirements/01-requirements-overview 与 media-buy-plan/02-selling-points-copy、03-launch-data。

- 2026-09-30：用户暂缓图片展示开发；两版 Xbox 图片移至 gitignored `.local-assets/xbox-launch/`。更新当前发布文案快照并同步网站全部现有代码修改。

## 2026-09-30 — Xbox case completed

- Saved the owner's latest Xbox summary, challenge, three action bullets, ordering and text highlights into the production copy snapshot. Results now show CTR +338%, CPC 66% lower, 120M+ impressions and ~700K landing-page clicks, with the owner's final punctuation.
- Replaced Xbox's visual placeholder with the owner-supplied clean QR-blurred artwork. A small thumbnail chooses safe whitespace in the upper half of the map area, excludes the entire INDEX/card column, and opens a full-screen image dialog.
- Removed the fixed image delay; use an 87 KB thumbnail and load the larger image on click. Fixed the close button's white hover background. The local copy editor remains in source control and stays development-only.

## 2026-09-30 — TikTok UGC Incentive Program case rewritten

- Rewrote the GIP flagship: new title, summary, challenge, five blue-labelled "What I did" bullets, results (80M+ views, 500K+ UGC submissions, ~60% lower CPM in Round 3, budget moved to curated creator ads), team wording, period Dec 2024 – Nov 2025, markets US/JP/KR/TW.
- Added a 2×2 rounds diagram (Round 1 → Round 2 → Round 3 awareness → recommendation) in "How it worked".
- UA flagship renamed to "Creator Ad Pipeline". Editor archive and published snapshot reconciled.

## 2026-10-01 — TikTok case: framework diagram, open-ended summary

- Replaced the round-results diagram with the testing framework (set goals and benchmarks → design the round → run and steer → evaluate the full funnel) plus how the roadmap evolved.
- Summary no longer states a conclusion. Merged the last two "What I did" bullets into one. Team line now shows the data operations specialist is on our side and the liaisons are from TikTok.

## 2026-10-01 — TikTok case: shorthand and shorter copy

- Diagram cut to short phrases with CPM / CPA / CPI; decision reads "Stop the program; shift budget to creator ads for UA". UA diagram subtitle "Repeated every test cycle" → "Refined every test cycle".
- Challenge cut to one paragraph. Bullets and fourth result use CPM / CPA / CPI and the stop decision.
- Added L30 and a `copy-shorthand` check.

## 2026-10-01 — Phone: one visual per card

- On the phone, a case with a diagram shows only the diagram (ZZZ no longer shows the Gentle House image there). Cases without a diagram keep their image. Desktop unchanged.

## 2026-10-01 — TikTok diagram: roadmap removed

- Removed the round-by-round roadmap strip from the TikTok diagram at the owner's request (too detailed for a public page). The diagram now shows only the testing framework.

## 2026-10-01 — TikTok diagram headings

- "Steer creators live" → "Manage the live campaign"; "Judge the full funnel" → "Full-funnel analysis". Full wording review planned once all cases are drafted.

## 2026-10-01 — Xbox case brought up to the new rules

- First-person summary with blue numbers; one-paragraph challenge; three blue-labelled "What I did" bullets (lime highlights on bullets removed); team line in the "Me (…)" format; US / French / German wording consistent with the markets.
- Merged owner edits from the editor: TikTok "Raised content quality" bullet; ZZZ title "Zenless Zone Zero: Social Launch in Japan".

## 2026-10-01 — v54: More cases spread evenly

- Opening "More cases" (or one of its cases) now lays the six cases out as an even fan on the far side from the ✳, alternating near and far. Layout check: 5 → 3 across 36 views (remaining: HoYoverse and AI Workbench, both pre-existing); 0 in the More cases views.

## 2026-10-01 — v55: hand-written notes on the map

- Red-orange (`--note`, 7th base colour) notes in Nanum Pen Script (`--hand`, loaded with the main font from Google Fonts), with clean 1.5px arrows.
- Home map: "~3.7× projected LTV vs benchmark" (Creator Ad Pipeline), "0 → 80M+ organic views" (ZZZ), "my framework for testing new channels" (TikTok), "tools I built with AI" (AI Projects). Placed by hand in `NOTES` (map.ts); home only.
- More cases: a rounded frame labelled "integrated social campaigns" around Influencer Activation, Giveaway & Cross-Platform Influencer and Interactive Filter, which now stand in a column; the frame follows them when dragged. "600M+ views" beside Interactive Filter.
- Text in content.ts (`note`, `clusters`), with Chinese versions. Phone unchanged (no map).

## 2026-10-02 — v56: notes never hidden; frame removed

- Map notes are nudged back inside the free map area, so the card, header or window edge never covers them; after a large shift the arrow re-aims at its point.
- Removed the "integrated social campaigns" frame and the column layout behind it; More cases keeps only "600M+ views".

## 2026-10-02 — v57: smaller map notes

- Hand-written notes about 20% smaller; arrow tails scale with the text so they still start at the words.

## 2026-10-02 — v58: map notes re-placed

- Home notes re-placed by hand for the smaller size so each arrow is short and lands on its point; ZZZ and TikTok notes moved to where the map has room.

## 2026-10-02 — v59: AI note closer

- "tools I built with AI" moved right, closer to its arrow.

## 2026-10-02 — v60: platform and region filters

- Desktop header (where the name was): PLATFORM Global social · Chinese social · Paid ads, and REGION North America · Europe · Japan · China. Plain words matching the nav; picked = blue underline; pick again to clear.
- One matching rule (`matches()` in state.ts) greys non-matching points on the map, items in the INDEX/card lists and cards on the phone; map notes of non-matching cases hide.
- Filters are kept in the address (`?platform=…&region=…`) for sharing filtered links. Platform comes from a new `platforms` field; region from `markets` via `regionOfMarket`.
- Phone: a swipe row under the header.

## 2026-10-02 — v61: filters unfold matches; phone drop-downs

- Picking a filter returns to the home map and unfolds every matching case or role (e.g. Chinese social opens Experience to Nike, Weber Shandwick, NOWNESS); home notes step aside while filtering. Placeholders never match.
- Phone: two drop-down menus (Platform / Region, default All) replace the swipe row; after a choice the page scrolls to the first match.
- AI Creative Intelligence Dashboard counts as Paid ads.

## 2026-10-02 — Influencer Activation case rewritten

- First-person summary, one-paragraph challenge, four blue-labelled bullets, four results, team in the "Me (…)" format, period Jan 2026.

## 2026-10-02 — Influencer Activation: campaign banner

- Added the public "Moon Maiden" Moonlit Support event banner as the case's floating image (thumbnail + full size).

## 2026-10-02 — X Creator Campaign

- Retitled "Influencer Activation Campaign" to "X Creator Campaign" to match its own wording (creators, not influencers); tag "Influencer" → "Creator marketing"; KR removed from markets (<1% of creators).

## 2026-10-02 — v62: radial More cases; white flagship squares

- Opening a group of 4+ cases (More cases, Creative Work) spreads them all the way round it, leaving one gap for the line back to the parent; with one of its cases open, siblings keep a half fan.
- Flagship cases are white squares like the other cases; the hand-written notes now do the highlighting.
- Layout check: 8 (was 11 before this change); remaining issues are in the AI Workbench and HoYoverse views and predate it.

## 2026-10-02 — v62.1: fix career path unfolding outside filters

- Opening Growth Marketing no longer pulls in every role: the "show the whole career path" rule now applies only on the filtered home map (L31).

## 2026-10-02 — EN Social Channel Growth case rewritten

- Retitled from "Genshin Impact: EN Social Growth"; "accounts" → "channels"; first-person summary, one-paragraph challenge, four blue-labelled bullets, four results, team in the "Me (…)" format.

## 2026-10-02 — Cross-Platform Community Giveaway case rewritten

- Retitled from "Giveaway & Cross-Platform Influencer Campaign"; first-person summary, one-paragraph challenge, three blue-labelled bullets (lesson folded into the last), four results, team in the "Me (…)" format, period Aug 2024.

## 2026-10-02 — v62.5 Results fit on one line

- Every result is now one line (number + label ≤ 45 characters). Shortened: X Creator Campaign (~3x, 39%, +88%), Giveaway (~900K), Landing Page (1.4M+). Headline labels updated to match.
- New `check` rule `result-one-line` (L32), applied to the published copy.

## 2026-10-02 — v62.6 Giveaway copy clarified

- "third-party community" → "the biggest Genshin fan account on X" (owner edit). Bullets now say how players entered (quote-posting a creative entry), what creators did (posted entries first), and why entries fell short (too much effort on X), for readers with no context.

## 2026-10-02 — v62.7 Giveaway: no "third-party"

- Challenge and lesson now say "the biggest fan account on X" / "fan accounts" instead of "third-party community"; "semi-active" → "casual".

## 2026-10-02 — v62.8 Owner edits from the copy editor applied

- X Creator Campaign: shorter summary, challenge in two paragraphs, results reworded ("vs the prev. benchmark", "Event exposure…"), "local players" in the strategy bullet.
- Xbox: "100+ localized assets".

## 2026-10-02 — v62.9 No game version numbers

- Removed "5.0" / "4.4" from Giveaway, Interactive Filter and Landing Page (kickers, context, summary, challenge); "a major update" instead. New `check` rule `no-game-version` (L33).

## 2026-10-02 — v62.10 Less repetition

- Giveaway: the "took part, not just saw it" idea now appears once (challenge says "get them to act"; bullet says codes "turned views into a measurable action"); "official channels" and "biggest fan account" no longer repeated in every block.
- X Creator Campaign results: "vs benchmark" / "than benchmark".

## 2026-10-02 — v62.11 Interactive Filter Campaign rewritten; X Creator ↔ Giveaway linked

- Interactive Filter Campaign: first-person summary with context for Lantern Rite, one-paragraph challenge, three blue-labelled bullets, four one-line results, team in the "Me (…)" format, period Jan – Feb 2024, markets US/JP.
- X Creator Campaign now has a dotted connection to the Giveaway (its benchmark campaign); the Giveaway moved next to it in More cases.

## 2026-10-02 — v62.12 Editor launcher

- `Open Editor.command` (Mac only) now stops a leftover editor holding the port before starting; executable permission restored after the edit (L34).

## 2026-10-02 — v62.13 Linked cases show their dotted line when the group is open

- Opening More cases now shows the X Creator ↔ Giveaway dotted line (before, it only appeared when one of the two was selected). The line pulls on nothing, and linked cases are kept side by side in the fan so it stays short.

## 2026-10-02 — v62.14 Dotted line removed

- Removed the X Creator ↔ Giveaway dotted line (owner found it confusing) and the v62.13 group-view link code. The two cases stay next to each other in More cases.

## 2026-10-02 — v62.15 Interactive Filter: event banner and links

- Lantern Rite submission event banner as the floating image (public promotional art).
- New `links` field: a grey line of links under the summary, opening in a new tab. Interactive Filter links to the TikTok event page and a player's video.

## 2026-10-02 — v62.16 Second player video link

- Interactive Filter links: TikTok event page · Player video 1 (YouTube) · Player video 2 (TikTok).

## 2026-10-02 — v62.17 Creator video links

- Interactive Filter links renamed and reordered: TikTok event page · Creator video 1 (TikTok) · Creator video 2 (YouTube).

## 2026-10-02 — v62.18 One creator video

- Interactive Filter links: TikTok event page · Creator video example (the TikTok one only).

## 2026-10-02 — v62.19 Giveaway creator video link

- Cross-Platform Community Giveaway: "Creator video example ↗" (Instagram) under the summary.

## 2026-10-02 — v62.20 Interactive Filter challenge reworded; owner summary edits

- Challenge: "simple enough for anyone to recreate"; "a short window to build momentum and get the trend to take off".
- Owner edits from the editor: Giveaway summary "4x the goal" (blue), Interactive Filter "#1" blue.

## 2026-10-02 — v62.21 Briefing bullet reworded

- Interactive Filter: "so their posts inspired players to make their own" (was "gave players clear examples to copy").

## 2026-10-02 — v62.22 Retitle: TikTok Branded Effect Campaign

- "Interactive Filter Campaign" → "TikTok Branded Effect Campaign" (TikTok's own name for the format).

## 2026-10-02 — v62.23 Retitle: TikTok & Snapchat Branded Filter Campaign

- "Branded Effect" is TikTok's internal term and few readers know it; "branded filter" is the everyday word, and the title now names both platforms.

## 2026-10-02 — v62.24 Landing page case rewritten

- Retitled "Gamified Launch Landing Page" (was "Landing Page Gamification"); first-person summary, one-paragraph challenge, three blue-labelled bullets, four one-line results, team in the "Me (…)" format, period Aug – Sep 2024; Blaze to Natlan event banner and event page link (personal invite code removed from the URL).

## 2026-10-02 — v62.25 Landing page copy simplified

- Retitled "Gamified Landing Page"; challenge rewritten in the owner's framing (experiment: game + rewards to test conversion; first gamified landing page), 1B+ impressions removed; comparisons say "benchmark"; "~4 visitors per share".

## 2026-10-02 — v62.26 Fix v62.25

- v62.25 was committed with a failing build (result too long) and a misplaced blue highlight; fixed ("1.8M+ players in the draw, +60% vs benchmark"; blue on 9.5M+, 1.8M+, 3x). L35.

## 2026-10-02 — v62.27 Landing page bullets cut to the point

- Each What I did bullet is now one short sentence.

## 2026-10-02 — v62.28 Landing page bullets in growth language

- Benchmarked formats / Designed the hook (personality quiz as a viral format, three questions to cut drop-off) / Built the viral loop (rewards tied to referrals, ~4 visitors per share).

## 2026-10-02 — v62.28 STATUS rewritten as the hand-off for a new session

- STATUS now covers the sync workflow, the copy-editor archive, the owner's writing preferences from this session, and open questions.

## 2026-10-02 — v62.28 STATUS: next steps set by the owner

- Next: review and polish all cases against the JD language bank; then discuss how to organise the cases (owner's first idea: Growth Marketing + Social Campaigns instead of More cases; open to other options based on target roles).

## 2026-10-02 — v62.29 all 9 cases polished

- Synced four owner edits from the editor archive (X Creator "event", ZZZ "repeatable system", Filter challenge wording, GIP "Raised content quality" removed).
- House style: × for multiples, "vs", every comparison called "benchmark", Results labels lowercase after the number; UK spelling (localised, optimisation, behaviour, programme, personalised).
- Ownership wording from the JD language bank: "Owned the testing framework", "Partnered on media optimisation", "co-developed", "Vetted creators and content"; X Creator described as a new strategy for a new campaign (not "rebuilt"); ZZZ challenge says "the Genshin Impact brand team" (owner's wording).
- Retitled: TikTok UGC Channel Test (headline ~60% lower CPM; summary now carries the stop decision), English Social Channel Growth. Xbox challenge keeps "100+" (a projection before the work; 144 is the delivered count).

## 2026-10-02 — v62.30 Growth Marketing in two groups (owner chose option A)

- "More cases" and the separate "Flagship cases" list removed. Two groups named after the target JD families: Paid & UA Growth (Creator Ad Pipeline ★, TikTok UGC Channel Test ★, Xbox, Gamified Landing Page) and Creator & Social (ZZZ ★, X Creator, Giveaway, Branded Filter, English Social Channel Growth).
- Flagships lead their group and stay on the home map (and in an opened Growth Marketing) with their notes; HOME_LAYOUT and the ZZZ note moved; phone menu lists the two groups. layout-check total 3 (same two pre-existing views, hoyoverse and ai-workbench).

## 2026-10-02 — v62.31 Growth Marketing node removed

- Owner: too many nodes. Paid & UA Growth and Creator & Social now hang straight off the ✳ as the two main areas (cobalt outline). At home they stay folded, showing only their flagship cases and notes; opening one shows all its cases.
- INDEX, phone sections and phone menu list the two areas. HoYoverse's dotted line now goes only to the AI dashboard. Growth Marketing's placeholder summary removed from the published copy and the editor archive.
- layout-check 4 (hoyoverse 1, ai-workbench 3; ai-workbench varies run to run, both pre-existing).

## 2026-10-02 — v62.32 home map re-spaced; Branded Filter on the home map

- Owner: the number of points is fine, the spacing looked off. Branded Filter Campaign is now a flagship (second in Creator & Social) with its "600M+ views" note on the home map.
- HOME_LAYOUT and NOTES re-placed: areas at similar distances round the ✳, flagships fanned outside their area, notes on sides where the panel edge doesn't push them onto labels. Checked at 1440 and 1180 wide. layout-check 3 (ai-workbench, pre-existing).
