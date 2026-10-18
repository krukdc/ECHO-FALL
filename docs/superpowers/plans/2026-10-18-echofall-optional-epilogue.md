# ECHO//FALL Optional Epilogue Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the current 18-room campaign with an optional, fair three-sector epilogue that ends after three distinct new bosses.

**Architecture:** Treat `ECHO-FALL.build.0.11.6.html` as the authoritative game until the organized source copy has been reconciled and can reproduce it. Implement the epilogue in the existing browser-game modules, with a small pure rules module for sector scaling and Laser damage caps; keep the shipped game as one offline HTML file. Use explicit run state and one-shot transition guards so the optional ending, epilogue ending, defeat, history, and restart remain separate outcomes.

**Tech Stack:** HTML, CSS, browser JavaScript, Node.js built-in test runner (`node:test`), existing standalone build script; no runtime or build dependencies.

**Spec:** `docs/superpowers/specs/2026-10-18-echofall-optional-epilogue.md`

## Global Constraints

- Preserve offline play and ship one standalone HTML file.
- Keep keyboard and touch controls, plus Polish, English, and Traditional Chinese localization.
- The main campaign still ends after its third boss when the player chooses to finish.
- The optional epilogue is fixed at three sectors, three rooms per sector, and three bosses; it is not endless.
- Preserve the current run build, scrap, score, stats, difficulty, and directives on continuation.
- Epilogue sector multipliers relative to the floor III baseline: sector 4 HP ×1.15 / damage ×1.10; sector 5 HP ×1.30 / damage ×1.20; sector 6 HP ×1.45 / damage ×1.30.
- Do not scale normal enemy movement speed as a side effect of epilogue scaling.
- A Laser hit is capped at 50% of the player's maximum HP after every difficulty, floor, and directive modifier.
- Refill Aegis and heal 30% max HP once on epilogue entry and after epilogue bosses 1 and 2; do not heal after boss 3.
- Store exactly one final run-history record for victory, epilogue victory, or defeat; old history and save entries remain valid.

## Review Focus

- Multiple lethal callbacks, held Enter, or rapid taps must not resolve a boss twice, skip a sector, or write duplicate history. Pin this in Tasks 3 and 5 with repeated-transition and one-record assertions.
- Old imported history entries without epilogue fields must still load; pin this in Task 5 with a legacy-entry fixture.
- Laser damage must remain under its cap even when Hard and the highest floor/directive multipliers combine; pin this in Task 2's numeric tests.
- Sector transitions must not leak shots, hazards, held touch input, or boss state into the next room; pin this in Task 3's transition tests and the browser pass in Task 6.
- Long translated labels and narrow touch screens must keep both ending choices visible and usable; pin this in Task 4's localization/layout review and Task 6's mobile browser pass.

---

### Task 1: Reconcile the organized source with build 0.11.6

**Files:**
- Modify: `dev/echo-fall-source/src/index.template.html`
- Modify: `dev/echo-fall-source/src/styles.css`
- Modify: `dev/echo-fall-source/src/js/*.js`
- Modify: `dev/echo-fall-source/tools/build.mjs`
- Modify: `dev/echo-fall-source/README.md`
- Verify: `ECHO-FALL.build.0.11.6.html`

**Interfaces:**
- Consumes: the current standalone build and the existing ordered source fragments.
- Produces: a reproducible source tree whose generated HTML has the same game behavior and user-facing content as build 0.11.6, before epilogue changes.

- [ ] **Step 1: Compare the current generated source build with the authoritative HTML.** Build to a temporary path or compare normalized outputs without overwriting the user's distributable. Record concrete drift by module.
- [ ] **Step 2: Reconcile each drifted module from build 0.11.6.** Preserve existing Polish `// #(opis)` comments where they still describe the function; update the builder and README from 0.11.5 to the current baseline. Do not edit the authoritative HTML in this step.
- [ ] **Step 3: Build and verify the baseline.** Run `node dev/echo-fall-source/tools/build.mjs`; compare the output with `ECHO-FALL.build.0.11.6.html` after normalizing only known template/build formatting. Expected: identical game markup, CSS, and JavaScript behavior, no unexplained differences.
- [ ] **Step 4: Commit the reconciled source baseline.** Stage only `dev/echo-fall-source/` and commit as `chore: sync organized source to 0.11.6`.

### Task 2: Add and test epilogue rules and enemy definitions

**Files:**
- Create: `dev/echo-fall-source/src/js/05-epilogue-rules.js`
- Modify: `dev/echo-fall-source/src/js/10-enemy-combat.js`
- Modify: `dev/echo-fall-source/src/js/30-world-and-ai.js`
- Modify: `dev/echo-fall-source/tools/build.mjs`
- Create: `dev/echo-fall-source/tests/epilogue-rules.test.mjs`

**Interfaces:**
- Produces: `epilogueScaleForFloor(floor) -> { hp, damage }`, returning neutral multipliers outside floors 4–6; `capLaserDamage(rawDamage, maxHp) -> number`, returning a nonnegative value no greater than `maxHp * 0.5`.
- Produces: six enemy definitions and their attack/update hooks, two per sector: `bulwark`, `siphon`, `gateGunner`, `echoTrapper`, `laser`, and `ricochet`.
- Consumes: existing `ENEMY_BASES`, `FLOOR_ROSTER`, `scaledCombatStats`, and standard enemy lifecycle.

- [ ] **Step 1: Write failing Node tests** for floor 3 neutral scaling, sector 4/5/6 exact HP and damage multipliers, no speed multiplier, Laser cap under arbitrary large incoming damage, and zero/negative damage handling.
- [ ] **Step 2: Run `node --test dev/echo-fall-source/tests/epilogue-rules.test.mjs`.** Expected: FAIL because the pure rules module does not exist.
- [ ] **Step 3: Implement the pure scaling and cap helpers** in `05-epilogue-rules.js`, add it before combat modules in `build.mjs`, and have combat scaling apply epilogue factors once on top of the floor III baseline.
- [ ] **Step 4: Add all six enemy profiles and AI.** Bulwark exposes its shield facing; Siphon's visible tether breaks on line-of-sight loss; Gate Gunner telegraphs portal exit direction; Echo Trapper marks a point before delayed impact; Laser tracks for 1.4s, locks and charges for 1s, has at most one active charge per room, and applies the 50% cap; Ricochet projectiles show a finite bounce count and then disappear. Avoid a global increase to normal movement speed.
- [ ] **Step 5: Add update/render hooks for their tells and counters** in the existing combat/world modules, ensuring each new attack participates in normal projectile and damage cleanup.
- [ ] **Step 6: Run the Node test file and build.** Expected: all numeric assertions pass; generated HTML contains all six definitions and no external dependency.
- [ ] **Step 7: Commit** as `feat: add epilogue enemy roster and scaling`.

### Task 3: Implement epilogue boss encounters and guarded campaign transitions

**Files:**
- Modify: `dev/echo-fall-source/src/js/00-bootstrap.js`
- Modify: `dev/echo-fall-source/src/js/10-enemy-combat.js`
- Modify: `dev/echo-fall-source/src/js/30-world-and-ai.js`
- Modify: `dev/echo-fall-source/src/js/40-progression-and-menus.js`
- Create: `dev/echo-fall-source/tests/epilogue-flow.test.mjs`

**Interfaces:**
- Produces: `game.epilogueActive`, `game.epilogueResolved`, and `game.runOutcome` state; `beginEpilogue()`, `finishEpilogueBoss()`, and `finishCampaign(outcome)` transition functions, each idempotent for its current run state.
- Consumes: `showBossArmory`, `showElevator`, `advanceFloor`, `finishRun`, existing room objectives/routes/rewards, and Task 2's rules/enemies.

- [ ] **Step 1: Add a small flow test harness** that loads the browser script with minimal DOM/localStorage stubs or extracts transition functions behind a testable state adapter; cover finish versus continue at boss 3, epilogue boss sequence, duplicate resolution, restart, and final outcome distinction.
- [ ] **Step 2: Run `node --test dev/echo-fall-source/tests/epilogue-flow.test.mjs`.** Expected: FAIL for absent epilogue state/transitions.
- [ ] **Step 3: Add an idempotent post-boss-3 choice** with two paths: ordinary campaign victory, or continuation preserving all listed run state and entering floor 4 / room 1. Keep the Scatter unlock earned for defeating boss 3. Do not let a next-run armory selection overwrite the equipped weapon when the player continues; preserve the existing reward/armory flow for a finished run.
- [ ] **Step 4: Add bosses Gatewright, Auditor, and Archive Heart.** Gatewright uses destructible barrier generators and always leaves one safe route; Auditor telegraphs and sequentially attacks several remembered positions; Archive Heart has three clearly signaled phases combining learned patterns with avoidable safe zones.
- [ ] **Step 5: Map epilogue floors 4–6 to three rooms each.** Rooms 1–2 use current room/objective/route/reward loops; room 3 starts the assigned epilogue boss. Preserve the original floors' six-room structure.
- [ ] **Step 6: Apply healing exactly once** on entry to floor 4 and after bosses on floors 4 and 5; refill Aegis and add 30% max HP. Floor 6 boss victory goes straight to epilogue finish without healing.
- [ ] **Step 7: On every transition clear combat state**: boss, shots, hazards, queues, route selection, held keyboard/touch input, and transient room objectives. On restart clear epilogue state and start at floor 1.
- [ ] **Step 8: Run flow and numeric tests.** Expected: repeated boss resolution and repeated continue input still create one transition; no transition heals twice; all three epilogue bosses occur once in order.
- [ ] **Step 9: Commit** as `feat: add optional three-sector epilogue flow`.

### Task 4: Add localized endings and distinguish run-history outcomes

**Files:**
- Modify: `dev/echo-fall-source/src/js/50-render-input-and-localization.js`
- Modify: `dev/echo-fall-source/src/js/90-history-and-startup.js`
- Modify: `dev/echo-fall-source/src/index.template.html` only if semantic labels/accessible structure need a stable target
- Create: `dev/echo-fall-source/tests/epilogue-history.test.mjs`

**Interfaces:**
- Produces: history outcomes `victory`, `epilogueClear`, and `defeat`; legacy outcome parsing remains supported.
- Consumes: Task 3's `game.runOutcome` and epilogue choice/result screens.

- [ ] **Step 1: Add tests** for old history records with no epilogue field, ordinary victory, epilogue completion, and defeat during epilogue; assert one terminal record per run and backwards-compatible loading.
- [ ] **Step 2: Run `node --test dev/echo-fall-source/tests/epilogue-history.test.mjs`.** Expected: FAIL for the new outcome type and epilogue fields.
- [ ] **Step 3: Extend history normalization and recording** so the selected post-boss-3 finish path records `victory`, Archive Heart completion records `epilogueClear`, and epilogue death records `defeat`; store optional epilogue completion data without requiring it in older records or imports.
- [ ] **Step 4: Add PL, EN, and Traditional Chinese strings** for the finish/continue choice, all new enemies and bosses, attack guidance, floor/room labels, and the distinct epilogue ending. Ensure generated dynamic text goes through the existing localization path.
- [ ] **Step 5: Verify layout and keyboard/touch access** for long translated labels at 320 CSS px and desktop width; both choice buttons remain visible, reachable, and visually consistent with the existing modal design.
- [ ] **Step 6: Run all three Node test files** and the standalone build. Expected: legacy fixtures load; all end states save exactly one record; no missing translation keys or external requests.
- [ ] **Step 7: Commit** as `feat: localize epilogue endings and history`.

### Task 5: Produce build 0.12.0 and verify campaign end to end

**Files:**
- Modify: `dev/echo-fall-source/tools/build.mjs`
- Modify: `dev/echo-fall-source/README.md`
- Create: `ECHO-FALL.build.0.12.0.html`

**Interfaces:**
- Consumes: reconciled organized source, epilogue flow, enemy/boss content, translations, and history changes.
- Produces: the canonical single-file offline build `ECHO-FALL.build.0.12.0.html` and a successful full campaign verification.

- [ ] **Step 1: Update the builder and README version/output target to 0.12.0** while retaining deterministic assembly of CSS and ordered JS fragments.
- [ ] **Step 2: Build the final HTML** and run `node --check` against the extracted inline JavaScript; expected: exit code 0. Run `node --test dev/echo-fall-source/tests/*.test.mjs`; expected: all tests pass.
- [ ] **Step 3: Run static integration checks** for unique HTML IDs, every referenced localization key, the six enemy IDs, three boss IDs, and no HTTP(S) asset/script/style dependencies.
- [ ] **Step 4: Browser-play the complete normal and Hard campaigns**: finish at boss 3, continue into epilogue, clear 3×(2 normal rooms + boss), check healing and floor scaling, complete Archive Heart, inspect history; separately die in epilogue and restart. Verify desktop keyboard and narrow-phone touch controls, all three languages, and legacy save/import behavior.
- [ ] **Step 5: Review the final diff** to ensure only the agreed source, tests, README, and new versioned build changed; preserve unrelated user edits and older builds.
- [ ] **Step 6: Commit** as `feat: ship optional epilogue in build 0.12.0`.

## Self-review

- **Spec coverage:** campaign branch and state retention (Task 3); 6 enemy types, 3 bosses and sector scaling/cap (Tasks 2–3); exact healing and transition cleanup (Task 3); PL/EN/Traditional Chinese and touch/keyboard screens (Task 4); history compatibility, one record, defeat/restart (Tasks 3–4); one-file offline build and full run verification (Tasks 1 and 5).
- **Step scan:** Each task has explicit changed files, interfaces, test commands, expected result, and commit boundary. Source reconciliation is a required gate because the checked-in organized copy is 0.11.5 while the approved spec's baseline is 0.11.6.
- **Type consistency:** Rules module signatures match tests and combat consumers; flow state names are shared by flow, UI, and history tasks; `epilogueClear` is the single recorded outcome for completing boss 3.
- **Review Focus:** all five review risks have specific assertions or browser checks in their owning tasks.
- **Proportion:** five implementation tasks follow existing module boundaries and add one isolated rules helper plus focused tests; no general engine rewrite or new dependency is planned.
