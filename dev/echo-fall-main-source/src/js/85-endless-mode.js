// #(Dodaje tryb bez bossów, z nieskończonymi falami i nagrodami co pięć fal.)
(()=>{
  const baseRenderRunSetup=renderRunSetup;
  renderRunSetup=function(){
    baseRenderRunSetup();
    if(game.screen!=='setup'||game.setupStep!==1)return;
    const grid=ui.modalCard.querySelector('.difficulty-grid');if(!grid||grid.querySelector('[data-setup-difficulty="endless"]'))return;
    const copy={"tag":th('modes.endless.choice.tag'),"name":th('modes.endless.choice.name'),"desc":th('modes.endless.choice.desc')};
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
  freshRun=function(){game.endlessActive=game.difficulty==='endless';game.endlessHighestWave=1;game.endlessRewardWave=null;game.endlessWaveForStats=null;baseFreshRunEndless();if(game.endlessActive){game.floor=1;game.room=1;game.wave=1;game.waves=Infinity;game.endlessHighestWave=1;ui.phase.textContent=t('modes.endless.hostiles',{wave:'01'});ui.room.textContent=t('modes.endless.name');updateUI();}};

  // #(Dobiera przeciwników z kolejnych pul co pięć fal.)
  const basePickFloorEnemyEndless=pickFloorEnemy;
  pickFloorEnemy=function(){if(game.difficulty!=='endless')return basePickFloorEnemyEndless();const roster=FLOOR_ROSTER[ECHO_EPI.endlessRosterTier(game.wave)]||FLOOR_ROSTER[3];return roster[Math.floor(Math.random()*roster.length)];};

  // #(Skaluje HP i obrażenia o 3 procent na falę, pozostawiając prędkość bez zmian.)
  const baseScaledCombatStatsEndless=scaledCombatStats;
  scaledCombatStats=function(base){const stats=baseScaledCombatStatsEndless(base);if(game.difficulty!=='endless')return stats;return ECHO_EPI.scaleEndlessStats(stats,game.endlessWaveForStats||game.wave);};

  // #(Zmniejsza przyrost maksymalnego HP za awans tylko w Endless.)
  const baseHurtEnemyEndless=hurtEnemy;
  hurtEnemy=function(enemy,damage,attack){const player=game.player,startingLevel=player?.level;baseHurtEnemyEndless(enemy,damage,attack);if(game.difficulty!=='endless'||!player||player.level<=startingLevel)return;const correction=(5-ECHO_EPI.endlessLevelHpGain(game.difficulty))*(player.level-startingLevel);player.maxHp-=correction;player.hp=Math.max(0,player.hp-correction);};

  // #(Podnosi ceny sklepu Endless o 25 procent co dziesięć fal.)
  const baseShopOfferEndless=shopOffer;
  shopOffer=function(index){const offer=baseShopOfferEndless(index);return game.endlessActive?ECHO_EPI.scaleEndlessShopOffer(offer,game.wave):offer;};

  // #(Planuje stałą bazową liczbę wrogów z uzgodnionymi premiami wyzwań.)
  const baseSpawnWaveEndless=spawnWave;
  spawnWave=function(_floor,wave){
    if(game.difficulty!=='endless')return baseSpawnWaveEndless.apply(this,arguments);
    game.endlessActive=true;game.floor=1;game.wave=Math.max(1,Math.floor(wave)||1);game.waves=Infinity;game.endlessHighestWave=Math.max(game.endlessHighestWave||1,game.wave);game.endlessWaveForStats=null;
    let count=ECHO_EPI.endlessEnemyCount(4,game.wave-1);if(game.directive==='hunter')count+=Math.ceil(count*.5);if(game.directive==='encirclement')count*=3;
    game.spawnQueue=Array.from({length:count},(_,index)=>({kind:pickFloorEnemy(),delay:index===0?.3:rand(.4,1.2)}));game.directiveSpawnCount=0;game.waveWait=0;ui.phase.textContent=t('modes.endless.hostiles',{wave:String(game.wave).padStart(2,'0')});ui.objective.textContent=t('modes.endless-mode.survive.the.wave');ui.objectiveText.textContent=t('modes.endless-mode.clear.all.hostiles.to.continue');updateUI();
  };

  // #(Rozpoczyna następną falę albo pokazuje nagrodę po fali piątej.)
  const baseAdvanceProgressEndless=advanceProgress;
  // #(Uruchamia kolejną falę po wybraniu nagrody.)
  function beginEndlessWave(wave){game.endlessActive=true;game.floor=1;game.room=1;game.wave=Math.max(1,Math.floor(wave)||1);game.waves=Infinity;game.boss=null;game.riskRoom=false;game.riskReward=false;game.endlessWaveForStats=null;game.waveWait=0;game.enemies=[];game.shots=[];game.enemyShots=[];game.hazards=[];game.spawnQueue=[];game.screen='playing';hideModal();ui.boss.classList.remove('show');spawnWave(1,game.wave);toast(t('modes.endless.wave',{wave:String(game.wave).padStart(2,'0')}));updateUI();}
  // #(Zwraca tekst nagród w aktywnym języku.)
  function endlessRewardCopy(){return translationGroup("endless.reward");}
  // #(Wyświetla wybór artefaktu, sklepu albo ryzykownego pokoju.)
  function showEndlessReward(){const copyText=endlessRewardCopy();game.screen='endlessReward';game.endlessRewardIndex=0;game.endlessRewardWave=game.wave;keys.clear();game.touchAttack=false;resetStick();const choices=[['artifact',copyText.artifact,copyText.artifactDesc],['shop',copyText.shop,copyText.shopDesc],['risk',copyText.risk,copyText.riskDesc]];showModal('<div class="modal-kicker">'+copyText.kicker+String(game.wave).padStart(2,'0')+copyText.cleared+'</div><h1>'+copyText.title+'<br><em>'+copyText.accent+'</em></h1><div class="choice-grid">'+choices.map(([id,name,desc],index)=>'<button type="button" class="choice '+(index===0?'selected':'')+'" data-endless-reward="'+id+'"><div class="choice-tag">0'+(index+1)+' / '+(id==='risk'?copyText.riskTag:copyText.supplyTag)+'</div><h3>'+name+'</h3><p>'+desc+'</p><div class="choice-mark">'+(index===0?'[ ENTER ]':'[ ← → ]')+'</div></button>').join('')+'</div><div class="modal-actions"><div class="action-hint">'+copyText.hint+'</div></div>');updateUI();}
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
  chooseUpgrade=function(){if(!game.endlessActive)return baseChooseUpgradeEndless();const upgrade=game.upgradeChoices[game.choice];if(!upgrade)return;grantRunUpgrade(upgrade);game.riskReward=false;beginEndlessWave(game.wave+1);};
  // #(Usuwa z wyboru artefaktu informację o pokoju kampanii.)
  const baseShowUpgradeEndless=showUpgrade;
  showUpgrade=function(){baseShowUpgradeEndless();if(!game.endlessActive)return;const kicker=ui.modalCard.querySelector('.modal-kicker'),copy=ui.modalCard.querySelector('.modal-copy');if(kicker)kicker.textContent=game.riskReward?(t('modes.endless-mode.endless.risk.reward')):t('modes.endless.wave',{wave:String(game.wave).padStart(2,'0')});if(copy){if(!game.riskReward)copy.textContent=t('modes.endless-mode.synchronize.this.artifact.to.begin.the.next.wave');}};
  const baseBuyShopEndless=buyShop;
  buyShop=function(index){if(game.endlessActive&&index===3){beginEndlessWave(game.wave+1);return;}baseBuyShopEndless(index);};
  // #(Pokazuje falę zamiast numeru pokoju na ekranie sklepu.)
  const baseShowShopEndless=showShop;
  showShop=function(){baseShowShopEndless();if(!game.endlessActive)return;const kicker=ui.modalCard.querySelector('.modal-kicker'),copy=ui.modalCard.querySelector('.modal-copy');if(kicker)kicker.textContent=t('modes.endless.wave',{wave:String(game.wave).padStart(2,'0')});if(copy)copy.textContent=t('modes.endless.shop',{wave:game.wave});};

  // #(Obsługuje wybór nagrody w oknie dotykiem i klawiaturą.)
  ui.modal.addEventListener('click',event=>{const button=event.target.closest('[data-endless-reward]');if(!button||game.screen!=='endlessReward')return;event.preventDefault();event.stopImmediatePropagation();chooseEndlessReward(['artifact','shop','risk'].indexOf(button.dataset.endlessReward));},true);
  document.addEventListener('keydown',event=>{if(game.screen!=='endlessReward')return;if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter','Space','Escape'].includes(event.code))return;event.preventDefault();event.stopImmediatePropagation();if(event.code==='Escape')return;if(event.code==='Enter'||event.code==='Space'){chooseEndlessReward(game.endlessRewardIndex||0);return;}const step=event.code==='ArrowLeft'||event.code==='ArrowUp'?-1:1;game.endlessRewardIndex=((game.endlessRewardIndex||0)+step+3)%3;ui.modalCard.querySelectorAll('[data-endless-reward]').forEach((button,index)=>{button.classList.toggle('selected',index===game.endlessRewardIndex);button.querySelector('.choice-mark').textContent=index===game.endlessRewardIndex?'[ ENTER ]':'[ ← → ]';});},true);

  // #(Pokazuje Endless i nieskończony licznik fal w HUD.)
  const baseUpdateUIEndless=updateUI;
  updateUI=function(){baseUpdateUIEndless();if(!game.player||!game.endlessActive)return;ui.floor.parentElement.firstChild.textContent=t('modes.endless-mode.endless');ui.floor.textContent='∞';ui.room.parentElement.firstChild.textContent=t('modes.endless-mode.wave');ui.room.textContent=String(game.wave).padStart(2,'0');ui.wave.textContent=String(game.wave).padStart(2,'0')+' / ∞';};

  // #(Zapisuje i pokazuje najwyższą falę zakończonego runu.)
  const baseShowResultEndless=showResult;
  showResult=function(win){baseShowResultEndless(win);if(!game.endlessActive)return;const label=t('modes.endless-mode.highest.wave'),stat=document.createElement('div');stat.className='result-stat';stat.textContent=label;const value=document.createElement('b');value.textContent=String(game.endlessHighestWave||game.wave||1);stat.append(value);ui.modalCard.querySelector('.result-stats')?.append(stat);const summary=ui.modalCard.querySelector('.run-summary');if(summary){const row=document.createElement('div');row.className='run-summary-row';row.innerHTML='<span>'+escapeLocaleHtml(label)+'</span><b>'+String(game.endlessHighestWave||game.wave||1)+'</b>';summary.append(row);}};
})();
