---
date: "2026-10-09"
updated: "2026-10-09"
difficulty: "入门"
draft: false
kind: "guide"
title: "故障识别：阈值改变了什么？"
description: "用十个合成样本认识分类、误报、漏报和评价指标。"
tags: ["共同基础", "分类", "评价"]
estimatedReadingTime: 8
prerequisites: ["基本比例与分数"]
references: [{"title": "Google：阈值与混淆矩阵", "url": "https://developers.google.com/machine-learning/crash-course/classification/thresholding"}, {"title": "Google：分类评价指标", "url": "https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall"}]
---

## 从预测一个数到预测一个类别

设备状态识别希望输出“正常”或“故障”。这属于分类（classification）。实际系统可以从传感器特征学习一个分类模型，再输出故障分数。

本例直接给定十个合成分数与已知类别，只研究**分数之后如何作决定**；没有训练一个故障检测器。分数在 0 到 1 之间，也不意味着它一定是经过校准的故障概率。

## 阈值是一条决策规则

定义规则：分数大于或等于阈值，就预测为故障。上方滑块只改变阈值，不改变分数，也不重新训练模型。

阈值从 0.3 提高到 0.8 时，预测为故障的样本减少。对这组固定分数，误报数量不会增加，但漏报数量不会减少。精确率则不保证随阈值单调增加。

## 四种结果都要看

| 实际状态 | 预测状态 | 名称 | 工程含义 |
| --- | --- | --- | --- |
| 故障 | 故障 | TP，真阳性 | 检出了故障 |
| 正常 | 故障 | FP，假阳性 | 误报，可能导致不必要停机 |
| 正常 | 正常 | TN，真阴性 | 正确排除 |
| 故障 | 正常 | FN，假阴性 | 漏报，可能错过维修 |

“正”指本例的故障类别；它不是对好坏的评价。

## 用指标描述不同问题

准确率问全部样本中预测正确的比例。召回率问实际故障中检出了多少，精确率问预测为故障的样本中有多少是真的故障。

$$\mathrm{Accuracy}=\frac{TP+TN}{TP+FP+TN+FN}$$
$$\mathrm{Recall}=\frac{TP}{TP+FN},\qquad\mathrm{Precision}=\frac{TP}{TP+FP}$$

如果完全没有预测为故障的样本，精确率分母为零，应记录为未定义。实际没有任何故障时，召回率也未定义。

即使准确率相同，两组预测的误报与漏报数量也可能不同。故障稀少时，还应检查“全部预测为正常”的简单基线，避免被高准确率误导。

## 运行并观察

下载 [classification.py](../../examples/classification.py)，运行：

```sh
python3 classification.py
```

示例对几种阈值计算结果，实际输出为：

```text
threshold=0.3: TP=4, FP=3, TN=2, FN=1, precision=0.571, recall=0.800
threshold=0.5: TP=3, FP=2, TN=3, FN=2, precision=0.600, recall=0.600
threshold=0.8: TP=1, FP=1, TN=4, FN=4, precision=0.500, recall=0.200
threshold=1.0: TP=0, FP=0, TN=5, FN=5, precision=undefined, recall=0.000
```

假设一次误报造成 1 单位代价，一次漏报造成 10 单位代价。用 `FP + 10*FN` 比较这些阈值。这里的代价是练习假设，真实项目需要由应用方确定。

## 如何检查你是否理解

- 在表格中各找一个误报和漏报。
- 解释“提高阈值”为什么会改变两种错误。
- 解释为何不能只报告准确率。
- 说明模型训练与阈值选择的区别。

实际项目应在验证数据上选择阈值，之后用独立测试数据报告最终结果。这里可以反复查看的十个样本是教学演示，不是一次最终测试。

下一篇：[过拟合与数据划分](../overfitting-lab/)。方法入口：[分类图鉴](../../atlas/classification/)。
