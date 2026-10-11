const key='afe-learning-v1';
const boxes=document.querySelectorAll<HTMLInputElement>('[data-complete]');
let state:Record<string,boolean>={};
let available=true;
try {const saved=JSON.parse(localStorage.getItem(key)||'{}');if(saved && typeof saved==='object' && !Array.isArray(saved))state=saved;} catch {available=false;}
function refresh(){boxes.forEach(box=>box.checked=state[box.dataset.complete!]===true);const ids=['regression-lab','classification-lab','overfitting-lab'];const count=ids.filter(id=>state[id]===true).length;document.querySelectorAll('[data-progress-count]').forEach(el=>el.textContent=`${count} / 3`);document.querySelectorAll<HTMLProgressElement>('progress[data-progress]').forEach(el=>el.value=count);document.querySelectorAll('[data-progress-message]').forEach(el=>el.textContent=available?'进度只保存在当前浏览器，不会同步到其他设备。':'浏览器未允许保存进度；本次页面仍可勾选。');}
boxes.forEach(box=>box.addEventListener('change',()=>{state[box.dataset.complete!]=box.checked;try{localStorage.setItem(key,JSON.stringify(state));available=true;}catch{available=false;}refresh();}));
document.querySelector('[data-reset-progress]')?.addEventListener('click',()=>{state={};try{localStorage.removeItem(key);}catch{available=false;}refresh();});
refresh();
