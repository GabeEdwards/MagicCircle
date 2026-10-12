# Feature Specification: Match Controls and Game Results Editing

**Feature Branch**: `005-match-controls-and-results`

**Created**: 2026-10-12

**Status**: Draft

**Input**: User description: "add these features: **\n- Add a “Maximize” button to make this browser page maximized on screen.\n- Between games, add ability to edit game results, including fields Winner, Life totals, Time totals\n- After selecting teams, add a stage showing the picked first player. Have buttons here to go back or continue to start the game.\n- Add -3/+3 point life adjustment buttons during the game.\n**"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Player Confirmation Stage (Priority: P1)

As a playgroup that just selected teams, I want a dedicated stage that displays the designated first player before entering the live game, with options to either go back to team setup or continue to start the match, so that everyone has clear notice of who takes the first turn and an opportunity to adjust team rosters if needed.

**Why this priority**: Choosing who goes first directly impacts game setup and opening strategy. Providing an explicit confirmation checkpoint prevents accidental match starts and ensures fair, transparent communication before turn 1 begins.

**Independent Test**: Complete team selection with valid rosters, proceed to the first-player stage, verify the picked first player and their team are shown, navigate back to verify team choices remain intact, and then proceed forward to start the live game.

**Acceptance Scenarios**:

1. **Given** valid team selections on the setup screen, **When** the user advances from team selection, **Then** the application displays a first-player stage indicating which team and player were chosen to start first.
2. **Given** the first-player stage, **When** the user selects the action to go back, **Then** the application returns to the team selection screen with all previously selected players and teams preserved.
3. **Given** the first-player stage, **When** the user selects the action to continue, **Then** the application transitions directly into active gameplay with turn 1 initialized for the designated first-player team.
4. **Given** teams with unequal sizes where team-size fairness determines the first player, **When** viewing the first-player stage, **Then** the application visibly explains that the smaller team was awarded the first turn for fairness.
5. **Given** teams with equal sizes where random selection determines the first player, **When** viewing the first-player stage, **Then** the application visibly displays the randomly selected first player.

---

### User Story 2 - Edit Completed Game Results (Priority: P1)

As a scorekeeper or player reviewing past games between rounds, I want the ability to edit historical game results—specifically the winner, final life totals, and elapsed time totals—so that scorekeeping mistakes, missed life calculations, or incorrect timers can be retroactively corrected to keep records accurate.

**Why this priority**: Completed game records populate player statistics (win rates, game counts) and exportable reports. Allowing post-game corrections ensures that minor human errors during gameplay do not permanently skew historical statistics.

**Independent Test**: From the between-games history view, select an existing completed game, edit its winner, life totals, and team elapsed times, save the changes, and verify that the updated values are reflected in both the game history card and the recalculated player results table.

**Acceptance Scenarios**:

1. **Given** at least one completed game in the history view between games, **When** the user initiates an edit on a completed game record, **Then** the application presents an edit interface populated with the game's current winner, each team's final life total, and each team's elapsed time total.
2. **Given** the game result edit interface, **When** the user changes the winning team and saves, **Then** the completed game record is updated, the history card displays the new winner, and player win/loss counts and win rates recalculate immediately.
3. **Given** the game result edit interface, **When** the user modifies the final life totals for either or both teams and saves, **Then** the updated life totals are saved and displayed on the game record.
4. **Given** the game result edit interface, **When** the user modifies the elapsed time totals for either or both teams and saves, **Then** the updated times are saved and displayed in formatted time on the game record.
5. **Given** the game result edit interface with unsaved changes, **When** the user cancels the edit, **Then** no modifications are applied, and the original game results and player statistics remain untouched.
6. **Given** invalid input in the edit interface (such as a non-numeric life total or negative/malformed time total), **When** the user attempts to save, **Then** the application prevents saving and provides a clear validation message indicating what needs correction.

---

### User Story 3 - Rapid ±3 Point Life Adjustments (Priority: P2)

As a player in an active match, I want quick adjustment controls for -3 and +3 life points alongside existing life controls, so that frequent 3-point game events (such as Lightning Bolt, fetch-and-shock land combinations, and standard lifegain triggers) can be tracked with a single action.

**Why this priority**: 3-point increments and decrements are among the most common life-total changes in Magic: The Gathering. Adding dedicated ±3 buttons reduces the number of taps needed during play and decreases scorekeeping delays.

**Independent Test**: During active gameplay, tap the +3 button for Team Blue and verify life increases by 3; tap the -3 button for Team Green and verify life decreases by 3; verify both adjustments are logged in the event audit record and provide immediate button feedback.

**Acceptance Scenarios**:

1. **Given** an active game, **When** a user activates the +3 life control for a team, **Then** that team's life total increases by exactly 3 points immediately.
2. **Given** an active game, **When** a user activates the -3 life control for a team, **Then** that team's life total decreases by exactly 3 points immediately.
3. **Given** active gameplay with event logging enabled, **When** a ±3 life adjustment is applied, **Then** an event entry is recorded noting the team, the ±3 delta, the previous life total, and the new life total.
4. **Given** an active game, **When** a ±3 life button is tapped, **Then** the button provides the standard transient visual feedback indicating activation without remaining permanently highlighted.
5. **Given** a turn with life adjustments made via the ±3 controls, **When** the undo action is invoked for a subsequent turn advance, **Then** previous turn states and life values behave consistently with established turn history rules.

---

### User Story 4 - Maximize Screen View (Priority: P3)

As a player or tablet host displaying the application to the table, I want a Maximize button that expands the display to fill the entire screen, so that distracting browser bars and extraneous interface elements are hidden and the game is clearly readable to all participants.

**Why this priority**: Tablet and tabletop play benefits from maximum visual real estate and minimal distractions, allowing larger touch targets and clearer readability across the table.

**Independent Test**: Activate the Maximize button on a supported screen, verify the application enters full-screen display mode, confirm the button or control updates to reflect the option to restore/exit, and activate the exit action to return to standard display.

**Acceptance Scenarios**:

1. **Given** the application running in standard display mode, **When** the user activates the Maximize control, **Then** the application requests the host display to maximize and fill the entire available screen.
2. **Given** the application in maximized display mode, **When** viewing the maximize control, **Then** the control indicates that the screen is currently maximized and offers an action to exit or restore standard display.
3. **Given** the application in maximized display mode, **When** the user activates the restore/exit control, **Then** the application returns to standard display mode.
4. **Given** the application in maximized display mode, **When** the user exits maximization via system controls or keyboard input (e.g., Escape key or swipe gesture), **Then** the application updates the maximize control back to its unmaximized state.
5. **Given** a device or browser environment that does not permit programmatic screen maximization, **When** the application is loaded, **Then** the maximize control is either gracefully hidden or disabled with a helpful tooltip, without interrupting other app features.

---

### Edge Cases

- **Navigating back from first-player stage**: When the user returns to the setup screen, team rosters are preserved exactly as configured. If the user alters team members such that the team size balance changes (e.g., from unequal to equal), advancing again must re-evaluate the first player according to the fairness and random selection rules.
- **Editing game results when only one game exists**: Editing the sole completed game updates all statistics cleanly and preserves the single game in history.
- **Editing game results with multiple completed games**: Editing an older game in the history correctly updates that specific game's historical card without altering the order, metadata, or results of any other completed games.
- **Editing life totals to extreme values**: Life totals in Magic: The Gathering can become negative or exceed 100. The edit interface must accept negative numbers, zero, and high positive integers, validating that the input is a valid integer.
- **Editing time totals to zero or large durations**: Elapsed times must be valid non-negative durations (hours, minutes, seconds). Setting an elapsed time to zero or adjusting minutes and seconds must validate properly and format cleanly in both the history display and CSV exports.
- **Reversal of winner during game result editing**: If Team Blue was originally recorded as the winner and the edit switches the winner to Team Green, Team Blue's win count decreases by 1 and loss count increases by 1, while Team Green's win count increases by 1 and loss count decreases by 1 in the recalculated player results table.
- **Multiple rapid taps on ±3 life buttons**: Rapid successive taps on the -3 or +3 buttons correctly accumulate changes sequentially (e.g., two taps on -3 decreases life by 6), each triggering transient button feedback and individual audit events.
- **Exiting maximize mode via external system gestures**: If the host environment exits maximized display via hardware buttons, system gestures, or browser shortcuts, the application's internal state immediately synchronizes so the button label correctly reverts to "Maximize".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: After valid teams are selected on the setup screen, the application MUST present an intermediate first-player stage before entering active gameplay.
- **FR-002**: The first-player stage MUST clearly display the designated first player and their corresponding team name.
- **FR-003**: The first-player stage MUST display an indicator explaining how the first player was determined (fairness selection due to unequal team sizes or random selection).
- **FR-004**: The first-player stage MUST provide a "Go back" action that returns to the team setup screen with all previously selected players and team assignments preserved.
- **FR-005**: The first-player stage MUST provide a "Continue" action that starts the game, transitioning into active gameplay at Turn 1 with the designated team active.
- **FR-006**: The between-games history view MUST provide an edit action for each completed game record.
- **FR-007**: Initiating an edit on a completed game MUST open an editing interface displaying the game's winner, each team's final life total, and each team's elapsed time total.
- **FR-008**: The game result edit interface MUST allow the user to modify the winner selection between the two participating teams.
- **FR-009**: The game result edit interface MUST allow the user to modify each team's final life total to any valid integer value.
- **FR-010**: The game result edit interface MUST allow the user to modify each team's elapsed time total to any valid non-negative time value.
- **FR-011**: The game result edit interface MUST provide explicit "Save" and "Cancel" actions. Canceling MUST discard all pending changes, while saving MUST update the completed game record and immediately recalculate session player results and export data.
- **FR-012**: During active gameplay, each team's life control area MUST provide dedicated "+3" and "-3" life adjustment buttons.
- **FR-013**: Activating the "+3" button MUST increase the specified team's life total by 3 points, trigger transient visual feedback on the button, and record a life-adjusted event in the audit log.
- **FR-014**: Activating the "-3" button MUST decrease the specified team's life total by 3 points, trigger transient visual feedback on the button, and record a life-adjusted event in the audit log.
- **FR-015**: The life adjustment buttons for each team MUST be ordered logically according to their numeric delta values (e.g., -5, -3, -1, +1, +3, +5).
- **FR-016**: The application MUST provide a globally accessible "Maximize" control in the application header or navigation bar.
- **FR-017**: Activating the "Maximize" control in standard view MUST request the display to expand into maximized full-screen view.
- **FR-018**: When in maximized view, the control MUST indicate that the view is maximized and offer the ability to restore standard view.
- **FR-019**: If screen maximization is unsupported or denied by the client environment, the application MUST handle the state gracefully without throwing errors or blocking normal gameplay.
- **FR-020**: All new capabilities MUST operate entirely within the client without requiring external servers or network connections, consistent with project governance and data contracts.

### Key Entities

- **First-Player Confirmation Stage**: A transitional view between team setup and active game play displaying the chosen starter, the selection rationale, and navigation controls to proceed or step back.
- **Game Result Edit Record**: An editable representation of a completed match containing the winner team identifier, numeric life totals for both teams, and elapsed time values for both teams.
- **Life Adjustment Control**: A distinct interactive control representing a specific point delta (+3 or -3) applied to a team's current life total during a live game.
- **Screen Display Mode**: The current display presentation state of the application (standard windowed view versus maximized full-screen view).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of new game setup flows navigate through the first-player confirmation stage before entering active gameplay.
- **SC-002**: In 100% of tests where the user steps back from the first-player stage to team setup, all previously chosen team members remain selected without loss.
- **SC-003**: In 100% of completed game edit tests, saved modifications to winner, life totals, and elapsed time are immediately reflected in the history view and all derived player statistics (wins, losses, win percentage) update with zero arithmetic discrepancy.
- **SC-004**: In 100% of cancellation tests during game result editing, the existing completed game data and player results remain exactly identical to their pre-edit state.
- **SC-005**: Activating the -3 and +3 life buttons adjusts the team's life total by exactly -3 and +3 points respectively in 100% of recorded interactions, with a corresponding entry logged in the event audit record.
- **SC-006**: On platforms supporting full-screen display, activating the Maximize button expands the application to occupy 100% of the display area, and restoring it returns the viewport to its original dimensions in 100% of trials.
- **SC-007**: 95% of first-time users can locate the Maximize control, understand the first-player announcement, and perform life adjustments using the new controls without requiring additional instructions.

## Assumptions

- The Maximize action leverages standard client-side full-screen presentation mechanisms available in modern web and tablet browsers. When a browser environment restricts full-screen mode, the button is disabled or hidden gracefully without impacting any gameplay functionality.
- First-player selection continues to follow established team-size fairness rules (smaller team starts first if team sizes differ; equal-probability random selection if team sizes are equal).
- The life adjustment controls will present -5, -3, -1, +1, +3, and +5 in consistent ascending order across both team panels.
- Editing a completed game's results updates the stored game in place, recalculates the player results aggregation table, and reflects in subsequent CSV exports, but does not overwrite the raw audit log of that game since the audit log represents immutable in-game history.
- The first-player stage is only reached after valid rosters (2 to 4 distinct players per team) have been chosen and confirmed.
- The application remains completely client-side with no remote server dependencies, adhering to the MagicCircle Constitution.
