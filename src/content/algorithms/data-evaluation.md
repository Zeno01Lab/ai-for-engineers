---
title: 数据处理与模型评价
description: 把数据划分、预处理、基线和评价放在同一个流程里。
date: '2026-10-09'
tags:
- 共同基础
- 泛化
- 评价
difficulty: 入门
estimatedReadingTime: 4
prerequisites:
- 回归与分类的概念
draft: false
family: 共同基础
problem: 把数据划分、预处理、基线和评价放在同一个流程里。
english: Data & Evaluation
shortEnglish: Data & Evaluation
group: foundations
mapOrder: 3
foundationConceptIds: []
detailConceptId: data-evaluation
lessonId: null
historyEventIds: []
referenceIds:
- res-developers-google-com-f25a435a83
- res-scikit-learn-org-64104a5181
atlas: true
---

## 解决什么问题

模型在已有数据上表现很好，但不知道部署后是否仍然可靠。需要明确新样本是什么，并为它设计合适的评价。

## 核心流程

训练集拟合参数，验证集选择方案，测试集评价最终表现。标准化、特征选择等依赖数据的预处理也必须遵守这个分工。

## 评价要和任务对应

回归可以比较 MSE、MAE 等误差；分类需要同时检查混淆矩阵、类别比例与错误代价。用同一份数据划分比较简单基线和候选方法。

## 假设与边界

随机划分不是所有任务的默认正确答案。时间序列、同设备重复测量、同一对象的相似记录可能需要按时间或对象分组划分。

## 常见陷阱

先在全部数据上估计预处理参数，再划分；把同一对象的重复记录分到训练与测试；反复查看测试结果后继续调参。这些做法可能高估新数据表现。

## 最小实践

阅读 [过拟合实验](../../notes/overfitting-lab/)，解释为什么本例只报告训练与验证结果。再为一个设备预测任务写出划分方案。
