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
audio.volume=.8;
function updateMusic(){const playing=!audio.paused;$('music').textContent=playing?'♫ Wyłącz muzykę':'♪ Tanti auguri a te';$('music').setAttribute('aria-pressed',String(playing));$('music').setAttribute('aria-label',playing?'Wyłącz melodię Tanti auguri a te':'Włącz melodię Tanti auguri a te');}
function play(){if(mutedByUser)return;const result=audio.play();if(result)result.then(updateMusic).catch(()=>updateMusic());}
for(const event of ['play','pause','ended'])audio.addEventListener(event,updateMusic);
$('music').addEventListener('click',()=>{if(!audio.paused){mutedByUser=true;audio.pause();}else{mutedByUser=false;play();}});
// Retry directly within a real user gesture, including on iOS; never override mute.
for(const event of ['pointerdown','touchend','keydown'])document.addEventListener(event,e=>{if(e.target.closest?.('#music'))return;if(audio.paused&&!mutedByUser)play();},{passive:true});
function suns(){if(reduceMotion)return;const r=portrait.getBoundingClientRect();for(let i=0;i<10;i++){const el=document.createElement('span');el.className='sun-particle';el.textContent=i%3?'☀️':'🌞';el.style.cssText=`left:${r.left+r.width*(.2+Math.random()*.6)}px;top:${r.top+r.height*.6}px;--drift:${Math.random()*260-130}px`;el.setAttribute('aria-hidden','true');document.body.append(el);setTimeout(()=>el.remove(),2300);}}
function spectacle(final=false){party();const sky=$('sky');clearTimeout(skyTimer);sky.replaceChildren();if(!reduceMotion){for(let i=0;i<(final?36:18);i++){const b=document.createElement('span');b.className='balloon';b.style.cssText=`--x:${Math.random()*95}%;--color:${['#32875c','#fff8e2','#c54335','#e8b64b'][i%4]};--duration:${4+Math.random()*3}s;--delay:${Math.random()}s;--drift:${Math.random()*120-60}px`;sky.append(b);}for(let i=0;i<18;i++){const f=document.createElement('span');f.className='flag-fall';f.textContent=i%3?'🇮🇹':'☀️';f.style.cssText=`left:${Math.random()*95}%;--drift:${Math.random()*120-60}px;animation-delay:${Math.random()*1.5}s`;sky.append(f);}}if(final){const m=document.createElement('div');m.className='sky-message';m.textContent='Buon compleanno, Mamo!';sky.append(m);}skyTimer=setTimeout(()=>sky.replaceChildren(),8500);}

const portrait=document.querySelector('.portrait');
let phase='closed',tapTimes=[],tapReset,skyTimer,rotation=0,spinFrame=0,sfx;
function say(title,detail){$('quest-title').textContent=title;$('quest-detail').textContent=detail;$('announcement').textContent=title;}
function onPhoto(){play();suns();if(phase==='closed'){phase='tapping';portrait.classList.remove('wrapped');portrait.classList.add('active-gift');portrait.setAttribute('aria-label','Naciśnij zdjęcie szybko trzy razy');$('gift-badge').innerHTML='<b>A teraz szybko 3 razy!</b><span>Naciśnij zdjęcie i odkryj niespodziankę ☀️</span>';$('photo-instruction').textContent='Jeszcze trzy szybkie kliknięcia…';$('quest').hidden=false;say('Jeszcze trzy szybkie kliknięcia…','Naciśnij zdjęcie 3 razy z rzędu. Pod nim czeka coś więcej!');spectacle();return;}if(phase!=='tapping')return;const now=performance.now();tapTimes=tapTimes.filter(t=>now-t<1500);tapTimes.push(now);$('tap-dots').textContent=Array.from({length:3},(_,i)=>i<tapTimes.length?'●':'○').join(' ');clearTimeout(tapReset);if(tapTimes.length>=3){phase='wheel';portrait.hidden=true;$('quest').hidden=true;$('wheel-panel').hidden=false;spectacle();$('wheel-panel').scrollIntoView({behavior:reduceMotion?'instant':'smooth',block:'center'});$('spin').focus({preventScroll:true});$('announcement').textContent='Urodzinowe koło fortuny! Zakręć kołem.';}else tapReset=setTimeout(()=>{tapTimes=[];$('tap-dots').textContent='○ ○ ○';},1550);}
portrait.addEventListener('click',onPhoto);portrait.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onPhoto();}});
function initSfx(){if(mutedByUser)return;try{if(!sfx)sfx=new (window.AudioContext||window.webkitAudioContext)();sfx.resume().catch(()=>{});}catch(e){}}
function tone(freq,length=.045,volume=.07){if(mutedByUser||!sfx||sfx.state!=='running')return;const o=sfx.createOscillator(),g=sfx.createGain();o.type='sine';o.frequency.setValueAtTime(freq,sfx.currentTime);g.gain.setValueAtTime(.001,sfx.currentTime);g.gain.linearRampToValueAtTime(volume,sfx.currentTime+.008);g.gain.exponentialRampToValueAtTime(.001,sfx.currentTime+length);o.connect(g);g.connect(sfx.destination);o.start();o.stop(sfx.currentTime+length+.01);o.onended=()=>{o.disconnect();g.disconnect();};}
// The six sectors start at 12 o'clock. Italy is sector 5, whose centre is 330°.
// A final 30° wheel rotation therefore places Italy directly under the pointer.
function nextWinningRotation(current){return current+6*360+((30-current%360+360)%360);}
function finishSpin(){phase='won';spinFrame=0;$('spin').disabled=false;$('spin').textContent='Jeszcze raz! 🇮🇹';document.querySelector('.wheel-shell').classList.remove('spinning');$('wheel-result').textContent='Ciao, Italia! Twój prezent: 600 zł na wycieczkę do Włoch!';$('announcement').textContent=$('wheel-result').textContent;$('voucher').hidden=false;$('gift-note').hidden=false;$('locked-note').hidden=true;$('back-photo').hidden=true;$('voucher').setAttribute('tabindex','-1');spectacle(true);[523.25,659.25,783.99,1046.5].forEach((n,i)=>setTimeout(()=>tone(n,.5,.10),i*160));setTimeout(()=>{$('voucher').scrollIntoView({behavior:reduceMotion?'instant':'smooth',block:'center'});$('voucher').focus({preventScroll:true});},1400);}
function spin(){if(phase!=='wheel'&&phase!=='won')return;phase='spinning';play();initSfx();$('spin').disabled=true;$('spin').textContent='Kręci się… ✨';$('wheel-result').textContent='Co tym razem przyniesie włoskie szczęście?';$('voucher').hidden=true;$('gift-note').hidden=true;document.querySelector('.wheel-shell').classList.add('spinning');const from=rotation,to=nextWinningRotation(from),duration=reduceMotion?350:6500;let start=null,lastSector=Math.floor(from/60);function animate(now){if(start===null)start=now;const p=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-p,3);rotation=from+(to-from)*ease;$('wheel').style.transform=`rotate(${rotation}deg)`;const sector=Math.floor(rotation/60);if(sector!==lastSector){tone(550+(sector%3)*100);lastSector=sector;}if(p<1)spinFrame=requestAnimationFrame(animate);else{rotation=to;$('wheel').style.transform=`rotate(${to}deg)`;finishSpin();}}spinFrame=requestAnimationFrame(animate);}
$('spin').addEventListener('click',spin);
$('back-photo').addEventListener('click',()=>{const target=phase==='closed'||phase==='tapping'?portrait:$('wheel-panel');target.scrollIntoView({behavior:reduceMotion?'instant':'smooth',block:'center'});if(target===portrait)portrait.focus({preventScroll:true});else $('spin').focus({preventScroll:true});});
$('again').addEventListener('click',()=>{play();spectacle(true);});
if('IntersectionObserver' in window&&!reduceMotion){const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}},{threshold:.1});document.querySelectorAll('.wish h2,.wish p,.signature,.gift-intro').forEach(el=>{el.classList.add('reveal-on-scroll');observer.observe(el);});}
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause();else play();});
play();setTimeout(()=>burst(innerWidth*.5,30,70),600);
