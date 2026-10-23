import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root = new URL('../src/js/', import.meta.url);
const read = name => fs.readFileSync(new URL(name, root), 'utf8');
function extract(source, name) {
  const start=source.indexOf('function '+name+'('), open=source.indexOf('{',start);
  assert.ok(start>=0, name+' exists');
  let depth=1, end=open+1;
  for(;depth;end++){if(source[end]==='{')depth++;if(source[end]==='}')depth--;}
  return source.slice(start,end);
}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function context(functions, extras={}) {
  const c=vm.createContext({Math,clamp,...extras});
  for(const [file,name] of functions)vm.runInContext(extract(read(file),name),c);
  return c;
}
test('shooter anticipates approaching shots and ignores departing shots',()=>{
  const game={shots:[{x:0,y:0,vx:205,vy:0,r:3}]};
  const c=context([['30-world-and-ai.js','dodgeIncomingShot']],{game});
  const enemy=()=>({x:50,y:0,r:12,kind:'shooter',evadeCooldown:0,evadeT:0,flankSide:1,speed:49});
  assert.equal(c.dodgeIncomingShot(enemy(),1/60),true);
  game.shots[0].vx=-205;
  assert.equal(c.dodgeIncomingShot(enemy(),1/60),false);
});
test('bulwark closes the melee gap and attack damage is stable across FPS',()=>{
  const totals=[];
  for(const fps of [30,60,120]){
    let total=0;
    const c=context([['30-world-and-ai.js','updateEpilogueEnemy']],{game:{},damagePlayer:a=>total+=a,damageEnemyTarget:a=>total+=a});
    const e={kind:'bulwark',x:0,y:0,r:19,speed:34,damage:25,shieldAngle:0},p={x:50,y:0,r:24};
    for(let i=0;i<fps*10;i++)c.updateEpilogueEnemy(e,p,1/fps);
    assert.ok(total>0,'must reach and attack target');totals.push(total);
  }
  assert.ok(Math.max(...totals)-Math.min(...totals)<=25,'at most one attack difference');
});
test('shield uses projectile direction, not current player location',()=>{
  const c=context([['10-enemy-combat.js','hurtEnemy']],{game:{boss:null,player:{x:480,y:0},shake:0},burst:()=>{}});
  const e={kind:'bulwark',x:100,y:0,shieldAngle:0,hp:100,color:'gray'};
  c.hurtEnemy(e,20,{vx:200,vy:0});assert.equal(e.hp,80);
  e.hp=100;c.hurtEnemy(e,20,{vx:-200,vy:0});assert.equal(e.hp,89);
});
test('Endless registers artifact synergy IDs',()=>{
  const c=vm.createContext({game:{endlessActive:true,choice:0,wave:5,player:{},upgrades:[],upgradeIds:[],upgradeChoices:[{name:'Echo Chamber',apply:()=>{}}]},artifactIds:{'Echo Chamber':'echo'},beginEndlessWave:()=>{}});
  const objective=read('60-objectives-and-synergies.js');
  if(objective.includes('function grantRunUpgrade('))vm.runInContext(extract(objective,'grantRunUpgrade'),c);
  vm.runInContext('let chooseUpgrade;'+read('85-endless-mode.js').split('\n').find(l=>l.includes('chooseUpgrade=function'))+';chooseUpgrade();',c);
  assert.deepEqual([...c.game.upgradeIds],['echo']);
});
