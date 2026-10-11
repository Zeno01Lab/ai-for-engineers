export function engineeringAdvice(questions,profiles,choices){const q=questions.find(q=>q.id===choices.task);if(!q)return null;const notes=[];let methods=[...q.methods];
 if(['predict','detect'].includes(q.id)&&choices.data==='unlabeled')notes.push('当前没有目标标签：先定义并收集目标值，或转向探索数据结构；还不能直接验证监督预测。');
 if(q.id==='explore'&&choices.data==='labeled')notes.push('已有标签时，也可以先比较回归或分类；聚类不必成为唯一入口。');
 if(['expensive','tradeoffs'].includes(q.id)){
  if(choices.cost==='cheap')notes.push('评价便宜时，先比较随机搜索或直接搜索；代理模型的额外成本未必划算。');
  if(choices.cost==='expensive')notes.push('评价昂贵时，统一评价次数与初始条件，检查节省的实验成本是否超过建模成本。');
  if(choices.gradient==='available')notes.push('有可靠梯度时，增加梯度法基线；不能只与无梯度方法比较。');
  if(choices.variables==='mixed')notes.push('离散或混合变量：先明确哪些组合可行，再选择支持该设计空间的模型与搜索方式。');
  if(choices.dimension==='high')notes.push('高维空间可能使代理建模和采集函数求解困难；先考虑降维、变量筛选，并保留 Random Search（随机搜索）或直接搜索基线。');
  if(choices.noise==='noisy')notes.push('评价有噪声时，记录重复试验、随机种子与不确定性；不要把单次最好结果当作稳定改进。');
  if(choices.gradient==='unknown')notes.push('尚不清楚梯度是否可得：先确认目标与约束的求导条件。');
 }
 if(q.id==='structured'){
  if(choices.structure==='graph')methods=['graph-neural-networks','data-evaluation'];
  if(choices.structure==='image')methods=['neural-networks','data-evaluation'];
  if(choices.structure==='sequence')methods=['neural-networks','transformers','data-evaluation'];
  if(choices.structure==='table')methods=['regression','classification','data-evaluation'];
 }
 if(choices.amount==='small'&&['predict','detect','structured','generate'].includes(q.id))notes.push('样本较少时，先用简单模型和稳定的数据划分；预训练、增广或复杂模型仍需任务验证。');
 if(choices.constraints==='hard')notes.push('硬约束应单独定义并核验，违规结果不计为成功；高平均性能不能抵消不可行结果。');
 if(choices.risk==='high')notes.push('失败代价较高时，先在离线或受控环境验证，并定义可检查的失败与恢复流程。');
 if(choices.data==='unknown')notes.push('数据与反馈尚未明确：先记录输入、目标和评价方式，当前结果只提供候选入口。');
 return{question:q,profile:profiles[q.id],methods,notes};
}
