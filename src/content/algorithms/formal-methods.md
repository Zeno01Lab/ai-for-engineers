---
title: 形式化方法
description: 能否在明确假设和模型下证明系统满足某个性质？
date: '2026-10-09'
tags:
- 验证
- 约束
- 证明
difficulty: 进阶
estimatedReadingTime: 4
prerequisites:
- 基本逻辑
- 系统模型
draft: false
family: 验证
problem: 能否在明确假设和模型下证明系统满足某个性质？
english: Formal Methods
shortEnglish: Formal Methods
group: symbolic
mapOrder: 2
foundationConceptIds:
- logic
- search
detailConceptId: formal-methods
lessonId: null
historyEventIds: []
referenceIds:
- res-z3prover-github-io-bea2dcd166
atlas: true
---

## 解决什么问题

能否在明确假设和模型下证明系统满足某个性质？

## 动机与发展线索

有限测试只能覆盖有限输入。形式化方法把系统与性质变成数学对象，利用逻辑推理、求解器或模型检查分析满足性与反例。

## 核心思想

例如表达约束 $C(x)$，要证明性质 $P(x)$，可以尝试求解 $C(x)\land\neg P(x)$。若可靠求解得到 unsat，就排除了该编码下的反例；sat 给出模型，unknown 不能当作证明。

## 假设与前提

- 系统编码、抽象与边界条件正确。
- 性质确实表达工程需求。
- 求解器能力适合所用理论，结论解释与求解结果一致。

## 优势

能给出相对于模型的明确保证或可检查反例，可用于等价性、约束一致性和安全性质。

## 局限

证明的是模型中的性质。离散化、线性化或有界展开的证明不能自动推广到真实连续系统；大规模与非线性问题可能很难求解。

## 典型应用与工程示例

示例：证明离散控制逻辑不会进入非法状态，或验证一个参数约束集合是否存在可行解。物理系统需要说明建模误差与有效范围。

## 替代方法

仿真用于观察具体运行，统计测试用于估计特定分布下的表现。形式化分析、仿真与测量可以互补，各自回答不同的问题。

## 最小实践

先用整数约束练习 sat 与 unsat。写清变量域、假设和待证性质，检查反例能否在原系统重现，再考虑更复杂的模型。
