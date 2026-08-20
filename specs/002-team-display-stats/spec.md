# Feature Specification: Team Display and Player Statistics

**Feature Branch**: `002-team-display-stats`

**Created**: 2026-08-20

**Status**: Draft

**Input**: User description: "Identify the two teams as Team Blue and Team Green. Color the visual elements for each team to match. In the team selection view, order the players names alphabetically. Do the same any other time team members are listed. In the team selection screen, when a player is picked for a team, grey out and disable that player for selection on the other team. During the game, highlight the active team. For life adjustments, provide buttons to increment/decrement by 1 and by 5. Between games, in addition to the game results, show a table of individual player results-- if they were on a team that won, that's a win for that player and vice versa. Present this as a game count and a win percentage."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identify Teams Visually (Priority: P1)

As a group setting up a game, I want the teams to have stable names, matching colors, and clear member selection states so that everyone can understand team ownership at a glance.

**Why this priority**: Team identity is present throughout setup, live play, and history, so consistency and selection clarity prevent tracking errors at the table.

**Independent Test**: Open team setup, verify the two teams are named Team Blue and Team Green with matching visual treatment, select a player for one team, and verify that the same player is greyed out and disabled for the other team.

**Acceptance Scenarios**:

1. **Given** team setup, **When** the user views the two team selectors, **Then** the teams are named exactly Team Blue and Team Green and each team's visual elements use its corresponding color.
2. **Given** team setup, **When** the user selects a player for Team Blue, **Then** that player is greyed out and disabled in Team Green's selector.
3. **Given** team setup, **When** the user removes a player from Team Blue, **Then** that player becomes available for Team Green again.
4. **Given** any view that lists team members, **When** the list is displayed, **Then** members appear in alphabetical order within each team.

---

### User Story 2 - Make Live Play Controls Clear (Priority: P1)

As a player or spectator, I want the active team and life adjustment sizes to be obvious so that the shared tablet can be operated quickly without mistakes.

**Why this priority**: These controls are used repeatedly during play, and clear active-team feedback plus useful adjustment increments directly reduce table friction.

**Independent Test**: Start a game, verify the active team is visually highlighted, use each team's plus/minus controls for both one-point and five-point adjustments, and verify the selected total changes by the requested amount.

**Acceptance Scenarios**:

1. **Given** an active game, **When** Team Blue is active, **Then** Team Blue has a clear visual highlight and Team Green does not have the active highlight.
2. **Given** an active game, **When** the active team changes, **Then** the highlight moves to the newly active team.
3. **Given** an active game, **When** the user activates a team's +1 or -1 control, **Then** only that team's life total changes by one.
4. **Given** an active game, **When** the user activates a team's +5 or -5 control, **Then** only that team's life total changes by five.
5. **Given** an active game, **When** a life total is below zero or above 40, **Then** all four adjustment sizes remain available and accurate.

---

### User Story 3 - Review Player Performance (Priority: P2)

As a group between games, I want aggregate results for each player so that we can review individual win rates across the recorded games.

**Why this priority**: Player-level summaries extend the existing game history without changing how games are recorded and provide useful session context.

**Independent Test**: Complete games with known team winners, return to between-games, and verify each player has a game count and win percentage derived from the games in which they participated.

**Acceptance Scenarios**:

1. **Given** completed games with recorded teams and winners, **When** the between-games view is displayed, **Then** it includes one player-results row for every player who has appeared in a completed game.
2. **Given** a player whose team won some recorded games and lost others, **When** player results are displayed, **Then** the row shows games played, wins, and win percentage calculated from that player's completed games.
3. **Given** a player whose team won every recorded game, **When** player results are displayed, **Then** the row shows a 100% win percentage.
4. **Given** no completed games, **When** the between-games view is displayed, **Then** the player-results table is empty or shows a clear no-results state rather than fabricated statistics.
5. **Given** a new completed game is recorded, **When** the between-games view returns, **Then** player statistics include that game without changing prior completed-game records.

---

### Edge Cases

- Team names are always exactly Team Blue and Team Green; no alternate names are introduced by setup.
- Team member sorting is case-insensitive alphabetical ordering and is applied consistently in setup, active-game display, completed-game history, and player-statistics calculations or labels.
- A selected player cannot be selected for both teams at the same time; disabling the opposing selector must not remove the player from the selected team.
- Active-team highlighting remains visible when life totals are negative or above 40.
- Life adjustments by five can cross zero or pass above 40 without clamping.
- A player who has not appeared in a completed game is omitted from aggregate results or shown only in a clearly labeled zero-games state; the product must use one consistent choice.
- A completed game cannot contribute twice to a player's totals.
- Win percentages with zero games are not displayed as a misleading percentage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST identify the two teams exactly as Team Blue and Team Green in setup, active play, and completed-game history.
- **FR-002**: The app MUST apply a distinct blue visual treatment to Team Blue elements and a distinct green visual treatment to Team Green elements wherever team identity is shown.
- **FR-003**: The app MUST sort every displayed team-member list alphabetically, ignoring letter case when determining order.
- **FR-004**: The app MUST disable and visually grey out a player in the opposing team selector after that player is selected for one team.
- **FR-005**: The app MUST re-enable a player in the opposing selector when the player is removed from the originally selected team.
- **FR-006**: The app MUST visibly highlight whichever team is currently active during an in-game view.
- **FR-007**: The app MUST provide separate +1, -1, +5, and -5 life controls for each team.
- **FR-008**: Each life control MUST change only its selected team's total by exactly the control's labeled amount and MUST work for totals below zero and above 40.
- **FR-009**: The app MUST display an individual player-results table in the between-games view in addition to completed game results.
- **FR-010**: The player-results table MUST include every player who has participated in at least one completed game and MUST show games played, wins, and win percentage.
- **FR-011**: The app MUST count a player win when the player's recorded team won a completed game and count a player loss when that team did not win.
- **FR-012**: The app MUST calculate each player's win percentage as wins divided by games played, expressed as a percentage with a consistent display precision.
- **FR-013**: The app MUST update player statistics when a completed game is added and MUST preserve the underlying completed-game records.
- **FR-014**: The app MUST show a clear zero-results state for player statistics when no completed games exist and MUST NOT display fabricated percentages.

### Key Entities

- **Team Identity**: The fixed name and color assigned to Team Blue or Team Green.
- **Player Result**: An aggregate record for one player containing games played, wins, losses, and win percentage across completed games.
- **Completed Game**: The existing game result containing two team rosters and the winning team, used as the source for player aggregation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a setup usability check with at least 10 participants, at least 90% correctly identify Team Blue and Team Green and understand that a selected player is unavailable to the other team on their first attempt.
- **SC-002**: Every displayed team-member list is alphabetically ordered in 100% of the setup, active-game, history, and player-results checks.
- **SC-003**: In a live-play check with at least 10 participants, at least 90% correctly use +1, -1, +5, and -5 controls and identify the highlighted active team on their first attempt.
- **SC-004**: For 100% of completed-game fixtures in a validation set, each player's games played, wins, losses, and win percentage match the source game records.
- **SC-005**: Player statistics appear in the between-games view within 100 ms after a completed game is saved on a supported iPad.
- **SC-006**: The team colors and active-team highlight remain distinguishable in both portrait and landscape tablet orientations without obscuring life totals or controls.

## Assumptions

- Team Blue and Team Green replace the prior generic team labels throughout the existing app.
- Blue and green are the canonical visual identity colors; exact accessible shades may be selected during planning as long as the identity remains clear and readable.
- Player statistics are calculated from completed games already stored on the local device; no server-side aggregation or cross-device synchronization is added.
- Players with at least one completed game are included in the table, and players with zero games are omitted to avoid misleading zero-percent rows.
- A win percentage is displayed to one decimal place, with 100.0% for an undefeated player and 0.0% for a player with games but no wins.
- The existing two-team roster validation, random first player, 40 starting life, unbounded totals, round-based turns, local persistence, and GitHub Pages hosting remain unchanged.
- No player ranking, matchmaking, deck statistics, or tournament standings are included.
