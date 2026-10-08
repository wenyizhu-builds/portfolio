# SPEC — 作品集网站的设计定稿

> **唯一的设计依据。** 改设计 = 直接改这份文件里对应的那一行（并在 `CHANGELOG.md` 记一笔），不要另开新文件。
> 最后更新：2026-10-07 · 对应版本 v69.10（地铁图为草稿，待确认）

- **地铁图 v71：线条变细、站点标记统一、「Curate your ride」（2026-10-08，用户在原型 Artifact「Metro Ride」里逐条确认）**。取代下面 v70 里的地区筛选、站点分级和字体规则。
  - **粗细（用户选 Medium）**：线 8 → 6px，站圈描边 ×0.85、半径 ×0.92；只改 `:root` 的 `--m-*`。
  - **一个标记一个意思（地图、图例、卡片列表一致）**：◎ 双圈 = 重点案例；◯ 大单圈 = 换乘站（XJTLU、Seminary Co-op、HoYoverse、Xiaohongshu AI Channel）；∘ 小圈 = 其他站（其他作品、工作、学校）。名字跟标记走：重点案例和换乘站粗体，其他站常规；全部黑色，不再有灰色小字。工作和学校的名字常显，其他作品悬停或打开线时显示。图例：KEY CASE · INTERCHANGE · OTHER STOP · EDUCATION。用户：标记不能一会儿表示重点、一会儿表示换乘。
  - **打开一条线时**，其他线上的名字、标签、线名全部隐去（只留淡线和站点），避免重叠。
  - **Curate your ride（取代页头的 Region）**：左上一个白色圆角按钮「✳ Curate your ride ⌄」，无描边无阴影；点开时按钮下沿变直，面板从按钮下方展开，两者连成一块白色（用户选 A；否决了黑色、蓝色、lime、纯文字）。已选内容写在按钮里同一行（「Curate your ride · Must-stops · Japan」），不另放。面板三组，选中项为钴蓝底白字：
    - **Rides**（现成路线）：Must-stops（TikTok UGC Channel Test、Creator Ad Pipeline、Social Launch in Japan、Filter Campaign、Dashboard）· Creator marketing（UGC、Pipeline、Giveaway、X Creator、Filter）· Built with AI（Xiaohongshu、Workbench、Dashboard）· The whole journey（XJTLU → NOWNESS → Weber → Nike → Seminary Co-op → HoYoverse → Japan → Filter → Xiaohongshu → Workbench → Dashboard；不含 Paid & UA，因为单向行驶不能倒回 HoYoverse）。路线在 `content.ts` 的 `rides`。
    - **Target market**（原 Region 改名）：North America / Europe / Japan / China。
    - **Platform**：TikTok、YouTube、X、Instagram、Snapchat、Meta、Google Ads、Xiaohongshu；每个案例的 `platforms` 字段（不从标签文字里解析，L8）。
    - 三组同时生效（取交集）。网址 `?ride=&region=&platform=` 可分享。手机版仍是下拉框（三个）。
  - **骑行视图**：选了任何一项，所有不在路线上的线、站、文字淡成 8% 灰，路线经过的轨道（含站与站之间的线段）保持原色。站点按**列车单向行驶的顺序**编号（Paid & UA 从末端往 HoYoverse，或 Career 从 XJTLU 往上 → Creator & Social → 小红书 → AI 线往 ✳），编号在小圆角方块里（不用圆，用户：圆太多）；Rides 以外的筛选只编号作品，不编号工作和学校。
  - **骑行条（左下，黑底，固定尺寸）**：开始前「Start ride → · Your ride / N stops · 名称 · ×」；骑行中「← · Next stop → · 站名 / 3 of 5 · next: 下一站 · ×」。按钮位置和大小固定，文字像到站牌一样上下滚动切换（后退时反向），按钮文字交叉淡入。每一站在卡片里打开对应案例。
  - **你在哪里（用户选 A · Line fills）**：已走过的轨道从上一站平滑长到这一站，前方轨道为 30% 淡色；当前站 lime 填充、编号黑底 lime 字；已过站编号钴蓝底，未到站编号淡钴蓝底。开始后其他站名隐去（悬停可见），只显示当前站名；骑行中所有站名同一字号、同一粗细、同一颜色（平时的地图保留层级）。不画列车小点、不闪烁。骑行中不画换乘虚线。
  - **终点**：点进最后一站时，按钮显示「Arriving…」并从左到右被暖橙填满，时长等于列车到站时间（≤0.8 秒，期间不可点，防止连点跳过）；到站瞬间：站点弹一下，骑行条轻跳，按钮变暖橙并扫过一道光，文字「Let’s talk ↗」（点击打开 Let’s talk），文字滚动为「End of the line ✳ / You rode all N stops. Thanks for riding!」，同时从站点喷出轻量彩屑。用户：不能像卡住了。
  - **彩屑**：约 34 片，取自地图本身的形状（短轨道段、小圆圈、✳），颜色为暖色：`--note` 橙、lime、两者的混合及与底色的混合；慢速飘落带轻微摆动，约 2.4 秒淡出后移除画布（按需运行，L4）。减少动态效果时只有站点弹一下。**`--note` 的用途扩展为：地图手写批注 + 终点的到站提示和彩屑。**
  - **地图上的站名（v71.2，用户选 B）**：每个站名一行。长标题在地图上用短名（`mapLabel`），规则：只用标题里的词、顺序不变（不改名，只省略），卡片和骑行条仍显示完整标题：UGC Channel Test、Filter Campaign、Creative Dashboard、Xiaohongshu Channel、Community Giveaway、English Social Growth、Xbox Launch；Social Launch in Japan 保持原名。UGC Channel Test 的名字放在线的左边，离开 Next stop。
  - **卡片列表（v71.7，用户）**：条目只用圆点，不标重点案例（试过双圈/大圈、转动的 ✳，用户都否决）。
  - **站名粗细（v71.5，用户）**：地图上所有站名同一粗细（粗）；层级只靠标记。
  - **AI 案例（v71.5–71.7，用户）**：电脑版不再用演示视频替换地图，也不自动播放。站点旁浮出「Try the prototype」条（白底、无描边无阴影；紧贴站点和名字，依次试左、右、下、上，间距 14px，不压住当前打开的线和站，可以盖住淡出的线；每个应用自己的图标：Dashboard 柱状图、Workbench 三栏看板）；点击打开弹窗：上方「Demo video | Try the prototype」切换，先放视频，原型在切换时才加载；× / Esc / 点背景关闭。手机版不变（截图）。
  - **顶端 Next stop（v71.1，用户 10-08）**：去掉副标题「AI-powered growth marketing」，只写「Next stop」；站圈改为点状虚线（还在建的站），中间仍是 ✳。
  - **右侧卡片**：比 v70 再往右（`--side-at` 80vw），和地图留出更大的间距；整列**垂直居中**（v71.4，用户：展开后也要居中），地图画框贴着内容，所以地图也居中。
  - **案例图片（v71.4）**：不再随机出现；放在不压住任何线、站、名字的空位中离该案例站点最近的一处，同一案例位置固定。INDEX 的分组照旧是原地展开、其他分组仍可见。
  - **站名排法（v72，用户 10-08 选「A · Calmer」）**：每条线的站名固定在一侧——Career、Creative 在左；Paid & UA 竖段在左；Creator & Social、AI 在右；底部一排（English Social Growth）在线下；Xiaohongshu Channel 在右。站名和站圈之间的距离一律从**圈的外沿**量起，`METRO.labelGap` 11（大圈不再把名字拉近）。顶部一排（Landing Page、Xbox Launch，同一段平线上有两站）的站名从站点起 45° 向右上斜着写（`pos: 'rise'`），站点拉开到 225 / 365；名字只在线旁时换行，上下和斜写都是一行。线名沿着自己的线、放在没有站名的一段旁边：Creator & Social、AI 竖着写在线左侧；Campus 线名在 XJTLU 和 UChicago 之间，UChicago 移到 290。画框上沿到 y 50，斜写的名字展开时不出框。站名字体不变（粗、13px），线名样式不变。
  - **筛选互斥（v72.1，用户 10-08）**：现成的路线（Rides）是一整套选择，和 Target market、Platform 互斥：选路线会清掉另外两个；选市场或平台会清掉路线。市场和平台可以组合。电脑版面板的规则；网址里同时带了路线和其他筛选时，以路线为准。
  - **地图大小和骑行条位置（v72.2，用户 10-08，她笔记本上看地图太大、骑行条藏在最下面）**：地图随窗口缩放，但最大只到 0.9（`METRO.maxScale`，原 1.1）——测试站里她觉得合适的大小，站名字号不会大过卡片文字。骑行条（Start ride）仍在左下，但从最底边抬到图例上方（她明确：往上挪一点，不要挪到顶部）；地图下方为它留一条 `--ride-band`（74px），条子不压线。
  - **手机版没有路线（v72.3，用户 10-08）**：手机上没有地图，所以筛选只剩 Target market 和 Platform 两个下拉框（两列）；带路线的分享链接在手机上打开时，路线被静默去掉（`dropRide()`）。
  - **INDEX 展开 = 打开那条线（v72.4，用户 10-08）**：在首页卡片里展开一个分组（Paid & UA、Creator & Social、AI、Creative、Experience、Education），地图只亮那条线，其余淡出，和点地图上的线一样；收起后整张地图恢复。卡片仍是原地展开，不跳转。
  - **整体小一号（v72.6，用户 10-08）**：地图图形再缩 10%（`maxScale` 0.81），但站名、线名、标签、编号在屏幕上的大小不变（`--m-type` 1.111 同时放大字和为字留的空间：行高、标签胶囊、编号方块、名字与圈的距离）。Curate your ride、Resume、Let's talk 字号 16 → 14.5（`--fs-nav`）；路线面板和 Start ride 条小 10%（`--fs-ride` 12.6、`--ride-w` 432、`--bar-*`）。右侧卡片完全不变（她说卡片字号刚好）。
  - **Next stop（v72.8–72.9，用户 10-08）**：点击不再出现浏览器的蓝色方框（键盘聚焦时站圈变蓝）；悬停时 ✳ 转 45°，和 Curate your ride 按钮一样。名字始终是「Next stop」（她明确不要换成 Let's talk；点击打开卡片里的 Let's talk 就够了）。没有用问号：✳ 是她的标志。
  - **她的名字（v72.10，用户 10-08 最终选 C）**：INDEX 卡片最上面，介绍文字之前：「Wenyi Zhu」（字号同案例标题 `--fs-case-title`，卡片不新增字号）+ 职位一行（小号大写灰字，同卡片标签）。页头不放名字（v72.9 试过放在正中，她改选 C）。手机版顶部本来就有名字，不变。
  - **卡片也小 10%（v72.11，用户 10-08）**：卡片列（INDEX 条 + 卡片）整体 90%（`--card-zoom` 0.9，用 CSS `zoom` 作用在列里的盒子上，字、间距、宽度一起缩；`--side-w` 同比）。列上下留白 32 → 12px（`--side-nav-gap`），笔记本上长案例也能一眼看完。至此电脑版整体就是她在 Claude 应用里看到的 90% 大小（v72.6 已缩页头、地图图形、骑行控件）。
  - **骑行经过的站（v72.12，用户 10-08）**：路线经过但不停的站（第一站和最后一站之间），骑行时画成正常的站圈、不显示名字和编号，不再是压在彩色轨道上的灰影；换乘站的圈正好盖住两条线颜色交接的地方。骑行条样式保持不变（她看了六种方案，决定不换）。
  - **原型条和骑行条不挤（v72.13，用户 10-08）**：「Try the prototype」条样式不变（名字 + 「Clickable prototype · sample data」 + 按钮；试过精简版，她觉得原来的好），位置规则也不变；只是骑行时，如果它离下面的骑行条太近，就往上抬到至少隔 28px（`--fv-ride-gap`）。小屏骑行时找不到空位，也不再隐藏，放在骑行条正上方左侧。
  - **原型条紧贴站点（v72.14，用户 10-09）**：先找站点旁完全空的位置（左、名字右、下、上；骑行时没用到的线可以盖）；找不到就直接放在站点旁边、可以盖住地图（她：可以和地图重叠，就要在点旁边），不再漂到远处或掉到底部；始终在骑行条上方留 28px。
  - 所有动效按需运行（有东西在动才请求下一帧）；减少动态效果时直接跳到终态。

- **首页地图改为地铁图「Rising」（v70 草稿，2026-10-07，用户选定形状，交互待确认后再动代码）**。原型：Artifact「Metro Map Plans」。
  - **线路（每条线都在真实发生的地方接入网络，不能有孤立的线）**：
    - Career line（灰 `#8a8a86`）：XJTLU → NOWNESS → Weber Shandwick → Nike → Seminary Co-op → HoYoverse → ✳，沿 45° 从左下升到右上（用户：「I am rising」）。顶端 ✳ 站名「Next stop」，副标题「AI-powered growth marketing」（用户 10-07 最终选：「you at the top」的形状 + 名字换成 Next stop + AI；副标题措辞待她确认）。
    - Campus line（教育，同灰色、空心线）：XJTLU → UChicago → Seminary Co-op。和 Career 在 XJTLU 同起点（实习在大学期间），在 Seminary Co-op 汇合（UChicago 旁的书店），两条线围成一个环。
    - Paid & UA line（钴蓝）、Creator & Social line（墨黑）：都从 HoYoverse 分出。
    - AI line（lime `#b7e03a`）：从顶端 ✳ 出发 → Dashboard → Workbench → Xiaohongshu AI Channel，与 Creator & Social 在小红书频道换乘。
    - Creative line（淡紫 `#9aa0ff`）：从 XJTLU 分出的一小段（Design、Photography）。试过加长成与 Career 平行的线，用户：更难看，保持短的。
    - 线名：Career / **Campus**（教育）/ Creative / Paid & UA / Creator & Social / AI line（用户：只把 Education 改成 Campus line）。
    - 配色用「Brand only」，线色只用于地图（扩展 7 色规则，需在 `:root` 增加线色变量，待用户最终确认）。
  - **站点（两级，像真地铁图）**：重点案例 = 大双圈 + 粗体名字 + 手写批注；其他作品 = 小圆点，名字悬停或打开该线时才显示；换乘站（XJTLU、Seminary Co-op、HoYoverse、小红书频道）= 最大双圈。工作和学校名字常显、灰色小字。不显示日期。
  - **没有「Now」点、没有「?」站**（用户：Now 没有意义，? 像玩笑）。✳ 只在顶端，代表「下一站」。不写「next stop: your team」。试过的结尾：Next stop 空心虚线站、AI 是最新一段、名字在顶端——最终是名字位置换成 Next stop + AI。
  - **交互**：悬停小点显示名字；点线、线名或 INDEX 一行 → 其他线淡出，该线所有站显示名字，卡片列出该线全部站（重点在前）；点任一站 → 卡片打开该案例；× / Esc 返回。
  - **连接（换乘虚线）**：沿用 `content.ts` 的 `related`：Creator Ad Pipeline ↔ Dashboard、Workbench ↔ 小红书频道。只在点开其中一端时画一条流动的点状弧线，两端点亮（荧光绿），卡片显示「Connected」及一句原因。平时不画。
  - **结果标签（v70.2，用户从十种里选 C）**：地铁图上不再用手写批注。重点站名下方一个小圆角标签，颜色跟所在线（Paid & UA 钴蓝白字、Creator & Social 黑底白字、AI lime 黑字）：3.7× LTV、80M+ views、600M+ views、Built with AI。文字在 `content.ts` 的 `mapTag`。不做图例/编号说明，INDEX 卡片保持干净（用户：重复）。
  - **不变**：页头、地区筛选、右侧 INDEX 卡片位置、案例卡片内容。
  - **待定**：地区筛选在地铁图上的表现；手机版（手机无地图，列表不变）；批注最终位置由用户在排版工具里摆。

- **Creative Work 只有两项（v63.11，用户）**：Design 和 Photography。去掉占位的 Video & Editing、AI Creative Videos。

- **图库清晰度（v63.10，用户：大图发虚，但页面不能太慢）**：每张照片三种尺寸：900px 预览（`-t.jpg`）、1600px（`.jpg`）、2400px（`-l.jpg`，从原图生成；原图不够大的没有，如 X Mirror 页面）。电脑版网格用 `srcset` + `sizes`，浏览器按照片显示的大小和屏幕清晰度自己挑，所以小图仍只下载预览，大图在高清屏上才用大尺寸；照片仍是滚到才加载。灯箱用最大的那份。手机版横排只用预览。

- **左边对齐（v63.9，用户）**：地图、图库（含「← Map」）、图例的左边距 `--map-inset` 改为 40px，与顶部「Region」对齐（= `--page-x`）。
- **卡片顶部的路径可点（v63.9，用户：从图库出去不直观）**：卡片左上角的路径（如「CREATIVE WORK」「PAID & UA GROWTH」）每一段都是链接，点了回到那一层。

- **地图整体缩小（v63.8，用户：小 10–15%）**：镜头平时的比例 `CAMERA.max` 1.1 → 0.95（约小 14%），最小比例 0.7 → 0.6。点、字、批注一起缩小，布局坐标不变。
- **原型静图（v69）**：AI 项目有可点原型但没有宣传片时（`prototype.video` 为空），视频位置放第一屏的 16:9 静图，点击和 app 栏一样打开原型。
- **点不随镜头变小（v66，用户：筛选时点太小点不中）**：镜头因为要放下很多点而缩小时（地区筛选），点和标签保持至少 `CAMERA.pointMin` 0.8 的屏幕比例（约 14px，平时 16px；以前会缩到 10px），只有线变短；避让盒和筛选扇形半径按同样比例放大（`pScale`）。标签也能点击（不只形状）。

- **Creative Work 图库（v63，用户要求：照片很多，要能放很多）**：Photography 和 Design 不再是占位，各是一个带 `gallery` 的作品（地图结构不变，不新增点）。
  - **每组的顺序**：v63.6 起以用户在管理页亲手拖好的顺序为准（她说「我来排」）。v63.5 时的原则（供参考）：每组开头放最强的照片，之后按色调和题材成段（如黄石：火 → 人像 → 红色厨房 → 灰色河岸 → 室内）。芝加哥里一张重复的照片已去掉。
  - Photography 按地点分 7 组，顺序：Huangshi, Hubei（Lunar New Year 2022；不写 "home"，用户说明那是乡下，不是住的地方）→ Japan 2024 → Europe（意大利、法国、巴塞罗那三地，用户：合成一组免得太散，副标题写三个地方）→ Wuhan 2021 → Chicago 2021–2023 → New York 2022 → Arizona 2023。
  - Design：只放 X Mirror 第二期（用户：去掉第一、三期；学生杂志，用户是主编，每期自己用 InDesign 排版），页面按页码排 + 电影放映海报。校园活动海报和同一张海报的多个版本不放（用户：弱的都不要）。
  - 电脑版：打开 Photography / Design 时，图库占据地图的位置（地图和图例淡出），按组显示标题、地点 · 年份 · 张数，下面是相册式排法；左上「← Map」回到 Creative Work。右侧卡片照常：简介 + 各组列表，点一组，图库滚到那一组。
  - **排法：相册（photo book）**：v63.1 的排法，v63.7 恢复（用户试过 v63.4–63.5 的两端对齐行后，觉得最初的相册版更好）。每行的宽度、对齐、缩进只在 `blocks.ts` 的 `BOOK_ROWS` 里定义（5 种行形状轮流）；横图至少占 58%，一行放不下时整行按比例缩小；只上下滚动。每张下方有小编号（01、02…），和灯箱里的「3 / 36」一致。不再随屏幕宽度改每行张数。
  - 手机版（v63.3，用户要求页面不要太长）：不用相册排法。每组一行、同样高度（`--g-strip-h`），左右滑动看完一组；电脑版仍只上下滚动。
  - 点任意一张：灯箱，← → 按钮 / 方向键 / 左右滑动切换，跨组连续，下方写「组名 · 3 / 36」。灯箱仍是全站唯一的浮层。
  - 图片：从用户文件夹「Design & photography」生成网页版，长边 1600px（灯箱）和 900px（网格），去掉 EXIF（含位置信息）。清单在 `src/gallery-images.ts`，每行带用户看过的编号（如 p4-12），删一张 = 删一行 + 两个文件。

- **筛选只留地区（v62.42，用户确认）**：去掉 Platform（Global social / Chinese social / Paid ads）。原因：它和两个大类重复（Paid ads ≈ Paid & UA Growth，Global social ≈ Creator & Social），且「Chinese social」匹配不到任何案例。地区筛选照旧，网址只剩 `?region=`。X Creator Campaign 和 English Social Channel Growth 的市场从 EN 改为 NA（用户：EN 主要是北美）；`regionOfMarket` 去掉 EN。

- **AI Projects 首页折叠（v62.39–40）**：首页 AI Projects 的三个作品全部收起（包括 Dashboard），点开 AI Projects 才出现。`ALSO_AT_HOME` 留作以后单独露出某个点用，现在为空。

- **首页布局由用户亲手摆放（v62.38）**：`HOME_LAYOUT` 和 `NOTES` 全部来自用户在排版工具里拖好后复制的数值，原样写入。以后调首页，先用排版工具让用户摆，再写回，不要自己凭感觉改坐标。

- **排版模式（v62.36，用户自己摆首页）**：页面设了 `window.__ARRANGE` 时（单独发布的「排版工具」预览），首页的点拖到哪里就停在哪里（`fx/fy` 固定，并写回 `HOME_LAYOUT`），批注也能拖（移动文字和箭头尾，箭头尖不动），点击不打开内容，第一次拖动后镜头不再移动。左下角「Copy layout」把 `HOME_LAYOUT` 和 `NOTES` 以 JSON 复制出来，用户发给 Claude，Claude 写回 `map.ts`。正式网站不设这个开关，不受影响。只覆盖首页可见的点（折叠组里的点不在首页）。

- **首页再减（v62.35，用户要求）**：Information 在首页也折叠（`FOLDED_AT_HOME`），Education / Experience 只在点开 Information 时出现。Creative Work 挪到左边，紧挨 Information，两个都折叠；AI Projects 往左下移，「tools I built with AI」批注改到 AI Projects 右上方。

- **批注变小（v62.33）**：手写批注字号 27 → 20（`NOTE.size`），箭头头部 12 → 8，线宽 1.5px → 1.2px，让批注不抢地图的注意力。

- **2026-10-02 首页重新排布（v62.32）**：Branded Filter Campaign 也设为重点案例（`featured`），在 Creator & Social 里排第二，首页带「600M+ views」批注（位置改为 `NOTES` 手摆，只在首页显示；打开该组时不再显示这条批注）。首页坐标重排：各大类离 ✳ 距离相近，重点案例在所属大类外侧展开；批注放在不挡标签、不被面板边缘推回的一侧。点的数量不变（用户确认数量不是问题，是间距）。

- **2026-10-02 去掉 Growth Marketing 节点（v62.31，用户要求：节点太多，画面太满）**：Paid & UA Growth 和 Creator & Social 直接挂在 ✳ 下，是两个大类（`type: 'branch'`，都带钴蓝描边 `KEY_AREAS`）。首页两组折叠（`FOLDED_AT_HOME`），只显示各自的重点案例和批注；点开一组才显示全部案例。INDEX、手机版、手机目录里两组各占一节。HoYoverse 只用虚线连 AI Creative Intelligence Dashboard（案例在卡片的 Work from this role 里）。下面 v62.30 那条里关于「Growth Marketing 下分两组」的说法以此为准。

- **2026-10-02 案例分组（v62.30，用户选定方案 A，取代下面 2026-09-30 的「重点案例 + More cases」）**：Growth Marketing 下分两组，按目标岗位的两个 JD 家族命名——**Paid & UA Growth**（`growth-paid`：Creator Ad Pipeline ★、TikTok UGC Channel Test ★、Xbox Launch Paid Campaign、Gamified Landing Page）和 **Creator & Social**（`growth-social`：ZZZ Social Launch in Japan ★、X Creator Campaign、Cross-Platform Community Giveaway、Branded Filter Campaign、English Social Channel Growth）。不再有「More cases」和单独的「Flagship cases」列表。★ 重点案例仍是 `featured: true`，在组内排第一（`content.ts` 里的顺序就是展示顺序）。首页地图：显示两组，以及每组的重点案例（带手写批注），其他案例收在组里；打开 Growth Marketing 时同样显示重点案例。打开一组时，组内全部案例放射展开。INDEX、手机版、手机目录都按这两组列出。

- 2026-09-30 草稿（local/flagship-restructure，待批准）：Growth Marketing 下直接挂 3 个重点案例（UA Creative Strategy、ZZZ JP Account Growth、TikTok GIP，顺序见 `featuredOrder`）+「More cases」组（其余 6 个）。重点案例在地图上是实心黑色方块（选中时为荧光绿），尺寸与其他点相同；悬停只放大，不变色（含 ✳）；INDEX 与手机版同步为「Flagship cases / More cases」，列表不显示数量。打开一个末级作品时，兄弟节点保留但变灰。
- 案例卡片顺序：How it worked（重点案例的系统图，卡片内可点击放大）→ Results（默认展开）→ The Challenge / What I did / The Team（默认收起）。
- **地图手写批注（v55）**：红橙色（`--note`）、手写字体 Nanum Pen Script（`--hand`）、1.2px 干净箭头（v62.33 起；字号 20）。只批注值得看的地方，不重复标题。首页：三个重点案例 + AI 各一句（位置在 `map.ts` 的 `NOTES` 里手工摆放，只在首页显示）。Creator & Social：只在 Branded Filter 旁写「600M+ views」（不加框）（只在该组打开时显示，位置自动放在外侧）。打开某个案例时不显示它自己的批注。手机版不显示（手机没有地图）。文字在 `content.ts` 的 `note`。批注永远不被卡片、页头或窗口边缘挡住：超出地图空白区时自动挪回，挪得远时箭头重新指向该点。
- **筛选（v60）**：电脑版页头左上角一行纯文字（取代原来的名字），与右侧导航同高同字号：PLATFORM（Global social / Chinese social / Paid ads）+ REGION（North America / Europe / Japan / China）。不选 = 全部；再点一次取消。选中项蓝色下划线。匹配规则只有一处：`state.ts` 的 `matches()`——作品同时满足所选平台和地区；组里有任一匹配即匹配。选择筛选项时回到首页地图，所有匹配的作品自动展开（连同通往它们的分支），不匹配的变灰；**筛选时点任何点，地图保持完整的筛选视图不收窄、镜头不动，只高亮这个点并打开它的卡片（v64.20，用户：不然一点进去就失去筛选的全貌）；不筛选时照旧收窄到这个点周围**；首页手写批注在筛选时让位。INDEX 列表、手机卡片同样把不匹配的变灰。“准备中”的占位作品不匹配任何筛选。平台来自 `content.ts` 的 `platforms` 字段，地区由 `markets` 经 `regionOfMarket` 换算。选择写在网址里（`?platform=cn&region=jp`），可以把筛好的链接发给招聘方。手机版：页头下方两个下拉菜单（平台 / 地区，默认“全部”），选完自动滚到第一个匹配的案例（没有则到履历）。
- 图片规则：重点案例的系统图放在卡片「How it worked」里；其他案例 1–4 张图用地图空白处的浮动图；手机版每张卡片只放一张图：有系统图的案例只显示系统图，不显示浮动图；大量图片（摄影、设计）用图库模式（v63，见上）。不展示内部账号、素材截图或内部数据。

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
- **Creative Work**：首页默认折叠，4 个点。
  - Photography（图库，v63）
  - Design（图库，v63）
  - Video & Editing（占位）
  - AI Creative Videos（占位）
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
- **不重叠（v47）**：点和点按形状 + 标签的矩形避让；线不穿过不属于它的点；向下的线从标签下方出发；**标签躲开线（v64.19）**：选中或筛选时，一个点的线都从下方来，它的标签就移到点的上方（线从上方来的那端在标签上方结束）；首页手摆布局不变；选中某段经历时，Experience 保持在中心，经历链条不折叠。用 `scripts/layout-check.cjs` 检查。
- **末级保留兄弟（v53）**：选中一个末级（没有下级的单个作品）时，同一上级下的兄弟作品保持显示；地图中心放在上级；兄弟们按当前顺序排在上级背离 ✳ 的一侧。
- **作品组放射展开（v62）**：打开一个有 4 个及以上末级作品的组时，作品绕组点一整圈均匀分布（留一个空位给回到上级的线），相邻的一近一远；打开组里某个作品时，兄弟作品仍是半圈扇形。重点案例（flagship）在地图上改为白底黑框方块，与其他案例一致，靠手写批注突出。
- **作品组均匀展开（v54）**：一个组有 4 个及以上末级作品（如 More cases）时，打开这个组或其中一个作品，组内作品在背离 ✳ 的一侧均匀排成扇形，相邻的一近一远（`groupRing` / `groupStagger` / `groupSpread`），标签互不挤压。**v64.19**：首页按地区筛选展开的组也这样排（`filterFanned`，间距 `filterFanSpread`），不再停在手摆位置挤成一团。
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
