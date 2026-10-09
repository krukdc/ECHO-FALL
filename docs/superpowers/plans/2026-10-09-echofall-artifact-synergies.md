# ECHO-FALL Artifact Synergies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Make artifact choices interact through three explicit, readable synergies.

**Architecture:** Derive active synergies from the run's owned upgrade IDs, apply each effect at its existing gameplay hook, and render active combinations in stats.

**Tech Stack:** Single-file HTML, CSS, JavaScript, Canvas.

**Spec:** [2026-10-09-echofall-scaling-and-replay-design.md](../specs/2026-10-09-echofall-scaling-and-replay-design.md), Stage 3.

## Global Constraints

- A synergy requires both named artifacts and does not stack when an artifact is acquired repeatedly.
- Keep artifacts, upgrades, and effects run-local; new runs clear them.
- Preserve Polish/English UI and the existing weapon and skill controls.

## Review Focus

- Artifacts can be acquired in either order and the synergy becomes active with the second one.
- Repeat artifact selections do not multiply a synergy.
- Nova healing remains once per Nova use, including delayed Scatter projectiles.
- Blink pulse occurs at the landing point and only once per dash.
- Rail-specific damage applies only to Rail Driver Nova.

---

### Task 1: Give artifacts stable IDs and synergy definitions

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`upgradePool`, `chooseUpgrade`, `statsRows`)

**Interfaces:**
- Add stable IDs to upgrade entries and `isSynergyActive(id: string): boolean` derived from `game.upgrades`.

- [ ] Track artifact IDs in run state while preserving existing display names and upgrade effects.
- [ ] Define the three pairings from the spec and ensure repeated IDs do not multiply their effects.

### Task 2: Apply the healing and Rail Nova synergies

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`healNovaOnce`, `nova`)

- [ ] Set Nova healing to 20 HP instead of 12 when Sanguine Circuit and Echo Chamber are both owned; keep the once-per-use hit condition.
- [ ] Increase Rail Driver Nova damage by 25% when Rail Conductor and Deep Reservoir are both owned; leave other Rail attacks unchanged.

### Task 3: Apply the Blink shockwave synergy

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`dash`, enemy damage helpers, effects)

- [ ] When Afterimage and Phase Lattice are both owned, damage enemies within 72 units of Blink's landing point for twice the weapon's base damage.
- [ ] Keep the pulse absent when either artifact is missing; show an existing visual burst at the landing point.

### Task 4: Localize and display active synergies

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`statsRows`, PL_EN dictionary, upgrade descriptions)

- [ ] Add Polish and English descriptions for the three synergies.
- [ ] List only active synergies in stats and update the Nova-heal value when the healing synergy is active.

### Task 5: Review synergy interactions

**Files:**
- Review: `ECHO-FALL.build.0.9.4.html`

- [ ] Inspect acquisition order, repeated artifacts, all weapon types, Nova hit conditions, and run reset behavior.

