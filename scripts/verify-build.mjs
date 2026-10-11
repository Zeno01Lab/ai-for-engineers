import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { getDeployment } from './deployment.mjs';
import { knowledgeGroups, foundations } from '../src/data/knowledge-map.ts';
import {layoutEdgeLabels,overlaps} from '../src/lib/map-label-layout.mjs';

const directory = path.resolve('dist');
const { base } = getDeployment(process.env);
const prefix = base === '/' ? '' : base;
const files = [];
async function walk(dir) { for (const entry of await readdir(dir, { withFileTypes:true })) { const file=path.join(dir,entry.name); if(entry.isDirectory()) await walk(file); else files.push(file); } }
await walk(directory);
let checked = 0;
for(const file of files.filter(f=>f.endsWith('.html'))) {
  const html=await readFile(file,'utf8');
  assert(html.includes('lang="zh-CN"'),`Missing document language: ${file}`);
  assert(html.includes('name="description"'),`Missing description: ${file}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`Duplicate IDs: ${file}`);
  for(const match of html.matchAll(/\b(?:href|src|data-module|data-url)="([^"]+)"/g)) {
    const value=match[1].replace(/&amp;/g,'&');
    if(/^(https?:|mailto:|data:|tel:)/.test(value)) continue;
    const url = new URL(value,`https://local.test${prefix}/${path.relative(directory,file).replaceAll(path.sep,'/')}`);
    if(url.pathname.startsWith('/@')) continue;
    assert(!prefix || url.pathname===prefix || url.pathname.startsWith(`${prefix}/`),`Missing base: ${value} in ${file}`);
    const relative=decodeURIComponent(url.pathname.slice(prefix.length)).replace(/^\//,'');
    const target=path.join(directory,relative);
    let targetFile=target;
    try { if((await stat(target)).isDirectory()) targetFile=path.join(target,'index.html'); await stat(targetFile); } catch { throw new Error(`Broken internal link: ${value} in ${file}`); }
    if(url.hash && targetFile.endsWith('.html')) { const targetHtml=await readFile(targetFile,'utf8'); const id=decodeURIComponent(url.hash.slice(1)); assert(targetHtml.includes(`id="${id}"`),`Missing fragment: ${value} in ${file}`); }
    checked++;
  }
}
const drafts=[];
for(const file of await readdir('src/content/articles')) {
  const text=await readFile(`src/content/articles/${file}`,'utf8');
  if(/^draft:\s*true\s*$/m.test(text)) drafts.push(file.replace(/\.(md|mdx)$/,''));
}
const indexText=await readFile('dist/search-index.json','utf8');
const sitemap=await readFile('dist/sitemap.xml','utf8');
for(const id of drafts) {
  assert(!files.some(f=>f.endsWith(`/notes/${id}/index.html`)),`Draft route leaked: ${id}`);
  assert(!indexText.includes(`/notes/${id}/`),`Draft search leak: ${id}`);
  assert(!sitemap.includes(`/notes/${id}/`),`Draft sitemap leak: ${id}`);
}
const entries=JSON.parse(indexText);
assert(entries.length>=68,'Search index lacks expected content');
const mapHtml=await readFile('dist/map/index.html','utf8');
assert(!mapHtml.includes('NaN'),'Invalid SVG geometry');
const payloads=[...mapHtml.matchAll(/<script[^>]*data-map-payload[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
assert.equal(payloads.length,2,'Both full maps must render');
const knowledgeSeeds=[...knowledgeGroups.flatMap(g=>g.nodes),...foundations];
for(const data of payloads){
  const ids=new Set(data.nodes.map(n=>n.id));assert.equal(ids.size,data.nodes.length);
  for(const node of data.nodes){
    assert(mapHtml.includes(`data-map-node="${node.id}"`),`Node not rendered in full SVG: ${node.id}`);
    assert(node.x>=0&&node.y>=0&&node.x+node.width<=data.width&&node.y+node.height<=data.height,`Node outside overview: ${node.id}`);
    assert(mapHtml.includes(`data-mini-node="${node.id}"`),`Node missing from minimap: ${node.id}`);
    for(const url of [node.url,node.lesson,...node.events.map(e=>e.url),...node.methods.map(m=>m.url),...(node.resources||[]).map(r=>r.url)].filter(Boolean)){
      assert(!prefix||url.startsWith(`${prefix}/`),`Embedded map link loses base: ${url}`);
      const resolved=new URL(url,'https://local.test');
      const pathname=resolved.pathname.slice(prefix.length).replace(/^\//,'');
      const target=path.join(directory,pathname,'index.html');assert(files.includes(target),`Broken map side-panel link: ${url}`);
      if(resolved.hash)assert((await readFile(target,'utf8')).includes(`id="${resolved.hash.slice(1)}"`),`Broken resource anchor: ${url}`);
    }
  }
  for(const edge of data.edges){assert(ids.has(edge.source)&&ids.has(edge.target),'Full map edge has a missing endpoint');assert(edge.statement&&edge.explanation,'Relation needs a complete statement and explanation');}
  const captions=layoutEdgeLabels(data);
  assert.equal(captions.length,data.edges.length);
  for(let i=0;i<captions.length;i++){const c=captions[i];assert(c.x>=0&&c.y>=0&&c.x+c.width<=data.width&&c.y+c.height<=data.height);assert(!data.nodes.some(n=>overlaps(c,n)),`Caption covers a card: ${data.edges[i].source}`);for(let j=0;j<i;j++)assert(!overlaps(c,captions[j]),`Captions overlap: ${i} / ${j}`);}
  for(let i=0;i<data.nodes.length;i++)for(let j=i+1;j<data.nodes.length;j++){const a=data.nodes[i],b=data.nodes[j];assert(!(a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y),`Overview nodes overlap: ${a.id} / ${b.id}`);}
}
const knowledgePayload=payloads.find(d=>d.mode==='structure');
assert(knowledgePayload.edges.every(e=>e.kind==='concept'),'Learning prerequisites must stay out of the knowledge map');
for(const n of knowledgePayload.nodes){assert(n.resources?.length,`Missing external course: ${n.id}`);for(const r of n.resources){assert(new URL(r.directUrl).protocol==='https:');assert(r.scope&&r.url.includes('/learn/#level-'));}}
const learnHtml=await readFile('dist/learn/index.html','utf8');
const learningSteps=JSON.parse(await readFile('src/data/learning-path.json','utf8'));
const curatedPaths=JSON.parse(await readFile('src/data/learning/paths.json','utf8'));
const canonicalConcepts=JSON.parse(await readFile('src/data/knowledge/concepts.generated.json','utf8'));
assert(learnHtml.includes('data-learning-path')&&learnHtml.includes('data-path-next'),'Learning journey missing');
for(const s of learningSteps){assert(learnHtml.includes(`id="level-${s.id}"`));assert(learnHtml.includes(`data-route-point="${s.id}"`));assert(entries.some(e=>e.kind==='学习关卡'&&e.url.endsWith(`/learn/#level-${s.id}`)));}
assert(learnHtml.includes('data-path-graph')&&learnHtml.includes('id="path-overview"'),'The 2D curriculum must be the primary visible overview');
assert(!learnHtml.includes('class="mountain"')&&!learnHtml.includes('营地'),'Remove the mountain metaphor');
const pathPayload=JSON.parse(learnHtml.match(/<script[^>]*data-path-layout[^>]*>([\s\S]*?)<\/script>/)[1]);assert.equal(pathPayload.nodes.length,learningSteps.length);assert.equal([...learnHtml.matchAll(/data-path-edge-source=/g)].length,pathPayload.edges.length);
for(const n of pathPayload.nodes){assert(learnHtml.includes(`data-path-mini-node="${n.id}"`));assert(n.titleEn&&n.titleZh);assert(entries.some(e=>e.title.includes(n.titleEn)&&e.title.includes(n.titleZh)));}
for(const n of knowledgePayload.nodes)assert(n.titleEn&&n.titleZh&&n.fullLabel.startsWith(n.titleEn),'Knowledge map needs English-first bilingual concept names');
for(const action of ['in','out','fit','start','focus','full'])assert(learnHtml.includes(`data-path-camera="${action}"`));
for(const path of curatedPaths){const html=await readFile(`dist/learn/${path.id}/index.html`,'utf8');assert(entries.some(e=>e.kind==='学习路径'&&e.url.endsWith(`/learn/${path.id}/`)));if(process.env.SITE_URL||process.env.GITHUB_REPOSITORY)assert(sitemap.includes(`/learn/${path.id}/`));const data=JSON.parse(html.match(/<script[^>]*data-path-layout[^>]*>([\s\S]*?)<\/script>/)[1]);assert.equal(data.nodes.length,path.unitIds.length);for(const id of path.unitIds)assert(html.includes(`id="level-${id}"`));for(const attr of ['data-progress-export','data-progress-import','data-progress-reset','data-level-start','data-level-prior'])assert(html.includes(attr));assert(data.nodes.filter(n=>n.optional).every(n=>path.optionalUnitIds.includes(n.id)));}
for(const node of knowledgePayload.nodes){const source=canonicalConcepts.find(c=>c.id===node.id);assert.equal(node.description,source.description,'Map must use the canonical description');assert.equal(node.titleEn,source.english);assert(learnHtml.includes(source.description.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')),'Learning cards must project the same description');}
for(const method of Object.values(JSON.parse(mapHtml.match(/<script[^>]*data-navigator-data[^>]*>([\s\S]*?)<\/script>/)[1]).methods))for(const unit of method.learningUnits){const parsed=new URL(unit.url,'https://local.test');assert(!prefix||parsed.pathname.startsWith(prefix+'/'));assert((await readFile('dist/learn/index.html','utf8')).includes(`id="${parsed.hash.slice(1)}"`));}
assert.equal(knowledgePayload.nodes.length,knowledgeSeeds.length);
for(const n of knowledgeSeeds)assert(entries.some(e=>e.kind==='地图概念'&&e.url.includes(`node=${n.id}#`)),`Knowledge node absent from search: ${n.id}`);
const historyPayload=payloads.find(d=>d.mode==='history');assert.equal(historyPayload.nodes.length,34);assert.equal(historyPayload.edges.length,24);
assert(mapHtml.includes('data-map-action="current"')&&mapHtml.includes('data-stage-digit'),'Learning position UI missing');
assert.equal([...mapHtml.matchAll(/data-map-minimap\b/g)].length,2,'Both full maps need a minimap');
assert.equal([...mapHtml.matchAll(/data-mini-drag\b/g)].length,2,'Both minimaps need an accessible move handle');
assert.equal([...mapHtml.matchAll(/data-mini-toggle\b/g)].length,2,'Both minimaps need a collapse control');
assert.equal([...mapHtml.matchAll(/class="global-edge-labels"/g)].length,2,'Captions need an independent upper layer');
assert.equal([...mapHtml.matchAll(/class="map-relation-guide"/g)].length,2,'Both maps need reading guidance');
for(const caption of mapHtml.matchAll(/<g[^>]*data-label-index=[^>]*>/g))assert(caption[0].includes('role="button"')&&caption[0].includes('tabindex="0"')&&caption[0].includes('aria-label='),'Caption explanations must be keyboard accessible');
for(const canvas of [...mapHtml.matchAll(/<svg[^>]*data-map-svg[^>]*>([\s\S]*?)<\/svg>/g)].map(m=>m[1]))assert(canvas.indexOf('class="global-edge-labels"')>canvas.lastIndexOf('data-map-node='),'Caption layer must be painted after every node');
assert.equal([...mapHtml.matchAll(/data-label-index=/g)].length,payloads.reduce((sum,d)=>sum+d.edges.length,0),'All captions must render');
assert.equal([...mapHtml.matchAll(/data-map-lens="personal"/g)].length,2,'Both full maps need personal relevance');
assert.equal([...mapHtml.matchAll(/data-map-regionfilter\b/g)].length,2,'Route filters missing');
assert.equal([...mapHtml.matchAll(/data-map-edgefilter\b/g)].length,2,'Relation filters missing');
const navigator=JSON.parse(mapHtml.match(/<script[^>]*data-navigator-data[^>]*>([\s\S]*?)<\/script>/)[1]);
assert.equal(navigator.questions.length,11);
for(const q of navigator.questions){assert(navigator.profiles[q.id].baseline&&navigator.profiles[q.id].check);for(const id of q.methods)assert(navigator.methods[id]);}
for(const method of Object.values(navigator.methods))for(const value of [method.url,method.mapUrl]){const parsed=new URL(value,'https://local.test');assert(!prefix||parsed.pathname.startsWith(`${prefix}/`));assert(files.includes(path.join(directory,parsed.pathname.slice(prefix.length),'index.html')));}
assert.equal([...mapHtml.matchAll(/class="problem-baseline"/g)].length,11,'No-script problem baselines missing');
console.log(`PASS: full SVG overviews render ${knowledgePayload.nodes.length} knowledge nodes and ${historyPayload.nodes.length} historical nodes; all side-panel links and search positions verified.`);
const historyNodes=JSON.parse(await readFile('src/data/history/raw/nodes.json','utf8'));
const rawRelations=JSON.parse(await readFile('src/data/history/raw/relationships.json','utf8'));
const relations=JSON.parse(await readFile('dist/map/relations.json','utf8'));
assert.equal(relations.nodes.length,historyNodes.length);
assert.equal(relations.edges.length,rawRelations.length);
for(const node of historyNodes){
  const route=`map/history/${node.id}/`;
  assert(files.includes(path.join(directory,route,'index.html')),`Missing history page: ${node.id}`);
  assert(entries.some(e=>e.url.endsWith(`/${route}`)),`History missing from search: ${node.id}`);
  if(process.env.SITE_URL || process.env.GITHUB_REPOSITORY) assert(sitemap.includes(`/${route}`),`History missing from sitemap: ${node.id}`);
  const apiNode=relations.nodes.find(n=>n.id===node.id);
  assert(apiNode&&apiNode.url===`${prefix}/${route}`,`History API base mismatch: ${node.id}`);
}
for(const edge of rawRelations)assert(relations.edges.some(e=>e.source===edge.source&&e.target===edge.target),`Missing recorded edge: ${edge.source}`);
assert.equal(relations.edges.filter(e=>e.directed).length,relations.edges.filter(e=>['adoption','support','development'].includes(e.group)).length);
for(const id of ['generative-models','probabilistic-inference'])assert(files.includes(path.join(directory,`atlas/${id}/index.html`)),`Missing linked method: ${id}`);

for(const id of ['regression-lab','classification-lab','overfitting-lab']) {
  assert(files.includes(path.join(directory,`notes/${id}/index.html`)),`Missing learning tutorial: ${id}`);
  assert(entries.some(e=>e.url.endsWith(`/notes/${id}/`)),`Tutorial missing from search: ${id}`);
}
for(const kind of ['regression','classification','overfitting']) assert(files.includes(path.join(directory,`examples/${kind}.py`)),`Missing runnable example: ${kind}`);
assert((await readFile('dist/atlas/regression/index.html','utf8')).includes('class="katex"'),'Math was not rendered');
assert((await readFile('dist/atlas/formal-methods/index.html','utf8')).includes('class="katex"'),'Formal math was not rendered');
const expected = ['index.html','start/index.html','map/index.html','map/history/index.html','map/sources/index.html','tutorials/index.html','learn/index.html','learn/personalize/index.html','resources/courses/index.html','atlas/index.html','notes/index.html','resources/index.html','about/index.html','404.html'];
for(const route of expected) assert(files.includes(path.join(directory,route)),`Missing page: ${route}`);
assert.deepEqual(getDeployment({GITHUB_REPOSITORY:'TestUser/TestUser.github.io'}),{site:'https://TestUser.github.io',base:'/'});
assert.deepEqual(getDeployment({GITHUB_REPOSITORY:'TestUser/guide'}),{site:'https://TestUser.github.io',base:'/guide'});
assert.deepEqual(getDeployment({GITHUB_REPOSITORY:'TestUser/guide',SITE_URL:'https://custom.example',BASE_PATH:'/'}),{site:'https://custom.example',base:'/'});
if(process.env.SITE_URL || process.env.GITHUB_REPOSITORY) assert(sitemap.includes('<url>'),'Configured deployment needs a sitemap');
console.log(`PASS: ${files.filter(f=>f.endsWith('.html')).length} HTML pages, ${checked} internal links/assets/fragments, ${drafts.length} excluded drafts, ${entries.length} search entries, math, metadata and deployment configuration. Base: ${base}`);
