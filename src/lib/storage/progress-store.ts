import units from '../../data/learning-path.json' with {type:'json'};
import paths from '../../data/learning/paths.json' with {type:'json'};
import {emptyProfile,readProfile,exportProfile,profileKey} from './progress.mjs';
export type LearningProfile={schemaVersion:number;unitStatus:Record<string,string>;selectedPath:string|null;updatedAt:string};
let memory:LearningProfile=emptyProfile(),persistent=true,warning='',dirty=false;
export function readLearningProgress():LearningProfile{if(dirty)return memory;try{memory=readProfile(localStorage,units,paths).profile;warning='';persistent=true;}catch(error){if(error instanceof DOMException){persistent=false;warning='Browser storage unavailable · 浏览器保存不可用。';}else warning='Saved progress is invalid · 本地记录格式无效；原记录未覆盖，可导入备份恢复。';}return memory;}
export function saveLearningProgress(profile:LearningProfile){memory=profile;try{localStorage.setItem(profileKey,exportProfile(profile,units,paths));persistent=true;dirty=false;warning='';}catch{persistent=false;dirty=true;warning='Browser storage unavailable · 仅本次页面内保留。';}dispatchEvent(new Event('learning-path-change'));}
export const progressStorageStatus=()=>({persistent,warning});
