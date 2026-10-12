# Feature Specification: First Playing Team Display

**Feature Branch**: `006-first-playing-team-display`

**Created**: 2026-10-12

**Status**: Draft

**Input**: User description: "When showing the first playing team, only specify the team name, not individual players. All players on a single team play simultaneously."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Team-Level First Playing Team Announcement (Priority: P1)

As a playgroup preparing for a match, I want the pre-game announcement stage to show only the starting team's name rather than naming an individual player, so that it is immediately clear that the entire team takes their turn and plays simultaneously.

**Why this priority**: Singling out an individual player creates confusion about internal turn order. Because team members act simultaneously on shared turns, announcing the team as a cohesive unit reinforces correct game rules and expectations.

**Independent Test**: Complete team setup with valid rosters, advance to the pre-game confirmation stage, and verify that the screen prominently announces the starting team (e.g., "Team Blue" or "Team Green") without naming any specific player.

**Acceptance Scenarios**:

1. **Given** valid teams selected during match setup, **When** the user advances to the confirmation stage, **Then** the display announces the starting team by team name only.
2. **Given** the confirmation stage, **When** viewing the starting team announcement, **Then** no individual player name is presented as the starting player.
3. **Given** the confirmation stage, **When** the starting team was determined by team-size fairness (smaller team), **Then** the display indicates that the smaller team plays first for fairness.
4. **Given** the confirmation stage, **When** the starting team was determined by random selection between equal-sized teams, **Then** the display indicates that the starting team was selected randomly.
5. **Given** the confirmation stage, **When** the user chooses to go back, **Then** the setup screen is restored with all player assignments preserved.
6. **Given** the confirmation stage, **When** the user chooses to continue, **Then** the live game begins with the designated team taking the first turn.

---

### User Story 2 - Consistent Team-Level Turn Messaging During Gameplay (Priority: P2)

As players and spectators during an active match, I want in-game labels and turn status indicators to reference the starting team as a whole rather than attributing the start to a single player, so that the interface consistently communicates simultaneous team play throughout the game.

**Why this priority**: Consistency between setup announcements and in-game status prevents confusion during turn transitions and reinforces that both teams operate as units with shared turns.

**Independent Test**: Start a live match from the confirmation stage, inspect the in-game status bar and team cards, and verify that all references to the opening turn specify the first-playing team by team name rather than by individual player name.

**Acceptance Scenarios**:

1. **Given** an active match at Turn 1, **When** the status banner is displayed, **Then** it identifies the starting team by team name (e.g., "Team Blue starts") without citing an individual player.
2. **Given** the active match team cards, **When** the first-playing team is marked, **Then** the indicator designates the team as the first-playing team without assigning the status to any single roster member.
3. **Given** event logs or game summaries generated for the match, **When** opening turn metadata is recorded, **Then** the record notes the starting team rather than a single individual player.

---

### Edge Cases

- **Unequal team sizes (e.g., 2 players vs 4 players)**: The smaller team is designated as the first-playing team based on fairness rules, but only the team name is announced, without highlighting any specific player on that team.
- **Equal team sizes**: The randomly selected team is announced purely by its team name.
- **Roster changes after backing out**: If a user goes back to setup and alters member selections, re-advancing updates the starting team evaluation (if size balance changed) and presents only the resulting team name.
- **Team naming conventions**: If custom or localized team names are used in the future, the display formats cleanly using the team name string alone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The application MUST display only the starting team's name on the pre-game confirmation stage.
- **FR-002**: The application MUST NOT select, designate, or display any individual player's name as the starting player.
- **FR-003**: The confirmation stage MUST explain the rationale for selecting the starting team (team-size fairness for smaller teams or random selection for equal-sized teams).
- **FR-004**: The confirmation stage MUST provide an action to return to team setup with all player and team selections preserved.
- **FR-005**: The confirmation stage MUST provide an action to proceed into active gameplay with the designated team active on Turn 1.
- **FR-006**: During active gameplay, all indicators identifying the opening team MUST refer to that team by team name only.
- **FR-007**: Game event records and match summaries MUST identify the starting team at the team level, reflecting simultaneous team play.

### Key Entities

- **Starting Team Announcement**: A pre-game presentation specifying which team takes the opening turn, the rule rationale applied, and confirmation navigation.
- **Team Turn Assignment**: The designation that an entire team acts simultaneously on their active turn, rather than turns cycling through individual players.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of pre-game confirmation views display exclusively the starting team name without showing any individual player name as the starter.
- **SC-002**: 100% of in-game indicators referencing the starting team use team-level naming rather than individual player attribution.
- **SC-003**: In 100% of test runs navigating back from the starting team stage, all selected roster members remain assigned to their respective teams.
- **SC-004**: In usability reviews, 0% of tested users report confusion regarding which teammate acts first, recognizing that team turns are taken simultaneously.

## Assumptions

- The game format is a team-based format where all players on a given team take their turn simultaneously (sharing a turn and life total).
- Teams continue to be named Team Blue and Team Green by default.
- Selection rules for determining which team starts first (smaller team starts first for fairness; random choice when team sizes are equal) remain unchanged.
- Roster member listings on team cards continue to show all players assigned to that team; only the opening-turn announcement and status indicators omit individual player attribution.
