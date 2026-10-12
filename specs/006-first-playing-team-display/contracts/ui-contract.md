# UI Contract: First Playing Team Display

**Feature Branch**: `006-first-playing-team-display`

## 1. Pre-Game Confirmation Stage

### 1.1 Element Identification & Content
- **View Container**: `<section id="first-player-view" class="view" aria-labelledby="first-player-heading" hidden>`
- **Heading**: `#first-player-heading` -> text content: `Starting team picked` (or `First team picked`)
- **Team Announcement**: `#first-player-announcement`
  - Content format: `${TEAM_NAMES[teamId]}` (e.g. `Team Blue` or `Team Green`)
  - MUST NOT include any player name or parenthesis with player names.
- **Selection Reason**: `#first-player-reason`
  - If smaller team fairness: `Fair start: smaller team plays first`
  - If equal team random: `Random selection: equal team sizes`
- **Actions**:
  - `#back-to-setup-button`: returns to `#setup-view` without modifying selected players.
  - `#start-game-from-stage-button`: starts active match at Turn 1 with the designated starting team active.

## 2. In-Game Indicators

- **Turn Status Banner**: `#active-team-label`
  - Format: `${TEAM_NAMES[activeTeamId]} is active${activeTeamId === firstPlayerTeamId ? ' · first team' : ''}`
- **Team Card Label**:
  - First-playing team indicator: `First team` (replacing any `First player` label text).
- **Audit Log Event**:
  - `GameStarted` details format:
    ```json
    {
      "teamA": { "members": [...] },
      "teamB": { "members": [...] },
      "firstPlayerTeamId": "a",
      "firstPlayerSelectionMethod": "team-size-fairness"
    }
    ```
    Refers purely to `firstPlayerTeamId`, with no individual player singled out.
