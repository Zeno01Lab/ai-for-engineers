export const problems = [
  { topic:'PREDICTION', title:'我有数据，想预测结果', description:'从实验或仿真数据中学习输入与输出的关系。', route:'回归 → 树模型 → 神经网络', algorithm:'regression' },
  { topic:'EXPENSIVE EXPERIMENTS', title:'每次实验都很昂贵', description:'让下一次试验更有信息量，节省有限的评价预算。', route:'随机搜索 → 代理模型 → 贝叶斯优化', algorithm:'bayesian-optimization' },
  { topic:'TRADE-OFFS', title:'多个指标相互制约', description:'寻找一组可行的取舍，而不是用一个数字掩盖所有目标。', route:'约束 → Pareto 前沿 → 多目标优化', algorithm:'multi-objective' },
  { topic:'SEQUENTIAL DECISIONS', title:'我需要连续决策', description:'动作会改变未来状态，需要考虑长期结果。', route:'控制基线 → MDP → 强化学习', algorithm:'reinforcement-learning' },
  { topic:'STRUCTURED DATA', title:'数据里有图与连接关系', description:'将实体及其连接关系纳入模型，而非简单展平。', route:'图表示 → 消息传递 → GNN', algorithm:'graph-neural-networks' },
  { topic:'TOOLS & WORKFLOWS', title:'想让 AI 使用工程工具', description:'把工具调用、结果观察与下一步行动组成可检查的循环。', route:'工作流 → 工具接口 → Agent', algorithm:'agents' },
];
