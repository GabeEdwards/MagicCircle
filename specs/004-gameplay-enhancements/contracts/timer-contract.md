# Contract: Team Timer Specification

**Feature**: [spec.md](../spec.md) | **Version**: 1.0 | **Date**: 2026-08-30

This contract defines the behavior, precision, and interface for chess-clock style team timers that track elapsed time per team during gameplay.

---

## Overview

Team timers are separate, independent time-tracking objects for each team in a game. Each timer accumulates elapsed milliseconds while its team is active (i.e., during that team's turn). Timers pause when the turn advances to the other team and resume when that team's turn ends.

---

## Timer State Object

### Structure

```javascript
{
  elapsedMs: <non-negative integer>,      // Cumulative milliseconds while active
  lastStartTime: <number or null>         // performance.now() timestamp when resumed, null when paused
}
```

### Fields

#### `elapsedMs`
- **Type**: Non-negative integer (≥ 0)
- **Semantics**: Total milliseconds accumulated while this timer was active
- **Initial value**: `0` at game start
- **Updates**: Increments only when timer transitions from running to paused
- **Range**: Practical upper bound ≈ 600,000 ms (10 hours for a very long casual game)

#### `lastStartTime`
- **Type**: Positive number (epoch milliseconds) or `null`
- **Semantics**: 
  - When running: `performance.now()` timestamp when the timer was last resumed
  - When paused: `null`
- **Initial value**: `null` at game start
- **Updates**: Set when timer starts; cleared when timer pauses

---

## Timer Lifecycle

### Initialization (Game Start)

```javascript
// Feature 001: Create active game with random first player
const firstPlayer = chooseFirstTeam();

// Feature 004: Initialize timers
activeGame.timers = {
  a: { elapsedMs: 0, lastStartTime: null },
  b: { elapsedMs: 0, lastStartTime: null }
};

// Immediately resume timer for active team
const now = performance.now();
activeGame.timers[firstPlayer.teamId].lastStartTime = now;
```

### Turn Advance

```javascript
function advanceTurnWithTimers(game) {
  const now = performance.now();
  
  // Pause current active team's timer
  const activeTimer = game.timers[game.activeTeamId];
  if (activeTimer.lastStartTime !== null) {
    activeTimer.elapsedMs += (now - activeTimer.lastStartTime);
    activeTimer.lastStartTime = null;
  }
  
  // Determine next active team
  const nextTeam = game.activeTeamId === 'a' ? 'b' : 'a';
  
  // Resume next team's timer
  game.timers[nextTeam].lastStartTime = now;
  
  // Update game state
  game.activeTeamId = nextTeam;
  if (nextTeam === game.firstPlayerTeamId) {
    game.turnNumber += 1;
  }
  
  return game;
}
```

### Undo Turn

When undo is performed, restore both timer objects from the undo history snapshot:

```javascript
function undoTurn(game) {
  if (game.undoHistory.length === 0) return game;
  
  const snapshot = game.undoHistory.pop();
  
  // Restore game state including timers
  game.turnNumber = snapshot.turnNumber;
  game.activeTeamId = snapshot.activeTeamId;
  game.lifeTotals = { ...snapshot.lifeTotals };
  game.timers = JSON.parse(JSON.stringify(snapshot.timers));  // Deep copy
  
  // Record undo event
  game.auditLog.push({
    eventType: 'UndoTurn',
    timestamp: Date.now(),
    details: {
      revertedTurnNumber: snapshot.turnNumber,
      restoredActiveTeamId: snapshot.activeTeamId,
      undoHistoryDepth: game.undoHistory.length
    }
  });
  
  return game;
}
```

### Game End

When a game is completed, capture the final timer state in the Completed Game record:

```javascript
function createCompletedGame(game, winnerTeamId) {
  return {
    // ... other fields ...
    teamTimers: {
      a: game.timers.a.elapsedMs,
      b: game.timers.b.elapsedMs
    },
    // ... audit log, teams, winner, etc. ...
  };
}
```

---

## Precision and Accuracy

### Timing Mechanism

- **Source**: `performance.now()` (high-resolution timestamp in milliseconds)
- **Precision**: Microseconds (though displayed in milliseconds)
- **Accuracy**: Within ±1 second variance acceptable per feature assumptions
- **Resolution**: Sub-millisecond on most platforms; millisecond precision in this implementation

### Acceptable Variance

- Measured vs. displayed time: ±1 second over a 5-minute game is acceptable (spec SC-008)
- Causes of variance:
  - JavaScript event loop delays (page blocked by other tasks)
  - Rounding in display formatting
  - Clock drift (rare on consumer devices)
- Not acceptable: Mismatched timers (e.g., one team has significantly more time recorded than actual gameplay)

### Display Precision

- UI updates via `requestAnimationFrame` (60 Hz / ~16 ms per frame)
- Display format: `MM:SS` or `H:MM:SS` (see Display Format section below)
- Trailing milliseconds truncated (not displayed; accuracy still tracked internally)

---

## Display Format

### Format Rules

**For durations < 1 hour** (elapsedMs < 3,600,000):
- Format: `MM:SS` (zero-padded minutes and seconds)
- Examples: `00:45`, `03:45`, `59:59`

**For durations ≥ 1 hour** (elapsedMs ≥ 3,600,000):
- Format: `H:MM:SS` (non-zero-padded hours, zero-padded minutes and seconds)
- Examples: `1:00:00`, `1:23:45`, `2:05:00`, `10:30:15`

### Conversion Algorithm

```javascript
function formatElapsedTime(elapsedMs) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  } else {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}
```

### Display Examples

| elapsedMs | Formatted |
|-----------|-----------|
| 0 | `00:00` |
| 30000 | `00:30` |
| 120000 | `02:00` |
| 225000 | `03:45` |
| 599000 | `09:59` |
| 3600000 | `1:00:00` |
| 5145000 | `1:25:45` |
| 36000000 | `10:00:00` |

---

## UI Rendering

### Display Elements

During an active game, the UI must display both team timers:

```
┌─────────────────────────────────────┐
│         Team Blue (Left)             │     │       Team Green (Right)     │
│  Members: Gabe, Phil                 │     │  Members: Tung, Siu          │
│  Life: 42                            │     │  Life: 38                    │
│  Elapsed: 3:45 ▶ (running)          │     │  Elapsed: 2:30 (paused)      │
│                                      │     │                              │
└─────────────────────────────────────┘     └────────────────────────────┘
```

### Timer Update Rate

- Update display via `requestAnimationFrame()` callback (60 Hz)
- Recalculate displayed time on each frame:
  ```javascript
  if (timer.lastStartTime !== null) {
    displayedElapsedMs = timer.elapsedMs + (performance.now() - timer.lastStartTime);
  } else {
    displayedElapsedMs = timer.elapsedMs;
  }
  ```
- This ensures smooth, tick-like display updates without blocking the main thread

### Visual Indicators

- **Running timer**: Display with visual indicator (icon, color, or label "▶" or "Active")
- **Paused timer**: Display with visual indicator (icon, color, or label "⏸" or "Paused")
- Update these indicators simultaneously with turn advances

---

## Undo and Redo Behavior

### Snapshot Storage

Before each turn advance, create a snapshot of both timers:

```javascript
const snapshot = {
  turnNumber: game.turnNumber,
  activeTeamId: game.activeTeamId,
  lifeTotals: { ...game.lifeTotals },
  timers: JSON.parse(JSON.stringify(game.timers))  // Deep copy
};
game.undoHistory.push(snapshot);
```

### Restoration on Undo

Restore both timer objects exactly as they were at that snapshot:

```javascript
const snapshot = game.undoHistory.pop();
game.timers = JSON.parse(JSON.stringify(snapshot.timers));
```

### No Timer Reset on Undo

- Do NOT reset timers to zero
- Do NOT adjust timers based on elapsed time since undo
- Restore exact state from snapshot (both `elapsedMs` and `lastStartTime`)

### Example Undo Scenario

```
Turn 1A: Team A active, Timer A: 0:00 → 1:30 (running), Timer B: 0:00 (paused)
Turn 2B: Turn advanced. Timer A: 1:30 (paused), Timer B: 0:00 → 0:45 (running)
Undo:    Both timers restored to snapshot at Turn 1A
         Timer A: 1:30 (paused), Timer B: 0:00 (paused)
Turn 2B: Turn advanced again. Timer A: 1:30 (paused), Timer B: 0:00 → 0:45 (running)
```

The timers follow the exact same pattern because the snapshot is restored faithfully.

---

## Storage and Persistence

### In-Memory Storage

Timers are stored directly in the Active Game state:
```javascript
activeGame.timers = {
  a: { elapsedMs: 225000, lastStartTime: null },
  b: { elapsedMs: 150000, lastStartTime: 1693398235000 }
}
```

### Serialization to localStorage

Both timer and `lastStartTime` are JSON-serializable (number and null):
```javascript
localStorage.setItem('magic-circle-state-v1', JSON.stringify({
  activeGame: { ..., timers: {...}, ... },
  completedGames: [...],
  schemaVersion: 1
}));
```

### Deserialization from localStorage

Restore timers as-is from JSON. No conversion needed.

### Page Reload Behavior

- If page reloads during active game and localStorage recovery succeeds:
  - Active game is restored with timers at exact state before reload
  - If the restored timer is running, it continues running from its `lastStartTime`
  - NOTE: `lastStartTime` is an absolute timestamp, so if page was reloaded several minutes ago, the timer will "catch up" and add that delay to `elapsedMs`
  
  **To avoid this bug**: When deserializing a restored active game, check if `lastStartTime` is far in the past and correct it:
  ```javascript
  const now = performance.now();
  const timers = activeGame.timers;
  Object.values(timers).forEach(timer => {
    if (timer.lastStartTime !== null) {
      // If lastStartTime is more than 1 second in the past, it's stale from a reload
      if (now - timer.lastStartTime > 1000) {
        timer.elapsedMs += (now - timer.lastStartTime);
        timer.lastStartTime = now;
      }
    }
  });
  ```

### Completed Games

Final timer values are stored as simple millisecond integers in Completed Game records:
```javascript
completedGame.teamTimers = {
  a: 225000,
  b: 150000
}
```

These are immutable snapshots and do not contain `lastStartTime`.

---

## Testing and Validation

### Accuracy Tests

1. **Start game, wait 10 seconds, verify elapsed time ≈ 10000 ms**
2. **Start game, wait 5s, advance turn, wait 5s, verify both timers show ≈ 5000 ms each**
3. **Start game, advance turn 10 times, verify total time = sum of all individual turn times**
4. **Undo once, verify timers revert to pre-undo values**
5. **Undo multiple times, verify timers step back correctly**

### Display Tests

1. **Verify display format for times < 1 hour**: `MM:SS` format
2. **Verify display format for times ≥ 1 hour**: `H:MM:SS` format
3. **Verify smooth ticking** (no jumps or delays in display updates)
4. **Verify active vs. paused indicators** update with turn advances

### Persistence Tests

1. **Page reload during game**: Timer values and running state restored
2. **Page reload after game**: Completed game shows correct final times
3. **localStorage full**: Warning displayed but timers continue functioning
4. **localStorage unavailable**: Warning displayed, timers function during game (but not persisted)

---

## Edge Cases and Error Handling

### Performance Degradation

If the browser is under heavy load and `performance.now()` updates are delayed:
- Timers will still accumulate correctly (elapsedMs is updated on pause)
- Display may temporarily freeze but will catch up when the event loop unblocks
- No error condition; graceful degradation expected

### Negative Time (Should Never Occur)

If a bug causes `lastStartTime > performance.now()`:
- Clamp `elapsedMs` to prevent negative values
- Log a warning
- Continue; timers remain functional

### Very Long Games (≥ 10 Hours)

If a game runs for more than 10 hours:
- Format still works (`H:MM:SS` handles arbitrary hours)
- No overflow; JavaScript numbers support up to ~9 × 10^15 milliseconds
- Acceptable for this use case (casual games rarely exceed a few hours)

### Clock Adjustments

If system time is adjusted (e.g., NTP sync, DST change, manual clock adjustment):
- `performance.now()` is relative and immune to system clock adjustments
- No impact on timer accuracy
- Wall-clock display of game start time (in audit log) may be affected, but relative timers remain correct

