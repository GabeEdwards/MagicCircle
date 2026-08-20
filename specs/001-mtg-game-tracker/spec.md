# Feature Specification: MTG Game Tracker

**Feature Branch**: `001-mtg-game-tracker`

**Created**: 2026-08-20

**Status**: Draft

**Input**: User description: "a simple one page web app designed to be run on an iPad. it will be used during games of Magic the Gathering. It will display the two teams, their life point totals, the current turn number, and which teams' turn it currently is. The app has two modes: between games, where the results of recent games are displayed (team compositions, winner, turn number of win, and final life totals at the end) and a \"new game\" option is available. The other mode is \"in game\" where the game status is shown, and controls are available to increment/decrement the life totals of both teams, as well as controls to end the current game and declare a winner. When starting a new game, the first step is to identify the team members. Each team will have multiple (2-4) members drawn from a pool of players: Gabe, Phil, Tung, Siu, Anthony, Chris, or Kate. This app should be hosted on GitHub Pages. Once the teams are chosen, one of them should be chosen at random to be the first player. That team will start the game. The starting life total is 40, and it may go into negative numbers or above 40 during the game."

## Clarifications

### Session 2026-08-20

- Q: If the browser cannot provide a secure random choice for the first player, should the app block game start or use a fallback? → A: Use a weaker browser fallback and show a warning.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure and Start a Game (Priority: P1)

As a group preparing to play, I want to assign two teams from the available players so that the tracker reflects who is playing before the game begins.

**Why this priority**: A game cannot be tracked meaningfully until its teams are identified, and this is the entry point to the primary in-game experience.

**Independent Test**: Select 2-4 distinct members for each team from the provided player pool, confirm the setup, and verify that the in-game view shows both team compositions and starting life totals.

**Acceptance Scenarios**:

1. **Given** the between-games view, **When** the user chooses to start a new game, **Then** the app presents team setup using only the seven available players.
2. **Given** team setup, **When** the user selects fewer than 2 or more than 4 members for either team, **Then** the app prevents continuation and explains the valid team size.
3. **Given** team setup, **When** a player is selected for both teams, **Then** the app prevents continuation and identifies the duplicate assignment.
4. **Given** valid teams with 2-4 distinct members each, **When** the user confirms setup, **Then** the app starts a new game with both teams shown and each team's life total at the configured starting value of 40.
5. **Given** valid teams, **When** the user confirms setup, **Then** the app randomly selects one team as the first player, starts at turn 1, and clearly identifies that team as active.
6. **Given** secure browser randomness is unavailable, **When** the user confirms valid team setup, **Then** the app uses its documented browser fallback, clearly warns that the selection may be less fair, and still identifies the selected first team.

---

### User Story 2 - Track the Current Game (Priority: P1)

As a player or spectator, I want to see the current game state and adjust either team's life total so that the table can use one shared iPad as the scorekeeper.

**Why this priority**: Accurate, glanceable state tracking is the core value of the app during play.

**Independent Test**: Start a valid game, use the life controls for both teams, advance through both teams' Turn 1 and into Turn 2, and verify that the displayed team names, life totals, turn number, and active team remain accurate.

**Acceptance Scenarios**:

1. **Given** an active game, **When** the user views the game screen, **Then** the app displays both team compositions, both life totals, the current turn number, and which team is active.
2. **Given** an active game, **When** the user increments or decrements a team's life total, **Then** only that team's displayed total changes by one and the updated value is immediately visible.
3. **Given** an active game with the randomly selected first team active on Turn 1, **When** the user advances the turn, **Then** the other team becomes active while the displayed turn remains 1; when the first team becomes active again, **Then** the displayed turn advances to 2.
4. **Given** an active game, **When** the user reaches a life total of zero or below, **Then** the app continues displaying the value accurately and keeps all game controls available until the user ends the game.
5. **Given** an active game, **When** the user views the turn state, **Then** the displayed active team matches the randomly selected first player on Turn 1, both teams receive a Turn 1, and the counter advances only at the beginning of the first team's next turn.
6. **Given** an active game, **When** the user increments a team's life total above 40 or decrements it below zero, **Then** the app displays the resulting value accurately and keeps both life controls usable.

---

### User Story 3 - End a Game and Review Results (Priority: P2)

As a group between games, I want to declare the winner and review recent results so that we can remember how each game ended and quickly start the next one.

**Why this priority**: A reliable between-games record completes the play session and provides useful context for the next game.

**Independent Test**: End an active game by declaring each possible winner, then verify that the result includes both teams, the winner, the winning turn number, and final life totals and is visible from the between-games view.

**Acceptance Scenarios**:

1. **Given** an active game, **When** the user chooses to end the game, **Then** the app asks which team won and requires a winner selection before recording the result.
2. **Given** a selected winner, **When** the user confirms the end of the game, **Then** the app records both team compositions, the winning team, the turn number, and both final life totals.
3. **Given** one or more completed games, **When** the user opens the between-games view, **Then** the app displays recent results with the recorded teams, winner, winning turn, and final life totals.
4. **Given** completed games are displayed, **When** the user starts another new game, **Then** the existing results remain available for review while the new game begins with fresh state.

---

### Edge Cases

- The app prevents a team from being confirmed with fewer than 2 or more than 4 members.
- The app prevents a player from appearing on both teams in the same game.
- The app prevents a game from being recorded without an explicitly selected winner.
- The app makes the randomly selected first team visible before any turn advancement.
- If secure browser randomness is unavailable, the app uses a documented weaker browser fallback and visibly warns the user before or with the first-player selection.
- Repeated new-game starts do not always select the same team as first player; each team has an equal opportunity to be selected.
- Life totals may become negative and remain visible without being clamped to zero.
- Life totals may exceed 40 and remain visible without being capped at the starting value.
- Turn numbers begin at 1, remain 1 while each team takes its first turn, and cannot decrease below 1.
- The turn sequence is first team Turn 1, second team Turn 1, first team Turn 2, second team Turn 2, continuing in that pattern.
- Starting a new game while another game is active requires confirmation before discarding the unfinished game.
- If the page is reloaded during an active game, the app restores the current game when local device storage is available; otherwise it starts in the between-games view without inventing a result.
- If local device storage is unavailable or full, the current game remains usable and the user receives a clear indication that history may not persist.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST provide a single-page experience with a between-games mode and an in-game mode.
- **FR-002**: The app MUST provide exactly two teams for each game and identify each team by its selected members.
- **FR-003**: The app MUST offer the player pool Gabe, Phil, Tung, Siu, Anthony, Chris, and Kate when configuring teams.
- **FR-004**: The app MUST require each team to contain at least 2 and at most 4 members before a game can start.
- **FR-005**: The app MUST prevent the same player from being assigned to both teams in one game.
- **FR-006**: The app MUST initialize each team's life total to 40 when a valid new game begins.
- **FR-006a**: The app MUST randomly select exactly one of the two configured teams as the first player when a valid new game begins, with equal probability for either team.
- **FR-006b**: If secure browser randomness is unavailable, the app MUST use a documented browser fallback to select exactly one first-player team and MUST visibly warn the user that the fallback may provide weaker fairness.
- **FR-007**: The app MUST display both team compositions, both current life totals, the current turn number, and the active team's identity during an active game.
- **FR-008**: The app MUST provide separate increment and decrement controls for each team's life total, changing the selected total by exactly one per activation.
- **FR-008a**: The app MUST allow life totals to increase above 40 and decrease below zero without imposing an upper or lower bound.
- **FR-009**: The app MUST provide a turn control that alternates the active team on every activation and increases the shared turn number by one only when the randomly selected first team becomes active again after the other team has taken the same turn number.
- **FR-010**: The app MUST allow the user to end an active game by selecting and confirming one of the two teams as the winner.
- **FR-011**: The app MUST record the completed game's team compositions, winner, winning turn number, and final life totals for both teams.
- **FR-012**: The app MUST display recent completed game results in the between-games mode, with the newest result presented first.
- **FR-013**: The app MUST preserve completed game history on the local device across normal page reloads when local storage is available.
- **FR-014**: The app MUST warn the user before abandoning an active game to start another new game.
- **FR-015**: All primary controls MUST be usable through touch on an iPad without requiring a keyboard or mouse.
- **FR-016**: The app MUST remain usable on tablet-sized screens in portrait and landscape orientation without overlapping controls or hidden game data.
- **FR-017**: The app MUST be deployable as a static site on GitHub Pages, with no required server-side execution or account system.
- **FR-018**: The app MUST use only the provided player pool and MUST NOT require network access for game tracking after the page has loaded.

### Key Entities

- **Player**: A selectable participant identified by one of the seven fixed names.
- **Team**: A group of 2-4 distinct players assigned to one of the two sides in a game.
- **Active Game**: The in-progress state containing two teams, life totals, turn number, active team, and the randomly selected first player.
- **Completed Game**: A saved record containing both teams, the winner, the shared turn number at which the winner was declared, and final life totals.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A group can configure two valid teams and reach the in-game view in under 60 seconds without consulting instructions.
- **SC-002**: In a usability check with at least 10 game participants, at least 90% can correctly adjust either team's life total and identify the active team on their first attempt.
- **SC-002a**: Across at least 100 newly started games in a repeatable test, each configured team is selected as first player within the expected range for an equal random choice, and the selected team is visible at turn 1.
- **SC-003**: Every completed game shown in history contains both team compositions, a winner, a winning turn number, and final life totals for both teams.
- **SC-004**: The in-game view remains usable in both portrait and landscape orientation on an iPad, with no primary control or required game value obscured.
- **SC-005**: After a normal page reload on a device with available local storage, the app restores the active game or displays all previously completed results without data loss.
- **SC-006**: The hosted app can be opened from a GitHub Pages URL and a user can begin tracking a game without signing in or creating an account.
- **SC-007**: At least 90% of observed users rate the game setup, life adjustment, and result review flows as easy to understand on a five-point usability survey.

## Assumptions

- The app is used by one group sharing one iPad; real-time synchronization across devices is out of scope.
- The default starting life total is 40 for each team, reflecting the current game rules selected for this feature.
- The first player is selected randomly after team setup. Turns alternate between the two teams, with both teams taking Turn 1 before the first team begins Turn 2.
- A result is considered complete only when a user explicitly declares and confirms a winner; life totals alone do not automatically end a game.
- Recent history is stored on the local device and may be cleared by the device owner or browser settings.
- No authentication, player accounts, deck lists, match scoring, or tournament pairing workflow is included in this feature.
- GitHub Pages provides static hosting; the application does not depend on a server or remote database.
