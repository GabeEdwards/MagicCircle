# Data Model: First Playing Team Display

**Feature Branch**: `006-first-playing-team-display`

## 1. Entities & Schemas

### 1.1 First-Team Staging Object (`FirstTeamStaging`)

Replaces the earlier `FirstPlayerStaging` structure:

```typescript
interface FirstTeamStaging {
  teamId: 'a' | 'b';
  usedFallback: boolean;
  method: 'team-size-fairness' | 'random' | 'fallback-random';
}
```

- **Relationships**:
  - Computed from `setupTeams` when user confirms valid rosters in `#setup-view`.
  - Consumed by `#first-player-view` (first team announcement stage).
  - Used to initialize `activeGame.activeTeamId`, `activeGame.firstPlayerTeamId`, `activeGame.firstPlayerSelectionMethod`, and `activeGame.timers` upon clicking **Continue to game**.
  - Orompts NO player-specific fields.

### 1.2 Active Game Starting Team Metadata

In `ActiveGame`, the starting team is identified purely at the team level:

```typescript
interface ActiveGame {
  // ... existing fields ...
  activeTeamId: 'a' | 'b';
  firstPlayerTeamId: 'a' | 'b';                      // Identifies starting team (Team Blue or Team Green)
  firstPlayerSelectionMethod: 'team-size-fairness' | 'random' | 'fallback-random';
  usedRandomFallback: boolean;
  // ... existing fields ...
}
```

---

## 2. Validation & Invariants

1. **Team-Level Invariant**: `firstPlayerTeamId` MUST always be either `'a'` or `'b'`. No individual player identifier is associated with the opening turn.
2. **Fairness Selection**:
   - If `teamA.members.length !== teamB.members.length`, `firstPlayerTeamId` MUST equal the ID of the team with fewer players, with method `'team-size-fairness'`.
   - If team sizes are equal, `firstPlayerTeamId` MUST be chosen randomly with method `'random'` (or `'fallback-random'`).
3. **Display Consistency**:
   - The stage announcement heading displays `${TEAM_NAMES[firstPlayerTeamId]}` only.
   - The in-game topbar status displays `${TEAM_NAMES[activeTeamId]} is active` and marks the team card with `${TEAM_NAMES[team.id]} · First team`.
