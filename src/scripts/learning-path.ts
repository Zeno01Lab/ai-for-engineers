import {pathState} from '../lib/path-state.mjs';
import {setUnitStatus} from '../lib/storage/progress.mjs';
import {readLearningProgress,saveLearningProgress,progressStorageStatus,type LearningProfile} from '../lib/storage/progress-store';
import steps from '../data/learning-path.json';
import paths from '../data/learning/paths.json';
const root=document.querySelector<HTMLElement>('[data-learning-path]');
if(root){
 let profile:LearningProfile=readLearningProgress();const message=root.querySelector<HTMLElement>('[data-path-message]')!,cards=[...root.querySelectorAll<HTMLDetailsElement>('[data-level]')],byId=new Map(steps.map(s=>[s.id,s])),visibleIds=new Set(cards.map(c=>c.dataset.level!));
 const scope=JSON.parse(root.querySelector('[data-path-data]')!.textContent!) as typeof steps,path=paths.find(p=>p.id===root.dataset.currentLearningPath),optional=new Set(path?.optionalUnitIds||[]),required=[...visibleIds].filter(id=>!optional.has(id));
 function paint(){const records=profile.unitStatus,state=pathState(steps,records);let completed=0,prior=0;
  cards.forEach(card=>{const id=card.dataset.level!,s=byId.get(id)!,active=state.active.has(id),ready=state.ready.has(id),pending=state.pending.has(id),started=records[id]==='in_progress',check=card.querySelector<HTMLInputElement>('[data-level-check]')!;
   if(active){if(records[id]==='already_known')prior++;else completed++;}
   card.dataset.state=active?'done':pending?'pending':started?'in-progress':ready?'ready':'locked';
   card.querySelector('[data-level-status]')!.textContent=active?(records[id]==='already_known'?'✓ Known · 已有基础':'✓ Done · 已完成'):pending?'◌ Recheck · 待复核':started?'◐ In progress · 进行中':ready?'◉ Ready · 可开始':'○ Prerequisites · 待前置';
   const missing=s.prerequisites.filter(p=>!state.active.has(p));card.querySelector('[data-level-unlock]')!.textContent=active?'✓ 已覆盖':ready?'Ready · 可以开始':`Prerequisites · 先覆盖：${missing.map(p=>byId.get(p)!.titleEn).join(' ＋ ')}。`;
   const done=card.querySelector<HTMLButtonElement>('[data-level-done]')!,skip=card.querySelector<HTMLButtonElement>('[data-level-prior]')!,undo=card.querySelector<HTMLButtonElement>('[data-level-undo]')!,start=card.querySelector<HTMLButtonElement>('[data-level-start]')!;
   done.disabled=!ready||!check.checked;skip.disabled=active||!check.checked;done.hidden=active;skip.hidden=active;undo.hidden=!records[id]||records[id]==='not_started';start.hidden=active||started;start.disabled=!ready;check.disabled=active;if(active)check.checked=true;
  });
  const count=required.filter(id=>state.active.has(id)).length;root!.querySelector('[data-path-count]')!.textContent=`${count}/${required.length} required covered · 必修已覆盖`;root!.querySelector<HTMLProgressElement>('[data-path-meter]')!.max=required.length;root!.querySelector<HTMLProgressElement>('[data-path-meter]')!.value=count;
  root!.querySelector('[data-path-summary]')!.textContent=`${state.lit.size}/39 concepts covered · 已覆盖知识点${state.pending.size?' · '+state.pending.size+' 个单元待复核':''}`;
  const next=scope.find(s=>!optional.has(s.id)&&state.ready.has(s.id)),link=root!.querySelector<HTMLAnchorElement>('[data-path-next]')!;link.href=next?`#level-${next.id}`:'#path-overview';link.textContent=next?`Next unit · 下一步：${next.title} · 约 ${next.minutes} 分钟 →`:'Core path completed · 核心路径已覆盖，可继续选修 →';
  const status=progressStorageStatus();root!.querySelector('[data-path-storage]')!.textContent=status.warning||'Local only · 记录保存在此浏览器。';
 }
 function update(id:string,status:string,checked:boolean){const next=setUnitStatus(profile,id,status,steps,pathState(steps,profile.unitStatus),checked);if(next===profile)return;profile=next;saveLearningProgress(profile);paint();message.textContent=status==='not_started'?'Undone · 已撤销；下游完成记录保留，前置补回后恢复。':`Saved · 已记录「${byId.get(id)!.title}」。开始阅读不会自动点亮知识。`;}
 cards.forEach(card=>{const id=card.dataset.level!,check=card.querySelector<HTMLInputElement>('[data-level-check]')!;check.addEventListener('change',paint);card.querySelector('[data-level-start]')!.addEventListener('click',()=>update(id,'in_progress',false));card.querySelector('[data-level-done]')!.addEventListener('click',()=>update(id,'completed',check.checked));card.querySelector('[data-level-prior]')!.addEventListener('click',()=>update(id,'already_known',check.checked));card.querySelector('[data-level-undo]')!.addEventListener('click',()=>{check.checked=false;update(id,'not_started',false);});});
 function reveal(){if(!location.hash)return;let id:string;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const target=document.getElementById(id);if(!target)return;let ancestor:HTMLElement|null=target;while(ancestor){if(ancestor instanceof HTMLDetailsElement)ancestor.open=true;ancestor=ancestor.parentElement;}requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}
 function refresh(){profile=readLearningProgress();paint();}addEventListener('learning-path-change',refresh);addEventListener('pageshow',refresh);addEventListener('storage',refresh);addEventListener('hashchange',reveal);paint();reveal();
}
