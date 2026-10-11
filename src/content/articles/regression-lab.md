---
date: "2026-10-09"
updated: "2026-10-09"
difficulty: "入门"
draft: false
kind: "guide"
title: "用一条直线预测能耗"
description: "从负载和能耗的教学数据出发，认识预测、训练与基线。"
tags: ["共同基础", "回归", "预测"]
estimatedReadingTime: 8
prerequisites: ["函数与基本代数"]
references: [{"title": "Google：线性回归", "url": "https://developers.google.com/machine-learning/crash-course/linear-regression"}, {"title": "Google：数据划分", "url": "https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets"}]
---

## 从一个工程问题开始

你想根据设备负载，估计它的能耗。每行数据是一组输入 $x$ 和输出 $y$：负载是特征（feature），能耗是标签（label）。这里用固定的合成数据说明方法，横纵坐标都是教学尺度，没有物理单位，也不是实际设备测量。

回归（regression）预测一个数。模型只学到这些数据中的关系；是否适合真实设备，还需要测量与验证。

## 直线如何成为模型

用 $\hat y=wx+b$ 预测输出。$\hat y$ 是预测值，$w$ 是斜率，$b$ 是截距。斜率描述负载增加一单位时，预测值增加多少；截距是输入为零时的预测。

先拖动上方滑块，再点击“用训练数据拟合”。前者是手动选择斜率，后者从训练数据计算斜率和截距。拟合的目标是让预测与训练观测更接近。

$$\mathrm{MSE}=\frac{1}{n}\sum_{i=1}^{n}(y_i-\hat y_i)^2$$

$n$ 是样本数，$y_i$ 是第 $i$ 个观测，$\hat y_i$ 是它的预测。平方让正负误差不会互相抵消；大误差也会获得更大的权重。MSE 的量纲是输出量纲的平方。

## 为什么需要一个简单基线

先试试“所有输入都预测训练集平均能耗”。这不利用输入，但能提供一个可以比较的起点。如果新模型连这个基线都没有超过，应先检查数据、任务或实现。

本例中均值基线与直线都只由训练数据确定，再到同一组验证数据上比较。不能把验证数据一起用于计算参数后，再声称它们是没见过的样本。

## 运行最小示例

下载 [regression.py](../../examples/regression.py)，在安装了 Python 3 的电脑上运行：

```sh
python3 regression.py
```

代码仅使用 Python 标准库，无需安装机器学习框架。关键步骤是：

```python
w, b = linear_fit(train)
predict = lambda x: w*x + b
validation_error = mse(validation, predict)
```

这份固定数据示例的实际运行输出为：

```text
w=1.9657, b=1.0857
training MSE=0.03657
validation MSE=0.01235
mean baseline validation MSE=8.01000
```

修改一个训练观测，再运行一次。参数与两组误差如何变化？不要把这份教学数据上的优势直接推广到真实场景。

## 如何检查你是否理解

- 说出输入、输出、参数和预测分别是什么。
- 解释为什么要用另一组数据评价。
- 解释均值基线为什么有用。
- 说明在未见过的负载范围外预测，需要哪些额外证据。

## 方法的边界与下一步

若真实关系明显弯曲，直线可能不够；若数据来自同一台设备的连续时刻，简单随机划分也可能高估泛化能力。应根据未来使用场景，考虑按时间或设备分组划分。

下一篇用 [故障识别](../classification-lab/) 理解预测类别，再用 [过拟合实验](../overfitting-lab/) 检查模型复杂度。算法概览见 [回归图鉴](../../atlas/regression/)。
