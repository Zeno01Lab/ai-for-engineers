---
title: 聚类与相似性
description: 没有类别标签时，根据相似性探索样本分组。
date: '2026-10-09'
tags:
- 无监督学习
- 数据
- 探索
difficulty: 入门
estimatedReadingTime: 4
prerequisites:
- 向量与距离
draft: false
family: 机器学习
problem: 没有类别标签时，根据相似性探索样本分组。
english: Clustering
shortEnglish: Clustering
group: learning
mapOrder: 5
foundationConceptIds:
- unsupervised
- linear-algebra
detailConceptId: clustering
lessonId: null
historyEventIds: []
referenceIds:
- res-developers-google-com-d922e6fab0
- res-developers-google-com-20dd1f0c9d
atlas: true
---

## 解决什么问题

没有正常或故障标签，但希望探索设备数据中是否有不同运行状态。聚类根据定义的相似性，把样本组织成组。

## 动机与核心思想

k-means 用若干中心表示数据，交替分配样本到附近中心、更新中心。这里的“接近”依赖特征与距离定义。

## 假设与前提

特征尺度和距离应有意义。按温度与转速分组时，不能让数值范围较大的特征在没有理由的情况下主导距离。

## 优势与局限

可以帮助探索未标注数据，但聚出的组不自动等于真实故障类别。k-means 对簇形状、异常点、初始化和簇数选择敏感。

## 替代方法

有可靠类别标签时可考虑监督分类。存在不规则形状或噪声时，应检查其他聚类方法是否更适合，而不是仅调整 k。

## 最小实践

画出少量二维数据，按两种不同的特征尺度比较分组。解释分组变化来自什么，以及如何利用领域知识检查结果。
