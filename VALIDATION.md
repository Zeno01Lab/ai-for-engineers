# Validation · 本地实现验收

日期：2026-10-10 UTC。环境：Linux、Node.js 24.19.0、npm、Python 3。基线 `49001f2`；工作分支 `feature/unified-knowledge-paths`。本轮未推送、部署或更改远程设置，线上仍是上一版。

| 实际检查 | 结果 |
| --- | --- |
| Clean install · 独立锁文件安装 | 隔离副本 `npm ci --ignore-scripts --fetch-retries=0 --fetch-timeout=20000` 成功，406 packages。此前 offline 安装因 zwitch 缓存缺失失败，后续正常安装成功。 |
| Root build · 根目录 | `npm run verify` exit 0；81 Astro files，0 errors / warnings / hints。 |
| Repository base · 仓库子路径 | 隔离副本 `GITHUB_REPOSITORY=Zeno01Lab/guide PREVIEW_DRAFTS=true npm run verify` exit 0；base `/guide`，类型、链接与草稿检查通过。 |
| Static output · 静态输出 | 两次各 66 HTML、2,154 内部链接/资源/锚点、142 搜索项；5 篇草稿未进入页面、搜索或 sitemap；公式与 metadata 通过。 |
| Canonical knowledge · 统一知识库 | 39 概念、85 去重资源、33 单元、2 精选路径；字段、稳定 ID、引用、URL 协议与坏数据拒绝通过。概念简介来自同一个作者文件。 |
| Typed relationships · 关系分层 | 16 概念联系、24 编辑性历史关系、40 单元前置独立维护；不同端点类型不可混用；历史关系不转换为学习前置。 |
| Learning paths · 学习路径 | 8 单元通用基础（7 必修 + 1 选修）；7 单元工程优化（6 必修 + 1 选修）。DAG、闭合前置、拓扑顺序、平级与选修依赖通过。 |
| 2D graph · 二维课程图 | 33 English-first 双语节点、9 泳道、40 前置线；卡片无重叠、线避开无关卡片，CNN/LSTM/Transformer/GNN 平级对齐。全部单元有外部资料，覆盖 39 个公开知识点。 |
| Local progress · 本地进度 | 四状态、显式自查、已有基础、共享目标切换、刷新、旧记录迁移、撤销/前置复核、JSON 合并/替换及重置不重复迁移通过。 |
| Import robustness · 导入验证 | 不支持版本、未知 ID、非法状态、额外字段、原型键、坏 JSON 与超限文本被拒绝；有效导出可往返。能力自评独立不升级。 |
| Storage adapter · 实际存储适配器 | Node 环境中执行真实 adapter：保存/读回、通知、quota 写入失败时页面内保留、损坏记录保留通过；不是浏览器 e2e。 |
| Maps · 知识与历史地图 | 39 知识节点、34 历史节点、7 历史泳道；静态 SVG、详情链接、搜索定位、缩放/小地图计算、16/24 关系标签避让通过。 |
| Engineering advice · 工程导航 | 保留 11 情景及基线/评价规则；候选方法链接到学习单元，root/subpath 锚点通过；保留条件化建议而非自动最优算法。 |
| Provenance · 原始证据 | 34/24 历史 JSON 与基线/交接包逐字节相同；15 JRC report checks / 0 CSV row matches。15 算法正文与12资源指南正文逐字节保留。 |
| Teaching calculations · 教学计算 | 回归基线、混淆矩阵、无正预测时 precision 未定义、高次模型验证对照通过 JavaScript 检查；Python 示例未改，本轮未重跑。 |
| Targeted privacy scan · 定向扫描 | source/output 检查通过：Git 工作区335文件，隔离副本296文件。检查私人路径、常见凭据与交接包误入；不宣称检测一切敏感内容。 |

详细架构取舍见 `docs/ARCHITECTURE_AUDIT.md`，内容编辑见 `docs/CONTENT_WORKFLOW.md`，来源与迁移见 `docs/PROVENANCE.md`，MVP 范围见 `docs/MVP_ACCEPTANCE.md`。

## 核验边界

没有实际 Safari、Chrome、手机视口、键盘/辅助技术或触屏交互验收，不把 CSS 媒体查询、静态 SVG 或纯函数测试当作设备验证。pan/zoom、pinch、全屏、节点选择、关系详情、小地图拖动/折叠、真实字体和小屏侧栏仍需浏览器检查。JSON 的真实下载与文件选择器也未做浏览器 e2e；引擎、解析与实际存储 adapter 已测试。

本轮未重跑完整外链扫描，未重新逐篇审读历史论文或完成外部课程。课程入口沿用已有核查记录；`retained-source` 且日期为空的资源不声称本轮访问。34 历史记录的作者/正式出版元数据与核查日期仍可补全；来源类型不是结论可靠性的证明。3 事件无记录关系，保持空缺；24 关系仍是编辑性阐释。

知识区域是代表性探索组织，存在交叉；知识库未覆盖全部 AI 子领域。学习前置是本站短选读任务安排，不是原课程官方要求或技术历史因果；图的横距不表示时长或统一难度。完成/已有基础是自我报告，不表示客观掌握完整算法。JSON 导出只包含单元状态与路径选择，能力自评独立保留。

## 本地人工验收

运行 `npm ci`、`npm run dev`，打开终端打印的 URL。查看 `/learn/`、两条精选路径与 `/map/`：

1. 第一单元无需安装；不勾选自查不能完成。标记 in progress 不点亮；完成或明确声明 already known 后点亮绑定概念，能力自评分数不变。
2. 切换学习目标时共享单元记录保留。必修进度不要求选修；分类/评价与数学等并列选择不被强行串联。撤销前置保留下游为待复核，补回后恢复。
3. 导出、清空/撤销、合并/替换导入到另一浏览器；坏文件保持原记录。禁止存储时应显示仅本页面保留提示。
4. 两张地图检查完整视图、放大细节、初始复位、关系解释、筛选与知识/历史跳转。移动/折叠小地图，检查窗口变化后仍在画布内；复位不删除学习记录。
5. 检查长双语文字、侧栏来源、键盘焦点、手机与 Safari；工程问题选择混合变量、高维、噪声、硬约束和评价成本，查看条件提示与基线。

GitHub Pages workflow 已准备，远程 Actions 未验证。得到明确发布/推送授权后再 review/merge/push 与检查 Pages；本地构建成功不等于已发布。
