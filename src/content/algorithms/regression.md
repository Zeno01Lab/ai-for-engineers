---
title: 回归与监督学习
description: 已知输入与连续输出的样本，预测新输入对应的结果。
date: '2026-10-09'
tags:
- 预测
- 数据
- 泛化
difficulty: 入门
estimatedReadingTime: 4
prerequisites:
- 函数
- 基本代数
draft: false
family: 机器学习
problem: 已知输入与连续输出的样本，预测新输入对应的结果。
english: Regression & Supervised Learning
shortEnglish: Regression
group: learning
mapOrder: 1
foundationConceptIds:
- supervised
- linear-algebra
detailConceptId: regression
lessonId: regression-lab
historyEventIds: []
referenceIds:
- res-developers-google-com-d78d5ccdf6
- res-scikit-learn-org-a0a701fbf2
- res-scikit-learn-org-64104a5181
atlas: true
---

## 解决什么问题

已知输入与连续输出的样本，预测新输入对应的结果。

## 动机与发展线索

当解析模型难以建立，但有成对的输入与测量结果时，可以从数据估计映射。线性回归是理解这一思想的简单入口；监督学习还包括分类任务。

## 核心思想

给定样本 $(x_i,y_i)$，选择参数使预测与观测的误差较小。线性模型使用 $\hat y=w^\top x+b$；非线性模型改变函数族，但仍需评估新数据上的误差。

$$L(w,b)=\frac{1}{n}\sum_{i=1}^{n}(y_i-w^\top x_i-b)^2$$

## 假设与前提

- 输入特征包含与目标有关的信息。
- 训练数据对未来使用环境有代表性；分布变化需要单独验证。
- 标签、测量与划分方式可解释，没有来自测试集的信息泄漏。

## 优势

线性模型训练成本低、容易检查，可作为复杂模型的比较基线。更灵活的模型能够表达非线性关系。

## 局限

相关性不代表因果。测试误差小也不保证远离训练范围时准确；复杂模型可能过拟合。

## 典型应用与工程示例

示例：用材料成分预测强度，或用设备温度与负载预测能耗。这里的案例说明任务结构，不代表已完成实验。

## 替代方法

有可信机理模型时先使用解析或物理模型；小数据可考虑线性或树模型。寻找最优输入则需要额外的优化方法。

## 最小实践

先划分数据，再拟合预处理与模型。比较均值预测、线性回归与一个树模型，报告测试误差并说明划分代表哪种泛化。

## 从这里动手

[用一条直线预测能耗](../../notes/regression-lab/)：拖动预测线、比较误差，再运行下载的 Python 示例。
