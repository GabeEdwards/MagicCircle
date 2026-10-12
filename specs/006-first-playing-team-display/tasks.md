# Tasks: First Playing Team Display

**Input**: Design documents from `/specs/006-first-playing-team-display/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui-contract.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Test preparation and verification baseline

- [X] T001 Verify existing test suite baseline for game setup in tests/game-state.test.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic adjustments for team-level selection without individual player attribution

- [X] T002 Refactor selectFirstTeam to return only teamId, method, and usedFallback without selecting or returning an individual firstPlayerName in app.js
- [X] T003 Update unit tests for selectFirstTeam to verify team-only return structure in tests/game-state.test.js

---

## Phase 3: User Story 1 - Team-Level First Playing Team Announcement (Priority: P1) 🎯 MVP

**Goal**: Announce only the starting team name (e.g. "Team Blue" or "Team Green") on the pre-game confirmation stage without any individual player name.

**Independent Test**: Complete team setup, proceed to the confirmation stage, and verify that the announcement heading displays only the team name without player names, while preserving back/continue navigation.

### Implementation for User Story 1
- [X] T004 [P] [US1] Update #first-player-heading text to "Starting team picked" in index.html
- [X] T005 [US1] Update renderFirstPlayerStage to announce TEAM_NAMES[stagedFirstPlayer.teamId] exclusively without player names in app.js
- [X] T006 [US1] Add test validating first-player stage announcement content formats team name only in tests/game-state.test.js

---

## Phase 4: User Story 2 - Consistent Team-Level Turn Messaging During Gameplay (Priority: P2)

**Goal**: Ensure in-game indicators and audit event logging consistently identify the starting team as a team unit, reinforcing simultaneous team play.

**Independent Test**: Start a live game and verify that active team banners and team card indicators designate "First team" rather than "First player".

### Implementation for User Story 2
- [X] T007 [US2] Update renderGame active team label and team card badge from "First player" to "First team" in app.js
- [X] T008 [US2] Update game start audit log event formatting and details in app.js
- [X] T009 [US2] Update test assertions for in-game turn labels and audit events in tests/game-state.test.js

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end verification and regression testing

- [X] T010 Run full test suite and validate acceptance criteria per specs/006-first-playing-team-display/quickstart.md

---

## Dependencies & Execution Order

### Story Dependencies
- **Phase 1 (Setup)** and **Phase 2 (Foundational)** must be completed before user stories.
- **User Story 1 [US1] (Phase 3)** addresses the pre-game staging view and is the primary MVP increment.
- **User Story 2 [US2] (Phase 4)** aligns in-game live turn indicators with the team-level terminology established in US1.
- **Phase 5 (Polish)** runs after both stories to guarantee zero regressions across the test suite.

### Parallel Opportunities
- `T004` (Markup change in `index.html`) can be performed in parallel with `T003` (Unit tests in `tests/game-state.test.js`).

---

## Implementation Strategy & MVP

1. **MVP Scope (Phases 1, 2, and 3)**: Delivers foundational logic simplification and the team-level announcement stage (Tasks `T001`–`T006`).
2. **Increment 2 (Phase 4)**: Updates live in-game indicators and audit log labels to "First team" (Tasks `T007`–`T009`).
3. **Verification (Phase 5)**: Full regression suite run across all test suites (Task `T010`).
