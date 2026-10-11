---
title: Transformer 与语言模型
description: 如何建模序列关系，并将预训练能力迁移到语言任务？
date: '2026-10-09'
tags:
- 深度学习
- LLM
- 序列
difficulty: 入门
estimatedReadingTime: 4
prerequisites:
- 神经网络
- 向量与矩阵
draft: false
family: 深度学习
problem: 如何建模序列关系，并将预训练能力迁移到语言任务？
english: Transformers & Language Models
shortEnglish: Transformers
group: neural
mapOrder: 4
foundationConceptIds:
- deep-learning
- probability
detailConceptId: transformers
lessonId: null
historyEventIds: []
referenceIds:
- res-arxiv-org-a7468c6851
- res-introtodeeplearning-com-89247b19be
atlas: true
---

## 解决什么问题

如何建模序列关系，并将预训练能力迁移到语言任务？

## 动机与发展线索

循环结构按步处理序列，长距离依赖和训练并行化各有困难。Transformer 以注意力建立位置之间的关系，成为现代语言模型的重要基础。

## 核心思想

注意力根据查询与键的匹配，对值进行加权组合；多头与多层结构学习不同关系。语言模型常以预测下一个 token 等目标预训练，生成阶段则根据上下文逐步输出。

## 假设与前提

- 序列或 token 表示适合任务。
- 训练数据、上下文与评价任务的关系得到检查。
- 生成结果有独立核查方式，尤其是计算、事实与工程约束。

## 优势

注意力能连接不同位置的信息；预训练模型可通过提示、上下文或进一步训练适配不同任务。

## 局限

生成流畅与结果正确是不同指标。注意力和长上下文有计算成本；模型不会仅因见过类似文本就保证计算或事实可靠。

## 典型应用与工程示例

示例：提取工程文档信息，生成工具调用参数，或解释结构化仿真日志。数值结果仍需来自真实工具与检查。

## 替代方法

结构固定的数据提取可用解析器；表格预测可用传统模型；明确公式计算应直接使用数值工具。

## 最小实践

从最小注意力例子认识查询、键、值，再比较同一任务下有无工具结果的输出。记录错误类型，而不只评判语言是否自然。
