export const relationKinds = {
 historical_intellectual_lineage:{label:'思想联系',group:'context'},
 field_context:{label:'学科背景',group:'context'},
 contemporary_parallel:{label:'同时代并行研究',group:'parallel'},
 addresses_limitations:{label:'回应早期方法的局限',group:'development'},
 method_used_in:{label:'采用训练方法',group:'adoption'},
 same_architectural_family:{label:'同一架构家族',group:'family'},
 benchmark_enabled:{label:'提供数据与评价条件',group:'support'},
 combines_with_neural_representation:{label:'结合神经网络表示',group:'adoption'},
 shared_deep_rl_paradigm:{label:'共享深度强化学习思路',group:'family'},
 search_family_not_direct_influence:{label:'同属搜索家族',group:'comparison'},
 different_solution_to_sequence_modeling:{label:'序列建模的不同方案',group:'comparison'},
 architecture_adopted:{label:'采用模型架构',group:'adoption'},
 architecture_family:{label:'同一架构家族',group:'family'},
 base_model_adaptation:{label:'基于已有模型调整',group:'adoption'},
 related_training_approach:{label:'相关训练思路',group:'family'},
 alternative_system_architecture:{label:'另一种系统方案',group:'comparison'},
 language_model_component:{label:'语言模型作为组件',group:'support'},
 related_parallel_research:{label:'相关的并行研究',group:'parallel'},
 shared_reasoning_rl_direction:{label:'共享推理与强化学习方向',group:'family'},
 alternative_generative_model_family:{label:'生成建模的不同机制',group:'comparison'},
 complementary_optimization_problem:{label:'不同的优化重点',group:'comparison'},
 shared_uncertainty_reasoning:{label:'不确定性概念联系',group:'context'},
 different_model_family:{label:'不同模型家族',group:'comparison'},
 benchmark_methodology_comparison:{label:'跨领域评价比较',group:'comparison'},
} as const;
export const relationGroups:Record<string,string>={adoption:'方法采用或组合',development:'问题与改进',support:'组件与评价条件',family:'共同家族或思路',comparison:'教学比较',parallel:'并行研究',context:'背景与概念'};
export const subjectKinds:Record<string,string>={theoretical_model:'理论模型',foundational_work:'基础讨论',field_event:'学科事件',algorithm:'算法',system:'研究系统',training_method:'训练方法',book:'知识体系与专著',architecture:'模型架构',dataset:'数据集与基准',model_family:'模型家族',model:'代表模型',system_architecture:'系统方案',product_release:'产品发布',model_release:'模型发布'};
export const yearBases:Record<string,string>={paper:'论文发表年',preprint:'预印本首发年',project_start:'项目启动年',event:'活动发生年',release:'公开发布年',book:'专著出版年'};
export const tracks:Record<string,string>={'Neural & Deep Learning':'神经网络与深度学习','Foundations & Symbolic AI':'基础与符号 AI','Sequential Decision & RL':'序贯决策与强化学习','Search & Planning':'搜索与规划','Probabilistic Modeling':'概率建模','Statistical ML':'统计机器学习','Optimization':'优化','Benchmarks & Scientific AI':'基准与科学 AI','Generative Models':'生成模型','Foundation Models & Agents':'基础模型与智能体','Reasoning & Evaluation':'推理与评价'};
