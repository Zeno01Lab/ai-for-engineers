---
title: 工具调用与智能体
description: 怎样让模型使用工具、观察结果，再决定下一步行动？
date: '2026-10-09'
tags:
- 智能体
- 工具
- 决策
difficulty: 入门
estimatedReadingTime: 4
prerequisites:
- 基本 Python
- LLM 概念
draft: false
family: 智能体
problem: 怎样让模型使用工具、观察结果，再决定下一步行动？
english: Tool Calling & Agents
shortEnglish: AI Agents
group: systems
mapOrder: 2
foundationConceptIds:
- tool-use
- search
- data-evaluation
detailConceptId: agents
lessonId: null
historyEventIds:
- react
- toolformer
referenceIds:
- res-huggingface-co-b6c643b138
atlas: true
---

## 解决什么问题

怎样让模型使用工具、观察结果，再决定下一步行动？

## 动机与发展线索

语言模型只能生成输出时，难以访问最新状态或执行工程任务。工具提供可操作接口，行动观察循环让系统根据工具结果继续决策。

## 核心思想

输入任务与当前上下文，模型选择工具与参数，执行器验证并调用工具，把结果回传，再决定继续或停止。固定工作流与自主选择工具的系统可以组合使用。

## 假设与前提

- 工具接口具有清晰参数、结果和失败定义。
- 模型获得的观察足以支持下一步决策。
- 权限、评价预算和终止条件由系统执行器约束。

## 优势

能用语言组织异构工具与非结构化信息，并在不同任务间复用接口。轨迹日志使决策可以复查。

## 局限

输出格式正确不代表参数合理。工具失败、无效循环与误读结果可能累计；模型生成的解释不能代替真实工具记录。

## 典型应用与工程示例

示例：读取实验设定、调用仿真、提取指标，再提出下一次实验。示例系统应区分建议、实际执行和测量结果。

## 替代方法

固定流程优先考虑普通脚本或工作流；纯数值参数搜索可以直接使用优化器。只有加入模型后能处理额外问题，才有理由增加复杂度。

## 最小实践

先写一个可测试的评价函数与结构化日志，再接模型。设置调用次数上限与参数检查，比较固定工作流、优化器和 Agent 的结果及成本。
