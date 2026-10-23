
(()=>{
  'use strict';
  const W=960,H=600,TAU=Math.PI*2,MAX_FLOORS=3,ROOMS_PER_FLOOR=6,BOSS_ROOM=6,HUD_REFRESH_MS=50,META_KEY='echofall.save.v1',LANG_KEY='echofall.language.v1',CONTROL_KEY='echofall.controls.v1',SETTINGS_KEY='echofall.settings.v1';let viewScale=1,viewX=0,viewY=0,lastUiUpdate=0,language=(()=>{try{const saved=localStorage.getItem(LANG_KEY);return saved==='en'||saved==='zh-Hant'?saved:'pl';}catch(_){return 'pl';}})();
  const DEFAULT_CONTROLS={moveUp:'KeyW',moveDown:'KeyS',moveLeft:'KeyA',moveRight:'KeyD',aimUp:'KeyI',aimDown:'KeyK',aimLeft:'KeyJ',aimRight:'KeyL',attack:'KeyZ',nova:'KeyX',blink:'Space'},CONTROL_ACTIONS=['moveUp','moveDown','moveLeft','moveRight','aimUp','aimDown','aimLeft','aimRight','attack','nova','blink'],RESERVED_CONTROL_KEYS=new Set(['Escape','Enter','Tab','Backspace','Delete','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyC','KeyM','KeyH','KeyV','KeyR']);
  const controls=(()=>{try{const saved=JSON.parse(localStorage.getItem(CONTROL_KEY)||'null');if(!saved||typeof saved!=='object')return {...DEFAULT_CONTROLS};const next={...DEFAULT_CONTROLS},used=new Set();for(const action of CONTROL_ACTIONS){const code=saved[action];if(typeof code==='string'&&/^(Key[A-Z]|Digit[0-9]|Space)$/.test(code)&&!RESERVED_CONTROL_KEYS.has(code)&&!used.has(code)){next[action]=code;used.add(code);}}return next;}catch(_){return {...DEFAULT_CONTROLS};}})();
  const desktopControlsAvailable=window.matchMedia('(pointer:fine)').matches,touchControlsAvailable=window.matchMedia('(pointer:coarse)').matches;let pendingControlAction=null,saveTransferFeedback='';const settings=(()=>{try{const saved=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}');return{reduceEffects:!!saved.reduceEffects,pcAutoAim:saved.pcAutoAim!==false,volume:Number.isFinite(saved.volume)?Math.max(0,Math.min(100,Math.round(saved.volume))):100,touchScale:Number.isFinite(saved.touchScale)?Math.max(70,Math.min(130,Math.round(saved.touchScale))):100,touchOpacity:Number.isFinite(saved.touchOpacity)?Math.max(35,Math.min(100,Math.round(saved.touchOpacity))):85};}catch(_){return{reduceEffects:false,pcAutoAim:true,volume:100,touchScale:100,touchOpacity:85};}})();
// #(Ustawia rozmiar i przezroczystość sterowania dotykowego.)
function applyTouchSettings(){document.documentElement.style.setProperty('--touch-scale',(settings.touchScale/100).toFixed(2));document.documentElement.style.setProperty('--touch-opacity',(settings.touchOpacity/100).toFixed(2));}applyTouchSettings();
// #(Zapisuje ustawienia na urządzeniu.)
function saveSettings(){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));return true;}catch(_){return false;}}
  /*__ECHO_I18N__*/
// #(Zwraca tekst po stałym kluczu; brak wpisu korzysta z języka angielskiego.)
function t(key, params={}) {
  const locale=language==='zh-Hant'?'zh-TW':language;
  const text=I18N_MESSAGES[locale]?.[key]??I18N_MESSAGES.en[key]??key;
  return text.replace(/\{([a-zA-Z0-9_]+)\}/g,(token,name)=>Object.prototype.hasOwnProperty.call(params,name)?String(params[name]):token);
}
// #(Chroni tekst umieszczany w HTML; ikony, klasy i znaczniki pozostają w kodzie.)
function escapeLocaleHtml(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function th(key,params={}){return escapeLocaleHtml(t(key,params));}
// #(Pobiera grupę tekstów ustawień bez kopiowania warunków dla języków.)
function translationGroup(prefix){const result={};for(const key of Object.keys(I18N_MESSAGES.en))if(key.startsWith(prefix+'.'))result[key.slice(prefix.length+1)]=t(key);return result;}
// #(Tłumaczy oznaczone elementy oraz opis sterowania dotykowego w CSS.)
function applyTranslations(root=document){
  for(const node of [...(root.matches?.('[data-i18n]')?[root]:[]),...root.querySelectorAll('[data-i18n]')])node.textContent=t(node.dataset.i18n);
  document.querySelector('.stage-note')?.setAttribute('data-touch-caption',t('hud.touchActive'));
}
// #(Dopasowuje wyłącznie całe napisy; nie podmienia słów wewnątrz innych wyrazów.)
const localeAliases=new Map(Object.entries(I18N_ALIASES)),localePatterns=[];
for(const [key,english] of Object.entries(I18N_MESSAGES.en)){
  if(key.startsWith('legacy.'))continue;
  for(const dictionary of Object.values(I18N_MESSAGES)){
    const source=dictionary[key];if(typeof source!=='string'||!source.trim())continue;
    if(!source.includes('{')){localeAliases.set(source.trim(),key);localeAliases.set(source.trim().toUpperCase(),key);continue;}
    if(source.replace(/\{\w+\}/g,'').trim().length<4)continue;
    const names=[];let offset=0,pattern='';
    const escapeRegex=text=>text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    for(const match of source.matchAll(/\{(\w+)\}/g)){pattern+=escapeRegex(source.slice(offset,match.index))+'(.+?)';names.push(match[1]);offset=match.index+match[0].length;}
    pattern+=escapeRegex(source.slice(offset));localePatterns.push({key,names,regex:new RegExp('^'+pattern+'$')});
  }
}
function localizeText(value){
  if(typeof value!=='string'||!value.trim())return value;
  const raw=value.trim(),key=localeAliases.get(raw);
  let translated=key?t(key):null;
  if(translated===null)for(const rule of localePatterns){const match=raw.match(rule.regex);if(match){translated=t(rule.key,Object.fromEntries(rule.names.map((name,index)=>[name,match[index+1]])));break;}}
  return translated===null?value:value.slice(0,value.indexOf(raw))+translated+value.slice(value.indexOf(raw)+raw.length);
}
const originalTextNodes=new WeakMap(),originalAttributes=new WeakMap();
// #(Odświeża teksty DOM, zachowując aktualne wartości i strukturę przycisków.)
function localizePage(root=document){
  applyTranslations(root);document.documentElement.lang=language;document.title=t('page.title');
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.parentElement?.closest('script,style,noscript,textarea,code,pre,[data-i18n],[data-i18n-ready],[data-control-label],[data-control-group],kbd,.keycap,.key')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;}});
  let node;while((node=walker.nextNode())){const old=originalTextNodes.get(node),current=node.nodeValue,source=old&&current===old.localized?old.source:current,localized=localizeText(source);originalTextNodes.set(node,{source,localized});if(current!==localized)node.nodeValue=localized;}
  for(const el of root.querySelectorAll('[aria-label],[title],[placeholder]'))for(const attr of ['aria-label','title','placeholder'])if(el.hasAttribute(attr)&&!el.closest('[data-i18n-ready]')){let records=originalAttributes.get(el);if(!records){records={};originalAttributes.set(el,records);}const old=records[attr],current=el.getAttribute(attr),source=old&&current===old.localized?old.source:current,localized=localizeText(source);records[attr]={source,localized};el.setAttribute(attr,localized);}
}
// #(Tłumaczy treść komunikatu HTML przez węzły tekstowe, bez naruszania znaczników.)
function localizeHtml(value){const template=document.createElement('template');template.innerHTML=localizeText(value);localizePage(template.content);return template.innerHTML;}

// #(Zapisuje język i odświeża interfejs.)
function setLanguage(next){if(next!=='pl'&&next!=='en'&&next!=='zh-Hant')return;language=next;try{localStorage.setItem(LANG_KEY,language);}catch(_){}localizePage();refreshControlHints();updateUI();setFeed(feedSource,feedStatusSource);if(game.toastTimer>0)ui.toast.textContent=localizeText(toastSource);updateFullscreenUi();const soundLabel=t(game.soundOn?'accessibility.mute':'accessibility.unmute');document.querySelector('#soundButton').setAttribute('aria-label',soundLabel);showSettings();}

// #(Otwiera ekran ustawień.)
function openSettings(){game.returnScreen=game.screen;game.screen='settings';showSettings();}

// #(Formatuje nazwę przypisanego klawisza.)
function controlKeyLabel(code){if(code==='Space')return t('controls.space');if(code.startsWith('Key'))return code.slice(3);if(code.startsWith('Digit'))return code.slice(5);return code;}

// #(Odświeża podpowiedzi sterowania.)
function refreshControlHints(root=document){root.querySelectorAll('[data-control-label]').forEach(el=>{const action=el.dataset.controlLabel;if(controls[action])el.textContent=el.classList.contains('keycap')&&controls[action]==='Space'?'␣':controlKeyLabel(controls[action]);});root.querySelectorAll('[data-control-group]').forEach(el=>{el.textContent=el.dataset.controlGroup.split(',').map(action=>controlKeyLabel(controls[action])).join(' ');});}

// #(Zapisuje przypisania klawiszy.)
function saveControls(){try{localStorage.setItem(CONTROL_KEY,JSON.stringify(controls));return true;}catch(_){return false;}}

// #(Buduje i wyświetla ustawienia.)
function showSettings(feedback=''){const zh=language==='zh-Hant',en=language==='en',transfer=saveTransferMessages(),copy=translationGroup("settings.language"),labels=translationGroup("settings.controls"),audioLabels=translationGroup("settings.audio"),audioSection='<section class="control-settings audio-settings"><h2>'+escapeLocaleHtml(audioLabels.section)+'</h2><label class="audio-volume-label" for="settingsVolume">'+escapeLocaleHtml(audioLabels.volume)+'</label><div class="audio-volume-row"><input id="settingsVolume" type="range" min="0" max="100" step="1" value="'+settings.volume+'" data-volume aria-label="'+escapeLocaleHtml(audioLabels.volume)+'"><output data-volume-value>'+settings.volume+'%</output></div></section>',touchLabels=translationGroup("settings.touch"),touchSettings=touchControlsAvailable?'<section class="control-settings touch-settings"><h2>'+escapeLocaleHtml(touchLabels.section)+'</h2><label class="touch-setting-label" for="touchScale">'+escapeLocaleHtml(touchLabels.size)+'</label><div class="touch-setting-row"><input id="touchScale" type="range" min="70" max="130" step="1" value="'+settings.touchScale+'" data-touch-setting="touchScale" aria-label="'+escapeLocaleHtml(touchLabels.size)+'"><output data-touch-value="touchScale">'+settings.touchScale+'%</output></div><label class="touch-setting-label" for="touchOpacity">'+escapeLocaleHtml(touchLabels.opacity)+'</label><div class="touch-setting-row"><input id="touchOpacity" type="range" min="35" max="100" step="1" value="'+settings.touchOpacity+'" data-touch-setting="touchOpacity" aria-label="'+escapeLocaleHtml(touchLabels.opacity)+'"><output data-touch-value="touchOpacity">'+settings.touchOpacity+'%</output></div></section>':'',optionLabels=translationGroup("settings.gameplay");const toggle=(key,label,value)=>'<div class="control-binding"><span>'+label+'</span><button type="button" class="settings-action" data-setting="'+key+'" aria-pressed="'+value+'">'+(value?optionLabels.on:optionLabels.off)+'</button></div>',options='<section class="control-settings"><h2>'+escapeLocaleHtml(optionLabels.section)+'</h2><div class="control-bindings">'+toggle('reduceEffects',optionLabels.reduce,settings.reduceEffects)+(desktopControlsAvailable?toggle('pcAutoAim',optionLabels.aim,settings.pcAutoAim):'')+'</div></section>',bindings=desktopControlsAvailable?'<section class="control-settings"><h2>'+escapeLocaleHtml(labels.section)+'</h2><p>'+escapeLocaleHtml(labels.hint)+'</p><div class="control-bindings">'+CONTROL_ACTIONS.map(action=>'<div class="control-binding"><span>'+labels[action]+'</span><button type="button" class="settings-action '+(pendingControlAction===action?'binding-waiting':'')+'" data-bind-control="'+action+'">'+(pendingControlAction===action?labels.waiting:controlKeyLabel(controls[action]))+'</button></div>').join('')+'</div><p class="control-feedback" id="controlFeedback" role="status">'+escapeLocaleHtml(feedback)+'</p><button type="button" class="settings-action control-reset" data-reset-controls>'+escapeLocaleHtml(labels.reset)+'</button></section>':'';const unlockLabels=translationGroup("settings.unlock"),unlockPanel='<section class="control-settings"><h2>'+escapeLocaleHtml(unlockLabels.title)+'</h2><form class="unlock-row" data-unlock-form><input class="unlock-code" type="password" name="unlockCode" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="'+escapeLocaleHtml(unlockLabels.placeholder)+'" aria-label="'+escapeLocaleHtml(unlockLabels.placeholder)+'" required><button type="submit" class="settings-action">'+escapeLocaleHtml(unlockLabels.button)+'</button></form><p class="unlock-feedback" id="unlockFeedback" role="status" aria-live="polite"></p></section>';const transferPanel='<section class="control-settings save-transfer"><h2>'+escapeLocaleHtml(transfer.section)+'</h2><p>'+escapeLocaleHtml(transfer.help)+'</p><div class="save-transfer-actions"><button type="button" class="settings-action" data-export-save>'+escapeLocaleHtml(transfer.export)+'</button><button type="button" class="settings-action" data-import-save>'+escapeLocaleHtml(transfer.import)+'</button></div><input type="file" accept="application/json,.json" data-import-save-file aria-label="'+escapeLocaleHtml(transfer.import)+'" hidden><p class="save-transfer-feedback" id="saveTransferFeedback" role="status" aria-live="polite">'+(saveTransferFeedback?transfer[saveTransferFeedback]:'')+'</p></section>';const content='<div class="modal-kicker">'+th('settings.kicker')+'</div><h1>'+escapeLocaleHtml(copy.heading)+'<br><em>///</em></h1><p class="modal-sub">'+copy.sub.toUpperCase()+'</p><p class="modal-copy">'+escapeLocaleHtml(copy.help)+'<br>'+escapeLocaleHtml(copy.saved)+'</p><div class="language-options"><button type="button" class="language-option" data-language="pl" aria-pressed="'+(language==='pl')+'"><svg class="language-flag" viewBox="0 0 3 2" aria-hidden="true"><path fill="#fff" d="M0 0h3v1H0z"/><path fill="#dc143c" d="M0 1h3v1H0z"/></svg><span>Polski</span></button><button type="button" class="language-option" data-language="en" aria-pressed="'+(language==='en')+'"><svg class="language-flag" viewBox="0 0 60 30" aria-hidden="true"><path fill="#012169" d="M0 0h60v30H0z"/><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30M60 0L0 30" stroke="#c8102e" stroke-width="2.5"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#c8102e" stroke-width="6"/></svg><span>English</span></button><button type="button" class="language-option" data-language="zh-Hant" aria-pressed="'+(language==='zh-Hant')+'"><span>繁體中文</span></button></div>'+unlockPanel+audioSection+touchSettings+transferPanel+options+bindings+'<div class="modal-actions"><button type="button" class="settings-action" data-settings-close>'+escapeLocaleHtml(copy.back)+'</button></div>';showModal('<div data-i18n-ready>'+content+'</div>');}
// #(Wraca z ustawień do poprzedniego ekranu.)
function closeSettings(){pendingControlAction=null;const back=game.returnScreen;game.screen=back;if(back==='paused'){showPause();return;}if(back==='title'){showTitle();return;}hideModal();updateUI();}
  const canvas=document.querySelector('#gameCanvas'),ctx=canvas.getContext('2d'),wrap=document.querySelector('#arenaWrap');
  const $=s=>document.querySelector(s),keys=new Set();
  const keyDown=action=>keys.has(controls[action]);
  const ui={modal:$('#modal'),modalCard:$('#modalCard'),phase:$('#phaseText'),floor:$('#floorValue'),room:$('#roomValue'),wave:$('#waveValue'),hp:$('#hpFill'),hpv:$('#hpValue'),energy:$('#energyFill'),energyv:$('#energyValue'),level:$('#levelValue'),kills:$('#killValue'),boss:$('#bossMeter'),bossName:$('#bossName'),bossFill:$('#bossFill'),bossPhase:$('#bossPhase'),xp:$('#xpFill'),xpLabel:$('#xpLabel'),upgradeCount:$('#upgradeCount'),shot:$('#shotState'),nova:$('#novaState'),dash:$('#dashState'),touchDash:$('#touchDashLabel').parentElement,touchNova:$('#touchNovaLabel').parentElement,touchDashLabel:$('#touchDashLabel'),touchNovaLabel:$('#touchNovaLabel'),sector:$('#sectorTitle'),hint:$('#arenaHint'),objective:$('#objectiveTitle'),objectiveText:$('#objectiveText'),feed:$('#feedText'),intel:$('#intelStatus'),toast:$('#toast'),sound:$('#soundLabel'),weaponValue:$('#weaponValue'),scrapValue:$('#scrapValue'),scrapSide:$('#scrapSide'),weaponNameSide:$('#weaponNameSide'),weaponAttackName:$('#weaponAttackName'),weaponAttackDesc:$('#weaponAttackDesc'),weaponSpecialName:$('#weaponSpecialName'),weaponSpecialDesc:$('#weaponSpecialDesc'),statsButton:$('#statsButton')};
  const C={cyan:'#62f3dc',pink:'#ff4ea1',gold:'#ffd36a',purple:'#a782ff',white:'#edf5ff',muted:'#7f91a7'};
  const WEAPONS={twin:{id:'twin',name:'Twin Vector',tag:'RAPID FIRE',desc:'Szybkie, celne pociski. Nova odpycha wrogów wokół Ciebie.',damage:17,interval:.17,speed:560,style:'single',color:C.cyan},rail:{id:'rail',name:'Rail Driver',tag:'PIERCING SHOT',desc:'Wolniejszy strzał przebija wrogów. Specjalny promień czyści linię.',damage:38,interval:.58,speed:790,style:'pierce',color:C.gold},scatter:{id:'scatter',name:'Rift Scatter',tag:'WIDE BURST',desc:'Wiele pocisków na krótki dystans. Nova wystrzeliwuje salwę dookoła.',damage:9,interval:.43,speed:510,style:'scatter',color:C.purple}};

// #(Wczytuje postępy i odblokowania.)
function loadMeta(){try{const saved=JSON.parse(localStorage.getItem(META_KEY)||'{}');return{bestScore:Number(saved.bestScore)||0,totalKills:Number(saved.totalKills)||0,runs:Number(saved.runs)||0,unlockedWeapons:Array.isArray(saved.unlockedWeapons)?[...new Set(['twin','rail',...saved.unlockedWeapons.filter(id=>WEAPONS[id])])]:['twin','rail'],directivesUnlocked:!!saved.directivesUnlocked,goldCoreUnlocked:!!saved.goldCoreUnlocked,encirclementUnlocked:!!saved.encirclementUnlocked,directiveRecords:saved.directiveRecords&&typeof saved.directiveRecords==='object'?saved.directiveRecords:{}};}catch(_){return{bestScore:0,totalKills:0,runs:0,unlockedWeapons:['twin','rail']};}}
  const meta=loadMeta();

// #(Zapisuje postępy i odblokowania.)
function saveMeta(){try{localStorage.setItem(META_KEY,JSON.stringify(meta));}catch(_){}}
  const game={screen:'title',returnScreen:'playing',difficulty:'normal',floor:1,room:1,wave:1,waves:2,epilogueActive:false,epilogueResolved:false,lastEpilogueResolvedFloor:null,runOutcome:null,terminalFinalized:false,choice:0,pauseChoice:0,weaponChoice:0,weapon:WEAPONS.twin,keys,player:null,enemies:[],shots:[],enemyShots:[],particles:[],hazards:[],upgrades:[],kills:0,score:0,scrap:0,scrapEarned:0,scrapSpent:0,damageTaken:0,elapsed:0,spawnQueue:[],waveWait:0,toastTimer:0,lastFrame:0,soundOn:true,audio:null,shotCooldown:0,novaCooldown:0,dashCooldown:0,upgradeChoices:[],boss:null,meta,routeChoice:0,shopChoice:0,shopBought:[],riskRoom:false,riskReward:false,riskRewardRate:0,runNumber:0,shake:0,flash:0,touchMove:{x:0,y:0},touchAttack:false,seed:2049};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rand=(a,b)=>a+Math.random()*(b-a),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  let enemyAiSerial=0;
  let feedSource='',feedStatusSource='NO CARRIER',toastSource='SIGNAL';
// #(Ustawia komunikat paska stanu.)
function setFeed(text,status='SIGNAL LOCKED'){feedSource=text;feedStatusSource=status;ui.feed.innerHTML=localizeHtml(text);ui.intel.textContent=localizeText(status);}

// #(Wyświetla krótkie powiadomienie.)
function toast(text){toastSource=text;ui.toast.textContent=localizeText(text);ui.toast.classList.add('visible');game.toastTimer=1.5;}

// #(Wyświetla okno modalne.)
function showModal(html){ui.modalCard.innerHTML=html;localizePage(ui.modalCard);ui.modal.hidden=false;}

// #(Ukrywa okno modalne.)
function hideModal(){ui.modal.hidden=true;}

// #(Zmienia ekran i odświeża interfejs.)
function setScreen(name){game.screen=name;hideModal();ui.boss.classList.toggle('show',name==='playing'&&!!game.boss);updateUI();}

// #(Przygotowuje nowy run.)
function freshRun(){ECHO_EPI.resetEpilogue(game);game.floor=1;game.room=1;game.wave=1;game.waves=2;const hard=game.difficulty==='hard',baseHp=hard?50:100;game.player={x:W/2,y:H/2,r:13,hp:baseHp,maxHp:baseHp,energy:100,maxEnergy:100,speed:205,damage:game.weapon.damage,attackMultiplier:hard?.8:1,baseHp,level:1,kills:0,xp:0,aimX:1,aimY:0,lastMoveX:1,lastMoveY:0,invuln:0,dash:0,dashReduction:0,specialPower:1,specialHeal:0,fireRateBonus:0};game.enemies=[];game.shots=[];game.enemyShots=[];game.particles=[];game.hazards=[];game.upgrades=[];game.kills=0;game.score=0;game.scrap=0;game.scrapEarned=0;game.scrapSpent=0;game.damageTaken=0;game.elapsed=0;game.spawnQueue=[];game.waveWait=0;game.toastTimer=0;game.shotCooldown=0;game.novaCooldown=0;game.dashCooldown=0;game.boss=null;game.shake=0;game.flash=0;game.touchMove.x=0;game.touchMove.y=0;game.touchAttack=false;game.runNumber=++meta.runs;saveMeta();game.routeChoice=0;game.shopChoice=0;game.shopBought=[];game.riskRoom=false;game.riskReward=false;game.riskRewardRate=0;game.upgradeChoices=[];ui.toast.classList.remove('visible');ui.sector.textContent=t('sector.undercity');keys.clear();resetStick();enterRoom(1);setFeed(th('feed.intercepted')+'<br><strong>'+th('feed.goal')+'</strong>',t('hud.commsOnline'));toast(t(hard?'run.hardStart':'run.breached'));}

// #(Rozpoczyna wskazany pokój.)
function enterRoom(room){game.room=clamp(room,1,ECHO_EPI.roomsForFloor(game.floor));game.wave=1;game.waves=2;game.riskRoom=false;game.riskReward=false;game.enemies=[];game.hazards=[];game.spawnQueue=[];game.shots=[];game.enemyShots=[];game.boss=null;game.screen='playing';hideModal();ui.boss.classList.remove('show');if(game.room===ECHO_EPI.bossRoomForFloor(game.floor)){spawnBoss();return;}spawnWave(game.floor,1);ui.room.textContent=String(game.room).padStart(2,'0')+' / '+String(ECHO_EPI.roomsForFloor(game.floor)).padStart(2,'0');}
