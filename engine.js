'use strict';
const V={p:1,n:3,b:3,r:5,q:9,k:0};
const isW=c=>c===c.toUpperCase();
const DR={n:[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]],b:[[1,1],[1,-1],[-1,1],[-1,-1]],r:[[1,0],[-1,0],[0,1],[0,-1]]};
DR.q=DR.k=DR.b.concat(DR.r);
function pseudo(b,w){const out=[];
for(let i=0;i<64;i++){const p=b[i];if(!p||isW(p)!==w)continue;const x=i%8,y=i>>3,t=p.toLowerCase();
if(t==='p'){const d=w?-1:1,ny=y+d;
if(ny>=0&&ny<8&&!b[ny*8+x]){out.push([i,ny*8+x]);const y2=y+2*d;if(y===(w?6:1)&&!b[y2*8+x])out.push([i,y2*8+x])}
for(const dx of[-1,1]){const nx=x+dx;if(nx<0||nx>7||ny<0||ny>7)continue;const q=b[ny*8+nx];if(q&&isW(q)!==w)out.push([i,ny*8+nx])}}
else{const sl=t==='b'||t==='r'||t==='q';
for(const[dx,dy]of DR[t]){let nx=x+dx,ny=y+dy;
while(nx>=0&&nx<8&&ny>=0&&ny<8){const q=b[ny*8+nx];if(q){if(isW(q)!==w)out.push([i,ny*8+nx]);break}out.push([i,ny*8+nx]);if(!sl)break;nx+=dx;ny+=dy}}}}
return out}
function mk(b,m){const n=b.slice();let p=n[m[0]];n[m[1]]='';n[m[1]]=p;n[m[0]]='';
if(p==='P'&&m[1]<8)n[m[1]]='Q';if(p==='p'&&m[1]>55)n[m[1]]='q';return n}
function chk(b,w){const k=b.indexOf(w?'K':'k');return pseudo(b,!w).some(m=>m[1]===k)}
const legal=(b,w)=>pseudo(b,w).filter(m=>!chk(mk(b,m),w));
const START='rnbqkbnrpppppppp'.split('').concat(Array(32).fill(''),'PPPPPPPPRNBQKBNR'.split(''));

module.exports={legal,mk,chk,START};
