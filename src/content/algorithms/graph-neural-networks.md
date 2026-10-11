---
title: 图神经网络
description: 数据由实体和连接组成，怎样利用拓扑关系学习表示？
date: '2026-10-09'
tags:
- 深度学习
- 数据
- 图结构
difficulty: 进阶
estimatedReadingTime: 4
prerequisites:
- 神经网络
- 向量
- 基本图概念
draft: false
family: 深度学习
problem: 数据由实体和连接组成，怎样利用拓扑关系学习表示？
english: Graph Neural Networks
shortEnglish: GNNs
group: neural
mapOrder: 5
foundationConceptIds:
- deep-learning
detailConceptId: graph-neural-networks
lessonId: null
historyEventIds: []
referenceIds:
- res-arxiv-org-f5d4559d7d
- res-introtodeeplearning-com-89247b19be
atlas: true
---

## 解决什么问题

数据由实体和连接组成，怎样利用拓扑关系学习表示？

## 动机与发展线索

图没有固定的像素网格，节点编号也常常没有物理意义。许多 GNN 以邻域聚合编码关系，减少对任意编号的依赖。GCN 是其中一种结构，不代表全部 GNN。

## 核心思想

节点接收邻居的信息，与自身表示组合，重复若干层。根据任务预测节点、边或整个图的属性；聚合与读出设计应满足所需的排列不变性或等变性。

## 假设与前提

- 连接与节点特征包含任务相关信息。
- 构图规则与实际关系相符。
- 训练与测试图之间的差异符合计划评估的泛化情形。

## 优势

能够结合局部结构与属性，用于分子、网络、网表等关系数据。

## 局限

构图质量、长距离依赖和表达能力影响效果。深层消息传递可能产生过平滑等问题；局部表示不天然保证全局物理约束。

## 典型应用与工程示例

示例：将原子与化学键构成分子图，或将工程网络中的组件与连接表示为图。

## 替代方法

先比较手工图特征加树模型、传统图算法或物理求解器。拓扑并非主要信息时，表格模型可能足够。

## 最小实践

确定节点、边和特征的含义。划分数据时避免相近图或同一系统的变体泄漏到测试集，并比较去掉连接信息后的模型。
