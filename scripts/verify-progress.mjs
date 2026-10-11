import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {emptyProfile,validateProfile,importProfile,exportProfile,migrateLegacy,readProfile,profileKey,legacyPathKey,selectPath,setUnitStatus,mergeProfile,resetProfile} from '../src/lib/storage/progress.mjs';
import {pathState} from '../src/lib/path-state.mjs';
const units=JSON.parse(await readFile('src/data/learning-path.json','utf8')),paths=JSON.parse(await readFile('src/data/learning/paths.json','utf8')),now='2026-10-10T04:00:00.000Z';
const state=p=>pathState(units,p.unitStatus),update=(p,id,status,checked=false)=>setUnitStatus(p,id,status,units,state(p),checked,now);
let p=emptyProfile(now);assert.equal(state(p).lit.size,0);p=update(p,'first-step','in_progress');assert.equal(state(p).lit.size,0);assert.equal(p.unitStatus['first-step'],'in_progress');assert.equal(update(p,'first-step','completed'),p);p=update(p,'first-step','completed',true);assert(state(p).lit.has('supervised'));
assert(paths.length>0,'At least one public path is required');
const records=structuredClone(p.unitStatus);for(const path of paths){p=selectPath(p,path.id,paths,now);assert.deepEqual(p.unitStatus,records);assert.deepEqual(importProfile(exportProfile(p,units,paths),units,paths),p);}
// Path switching remains covered when the release offers only one generic path.
const switchingPaths=[{id:'test-first-path'},{id:'test-second-path'}];let switched=selectPath(p,switchingPaths[0].id,switchingPaths,now);switched=selectPath(switched,switchingPaths[1].id,switchingPaths,now);assert.deepEqual(switched.unitStatus,records);assert.deepEqual(importProfile(exportProfile(switched,units,switchingPaths),units,switchingPaths),switched);
assert.throws(()=>validateProfile(switched,units,paths),'Unknown local path cannot be imported into a public path list');const transferable={...switched,selectedPath:null};assert.deepEqual(importProfile(exportProfile(transferable,units,paths),units,paths).unitStatus,records);
p=update(p,'first-prediction','completed',true);assert(state(p).lit.has('regression'));const undone=update(p,'first-step','not_started');assert.equal(state(undone).lit.size,0);assert(state(undone).pending.has('first-prediction'));assert.equal(undone.unitStatus['first-prediction'],'completed');p=update(undone,'first-step','completed',true);assert(state(p).lit.has('regression'));
const known=update(emptyProfile(now),'neural-camp','already_known',true);assert(state(known).lit.has('neural-networks'));assert(!state(known).lit.has('linear-algebra'));assert.equal(known.unitStatus['neural-camp'],'already_known');assert.equal(update(emptyProfile(now),'agent-route','completed',true).unitStatus['agent-route'],undefined);
const orphan={...emptyProfile(now),unitStatus:{'agent-route':'completed'}};assert(state(importProfile(exportProfile(orphan,units,paths),units,paths)).pending.has('agent-route'));assert.equal(state(orphan).lit.size,0);
const legacy=migrateLegacy('{"first-step":"done","neural-camp":"prior","unknown":"done"}',units,now);assert.equal(legacy.unitStatus['first-step'],'completed');assert.equal(legacy.unitStatus['neural-camp'],'already_known');assert.equal(Object.keys(legacy.unitStatus).length,2);
const store=new Map([[legacyPathKey,'{"first-step":"done"}'],['zeno-map-learning-v1','{"regression":3}']]);const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};const loaded=readProfile(storage,units,paths,now);assert(loaded.migrated);storage.setItem(profileKey,exportProfile(p,units,paths));assert.deepEqual(readProfile(storage,units,paths).profile,p);const reset=resetProfile(p,now);storage.setItem(profileKey,exportProfile(reset,units,paths));assert.equal(state(readProfile(storage,units,paths).profile).lit.size,0,'Reset must not remigrate old progress');assert.equal(storage.getItem('zeno-map-learning-v1'),'{"regression":3}');
const merge=mergeProfile(p,known,units,paths,now);assert(merge.unitStatus['first-step']&&merge.unitStatus['neural-camp']);assert.deepEqual(importProfile(exportProfile(reset,units,paths),units,paths),reset);
for(const change of [q=>q.schemaVersion=2,q=>q.unitStatus=[],q=>q.unitStatus['missing']='completed',q=>q.unitStatus['first-step']='<img src=x onerror=alert(1)>',q=>q.selectedPath='not-a-path',q=>q.updatedAt='bad',q=>q.privateNotes='unexpected']){const q=structuredClone(p);change(q);assert.throws(()=>validateProfile(q,units,paths));}
assert.throws(()=>importProfile('x'.repeat(200001),units,paths));assert.throws(()=>importProfile('{"schemaVersion":1,"unitStatus":{"__proto__":"completed"},"selectedPath":null,"updatedAt":"2026-10-10T04:00:00Z"}',units,paths));assert.throws(()=>readProfile({getItem:()=>'{bad'},units,paths));
console.log('PASS: four statuses, explicit checkpoints, refresh, shared path switching, legacy migration, safe import/export/merge, undo/reset, blocked completions and independent ability self-assessments.');

// Exercise the actual shared storage adapter, including quota failure fallback.
const previousStorage=globalThis.localStorage,previousDispatch=globalThis.dispatchEvent;
let notifications=0,failWrite=false;
globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>{if(failWrite)throw new DOMException('Quota exceeded','QuotaExceededError');store.set(k,v);}};
globalThis.dispatchEvent=()=>{notifications++;return true;};
const actual=await import('../src/lib/storage/progress-store.ts');
actual.readLearningProgress();actual.saveLearningProgress(p);assert.deepEqual(actual.readLearningProgress(),p);
failWrite=true;const activeReading=update(p,'chance','in_progress');actual.saveLearningProgress(activeReading);assert.deepEqual(actual.readLearningProgress(),activeReading,'A failed write must keep this page session');assert.equal(actual.progressStorageStatus().persistent,false);
failWrite=false;actual.saveLearningProgress(p);store.set(profileKey,'{bad');actual.readLearningProgress();assert(actual.progressStorageStatus().warning.includes('invalid'));assert.equal(store.get(profileKey),'{bad','Corrupt saved state is not silently overwritten');actual.saveLearningProgress(p);assert(notifications>=4);
globalThis.localStorage=previousStorage;globalThis.dispatchEvent=previousDispatch;
console.log('PASS: actual storage adapter persistence, change notification, quota fallback and corrupt-record preservation.');
