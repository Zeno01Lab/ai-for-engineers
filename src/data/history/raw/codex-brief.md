# Codex Desktop — AI History Knowledge Map 数据接入任务

请检查当前工作区。不要覆盖已有网站代码。将本目录 `nodes.json` 与 `relationships.json` 接入现有 Astro 网站（若网站尚未建立，先只做数据层和展示原型）。

目标：面向没有 AI 课程基础、希望在工程科研中使用 AI 的学生。当前材料**不是**作者私人 AMS 学习计划。

## 页面
- `/knowledge-map/history`：按年份和技术分支筛选节点。
- `/knowledge-map/algorithms/[slug]`：展示问题、贡献、局限、工程例子、一手文献、年份类型。
- `/knowledge-map/method-finder`：先只做解释型问题分类，不要声称自动推荐算法绝对正确。

## 数据与历史严谨性
- 所有节点都必须展示 references；不得写成经 EU JRC CSV 数据集逐条确认（`jrc_csv_row_matched` 为 false）。其中 15 个节点已经与 EU JRC 官方历史研究**报告**中的事件表逐条对照（`jrc_report_crosscheck`），二者要分开展示。
- 将 `year_basis=preprint`、`paper`、`project_start`、`event`、`release` 明确标注；显示相关出版/发布差异说明。
- 关系类型要清楚区分：真实技术依赖、问题解决思路、并行发展、教学比较等。`related_parallel_research` 禁止呈现为直系父子树。
- 显示“据公开元数据和摘要核实，并非已全文逐段审核”。
- 2026 AI Index 作为综述背景，不要误做新算法节点。
- 不要引入未经授权图片或复制开源项目的商业字体、图形。

## 软件要求
- Astro + 静态内容；在 build 阶段加载 JSON；检查所有节点 ID、关系 ID，检测重复。
- 桌面/移动端可用；无障碍；可键盘导航；历史节点搜索和筛选；页面 SSR/SSG 可索引。
- 添加校验脚本：JSON schema、坏链接/缺来源、孤立边、重复 ID、year_basis 合法值。
- 构建成功后汇报测试结果和未解决问题。不要未经明确授权推送到 GitHub 或部署。
