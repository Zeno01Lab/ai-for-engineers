# 用 GitHub 运营网站

目标仓库为 `Zeno01Lab.github.io`。目前仍是预览；创建仓库与 GitHub Pages 发布后，再启用网站中的仓库入口。

## 添加一条资源

1. 在 GitHub 打开网站仓库，进入 `src/content/resources`。
2. 选择 Add file → Create new file，以 `my-resource.md` 命名；文件名只用英文小写、数字和连字符。
3. 先在 `src/data/knowledge/resources.json` 添加或复用真实 URL 的资源 ID，再复制 `templates/resource.md`，填写 `resourceId`、标题、先修、适用读者、选读建议。保持 `draft: true`。
4. 核查链接与课程要求，将 `verified` 改为实际核查日期，例如 `2026-10-09`。编辑建议不等于亲学体验。
5. `coding` 取 `optional`（概念阅读可不编程）、`required`（实践需要编程）或 `varies`（依所选课程而定）。`media` 可填 `text`、`video`、`navigation` 的数组。
6. 审阅后将 `draft` 改为 `false`，点击 Commit changes。配置好 GitHub Pages Actions 后，提交会触发网站构建；在 Actions 查看状态。

资源列表、搜索和分类筛选自动读取指南，URL 来自共享资源注册表，无需修改页面代码。修改现有链接只编辑注册表一次。添加 PDF 不会自动生成资源目录条目，仍应添加介绍与链接。

## 添加教程或学习日志

复制 `templates/article.md` 或 `templates/journal.md` 到 `src/content/articles/<英文文件名>.md`。保留 `draft: true` 直到完成来源、示例、先修与边界的审阅。按 CONTENT_GUIDE.md 操作。个人日志只记录实际发生的学习与实验。

## 开启仓库入口

仓库真实创建后，将 `src/config.ts` 的 `repositoryUrl` 设置为该仓库完整 URL，例如 `https://github.com/Zeno01Lab/Zeno01Lab.github.io`。然后页脚指向网站仓库，文章自动显示勘误与编辑链接；预览阶段不要设置不存在的仓库地址。

编辑链接默认使用 `main` 分支；如果使用其他默认分支，需要一并更新 EntryPage.astro 的链接。

## 提交前检查

执行 `npm run verify`。更改路径时额外检查仓库子路径构建。发布失败时先看 Actions 日志；不要通过移除草稿过滤或校验来绕过错误。

文章草稿会随公开源码仓库公开，不用于存放私人内容。网站进度只在读者当前浏览器中保存，不跨设备同步。

## 维护历史知识库

历史事件与方法卡片分开：发布、会议、数据集和系统不能一律称为算法。原始导入放在 `src/data/history/raw/`；本次编辑映射放在 `src/data/history/editorial.json`，工程导航在 `src/data/engineering.ts`。

添加事件时使用唯一英文 ID，记录年份、`year_basis`（论文、预印本、项目启动、会议、书籍或发布）、中英名称、问题、贡献、局限、工程联系与来源。同步补齐编辑映射；`method_ids` 只能指向实际存在的方法卡片。原始参考标题、作者与核查日期尚需逐项补全，不能据当前标签声称已完成书目核验。

关系用 `source`、`target`、`type`、解释与编辑性阐释标记。新类型必须在 `relations.ts` 定义语义；不把比较或并行发展自动变为继承箭头。没有已记录关系的节点保持无连线。

`npm run verify` 检查历史结构、绑定、每个详情页、搜索、sitemap 和静态关系数据。结构通过不等于历史事实审定。没有真实逐行匹配与行标识时，不得把 `jrc_csv_row_matched` 改为 true。JRC 报告核对与 CSV 核对分别记录；声明部分重新核验时补上实际日期与核查范围。

## 维护全局地图

概念的唯一作者文件在 `src/content/algorithms/<ID>.md` 或 `src/content/concepts/<ID>.md`；`knowledge-map.ts` 与 `knowledge-terms.ts` 只是投影视图，禁止重复编辑简介。分区在 `src/data/knowledge/regions.json`，八个区域是探索组织，并非互斥学科。稳定 ID、双语名称、基础概念、正文和历史绑定都维护于同一个 Markdown。缺少文章的概念只提供地图简介，不标为完整教程。

历史图从原始记录自动布局。年份区间在 `src/lib/history-layout.mjs` 定义；同列节点堆叠防止重叠。泳道分类与空间距离用于阅读，不表达继承或发展速度；具体语义沿用原始关系类型。不要为了填满图增加无依据关系。

学习阶段（未接触、了解、能解释、能实践）与当前位置只在当前浏览器保存。它们是自评，不自动从阅读、点击或历史节点推断。先修路径是教学建议，可按已有基础跳过。网站不上传这些记录，也不跨设备同步。

## 维护探索与选型交互

资源推荐在 `src/data/map-resources.ts` 按区域绑定已发布资源 ID；先补充资源条目与选读说明，再添加绑定。历史图从明确的方法和事件连接找到相应资料，不用年份相近自动推断。

工程目标映射在 `src/data/engineering.ts`，基线与评价建议在 `src/data/engineering-profiles.ts`，条件规则在 `src/lib/engineering-selector.mjs`。新增任务须同步提供基线、适用条件、评价方式及有效方法 ID。问卷只在页面内运行，不保存或上传条件；它提供可比较的候选入口，不保证自动选出最佳方法。

地图的“与我有关”只读取用户标记；空记录显示提示并保留全景，不自动给学习者评级。新增交互后验证 `verify-global-map.mjs` 与 `verify-build.mjs`，再按 VALIDATION.md 的人工建议查看真实浏览器。

关系文字在 `src/lib/map-label-layout.mjs` 按卡片、区域标题与其他标签的边界避让；SVG 在节点之后单独绘制文字牌，连线与引导线保持在节点之前。修改节点布局或标签字号后需重新执行避让验证，再检查真实浏览器字体。初始视图复位清除选中、筛选和镜头，并归位小地图；不删除学习记录。

知识图关系文案在 `src/data/knowledge/relations.json`；`knowledge-relations.ts` 是兼容投影。标签只给短提示，`statement` 写完整关系句，`explanation` 解释含义与例子。概念联系、课程前置、历史演进使用不同数据层与端点类型。标签与节点侧栏的关系入口均可打开解释，需检查鼠标、触屏和键盘，以及小屏详情滚动。

## 维护课程关卡

编辑 `src/data/learning/units.json`；`src/data/learning-path.json` 是 `npm run sync:data` 自动生成的兼容数据，禁止手动编辑。每个公开知识点绑定至少一个有外部资料的单元；课程选择引用资源 ID，并写具体章节与任务范围。`prerequisiteUnitIds` 是本站选读前置，不能宣称为原课程官方要求。平级单元不要人为串联。起步任务无需安装环境，数学按需补。

完成或声明已有基础才能点亮绑定知识，不从点击推断完成，不替用户修改能力自评。学习顺序由独立路径提供，知识地图只显示概念联系。发布前运行关卡验证与静态链接检查；维护旧入口锚点时同步检查首页与搜索。

单元标题填写 `title.en` / `title.zh`；概念的 `english` / `shortEnglish` / `title` 只在它自己的 Markdown 编辑。路径在 `src/data/learning/paths.json`，引用单元 ID，声明并列与选修。共享单元的进度不会因更换目标而丢失。横向层级由前置 DAG 计算，不代表耗时或统一难度；纵向表示方向。修改后验证卡片无重叠、平级对齐、前置线绕开无关卡片，并在真实浏览器核对双语文本、触屏与小地图。

进度使用 `ai-for-engineers.progress.v1`，旧 `done` / `prior` 只读迁移。导入文件验证版本、ID 与状态；无效文件不能覆盖原记录。清空可撤销，能力自评独立保存且不在单元进度 JSON 中。维护流程和本轮本地验收分别见 `docs/CONTENT_WORKFLOW.md` 与 `docs/MVP_ACCEPTANCE.md`。发布、推送与仓库设置变更须获用户明确授权。
