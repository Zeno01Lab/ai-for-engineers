# AI Knowledge Map for Engineers — Historical Data v0.1

这是 **独立的公共网站内容素材**，不包含用户私人 AMS 研究计划。它不是已经部署完成的网站。

## 已完成
- `nodes.json`：34 个由一手原始出版记录或机构公告支持的历史节点，包含年份类型、技术问题、贡献、局限、工程关联与直接来源。
- `relationships.json`：24 条保守的技术关系，包括 `different_solution_to_sequence_modeling`、`related_parallel_research` 等；没有把并行研究强行说成直接继承。
- `sources.md`：全部一手出处和机构综述入口。
- `codex-brief.md`：交给 Codex Desktop 的接入说明。

## 核验范围与限制（重要）
- 已核对每个所列节点的一手来源页面中的年份、摘要/介绍及主要表述，**不等于完成全部论文全文的学术审稿**。
- JRC 官方数据目录已经核实，授权 CC BY 4.0；但是 `timeline.zip` 在本次工具环境下**无法成功读取**。所以所有记录明确记为 `jrc_csv_row_matched: false`，**绝对不要在网站上称已逐行比对 JRC 数据集**。
- **已对其中 15 个节点与 JRC《Historical Evolution of Artificial Intelligence》原始报告中的明确事件表逐项核对**；记录在每个节点的 `verification.jrc_report_crosscheck`。该报告网页发表于 2021 年，报告书目信息为 2020 年。JRC 的 ZIP 时间线仍未成功提取，须将两种核验区分。JRC 图表历史主窗始于 1950，因此 1943 节点由原始论文单独支持。
- **核验发现的年份口径差异**：Perceptron（JRC 1957 / 论文 1958）、Samuel Checkers（JRC 1952 / 论文 1959）、ELIZA（JRC 1965 / 论文 1966）、Q-learning（JRC 1989 / 经典收敛论文 1992），另有 Dartmouth（1955 提案 / 1956 会议）；网站应该分别展示，不能默默合并。
- 原始纸质文献出版年、首次预印本、项目建立年、产品发布年严格通过 `year_basis` 区分。
- 2026 Stanford HAI AI Index 是 **当代趋势报告**，不是一个“2026 年发明的新算法”节点。用于网站时代综述即可。
- 关系数据是**编辑性阐释**，须在 UI 上区别于“论文直接证明存在继承”的关系。事实引用应返回节点 `references`，不同方法并列/对比关系不应被读者误解为历史因果。
- 由于网站内容面向大众读者，引用原文链接而非拷贝论文图表和大段文字。复用 JRC 数据需遵守 CC BY 4.0 署名；本版本历史节点说明为原创中文概述。

## 如何更新至真正的 JRC 逐行核验状态
1. 获取官方 [JRC 数据集](https://data.jrc.ec.europa.eu/dataset/76625e38-36a1-417f-b28f-b3380376643e) 中的 `timeline.zip`、`sources.zip`。
2. 解压后逐行核对其原始记录，包括日期、事件标题、类别、引用来源。
3. 为匹配成功的节点补充 JRC 原行引用或 ID，确认无冲突后再将 `jrc_csv_row_matched` 设为 `true`。如有年份不同，保留冲突说明而非静默覆盖。
4. 网站页面公开 Source / Year basis / Last checked，避免制造权威错觉。

## 结构及下一步
- 先展示一条历史时间轴、多条技术分支和 34 个算法卡片；用 `track` 分类。
- `relationships.json` 的边应按照类型区分视觉样式，**不要将任意边都画成有向的因果箭头**。
- 工程应用仅是一般示例，不是某算法在该应用中已经被证明最优。
- 每个算法卡片再关联到独立的工程问题入口（问题定义、数据量、可微性、约束、预算）。
