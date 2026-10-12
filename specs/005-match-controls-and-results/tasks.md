# Tasks: Match Controls and Game Results Editing

**Input**: Design documents from `/specs/005-match-controls-and-results/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui-contract.md, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Test and scaffold preparation for feature extensions

- [X] T001 Initialize test suite structure for edit results and match controls in tests/edit-results.test.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state definitions and helper functions needed across user stories

- [X] T002 Update core exported state schemas and validation helpers for staging and edited results in app.js

---

## Phase 3: User Story 1 - First-Player Confirmation Stage (Priority: P1) 🎯 MVP

**Goal**: Present an explicit first-player stage after team selection showing the picked starter and selection reason, with options to go back to team setup (preserving roster selections) or continue to start the live game.

**Independent Test**: Configure valid teams in setup, advance to the first-player stage, verify the announced starter and rationale (smaller team fairness vs random), tap "Go back" to verify team members remain checked, and tap "Continue to game" to enter active gameplay.

### Tests for User Story 1
- [X] T003 [P] [US1] Add unit tests for first-player staging and team preservation on back-navigation in tests/game-state.test.js

### Implementation for User Story 1
- [X] T004 [P] [US1] Add DOM structure for #first-player-view including announcement, rationale badge, and navigation buttons in index.html
- [X] T005 [P] [US1] Add styling for #first-player-view, announcement badge, and stage actions in styles.css
- [X] T006 [US1] Implement first-player staging logic, view rendering, and navigation event handlers in app.js

---

## Phase 4: User Story 2 - Edit Completed Game Results (Priority: P1)

**Goal**: Provide an edit action on completed game cards between games allowing users to modify the winner, final life totals, and elapsed time totals, dynamically updating the game card and recalculating player statistics and CSV exports.

**Independent Test**: From the between-games history view, open an existing completed game in edit mode, change the winner, life totals, and time durations, save, and verify the game card updates and player results (wins/losses/percentages) recalculate with zero discrepancy.

### Tests for User Story 2
- [X] T007 [P] [US2] Add unit tests for editCompletedGame logic, input validation, and statistic recalculation in tests/edit-results.test.js

### Implementation for User Story 2
- [X] T008 [P] [US2] Add DOM structure for #edit-game-view modal including winner radio buttons, life inputs, timer inputs, error alert, and action buttons in index.html
- [X] T009 [P] [US2] Add styling for completed game edit buttons and #edit-game-view modal in styles.css
- [X] T010 [US2] Implement editCompletedGame data transformation, time parsing/formatting helper, and modal state management in app.js
- [X] T011 [US2] Implement history card edit buttons, modal open/close, validation, save handlers, and view re-render in app.js

---

## Phase 5: User Story 3 - Rapid ±3 Point Life Adjustments (Priority: P2)

**Goal**: Provide dedicated -3 and +3 life adjustment buttons for each team during live gameplay, with transient visual feedback and event audit logging.

**Independent Test**: In an active game, tap the +3 and -3 buttons on team cards, confirm life totals increment/decrement by 3, verify transient highlight animation, and verify corresponding entries in the audit log.

### Tests for User Story 3
- [X] T012 [P] [US3] Add unit tests for ±3 life adjustment logic and audit event generation in tests/game-state.test.js

### Implementation for User Story 3
- [X] T013 [P] [US3] Update life controls layout styling for 6 buttons per team across viewports in styles.css
- [X] T014 [US3] Update life adjustment button generation to include -3 and +3 deltas in app.js

---

## Phase 6: User Story 4 - Maximize Screen View (Priority: P3)

**Goal**: Add a Maximize button in the header that toggles full-screen mode using the browser Fullscreen API, with automatic state synchronization and graceful fallback.

**Independent Test**: Click Maximize in the header to expand the app to full screen and observe the button text change to Restore/Exit, then press Escape or click Restore to return to standard view and observe button text revert.

### Implementation for User Story 4
- [X] T015 [P] [US4] Add #maximize-button to the site header in index.html
- [X] T016 [P] [US4] Add header button styling and responsive layout adjustments for #maximize-button in styles.css
- [X] T017 [US4] Implement Fullscreen API request/exit toggle, fullscreenchange event listener, and feature detection fallback in app.js

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, responsive validation, and end-to-end quality checks

- [X] T018 [P] Verify touch targets (min 44x44px) and keyboard accessibility across new controls in styles.css
- [X] T019 Run full test suite and validate end-to-end scenarios per specs/005-match-controls-and-results/quickstart.md

---

## Dependencies & Execution Order

### Story Dependencies
- **Phase 1 (Setup)** and **Phase 2 (Foundational)** must be completed before user stories.
- **User Story 1 [US1]** and **User Story 2 [US2]** are both Priority P1, but are independent of each other:
  - US1 operates on the setup/staging flow (`#setup-view` → `#first-player-view` → `#in-game-view`).
  - US2 operates on the between-games history flow (`#between-games-view` → `#edit-game-view`).
- **User Story 3 [US3]** modifies the active game view life controls (`#in-game-view`), independent of US1 and US2.
- **User Story 4 [US4]** operates on the global header (`.site-header`), independent of all individual view states.
- **Phase 7 (Polish)** runs after all desired story phases are complete.

### Parallel Execution Opportunities
- `T003` (tests), `T004` (DOM), `T005` (CSS) can run in parallel for US1.
- `T007` (tests), `T008` (DOM), `T009` (CSS) can run in parallel for US2.
- `T012` (tests) and `T013` (CSS) can run in parallel for US3.
- `T015` (DOM) and `T016` (CSS) can run in parallel for US4.

---

## Implementation Strategy & MVP

1. **MVP (Minimum Viable Product)**: Deliver **Phase 1**, **Phase 2**, and **Phase 3 (User Story 1: First-Player Confirmation Stage)**. This immediately resolves the game setup confirmation gap without touching post-game or in-game scoring.
2. **Increment 2**: Implement **Phase 4 (User Story 2: Edit Completed Game Results)** to satisfy the remaining P1 requirement for score correction between games.
3. **Increment 3**: Implement **Phase 5 (User Story 3: ±3 Life Adjustments)** to streamline in-game life tracking.
4. **Increment 4**: Implement **Phase 6 (User Story 4: Maximize Screen View)** for full-screen display.
5. **Final**: Execute **Phase 7** for touch target verification, accessibility review, and test validation.
