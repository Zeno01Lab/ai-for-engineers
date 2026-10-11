---
title: 多目标与约束优化
description: 目标相互冲突，怎样找到可行且有意义的性能取舍？
date: '2026-10-09'
tags:
- 优化
- Pareto
- 约束
difficulty: 入门
estimatedReadingTime: 4
prerequisites:
- 目标函数
- 基本优化
draft: false
family: 优化
problem: 目标相互冲突，怎样找到可行且有意义的性能取舍？
english: Multi-objective & Constrained Optimization
shortEnglish: Multi-objective Opt.
group: optimization
mapOrder: 2
foundationConceptIds:
- optimization
- data-evaluation
detailConceptId: multi-objective
lessonId: null
historyEventIds: []
referenceIds:
- res-pymoo-org-950177fe9b
atlas: true
---

## 解决什么问题

目标相互冲突，怎样找到可行且有意义的性能取舍？

## 动机与发展线索

把功耗、速度、重量和成本随意相加，会隐藏偏好与单位差异。多目标优化保留多个目标，让研究者看到取舍；约束规定哪些结果才允许接受。

## 核心思想

对最小化问题，如果一个解在所有目标上不差，并至少一个目标更好，它就支配另一个解。不能被支配的解构成 Pareto 解集。可行性应先依据约束明确判断。

## 假设与前提

- 目标的方向、单位和可接受约束事先确定。
- 用于比较的解经过一致的评价条件。
- 最终选择仍需要工程偏好，算法不会替你决定所有权衡。

## 优势

显式展示冲突目标，能支持多种偏好下的选择。既可以使用进化算法，也可以使用多目标 BO 等方法。

## 局限

权重、归一化、参考点与约束处理会改变结果。有限预算得到的是近似前沿；高维目标会使比较和可视化困难。

## 典型应用与工程示例

示例：在重量与刚度之间选择机械结构，或在精度与推理延迟之间选择模型部署方案。

## 替代方法

有明确偏好时可使用标量化；有硬指标时可把它们设为约束，仅优化一个主要目标。加权和并不能覆盖所有非凸前沿。

## 最小实践

从两个目标和一个约束开始，分别报告可行率和近似 Pareto 前沿。若使用 hypervolume，固定归一化与参考点，并记录评价预算。
