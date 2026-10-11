---
title: 搜索与启发式
description: 给定状态、动作和目标，怎样找到解或低成本路径？
date: '2026-10-09'
tags:
- 搜索
- 规划
- 约束
difficulty: 入门
estimatedReadingTime: 4
prerequisites:
- 基本编程
- 图概念
draft: false
family: 搜索
problem: 给定状态、动作和目标，怎样找到解或低成本路径？
english: Search & Heuristics
shortEnglish: Search & Planning
group: symbolic
mapOrder: 1
foundationConceptIds:
- logic
detailConceptId: search
lessonId: null
historyEventIds: []
referenceIds:
- res-inst-eecs-berkeley-edu-ee6765d9c1
atlas: true
---

## 解决什么问题

给定状态、动作和目标，怎样找到解或低成本路径？

## 动机与发展线索

枚举所有可能行动会迅速产生巨大空间。搜索方法组织探索顺序；启发式利用问题知识，引导探索更可能有价值的状态。

## 核心思想

定义起点、后继与目标。BFS 按深度探索，DFS 沿路径深入；A* 根据已付出的路径成本与剩余成本估计排序。它们的保证依赖具体条件。

## 假设与前提

- 可以生成合法后继，并判断目标。
- 成本定义与任务相符。
- A* 的最优性需要合适的启发式与实现条件，如一致启发式下的标准图搜索。

## 优势

模型已知时不需要训练数据；规则明确，过程相对容易检查。

## 局限

状态空间可能非常大。启发式质量决定效率；知识不足时搜索退化，知识错误时可能误导。

## 典型应用与工程示例

示例：路线规划、离散工艺步骤选择或满足规则的配置搜索。连续参数问题也可以离散化，但会损失精度并扩大空间。

## 替代方法

带大量逻辑约束时可考虑约束满足或 SAT/SMT；连续变量可考虑数学优化。规则未知时需要学习或系统辨识。

## 最小实践

在小型带权图上比较 BFS、代价搜索和 A*。检查启发式是否低估剩余成本，并统计展开节点数，不只看运行时间。
