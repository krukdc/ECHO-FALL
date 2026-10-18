// #(Udostępnia czyste reguły skalowania i limitu obrażeń, które można testować bez DOM-u.)
globalThis.ECHO_EPI = Object.freeze({
  epilogueScaleForFloor(floor) {
    const sector = Number(floor);
    if (sector === 4) return Object.freeze({ hp: 1.15, damage: 1.10 });
    if (sector === 5) return Object.freeze({ hp: 1.30, damage: 1.20 });
    if (sector === 6) return Object.freeze({ hp: 1.45, damage: 1.30 });
    return Object.freeze({ hp: 1, damage: 1 });
  },
  scaleEnemyStats(base, floorStats, floor, hardHpMultiplier = 1) {
    const extra = this.epilogueScaleForFloor(floor);
    const baseHp = Math.max(0, Number(base.hp) || 0);
    const baseDamage = Math.max(0, Number(base.damage) || 0);
    return {
      hp: Math.round(baseHp * Math.max(0, Number(floorStats.hp) || 1) * Math.max(0, Number(hardHpMultiplier) || 0) * extra.hp),
      damage: Math.round(baseDamage * Math.max(0, Number(floorStats.damage) || 1) * extra.damage),
      speed: base.speed
    };
  },
  roomsForFloor(floor) { return Number(floor) >= 4 && Number(floor) <= 6 ? 3 : 6; },
  bossRoomForFloor(floor) { return Number(floor) >= 4 && Number(floor) <= 6 ? 3 : 6; },
  beginEpilogue(state) {
    if (!state || state.floor !== 3 || state.epilogueActive || state.runOutcome) return false;
    state.epilogueActive = true; state.floor = 4; state.room = 1; state.epilogueResolved = false;
    return true;
  },
  resolveEpilogueBoss(state) {
    if (!state || !state.epilogueActive || state.floor < 4 || state.floor > 6 || state.lastEpilogueResolvedFloor === state.floor) return null;
    state.lastEpilogueResolvedFloor = state.floor;
    if (state.floor < 6) return { type: 'elevator', nextFloor: state.floor + 1 };
    state.epilogueResolved = true; state.runOutcome = 'epilogueClear';
    return { type: 'epilogueClear', nextFloor: null };
  },
  normalizeHistoryOutcome(outcome) { return ['victory', 'epilogueClear', 'defeat'].includes(outcome) ? outcome : 'defeat'; },
  claimTerminalRun(state, outcome) { if (!state || state.terminalFinalized) return false; state.terminalFinalized = true; state.runOutcome = state.runOutcome || this.normalizeHistoryOutcome(outcome); return true; },
  finishCampaign(state) {
    if (!state || state.floor !== 3 || state.epilogueActive || state.runOutcome) return false;
    state.runOutcome = 'victory'; return true;
  },
  resetEpilogue(state) {
    state.epilogueActive = false; state.epilogueResolved = false; state.lastEpilogueResolvedFloor = null; state.runOutcome = null; state.terminalFinalized = false;
    return state;
  },
  capLaserDamage(rawDamage, maxHp) {
    const hp = Number.isFinite(Number(maxHp)) ? Math.max(0, Number(maxHp)) : 0;
    const damage = Number.isFinite(Number(rawDamage)) ? Math.max(0, Number(rawDamage)) : 0;
    return Math.min(damage, hp * 0.5);
  },
  // #(Normalizuje hasło odblokowujące bez znaczenia wielkości liter.)
  normalizeUnlockCode(value) { return String(value ?? '').trim().toUpperCase(); },
  // #(Zwraca kąt wskaźnika lasera skierowanego na aktualny albo zablokowany cel.)
  laserAimAngle(originX, originY, targetX, targetY) {
    return Math.atan2((Number(targetY) || 0) - (Number(originY) || 0), (Number(targetX) || 0) - (Number(originX) || 0));
  },
  // #(Wydłuża kierunek lasera od źródła przez cel do granicy areny.)
  extendLaserRayToBounds(originX, originY, targetX, targetY, width, height) {
    const ox=Number(originX)||0,oy=Number(originY)||0,tx=Number.isFinite(Number(targetX))?Number(targetX):ox,ty=Number.isFinite(Number(targetY))?Number(targetY):oy,dx=tx-ox,dy=ty-oy,w=Math.max(0,Number(width)||0),h=Math.max(0,Number(height)||0),times=[];
    if(dx>0)times.push((w-ox)/dx);else if(dx<0)times.push(-ox/dx);
    if(dy>0)times.push((h-oy)/dy);else if(dy<0)times.push(-oy/dy);
    const t=Math.min(...times.filter(value=>Number.isFinite(value)&&value>=0));
    if(!Number.isFinite(t))return {x:Math.max(0,Math.min(w,tx)),y:Math.max(0,Math.min(h,ty))};
    return {x:Math.max(0,Math.min(w,ox+dx*t)),y:Math.max(0,Math.min(h,oy+dy*t))};
  },
  endlessWaveStatMultiplier(wave) { return 1 + Math.max(0, Math.floor(Number(wave) || 1) - 1) * 0.03; },
  scaleEndlessStats(base, wave) {
    const multiplier = this.endlessWaveStatMultiplier(wave);
    return { hp: Math.round(Math.max(0, Number(base.hp) || 0) * multiplier), damage: Math.round(Math.max(0, Number(base.damage) || 0) * multiplier), speed: base.speed };
  },
  endlessLevelHpGain(difficulty) { return difficulty === 'endless' ? 2 : 5; },
  endlessShopPriceMultiplier(wave) { return 1 + Math.max(0, Math.floor(Math.max(1, Number(wave) || 1) / 10)) * 0.25; },
  scaleEndlessShopOffer(offer, wave) {
    const multiplier = this.endlessShopPriceMultiplier(wave);
    return { ...offer, cost: Math.ceil(Math.max(0, Number(offer?.cost) || 0) * multiplier) };
  },
  endlessEnemyCount(baseCount, completedWaves) {
    const count = Math.max(0, Math.ceil(Number(baseCount) || 0));
    const steps = Math.min(20, Math.max(0, Math.floor(Math.max(0, Number(completedWaves) || 0) / 10)));
    return Math.ceil(count * (1 + steps * 0.25));
  },
  endlessRosterTier(wave) { return Math.min(3, Math.max(1, Math.ceil(Math.max(1, Number(wave) || 1) / 5))); }
});
