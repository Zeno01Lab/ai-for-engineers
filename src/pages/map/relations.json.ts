import { historyNodes, historyRelations } from '../../lib/history';
import { href } from '../../lib/content';
export function GET(){return new Response(JSON.stringify({nodes:historyNodes.map(n=>({id:n.id,label:n.title.zh,english:n.title.en,year:n.year,url:href(`map/history/${n.id}/`)})),edges:historyRelations.map(r=>({source:r.source,target:r.target,label:r.label,group:r.group,explanation:r.explanation_zh,directed:['adoption','support','development'].includes(r.group)}))}),{headers:{'Content-Type':'application/json; charset=utf-8'}});}
