# Tasks: Team Display and Player Statistics

**Input**: Design documents from `/specs/002-team-display-stats/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Focused state and browser acceptance validation tasks are included because the project constitution requires verification for testable behavior.

**Organization**: Tasks are grouped by enhancement user story and preserve the baseline tracker behavior.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the existing static app and validation surfaces for the enhancement.

- [X] T001 [P] Add Team Blue/Team Green identity constants and shared blue/green visual tokens in `app.js` and `styles.css`
- [X] T002 [P] Add setup, active-game, history, and player-results markup containers in `index.html`
- [X] T003 [P] Extend the browser state test surface for sorting, life deltas, and player aggregation in `tests/game-state.test.js`
- [X] T004 [P] Extend the browser acceptance checklist for team display, controls, and statistics in `tests/acceptance.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared derivation and presentation helpers before story-specific UI work.

**CRITICAL**: User story implementation depends on these helpers.

- [X] T005 Implement case-insensitive alphabetical roster sorting without mutating persisted team records in `app.js`
- [X] T006 Implement player-results aggregation from completed games with games played, wins, losses, and one-decimal win percentage in `app.js`
- [X] T007 Update shared team labels and color classes in all render paths while preserving existing persisted team IDs in `app.js` and `styles.css`
- [X] T008 Add shared player-result table headings, empty-state messaging, and accessible status regions in `index.html`

**Checkpoint**: Shared identity, sorting, aggregation, and markup primitives are ready for story work.

---

## Phase 3: User Story 1 - Identify Teams Visually (Priority: P1) 🎯 MVP

**Goal**: Make Team Blue and Team Green unmistakable and prevent duplicate roster selection.

**Independent Test**: Open setup, verify fixed names/colors and alphabetical players, select a player for one team, and verify the opposing control is greyed out and disabled until removal.

### Implementation for User Story 1

- [X] T009 [US1] Render Team Blue and Team Green setup headings and matching visual treatments in `index.html`, `app.js`, and `styles.css`
- [X] T010 [US1] Render setup player controls in alphabetical order and retain selected-state order independently in `app.js`
- [X] T011 [US1] Disable and grey out each selected player's opposing-team control, then re-enable it when removed, in `app.js` and `styles.css`
- [X] T012 [US1] Apply sorted member rendering to active-game and completed-history team lists in `app.js`
- [X] T013 [P] [US1] Add setup identity, sorting, and opposing-control acceptance checks in `tests/acceptance.md`

**Checkpoint**: Setup and every existing roster display use stable names, colors, alphabetical order, and duplicate-selection prevention.

---

## Phase 4: User Story 2 - Make Live Play Controls Clear (Priority: P1)

**Goal**: Highlight the active team and provide exact one-point and five-point life adjustments.

**Independent Test**: Start a game, identify the highlighted active team, apply all four life deltas to both teams including beyond the baseline range, and advance the turn to verify the highlight moves.

### Implementation for User Story 2

- [X] T014 [US2] Add -1, +1, -5, and +5 controls with exact delta handling for each team in `app.js` and `index.html`
- [X] T015 [US2] Preserve unbounded life totals for five-point changes and persist each adjustment in `app.js`
- [X] T016 [US2] Apply a distinct active-team highlight in addition to Team Blue/Team Green color treatments in `app.js` and `styles.css`
- [X] T017 [US2] Keep active highlighting correct after round-based turn transitions and reload recovery in `app.js`
- [X] T018 [P] [US2] Add focused state coverage for +/-1, +/-5, unbounded totals, and active-team transitions in `tests/game-state.test.js`
- [X] T019 [P] [US2] Add live-control, active-highlight, and orientation acceptance checks in `tests/acceptance.md`

**Checkpoint**: Live play supports exact four-way life changes and clearly identifies the current team without regressing baseline turn behavior.

---

## Phase 5: User Story 3 - Review Player Performance (Priority: P2)

**Goal**: Add newest-state player statistics to between-games without duplicating persisted history.

**Independent Test**: Complete games with known winners and overlapping players, then verify alphabetized rows show games, wins, losses, and one-decimal percentages; verify the zero-results state with no history.

### Implementation for User Story 3

- [X] T020 [US3] Render the alphabetized player-results table beside completed-game history in `index.html`, `app.js`, and `styles.css`
- [X] T021 [US3] Populate player rows from completed-game rosters and winner IDs with games, wins, losses, and one-decimal percentages in `app.js`
- [X] T022 [US3] Render the no-completed-games player-statistics state without fabricated percentages in `app.js` and `index.html`
- [X] T023 [US3] Recalculate player statistics whenever history renders while preserving completed-game records in `app.js`
- [X] T024 [P] [US3] Add aggregation and percentage coverage for undefeated, winless, mixed, and duplicate-safe records in `tests/game-state.test.js`
- [X] T025 [P] [US3] Add player-history and zero-results acceptance checks in `tests/acceptance.md`

**Checkpoint**: Between-games view shows accurate player results while baseline game cards and persistence remain unchanged.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the enhancement across devices, accessibility, and baseline compatibility.

- [X] T026 [P] Ensure color contrast, non-color active indication, disabled-control contrast, and focus states meet the tablet accessibility contract in `styles.css` and `index.html`
- [X] T027 [P] Verify all team-member listings use one canonical alphabetical sort helper in `app.js`
- [X] T028 [P] Add malformed/empty-history and legacy persisted-record coverage for derived player statistics in `tests/persistence.test.js`
- [X] T029 [P] Update enhancement run instructions and GitHub Pages notes in `README.md`
- [X] T030 Run the complete enhancement quickstart in portrait and landscape and record results in `tests/acceptance.md`
- [X] T031 Run focused browser/state validation and resolve failures in `tests/game-state.test.js`, `tests/persistence.test.js`, and `tests/acceptance.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001-T004 can proceed in parallel because they target separate concerns.
- **Foundational (Phase 2)**: Depends on Setup; T005-T008 establish shared helpers and markup before story work.
- **User Story 1 (Phase 3)**: Depends on Foundation; this is the enhancement MVP.
- **User Story 2 (Phase 4)**: Depends on Foundation and the team identity/rendering established by US1.
- **User Story 3 (Phase 5)**: Depends on Foundation and completed-game rendering from the baseline; it can follow US1/US2 for integrated validation.
- **Polish (Phase 6)**: Depends on all desired stories; T026-T029 can run in parallel before T030-T031.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundation; independent of US2 and US3 after shared helpers exist.
- **User Story 2 (P1)**: Depends on Foundation and the fixed team identity introduced by US1.
- **User Story 3 (P2)**: Depends on the existing completed-game records and shared aggregation helper; independent of life-control implementation at the data level.

### Parallel Opportunities

- **Setup**: T001, T002, T003, and T004 can run in parallel.
- **US1**: T013 can run in parallel after the setup contract is stable; styling and render work remain sequential where they touch the same files.
- **US2**: T018 and T019 can run in parallel after control semantics are fixed.
- **US3**: T024 and T025 can run in parallel after the aggregation contract is fixed.
- **Polish**: T026-T029 can run in parallel; T030-T031 run afterward.

## Parallel Example: User Story 1

```text
Task: "Implement fixed Team Blue/Team Green setup labels and color classes in index.html and styles.css"
Task: "Implement opposing-player disabled state in app.js"
Task: "Add setup sorting and duplicate-selection acceptance checks in tests/acceptance.md"
```

## Parallel Example: User Story 2

```text
Task: "Implement +/-1 and +/-5 life actions in app.js and index.html"
Task: "Implement active-team emphasis and disabled-control styling in styles.css"
Task: "Add live control and turn transition checks in tests/game-state.test.js"
```

## Parallel Example: User Story 3

```text
Task: "Implement player-results aggregation in app.js"
Task: "Implement player-results table structure and empty state in index.html and styles.css"
Task: "Add mixed-record aggregation checks in tests/game-state.test.js"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational prerequisites.
3. Complete Phase 3: User Story 1.
4. Validate fixed names/colors, alphabetical rosters, and opposing-player disabling.
5. Stop at the enhancement MVP before adding live control changes and player statistics.

### Incremental Delivery

1. Complete Setup and Foundation.
2. Add US1 and validate setup identity and selection locking.
3. Add US2 and validate live controls and active highlighting.
4. Add US3 and validate player statistics and empty history.
5. Complete polish, persistence compatibility, and orientation validation.

## Notes

- Every task starts with `- [ ]`, has a sequential `T###` identifier, and includes a concrete file path.
- `[P]` appears only for tasks that can work independently without incomplete-file dependencies.
- Story labels appear on all user-story phase tasks and map to the enhancement specification.
- Derived player statistics must not be persisted separately from completed games.
