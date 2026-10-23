  const dynamicLocaleNodes=[ui.phase,ui.sector,ui.hint,ui.objective,ui.objectiveText,ui.floor,ui.room,ui.wave,ui.hpv,ui.energyv,ui.level,ui.kills,ui.xpLabel,ui.upgradeCount,ui.shot,ui.nova,ui.dash,ui.touchDashLabel,ui.touchNovaLabel,ui.weaponAttackName,ui.weaponAttackDesc,ui.weaponSpecialName,ui.weaponSpecialDesc,ui.bossPhase,ui.scrapValue],dynamicLocaleSources=new WeakMap();

// #(Tłumaczy dynamiczne elementy interfejsu.)
function localizeDynamicUi(){for(const el of dynamicLocaleNodes){const previous=dynamicLocaleSources.get(el),current=el.textContent,raw=previous&&current===previous.localized?previous.source:current,translated=localizeText(raw);dynamicLocaleSources.set(el,{source:raw,localized:translated});if(raw!==translated)el.textContent=translated;}}
  updateUI=function(){baseUpdateUI();if(game.player)ui.room.textContent=String(game.room).padStart(2,'0')+' / '+String(ECHO_EPI.roomsForFloor(game.floor)).padStart(2,'0');localizeDynamicUi();};
  showWeaponSelect=function(){baseShowWeaponSelect();};
  showResult=function(win){baseShowResult(win);};
  showTitle();

  // Run-balance extensions are kept together so the offline build remains a single file.
  const applyRiskFireRateReward=(currentBonus,rolledPercent)=>{const current=clamp(Number(currentBonus)||0,0,.75),rolled=Math.max(0,Math.round(Number(rolledPercent)||0)),appliedPercent=Math.min(rolled,Math.floor(Math.max(0,(.75-current)*100)+1e-8)),overflowScrap=Math.floor((rolled-appliedPercent)/5);return{bonus:Math.min(.75,current+appliedPercent/100),appliedPercent,overflowScrap};};
  completeRiskRoom=function(){if(!game.riskRoom||!game.player)return;game.riskRoom=false;game.scrap+=30;const reward=applyRiskFireRateReward(game.player.fireRateBonus,Math.round(rand(10,25)));game.player.fireRateBonus=reward.bonus;game.riskRewardRate=reward.appliedPercent;game.riskRewardScrap=reward.overflowScrap;game.scrap+=reward.overflowScrap;toast(t('risk.completed',{rate:reward.appliedPercent}));startUpgrade(true);};
  const baseShowUpgrade=showUpgrade;
  showUpgrade=function(){baseShowUpgrade();if(!game.riskReward)return;const copy=ui.modalCard.querySelector('.modal-copy');if(!copy)return;const overflow=game.riskRewardScrap||0;copy.textContent=t(overflow?'risk.rewardOverflow':'risk.reward',{rate:game.riskRewardRate,scrap:overflow});};
  game.riskRewardScrap=0;

  // Deterministic floor objectives add variety without changing the numbered campaign.
  const roomObjective=(floor,room)=>{if(floor>=4){return room===1?'survival':'relay';}if(floor===1&&room===2||floor===2&&room===4||floor===3&&room===3)return'survival';if(floor===1&&room===4||floor===2&&room===2||floor===3&&room===5)return'relay';return'waves';};
  game.objectiveRun=null;
  const baseEnterRoomObjectives=enterRoom;
  enterRoom=function(room){game.objectiveRun=null;baseEnterRoomObjectives(room);if(game.room===ECHO_EPI.bossRoomForFloor(game.floor)||!game.player)return;const type=roomObjective(game.floor,game.room),relayMaxHp=Math.round(100*floorMultipliers().damage*(1+(game.room-1)*.08));game.objectiveRun={type,remaining:45,relayHp:relayMaxHp,relayMaxHp,target:null};if(type==='survival'){game.wave=1;game.waves=2;ui.phase.textContent=t('objective.survivePhase',{seconds:45});ui.objective.textContent=t('objective.surviveTitle');ui.objectiveText.textContent=t('objective.surviveIntro');}else if(type==='relay'){ui.phase.textContent=t('objective.relayPhase');ui.objective.textContent=t('objective.relayTitle');ui.objectiveText.textContent=t('objective.relayIntro');}updateUI();};
  const baseFreshRunObjectives=freshRun;
  freshRun=function(){game.objectiveRun=null;baseFreshRunObjectives();};
// #(Zwraca osobny cel wrogów, bez zmieniania pozycji ani statystyk gracza.)
function getEnemyTarget(){const o=game.objectiveRun;if(!o||o.type!=='relay')return game.player;if(!o.target)o.target={x:W/2,y:H/2,r:24,lastMoveX:0,lastMoveY:0,dash:0,energy:0};o.target.x=W/2;o.target.y=H/2;o.target.maxHp=o.relayMaxHp;o.target.hp=o.relayHp;return o.target;}
// #(Kieruje obrażenia na przekaźnik albo gracza.)
function damageEnemyTarget(amount,source){if(game.objectiveRun?.type==='relay')damageRelay(amount,source);else damagePlayer(amount);}

// #(Nalicza obrażenia obiektu chronionego.)
function damageRelay(amount,source){const o=game.objectiveRun;if(!o||o.type!=='relay'||game.screen!=='playing')return;if(source){const now=performance.now();if(source.relayLastHit!==undefined&&now-source.relayLastHit<720)return;source.relayLastHit=now;}o.relayHp=Math.max(0,o.relayHp-Math.max(0,Number(amount)||0));game.shake=Math.max(game.shake,4);game.flash=Math.max(game.flash,.07);if(o.relayHp<=0){toast(t('objective.relayLost'));loseRun();}}
  const baseAdvanceProgressObjective=advanceProgress;
  advanceProgress=function(dt){const o=game.objectiveRun;if(!o||game.screen!=='playing'||game.boss){baseAdvanceProgressObjective(dt);return;}if(o.type==='relay'){baseAdvanceProgressObjective(dt);if(game.screen!=='playing')game.objectiveRun=null;return;}if(o.type!=='survival'){baseAdvanceProgressObjective(dt);if(game.screen!=='playing')game.objectiveRun=null;return;}o.remaining=Math.max(0,o.remaining-dt);if(o.remaining<=0){game.enemies=[];game.shots=[];game.enemyShots=[];game.hazards=[];game.spawnQueue=[];game.objectiveRun=null;openRoute();return;}if(game.spawnQueue.length){game.spawnQueue[0].delay-=dt;if(game.spawnQueue[0].delay<=0)spawnEnemy(game.spawnQueue.shift().kind);return;}if(game.enemies.length)return;game.waveWait+=dt;if(game.waveWait<1.1)return;game.waveWait=0;spawnWave(game.floor,game.wave===1?2:1);};
  const baseDrawBackgroundObjective=drawBackground;
  drawBackground=function(){baseDrawBackgroundObjective();const o=game.objectiveRun;if(!o||game.screen!=='playing')return;if(o.type==='relay'){ctx.save();glowCircle(W/2,H/2,24,o.relayHp<o.relayMaxHp*.35?C.pink:C.cyan,false);ctx.fillStyle=o.relayHp<o.relayMaxHp*.35?C.pink:C.cyan;ctx.font=language==='zh-Hant'?'20px "Noto Sans TC",sans-serif':'20px monospace';ctx.textAlign='center';ctx.fillText(t('objective.relayHealth',{hp:Math.ceil(o.relayHp),max:o.relayMaxHp}),W/2,H/2-34);ctx.restore();}else if(o.type==='survival'){ctx.save();ctx.fillStyle=C.gold;ctx.font=language==='zh-Hant'?'24px "Noto Sans TC",sans-serif':'24px monospace';ctx.textAlign='center';ctx.fillText(t('objective.surviveTimer',{seconds:Math.ceil(o.remaining)}),W/2,48);ctx.restore();}};
  const baseUpdateUIObjectives=updateUI;
  updateUI=function(){baseUpdateUIObjectives();const o=game.objectiveRun;if(!o||!game.player)return;if(o.type==='relay')ui.objectiveText.textContent=t('objective.relayIntegrity',{hp:Math.ceil(o.relayHp),max:o.relayMaxHp});else if(o.type==='survival')ui.objectiveText.textContent=t('objective.surviveRemaining',{seconds:Math.ceil(o.remaining)});};

  // Artifact pairings are derived from stable run-local IDs, never from display text.
  game.upgradeIds=[];
  const artifactIds={'Sanguine Circuit':'sanguine','Rail Conductor':'rail','Phase Lattice':'phase','Deep Reservoir':'reservoir','Afterimage':'afterimage','Echo Chamber':'echo'};
  const isSynergyActive=id=>{const ids=game.upgradeIds||[];return id==='vitalEcho'?ids.includes('sanguine')&&ids.includes('echo'):id==='phaseBloom'?ids.includes('afterimage')&&ids.includes('phase'):id==='railCapacitor'?ids.includes('rail')&&ids.includes('reservoir'):false;};
  const baseFreshRunSynergies=freshRun;
  freshRun=function(){game.upgradeIds=[];baseFreshRunSynergies();};
// #(Przyznaje bonus oraz zapisuje artefakt dla historii i synergii w każdym trybie.)
function grantRunUpgrade(upgrade){if(!upgrade)return false;upgrade.apply(game.player);game.upgrades.push(upgrade.name);const id=artifactIds[upgrade.name];if(id)game.upgradeIds.push(id);return true;}
  const baseHealNovaSynergy=healNovaOnce;
  healNovaOnce=function(p,state){if(state&&state.pending&&p&&p.specialHeal>0&&isSynergyActive('vitalEcho')){state.pending=false;p.hp=Math.min(p.maxHp,p.hp+20);return;}baseHealNovaSynergy(p,state);};
  const baseNovaSynergy=nova;
  nova=function(){const p=game.player,boost=!!(p&&game.weapon.id==='rail'&&isSynergyActive('railCapacitor'));if(!boost){baseNovaSynergy();return;}const power=p.specialPower;p.specialPower=power*1.25;try{baseNovaSynergy();}finally{p.specialPower=power;}};
  const baseDashSynergy=dash;
  dash=function(){const p=game.player;if(!p){baseDashSynergy();return;}const enabled=isSynergyActive('phaseBloom')&&game.dashCooldown<=0,oldX=p.x,oldY=p.y;baseDashSynergy();if(!enabled||game.screen!=='playing')return;const landing={x:p.x,y:p.y};if(landing.x===oldX&&landing.y===oldY)return;burst(landing.x,landing.y,C.cyan,18,115);for(const e of [...game.enemies])if(dist(e,landing)<=72)hurtEnemy(e,game.weapon.damage*2);};
  const baseStatsRowsSynergy=statsRows;
  statsRows=function(){let rows=baseStatsRowsSynergy();const active=[];if(isSynergyActive('vitalEcho'))active.push(t('synergy.vital'));if(isSynergyActive('phaseBloom'))active.push(t('synergy.phase'));if(isSynergyActive('railCapacitor'))active.push(t('synergy.rail'));if(active.length)rows+=`<div class="stat-row"><span>${t('synergy.title')}</span><b>${active.length}</b><em>${active.join('<br>')}</em></div>`;return rows;};

  // Optional post-campaign directives extend metadata additively and never alter old unlocks.