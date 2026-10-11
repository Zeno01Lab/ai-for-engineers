// Orthogonal routes through free corridors; paths must not imply a connection
// to intermediate checkpoint cards that happen to share the same row.
export function routePathEdges(data){
 const byId=new Map(data.nodes.map(n=>[n.id,n]));
 const xs=[...new Set(data.nodes.flatMap(n=>[n.x-6,n.x+n.width+6]))].sort((a,b)=>a-b);
 const ys=[...new Set(data.nodes.flatMap(n=>[n.y-6,n.y+n.height/2,n.y+n.height+6]))].sort((a,b)=>a-b);
 const W=xs.length,H=ys.length;
 function blocked(x,y){return data.nodes.some(n=>x>n.x-4&&x<n.x+n.width+4&&y>n.y-4&&y<n.y+n.height+4);}
 function clear(a,b){return !data.nodes.some(n=>a.x===b.x?a.x>n.x-4&&a.x<n.x+n.width+4&&Math.min(a.y,b.y)<n.y+n.height+4&&Math.max(a.y,b.y)>n.y-4:a.y>n.y-4&&a.y<n.y+n.height+4&&Math.min(a.x,b.x)<n.x+n.width+4&&Math.max(a.x,b.x)>n.x-4);}
 const allowed=Array.from({length:W*H},(_,i)=>!blocked(xs[i%W],ys[Math.floor(i/W)]));
 const adjacency=Array.from({length:W*H},(_,i)=>{if(!allowed[i])return [];const x=i%W,y=Math.floor(i/W);return [[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(([a,b])=>a>=0&&a<W&&b>=0&&b<H&&allowed[b*W+a]&&clear({x:xs[x],y:ys[y]},{x:xs[a],y:ys[b]})).map(([a,b])=>b*W+a);});
 return data.edges.map(e=>{
  const a=byId.get(e.source),b=byId.get(e.target),start={x:a.x+a.width+6,y:a.y+a.height/2},end={x:b.x-6,y:b.y+b.height/2};
  const si=ys.indexOf(start.y)*W+xs.indexOf(start.x),ei=ys.indexOf(end.y)*W+xs.indexOf(end.x),score=new Map([[si,0]]),previous=new Map(),open=[{i:si,f:0}];
  function push(v){open.push(v);let k=open.length-1;while(k>0){const p=Math.floor((k-1)/2);if(open[p].f<=v.f)break;open[k]=open[p];k=p;}open[k]=v;}
  function pop(){const first=open[0],last=open.pop();if(open.length){let k=0;while(k*2+1<open.length){let c=k*2+1;if(c+1<open.length&&open[c+1].f<open[c].f)c++;if(open[c].f>=last.f)break;open[k]=open[c];k=c;}open[k]=last;}return first;}
  const closed=new Set();while(open.length){const{i}=pop();if(closed.has(i))continue;if(i===ei)break;closed.add(i);const x=xs[i%W],y=ys[Math.floor(i/W)];for(const j of adjacency[i]){if(closed.has(j))continue;const nx=xs[j%W],ny=ys[Math.floor(j/W)],cost=score.get(i)+Math.abs(nx-x)+Math.abs(ny-y);if(cost<(score.get(j)??Infinity)){score.set(j,cost);previous.set(j,i);push({i:j,f:cost+Math.abs(end.x-nx)+Math.abs(end.y-ny)});}}}
  if(!score.has(ei))throw Error(`No free course route: ${e.source} -> ${e.target}`);
  let path=[],cur=ei;while(cur!==undefined){path.push({x:xs[cur%W],y:ys[Math.floor(cur/W)]});cur=previous.get(cur);}path.reverse();
  const points=[{x:a.x+a.width,y:start.y},...path,{x:b.x,y:end.y}],simple=[];for(const p of points){while(simple.length>1){const q=simple[simple.length-1],r=simple[simple.length-2];if((r.x===q.x&&q.x===p.x)||(r.y===q.y&&q.y===p.y))simple.pop();else break;}simple.push(p);}
  return{...e,points:simple,d:simple.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join(' ')};
 });
}
