export const engineeringProfiles:Record<string,{baseline:string;check:string}>={
 predict:{baseline:'先比较训练集均值，再用线性回归。',check:'用独立于训练的数据比较误差；样本划分要符合实际部署方式。'},
 detect:{baseline:'先比较多数类预测或简单阈值。',check:'同时检查误报、漏报和类别比例，不只报告准确率。'},
 explore:{baseline:'先可视化标准化特征与简单距离分组。',check:'检查分组对尺度、距离和样本扰动是否稳定；不要直接把簇当成真实类别。'},
 expensive:{baseline:'同预算随机搜索，并记录最优可行结果。',check:'候选优化方法用同一初始点与评价预算比较；另报算法计算成本。'},
 tradeoffs:{baseline:'随机采样可行方案，展示各指标的取舍。',check:'先比较约束满足率，再比较解集；不要把不同量纲直接相加。'},
 structured:{baseline:'先做简单特征加回归或分类模型。',check:'结构输入不自动要求深度模型；检查任务标签、数据规模与结构是否有意义。'},
 control:{baseline:'规则策略、简单控制器或已知模型上的规划。',check:'明确失败、长期目标和交互成本；在线试错代价要计入预算。'},
 tools:{baseline:'固定工具流程与逐步结果检查。',check:'比较成功率、错误调用、预算和可恢复性；记录工具返回结果。'},
 uncertainty:{baseline:'简单概率模型或经验频率，配合点预测。',check:'检查预测校准、模型假设与观测偏差；相关性不自动支持因果判断。'},
 generate:{baseline:'先比较复用已有有效样本或简单候选生成。',check:'输出相似不等于物理可行；单独验证约束、质量与多样性。'},
 verify:{baseline:'在小实例上手工检查或枚举约束。',check:'写清模型、假设与性质；小实例检查不等于一般证明或真实系统保证。'},
};
