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

## 2026-10-02 — v62.33 smaller map notes

- Owner: notes took too much attention. Note text 27 → 20, arrowheads 12 → 8, stroke 1.5px → 1.2px; UA and AI notes nudged closer to their arrows.

## 2026-10-02 — v62.34 UA and AI notes closer to their arrows

- Owner: the gap between the words and the arrow on the ~3.7× and "tools I built with AI" notes was bigger than on the other three. Both texts moved in so all five notes have the same gap (checked with the real Nanum Pen Script font).

## 2026-10-02 — v62.35 Information folded; Creative Work beside it

- Owner: fold Information and put Creative Work next to it, both folded; AI Projects a little to the left. Education/Experience now appear only when Information is opened. AI note moved to the upper right of AI Projects. Education/Experience home positions moved outward so the career path still unfolds away from the ✳. layout-check 2 (ai-videos), within budget.

## 2026-10-02 — v62.36 arrange mode for the home map

- Owner wants to place the points herself (dragged points used to spring back). With window.__ARRANGE set, home points and notes stay where dropped and "Copy layout" gives the HOME_LAYOUT/NOTES JSON to paste back. Published as a separate preview; the real site is unchanged.

## 2026-10-02 — v62.37 arrange mode: drag fixed inside the artifact viewer

- In the real viewer, dragged points sprang back (the map kept easing and the drag relied on the simulation). Arrange mode now has its own drag: the point follows the pointer directly, is drawn at once, the simulation is stopped, window listeners keep the drag alive, and the camera doesn't ease. Real site unchanged.

## 2026-10-02 — v62.38 owner's home layout

- HOME_LAYOUT and NOTES replaced with the exact values the owner placed in the arrange tool. layout-check 2 (contact view), within budget.

## 2026-10-02 — v62.39 AI Projects folded at home

- Owner: only the AI Creative Intelligence Dashboard stays on the home map; the two placeholder AI projects appear when AI Projects is opened (FOLDED_AT_HOME + ALSO_AT_HOME).

## 2026-10-02 — v62.40 all AI projects folded; arrange tool shows at once

- Owner: fold all three AI projects on the home map (the dashboard too).
- Arrange tool came up empty in the viewer: points waited for an animation frame to fade in. In arrange mode they now show at once and the entrance animations are off.

## 2026-10-02 — v62.41 owner's second home layout

- HOME_LAYOUT and NOTES replaced with the owner's new arrange-tool values (all AI projects folded).

## 2026-10-02 — v62.42 Region filter only

- Platform filter removed (it repeated the two groups; Chinese social matched no case). `platforms` fields and PlatformKey removed; URL keeps ?region= only. X Creator and English Social Channel Growth markets EN → NA (owner: EN was mainly North America).

## 2026-10-02 — v62.43 Gamified Landing Page under North America and Europe

- Owner: the page was English for all English-speaking players, so it is listed under both North America and Europe instead of "Global" (which matched no region).

## 2026-10-02 — v62.44 region tags: landing page global, filter campaign adds Europe

- Owner: the Gamified Landing Page ran in every language → North America, Europe and Japan (not China: global Genshin version). Branded Filter Campaign also worked with European creators → US, EU, JP.

## 2026-10-02 — v62.45 dropped points return home; sharper landing-page visual

- Owner saw ZZZ sitting among the Paid & UA cases with lines crossing. Cause: after dragging a point on the home map, the pull back faded out before it arrived, and the avoidance forces then settled round the wrong spot. Dropping a point on the home map now reheats the layout, so it returns all the way.
- Gamified Landing Page visual replaced with the owner's higher-resolution banner (2050×1135, frame edge trimmed).

## 2026-10-02 — v62.46 owner's shorter titles

- Synced from the editor: ZZZ → "Social Launch in Japan", Branded Filter → "TikTok & Snapchat Filter Campaign", AI dashboard → "Creative Intelligence Dashboard". Owner wants titles simple; the game name stays on each card's identity line.

## 2026-10-02 — v62.47 AI Projects views tidied; layout-check 0

- The AI projects were bunched up because AI Projects moved but its folded projects kept stale HOME_LAYOUT spots, so the line to the dashboard was ~30 units long. Folded points no longer have home entries (normal line lengths apply). Small groups' siblings sit a little wider (siblingRing 150, siblingSpread ≈57°). layout-check: 0 over 35 views.

## 2026-10-02 — v62.48 home map always returns to the owner's layout

- Owner: after opening Creator & Social and going back, Social Launch in Japan sat over the Paid & UA lines. The home pull was scaled by alpha and faded before points arrived. It now keeps full strength while the layout runs, so every point gets home. Checked round trips via Paid & UA, Creator & Social, a case, AI, Information and HoYoverse: positions identical before and after. layout-check 0–2 (only ai-workbench when reached straight from an unrelated view).

## 2026-10-02 — v63 Creative Work galleries: Photography and Design

- Reviewed the owner's "Design & photography" folder (~400 photos, 3 X Mirror issues, ~28 posters). First cut: 99 photos in 6 series by place (Huangshi, Japan, Wuhan, Chicago, New York, Arizona) and 31 design images (X Mirror Issues 1–3, film screening posters). Owner removed the Antelope photo of herself and 10 alternates; she will cut more later.
- Photography and Design are real pieces now (no longer "in preparation"). Desktop: the gallery takes the map's place, three-column masonry per set, "← Map" back to Creative Work; the card lists the sets and scrolls the grid to one. Phone: two columns inside the card. Lightbox steps through every picture with ← →, arrow keys or a swipe.
- Web copies: 1600px long side + 900px grid thumbnails, EXIF (incl. GPS) stripped. List in `src/gallery-images.ts`, each row carries the owner's contact-sheet number.
- 2026-10-03 finish: grid keeps the owner's order left to right (each picture into the shortest column) instead of filling one column top to bottom; gallery now reaches the card (it was measured while the card was sliding in, L42); `content.ts` imports with a `.ts` suffix so `check` runs (L41). Checked desktop wide and narrow, phone, English and Chinese, lightbox with arrow keys. layout-check 2.

## 2026-10-03 — v63.1 photo-book layout for the galleries

- Owner found the even grid rigid and boring. Previewed four looser layouts (photo book, prints on a table, lead + contact sheet, filmstrip); she chose photo book. Rows now change size and rhythm (big + small, three staggered, one alone with space, small + big), with her order kept and a small number under each picture. Row shapes live in `BOOK_ROWS` (blocks.ts): five for desktop, four wider ones for the phone. Same layout for Design.

## 2026-10-03 — v63.2 galleries scroll up and down only

- Owner: no sideways scrolling. A landscape picture widened to 58% in a row meant for small pictures pushed the row past the column. Rows now shrink to fit, and the gallery never scrolls sideways. Checked desktop wide and narrow, Design, and phone: no row overflows (L43).

## 2026-10-03 — v63.3 owner's photo edit; phone galleries scroll sideways

- Applied the owner's choices from the Gallery Photo Manager: 54 removed, 97 added. New series **Europe** (Italy, France and Barcelona, 2024; one series so it isn't scattered, the three places in the subtitle). Design keeps only X Mirror Issue 2 (owner's note), now 36 pages in page order; posters 7. Photography 130 photos in 7 series, Design 43. Uploaded pictures were re-saved at 1600px / 900px.
- Phone: each set is one row of same-height pictures that scrolls sideways (owner: the page was far too long). Desktop keeps the photo book and still scrolls only up and down.
- Photo manager now also lets the owner drag photos to reorder them.

## 2026-10-03 — v63.4 desktop galleries: justified rows that follow the screen width

- Owner: the photo book felt more dynamic but too scattered, and the number of photos per row did not change with the screen. Rows now fill the column with no indents or loose gaps; photos in a row share one height. Photos per row follow a rhythm whose maximum depends on the gallery width (3·4·5·4 on wide screens, 2·3·4·3 on a laptop, 2·3·3 narrower) and re-flow when the window is resized. Phone unchanged (one sideways row per series).

## 2026-10-03 — v63.5 galleries: strongest photos first, colour flow, breathing room

- Owner: arrangement felt random and Huangshi opened on a weak photo. Re-ordered every photo series and the posters: the strongest pictures lead (Huangshi now opens on the two fire pictures), then the series moves in runs of related colour and subject. X Mirror stays in page order. Removed a duplicate in Chicago (same picture as Chicago 01).
- Owner: edge-to-edge rows felt too dense beside the card. Rows now take 100 / 82 / 92 / 76 % of the column, alternating left and right, with wider gaps and space before the card; pictures in a row still share one height and the count per row still follows the screen width.

## 2026-10-03 — v63.6 owner's own photo order

- Owner re-ordered the series herself in the Gallery Photo Manager (drag and drop) and removed 4 more photos (2 Huangshi, 2 New York). Applied exactly as she arranged them. Photography now 125 photos.

## 2026-10-03 — v63.7 back to the original photo book

- Owner preferred the very first photo-book layout (v63.1) to the justified rows (v63.4) and the spaced rows (v63.5). Restored it as it was, keeping her photo order, the no-sideways-scroll fix (L43) and the phone's one sideways row per series.

## 2026-10-03 — v63.8 map about 14% smaller

- Owner: make the whole map 10–15% smaller. The camera's steady scale went from 1.1 to 0.95 (minimum 0.7 → 0.6); points, labels and notes shrink together, positions unchanged. layout-check 2.

## 2026-10-03 — v63.9 left edges line up; card path goes back

- Map, gallery (with "← Map") and legend now start at 40px, in line with "Region" in the header (owner).
- The path at the top of a card (e.g. "Creative Work", "Paid & UA Growth") is now a link back to that level, so leaving a gallery is easier (owner).

## 2026-10-03 — v63.10 sharper gallery photos without a slower page

- Owner: the biggest photos looked blurry. Each photo now has three sizes (900px preview, 1600px, and a 2400px copy made from the original where the original is big enough). The desktop grid lets the browser pick by how big the photo is shown and how sharp the screen is (srcset), so small photos still load only the preview and photos still load as you scroll. The lightbox uses the largest copy.

## 2026-10-03 — v63.11 Creative Work is Design and Photography only

- Owner: Creative Work holds just Design and Photography. Removed the "in preparation" placeholders Video & Editing and AI Creative Videos. layout-check 2 over 33 views.

## 2026-10-03 — v63.12 group summaries final; session wrap

- Paid & UA Growth summary: "Data-backed creative testing for user acquisition: finding what drives installs, scaling what works and improving ROI." (owner chose A; wording from the JD language bank; no CPI, no gaming words).
- Creator & Social summary: "players" → "audiences" (owner chose A).
- Creative Work / Photography / Design copy: drafts in STATUS, not applied yet (owner: personal, natural, no marketing tie-in). Genshin Impact background line proposed for the INDEX intro, pending.


## 2026-10-03 — v63.13 Creative Work copy final, in the owner's words

- Owner: the earlier drafts sounded pretentious and not like a real person. Replaced with short, plain lines she chose: Creative Work "Outside of work, I enjoy photography and design."; Photography "Photos I take when I travel, one set per place."; Design "I was editor-in-chief of X Mirror, a student magazine at XJTLU." Chinese updated to match; [Draft] removed.

## 2026-10-03 — v63.14 Creative Work copy polished; Design left without a description

- Owner wanted her ideas polished, not quoted word for word. Creative Work: "Away from work, I love taking photos and designing things." Photography: "Photos from my travels, grouped by place." Design: no description for now (owner). Chinese updated to match.

## 2026-10-03 — v63.15 English only; INDEX key numbers fixed

- Owner: no Chinese version for now (no time to proofread it). Removed the language switch on desktop and phone; the site always shows English. zh strings stay in content.ts, unused.
- INDEX key numbers: "1% → 15%" → "0% → 15%" (owner: there was no such pipeline before her), label "brand-team share of UA spend" to match the case; "views from a JP creator matrix I scaled" → "organic views across 9 channels in Japan".

## 2026-10-03 — v63.16 INDEX: new draft bio, key numbers removed

- Bio draft A (owner): "I'm a growth marketer on the creative side: I find out which ads and content actually drive installs and engagement, then scale them. I spent three years at HoYoverse, the studio behind Genshin Impact, running campaigns across North America, Europe and Japan. Lately I've been building my own AI tools to do it faster." Highlight on "drive installs and engagement". Final bio to be written last.
- Removed the INDEX key-numbers block (owner: the map notes already highlight these). The stray pasted line after the bio is gone too.

## 2026-10-03 — v64 Creative Intelligence Dashboard: clickable prototype in the gallery's place

- Desktop: opening the dashboard folds the map and shows an English, clickable prototype of all eight screens (synthetic data from a fictional game), with a hand-written note pointing to its sidebar. Phone: the eight screens as a sideways row.
- New card copy (owner): built from scratch, solo, with Claude Code; UA teams use it; 30–40% less time on creative analysis; a display prototype, get in touch for the full project. No team line (solo build). Old placeholder media tile removed.
- Owner: no screen list in the card (too ugly); visitors click through the prototype itself.
- Connections: only the Creator Ad Pipeline (owner: the HoYoverse link was not direct). Removed HoYoverse → dashboard.

## 2026-10-03 — v64.4 dashboard: promo video in the gallery's place, app icon opens the prototype in a pop-up

- Owner's idea: the promo video takes the centre (a poster of the Overview screen with "Promo video coming soon" until the video exists), level with the card's INDEX bar.
- Beside it, an app icon with a hand-written note "click to try the app". One click (not a double-click: web visitors expect one) opens the clickable prototype in a large window over a dimmed, blurred page; Esc, the × or a click outside closes it.
- The prototype keeps its own colours again (the dark backdrop sets it apart). Phone unchanged: the eight screens as a sideways row.

- v64.5: the × sits above the pop-up's top-right corner instead of over the dashboard (owner).

## 2026-10-03 — v64.6 dashboard pop-up uses the site's one overlay; note underneath

- Owner: the pop-up's × (a white circle) did not match the photo lightbox. The dashboard now opens in the same lightbox (lightbox.ts `openFrame`): same dark background, same ×, Esc and click-outside. L44.
- Under the dashboard: "This is a display prototype with sample data. For details on the full project, feel free to get in touch."

- v64.7: the framed dashboard never exceeds its own size (1240px) or 80% of the screen width (owner: too big on large screens); the note under it is one line.

## 2026-10-04 — v64.8 dashboard page: layout C; sidebar hover fix; owner's copy

- Owner picked layout C from three previews: the video sits next to the card (48px, top level with INDEX, at most 960px wide), and an app bar under it (icon, name, "Clickable prototype · sample data", "Try the prototype") opens the prototype in the lightbox. The hand-written note and floating icon are gone.
- Prototype: hovering a sidebar item no longer greys out the selected one.
- Owner's editor edits: headline "40% less time on creative analysis & production"; shorter summary.

- v64.9: the app bar moves above the video (owner: the bottom of the screen felt heavy).

- v64.10: the video's top edge (not the app bar) lines up with the INDEX bar; the app bar sits above that line (owner).

## 2026-10-04 — v64.11 dashboard card: tags, What it does open, no summary

- Owner: "AI tool · built with Claude Code" line replaced by two tags, Vibe Coding and Claude Code, in the same tag style as every case's markets and platforms.
- "What it does" is unfolded when the card opens (new `open` flag on a section; every other section stays folded by default).
- Summary removed (owner emptied it in the editor).

## 2026-10-04 — v64.12 prototype: no notes squeezed beside buttons

- Owner: footer notes next to buttons were cramped. Script cards: "Built on …" removed (it repeats "Insights applied"); Edit moves into the card header. Tagging: "Bars show AI confidence" removed (the column is already labelled); "12 of 61 fields" becomes "+ 49 more fields" at the end of the list. Phone screenshots re-shot.

## 2026-10-04 — v64.13 phone: Photography and Design galleries folded

- Owner: on the phone, Photography and Design are the least important part, so their pictures start folded under "More +".

## 2026-10-04 — v64.14 map: AI Projects shows the dashboard's link to the Creator Ad Pipeline

- Owner: the dashboard should link to the Creator Ad Pipeline on the map. Opening AI Projects now also shows the Creator Ad Pipeline (faded) with a dotted line to the dashboard (`alwaysLinked` in content.ts). layout-check 0 over 33 views.

## 2026-10-04 — v64.15 dashboard: the promo video replaces the placeholder

- The 21-second promo video (no voiceover, music and sound effects, sample data only) now plays in the video's place: muted, looping, with a sound button in the corner. It pauses while the prototype is open and carries on afterwards; with reduced motion it does not start on its own. WebM first, MP4 as fallback. The "Promo video coming soon" placeholder and its string are gone.
- Video copy chosen by the owner: opening line "I built a tool to identify winning creatives and scale them."; small disclaimer "Display prototype. All data shown is sample data." away from "Built with Claude Code".

## 2026-10-04 — v64.16 promo video: its own controls, no endless loop

- Owner: the video could not be paused, had no progress bar and played non-stop. It now plays once (muted) and stops on a replay button. A control bar (src/video.ts) shows on hover, focus, pause or end: play/pause, a progress bar you can click or drag (arrow keys jump 5 s), the time, and the sound button. Clicking the video also pauses it. It pauses when the prototype opens and when the gallery is left.

## 2026-10-04 — v64.17 promo video v7: real recorded sound effects

- Owner: the synthesised sound effects did not sound high-end. v7 keeps the picture and music and uses real recordings from Kenney Interface Sounds and Kenney UI Audio (CC0, from GitHub): mouse press and release on every click, interface swooshes on screen changes, select clicks for tags, confirmation sounds, typing built from recorded switch clicks. OpenGameArt (keyboard pack) is blocked from both machines.

## 2026-10-04 — v64.18 handoff

- Session wrapped up at the owner's request (long conversation). Next session: Creative Work → Content Creation, adding her Chinese social media case. Handoff written at the top of STATUS.md.

## 2026-10-04 — v64.19 map: no more crowding under a region filter

- Owner: with a region filter the map was cramped, lines running through labels. Two mechanisms: (1) a group a filter unfolds on the home map now fans its ends out on its open side, like an opened group (`filterFanned`, `filterFanSpread`); (2) when every line of a point comes from below, its label moves above the point (`sideLabels`, `labelFlip`), and lines from above end over the label. The hand-laid home map is unchanged.
- layout-check now also visits the four region filters and counts a line crossing its own point's label: 17 → 1 over 37 views.

## 2026-10-04 — v64.20 map: with a filter on, clicking keeps the whole filtered map

- Owner: with a filter on, clicking a point used to narrow the map to it, so visitors lost the filtered overview. Now there are two modes: filter off, a click narrows the map as before; filter on, the map stays the full filtered view (same points, camera still) and the click only highlights the point and opens its card. In map.ts the selection (`picked`) is separate from the layout focus (`focus = filtering() ? null : picked`).

## 2026-10-05 — v65 Creator & Social: my own Xiaohongshu channel, marked Personal project

- Owner decided not to rename Creative Work (old photos and design aren't content creation). Her Xiaohongshu AI tutorial channel (`xhs-ai-channel`) is the sixth case under Creator & Social: the identity line reads "Personal project" instead of an employer, `org: ''`, team "Just me", and a hand-written note "my own channel" beside the point while the group is open. Auto-placed notes now meet the point from the side (`NOTE.sideRise`) so the arrow never crosses the label below the shape. Group summary now names Xiaohongshu and Chinese audiences. Blue keywords for What I did added to published-copy.json and the editor archive. layout-check: 2 over 38 views (hoyoverse, known; ai, the known ai-workbench order effect).

## 2026-10-05 — v66 map: points stay clickable when a filter zooms the map out

- Owner: with a region filter on, points shrank to ~10px and were hard to click. Points and labels now keep at least `CAMERA.pointMin` (0.8) on-screen scale however far the camera zooms out (`pointScale()`, applied per node; boxes and the filter fan radius scale by the same `pScale` so nothing overlaps); labels are part of the click target. Filtered views: shapes 14px+ (was 10–11). Tested 0.95 (6 overlaps) and 0.85 (4) before settling on 0.8 (layout-check 2/38, both pre-existing).

## 2026-10-05 — v67 Xiaohongshu case: a side hustle, with whole-account numbers

- Owner: the channel is a side hustle, not a job. Identity line "Side hustle", map note "my side hustle". The Challenge and The Team removed (there was neither); a case with an empty team no longer shows The Team (blocks.ts). Summary now says why: learning in public. Headline and results use whole-account totals to 2026-09-24 (1.8M+ views across Xiaohongshu and Douyin, 100K+ likes, 287K on one video) instead of 7.5K → 14K followers. What I did moved to sections.0 (published-copy keys renamed).

## 2026-10-07 — v68 Xiaohongshu case: AI Creator Channel, strategic What I did

- Owner: "tutorial channel" undersold it and What I did was too weak. Title is now AI Creator Channel. What I did rewritten at strategy level from CONTENT evidence: positioning against benchmark creators, follower conversion per 1K views (16× example), data-led pivots (dropped carousels and abstract topics), the AI agent workflow behind the channel, and brand partners (Alibaba's Qwen, ByteDance's Jimeng and Xiaoyunque, LiblibAI, Lovart).

## 2026-10-07 — v69 AI Projects: Creator Workbench, the system behind the channel

- Owner: her content operations system (an Obsidian workbench where AI agents research, analyse, draft and review) is her second AI project. Replaces the first "AI project" placeholder: card (Personal project; Vibe Coding · Obsidian · Claude Code · Codex; What it does ×5), a still of Home in the video's place (a prototype may now have no video: `video: []` shows `poster` as a button that opens the prototype), the clickable prototype in the lightbox and 8 screens on the phone. English copy generated by `scripts/workbench-en.py`. Dotted connection to AI Creator Channel. Channel case: "Test and scale" and "Content operations system" replace the two weaker bullets. Map: a connection whose own group isn't shown now spawns beside the selection instead of at the ✳ (it used to get stuck among other lines). `openApp` label is generic. layout-check 1/38.

## 2026-10-07 — v69.1 prototype screens use one image size

- A `screens` gallery uses the 1600px screenshot as its thumbnail too (no `-t.jpg`), for both AI projects. The site needed 524 files with the Workbench added; the preview Artifact holds at most 511. Now 508.

## 2026-10-07 — v69.2 Workbench prototype page renders in standards mode

- `scripts/workbench-en.py` adds a doctype, charset and viewport to the prototype (its source is a chat-preview fragment, which rendered in quirks mode as a page of its own). Screens and poster re-shot from it.

## 2026-10-07 — v69.3 Editor edits from this morning

- Synced three edits the user made in the editor at 08:29–08:56 that v69.2 missed: Dashboard "AI tagging" drops "with a human review step"; AI Creator Channel "Test and scale" shortened; AI Creator Channel "Follower conversion over views" removed.
- Not synced yet: a sentence she typed into the Dashboard headline field ("I vibe coded the dashboard from scratch…"); waiting for her to pick a polished version and where it goes.

## 2026-10-07 — v69.4 Dashboard line under the figure; "AI channel"

- New optional `headline.note` (one grey line under a card's headline figure, editable in the editor). Dashboard: "I built it from scratch while running creative strategy for Genshin Impact's creator ads." (owner picked version A and this placement.)
- AI Creator Channel summary opens "An AI channel I run on Xiaohongshu" (was "AI tutorial channel"; owner confirmed).
- Editor archive: headline label restored to the figure text only, note added; revision 1068.

## 2026-10-07 — v69.5 Xiaohongshu AI Channel and Creator Workbench rewritten at strategy level

- Renamed AI Creator Channel → Xiaohongshu AI Channel (owner). Summary: built from scratch, learn in public, now teaches beginners and earns from partnerships with China's leading AI companies.
- What I did, from CONTENT sources (strategy.md; 07-23 review of 73 own vs 35 viral posts; 09-03 platform-fit retro; brief-library; 10-04 review): Positioning (kept) · Content formula (new: 73 vs 35 comparison) · Test and scale (owner's wording) · Content operations system · Brand partnerships (adds MiniMax and Moonshot AI's Kimi, drops Xiaoyunque, per owner; sponsored videos solve a real task).
- Results: "287K views and 4.1K followers from one video" (4,109 attributed follows, 2026-09-24 export).
- Creator Workbench: summary = the system behind the channel, turned into a product for other creators; What it does = Built on a proven workflow · End to end · Human in the loop · Built for other creators (from PRD v0.1).
- The new items are written to content.ts and published-copy.json (blue keywords); the old per-item edits and the xhs list order are replaced.

## 2026-10-07 — v69.6 Creator Workbench promo video

- 21 s promo in the dashboard film's style (same hook layout, 120 bpm soundtrack, Kenney CC0 UI sounds): hook "I turned my content workflow into an AI workbench", five scenes (research, source breakdown, idea scoring, draft + approve, knowledge), end card "Creator Workbench · Built with Claude Code and Codex".
- `public/media/creator-workbench/promo.webm` (2.7 MB) + `promo.mp4` (3.4 MB), 1600×900; poster.jpg is now the end frame. Checked playing in the browser (L45).

## 2026-10-07 — v69.7 Xiaohongshu AI Channel written for future employers

- Owner: the case should tell an employer what she can do; a single video's views don't. Summary now: built from zero on Xiaohongshu and Douyin, a place to test growth ideas on a real audience with real data, and the creator side of brand deals with China's leading AI companies.
- Results: "287K views and 4.1K followers from one video" → "6 paid partners among China's top AI brands". Brand partnerships item: "Won paid deals…", plus "After years of briefing creators, I now deliver for brands from the creator side." Order: Positioning · Content formula · Test and scale · Brand partnerships · Content operations system.
- New lesson L48 and CLAUDE.md content rule: write for future employers.

## 2026-10-07 — v69.8 Xiaohongshu AI Channel: no "side hustle", no process details

- Owner: don't call it a side hustle (employers may read it as distraction); leave out details like how many posts were studied; no "team". Identity line removed, map note "my own channel".
- Summary: built from zero; run like a growth project (find the audience, test, scale, turn reach into partnerships with China's leading AI companies). What I did rewritten short. New lesson L49.

## 2026-10-07 — v69.9 No Team section on her own projects

- content.ts no longer gives projects with `org: ''` an empty `team`, so the copy editor stops showing an empty "The Team" on Xiaohongshu AI Channel (owner asked twice). Job cases unchanged. Lesson L50.

## 2026-10-07 — v69.10 AI Projects: two projects, Workbench linked to the channel

- Removed the placeholder `ai-slot-2` (owner: only two AI projects) and the unused `prep` label.
- Creator Workbench `alwaysLinked: ['xhs-ai-channel']`: opening AI Projects shows the channel beside it, like the Dashboard and Creator Ad Pipeline.
- map.ts: points shown only as a group child's link spawn last, beside that child and away from the group, instead of at their home in another group (the channel had dragged the whole view sideways). layout-check back to 1/37 (old hoyoverse item).
- Xiaohongshu AI Channel Results: two (views, likes), matching the owner's editor edit. Editor archive and published copy compared field by field: identical.

## 2026-10-07 — Filter view experiments dropped

- Owner rejected both versions on branch `filter-flyup` (cards flying out of a pile; the map's points lined up into a tree with a pile). The filter view stays as it was (v69.10). The branch is kept for reference only and is not merged.

## 2026-10-07 — Home map: metro map "Rising" (draft, SPEC only)

- Owner chose a metro-style home map: the career line rises on a 45° diagonal from XJTLU to Now; Education loops from XJTLU to Seminary Co-op; Paid & UA and Creator & Social branch from HoYoverse; AI runs from Now to the Xiaohongshu channel; Creative branches from XJTLU. Brand only colours. Key cases as big double rings, other work as small dots. Connections from `related` drawn as a dotted transfer only when one end is clicked. Written into SPEC as a draft; site code unchanged.

- Metro draft update: owner chose the "Next stop" ending (career line solid to HoYoverse, dotted track to an open station "Open to growth marketing roles"; AI line from HoYoverse). No "Now" dot, no "?". Creative line kept short (longer parallel version rejected). SPEC updated.
- Metro draft update 2: final ending = "you at the top" shape with ✳ labelled "Next stop · AI-powered growth marketing"; AI line hangs from ✳. Education line renamed Campus line; other names unchanged.

## 2026-10-07 — v70 (branch `metro-map`): metro map built into a test copy

- New `src/metro.ts` (same MapApi as map.ts) draws the Rising metro map; main.ts uses it. Stations open the existing cards; lines (and their names) open their groups; ✳ Next stop opens "Let's talk". Connections (`related`) drawn as a dotted transfer when a connected case is opened. Region filter fades non-matching stations and names the matching ones.
- Line colours derived from the base colours in `:root` (`--line-*`), no new colours. Legend: key case / more work / Campus line. `mapLabel` added for short map names (XJTLU, UChicago, Seminary Co-op). Old shape legend strings removed.
- Not yet: INDEX rows still show the old shapes; arrange tool and layout-check don't cover the metro map; the phone is unchanged (no map).
- v70.1 (metro-map): the card and the phone now use metro marks instead of the old shapes: a short piece of each line in its colour (hollow for Campus), with a station on it for a single case, job or school; Information and Let's talk keep the ✳. One decision point: `markFor()` in metro.ts (line from `lineKeyOf`), drawing in `lineMark()` in shapes.ts. Line names stay as they are (owner).
- v70.2 (metro-map): hand-written notes removed from the metro map; key stations get a result tag in their line's colour (owner's pick C of ten looks). Words in `mapTag` (content.ts); sizes in `METRO.tag`. No key in the INDEX (owner: repetitive).

## 2026-10-08 · v71（分支 metro-map）
- 地铁图按原型 Artifact「Metro Ride」逐条确认后落地（SPEC 顶部 v71 一条）：
  - 粗细 Medium：线 6px，站圈描边和半径缩小（`:root` `--m-*`，`METRO.radius`）。
  - 一个标记一个意思：双圈 = 重点案例，大单圈 = 换乘站，小圈 = 其他站；名字跟标记走（粗 / 常规），全部黑色。图例改为 KEY CASE · INTERCHANGE · OTHER STOP · EDUCATION。卡片列表里地图上的条目带同样的标记（`listMark`）。打开一条线时其他线上的文字隐去。
  - Curate your ride 取代 Region：白色按钮展开成面板（`ridePanel` / `syncRide` / `wireRide`，blocks.ts），Rides（`rides`，content.ts）、Target market、Platform（新字段 `platforms`）；网址 `?ride=&region=&platform=`；手机三个下拉框。
  - 骑行：单向路线排序编号（`METRO.route`），轨道按线色点亮、已走部分平滑生长、前方淡色；骑行条固定尺寸，文字滚动切换；终点按钮填充 → 到站（Let's talk ↗ 打开 Let's talk）、轻量暖色彩屑（地图不可见时从按钮喷出）。
  - 卡片列往右（`--side-at` 80vw）、顶部与地图的「Next stop」齐平；放不下时退回原来的位置。
- `--note` 的用途扩展到到站提示和彩屑（CLAUDE.md 颜色规则已改）。
- v71.1（10-08）：Next stop 去掉副标题，站圈改为点状虚线（`.mt-open`）。用户电脑上的工作副本切到 `metro-map` 分支，本地预览才显示 v71。
- v71.2（10-08）：地图站名全部一行；长标题用短名（`mapLabel`，只省略不改名，卡片仍是全名），`METRO.wrap` 24；UGC Channel Test 名字移到左边。用户担心会不会混淆：点开就是全名，短名只是省略词。
- v71.3（10-08）：浮动图片不再压住地铁图：避让对象改为地铁图的站点（含名字和标签）、线名、Next stop，以及沿每条线每 8px 取样的点（淡出的线也算）；地图入场动画结束前不显示；上半屏找不到空位时再找到图例上方。English Social Growth 恢复两行，免得一行压在线的弯道上。
- v71.4（10-08）：卡片列回到垂直居中（上下边距相同，展开多高都居中）；地图画框贴着内容（`METRO.view` y 140、h 625），地图也居中；去掉 v71 的「卡片顶部与地图齐平」。浮动图片不再随机：在不压住任何线、站、名字的空位里，取离该案例站点最近的那个，同一个案例每次位置相同。
- v71.5（10-08）：卡片列表去掉所有圆点；重点案例名字后面一个慢慢转动的蓝色 ✳（`.nkey`，`--spin-key`）。地图所有站名同一粗细（粗）。Creative Dashboard 名字移到 AI 线右边。AI 两个案例不再用视频替换地图：站点旁浮出「Try the prototype」条（白底无描边），点开是站内唯一的弹窗，先放演示视频，上方切换到可点原型（原型点到才加载）。浮条可以盖住淡出的线，不盖当前打开的线和站。
- v71.6（10-08）：卡片列表的圆点恢复（用户：没有圆点缩进看着别扭），重点案例名字后仍是转动的 ✳。点地图周围的空白处也回到默认地图（之前只有点 SVG 内部才回去）。「Try the prototype」条先找完全空白的位置，没有时才盖住淡出的线。
- v71.7（10-08）：卡片列表去掉重点案例的 ✳（用户：看着不对），只留圆点。两个 AI 应用各有图标（`prototype.icon`，图形在 shapes.ts `APP_ICONS`：Dashboard = 上升的柱状图，Workbench = 三栏看板）。「Try the prototype」条贴着站点放（站点和名字的左边 / 右边 / 下面 / 上面，间距 14px，取第一个不压住当前线和站的位置），找不到才退回最近空位。
- v71.8（10-08）：Creator Workbench 的名字放到线右边，给左边的「Try the prototype」条腾出位置（条子现在紧贴站点）；AI LINE 线名移到线左边，不再被 Workbench ↔ Xiaohongshu 的连接虚线穿过。
- v72（10-08）：地铁图站名重排（用户在 Artifact「Station Name Layouts」选 A · Calmer）：每条线的站名固定在一侧；名字与站圈的距离从圈外沿量起，统一 11（`labelGap`，替代按标记分的 `labelOff`）；顶部一排两站的名字 45° 斜写（`pos: 'rise'`），站点拉开；Creator & Social、AI 线名竖着沿线写，底部一排只剩站名；Campus 线名与 UChicago 分开（UChicago 移到 290）；画框上沿到 y 50。layout-check 0 处重叠。
- v72.1（10-08）：Curate your ride 的路线与 Target market / Platform 互斥（选一边清掉另一边；市场 + 平台可组合）。`state.ts` `exclusive()`；手机下拉框选完后同步显示被清掉的项。
- v72.2（10-08）：地图最大缩放 1.1 → 0.9（她笔记本 ≈1460×866 上地图显得巨大，测试站窗口小所以看着正常）；骑行条留在左下、抬到图例上方，地图下方为它留 `--ride-band`；浮动图片避开它。
- v72.3（10-08）：手机版去掉 Rides 下拉框（没有地图就没有路线），只留 Target market 和 Platform；带 ride 的链接在手机上打开时去掉路线。
- v72.4（10-08）：首页卡片展开分组时，地图只显示那条线（`wirePanel` 的 `onSection` → `map.setFocus(组)`），收起恢复。
- v72.5（10-08）：修复 v72.3 的错误——电脑版选路线后 Start ride 条不出现（手机页在电脑上也会生成，`dropRide()` 把路线清掉了）。现在只在手机断点时去掉路线。
- v72.6（10-08）：地图图形缩 10%、字号保持（`--m-type`）；页头按钮和 Resume / Let's talk 小 10%（`--fs-nav`）；路线面板、Start ride 条小 10%；卡片不变。原因：她在 Claude 应用里看到的测试站被显示成约 90%，她更喜欢那个比例。
- v72.7（10-08）：清理样式里写死的数（用户要求）：两处以上用到的间距、圆角、时长、字号、线宽共 45 个，全部改成 `:root` 变量；浮动图片 / 原型条的位置参数移到 CSS（`--fv-*`）。新增 `check` 规则 `repeated-style-value`，尺寸检查也覆盖 floating-visual.ts、lightbox.ts。像素对比：电脑四个视图、手机（关闭动画）完全一致，图片位置一致。
- v72.8（10-08）：Next stop 点击不再有蓝框；悬停时名字换成「Let's talk ↗」，✳ 转动（`.tl-a/.tl-b`、`.mt-arms`）。
- v72.9（10-08）：页头正中加她的名字（只有名字，`.top-name`）；Next stop 恢复始终显示「Next stop」（v72.8 的悬停换字撤回，她没有这个意思），保留去蓝框和 ✳ 悬停转动。
- v72.10（10-08）：修复骑行终点点 Let's talk 时的闪屏（先跳转再清路线，`leaveRide()`，L56）；她的名字改放 INDEX 卡片顶部（名字 + 职位，方案 C），页头去掉名字。
- v72.11（10-08）：卡片列整体 90%（`--card-zoom`，CSS zoom）；卡片高度上限按 zoom 换算（main.ts `fitSide`）；列上下留白 32 → 12px。她笔记本上长案例不用再往下滚。
- v72.12（10-08）：骑行经过但不停的站保持正常站圈（`.on-route`），去掉 HoYoverse 处蓝线转黑线时的灰点。骑行条样式不变（Artifact「Ride Bar Styles」六种方案，她选保持现状）。
- v72.13（10-08）：原型条精简为图标 + 「Try the prototype」；`beside()` 加四个斜角、骑行时可盖住路线外的线、可贴近卡片；兜底改为最近的空位。她笔记本尺寸下，有无骑行都紧贴站点，底部只剩骑行条。去掉不用的 `ui.appBarSub`。
- v72.13（更正，10-08）：撤回精简原型条和新的找位规则（她要原样）；只加一条：骑行时原型条离骑行条太近就上抬（`--fv-ride-gap` 28px），没有空位时放在骑行条上方而不是隐藏。
- v72.14（10-09）：原型条找不到空位时直接贴在站点旁（`beside(w, h, true)`，可盖住地图），骑行时路线外的线可盖，始终在骑行条上方。
- v73（10-10）：全站文案重写（global growth & creator marketing，英式拼写，JD 词库，`docs/copy-vocab-spec.md`）；INDEX 三行简介 + 关键词筛选；骑行改为五条，新增传记骑行「My story in five minutes」（专用路线、站点叙述在骑行条上方、UChicago 站移到 (410,490)）；Results 移到 How it worked 前；/wenyi.md + /llms.txt；Creator OS 宣传片重渲染。
- v73.10–73.13（10-10）：Let's talk 卡片重做：头部 CONTACT、行样式同案例分区、邮箱上线、去掉 Resume 行、复制改右侧图标；右侧图标（← × + –）统一 `--icon-r` 对齐，INDEX 条预留滚动条宽度。
- v74（10-10）：地图开场：线路从 XJTLU 长出（2 秒，`--m-intro`），站点随线路出现；去掉地图滑入；Next stop 改问号。
- v74.1（10-10）：修复开场闪出整张图（同一任务内先隐藏；重绘时保持开场进度）；AI 线从 Xiaohongshu 往上长、落在 Next stop（`METRO.introReverse`）。
- v75（10-10）：编辑审稿（资深营销 + 英国招聘方两个角色）后的 55 处文案修改，她逐条确认：INDEX 职位「Creative Strategist · Paid & Creator Growth」（一行放得下）；AI 一句去掉 faster and sharper；Information / Experience / Creative Work 去掉 passionate、I love；creator ads (UGC) 统一；Results 统一「+N% vs target / N% lower X vs Y / ~」；日期统一月 + 年；市场顺序 Japan 在前（她：日本经验最多）；Landing Page 团队行写清她设计了玩法和创意；English Social 改为 Shaped / Proposed（她是支持角色）；Snapchat 「#1 in Snapchat’s sponsored Lens ranking」（来源她的案例文件）；HoYoverse 经历职位「Global Marketing Specialist」（案例卡片里的团队行仍为 Global Marketing，否则换行）；Resume → CV；骑行「My career in five minutes」，九段叙述改得更成熟。全站 `text-wrap: pretty`：段落最后一行不再只剩一个词。改动由 `.copy-rework/apply-v75b.mjs` 同时写进 content.ts、published-copy.json、编辑器存档（revision 1107）。
- v75.1（10-10）：修复地图开场先闪出整张图（她发现）。两个原因：① 构建会把 CSS 时间压缩成秒（2000ms → 2s），`cssMs()` 只读数字，开场只有 2 毫秒，发布版里开场根本没播；骑行列车、到站、彩屑的时长同样受影响，一并修好；② 站点隐藏时套用了地图通用的淡出（`[data-l]` 的 transition），前几帧整张图慢慢淡出。现在开场第一帧只有 XJTLU。`check` 新增 `css-time-unit`。
- v75.2（10-10）：传记骑行去掉全部站点叙述（她：多余，而且读着尴尬）。只剩骑行条 + 卡片；叙述机制（`rides.*.notes`、`.mt-note`）保留不用。
- v75.3（10-10）：传记骑行改名「My path so far」（她：不只是职业，还有学校和自己的项目；和站内 "Path" 一致）。
- v75.4（10-10）：传记骑行改名「Career highlights」（她：这条只是重点，不是整张地图；"My path so far" 听起来像整张图）。
- v75.5（10-10）：传记骑行改名「Highlights」（她：包含学校，不能叫 career）。
- v75.6（10-10）：传记骑行改名「Express route」（她选的：像快车只停关键站）。
- v75.7（10-10）：INDEX「Global.」一行拆成两句（她：「including three years at HoYoverse」不合逻辑）：I’ve run campaigns for audiences in Japan, North America, Europe and China. Most recently, I spent three years in global marketing at HoYoverse, the studio behind Genshin Impact.
- v75.8（10-10）：一页英国版 CV 上线到分支：`public/Wenyi_Zhu_CV.pdf`，`site.resumePdf` 已填，CV 卡片的 Download PDF 可用。版式仿她 0403 的 Word 简历（EB Garamond 11.6pt，A4）；每条按 XYZ（结果 + 数字 + 方法）；英国版只留 HoYoverse、自己的频道、Nike；职位写真实头衔 Marketing Specialist, Global Marketing；不放电话（公开网站）。源文件：她电脑 `career/resume-versions/Wenyi_Zhu_CV_source.html`（Chromium 打印成 PDF）。
- v75.9（10-10）：CV 去掉所有第一人称（I designed、I built、my own），去掉 UChicago 论文一行（她：对营销岗没有意义）。
- v75.10（10-10）：CV 按 JD 原词库补关键词（不改事实）：performance creative / user acquisition (UA) / creative testing roadmap / translate performance data into creative insights / codify winning patterns into playbooks / scale what worked, cut what didn’t, document / not just reach / creator lifecycle / viral loop；Skills 加 paid social、experimentation、Meta (Facebook, Instagram)。不用 CAC、ROAS、投放工具名（她没负责）。11.5pt 一页。
- v75.11（10-10）：CV 去重复（她：scale / cut 太多）：每个标志性说法只出现一次（scaling what worked, cutting what didn’t 只在日本频道；translates performance data into creative insights 只在看板）；四个 Grew 开头换成不同动词。11.6pt 一页。
- v75.12（10-10）：CV 终稿语法检查：Won…while running（时态统一）；Drew 9.5M+ visitors… with 3× the benchmark conversion rate；Dashboard (built with Claude Code) that tags；the creators that core players follow。她确认 CV 定稿。
- v75.13（10-10）：CV 自己频道两条重组（她）：第一条 = 数字 + 付费合作；第二条 = Creator OS（一人运营整个频道）。
