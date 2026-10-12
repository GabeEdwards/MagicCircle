# Data Model: Match Controls and Game Results Editing

**Feature Branch**: `005-match-controls-and-results`

## 1. Entity Definitions & Schema Extensions

### 1.1 First-Player Staging State

The application state is extended with a transitional staging object when moving from team setup to active play:

```typescript
interface FirstPlayerStaging {
  firstPlayer: {
    teamId: 'a' | 'b';
    playerId: string;
  };
  selectionMethod: 'team-size-fairness' | 'random';
  setupTeams: Array<{
    id: 'a' | 'b';
    members: string[];
  }>;
}
```

- **Relationships**:
  - Derived from validated `setupTeams`.
  - When the user chooses **Continue**, `FirstPlayerStaging` is used to instantiate `ActiveGame`.
  - When the user chooses **Go back**, `FirstPlayerStaging.setupTeams` is retained in the setup view, and staging is cleared.

### 1.2 Completed Game (Edited Result Schema)

The existing `CompletedGame` schema is maintained, with explicit support for post-game edits:

```typescript
interface CompletedGame {
  id?: string;                        // Optional identifier or array index in state.completedGames
  completedAt: string;                // ISO 8601 timestamp string
  teams: Array<{
    id: 'a' | 'b';
    members: string[];                // Sorted array of player names
  }>;
  winnerTeamId: 'a' | 'b';            // Team that won the game (editable between games)
  winningTurnNumber: number;          // Turn number when game ended
  finalLifeTotals: {                  // Final life points for each team (editable between games)
    a: number;                        // Integer (can be negative, 0, or positive)
    b: number;                        // Integer (can be negative, 0, or positive)
  };
  teamTimers: {                       // Elapsed time in milliseconds per team (editable between games)
    a: number;                        // Non-negative integer (milliseconds)
    b: number;                        // Non-negative integer (milliseconds)
  };
  auditLog: AuditEvent[];             // Preserved immutable live-game log
}
```

### 1.3 Edit Game Result Form State

A transient UI state used while editing a completed game:

```typescript
interface GameResultEditState {
  gameIndex: number;                  // Index of the game being edited in state.completedGames
  winnerTeamId: 'a' | 'b';
  finalLifeTotals: {
    a: number;
    b: number;
  };
  teamTimers: {
    a: number;                        // Milliseconds
    b: number;                        // Milliseconds
  };
  errors?: {
    winner?: string;
    lifeA?: string;
    lifeB?: string;
    timerA?: string;
    timerB?: string;
  };
}
```

### 1.4 Screen Display Mode State

Transient UI state tracking whether the application is currently maximized:

```typescript
interface DisplayState {
  isMaximized: boolean;               // True if document.fullscreenElement is active
  isSupported: boolean;               // True if Fullscreen API is available in browser
}
```

---

## 2. Validation Rules

1. **First-Player Staging**:
   - Both teams must have between 2 and 4 players.
   - No player can be on both teams simultaneously.
   - If one team has fewer players than the other, `firstPlayer.teamId` must match the smaller team, and `selectionMethod` must be `'team-size-fairness'`.
   - If team sizes are equal, `firstPlayer.teamId` must be chosen randomly, and `selectionMethod` must be `'random'`.

2. **Game Result Editing**:
   - `winnerTeamId` must be either `'a'` or `'b'`.
   - `finalLifeTotals.a` and `finalLifeTotals.b` must be valid 32-bit signed integers (cannot be `NaN`, infinite, or empty).
   - `teamTimers.a` and `teamTimers.b` must be valid non-negative numbers representing milliseconds (parsing from formatted `MM:SS` or `HH:MM:SS` strings).
   - Editing and saving a game immediately triggers recalculation of `playerResults(state.completedGames)` and updates `state.completedGames` in `localStorage`.

3. **Life Controls**:
   - Valid delta values are `[-5, -3, -1, 1, 3, 5]`.
   - Applying a delta `+3` or `-3` increases or decreases the target team's life total by exactly 3, and appends an `AUDIT_EVENTS.LIFE_ADJUSTED` entry to `activeGame.auditLog`.

---

## 3. State Transitions

```text
[Between Games]
   |
   +--> [Click "New game"] --> [Team Setup (mode: 'setup')]
                                  |
                                  +--> [Click "Cancel"] --> [Between Games]
                                  |
                                  +--> [Click "Start game" / Teams Valid] 
                                          |
                                          v
                                    [First-Player Stage (mode: 'first-player')]
                                          |
                                          +--> [Click "Go back"] --> [Team Setup] (rosters kept)
                                          |
                                          +--> [Click "Continue"] --> [In Game (mode: 'game')]

[Between Games]
   |
   +--> [Click "Edit" on Game Card] --> [Edit Game Modal/View (mode: 'edit-game' or modal)]
                                          |
                                          +--> [Click "Cancel"] --> [Between Games] (no changes)
                                          |
                                          +--> [Click "Save"] --> [Between Games] (updated results & player stats)

[Any View]
   |
   +--> [Click "Maximize"] ----> [Fullscreen Enabled] (Button shows "Restore" / "Exit Fullscreen")
   |                                  |
   +--> [Click "Exit" / Esc] <--+------+
```
