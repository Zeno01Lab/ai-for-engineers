// Put relation captions in free space, independently of SVG paint order.
export function overlaps(a,b,gap=0){return a.x<b.x+b.width+gap&&a.x+a.width>b.x-gap&&a.y<b.y+b.height+gap&&a.y+a.height>b.y-gap;}
const captionWidth=text=>Math.max(48,[...text].reduce((sum,c)=>sum+(/[\u2e80-\uffff]/.test(c)?12.5:7.5),0)+16);
function anchors(edge,data,byId){
 const a=byId.get(edge.source),b=byId.get(edge.target);
 const sx=a.x+a.width/2,sy=a.y+a.height/2,tx=b.x+b.width/2,ty=b.y+b.height/2;
 if(data.mode!=='history')return [.5,.35,.65,.2,.8].map(t=>({x:sx+(tx-sx)*t,y:sy+(ty-sy)*t}));
 let points;
 if(sx===tx){const bend=45+Math.abs(ty-sy)*.12;points=[{x:a.x+a.width,y:sy},{x:a.x+a.width+bend,y:sy},{x:b.x+b.width+bend,y:ty},{x:b.x+b.width,y:ty}];}
 else{const ax=tx>=sx?a.x+a.width:a.x,bx=tx>=sx?b.x:b.x+b.width,bend=Math.max(35,Math.abs(bx-ax)*.35),sign=bx>=ax?1:-1;points=[{x:ax,y:sy},{x:ax+sign*bend,y:sy},{x:bx-sign*bend,y:ty},{x:bx,y:ty}];}
 return [.5,.35,.65,.2,.8].map(t=>{const u=1-t;return{x:u**3*points[0].x+3*u*u*t*points[1].x+3*u*t*t*points[2].x+t**3*points[3].x,y:u**3*points[0].y+3*u*u*t*points[1].y+3*u*t*t*points[2].y+t**3*points[3].y};});
}
export function layoutEdgeLabels(data){
 const byId=new Map(data.nodes.map(n=>[n.id,n]));
 const obstacles=[...data.nodes,...data.regions.map(r=>({x:r.x,y:r.y,width:data.mode==='history'?185:r.width,height:r.note?58:34})),{x:0,y:0,width:data.width,height:data.mode==='history'?88:135}];
 const rows=[...new Set(data.nodes.flatMap(n=>[n.y-10,n.y+n.height+10]))];
 const placed=[];
 return data.edges.map(edge=>{
  const width=captionWidth(edge.label),height=18,points=anchors(edge,data,byId),candidates=[];
  for(const [i,p] of points.entries()){
   const xs=[p.x,p.x-width*.6,p.x+width*.6];
   for(const x of xs)for(const y of [p.y,...rows])candidates.push({x:x-width/2,y:y-height/2,width,height,anchorX:p.x,anchorY:p.y,score:Math.hypot(x-p.x,y-p.y)+i*7});
  }
  const available=r=>r.x>=8&&r.y>=8&&r.x+r.width<=data.width-8&&r.y+r.height<=data.height-8&&!obstacles.some(n=>overlaps(r,n,1))&&!placed.some(n=>overlaps(r,n,2));
  candidates.sort((a,b)=>a.score-b.score);
  let result=candidates.find(available);
  if(!result){
   const p=points[0];let best=Infinity;
   for(let y=140;y<data.height-height-8;y+=10)for(let x=8;x<data.width-width-8;x+=12){const r={x,y,width,height,anchorX:p.x,anchorY:p.y,score:Math.hypot(x+width/2-p.x,y+height/2-p.y)};if(r.score<best&&available(r)){best=r.score;result=r;}}
  }
  if(!result)throw new Error(`No free caption position: ${edge.source} / ${edge.target}`);
  placed.push(result);return result;
 });
}
