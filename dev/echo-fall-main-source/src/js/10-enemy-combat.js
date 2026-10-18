  const ENEMY_BASES={stalker:{r:13,hp:44,speed:78,damage:12,color:C.pink,xp:18},shooter:{r:12,hp:34,speed:49,damage:8,color:C.purple,xp:22},charger:{r:17,hp:76,speed:60,damage:22,color:C.gold,xp:30},sapper:{r:14,hp:52,speed:42,damage:18,color:'#ff8b5c',xp:28},beamWraith:{r:13,hp:46,speed:54,damage:14,color:'#68b7ff',xp:32},echoLeech:{r:15,hp:62,speed:66,damage:16,color:'#bd7cff',xp:38},gravemaw:{r:20,hp:112,speed:35,damage:26,color:'#c8a0ff',xp:48},bulwark:{r:19,hp:128,speed:34,damage:25,color:'#8da6b8',xp:46},siphon:{r:14,hp:72,speed:48,damage:10,color:'#f06bb2',xp:42},gateGunner:{r:15,hp:78,speed:40,damage:14,color:'#68b7ff',xp:46},echoTrapper:{r:15,hp:70,speed:47,damage:22,color:'#bd7cff',xp:44},laser:{r:15,hp:88,speed:38,damage:68,color:'#ff637d',xp:52},ricochet:{r:13,hp:64,speed:62,damage:17,color:'#ffc86a',xp:48}};
  const FLOOR_ROSTER={1:['stalker','shooter','charger'],2:['stalker','shooter','charger','sapper','beamWraith'],3:['stalker','shooter','charger','sapper','beamWraith','echoLeech','gravemaw'],4:['stalker','shooter','charger','sapper','beamWraith','echoLeech','gravemaw','bulwark','siphon'],5:['stalker','shooter','charger','sapper','beamWraith','echoLeech','gravemaw','bulwark','siphon','gateGunner','echoTrapper'],6:['stalker','shooter','charger','sapper','beamWraith','echoLeech','gravemaw','bulwark','siphon','gateGunner','echoTrapper','laser','ricochet']};

// #(Zwraca mnożniki statystyk piętra.)
function floorMultipliers(){return game.floor===2?{hp:2,damage:2}:game.floor>=3?{hp:2.5,damage:2.25}:{hp:1,damage:1};}

// #(Oblicza obrażenia bossa po skalowaniu.)
function scaledBossDamage(amount){return amount*floorMultipliers().damage*ECHO_EPI.epilogueScaleForFloor(game.floor).damage*(game.directive==='encirclement'?2:1);}

// #(Skaluje statystyki wroga.)
function scaledCombatStats(base){const mult=floorMultipliers(),hard=game.difficulty==='hard'?1.5:1;return ECHO_EPI.scaleEnemyStats(base,mult,game.floor,hard);}

// #(Losuje wroga z puli piętra.)
function pickFloorEnemy(){const roster=FLOOR_ROSTER[game.floor]||FLOOR_ROSTER[3];return roster[Math.floor(Math.random()*roster.length)];}

// #(Tworzy wroga z jego statystykami.)
function freshEnemy(kind,x,y,overrides={}){const base=ENEMY_BASES[kind]||ENEMY_BASES.stalker,scaled=scaledCombatStats(base),aiId=enemyAiSerial++,tacticalRole=kind==='shooter'?'suppress':kind==='sapper'?'area':kind==='charger'||kind==='gravemaw'?'pressure':'flank';return{kind,x,y,...base,...scaled,maxHp:scaled.hp,cool:rand(.5,1.5),state:'approach',stateT:0,flash:0,elite:false,mine:null,decoy:false,aiId,tacticalRole,flankSide:aiId%2?1:-1,flankOffset:((aiId%3)-1)*.16,evadeCooldown:rand(1.2,2.2),evadeT:0,evadeX:0,evadeY:0,volleyAt:kind==='shooter'?game.elapsed+1.25+(aiId%3)*.12:0,...overrides};}

// #(Planuje falę przeciwników.)
function spawnWave(floor,wave){game.floor=floor;game.wave=wave;game.waves=2;const baseCount=game.floor===1?3+wave:4+wave,count=baseCount*(game.difficulty==='hard'?2:1);game.spawnQueue=[];for(let i=0;i<count;i++)game.spawnQueue.push({kind:pickFloorEnemy(),delay:i===0?.3:rand(.4,1.2)});game.waveWait=0;ui.phase.textContent='WAVE '+String(wave).padStart(2,'0')+' // HOSTILES';ui.objective.textContent='Wyczyść sektor.';ui.objectiveText.textContent='Eliminuj sygnatury wroga.';}

// #(Dodaje wroga do areny.)
function spawnEnemy(kind){const edge=Math.floor(Math.random()*4),x=edge===0?25:edge===1?W-25:rand(30,W-30),y=edge===2?25:edge===3?H-25:rand(30,H-30);game.enemies.push(freshEnemy(kind,x,y));}

// #(Tworzy bossa piętra.)
function spawnBoss(){const specs={1:{name:'THE WARDEN',kind:'warden',hp:760,color:C.pink,feed:'Obiekt klasy WARDEN.<br><strong>Protokół: przetrwaj jego trzy fazy.</strong>',objective:'Pokonaj Strażnika.',hint:'Uważaj na znaki poprzedzające atak.'},2:{name:'THE CARTOGRAPHER',kind:'cartographer',hp:920,color:'#68b7ff',feed:'Obiekt klasy CARTOGRAPHER.<br><strong>Sekwencja laserów zmienia mapę areny.</strong>',objective:'Przerwij kartografowanie.',hint:'Zniszcz trzy węzły osłony; unikaj oznaczonego pasa lasera.'},3:{name:'THE NULL KING',kind:'nullKing',hp:1120,color:'#bd7cff',feed:'Obiekt klasy NULL KING.<br><strong>Znajdź prawdziwy rdzeń między decoyami.</strong>',objective:'Złam koronę Null Kinga.',hint:'Oznaczone strefy najpierw ostrzegają, potem rażą.'},4:{name:'THE GATEWRIGHT',kind:'gatewright',hp:1250,color:'#61e7d2',feed:'Obiekt klasy GATEWRIGHT.<br><strong>Generatory podtrzymują bariery areny.</strong>',objective:'Zniszcz generatory Gatewrighta.',hint:'Strzelaj w osłony; zostawiona przerwa jest bezpieczną trasą.'},5:{name:'THE AUDITOR',kind:'auditor',hp:1450,color:'#ffc86a',feed:'Obiekt klasy AUDITOR.<br><strong>Zapamiętuje pozycje i atakuje je po kolei.</strong>',objective:'Przetrwaj sekwencję Audytora.',hint:'Ruszaj się między znacznikami; Blink omija serię uderzeń.'},6:{name:'THE ARCHIVE HEART',kind:'archiveHeart',hp:1700,color:'#e782ff',feed:'Rdzeń archiwum odsłania trzy fazy.<br><strong>Łączy znane sygnały w nową sekwencję.</strong>',objective:'Pokonaj Archive Heart.',hint:'Czytaj strefy i pociski, używaj Blink przez strefy zagrożenia.'}}[game.floor]||null;const scaled=scaledCombatStats({hp:specs.hp,damage:20}),nodeHp=scaledCombatStats({hp:70,damage:0}).hp*(game.directive==='encirclement'?2:1),bossStatMult=game.directive==='encirclement'?2:1;game.boss={kind:specs.kind,x:W/2,y:128,r:34,hp:scaled.hp*bossStatMult,maxHp:scaled.hp*bossStatMult,speed:65*bossStatMult,damage:scaled.damage*bossStatMult,color:specs.color,cool:1.3,state:'intro',stateT:1.5,angle:0,phase:1,flash:0,bossResolved:false,laser:{index:0,t:1.5,active:false,warning:true},shieldNodes:[],decoys:[],zones:[]};if(specs.kind==='cartographer')game.boss.shieldNodes=[0,1,2].map(i=>({i,angle:i*TAU/3,r:9,hp:nodeHp,maxHp:nodeHp,x:W/2+Math.cos(i*TAU/3)*72,y:128+Math.sin(i*TAU/3)*72}));if(specs.kind==='gatewright')game.boss.shieldNodes=[0,1,2].map(i=>({i,angle:i*TAU/3,r:10,hp:nodeHp*1.2,maxHp:nodeHp*1.2,x:W/2+Math.cos(i*TAU/3)*105,y:165+Math.sin(i*TAU/3)*72}));game.enemies=[game.boss];ui.bossName.textContent=specs.name;ui.boss.classList.add('show');ui.phase.textContent='ENTITY DETECTED';ui.objective.textContent=specs.objective;ui.objectiveText.textContent=specs.hint;setFeed(specs.feed,'THREAT LEVEL: OMEGA');toast(specs.name+' // ONLINE');}

// #(Sprawdza kolizję dwóch okrągłych obiektów.)
function circleHit(a,b){return Math.hypot(a.x-b.x,a.y-b.y)<a.r+b.r;}

// #(Tworzy pocisk gracza lub wroga.)
function fireProjectile(owner,x,y,vx,vy,damage,pierce=0,source=null){const arr=owner==='player'?game.shots:game.enemyShots,color=owner==='boss'?C.pink:owner==='player'?game.weapon.color:C.purple,r=owner==='player'?game.weapon.id==='rail'?6:4:owner==='boss'?6:5,projectile={x,y,vx:owner==='boss'&&game.directive==='encirclement'?vx*2:vx,vy:owner==='boss'&&game.directive==='encirclement'?vy*2:vy,damage,owner,color,r,life:3,pierce,hits:[],source};arr.push(projectile);return projectile;}

// #(Wystrzeliwuje podstawowy atak.)
function fireShot(){const p=game.player,w=game.weapon;if(game.shotCooldown>0)return;game.shotCooldown=w.interval/(1+(p.fireRateBonus||0));const x=p.x+p.aimX*17,y=p.y+p.aimY*17,damage=p.damage*p.attackMultiplier;if(w.style==='scatter'){for(let i=-2;i<=2;i++){const a=i*.16,c=Math.cos(a),s=Math.sin(a),dx=p.aimX*c-p.aimY*s,dy=p.aimX*s+p.aimY*c;fireProjectile('player',x,y,dx*w.speed,dy*w.speed,damage);}burst(x,y,w.color,5,48);}else fireProjectile('player',x,y,p.aimX*w.speed,p.aimY*w.speed,damage,w.style==='pierce'?2:0);burst(x,y,w.color,3,42);sfx(w.id==='rail'?360:w.id==='scatter'?500:650,.045,w.id==='rail'?'sawtooth':'triangle',.025);}

// #(Leczy raz za trafienie Novą.)
function healNovaOnce(p,state){if(state.pending&&p.specialHeal>0){state.pending=false;p.hp=Math.min(p.maxHp,p.hp+p.specialHeal);}}

// #(Uruchamia atak specjalny Nova.)
function nova(){const p=game.player;if(game.novaCooldown>0||p.energy<35)return;p.energy-=35;game.novaCooldown=3.6;game.flash=.23;game.shake=9;if(game.weapon.id==='rail'){let hit=false;for(const e of [...game.enemies]){const ax=e.x-p.x,ay=e.y-p.y,along=ax*p.aimX+ay*p.aimY,side=Math.abs(ax*p.aimY-ay*p.aimX);if(along>0&&along<650&&side<46){hurtEnemy(e,112*p.specialPower*p.attackMultiplier);hit=true;}}if(hit)healNovaOnce(p,{pending:true});for(let i=1;i<=12;i++)burst(p.x+p.aimX*i*38,p.y+p.aimY*i*38,C.gold,3,35);sfx(90,.28,'sawtooth',.06);toast('RAIL NOVA // PIERCED');return;}if(game.weapon.id==='scatter'){const healState={pending:true};for(let i=0;i<20;i++){const a=i*TAU/20,shot=fireProjectile('player',p.x,p.y,Math.cos(a)*390,Math.sin(a)*390,26*p.specialPower*p.attackMultiplier);if(p.specialHeal>0)shot.novaHeal=healState;}burst(p.x,p.y,C.purple,24,140);sfx(150,.25,'square',.045);toast('RIFT NOVA // RELEASED');return;}let hit=false;for(let i=game.enemies.length-1;i>=0;i--){const e=game.enemies[i],d=dist(p,e);if(d<145){hurtEnemy(e,62*p.specialPower*p.attackMultiplier);hit=true;if(e!==game.boss){const m=d||1;e.x+=((e.x-p.x)/m)*34;e.y+=((e.y-p.y)/m)*34;}}}if(hit)healNovaOnce(p,{pending:true});burst(p.x,p.y,C.cyan,32,190);sfx(120,.24,'sawtooth',.06);toast('VECTOR NOVA // RELEASED');}

// #(Wykonuje unik Blinkiem.)
function dash(){const p=game.player;if(game.dashCooldown>0)return;let dx=(keyDown('moveRight')||keys.has('ArrowRight')?1:0)-(keyDown('moveLeft')||keys.has('ArrowLeft')?1:0)+game.touchMove.x,dy=(keyDown('moveDown')||keys.has('ArrowDown')?1:0)-(keyDown('moveUp')||keys.has('ArrowUp')?1:0)+game.touchMove.y;if(!dx&&!dy){dx=p.aimX;dy=p.aimY;}const m=Math.hypot(dx,dy)||1;p.x=clamp(p.x+dx/m*102,28,W-28);p.y=clamp(p.y+dy/m*102,28,H-28);p.invuln=.48;p.dash=.28;game.dashCooldown=Math.max(.35,1.35-p.dashReduction);burst(p.x,p.y,C.cyan,14,130);sfx(240,.1,'sawtooth',.035);}

// #(Zadaje obrażenia wrogowi.)
function hurtEnemy(e,dmg){if(!e||e.hp<=0)return;if(e===game.boss&&e.kind==='cartographer'){const node=e.shieldNodes.find(n=>n.hp>0);if(node){node.hp=Math.max(0,node.hp-dmg);burst(node.x,node.y,node.hp>0?'#68b7ff':'#ffffff',node.hp>0?4:12,95);if(node.hp===0){toast('CARTOGRAPHER // SHIELD NODE BROKEN');ui.phase.textContent='SHIELD NODE BROKEN';}return;}}if(e===game.boss&&e.kind==='gatewright'){const node=e.shieldNodes.find(n=>n.hp>0);if(node){node.hp=Math.max(0,node.hp-dmg);burst(node.x,node.y,node.hp>0?e.color:'#ffffff',node.hp>0?5:14,110);if(node.hp===0)toast('GATEWRIGHT // GENERATOR BROKEN');return;}}if(e.kind==='bulwark'){const facing=Math.cos(e.shieldAngle-Math.atan2(game.player.y-e.y,game.player.x-e.x));if(facing>.72){burst(e.x,e.y,e.color,2,30);return;}}e.hp-=dmg;if(e.hp<=0&&e.mine){const mi=game.hazards.indexOf(e.mine);if(mi>=0)game.hazards.splice(mi,1);e.mine=null;}e.flash=.11;burst(e.x,e.y,e.color,5,75);game.shake=Math.max(game.shake,2);if(e.hp<=0){if(e===game.boss){resolveBossDefeat(e);return;}const ix=game.enemies.indexOf(e);if(ix>=0)game.enemies.splice(ix,1);game.kills++;game.player.kills++;game.score+=Math.round((e.xp||18)*10);game.scrap+=Math.max(1,Math.round((e.xp||18)/10));game.player.xp+=(e.xp||18);game.player.energy=Math.min(game.player.maxEnergy,game.player.energy+9);burst(e.x,e.y,e.color,15,130);if(game.player.xp>=100){game.player.xp-=100;game.player.level++;game.player.maxHp+=5;game.player.hp=Math.min(game.player.maxHp,game.player.hp+5);toast('LEVEL UP // '+String(game.player.level).padStart(2,'0'));}sfx(190,.08,'triangle',.035);}}

// #(Obsługuje pokonanie bossa i nagrodę.)
function resolveBossDefeat(e){if(e.bossResolved)return;e.bossResolved=true;game.boss=null;game.enemies=[];game.hazards=[];game.shots=[];game.enemyShots=[];if(game.floor===3&&!meta.unlockedWeapons.includes('scatter')){meta.unlockedWeapons.push('scatter');saveMeta();}if(game.floor===3){showCampaignEndChoice();return;}if(game.floor===6&&game.epilogueActive){const result=ECHO_EPI.resolveEpilogueBoss(game);if(result?.type==='epilogueClear')winRun();return;}showBossArmory();}

// #(Wyświetla wybór broni po bossie.)
function showBossArmory(){game.screen='bossArmory';keys.clear();game.touchAttack=false;resetStick();const ids=meta.unlockedWeapons.filter(id=>WEAPONS[id]);game.weaponChoice=Math.max(0,ids.indexOf(game.weapon.id));const final=game.floor===6;const cards=ids.map((id,i)=>{const w=WEAPONS[id];return `<button type="button" data-boss-weapon="${id}" class="choice ${i===game.weaponChoice?'selected':''}"><div class="choice-tag">${w.tag}</div><h3>${w.name}</h3><p>${w.desc}</p><div class="choice-mark">${id===game.weapon.id?'[ AKTUALNA ]':i===game.weaponChoice?'[ ENTER ]':'[ WYBIERZ ]'}</div></button>`;}).join('');showModal(`<div class="modal-kicker">${final?'ARSENAL FOR NEXT RUN':`FLOOR ${String(game.floor).padStart(2,'0')} BOSS DEFEATED`}</div><h1>${final?'Nagroda<br><em>za run.</em>':'Zmień<br><em>arsenał.</em>'}</h1><p class="modal-copy">${final?'Rift Scatter został odblokowany. Wybierz broń na następny run.':'Wybierz broń na dalszą drogę. Ulepszenia obrażeń pozostają zachowane.'}</p><div class="choice-grid">${cards}</div><div class="modal-actions"><button type="button" data-boss-skip class="primary-action">${final?'ZACHOWAJ BROŃ':'ZOSTAW OBECNĄ'}</button><div class="action-hint">← → WYBÓR · ENTER POTWIERDŹ · ESC POMIŃ</div></div>`);ui.boss.classList.remove('show');ui.phase.textContent=final?'ARSENAL READY':'BOSS DEFEATED';ui.objective.textContent=final?'Wybierz broń na następny run.':'Wybierz broń przed windą.';ui.objectiveText.textContent=final?'Rift Scatter dołączono do arsenału.':'Winda ruszy po wyborze broni.';updateUI();}

// #(Zatwierdza broń po bossie.)
function resolveBossArmory(id){if(game.screen!=='bossArmory')return;if(id&&meta.unlockedWeapons.includes(id)&&WEAPONS[id]&&game.player){const bonus=game.player.damage-game.weapon.damage;game.weapon=WEAPONS[id];game.player.damage=game.weapon.damage+bonus;}if(game.floor===4||game.floor===5){const result=ECHO_EPI.resolveEpilogueBoss(game);if(result?.type==='elevator')showElevator();return;}if(game.floor===6){const result=ECHO_EPI.resolveEpilogueBoss(game);if(result?.type==='epilogueClear')winRun();return;}if(game.floor<3)showElevator();else winRun();}

// #(Zadaje obrażenia postaci.)
function damagePlayer(amount){const p=game.player;if(p.invuln>0)return;game.damageTaken=(game.damageTaken||0)+Math.min(p.hp,Math.max(0,amount));p.hp-=amount;p.invuln=.72;game.shake=8;game.flash=.16;burst(p.x,p.y,C.pink,12,120);sfx(100,.12,'square',.04);if(p.hp<=0){p.hp=0;loseRun();}}

// #(Sprawdza, czy gracz znajduje się w pasie ataku.)
function bossLaneHit(lane,p){const pad=18;if(lane===0)return Math.abs(p.x-W*.28)<pad; if(lane===1)return Math.abs(p.x-W*.5)<pad; if(lane===2)return Math.abs(p.x-W*.72)<pad; return Math.abs(p.y-H*.5)<pad;}

// #(Aktualizuje wzorce ataków bossa.)
function updateSpecialBoss(e,p,dt,d,nx,ny){
    if(e.kind==='cartographer'){
      e.angle+=dt*.8;for(const n of e.shieldNodes){n.angle+=dt*(.9+n.i*.12);n.x=e.x+Math.cos(n.angle)*72;n.y=e.y+Math.sin(n.angle)*72;}
      e.laser.t-=dt;if(e.laser.t<=0){if(e.laser.warning){e.laser.warning=false;e.laser.active=true;e.laser.t=.55;ui.phase.textContent='LASER LIVE // CLEAR LANE';toast('CARTOGRAPHER // LANE LIVE');}else{e.laser.active=false;e.laser.warning=true;e.laser.index=(e.laser.index+1)%4;e.laser.t=1.15;ui.phase.textContent='LASER WARNING // MOVE';toast('CARTOGRAPHER // LANE TELEGRAPH');}}
      if(e.laser.active&&bossLaneHit(e.laser.index,p))damagePlayer(scaledBossDamage(18+e.phase*3));
      if(d>185){e.x+=nx*e.speed*dt;e.y+=ny*e.speed*dt;}if(e.cool<=0){e.cool=e.phase===3?1.1:1.7;const a=Math.atan2(ny,nx);for(let i=-1;i<=1;i++)fireProjectile('boss',e.x,e.y,Math.cos(a+i*.25)*230,Math.sin(a+i*.25)*230,scaledBossDamage(12+e.phase*2),0,e);}if(circleHit(e,p))damagePlayer(scaledBossDamage(15));return true;
    }
    if(e.kind==='nullKing'){
      e.laser.t-=dt;if(e.laser.t<=0){e.laser.t=3.8;e.zones.push({x:rand(90,W-90),y:rand(110,H-90),r:58,t:2.6,warning:true});if(e.zones.length>3)e.zones.shift();ui.phase.textContent='ZONE WARNING // MOVE';toast('NULL KING // ZONE MARKED');}
      for(const z of e.zones){z.t-=dt;if(z.warning&&z.t<=1.1){z.warning=false;ui.phase.textContent='NULL ZONES LIVE // CLEAR';toast('NULL KING // ZONE STRIKE');}if(!z.warning&&z.t>0&&Math.hypot(p.x-z.x,p.y-z.y)<z.r)damagePlayer(scaledBossDamage(15)*dt);}
      e.decoyTimer=(e.decoyTimer||2)-dt;if(e.decoyTimer<=0){e.decoyTimer=5.2;const decoy=freshEnemy('echoLeech',clamp(e.x+rand(-130,130),50,W-50),clamp(e.y+rand(-90,150),70,H-50),{kind:'nullDecoy',hp:Math.round(e.maxHp*.12),maxHp:Math.round(e.maxHp*.12),damage:10,speed:72,decoy:true,color:'#8f66db',xp:24,lifeT:5.5,cool:99});game.enemies.push(decoy);e.decoys.push(decoy);toast('NULL KING // DECOY CAST');}
      if(d>190){e.x+=nx*e.speed*dt;e.y+=ny*e.speed*dt;}if(e.cool<=0){e.cool=e.phase===3?.8:1.4;fireProjectile('boss',e.x,e.y,nx*245,ny*245,scaledBossDamage(14+e.phase*2),0,e);}if(circleHit(e,p))damagePlayer(scaledBossDamage(18));return true;
    }
    return false;
  }

// #(Aktualizuje unikalne wzorce trzech bossów epilogu.)
const baseUpdateSpecialBossEpilogue=updateSpecialBoss;
updateSpecialBoss=function(e,p,dt,d,nx,ny){
 if(e.kind==='gatewright'){
   e.gateTimer=(e.gateTimer||3)-dt;e.barrierTimer=(e.barrierTimer||0)-dt;
   if(d>190){e.x+=nx*e.speed*dt;e.y+=ny*e.speed*dt;}
   if(e.cool<=0){e.cool=e.phase===3?1.05:1.55;for(let i=-1;i<=1;i++){const a=Math.atan2(ny,nx)+i*.24;fireProjectile('boss',e.x,e.y,Math.cos(a)*215,Math.sin(a)*215,scaledBossDamage(11+e.phase*2),0,e);}}
   if(e.barrierTimer<=0){e.barrierTimer=4.3;e.barrierWarning=true;e.barrierActive=false;e.barrierT=.85;e.barrierGap=rand(0,1)<.5?'upper':'lower';}
   if(e.barrierWarning){e.barrierT-=dt;if(e.barrierT<=0){e.barrierWarning=false;e.barrierActive=true;e.barrierT=1.15;toast(language==='en'?'GATEWRIGHT // ROUTE SEALED':language==='zh-Hant'?'門匠 // 通道封鎖':'GATEWRIGHT // BARIERA');}}
   else if(e.barrierActive){e.barrierT-=dt;if(Math.abs(p.x-W*.5)<14&&!(e.barrierGap==='upper'?p.y<H*.48:p.y>H*.52))damagePlayer(scaledBossDamage(12)*dt);if(e.barrierT<=0)e.barrierActive=false;}
   if(circleHit(e,p))damagePlayer(scaledBossDamage(14)*dt);return true;
 }
 if(e.kind==='auditor'){
   e.auditState=e.auditState||'record';e.auditTimer=(e.auditTimer??.45)-dt;
   if(d>220){e.x+=nx*e.speed*dt*.65;e.y+=ny*e.speed*dt*.65;}
   if(e.auditState==='record'){if(e.auditTimer<=0){e.positions=e.positions||[];e.positions.push({x:p.x,y:p.y});e.auditTimer=.72;if(e.positions.length>=3){e.auditState='strike';e.strikeIndex=0;e.auditTimer=.62;toast(language==='en'?'AUDITOR // POSITIONS LOCKED':language==='zh-Hant'?'稽核者 // 位置已鎖定':'AUDITOR // POZYCJE ZAPAMIĘTANE');}}}
   else if(e.auditState==='strike'&&e.auditTimer<=0){const mark=e.positions[e.strikeIndex];if(mark&&Math.hypot(p.x-mark.x,p.y-mark.y)<47)damagePlayer(scaledBossDamage(17));burst(mark?.x||e.x,mark?.y||e.y,e.color,15,105);e.strikeIndex++;e.auditTimer=.62;if(e.strikeIndex>=3){e.auditState='recover';e.auditTimer=2.1;}}
   else if(e.auditState==='recover'&&e.auditTimer<=0){e.auditState='record';e.positions=[];e.auditTimer=.4;}
   if(e.cool<=0){e.cool=2.4;fireProjectile('boss',e.x,e.y,nx*225,ny*225,scaledBossDamage(10),0,e);}if(circleHit(e,p))damagePlayer(scaledBossDamage(16)*dt);return true;
 }
 if(e.kind==='archiveHeart'){
   e.phase=e.hp<e.maxHp*.32?3:e.hp<e.maxHp*.68?2:1;e.speed=46+e.phase*8;
   if(d>190){e.x+=nx*e.speed*dt;e.y+=ny*e.speed*dt;}
   e.heartTimer=(e.heartTimer||2.1)-dt;e.heartState=e.heartState||'idle';
   if(e.heartState==='idle'&&e.heartTimer<=0){e.mark={x:clamp(p.x,65,W-65),y:clamp(p.y,75,H-65),r:52,t:.92,hit:false};e.heartState='warning';e.heartTimer=.92;toast(language==='en'?'ARCHIVE HEART // MOVE':language==='zh-Hant'?'檔案核心 // 移動':'ARCHIVE HEART // OPUŚĆ STREFĘ');}
   if(e.heartState==='warning'&&e.heartTimer<=0){e.heartState='burst';e.heartTimer=.58;if(Math.hypot(p.x-e.mark.x,p.y-e.mark.y)<e.mark.r+p.r)damagePlayer(scaledBossDamage(16));burst(e.mark.x,e.mark.y,e.color,18,120);}
   if(e.heartState==='burst'&&e.heartTimer<=0){e.heartState='idle';e.heartTimer=e.phase===3?1.45:e.phase===2?1.9:2.5;if(e.phase>=2){const count=e.phase===3?12:8;for(let i=0;i<count;i++){const a=i*TAU/count+game.elapsed*.13;fireProjectile('boss',e.x,e.y,Math.cos(a)*190,Math.sin(a)*190,scaledBossDamage(9+e.phase*2),0,e);}}}
   if(e.cool<=0){e.cool=e.phase===3?1.15:1.8;fireProjectile('boss',e.x,e.y,nx*235,ny*235,scaledBossDamage(11+e.phase*2),0,e);}if(circleHit(e,p))damagePlayer(scaledBossDamage(14)*dt);return true;
 }
 return baseUpdateSpecialBossEpilogue(e,p,dt,d,nx,ny);
};


// #(Pokazuje graczowi wybór pomiędzy zwykłym finałem a opcjonalnym epilogiem.)
function showCampaignEndChoice(){game.screen='campaignChoice';game.campaignChoice=1;keys.clear();game.touchAttack=false;resetStick();showModal('<div class="modal-kicker">CAMPAIGN III / ARCHIVE CORE</div><h1>Archiwum<br><em>odpowiada.</em></h1><p class="modal-copy">Trzeci boss upadł. Możesz zakończyć run albo zejść głębiej bez utraty obecnego builda.</p><div class="campaign-choice-grid"><button type="button" class="secondary-action" data-campaign-choice="finish">ZAKOŃCZ RUN</button><button type="button" class="primary-action" data-campaign-choice="continue">KONTYNUUJ DO EPILOGU</button></div><div class="action-hint">WYBIERZ KLAWIATURĄ LUB DOTKNIJ</div>');ui.modalCard.querySelector('[data-campaign-choice="continue"]')?.focus();ui.phase.textContent='EPILOGUE AVAILABLE';ui.objective.textContent='Wybierz dalszą drogę.';ui.objectiveText.textContent='Run kończy się dopiero po wybranej ścieżce.';updateUI();}
window.addEventListener('keydown',event=>{if(game.screen!=='campaignChoice')return;const buttons=[...ui.modalCard.querySelectorAll('[data-campaign-choice]')];if(!buttons.length)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.code)){event.preventDefault();event.stopImmediatePropagation();game.campaignChoice=game.campaignChoice===0?1:0;buttons[game.campaignChoice].focus();return;}if(event.code==='Enter'||event.code==='Space'){event.preventDefault();event.stopImmediatePropagation();const active=ui.modalCard.querySelector('[data-campaign-choice]:focus')||buttons[game.campaignChoice];active?.click();}},true);
ui.modal.addEventListener('click',event=>{const choice=event.target.closest('[data-campaign-choice]');if(!choice||game.screen!=='campaignChoice')return;event.preventDefault();event.stopImmediatePropagation();if(choice.dataset.campaignChoice==='finish'){if(ECHO_EPI.finishCampaign(game))winRun();return;}if(choice.dataset.campaignChoice==='continue'&&ECHO_EPI.beginEpilogue(game)){advanceFloor(4);}},true);
