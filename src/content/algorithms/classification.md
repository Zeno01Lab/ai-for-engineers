---
title: 分类与决策阈值
description: 预测离散类别，并根据错误代价选择决策规则。
date: '2026-10-09'
tags:
- 分类
- 评价
- 共同基础
difficulty: 入门
estimatedReadingTime: 4
prerequisites:
- 回归或基本比例
draft: false
family: 机器学习
problem: 预测离散类别，并根据错误代价选择决策规则。
english: Classification
shortEnglish: Classification
group: learning
mapOrder: 2
foundationConceptIds:
- supervised
- probability
detailConceptId: classification
lessonId: classification-lab
historyEventIds: []
referenceIds:
- res-developers-google-com-41c32b4592
- res-developers-google-com-bbeed2b245
atlas: true
---

## 解决什么问题

判断设备是否故障、图像属于哪一类，或产品是否合格。输出是离散类别，而不是能耗这样的连续数值。

## 动机与核心思想

模型从带类别标签的样本学习输入与类别的关系。例如逻辑回归先输出一个分数，再由阈值决定类别。训练模型与选择阈值是两个不同步骤。

## 假设与前提

标签定义明确，训练数据能够代表实际使用场景。分数不自动等同于可靠概率；需要时应检查校准。

## 优势与局限

类别结果便于接入决策流程，但单一准确率会隐藏误报、漏报和类别不平衡。错误的工程代价应由应用场景确定。

## 工程例子与替代方法

设备状态识别可以先比较人工阈值与一个简单分类器。若没有可信标签，应先解决标注或探索数据结构，而不是直接训练监督分类器。

## 最小实践

阅读 [故障识别教程](../../notes/classification-lab/)，拖动阈值并计算混淆矩阵。说明何时误报更昂贵，何时漏报更昂贵。
