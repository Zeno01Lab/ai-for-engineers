---
date: "2026-10-09"
updated: "2026-10-09"
difficulty: "入门"
draft: false
kind: "guide"
title: "为什么拟合得更好，预测却更差？"
description: "用同一份合成数据比较直线与高次曲线，理解过拟合和数据划分。"
tags: ["共同基础", "泛化", "数据划分"]
estimatedReadingTime: 9
prerequisites: ["读过回归教程"]
references: [{"title": "Google：过拟合", "url": "https://developers.google.com/machine-learning/crash-course/overfitting/overfitting"}, {"title": "Google：模型复杂度", "url": "https://developers.google.com/machine-learning/crash-course/overfitting/model-complexity"}, {"title": "Google：数据划分", "url": "https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets"}, {"title": "scikit-learn：常见陷阱", "url": "https://scikit-learn.org/stable/common_pitfalls.html"}]
---

## 能穿过所有点，就是好模型吗？

假设输入与输出大致呈直线关系，但观测带有波动。你可以用一条直线抓住整体趋势，也可以用更弯曲的函数贴近每一个训练点。

上方例子固定九个带扰动的训练点，再用八个新位置的、没有扰动的趋势值作为验证数据。这样设计是为了单独展示模型拟合训练扰动的现象；真实验证数据通常也有噪声。

## 复杂度如何改变曲线

一次模型是直线，三次模型允许弯曲，八次模型有足够自由度穿过这九个不同输入的训练点。

每个模型都仅使用训练数据拟合参数。切换次数后，观察点与点之间的预测，以及训练、验证两组 MSE。纵轴会随曲线范围调整，所以同时看刻度与误差数值。

过拟合（overfitting）描述模型对训练数据的特有细节过度适应，导致在新样本上表现较差。更复杂的模型**可能**过拟合，但复杂度不是唯一因素；数据质量、样本量和分布也会影响结果。

## 运行同样的实验

下载 [overfitting.py](../../examples/overfitting.py)，运行：

```sh
python3 overfitting.py
```

这份固定示例实际输出为：

```text
degree=1: training MSE=0.00391, validation MSE=0.00150
degree=3: training MSE=0.00333, validation MSE=0.00198
degree=8: training MSE=0.00000, validation MSE=0.05866
```

这个例子支持的结论是：**训练误差不能单独用于判断新样本预测能力。** 它不能证明直线在所有任务中最好，也不能说明模型永远不能使用更多参数。

示例里的小规模多项式求解器用于解释流程；正式工程计算应使用经过验证的数值库，并考虑数值稳定性。

## 三组数据，各有用途

| 数据 | 用于什么 | 本例是否包含 |
| --- | --- | --- |
| 训练集 | 拟合模型参数 | 是 |
| 验证集 | 选择次数、阈值等方案 | 是，允许反复查看 |
| 测试集 | 方案确定后评价最终表现 | 否 |

如果反复看测试误差后修改方案，测试集也在间接参与选择。最初“未见过”不代表它可以无限次用于决策。

## 不让未来信息提前进入模型

预处理也属于学习过程。例如标准化需要估计均值和尺度，这些数值应由训练集获得，再应用到验证与测试数据。

对于时间序列，未来数据不能进入过去的训练；同一设备或同一个人的相似样本也可能需要分组划分。先明确“将来面对什么新情况”，再决定划分方式。

## 如何检查你是否理解

- 找出训练误差最低的模型，并说明为什么它未必是你的选择。
- 用自己的话解释训练、验证、测试的分工。
- 说明本例为何没有最终测试结果。
- 为一个实际工程场景提出合理的数据划分方式。

完成这三篇后，可以回到 [入门路线](../../start/) 选择下一条路径。数据与评价概览见 [算法图鉴](../../atlas/data-evaluation/)。
