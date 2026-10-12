# Research: First Playing Team Display

**Feature Branch**: `006-first-playing-team-display`

## Decisions and Findings

### 1. Announce Starting Team Exclusively (No Individual Player Attribution)

- **Decision**: Update the first-playing stage announcement heading, markup, and state to only display the starting team name (e.g. `Team Blue` or `Team Green`). Remove picking, storing, and displaying `firstPlayerName`.
- **Rationale**: 
  - Magic Circle is a two-team Magic: The Gathering tracker where all teammates share life and act simultaneously during their team's turn.
  - Announcing an individual player suggests a turn-order hierarchy among teammates, which violates the actual simultaneous-play game model.
  - Displaying solely the team name directly reflects the team-level turn cycle.
- **Alternatives considered**:
  - Showing team name plus list of all team members: Rejected because the team card in gameplay already lists team members, and the stage's primary purpose is clarifying which *team* acts first on Turn 1.
  - Adding a dropdown to pick which player acts first: Violates the user's explicit requirement that all players on a single team play simultaneously.

### 2. Staging and Active Game State Simplification

- **Decision**: Simplify `selectFirstTeam(teams, randomSource)` return signature to `{ teamId: 'a' | 'b', usedFallback: boolean, method: 'team-size-fairness' | 'random' | 'fallback-random' }`. Remove `firstPlayerName` and any player-level starter fields.
- **Rationale**:
  - Simplifies the data model: first player is purely a team concept (`firstPlayerTeamId`).
  - Ensures clean, unambiguous contracts for staging (`#first-player-view`) and live game topbar (`#active-team-label` and `#first-player-method`).
- **Alternatives considered**:
  - Keeping `firstPlayerName` in state but hiding it in UI: Rejected because unused data creates dead code and confusion for downstream consumers or test suites.

### 3. In-Game and Setup View Terminology Consistency

- **Decision**: Update `#first-player-view` heading from "First player picked" to "First team picked" (or "Starting team"). Update announcement text to `${TEAM_NAMES[stagedFirstPlayer.teamId]}`. Keep rationale badge ("Fair start: smaller team plays first" / "Random selection: equal team sizes").
- **Rationale**:
  - Consistent terminology eliminates any lingering reference to a single starting player.
- **Alternatives considered**:
  - Leaving heading as "First player": Rejected because players play simultaneously as a team, so "First team" or "Starting team" is accurate.
