export const engineeringQuestions = [
 {id:'predict',title:'我有实验数据，想预测一个数',example:'能耗、材料强度、设备性能',inputs:'输入特征与连续观测值',conditions:'有可解释的数据划分，先比较均值或机理模型。',methods:['regression','data-evaluation'],events:['random-forests'],lesson:'regression-lab'},
 {id:'detect',title:'我想识别状态或判断是否合格',example:'故障识别、质量检测、类别判断',inputs:'特征、类别标签与错误代价',conditions:'明确误报和漏报的代价，检查类别比例与阈值。',methods:['classification','data-evaluation'],events:['perceptron','svm-1995'],lesson:'classification-lab'},
 {id:'explore',title:'没有标签，想探索数据中的结构',example:'运行状态分组、相似样本发现',inputs:'特征与有意义的相似性度量',conditions:'先检查尺度；聚类结果不自动等于真实类别。',methods:['clustering'],events:[],lesson:''},
 {id:'expensive',title:'每次试验昂贵，想更有效地选参数',example:'材料配方、工艺参数、仿真实验',inputs:'参数范围、目标、约束与评价预算',conditions:'先运行随机搜索基线，再检查代理模型与预算是否合适。',methods:['bayesian-optimization'],events:['ego'],lesson:''},
 {id:'tradeoffs',title:'多个指标相互制约',example:'成本与性能、精度与效率',inputs:'多个目标与必须满足的约束',conditions:'检查可行性，再比较取舍的解集，不只报告单个最优值。',methods:['multi-objective'],events:['nsga-ii'],lesson:''},
 {id:'structured',title:'输入是图像、序列或连接结构',example:'图像检测、时序信号、网络与实体关系',inputs:'输入结构、样本量与计算预算',conditions:'先比较简单模型；架构应与输入结构和任务对应。',methods:['neural-networks','transformers','graph-neural-networks'],events:['cnn-1989','lstm','transformer'],lesson:''},
 {id:'control',title:'当前行动会改变未来状态',example:'机器人控制、调度与交互决策',inputs:'状态、动作、反馈与长期目标',conditions:'先比较控制或规划方法，关注交互成本与失败定义。',methods:['search','reinforcement-learning'],events:['q-learning','alphago'],lesson:''},
 {id:'tools',title:'想让语言模型查询信息、使用工具',example:'文档检索、日志处理、工程流程',inputs:'工具接口、结果检查与执行预算',conditions:'先设计固定工作流；记录每次调用并独立核查结果。',methods:['agents','transformers'],events:['rag','react','toolformer'],lesson:''},
 {id:'uncertainty',title:'观测不完整，想表达和更新不确定性',example:'诊断推断、概率预测、含噪实验',inputs:'概率模型、观测与条件假设',conditions:'说明概率的依据；检查模型假设与校准，不把相关性当作因果。',methods:['probabilistic-inference','bayesian-optimization'],events:['pearl-1988','ego'],lesson:''},
 {id:'generate',title:'想生成新样本或候选方案',example:'图像合成、模拟样本、设计候选',inputs:'示例数据、生成条件与有效性约束',conditions:'生成相似样本不等于物理可行或性能达标，需要独立检验。',methods:['generative-models','data-evaluation'],events:['gan','ddpm'],lesson:''},
 {id:'verify',title:'需要检查明确的逻辑约束或性质',example:'约束一致性、模型范围内的性质验证',inputs:'精确定义的模型、假设和性质',conditions:'证明结论只覆盖模型与假设；真实系统需要其他验证。',methods:['formal-methods'],events:[],lesson:''},
];
