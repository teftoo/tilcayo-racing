/* Tigrillo Kart Bolivia — game.js (Phaser 3.70)
   Estructura: index.html + game.js + assets/tigrillo.png */
const W=960,H=540,SEG=200,RW=2000,CD=.84,CH=1000,DRAW=200,LAPS=3,MAX=12000,HZ=H/2+2;
let g,spr;
const K={};
addEventListener('keydown',e=>{K[e.code]=1;if(e.code.startsWith('Arrow')||e.code=='Space')e.preventDefault();if(e.code=='Enter'&&!e.repeat)go()});
addEventListener('keyup',e=>K[e.code]=0);

/* ===== Escenarios de Bolivia (uno por vuelta) ===== */
const TH=[
{n:'Valle de Cochabamba',sky:['#2f7fd8','#8ec5f2','#e6f1f7'],sun:'#fffbe0',sx:.25,m:['#7d8aa8','#5d6f78','#4f6b45'],snow:0,cristo:1,
 g:['#6f9a3c','#668f37'],sh:'#b9a27a',rd:['#4a4b50','#44454a'],haze:'#dce9f0',obj:['euc','house','bush','euc','sign']},
{n:'Altiplano · Illimani',sky:['#22407c','#e98a5a','#ffd9a0'],sun:'#fff0c4',sx:.7,m:['#8a7a9a','#7a5f66','#6b5a3c'],snow:1,
 g:['#b39a5c','#a68d52'],sh:'#c9b17c',rd:['#48444a','#423e44'],haze:'#f3c79a',obj:['tuft','llama','tuft','hut','tuft','sign']},
{n:'Salar de Uyuni',sky:['#3d86d6','#9fcdf0','#eef7fb'],sun:'#ffffff',sx:.5,m:['#9aa9c4','#7f8fa8','#a9927a'],snow:0,mirror:1,
 g:['#f2f6f8','#e6edf1'],sh:'#dfe6ea',rd:['#8f9297','#878a90'],haze:'#f2f8fb',obj:['mound','flam','mound','post']}];
const SZ={euc:2.3,house:2.4,bush:1.6,tuft:1.1,llama:1.5,hut:2,mound:1.4,flam:1.3,post:1.3,sign:1.3};

/* ===== Objetos al costado del camino ===== */
const el=(x,y,rx,ry,c)=>{g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill()};
const OB={
euc(x,y,u){g.fillStyle='#b8a68a';g.fillRect(x-u*.012,y-u*.5,u*.024,u*.5);
 [[0,.62,.09],[-.05,.55,.07],[.05,.56,.07],[.02,.72,.07],[-.03,.68,.06]].forEach(([a,b,r])=>{el(x+a*u,y-b*u,r*u,r*u*1.5,'rgba(52,86,48,.96)');el(x+a*u-r*u*.25,y-b*u+r*u*.2,r*u*.7,r*u*1.1,'rgba(112,150,76,.75)')})},
house(x,y,u){g.fillStyle='#cfae80';g.fillRect(x-u*.16,y-u*.14,u*.32,u*.14);g.fillStyle='#b48f62';g.fillRect(x+u*.05,y-u*.14,u*.11,u*.14);
 g.fillStyle='#a8452a';g.beginPath();g.moveTo(x-u*.2,y-u*.14);g.lineTo(x-u*.11,y-u*.23);g.lineTo(x+u*.11,y-u*.23);g.lineTo(x+u*.2,y-u*.14);g.fill();
 g.fillStyle='#4a3220';g.fillRect(x-u*.08,y-u*.09,u*.05,u*.09);g.fillStyle='#e9e2cf';g.fillRect(x-u*.16,y-u*.02,u*.32,u*.02)},
bush(x,y,u){[[-.09,.07],[.09,.07],[0,.13]].forEach(([a,b])=>el(x+a*u,y-b*u,u*.09,u*.08,'#4d7d3a'));el(x-u*.02,y-u*.15,u*.04,u*.03,'rgba(255,255,255,.15)')},
tuft(x,y,u){g.lineWidth=Math.max(1,u*.012);for(let i=-3;i<=3;i++){g.strokeStyle=i%2?'#cdb96e':'#a8963f';g.beginPath();g.moveTo(x+i*u*.01,y);g.quadraticCurveTo(x+i*u*.025,y-u*.06,x+i*u*.045,y-u*.11+Math.abs(i)*u*.008);g.stroke()}},
llama(x,y,u,d){g.strokeStyle='#cbbfa6';g.lineWidth=Math.max(1,u*.02);[-.11,-.06,.06,.11].forEach(a=>{g.beginPath();g.moveTo(x+a*u,y-u*.13);g.lineTo(x+a*u,y);g.stroke()});
 el(x,y-u*.2,u*.16,u*.09,'#e9dfcb');el(x-d*u*.04,y-u*.21,u*.07,u*.05,'#9a7b58');
 g.strokeStyle='#e9dfcb';g.lineWidth=u*.05;g.beginPath();g.moveTo(x+d*u*.12,y-u*.23);g.lineTo(x+d*u*.17,y-u*.4);g.stroke();
 el(x+d*u*.19,y-u*.42,u*.045,u*.03,'#d8ccb4');g.fillStyle='#d8ccb4';g.fillRect(x+d*u*.18-u*.01,y-u*.5,u*.014,u*.05)},
hut(x,y,u){g.fillStyle='#a08d6c';g.fillRect(x-u*.13,y-u*.11,u*.26,u*.11);g.fillStyle='#cdb96f';g.beginPath();g.moveTo(x-u*.18,y-u*.1);g.lineTo(x,y-u*.24);g.lineTo(x+u*.18,y-u*.1);g.fill();g.fillStyle='#3b2c1c';g.fillRect(x-u*.03,y-u*.07,u*.06,u*.07)},
mound(x,y,u){g.fillStyle='#fff';g.beginPath();g.moveTo(x-u*.14,y);g.lineTo(x,y-u*.12);g.lineTo(x+u*.14,y);g.fill();g.fillStyle='#cfd9df';g.beginPath();g.moveTo(x,y-u*.12);g.lineTo(x+u*.14,y);g.lineTo(x+u*.02,y);g.fill()},
flam(x,y,u){[0,.11].forEach((a,k)=>{const X=x+a*u,s=k?.85:1;g.strokeStyle='#e58aa0';g.lineWidth=Math.max(1,u*.01);g.beginPath();g.moveTo(X,y);g.lineTo(X,y-u*.18*s);g.stroke();
 el(X,y-u*.22*s,u*.06*s,u*.035*s,'#f4a3b6');g.lineWidth=u*.018;g.beginPath();g.moveTo(X+u*.04*s,y-u*.23*s);g.quadraticCurveTo(X+u*.09*s,y-u*.3*s,X+u*.05*s,y-u*.36*s);g.stroke();el(X+u*.05*s,y-u*.37*s,u*.014,u*.014,'#333')})},
post(x,y,u){g.fillStyle='#777';g.fillRect(x-u*.008,y-u*.22,u*.016,u*.22);g.fillStyle='#1f7a4a';g.fillRect(x-u*.07,y-u*.3,u*.14,u*.09);g.fillStyle='#fff';g.fillRect(x-u*.05,y-u*.27,u*.1,u*.02)}};
OB.sign=OB.post;

/* ===== Pista ===== */
const segs=[];
const ease=(a,b,t)=>a+(b-a)*(-Math.cos(t*Math.PI)/2+.5),lerp=(a,b,p)=>a+(b-a)*p;
const lastY=()=>segs.length?segs[segs.length-1].p2.w.y:0;
function add(curve,y){const n=segs.length;segs.push({i:n,curve,dark:Math.floor(n/4)%2,spr:[],cars:[],clip:H,vis:0,p1:{w:{y:lastY(),z:n*SEG},c:{},s:{}},p2:{w:{y,z:(n+1)*SEG},c:{},s:{}}})}
function road(en,ho,le,curve,dy){const M=3;en*=M;ho*=M;le*=M;const sy=lastY(),ey=sy+dy*SEG,tot=en+ho+le;
 for(let n=0;n<en;n++)add(ease(0,curve,n/en),ease(sy,ey,n/tot));
 for(let n=0;n<ho;n++)add(curve,ease(sy,ey,(en+n)/tot));
 for(let n=0;n<le;n++)add(ease(curve,0,n/le),ease(sy,ey,(en+ho+n)/tot))}
road(25,25,25,0,0);road(30,40,30,3,20);road(20,30,20,-4,-15);road(20,20,20,4,0);road(20,20,20,-4,0);
road(25,25,25,0,30);road(30,40,30,-3,-30);road(25,30,25,2,0);road(20,20,20,-2,-5);road(25,25,25,0,0);
const N=segs.length,LEN=N*SEG,PZ=CH*CD;
for(let i=6;i<N;i+=5){const s=Math.random()<.5?-1:1;
 segs[i].spr.push({o:s*(1.4+Math.random()*1.6),r:Math.random(),k:.8+Math.random()*.5});
 if(Math.random()<.5)segs[i].spr.push({o:-s*(1.5+Math.random()*2),r:Math.random(),k:.8+Math.random()*.5})}

/* ===== Items: semillas, fuego, turbo ===== */
const ITEMS=[];
const LAPMSG=['Tilcayo: ¡Siento humo! Esquiva las llamas del camino.','Tilcayo: ¡Casi llegamos! Cada semilla es un árbol nuevo.'];
function put(i,o,k){const s=segs[i%N];s.it=s.it||[];const it={o,k,got:0};s.it.push(it);ITEMS.push(it)}
for(let i=12;i<N-10;i+=60){const lane=[-.6,0,.6][Math.floor(Math.random()*3)];for(let j=0;j<5;j++)put(i+j*2,lane,'seed')}
for(let i=40;i<N-10;i+=90)put(i,[-.5,.5][Math.floor(Math.random()*2)],'fire');
for(let i=70;i<N-10;i+=150)put(i,0,'boost');
const live=it=>!it.got&&(it.k!='fire'||lap>1);
function say(m,d){msg=m;msgT=d||4}
function drawIt(it,x,y,u){
 const b=Math.sin(t*5+it.o*9)*u*.02;
 if(it.k=='seed'){const r=Math.max(2,u*.045),cy=y-u*.1+b;
  el(x,cy,r*2.2,r*2.6,'rgba(190,255,150,.28)');el(x,cy,r,r*1.3,'#6ddc3a');el(x-r*.3,cy-r*.45,r*.32,r*.45,'#eaffcf');
  g.strokeStyle='#2d8a1e';g.lineWidth=Math.max(1,r*.18);g.beginPath();g.moveTo(x,cy-r*1.2);g.lineTo(x+r*.5,cy-r*1.9);g.stroke()}
 else if(it.k=='fire'){const h=u*.24,w=u*.09,f=Math.sin(t*14+it.o*7)*.25;
  el(x,y,w*1.3,w*.35,'rgba(0,0,0,.35)');
  [[1,'#ff4a1a'],[.72,'#ff9a1a'],[.44,'#ffe14a']].forEach(([s,c])=>{g.fillStyle=c;g.beginPath();g.moveTo(x-w*s,y);g.quadraticCurveTo(x-w*s*1.1,y-h*s*.6,x+f*w*s,y-h*s);g.quadraticCurveTo(x+w*s*1.1,y-h*s*.6,x+w*s,y);g.closePath();g.fill()})}
 else{const w=u*.22,h=u*.07;g.fillStyle='#1b2a3a';g.fillRect(x-w,y-h,w*2,h);g.fillStyle=(Math.floor(t*8)%2)?'#ffe94a':'#ff8a00';
  g.beginPath();g.moveTo(x-w*.6,y-h*.15);g.lineTo(x,y-h*.9);g.lineTo(x+w*.6,y-h*.15);g.lineTo(x+w*.3,y-h*.15);g.lineTo(x,y-h*.5);g.lineTo(x-w*.3,y-h*.15);g.closePath();g.fill()}
}
/* ===== Estado ===== */
let seeds=0,boost=0,flash=0,pop=0,msg='',msgT=0;let state='menu',lap=1,pos=0,speed=0,px=0,cd=3,theme=0,toast=0,fin=0,off=0,shake=0,steer=0,t=0;
const cars=[];
const clouds=Array.from({length:8},(_,i)=>({x:i*190,y:35+Math.random()*130,s:.7+Math.random()*.8}));
function reset(){seeds=0;boost=0;flash=0;msgT=0;ITEMS.forEach(i=>i.got=0);lap=1;pos=0;speed=0;px=0;cd=3.4;theme=0;toast=0;fin=0;cars.length=0;
 [[3,-.45,.72,'#38cfc4','#e9e2d3'],[1.5,.45,.68,'#8f6bff','#5b4636'],[-2,0,.64,'#ff5da8','#f4e4c8']].forEach(([s,x,b,c,f],i)=>{const d=PZ+s*SEG;cars.push({d,z:d,x,x0:x,b,c,f,v:0,ph:i*2})})}
const pd=()=>(lap-1)*LEN+pos+PZ, rank=()=>1+cars.filter(c=>c.d>pd()).length, ord=n=>['','1ro','2do','3ro','4to'][n];
const NAME='Tilcayo';
const STORY=[
 {t:'Me llamo '+NAME,l:['¡Hola! Soy '+NAME+', un tigrillo de los','bosques de Bolivia.','Me encanta correr entre los árboles','y mirar las estrellas…']},
 {t:'La noche del fuego',c:'#3a0800cc',l:['Una noche el cielo se puso naranja.','El fuego avanzó y el humo lo cubrió todo.','Corrí y corrí… y perdí mi bosque.']},
 {t:'Alguien me encontró',l:['Unos rescatistas me encontraron asustado','y con hambre. Me curaron, me dieron','este kart… y una misión muy importante.']},
 {t:'Mi misión',c:'#062a10cc',l:['Recorrer Bolivia recogiendo SEMILLAS.','Cada semilla es un árbol nuevo para','reforestar mi hogar. ¡Ayúdame!','Ojo: desde la vuelta 2 habrá llamas.']},
 {t:'Lo que debes saber',l:['Los tigrillos no son mascotas: viven libres.','Hoy están en peligro por los incendios,','la tala y el tráfico de fauna.','Si ves fauna herida, avisa a las autoridades.']},
 {t:'Tú también puedes',l:['No hagas quemas en el monte y nunca','compres animales silvestres.','Controles: ← → girar, ↑ acelerar.','¿Listo? ¡Arranquemos!']}
];
let sPg=0,sCh=0;
const STORY_OLD=[
 {t:'Conoce a '+NAME,l:['En lo profundo de Bolivia vive un pequeño','tigrillo llamado '+NAME+'.','Es curioso, veloz y muy valiente…','pero hoy está lejos de casa.']},
 {t:'¿Qué le pasó?',l:['Los incendios y la tala del bosque le','quitaron su hogar. Fue rescatado y ahora','corre por Bolivia para mostrar que su','tierra sigue siendo hermosa.']},
 {t:'Un viaje por Bolivia',l:['Cruzará el Valle de Cochabamba, el altiplano','bajo el Illimani y el Salar de Uyuni.','Tres paisajes… ¡y un solo hogar!']},
 {t:'Un animal que hay que cuidar',l:['Los tigrillos son felinos silvestres,','no son mascotas. Su hogar se reduce por la','pérdida del bosque y el tráfico de fauna.','Nunca compres ni te lleves animales del monte.']},
 {t:'¿Cómo puedes ayudar?',l:['Si ves fauna herida, avisa a las autoridades','ambientales. Evita las quemas, cuida el bosque','y comparte la historia de '+NAME+'.','¿Listo para ayudarlo a llegar a la meta?']}
];
function go(){
 if(state=='menu'){sPg=0;sCh=0;state='story'}
 else if(state=='story'){
  if(sCh<STORY[sPg].l.join('\n').length)sCh=999;
  else if(++sPg>=STORY.length){reset();state='count'}
  else sCh=0}
 else if(state=='done'){reset();state='count'}
}
reset();
const idx=z=>Math.floor(z/SEG)%N;

/* ===== Lógica ===== */
function update(dt,touch){
 t+=dt;if(state=='story')sCh+=dt*40;const ps=segs[idx(pos+PZ)];let sp=speed/MAX;
 if(state=='menu'||state=='story'){speed=MAX*.35;px=Math.sin(t*.6)*.4;steer=0}
 else if(state=='count'){cd-=dt;if(cd<=0){state='race';toast=2.5;say('Tilcayo: ¡Recoge semillas para reforestar mi hogar!',5)}}
 else{
  const L=K.ArrowLeft||K.KeyA||touch.l,R=K.ArrowRight||K.KeyD||touch.r,A=K.ArrowUp||K.KeyW||K.Space||touch.a,B=K.ArrowDown||K.KeyS;
  if(state=='race'){
   const dx=dt*2*sp;steer=(R?1:0)-(L?1:0);px+=steer*dx;px-=dx*sp*ps.curve*.3;
   speed+=(A?MAX/5:B?-MAX*.8:-MAX/8)*dt;if(boost>0)speed+=MAX*.8*dt;
   if((px<-1||px>1)&&speed>MAX/4){speed=Math.max(MAX/4,speed-MAX*.6*dt);shake=Math.max(shake,.1)}
   segs[idx(pos+PZ)].spr.forEach(s=>{if(Math.abs(px-s.o)<.22&&speed>MAX*.12){speed=MAX*.1;shake=.45;px+=px>s.o?.25:-.25}});
   px=Math.max(-2.6,Math.min(2.6,px));[ps,segs[(ps.i+N-1)%N]].forEach(s=>(s.it||[]).forEach(it=>{if(!live(it)||Math.abs(px-it.o)>.3)return;it.got=1;if(it.k=='seed'){seeds++;pop=.3}else if(it.k=='fire'){speed=Math.min(speed,MAX*.3);shake=.5;flash=.35;say('¡Auch! Las llamas queman. Esquívalas.')}else{boost=1.3;say('¡TURBO!',1.2)}}));
  }else{speed+=(MAX*.3-speed)*dt;px*=1-dt;steer=0}
  speed=Math.max(0,Math.min(boost>0?MAX*1.35:MAX,speed));
 }
 if(state!='count'){pos+=dt*speed;
  if(pos>=LEN){pos-=LEN;if(state=='race'){lap++;ITEMS.forEach(i=>i.got=0);if(lap>LAPS){state='done';fin=rank();lap=LAPS}else{theme=lap-1;toast=2.5;say(LAPMSG[lap-2])}}}}
 sp=speed/MAX;off+=ps.curve*sp*dt*90;shake=Math.max(0,shake-dt);toast=Math.max(0,toast-dt);boost=Math.max(0,boost-dt);flash=Math.max(0,flash-dt);pop=Math.max(0,pop-dt);msgT=Math.max(0,msgT-dt);
 cars.forEach(c=>{if(state=='count')return;
  c.v=c.b*MAX*(1+Math.max(-.1,Math.min(.1,(pd()-c.d)/(SEG*100))))*(1-Math.abs(segs[idx(c.z)].curve)*.03);
  c.d+=c.v*dt;c.z=c.d%LEN;c.x=c.x0+Math.sin(t*.5+c.ph)*.28;
  const dz=((c.z-(pos+PZ)+LEN*1.5)%LEN)-LEN/2;
  if(state=='race'&&Math.abs(dz)<SEG*.55&&Math.abs(c.x-px)<.3&&speed>c.v){speed=c.v*.85;shake=.25;px+=(px>c.x?1:-1)*.05}});
}

/* ===== Dibujo ===== */
function poly(a,b,c,d,e,f,h,i,col){g.fillStyle=col;g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.lineTo(e,f);g.lineTo(h,i);g.closePath();g.fill()}
function proj(p,cx,cy,cz){p.c.z=p.w.z-cz;const sc=CD/p.c.z;p.s.sc=sc;p.s.x=Math.round(W/2+sc*-cx*W/2);p.s.y=Math.round(H/2-sc*(p.w.y-cy)*W/2);p.s.w=Math.round(sc*RW*W/2);p.s.fx=W/2+sc*-cx*W/2;p.s.fy=H/2-sc*(p.w.y-cy)*W/2;p.s.fw=sc*RW*W/2}
const ridge=(x,amp,f,ph,o)=>{const u=(x+o)*f+ph;return amp*(.55*Math.abs(Math.sin(u))+.3*Math.abs(Math.sin(u*2.3+1))+.15*Math.abs(Math.sin(u*5.1)))};
function mtn(T,amp,f,ph,col,snow,o){g.save();g.beginPath();g.moveTo(0,HZ);
 {const s0=(((-o)%4)+4)%4-4;for(let x=s0;x<=W+4;x+=4)g.lineTo(x,HZ-ridge(x,amp,f,ph,o))}g.lineTo(W,HZ);g.closePath();
 const gr=g.createLinearGradient(0,HZ-amp,0,HZ);gr.addColorStop(0,col);gr.addColorStop(1,T.haze);g.fillStyle=gr;g.fill();g.clip();
 if(snow){g.fillStyle='rgba(248,250,255,.95)';g.fillRect(0,0,W,HZ-amp*.62)}
 {const s1=(((-o)%4)+4)%4-4;for(let x=s1;x<=W+4;x+=4){const r0=ridge(x,amp,f,ph,o),d=(ridge(x+4,amp,f,ph,o)-ridge(x-4,amp,f,ph,o))/8;g.fillStyle=d>0?'rgba(255,240,205,'+Math.min(.3,d*.45)+')':'rgba(18,24,58,'+Math.min(.38,-d*.55)+')';g.fillRect(x,HZ-r0,4,r0)}}g.lineWidth=2;
 for(let x=(((-o)%24)+24)%24-24;x<=W;x+=24){const y=HZ-ridge(x,amp,f,ph,o);}
 g.restore()}
function sky(T,nc){const gr=g.createLinearGradient(0,0,0,H/2);gr.addColorStop(0,T.sky[0]);gr.addColorStop(.65,T.sky[1]);gr.addColorStop(1,T.sky[2]);g.fillStyle=gr;g.fillRect(0,0,W,HZ);
 const sx=((T.sx*W-off*.15)%(W+300)+W+300)%(W+300)-150,sg=g.createRadialGradient(sx,110,8,sx,110,170);
 sg.addColorStop(0,T.sun);sg.addColorStop(.2,T.sun);sg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=sg;g.fillRect(sx-180,0,360,290);
 if(!nc)clouds.forEach(c=>{const x=((c.x-off*.4+t*6)%(W+400)+W+400)%(W+400)-200;
  [[0,0,40],[38,-8,32],[-38,4,28],[70,6,24],[-70,8,20]].forEach(([a,b,r])=>{const X=x+a*c.s,Y=c.y+b*c.s,R=r*c.s,cg=g.createRadialGradient(X,Y,0,X,Y,R);
   cg.addColorStop(0,'rgba(255,255,255,.75)');cg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=cg;g.save();g.translate(0,Y*.4);g.scale(1,.6);g.translate(0,-Y);g.fillRect(X-R,Y-R,R*2,R*2);g.restore()})})}
function land(T){mtn(T,T.snow?270:190,.0042,1,T.m[0],T.snow||0,off*.5);mtn(T,140,.0075,3,T.m[1],0,off);
 if(T.cristo){const x=((W*.72-off)%(W+200)+W+200)%(W+200)-100,y=HZ-ridge(x,140,.0075,3,off);
  g.fillStyle='#f4f1ea';g.fillRect(x-2,y-20,4,20);g.fillRect(x-11,y-17,22,3);el(x,y-23,3,3.5,'#f4f1ea')}
 mtn(T,48,.016,5,T.m[2],0,off*2);if(T.cristo)forest(T)}
function forest(T){const o=off*2.6,s0=(((-o)%16)+16)%16-16;
 for(let x=s0;x<=W+16;x+=16){const k=Math.floor((x+o)/16),h=8+Math.abs(Math.sin(k*12.9))*10;
  el(x,HZ-h*.5,7,h*.6+3,'#3f6a35');el(x-1.5,HZ-h*.6,4,h*.5,'#5c8a44')}}function forest(T){const o=off*2.6,s0=(((-o)%16)+16)%16-16;
 for(let x=s0;x<=W+16;x+=16){const k=Math.floor((x+o)/16),h=8+Math.abs(Math.sin(k*12.9))*10;
  el(x,HZ-h*.5,7,h*.6+3,'#3f6a35');el(x-1.5,HZ-h*.6,4,h*.5,'#5c8a44')}}function kart(x,y,u,c,f){g.save();g.translate(x,y);el(0,0,u*.62,u*.12,'rgba(0,0,0,.3)');
 g.fillStyle='#15151b';g.fillRect(-u*.58,-u*.32,u*.22,u*.32);g.fillRect(u*.36,-u*.32,u*.22,u*.32);
 g.fillStyle=c;g.fillRect(-u*.44,-u*.46,u*.88,u*.3);g.fillRect(-u*.5,-u*.6,u,u*.07);el(0,-u*.66,u*.25,u*.25,f);
 g.fillStyle=f;g.beginPath();g.moveTo(-u*.24,-u*.78);g.lineTo(-u*.14,-u);g.lineTo(-u*.04,-u*.86);g.moveTo(u*.24,-u*.78);g.lineTo(u*.14,-u);g.lineTo(u*.04,-u*.86);g.fill();g.restore()}
function txt(s,x,y,sz,al,fill){g.font='900 '+sz+'px Impact,"Arial Black",system-ui,sans-serif';g.textAlign=al||'left';g.lineJoin='round';g.lineWidth=sz/7;g.strokeStyle='#1b2a3a';g.strokeText(s,x,y);g.fillStyle=fill||'#ffe94a';g.fillText(s,x,y)}

function render(){
 const T=TH[theme%3],ps=segs[idx(pos+PZ)];
 sky(T);land(T);
 g.fillStyle=T.g[0];g.fillRect(0,HZ,W,H);
 if(T.mirror){g.save();g.beginPath();g.rect(0,HZ,W,H);g.clip();g.globalAlpha=.6;g.translate(0,2*HZ);g.scale(1,-1);sky(T,1);land(T);g.restore();g.fillStyle=T.g[0]+'66';g.fillRect(0,HZ,W,H)}
 const base=segs[idx(pos)],bp=(pos%SEG)/SEG,pp=((pos+PZ)%SEG)/SEG;
 const camY=CH+lerp(ps.p1.w.y,ps.p2.w.y,pp)+(shake>0?(Math.random()-.5)*shake*30:0);
 let maxy=H,x=0,dx=-(base.curve*bp);
 for(let n=0;n<DRAW;n++){const ii=base.i+n,seg=segs[ii%N],lp=ii>=N?LEN:0;
  proj(seg.p1,px*RW-x,camY,pos-lp);proj(seg.p2,px*RW-x-dx,camY,pos-lp);x+=dx;dx+=seg.curve;
  seg.clip=maxy;seg.vis=0;const a=seg.p1.s,b=seg.p2.s;
  if(seg.p1.c.z<=CD||b.y>=a.y||b.y>=maxy)continue;
  seg.vis=1;
  if(!T.mirror){g.fillStyle=(seg.dark&&n<80)?T.g[1]:T.g[0];g.fillRect(0,b.y,W,a.y-b.y)}
  poly(a.x-a.w*1.18,a.y,a.x+a.w*1.18,a.y,b.x+b.w*1.18,b.y,b.x-b.w*1.18,b.y,T.sh);
  poly(a.x-a.w,a.y,a.x+a.w,a.y,b.x+b.w,b.y,b.x-b.w,b.y,(seg.dark&&n<80)?T.rd[0]:T.rd[1]);
  [-1,1].forEach(s=>poly(a.x+s*a.w*.93,a.y,a.x+s*a.w*.96,a.y,b.x+s*b.w*.96,b.y,b.x+s*b.w*.93,b.y,'#f2f2f2'));
  [-.025,.025].forEach(q=>{const l1=a.w*.008,l2=b.w*.008,c1=a.x+a.w*q,c2=b.x+b.w*q;poly(c1-l1,a.y,c1+l1,a.y,c2+l2,b.y,c2-l2,b.y,'#f2c21a')});
  if(seg.i<2)for(let k=0;k<10;k++){const q1=k/5-1,q2=(k+1)/5-1;poly(a.x+a.w*q1,a.y,a.x+a.w*q2,a.y,b.x+b.w*q2,b.y,b.x+b.w*q1,b.y,(k+seg.i)%2?'#fff':'#111')}
  maxy=a.y}
 let gr=g.createLinearGradient(0,H/2-70,0,H/2+130);gr.addColorStop(0,T.haze+'00');gr.addColorStop(.35,T.haze);gr.addColorStop(1,T.haze+'00');g.globalAlpha=.7;g.fillStyle=gr;g.fillRect(0,H/2-70,W,200);g.globalAlpha=1;
 segs.forEach(s=>s.cars.length=0);cars.forEach(c=>segs[idx(c.z)].cars.push(c));
 for(let n=DRAW-1;n>=0;n--){const seg=segs[(base.i+n)%N];if(seg.p1.c.z<=CD)continue;const a=seg.p1.s,b=seg.p2.s;
  g.save();g.beginPath();g.rect(0,0,W,seg.clip);g.clip();g.globalAlpha=Math.min(1,(DRAW*SEG-seg.p1.c.z)/(SEG*40));
  seg.spr.forEach(s=>{const type=T.obj[Math.floor(s.r*T.obj.length)];OB[type](a.fx+s.o*a.fw,a.fy,a.fw*s.k*SZ[type],s.o<0?1:-1)});(seg.it||[]).forEach(it=>{if(live(it))drawIt(it,a.fx+it.o*a.fw,a.fy,a.fw)});
  seg.cars.forEach(c=>{const p=(c.z%SEG)/SEG;kart(lerp(a.fx,b.fx,p)+c.x*lerp(a.fw,b.fw,p),lerp(a.fy,b.fy,p),lerp(a.fw,b.fw,p)*.36,c.c,c.f)});
  g.restore()}
 const sp=speed/MAX;
 if(sp>.7){g.strokeStyle='rgba(255,255,255,.2)';g.lineWidth=2;for(let i=0;i<12;i++){const a=(i*137.5+t*900)%360*Math.PI/180,r1=380+((i*53+t*700)%140),r2=r1+60+sp*60;g.beginPath();g.moveTo(W/2+Math.cos(a)*r1*1.3,H/2+Math.sin(a)*r1*.6);g.lineTo(W/2+Math.cos(a)*r2*1.3,H/2+Math.sin(a)*r2*.6);g.stroke()}}
 {const pw=250,y=H-46+(sp>0?Math.sin(t*38)*sp*2.2:0);
  g.save();g.translate(W/2+steer*16,y);el(0,0,pw*.42,14,'rgba(0,0,0,.3)');g.rotate(steer*.05);
  if(spr&&spr.width)g.drawImage(spr,-pw/2,-pw*spr.height/spr.width+8,pw,pw*spr.height/spr.width);else kart(0,0,150,'#ff8a00','#c98a3a');g.restore()}
 gr=g.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,H*.95);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.35)');g.fillStyle=gr;g.fillRect(0,0,W,H);
 /* HUD */
 g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.roundRect(14,12,220,106,16);g.fill();
 txt(ord(state=='done'?fin:rank()),28,72,60);txt('Vuelta '+lap+'/'+LAPS,30,104,24,'left','#fff');
 txt(Math.round(sp*180)+' km/h',W-30,H-34,32,'right','#fff');
 for(let i=0;i<8;i++){g.fillStyle=i<sp*8?(i>5?'#ff5040':'#ffe94a'):'#ffffff30';g.fillRect(W-30-8*22+i*22,H-26,18,10)}
 if(toast>0&&state=='race'){g.globalAlpha=Math.min(1,toast);txt(T.n,W/2,90,42,'center','#fff');g.globalAlpha=1}
 if(state=='count')txt(cd>.4?String(Math.ceil(cd-.4)):'¡YA!',W/2,H/2-30,120,'center');
 if(state=='menu'||state=='done'){g.fillStyle='#000a';g.fillRect(0,0,W,H);
  txt(state=='menu'?'TIGRILLO KART':'¡META!',W/2,H/2-30,84,'center');
  txt(state=='menu'?'BOLIVIA':'Terminaste en '+ord(fin),W/2,H/2+36,44,'center','#fff');
  txt((matchMedia('(pointer:coarse)').matches?'Toca':'Enter')+' para '+(state=='menu'?'empezar':'reiniciar'),W/2,H/2+104,30,'center','#fff')}
}

function drawExtra(){
 if(state=='race'||state=='done'||state=='count'){
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.roundRect(W-214,12,200,52,16);g.fill();
  el(W-190,38,11,14,'#6ddc3a');el(W-193,33,3.5,5,'#eaffcf');
  txt('x '+seeds,W-165,52,34+Math.round(pop*40),'left','#fff');
 }
 if(flash>0){g.fillStyle='rgba(255,60,20,'+Math.min(.45,flash)+')';g.fillRect(0,0,W,H)}
 if(msgT>0&&state=='race'){g.globalAlpha=Math.min(1,msgT*2);g.font='700 24px system-ui,sans-serif';const w=g.measureText(msg).width+40;
  g.fillStyle='rgba(0,0,0,.6)';g.beginPath();g.roundRect(W/2-w/2,130,w,46,23);g.fill();
  g.fillStyle='#fff';g.textAlign='center';g.fillText(msg,W/2,161);g.globalAlpha=1}
}function drawStory(){drawExtra();
 if(state=='story'){
  g.fillStyle=(STORY[sPg]||{}).c||'#000b';g.fillRect(0,0,W,H);
  if(sPg==1){g.fillStyle='rgba(255,'+(90+Math.floor(Math.sin(t*9)*40))+',20,.18)';g.fillRect(0,0,W,H)}const P=STORY[sPg],full=P.l.join('\n'),n=Math.min(full.length,Math.floor(sCh)),shown=full.slice(0,n).split('\n');
  g.fillStyle='rgba(255,255,255,.96)';g.beginPath();g.roundRect(80,90,W-160,330,28);g.fill();
  txt(P.t,W/2,155,42,'center','#ff8a00');
  g.font='600 26px system-ui,sans-serif';g.textAlign='center';g.fillStyle='#1b2a3a';
  shown.forEach((s,i)=>g.fillText(s,W/2,215+i*38));
  STORY.forEach((_,i)=>el(W/2-(STORY.length-1)*12+i*24,395,i==sPg?7:4,i==sPg?7:4,i==sPg?'#ff8a00':'#c9c9c9'));
  if(spr&&spr.width){const w=140,h=w*spr.height/spr.width;g.drawImage(spr,W-80-w-20,455-h,w,h)}
  if(Math.sin(t*5)>0)txt((matchMedia('(pointer:coarse)').matches?'Toca':'Enter')+' para continuar',W/2,485,24,'center','#fff');
 }
 if(state=='done'){txt('Plantaste '+seeds+' árboles para '+NAME,W/2,H/2+150,30,'center','#8dff5a');txt('Cuida a '+NAME+' y a toda la fauna de Bolivia',W/2,H/2+190,22,'center','#fff')}
}

/* ===== Phaser ===== */
class Main extends Phaser.Scene{
 preload(){this.load.svg('tigrillo','assets/tigrillo.svg',{width:600,height:560})}
 create(){
  this.cv=this.textures.createCanvas('view',W,H);g=this.cv.context;
  this.add.image(0,0,'view').setOrigin(0);
  spr=this.textures.exists('tigrillo')?this.textures.get('tigrillo').getSourceImage():null;
  this.input.addPointer(2);this.input.on('pointerdown',go);
 }
 update(_,delta){
  const ps=this.input.manager.pointers.filter(p=>p.isDown),touch={a:ps.length>0,l:ps.some(p=>p.x<W*.4),r:ps.some(p=>p.x>W*.6)};
  update(Math.min(.033,delta/1000),touch);render();drawStory();this.cv.refresh();
 }
}
new Phaser.Game({type:Phaser.AUTO,width:W,height:H,parent:document.body,backgroundColor:'#111',
 scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:Main});