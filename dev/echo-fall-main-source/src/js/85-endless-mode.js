// #(Dodaje tryb bez bossów, z nieskończonymi falami i nagrodami co pięć fal.)
(()=>{
  const baseRenderRunSetup=renderRunSetup;
  renderRunSetup=function(){
    baseRenderRunSetup();
    if(game.screen!=='setup'||game.setupStep!==1)return;
    const grid=ui.modalCard.querySelector('.difficulty-grid');if(!grid||grid.querySelector('[data-setup-difficulty="endless"]'))return;
    const copy=language==='en'?{tag:'ENDLESS // SURVIVAL',name:'Endless',desc:'Infinite waves, no bosses. Choose a reward every 5 waves.'}:language==='zh-Hant'?{tag:'ENDLESS // 生存',name:'無盡',desc:'無限波次，沒有首領。每 5 波選擇一項獎勵。'}:{tag:'ENDLESS // PRZETRWANIE',name:'Endless',desc:'Nieskończone fale, bez bossów. Wybór nagrody co 5 fal.'};
    grid.insertAdjacentHTML('beforeend','<button type="button" data-setup-difficulty="endless" class="choice '+(game.difficulty==='endless'?'selected':'')+'"><div class="choice-tag">'+copy.tag+'</div><h3>'+copy.name+'</h3><p>'+copy.desc+'</p><div class="choice-mark">'+(game.difficulty==='endless'?'✓':'')+'</div></button>');
  };

  // #(Umożliwia wybór trybu Endless klawiaturą na ekranie konfiguracji.)
  document.addEventListener('keydown',event=>{
    if(game.screen!=='setup'||game.setupStep!==1||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.code))return;
    event.preventDefault();event.stopImmediatePropagation();
    const modes=['normal','hard','endless'],index=modes.indexOf(game.difficulty),step=event.code==='ArrowLeft'||event.code==='ArrowUp'?-1:1;
    game.difficulty=modes[(index+step+modes.length)%modes.length];renderRunSetup();
  },true);

  // #(Zapewnia świeży stan i standardowe HP przy rozpoczęciu Endless.)
  const baseFreshRunEndless=freshRun;
  freshRun=function(){game.endlessActive=game.difficulty==='endless';game.endlessHighestWave=1;game.endlessRewardWave=null;game.endlessWaveForStats=null;baseFreshRunEndless();if(game.endlessActive){game.floor=1;game.room=1;game.wave=1;game.waves=Infinity;game.endlessHighestWave=1;ui.phase.textContent='WAVE 01 // HOSTILES';ui.room.textContent='ENDLESS';updateUI();}};

  // #(Dobiera przeciwników z kolejnych pul co pięć fal.)
  const basePickFloorEnemyEndless=pickFloorEnemy;
  pickFloorEnemy=function(){if(game.difficulty!=='endless')return basePickFloorEnemyEndless();const roster=FLOOR_ROSTER[ECHO_EPI.endlessRosterTier(game.wave)]||FLOOR_ROSTER[3];return roster[Math.floor(Math.random()*roster.length)];};

  // #(Skaluje HP i obrażenia o 2 procent na falę, pozostawiając prędkość bez zmian.)
  const baseScaledCombatStatsEndless=scaledCombatStats;
  scaledCombatStats=function(base){const stats=baseScaledCombatStatsEndless(base);if(game.difficulty!=='endless')return stats;return ECHO_EPI.scaleEndlessStats(stats,game.endlessWaveForStats||game.wave);};

  // #(Zmniejsza przyrost maksymalnego HP za awans tylko w Endless.)
  const baseHurtEnemyEndless=hurtEnemy;
  hurtEnemy=function(enemy,damage){const player=game.player,startingLevel=player?.level;baseHurtEnemyEndless(enemy,damage);if(game.difficulty!=='endless'||!player||player.level<=startingLevel)return;const correction=(5-ECHO_EPI.endlessLevelHpGain(game.difficulty))*(player.level-startingLevel);player.maxHp-=correction;player.hp=Math.max(0,player.hp-correction);};

  // #(Podnosi ceny sklepu Endless o 25 procent co dziesięć fal.)
  const baseShopOfferEndless=shopOffer;
  shopOffer=function(index){const offer=baseShopOfferEndless(index);return game.endlessActive?ECHO_EPI.scaleEndlessShopOffer(offer,game.wave):offer;};

  // #(Planuje stałą bazową liczbę wrogów z uzgodnionymi premiami wyzwań.)
  const baseSpawnWaveEndless=spawnWave;
  spawnWave=function(_floor,wave){
    if(game.difficulty!=='endless')return baseSpawnWaveEndless.apply(this,arguments);
    game.endlessActive=true;game.floor=1;game.wave=Math.max(1,Math.floor(wave)||1);game.waves=Infinity;game.endlessHighestWave=Math.max(game.endlessHighestWave||1,game.wave);game.endlessWaveForStats=null;
    let count=ECHO_EPI.endlessEnemyCount(4,game.wave-1);if(game.directive==='hunter')count+=Math.ceil(count*.5);if(game.directive==='encirclement')count*=3;
    game.spawnQueue=Array.from({length:count},(_,index)=>({kind:pickFloorEnemy(),delay:index===0?.3:rand(.4,1.2)}));game.directiveSpawnCount=0;game.waveWait=0;ui.phase.textContent='WAVE '+String(game.wave).padStart(2,'0')+' // HOSTILES';ui.objective.textContent=language==='en'?'Survive the wave.':language==='zh-Hant'?'撐過這一波。':'Przetrwaj falę.';ui.objectiveText.textContent=language==='en'?'Clear all hostiles to continue.':language==='zh-Hant'?'消滅所有敵人以繼續。':'Pokonaj wszystkich wrogów, aby przejść dalej.';updateUI();
  };

  // #(Rozpoczyna następną falę albo pokazuje nagrodę po fali piątej.)
  const baseAdvanceProgressEndless=advanceProgress;
  // #(Uruchamia kolejną falę po wybraniu nagrody.)
  function beginEndlessWave(wave){game.endlessActive=true;game.floor=1;game.room=1;game.wave=Math.max(1,Math.floor(wave)||1);game.waves=Infinity;game.boss=null;game.riskRoom=false;game.riskReward=false;game.endlessWaveForStats=null;game.waveWait=0;game.enemies=[];game.shots=[];game.enemyShots=[];game.hazards=[];game.spawnQueue=[];game.screen='playing';hideModal();ui.boss.classList.remove('show');spawnWave(1,game.wave);toast('ENDLESS // WAVE '+String(game.wave).padStart(2,'0'));updateUI();}
  // #(Zwraca tekst nagród w aktywnym języku.)
  function endlessRewardCopy(){return language==='en'?{title:'Choose your',accent:'reward.',artifact:'Artifact',artifactDesc:'Synchronize a permanent upgrade.',shop:'Shop',shopDesc:'Spend scrap on repairs or upgrades.',risk:'Risky room',riskDesc:'Face elites for stronger rewards and fire rate.',supplyTag:'SUPPLY',riskTag:'HIGH RISK',kicker:'ENDLESS · WAVE ',cleared:' CLEARED',hint:'ARROWS · ENTER · OR TAP'}:language==='zh-Hant'?{title:'選擇你的',accent:'獎勵。',artifact:'神器',artifactDesc:'同步一項永久升級。',shop:'商店',shopDesc:'使用廢料修復或強化。',risk:'危險房間',riskDesc:'迎戰菁英，獲得更高獎勵與射速。',supplyTag:'補給',riskTag:'高風險',kicker:'無盡 · 第 ',cleared:' 波已清除',hint:'方向鍵 · ENTER · 或點擊'}:{title:'Wybierz',accent:'nagrodę.',artifact:'Artefakt',artifactDesc:'Zsynchronizuj stałe ulepszenie.',shop:'Sklep',shopDesc:'Wydaj złom na naprawę lub ulepszenie.',risk:'Ryzykowny pokój',riskDesc:'Pokonaj elity i zdobądź większą nagrodę oraz szybkostrzelność.',supplyTag:'ZAOPATRZENIE',riskTag:'RYZYKO',kicker:'ENDLESS · FALA ',cleared:' OCZYSZCZONA',hint:'STRZAŁKI · ENTER · LUB DOTKNIJ'};}
  // #(Wyświetla wybór artefaktu, sklepu albo ryzykownego pokoju.)
  function showEndlessReward(){const t=endlessRewardCopy();game.screen='endlessReward';game.endlessRewardIndex=0;game.endlessRewardWave=game.wave;keys.clear();game.touchAttack=false;resetStick();const choices=[['artifact',t.artifact,t.artifactDesc],['shop',t.shop,t.shopDesc],['risk',t.risk,t.riskDesc]];showModal('<div class="modal-kicker">'+t.kicker+String(game.wave).padStart(2,'0')+t.cleared+'</div><h1>'+t.title+'<br><em>'+t.accent+'</em></h1><div class="choice-grid">'+choices.map(([id,name,desc],index)=>'<button type="button" class="choice '+(index===0?'selected':'')+'" data-endless-reward="'+id+'"><div class="choice-tag">0'+(index+1)+' / '+(id==='risk'?t.riskTag:t.supplyTag)+'</div><h3>'+name+'</h3><p>'+desc+'</p><div class="choice-mark">'+(index===0?'[ ENTER ]':'[ ← → ]')+'</div></button>').join('')+'</div><div class="modal-actions"><div class="action-hint">'+t.hint+'</div></div>');updateUI();}
  // #(Włącza wybraną nagrodę.)
  function chooseEndlessReward(index){if(game.screen!=='endlessReward')return;const id=['artifact','shop','risk'][index];if(!id)return;if(id==='artifact'){game.riskReward=false;startUpgrade(false);}else if(id==='shop'){game.shopBought=[];showShop();}else startRiskRoom();}
  advanceProgress=function(dt){
    if(!game.endlessActive)return baseAdvanceProgressEndless(dt);
    if(game.screen!=='playing'||game.boss)return;
    if(game.spawnQueue.length){game.spawnQueue[0].delay-=dt;if(game.spawnQueue[0].delay<=0){const next=game.spawnQueue.shift();spawnEnemy(next.kind);}return;}
    if(game.enemies.length)return;game.waveWait+=dt;if(game.waveWait<1.1)return;game.waveWait=0;
    if(game.riskRoom){completeRiskRoom();return;}
    if(game.wave%5===0&&game.endlessRewardWave!==game.wave){game.endlessRewardWave=game.wave;showEndlessReward();return;}
    beginEndlessWave(game.wave+1);
  };

  // #(Dodaje skumulowane skalowanie liczby wrogów również do ryzykownych pokoi.)
  const baseStartRiskRoomEndless=startRiskRoom;
  startRiskRoom=function(){if(!game.endlessActive)return baseStartRiskRoomEndless();const wave=game.wave;game.endlessWaveForStats=wave;baseStartRiskRoomEndless();game.wave=wave;game.waves=Infinity;game.endlessHighestWave=Math.max(game.endlessHighestWave||1,wave);game.enemies=[];let count=ECHO_EPI.endlessEnemyCount(3,wave);if(game.directive==='encirclement')count*=3;if(game.directive==='hunter')count+=Math.ceil(count*.5);game.directiveApplyingRisk=true;try{for(let index=0;index<count;index++){spawnEnemy(pickFloorEnemy());const enemy=game.enemies[game.enemies.length-1];enemy.hp=Math.round(enemy.hp*1.75);enemy.maxHp=enemy.hp;enemy.damage=Math.round(enemy.damage*1.3);enemy.elite=true;enemy.r+=4;enemy.color=C.gold;}}finally{game.directiveApplyingRisk=false;game.endlessWaveForStats=null;}updateUI();};

  // #(Po nagrodzie artefaktu albo sklepu rozpoczyna kolejną falę.)
  const baseChooseUpgradeEndless=chooseUpgrade;
  chooseUpgrade=function(){if(!game.endlessActive)return baseChooseUpgradeEndless();const upgrade=game.upgradeChoices[game.choice];if(!upgrade)return;upgrade.apply(game.player);game.upgrades.push(upgrade.name);game.riskReward=false;beginEndlessWave(game.wave+1);};
  // #(Usuwa z wyboru artefaktu informację o pokoju kampanii.)
  const baseShowUpgradeEndless=showUpgrade;
  showUpgrade=function(){baseShowUpgradeEndless();if(!game.endlessActive)return;const en=language==='en',zh=language==='zh-Hant',kicker=ui.modalCard.querySelector('.modal-kicker'),copy=ui.modalCard.querySelector('.modal-copy');if(kicker)kicker.textContent=game.riskReward?(zh?'無盡 · 危險獎勵':en?'ENDLESS · RISK REWARD':'ENDLESS · NAGRODA ZA RYZYKO'):(zh?'無盡 · 第 '+String(game.wave).padStart(2,'0')+' 波':en?'ENDLESS · WAVE '+String(game.wave).padStart(2,'0'):'ENDLESS · FALA '+String(game.wave).padStart(2,'0'));if(copy){if(game.riskReward)copy.textContent=copy.textContent.replace(/kolejny pokój/gi,'kolejna fala').replace(/next room/gi,'next wave').replace(/下一個房間/g,'下一波');else copy.textContent=zh?'神器已同步，下一波即將開始。':en?'Synchronize this artifact to begin the next wave.':'Zsynchronizuj artefakt, aby rozpocząć następną falę.';}};
  const baseBuyShopEndless=buyShop;
  buyShop=function(index){if(game.endlessActive&&index===3){beginEndlessWave(game.wave+1);return;}baseBuyShopEndless(index);};
  // #(Pokazuje falę zamiast numeru pokoju na ekranie sklepu.)
  const baseShowShopEndless=showShop;
  showShop=function(){baseShowShopEndless();if(!game.endlessActive)return;const en=language==='en',zh=language==='zh-Hant',kicker=ui.modalCard.querySelector('.modal-kicker'),copy=ui.modalCard.querySelector('.modal-copy');if(kicker)kicker.textContent=(zh?'無盡 · 第 ':en?'ENDLESS · WAVE ':'ENDLESS · FALA ')+String(game.wave).padStart(2,'0')+(zh?' 波':'');if(copy)copy.textContent=zh?'每項商品在本次補給中限購一次。':en?'Wave '+game.wave+' cleared. Each item can be bought once at this stop.':'Oczyszczono falę '+game.wave+'. Każdy towar można kupić raz podczas tego postoju.';};

  // #(Obsługuje wybór nagrody w oknie dotykiem i klawiaturą.)
  ui.modal.addEventListener('click',event=>{const button=event.target.closest('[data-endless-reward]');if(!button||game.screen!=='endlessReward')return;event.preventDefault();event.stopImmediatePropagation();chooseEndlessReward(['artifact','shop','risk'].indexOf(button.dataset.endlessReward));},true);
  document.addEventListener('keydown',event=>{if(game.screen!=='endlessReward')return;if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter','Space','Escape'].includes(event.code))return;event.preventDefault();event.stopImmediatePropagation();if(event.code==='Escape')return;if(event.code==='Enter'||event.code==='Space'){chooseEndlessReward(game.endlessRewardIndex||0);return;}const step=event.code==='ArrowLeft'||event.code==='ArrowUp'?-1:1;game.endlessRewardIndex=((game.endlessRewardIndex||0)+step+3)%3;ui.modalCard.querySelectorAll('[data-endless-reward]').forEach((button,index)=>{button.classList.toggle('selected',index===game.endlessRewardIndex);button.querySelector('.choice-mark').textContent=index===game.endlessRewardIndex?'[ ENTER ]':'[ ← → ]';});},true);

  // #(Pokazuje Endless i nieskończony licznik fal w HUD.)
  const baseUpdateUIEndless=updateUI;
  updateUI=function(){baseUpdateUIEndless();if(!game.player||!game.endlessActive)return;ui.floor.parentElement.firstChild.textContent=language==='en'?'ENDLESS':language==='zh-Hant'?'無盡':'ENDLESS';ui.floor.textContent='∞';ui.room.parentElement.firstChild.textContent=language==='en'?'WAVE':language==='zh-Hant'?'波次':'FALA';ui.room.textContent=String(game.wave).padStart(2,'0');ui.wave.textContent=String(game.wave).padStart(2,'0')+' / ∞';};

  // #(Zapisuje i pokazuje najwyższą falę zakończonego runu.)
  const baseShowResultEndless=showResult;
  showResult=function(win){baseShowResultEndless(win);if(!game.endlessActive)return;const en=language==='en',zh=language==='zh-Hant',label=zh?'最高波次':en?'HIGHEST WAVE':'NAJWYŻSZA FALA',stat=document.createElement('div');stat.className='result-stat';stat.textContent=label;const value=document.createElement('b');value.textContent=String(game.endlessHighestWave||game.wave||1);stat.append(value);ui.modalCard.querySelector('.result-stats')?.append(stat);const summary=ui.modalCard.querySelector('.run-summary');if(summary){const row=document.createElement('div');row.className='run-summary-row';row.innerHTML='<span>'+label+'</span><b>'+String(game.endlessHighestWave||game.wave||1)+'</b>';summary.append(row);}};
})();
