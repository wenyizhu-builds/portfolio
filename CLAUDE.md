# 给 Claude 的工作规则（本项目）

开始任何工作前，按顺序读：
1. `docs/STATUS.md`
2. `docs/LESSONS.md`
3. `docs/SPEC.md`

## 文档（固定四份，不新增）
- `docs/SPEC.md`：设计定稿。改设计就改这里对应的那一行。
- `docs/STATUS.md`：当前进度和下一步。每次结束时**覆盖**，写上日期和版本。
- `docs/CHANGELOG.md`：只追加，每条带日期和版本。
- `docs/LESSONS.md`：每犯一次错加一条：错误、根因、规则、防护机制。
  - 新规则同时写进本文件。
  - 能自动检查的，加进 `scripts/check.mjs`。
- **不要新建 handoff / notes / summary 类文件。** 旧文件只放进 `docs/archive/`，文件名带日期。

## 代码：一处定义，全站跟随
- **颜色**：只在 `src/style.css` 的 `:root` 定义 6 个基础色。其余用 `var()` / `color-mix()` 派生。CSS 规则和 TS 里不写任何色值。（L2）
- **尺寸、时长、断点**：
  - 尺寸和时长只在 `:root` 定义，TS 用 `cssPx()` / `cssVar()` 读，不复制数字。（L1, L7）
  - 每个断点只有一个 `@media` 块；手机断点等于 `--mq-phone`。（L9）
- **文字**：只在 `src/content.ts`，界面文字放在 `ui`。
- **逻辑不解析文案**：用结构化字段（例如 `lead: true`），不用正则匹配展示文字。（L8）
- **参数的归属**：
  - 地图和镜头参数只在 `src/map.ts` 顶部的 `LAYOUT` / `CAMERA` / `WEIGHT_BY_KIND`。
  - 形状和 ✳ 尺寸只在 `src/shapes.ts`。
  - `index.html` 的头部由 `vite.config.ts` 生成。（L11）
- **内容块只写一次**：电脑版面板和手机版都从 `src/blocks.ts` 取，不在 `panel.ts` / `mobile.ts` 里另写。（L3）
- **同一个值出现第二次**，就提取成变量或常量。

## 行为
- **动画按需驱动**：有东西在动才请求下一帧，停了就什么都不跑。（L4）
- **手势**：所有结束路径（up / cancel / lostpointercapture）走同一个函数。（L5）
- **外部输入**（URL、存储）一律 try/catch，并有回落路径。（L6）
- **CSS 选择器**：标签类样式用专属 class 或 `>`，不用宽泛的后代选择器。（L13）
- **选中时不放大**：只减少显示的点，镜头框住全部显示的点，比例保持稳定。（L15）
- **借鉴参考站**：先把它的交互模型写进 SPEC，确认后再动手。（L14）
- **容器换内容不跳**：高度跟随内容缓动变化，新内容淡入。（L16）
- **卡片字号体系**：一种字体、两种字号、两种颜色，只用 `--fs-*` 变量，不放大加粗；卡片不重复地图已有的内容。（L21）
- **优化先定终点**：动手前写下完成标准和时间上限（30 分钟），到点先汇报；先确认检测工具可靠再调参。（L25）
- **一个概念一个决定点**：例如形状统一由 `kindOf()` 决定；改一个视图时，检查所有展示同一内容的视图。（L17）

## 内容
- **首要规则：所有英文必须是母语者会说的地道表达，禁止中文直译。**（例：不用 "mother scripts"（母脚本），用 "script templates"；不用 "script structures"（脚本结构），用 "scripts"。）拿不准时，用 JD 原词库或英文行业常用说法，并在交付时标出存疑的词。（L29）
- 第一人称、口语化。
- **What I did 的写法**：每条以关键词短语开头，后跟冒号和一句说明；关键词短语（不含冒号）标**蓝色**（`blueRanges`），不加粗。
- 不编造职位、客户、数字、结果；占位内容标 `[Placeholder]` / `[Draft]`。
- 不放内部数据或完整报告；不用 "AI increased ROI by 164%" 做标题数字。

## 交付前（每次都做）
1. 运行 `npm run build:file`。它会依次跑 `check`、类型检查，再构建；任何一步失败都不能交付。
2. 批量替换时，先断言锚点恰好出现一次，替换后立即类型检查。（L12）
3. 改了地图布局：运行 `node scripts/layout-check.cjs`，需要 Playwright。重叠超过 2 处不能交付。（L24）
4. 用浏览器看过：
   - 电脑宽屏和窄屏、手机版
   - 中英文两种语言
   - 至少点开一个案例、一段经历、一个"准备中"的作品
5. 上线前运行 `npm run check -- --launch`，必须通过。
6. 版本管理（L27）：GitHub `wenyizhu-builds/portfolio` 是唯一的版本源。
   - 在云端工作副本里 `git commit`（写版本号和一句话），然后 `git push`。
   - 同步到你电脑：用 `git bundle` 把新提交带过去，在电脑上的文件夹里 `git pull <bundle> main`，两边提交号保持一致。
   - 部署配置放在根目录 `github-pages-deploy.yml`，上线时才移到 `.github/workflows/`。
7. 更新文档：
   - 覆盖 `docs/STATUS.md`
   - 在 `docs/CHANGELOG.md` 追加一条
   - 有新错误就在 `docs/LESSONS.md` 加一条
