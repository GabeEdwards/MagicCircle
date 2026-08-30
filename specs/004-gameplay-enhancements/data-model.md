# Data Model: MTG Gameplay Enhancements

**Feature**: [spec.md](spec.md) | **Date**: 2026-08-30

This document extends the data model from Feature 001 (MTG Game Tracker) to include new entities and fields required for the gameplay enhancements.

---

## Active Game Extensions

The Active Game entity from Feature 001 is extended with new fields to support undo, timers, and audit logging.

| Field | Type | Rules | New in Feature 004 |
| --- | --- | --- | --- |
| `teams` | two Team records | Exactly two teams; valid membership rules apply | No |
| `lifeTotals` | mapping by team id to integer | Starts at 40; may increase or decrease without bounds | No |
| `turnNumber` | positive integer | Starts at 1; shared by both teams' current turns | No |
| `activeTeamId` | team identifier | Exactly one configured team is active | No |
| `firstPlayerTeamId` | team identifier | Exactly one configured team; selected with equal probability OR by team size (if unequal) | Modified |
| `status` | fixed text | `active` while the game is in progress | No |
| `undoHistory` | ordered list of snapshots | Array of complete game state snapshots, most recent first (or at top of stack). Empty array at game start. Each snapshot contains: `{ turnNumber, activeTeamId, lifeTotals, timers, timestamp }`. | **NEW** |
| `timers` | mapping by team id to timer state | Timer object for each team with `{ elapsedMs, lastStartTime }`. `elapsedMs` is cumulative milliseconds. `lastStartTime` is null when timer is paused, otherwise timestamp of resumption. | **NEW** |
| `auditLog` | ordered list of event objects | Chronological log of all significant gameplay events. Each entry: `{ eventType, timestamp, details }`. See Audit Log Event section below. | **NEW** |
| `usedRandomFallback` | boolean | True if secure randomness was unavailable when selecting first player. | No |
| `firstPlayerSelectionMethod` | enum text | One of: `random` (teams equal size), `team-size-fairness` (unequal sizes), or `fallback-random` (if randomness API unavailable). Indicates how first player was selected. | **NEW** |

### Active Game Transitions (Unchanged)

Existing transitions from Feature 001 remain valid. New undo/redo behavior:
- On undo: Pop entry from `undoHistory`, restore all affected fields (turnNumber, activeTeamId, lifeTotals, timers)
- On turn advance after undo: Discard any redo history (undoHistory remains as-is; no branch re-recording)

### Team Size Logic (Feature 004 - Fair First Player Selection)

When creating an Active Game:
1. Count members in each team
2. If Team A members < Team B members → select Team A as first player, set `firstPlayerSelectionMethod = 'team-size-fairness'`
3. If Team B members < Team A members → select Team B as first player, set `firstPlayerSelectionMethod = 'team-size-fairness'`
4. If members equal → use random selection (existing logic), set `firstPlayerSelectionMethod = 'random'`

---

## Timer State

A new entity representing the elapsed time for one team.

| Field | Type | Rules |
| --- | --- | --- |
| `elapsedMs` | non-negative integer | Cumulative milliseconds elapsed while this timer was active. Starts at 0. |
| `lastStartTime` | timestamp (number) or null | When the timer is running, the epoch milliseconds of the last resume. When paused, null. Used to calculate additional elapsed time on pause. |

### Timer Transitions

- **Initialize** (at game start): `{ elapsedMs: 0, lastStartTime: null }` for both teams
- **Start/Resume** (when team becomes active): Set `lastStartTime = performance.now()`
- **Pause** (when team loses active status): `elapsedMs += performance.now() - lastStartTime; lastStartTime = null`
- **Undo**: Restore entire timer object from undo history snapshot
- **Display** (in-game view): Format `elapsedMs` as `MM:SS` or `H:MM:SS`

---

## Audit Log Event

A new entity representing one recorded gameplay event.

| Field | Type | Rules |
| --- | --- | --- |
| `eventType` | enum text | One of: `GameStarted`, `LifeAdjusted`, `TurnAdvanced`, `UndoTurn`, `GameEnded` |
| `timestamp` | epoch milliseconds (number) | When the event occurred (via `Date.now()` or `performance.now()`), in milliseconds since epoch |
| `details` | object | Event-specific information. Structure varies by `eventType` (see below). |

### Event Type Schemas

**GameStarted**:
```javascript
{
  eventType: 'GameStarted',
  timestamp: <epoch>,
  details: {
    teamA: { members: ['Gabe', 'Phil'] },
    teamB: { members: ['Tung', 'Siu'] },
    firstPlayerTeamId: 'a',
    firstPlayerSelectionMethod: 'team-size-fairness'
  }
}
```

**LifeAdjusted**:
```javascript
{
  eventType: 'LifeAdjusted',
  timestamp: <epoch>,
  details: {
    teamId: 'a',
    delta: 5,
    oldValue: 40,
    newValue: 45
  }
}
```

**TurnAdvanced**:
```javascript
{
  eventType: 'TurnAdvanced',
  timestamp: <epoch>,
  details: {
    oldActiveTeamId: 'a',
    newActiveTeamId: 'b',
    oldTurnNumber: 1,
    newTurnNumber: 1  // or 2 if transitioning back to first player
  }
}
```

**UndoTurn**:
```javascript
{
  eventType: 'UndoTurn',
  timestamp: <epoch>,
  details: {
    revertedTurnNumber: 2,
    restoredActiveTeamId: 'a',
    undoHistoryDepth: 3  // number of prior states remaining
  }
}
```

**GameEnded**:
```javascript
{
  eventType: 'GameEnded',
  timestamp: <epoch>,
  details: {
    winnerTeamId: 'a',
    winningTurnNumber: 5,
    finalLifeTotals: { a: 42, b: -3 },
    teamAElapsedMs: 225000,  // 3:45
    teamBElapsedMs: 150000   // 2:30
  }
}
```

### Audit Log Transitions

- **Initialize** (at game start): Empty array `[]`
- **Record Event** (on action): Push new event object with current timestamp
- **Undo**: Append new `UndoTurn` event to log (do not remove events from log during undo)
- **Persist** (on game completion): Include entire audit log in Completed Game record
- **Recover** (on page reload): Restore audit log with Active Game from localStorage

---

## Completed Game Extensions

The Completed Game entity from Feature 001 is extended with timer and audit log data.

| Field | Type | Rules | New in Feature 004 |
| --- | --- | --- | --- |
| `id` | unique text | Stable identifier for the saved result | No |
| `teams` | two Team records | Snapshot of the active game's team compositions | No |
| `winnerTeamId` | team identifier | Must identify one of the two saved teams | No |
| `winningTurnNumber` | positive integer | Snapshot of the shared turn number when confirmed | No |
| `finalLifeTotals` | mapping by team id to integer | Snapshot; values may be negative or above 40 | No |
| `completedAt` | timestamp text | Local completion time for ordering/display | No |
| `teamTimers` | mapping by team id to milliseconds | Final elapsed time for each team in milliseconds (e.g., `{ a: 225000, b: 150000 }`) | **NEW** |
| `auditLog` | ordered list of event objects | Complete audit log from the completed game (optional; see assumptions) | **NEW** |

### Completed Game Display (Between-Games View)

The between-games view displays completed games with the following information:

- Game date/time (from `completedAt`)
- Team A name and members
- Team B name and members
- Winner (highlighted or marked)
- Winning turn number
- Final life totals for both teams
- Elapsed time for each team (formatted as `H:MM:SS` or `MM:SS`)

Sortable dimensions:
- By date (ascending/descending)
- By player name (A–Z, Z–A)
- By team name (A–Z, Z–A)
- By winner (ascending/descending)
- By turn number (ascending/descending)
- By player win count (ascending/descending)
- By player participation (ascending/descending)

---

## CSV Export Schema

The exported CSV file contains one row per completed game with the following columns:

| Column | Content | Example |
| --- | --- | --- |
| `Date` | ISO 8601 timestamp | `2026-08-30T15:23:45Z` |
| `Team A Members` | Comma-separated player names in Team A | `Gabe, Phil` |
| `Team B Members` | Comma-separated player names in Team B | `Tung, Siu` |
| `Winner` | Winning team identifier (Team A or Team B) | `Team A` |
| `Final Turn` | Turn number at game end | `5` |
| `Team A Final Life` | Final life total for Team A | `42` |
| `Team B Final Life` | Final life total for Team B | `-3` |
| `Team A Elapsed Time` | Formatted elapsed time for Team A | `3:45` or `1:23:45` |
| `Team B Elapsed Time` | Formatted elapsed time for Team B | `2:30` or `0:45:22` |

### CSV Encoding and Formatting

- Character encoding: UTF-8
- Line terminator: LF (`\n`)
- Field delimiter: comma (`,`)
- Text qualifier: double quote (`"`) for fields containing commas or quotes
- Escape quotes: Double-quote escaping (`"` becomes `""`)
- No BOM (Byte Order Mark)
- Header row included
- Data rows in newest-first order (matching between-games view default)

---

## Browser Local Storage Schema

The persisted client state contains:

| Key | Type | Content |
| --- | --- | --- |
| `magic-circle-state-v1` | JSON string | Envelope containing `activeGame`, `completedGames`, `schemaVersion` |
| `sound-enabled` | boolean string | User preference: `"true"` or `"false"` (default: `"true"`) |
| `sort-preference` | string | User's selected sort dimension; values like `player-name-asc`, `win-count-desc`, or default if not set |

The `magic-circle-state-v1` envelope structure:
```javascript
{
  activeGame: { /* Active Game with new fields */ },
  completedGames: [ /* array of Completed Game */ ],
  schemaVersion: 1
}
```

### Storage Validation

Invalid or unreadable persisted data must be ignored without inventing a result. The app must:
- Continue in between-games mode if storage is unreadable
- Provide a clear warning to the user if it cannot restore state
- Allow new games to proceed even if recovery failed

---

## Summary of Changes

Feature 004 introduces three major data model additions:

1. **Undo/Redo History**: Enables turn recovery via state snapshots
2. **Team Timers**: Tracks elapsed time per team with millisecond precision
3. **Audit Log**: Records all significant gameplay events for transparency and post-game review

All existing data structures remain backward-compatible. The schema version remains `1` (no migration required for existing completed games). New games created in Feature 004 will include the new fields; old games lack timer and audit log data but remain readable and displayable.

