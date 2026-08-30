# Contract: Audit Log Event Schema

**Feature**: [spec.md](../spec.md) | **Version**: 1.0 | **Date**: 2026-08-30

This contract defines the structure and semantics of audit log events recorded during gameplay.

---

## Overview

Audit log events are immutable records of significant gameplay actions. Each event includes a timestamp, event type, and type-specific details. Events are recorded chronologically in the order they occur.

---

## Event Type: GameStarted

Recorded once at the beginning of a game when teams are confirmed and first player is selected.

### Schema

```json
{
  "eventType": "GameStarted",
  "timestamp": 1693398000000,
  "details": {
    "teamA": {
      "members": ["Gabe", "Phil"]
    },
    "teamB": {
      "members": ["Tung", "Siu"]
    },
    "firstPlayerTeamId": "a",
    "firstPlayerSelectionMethod": "team-size-fairness"
  }
}
```

### Field Specifications

- **eventType**: Literal string `"GameStarted"`
- **timestamp**: Epoch milliseconds (via `Date.now()`) when game creation was confirmed
- **details.teamA.members**: Array of player names assigned to Team A
- **details.teamB.members**: Array of player names assigned to Team B
- **details.firstPlayerTeamId**: String "a" or "b", the selected first player
- **details.firstPlayerSelectionMethod**: Enum `"random"`, `"team-size-fairness"`, or `"fallback-random"`

---

## Event Type: LifeAdjusted

Recorded each time a team's life total is incremented or decremented by a button press.

### Schema

```json
{
  "eventType": "LifeAdjusted",
  "timestamp": 1693398005000,
  "details": {
    "teamId": "a",
    "delta": 5,
    "oldValue": 40,
    "newValue": 45
  }
}
```

### Field Specifications

- **eventType**: Literal string `"LifeAdjusted"`
- **timestamp**: Epoch milliseconds when the button was pressed
- **details.teamId**: String "a" or "b", the team whose life was adjusted
- **details.delta**: Integer, the amount added (+5, +1, -1, -5); may be any integer value
- **details.oldValue**: Integer, the life total before adjustment
- **details.newValue**: Integer, the life total after adjustment (= oldValue + delta)

### Constraints

- `oldValue + delta === newValue` (validation rule)
- `delta` may be any non-zero integer (typically ±1 or ±5)

---

## Event Type: TurnAdvanced

Recorded each time a turn is advanced (next-turn button pressed).

### Schema

```json
{
  "eventType": "TurnAdvanced",
  "timestamp": 1693398010000,
  "details": {
    "oldActiveTeamId": "a",
    "newActiveTeamId": "b",
    "oldTurnNumber": 1,
    "newTurnNumber": 1
  }
}
```

### Field Specifications

- **eventType**: Literal string `"TurnAdvanced"`
- **timestamp**: Epoch milliseconds when the next-turn button was pressed
- **details.oldActiveTeamId**: String "a" or "b", the team that was active before the advance
- **details.newActiveTeamId**: String "a" or "b", the team that becomes active
- **details.oldTurnNumber**: Positive integer, the turn number before the advance
- **details.newTurnNumber**: Positive integer, the turn number after the advance (= oldTurnNumber or oldTurnNumber + 1)

### Constraints

- `oldActiveTeamId ≠ newActiveTeamId` (turns alternate between teams)
- `newTurnNumber ∈ {oldTurnNumber, oldTurnNumber + 1}` (turn increments only when first player returns)
- If `newActiveTeamId === firstPlayerTeamId`, then `newTurnNumber === oldTurnNumber + 1`; otherwise `newTurnNumber === oldTurnNumber`

---

## Event Type: UndoTurn

Recorded each time an undo action is performed to revert a prior turn advance.

### Schema

```json
{
  "eventType": "UndoTurn",
  "timestamp": 1693398015000,
  "details": {
    "revertedTurnNumber": 2,
    "restoredActiveTeamId": "a",
    "undoHistoryDepth": 3
  }
}
```

### Field Specifications

- **eventType**: Literal string `"UndoTurn"`
- **timestamp**: Epoch milliseconds when the undo button was pressed
- **details.revertedTurnNumber**: Positive integer, the turn number that was reverted to
- **details.restoredActiveTeamId**: String "a" or "b", the active team after undo
- **details.undoHistoryDepth**: Non-negative integer, the number of prior states remaining in the undo stack after this undo

### Constraints

- `undoHistoryDepth ≥ 0` (may be 0 if this was the only undo available)
- Undo events are appended to the log; they do not delete prior events (the log remains a complete record)

---

## Event Type: GameEnded

Recorded once when a game is completed and a winner is declared.

### Schema

```json
{
  "eventType": "GameEnded",
  "timestamp": 1693398020000,
  "details": {
    "winnerTeamId": "a",
    "winningTurnNumber": 5,
    "finalLifeTotals": {
      "a": 42,
      "b": -3
    },
    "teamAElapsedMs": 225000,
    "teamBElapsedMs": 150000
  }
}
```

### Field Specifications

- **eventType**: Literal string `"GameEnded"`
- **timestamp**: Epoch milliseconds when the game-end confirmation was recorded
- **details.winnerTeamId**: String "a" or "b", the winning team
- **details.winningTurnNumber**: Positive integer, the turn number at which the winner was declared
- **details.finalLifeTotals**: Object with keys "a" and "b", mapping to final integer life totals (may be negative or > 40)
- **details.teamAElapsedMs**: Non-negative integer, Team A's elapsed time in milliseconds
- **details.teamBElapsedMs**: Non-negative integer, Team B's elapsed time in milliseconds

### Constraints

- `winnerTeamId ∈ {"a", "b"}`
- `finalLifeTotals["a"]` and `finalLifeTotals["b"]` may be any integer
- Both elapsed times must be non-negative integers

---

## Common Constraints and Semantics

### Timestamp Rules

- Timestamps are epoch milliseconds (since 1970-01-01 00:00:00 UTC)
- Generated via `Date.now()` at the moment of event occurrence
- Must be non-negative integers
- Chronologically ordered in the audit log (older events first)

### Data Privacy

**Sensitive data MUST NOT be recorded**:
- Device identifiers (UDID, device name, MAC address)
- Network information (IP address, WiFi SSID)
- User location or geolocation
- Browser fingerprint or identifying cookies
- Any personally identifiable information beyond player names

**Allowed**:
- Player names (from fixed pool in spec)
- Team compositions (derived from player names)
- Game state (life totals, turn numbers, timers)
- Gameplay actions (life adjustments, turn advances, undo, game end)
- Timestamps

### Event Recording Completeness

All significant gameplay actions MUST be recorded:
1. **GameStarted**: One event per game, at start
2. **LifeAdjusted**: One event per life-button press
3. **TurnAdvanced**: One event per next-turn press
4. **UndoTurn**: One event per undo press
5. **GameEnded**: One event per game, at end

Missing events indicate a bug in the implementation. Post-game validation can verify completeness by checking that event timestamps are monotonically increasing and that action counts match expected gameplay.

---

## Event Storage and Retrieval

### In-Memory Audit Log

During active gameplay, events are stored in an array within the Active Game state:

```javascript
activeGame.auditLog = [
  { eventType: "GameStarted", ... },
  { eventType: "LifeAdjusted", ... },
  { eventType: "TurnAdvanced", ... },
  // ... additional events in chronological order
]
```

### Persistence

When a game is completed:
1. The audit log is copied as-is into the Completed Game record
2. Serialized to JSON in local storage
3. Can be retrieved for post-game review or CSV export

### Display to User

The audit log viewer (in-game modal/sidebar) displays events in chronological order with:
- Timestamp (human-readable: "15:23:45", "3:15:22 PM", etc.)
- Event type and summary (e.g., "Gabe's Team: Life +5 → 45")
- Relevant details (e.g., turn number, active team, timer states)

Example display:
```
[15:23:00] Game started: Gabe & Phil vs. Tung & Siu (Gabe's team first)
[15:23:05] Gabe's team: Life +5 → 45
[15:23:10] Turn advanced (Tung's team active, Turn 1)
[15:23:15] Tung's team: Life -1 → 39
[15:23:20] Turn advanced (Gabe's team active, Turn 2)
[15:23:30] Undo last turn
[15:23:32] Turn advanced (Gabe's team active, Turn 2)
[15:24:00] Game ended: Gabe's team wins on Turn 5
```

---

## Validation and Error Handling

### Invalid Events

If an event record is malformed during deserialization:
- Log a warning (in browser console)
- Skip the invalid event
- Continue loading remaining events
- Display a user notice that audit log may be incomplete

### No Truncation

Audit logs are never truncated or pruned during gameplay or on export. If storage limits are approached, warn the user but continue recording events. Future versions may implement size limits.

---

## Reserved Fields and Extension Points

Future versions may add fields to event details. Consumers must:
- Ignore unknown fields during deserialization
- Preserve unknown fields during round-trip serialization
- Handle new event types gracefully (display as unknown event if handler not available)

This ensures forward compatibility if Feature 005 or later add new event types.

