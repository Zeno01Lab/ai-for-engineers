---
title: 深度生成模型
description: 从数据学习生成机制，比较对抗训练与扩散两条路线。
date: '2026-10-09'
tags:
- 深度学习
- 生成模型
- GAN
- 扩散
difficulty: 进阶
estimatedReadingTime: 4
prerequisites:
- 概率
- 神经网络
- 训练与评价
draft: false
family: 深度学习
problem: 希望产生与训练数据具有相关结构的新样本。
english: Deep Generative Models
shortEnglish: Generative Models
group: generation
mapOrder: 0
foundationConceptIds:
- deep-learning
- probability
detailConceptId: generative-models
lessonId: null
historyEventIds: []
referenceIds:
- res-proceedings-neurips-cc-5e7488b853
- res-proceedings-neurips-cc-2f461f2739
atlas: true
---

## 从预测到生成

预测模型回答一个输入对应什么输出；生成模型学习数据中的结构，用于产生样本。生成的样本仍需检查是否满足实际任务的约束。

## 两种不同的机制

GAN 同时训练生成器和判别器：生成器产生样本，判别器判断样本来自数据还是生成器。二者的训练目标相互关联。

扩散模型使用不同的建模方式。以 DDPM 为例，模型学习与去噪相关的逆向过程，再逐步生成样本。它与 GAN 是不同路线，不应直接画成前后替代关系。

## 工程联系与边界

生成方法可以用于探索图像、结构或设计候选，但“看起来合理”不代表满足物理、制造或安全约束。工程候选还需要真实计算或实验评价。

## 怎样开始

先理解数据、训练目标与采样过程的区别。比较同一任务的生成质量、覆盖情况与计算成本；不要只看少数漂亮样本。

历史节点与比较关系见本页下方的历史入口。基础不熟悉时，先回到 [神经网络](../neural-networks/) 与 [数据评价](../data-evaluation/)。
