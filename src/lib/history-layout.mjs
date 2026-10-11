export const historyLanes=[
 {id:'foundations',label:'基础与符号 AI',tracks:['Foundations & Symbolic AI']},
 {id:'statistics',label:'概率与统计学习',tracks:['Probabilistic Modeling','Statistical ML']},
 {id:'search',label:'搜索与优化',tracks:['Search & Planning','Optimization']},
 {id:'neural',label:'神经网络与架构',tracks:['Neural & Deep Learning']},
 {id:'decision',label:'序贯决策与强化学习',tracks:['Sequential Decision & RL']},
 {id:'generation',label:'生成、基础模型与工具',tracks:['Generative Models','Foundation Models & Agents','Reasoning & Evaluation']},
 {id:'science',label:'基准与科学应用',tracks:['Benchmarks & Scientific AI']},
];
export const historyPeriods=[
 {start:1943,end:1949,label:'1943–49'}, {start:1950,end:1959,label:'1950–59'},
 {start:1960,end:1969,label:'1960–69'}, {start:1970,end:1989,label:'1970–89'},
 {start:1990,end:1999,label:'1990–99'}, {start:2000,end:2009,label:'2000–09'},
 {start:2010,end:2014,label:'2010–14'}, {start:2015,end:2019,label:'2015–19'},
 {start:2020,end:2021,label:'2020–21'}, {start:2022,end:2023,label:'2022–23'},
 {start:2024,end:2025,label:'2024–25'},
];
export function yearX(year){const index=historyPeriods.findIndex(p=>year>=p.start&&year<=p.end);if(index<0)throw new Error(`Year outside map coverage: ${year}`);return 205+index*170;}
export function layoutHistory(records){let top=95;const lanes=[];const nodes=[];for(const lane of historyLanes){const entries=records.filter(n=>lane.tracks.includes(n.track)).sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));const ends=[];const positions=entries.map(n=>{const x=yearX(n.year);let row=ends.findIndex(end=>end+12<=x);if(row<0)row=ends.length;ends[row]=x+155;return{...n,x,row};});const height=Math.max(82,ends.length*64+32);lanes.push({...lane,y:top,height});positions.forEach(n=>nodes.push({...n,group:lane.id,y:top+30+n.row*64,width:155,height:58}));top+=height+5;}return{width:2090,height:top+20,lanes,nodes};}
