export const pathKey='zeno-learning-path-v1';
export function parsePath(raw,steps){
 try{const input=JSON.parse(raw);if(!input||typeof input!=='object'||Array.isArray(input))return {};const allowed=new Set(steps.map(s=>s.id));return Object.fromEntries(Object.entries(input).filter(([id,v])=>allowed.has(id)&&(v==='done'||v==='prior')));}catch{return {};}
}
export function pathState(steps,records){
 const byId=new Map(steps.map(s=>[s.id,s])),active=new Set(),visiting=new Set();
 function visit(id){if(active.has(id))return true;const s=byId.get(id);if(!s||visiting.has(id))return false;visiting.add(id);const valid=['prior','already_known'].includes(records[id])||(['done','completed'].includes(records[id])&&s.prerequisites.every(visit));visiting.delete(id);if(valid)active.add(id);return valid;}
 steps.forEach(s=>visit(s.id));
 const ready=new Set(steps.filter(s=>!active.has(s.id)&&s.prerequisites.every(id=>active.has(id))).map(s=>s.id));
 const lit=new Set(steps.filter(s=>active.has(s.id)).flatMap(s=>s.knowledge));
 const pending=new Set(steps.filter(s=>['done','completed'].includes(records[s.id])&&!active.has(s.id)).map(s=>s.id));
 return{active,ready,lit,pending};
}
export function changePath(steps,records,id,action,checked=false){
 const state=pathState(steps,records);if(!steps.some(s=>s.id===id))return records;
 if(action==='undo'){const next={...records};delete next[id];return next;}
 if(!checked||!['done','prior'].includes(action))return records;
 if(action==='done'&&!state.ready.has(id))return records;
 return{...records,[id]:action};
}
