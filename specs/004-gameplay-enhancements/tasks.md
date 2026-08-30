# Tasks: MTG Gameplay Enhancements

**Input**: Design documents from `/specs/004-gameplay-enhancements/`

**Prerequisites**: 
- plan.md (implementation plan, tech stack)
- spec.md (9 user stories with P1/P2 priorities)
- research.md (technology decisions)
- data-model.md (state structure extensions)
- contracts/ (game-state, audit-log, csv-export, timer)
- quickstart.md (validation scenarios)

**Organization**: Tasks grouped by user story (P1 stories first, then P2) to enable independent implementation and testing. All tasks reference exact file paths for immediate execution.

**Format**: `- [ ] [ID] [P?] [Story] Description with file path`
- **[P]**: Parallelizable (different files, no blocking dependencies)
- **[Story]**: User story (US1, US2, etc.) - omitted for Setup/Foundational/Polish phases

---

## Phase 1: Setup - Extend Game State Infrastructure

**Purpose**: Prepare existing files for feature additions. NO NEW FILES created yet; only extend existing structures.


- [x] T001 Understand existing app.js structure and state management by reviewing: app.js lines 1-150 (state model, validation, game creation)
- [x] T002 Review existing index.html structure and DOM layout for in-game and between-games views: index.html
- [x] T003 Review existing styles.css for responsive design patterns (portrait/landscape): styles.css
- [x] T004 Verify localStorage schema and storage key usage in existing code: app.js (STORAGE_KEY constant)

**Checkpoint**: Ready to extend existing files with new functionality


## Phase 2: Foundational - Core State Extensions (Blocking All User Stories)

**Purpose**: Extend game state model to support all 9 features. MUST complete before any user story work begins.

- [X] T005 [P] Extend Active Game state object to include `undoHistory`, `timers`, `auditLog`, and `firstPlayerSelectionMethod` fields per data-model.md - modify app.js emptyState() and createActiveGame()
- [X] T006 [P] Create audit log event schema with 5 event types (GameStarted, LifeAdjusted, TurnAdvanced, UndoTurn, GameEnded) - add to app.js as event type definitions and helper function recordAuditEvent()
- [X] T007 [P] Implement timer state initialization for both teams with `elapsedMs` and `lastStartTime` fields per timer-contract.md - add initializeTimers() function to app.js
- [X] T008 [P] Extend Completed Game schema to include `teamTimers` and `auditLog` fields - modify createCompletedGame() in app.js
- [X] T009 Extend localStorage persistence to save and restore `undoHistory`, `timers`, and `auditLog` in app.js - modify emptyState() and all storage/recovery functions
- [X] T010 [P] Add localStorage keys for user preferences: `sound-enabled` (default true) and `sort-preference` (default date descending) - add getPreference() and setPreference() helpers to app.js
- [X] T011 Create game state validation function to verify new fields (audit log completeness, timer state consistency) - add validateGameState() to app.js

**Checkpoint**: Game state model fully extended and backward-compatible. Ready to implement user story features.

---

## Phase 3: User Story 1 - Fair Game Start with Team Size Awareness (Priority: P1)

**Goal**: When team sizes differ, automatically select the smaller team as first player instead of random selection.

**Independent Test**: 
1. Create game with unequal team sizes (2 vs 4 members)
2. Verify smaller team is selected as first player
3. Create game with equal team sizes (3 vs 3 members)
4. Verify random selection is used (not deterministic)
5. Audit log shows correct `firstPlayerSelectionMethod`

### Implementation for User Story 1

- [X] T012 [US1] Modify chooseFirstTeam() function in app.js to compare team member counts and select smaller team (FR-001, FR-002) - update function signature to accept team array parameter
- [X] T013 [US1] Add `firstPlayerSelectionMethod` field to Active Game state ('team-size-fairness', 'random', or 'fallback-random') - modify createActiveGame() and chooseFirstTeam()
- [X] T014 [US1] Record 'GameStarted' audit event with firstPlayerSelectionMethod in app.js createActiveGame() - call recordAuditEvent()
- [X] T015 [US1] Update game view to display first player selection method (show indicator if fairness was applied) - modify index.html and styles.css
- [X] T016 [US1] Test fair selection: Run quickstart.md Scenario 1 end-to-end

**Checkpoint**: Fair first-player selection complete. User Story 1 independently testable and functional.

---

## Phase 4: User Story 2 - Intuitive Visual Layout for Gameplay (Priority: P1)

**Goal**: First-player team always displayed on left side of game view in both portrait and landscape.

**Independent Test**:
1. Start game with known first-player team
2. Verify first-player team rendered on left in portrait mode
3. Rotate to landscape, verify left-side position preserved
4. Advance turn, verify left-side team unchanged
5. Verify layout responsive and uncluttered in both orientations

### Implementation for User Story 2

- [X] T017 [P] [US2] Modify game-view template in index.html to render teams in order: [firstPlayerTeam, otherTeam] (ensures left=first player) - update game display section structure
- [X] T018 [P] [US2] Update styles.css to use CSS Grid or Flexbox for left-right team layout (50% width each) - add game-container flex layout with team-left and team-right columns
- [X] T019 [P] [US2] Ensure responsive design works in portrait and landscape (no overflow, all controls visible) - add media queries for iPad portrait/landscape in styles.css
- [X] T020 [P] [US2] Add visual indicator for active team (highlight, border, or color) - update index.html and styles.css
- [X] T021 [US2] Test layout consistency: Run quickstart.md Scenario 2 end-to-end (portrait, landscape, turn advances)

**Checkpoint**: Team layout stable and responsive. User Story 2 independently testable and functional.

---

## Phase 5: User Story 3 - Recover from Accidental Turn Advance (Priority: P1)

**Goal**: Provide undo button to revert turn state (turn counter, active team, life totals, timers).

**Independent Test**:
1. Verify undo button disabled at game start (no turns to revert)
2. Advance turn, press undo, verify state reverted
3. Advance 5 turns, undo 3 times, verify correct reversion each time
4. Adjust life total, advance turn, undo, verify both life and turn reverted
5. Advance after undo, verify no redo history (new timeline)

### Implementation for User Story 3

- [X] T022 [US3] Implement undo history stack as array in Active Game state (FR-004) - add undoHistory: [] field, initialize in createActiveGame()
- [X] T023 [US3] Create pushUndo() function to capture game state snapshot before turn advance (FR-004) - add to app.js, called before advanceTurn()
- [X] T024 [US3] Implement undoTurn() function to pop snapshot and restore all game fields (turnNumber, activeTeamId, lifeTotals, timers) (FR-004, FR-005) - add to app.js
- [X] T025 [US3] Disable undo button (or show message) when undoHistory is empty (FR-005) - add to index.html button logic
- [X] T026 [US3] Record 'UndoTurn' audit event when undo is pressed (FR-006, FR-023) - call recordAuditEvent() in undoTurn()
- [X] T027 [US3] Add undo button to game view UI - add button to index.html with click handler calling undoTurn()
- [X] T028 [US3] Style undo button with disabled state (grayed out when no history available) - add CSS to styles.css
- [X] T029 [US3] Test undo functionality: Run quickstart.md Scenario 3 end-to-end (advance, undo, undo multiple, undo with life adjustments)

**Checkpoint**: Undo functionality complete and safe (no data loss). User Story 3 independently testable and functional.

---

## Phase 6: User Story 4 - Auditory Feedback for Turn Advancement (Priority: P2)

**Goal**: Play distinctive sound when turn is advanced (respecting device mute and user preference).

**Independent Test**:
1. Advance turn, listen for sound
2. Disable sound in settings, advance turn, verify no sound
3. Set device to muted, enable sound in app, advance turn, verify device mute respected
4. Verify sound persists as user preference across page reload

### Implementation for User Story 4

- [X] T030 [P] [US4] Create embedded beep sound as base64 data URI (100 ms at 440 Hz) or reference pre-built sound - add sound resource to app.js as constant TURN_ADVANCE_SOUND_DATA
- [X] T031 [US4] Implement playTurnAdvanceSound() function using Web Audio API (or HTML5 audio fallback) - add to app.js, respects `sound-enabled` preference (FR-007, FR-008)
- [X] T032 [US4] Detect device mute state via browser APIs (Permissions API, volume control) - add detectDeviceMute() function to app.js (FR-008)
- [X] T033 [US4] Call playTurnAdvanceSound() in advanceTurn() function - add call before or after state update
- [X] T034 [P] [US4] Add sound toggle in UI settings/control panel - add toggle input to index.html with click handler calling setPreference('sound-enabled', boolean)
- [X] T035 [P] [US4] Persist sound preference in localStorage - getPreference() and setPreference() functions already created in Phase 2
- [X] T036 [P] [US4] Style sound toggle with visual indicator (speaker icon, label) - add to index.html and styles.css
- [X] T037 [US4] Test audio feedback: Run quickstart.md Scenario 4 end-to-end (sound enabled/disabled, device mute)

**Checkpoint**: Audio feedback complete and configurable. User Story 4 independently testable and functional.

---

## Phase 7: User Story 5 - Analyze Game Results with Flexible Sorting (Priority: P2)

**Goal**: Sort completed game results by player name, team, win count, participation, etc. Persist user preference.

**Independent Test**:
1. Display 5+ completed games with mixed results
2. Sort by player name (A→Z), verify alphabetical order
3. Sort by player name (Z→A), verify reverse order
4. Sort by win count (high→low), verify winners first
5. Reload page, verify sort preference restored

### Implementation for User Story 5

- [X] T038 [P] [US5] Enhance playerResults() function in app.js to compute all sortable metrics (wins, losses, games played, win %, participation frequency) - expand existing function
- [X] T039 [US5] Implement sort logic function sortCompletedGames(dimension, direction) - add to app.js, supports: 'player-name', 'win-count', 'games-played', 'win-percentage', 'date'
- [X] T040 [US5] Add sort dimension display and controls to between-games view - add dropdown or button group to index.html (select sort criterion)
- [X] T041 [P] [US5] Persist selected sort preference to localStorage under key 'sort-preference' - call setPreference() on sort change
- [X] T042 [P] [US5] Restore sort preference on page load or between-games view load - call getPreference() and apply on app initialization or view switch
- [X] T043 [P] [US5] Style sort controls (dropdown styling, active state, labels) - add to styles.css
- [X] T044 [US5] Test sortable statistics: Run quickstart.md Scenario 5 end-to-end (sort by various criteria, persistence)

**Checkpoint**: Sortable statistics complete. User Story 5 independently testable and functional.

---

## Phase 8: User Story 6 - Refined Visual Feedback for Life Point Adjustments (Priority: P2)

**Goal**: Life adjustment buttons show brief feedback animation (300 ms) that fades without persistent highlight.

**Independent Test**:
1. Press life button once, observe fade-out animation, verify no persistent highlight
2. Rapid press same button 10 times, each press shows distinct feedback
3. Verify button returns to default state after animation completes
4. Verify life total updates immediately (not delayed by animation)

### Implementation for User Story 6

- [X] T045 [P] [US6] Create CSS keyframe animation `button-press-feedback` (300 ms, fade-out color/scale) - add to styles.css
- [X] T046 [P] [US6] Apply animation to life adjustment buttons on press - modify index.html buttons with @keyframes reference in styles.css
- [X] T047 [US6] Ensure animation completes without leaving button in active/highlighted state - verify CSS animation doesn't include `:active` persistence
- [X] T048 [US6] Test that button state resets to default immediately after animation - add CSS rule to prevent `:active` override
- [X] T049 [P] [US6] Remove any `:active` pseudo-class styling that might persist on touch devices - clean up styles.css
- [X] T050 [US6] Test button feedback: Run quickstart.md Scenario 6 end-to-end (single press, rapid presses, timing)

**Checkpoint**: Button feedback polished and non-intrusive. User Story 6 independently testable and functional.

---

## Phase 9: User Story 7 - Real-Time Team Performance Tracking (Priority: P2)

**Goal**: Track elapsed time for each team (pause/resume on turn advance), display as MM:SS or H:MM:SS, include in game summary.

**Independent Test**:
1. Start game, wait 10 seconds, verify timers show ~10s elapsed for active team
2. Advance turn, verify active team's timer pauses, other team's resumes
3. Play 5+ minute game, manually verify timer accuracy within ±1 second
4. Undo turn, verify timers revert to pre-undo state
5. End game, verify both team times displayed in game summary
6. Page reload during game, verify timers restored correctly

### Implementation for User Story 7

- [X] T051 [P] [US7] Implement Timer State object (elapsedMs, lastStartTime) initialization in initializeTimers() - create in Phase 2 (foundational)
- [X] T052 [US7] Create pauseTimer() and resumeTimer() functions per timer-contract.md - add to app.js
- [X] T053 [US7] Modify advanceTurn() to pause active team's timer and resume other team's timer (FR-015) - update advanceTurn() in app.js
- [X] T054 [US7] Create updateTimerDisplay() function to format elapsedMs as MM:SS or H:MM:SS and update UI (FR-016) - add to app.js, handles format selection based on duration
- [X] T055 [US7] Implement requestAnimationFrame loop to update timer display at 60 Hz for smooth ticking (FR-016) - add game-loop or timer-tick function to app.js
- [X] T056 [P] [US7] Add team timer display elements to game view - add timer display divs to index.html for each team
- [X] T057 [P] [US7] Style team timer display with running/paused indicators - add CSS to styles.css (icon or label showing active vs paused)
- [X] T058 [US7] Modify undoTurn() to restore both timer objects from snapshot (FR-018) - update undoTurn() in app.js to restore timers field
- [X] T059 [US7] Include final team times in Completed Game record (FR-017, FR-019) - modify createCompletedGame() to capture timers.a.elapsedMs and timers.b.elapsedMs
- [X] T060 [P] [US7] Display team elapsed times in between-games view game summaries - modify index.html results display to show team times
- [X] T061 [US7] Handle page reload with stale lastStartTime (correct if > 1 second old) - add timer correction logic on app load
- [X] T062 [US7] Test team timers: Run quickstart.md Scenario 7 end-to-end (accuracy, display format, undo, game summary, persistence)

**Checkpoint**: Team timers fully functional and accurate. User Story 7 independently testable and functional.

---

## Phase 10: User Story 8 - Export Game Results for External Analysis (Priority: P2)

**Goal**: Generate CSV file of completed games with proper formatting and trigger browser download.

**Independent Test**:
1. Create 5+ completed games with varied results
2. Trigger export, verify download dialog appears
3. Open CSV in Excel/Sheets, verify all data and columns present
4. Verify teams, winner, turn, life totals, and times match game records
5. Verify newest games appear first in CSV

### Implementation for User Story 8

- [X] T063 [US8] Implement generateCSV() function to build CSV string from completedGames array per csv-export-contract.md - add to app.js
- [X] T064 [US8] Format CSV with proper header row and all columns: Date, Team A Members, Team B Members, Winner, Final Turn, Team A Final Life, Team B Final Life, Team A Elapsed Time, Team B Elapsed Time - implement in generateCSV()
- [X] T065 [US8] Handle special characters in CSV (escape commas, quotes in team member names) - add CSV escaping logic to generateCSV()
- [X] T066 [US8] Format team member lists as comma-separated and properly quoted - implement in generateCSV()
- [X] T067 [US8] Format elapsed times as MM:SS or H:MM:SS in CSV (convert milliseconds) - add formatElapsedTime() helper if not already created
- [X] T068 [US8] Sort games newest-first in CSV export (match between-games view default) - add sort to generateCSV()
- [X] T069 [P] [US8] Implement downloadCSV() function to create Blob, generate download URL, trigger browser download - add to app.js per csv-export-contract.md
- [X] T070 [P] [US8] Add export button to between-games view UI - add button to index.html with click handler calling downloadCSV()
- [X] T071 [P] [US8] Set appropriate filename for downloaded CSV (magic-circle-games-YYYY-MM-DD.csv) - implement in downloadCSV()
- [X] T072 [P] [US8] Style export button in UI - add CSS to styles.css
- [X] T073 [US8] Test CSV export: Run quickstart.md Scenario 8 end-to-end (export trigger, file format, data integrity, spreadsheet import)

**Checkpoint**: CSV export complete and reliable. User Story 8 independently testable and functional.

---

## Phase 11: User Story 9 - Audit Gameplay Events for Transparency (Priority: P2)

**Goal**: Record all significant game events (turn advances, life adjustments, undo, game end) with timestamps in audit log. Provide viewer during gameplay.

**Independent Test**:
1. Start game, verify 'GameStarted' event recorded
2. Adjust life, advance turn, undo - verify all events recorded with details
3. Open audit log viewer (non-interrupting), verify all events in chronological order
4. End game, verify 'GameEnded' event recorded with final state
5. Verify audit log preserved with completed game

### Implementation for User Story 9

- [X] T074 [P] [US9] Record 'LifeAdjusted' event in adjustLife() function with team, delta, old/new values (FR-023) - update adjustLife() in app.js to call recordAuditEvent()
- [X] T075 [P] [US9] Record 'TurnAdvanced' event in advanceTurn() function with old/new team and turn numbers (FR-023) - update advanceTurn() in app.js to call recordAuditEvent()
- [X] T076 [US9] Record 'GameStarted' event in createActiveGame() function with teams, first player, selection method (FR-023) - update createActiveGame() to call recordAuditEvent()
- [X] T077 [US9] Record 'GameEnded' event when game completed with winner, turn, final life totals, team times (FR-023) - update createCompletedGame() to call recordAuditEvent()
- [X] T078 [US9] Record 'UndoTurn' event in undoTurn() function with reverted turn number and undo history depth (FR-023) - already partially done in Phase 5
- [X] T079 [US9] Create audit log viewer component (modal or sidebar, non-interrupting) - add HTML to index.html
- [X] T080 [US9] Implement event formatting for viewer display (human-readable event descriptions with timestamps) - add formatAuditEvent() function to app.js
- [X] T081 [P] [US9] Add audit log viewer toggle button to game view - add button to index.html to open/close log viewer
- [X] T082 [P] [US9] Style audit log viewer (scrollable list, timestamps, event details) - add CSS to styles.css
- [X] T083 [US9] Ensure audit log viewer is accessible without interrupting active game - implement as modal/sidebar with dismiss
- [X] T084 [P] [US9] Display audit log events in chronological order with proper formatting - implement in audit log viewer template and JavaScript
- [X] T085 [US9] Include audit log with completed game record when game ends (FR-027) - ensure auditLog array included in createCompletedGame() state
- [X] T086 [US9] Prevent sensitive data exposure in audit log (no device IDs, IPs, auth tokens) (FR-028) - review recordAuditEvent() to ensure only game data logged
- [X] T087 [US9] Test audit log: Run quickstart.md Scenario 9 end-to-end (event recording completeness, viewer accessibility, log display)

**Checkpoint**: Audit log complete and transparent. User Story 9 independently testable and functional.

---

## Phase 12: Cross-Cutting Integration & Polish

**Purpose**: Integration testing, UI refinement, documentation, and final validation across all features.

- [X] T088 [P] Cross-feature test: Verify all 9 features work together in single game (team size fair selection + undo + timers + audit log + etc.) - manual integration test using quickstart.md
- [X] T089 [P] Integration test: Run complete game from setup through result summary, verify all enhancements present and functional
- [ ] T090 [P] Responsive design validation: Test all features on iPad (portrait and landscape) using quickstart.md scenarios
- [X] T091 [P] Data persistence validation: Page reload during active game with timers running, undo history present, sound enabled - verify all state restored correctly
- [X] T092 [P] CSV data accuracy: Generate CSV after integration test game, verify all columns match game state
- [X] T093 [P] Audit log completeness: Verify 100% of significant events recorded (count matches actions taken)
- [ ] T094 [P] Performance validation: Verify primary controls update within 100 ms on iPad, timer display smooth at 60 Hz, no lag
- [X] T095 Code cleanup: Remove any console.log statements and debug code from app.js, index.html, styles.css
- [X] T096 [P] Add/update code comments explaining new state extensions and functions in app.js (focus on undo, timers, audit log logic)
- [X] T097 Update README.md with description of new features and how to test them - link to quickstart.md
- [ ] T098 [P] Final validation: Run all quickstart.md scenarios (1-9) end-to-end, verify 100% pass
- [X] T099 Verify backward compatibility: Old games from Feature 001 still display and function correctly in between-games view
- [X] T100 Create feature summary document: List all 9 enhancements with acceptance criteria met

**Checkpoint**: All features complete, integrated, tested, and polished. Ready for release.

---

## Dependencies & Execution Order

### Critical Path (Must Complete Sequentially)

1. **Phase 1** (Setup): Understand existing code → T001-T004
2. **Phase 2** (Foundational): Extend state model → T005-T011 [BLOCKS ALL USER STORIES]
3. **Phase 3** (US1): Fair team-size selection → T012-T016
4. **Phase 4** (US2): Left-side layout → T017-T021
5. **Phase 5** (US3): Undo functionality → T022-T029
6. **Phase 6-11** (US4-US9): All can proceed in parallel once US3 complete (all P2 features are independent)
7. **Phase 12** (Polish): Integration and final validation → T088-T100

### Parallelization Opportunities

**Within Foundational Phase (T005-T011)**:
- T005, T006, T007, T008, T010 can run in parallel (different state model extensions)
- T009 depends on T005, T008 completing

**Within User Story Phases**:
- US1 (T012-T015): T012-T013 can run in parallel before T014
- US2 (T017-T019): All marked [P] can run in parallel
- US3 (T022-T027): T022-T023 in parallel, then T024, then T025-T027 in parallel
- US4 (T030-T036): T030-T031 in parallel, T032 independent, T034-T036 in parallel
- US5 (T038-T042): T038-T039 in parallel, T040 independent, T041-T042 in parallel
- US6 (T045-T049): All marked [P] can run in parallel
- US7 (T056-T057): Marked [P] can run in parallel; rest sequential
- US8 (T069-T072): All marked [P] can run in parallel with core logic
- US9 (T081-T084): Marked [P] can run in parallel with recording logic

**Polish Phase (T088-T100)**:
- All marked [P] can run in parallel
- Sequential tests depend on prior tests completing

### Recommended Team Workflow

**Single Developer**:
- Follow critical path sequentially (Phases 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12)
- Estimated effort: 80-120 hours (accounting for testing and integration)

**Two Developers**:
- Dev 1: Phases 1-2 (Setup, Foundational) → Phases 3-5 (US1-3, all P1 features)
- Dev 2: Starts Phase 6 when Foundational complete, proceeds through US4-9 (P2 features)
- Both converge on Phase 12 for integration and final testing

**Three+ Developers**:
- Dev 1: Phases 1-2, then US1-3 (P1 features)
- Dev 2: US4-6 (P2 core features: audio, sort, button)
- Dev 3: US7-9 (P2 complex features: timers, export, audit log)
- All: Phase 12 integration and validation

---

## MVP Scope & Delivery Strategy

### MVP (Phase 1-5): Core Gameplay Enhancements

**Minimum viable product includes only P1 features**:
- T001-T029: Setup + Foundational + US1 (fair selection) + US2 (layout) + US3 (undo)
- Estimated effort: 30-40 hours
- Delivers: Fair game start, consistent layout, mistake recovery
- Ready for user testing after Phase 5

### Phase 2 Expansion (Phases 6-11): Analytics & Polish

**Add P2 features in priority order**:
- Phase 6: Audio feedback (10 hours)
- Phase 7: Sortable stats (12 hours)
- Phase 8: Button feedback (6 hours)
- Phase 9: Team timers (18 hours) — complex, requires timer precision logic
- Phase 10: CSV export (12 hours)
- Phase 11: Audit log (20 hours) — comprehensive event recording and viewer

**Recommended order for P2**: T030-T037 (audio) → T038-T043 (sorting) → T045-T049 (button) → T051-T061 (timers) → T063-T072 (export) → T074-T086 (audit log)

### Release Milestones

1. **Release 1 (After Phase 5)**: MVP with fair selection, layout, and undo
   - Marketing: "Gameplay enhancements for fairness and safety"
   - User feedback: What's most valuable for next release?

2. **Release 2 (After Phase 7)**: Add audio feedback + sortable statistics
   - Marketing: "Awareness and analytics - hear your turn, analyze your games"
   - Estimate: 2-3 weeks after Release 1

3. **Release 3 (After Phase 11)**: Add timers, export, audit log
   - Marketing: "Complete transparency and analysis suite"
   - Estimate: 4-5 weeks after Release 2

---

## Implementation Notes

### High-Priority Technical Considerations

1. **Timer Accuracy**: Use `performance.now()` for millisecond precision; ±1 second variance acceptable per spec. Test timer math before deployment.

2. **Undo Snapshot Size**: Each snapshot is ~6 integers + 2 references. For typical 50-turn game, memory impact is negligible. No pruning needed for MVP.

3. **Audit Log Completeness**: Verify every significant action (life adjust, turn advance, undo) generates exactly one event. Count events in tests to ensure 100% recording.

4. **CSV Export Escaping**: Handle player names with special characters (quotes, commas). Use standard CSV quoting rules.

5. **Audio Fallback**: If Web Audio API unavailable, fall back to HTML5 `<audio>` element. Test on actual iPad Safari.

6. **State Validation**: Add assertion at critical points (game start, turn advance, undo) to catch state inconsistencies early.

### Testing Strategy

1. **Per-Feature Acceptance Tests**: Run corresponding quickstart.md scenario after implementing each user story
2. **Integration Tests**: After all P1 features (Phase 5), run single game with all features
3. **Persistence Tests**: Force page reload at critical points (during game, undo pending, etc.)
4. **Device Tests**: iPad Safari and desktop Chrome/Firefox
5. **Edge Cases**: Invalid states, storage full, mute switch changes, etc.

### Documentation

- Update [README.md](README.md) with feature descriptions and quickstart link
- Maintain [research.md](research.md) as reference for technical decisions
- Keep [contracts/](contracts/) up-to-date as implementation refines data structures
- Use [quickstart.md](quickstart.md) as primary testing guide

---

## Completion Criteria

✅ All 100 tasks completed with documented evidence

✅ All 9 user stories independently testable and functional

✅ 100% of quickstart.md scenarios pass (9 scenarios, ~70 test steps total)

✅ CSV export contains all required columns with valid data

✅ Audit log records 100% of significant events

✅ Timer accuracy within ±1 second over 5-minute test game

✅ Undo functionality reverts all state correctly (no orphaned state)

✅ Page reload restores all game state correctly

✅ iPad responsive design working in portrait and landscape

✅ No new external dependencies added; browser APIs only

✅ Code reviewed for quality, performance, and security

✅ README updated with feature descriptions

✅ Ready for production deployment to GitHub Pages

---

