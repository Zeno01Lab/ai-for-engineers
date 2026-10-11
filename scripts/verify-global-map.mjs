import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {knowledgeGroups,foundations} from '../src/data/knowledge-map.ts';
import {layoutHistory,yearX} from '../src/lib/history-layout.mjs';
import {prerequisiteClosure,learningPlan,parseProgress,zoomBox,frameNodes,focusIds,personalIds,recenterBox,clampPanel} from '../src/lib/map-state.mjs';
import {engineeringAdvice} from '../src/lib/engineering-selector.mjs';
import {engineeringQuestions} from '../src/data/engineering.ts';
import {engineeringProfiles} from '../src/data/engineering-profiles.ts';
import {groupResources} from '../src/data/map-resources.ts';
const seeds=[...knowledgeGroups.flatMap(g=>g.nodes),...foundations];
const ids=new Set(seeds.map(n=>n.id));assert.equal(ids.size,seeds.length);
const methods=new Set((await readdir('src/content/algorithms')).map(f=>f.replace(/\.mdx?$/,'')));
const records=JSON.parse(await readFile('src/data/history/raw/nodes.json','utf8'));const eventIds=new Set(records.map(n=>n.id));
const visiting=new Set(),visited=new Set();function visit(id){assert(!visiting.has(id),`Cyclic prerequisites: ${id}`);if(visited.has(id))return;visiting.add(id);const n=seeds.find(n=>n.id===id);assert(n);for(const p of n.prerequisites){assert(ids.has(p));visit(p);}visiting.delete(id);visited.add(id);}
for(const n of seeds){visit(n.id);assert(n.description&&n.label);if(n.method)assert(methods.has(n.method));if(n.lesson)await readFile(`src/content/articles/${n.lesson}.md`);for(const id of n.events??[])assert(eventIds.has(id));}
for(const id of methods)assert(seeds.some(n=>n.method===id),`Method absent from full map: ${id}`);
const parents=prerequisiteClosure(seeds,'agents');assert(parents.has('language-models')&&parents.has('linear-algebra')&&parents.has('data-evaluation'));
const plan=learningPlan(seeds,'agents',{});assert(plan.indexOf('linear-algebra')<plan.indexOf('neural-networks'));assert(plan.indexOf('language-models')<plan.indexOf('tool-use'));
assert(!learningPlan(seeds,'agents',{'linear-algebra':2}).includes('linear-algebra'));
assert(learningPlan(seeds,'agents',{'linear-algebra':1}).includes('linear-algebra'),'Concept awareness should not imply explanatory mastery');
assert.deepEqual(parseProgress('{"agents":3,"bogus":3,"regression":8,"classification":"2"}',ids),{agents:3});
assert.deepEqual(parseProgress('bad',ids),{});assert.deepEqual(parseProgress('[]',ids),{});assert.deepEqual(parseProgress(null,ids),{});
assert.deepEqual(parseProgress('{"agents":3}',new Set(['react'])),{},'History records must not receive unrelated learning marks');
const box={x:0,y:0,width:1000,height:600};const anchor={x:200,y:100};const next=zoomBox(box,2,anchor);assert.equal(next.width,500);assert.equal(next.height,300);assert.equal((anchor.x-next.x)/next.width,(anchor.x-box.x)/box.width);
const back=zoomBox(next,.5,anchor);assert.deepEqual(back,box);assert.equal(zoomBox(box,1e5,anchor).width,140);assert.equal(zoomBox(box,1e-5,anchor).width,10000);
const frame=frameNodes([{x:0,y:20,width:100,height:50},{x:200,y:100,width:100,height:80}],10);assert.deepEqual(frame,{x:-10,y:10,width:320,height:180});
assert.deepEqual([...focusIds([{source:'a',target:'b'},{source:'b',target:'c'},{source:'x',target:'y'}],'b')].sort(),['a','b','c']);
assert.equal(personalIds(seeds,'structure',{},'').size,0,'No progress must mean no inferred personal relevance');
assert.deepEqual([...personalIds(seeds,'structure',{agents:1},'regression')].sort(),['agents','regression']);
const linkedHistory=[{id:'react',methods:[{id:'agents'}]},{id:'cnn',methods:[{id:'cnn'}]}];
assert.deepEqual([...personalIds(linkedHistory,'history',{agents:1},'')],['react']);
assert.deepEqual(recenterBox({x:30,y:20,width:200,height:100},{x:9999,y:-10},1000,600),{x:900,y:-50,width:200,height:100});
assert.deepEqual(clampPanel({x:-100,y:900},{width:500,height:400},{width:180,height:130}),{x:8,y:262});
assert.deepEqual(clampPanel({x:300,y:200},{width:100,height:70},{width:180,height:130}),{x:8,y:8},'Tiny or hidden stages must never produce negative panel positions');
const resourceIds=new Set((await readdir('src/content/resources')).map(f=>f.replace(/\.mdx?$/,'')));
for(const group of groupResources ? Object.values(groupResources) : [])for(const id of group)assert(resourceIds.has(id),`Unknown course resource: ${id}`);
for(const q of engineeringQuestions){assert(engineeringProfiles[q.id]?.baseline&&engineeringProfiles[q.id]?.check);for(const id of q.methods)assert(methods.has(id));}
assert.equal(engineeringAdvice(engineeringQuestions,engineeringProfiles,{task:'unknown'}),null);
const advise=choices=>engineeringAdvice(engineeringQuestions,engineeringProfiles,choices);
assert(advise({task:'predict',data:'unlabeled'}).notes.some(n=>n.includes('没有目标标签')));
assert.deepEqual(advise({task:'structured',structure:'graph'}).methods,['graph-neural-networks','data-evaluation']);
assert.deepEqual(advise({task:'structured',structure:'table'}).methods,['regression','classification','data-evaluation']);
const optimization=advise({task:'expensive',cost:'cheap',gradient:'available',constraints:'hard',risk:'high'});
assert(optimization.notes.some(n=>n.includes('随机搜索'))&&optimization.notes.some(n=>n.includes('梯度法基线'))&&optimization.notes.some(n=>n.includes('硬约束'))&&optimization.notes.some(n=>n.includes('受控环境')));
assert(advise({task:'generate',amount:'small',data:'unknown'}).notes.length>=2);
const layout=layoutHistory(records);assert.equal(layout.nodes.length,records.length);assert.equal(new Set(layout.nodes.map(n=>n.id)).size,records.length);
for(const n of layout.nodes){assert(n.x>=0&&n.y>=0&&n.x+n.width<=layout.width&&n.y+n.height<=layout.height);const original=records.find(r=>r.id===n.id);assert.equal(n.year,original.year);assert.equal(n.x,yearX(n.year));}
for(let i=0;i<layout.nodes.length;i++)for(let j=i+1;j<layout.nodes.length;j++){const a=layout.nodes[i],b=layout.nodes[j];assert(!(a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y),`History cards overlap: ${a.id} / ${b.id}`);}
assert(yearX(2025)>yearX(2020)&&yearX(2020)>yearX(2000));
console.log(`PASS: ${seeds.length} knowledge nodes, ${knowledgeGroups.length} regions, all ${methods.size} method bindings, acyclic learning paths, self-report states, ordered next steps, zoom math and ${layout.nodes.length} non-overlapping historical cards across ${layout.lanes.length} lanes.`);
