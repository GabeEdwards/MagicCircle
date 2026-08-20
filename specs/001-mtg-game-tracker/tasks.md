# Tasks: MTG Game Tracker

**Input**: Design documents from `/specs/001-mtg-game-tracker/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Focused state and persistence validation tasks are included because the project constitution requires verification for testable behavior. Full TDD ordering is not required by the feature specification.

**Organization**: Tasks are grouped by user story to enable incremental implementation and independent validation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the static application shell and validation file structure.

- [X] T001 [P] Create the static page shell with app root, mode containers, and semantic controls in `index.html`
- [X] T002 [P] Define tablet-first design tokens, responsive layout scaffolding, and stable control sizing in `styles.css`
- [X] T003 [P] Create the browser application entry module and event/rendering placeholders in `app.js`
- [X] T004 [P] Create focused state and persistence test scaffolds in `tests/game-state.test.js` and `tests/persistence.test.js`
- [X] T005 [P] Create the manual acceptance checklist structure in `tests/acceptance.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared state, validation, persistence, and rendering primitives required by every user story.

**CRITICAL**: User story work depends on this phase.

- [X] T006 Define fixed player constants, Team, Active Game, Completed Game, and Persistence Envelope structures in `app.js`
- [X] T007 Implement team membership validation for fixed players, 2-4 members per team, and cross-team duplicates in `app.js`
- [X] T008 Implement local-state load, schema validation, save, and storage-failure feedback in `app.js`
- [X] T009 Implement mode navigation and shared render helpers for between-games, setup, in-game, and end-game views in `app.js`
- [X] T010 [P] Add semantic labels, live regions, and keyboard fallback semantics to the shared controls in `index.html`
- [X] T011 [P] Add browser-size and orientation safeguards for shared panels and controls in `styles.css`

**Checkpoint**: Shared state and view infrastructure are ready; user stories can be implemented in dependency order.

---

## Phase 3: User Story 1 - Configure and Start a Game (Priority: P1) 🎯 MVP

**Goal**: Let a group choose two valid teams and start a game with 40 life, Turn 1, and a fair visible first player.

**Independent Test**: From the between-games view, configure two distinct teams of 2-4 players, start the game, and verify both teams, 40 life totals, Turn 1, and exactly one randomly selected active first team.

### Implementation for User Story 1

- [X] T012 [US1] Implement New Game navigation and two-team member selection controls in `app.js` and `index.html`
- [X] T013 [US1] Render selected-member counts and setup validation messages for invalid size or duplicate assignments in `app.js` and `styles.css`
- [X] T014 [US1] Implement secure equal-probability first-player selection with browser fallback warning when secure randomness is unavailable in `app.js`
- [X] T015 [US1] Create a valid Active Game with both life totals at 40, shared Turn 1, selected first player, and active team state in `app.js`
- [X] T016 [US1] Render the initial in-game view with team compositions, life totals, Turn 1, active-team state, and first-player indication in `app.js`, `index.html`, and `styles.css`
- [X] T017 [US1] Record User Story 1 setup, validation, randomness, and initial-state checks in `tests/acceptance.md`

**Checkpoint**: The MVP setup flow independently reaches a valid, visibly identified first-player game.

---

## Phase 4: User Story 2 - Track the Current Game (Priority: P1)

**Goal**: Track unbounded life totals and round-based turns on a shared touch-friendly tablet screen.

**Independent Test**: Start a valid game, adjust both teams below zero and above 40, advance through first-team Turn 1, second-team Turn 1, and first-team Turn 2, then verify all displayed state.

### Implementation for User Story 2

- [X] T018 [US2] Implement separate +1 and -1 life actions for each team without upper or lower bounds in `app.js`
- [X] T019 [US2] Implement turn advancement that alternates teams and increments the shared turn only when the first team becomes active again in `app.js`
- [X] T020 [US2] Connect life and turn controls to active-game rendering and persistence in `app.js`, `index.html`, and `styles.css`
- [X] T021 [US2] Complete the tablet portrait and landscape game-board layout with stable touch targets and active-team emphasis in `styles.css`
- [X] T022 [P] [US2] Add state-transition coverage for life adjustments, negative and above-40 values, and round-based turn sequencing in `tests/game-state.test.js`
- [X] T023 [P] [US2] Record User Story 2 touch, orientation, life, and turn checks in `tests/acceptance.md`

**Checkpoint**: User Stories 1 and 2 work together, and live game state remains correct through the full specified turn and life ranges.

---

## Phase 5: User Story 3 - End a Game and Review Results (Priority: P2)

**Goal**: Declare a winner, save a complete result, and review recent games before starting another game.

**Independent Test**: Complete games with each possible winner, reload the page, and verify newest-first history contains both teams, winner, shared winning turn, and final life totals.

### Implementation for User Story 3

- [X] T024 [US3] Implement End Game flow with mutually exclusive winner selection, cancel behavior, and required confirmation in `app.js`, `index.html`, and `styles.css`
- [X] T025 [US3] Create Completed Game snapshots with team compositions, winner, shared winning turn number, final life totals, and completion timestamp in `app.js`
- [X] T026 [US3] Render newest-first recent history and empty-history state in the between-games view in `app.js`, `index.html`, and `styles.css`
- [X] T027 [US3] Implement active-game abandonment confirmation and fresh-game setup while preserving completed history in `app.js`
- [X] T028 [P] [US3] Add persistence coverage for completed-game ordering, reload recovery, malformed storage, and storage failure behavior in `tests/persistence.test.js`
- [X] T029 [P] [US3] Record User Story 3 completion, history, reload, and abandonment checks in `tests/acceptance.md`

**Checkpoint**: All user stories are independently demonstrable through setup, live tracking, completion, and history review.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete static app against the constitution, contracts, and quickstart.

- [X] T030 [P] Add accessible focus states, readable error messaging, and reduced-motion-safe styling in `styles.css` and `index.html`
- [X] T031 [P] Add GitHub Pages-relative asset paths, page metadata, and deployment guidance in `index.html` and `README.md`
- [X] T032 [P] Add explicit runtime diagnostics for storage, randomness, and invalid persisted-state failures in `app.js`
- [X] T033 Run the complete quickstart validation, including offline-after-load and portrait/landscape checks, and record results in `tests/acceptance.md`
- [X] T034 Run focused state and persistence validation in-browser and record Node.js unavailability in the implementation report in `tests/acceptance.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001-T005 can proceed in parallel because they target separate files or concerns.
- **Foundational (Phase 2)**: Depends on Phase 1; T006-T009 establish shared runtime behavior, while T010-T011 can proceed in parallel with each other after the shell exists.
- **User Story 1 (Phase 3)**: Depends on Phase 2; this is the MVP entry point.
- **User Story 2 (Phase 4)**: Depends on US1 because it extends the active game created by setup.
- **User Story 3 (Phase 5)**: Depends on US2 because it records the live game's current state and turn.
- **Polish (Phase 6)**: Depends on all desired user stories; T030-T032 can proceed in parallel before T033-T034.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on foundational state, validation, persistence, and rendering; no dependency on another user story.
- **User Story 2 (P1)**: Depends on US1's active-game creation and initial rendering.
- **User Story 3 (P2)**: Depends on US2's live state and persistence integration.

### Parallel Opportunities

- **Setup**: T001, T002, T003, T004, and T005 can run in parallel.
- **Foundation**: T010 and T011 can run in parallel after the initial shell; T006-T009 remain ordered around shared `app.js` state.
- **US2**: T022 and T023 can run in parallel after the live behavior contract is stable.
- **US3**: T028 and T029 can run in parallel after the completion/history contract is stable.
- **Polish**: T030, T031, and T032 can run in parallel; T033 and T034 run after them.

## Parallel Example: User Story 1

```text
Task: "Implement setup markup and New Game navigation in index.html and app.js"
Task: "Implement setup validation messages and selected-member styling in styles.css"
Task: "Add setup and first-player acceptance checks in tests/acceptance.md"
```

## Parallel Example: User Story 2

```text
Task: "Implement life adjustment and round-based turn transitions in app.js"
Task: "Implement tablet portrait and landscape game-board layout in styles.css"
Task: "Add state-transition coverage in tests/game-state.test.js"
```

## Parallel Example: User Story 3

```text
Task: "Implement winner confirmation and Completed Game snapshots in app.js"
Task: "Implement recent-history presentation in index.html and styles.css"
Task: "Add persistence and completion acceptance checks in tests/persistence.test.js and tests/acceptance.md"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational prerequisites.
3. Complete Phase 3: User Story 1.
4. Run the User Story 1 independent test and confirm setup, 40 life, Turn 1, and random first-player behavior.
5. Stop for a deployable/demoable MVP before adding live controls and history.

### Incremental Delivery

1. Complete Setup and Foundational phases.
2. Add User Story 1 and validate the setup MVP.
3. Add User Story 2 and validate life and round-based turn tracking.
4. Add User Story 3 and validate completion, persistence, and history.
5. Complete polish and full quickstart validation.

## Notes

- Every task starts with `- [ ]`, has a sequential `T###` identifier, and includes a file path.
- `[P]` is used only when a task can work independently on different files or concerns.
- Story labels appear on all user-story phase tasks and map to the specification's priorities.
- The app remains dependency-free and client-only as required by the plan and constitution.
