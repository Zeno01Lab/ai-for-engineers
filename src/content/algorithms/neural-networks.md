---
title: 神经网络与非线性表示
description: 通过多层计算学习非线性关系，再用新数据检查效果。
date: '2026-10-09'
tags:
- 深度学习
- 非线性
- 表示
difficulty: 进阶
estimatedReadingTime: 4
prerequisites:
- 回归
- 分类
- 向量与基本微积分
draft: false
family: 深度学习
problem: 通过多层计算学习非线性关系，再用新数据检查效果。
english: Neural Networks
shortEnglish: Neural Networks
group: neural
mapOrder: 0
foundationConceptIds:
- linear-algebra
- training
- generalization
detailConceptId: neural-networks
lessonId: null
historyEventIds: []
referenceIds:
- res-developers-google-com-6189892c46
- res-introtodeeplearning-com-89247b19be
atlas: true
---

## 为什么只用直线可能不够

输入与输出的关系可能是非线性的。除了手工设计特征，也可以使用神经网络，让训练过程调整多层计算中的参数。

## 核心思想

一层常由线性变换与非线性激活组成，例如 $h=\max(0,wx+b)$。这里 $x$ 是输入，$w,b$ 是参数，$h$ 是输出；这个激活称为 ReLU。

只叠加线性变换，整体仍是线性变换。加入非线性后，网络能够表示更复杂的函数。多层网络形成深度学习中的常见模型。

## 怎样训练

前向计算得到预测，损失函数描述预测误差，反向传播计算参数的梯度，再由优化算法更新参数。反向传播与更新参数不是同一个步骤。

## 优势与局限

模型具有灵活的表示能力，但需要合理的数据、容量与训练设置。训练误差低不能单独证明泛化能力；先与简单模型比较。

## 如何继续

先理解一个小网络的输入、层和输出，再按输入结构学习 CNN、Transformer 或 GNN。不同架构提供不同的结构假设，并非名称越新就越适合。

## 最小实践

先计算一个 ReLU 单元在不同输入下的输出，再选读官方的交互示例。记录输入尺寸、参数和损失如何改变，不急于训练大模型。
