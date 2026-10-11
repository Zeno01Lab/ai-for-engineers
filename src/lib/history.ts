import rawNodes from '../data/history/raw/nodes.json';
import rawRelations from '../data/history/raw/relationships.json';
import metadata from '../data/history/editorial.json';
import concepts from '../data/knowledge/concepts.generated.json';
import { relationKinds, tracks, subjectKinds, yearBases } from '../data/history/relations';
export { relationKinds, relationGroups, tracks, subjectKinds, yearBases } from '../data/history/relations';
type Meta={subject_kind:string;method_ids:string[];featured:boolean;source_labels:string[]};
const curated=metadata as Record<string,Meta>;
export const historyNodes=rawNodes.map(n=>({
 ...n,...curated[n.id],conceptIds:concepts.filter(c=>c.historyEventIds.includes(n.id)).map(c=>c.id),trackLabel:tracks[n.track]||n.track,
 subjectLabel:subjectKinds[curated[n.id].subject_kind],yearLabel:yearBases[n.year_basis],
 editorNote:'editor_note_zh' in n ? String(n.editor_note_zh):'',
 references:n.references.map((r,i)=>({...r,label:curated[n.id].source_labels[i],grade:r.url.includes('engineering100.stanford.edu')?'B':'A',sourceKind:r.url.includes('engineering100.stanford.edu')?'机构历史回顾':'原始出版记录或发布入口'})),
})).sort((a,b)=>a.year-b.year||a.id.localeCompare(b.id));
export type HistoryNode=typeof historyNodes[number];
export const eventById=new Map(historyNodes.map(n=>[n.id,n]));
export const historyRelations=rawRelations.map((r)=>({
 ...r,id:`${r.source}--${r.type}--${r.target}`,layer:'history',sourceType:'event',targetType:'event',
 ...relationKinds[r.type as keyof typeof relationKinds],
 sourceNode:eventById.get(r.source)!,targetNode:eventById.get(r.target)!,
}));
export const eventsForMethod=(id:string)=>historyNodes.filter(n=>n.method_ids.includes(id));
export const relationsForEvent=(id:string)=>historyRelations.filter(r=>r.source===id||r.target===id);
export const reportCount=historyNodes.filter(n=>n.verification.jrc_report_crosscheck.status==='checked_against_JRC_historical_report').length;
