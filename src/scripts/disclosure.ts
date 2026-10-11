// Preserve incoming links when their target is inside a collapsed section.
export function revealFragment(hash:string){
 if(!hash||hash==='#')return;
 let id:string;try{id=decodeURIComponent(hash.slice(1));}catch{return;}
 const target=document.getElementById(id);if(!target)return;
 let ancestor:Element|null=target;
 while(ancestor){if(ancestor instanceof HTMLDetailsElement)ancestor.open=true;ancestor=ancestor.parentElement;}
}
revealFragment(location.hash);
addEventListener('hashchange',()=>revealFragment(location.hash));
addEventListener('pageshow',()=>revealFragment(location.hash));
document.addEventListener('click',event=>{
 const anchor=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href]'):null;
 if(!anchor)return;const url=new URL(anchor.href,location.href);
 if(url.origin===location.origin&&url.pathname===location.pathname&&url.search===location.search)revealFragment(url.hash);
});
