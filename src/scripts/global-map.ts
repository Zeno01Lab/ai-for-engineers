import learningSteps from '../data/learning-path.json';
import {pathState} from '../lib/path-state.mjs';
import type {MapData,MapNode} from '../lib/global-map';
import {stages,parseProgress,zoomBox,frameNodes,focusIds,personalIds,recenterBox,clampPanel} from '../lib/map-state.mjs';
type Payload=MapData&{knowledgeIds:string[];problems:{id:string;label:string;methods:string[];events:string[]}[]};
import {readLearningProgress} from '../lib/storage/progress-store';
const progressKey='zeno-map-learning-v1',currentKey='zeno-map-current-v1';
document.querySelectorAll<HTMLElement>('[data-global-map]').forEach(root=>{
 const data:Payload=JSON.parse(root.querySelector('[data-map-payload]')!.textContent!);
 const svg=root.querySelector<SVGSVGElement>('[data-map-svg]')!;
 const sidebar=root.querySelector<HTMLElement>('[data-map-sidebar]')!;
 const details=root.querySelector<HTMLElement>('[data-map-details]')!;
 const search=root.querySelector<HTMLInputElement>('[data-map-search]')!;
 const select=root.querySelector<HTMLSelectElement>('[data-map-select]')!;
 const goal=root.querySelector<HTMLSelectElement>('[data-map-goal]')!;
 const problem=root.querySelector<HTMLSelectElement>('[data-map-problem]')!;
 const status=root.querySelector<HTMLElement>('[data-map-status]')!;
 const regionFilter=root.querySelector<HTMLSelectElement>('[data-map-regionfilter]')!;
 const edgeFilter=root.querySelector<HTMLSelectElement>('[data-map-edgefilter]')!;
 const mini=root.querySelector<SVGSVGElement>('[data-map-minimap]')!;
 const miniPanel=root.querySelector<HTMLElement>('[data-mini-panel]')!;
 const stage=root.querySelector<HTMLElement>('.global-map-stage')!;
 const miniDrag=root.querySelector<HTMLButtonElement>('[data-mini-drag]')!;
 const miniToggle=root.querySelector<HTMLButtonElement>('[data-mini-toggle]')!;
 const miniBody=root.querySelector<HTMLElement>('[data-mini-body]')!;
 const labelEls=[...root.querySelectorAll<SVGGElement>('[data-label-index]')];
 const viewport=mini.querySelector<SVGRectElement>('[data-mini-viewport]')!;
 const miniNodes=[...mini.querySelectorAll<SVGRectElement>('[data-mini-node]')];
 const knowledgeIds=new Set(data.knowledgeIds);
 let lit=new Set<string>();
 function loadPath(){try{lit=pathState(learningSteps,readLearningProgress().unitStatus).lit;}catch{storageWorks=false;}}
 let lens:'overview'|'focus'|'personal'='overview';

 const ids=new Set(data.nodes.map(n=>n.id));const byId=new Map(data.nodes.map(n=>[n.id,n]));
 const nodeEls=[...root.querySelectorAll<SVGGElement>('[data-map-node]')];const edgeEls=[...root.querySelectorAll<SVGGElement>('[data-edge-index]')];
 let selected='',current='',progress:Record<string,number>={},storageWorks=true;
 let box={x:0,y:0,width:data.width,height:data.height};
 try{progress=parseProgress(localStorage.getItem(progressKey),knowledgeIds) as Record<string,number>;const saved=localStorage.getItem(currentKey);if(saved&&knowledgeIds.has(saved))current=saved;}catch{storageWorks=false;}
 function persist(){try{localStorage.setItem(progressKey,JSON.stringify(progress));localStorage.setItem(currentKey,current);dispatchEvent(new Event('map-learning-change'));}catch{storageWorks=false;}}
 function camera(next:typeof box){box=next;svg.setAttribute('viewBox',`${box.x} ${box.y} ${box.width} ${box.height}`);root.querySelector('[data-map-scale]')!.textContent=`${Math.round(data.width/box.width*100)}%`;for(const key of ['x','y','width','height'] as const)viewport.setAttribute(key,String(box[key]));}
 function fit(){camera({x:0,y:0,width:data.width,height:data.height});}
 function focus(nodes:MapNode[]){if(nodes.length)camera(frameNodes(nodes,80));}
 function zoom(factor:number){camera(zoomBox(box,factor,{x:box.x+box.width/2,y:box.y+box.height/2}));}
 function element<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,cls?:string){const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;}
 function paragraph(text:string){details.append(element('p',text));}
 function links(title:string,nodes:MapNode[]){if(!nodes.length)return;details.append(element('h4',title));const list=element('div',undefined,'sidebar-node-links');nodes.forEach(n=>{const b=element('button',n.fullLabel||n.label);b.addEventListener('click',()=>choose(n.id));list.append(b);});details.append(list);}
 function navigate(label:string,url:string){const a=element('a',label,'sidebar-link');a.href=url;if(url.startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer';}details.append(a);}
 function fold(title:string,render:()=>void){const previous=new Set(details.childNodes);render();const group=element('details'),summary=element('summary',title);group.append(summary);[...details.childNodes].filter(node=>!previous.has(node)).forEach(node=>group.append(node));details.append(group);}
 function resource(r:NonNullable<MapNode['resources']>[number]){navigate(r.label+' ↗',r.directUrl);if(r.scope)paragraph('Selected reading · 选读：'+r.scope);navigate('Checkpoint · 选读任务与检查 →',r.url);}
 function drawDetails(){details.replaceChildren();const n=byId.get(selected);if(!n)return;
  details.append(element('h3',n.titleEn||n.label));if(n.titleZh)paragraph(n.titleZh);paragraph(n.description);
  if(data.mode==='structure'){
   if(n.resources?.length){resource(n.resources[0]);if(n.resources.length>1)fold('More resources · 更多资料',()=>n.resources!.slice(1).forEach(resource));}
   paragraph(lit.has(n.id)?'✧ Covered · 已由学习路径覆盖':'○ Not covered · 尚未由学习路径覆盖');
   fold('Explanation · 动机、原理与应用',()=>{for(const[title,text]of [['Why this method? · 动机',n.motivation],['Key idea · 核心思想',n.coreIdea],['Assumptions · 假设',n.assumptions],['Limitations · 局限',n.limitations],['Engineering examples · 工程例子',n.engineering],['Alternatives · 替代方法',n.alternatives]])if(text){details.append(element('h4',title!));paragraph(text);}if(n.url)navigate('Method guide · 方法图鉴 →',n.url);if(n.lesson)navigate('Practice · 站内实践 →',n.lesson);});
   fold('Connections · 概念联系与基础',()=>{links('Foundations · 相关基础',n.prerequisites.map(id=>byId.get(id)!).filter(Boolean));const related=data.edges.filter(e=>e.kind==='concept'&&(e.source===n.id||e.target===n.id));related.forEach(e=>{const button=element('button',e.statement||e.label,'sidebar-relation');button.addEventListener('click',()=>showRelation(data.edges.indexOf(e)));details.append(button);});});
   fold('Self-assessment · 能力自评与位置',()=>{const label=element('label','Learning stage · 学习阶段','stage-label'),state=element('select');stages.forEach((stage:string,i:number)=>{const option=element('option',stage);option.value=String(i);state.append(option);});state.value=String(progress[n.id]??0);label.append(state);details.append(label);state.addEventListener('change',()=>{progress[n.id]=Number(state.value);persist();paint();});const here=element('button',current===n.id?'Clear position · 取消当前位置':'My position · 设为当前位置','sidebar-position');here.addEventListener('click',()=>{current=current===n.id?'':n.id;persist();paint();here.textContent=current===n.id?'Clear position · 取消当前位置':'My position · 设为当前位置';});details.append(here);paragraph('能力自评与课程完成分开记录。点亮表示覆盖选读检查，不表示掌握整个方法。');});
   fold('Sources & history · 来源与历史',()=>{n.sourceReferences?.forEach(r=>navigate(r.title+' ↗',r.url));n.events.forEach(e=>navigate(e.label+' ↗',e.url));});
  }else{
   details.append(element('span',n.subtitle,'sidebar-eyebrow'));if(n.contribution)paragraph(n.contribution);if(n.url)navigate('Full record · 完整历史记录 →',n.url);
   fold('Context & dates · 背景、局限与年份',()=>{paragraph(n.limitations||'');paragraph(n.engineering||'');});
   fold('Connections · 相关工作与知识点',()=>{n.methods.forEach(m=>navigate(m.label+' ↗',m.url));const related=data.edges.filter(e=>e.source===n.id||e.target===n.id);if(!related.length)paragraph('尚无关系记录。');related.forEach(e=>{const button=element('button',e.statement||e.label,'sidebar-relation');button.addEventListener('click',()=>showRelation(data.edges.indexOf(e)));details.append(button);});});
   fold('Sources · 原始资料与课程',()=>{n.references?.forEach(r=>navigate(`${r.grade} · ${r.label} ↗`,r.url));n.resources?.forEach(resource);paragraph('关系是编辑性阐释，不等同于技术继承。');});
  }
 }
 function showRelation(index:number){const e=data.edges[index];if(!e)return;const a=byId.get(e.source)!,b=byId.get(e.target)!;choose(e.kind==='prerequisite'?e.target:e.source);details.replaceChildren();details.append(element('span',data.mode==='history'?'历史工作之间的联系':e.kind==='prerequisite'?'建议学习顺序':'概念之间的联系','sidebar-eyebrow'),element('h3','这条线是什么意思？'));paragraph(e.statement||`${a.label} 与 ${b.label}：${e.label}`);if(e.explanation)paragraph(e.explanation);links('连线两端的节点',[a,b]);const locate=element('button','在图上看这两个节点','sidebar-next');locate.addEventListener('click',()=>focus([a,b]));details.append(locate);if(data.mode==='history')paragraph('这条关系沿用数据包的编辑性阐释；不能只凭一条线判断技术继承。');else if(e.kind==='concept')paragraph('这是一条概念联系，不表示推荐学习顺序，也不表示技术诞生顺序。');labelEls.forEach(el=>el.classList.toggle('chosen-relation',Number(el.dataset.labelIndex)===index));const heading=details.querySelector('h3')!;heading.tabIndex=-1;heading.focus({preventScroll:true});if(matchMedia('(max-width:600px)').matches)sidebar.scrollIntoView({block:'nearest'});}
 labelEls.forEach(el=>{el.addEventListener('pointerdown',e=>e.stopPropagation());el.addEventListener('click',e=>{e.stopPropagation();showRelation(Number(el.dataset.labelIndex));});el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();showRelation(Number(el.dataset.labelIndex));}});});
 function matches(){const q=search.value.trim().toLowerCase();const p=data.problems.find(p=>p.id===problem.value);return new Set(data.nodes.filter(n=>(!q||`${n.fullLabel||''} ${n.label} ${n.subtitle} ${n.description}`.toLowerCase().includes(q))&&(!regionFilter.value||n.group===regionFilter.value)&&(!p||(data.mode==='structure'?p.methods.includes(n.id)||!!(n.method&&p.methods.includes(n.method)):p.events.includes(n.id)||n.methods.some(m=>p.methods.includes(m.id))))).map(n=>n.id));}
 function activeIds(){const covered={...progress};lit.forEach(id=>covered[id]=Math.max(covered[id]??0,1));if(lens==='personal')return personalIds(data.nodes,data.mode,covered,current) as Set<string>;if(lens==='focus'&&selected)return focusIds(data.edges,selected) as Set<string>;return new Set(data.nodes.map(n=>n.id));}
 function paint(){const filtered=matches();const active=activeIds();const emptyPersonal=lens==='personal'&&active.size===0;
  const relevant=focusIds(data.edges,selected) as Set<string>;
  nodeEls.forEach(el=>{const id=el.dataset.mapNode!;const stage=progress[id]??0;el.dataset.stage=String(stage);const digit=el.querySelector('[data-stage-digit]');if(digit)digit.textContent=stage?String(stage):'';el.classList.toggle('selected',id===selected);el.classList.toggle('current',data.mode==='structure'&&id===current);el.classList.toggle('course-lit',data.mode==='structure'&&lit.has(id));el.classList.toggle('dimmed',!filtered.has(id)||(!emptyPersonal&&!active.has(id)));el.classList.toggle('related-node',!!selected&&relevant.has(id));const node=byId.get(id)!;el.setAttribute('aria-label',`${node.year?node.year+' · ':''}${node.fullLabel||node.label}${data.mode==='structure'?(lit.has(id)?'，路径已覆盖':'')+'，'+stages[stage]+(id===current?'，我的当前位置':''):''}，打开详情`);});
  miniNodes.forEach(el=>{const id=el.dataset.miniNode!;el.classList.toggle('selected',id===selected);el.classList.toggle('marked',lens==='personal'&&active.has(id));el.classList.toggle('course-lit',data.mode==='structure'&&lit.has(id));});
  let edgeCount=0;edgeEls.forEach(el=>{const edge=data.edges[Number(el.dataset.edgeIndex)];const connected=edge.source===selected||edge.target===selected;const onPath=false;const allowed=!edgeFilter.value||edge.kind===edgeFilter.value;const inView=lens==='overview'||emptyPersonal||(active.has(edge.source)&&active.has(edge.target));const visible=allowed&&inView&&filtered.has(edge.source)&&filtered.has(edge.target)&&(edge.kind!=='prerequisite'||onPath);if(visible)edgeCount++;for(const group of [el,labelEls[Number(el.dataset.edgeIndex)]]){group.classList.toggle('filtered-edge',!visible);group.classList.toggle('active-edge',connected||onPath);group.classList.toggle('muted-edge',!!selected&&!connected&&!onPath);group.classList.toggle('show-prerequisite',edge.kind==='prerequisite'&&onPath);}});
  const count=data.nodes.filter(n=>filtered.has(n.id)&&(emptyPersonal||active.has(n.id))).length;
  status.textContent=emptyPersonal?'尚未标记学习位置：在知识图选择节点并记录阶段，再看与你有关的内容。':`${lens==='overview'?'全览':lens==='focus'?'聚焦':'与我有关'} · 高亮 ${count} / ${data.nodes.length} 个节点 · ${edgeCount} 条可见关系。全局导航始终保留。`;
  root.querySelectorAll<HTMLButtonElement>('[data-map-lens]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.mapLens===lens));if(b.dataset.mapLens==='focus')b.disabled=!selected&&!search.value&&!problem.value&&!regionFilter.value;});
  const focusButton=root.querySelector<HTMLButtonElement>('[data-map-action="focus"]')!;focusButton.disabled=!selected&&!search.value&&!problem.value&&!regionFilter.value;
  const currentButton=root.querySelector<HTMLButtonElement>('[data-map-action="current"]');if(currentButton)currentButton.disabled=!current;
  const summary=root.querySelector('[data-map-progress]');if(summary)summary.textContent=`Covered · ${lit.size}/${data.nodes.length} 已覆盖${current&&byId.has(current)?' · '+byId.get(current)!.label:''}${storageWorks?'':' · 本次记录无法持久保存'}`;
 }
 function setLens(next:typeof lens){lens=next;paint();if(next==='overview')fit();else{const active=activeIds(),filtered=matches();const nodes=data.nodes.filter(n=>active.has(n.id)&&filtered.has(n.id));if(nodes.length)focus(nodes);}}
 root.querySelectorAll<HTMLButtonElement>('[data-map-lens]').forEach(b=>b.addEventListener('click',()=>setLens(b.dataset.mapLens as typeof lens)));
 regionFilter.addEventListener('change',paint);edgeFilter.addEventListener('change',paint);
 mini.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();const matrix=mini.getScreenCTM();if(matrix){const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());camera(recenterBox(box,p,data.width,data.height));}});
 mini.addEventListener('keydown',e=>{if(e.key==='Home'){e.preventDefault();resetView();}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();camera({...box,x:box.x+(e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0)*box.width*.1,y:box.y+(e.key==='ArrowUp'?-1:e.key==='ArrowDown'?1:0)*box.height*.1});}});
 let panelMoved=false;
 function dockMini(){panelMoved=false;miniPanel.style.removeProperty('left');miniPanel.style.removeProperty('top');miniPanel.style.removeProperty('bottom');}
 function moveMini(x:number,y:number){const bounds=clampPanel({x,y},stage.getBoundingClientRect(),miniPanel.getBoundingClientRect());panelMoved=true;miniPanel.style.left=`${bounds.x}px`;miniPanel.style.top=`${bounds.y}px`;miniPanel.style.bottom='auto';}
 function panelOrigin(){const rect=miniPanel.getBoundingClientRect(),bounds=stage.getBoundingClientRect();return{x:rect.left-bounds.left,y:rect.top-bounds.top};}
 let panelPointer:{id:number;x:number;y:number;left:number;top:number}|null=null;
 miniDrag.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();const origin=panelOrigin();panelPointer={id:e.pointerId,x:e.clientX,y:e.clientY,left:origin.x,top:origin.y};miniDrag.setPointerCapture(e.pointerId);miniPanel.classList.add('dragging');});
 miniDrag.addEventListener('pointermove',e=>{if(panelPointer?.id===e.pointerId)moveMini(panelPointer.left+e.clientX-panelPointer.x,panelPointer.top+e.clientY-panelPointer.y);});
 function endPanel(e:PointerEvent){if(panelPointer?.id!==e.pointerId)return;panelPointer=null;miniPanel.classList.remove('dragging');if(miniDrag.hasPointerCapture(e.pointerId))miniDrag.releasePointerCapture(e.pointerId);}
 miniDrag.addEventListener('pointerup',endPanel);miniDrag.addEventListener('pointercancel',endPanel);
 miniDrag.addEventListener('keydown',e=>{if(e.key==='Home'){e.preventDefault();dockMini();}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const p=panelOrigin(),step=e.shiftKey?40:15;moveMini(p.x+(e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0),p.y+(e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0));}});
 function expandMini(expanded:boolean){miniBody.hidden=!expanded;miniToggle.setAttribute('aria-expanded',String(expanded));miniToggle.setAttribute('aria-label',expanded?'折叠导航小地图':'展开导航小地图');miniToggle.textContent=expanded?'−':'＋';if(panelMoved){const p=panelOrigin();moveMini(p.x,p.y);}}
 miniToggle.addEventListener('click',()=>expandMini(miniBody.hidden));
 const panelResize=new ResizeObserver(()=>{if(panelMoved&&stage.clientWidth&&stage.clientHeight){const p=panelOrigin();moveMini(p.x,p.y);}});panelResize.observe(stage);
 function resetView(){search.value='';problem.value='';goal.value='';regionFilter.value='';edgeFilter.value='';lens='overview';root.classList.remove('show-edge-labels');root.querySelector('[data-map-action="labels"]')!.setAttribute('aria-pressed','false');close();fit();[...select.options].forEach(o=>o.hidden=false);dockMini();expandMini(true);}
 mini.addEventListener('dblclick',e=>{e.preventDefault();resetView();});
 function choose(id:string,update=true){if(!ids.has(id))return;labelEls.forEach(el=>el.classList.remove('chosen-relation'));selected=id;select.value=id;sidebar.hidden=false;drawDetails();paint();if(update){const url=new URL(location.href);url.searchParams.set('view',data.mode);url.searchParams.set('node',id);url.hash=`view-${data.mode}`;history.replaceState({},'',url);}}
 function close(){labelEls.forEach(el=>el.classList.remove('chosen-relation'));const previous=selected;sidebar.hidden=true;selected='';select.value='';paint();const url=new URL(location.href);if(url.searchParams.get('view')===data.mode){url.searchParams.delete('node');history.replaceState({},'',url);}nodeEls.find(el=>el.dataset.mapNode===previous)?.focus({preventScroll:true});}
 root.querySelector('[data-map-close]')!.addEventListener('click',close);
 select.addEventListener('change',()=>{if(select.value){choose(select.value);focus([byId.get(select.value)!]);}else close();});
 search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();[...select.options].forEach(o=>{const n=byId.get(o.value);o.hidden=!!n&&!`${n.label} ${n.subtitle} ${n.description}`.toLowerCase().includes(q);});paint();});
 goal.addEventListener('change',()=>{if(data.mode==='structure'){if(goal.value)choose(goal.value);else{paint();drawDetails();}}else{const range=goal.value==='early'?[1943,1989]:goal.value==='middle'?[1990,2011]:goal.value==='recent'?[2012,2025]:null;if(range)focus(data.nodes.filter(n=>n.year!>=range[0]&&n.year!<=range[1]));else fit();}});
 problem.addEventListener('change',paint);
 root.querySelectorAll<HTMLButtonElement>('[data-map-action]').forEach(b=>b.addEventListener('click',async()=>{switch(b.dataset.mapAction){case'in':zoom(1.3);break;case'out':zoom(1/1.3);break;case'fit':resetView();break;case'labels':root.classList.toggle('show-edge-labels');b.setAttribute('aria-pressed',String(root.classList.contains('show-edge-labels')));break;case'focus':if(selected)focus([byId.get(selected)!]);else{const filtered=matches();focus(data.nodes.filter(n=>filtered.has(n.id)));}break;case'current':if(current){choose(current);focus([byId.get(current)!]);}break;case'fullscreen':try{if(document.fullscreenElement===root)await document.exitFullscreen();else if(root.requestFullscreen)await root.requestFullscreen();else throw new Error();}catch{root.classList.toggle('expanded-map');b.textContent=root.classList.contains('expanded-map')?'退出大图':'全屏查看';}break;case'clear-focus':resetView();break;}}));
 document.addEventListener('fullscreenchange',()=>{const b=root.querySelector('[data-map-action="fullscreen"]');if(b)b.textContent=document.fullscreenElement===root?'退出全屏':'全屏查看';});
 function point(x:number,y:number){const p=new DOMPoint(x,y);const matrix=svg.getScreenCTM();return matrix?p.matrixTransform(matrix.inverse()):p;}
 const pointers=new Map<number,{x:number;y:number;startX:number;startY:number;node:string}>();let moved=false;let pinchDistance=0;let lastTap:{node:string;time:number;x:number;y:number}|null=null;
 svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;const target=(e.target as Element).closest<SVGGElement>('[data-map-node]');pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,node:target?.dataset.mapNode||''});if(pointers.size===1)moved=false;else{moved=true;lastTap=null;}svg.setPointerCapture(e.pointerId);if(pointers.size===2){const [a,b]=[...pointers.values()];pinchDistance=Math.hypot(a.x-b.x,a.y-b.y);}e.preventDefault();});
 svg.addEventListener('pointermove',e=>{const old=pointers.get(e.pointerId);if(!old)return;const previous=point(old.x,old.y),next=point(e.clientX,e.clientY);if(Math.hypot(e.clientX-old.startX,e.clientY-old.startY)>4)moved=true;pointers.set(e.pointerId,{...old,x:e.clientX,y:e.clientY});if(pointers.size===2){const[a,b]=[...pointers.values()];const distance=Math.hypot(a.x-b.x,a.y-b.y);const middle=point((a.x+b.x)/2,(a.y+b.y)/2);if(pinchDistance>0&&distance>0)camera(zoomBox(box,distance/pinchDistance,middle));pinchDistance=distance;}else if(moved)camera({...box,x:box.x-(next.x-previous.x),y:box.y-(next.y-previous.y)});});
 function endPointer(e:PointerEvent,cancel=false){const p=pointers.get(e.pointerId);pointers.delete(e.pointerId);if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);if(p&&pointers.size===0&&!moved&&!cancel&&p.node){choose(p.node);const now=performance.now();if(lastTap?.node===p.node&&now-lastTap.time<350&&Math.hypot(e.clientX-lastTap.x,e.clientY-lastTap.y)<20){focus([byId.get(p.node)!]);lastTap=null;}else lastTap={node:p.node,time:now,x:e.clientX,y:e.clientY};}if(pointers.size<2)pinchDistance=0;}
 svg.addEventListener('pointerup',e=>endPointer(e));svg.addEventListener('pointercancel',e=>endPointer(e,true));
 svg.addEventListener('dblclick',e=>{const n=(e.target as Element).closest<SVGGElement>('[data-map-node]');if(n){e.preventDefault();choose(n.dataset.mapNode!);focus([byId.get(n.dataset.mapNode!)!]);}});
 svg.addEventListener('click',e=>{if(e.detail===0){const g=(e.target as Element).closest<SVGGElement>('[data-map-node]');if(g)choose(g.dataset.mapNode!);}});
 svg.addEventListener('wheel',e=>{if(!e.ctrlKey&&!e.metaKey)return;e.preventDefault();camera(zoomBox(box,Math.exp(-e.deltaY*.006),point(e.clientX,e.clientY)));},{passive:false});
 svg.addEventListener('keydown',e=>{const n=(e.target as Element).closest<SVGGElement>('[data-map-node]');if(n&&(e.key==='Enter'||e.key===' ')){e.preventDefault();choose(n.dataset.mapNode!);return;}if(e.key==='Escape'){close();root.classList.remove('expanded-map');if(!document.fullscreenElement)root.querySelector('[data-map-action="fullscreen"]')!.textContent='全屏查看';}else if(['+','=','-','Home','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();if(e.key==='Home')resetView();else if(e.key==='+'||e.key==='=')zoom(1.3);else if(e.key==='-')zoom(1/1.3);else camera({...box,x:box.x+(e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0)*box.width*.08,y:box.y+(e.key==='ArrowUp'?-1:e.key==='ArrowDown'?1:0)*box.height*.08});}});
 function restore(){const url=new URL(location.href);if((url.searchParams.get('view')||'structure')===data.mode){const id=url.searchParams.get('node');if(id&&ids.has(id))choose(id,false);}}
 addEventListener('popstate',restore);addEventListener('global-map-view',restore);
 function refreshLearning(){loadPath();try{progress=parseProgress(localStorage.getItem(progressKey),knowledgeIds) as Record<string,number>;const saved=localStorage.getItem(currentKey)||'';current=knowledgeIds.has(saved)?saved:'';paint();if(selected)drawDetails();}catch{}}
 addEventListener('pageshow',refreshLearning);addEventListener('learning-path-change',refreshLearning);addEventListener('storage',refreshLearning);addEventListener('map-learning-change',()=>{if(data.mode==='history')refreshLearning();});
 loadPath();camera(box);paint();restore();
});
