'use strict';
const http=require('http'),fs=require('fs'),path=require('path');
const E=require('./engine');
const PORT=process.env.PORT||3000, DATA=path.join(__dirname,'data.json'), TIME=600000;
let players={};try{players=JSON.parse(fs.readFileSync(DATA,'utf8'))}catch(e){}
const save=()=>fs.writeFile(DATA,JSON.stringify(players),()=>{});
const P=id=>players[id]||(players[id]={rating:200,balls:0});
const clients=new Map(), games=new Map(), current=new Map();
let waiting=null;
const code6=()=>Array.from({length:6},()=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.random()*32|0]).join('');
const send=(pid,ev,d)=>{const r=clients.get(pid);if(r)r.write(`event: ${ev}\ndata: ${JSON.stringify(d)}\n\n`)};
function snap(g,pid){const now=Date.now(),left={...g.left};
if(g.b&&!g.over)left[g.turn]=Math.max(0,left[g.turn]-(now-g.at));
return{id:g.id,board:g.board,turn:g.turn,over:g.over,my:g.w===pid?'w':g.b===pid?'b':null,joined:!!g.b,left,
legal:g.b&&!g.over&&g[g.turn]===pid?E.legal(g.board,g.turn==='w').map(m=>m):[]}}
function push(g){for(const pid of[g.w,g.b])if(pid){send(pid,'game',snap(g,pid));send(pid,'me',P(pid))}}
function newGame(w,b){const g={id:code6(),w,b,board:E.START.slice(),turn:'w',over:'',left:{w:TIME,b:TIME},at:Date.now()};
games.set(g.id,g);current.set(w,g.id);if(b)current.set(b,g.id);return g}
function finish(g,win){g.over=win;if(win!=='d'){const p=P(g[win]);p.rating+=50;p.balls+=1000;save()}push(g)}
setInterval(()=>{const now=Date.now();for(const g of games.values()){
if(g.b&&!g.over&&g.left[g.turn]-(now-g.at)<=0){g.left[g.turn]=0;finish(g,g.turn==='w'?'b':'w')}
if(now-g.at>36e5)games.delete(g.id)}},1000);
function api(p,b){const pid=String(b.pid||'').slice(0,40);if(!pid)return[400,{err:'pid'}];
if(p==='/api/random'){if(current.has(pid)&&games.get(current.get(pid))&&!games.get(current.get(pid)).over)return[200,{}];
if(waiting&&waiting!==pid&&clients.has(waiting)){const[a,c]=Math.random()<.5?[waiting,pid]:[pid,waiting];waiting=null;push(newGame(a,c));return[200,{}]}
waiting=pid;return[200,{wait:true}]}
if(p==='/api/cancel'){if(waiting===pid)waiting=null;return[200,{}]}
if(p==='/api/create'){const g=newGame(pid,null);push(g);return[200,{code:g.id}]}
if(p==='/api/join'){const g=games.get(String(b.code||'').toUpperCase());if(!g)return[404,{err:'Bunday xona yo’q'}];
if(g.w!==pid&&g.b!==pid){if(g.b)return[409,{err:'Xona to’la'}];g.b=pid;g.at=Date.now();current.set(pid,g.id)}
current.set(pid,g.id);push(g);return[200,{}]}
if(p==='/api/move'){const g=games.get(b.code);if(!g||g.over||!g.b||g[g.turn]!==pid)return[400,{err:'Navbat sizniki emas'}];
const f=+b.from,t=+b.to,w=g.turn==='w';
if(!E.legal(g.board,w).some(m=>m[0]===f&&m[1]===t))return[400,{err:'Noto’g’ri yurish'}];
const now=Date.now();g.left[g.turn]=Math.max(1,g.left[g.turn]-(now-g.at));g.at=now;
g.board=E.mk(g.board,[f,t]);g.turn=w?'b':'w';
if(!E.legal(g.board,!w).length){finish(g,E.chk(g.board,!w)?(w?'w':'b'):'d')}else push(g);return[200,{}]}
return[404,{err:'yo’q'}]}
http.createServer((req,res)=>{const u=new URL(req.url,'http://x');
if(req.method==='GET'&&u.pathname==='/events'){const pid=u.searchParams.get('pid')||'';if(!pid){res.writeHead(400);return res.end()}
res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache',Connection:'keep-alive'});
clients.set(pid,res);res.write('retry: 2000\n\n');send(pid,'me',P(pid));
const g=games.get(current.get(pid));if(g)send(pid,'game',snap(g,pid));
const hb=setInterval(()=>res.write(': ping\n\n'),20000);
req.on('close',()=>{clearInterval(hb);if(clients.get(pid)===res)clients.delete(pid);if(waiting===pid)waiting=null});return}
if(req.method==='POST'&&u.pathname.startsWith('/api/')){let s='';req.on('data',d=>{s+=d;if(s.length>2000)req.destroy()});
req.on('end',()=>{let b={};try{b=JSON.parse(s||'{}')}catch(e){}const[c,o]=api(u.pathname,b);res.writeHead(c,{'Content-Type':'application/json'});res.end(JSON.stringify(o))});return}
if(req.method==='GET'&&(u.pathname==='/'||u.pathname==='/index.html')){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return fs.createReadStream(path.join(__dirname,'public','index.html')).pipe(res)}
res.writeHead(404);res.end()}).listen(PORT,()=>console.log('http://localhost:'+PORT));
