# Tasks: Session Reset and Winner Default

**Input**: Design documents from `/specs/004-session-reset-winner-default/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Focused state, persistence, and browser acceptance validation tasks are included because the project constitution requires verification for testable behavior.

**Organization**: Tasks are grouped by user story and preserve existing dark-theme and gameplay behavior.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the existing app and test surfaces for reset and winner-default behavior.

- [X] T001 [P] Add New session action and reset-confirmation markup to the between-games view in `index.html`
- [X] T002 [P] Add reset confirmation, reset status, and selected-winner state styling in `styles.css`
- [X] T003 [P] Add focused reset/default test fixtures for state and persistence behavior in `tests/game-state.test.js` and `tests/persistence.test.js`
- [X] T004 [P] Extend the acceptance checklist with reset cancellation/confirmation and winner-default cases in `tests/acceptance.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define pure state helpers and preserve the existing storage contract before view integration.

**CRITICAL**: User story work depends on these helpers.

- [X] T005 Implement a pure higher-life winner-default helper returning Team Blue, Team Green, or no selection for ties in `app.js`
- [X] T006 Implement a reset-state helper that returns the existing empty persistence envelope without touching unrelated browser data in `app.js`
- [X] T007 Verify reset writes only the existing application storage key and preserves schemaVersion in `app.js` and `tests/persistence.test.js`
- [X] T008 Verify winner defaults use numeric values for negative and above-40 life totals in `tests/game-state.test.js`

**Checkpoint**: Reset and winner-default semantics are independently testable without changing existing game records.

---

## Phase 3: User Story 1 - Start a Fresh Session (Priority: P1) 🎯 MVP

**Goal**: Let users explicitly erase this app's active game, history, and player results after understanding and confirming the consequence.

**Independent Test**: With data present, open New session, cancel and verify no changes, then confirm and verify empty history, no player rows, no active game, and normal fresh setup afterward.

### Implementation for User Story 1

- [X] T009 [US1] Render a distinct New session action beside New game in the between-games view in `index.html` and `app.js`
- [X] T010 [US1] Open a confirmation state whose message names active game, completed history, and player results as data to erase and exposes explicit confirm/cancel actions in `app.js`
- [X] T011 [US1] Implement cancel behavior that closes reset confirmation without changing state or local storage in `app.js`
- [X] T012 [US1] Implement confirmed reset that writes the empty persistence envelope, clears the active game, and returns to between-games in `app.js`
- [X] T013 [US1] Ensure reset clears derived player-result rendering and leaves unrelated browser storage untouched in `app.js` and `index.html`
- [X] T014 [P] [US1] Record reset warning, cancel, confirm, empty-state, active-game, and fresh-session acceptance results in `tests/acceptance.md`

**Checkpoint**: Users can safely cancel or confirm a destructive reset, and a confirmed reset produces a clean session.

---

## Phase 4: User Story 2 - Default the Likely Winner (Priority: P1)

**Goal**: Preselect the higher-life team when ending a game while requiring an explicit choice for ties and allowing overrides.

**Independent Test**: End games with Team Blue higher, Team Green higher, equal, negative, and above-40 totals; verify the default, tie behavior, override, and saved final winner.

### Implementation for User Story 2

- [X] T015 [US2] Derive the default winner when opening the end-game view from current numeric life totals in `app.js`
- [X] T016 [US2] Leave both winner options unselected for equal life totals and keep Save result unavailable until a choice is made in `app.js` and `index.html`
- [X] T017 [US2] Preserve user replacement of the default winner and save the final selected team in `app.js`
- [X] T018 [US2] Render default and user-selected winner states accessibly on the dark theme in `styles.css` and `index.html`
- [X] T019 [P] [US2] Add higher/equal/negative/above-40/default-override state coverage in `tests/game-state.test.js`
- [X] T020 [P] [US2] Record winner-default, tie, override, and saved-result acceptance outcomes in `tests/acceptance.md`

**Checkpoint**: End-game completion is faster for likely winners without silently deciding ties or preventing correction.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validate safety, persistence, accessibility, and regression preservation.

- [X] T021 [P] Ensure destructive confirmation and winner controls remain readable, focused, and touch-usable at tablet sizes in `styles.css`
- [X] T022 [P] Add persistence coverage for reset/reload behavior, empty state, and unchanged unrelated storage in `tests/persistence.test.js`
- [X] T023 [P] Update session-reset and winner-default run guidance in `README.md`
- [X] T024 Run the complete feature quickstart and baseline regression validation, then record results in `tests/acceptance.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001-T004 can run in parallel across markup, styles, and test surfaces.
- **Foundational (Phase 2)**: Depends on Setup; T005-T008 define and verify pure reset/default semantics.
- **User Story 1 (Phase 3)**: Depends on Foundation; this is the destructive-session MVP.
- **User Story 2 (Phase 4)**: Depends on Foundation and existing end-game rendering; independent of reset UI after shared helpers exist.
- **Polish (Phase 5)**: Depends on both stories; T021-T023 can run in parallel before T024.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on reset helpers and existing between-games rendering; no dependency on winner-default behavior.
- **User Story 2 (P1)**: Depends on winner-default helper and existing active-game life state; no dependency on session reset.

### Parallel Opportunities

- **Setup**: T001-T004 can run in parallel.
- **Foundation**: T005-T008 can be split between state helpers and focused tests.
- **US1**: T014 can run in parallel after reset semantics are stable.
- **US2**: T019 and T020 can run in parallel after winner selection behavior is stable.
- **Polish**: T021-T023 can run in parallel; T024 runs afterward.

## Parallel Example: User Story 1

```text
Task: "Implement New session markup and confirmation styling in index.html and styles.css"
Task: "Implement reset state transition and storage write in app.js"
Task: "Add reset cancel/confirm acceptance checks in tests/acceptance.md"
```

## Parallel Example: User Story 2

```text
Task: "Implement higher-life default and tie logic in app.js"
Task: "Implement accessible selected/unselected winner styling in styles.css"
Task: "Add higher/equal/negative/above-40 winner checks in tests/game-state.test.js"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational helpers.
3. Complete Phase 3: User Story 1.
4. Validate cancel safety, explicit warning, confirmed clearing, and fresh-session setup.
5. Stop at a safe session-reset MVP before adding winner defaults.

### Incremental Delivery

1. Complete Setup and Foundation.
2. Add US1 and validate destructive reset safety.
3. Add US2 and validate higher-life defaults, ties, and overrides.
4. Complete accessibility, persistence, and baseline regression validation.

## Notes

- Every task starts with `- [ ]`, has a sequential `T###` identifier, and includes concrete file paths.
- `[P]` marks tasks that can proceed independently without incomplete shared-file dependencies.
- Reset is the only behavior allowed to clear the existing app storage envelope, and only after confirmation.
