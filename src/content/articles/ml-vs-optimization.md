---
title: "Machine Learning 与 Optimization 有什么区别？"
description: "预测映射与寻找输入，是互相关联但不同的任务。"
date: "2026-10-09"
tags: ["预测", "优化"]
difficulty: "入门"
estimatedReadingTime: 5
prerequisites: ["基本工程背景"]
references: [{"title": "Google ML Crash Course", "url": "https://developers.google.com/machine-learning/crash-course/"}, {"title": "pymoo Getting Started", "url": "https://pymoo.org/getting_started/index.html"}]
draft: true
kind: "guide"
---

## 预测问“这个输入会怎样”

给定设备设定 x 和观测能耗 y，机器学习可以拟合预测函数。它的主要评价是新样本上的误差。训练过程本身也使用优化来调整模型参数。

## 设计优化问“应该选择什么输入”

优化器寻找满足约束的设计参数，使目标更好。目标评价可以来自真实实验、数值仿真或预测模型。没有训练数据时，也能运行随机搜索或某些直接优化方法。

## 两者可以组合

代理模型替代昂贵评价的一部分工作，优化器在模型上选点，再由真实实验确认。模型失准时，优化器可能寻找模型误差最大的区域，而不是真正优秀的设计。

## 不要混淆验证方式

预测误差低，不保证搜索到的最优点在真实系统上有效；找到好设计，也不代表模型全局准确。把数据划分、真实评价次数与结果确认分别记录，才能解释各模块的贡献。
