# Implementation Plan: Team Display and Player Statistics

**Branch**: `002-team-display-stats` | **Date**: 2026-08-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-team-display-stats/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Extend the existing client-only Magic Circle tracker with fixed Team Blue and Team
Green identities, matching visual treatments, alphabetized rosters, cross-team selection
locking, active-team emphasis, +/-1 and +/-5 life controls, and player-level aggregate
results. Preserve the existing local persistence, random first player, round-based turns,
unbounded life totals, and GitHub Pages deployment model.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: HTML5, CSS, and modern browser JavaScript (ES2022+)

**Primary Dependencies**: None; existing browser platform APIs only

**Storage**: Existing browser local storage; derive player statistics from completed games

**Testing**: Existing browser acceptance and focused state/persistence validation surfaces

**Target Platform**: Current iPad Safari and desktop browsers; GitHub Pages static hosting

**Project Type**: Enhancement to a static single-page web application

**Performance Goals**: Life controls and player-stat updates visibly respond within 100 ms; roster sorting and aggregation remain instantaneous for the local session scale

**Constraints**: No server, database, account system, network dependency, third-party images, or runtime dependencies; preserve existing persisted game data; maintain touch usability and portrait/landscape layouts; use distinguishable blue and green treatments

**Scale/Scope**: Seven fixed players, two fixed teams, local completed-game history, and the existing single shared-tablet workflow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* **User Value First**: PASS. Each enhancement maps to a prioritized user story and
  independently testable acceptance scenarios.
* **Simplicity and Local Consistency**: PASS. Statistics are derived from existing
  completed games and team identity remains a small fixed-domain model.
* **Verification Is Mandatory**: PASS. Focused tests cover sorting, selection locking,
  life deltas, active highlighting, and player aggregation.
* **Explicit Contracts**: PASS. The enhancement contract defines team identity, controls,
  roster order, and player-result fields without changing persistence history shape.
* **Secure and Observable Operation**: PASS. No new sensitive data or external input is
  introduced; invalid/empty statistics states remain explicit.
* **App Target**: PASS. The design remains simple, geometric, touch-compatible,
  client-only, and low-cost to host.

## Project Structure

### Documentation (this feature)

```text
specs/002-team-display-stats/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
index.html       # Existing setup, game, history, and player-stat markup
styles.css       # Existing responsive styles plus team colors and active states
app.js           # Existing state/rendering plus roster sorting, deltas, and aggregation
tests/
├── game-state.test.js
├── persistence.test.js
└── acceptance.md
```

**Structure Decision**: Modify the existing root static files in place. Keep player
statistics derived rather than persisted so existing completed-game records remain the
source of truth and no migration is needed.

## Post-Design Constitution Check

* **User Value First**: PASS. The design traces each change to setup clarity, live-play
  accuracy, or between-games insight.
* **Simplicity and Local Consistency**: PASS. No new application project or dependency is
  introduced; aggregation is a pure derivation from existing records.
* **Verification Is Mandatory**: PASS. Quickstart and focused validation cover all new
  behaviors and preserve the baseline game flow.
* **Explicit Contracts**: PASS. Team identity, control deltas, sorted lists, and player
  result calculations are documented in the enhancement contract.
* **Secure and Observable Operation**: PASS. The feature remains local-only and handles
  zero-game statistics without fabricated output.
* **App Target**: PASS. Touch, orientation, simple visuals, low hosting cost, and client-only
  operation remain unchanged.

## Complexity Tracking

No constitution violations require justification. The enhancement reuses the existing
static application and persisted completed-game records.
