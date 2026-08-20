# Tasks: Dark Theme and Team Shading

**Input**: Design documents from `/specs/003-dark-team-theme/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Browser visual/interaction validation and focused regression checks are included because the project constitution requires verification for testable behavior.

**Organization**: Tasks are grouped by user story while preserving the existing client-only game behavior and persisted data.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the existing static app for dark presentation changes.

- [X] T001 [P] Inventory all existing view, panel, control, table, modal, input, status, focus, disabled, selected, and active selectors in `styles.css`
- [X] T002 [P] Inventory all existing team surface and active-state hooks in `index.html`, `app.js`, and `styles.css`
- [X] T003 [P] Extend the browser acceptance checklist with dark-theme, team-shading, contrast, and baseline-preservation checks in `tests/acceptance.md`
- [X] T004 [P] Add focused visual-regression test fixtures for theme tokens and team surfaces in `tests/game-state.test.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define the shared presentation tokens and preserve the data contract before view-specific styling.

**CRITICAL**: User story work depends on these presentation primitives.

- [X] T005 Define dark page, surface, text, border, control, table, modal, input, status, focus, disabled, selected, and error tokens in `styles.css`
- [X] T006 Define dark Team Blue and Team Green shade/accent tokens that remain distinct from the page background and each other in `styles.css`
- [X] T007 Define a separate non-color active highlight treatment that works over either team shade in `styles.css`
- [X] T008 Verify the theme requires no new persisted fields, runtime dependencies, or network requests in `app.js` and `tests/persistence.test.js`

**Checkpoint**: Shared dark and team presentation tokens exist without changing game state or persistence.

---

## Phase 3: User Story 1 - Use the App in a Dark Theme (Priority: P1) 🎯 MVP

**Goal**: Make every user-facing view and state consistently dark and readable.

**Independent Test**: Open between-games, setup, active-game, and end-game views, exercise default/hover/focus/disabled/selected/error states, and verify no conflicting bright surface remains.

### Implementation for User Story 1

- [X] T009 [US1] Apply dark page and surface tokens to the global shell, headers, text, controls, and backgrounds in `styles.css`
- [X] T010 [US1] Apply dark styling to history cards, player-results tables, empty states, status messages, setup inputs, and winner dialog surfaces in `styles.css`
- [X] T011 [US1] Update focus, hover, disabled, selected, and error states for readable dark-theme contrast in `styles.css`
- [X] T012 [US1] Preserve semantic labels, live regions, and existing view structure while adding only required theme hooks in `index.html`
- [X] T013 [P] [US1] Add dark-theme view/state acceptance results to `tests/acceptance.md`

**Checkpoint**: The entire app is dark by default, readable, and usable across all existing states.

---

## Phase 4: User Story 2 - Distinguish Team Displays by Shading (Priority: P1)

**Goal**: Render distinct dark blue and dark green team surfaces while preserving active-team emphasis.

**Independent Test**: Start a game, inspect Team Blue and Team Green in setup and active play, change turns, and verify shade identity, active highlight, labels, and required controls remain clear.

### Implementation for User Story 2

- [X] T014 [US2] Apply Team Blue and Team Green dark shade classes/tokens to setup panels, active-game panels, and team-associated history surfaces in `app.js`, `index.html`, and `styles.css`
- [X] T015 [US2] Apply the separate active highlight to the current team without changing `activeTeamId` or turn behavior in `app.js` and `styles.css`
- [X] T016 [US2] Preserve readable team names and non-color identity cues on shaded surfaces in `index.html` and `styles.css`
- [X] T017 [US2] Verify negative and above-40 life totals, member lists, and all life controls remain readable on both team shades in `styles.css`
- [X] T018 [P] [US2] Add team-shading, active-highlight, and orientation acceptance results to `tests/acceptance.md`

**Checkpoint**: Team Blue and Team Green are visibly distinct in all relevant views, and active-turn feedback remains unambiguous.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Confirm the presentation change meets accessibility, tablet, and regression requirements.

- [X] T019 [P] Add forced-contrast, reduced-motion, and non-color active-state safeguards in `styles.css`
- [X] T020 [P] Verify tablet portrait and landscape layouts have no clipping, overlap, or hidden required controls in `styles.css` and `tests/acceptance.md`
- [X] T021 [P] Verify existing team setup, roster sorting, life deltas, turns, first-player selection, history, player statistics, and reload recovery remain unchanged in `tests/game-state.test.js` and `tests/persistence.test.js`
- [X] T022 [P] Update dark-theme and team-shading run guidance in `README.md`
- [X] T023 Run the complete dark-theme quickstart and record results in `tests/acceptance.md`
- [X] T024 Run focused browser regression validation and resolve any failures in `tests/game-state.test.js`, `tests/persistence.test.js`, and `tests/acceptance.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001-T004 can run in parallel because they inspect or extend separate concerns.
- **Foundational (Phase 2)**: Depends on Setup; T005-T007 define shared CSS presentation tokens, while T008 verifies preservation constraints.
- **User Story 1 (Phase 3)**: Depends on Foundation; this is the dark-theme MVP.
- **User Story 2 (Phase 4)**: Depends on Foundation and the dark surface tokens from US1.
- **Polish (Phase 5)**: Depends on both user stories; T019-T022 can run in parallel before T023-T024.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on foundational presentation tokens; independent of team-specific shading after tokens exist.
- **User Story 2 (P1)**: Depends on the dark theme surface treatment and existing Team Blue/Team Green identity hooks.

### Parallel Opportunities

- **Setup**: T001-T004 can run in parallel.
- **Foundation**: T005-T007 are separate token concerns; T008 can run in parallel with token work.
- **US1**: T013 can run in parallel after the dark-state contract is stable.
- **US2**: T018 can run in parallel after team shade and active-highlight behavior is stable.
- **Polish**: T019-T022 can run in parallel; T023-T024 run afterward.

## Parallel Example: User Story 1

```text
Task: "Apply global dark page and surface tokens in styles.css"
Task: "Apply dark table, modal, input, status, and error states in styles.css"
Task: "Add dark-theme acceptance results in tests/acceptance.md"
```

## Parallel Example: User Story 2

```text
Task: "Apply Team Blue and Team Green shade hooks in app.js, index.html, and styles.css"
Task: "Add active highlight and forced-contrast safeguards in styles.css"
Task: "Add team-shading and orientation acceptance results in tests/acceptance.md"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational presentation tokens.
3. Complete Phase 3: User Story 1.
4. Validate every view and interactive state in the dark theme.
5. Stop at a readable dark-theme MVP before adding team-specific surface shading.

### Incremental Delivery

1. Complete Setup and Foundation.
2. Add US1 and validate the dark interface.
3. Add US2 and validate team shades and active emphasis.
4. Complete accessibility, orientation, persistence, and baseline regression checks.

## Notes

- Every task starts with `- [ ]`, has a sequential `T###` identifier, and includes concrete file paths.
- `[P]` marks only tasks that can proceed independently without incomplete shared-file work.
- The feature changes presentation only; persisted game data and game-state logic remain unchanged.
