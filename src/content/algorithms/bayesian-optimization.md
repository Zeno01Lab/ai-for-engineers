---
title: 贝叶斯优化
description: 每次函数评价昂贵，如何选择更有价值的下一次实验？
date: '2026-10-09'
tags:
- 优化
- 昂贵实验
- 代理模型
difficulty: 入门
estimatedReadingTime: 4
prerequisites:
- 回归
- 概率分布
- 目标函数
draft: false
family: 优化
problem: 每次函数评价昂贵，如何选择更有价值的下一次实验？
english: Bayesian Optimization
shortEnglish: Bayesian Opt.
group: optimization
mapOrder: 1
foundationConceptIds:
- optimization
- probabilistic-inference
- regression
detailConceptId: bayesian-optimization
lessonId: null
historyEventIds: []
referenceIds:
- res-ax-dev-de6e11afbe
- res-pymoo-org-9d6ad8f27d
atlas: true
---

## 解决什么问题

每次函数评价昂贵，如何选择更有价值的下一次实验？

## 动机与发展线索

网格或随机搜索可能花费大量评价预算。贝叶斯优化利用已有观测，在模型指导下分配下一次评价。它优化的是原始目标函数，不是语言模型的回答。

## 核心思想

建立目标函数的概率代理模型，再用采集函数平衡探索未知区域与利用已有好点。选点、真实评价、更新模型，构成循环。常见代理模型包括高斯过程，但 BO 不限定一种模型。

## 假设与前提

- 设计空间、目标与约束定义明确。
- 代理模型的结构与不确定性估计对问题足够有用。
- 函数评价足够昂贵，使拟合模型和求解采集函数的成本值得付出。

## 优势

能复用历史观测，适合评价预算紧张的黑盒参数搜索；也可以扩展到噪声、约束和多目标设置。

## 局限

高维、混合变量、强非平稳或高度不连续的空间可能增加建模难度。模型不确定性失准会误导选点；不存在对所有问题都最优的 BO 配置。

## 典型应用与工程示例

示例：优化一个需要数小时测试的材料配方，或选择需要昂贵仿真的工程设计参数。

## 替代方法

评价便宜时先比较随机搜索、差分进化或其他直接搜索；能可靠获得梯度时考虑梯度法。先检查变量规模与建模成本。

## 最小实践

用同一组初始点与相同评价次数比较随机搜索和 BO。画出随评价次数变化的最优可行值，使用多个随机种子，另外报告算法计算时间。
