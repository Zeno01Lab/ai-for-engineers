---
title: 概率建模与推理
description: 用概率表达未知信息，并在获得观察后更新判断。
date: '2026-10-09'
tags:
- 概率
- 推理
- 不确定性
difficulty: 进阶
estimatedReadingTime: 4
prerequisites:
- 条件概率
- 基本代数
draft: false
family: 推理与验证
problem: 观察不完整或带有噪声时，怎样表达与更新判断？
english: Probabilistic Modeling & Inference
shortEnglish: Probabilistic Inference
group: probabilistic
mapOrder: 0
foundationConceptIds:
- probability
detailConceptId: probabilistic-inference
lessonId: null
historyEventIds: []
referenceIds:
- res-www-sciencedirect-com-9c38bd8367
- res-inst-eecs-berkeley-edu-ee6765d9c1
atlas: true
---

## 为什么需要概率

设备观测可能不完整，测量也会有噪声。概率模型帮助表达不同解释的可能性，而不是把每个判断都视为确定事实。

## 观察如何改变判断

贝叶斯公式连接先验、观察的似然与后验：

$$P(H\mid E)=\frac{P(E\mid H)P(H)}{P(E)}$$

$H$ 是假设，$E$ 是观察；$P(H)$ 为先验，$P(E\mid H)$ 为在假设成立时观察出现的概率，$P(H\mid E)$ 为获得观察后的判断。公式本身不会替你提供这些数值，需要数据或明确的模型假设。

## 方法与边界

概率图模型可以组织变量之间的依赖关系。条件依赖不自动等于因果关系，模型给出的概率也依赖结构、参数与观察质量。

## 工程联系

可以用于状态估计、故障解释或表达代理模型的不确定性。不同用途对应不同模型；共享概率思想不意味着算法直接继承。

## 最小练习

写出一个故障假设及一个传感器观察。区分先验、似然和后验，检查你是否把“故障时出现异常的概率”误当成“异常时故障的概率”。
