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
// Instrumental arrangement of the traditional Polish birthday song "Sto lat".
const notes=[['G4',1],['E4',1],['G4',1],['E4',1],['G4',.5],['A4',.5],['G4',.5],['F4',.5],['E4',1],['F4',1],['F4',1],['D4',1],['F4',1],['D4',1],['F4',.5],['G4',.5],['F4',.5],['E4',.5],['D4',1],['E4',1],['G4',.5],['G4',.5],['E4',1],['G4',.5],['G4',.5],['E4',1],['G4',.5],['C5',.5],['B4',.5],['A4',.5],['G4',1],['F4',1],['E4',1],['F4',1],['D4',1],['C4',2]];
const hz={C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25};
let audio, master, playing=false, loopTimer, voices=[];
function sound(freq,time,duration,level=.24){const osc=audio.createOscillator(),gain=audio.createGain();osc.type='triangle';osc.frequency.value=freq;gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(level,time+.018);gain.gain.exponentialRampToValueAtTime(.001,time+duration);osc.connect(gain);gain.connect(master);osc.start(time);osc.stop(time+duration+.04);voices.push(osc);osc.onended=()=>{voices=voices.filter(v=>v!==osc);osc.disconnect();gain.disconnect();};}
function song(){if(!playing)return;let t=audio.currentTime+.08;for(const [n,d] of notes){sound(hz[n],t,d*.42);sound(hz[n]/2,t,d*.42,.075);t+=d*.46;}loopTimer=setTimeout(song,(t-audio.currentTime+2)*1000);}
function updateMusic(){$('music').textContent=playing?'♫ Wyłącz muzykę':'♪ Włącz „Sto lat”';$('music').setAttribute('aria-pressed',String(playing));$('music').setAttribute('aria-label',playing?'Wyłącz melodię Sto lat':'Włącz melodię Sto lat');}
async function play(){try{if(!audio){audio=new (window.AudioContext||window.webkitAudioContext)();master=audio.createGain();master.gain.value=.65;master.connect(audio.destination);}await audio.resume();if(audio.state!=='running')return;if(!playing){playing=true;master.gain.cancelScheduledValues(audio.currentTime);master.gain.setValueAtTime(.05,audio.currentTime);master.gain.linearRampToValueAtTime(.65,audio.currentTime+1.5);song();updateMusic();}}catch(e){$('music').textContent='Dźwięk niedostępny';}}
function stop(){playing=false;clearTimeout(loopTimer);for(const v of voices){try{v.stop();}catch(e){}}voices=[];updateMusic();}
$('music').addEventListener('click',()=>playing?stop():play());
$('start').addEventListener('click',()=>{play();party();document.body.classList.add('entered');$('start').innerHTML='Sto lat, Kochana Mamo! <span aria-hidden="true">♡</span>';$('announcement').textContent='Wszystkiego najlepszego, Mamo! Poniżej czeka Twój prezent.';});
$('unwrap').addEventListener('click',()=>{play();$('unwrap').setAttribute('aria-expanded','true');$('unwrap').hidden=true;$('voucher').hidden=false;$('gift-note').hidden=false;$('voucher').setAttribute('tabindex','-1');$('voucher').focus({preventScroll:true});party();$('announcement').textContent='Niespodzianka! Voucher na 600 zł na wycieczkę do Włoch, od Dominika.';});
$('again').addEventListener('click',()=>{play();party();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)stop();});
// Browsers that allow autoplay can start immediately; others retain the visible play button.
play();
setTimeout(()=>burst(innerWidth*.5,30,70),600);
