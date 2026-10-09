# ECHO-FALL Post-Campaign Directives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Add three optional post-campaign challenges with separate local records and a cosmetic completion reward.

**Architecture:** Extend the existing local metadata additively, add a directive selector to weapon/difficulty selection, and apply directive modifiers through shared spawn, combat, and reward helpers.

**Tech Stack:** Single-file HTML, CSS, JavaScript, Canvas, localStorage.

**Spec:** [2026-10-09-echofall-scaling-and-replay-design.md](../specs/2026-10-09-echofall-scaling-and-replay-design.md), Stage 4.

## Global Constraints

- Directives unlock after the first victory and are optional at run start.
- Hunter: +50% enemies per wave (round up), every fourth spawned enemy is elite.
- Glass Core: half starting HP after difficulty, +25% player damage after difficulty.
- Scarcity: 50% less elimination and room reward scrap; store prices unchanged.
- Preserve existing saves, weapons, settings, keyboard/touch controls, and Polish/English copy.

## Review Focus

- Existing localStorage saves load without losing unlocked weapons or scores.
- Directive modifiers compose with Normal and Hard in the order specified.
- Directive enemy counts round upward and elite enemies use the existing elite treatment.
- Scarcity affects reward sources but not purchases, prices, or fire-rate rewards.
- Records update only on a victory with that directive selected; cosmetic reward gives no stat benefit.

---

### Task 1: Extend local meta with backward-compatible defaults

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`loadMeta`, `saveMeta`, `finishRun`)

**Interfaces:**
- Add metadata fields for `directivesUnlocked`, `directiveRecords` keyed by directive ID, and `goldCoreUnlocked`.

- [ ] Extend `loadMeta()` defaults without changing `META_KEY` or existing data.
- [ ] Unlock directive selection on first victory and update each directive's best score only on victory.
- [ ] Unlock the cosmetic palette when all three directive records contain a completed campaign.

### Task 2: Add directive selection and start-run modifiers

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`showWeaponSelect`, input handlers, `freshRun`)

- [ ] Add Normal/Hard-compatible directive selection, locked until first victory; default to no directive.
- [ ] Show exact modifier summaries before run start, including Polish and English labels.
- [ ] Apply Glass Core after difficulty starting HP and attack modifiers; store selected directive in run state.

### Task 3: Apply Hunter and Scarcity during play

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`spawnWave`, `spawnEnemy`, `freshEnemy`, scrap award sites)

- [ ] Apply Hunter's ceiling-rounded +50% wave count and mark each fourth spawned enemy elite using the existing elite HP/damage treatment.
- [ ] Apply Scarcity's 50% reduction to elimination scrap and room reward scrap; do not alter shop costs or fire-rate award rules.

### Task 4: Save separate records and display the cosmetic reward

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`finishRun`, `showResult`, `drawPlayer`, metadata localization)

- [ ] Show the active directive and its record in result UI; preserve ordinary best-score display.
- [ ] Render the gold core palette only after all three challenge victories; do not change hitboxes or stats.
- [ ] Add localized unlock feedback and retain the reward across browser restarts.

### Task 5: Review directive interactions and save migration

**Files:**
- Review: `ECHO-FALL.build.0.9.4.html`

- [ ] Inspect Normal/Hard × each directive, defeat/victory record handling, legacy metadata defaults, and UI copy.
