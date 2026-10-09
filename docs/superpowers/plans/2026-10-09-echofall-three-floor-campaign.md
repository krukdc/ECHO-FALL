# ECHO//FALL Three-Floor Campaign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current five-floor run with a three-floor campaign of six rooms per floor, two elevator transitions, floor-specific enemies and bosses, and a final victory after floor three.

**Architecture:** Keep the single-file Canvas game and refactor its current `game.floor` progression into separate `game.floor` and `game.room` state. Five rooms per floor use the existing two-wave and between-room route flow; room six starts that floor's boss. Boss defeat advances to an elevator transition or the final victory, while retaining run upgrades and applying the specified recovery and difficulty scaling.

**Tech Stack:** HTML, CSS, Canvas 2D, vanilla JavaScript, Web Audio API.

**Spec:** `docs/superpowers/specs/2026-10-09-echofall-design.md`

## Global Constraints

- Keep the game in one local `index.html`, with no framework, server, external dependencies, or downloaded assets.
- Keep all gameplay actions available by keyboard and retain touch controls on narrow screens.
- Each floor contains five combat rooms with two waves each, followed by a sixth boss room.
- Preserve weapons and upgrades across floor transitions; restore Aegis to full and heal 30% of maximum HP.
- Relative to floor I, floor II enemy HP and damage are ×2; floor III enemy HP is ×2.5 and damage ×2.25.
- Existing Hard mode modifiers stack with floor scaling.
- Bosses I, II, and III are Warden, Cartographer, and Null King; only the third boss ends the run in victory.

## Review Focus

- Boss death while shots or enemy projectiles remain: only the intended floor transition or final victory should occur; no stale collision should affect the next floor.
- Elevator transition from floor I and II: preserve weapon, upgrades, scrap, kills, score, and elapsed time; heal the specified amount and refill Aegis exactly once.
- Floor II and III scaling under both Normal and Hard: apply floor and Hard multipliers once, including to bosses and newly introduced enemy types.
- New enemy and boss telegraphs: each damaging lane, mine, clone strike, or arena hazard must be visibly signaled before it can hit the player.
- Touch play during room changes and boss transitions: reset held attack/stick state, keep safe-area layout, and leave pause/stat panels usable.

---

### Task 1: Room and floor campaign state

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `game.floor`, `game.wave`, `game.waves`, `advanceProgress(dt)`, `spawnWave(floor, wave)`, `spawnBoss()`, `winRun()`.
- Produces: `game.room` (1–6), `ROOMS_PER_FLOOR = 6`, `BOSS_ROOM = 6`, `enterRoom(room)`, `advanceFloor()`, and an elevator-transition screen state.

- [ ] Add room numbering independently from floor numbering; reset room to 1 only when beginning a new floor or new run.
- [ ] Keep two waves in combat rooms 1–5, preserving the existing route choice after each cleared combat room.
- [ ] Make room 6 start the boss for the current floor and prevent route or wave logic from starting additional combat there.
- [ ] Replace floor-only HUD progress with floor and room indicators (`FLOOR n · ROOM nn/06`) and update Polish/English progression copy to describe rooms.
- [ ] On boss I and II defeat, enter the elevator transition and advance the floor without calling `finishRun`; on boss III defeat, call the existing victory flow.
- [ ] At each elevator transition, clear projectiles and room entities, preserve build/run totals, restore Aegis to maximum, heal 30% maximum HP once, and start room 1 of the next floor.
- [ ] Update title, route, boss, pause, and result copy so it no longer promises a five-floor run or victory after boss I.

### Task 2: Floor-specific enemy roster and scaling

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `game.floor`, `game.room`, `game.difficulty`, `spawnEnemy(kind)`, `updateEnemies(dt)`, `drawEnemy(e)`, `damagePlayer(amount)`.
- Produces: floor-aware enemy spawn profiles and AI for `sapper`, `beamWraith`, `echoLeech`, and `gravemaw`; a single helper to apply floor and Hard HP/damage multipliers.

- [ ] Add two floor II enemy types: a Sapper that places a timed proximity mine with a clear warning, and a Beam Wraith that teleports before firing a short aimed bolt fan.
- [ ] Add two floor III enemy types: an Echo Leech that briefly splits into a weaker decoy, and a Gravemaw that telegraphs a pull zone before a damaging pulse.
- [ ] Make floor II roster include the existing types plus Sapper and Beam Wraith; make floor III include returning floor II types plus Echo Leech and Gravemaw.
- [ ] Apply floor I baseline scaling first, then floor multipliers (floor II ×2 HP/damage, floor III ×2.5 HP and ×2.25 damage), and then Hard's existing +50% HP modifier. Preserve Hard's existing 2× enemy count and player penalties.
- [ ] Apply these multipliers to regular enemies, elite room enemies, and bosses without mutating shared base enemy definitions.
- [ ] Draw readable warning shapes/timers for mines, teleport shots, decoy splits, and pull zones; keep their hit areas aligned with the visible hazards.

### Task 3: Three distinct floor bosses

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: current boss entity lifecycle, `hurtEnemy(e, dmg)`, `spawnBoss()`, `updateEnemies(dt)`, `drawEnemy(e)`, boss HUD, and Task 1 floor transition.
- Produces: floor-selected boss profiles and attacks for Warden, Cartographer, and Null King; a single boss-defeat dispatch that advances the campaign exactly once.

- [ ] Preserve Warden's existing three-phase movement, dash, burst, and volley attacks as the floor I boss.
- [ ] Add Cartographer as a distinct silhouette and boss profile; use sequenced laser lanes and orbiting shield nodes, with a clear warning phase before each lane fires.
- [ ] Add Null King as the final boss with a distinct silhouette; periodically create damageable decoys and mark shifting arena zones before a synchronized strike.
- [ ] Keep the boss meter visible with the correct boss name and phase; clear or reinitialize boss state, telegraphs, health, and projectiles on every elevator transition.
- [ ] Route boss defeat through one guarded state transition so multi-hit projectiles or an already-cleared boss cannot advance more than one floor.
- [ ] Finish the run only after Null King dies; keep death, score, persistent records, and restart behavior intact.

### Task 4: Campaign integration and source review

**Files:**
- Modify: `index.html`
- Update: `docs/superpowers/specs/2026-10-09-echofall-design.md` only if implementation reveals a necessary design clarification.

**Interfaces:**
- Consumes: room/floor state, route/shop/risk screens, three enemy profiles, three boss profiles, keyboard/touch controls, persistent metadata.
- Produces: coherent three-floor HUD, transitions, menu/result text, and fresh-run reset behavior.

- [ ] Update route, shop, risk-room, boss, death, and victory text to show both floor and room without changing existing economy or upgrade rules.
- [ ] Confirm keyboard selection, Enter, Escape, and touch activation work on elevator, route, shop, and boss transition screens.
- [ ] Review restart initialization for stale floor, room, boss, enemy, hazard, transition, route, and held-touch state.
- [ ] Review the full progression in source against the spec, including exact room counts, boss destinations, transition recovery, and Normal/Hard scaling; do not claim browser runtime success unless a permitted runtime pass is available.

