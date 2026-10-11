// Compatibility projection. Edit canonical Markdown, not this view adapter.
import concepts from './knowledge/concepts.generated.json' with {type:'json'};
import regions from './knowledge/regions.json' with {type:'json'};
export type KnowledgeSeed={id:string;label:string;subtitle:string;description:string;prerequisites:string[];method?:string;lesson?:string;events?:string[]};
const byId=new Map(concepts.map(c=>[c.id,c]));
const nodes:KnowledgeSeed[]=concepts.map(c=>({id:c.id,label:c.title,subtitle:c.english,description:c.description,prerequisites:c.foundationConceptIds,method:byId.get(c.detailConceptId)?.atlas?c.detailConceptId:undefined,lesson:c.lessonId||undefined,events:c.historyEventIds}));
const groupNodes=(id:string)=>nodes.filter(n=>byId.get(n.id)!.group===id).sort((a,b)=>byId.get(a.id)!.mapOrder-byId.get(b.id)!.mapOrder);
export const knowledgeGroups=regions.filter(r=>r.id!=='foundations').map(r=>({...r,nodes:groupNodes(r.id)}));
export const foundations=groupNodes('foundations');
