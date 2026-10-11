---
title: 强化学习
description: 行动改变未来状态，怎样学习获得较好长期结果的策略？
date: '2026-10-09'
tags:
- 决策
- MDP
- 策略
difficulty: 入门
estimatedReadingTime: 4
prerequisites:
- 概率
- 状态与动作
- 期望
draft: false
family: 决策
problem: 行动改变未来状态，怎样学习获得较好长期结果的策略？
english: Reinforcement Learning
shortEnglish: Reinforcement Learning
group: decision
mapOrder: 1
foundationConceptIds:
- sequential
- data-evaluation
detailConceptId: reinforcement-learning
lessonId: null
historyEventIds: []
referenceIds:
- res-inst-eecs-berkeley-edu-ee6765d9c1
atlas: true
---

## 解决什么问题

行动改变未来状态，怎样学习获得较好长期结果的策略？

## 动机与发展线索

单步预测无法直接回答如何连续行动。强化学习通过交互经验学习策略或价值；它与控制和规划有联系，但问题表述与训练方式需要具体区分。

## 核心思想

用状态、动作、转移与奖励描述环境。策略决定行动，回报汇总长期奖励。MDP 是建模框架；已知模型时可以规划，未知模型时可以从经验学习。

## 假设与前提

- 状态表示足以支持当前决策，或使用能够处理部分可观测性的模型。
- 奖励与真正目标相符。
- 交互成本、安全边界与训练预算可接受。

## 优势

适合动作之间存在长期关联、任务反复发生且经验可复用的情形。策略部署时不一定需要每步重新求解整个训练问题。

## 局限

训练可能消耗大量交互。奖励设计、分布变化与探索行为都会影响结果；把静态参数搜索包装成序列，并不会自动使 RL 更合适。

## 典型应用与工程示例

示例：机器人控制、储能调度与连续资源分配。需要同时比较控制或规划基线，不能只看训练回报。

## 替代方法

已知动力学时考虑模型预测控制、动态规划或规划方法；一次性黑盒参数优化可先考虑 BO 或直接搜索。

## 最小实践

从小型已知 MDP 出发，分别用价值迭代和经验学习求策略。记录交互次数与不同种子表现，再讨论策略对环境变化的敏感性。
