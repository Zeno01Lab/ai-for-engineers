import {readdir,readFile,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const secret=/\b(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9_-]{24,}|AKIA[A-Z0-9]{16}|AIza[A-Za-z0-9_-]{30,})\b/;
const forbiddenPath=/(^|\/)(?:private|secrets|\.env(?:\..*)?|\.git|handoff|research-private)(\/|$)/i;
async function walk(dir){const result=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())result.push(...await walk(p));else result.push(p);}return result;}
let source;try{source=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).split('\0').filter(Boolean);}catch{source=(await walk('src')).concat(await walk('public'));}
source=source.filter(p=>!p.split('/').some(v=>['node_modules','.astro','dist','.git','.openai'].includes(v)));
let checked=0;for(const p of [...source,...await walk('dist')]){if(!(await stat(p)).isFile())continue;assert(p==='.env.example'||!forbiddenPath.test(p),`Private path in source/output: ${p}`);const text=await readFile(p,'utf8');assert(!secret.test(text),`Possible credential in source/output: ${p}`);assert(!/PRIVATE[_]RESEARCH[_]SENTINEL/.test(text),`Unexpected personal/private material: ${p}`);checked++;}
const pages=await walk('dist');assert(!pages.some(p=>/START_HERE|CODEX_MASTER_PROMPT|profile\.example|handoff/i.test(p)),'Handoff artifacts are not website assets');
console.log(`PASS: ${checked} source/output files inspected for private paths, credential patterns, personal markers and accidentally bundled handoff files. This is a targeted check, not proof of absence of all sensitive data.`);
