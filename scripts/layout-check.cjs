// Layout check (L24): opens preview.html in a headless browser, visits every view and counts
// (a) lines that run through a point that isn't theirs and (b) points whose shape+label boxes overlap.
// Run: npm run build:file && node scripts/layout-check.cjs   (needs Playwright: npm i -D playwright)
const path=require('node:path');
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright'));}
const BUDGET=Number(process.env.LAYOUT_BUDGET||3);
const URL='file://'+path.resolve(__dirname,'..','preview.html');
// For every view: (a) a node's shape or label box crossed by a link that isn't its own, (b) two nodes' boxes overlapping.
// wait until the map has stopped moving (positions unchanged for 400ms), at most 10s — timing-free results
const settle=async(p)=>{await p.waitForTimeout(500);let prev='',same=0;for(let t=0;t<100&&same<4;t++){await p.waitForTimeout(100);const now=await p.evaluate(()=>[...document.querySelectorAll('.stage .node')].map(g=>g.getAttribute('transform')).join('|')+document.querySelector('.stage g')?.getAttribute('transform'));same=now===prev?same+1:0;prev=now;}};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto(URL);await p.waitForTimeout(1200);
const ids=process.env.VIEWS?process.env.VIEWS.split(','):['','experience','education','hoyoverse','seminary-coop','nike','weber-shandwick','nowness','uchicago','xjtlu',...await p.evaluate(()=>[...new Set([...document.querySelectorAll('.mob [id^="m-"]')].map(e=>e.id.slice(2)))])];
const REGIONS=process.env.VIEWS?[]:['na','eu','jp','cn'];
const views=[...ids.map(id=>({id})),...REGIONS.map(r=>({id:'',region:r}))];
let total=0;const rows=[];
for(const vw of views){const id=vw.id;if(vw.region){await p.goto(URL+'?region='+vw.region+'#/');await p.waitForTimeout(800);}else{if(views.indexOf(vw)>0&&views[views.indexOf(vw)-1].region)await p.goto(URL);await p.evaluate(i=>location.hash='#/'+i,id);}await settle(p);
 const r=await p.evaluate((DBG)=>{
  const nodes=[...document.querySelectorAll('.stage .node:not(.leaving)')].map(g=>{const s=g.querySelector('.shape').getBoundingClientRect();const l=g.querySelector('text.lbl').getBoundingClientRect();return {id:g.dataset.id,lb:{x0:l.left,y0:l.top,x1:l.right,y1:l.bottom},c:{x:(s.left+s.right)/2,y:(s.top+s.bottom)/2},box:{x0:Math.min(s.left,l.left),y0:s.top,x1:Math.max(s.right,l.right),y1:Math.max(s.bottom,l.bottom)}}});
  const segs=[];document.querySelectorAll('.stage path.lk').forEach(pt=>{const L=pt.getTotalLength();const m=pt.getScreenCTM();const pts=[];for(let i=0;i<=40;i++){const q=pt.getPointAtLength(L*i/40);pts.push({x:q.x*m.a+q.y*m.c+m.e,y:q.x*m.b+q.y*m.d+m.f});}segs.push(pts)});
  // endpoints tell which nodes a link belongs to
  const near=(pt,n)=>Math.hypot(pt.x-n.c.x,pt.y-n.c.y)<14||(pt.x>n.box.x0-6&&pt.x<n.box.x1+6&&pt.y>n.box.y0-6&&pt.y<n.box.y1+6); // a line may start under its point's label
  let cross=[];for(const pts of segs){const own=nodes.filter(n=>near(pts[0],n)||near(pts[pts.length-1],n)).map(n=>n.id);
    for(const n of nodes.filter(n=>own.includes(n.id))){const pad=3,b=n.lb;const away=pts.filter(q=>Math.hypot(q.x-pts[0].x,q.y-pts[0].y)>8&&Math.hypot(q.x-pts[pts.length-1].x,q.y-pts[pts.length-1].y)>8);if(away.some(q=>q.x>b.x0+pad&&q.x<b.x1-pad&&q.y>b.y0+pad&&q.y<b.y1-pad))cross.push('own:'+n.id);}
    for(const n of nodes){if(own.includes(n.id))continue;const pad=3;if(pts.slice(2,-2).some(q=>q.x>n.box.x0+pad&&q.x<n.box.x1-pad&&q.y>n.box.y0+pad&&q.y<n.box.y1-pad))cross.push(n.id+(DBG?'<'+own.join('-')+'>':''));}}
  let ov=[];for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i].box,c=nodes[j].box;if(a.x0<c.x1-2&&c.x0<a.x1-2&&a.y0<c.y1-2&&c.y0<a.y1-2)ov.push(nodes[i].id+'~'+nodes[j].id);}
  // (c) lines crossing or running on top of each other (not at a point they share)
  let lx=0;
  const segsOf=pts=>pts.slice(1).map((q,i)=>[pts[i],q]);
  const inter=(p1,p2,p3,p4)=>{const d=(p2.x-p1.x)*(p4.y-p3.y)-(p2.y-p1.y)*(p4.x-p3.x);if(Math.abs(d)<1e-9)return false;const u=((p3.x-p1.x)*(p4.y-p3.y)-(p3.y-p1.y)*(p4.x-p3.x))/d,v=((p3.x-p1.x)*(p2.y-p1.y)-(p3.y-p1.y)*(p2.x-p1.x))/d;return u>0.02&&u<0.98&&v>0.02&&v<0.98;};
  for(let i=0;i<segs.length;i++)for(let j=i+1;j<segs.length;j++){
    const A=segs[i],B=segs[j];const ends=pts=>nodes.filter(n=>near(pts[0],n)||near(pts[pts.length-1],n)).map(n=>n.id);const eb=ends(B);const shared=ends(A).some(x=>eb.includes(x));
    const inner=pts=>pts.slice(4,-4);
    const close=inner(A).filter(q=>inner(B).some(r=>Math.hypot(q.x-r.x,q.y-r.y)<5)).length; // running together
    let cr=false;if(!shared){for(const s1 of segsOf(A))for(const s2 of segsOf(B))if(inter(s1[0],s1[1],s2[0],s2[1]))cr=true;}
    if(cr||close>3)lx++;}
  return {cross:[...new Set(cross)],ov,lx};},!!process.env.DEBUG);
 if(process.env.DEBUG)await p.screenshot({path:`${process.env.DEBUG}/${vw.region?'region-'+vw.region:id||'home'}.png`});const n=r.cross.length+r.ov.length+r.lx;total+=n;if(n)rows.push(`${vw.region?'region='+vw.region:id||'home'}: lines-through=[${r.cross}] boxes=[${r.ov}] line-line=${r.lx}`);}
console.log(rows.join('\n'));console.log('TOTAL',total,'over',views.length,'views');await b.close();process.exit(total>BUDGET?1:0);})();
