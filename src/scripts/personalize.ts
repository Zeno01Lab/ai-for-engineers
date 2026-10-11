import {buildIntake,codexRequest} from '../lib/personalize-intake.mjs';
const form=document.querySelector<HTMLFormElement>('[data-personalize]');
if(form){
 const ids:string[]=JSON.parse(form.querySelector('[data-unit-ids]')!.textContent!);
 const output=document.querySelector<HTMLElement>('[data-intake-output]')!,message=document.querySelector<HTMLElement>('[data-intake-message]')!;
 const prompt=document.querySelector<HTMLTextAreaElement>('[data-intake-prompt]')!;
 let profile:ReturnType<typeof buildIntake>|null=null;
 const invalidate=()=>{profile=null;output.hidden=true;prompt.value='';message.textContent='';};form.addEventListener('input',invalidate);form.addEventListener('reset',invalidate);
 form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);try{profile=buildIntake({...Object.fromEntries(data),preferredFormats:data.getAll('preferredFormats'),explicitlyKnownUnitIds:data.getAll('explicitlyKnownUnitIds')},ids);prompt.value=codexRequest(profile);output.hidden=false;message.textContent='Request ready · 请求已准备。尚未生成路径，也未更改学习进度。';output.scrollIntoView({block:'start',behavior:'smooth'});}catch(error){message.textContent=error instanceof Error?error.message:'Please check your inputs · 请检查输入';}});
 function download(name:string,content:string,type:string){const url=URL.createObjectURL(new Blob([content],{type})),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 document.querySelector('[data-download-profile]')!.addEventListener('click',()=>{if(profile)download('profile.json',JSON.stringify(profile,null,2),'application/json');});
 document.querySelector('[data-download-request]')!.addEventListener('click',()=>{if(profile)download('request.md',prompt.value,'text/markdown');});
 document.querySelector('[data-copy-request]')!.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(prompt.value);message.textContent='Copied · 已复制请求。';}catch{prompt.focus();prompt.select();message.textContent='Select and copy the request below · 请手动复制下方请求。';}});
 form.querySelector<HTMLButtonElement>('[data-intake-submit]')!.disabled=false;
}
