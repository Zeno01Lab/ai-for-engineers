import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {knowledgeGroups,foundations} from '../src/data/knowledge-map.ts';
import {parsePath,pathState,changePath,pathKey} from '../src/lib/path-state.mjs';
import {layoutPath,relatedPath} from '../src/lib/path-layout.mjs';
import {routePathEdges} from '../src/lib/path-routing.mjs';
import {knowledgeTerms} from '../src/data/knowledge-terms.ts';
const steps=JSON.parse(await readFile('src/data/learning-path.json','utf8'));
const ids=new Set(steps.map(s=>s.id)),knowledgeIds=new Set([...knowledgeGroups.flatMap(g=>g.nodes),...foundations].map(n=>n.id));
assert.equal(ids.size,steps.length);const covered=new Set(),visiting=new Set(),visited=new Set();
function visit(id){assert(ids.has(id));assert(!visiting.has(id),`Cyclic path: ${id}`);if(visited.has(id))return;visiting.add(id);const s=steps.find(s=>s.id===id);s.prerequisites.forEach(visit);visiting.delete(id);visited.add(id);}
for(const s of steps){visit(s.id);assert(s.check&&s.materials.length&&s.minutes>0);for(const id of s.knowledge){assert(knowledgeIds.has(id),`Unknown concept: ${id}`);covered.add(id);}for(const m of s.materials){assert.equal(new URL(m.url).protocol,'https:');assert(m.label&&m.scope&&m.language&&m.kind);}}
for(const s of steps){assert(s.titleEn&&s.titleZh&&s.title===`${s.titleEn} · ${s.titleZh}`,`English-first bilingual title missing: ${s.id}`);assert(/^[A-Za-z]/.test(s.titleEn));}
for(const id of knowledgeIds){assert(knowledgeTerms[id]?.en&&knowledgeTerms[id]?.short&&knowledgeTerms[id]?.zh,`Bilingual concept missing: ${id}`);}
assert.equal(covered.size,knowledgeIds.size,'Every concept needs a mapped external resource and checkpoint');
assert.notEqual(pathKey,'zeno-map-learning-v1');assert.notEqual(pathKey,'afe-learning-v1');
assert.deepEqual(parsePath('bad',steps),{});assert.deepEqual(parsePath('[]',steps),{});assert.deepEqual(parsePath(null,steps),{});assert.deepEqual(parsePath('{"first-step":"done","bogus":"done","agent-route":3}',steps),{'first-step':'done'});
let records={},state=pathState(steps,records);assert.equal(state.lit.size,0);assert.deepEqual([...state.ready],['first-step']);
assert.equal(changePath(steps,records,'first-step','done',false),records,'No completion without explicit checkpoint');
assert.equal(changePath(steps,records,'agent-route','done',true),records,'Locked course cannot be completed');
records=changePath(steps,records,'first-step','done',true);state=pathState(steps,records);assert.deepEqual([...state.lit],['supervised']);assert(state.ready.has('first-prediction')&&state.ready.has('search-route')&&state.ready.has('logic-route'));
records=changePath(steps,records,'first-step','undo');assert.equal(pathState(steps,records).lit.size,0);
const skipped=changePath(steps,{},'neural-camp','prior',true);assert(pathState(steps,skipped).active.has('neural-camp'),'Explicit existing knowledge may bypass prerequisites');assert(!pathState(steps,skipped).lit.has('linear-algebra'),'Bypass must not infer ancestor knowledge');
for(const s of steps)records=changePath(steps,records,s.id,'done',true);state=pathState(steps,records);assert.equal(state.active.size,steps.length);assert.equal(state.lit.size,knowledgeIds.size);
const undone=changePath(steps,records,'first-step','undo');state=pathState(steps,undone);assert.equal(state.lit.size,0);assert(state.pending.has('agent-route'));assert.equal(undone['agent-route'],'done','Undo must preserve downstream recorded work');
records=changePath(steps,undone,'first-step','done',true);assert.equal(pathState(steps,records).lit.size,knowledgeIds.size,'Restoring prerequisite restores valid downstream progress');
const neuralOnly=pathState(steps,skipped);for(const id of ['cnn-route','lstm-route','transformer-route','graph-route'])assert(neuralOnly.ready.has(id),`${id} must be a parallel choice`);
const malformed=pathState(steps,{'agent-route':'done','unknown':'done'});assert.equal(malformed.lit.size,0,'Orphan imported completions cannot light concepts');
const layout=layoutPath(steps),nodes=new Map(layout.nodes.map(n=>[n.id,n]));
for(const a of layout.nodes){assert(a.x>=0&&a.y>=0&&a.x+a.width<=layout.width&&a.y+a.height<=layout.height);for(const b of layout.nodes)if(a.id!==b.id)assert(!(a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y),`Cards overlap: ${a.id}/${b.id}`);}
const parallel=['cnn-route','lstm-route','transformer-route','graph-route'].map(id=>nodes.get(id));assert(parallel.every(n=>n.x===parallel[0].x),'Parallel architecture choices must align');assert.equal(new Set(parallel.map(n=>n.y)).size,4);
for(const e of layout.edges)assert(nodes.get(e.source).rank<nodes.get(e.target).rank,'A prerequisite must precede its dependent');
const routed=routePathEdges(layout);assert.equal(routed.length,layout.edges.length);
for(const edge of routed){assert(edge.points.length>=2);for(let i=1;i<edge.points.length;i++){const a=edge.points[i-1],b=edge.points[i];assert(a.x===b.x||a.y===b.y,'Routes must use clear orthogonal corridors');for(const n of layout.nodes){if(n.id===edge.source||n.id===edge.target)continue;const crosses=a.x===b.x?a.x>n.x&&a.x<n.x+n.width&&Math.min(a.y,b.y)<n.y+n.height&&Math.max(a.y,b.y)>n.y:a.y>n.y&&a.y<n.y+n.height&&Math.min(a.x,b.x)<n.x+n.width&&Math.max(a.x,b.x)>n.x;assert(!crosses,`Route ${edge.source}->${edge.target} crosses unrelated card ${n.id}`);}}}
const agentChain=relatedPath(steps,'agent-route');assert(agentChain.ancestors.has('tools-route')&&agentChain.ancestors.has('transformer-route'));assert(!agentChain.ancestors.has('cnn-route'),'Parallel architecture is not an Agent prerequisite');
console.log(`PASS: ${layout.nodes.length} bilingual 2D nodes, ${layout.lanes.length} tracks, ${routed.length} obstacle-avoiding prerequisites and parallel architecture alignment.`);
console.log(`PASS: ${steps.length} external-resource checkpoints, ${covered.size} concept bindings, acyclic prerequisites, parallel branches, explicit completion, prior knowledge, undo and malformed storage.`);
