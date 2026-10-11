export const pathLanes=[
 {id:'trail',en:'Quick Start',zh:'快速起步'},
 {id:'supplies',en:'Math Foundations',zh:'数学基础'},
 {id:'data',en:'Machine Learning',zh:'机器学习'},
 {id:'representations',en:'Neural Architectures',zh:'神经网络架构'},
 {id:'generation',en:'Generative Models',zh:'生成模型'},
 {id:'systems',en:'Language Models & Agents',zh:'语言模型与智能体'},
 {id:'decisions',en:'Probability & Decisions',zh:'概率与决策'},
 {id:'experiments',en:'Optimization',zh:'优化方法'},
 {id:'symbolic',en:'Search & Logic',zh:'搜索与逻辑'},
];
export function layoutPath(steps){
 const byId=new Map(steps.map(s=>[s.id,s])),ranks=new Map(),visiting=new Set();
 function rank(id){if(ranks.has(id))return ranks.get(id);if(visiting.has(id)||!byId.has(id))throw Error(`Invalid path prerequisite: ${id}`);visiting.add(id);const value=Math.max(-1,...byId.get(id).prerequisites.map(rank))+1;visiting.delete(id);ranks.set(id,value);return value;}
 steps.forEach(s=>rank(s.id));
 const maxRank=Math.max(...ranks.values()),width=260+(maxRank+1)*238;
 let top=85;const lanes=[],nodes=[];
 for(const lane of pathLanes){const entries=steps.filter(s=>s.camp===lane.id).sort((a,b)=>rank(a.id)-rank(b.id)),ends=[];if(!entries.length)continue;
  for(const s of entries){const x=230+rank(s.id)*238;let row=ends.findIndex(end=>end+12<=x);if(row<0)row=ends.length;ends[row]=x+214;nodes.push({...s,rank:rank(s.id),x,y:top+14+row*90,width:214,height:78});}
  const height=Math.max(110,ends.length*90+28);lanes.push({...lane,x:10,y:top,width:width-20,height});top+=height+10;
 }
 const edges=steps.flatMap(s=>s.prerequisites.map(source=>({source,target:s.id,kind:'prerequisite'})));
 return {width,height:top+20,lanes,nodes,edges,maxRank};
}
export function pathCurve(a,b){
 const sx=a.x+a.width,sy=a.y+a.height/2,tx=b.x,ty=b.y+b.height/2;
 const bend=Math.max(18,(tx-sx)*.38);
 return `M${sx} ${sy}C${sx+bend} ${sy},${tx-bend} ${ty},${tx} ${ty}`;
}
export function relatedPath(steps,id){
 const byId=new Map(steps.map(s=>[s.id,s])),ancestors=new Set(),descendants=new Set();
 function before(key){for(const p of byId.get(key)?.prerequisites??[])if(!ancestors.has(p)){ancestors.add(p);before(p);}}
 function after(key){for(const s of steps.filter(s=>s.prerequisites.includes(key)))if(!descendants.has(s.id)){descendants.add(s.id);after(s.id);}}
 before(id);after(id);return{ancestors,descendants};
}
