# Quickstart & Validation Guide: First Playing Team Display

**Feature Branch**: `006-first-playing-team-display`

## Validation Scenarios

### Scenario 1: Pre-Game Announcement Displays Team Name Exclusively
1. Open the application.
2. Click **New game**.
3. Select 2 players on Team Blue (e.g. Alice and Bob) and 3 players on Team Green (e.g. Charlie, Dana, Eli).
4. Click **Start game**:
   - *Expected*: The application transitions to the pre-game confirmation stage (`#first-player-view`).
   - *Expected*: The large announcement text reads **Team Blue** (not "Alice (Team Blue)").
   - *Expected*: No individual player name is presented as the starting player.
   - *Expected*: The explanation badge states: "Fair start: smaller team plays first".
5. Click **Go back**:
   - *Expected*: Returns to setup view with Alice, Bob, Charlie, Dana, and Eli still selected.
6. Click **Start game** again, then click **Continue to game**:
   - *Expected*: Enters active gameplay with Team Blue designated as the starting team.
   - *Expected*: The status banner shows "Team Blue is active · first team" (or similar team-level indicator).
   - *Expected*: The Team Blue card indicates "First team" without naming an individual starting player.

### Scenario 2: Equal Team Sizes Random Announcement
1. Start a new game and configure equal team rosters (e.g. 2 players each).
2. Click **Start game**:
   - *Expected*: The announcement text displays either **Team Blue** or **Team Green** by team name only.
   - *Expected*: The explanation badge states: "Random selection: equal team sizes".
   - *Expected*: No individual player name is displayed anywhere on the announcement card.

## Automated Validation Checklist

- [ ] Unit tests for `selectFirstTeam(teams)` confirming it returns team information (`teamId`, `method`, `usedFallback`) without selecting a `firstPlayerName`.
- [ ] DOM tests / assertions verifying `#first-player-announcement` text does not contain player names.
- [ ] In-game rendering tests verifying that starting team status refers to team level only.
