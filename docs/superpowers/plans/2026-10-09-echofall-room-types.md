# ECHO-FALL Room Types Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Add survival and relay-defense objectives while preserving the 18-room campaign and route rewards.

**Architecture:** Model each non-boss room with a deterministic objective type. Keep combat progression in the existing update loop, with objective-specific completion state and risk elites layered onto the scheduled room.

**Tech Stack:** Single-file HTML, CSS, JavaScript, Canvas.

**Spec:** [2026-10-09-echofall-scaling-and-replay-design.md](../specs/2026-10-09-echofall-scaling-and-replay-design.md), Stage 2.

## Global Constraints

- Keep three floors of six rooms; boss stays in room six.
- Survival duration is 45 seconds. Relay starts at 100 HP and fails at zero.
- Room schedule: F1 R2 survival/R4 relay; F2 R2 relay/R4 survival; F3 R3 survival/R5 relay.
- Risk route adds 3 elites, or 6 on Hard, without replacing the scheduled objective.
- Preserve keyboard/touch controls, Polish/English copy, and offline operation.

## Review Focus

- Survival completion is time-based, even when enemies remain alive.
- Relay damage and its failure state do not damage or misreport player HP.
- Enemy attacks target the relay only in relay rooms; ordinary rooms retain existing behavior.
- Risk elites do not skip the objective or grant rewards before it is complete.
- Boss rooms and floor transitions do not inherit stale objective state.

---

### Task 1: Add deterministic room objective data

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (room configuration, `enterRoom`, `advanceFloor`)

**Interfaces:**
- Add `roomObjective(floor: number, room: number): 'waves' | 'survival' | 'relay'` with the schedule above.
- Add `game.objectiveRun` state for objective type, remaining timer, relay HP, and pending risk modifier; reset it in `freshRun()` and `enterRoom()`.

- [ ] Add the schedule and state initialization without changing boss room setup.
- [ ] Route rooms 1–5 into their configured objective; leave room 6 on the existing boss path.

### Task 2: Implement survival objective

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`enterRoom`, `advanceProgress`, HUD rendering/localization)

**Interfaces:**
- Add `startSurvivalRoom()` and update the room timer through `advanceProgress(dt)`.

- [ ] Spawn regular floor enemies and start a 45-second timer.
- [ ] Complete the room when the timer reaches zero, regardless of remaining enemies; then use the existing route and reward flow.
- [ ] Show localized objective text and remaining time in a readable HUD position.

### Task 3: Implement relay-defense objective

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`updateEnemies`, projectile handling, `advanceProgress`, drawing and HUD)

**Interfaces:**
- Add `game.objectiveRun.relayHp` (100 maximum) and objective-specific enemy target coordinates.

- [ ] Spawn regular floor waves and draw the relay with an HP indicator.
- [ ] In relay rooms, redirect enemies and enemy projectiles to the relay; attacks subtract their normal damage from relay HP.
- [ ] End the run as a defeat when relay HP reaches zero; complete the room after all waves are cleared.

### Task 4: Layer the risk route onto objectives

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`chooseRoute`, `startRiskRoom`, room spawn/completion flow)

- [ ] Store risk selection as a modifier for the next room rather than replacing that room's objective.
- [ ] Add 3 elite enemies, or 6 on Hard, to the scheduled room encounter; keep current elite HP/damage scaling.
- [ ] Award +30 scrap, the capped 10–25% fire-rate reward, and a free artifact only after the room objective is complete.

### Task 5: Review room lifecycle and HUD

**Files:**
- Review: `ECHO-FALL.build.0.9.4.html`

- [ ] Inspect all scheduled objective transitions, death, reward, boss entry, and elevator transition paths.
- [ ] Inspect Polish/English strings and HUD placement for desktop and narrow mobile layouts.

