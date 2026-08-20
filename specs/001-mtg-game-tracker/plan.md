# Implementation Plan: MTG Game Tracker

**Branch**: `001-mtg-game-tracker` | **Date**: 2026-08-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-mtg-game-tracker/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Build a single-page, tablet-friendly game tracker for two Magic: The Gathering teams.
The app provides team setup, randomized first-player selection, round-based turn
tracking, unbounded life totals starting at 40, completed-game history, and local
recovery of active and completed games. It uses browser-native capabilities and
static files so it can run offline after loading and deploy directly to GitHub Pages.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: HTML5, CSS, and modern browser JavaScript (ES2022+)

**Primary Dependencies**: None; browser platform APIs only

**Storage**: Browser local storage for active-game recovery and completed-game history

**Testing**: Browser acceptance checks documented in quickstart.md, with focused logic tests for game state transitions and persistence during implementation

**Target Platform**: Current iPad Safari and current desktop browsers; GitHub Pages static hosting

**Project Type**: Static single-page web application

**Performance Goals**: Primary controls update visibly within 100 ms on a supported iPad; initial page load remains suitable for a small static application

**Constraints**: No server-side execution, account system, remote database, or required network access after load; touch-first controls; portrait and landscape support; no third-party images or runtime dependencies; all life values remain numeric without caps

**Scale/Scope**: One shared iPad per play group; two teams; 2-4 members per team from seven fixed players; recent local history; two user-facing modes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* **User Value First**: PASS. Each planned slice maps to a user story and acceptance
  scenario in the feature specification.
* **Simplicity and Local Consistency**: PASS. The design uses one static page, browser
  APIs, and no new service or dependency boundary.
* **Verification Is Mandatory**: PASS. The plan includes focused state, persistence,
  touch-layout, and end-to-end acceptance validation.
* **Explicit Contracts**: PASS. The data model and UI contract define persisted state,
  transitions, and required visible behavior.
* **Secure and Observable Operation**: PASS. No credentials or sensitive data are
  collected; invalid setup and storage failures have visible user feedback.
* **App Target**: PASS. The design is simple, geometric, touch-compatible, static-hosted,
  and client-only.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
index.html       # Static application entry point
styles.css       # Tablet-first layout and visual styling
app.js           # Game state, rendering, persistence, and interactions
tests/
├── game-state.test.js
├── persistence.test.js
└── acceptance.md
README.md        # Local run and GitHub Pages guidance
```

**Structure Decision**: Use a minimal repository-root static site because GitHub Pages
can serve the entry point without a build pipeline. Keep game state logic in small
browser-native modules within `app.js` unless implementation testing demonstrates a
clear need to split files. Tests remain separate from shipped runtime assets.

## Post-Design Constitution Check

* **User Value First**: PASS. Research and design artifacts trace decisions to the
  specification's user stories and measurable outcomes.
* **Simplicity and Local Consistency**: PASS. The design remains a single static page
  with browser-native storage and randomness, without service or dependency sprawl.
* **Verification Is Mandatory**: PASS. Quickstart covers setup, turn sequencing, life
  bounds, persistence, completion, offline use, and both tablet orientations.
* **Explicit Contracts**: PASS. `data-model.md` and `contracts/ui-contract.md` define
  state fields, validation, transitions, actions, and visible outcomes.
* **Secure and Observable Operation**: PASS. No sensitive data is collected; storage,
  setup, and randomness failures have explicit user-facing handling.
* **App Target**: PASS. The design remains simple, geometric, touch-compatible,
  low-cost to host, and fully client-side.

## Complexity Tracking

No constitution violations require justification. The plan intentionally avoids a
backend, build pipeline, third-party runtime dependencies, and additional application
projects.
