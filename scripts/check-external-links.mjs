import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const urls=new Set();
async function walk(dir) { for(const e of await readdir(dir,{withFileTypes:true})) { const file=path.join(dir,e.name); if(e.isDirectory()) await walk(file); else if(/\.(astro|md|mdx|json|ts)$/.test(e.name)) { const source=await readFile(file,'utf8'); for(const match of source.matchAll(/https?:\/\/[^\s"'<>\)]+/g)) urls.add(match[0]); } } }
await walk('src');
const report=[]; const pending=[...urls];
async function worker() { while(pending.length) { const url=pending.shift(); try { const response=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{'User-Agent':'AI-for-Engineers-link-check/1.0'}}); await response.body?.cancel(); report.push({url,status:response.status,ok:response.ok,final:response.url}); } catch(error) { report.push({url,ok:false,error:error.message}); } } }
await Promise.all(Array.from({length:4},worker));
report.sort((a,b)=>a.url.localeCompare(b.url));
await writeFile('external-link-report.json',JSON.stringify({checkedAt:new Date().toISOString(),results:report},null,2));
for(const item of report) console.log(`${item.ok ? 'OK' : 'UNVERIFIED'} ${item.status ?? item.error} ${item.url}`);
console.log('Non-200 responses may indicate bot filtering or network limits; inspect before replacing a URL.');
if(report.some(r=>!r.ok)) process.exitCode=1;
