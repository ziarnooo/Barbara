'use strict';
const $ = id => document.getElementById(id);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = $('fx'), ctx = canvas.getContext('2d');
let particles = [], frame = 0, last = 0;
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
addEventListener('resize', resize); resize();
const colors=['#e8b64b','#bd402f','#3c8263','#efa0b2','#76b8d8','#fff3c4'];
function burst(x,y,count=70,firework=false){
 if(reduceMotion)return;
 for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=firework?Math.random()*5+2:Math.random()*8+3;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(firework?0:3),life:1,decay:firework?.012:.004+Math.random()*.003,c:colors[Math.floor(Math.random()*colors.length)],r:Math.random()*Math.PI,size:Math.random()*6+3,firework});}
 if(!frame){last=performance.now();frame=requestAnimationFrame(draw);}
}
function draw(t){const dt=Math.min((t-last)/16.67,2);last=t;ctx.clearRect(0,0,canvas.width,canvas.height);particles=particles.filter(p=>p.life>0&&p.y<canvas.height+30);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.firework?.025:.065)*dt;p.vx*=.995;p.r+=.04*dt;p.life-=p.decay*dt;ctx.save();ctx.globalAlpha=Math.min(1,p.life*2);ctx.fillStyle=p.c;ctx.translate(p.x,p.y);ctx.rotate(p.r);if(p.firework){ctx.beginPath();ctx.arc(0,0,2,0,Math.PI*2);ctx.fill();}else ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.55);ctx.restore();}frame=particles.length?requestAnimationFrame(draw):0;}
function party(){burst(innerWidth*.2,innerHeight*.45,95);burst(innerWidth*.8,innerHeight*.4,95);for(let i=0;i<5;i++)setTimeout(()=>burst(innerWidth*(.15+Math.random()*.7),innerHeight*(.12+Math.random()*.45),60,true),300+i*450);}

const audio=$('birthday-audio');
let mutedByUser=false;
audio.volume=1;
function updateMusic(){const playing=!audio.paused;$('music').textContent=playing?'♫ Wyłącz muzykę':'♪ Włącz „Sto lat”';$('music').setAttribute('aria-pressed',String(playing));$('music').setAttribute('aria-label',playing?'Wyłącz melodię Sto lat':'Włącz melodię Sto lat');}
function play(){if(mutedByUser)return;const result=audio.play();if(result)result.then(updateMusic).catch(()=>updateMusic());}
for(const event of ['play','pause','ended'])audio.addEventListener(event,updateMusic);
$('music').addEventListener('click',()=>{if(!audio.paused){mutedByUser=true;audio.pause();}else{mutedByUser=false;play();}});
// Retry directly within a real user gesture, including on iOS; never override mute.
for(const event of ['pointerdown','touchend','keydown'])document.addEventListener(event,e=>{if(e.target.closest?.('#music'))return;if(audio.paused&&!mutedByUser)play();},{passive:true});
$('unwrap').addEventListener('click',()=>{play();$('unwrap').setAttribute('aria-expanded','true');$('unwrap').hidden=true;$('voucher').hidden=false;$('gift-note').hidden=false;$('voucher').setAttribute('tabindex','-1');$('voucher').focus({preventScroll:true});party();$('announcement').textContent='Niespodzianka! Voucher na 600 zł na wycieczkę do Włoch, od męża Wojtka, Jaśka, Kacpra, Dominika i Marty.';});
const portrait=document.querySelector('.portrait');
function photoMagic(){play();portrait.classList.remove('pop');void portrait.offsetWidth;portrait.classList.add('pop');setTimeout(()=>portrait.classList.remove('pop'),1050);if(reduceMotion)return;const r=portrait.getBoundingClientRect();for(let i=0;i<12;i++){const heart=document.createElement('span');heart.className='heart';heart.textContent=['♡','♥','✨'][i%3];heart.style.cssText=`left:${r.left+r.width*(.15+Math.random()*.7)}px;top:${r.top+r.height*.65}px;--drift:${Math.random()*180-90}px;color:${colors[i%colors.length]}`;document.body.append(heart);setTimeout(()=>heart.remove(),2500);}}
portrait.addEventListener('click',photoMagic);portrait.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();photoMagic();}});
let skyTimer;
$('again').addEventListener('click',()=>{play();party();const sky=$('sky');clearTimeout(skyTimer);sky.replaceChildren();if(!reduceMotion)for(let i=0;i<25;i++){const b=document.createElement('span');b.className='balloon';b.style.cssText=`--x:${Math.random()*95}%;--color:${colors[i%colors.length]};--duration:${5+Math.random()*3}s;--delay:${Math.random()*1.5}s;--drift:${Math.random()*120-60}px`;sky.append(b);}const message=document.createElement('div');message.className='sky-message';message.append('Kochamy Cię, Mamo!');const small=document.createElement('small');small.textContent='Wojtek, Jasiek, Kacper, Dominik i Marta ♡';message.append(small);sky.append(message);$('announcement').textContent='Kochamy Cię, Mamo!';skyTimer=setTimeout(()=>sky.replaceChildren(),10000);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause();else play();});
play();
setTimeout(()=>burst(innerWidth*.5,30,70),600);
