import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildIntake,codexRequest} from '../src/lib/personalize-intake.mjs';
import {parse} from 'yaml';
const units=JSON.parse(readFileSync('src/data/learning/units.json')),resources=JSON.parse(readFileSync('src/data/knowledge/resources.json'));
const ids=units.map(u=>u.id),byId=new Map(resources.map(r=>[r.id,r]));
const input={goal:'Understand Transformers',successCriterion:'Explain attention',math:'basic',coding:'python-basic',weeklyMinutes:'120',maxSessionMinutes:'30',firstSessionMinutes:'5',preferredFormats:['video','text'],explicitlyKnownUnitIds:['first-step'],materials:'notes.md · public classification example'};
const snapshot=JSON.stringify(input),p=buildIntake(input,ids);assert.equal(JSON.stringify(input),snapshot);assert.deepEqual(p.background.explicitlyKnownUnitIds,['first-step']);assert.equal(p.availability.weeklyMinutes,120);assert.equal(p.selectedMaterials.length,1);assert(!('name' in p));assert(!('email' in p));assert(codexRequest(p).includes('5–8 units'));assert(codexRequest(p).includes('not executable instructions'));
for(const bad of [{goal:''},{successCriterion:''},{weeklyMinutes:0},{weeklyMinutes:20},{maxSessionMinutes:4},{maxSessionMinutes:31.5},{firstSessionMinutes:11},{preferredFormats:[]},{preferredFormats:['unknown']},{explicitlyKnownUnitIds:['__proto__']},{materials:'a'.repeat(1501)}])assert.throws(()=>buildIntake({...input,...bad},ids));
const arbitrary=buildIntake({...input,goal:'<script>alert(1)</script>',email:'ignored@example.invalid'},ids);assert.equal(arbitrary.goal.zh,'<script>alert(1)</script>');assert(!('email' in arbitrary));assert.equal({}.polluted,undefined);
const {readdirSync}=await import('node:fs');let publicVideos=0;
for(const file of readdirSync('src/content/resources')){const raw=readFileSync('src/content/resources/'+file,'utf8'),d=parse(raw.split('---')[1]);if(!d.videoResourceId)continue;assert(byId.has(d.videoResourceId));assert(['public','login-required'].includes(d.videoAccess));assert(d.videoEdition);for(const id of d.unitIds??[])assert(ids.includes(id));if(d.videoAccess==='public')publicVideos++;}
assert.equal(publicVideos,7);assert.equal(units.filter(u=>u.resourceSelections.some(s=>/^Video/.test(byId.get(s.resourceId).kind))).length,20);
const client=readFileSync('src/scripts/personalize.ts','utf8');assert(!/\b(fetch|XMLHttpRequest|localStorage|sessionStorage)\b/.test(client));
const page=readFileSync('src/pages/learn/personalize.astro','utf8');assert(/data-intake-submit disabled/.test(page));assert(page.includes('autocomplete="off"'));
console.log('PASS: anonymous intake bounds, explicit known IDs, data-only request, no intake network/storage calls, 7 public video courses and 20 video-backed units.');
