import {readFile,readdir,writeFile} from 'node:fs/promises';
import {parse} from 'yaml';
import {validateKnowledge} from '../src/lib/knowledge/validate.mjs';
const json=async p=>JSON.parse(await readFile(p,'utf8'));
export async function readKnowledge(){
 const concepts=[],bodies={};for(const directory of ['src/content/algorithms','src/content/concepts'])for(const name of (await readdir(directory)).filter(n=>n.endsWith('.md')).sort()){const source=await readFile(`${directory}/${name}`,'utf8');const metadata=parse(source.split('---')[1]);const id=name.replace(/\.md$/,'');bodies[id]=source.split('---').slice(2).join('---');concepts.push({id,...metadata});}
 return{concepts,bodies,resources:await json('src/data/knowledge/resources.json'),units:await json('src/data/learning/units.json'),paths:await json('src/data/learning/paths.json'),events:await json('src/data/history/raw/nodes.json'),historyRelations:await json('src/data/history/raw/relationships.json'),conceptRelations:await json('src/data/knowledge/relations.json'),regions:await json('src/data/knowledge/regions.json')};
}
export async function syncKnowledge(){
 const data=await readKnowledge(),index=validateKnowledge(data);const meta=await json('src/data/history/editorial.json');
 const section=(body,heading)=>body.split('## '+heading+'\n')[1]?.split('\n## ')[0].trim()||'';
 const concepts=data.concepts.filter(c=>!c.draft).map(c=>({...c,sections:Object.fromEntries(Object.entries({motivation:'动机与发展线索',coreIdea:'核心思想',assumptions:'假设与前提',limitations:'局限',engineering:'典型应用与工程示例',alternatives:'替代方法'}).map(([key,heading])=>[key,section(data.bodies[c.id],heading)])),historyEventIds:c.historyEventIds.length?c.historyEventIds:data.events.filter(e=>meta[e.id].method_ids.includes(c.detailConceptId)).map(e=>e.id),references:c.referenceIds.map(id=>({title:index.resources.get(id).title,url:index.resources.get(id).url}))}));
 const steps=data.units.map(u=>({id:u.id,camp:u.track,title:u.title.en+' · '+u.title.zh,titleEn:u.title.en,titleZh:u.title.zh,minutes:u.minutes,prerequisites:u.prerequisiteUnitIds,knowledge:u.conceptIds,materials:u.resourceSelections.map(s=>{const r=index.resources.get(s.resourceId);return{resourceId:r.id,label:r.title,url:r.url,language:r.language,kind:r.kind,scope:s.scope};}),check:u.checkpoint,outcomes:u.outcomes,optional:u.optional}));
 const emit=async(path,value)=>{const next=JSON.stringify(value,null,2)+'\n';let old='';try{old=await readFile(path,'utf8');}catch{}if(old!==next)await writeFile(path,next);};
 await emit('src/data/knowledge/concepts.generated.json',concepts);await emit('src/data/learning-path.json',steps);
 console.log(`PASS: canonical schemas and references — ${concepts.length} concepts, ${data.resources.length} resources, ${steps.length} units, ${data.paths.length} curated paths; ${data.events.length}/${data.historyRelations.length} history evidence retained.`);
 return data;
}
if(process.argv[1]?.endsWith('/sync-knowledge.mjs')||process.argv[1]==='scripts/sync-knowledge.mjs')await syncKnowledge();
