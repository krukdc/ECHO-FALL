
// #(Tworzy cząsteczki eksplozji.)
function burst(x,y,color,n,speed){for(let i=0;i<n;i++){const a=rand(0,TAU),v=rand(speed*.25,speed);game.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rand(.18,.64),max:.64,color,r:rand(1,3.5)});}}

// #(Odtwarza efekt dźwiękowy.)
function sfx(freq,dur,type='sine',vol=.025){if(!game.soundOn||settings.volume<=0)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!game.audio)game.audio=new AC();if(game.audio.state==='suspended')game.audio.resume();const o=game.audio.createOscillator(),g=game.audio.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(vol*settings.volume/100,game.audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,game.audio.currentTime+dur);o.connect(g).connect(game.audio.destination);o.start();o.stop(game.audio.currentTime+dur);}catch(_){}}
  let musicUnlocked=false,musicTrack='',musicBus=null,musicTrackGain=null,musicStep=0,musicNextStep=0,musicNoise=null;

// #(Tworzy lub wznawia kontekst audio po pierwszej interakcji gracza.)
  function unlockMusicAudio(){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!game.audio)game.audio=new AC();if(!musicBus){musicBus=game.audio.createGain();musicBus.gain.value=0;musicBus.connect(game.audio.destination);}if(game.audio.state==='suspended')game.audio.resume().catch(()=>{});musicUnlocked=true;updateMusicGain();switchMusicTrack(currentMusicTrack());}catch(_){}}

// #(Wybiera motyw walki podczas aktywnej walki i pauzy.)
  function currentMusicTrack(){const screen=game.screen==='settings'||game.screen==='stats'?game.returnScreen:game.screen;return screen==='playing'||screen==='paused'?'combat':'menu';}

// #(Dopasowuje muzykę do wyciszenia i suwaka głośności.)
  function updateMusicGain(){if(!musicBus||!game.audio)return;const target=game.soundOn&&!document.hidden?settings.volume/100:0;musicBus.gain.setTargetAtTime(target,game.audio.currentTime,.08);}

// #(Przelicza nutę na częstotliwość.)
function musicHz(note){return 440*Math.pow(2,(note-69)/12);}

// #(Planuje nutę syntezatora.)
function musicTone(note,time,duration,level,wave,gain,attack=.025){const ctx=game.audio;if(!ctx||!gain)return;const osc=ctx.createOscillator(),env=ctx.createGain();osc.type=wave;osc.frequency.setValueAtTime(musicHz(note),time);env.gain.setValueAtTime(.0001,time);env.gain.linearRampToValueAtTime(level,time+attack);env.gain.setValueAtTime(level,time+Math.max(attack,duration*.62));env.gain.exponentialRampToValueAtTime(.0001,time+duration);osc.connect(env).connect(gain);osc.start(time);osc.stop(time+duration+.02);}

// #(Tworzy bufor szumu perkusji.)
function musicNoiseBuffer(){if(musicNoise)return musicNoise;const ctx=game.audio,buffer=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.5),ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;musicNoise=buffer;return buffer;}

// #(Dodaje perkusyjny akcent szumowy.)
function musicNoiseHit(time,duration,level,gain,filterType,frequency){const ctx=game.audio,source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),env=ctx.createGain();source.buffer=musicNoiseBuffer();filter.type=filterType;filter.frequency.value=frequency;env.gain.setValueAtTime(level,time);env.gain.exponentialRampToValueAtTime(.0001,time+duration);source.connect(filter).connect(env).connect(gain);source.start(time);source.stop(time+duration);}

// #(Dodaje niskie uderzenie rytmiczne.)
function musicKick(time,gain){const ctx=game.audio,osc=ctx.createOscillator(),env=ctx.createGain();osc.type='sine';osc.frequency.setValueAtTime(125,time);osc.frequency.exponentialRampToValueAtTime(42,time+.16);env.gain.setValueAtTime(.2,time);env.gain.exponentialRampToValueAtTime(.0001,time+.19);osc.connect(env).connect(gain);osc.start(time);osc.stop(time+.2);}

// #(Przełącza i łagodnie wycisza poprzedni motyw.)
  function switchMusicTrack(track){if(!musicUnlocked||!game.audio||track===musicTrack)return;const ctx=game.audio,now=ctx.currentTime,previous=musicTrackGain;if(previous){previous.gain.cancelScheduledValues(now);previous.gain.setTargetAtTime(0,now,.16);setTimeout(()=>{try{previous.disconnect();}catch(_){}},1000);}musicTrack=track;musicStep=0;const gain=ctx.createGain();gain.gain.setValueAtTime(.0001,now);gain.gain.setTargetAtTime(1,now,.28);gain.connect(musicBus);musicTrackGain=gain;musicNextStep=now+.05;}

// #(Planuje nuty kolejnego kroku muzyki.)
function scheduleMusicStep(step,time){const menu=musicTrack==='menu',gain=musicTrackGain;if(!gain)return;if(menu){const roots=[45,41,48,43],thirds=[3,4,4,4],melody=[69,72,76,79,74,81,76,72],bar=Math.floor(step/16)%roots.length,pos=step%16;if(pos===0){const root=roots[bar];[root+12,root+12+thirds[bar],root+19,root+26].forEach(note=>musicTone(note,time,5.8,.035,'triangle',gain,.8));musicTone(root,time,2.4,.075,'sine',gain,.18);}if(pos===0||pos===8)musicTone(roots[bar]+12,time,.8,.09,'sine',gain,.08);if(pos===3||pos===7||pos===11||pos===15)musicTone(melody[(step/4|0)%melody.length],time,.62,.045,'sine',gain,.05);if(pos===6||pos===14)musicTone(melody[(step/2|0)%melody.length]+12,time,.34,.022,'triangle',gain,.035);return;}const roots=[38,34,36,41],thirds=[3,4,4,4],arp=[62,65,69,72,74,72,69,65,62,67,70,74,77,74,70,67],bar=Math.floor(step/8)%roots.length,pos=step%8,sub=step%16;if(pos===0)[roots[bar]+12,roots[bar]+12+thirds[bar],roots[bar]+19].forEach(note=>musicTone(note,time,1.35,.028,'sawtooth',gain,.12));if(pos===0||pos===4)musicKick(time,gain);if(pos===2||pos===6)musicNoiseHit(time,.15,.075,gain,'bandpass',1800);if(sub%2===0)musicNoiseHit(time,.045,.026,gain,'highpass',6200);musicTone(arp[sub],time,.19,.052,'triangle',gain,.012);if(pos===0||pos===3||pos===5||pos===7)musicTone(roots[bar]+24,time,.16,.09,'sawtooth',gain,.012);}

// #(Planuje krótkie fragmenty muzyki zgodnie z zegarem Web Audio.)
  function scheduleMusic(){if(!musicUnlocked||!game.audio||game.audio.state!=='running'||!musicTrackGain||!game.soundOn||settings.volume<=0||document.hidden)return;const now=game.audio.currentTime;if(musicNextStep<now-.08){musicNextStep=now+.025;musicStep=0;}const interval=musicTrack==='menu'?60/82:60/142/2;let guard=0;while(musicNextStep<now+.18&&guard++<16){scheduleMusicStep(musicStep++,musicNextStep);musicNextStep+=interval;}}

// #(Utrzymuje właściwy motyw, gdy zmienia się ekran gry.)
  function updateMusic(){if(!musicUnlocked)return;switchMusicTrack(currentMusicTrack());}