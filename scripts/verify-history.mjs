import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { z } from 'astro/zod';
import { engineeringQuestions } from '../src/data/engineering.ts';
const read=async name=>JSON.parse(await readFile(`src/data/history/${name}`,'utf8'));
const nodeSchema=z.object({id:z.string().regex(/^[a-z0-9-]+$/),year:z.number().int().min(1900).max(2100),year_basis:z.enum(['paper','preprint','project_start','event','release','book']),title:z.object({zh:z.string().min(1),en:z.string().min(1)}),track:z.string().min(1),problem_or_motivation_zh:z.string().min(1),contribution_zh:z.string().min(1),limitations_or_editorial_caution_zh:z.string().min(1),engineering_connection_zh:z.string().min(1),references:z.array(z.object({type:z.string(),url:z.url()})).min(1),verification:z.object({primary_source_metadata_or_abstract_checked:z.boolean(),jrc_csv_row_matched:z.boolean(),jrc_report_crosscheck:z.object({status:z.string()}).loose()}).loose()}).loose();
const nodes=z.array(nodeSchema).parse(await read('raw/nodes.json'));
const edgeSchema=z.object({source:z.string(),target:z.string(),type:z.string(),explanation_zh:z.string().min(1),relationship_is_editorial_interpretation:z.boolean()});
const edges=z.array(edgeSchema).parse(await read('raw/relationships.json'));
const metaSchema=z.record(z.string(),z.object({subject_kind:z.enum(['theoretical_model','foundational_work','field_event','algorithm','system','training_method','book','architecture','dataset','model_family','model','system_architecture','product_release','model_release']),method_ids:z.array(z.string()),featured:z.boolean(),source_labels:z.array(z.string().min(1))}).loose());
const meta=metaSchema.parse(await read('editorial.json'));
const ids=new Set(nodes.map(n=>n.id));assert.equal(ids.size,nodes.length,'Duplicate history node IDs');
const keys=new Set();const linked=new Set();
const methodIds=new Set((await readdir('src/content/algorithms')).map(f=>f.replace(/\.mdx?$/,'')));
for(const n of nodes){assert(meta[n.id],`Missing editorial metadata: ${n.id}`);assert.equal(meta[n.id].source_labels.length,n.references.length);for(const id of meta[n.id].method_ids)assert(methodIds.has(id),`Unknown method ${id} in ${n.id}`);if(n.verification.jrc_csv_row_matched)assert(n.verification.jrc_row_id,'CSV row match requires an actual row identifier');}
for(const id of Object.keys(meta))assert(ids.has(id),`Metadata for unknown node ${id}`);
const relationSource=await readFile('src/data/history/relations.ts','utf8');
for(const e of edges){assert(ids.has(e.source)&&ids.has(e.target),`Dangling relationship: ${e.source} / ${e.target}`);assert.notEqual(e.source,e.target,'Self relation');assert(relationSource.includes(`${e.type}:`),`Unknown relationship type: ${e.type}`);const key=`${e.source}/${e.type}/${e.target}`;assert(!keys.has(key),'Duplicate relationship');keys.add(key);linked.add(e.source);linked.add(e.target);}
const questionIds=new Set();
for(const q of engineeringQuestions){assert(!questionIds.has(q.id),'Duplicate engineering problem ID');questionIds.add(q.id);for(const id of q.methods)assert(methodIds.has(id),`Unknown engineering method: ${id}`);for(const id of q.events)assert(ids.has(id),`Unknown engineering event: ${id}`);if(q.lesson)await readFile(`src/content/articles/${q.lesson}.md`);}
console.log(`PASS: ${nodes.length} history events, ${edges.length} typed relationships, schemas, IDs, references and method bindings. ${nodes.length-linked.size} events have no recorded relation; no edges invented.`);
