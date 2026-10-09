# ECHO-FALL Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Keep risky-room fire-rate rewards meaningful without allowing fire rate or shop scaling to run away.

**Architecture:** Keep the game in its existing offline HTML file. Add one reward calculation helper, use its effective value in firing and stats, and preserve the current room-based shop curve.

**Tech Stack:** Single-file HTML, CSS, JavaScript, Canvas, localStorage.

**Spec:** [2026-10-09-echofall-scaling-and-replay-design.md](../specs/2026-10-09-echofall-scaling-and-replay-design.md), Stage 1.

## Global Constraints

- Three floors, six rooms per floor; boss remains in room six.
- Fire-rate rewards come only from clearing a risky room and roll from 10% to 25%.
- Effective fire-rate bonus is capped at +75%; each full 5 percentage points that do not fit converts to 1 scrap.
- Shop amount and cost continue scaling by 5% per room; fire rate is not sold.
- Keep keyboard and touch controls, Polish and English text, and local-only saves.

## Review Focus

- A reward near the +75% cap must apply only the remaining amount and convert overflow correctly.
- Rounding must not create more than +75% effective fire rate.
- The display must distinguish applied fire rate from overflow scrap.
- New runs reset the bonus while floor transitions preserve it.
- Older local saves must continue loading with defaults for any added fields.

---

### Task 1: Bound risky-room fire-rate rewards

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`completeRiskRoom`, `fireShot`, run initialization, `statsRows`, upgrade reward modal)

**Interfaces:**
- Produces `applyRiskFireRateReward(currentBonus: number, rolledPercent: number): { bonus: number, appliedPercent: number, overflowScrap: number }`.
- `appliedPercent` is the integer percentage applied, never greater than the remaining room under 75%; overflow scrap is `floor(unappliedPercent / 5)`.

- [ ] Add the reward helper and route `completeRiskRoom()` through it. Preserve the existing +30 scrap and artifact reward.
- [ ] Ensure firing uses the capped effective bonus and new runs reset it while floor changes preserve it.
- [ ] Update the risk reward modal, toast, and stats panel to show applied percentage, overflow scrap, and the +75% cap in Polish and English.

### Task 2: Preserve the shop's proportional curve

**Files:**
- Modify: `ECHO-FALL.build.0.9.4.html` (`shopOffer`, `showShop`, `buyShop`)

**Interfaces:**
- Keep `shopOffer(index: number): { amount: number, cost: number }` as the sole calculation for display and purchase.

- [ ] Review current `round(amount)` and `ceil(cost)` behavior at rooms 1–5 on each floor; keep one calculation shared by display and purchase.
- [ ] Confirm no shop entry grants fire rate and that the shop message describes room-scaled values consistently in both languages.

### Task 3: Review stage 1 changes

**Files:**
- Review: `ECHO-FALL.build.0.9.4.html`

- [ ] Inspect reward application and display at values below, at, and above the cap; inspect the shop's early- and late-room calculations.
- [ ] Inspect that a legacy localStorage save still loads without losing existing weapons or records.

