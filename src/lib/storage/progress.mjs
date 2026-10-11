export const profileKey='ai-for-engineers.progress.v1';
export const legacyPathKey='zeno-learning-path-v1';
const statuses=new Set(['not_started','in_progress','completed','already_known']);
const plain=value=>!!value&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
export function emptyProfile(now=new Date().toISOString()){return{schemaVersion:1,unitStatus:{},selectedPath:null,updatedAt:now};}
export function validateProfile(value,units,paths){
 const fail=message=>{throw Error(message);};
 if(!plain(value))fail('Progress must be a JSON object.');
 const keys=['schemaVersion','unitStatus','selectedPath','updatedAt'];if(Object.keys(value).length!==keys.length||keys.some(k=>!Object.hasOwn(value,k)))fail('Unknown or missing progress fields.');
 if(value.schemaVersion!==1)fail('Unsupported progress schema version.');if(!plain(value.unitStatus))fail('Invalid unit status object.');
 const ids=new Set(units.map(u=>u.id));for(const[id,status]of Object.entries(value.unitStatus))if(!ids.has(id)||!statuses.has(status))fail('Unknown unit ID or status: '+id);
 if(value.selectedPath!==null&&!paths.some(p=>p.id===value.selectedPath))fail('Unknown selected learning path.');
 if(typeof value.updatedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(value.updatedAt)||!Number.isFinite(Date.parse(value.updatedAt)))fail('Invalid progress timestamp.');
 return{schemaVersion:1,unitStatus:Object.fromEntries(Object.entries(value.unitStatus)),selectedPath:value.selectedPath,updatedAt:value.updatedAt};
}
export function importProfile(text,units,paths){if(typeof text!=='string'||text.length>200000)throw Error('Progress file is too large.');return validateProfile(JSON.parse(text),units,paths);}
export function exportProfile(profile,units,paths){return JSON.stringify(validateProfile(profile,units,paths),null,2)+'\n';}
export function migrateLegacy(text,units,now=new Date().toISOString()){
 const profile=emptyProfile(now);let input;try{input=JSON.parse(text);}catch{return profile;}if(!plain(input))return profile;const ids=new Set(units.map(u=>u.id));for(const[id,status]of Object.entries(input))if(ids.has(id)&&['done','prior'].includes(status))profile.unitStatus[id]=status==='done'?'completed':'already_known';return profile;
}
export function readProfile(storage,units,paths,now=new Date().toISOString()){
 const raw=storage.getItem(profileKey);if(raw!==null)return{profile:importProfile(raw,units,paths),migrated:false};
 const legacy=storage.getItem(legacyPathKey);return{profile:migrateLegacy(legacy,units,now),migrated:legacy!==null};
}
export function mergeProfile(current,incoming,units,paths,now=new Date().toISOString()){validateProfile(current,units,paths);validateProfile(incoming,units,paths);return validateProfile({...current,unitStatus:{...current.unitStatus,...incoming.unitStatus},selectedPath:incoming.selectedPath??current.selectedPath,updatedAt:now},units,paths);}
export function selectPath(profile,pathId,paths,now=new Date().toISOString()){if(pathId!==null&&!paths.some(p=>p.id===pathId))throw Error('Unknown learning path.');return{...profile,selectedPath:pathId,updatedAt:now};}
export function resetProfile(profile,now=new Date().toISOString()){return{...emptyProfile(now),selectedPath:profile.selectedPath};}
export function setUnitStatus(profile,id,status,units,state,checked=false,now=new Date().toISOString()){
 if(!units.some(u=>u.id===id)||!statuses.has(status))return profile;
 if(status==='completed'&&(!checked||!state.ready.has(id)))return profile;
 if(status==='already_known'&&(!checked||state.active.has(id)))return profile;
 const unitStatus={...profile.unitStatus};if(status==='not_started')delete unitStatus[id];else unitStatus[id]=status;
 return{...profile,unitStatus,updatedAt:now};
}
