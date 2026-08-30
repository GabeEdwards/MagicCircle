# Feature Specification: MTG Gameplay Enhancements

**Feature Branch**: `004-gameplay-enhancements`

**Created**: 2026-08-30

**Status**: Draft

**Input**: User requirements: Make additions/modifications including team size ordering for game start, first-player team placement, turn undo capability, audio feedback, sortable statistics, button feedback improvements, team timers with chess-clock style tracking, CSV export for game results, and event audit logging during gameplay.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fair Game Start with Team Size Awareness (Priority: P1)

As a group setting up a game with unequal team sizes, I want the app to automatically start the smaller team first so that gameplay remains balanced and fair.

**Why this priority**: Unequal team sizes can create a structural advantage; automatic correction eliminates manual negotiation and ensures consistent fairness.

**Independent Test**: Configure one team with 2 members and another with 4 members, start the game, and verify that the 2-member team is selected as first player.

**Acceptance Scenarios**:

1. **Given** two teams with different member counts during game setup, **When** a valid new game begins, **Then** the team with fewer members is automatically selected as the first player instead of random selection.
2. **Given** two teams with equal member counts, **When** a valid new game begins, **Then** the app falls back to random selection of the first player with equal probability for either team.
3. **Given** game setup with teams of different sizes, **When** the first player is selected, **Then** the app visibly indicates that team-size fairness was applied (if applicable).

---

### User Story 2 - Intuitive Visual Layout for Gameplay (Priority: P1)

As a player or spectator, I want the first-player team always positioned on the left side of the screen so that the game state is consistent and easy to understand at a glance.

**Why this priority**: Consistent visual positioning reduces cognitive load during fast-paced gameplay and makes the active team immediately recognizable.

**Independent Test**: Start a valid game and verify that the team selected as first player is displayed on the left side of the game view, then advance the turn and confirm the layout remains consistent.

**Acceptance Scenarios**:

1. **Given** a new game with a selected first player, **When** the in-game view is displayed, **Then** the first-player team is always positioned on the left side of the screen.
2. **Given** an active game with consistent left-side positioning, **When** the turn is advanced to alternate the active team, **Then** the left-side team remains the same (the first-player team).
3. **Given** portrait and landscape orientations on an iPad, **When** the game view is displayed, **Then** the left-side team positioning is preserved in both orientations.

---

### User Story 3 - Recover from Accidental Turn Advance (Priority: P1)

As a player managing game state, I want to undo an accidental "next turn" button press so that I can correct mistakes without losing game progress or restarting.

**Why this priority**: Turn advancement is frequent and error-prone; offering undo reduces frustration and keeps gameplay smooth.

**Independent Test**: Start a valid game, advance the turn 3 times, then undo once and verify the turn count and active team revert to the previous state.

**Acceptance Scenarios**:

1. **Given** an active game after at least one turn advance, **When** the undo control is activated, **Then** the turn count, active team, and any associated game state revert to the previous state.
2. **Given** an active game at Turn 1 with no turn advances yet, **When** the undo control is activated, **Then** the app either disables the undo control or displays a message indicating there is nothing to undo.
3. **Given** an active game with multiple turn advances, **When** undo is used multiple times, **Then** each undo reverts one turn and the user can step back through the entire turn history to the game start.
4. **Given** a game in which undo has been used, **When** a new turn advance is made, **Then** the redo history (if any) is cleared and the new turn becomes the current state.

---

### User Story 4 - Auditory Feedback for Turn Advancement (Priority: P2)

As a player or spectator, I want the app to play a sound when a turn is advanced so that I can stay aware of turn changes even when not actively looking at the screen.

**Why this priority**: Audio feedback provides an additional signal channel, reducing missed turns and improving awareness during active play.

**Independent Test**: Start a valid game and advance the turn twice, listening for auditory feedback both times; configure sound to be off and verify no sound plays.

**Acceptance Scenarios**:

1. **Given** an active game with auditory feedback enabled, **When** a turn is advanced (next turn button is pressed), **Then** the app plays a brief, distinctive sound.
2. **Given** an active game with sound enabled, **When** the undo control is activated to revert a turn, **Then** the app plays an optional confirmation sound or silence per the app's design.
3. **Given** the app's settings, **When** a user toggles sound on or off, **Then** subsequent turn advances either play sound or remain silent according to the user's preference.
4. **Given** the app running on an iPad, **When** the device is muted (physical mute switch), **Then** the app respects the device mute state and does not play sound.

---

### User Story 5 - Analyze Game Results with Flexible Sorting (Priority: P2)

As a group reviewing past games, I want to sort player statistics by name, team, win count, or other relevant metrics so that I can find patterns and compare performance across games.

**Why this priority**: Sortable statistics enable quick analysis and friendly competition dynamics between sessions.

**Independent Test**: Display at least 5 completed games with mixed results, then sort by player name, win count, and participation frequency, verifying the order changes correctly.

**Acceptance Scenarios**:

1. **Given** the between-games view displaying completed game results, **When** the user selects a sort option (e.g., by player name, team name, or outcome), **Then** the displayed results are reordered according to the selected criterion.
2. **Given** a sortable results view, **When** the user applies an ascending sort, **Then** the results are displayed in ascending order (A–Z, 1–10, earliest–latest).
3. **Given** a sortable results view, **When** the user applies a descending sort, **Then** the results are displayed in descending order (Z–A, 10–1, latest–earliest).
4. **Given** player statistics aggregated from multiple games, **When** the user sorts by a metric such as win count or participation, **Then** players with the highest or lowest metric appear first according to the sort direction.
5. **Given** sort controls in the results view, **When** the page is reloaded or revisited, **Then** the sort preference is either restored (if stored locally) or reset to a default sort order.

---

### User Story 6 - Refined Visual Feedback for Life Point Adjustments (Priority: P2)

As a player or spectator, I want the life point adjustment buttons to provide immediate, clear feedback without leaving a persistent "pressed" highlight so that the interface remains clean and uncluttered during rapid adjustments.

**Why this priority**: Button state feedback is important for confirmation, but persistent highlighting can obscure the interface and reduce visual clarity during fast gameplay.

**Independent Test**: Press a life point increment button several times in succession and verify that each press produces visible feedback (such as a brief highlight or animation) that fades quickly and does not leave the button in a permanently highlighted state.

**Acceptance Scenarios**:

1. **Given** a life point adjustment button during active gameplay, **When** the button is pressed, **Then** it displays a brief visual feedback (such as a highlight, color change, or animation).
2. **Given** an active game with visual button feedback, **When** the feedback animation completes, **Then** the button returns to its default (non-highlighted) state without requiring user interaction.
3. **Given** rapid successive presses on a life point button, **When** each press is registered, **Then** each press produces its own brief feedback animation and the button does not remain in a "held" or permanently highlighted state.
4. **Given** button feedback animations, **When** a life total changes as a result of a button press, **Then** the life total updates immediately and the feedback animation does not delay the visual confirmation of the new value.

---

### User Story 7 - Real-Time Team Performance Tracking (Priority: P2)

As a player or spectator, I want the app to track and display the elapsed time each team has spent during their turns (in a chess-clock style) so that I can see how much time is being used and this information is included in the final game summary.

**Why this priority**: Time tracking adds strategic depth, enables time-management awareness, and provides useful post-game analysis.

**Independent Test**: Start a valid game, wait at least 10 seconds, advance the turn, wait another 10 seconds, advance the turn again, then end the game and verify that both teams' elapsed times are displayed in the game summary.

**Acceptance Scenarios**:

1. **Given** a newly started game, **When** the in-game view is displayed, **Then** the app initializes a separate timer for each team and begins accumulating elapsed time for the currently active team.
2. **Given** an active game with running timers, **When** a turn is advanced (changing the active team), **Then** the timer for the previously active team pauses and the timer for the new active team resumes.
3. **Given** running team timers during an active game, **When** the game view is displayed, **Then** each team's elapsed time is visibly shown (e.g., "Team A: 2:45", "Team B: 1:30").
4. **Given** timers that have been running and paused during an active game, **When** the game is ended and the result is recorded, **Then** both teams' final elapsed times are included in the completed game record.
5. **Given** a completed game with recorded team times, **When** the result is displayed in the between-games view, **Then** each team's total elapsed time is shown as part of the game summary.
6. **Given** an active game with running timers, **When** the undo control is used to revert a turn, **Then** the timers are also reverted to match the previous game state (both accumulated times and active timer selection).

---

### User Story 8 - Export Game Results for External Analysis (Priority: P2)

As a group interested in record-keeping and analysis, I want to export completed game results to a CSV file so that I can analyze the data in spreadsheets, generate reports, or back up the game history.

**Why this priority**: CSV export enables flexibility in data analysis and provides a backup mechanism for game records.

**Independent Test**: Display the between-games view with at least 5 completed games, activate the export function, save the resulting CSV file, and verify that the CSV contains all game data including teams, winner, turn number, life totals, and team times.

**Acceptance Scenarios**:

1. **Given** the between-games view displaying completed game results, **When** the export control is activated, **Then** the app generates a CSV file containing all recorded game data.
2. **Given** a CSV export of game results, **When** the file is opened in a spreadsheet application, **Then** the data is properly formatted with recognizable columns (e.g., Date, Team A, Team B, Winner, Final Turn, Team A Elapsed Time, Team B Elapsed Time, Final Life Totals).
3. **Given** an export function, **When** a user initiates the export, **Then** the browser's standard download behavior is triggered and the file is saved to the device's default download location.
4. **Given** multiple exports of the same game history, **When** each export is generated, **Then** the CSV file contains consistent data and can be opened and analyzed without errors.
5. **Given** a CSV export file, **When** it is imported into a spreadsheet or analysis tool, **Then** all game records are accurately represented without data loss or formatting corruption.

---

### User Story 9 - Audit Gameplay Events for Transparency (Priority: P2)

As a player or observer, I want the app to maintain an audit log of all significant game events (e.g., turn advances, life total changes, undo actions) so that I can review the sequence of actions and resolve disputes about game state.

**Why this priority**: An audit log provides transparency, enables dispute resolution, and supports post-game analysis.

**Independent Test**: Start a valid game, adjust both teams' life totals, advance the turn multiple times including at least one undo action, then access the audit log and verify that all actions are recorded with timestamps and details.

**Acceptance Scenarios**:

1. **Given** an active game, **When** any significant action occurs (turn advance, life adjustment, undo, game end), **Then** the app records the event in an audit log with a timestamp and event details.
2. **Given** an active game with a populated audit log, **When** the user accesses the audit log viewer (within the app during gameplay), **Then** the log displays all recorded events in chronological order.
3. **Given** a displayed audit log, **When** the user reviews an entry, **Then** the entry clearly identifies the action (e.g., "Team A life +1", "Turn advanced", "Undo last turn") and the time it occurred.
4. **Given** an audit log during an active game, **When** the user scrolls or navigates through the log, **Then** the log remains accessible without interrupting the game or requiring navigation away from the main game view.
5. **Given** a completed game, **When** the game is ended and the result is saved, **Then** the audit log for that game is preserved with the game record and can be reviewed from the game summary if desired.

---

### Edge Cases

- If team sizes are equal, the app uses random selection (not team-size logic) to choose the first player.
- Undo is available only after at least one turn advance; at the game start, undo is disabled or shows an appropriate message.
- Multiple rapid undo activations correctly step backward through the entire turn history without skipping or jumping states.
- When undo is used, any redo history is discarded; new turn advances after an undo create a new timeline.
- Sound feedback respects the device's physical mute switch and user-level sound settings.
- Team timers accumulate only while the team is active; pausing occurs immediately when a turn is advanced.
- Timer data persists in the game record even if the page is reloaded during active gameplay (if session recovery is enabled).
- Exporting to CSV includes all games in the current view and exports with no data loss.
- The audit log records all significant state-changing actions and includes sufficient detail for accurate reconstruction of gameplay.
- The audit log does not expose sensitive data (e.g., device identifiers, IP addresses) and contains only game-related events.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: When two teams have different member counts at game start, the app MUST select the team with fewer members as the first player (overriding random selection).
- **FR-002**: When two teams have equal member counts at game start, the app MUST use random selection for the first player (reverting to the original behavior from Feature 001).
- **FR-003**: The app MUST display the first-player team on the left side of the in-game view in both portrait and landscape orientations.
- **FR-004**: The app MUST provide an undo control that reverts the most recent turn advance, including the turn counter, active team, and any state changes from that turn.
- **FR-005**: Undo MUST be disabled (or show an appropriate message) when there are no turns to revert (e.g., at game start).
- **FR-006**: When undo is invoked, any subsequent redo history MUST be discarded; the new turn advance after an undo creates a new game timeline.
- **FR-007**: The app MUST play a brief, distinctive sound when a turn is advanced, if sound is enabled by the user and not muted by the device.
- **FR-008**: The app MUST respect the device's physical mute state (e.g., iPad mute switch) when determining whether to play turn-advance audio.
- **FR-009**: The app MUST provide a user setting to enable or disable auditory feedback for turn advancement.
- **FR-010**: Life point adjustment buttons MUST display brief visual feedback (e.g., highlight, animation, or color change) when pressed.
- **FR-011**: After button feedback animation completes, the life point button MUST return to its default (non-highlighted) state without requiring user interaction.
- **FR-012**: Multiple rapid presses on a life point button MUST each produce distinct feedback animations; the button MUST NOT remain in a permanently highlighted state.
- **FR-013**: The app MUST initialize separate timers for each team when a new game starts.
- **FR-014**: Team timers MUST accumulate elapsed time only while the team is active (i.e., during their turn).
- **FR-015**: When a turn is advanced, the active team's timer MUST pause and the other team's timer MUST resume.
- **FR-016**: During an active game, each team's elapsed time MUST be visibly displayed (e.g., "Team A: 2:45").
- **FR-017**: When a game is ended and recorded, both teams' final elapsed times MUST be included in the completed game record.
- **FR-018**: When undo is used to revert a turn, both team timers MUST be reverted to the state they were in before that turn (including accumulated time and active timer selection).
- **FR-019**: The app MUST display each team's final elapsed time in the between-games view as part of the completed game summary.
- **FR-020**: The app MUST provide an export control in the between-games view that generates a CSV file of completed game results.
- **FR-021**: Exported CSV files MUST include all recorded game data: teams, winner, turn number, final life totals, game date, and team elapsed times for each game.
- **FR-022**: When export is invoked, the browser's standard download mechanism MUST be triggered, and the file MUST be saved to the device's default download location.
- **FR-023**: The app MUST record all significant game events (turn advances, life adjustments, undo actions, game end) in an audit log with timestamps.
- **FR-024**: The audit log MUST include sufficient detail for each event (e.g., team identifier, action type, before-and-after values if applicable).
- **FR-025**: During an active game, the app MUST provide an audit log viewer that displays all recorded events in chronological order and is accessible without interrupting gameplay.
- **FR-026**: The audit log viewer MUST clearly identify each recorded action and its timestamp.
- **FR-027**: When a game is completed and saved, the associated audit log MUST be preserved with the game record.
- **FR-028**: The audit log MUST NOT expose sensitive data (e.g., device identifiers, network information); it contains only game-related events and data.

### Key Entities

- **Team**: A group of 2-4 distinct players with a recorded member count used for first-player selection logic.
- **Turn**: A game turn with a turn counter, active team, and associated timestamp.
- **Team Timer**: A cumulative elapsed-time tracker for each team that pauses and resumes with turn changes.
- **Audit Log Event**: A record of a significant game action with a timestamp, event type, and relevant details.
- **Game Summary**: A completed game record that includes teams, winner, turn number, final life totals, team elapsed times, and associated audit log.
- **CSV Export**: A comma-separated values file containing structured game results for external analysis.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a test with 20 games where team sizes differ, 100% of games select the smaller team as first player.
- **SC-002**: In a test with 20 games where team sizes are equal, the first-player selection falls back to random choice with each team selected in the expected range for equal probability (8–12 times per 20 games).
- **SC-003**: When the in-game view is displayed, the first-player team is positioned on the left side in 100% of tested games across both portrait and landscape orientations.
- **SC-004**: A user can activate undo and revert a turn within 2 seconds of the undo button press.
- **SC-005**: In a test with 50 turn advances, the turn-advance sound plays at least 95% of the time when enabled and device is not muted.
- **SC-006**: When a life point button is pressed, the visual feedback animation completes and the button returns to default state within 300 milliseconds.
- **SC-007**: Rapid presses on a life point button (10 presses within 2 seconds) each produce distinct feedback; no button remains highlighted after animations complete.
- **SC-008**: Team timers accumulate accurate elapsed time within a ±1 second variance over a 5-minute test game.
- **SC-009**: When a game ends, both teams' elapsed times in the game record match the displayed values during gameplay (within ±1 second).
- **SC-010**: A user can export game results to CSV and open the file in a standard spreadsheet application without formatting errors.
- **SC-011**: An exported CSV file includes all game records with complete data (teams, winner, turn, life totals, times) for 100% of the exported games.
- **SC-012**: An audit log records 100% of significant game events (turn advances, life adjustments, undo actions) with timestamps.
- **SC-013**: A user can access and review the audit log during active gameplay without leaving the game view or losing game state.

## Assumptions

- Team size comparison uses the total count of members assigned to each team at game start and is not re-evaluated during gameplay.
- When team sizes are equal, random selection for the first player is used, maintaining backward compatibility with Feature 001.
- Audio feedback for turn advancement is played by the browser's Web Audio API or HTML5 audio element with a simple, pre-built sound (no external dependencies).
- The device's physical mute state is accessed via standard browser APIs (Permissions API or device volume API) and is not universally supported; fallback behavior permits sound playback if the API is unavailable.
- Timer precision is based on JavaScript's `Date` object or `performance.now()`; accuracy within ±1 second is acceptable for a casual game tracker.
- CSV exports include all completed games in the local storage history; future filtering or date-range selection is out of scope for this feature.
- Audit logs are stored in-memory or in local storage alongside game records; clearing browser storage also clears audit logs.
- The audit log is preserved only during the lifetime of the current game; after game completion and archival, future access to the log is via the game record if implemented.
- All enhancements align with the project constitution: no new external dependencies, client-side only, cross-platform touch support, and simplified UI without 3rd-party images.

