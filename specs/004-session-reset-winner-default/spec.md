# Feature Specification: Session Reset and Winner Default

**Feature Branch**: `004-session-reset-winner-default`

**Created**: 2026-08-20

**Status**: Draft

**Input**: User description: "add the ability to start a new session that clears out the game and player history between games. Prompt the user to confirm the action since it will erase all of the data. On the end game screen when picking which team won, have the team with the higher life total selected as the default."

## Clarifications

### Session 2026-08-20

- Q: What must the New session confirmation allow before deleting the current game list and results? → A: It must prompt for confirmation and give the user an opportunity to cancel before deletion.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Start a Fresh Session (Priority: P1)

As a group beginning a new play session, I want to clear all previous game and player history with an explicit confirmation so that the next session starts with no stale results.

**Why this priority**: Session reset is a destructive workflow and must provide a reliable way to begin a clean session without accidental data loss.

**Independent Test**: Create completed game history and player statistics, invoke the new-session action, cancel once to verify data remains, then confirm it and verify active game, completed games, and derived player results are cleared.

**Acceptance Scenarios**:

1. **Given** the between-games view, **When** the user views session actions, **Then** the app provides a clearly labeled action to start a new session.
2. **Given** existing active-game or completed-game data, **When** the user chooses to start a new session, **Then** the app presents a confirmation that clearly states all game and player history will be erased and offers explicit confirm and cancel actions before any deletion occurs.
3. **Given** the reset confirmation, **When** the user cancels it, **Then** the active game, completed-game history, and player statistics remain unchanged.
4. **Given** the reset confirmation, **When** the user confirms it, **Then** the app clears the active game, completed-game history, and derived player statistics and returns to a clean between-games view.
5. **Given** a clean between-games view after reset, **When** the user starts a new game, **Then** setup and gameplay behave as a fresh session with no prior results included.

---

### User Story 2 - Default the Likely Winner (Priority: P1)

As a group ending a game, I want the team with the higher current life total preselected as the winner so that the common result can be confirmed quickly while still allowing correction.

**Why this priority**: Winner selection happens at the end of every game, and a sensible default reduces repeated interaction without preventing users from selecting the other team.

**Independent Test**: End games where Team Blue has more life, Team Green has more life, and both teams have equal life; verify the default selection and that the user can change it before saving.

**Acceptance Scenarios**:

1. **Given** an active game where Team Blue has a higher life total than Team Green, **When** the end-game screen opens, **Then** Team Blue is selected by default.
2. **Given** an active game where Team Green has a higher life total than Team Blue, **When** the end-game screen opens, **Then** Team Green is selected by default.
3. **Given** an active game where both teams have equal life totals, **When** the end-game screen opens, **Then** neither team is selected by default and the user must choose a winner.
4. **Given** a default winner selection, **When** the user selects the other team, **Then** the new selection replaces the default and can be confirmed.
5. **Given** the end-game screen, **When** the user confirms the selected winner, **Then** the completed-game record uses the final user selection rather than the original default.

---

### Edge Cases

- Starting a new session while an active game exists must warn that the unfinished game will also be erased.
- Canceling session reset must not change local storage, active gameplay, completed history, or player statistics.
- Confirming session reset must clear all game-related data without affecting unrelated browser data.
- Reset must work when there is no active game, no completed history, or both.
- Equal life totals must not silently choose a winner.
- A life total may be negative or above 40; the higher numeric value still determines the default.
- Changing the default winner selection must remain possible before confirmation.
- Reset and winner-default behavior must not alter team names, team colors, dark theme, roster sorting, life controls, turn sequencing, or first-player selection.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST provide a clearly labeled new-session action from the between-games experience.
- **FR-002**: The app MUST ask for confirmation before starting a new session when any game or player history exists, and MUST provide an explicit opportunity to cancel before deletion.
- **FR-003**: The reset confirmation MUST state that active game data, completed game history, and player results will be erased and MUST provide distinct confirm and cancel actions.
- **FR-004**: Canceling the reset confirmation MUST leave all game and player data unchanged.
- **FR-005**: Confirming a new session MUST clear the active game, completed-game history, and all derived player statistics and return to the empty between-games state.
- **FR-006**: The app MUST allow a new game to be started normally after a confirmed session reset.
- **FR-007**: When the end-game screen opens and one team's life total is higher, the app MUST select that higher-life team as the default winner.
- **FR-008**: When both teams have equal life totals, the app MUST leave the winner unselected until the user chooses a team.
- **FR-009**: The user MUST be able to replace the default winner selection before confirming the result.
- **FR-010**: The completed-game record MUST use the winner selected at confirmation time.
- **FR-011**: Reset and winner-default behavior MUST preserve existing local-only execution, team identity, dark theme, gameplay state, and persisted data contracts except for the explicitly confirmed reset.

### Key Entities

- **Session Reset Action**: A destructive user action that clears active and completed game data after confirmation.
- **Reset Confirmation**: A user decision state describing the data that will be erased.
- **Winner Selection**: The end-game choice with an optional higher-life default and a user-overridable final value.
- **Completed Game**: The existing saved result created from the final winner selection.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of reset tests with existing data, the app asks for confirmation before erasing any active game, completed game, or player result.
- **SC-002**: In 100% of cancellation tests, all pre-reset active and historical data remains available and unchanged.
- **SC-003**: In 100% of confirmed-reset tests, the between-games view shows zero completed games and no player statistics immediately after reset.
- **SC-004**: In a validation set covering Team Blue higher, Team Green higher, equal, negative, and above-40 totals, the default winner selection matches the specified rule in 100% of cases.
- **SC-005**: At least 95% of observed users can identify which data the reset will erase before confirming it.
- **SC-006**: The user can replace the default winner and save the intended result in 100% of alternate-winner tests.

## Assumptions

- The new-session action is available from the between-games view and is separate from the non-destructive New game action.
- A reset clears only this app's stored state under its existing local-storage key; it does not clear unrelated browser data, and no data is deleted until the user confirms.
- If no game or player history exists, the app may skip the confirmation or show a harmless confirmation, but the resulting state remains empty.
- The higher-life default is based on numeric final life totals, including negative and above-40 values.
- Equal life totals intentionally require an explicit winner choice.
- The existing dark theme, Team Blue/Team Green shading, local persistence, and GitHub Pages deployment remain unchanged.
