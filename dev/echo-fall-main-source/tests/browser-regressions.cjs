// #(Sprawdza złożony HTML w Chromium; dostęp diagnostyczny istnieje tylko w pamięci testu.)
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_NODE_MODULES||'C:/Users/krukd/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules']}));
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.ECHO_BROWSER_CHANNEL||'msedge'});
 try{
 for(const filename of ['ECHO-FALL.build.0.12.5.html','dev/echo-fall-source/dist/Echo Test Build 0.12.1.html'].filter(filename=>fs.existsSync(filename))){
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
  const raw=fs.readFileSync(filename,'utf8'),end=raw.lastIndexOf('})();');
  const instrumented=raw.slice(0,end)+'window.review={game,freshRun,enterRoom,freshEnemy,updateEnemies,updateProjectiles,fireProjectile,hurtEnemy,getEnemyTarget,chooseUpgrade,loseRun,showCampaignEndChoice,setLanguage};'+raw.slice(end);
  await page.route('**/*',route=>route.request().isNavigationRequest()?route.fulfill({contentType:'text/html',body:instrumented}):route.abort());
  await page.goto('http://echo.test/');
  await page.evaluate(()=>{const r=review;r.freshRun();r.enterRoom(2);r.game.floor=4;r.enterRoom(2);const p=r.game.player;p.x=100;p.y=300;r.game.enemies=[];r.game.spawnQueue=[];const e=r.freshEnemy('bulwark',300,300);e.shieldAngle=0;r.game.enemies.push(e);const before=e.hp;r.fireProjectile('player',300,300,200,0,20);r.updateProjectiles(0);if(e.hp!==before-20)throw Error('rear projectile blocked');if(p.x!==100||p.y!==300)throw Error('player moved by relay');const hp=p.hp,relayHp=r.game.objectiveRun.relayHp;r.fireProjectile('enemy',480,300,0,0,10,0,{});r.updateProjectiles(0);if(p.hp!==hp||r.game.objectiveRun.relayHp!==relayHp-10)throw Error('wrong damage target');});
  await page.evaluate(()=>{const r=review;r.game.difficulty='endless';r.freshRun();r.game.upgradeChoices=[{name:'Echo Chamber',apply:()=>{}}];r.game.choice=0;r.chooseUpgrade();if(!r.game.upgradeIds.includes('echo'))throw Error('missing synergy');r.loseRun();});
  await page.locator('[data-result-restart]').click({button:'right'});
  assert.equal(await page.evaluate(()=>review.game.screen),'dead');
  await page.locator('[data-result-restart]').click();
  assert.equal(await page.evaluate(()=>review.game.screen),'setup');
  for(const lang of ['pl','en','zh-Hant']){
   await page.evaluate(lang=>{const r=review;r.setLanguage(lang);r.game.difficulty='normal';r.freshRun();r.showCampaignEndChoice();},lang);
   if(lang==='en')assert.match(await page.locator('h1').innerText(),/archive\s+answers/i);
   await page.evaluate(()=>review.loseRun());
   await page.locator('[data-result-restart]').focus();await page.keyboard.press('Enter');
   assert.equal(await page.evaluate(()=>review.game.screen),'setup');
  }
  await page.evaluate(()=>{const r=review;r.freshRun();r.game.floor=4;r.enterRoom(2);r.game.enemies=[];r.game.spawnQueue=[];const p=r.game.player;p.x=100;p.y=100;const hp=p.hp;const e=r.freshEnemy('bulwark',430,300);r.game.enemies.push(e);const relayHp=r.game.objectiveRun.relayHp;for(let i=0;i<120;i++)r.updateEnemies(1/60);if(r.game.objectiveRun.relayHp>=relayHp)throw Error('bulwark did not attack relay');if(p.x!==100||p.y!==100||p.hp!==hp)throw Error('relay AI changed real player');});
  assert.deepEqual(errors,[]);console.log('PASS browser:',filename);await page.close();
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await mobile.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
  await mobile.route('**/*',route=>route.request().isNavigationRequest()?route.fulfill({contentType:'text/html',body:instrumented}):route.abort());
  await mobile.goto('http://echo.test/');
  await mobile.evaluate(()=>{review.freshRun();review.loseRun();});
  await mobile.locator('[data-result-restart]').tap();
  assert.equal(await mobile.evaluate(()=>review.game.screen),'setup');
  console.log('PASS mobile touch restart:',filename);await mobile.close();
 }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
